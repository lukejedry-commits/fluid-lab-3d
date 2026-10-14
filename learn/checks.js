// Exact checks with exact answers for learn/fluid2d.js.
// Run: node checks.js [path to fluid2d.js]
const path = process.argv[2] || '/workspace/fluid-lab-3d/learn/fluid2d.js';
const { createWorld, step, GRID_W, GRID_H, CELL } = require(path);
const g = 9.8, dt = 1 / 120;
let fails = 0;
const check = (name, ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${msg}`); if (!ok) fails++; };
const empty = () => { const w = createWorld(); w.x = []; w.y = []; w.vx = []; w.vy = []; return w; };

// 1. One drop in free fall. The exact answer for this kind of time step
//    after n steps is y = y0 - g*dt^2*n(n+1)/2; it lands when y reaches the floor.
{
  const w = empty(); const y0 = 0.8, x0 = 0.5;
  w.x.push(x0); w.y.push(y0); w.vx.push(0); w.vy.push(0);
  const floor = CELL * 1.01; let n = 0, worst = 0;
  while (w.y[0] > floor && n < 10000) {
    step(w, dt); n++;
    const exact = y0 - g * dt * dt * n * (n + 1) / 2;
    if (exact > floor) worst = Math.max(worst, Math.abs(w.y[0] - exact));
  }
  const tLand = n * dt, tTheory = Math.sqrt(2 * (y0 - floor) / g);
  check('free fall path', worst < 1e-5, `max |y - exact| = ${worst.toExponential(2)} (limit 1e-5)`);
  check('free fall landing', Math.abs(tLand - tTheory) <= dt,
    `landed at ${tLand.toFixed(4)} s, sqrt(2h/g) = ${tTheory.toFixed(4)} s (limit one step, ${dt.toFixed(4)} s)`);
  // 5. After landing it rests inside the bottom cell: floor <= y <= 2*CELL for 1 s (inclusive).
  let lo = Infinity, hi = -Infinity;
  for (let k = 0; k < 120; k++) { step(w, dt); lo = Math.min(lo, w.y[0]); hi = Math.max(hi, w.y[0]); }
  check('drop rest height', lo >= floor && hi <= 2 * CELL,
    `y in [${lo.toFixed(7)}, ${hi.toFixed(7)}] (limit [${floor.toFixed(7)}, ${(2*CELL).toFixed(7)}])`);
}

// 2. A still pool stays still. Limit: speeds under 1% of the shallow-wave speed sqrt(gH).
{
  const w = empty(); const depthCells = 20;
  for (let i = 1; i < GRID_W - 1; i++) for (let j = 1; j < 1 + depthCells; j++)
    for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) {
      w.x.push((i + 0.25 + 0.5 * a) * CELL); w.y.push((j + 0.25 + 0.5 * b) * CELL); w.vx.push(0); w.vy.push(0);
    }
  const limit = 0.01 * Math.sqrt(g * depthCells * CELL); let peak = 0;
  for (let s = 0; s < 240; s++) { step(w, dt); for (let p = 0; p < w.x.length; p++) peak = Math.max(peak, Math.hypot(w.vx[p], w.vy[p])); }
  check('still pool', peak < limit, `peak speed over 2 s = ${peak.toExponential(2)} m/s (limit ${limit.toExponential(2)})`);
}

// 3. The amount of water never changes: same particle count, all inside the tank.
{
  const w = createWorld(); const n0 = w.x.length; let ok = true;
  for (let s = 0; s < 400; s++) {
    step(w, dt);
    if (w.x.length !== n0) ok = false;
    for (let p = 0; p < w.x.length; p++)
      if (!(w.x[p] >= CELL && w.x[p] <= (GRID_W - 1) * CELL && w.y[p] >= CELL && w.y[p] <= (GRID_H - 1) * CELL)) ok = false;
  }
  check('water conserved', ok, `${n0} particles, all inside the tank for 400 steps`);
}
process.exit(fails ? 1 : 0);
