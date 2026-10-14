'use strict';
/** Step 5: T3/T4 re-grade under ASSERTS section Z (md5 c0351431), cap-16 info run, a=8 pressure-stage diagnosis.
 *  node test/run_step5.js --part regrade|cap16|a8|summary --out <folder>
 *  Same T3 config as test/run_step4_t3.js (seed 1952, column a x a x 2a, grid 16a x a x 2.5a); only instrumentation added. */
const fs = require('fs'), path = require('path');
const { Sim, STAGES } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const part = arg('--part'), outDir = path.join(__dirname, '../results', arg('--out'));
fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) => { const f = path.join(outDir, name); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 1)); };
const rows = [];
const row = (id, measured, threshold, pass, note = '') => { rows.push({ part, id, measured, threshold, pass: !!pass, note }); console.log((pass ? 'PASS ' : 'FAIL ') + id + ' : ' + measured + ' vs ' + threshold + (note ? ' (' + note + ')' : '')); };
const info = (id, measured, note = '') => { rows.push({ part, id, measured, threshold: 'info (not graded)', pass: null, note }); console.log('INFO ' + id + ' : ' + measured + (note ? ' (' + note + ')' : '')); };
const fmt = (x) => (typeof x === 'number' ? x.toExponential(3) : String(x));
const g = 9.81, median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]); };
const poisson = (lam, k) => { let p = Math.exp(-lam); for (let i = 1; i <= k; i++) p *= lam / i; return p; };

function csv(log) {
  const head = ['step', 't', 'dt', 'nSub', 'E', 'KE', 'PE', ...STAGES.map((s) => 'd_' + s), ...STAGES.map((s) => 'cum_' + s), 'pcgIters', 'pcgTrueRelRes', 'maxDivDt', 'fluidCells', 'nSep', 'maxU', 'xFront', 'Z', 'T', 'frontSpeed', 'dKEpSolver'];
  return head.join(',') + '\n' + log.map((r) => head.map((k) => (k.startsWith('d_') ? r.stage[k.slice(2)] : k.startsWith('cum_') ? r.stageCum[k.slice(4)] : r[k])).join(',')).join('\n') + '\n';
}
// section Z front: bottom layer; per y column right face x of furthest cell with >= 4 particles; median over y
function front(s) { const c = s.markCells(), { nx, ny } = s, xs = [];
  for (let j = 0; j < ny; j++) { let im = -1; for (let i = 0; i < nx; i++) if (c[i + nx * j] >= 4) im = i; xs.push((im + 1) * s.h); }
  return median(xs); }
