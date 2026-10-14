# Gate 1 full set re-run at fix 1 (step 7)

- Code commit the runs executed at: 6c4214d (clean tree)
- spec/ASSERTS.md md5 57a770903e62919dd1a9a23d3b81361e
- PE zero: floor z=0 (box origin at z=0 in every setup; E = sum m (|v|^2/2 + g z), E0 = K0 + M g z_com,0)

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | modes | P.A max rel Linf over 6 solves (worst A_dirichlet_213 N=16) | 2.417e-13 | <= 1e-7 | PASS |
| 2 | modes | P.B max rel Linf over 9 solves (worst B_neumann_210 N=16) | 2.850e-13 | <= 1e-7 | PASS |
| 3 | modes | P.C max rel Linf over 9 solves (worst C_mixed_202 N=32) | 2.510e-13 | <= 1e-7 | PASS |
| 4 | modes | P.res mode solves (tol 1e-12): max true residual / ||rhs|| | 4.011e-12 | <= 1e-8 | PASS |
| 5 | D | P.D order at (0.5, 0.5, 0.25), N=16..256 | 2.000, 2.000, 2.000, 2.000 | info (not graded) | INFO |
| 6 | D | P.D truncation / discretization error at (0.5, 0.5, 0.25) (K=41 vs 801, all N) | 0.000e+0 | < 1e-2 | PASS |
| 7 | D | P.D centre point (0.5, 0.5, 0.5): order N=32->64->128->256 (all orders N=16..256: 1.707, 1.934, 1.984, 1.996) | 1.934, 1.984, 1.996 | each in [1.8, 2.2] | PASS |
| 8 | D | P.D truncation / discretization error at (0.5, 0.5, 0.5) (K=41 vs 801, all N) | 0.000e+0 | < 1e-2 | PASS |
| 9 | D | P.D order at (0.25, 0.5, 0.25), N=16..256 | 2.010, 2.002, 2.001, 2.000 | info (not graded) | INFO |
| 10 | D | P.D truncation / discretization error at (0.25, 0.5, 0.25) (K=41 vs 801, all N) | 0.000e+0 | < 1e-2 | PASS |
| 11 | D | P.D order at (0.25, 0.75, 0.75), N=16..256 | 1.973, 1.993, 1.998, 2.000 | info (not graded) | INFO |
| 12 | D | P.D truncation / discretization error at (0.25, 0.75, 0.75) (K=41 vs 801, all N) | 0.000e+0 | < 1e-2 | PASS |
| 13 | D | P.D max-over-interior-points error, N=16..256 | 1.015e-4, 2.538e-5, 6.344e-6, 1.586e-6, 3.965e-7 | info (not graded) | INFO |
| 14 | D | P.D order of max-over-interior-points error | 2.000, 2.000, 2.000, 2.000 | info (not graded) | INFO |
| 15 | D | P.D PCG iterations N=16..256 | 16:24, 32:31, 64:50, 128:91, 256:166 | info (not graded) | INFO |
| 16 | T1 | T1 N=8: max|u| at t=10 s | 5.625e-10 | < 2.215e-3 | PASS |
| 17 | T1 | T1 N=8: pressure profile, interior cells | 2.380e-10 | <= 1e-2 | PASS |
| 18 | T1 | T1 N=8: max (E-E0)/|E0| | -7.787e-15 | <= 1e-6 | PASS |
| 19 | T1 | P.res T1 N=8: max final true residual / ||rhs|| (600 solves) | 6.408e-9 | <= 1e-8 | PASS |
| 20 | T1 | P.res T1 N=8: max iters / median(prev 20), steps > 20 | 1.000 (step 21) | <= 2 | PASS |
| 21 | T1 | P.div T1 N=8: max |div u| * dt | 4.529e-10 | <= 1e-6 | PASS |
| 22 | T1 | NM T1 N=8: pressure-stage dE > 0 (graded in T3) | 0 of 600 steps; max 0.000e+0 J | info (not graded) | INFO |
| 23 | T1 | NM T1 N=8: CFL used per frame | max 0.2088, min 0.2088; frames with 8-cap binding and CFL>1: 0 | info (not graded) | INFO |
| 24 | T1 | NM T1 N=8: extension-stage |dE| per step (own stage) | max 0.000e+0 J, cumulative 0.000e+0 J | info (not graded) | INFO |
| 25 | T1 | T1 N=16: max|u| at t=10 s | 8.437e-10 | < 2.215e-3 | PASS |
| 26 | T1 | T1 N=16: pressure profile, interior cells | 5.267e-10 | <= 1e-2 | PASS |
| 27 | T1 | T1 N=16: max (E-E0)/|E0| | 4.191e-13 | <= 1e-6 | PASS |
| 28 | T1 | P.res T1 N=16: max final true residual / ||rhs|| (600 solves) | 6.694e-9 | <= 1e-8 | PASS |
| 29 | T1 | P.res T1 N=16: max iters / median(prev 20), steps > 20 | 1.000 (step 21) | <= 2 | PASS |
| 30 | T1 | P.div T1 N=16: max |div u| * dt | 1.526e-9 | <= 1e-6 | PASS |
| 31 | T1 | NM T1 N=16: pressure-stage dE > 0 (graded in T3) | 0 of 600 steps; max 0.000e+0 J | info (not graded) | INFO |
| 32 | T1 | NM T1 N=16: CFL used per frame | max 0.2953, min 0.2953; frames with 8-cap binding and CFL>1: 0 | info (not graded) | INFO |
| 33 | T1 | NM T1 N=16: extension-stage |dE| per step (own stage) | max 0.000e+0 J, cumulative 0.000e+0 J | info (not graded) | INFO |
| 34 | T1 | T1 N=32: max|u| at t=10 s | 1.200e-9 | < 2.215e-3 | PASS |
| 35 | T1 | T1 N=32: pressure profile, interior cells | 2.849e-10 | <= 1e-2 | PASS |
| 36 | T1 | T1 N=32: max (E-E0)/|E0| | 5.192e-14 | <= 1e-6 | PASS |
| 37 | T1 | P.res T1 N=32: max final true residual / ||rhs|| (600 solves) | 8.637e-9 | <= 1e-8 | PASS |
| 38 | T1 | P.res T1 N=32: max iters / median(prev 20), steps > 20 | 1.000 (step 21) | <= 2 | PASS |
| 39 | T1 | P.div T1 N=32: max |div u| * dt | 6.248e-9 | <= 1e-6 | PASS |
| 40 | T1 | NM T1 N=32: pressure-stage dE > 0 (graded in T3) | 0 of 600 steps; max 0.000e+0 J | info (not graded) | INFO |
| 41 | T1 | NM T1 N=32: CFL used per frame | max 0.4176, min 0.4176; frames with 8-cap binding and CFL>1: 0 | info (not graded) | INFO |
| 42 | T1 | NM T1 N=32: extension-stage |dE| per step (own stage) | max 0.000e+0 J, cumulative 0.000e+0 J | info (not graded) | INFO |
| 43 | T1 | T1 floor force order (sec. Z): e(h) = 8.403e-13, 6.134e-13, 4.211e-13 vs floor 1e-10 x rho g H L W | all <= floor: exact discrete equilibrium | order >= 0.8 if above floor | PASS |
| 44 | T1 | T1 floor force regression floor (sec. Z): max e over N | 8.403e-13 | <= 1e-10 | PASS |
| 45 | T1 | T1 floor force e at h/H=1/32 | 4.211e-13 | <= 1e-2 | PASS |
| 46 | T1 | T1 side wall force order (sec. Z): e(h) = 2.454e-12, 1.336e-12, 1.117e-12 vs floor 1e-10 x 1/2 rho g H^2 W | all <= floor: exact discrete equilibrium | order >= 0.8 if above floor | PASS |
| 47 | T1 | T1 side wall force regression floor (sec. Z): max e over N | 2.454e-12 | <= 1e-10 | PASS |
| 48 | T1 | T1 side wall force e at h/H=1/32 | 1.117e-12 | <= 1e-2 | PASS |
| 49 | T1b | T1b N=8: ghost-fluid surface z_c + theta h (mean [min,max] over columns) vs H_eff | 0.164062500000 [0.164062500000, 0.164062500000] vs 0.164062500000; rel diff 0.000e+0 | info (not graded) | INFO |
| 50 | T1b | T1b N=8: H nominal / H_eff (H/h = 2.60, top-cell particles 5/8) | 0.1625 / 0.1640625 | info (not graded) | INFO |
| 51 | T1b | T1b.u N=8: max|u| after 10 s | 2.910e-10 | < 1.269e-3 | PASS |
| 52 | T1b | T1b.floor N=8: max over all 600 steps of signed (F_floor - dPz/dt)/Mg - 1 [graded]; signed (F_floor + dPz/dt)/Mg - 1 [info] = 5.115e-12 (step 1) | 5.115e-12 (step 1) | |.| <= 1e-6 every step | PASS |
| 53 | T1b | T1b N=8: raw floor force |F - Mg|/(Mg), max over steps / at end | 5.115e-12 / 3.349e-12 | info (not graded) | INFO |
| 54 | T1b | T1b.E N=8: max (E-E0)/|E0| | 3.925e-11 | <= 1e-6 | PASS (steps with any rise, by largest stage: {"gravity":600}) |
| 55 | T1b | T1b N=8: side-wall rel err: graded theta-aware integral / plain cell-sum (info) | 1.202e-11 / 2.041e-2 | info (not graded) | INFO |
| 56 | T1b | P.res T1b N=8: max final true residual / ||rhs|| (600 solves) | 2.711e-9 | <= 1e-8 | PASS |
| 57 | T1b | P.res T1b N=8: max iters / median(prev 20), steps > 20 | 1.000 (step 21) | <= 2 | PASS |
| 58 | T1b | P.div T1b N=8: max |div u| * dt | 1.897e-10 | <= 1e-6 | PASS |
| 59 | T1b | NM T1b N=8: pressure-stage dE > 0 (graded in T3) | 0 of 600 steps; max 0.000e+0 J | info (not graded) | INFO |
| 60 | T1b | NM T1b N=8: CFL used per frame | max 0.2088, min 0.2088; frames with 8-cap binding and CFL>1: 0 | info (not graded) | INFO |
| 61 | T1b | NM T1b N=8: extension-stage |dE| per step (own stage) | max 0.000e+0 J, cumulative 0.000e+0 J | info (not graded) | INFO |
| 62 | T1b | T1b N=16: ghost-fluid surface z_c + theta h (mean [min,max] over columns) vs H_eff | 0.164062500000 [0.164062500000, 0.164062500000] vs 0.164062500000; rel diff 0.000e+0 | info (not graded) | INFO |
| 63 | T1b | T1b N=16: H nominal / H_eff (H/h = 5.20, top-cell particles 2/8) | 0.1625 / 0.1640625 | info (not graded) | INFO |
| 64 | T1b | T1b.u N=16: max|u| after 10 s | 1.334e-9 | < 1.269e-3 | PASS |
| 65 | T1b | T1b.floor N=16: max over all 600 steps of signed (F_floor - dPz/dt)/Mg - 1 [graded]; signed (F_floor + dPz/dt)/Mg - 1 [info] = 1.436e-11 (step 1) | 1.436e-11 (step 1) | |.| <= 1e-6 every step | PASS |
| 66 | T1b | T1b N=16: raw floor force |F - Mg|/(Mg), max over steps / at end | 1.436e-11 / 4.576e-12 | info (not graded) | INFO |
| 67 | T1b | T1b.E N=16: max (E-E0)/|E0| | -1.358e-14 | <= 1e-6 | PASS (steps with any rise, by largest stage: {}) |
| 68 | T1b | T1b N=16: side-wall rel err: graded theta-aware integral / plain cell-sum (info) | 1.642e-11 / 2.268e-3 | info (not graded) | INFO |
| 69 | T1b | P.res T1b N=16: max final true residual / ||rhs|| (600 solves) | 6.416e-9 | <= 1e-8 | PASS |
| 70 | T1b | P.res T1b N=16: max iters / median(prev 20), steps > 20 | 1.000 (step 21) | <= 2 | PASS |
| 71 | T1b | P.div T1b N=16: max |div u| * dt | 1.827e-9 | <= 1e-6 | PASS |
| 72 | T1b | NM T1b N=16: pressure-stage dE > 0 (graded in T3) | 0 of 600 steps; max 0.000e+0 J | info (not graded) | INFO |
| 73 | T1b | NM T1b N=16: CFL used per frame | max 0.2953, min 0.2953; frames with 8-cap binding and CFL>1: 0 | info (not graded) | INFO |
| 74 | T1b | NM T1b N=16: extension-stage |dE| per step (own stage) | max 0.000e+0 J, cumulative 0.000e+0 J | info (not graded) | INFO |
| 75 | T1b | T1b N=32: ghost-fluid surface z_c + theta h (mean [min,max] over columns) vs H_eff | 0.162109375000 [0.162109375000, 0.162109375000] vs 0.162109375000; rel diff 0.000e+0 | info (not graded) | INFO |
| 76 | T1b | T1b N=32: H nominal / H_eff (H/h = 10.40, top-cell particles 3/8) | 0.1625 / 0.162109375 | info (not graded) | INFO |
| 77 | T1b | T1b.u N=32: max|u| after 10 s | 1.416e-9 | < 1.261e-3 | PASS |
| 78 | T1b | T1b.floor N=32: max over all 600 steps of signed (F_floor - dPz/dt)/Mg - 1 [graded]; signed (F_floor + dPz/dt)/Mg - 1 [info] = 6.395e-12 (step 1) | 6.395e-12 (step 1) | |.| <= 1e-6 every step | PASS |
| 79 | T1b | T1b N=32: raw floor force |F - Mg|/(Mg), max over steps / at end | 6.395e-12 / 9.078e-13 | info (not graded) | INFO |
| 80 | T1b | T1b.E N=32: max (E-E0)/|E0| | 2.251e-12 | <= 1e-6 | PASS (steps with any rise, by largest stage: {"gravity":397}) |
| 81 | T1b | T1b N=32: side-wall rel err: graded theta-aware integral / plain cell-sum (info) | 8.284e-12 / 1.306e-3 | info (not graded) | INFO |
| 82 | T1b | P.res T1b N=32: max final true residual / ||rhs|| (600 solves) | 6.437e-9 | <= 1e-8 | PASS |
| 83 | T1b | P.res T1b N=32: max iters / median(prev 20), steps > 20 | 1.000 (step 21) | <= 2 | PASS |
| 84 | T1b | P.div T1b N=32: max |div u| * dt | 8.448e-9 | <= 1e-6 | PASS |
| 85 | T1b | NM T1b N=32: pressure-stage dE > 0 (graded in T3) | 0 of 600 steps; max 0.000e+0 J | info (not graded) | INFO |
| 86 | T1b | NM T1b N=32: CFL used per frame | max 0.4176, min 0.4176; frames with 8-cap binding and CFL>1: 0 | info (not graded) | INFO |
| 87 | T1b | NM T1b N=32: extension-stage |dE| per step (own stage) | max 0.000e+0 J, cumulative 0.000e+0 J | info (not graded) | INFO |
| 88 | T1b | T1b N=64: ghost-fluid surface z_c + theta h (mean [min,max] over columns) vs H_eff | 0.162109375000 [0.162109375000, 0.162109375000] vs 0.162109375000; rel diff 0.000e+0 | info (not graded) | INFO |
| 89 | T1b | T1b N=64: H nominal / H_eff (H/h = 20.80, top-cell particles 6/8) | 0.1625 / 0.162109375 | info (not graded) | INFO |
| 90 | T1b | T1b.u N=64: max|u| after 10 s | 1.675e-9 | < 1.261e-3 | PASS |
| 91 | T1b | T1b.floor N=64: max over all 600 steps of signed (F_floor - dPz/dt)/Mg - 1 [graded]; signed (F_floor + dPz/dt)/Mg - 1 [info] = -8.084e-13 (step 1) | -8.084e-13 (step 1) | |.| <= 1e-6 every step | PASS |
| 92 | T1b | T1b N=64: raw floor force |F - Mg|/(Mg), max over steps / at end | 8.084e-13 / 6.009e-13 | info (not graded) | INFO |
| 93 | T1b | T1b.E N=64: max (E-E0)/|E0| | 1.090e-12 | <= 1e-6 | PASS (steps with any rise, by largest stage: {"gravity":321}) |
| 94 | T1b | T1b N=64: side-wall rel err: graded theta-aware integral / plain cell-sum (info) | 8.895e-13 / 1.452e-4 | info (not graded) | INFO |
| 95 | T1b | P.res T1b N=64: max final true residual / ||rhs|| (600 solves) | 6.712e-9 | <= 1e-8 | PASS |
| 96 | T1b | P.res T1b N=64: max iters / median(prev 20), steps > 20 | 1.000 (step 21) | <= 2 | PASS |
| 97 | T1b | P.div T1b N=64: max |div u| * dt | 1.335e-8 | <= 1e-6 | PASS |
| 98 | T1b | NM T1b N=64: pressure-stage dE > 0 (graded in T3) | 0 of 600 steps; max 0.000e+0 J | info (not graded) | INFO |
| 99 | T1b | NM T1b N=64: CFL used per frame | max 0.5906, min 0.5906; frames with 8-cap binding and CFL>1: 0 | info (not graded) | INFO |
| 100 | T1b | NM T1b N=64: extension-stage |dE| per step (own stage) | max 0.000e+0 J, cumulative 0.000e+0 J | info (not graded) | INFO |
| 101 | T1b | T1b.wall N=64: side-wall force rel err vs 1/2 rho g H_eff^2 W | 8.895e-13 | <= 1e-2 | PASS |
| 102 | T1b | T1b.wall envelope order: e = 1.202e-11, 1.642e-11, 8.284e-12, 8.895e-13 | all < 1e-10 floor: order skipped | order >= 0.8 unless all < 1e-10 | PASS |
| 103 | T1b | T1b.p N=64: pressure rel err, interior cells below surface row | 6.534e-10 (73036 cells) | <= 1e-2 | PASS |
| 104 | T2 | T2 COM accel (fit of w_com, 49 substeps; a=9.810000000) | 1.268e-14 | |a-g|/g <= 1e-3 | PASS (min z 0.401 m, no floor contact) |
| 105 | T2 | T2 horizontal momentum max(|Px|,|Py|)/(1e-8 M g t) | 2.516e-9 | <= 1 | PASS |
| 106 | T2 | P.res T2: max final true residual / ||rhs|| (49 solves) | 6.647e-9 | <= 1e-8 | PASS |
| 107 | T2 | P.res T2: max iters / median(prev 20), steps > 20 | 1.000 (step 21) | <= 2 | PASS |
| 108 | T2 | P.div T2: max |div u| * dt | 1.468e-16 | <= 1e-6 | PASS |
| 109 | T2 | NM T2: pressure-stage dE > 0 (graded in T3) | 21 of 49 steps; max 4.263e-14 J | info (not graded) | INFO |
| 110 | T2 | NM T2: CFL used per frame | max 0.9842, min 0.3302; frames with 8-cap binding and CFL>1: 0 | info (not graded) | INFO |
| 111 | T2 | NM T2: extension-stage |dE| per step (own stage) | max 8.363e+0 J, cumulative 1.851e+2 J | info (not graded) | INFO |
| 112 | T2 | T2 half-dt: (E-E0)/|E0| at t=0.4 s, dt vs dt/2 (49 vs 98 substeps; E0 equal: true) | -1.4848e-2 vs -7.4239e-3; ratio 0.5000 | info (not graded) | INFO |

Total graded: 65 PASS, 0 FAIL
