# Step 13 A: sub-cell front estimator proof (Z 2026-10-14f (a))

- Code: test/front_subcell.js, test/run_step13_proof.js
- Verdict: **FAIL** -> re-grade NOT performed (Z: proof must pass before the estimator grades anything)

| Check | Measured | Threshold | Result |
|---|---|---|---|
| proof a=16 v=0.5 U_R S1 seeded lattice: max |speed - v|/v over 46 W=3 windows | 2.178e-2 (frame 15); end-to-end over 48 frames 6.975e-4; window displacement 14.82 h, count resolution h/8 -> bound 8.433e-3 | <= 1e-3 | FAIL |
| proof a=16 v=0.5 U_R S2 finest integer fill: max |speed - v|/v over 46 W=3 windows | 4.914e-3 (frame 27); end-to-end over 48 frames 1.704e-4; window displacement 14.82 h, count resolution h/8 -> bound 8.433e-3 | <= 1e-3 | FAIL |
| proof a=16 v=1 U_R S1 seeded lattice: max |speed - v|/v over 22 W=3 windows | 1.195e-2 (frame 6); end-to-end over 24 frames 6.975e-4; window displacement 29.65 h, count resolution h/8 -> bound 4.216e-3 | <= 1e-3 | FAIL |
| proof a=16 v=1 U_R S2 finest integer fill: max |speed - v|/v over 22 W=3 windows | 3.519e-3 (frame 10); end-to-end over 24 frames 1.704e-4; window displacement 29.65 h, count resolution h/8 -> bound 4.216e-3 | <= 1e-3 | FAIL |
| proof a=8 v=0.5 U_R S1 seeded lattice: max |speed - v|/v over 44 W=5 windows | 2.853e-2 (frame 44); end-to-end over 48 frames 6.975e-4; window displacement 12.35 h, count resolution h/8 -> bound 1.012e-2 | <= 1e-3 | FAIL |
| proof a=8 v=0.5 U_R S2 finest integer fill: max |speed - v|/v over 44 W=5 windows | 8.287e-3 (frame 36); end-to-end over 48 frames 3.567e-4; window displacement 12.35 h, count resolution h/8 -> bound 1.012e-2 | <= 1e-3 | FAIL |
| proof a=8 v=1 U_R S1 seeded lattice: max |speed - v|/v over 20 W=5 windows | 1.195e-2 (frame 10); end-to-end over 24 frames 6.975e-4; window displacement 24.70 h, count resolution h/8 -> bound 5.060e-3 | <= 1e-3 | FAIL |
| proof a=8 v=1 U_R S2 finest integer fill: max |speed - v|/v over 20 W=5 windows | 3.227e-3 (frame 6); end-to-end over 24 frames 3.567e-4; window displacement 24.70 h, count resolution h/8 -> bound 5.060e-3 | <= 1e-3 | FAIL |
