'use strict';
/** Step 19 Phase B2 (ASSERTS da859722 Z 2026-10-14m, PHYSICS_SPEC b2d23ec4 7.7): copy of the step-15 runner; thetaMode 'colvol' (sim default);
 *  adds step19_hooks.js (graded energy-bookkeeping closure row; info push-out fraction, colvol fallback fraction). */
const H19 = require('./step19_hooks');
/** Step 15 (ASSERTS b9ac9edd, Z 2026-10-14i/j fix 3 v6; a=8 T3.mm info if the convergence row passes; separation stage trace), from run_step14.js. Step 14 (ASSERTS dc6da53d, Z 2026-10-14g/h fix 3 v5; Ritter short (<= 1+q) and long (<= 1.0) windows), from run_step13.js. Step 13 (ASSERTS e11ce6c1, Z 2026-10-14f fix 3 v4; PE_pack retired -> info), from run_step12.js. Step 12 (ASSERTS 4aa58d75, Z 2026-10-14e fix 3 v3), from run_step11.js. Step 11 (ASSERTS f7c49415, Z 2026-10-14d fix 3 v2), from run_step10.js. Step 10 (ASSERTS 8b21311b), from run_step9.js. Step 9 C3.revert (ASSERTS 8147c6cb), derived from run_step8.js; C3.fix2 retired (clamp reverted): C3.tilted_tank, C3.separation, T3 a=16/a=8 with extra info rows.
 *  node test/run_step15.js --part tilted|separation|t3a16|t3a8|summary --out <results subfolder> */
