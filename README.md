# Fluid Lab 3D

3D FLIP/APIC particle fluid simulation (JavaScript, browser), the follow-on to [2d-fluid-simulation](https://github.com/lukejedry-commits/2d-fluid-simulation).

**Status: Gate 1 open: 3 FAIL pending rulings.** CPU core built (`d28583a`); first-gate run 38 PASS / 3 FAIL (T1 force-order x2 now re-graded under section Z floor; family D centre point pending N=256). T1b added to Gate 1. T3 and later are blocked until the Lead closes Gate 1.

- `spec/PHYSICS_SPEC.md`: physics spec (DRAFT; NM's 4 blocking changes pending)
- `spec/pressure_ref.py`, `spec/pressure_ref.json`: exact pressure-solve reference tests (families A–D)
- `docs/DEVLOG.md`: the notes trail for a future tutorial video, one entry per milestone

v1 scope: open box, CPU, particles only. Obstacles, surface rendering and WebGPU come later.
