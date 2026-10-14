'use strict';
/** Step 19 Phase A (ASSERTS e90a351f Z 2026-10-14l; PHYSICS_SPEC 7.7): smooth-theta unit rows, graded before any graded run.
 *  Theta is compared on every fluid->air face (all 6 directions) of the classification project() uses.
 *  (a) lattice (jitter 0) T1 (N=8,16,32,64) and T1b (N=8..64, setup of t1b_setup.js with jitter 0): smooth == count to 1e-12.
 *  (b) flat fill f in {0.25,0.5,0.75} of the top cell (N=8..64; per-cell pattern: 2 = diagonal slots in the lower half-layer, 4 = full lower layer,
 *      6 = full lower layer + diagonal upper): surface height implied by theta, z_s = (k_c + 1/2 + theta_raw) h, equals (K + f) h to 1e-12.
 *  --placement lattice (graded) | t1b (info). Run 1 (results/step19_smooth_theta/phaseA_*.json) used the t1b-style z offsets by mistake for the graded row.
 *  (c) continuity: on the T1 lattice (N=32) one top-row particle moved from 1e-9 h before a face to 1e-9 h beyond it (vertical: top face z=32h;
 *      lateral: x-face between top-row cells): max |d theta| over all surface faces <= 0.02; count-based must fail (expect 0.125).
 *  node test/run_step19_phaseA.js --out step19_smooth_theta */
