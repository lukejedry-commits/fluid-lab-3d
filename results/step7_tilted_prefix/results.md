# Step 7 C3.tilted_tank on pre-fix code

- Code commit the runs executed at: 8e41907 (src/ identical to pre-fix 42cf1bc) (clean tree)
- spec/ASSERTS.md md5 57a770903e62919dd1a9a23d3b81361e; PHYSICS_SPEC.md md5 8cacb3da1aa2c5215473ac5160617552
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 2 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 7.798e-4 (frame 77, m=8.0062, 27252 cells) | <= 1e-2 | PASS |
| 3 | tilted | C3.tilted_tank peak cell count, every frame | 18 (frame 52, cell [9,7,30]) | <= 16 | FAIL |
| 4 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 8.138e-6 | <= 1e-6 | FAIL |
| 5 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 0.000e+0 | <= 1e-6 | PASS |
| 6 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 6.812e-2; ghost 0.000e+0; gravity 2.006e+2; pressure -2.003e+2; g2p -5.991e-1; extension 1.699e-1; advect -6.040e-2; pushout 4.531e-3 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 7 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 4.531e-3 J (1.478e-5 |E0|) / 4.510e-3 J / 40 of 120 | info (not graded) | INFO |
| 8 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.049e-1 / 2.007e-1 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.992, 7.992, 8.027, 8.002, 7.978 | info (not graded) | INFO |

Total graded: 2 PASS, 2 FAIL

## Validity (section Z)
The test fails the **peak** row on pre-fix code: 18 > 16 at frame 52, cell [9,7,30], which is in the surface layer, not at a floor corner. The interior-mean row passes (0.078%). Under section Z, a failure on either row is enough for the test to count. The total-energy row also fails (+8.14e-6 |E0|). The energy summed over all stages except push-out never rises above E0, so the energy rise comes entirely from push-out (+1.48e-5 |E0| cumulative).
