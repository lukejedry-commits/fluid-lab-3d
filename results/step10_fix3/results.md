# Step 10 at FIX 3 (density correction)

- Code commit the runs executed at: 73ab822 (rows tagged @f0220c4: src f0220c4 + step-10 runner in a worktree) (clean tree)
- spec/ASSERTS.md md5 8b21311bc676215b8d282aa4ddcb7637; PHYSICS_SPEC.md md5 7d1c18f5aed86d07324c227539ee96e5
- PE zero: floor z=0; substep cap 16

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | tilted | C3.tilted_tank C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 2 | tilted | C3.tilted_tank setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames, surface z = H + 0.05 (x - L/2) | info (not graded) | INFO |
| 3 | tilted | C3.tilted_tank strict interior mean within 1% of 8, every frame | 1.970e-1 (frame 100, m=6.4238, 34200 cells) | <= 1e-2 | FAIL |
| 4 | tilted | C3.tilted_tank peak cell count, every frame | 17 (frame 9, cell [9,7,31]) | <= 16 | FAIL |
| 5 | tilted | C3.tilted_tank total energy max (E-E0)/|E0| (every step) | 2.448e-1 | <= 1e-6 | FAIL |
| 6 | tilted | C3.tilted_tank energy summed over all stages except push-out, max over frames / |E0| | 2.448e-1 | <= 1e-6 | FAIL |
| 7 | tilted | C3.tilted_tank cumulative stage energy at end (J) | p2g 5.995e-2; ghost 0.000e+0; gravity 2.005e+2; pressure -2.003e+2; g2p -4.097e-1; extension 1.446e-1; advect -5.999e-3; pushout -7.963e-6; densfix 7.506e+1 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 8 | tilted | C3.tilted_tank push-out stage: cumulative / max per step / steps > 0 | -7.963e-6 J (-2.597e-8 |E0|) / -7.333e-12 J / 0 of 120 | info (not graded) | INFO |
| 9 | tilted | C3.tilted_tank max|u| at t=2 s / max over run | 1.564e-2 / 1.723e-1 | info (not graded) | INFO |
| 10 | tilted | C3.tilted_tank C3.seed: push-out dE at step 1 (t=0 step, not excluded) | -3.671e-7 J (-1.197e-9 |E0|) | <= 1e-6 |E0| | PASS |
| 11 | tilted | C3.tilted_tank push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 5.304e-6 J; top particle #155639 dE 2.341e-6 J, x0 [0.483878, 0.496803, 0.296661] m, dx [-1.340e-4, -5.558e-6, 5.004e-4] m, v before [-2.819e-4, -1.857e-11, -2.668e-3] -> after [-2.819e-4, -1.857e-11, -2.668e-3] m/s | info (not graded) | INFO |
| 12 | tilted | C3.tilted_tank cell [2,12,1] count start / max / end | 8 / 10 / 6 | info (not graded) | INFO |
| 13 | tilted | C3.tilted_tank cell [0,0,0] count start / max / end | 8 / 8 / 6 | info (not graded) | INFO |
| 14 | tilted | C3.tilted_tank cell [31,0,0] count start / max / end | 8 / 8 / 7 | info (not graded) | INFO |
| 15 | tilted | C3.tilted_tank cell [0,31,0] count start / max / end | 8 / 9 / 7 | info (not graded) | INFO |
| 16 | tilted | C3.tilted_tank cell [31,31,0] count start / max / end | 8 / 9 / 8 | info (not graded) | INFO |
| 17 | tilted | C3.tilted_tank layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 6.878, 6.476, 6.537, 6.363, 6.247 | info (not graded) | INFO |
| 18 | separation | C3.separation C3.seed: min distance of any seeded particle to any wall at t=0 | 1.9531e-3 m | >= clearance 1.9531e-3 m | PASS |
| 19 | separation | C3.separation setup | N=32, H=0.5 m, grid 32x32x40, 262144 particles, seed 3232, jitter 0.5 s (uniform in sub-cells), cap 16, 120 frames | info (not graded) | INFO |
| 20 | separation | C3.separation strict interior mean (info per section Z) | 1.843e-1 (frame 120, m=6.5258, 33300 cells) | info (not graded) | INFO |
| 21 | separation | C3.separation peak cell count (info) | 13 (frame 2, cell [6,10,8]) | info (not graded) | INFO |
| 22 | separation | C3.separation total energy max (E-E0)/|E0| (every step) | 2.137e-1 | <= 1e-6 | FAIL |
| 23 | separation | C3.separation cumulative stage energy at end (J) | p2g 2.674e-2; ghost 0.000e+0; gravity 2.004e+2; pressure -2.002e+2; g2p -2.409e-1; extension 5.191e-3; advect -7.425e-3; pushout -1.459e-6; densfix 6.552e+1 | info (not graded) | INFO (|E0| = 3.066e+2 J) |
| 24 | separation | C3.separation push-out stage: cumulative / max per step / steps > 0 | -1.459e-6 J (-4.760e-9 |E0|) / 2.672e-12 J / 1 of 120 | info (not graded) | INFO |
| 25 | separation | C3.separation max|u| at t=2 s | 7.060e-2 | < 2.215e-3 | FAIL |
| 26 | separation | C3.separation C3.seed: push-out dE at step 1 (t=0 step, not excluded) | 2.672e-12 J (8.715e-15 |E0|) | <= 1e-6 |E0| | PASS |
| 27 | separation | C3.separation push-out energy spike (largest per-step push-out dE) | step 1 (t=0.0000 s): step dE 5.465e-6 J; top particle #155639 dE 2.343e-6 J, x0 [0.483855, 0.496802, 0.296703] m, dx [-1.337e-4, -6.408e-6, 5.008e-4] m, v before [-5.950e-11, -2.475e-12, 1.266e-10] -> after [-5.950e-11, -2.475e-12, 1.266e-10] m/s | info (not graded) | INFO |
| 28 | separation | C3.separation cell [2,12,1] count start / max / end | 8 / 10 / 6 | info (not graded) | INFO |
| 29 | separation | C3.separation cell [0,0,0] count start / max / end | 8 / 8 / 7 | info (not graded) | INFO |
| 30 | separation | C3.separation cell [31,0,0] count start / max / end | 8 / 8 / 7 | info (not graded) | INFO |
| 31 | separation | C3.separation cell [0,31,0] count start / max / end | 8 / 9 / 8 | info (not graded) | INFO |
| 32 | separation | C3.separation cell [31,31,0] count start / max / end | 8 / 9 / 7 | info (not graded) | INFO |
| 33 | separation | C3.separation layer mean particles/cell k=0..4 at start / end | 8.000, 8.000, 8.000, 8.000, 8.000 / 7.113, 6.677, 6.545, 6.685, 6.355 | info (not graded) | INFO |
| 34 | t3a16 | a16 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 3 frames | 2.2146 m/s (1.0457 U_R, frame 26) | < U_R = 2.1178 m/s every frame | FAIL |
| 35 | t3a16 | a16 Ritter single-substep peak / frame-to-frame peak | 1.2143 U_R / 1.1131 U_R | info (not graded) | INFO |
| 36 | t3a16 | a16 T3.E max (E-E0)/|E0| (PE datum z=0) | 1.085e-1 | <= 1e-6 | FAIL (step-to-step rises (below E0): 255) |
| 37 | t3a16 | a16 pressure-stage dE <= 0 every step (m_f measure) | 0 of 269 > 0 | <= 0 every step | PASS |
| 38 | t3a16 | a16 P.res max true residual | 9.938e-9 | <= 1e-8 | PASS |
| 39 | t3a16 | a16 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 40 | t3a16 | a16 CFL / cap | max CFL 0.9996; cap 16; frames cap-bound with CFL>1: 0 of 29; substeps 269 | info (not graded) | INFO |
| 41 | t3a16 | a16 T3.mm shift | 0.4149 | info (not graded) | INFO |
| 42 | t3a16 | a16 T3.mm Z=1.11 (report only) | 0.687 vs 0.41 (67.47%) | info (not graded) | INFO |
| 43 | t3a16 | a16 T3.mm Z=1.22 (report only) | 0.880 vs 0.84 (4.78%) | info (not graded) | INFO |
| 44 | t3a16 | a16 T3.mm Z=1.67 (T_sim 1.448, T_mean 1.43) | 1.23% | <= 8% | PASS |
| 45 | t3a16 | a16 T3.mm Z=1.89 (T_sim 1.662, T_mean 1.63) | 1.99% | <= 8% | PASS |
| 46 | t3a16 | a16 T3.mm Z=2.11 (T_sim 1.844, T_mean 1.83) | 0.75% | <= 8% | PASS |
| 47 | t3a16 | a16 T3.mm Z=2.33 (T_sim 2.060, T_mean 1.98) | 4.02% | <= 8% | PASS |
| 48 | t3a16 | a16 T3.mm Z=2.56 (T_sim 2.222, T_mean 2.2) | 0.99% | <= 8% | PASS |
| 49 | t3a16 | a16 T3.mm Z=2.78 (T_sim 2.402, T_mean 2.32) | 3.54% | <= 8% | PASS |
| 50 | t3a16 | a16 T3.mm Z=3 (T_sim 2.538, T_mean 2.51) | 1.11% | <= 8% | PASS |
| 51 | t3a16 | a16 T3.mm Z=3.22 (T_sim 2.712, T_mean 2.65) | 2.36% | <= 8% | PASS |
| 52 | t3a16 | a16 T3.mm Z=3.44 (T_sim 2.848, T_mean 2.83) | 0.65% | <= 8% | PASS |
| 53 | t3a16 | a16 T3.mm Z=3.67 (T_sim 3.013, T_mean 2.97) | 1.45% | <= 8% | PASS |
| 54 | t3a16 | a16 T3.mm Z=3.89 (T_sim 3.168, T_mean 3.11) | 1.87% | <= 8% | PASS |
| 55 | t3a16 | a16 T3.mm Z=4.11 (T_sim 3.289, T_mean 3.33) | 1.24% | <= 8% | PASS |
| 56 | t3a16 | a16 T3.mm Z=5 (T_sim 3.843, T_mean 4.02) | 4.41% | <= 8% | PASS |
| 57 | t3a16 | a16 T3.mm Z=5.89 (T_sim 4.344, T_mean 4.44) | 2.16% | <= 8% | PASS |
| 58 | t3a16 | a16 T3.mm Z=7 (T_sim 4.935, T_mean 5.09) | 3.05% | <= 8% | PASS |
| 59 | t3a16 | a16 T3.mm Z=8 (T_sim 5.468, T_mean 5.69) | 3.90% | <= 8% | PASS |
| 60 | t3a16 | a16 T3.mm Z=9 (T_sim 5.973, T_mean 6.3) | 5.18% | <= 8% | PASS |
| 61 | t3a16 | a16 T3.mm Z=10 (T_sim 6.479, T_mean 6.83) | 5.14% | <= 8% | PASS |
| 62 | t3a16 | a16 T3.mm Z=11 (T_sim 6.984, T_mean 7.44) | 6.13% | <= 8% | PASS |
| 63 | t3a16 | a16 T3.mm Z=12 (T_sim 7.461, T_mean 8.08) | 7.66% | <= 8% | PASS |
| 64 | t3a16 | a16 T3.mm Z=13 (T_sim 7.955, T_mean 8.67) | 8.25% | <= 8% | FAIL |
| 65 | t3a16 | a16 T3.mm Z=14 (T_sim 8.444, T_mean 9.31) | 9.30% | <= 8% | FAIL |
| 66 | t3a16 | a16 T4 interior mean, max |m-m0|/m0 over 30 frames (m0 8.0000) | 4.142e-1 (frame 29, m=4.6862) | <= 1e-2 every frame | FAIL |
| 67 | t3a16 | a16 T4 particle count exact | 65536 | == 65536 | PASS |
| 68 | t3a16 | a16 T4 capped estimate final / min (rel V0) | -2.441e-4 / -4.503e-2 | info (not graded) | INFO |
| 69 | t3a16 | a16 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 2.548e-3 / 1.795e-1 | info (not graded) | INFO |
| 70 | t3a16 | a16 T4 peak count | 17 at frame 9 cell [12,12,1] (front x 3.94a) | info (not graded) | INFO |
| 71 | t3a16 | a16 T4 final histogram n:cells(Poisson(4.425)) | 1:648(794) 2:1374(1757) 3:2335(2592) 4:3238(2867) 5:3242(2538) 6:2302(1872) 7:1223(1183) 8:432(654) 9:16(322) | info (not graded) | INFO |
| 72 | t3a16 | C3.fix3 a=16: max per-particle move in the fix-3 stage (correction + its push-out) / h | 0.1231 (correction alone 0.1000) | <= 0.1 | FAIL |
| 73 | t3a16 | C3.fix3 a=16: stage dKE every step | max |dKE| 4.211e-8 J | <= 1e-12 J | FAIL |
| 74 | t3a16 | C3.fix3 a=16: cumulative stage dPE <= PE_pack every step (PE_pack = PE(actual layers) - PE(uniform 8/cell), literal section Z) | max (cum dPE - PE_pack) 3.637e-2 J at step 269 (cum dPE 4.641e-2, PE_pack 1.004e-2) | <= 0 every step | FAIL |
| 75 | t3a16 | a16 fix3: same bound with PE_pack sign flipped (packing deficit = PE(uniform) - PE(actual)) | max (cum dPE - deficit) 6.016e-2 J | info (not graded) | INFO |
| 76 | t3a16 | C3.fix3 a=16: skipped regions (no air) max per step | 0 (with excess: 0) | == 0 | PASS |
| 77 | t3a16 | a16 fix3 PCG iterations per step (mean / max; steps solved) | 13.1 / 19; 269 of 269 | info (not graded) | INFO |
| 78 | t3a16 | a16 fix3 max |dx|/h per step (mean / max) | 0.0781 / 0.1000 | info (not graded) | INFO |
| 79 | t3a16 | a16 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 9.746e-2 / 9.847e-1 | info (not graded) | INFO |
| 80 | t3a16 | a16 fix3 fraction of steps where the cap binds | 122 of 269 = 0.454 | info (not graded) | INFO |
| 81 | t3a16 | a16 fix3 stage dPE / dKE per step (sum, max dPE), PE_pack (start, end) | sum dPE 4.641e-2 J, max 8.505e-4 J; sum dKE -4.324e-7 J; PE_pack 3.192e-3 -> 1.004e-2 J | info (not graded) | INFO |
| 82 | t3a16 | C3.fix3 a=16: T3.mm worst graded row no worse than fix 1 (6.94%) | 9.30% | <= 6.94% | FAIL |
| 83 | t3a16 | a16 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -25141 vs -32481.2; column region (x<a) -6108 vs -6688.8; mean |per-step difference| 35.82 | info (not graded) | INFO |
| 84 | t3a16 | a16 (Physics) APIC field at nearest wall, floor: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [-9.12e-4 / 2.95e-1 / 4108 of 5181] [-4.32e-4 / 3.82e-2 / 8246 of 10575] [-3.40e-4 / 5.23e-2 / 12238 of 16173] | info (not graded) | INFO |
| 85 | t3a16 | a16 (Physics) APIC field at nearest wall, back: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [3.50e-4 / 9.02e-2 / 453 of 2137] [2.62e-5 / 5.06e-2 / 203 of 548] [-1.22e-3 / 5.62e-2 / 192 of 241] | info (not graded) | INFO |
| 86 | t3a16 | a16 (Physics) APIC field at nearest wall, side: mean u_n (positive = away from wall) / max into-wall / mean count into-wall of n, per run third | [4.53e-5 / 1.47e-1 / 3471 of 8183] [2.43e-5 / 4.63e-2 / 3405 of 8205] [2.05e-5 / 5.06e-2 / 3859 of 8174] | info (not graded) | INFO |
| 87 | t3a16 | a16 (NM) column region (x < a) mean particles/cell, layers k=0..5, at frames 1,6,11,16,21,26,29 | f1: [7.47 7.81 8.04 8.16 7.26 8.12] total 63816; f6: [5.73 6.18 5.98 6.03 6.13 5.72] total 37915; f11: [5.37 5.70 5.77 6.17 5.86 5.98] total 22131; f16: [4.95 5.05 5.06 4.89 4.86 4.95] total 13246; f21: [4.71 4.70 4.79 4.69 4.66 4.57] total 8942; f26: [4.44 4.61 4.59 4.54 4.35 3.04] total 6544; f29: [4.44 4.46 4.52 4.43 4.11 0.00] total 5620 | info (not graded) | INFO |
| 88 | t3a16 | a16 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.687 / 0.656 / +0.030; 67.47% | Z=1.22: 0.880 / 0.850 / +0.030; 4.78% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.448 / 1.479 / -0.031; 1.23% | Z=1.89: 1.662 / 1.684 / -0.021; 1.99% | Z=2.11: 1.844 / 1.916 / -0.073; 0.75% | Z=2.33: 2.060 / 2.117 / -0.058; 4.02% | Z=2.56: 2.222 / 2.280 / -0.058; 0.99% | Z=2.78: 2.402 / 2.479 / -0.077; 3.54% | Z=3: 2.538 / 2.623 / -0.086; 1.11% | Z=3.22: 2.712 / 2.798 / -0.086; 2.36% | Z=3.44: 2.848 / 2.972 / -0.124; 0.65% | Z=3.67: 3.013 / 3.114 / -0.101; 1.45% | Z=3.89: 3.168 / 3.275 / -0.107; 1.87% | Z=4.11: 3.289 / 3.396 / -0.107; -1.24% | Z=5: 3.843 / 3.953 / -0.110; -4.41% | Z=5.89: 4.344 / 4.499 / -0.155; -2.16% | Z=7: 4.935 / 5.140 / -0.206; -3.05% | Z=8: 5.468 / 5.712 / -0.243; -3.90% | Z=9: 5.973 / 6.221 / -0.248; -5.18% | Z=10: 6.479 / 6.799 / -0.321; -5.14% | Z=11: 6.984 / 7.333 / -0.349; -6.13% | Z=12: 7.461 / 7.880 / -0.419; -7.66% | Z=13: 7.955 / 8.358 / -0.403; -8.25% | Z=14: 8.444 / 8.891 / -0.447; -9.30% | info (not graded) | INFO |
| 89 | t3a8 | a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 2.2289 m/s (1.0524 U_R, frame 30) | < U_R = 2.1178 m/s every frame | FAIL |
| 90 | t3a8 | a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.4167 U_R | info (not graded) | INFO |
| 91 | t3a8 | a8 T3.E max (E-E0)/|E0| (PE datum z=0) | 9.087e-2 | <= 1e-6 | FAIL (step-to-step rises (below E0): 92) |
| 92 | t3a8 | a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 152 > 0 | <= 0 every step | PASS |
| 93 | t3a8 | a8 P.res max true residual | 9.959e-9 | <= 1e-8 | PASS |
| 94 | t3a8 | a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 95 | t3a8 | a8 CFL / cap | max CFL 0.9999; cap 16; frames cap-bound with CFL>1: 0 of 30; substeps 152 | info (not graded) | INFO |
| 96 | t3a8 | a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 97 | t3a8 | a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 98 | t3a8 | a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 99 | t3a8 | a8 T3.mm Z=1.67 (T_sim 1.379, T_mean 1.43) | 3.54% | <= 8% | PASS |
| 100 | t3a8 | a8 T3.mm Z=1.89 (T_sim 1.660, T_mean 1.63) | 1.87% | <= 8% | PASS |
| 101 | t3a8 | a8 T3.mm Z=2.11 (T_sim 1.796, T_mean 1.83) | 1.84% | <= 8% | PASS |
| 102 | t3a8 | a8 T3.mm Z=2.33 (T_sim 2.009, T_mean 1.98) | 1.48% | <= 8% | PASS |
| 103 | t3a8 | a8 T3.mm Z=2.56 (T_sim 2.229, T_mean 2.2) | 1.30% | <= 8% | PASS |
| 104 | t3a8 | a8 T3.mm Z=2.78 (T_sim 2.365, T_mean 2.32) | 1.92% | <= 8% | PASS |
| 105 | t3a8 | a8 T3.mm Z=3 (T_sim 2.500, T_mean 2.51) | 0.38% | <= 8% | PASS |
| 106 | t3a8 | a8 T3.mm Z=3.22 (T_sim 2.713, T_mean 2.65) | 2.39% | <= 8% | PASS |
| 107 | t3a8 | a8 T3.mm Z=3.44 (T_sim 2.849, T_mean 2.83) | 0.68% | <= 8% | PASS |
| 108 | t3a8 | a8 T3.mm Z=3.67 (T_sim 3.032, T_mean 2.97) | 2.09% | <= 8% | PASS |
| 109 | t3a8 | a8 T3.mm Z=3.89 (T_sim 3.141, T_mean 3.11) | 0.99% | <= 8% | PASS |
| 110 | t3a8 | a8 T3.mm Z=4.11 (T_sim 3.250, T_mean 3.33) | 2.42% | <= 8% | PASS |
| 111 | t3a8 | a8 T3.mm Z=5 (T_sim 3.813, T_mean 4.02) | 5.15% | <= 8% | PASS |
| 112 | t3a8 | a8 T3.mm Z=5.89 (T_sim 4.314, T_mean 4.44) | 2.83% | <= 8% | PASS |
| 113 | t3a8 | a8 T3.mm Z=7 (T_sim 4.945, T_mean 5.09) | 2.85% | <= 8% | PASS |
| 114 | t3a8 | a8 T3.mm Z=8 (T_sim 5.537, T_mean 5.69) | 2.69% | <= 8% | PASS |
| 115 | t3a8 | a8 T3.mm Z=9 (T_sim 6.026, T_mean 6.3) | 4.35% | <= 8% | PASS |
| 116 | t3a8 | a8 T3.mm Z=10 (T_sim 6.541, T_mean 6.83) | 4.24% | <= 8% | PASS |
| 117 | t3a8 | a8 T3.mm Z=11 (T_sim 7.055, T_mean 7.44) | 5.17% | <= 8% | PASS |
| 118 | t3a8 | a8 T3.mm Z=12 (T_sim 7.570, T_mean 8.08) | 6.31% | <= 8% | PASS |
| 119 | t3a8 | a8 T3.mm Z=13 (T_sim 8.085, T_mean 8.67) | 6.75% | <= 8% | PASS |
| 120 | t3a8 | a8 T3.mm Z=14 (T_sim 8.702, T_mean 9.31) | 6.53% | <= 8% | PASS |
| 121 | t3a8 | a8 T4 interior mean, max |m-m0|/m0 over 31 frames (m0 8.0000) | 4.057e-1 (frame 29, m=4.7540) | <= 1e-2 every frame | FAIL |
| 122 | t3a8 | a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 123 | t3a8 | a8 T4 capped estimate final / min (rel V0) | -6.104e-4 / -4.639e-2 | info (not graded) | INFO |
| 124 | t3a8 | a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 0.000e+0 / 2.361e-1 | info (not graded) | INFO |
| 125 | t3a8 | a8 T4 peak count | 12 at frame 1 cell [0,5,3] (front x 1.13a) | info (not graded) | INFO |
| 126 | t3a8 | a8 T4 final histogram n:cells(Poisson(4.269)) | 1:146(116) 2:221(248) 3:274(353) 4:413(377) 5:373(322) 6:257(229) 7:162(140) 8:68(75) 9:5(35) | info (not graded) | INFO |
| 127 | t3a8 | C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 152 > 0 | <= 0 every step | PASS |
| 128 | t3a8 | a8 pressure-stage dKE, theta measure, every step | 0 of 152 > 1e-8 KE_theta; max -2.086e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 129 | t3a8 | C3.fix3 a=8: max per-particle move in the fix-3 stage (correction + its push-out) / h | 0.1183 (correction alone 0.1000) | <= 0.1 | FAIL |
| 130 | t3a8 | C3.fix3 a=8: stage dKE every step | max |dKE| 1.664e-7 J | <= 1e-12 J | FAIL |
| 131 | t3a8 | C3.fix3 a=8: cumulative stage dPE <= PE_pack every step (PE_pack = PE(actual layers) - PE(uniform 8/cell), literal section Z) | max (cum dPE - PE_pack) 3.526e-2 J at step 152 (cum dPE 4.272e-2, PE_pack 7.457e-3) | <= 0 every step | FAIL |
| 132 | t3a8 | a8 fix3: same bound with PE_pack sign flipped (packing deficit = PE(uniform) - PE(actual)) | max (cum dPE - deficit) 5.525e-2 J | info (not graded) | INFO |
| 133 | t3a8 | C3.fix3 a=8: skipped regions (no air) max per step | 0 (with excess: 0) | == 0 | PASS |
| 134 | t3a8 | a8 fix3 PCG iterations per step (mean / max; steps solved) | 9.6 / 13; 152 of 152 | info (not graded) | INFO |
| 135 | t3a8 | a8 fix3 max |dx|/h per step (mean / max) | 0.0734 / 0.1000 | info (not graded) | INFO |
| 136 | t3a8 | a8 fix3 fraction of moved particles hitting the cap (mean / max over steps) | 6.834e-2 / 9.144e-1 | info (not graded) | INFO |
| 137 | t3a8 | a8 fix3 fraction of steps where the cap binds | 63 of 152 = 0.414 | info (not graded) | INFO |
| 138 | t3a8 | a8 fix3 stage dPE / dKE per step (sum, max dPE), PE_pack (start, end) | sum dPE 4.272e-2 J, max 1.643e-3 J; sum dKE -6.385e-7 J; PE_pack 2.842e-3 -> 7.457e-3 J | info (not graded) | INFO |
| 139 | t3a8 | C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 6.75% | <= 8.57% | PASS |
| 140 | t3a8 | a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.379 / 1.482 / -0.103; -3.54% | Z=1.89: 1.660 / 1.738 / -0.077; 1.87% | Z=2.11: 1.796 / 1.941 / -0.145; -1.84% | Z=2.33: 2.009 / 2.087 / -0.077; 1.48% | Z=2.56: 2.229 / 2.306 / -0.077; 1.30% | Z=2.78: 2.365 / 2.519 / -0.154; 1.92% | Z=3: 2.500 / 2.655 / -0.154; -0.38% | Z=3.22: 2.713 / 2.868 / -0.154; 2.39% | Z=3.44: 2.849 / 3.004 / -0.154; 0.68% | Z=3.67: 3.032 / 3.146 / -0.114; 2.09% | Z=3.89: 3.141 / 3.326 / -0.185; 0.99% | Z=4.11: 3.250 / 3.435 / -0.185; -2.42% | Z=5: 3.813 / 3.998 / -0.185; -5.15% | Z=5.89: 4.314 / 4.561 / -0.247; -2.83% | Z=7: 4.945 / 5.254 / -0.309; -2.85% | Z=8: 5.537 / 5.769 / -0.232; -2.69% | Z=9: 6.026 / 6.335 / -0.309; -4.35% | Z=10: 6.541 / 6.901 / -0.360; -4.24% | Z=11: 7.055 / 7.467 / -0.412; -5.17% | Z=12: 7.570 / 8.033 / -0.463; -6.31% | Z=13: 8.085 / 8.548 / -0.463; -6.75% | Z=14: 8.702 / 9.114 / -0.412; -6.53% | info (not graded) | INFO |
| 141 | t3a8 | a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -5839 vs -8091.5; column region (x<a) -1486 vs -1706.4; mean |per-step difference| 17.56 | info (not graded) | INFO |
| 142 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 Ritter windowed (section Z): max over frames k>=W of [x(t)-x(t-W)]/W, W = ceil(20h/(U_R frame)) = 5 frames | 1.9288 m/s (0.9108 U_R, frame 24) | < U_R = 2.1178 m/s every frame | PASS |
| 143 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 Ritter single-substep peak / frame-to-frame peak | 3.6430 U_R / 1.1131 U_R | info (not graded) | INFO |
| 144 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.E max (E-E0)/|E0| (PE datum z=0) | -1.729e-2 | <= 1e-6 | PASS (step-to-step rises (below E0): 10) |
| 145 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 pressure-stage dE <= 0 every step (m_f measure) | 0 of 159 > 0 | <= 0 every step | PASS |
| 146 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 P.res max true residual | 9.929e-9 | <= 1e-8 | PASS |
| 147 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 P.div max |div u| dt | 2.871e-9 | <= 1e-6 | PASS |
| 148 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 CFL / cap | max CFL 0.9918; cap 16; frames cap-bound with CFL>1: 0 of 32; substeps 159 | info (not graded) | INFO |
| 149 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm shift | 0.4159 | info (not graded) | INFO |
| 150 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=1.11 (report only) | 0.688 vs 0.41 (67.72%) | info (not graded) | INFO |
| 151 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=1.22 (report only) | 0.842 vs 0.84 (0.25%) | info (not graded) | INFO |
| 152 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=1.67 (T_sim 1.482, T_mean 1.43) | 3.66% | <= 8% | PASS |
| 153 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=1.89 (T_sim 1.738, T_mean 1.63) | 6.60% | <= 8% | PASS |
| 154 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=2.11 (T_sim 1.941, T_mean 1.83) | 6.09% | <= 8% | PASS |
| 155 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=2.33 (T_sim 2.087, T_mean 1.98) | 5.38% | <= 8% | PASS |
| 156 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=2.56 (T_sim 2.306, T_mean 2.2) | 4.81% | <= 8% | PASS |
| 157 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=2.78 (T_sim 2.519, T_mean 2.32) | 8.57% | <= 8% | FAIL |
| 158 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=3 (T_sim 2.655, T_mean 2.51) | 5.77% | <= 8% | PASS |
| 159 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=3.22 (T_sim 2.868, T_mean 2.65) | 8.22% | <= 8% | FAIL |
| 160 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=3.44 (T_sim 3.004, T_mean 2.83) | 6.14% | <= 8% | PASS |
| 161 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=3.67 (T_sim 3.146, T_mean 2.97) | 5.92% | <= 8% | PASS |
| 162 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=3.89 (T_sim 3.326, T_mean 3.11) | 6.95% | <= 8% | PASS |
| 163 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=4.11 (T_sim 3.435, T_mean 3.33) | 3.15% | <= 8% | PASS |
| 164 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=5 (T_sim 3.998, T_mean 4.02) | 0.54% | <= 8% | PASS |
| 165 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=5.89 (T_sim 4.561, T_mean 4.44) | 2.73% | <= 8% | PASS |
| 166 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=7 (T_sim 5.254, T_mean 5.09) | 3.22% | <= 8% | PASS |
| 167 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=8 (T_sim 5.769, T_mean 5.69) | 1.38% | <= 8% | PASS |
| 168 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=9 (T_sim 6.335, T_mean 6.3) | 0.55% | <= 8% | PASS |
| 169 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=10 (T_sim 6.901, T_mean 6.83) | 1.04% | <= 8% | PASS |
| 170 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=11 (T_sim 7.467, T_mean 7.44) | 0.36% | <= 8% | PASS |
| 171 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=12 (T_sim 8.033, T_mean 8.08) | 0.58% | <= 8% | PASS |
| 172 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=13 (T_sim 8.548, T_mean 8.67) | 1.41% | <= 8% | PASS |
| 173 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm Z=14 (T_sim 9.114, T_mean 9.31) | 2.10% | <= 8% | PASS |
| 174 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T4 interior mean, max |m-m0|/m0 over 33 frames (m0 8.0000) | 1.376e-1 (frame 27, m=9.1009) | <= 1e-2 every frame | FAIL |
| 175 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T4 particle count exact | 8192 | == 8192 | PASS |
| 176 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T4 capped estimate final / min (rel V0) | -1.263e-1 / -1.320e-1 | info (not graded) | INFO |
| 177 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T4 particles in n>12 cells (max) / fluid cells n>8 (max) | 1.420e-1 / 3.309e-1 | info (not graded) | INFO |
| 178 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T4 peak count | 35 at frame 28 cell [1,6,0] (front x 13.75a) | info (not graded) | INFO |
| 179 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T4 final histogram n:cells(Poisson(5.962)) | 1:198(21) 2:173(63) 3:58(125) 4:82(187) 5:113(223) 6:157(221) 7:140(188) 8:121(140) 9:100(93) 10:84(55) 11:66(30) 12:39(15) 13:13(7) 14:10(3) 15:3(1) 16:1(0) 21:1(0) 22:3(0) 23:4(0) 25:3(0) 26:2(0) 27:3(0) | info (not graded) | INFO |
| 180 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] C3.fix1: a8 pressure-stage dKE, face-mass measure (= logged stage), every step | 0 of 159 > 0 | <= 0 every step | PASS |
| 181 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 pressure-stage dKE, theta measure, every step | 0 of 159 > 1e-8 KE_theta; max -1.659e-4 J | <= 1e-8 x KE_theta,pre every step | PASS |
| 182 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] C3.fix3 a=8: density-correction stage present | no density correction in this code | present (fix 3) | FAIL |
| 183 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] C3.fix3 a=8: T3.mm worst graded row no worse than fix 1 (8.57%) | 8.57% | <= 8.57% | PASS |
| 184 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 T3.mm vs fix-1 (Z: T now / T fix1 / delta; error now) | Z=1.11: 0.688 / 0.688 / +0.000; 67.72% | Z=1.22: 0.842 / 0.842 / +0.000; 0.25% | Z=1.44: 1.190 / 1.190 / +0.000; 0.00% | Z=1.67: 1.482 / 1.482 / +0.000; 3.66% | Z=1.89: 1.738 / 1.738 / +0.000; 6.60% | Z=2.11: 1.941 / 1.941 / +0.000; 6.09% | Z=2.33: 2.087 / 2.087 / +0.000; 5.38% | Z=2.56: 2.306 / 2.306 / +0.000; 4.81% | Z=2.78: 2.519 / 2.519 / +0.000; 8.57% | Z=3: 2.655 / 2.655 / +0.000; 5.77% | Z=3.22: 2.868 / 2.868 / +0.000; 8.22% | Z=3.44: 3.004 / 3.004 / +0.000; 6.14% | Z=3.67: 3.146 / 3.146 / +0.000; 5.92% | Z=3.89: 3.326 / 3.326 / +0.000; 6.95% | Z=4.11: 3.435 / 3.435 / +0.000; 3.15% | Z=5: 3.998 / 3.998 / +0.000; -0.54% | Z=5.89: 4.561 / 4.561 / +0.000; 2.73% | Z=7: 5.254 / 5.254 / +0.000; 3.22% | Z=8: 5.769 / 5.769 / +0.000; 1.38% | Z=9: 6.335 / 6.335 / +0.000; 0.55% | Z=10: 6.901 / 6.901 / +0.000; 1.04% | Z=11: 7.467 / 7.467 / +0.000; 0.36% | Z=12: 8.033 / 8.033 / +0.000; -0.58% | Z=13: 8.548 / 8.548 / +0.000; -1.41% | Z=14: 9.114 / 9.114 / +0.000; -2.10% | info (not graded) | INFO |
| 185 | C3.fix3@f0220c4 | [on reverted f0220c4, C3.fix3 must FAIL] a8 (Physics) k=0/k=1 interface (z=h): net upward particle crossings vs grid w-face volume flux, in particles | run total -7179 vs -8084.8; column region (x<a) -2008 vs -1838.3; mean |per-step difference| 10.28 | info (not graded) | INFO |
| 186 | sign | C3.fix3.sign [production sign]: one full step, centre cell of 5x5x5 (16 particles; extra 8 uniform in the cell): particles with outward radial dx / centre count before -> after | 16/16 outward (min radial dx.r 1.002e-5 m^2); count 16 -> 14 | all outward AND count drops | PASS (test verdict PASS) |
| 187 | sign | C3.fix3.sign [production sign] variant: extra 8 placed in the inner [0.15,0.85] of the cell | 16/16 outward; count 16 -> 16 | info (not graded) | INFO |
| 188 | sign | C3.fix3.sign [sign FLIPPED (must fail)]: one full step, centre cell of 5x5x5 (16 particles; extra 8 uniform in the cell): particles with outward radial dx / centre count before -> after | 0/16 outward (min radial dx.r -1.417e-4 m^2); count 16 -> 16 | all outward AND count drops | PASS (test verdict FAIL; row passes when the flipped sign fails) |
| 189 | sign | C3.fix3.sign [sign FLIPPED (must fail)] variant: extra 8 placed in the inner [0.15,0.85] of the cell | 0/16 outward; count 16 -> 16 | info (not graded) | INFO |
| 190 | seedT3 | C3.seed T3 a=16: min distance of any seeded particle to any wall at t=0 | 7.1441e-4 m | >= clearance 4.4648e-4 m | PASS |
| 191 | seedT3 | C3.seed T3 a=8: min distance of any seeded particle to any wall at t=0 | 1.4290e-3 m | >= clearance 8.9297e-4 m | PASS |

