# Step 13: fix 3 v4 (ASSERTS Z 2026-10-14f)

- Code commit the runs executed at: ff8d1cd (clean tree)
- spec/ASSERTS.md md5 e11ce6c1e6d2531818712b50e7635f77; PHYSICS_SPEC.md md5 c7fb0805d6ea3bad63dd984b55b7d063
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 2 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 3 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 5.185e-4 (frame 106, m=7.9959, 27001 cells) | <= 1e-2 | PASS |
| 4 | tilted | C3.tilted_tank peak cell count, every frame | 18 (frame 52, cell [9,7,30]) | <= 16 | FAIL |
| 5 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 9.043e-5 | <= 1e-6 | FAIL |
| 6 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 9.037e-5 | <= 1e-6 | FAIL |
| 7 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.711e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.001e+2; g2p -5.590e-1; extension 1.725e-1; advect -5.958e-2; pushout 1.981e-5; densfix 8.037e-2 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 8 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 1.981e-5 J (6.460e-8 |E0|) / 1.758e-6 J / 25 of 120 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank fix3 stage: signed sum of dPE over run | 8.037e-2 J (2.621e-4 |E0|) | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 2.359e-6 / 6.291e-5; 8 of 120 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | -4.929e-2 / -3.034e-1 / 2.028e-1 (8) | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank C3.fix3 target sum |sum e - target_r| / n_r, every step | 1.937e-16 | <= 1e-12 | PASS |
| 14 | tilted | C3.tilted_tank fix3 PCG iterations (mean / max) | 24.05 / 26 | info (not graded) | INFO |
| 15 | tilted | C3.tilted_tank fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0046 / 0 of 120 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 9.210e-2 / 1.782e-1 | info (not graded) | INFO |
| 17 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.671e-7 J (-1.197e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 18 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 12 (t=0.1833 s): step dE 1.758e-6 J; top particle #258509 dE 5.248e-7 J, x0 [0.456630, 0.330313, 0.490493] m, dx [3.723e-5, 4.212e-5, 1.122e-4] m, v before [-1.834e-2, -4.820e-3, -1.259e-1] -> after [-1.834e-2, -4.820e-3, -1.259e-1] m/s | info (not graded) | INFO |
| 19 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 20 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 21 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 22 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 23 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 24 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.989, 7.992, 8.021, 7.998, 7.983 | info (not graded) | INFO |
| 25 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 26 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 27 | separation | C3.separation strict interior mean (info per section Z) | 3.102e-4 (frame 117, m=7.9975, 27000 cells) | info (not graded) | INFO |
| 28 | separation | C3.separation peak cell count (info) | 13 (frame 27, cell [31,16,31]) | info (not graded) | INFO |
| 29 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 1.505e-7 | <= 1e-6 | PASS |
| 30 | separation | C3.separation cumulative stage energy at end (J) | p2g 1.330e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.403e-1; extension 2.346e-4; advect 4.751e-4; pushout 1.389e-7; densfix -2.643e-3 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 31 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 1.389e-7 J (4.532e-10 |E0|) / 3.463e-9 J / 102 of 120 | info (not graded) | INFO |
| 32 | separation | C3.separation C3.separation anti-inflation (fix 3 on): |sum over steps of stage dPE| over 2 s | 2.643e-3 J (signed -2.643e-3 J; 8.620e-6 |E0|) | <= 1e-6 |E0| = 3.066e-4 J | FAIL |
| 33 | separation | C3.separation fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 34 | separation | C3.separation fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 2.625e-7 / 3.150e-5; 1 of 120 | info (not graded) | INFO |
| 35 | separation | C3.separation fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 2.027e-1 / 2.027e-1 / 2.027e-1 (1) | info (not graded) | INFO |
| 36 | separation | C3.separation C3.fix3 target sum |sum e - target_r| / n_r, every step | 1.272e-18 | <= 1e-12 | PASS |
| 37 | separation | C3.separation fix3 PCG iterations (mean / max) | 23.99 / 24 | info (not graded) | INFO |
| 38 | separation | C3.separation fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0029 / 0 of 120 | info (not graded) | INFO |
| 39 | separation | C3.separation max|u| at t=2 s | 2.826e-2 | < 2.215e-3 | FAIL |
| 40 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 2.672e-12 J (8.715e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 41 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 1.028e-8 J; top particle #155639 dE 2.335e-6 J, x0 [0.483924, 0.496810, 0.295144] m, dx [-1.360e-4, 0.000e+0, 4.992e-4] m, v before [-5.950e-11, -2.475e-12, 1.266e-10] -> after [-5.950e-11, -2.475e-12, 1.266e-10] m/s | info (not graded) | INFO |
| 42 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 43 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 44 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 45 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 46 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 47 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.008, 7.994, 7.999 | info (not graded) | INFO |
| 48 | t3a16 | a16 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 3 frames | 2.1431 m/s (1.0120 U_R, frame 26) | < U_R = 2.1178 m/s every frame | FAIL |
| 49 | t3a16 | a16 Ritter single-substep peak / frame-to-frame peak | 3.3394 U_R / 1.1131 U_R | info (not graded) | INFO |
| 50 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.733e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 68) |
| 51 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 278 > 0 | <= 0 every step | PASS |
| 52 | t3a16 | a16 P.res max true residual | 9.991e-9 | <= 1e-8 | PASS |
| 53 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 54 | t3a16 | a16 CFL / cap | max CFL 0.9995; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 278 | info (not graded) | INFO |
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
| 73 | t3a16 | a16 T3.mm Z=8 (T_sim 5.712, T_mean 5.69) | 0.38% | <= 8% | PASS |
| 74 | t3a16 | a16 T3.mm Z=9 (T_sim 6.221, T_mean 6.3) | 1.25% | <= 8% | PASS |
| 75 | t3a16 | a16 T3.mm Z=10 (T_sim 6.813, T_mean 6.83) | 0.24% | <= 8% | PASS |
| 76 | t3a16 | a16 T3.mm Z=11 (T_sim 7.347, T_mean 7.44) | 1.25% | <= 8% | PASS |
| 77 | t3a16 | a16 T3.mm Z=12 (T_sim 7.824, T_mean 8.08) | 3.17% | <= 8% | PASS |
| 78 | t3a16 | a16 T3.mm Z=13 (T_sim 8.358, T_mean 8.67) | 3.60% | <= 8% | PASS |
| 79 | t3a16 | a16 T3.mm Z=14 (T_sim 8.919, T_mean 9.31) | 4.20% | <= 8% | PASS |
| 80 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 1.519e-2 (frame 12, m=8.1215) | <= 1e-2 every frame | FAIL |
| 81 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 82 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -8.072e-2 / -1.020e-1 | info (not graded) | INFO |
| 83 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 6.331e-2 / 3.454e-1 | info (not graded) | INFO |
| 84 | t3a16 | a16 T4 peak count | 24 at frame 21 cell [3,13,4] (front x 10.19a) | info (not graded) | INFO |
| 85 | t3a16 | a16 T4 final histogram n:cells(Poisson(6.734)) | 1:396(78) 2:523(263) 3:471(590) 4:681(993) 5:928(1338) 6:1224(1501) 7:1389(1444) 8:1432(1216) 9:1193(910) 10:799(613) 11:420(375) 12:177(210) 13:68(109) 14:27(52) 15:3(24) 16:1(10) | info (not graded) | INFO |
| 86 | t3a16 | C3.fix3 a=16: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.1000 (stage incl. push-out 0.1071, info) | <= 0.1 | PASS |
| 87 | t3a16 | C3.fix3 a=16: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -4.359e-9 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 88 | t3a16 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a16: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 3.474e-3 J at step 228 (cum dPE 3.810e-3, PE_pack 3.359e-4) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 89 | t3a16 | C3.fix3 a=16: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 90 | t3a16 | C3.fix3 a=16: target sum, max over steps and regions of |sum e - target_r| / n_r | 4.307e-15 | <= 1e-12 every step | PASS |
| 91 | t3a16 | a16 fix3 target_r / n_r (region mean compression before dead-band): mean of per-step max / max | 3.519e-3 / 1.624e-2 | info (not graded) | INFO |
| 92 | t3a16 | a16 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 7.434e-4 / 3.395e-3 | info (not graded) | INFO |
| 93 | t3a16 | a16 front displacement caused by the correction alone in each Ritter window (W = 3 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 3); at the worst Ritter window (frame 26): total 1.072e-1 m, by correction 0.000e+0 m (0.000 h), speed 1.0120 U_R, speed minus correction 1.0120 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 94 | t3a16 | a16 fix3 PCG iterations per step (mean / max; steps solved) | 11.9 / 18; 278 of 278 | info (not graded) | INFO |
| 95 | t3a16 | a16 fix3 max |dx|/h per step (mean / max) | 0.0285 / 0.1000 | info (not graded) | INFO |
| 96 | t3a16 | a16 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 2.470e-6 / 3.967e-4 | info (not graded) | INFO |
| 97 | t3a16 | a16 fix3 fraction of steps where the cap binds | 7 of 278 = 0.025; steps 74,76,78,79,80,81,83 | info (not graded) | INFO |
| 98 | t3a16 | a16 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 3.007e-2 / 6.633e-2 | info (not graded) | INFO |
| 99 | t3a16 | a16 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 8.545e-2 / -6.236e-2 / 2.855e-1; 250 of 278 | info (not graded) | INFO |
| 100 | t3a16 | a16 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 1.325e-2 / -4.607e-1 / 1.014e+0; 95.8 of 1910.0 | info (not graded) | INFO |
| 101 | t3a16 | a16 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 3.827e-3 J, max 1.058e-4 J; sum dKE -8.678e-8 J; PE_pack 4.074e-4 J (max 2.435e-3) | info (not graded) | INFO |
| 102 | t3a16 | C3.fix3 a=16: T3.mm worst graded row no worse than fix 1 (6.94%) | 6.94% | <= 6.94% | PASS |
| 103 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -31687 vs -32454.6; column region (x<a) -7671 vs -7493.8; mean |per-step difference| 14.25 | info (not graded) | INFO |
| 104 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.22e-3 / 1.54e-1 / 6057 of 7412] [-5.00e-4 / 8.94e-2 / 13810 of 17351] [-3.52e-4 / 2.12e-2 / 20838 of 27049] | info (not graded) | INFO |
| 105 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [5.25e-4 / 4.70e-2 / 635 of 2409] [7.02e-4 / 8.65e-3 / 223 of 812] [-1.30e-3 / 1.07e-2 / 353 of 403] | info (not graded) | INFO |
| 106 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [8.89e-6 / 1.05e-1 / 3593 of 8195] [1.45e-5 / 3.68e-2 / 3773 of 8253] [1.35e-5 / 2.21e-2 / 3996 of 8248] | info (not graded) | INFO |
| 107 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,31 | f1: [7.50 7.94 8.00 8.15 8.60 8.43] total 64238; f6: [8.22 8.25 7.62 8.11 8.17 7.82] total 42769; f11: [9.74 9.09 8.36 8.19 8.02 7.90] total 24431; f16: [8.03 8.49 8.32 8.13 8.22 8.16] total 14863; f21: [8.13 7.87 8.00 7.80 7.78 0.01] total 10134; f26: [8.09 7.91 7.66 5.85 0.00 0.00] total 7554; f31: [8.13 7.79 7.11 0.00 0.00 0.00] total 5894 | info (not graded) | INFO |
| 108 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.972 / 2.972 / +0.000; 5.03% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.275 / 3.275 / +0.000; 5.31% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.499 / 4.499 / +0.000; 1.33% | Z=7: 5.140 / 5.140 / +0.000; 0.99% | Z=8: 5.712 / 5.712 / +0.000; 0.38% | Z=9: 6.221 / 6.221 / +0.000; -1.25% | Z=10: 6.813 / 6.799 / +0.014; -0.24% | Z=11: 7.347 / 7.333 / +0.014; -1.25% | Z=12: 7.824 / 7.880 / -0.056; -3.17% | Z=13: 8.358 / 8.358 / +0.000; -3.60% | Z=14: 8.919 / 8.891 / +0.028; -4.20% | info (not graded) | INFO |
| 109 | t3a16 | a16 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.50 / 4 / 11 / 4:8 5:15 6:32 7:19 8:167 9:4 10:5 11:6; f5: 7.72 / 6 / 14 / 6:81 7:26 8:114 9:2 10:6 11:11 12:11 13:4 14:1; f10: 9.46 / 0 / 22 / 0:9 1:13 2:18 3:19 4:13 5:5 6:21 7:9 8:8 9:10 10:10 11:14 12:12 13:9 14:14 15:21 16:19 17:14 18:16 19:1 22:1; f15: 8.40 / 1 / 17 / 1:2 2:2 3:7 4:10 5:16 6:25 7:33 8:32 9:38 10:37 11:25 12:13 13:8 14:3 15:4 17:1; f20: 8.23 / 1 / 13 / 1:1 2:1 3:4 4:17 5:21 6:25 7:28 8:36 9:37 10:32 11:30 12:11 13:13; f25: 8.01 / 2 / 15 / 2:4 3:2 4:14 5:17 6:37 7:34 8:39 9:40 10:29 11:19 12:13 13:5 14:1 15:2; f31: 8.13 / 1 / 14 / 1:1 2:5 3:5 4:11 5:18 6:27 7:26 8:52 9:29 10:35 11:25 12:12 13:8 14:2 | info (not graded) | INFO |
| 110 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 2.0574 m/s (0.9715 U_R, frame 25) | < U_R = 2.1178 m/s every frame | PASS |
| 111 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.4167 U_R | info (not graded) | INFO |
| 112 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.730e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 27) |
| 113 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 114 | t3a8 | a8 P.res max true residual | 9.984e-9 | <= 1e-8 | PASS |
| 115 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 116 | t3a8 | a8 CFL / cap | max CFL 0.9976; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 117 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 118 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 119 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 120 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 121 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 122 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.951, T_mean 1.83) | 6.60% | <= 8% | PASS |
| 123 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 124 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 125 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 126 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 127 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 128 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 129 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 130 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 131 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 132 | t3a8 | a8 T3.mm Z=5 (T_sim 4.060, T_mean 4.02) | 0.99% | <= 8% | PASS |
| 133 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 134 | t3a8 | a8 T3.mm Z=7 (T_sim 5.233, T_mean 5.09) | 2.82% | <= 8% | PASS |
| 135 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 136 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 137 | t3a8 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 138 | t3a8 | a8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 139 | t3a8 | a8 T3.mm Z=12 (T_sim 8.059, T_mean 8.08) | 0.26% | <= 8% | PASS |
| 140 | t3a8 | a8 T3.mm Z=13 (T_sim 8.651, T_mean 8.67) | 0.22% | <= 8% | PASS |
| 141 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 142 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 4.671e-2 (frame 31, m=8.3737) | <= 1e-2 every frame | FAIL |
| 143 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 144 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -6.995e-2 / -1.068e-1 | info (not graded) | INFO |
| 145 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 7.507e-2 / 3.268e-1 | info (not graded) | INFO |
| 146 | t3a8 | a8 T4 peak count | 21 at frame 15 cell [3,4,0] (front x 6.75a) | info (not graded) | INFO |
| 147 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.638)) | 1:123(29) 2:216(83) 3:113(155) 4:111(219) 5:113(246) 6:167(232) 7:166(187) 8:159(131) 9:114(82) 10:97(46) 11:45(24) 12:16(11) 13:12(5) 14:1(2) | info (not graded) | INFO |
| 148 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 149 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.660e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 150 | t3a8 | C3.fix3 a=8: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.0416 (stage incl. push-out 0.0466, info) | <= 0.1 | PASS |
| 151 | t3a8 | C3.fix3 a=8: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -4.636e-8 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 152 | t3a8 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a8: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 2.323e-3 J at step 90 (cum dPE 2.889e-3, PE_pack 5.653e-4) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 153 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 154 | t3a8 | C3.fix3 a=8: target sum, max over steps and regions of |sum e - target_r| / n_r | 3.850e-16 | <= 1e-12 every step | PASS |
| 155 | t3a8 | a8 fix3 target_r / n_r (region mean compression before dead-band): mean of per-step max / max | 6.798e-3 / 2.449e-2 | info (not graded) | INFO |
| 156 | t3a8 | a8 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 5.900e-3 / 3.837e-2 | info (not graded) | INFO |
| 157 | t3a8 | a8 front displacement caused by the correction alone in each Ritter window (W = 5 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 5); at the worst Ritter window (frame 25): total 1.714e-1 m, by correction 0.000e+0 m (0.000 h), speed 0.9715 U_R, speed minus correction 0.9715 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 158 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 9.1 / 13; 159 of 159 | info (not graded) | INFO |
| 159 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0146 / 0.0416 | info (not graded) | INFO |
| 160 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 161 | t3a8 | a8 fix3 fraction of steps where the cap binds | 0 of 159 = 0.000 | info (not graded) | INFO |
| 162 | t3a8 | a8 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 6.610e-2 / 2.037e-1 | info (not graded) | INFO |
| 163 | t3a8 | a8 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 1.055e-1 / -9.415e-2 / 2.267e-1; 134 of 159 | info (not graded) | INFO |
| 164 | t3a8 | a8 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 4.333e-3 / -3.902e-1 / 8.468e-1; 24.0 of 257.6 | info (not graded) | INFO |
| 165 | t3a8 | a8 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 2.987e-3 J, max 1.689e-4 J; sum dKE -2.514e-7 J; PE_pack 1.054e-3 J (max 2.747e-3) | info (not graded) | INFO |
| 166 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 167 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.951 / 1.941 / +0.009; 6.60% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.868 / 2.868 / +0.000; 8.22% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 4.060 / 3.998 / +0.062; 0.99% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.233 / 5.254 / -0.021; 2.82% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.335 / 6.335 / +0.000; 0.55% | Z=10: 6.901 / 6.901 / +0.000; 1.04% | Z=11: 7.467 / 7.467 / +0.000; 0.36% | Z=12: 8.059 / 8.033 / +0.026; -0.26% | Z=13: 8.651 / 8.548 / +0.103; -0.22% | Z=14: 9.114 / 9.114 / +0.000; -2.10% | info (not graded) | INFO |
| 168 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -7050 vs -7993.1; column region (x<a) -1900 vs -1785.7; mean |per-step difference| 11.04 | info (not graded) | INFO |
| 169 | t3a8 | a8 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.56 / 4 / 9 / 4:1 5:3 6:7 7:5 8:44 9:4; f5: 7.81 / 6 / 12 / 6:16 7:9 8:31 11:3 12:5; f10: 9.11 / 1 / 16 / 1:2 2:9 3:1 4:8 5:3 6:1 9:3 10:5 11:4 12:5 13:3 14:14 15:5 16:1; f15: 9.06 / 1 / 21 / 1:2 2:7 3:3 4:7 5:2 6:8 7:3 8:1 9:7 10:1 12:2 13:3 14:2 15:3 16:3 17:2 18:5 19:2 21:1; f20: 7.81 / 1 / 13 / 1:2 2:2 3:2 4:4 5:6 6:3 7:8 8:6 9:12 10:8 11:4 12:3 13:4; f25: 8.13 / 5 / 13 / 5:3 6:14 7:7 8:20 9:7 10:3 11:4 12:3 13:3; f32: 8.25 / 5 / 13 / 5:3 6:8 7:10 8:17 9:11 10:8 11:5 12:1 13:1 | info (not graded) | INFO |
| 170 | sign | C3.fix3.sign v4 [production sign]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 16/16 outward (min dx.r 1.844e-6 m^2); splat nbar 10.481445 -> 10.409254 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 3.553e-18) | all outward AND splat nbar drops | PASS (test verdict PASS) |
| 171 | sign | C3.fix3.sign v4 [production sign]: splat nbar across the correction stage alone | 10.481445 -> 10.409254 (drops); correction max |dx|/h 0.00584 | info (not graded) | INFO |
| 172 | sign | C3.fix3.sign v4 [sign FLIPPED (must fail)]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 0/16 outward (min dx.r -6.603e-6 m^2); splat nbar 10.481445 -> 10.550085 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 3.553e-18) | all outward AND splat nbar drops | PASS (test verdict FAIL; row passes when the flipped sign fails) |
| 173 | sign | C3.fix3.sign v4 [sign FLIPPED (must fail)]: splat nbar across the correction stage alone | 10.481445 -> 10.550085 (rises); correction max |dx|/h 0.00584 | info (not graded) | INFO |
| 174 | seedT3 | C3.seed T3 a=16: min distance of any seeded particle to any wall at t=0 | 7.1441e-4 m | >= clearance 4.4648e-4 m | PASS |
| 175 | seedT3 | C3.seed T3 a=8: min distance of any seeded particle to any wall at t=0 | 1.4290e-3 m | >= clearance 8.9297e-4 m | PASS |

