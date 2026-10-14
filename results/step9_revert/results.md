# Step 9 C3.revert (fix-2 clamp reverted, zero normal velocity at solid faces kept)

- Code commit the runs executed at: d5ea89d (clean tree)
- spec/ASSERTS.md md5 8147c6cbe4c22b929a2a1b4dbce0ff96; PHYSICS_SPEC.md md5 022b7d666acd739a516fb5050c672377
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | t3a16 | a16 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 3 frames | 2.0717 m/s (0.9782 U_R, frame 31) | < U_R = 2.1178 m/s every frame | PASS |
| 2 | t3a16 | a16 Ritter single-substep peak / frame-to-frame peak | 2.2263 U_R / 1.1131 U_R | info (not graded) | INFO |
| 3 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 9) |
| 4 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 278 > 0 | <= 0 every step | PASS |
| 5 | t3a16 | a16 P.res max true residual | 9.958e-9 | <= 1e-8 | PASS |
| 6 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 7 | t3a16 | a16 CFL / cap | max CFL 0.9982; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 278 | info (not graded) | INFO |
| 8 | t3a16 | a16 T3.mm shift | 0.3846 | info (not graded) | INFO |
| 9 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 10 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 11 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 12 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 13 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 14 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 15 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 16 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 17 | t3a16 | a16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 18 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 19 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.972, T_mean 2.83) | 5.03% | <= 8% | PASS |
| 20 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 21 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.275, T_mean 3.11) | 5.31% | <= 8% | PASS |
| 22 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 23 | t3a16 | a16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 24 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.499, T_mean 4.44) | 1.33% | <= 8% | PASS |
| 25 | t3a16 | a16 T3.mm Z=7 (T_sim 5.140, T_mean 5.09) | 0.99% | <= 8% | PASS |
| 26 | t3a16 | a16 T3.mm Z=8 (T_sim 5.712, T_mean 5.69) | 0.38% | <= 8% | PASS |
| 27 | t3a16 | a16 T3.mm Z=9 (T_sim 6.221, T_mean 6.3) | 1.25% | <= 8% | PASS |
| 28 | t3a16 | a16 T3.mm Z=10 (T_sim 6.799, T_mean 6.83) | 0.45% | <= 8% | PASS |
| 29 | t3a16 | a16 T3.mm Z=11 (T_sim 7.333, T_mean 7.44) | 1.44% | <= 8% | PASS |
| 30 | t3a16 | a16 T3.mm Z=12 (T_sim 7.880, T_mean 8.08) | 2.47% | <= 8% | PASS |
| 31 | t3a16 | a16 T3.mm Z=13 (T_sim 8.358, T_mean 8.67) | 3.60% | <= 8% | PASS |
| 32 | t3a16 | a16 T3.mm Z=14 (T_sim 8.891, T_mean 9.31) | 4.50% | <= 8% | PASS |
| 33 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 1.427e-1 (frame 31, m=9.1416) | <= 1e-2 every frame | FAIL |
| 34 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 35 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -1.647e-1 / -1.647e-1 | info (not graded) | INFO |
| 36 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.537e-1 / 3.682e-1 | info (not graded) | INFO |
| 37 | t3a16 | a16 T4 peak count | 39 at frame 29 cell [5,4,0] (front x 14.81a) | info (not graded) | INFO |
| 38 | t3a16 | a16 T4 final histogram n:cells(Poisson(7.113)) | 1:690(53) 2:851(190) 3:528(450) 4:502(801) 5:567(1139) 6:845(1351) 7:989(1373) 8:1135(1221) 9:976(965) 10:779(686) 11:498(444) 12:293(263) 13:171(144) 14:83(73) 15:57(35) 16:28(15) 17:26(6) 18:15(3) 19:12(1) 20:15(0) 21:12(0) 22:14(0) 23:4(0) 24:13(0) 25:8(0) 26:15(0) 27:11(0) 28:18(0) 29:16(0) 30:9(0) 31:13(0) 32:10(0) 33:6(0) 34:3(0) 36:1(0) | info (not graded) | INFO |
| 39 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -34134 vs -33387.8; column region (x<a) -9636 vs -7892.2; mean |per-step difference| 14.42 | info (not graded) | INFO |
| 40 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.40e-3 / 2.38e-1 / 6715 of 8137] [-5.36e-4 / 5.82e-2 / 16341 of 20541] [-3.71e-4 / 2.00e-2 / 24140 of 31079] | info (not graded) | INFO |
| 41 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [8.11e-4 / 1.02e-1 / 586 of 2357] [1.95e-4 / 7.37e-2 / 228 of 491] [-3.42e-3 / 2.57e-2 / 197 of 199] | info (not graded) | INFO |
| 42 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [8.36e-6 / 1.69e-1 / 3497 of 8219] [2.40e-5 / 4.78e-2 / 3784 of 8300] [1.15e-5 / 3.53e-2 / 3926 of 8284] | info (not graded) | INFO |
| 43 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,31 | f1: [7.50 7.93 8.00 8.15 8.60 8.43] total 64236; f6: [8.23 8.25 7.61 8.11 8.15 7.82] total 42759; f11: [12.58 9.31 8.54 8.15 8.09 8.02] total 24620; f16: [14.93 10.54 8.54 8.49 8.02 8.16] total 15455; f21: [15.11 10.91 9.79 7.31 0.01 0.00] total 11042; f26: [15.82 12.56 7.63 0.00 0.00 0.00] total 9218; f31: [16.23 14.00 1.15 0.00 0.00 0.00] total 8033 | info (not graded) | INFO |
| 44 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.972 / 2.972 / +0.000; 5.03% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.275 / 3.275 / +0.000; 5.31% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.499 / 4.499 / +0.000; 1.33% | Z=7: 5.140 / 5.140 / +0.000; 0.99% | Z=8: 5.712 / 5.712 / +0.000; 0.38% | Z=9: 6.221 / 6.221 / +0.000; -1.25% | Z=10: 6.799 / 6.799 / +0.000; -0.45% | Z=11: 7.333 / 7.333 / +0.000; -1.44% | Z=12: 7.880 / 7.880 / +0.000; -2.47% | Z=13: 8.358 / 8.358 / +0.000; -3.60% | Z=14: 8.891 / 8.891 / +0.000; -4.50% | info (not graded) | INFO |
| 45 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 1.9288 m/s (0.9108 U_R, frame 24) | < U_R = 2.1178 m/s every frame | PASS |
| 46 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.1131 U_R | info (not graded) | INFO |
| 47 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 10) |
| 48 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 49 | t3a8 | a8 P.res max true residual | 9.929e-9 | <= 1e-8 | PASS |
| 50 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 51 | t3a8 | a8 CFL / cap | max CFL 0.9918; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 52 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 53 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 54 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 55 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 56 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 57 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 58 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 59 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 60 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 61 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 62 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 63 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 64 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 65 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 66 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 67 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 68 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 69 | t3a8 | a8 T3.mm Z=7 (T_sim 5.254, T_mean 5.09) | 3.22% | <= 8% | PASS |
| 70 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 71 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 72 | t3a8 | a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 73 | t3a8 | a8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 74 | t3a8 | a8 T3.mm Z=12 (T_sim 8.033, T_mean 8.08) | 0.58% | <= 8% | PASS |
| 75 | t3a8 | a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 76 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 77 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 1.376e-1 (frame 27, m=9.1009) | <= 1e-2 every frame | FAIL |
| 78 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 79 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -1.263e-1 / -1.320e-1 | info (not graded) | INFO |
| 80 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.420e-1 / 3.309e-1 | info (not graded) | INFO |
| 81 | t3a8 | a8 T4 peak count | 35 at frame 28 cell [1,6,0] (front x 13.75a) | info (not graded) | INFO |
| 82 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.962)) | 1:198(21) 2:173(63) 3:58(125) 4:82(187) 5:113(223) 6:157(221) 7:140(188) 8:121(140) 9:100(93) 10:84(55) 11:66(30) 12:39(15) 13:13(7) 14:10(3) 15:3(1) 16:1(0) 21:1(0) 22:3(0) 23:4(0) 25:3(0) 26:2(0) 27:3(0) | info (not graded) | INFO |
| 83 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 84 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.659e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 85 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -7179 vs -8084.8; column region (x<a) -2008 vs -1838.3; mean |per-step difference| 10.28 | info (not graded) | INFO |

