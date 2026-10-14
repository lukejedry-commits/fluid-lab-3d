'use strict';
/** Gate 1 amendment run (ASSERTS 3b4821c8). Derived from run_gate1_followup.js.
 *  Gate 1 follow-up (ASSERTS sec. Z as of 1ffab41, PHYSICS_SPEC sec. 7).
 *  node test/run_gate1_followup.js --part modes|D|T1|T1b|T2|summary
 *  Writes into results/step15_fix3v6/gate1/ ; refuses to overwrite any file. */
const fs = require('fs'), path = require('path');
const { Sim, STAGES } = require('../src/sim');
const PF = require('./pressure_families');
const { makeT1b } = require('./t1b_setup');
const part = process.argv[process.argv.indexOf('--part') + 1];
const outDir = path.join(__dirname, '../results', process.env.GATE_DIR || 'step15_fix3v6/gate1'); // GATE_DIR: alpha-sweep INFO runs only
// Step 14 still-water proof (Z 2026-10-14g), instrumentation only, adds no graded row here: every call of the fix-3
// stage records particles moved, max |dx| (correction + push-out) and the stage dPE; written at exit as densfix_proof_<part>.json.
const DP = { part: null, calls: 0, solves: 0, moved: 0, maxMove: 0, maxAbsDPE: 0, nonzeroDPE: 0, nAboveDeadMax: 0, maxAbsTargetPerCell: 0, bySetup: {} };
{ const od = Sim.prototype.densityCorrection;
  const AL = process.env.DENS_ALPHA ? +process.env.DENS_ALPHA : null; // INFO-only alpha sweep (Z 2026-10-14j)
  Sim.prototype.densityCorrection = function () { if (AL !== null) this.densAlpha = AL; const X0 = Float64Array.from(this.x.subarray(0, 3 * this.count)), pe0 = this.particleEnergy().pe; const st = od.call(this);
    let mv = 0, n = 0; for (let q = 0; q < X0.length; q += 3) { const d = Math.hypot(this.x[q] - X0[q], this.x[q + 1] - X0[q + 1], this.x[q + 2] - X0[q + 2]); if (d !== 0) n++; mv = Math.max(mv, d); }
    const dpe = this.particleEnergy().pe - pe0, key = `${this.nx}x${this.ny}x${this.nz}`; DP.calls++; if (st.iters) DP.solves++; DP.moved += n; DP.maxMove = Math.max(DP.maxMove, mv);
    DP.maxAbsDPE = Math.max(DP.maxAbsDPE, Math.abs(dpe)); if (dpe !== 0) DP.nonzeroDPE++; DP.nAboveDeadMax = Math.max(DP.nAboveDeadMax, st.nAboveDead || 0); DP.maxAbsTargetPerCell = Math.max(DP.maxAbsTargetPerCell, Math.abs(st.targetPerCell || 0));
    const b = (DP.bySetup[key] = DP.bySetup[key] || { calls: 0, moved: 0, maxMove: 0, maxAbsDPE: 0, maxAbsEbarT4: 0 }); b.calls++; b.moved += n; b.maxMove = Math.max(b.maxMove, mv); b.maxAbsDPE = Math.max(b.maxAbsDPE, Math.abs(dpe)); b.maxAbsEbarT4 = Math.max(b.maxAbsEbarT4, Math.abs(st.ebarT4 || 0));
    return st; }; }
process.on('exit', () => { const pt = process.argv[process.argv.indexOf('--part') + 1]; if (pt === 'summary') return; DP.part = pt; const f = path.join(outDir, `densfix_proof_${pt}.json`); if (!fs.existsSync(f)) fs.writeFileSync(f, JSON.stringify(DP, null, 1)); });

fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) => { const f = path.join(outDir, name); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 1)); };
const rows = [];
const row = (id, measured, threshold, pass, note = '') => { rows.push({ part, id, measured, threshold, pass: !!pass, note }); console.log((pass ? 'PASS ' : 'FAIL ') + id + ' : ' + measured + ' vs ' + threshold + (note ? ' (' + note + ')' : '')); };
const info = (id, measured, note = '') => { rows.push({ part, id, measured, threshold: 'info (not graded)', pass: null, note }); console.log('INFO ' + id + ' : ' + measured); };
const fmt = (x) => (typeof x === 'number' ? x.toExponential(3) : String(x));
const g = 9.81, rho = 1000, FLOOR = 1e-10;
const median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]); };
const done = () => write(`rows_${part}.json`, rows);

function csv(log) {
  const head = ['step', 't', 'dt', 'nSub', 'E', 'KE', 'PE', ...STAGES.map((s) => 'd_' + s), ...STAGES.map((s) => 'cum_' + s), 'pcgIters', 'pcgRelRes', 'pcgTrueRelRes', 'maxDivDt', 'fluidCells', 'nGhost', 'nWall', 'nSep', 'maxU', 'dPzdt', 'floorForce', 'balMinus', 'balPlus', 'mass', 'Px', 'Py', 'Pz', 'wCom', 'zCom'];
  return head.join(',') + '\n' + log.map((r) => head.map((k) => (k.startsWith('d_') ? r.stage[k.slice(2)] : k.startsWith('cum_') ? r.stageCum[k.slice(4)] : r[k])).join(',')).join('\n') + '\n';
}
const frameCsv = (fl) => 'frame,t0,nSub,cflUsed,capBinds\n' + fl.map((f) => [f.frame, f.t0, f.nSub, f.cflUsed, f.capBinds ? 1 : 0].join(',')).join('\n') + '\n';
function gradeSolver(tag, log) {
  const res = Math.max(...log.map((r) => r.pcgTrueRelRes));
  row(`P.res ${tag}: max final true residual / ||rhs|| (${log.length} solves)`, fmt(res), '<= 1e-8', res <= 1e-8);
  let worst = 0, at = -1;
  for (let i = 20; i < log.length; i++) { const md = median(log.slice(i - 20, i).map((r) => r.pcgIters)); const ratio = md > 0 ? log[i].pcgIters / md : (log[i].pcgIters > 0 ? Infinity : 0); if (ratio > worst) { worst = ratio; at = i; } }
  row(`P.res ${tag}: max iters / median(prev 20), steps > 20`, worst === Infinity ? 'inf' : worst.toFixed(3) + (at >= 0 ? ` (step ${at + 1})` : ''), '<= 2', worst <= 2);
  const dv = Math.max(...log.map((r) => r.maxDivDt));
  row(`P.div ${tag}: max |div u| * dt`, fmt(dv), '<= 1e-6', dv <= 1e-6);
}
function nmLogs(tag, s) {
  const pos = s.log.filter((r) => r.stage.pressure > 0), maxPos = pos.length ? Math.max(...pos.map((r) => r.stage.pressure)) : 0;
  info(`NM ${tag}: pressure-stage dE > 0 (graded in T3)`, `${pos.length} of ${s.log.length} steps; max ${fmt(maxPos)} J`);
  const fl = s.frameLog, cap = fl.filter((f) => f.capBinds).length;
  info(`NM ${tag}: CFL used per frame`, `max ${Math.max(...fl.map((f) => f.cflUsed)).toFixed(4)}, min ${Math.min(...fl.map((f) => f.cflUsed)).toFixed(4)}; frames with 8-cap binding and CFL>1: ${cap}`);
  const ext = s.log.map((r) => Math.abs(r.stage.extension));
  info(`NM ${tag}: extension-stage |dE| per step (own stage)`, `max ${fmt(Math.max(...ext))} J, cumulative ${fmt(s.stageCum.extension)} J`);
}
function energyRise(tag, s, E0) {
  let worst = -Infinity, at = null;
  for (const r of s.log) { const rel = (r.E - E0) / Math.abs(E0); if (rel > worst) { worst = rel; at = r; } }
  let stage = '-';
  // Label fix (step 15): gravity adds ~M g^2 dt^2 per step and pressure removes it, so the raw largest stage was always
  // 'gravity'. Gravity and pressure are merged into one net bucket before picking the stage that carries the rise.
  const merged = (st) => { const m = { ...st }; m['gravity+pressure'] = (st.gravity || 0) + (st.pressure || 0); delete m.gravity; delete m.pressure; return m; };
  const top = (st) => { const m = merged(st); return Object.keys(m).reduce((a, b) => (m[b] > m[a] ? b : a)); };
  if (worst > 1e-6) { const m = merged(at.stageCum), k = top(at.stageCum); stage = `${k} (cumulative ${m[k].toExponential(3)} J)`; }
  // per-step rises: which stage (gravity+pressure merged) contributed the largest positive change on steps where E went up
  let prev = E0; const cnt = {};
  for (const r of s.log) { if (r.E > prev) { const k = top(r.stage); cnt[k] = (cnt[k] || 0) + 1; } prev = r.E; }
  return { worst, at: at && at.t, stage, riseStages: cnt };
}
// pressure integration along a wall column: piecewise-linear p through cell centres,
// linear extrapolation to the floor, p = 0 at the ghost-fluid surface z_c + theta h
function wallForce(s, N, nz) {
  const h = s.h, P = s.lastP, id = (i, j, k) => i + N * (j + N * k); let Fpl = 0, Fmid = 0;
  for (let j = 0; j < N; j++) {
    let top = -1; for (let k = 0; k < nz; k++) if (s.fluid[id(0, j, k)]) top = k;
    const zs = [], ps = [];
    zs.push(0); ps.push(top >= 1 ? 1.5 * P[id(0, j, 0)] - 0.5 * P[id(0, j, 1)] : P[id(0, j, 0)]);
    for (let k = 0; k <= top; k++) { zs.push((k + 0.5) * h); ps.push(P[id(0, j, k)]); Fmid += P[id(0, j, k)] * h * h; }
    const th = s.thetaOf(s.cellCount, id(0, j, top), id(0, j, top + 1));
    zs.push((top + 0.5 + th) * h); ps.push(0);
    for (let q = 1; q < zs.length; q++) Fpl += 0.5 * (ps[q] + ps[q - 1]) * (zs[q] - zs[q - 1]) * h;
  }
  return { Fpl, Fmid };
}
function floorForce(s, N) { const h = s.h, P = s.lastP, id = (i, j, k) => i + N * (j + N * k); let F = 0; for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) F += (1.5 * P[id(i, j, 0)] - 0.5 * P[id(i, j, 1)]) * h * h; return F; }
function interiorPErr(s, N, nz, Href, belowRow) {
  const P = s.lastP, F = s.fluid, id = (i, j, k) => i + N * (j + N * k); let e = 0, n = 0;
  for (let k = 1; k < Math.min(nz - 1, belowRow); k++) for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const c = id(i, j, k); if (!F[c]) continue;
    if (![id(i - 1, j, k), id(i + 1, j, k), id(i, j - 1, k), id(i, j + 1, k), id(i, j, k - 1), id(i, j, k + 1)].every((q) => F[q])) continue;
    const ex = rho * g * (Href - (k + 0.5) * s.h); e = Math.max(e, Math.abs(P[c] - ex) / ex); n++;
  }
  return { e, n };
}
const fitSlope = (hs, es) => { const xs = hs.map(Math.log), ys = es.map(Math.log), mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length; let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; }); return sxy / sxx; };

