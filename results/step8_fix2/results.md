# Step 8 at FIX 2 (wall clamp)

- Code commit the runs executed at: 8c2f347 (fix2check@6c4214d rows: src 6c4214d + step8 runner in a worktree) (clean tree)
- spec/ASSERTS.md md5 f0f56a064edfb7c2de2c25d637340961; PHYSICS_SPEC.md md5 5c0758ad272e8e477e6e8e24202d3077
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 2 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 6.340e-4 (frame 94, m=8.0051, 27210 cells) | <= 1e-2 | PASS |
| 3 | tilted | C3.tilted_tank peak cell count, every frame | 17 (frame 52, cell [9,7,30]) | <= 16 | FAIL |
| 4 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 8.138e-6 | <= 1e-6 | FAIL |
| 5 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 0.000e+0 | <= 1e-6 | PASS |
| 6 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.868e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.001e+2; g2p -5.613e-1; extension 1.717e-1; advect -5.972e-2; pushout 4.530e-3 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 7 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 4.530e-3 J (1.477e-5 |E0|) / 4.510e-3 J / 33 of 120 | info (not graded) | INFO |
| 8 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.031e-1 / 1.972e-1 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 4.510e-3 J; top particle #7696 dE 9.105e-6 J, x0 [0.033612, 0.475716, 0.000007] m, dx [0.000e+0, 0.000e+0, 1.946e-3] m, v before [-1.824e-4, 1.093e-11, 1.045e-5] -> after [-1.824e-4, 1.093e-11, 1.045e-5] m/s | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 15 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.990, 7.998, 8.024, 8.000, 7.978 | info (not graded) | INFO |
| 16 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 17 | separation | C3.separation strict interior mean (info per section Z) | 3.056e-4 (frame 59, m=7.9976, 27000 cells) | info (not graded) | INFO |
| 18 | separation | C3.separation peak cell count (info) | 13 (frame 28, cell [31,16,31]) | info (not graded) | INFO |
| 19 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 1.660e-5 | <= 1e-6 | FAIL |
| 20 | separation | C3.separation cumulative stage energy at end (J) | p2g 1.275e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.402e-1; extension 2.310e-4; advect 5.560e-4; pushout 4.510e-3 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 21 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 4.510e-3 J (1.471e-5 |E0|) / 4.510e-3 J / 97 of 120 | info (not graded) | INFO |
| 22 | separation | C3.separation max|u| at t=2 s | 3.986e-2 | < 2.215e-3 | FAIL |
| 23 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 4.510e-3 J; top particle #7696 dE 9.105e-6 J, x0 [0.033615, 0.475716, 0.000007] m, dx [0.000e+0, 0.000e+0, 1.946e-3] m, v before [2.360e-11, 4.700e-11, 3.905e-12] -> after [2.360e-11, 4.700e-11, 3.905e-12] m/s | info (not graded) | INFO |
| 24 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 25 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 26 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 27 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 28 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 29 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.007, 7.995, 8.000 | info (not graded) | INFO |
| 30 | t3a16 | a16 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 3 frames | 2.1431 m/s (1.0120 U_R, frame 26) | < U_R = 2.1178 m/s every frame | FAIL |
| 31 | t3a16 | a16 Ritter single-substep peak / frame-to-frame peak | 3.8960 U_R / 1.1131 U_R | info (not graded) | INFO |
| 32 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 6) |
| 33 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 269 > 0 | <= 0 every step | PASS |
| 34 | t3a16 | a16 P.res max true residual | 9.985e-9 | <= 1e-8 | PASS |
| 35 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 36 | t3a16 | a16 CFL / cap | max CFL 0.9925; cap 16; frames cap-bound with CFL>1: 0 of 30; substeps 269 | info (not graded) | INFO |
| 37 | t3a16 | a16 T3.mm shift | 0.3846 | info (not graded) | INFO |
| 38 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 39 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 40 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 41 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 42 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 43 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 44 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 45 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 46 | t3a16 | a16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 47 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 48 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.934, T_mean 2.83) | 3.67% | <= 8% | PASS |
| 49 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 50 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.241, T_mean 3.11) | 4.20% | <= 8% | PASS |
| 51 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 52 | t3a16 | a16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 53 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.468, T_mean 4.44) | 0.64% | <= 8% | PASS |
| 54 | t3a16 | a16 T3.mm Z=7 (T_sim 5.109, T_mean 5.09) | 0.38% | <= 8% | PASS |
| 55 | t3a16 | a16 T3.mm Z=8 (T_sim 5.665, T_mean 5.69) | 0.43% | <= 8% | PASS |
| 56 | t3a16 | a16 T3.mm Z=9 (T_sim 6.233, T_mean 6.3) | 1.06% | <= 8% | PASS |
| 57 | t3a16 | a16 T3.mm Z=10 (T_sim 6.757, T_mean 6.83) | 1.06% | <= 8% | PASS |
| 58 | t3a16 | a16 T3.mm Z=11 (T_sim 7.328, T_mean 7.44) | 1.50% | <= 8% | PASS |
| 59 | t3a16 | a16 T3.mm Z=12 (T_sim 7.796, T_mean 8.08) | 3.51% | <= 8% | PASS |
| 60 | t3a16 | a16 T3.mm Z=13 (T_sim 8.365, T_mean 8.67) | 3.52% | <= 8% | PASS |
| 61 | t3a16 | a16 T3.mm Z=14 (T_sim 8.863, T_mean 9.31) | 4.80% | <= 8% | PASS |
| 62 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 31 frames (m0 8.0000) | 1.379e-1 (frame 30, m=9.1032) | <= 1e-2 every frame | FAIL |
| 63 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 64 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -1.666e-1 / -1.666e-1 | info (not graded) | INFO |
| 65 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.582e-1 / 3.727e-1 | info (not graded) | INFO |
| 66 | t3a16 | a16 T4 peak count | 40 at frame 18 cell [6,8,0] (front x 8.50a) | info (not graded) | INFO |
| 67 | t3a16 | a16 T4 final histogram n:cells(Poisson(7.078)) | 1:582(55) 2:856(196) 3:703(462) 4:594(817) 5:583(1157) 6:810(1365) 7:982(1380) 8:1119(1221) 9:953(960) 10:740(680) 11:515(437) 12:262(258) 13:145(140) 14:87(71) 15:52(34) 16:34(15) 17:21(6) 18:20(2) 19:12(1) 20:13(0) 21:14(0) 22:10(0) 23:11(0) 24:13(0) 25:14(0) 26:17(0) 27:21(0) 28:17(0) 29:12(0) 30:22(0) 31:8(0) 32:7(0) 33:5(0) 34:2(0) 35:1(0) 37:1(0) 39:1(0) | info (not graded) | INFO |
| 68 | t3a16 | C3.fix2 a=16: max over steps and wall-adjacent particles of at-wall into-wall value n.(u_n + C_nn (x_wall - x_p)) | 2.776e-17 m/s (step 31) | <= 1e-12 m/s every step | PASS |
| 69 | t3a16 | a16 clamp counts: C_nn adjusted (total / per step max), u_n changed (d < 1e-3 h) | 5115486 / 31132; u_n changes 0 | info (not graded) | INFO |
| 70 | t3a16 | a16 clamp energy stage (grid KE after next P2G, with - without clamp), every step | 268 of 268 > 0; max 9.921e-6 J, sum 6.003e-4 J | <= 0 every step | FAIL |
| 71 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -33107 vs -32491.0; column region (x<a) -9685 vs -7736.1; mean |per-step difference| 15.51 | info (not graded) | INFO |
| 72 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [1.75e-4 / 2.78e-17 / 311 of 7902] [1.22e-4 / 1.39e-17 / 742 of 20026] [6.52e-5 / 6.94e-18 / 1042 of 30204] | info (not graded) | INFO |
| 73 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [8.92e-4 / 6.94e-18 / 28 of 2402] [1.82e-3 / 6.94e-18 / 10 of 517] [7.01e-6 / 3.47e-18 / 9 of 188] | info (not graded) | INFO |
| 74 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [7.70e-5 / 1.39e-17 / 186 of 8207] [9.06e-5 / 1.39e-17 / 198 of 8337] [6.43e-5 / 3.47e-18 / 211 of 8378] | info (not graded) | INFO |
| 75 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,30 | f1: [7.50 7.93 8.00 8.15 8.60 8.43] total 64236; f6: [8.23 8.25 7.59 8.13 8.15 7.82] total 42760; f11: [12.30 9.29 8.56 8.24 8.04 8.00] total 24602; f16: [15.00 11.16 8.73 8.51 8.34 7.61] total 15480; f21: [15.79 11.06 10.02 6.92 0.00 0.00] total 11213; f26: [16.36 13.09 7.26 0.00 0.00 0.00] total 9396; f30: [16.91 14.64 1.92 0.00 0.00 0.00] total 8568 | info (not graded) | INFO |
| 76 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.934 / 2.972 / -0.039; 3.67% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.241 / 3.275 / -0.034; 4.20% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.468 / 4.499 / -0.031; 0.64% | Z=7: 5.109 / 5.140 / -0.031; 0.38% | Z=8: 5.665 / 5.712 / -0.046; -0.43% | Z=9: 6.233 / 6.221 / +0.012; -1.06% | Z=10: 6.757 / 6.799 / -0.042; -1.06% | Z=11: 7.328 / 7.333 / -0.005; -1.50% | Z=12: 7.796 / 7.880 / -0.084; -3.51% | Z=13: 8.365 / 8.358 / +0.007; -3.52% | Z=14: 8.863 / 8.891 / -0.028; -4.80% | info (not graded) | INFO |
| 77 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 2.1431 m/s (1.0120 U_R, frame 28) | < U_R = 2.1178 m/s every frame | FAIL |
| 78 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.4167 U_R | info (not graded) | INFO |
| 79 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 15) |
| 80 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 154 > 0 | <= 0 every step | PASS |
| 81 | t3a8 | a8 P.res max true residual | 9.757e-9 | <= 1e-8 | PASS |
| 82 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 83 | t3a8 | a8 CFL / cap | max CFL 0.9913; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 154 | info (not graded) | INFO |
| 84 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 85 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 86 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 87 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 88 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 89 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.873, T_mean 1.83) | 2.38% | <= 8% | PASS |
| 90 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 91 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 92 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 93 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 94 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 95 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 96 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 97 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 98 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 99 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 100 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 101 | t3a8 | a8 T3.mm Z=7 (T_sim 5.172, T_mean 5.09) | 1.60% | <= 8% | PASS |
| 102 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 103 | t3a8 | a8 T3.mm Z=9 (T_sim 6.369, T_mean 6.3) | 1.10% | <= 8% | PASS |
| 104 | t3a8 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 105 | t3a8 | a8 T3.mm Z=11 (T_sim 7.416, T_mean 7.44) | 0.33% | <= 8% | PASS |
| 106 | t3a8 | a8 T3.mm Z=12 (T_sim 7.982, T_mean 8.08) | 1.22% | <= 8% | PASS |
| 107 | t3a8 | a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 108 | t3a8 | a8 T3.mm Z=14 (T_sim 9.063, T_mean 9.31) | 2.66% | <= 8% | PASS |
| 109 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 1.610e-1 (frame 27, m=9.2880) | <= 1e-2 every frame | FAIL |
| 110 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 111 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -1.335e-1 / -1.370e-1 | info (not graded) | INFO |
| 112 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.382e-1 / 3.259e-1 | info (not graded) | INFO |
| 113 | t3a8 | a8 T4 peak count | 31 at frame 17 cell [1,3,0] (front x 7.88a) | info (not graded) | INFO |
| 114 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.980)) | 1:166(21) 2:224(62) 3:68(124) 4:73(185) 5:101(221) 6:141(221) 7:139(188) 8:119(141) 9:110(94) 10:80(56) 11:62(30) 12:23(15) 13:25(7) 14:15(3) 15:5(1) 16:2(0) 18:1(0) 21:2(0) 22:1(0) 23:5(0) 24:2(0) 25:1(0) 27:1(0) 29:2(0) 30:1(0) 31:1(0) | info (not graded) | INFO |
| 115 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 154 > 0 | <= 0 every step | PASS |
| 116 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 154 > 1e-8 KE_theta; max -1.524e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 117 | t3a8 | C3.fix2 a=8: max over steps and wall-adjacent particles of at-wall into-wall value n.(u_n + C_nn (x_wall - x_p)) | 2.776e-17 m/s (step 32) | <= 1e-12 m/s every step | PASS |
| 118 | t3a8 | a8 clamp counts: C_nn adjusted (total / per step max), u_n changed (d < 1e-3 h) | 714814 / 8222; u_n changes 0 | info (not graded) | INFO |
| 119 | t3a8 | a8 clamp energy stage (grid KE after next P2G, with - without clamp), every step | 153 of 153 > 0; max 3.967e-5 J, sum 1.650e-3 J | <= 0 every step | FAIL |
| 120 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -7096 vs -7942.2; column region (x<a) -2025 vs -1823.7; mean |per-step difference| 10.76 | info (not graded) | INFO |
| 121 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 1.9288 m/s (0.9108 U_R, frame 24) | < U_R = 2.1178 m/s every frame | PASS |
| 122 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.1131 U_R | info (not graded) | INFO |
| 123 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 10) |
| 124 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 125 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 P.res max true residual | 9.929e-9 | <= 1e-8 | PASS |
| 126 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 127 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 CFL / cap | max CFL 0.9918; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 128 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 129 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 130 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 131 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 132 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 133 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 134 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 135 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 136 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 137 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 138 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 139 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 140 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 141 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 142 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 143 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 144 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 145 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=7 (T_sim 5.254, T_mean 5.09) | 3.22% | <= 8% | PASS |
| 146 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 147 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 148 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 149 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 150 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=12 (T_sim 8.033, T_mean 8.08) | 0.58% | <= 8% | PASS |
| 151 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 152 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 153 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 1.376e-1 (frame 27, m=9.1009) | <= 1e-2 every frame | FAIL |
| 154 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 155 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T4 capped estimate final / min (rel V0) | -1.263e-1 / -1.320e-1 | info (not graded) | INFO |
| 156 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.420e-1 / 3.309e-1 | info (not graded) | INFO |
| 157 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T4 peak count | 35 at frame 28 cell [1,6,0] (front x 13.75a) | info (not graded) | INFO |
| 158 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 T4 final histogram n:cells(Poisson(5.962)) | 1:198(21) 2:173(63) 3:58(125) 4:82(187) 5:113(223) 6:157(221) 7:140(188) 8:121(140) 9:100(93) 10:84(55) 11:66(30) 12:39(15) 13:13(7) 14:10(3) 15:3(1) 16:1(0) 21:1(0) 22:3(0) 23:4(0) 25:3(0) 26:2(0) 27:3(0) | info (not graded) | INFO |
| 159 | fix2check@6c4214d | [on 6c4214d, must FAIL] C3.fix2 a=8: max over steps and wall-adjacent particles of at-wall into-wall value n.(u_n + C_nn (x_wall - x_p)) | 4.894e-1 m/s (step 158) | <= 1e-12 m/s every step | FAIL |
| 160 | fix2check@6c4214d | [on 6c4214d, must FAIL] a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -7179 vs -8084.8; column region (x<a) -2008 vs -1838.3; mean |per-step difference| 10.28 | info (not graded) | INFO |