const fs = require('fs'), path = require('path');
const { Sim, STAGES } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const DENSOFF = process.argv.includes('--densoff'); // INFO-ONLY fix-3-off comparison run (Z 2026-10-14f)
const ALPHA = arg('--alpha') ? +arg('--alpha') : null; // INFO-ONLY override (Z 2026-10-14e); frozen alpha = 0.1
const part = arg('--part'), outDir = path.join(__dirname, '../results', arg('--out'));
fs.mkdirSync(outDir, { recursive: true });
const write = (name, data) => { if (name.startsWith('rows_') && name !== 'rows_summary.json' && Array.isArray(data)) H19.finalize(row, info, name.slice(5, -5)); const f = path.join(outDir, name); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof data === 'string' ? data : JSON.stringify(data, null, 1)); };
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
  const s = new Sim({ nx: N, ny: N, nz, h, seed, maxSub: 16, jitter: 0.5, densAlpha: ALPHA ?? 0.1 });
  if (!tilted) s.seedBlock(0, N, 0, N, 0, N);
  else { // same sub-cell lattice and jitter as seedBlock; keep a sub-cell if its centre lies below z = H + 0.05 (x - L/2)
    const sp = h / 2, J = 0.5 * sp;
    for (let k = 0; k < nz; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) for (let c = 0; c < 8; c++) {
      const ox = (c & 1) + 0.5, oy = ((c >> 1) & 1) + 0.5, oz = ((c >> 2) & 1) + 0.5, X = (i + ox / 2) * h, Y = (j + oy / 2) * h, Z = (k + oz / 2) * h;
      if (Z >= H + 0.05 * (X - L / 2)) continue;
      s.addParticle(s.seedClamp(X + J * (2 * s.rand() - 1), 0), s.seedClamp(Y + J * (2 * s.rand() - 1), 1), s.seedClamp(Z + J * (2 * s.rand() - 1), 2)); } }
  { const ow = s.wallStrip.bind(s), os = s.separate.bind(s); let X0 = null, V0 = null; s._spike = null;
    s.wallStrip = () => { X0 = Float64Array.from(s.x.subarray(0, 3 * s.count)); V0 = Float64Array.from(s.v.subarray(0, 3 * s.count)); return ow(); };
    s.separate = () => { const r = os(); let best = null, tot = 0;
      for (let p = 0; p < s.count; p++) { let ke = 0; for (let b = 0; b < 3; b++) ke += s.v[3 * p + b] ** 2 - V0[3 * p + b] ** 2;
        const dE = 0.5 * s.mp * ke + s.mp * s.g * (s.x[3 * p + 2] - X0[3 * p + 2]); tot += dE;
        if (!best || dE > best.dE) best = { particle: p, dE, x0: [X0[3 * p], X0[3 * p + 1], X0[3 * p + 2]], dx: [0, 1, 2].map((b) => s.x[3 * p + b] - X0[3 * p + b]), v0: [V0[3 * p], V0[3 * p + 1], V0[3 * p + 2]], v1: [s.v[3 * p], s.v[3 * p + 1], s.v[3 * p + 2]] }; }
      if (!s._spike || tot > s._spike.stepDE) s._spike = { step: s.step + 1, t: s.t, stepDE: tot, top: best }; return r; }; }
  { let dmin = Infinity; for (let p = 0; p < s.count; p++) for (let b = 0; b < 3; b++) dmin = Math.min(dmin, s.x[3 * p + b], s.L[b] - s.x[3 * p + b]);
    row(`${tag} C3.seed: min distance of any seeded particle to any wall at t=0`, `${dmin.toExponential(4)} m`, `>= clearance ${s.pr.toExponential(4)} m`, dmin >= s.pr); }
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
  { const L = s.log, D = L.map((r) => r.dens).filter(Boolean), sumPE = L.reduce((a, r) => a + r.densPE, 0), maxKE = Math.max(...L.map((r) => r.densKE));
    if (tag.includes('separation')) row(`${tag} C3.separation anti-inflation (fix 3 on): |sum over steps of stage dPE| over 2 s`, `${fmt(Math.abs(sumPE))} J (signed ${fmt(sumPE)} J; ${fmt(Math.abs(sumPE) / Math.abs(E0))} |E0|)`, `<= 1e-6 |E0| = ${fmt(1e-6 * Math.abs(E0))} J`, Math.abs(sumPE) <= 1e-6 * Math.abs(E0));
    else info(`${tag} fix3 stage: signed sum of dPE over run`, `${fmt(sumPE)} J (${fmt(sumPE / Math.abs(E0))} |E0|)`);
    info(`${tag} fix3 stage dKE max per step (one-sided)`, `${fmt(maxKE)} J`);
    const fa = D.map((d) => d.fracAboveDead), em = D.filter((d) => d.nE).map((d) => d.eMean);
    info(`${tag} fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any`, `${fmt(fa.reduce((a, b) => a + b, 0) / fa.length)} / ${fmt(Math.max(...fa))}; ${D.filter((d) => d.nAboveDead).length} of ${D.length}`);
    info(`${tag} fix3 mean e over corrected cells per step: mean / min / max (steps corrected)`, em.length ? `${fmt(em.reduce((a, b) => a + b, 0) / em.length)} / ${fmt(Math.min(...em))} / ${fmt(Math.max(...em))} (${em.length})` : 'no step had a cell above the dead-band');
    { info(`${tag} fix3 ebar_T4 max |.| / steps with nonzero target`, `${fmt(Math.max(...D.map((d) => Math.abs(d.ebarT4))))} / ${D.filter((d) => d.targetPerCell !== 0).length} of ${D.length}`);
    const nm = Math.max(...D.map((d) => d.targetErrMax ?? 0)); row(`${tag} C3.fix3 target sum |sum e - target_r| / n_r, every step`, fmt(nm), '<= 1e-12', nm <= 1e-12); }
    const it = D.map((d) => d.iters); info(`${tag} fix3 PCG iterations (mean / max)`, `${(it.reduce((a, b) => a + b, 0) / it.length).toFixed(2)} / ${Math.max(...it)}`);
    info(`${tag} fix3 max |dx|/h (correction alone) / cap-hit steps`, `${Math.max(...D.map((d) => d.maxDx)).toFixed(4)} / ${D.filter((d) => d.capped).length} of ${D.length}`);
    write(`${tag}_fix3_steps.json`, L.map((r) => ({ step: r.step, t: r.t, dKE: r.densKE, dPE: r.densPE, dens: r.dens }))); }
  const mu = s.log.at(-1).maxU;
  if (tag.includes('separation')) row(`${tag} max|u| at t=2 s`, fmt(mu), `< ${fmt(1e-3 * Math.sqrt(g * H))}`, mu < 1e-3 * Math.sqrt(g * H));
  else info(`${tag} max|u| at t=2 s / max over run`, `${fmt(mu)} / ${fmt(Math.max(...s.log.map((r) => r.maxU)))}`);
  { const st1 = s.log[0].stage.pushout; row(`${tag} C3.seed: push-out dE at step 1 (t=0 step, not excluded)`, `${fmt(st1)} J (${fmt(st1 / Math.abs(E0))} |E0|)`, '<= 1e-6 |E0|', st1 <= 1e-6 * Math.abs(E0)); }
  if (s._spike) { const sp = s._spike, b = sp.top; info(`${tag} push-out energy spike (largest per-step push-out dE)`, `step ${sp.step} (t=${sp.t.toFixed(4)} s): step dE ${fmt(sp.stepDE)} J; top particle #${b.particle} dE ${fmt(b.dE)} J, x0 [${b.x0.map((v) => v.toFixed(6)).join(', ')}] m, dx [${b.dx.map(fmt).join(', ')}] m, v before [${b.v0.map(fmt).join(', ')}] -> after [${b.v1.map(fmt).join(', ')}] m/s`); write(`${tag}_pushout_spike.json`, sp); }
  for (const k of Object.keys(F[0].watch)) { const v = F.map((f) => f.watch[k]); info(`${tag} cell ${k} count start / max / end`, `${v[0]} / ${Math.max(...v)} / ${v.at(-1)}`); }
  info(`${tag} layer mean particles/cell k=0..4 at start / end`, `${F[0].layers.slice(0, 5).map((x) => x.toFixed(3)).join(', ')} / ${F.at(-1).layers.slice(0, 5).map((x) => x.toFixed(3)).join(', ')}`);
  write(`${tag}_frames.json`, F);
}
if (part === 'tilted') { const R = tankRun('C3.tilted_tank', true); gradeTank(R, 'C3.tilted_tank', true); write(`rows_${part}.json`, rows); }
if (part === 'separation') { const R = tankRun('C3.separation', false); gradeTank(R, 'C3.separation', false);
  { // Z 2026-10-14j: per-step energy-by-stage trace over 2 s (INFO); gravity and pressure shown separately and merged
    const L = R.s.log, E0 = R.E0; let wi = 0; L.forEach((r, i) => { if (r.E > L[wi].E) wi = i; });
    const st = L[wi].stageCum, gp = st.gravity + st.pressure;
    info('C3.separation trace: step of max (E-E0)/|E0| and cumulative stage energies there (J)', `step ${L[wi].step} t=${L[wi].t.toFixed(4)} s, rise ${fmt((L[wi].E - E0) / Math.abs(E0))} |E0| = ${fmt(L[wi].E - E0)} J; gravity+pressure ${fmt(gp)}; ` + Object.entries(st).filter(([k]) => k !== 'gravity' && k !== 'pressure').map(([k, v]) => `${k} ${fmt(v)}`).join('; '));
    const pos = {}; for (const r of L) for (const [k, v] of Object.entries({ ...r.stage, 'gravity+pressure': r.stage.gravity + r.stage.pressure })) if (k !== 'gravity' && k !== 'pressure' && v > 0) pos[k] = (pos[k] || 0) + v;
    info('C3.separation trace: sum of positive per-step stage dE over 2 s by stage (J)', Object.entries(pos).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${fmt(v)}`).join('; '));
    const fr = [0, 0.25, 0.5, 1, 1.5, 2].map((t) => L.reduce((b, r) => (Math.abs(r.t - t) < Math.abs(b.t - t) ? r : b)));
    info('C3.separation trace: max|u| (m/s) at t = 0, 0.25, 0.5, 1, 1.5, 2 s', fr.map((r) => `${r.t.toFixed(2)}: ${fmt(r.maxU)}`).join('; '));
    let gu = []; for (let i = 1; i < L.length; i++) gu.push([L[i].maxU - L[i - 1].maxU, L[i]]); gu.sort((a, b) => b[0] - a[0]);
    info('C3.separation trace: 5 largest per-step max|u| increases (step: d max|u|, then that step\'s g2p / extension / gravity+pressure / pushout dE)', gu.slice(0, 5).map(([d, r]) => `${r.step}: +${fmt(d)}, ${fmt(r.stage.g2p)} / ${fmt(r.stage.extension)} / ${fmt(r.stage.gravity + r.stage.pressure)} / ${fmt(r.stage.pushout)}`).join('; '));
    write('C3.separation_stage_trace.json', L.map((r) => ({ step: r.step, t: r.t, E: r.E, maxU: r.maxU, stage: r.stage }))); } write(`rows_${part}.json`, rows); }
if (part === 't3a16' || part === 't3a8' || part === 'fix2check') {
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
  const fix2 = [], clampE = [], cross = [];
  const instrument2 = (s) => { instrument(s); const { nx, ny, nz, h } = s, n = [nx, ny, nz];
    const og = s.g2p.bind(s); s.g2p = () => { og(); let mx = -Infinity; // C3.fix2: max into-wall at-wall value over all 6 walls
      for (let p = 0; p < s.count; p++) for (let b = 0; b < 3; b++) { const x = s.x[3 * p + b], c = Math.floor(x / h);
        if (c <= 0) mx = Math.max(mx, -(s.v[3 * p + b] + s.C[9 * p + 4 * b] * (0 - x)));
        if (c >= n[b] - 1) mx = Math.max(mx, s.v[3 * p + b] + s.C[9 * p + 4 * b] * (s.L[b] - x)); }
      fix2.push({ t: s.t, maxInto: mx, nC: s.clampStats ? s.clampStats.nC : null, nU: s.clampStats ? s.clampStats.nU : null }); };
    const op = s.p2g.bind(s); s.p2g = () => { // clamp energy stage: grid KE after this P2G with vs without the previous step's clamp
      const ch = s.clampChanges; if (ch && ch.length) { const keep = ch.map(([p, b]) => [s.v[3 * p + b], s.C[9 * p + 4 * b]]);
        // restore only C_nn: push-out may have changed v since the clamp, and u_n is changed by the clamp only for d < 1e-3 h (counted separately)
        for (const [p, b, v0, c0] of ch) s.C[9 * p + 4 * b] = c0; op(); s.surfaceThetaMasses(); const keNo = s.gridKE();
        ch.forEach(([p, b], i) => { s.v[3 * p + b] = keep[i][0]; s.C[9 * p + 4 * b] = keep[i][1]; }); op(); s.surfaceThetaMasses(); clampE.push({ t: s.t, dKE: s.gridKE() - keNo, n: ch.length }); }
      else op(); s.clampChanges = null; };
    const oa = s.advect.bind(s); s.advect = (dt) => { const z0 = new Float64Array(s.count); for (let p = 0; p < s.count; p++) z0[p] = s.x[3 * p + 2];
      let flux = 0, fluxCol = 0; const W = s.vel[2]; for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const w = W[s.idx(2, i, j, 1)]; flux += w; if (i < A) fluxCol += w; }
      oa(dt); let up = 0, dn = 0, upC = 0, dnC = 0; for (let p = 0; p < s.count; p++) { const a0 = z0[p] < h, a1 = s.x[3 * p + 2] < h, col = s.x[3 * p] < A * h;
        if (a0 && !a1) { up++; if (col) upC++; } if (!a0 && a1) { dn++; if (col) dnC++; } }
      const k = h * h * dt / (h ** 3 / 8); cross.push({ t: s.t, netUpParticles: up - dn, gridFluxParticles: flux * k, netUpCol: upC - dnC, gridFluxCol: fluxCol * k }); }; };
  const f3 = [];
  const instrument3 = (s) => { instrument2(s); const { nx, ny, nz, h } = s;
    if (ALPHA !== null) s.densAlpha = ALPHA; if (DENSOFF) s.useDensFix = false;
    if (s.densityCorrection) { const od = s.densityCorrection.bind(s); s.densityCorrection = () => { const X0 = Float64Array.from(s.x.subarray(0, 3 * s.count)); const fb = lib.front(s); const st = od(); st.dFront = lib.front(s) - fb;
      let mv = 0; for (let p = 0; p < s.count; p++) mv = Math.max(mv, Math.hypot(s.x[3 * p] - X0[3 * p], s.x[3 * p + 1] - X0[3 * p + 1], s.x[3 * p + 2] - X0[3 * p + 2])); st.maxMoveStage = mv / h; return st; }; }
    const pePack = (sim) => { const c = sim.markCells(); let peA = 0, peU = 0;
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { let ncol = 0; for (let k = 0; k < nz; k++) { const q = c[i + nx * (j + ny * k)]; ncol += q; peA += q * (k + 0.5); } for (let m = 0; m < ncol; m++) peU += Math.floor(m / 8) + 0.5; }
      return (peA - peU) * sim.mp * sim.g * h; };
    const pk0 = pePack(s);
    const prevOn = s.onSubstep; s.onSubstep = (sim, rec) => { prevOn && prevOn(sim, rec);
      const c = sim.markCells(); let peA = 0, peU = 0; // PE_pack per section Z: PE(actual layer counts) - PE(uniform 8 per cell, same particles per column)
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { let ncol = 0; for (let k = 0; k < nz; k++) { const q = c[i + nx * (j + ny * k)]; ncol += q; peA += q * (k + 0.5); }
        for (let m = 0; m < ncol; m++) peU += Math.floor(m / 8) + 0.5; }
      const sc = sim.mp * sim.g * h; f3.push({ step: rec.step, t: rec.t, dKE: rec.densKE, dPE: rec.densPE, PEpack: (peA - peU) * sc, PEpack0: pk0, dens: rec.dens }); }; };
  const dFrontFrames = [0]; let dfAcc = 0, dfSeen = 0;
  const onFrame = (s, fr) => { for (; dfSeen < f3.length; dfSeen++) dfAcc += (f3[dfSeen].dens && f3[dfSeen].dens.dFront) || 0; dFrontFrames.push(dfAcc); const c = s.cellCount || s.markCells(), { nx, ny } = s; const layers = []; let tot = 0; // (b) column region i < A
    for (let k = 0; k < 2 * A + 2; k++) { let q = 0; for (let j = 0; j < ny; j++) for (let i = 0; i < A; i++) q += c[i + nx * (j + ny * k)]; tot += q; layers.push(q / (A * ny)); }
    const bottom = []; for (let j = 0; j < ny; j++) for (let i = 0; i < A; i++) bottom.push(c[i + nx * j]);
    layerSeries.push({ frame: fr, t: s.t, columnTotal: tot, layers, bottom }); };
  const R = lib.runT3(A, { instrument: (s) => { s._wrapAfter = true; instrument3(s); }, onFrame }); write(`T3a${A}_log.csv`, lib.csv(R.s.log)); write(`T3a${A}_T4_frames.json`, R.frames);
  { // Ritter (Z 2026-10-14g/h): short window W = ceil(20h/(U_R dt)), graded <= 1 + q, q = h/(W dt U_R); long W_L = ceil(100h/(U_R dt)), graded <= 1.0
    const F = R.frames, c = R.h / (R.UR * R.s.frame), W = Math.ceil(20 * c), WL = Math.ceil(100 * c), q = c / W, frozen = { 16: [3, 11, 1.0337317], 8: [5, 21, 1.0404781] }[A];
    const peak = (w) => { let b = -Infinity, at = -1; for (let k = w; k < F.length; k++) { const v = (F[k].xFront - F[k - w].xFront) / (F[k].t - F[k - w].t) / R.UR; if (v > b) { b = v; at = k; } } return [b, at]; };
    if (W !== frozen[0] || WL !== frozen[1] || Math.abs(1 + q - frozen[2]) > 5e-8) throw new Error('window constants differ from Z 2026-10-14h');
    const [ps, as] = peak(W), [pl, al] = peak(WL);
    row(`a${A} Ritter short window W=${W} frames: peak speed / U_R`, `${ps.toFixed(7)} (frame ${as})`, `<= 1 + q = ${(1 + q).toFixed(7)} (q = ${q.toFixed(7)})`, ps <= 1 + q);
    row(`a${A} Ritter long window W_L=${WL} frames: peak speed / U_R`, `${pl.toFixed(7)} (frame ${al})`, '<= 1.0', pl <= 1.0);
    const ss = Math.max(...R.s.log.map((r) => r.frontSpeed)); info(`a${A} Ritter single-substep peak (info)`, `${(ss / R.UR).toFixed(4)} U_R`); }
  lib.gradeT3T4(R, `a${A}`);
  const L = R.s.log;
  if (A === 8 && part === 't3a8') { const pm = L.filter((r) => r.dKEpMass > 0), pt = L.filter((r) => r.dKEpTheta > 1e-8 * r.pd.ke0Theta);
    row('C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step', `${pm.length} of ${L.length} > 0` + (pm.length ? ` (steps ${pm.map((r) => r.step).join(',')}; max ${fmt(Math.max(...pm.map((r) => r.dKEpMass)))} J)` : ''), '<= 0 every step', pm.length === 0);
    row('a8 pressure-stage dKE, theta measure, every step', `${pt.length} of ${L.length} > 1e-8 KE_theta` + (pt.length ? ` (steps ${pt.map((r) => r.step).join(',')})` : `; max ${fmt(Math.max(...L.map((r) => r.dKEpTheta)))} J`), '<= 1e-8 x KE_theta,pre every step', pt.length === 0);
    write('a8_pressure_steps.json', L.map((r) => ({ step: r.step, t: r.t, mass: r.dKEpMass, solver: r.dKEpSolver, theta: r.dKEpTheta }))); }
  { // C3.fix3 rows (ASSERTS Z 2026-10-14b/c)
    const has = f3.length && f3[0].dens !== undefined && R.s.useDensFix !== undefined;
    if (!has) row(`C3.fix3 a=${A}: density-correction stage present`, 'no density correction in this code', 'present (fix 3)', false);
    else { const E0 = Math.abs(R.E0), pk0 = -f3[0].PEpack0; let cum = 0, worst = -Infinity, wAt = null; const ks = f3.map((x) => x.dKE), D = f3.map((x) => x.dens).filter(Boolean);
      // Z 2026-10-14d: PE_pack(t) = [PE_uniform - PE_actual](t) - [PE_uniform - PE_actual](0); f3[].PEpack = PE_actual - PE_uniform after the step
      for (const x of f3) { cum += x.dPE; x.PEpackV2 = -x.PEpack - pk0; x.cum = cum; if (cum - x.PEpackV2 > worst) { worst = cum - x.PEpackV2; wAt = x; } }
      const mvS = Math.max(...D.map((d) => d.maxMoveStage || 0)), mvC = Math.max(...D.map((d) => d.maxDx || 0));
      row(`C3.fix3 a=${A}: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row)`, `${mvC.toFixed(4)} (stage incl. push-out ${mvS.toFixed(4)}, info)`, '<= 0.1', mvC <= 0.1 + 1e-12);
      const mk = Math.max(...ks); row(`C3.fix3 a=${A}: stage dKE every step, one-sided (correction + trailing push-out)`, `max dKE ${fmt(mk)} J (min ${fmt(Math.min(...ks))} J; ${ks.filter((x) => x > 0).length} steps > 0)`, '<= 1e-12 J', mk <= 1e-12);
      info(`[PE_pack row RETIRED, Z 2026-10-14f; info only] a${A}: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0))`, `max (cum dPE - PE_pack) ${fmt(worst)} J at step ${wAt.step} (cum dPE ${fmt(wAt.cum)}, PE_pack ${fmt(wAt.PEpackV2)})`, `would have been ${worst <= 1e-6 * E0 ? 'PASS' : 'FAIL'} vs 1e-6|E0| = ${fmt(1e-6 * E0)} J`);
      const sk = Math.max(...D.map((d) => d.skipped)); row(`C3.fix3 a=${A}: skipped regions (no air) max per step`, `${sk} (with nonzero e: ${Math.max(...D.map((d) => d.skippedWithExcess))})`, '== 0', sk === 0);
      { const nm = Math.max(...D.map((d) => d.targetErrMax ?? Infinity)); row(`C3.fix3 a=${A}: target sum, max over steps and regions of |sum e - target_r| / n_r`, fmt(nm), '<= 1e-12 every step', nm <= 1e-12);
        info(`a${A} fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target`, `${fmt(D.reduce((a, d) => a + d.ebarT4, 0) / D.length)} / ${fmt(Math.min(...D.map((d) => d.ebarT4)))} / ${fmt(Math.max(...D.map((d) => d.ebarT4)))}; ${D.filter((d) => d.targetPerCell !== 0).length} of ${D.length}`);
        info(`a${A} fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max)`, `${fmt(D.reduce((a, d) => a + (d.regionShiftMax || 0), 0) / D.length)} / ${fmt(Math.max(...D.map((d) => d.regionShiftMax || 0)))}`); }
      { const W = Math.ceil(20 * R.h / (R.UR * R.s.frame)), F = R.frames; const win = [];
        for (let k = W; k < F.length && k < dFrontFrames.length; k++) { const tot = F[k].xFront - F[k - W].xFront, cor = dFrontFrames[k] - dFrontFrames[k - W]; win.push({ k, tot, cor, v: tot / (F[k].t - F[k - W].t), vNoCorr: (tot - cor) / (F[k].t - F[k - W].t) }); }
        const wr = win.reduce((b, x) => (x.v > b.v ? x : b), win[0]), mc = win.reduce((b, x) => (Math.abs(x.cor) > Math.abs(b.cor) ? x : b), win[0]);
        info(`a${A} front displacement caused by the correction alone in each Ritter window (W = ${W} frames)`, `max |dx_front,corr| ${fmt(mc.cor)} m = ${(mc.cor / R.h).toFixed(3)} h (window ending frame ${mc.k}); at the worst Ritter window (frame ${wr.k}): total ${fmt(wr.tot)} m, by correction ${fmt(wr.cor)} m (${(wr.cor / R.h).toFixed(3)} h), speed ${(wr.v / R.UR).toFixed(4)} U_R, speed minus correction ${(wr.vNoCorr / R.UR).toFixed(4)} U_R; run total by correction ${fmt(dFrontFrames.at(-1))} m`);
        write(`a${A}_front_corr_windows.json`, win); }
      const it = D.map((d) => d.iters), fr = D.filter((d) => d.moved).map((d) => d.capped / d.moved), bind = D.filter((d) => d.capped > 0).length;
      info(`a${A} fix3 PCG iterations per step (mean / max; steps solved)`, `${(it.reduce((a, b) => a + b, 0) / it.length).toFixed(1)} / ${Math.max(...it)}; ${it.filter((x) => x > 0).length} of ${D.length}`);
      info(`a${A} fix3 max |dx|/h per step (mean / max)`, `${(D.reduce((a, d) => a + d.maxDx, 0) / D.length).toFixed(4)} / ${Math.max(...D.map((d) => d.maxDx)).toFixed(4)}`);
      info(`a${A} fix3 fraction of moved particles hitting the cap (mean / max over steps)`, `${(fr.reduce((a, b) => a + b, 0) / (fr.length || 1)).toExponential(3)} / ${fr.length ? Math.max(...fr).toExponential(3) : 0}`);
      info(`a${A} fix3 fraction of steps where the cap binds`, `${bind} of ${D.length} = ${(bind / D.length).toFixed(3)}` + (bind ? `; steps ${D.map((d, i) => (d.capped ? f3[i].step : null)).filter((x) => x !== null).join(',')}` : '') + (bind / D.length > 0.5 ? ' -> FLAG: cap binds in > 50% of steps, review' : ''));
      const fa = D.map((d) => d.fracAboveDead), em = D.filter((d) => d.nE).map((d) => d.eMean);
      info(`a${A} fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max)`, `${fmt(fa.reduce((a, b) => a + b, 0) / fa.length)} / ${fmt(Math.max(...fa))}`);
      info(`a${A} fix3 mean e over corrected cells per step (mean / min / max; steps corrected)`, em.length ? `${fmt(em.reduce((a, b) => a + b, 0) / em.length)} / ${fmt(Math.min(...em))} / ${fmt(Math.max(...em))}; ${em.length} of ${D.length}` : 'none');
      const fe = D.map((d) => d.floorE).filter(Boolean);
      info(`a${A} fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n)`, fe.length ? `${fmt(fe.reduce((a, d) => a + d.mean, 0) / fe.length)} / ${fmt(Math.min(...fe.map((d) => d.min)))} / ${fmt(Math.max(...fe.map((d) => d.max)))}; ${(fe.reduce((a, d) => a + d.nAbove, 0) / fe.length).toFixed(1)} of ${(fe.reduce((a, d) => a + d.n, 0) / fe.length).toFixed(1)}` : 'none');
      info(`a${A} fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max)`, `sum dPE ${fmt(f3.reduce((s, x) => s + x.dPE, 0))} J, max ${fmt(Math.max(...f3.map((x) => x.dPE)))} J; sum dKE ${fmt(ks.reduce((a, b) => a + b, 0))} J; PE_pack ${fmt(f3.at(-1).PEpackV2)} J (max ${fmt(Math.max(...f3.map((x) => x.PEpackV2)))})`);
      write(`a${A}_fix3_steps.json`, f3); }
    const fix1Worst = { 16: 0.0694, 8: 0.0857 }[A], mmc = JSON.parse(fs.readFileSync(path.join(outDir, `a${A}_mm_compare.json`), 'utf8')).filter((r) => r.Z >= 1.67), wm = Math.max(...mmc.map((r) => Math.abs(r.rel)));
    row(`C3.fix3 a=${A}: T3.mm worst graded row no worse than fix 1 (${(100 * fix1Worst).toFixed(2)}%)`, (100 * wm).toFixed(2) + '%', `<= ${(100 * fix1Worst).toFixed(2)}%`, wm <= fix1Worst + 5e-5);
    const p1 = path.join(__dirname, `../results/step7_fix1/a${A}_mm_compare.json`);
    if (A === 8 && fs.existsSync(p1)) { const q = JSON.parse(fs.readFileSync(p1, 'utf8')), now = JSON.parse(fs.readFileSync(path.join(outDir, 'a8_mm_compare.json'), 'utf8'));
      info('a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now)', now.map((r, i) => `Z=${r.Z}: ${r.T_sim.toFixed(3)} / ${q[i].T_sim.toFixed(3)} / ${(r.T_sim - q[i].T_sim >= 0 ? '+' : '') + (r.T_sim - q[i].T_sim).toFixed(3)}; ${(100 * r.rel).toFixed(2)}%`).join(' | ')); }
  }
  {
    const sa = cross.reduce((s, x) => s + Math.abs(x.netUpParticles - x.gridFluxParticles), 0) / cross.length, nU = cross.reduce((s, x) => s + x.netUpParticles, 0), gU = cross.reduce((s, x) => s + x.gridFluxParticles, 0);
    const nUc = cross.reduce((s, x) => s + x.netUpCol, 0), gUc = cross.reduce((s, x) => s + x.gridFluxCol, 0);
    info(`a${A} (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles`, `run total ${nU} vs ${gU.toFixed(1)}; column region (x<a) ${nUc} vs ${gUc.toFixed(1)}; mean |per-step difference| ${sa.toFixed(2)}`);
    write(`a${A}_fix2_clamp_cross.json`, { fix2, clampE, cross }); }
  if (A === 16) {
    const third = Math.floor(wallSeries.length / 3), seg = [[0, third], [third, 2 * third], [2 * third, wallSeries.length]];
    for (const k of ['floor', 'back', 'side']) info(`a16 (Physics) APIC field at nearest wall, ${k}: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third`,
      seg.map(([a, b]) => { const w = wallSeries.slice(a, b).map((x) => x[k]); const n = w.reduce((s, x) => s + x.n, 0); return `[${(w.reduce((s, x) => s + x.meanUn * x.n, 0) / (n || 1)).toExponential(2)} / ${Math.max(...w.map((x) => x.maxInto)).toExponential(2)} / ${(w.reduce((s, x) => s + x.nInto, 0) / w.length).toFixed(0)} of ${(n / w.length).toFixed(0)}]`; }).join(' '));
    const pick = [0, 5, 10, 15, 20, 25, layerSeries.length - 1].filter((i) => i < layerSeries.length);
    info('a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames ' + pick.map((i) => layerSeries[i].frame).join(','), pick.map((i) => `f${layerSeries[i].frame}: [${layerSeries[i].layers.slice(0, 6).map((x) => x.toFixed(2)).join(' ')}] total ${layerSeries[i].columnTotal}`).join('; '));
    write('a16_wall_apic.json', wallSeries); write('a16_column_layers.json', layerSeries);
    const prev = path.join(__dirname, '../results/step7_fix1/a16_mm_compare.json');
    if (fs.existsSync(prev)) { const p1 = JSON.parse(fs.readFileSync(prev, 'utf8')), now = JSON.parse(fs.readFileSync(path.join(outDir, 'a16_mm_compare.json'), 'utf8'));
      info('a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now)', now.map((r, i) => `Z=${r.Z}: ${r.T_sim.toFixed(3)} / ${p1[i].T_sim.toFixed(3)} / ${(r.T_sim - p1[i].T_sim >= 0 ? '+' : '') + (r.T_sim - p1[i].T_sim).toFixed(3)}; ${(100 * r.rel).toFixed(2)}%`).join(' | ')); } }
  { const pick = [1, 5, 10, 15, 20, 25, layerSeries.length].filter((f, i, a) => f <= layerSeries.length && a.indexOf(f) === i).map((f) => layerSeries[f - 1]);
    info(`a${A} column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells`, pick.map((L) => { const b = L.bottom, hst = {}; b.forEach((v) => (hst[v] = (hst[v] || 0) + 1));
      return `f${L.frame}: ${(b.reduce((x, y) => x + y, 0) / b.length).toFixed(2)} / ${Math.min(...b)} / ${Math.max(...b)} / ${Object.keys(hst).map(Number).sort((x, y) => x - y).map((k) => k + ':' + hst[k]).join(' ')}`; }).join('; '));
    if (A === 8) write('a8_column_layers.json', layerSeries); }
  write(`rows_${part}.json`, rows);
}
if (part === 'stillproof') { // Z 2026-10-14g: fix 3 stage moves nothing and dPE exactly 0 in every Gate 1 still-pool case (T1, T1b)
  const dir = path.join(__dirname, '../results', process.env.GATE_DIR || 'step19_smooth_theta/phaseB2_colvol/gate1');
  for (const p of ['T1', 'T1b', 'T2', 'modes', 'D']) { const f = path.join(dir, `densfix_proof_${p}.json`); if (!fs.existsSync(f)) { if (p === 'T1' || p === 'T1b') row(`still-water proof ${p}: proof file present`, 'missing', 'present', false); continue; }
    const d = JSON.parse(fs.readFileSync(f, 'utf8')), still = p === 'T1' || p === 'T1b', ok = d.moved === 0 && d.maxMove === 0 && d.maxAbsDPE === 0 && d.nonzeroDPE === 0;
    const m = `${d.calls} stage calls, ${d.solves} solves; particles moved ${d.moved}, max |dx| ${d.maxMove}, max |dPE| ${d.maxAbsDPE} J (${d.nonzeroDPE} nonzero); max cells above dead-band ${d.nAboveDeadMax}; max |target/cell| ${d.maxAbsTargetPerCell}; per grid ` + Object.entries(d.bySetup).map(([k, b]) => `${k}: max|ebar_T4| ${fmt(b.maxAbsEbarT4)}`).join(', ');
    if (still) for (const [k, b] of Object.entries(d.bySetup)) info(`still-water ${p} grid ${k}: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE|`, `${b.maxAbsEbarT4} / ${b.moved} / ${b.maxAbsDPE} J`);
    if (still) row(`still-water proof Gate 1 ${p}: fix-3 stage dx and dPE exactly 0 every step`, m, 'moved 0, |dx| 0, |dPE| 0', ok); else info(`fix-3 stage in Gate 1 ${p} (not a still pool)`, m); }
  write('rows_stillproof.json', rows);
}
if (part === 'summary') {
  const md5 = (f) => require('crypto').createHash('md5').update(fs.readFileSync(path.join(__dirname, '../spec', f))).digest('hex');
  const all = []; for (const p of ['tilted', 'separation', 't3a16', 't3a8', 'fix2check', 'sign', 'seedT3', 'stillproof']) { const f = path.join(outDir, `rows_${p}.json`); if (fs.existsSync(f)) all.push(...JSON.parse(fs.readFileSync(f, 'utf8'))); }
  { // Z 2026-10-14i convergence row: at Z = 2.78 and 3.22, |err(a=16)| < |err(a=8)|; if PASS the a=8 T3.mm rows are INFO, else they stay graded
    const ld = (A) => { const f = path.join(outDir, `a${A}_mm_compare.json`); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
    const m16 = ld(16), m8 = ld(8);
    if (m16 && m8) { const pick = (m, Z) => Math.abs(m.find((r) => Math.abs(r.Z - Z) < 1e-9).rel); const res = [2.78, 3.22].map((Z) => ({ Z, e16: pick(m16, Z), e8: pick(m8, Z) }));
      const pass = res.every((r) => r.e16 < r.e8);
      all.push({ part: 'convergence', id: 'T3.mm convergence (Z 2026-10-14i): |err a=16| < |err a=8| at Z=2.78 and Z=3.22', measured: res.map((r) => `Z=${r.Z}: ${(100 * r.e16).toFixed(2)}% vs ${(100 * r.e8).toFixed(2)}% (ratio a16/a8 ${(r.e16 / r.e8).toFixed(4)})`).join('; '), threshold: 'ratio < 1 at both', pass, note: pass ? 'a=8 T3.mm rows -> INFO' : 'a=8 T3.mm rows stay graded' });
      if (pass) for (const r of all) if (r.part === 't3a8' && /^a8 T3\.mm Z=/.test(r.id) && r.pass !== null) { r.note = `INFO per Z 2026-10-14i (convergence PASS); graded value would be ${r.pass ? 'PASS' : 'FAIL'}`; r.pass = null; } } }
  let md = `# ${arg('--title')}\n\n- Code commit the runs executed at: ${process.env.CODE_COMMIT} (clean tree)\n- spec/ASSERTS.md md5 ${md5('ASSERTS.md')}; PHYSICS_SPEC.md md5 ${md5('PHYSICS_SPEC.md')}\n- PE zero: floor z=0; substep cap 16\n\n| # | Part | Check | Measured | Threshold | Result |\n|---|---|---|---|---|---|\n`;
  all.forEach((r, i) => { md += `| ${i + 1} | ${r.part} | ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass === null ? 'INFO' : r.pass ? 'PASS' : 'FAIL'}${r.note ? ' (' + r.note + ')' : ''} |\n`; });
  md += `\nTotal graded: ${all.filter((r) => r.pass === true).length} PASS, ${all.filter((r) => r.pass === false).length} FAIL\n`;
  write('results.md', md); write('results.json', all);
}
if (part === 'seedT3') { // C3.seed for the T3 setups (jitter 0.1 s)
  for (const A of [16, 8]) { const a = 2.25 * 0.0254, h = a / A, s = new Sim({ nx: 16 * A, ny: A, nz: Math.round(2.5 * A), h, seed: 1952 }); s.seedBlock(0, A, 0, A, 0, 2 * A);
    let dmin = Infinity; for (let p = 0; p < s.count; p++) for (let b = 0; b < 3; b++) dmin = Math.min(dmin, s.x[3 * p + b], s.L[b] - s.x[3 * p + b]);
    row(`C3.seed T3 a=${A}: min distance of any seeded particle to any wall at t=0`, `${dmin.toExponential(4)} m`, `>= clearance ${s.pr.toExponential(4)} m`, dmin >= s.pr); }
  write('rows_seedT3.json', rows);
}

