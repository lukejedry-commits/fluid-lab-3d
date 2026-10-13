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
(none)
