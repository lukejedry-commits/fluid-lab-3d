'use strict';
/** Step 4: T3 dam break (+ T4 volume over the T3 run) and C3 regressions. ASSERTS md5 04900721.
 *  node test/run_step4_t3.js --part T3|C3|summary   [--a 16]
 *  Writes into results/step4_t3/ ; refuses to overwrite any file. */
const fs = require('fs'), path = require('path');
const { Sim, STAGES } = require('../src/sim');
const part = process.argv[process.argv.indexOf('--part') + 1];
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const outDir = path.join(__dirname, '../results/step4_t3');
fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) => { const f = path.join(outDir, name); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 1)); };
const rows = [];
const row = (id, measured, threshold, pass, note = '') => { rows.push({ part, id, measured, threshold, pass: !!pass, note }); console.log((pass ? 'PASS ' : 'FAIL ') + id + ' : ' + measured + ' vs ' + threshold + (note ? ' (' + note + ')' : '')); };
const info = (id, measured, note = '') => { rows.push({ part, id, measured, threshold: 'info (not graded)', pass: null, note }); console.log('INFO ' + id + ' : ' + measured); };
const fmt = (x) => (typeof x === 'number' ? x.toExponential(3) : String(x));
const g = 9.81;
const median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]); };
const done = () => write(`rows_${part}.json`, rows);
function csv(log) {
  const head = ['step', 't', 'dt', 'nSub', 'E', 'KE', 'PE', ...STAGES.map((s) => 'd_' + s), ...STAGES.map((s) => 'cum_' + s), 'pcgIters', 'pcgRelRes', 'pcgTrueRelRes', 'maxDivDt', 'fluidCells', 'nGhost', 'nWall', 'nSep', 'maxU', 'front', 'Z', 'T', 'frontSpeed', 'volEst', 'mass', 'Px', 'Py', 'Pz', 'zCom'];
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
// T4 density estimate: each cell holds at most one cell volume; particles beyond 8/cell (compression) add nothing
const volEst = (s) => { const c = s.markCells(); let n = 0; for (let i = 0; i < c.length; i++) n += Math.min(c[i], 8); return n * s.h ** 3 / 8; };
const frontX = (s) => { let m = 0; for (let p = 0; p < s.count; p++) m = Math.max(m, s.x[3 * p]); return m; };

if (part === 'T3') {
  // Martin & Moyce n^2 = 2: column a (x, against back wall x=0) x a (y, full tank width) x 2a (z). a = 2.25 in.
  const A = Number(arg('--a', 16)), a = 2.25 * 0.0254, h = a / A, nx = 16 * A, ny = A, nz = Math.round(2.5 * A);
  const s = new Sim({ nx, ny, nz, h, seed: 1952 }); s.seedBlock(0, A, 0, ny, 0, 2 * A);
  const M = s.count * s.mp, N0 = s.count, e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, V0 = volEst(s), Tfac = Math.sqrt(2 * g / a), ritter = 2 * Math.sqrt(g * 2 * a);
  console.log(`T3: a=${a} m, h=${h}, grid ${nx}x${ny}x${nz}, particles ${N0}, E0=${E0}, V0=${V0}, Ritter ${ritter} m/s`);
  let prevF = frontX(s), prevT = 0; const t0 = Date.now(); let volWorst = 0, sumDt2 = 0;
  s.onSubstep = (sim, rec) => { const f = frontX(sim); rec.front = f; rec.Z = f / a; rec.T = rec.t * Tfac; rec.frontSpeed = (f - prevF) / (rec.t - prevT); prevF = f; prevT = rec.t;
    rec.volEst = volEst(sim); volWorst = Math.max(volWorst, Math.abs(rec.volEst - V0) / V0); sumDt2 += rec.dt * rec.dt; };
  const tEnd = 14.6 / Tfac + 0.15; let f = 0;
  while (s.t < tEnd && prevF / a < 15.5) { s.advanceFrame(); f++; if (f % 5 === 0) console.log(`frame ${f} t=${s.t.toFixed(4)} Z=${(prevF / a).toFixed(3)} E-rel=${((s.log.at(-1).E - E0) / Math.abs(E0)).toExponential(3)} elapsed ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  write('T3_log.csv', csv(s.log)); write('T3_frames.csv', frameCsv(s.frameLog));
  const L = s.log;
  // Ritter
  const vmax = L.reduce((b, r) => (r.frontSpeed > b.frontSpeed ? r : b));
  row(`T3 Ritter: max front speed over all ${L.length} substep samples (front = max particle x; at t=${vmax.t.toFixed(4)} s, Z=${vmax.Z.toFixed(3)})`, `${vmax.frontSpeed.toFixed(4)} m/s (${(vmax.frontSpeed / ritter).toFixed(4)} of limit)`, `< 2 sqrt(g 2a) = ${ritter.toFixed(4)} m/s`, vmax.frontSpeed < ritter);
  // energy
  let worst = -Infinity, wAt = null; for (const r of L) { const rel = (r.E - E0) / Math.abs(E0); if (rel > worst) { worst = rel; wAt = r; } }
  let prev = E0; const rise = {}; for (const r of L) { if (r.E > prev) { const k = Object.keys(r.stage).reduce((x, y) => (r.stage[y] > r.stage[x] ? y : x)); rise[k] = (rise[k] || 0) + 1; } prev = r.E; }
  row('T3.E: max (E-E0)/|E0| over all steps (PE datum floor z=0)', fmt(worst) + ` (t=${wAt.t.toFixed(4)} s)`, '<= 1e-6', worst <= 1e-6, `steps where E rose, by largest stage: ${JSON.stringify(rise)}`);
  const pp = L.filter((r) => r.stage.pressure > 0), ppMax = pp.length ? Math.max(...pp.map((r) => r.stage.pressure)) : Math.max(...L.map((r) => r.stage.pressure));
  row('T3 pressure-stage dE <= 0 at every step (NM)', `${pp.length} of ${L.length} steps > 0; max stage dE ${fmt(ppMax)} J`, '<= 0 every step', pp.length === 0);
  for (const k of STAGES) info(`T3 stage ${k}: cumulative dE / max |dE| per step / steps with dE>0`, `${fmt(s.stageCum[k])} J / ${fmt(Math.max(...L.map((r) => Math.abs(r.stage[k]))))} J / ${L.filter((r) => r.stage[k] > 0).length}`);
  // volume (T4)
  row(`T4 particle count exact (${N0})`, String(s.count), `== ${N0}`, s.count === N0);
  row('T4 density-estimated volume, max |V-V0|/V0 over the T3 run', fmt(volWorst), '<= 1e-2', volWorst <= 1e-2, `V0 = ${V0.toExponential(6)} m^3, estimator sum_c min(n_c,8) h^3/8`);
  // info: energy loss vs sum 0.5 M g^2 dt^2
  const loss = E0 - L.at(-1).E, pred = 0.5 * M * g * g * sumDt2;
  info('T3 info: energy loss E0-E_end vs sum_k 0.5 M g^2 dt_k^2', `${fmt(loss)} J vs ${fmt(pred)} J; ratio ${(loss / pred).toFixed(4)} (${L.length} substeps)`);
  // M&M
  const mm = JSON.parse(fs.readFileSync(path.join(__dirname, '../spec/mm_1952.json'), 'utf8'));
  const Tat = (Z) => { for (let i = 0; i < L.length; i++) if (L[i].Z >= Z) { const Za = i ? L[i - 1].Z : 1, Ta = i ? L[i - 1].T : 0; return Ta + (L[i].T - Ta) * (Z - Za) / (L[i].Z - Za); } return NaN; };
  const shift = 1.19 - Tat(1.44); const cmp = [];
  info('T3.mm time shift applied (T_sim = t sqrt(2g/a) + shift, so T=1.19 at Z=1.44); Z = (max particle x from back wall)/a, starts at 1', shift.toFixed(4), `raw T at Z=1.44 = ${Tat(1.44).toFixed(4)}`);
  for (const r of mm.rows) { const Ts = Tat(r.Z) + shift, rel = (Ts - r.T_mean) / r.T_mean; cmp.push({ Z: r.Z, T_mean: r.T_mean, T_sim: Ts, rel });
    if (r.Z <= 1.22) info(`T3.mm Z=${r.Z}: T_sim vs T_mean (release dominated)`, `${Ts.toFixed(3)} vs ${r.T_mean} (${(100 * rel).toFixed(2)}%)`);
    else if (r.Z >= 1.67) row(`T3.mm Z=${r.Z}: |T_sim - T_mean|/T_mean (T_sim ${isNaN(Ts) ? 'not reached' : Ts.toFixed(3)}, T_mean ${r.T_mean})`, isNaN(rel) ? 'not reached' : (100 * Math.abs(rel)).toFixed(2) + '%', '<= 8%', Math.abs(rel) <= 0.08);
    else info(`T3.mm Z=${r.Z} (shift anchor)`, `${Ts.toFixed(3)} vs ${r.T_mean}`); }
  write('T3_mm_compare.json', { shift, a, A, rows: cmp });
  gradeSolver('T3', L);
  const fl = s.frameLog; info('T3 CFL used per frame', `max ${Math.max(...fl.map((x) => x.cflUsed)).toFixed(4)}, min ${Math.min(...fl.map((x) => x.cflUsed)).toFixed(4)}; frames with 8-cap binding and CFL>1: ${fl.filter((x) => x.capBinds).length} of ${fl.length}`);
  write('T3_summary.json', { a, A, h, grid: [nx, ny, nz], particles: N0, E0, V0, M, ritter, shift, frames: fl.length, substeps: L.length, tEnd: s.t, wallSec: (Date.now() - t0) / 1000, stageCum: s.stageCum });
  done();
}
if (part === 'C3') {
  // Each test runs with production defaults (must PASS) and with that one fix removed (must FAIL).
  const res = [];
  // C3.ghost: a uniformly moving blob; every m_f = 0 face that has a fluid-carrying neighbour must carry the mass-weighted neighbour velocity (= U).
  const ghostCase = (on) => { const s = new Sim({ nx: 12, ny: 12, nz: 12, h: 0.05, seed: 7, ghostFill: on }); const U = [0.3, -0.2, 0.1]; s.seedBlock(4, 8, 4, 8, 4, 8, U); s.p2g(); const nG = s.ghostFill();
    let err = 0, n = 0; for (let a = 0; a < 3; a++) { const P = s.P[a], st = [1, P[0], P[0] * P[1]], D = s.D[a];
      for (let k = 0; k < D[2]; k++) for (let j = 0; j < D[1]; j++) for (let i = 0; i < D[0]; i++) { const f = s.idx(a, i, j, k); if (s.mass[a][f] !== 0) continue;
        let nb = false; for (let b = 0; b < 3; b++) for (const sg of [-1, 1]) if (s.mass[a][f + sg * st[b]] > 0) nb = true; if (!nb) continue; n++; err = Math.max(err, Math.abs(s.vel[a][f] - U[a])); } }
    return { nG, n, err }; };
  // C3.wall: particles driven into every wall; all must stay in [r, L-r], the into-wall velocity is stripped and the tangential part kept.
  const wallCase = (on) => { const s = new Sim({ nx: 8, ny: 8, nz: 8, h: 0.05, seed: 8, wallStrip: on }); const L = 0.4;
    s.addParticle(0.001, 0.2, 0.2, -2, 0.7, 0.3); s.addParticle(L - 0.001, 0.2, 0.2, 2, -0.4, 0.1); s.addParticle(0.2, 0.2, 0.0005, 0.5, 0.2, -3);
    s.x[0] -= 0.01; s.x[3] += 0.01; s.x[8] -= 0.01; s.wallStrip();
    let out = 0; for (let p = 0; p < s.count; p++) for (let b = 0; b < 3; b++) out = Math.max(out, s.pr - s.x[3 * p + b], s.x[3 * p + b] - (L - s.pr));
    const vOk = s.v[0] === 0 && s.v[1] === 0.7 && s.v[2] === 0.3 && s.v[3] === 0 && s.v[4] === -0.4 && s.v[8] === 0 && s.v[6] === 0.5 && s.v[7] === 0.2;
    return { out, vOk }; };
  // C3.sep: close pairs including one pressed against a wall: separated, inside the box, centre of mass unchanged to roundoff (equal and opposite).
  const sepCase = (on) => { const s = new Sim({ nx: 8, ny: 8, nz: 8, h: 0.05, seed: 9, sepClip: on }); const L = 0.4, r = s.pr;
    s.addParticle(r + 1e-4, 0.2, 0.2); s.addParticle(r + 2e-4, 0.2, 0.2); // pair at the x=0 wall
    s.addParticle(0.2, 0.2, 0.2); s.addParticle(0.2 + 1e-3, 0.2, 0.2); // interior pair
    const com0 = [0, 1, 2].map((b) => [0, 1, 2, 3].reduce((acc, p) => acc + s.x[3 * p + b], 0));
    s.separate(); const com = [0, 1, 2].map((b) => [0, 1, 2, 3].reduce((acc, p) => acc + s.x[3 * p + b], 0));
    let out = 0; for (let p = 0; p < 4; p++) for (let b = 0; b < 3; b++) out = Math.max(out, r - s.x[3 * p + b], s.x[3 * p + b] - (L - r));
    const dIn = Math.abs(s.x[9] - s.x[6]); return { out, dCom: Math.max(...com.map((c, b) => Math.abs(c - com0[b]))), dIn, minD: s.sepFrac * s.s }; };
  // separation off entirely (sepIters 0) -> interior pair stays too close
  const sepOff = () => { const s = new Sim({ nx: 8, ny: 8, nz: 8, h: 0.05, seed: 9, sepIters: 0 }); s.addParticle(0.2, 0.2, 0.2); s.addParticle(0.2 + 1e-3, 0.2, 0.2); s.separate(); return Math.abs(s.x[3] - s.x[0]); };
  for (const on of [true, false]) {
    const tag = on ? 'fix ON (production)' : 'fix REMOVED', exp = on ? 'PASS' : 'FAIL';
    const gc = ghostCase(on), gp = gc.n > 0 && gc.err <= 1e-12;
    row(`C3.ghost [${tag}, expect ${exp}]: max |u_f - U| over ${gc.n} m_f=0 faces next to fluid faces`, fmt(gc.err), '<= 1e-12', gp === on, `test verdict ${gp ? 'PASS' : 'FAIL'}; row passes when verdict == expected`);
    const wc = wallCase(on), wp = wc.out <= 0 && wc.vOk;
    row(`C3.wall [${tag}, expect ${exp}]: max distance outside [r, L-r]; into-wall v stripped & tangential kept`, `${fmt(wc.out)} m; v ok ${wc.vOk}`, '<= 0 and v ok', wp === on, `test verdict ${wp ? 'PASS' : 'FAIL'}`);
    const sc = sepCase(on), sp = sc.out <= 0 && sc.dCom <= 1e-15 && sc.dIn >= sc.minD * (1 - 1e-12);
    row(`C3.sep-clip [${tag}, expect ${exp}]: wall pair stays in box (max outside), COM change, interior pair distance`, `${fmt(sc.out)} m; ${fmt(sc.dCom)} m; ${fmt(sc.dIn)} vs ${fmt(sc.minD)}`, 'outside <= 0, dCOM <= 1e-15, d >= minD', sp === on, `test verdict ${sp ? 'PASS' : 'FAIL'}`);
    res.push({ on, gc, wc, sc });
  }
  const d0 = sepOff(), sp0 = d0 >= 0.5 * 0.025 * (1 - 1e-12);
  row('C3.sep [separation REMOVED (sepIters 0), expect FAIL]: interior pair distance vs minD', `${fmt(d0)} vs ${fmt(0.0125)}`, '>= minD', !sp0, `test verdict ${sp0 ? 'PASS' : 'FAIL'}`);
  write('C3_detail.json', res); done();
}
if (part === 'summary') {
  const all = []; for (const p of ['T3', 'C3']) { const f = path.join(outDir, `rows_${p}.json`); if (fs.existsSync(f)) all.push(...JSON.parse(fs.readFileSync(f, 'utf8'))); }
  const md5 = (f) => require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '../spec', f))).digest('hex');
  let md = `# Step 4: T3 dam break, T4 volume, C3 regressions\n\n- Code commit the runs executed at: ${process.env.CODE_COMMIT} (clean tree)\n- spec/ASSERTS.md md5 ${md5('ASSERTS.md')}; spec/mm_1952.json md5 ${md5('mm_1952.json')}\n- PE zero: floor z=0 (E = sum m (|v|^2/2 + g z), E0 = K0 + M g z_com,0)\n- T3.mm: Z = front x measured from the back wall / a (front starts at Z = 1); T = t sqrt(2g/a), shifted so T = 1.19 at Z = 1.44 (linear interpolation)\n\n| # | Part | Check | Measured | Threshold | Result |\n|---|---|---|---|---|---|\n`;
  all.forEach((r, i) => { md += `| ${i + 1} | ${r.part} | ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass === null ? 'INFO' : r.pass ? 'PASS' : 'FAIL'}${r.note ? ' (' + r.note + ')' : ''} |\n`; });
  md += `\nTotal graded: ${all.filter((r) => r.pass === true).length} PASS, ${all.filter((r) => r.pass === false).length} FAIL\n`;
  write('results.md', md); write('results.json', all);
}
