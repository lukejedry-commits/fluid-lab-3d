'use strict';
/** Step 16 (ASSERTS d234870b, Z 2026-10-14k): C3.separation diagnosis, INFO ONLY, instrumentation only (no solver change).
 *  Same setup as run_step15.js tankRun('C3.separation'): N=32, H=0.5 m, 32x32x40, seed 3232, jitter 0.5, cap 16, 120 frames, alpha 0.1.
 *  Per step: (a) cells flipping fluid<->air in project()'s classification vs the previous step (count, k-levels, near surface);
 *  (b) pressure-stage dE in face-mass weighting (= logged stage) and theta weighting (lib_t3.instrumentProject), plus the gravity
 *  stage; (c) all stage energies. node test/run_step16_sepdiag.js --out step16_sep_diag */
const fs = require('fs'), path = require('path');
const { Sim } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const outDir = path.join(__dirname, '../results', arg('--out')); fs.mkdirSync(outDir, { recursive: true });
const write = (n, d) => { const f = path.join(outDir, n); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 1)); };
const lib = require('./lib_t3')({ row: () => {}, info: () => {}, write: () => {} });
const fmt = (x) => x.toExponential(3);
const N = 32, H = 0.5, h = H / N, nz = Math.round(1.25 * N);
const s = new Sim({ nx: N, ny: N, nz, h, seed: 3232, maxSub: 16, jitter: 0.5 }); s.seedBlock(0, N, 0, N, 0, N);
lib.instrumentProject(s);
let prevFL = null, flip = null;
{ const op = s.project.bind(s); s.project = (dt) => { const r = op(dt); const FL = Uint8Array.from(s.fluid); const ch = [];
    if (prevFL) for (let c = 0; c < FL.length; c++) if (FL[c] !== prevFL[c]) ch.push({ c, k: (c / (N * N)) | 0, to: FL[c] ? 'fluid' : 'air', n: s.cellCount[c] });
    let top = 0; for (let c = 0; c < FL.length; c++) if (FL[c]) top = Math.max(top, (c / (N * N)) | 0);
    flip = { n: ch.length, toFluid: ch.filter((x) => x.to === 'fluid').length, toAir: ch.filter((x) => x.to === 'air').length, ks: [...new Set(ch.map((x) => x.k))].sort((a, b) => a - b), topFluidK: top, cells: ch.slice(0, 12) };
    prevFL = FL; return r; }; }
const e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, L = [];
s.onSubstep = (sim, rec) => { const d = sim._pdiag; L.push({ step: rec.step, t: rec.t, E: rec.E, rise: (rec.E - E0) / Math.abs(E0), maxU: rec.maxU, stage: rec.stage, gp: rec.stage.gravity + rec.stage.pressure,
  pMass: d.dMass, pTheta: d.dTheta, pThetaNoWall: d.dThetaNoWall, pCls: d.cls, flip }); };
for (let f = 1; f <= 120; f++) { s.advanceFrame(); if (f % 20 === 0) console.log(`frame ${f}`); }
write('sep_diag_steps.json', L);
// analysis
const byGP = [...L].sort((a, b) => b.gp - a.gp), jump = L.filter((r) => r.gp > 5e-4);
const du = L.map((r, i) => ({ r, d: i ? r.maxU - L[i - 1].maxU : 0 })).sort((a, b) => b.d - a.d).slice(0, 10);
const flipSteps = L.filter((r) => r.flip && r.flip.n > 0), noFlip = L.filter((r) => r.flip && r.flip.n === 0);
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
let md = `# Step 16: C3.separation diagnosis (INFO ONLY; code 1e6089c fix 3 v6, alpha 0.1; ASSERTS d234870b)\n\n- ${L.length} steps over 2 s; E0 = ${fmt(E0)} J; max rise ${fmt(Math.max(...L.map((r) => r.rise)))} |E0|; max|u| at 2 s ${fmt(L.at(-1).maxU)} m/s\n`;
md += `- Steps with any fluid<->air flip: ${flipSteps.length} of ${L.length - 1}; flips per step mean ${mean(flipSteps.map((r) => r.flip.n)).toFixed(2)}, max ${Math.max(...L.map((r) => r.flip ? r.flip.n : 0))}; flip k-levels seen: ${[...new Set(flipSteps.flatMap((r) => r.flip.ks))].sort((a, b) => a - b).join(',')} (top fluid layer k=${L.at(-1).flip.topFluidK})\n`;
md += `- Pressure stage, face-mass weighting (logged): steps > 0: ${L.filter((r) => r.pMass > 0).length}; theta weighting: steps > 0: ${L.filter((r) => r.pTheta > 0).length} (max ${fmt(Math.max(...L.map((r) => r.pTheta)))} J), theta excl. wall faces > 0: ${L.filter((r) => r.pThetaNoWall > 0).length}\n`;
md += `- Steps with gravity+pressure > 5e-4 J ("jumps"): ${jump.length}; of these with a flip at that step: ${jump.filter((r) => r.flip && r.flip.n).length}\n`;
md += `- mean gravity+pressure on flip steps ${fmt(mean(flipSteps.map((r) => r.gp)))} J vs no-flip steps ${fmt(mean(noFlip.map((r) => r.gp)))} J\n\n`;
md += '## Top 12 steps by gravity+pressure dE\n\n| step | t (s) | gravity | pressure (face-mass) | pressure (theta) | g+p | flips (to fluid/to air; k) | d max|u| | g2p | p2g |\n|---|---|---|---|---|---|---|---|---|---|\n';
for (const r of byGP.slice(0, 12)) { const i = L.indexOf(r), dU = i ? r.maxU - L[i - 1].maxU : 0;
  md += `| ${r.step} | ${r.t.toFixed(4)} | ${fmt(r.stage.gravity)} | ${fmt(r.pMass)} | ${fmt(r.pTheta)} | ${fmt(r.gp)} | ${r.flip ? `${r.flip.n} (${r.flip.toFluid}/${r.flip.toAir}; ${r.flip.ks.join(',')})` : '-'} | ${fmt(dU)} | ${fmt(r.stage.g2p)} | ${fmt(r.stage.p2g)} |\n`; }
md += '\n## Top 10 per-step max|u| jumps\n\n| step | d max|u| | g+p | pressure (theta) | flips |\n|---|---|---|---|---|\n';
for (const { r, d } of du) md += `| ${r.step} | ${fmt(d)} | ${fmt(r.gp)} | ${fmt(r.pTheta)} | ${r.flip ? r.flip.n : '-'} |\n`;
const cum = L.at(-1).stage; md += '\n## Stage sums over the run (J)\n\n' + Object.keys(cum).map((k) => `${k} ${fmt(L.reduce((a, r) => a + r.stage[k], 0))}`).join('; ') + '\n';
write('results.md', md); console.log(md);
