# Step 16: C3.separation diagnosis (INFO ONLY; code 1e6089c fix 3 v6, alpha 0.1; ASSERTS d234870b)

- 120 steps over 2 s; E0 = 3.066e+2 J; max rise 2.044e-6 |E0|; max|u| at 2 s 1.793e-2 m/s
- Steps with any fluid<->air flip: 0 of 119; flips per step mean NaN, max 0; flip k-levels seen:  (top fluid layer k=31)
- Pressure stage, face-mass weighting (logged): steps > 0: 0; theta weighting: steps > 0: 0 (max -1.697e+0 J), theta excl. wall faces > 0: 0
- Steps with gravity+pressure > 5e-4 J ("jumps"): 120; of these with a flip at that step: 0
- mean gravity+pressure on flip steps NaN J vs no-flip steps 1.161e-3 J

## Top 12 steps by gravity+pressure dE

| step | t (s) | gravity | pressure (face-mass) | pressure (theta) | g+p | flips (to fluid/to air; k) | d max|u| | g2p | p2g |
|---|---|---|---|---|---|---|---|---|---|
| 84 | 1.4000 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.194e-3 | 0 (0/0; ) | 3.029e-2 | -1.205e-3 | 1.275e-5 |
| 76 | 1.2667 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.189e-3 | 0 (0/0; ) | -3.243e-3 | -1.198e-3 | 1.264e-5 |
| 95 | 1.5833 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.189e-3 | 0 (0/0; ) | 3.691e-2 | -1.193e-3 | 9.110e-6 |
| 79 | 1.3167 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.186e-3 | 0 (0/0; ) | 3.210e-3 | -1.195e-3 | 1.150e-5 |
| 72 | 1.2000 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.185e-3 | 0 (0/0; ) | 4.775e-3 | -1.193e-3 | 8.854e-6 |
| 53 | 0.8833 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.184e-3 | 0 (0/0; ) | 2.445e-3 | -1.193e-3 | 1.058e-5 |
| 80 | 1.3333 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.182e-3 | 0 (0/0; ) | -4.412e-3 | -1.198e-3 | 1.351e-5 |
| 81 | 1.3500 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.181e-3 | 0 (0/0; ) | 1.331e-3 | -1.198e-3 | 1.405e-5 |
| 82 | 1.3667 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.181e-3 | 0 (0/0; ) | 2.704e-3 | -1.193e-3 | 1.220e-5 |
| 40 | 0.6667 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.180e-3 | 0 (0/0; ) | 1.204e-3 | -1.191e-3 | 1.264e-5 |
| 49 | 0.8167 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.180e-3 | 0 (0/0; ) | 7.084e-3 | -1.191e-3 | 1.248e-5 |
| 92 | 1.5333 | 1.671e+0 | -1.670e+0 | -1.697e+0 | 1.180e-3 | 0 (0/0; ) | 8.217e-3 | -1.185e-3 | 8.868e-6 |

## Top 10 per-step max|u| jumps

| step | d max|u| | g+p | pressure (theta) | flips |
|---|---|---|---|---|
| 95 | 3.691e-2 | 1.189e-3 | -1.697e+0 | 0 |
| 106 | 3.555e-2 | 1.163e-3 | -1.697e+0 | 0 |
| 2 | 3.252e-2 | 1.151e-3 | -1.697e+0 | 0 |
| 24 | 3.143e-2 | 1.158e-3 | -1.697e+0 | 0 |
| 84 | 3.029e-2 | 1.194e-3 | -1.697e+0 | 0 |
| 112 | 3.022e-2 | 1.172e-3 | -1.697e+0 | 0 |
| 21 | 2.417e-2 | 1.162e-3 | -1.697e+0 | 0 |
| 33 | 2.225e-2 | 1.170e-3 | -1.697e+0 | 0 |
| 75 | 1.739e-2 | 1.170e-3 | -1.697e+0 | 0 |
| 77 | 1.427e-2 | 1.172e-3 | -1.697e+0 | 0 |

## Stage sums over the run (J)

p2g 1.375e-3; ghost 0.000e+0; gravity 2.005e+2; pressure -2.004e+2; g2p -1.409e-1; extension 2.431e-4; advect 4.681e-4; pushout 1.590e-7; densfix 9.498e-5

## Verdict (INFO)
- There are no fluid<->air flips: 0 of 119 step transitions change classification (top fluid layer k=31 throughout).
- There are no "+1.2e-3 J pressure jumps". The gravity+pressure net is +1.09e-3 to +1.19e-3 J on EVERY step (all 120). It is a steady residual: about 1.671 J of gravity KE goes in and 1.670 J comes out through pressure, so the grid keeps about 1.2e-3 J of velocity that G2P then removes (g2p -1.19e-3 J per step). The step-15 "jumps" were the top of this flat distribution.
- Pressure-stage dE is negative on every step in BOTH weightings: face-mass -1.670 J and theta -1.697 J; theta without wall faces is also never positive. There is no solve bug and no flip effect.
- max|u| jumps (up to +3.7e-2 m/s) do not correlate with g+p, which is flat at 1.15e-3 to 1.19e-3 J on those steps, and none of them coincides with a flip. max|u| is a single-particle maximum.
- The net energy rise is carried by p2g (+1.38e-3 J over the run), advect (+4.7e-4) and extension (+2.4e-4), against g2p -1.41e-1 J. Push-out is +1.6e-7 J and densfix +9.5e-5 J.
