# Step 17: C3.separation theta spread and jitter control (INFO ONLY; code 1e6089c fix 3 v6, alpha 0.1; ASSERTS d234870b)

Runner: test/run_step17_septheta.js. Setup as tankRun('C3.separation'): N=32, H=0.5, 32x32x40, 262144 particles, cap 16, 120 steps over 2 s.
Theta is sim.thetaOf on each column's top fluid->air z-face, the same value the solve uses. z_s = (k_top + 1/2 + theta) h.
The step-16 runner (pre---densoff) produced jit0.5, jit0 and T1setup. jit0.5_densoff_info is an isolation control, not tuning (fix 3 off).
An earlier densoff attempt was a runner edit bug: the seedBlock call was commented out, so it ran with 0 particles. Its files were deleted before this run, and nothing committed was touched.

| run | jitter / seed | max (E-E0)/abs(E0) | max abs(u) at 2 s (limit 2.215e-3) | max abs(u) over run | g+p per step min / max (J) | sums: p2g / g2p / extension / advect / densfix (J) |
|---|---|---|---|---|---|---|
| C3.separation | 0.5 / 3232 | 2.044e-6 FAIL | 1.793e-2 FAIL | 6.435e-2 | 1.089e-3 / 1.194e-3 | 1.375e-3 / -1.409e-1 / 2.431e-4 / 4.681e-4 / 9.498e-5 |
| control, lattice | 0 / 3232 | 1.956e-13 pass | 1.171e-9 pass | 1.171e-9 | 8.158e-4 constant | 0 / -9.790e-2 / 0 / -3.4e-12 / 0 |
| T1 setup at 2 s | 0.1 / 1032 | 1.576e-14 pass | 1.178e-9 pass | 1.178e-9 | 8.264e-4 constant | 0 / -9.916e-2 / 0 / -1.4e-12 / 0 |
| jitter 0.5, fix 3 off (info) | 0.5 / 3232 | 1.764e-6 FAIL | 1.703e-2 FAIL | 5.690e-2 | 1.089e-3 / 1.177e-3 | 1.174e-3 / -1.398e-1 / 2.128e-4 / 5.233e-4 / 0 |

Gravity and pressure sum to 2.005e+2 / -2.004e+2 J in all runs.

## Theta on top fluid->air faces (1024 columns, all with top fluid k=31 in every run and frame)

| frame | jit0.5: theta min / max / std | jit0.5: z_s std (m) | jit0.5: particle-count height std (m) | jit0 and T1 setup |
|---|---|---|---|---|
| 0 | 0.500 / 0.500 / 0 | 0 | 0 | 0.5 everywhere, std 0, every frame |
| 1 | 0.250 / 0.625 / 0.0271 | 4.24e-4 | 2.56e-3 | |
| 10 | 0.375 / 0.750 / 0.0300 | 4.69e-4 | 2.73e-3 | |
| 30 | 0.250 / 0.750 / 0.0366 | 5.73e-4 | 3.07e-3 | |
| 120 | 0.250 / 0.750 / 0.0377 | 5.89e-4 | 3.35e-3 | |

Fix 3 off gives the same spread: std 0.0269 at frame 1 and 0.0364 at frame 120.

## Verdict (Physics/NM decision tree)
- The no-jitter control PASSES both still-water criteria, and so does the T1 setup (jitter 0.1) over the same 2 s. This is the "lattice passes" branch, so no still-water balance diff vs T1 is needed. Remaining setup differences vs T1 are only jitter 0.5 vs 0.1, the seed, and 2 s vs 10 s.
- Surface vs transfers: the evidence points to the TRANSFERS.
  - At t=0 theta is exactly uniform (0.5 on all 1024 faces) in the jittered run, just as on the lattice. Sub-cell jitter keeps 8 particles per cell.
  - At step 1 the solve therefore sees the same surface in both runs, yet g+p already differs: 1.089e-3 J jittered vs 8.158e-4 J on the lattice. Gravity adds the same amount in both, so the jittered p2g face masses (fixed by particle positions) leave a different post-projection grid field.
  - Step-1 g2p carries that field to jittered positions without cancellation: max abs(u) is 1.2e-9 at step 1 and 3.25e-2 at step 2. On the lattice it cancels (max abs(u) stays 1.2e-9).
  - Only after that does the theta spread appear (frame 1, std 0.027). It comes from particles crossing cell lines, at quantization h/8 per particle, and grows to std 0.038 while max abs(u) stays around 1e-2.
  - Theta spread is a consequence that then sustains the noise; it is not the trigger.
- Fix 3 is not the cause: with it off the failure is unchanged.
- Jitter 0.1 (T1) also stays at 1e-9, so the effect depends on jitter amplitude, at least between 0.1 and 0.5.
