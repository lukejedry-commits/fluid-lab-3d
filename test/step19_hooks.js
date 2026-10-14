'use strict';
/** Step 19 Phase B2 harness hooks (ASSERTS da859722 Z 2026-10-14m), instrumentation only:
 *  - GRADED energy-bookkeeping closure: every substep |sum of per-stage dE - (E_after - E_before)| / |E_before| <= 1e-12.
 *  - INFO: fraction of particles moved by push-out (stage wallStrip + separate, and the push-out inside fix 3) per step, per sim.
 *  - INFO: fraction of colvol surface cells on count-theta fallback, per frame, per sim. */
const { Sim } = require('../src/sim');
const BK = { steps: 0, worst: 0, worstStep: null }, PO = [], FB = [];
let poMoved = null;
for (const nm of ['wallStrip', 'separate']) { const o = Sim.prototype[nm]; Sim.prototype[nm] = function (...a) {
  if (!poMoved) return o.apply(this, a); const X0 = Float64Array.from(this.x.subarray(0, 3 * this.count)); const r = o.apply(this, a);
  for (let p = 0; p < this.count; p++) if (this.x[3 * p] !== X0[3 * p] || this.x[3 * p + 1] !== X0[3 * p + 1] || this.x[3 * p + 2] !== X0[3 * p + 2]) poMoved[p] = 1; return r; }; }
{ const o = Sim.prototype.substep; Sim.prototype.substep = function (...a) {
  const e = this.particleEnergy(), E0 = e.ke + e.pe; poMoved = new Uint8Array(this.count); const rec = o.apply(this, a);
  let n = 0; for (let p = 0; p < this.count; p++) n += poMoved[p]; poMoved = null;
  const key = `${this.nx}x${this.ny}x${this.nz}`; let P = PO.find((x) => x.key === key && x.sim === this); if (!P) PO.push((P = { key, sim: this, f: [] })); P.f.push(n / this.count);
  const sum = Object.values(rec.stage).reduce((x, y) => x + y, 0), err = Math.abs(sum - (rec.E - E0)) / Math.abs(E0); BK.steps++;
  if (err > BK.worst || BK.worstStep === null) { BK.worst = Math.max(BK.worst, err); BK.worstStep = `${key} step ${rec.step}`; } return rec; }; }
{ const o = Sim.prototype.advanceFrame; Sim.prototype.advanceFrame = function (...a) { const r = o.apply(this, a);
  const key = `${this.nx}x${this.ny}x${this.nz}`; let F = FB.find((x) => x.sim === this); if (!F) FB.push((F = { key, sim: this, f: [] }));
  const st = this.colvolStats; F.f.push(st && st.nSurf ? st.nFall / st.nSurf : 0); return r; }; }
const fmt = (x) => x.toExponential(3), stat = (a) => (a.length ? `${fmt(a.reduce((x, y) => x + y, 0) / a.length)} / ${fmt(Math.max(...a))}` : 'n/a');
let done = false;
function finalize(row, info, part) { if (done) return; done = true; if (!BK.steps) return;
  row(`[${part}] energy bookkeeping closure: max over ${BK.steps} substeps |sum stage dE - dE_total| / |E| (worst at ${BK.worstStep})`, fmt(BK.worst), '<= 1e-12', BK.worst <= 1e-12);
  for (const P of PO) info(`[${part}] push-out moved fraction per step, sim ${P.key} (${P.f.length} steps): mean / max`, stat(P.f));
  for (const F of FB) info(`[${part}] colvol surface cells on count-theta fallback per frame, sim ${F.key} (${F.f.length} frames): mean / max`, stat(F.f)); }
module.exports = { finalize, BK, PO, FB };
