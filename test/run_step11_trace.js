'use strict';
/** Step 11 push-out trace (instrumentation only, code = fix-3 v1). Splits the densfix stage dKE into
 *  correction / wallStrip / separate sub-stages (particle KE, 64-bit), counts sign, and records the
 *  particle-KE identity: wallStrip only sets v_b := 0 when v_b points into the wall.
 *  node test/run_step11_trace.js --a 16|8 --out step11_pushout_trace */
const fs = require('fs'), path = require('path');
const { Sim } = require('../src/sim');
const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const A = +arg('--a'), outDir = path.join(__dirname, '../results', arg('--out')); fs.mkdirSync(outDir, { recursive: true });
const write = (n, d) => { const f = path.join(outDir, n); if (fs.existsSync(f)) throw new Error('refusing to overwrite ' + f); fs.writeFileSync(f, typeof d === 'string' ? d : JSON.stringify(d, null, 1)); };
const lib = require('./lib_t3')({ row: () => {}, info: () => {}, write: () => {} });
const recs = [];
const R = lib.runT3(A, { instrument: (s) => {
  const ke = () => s.particleEnergy().ke; let inDens = false, cur = null;
  const od = s.densityCorrection.bind(s), ow = s.wallStrip.bind(s), os = s.separate.bind(s);
  s.densityCorrection = () => { inDens = true; cur = { k0: ke(), V0: Float64Array.from(s.v.subarray(0, 3 * s.count)) }; const st = od(); inDens = false;
    cur.k3 = ke(); let vChangedNotZeroed = 0, raised = 0; for (let q = 0; q < 3 * s.count; q++) { if (s.v[q] !== cur.V0[q] && s.v[q] !== 0) vChangedNotZeroed++; if (Math.abs(s.v[q]) > Math.abs(cur.V0[q])) raised++; }
    recs.push({ step: s.step + 1, dKE_total: cur.k3 - cur.k0, dKE_correction: cur.k1 - cur.k0, dKE_wallStrip: cur.k2 - cur.k1, dKE_separate: cur.k3 - cur.k2, nWall: st.nWall, nZeroed: cur.nZ, vChangedNotZeroed, componentsRaised: raised }); return st; };
  s.wallStrip = () => { if (!inDens) return ow(); cur.k1 = ke(); const Vb = Float64Array.from(s.v.subarray(0, 3 * s.count)); const r = ow(); cur.k2 = ke(); let z = 0; for (let q = 0; q < Vb.length; q++) if (Vb[q] !== s.v[q]) z++; cur.nZ = z; return r; };
  s.separate = () => os(); } });
const pos = recs.filter((r) => r.dKE_total > 0), neg = recs.filter((r) => r.dKE_total < 0);
const ext = (k) => ({ min: Math.min(...recs.map((r) => r[k])), max: Math.max(...recs.map((r) => r[k])) });
const sum = { A, steps: recs.length, positiveSteps: pos.length, negativeSteps: neg.length, dKE_total: ext('dKE_total'), dKE_correction: ext('dKE_correction'), dKE_wallStrip: ext('dKE_wallStrip'), dKE_separate: ext('dKE_separate'),
  maxAbs: Math.max(...recs.map((r) => Math.abs(r.dKE_total))), anyComponentRaised: recs.some((r) => r.componentsRaised), anyVChangedNotZeroed: recs.some((r) => r.vChangedNotZeroed), stepsWithZeroing: recs.filter((r) => r.nZeroed > 0).length };
console.log(JSON.stringify(sum, null, 1)); write(`a${A}_trace_steps.json`, recs); write(`a${A}_trace_summary.json`, sum);
