# Step 6 diagnostics

- Code commit the runs executed at: 42cf1bc (clean tree)
- spec/ASSERTS.md md5 a9a9f10c18b1af2b098f57c6199368b2; PHYSICS_SPEC.md md5 8cacb3da1aa2c5215473ac5160617552
- PE zero: floor z=0. Substep cap 16 (v1 default). a = 2.25*0.0254 = 0.05715 m (test/run_step6_diag.js runT3; same expression as test/run_step5.js:60)

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
| 39 | t3a16 | a16 corner cell [2,12,1]: particle count per substep (min / max / final; substep of max) | 0 / 34 (step 252, t=0.4773) / 32; fluid-classified at end: 1 | info (not graded) | INFO |
| 40 | t3a16 | a16 post-G2P into-wall velocity, particles in floor (z-) wall-adjacent cells | count per step mean 19781.3, max 35404; max |v_n| 4.284e-1 m/s | info (not graded) | INFO |
| 41 | t3a16 | a16 post-G2P into-wall velocity, particles in back wall (x-) wall-adjacent cells | count per step mean 39.6, max 167; max |v_n| 1.532e-1 m/s | info (not graded) | INFO |
| 42 | t3a16 | a16 post-G2P into-wall velocity, particles in side walls (y-, y+) wall-adjacent cells | count per step mean 3558.1, max 5607; max |v_n| 3.873e-1 m/s | info (not graded) | INFO |
| 43 | t3a16 | a16 push-out (wall strip + separation) in 3x3x3 region around [2,12,1]: particles moved per step (mean/max), total displacement per step (mean/max) | 241.1 / 358; 1.097e-3 / 5.666e-3 m | info (not graded) | INFO |
| 44 | t3a16 | a16 cell [2,12,1] net outflow: trilinear field (8x8 surface quadrature) vs MAC face flux (m^3/s) | trilinear max 3.535e-7 min -6.092e-6; grid max |.| 8.091e-6; time-integrated outflow trilinear -9.394e-8 m^3 (-2.061 cell volumes) vs grid -9.750e-8 m^3; scale h^2 sqrt(g a) = 9.553e-6 | info (not graded) | INFO |
| 45 | t3a16 | a16 padding (inside-solid) faces after extension, frame 10 | {"tangentialMirror":61152,"tangentialOther":0,"normalZero":29952,"normalNonzero":0} | info (not graded) | INFO (src/sim.js:249-252: tangential = copy of the in-box image face (free-slip mirror), normal = 0) |
| 46 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 1.9288 m/s (0.9108 U_R, frame 24) | < U_R = 2.1178 m/s every frame | PASS |
| 47 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.1131 U_R | info (not graded) | INFO |
| 48 | t3a8 | a8 step 5 (t=0.0444): theta-weighted pressure-stage dKE (m_f -2.700e-4, solver 1.997e-4, theta excl. walls -3.373e-4) | -3.929e-4 J | <= 1e-8 x KE_theta,pre = 2.458e-10 J | PASS (wall: -5.558e-5; fluid-fluid: -5.248e-4; surface-empty: 8.960e-5; surface-partial: 9.794e-5) |
| 49 | t3a8 | a8 step 6 (t=0.0500): theta-weighted pressure-stage dKE (m_f -4.124e-4, solver 2.406e-5, theta excl. walls -4.041e-4) | -4.621e-4 J | <= 1e-8 x KE_theta,pre = 3.097e-10 J | PASS (wall: -5.793e-5; fluid-fluid: -6.666e-4; surface-empty: 9.381e-5; surface-partial: 1.687e-4) |
| 50 | t3a8 | a8 step 7 (t=0.0556): theta-weighted pressure-stage dKE (m_f -4.317e-4, solver 4.273e-5, theta excl. walls -4.696e-4) | -5.292e-4 J | <= 1e-8 x KE_theta,pre = 3.632e-10 J | PASS (wall: -5.960e-5; fluid-fluid: -6.217e-4; surface-empty: 1.880e-4; surface-partial: -3.601e-5) |
| 51 | t3a8 | a8 step 13 (t=0.0833): theta-weighted pressure-stage dKE (m_f -4.531e-4, solver 4.635e-5, theta excl. walls -5.335e-4) | -5.778e-4 J | <= 1e-8 x KE_theta,pre = 7.127e-10 J | PASS (wall: -4.432e-5; fluid-fluid: -6.991e-4; surface-empty: -2.669e-5; surface-partial: 1.923e-4) |
| 52 | t3a8 | a8 step 98 (t=0.3639): theta-weighted pressure-stage dKE (m_f 1.762e-5, solver 6.500e-4, theta excl. walls -9.833e-5) | -1.890e-4 J | <= 1e-8 x KE_theta,pre = 1.832e-9 J | PASS (wall: -9.072e-5; fluid-fluid: 1.240e-5; surface-partial: -9.216e-5; surface-empty: -1.856e-5) |
| 53 | t3a8 | a8 step 157 (t=0.5278): theta-weighted pressure-stage dKE (m_f 1.993e-5, solver -9.521e-4, theta excl. walls -6.718e-5) | -1.770e-3 J | <= 1e-8 x KE_theta,pre = 2.122e-9 J | PASS (wall: -1.703e-3; fluid-fluid: 4.172e-5; surface-partial: -1.114e-4; surface-empty: 2.512e-6) |
| 54 | t3a8 | a8 theta-weighted measure over all steps: steps above tolerance | 0 of 159 | info (not graded) | INFO |
| 55 | still | C3.still_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter uniform in 2x2x2 sub-cells, cap 16, 120 frames (2 s) | info (not graded) | INFO |
| 56 | still | C3.still_tank interior mean within 1% of 8, every frame | 3.268e-4 (frame 116, m=7.9974) | <= 1e-2 | PASS |
| 57 | still | C3.still_tank peak cell count, every frame | 13 (frame 28, cell [31,16,31]) | <= 16 | PASS |
| 58 | still | C3.still_tank energy max (E-E0)/|E0| | 1.648e-5 | <= 1e-6 | FAIL |
| 59 | still | C3.still_tank max|u| at t=2 s | 1.703e-2 | < 2.215e-3 | FAIL |
| 60 | still | C3.still_tank cell [2,12,1] count: start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 61 | still | C3.still_tank cell [0,0,0] count: start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 62 | still | C3.still_tank cell [31,0,0] count: start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 63 | still | C3.still_tank cell [0,31,0] count: start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 64 | still | C3.still_tank cell [31,31,0] count: start / max / end | 8 / 8 / 8 | info (not graded) | INFO |

