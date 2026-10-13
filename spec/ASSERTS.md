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
  - T1b.floor: floor force vs total weight M g (exact in steady state for any surface treatment): rel. error <= 1e-6 at every N.
  - T1b.wall: side-wall force vs 1/2 rho g H_eff^2 x width: <= 1% at N = 64, and envelope order (max error over each consecutive pair) >= 0.8 over the four grids, unless every error is under the 1e-10 floor.
  - T1b.p: pressure vs rho g (H_eff - z) in interior cells below the surface cell row: <= 1% at N = 64.
  - T1b.E: E(t) never rises above E0 by more than 1e-6 |E0|; any rise is a FAIL, logged with its stage.
No gate loosened.