// T4 per frame
function t4(s, xF, a) {
  const c = s.markCells(), { nx, ny, nz } = s, id = (i, j, k) => i + nx * (j + ny * k);
  let nInt = 0, pInt = 0, nIntS = 0, pIntS = 0, capped = 0, over12p = 0, fluid = 0, over8c = 0, peak = 0, peakAt = null; const hist = {};
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const n = c[id(i, j, k)]; if (!n) continue; fluid++; capped += Math.min(n, 8); if (n > 12) over12p += n; if (n > 8) over8c++;
    hist[n] = (hist[n] || 0) + 1; if (n > peak) { peak = n; peakAt = [i, j, k]; }
    let all = true, strict = true;
    for (let dk = -1; dk <= 1; dk++) for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { if (!di && !dj && !dk) continue;
      const ii = i + di, jj = j + dj, kk = k + dk; if (ii < 0 || jj < 0 || kk < 0 || ii >= nx || jj >= ny || kk >= nz) { strict = false; continue; } if (!c[id(ii, jj, kk)]) { all = false; strict = false; } }
    if (all) { nInt++; pInt += n; } if (strict) { nIntS++; pIntS += n; } }
  const xPeak = (peakAt[0] + 0.5) * s.h;
  return { nInt, meanInt: pInt / nInt, nIntStrict: nIntS, meanIntStrict: nIntS ? pIntS / nIntS : NaN, cappedVol: capped * s.h ** 3 / 8, fracP12: over12p / s.count, fracC8: over8c / fluid, fluidCells: fluid, peak, peakAt, peakLoc: xPeak > xF - a ? 'front' : 'column', hist };
}
// pressure-stage KE in both weightings, with per-face-class breakdown
function instrumentProject(s) {
  const orig = s.project.bind(s);
  s.project = (dt) => {
    const V0 = s.vel.map((v) => Float64Array.from(v)); const r = orig(dt);
    const { nx, ny, nz } = s, n = [nx, ny, nz], cs = [1, nx, nx * ny], cnt = s.cellCount, FL = s.fluid, unit = s.rho * s.h ** 3;
    let dMass = 0, dSolver = 0; const cls = {};
    for (let a = 0; a < 3; a++) { const D = s.D[a], V = s.vel[a], M = s.mass[a];
      for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) {
        const f = s.idx(a, i, j, k), ii = [i, j, k], v0 = V0[a][f], v1 = V[f]; if (v0 === v1) continue;
        const em = 0.5 * M[f] * (v1 * v1 - v0 * v0), es = M[f] > 0 ? 0.5 * unit * (v1 * v1 - v0 * v0) : 0;
        dMass += em; dSolver += es; let c;
        if (ii[a] === 0 || ii[a] === n[a]) c = 'wall';
        else { const hi = i + nx * (j + ny * k), lo = hi - cs[a], fh = FL[hi] === 1, fl = FL[lo] === 1;
          if (M[f] === 0) c = 'closed(m_f=0)'; else if (fh && fl) c = 'fluid-fluid'; else { const air = fh ? lo : hi; c = cnt[air] > 0 ? 'surface-partial(air cell has particles, theta=f_a+1/2)' : 'surface(empty air cell)'; }
          c += M[f] > 0 && M[f] < 0.05 * unit ? ' [m_f<5%]' : M[f] > 0 && M[f] < unit ? ' [m_f<full]' : ''; }
        cls[c] = cls[c] || { n: 0, dMass: 0, dSolver: 0, posMass: 0 }; cls[c].n++; cls[c].dMass += em; cls[c].dSolver += es; if (em > 0) cls[c].posMass += em; } }
    s._pdiag = { dMass, dSolver, cls }; return r; };
}
function runT3(A, maxSub, opts = {}) {
  const a = 2.25 * 0.0254, h = a / A, nx = 16 * A, ny = A, nz = Math.round(2.5 * A);
  const s = new Sim({ nx, ny, nz, h, seed: 1952, maxSub }); s.seedBlock(0, A, 0, ny, 0, 2 * A);
  if (opts.diag) instrumentProject(s);
  const N0 = s.count, e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, Tfac = Math.sqrt(2 * g / a), ritter = 2 * Math.sqrt(g * 2 * a);
  let prevF = front(s), prevT = 0; const frames = [], pdiag = [];
  const f0 = t4(s, prevF, a); frames.push({ frame: 0, t: 0, xFront: prevF, ...f0 });
  s.onSubstep = (sim, rec) => { const f = front(sim); rec.xFront = f; rec.Z = f / a; rec.T = rec.t * Tfac; rec.frontSpeed = (f - prevF) / (rec.t - prevT); prevF = f; prevT = rec.t;
    if (sim._pdiag) { rec.dKEpSolver = sim._pdiag.dSolver; if (rec.stage.pressure > 0) pdiag.push({ step: rec.step, t: rec.t, stagePressure: rec.stage.pressure, ...sim._pdiag }); } };
  const tEnd = 14.6 / Tfac + 0.15, t0 = Date.now(); let fr = 0;
  while (s.t < tEnd && prevF / a < 15.5) { s.advanceFrame(); fr++; frames.push({ frame: fr, t: s.t, xFront: prevF, ...t4(s, prevF, a) });
    if (fr % 5 === 0) console.log(`frame ${fr} t=${s.t.toFixed(4)} Z=${(prevF / a).toFixed(3)} elapsed ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  const L = s.log, Tat = (Z) => { for (let i = 0; i < L.length; i++) if (L[i].Z >= Z) { const Za = i ? L[i - 1].Z : 1, Ta = i ? L[i - 1].T : 0; return Ta + (L[i].T - Ta) * (Z - Za) / (L[i].Z - Za); } return NaN; };
  const shift = 1.19 - Tat(1.44);
  return { s, a, A, h, grid: [nx, ny, nz], N0, E0, Tfac, ritter, frames, pdiag, shift, Tsim: (Z) => Tat(Z) + shift, wallSec: (Date.now() - t0) / 1000 };
}
const mm = JSON.parse(fs.readFileSync(path.join(__dirname, '../spec/mm_1952.json'), 'utf8'));
function gradeCommon(R, tag) {
  const L = R.s.log;
  const vmax = L.reduce((b, r) => (r.frontSpeed > b.frontSpeed ? r : b));
  row(`${tag} Ritter: max front speed (section-Z front) over ${L.length} substep samples (t=${vmax.t.toFixed(4)} s)`, `${vmax.frontSpeed.toFixed(4)} m/s (${(vmax.frontSpeed / R.ritter).toFixed(4)} of limit)`, `< ${R.ritter.toFixed(4)} m/s`, vmax.frontSpeed < R.ritter);
  let worst = -Infinity; for (const r of L) worst = Math.max(worst, (r.E - R.E0) / Math.abs(R.E0));
  let prev = R.E0, rises = 0; for (const r of L) { if (r.E > prev) rises++; prev = r.E; }
  row(`${tag} T3.E: max (E-E0)/|E0| (PE datum z=0)`, fmt(worst), '<= 1e-6', worst <= 1e-6, `steps where E rose step-to-step: ${rises}`);
  const pp = L.filter((r) => r.stage.pressure > 0);
  row(`${tag} pressure-stage dE <= 0 every step`, `${pp.length} of ${L.length} steps > 0` + (pp.length ? `; max ${fmt(Math.max(...pp.map((r) => r.stage.pressure)))} J` : ''), '<= 0 every step', pp.length === 0);
  const res = Math.max(...L.map((r) => r.pcgTrueRelRes)); row(`${tag} P.res max true residual`, fmt(res), '<= 1e-8', res <= 1e-8);
  const dv = Math.max(...L.map((r) => r.maxDivDt)); row(`${tag} P.div max |div u| dt`, fmt(dv), '<= 1e-6', dv <= 1e-6);
  const fl = R.s.frameLog; info(`${tag} CFL used per frame`, `max ${Math.max(...fl.map((x) => x.cflUsed)).toFixed(4)}, min ${Math.min(...fl.map((x) => x.cflUsed)).toFixed(4)}; frames with cap (${R.s.maxSub}) binding and CFL>1: ${fl.filter((x) => x.capBinds).length} of ${fl.length}; substeps ${L.length}`);
  let sdt2 = 0; for (const r of L) sdt2 += r.dt * r.dt; const M = R.N0 * R.s.mp;
  info(`${tag} energy loss vs sum 1/2 M g^2 dt^2 (section Z: info only, not leak evidence)`, `${fmt(R.E0 - L.at(-1).E)} J vs ${fmt(0.5 * M * g * g * sdt2)} J`);
}
function gradeMM(R, tag) {
  info(`${tag} T3.mm shift (T = t sqrt(2g/a) + shift; T=1.19 at Z=1.44)`, R.shift.toFixed(4));
  const out = [];
  for (const r of mm.rows) { const Ts = R.Tsim(r.Z), rel = (Ts - r.T_mean) / r.T_mean; out.push({ Z: r.Z, T_mean: r.T_mean, T_sim: Ts, rel });
    if (r.Z <= 1.22) info(`${tag} T3.mm Z=${r.Z} (report only)`, `${Ts.toFixed(3)} vs ${r.T_mean} (${(100 * rel).toFixed(2)}%)`);
    else if (r.Z >= 1.67) row(`${tag} T3.mm Z=${r.Z} (T_sim ${Ts.toFixed(3)}, T_mean ${r.T_mean})`, isNaN(rel) ? 'not reached' : (100 * Math.abs(rel)).toFixed(2) + '%', '<= 8%', Math.abs(rel) <= 0.08); }
  return out;
}
function gradeT4(R, tag) {
  const F = R.frames, m0 = F[0].meanInt; let w = 0, wAt = 0, ws = 0;
  for (const f of F) { const d = Math.abs(f.meanInt - m0) / m0; if (d > w) { w = d; wAt = f.frame; } const ds = Math.abs(f.meanIntStrict - F[0].meanIntStrict) / F[0].meanIntStrict; if (ds > ws) ws = ds; }
  row(`${tag} T4 interior-cell mean particles/cell, max |m-m0|/m0 over ${F.length} frames (m0=${m0.toFixed(4)}; walls: out-of-box neighbours not required)`, `${fmt(w)} (frame ${wAt}, m=${F[wAt].meanInt.toFixed(4)}, ${F[wAt].nInt} cells)`, '<= 1e-2 every frame', w <= 0.01);
  info(`${tag} T4 same with strict reading (out-of-box neighbours disqualify wall cells)`, `${fmt(ws)} (m0=${F[0].meanIntStrict.toFixed(4)})`);
  row(`${tag} T4 particle count exact`, String(R.s.count), `== ${R.N0}`, R.s.count === R.N0);
  const V0 = F[0].cappedVol, cv = F.map((f) => f.cappedVol / V0 - 1), last = F.at(-1);
  info(`${tag} T4 capped estimator sum min(n,8) h^3/8: min / final rel. to V0`, `${fmt(Math.min(...cv))} / ${fmt(cv.at(-1))}`);
  info(`${tag} T4 fraction of particles in cells n>12: max over frames / final`, `${fmt(Math.max(...F.map((f) => f.fracP12)))} / ${fmt(last.fracP12)}`, 'Poisson(8) reference 11.19%');
  info(`${tag} T4 fraction of fluid cells n>8: max over frames / final`, `${fmt(Math.max(...F.map((f) => f.fracC8)))} / ${fmt(last.fracC8)}`);
  const pk = F.reduce((b, f) => (f.peak > b.peak ? f : b));
  info(`${tag} T4 peak particles/cell (max over frames) and location`, `${pk.peak} at frame ${pk.frame}, cell ${JSON.stringify(pk.peakAt)}, ${pk.peakLoc}; final frame peak ${last.peak} (${last.peakLoc})`);
  // histogram vs Poisson(mean) at final frame
  const N = Object.values(last.hist).reduce((x, y) => x + y), lam = R.N0 / N, ks = Object.keys(last.hist).map(Number).sort((x, y) => x - y);
  info(`${tag} T4 final-frame histogram n:cells (Poisson(${lam.toFixed(3)}) expected, conditioned n>=1)`, ks.map((k) => `${k}:${last.hist[k]}(${(N * poisson(lam, k) / (1 - Math.exp(-lam))).toFixed(0)})`).join(' '));
}
function saveRun(R, prefix) {
  write(`${prefix}_log.csv`, csv(R.s.log));
  write(`${prefix}_frames.csv`, 'frame,t0,nSub,cflUsed,capBinds\n' + R.s.frameLog.map((f) => [f.frame, f.t0, f.nSub, f.cflUsed, f.capBinds ? 1 : 0].join(',')).join('\n') + '\n');
  write(`${prefix}_T4_frames.json`, R.frames);
  write(`${prefix}_summary.json`, { a: R.a, A: R.A, h: R.h, grid: R.grid, maxSub: R.s.maxSub, particles: R.N0, E0: R.E0, shift: R.shift, substeps: R.s.log.length, frames: R.s.frameLog.length, wallSec: R.wallSec, stageCum: R.s.stageCum });
}
if (part === 'regrade') {
  const R = runT3(16, 8); saveRun(R, 'T3'); gradeCommon(R, 'T3 a=16 cap8'); write('T3_mm_compare.json', { shift: R.shift, A: 16, rows: gradeMM(R, 'T3 a=16 cap8') }); gradeT4(R, 'a=16 cap8');
  write('rows.json', rows);
}
if (part === 'cap16') {
  const R = runT3(16, 16); saveRun(R, 'T3cap16'); gradeCommon(R, 'cap16'); const c16 = gradeMM(R, 'cap16'); gradeT4(R, 'cap16');
  const c8 = JSON.parse(fs.readFileSync(path.join(__dirname, '../results/step5_t3_regrade/T3_mm_compare.json'), 'utf8')).rows;
  const cmp = c16.map((r, i) => ({ Z: r.Z, T_cap8: c8[i].T_sim, T_cap16: r.T_sim, rel: (r.T_sim - c8[i].T_sim) / c8[i].T_sim }));
  for (const r of cmp) if (r.Z >= 1.67) row(`cap16 vs cap8 (NM) Z=${r.Z}: T ${r.T_cap16.toFixed(3)} vs ${r.T_cap8.toFixed(3)}`, (100 * Math.abs(r.rel)).toFixed(2) + '%', '<= 1% (NM, info run)', Math.abs(r.rel) <= 0.01);
  write('cap16_vs_cap8.json', cmp); write('rows.json', rows);
}
if (part === 'a8') {
  const R = runT3(8, 8, { diag: true }); saveRun(R, 'T3a8'); gradeCommon(R, 'a=8'); gradeMM(R, 'a=8'); gradeT4(R, 'a=8');
  const L = R.s.log; info('a=8 pressure stage in solver weighting (unit density rho h^3 on every m_f>0 face): steps with dKE > 0', `${L.filter((r) => r.dKEpSolver > 0).length} of ${L.length}; max ${fmt(Math.max(...L.map((r) => r.dKEpSolver)))} J`);
  for (const d of R.pdiag) { info(`a=8 step ${d.step} (t=${d.t.toFixed(4)}): pressure-stage dKE, one-face-mass (m_f) vs solver weighting`, `${fmt(d.dMass)} J (logged stage ${fmt(d.stagePressure)}) vs ${fmt(d.dSolver)} J`);
    for (const [c, v] of Object.entries(d.cls)) info(`a=8 step ${d.step} face class ${c}`, `${v.n} faces; dKE m_f ${fmt(v.dMass)} J (positive part ${fmt(v.posMass)}); dKE solver ${fmt(v.dSolver)} J`); }
  write('a8_pressure_diag.json', R.pdiag); write('rows.json', rows);
}
if (part === 'summary') {
  const md5 = (f) => require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '../spec', f))).digest('hex');
  const all = JSON.parse(fs.readFileSync(path.join(outDir, 'rows.json'), 'utf8'));
  let md = `# ${arg('--title')}\n\n- Code commit the runs executed at: ${process.env.CODE_COMMIT} (clean tree)\n- spec/ASSERTS.md md5 ${md5('ASSERTS.md')}; spec/mm_1952.json md5 ${md5('mm_1952.json')}\n- PE zero: floor z=0\n- Front (section Z): bottom cell layer, per y column right face x of furthest cell with >= 4 particles, median over y; Z = x/a from back wall; T = t sqrt(2g/a) shifted to 1.19 at Z = 1.44\n- T4 (section Z): mean particles over interior cells (>= 1 particle, all in-box 26 neighbours >= 1) within 1% of frame-0 mean every frame\n\n| # | Check | Measured | Threshold | Result |\n|---|---|---|---|---|\n`;
  all.forEach((r, i) => { md += `| ${i + 1} | ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass === null ? 'INFO' : r.pass ? 'PASS' : 'FAIL'}${r.note ? ' (' + r.note + ')' : ''} |\n`; });
  md += `\nTotal graded: ${all.filter((r) => r.pass === true).length} PASS, ${all.filter((r) => r.pass === false).length} FAIL\n`;
  write('results.md', md); write('results.json', all);
}