Total graded: 77 PASS, 10 FAIL

## C3.fix3 on reverted f0220c4 (on_f0220c4/, src f0220c4 + step-13 runner; must FAIL)
FAILS as required: T4 13.76%, no fix-3 stage, T3.mm Z=2.78 (8.57%) and Z=3.22 (8.22%).

## Gate 1 (gate1/results.md): 65 graded, 65 PASS, 0 flips vs step12_fix3v3/gate1.

## Sub-cell Ritter (step13_subcell_proof/)
The proof FAILS at both resolutions and both speeds (worst 2.9e-2; best case 3.2e-3, against 1e-3). Integer counts limit the resolution to h/8, giving a bound of 4e-3 to 1e-2 over one W window. The estimator is therefore NOT used for grading, and no sub-cell re-grade was done.

## Ritter re-grade across codes (old estimator; the only valid one)
| code | a=16 | a=8 |
|---|---|---|
| fix 1 (step7) | 0.9782 | 0.9108 |
| fix 2 (step8) | 1.0120 | 1.0120 |
| fix1 revert (step9) | 0.9782 | 0.9108 |
| fix3 v2 (step11) | 1.0120 | 0.9715 |
| fix3 v3 (step12) | 1.0120 | 0.9715 |
| fix3 v4 (step13) | 1.0120 | 0.9715 |
| v4 code, fix 3 OFF (info_fix3off) | 0.9782 | 0.9108 |

a=16 is still above 1.0 with fix 3 on, so the fix-3-off comparison ran. With fix 3 off the a=16 Ritter value is 0.9782. The correction moves the front by exactly 0 in every window, so the effect is indirect: the changed particle distribution alters the flow. 2.1431 m/s is 10 h per 3 frames, one quantization level above the 9 h of the fix-1 value.
