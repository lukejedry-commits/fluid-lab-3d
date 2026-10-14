# Step 4: T3 dam break, T4 volume, C3 regressions

- Code commit the runs executed at: 0b2888f (clean tree)
- spec/ASSERTS.md md5 04900721b5a5d3723298e7424a07f8c8; spec/mm_1952.json md5 ff0ebad4590c77abc266084718656220
- PE zero: floor z=0 (E = sum m (|v|^2/2 + g z), E0 = K0 + M g z_com,0)
- T3.mm: Z = front x measured from the back wall / a (front starts at Z = 1); T = t sqrt(2g/a), shifted so T = 1.19 at Z = 1.44 (linear interpolation)

| # | Part | Check | Measured | Threshold | Result |
|---|---|---|---|---|---|
| 1 | T3 | T3 Ritter: max front speed over all 226 substep samples (front = max particle x; at t=0.5125 s, Z=15.885) | 2.0534 m/s (0.9696 of limit) | < 2 sqrt(g 2a) = 2.1178 m/s | PASS |
| 2 | T3 | T3.E: max (E-E0)/|E0| over all steps (PE datum floor z=0) | -1.731e-2 (t=0.0167 s) | <= 1e-6 | PASS (steps where E rose, by largest stage: {}) |
| 3 | T3 | T3 pressure-stage dE <= 0 at every step (NM) | 0 of 226 steps > 0; max stage dE -4.444e-5 J | <= 0 every step | PASS |
| 4 | T3 | T3 stage p2g: cumulative dE / max |dE| per step / steps with dE>0 | 1.129e-2 J / 1.507e-4 J / 225 | info (not graded) | INFO |
| 5 | T3 | T3 stage ghost: cumulative dE / max |dE| per step / steps with dE>0 | 0.000e+0 J / 0.000e+0 J / 0 | info (not graded) | INFO |
| 6 | T3 | T3 stage gravity: cumulative dE / max |dE| per step / steps with dE>0 | 2.159e-1 J / 4.990e-3 J / 226 | info (not graded) | INFO |
| 7 | T3 | T3 stage pressure: cumulative dE / max |dE| per step / steps with dE>0 | -3.619e-2 J / 1.355e-3 J / 0 | info (not graded) | INFO |
| 8 | T3 | T3 stage g2p: cumulative dE / max |dE| per step / steps with dE>0 | -7.878e+0 J / 7.066e-2 J / 0 | info (not graded) | INFO |
| 9 | T3 | T3 stage extension: cumulative dE / max |dE| per step / steps with dE>0 | 7.864e+0 J / 7.065e-2 J / 226 | info (not graded) | INFO |
| 10 | T3 | T3 stage advect: cumulative dE / max |dE| per step / steps with dE>0 | -1.970e-1 J / 7.246e-3 J / 0 | info (not graded) | INFO |
| 11 | T3 | T3 stage pushout: cumulative dE / max |dE| per step / steps with dE>0 | 1.232e-4 J / 7.054e-7 J / 225 | info (not graded) | INFO |
| 12 | T3 | T4 particle count exact (65536) | 65536 | == 65536 | PASS |
| 13 | T3 | T4 density-estimated volume, max |V-V0|/V0 over the T3 run | 1.665e-1 | <= 1e-2 | FAIL (V0 = 3.733178e-4 m^3, estimator sum_c min(n_c,8) h^3/8) |
| 14 | T3 | T3 info: energy loss E0-E_end vs sum_k 0.5 M g^2 dt_k^2 | 1.954e-2 J vs 2.588e-2 J; ratio 0.7550 (226 substeps) | info (not graded) | INFO |
| 15 | T3 | T3.mm time shift applied (T_sim = t sqrt(2g/a) + shift, so T=1.19 at Z=1.44); Z = (max particle x from back wall)/a, starts at 1 | 0.3417 | info (not graded) | INFO (raw T at Z=1.44 = 0.8483) |
| 16 | T3 | T3.mm Z=1.11: T_sim vs T_mean (release dominated) | 0.686 vs 0.41 (67.42%) | info (not graded) | INFO |
| 17 | T3 | T3.mm Z=1.22: T_sim vs T_mean (release dominated) | 0.882 vs 0.84 (4.99%) | info (not graded) | INFO |
| 18 | T3 | T3.mm Z=1.44 (shift anchor) | 1.190 vs 1.19 | info (not graded) | INFO |
| 19 | T3 | T3.mm Z=1.67: |T_sim - T_mean|/T_mean (T_sim 1.457, T_mean 1.43) | 1.88% | <= 8% | PASS |
| 20 | T3 | T3.mm Z=1.89: |T_sim - T_mean|/T_mean (T_sim 1.681, T_mean 1.63) | 3.14% | <= 8% | PASS |
| 21 | T3 | T3.mm Z=2.11: |T_sim - T_mean|/T_mean (T_sim 1.886, T_mean 1.83) | 3.07% | <= 8% | PASS |
| 22 | T3 | T3.mm Z=2.33: |T_sim - T_mean|/T_mean (T_sim 2.078, T_mean 1.98) | 4.93% | <= 8% | PASS |
| 23 | T3 | T3.mm Z=2.56: |T_sim - T_mean|/T_mean (T_sim 2.267, T_mean 2.2) | 3.04% | <= 8% | PASS |
| 24 | T3 | T3.mm Z=2.78: |T_sim - T_mean|/T_mean (T_sim 2.440, T_mean 2.32) | 5.17% | <= 8% | PASS |
| 25 | T3 | T3.mm Z=3: |T_sim - T_mean|/T_mean (T_sim 2.607, T_mean 2.51) | 3.85% | <= 8% | PASS |
| 26 | T3 | T3.mm Z=3.22: |T_sim - T_mean|/T_mean (T_sim 2.768, T_mean 2.65) | 4.43% | <= 8% | PASS |
| 27 | T3 | T3.mm Z=3.44: |T_sim - T_mean|/T_mean (T_sim 2.923, T_mean 2.83) | 3.30% | <= 8% | PASS |
| 28 | T3 | T3.mm Z=3.67: |T_sim - T_mean|/T_mean (T_sim 3.082, T_mean 2.97) | 3.78% | <= 8% | PASS |
| 29 | T3 | T3.mm Z=3.89: |T_sim - T_mean|/T_mean (T_sim 3.230, T_mean 3.11) | 3.85% | <= 8% | PASS |
| 30 | T3 | T3.mm Z=4.11: |T_sim - T_mean|/T_mean (T_sim 3.373, T_mean 3.33) | 1.29% | <= 8% | PASS |
| 31 | T3 | T3.mm Z=5: |T_sim - T_mean|/T_mean (T_sim 3.931, T_mean 4.02) | 2.22% | <= 8% | PASS |
| 32 | T3 | T3.mm Z=5.89: |T_sim - T_mean|/T_mean (T_sim 4.461, T_mean 4.44) | 0.48% | <= 8% | PASS |
| 33 | T3 | T3.mm Z=7: |T_sim - T_mean|/T_mean (T_sim 5.094, T_mean 5.09) | 0.08% | <= 8% | PASS |
| 34 | T3 | T3.mm Z=8: |T_sim - T_mean|/T_mean (T_sim 5.649, T_mean 5.69) | 0.71% | <= 8% | PASS |
| 35 | T3 | T3.mm Z=9: |T_sim - T_mean|/T_mean (T_sim 6.197, T_mean 6.3) | 1.63% | <= 8% | PASS |
| 36 | T3 | T3.mm Z=10: |T_sim - T_mean|/T_mean (T_sim 6.740, T_mean 6.83) | 1.31% | <= 8% | PASS |
| 37 | T3 | T3.mm Z=11: |T_sim - T_mean|/T_mean (T_sim 7.277, T_mean 7.44) | 2.19% | <= 8% | PASS |
| 38 | T3 | T3.mm Z=12: |T_sim - T_mean|/T_mean (T_sim 7.809, T_mean 8.08) | 3.35% | <= 8% | PASS |
| 39 | T3 | T3.mm Z=13: |T_sim - T_mean|/T_mean (T_sim 8.336, T_mean 8.67) | 3.85% | <= 8% | PASS |
| 40 | T3 | T3.mm Z=14: |T_sim - T_mean|/T_mean (T_sim 8.860, T_mean 9.31) | 4.84% | <= 8% | PASS |
| 41 | T3 | P.res T3: max final true residual / ||rhs|| (226 solves) | 9.990e-9 | <= 1e-8 | PASS |
| 42 | T3 | P.res T3: max iters / median(prev 20), steps > 20 | 1.048 (step 107) | <= 2 | PASS |
| 43 | T3 | P.div T3: max |div u| * dt | 8.261e-9 | <= 1e-6 | PASS |
| 44 | T3 | T3 CFL used per frame | max 1.2997, min 0.8016; frames with 8-cap binding and CFL>1: 22 of 31 | info (not graded) | INFO |
| 45 | C3 | C3.ghost [fix ON (production), expect PASS]: max |u_f - U| over 720 m_f=0 faces next to fluid faces | 2.776e-16 | <= 1e-12 | PASS (test verdict PASS; row passes when verdict == expected) |
| 46 | C3 | C3.wall [fix ON (production), expect PASS]: max distance outside [r, L-r]; into-wall v stripped & tangential kept | 0.000e+0 m; v ok true | <= 0 and v ok | PASS (test verdict PASS) |
| 47 | C3 | C3.sep-clip [fix ON (production), expect PASS]: wall pair stays in box (max outside), COM change, interior pair distance | 0.000e+0 m; 0.000e+0 m; 1.250e-2 vs 1.250e-2 | outside <= 0, dCOM <= 1e-15, d >= minD | PASS (test verdict PASS) |
| 48 | C3 | C3.ghost [fix REMOVED, expect FAIL]: max |u_f - U| over 720 m_f=0 faces next to fluid faces | 3.000e-1 | <= 1e-12 | PASS (test verdict FAIL; row passes when verdict == expected) |
| 49 | C3 | C3.wall [fix REMOVED, expect FAIL]: max distance outside [r, L-r]; into-wall v stripped & tangential kept | 1.575e-2 m; v ok false | <= 0 and v ok | PASS (test verdict FAIL) |
| 50 | C3 | C3.sep-clip [fix REMOVED, expect FAIL]: wall pair stays in box (max outside), COM change, interior pair distance | 6.100e-3 m; 0.000e+0 m; 1.250e-2 vs 1.250e-2 | outside <= 0, dCOM <= 1e-15, d >= minD | PASS (test verdict FAIL) |
| 51 | C3 | C3.sep [separation REMOVED (sepIters 0), expect FAIL]: interior pair distance vs minD | 1.000e-3 vs 1.250e-2 | >= minD | PASS (test verdict FAIL) |

