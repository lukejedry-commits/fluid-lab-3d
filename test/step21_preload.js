'use strict';
/** Step 21 instrumentation preload (node -r ./test/step21_preload.js ...), no solver change. Per Sim instance (in creation order):
 *  - sha256 of the full particle state (x, v, C as raw float64 bytes) after every substep (16 hex chars each) and a chained hash;
 *  - per step: separate() pair pushes (fires, all calls incl. the push-out inside fix 3) and particles moved by separate(), split
 *    into the push-out stage and the fix-3 stage; wallStrip() max displacement / h and particles moved.
 *  Written at exit to $HOOK_OUT (refuses to overwrite). */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { Sim } = require(path.resolve(process.env.SIM_SRC || 'src/sim.js'));
const SIMS = []; let inDens = false;
const rec = (s) => { if (!s._h21) { s._h21 = { id: SIMS.length, dims: `${s.nx}x${s.ny}x${s.nz}`, count0: s.count, steps: [], chain: crypto.createHash('sha256') }; SIMS.push(s); } return s._h21; };
const cur = (s) => { const R = rec(s); if (!R.cur) R.cur = { fires: 0, sepMovedStage: 0, sepMovedDens: 0, wallMax: 0, wallMoved: 0 }; return R.cur; };
{ const o = Sim.prototype.separate; Sim.prototype.separate = function (...a) { const X0 = Float64Array.from(this.x.subarray(0, 3 * this.count)); const r = o.apply(this, a); const C = cur(this); C.fires += r;
  let m = 0; for (let p = 0; p < this.count; p++) if (this.x[3 * p] !== X0[3 * p] || this.x[3 * p + 1] !== X0[3 * p + 1] || this.x[3 * p + 2] !== X0[3 * p + 2]) m++;
  if (inDens) C.sepMovedDens += m; else C.sepMovedStage += m; return r; }; }
{ const o = Sim.prototype.wallStrip; Sim.prototype.wallStrip = function (...a) { const X0 = Float64Array.from(this.x.subarray(0, 3 * this.count)); const r = o.apply(this, a); const C = cur(this);
  for (let p = 0; p < this.count; p++) { const d = Math.max(Math.abs(this.x[3 * p] - X0[3 * p]), Math.abs(this.x[3 * p + 1] - X0[3 * p + 1]), Math.abs(this.x[3 * p + 2] - X0[3 * p + 2])); if (d > 0) C.wallMoved++; if (d / this.h > C.wallMax) C.wallMax = d / this.h; }
  return r; }; }
{ const o = Sim.prototype.densityCorrection; Sim.prototype.densityCorrection = function (...a) { inDens = true; try { return o.apply(this, a); } finally { inDens = false; } }; }
{ const o = Sim.prototype.substep; Sim.prototype.substep = function (...a) { const R = rec(this); const r = o.apply(this, a); const C = cur(this); R.cur = null;
  const H = crypto.createHash('sha256'); for (const arr of [this.x, this.v, this.C]) { const b = Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength); H.update(b); R.chain.update(b); }
  R.steps.push({ h: H.digest('hex').slice(0, 16), ...C, n: this.count }); return r; }; }
process.on('exit', () => { const f = process.env.HOOK_OUT; if (!f) return; if (fs.existsSync(f)) { console.error('refusing to overwrite ' + f); return; }
  fs.writeFileSync(f, JSON.stringify(SIMS.map((s) => { const R = s._h21; return { id: R.id, dims: R.dims, count: R.count0, nSteps: R.steps.length, chain: R.chain.digest('hex'), steps: R.steps }; }))); });
