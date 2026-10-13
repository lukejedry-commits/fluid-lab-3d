'use strict';
/** Families A-D from spec/pressure_ref.json, on the unit box, cell-centred grid.
 *  Assembly uses the SAME rules as the sim: interior coupling 1, wall (Neumann) 0,
 *  p=0 face via ghost fluid with theta=1/2 (p_ghost=-p, diag += 1/theta = 2). */
const fs = require('fs'), path = require('path');
const { pcgSolve } = require('../src/pcg');
const ref = JSON.parse(fs.readFileSync(path.join(__dirname, '../spec/pressure_ref.json'), 'utf8'));
const THETA = 0.5;
// bc: per side [x-,x+,y-,y+,z-,z+] 'N' | 'D'; gfun(x,y) Dirichlet value on z- (family D)
function assemble(N, bc, f, gz0) {
  const h = 1 / N, m = N * N * N, id = (i, j, k) => i + N * (j + N * k);
  const sys = { m, diag: new Float64Array(m), pX: new Int32Array(m).fill(-1), pY: new Int32Array(m).fill(-1), pZ: new Int32Array(m).fill(-1), cX: new Float64Array(m), cY: new Float64Array(m), cZ: new Float64Array(m) };
  const b = new Float64Array(m);
  for (let k = 0; k < N; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const c = id(i, j, k), x = (i + 0.5) * h, y = (j + 0.5) * h, z = (k + 0.5) * h;
    let d = 0; b[c] = -h * h * f(x, y, z); // A = -h^2 Lap
    const ijk = [i, j, k];
    for (let a = 0; a < 3; a++) for (const s of [0, 1]) {
      const nb = ijk[a] + (s ? 1 : -1);
      if (nb < 0 || nb >= N) { const kind = bc[2 * a + s]; if (kind === 'D') { d += 1 / THETA; if (a === 2 && s === 0 && gz0) b[c] += gz0(x, y) / THETA; } continue; }
      d += 1; if (s) { const q = a === 0 ? id(i + 1, j, k) : a === 1 ? id(i, j + 1, k) : id(i, j, k + 1); (a === 0 ? sys.pX : a === 1 ? sys.pY : sys.pZ)[c] = q; (a === 0 ? sys.cX : a === 1 ? sys.cY : sys.cZ)[c] = -1; }
    }
    sys.diag[c] = d;
  }
  return { sys, b };
}
function parseMode(id) { const d = id.match(/_(\d)(\d)(\d)$/).slice(1).map(Number); return d; }
function runModes(tol) {
  const rows = [];
  for (const cs of ref) {
    const fam = cs.id[0]; if (fam === 'D') continue;
    const [l, mm, n] = parseMode(cs.id);
    for (const Ns of Object.keys(cs.lam_d)) {
      const N = +Ns, lam = cs.lam_d[Ns];
      let pe, bc;
      if (fam === 'A') { pe = (x, y, z) => Math.sin(l * Math.PI * x) * Math.sin(mm * Math.PI * y) * Math.sin(n * Math.PI * z); bc = 'DDDDDD'; }
      if (fam === 'B') { pe = (x, y, z) => Math.cos(l * Math.PI * x) * Math.cos(mm * Math.PI * y) * Math.cos(n * Math.PI * z); bc = 'NNNNNN'; }
      if (fam === 'C') { pe = (x, y, z) => Math.cos(l * Math.PI * x) * Math.cos(mm * Math.PI * y) * Math.cos((2 * n - 1) * Math.PI * z / 2); bc = 'NNNNND'; }
      const { sys, b } = assemble(N, bc, (x, y, z) => lam * pe(x, y, z));
      const t0 = Date.now(); const r = pcgSolve(sys, b, { tol, removeMean: fam === 'B', maxIt: 20000 });
      let emax = 0, pmax = 0; const h = 1 / N;
      for (let k = 0; k < N; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const e = pe((i + .5) * h, (j + .5) * h, (k + .5) * h); pmax = Math.max(pmax, Math.abs(e)); emax = Math.max(emax, Math.abs(r.p[i + N * (j + N * k)] - e)); }
      rows.push({ id: cs.id, N, relLinf: emax / pmax, iters: r.iters, relRes: r.relRes, trueRelRes: r.trueRelRes, ms: Date.now() - t0 });
    }
  }
  return rows;
}
function seriesD(x, y, z, K) { let s = 0; for (let l = 1; l < K; l += 2) for (let m = 1; m < K; m += 2) { const q = Math.PI * Math.hypot(l, m); s += 64 / (Math.PI ** 6 * l ** 3 * m ** 3) * Math.sin(l * Math.PI * x) * Math.sin(m * Math.PI * y) * Math.exp(-q * z) * (1 - Math.exp(-2 * q * (1 - z))) / (1 - Math.exp(-2 * q)); } return s; }
function runD(tol, Ns = [8, 16, 32, 64]) {
  const cs = ref.find((c) => c.id === 'D_oneface');
  const pts = Object.keys(cs.values).map((k) => ({ key: k, xyz: JSON.parse(k.replace('(', '[').replace(')', ']')), ref: cs.values[k] }));
  const sols = {};
  const iters = [];
  for (const N of Ns) {
    const { sys, b } = assemble(N, 'DDDDDD', () => 0, (x, y) => x * (1 - x) * y * (1 - y));
    const r = pcgSolve(sys, b, { tol, maxIt: 20000 }); sols[N] = r.p; iters.push({ N, iters: r.iters, relRes: r.relRes, trueRelRes: r.trueRelRes });
  }
  const interp = (p, N, x, y, z) => { const h = 1 / N, f = [x / h - .5, y / h - .5, z / h - .5], i0 = f.map((v) => Math.min(N - 2, Math.max(0, Math.floor(v)))), t = f.map((v, a) => v - i0[a]); let s = 0;
    for (let c = 0; c < 8; c++) { const d = [c & 1, (c >> 1) & 1, (c >> 2) & 1]; s += d.reduce((w, dd, a) => w * (dd ? t[a] : 1 - t[a]), 1) * p[(i0[0] + d[0]) + N * ((i0[1] + d[1]) + N * (i0[2] + d[2]))]; } return s; };
  const out = pts.map((pt) => {
    const trunc = Math.abs(seriesD(...pt.xyz, 41) - seriesD(...pt.xyz, 801));
    const errs = Ns.map((N) => Math.abs(interp(sols[N], N, ...pt.xyz) - pt.ref));
    const orders = errs.slice(1).map((e, i) => Math.log2(errs[i] / e));
    return { point: pt.key, ref: pt.ref, errs, orders, truncation: trunc, truncRatioMax: Math.max(...errs.map((e) => trunc / e)) };
  });
  return { Ns, iters, points: out };
}
module.exports = { runModes, runD, assemble };
