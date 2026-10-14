'use strict';
/** Step 19 Phase B1 (ASSERTS da859722 Z 2026-10-14m; PHYSICS_SPEC b2d23ec4 7.7): colvol theta unit rows 1, 2, 3a, 3b, 4.
 *  node test/run_step19_phaseB1.js --out step19_smooth_theta/phaseB1_colvol */
const fs = require('fs'), path = require('path');
const { Sim } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const outDir = path.join(__dirname, '../results', arg('--out')); fs.mkdirSync(outDir, { recursive: true });
const write = (n, d) => { const f = path.join(outDir, n); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 1)); };
const rows = [], row = (name, value, limit, pass) => { rows.push({ name, value, limit, pass }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}: ${value} (limit ${limit})`); };
const fmt = (x) => x.toExponential(3), SL = (sl) => [((sl & 1) + 0.5) / 2, (((sl >> 1) & 1) + 0.5) / 2];
function faces(s) { const cnt = s.markCells(), FL = s.classify(cnt), { nx, ny, nz } = s, out = [];
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const c = i + nx * (j + ny * k); if (!FL[c]) continue;
    for (const [d, ok] of [[1, i + 1 < nx], [-1, i > 0], [nx, j + 1 < ny], [-nx, j > 0], [nx * ny, k + 1 < nz], [-nx * ny, k > 0]]) if (ok && !FL[c + d]) out.push([c, c + d]); }
  return { cnt, out }; }
function thetas(s, mode) { const m0 = s.thetaMode; s.thetaMode = mode; const { cnt, out } = faces(s); const r = out.map(([c, a]) => ({ c, a, raw: s.thetaRaw(cnt, c, a), th: s.thetaOf(cnt, c, a) })); const st = s.colvolStats; s.thetaMode = m0; return { r, st }; }
// (1)
for (const N of [8, 16, 32, 64]) { const h = 0.5 / N, s = new Sim({ nx: N, ny: N, nz: Math.round(1.25 * N), h, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, N);
  const A = thetas(s, 'colvol'), B = thetas(s, 'count'); let m = 0; A.r.forEach((x, q) => (m = Math.max(m, Math.abs(x.raw - B.r[q].raw), Math.abs(x.th - B.r[q].th))));
  row(`(1) T1 lattice N=${N}: max |theta_colvol - theta_count| over ${A.r.length} faces (fallback ${A.st.nFall}/${A.st.nSurf})`, fmt(m), '<= 1e-12', m <= 1e-12); }
for (const N of [8, 16, 32, 64]) { const L = 0.5, Hb = 0.1625, h = L / N, kFull = Math.floor(Hb / h + 1e-12), q = Hb / h - kFull, nz = Math.ceil(1.5 * Hb / h) + 2;
  const s = new Sim({ nx: N, ny: N, nz, h, seed: 7000 + N, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, kFull); const nTop = Math.round(8 * q);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const sl = [0, 1, 2, 3]; for (let a = 3; a > 0; a--) { const b = Math.floor(s.rand() * (a + 1)); [sl[a], sl[b]] = [sl[b], sl[a]]; }
    for (let n = 0; n < nTop; n++) { const [ox, oy] = SL(sl[n % 4]); s.addParticle((i + ox) * h, (j + oy) * h, (kFull + q * (n < 4 ? 0.25 : 0.75)) * h); } }
  const A = thetas(s, 'colvol'), B = thetas(s, 'count'); let m = 0; A.r.forEach((x, qq) => (m = Math.max(m, Math.abs(x.raw - B.r[qq].raw), Math.abs(x.th - B.r[qq].th))));
  row(`(1) T1b lattice N=${N} (top cell ${nTop}): max |theta_colvol - theta_count| over ${A.r.length} faces (fallback ${A.st.nFall}/${A.st.nSurf})`, fmt(m), '<= 1e-12', m <= 1e-12); }
// (2) flat fill, lattice placement (as Phase A run 2)
const PAT = { 2: [[0, 0.125], [3, 0.125]], 4: [[0, 0.25], [1, 0.25], [2, 0.25], [3, 0.25]], 6: [[0, 0.25], [1, 0.25], [2, 0.25], [3, 0.25], [0, 0.625], [3, 0.625]] };
for (const f of [0.25, 0.5, 0.75]) { let m = 0, mc = 0, n = 0, fb = 0;
  for (const N of [8, 16, 32, 64]) { const h = 0.5 / N, K = N / 2, s = new Sim({ nx: N, ny: N, nz: N, h, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, K);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) for (const [sl, oz] of PAT[8 * f]) { const [ox, oy] = SL(sl); s.addParticle((i + ox) * h, (j + oy) * h, (K + oz) * h); }
    const A = thetas(s, 'colvol'); fb += A.st.nFall; for (const x of A.r.filter((x) => x.a - x.c === N * N)) { const kc = (x.c / (N * N)) | 0; m = Math.max(m, Math.abs(kc + 0.5 + x.raw - (K + f))); mc = Math.max(mc, Math.abs(kc + 0.5 + x.th - (K + f))); n++; } }
  row(`(2) flat fill f=${f} (N=8..64, ${n} faces, fallback ${fb}): max |(k+1/2+theta) - (K+f)| (theta unclamped; with the 7.2 [0.05,1] clamp: ${fmt(mc)})`, fmt(m), '<= 1e-12', m <= 1e-12); }
// (3a)/(3b) crossings on the T1 lattice N=32
function cross(mode, b, k0, eps = 1e-9) { const N = 32, h = 0.5 / N, s = new Sim({ nx: N, ny: N, nz: 40, h, jitter: 0 }); s.seedBlock(0, N, 0, N, 0, N);
  let p = -1, best = -Infinity; for (let q = 0; q < s.count; q++) { const X = [0, 1, 2].map((d) => s.x[3 * q + d] / h); if (Math.floor(X[0]) !== 16 || Math.floor(X[1]) !== 16 || Math.floor(X[2]) !== k0) continue; if (X[b] > best) { best = X[b]; p = q; } }
  const face = ((b === 2 ? k0 : 16) + 1) * h; s.x[3 * p + b] = face - eps * h; const T0 = thetas(s, mode).r; s.x[3 * p + b] = face + eps * h; const T1 = thetas(s, mode).r;
  const key = (r) => r.c + ':' + r.a, M = new Map(T0.map((r) => [key(r), r.th])); let md = 0; const same = T0.length === T1.length && T1.every((r) => M.has(key(r)));
  for (const r of T1) md = Math.max(md, Math.abs(r.th - M.get(key(r)))); return { md, same }; }
for (const [lab, k0] of [['top face z=32h', 31], ['interior face z=16h', 15]]) { const C = cross('colvol', 2, k0), K = cross('count', 2, k0);
  row(`(3a) horizontal crossing (${lab}): max |d theta| colvol (classification unchanged ${C.same}); count-based ${fmt(K.md)}`, fmt(C.md), '<= 1e-12', C.md <= 1e-12 && C.same); }
for (const [lab, k0] of [['top row k=31', 31], ['interior k=15', 15]]) { const C = cross('colvol', 0, k0), K = cross('count', 0, k0);
  row(`(3b) lateral crossing (${lab}): max |d theta| colvol (classification unchanged ${C.same})`, fmt(C.md), '<= 0.02', C.md <= 0.02 && C.same);
  row(`(3b) lateral crossing (${lab}): count-based must fail`, fmt(K.md), '> 0.02', K.md > 0.02); }
// (4) overhang: N=16, pool k 0..5 full; air k 6..8; sheet over i < 8: k=9 full + k=10 with 2 particles/cell (f=0.25)
{ const N = 16, h = 0.5 / N, s = new Sim({ nx: N, ny: N, nz: 16, h, jitter: 0, thetaMode: 'colvol' }); s.seedBlock(0, N, 0, N, 0, 6); s.seedBlock(0, 8, 0, N, 9, 10);
  for (let j = 0; j < N; j++) for (let i = 0; i < 8; i++) for (const [sl, oz] of PAT[2]) { const [ox, oy] = SL(sl); s.addParticle((i + ox) * h, (j + oy) * h, (10 + oz) * h); }
  const cnt = s.markCells(), NN = N * N, T = s.colvolThetas(cnt), cid = (i, j, k) => i + N * j + NN * k;
  let mSheet = 0, nSheet = 0; for (let j = 0; j < N; j++) for (let i = 0; i <= 6; i++) { mSheet = Math.max(mSheet, Math.abs(T[cid(i, j, 9)] - 0.75)); nSheet++; }
  row(`(4) detached sheet (i=0..6, k=9 full + k=10 at f=0.25): theta from its own run = 0.75 (pool-included run would give ${(6 + 1.25 - 9.5).toFixed(2)})`, fmt(mSheet), '<= 1e-12', mSheet <= 1e-12);
  let fbOK = true, nEdge = 0; for (let j = 0; j < N; j++) { const c = cid(7, j, 9); s.thetaMode = 'colvol'; const v = s.thetaOf(cnt, c, c + NN); s.thetaMode = 'count'; const vc = s.thetaOf(cnt, c, c + NN); s.thetaMode = 'colvol';
    if (!Number.isNaN(T[c]) || v !== vc) fbOK = false; nEdge++; }
  row(`(4) sheet edge cells (i=7, neighbours at i=8 have no surface cell in row 9): fall back to count theta (${nEdge} cells)`, fbOK ? 'all fallback, theta == count' : 'NOT fallback', 'fallback', fbOK);
  let mPool = 0; for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) mPool = Math.max(mPool, Math.abs(T[cid(i, j, 5)] - 0.5));
  row(`(4) pool under the overhang (row k=5, all columns incl. under the sheet): theta from the pool run = 0.5`, fmt(mPool), '<= 1e-12', mPool <= 1e-12);
  const bot = s.thetaOf(cnt, cid(3, 3, 9), cid(3, 3, 8)); s.thetaMode = 'count'; const botc = s.thetaOf(cnt, cid(3, 3, 9), cid(3, 3, 8));
  row(`(4) sheet underside face (downward, not a column surface): count theta`, `${bot} vs count ${botc}`, 'equal', bot === botc); }
write('rows.json', rows); console.log(rows.every((r) => r.pass) ? 'ALL B1 ROWS PASS' : 'B1 HAS FAILURES');
