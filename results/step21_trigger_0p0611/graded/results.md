# Step 21: push-out trigger 0.0611 h (code 286ed1b)

- Code commit the runs executed at: 286ed1b (clean tree)
- spec/ASSERTS.md md5 f476843a06923fc6974db076dfa0962b; PHYSICS_SPEC.md md5 d107f6e52ef3fc91f8b9fc3747acb3af
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 2 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 3 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 6.484e-4 (frame 94, m=8.0052, 27183 cells) | <= 1e-2 | PASS |
| 4 | tilted | C3.tilted_tank peak cell count, every frame | 16 (frame 28, cell [4,9,31]) | <= 16 | PASS |
| 5 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 0.000e+0 | <= 1e-6 | PASS |
| 6 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 0.000e+0 | <= 1e-6 | PASS |
| 7 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.865e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.001e+2; g2p -5.584e-1; extension 1.682e-1; advect -6.272e-2; pushout 1.963e-5; densfix 4.860e-4 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 8 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 1.963e-5 J (6.402e-8 |E0|) / 1.783e-6 J / 23 of 120 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank fix3 stage: signed sum of dPE over run | 4.860e-4 J (1.585e-6 |E0|) | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 2.356e-6 / 6.298e-5; 8 of 120 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 7.700e-2 / -2.003e-1 / 2.070e-1 (8) | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank fix3 ebar_T4 max |.| / steps with nonzero target | 6.093e-4 / 0 of 120 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank C3.fix3 target sum |sum e - target_r| / n_r, every step | 7.614e-18 | <= 1e-12 | PASS |
| 15 | tilted | C3.tilted_tank fix3 PCG iterations (mean / max) | 1.48 / 23 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0030 / 0 of 120 | info (not graded) | INFO |
| 17 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 9.636e-2 / 2.075e-1 | info (not graded) | INFO |
| 18 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.671e-7 J (-1.197e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 19 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 10 (t=0.1500 s): step dE 1.783e-6 J; top particle #260843 dE 3.688e-8 J, x0 [0.497495, 0.078511, 0.490851] m, dx [-1.990e-7, -1.665e-5, 7.883e-6] m, v before [2.326e-3, 1.948e-2, -6.500e-2] -> after [2.326e-3, 1.948e-2, -6.500e-2] m/s | info (not graded) | INFO |
| 20 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 21 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 22 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 23 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 24 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 25 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.993, 7.999, 8.023, 8.004, 7.970 | info (not graded) | INFO |
| 26 | tilted | [tilted] energy bookkeeping closure: max over 120 substeps |sum stage dE - dE_total| / |E| (worst at 32x32x40 step 28) | 1.593e-16 | <= 1e-12 | PASS |
| 27 | tilted | [tilted] push-out moved fraction per step, sim 32x32x40 (120 steps): mean / max | 2.740e-3 / 1.487e-2 | info (not graded) | INFO |
| 28 | tilted | [tilted] colvol surface cells on count-theta fallback per frame, sim 32x32x40 (120 frames): mean / max | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 29 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 30 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 31 | separation | C3.separation strict interior mean (info per section Z) | 4.630e-6 (frame 2, m=8.0000, 27000 cells) | info (not graded) | INFO |
| 32 | separation | C3.separation peak cell count (info) | 9 (frame 1, cell [13,17,7]) | info (not graded) | INFO |
| 33 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 6.232e-7 | <= 1e-6 | PASS |
| 34 | separation | C3.separation cumulative stage energy at end (J) | p2g 0.000e+0; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.307e-1; extension 0.000e+0; advect -3.280e-11; pushout 1.785e-11; densfix 1.910e-4 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 35 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | 1.785e-11 J (5.822e-14 |E0|) / 7.958e-13 J / 120 of 120 | info (not graded) | INFO |
| 36 | separation | C3.separation C3.separation anti-inflation (fix 3 on): |sum over steps of stage dPE| over 2 s | 1.910e-4 J (signed 1.910e-4 J; 6.232e-7 |E0|) | <= 1e-6 |E0| = 3.066e-4 J | PASS |
| 37 | separation | C3.separation fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 38 | separation | C3.separation fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 5.250e-7 / 3.150e-5; 2 of 120 | info (not graded) | INFO |
| 39 | separation | C3.separation fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 2.038e-1 / 2.008e-1 / 2.068e-1 (2) | info (not graded) | INFO |
| 40 | separation | C3.separation fix3 ebar_T4 max |.| / steps with nonzero target | 0.000e+0 / 0 of 120 | info (not graded) | INFO |
| 41 | separation | C3.separation C3.fix3 target sum |sum e - target_r| / n_r, every step | 9.389e-19 | <= 1e-12 | PASS |
| 42 | separation | C3.separation fix3 PCG iterations (mean / max) | 0.38 / 23 | info (not graded) | INFO |
| 43 | separation | C3.separation fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0030 / 0 of 120 | info (not graded) | INFO |
| 44 | separation | C3.separation max|u| at t=2 s | 1.214e-9 | < 2.215e-3 | PASS |
| 45 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 7.958e-13 J (2.596e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 46 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 1.002e-8 J; top particle #49381 dE 4.935e-9 J, x0 [0.445532, 0.002616, 0.107500] m, dx [3.144e-6, 0.000e+0, 1.055e-6] m, v before [5.893e-11, -4.508e-12, -5.234e-11] -> after [5.893e-11, -4.508e-12, -5.234e-11] m/s | info (not graded) | INFO |
| 47 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 48 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 49 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 50 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 51 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 52 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 8.001, 7.999, 8.000, 8.000, 8.000 | info (not graded) | INFO |
| 53 | separation | C3.separation trace: step of max (E-E0)/|E0| and cumulative stage energies there (J) | step 8 t=0.1333 s, rise 6.232e-7 |E0| = 1.910e-4 J; gravity+pressure 8.716e-3; p2g 0.000e+0; ghost 0.000e+0; g2p -8.716e-3; extension 0.000e+0; advect -9.095e-13; pushout 1.876e-12; densfix 1.910e-4 | info (not graded) | INFO |
| 54 | separation | C3.separation trace: sum of positive per-step stage dE over 2 s by stage (J) | gravity+pressure 1.307e-1; densfix 1.910e-4; advect 1.581e-10; pushout 1.785e-11 | info (not graded) | INFO |
| 55 | separation | C3.separation trace: max|u| (m/s) at t = 0, 0.25, 0.5, 1, 1.5, 2 s | 0.02: 1.182e-9; 0.25: 1.194e-9; 0.50: 1.198e-9; 1.00: 1.205e-9; 1.50: 1.210e-9; 2.00: 1.214e-9 | info (not graded) | INFO |
| 56 | separation | C3.separation trace: 5 largest per-step max|u| increases (step: d max|u|, then that step's g2p / extension / gravity+pressure / pushout dE) | 2: +3.882e-12, -1.089e-3 / 0.000e+0 / 1.089e-3 / 2.274e-13; 3: +2.316e-12, -1.089e-3 / 0.000e+0 / 1.089e-3 / 1.705e-13; 4: +1.443e-12, -1.089e-3 / 0.000e+0 / 1.089e-3 / 1.137e-13; 5: +9.564e-13, -1.089e-3 / 0.000e+0 / 1.089e-3 / 1.705e-13; 6: +6.754e-13, -1.089e-3 / 0.000e+0 / 1.089e-3 / 1.137e-13 | info (not graded) | INFO |
| 57 | separation | [separation] energy bookkeeping closure: max over 120 substeps |sum stage dE - dE_total| / |E| (worst at 32x32x40 step 3) | 9.271e-17 | <= 1e-12 | PASS |
| 58 | separation | [separation] push-out moved fraction per step, sim 32x32x40 (120 steps): mean / max | 7.705e-3 / 1.904e-2 | info (not graded) | INFO |
| 59 | separation | [separation] colvol surface cells on count-theta fallback per frame, sim 32x32x40 (120 frames): mean / max | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 60 | t3a16 | a16 Ritter short window W=3 frames: peak speed / U_R | 0.9950861 (frame 29) | <= 1 + q = 1.0337317 (q = 0.0337317) | PASS |
| 61 | t3a16 | a16 Ritter long window W_L=11 frames: peak speed / U_R | 0.9567546 (frame 29) | <= 1.0 | PASS |
| 62 | t3a16 | a16 Ritter single-substep peak (info) | 2.2263 U_R | info (not graded) | INFO |
| 63 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 78) |
| 64 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 278 > 0 | <= 0 every step | PASS |
| 65 | t3a16 | a16 P.res max true residual | 9.995e-9 | <= 1e-8 | PASS |
| 66 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 67 | t3a16 | a16 CFL / cap | max CFL 0.9972; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 278 | info (not graded) | INFO |
| 68 | t3a16 | a16 T3.mm shift | 0.3846 | info (not graded) | INFO |
| 69 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 70 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 71 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 72 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 73 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 74 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 75 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 76 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 77 | t3a16 | a16 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 78 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 79 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.934, T_mean 2.83) | 3.67% | <= 8% | PASS |
| 80 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 81 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.275, T_mean 3.11) | 5.31% | <= 8% | PASS |
| 82 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.396, T_mean 3.33) | 1.98% | <= 8% | PASS |
| 83 | t3a16 | a16 T3.mm Z=5 (T_sim 3.953, T_mean 4.02) | 1.66% | <= 8% | PASS |
| 84 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.499, T_mean 4.44) | 1.33% | <= 8% | PASS |
| 85 | t3a16 | a16 T3.mm Z=7 (T_sim 5.140, T_mean 5.09) | 0.99% | <= 8% | PASS |
| 86 | t3a16 | a16 T3.mm Z=8 (T_sim 5.696, T_mean 5.69) | 0.11% | <= 8% | PASS |
| 87 | t3a16 | a16 T3.mm Z=9 (T_sim 6.267, T_mean 6.3) | 0.52% | <= 8% | PASS |
| 88 | t3a16 | a16 T3.mm Z=10 (T_sim 6.785, T_mean 6.83) | 0.65% | <= 8% | PASS |
| 89 | t3a16 | a16 T3.mm Z=11 (T_sim 7.319, T_mean 7.44) | 1.63% | <= 8% | PASS |
| 90 | t3a16 | a16 T3.mm Z=12 (T_sim 7.862, T_mean 8.08) | 2.70% | <= 8% | PASS |
| 91 | t3a16 | a16 T3.mm Z=13 (T_sim 8.358, T_mean 8.67) | 3.60% | <= 8% | PASS |
| 92 | t3a16 | a16 T3.mm Z=14 (T_sim 8.891, T_mean 9.31) | 4.50% | <= 8% | PASS |
| 93 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 3.317e-2 (frame 12, m=8.2653) | <= 1e-2 every frame | FAIL |
| 94 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 95 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -9.425e-2 / -1.127e-1 | info (not graded) | INFO |
| 96 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 8.823e-2 / 3.568e-1 | info (not graded) | INFO |
| 97 | t3a16 | a16 T4 peak count | 32 at frame 12 cell [6,8,1] (front x 5.19a) | info (not graded) | INFO |
| 98 | t3a16 | a16 T4 final histogram n:cells(Poisson(6.802)) | 1:414(73) 2:460(248) 3:508(562) 4:705(956) 5:976(1301) 6:1227(1475) 7:1321(1433) 8:1238(1219) 9:1098(921) 10:788(626) 11:427(387) 12:273(220) 13:112(115) 14:59(56) 15:19(25) 16:7(11) 17:3(4) | info (not graded) | INFO |
| 99 | t3a16 | C3.fix3 a=16: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.1000 (stage incl. push-out 0.1015, info) | <= 0.1 | PASS |
| 100 | t3a16 | C3.fix3 a=16: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -1.025e-8 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 101 | t3a16 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a16: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 5.597e-3 J at step 278 (cum dPE 6.133e-3, PE_pack 5.353e-4) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 102 | t3a16 | C3.fix3 a=16: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 103 | t3a16 | C3.fix3 a=16: target sum, max over steps and regions of |sum e - target_r| / n_r | 7.980e-15 | <= 1e-12 every step | PASS |
| 104 | t3a16 | a16 fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target | 1.090e-2 / -2.108e-3 / 3.377e-2; 227 of 278 | info (not graded) | INFO |
| 105 | t3a16 | a16 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 1.502e-3 / 7.291e-3 | info (not graded) | INFO |
| 106 | t3a16 | a16 front displacement caused by the correction alone in each Ritter window (W = 3 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 3); at the worst Ritter window (frame 29): total 1.054e-1 m, by correction 0.000e+0 m (0.000 h), speed 0.9951 U_R, speed minus correction 0.9951 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 107 | t3a16 | a16 fix3 PCG iterations per step (mean / max; steps solved) | 10.6 / 18; 258 of 278 | info (not graded) | INFO |
| 108 | t3a16 | a16 fix3 max |dx|/h per step (mean / max) | 0.0383 / 0.1000 | info (not graded) | INFO |
| 109 | t3a16 | a16 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 9.226e-5 / 3.479e-3 | info (not graded) | INFO |
| 110 | t3a16 | a16 fix3 fraction of steps where the cap binds | 25 of 278 = 0.090; steps 58,59,65,66,67,68,70,76,77,78,79,80,81,82,83,84,85,86,88,98,99,102,107,108,111 | info (not graded) | INFO |
| 111 | t3a16 | a16 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 3.940e-2 / 8.347e-2 | info (not graded) | INFO |
| 112 | t3a16 | a16 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 1.354e-1 / -6.471e-2 / 3.543e-1; 256 of 278 | info (not graded) | INFO |
| 113 | t3a16 | a16 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 2.071e-2 / -4.433e-1 / 1.483e+0; 118.1 of 1898.8 | info (not graded) | INFO |
| 114 | t3a16 | a16 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 6.133e-3 J, max 1.617e-4 J; sum dKE -9.867e-8 J; PE_pack 5.353e-4 J (max 3.997e-3) | info (not graded) | INFO |
| 115 | t3a16 | C3.fix3 a=16: T3.mm worst graded row no worse than fix 1 (6.94%) | 6.94% | <= 6.94% | PASS |
| 116 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -32912 vs -33242.0; column region (x<a) -8267 vs -7748.7; mean |per-step difference| 14.92 | info (not graded) | INFO |
| 117 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.30e-3 / 2.08e-1 / 6248 of 7597] [-4.97e-4 / 3.06e-2 / 13618 of 17303] [-3.49e-4 / 2.59e-2 / 20712 of 26905] | info (not graded) | INFO |
| 118 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [9.02e-4 / 1.02e-1 / 590 of 2402] [8.91e-4 / 2.37e-2 / 218 of 806] [-1.38e-3 / 1.21e-2 / 359 of 420] | info (not graded) | INFO |
| 119 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [8.16e-6 / 1.39e-1 / 3418 of 8207] [1.94e-5 / 4.71e-2 / 3631 of 8301] [1.36e-5 / 4.57e-2 / 3890 of 8344] | info (not graded) | INFO |
| 120 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,31 | f1: [7.50 7.93 8.00 8.15 8.60 8.43] total 64236; f6: [8.27 8.23 7.60 8.12 8.16 7.83] total 42763; f11: [10.57 9.67 8.75 8.56 8.05 8.04] total 24629; f16: [8.07 8.76 8.73 8.49 8.40 8.43] total 15197; f21: [8.04 8.06 8.18 7.87 8.69 0.02] total 10458; f26: [8.01 8.14 7.51 6.98 0.00 0.00] total 7843; f31: [8.02 7.96 7.87 0.00 0.00 0.00] total 6109 | info (not graded) | INFO |
| 121 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.934 / 2.972 / -0.039; 3.67% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.275 / 3.275 / +0.000; 5.31% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.499 / 4.499 / +0.000; 1.33% | Z=7: 5.140 / 5.140 / +0.000; 0.99% | Z=8: 5.696 / 5.712 / -0.015; 0.11% | Z=9: 6.267 / 6.221 / +0.046; -0.52% | Z=10: 6.785 / 6.799 / -0.014; -0.65% | Z=11: 7.319 / 7.333 / -0.014; -1.63% | Z=12: 7.862 / 7.880 / -0.019; -2.70% | Z=13: 8.358 / 8.358 / +0.000; -3.60% | Z=14: 8.891 / 8.891 / +0.000; -4.50% | info (not graded) | INFO |
| 122 | t3a16 | a16 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.50 / 4 / 11 / 4:7 5:16 6:32 7:20 8:166 9:4 10:5 11:6; f5: 7.72 / 6 / 14 / 6:82 7:26 8:112 9:3 10:6 11:11 12:11 13:3 14:2; f10: 10.61 / 0 / 29 / 0:5 1:12 2:9 3:10 4:14 5:15 6:11 7:8 8:10 9:19 10:18 11:10 12:13 13:17 14:15 15:7 16:16 17:9 18:19 19:6 20:2 21:3 22:1 23:2 26:3 27:1 29:1; f15: 8.14 / 1 / 16 / 1:7 2:9 3:11 4:19 5:18 6:17 7:24 8:31 9:33 10:20 11:14 12:27 13:7 14:11 15:5 16:3; f20: 8.03 / 0 / 16 / 0:1 2:5 3:6 4:13 5:19 6:34 7:43 8:28 9:35 10:20 11:22 12:12 13:9 14:4 15:3 16:2; f25: 7.94 / 2 / 15 / 2:2 3:12 4:17 5:20 6:34 7:27 8:41 9:25 10:28 11:21 12:17 13:7 14:3 15:2; f31: 8.02 / 1 / 17 / 1:1 2:3 3:12 4:11 5:19 6:23 7:40 8:36 9:40 10:26 11:15 12:18 13:7 14:3 15:1 17:1 | info (not graded) | INFO |
| 123 | t3a16 | [t3a16] energy bookkeeping closure: max over 278 substeps |sum stage dE - dE_total| / |E| (worst at 256x16x40 step 72) | 1.424e-16 | <= 1e-12 | PASS |
| 124 | t3a16 | [t3a16] push-out moved fraction per step, sim 256x16x40 (278 steps): mean / max | 3.741e-2 / 6.934e-2 | info (not graded) | INFO |
| 125 | t3a16 | [t3a16] colvol surface cells on count-theta fallback per frame, sim 256x16x40 (31 frames): mean / max | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 126 | t3a8 | a8 Ritter short window W=5 frames: peak speed / U_R | 0.9714739 (frame 24) | <= 1 + q = 1.0404781 (q = 0.0404781) | PASS |
| 127 | t3a8 | a8 Ritter long window W_L=21 frames: peak speed / U_R | 0.8770250 (frame 32) | <= 1.0 | PASS |
| 128 | t3a8 | a8 Ritter single-substep peak (info) | 3.6430 U_R | info (not graded) | INFO |
| 129 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.704e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 30) |
| 130 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 131 | t3a8 | a8 P.res max true residual | 9.884e-9 | <= 1e-8 | PASS |
| 132 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 133 | t3a8 | a8 CFL / cap | max CFL 0.9913; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 134 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 135 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 136 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 137 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 138 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 139 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.873, T_mean 1.83) | 2.38% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 140 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 141 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 142 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be FAIL) |
| 143 | t3a8 | a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 144 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be FAIL) |
| 145 | t3a8 | a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 146 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 147 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 148 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 149 | t3a8 | a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 150 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 151 | t3a8 | a8 T3.mm Z=7 (T_sim 5.172, T_mean 5.09) | 1.60% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 152 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 153 | t3a8 | a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 154 | t3a8 | a8 T3.mm Z=10 (T_sim 6.927, T_mean 6.83) | 1.41% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 155 | t3a8 | a8 T3.mm Z=11 (T_sim 7.416, T_mean 7.44) | 0.33% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 156 | t3a8 | a8 T3.mm Z=12 (T_sim 7.982, T_mean 8.08) | 1.22% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 157 | t3a8 | a8 T3.mm Z=13 (T_sim 8.574, T_mean 8.67) | 1.11% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 158 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 159 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 5.077e-2 (frame 16, m=8.4062) | <= 1e-2 every frame | FAIL |
| 160 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 161 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -7.996e-2 / -1.211e-1 | info (not graded) | INFO |
| 162 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.031e-1 / 3.226e-1 | info (not graded) | INFO |
| 163 | t3a8 | a8 T4 peak count | 35 at frame 16 cell [1,5,0] (front x 7.25a) | info (not graded) | INFO |
| 164 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.725)) | 1:151(27) 2:151(77) 3:109(147) 4:123(210) 5:141(240) 6:163(229) 7:162(187) 8:134(134) 9:114(85) 10:86(49) 11:50(25) 12:28(12) 13:10(5) 14:6(2) 15:3(1) | info (not graded) | INFO |
| 165 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 166 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.688e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 167 | t3a8 | C3.fix3 a=8: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.0703 (stage incl. push-out 0.0703, info) | <= 0.1 | PASS |
| 168 | t3a8 | C3.fix3 a=8: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -8.664e-9 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 169 | t3a8 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a8: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 3.717e-3 J at step 156 (cum dPE 4.771e-3, PE_pack 1.054e-3) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 170 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 171 | t3a8 | C3.fix3 a=8: target sum, max over steps and regions of |sum e - target_r| / n_r | 7.068e-16 | <= 1e-12 every step | PASS |
| 172 | t3a8 | a8 fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target | 1.650e-2 / -4.350e-3 / 5.004e-2; 129 of 159 | info (not graded) | INFO |
| 173 | t3a8 | a8 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 8.319e-3 / 3.523e-2 | info (not graded) | INFO |
| 174 | t3a8 | a8 front displacement caused by the correction alone in each Ritter window (W = 5 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 5); at the worst Ritter window (frame 24): total 1.714e-1 m, by correction 0.000e+0 m (0.000 h), speed 0.9715 U_R, speed minus correction 0.9715 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 175 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 7.6 / 13; 140 of 159 | info (not graded) | INFO |
| 176 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0197 / 0.0703 | info (not graded) | INFO |
| 177 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 178 | t3a8 | a8 fix3 fraction of steps where the cap binds | 0 of 159 = 0.000 | info (not graded) | INFO |
| 179 | t3a8 | a8 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 7.742e-2 / 1.480e-1 | info (not graded) | INFO |
| 180 | t3a8 | a8 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 9.980e-2 / -2.085e-1 / 3.735e-1; 137 of 159 | info (not graded) | INFO |
| 181 | t3a8 | a8 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 9.560e-3 / -3.986e-1 / 1.531e+0; 27.0 of 252.2 | info (not graded) | INFO |
| 182 | t3a8 | a8 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 4.773e-3 J, max 2.084e-4 J; sum dKE -4.651e-8 J; PE_pack 1.185e-3 J (max 3.539e-3) | info (not graded) | INFO |
| 183 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 184 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.873 / 1.941 / -0.068; 2.38% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.868 / 2.868 / +0.000; 8.22% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 3.998 / 3.998 / +0.000; -0.54% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.172 / 5.254 / -0.082; 1.60% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.335 / 6.335 / +0.000; 0.55% | Z=10: 6.927 / 6.901 / +0.026; 1.41% | Z=11: 7.416 / 7.467 / -0.051; -0.33% | Z=12: 7.982 / 8.033 / -0.051; -1.22% | Z=13: 8.574 / 8.548 / +0.026; -1.11% | Z=14: 9.114 / 9.114 / +0.000; -2.10% | info (not graded) | INFO |
| 185 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -7279 vs -8152.1; column region (x<a) -2133 vs -1916.7; mean |per-step difference| 10.71 | info (not graded) | INFO |
| 186 | t3a8 | a8 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.56 / 4 / 9 / 4:2 5:2 6:5 7:8 8:43 9:4; f5: 7.78 / 6 / 12 / 6:17 7:9 8:30 11:3 12:5; f10: 10.14 / 1 / 20 / 1:4 2:3 3:4 4:1 5:5 6:3 7:2 8:5 9:2 10:3 11:4 12:2 13:2 14:4 15:4 16:9 17:4 18:2 20:1; f15: 10.23 / 0 / 27 / 0:2 1:7 2:9 3:6 4:6 5:2 8:2 10:1 11:1 12:2 13:5 14:1 15:3 18:1 19:3 22:3 23:1 24:2 25:2 26:4 27:1; f20: 8.67 / 1 / 18 / 1:1 2:1 3:5 4:2 5:3 6:8 7:2 8:6 9:9 10:5 11:7 12:8 13:4 14:1 16:1 18:1; f25: 8.05 / 1 / 14 / 1:1 2:1 3:4 4:2 5:5 6:5 7:8 8:10 9:7 10:10 11:3 12:3 13:1 14:4; f32: 8.72 / 3 / 15 / 3:1 4:2 5:5 6:8 7:10 8:12 9:5 10:4 11:2 12:5 13:2 14:5 15:3 | info (not graded) | INFO |
| 187 | t3a8 | [t3a8] energy bookkeeping closure: max over 159 substeps |sum stage dE - dE_total| / |E| (worst at 128x8x20 step 127) | 1.440e-16 | <= 1e-12 | PASS |
| 188 | t3a8 | [t3a8] push-out moved fraction per step, sim 128x8x20 (159 steps): mean / max | 7.043e-2 / 1.295e-1 | info (not graded) | INFO |
| 189 | t3a8 | [t3a8] colvol surface cells on count-theta fallback per frame, sim 128x8x20 (32 frames): mean / max | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 190 | sign | C3.fix3.sign v6 [production sign]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 16/16 outward (min dx.r 2.215e-6 m^2); splat nbar 10.481445 -> 10.413603 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 2.220e-18) | all outward AND splat nbar drops | PASS (test verdict PASS) |
| 191 | sign | C3.fix3.sign v6 [production sign]: splat nbar across the correction stage alone | 10.481445 -> 10.413603 (drops); correction max |dx|/h 0.00426 | info (not graded) | INFO |
| 192 | sign | C3.fix3.sign v6 [sign FLIPPED (must fail)]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 0/16 outward (min dx.r -5.255e-6 m^2); splat nbar 10.481445 -> 10.549454 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 2.220e-18) | all outward AND splat nbar drops | PASS (test verdict FAIL; row passes when the flipped sign fails) |
| 193 | sign | C3.fix3.sign v6 [sign FLIPPED (must fail)]: splat nbar across the correction stage alone | 10.481445 -> 10.549454 (rises); correction max |dx|/h 0.00426 | info (not graded) | INFO |
| 194 | sign | [sign] energy bookkeeping closure: max over 2 substeps |sum stage dE - dE_total| / |E| (worst at 5x5x6 step 1) | 0.000e+0 | <= 1e-12 | PASS |
| 195 | sign | [sign] push-out moved fraction per step, sim 5x5x6 (1 steps): mean / max | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 196 | sign | [sign] push-out moved fraction per step, sim 5x5x6 (1 steps): mean / max | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 197 | seedT3 | C3.seed T3 a=16: min distance of any seeded particle to any wall at t=0 | 7.1441e-4 m | >= clearance 4.4648e-4 m | PASS |
| 198 | seedT3 | C3.seed T3 a=8: min distance of any seeded particle to any wall at t=0 | 1.4290e-3 m | >= clearance 8.9297e-4 m | PASS |
| 199 | stillproof | still-water T1 grid 8x8x10: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 200 | stillproof | still-water T1 grid 16x16x20: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 201 | stillproof | still-water T1 grid 32x32x40: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 202 | stillproof | still-water proof Gate 1 T1: fix-3 stage dx and dPE exactly 0 every step | 1800 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid 8x8x10: max|ebar_T4| 0.000e+0, 16x16x20: max|ebar_T4| 0.000e+0, 32x32x40: max|ebar_T4| 0.000e+0 | moved 0, |dx| 0, |dPE| 0 | PASS |
| 203 | stillproof | still-water T1b grid 8x8x6: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 204 | stillproof | still-water T1b grid 16x16x10: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 205 | stillproof | still-water T1b grid 32x32x18: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 206 | stillproof | still-water T1b grid 64x64x34: max |ebar_T4| (expected exactly 0) / particles moved / max |dPE| | 0 / 0 / 0 J | info (not graded) | INFO |
| 207 | stillproof | still-water proof Gate 1 T1b: fix-3 stage dx and dPE exactly 0 every step | 2400 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid 8x8x6: max|ebar_T4| 0.000e+0, 16x16x10: max|ebar_T4| 0.000e+0, 32x32x18: max|ebar_T4| 0.000e+0, 64x64x34: max|ebar_T4| 0.000e+0 | moved 0, |dx| 0, |dPE| 0 | PASS |
| 208 | stillproof | fix-3 stage in Gate 1 T2 (not a still pool) | 147 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid 24x24x64: max|ebar_T4| 4.747e-3 | info (not graded) | INFO |
| 209 | stillproof | fix-3 stage in Gate 1 modes (not a still pool) | 0 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid  | info (not graded) | INFO |
| 210 | stillproof | fix-3 stage in Gate 1 D (not a still pool) | 0 stage calls, 0 solves; particles moved 0, max |dx| 0, max |dPE| 0 J (0 nonzero); max cells above dead-band 0; max |target/cell| 0; per grid  | info (not graded) | INFO |
| 211 | convergence | T3.mm convergence (Z 2026-10-14i): |err a=16| < |err a=8| at Z=2.78 and Z=3.22 | Z=2.78: 6.86% vs 8.57% (ratio a16/a8 0.8005); Z=3.22: 5.58% vs 8.22% (ratio a16/a8 0.6792) | ratio < 1 at both | PASS (a=8 T3.mm rows -> INFO) |

Total graded: 73 PASS, 2 FAIL
