# Step 21 graded suite, trigger 0.0611 h (code 286ed1b; runners 6e34be3; ASSERTS f476843a, PHYSICS_SPEC d107f6e5)

| check | old (1e6089c, step 15) | new (286ed1b) | limit | result |
|---|---|---|---|---|
| Gate 1 | 65/65 (+3 bookkeeping = 68) | 68/68, 0 flips | all pass | PASS |
| Gate 1 runs with 0 old fires (T1 x3, T1b N=32/64, T2 x2) | - | bit-identical to 1e6089c every substep | identical | PASS |
| T1b N=8 (1 old fire), N=16 (2401 old fires) | pass | pass on limits (differs from 1e6089c, expected) | limits | PASS |
| C3.separation energy max rise | 2.044e-6 | 6.232e-7 | <= 1e-6 | PASS (flip FAIL->PASS) |
| C3.separation max abs(u) at 2 s | 1.793e-2 | 1.214e-9 | < 2.215e-3 | PASS (flip FAIL->PASS) |
| C3.separation anti-inflation | 9.50e-5 J | 1.91e-4 J | <= 3.066e-4 J | PASS |
| C3.tilted_tank peak / energy / energy excl. push-out | 16 / 0 / 0 | 16 / 0 / 0 | <=16 / <=1e-6 | PASS |
| T3.mm a=16 (all Z) | pass | pass | <= 8% | PASS |
| T3.mm convergence (a=8 rows info) | 0.8005 / 0.6792 | 0.8005 / 0.6792 | < 1 | PASS |
| T4 a=16 | 2.46% | 3.32% | 1% (ceiling 2.60% if shipped as limitation) | FAIL, above ceiling |
| T4 a=8 | 2.59% | 5.08% | 1% (ceiling 2.70%) | FAIL, above ceiling |
| Energy bookkeeping closure (all parts) | - | <= 1.4e-16 | <= 1e-12 | PASS |
| NEW: C3.separation step-1 pair-separation moved fraction | 22.5% | 0.1701% (stage 264 + fix-3 push-out 182 of 262144); stage alone 0.1007% | <= 0.1% | FAIL |
| NEW: wall clamp max displacement, C3.separation (the 14o scope) | - | 2.078e-6 h | <= 1e-6 h | FAIL |
| NEW: wall clamp, every run (the scope the step asked for) | - | 0 in Gate 1 and sign; tilted 1.30e-2 h, T3 a16 4.40e-2 h, a8 1.80e-2 h | <= 1e-6 h | FAIL in dynamic runs |

Pair-separation fires per step, the wall-clamp details and the new-trigger fire counts are in hook_rows.md (info rows).
