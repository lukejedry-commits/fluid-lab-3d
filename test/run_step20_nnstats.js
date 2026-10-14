'use strict';
/** Step 20 (B), INFO ONLY: t=0 nearest-neighbour distance distribution of the frozen seeds (no run, no trigger change).
 *  Seeds, built exactly as the graded runners do:
 *  - C3.separation: N=32, h=0.5/32, seedBlock(0,32,0,32,0,32), seed 3232, jitter 0.5 (run_step15 tankRun)
 *  - C3.tilted_tank: same lattice and jitter, sub-cells kept below z = H + 0.05 (x - L/2) (run_step15 tankRun)
 *  - T3/T4 a=16 and a=8: lib_t3 runT3, seed 1952, Sim default jitter 0.1, seedBlock(0,A,0,A,0,2A)
 *  Quantile = nearest-rank: q-quantile = sorted[ceil(q n) - 1]. Push-out trigger = separate(): pairs with d < sepFrac * s = 0.25 h. */
const fs = require('fs'), path = require('path'); const { Sim } = require('../src/sim');
const outDir = path.join(__dirname, '../results', process.argv[process.argv.indexOf('--out') + 1]); fs.mkdirSync(outDir, { recursive: true });
const write = (n, d) => { const f = path.join(outDir, n); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 1)); };
function nn(s) { const n = s.count, X = s.x, h = s.h, g = [s.nx, s.ny, s.nz], cell = new Int32Array(n), start = new Int32Array(s.nCells + 1), ids = new Int32Array(n);
  for (let p = 0; p < n; p++) { const c = [0, 1, 2].map((b) => Math.min(g[b] - 1, Math.max(0, Math.floor(X[3 * p + b] / h)))); cell[p] = c[0] + g[0] * (c[1] + g[1] * c[2]); start[cell[p]]++; }
  let a = 0; for (let c = 0; c < s.nCells; c++) { a += start[c]; start[c] = a; } start[s.nCells] = a; for (let p = 0; p < n; p++) ids[--start[cell[p]]] = p;
  const D = new Float64Array(n);
  for (let p = 0; p < n; p++) { const c = cell[p], ci = c % g[0], cj = ((c / g[0]) | 0) % g[1], ck = (c / (g[0] * g[1])) | 0; let best = Infinity;
    for (let k = Math.max(0, ck - 1); k <= Math.min(g[2] - 1, ck + 1); k++) for (let j = Math.max(0, cj - 1); j <= Math.min(g[1] - 1, cj + 1); j++) for (let i = Math.max(0, ci - 1); i <= Math.min(g[0] - 1, ci + 1); i++) {
      const cc = i + g[0] * (j + g[1] * k); for (let t = start[cc]; t < start[cc + 1]; t++) { const q = ids[t]; if (q === p) continue; let d2 = 0; for (let b = 0; b < 3; b++) d2 += (X[3 * q + b] - X[3 * p + b]) ** 2; if (d2 < best) best = d2; } }
    if (!(best < h * h)) throw new Error('nearest neighbour not within one cell'); D[p] = Math.sqrt(best); }
  return D; }
