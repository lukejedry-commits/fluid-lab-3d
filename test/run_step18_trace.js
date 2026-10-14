'use strict';
/** Step 18 (ASSERTS d234870b): C3.separation step 1-2 trace, INFO ONLY, instrumentation by method wrapping (no solver change).
 *  Setup = tankRun('C3.separation'): N=32, H=0.5, 32x32x40, seed 3232, cap 16; --jitter 0.5|0; --zeroC: set all particle C = 0 once after step 1 (pure-PIC P2G in step 2, control).
 *  Logs per step: grid after P2G / after pressure / after extension (fluid-adjacent faces = project()'s valid set, vs air faces), particles after G2P (max|u|, KE, C Frobenius), particles at step end.
 *  node test/run_step18_trace.js --jitter 0.5 --tag jit0.5 --out step18_step12_trace [--zeroC] */
const fs = require('fs'), path = require('path');
const { Sim } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const outDir = path.join(__dirname, '../results', arg('--out')); fs.mkdirSync(outDir, { recursive: true });
const tag = arg('--tag'), jitter = +arg('--jitter', '0.5'), zeroC = process.argv.includes('--zeroC'), nSteps = +arg('--steps', '2');
const write = (n, d) => { const f = path.join(outDir, n); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 1)); };
const N = 32, H = 0.5, h = H / N, nz = Math.round(1.25 * N), NN = N * N;
const s = new Sim({ nx: N, ny: N, nz, h, seed: 3232, maxSub: 16, jitter }); s.seedBlock(0, N, 0, N, 0, N);
const AX = 'xyz';
// face classes from cell classification FL: 'fluid' = at least one adjacent fluid cell (project's valid set), 'air' = other in-box faces
function gridStats(FL) {
  const out = { fluid: { max: 0, at: null, ke: 0, n: 0 }, air: { max: 0, at: null, ke: 0, n: 0 }, topRowFluid: { max: 0, at: null } };
  for (let a = 0; a < 3; a++) { const D = s.D[a], V = s.vel[a], M = s.mass[a], cs = [1, N, NN];
    for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) { const f = s.idx(a, i, j, k), ii = [i, j, k];
      const wall = ii[a] === 0 || ii[a] === [N, N, nz][a]; if (wall) continue;
      const hi = i + N * (j + N * k), lo = hi - cs[a], isF = FL[hi] || FL[lo], cls = isF ? 'fluid' : 'air', o = out[cls], v = Math.abs(V[f]);
      o.n++; o.ke += 0.5 * M[f] * V[f] * V[f]; if (v > o.max) { o.max = v; o.at = `${AX[a]}-face (${i},${j},${k})`; }
      if (isF && k >= 30 && v > out.topRowFluid.max) { out.topRowFluid.max = v; out.topRowFluid.at = `${AX[a]}-face (${i},${j},${k})`; } } }
  return out;
}
function partStats() {
  let mu = 0, at = -1, ke = 0, cmax = 0, csum = 0, cAt = -1;
  for (let p = 0; p < s.count; p++) { const u = Math.hypot(s.v[3 * p], s.v[3 * p + 1], s.v[3 * p + 2]); ke += u * u; if (u > mu) { mu = u; at = p; }
    let c = 0; for (let q = 0; q < 9; q++) c += s.C[9 * p + q] ** 2; c = Math.sqrt(c); csum += c; if (c > cmax) { cmax = c; cAt = p; } }
  const loc = (p) => (p < 0 ? null : { p, x: [0, 1, 2].map((b) => +(s.x[3 * p + b] / h).toFixed(3)), cell: [0, 1, 2].map((b) => Math.floor(s.x[3 * p + b] / h)) });
  return { maxU: mu, maxUAt: loc(at), ke: 0.5 * s.mp * ke, Cmax: cmax, Cmean: csum / s.count, CmaxAt: loc(cAt) };
}
const T = []; let cur = null;
const wrap = (name, post) => { const o = s[name].bind(s); s[name] = (...a) => { const r = o(...a); post(r); return r; }; };
wrap('p2g', () => { cur = { step: s.step + 1 }; T.push(cur); const FL = s.classify(s.markCells()); cur.afterP2G = gridStats(FL); });
wrap('applyGravity', () => { cur.afterGravity = gridStats(s.fluid); });
wrap('project', () => { cur.afterPressure = gridStats(s.fluid); cur.FL = Uint8Array.from(s.fluid); });
wrap('extrapolate', () => { cur.afterExtension = gridStats(cur.FL); });
wrap('g2p', () => { cur.afterG2P = partStats(); });
s.onSubstep = (sim, rec) => { cur.end = { ...partStats(), stage: rec.stage, logMaxU: rec.maxU }; delete cur.FL;
  if (zeroC && rec.step === 1) { s.C.fill(0); cur.zeroedC = true; } };
for (let n = 0; n < nSteps; n++) s.substep(1 / 60, 1);
write(`${tag}_trace.json`, T); console.log(JSON.stringify(T));
