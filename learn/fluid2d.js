// fluid2d.js - a tiny 2D water simulation for beginners.
// Water is a cloud of PARTICLES (dots). Every frame we copy their speeds onto
// a GRID of boxes ("cells"), fix the speeds on the grid so the water can't
// squash, then copy the speeds back to the particles and move them.
// This "particles + grid" idea is called PIC/FLIP.

const GRID_W = 64, GRID_H = 48;  // number of cells across and down
const CELL = 1 / GRID_H;         // size of one cell (the box is 1 unit tall)
const GRAVITY = -9.8;            // pull downwards (units per second squared)
const FLIP_RATIO = 0.9;          // 0 = smooth/syrupy (PIC), 1 = lively/noisy (FLIP)
const MAX_SWEEPS = 200;          // most times we repeat the "no squashing" fix
const PRESSURE_TOLERANCE = 1e-4; // "good enough": leftover squash below this (m/s)
const AIR = 0, WATER = 1, WALL = 2;

// "MAC grid": horizontal speeds (u) live on the LEFT/RIGHT edges of each cell,
// vertical speeds (v) live on the TOP/BOTTOM edges. That makes it easy to
// measure how much water flows in or out of a cell.
function createWorld() {
  const w = {
    x: [], y: [], vx: [], vy: [],                         // particle data
    u: new Float32Array((GRID_W + 1) * GRID_H),            // horizontal edge speeds
    v: new Float32Array(GRID_W * (GRID_H + 1)),            // vertical edge speeds
    uOld: null, vOld: null,                                // copies for FLIP
    uWeight: new Float32Array((GRID_W + 1) * GRID_H),
    vWeight: new Float32Array(GRID_W * (GRID_H + 1)),
    type: new Uint8Array(GRID_W * GRID_H),                 // AIR, WATER or WALL
  };
  // Dam break: a block of water in the bottom-left, 2x2 particles per cell.
  for (let i = 1; i < GRID_W * 0.4; i++)
    for (let j = 1; j < GRID_H * 0.75; j++)
      for (let a = 0; a < 2; a++)
        for (let b = 0; b < 2; b++) {
          w.x.push((i + 0.25 + 0.5 * a) * CELL);
          w.y.push((j + 0.25 + 0.5 * b) * CELL);
          w.vx.push(0); w.vy.push(0);
        }
  return w;
}

// Helper: spread one particle onto the 4 nearest grid points ("bilinear").
// (ox, oy) shift the grid because u and v points sit on cell edges.
// Calls visit(index, weight) for each of the 4 points; weights add up to 1.
function forEachNeighbour(px, py, ox, oy, nx, ny, visit) {
  const gx = px / CELL - ox, gy = py / CELL - oy;
  const i = Math.max(0, Math.min(nx - 2, Math.floor(gx)));
  const j = Math.max(0, Math.min(ny - 2, Math.floor(gy)));
  const fx = gx - i, fy = gy - j;
  visit(i + j * nx, (1 - fx) * (1 - fy));
  visit(i + 1 + j * nx, fx * (1 - fy));
  visit(i + (j + 1) * nx, (1 - fx) * fy);
  visit(i + 1 + (j + 1) * nx, fx * fy);
}

