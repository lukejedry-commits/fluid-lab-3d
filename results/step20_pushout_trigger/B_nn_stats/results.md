# Step 20 (B): t=0 nearest-neighbour distances (INFO ONLY; no run, trigger unchanged)

Current push-out trigger: separate() pushes pairs with d < sepFrac * s = 0.5 * (h/2) = **0.25 h**. The wall clamp (wallStrip) is separate: clearance pr = 0.125 h.
Quantiles use nearest rank: q-quantile = sorted[ceil(q n) - 1]. "particles with NN < q-quantile" counts strictly below.

| seed | particles | h (m) | trigger (m, /h) | NN < trigger (count, fraction) | min NN (/h) | 0.01% | **0.1%** | 1% | 5% | median |
|---|---|---|---|---|---|---|---|---|---|---|
| C3.separation (FROZEN seed: 3232, jitter 0.5) | 262144 | 1.5625e-2 | 3.9063e-3 (0.25 h) | 58665 (22.379%) | 0.0180 | 5.5088e-4 m (0.0353 h) | **9.5463e-4 m (0.0611 h)** | 1.7067e-3 m (0.1092 h) | 2.6164e-3 m (0.1675 h) | 5.0294e-3 m (0.3219 h) |
| C3.tilted_tank (seed 3232, jitter 0.5) | 262144 | 1.5625e-2 | 3.9063e-3 (0.25 h) | 58565 (22.341%) | 0.0180 | 5.2709e-4 m (0.0337 h) | **9.5463e-4 m (0.0611 h)** | 1.7067e-3 m (0.1092 h) | 2.6178e-3 m (0.1675 h) | 5.0304e-3 m (0.3219 h) |
| T3/T4 a=16 (seed 1952, jitter 0.1) | 65536 | 3.5719e-3 | 8.9297e-4 (0.25 h) | 0 (0.000%) | 0.4011 | 1.4348e-3 m (0.4017 h) | **1.4433e-3 m (0.4041 h)** | 1.4602e-3 m (0.4088 h) | 1.4886e-3 m (0.4168 h) | 1.6048e-3 m (0.4493 h) |
| T3/T4 a=8 (seed 1952, jitter 0.1) | 8192 | 7.1437e-3 | 1.7859e-3 (0.25 h) | 0 (0.000%) | 0.4026 | 2.8763e-3 m (0.4026 h) | **2.8966e-3 m (0.4055 h)** | 2.9228e-3 m (0.4091 h) | 2.9819e-3 m (0.4174 h) | 3.2195e-3 m (0.4507 h) |

The d_trig candidate per Z 2026-10-14n is the frozen C3.separation 0.1% quantile. Particles strictly below it: 262 of 262144.
Notes (info):
- Consistency check: in step 18's trace, step-1 separate() moved 59108 particles (22.5%). That matches the 58665 particles here with NN < 0.25 h.
- Risk for the graded "step-1 moved fraction <= 0.1%" row: in the step-18 trace, step-1 wallStrip also moved 2223 particles (0.85%), each by at most 1.9e-10 h.
  - These were advected into the wall clearance zone; the seeding distances do not cause them.
  - If the graded count includes wall-clamp moves, it can fail at any separation trigger. The room should state whether the row counts separate() only or every push-out move.
- T3/T4 use the same seeder at jitter 0.1. Their NN distances never go below 0.40 h, so the current 0.25 h trigger fires on 0 particles at t=0, and a 0.0611 h trigger also fires on none there.
