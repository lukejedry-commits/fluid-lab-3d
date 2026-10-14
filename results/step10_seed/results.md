# Step 10 C3.seed (clearance-respecting jitter)

- Code commit the runs executed at: 572d665 (clean tree)
- spec/ASSERTS.md md5 8b21311bc676215b8d282aa4ddcb7637; PHYSICS_SPEC.md md5 7d1c18f5aed86d07324c227539ee96e5
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 2 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 3 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 6.231e-4 (frame 76, m=8.0050, 27281 cells) | <= 1e-2 | PASS |
| 4 | tilted | C3.tilted_tank peak cell count, every frame | 18 (frame 52, cell [9,7,30]) | <= 16 | FAIL |
| 5 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 0.000e+0 | <= 1e-6 | PASS |
| 6 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 0.000e+0 | <= 1e-6 | PASS |
| 7 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.686e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.001e+2; g2p -5.549e-1; extension 1.695e-1; advect -5.997e-2; pushout 2.061e-5 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 8 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 2.061e-5 J (6.722e-8 |E0|) / 1.813e-6 J / 38 of 120 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 8.806e-2 / 2.007e-1 | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.671e-7 J (-1.197e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 11 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 12 (t=0.1833 s): step dE 1.813e-6 J; top particle #258509 dE 5.331e-7 J, x0 [0.456575, 0.330470, 0.490562] m, dx [4.248e-5, 4.203e-5, 1.140e-4] m, v before [-1.843e-2, -4.192e-3, -1.273e-1] -> after [-1.843e-2, -4.192e-3, -1.273e-1] m/s | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 15 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 17 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.992, 7.992, 8.026, 8.005, 7.973 | info (not graded) | INFO |
| 18 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 19 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 20 | separation | C3.separation strict interior mean (info per section Z) | 2.963e-4 (frame 67, m=7.9976, 27000 cells) | info (not graded) | INFO |
| 21 | separation | C3.separation peak cell count (info) | 13 (frame 28, cell [31,16,31]) | info (not graded) | INFO |
| 22 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 1.764e-6 | <= 1e-6 | FAIL |
| 23 | separation | C3.separation cumulative stage energy at end (J) | p2g 1.174e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.398e-1; extension 2.128e-4; advect 5.233e-4; pushout 1.007e-7 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 24 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 1.007e-7 J (3.285e-10 |E0|) / 2.925e-9 J / 102 of 120 | info (not graded) | INFO |
| 25 | separation | C3.separation max|u| at t=2 s | 1.703e-2 | < 2.215e-3 | FAIL |
| 26 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 2.672e-12 J (8.715e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 27 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 42 (t=0.6833 s): step dE 2.925e-9 J; top particle #257245 dE 2.859e-8 J, x0 [0.431726, 0.189305, 0.494696] m, dx [-3.769e-6, 3.073e-6, 6.112e-6] m, v before [6.932e-4, -5.964e-5, -5.596e-3] -> after [6.932e-4, -5.964e-5, -5.596e-3] m/s | info (not graded) | INFO |
| 28 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 29 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 30 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 31 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 32 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 33 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.007, 7.995, 8.000 | info (not graded) | INFO |
| 34 | seedT3 | C3.seed T3 a=16: min distance of any seeded particle to any wall at t=0 | 7.1441e-4 m | >= clearance 4.4648e-4 m | PASS |
| 35 | seedT3 | C3.seed T3 a=8: min distance of any seeded particle to any wall at t=0 | 1.4290e-3 m | >= clearance 8.9297e-4 m | PASS |

Total graded: 9 PASS, 3 FAIL
