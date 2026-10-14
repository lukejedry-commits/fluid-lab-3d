'use strict';
/** Dump T3 a=16 particle states for rendering. Setup as lib_t3 runT3: a = 2.25 in, h = a/16, grid 256x16x40, seed 1952, Sim defaults
 *  (count theta, jitter 0.1, cap 16). node dump_t3a16.js <path to src/sim.js> <out dir> <frames>. Writes frame_XXX.f32 (x,y,z,|v| per particle) + meta.json */
const fs = require('fs'), path = require('path');
const { Sim } = require(path.resolve(process.argv[2])); const out = process.argv[3], F = +process.argv[4]; fs.mkdirSync(out, { recursive: true });
const A = 16, a = 2.25 * 0.0254, h = a / A, s = new Sim({ nx: 16 * A, ny: A, nz: Math.round(2.5 * A), h, seed: 1952 }); s.seedBlock(0, A, 0, A, 0, 2 * A);
const dump = (f) => { const b = new Float32Array(4 * s.count); for (let p = 0; p < s.count; p++) { b[4 * p] = s.x[3 * p]; b[4 * p + 1] = s.x[3 * p + 1]; b[4 * p + 2] = s.x[3 * p + 2]; b[4 * p + 3] = Math.hypot(s.v[3 * p], s.v[3 * p + 1], s.v[3 * p + 2]); }
  fs.writeFileSync(path.join(out, `frame_${String(f).padStart(3, '0')}.f32`), Buffer.from(b.buffer)); };
const meta = { a, h, L: s.L, count: s.count, frames: [] }; dump(0); meta.frames.push({ f: 0, t: 0 });
for (let f = 1; f <= F; f++) { s.advanceFrame(); dump(f); meta.frames.push({ f, t: s.t }); }
fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta));
