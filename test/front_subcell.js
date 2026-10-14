'use strict';
/** Sub-cell Ritter front (ASSERTS Z 2026-10-14f): per y column of the bottom layer, i_f = furthest cell that is
 *  fully counted (n >= 8, fill min(1, n/8) = 1); x = (i_f + 1) h + h * min(1, n_{i_f+1} / 8) (linear fill of the
 *  next cell). Front = median over y. Column with no full cell: x = h * min(1, n_0/8). */
const median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]); };
function frontSub(c, nx, ny, h) { const xs = [];
  for (let j = 0; j < ny; j++) { let im = -1; for (let i = 0; i < nx; i++) if (c[i + nx * j] >= 8) im = i;
    const nn = im + 1 < nx ? c[im + 1 + nx * j] : 0; xs.push((im + 1) * h + h * Math.min(1, nn / 8)); }
  return median(xs); }
module.exports = { frontSub, median };
