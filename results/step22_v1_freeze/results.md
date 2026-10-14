# Step 22 - v1 freeze (sepTrig = 0.25 h)

Code: 151014a (sepTrig reverted to 0.25 h, kept as parameter `o.sepTrig`).
Specs: ASSERTS.md md5 b35378f7580ac31333dd80783b93d7c0, PHYSICS_SPEC.md md5 9a2a3cb3aab4f177b7b2161062893760.

## Gate 1 per-substep bit-identity vs 1e6089c
Full Gate 1 hash runner (sha256 of x/v/C after every substep), compared against
results/step21_trigger_0p0611/revert_b29c99e/gate1/base_1e6089c: **allIdentical = true, 9/9 sims**
(T1 x3, T1b N=8/16/32/64, T2 x2). See gate1/bitident_vs_1e6089c.json.
Trigger fires (unchanged): T1 0/0/0, T1b 1/2401/0/0, T2 0/0.

## Ceilings (ASSERTS Z 2026-10-14p), from step-15 data (code bit-identical to pushed)
| Check | Value | Ceiling | |
|---|---|---|---|
| C3.separation max energy rise | 2.044e-6 |E0| | 2.2e-6 |E0| | meets |
| C3.separation max|u| at t=2 s | 1.793e-2 m/s | 2.0e-2 | meets |
| T4 a=16 | 2.46% | 2.60% | meets |
| T4 a=8 | 2.59% | 2.70% | meets |

(max|u| over the whole separation run is 6.4e-2; the ceiling is graded at t = 2 s only.)

## Plot
plot/step22_Et_trigger_compare.png (copy: docs/img/step22_Et_trigger_compare.png)
