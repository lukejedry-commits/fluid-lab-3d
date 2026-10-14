# Step 21 (1): full Gate 1, b29c99e-equivalent code vs 1e6089c, bit-identity

- Run: run_gate1_step21.js (all parts: modes, D, T1, T1b, T2) under test/step21_preload.js.
  - Code: commit a03c677. Its src/ is identical to b29c99e (git diff b29c99e a03c677 -- src is empty).
  - Baseline: the same runner and preload in a git worktree at 1e6089c.
- Compared: sha256 of the full particle state (x, v, C, raw float64) after EVERY substep, plus the chained hash, for every Sim in every part.
- Result: ALL IDENTICAL (9 sims, every substep). gate1/bitident_vs_1e6089c.json has the per-run hashes. Gate 1: 68 PASS, 0 FAIL (65 rows + 3 bookkeeping rows).
- The stdout of modes, D and T2 is byte-identical to the baseline. Pressure-family parts (modes, D) have no particle sims.

Old trigger (0.25 h) pair-separation fires, counting every separate() call (push-out stage and the push-out inside fix 3):

| run | particles | substeps | fires total | steps with fires | max per step |
|---|---|---|---|---|---|
| T1 N=8 | 4096 | 600 | 0 | 0 | 0 |
| T1 N=16 | 32768 | 600 | 0 | 0 | 0 |
| T1 N=32 | 262144 | 600 | 0 | 0 | 0 |
| T1b N=8 | 1344 | 600 | 1 | 1 | 1 |
| T1b N=16 | 10752 | 600 | 2401 | 600 | 5 |
| T1b N=32 | 84992 | 600 | 0 | 0 | 0 |
| T1b N=64 | 679936 | 600 | 0 | 0 | 0 |
| T2 (dt) | 4096 | 49 | 0 | 0 | 0 |
| T2 (dt/2) | 4096 | 98 | 0 | 0 | 0 |

Runs with 0 old-trigger fires, which must be bit-identical after the trigger change: T1 N=8/16/32, T1b N=32/64, both T2 runs.