Total graded: 92 PASS, 25 FAIL

## Notes (Coding Expert)
- (rows_fix2check.json holds the C3.fix3 run on reverted code f0220c4; the file name is reused only by the summary harness.) C3.fix3 FAILS on the reverted code as required: there is no correction stage and T4 is 13.76% at a=8. The step 9 a=16 result was T4 14.27%.
- **Fix 3 as frozen FAILS most C3.fix3 rows; nothing was tuned.** The correction inflates the fluid. e = max(n/8 - 1, 0) is one-sided: it only ever pushes particles out of cells holding more than 8 and never pulls them into cells holding fewer, so each step adds volume. The interior mean falls to about 4.7 at both resolutions, and T4 is 41.4% at a16 and 40.6% at a8 (under-dense, the opposite of before). PE rises: +10.9% |E0| at a16. In the still tank the densfix stage injects +65.5 J (21% |E0|) and the layers thin to about 6.5/cell. With jitter 0.5, almost every cell has some n > 8 from Poisson scatter, so the correction fires everywhere, every substep (dt_c = 1).
- Stage dKE is nonzero (up to 1.7e-7 J): the push-out after the correction (wall strip) zeroes into-wall velocities. The per-particle move exceeds 0.1 h (0.123 h at a16) because the separation push after the correction is counted in the stage. The correction alone is capped at exactly 0.1 h.
- **PE_pack sign.** Read literally (PE(actual) - PE(uniform)), it is positive at t=0 (3.2e-3 J at a16) because of per-column cell quantization. The cumulative dPE bound fails under both sign readings (+3.6e-2 J literal, +6.0e-2 J flipped).
- The push-out spike logs in the tank runs now include the separate() call inside the density correction, so they are not comparable to step 10_seed.
- Gate 1: 65/65, 0 flips against step 9. The T1/T1b pools hold exactly 8 per cell with jitter 0.1, so the correction does not fire. T2 changed at roundoff level (the half-dt ratio info row is 0.5017).