function wallClear(s) { let n = 0; for (let p = 0; p < s.count; p++) for (let b = 0; b < 3; b++) { const x = s.x[3 * p + b]; if (x <= s.pr || x >= s.L[b] - s.pr) { n++; break; } } return n; }
const seeds = {
  'C3.separation (FROZEN seed: 3232, jitter 0.5)': () => { const N = 32, s = new Sim({ nx: N, ny: N, nz: 40, h: 0.5 / N, seed: 3232, maxSub: 16, jitter: 0.5 }); s.seedBlock(0, N, 0, N, 0, N); return s; },
  'C3.tilted_tank (seed 3232, jitter 0.5)': () => { const N = 32, H = 0.5, h = H / N, L = N * h, nz = 40, s = new Sim({ nx: N, ny: N, nz, h, seed: 3232, maxSub: 16, jitter: 0.5 }), sp = h / 2, J = 0.5 * sp;
    for (let k = 0; k < nz; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) for (let c = 0; c < 8; c++) { const ox = (c & 1) + 0.5, oy = ((c >> 1) & 1) + 0.5, oz = ((c >> 2) & 1) + 0.5, X = (i + ox / 2) * h, Y = (j + oy / 2) * h, Z = (k + oz / 2) * h;
      if (Z >= H + 0.05 * (X - L / 2)) continue; s.addParticle(s.seedClamp(X + J * (2 * s.rand() - 1), 0), s.seedClamp(Y + J * (2 * s.rand() - 1), 1), s.seedClamp(Z + J * (2 * s.rand() - 1), 2)); } return s; },
  'T3/T4 a=16 (seed 1952, jitter 0.1)': () => { const A = 16, a = 2.25 * 0.0254, h = a / A, s = new Sim({ nx: 16 * A, ny: A, nz: Math.round(2.5 * A), h, seed: 1952 }); s.seedBlock(0, A, 0, A, 0, 2 * A); return s; },
  'T3/T4 a=8 (seed 1952, jitter 0.1)': () => { const A = 8, a = 2.25 * 0.0254, h = a / A, s = new Sim({ nx: 16 * A, ny: A, nz: Math.round(2.5 * A), h, seed: 1952 }); s.seedBlock(0, A, 0, A, 0, 2 * A); return s; } };
const Q = [0.0001, 0.001, 0.01, 0.05, 0.5], R = {};
for (const [name, mk] of Object.entries(seeds)) { const s = mk(), D = nn(s).sort(), n = D.length, h = s.h, trig = s.sepFrac * s.s, q = (p) => D[Math.ceil(p * n) - 1];
  let below = 0; while (below < n && D[below] < trig) below++;
  const r = { particles: n, h, jitter: s.jitter, trigger: trig, triggerOverH: trig / h, belowTrigger: below, fracBelowTrigger: below / n, min: D[0], minOverH: D[0] / h,
    quantiles: Object.fromEntries(Q.map((p) => [p, { value: q(p), overH: q(p) / h, below: D.findIndex((x) => x >= q(p)) }])), wallClearanceParticles: wallClear(s), pr: s.pr };
  R[name] = r; }
write('nn_stats.json', R);
const f = (x) => x.toExponential(4), g4 = (x) => x.toFixed(4);
let md = '# Step 20 (B): t=0 nearest-neighbour distances (INFO ONLY; no run, trigger unchanged)\n\nCurrent push-out trigger: separate() pushes pairs with d < sepFrac * s = 0.5 * (h/2) = **0.25 h**. The wall clamp (wallStrip) is separate: clearance pr = 0.125 h.\nQuantiles use nearest rank: q-quantile = sorted[ceil(q n) - 1]. "particles with NN < q-quantile" counts strictly below.\n\n| seed | particles | h (m) | trigger (m, /h) | NN < trigger (count, fraction) | min NN (/h) | 0.01% | **0.1%** | 1% | 5% | median |\n|---|---|---|---|---|---|---|---|---|---|---|\n';
for (const [k, r] of Object.entries(R)) { const c = (p) => `${f(r.quantiles[p].value)} m (${g4(r.quantiles[p].overH)} h)`;
  md += `| ${k} | ${r.particles} | ${f(r.h)} | ${f(r.trigger)} (${r.triggerOverH} h) | ${r.belowTrigger} (${(100 * r.fracBelowTrigger).toFixed(3)}%) | ${g4(r.minOverH)} | ${c(0.0001)} | **${c(0.001)}** | ${c(0.01)} | ${c(0.05)} | ${c(0.5)} |\n`; }
md += '\nThe d_trig candidate per Z 2026-10-14n is the frozen C3.separation 0.1% quantile. Particles strictly below it: ' + R[Object.keys(R)[0]].quantiles[0.001].below + ' of ' + R[Object.keys(R)[0]].particles + '.\n';
write('results.md', md); console.log(md);
