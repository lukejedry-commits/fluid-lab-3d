'use strict';
/**
 * Fluid Lab 3D v1 (CPU): APIC/MAC free-surface liquid in an open box.
 * Update order per substep (PHYSICS_SPEC sec. 2):
 *  P2G (APIC, quadratic B-spline) -> ghost fill (mass-weighted) -> gravity ->
 *  pressure (PCG/MIC(0), walls u.n=0, free surface p=0 ghost-fluid) -> G2P (APIC) ->
 *  RK2 advection -> push-out (wall strip + equal-and-opposite separation clip).
 * All grid data, sums and diagnostics are Float64.
 */
const FM = require('./facemass');
const { pcgSolve } = require('./pcg');

function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const STAGES = ['p2g', 'ghost', 'gravity', 'pressure', 'g2p', 'extension', 'advect', 'pushout', 'densfix'];

class Sim {
  constructor(o) {
    this.nx = o.nx; this.ny = o.ny; this.nz = o.nz; this.h = o.h;
    this.rho = o.rho ?? 1000; this.g = o.g ?? 9.81;
    this.frame = o.frame ?? 1 / 60; this.maxSub = o.maxSub ?? 16; this.cfl = o.cfl ?? 1;
    this.tol = o.tol ?? 1e-8; this.jitter = o.jitter ?? 0.1; this.rand = mulberry32(o.seed ?? 12345);
    this.subMul = o.subMul ?? 1; // T2 half-dt info row: multiply the substep count (cap applies before)
    this.sepFrac = o.sepFrac ?? 0.5; this.sepIters = o.sepIters ?? 1;
    // C3 regression switches (defaults = production behaviour; tests turn one fix off to prove its test fails)
    this.useDensFix = o.densFix ?? true; this.densSign = o.densSign ?? 1; this.densTol = o.densTol ?? 1e-4; this.densCap = o.densCap ?? 0.1; this.densAlpha = o.densAlpha ?? 0.1; this.densDead = o.densDead ?? 0.2; // fix 3 v4
    this.useGhostFill = o.ghostFill ?? true; this.useWallStrip = o.wallStrip ?? true; this.useSepClip = o.sepClip ?? true;
    this.s = this.h / 2;                    // particle spacing (2x2x2 per cell)
    this.pr = 0.25 * this.s;                // wall clearance radius
    this.mp = this.rho * this.h ** 3 / 8;   // particle mass
    this.mRef = this.rho * this.h ** 3;     // full face mass
    this.L = [this.nx * this.h, this.ny * this.h, this.nz * this.h];
    const n = [this.nx, this.ny, this.nz];
    this.D = []; this.P = []; this.vel = []; this.mass = []; this.valid = [];
    for (let a = 0; a < 3; a++) {
      const D = n.map((v, b) => v + (a === b ? 1 : 0));
      const P = D.map((v) => v + 2);
      this.D.push(D); this.P.push(P);
      const sz = P[0] * P[1] * P[2];
      this.vel.push(new Float64Array(sz)); this.mass.push(new Float64Array(sz)); this.valid.push(new Uint8Array(sz));
    }
    this.nCells = this.nx * this.ny * this.nz;
    this.count = 0; this.cap = 0; this.alloc(1024);
    this.t = 0; this.step = 0; this.log = []; this.lastP = null;
    this.stageCum = Object.fromEntries(STAGES.map((k) => [k, 0]));
  }
  alloc(cap) {
    const grow = (old, k) => { const a = new Float64Array(cap * k); if (old) a.set(old); return a; };
    this.x = grow(this.x, 3); this.v = grow(this.v, 3); this.C = grow(this.C, 9); this.cap = cap;
  }
  idx(a, i, j, k) { const P = this.P[a]; return (i + 1) + P[0] * ((j + 1) + P[1] * (k + 1)); }
  addParticle(x, y, z, vx = 0, vy = 0, vz = 0) {
    if (this.count >= this.cap) this.alloc(this.cap * 2);
    const i = this.count++;
    this.x[3 * i] = x; this.x[3 * i + 1] = y; this.x[3 * i + 2] = z;
    this.v[3 * i] = vx; this.v[3 * i + 1] = vy; this.v[3 * i + 2] = vz;
  }
  /** seed 2x2x2 jittered particles in every cell of [i0,i1)x[j0,j1)x[k0,k1) */
  seedBlock(i0, i1, j0, j1, k0, k1, vel = [0, 0, 0]) {
    const h = this.h, J = this.jitter * this.s;
    for (let k = k0; k < k1; k++) for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++)
      for (let c = 0; c < 8; c++) {
        const ox = (c & 1) + 0.5, oy = ((c >> 1) & 1) + 0.5, oz = ((c >> 2) & 1) + 0.5;
        this.addParticle(this.seedClamp((i + ox / 2) * h + J * (2 * this.rand() - 1), 0), this.seedClamp((j + oy / 2) * h + J * (2 * this.rand() - 1), 1),
          this.seedClamp((k + oz / 2) * h + J * (2 * this.rand() - 1), 2), vel[0], vel[1], vel[2]);
      }
  }
  /** C3.seed (ASSERTS Z 2026-10-14b): a jittered seed never lies inside the wall clearance pr.
   *  Same RNG draws as before; only coordinates that would land within pr of a wall are clamped to pr. */
  seedClamp(x, b) { return Math.min(Math.max(x, this.pr), this.L[b] - this.pr); }
  // ---------------- energy (64-bit) ----------------
  particleEnergy() {
    let ke = 0, pe = 0; const { v, x, count } = this;
    for (let i = 0; i < count; i++) { ke += v[3 * i] ** 2 + v[3 * i + 1] ** 2 + v[3 * i + 2] ** 2; pe += x[3 * i + 2]; }
    return { ke: 0.5 * this.mp * ke, pe: this.mp * this.g * pe };
  }
  gridKE() {
    let e = 0;
    for (let a = 0; a < 3; a++) { const D = this.D[a], V = this.vel[a], M = this.mass[a];
      for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) { const f = this.idx(a, i, j, k); e += M[f] * V[f] * V[f]; } }
    return 0.5 * e;
  }
  // ---------------- P2G ----------------
  static w3(d, out, o) { out[o] = 0.5 * (1.5 - d) ** 2; out[o + 1] = 0.75 - (d - 1) ** 2; out[o + 2] = 0.5 * (d - 0.5) ** 2; }
  p2g() {
    const h = this.h, ih = 1 / h, mp = this.mp, W = new Float64Array(9), B = [0, 0, 0];
    for (let a = 0; a < 3; a++) {
      this.vel[a].fill(0); this.mass[a].fill(0);
      const V = this.vel[a], M = this.mass[a], P = this.P[a];
      const off = [a === 0 ? 0 : 0.5, a === 1 ? 0 : 0.5, a === 2 ? 0 : 0.5];
      for (let p = 0; p < this.count; p++) {
        for (let b = 0; b < 3; b++) { const f = this.x[3 * p + b] * ih - off[b]; const base = Math.floor(f - 0.5); B[b] = base; Sim.w3(f - base, W, 3 * b); }
        const vp = this.v[3 * p + a], c0 = this.C[9 * p + 3 * a], c1 = this.C[9 * p + 3 * a + 1], c2 = this.C[9 * p + 3 * a + 2];
        const xp = this.x[3 * p], yp = this.x[3 * p + 1], zp = this.x[3 * p + 2];
        for (let kk = 0; kk < 3; kk++) { const k = B[2] + kk; if (k < -1 || k > P[2] - 2) continue; const dz = (k + off[2]) * h - zp;
          for (let jj = 0; jj < 3; jj++) { const j = B[1] + jj; if (j < -1 || j > P[1] - 2) continue; const dy = (j + off[1]) * h - yp; const wjk = W[3 + jj] * W[6 + kk];
            for (let ii = 0; ii < 3; ii++) { const i = B[0] + ii; if (i < -1 || i > P[0] - 2) continue; const dx = (i + off[0]) * h - xp;
              const w = W[ii] * wjk * mp, f = (i + 1) + P[0] * ((j + 1) + P[1] * (k + 1));
              M[f] += w; V[f] += w * (vp + c0 * dx + c1 * dy + c2 * dz); } } }
      }
      this.foldPad(a);
      for (let f = 0; f < V.length; f++) V[f] = M[f] > 0 ? V[f] / M[f] : 0;
    }
  }
  /** fold padding (outside-box) mass+momentum onto the image face inside the box (2D foldGhostFaces). */
  foldPad(a) {
    const V = this.vel[a], M = this.mass[a], D = this.D[a];
    for (let b = 0; b < 3; b++) {
      const r = [[-1, D[0]], [-1, D[1]], [-1, D[2]]];
      for (let c = 0; c < b; c++) r[c] = [0, D[c] - 1];
      const [o1, o2] = [0, 1, 2].filter((c) => c !== b);
      for (let s1 = r[o1][0]; s1 <= r[o1][1]; s1++) for (let s2 = r[o2][0]; s2 <= r[o2][1]; s2++) {
        for (const [from, to] of [[-1, 0], [D[b], D[b] - 1]]) {
          const ia = [0, 0, 0], ib = [0, 0, 0]; ia[o1] = ib[o1] = s1; ia[o2] = ib[o2] = s2; ia[b] = from; ib[b] = to;
          const fa = this.idx(a, ...ia), fb = this.idx(a, ...ib);
          V[fb] += V[fa]; M[fb] += M[fa]; V[fa] = 0; M[fa] = 0;
        }
      }
    }
  }
  /** FIX 1 (PHYSICS_SPEC 7.1, theta face mass): on every interior face between a fluid cell and a
   *  non-fluid cell that carries mass, set m_f = theta * rho h^3, with the same clamped theta the
   *  ghost-fluid solve uses (thetaOf). Classification is the one project() recomputes from the same
   *  particle positions, so both agree. m_f > 0 is kept (theta >= 0.05), so carriesFluid/faceFraction
   *  are unchanged; the theta mass is what the energy measure and the ghost-fill weights see. */
  surfaceThetaMasses() {
    const { nx, ny, nz } = this, n = [nx, ny, nz], cs = [1, nx, nx * ny], cnt = this.markCells(), FL = this.classify(cnt); let nS = 0;
    for (let a = 0; a < 3; a++) { const D = this.D[a], M = this.mass[a];
      for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) {
        const ii = [i, j, k]; if (ii[a] === 0 || ii[a] === n[a]) continue;
        const f = this.idx(a, i, j, k); if (!FM.carriesFluid(M[f])) continue;
        const hi = i + nx * (j + ny * k), lo = hi - cs[a], fh = FL[hi] === 1, fl = FL[lo] === 1; if (fh === fl) continue;
        M[f] = this.thetaOf(cnt, fh ? hi : lo, fh ? lo : hi) * this.mRef; nS++; } }
    return nS;
  }
  // ---------------- ghost fill ----------------
  ghostFill() {
    let nG = 0; if (!this.useGhostFill) return 0;
    for (let a = 0; a < 3; a++) {
      const V = this.vel[a], M = this.mass[a], D = this.D[a], P = this.P[a], src = Float64Array.from(V);
      const st = [1, P[0], P[0] * P[1]];
      for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) {
        const f = this.idx(a, i, j, k);
        if (!FM.isGhost(M[f])) continue;
        let sm = 0, sv = 0;
        for (let b = 0; b < 3; b++) for (const sg of [-1, 1]) { const g = f + sg * st[b]; if (FM.carriesFluid(M[g])) { sm += M[g]; sv += M[g] * src[g]; } }
        if (sm > 0) { V[f] = sv / sm; nG++; }
      }
    }
    return nG;
  }
  // ---------------- gravity (same rule as the pressure faces) ----------------
  applyGravity(dt) {
    const V = this.vel[2], M = this.mass[2];
    for (let f = 0; f < V.length; f++) if (FM.carriesFluid(M[f])) V[f] -= this.g * dt;
  }
  // ---------------- pressure ----------------
  markCells() {
    const cnt = new Int32Array(this.nCells), ih = 1 / this.h, { nx, ny, nz } = this;
    for (let p = 0; p < this.count; p++) {
      const i = Math.min(nx - 1, Math.max(0, Math.floor(this.x[3 * p] * ih))), j = Math.min(ny - 1, Math.max(0, Math.floor(this.x[3 * p + 1] * ih))), k = Math.min(nz - 1, Math.max(0, Math.floor(this.x[3 * p + 2] * ih)));
      cnt[i + nx * (j + ny * k)]++;
    }
    this.cellCount = cnt; return cnt;
  }
  /** ghost-fluid fraction: distance from fluid cell centre to surface / h = f_c - 1/2,
   *  f_c = min(1, particles/8) the cell fill fraction. Clamped to [THETA_MIN, 1]. */
  /** PHYSICS_SPEC sec. 7 item 2. A surface cell (has an in-box neighbour with no particles)
   *  with fill f < 1/2 counts as air; every other cell with particles is fluid. */
  classify(cnt) {
    const { nx, ny, nz } = this, fluid = new Uint8Array(this.nCells);
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const c = i + nx * (j + ny * k); if (!(cnt[c] > 0)) continue;
      const f = Math.min(1, cnt[c] / 8);
      if (f < 0.5) {
        const surf = (i > 0 && !cnt[c - 1]) || (i < nx - 1 && !cnt[c + 1]) || (j > 0 && !cnt[c - nx]) || (j < ny - 1 && !cnt[c + nx]) || (k > 0 && !cnt[c - nx * ny]) || (k < nz - 1 && !cnt[c + nx * ny]);
        if (surf) continue;
      }
      fluid[c] = 1;
    }
    this.fluid = fluid; return fluid;
  }
  /** theta for the face between fluid cell c and non-fluid cell a:
   *  a holds particles (f_a < 1/2 surface cell) -> theta = f_a + 1/2; else theta = f_c - 1/2. Clamp [0.05,1]. */
  thetaOf(cnt, c, a) {
    const t = cnt[a] > 0 ? Math.min(1, cnt[a] / 8) + 0.5 : Math.min(1, cnt[c] / 8) - 0.5;
    return Math.max(0.05, Math.min(1, t));
  }
  project(dt) {
    const { nx, ny, nz } = this, cnt = this.markCells(), FL = this.classify(cnt);
    const uid = new Int32Array(this.nCells).fill(-1); const cells = [];
    for (let c = 0; c < this.nCells; c++) if (FL[c]) { uid[c] = cells.length; cells.push(c); }
    const m = cells.length;
    const sys = { m, diag: new Float64Array(m), pX: new Int32Array(m).fill(-1), pY: new Int32Array(m).fill(-1), pZ: new Int32Array(m).fill(-1), cX: new Float64Array(m), cY: new Float64Array(m), cZ: new Float64Array(m) };
    const b = new Float64Array(m); const n = [nx, ny, nz]; const cs = [1, nx, nx * ny];
    // walls: zero normal flow
    for (let a = 0; a < 3; a++) { const D = this.D[a];
      for (let s1 = 0; s1 < D[(a + 1) % 3]; s1++) for (let s2 = 0; s2 < D[(a + 2) % 3]; s2++) for (const e of [0, D[a] - 1]) {
        const ii = [0, 0, 0]; ii[a] = e; ii[(a + 1) % 3] = s1; ii[(a + 2) % 3] = s2; this.vel[a][this.idx(a, ...ii)] = 0; } }
    const faceOf = (a, i, j, k, side) => { const ii = [i, j, k]; ii[a] += side; return this.idx(a, ...ii); }; // side 0: low face, 1: high face
    for (let q = 0; q < m; q++) {
      const c = cells[q], i = c % nx, j = ((c / nx) | 0) % ny, k = (c / (nx * ny)) | 0, ijk = [i, j, k];
      let d = 0, div = 0;
      for (let a = 0; a < 3; a++) {
        const flo = faceOf(a, i, j, k, 0), fhi = faceOf(a, i, j, k, 1);
        div += this.vel[a][fhi] - this.vel[a][flo];
        for (const side of [0, 1]) {
          const nb = ijk[a] + (side ? 1 : -1);
          if (nb < 0 || nb >= n[a]) continue; // wall: Neumann
          const f = side ? fhi : flo, frac = FM.faceFraction(this.mass[a][f]);
          if (frac === 0) continue;
          const cn = c + (side ? 1 : -1) * cs[a];
          if (FL[cn]) { d += frac; if (side) { const arrP = a === 0 ? sys.pX : a === 1 ? sys.pY : sys.pZ; const arrC = a === 0 ? sys.cX : a === 1 ? sys.cY : sys.cZ; arrP[q] = uid[cn]; arrC[q] = -frac; } }
          else d += frac / this.thetaOf(cnt, c, cn);
        }
      }
      sys.diag[q] = d; b[q] = -div;
    }
    const r = pcgSolve(sys, b, { tol: this.tol });
    const ph = r.p;
    // velocity update with the same coefficients
    const valid = this.valid; for (let a = 0; a < 3; a++) valid[a].fill(0);
    for (let a = 0; a < 3; a++) { const D = this.D[a], V = this.vel[a], M = this.mass[a];
      for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) {
        const f = this.idx(a, i, j, k), ii = [i, j, k];
        if (ii[a] === 0 || ii[a] === n[a]) { valid[a][f] = 1; continue; } // wall
        const hi = i + nx * (j + ny * k), lo = hi - cs[a];
        const fh = FL[hi] === 1, fl = FL[lo] === 1;
        if (!fh && !fl) continue;
        valid[a][f] = 1;
        if (FM.faceFraction(M[f]) === 0) { V[f] = 0; continue; }
        const pH = fh ? ph[uid[hi]] : ph[uid[lo]] * (this.thetaOf(cnt, lo, hi) - 1) / this.thetaOf(cnt, lo, hi);
        const pL = fl ? ph[uid[lo]] : ph[uid[hi]] * (this.thetaOf(cnt, hi, lo) - 1) / this.thetaOf(cnt, hi, lo);
        V[f] -= pH - pL;
      } }
    // diagnostics: max |div u| after projection (1/s)
    let maxDiv = 0;
    for (let q = 0; q < m; q++) { const c = cells[q], i = c % nx, j = ((c / nx) | 0) % ny, k = (c / (nx * ny)) | 0; let dv = 0;
      for (let a = 0; a < 3; a++) dv += this.vel[a][faceOf(a, i, j, k, 1)] - this.vel[a][faceOf(a, i, j, k, 0)];
      maxDiv = Math.max(maxDiv, Math.abs(dv) / this.h); }
    // physical pressure per cell (Pa), NaN for non-fluid
    const pres = new Float64Array(this.nCells).fill(NaN); const sc = this.rho * this.h / dt;
    for (let q = 0; q < m; q++) pres[cells[q]] = ph[q] * sc;
    this.lastP = pres;
    return { iters: r.iters, relRes: r.relRes, trueRelRes: r.trueRelRes, bNorm: r.bNorm, maxDivDt: maxDiv * dt, fluidCells: m };
  }
  /** velocity extension: fill faces not adjacent to fluid (2 layers, 26-connected) + padding, so G2P never reads unprojected data */
  extrapolate() {
    for (let a = 0; a < 3; a++) {
      const V = this.vel[a], ok = this.valid[a], D = this.D[a], P = this.P[a], st = [1, P[0], P[0] * P[1]];
      // PHYSICS_SPEC 7.4 (NM): Jacobi layers. Each layer reads only the known set from BEFORE the
      // layer (ok snapshot + src copy): layer 1 sees original fluid faces (and walls), layer 2 sees
      // those plus layer 1, never a value filled earlier in the same pass -> order-independent.
      for (let layer = 0; layer < 2; layer++) {
        const nv = Uint8Array.from(ok), src = Float64Array.from(V);
        for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) {
          const f = this.idx(a, i, j, k); if (ok[f]) continue; let s = 0, c = 0;
          // 26-connected layers: in 3D the 1.5-cell quadratic stencil of a corner particle
          // reaches faces 3 axis-steps from the nearest fluid face but only 1-2 diagonal steps.
          for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy && !dz) continue;
            const ii = i + dx, jj = j + dy, kk = k + dz; if (ii < 0 || jj < 0 || kk < 0 || ii >= D[0] || jj >= D[1] || kk >= D[2]) continue;
            const g = f + dx * st[0] + dy * st[1] + dz * st[2]; if (ok[g]) { s += src[g]; c++; } }
          if (c) { V[f] = s / c; nv[f] = 1; }
        }
        ok.set(nv);
      }
      // padding: tangential = copy (free-slip image), normal beyond wall = 0
      for (let b = 0; b < 3; b++) { const r = [[-1, D[0]], [-1, D[1]], [-1, D[2]]]; const [o1, o2] = [0, 1, 2].filter((c) => c !== b);
        for (let s1 = r[o1][0]; s1 <= r[o1][1]; s1++) for (let s2 = r[o2][0]; s2 <= r[o2][1]; s2++) for (const [pad, img] of [[-1, 0], [D[b], D[b] - 1]]) {
          const ia = [0, 0, 0], ib = [0, 0, 0]; ia[o1] = ib[o1] = s1; ia[o2] = ib[o2] = s2; ia[b] = pad; ib[b] = img;
          const ib1 = ib.map((v, c) => Math.min(Math.max(v, 0), D[c] - 1));
          V[this.idx(a, ...ia)] = b === a ? 0 : V[this.idx(a, ...ib1)]; } }
    }
  }
  /** particle KE that G2P would produce from the current grid (no state change) */
  g2pKE() {
    const h = this.h, ih = 1 / h, W = new Float64Array(9), B = [0, 0, 0]; let ke = 0;
    for (let p = 0; p < this.count; p++) for (let a = 0; a < 3; a++) {
      const V = this.vel[a], P = this.P[a], off = [a === 0 ? 0 : 0.5, a === 1 ? 0 : 0.5, a === 2 ? 0 : 0.5];
      for (let b = 0; b < 3; b++) { const f = this.x[3 * p + b] * ih - off[b]; const base = Math.floor(f - 0.5); B[b] = base; Sim.w3(f - base, W, 3 * b); }
      let v = 0;
      for (let kk = 0; kk < 3; kk++) { const k = Math.min(Math.max(B[2] + kk, -1), P[2] - 2);
        for (let jj = 0; jj < 3; jj++) { const j = Math.min(Math.max(B[1] + jj, -1), P[1] - 2); const wjk = W[3 + jj] * W[6 + kk];
          for (let ii = 0; ii < 3; ii++) { const i = Math.min(Math.max(B[0] + ii, -1), P[0] - 2); v += W[ii] * wjk * V[(i + 1) + P[0] * ((j + 1) + P[1] * (k + 1))]; } } }
      ke += v * v;
    }
    return 0.5 * this.mp * ke;
  }
  /** zero every face not adjacent to fluid (and the padding): the "no extension" grid */
  zeroInvalid() { for (let a = 0; a < 3; a++) { const V = this.vel[a], ok = this.valid[a]; for (let f = 0; f < V.length; f++) if (!ok[f]) V[f] = 0; } }
  // ---------------- G2P (APIC) ----------------
  g2p() {
    const h = this.h, ih = 1 / h, W = new Float64Array(9), B = [0, 0, 0], Dinv = 4 / (h * h);
    for (let p = 0; p < this.count; p++) {
      const xp = this.x[3 * p], yp = this.x[3 * p + 1], zp = this.x[3 * p + 2];
      for (let a = 0; a < 3; a++) {
        const V = this.vel[a], P = this.P[a], off = [a === 0 ? 0 : 0.5, a === 1 ? 0 : 0.5, a === 2 ? 0 : 0.5], Da = this.D[a][a] - 1;
        for (let b = 0; b < 3; b++) { const f = this.x[3 * p + b] * ih - off[b]; const base = Math.floor(f - 0.5); B[b] = base; Sim.w3(f - base, W, 3 * b); }
        let v = 0, c0 = 0, c1 = 0, c2 = 0;
        for (let kk = 0; kk < 3; kk++) { const k = Math.min(Math.max(B[2] + kk, -1), P[2] - 2); const dz = (B[2] + kk + off[2]) * h - zp;
          for (let jj = 0; jj < 3; jj++) { const j = Math.min(Math.max(B[1] + jj, -1), P[1] - 2); const dy = (B[1] + jj + off[1]) * h - yp; const wjk = W[3 + jj] * W[6 + kk];
            for (let ii = 0; ii < 3; ii++) { const i = Math.min(Math.max(B[0] + ii, -1), P[0] - 2); const dx = (B[0] + ii + off[0]) * h - xp;
              // FIX 2: the normal component at solid faces (and beyond them) reads exactly 0
              const ia = a === 0 ? i : a === 1 ? j : k, solid = ia <= 0 || ia >= Da;
              const w = W[ii] * wjk, u = solid ? 0 : V[(i + 1) + P[0] * ((j + 1) + P[1] * (k + 1))];
              v += w * u; c0 += w * u * dx; c1 += w * u * dy; c2 += w * u * dz; } } }
        this.v[3 * p + a] = v; this.C[9 * p + 3 * a] = c0 * Dinv; this.C[9 * p + 3 * a + 1] = c1 * Dinv; this.C[9 * p + 3 * a + 2] = c2 * Dinv;
      }
    }
  }
  // ---------------- RK2 advection in the grid field (trilinear) ----------------
  sample(a, x, y, z) {
    const ih = 1 / this.h, V = this.vel[a], P = this.P[a], D = this.D[a];
    const f = [x * ih - (a === 0 ? 0 : 0.5), y * ih - (a === 1 ? 0 : 0.5), z * ih - (a === 2 ? 0 : 0.5)];
    const i0 = [0, 0, 0], t = [0, 0, 0];
    for (let b = 0; b < 3; b++) { let q = Math.floor(f[b]); q = Math.min(Math.max(q, -1), D[b] - 1); i0[b] = q; t[b] = Math.min(Math.max(f[b] - q, 0), 1); }
    let s = 0;
    for (let c = 0; c < 8; c++) { const di = c & 1, dj = (c >> 1) & 1, dk = (c >> 2) & 1;
      const w = (di ? t[0] : 1 - t[0]) * (dj ? t[1] : 1 - t[1]) * (dk ? t[2] : 1 - t[2]); if (w === 0) continue;
      s += w * V[(i0[0] + di + 1) + P[0] * ((i0[1] + dj + 1) + P[1] * (i0[2] + dk + 1))]; }
    return s;
  }
  advect(dt) {
    for (let p = 0; p < this.count; p++) {
      const x = this.x[3 * p], y = this.x[3 * p + 1], z = this.x[3 * p + 2];
      const mx = x + 0.5 * dt * this.sample(0, x, y, z), my = y + 0.5 * dt * this.sample(1, x, y, z), mz = z + 0.5 * dt * this.sample(2, x, y, z);
      this.x[3 * p] = x + dt * this.sample(0, mx, my, mz); this.x[3 * p + 1] = y + dt * this.sample(1, mx, my, mz); this.x[3 * p + 2] = z + dt * this.sample(2, mx, my, mz);
    }
  }
  // ---------------- push-out ----------------
  /** item 1: clamp to the box and strip the into-wall normal velocity (only the into-wall part). */
  wallStrip() {
    let n = 0; if (!this.useWallStrip) return 0;
    for (let p = 0; p < this.count; p++) for (let b = 0; b < 3; b++) {
      const lo = this.pr, hi = this.L[b] - this.pr, q = 3 * p + b;
      if (this.x[q] < lo) { this.x[q] = lo; if (this.v[q] < 0) this.v[q] = 0; n++; }
      else if (this.x[q] > hi) { this.x[q] = hi; if (this.v[q] > 0) this.v[q] = 0; n++; }
    }
    return n;
  }
  /** item 2: pair separation; one shared push d (i -= d, j += d), shrunk per axis to what BOTH
   *  particles can move inside the box, so it stays exactly equal and opposite. */
  separate() {
    const minD = this.sepFrac * this.s, minD2 = minD * minD, X = this.x, n = this.count;
    const hn = this.L.map((l) => Math.max(1, Math.floor(l / minD))), cs = this.L.map((l, b) => l / hn[b]);
    const nC = hn[0] * hn[1] * hn[2], start = new Int32Array(nC + 1), cellOf = new Int32Array(n), ids = new Int32Array(n);
    for (let p = 0; p < n; p++) { const c = [0, 1, 2].map((b) => Math.min(hn[b] - 1, Math.max(0, Math.floor(X[3 * p + b] / cs[b])))); cellOf[p] = c[0] + hn[0] * (c[1] + hn[1] * c[2]); start[cellOf[p]]++; }
    let acc = 0; for (let c = 0; c < nC; c++) { acc += start[c]; start[c] = acc; } start[nC] = acc;
    for (let p = 0; p < n; p++) ids[--start[cellOf[p]]] = p;
    let pushes = 0; const lo = this.pr, his = this.L.map((l) => l - this.pr), d = [0, 0, 0];
    for (let it = 0; it < this.sepIters; it++) for (let i = 0; i < n; i++) {
      const c = cellOf[i], cx = c % hn[0], cy = ((c / hn[0]) | 0) % hn[1], cz = (c / (hn[0] * hn[1])) | 0;
      for (let zz = Math.max(0, cz - 1); zz <= Math.min(hn[2] - 1, cz + 1); zz++) for (let yy = Math.max(0, cy - 1); yy <= Math.min(hn[1] - 1, cy + 1); yy++) for (let xx = Math.max(0, cx - 1); xx <= Math.min(hn[0] - 1, cx + 1); xx++) {
        const cc = xx + hn[0] * (yy + hn[1] * zz);
        for (let s = start[cc]; s < start[cc + 1]; s++) { const j = ids[s]; if (j <= i) continue;
          let d2 = 0; for (let b = 0; b < 3; b++) { d[b] = X[3 * j + b] - X[3 * i + b]; d2 += d[b] * d[b]; }
          if (d2 >= minD2) continue;
          if (d2 < 1e-24) { d[0] = 0.5 * minD; d[1] = d[2] = 0; } else { const dd = Math.sqrt(d2), k = 0.5 * (minD - dd) / dd; for (let b = 0; b < 3; b++) d[b] *= k; }
          for (let b = 0; b < 3; b++) { const xi = X[3 * i + b], xj = X[3 * j + b], hi = his[b];
            if (!this.useSepClip) { /* C3: clip removed */ }
            else if (d[b] > 0) { const li = xi - Math.min(xi, lo), lj = Math.max(xj, hi) - xj; d[b] = Math.min(d[b], li, lj); }
            else if (d[b] < 0) { const li = Math.max(xi, hi) - xi, lj = xj - Math.min(xj, lo); d[b] = -Math.min(-d[b], li, lj); }
            X[3 * i + b] -= d[b]; X[3 * j + b] += d[b]; }
          pushes++; }
      }
    }
    return pushes;
  }
  // ---------------- FIX 3 v2: density correction (ASSERTS Z 2026-10-14d, supersedes 14c), positions only ----------------
  /** nbar_c = 27-cell count smoothed with the P2G (quadratic B-spline) weights at cell-centre offsets
   *  (0.75 centre, 0.125 per axis neighbour; sums to 1). Out-of-box (solid) cells mirror the adjacent
   *  in-box cell (index clamped into the box). */
  smoothedCounts(cnt) {
    const { nx, ny, nz } = this, w = [0.125, 0.75, 0.125], out = new Float64Array(this.nCells), cl = (v, n) => (v < 0 ? 0 : v >= n ? n - 1 : v);
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { let s = 0;
      for (let dk = -1; dk <= 1; dk++) for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++)
        s += w[di + 1] * w[dj + 1] * w[dk + 1] * cnt[cl(i + di, nx) + nx * (cl(j + dj, ny) + ny * cl(k + dk, nz))];
      out[i + nx * (j + ny * k)] = s; }
    return out;
  }
  /** e = nbar/8 - 1 on fluid cells (two-sided); e = 0 in fluid cells with an in-box non-fluid (air) 6-neighbour;
   *  wall/floor cells keep e; dead-band e := 0 where |e| < densDead. Solve lap(phi) = -e (A = -lap, A phi = e)
   *  with phi = 0 in air, d(phi)/dn = 0 at solids, PCG/MIC(0) tol densTol, only on fluid regions touching air
   *  (others skipped, counted). dx = -alpha grad(phi) h on MAC faces, trilinear, |dx| capped at densCap h,
   *  then push-out (same stage). Velocities and C untouched. */
  /** FIX 3 v3 (ASSERTS Z 2026-10-14e): nbar = P2G splat of particle positions (quadratic B-spline, the velocity
   *  transfer kernel) to cell centres; weights that fall outside the box fold onto the mirror in-box cell. */
  splatCounts() {
    const { nx, ny, nz } = this, ih = 1 / this.h, out = new Float64Array(this.nCells), W = new Float64Array(9), B = [0, 0, 0], n = [nx, ny, nz];
    const fold = (v, m) => (v < 0 ? -1 - v : v >= m ? 2 * m - 1 - v : v);
    for (let p = 0; p < this.count; p++) {
      for (let b = 0; b < 3; b++) { const f = this.x[3 * p + b] * ih - 0.5, base = Math.floor(f - 0.5); B[b] = base; Sim.w3(f - base, W, 3 * b); }
      for (let kk = 0; kk < 3; kk++) { const k = fold(B[2] + kk, nz); for (let jj = 0; jj < 3; jj++) { const j = fold(B[1] + jj, ny), wjk = W[3 + jj] * W[6 + kk];
        for (let ii = 0; ii < 3; ii++) out[fold(B[0] + ii, nx) + nx * (j + ny * k)] += W[ii] * wjk; } } }
    return out;
  }
  densityCorrection() {
    const { nx, ny, nz, h } = this, n = [nx, ny, nz], cs = [1, nx, nx * ny], N = this.nCells;
    const cnt = this.markCells(), FL = this.classify(cnt), nbar = this.splatCounts();
    const stats = { iters: 0, relRes: 0, regions: 0, skipped: 0, moved: 0, capped: 0, maxDx: 0, eSum: 0, nE: 0, nFluid: 0, nAboveDead: 0, nInterior: 0, floorE: [] };
    const reg = new Int32Array(N).fill(-1), air = []; const stack = [];
    const nb = (c, f) => { const i = c % nx, j = ((c / nx) | 0) % ny, k = (c / (nx * ny)) | 0, ijk = [i, j, k];
      for (let a = 0; a < 3; a++) for (const sg of [-1, 1]) { const q = ijk[a] + sg; if (q < 0 || q >= n[a]) continue; f(c + sg * cs[a]); } };
    for (let c = 0; c < N; c++) { if (!FL[c] || reg[c] >= 0) continue; const r = air.length; air.push(false); reg[c] = r; stack.push(c);
      while (stack.length) { const q = stack.pop(); nb(q, (m) => { if (!FL[m]) air[r] = true; else if (reg[m] < 0) { reg[m] = r; stack.push(m); } }); } }
    stats.regions = air.length;
    const E = new Float64Array(N);
    for (let c = 0; c < N; c++) { if (!FL[c]) continue; stats.nFluid++; let airAdj = false; nb(c, (m) => { if (!FL[m]) airAdj = true; });
      if (airAdj) continue; stats.nInterior++; const e = nbar[c] / 8 - 1;
      if (c < nx * ny) stats.floorE.push(e);
      if (Math.abs(e) >= this.densDead) { E[c] = e; stats.nAboveDead++; } }
    // v4 target sum (Z 2026-10-14f): per air-connected region, target_r = sum over interior (non-air-adjacent) cells of
    // (nbar/8 - 1) BEFORE the dead-band; after the dead-band, shift e uniformly over those cells so sum e = target_r.
    // Graded: |sum e - target_r| / n_r <= 1e-12 (n_r = fluid cells in the region).
    const interior = new Uint8Array(N); for (let c = 0; c < N; c++) if (FL[c]) { let aa = false; nb(c, (m) => { if (!FL[m]) aa = true; }); interior[c] = aa ? 0 : 1; }
    { const rs = new Float64Array(air.length), rt = new Float64Array(air.length), rn = new Float64Array(air.length), rN = new Float64Array(air.length);
      for (let c = 0; c < N; c++) if (FL[c]) { rN[reg[c]]++; if (interior[c]) { rs[reg[c]] += E[c]; rt[reg[c]] += nbar[c] / 8 - 1; rn[reg[c]]++; } }
      stats.ePreSum = 0; for (let c = 0; c < N; c++) if (E[c] !== 0) { stats.ePreSum += E[c]; stats.nE++; }
      stats.ePreMean = stats.nE ? stats.ePreSum / stats.nE : 0; stats.regionShiftMax = 0; stats.targetSum = 0; stats.targetMeanMax = 0;
      for (let r = 0; r < air.length; r++) if (air[r] && rn[r]) { const sh = (rt[r] - rs[r]) / rn[r]; stats.regionShiftMax = Math.max(stats.regionShiftMax, Math.abs(sh)); stats.targetSum += rt[r]; stats.targetMeanMax = Math.max(stats.targetMeanMax, Math.abs(rt[r] / rn[r])); }
      for (let c = 0; c < N; c++) if (interior[c] && air[reg[c]] && rn[reg[c]]) E[c] += (rt[reg[c]] - rs[reg[c]]) / rn[reg[c]];
      const s2 = new Float64Array(air.length); for (let c = 0; c < N; c++) if (interior[c]) s2[reg[c]] += E[c];
      stats.targetErrMax = 0; for (let r = 0; r < air.length; r++) if (air[r] && rN[r]) stats.targetErrMax = Math.max(stats.targetErrMax, Math.abs(s2[r] - rt[r]) / rN[r]); }
    const uid = new Int32Array(N).fill(-1), cells = []; let anyE = false; const skippedWithE = new Set();
    for (let c = 0; c < N; c++) if (FL[c]) { if (air[reg[c]]) { uid[c] = cells.length; cells.push(c); if (E[c] !== 0) anyE = true; } else if (E[c] !== 0) skippedWithE.add(reg[c]); }
    stats.skipped = air.filter((x) => !x).length; stats.skippedWithExcess = skippedWithE.size;
    stats.fracAboveDead = stats.nInterior ? stats.nAboveDead / stats.nInterior : 0;
    { const fe = stats.floorE; stats.floorE = fe.length ? { n: fe.length, mean: fe.reduce((x, y) => x + y, 0) / fe.length, min: Math.min(...fe), max: Math.max(...fe), nAbove: fe.filter((x) => Math.abs(x) >= this.densDead).length } : null; }
    this.lastDens = stats; this._lastDx = null; this._lastNbar = nbar;
    if (!anyE) return stats;
    const m = cells.length, sys = { m, diag: new Float64Array(m), pX: new Int32Array(m).fill(-1), pY: new Int32Array(m).fill(-1), pZ: new Int32Array(m).fill(-1), cX: new Float64Array(m), cY: new Float64Array(m), cZ: new Float64Array(m) };
    const b = new Float64Array(m);
    for (let q = 0; q < m; q++) { const c = cells[q], i = c % nx, j = ((c / nx) | 0) % ny, k = (c / (nx * ny)) | 0, ijk = [i, j, k]; let d = 0;
      for (let a = 0; a < 3; a++) for (const side of [0, 1]) { const nbq = ijk[a] + (side ? 1 : -1); if (nbq < 0 || nbq >= n[a]) continue; // wall: Neumann
        const cn = c + (side ? 1 : -1) * cs[a]; d += 1;
        if (uid[cn] >= 0 && side) { (a === 0 ? sys.pX : a === 1 ? sys.pY : sys.pZ)[q] = uid[cn]; (a === 0 ? sys.cX : a === 1 ? sys.cY : sys.cZ)[q] = -1; } }
      sys.diag[q] = d; b[q] = this.densSign * E[c]; if (E[c] !== 0) { stats.eSum += E[c]; stats.nCorr = (stats.nCorr || 0) + 1; } } // A = -lap  =>  A phi = e  <=>  lap(phi) = -e
    stats.eMean = stats.nE ? stats.ePreSum / stats.nE : 0; // mean e over cells above the dead-band, before the volume-neutral shift
    const r = pcgSolve(sys, b, { tol: this.densTol }); stats.iters = r.iters; stats.relRes = r.trueRelRes;
    const phi = (c) => (uid[c] >= 0 ? r.p[uid[c]] : 0), al = this.densAlpha;
    const disp = this.vel.map((v) => new Float64Array(v.length));
    for (let a = 0; a < 3; a++) { const D = this.D[a], V = disp[a];
      for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) { const ii = [i, j, k]; if (ii[a] === 0 || ii[a] === n[a]) continue;
        const hi = i + nx * (j + ny * k), lo = hi - cs[a]; if (uid[hi] < 0 && uid[lo] < 0) continue;
        V[this.idx(a, i, j, k)] = -al * (phi(hi) - phi(lo)) * h; }
      for (let bb = 0; bb < 3; bb++) { const r2 = [[-1, D[0]], [-1, D[1]], [-1, D[2]]]; const [o1, o2] = [0, 1, 2].filter((c) => c !== bb);
        for (let s1 = r2[o1][0]; s1 <= r2[o1][1]; s1++) for (let s2 = r2[o2][0]; s2 <= r2[o2][1]; s2++) for (const [pad, img] of [[-1, 0], [D[bb], D[bb] - 1]]) {
          const ia = [0, 0, 0], ib = [0, 0, 0]; ia[o1] = ib[o1] = s1; ia[o2] = ib[o2] = s2; ia[bb] = pad; ib[bb] = img;
          const ib1 = ib.map((v, c) => Math.min(Math.max(v, 0), D[c] - 1)); V[this.idx(a, ...ia)] = bb === a ? 0 : V[this.idx(a, ...ib1)]; } } }
    const keep = this.vel; this.vel = disp; const cap = this.densCap * h, dxs = new Float64Array(3 * this.count);
    for (let p = 0; p < this.count; p++) { const x = this.x[3 * p], y = this.x[3 * p + 1], z = this.x[3 * p + 2];
      let d0 = this.sample(0, x, y, z), d1 = this.sample(1, x, y, z), d2 = this.sample(2, x, y, z); const L = Math.hypot(d0, d1, d2);
      if (L === 0) continue; stats.moved++; if (L > cap) { const f = cap / L; d0 *= f; d1 *= f; d2 *= f; stats.capped++; }
      stats.maxDx = Math.max(stats.maxDx, Math.min(L, cap) / h); dxs[3 * p] = d0; dxs[3 * p + 1] = d1; dxs[3 * p + 2] = d2;
      this.x[3 * p] += d0; this.x[3 * p + 1] += d1; this.x[3 * p + 2] += d2; }
    this.vel = keep; this._lastDx = dxs;
    stats.nWall = this.wallStrip(); stats.nSep = this.separate();
    return stats;
  }
  // ---------------- step ----------------
  maxSpeed() { let m = 0; for (let p = 0; p < this.count; p++) m = Math.max(m, Math.hypot(this.v[3 * p], this.v[3 * p + 1], this.v[3 * p + 2])); return m; }
  cflDt() { return this.cfl * this.h / (this.maxSpeed() + Math.sqrt(this.g * this.h)); }
  /** advance one frame: n = min(maxSub, ceil(frame/dt_cfl)) equal substeps */
  advanceFrame() {
    const dtc = this.cflDt(), need = Math.max(1, Math.ceil(this.frame / dtc - 1e-12)), n = Math.min(this.maxSub, need);
    const dt = this.frame / (n * this.subMul), cflUsed = dt * (this.maxSpeed() + Math.sqrt(this.g * this.h)) / this.h;
    const capFlag = need > this.maxSub && cflUsed > 1;
    this.frameLog = this.frameLog || []; this.frameLog.push({ frame: this.frameLog.length + 1, t0: this.t, nSub: n, cflUsed, capBinds: capFlag });
    const recs = []; for (let s = 0; s < n * this.subMul; s++) recs.push(this.substep(dt, n * this.subMul)); return recs;
  }
  substep(dt, nSub) {
    const st = {}; const tot = () => { const e = this.particleEnergy(); return e.ke + e.pe; };
    const E0 = tot(), pe0 = this.particleEnergy().pe;
    this.p2g(); this.surfaceThetaMasses(); let g = this.gridKE(); st.p2g = g + pe0 - E0;
    const nGhost = this.ghostFill(); let g2 = this.gridKE(); st.ghost = g2 - g; g = g2;
    this.applyGravity(dt); g2 = this.gridKE(); st.gravity = g2 - g; g = g2;
    const pr = this.project(dt); g2 = this.gridKE(); st.pressure = g2 - g; g = g2;
    // velocity extension as its own stage, measured on what the particles pick up in G2P:
    //   g2p       = KE_p(G2P from grid with non-fluid faces zeroed) - grid energy
    //   extension = KE_p(G2P from extended grid) - KE_p(G2P from zeroed grid)
    this.zeroInvalid(); const keNoExt = this.g2pKE();
    this.extrapolate();
    this.g2p(); let e = tot(); st.g2p = keNoExt + pe0 - (g + pe0); st.extension = e - (keNoExt + pe0);
    this.advect(dt); let e2 = tot(); st.advect = e2 - e; e = e2;
    const nWall = this.wallStrip(); const nSep = this.separate(); e2 = tot(); st.pushout = e2 - e;
    { const b0 = this.particleEnergy(); if (this.useDensFix) this.densityCorrection(); else this.lastDens = null; const b1 = this.particleEnergy();
      st.densfix = b1.ke + b1.pe - (b0.ke + b0.pe); this._densKE = b1.ke - b0.ke; this._densPE = b1.pe - b0.pe; }
    for (const k of STAGES) this.stageCum[k] += st[k];
    const Pz0 = this._lastPz ?? this.momentum().Pz;
    this.t += dt; this.step++;
    const pe = this.particleEnergy();
    const rec = { step: this.step, t: this.t, dt, nSub, cflDt: this.cflDt(), E: pe.ke + pe.pe, KE: pe.ke, PE: pe.pe, stage: st, stageCum: { ...this.stageCum },
      pcgIters: pr.iters, pcgRelRes: pr.relRes, pcgTrueRelRes: pr.trueRelRes, rhsNorm: pr.bNorm, maxDivDt: pr.maxDivDt, fluidCells: pr.fluidCells,
      nGhost, nWall, nSep, maxU: this.maxSpeed(), mass: this.count * this.mp, ...this.momentum() };
    rec.densKE = this._densKE; rec.densPE = this._densPE; rec.dens = this.lastDens; rec.dPzdt = (rec.Pz - Pz0) / dt; this._lastPz = rec.Pz;
    if (this.onSubstep) this.onSubstep(this, rec);
    this.log.push(rec); return rec;
  }
  momentum() {
    let px = 0, py = 0, pz = 0, cz = 0;
    for (let p = 0; p < this.count; p++) { px += this.v[3 * p]; py += this.v[3 * p + 1]; pz += this.v[3 * p + 2]; cz += this.x[3 * p + 2]; }
    return { Px: px * this.mp, Py: py * this.mp, Pz: pz * this.mp, wCom: pz / this.count, zCom: cz / this.count };
  }
}
module.exports = { Sim, STAGES };
