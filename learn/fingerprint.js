// Default-run fingerprint: sha256 of particle positions (Float64, x0,y0,x1,y1,...) after 2 s (480 frames of 1/240 s).
const crypto = require('crypto'), { createWorld, frame } = require('./fluid2d.js');
const w = createWorld(); for (let f = 0; f < 480; f++) frame(w);
const buf = new Float64Array(2 * w.x.length); for (let p = 0; p < w.x.length; p++) { buf[2 * p] = w.x[p]; buf[2 * p + 1] = w.y[p]; }
console.log(`particles ${w.x.length}  sha256 ${crypto.createHash('sha256').update(Buffer.from(buf.buffer)).digest('hex')}`);
