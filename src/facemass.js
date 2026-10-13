'use strict';
/**
 * THE single face-mass rule (PHYSICS_SPEC sec. 2, NM item 1).
 * Every consumer of face mass m_f (gravity, pressure coefficients, ghost fill)
 * calls these functions; nothing else in the code tests m_f directly.
 *
 *  carriesFluid(m_f)  : m_f > 0. Gravity is applied to exactly these faces, and a
 *                       pressure-solve face between a fluid cell and a non-wall
 *                       neighbour has coefficient faceFraction(m_f).
 *  faceFraction(m_f)  : 1 if carriesFluid, else 0 (face closed, u = 0).
 *                       Unit density on every fluid-carrying face (see devlog: the 2D
 *                       rho0/max(rho_f,0.1 rho0) scale makes hydrostatics depend on
 *                       particle jitter, so it was not carried over).
 *  isGhost(m_f)       : m_f == 0 -> mass-weighted ghost fill from fluid-carrying
 *                       neighbours (PHYSICS_SPEC sec. 7 item 1: a fluid face below the 5%
 *                       cutoff keeps its own transferred velocity). GHOST_CUTOFF is kept as
 *                       the documented sec. 7 item 3 constant but no longer gates the fill.
 */
const GHOST_CUTOFF = 0.05; // fraction of a full face mass (rho h^3)
function carriesFluid(mf) { return mf > 0; }
function faceFraction(mf) { return mf > 0 ? 1 : 0; }
function isGhost(mf) { return mf === 0; }
module.exports = { GHOST_CUTOFF, carriesFluid, faceFraction, isGhost };
