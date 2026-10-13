'use strict';
/** First gate: P.A/B/C/D, P.res, P.div, T1 still pool, T2 free fall (spec/ASSERTS.md incl. sec. Z).
 *  Usage: node test/run_asserts.js [--quick]
 *  Writes results/step1_gate/<run-id>/ and refuses to overwrite an existing folder. */
const fs = require('fs'), path = require('path');
const { Sim, STAGES } = require('../src/sim');
const PF = require('./pressure_families');
const quick = process.argv.includes('--quick');
const runId = new Date().toISOString().replace(/[:.]/g, '-');
const outDir = path.join(__dirname, '../results/step1_gate', runId);
if (fs.existsSync(outDir)) throw new Error('refusing to overwrite ' + outDir);
fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) => { const f = path.join(outDir, name); if (fs.existsSync(f)) throw new Error('exists ' + f); fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 1)); };
const rows = []; // {id, measured, threshold, pass, note}
const row = (id, measured, threshold, pass, note = '') => { rows.push({ id, measured, threshold, pass: !!pass, note }); console.log((pass ? 'PASS ' : 'FAIL ') + id + ' : ' + measured + ' vs ' + threshold + (note ? ' (' + note + ')' : '')); };
const fmt = (x) => (typeof x === 'number' ? x.toExponential(3) : String(x));
const g = 9.81, rho = 1000;
const median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]); };

// ---------- P.A/B/C (tol 1e-12, sec. Z) ----------
const modes = PF.runModes(1e-12); write('pressure_modes.json', modes);
for (const fam of ['A', 'B', 'C']) {
  const r = modes.filter((m) => m.id[0] === fam), worst = r.reduce((a, b) => (b.relLinf > a.relLinf ? b : a));
  row(`P.${fam} max rel Linf over ${r.length} solves (worst ${worst.id} N=${worst.N})`, fmt(worst.relLinf), '<= 1e-7', worst.relLinf <= 1e-7);
}
const modeRes = Math.max(...modes.map((m) => m.trueRelRes));
row('P.res mode solves: max final true residual / ||rhs|| (solve tol 1e-12)', fmt(modeRes), '<= 1e-8', modeRes <= 1e-8);
// ---------- P.D ----------
const DN = quick ? [8, 16, 32] : [16, 32, 64, 128];
const Dres = PF.runD(1e-12, DN); write('pressure_D.json', Dres);
const Dsec = quick ? null : PF.runD(1e-12, [8, 16, 32, 64]); if (Dsec) write('pressure_D_N8-64_info.json', Dsec);
for (const p of Dres.points) {
  const ok = p.orders.every((o) => o >= 1.8 && o <= 2.2);
  row(`P.D order at ${p.point}, N=${DN.join('/')}`, p.orders.map((o) => o.toFixed(3)).join(', '), 'each in [1.8, 2.2]', ok);
  row(`P.D series truncation / discretization error at ${p.point} (K=41 vs K=801)`, fmt(p.truncRatioMax), '< 1e-2', p.truncRatioMax < 1e-2);
}

// ---------- dynamic-run helpers ----------
function gradeSolver(tag, log) {
  const res = Math.max(...log.map((r) => r.pcgTrueRelRes));
  row(`P.res ${tag}: max final true residual / ||rhs|| over ${log.length} solves`, fmt(res), '<= 1e-8', res <= 1e-8);
  let worst = 0, at = -1;
  for (let i = 20; i < log.length; i++) { const md = median(log.slice(i - 20, i).map((r) => r.pcgIters)); const ratio = md > 0 ? log[i].pcgIters / md : (log[i].pcgIters > 0 ? Infinity : 0); if (ratio > worst) { worst = ratio; at = i; } }
  row(`P.res ${tag}: max iters / median(prev 20) (steps > 20)`, worst === Infinity ? 'inf' : worst.toFixed(3) + (at >= 0 ? ` at step ${at + 1}` : ''), '<= 2', worst <= 2);
  const dv = Math.max(...log.map((r) => r.maxDivDt));
  row(`P.div ${tag}: max |div u| * dt over all projections`, fmt(dv), '<= 1e-6', dv <= 1e-6);
}
function csv(log) {
  const head = ['step', 't', 'dt', 'nSub', 'E', 'KE', 'PE', ...STAGES.map((s) => 'd_' + s), ...STAGES.map((s) => 'cum_' + s), 'pcgIters', 'pcgRelRes', 'pcgTrueRelRes', 'maxDivDt', 'fluidCells', 'nGhost', 'nWall', 'nSep', 'maxU', 'mass', 'Px', 'Py', 'Pz', 'wCom', 'zCom'];
  return head.join(',') + '\n' + log.map((r) => head.map((k) => (k.startsWith('d_') ? r.stage[k.slice(2)] : k.startsWith('cum_') ? r.stageCum[k.slice(4)] : r[k])).join(',')).join('\n') + '\n';
}

