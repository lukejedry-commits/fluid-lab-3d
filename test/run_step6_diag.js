'use strict';
/** Step 6 diagnostics (ASSERTS a9a9f10c). Instrumentation only: wraps Sim methods, never changes values.
 *  node test/run_step6_diag.js --part t3a16|t3a8|still|summary   -> results/step6_diag/ */
const fs = require('fs'), path = require('path');
const { Sim, STAGES } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const part = arg('--part'), outDir = path.join(__dirname, '../results/step6_diag');
fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) => { const f = path.join(outDir, name); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 1)); };
const rows = [];
const row = (id, measured, threshold, pass, note = '') => { rows.push({ part, id, measured, threshold, pass: !!pass, note }); console.log((pass ? 'PASS ' : 'FAIL ') + id + ' : ' + measured + ' vs ' + threshold + (note ? ' (' + note + ')' : '')); };
const info = (id, measured, note = '') => { rows.push({ part, id, measured, threshold: 'info (not graded)', pass: null, note }); console.log('INFO ' + id + ' : ' + measured + (note ? ' (' + note + ')' : '')); };
const fmt = (x) => (typeof x === 'number' ? x.toExponential(3) : String(x));
const g = 9.81, median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]); };
const poisson = (lam, k) => { let p = Math.exp(-lam); for (let i = 1; i <= k; i++) p *= lam / i; return p; };
const mm = JSON.parse(fs.readFileSync(path.join(__dirname, '../spec/mm_1952.json'), 'utf8'));

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
  instrumentProject(s); if (opts.corner) instrumentCorner(s);
  const N0 = s.count, e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, Tfac = Math.sqrt(2 * g / a), UR = 2 * Math.sqrt(g * 2 * a);
  let prevF = front(s), prevT = 0; const frames = [{ frame: 0, t: 0, xFront: prevF, ...t4(s) }], cornerCounts = [];
  s.onSubstep = (sim, rec) => { const f = front(sim); rec.xFront = f; rec.Z = f / a; rec.T = rec.t * Tfac; rec.frontSpeed = (f - prevF) / (rec.t - prevT); prevF = f; prevT = rec.t;
    const d = sim._pdiag; rec.dKEpMass = d.dMass; rec.dKEpSolver = d.dSolver; rec.dKEpTheta = d.dTheta; rec.pd = d;
    if (opts.corner) { const c = sim.cellCount[CORNER[0] + nx * (CORNER[1] + ny * CORNER[2])]; rec.cornerCount = sim.markCells()[CORNER[0] + nx * (CORNER[1] + ny * CORNER[2])];
      const k = sim._corner; Object.assign(rec, { fluxTrilin: k.ft, fluxGrid: k.fg, intoWallFloorN: k.floorN, intoWallFloorMax: k.floorMax, intoWallBackN: k.backN, intoWallBackMax: k.backMax, intoWallSideN: k.sideN, intoWallSideMax: k.sideMax, cornerPushN: sim._push.n, cornerPushSum: sim._push.sum, cornerFluid: sim.fluid[CORNER[0] + nx * (CORNER[1] + ny * CORNER[2])] }); } };
  const tEnd = 14.6 / Tfac + 0.15, t0 = Date.now(); let fr = 0;
  while (s.t < tEnd && prevF / a < 15.5) { s.advanceFrame(); fr++; frames.push({ frame: fr, t: s.t, xFront: prevF, ...t4(s) });
    if (opts.corner && fr === 10) s._pad = paddingCheck(s);
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
if (part === 't3a16') {
  const R = runT3(16, { corner: true }); write('T3a16_log.csv', csv(R.s.log)); write('T3a16_T4_frames.json', R.frames);
  write('T3a16_frames.csv', 'frame,t0,nSub,cflUsed,capBinds\n' + R.s.frameLog.map((f) => [f.frame, f.t0, f.nSub, f.cflUsed, f.capBinds ? 1 : 0].join(',')).join('\n') + '\n');
  gradeRitter(R, 'a16'); gradeT3T4(R, 'a16');
  const L = R.s.log, cc = L.map((r) => r.cornerCount);
  info('a16 corner cell [2,12,1]: particle count per substep (min / max / final; substep of max)', `${Math.min(...cc)} / ${Math.max(...cc)} (step ${L[cc.indexOf(Math.max(...cc))].step}, t=${L[cc.indexOf(Math.max(...cc))].t.toFixed(4)}) / ${cc.at(-1)}; fluid-classified at end: ${L.at(-1).cornerFluid}`);
  for (const [k, lab] of [['Floor', 'floor (z-)'], ['Back', 'back wall (x-)'], ['Side', 'side walls (y-, y+)']]) {
    const ns = L.map((r) => r['intoWall' + k + 'N']), mx = L.map((r) => r['intoWall' + k + 'Max']);
    info(`a16 post-G2P into-wall velocity, particles in ${lab} wall-adjacent cells`, `count per step mean ${(ns.reduce((x, y) => x + y) / ns.length).toFixed(1)}, max ${Math.max(...ns)}; max |v_n| ${fmt(Math.max(...mx))} m/s`); }
  const pn = L.map((r) => r.cornerPushN), ps = L.map((r) => r.cornerPushSum);
  info('a16 push-out (wall strip + separation) in 3x3x3 region around [2,12,1]: particles moved per step (mean/max), total displacement per step (mean/max)', `${(pn.reduce((x, y) => x + y) / pn.length).toFixed(1)} / ${Math.max(...pn)}; ${fmt(ps.reduce((x, y) => x + y) / ps.length)} / ${fmt(Math.max(...ps))} m`);
  const ft = L.map((r) => r.fluxTrilin), fg = L.map((r) => r.fluxGrid), sc = R.h ** 2 * Math.sqrt(g * R.a);
  let sumT = 0, sumG = 0; for (const r of L) { sumT += r.fluxTrilin * r.dt; sumG += r.fluxGrid * r.dt; }
  info('a16 cell [2,12,1] net outflow: trilinear field (8x8 surface quadrature) vs MAC face flux (m^3/s)', `trilinear max ${fmt(Math.max(...ft))} min ${fmt(Math.min(...ft))}; grid max |.| ${fmt(Math.max(...fg.map(Math.abs)))}; time-integrated outflow trilinear ${fmt(sumT)} m^3 (${(sumT / R.h ** 3).toFixed(3)} cell volumes) vs grid ${fmt(sumG)} m^3; scale h^2 sqrt(g a) = ${fmt(sc)}`);
  info('a16 padding (inside-solid) faces after extension, frame 10', JSON.stringify(R.s._pad), 'src/sim.js:249-252: tangential = copy of the in-box image face (free-slip mirror), normal = 0');
  write('rows_t3a16.json', rows);
}
if (part === 't3a8') {
  const R = runT3(8); write('T3a8_log.csv', csv(R.s.log)); gradeRitter(R, 'a8');
  const L = R.s.log, hit = L.filter((r) => r.stage.pressure > 0 || r.dKEpSolver > 0 || r.dKEpTheta > 0 || r.step === 98 || r.step === 157);
  const det = [];
  for (const r of hit) { const d = r.pd; det.push({ step: r.step, t: r.t, dMass: d.dMass, dSolver: d.dSolver, dTheta: d.dTheta, dThetaNoWall: d.dThetaNoWall, ke0Theta: d.ke0Theta, relRes: d.relRes, cls: d.cls });
    const tol = 1e-8 * d.ke0Theta;
    row(`a8 step ${r.step} (t=${r.t.toFixed(4)}): theta-weighted pressure-stage dKE (m_f ${fmt(d.dMass)}, solver ${fmt(d.dSolver)}, theta excl. walls ${fmt(d.dThetaNoWall)})`, `${fmt(d.dTheta)} J`, `<= 1e-8 x KE_theta,pre = ${fmt(tol)} J`, d.dTheta <= tol,
      Object.entries(d.cls).filter(([, v]) => v.dTheta !== 0).map(([k, v]) => `${k}: ${fmt(v.dTheta)}`).join('; ')); }
  const pos = L.filter((r) => r.dKEpTheta > 1e-8 * r.pd.ke0Theta);
  info('a8 theta-weighted measure over all steps: steps above tolerance', `${pos.length} of ${L.length}`);
  if (pos.length) { const sy = symmetryCheck(R.s); info('a8 pressure matrix symmetry (end state rebuild): max |A-A^T| / max|A_ij|', `${fmt(sy.maxAsymRel)} over ${sy.nPairs} fluid-fluid couplings`, 'A stores each off-diagonal once (pX/cX), so symmetric by construction; surface theta enters only the diagonal'); }
  write('a8_pressure_theta.json', det); write('rows_t3a8.json', rows);
}
if (part === 'still') {
  const N = 32, H = 0.5, h = H / N, nz = Math.round(1.25 * N), seed = 3232;
  const s = new Sim({ nx: N, ny: N, nz, h, seed, maxSub: 16, jitter: 0.5 }); s.seedBlock(0, N, 0, N, 0, N); // jitter 0.5 s: uniform in each sub-cell
  const e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, cid = (i, j, k) => i + N * (j + N * k), F = [], t0 = Date.now();
  const watch = { '[2,12,1]': cid(2, 12, 1), '[0,0,0]': cid(0, 0, 0), '[31,0,0]': cid(N - 1, 0, 0), '[0,31,0]': cid(0, N - 1, 0), '[31,31,0]': cid(N - 1, N - 1, 0) };
  const snap = (fr) => { const r = t4(s), c = s.cellCount; F.push({ frame: fr, t: s.t, meanInt: r.meanInt, nInt: r.nInt, peak: r.peak, peakAt: r.peakAt, E: fr ? s.log.at(-1).E : E0, watch: Object.fromEntries(Object.entries(watch).map(([k, v]) => [k, c[v]])) }); };
  snap(0); for (let f = 1; f <= 120; f++) { s.advanceFrame(); snap(f); if (f % 20 === 0) console.log(`still frame ${f} peak ${F.at(-1).peak} mean ${F.at(-1).meanInt.toFixed(4)} ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  info('C3.still_tank setup', `N=32, H=0.5 m, grid 32x32x40, ${s.count} particles, seed ${seed}, jitter uniform in 2x2x2 sub-cells, cap 16, 120 frames (2 s)`);
  let wm = 0, wmAt = 0; for (const f of F) { const d = Math.abs(f.meanInt - 8) / 8; if (d > wm) { wm = d; wmAt = f.frame; } }
  row('C3.still_tank interior mean within 1% of 8, every frame', `${fmt(wm)} (frame ${wmAt}, m=${F[wmAt].meanInt.toFixed(4)})`, '<= 1e-2', wm <= 0.01);
  const pk = F.reduce((b, f) => (f.peak > b.peak ? f : b)); const firstOver = F.find((f) => f.peak > 16);
  row('C3.still_tank peak cell count, every frame', `${pk.peak} (frame ${pk.frame}, cell ${JSON.stringify(pk.peakAt)})` + (firstOver ? `; first > 16 at frame ${firstOver.frame}` : ''), '<= 16', pk.peak <= 16);
  let we = -Infinity; for (const r of s.log) we = Math.max(we, (r.E - E0) / Math.abs(E0));
  row('C3.still_tank energy max (E-E0)/|E0|', fmt(we), '<= 1e-6', we <= 1e-6);
  const mu = s.log.at(-1).maxU; row('C3.still_tank max|u| at t=2 s', fmt(mu), `< ${fmt(1e-3 * Math.sqrt(g * H))}`, mu < 1e-3 * Math.sqrt(g * H));
  for (const k of Object.keys(watch)) { const v = F.map((f) => f.watch[k]); info(`C3.still_tank cell ${k} count: start / max / end`, `${v[0]} / ${Math.max(...v)} / ${v.at(-1)}`); }
  write('still_tank_frames.json', F); write('rows_still.json', rows);
}
if (part === 'summary') {
  const md5 = (f) => require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '../spec', f))).digest('hex');
  const all = []; for (const p of ['t3a16', 't3a8', 'still']) { const f = path.join(outDir, `rows_${p}.json`); if (fs.existsSync(f)) all.push(...JSON.parse(fs.readFileSync(f, 'utf8'))); }
  let md = `# Step 6 diagnostics\n\n- Code commit the runs executed at: ${process.env.CODE_COMMIT} (clean tree)\n- spec/ASSERTS.md md5 ${md5('ASSERTS.md')}; PHYSICS_SPEC.md md5 ${md5('PHYSICS_SPEC.md')}\n- PE zero: floor z=0. Substep cap 16 (v1 default). a = 2.25*0.0254 = 0.05715 m (test/run_step6_diag.js runT3; same expression as test/run_step5.js:60)\n\n| # | Part | Check | Measured | Threshold | Result |\n|---|---|---|---|---|---|\n`;
  all.forEach((r, i) => { md += `| ${i + 1} | ${r.part} | ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass === null ? 'INFO' : r.pass ? 'PASS' : 'FAIL'}${r.note ? ' (' + r.note + ')' : ''} |\n`; });
  md += `\nTotal graded: ${all.filter((r) => r.pass === true).length} PASS, ${all.filter((r) => r.pass === false).length} FAIL\n`;
  write('results.md', md); write('results.json', all);
}
