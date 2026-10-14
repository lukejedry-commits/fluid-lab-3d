# The physics behind fluid2d.js, in plain English

Every simulation of water has to obey two rules:

1. **Newton's second law, F = ma, for every bit of water.** Here the only forces are gravity, which pulls down, and pressure, which pushes water from crowded places toward less crowded ones. There's no friction (viscosity), so the water is treated as "ideal."
2. **Water can't be squashed.** However hard you push, a litre of water stays a litre. In maths this is written ∇·u = 0, which says that **as much water flows out of any small box as flows in.**

Everything in the file exists to apply those two rules, a tiny time step at a time (dt = 1/120 s).

## Why particles AND a grid?
- Particles are good at **carrying** water around. Each dot remembers where it is and how fast it's moving, so the water never smears out (`x, y, vx, vy`, lines 19 and 32–34).
- A grid is good at **comparing neighbours**. "Flow in versus flow out of a box" is easy to measure on boxes and hard to measure on loose dots.
So each step borrows the grid for a moment, then hands the result back to the particles.

The grid stores speeds on the **edges** of each box, not in the middle (lines 14–16). That way the flow through each wall of a box is a single number, so "out minus in" is an exact subtraction (line 103).

## The five steps (`step`, lines 144–150)
**1. Particles to grid (`particlesToGrid`, lines 56–74).** Each edge takes a weighted average of the speeds of nearby particles. Closer particles count more (`forEachNeighbour`, lines 42–51, whose weights always add up to 1). Any box holding at least one particle is labelled water, the border boxes are labelled walls, and the rest are air (lines 58–65).

**2. Gravity (`applyGravity`, lines 77–79).** This is F = ma for gravity alone. Over a time dt, gravity changes the vertical speed by g·dt, which is 9.8 × 1/120 ≈ 0.08 m/s downward each step.

**3. Pressure (`solvePressure`, lines 87–107).** This is rule 2, and it's where pressure lives, even though the word "pressure" never appears as a variable. Gravity alone would pile water into the floor. For each water box, the code measures the net outflow (`divergence`, line 103) and nudges the speeds on the box's open sides to cancel it (lines 104–106). Those nudges are exactly what a pressure push does: the more a box is being squashed, the harder it pushes its neighbours away.
- **Walls** get zero speed through them, because water can't go through a wall (lines 91–95).
- **Air** is treated as having zero pressure, so water is free to push into it. That is why a sloshing surface can rise and fall.
- Fixing one box upsets its neighbours, so the code sweeps the grid 40 times (line 96). Each sweep gets closer to a perfect answer but never quite reaches it, so a still pool jiggles a tiny bit. That's a numerical effect, not physics.
After this step, gravity and pressure have both been applied: F = ma with both forces.

**4. Grid to particles (`gridToParticles`, lines 114–129).** The particles read back the corrected speeds. "PIC" copies the grid speed outright, which is smooth but slowly loses energy, like water turning to syrup. "FLIP" adds only the *change* the grid made, which keeps the lively swirls but can get noisy. Using 90% FLIP and 10% PIC (line 10) is a common compromise.

**5. Move (`moveParticles`, lines 132–141).** New position = old position + speed × dt. A particle that would leave the box is put back at the wall, and its speed into the wall is set to zero. That's an inelastic stop: the wall absorbs that part of the motion.

## How to tell it's right
- **Free fall:** a single drop should land at t = √(2h/g).
- **Still pool:** water at rest should stay at rest, apart from the small jiggle from step 3.
- **Water is conserved:** the number of particles never changes.
These are exact answers you can check, which is how anyone can **prove** a simulation is right rather than just say it looks right.
