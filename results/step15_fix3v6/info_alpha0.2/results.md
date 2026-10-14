# INFO ONLY alpha=0.2 sweep (Z 2026-10-14j); frozen alpha stays 0.1

- Code commit the runs executed at: 1e6089c, alpha=0.2 INFO ONLY (clean tree)
- spec/ASSERTS.md md5 b9ac9edd23749b02138f11a7fba1c0db; PHYSICS_SPEC.md md5 d60d1fe06924e6da2b208bb53e7d50c0
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 2 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 3 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 6.238e-4 (frame 77, m=8.0050, 27251 cells) | <= 1e-2 | PASS |
| 4 | tilted | C3.tilted_tank peak cell count, every frame | 17 (frame 52, cell [9,7,30]) | <= 16 | FAIL |
| 5 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 0.000e+0 | <= 1e-6 | PASS |
| 6 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 0.000e+0 | <= 1e-6 | PASS |
| 7 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.665e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.001e+2; g2p -5.553e-1; extension 1.701e-1; advect -5.948e-2; pushout 2.053e-5; densfix 6.725e-4 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 8 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 2.053e-5 J (6.694e-8 |E0|) / 1.813e-6 J / 32 of 120 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank fix3 stage: signed sum of dPE over run | 6.725e-4 J (2.193e-6 |E0|) | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 1.309e-6 / 3.150e-5; 5 of 120 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 4.005e-2 / -2.018e-1 / 2.028e-1 (5) | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank fix3 ebar_T4 max |.| / steps with nonzero target | 5.317e-4 / 0 of 120 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank C3.fix3 target sum |sum e - target_r| / n_r, every step | 2.454e-18 | <= 1e-12 | PASS |
| 15 | tilted | C3.tilted_tank fix3 PCG iterations (mean / max) | 0.94 / 23 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0076 / 0 of 120 | info (not graded) | INFO |
| 17 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.049e-1 / 2.007e-1 | info (not graded) | INFO |
| 18 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.671e-7 J (-1.197e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 19 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 12 (t=0.1833 s): step dE 1.813e-6 J; top particle #258509 dE 5.330e-7 J, x0 [0.456575, 0.330469, 0.490560] m, dx [4.247e-5, 4.204e-5, 1.139e-4] m, v before [-1.844e-2, -4.204e-3, -1.274e-1] -> after [-1.844e-2, -4.204e-3, -1.274e-1] m/s | info (not graded) | INFO |
| 20 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 21 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 22 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 23 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 24 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 25 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.993, 7.990, 8.027, 8.003, 7.978 | info (not graded) | INFO |
| 26 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 27 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 28 | separation | C3.separation strict interior mean (info per section Z) | 2.963e-4 (frame 119, m=7.9976, 27000 cells) | info (not graded) | INFO |
| 29 | separation | C3.separation peak cell count (info) | 13 (frame 27, cell [31,16,31]) | info (not graded) | INFO |
| 30 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 2.311e-6 | <= 1e-6 | FAIL |
| 31 | separation | C3.separation cumulative stage energy at end (J) | p2g 1.408e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.410e-1; extension 2.521e-4; advect 3.846e-4; pushout 1.605e-7; densfix 1.900e-4 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 32 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 1.605e-7 J (5.237e-10 |E0|) / 5.439e-9 J / 104 of 120 | info (not graded) | INFO |
| 33 | separation | C3.separation C3.separation anti-inflation (fix 3 on): |sum over steps of stage dPE| over 2 s | 1.900e-4 J (signed 1.900e-4 J; 6.196e-7 |E0|) | <= 1e-6 |E0| = 3.066e-4 J | PASS |
| 34 | separation | C3.separation fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 35 | separation | C3.separation fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 2.625e-7 / 3.150e-5; 1 of 120 | info (not graded) | INFO |
| 36 | separation | C3.separation fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 2.027e-1 / 2.027e-1 / 2.027e-1 (1) | info (not graded) | INFO |
| 37 | separation | C3.separation fix3 ebar_T4 max |.| / steps with nonzero target | 3.268e-4 / 0 of 120 | info (not graded) | INFO |
| 38 | separation | C3.separation C3.fix3 target sum |sum e - target_r| / n_r, every step | 7.455e-19 | <= 1e-12 | PASS |
| 39 | separation | C3.separation fix3 PCG iterations (mean / max) | 0.19 / 23 | info (not graded) | INFO |
| 40 | separation | C3.separation fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0058 / 0 of 120 | info (not graded) | INFO |
| 41 | separation | C3.separation max|u| at t=2 s | 2.797e-2 | < 2.215e-3 | FAIL |
| 42 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 2.672e-12 J (8.715e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 43 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 1.964e-8 J; top particle #155639 dE 2.335e-6 J, x0 [0.483924, 0.496810, 0.295144] m, dx [-1.360e-4, 0.000e+0, 4.992e-4] m, v before [-5.950e-11, -2.475e-12, 1.266e-10] -> after [-5.950e-11, -2.475e-12, 1.266e-10] m/s | info (not graded) | INFO |
| 44 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 45 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 46 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 47 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 48 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 49 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.008, 7.994, 8.000 | info (not graded) | INFO |
| 50 | separation | C3.separation trace: step of max (E-E0)/|E0| and cumulative stage energies there (J) | step 86 t=1.4333 s, rise 2.311e-6 |E0| = 7.084e-4 J; gravity+pressure 9.976e-2; p2g 1.007e-3; ghost 0.000e+0; g2p -1.009e-1; extension 1.849e-4; advect 4.910e-4; pushout 1.285e-7; densfix 1.900e-4 | info (not graded) | INFO |
| 51 | separation | C3.separation trace: sum of positive per-step stage dE over 2 s by stage (J) | gravity+pressure 1.394e-1; p2g 1.408e-3; advect 8.554e-4; extension 2.521e-4; densfix 1.900e-4; pushout 1.879e-7 | info (not graded) | INFO |
| 52 | separation | C3.separation trace: max|u| (m/s) at t = 0, 0.25, 0.5, 1, 1.5, 2 s | 0.02: 1.182e-9; 0.25: 2.702e-2; 0.50: 2.553e-2; 1.00: 2.361e-2; 1.50: 2.234e-2; 2.00: 2.797e-2 | info (not graded) | INFO |
| 53 | separation | C3.separation trace: 5 largest per-step max|u| increases (step: d max|u|, then that step's g2p / extension / gravity+pressure / pushout dE) | 115: +5.904e-2, -1.184e-3 / 2.302e-6 / 1.180e-3 / -6.746e-10; 96: +3.689e-2, -1.187e-3 / 2.048e-6 / 1.186e-3 / 1.172e-9; 2: +3.252e-2, -1.139e-3 / 1.171e-6 / 1.151e-3 / -1.569e-9; 24: +3.143e-2, -1.170e-3 / 2.378e-6 / 1.158e-3 / -1.479e-9; 103: +2.997e-2, -1.182e-3 / 1.310e-6 / 1.174e-3 / 1.016e-9 | info (not graded) | INFO |
| 54 | t3a16 | a16 Ritter short window W=3 frames: peak speed / U_R | 1.0119519 (frame 26) | <= 1 + q = 1.0337317 (q = 0.0337317) | PASS |
| 55 | t3a16 | a16 Ritter long window W_L=11 frames: peak speed / U_R | 0.9567546 (frame 29) | <= 1.0 | PASS |
| 56 | t3a16 | a16 Ritter single-substep peak (info) | 2.7829 U_R | info (not graded) | INFO |
| 57 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 62) |
| 58 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 278 > 0 | <= 0 every step | PASS |
| 59 | t3a16 | a16 P.res max true residual | 9.948e-9 | <= 1e-8 | PASS |
| 60 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 61 | t3a16 | a16 CFL / cap | max CFL 0.9989; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 278 | info (not graded) | INFO |
| 62 | t3a16 | a16 T3.mm shift | 0.3846 | info (not graded) | INFO |
| 63 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 64 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 65 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 66 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 67 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 68 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 69 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 70 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 71 | t3a16 | a16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 72 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 73 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.934, T_mean 2.83) | 3.67% | <= 8% | PASS |
| 74 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 75 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.275, T_mean 3.11) | 5.31% | <= 8% | PASS |
| 76 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 77 | t3a16 | a16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 78 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.499, T_mean 4.44) | 1.33% | <= 8% | PASS |
| 79 | t3a16 | a16 T3.mm Z=7 (T_sim 5.140, T_mean 5.09) | 0.99% | <= 8% | PASS |
| 80 | t3a16 | a16 T3.mm Z=8 (T_sim 5.712, T_mean 5.69) | 0.38% | <= 8% | PASS |
| 81 | t3a16 | a16 T3.mm Z=9 (T_sim 6.221, T_mean 6.3) | 1.25% | <= 8% | PASS |
| 82 | t3a16 | a16 T3.mm Z=10 (T_sim 6.799, T_mean 6.83) | 0.45% | <= 8% | PASS |
| 83 | t3a16 | a16 T3.mm Z=11 (T_sim 7.333, T_mean 7.44) | 1.44% | <= 8% | PASS |
| 84 | t3a16 | a16 T3.mm Z=12 (T_sim 7.824, T_mean 8.08) | 3.17% | <= 8% | PASS |
| 85 | t3a16 | a16 T3.mm Z=13 (T_sim 8.358, T_mean 8.67) | 3.60% | <= 8% | PASS |
| 86 | t3a16 | a16 T3.mm Z=14 (T_sim 8.925, T_mean 9.31) | 4.14% | <= 8% | PASS |
| 87 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 1.768e-2 (frame 12, m=8.1414) | <= 1e-2 every frame | FAIL |
| 88 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 89 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -8.096e-2 / -9.711e-2 | info (not graded) | INFO |
| 90 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 5.746e-2 / 3.538e-1 | info (not graded) | INFO |
| 91 | t3a16 | a16 T4 peak count | 23 at frame 20 cell [3,0,4] (front x 9.63a) | info (not graded) | INFO |
| 92 | t3a16 | a16 T4 final histogram n:cells(Poisson(6.724)) | 1:372(79) 2:517(265) 3:488(594) 4:685(999) 5:975(1343) 6:1248(1505) 7:1431(1446) 8:1398(1215) 9:1130(908) 10:773(611) 11:434(373) 12:186(209) 13:77(108) 14:26(52) 15:5(23) 16:1(10) | info (not graded) | INFO |
| 93 | t3a16 | C3.fix3 a=16: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.1000 (stage incl. push-out 0.1149, info) | <= 0.1 | PASS |
| 94 | t3a16 | C3.fix3 a=16: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -6.069e-9 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 95 | t3a16 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a16: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 3.466e-3 J at step 278 (cum dPE 3.829e-3, PE_pack 3.629e-4) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 96 | t3a16 | C3.fix3 a=16: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 97 | t3a16 | C3.fix3 a=16: target sum, max over steps and regions of |sum e - target_r| / n_r | 5.053e-15 | <= 1e-12 every step | PASS |
| 98 | t3a16 | a16 fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target | 5.643e-3 / -2.108e-3 / 1.766e-2; 144 of 278 | info (not graded) | INFO |
| 99 | t3a16 | a16 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 7.034e-4 / 4.436e-3 | info (not graded) | INFO |
| 100 | t3a16 | a16 front displacement caused by the correction alone in each Ritter window (W = 3 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 3); at the worst Ritter window (frame 26): total 1.072e-1 m, by correction 0.000e+0 m (0.000 h), speed 1.0120 U_R, speed minus correction 1.0120 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 101 | t3a16 | a16 fix3 PCG iterations per step (mean / max; steps solved) | 10.2 / 17; 252 of 278 | info (not graded) | INFO |
| 102 | t3a16 | a16 fix3 max |dx|/h per step (mean / max) | 0.0360 / 0.1000 | info (not graded) | INFO |
| 103 | t3a16 | a16 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 6.188e-5 / 5.676e-3 | info (not graded) | INFO |
| 104 | t3a16 | a16 fix3 fraction of steps where the cap binds | 17 of 278 = 0.061; steps 46,58,59,60,61,66,69,71,75,76,77,78,79,80,81,82,84 | info (not graded) | INFO |
| 105 | t3a16 | a16 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 2.028e-2 / 5.546e-2 | info (not graded) | INFO |
| 106 | t3a16 | a16 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 5.615e-2 / -1.220e-1 / 3.321e-1; 251 of 278 | info (not graded) | INFO |
| 107 | t3a16 | a16 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 8.097e-3 / -4.229e-1 / 7.828e-1; 58.3 of 1910.2 | info (not graded) | INFO |
| 108 | t3a16 | a16 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 3.829e-3 J, max 1.300e-4 J; sum dKE -9.557e-8 J; PE_pack 3.629e-4 J (max 2.141e-3) | info (not graded) | INFO |
| 109 | t3a16 | C3.fix3 a=16: T3.mm worst graded row no worse than fix 1 (6.94%) | 6.94% | <= 6.94% | PASS |
| 110 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -31464 vs -32365.2; column region (x<a) -7342 vs -7323.8; mean |per-step difference| 14.62 | info (not graded) | INFO |
| 111 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.18e-3 / 1.78e-1 / 5891 of 7297] [-4.90e-4 / 3.04e-2 / 13726 of 17295] [-3.53e-4 / 2.29e-2 / 20808 of 26993] | info (not graded) | INFO |
| 112 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [4.66e-4 / 3.23e-2 / 633 of 2430] [6.37e-4 / 1.19e-2 / 236 of 843] [-1.50e-3 / 1.03e-2 / 362 of 399] | info (not graded) | INFO |
| 113 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [1.57e-5 / 4.60e-2 / 3494 of 8197] [1.28e-5 / 3.61e-2 / 3737 of 8270] [1.48e-5 / 3.43e-2 / 3844 of 8271] | info (not graded) | INFO |
| 114 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,31 | f1: [7.50 7.93 8.00 8.15 8.60 8.43] total 64236; f6: [8.23 8.25 7.60 8.12 8.15 7.82] total 42758; f11: [8.86 9.09 8.46 8.41 8.02 8.03] total 24405; f16: [8.12 8.12 8.03 7.94 8.29 8.16] total 14816; f21: [8.09 7.85 8.03 7.75 7.38 0.00] total 10011; f26: [8.10 7.94 7.64 5.20 0.00 0.00] total 7393; f31: [7.90 7.85 6.70 0.00 0.00 0.00] total 5747 | info (not graded) | INFO |
| 115 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.934 / 2.972 / -0.039; 3.67% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.275 / 3.275 / +0.000; 5.31% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.499 / 4.499 / +0.000; 1.33% | Z=7: 5.140 / 5.140 / +0.000; 0.99% | Z=8: 5.712 / 5.712 / +0.000; 0.38% | Z=9: 6.221 / 6.221 / +0.000; -1.25% | Z=10: 6.799 / 6.799 / +0.000; -0.45% | Z=11: 7.333 / 7.333 / +0.000; -1.44% | Z=12: 7.824 / 7.880 / -0.056; -3.17% | Z=13: 8.358 / 8.358 / +0.000; -3.60% | Z=14: 8.925 / 8.891 / +0.034; -4.14% | info (not graded) | INFO |
| 116 | t3a16 | a16 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.50 / 4 / 11 / 4:7 5:16 6:32 7:20 8:166 9:4 10:5 11:6; f5: 7.72 / 6 / 14 / 6:82 7:26 8:112 9:3 10:6 11:11 12:11 13:3 14:2; f10: 9.14 / 0 / 21 / 0:10 1:11 2:17 3:8 4:18 5:12 6:10 7:16 8:16 9:16 10:13 11:17 12:7 13:8 14:21 15:20 16:23 17:9 18:3 21:1; f15: 8.24 / 0 / 14 / 0:1 1:1 2:6 3:9 4:14 5:16 6:26 7:22 8:29 9:34 10:41 11:25 12:19 13:10 14:3; f20: 8.09 / 2 / 15 / 2:3 3:9 4:15 5:29 6:24 7:24 8:32 9:33 10:32 11:32 12:8 13:10 14:4 15:1; f25: 8.10 / 2 / 14 / 2:4 3:2 4:7 5:22 6:31 7:37 8:43 9:42 10:27 11:23 12:6 13:8 14:4; f31: 7.90 / 1 / 14 / 1:1 3:5 4:10 5:28 6:28 7:36 8:51 9:31 10:28 11:22 12:11 13:4 14:1 | info (not graded) | INFO |
| 117 | t3a8 | a8 Ritter short window W=5 frames: peak speed / U_R | 0.9512348 (frame 22) | <= 1 + q = 1.0404781 (q = 0.0404781) | PASS |
| 118 | t3a8 | a8 Ritter long window W_L=21 frames: peak speed / U_R | 0.8770250 (frame 32) | <= 1.0 | PASS |
| 119 | t3a8 | a8 Ritter single-substep peak (info) | 3.6430 U_R | info (not graded) | INFO |
| 120 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.679e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 29) |
| 121 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 122 | t3a8 | a8 P.res max true residual | 9.862e-9 | <= 1e-8 | PASS |
| 123 | t3a8 | a8 P.div max |div u| dt | 3.133e-9 | <= 1e-6 | PASS |
| 124 | t3a8 | a8 CFL / cap | max CFL 0.9957; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 125 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 126 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 127 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 128 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 129 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 130 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.873, T_mean 1.83) | 2.38% | <= 8% | PASS |
| 131 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 132 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 133 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 134 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 135 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.791, T_mean 2.65) | 5.31% | <= 8% | PASS |
| 136 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 137 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 138 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 139 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 140 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 141 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 142 | t3a8 | a8 T3.mm Z=7 (T_sim 5.254, T_mean 5.09) | 3.22% | <= 8% | PASS |
| 143 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 144 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 145 | t3a8 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 146 | t3a8 | a8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 147 | t3a8 | a8 T3.mm Z=12 (T_sim 8.033, T_mean 8.08) | 0.58% | <= 8% | PASS |
| 148 | t3a8 | a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 149 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 150 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 1.919e-2 (frame 16, m=8.1535) | <= 1e-2 every frame | FAIL |
| 151 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 152 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -6.897e-2 / -1.033e-1 | info (not graded) | INFO |
| 153 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 7.361e-2 / 3.291e-1 | info (not graded) | INFO |
| 154 | t3a8 | a8 T4 peak count | 20 at frame 14 cell [1,7,0] (front x 6.13a) | info (not graded) | INFO |
| 155 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.654)) | 1:120(29) 2:195(81) 3:116(153) 4:122(217) 5:138(245) 6:155(231) 7:163(187) 8:153(132) 9:128(83) 10:85(47) 11:44(24) 12:18(11) 13:10(5) 14:1(2) 15:1(1) | info (not graded) | INFO |
| 156 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 157 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.704e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 158 | t3a8 | C3.fix3 a=8: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.0910 (stage incl. push-out 0.0910, info) | <= 0.1 | PASS |
| 159 | t3a8 | C3.fix3 a=8: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -2.718e-8 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 160 | t3a8 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a8: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 3.318e-3 J at step 131 (cum dPE 3.886e-3, PE_pack 5.685e-4) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 161 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 162 | t3a8 | C3.fix3 a=8: target sum, max over steps and regions of |sum e - target_r| / n_r | 5.969e-16 | <= 1e-12 every step | PASS |
| 163 | t3a8 | a8 fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target | 6.042e-3 / -1.131e-2 / 2.715e-2; 92 of 159 | info (not graded) | INFO |
| 164 | t3a8 | a8 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 3.281e-3 / 1.869e-2 | info (not graded) | INFO |
| 165 | t3a8 | a8 front displacement caused by the correction alone in each Ritter window (W = 5 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 5); at the worst Ritter window (frame 22): total 1.679e-1 m, by correction 0.000e+0 m (0.000 h), speed 0.9512 U_R, speed minus correction 0.9512 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 166 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 7.4 / 13; 138 of 159 | info (not graded) | INFO |
| 167 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0239 / 0.0910 | info (not graded) | INFO |
| 168 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 169 | t3a8 | a8 fix3 fraction of steps where the cap binds | 0 of 159 = 0.000 | info (not graded) | INFO |
| 170 | t3a8 | a8 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 4.786e-2 / 1.140e-1 | info (not graded) | INFO |
| 171 | t3a8 | a8 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 4.407e-2 / -2.033e-1 / 2.288e-1; 136 of 159 | info (not graded) | INFO |
| 172 | t3a8 | a8 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | -4.108e-3 / -3.766e-1 / 9.314e-1; 16.0 of 262.3 | info (not graded) | INFO |
| 173 | t3a8 | a8 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 3.930e-3 J, max 2.588e-4 J; sum dKE -1.264e-7 J; PE_pack 9.804e-4 J (max 2.641e-3) | info (not graded) | INFO |
| 174 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 175 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.873 / 1.941 / -0.068; 2.38% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.791 / 2.868 / -0.077; 5.31% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 3.998 / 3.998 / +0.000; -0.54% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.254 / 5.254 / +0.000; 3.22% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.335 / 6.335 / +0.000; 0.55% | Z=10: 6.901 / 6.901 / +0.000; 1.04% | Z=11: 7.467 / 7.467 / +0.000; 0.36% | Z=12: 8.033 / 8.033 / +0.000; -0.58% | Z=13: 8.548 / 8.548 / +0.000; -1.41% | Z=14: 9.114 / 9.114 / +0.000; -2.10% | info (not graded) | INFO |
| 176 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -7113 vs -8062.8; column region (x<a) -1931 vs -1826.9; mean |per-step difference| 11.24 | info (not graded) | INFO |
| 177 | t3a8 | a8 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.56 / 4 / 9 / 4:2 5:2 6:5 7:8 8:43 9:4; f5: 7.78 / 6 / 12 / 6:17 7:9 8:30 11:3 12:5; f10: 9.20 / 2 / 17 / 2:5 3:5 4:3 5:5 6:5 7:1 8:1 9:6 10:4 11:6 12:4 13:4 14:8 15:3 16:3 17:1; f15: 8.56 / 0 / 18 / 0:3 1:1 2:3 3:1 4:6 5:4 6:6 7:5 8:6 9:2 10:5 11:4 12:3 13:3 14:2 15:5 16:1 17:3 18:1; f20: 7.66 / 2 / 13 / 2:1 3:5 4:5 5:4 6:6 7:4 8:8 9:15 10:10 11:4 13:2; f25: 7.94 / 2 / 13 / 2:1 3:1 4:5 5:2 6:10 7:9 8:11 9:8 10:6 11:6 12:1 13:4; f32: 8.02 / 0 / 12 / 0:1 5:6 6:4 7:13 8:16 9:8 10:9 11:6 12:1 | info (not graded) | INFO |
| 178 | sign | C3.fix3.sign v6 [production sign]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 16/16 outward (min dx.r 4.430e-6 m^2); splat nbar 10.481445 -> 10.345927 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 8.882e-18) | all outward AND splat nbar drops | PASS (test verdict PASS) |
| 179 | sign | C3.fix3.sign v6 [production sign]: splat nbar across the correction stage alone | 10.481445 -> 10.345927 (drops); correction max |dx|/h 0.00851 | info (not graded) | INFO |
| 180 | sign | C3.fix3.sign v6 [sign FLIPPED (must fail)]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 0/16 outward (min dx.r -1.051e-5 m^2); splat nbar 10.481445 -> 10.610692 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 8.882e-18) | all outward AND splat nbar drops | PASS (test verdict FAIL; row passes when the flipped sign fails) |
| 181 | sign | C3.fix3.sign v6 [sign FLIPPED (must fail)]: splat nbar across the correction stage alone | 10.481445 -> 10.610692 (rises); correction max |dx|/h 0.00851 | info (not graded) | INFO |
| 182 | stillproof | still-water T1 grid 8x8x10: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 183 | stillproof | still-water T1 grid 16x16x20: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 184 | stillproof | still-water T1 grid 32x32x40: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 185 | stillproof | still-water proof Gate 1 T1: fix-3 stage dx and dPE exactly 0 every step | 1800 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid 8x8x10: max|ebar_T4| 0.000e+0, 16x16x20: max|ebar_T4| 0.000e+0, 32x32x40: max|ebar_T4| 0.000e+0 | moved 0, |dx| 0, |dPE| 0 | PASS |
| 186 | stillproof | still-water T1b grid 8x8x6: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 187 | stillproof | still-water T1b grid 16x16x10: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 188 | stillproof | still-water T1b grid 32x32x18: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 189 | stillproof | still-water T1b grid 64x64x34: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 190 | stillproof | still-water proof Gate 1 T1b: fix-3 stage dx and dPE exactly 0 every step | 2400 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid 8x8x6: max|ebar_T4| 0.000e+0, 16x16x10: max|ebar_T4| 0.000e+0, 32x32x18: max|ebar_T4| 0.000e+0, 64x64x34: max|ebar_T4| 0.000e+0 | moved 0, |dx| 0, |dPE| 0 | PASS |
| 191 | stillproof | fix-3 stage in Gate 1 T2 (not a still pool) | 147 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid 24x24x64: max|ebar_T4| 4.747e-3 | info (not graded) | INFO |
| 192 | convergence | T3.mm convergence (Z 2026-10-14i): |err a=16| < |err a=8| at Z=2.78 and Z=3.22 | Z=2.78: 6.86% vs 8.57% (ratio a16/a8 0.8005); Z=3.22: 5.58% vs 5.31% (ratio a16/a8 1.0520) | ratio < 1 at both | FAIL (a=8 T3.mm rows stay graded) |

Total graded: 83 PASS, 7 FAIL
