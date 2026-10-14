# Step 14: fix 3 v5 (ASSERTS dc6da53d, Z 2026-10-14g/h)

- Code commit the runs executed at: ed308a7 (clean tree)
- spec/ASSERTS.md md5 dc6da53d8606274a4ebad5872526d46a; PHYSICS_SPEC.md md5 7b815475dc4d1423f10f83568a876c05
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 2 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 3 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 6.563e-4 (frame 94, m=8.0053, 27235 cells) | <= 1e-2 | PASS |
| 4 | tilted | C3.tilted_tank peak cell count, every frame | 16 (frame 27, cell [4,9,31]) | <= 16 | PASS |
| 5 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 0.000e+0 | <= 1e-6 | PASS |
| 6 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 0.000e+0 | <= 1e-6 | PASS |
| 7 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.602e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.001e+2; g2p -5.537e-1; extension 1.702e-1; advect -5.957e-2; pushout 2.035e-5; densfix 4.230e-4 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 8 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 2.035e-5 J (6.637e-8 |E0|) / 1.813e-6 J / 31 of 120 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank fix3 stage: signed sum of dPE over run | 4.230e-4 J (1.379e-6 |E0|) | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 2.096e-6 / 6.291e-5; 7 of 120 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 5.760e-2 / -2.018e-1 / 2.028e-1 (7) | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank fix3 ebar_T4 max |.| / steps with nonzero target | 5.267e-4 / 0 of 120 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank C3.fix3 target sum |sum e - target_r| / n_r, every step | 3.826e-18 | <= 1e-12 | PASS |
| 15 | tilted | C3.tilted_tank fix3 PCG iterations (mean / max) | 1.28 / 23 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0029 / 0 of 120 | info (not graded) | INFO |
| 17 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.077e-1 / 2.007e-1 | info (not graded) | INFO |
| 18 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.671e-7 J (-1.197e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 19 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 12 (t=0.1833 s): step dE 1.813e-6 J; top particle #258509 dE 5.331e-7 J, x0 [0.456575, 0.330470, 0.490562] m, dx [4.247e-5, 4.203e-5, 1.140e-4] m, v before [-1.843e-2, -4.191e-3, -1.273e-1] -> after [-1.843e-2, -4.191e-3, -1.273e-1] m/s | info (not graded) | INFO |
| 20 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 21 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 22 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 23 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 24 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 25 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.993, 7.989, 8.028, 8.003, 7.977 | info (not graded) | INFO |
| 26 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 27 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 28 | separation | C3.separation strict interior mean (info per section Z) | 2.917e-4 (frame 59, m=7.9977, 27000 cells) | info (not graded) | INFO |
| 29 | separation | C3.separation peak cell count (info) | 13 (frame 27, cell [31,16,31]) | info (not graded) | INFO |
| 30 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 2.044e-6 | <= 1e-6 | FAIL |
| 31 | separation | C3.separation cumulative stage energy at end (J) | p2g 1.375e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.409e-1; extension 2.431e-4; advect 4.681e-4; pushout 1.590e-7; densfix 9.498e-5 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 32 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 1.590e-7 J (5.187e-10 |E0|) / 5.505e-9 J / 102 of 120 | info (not graded) | INFO |
| 33 | separation | C3.separation C3.separation anti-inflation (fix 3 on): |sum over steps of stage dPE| over 2 s | 9.498e-5 J (signed 9.498e-5 J; 3.098e-7 |E0|) | <= 1e-6 |E0| = 3.066e-4 J | PASS |
| 34 | separation | C3.separation fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 35 | separation | C3.separation fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 2.625e-7 / 3.150e-5; 1 of 120 | info (not graded) | INFO |
| 36 | separation | C3.separation fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 2.027e-1 / 2.027e-1 / 2.027e-1 (1) | info (not graded) | INFO |
| 37 | separation | C3.separation fix3 ebar_T4 max |.| / steps with nonzero target | 9.726e-6 / 0 of 120 | info (not graded) | INFO |
| 38 | separation | C3.separation C3.fix3 target sum |sum e - target_r| / n_r, every step | 7.455e-19 | <= 1e-12 | PASS |
| 39 | separation | C3.separation fix3 PCG iterations (mean / max) | 0.19 / 23 | info (not graded) | INFO |
| 40 | separation | C3.separation fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0029 / 0 of 120 | info (not graded) | INFO |
| 41 | separation | C3.separation max|u| at t=2 s | 1.793e-2 | < 2.215e-3 | FAIL |
| 42 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 2.672e-12 J (8.715e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 43 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 9.820e-9 J; top particle #155639 dE 2.335e-6 J, x0 [0.483924, 0.496810, 0.295144] m, dx [-1.360e-4, 0.000e+0, 4.992e-4] m, v before [-5.950e-11, -2.475e-12, 1.266e-10] -> after [-5.950e-11, -2.475e-12, 1.266e-10] m/s | info (not graded) | INFO |
| 44 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 45 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 46 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 47 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 48 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 49 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.008, 7.994, 8.000 | info (not graded) | INFO |
| 50 | t3a16 | a16 Ritter short window W=3 frames: peak speed / U_R | 1.0119519 (frame 26) | <= 1 + q = 1.0337317 (q = 0.0337317) | PASS |
| 51 | t3a16 | a16 Ritter long window W_L=11 frames: peak speed / U_R | 0.9567546 (frame 29) | <= 1.0 | PASS |
| 52 | t3a16 | a16 Ritter single-substep peak (info) | 2.2263 U_R | info (not graded) | INFO |
| 53 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 57) |
| 54 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 278 > 0 | <= 0 every step | PASS |
| 55 | t3a16 | a16 P.res max true residual | 9.903e-9 | <= 1e-8 | PASS |
| 56 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 57 | t3a16 | a16 CFL / cap | max CFL 0.9975; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 278 | info (not graded) | INFO |
| 58 | t3a16 | a16 T3.mm shift | 0.3846 | info (not graded) | INFO |
| 59 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 60 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 61 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 62 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 63 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 64 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 65 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 66 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 67 | t3a16 | a16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 68 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 69 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.972, T_mean 2.83) | 5.03% | <= 8% | PASS |
| 70 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 71 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.275, T_mean 3.11) | 5.31% | <= 8% | PASS |
| 72 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 73 | t3a16 | a16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 74 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.499, T_mean 4.44) | 1.33% | <= 8% | PASS |
| 75 | t3a16 | a16 T3.mm Z=7 (T_sim 5.140, T_mean 5.09) | 0.99% | <= 8% | PASS |
| 76 | t3a16 | a16 T3.mm Z=8 (T_sim 5.712, T_mean 5.69) | 0.38% | <= 8% | PASS |
| 77 | t3a16 | a16 T3.mm Z=9 (T_sim 6.221, T_mean 6.3) | 1.25% | <= 8% | PASS |
| 78 | t3a16 | a16 T3.mm Z=10 (T_sim 6.799, T_mean 6.83) | 0.45% | <= 8% | PASS |
| 79 | t3a16 | a16 T3.mm Z=11 (T_sim 7.333, T_mean 7.44) | 1.44% | <= 8% | PASS |
| 80 | t3a16 | a16 T3.mm Z=12 (T_sim 7.824, T_mean 8.08) | 3.17% | <= 8% | PASS |
| 81 | t3a16 | a16 T3.mm Z=13 (T_sim 8.358, T_mean 8.67) | 3.60% | <= 8% | PASS |
| 82 | t3a16 | a16 T3.mm Z=14 (T_sim 8.900, T_mean 9.31) | 4.40% | <= 8% | PASS |
| 83 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 2.504e-2 (frame 12, m=8.2003) | <= 1e-2 every frame | FAIL |
| 84 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 85 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -8.559e-2 / -1.064e-1 | info (not graded) | INFO |
| 86 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 6.868e-2 / 3.608e-1 | info (not graded) | INFO |
| 87 | t3a16 | a16 T4 peak count | 24 at frame 10 cell [5,7,0] (front x 4.19a) | info (not graded) | INFO |
| 88 | t3a16 | a16 T4 final histogram n:cells(Poisson(6.776)) | 1:384(75) 2:537(254) 3:469(573) 4:654(970) 5:949(1315) 6:1170(1485) 7:1391(1438) 8:1338(1218) 9:1181(917) 10:835(621) 11:443(383) 12:217(216) 13:74(113) 14:22(54) 15:6(25) 16:1(10) 17:1(4) | info (not graded) | INFO |
| 89 | t3a16 | C3.fix3 a=16: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.1000 (stage incl. push-out 0.1074, info) | <= 0.1 | PASS |
| 90 | t3a16 | C3.fix3 a=16: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -6.531e-9 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 91 | t3a16 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a16: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 3.189e-3 J at step 225 (cum dPE 3.689e-3, PE_pack 5.002e-4) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 92 | t3a16 | C3.fix3 a=16: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 93 | t3a16 | C3.fix3 a=16: target sum, max over steps and regions of |sum e - target_r| / n_r | 5.138e-15 | <= 1e-12 every step | PASS |
| 94 | t3a16 | a16 fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target | 7.307e-3 / -1.780e-3 / 2.034e-2; 182 of 278 | info (not graded) | INFO |
| 95 | t3a16 | a16 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 9.437e-4 / 6.022e-3 | info (not graded) | INFO |
| 96 | t3a16 | a16 front displacement caused by the correction alone in each Ritter window (W = 3 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 3); at the worst Ritter window (frame 26): total 1.072e-1 m, by correction 0.000e+0 m (0.000 h), speed 1.0120 U_R, speed minus correction 1.0120 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 97 | t3a16 | a16 fix3 PCG iterations per step (mean / max; steps solved) | 10.2 / 17; 251 of 278 | info (not graded) | INFO |
| 98 | t3a16 | a16 fix3 max |dx|/h per step (mean / max) | 0.0285 / 0.1000 | info (not graded) | INFO |
| 99 | t3a16 | a16 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 5.775e-6 / 3.967e-4 | info (not graded) | INFO |
| 100 | t3a16 | a16 fix3 fraction of steps where the cap binds | 9 of 278 = 0.032; steps 74,75,76,77,78,79,80,81,100 | info (not graded) | INFO |
| 101 | t3a16 | a16 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 3.104e-2 / 6.781e-2 | info (not graded) | INFO |
| 102 | t3a16 | a16 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 9.533e-2 / -4.794e-2 / 3.249e-1; 251 of 278 | info (not graded) | INFO |
| 103 | t3a16 | a16 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 1.877e-2 / -4.583e-1 / 1.289e+0; 97.8 of 1905.2 | info (not graded) | INFO |
| 104 | t3a16 | a16 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 3.706e-3 J, max 1.074e-4 J; sum dKE -7.291e-8 J; PE_pack 5.583e-4 J (max 2.726e-3) | info (not graded) | INFO |
| 105 | t3a16 | C3.fix3 a=16: T3.mm worst graded row no worse than fix 1 (6.94%) | 6.94% | <= 6.94% | PASS |
| 106 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -31901 vs -32593.9; column region (x<a) -7661 vs -7488.8; mean |per-step difference| 14.45 | info (not graded) | INFO |
| 107 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.24e-3 / 2.43e-1 / 6065 of 7426] [-4.97e-4 / 3.38e-2 / 13884 of 17434] [-3.53e-4 / 2.00e-2 / 21014 of 27241] | info (not graded) | INFO |
| 108 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [5.73e-4 / 3.98e-2 / 605 of 2414] [6.22e-4 / 1.89e-2 / 235 of 819] [-1.34e-3 / 9.41e-3 / 350 of 405] | info (not graded) | INFO |
| 109 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [1.60e-5 / 6.28e-2 / 3680 of 8194] [1.80e-5 / 3.39e-2 / 3645 of 8257] [2.25e-6 / 2.81e-2 / 4143 of 8251] | info (not graded) | INFO |
| 110 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,31 | f1: [7.50 7.93 8.00 8.15 8.60 8.43] total 64236; f6: [8.23 8.25 7.61 8.11 8.15 7.82] total 42759; f11: [9.68 9.21 8.44 8.18 8.14 8.09] total 24459; f16: [8.08 8.55 8.21 8.24 8.35 8.27] total 14937; f21: [8.21 7.87 7.95 8.02 7.57 0.00] total 10145; f26: [8.11 7.94 7.66 5.70 0.00 0.00] total 7531; f31: [8.14 7.89 6.96 0.00 0.00 0.00] total 5889 | info (not graded) | INFO |
| 111 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.972 / 2.972 / +0.000; 5.03% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.275 / 3.275 / +0.000; 5.31% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.499 / 4.499 / +0.000; 1.33% | Z=7: 5.140 / 5.140 / +0.000; 0.99% | Z=8: 5.712 / 5.712 / +0.000; 0.38% | Z=9: 6.221 / 6.221 / +0.000; -1.25% | Z=10: 6.799 / 6.799 / +0.000; -0.45% | Z=11: 7.333 / 7.333 / +0.000; -1.44% | Z=12: 7.824 / 7.880 / -0.056; -3.17% | Z=13: 8.358 / 8.358 / +0.000; -3.60% | Z=14: 8.900 / 8.891 / +0.009; -4.40% | info (not graded) | INFO |
| 112 | t3a16 | a16 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.50 / 4 / 11 / 4:7 5:16 6:32 7:20 8:166 9:4 10:5 11:6; f5: 7.72 / 6 / 14 / 6:82 7:26 8:112 9:3 10:6 11:11 12:11 13:3 14:2; f10: 9.61 / 0 / 24 / 0:5 1:16 2:11 3:17 4:13 5:7 6:12 7:20 8:9 9:21 10:10 11:14 12:9 13:8 14:16 15:25 16:18 17:10 18:9 19:1 20:2 21:2 24:1; f15: 8.38 / 1 / 17 / 1:5 2:11 3:9 4:14 5:17 6:17 7:17 8:21 9:37 10:36 11:30 12:24 13:9 14:5 15:1 16:2 17:1; f20: 8.19 / 2 / 15 / 2:6 3:9 4:8 5:17 6:20 7:35 8:45 9:39 10:28 11:22 12:15 13:8 14:2 15:2; f25: 8.02 / 2 / 15 / 2:5 3:14 4:15 5:22 6:28 7:26 8:38 9:26 10:24 11:21 12:19 13:11 14:5 15:2; f31: 8.14 / 2 / 14 / 2:3 3:4 4:11 5:16 6:23 7:38 8:45 9:46 10:33 11:17 12:13 13:6 14:1 | info (not graded) | INFO |
| 113 | t3a8 | a8 Ritter short window W=5 frames: peak speed / U_R | 1.0119519 (frame 29) | <= 1 + q = 1.0404781 (q = 0.0404781) | PASS |
| 114 | t3a8 | a8 Ritter long window W_L=21 frames: peak speed / U_R | 0.8866627 (frame 31) | <= 1.0 | PASS |
| 115 | t3a8 | a8 Ritter single-substep peak (info) | 3.6430 U_R | info (not graded) | INFO |
| 116 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 28) |
| 117 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 153 > 0 | <= 0 every step | PASS |
| 118 | t3a8 | a8 P.res max true residual | 9.939e-9 | <= 1e-8 | PASS |
| 119 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 120 | t3a8 | a8 CFL / cap | max CFL 0.9930; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 153 | info (not graded) | INFO |
| 121 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 122 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 123 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 124 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 125 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 126 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 127 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 128 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 129 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 130 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 131 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 132 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 133 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 134 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 135 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 136 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 137 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 138 | t3a8 | a8 T3.mm Z=7 (T_sim 5.233, T_mean 5.09) | 2.82% | <= 8% | PASS |
| 139 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 140 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 141 | t3a8 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 142 | t3a8 | a8 T3.mm Z=11 (T_sim 7.493, T_mean 7.44) | 0.71% | <= 8% | PASS |
| 143 | t3a8 | a8 T3.mm Z=12 (T_sim 8.068, T_mean 8.08) | 0.15% | <= 8% | PASS |
| 144 | t3a8 | a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 145 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 146 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 5.686e-2 (frame 30, m=8.4549) | <= 1e-2 every frame | FAIL |
| 147 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 148 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -7.825e-2 / -1.086e-1 | info (not graded) | INFO |
| 149 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 8.228e-2 / 3.336e-1 | info (not graded) | INFO |
| 150 | t3a8 | a8 T4 peak count | 22 at frame 15 cell [3,1,0] (front x 6.75a) | info (not graded) | INFO |
| 151 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.693)) | 1:139(28) 2:197(79) 3:111(150) 4:106(213) 5:133(242) 6:140(230) 7:148(187) 8:144(133) 9:129(84) 10:107(48) 11:56(25) 12:18(12) 13:9(5) 14:1(2) 15:1(1) | info (not graded) | INFO |
| 152 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 153 > 0 | <= 0 every step | PASS |
| 153 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 153 > 1e-8 KE_theta; max -1.619e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 154 | t3a8 | C3.fix3 a=8: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.0490 (stage incl. push-out 0.0490, info) | <= 0.1 | PASS |
| 155 | t3a8 | C3.fix3 a=8: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -1.802e-8 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 156 | t3a8 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a8: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 1.226e-3 J at step 127 (cum dPE 2.299e-3, PE_pack 1.073e-3) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 157 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 158 | t3a8 | C3.fix3 a=8: target sum, max over steps and regions of |sum e - target_r| / n_r | 5.164e-16 | <= 1e-12 every step | PASS |
| 159 | t3a8 | a8 fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target | 3.715e-3 / -2.038e-2 / 2.878e-2; 86 of 153 | info (not graded) | INFO |
| 160 | t3a8 | a8 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 6.618e-3 / 3.451e-2 | info (not graded) | INFO |
| 161 | t3a8 | a8 front displacement caused by the correction alone in each Ritter window (W = 5 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 5); at the worst Ritter window (frame 29): total 1.786e-1 m, by correction 0.000e+0 m (0.000 h), speed 1.0120 U_R, speed minus correction 1.0120 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 162 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 7.3 / 12; 130 of 153 | info (not graded) | INFO |
| 163 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0145 / 0.0490 | info (not graded) | INFO |
| 164 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 165 | t3a8 | a8 fix3 fraction of steps where the cap binds | 0 of 153 = 0.000 | info (not graded) | INFO |
| 166 | t3a8 | a8 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 6.682e-2 / 1.702e-1 | info (not graded) | INFO |
| 167 | t3a8 | a8 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 1.175e-1 / -2.010e-1 / 2.526e-1; 130 of 153 | info (not graded) | INFO |
| 168 | t3a8 | a8 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 1.304e-2 / -3.750e-1 / 9.439e-1; 25.7 of 258.5 | info (not graded) | INFO |
| 169 | t3a8 | a8 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 2.282e-3 J, max 1.266e-4 J; sum dKE -7.856e-8 J; PE_pack 1.277e-3 J (max 2.801e-3) | info (not graded) | INFO |
| 170 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 171 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.941 / 1.941 / +0.000; 6.09% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.868 / 2.868 / +0.000; 8.22% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 3.998 / 3.998 / +0.000; -0.54% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.233 / 5.254 / -0.021; 2.82% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.335 / 6.335 / +0.000; 0.55% | Z=10: 6.901 / 6.901 / +0.000; 1.04% | Z=11: 7.493 / 7.467 / +0.026; 0.71% | Z=12: 8.068 / 8.033 / +0.034; -0.15% | Z=13: 8.548 / 8.548 / +0.000; -1.41% | Z=14: 9.114 / 9.114 / +0.000; -2.10% | info (not graded) | INFO |
| 172 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -6858 vs -7767.6; column region (x<a) -1875 vs -1769.0; mean |per-step difference| 10.56 | info (not graded) | INFO |
| 173 | t3a8 | a8 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.56 / 4 / 9 / 4:1 5:3 6:7 7:5 8:44 9:4; f5: 7.80 / 6 / 12 / 6:16 7:10 8:30 11:3 12:5; f10: 9.30 / 0 / 17 / 0:2 1:2 2:5 3:4 4:3 5:5 6:1 8:4 9:3 10:5 11:3 12:4 13:1 14:11 15:6 16:4 17:1; f15: 9.20 / 1 / 22 / 1:5 2:6 3:3 4:6 5:5 6:4 7:5 8:4 9:1 10:1 11:1 12:1 13:1 14:1 15:6 16:2 17:2 18:1 19:3 20:4 21:1 22:1; f20: 7.86 / 2 / 13 / 2:2 3:4 4:4 5:3 6:5 7:8 8:9 9:9 10:10 11:4 12:5 13:1; f25: 8.03 / 3 / 14 / 3:1 5:6 6:10 7:8 8:14 9:14 10:2 11:3 12:5 14:1; f31: 8.19 / 3 / 12 / 3:1 4:2 5:1 6:11 7:7 8:13 9:7 10:17 11:4 12:1 | info (not graded) | INFO |
| 174 | sign | C3.fix3.sign v5 [production sign]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 16/16 outward (min dx.r 2.215e-6 m^2); splat nbar 10.481445 -> 10.413603 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 5.551e-18) | all outward AND splat nbar drops | PASS (test verdict PASS) |
| 175 | sign | C3.fix3.sign v5 [production sign]: splat nbar across the correction stage alone | 10.481445 -> 10.413603 (drops); correction max |dx|/h 0.00426 | info (not graded) | INFO |
| 176 | sign | C3.fix3.sign v5 [sign FLIPPED (must fail)]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 0/16 outward (min dx.r -5.255e-6 m^2); splat nbar 10.481445 -> 10.545973 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 5.551e-18) | all outward AND splat nbar drops | PASS (test verdict FAIL; row passes when the flipped sign fails) |
| 177 | sign | C3.fix3.sign v5 [sign FLIPPED (must fail)]: splat nbar across the correction stage alone | 10.481445 -> 10.545973 (rises); correction max |dx|/h 0.00426 | info (not graded) | INFO |
| 178 | seedT3 | C3.seed T3 a=16: min distance of any seeded particle to any wall at t=0 | 7.1441e-4 m | >= clearance 4.4648e-4 m | PASS |
| 179 | seedT3 | C3.seed T3 a=8: min distance of any seeded particle to any wall at t=0 | 1.4290e-3 m | >= clearance 8.9297e-4 m | PASS |
| 180 | stillproof | still-water proof Gate 1 T1: fix-3 stage dx and dPE exactly 0 every step | 1800 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid 8x8x10: max|ebar_T4| 2.382e-4, 16x16x20: max|ebar_T4| 3.740e-5, 32x32x40: max|ebar_T4| 5.206e-6 | moved 0, |dx| 0, |dPE| 0 | PASS |
| 181 | stillproof | still-water proof Gate 1 T1b: fix-3 stage dx and dPE exactly 0 every step | 2400 stage calls, 912 solves; particles moved 4161024, max |dx| 0.00021492292707012665, max |dPE| 0.05347657318252885 J (912 nonzero); max cells above dead-band 0; max |target/cell| 0.017193736919599814; per grid 8x8x6: max|ebar_T4| 2.219e-2, 16x16x10: max|ebar_T4| 8.735e-3, 32x32x18: max|ebar_T4| 4.762e-4, 64x64x34: max|ebar_T4| 1.164e-3 | moved 0, |dx| 0, |dPE| 0 | FAIL |
| 182 | stillproof | fix-3 stage in Gate 1 T2 (not a still pool) | 147 stage calls, 30 solves; particles moved 122880, max |dx| 0.000009987327076872989, max |dPE| 0.000016770277213140616 J (30 nonzero); max cells above dead-band 0; max |target/cell| 0.003060011193995806; per grid 24x24x64: max|ebar_T4| 8.060e-3 | info (not graded) | INFO |
| 183 | stillproof | fix-3 stage in Gate 1 modes (not a still pool) | 0 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid  | info (not graded) | INFO |
| 184 | stillproof | fix-3 stage in Gate 1 D (not a still pool) | 0 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid  | info (not graded) | INFO |

