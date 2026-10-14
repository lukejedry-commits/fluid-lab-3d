# Step 12: fix 3 v3 (ASSERTS Z 2026-10-14e)

- Code commit the runs executed at: 856d434 (clean tree)
- spec/ASSERTS.md md5 4aa58d7567eb230b48dec3ed647e240d; PHYSICS_SPEC.md md5 530fdc738702eee27cd8ed9a20846951
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
| 13 | tilted | C3.tilted_tank C3.fix3 volume-neutral source |sum e| / region cell count, every step | 3.707e-18 | <= 1e-12 | PASS |
| 14 | tilted | C3.tilted_tank fix3 PCG iterations (mean / max) | 1.28 / 23 | info (not graded) | INFO |
| 15 | tilted | C3.tilted_tank fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0029 / 0 of 120 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.077e-1 / 2.007e-1 | info (not graded) | INFO |
| 17 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.671e-7 J (-1.197e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 18 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 12 (t=0.1833 s): step dE 1.813e-6 J; top particle #258509 dE 5.331e-7 J, x0 [0.456575, 0.330470, 0.490562] m, dx [4.247e-5, 4.203e-5, 1.140e-4] m, v before [-1.843e-2, -4.191e-3, -1.273e-1] -> after [-1.843e-2, -4.191e-3, -1.273e-1] m/s | info (not graded) | INFO |
| 19 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 20 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 21 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 22 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 23 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 24 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.993, 7.989, 8.028, 8.003, 7.977 | info (not graded) | INFO |
| 25 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 26 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 27 | separation | C3.separation strict interior mean (info per section Z) | 2.917e-4 (frame 59, m=7.9977, 27000 cells) | info (not graded) | INFO |
| 28 | separation | C3.separation peak cell count (info) | 13 (frame 27, cell [31,16,31]) | info (not graded) | INFO |
| 29 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 2.044e-6 | <= 1e-6 | FAIL |
| 30 | separation | C3.separation cumulative stage energy at end (J) | p2g 1.375e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.409e-1; extension 2.431e-4; advect 4.681e-4; pushout 1.590e-7; densfix 9.498e-5 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 31 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 1.590e-7 J (5.187e-10 |E0|) / 5.505e-9 J / 102 of 120 | info (not graded) | INFO |
| 32 | separation | C3.separation C3.separation anti-inflation (fix 3 on): |sum over steps of stage dPE| over 2 s | 9.498e-5 J (signed 9.498e-5 J; 3.098e-7 |E0|) | <= 1e-6 |E0| = 3.066e-4 J | PASS |
| 33 | separation | C3.separation fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 34 | separation | C3.separation fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 2.625e-7 / 3.150e-5; 1 of 120 | info (not graded) | INFO |
| 35 | separation | C3.separation fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 2.027e-1 / 2.027e-1 / 2.027e-1 (1) | info (not graded) | INFO |
| 36 | separation | C3.separation C3.fix3 volume-neutral source |sum e| / region cell count, every step | 7.222e-19 | <= 1e-12 | PASS |
| 37 | separation | C3.separation fix3 PCG iterations (mean / max) | 0.19 / 23 | info (not graded) | INFO |
| 38 | separation | C3.separation fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0029 / 0 of 120 | info (not graded) | INFO |
| 39 | separation | C3.separation max|u| at t=2 s | 1.793e-2 | < 2.215e-3 | FAIL |
| 40 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 2.672e-12 J (8.715e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 41 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 9.820e-9 J; top particle #155639 dE 2.335e-6 J, x0 [0.483924, 0.496810, 0.295144] m, dx [-1.360e-4, 0.000e+0, 4.992e-4] m, v before [-5.950e-11, -2.475e-12, 1.266e-10] -> after [-5.950e-11, -2.475e-12, 1.266e-10] m/s | info (not graded) | INFO |
| 42 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 43 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 44 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 45 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 46 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 47 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.008, 7.994, 8.000 | info (not graded) | INFO |
| 48 | t3a16 | a16 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 3 frames | 2.1431 m/s (1.0120 U_R, frame 30) | < U_R = 2.1178 m/s every frame | FAIL |
| 49 | t3a16 | a16 Ritter single-substep peak / frame-to-frame peak | 3.3394 U_R / 1.1131 U_R | info (not graded) | INFO |
| 50 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 17) |
| 51 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 277 > 0 | <= 0 every step | PASS |
| 52 | t3a16 | a16 P.res max true residual | 9.944e-9 | <= 1e-8 | PASS |
| 53 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 54 | t3a16 | a16 CFL / cap | max CFL 0.9985; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 277 | info (not graded) | INFO |
| 55 | t3a16 | a16 T3.mm shift | 0.3846 | info (not graded) | INFO |
| 56 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 57 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 58 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 59 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 60 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 61 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 62 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 63 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 64 | t3a16 | a16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 65 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 66 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.972, T_mean 2.83) | 5.03% | <= 8% | PASS |
| 67 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 68 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.275, T_mean 3.11) | 5.31% | <= 8% | PASS |
| 69 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 70 | t3a16 | a16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 71 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.499, T_mean 4.44) | 1.33% | <= 8% | PASS |
| 72 | t3a16 | a16 T3.mm Z=7 (T_sim 5.140, T_mean 5.09) | 0.99% | <= 8% | PASS |
| 73 | t3a16 | a16 T3.mm Z=8 (T_sim 5.696, T_mean 5.69) | 0.11% | <= 8% | PASS |
| 74 | t3a16 | a16 T3.mm Z=9 (T_sim 6.252, T_mean 6.3) | 0.76% | <= 8% | PASS |
| 75 | t3a16 | a16 T3.mm Z=10 (T_sim 6.777, T_mean 6.83) | 0.78% | <= 8% | PASS |
| 76 | t3a16 | a16 T3.mm Z=11 (T_sim 7.319, T_mean 7.44) | 1.63% | <= 8% | PASS |
| 77 | t3a16 | a16 T3.mm Z=12 (T_sim 7.852, T_mean 8.08) | 2.82% | <= 8% | PASS |
| 78 | t3a16 | a16 T3.mm Z=13 (T_sim 8.395, T_mean 8.67) | 3.17% | <= 8% | PASS |
| 79 | t3a16 | a16 T3.mm Z=14 (T_sim 8.891, T_mean 9.31) | 4.50% | <= 8% | PASS |
| 80 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 9.961e-2 (frame 30, m=8.7969) | <= 1e-2 every frame | FAIL |
| 81 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 82 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -1.144e-1 / -1.286e-1 | info (not graded) | INFO |
| 83 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 7.184e-2 / 4.532e-1 | info (not graded) | INFO |
| 84 | t3a16 | a16 T4 peak count | 23 at frame 12 cell [4,11,0] (front x 5.19a) | info (not graded) | INFO |
| 85 | t3a16 | a16 T4 final histogram n:cells(Poisson(7.159)) | 1:364(51) 2:489(183) 3:450(436) 4:671(780) 5:695(1117) 6:828(1332) 7:1039(1363) 8:1196(1219) 9:1252(970) 10:1010(694) 11:635(452) 12:347(270) 13:137(149) 14:38(76) 15:2(36) 16:1(16) | info (not graded) | INFO |
| 86 | t3a16 | C3.fix3 a=16: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.1000 (stage incl. push-out 0.1021, info) | <= 0.1 | PASS |
| 87 | t3a16 | C3.fix3 a=16: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -3.373e-9 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 88 | t3a16 | C3.fix3 a=16: cum stage dPE <= PE_pack(t) + 1e-6|E0| every step (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 9.329e-4 J at step 1 (cum dPE 0.000e+0, PE_pack -9.329e-4) | <= 1e-6|E0| = 2.093e-7 J | FAIL |
| 89 | t3a16 | C3.fix3 a=16: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 90 | t3a16 | C3.fix3 a=16: volume-neutral source, max over steps and regions of |sum e| / region cell count | 1.540e-15 | <= 1e-12 every step | PASS |
| 91 | t3a16 | a16 fix3 region-mean shift subtracted (max |mean e| over regions, per step: mean / max) | 6.835e-3 / 2.030e-2 | info (not graded) | INFO |
| 92 | t3a16 | a16 front displacement caused by the correction alone in each Ritter window (W = 3 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 3); at the worst Ritter window (frame 30): total 1.072e-1 m, by correction 0.000e+0 m (0.000 h), speed 1.0120 U_R, speed minus correction 1.0120 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 93 | t3a16 | a16 fix3 PCG iterations per step (mean / max; steps solved) | 10.1 / 17; 250 of 277 | info (not graded) | INFO |
| 94 | t3a16 | a16 fix3 max |dx|/h per step (mean / max) | 0.0280 / 0.1000 | info (not graded) | INFO |
| 95 | t3a16 | a16 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 6.104e-8 / 1.526e-5 | info (not graded) | INFO |
| 96 | t3a16 | a16 fix3 fraction of steps where the cap binds | 1 of 277 = 0.004; steps 79 | info (not graded) | INFO |
| 97 | t3a16 | a16 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 4.166e-2 / 8.237e-2 | info (not graded) | INFO |
| 98 | t3a16 | a16 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 1.490e-1 / 3.478e-2 / 3.249e-1; 250 of 277 | info (not graded) | INFO |
| 99 | t3a16 | a16 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 6.209e-2 / -4.319e-1 / 1.169e+0; 122.2 of 1871.4 | info (not graded) | INFO |
| 100 | t3a16 | a16 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 1.727e-3 J, max 5.624e-5 J; sum dKE -5.200e-8 J; PE_pack 1.474e-3 J (max 3.762e-3) | info (not graded) | INFO |
| 101 | t3a16 | C3.fix3 a=16: T3.mm worst graded row no worse than fix 1 (6.94%) | 6.94% | <= 6.94% | PASS |
| 102 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -33783 vs -32769.7; column region (x<a) -8006 vs -7658.5; mean |per-step difference| 14.98 | info (not graded) | INFO |
| 103 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.26e-3 / 1.48e-1 / 6105 of 7484] [-4.86e-4 / 4.00e-2 / 14452 of 18276] [-3.52e-4 / 1.86e-2 / 22254 of 29025] | info (not graded) | INFO |
| 104 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [6.73e-4 / 5.13e-2 / 642 of 2424] [5.96e-4 / 1.57e-2 / 240 of 834] [-1.52e-3 / 1.04e-2 / 327 of 384] | info (not graded) | INFO |
| 105 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [1.09e-5 / 8.93e-2 / 3663 of 8196] [1.08e-5 / 4.50e-2 / 3747 of 8238] [2.24e-5 / 1.90e-2 / 3792 of 8237] | info (not graded) | INFO |
| 106 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,31 | f1: [7.50 7.93 8.00 8.15 8.60 8.43] total 64236; f6: [8.23 8.25 7.61 8.11 8.15 7.82] total 42759; f11: [9.84 9.08 8.69 8.41 8.34 8.28] total 24527; f16: [8.28 8.54 8.46 8.68 8.96 9.00] total 14958; f21: [8.26 8.02 8.13 8.37 6.70 0.00] total 10103; f26: [8.09 8.17 8.03 4.52 0.00 0.00] total 7375; f31: [8.23 7.84 6.02 0.00 0.00 0.00] total 5656 | info (not graded) | INFO |
| 107 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.972 / 2.972 / +0.000; 5.03% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.275 / 3.275 / +0.000; 5.31% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.499 / 4.499 / +0.000; 1.33% | Z=7: 5.140 / 5.140 / +0.000; 0.99% | Z=8: 5.696 / 5.712 / -0.015; 0.11% | Z=9: 6.252 / 6.221 / +0.031; -0.76% | Z=10: 6.777 / 6.799 / -0.022; -0.78% | Z=11: 7.319 / 7.333 / -0.014; -1.63% | Z=12: 7.852 / 7.880 / -0.028; -2.82% | Z=13: 8.395 / 8.358 / +0.037; -3.17% | Z=14: 8.891 / 8.891 / -0.000; -4.50% | info (not graded) | INFO |
| 108 | t3a16 | a16 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.50 / 4 / 11 / 4:7 5:16 6:32 7:20 8:166 9:4 10:5 11:6; f5: 7.72 / 6 / 14 / 6:82 7:26 8:112 9:3 10:6 11:11 12:11 13:3 14:2; f10: 9.72 / 0 / 20 / 0:6 1:10 2:10 3:16 4:13 5:14 6:12 7:8 8:15 9:18 10:16 11:12 12:13 13:14 14:25 15:16 16:11 17:8 18:16 19:2 20:1; f15: 8.41 / 0 / 19 / 0:1 1:4 2:11 3:12 4:9 5:10 6:24 7:24 8:30 9:31 10:28 11:24 12:24 13:11 14:6 15:3 16:1 17:1 18:1 19:1; f20: 8.24 / 1 / 15 / 1:1 2:3 3:8 4:13 5:17 6:22 7:31 8:49 9:29 10:25 11:25 12:20 13:9 14:3 15:1; f25: 8.14 / 1 / 15 / 1:4 2:6 3:3 4:15 5:15 6:26 7:34 8:32 9:39 10:31 11:22 12:14 13:8 14:6 15:1; f31: 8.23 / 1 / 16 / 1:1 2:4 3:3 4:11 5:18 6:32 7:31 8:35 9:39 10:34 11:20 12:15 13:8 14:4 16:1 | info (not graded) | INFO |
| 109 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 2.0574 m/s (0.9715 U_R, frame 29) | < U_R = 2.1178 m/s every frame | PASS |
| 110 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.4167 U_R | info (not graded) | INFO |
| 111 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 20) |
| 112 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 113 | t3a8 | a8 P.res max true residual | 9.929e-9 | <= 1e-8 | PASS |
| 114 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 115 | t3a8 | a8 CFL / cap | max CFL 0.9927; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 116 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 117 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 118 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 119 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 120 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 121 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 122 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 123 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 124 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 125 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 126 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 127 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 128 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 129 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 130 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 131 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 132 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 133 | t3a8 | a8 T3.mm Z=7 (T_sim 5.233, T_mean 5.09) | 2.82% | <= 8% | PASS |
| 134 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 135 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 136 | t3a8 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 137 | t3a8 | a8 T3.mm Z=11 (T_sim 7.493, T_mean 7.44) | 0.71% | <= 8% | PASS |
| 138 | t3a8 | a8 T3.mm Z=12 (T_sim 8.085, T_mean 8.08) | 0.06% | <= 8% | PASS |
| 139 | t3a8 | a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 140 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 141 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 8.513e-2 (frame 29, m=8.6810) | <= 1e-2 every frame | FAIL |
| 142 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 143 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -7.935e-2 / -1.123e-1 | info (not graded) | INFO |
| 144 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 9.058e-2 / 3.417e-1 | info (not graded) | INFO |
| 145 | t3a8 | a8 T4 peak count | 21 at frame 14 cell [3,1,0] (front x 6.13a) | info (not graded) | INFO |
| 146 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.872)) | 1:122(23) 2:175(68) 3:89(133) 4:112(195) 5:115(229) 6:153(224) 7:170(188) 8:146(138) 9:125(90) 10:97(53) 11:51(28) 12:29(14) 13:6(6) 14:3(3) 15:2(1) | info (not graded) | INFO |
| 147 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 148 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.675e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 149 | t3a8 | C3.fix3 a=8: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.0397 (stage incl. push-out 0.0397, info) | <= 0.1 | PASS |
| 150 | t3a8 | C3.fix3 a=8: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -1.802e-8 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 151 | t3a8 | C3.fix3 a=8: cum stage dPE <= PE_pack(t) + 1e-6|E0| every step (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 1.162e-3 J at step 2 (cum dPE 0.000e+0, PE_pack -1.162e-3) | <= 1e-6|E0| = 2.093e-7 J | FAIL |
| 152 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 153 | t3a8 | C3.fix3 a=8: volume-neutral source, max over steps and regions of |sum e| / region cell count | 1.445e-16 | <= 1e-12 every step | PASS |
| 154 | t3a8 | a8 fix3 region-mean shift subtracted (max |mean e| over regions, per step: mean / max) | 1.138e-2 / 3.745e-2 | info (not graded) | INFO |
| 155 | t3a8 | a8 front displacement caused by the correction alone in each Ritter window (W = 5 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 5); at the worst Ritter window (frame 29): total 1.715e-1 m, by correction 0.000e+0 m (0.000 h), speed 0.9715 U_R, speed minus correction 0.9715 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 156 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 7.2 / 12; 136 of 159 | info (not graded) | INFO |
| 157 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0142 / 0.0397 | info (not graded) | INFO |
| 158 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 159 | t3a8 | a8 fix3 fraction of steps where the cap binds | 0 of 159 = 0.000 | info (not graded) | INFO |
| 160 | t3a8 | a8 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 7.444e-2 / 1.647e-1 | info (not graded) | INFO |
| 161 | t3a8 | a8 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 1.391e-1 / -2.010e-1 / 2.934e-1; 136 of 159 | info (not graded) | INFO |
| 162 | t3a8 | a8 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 2.816e-2 / -3.560e-1 / 9.428e-1; 25.7 of 240.7 | info (not graded) | INFO |
| 163 | t3a8 | a8 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 1.485e-3 J, max 8.592e-5 J; sum dKE -7.799e-8 J; PE_pack 1.459e-3 J (max 3.117e-3) | info (not graded) | INFO |
| 164 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 165 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.941 / 1.941 / +0.000; 6.09% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.868 / 2.868 / +0.000; 8.22% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 3.998 / 3.998 / +0.000; -0.54% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.233 / 5.254 / -0.021; 2.82% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.335 / 6.335 / +0.000; 0.55% | Z=10: 6.901 / 6.901 / +0.000; 1.04% | Z=11: 7.493 / 7.467 / +0.026; 0.71% | Z=12: 8.085 / 8.033 / +0.051; 0.06% | Z=13: 8.548 / 8.548 / +0.000; -1.41% | Z=14: 9.114 / 9.114 / +0.000; -2.10% | info (not graded) | INFO |
| 166 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -6976 vs -8021.9; column region (x<a) -1947 vs -1806.2; mean |per-step difference| 11.45 | info (not graded) | INFO |
| 167 | t3a8 | a8 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.56 / 4 / 9 / 4:1 5:3 6:7 7:5 8:44 9:4; f5: 7.80 / 6 / 12 / 6:16 7:10 8:30 11:3 12:5; f10: 9.33 / 0 / 17 / 0:2 1:2 2:5 3:4 4:3 5:5 6:1 8:4 9:3 10:5 11:3 12:4 13:1 14:9 15:8 16:4 17:1; f15: 9.28 / 1 / 21 / 1:3 2:6 3:2 4:7 5:7 6:4 7:6 8:4 10:1 12:1 13:2 14:1 15:2 16:5 17:6 19:4 20:1 21:2; f20: 7.77 / 2 / 14 / 2:3 3:5 4:5 5:3 6:4 7:8 8:8 9:10 10:4 11:5 12:6 13:2 14:1; f25: 8.06 / 4 / 14 / 4:3 5:4 6:8 7:13 8:10 9:11 10:7 11:3 12:3 13:1 14:1; f32: 8.05 / 4 / 12 / 4:1 5:2 6:9 7:10 8:15 9:16 10:9 11:1 12:1 | info (not graded) | INFO |
| 168 | sign | C3.fix3.sign v3 [production sign]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 16/16 outward (min dx.r 2.496e-6 m^2); splat nbar 10.481445 -> 10.417942 (cell count 16 -> 16; above dead-band 1; PCG 9; neutral 1.693e-18) | all outward AND splat nbar drops | PASS (test verdict PASS) |
| 169 | sign | C3.fix3.sign v3 [production sign]: splat nbar across the correction stage alone | 10.481445 -> 10.417942 (drops); correction max |dx|/h 0.00326 | info (not graded) | INFO |
| 170 | sign | C3.fix3.sign v3 [sign FLIPPED (must fail)]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 0/16 outward (min dx.r -4.179e-6 m^2); splat nbar 10.481445 -> 10.541853 (cell count 16 -> 16; above dead-band 1; PCG 9; neutral 1.693e-18) | all outward AND splat nbar drops | PASS (test verdict FAIL; row passes when the flipped sign fails) |
| 171 | sign | C3.fix3.sign v3 [sign FLIPPED (must fail)]: splat nbar across the correction stage alone | 10.481445 -> 10.541853 (rises); correction max |dx|/h 0.00326 | info (not graded) | INFO |
| 172 | seedT3 | C3.seed T3 a=16: min distance of any seeded particle to any wall at t=0 | 7.1441e-4 m | >= clearance 4.4648e-4 m | PASS |
| 173 | seedT3 | C3.seed T3 a=8: min distance of any seeded particle to any wall at t=0 | 1.4290e-3 m | >= clearance 8.9297e-4 m | PASS |

Total graded: 80 PASS, 9 FAIL

## C3.fix3 on reverted f0220c4 (src f0220c4 + step-12 runner in a worktree; must FAIL)

| # | Check | Measured | Threshold | Result |
|---|---|---|---|---|
| 1 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 1.9288 m/s (0.9108 U_R, frame 24) | < U_R = 2.1178 m/s every frame | PASS |
| 2 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS |
| 3 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 4 | a8 P.res max true residual | 9.929e-9 | <= 1e-8 | PASS |
| 5 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 6 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 7 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 8 | a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 9 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 10 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 11 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 12 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 13 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 14 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 15 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 16 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 17 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 18 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 19 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 20 | a8 T3.mm Z=7 (T_sim 5.254, T_mean 5.09) | 3.22% | <= 8% | PASS |
| 21 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 22 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 23 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 24 | a8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 25 | a8 T3.mm Z=12 (T_sim 8.033, T_mean 8.08) | 0.58% | <= 8% | PASS |
| 26 | a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 27 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 28 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 1.376e-1 (frame 27, m=9.1009) | <= 1e-2 every frame | FAIL |
| 29 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 30 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 31 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.659e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 32 | C3.fix3 a=8: density-correction stage present | no density correction in this code | present (fix 3) | FAIL |
| 33 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |

Verdict on f0220c4: C3.fix3 FAILS as required (T4 13.76%, fix-3 stage absent, T3.mm Z=2.78/3.22).

## Gate 1 (gate1/results.md): 65 graded, 65 PASS, 0 flips vs step11_fix3v2/gate1.

## Notes
- The PE_pack row fails at step 1 (a=16) and step 2 (a=8), where cum stage dPE = 0 (no correction yet): PE_pack(t) = [PE_uni - PE_act](t) - (t=0) goes negative from flow-driven repacking alone (-9.3e-4 J / -1.16e-3 J), far beyond 1e-6|E0| = 2.1e-7 J. The bound as written can fail with no correction; needs a ruling.
- Front displacement by correction alone is exactly 0 in every window (front is cell-quantised: >=4 particles in the bottom-layer cell, median over y; correction moves <= 0.1 h and is ~0 near air-adjacent front cells).
- a=16 T4 now FAILS (9.96%; v2 0.91%). a=8 T4 FAILS (8.51%; v2 4.37%). Info-only alpha=0.2 run (info_alpha0.2/): a=8 T4 7.12%, still FAIL.
- a=16 Ritter 1.0120 U_R unchanged from v2, with zero front displacement from the correction.
