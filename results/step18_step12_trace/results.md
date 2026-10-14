# Step 18: C3.separation steps 1-2 stage trace (INFO ONLY; code 1e6089c, alpha 0.1; ASSERTS d234870b)

Runners:
- test/run_step18_trace.js: method wrapping, no solver change.
- test/run_step18_step1moves.js: which stage moves particles across cell lines.

Setup: N=32, H=0.5, seed 3232, dt 1/60 (1 substep per frame, as in tankRun).
Face classes: "fluid" = a face with an adjacent fluid cell (project's valid set); "air" = every other in-box face.

| stage | lattice (jitter 0), step 2 | jitter 0.5, step 1 | jitter 0.5, step 2 | jitter 0.5, C := 0 after step 1, step 2 |
|---|---|---|---|---|
| after P2G: grid max abs(u), fluid / air (m/s) | 1.1e-9 / 1.5e-9 | 0 / 0 | 1.1e-9 / 1.3e-9 | 8.7e-10 / 7.4e-10 |
| after pressure: fluid faces max abs(u) / KE | 1.5e-9 / 4.3e-18 J | 1.5e-9 / 4.3e-18 J | **8.13e-2 at z-face (4,6,32), top surface / 5.7e-5 J** | **8.13e-2 at z-face (4,6,32) / 5.7e-5 J** |
| after extension: air faces max abs(u) | 8.4e-10 | 8.4e-10 | 9.97e-3 at z-face (27,16,33) | 9.97e-3 |
| after G2P: particle max abs(u) / KE | 1.17e-9 / 3.6e-18 J | 1.18e-9 / 3.6e-18 J | 3.26e-2 at particle in cell (14,0,31), top row, y-wall / 1.34e-5 J | identical |
| after G2P: C Frobenius max / mean (1/s) | 1.3e-7 / 8.9e-9 | 1.6e-7 / 8.9e-9 | 3.61 (cell (15,0,31)) / 9.1e-3 | identical |
| step-end max abs(u) | 1.17e-9 | 1.18e-9 | 3.25e-2 | 3.25e-2 |
| extension stage dE | 0 | 0 | +1.17e-6 J | +1.17e-6 J |

## Step-1 particle moves across cell lines (jitter 0.5)

| step-1 stage | particles moved | max displacement / h | crossed a cell line | of which touch the top layer k=31 |
|---|---|---|---|---|
| advect | all | 1.4e-9 | 0 | 0 |
| wallStrip | 2223 | 1.9e-10 | 0 | 0 |
| separate (push-out pairs) | 59108 | 0.138 | 1327 | 54 |
| densityCorrection (fix 3 on; includes its own push-out) | all | 0.050 | 51 | 1 |

The separate() row is identical with fix 3 off (jit0.5_densoff_info_step1_moves.json).

## Verdict
- The jump does not come from the C path. Zeroing every particle C after step 1 gives a bit-identical step 2: 8.13e-2 on the grid, then 3.25e-2 on the particles.
- It does not come from the extension-into-air path either.
  - The largest grid velocity is on a fluid face, the top surface z-face (4,6,32), right after the step-2 pressure solve.
  - Extended air faces only reach 9.97e-3, about 8x smaller, and the extension stage dE is +1.2e-6 J.
- It first appears in the step-2 PRESSURE SOLVE, at the top-row surface faces. The solve's input grid (after P2G) is still at 1e-9.
- What changed between step 1 and step 2 is the cell occupancy, not the velocity:
  - step-1 push-out pair separation, separate(), moves 1327 particles across cell lines, 54 of them at the top layer;
  - in jittered seeding, sub-cell pairs sit closer than 0.5 s;
  - this makes theta non-uniform (0.25..0.625, step 17), and the ghost-fluid surface pressure then drives top-row faces at up to 8e-2 m/s.
- On the lattice, separate() moves nothing: theta stays 0.5 and the solve stays at 1e-9.
- This corrects the step-17 reading ("transfers"). The trigger is surface theta set by push-out re-binning at t=0, and the projection responds to it.