// STEP 1 - Particles to grid (P2G).
// Each grid edge takes a weighted average of the speeds of nearby particles.
// We also mark which cells hold water, which are walls, and which are air.
function particlesToGrid(w) {
  w.u.fill(0); w.v.fill(0); w.uWeight.fill(0); w.vWeight.fill(0);
  for (let i = 0; i < GRID_W; i++)
    for (let j = 0; j < GRID_H; j++) {
      const edge = i === 0 || j === 0 || i === GRID_W - 1 || j === GRID_H - 1;
      w.type[i + j * GRID_W] = edge ? WALL : AIR;
    }
  for (let p = 0; p < w.x.length; p++) {
    const c = Math.floor(w.x[p] / CELL) + Math.floor(w.y[p] / CELL) * GRID_W;
    if (w.type[c] === AIR) w.type[c] = WATER;
    forEachNeighbour(w.x[p], w.y[p], 0, 0.5, GRID_W + 1, GRID_H, (k, wt) => {
      w.u[k] += wt * w.vx[p]; w.uWeight[k] += wt; });
    forEachNeighbour(w.x[p], w.y[p], 0.5, 0, GRID_W, GRID_H + 1, (k, wt) => {
      w.v[k] += wt * w.vy[p]; w.vWeight[k] += wt; });
  }
  for (let k = 0; k < w.u.length; k++) if (w.uWeight[k] > 0) w.u[k] /= w.uWeight[k];
  for (let k = 0; k < w.v.length; k++) if (w.vWeight[k] > 0) w.v[k] /= w.vWeight[k];
  // Extrapolate: an empty (air) edge next to water copies the average of its
  // watery neighbours, so particles at the surface read sensible speeds.
  const extend = (a, wt, nx) => { const src = a.slice();
    for (let k = 0; k < a.length; k++) { if (wt[k] > 0) continue; let s = 0, n = 0;
      for (const d of [-1, 1, -nx, nx]) if (wt[k + d] > 0) { s += src[k + d]; n++; }
      if (n) a[k] = s / n; } };
  extend(w.u, w.uWeight, GRID_W + 1); extend(w.v, w.vWeight, GRID_W);
  w.uOld = w.u.slice(); w.vOld = w.v.slice();  // remember for FLIP in step 4
}

// STEP 2 - Gravity. Speed up every vertical edge that touches water downwards
// a little (edges in empty air have no water to pull on).
function applyGravity(w, dt) {
  for (let k = 0; k < w.v.length; k++) if (w.vWeight[k] > 0) w.v[k] += GRAVITY * dt;
}

// STEP 3 - Pressure solve: make the water incompressible (unsquashable).
// For every water cell we measure the "divergence": total flow OUT minus flow IN.
// Real water can't gain or lose volume, so it must be 0. We push the
// difference equally back through the cell's open (non-wall) sides. Fixing
// one cell slightly upsets its neighbours, so we sweep the grid again and
// again (Gauss-Seidel), each time a bit closer. We stop once the worst cell is
// below PRESSURE_TOLERANCE, or after MAX_SWEEPS as a safety limit. Walls block flow.
function solvePressure(w) {
  const U = (i, j) => i + j * (GRID_W + 1), V = (i, j) => i + j * GRID_W;
  const open = (i, j) => (w.type[i + j * GRID_W] !== WALL ? 1 : 0);
  // Walls never move: zero any edge that touches a wall cell.
  for (let i = 0; i < GRID_W; i++)
    for (let j = 0; j < GRID_H; j++) {
      if (w.type[i + j * GRID_W] !== WALL) continue;
      w.u[U(i, j)] = 0; w.u[U(i + 1, j)] = 0; w.v[V(i, j)] = 0; w.v[V(i, j + 1)] = 0;
    }
  for (let sweep = 0; sweep < MAX_SWEEPS; sweep++) {
    let worst = 0;                               // biggest divergence seen this sweep
    for (let i = 1; i < GRID_W - 1; i++)
      for (let j = 1; j < GRID_H - 1; j++) {
        if (w.type[i + j * GRID_W] !== WATER) continue;
        const sl = open(i - 1, j), sr = open(i + 1, j), sb = open(i, j - 1), st = open(i, j + 1);
        const sides = sl + sr + sb + st;
        if (sides === 0) continue;
        const divergence = w.u[U(i + 1, j)] - w.u[U(i, j)] + w.v[V(i, j + 1)] - w.v[V(i, j)];
        worst = Math.max(worst, Math.abs(divergence));
        const fix = (1.9 * divergence) / sides;   // 1.9 = "over-relax" to converge faster
        w.u[U(i, j)] += sl * fix;  w.u[U(i + 1, j)] -= sr * fix;
        w.v[V(i, j)] += sb * fix;  w.v[V(i, j + 1)] -= st * fix;
      }
    w.sweeps = sweep + 1;                        // how many sweeps it took (for curious readers)
    if (worst < PRESSURE_TOLERANCE) break;
    if (sweep === MAX_SWEEPS - 1) w.hitSweepCap = true;  // gave up before "good enough"
  }
}

