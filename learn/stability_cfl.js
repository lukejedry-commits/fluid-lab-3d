// Stability + CFL check (room ruling 4:27 PM): 2g + stir at the 4 m/s cap, 480 frames.
// To see max|u|*dt_sub/h after EVERY substep, this mirrors frame() using the exported
// step() with the same substep formula, and proves the mirror is bit-identical to frame().
const crypto = require('crypto');
const { createWorld, step, frame, GRID_W, GRID_H, CELL } = require('./fluid2d.js');
const STIR_MAX = 4, MAX_SUBSTEPS = 8, FRAME_DT = 1 / 240;
const speed = (w) => { let m = 0; for (let p = 0; p < w.x.length; p++) m = Math.max(m, Math.hypot(w.vx[p], w.vy[p])); return m; };
function mirrorFrame(w, onSub) {               // same arithmetic as frame() in fluid2d.js
  const fastest = speed(w), kick = Math.abs(w.gravity) * FRAME_DT + (w.stir.active ? STIR_MAX : 0);
  if (w.stir.active) w.stirNow = true;
  const n = Math.min(MAX_SUBSTEPS, Math.max(1, Math.ceil(((fastest + kick) * FRAME_DT) / CELL)));
  w.hitSweepCap = false; w.substeps = n;
  for (let i = 0; i < n; i++) { step(w, FRAME_DT / n); onSub(i, n); }
}
const setStir = (w, f) => { const a = (f / 480) * 4 * Math.PI;
  w.stir = { x: 0.3 + 0.15 * Math.cos(a), y: 0.25 + 0.1 * Math.sin(a), vx: -10 * Math.sin(a), vy: 10 * Math.cos(a), active: true }; };
const hash = (w) => crypto.createHash('sha256').update(Buffer.from(Float64Array.from([...w.x, ...w.y, ...w.vx, ...w.vy]).buffer)).digest('hex');

const A = createWorld(), B = createWorld(), n0 = A.x.length; A.gravity = B.gravity = 2 * 9.8;
let maxU = 0, maxSub = 0, capHits = 0, finite = true, inside = true, cflAll = 0, cflLast = 0, at = '';
for (let f = 0; f < 480; f++) {
  setStir(A, f); setStir(B, f);
  frame(B);
  mirrorFrame(A, (i, n) => {
    const u = speed(A), c = u * (FRAME_DT / n) / CELL;
    if (c > cflAll) { cflAll = c; at = `frame ${f} substep ${i + 1}/${n}`; }
    if (i === n - 1) cflLast = Math.max(cflLast, c);
    maxU = Math.max(maxU, u);
  });
  maxSub = Math.max(maxSub, A.substeps); capHits += A.hitSweepCap ? 1 : 0;
  for (let p = 0; p < A.x.length; p++) {
    if (![A.x[p], A.y[p], A.vx[p], A.vy[p]].every(Number.isFinite)) finite = false;
    if (!(A.x[p] >= CELL && A.x[p] <= (GRID_W - 1) * CELL && A.y[p] >= CELL && A.y[p] <= (GRID_H - 1) * CELL)) inside = false;
  }
}
const same = hash(A) === hash(B), lim = Math.SQRT2 * (5.8 + 4);
const out = [
  `${same ? 'PASS' : 'FAIL'}  mirror == frame() bit-identical after 480 frames (x,y,vx,vy sha256 ${hash(B).slice(0, 16)}...)`,
  `${finite ? 'PASS' : 'FAIL'}  all values finite`,
  `${inside && A.x.length === n0 ? 'PASS' : 'FAIL'}  particles inside tank: ${A.x.length} of ${n0}`,
  `${maxU <= lim ? 'PASS' : 'FAIL'}  max|u| over every substep = ${maxU.toFixed(3)} m/s (limit ${lim.toFixed(2)})`,
  `${cflAll <= 1 ? 'PASS' : 'FAIL'}  max |u|*dt_sub/h after every substep = ${cflAll.toFixed(4)} (limit 1; worst at ${at})`,
  `${cflLast <= 1 ? 'PASS' : 'FAIL'}  max |u|*dt_sub/h after last substep of each frame = ${cflLast.toFixed(4)} (limit 1)`,
  `${maxSub <= 8 ? 'PASS' : 'FAIL'}  max substeps = ${maxSub} (limit 8)`,
  `INFO  frames with hitSweepCap: ${capHits} of 480`];
console.log(out.join('\n'));