const fs = require('fs'), path = require('path');
const { Sim } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const outDir = path.join(__dirname, '../results', arg('--out')); fs.mkdirSync(outDir, { recursive: true });
const write = (n, d) => { const f = path.join(outDir, n); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 1)); };
const rows = [], row = (name, value, limit, pass, note = '') => { rows.push({ name, value, limit, pass, note }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${value} (limit ${limit}) ${note}`); };
const info = (name, value) => { rows.push({ name, value, info: true }); console.log(`INFO ${name}: ${value}`); };
const fmt = (x) => x.toExponential(3);
function faces(s) { // all fluid->air face pairs (c fluid, a in-box non-fluid)
  const cnt = s.markCells(), FL = s.classify(cnt), { nx, ny, nz } = s, out = [];
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const c = i + nx * (j + ny * k); if (!FL[c]) continue;
    for (const [d, ok] of [[1, i + 1 < nx], [-1, i > 0], [nx, j + 1 < ny], [-nx, j > 0], [nx * ny, k + 1 < nz], [-nx * ny, k > 0]]) if (ok && !FL[c + d]) out.push([c, c + d]); }
  return { cnt, out };
}
function thetas(s, mode) { const m0 = s.thetaMode; s.thetaMode = mode; const { cnt, out } = faces(s); const r = out.map(([c, a]) => ({ c, a, raw: s.thetaRaw(cnt, c, a), th: s.thetaOf(cnt, c, a) })); s.thetaMode = m0; return r; }
function compare(s) { const A = thetas(s, 'smooth'), B = thetas(s, 'count'); let m = 0, mr = 0; for (let q = 0; q < A.length; q++) { m = Math.max(m, Math.abs(A[q].th - B[q].th)); mr = Math.max(mr, Math.abs(A[q].raw - B[q].raw)); } return { n: A.length, maxClamped: m, maxRaw: mr, countTheta: [...new Set(B.map((r) => r.th))] }; }
const SL = (sl) => [((sl & 1) + 0.5) / 2, (((sl >> 1) & 1) + 0.5) / 2];
// (a) lattices
const Ra = [];
for (const N of [8, 16, 32, 64]) { const H = 0.5, h = H / N, s = new Sim({ nx: N, ny: N, nz: Math.round(1.25 * N), h, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, N);
  const r = compare(s); Ra.push({ case: 'T1', N, ...r }); }
for (const N of [8, 16, 32, 64]) { // t1b_setup.js with jitter 0 (random slot order per cell kept, seed 7000+N)
  const L = 0.5, Hb = 0.1625, h = L / N, kFull = Math.floor(Hb / h + 1e-12), q = Hb / h - kFull, nz = Math.ceil(1.5 * Hb / h) + 2;
  const s = new Sim({ nx: N, ny: N, nz, h, seed: 7000 + N, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, kFull); const nTop = Math.round(8 * q);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const slots = [0, 1, 2, 3]; for (let a = 3; a > 0; a--) { const b = Math.floor(s.rand() * (a + 1)); [slots[a], slots[b]] = [slots[b], slots[a]]; }
    for (let n = 0; n < nTop; n++) { const layer = n < 4 ? 0 : 1, [ox, oy] = SL(slots[n % 4]); s.addParticle((i + ox) * h, (j + oy) * h, (kFull + q * (layer ? 0.75 : 0.25)) * h); } }
  const r = compare(s); Ra.push({ case: 'T1b', N, nTop, q: +q.toFixed(4), ...r }); }
for (const r of Ra) row(`(a) lattice ${r.case} N=${r.N}${r.nTop != null ? ` (top cell ${r.nTop} particles)` : ''}: max |theta_smooth - theta_count| over ${r.n} surface faces`, `${fmt(r.maxClamped)} (unclamped ${fmt(r.maxRaw)}); count theta ${r.countTheta.join(',')}`, '<= 1e-12', r.maxClamped <= 1e-12);
// (b) flat fill
// [slot, z offset / h]. 'lattice' (graded): continuation of the 2x2x2 lattice cut flat at K+f (layers at sub-cell centres 0.25, extra half-layer at the
// centre of what remains); 't1b' (info): t1b_setup.js convention z = K h + f h (1/4 | 3/4).
const PAT = { lattice: { 2: [[0, 0.125], [3, 0.125]], 4: [[0, 0.25], [1, 0.25], [2, 0.25], [3, 0.25]], 6: [[0, 0.25], [1, 0.25], [2, 0.25], [3, 0.25], [0, 0.625], [3, 0.625]] },
  t1b: { 2: [[0, 0.0625], [3, 0.0625]], 4: [[0, 0.125], [1, 0.125], [2, 0.125], [3, 0.125]], 6: [[0, 0.1875], [1, 0.1875], [2, 0.1875], [3, 0.1875], [0, 0.5625], [3, 0.5625]] } };
const placement = arg('--placement', 'lattice'), pat = PAT[placement];
const Rb = [];
for (const f of [0.25, 0.5, 0.75]) for (const N of [8, 16, 32, 64]) { const h = 0.5 / N, K = N / 2, s = new Sim({ nx: N, ny: N, nz: N, h, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, K);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) for (const [sl, oz] of pat[8 * f]) { const [ox, oy] = SL(sl); s.addParticle((i + ox) * h, (j + oy) * h, (K + oz) * h); }
  for (const mode of ['smooth', 'count']) { const T = thetas(s, mode).filter((r) => r.a - r.c === N * N); let m = 0, mc = 0;
    const zs = T.map((r) => (((r.c / (N * N)) | 0) + 0.5 + r.raw)), zc = T.map((r) => (((r.c / (N * N)) | 0) + 0.5 + r.th));
    for (const z of zs) m = Math.max(m, Math.abs(z - (K + f))); for (const z of zc) mc = Math.max(mc, Math.abs(z - (K + f)));
    Rb.push({ f, N, mode, faces: T.length, kc: [...new Set(T.map((r) => (r.c / (N * N)) | 0))], theta: [...new Set(T.map((r) => +r.th.toFixed(15)))], thetaRaw: [...new Set(T.map((r) => +r.raw.toFixed(15)))], maxErrRaw: m, maxErrClamped: mc }); } }
for (const f of [0.25, 0.5, 0.75]) { const S = Rb.filter((r) => r.f === f && r.mode === 'smooth'), C = Rb.filter((r) => r.f === f && r.mode === 'count'), w = Math.max(...S.map((r) => r.maxErrRaw)), wc = Math.max(...S.map((r) => r.maxErrClamped));
  row(`(b) flat fill f=${f} [${placement} placement] (N=8..64): max |z_s/h - (K+f)|, z_s from unclamped smooth theta (theta raw ${S[0].thetaRaw.slice(0, 3).join(',')} from cell k_c=K${S[0].kc[0] - S[0].kc[0] === 0 && S[0].kc[0] === S[0].kc[0] ? (S[0].kc[0] - (S[0].N / 2) >= 0 ? '' : '-1') : ''})`, `${fmt(w)}; with the [0.05,1] clamp ${fmt(wc)}; clamped theta ${S[0].theta.join(',')}; count-based theta ${C[0].theta.join(',')}`, '<= 1e-12', w <= 1e-12, wc > 1e-12 ? 'clamp moves z_s: theta raw < 0.05' : ''); }
// (c) continuity
const Rc = [];
for (const dir of ['vertical (top face z=32h)', 'lateral (x-face, top row)']) for (const mode of ['smooth', 'count']) {
  const N = 32, h = 0.5 / N, s = new Sim({ nx: N, ny: N, nz: 40, h, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, N); s.thetaMode = mode;
  const i0 = 16, j0 = 16, k0 = N - 1, eps = 1e-9; let p = -1, best = -Infinity; // particle of cell (16,16,31) nearest the face
  for (let q = 0; q < s.count; q++) { const x = s.x[3 * q] / h, y = s.x[3 * q + 1] / h, z = s.x[3 * q + 2] / h; if (Math.floor(x) !== i0 || Math.floor(y) !== j0 || Math.floor(z) !== k0) continue; const key = dir.startsWith('v') ? z : x; if (key > best) { best = key; p = q; } }
  const b = dir.startsWith('v') ? 2 : 0, face = (b === 2 ? k0 + 1 : i0 + 1) * h;
  s.x[3 * p + b] = face - eps * h; const T0 = thetas(s, mode); s.x[3 * p + b] = face + eps * h; const T1 = thetas(s, mode);
  const key = (r) => r.c + ':' + r.a, M0 = new Map(T0.map((r) => [key(r), r.th])); let md = 0, at = null;
  for (const r of T1) { const d = Math.abs(r.th - (M0.get(key(r)) ?? NaN)); if (d > md) { md = d; at = key(r); } }
  const sameFaces = T0.length === T1.length && T1.every((r) => M0.has(key(r)));
  Rc.push({ dir, mode, maxDTheta: md, at, faces: T1.length, sameFaces }); }
for (const r of Rc) row(`(c) continuity ${r.mode} theta, one particle moved 2e-9 h across ${r.dir}: max |d theta| over ${r.faces} surface faces (classification unchanged: ${r.sameFaces})`, fmt(r.maxDTheta), r.mode === 'smooth' ? '<= 0.02' : 'must FAIL (> 0.02)', r.mode === 'smooth' ? r.maxDTheta <= 0.02 : r.maxDTheta > 0.02);
write('phaseA_rows.json', rows); write('phaseA_detail.json', { Ra, Rb, Rc });
