'use strict';
/* The world: an archipelago in a fogged ocean. Every island ("isle") is an analytic height
   field sampled onto its own grid; the renderer builds each mesh from the same grid, so feet
   land exactly on the triangles. Isle 0 is the home island and is the world object W itself
   (centred on 0,0), so older code that reads W.mountain, W.pond or W.grid still means home.
   Other isles keep local coordinates around (cx, cz). */

const GRID_N = 44;          // home grid: cells per side
const GRID_HALF = 22;       // home grid spans [-22, 22]
const GRID_CELL = (GRID_HALF * 2) / GRID_N;
const SEA_Y = 0.05;         // sea level
const WORLD_HALF = 140;     // the fog map covers [-140, 140]
const FOG_CELL = 4;
const FOG_N = (WORLD_HALF * 2) / FOG_CELL;

function makeNoise(seed) {
  const r = mulberry32(seed);
  const P = new Uint8Array(512);
  const perm = [];
  for (let i = 0; i < 256; i++) perm.push(i);
  for (let i = 255; i > 0; i--) { const j = (r() * (i + 1)) | 0; const t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
  for (let i = 0; i < 512; i++) P[i] = perm[i & 255];
  const val = (ix, iz) => P[(P[ix & 255] + iz) & 255] / 255;
  return function (x, z) {
    const ix = Math.floor(x), iz = Math.floor(z);
    let fx = x - ix, fz = z - iz;
    fx = fx * fx * (3 - 2 * fx); fz = fz * fz * (3 - 2 * fz);
    return lerp(lerp(val(ix, iz), val(ix + 1, iz), fx), lerp(val(ix, iz + 1), val(ix + 1, iz + 1), fx), fz);
  };
}

function makeWorld(seed) {
  const rnd = mulberry32(seed * 7919 + 13);
  const W = { seed, id: 0, cx: 0, cz: 0, gh: GRID_HALF, gn: GRID_N, gc: GRID_CELL, R: 18, p1: rnd() * TAU, p2: rnd() * TAU, noise: makeNoise(seed + 101), nodes: [] };
  W.isles = [W];
  const ma = rnd() * TAU;
  W.mountain = { x: Math.sin(ma) * 10.6, z: Math.cos(ma) * 10.6, r: 4.3, sig: 2.6, h: 8.5 };
  const pa = ma + 2.0 + rnd() * 1.4;
  W.pond = { x: Math.sin(pa) * 9.2, z: Math.cos(pa) * 9.2, r: 2.7, sig: 1.9 };

  sampleGrid(W);
  W.waterY = heightRaw(W, W.pond.x, W.pond.z) + 0.95;

  // resource nodes
  const place = (type, tries, count, ok) => {
    let made = 0;
    for (let t = 0; t < tries && made < count; t++) {
      const a = rnd() * TAU, r = Math.sqrt(rnd()) * W.R;
      const x = Math.sin(a) * r, z = Math.cos(a) * r;
      if (!walkable(W, x, z, 0.6)) continue;
      if (!ok(x, z)) continue;
      let clash = false;
      for (const n of W.nodes) if (hyp(n.x - x, n.z - z) < 1.5) { clash = true; break; }
      if (clash) continue;
      addNode(W, type, x, z, rnd);
      made++;
    }
  };
  const fromMt = (x, z) => hyp(x - W.mountain.x, z - W.mountain.z);
  place('rock', 400, 9, (x, z) => { const d = fromMt(x, z); return d > 4.7 && d < 7.4 && hyp(x, z) > 5.5; });
  place('rock', 200, 3, (x, z) => hyp(x, z) > 7 && fromMt(x, z) > 8);
  place('tree', 900, 34, (x, z) => hyp(x, z) > 6.2 && W.noise(x * 0.16 + 40, z * 0.16 + 9) > 0.42);
  place('bush', 500, 13, (x, z) => hyp(x, z) > 4.6 && hyp(x, z) < 15);
  for (const n of W.nodes) n.isle = 0;
  makeIsles(W, seed);
  return W;
}

function sampleGrid(I) {
  const n1 = I.gn + 1;
  I.grid = new Float32Array(n1 * n1);
  for (let j = 0; j < n1; j++) for (let i = 0; i < n1; i++) I.grid[j * n1 + i] = heightRaw(I, -I.gh + i * I.gc, -I.gh + j * I.gc);
}

/* the rest of the archipelago, out in the fog */
function makeIsles(W, seed) {
  const rnd = mulberry32(seed * 104729 + 71);
  const count = 6 + ((rnd() * 2) | 0);
  const a0 = rnd() * TAU;
  for (let k = 0; k < count; k++) {
    let I = null;
    for (let tries = 0; tries < 40 && !I; tries++) {
      const a = a0 + k / count * TAU + (rnd() - 0.5) * 0.6, d = (k % 2 ? 78 : 52) + rnd() * 26, R = 9 + rnd() * 6;
      const cx = Math.sin(a) * d, cz = Math.cos(a) * d;
      if (Math.abs(cx) > WORLD_HALF - R - 6 || Math.abs(cz) > WORLD_HALF - R - 6) continue;
      let clash = false;
      for (const o of W.isles) if (hyp(o.cx - cx, o.cz - cz) < o.R + R + 16) clash = true;
      if (clash) continue;
      const gh = Math.ceil(R + 4);
      I = { id: W.isles.length, cx, cz, R, gh, gn: gh * 2, gc: 1, p1: rnd() * TAU, p2: rnd() * TAU, noise: makeNoise(seed + 200 + k * 17), mountain: null, pond: null };
      if (rnd() < 0.55) { const ma = rnd() * TAU, md = R * 0.45; I.mountain = { x: Math.sin(ma) * md, z: Math.cos(ma) * md, r: 2.6 + R * 0.08, sig: 1.6 + R * 0.06, h: 4 + rnd() * 5 }; }
      if (rnd() < 0.4) { const pa = rnd() * TAU, pd = R * 0.4; I.pond = { x: Math.sin(pa) * pd, z: Math.cos(pa) * pd, r: 1.8, sig: 1.3 }; }
      if (I.mountain && I.pond && hyp(I.mountain.x - I.pond.x, I.mountain.z - I.pond.z) < 7) I.pond = null;
      I.kind = ['forest', 'stone', 'meadow', 'forest', 'meadow'][(rnd() * 5) | 0];
    }
    if (!I) continue;
    W.isles.push(I);
    sampleGrid(I);
    if (I.pond) I.waterY = heightRaw(I, I.pond.x, I.pond.z) + 0.75;
    // resources: each isle has a character
    const area = I.R * I.R;
    const nTree = Math.round(area * (I.kind === 'forest' ? 0.16 : 0.07)), nRock = Math.round(area * (I.kind === 'stone' ? 0.07 : 0.025)) + (I.mountain ? 3 : 0), nBush = Math.round(area * (I.kind === 'meadow' ? 0.08 : 0.04));
    const put = (type, count) => {
      for (let t = 0, made = 0; t < count * 30 && made < count; t++) {
        const a = rnd() * TAU, r = Math.sqrt(rnd()) * I.R;
        const x = I.cx + Math.sin(a) * r, z = I.cz + Math.cos(a) * r;
        if (!walkable(W, x, z, 0.6)) continue;
        let clash = false;
        for (const n of W.nodes) if (n.isle === I.id && hyp(n.x - x, n.z - z) < 1.4) { clash = true; break; }
        if (clash) continue;
        addNode(W, type, x, z, rnd).isle = I.id;
        made++;
      }
    };
    put('tree', nTree); put('rock', nRock); put('bush', nBush);
  }
}

/* which isle a world point stands on (inside its rim), or -1 at sea */
function isleAt(W, x, z) {
  for (const I of W.isles) {
    const lx = x - I.cx, lz = z - I.cz;
    if (Math.abs(lx) > I.gh || Math.abs(lz) > I.gh) continue;
    if (hyp(lx, lz) <= rimR(I, Math.atan2(lx, lz))) return I.id;
  }
  return -1;
}
/* the isle whose shore is nearest to a point */
function isleNear(W, x, z) {
  let best = 0, bd = 1e9;
  for (const I of W.isles) { const d = hyp(x - I.cx, z - I.cz) - I.R; if (d < bd) { bd = d; best = I.id; } }
  return best;
}

function addNode(W, type, x, z, rnd) {
  const max = type === 'tree' ? 4 : type === 'rock' ? 8 : 3;
  const n = { type, x, z, amount: max, max, regrow: 0, scale: 0.8 + rnd() * 0.5, rot: rnd() * TAU, dead: false };
  W.nodes.push(n);
  return n;
}

/* shore radius of an isle at an angle (local coordinates) */
function rimR(I, ang) {
  return I.R * (1 + 0.1 * Math.sin(3 * ang + I.p1) + 0.06 * Math.sin(5 * ang + I.p2));
}

/* height of an isle at local coordinates */
function heightRaw(I, x, z) {
  const r = hyp(x, z), ang = Math.atan2(x, z);
  const d = r / rimR(I, ang);
  let h = 0.75 + 1.1 * I.noise(x * 0.13, z * 0.13) + 0.4 * I.noise(x * 0.33 + 7, z * 0.33 + 3);
  h = lerp(h, 1.25, smooth(9.5, 4, r) * 0.8 * (I.id ? 0.6 : 1));   // flat village green in the middle
  h *= 0.45 + 0.55 * smooth(1.02, 0.74, d);                          // slump toward the rim
  const m = I.mountain;
  if (m) {
    const dm2 = (x - m.x) * (x - m.x) + (z - m.z) * (z - m.z);
    h += Math.exp(-dm2 / (2 * m.sig * m.sig)) * m.h * (0.86 + 0.28 * I.noise(x * 0.7 + 3, z * 0.7 + 11));
  }
  const p = I.pond;
  if (p) { const dp2 = (x - p.x) * (x - p.x) + (z - p.z) * (z - p.z); h -= Math.exp(-dp2 / (2 * p.sig * p.sig)) * 1.7; }
  return h;
}

/* exact height of the terrain mesh at a world point (sea level off the land) */
function groundY(W, x, z) {
  const isles = W.isles || [W];
  for (const I of isles) {
    const lx = x - (I.cx || 0), lz = z - (I.cz || 0);
    if (Math.abs(lx) >= I.gh || Math.abs(lz) >= I.gh) continue;
    if (I.id && hyp(lx, lz) > rimR(I, Math.atan2(lx, lz)) + 0.6) continue;
    const n1 = I.gn + 1;
    let gx = (lx + I.gh) / I.gc, gz = (lz + I.gh) / I.gc;
    gx = clamp(gx, 0, I.gn - 0.0001); gz = clamp(gz, 0, I.gn - 0.0001);
    const i = gx | 0, j = gz | 0, fx = gx - i, fz = gz - j;
    const h00 = I.grid[j * n1 + i], h10 = I.grid[j * n1 + i + 1];
    const h01 = I.grid[(j + 1) * n1 + i], h11 = I.grid[(j + 1) * n1 + i + 1];
    if (fx + fz <= 1) return h00 + (h10 - h00) * fx + (h01 - h00) * fz;
    return h11 + (h01 - h11) * (1 - fx) + (h10 - h11) * (1 - fz);
  }
  return SEA_Y;
}

function walkable(W, x, z, margin) {
  margin = margin || 0;
  const isles = W.isles || [W];
  for (const I of isles) {
    const lx = x - (I.cx || 0), lz = z - (I.cz || 0);
    if (Math.abs(lx) > I.gh || Math.abs(lz) > I.gh) continue;
    if (hyp(lx, lz) > rimR(I, Math.atan2(lx, lz)) - 1.4 - margin) return false;
    if (I.mountain && hyp(lx - I.mountain.x, lz - I.mountain.z) < I.mountain.r + margin) return false;
    if (I.pond && hyp(lx - I.pond.x, lz - I.pond.z) < I.pond.r + margin) return false;
    return true;
  }
  return false;
}

/* nearest walkable point to (x, z) on the nearest isle; writes into out = {x, z} */
function clampWalk(W, x, z, out) {
  const I = (W.isles || [W])[W.isles ? isleNear(W, x, z) : 0], cx = I.cx || 0, cz = I.cz || 0;
  x -= cx; z -= cz;
  for (let pass = 0; pass < 3; pass++) {
    for (const o of [I.mountain, I.pond]) {
      if (!o) continue;
      const dx = x - o.x, dz = z - o.z, d = hyp(dx, dz), rr = o.r + 0.3;
      if (d < rr) { const k = d > 0.001 ? rr / d : 1; x = o.x + (d > 0.001 ? dx : rr) * k; z = o.z + dz * k; }
    }
    const r = hyp(x, z), lim = rimR(I, Math.atan2(x, z)) - 1.6;
    if (r > lim) { x *= lim / r; z *= lim / r; }
  }
  out.x = x + cx; out.z = z + cz;
  return out;
}

/* ---- the fog of the unexplored ---- */
function fogIdx(x, z) {
  const i = Math.floor((x + WORLD_HALF) / FOG_CELL), j = Math.floor((z + WORLD_HALF) / FOG_CELL);
  if (i < 0 || j < 0 || i >= FOG_N || j >= FOG_N) return -1;
  return j * FOG_N + i;
}
function fogKnown(S, x, z) { const k = fogIdx(x, z); return k >= 0 && S.fog[k] === 1; }
