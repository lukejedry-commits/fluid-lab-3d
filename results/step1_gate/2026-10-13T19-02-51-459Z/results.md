# Step 1 gate results (2026-10-13T19-02-51-459Z)

| # | Check | Measured | Threshold | Result |
|---|---|---|---|---|
| 1 | P.A max rel Linf over 6 solves (worst A_dirichlet_213 N=16) | 2.417e-13 | <= 1e-7 | PASS |
| 2 | P.B max rel Linf over 9 solves (worst B_neumann_210 N=16) | 2.850e-13 | <= 1e-7 | PASS |
| 3 | P.C max rel Linf over 9 solves (worst C_mixed_202 N=32) | 2.510e-13 | <= 1e-7 | PASS |
| 4 | P.res mode solves: max final true residual / ||rhs|| (solve tol 1e-12) | 4.011e-12 | <= 1e-8 | PASS |
| 5 | P.D order at (0.5, 0.5, 0.25), N=16/32/64/128 | 2.000, 2.000, 2.000 | each in [1.8, 2.2] | PASS |
| 6 | P.D series truncation / discretization error at (0.5, 0.5, 0.25) (K=41 vs K=801) | 0.000e+0 | < 1e-2 | PASS |
| 7 | P.D order at (0.5, 0.5, 0.5), N=16/32/64/128 | 1.707, 1.934, 1.984 | each in [1.8, 2.2] | FAIL |
| 8 | P.D series truncation / discretization error at (0.5, 0.5, 0.5) (K=41 vs K=801) | 0.000e+0 | < 1e-2 | PASS |
| 9 | P.D order at (0.25, 0.5, 0.25), N=16/32/64/128 | 2.010, 2.002, 2.001 | each in [1.8, 2.2] | PASS |
| 10 | P.D series truncation / discretization error at (0.25, 0.5, 0.25) (K=41 vs K=801) | 0.000e+0 | < 1e-2 | PASS |
| 11 | P.D order at (0.25, 0.75, 0.75), N=16/32/64/128 | 1.973, 1.993, 1.998 | each in [1.8, 2.2] | PASS |
| 12 | P.D series truncation / discretization error at (0.25, 0.75, 0.75) (K=41 vs K=801) | 0.000e+0 | < 1e-2 | PASS |
| 13 | T1 N=8 (h/H=1/8): max|u| at t=10.000 s | 5.632e-10 | < 2.215e-3 (1e-3 sqrt(gH)) | PASS |
| 14 | T1 N=8: pressure profile max rel err, interior cells | 2.361e-10 | <= 1e-2 | PASS |
| 15 | T1 N=8: max_t (E-E0)/|E0| | -7.787e-15 | <= 1e-6 | PASS |
| 16 | P.res T1 N=8: max final true residual / ||rhs|| over 600 solves | 6.408e-9 | <= 1e-8 | PASS |
| 17 | P.res T1 N=8: max iters / median(prev 20) (steps > 20) | 1.000 at step 21 | <= 2 | PASS |
| 18 | P.div T1 N=8: max |div u| * dt over all projections | 4.529e-10 | <= 1e-6 | PASS |
| 19 | T1 N=16 (h/H=1/16): max|u| at t=10.000 s | 8.434e-10 | < 2.215e-3 (1e-3 sqrt(gH)) | PASS |
| 20 | T1 N=16: pressure profile max rel err, interior cells | 5.266e-10 | <= 1e-2 | PASS |
| 21 | T1 N=16: max_t (E-E0)/|E0| | 3.976e-13 | <= 1e-6 | PASS |
| 22 | P.res T1 N=16: max final true residual / ||rhs|| over 600 solves | 6.694e-9 | <= 1e-8 | PASS |
| 23 | P.res T1 N=16: max iters / median(prev 20) (steps > 20) | 1.000 at step 21 | <= 2 | PASS |
| 24 | P.div T1 N=16: max |div u| * dt over all projections | 1.526e-9 | <= 1e-6 | PASS |
| 25 | T1 N=32 (h/H=1/32): max|u| at t=10.000 s | 1.200e-9 | < 2.215e-3 (1e-3 sqrt(gH)) | PASS |
| 26 | T1 N=32: pressure profile max rel err, interior cells | 2.833e-10 | <= 1e-2 | PASS |
| 27 | T1 N=32: max_t (E-E0)/|E0| | 3.950e-14 | <= 1e-6 | PASS |
| 28 | P.res T1 N=32: max final true residual / ||rhs|| over 600 solves | 8.637e-9 | <= 1e-8 | PASS |
| 29 | P.res T1 N=32: max iters / median(prev 20) (steps > 20) | 1.000 at step 21 | <= 2 | PASS |
| 30 | P.div T1 N=32: max |div u| * dt over all projections | 6.248e-9 | <= 1e-6 | PASS |
| 31 | T1 floor force: fitted order of e(h) over h/H=1/8,1/16,1/32 | 0.500 (e = 8.398e-13, 6.141e-13, 4.198e-13) | >= 0.8 | FAIL |
| 32 | T1 floor force: e at h/H=1/32 | 4.198e-13 | <= 1e-2 | PASS |
| 33 | T1 side wall force: fitted order of e(h) over h/H=1/8,1/16,1/32 | 0.437 (e = 2.119e-12, 1.464e-12, 1.157e-12) | >= 0.8 | FAIL |
| 34 | T1 side wall force: e at h/H=1/32 | 1.157e-12 | <= 1e-2 | PASS |
| 35 | T2 COM vertical acceleration (linear fit of w_com, 49 substeps, t<=0.400 s; a=9.810000000) | 1.286e-14 | |a-g|/g <= 1e-3 | PASS (min particle z at end 0.401 m: no floor contact) |
| 36 | T2 horizontal momentum max_t max(|Px|,|Py|) / (1e-8 M g t) | 1.536e-9 | <= 1 | PASS |
| 37 | P.res T2: max final true residual / ||rhs|| over 49 solves | 6.349e-9 | <= 1e-8 | PASS |
| 38 | P.res T2: max iters / median(prev 20) (steps > 20) | 1.000 at step 21 | <= 2 | PASS |
| 39 | P.div T2: max |div u| * dt over all projections | 1.470e-16 | <= 1e-6 | PASS |

Total: 36 PASS, 3 FAIL
