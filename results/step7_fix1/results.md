# Step 7 at FIX 1 (theta surface face mass)

- Code commit the runs executed at: 6c4214d (clean tree)
- spec/ASSERTS.md md5 57a770903e62919dd1a9a23d3b81361e; PHYSICS_SPEC.md md5 8cacb3da1aa2c5215473ac5160617552
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 2 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 7.798e-4 (frame 77, m=8.0062, 27252 cells) | <= 1e-2 | PASS |
| 3 | tilted | C3.tilted_tank peak cell count, every frame | 18 (frame 52, cell [9,7,30]) | <= 16 | FAIL |
| 4 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 8.138e-6 | <= 1e-6 | FAIL |
| 5 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 0.000e+0 | <= 1e-6 | PASS |
| 6 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.660e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.001e+2; g2p -5.559e-1; extension 1.699e-1; advect -6.040e-2; pushout 4.531e-3 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 7 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 4.531e-3 J (1.478e-5 |E0|) / 4.510e-3 J / 40 of 120 | info (not graded) | INFO |
| 8 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.049e-1 / 2.007e-1 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.992, 7.992, 8.027, 8.002, 7.978 | info (not graded) | INFO |
| 15 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 16 | separation | C3.separation strict interior mean (info per section Z) | 2.963e-4 (frame 67, m=7.9976, 27000 cells) | info (not graded) | INFO |
| 17 | separation | C3.separation peak cell count (info) | 13 (frame 28, cell [31,16,31]) | info (not graded) | INFO |
| 18 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 1.648e-5 | <= 1e-6 | FAIL |
| 19 | separation | C3.separation cumulative stage energy at end (J) | p2g 1.174e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.398e-1; extension 2.128e-4; advect 5.233e-4; pushout 4.510e-3 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 20 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 4.510e-3 J (1.471e-5 |E0|) / 4.510e-3 J / 102 of 120 | info (not graded) | INFO |
| 21 | separation | C3.separation max|u| at t=2 s | 1.703e-2 | < 2.215e-3 | FAIL |
| 22 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 23 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 24 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 25 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 26 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 27 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.007, 7.995, 8.000 | info (not graded) | INFO |
| 28 | t3a16 | a16 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 3 frames | 2.0717 m/s (0.9782 U_R, frame 31) | < U_R = 2.1178 m/s every frame | PASS |
| 29 | t3a16 | a16 Ritter single-substep peak / frame-to-frame peak | 2.2263 U_R / 1.1131 U_R | info (not graded) | INFO |
| 30 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 9) |
| 31 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 278 > 0 | <= 0 every step | PASS |
| 32 | t3a16 | a16 P.res max true residual | 9.958e-9 | <= 1e-8 | PASS |
| 33 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 34 | t3a16 | a16 CFL / cap | max CFL 0.9982; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 278 | info (not graded) | INFO |
| 35 | t3a16 | a16 T3.mm shift | 0.3846 | info (not graded) | INFO |
| 36 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 37 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 38 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 39 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 40 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 41 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 42 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 43 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 44 | t3a16 | a16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 45 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 46 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.972, T_mean 2.83) | 5.03% | <= 8% | PASS |
| 47 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 48 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.275, T_mean 3.11) | 5.31% | <= 8% | PASS |
| 49 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 50 | t3a16 | a16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 51 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.499, T_mean 4.44) | 1.33% | <= 8% | PASS |
| 52 | t3a16 | a16 T3.mm Z=7 (T_sim 5.140, T_mean 5.09) | 0.99% | <= 8% | PASS |
| 53 | t3a16 | a16 T3.mm Z=8 (T_sim 5.712, T_mean 5.69) | 0.38% | <= 8% | PASS |
| 54 | t3a16 | a16 T3.mm Z=9 (T_sim 6.221, T_mean 6.3) | 1.25% | <= 8% | PASS |
| 55 | t3a16 | a16 T3.mm Z=10 (T_sim 6.799, T_mean 6.83) | 0.45% | <= 8% | PASS |
| 56 | t3a16 | a16 T3.mm Z=11 (T_sim 7.333, T_mean 7.44) | 1.44% | <= 8% | PASS |
| 57 | t3a16 | a16 T3.mm Z=12 (T_sim 7.880, T_mean 8.08) | 2.47% | <= 8% | PASS |
| 58 | t3a16 | a16 T3.mm Z=13 (T_sim 8.358, T_mean 8.67) | 3.60% | <= 8% | PASS |
| 59 | t3a16 | a16 T3.mm Z=14 (T_sim 8.891, T_mean 9.31) | 4.50% | <= 8% | PASS |
| 60 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 1.427e-1 (frame 31, m=9.1416) | <= 1e-2 every frame | FAIL |
| 61 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 62 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -1.647e-1 / -1.647e-1 | info (not graded) | INFO |
| 63 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.537e-1 / 3.682e-1 | info (not graded) | INFO |
| 64 | t3a16 | a16 T4 peak count | 39 at frame 29 cell [5,4,0] (front x 14.81a) | info (not graded) | INFO |
| 65 | t3a16 | a16 T4 final histogram n:cells(Poisson(7.113)) | 1:690(53) 2:851(190) 3:528(450) 4:502(801) 5:567(1139) 6:845(1351) 7:989(1373) 8:1135(1221) 9:976(965) 10:779(686) 11:498(444) 12:293(263) 13:171(144) 14:83(73) 15:57(35) 16:28(15) 17:26(6) 18:15(3) 19:12(1) 20:15(0) 21:12(0) 22:14(0) 23:4(0) 24:13(0) 25:8(0) 26:15(0) 27:11(0) 28:18(0) 29:16(0) 30:9(0) 31:13(0) 32:10(0) 33:6(0) 34:3(0) 36:1(0) | info (not graded) | INFO |
| 66 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.40e-3 / 2.38e-1 / 6715 of 8137] [-5.36e-4 / 5.82e-2 / 16341 of 20541] [-3.71e-4 / 2.00e-2 / 24140 of 31079] | info (not graded) | INFO |
| 67 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [8.11e-4 / 1.02e-1 / 586 of 2357] [1.95e-4 / 7.37e-2 / 228 of 491] [-3.42e-3 / 2.57e-2 / 197 of 199] | info (not graded) | INFO |
| 68 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [8.36e-6 / 1.69e-1 / 3497 of 8219] [2.40e-5 / 4.78e-2 / 3784 of 8300] [1.15e-5 / 3.53e-2 / 3926 of 8284] | info (not graded) | INFO |
| 69 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,31 | f1: [7.50 7.93 8.00 8.15 8.60 8.43] total 64236; f6: [8.23 8.25 7.61 8.11 8.15 7.82] total 42759; f11: [12.58 9.31 8.54 8.15 8.09 8.02] total 24620; f16: [14.93 10.54 8.54 8.49 8.02 8.16] total 15455; f21: [15.11 10.91 9.79 7.31 0.01 0.00] total 11042; f26: [15.82 12.56 7.63 0.00 0.00 0.00] total 9218; f31: [16.23 14.00 1.15 0.00 0.00 0.00] total 8033 | info (not graded) | INFO |
| 70 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 1.9288 m/s (0.9108 U_R, frame 24) | < U_R = 2.1178 m/s every frame | PASS |
| 71 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.1131 U_R | info (not graded) | INFO |
| 72 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 10) |
| 73 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 74 | t3a8 | a8 P.res max true residual | 9.929e-9 | <= 1e-8 | PASS |
| 75 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 76 | t3a8 | a8 CFL / cap | max CFL 0.9918; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 77 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 78 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 79 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 80 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 81 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 82 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 83 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 84 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 85 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 86 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 87 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 88 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 89 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 90 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 91 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 92 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 93 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 94 | t3a8 | a8 T3.mm Z=7 (T_sim 5.254, T_mean 5.09) | 3.22% | <= 8% | PASS |
| 95 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 96 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 97 | t3a8 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 98 | t3a8 | a8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 99 | t3a8 | a8 T3.mm Z=12 (T_sim 8.033, T_mean 8.08) | 0.58% | <= 8% | PASS |
| 100 | t3a8 | a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 101 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 102 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 1.376e-1 (frame 27, m=9.1009) | <= 1e-2 every frame | FAIL |
| 103 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 104 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -1.263e-1 / -1.320e-1 | info (not graded) | INFO |
| 105 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.420e-1 / 3.309e-1 | info (not graded) | INFO |
| 106 | t3a8 | a8 T4 peak count | 35 at frame 28 cell [1,6,0] (front x 13.75a) | info (not graded) | INFO |
| 107 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.962)) | 1:198(21) 2:173(63) 3:58(125) 4:82(187) 5:113(223) 6:157(221) 7:140(188) 8:121(140) 9:100(93) 10:84(55) 11:66(30) 12:39(15) 13:13(7) 14:10(3) 15:3(1) 16:1(0) 21:1(0) 22:3(0) 23:4(0) 25:3(0) 26:2(0) 27:3(0) | info (not graded) | INFO |
| 108 | t3a8 | a8 pressure-stage dKE, own-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 109 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.659e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |

Total graded: 58 PASS, 8 FAIL

## Notes (Coding Expert)
- Gate 1 full set (`gate1/`) is 65/65 PASS with 0 flips against step3_gate1_amend. Every graded measured value is identical.
- **Fix 1 changes measurement only; the motion is bit-identical.** The T3 a=16 per-step E is identical to step6_diag over all 278 steps, and the C3.tilted_tank frames match pre-fix exactly (E, peak, interior mean). The theta face mass enters only the grid-energy measure and the ghost-fill weights. Ghost-filled faces are overwritten by projection and extension before G2P, so particle velocities are unchanged. What changed: the a=8 pressure-stage row in the own-mass measure is now 0 of 159 (it was 2), and the p2g/g2p stage split moved. The T4 fail (14.27%), the C3.tilted_tank peak fail (18) and the C3.separation fails (push-out energy, max|u|) are unchanged.
- PHYSICS_SPEC 7.1 as copied (8cacb3da) still says "unit density on every fluid-carrying face". Fix 1 was implemented as instructed, but the spec text does not yet describe theta face masses.
- Info (a): the APIC field evaluated at the floor points into the wall for most floor-adjacent particles in every third of the run: 6715/8137, then 16341/20541, then 24140/31079. The max into-wall speed falls from 0.24 to 0.020 m/s. At the back wall, the late third shows 197 of 199 particles with into-wall u_n (mean −3.4e-3). At the side walls the mean u_n is about 0 with roughly 45% into-wall.
- Info (b): in the column region (x < a), the bottom layers densify as the column drains. Layer k=0 goes 7.50 → 12.58 (f11) → 14.93 (f16) → 16.23 (f31) particles/cell, and k=1 goes 7.93 → 14.00. The column total falls from 64236 to 8033.
