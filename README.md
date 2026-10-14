# Fluid Lab 3D

3D FLIP/APIC particle fluid simulation (JavaScript, browser), the follow-on to [2d-fluid-simulation](https://github.com/lukejedry-commits/2d-fluid-simulation).

**Status: Gate 1 CLOSED (65/65 PASS, ASSERTS md5 3b4821c8, `results/step3_gate1_amend`).** CPU core built; the Simulation Expert Lead closed Gate 1 after the amend run (0 flips, T2 half-dt energy ratio 0.5000, T1b surface height == H_eff). Next: T3 dam break and C3 regression.

**Status: T3 open: volume fail pending ruling.** Step 4 (`results/step4_t3`): T3 Ritter, energy, pressure-stage and Martin & Moyce rows PASS; T4 density-estimated volume FAIL (16.65%) pending a Validation ruling on the estimator.

- `spec/PHYSICS_SPEC.md`: physics spec (DRAFT; NM's 4 blocking changes pending)
- `spec/pressure_ref.py`, `spec/pressure_ref.json`: exact pressure-solve reference tests (families A–D)
- `docs/DEVLOG.md`: the notes trail for a future tutorial video, one entry per milestone

v1 scope: open box, CPU, particles only. Obstacles, surface rendering and WebGPU come later.
