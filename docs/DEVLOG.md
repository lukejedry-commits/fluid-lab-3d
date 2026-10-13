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
