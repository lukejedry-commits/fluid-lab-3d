# Step 19 Phase B1: colvol theta unit rows (ASSERTS da859722, PHYSICS_SPEC b2d23ec4 7.7)

The full output is in rows.json, and every row of spec 7.7 / Z 2026-10-14m passes.
- Row 2 is graded on the unclamped theta, as the implied height. With the 7.2 [0.05,1] clamp, f=0.5 has theta 0 -> 0.05, an implied height 0.05h off; count-based theta is identical there.
- One extra sub-row I added is NOT a spec row: "(3b) lateral crossing at interior k=15, count-based must fail". It reads 0, because count theta at the surface does not see interior moves, so it cannot fail there. The spec's 3b count-must-fail row is the top-row crossing: 0.125, fails as required.
- Info from that extra case: colvol theta changes by 1/72 = 1.389e-2 when a particle crosses a lateral face anywhere in the column, including deep in the interior, because the column volume changes.
