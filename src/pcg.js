'use strict';
/**
 * PCG with MIC(0) (Bridson) on a 7-point SPD (or Neumann-singular) system, 64-bit.
 * sys: { m, diag:Float64Array, pX,pY,pZ:Int32Array (unknown index of +x/+y/+z
 *        neighbour, -1 if none), cX,cY,cZ:Float64Array (A entry to that neighbour) }
 * Stopping: ||r||_2 <= tol * ||b||_2 (relative to ||rhs||).
 * opts.removeMean: project out the constant null space (pure Neumann).
 */
const TAU = 0.97, SIGMA = 0.25;
function pcgSolve(sys, b, opts = {}) {
  const { m, diag, pX, pY, pZ, cX, cY, cZ } = sys;
  const tol = opts.tol ?? 1e-8, maxIt = opts.maxIt ?? 5000, rm = !!opts.removeMean;
  const p = new Float64Array(m);
  const res = { p, iters: 0, relRes: 0, trueRelRes: 0, bNorm: 0, converged: true };
  if (m === 0) return res;
  const mX = new Int32Array(m).fill(-1), mY = new Int32Array(m).fill(-1), mZ = new Int32Array(m).fill(-1);
  for (let c = 0; c < m; c++) { if (pX[c] >= 0) mX[pX[c]] = c; if (pY[c] >= 0) mY[pY[c]] = c; if (pZ[c] >= 0) mZ[pZ[c]] = c; }
  const r = Float64Array.from(b);
  const demean = (a) => { if (!rm) return; let s = 0; for (let i = 0; i < m; i++) s += a[i]; s /= m; for (let i = 0; i < m; i++) a[i] -= s; };
  demean(r);
  let bn = 0; for (let i = 0; i < m; i++) bn += r[i] * r[i]; bn = Math.sqrt(bn);
  res.bNorm = bn;
  if (bn === 0) return res;
  // MIC(0) factor
  const prec = new Float64Array(m);
  const cxOf = (n) => (n >= 0 && pX[n] >= 0 ? cX[n] : 0), cyOf = (n) => (n >= 0 && pY[n] >= 0 ? cY[n] : 0), czOf = (n) => (n >= 0 && pZ[n] >= 0 ? cZ[n] : 0);
  for (let c = 0; c < m; c++) {
    const a = diag[c]; let e = a;
    const i = mX[c], j = mY[c], k = mZ[c];
    if (i >= 0) { const t = cX[i] * prec[i]; e -= t * t + TAU * cX[i] * (cyOf(i) + czOf(i)) * prec[i] * prec[i]; }
    if (j >= 0) { const t = cY[j] * prec[j]; e -= t * t + TAU * cY[j] * (cxOf(j) + czOf(j)) * prec[j] * prec[j]; }
    if (k >= 0) { const t = cZ[k] * prec[k]; e -= t * t + TAU * cZ[k] * (cxOf(k) + cyOf(k)) * prec[k] * prec[k]; }
    if (e < SIGMA * a) e = a;
    prec[c] = 1 / Math.sqrt(e);
  }
  const q = new Float64Array(m), z = new Float64Array(m), s = new Float64Array(m), Az = new Float64Array(m);
  const applyPrecon = () => {
    for (let c = 0; c < m; c++) {
      let t = r[c]; const i = mX[c], j = mY[c], k = mZ[c];
      if (i >= 0) t -= cX[i] * prec[i] * q[i];
      if (j >= 0) t -= cY[j] * prec[j] * q[j];
      if (k >= 0) t -= cZ[k] * prec[k] * q[k];
      q[c] = t * prec[c];
    }
    for (let c = m - 1; c >= 0; c--) {
      let t = q[c];
      if (pX[c] >= 0) t -= cX[c] * prec[c] * z[pX[c]];
      if (pY[c] >= 0) t -= cY[c] * prec[c] * z[pY[c]];
      if (pZ[c] >= 0) t -= cZ[c] * prec[c] * z[pZ[c]];
      z[c] = t * prec[c];
    }
    demean(z);
  };
  const matvec = (x, out) => {
    for (let c = 0; c < m; c++) {
      let v = diag[c] * x[c];
      if (pX[c] >= 0) v += cX[c] * x[pX[c]]; if (mX[c] >= 0) v += cX[mX[c]] * x[mX[c]];
      if (pY[c] >= 0) v += cY[c] * x[pY[c]]; if (mY[c] >= 0) v += cY[mY[c]] * x[mY[c]];
      if (pZ[c] >= 0) v += cZ[c] * x[pZ[c]]; if (mZ[c] >= 0) v += cZ[mZ[c]] * x[mZ[c]];
      out[c] = v;
    }
  };
  applyPrecon(); s.set(z);
  let sigma = 0; for (let c = 0; c < m; c++) sigma += z[c] * r[c];
  let it = 0, rel = 1;
  while (it < maxIt) {
    it++;
    matvec(s, Az);
    let sAs = 0; for (let c = 0; c < m; c++) sAs += s[c] * Az[c];
    if (!(sAs > 0)) break;
    const alpha = sigma / sAs; let r2 = 0;
    for (let c = 0; c < m; c++) { p[c] += alpha * s[c]; r[c] -= alpha * Az[c]; }
    demean(r);
    for (let c = 0; c < m; c++) r2 += r[c] * r[c];
    rel = Math.sqrt(r2) / bn;
    if (rel <= tol) break;
    applyPrecon();
    let sn = 0; for (let c = 0; c < m; c++) sn += z[c] * r[c];
    const beta = sn / sigma; sigma = sn;
    for (let c = 0; c < m; c++) s[c] = z[c] + beta * s[c];
  }
  demean(p);
  res.iters = it; res.relRes = rel; res.converged = rel <= tol;
  // true residual ||b - A p|| / ||b||
  matvec(p, Az); const bb = Float64Array.from(b); demean(bb);
  let t2 = 0; for (let c = 0; c < m; c++) { const d = bb[c] - Az[c]; t2 += d * d; }
  res.trueRelRes = Math.sqrt(t2) / bn;
  return res;
}
module.exports = { pcgSolve };
