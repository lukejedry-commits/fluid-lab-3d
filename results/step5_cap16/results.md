# Step 5: T3 cap-16 info run (a=16)

- Code commit the runs executed at: f78daa9 (clean tree)
- spec/ASSERTS.md md5 c0351431c02b82f487a1edf9d72e0961; spec/mm_1952.json md5 ff0ebad4590c77abc266084718656220
- PE zero: floor z=0
- Front (section Z): bottom cell layer, per y column right face x of furthest cell with >= 4 particles, median over y; Z = x/a from back wall; T = t sqrt(2g/a) shifted to 1.19 at Z = 1.44
- T4 (section Z): mean particles over interior cells (>= 1 particle, all in-box 26 neighbours >= 1) within 1% of frame-0 mean every frame

| # | Check | Measured | Threshold | Result |
|---|---|---|---|---|
| 1 | cap16 Ritter: max front speed (section-Z front) over 278 substep samples (t=0.5106 s) | 4.7149 m/s (2.2263 of limit) | < 2.1178 m/s | FAIL |
| 2 | cap16 T3.E: max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (steps where E rose step-to-step: 9) |
| 3 | cap16 pressure-stage dE <= 0 every step | 0 of 278 steps > 0 | <= 0 every step | PASS |
| 4 | cap16 P.res max true residual | 9.958e-9 | <= 1e-8 | PASS |
| 5 | cap16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 6 | cap16 CFL used per frame | max 0.9982, min 0.8016; frames with cap (16) binding and CFL>1: 0 of 31; substeps 278 | info (not graded) | INFO |
| 7 | cap16 energy loss vs sum 1/2 M g^2 dt^2 (section Z: info only, not leak evidence) | 1.977e-2 J vs 2.280e-2 J | info (not graded) | INFO |
| 8 | cap16 T3.mm shift (T = t sqrt(2g/a) + shift; T=1.19 at Z=1.44) | 0.3846 | info (not graded) | INFO |
| 9 | cap16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 10 | cap16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 11 | cap16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 12 | cap16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 13 | cap16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 14 | cap16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 15 | cap16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 16 | cap16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 17 | cap16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 18 | cap16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 19 | cap16 T3.mm Z=3.44 (T_sim 2.972, T_mean 2.83) | 5.03% | <= 8% | PASS |
| 20 | cap16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 21 | cap16 T3.mm Z=3.89 (T_sim 3.275, T_mean 3.11) | 5.31% | <= 8% | PASS |
| 22 | cap16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 23 | cap16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 24 | cap16 T3.mm Z=5.89 (T_sim 4.499, T_mean 4.44) | 1.33% | <= 8% | PASS |
| 25 | cap16 T3.mm Z=7 (T_sim 5.140, T_mean 5.09) | 0.99% | <= 8% | PASS |
| 26 | cap16 T3.mm Z=8 (T_sim 5.712, T_mean 5.69) | 0.38% | <= 8% | PASS |
| 27 | cap16 T3.mm Z=9 (T_sim 6.221, T_mean 6.3) | 1.25% | <= 8% | PASS |
| 28 | cap16 T3.mm Z=10 (T_sim 6.799, T_mean 6.83) | 0.45% | <= 8% | PASS |
| 29 | cap16 T3.mm Z=11 (T_sim 7.333, T_mean 7.44) | 1.44% | <= 8% | PASS |
| 30 | cap16 T3.mm Z=12 (T_sim 7.880, T_mean 8.08) | 2.47% | <= 8% | PASS |
| 31 | cap16 T3.mm Z=13 (T_sim 8.358, T_mean 8.67) | 3.60% | <= 8% | PASS |
| 32 | cap16 T3.mm Z=14 (T_sim 8.891, T_mean 9.31) | 4.50% | <= 8% | PASS |
| 33 | cap16 T4 interior-cell mean particles/cell, max |m-m0|/m0 over 32 frames (m0=8.0000; walls: out-of-box neighbours not required) | 1.427e-1 (frame 31, m=9.1416, 3898 cells) | <= 1e-2 every frame | FAIL |
| 34 | cap16 T4 same with strict reading (out-of-box neighbours disqualify wall cells) | 7.347e-2 (m0=8.0000) | info (not graded) | INFO |
| 35 | cap16 T4 particle count exact | 65536 | == 65536 | PASS |
| 36 | cap16 T4 capped estimator sum min(n,8) h^3/8: min / final rel. to V0 | -1.647e-1 / -1.647e-1 | info (not graded) | INFO |
| 37 | cap16 T4 fraction of particles in cells n>12: max over frames / final | 1.537e-1 / 1.537e-1 | info (not graded) | INFO (Poisson(8) reference 11.19%) |
| 38 | cap16 T4 fraction of fluid cells n>8: max over frames / final | 3.682e-1 / 3.371e-1 | info (not graded) | INFO |
| 39 | cap16 T4 peak particles/cell (max over frames) and location | 39 at frame 29, cell [5,4,0], column; final frame peak 36 (column) | info (not graded) | INFO |
| 40 | cap16 T4 final-frame histogram n:cells (Poisson(7.113) expected, conditioned n>=1) | 1:690(53) 2:851(190) 3:528(450) 4:502(801) 5:567(1139) 6:845(1351) 7:989(1373) 8:1135(1221) 9:976(965) 10:779(686) 11:498(444) 12:293(263) 13:171(144) 14:83(73) 15:57(35) 16:28(15) 17:26(6) 18:15(3) 19:12(1) 20:15(0) 21:12(0) 22:14(0) 23:4(0) 24:13(0) 25:8(0) 26:15(0) 27:11(0) 28:18(0) 29:16(0) 30:9(0) 31:13(0) 32:10(0) 33:6(0) 34:3(0) 36:1(0) | info (not graded) | INFO |
| 41 | cap16 vs cap8 (NM) Z=1.67: T 1.479 vs 1.479 | 0.00% | <= 1% (NM, info run) | PASS |
| 42 | cap16 vs cap8 (NM) Z=1.89: T 1.684 vs 1.684 | 0.00% | <= 1% (NM, info run) | PASS |
| 43 | cap16 vs cap8 (NM) Z=2.11: T 1.916 vs 1.916 | 0.00% | <= 1% (NM, info run) | PASS |
| 44 | cap16 vs cap8 (NM) Z=2.33: T 2.117 vs 2.117 | 0.00% | <= 1% (NM, info run) | PASS |
| 45 | cap16 vs cap8 (NM) Z=2.56: T 2.280 vs 2.280 | 0.00% | <= 1% (NM, info run) | PASS |
| 46 | cap16 vs cap8 (NM) Z=2.78: T 2.479 vs 2.479 | 0.00% | <= 1% (NM, info run) | PASS |
| 47 | cap16 vs cap8 (NM) Z=3: T 2.623 vs 2.623 | 0.00% | <= 1% (NM, info run) | PASS |
| 48 | cap16 vs cap8 (NM) Z=3.22: T 2.798 vs 2.798 | 0.00% | <= 1% (NM, info run) | PASS |
| 49 | cap16 vs cap8 (NM) Z=3.44: T 2.972 vs 2.972 | 0.00% | <= 1% (NM, info run) | PASS |
| 50 | cap16 vs cap8 (NM) Z=3.67: T 3.114 vs 3.114 | 0.00% | <= 1% (NM, info run) | PASS |
| 51 | cap16 vs cap8 (NM) Z=3.89: T 3.275 vs 3.250 | 0.76% | <= 1% (NM, info run) | PASS |
| 52 | cap16 vs cap8 (NM) Z=4.11: T 3.396 vs 3.386 | 0.28% | <= 1% (NM, info run) | PASS |
| 53 | cap16 vs cap8 (NM) Z=5: T 3.953 vs 3.975 | 0.54% | <= 1% (NM, info run) | PASS |
| 54 | cap16 vs cap8 (NM) Z=5.89: T 4.499 vs 4.486 | 0.30% | <= 1% (NM, info run) | PASS |
| 55 | cap16 vs cap8 (NM) Z=7: T 5.140 vs 5.133 | 0.15% | <= 1% (NM, info run) | PASS |
| 56 | cap16 vs cap8 (NM) Z=8: T 5.712 vs 5.673 | 0.68% | <= 1% (NM, info run) | PASS |
| 57 | cap16 vs cap8 (NM) Z=9: T 6.221 vs 6.265 | 0.70% | <= 1% (NM, info run) | PASS |
| 58 | cap16 vs cap8 (NM) Z=10: T 6.799 vs 6.805 | 0.09% | <= 1% (NM, info run) | PASS |
| 59 | cap16 vs cap8 (NM) Z=11: T 7.333 vs 7.346 | 0.18% | <= 1% (NM, info run) | PASS |
| 60 | cap16 vs cap8 (NM) Z=12: T 7.880 vs 7.835 | 0.58% | <= 1% (NM, info run) | PASS |
| 61 | cap16 vs cap8 (NM) Z=13: T 8.358 vs 8.375 | 0.21% | <= 1% (NM, info run) | PASS |
| 62 | cap16 vs cap8 (NM) Z=14: T 8.891 vs 8.928 | 0.42% | <= 1% (NM, info run) | PASS |

Total graded: 49 PASS, 2 FAIL
