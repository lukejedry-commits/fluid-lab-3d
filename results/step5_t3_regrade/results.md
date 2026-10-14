# Step 5: T3/T4 re-grade (a=16, cap 8, re-run; step-4 output had no per-frame particle positions)

- Code commit the runs executed at: f78daa9 (clean tree)
- spec/ASSERTS.md md5 c0351431c02b82f487a1edf9d72e0961; spec/mm_1952.json md5 ff0ebad4590c77abc266084718656220
- PE zero: floor z=0
- Front (section Z): bottom cell layer, per y column right face x of furthest cell with >= 4 particles, median over y; Z = x/a from back wall; T = t sqrt(2g/a) shifted to 1.19 at Z = 1.44
- T4 (section Z): mean particles over interior cells (>= 1 particle, all in-box 26 neighbours >= 1) within 1% of frame-0 mean every frame

| # | Check | Measured | Threshold | Result |
|---|---|---|---|---|
| 1 | T3 a=16 cap8 Ritter: max front speed (section-Z front) over 226 substep samples (t=0.3187 s) | 5.1435 m/s (2.4287 of limit) | < 2.1178 m/s | FAIL |
| 2 | T3 a=16 cap8 T3.E: max (E-E0)/|E0| (PE datum z=0) | -1.731e-2 | <= 1e-6 | PASS (steps where E rose step-to-step: 0) |
| 3 | T3 a=16 cap8 pressure-stage dE <= 0 every step | 0 of 226 steps > 0 | <= 0 every step | PASS |
| 4 | T3 a=16 cap8 P.res max true residual | 9.990e-9 | <= 1e-8 | PASS |
| 5 | T3 a=16 cap8 P.div max |div u| dt | 8.261e-9 | <= 1e-6 | PASS |
| 6 | T3 a=16 cap8 CFL used per frame | max 1.2997, min 0.8016; frames with cap (8) binding and CFL>1: 22 of 31; substeps 226 | info (not graded) | INFO |
| 7 | T3 a=16 cap8 energy loss vs sum 1/2 M g^2 dt^2 (section Z: info only, not leak evidence) | 1.954e-2 J vs 2.588e-2 J | info (not graded) | INFO |
| 8 | T3 a=16 cap8 T3.mm shift (T = t sqrt(2g/a) + shift; T=1.19 at Z=1.44) | 0.3846 | info (not graded) | INFO |
| 9 | T3 a=16 cap8 T3.mm Z=1.11 (report only) | 0.656 vs 0.41 (60.09%) | info (not graded) | INFO |
| 10 | T3 a=16 cap8 T3.mm Z=1.22 (report only) | 0.850 vs 0.84 (1.18%) | info (not graded) | INFO |
| 11 | T3 a=16 cap8 T3.mm Z=1.67 (T_sim 1.479, T_mean 1.43) | 3.43% | <= 8% | PASS |
| 12 | T3 a=16 cap8 T3.mm Z=1.89 (T_sim 1.684, T_mean 1.63) | 3.29% | <= 8% | PASS |
| 13 | T3 a=16 cap8 T3.mm Z=2.11 (T_sim 1.916, T_mean 1.83) | 4.72% | <= 8% | PASS |
| 14 | T3 a=16 cap8 T3.mm Z=2.33 (T_sim 2.117, T_mean 1.98) | 6.94% | <= 8% | PASS |
| 15 | T3 a=16 cap8 T3.mm Z=2.56 (T_sim 2.280, T_mean 2.2) | 3.63% | <= 8% | PASS |
| 16 | T3 a=16 cap8 T3.mm Z=2.78 (T_sim 2.479, T_mean 2.32) | 6.86% | <= 8% | PASS |
| 17 | T3 a=16 cap8 T3.mm Z=3 (T_sim 2.623, T_mean 2.51) | 4.52% | <= 8% | PASS |
| 18 | T3 a=16 cap8 T3.mm Z=3.22 (T_sim 2.798, T_mean 2.65) | 5.58% | <= 8% | PASS |
| 19 | T3 a=16 cap8 T3.mm Z=3.44 (T_sim 2.972, T_mean 2.83) | 5.03% | <= 8% | PASS |
| 20 | T3 a=16 cap8 T3.mm Z=3.67 (T_sim 3.114, T_mean 2.97) | 4.87% | <= 8% | PASS |
| 21 | T3 a=16 cap8 T3.mm Z=3.89 (T_sim 3.250, T_mean 3.11) | 4.51% | <= 8% | PASS |
| 22 | T3 a=16 cap8 T3.mm Z=4.11 (T_sim 3.386, T_mean 3.33) | 1.69% | <= 8% | PASS |
| 23 | T3 a=16 cap8 T3.mm Z=5 (T_sim 3.975, T_mean 4.02) | 1.13% | <= 8% | PASS |
| 24 | T3 a=16 cap8 T3.mm Z=5.89 (T_sim 4.486, T_mean 4.44) | 1.03% | <= 8% | PASS |
| 25 | T3 a=16 cap8 T3.mm Z=7 (T_sim 5.133, T_mean 5.09) | 0.84% | <= 8% | PASS |
| 26 | T3 a=16 cap8 T3.mm Z=8 (T_sim 5.673, T_mean 5.69) | 0.30% | <= 8% | PASS |
| 27 | T3 a=16 cap8 T3.mm Z=9 (T_sim 6.265, T_mean 6.3) | 0.56% | <= 8% | PASS |
| 28 | T3 a=16 cap8 T3.mm Z=10 (T_sim 6.805, T_mean 6.83) | 0.36% | <= 8% | PASS |
| 29 | T3 a=16 cap8 T3.mm Z=11 (T_sim 7.346, T_mean 7.44) | 1.27% | <= 8% | PASS |
| 30 | T3 a=16 cap8 T3.mm Z=12 (T_sim 7.835, T_mean 8.08) | 3.04% | <= 8% | PASS |
| 31 | T3 a=16 cap8 T3.mm Z=13 (T_sim 8.375, T_mean 8.67) | 3.40% | <= 8% | PASS |
| 32 | T3 a=16 cap8 T3.mm Z=14 (T_sim 8.928, T_mean 9.31) | 4.10% | <= 8% | PASS |
| 33 | a=16 cap8 T4 interior-cell mean particles/cell, max |m-m0|/m0 over 32 frames (m0=8.0000; walls: out-of-box neighbours not required) | 1.479e-1 (frame 31, m=9.1829, 3909 cells) | <= 1e-2 every frame | FAIL |
| 34 | a=16 cap8 T4 same with strict reading (out-of-box neighbours disqualify wall cells) | 7.938e-2 (m0=8.0000) | info (not graded) | INFO |
| 35 | a=16 cap8 T4 particle count exact | 65536 | == 65536 | PASS |
| 36 | a=16 cap8 T4 capped estimator sum min(n,8) h^3/8: min / final rel. to V0 | -1.665e-1 / -1.665e-1 | info (not graded) | INFO |
| 37 | a=16 cap8 T4 fraction of particles in cells n>12: max over frames / final | 1.527e-1 / 1.527e-1 | info (not graded) | INFO (Poisson(8) reference 11.19%) |
| 38 | a=16 cap8 T4 fraction of fluid cells n>8: max over frames / final | 3.765e-1 / 3.431e-1 | info (not graded) | INFO |
| 39 | a=16 cap8 T4 peak particles/cell (max over frames) and location | 41 at frame 30, cell [2,12,1], column; final frame peak 41 (column) | info (not graded) | INFO |
| 40 | a=16 cap8 T4 final-frame histogram n:cells (Poisson(7.117) expected, conditioned n>=1) | 1:717(53) 2:907(189) 3:507(449) 4:436(799) 5:536(1137) 6:819(1349) 7:1054(1372) 8:1073(1220) 9:1002(965) 10:782(687) 11:511(444) 12:310(264) 13:160(144) 14:96(73) 15:47(35) 16:30(15) 17:22(6) 18:19(3) 19:11(1) 20:9(0) 21:19(0) 22:10(0) 23:16(0) 24:8(0) 25:17(0) 26:13(0) 27:14(0) 28:14(0) 29:7(0) 30:6(0) 31:11(0) 32:4(0) 33:7(0) 34:7(0) 35:2(0) 36:1(0) 37:3(0) 41:1(0) | info (not graded) | INFO |

Total graded: 27 PASS, 2 FAIL

## Notes (Coding Expert)
- The step-4 output saved no particle positions, so this is a re-run of the identical a=16, cap-8 configuration (seed 1952) at f78daa9. That commit is 0b2888f plus instrumentation only; there is no physics change. Energy, stage and solver numbers are bit-identical to step 4.
- **Ritter FAIL is an artefact of sampling the new front definition per substep.** The section-Z front moves in whole cells (or half cells via the median). Its largest single-substep jump is 3h within dt = 2.08 ms, which reads as 5.14 m/s. The frame-to-frame secant peaks at 1.113× the Ritter limit and the 3-frame secant at 0.978×. The step-4 max-particle front stayed at 0.970× the limit at every substep. Section Z does not say what the Ritter sample is under the new front. That needs a ruling; nothing was tuned.
- **T4 FAIL looks like real bunching, not an estimator effect.** The interior mean rises from 8.00 to 9.18 (+14.8%). The histogram has a heavy tail far beyond Poisson: cells with 20 to 41 particles, where Poisson predicts none. The peak of 41 sits in the column region near the back-wall floor ([2,12,1]), not at the front. The separation push (1 iteration at 0.5 spacing) does not prevent this clustering.
