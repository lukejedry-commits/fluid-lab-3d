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

### Z amendment 2026-10-14e (fix 3 v3; Physics + NM rulings on step 11)
- md5 convention: every posted ASSERTS md5 is the whole-file md5.
- nbar = P2G splat of particle positions (the same kernel and weights as the velocity transfer), not cell counts smoothed afterwards. This applies to the source and to C3.fix3.sign (graded: the splat nbar in the centre cell drops with the production sign; the flipped sign must make it rise and fail).
- Volume-neutral source: after the dead-band, in each air-connected fluid region subtract the region mean of e from every fluid cell not adjacent to air, so sum(e) = 0. Graded: |sum e| per region <= 1e-12 (normalised by the region's cell count) after the subtraction, at every step.
- Info row: front displacement caused by the correction alone within each Ritter window.
- Unchanged and not loosened: alpha = 0.1, Ritter <= 1.0, PE_pack bound, total energy 1e-6, T4 1%. If a=8 T4 still fails, an alpha = 0.2 run is INFO ONLY and does not change the frozen alpha.

### Z amendment 2026-10-14f (fix 3 v4; rulings on step 12)
- PE_pack row RETIRED. Reason: it is an invalid test, since it fails at steps with zero correction applied (step 12, steps 1-2). The correction stays bounded by total energy <= E0 + 1e-6, the one-sided dKE, the still-tank |sum dPE|, and the sum target below.
- Neutrality row REPLACED by a target sum. target_r = sum over interior cells of region r of (nbar/8 - 1), computed BEFORE the dead-band. After the dead-band, e is shifted uniformly over non-air-adjacent cells so that sum e = target_r. Graded: |sum e - target_r| / n_r <= 1e-12 at every step. alpha = 0.1.
- Ritter front: sub-cell position = last fully counted cell + bottom-layer fill fraction of the next cell (linear), median over y. The window is unchanged. Before it grades anything, the estimator must pass:
  (a) synthetic front advancing at a known exact speed v: measured speed within 1e-3 relative for v at 0.5 and 1.0 U_R, at a=8 and a=16;
  (b) it is re-run on saved fix 1, fix 2, v2, v3 and v4 output, with all values reported. The limit stays Ritter <= 1.0, unchanged. If any graded run is still above 1.0, a fix-3-off comparison run is required.
- T4 1% unchanged.

### Z amendment 2026-10-14g (fix 3 v5; rulings on step 13)
- Sub-cell front estimator DROPPED. Its proof failed by construction (integer counts resolve only h/8).
- Target (replaces 14f): ebar = the T4 interior mean of (nbar/8 - 1) over strict-interior cells (all 26 neighbours fluid). target_r = n_r * sign(ebar) * max(|ebar| - 0.005, 0). Target-sum row unchanged (<= 1e-12 per cell).
- Graded proof that still water is untouched: Gate 1 65/65 with 0 flips vs step 12, AND the fix 3 stage's dPE and dx exactly 0 in every Gate 1 still-pool case; C3.separation |sum dPE| <= 1e-6|E0| (unchanged).
- Ritter, two graded rows (both required):
  (a) long window W_L = ceil(100 h/(U_R*frame_dt)) frames, about 10 at a=16 and 20 at a=8; graded peak <= 1.0.
  (b) short window as before (3 frames at a=16, 5 at a=8); graded <= 1 + q, where q = h/(W*frame_dt*U_R) is one cell step computed from the grid (about 0.034 at a=16, 0.068 at a=8). Coding prints the exact q values; they are frozen from the grid, not from results.
  The short window guards against a brief real overshoot, and the long window guards against a sustained one.

### Z amendment 2026-10-14h: exact Ritter windows (Coding 765282d, Physics- and Validation-checked)
U_R = 2.11781302 m/s, frame = 1/60 s. a=16: short W=3, q=0.0337317, limit 1.0337317; long W_L=11, limit 1.0. a=8: short W=5, q=0.0404781, limit 1.0404781; long W_L=21, limit 1.0. These supersede the approximate figures in 14g.

### Z amendment 2026-10-14i (fix 3 v6; rulings on step 14)
- Target ebar = mean over strict-interior cells of (raw particle count/8 - 1), the same quantity T4 grades. The local source stays on the splat nbar. The 0.005 dead-band, target formula and alpha = 0.1 are otherwise unchanged.
- Still-water proof unchanged: Gate 1 65/65, 0 flips, and in every still-pool case (T1, T1b at all N) the stage moves 0 particles with dPE exactly 0. Info: max |ebar| per still-pool case (expected exactly 0).
- T3.mm scope: a=16 rows graded <= 8% (unchanged). a=8 rows become INFO only, conditional on a graded convergence row: at Z=2.78 and Z=3.22, err(a=16) < err(a=8), with the ratio reported. If that row fails, the a=8 rows revert to graded FAIL. The Lead may overrule the a=8 scope change.

### Z amendment 2026-10-14j (Lead calls on fix 3 closure)
- If v6 fails T4: alpha sweep {0.1, 0.2, 0.3}, the full suite at both resolutions, INFO. Selection rule, frozen now: choose the SMALLEST alpha that passes every graded row (including T4, the still pool at all N, both Ritter windows, energy and the target sum) at BOTH a=8 and a=16, as one value. If none passes, no alpha is frozen and the Lead decides on a limitation write-up. Nothing outside the grid, and no per-resolution alpha.
- C3.separation: before any fix, a per-step energy-by-stage trace over 2 s (graded later; this one is info) identifying which stage carries the +2e-6|E0| rise and the max|u| growth.

### Z amendment 2026-10-14k (v1 limitation, pending the Lead's call)
- No alpha qualified under 14j. Code frozen at alpha = 0.1.
- If the Lead ships T4 as a limitation: T4 stays reported as FAIL against 1% (never relabelled PASS) and gains a graded regression ceiling: T4 <= 2.60% at a=16 and <= 2.70% at a=8 (step 15 values 2.46/2.59 plus a 0.1-point margin), so the limitation can't silently grow. The write-up gives the peak frame and both resolutions.
- C3.separation info for the next step: per step, the fluid/air flip count, plus the pressure-stage dE in BOTH the theta weighting and the face-mass weighting (NM). Diagnosis only; no fix until it's ruled.

### Z amendment 2026-10-14l (surface fix, option 3; step 18 rulings)
- Options 1 (changing the seed) and lowering the jitter are REJECTED. C3.separation stays at jitter 0.5 with its limits unchanged.
- Smooth theta: unit rows, graded BEFORE any graded run:
  (a) Lattice: on the T1 and T1b lattices at every N, smooth theta equals count-based theta to 1e-12 (NM).
  (b) Exact fraction: a lattice filling fraction f in {0.25, 0.5, 0.75} of the top cell (flat surface) gives theta = f to 1e-12.
  (c) Continuity: one particle moved across a top-row face changes theta by <= 0.02 (count-based: 0.125). This row must fail on the count-based theta.
- Graded after the fix: C3.separation (energy and max|u|) at jitter 0.5; Gate 1 65/65, 0 flips; the T3 rows and T4 ceiling as frozen.
- Energy-bookkeeping closure, graded in every test: the sum of the per-stage dE equals the total dE per step to 1e-12 relative. Info: g2p dE versus particle KE, per step.
- Info: fraction of particles push-out moves per step in C3.separation. Any change to the push-out trigger must be derived from the seeding statistics and posted BEFORE the run.
- Optional push-out at t=0 before the first P2G is setup only and is not counted as the fix.

### Z amendment 2026-10-14m (smooth theta = column volume; step 19A rulings)
- PHYSICS_SPEC frozen reference: b2d23ec4 (whole file; supersedes 7f5fd3f2).
- Definition (Physics + NM): H = h * sum(n_k/8) over the CONTIGUOUS fluid run below each surface cell (stopping at the first air or solid cell). Smooth H with a fixed 3x3 lateral kernel, using only neighbours whose surface cell is in the same row k; walls are mirrored; otherwise fall back to count theta. theta comes from the smoothed H.
- Row 2 is graded as the implied height: (k + 1/2 + theta) h = (K + f) h to 1e-12.
- Row 3 is split: (3a) a particle crossing a horizontal face changes theta by <= 1e-12; (3b) a particle crossing a lateral face changes theta by <= 0.02. The count-based theta must fail 3b.
- New unit row (4) overhang: a column with fluid, then an air gap, then a detached fluid sheet. The sheet's theta comes from its own run only (exact to 1e-12), and a surface cell whose neighbours are in a different k uses count theta.
- Info (T3): fraction of surface cells on fallback per frame.

### Z amendment 2026-10-14n (step 19B rulings)
- Column-volume theta did not qualify: C3.separation got worse and the a=8 T4 ceiling and tilted rows regressed. Default reverts to thetaMode='count' (colvol stays behind a flag). Graded revert check: all rows bit-identical to 1e6089c.
- PHYSICS_SPEC reference: bd96c77c (whole file; supersedes cd69ca25). Info (Physics): T4 interior density per frame next to the push-out move fraction.
- Order (NM): push-out trigger first, then C3.separation rerun with count theta, then (only if still failing) the fallback-cell map at steps 1-2 (info, Physics).
- Push-out trigger d_trig: the 0.1% quantile of the t=0 nearest-neighbour distances on the frozen seed (jitter 0.5, logged seed). The value and d_trig/h are posted and committed BEFORE any run. Graded consistency: the fraction of particles moved at step 1 of C3.separation is <= 0.1% (a quantile cannot give exactly 0). Also graded: C3.separation energy and max|u| (unchanged limits), Gate 1 0 flips, T3 rows, T4 ceilings, tilted tank, energy bookkeeping 1e-12.
- Info: push-out move fraction per step in T3 and C3.separation.

### Z amendment 2026-10-14o (trigger wording)
- d_trig = 9.5463e-4 m = 0.0611 h (seed 3232, jitter 0.5), posted before any run (de5b902).
- The step-1 <= 0.1% check counts PAIR-SEPARATION moves only.
- Wall clamp: graded max displacement per step <= 1e-6 h in C3.separation (it can't cross a cell line or stir anything; this guards against a real source hiding there). Info: per-step max and count.
- Revert check: the full Gate 1 must be bit-identical to 1e6089c (run as part of the graded suite).
- 14o clarification (NM): the revert commit b29c99e must be bit-identical to 1e6089c on the full Gate 1. For the trigger commit, any run where the OLD 0.25h trigger fired 0 times at every step must be bit-identical (the new trigger is smaller, so it can't fire there). Every other run (including T3, T4, C3.separation and the tilted tank) is graded against its frozen limits. Fire counts per run are logged.
- PHYSICS_SPEC reference: d107f6e5.

### Z amendment 2026-10-14p (v1 freeze; Lead ruling on step 21)
- Push-out trigger stays 0.25 h (pushed code 4e3ba9b / b29c99e). 0.0611 h NOT adopted; the 14n/14o trigger rows (step-1 move fraction, wall-clamp limit) are RETIRED with it. Step 21 is kept as a record.
- Known limitations (always reported as FAIL against their original limits, never relabelled PASS), each with a graded regression ceiling taken from the pushed code plus a ~10% margin:
  * T4: <= 2.60% (a=16), <= 2.70% (a=8). Step 15 values were 2.46/2.59. Write-up: the error shrinks under refinement (2.59 -> 2.46 on this code; 5.08 -> 3.32 at 0.0611 h, about first order).
  * C3.separation: energy rise <= 2.2e-6|E0| (2.04e-6 on this code); max|u| at 2 s <= 2.0e-2 m/s (1.79e-2).
- Required for the v1 handoff (NM): an E(t) plot for both jitter 0.5 tanks on 0.25 h, with the step-21 0.0611 h curve on the same axes.
- Gate 1 unchanged: 68/68, 0 flips.
