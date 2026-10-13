# Fluid Lab 3D devlog

Notes trail for a tutorial video: one entry per milestone, covering what we built, why, the key equation in plain words, what broke and how we fixed it, and a plot.

## Entry 0: Background from the 2D sim

_To be written: the 2D FLIP/APIC recap, the thin-ghost-cell energy blowup, and the push-out fixes._

## Exact solutions (Algebra/Equations Expert)

## Exact solutions: how we know the pressure solver is right (Algebra/Equations Expert)

**Why bother?** The pressure solve is the heart of every step. If it is wrong, the fluid still moves, so bugs hide. We test it on problems where we already know the answer.

**The trick: pick the answer first.** Choose a pressure field p you like, compute its Laplacian by hand, feed that in as the right-hand side, and see if the solver hands p back. Products of sines and cosines are ideal, because the Laplacian of each one is just a number times itself:
  lap[ cos(l pi x) cos(m pi y) cos(n pi z) ] = -pi^2 (l^2 + m^2 + n^2) * (same thing)

**Matching the boundaries.** The trig function is chosen to obey the same edge rules as the sim:
- Walls and floor: no flow through them, so the slope of p is zero there -> cosines (flat at the edges).
- Free surface on top: p = 0 -> cos((2n-1) pi z / 2), which is flat at the floor and zero at the top.

**The neat part.** On our grid these modes are *exact* answers of the discrete equations too, with eigenvalue
  lambda_h = -sum over axes of (4/h^2) sin^2(k h / 2).
So the solver must match to its own tolerance, not just "roughly". A boundary bug shows up as a big, obvious miss.

**One-face test.** Pressure zero on five faces, a bump x(1-x)y(1-y) on the floor. The answer is the 3D version of the classic rectangle problem: a double sine series across the floor times a sinh that dies off toward the top. Good for catching mistakes on a single face.

## SPH vs FLIP (Physics Expert)

## SPH vs FLIP: two ways to simulate a liquid with particles (Physics Expert)

**The shared idea.** Both methods carry the fluid on particles, because particles follow the liquid wherever it splashes and never smear the surface. They differ in how they answer one question: what is the pressure, and how does it push the particles?

**SPH (smoothed particle hydrodynamics): particles talk to particles.**
Any quantity at a point is a weighted average over nearby particles:
A(r) = Σ_j (m_j/ρ_j) A_j W(|r − r_j|, h)
- m_j/ρ_j is the volume particle j stands for, so the sum is an integral written as a sum over volumes.
- W is a smoothing kernel. It depends only on the distance |r − r_j| and is zero beyond the radius h. It integrates to 1, which is where the constant 315/(64πh⁹) in the poly6 kernel comes from. In 2D that constant becomes 4/(πh⁸).
- The steps are: compute each particle's density; turn density into pressure with an equation of state, such as p = k(ρ − ρ₀); then push particles apart along pressure differences, using a "spiky" kernel so close pairs still repel.
- **The catch:** a liquid barely compresses. With an equation of state, SPH only keeps it close to incompressible, and making k stiff forces tiny time steps. Without that, the water looks bouncy.

**FLIP/APIC (what Fluid Lab 3D uses): particles talk to a grid.**
1. Particles hand their velocities to a background grid. This step also uses smoothing weights, but they're short-range grid weights, not particle-to-particle sums.
2. On the grid we add gravity and solve one equation for the pressure that makes the flow exactly divergence-free: whatever flows into each cell flows out.
3. Particles read back the corrected velocity and move.
- **Why we chose it:** incompressibility is enforced exactly every step by a linear solve, rather than approximately through a stiff spring. That lets us check the result against exact answers, such as hydrostatic pressure p = ρg(H − z) and sloshing frequency ω² = gk·tanh(kH).
- **The cost:** a pressure solve every step, and care at walls and the free surface. Most of the bugs in our 2D sim, the ghost-cell blowup and the push-out fixes, lived there.

**One-line summary for the video.** SPH asks each particle's neighbours what the pressure is. FLIP asks a grid to make the water exactly incompressible, then tells the particles.
