# Step 14 phase 1: Ritter window constants (ASSERTS 1b5ed442, Z 2026-10-14g)

Grid-derived only (no results used). g = 9.81 m/s^2, a = 2.25 in = 0.05715 m, frame_dt = 1/60 s = 0.016666666666666666 s, U_R = 2 sqrt(g 2a) = 2.11781302291 m/s.
Rounding rule (Z): ceil to whole frames for both windows, W = ceil(20h/(U_R frame_dt)), W_L = ceil(100h/(U_R frame_dt)).

| a (cells) | h (m) | h/(U_R frame_dt) (frames per cell) | 20h/(U_R dt) | W (short) | q = h/(W dt U_R) | short limit 1+q | 100h/(U_R dt) | W_L (long) | long limit |
|---|---|---|---|---|---|---|---|---|---|
| 16 | 0.00357187500000 | 0.101195194137 | 2.0239039 | 3 | 0.0337317313791 | 1.03373173138 | 10.119519 | 11 | 1.0 |
| 8 | 0.00714375000000 | 0.202390388275 | 4.0478078 | 5 | 0.0404780776550 | 1.04047807765 | 20.239039 | 21 | 1.0 |

No other short windows are defined in section Z. q is one front-cell step (h) over the short window, expressed in U_R.
