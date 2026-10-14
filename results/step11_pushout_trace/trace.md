# Step 11: push-out trace of the fix-3 v1 densfix stage dKE

- Code: src at 427df13 (fix 3 v1, = a25817a tree); runner test/run_step11_trace.js (instrumentation only, wraps densityCorrection / wallStrip / separate).
- Quantity: particle KE, 64-bit, sum 1/2 m_p |v_p|^2 (the same measure as rec.densKE).

| a | steps | steps dKE > 0 | steps dKE < 0 | min dKE (J) | max dKE (J) | correction dKE | wallStrip dKE | separate dKE |
|---|---|---|---|---|---|---|---|---|
| 16 | 269 | 0 | 233 | -4.211e-8 | 0 | exactly 0 | -4.211e-8 .. 0 | exactly 0 |
| 8 | 152 | 0 | 79 | -1.664e-7 | 0 | exactly 0 | -1.664e-7 .. 0 | exactly 0 |

No velocity component got larger in magnitude in any step, and every changed velocity component was set to 0 (wallStrip zeroing an into-wall component).

Root cause: the dKE is never positive. The step-10 row graded `max |dKE|` (two-sided absolute value), and the result was read as "+4.2e-8 J / +1.7e-7 J". Those numbers are the most NEGATIVE stage dKE: KE taken out by the trailing wallStrip, which zeroes the into-wall velocity of particles that the correction moved into the clearance band. The correction and the separation pass leave v unchanged (dKE exactly 0). Push-out works as specified, so there is no push-out fix commit. Under the one-sided rule in Z 2026-10-14d (dKE <= 1e-12 J), these steps pass.
