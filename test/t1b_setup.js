'use strict';
/** T1b (ASSERTS sec. Z): pool with surface partway through a cell, H fixed physically.
 *  Box L = W = 0.5 m, h = L/N, H = 0.1625 m (= 10.4 h at N = 32; 2.6h, 5.2h, 10.4h, 20.8h at N = 8..64).
 *  Full cells: 2x2x2 jittered. Partial top cell (fraction q = H/h - floor): n = round(8 q) particles,
 *  lower sub-layer slots first (random order per cell), placed at z = k h + q h (1/4 | 3/4), so all lie below H. */
const { Sim } = require('../src/sim');
const L = 0.5, H = 0.1625;
function makeT1b(N, seed = 7000) {
  const h = L / N, kFull = Math.floor(H / h + 1e-12), q = H / h - kFull, nz = Math.ceil(1.5 * H / h) + 2;
  const s = new Sim({ nx: N, ny: N, nz, h, seed: seed + N });
  s.seedBlock(0, N, 0, N, 0, kFull);
  const nTop = Math.round(8 * q), J = s.jitter * s.s * q;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const slots = [0, 1, 2, 3]; for (let a = 3; a > 0; a--) { const b = Math.floor(s.rand() * (a + 1)); [slots[a], slots[b]] = [slots[b], slots[a]]; }
    for (let n = 0; n < nTop; n++) { const layer = n < 4 ? 0 : 1, sl = slots[n % 4];
      s.addParticle((i + ((sl & 1) + 0.5) / 2) * h + s.jitter * s.s * (2 * s.rand() - 1), (j + (((sl >> 1) & 1) + 0.5) / 2) * h + s.jitter * s.s * (2 * s.rand() - 1),
        (kFull + q * (layer ? 0.75 : 0.25)) * h + J * (2 * s.rand() - 1)); }
  }
  const Heff = s.count * (h ** 3 / 8) / (L * L);
  return { s, h, nz, kFull, q, nTop, Heff, H, L };
}
module.exports = { makeT1b, L, H };