if (part === 'modes') {
  const modes = PF.runModes(1e-12); write('pressure_modes.json', modes);
  for (const fam of ['A', 'B', 'C']) { const r = modes.filter((m) => m.id[0] === fam), w = r.reduce((a, b) => (b.relLinf > a.relLinf ? b : a)); row(`P.${fam} max rel Linf over ${r.length} solves (worst ${w.id} N=${w.N})`, fmt(w.relLinf), '<= 1e-7', w.relLinf <= 1e-7); }
  const mr = Math.max(...modes.map((m) => m.trueRelRes)); row('P.res mode solves (tol 1e-12): max true residual / ||rhs||', fmt(mr), '<= 1e-8', mr <= 1e-8);
  done();
}
if (part === 'D') {
  const Ns = [16, 32, 64, 128, 256]; const t0 = Date.now();
  const D = PF.runD(1e-12, Ns); D.wallSec = (Date.now() - t0) / 1000; write('pressure_D.json', D);
  for (const p of D.points) {
    const graded = p.point === '(0.5, 0.5, 0.5)';
    const ord = p.orders.map((o) => o.toFixed(3)).join(', ');
    // graded: three refinements with ratio 2 ending at the finest grid (N = 32/64/128/256)
    const last3 = p.orders.slice(-3);
    if (graded) row(`P.D centre point ${p.point}: order N=32->64->128->256 (all orders N=16..256: ${ord})`, last3.map((o) => o.toFixed(3)).join(', '), 'each in [1.8, 2.2]', last3.every((o) => o >= 1.8 && o <= 2.2));
    else info(`P.D order at ${p.point}, N=16..256`, ord);
    row(`P.D truncation / discretization error at ${p.point} (K=41 vs 801, all N)`, fmt(p.truncRatioMax), '< 1e-2', p.truncRatioMax < 1e-2);
  }
  const emax = Ns.map((_, i) => Math.max(...D.points.map((p) => p.errs[i])));
  info('P.D max-over-interior-points error, N=16..256', emax.map(fmt).join(', '));
  info('P.D order of max-over-interior-points error', emax.slice(1).map((e, i) => Math.log2(emax[i] / e).toFixed(3)).join(', '));
  info('P.D PCG iterations N=16..256', D.iters.map((r) => `${r.N}:${r.iters}`).join(', '));
  done();
}
if (part === 'T1') {
  const H = 0.5, res = [];
  for (const N of [8, 16, 32]) {
    const h = H / N, nz = Math.round(1.25 * N), s = new Sim({ nx: N, ny: N, nz, h, seed: 1000 + N }); s.seedBlock(0, N, 0, N, 0, N);
    const e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, t0 = Date.now();
    for (let f = 0; f < 600; f++) s.advanceFrame();
    write(`T1_N${N}_log.csv`, csv(s.log)); write(`T1_N${N}_frames.csv`, frameCsv(s.frameLog));
    const LW = (N * h) ** 2, Ff = floorForce(s, N), FfEx = rho * g * H * LW, wf = wallForce(s, N, nz), FwEx = 0.5 * rho * g * H * H * N * h;
    const pe = interiorPErr(s, N, nz, H, nz), er = energyRise('T1', s, E0), maxU = s.log.at(-1).maxU;
    const r = { N, maxU, pErr: pe.e, floorErr: Math.abs(Ff - FfEx) / FfEx, wallErr: Math.abs(wf.Fpl - FwEx) / FwEx, wallErrMidpoint: Math.abs(wf.Fmid - FwEx) / FwEx, energy: er, wallSec: (Date.now() - t0) / 1000 };
    res.push(r); console.log(JSON.stringify(r));
    row(`T1 N=${N}: max|u| at t=10 s`, fmt(maxU), `< ${fmt(1e-3 * Math.sqrt(g * H))}`, maxU < 1e-3 * Math.sqrt(g * H));
    row(`T1 N=${N}: pressure profile, interior cells`, fmt(pe.e), '<= 1e-2', pe.e <= 1e-2);
    row(`T1 N=${N}: max (E-E0)/|E0|`, fmt(er.worst), '<= 1e-6', er.worst <= 1e-6, er.worst > 1e-6 ? 'stage ' + er.stage : '');
    gradeSolver(`T1 N=${N}`, s.log); nmLogs(`T1 N=${N}`, s);
  }
  for (const [k, nm, ref] of [['floorErr', 'floor', 'rho g H L W'], ['wallErr', 'side wall', '1/2 rho g H^2 W']]) {
    const es = res.map((r) => r[k]), allFloor = es.every((e) => e <= FLOOR);
    if (allFloor) row(`T1 ${nm} force order (sec. Z): e(h) = ${es.map(fmt).join(', ')} vs floor 1e-10 x ${ref}`, 'all <= floor: exact discrete equilibrium', 'order >= 0.8 if above floor', true);
    else { const o = fitSlope(res.map((r) => 1 / r.N), es); row(`T1 ${nm} force fitted order, e = ${es.map(fmt).join(', ')}`, o.toFixed(3), '>= 0.8', o >= 0.8); }
    row(`T1 ${nm} force regression floor (sec. Z): max e over N`, fmt(Math.max(...es)), '<= 1e-10', Math.max(...es) <= FLOOR);
    row(`T1 ${nm} force e at h/H=1/32`, fmt(es[2]), '<= 1e-2', es[2] <= 1e-2);
  }
  write('T1_summary.json', res); done();
}
if (part === 'T1b') {
  const Ns = (process.argv.includes('--Ns') ? process.argv[process.argv.indexOf('--Ns') + 1] : '8,16,32,64').split(',').map(Number);
  const res = [];
  for (const N of Ns) {
    const T = makeT1b(N), s = T.s, e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, t0 = Date.now();
    const M = s.count * s.mp;
    // T1b.floor (ASSERTS 560121fe): z up, dPz/dt = F_floor - M g  =>  grade F_floor - dPz/dt = M g every step.
    // Both signed values are tracked (worst |.| step for each), graded on the minus form only.
    let mWorst = 0, mAt = 0, pWorst = 0, pAt = 0, rawWorst = 0;
    s.onSubstep = (sim, rec) => { const F = floorForce(sim, N), Mg = M * g;
      const em = (F - rec.dPzdt) / Mg - 1, ep = (F + rec.dPzdt) / Mg - 1;
      if (Math.abs(em) > Math.abs(mWorst)) { mWorst = em; mAt = rec.step; } if (Math.abs(ep) > Math.abs(pWorst)) { pWorst = ep; pAt = rec.step; }
      rawWorst = Math.max(rawWorst, Math.abs(F / Mg - 1)); rec.floorForce = F; rec.balMinus = em; rec.balPlus = ep; };
    for (let f = 0; f < 600; f++) { s.advanceFrame(); if (f % 60 === 59) console.log(`T1b N=${N} frame ${f + 1}/600 elapsed ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
    write(`T1b_N${N}_log.csv`, csv(s.log)); write(`T1b_N${N}_frames.csv`, frameCsv(s.frameLog));
    const Ff = floorForce(s, N), wf = wallForce(s, N, T.nz), FwEx = 0.5 * rho * g * T.Heff ** 2 * T.L;
    // surface cell row = lowest row containing a non-full cell
    let surfRow = T.nz; for (let k = T.nz - 1; k >= 0; k--) { let any = false; for (let c = 0; c < N * N; c++) if (s.cellCount[c + N * N * k] > 0 && s.cellCount[c + N * N * k] < 8) any = true; if (any) surfRow = k; }
    let zsMin = Infinity, zsMax = -Infinity, zsSum = 0; const id3 = (i, j, k) => i + N * (j + N * k);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let top = -1; for (let k = 0; k < T.nz; k++) if (s.fluid[id3(i, j, k)]) top = k;
      const zs = (top + 0.5 + s.thetaOf(s.cellCount, id3(i, j, top), id3(i, j, top + 1))) * T.h; zsMin = Math.min(zsMin, zs); zsMax = Math.max(zsMax, zs); zsSum += zs; }
    const pe = interiorPErr(s, N, T.nz, T.Heff, surfRow), er = energyRise('T1b', s, E0), maxU = s.log.at(-1).maxU;
    const r = { N, h: T.h, Hnominal: T.H, Heff: T.Heff, HoverH: T.H / T.h, q: T.q, nTop: T.nTop, particles: s.count, cells: [N, N, T.nz], maxU, floorErr: Math.abs(Ff - M * g) / (M * g), wallErr: Math.abs(wf.Fpl - FwEx) / FwEx, wallErrMidpoint: Math.abs(wf.Fmid - FwEx) / FwEx, pErr: pe.e, pCells: pe.n, surfRow, energy: er, wallSec: (Date.now() - t0) / 1000 };
    res.push(r); console.log(JSON.stringify(r));
    info(`T1b N=${N}: ghost-fluid surface z_c + theta h (mean [min,max] over columns) vs H_eff`, `${(zsSum / (N * N)).toPrecision(12)} [${zsMin.toPrecision(12)}, ${zsMax.toPrecision(12)}] vs ${T.Heff.toPrecision(12)}; rel diff ${fmt(Math.abs(zsSum / (N * N) - T.Heff) / T.Heff)}`);
    info(`T1b N=${N}: H nominal / H_eff (H/h = ${r.HoverH.toFixed(2)}, top-cell particles ${T.nTop}/8)`, `${T.H} / ${T.Heff}`);
    row(`T1b.u N=${N}: max|u| after 10 s`, fmt(maxU), `< ${fmt(1e-3 * Math.sqrt(g * T.Heff))}`, maxU < 1e-3 * Math.sqrt(g * T.Heff));
    row(`T1b.floor N=${N}: max over all ${s.log.length} steps of signed (F_floor - dPz/dt)/Mg - 1 [graded]; signed (F_floor + dPz/dt)/Mg - 1 [info] = ${pWorst.toExponential(3)} (step ${pAt})`, mWorst.toExponential(3) + ` (step ${mAt})`, '|.| <= 1e-6 every step', Math.abs(mWorst) <= 1e-6);
    r.balMinusWorst = mWorst; r.balPlusWorst = pWorst;
    info(`T1b N=${N}: raw floor force |F - Mg|/(Mg), max over steps / at end`, `${fmt(rawWorst)} / ${fmt(r.floorErr)}`);
    row(`T1b.E N=${N}: max (E-E0)/|E0|`, fmt(er.worst), '<= 1e-6', er.worst <= 1e-6, er.worst > 1e-6 ? 'stage ' + er.stage : `steps with any rise, by largest stage: ${JSON.stringify(er.riseStages)}`);
    info(`T1b N=${N}: side-wall rel err: graded theta-aware integral / plain cell-sum (info)`, `${fmt(r.wallErr)} / ${fmt(r.wallErrMidpoint)}`);
    gradeSolver(`T1b N=${N}`, s.log); nmLogs(`T1b N=${N}`, s);
  }
  write(`T1b_summary_N${Ns.join('-')}.json`, res);
  if (Ns.includes(64) && Ns.length === 4) {
    const es = res.map((r) => r.wallErr), r64 = res.at(-1);
    row('T1b.wall N=64: side-wall force rel err vs 1/2 rho g H_eff^2 W', fmt(r64.wallErr), '<= 1e-2', r64.wallErr <= 1e-2);
    if (es.every((e) => e < FLOOR)) row(`T1b.wall envelope order: e = ${es.map(fmt).join(', ')}`, 'all < 1e-10 floor: order skipped', 'order >= 0.8 unless all < 1e-10', true);
    else { const env = es.slice(1).map((e, i) => Math.max(es[i], e)); const o = fitSlope([1 / 16, 1 / 32, 1 / 64], env); row(`T1b.wall envelope order (pair max ${env.map(fmt).join(', ')})`, o.toFixed(3), '>= 0.8', o >= 0.8); }
    row('T1b.p N=64: pressure rel err, interior cells below surface row', fmt(r64.pErr) + ` (${r64.pCells} cells)`, '<= 1e-2', r64.pErr <= 1e-2);
  }
  done();
}
if (part === 'T2') {
  const h = 0.025, N = 24, nz = 64, s = new Sim({ nx: N, ny: N, nz, h, seed: 2024 }); s.seedBlock(8, 16, 8, 16, 48, 56);
  const M = s.count * s.mp; while (s.t < 0.4 - 1e-12) s.advanceFrame();
  write('T2_log.csv', csv(s.log)); write('T2_frames.csv', frameCsv(s.frameLog));
  const ts = s.log.map((r) => r.t), ws = s.log.map((r) => r.wCom), n = ts.length, mt = ts.reduce((a, b) => a + b) / n, mw = ws.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (ts[i] - mt) * (ws[i] - mw); sxx += (ts[i] - mt) ** 2; }
  const a = -sxy / sxx, relA = Math.abs(a - g) / g; let minZ = Infinity; for (let p = 0; p < s.count; p++) minZ = Math.min(minZ, s.x[3 * p + 2]);
  row(`T2 COM accel (fit of w_com, ${n} substeps; a=${a.toFixed(9)})`, fmt(relA), '|a-g|/g <= 1e-3', relA <= 1e-3, `min z ${minZ.toFixed(3)} m, no floor contact`);
  let wp = 0; for (const r of s.log) wp = Math.max(wp, Math.max(Math.abs(r.Px), Math.abs(r.Py)) / (1e-8 * M * g * r.t));
  row('T2 horizontal momentum max(|Px|,|Py|)/(1e-8 M g t)', fmt(wp), '<= 1', wp <= 1);
  gradeSolver('T2', s.log); nmLogs('T2', s);
  // info: half-dt rerun; energy relative to floor datum z=0, E0 = K0 + M g z_com,0
  const E0 = s.log[0].E - Object.values(s.log[0].stage).reduce((x, y) => x + y, 0);
  const s2 = new Sim({ nx: N, ny: N, nz, h, seed: 2024, subMul: 2 }); s2.seedBlock(8, 16, 8, 16, 48, 56);
  const E02 = s2.particleEnergy().ke + s2.particleEnergy().pe; while (s2.t < 0.4 - 1e-12) s2.advanceFrame();
  write('T2_halfdt_log.csv', csv(s2.log));
  const d1 = (s.log.at(-1).E - E0) / Math.abs(E0), d2 = (s2.log.at(-1).E - E02) / Math.abs(E02);
  info(`T2 half-dt: (E-E0)/|E0| at t=0.4 s, dt vs dt/2 (${s.log.length} vs ${s2.log.length} substeps; E0 equal: ${E0 === E02})`, `${d1.toExponential(4)} vs ${d2.toExponential(4)}; ratio ${(d2 / d1).toFixed(4)}`);
  done();
}
if (part === 'summary') {
  const all = []; for (const p of ['modes', 'D', 'T1', 'T1b', 'T2']) { const f = path.join(outDir, `rows_${p}.json`); if (fs.existsSync(f)) all.push(...JSON.parse(fs.readFileSync(f, 'utf8'))); }
  const commit = require('child_process').execSync('git rev-parse --short HEAD', { cwd: __dirname }).toString().trim();
  const md5 = require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '../spec/ASSERTS.md'))).digest('hex');
  let md = `# Gate 1 re-run at fix 3 v6 (step 15)\n\n- Code commit the runs executed at: ${process.env.CODE_COMMIT || commit} (clean tree)\n- spec/ASSERTS.md md5 ${md5}\n- PE zero: floor z=0 (box origin at z=0 in every setup; E = sum m (|v|^2/2 + g z), E0 = K0 + M g z_com,0)\n\n| # | Part | Check | Measured | Threshold | Result |\n|---|---|---|---|---|---|\n`;
  all.forEach((r, i) => { md += `| ${i + 1} | ${r.part} | ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass === null ? 'INFO' : r.pass ? 'PASS' : 'FAIL'}${r.note ? ' (' + r.note + ')' : ''} |\n`; });
  md += `\nTotal graded: ${all.filter((r) => r.pass === true).length} PASS, ${all.filter((r) => r.pass === false).length} FAIL\n`;
  write('results.md', md); write('results.json', all);
}
