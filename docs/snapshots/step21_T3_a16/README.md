# T3 dam break a=16, snapshots (code b29c99e: count theta, push-out trigger 0.25 h; bit-identical to 1e6089c)

- Setup: as lib_t3 runT3. Column a = 2.25 in (0.05715 m), h = a/16, grid 256x16x40, seed 1952, 65536 particles, Sim defaults.
- Made with: `node dump_t3a16.js <b29c99e worktree>/src/sim.js /tmp/t3dump 45`, then `python3 render.py /tmp/t3dump . b29c99e 0,6,18,30,36,42 --gif`.
- Dots are coloured by |u| on a fixed scale 0..2 sqrt(2 g a) (the Ritter front speed). The oblique 3D view stretches y and z (box aspect) for readability.

| file | t (s) | stage |
|---|---|---|
| T3_a16_frame000.png | 0.000 | column at rest |
| T3_a16_frame006.png | 0.100 | collapse |
| T3_a16_frame018.png | 0.300 | front running along the floor (x ~ 0.48 m) |
| T3_a16_frame030.png | 0.500 | front reaching the far wall (x ~ 0.88 m) |
| T3_a16_frame036.png | 0.600 | wave hitting the far wall (run-up ~ 0.11 m) |
| T3_a16_frame042.png | 0.700 | run-up at the far wall |
| T3_a16_0to45frames.mp4 | 0..0.75 | all 46 frames at 12 fps |