Total graded: 84 PASS, 7 FAIL

## C3.fix3 on reverted f0220c4 (on_f0220c4/; must FAIL)
FAILS as required: T4 13.76%, no fix-3 stage, T3.mm Z=2.78 (8.57%) and Z=3.22 (8.22%).

## Gate 1 (gate1/results.md), checked before this was written: 65 graded, 64 PASS, 1 FAIL; 1 FLIP vs step 12; NOT bit-identical (56 of 65 graded rows identical)
- FLIP: T1b.E N=8 max (E-E0)/|E0| 3.925e-11 -> 1.842e-2 (FAIL).
- Changed but still passing: T1b.E N=16 -1.358e-14 -> -3.514e-4; T1b.u N=8/N=16 at the 1e-10 to 1e-9 level; T2 rows at roundoff (fix 3 fires in T2, 30 solves).
- Still-water proof (rows_stillproof.json): T1 PASS (moved 0, dPE 0; max |ebar_T4| 2.4e-4). T1b FAIL: N=8 and N=16 move particles every step (912 solves; max |dx| 2.1e-4 m at N=8; max |dPE| 5.3e-2 J). N=32 and N=64 move nothing.
- Cause: in T1b the surface lies partway through a cell. Strict-interior cells next to the partly filled top row splat nbar away from 8, which gives |ebar_T4| = 2.2e-2 (N=8) and 8.7e-3 (N=16), above the 0.005 threshold. The target is then non-zero, and the uniform shift corrects a still pool. N=32 (4.8e-4) and N=64 (1.2e-3) stay below 0.005.
