# Step 19 Phase A: smooth-theta unit rows (ASSERTS e90a351f Z 2026-10-14l; PHYSICS_SPEC 7f5fd3f2, see note)

Measure under test (src/sim.js thetaRaw, thetaMode 'smooth'): f~ = nbar/8 from the fix-3 P2G splat (quadratic B-spline, mirror-folded at walls).
theta = f~_c + f~_a + f~_(a+d) - 1/2 along the face normal. It is clamped to [0.05, 1] as in 7.2. Classification is unchanged (counts).
Because Phase A fails, the solver default stays thetaMode = 'count': the committed code behaves exactly as 1e6089c. Smooth theta is opt-in.

Spec note: the expected PHYSICS_SPEC md5 was cd1debf9. The synced file was rewritten at 13:30:32 EDT, between my first and second read, and is now 7f5fd3f2.
The difference is one added sentence on (c): "3x3 gives 1/72 ~ 0.014". Committed as 7f5fd3f2.

Run 1 (phaseA_rows.json) used t1b-style z offsets for row (b) by mistake. Graded rows: phaseA_run2/. Info: phaseA_run2_t1bplacement_info/, colinfo.json.

| row | value | limit | result |
|---|---|---|---|
| (a) T1 lattice N=8,16,32,64 | 0 (all faces, theta 0.5) | <= 1e-12 | PASS |
| (a) T1b lattice N=8 / 16 / 32 / 64 | 7.50e-2 / 6.64e-2 / 6.15e-2 / 1.20e-1 | <= 1e-12 | FAIL |
| (b) flat f=0.25, smooth surface z_s vs K+f | 1.56e-2 (theta 0.734..0.766 vs 0.75) | <= 1e-12 | FAIL |
| (b) flat f=0.5 | 1.56e-2 raw (theta raw 0.0156; clamp to 0.05 -> 5.0e-2; count also 0.05) | <= 1e-12 | FAIL |
| (b) flat f=0.75 | 1.65e-2 (theta 0.234..0.263 vs 0.25) | <= 1e-12 | FAIL |
| (c) vertical crossing, smooth | 0 | <= 0.02 | PASS |
| (c) lateral crossing, smooth | 1.2e-10 | <= 0.02 | PASS |
| (c) vertical / lateral crossing, count-based | 0.125 / 0.125 | must fail | FAILS as required |

## Bias analysis (info, no correction added)
- T1b (a): the bias comes from lateral mixing. t1b_setup places the top-cell particles in random sub-cell slots per column. The splat moves 0.28125 vs 0.03125 of a particle into the neighbouring columns depending on its slot. Equal counts with different slot patterns therefore give different smoothed depths.
- Column-integral variant (colinfo.json, info only, not in the solver): theta = whole-column splat sum - (k_c + 1/2).
  - It removes the vertical-truncation part: f=0.5 becomes exact at 0.
  - It leaves the lateral part: T1b 5.4e-2..1.0e-1; f=0.25 and 0.75 +-1/64, from the 2-particle half-layer pattern.
- (a) on T1b and (c) conflict: (c) requires theta to depend continuously on positions within a cell, spread over the neighbouring columns (7.7: "3x3 gives 1/72"). (a) requires equal per-cell counts to give the count value to 1e-12 whatever the slot pattern. With random slot patterns, any lateral spread breaks (a). It holds only for xy-symmetric patterns (T1, and f=0.5).
- (b) f=0.5 and the clamp: under the 7.2 convention a half-filled cell is fluid with theta = f - 1/2 = 0, clamped to 0.05 (count-based too). theta = f literally holds for no f under 7.2, because theta is measured from the last fluid cell centre. I graded the implied surface height z_s = (k_c + 1/2 + theta) h = (K + f) h.
