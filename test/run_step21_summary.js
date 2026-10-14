'use strict';
/** Step 21 graded/info rows from step21_preload hook files (graded suite on 286ed1b + runners 6e34be3).
 *  GRADED: (a) step-1 pair-separation move fraction <= 0.1% in C3.separation; (b) wall-clamp max displacement <= 1e-6 h every step, every run;
 *  (c) Gate 1 runs with 0 old-trigger fires (revert_b29c99e) bit-identical to 1e6089c (revert_b29c99e/gate1/base_1e6089c).
 *  INFO: pair-separation moved fraction per step (stage + fix-3 internal), wall-clamp max/count, new-trigger fires. */
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '../results/step21_trigger_0p0611'), G = path.join(R, 'graded'), out = [];
const row = (id, measured, threshold, pass) => out.push({ id, measured, threshold, pass }), info = (id, measured) => out.push({ id, measured, threshold: 'info', pass: null });
const fmt = (x) => x.toExponential(3), ld = (f) => JSON.parse(fs.readFileSync(f));
const files = [...['modes', 'D', 'T1', 'T1b', 'T2'].map((p) => ['gate1/' + p, path.join(G, 'gate1', `hook_${p}.json`)]), ...['tilted', 'separation', 't3a16', 't3a8', 'sign'].map((p) => [p, path.join(G, `hook_${p}.json`)])];
const base = path.join(R, 'revert_b29c99e/gate1/base_1e6089c'), revert = path.join(R, 'revert_b29c99e/gate1');
for (const [part, f] of files) { const H = ld(f);
  H.forEach((s, i) => { const tag = `${part} sim ${i} (${s.dims}, ${s.count} p, ${s.nSteps} steps)`, st = s.steps;
    const wmax = Math.max(0, ...st.map((r) => r.wallMax)), wn = st.reduce((a, r) => a + r.wallMoved, 0), fr = st.map((r) => (r.sepMovedStage + r.sepMovedDens) / r.n), fires = st.reduce((a, r) => a + r.fires, 0);
    row(`wall clamp max displacement / h, every step: ${tag}`, `${fmt(wmax)} (clamp moves total ${wn})`, '<= 1e-6', wmax <= 1e-6);
    info(`pair separation (0.0611 h): ${tag}: fires total ${fires}; moved fraction per step mean / max`, `${fmt(fr.reduce((a, b) => a + b, 0) / Math.max(1, fr.length))} / ${fmt(Math.max(0, ...fr))}`);
    if (part === 'separation' && i === 0) { const r1 = st[0]; row(`C3.separation step-1 pair-separation moved fraction (stage ${r1.sepMovedStage} + fix-3 push-out ${r1.sepMovedDens} of ${r1.n})`, `${(100 * (r1.sepMovedStage + r1.sepMovedDens) / r1.n).toFixed(4)}%`, '<= 0.1%', (r1.sepMovedStage + r1.sepMovedDens) / r1.n <= 1e-3); }
    if (part.startsWith('gate1/') && ['T1', 'T1b', 'T2'].includes(part.slice(6))) { const old = ld(path.join(revert, `hook_${part.slice(6)}.json`))[i], b = ld(path.join(base, `hook_${part.slice(6)}.json`))[i];
      const oldFires = old.steps.reduce((a, r) => a + r.fires, 0);
      if (oldFires === 0) row(`Gate 1 run with 0 old-trigger fires bit-identical to 1e6089c: ${tag}`, `chain ${s.chain.slice(0, 16)} vs ${b.chain.slice(0, 16)}`, 'identical every substep', s.chain === b.chain && s.steps.every((r, q) => r.h === b.steps[q].h));
      else info(`Gate 1 run with ${oldFires} old-trigger fires (graded on limits): ${tag}`, s.chain === b.chain ? 'identical to 1e6089c' : 'differs from 1e6089c (expected)'); } }); }
let md = '# Step 21 graded hook rows (trigger 0.0611 h; code 286ed1b, runners 6e34be3)\n\n| # | Check | Measured | Threshold | Result |\n|---|---|---|---|---|\n';
out.forEach((r, i) => (md += `| ${i + 1} | ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass === null ? 'INFO' : r.pass ? 'PASS' : 'FAIL'} |\n`));
md += `\nGraded: ${out.filter((r) => r.pass === true).length} PASS, ${out.filter((r) => r.pass === false).length} FAIL\n`;
const f = path.join(G, 'hook_rows.md'); if (fs.existsSync(f)) throw new Error('refusing to overwrite'); fs.writeFileSync(f, md); fs.writeFileSync(path.join(G, 'hook_rows.json'), JSON.stringify(out, null, 1)); console.log(md);
