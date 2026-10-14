'use strict';
/** Step 13 A: proof of the sub-cell front estimator on synthetic fronts at a known exact speed (Z 2026-10-14f (a)).
 *  Geometry = T3 (a = 2.25 in, h = a/A, nx = 16A, ny = A), frame 1/60 s, W = ceil(20h/(U_R frame)).
 *  Synthetic bottom-layer fluid filling 0 <= x < x_f(t) = x0 + v t at 8 particles per cell (uniform), two constructions:
 *   S1 "seeded lattice": the standard 2x2x2 sub-cell lattice (spacing h/2) of every sub-cell whose centre lies below x_f
 *      (what seeded/translated particles look like);
 *   S2 "finest integer fill": full cells below x_f, plus round(8 * frac) particles in the front cell (best any count can do).
 *  Graded: every windowed speed sample [x(t) - x(t-W)] / (W frame) within 1e-3 relative of v, for v = 0.5 and 1.0 U_R, a = 8, 16.
 *  node test/run_step13_proof.js --out step13_subcell_proof */
const fs = require('fs'), path = require('path');
const { frontSub } = require('./front_subcell');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const outDir = path.join(__dirname, '../results', arg('--out')); fs.mkdirSync(outDir, { recursive: true });
const write = (n, d) => { const f = path.join(outDir, n); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 1)); };
const rows = [], fmt = (x) => x.toExponential(3);
const row = (id, m, t, p) => { rows.push({ id, measured: m, threshold: t, pass: p }); console.log((p ? 'PASS ' : 'FAIL ') + id + ' : ' + m); };
const g = 9.81, a = 2.25 * 0.0254, UR = 2 * Math.sqrt(g * 2 * a), frame = 1 / 60;
let allPass = true; const detail = [];
for (const A of [16, 8]) { const h = a / A, nx = 16 * A, ny = A, W = Math.ceil(20 * h / (UR * frame));
  for (const vf of [0.5, 1.0]) { const v = vf * UR, x0 = a, nF = Math.floor((nx * h - x0 - h) / (v * frame));
    for (const S of ['S1 seeded lattice', 'S2 finest integer fill']) {
      const xs = []; for (let f = 0; f <= nF; f++) { const xf = x0 + v * f * frame, c = new Int32Array(nx * ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const lo = i * h; let n;
          if (S.startsWith('S1')) { n = 0; for (const o of [0.25, 0.75]) if (lo + o * h < xf) n += 4; }
          else n = xf >= lo + h ? 8 : xf <= lo ? 0 : Math.round(8 * (xf - lo) / h);
          c[i + nx * j] = n; }
        xs.push(frontSub(c, nx, ny, h)); }
      let worst = 0, at = -1; const sp = [];
      for (let k = W; k < xs.length; k++) { const s = (xs[k] - xs[k - W]) / (W * frame), e = Math.abs(s - v) / v; sp.push({ k, s, e }); if (e > worst) { worst = e; at = k; } }
      const end = (xs.at(-1) - xs[0]) / ((xs.length - 1) * frame), eEnd = Math.abs(end - v) / v;
      const pass = worst <= 1e-3; allPass = allPass && pass; detail.push({ A, vf, S, W, frames: nF, worst, at, endToEndRel: eEnd, samples: sp });
      row(`proof a=${A} v=${vf} U_R ${S}: max |speed - v|/v over ${sp.length} W=${W} windows`, `${fmt(worst)} (frame ${at}); end-to-end over ${nF} frames ${fmt(eEnd)}; window displacement ${(v * W * frame / h).toFixed(2)} h, count resolution h/8 -> bound ${fmt((h / 8) / (v * W * frame))}`, '<= 1e-3', pass); } } }
console.log(allPass ? 'PROOF PASSES' : 'PROOF FAILS: sub-cell estimator NOT used for grading');
write('proof_rows.json', rows); write('proof_detail.json', detail);
let md = `# Step 13 A: sub-cell front estimator proof (Z 2026-10-14f (a))\n\n- Code: test/front_subcell.js, test/run_step13_proof.js\n- Verdict: **${allPass ? 'PASS' : 'FAIL'}**${allPass ? '' : ' -> re-grade NOT performed (Z: proof must pass before the estimator grades anything)'}\n\n| Check | Measured | Threshold | Result |\n|---|---|---|---|\n`;
rows.forEach((r) => (md += `| ${r.id} | ${r.measured} | ${r.threshold} | ${r.pass ? 'PASS' : 'FAIL'} |\n`)); write('results.md', md);
