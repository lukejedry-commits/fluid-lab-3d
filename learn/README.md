# learn/ - a tiny 2D water simulation

A beginner-friendly, ~150-line version of the ideas behind the main 3D solver.
Plain JavaScript and an HTML canvas, no libraries.

## How to open it
Double-click `index.html` (or drag it into Chrome/Firefox). That's it: no server needed.
Press **Reset** to drop the water again. Dots are coloured by speed: blue = slow, red = fast.
Headless test in Node: `node learn/test_headless.js` (400 steps, checks particle count and NaN).

## The five steps (in `fluid2d.js`, function `step`)

**1. Particles to grid (`particlesToGrid`).** The water is a few thousand particles, but it is
much easier to make water behave on a regular grid of boxes. So each frame every particle
"paints" its velocity onto the 4 nearest grid points, weighted by how close it is. We also mark
each cell as wall, water (has a particle in it) or air. Horizontal speeds are stored on the left
and right edges of each cell and vertical speeds on the top and bottom edges (a "MAC grid"),
which makes measuring the flow in and out of a cell very simple.

**2. Gravity (`applyGravity`).** Every vertical speed on the grid is nudged downwards by
gravity × time step. That's all gravity is: a small change in speed each frame.

**3. Pressure solve (`solvePressure`).** Real water can't be squashed: whatever flows into a
cell must flow out. For each water cell we add up the flow out minus the flow in (the
"divergence"). If it isn't zero, we push the extra back out through the cell's open sides,
shared equally. Fixing one cell upsets its neighbours a little, so we sweep over the grid 40
times (the Gauss-Seidel method), and each sweep brings every cell closer to zero. Walls never
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
- A fixed 40 Gauss-Seidel sweeps are not fully converged. That's fine for looks, but not exact.
- Fixed time step (1/120 s, 2 steps per drawn frame), with no CFL limit.
