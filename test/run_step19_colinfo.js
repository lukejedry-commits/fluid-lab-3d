'use strict';
/** Step 19 Phase A INFO ONLY (not in the solver): column-integral variant of the splat measure, theta = sum_k nbar(i,j,k)/8 - (k_c + 1/2)
 *  (whole-column splat sum, vertical faces only), to show which part of the bias is vertical truncation and which is lateral mixing. */
const fs = require('fs'), path = require('path'); const { Sim } = require('../src/sim');
const out = path.join(__dirname, '../results/step19_smooth_theta/colinfo.json'); if (fs.existsSync(out)) throw new Error('refusing to overwrite');
const SL = (sl) => [((sl & 1) + 0.5) / 2, (((sl >> 1) & 1) + 0.5) / 2], R = [];
function colTheta(s) { const F = s.splatCounts(), cnt = s.markCells(), FL = s.classify(cnt), { nx, ny, nz } = s, d = [], dc = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { let top = -1, S = 0; for (let k = 0; k < nz; k++) { const c = i + nx * (j + ny * k); S += F[c] / 8; if (FL[c]) top = k; }
    const c = i + nx * (j + ny * top); d.push(S - (top + 0.5)); s.thetaMode = 'count'; dc.push(s.thetaRaw(cnt, c, c + nx * ny)); }
  return { maxDiffVsCount: Math.max(...d.map((x, q) => Math.abs(x - dc[q]))), raw: [Math.min(...d), Math.max(...d)] }; }
for (const N of [8, 16, 32, 64]) { const L = 0.5, Hb = 0.1625, h = L / N, kFull = Math.floor(Hb / h + 1e-12), q = Hb / h - kFull, nz = Math.ceil(1.5 * Hb / h) + 2;
  const s = new Sim({ nx: N, ny: N, nz, h, seed: 7000 + N, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, kFull); const nTop = Math.round(8 * q);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const sl = [0, 1, 2, 3]; for (let a = 3; a > 0; a--) { const b = Math.floor(s.rand() * (a + 1)); [sl[a], sl[b]] = [sl[b], sl[a]]; }
    for (let n = 0; n < nTop; n++) { const [ox, oy] = SL(sl[n % 4]); s.addParticle((i + ox) * h, (j + oy) * h, (kFull + q * (n < 4 ? 0.25 : 0.75)) * h); } }
  R.push({ case: 'T1b lattice', N, ...colTheta(s) }); }
const PAT = { 2: [[0, 0.125], [3, 0.125]], 4: [[0, 0.25], [1, 0.25], [2, 0.25], [3, 0.25]], 6: [[0, 0.25], [1, 0.25], [2, 0.25], [3, 0.25], [0, 0.625], [3, 0.625]] };
for (const f of [0.25, 0.5, 0.75]) for (const N of [8, 32]) { const h = 0.5 / N, K = N / 2, s = new Sim({ nx: N, ny: N, nz: N, h, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, K);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) for (const [sl, oz] of PAT[8 * f]) { const [ox, oy] = SL(sl); s.addParticle((i + ox) * h, (j + oy) * h, (K + oz) * h); }
  R.push({ case: `flat f=${f} lattice placement`, N, ...colTheta(s) }); }
fs.writeFileSync(out, JSON.stringify(R, null, 1)); for (const r of R) console.log(r.case, r.N, r.maxDiffVsCount.toExponential(3), r.raw.map((x) => x.toFixed(6)).join('..'));