// ---------- T1 still pool ----------
const H = 0.5, T1_TIME = 10;
const t1 = [];
for (const N of [8, 16, 32]) {
  const h = H / N, nz = Math.round(1.25 * N), s = new Sim({ nx: N, ny: N, nz, h, seed: 1000 + N });
  s.seedBlock(0, N, 0, N, 0, N);
  const E0 = s.particleEnergy().ke + s.particleEnergy().pe, t0 = Date.now();
  const nFrames = Math.round(T1_TIME / s.frame);
  for (let f = 0; f < nFrames; f++) s.advanceFrame();
  const log = s.log, L = N * h, W = N * h;
  write(`T1_N${N}_log.csv`, csv(log));
  // pressure profile on interior fluid cells (all 6 neighbours fluid, inside box)
  const P = s.lastP, cnt = s.cellCount, id = (i, j, k) => i + N * (j + N * k);
  let pErr = 0;
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const c = id(i, j, k); if (!(cnt[c] > 0)) continue;
    if (![id(i - 1, j, k), id(i + 1, j, k), id(i, j - 1, k), id(i, j + 1, k), id(i, j, k - 1), id(i, j, k + 1)].every((q) => cnt[q] > 0)) continue;
    const z = (k + 0.5) * h, ex = rho * g * (H - z); pErr = Math.max(pErr, Math.abs(P[c] - ex) / ex);
  }
  // floor force: p at z=0 by linear extrapolation of the first two cell pressures
  let Ff = 0; for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const p0 = P[id(i, j, 0)], p1 = P[id(i, j, 1)]; Ff += (1.5 * p0 - 0.5 * p1) * h * h; }
  // side wall x=0: midpoint sum of wall-adjacent cell pressures
  let Fw = 0; for (let k = 0; k < nz; k++) for (let j = 0; j < N; j++) { const p = P[id(0, j, k)]; if (p === p) Fw += p * h * h; }
  const FfEx = rho * g * H * L * W, FwEx = 0.5 * rho * g * H * H * W;
  const Emax = Math.max(...log.map((r) => (r.E - E0) / Math.abs(E0)));
  const maxU = log[log.length - 1].maxU;
  const r = { N, hOverH: 1 / N, steps: log.length, simTime: s.t, wallSec: (Date.now() - t0) / 1000, maxU_end: maxU, maxU_run: Math.max(...log.map((q) => q.maxU)), pErr, floorForce: Ff, floorExact: FfEx, floorErr: Math.abs(Ff - FfEx) / FfEx, wallForce: Fw, wallExact: FwEx, wallErr: Math.abs(Fw - FwEx) / FwEx, energyRelMax: Emax, particles: s.count, cells: [N, N, nz] };
  t1.push(r); console.log(JSON.stringify(r));
  const lim = 1e-3 * Math.sqrt(g * H);
  row(`T1 N=${N} (h/H=1/${N}): max|u| at t=${s.t.toFixed(3)} s`, fmt(maxU), `< ${fmt(lim)} (1e-3 sqrt(gH))`, maxU < lim);
  row(`T1 N=${N}: pressure profile max rel err, interior cells`, fmt(pErr), '<= 1e-2', pErr <= 1e-2);
  row(`T1 N=${N}: max_t (E-E0)/|E0|`, fmt(Emax), '<= 1e-6', Emax <= 1e-6);
  gradeSolver(`T1 N=${N}`, log);
}
const fit = (key) => { const xs = t1.map((r) => Math.log(r.hOverH)), ys = t1.map((r) => Math.log(r[key])); const mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length; let sxy = 0, sxx = 0; xs.forEach((x, i) => { sxy += (x - mx) * (ys[i] - my); sxx += (x - mx) ** 2; }); return sxy / sxx; };
for (const [key, name] of [['floorErr', 'floor'], ['wallErr', 'side wall']]) {
  const order = fit(key), e32 = t1[2][key];
  row(`T1 ${name} force: fitted order of e(h) over h/H=1/8,1/16,1/32`, order.toFixed(3) + ` (e = ${t1.map((r) => fmt(r[key])).join(', ')})`, '>= 0.8', order >= 0.8);
  row(`T1 ${name} force: e at h/H=1/32`, fmt(e32), '<= 1e-2', e32 <= 1e-2);
}
write('T1_summary.json', t1);
let conv = '| h/H | floor F (N) | exact | rel err | wall F (N) | exact | rel err |\n|---|---|---|---|---|---|---|\n';
for (const r of t1) conv += `| 1/${r.N} | ${r.floorForce.toFixed(6)} | ${r.floorExact.toFixed(6)} | ${fmt(r.floorErr)} | ${r.wallForce.toFixed(6)} | ${r.wallExact.toFixed(6)} | ${fmt(r.wallErr)} |\n`;
conv += `\nFitted order (least squares, log e vs log h): floor ${fit('floorErr').toFixed(3)}, wall ${fit('wallErr').toFixed(3)}\n`;
write('T1_force_convergence.md', conv);

