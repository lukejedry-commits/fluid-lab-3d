// Stability check (limits pre-set by Validation): gravity 2g + continuous stir for 2 s
// (480 frames), stir input 10 m/s so the 4 m/s cap is always active; the stir point
// circles through the water. Pass: all finite, all 3500 inside, max|u| <= 8 m/s, substeps <= 8.
const { createWorld, frame, GRID_W, GRID_H, CELL } = require('./fluid2d.js');
const w = createWorld(), n0 = w.x.length; w.gravity = 2 * 9.8;
let maxU = 0, maxSub = 0, capHits = 0, finite = true, inside = true;
for (let f = 0; f < 480; f++) {
  const a = (f / 480) * 4 * Math.PI;                       // two laps in 2 s
  w.stir = { x: 0.3 + 0.15 * Math.cos(a), y: 0.25 + 0.1 * Math.sin(a), vx: -10 * Math.sin(a), vy: 10 * Math.cos(a), active: true };
  frame(w);
  maxSub = Math.max(maxSub, w.substeps); capHits += w.hitSweepCap ? 1 : 0;
  for (let p = 0; p < w.x.length; p++) {
    if (![w.x[p], w.y[p], w.vx[p], w.vy[p]].every(Number.isFinite)) finite = false;
    if (!(w.x[p] >= CELL && w.x[p] <= (GRID_W - 1) * CELL && w.y[p] >= CELL && w.y[p] <= (GRID_H - 1) * CELL)) inside = false;
    maxU = Math.max(maxU, Math.hypot(w.vx[p], w.vy[p]));
  }
}
const rows = [['all values finite', finite, finite], [`particles inside tank (${w.x.length} of ${n0})`, inside && w.x.length === n0, inside],
  [`max|u| ${maxU.toFixed(3)} m/s (limit 8)`, maxU <= 8], [`max substeps ${maxSub} (limit 8)`, maxSub <= 8]];
for (const [m, ok] of rows) console.log(`${ok ? 'PASS' : 'FAIL'}  ${m}`);
console.log(`INFO  frames with hitSweepCap: ${capHits} of 480`);
