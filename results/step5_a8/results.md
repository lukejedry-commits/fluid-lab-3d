# Step 5: T3 a=8 run + pressure-stage weighting diagnosis

- Code commit the runs executed at: f78daa9 (clean tree)
- spec/ASSERTS.md md5 c0351431c02b82f487a1edf9d72e0961; spec/mm_1952.json md5 ff0ebad4590c77abc266084718656220
- PE zero: floor z=0
- Front (section Z): bottom cell layer, per y column right face x of furthest cell with >= 4 particles, median over y; Z = x/a from back wall; T = t sqrt(2g/a) shifted to 1.19 at Z = 1.44
- T4 (section Z): mean particles over interior cells (>= 1 particle, all in-box 26 neighbours >= 1) within 1% of frame-0 mean every frame

| # | Check | Measured | Threshold | Result |
|---|---|---|---|---|
| 1 | a=8 Ritter: max front speed (section-Z front) over 159 substep samples (t=0.3611 s) | 7.7153 m/s (3.6430 of limit) | < 2.1178 m/s | FAIL |
| 2 | a=8 T3.E: max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (steps where E rose step-to-step: 10) |
| 3 | a=8 pressure-stage dE <= 0 every step | 2 of 159 steps > 0; max 1.993e-5 J | <= 0 every step | FAIL |
| 4 | a=8 P.res max true residual | 9.929e-9 | <= 1e-8 | PASS |
| 5 | a=8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 6 | a=8 CFL used per frame | max 0.9918, min 0.6176; frames with cap (8) binding and CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 7 | a=8 energy loss vs sum 1/2 M g^2 dt^2 (section Z: info only, not leak evidence) | 2.242e-2 J vs 3.751e-2 J | info (not graded) | INFO |
| 8 | a=8 T3.mm shift (T = t sqrt(2g/a) + shift; T=1.19 at Z=1.44) | 0.4159 | info (not graded) | INFO |
| 9 | a=8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 10 | a=8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 11 | a=8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 12 | a=8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 13 | a=8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 14 | a=8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 15 | a=8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 16 | a=8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 17 | a=8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 18 | a=8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 19 | a=8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 20 | a=8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 21 | a=8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 22 | a=8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 23 | a=8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 24 | a=8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 25 | a=8 T3.mm Z=7 (T_sim 5.254, T_mean 5.09) | 3.22% | <= 8% | PASS |
| 26 | a=8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 27 | a=8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 28 | a=8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 29 | a=8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 30 | a=8 T3.mm Z=12 (T_sim 8.033, T_mean 8.08) | 0.58% | <= 8% | PASS |
| 31 | a=8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 32 | a=8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 33 | a=8 T4 interior-cell mean particles/cell, max |m-m0|/m0 over 33 frames (m0=8.0000; walls: out-of-box neighbours not required) | 1.376e-1 (frame 27, m=9.1009, 347 cells) | <= 1e-2 every frame | FAIL |
| 34 | a=8 T4 same with strict reading (out-of-box neighbours disqualify wall cells) | 3.750e-1 (m0=8.0000) | info (not graded) | INFO |
| 35 | a=8 T4 particle count exact | 8192 | == 8192 | PASS |
| 36 | a=8 T4 capped estimator sum min(n,8) h^3/8: min / final rel. to V0 | -1.320e-1 / -1.263e-1 | info (not graded) | INFO |
| 37 | a=8 T4 fraction of particles in cells n>12: max over frames / final | 1.420e-1 / 9.241e-2 | info (not graded) | INFO (Poisson(8) reference 11.19%) |
| 38 | a=8 T4 fraction of fluid cells n>8: max over frames / final | 3.309e-1 / 2.416e-1 | info (not graded) | INFO |
| 39 | a=8 T4 peak particles/cell (max over frames) and location | 35 at frame 28, cell [1,6,0], column; final frame peak 27 (column) | info (not graded) | INFO |
| 40 | a=8 T4 final-frame histogram n:cells (Poisson(5.962) expected, conditioned n>=1) | 1:198(21) 2:173(63) 3:58(125) 4:82(187) 5:113(223) 6:157(221) 7:140(188) 8:121(140) 9:100(93) 10:84(55) 11:66(30) 12:39(15) 13:13(7) 14:10(3) 15:3(1) 16:1(0) 21:1(0) 22:3(0) 23:4(0) 25:3(0) 26:2(0) 27:3(0) | info (not graded) | INFO |
| 41 | a=8 pressure stage in solver weighting (unit density rho h^3 on every m_f>0 face): steps with dKE > 0 | 5 of 159; max 6.500e-4 J | info (not graded) | INFO |
| 42 | a=8 step 98 (t=0.3639): pressure-stage dKE, one-face-mass (m_f) vs solver weighting | 1.762e-5 J (logged stage 1.762e-5) vs 6.500e-4 J | info (not graded) | INFO |
| 43 | a=8 step 98 face class wall | 1375 faces; dKE m_f -4.798e-5 J (positive part 0.000e+0); dKE solver -9.072e-5 J | info (not graded) | INFO |
| 44 | a=8 step 98 face class fluid-fluid | 575 faces; dKE m_f -1.716e-5 J (positive part 7.104e-5); dKE solver -1.371e-5 J | info (not graded) | INFO |
| 45 | a=8 step 98 face class fluid-fluid [m_f<full] | 1544 faces; dKE m_f 4.560e-6 J (positive part 1.910e-4); dKE solver 2.611e-5 J | info (not graded) | INFO |
| 46 | a=8 step 98 face class surface-partial(air cell has particles, theta=f_a+1/2) [m_f<full] | 363 faces; dKE m_f -6.225e-5 J (positive part 4.510e-5); dKE solver -1.215e-4 J | info (not graded) | INFO |
| 47 | a=8 step 98 face class surface(empty air cell) [m_f<full] | 491 faces; dKE m_f 1.403e-4 J (positive part 2.465e-4); dKE solver 8.498e-4 J | info (not graded) | INFO |
| 48 | a=8 step 98 face class surface-partial(air cell has particles, theta=f_a+1/2) | 1 faces; dKE m_f 1.313e-7 J (positive part 1.313e-7); dKE solver 9.357e-8 J | info (not graded) | INFO |
| 49 | a=8 step 157 (t=0.5278): pressure-stage dKE, one-face-mass (m_f) vs solver weighting | 1.993e-5 J (logged stage 1.993e-5) vs -9.521e-4 J | info (not graded) | INFO |
| 50 | a=8 step 157 face class wall | 1999 faces; dKE m_f -9.471e-5 J (positive part 0.000e+0); dKE solver -1.703e-3 J | info (not graded) | INFO |
| 51 | a=8 step 157 face class fluid-fluid | 387 faces; dKE m_f 2.968e-7 J (positive part 1.723e-5); dKE solver 7.968e-7 J | info (not graded) | INFO |
| 52 | a=8 step 157 face class fluid-fluid [m_f<full] | 1300 faces; dKE m_f 2.319e-5 J (positive part 2.085e-4); dKE solver 4.092e-5 J | info (not graded) | INFO |
| 53 | a=8 step 157 face class surface-partial(air cell has particles, theta=f_a+1/2) [m_f<full] | 507 faces; dKE m_f -7.553e-5 J (positive part 7.901e-5); dKE solver -1.578e-4 J | info (not graded) | INFO |
| 54 | a=8 step 157 face class surface(empty air cell) [m_f<full] | 575 faces; dKE m_f 1.730e-4 J (positive part 2.318e-4); dKE solver 8.713e-4 J | info (not graded) | INFO |
| 55 | a=8 step 157 face class surface(empty air cell) | 9 faces; dKE m_f -2.868e-6 J (positive part 2.282e-7); dKE solver -2.341e-6 J | info (not graded) | INFO |
| 56 | a=8 step 157 face class surface-partial(air cell has particles, theta=f_a+1/2) | 9 faces; dKE m_f -3.450e-6 J (positive part 7.629e-9); dKE solver -2.376e-6 J | info (not graded) | INFO |

Total graded: 24 PASS, 5 FAIL