Total graded: 37 PASS, 3 FAIL

## Notes (Coding Expert)
- a = 2.25 * 0.0254 = 0.05715 m, from the T3 setup expression in `runT3` (test/run_step6_diag.js; identical to test/run_step5.js:60 and test/run_step4_t3.js:39). At a = 16 cells, h = 3.5719e-3 m.
- The windowed Ritter rows pass at both resolutions: 0.9782 U_R at a = 16 (W = 3) and 0.9108 U_R at a = 8 (W = 5).
- **Theta-weighted pressure energy at a = 8:** all 6 steps that are positive under any measure, including steps 98 and 157, are ≤ 0 in the theta weighting. 0 of 159 steps exceed the tolerance, so no symmetry check was needed. The positive values in the m_f and unit-solver weightings come from weighting the fluid–air faces differently from the operator's own energy norm.
- **C3.still_tank FAILS on the current code, but not through the rows that track bunching.** The interior mean stays within 0.033% and the peak count is 13, below the limit of 16. The corner cell and the four floor corners stay at 8 throughout. The failing rows are energy (+1.65e-5 |E0|) and max|u| at 2 s (1.70e-2 against 2.2e-3). The test does not reproduce the T3 corner clustering, so it may not catch the T4 bug as section Z intends. This needs a ruling.
- **Corner cell [2,12,1] at a = 16:** the count rises from 0 to a maximum of 34 (t = 0.477 s) and ends at 32, still fluid-classified. The net inflow integrated over time matches between the trilinear field (−2.06 cell volumes) and the MAC face flux (−2.14). Both show net inflow, and the large values occur while the cell is not fluid. No large divergence was found in the field particles are advected with.
- **Inside-solid padding faces** hold free-slip mirror copies for tangential components (61,152 faces) and zero for normal components (29,952 faces).
