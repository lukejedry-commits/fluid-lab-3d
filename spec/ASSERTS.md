# Fluid Lab 3D v1: Frozen asserts (Validation Engineer Expert, 2026-10-13)
Against spec/PHYSICS_SPEC.md md5 bb779edb…, pressure_ref.py 4c00a29f…, pressure_ref.json 716110c3… (commit a82cc18).
All checks measured in 64-bit before any float32 store. Outputs go to step-named folders, never overwritten. A failing test is never weakened; amendments are dated in section Z.

## P. Pressure solver (pressure_ref)
- P.A/B/C: discrete-eigenvector modes: rel. L∞ error vs file target <= 1e-7 (solver tol 1e-8 x conditioning margin 10). Family C only with surface on top face.
- P.D: interior points only; observed order p in [1.8, 2.2] over 3 refinements with ratio 2; series truncation must be < 1e-2 x discretization error at every graded point.
- P.res: final PCG residual <= 1e-8 ||rhs|| every solve; iteration count logged; a jump > 2x the previous step's count at fixed N is a FAIL.
- P.div: after every projection, max|div u| * dt <= 1e-6.

## T1 Still pool (first gate)
- max|u| < 1e-3 sqrt(gH) after 10 s simulated.
- Pressure profile: rel. error vs rho g (H - z), interior cells, <= 1%.
- Floor and side-wall forces: rel. error e(h) at h/H = 1/8, 1/16, 1/32; fitted order >= 0.8 AND e <= 1% at h/H = 1/32.
- E(t) <= E0 (1 + 1e-6) for all t.

## T2 Free fall (first gate)
- COM vertical acceleration (linear fit of w_com over the run, 64-bit): |a - g|/g <= 1e-3.
- Horizontal momentum: |P_x|,|P_y| <= 1e-8 * M g t.

## T3 Dam break (blocked until T1, T2 pass and the M&M reference file is frozen)
- Reference: Martin, J.C. & Moyce, W.J. (1952), "Part IV. An experimental study of the collapse of liquid columns on a rigid horizontal plane", Phil. Trans. R. Soc. A 244 (882), 312-324; the n^2 = 2 column. Values transcribed by Validation into mm_1952.json with the source table/figure cited; tolerance set from the data's own scatter when transcribed, before any run. No values are frozen until then.
- Ritter: front speed < 2 sqrt(g 2a) at every sample.
- Energy: E(t) <= E0 (1 + 1e-6) for all t; per-stage energy plot attached (ghost fill its own stage).

## T4 Volume
- Particle count exact. Density-estimated volume within 1% of initial over the T3 run.

## T5 Sloshing
- k = pi/L, amplitude/H <= 0.05, >= 16 cells per wavelength. Period fitted over >= 5 periods; |omega - omega_th|/omega_th <= 2%.

## C. 3D consistency
- C1: y-uniform run vs 2D, only 2D tests recorded PASS (Coding lists ids and values before the run): rel. diff <= 1e-5 on each graded quantity.
- C2: rotated dam break, particles rotated: front x/a within 1e-4 and energy rel. diff <= 1e-6, for T <= 2.5 (before wall reflection; later splash is chaotic, reported not graded).
- C3: ghost fill and both push-out rules each have a regression test that fails when the fix is removed.

## H. Regression
- Every change re-runs the full suite; any PASS->FAIL flip blocks the merge.

