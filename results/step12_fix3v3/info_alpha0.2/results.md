# INFO ONLY: a=8 T3 with alpha=0.2 (frozen alpha stays 0.1; Z 2026-10-14e)

- Code commit the runs executed at: 856d434 alpha=0.2 INFO ONLY (clean tree)
- spec/ASSERTS.md md5 4aa58d7567eb230b48dec3ed647e240d; PHYSICS_SPEC.md md5 530fdc738702eee27cd8ed9a20846951
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 1.9717 m/s (0.9310 U_R, frame 27) | < U_R = 2.1178 m/s every frame | PASS |
| 2 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.4167 U_R | info (not graded) | INFO |
| 3 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 24) |
| 4 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 5 | t3a8 | a8 P.res max true residual | 9.982e-9 | <= 1e-8 | PASS |
| 6 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 7 | t3a8 | a8 CFL / cap | max CFL 0.9918; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 8 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 9 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 10 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 11 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 12 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 13 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 14 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 15 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 16 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 17 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 18 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 19 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 20 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 21 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 22 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 23 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 24 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 25 | t3a8 | a8 T3.mm Z=7 (T_sim 5.233, T_mean 5.09) | 2.82% | <= 8% | PASS |
| 26 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 27 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 28 | t3a8 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 29 | t3a8 | a8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 30 | t3a8 | a8 T3.mm Z=12 (T_sim 8.033, T_mean 8.08) | 0.58% | <= 8% | PASS |
| 31 | t3a8 | a8 T3.mm Z=13 (T_sim 8.599, T_mean 8.67) | 0.81% | <= 8% | PASS |
| 32 | t3a8 | a8 T3.mm Z=14 (T_sim 9.200, T_mean 9.31) | 1.18% | <= 8% | PASS |
| 33 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 7.119e-2 (frame 24, m=8.5695) | <= 1e-2 every frame | FAIL |
| 34 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 35 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -7.898e-2 / -1.072e-1 | info (not graded) | INFO |
| 36 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 7.410e-2 / 3.419e-1 | info (not graded) | INFO |
| 37 | t3a8 | a8 T4 peak count | 19 at frame 13 cell [3,6,0] (front x 5.62a) | info (not graded) | INFO |
| 38 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.843)) | 1:126(24) 2:176(70) 3:101(136) 4:101(198) 5:119(231) 6:162(225) 7:143(188) 8:150(137) 9:141(89) 10:96(52) 11:50(28) 12:26(13) 13:7(6) 14:3(3) 15:1(1) | info (not graded) | INFO |
| 39 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 40 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.644e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 41 | t3a8 | C3.fix3 a=8: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.0742 (stage incl. push-out 0.0742, info) | <= 0.1 | PASS |
| 42 | t3a8 | C3.fix3 a=8: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -1.696e-8 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 43 | t3a8 | C3.fix3 a=8: cum stage dPE <= PE_pack(t) + 1e-6|E0| every step (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 1.162e-3 J at step 2 (cum dPE 0.000e+0, PE_pack -1.162e-3) | <= 1e-6|E0| = 2.093e-7 J | FAIL |
| 44 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 45 | t3a8 | C3.fix3 a=8: volume-neutral source, max over steps and regions of |sum e| / region cell count | 9.615e-17 | <= 1e-12 every step | PASS |
| 46 | t3a8 | a8 fix3 region-mean shift subtracted (max |mean e| over regions, per step: mean / max) | 5.607e-3 / 3.236e-2 | info (not graded) | INFO |
| 47 | t3a8 | a8 front displacement caused by the correction alone in each Ritter window (W = 5 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 5); at the worst Ritter window (frame 27): total 1.643e-1 m, by correction 0.000e+0 m (0.000 h), speed 0.9310 U_R, speed minus correction 0.9310 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 48 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 7.1 / 12; 135 of 159 | info (not graded) | INFO |
| 49 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0231 / 0.0742 | info (not graded) | INFO |
| 50 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 51 | t3a8 | a8 fix3 fraction of steps where the cap binds | 0 of 159 = 0.000 | info (not graded) | INFO |
| 52 | t3a8 | a8 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 5.425e-2 / 1.579e-1 | info (not graded) | INFO |
| 53 | t3a8 | a8 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 7.775e-2 / -2.010e-1 / 2.469e-1; 135 of 159 | info (not graded) | INFO |
| 54 | t3a8 | a8 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 2.346e-2 / -3.971e-1 / 9.607e-1; 16.9 of 242.2 | info (not graded) | INFO |
| 55 | t3a8 | a8 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 1.700e-3 J, max 1.355e-4 J; sum dKE -1.144e-7 J; PE_pack 1.482e-3 J (max 3.024e-3) | info (not graded) | INFO |
| 56 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 57 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.941 / 1.941 / +0.000; 6.09% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.868 / 2.868 / +0.000; 8.22% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 3.998 / 3.998 / +0.000; -0.54% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.233 / 5.254 / -0.021; 2.82% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.335 / 6.335 / +0.000; 0.55% | Z=10: 6.901 / 6.901 / +0.000; 1.04% | Z=11: 7.467 / 7.467 / +0.000; 0.36% | Z=12: 8.033 / 8.033 / +0.000; -0.58% | Z=13: 8.599 / 8.548 / +0.051; -0.81% | Z=14: 9.200 / 9.114 / +0.086; -1.18% | info (not graded) | INFO |
| 58 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -6962 vs -7991.1; column region (x<a) -1916 vs -1813.3; mean |per-step difference| 11.32 | info (not graded) | INFO |
| 59 | t3a8 | a8 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.56 / 4 / 9 / 4:1 5:3 6:7 7:5 8:44 9:4; f5: 7.80 / 6 / 12 / 6:16 7:10 8:30 11:3 12:5; f10: 9.22 / 0 / 17 / 0:2 1:2 2:6 3:3 4:4 5:5 7:2 8:1 9:4 10:4 11:4 12:3 13:3 14:11 15:6 16:3 17:1; f15: 8.58 / 1 / 17 / 1:1 2:3 3:2 4:4 5:5 6:12 7:6 8:2 9:4 10:3 11:2 12:4 13:6 14:3 15:4 16:2 17:1; f20: 7.70 / 1 / 14 / 1:1 3:3 4:6 5:4 6:7 7:5 8:12 9:10 10:8 11:3 12:3 13:1 14:1; f25: 7.91 / 4 / 13 / 4:2 5:3 6:13 7:13 8:15 9:2 10:8 11:3 12:2 13:3; f32: 8.16 / 4 / 13 / 4:3 5:5 6:7 7:9 8:12 9:12 10:5 11:7 12:3 13:1 | info (not graded) | INFO |

Total graded: 33 PASS, 4 FAIL