if (part === 'sign') { // C3.fix3.sign v6 (Z 2026-10-14e): graded on the P2G-splat nbar of the centre cell (the same nbar the source uses)
  const run = (sg) => { const h = 0.05, s = new Sim({ nx: 5, ny: 5, nz: 6, h, seed: 5, densSign: sg, jitter: 0, densAlpha: ALPHA ?? 0.1 });
    for (let k = 0; k < 5; k++) for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) { if (i === 2 && j === 2 && k === 2) continue; s.seedBlock(i, i + 1, j, j + 1, k, k + 1); }
    for (let c = 0; c < 16; c++) { const ox = (c & 1) + 0.5, oy = ((c >> 1) & 1) + 0.5, oz = (c >> 2) + 0.5; s.addParticle((2 + ox / 2) * h, (2 + oy / 2) * h, (2 + oz / 4) * h); }
    const cid = 2 + 5 * (2 + 5 * 2), nb0 = s.splatCounts()[cid], n0 = s.markCells()[cid], X0 = Float64Array.from(s.x.subarray(0, 3 * s.count));
    // isolate the correction: nbar right before and right after the correction stage (the rest of the step moves particles too)
    let nbPre = null, nbPost = null; const od = s.densityCorrection.bind(s); s.densityCorrection = () => { nbPre = s.splatCounts()[cid]; const r = od(); nbPost = s.splatCounts()[cid]; return r; };
    s.substep(Math.min(s.frame, s.cflDt()), 1); const dx = s._lastDx, nb1 = s.splatCounts()[cid], n1 = s.markCells()[cid]; let ok = 0, tot = 0, minR = Infinity;
    for (let p = 0; p < s.count; p++) { if ([0, 1, 2].some((b) => Math.floor(X0[3 * p + b] / h) !== 2)) continue; tot++; let r = 0; if (dx) for (let b = 0; b < 3; b++) r += dx[3 * p + b] * (X0[3 * p + b] - 2.5 * h); minR = Math.min(minR, r); if (r > 0) ok++; }
    return { nb0, nb1, nbPre, nbPost, n0, n1, ok, tot, minR, dens: s.lastDens }; };
  for (const [sg, lab] of [[1, 'production sign'], [-1, 'sign FLIPPED (must fail)']]) { const r = run(sg), pass = r.ok === r.tot && r.nb1 < r.nb0;
    row(`C3.fix3.sign v6 [${lab}]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step`, `${r.ok}/${r.tot} outward (min dx.r ${fmt(r.minR)} m^2); splat nbar ${r.nb0.toFixed(6)} -> ${r.nb1.toFixed(6)} (cell count ${r.n0} -> ${r.n1}; above dead-band ${r.dens.nAboveDead}; PCG ${r.dens.iters}; target err ${fmt(r.dens.targetErrMax)})`, 'all outward AND splat nbar drops', sg === 1 ? pass : !pass, `test verdict ${pass ? 'PASS' : 'FAIL'}` + (sg === 1 ? '' : '; row passes when the flipped sign fails'));
    info(`C3.fix3.sign v6 [${lab}]: splat nbar across the correction stage alone`, `${r.nbPre.toFixed(6)} -> ${r.nbPost.toFixed(6)} (${r.nbPost < r.nbPre ? 'drops' : 'rises'}); correction max |dx|/h ${r.dens.maxDx.toFixed(5)}`); }
  write('rows_sign.json', rows);
}