## Z. Amendments
- 2026-10-13 (NM): P.A/B/C solve at tolerance 1e-12 (mode tests only; production stays 1e-8); the 1e-7 match is unchanged. Reason: error <= cond(~1.7e3 at N=64) x tolerance.
- 2026-10-13 (NM): P.res iteration jump is measured against the median of the previous 20 steps (the first 20 steps are logged, not graded).
- 2026-10-13: T1/T3 energy reads (E(t) - E0)/|E0| <= 1e-6 (same as before, wording only).
- 2026-10-13 (T1 force order): the order is fitted only if the force error e is above the floor 1e-10 x rho g H L W (or 1e-10 x the side-wall reference) at every resolution. If e stays at or below that floor at every resolution, the row passes as an exact discrete equilibrium, and the floor itself becomes a regression assert. The 1% size limit is unchanged. Measured: 4e-13 and 1.2e-12 (floor, wall).
- 2026-10-13 (P.D): unchanged; FAIL stands until the N=256 run. Max order over interior points is reported alongside, not graded in place of the centre point.
- 2026-10-13 (NM, new rows): pressure-stage energy change <= 0 at every step (T3); velocity extension gets its own energy stage; CFL used is logged per frame, and any frame where the 8-substep cap binds with CFL > 1 is flagged.
- 2026-10-13 (T1b, required in Gate 1, frozen before any run): pool with the surface partway through a cell, H fixed in physical units, N = 8, 16, 32, 64. Reference depth H_eff = (particle count x particle volume)/(L W), reported next to nominal H. Graded after 10 s of settling:
  - T1b.u: max|u| < 1e-3 sqrt(g H_eff).
  - T1b.floor (amended 2026-10-13, NM): momentum balance (floor force - dP_z/dt) vs M g, z up (sign corrected 2026-10-13), with dP_z/dt from the same step's 64-bit momentum change: rel. error <= 1e-6 at every graded step and every N. Raw floor force is reported, not graded.
  - T1b.wall: side-wall force vs 1/2 rho g H_eff^2 x width: <= 1% at N = 64, and envelope order (max error over each consecutive pair) >= 0.8 over the four grids, unless every error is under the 1e-10 floor.
  - T1b.p: pressure vs rho g (H_eff - z) in interior cells below the surface cell row: <= 1% at N = 64.
  - T1b.E: E(t) never rises above E0 by more than 1e-6 |E0|; any rise is a FAIL, logged with its stage.
