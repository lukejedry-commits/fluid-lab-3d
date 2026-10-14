# Step 19 Phase B2 verdict (code c54340d, thetaMode 'colvol' default; ASSERTS da859722, PHYSICS_SPEC b2d23ec4)

- Gate 1: 68 PASS / 0 FAIL. That is the 65 baseline rows plus 3 new bookkeeping rows. 0 flips vs 1e6089c (step15_fix3v6/gate1).
- T1 is exact: max abs(u) 1e-9, (E-E0)/abs(E0) <= 5e-14. Fallback is 0 in T1.
- Energy bookkeeping closure is graded in every part and passes everywhere: worst 1.4e-16 relative.
- The C3/T3 suite has 4 PASS -> FAIL flips vs step 15 (1e6089c), so colvol makes them worse:
  - C3.tilted_tank peak count: 16 -> 17.
  - C3.tilted_tank energy rise: 0 -> 3.29e-5.
  - C3.tilted_tank energy excl. push-out: 0 -> 3.29e-5.
  - C3.separation anti-inflation (fix-3 dPE sum): 9.5e-5 J -> 1.14e-2 J.
- C3.separation still FAILS and is worse: energy 2.04e-6 -> 7.14e-5; max abs(u) at 2 s 1.79e-2 -> 1.20e-1.
- T4: a16 2.46% -> 2.07%; a8 2.59% -> 3.12%. The a8 value is above the 14k limitation ceiling of 2.70%.
- T3.mm: convergence PASS (ratios 0.8005 / 0.6792); a16 rows all pass.
- Info, fallback fraction (count theta) per frame, mean / max: separation 21.6% / 34.8%; tilted 47.6% / 72.6%; T3 a16 49.2% / 80.1%; a8 49.1% / 80.9%.
  - With the all-8-neighbours same-row rule, a large share of surface cells mix count and colvol theta. Neighbouring cells can switch between the two definitions from step to step. This is a likely contributor, but no diagnosis or tuning was done.
- Info, push-out moved fraction per step, mean / max: separation 5.1% / 24.3%; tilted 3.8% / 23.9%; a16 24.6% / 29.7%; a8 27.7% / 34.2%.
