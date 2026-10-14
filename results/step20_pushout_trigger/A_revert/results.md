# Step 20 (A): thetaMode default reverted to 'count' ('colvol' and 'smooth' stay behind the flag)

Compared: test/run_step20_bitident.js run against this commit's src/sim.js and against 1e6089c's src/sim.js (git worktree).
For each scenario: the sha256 of the full particle state (x, v and C as raw float64 bytes) at t=0 and after EVERY substep, chained, plus the final E and max abs(u).

| scenario | frames / substeps | state hash (both) | result |
|---|---|---|---|
| C3.separation (N=32, jitter 0.5, seed 3232) | 30 / 30 | fde29970b218... | bit-identical |
| T1 N=16 (seed 1016) | 120 / 120 | b0fe221d3f93... | bit-identical |
| T1b N=16 (t1b setup) | 120 / 120 | 6e0c65c246f5... | bit-identical |
| T2 (24x24x64, seed 2024) | 24 / 70 | 029944b7e950... | bit-identical |
| T3 a=8 (seed 1952) | 30 / 147 | a470f55afd36... | bit-identical |

Not run: the full Gate 1 graded suite (Z 14n calls the revert check graded; this is the representative proof that was asked for).
In 'count' mode the only code path differences vs 1e6089c are a wrapper around the same expression and cache resets in markCells.
