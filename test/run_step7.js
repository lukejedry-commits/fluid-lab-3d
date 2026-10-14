'use strict';
/** Step 7 (ASSERTS 57a77090): C3.tilted_tank, C3.separation, T3 a=16/a=8 with extra info rows.
 *  node test/run_step7.js --part tilted|separation|t3a16|t3a8|summary --out <results subfolder> */
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
const g = 9.81;
const lib = require('./lib_t3')({ row, info, write });

// strict interior: >= 1 particle and all 26 neighbours exist in-box and hold >= 1 (wall-adjacent excluded)
function strictInterior(s) { const c = s.markCells(), { nx, ny, nz } = s, id = (i, j, k) => i + nx * (j + ny * k); let n = 0, p = 0, peak = 0, peakAt = null;
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const v = c[id(i, j, k)]; if (v > peak) { peak = v; peakAt = [i, j, k]; } if (!v) continue;
    if (i === 0 || j === 0 || k === 0 || i === nx - 1 || j === ny - 1 || k === nz - 1) continue; let all = true;
    for (let dk = -1; dk <= 1 && all; dk++) for (let dj = -1; dj <= 1 && all; dj++) for (let di = -1; di <= 1; di++) if (!c[id(i + di, j + dj, k + dk)]) { all = false; break; }
    if (all) { n++; p += v; } }
  return { nInt: n, meanInt: p / n, peak, peakAt, cnt: c }; }