Total graded: 84 PASS, 16 FAIL

## Notes (Coding Expert)
- Gate 1 (`gate1/`) is 65/65 PASS with 0 flips against both step 3 and step 7. Twenty graded values changed, all at the roundoff/floor level.
- Fix 2 changes the motion (the fix-1 run was bit-identical; this one is not). C3.fix2 passes: the at-wall into-wall value is at most 2.8e-17. On 6c4214d it fails with 0.489 m/s, so the test is valid.
- **The clamp energy stage FAILS on every step at both resolutions.** Grid KE after the next P2G is higher with the clamp than without it: a16 is 268 of 268 steps (max 9.9e-6 J, sum 6.0e-4 J) and a8 is 153 of 153. No u_n changes occurred (d < 1e-3 h: 0 cases), so the stage measures the C_nn change alone.
- **New Ritter FAIL:** the windowed speed is 1.0120 U_R at a16 (frame 26) and at a8 (frame 28). It was 0.978 and 0.911 at fix 1.
- T4 still FAILS: 13.79% at a16 (was 14.27%) and 16.10% at a8 (was 13.76%).
- **The C3.separation push-out spike is a setup artefact.** It happens at step 1 (t = 0). Particle #7696 was seeded at z = 7e-6 m, below the wall clearance r = 0.25 h/2 = 1.95e-3 m, because jitter 0.5 reaches the wall. The wall strip lifts it 1.946e-3 m (dE 9.1e-6 J). That step's total is 4.51e-3 J, which is the whole run's push-out cumulative. C3.tilted_tank shows the same step-1 spike with the same particle.
