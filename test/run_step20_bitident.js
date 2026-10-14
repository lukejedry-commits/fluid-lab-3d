'use strict';
/** Step 20 (A): bit-identity of the reverted default (thetaMode 'count') vs 1e6089c.
 *  node test/run_step20_bitident.js <path to src/sim.js> -> prints JSON: per scenario, sha256 of the full particle state (x, v, C as raw float64 bytes)
 *  after every substep, chained, plus the final energy/maxU. Scenarios: C3.separation (N=32, jitter 0.5, seed 3232, 30 frames), T1 N=16 (seed 1016, 120 frames),
 *  T1b N=16 (t1b setup, 120 frames), T2 (24x24x64 seed 2024, 24 frames), T3 a=8 (seed 1952, 30 frames). */
const crypto = require('crypto'), path = require('path');
const { Sim } = require(path.resolve(process.argv[2]));
const SC = {
  'C3.separation': () => { const s = new Sim({ nx: 32, ny: 32, nz: 40, h: 0.5 / 32, seed: 3232, maxSub: 16, jitter: 0.5, densAlpha: 0.1 }); s.seedBlock(0, 32, 0, 32, 0, 32); return [s, 30]; },
  'T1 N=16': () => { const s = new Sim({ nx: 16, ny: 16, nz: 20, h: 0.5 / 16, seed: 1016 }); s.seedBlock(0, 16, 0, 16, 0, 16); return [s, 120]; },
  'T1b N=16': () => { const L = 0.5, Hb = 0.1625, N = 16, h = L / N, kFull = Math.floor(Hb / h + 1e-12), q = Hb / h - kFull, nz = Math.ceil(1.5 * Hb / h) + 2;
    const s = new Sim({ nx: N, ny: N, nz, h, seed: 7000 + N }); s.seedBlock(0, N, 0, N, 0, kFull); const nTop = Math.round(8 * q), J = s.jitter * s.s * q;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const sl = [0, 1, 2, 3]; for (let a = 3; a > 0; a--) { const b = Math.floor(s.rand() * (a + 1)); [sl[a], sl[b]] = [sl[b], sl[a]]; }
      for (let n = 0; n < nTop; n++) { const ly = n < 4 ? 0 : 1, c = sl[n % 4]; s.addParticle((i + ((c & 1) + 0.5) / 2) * h + s.jitter * s.s * (2 * s.rand() - 1), (j + (((c >> 1) & 1) + 0.5) / 2) * h + s.jitter * s.s * (2 * s.rand() - 1), (kFull + q * (ly ? 0.75 : 0.25)) * h + J * (2 * s.rand() - 1)); } }
    return [s, 120]; },
  'T2': () => { const s = new Sim({ nx: 24, ny: 24, nz: 64, h: 1 / 64, seed: 2024 }); s.seedBlock(8, 16, 8, 16, 48, 56); return [s, 24]; },
  'T3 a=8': () => { const A = 8, a = 2.25 * 0.0254, h = a / A, s = new Sim({ nx: 16 * A, ny: A, nz: Math.round(2.5 * A), h, seed: 1952 }); s.seedBlock(0, A, 0, A, 0, 2 * A); return [s, 30]; },
};
const out = {};
for (const [name, mk] of Object.entries(SC)) { const [s, F] = mk(); const H = crypto.createHash('sha256'); let steps = 0;
  const dump = () => { for (const arr of [s.x, s.v, s.C]) H.update(Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength)); };
  dump(); s.onSubstep = () => { dump(); steps++; }; for (let f = 0; f < F; f++) s.advanceFrame();
  const L = s.log.at(-1); out[name] = { frames: F, substeps: steps, count: s.count, stateHash: H.digest('hex'), E: L.E, maxU: L.maxU }; }
console.log(JSON.stringify(out));