function tankRun(tag, tilted) {
  const N = 32, H = 0.5, h = H / N, L = N * h, nz = Math.round(1.25 * N), seed = 3232;
  const s = new Sim({ nx: N, ny: N, nz, h, seed, maxSub: 16, jitter: 0.5 });
  if (!tilted) s.seedBlock(0, N, 0, N, 0, N);
  else { // same sub-cell lattice and jitter as seedBlock; keep a sub-cell if its centre lies below z = H + 0.05 (x - L/2)
    const sp = h / 2, J = 0.5 * sp;
    for (let k = 0; k < nz; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) for (let c = 0; c < 8; c++) {
      const ox = (c & 1) + 0.5, oy = ((c >> 1) & 1) + 0.5, oz = ((c >> 2) & 1) + 0.5, X = (i + ox / 2) * h, Y = (j + oy / 2) * h, Z = (k + oz / 2) * h;
      if (Z >= H + 0.05 * (X - L / 2)) continue;
      s.addParticle(X + J * (2 * s.rand() - 1), Y + J * (2 * s.rand() - 1), Z + J * (2 * s.rand() - 1)); } }
  const e0 = s.particleEnergy(), E0 = e0.ke + e0.pe, cid = (i, j, k) => i + N * (j + N * k), F = [];
  const watch = { '[2,12,1]': cid(2, 12, 1), '[0,0,0]': cid(0, 0, 0), '[31,0,0]': cid(N - 1, 0, 0), '[0,31,0]': cid(0, N - 1, 0), '[31,31,0]': cid(N - 1, N - 1, 0) };
  const snap = (fr) => { const r = strictInterior(s), c = r.cnt, layers = [];
    for (let k = 0; k < nz; k++) { let q = 0; for (let m = 0; m < N * N; m++) q += c[m + N * N * k]; layers.push(q / (N * N)); }
    const last = s.log.at(-1); let exPush = 0; if (last) for (const k of STAGES) if (k !== 'pushout') exPush += last.stageCum[k];
    F.push({ frame: fr, t: s.t, meanInt: r.meanInt, nInt: r.nInt, peak: r.peak, peakAt: r.peakAt, E: last ? last.E : E0, exPush, maxU: last ? last.maxU : 0, layers, watch: Object.fromEntries(Object.entries(watch).map(([k, v]) => [k, c[v]])) }); };
  snap(0); const t0 = Date.now();
  for (let f = 1; f <= 120; f++) { s.advanceFrame(); snap(f); if (f % 20 === 0) console.log(`${tag} frame ${f} peak ${F.at(-1).peak} mean ${F.at(-1).meanInt.toFixed(4)} ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  info(`${tag} setup`, `N=32, H=0.5 m, grid 32x32x40, ${s.count} particles, seed ${seed}, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames` + (tilted ? ', surface z = H + 0.05 (x - L/2)' : ''));
  return { s, F, E0, H };
}
function gradeTank(R, tag, gradeBunch) {
  const { s, F, E0, H } = R;
  let wm = 0, wmAt = 0; for (const f of F) { const d = Math.abs(f.meanInt - 8) / 8; if (d > wm) { wm = d; wmAt = f.frame; } }
  const pk = F.reduce((b, f) => (f.peak > b.peak ? f : b));
  const mT = `${fmt(wm)} (frame ${wmAt}, m=${F[wmAt].meanInt.toFixed(4)}, ${F[wmAt].nInt} cells)`, pT = `${pk.peak} (frame ${pk.frame}, cell ${JSON.stringify(pk.peakAt)})`;
  if (gradeBunch) { row(`${tag} strict interior mean within 1% of 8, every frame`, mT, '<= 1e-2', wm <= 0.01); row(`${tag} peak cell count, every frame`, pT, '<= 16', pk.peak <= 16); }
  else { info(`${tag} strict interior mean (info per section Z)`, mT); info(`${tag} peak cell count (info)`, pT); }
  let we = -Infinity, wx = -Infinity; for (const f of F) { we = Math.max(we, (f.E - E0) / Math.abs(E0)); wx = Math.max(wx, f.exPush / Math.abs(E0)); }
  let ws = -Infinity; for (const r of s.log) ws = Math.max(ws, (r.E - E0) / Math.abs(E0)); we = Math.max(we, ws);
  row(`${tag} total energy max (E-E0)/|E0| (every step)`, fmt(we), '<= 1e-6', we <= 1e-6);
  if (tag.includes('tilted')) row(`${tag} energy summed over all stages except push-out, max over frames / |E0|`, fmt(wx), '<= 1e-6', wx <= 1e-6);
  const C = s.log.at(-1).stageCum; info(`${tag} cumulative stage energy at end (J)`, STAGES.map((k) => `${k} ${fmt(C[k])}`).join('; '), `|E0| = ${fmt(Math.abs(E0))} J`);
  const pu = s.log.map((r) => r.stage.pushout); info(`${tag} push-out stage: cumulative / max per step / steps > 0`, `${fmt(C.pushout)} J (${fmt(C.pushout / Math.abs(E0))} |E0|) / ${fmt(Math.max(...pu))} J / ${pu.filter((x) => x > 0).length} of ${pu.length}`);
  const mu = s.log.at(-1).maxU;
  if (tag.includes('separation')) row(`${tag} max|u| at t=2 s`, fmt(mu), `< ${fmt(1e-3 * Math.sqrt(g * H))}`, mu < 1e-3 * Math.sqrt(g * H));
  else info(`${tag} max|u| at t=2 s / max over run`, `${fmt(mu)} / ${fmt(Math.max(...s.log.map((r) => r.maxU)))}`);
  for (const k of Object.keys(F[0].watch)) { const v = F.map((f) => f.watch[k]); info(`${tag} cell ${k} count start / max / end`, `${v[0]} / ${Math.max(...v)} / ${v.at(-1)}`); }
  info(`${tag} layer mean particles/cell k=0..4 at start / end`, `${F[0].layers.slice(0, 5).map((x) => x.toFixed(3)).join(', ')} / ${F.at(-1).layers.slice(0, 5).map((x) => x.toFixed(3)).join(', ')}`);
  write(`${tag}_frames.json`, F);
}
if (part === 'tilted') { const R = tankRun('C3.tilted_tank', true); gradeTank(R, 'C3.tilted_tank', true); write(`rows_${part}.json`, rows); }
if (part === 'separation') { const R = tankRun('C3.separation', false); gradeTank(R, 'C3.separation', false); write(`rows_${part}.json`, rows); }
if (part === 't3a16' || part === 't3a8') {
  const A = part === 't3a16' ? 16 : 8, wallSeries = [], layerSeries = [];
  const instrument = (s) => { // (a) particle's own APIC field at the nearest wall, normal component
    const og = s.g2p.bind(s), { nx, ny, nz, h } = s, Ly = ny * h;
    s.g2p = () => { og(); const st = { floor: [0, 0, 0, 0], back: [0, 0, 0, 0], side: [0, 0, 0, 0] }; // [n, sum un, max into, count into]
      const add = (k, un, into) => { const a = st[k]; a[0]++; a[1] += un; if (into > 0) { a[3]++; a[2] = Math.max(a[2], into); } };
      for (let p = 0; p < s.count; p++) { const x = s.x[3 * p], y = s.x[3 * p + 1], z = s.x[3 * p + 2], C = 9 * p;
        if (Math.floor(z / h) === 0) { const un = s.v[3 * p + 2] + s.C[C + 8] * (0 - z); add('floor', un, -un); }
        if (Math.floor(x / h) === 0) { const un = s.v[3 * p] + s.C[C + 0] * (0 - x); add('back', un, -un); }
        const j = Math.floor(y / h);
        if (j === 0) { const un = s.v[3 * p + 1] + s.C[C + 4] * (0 - y); add('side', un, -un); }
        if (j === ny - 1) { const un = s.v[3 * p + 1] + s.C[C + 4] * (Ly - y); add('side', -un, un); } }
      wallSeries.push({ t: s.t, ...Object.fromEntries(Object.entries(st).map(([k, a]) => [k, { n: a[0], meanUn: a[0] ? a[1] / a[0] : 0, maxInto: a[2], nInto: a[3] }])) }); }; };
  const onFrame = (s, fr) => { const c = s.cellCount || s.markCells(), { nx, ny } = s; const layers = []; let tot = 0; // (b) column region i < A
    for (let k = 0; k < 2 * A + 2; k++) { let q = 0; for (let j = 0; j < ny; j++) for (let i = 0; i < A; i++) q += c[i + nx * (j + ny * k)]; tot += q; layers.push(q / (A * ny)); }
    layerSeries.push({ frame: fr, t: s.t, columnTotal: tot, layers }); };
  const R = lib.runT3(A, { instrument, onFrame }); write(`T3a${A}_log.csv`, lib.csv(R.s.log)); write(`T3a${A}_T4_frames.json`, R.frames);
  lib.gradeRitter(R, `a${A}`); lib.gradeT3T4(R, `a${A}`);
  const L = R.s.log;
  if (A === 8) { const pm = L.filter((r) => r.dKEpMass > 0), pt = L.filter((r) => r.dKEpTheta > 1e-8 * r.pd.ke0Theta);
    row('a8 pressure-stage dKE, own-mass measure (= logged stage), every step', `${pm.length} of ${L.length} > 0` + (pm.length ? ` (steps ${pm.map((r) => r.step).join(',')}; max ${fmt(Math.max(...pm.map((r) => r.dKEpMass)))} J)` : ''), '<= 0 every step', pm.length === 0);
    row('a8 pressure-stage dKE, theta measure, every step', `${pt.length} of ${L.length} > 1e-8 KE_theta` + (pt.length ? ` (steps ${pt.map((r) => r.step).join(',')})` : `; max ${fmt(Math.max(...L.map((r) => r.dKEpTheta)))} J`), '<= 1e-8 x KE_theta,pre every step', pt.length === 0);
    write('a8_pressure_steps.json', L.map((r) => ({ step: r.step, t: r.t, mass: r.dKEpMass, solver: r.dKEpSolver, theta: r.dKEpTheta }))); }
  if (A === 16) {
    const third = Math.floor(wallSeries.length / 3), seg = [[0, third], [third, 2 * third], [2 * third, wallSeries.length]];
    for (const k of ['floor', 'back', 'side']) info(`a16 (Physics) APIC field at nearest wall, ${k}: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third`,
      seg.map(([a, b]) => { const w = wallSeries.slice(a, b).map((x) => x[k]); const n = w.reduce((s, x) => s + x.n, 0); return `[${(w.reduce((s, x) => s + x.meanUn * x.n, 0) / (n || 1)).toExponential(2)} / ${Math.max(...w.map((x) => x.maxInto)).toExponential(2)} / ${(w.reduce((s, x) => s + x.nInto, 0) / w.length).toFixed(0)} of ${(n / w.length).toFixed(0)}]`; }).join(' '));
    const pick = [0, 5, 10, 15, 20, 25, layerSeries.length - 1].filter((i) => i < layerSeries.length);
    info('a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames ' + pick.map((i) => layerSeries[i].frame).join(','), pick.map((i) => `f${layerSeries[i].frame}: [${layerSeries[i].layers.slice(0, 6).map((x) => x.toFixed(2)).join(' ')}] total ${layerSeries[i].columnTotal}`).join('; '));
    write('a16_wall_apic.json', wallSeries); write('a16_column_layers.json', layerSeries); }
  write(`rows_${part}.json`, rows);
}
if (part === 'summary') {
  const md5 = (f) => require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '../spec', f))).digest('hex');
  const all = []; for (const p of ['tilted', 'separation', 't3a16', 't3a8']) { const f = path.join(outDir, `rows_${p}.json`); if (fs.existsSync(f)) all.push(...JSON.parse(fs.readFileSync(f, 'utf8'))); }
  let md = `# ${arg('--title')}\n\n- Code commit the runs executed at: ${process.env.CODE_COMMIT} (clean tree)\n- spec/ASSERTS.md md5 ${md5('ASSERTS.md')}; PHYSICS_SPEC.md md5 ${md5('PHYSICS_SPEC.md')}\n- PE zero: floor z=0; substep cap 16\n\n| # | Part | Check | Measured | Threshold | Result |\n|---|---|---|---|---|---|\n`;
  all.forEach((r, i) => { md += `| ${i + 1} | ${r.part} | ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass === null ? 'INFO' : r.pass ? 'PASS' : 'FAIL'}${r.note ? ' (' + r.note + ')' : ''} |\n`; });
  md += `\nTotal graded: ${all.filter((r) => r.pass === true).length} PASS, ${all.filter((r) => r.pass === false).length} FAIL\n`;
  write('results.md', md); write('results.json', all);
}
