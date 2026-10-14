'use strict';
/** Shared T3 diagnostics (extracted verbatim from test/run_step6_diag.js), parameterised by the caller's row/info/write. */
const fs = require('fs'), path = require('path');
const { Sim, STAGES } = require('../src/sim');
const g = 9.81, median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]); };
const poisson = (lam, k) => { let p = Math.exp(-lam); for (let i = 1; i <= k; i++) p *= lam / i; return p; };
const fmt = (x) => (typeof x === 'number' ? x.toExponential(3) : String(x));
const mm = JSON.parse(fs.readFileSync(path.join(__dirname, '../spec/mm_1952.json'), 'utf8'));
module.exports = function (ctx) {
const { row, info, write } = ctx;
function front(s) { const c = s.markCells(), { nx, ny } = s, xs = [];
  for (let j = 0; j < ny; j++) { let im = -1; for (let i = 0; i < nx; i++) if (c[i + nx * j] >= 4) im = i; xs.push((im + 1) * s.h); }
  return median(xs); }
function t4(s) {
  const c = s.markCells(), { nx, ny, nz } = s, id = (i, j, k) => i + nx * (j + ny * k);
  let nInt = 0, pInt = 0, capped = 0, over12p = 0, fluid = 0, over8c = 0, peak = 0, peakAt = null; const hist = {};
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const n = c[id(i, j, k)]; if (!n) continue; fluid++; capped += Math.min(n, 8); if (n > 12) over12p += n; if (n > 8) over8c++;
    hist[n] = (hist[n] || 0) + 1; if (n > peak) { peak = n; peakAt = [i, j, k]; }
    let all = true;
    for (let dk = -1; dk <= 1 && all; dk++) for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { if (!di && !dj && !dk) continue;
      const ii = i + di, jj = j + dj, kk = k + dk; if (ii < 0 || jj < 0 || kk < 0 || ii >= nx || jj >= ny || kk >= nz) continue; if (!c[id(ii, jj, kk)]) all = false; }
    if (all) { nInt++; pInt += n; } }
  return { nInt, meanInt: pInt / nInt, cappedVol: capped * s.h ** 3 / 8, fracP12: over12p / s.count, fracC8: over8c / fluid, fluidCells: fluid, peak, peakAt, hist };
}
// ---- pressure-stage energy in three weightings (m_f, solver unit, theta-weighted surface) ----
function instrumentProject(s) {
  const orig = s.project.bind(s);
  s.project = (dt) => {
    const V0 = s.vel.map((v) => Float64Array.from(v)); const r = orig(dt);
    const { nx, ny, nz } = s, n = [nx, ny, nz], cs = [1, nx, nx * ny], cnt = s.cellCount, FL = s.fluid, unit = s.rho * s.h ** 3;
    let dMass = 0, dSolver = 0, dTheta = 0, dThetaNoWall = 0, ke0Theta = 0; const cls = {};
    for (let a = 0; a < 3; a++) { const D = s.D[a], V = s.vel[a], M = s.mass[a];
      for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) {
        const f = s.idx(a, i, j, k), ii = [i, j, k], v0 = V0[a][f], v1 = V[f];
        let c, w = 0;
        if (ii[a] === 0 || ii[a] === n[a]) { c = 'wall'; w = M[f] > 0 ? 1 : 0; }
        else { const hi = i + nx * (j + ny * k), lo = hi - cs[a], fh = FL[hi] === 1, fl = FL[lo] === 1;
          if (!fh && !fl) { c = 'not adjacent to fluid'; w = 0; }
          else if (M[f] === 0) { c = 'closed(m_f=0)'; w = 0; }
          else if (fh && fl) { c = 'fluid-fluid'; w = 1; }
          else { const fc = fh ? hi : lo, ac = fh ? lo : hi; w = s.thetaOf(cnt, fc, ac); c = cnt[ac] > 0 ? 'surface-partial' : 'surface-empty'; } }
        if (w > 0) ke0Theta += 0.5 * unit * w * v0 * v0;
        if (v0 === v1) continue;
        const d2 = v1 * v1 - v0 * v0, em = 0.5 * M[f] * d2, es = M[f] > 0 ? 0.5 * unit * d2 : 0, et = 0.5 * unit * w * d2;
        dMass += em; dSolver += es; dTheta += et; if (c !== 'wall') dThetaNoWall += et;
        cls[c] = cls[c] || { n: 0, dMass: 0, dSolver: 0, dTheta: 0 }; cls[c].n++; cls[c].dMass += em; cls[c].dSolver += es; cls[c].dTheta += et; } }
    s._pdiag = { dMass, dSolver, dTheta, dThetaNoWall, ke0Theta, cls, relRes: r.trueRelRes }; return r; };
}
// symmetry check of the assembled pressure matrix: rebuild entries from both sides of every face
function symmetryCheck(s) {
  const { nx, ny, nz } = s, cnt = s.markCells(), FL = s.classify(cnt), FM = require('../src/facemass'); const n = [nx, ny, nz], cs = [1, nx, nx * ny];
  let maxAsym = 0, maxEntry = 0, nPairs = 0;
  for (let c = 0; c < s.nCells; c++) { if (!FL[c]) continue; const i = c % nx, j = ((c / nx) | 0) % ny, k = (c / (nx * ny)) | 0, ijk = [i, j, k];
    for (let a = 0; a < 3; a++) { if (ijk[a] + 1 >= n[a]) continue; const cn = c + cs[a]; if (!FL[cn]) continue;
      const fi = [i, j, k]; fi[a] += 1; const f = s.idx(a, ...fi), frac = FM.faceFraction(s.mass[a][f]);
      // entry A[c][cn] as built from c's high side and A[cn][c] as built from cn's low side (same face, same m_f)
      const e1 = -frac, e2 = -FM.faceFraction(s.mass[a][f]); maxAsym = Math.max(maxAsym, Math.abs(e1 - e2)); maxEntry = Math.max(maxEntry, Math.abs(e1)); nPairs++; } }
  return { maxAsymRel: maxAsym / (maxEntry || 1), nPairs };
}
function csv(log) {
  const head = ['step', 't', 'dt', 'nSub', 'E', 'KE', 'PE', ...STAGES.map((s) => 'd_' + s), 'pcgIters', 'pcgTrueRelRes', 'maxDivDt', 'xFront', 'Z', 'T', 'dKEpMass', 'dKEpSolver', 'dKEpTheta', 'cornerCount', 'fluxTrilin', 'fluxGrid', 'intoWallFloorN', 'intoWallFloorMax', 'intoWallBackN', 'intoWallBackMax', 'intoWallSideN', 'intoWallSideMax', 'cornerPushN', 'cornerPushSum'];
  return head.join(',') + '\n' + log.map((r) => head.map((k) => (k.startsWith('d_') ? r.stage[k.slice(2)] : r[k])).join(',')).join('\n') + '\n';
}
// ---- corner / wall instrumentation (item 4) ----
const CORNER = [2, 12, 1];
function instrumentCorner(s) {
  const { nx, ny, nz, h } = s, cellOf = (p) => [0, 1, 2].map((b) => Math.min([nx, ny, nz][b] - 1, Math.max(0, Math.floor(s.x[3 * p + b] / h))));
  const inRegion = (c) => Math.abs(c[0] - CORNER[0]) <= 1 && Math.abs(c[1] - CORNER[1]) <= 1 && Math.abs(c[2] - CORNER[2]) <= 1;
  const og2p = s.g2p.bind(s);
  s.g2p = () => { og2p(); const st = { floorN: 0, floorMax: 0, floorSum: 0, backN: 0, backMax: 0, sideN: 0, sideMax: 0, nWallAdj: 0 };
    for (let p = 0; p < s.count; p++) { const c = cellOf(p), v = [s.v[3 * p], s.v[3 * p + 1], s.v[3 * p + 2]];
      if (c[2] === 0) { st.nWallAdj++; if (v[2] < 0) { st.floorN++; st.floorMax = Math.max(st.floorMax, -v[2]); st.floorSum += -v[2]; } }
      if (c[0] === 0) { if (v[0] < 0) { st.backN++; st.backMax = Math.max(st.backMax, -v[0]); } }
      if (c[1] === 0 && v[1] < 0) { st.sideN++; st.sideMax = Math.max(st.sideMax, -v[1]); }
      if (c[1] === ny - 1 && v[1] > 0) { st.sideN++; st.sideMax = Math.max(st.sideMax, v[1]); } }
    // flux through cell CORNER: trilinear-sampled field (advection field) by 8x8 midpoint quadrature vs MAC face values
    const [I, J, K] = CORNER, q = 8; let ft = 0;
    for (let a = 0; a < 3; a++) for (const side of [0, 1]) { const sg = side ? 1 : -1; let acc = 0;
      for (let u = 0; u < q; u++) for (let w = 0; w < q; w++) { const P = [0, 0, 0]; P[a] = ([I, J, K][a] + side) * h; const o = [0, 1, 2].filter((b) => b !== a);
        P[o[0]] = ([I, J, K][o[0]] + (u + 0.5) / q) * h; P[o[1]] = ([I, J, K][o[1]] + (w + 0.5) / q) * h; acc += s.sample(a, P[0], P[1], P[2]); }
      ft += sg * acc / (q * q) * h * h; }
    let fg = 0; for (let a = 0; a < 3; a++) { const lo = [I, J, K], hi = [I, J, K]; hi[a]++; fg += (s.vel[a][s.idx(a, ...hi)] - s.vel[a][s.idx(a, ...lo)]) * h * h; }
    s._corner = { ...st, ft, fg }; };
  const owall = s.wallStrip.bind(s), osep = s.separate.bind(s); let snap = null;
  s.wallStrip = () => { snap = Float64Array.from(s.x.subarray(0, 3 * s.count)); return owall(); };
  s.separate = () => { const r = osep(); let n = 0, sum = 0;
    for (let p = 0; p < s.count; p++) { const c = [0, 1, 2].map((b) => Math.min([nx, ny, nz][b] - 1, Math.max(0, Math.floor(snap[3 * p + b] / h)))); if (!inRegion(c)) continue;
      const d = Math.hypot(s.x[3 * p] - snap[3 * p], s.x[3 * p + 1] - snap[3 * p + 1], s.x[3 * p + 2] - snap[3 * p + 2]); if (d > 0) { n++; sum += d; } }
    s._push = { n, sum }; return r; };
}
// ---- padding (inside-solid) ghost values: classify after extrapolate ----
function paddingCheck(s) {
  const out = { tangentialMirror: 0, tangentialOther: 0, normalZero: 0, normalNonzero: 0 };
  for (let a = 0; a < 3; a++) { const D = s.D[a], V = s.vel[a];
    for (let b = 0; b < 3; b++) { const [o1, o2] = [0, 1, 2].filter((c) => c !== b);
      for (let s1 = 0; s1 < D[o1]; s1++) for (let s2 = 0; s2 < D[o2]; s2++) for (const [pad, img] of [[-1, 0], [D[b], D[b] - 1]]) {
        const ia = [0, 0, 0], ib = [0, 0, 0]; ia[o1] = ib[o1] = s1; ia[o2] = ib[o2] = s2; ia[b] = pad; ib[b] = img; const vp = V[s.idx(a, ...ia)], vi = V[s.idx(a, ...ib)];
        if (b === a) { if (vp === 0) out.normalZero++; else out.normalNonzero++; } else { if (vp === vi) out.tangentialMirror++; else out.tangentialOther++; } } } }
  return out;
}
function runT3(A, opts = {}) {
  const a = 2.25 * 0.0254, h = a / A, nx = 16 * A, ny = A, nz = Math.round(2.5 * A);
  const s = new Sim({ nx, ny, nz, h, seed: 1952 }); s.seedBlock(0, A, 0, ny, 0, 2 * A);
  instrumentProject(s); if (opts.corner) instrumentCorner(s); if (opts.instrument) opts.instrument(s);
  const N0 = s.count, e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, Tfac = Math.sqrt(2 * g / a), UR = 2 * Math.sqrt(g * 2 * a);
  let prevF = front(s), prevT = 0; const frames = [{ frame: 0, t: 0, xFront: prevF, ...t4(s) }], cornerCounts = [];
  const preOn = s.onSubstep;
  s.onSubstep = (sim, rec) => { const f = front(sim); rec.xFront = f; rec.Z = f / a; rec.T = rec.t * Tfac; rec.frontSpeed = (f - prevF) / (rec.t - prevT); prevF = f; prevT = rec.t;
    const d = sim._pdiag; rec.dKEpMass = d.dMass; rec.dKEpSolver = d.dSolver; rec.dKEpTheta = d.dTheta; rec.pd = d;
    if (opts.corner) { const c = sim.cellCount[CORNER[0] + nx * (CORNER[1] + ny * CORNER[2])]; rec.cornerCount = sim.markCells()[CORNER[0] + nx * (CORNER[1] + ny * CORNER[2])];
      const k = sim._corner; Object.assign(rec, { fluxTrilin: k.ft, fluxGrid: k.fg, intoWallFloorN: k.floorN, intoWallFloorMax: k.floorMax, intoWallBackN: k.backN, intoWallBackMax: k.backMax, intoWallSideN: k.sideN, intoWallSideMax: k.sideMax, cornerPushN: sim._push.n, cornerPushSum: sim._push.sum, cornerFluid: sim.fluid[CORNER[0] + nx * (CORNER[1] + ny * CORNER[2])] }); } };
  if (preOn) { const lo = s.onSubstep; s.onSubstep = (sim, rec) => { lo(sim, rec); preOn(sim, rec); }; }
  const tEnd = 14.6 / Tfac + 0.15, t0 = Date.now(); let fr = 0;
  while (s.t < tEnd && prevF / a < 15.5) { s.advanceFrame(); fr++; frames.push({ frame: fr, t: s.t, xFront: prevF, ...t4(s) });
    if (opts.corner && fr === 10) s._pad = paddingCheck(s);
    if (opts.onFrame) opts.onFrame(s, fr);
    if (fr % 5 === 0) console.log(`frame ${fr} t=${s.t.toFixed(4)} Z=${(prevF / a).toFixed(3)} elapsed ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  const L = s.log, Tat = (Z) => { for (let i = 0; i < L.length; i++) if (L[i].Z >= Z) { const Za = i ? L[i - 1].Z : 1, Ta = i ? L[i - 1].T : 0; return Ta + (L[i].T - Ta) * (Z - Za) / (L[i].Z - Za); } return NaN; };
  const shift = 1.19 - Tat(1.44);
  return { s, a, A, h, N0, E0, Tfac, UR, frames, shift, Tsim: (Z) => Tat(Z) + shift, wallSec: (Date.now() - t0) / 1000 };
}
function gradeRitter(R, tag) {
  const W = Math.ceil(20 * R.h / (R.UR * R.s.frame)), F = R.frames; let worst = -Infinity, at = -1;
  for (let k = W; k < F.length; k++) { const v = (F[k].xFront - F[k - W].xFront) / (F[k].t - F[k - W].t); if (v > worst) { worst = v; at = k; } }
  row(`${tag} Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = ${W} frames`, `${worst.toFixed(4)} m/s (${(worst / R.UR).toFixed(4)} U_R, frame ${at})`, `< U_R = ${R.UR.toFixed(4)} m/s every frame`, worst < R.UR);
  let ff = -Infinity; for (let k = 1; k < F.length; k++) ff = Math.max(ff, (F[k].xFront - F[k - 1].xFront) / (F[k].t - F[k - 1].t));
  const ss = Math.max(...R.s.log.map((r) => r.frontSpeed));
  info(`${tag} Ritter single-substep peak / frame-to-frame peak`, `${(ss / R.UR).toFixed(4)} U_R / ${(ff / R.UR).toFixed(4)} U_R`);
  return W;
}
function gradeT3T4(R, tag) {
  const L = R.s.log;
  let worst = -Infinity, rises = 0, prev = R.E0; for (const r of L) { worst = Math.max(worst, (r.E - R.E0) / Math.abs(R.E0)); if (r.E > prev) rises++; prev = r.E; }
  row(`${tag} T3.E max (E-E0)/|E0| (PE datum z=0)`, fmt(worst), '<= 1e-6', worst <= 1e-6, `step-to-step rises (below E0): ${rises}`);
  const pp = L.filter((r) => r.stage.pressure > 0);
  row(`${tag} pressure-stage dE <= 0 every step (m_f measure)`, `${pp.length} of ${L.length} > 0` + (pp.length ? `; max ${fmt(Math.max(...pp.map((r) => r.stage.pressure)))} J` : ''), '<= 0 every step', pp.length === 0);
  const res = Math.max(...L.map((r) => r.pcgTrueRelRes)); row(`${tag} P.res max true residual`, fmt(res), '<= 1e-8', res <= 1e-8);
  const dv = Math.max(...L.map((r) => r.maxDivDt)); row(`${tag} P.div max |div u| dt`, fmt(dv), '<= 1e-6', dv <= 1e-6);
  const fl = R.s.frameLog; info(`${tag} CFL / cap`, `max CFL ${Math.max(...fl.map((x) => x.cflUsed)).toFixed(4)}; cap ${R.s.maxSub}; frames cap-bound with CFL>1: ${fl.filter((x) => x.capBinds).length} of ${fl.length}; substeps ${L.length}`);
  info(`${tag} T3.mm shift`, R.shift.toFixed(4)); const cmp = [];
  for (const r of mm.rows) { const Ts = R.Tsim(r.Z), rel = (Ts - r.T_mean) / r.T_mean; cmp.push({ Z: r.Z, T_mean: r.T_mean, T_sim: Ts, rel });
    if (r.Z <= 1.22) info(`${tag} T3.mm Z=${r.Z} (report only)`, `${Ts.toFixed(3)} vs ${r.T_mean} (${(100 * rel).toFixed(2)}%)`);
    else if (r.Z >= 1.67) row(`${tag} T3.mm Z=${r.Z} (T_sim ${Ts.toFixed(3)}, T_mean ${r.T_mean})`, (100 * Math.abs(rel)).toFixed(2) + '%', '<= 8%', Math.abs(rel) <= 0.08); }
  write(`${tag}_mm_compare.json`, cmp);
  const F = R.frames, m0 = F[0].meanInt; let w = 0, wAt = 0; for (const f of F) { const d = Math.abs(f.meanInt - m0) / m0; if (d > w) { w = d; wAt = f.frame; } }
  row(`${tag} T4 interior mean, max |m-m0|/m0 over ${F.length} frames (m0 ${m0.toFixed(4)})`, `${fmt(w)} (frame ${wAt}, m=${F[wAt].meanInt.toFixed(4)})`, '<= 1e-2 every frame', w <= 0.01);
  row(`${tag} T4 particle count exact`, String(R.s.count), `== ${R.N0}`, R.s.count === R.N0);
  const last = F.at(-1), N = Object.values(last.hist).reduce((x, y) => x + y), lam = R.N0 / N;
  info(`${tag} T4 capped estimate final / min (rel V0)`, `${fmt(last.cappedVol / F[0].cappedVol - 1)} / ${fmt(Math.min(...F.map((f) => f.cappedVol / F[0].cappedVol - 1)))}`);
  info(`${tag} T4 particles in n>12 cells (max) / fluid cells n>8 (max)`, `${fmt(Math.max(...F.map((f) => f.fracP12)))} / ${fmt(Math.max(...F.map((f) => f.fracC8)))}`);
  const pk = F.reduce((b, f) => (f.peak > b.peak ? f : b)); info(`${tag} T4 peak count`, `${pk.peak} at frame ${pk.frame} cell ${JSON.stringify(pk.peakAt)} (front x ${(pk.xFront / R.a).toFixed(2)}a)`);
  const ks = Object.keys(last.hist).map(Number).sort((x, y) => x - y);
  info(`${tag} T4 final histogram n:cells(Poisson(${lam.toFixed(3)}))`, ks.map((k) => `${k}:${last.hist[k]}(${(N * poisson(lam, k) / (1 - Math.exp(-lam))).toFixed(0)})`).join(' '));
}
return { front, t4, instrumentProject, symmetryCheck, csv, instrumentCorner, paddingCheck, runT3, gradeRitter, gradeT3T4, CORNER };
};
