// Run with: node learn/test_headless.js
const { createWorld, step } = require('./fluid2d.js');
const w = createWorld(), n0 = w.x.length;
for (let s = 0; s < 400; s++) {
  step(w);
  const bad = w.x.concat(w.y, w.vx, w.vy).some((a) => !Number.isFinite(a));
  if (bad || w.x.length !== n0) throw new Error(`failed at step ${s}`);
}
const maxSpeed = Math.max(...w.vx.map((vx, p) => Math.hypot(vx, w.vy[p])));
console.log(`OK: ${n0} particles, 400 steps, no NaN, max speed ${maxSpeed.toFixed(3)}`);
