'use strict';
/** Step 17 (ASSERTS d234870b): C3.separation theta spread + jitter control, INFO ONLY, no solver change.
 *  Setup = run_step15 tankRun('C3.separation'): N=32, H=0.5, 32x32x40, seed 3232, cap 16, 120 frames, alpha 0.1, jitter --jitter (default 0.5).
 *  Per step: total E, max|u|, stage dE, gravity+pressure net. At frames 0,1,2,5,10,20,30,60,90,120: theta on every top fluid->air z-face
 *  (sim.thetaOf, same as the solve), per column top fluid k, interface height z_s = (k_top + 1/2 + theta) h, particle-count height.
 *  node test/run_step17_septheta.js --jitter 0.5 --seed 3232 --tag jit0.5 --out step17_sep_theta */
const fs = require('fs'), path = require('path');
const { Sim } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const outDir = path.join(__dirname, '../results', arg('--out')); fs.mkdirSync(outDir, { recursive: true });
const tag = arg('--tag'), jitter = +arg('--jitter', '0.5'), seed = +arg('--seed', '3232');
const write = (n, d) => { const f = path.join(outDir, n); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 1)); };
const N = 32, H = 0.5, h = H / N, nz = Math.round(1.25 * N), g = 9.81;
const s = new Sim({ nx: N, ny: N, nz, h, seed, maxSub: 16, jitter, densFix: !process.argv.includes('--densoff') }); s.seedBlock(0, N, 0, N, 0, N); // --densoff: info-only isolation control
const stat = (a) => { const m = a.reduce((x, y) => x + y, 0) / a.length; return { min: Math.min(...a), max: Math.max(...a), mean: m, std: Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length), n: a.length }; };
function thetaSnap(fr) {
  const cnt = s.markCells(), FL = s.classify(cnt), th = [], zs = [], kt = [], hp = [], NN = N * N;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let top = -1, np = 0;
    for (let k = 0; k < nz; k++) { const c = i + N * j + NN * k; np += cnt[c]; if (FL[c]) top = k; }
    hp.push(np * h / 8); if (top < 0 || top + 1 >= nz) continue; const c = i + N * j + NN * top, a = c + NN;
    if (FL[a]) continue; const t = s.thetaOf(cnt, c, a); th.push(t); kt.push(top); zs.push((top + 0.5 + t) * h); }
  // all fluid->air faces in any direction (incl. side faces of surface steps)
  const all = []; for (let c = 0; c < s.nCells; c++) if (FL[c]) { const k = (c / NN) | 0, j = ((c % NN) / N) | 0, i = c % N;
    for (const [d, ok] of [[1, i + 1 < N], [-1, i > 0], [N, j + 1 < N], [-N, j > 0], [NN, k + 1 < nz], [-NN, k > 0]]) if (ok && !FL[c + d]) all.push(s.thetaOf(cnt, c, c + d)); }
  const kh = {}; for (const k of kt) kh[k] = (kh[k] || 0) + 1;
  return { frame: fr, t: s.t, theta: stat(th), thetaHist: th.reduce((o, x) => ((o[x.toFixed(3)] = (o[x.toFixed(3)] || 0) + 1), o), {}), thetaAllFaces: all.length ? stat(all) : null,
    topK: kh, zs: stat(zs), hParticles: stat(hp), zsCols: zs };
}
const e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, L = [], T = [], snapAt = new Set([0, 1, 2, 5, 10, 20, 30, 60, 90, 120]);
s.onSubstep = (sim, rec) => L.push({ step: rec.step, t: rec.t, E: rec.E, rise: (rec.E - E0) / Math.abs(E0), maxU: rec.maxU, gp: rec.stage.gravity + rec.stage.pressure, stage: rec.stage });
T.push(thetaSnap(0));
for (let f = 1; f <= 120; f++) { s.advanceFrame(); if (snapAt.has(f)) T.push(thetaSnap(f)); }
const sums = {}; for (const r of L) for (const [k, v] of Object.entries(r.stage)) sums[k] = (sums[k] || 0) + v;
const out = { tag, jitter, seed, E0, count: s.count, steps: L.length, maxRise: Math.max(...L.map((r) => r.rise)), maxUEnd: L.at(-1).maxU, maxUMax: Math.max(...L.map((r) => r.maxU)),
  gp: stat(L.map((r) => r.gp)), sums, uLimit: 1e-3 * Math.sqrt(g * H), theta: T.map(({ zsCols, ...r }) => r) };
write(`${tag}_steps.json`, L); write(`${tag}_theta.json`, T); write(`${tag}_summary.json`, out);
console.log(JSON.stringify({ ...out, theta: out.theta.map((r) => ({ f: r.frame, th: r.theta, all: r.thetaAllFaces, topK: r.topK, zs: r.zs, hp: r.hParticles })) }));
