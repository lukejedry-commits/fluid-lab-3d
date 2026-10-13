# Gate 1 follow-up: devlog notes (Coding Expert, 2026-10-13)

Changes made per review (PHYSICS_SPEC sec. 7, ASSERTS Z md5 560121fe):
- **Surface rule.** A surface cell with fill below ½ is now treated as air, and the fluid cell below it gets θ = f + ½. Every other cell with particles is fluid with θ = f − ½, clamped to [0.05, 1].
- **Ghost fill.** It now touches only faces with m_f = 0. A face that carries fluid keeps its own transferred velocity even when its mass is below the 5% cutoff.
- **Velocity extension.** It is now its own energy stage, measured on what the particles pick up in grid-to-particle: the particle kinetic energy with the extended grid minus the kinetic energy with every face not touching fluid set to zero.
- **CFL logging.** The CFL number used is logged every frame, and frames where the 8-substep cap binds with CFL > 1 are flagged. There were none.
- **Pressure-stage sign.** Any step where the pressure stage adds energy is now logged.

What broke: moving the ghost fill to m_f = 0 and zeroing the non-extended faces exposed a 3D-only gap. A corner particle's 1.5-cell quadratic stencil reaches faces three axis-steps away from the nearest face that touches fluid. A two-layer, 6-connected extension therefore left zeros inside the stencil, and T2 free fall picked up a 1e-6 error in the centre-of-mass velocity plus spurious horizontal momentum.

The fix: the extension keeps two layers but makes them 26-connected (it includes diagonal neighbours). T2 went back to a = g to 1e-14.

T1b results: H = 0.1625 m, which is 2.6h, 5.2h, 10.4h and 20.8h on the four grids, with 5, 2, 3 and 6 of 8 particles in the top cell. This covers both branches of the surface rule. T1b, like T1, settles into an exact discrete equilibrium:
- The momentum balance F_floor − dP_z/dt holds to within 1.4e-11 of Mg at every step.
- The side-wall force, integrated through the ghost-fluid surface position, matches to 1.6e-11 or better.
- Pressure is within 6.5e-10 of hydrostatic.
- max|u| is about 1.7e-9.

A naive midpoint sum of wall-cell pressures, which ignores θ, would instead show errors of 2.0e-2, 2.3e-3, 1.3e-3 and 1.5e-4. That roughly reproduces the size of the 2D excess.

Family D at N = 256 brings the centre point into the asymptotic range: the orders for N = 32 → 256 are 1.934, 1.984 and 1.996. All 65 graded rows pass, and no row that passed in step 1 now fails.