// STEP 4 - Grid to particles (G2P).
// PIC: particle takes the grid speed directly (stable but loses swirls).
// FLIP: particle only adds the CHANGE in grid speed (keeps detail, can be noisy).
// We blend the two with FLIP_RATIO.
function gridToParticles(w) {
  const sample = (arr, px, py, ox, oy, nx, ny) => {
    let s = 0;
    forEachNeighbour(px, py, ox, oy, nx, ny, (k, wt) => { s += wt * arr[k]; });
    return s;
  };
  for (let p = 0; p < w.x.length; p++) {
    const px = w.x[p], py = w.y[p];
    const uNew = sample(w.u, px, py, 0, 0.5, GRID_W + 1, GRID_H);
    const vNew = sample(w.v, px, py, 0.5, 0, GRID_W, GRID_H + 1);
    const du = uNew - sample(w.uOld, px, py, 0, 0.5, GRID_W + 1, GRID_H);
    const dv = vNew - sample(w.vOld, px, py, 0.5, 0, GRID_W, GRID_H + 1);
    w.vx[p] = FLIP_RATIO * (w.vx[p] + du) + (1 - FLIP_RATIO) * uNew;
    w.vy[p] = FLIP_RATIO * (w.vy[p] + dv) + (1 - FLIP_RATIO) * vNew;
  }
}

// STEP 5 - Move particles, and keep them out of the walls.
function moveParticles(w, dt) {
  const lo = CELL * 1.01, hiX = (GRID_W - 1.01) * CELL, hiY = (GRID_H - 1.01) * CELL;
  for (let p = 0; p < w.x.length; p++) {
    w.x[p] += w.vx[p] * dt; w.y[p] += w.vy[p] * dt;
    if (w.x[p] < lo) { w.x[p] = lo; w.vx[p] = 0; }
    if (w.x[p] > hiX) { w.x[p] = hiX; w.vx[p] = 0; }
    if (w.y[p] < lo) { w.y[p] = lo; w.vy[p] = 0; }
    if (w.y[p] > hiY) { w.y[p] = hiY; w.vy[p] = 0; }
  }
}

// step = ONE substep: the five steps above, in order.
function step(w, dt = 1 / 240) {
  particlesToGrid(w);
  applyGravity(w, dt);
  solvePressure(w);
  gridToParticles(w);
  moveParticles(w, dt);
}

// One frame (1/240 s by default). The "CFL rule": no particle may move more
// than one cell per substep, so fast water gets more, smaller substeps
// (at most MAX_SUBSTEPS). w.hitSweepCap tells you if the pressure fix ever
// ran out of sweeps during this frame.
const MAX_SUBSTEPS = 8;
function frame(w, frameDt = 1 / 240) {
  let fastest = 0;
  for (let p = 0; p < w.x.length; p++) fastest = Math.max(fastest, Math.hypot(w.vx[p], w.vy[p]));
  const n = Math.min(MAX_SUBSTEPS, Math.max(1, Math.ceil((fastest * frameDt) / CELL)));
  w.hitSweepCap = false; w.substeps = n;
  for (let i = 0; i < n; i++) step(w, frameDt / n);
}

// Let Node.js (tests) use this file too; browsers simply skip this.
if (typeof module !== 'undefined') module.exports = { createWorld, step, frame, GRID_W, GRID_H, CELL };