// ---------- T2 free fall ----------
{
  const h = 0.025, N = 24, nz = 64, s = new Sim({ nx: N, ny: N, nz, h, seed: 2024 });
  s.seedBlock(8, 16, 8, 16, 48, 56); // 0.2 m cube, bottom 1.2 m above the floor
  const M = s.count * s.mp, tEnd = 0.4, t0 = Date.now();
  while (s.t < tEnd - 1e-12) s.advanceFrame();
  const log = s.log; write('T2_log.csv', csv(log));
  const ts = log.map((r) => r.t), ws = log.map((r) => r.wCom), n = ts.length;
  const mt = ts.reduce((a, b) => a + b) / n, mw = ws.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (ts[i] - mt) * (ws[i] - mw); sxx += (ts[i] - mt) ** 2; }
  const a = -sxy / sxx, relA = Math.abs(a - g) / g;
  const minZ = (() => { let m = Infinity; for (let p = 0; p < s.count; p++) m = Math.min(m, s.x[3 * p + 2]); return m; })();
  row(`T2 COM vertical acceleration (linear fit of w_com, ${n} substeps, t<=${s.t.toFixed(3)} s; a=${a.toFixed(9)})`, fmt(relA), '|a-g|/g <= 1e-3', relA <= 1e-3, `min particle z at end ${minZ.toFixed(3)} m: no floor contact`);
  let worstP = 0; for (const r of log) worstP = Math.max(worstP, Math.max(Math.abs(r.Px), Math.abs(r.Py)) / (1e-8 * M * g * r.t));
  row('T2 horizontal momentum max_t max(|Px|,|Py|) / (1e-8 M g t)', fmt(worstP), '<= 1', worstP <= 1);
  gradeSolver('T2', log);
  write('T2_summary.json', { a, relA, M, steps: n, simTime: s.t, wallSec: (Date.now() - t0) / 1000, minZ, worstP });
}
let md = `# Step 1 gate results (${runId})\n\n| # | Check | Measured | Threshold | Result |\n|---|---|---|---|---|\n`;
rows.forEach((r, i) => { md += `| ${i + 1} | ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass ? 'PASS' : 'FAIL'}${r.note ? ' (' + r.note + ')' : ''} |\n`; });
md += `\nTotal: ${rows.filter((r) => r.pass).length} PASS, ${rows.filter((r) => !r.pass).length} FAIL\n`;
write('results.md', md); write('results.json', rows);
console.log('OUT ' + outDir);
