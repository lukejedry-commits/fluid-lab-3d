# Step 11: fix 3 v2 (ASSERTS Z 2026-10-14d)

- Code commit the runs executed at: 742994e (clean tree)
- spec/ASSERTS.md md5 f7c4941535e3e1be1b3f863e4c83198f; PHYSICS_SPEC.md md5 1cb9ecd3aebddddc6117ebef18f94fb3
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 2 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 3 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 6.389e-4 (frame 109, m=7.9949, 27000 cells) | <= 1e-2 | PASS |
| 4 | tilted | C3.tilted_tank peak cell count, every frame | 16 (frame 59, cell [30,15,31]) | <= 16 | PASS |
| 5 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 4.174e-5 | <= 1e-6 | FAIL |
| 6 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 4.167e-5 | <= 1e-6 | FAIL |
| 7 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.745e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.001e+2; g2p -5.590e-1; extension 1.720e-1; advect -6.057e-2; pushout 1.972e-5; densfix 5.481e-2 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 8 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 1.972e-5 J (6.432e-8 |E0|) / 1.820e-6 J / 28 of 120 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank fix3 stage: signed sum of dPE over run | 5.481e-2 J (1.787e-4 |E0|) | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 2.051e-3 / 6.221e-3; 119 of 120 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | -5.417e-3 / -2.117e-1 / 1.001e-1 (119) | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank fix3 PCG iterations (mean / max) | 23.27 / 26 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0099 / 0 of 120 | info (not graded) | INFO |
| 15 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.072e-1 / 1.933e-1 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.671e-7 J (-1.197e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 17 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 12 (t=0.1833 s): step dE 1.820e-6 J; top particle #258509 dE 5.287e-7 J, x0 [0.456674, 0.330525, 0.490513] m, dx [4.183e-5, 4.157e-5, 1.130e-4] m, v before [-1.729e-2, -5.362e-3, -1.256e-1] -> after [-1.729e-2, -5.362e-3, -1.256e-1] m/s | info (not graded) | INFO |
| 18 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 19 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 20 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 21 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 22 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 23 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.992, 7.992, 8.025, 8.006, 7.974 | info (not graded) | INFO |
| 24 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 25 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 26 | separation | C3.separation strict interior mean (info per section Z) | 2.963e-4 (frame 67, m=7.9976, 27000 cells) | info (not graded) | INFO |
| 27 | separation | C3.separation peak cell count (info) | 13 (frame 28, cell [31,16,31]) | info (not graded) | INFO |
| 28 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 1.764e-6 | <= 1e-6 | FAIL |
| 29 | separation | C3.separation cumulative stage energy at end (J) | p2g 1.174e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.398e-1; extension 2.128e-4; advect 5.233e-4; pushout 1.007e-7; densfix 0.000e+0 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 30 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 1.007e-7 J (3.285e-10 |E0|) / 2.925e-9 J / 102 of 120 | info (not graded) | INFO |
| 31 | separation | C3.separation C3.separation anti-inflation (fix 3 on): |sum over steps of stage dPE| over 2 s | 0.000e+0 J (signed 0.000e+0 J; 0.000e+0 |E0|) | <= 1e-6 |E0| = 3.066e-4 J | PASS |
| 32 | separation | C3.separation fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 33 | separation | C3.separation fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 0.000e+0 / 0.000e+0; 0 of 120 | info (not graded) | INFO |
| 34 | separation | C3.separation fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | no step had a cell above the dead-band | info (not graded) | INFO |
| 35 | separation | C3.separation fix3 PCG iterations (mean / max) | 0.00 / 0 | info (not graded) | INFO |
| 36 | separation | C3.separation fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0000 / 0 of 120 | info (not graded) | INFO |
| 37 | separation | C3.separation max|u| at t=2 s | 1.703e-2 | < 2.215e-3 | FAIL |
| 38 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 2.672e-12 J (8.715e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 39 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 42 (t=0.6833 s): step dE 2.925e-9 J; top particle #257245 dE 2.859e-8 J, x0 [0.431726, 0.189305, 0.494696] m, dx [-3.769e-6, 3.073e-6, 6.112e-6] m, v before [6.932e-4, -5.964e-5, -5.596e-3] -> after [6.932e-4, -5.964e-5, -5.596e-3] m/s | info (not graded) | INFO |
| 40 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 41 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 42 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 43 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 44 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 45 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.007, 7.995, 8.000 | info (not graded) | INFO |
| 46 | t3a16 | a16 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 3 frames | 2.1431 m/s (1.0120 U_R, frame 28) | < U_R = 2.1178 m/s every frame | FAIL |
| 47 | t3a16 | a16 Ritter single-substep peak / frame-to-frame peak | 2.7829 U_R / 1.1131 U_R | info (not graded) | INFO |
| 48 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.730e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 64) |
| 49 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 268 > 0 | <= 0 every step | PASS |
| 50 | t3a16 | a16 P.res max true residual | 9.941e-9 | <= 1e-8 | PASS |
| 51 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 52 | t3a16 | a16 CFL / cap | max CFL 0.9974; cap 16; frames cap-bound with CFL>1: 0 of 30; substeps 268 | info (not graded) | INFO |
| 53 | t3a16 | a16 T3.mm shift | 0.3846 | info (not graded) | INFO |
| 54 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 55 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 56 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 57 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 58 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 59 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 60 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 61 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 62 | t3a16 | a16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 63 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 64 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.934, T_mean 2.83) | 3.67% | <= 8% | PASS |
| 65 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 66 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.241, T_mean 3.11) | 4.20% | <= 8% | PASS |
| 67 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 68 | t3a16 | a16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 69 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.499, T_mean 4.44) | 1.33% | <= 8% | PASS |
| 70 | t3a16 | a16 T3.mm Z=7 (T_sim 5.109, T_mean 5.09) | 0.38% | <= 8% | PASS |
| 71 | t3a16 | a16 T3.mm Z=8 (T_sim 5.727, T_mean 5.69) | 0.65% | <= 8% | PASS |
| 72 | t3a16 | a16 T3.mm Z=9 (T_sim 6.221, T_mean 6.3) | 1.25% | <= 8% | PASS |
| 73 | t3a16 | a16 T3.mm Z=10 (T_sim 6.757, T_mean 6.83) | 1.06% | <= 8% | PASS |
| 74 | t3a16 | a16 T3.mm Z=11 (T_sim 7.291, T_mean 7.44) | 2.01% | <= 8% | PASS |
| 75 | t3a16 | a16 T3.mm Z=12 (T_sim 7.824, T_mean 8.08) | 3.17% | <= 8% | PASS |
| 76 | t3a16 | a16 T3.mm Z=13 (T_sim 8.372, T_mean 8.67) | 3.44% | <= 8% | PASS |
| 77 | t3a16 | a16 T3.mm Z=14 (T_sim 8.863, T_mean 9.31) | 4.80% | <= 8% | PASS |
| 78 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 31 frames (m0 8.0000) | 9.071e-3 (frame 27, m=8.0726) | <= 1e-2 every frame | PASS |
| 79 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 80 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -7.684e-2 / -9.665e-2 | info (not graded) | INFO |
| 81 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 5.638e-2 / 3.451e-1 | info (not graded) | INFO |
| 82 | t3a16 | a16 T4 peak count | 27 at frame 11 cell [4,10,0] (front x 4.69a) | info (not graded) | INFO |
| 83 | t3a16 | a16 T4 final histogram n:cells(Poisson(6.866)) | 1:346(68) 2:513(235) 3:395(537) 4:532(923) 5:779(1267) 6:1236(1450) 7:1448(1422) 8:1544(1220) 9:1332(931) 10:827(639) 11:399(399) 12:140(228) 13:36(121) 14:15(59) 15:1(27) 16:2(12) | info (not graded) | INFO |
| 84 | t3a16 | C3.fix3 a=16: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.1000 (stage incl. push-out 0.1046, info) | <= 0.1 | PASS |
| 85 | t3a16 | C3.fix3 a=16: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -6.021e-9 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 86 | t3a16 | C3.fix3 a=16: cum stage dPE <= PE_pack(t) + 1e-6|E0| every step (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 3.309e-3 J at step 170 (cum dPE 3.556e-3, PE_pack 2.469e-4) | <= 1e-6|E0| = 2.093e-7 J | FAIL |
| 87 | t3a16 | C3.fix3 a=16: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 88 | t3a16 | a16 fix3 PCG iterations per step (mean / max; steps solved) | 11.9 / 18; 268 of 268 | info (not graded) | INFO |
| 89 | t3a16 | a16 fix3 max |dx|/h per step (mean / max) | 0.0279 / 0.1000 | info (not graded) | INFO |
| 90 | t3a16 | a16 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 6.263e-7 / 1.678e-4 | info (not graded) | INFO |
| 91 | t3a16 | a16 fix3 fraction of steps where the cap binds | 1 of 268 = 0.004; steps 74 | info (not graded) | INFO |
| 92 | t3a16 | a16 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 7.109e-2 / 1.385e-1 | info (not graded) | INFO |
| 93 | t3a16 | a16 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 1.547e-2 / -5.214e-2 / 1.273e-1; 268 of 268 | info (not graded) | INFO |
| 94 | t3a16 | a16 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 6.893e-3 / -5.825e-1 / 1.319e+0; 166.9 of 1862.3 | info (not graded) | INFO |
| 95 | t3a16 | a16 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 3.535e-3 J, max 1.029e-4 J; sum dKE -6.972e-8 J; PE_pack 4.110e-4 J (max 1.558e-3) | info (not graded) | INFO |
| 96 | t3a16 | C3.fix3 a=16: T3.mm worst graded row no worse than fix 1 (6.94%) | 6.94% | <= 6.94% | PASS |
| 97 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -31349 vs -31173.4; column region (x<a) -7568 vs -7167.6; mean |per-step difference| 14.13 | info (not graded) | INFO |
| 98 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.16e-3 / 2.82e-1 / 5863 of 7196] [-5.07e-4 / 5.07e-2 / 13290 of 16791] [-3.63e-4 / 7.92e-3 / 20023 of 26118] | info (not graded) | INFO |
| 99 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [3.46e-4 / 1.37e-2 / 544 of 2327] [5.47e-4 / 1.39e-2 / 186 of 748] [-1.21e-3 / 9.45e-3 / 331 of 379] | info (not graded) | INFO |
| 100 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [1.37e-5 / 6.41e-2 / 3606 of 8190] [6.83e-6 / 2.43e-2 / 3709 of 8219] [7.00e-6 / 2.46e-3 / 3864 of 8221] | info (not graded) | INFO |
| 101 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,30 | f1: [7.51 7.94 7.97 8.18 8.64 8.29] total 64229; f6: [7.84 7.74 7.61 8.04 7.55 8.13] total 42437; f11: [9.00 8.84 8.07 8.14 8.02 8.00] total 24191; f16: [8.06 8.33 8.19 7.91 8.08 8.01] total 14632; f21: [7.99 8.13 7.87 8.00 6.82 0.00] total 9934; f26: [8.03 7.94 8.38 4.53 0.00 0.00] total 7393; f30: [7.94 7.83 8.03 0.00 0.00 0.00] total 6094 | info (not graded) | INFO |
| 102 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.934 / 2.972 / -0.039; 3.67% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.241 / 3.275 / -0.034; 4.20% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.499 / 4.499 / +0.000; 1.33% | Z=7: 5.109 / 5.140 / -0.031; 0.38% | Z=8: 5.727 / 5.712 / +0.015; 0.65% | Z=9: 6.221 / 6.221 / +0.000; -1.25% | Z=10: 6.757 / 6.799 / -0.042; -1.06% | Z=11: 7.291 / 7.333 / -0.042; -2.01% | Z=12: 7.824 / 7.880 / -0.056; -3.17% | Z=13: 8.372 / 8.358 / +0.014; -3.44% | Z=14: 8.863 / 8.891 / -0.028; -4.80% | info (not graded) | INFO |
| 103 | t3a16 | a16 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.51 / 4 / 11 / 4:4 5:15 6:38 7:24 8:158 9:5 10:6 11:6; f5: 7.58 / 6 / 13 / 6:93 7:25 8:100 9:9 10:6 11:10 12:12 13:1; f10: 9.02 / 0 / 21 / 0:5 1:17 2:13 3:18 4:15 5:15 6:15 7:13 8:13 9:14 10:9 11:9 12:11 13:17 14:22 15:14 16:17 17:11 18:6 19:1 21:1; f15: 8.36 / 1 / 18 / 1:2 2:4 3:6 4:14 5:16 6:23 7:24 8:31 9:38 10:45 11:27 12:15 13:5 14:4 15:1 18:1; f20: 8.13 / 2 / 14 / 2:5 3:3 4:16 5:18 6:24 7:36 8:35 9:34 10:34 11:32 12:14 13:3 14:2; f25: 7.96 / 2 / 13 / 2:1 3:2 4:12 5:24 6:36 7:33 8:39 9:36 10:34 11:31 12:7 13:1; f30: 7.94 / 3 / 13 / 3:1 4:6 5:19 6:46 7:47 8:37 9:32 10:36 11:24 12:6 13:2 | info (not graded) | INFO |
| 104 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 2.0574 m/s (0.9715 U_R, frame 24) | < U_R = 2.1178 m/s every frame | PASS |
| 105 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.4167 U_R | info (not graded) | INFO |
| 106 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.748e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 29) |
| 107 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 108 | t3a8 | a8 P.res max true residual | 9.995e-9 | <= 1e-8 | PASS |
| 109 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 110 | t3a8 | a8 CFL / cap | max CFL 0.9935; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 111 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 112 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 113 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 114 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 115 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 116 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 117 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 118 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 119 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 120 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 121 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 122 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 123 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 124 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 125 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 126 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 127 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 128 | t3a8 | a8 T3.mm Z=7 (T_sim 5.233, T_mean 5.09) | 2.82% | <= 8% | PASS |
| 129 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 130 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 131 | t3a8 | a8 T3.mm Z=10 (T_sim 6.935, T_mean 6.83) | 1.54% | <= 8% | PASS |
| 132 | t3a8 | a8 T3.mm Z=11 (T_sim 7.416, T_mean 7.44) | 0.33% | <= 8% | PASS |
| 133 | t3a8 | a8 T3.mm Z=12 (T_sim 7.982, T_mean 8.08) | 1.22% | <= 8% | PASS |
| 134 | t3a8 | a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 135 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 136 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 4.365e-2 (frame 29, m=8.3492) | <= 1e-2 every frame | FAIL |
| 137 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 138 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -6.848e-2 / -1.021e-1 | info (not graded) | INFO |
| 139 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 7.397e-2 / 3.220e-1 | info (not graded) | INFO |
| 140 | t3a8 | a8 T4 peak count | 20 at frame 14 cell [1,2,0] (front x 6.13a) | info (not graded) | INFO |
| 141 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.669)) | 1:119(28) 2:217(80) 3:111(152) 4:107(215) 5:119(244) 6:148(231) 7:158(187) 8:172(132) 9:122(83) 10:102(47) 11:49(24) 12:18(12) 13:2(5) 14:1(2) | info (not graded) | INFO |
| 142 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 143 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.696e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 144 | t3a8 | C3.fix3 a=8: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.0568 (stage incl. push-out 0.0568, info) | <= 0.1 | PASS |
| 145 | t3a8 | C3.fix3 a=8: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -4.273e-8 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 146 | t3a8 | C3.fix3 a=8: cum stage dPE <= PE_pack(t) + 1e-6|E0| every step (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 2.144e-3 J at step 87 (cum dPE 2.863e-3, PE_pack 7.186e-4) | <= 1e-6|E0| = 2.093e-7 J | FAIL |
| 147 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 148 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 9.0 / 13; 159 of 159 | info (not graded) | INFO |
| 149 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0189 / 0.0568 | info (not graded) | INFO |
| 150 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 151 | t3a8 | a8 fix3 fraction of steps where the cap binds | 0 of 159 = 0.000 | info (not graded) | INFO |
| 152 | t3a8 | a8 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 1.166e-1 / 2.653e-1 | info (not graded) | INFO |
| 153 | t3a8 | a8 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | -4.032e-3 / -1.878e-1 / 1.259e-1; 159 of 159 | info (not graded) | INFO |
| 154 | t3a8 | a8 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | -1.213e-2 / -5.750e-1 / 1.173e+0; 36.5 of 255.0 | info (not graded) | INFO |
| 155 | t3a8 | a8 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 2.856e-3 J, max 1.665e-4 J; sum dKE -2.122e-7 J; PE_pack 1.127e-3 J (max 2.893e-3) | info (not graded) | INFO |
| 156 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 157 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.941 / 1.941 / +0.000; 6.09% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.868 / 2.868 / +0.000; 8.22% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 3.998 / 3.998 / +0.000; -0.54% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.233 / 5.254 / -0.021; 2.82% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.335 / 6.335 / +0.000; 0.55% | Z=10: 6.935 / 6.901 / +0.034; 1.54% | Z=11: 7.416 / 7.467 / -0.051; -0.33% | Z=12: 7.982 / 8.033 / -0.051; -1.22% | Z=13: 8.548 / 8.548 / +0.000; -1.41% | Z=14: 9.114 / 9.114 / +0.000; -2.10% | info (not graded) | INFO |
| 158 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -7060 vs -7994.3; column region (x<a) -1948 vs -1762.8; mean |per-step difference| 11.03 | info (not graded) | INFO |
| 159 | t3a8 | a8 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.56 / 4 / 9 / 4:1 5:2 6:7 7:8 8:42 9:4; f5: 7.69 / 6 / 11 / 6:18 7:3 8:32 9:4 10:6 11:1; f10: 9.33 / 1 / 17 / 1:1 2:1 3:4 4:4 5:6 6:5 7:4 8:4 9:5 10:2 11:3 12:4 13:5 14:9 15:4 16:2 17:1; f15: 9.20 / 2 / 20 / 2:5 3:5 4:8 5:6 6:4 7:3 8:5 9:3 11:1 12:3 13:4 14:2 15:3 16:2 17:2 18:2 19:4 20:2; f20: 7.88 / 2 / 13 / 2:1 3:1 4:3 5:9 6:6 7:7 8:6 9:14 10:7 11:8 12:1 13:1; f25: 8.22 / 5 / 13 / 5:4 6:7 7:13 8:11 9:15 10:7 11:5 12:1 13:1; f32: 9.06 / 4 / 14 / 4:3 5:1 6:3 7:4 8:11 9:12 10:16 11:10 12:2 13:1 14:1 | info (not graded) | INFO |
| 160 | sign | C3.fix3.sign v2 [production sign]: one step; centre cell 16 particles (uniform 2x2x4) in 5x5x5 of 8, open top: particles with outward radial dx / centre nbar before -> after | 16/16 outward (min dx.r 3.204e-6 m^2); nbar 11.375000 -> 11.375000 (raw count 16 -> 16; cells above dead-band 1, PCG 10) | all outward AND centre nbar drops | FAIL (test verdict FAIL) |
| 161 | sign | C3.fix3.sign v2 [production sign] diagnostic: particle-position P2G-splatted count at the centre cell (alternative reading of nbar, not the implemented one) | 10.481445 -> 10.391454 (drops); correction max |dx|/h 0.00510 | info (not graded) | INFO |
| 162 | sign | C3.fix3.sign v2 [sign FLIPPED (must fail)]: one step; centre cell 16 particles (uniform 2x2x4) in 5x5x5 of 8, open top: particles with outward radial dx / centre nbar before -> after | 0/16 outward (min dx.r -6.452e-6 m^2); nbar 11.375000 -> 11.375000 (raw count 16 -> 16; cells above dead-band 1, PCG 10) | all outward AND centre nbar drops | PASS (test verdict FAIL; row passes when the flipped sign fails) |
| 163 | sign | C3.fix3.sign v2 [sign FLIPPED (must fail)] diagnostic: particle-position P2G-splatted count at the centre cell (alternative reading of nbar, not the implemented one) | 10.481445 -> 10.567127 (does not drop); correction max |dx|/h 0.00510 | info (not graded) | INFO |
| 164 | seedT3 | C3.seed T3 a=16: min distance of any seeded particle to any wall at t=0 | 7.1441e-4 m | >= clearance 4.4648e-4 m | PASS |
| 165 | seedT3 | C3.seed T3 a=8: min distance of any seeded particle to any wall at t=0 | 1.4290e-3 m | >= clearance 8.9297e-4 m | PASS |

Total graded: 74 PASS, 11 FAIL

## C3.fix3 on reverted f0220c4 (src f0220c4 + step-11 runner in a worktree; must FAIL)

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

Verdict on f0220c4: 4 graded FAIL (T4, T3.mm rows, fix-3 stage absent) -> C3.fix3 fails there as required.

## Gate 1 (gate1/results.md): 65 graded, 65 PASS, 0 flips vs step10_fix3/gate1.

## Notes
- Step 1 push-out trace: results/step11_pushout_trace/trace.md. No positive densfix dKE exists in v1; step 10 graded max|dKE|. There is no push-out fix.
- C3.fix3.sign v2 FAILS on the production sign: all 16 particles move outward, but nbar (smoothed CELL counts) cannot change unless a particle crosses a cell face. With alpha = 0.1 the max |dx| is 0.0051 h, so the counts stay 16 -> 16 and nbar stays 11.375 -> 11.375. The diagnostic info row shows that a particle-position P2G splat drops (10.481 -> 10.391) with the production sign and rises with the flipped sign. This needs a ruling on how nbar is defined for this row. Nothing was tuned.
- C3.separation total energy 1.764e-6 is identical to step10_seed (no fix 3). Fix 3 v2 never fires there (0 cells above the dead-band), so this is the existing push-out failure.
- C3.tilted_tank total energy 4.17e-5 (step10_seed: 0). The fix-3 stage adds a signed dPE of +5.48e-2 J (1.79e-4 |E0|): the correction raises PE in the tilted tank.