- 2026-10-13 (gate clarifications after Gate 1 handoff): (a) T1b.wall is graded as the integral of the piecewise-linear pressure up to the ghost-fluid surface z_c + theta h; that surface height is reported next to H_eff at every N. The plain cell-sum is info only. (b) Every energy limit uses potential energy measured from the floor, z = 0, so E0 = K0 + M g z_com,0; the datum is written in each report header.
- 2026-10-14 (T3.mm, frozen before any T3 run): reference mm_1952.json (md5 ff0ebad4...), Martin & Moyce Table 2 p.317, n^2 = 2, a = 2.25 in, mean column. Time-shift the simulated T so that T = 1.19 at Z = 1.44, as the paper does. For every tabulated Z from 1.67 to 14.0: |T_sim - T_mean| / T_mean <= 8%. The 8% is the largest deviation of any single record from its printed mean (7.3%) rounded up. Z <= 1.22 is reported, not graded (release dominated). Ritter, energy and volume rows unchanged.
- 2026-10-14 (T3.mm definitions, frozen before re-grade): (a) Time scale exactly as printed in Table 2: T = n t (g/a)^(1/2), with n = sqrt(2) for n^2 = 2, so T = t sqrt(2g/a); a is the initial column base width. (b) Front: in the bottom cell layer, for each y column take the right face x of the furthest cell holding at least 4 particles (half of the 8-per-cell seed); the front is the median over y columns; Z = x_front / a measured from the back wall. Then shift T so T = 1.19 at Z = 1.44 (linear interpolation in the saved output).
- 2026-10-14 (T4 decision rule, frozen before the histogram is seen): let O = sum over cells of max(n_c - 8, 0). If (O/8) h^3 closes the volume deficit to within 1% of V0 at every frame, the capped estimator is wrong and T4 is re-graded as a compression test: fraction of particles in cells with n_c > 12 (1.5x seed density) <= 1% at every frame. Otherwise T4 stays FAIL as real bunching.
- 2026-10-14: the sum of 1/2 M g^2 dt_k^2 row is exact only in free fall; in T3 pressure redirects the flow, so its ratio stays info and is not evidence for or against a leak.
- 2026-10-14 (T4 replaced, Lead + NM; the decision rule above is withdrawn: its first half passes every run, and 12-per-cell at 1% fails healthy Poisson scatter; checked: Poisson(8) gives capped deficit -13.96%, 6.38% of cells > 12, 11.19% of particles in them). T4 is graded as: mean particle count over interior fluid cells (a cell holding >= 1 particle whose 26 neighbours all hold >= 1) within 1% of the starting mean, every frame. Info rows: the particle-per-cell histogram next to Poisson(mean), the capped estimate, and the peak count with its location (front or column). Particle count stays exact.
- 2026-10-14 (Ritter sample, set from front resolution): front speed = [x_front(t) - x_front(t - W)] / W, evaluated at every frame once t >= W. A one-cell jump h may move the speed by at most 5% of U_R = 2 sqrt(g 2a), so W >= 20 h / U_R, rounded up to whole frames: W = ceil(20 h / (U_R * frame_dt)) frames. For a = 16 cells this is 3 frames; for a = 8 cells, 5 frames. Graded: every windowed sample < U_R. Single-step and frame-to-frame peaks are info only.
- 2026-10-14 (C3.still_tank, frozen before it runs): T1 geometry at N = 32, substep cap 16, particles jittered uniformly inside their 2x2x2 sub-cells with a fixed RNG seed (seed logged), zero initial velocity, 2 s simulated. Graded every frame: T4 interior mean within 1% of 8; peak cell count <= 16 (twice the seed count); energy never rises above E0 by more than 1e-6 |E0|; at t = 2 s, max|u| < 1e-3 sqrt(gH). Info: the count in cell [2,12,1] and the 4 floor-wall corner cells over time. Validity: it must FAIL on the current code (f78daa9) before any fix lands; if it passes there, it does not catch the bug and is rejected, not used.
- 2026-10-14 (C3.still_tank renamed C3.separation per Lead): it did not catch bunching on f78daa9 (corners stayed at 8), so its interior-mean and peak-count rows become info. Graded rows unchanged: energy rise <= 1e-6 |E0| and max|u| at 2 s < 1e-3 sqrt(gH). It currently FAILS (+1.65e-5 |E0|, 1.70e-2 vs 2.2e-3); it is the regression test for the separation push, which now gets its own energy-stage row.
- 2026-10-14 (C3.tilted_tank, frozen before it runs; the bunching test): T1 tank at N = 32, cap 16, same jitter and seed as C3.separation, mean depth H, initial surface z = H + 0.05 (x - L/2) (slope 0.05 along x), zero initial velocity, 2 s. Graded every frame: T4 interior mean (strict: no wall-adjacent cells) within 1% of 8; peak cell count <= 16; energy rise <= 1e-6 |E0|. Info: per-layer mean count, the corner counts, max|u|. Validity: it must FAIL on 42cf1bc (pre-fix code) on the interior-mean or peak row; otherwise it is rejected, and T4 in T3 stays the only bunching gate.
- 2026-10-14 (C3.tilted_tank energy, NM): the total-energy row stays graded and stays FAIL while C3.separation fails; that fail is attributed to push-out, not bunching. Added graded row: the energy change summed over every stage except push-out must not rise above E0 by more than 1e-6 |E0|. Nothing removed.
- 2026-10-14 (regression rows for fixes): C3.fix1 = a = 8 pressure-stage dE <= 0 in the face-mass measure on every step (failed on 42cf1bc with 2 positive steps, passes at 6c4214d). C3.fix2 (amended 2026-10-14, Lead/Physics/NM): n = outward normal into the wall, d = |x_wall - x_p|. After G2P, for every particle in a wall-adjacent cell, the at-wall value u_n + C_nn (x_wall - x_p) <= 1e-12 m/s at every step; it must be violated on 6c4214d. Clamp rule: adjust C_nn only (to give exactly 0 at the wall); change u_n only when d < 1e-3 h, and count those cases (info). The clamp stage's energy change is graded <= 0 every step, measured as grid kinetic energy after the next P2G with vs without the clamp (C changes only enter through P2G, so particle 1/2 m u^2 alone would read 0).
No gate loosened.

