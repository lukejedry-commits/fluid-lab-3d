# learn/ - a tiny 2D water simulation

A beginner-friendly, ~150-line version of the ideas behind the main 3D solver.
Plain JavaScript and an HTML canvas, no libraries.

## How to open it
Double-click `index.html` (or drag it into Chrome/Firefox). That's it: no server needed.
Press **Reset** to drop the water again. Dots are coloured by speed: blue = slow, red = fast.
Headless test in Node: `node learn/test_headless.js` (400 steps, checks particle count and NaN).

## The five steps (in `fluid2d.js`, function `step`; `frame` repeats it 1-8 times)

**1. Particles to grid (`particlesToGrid`).** The water is a few thousand particles, but it is
much easier to make water behave on a regular grid of boxes. So each frame every particle
"paints" its velocity onto the 4 nearest grid points, weighted by how close it is. We also mark
each cell as wall, water (has a particle in it) or air. Horizontal speeds are stored on the left
and right edges of each cell and vertical speeds on the top and bottom edges (a "MAC grid"),
which makes measuring the flow in and out of a cell very simple.

**2. Gravity (`applyGravity`).** Every vertical speed on the grid is nudged downwards by
gravity × time step, but only edges that touch water (empty air has nothing to pull). That's all gravity is: a small change in speed each frame.

**3. Pressure solve (`solvePressure`).** Real water can't be squashed: whatever flows into a
cell must flow out. For each water cell we add up the flow out minus the flow in (the
"divergence"). If it isn't zero, we push the extra back out through the cell's open sides,
shared equally. Fixing one cell upsets its neighbours a little, so we sweep over the grid again and
again (the Gauss-Seidel method) until the worst cell is below 1e-4 m/s, or 200 sweeps at most. Walls never
move, so their edges stay at zero. This step is what turns falling dots into a splashing,
sloshing liquid.

**4. Grid to particles (`gridToParticles`).** Now each particle reads the corrected speed back
from the 4 nearest grid points. Taking that value directly ("PIC") is smooth but loses detail,
like syrup. Adding only the *change* the grid made this frame ("FLIP") keeps the swirls but can
get noisy. We blend 90% FLIP with 10% PIC.

**5. Move particles (`moveParticles`).** Each particle moves by velocity × time step. If one ends
up inside a wall, we put it back at the wall and stop its speed into the wall.

## Caveats (simplifications compared with the real 3D sim)
- There is no particle-spacing or density correction, so particles can bunch into lines and the
  water volume slowly drifts. The real sim adds both.
- Gauss-Seidel stops at max |divergence| < 1e-4 m/s or 200 sweeps, so it is close to, not exactly, incompressible.
- `step(w, dt)` is exactly one substep. `frame(w)` is one 1/240 s frame (4 per drawn frame), split into 1-8 substeps so no particle moves more than one cell per substep (CFL rule). If even 8 is not enough the rule is broken for that frame. `w.substeps` and `w.hitSweepCap` (pressure ran out of sweeps) are set every frame.
