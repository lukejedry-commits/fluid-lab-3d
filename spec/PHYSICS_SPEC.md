# Fluid Lab 3D, v1: Physics Spec (DRAFT, Physics Expert, 2026-10-13)
Scope: 3D FLIP/APIC particles in an open box, on the CPU. Excludes obstacles, surface rendering and WebGPU.
Thresholds marked PROPOSED are for Validation to set and freeze.

## 1. Model
- Incompressible, inviscid liquid with a free surface. Air is not simulated.
- SI units: g = 9.81 m/s² along −z, ρ = 1000 kg/m³.
- Staggered (MAC) grid with spacing h. Pressure sits at cell centres, and u, v, w sit on the x, y and z faces.
- Particles are seeded 2×2×2 per fluid cell with jitter (8 per cell).
- All mass, energy and volume sums are accumulated in 64-bit (NM item 5).

## 2. Update order per step
1. **Particle to grid (APIC):** the same kernel as 2D, extended to three axes. Accumulate face mass m_f and momentum, then set u_f = p_f/m_f.
2. **Ghost fill:** mass-weighted, as in the 2D fix, and only for faces with m_f below the cutoff.
3. **Gravity:** add −g·dt to w on faces that carry fluid.
4. **Pressure projection:** solve ∇·(1/ρ ∇p) = ∇·u*/dt.
   - Walls use the normal-velocity condition: u·n = 0 on the face and ∂p/∂n = 0 (Neumann).
   - The free surface uses p = 0 with a ghost-fluid position correction.
   - The solver is PCG with MIC(0). Its tolerance is 1e−8 relative to ‖rhs‖, solved in 64-bit, and the iteration count is logged every step.
5. **Grid to particle:** an APIC velocity and affine update.
6. **Advection:** RK2 in the grid velocity field.
7. **Push-out:** strip the into-wall normal velocity, then apply the equal-and-opposite separation clip (the 2D items 1 and 2).

**One face mass rule (NM item 1).** Gravity's face weighting and the pressure solve's face fluid fraction must come from the same m_f. Both are defined once in the spec and referenced in code.

## 3. Step size
dt = CFL·h/(u_max + √(g·h)), with CFL = 1 and a cap of 16 substeps per frame (raised from 8 on 2026-10-14 after the T3 cap-16 run; 2D used 8).

## 4. Physics tests (analytic targets)
**T1. Still pool (first gate).** Fill a box L×W×D to depth H and start from rest.
- Family C pressure tests require the free surface to sit exactly on the top grid face (p_ghost = −p); see `pressure_ref.py`.
- Pressure should follow p(z) = ρg(H − z).
- Floor force should be ρgH·LW. Each side wall should feel ½ρgH² × wall width.
- Gates (PROPOSED):
  - max |u| < 1e−3·√(gH) after 10 s of simulated time;
  - the force error falls as h/H is refined. In 2D the excess was about 1% and scaled with h/d, so 3D must show the same trend or better.

**T2. Free fall.** Release a cube of fluid with no floor contact.
- The measured centre-of-mass acceleration should equal g.
- The open 2D value is 10.12. Per the Lead's ruling, 3D must pass on its own with the single face-mass rule, which is then back-applied to 2D as one regression check.
- Gate (PROPOSED): within 0.1% of g, and horizontal momentum stays at zero to solver tolerance.

**T3. Dam break.** A column a × a(depth) × 2a(height) sits against one wall.
- Compare the front position x/a against T = t√(2g/a) using the Martin & Moyce (1952) data, digitized from the paper by Validation. No numbers are invented here.
- The front must stay below the inviscid Ritter limit of 2√(g·2a).
- Energy: E(t) must never exceed E₀ by more than a frozen tolerance.

**T4. Volume.** The particle count is exact. The fluid volume estimated from particle density must stay within 1% (PROPOSED) over the T3 run.

**T5. Sloshing (small amplitude).** Use the first mode, k = π/L.
- The frequency should follow ω² = gk·tanh(kH).
- Gate (PROPOSED): within 2% at amplitude/H ≤ 0.05, with at least 16 cells per wavelength.

## Order (locked)
T1 and T2 must pass before any other test runs. The rest follow: T3, T4, T5, C1, C2, C3.

## 5. 3D-specific consistency checks
- **C1. 2D reduction.** A run that is uniform in y (free-slip y walls, extruded initial state) must reproduce the 2D results for the 2D tests that PASSED only, never the still-pool or free-fall values. This is the direct "checked against 2D" test.
- **C2. Isotropy.** The T3 dam break, rotated 90° about z (front along +y instead of +x), must give the same front curve and energy within a tolerance tied to the 1e−8 solver tolerance, not to rounding. The particles themselves, jitter included, are rotated, not reseeded. MIC(0) depends on cell order, so the results can't match bit for bit.
- **C3. Regressions.** The ghost fill and both push-out rules each get their own regression test (NM item 6).

## 6. Diagnostics required on every handoff
- Energy versus time for each stage (NM item 3), with the ghost fill listed as its own stage.
- PCG iteration counts.
- The maximum of |∇·u| after projection.
- Total mass and volume.

## 7. Implementation choices accepted at Gate 1 (2026-10-13, Physics and NM review)
1. **Fluid faces.** A face carries fluid if m_f > 0. That one rule decides where gravity applies and which faces enter the pressure solve. Ghost fill touches only faces with m_f = 0. A fluid face below the 5% cutoff keeps its own transferred velocity.
2. **Surface offset.** θ is the distance from the last fluid cell centre to the surface, divided by h.
   - In a surface cell with fill fraction f ≥ ½, the cell counts as fluid and θ = f − ½.
   - In a surface cell with f < ½, the cell counts as air, and the fluid cell below gets θ = f + ½.
   - θ is clamped to [0.05, 1]. With the surface exactly on a face (f = 1), θ = ½ and p_ghost = −p, which matches family C.
3. **Ghost-fill cutoff.** 5% of a full face mass, with its own C3 regression test.
4. **Velocity extension.** Two layers, logged as its **own energy stage** and measured on what the particles pick up in grid to particle.
5. **Family D.** Run at N = 16 to 256. Report the maximum over interior points alongside the graded centre point.
6. **Substeps.** Each 1/60 s frame is split evenly, at most 16 (v1 default, raised from 8 after T3). The CFL number used is logged every frame, and frames where the cap binds with CFL > 1 are flagged.
7. **Precision.** Particles are stored in 64-bit.

**Units.** The code runs at ρ = 1. Every force check is quoted against ρgH·LW in those same units.

**T1b (surface off a grid face).** Same as T1, but with H = 10.4h at every resolution. This case exercises θ and the ghost-fluid correction, which is where the 2D excess of about 1% came from. It is graded on the frozen size limit and order gate. T1 itself, with the surface on a face, is graded as the exact equilibrium under Validation's 1e−10 floor.
