'use strict';
/** Step 18 add-on (INFO ONLY): which step-1 stage moves particles across cell lines (changes cell counts -> theta) in C3.separation jitter 0.5.
 *  Wraps advect / wallStrip / separate / densityCorrection; counts particles changing cell and top-layer (k=31) cell-count changes. --densoff = fix 3 off control. */
const fs = require('fs'), path = require('path');
const { Sim } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const outDir = path.join(__dirname, '../results', arg('--out')), tag = arg('--tag');
const N = 32, H = 0.5, h = H / N, nz = 40;
const s = new Sim({ nx: N, ny: N, nz, h, seed: 3232, maxSub: 16, jitter: +arg('--jitter', '0.5'), densFix: !process.argv.includes('--densoff') }); s.seedBlock(0, N, 0, N, 0, N);
const cellOf = () => { const c = new Int32Array(s.count); for (let p = 0; p < s.count; p++) c[p] = Math.floor(s.x[3 * p] / h) + N * (Math.floor(s.x[3 * p + 1] / h) + N * Math.floor(s.x[3 * p + 2] / h)); return c; };
const R = [];
for (const name of ['advect', 'wallStrip', 'separate', 'densityCorrection']) { const o = s[name].bind(s); s[name] = (...a) => { const c0 = cellOf(), x0 = Float64Array.from(s.x.subarray(0, 3 * s.count)); const r = o(...a); const c1 = cellOf();
  let moved = 0, crossed = 0, crossedTop = 0, maxDx = 0; for (let p = 0; p < s.count; p++) { let d = 0; for (let b = 0; b < 3; b++) d = Math.max(d, Math.abs(s.x[3 * p + b] - x0[3 * p + b])); if (d > 0) moved++; maxDx = Math.max(maxDx, d);
    if (c0[p] !== c1[p]) { crossed++; if (c0[p] >= 31 * N * N || c1[p] >= 31 * N * N) crossedTop++; } }
  R.push({ step: s.step + 1, stage: name, moved, maxDxOverH: maxDx / h, crossedCell: crossed, crossedTouchingTopLayer: crossedTop }); return r; }; }
for (let n = 0; n < 2; n++) s.substep(1 / 60, 1);
const f = path.join(outDir, `${tag}_step1_moves.json`); if (fs.existsSync(f)) throw new Error('refusing to overwrite'); fs.writeFileSync(f, JSON.stringify(R, null, 1)); console.log(JSON.stringify(R));