Total graded: 36 PASS, 1 FAIL

## Notes (Coding Expert)
- Setup: a = 2.25 in = 0.05715 m resolved by 16 cells; column a (x) × a (y, full tank width) × 2a (z) against the back wall x = 0; grid 256×16×40 (16a long); 65,536 particles; 31 frames, 226 substeps, t_end = 0.5167 s. Front = max particle x. Ritter sample = per-substep front displacement / dt.
- **T4 volume FAIL (16.65%), not tuned.** The estimator is sum_c min(n_c, 8) h^3/8. It already reads −2.6% after the first frame (t = 0.0167 s, Z = 1.09), when the column has hardly moved. From there it grows to about −15% by Z ≈ 8 and stays roughly flat. Fluid cells fall from 8192 to 7178 while the particle count stays exact (65,536). That early drop at near-rest suggests the estimator is losing volume to binning: once jittered particles cross cell lines, some cells hold 9 or more and others 7 or fewer, and the cap discards the excess. Some real compression or clustering in the thin front can't be ruled out. Validation needs to rule on the estimator definition. This is a diagnosis, not a fix.
- CFL: the 8-substep cap binds with CFL > 1 in 22 of 31 frames (max CFL used 1.2997). Per section Z this is flagged and logged, not graded.
- A smoke run at a = 8 cells (not committed, same code) had 1 of 153 steps with pressure-stage dE > 0 (+1.76e-5 J), T4 at 13.2%, and every T3.mm row passing. At a = 16 the pressure stage is ≤ 0 at all 226 steps.
