# Step 19 Phase B2: colvol theta (code c54340d)

- Code commit the runs executed at: c54340d (clean tree)
- spec/ASSERTS.md md5 da85972237130688c909e39215387a12; PHYSICS_SPEC.md md5 b2d23ec4bef4a94580d7a5148f2f49e4
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 2 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 3 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 1.217e-3 (frame 95, m=8.0097, 27105 cells) | <= 1e-2 | PASS |
| 4 | tilted | C3.tilted_tank peak cell count, every frame | 17 (frame 57, cell [9,10,27]) | <= 16 | FAIL |
| 5 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 3.290e-5 | <= 1e-6 | FAIL |
| 6 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 3.286e-5 | <= 1e-6 | FAIL |
| 7 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 1.748e-1; ghost 0.000e+0; gravity 2.008e+2; pressure -2.003e+2; g2p -9.938e-1; extension 2.502e-1; advect -5.866e-2; pushout 1.925e-5; densfix -2.167e-2 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 8 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | 1.925e-5 J (6.278e-8 |E0|) / 1.886e-6 J / 35 of 120 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank fix3 stage: signed sum of dPE over run | -2.167e-2 J (-7.068e-5 |E0|) | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 11 | tilted | C3.tilted_tank fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 4.308e-5 / 3.469e-4; 60 of 120 | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | 7.439e-2 / -2.407e-1 / 2.602e-1 (60) | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank fix3 ebar_T4 max |.| / steps with nonzero target | 1.224e-3 / 0 of 120 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank C3.fix3 target sum |sum e - target_r| / n_r, every step | 3.730e-17 | <= 1e-12 | PASS |
| 15 | tilted | C3.tilted_tank fix3 PCG iterations (mean / max) | 10.63 / 23 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0074 / 0 of 120 | info (not graded) | INFO |
| 17 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.535e-1 / 2.461e-1 | info (not graded) | INFO |
| 18 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.675e-7 J (-1.198e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 19 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 12 (t=0.1833 s): step dE 1.886e-6 J; top particle #260062 dE 5.714e-7 J, x0 [0.232518, 0.465766, 0.491582] m, dx [5.193e-5, -1.103e-4, 1.222e-4] m, v before [-1.050e-1, -1.775e-2, 5.673e-3] -> after [-1.050e-1, -1.775e-2, 5.673e-3] m/s | info (not graded) | INFO |
| 20 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 9 / 9 | info (not graded) | INFO |
| 21 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 22 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 23 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 24 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 25 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.996, 7.988, 8.030, 8.000, 7.969 | info (not graded) | INFO |
| 26 | tilted | [tilted] energy bookkeeping closure: max over 120 substeps |sum stage dE - dE_total| / |E| (worst at 32x32x40 step 16) | 1.745e-16 | <= 1e-12 | PASS |
| 27 | tilted | [tilted] push-out moved fraction per step, sim 32x32x40 (120 steps): mean / max | 3.799e-2 / 2.387e-1 | info (not graded) | INFO |
| 28 | tilted | [tilted] colvol surface cells on count-theta fallback per frame, sim 32x32x40 (120 frames): mean / max | 4.759e-1 / 7.256e-1 | info (not graded) | INFO |
| 29 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 30 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 31 | separation | C3.separation strict interior mean (info per section Z) | 5.416e-4 (frame 115, m=7.9957, 27003 cells) | info (not graded) | INFO |
| 32 | separation | C3.separation peak cell count (info) | 20 (frame 69, cell [5,21,31]) | info (not graded) | INFO |
| 33 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 7.138e-5 | <= 1e-6 | FAIL |
| 34 | separation | C3.separation cumulative stage energy at end (J) | p2g 7.652e-2; ghost 0.000e+0; gravity 2.006e+2; pressure -2.002e+2; g2p -5.041e-1; extension 2.191e-2; advect -6.175e-3; pushout -1.793e-6; densfix 1.136e-2 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 35 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | -1.793e-6 J (-5.847e-9 |E0|) / 1.167e-8 J / 19 of 120 | info (not graded) | INFO |
| 36 | separation | C3.separation C3.separation anti-inflation (fix 3 on): |sum over steps of stage dPE| over 2 s | 1.136e-2 J (signed 1.136e-2 J; 3.706e-5 |E0|) | <= 1e-6 |E0| = 3.066e-4 J | FAIL |
| 37 | separation | C3.separation fix3 stage dKE max per step (one-sided) | 0.000e+0 J | info (not graded) | INFO |
| 38 | separation | C3.separation fix3 fraction of (non-air-adjacent) fluid cells above dead-band per step: mean / max; steps with any | 1.863e-5 / 1.260e-4; 47 of 120 | info (not graded) | INFO |
| 39 | separation | C3.separation fix3 mean e over corrected cells per step: mean / min / max (steps corrected) | -1.588e-1 / -2.425e-1 / 2.035e-1 (47) | info (not graded) | INFO |
| 40 | separation | C3.separation fix3 ebar_T4 max |.| / steps with nonzero target | 5.039e-4 / 0 of 120 | info (not graded) | INFO |
| 41 | separation | C3.separation C3.fix3 target sum |sum e - target_r| / n_r, every step | 1.583e-17 | <= 1e-12 | PASS |
| 42 | separation | C3.separation fix3 PCG iterations (mean / max) | 8.14 / 23 | info (not graded) | INFO |
| 43 | separation | C3.separation fix3 max |dx|/h (correction alone) / cap-hit steps | 0.0048 / 0 of 120 | info (not graded) | INFO |
| 44 | separation | C3.separation max|u| at t=2 s | 1.198e-1 | < 2.215e-3 | FAIL |
| 45 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 2.672e-12 J (8.715e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 46 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 55 (t=0.9000 s): step dE 1.167e-8 J; top particle #254084 dE 5.073e-7 J, x0 [0.253815, 0.002511, 0.488829] m, dx [4.769e-6, 0.000e+0, 1.084e-4] m, v before [-1.152e-2, -2.410e-4, -2.797e-2] -> after [-1.152e-2, -2.410e-4, -2.797e-2] m/s | info (not graded) | INFO |
| 47 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 48 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 49 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 50 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 51 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 8 / 8 | info (not graded) | INFO |
| 52 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.997, 8.000, 8.006, 7.994, 7.999 | info (not graded) | INFO |
| 53 | separation | C3.separation trace: step of max (E-E0)/|E0| and cumulative stage energies there (J) | step 49 t=0.8167 s, rise 7.138e-5 |E0| = 2.188e-2 J; gravity+pressure 1.330e-1; p2g 1.610e-2; ghost 0.000e+0; g2p -1.509e-1; extension 3.210e-3; advect 1.512e-2; pushout -5.704e-7; densfix 5.333e-3 | info (not graded) | INFO |
| 54 | separation | C3.separation trace: sum of positive per-step stage dE over 2 s by stage (J) | gravity+pressure 4.090e-1; p2g 7.652e-2; advect 2.227e-2; extension 2.191e-2; densfix 1.209e-2; pushout 8.670e-8 | info (not graded) | INFO |
| 55 | separation | C3.separation trace: max|u| (m/s) at t = 0, 0.25, 0.5, 1, 1.5, 2 s | 0.02: 1.182e-9; 0.25: 4.369e-2; 0.50: 9.767e-2; 1.00: 1.412e-1; 1.50: 1.228e-1; 2.00: 1.198e-1 | info (not graded) | INFO |
| 56 | separation | C3.separation trace: 5 largest per-step max|u| increases (step: d max|u|, then that step's g2p / extension / gravity+pressure / pushout dE) | 82: +6.117e-2, -5.031e-3 / 2.619e-4 / 3.944e-3 / -2.949e-8; 27: +6.025e-2, -3.697e-3 / 7.182e-5 / 3.402e-3 / -4.616e-8; 115: +5.903e-2, -5.251e-3 / 3.357e-4 / 3.850e-3 / -6.741e-8; 36: +4.770e-2, -4.661e-3 / 1.122e-4 / 4.182e-3 / -1.884e-8; 93: +4.343e-2, -5.408e-3 / 3.091e-4 / 4.488e-3 / -6.403e-9 | info (not graded) | INFO |
| 57 | separation | [separation] energy bookkeeping closure: max over 120 substeps |sum stage dE - dE_total| / |E| (worst at 32x32x40 step 43) | 1.666e-16 | <= 1e-12 | PASS |
| 58 | separation | [separation] push-out moved fraction per step, sim 32x32x40 (120 steps): mean / max | 5.065e-2 / 2.425e-1 | info (not graded) | INFO |
| 59 | separation | [separation] colvol surface cells on count-theta fallback per frame, sim 32x32x40 (120 frames): mean / max | 2.156e-1 / 3.477e-1 | info (not graded) | INFO |
| 60 | t3a16 | a16 Ritter short window W=3 frames: peak speed / U_R | 1.0119519 (frame 28) | <= 1 + q = 1.0337317 (q = 0.0337317) | PASS |
| 61 | t3a16 | a16 Ritter long window W_L=11 frames: peak speed / U_R | 0.9475550 (frame 30) | <= 1.0 | PASS |
| 62 | t3a16 | a16 Ritter single-substep peak (info) | 3.3394 U_R | info (not graded) | INFO |
| 63 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 89) |
| 64 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 268 > 0 | <= 0 every step | PASS |
| 65 | t3a16 | a16 P.res max true residual | 9.926e-9 | <= 1e-8 | PASS |
| 66 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 67 | t3a16 | a16 CFL / cap | max CFL 0.9954; cap 16; frames cap-bound with CFL>1: 0 of 30; substeps 268 | info (not graded) | INFO |
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
| 85 | t3a16 | a16 T3.mm Z=7 (T_sim 5.109, T_mean 5.09) | 0.38% | <= 8% | PASS |
| 86 | t3a16 | a16 T3.mm Z=8 (T_sim 5.665, T_mean 5.69) | 0.43% | <= 8% | PASS |
| 87 | t3a16 | a16 T3.mm Z=9 (T_sim 6.221, T_mean 6.3) | 1.25% | <= 8% | PASS |
| 88 | t3a16 | a16 T3.mm Z=10 (T_sim 6.757, T_mean 6.83) | 1.06% | <= 8% | PASS |
| 89 | t3a16 | a16 T3.mm Z=11 (T_sim 7.291, T_mean 7.44) | 2.01% | <= 8% | PASS |
| 90 | t3a16 | a16 T3.mm Z=12 (T_sim 7.824, T_mean 8.08) | 3.17% | <= 8% | PASS |
| 91 | t3a16 | a16 T3.mm Z=13 (T_sim 8.358, T_mean 8.67) | 3.60% | <= 8% | PASS |
| 92 | t3a16 | a16 T3.mm Z=14 (T_sim 8.863, T_mean 9.31) | 4.80% | <= 8% | PASS |
| 93 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 31 frames (m0 8.0000) | 2.066e-2 (frame 12, m=8.1653) | <= 1e-2 every frame | FAIL |
| 94 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 95 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -8.369e-2 / -1.084e-1 | info (not graded) | INFO |
| 96 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 6.755e-2 / 3.598e-1 | info (not graded) | INFO |
| 97 | t3a16 | a16 T4 peak count | 24 at frame 9 cell [17,10,0] (front x 3.75a) | info (not graded) | INFO |
| 98 | t3a16 | a16 T4 final histogram n:cells(Poisson(6.791)) | 1:381(74) 2:555(250) 3:480(567) 4:605(962) 5:834(1307) 6:1220(1479) 7:1390(1435) 8:1470(1218) 9:1176(919) 10:775(624) 11:449(385) 12:214(218) 13:66(114) 14:25(55) 15:6(25) 16:2(11) 17:2(4) | info (not graded) | INFO |
| 99 | t3a16 | C3.fix3 a=16: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.1000 (stage incl. push-out 0.1055, info) | <= 0.1 | PASS |
| 100 | t3a16 | C3.fix3 a=16: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -9.998e-9 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 101 | t3a16 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a16: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 3.579e-3 J at step 220 (cum dPE 3.970e-3, PE_pack 3.906e-4) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 102 | t3a16 | C3.fix3 a=16: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 103 | t3a16 | C3.fix3 a=16: target sum, max over steps and regions of |sum e - target_r| / n_r | 5.467e-15 | <= 1e-12 every step | PASS |
| 104 | t3a16 | a16 fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target | 7.998e-3 / -2.108e-3 / 2.214e-2; 191 of 268 | info (not graded) | INFO |
| 105 | t3a16 | a16 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 1.205e-3 / 5.417e-3 | info (not graded) | INFO |
| 106 | t3a16 | a16 front displacement caused by the correction alone in each Ritter window (W = 3 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 3); at the worst Ritter window (frame 28): total 1.072e-1 m, by correction 0.000e+0 m (0.000 h), speed 1.0120 U_R, speed minus correction 1.0120 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 107 | t3a16 | a16 fix3 PCG iterations per step (mean / max; steps solved) | 10.4 / 17; 243 of 268 | info (not graded) | INFO |
| 108 | t3a16 | a16 fix3 max |dx|/h per step (mean / max) | 0.0297 / 0.1000 | info (not graded) | INFO |
| 109 | t3a16 | a16 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 3.956e-6 / 3.357e-4 | info (not graded) | INFO |
| 110 | t3a16 | a16 fix3 fraction of steps where the cap binds | 9 of 268 = 0.034; steps 74,75,76,77,78,79,82,96,97 | info (not graded) | INFO |
| 111 | t3a16 | a16 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 3.103e-2 / 7.117e-2 | info (not graded) | INFO |
| 112 | t3a16 | a16 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 9.589e-2 / -4.502e-2 / 3.248e-1; 241 of 268 | info (not graded) | INFO |
| 113 | t3a16 | a16 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 1.545e-2 / -4.332e-1 / 1.283e+0; 97.2 of 1858.4 | info (not graded) | INFO |
| 114 | t3a16 | a16 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 4.025e-3 J, max 9.936e-5 J; sum dKE -7.272e-8 J; PE_pack 4.597e-4 J (max 2.725e-3) | info (not graded) | INFO |
| 115 | t3a16 | C3.fix3 a=16: T3.mm worst graded row no worse than fix 1 (6.94%) | 6.94% | <= 6.94% | PASS |
| 116 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -30875 vs -31548.3; column region (x<a) -7700 vs -7448.0; mean |per-step difference| 14.77 | info (not graded) | INFO |
| 117 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-1.26e-3 / 2.53e-1 / 5921 of 7262] [-5.11e-4 / 5.27e-2 / 13477 of 16877] [-3.63e-4 / 2.05e-2 / 20288 of 26167] | info (not graded) | INFO |
| 118 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [5.27e-4 / 9.62e-2 / 635 of 2458] [7.14e-4 / 1.83e-2 / 195 of 830] [-1.10e-3 / 1.03e-2 / 310 of 412] | info (not graded) | INFO |
| 119 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [1.24e-5 / 2.24e-1 / 3744 of 8201] [3.28e-5 / 3.08e-2 / 3395 of 8273] [2.06e-5 / 2.52e-2 / 3858 of 8297] | info (not graded) | INFO |
| 120 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,30 | f1: [7.50 7.93 8.00 8.15 8.60 8.43] total 64236; f6: [8.23 8.25 7.60 8.12 8.15 7.82] total 42759; f11: [9.76 9.18 8.46 8.21 8.15 8.09] total 24423; f16: [8.11 8.39 8.29 8.20 8.24 8.27] total 14754; f21: [8.23 7.82 7.91 7.88 7.07 0.00] total 9961; f26: [8.10 8.00 7.67 5.42 0.00 0.00] total 7473; f30: [8.04 7.86 8.00 0.01 0.00 0.00] total 6121 | info (not graded) | INFO |
| 121 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.656 / 0.656 / +0.000; 60.09% | Z=1.22: 0.850 / 0.850 / +0.000; 1.18% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.479 / 1.479 / +0.000; 3.43% | Z=1.89: 1.684 / 1.684 / +0.000; 3.29% | Z=2.11: 1.916 / 1.916 / +0.000; 4.72% | Z=2.33: 2.117 / 2.117 / +0.000; 6.94% | Z=2.56: 2.280 / 2.280 / +0.000; 3.63% | Z=2.78: 2.479 / 2.479 / +0.000; 6.86% | Z=3: 2.623 / 2.623 / +0.000; 4.52% | Z=3.22: 2.798 / 2.798 / +0.000; 5.58% | Z=3.44: 2.934 / 2.972 / -0.039; 3.67% | Z=3.67: 3.114 / 3.114 / +0.000; 4.87% | Z=3.89: 3.275 / 3.275 / +0.000; 5.31% | Z=4.11: 3.396 / 3.396 / +0.000; 1.98% | Z=5: 3.953 / 3.953 / +0.000; -1.66% | Z=5.89: 4.499 / 4.499 / +0.000; 1.33% | Z=7: 5.109 / 5.140 / -0.031; 0.38% | Z=8: 5.665 / 5.712 / -0.046; -0.43% | Z=9: 6.221 / 6.221 / +0.000; -1.25% | Z=10: 6.757 / 6.799 / -0.042; -1.06% | Z=11: 7.291 / 7.333 / -0.042; -2.01% | Z=12: 7.824 / 7.880 / -0.056; -3.17% | Z=13: 8.358 / 8.358 / +0.000; -3.60% | Z=14: 8.863 / 8.891 / -0.028; -4.80% | info (not graded) | INFO |
| 122 | t3a16 | a16 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.50 / 4 / 11 / 4:7 5:16 6:32 7:20 8:166 9:4 10:5 11:6; f5: 7.72 / 6 / 14 / 6:82 7:26 8:112 9:3 10:6 11:11 12:11 13:3 14:2; f10: 9.34 / 0 / 19 / 0:14 1:12 2:9 3:15 4:13 5:9 6:17 7:17 8:14 9:14 10:8 11:10 12:13 13:8 14:16 15:21 16:22 17:13 18:10 19:1; f15: 8.34 / 1 / 14 / 1:5 2:6 3:7 4:17 5:9 6:18 7:28 8:34 9:30 10:45 11:25 12:11 13:14 14:7; f20: 8.20 / 2 / 17 / 2:4 3:6 4:11 5:19 6:31 7:28 8:39 9:37 10:36 11:16 12:15 13:9 14:3 16:1 17:1; f25: 8.03 / 1 / 16 / 1:1 2:3 3:7 4:11 5:25 6:29 7:37 8:37 9:24 10:37 11:17 12:14 13:11 14:1 15:1 16:1; f30: 8.04 / 1 / 17 / 1:3 2:4 3:6 4:17 5:19 6:24 7:33 8:41 9:27 10:34 11:17 12:18 13:8 14:3 15:1 17:1 | info (not graded) | INFO |
| 123 | t3a16 | [t3a16] energy bookkeeping closure: max over 268 substeps |sum stage dE - dE_total| / |E| (worst at 256x16x40 step 65) | 1.402e-16 | <= 1e-12 | PASS |
| 124 | t3a16 | [t3a16] push-out moved fraction per step, sim 256x16x40 (268 steps): mean / max | 2.462e-1 / 2.971e-1 | info (not graded) | INFO |
| 125 | t3a16 | [t3a16] colvol surface cells on count-theta fallback per frame, sim 256x16x40 (30 frames): mean / max | 4.915e-1 / 8.013e-1 | info (not graded) | INFO |
| 126 | t3a8 | a8 Ritter short window W=5 frames: peak speed / U_R | 0.9714739 (frame 24) | <= 1 + q = 1.0404781 (q = 0.0404781) | PASS |
| 127 | t3a8 | a8 Ritter long window W_L=21 frames: peak speed / U_R | 0.8866627 (frame 31) | <= 1.0 | PASS |
| 128 | t3a8 | a8 Ritter single-substep peak (info) | 3.6430 U_R | info (not graded) | INFO |
| 129 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.704e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 37) |
| 130 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 153 > 0 | <= 0 every step | PASS |
| 131 | t3a8 | a8 P.res max true residual | 9.724e-9 | <= 1e-8 | PASS |
| 132 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 133 | t3a8 | a8 CFL / cap | max CFL 0.9993; cap 16; frames cap-bound with CFL>1: 0 of 31; substeps 153 | info (not graded) | INFO |
| 134 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 135 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 136 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 137 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 138 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 139 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
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
| 151 | t3a8 | a8 T3.mm Z=7 (T_sim 5.233, T_mean 5.09) | 2.82% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 152 | t3a8 | a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 153 | t3a8 | a8 T3.mm Z=9 (T_sim 6.360, T_mean 6.3) | 0.96% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 154 | t3a8 | a8 T3.mm Z=10 (T_sim 6.849, T_mean 6.83) | 0.28% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 155 | t3a8 | a8 T3.mm Z=11 (T_sim 7.416, T_mean 7.44) | 0.33% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 156 | t3a8 | a8 T3.mm Z=12 (T_sim 8.007, T_mean 8.08) | 0.90% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 157 | t3a8 | a8 T3.mm Z=13 (T_sim 8.496, T_mean 8.67) | 2.00% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 158 | t3a8 | a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | INFO (INFO per Z 2026-10-14i (convergence PASS); graded value would be PASS) |
| 159 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 32 frames (m0 8.0000) | 3.116e-2 (frame 15, m=8.2492) | <= 1e-2 every frame | FAIL |
| 160 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 161 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -7.214e-2 / -1.073e-1 | info (not graded) | INFO |
| 162 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 8.435e-2 / 3.354e-1 | info (not graded) | INFO |
| 163 | t3a8 | a8 T4 peak count | 22 at frame 14 cell [1,6,0] (front x 6.13a) | info (not graded) | INFO |
| 164 | t3a8 | a8 T4 final histogram n:cells(Poisson(5.524)) | 1:128(33) 2:225(91) 3:129(167) 4:142(230) 5:127(255) 6:129(234) 7:165(185) 8:136(128) 9:125(78) 10:106(43) 11:43(22) 12:18(10) 13:9(4) 16:1(0) | info (not graded) | INFO |
| 165 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 153 > 0 | <= 0 every step | PASS |
| 166 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 153 > 1e-8 KE_theta; max -1.727e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 167 | t3a8 | C3.fix3 a=8: max |dx|/h of the correction's own displacement (trailing push-out not capped by this row) | 0.0435 (stage incl. push-out 0.0435, info) | <= 0.1 | PASS |
| 168 | t3a8 | C3.fix3 a=8: stage dKE every step, one-sided (correction + trailing push-out) | max dKE 0.000e+0 J (min -1.807e-8 J; 0 steps > 0) | <= 1e-12 J | PASS |
| 169 | t3a8 | [PE_pack row RETIRED, Z 2026-10-14f; info only] a8: cum stage dPE vs PE_pack(t) + 1e-6|E0| (PE_pack = [PE_uni - PE_act](t) - [..](0)) | max (cum dPE - PE_pack) 2.360e-3 J at step 131 (cum dPE 2.941e-3, PE_pack 5.812e-4) | info (not graded) | INFO (would have been FAIL vs 1e-6|E0| = 2.093e-7 J) |
| 170 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with nonzero e: 0) | == 0 | PASS |
| 171 | t3a8 | C3.fix3 a=8: target sum, max over steps and regions of |sum e - target_r| / n_r | 5.888e-16 | <= 1e-12 every step | PASS |
| 172 | t3a8 | a8 fix3 ebar_T4 per step (mean / min / max) and steps with nonzero target | 1.017e-2 / -8.321e-3 / 3.435e-2; 106 of 153 | info (not graded) | INFO |
| 173 | t3a8 | a8 fix3 uniform shift applied to reach the target (max |mean e| over regions, per step: mean / max) | 5.038e-3 / 1.983e-2 | info (not graded) | INFO |
| 174 | t3a8 | a8 front displacement caused by the correction alone in each Ritter window (W = 5 frames) | max |dx_front,corr| 0.000e+0 m = 0.000 h (window ending frame 5); at the worst Ritter window (frame 24): total 1.714e-1 m, by correction 0.000e+0 m (0.000 h), speed 0.9715 U_R, speed minus correction 0.9715 U_R; run total by correction 0.000e+0 m | info (not graded) | INFO |
| 175 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 7.3 / 13; 132 of 153 | info (not graded) | INFO |
| 176 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0147 / 0.0435 | info (not graded) | INFO |
| 177 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 0.000e+0 / 0.000e+0 | info (not graded) | INFO |
| 178 | t3a8 | a8 fix3 fraction of steps where the cap binds | 0 of 153 = 0.000 | info (not graded) | INFO |
| 179 | t3a8 | a8 fix3 fraction of non-air-adjacent fluid cells above dead-band per step (mean / max) | 6.565e-2 / 1.549e-1 | info (not graded) | INFO |
| 180 | t3a8 | a8 fix3 mean e over corrected cells per step (mean / min / max; steps corrected) | 8.547e-2 / -2.023e-1 / 2.879e-1; 130 of 153 | info (not graded) | INFO |
| 181 | t3a8 | a8 fix3 floor-layer (k=0, non-air-adjacent) raw e (before dead-band): mean of per-step mean / min / max; cells |e| >= 0.2 (mean per step of n) | 5.957e-4 / -3.983e-1 / 1.065e+0; 25.6 of 265.0 | info (not graded) | INFO |
| 182 | t3a8 | a8 fix3 stage dPE / dKE (sum, max dPE), PE_pack v2 (end, max) | sum dPE 3.001e-3 J, max 1.504e-4 J; sum dKE -6.583e-8 J; PE_pack 8.814e-4 J (max 2.756e-3) | info (not graded) | INFO |
| 183 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 184 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.941 / 1.941 / +0.000; 6.09% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.868 / 2.868 / +0.000; 8.22% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 3.998 / 3.998 / +0.000; -0.54% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.233 / 5.254 / -0.021; 2.82% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.360 / 6.335 / +0.026; 0.96% | Z=10: 6.849 / 6.901 / -0.051; 0.28% | Z=11: 7.416 / 7.467 / -0.051; -0.33% | Z=12: 8.007 / 8.033 / -0.026; -0.90% | Z=13: 8.496 / 8.548 / -0.051; -2.00% | Z=14: 9.114 / 9.114 / +0.000; -2.10% | info (not graded) | INFO |
| 185 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -6875 vs -7809.9; column region (x<a) -1882 vs -1787.0; mean |per-step difference| 10.71 | info (not graded) | INFO |
| 186 | t3a8 | a8 column region (x < a) bottom layer k=0 per-cell counts: mean / min / max / histogram n:cells | f1: 7.56 / 4 / 9 / 4:2 5:2 6:5 7:8 8:43 9:4; f5: 7.78 / 6 / 12 / 6:17 7:9 8:30 11:3 12:5; f10: 9.28 / 0 / 17 / 0:2 1:2 2:5 3:4 4:3 5:5 6:1 7:1 8:2 9:4 10:5 11:3 12:4 13:1 14:11 15:7 16:3 17:1; f15: 9.47 / 2 / 21 / 2:5 3:9 4:5 5:2 6:8 7:3 8:5 9:1 10:2 12:2 13:3 14:3 15:2 16:1 17:4 19:1 20:5 21:3; f20: 7.70 / 1 / 13 / 1:1 2:3 3:2 4:5 5:4 6:3 7:9 8:11 9:7 10:8 11:5 12:5 13:1; f25: 7.89 / 4 / 12 / 4:2 5:4 6:13 7:10 8:12 9:8 10:9 11:1 12:5; f31: 7.94 / 4 / 12 / 4:1 5:1 6:6 7:23 8:14 9:8 10:4 11:6 12:1 | info (not graded) | INFO |
| 187 | t3a8 | [t3a8] energy bookkeeping closure: max over 153 substeps |sum stage dE - dE_total| / |E| (worst at 128x8x20 step 144) | 1.421e-16 | <= 1e-12 | PASS |
| 188 | t3a8 | [t3a8] push-out moved fraction per step, sim 128x8x20 (153 steps): mean / max | 2.765e-1 / 3.416e-1 | info (not graded) | INFO |
| 189 | t3a8 | [t3a8] colvol surface cells on count-theta fallback per frame, sim 128x8x20 (31 frames): mean / max | 4.914e-1 / 8.092e-1 | info (not graded) | INFO |
| 190 | sign | C3.fix3.sign v6 [production sign]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 16/16 outward (min dx.r 2.215e-6 m^2); splat nbar 10.481445 -> 10.413331 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 1.665e-18) | all outward AND splat nbar drops | PASS (test verdict PASS) |
| 191 | sign | C3.fix3.sign v6 [production sign]: splat nbar across the correction stage alone | 10.481162 -> 10.413331 (drops); correction max |dx|/h 0.00426 | info (not graded) | INFO |
| 192 | sign | C3.fix3.sign v6 [sign FLIPPED (must fail)]: one step; centre cell 16 (uniform 2x2x4) in 5x5x5 of 8, open top: outward radial dx / centre splat nbar before -> after the step | 0/16 outward (min dx.r -5.254e-6 m^2); splat nbar 10.481445 -> 10.545590 (cell count 16 -> 16; above dead-band 1; PCG 10; target err 1.665e-18) | all outward AND splat nbar drops | PASS (test verdict FAIL; row passes when the flipped sign fails) |
| 193 | sign | C3.fix3.sign v6 [sign FLIPPED (must fail)]: splat nbar across the correction stage alone | 10.481162 -> 10.545590 (rises); correction max |dx|/h 0.00426 | info (not graded) | INFO |
| 194 | sign | [sign] energy bookkeeping closure: max over 2 substeps |sum stage dE - dE_total| / |E| (worst at 5x5x6 step 1) | 5.317e-17 | <= 1e-12 | PASS |
| 195 | sign | [sign] push-out moved fraction per step, sim 5x5x6 (1 steps): mean / max | 1.587e-2 / 1.587e-2 | info (not graded) | INFO |
| 196 | sign | [sign] push-out moved fraction per step, sim 5x5x6 (1 steps): mean / max | 1.587e-2 / 1.587e-2 | info (not graded) | INFO |
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

Total graded: 67 PASS, 8 FAIL