### Z amendment 2026-10-14b (Physics/NM ruling on fix 2)
- C3.fix2 RETIRED (clamp reverted). The zero normal velocity at solid faces in G2P stays.
- C3.revert: with the C_nn clamp removed, the results must match fix 1 (ff9836b) to roundoff (|delta| <= 1e-12 relative). That means Ritter (3-frame) 0.978 +/- 0.001 at a=16 and 0.911 at a=8, T4 14.27%, and T3.mm unchanged. Run with the OLD seeding. If zero normal velocity in G2P was not already in fix 1, the bit-for-bit match is replaced by: Ritter <= 1.0, T3.mm within tolerance, and T4 within 0.5 points of 14.27%, with the code difference stated. Order: revert, then C3.revert, then C3.seed, then fix 3. This gate must pass before fix 3 is applied.
- C3.seed: at t=0 no particle lies within the wall clearance (1.95e-3 m) of any wall, so the jitter has to respect the clearance. Step 0 is NOT excluded, and push-out dE at step 0 is graded under the normal stage rule.
- C3.fix3 (density correction, position-only):
  * Each particle moves at most 0.1 h per step (graded max).
  * The stage's dKE is 0 to roundoff (<= 1e-12 J), graded.
  * The stage's dPE may be positive. Per-step values are reported.
  * Cumulative stage dPE <= PE_pack(t), where PE_pack = PE(actual layer counts) - PE(uniform 8 per cell, same particles), measured at the same step. Graded every step.
  * Total energy: (E - E0)/|E0| <= 1e-6 at every step (the existing limit, unchanged).
  * T4 (interior mean within 1%) graded at the end of T3. T3.mm stays at its fix 1 worst or better. Ritter windowed <= 1.0 (upper bound only; slowing is guarded by T3.mm).
  * The test must fail on the reverted code (T4 fails there already).

### Z amendment 2026-10-14c (fix 3 method, NM; sign corrected)
- Method frozen as follows. e_c = max(n_c/8 - 1, 0). Solve lap(phi) = -e (or equivalently lap(phi) = e and dx = +grad(phi)) with phi = 0 in air, d(phi)/dn = 0 at solids, PCG tol 1e-4. dx = -grad(phi), trilinear, capped at 0.1 h. Velocities and C are untouched.
  SIGN NOTE: with lap(phi) = +e and dx = -grad(phi), div(dx) = -e, which moves particles INTO packed cells. The source must be -e.
- C3.fix3.sign (unit test, graded, runs before T3): 5x5x5 fluid at 8 per cell, closed on the sides and bottom, with an open top (one air layer above, phi = 0); the centre cell holds 16. After one step every particle's dx has a positive outward radial component from that cell centre, and the count in that cell drops. It must fail if the sign is flipped.
- Solvability: the correction runs only on fluid regions connected to at least one air cell. Regions with no air are skipped and counted (info row; expected 0 in T3).
- Push-out after the correction counts toward the fix 3 stage (its dKE/dPE are included in that stage's rows).
- Info rows per step: PCG iterations, max |dx|/h, and the fraction of moved particles hitting the cap. If the cap binds in more than 50% of steps, the cap is flagged for review (not auto-failed).

### Z amendment 2026-10-14d (fix 3 v2; Physics + NM rulings on Coding's step 10 items 1-4). Supersedes 14c where they conflict.
- Source: e = nbar/8 - 1 (two-sided). nbar = 27-cell count smoothed with the P2G kernel weights; solid cells mirror the adjacent fluid cell. e = 0 only in fluid cells adjacent to air. Wall and floor cells keep their e. Dead-band: e := 0 where |e| < 0.2 (NM, about 3 sigma of the smoothed noise). Info: fraction of cells above the dead-band per step (expected ~0 in C3.separation). Under-relaxation alpha = 0.1 (dx = -alpha grad(phi), lap(phi) = -e). Cap 0.1 h on the correction's own displacement (graded); the trailing push-out is not capped by this row.
- Stage = correction + its trailing push-out for the energy rows. dKE <= 1e-12 J, one-sided. Any positive value above that is reported as a push-out bug, not tolerated.
- PE_pack(t) = [PE_uniform - PE_actual](t) - [PE_uniform - PE_actual](0). Graded: cum stage dPE <= PE_pack(t) + 1e-6|E0| at every step.
- C3.fix3.sign: 16 particles on a uniform 2x2x4 lattice in the centre cell, with the open-top box from 14c. Graded: every particle has an outward radial dx, and nbar in that cell drops after one step. Must fail with the sign flipped.
- NEW graded anti-inflation row (C3.separation with fix 3 on): |sum over steps of stage dPE| <= 1e-6|E0| over 2 s (absolute value of the signed sum, not a sum of absolute values), because a still tank must not be corrected. Info: mean e over corrected cells per step (expected ~0; drift positive means inflation).
- Unchanged: total energy (E-E0)/|E0| <= 1e-6; T4 within 1%; T3.mm no worse than fix 1; Ritter <= 1.0; must fail on f0220c4; cap-bind more than 50% gets flagged.
