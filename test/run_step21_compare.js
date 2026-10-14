'use strict';
/** Step 21: compare hook files (step21_preload) of two Gate 1 runs: per part, per sim, chained state hash and every per-substep hash.
 *  Also old-trigger fire counts per run (from run A). node test/run_step21_compare.js <dirA> <dirB> [parts] */
const fs = require('fs'), path = require('path');
const [A, B] = process.argv.slice(2, 4), parts = (process.argv[4] || 'modes,D,T1,T1b,T2').split(',');
const out = []; let allSame = true;
for (const p of parts) { const a = JSON.parse(fs.readFileSync(path.join(A, `hook_${p}.json`))), b = JSON.parse(fs.readFileSync(path.join(B, `hook_${p}.json`)));
  if (a.length !== b.length) { allSame = false; out.push({ part: p, error: `sim count ${a.length} vs ${b.length}` }); continue; }
  a.forEach((x, i) => { const y = b[i]; let firstDiff = -1; for (let s = 0; s < Math.max(x.steps.length, y.steps.length); s++) if (!x.steps[s] || !y.steps[s] || x.steps[s].h !== y.steps[s].h) { firstDiff = s + 1; break; }
    const same = x.chain === y.chain && firstDiff < 0 && x.nSteps === y.nSteps; allSame = allSame && same;
    const fires = x.steps.reduce((q, r) => q + r.fires, 0), fireSteps = x.steps.filter((r) => r.fires > 0).length;
    out.push({ part: p, sim: i, dims: x.dims, particles: x.count, substeps: x.nSteps, identical: same, firstDiffStep: firstDiff, chainA: x.chain.slice(0, 16), chainB: y.chain.slice(0, 16), fires, fireSteps, maxFiresPerStep: Math.max(0, ...x.steps.map((r) => r.fires)) }); }); }
console.log(JSON.stringify({ allIdentical: allSame, runs: out }, null, 1));