Total graded: 56 PASS, 4 FAIL

## C3.revert (ASSERTS section Z 2026-10-14b), run with the OLD seeding
The reverted code behaves identically to fix 1 (6c4214d, as pushed in ff9836b). The bit-for-bit criterion therefore applies, and it is met with a difference of exactly 0:

| Check | Reverted | Fix 1 (step7_fix1) | Delta | Result |
|---|---|---|---|---|
| a16 Ritter (W=3) | 0.9782 U_R | 0.9782 U_R | 0 | PASS |
| a8 Ritter (W=5) | 0.9108 U_R | 0.9108 U_R | 0 | PASS |
| a16 T4 interior mean | 14.27% | 14.27% | 0 | PASS (match; T4 itself still FAIL vs 1%) |
| a8 T4 | 13.76% | 13.76% | 0 | PASS (match) |
| T3.mm a16 / a8, all rows | max abs dT = 0 | - | 0 | PASS |
| Per-step E and front, a16 (278 steps) / a8 (159) | max rel diff 0 | - | 0 | PASS (<= 1e-12) |
| Gate 1 | 65/65, 0 flips; every graded value identical to step 3 and step 7 | | | PASS |

Why it is identical: in fix 1, project() sets every wall-normal face to 0 before the solve and skips it in the update. extrapolate() treats wall faces as valid, so it never overwrites them, and it sets padding normal faces to 0. G2P therefore already read exactly 0 at index 0 and n (walls) and at -1 and n+1 (padding) along the normal axis. The explicit `solid ? 0 : V[...]` test only makes that guarantee independent of the grid state; it changes no value.
