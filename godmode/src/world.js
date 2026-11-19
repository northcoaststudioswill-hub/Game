'use strict';
/* The island: an analytic height field sampled onto a grid. The renderer builds
   its mesh from the same grid, so feet land exactly on the triangles. */

const GRID_N = 44;          // cells per side
const GRID_HALF = 22;       // grid spans [-22, 22]
const GRID_CELL = (GRID_HALF * 2) / GRID_N;

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
  const W = { seed, R: 18, p1: rnd() * TAU, p2: rnd() * TAU, noise: makeNoise(seed + 101), nodes: [] };
  const ma = rnd() * TAU;
  W.mountain = { x: Math.sin(ma) * 10.6, z: Math.cos(ma) * 10.6, r: 4.3, sig: 2.6, h: 8.5 };
  const pa = ma + 2.0 + rnd() * 1.4;
  W.pond = { x: Math.sin(pa) * 9.2, z: Math.cos(pa) * 9.2, r: 2.7, sig: 1.9 };

  // height grid
  const n1 = GRID_N + 1;
  W.grid = new Float32Array(n1 * n1);
  for (let j = 0; j < n1; j++) for (let i = 0; i < n1; i++) {
    W.grid[j * n1 + i] = heightRaw(W, -GRID_HALF + i * GRID_CELL, -GRID_HALF + j * GRID_CELL);
  }
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
  return W;
}

function addNode(W, type, x, z, rnd) {
  const max = type === 'tree' ? 4 : type === 'rock' ? 8 : 3;
  const n = { type, x, z, amount: max, max, regrow: 0, scale: 0.8 + rnd() * 0.5, rot: rnd() * TAU, dead: false };
  W.nodes.push(n);
  return n;
}

function rimR(W, ang) {
  return W.R * (1 + 0.1 * Math.sin(3 * ang + W.p1) + 0.06 * Math.sin(5 * ang + W.p2));
}

function heightRaw(W, x, z) {
  const r = hyp(x, z), ang = Math.atan2(x, z);
  const d = r / rimR(W, ang);
  let h = 0.75 + 1.1 * W.noise(x * 0.13, z * 0.13) + 0.4 * W.noise(x * 0.33 + 7, z * 0.33 + 3);
  h = lerp(h, 1.25, smooth(9.5, 4, r) * 0.8);          // flat village green in the middle
  h *= 0.45 + 0.55 * smooth(1.02, 0.74, d);            // slump toward the rim
  const m = W.mountain, dm2 = (x - m.x) * (x - m.x) + (z - m.z) * (z - m.z);
  const mt = Math.exp(-dm2 / (2 * m.sig * m.sig));
  h += mt * m.h * (0.86 + 0.28 * W.noise(x * 0.7 + 3, z * 0.7 + 11));
  const p = W.pond, dp2 = (x - p.x) * (x - p.x) + (z - p.z) * (z - p.z);
  h -= Math.exp(-dp2 / (2 * p.sig * p.sig)) * 1.7;
  return h;
}

/* exact height of the terrain mesh at (x, z): same triangle split as the renderer */
function groundY(W, x, z) {
  const n1 = GRID_N + 1;
  let gx = (x + GRID_HALF) / GRID_CELL, gz = (z + GRID_HALF) / GRID_CELL;
  gx = clamp(gx, 0, GRID_N - 0.0001); gz = clamp(gz, 0, GRID_N - 0.0001);
  const i = gx | 0, j = gz | 0, fx = gx - i, fz = gz - j;
  const h00 = W.grid[j * n1 + i], h10 = W.grid[j * n1 + i + 1];
  const h01 = W.grid[(j + 1) * n1 + i], h11 = W.grid[(j + 1) * n1 + i + 1];
  if (fx + fz <= 1) return h00 + (h10 - h00) * fx + (h01 - h00) * fz;
  return h11 + (h01 - h11) * (1 - fx) + (h10 - h11) * (1 - fz);
}

function walkable(W, x, z, margin) {
  margin = margin || 0;
  const r = hyp(x, z);
  if (r > rimR(W, Math.atan2(x, z)) - 1.4 - margin) return false;
  if (hyp(x - W.mountain.x, z - W.mountain.z) < W.mountain.r + margin) return false;
  if (hyp(x - W.pond.x, z - W.pond.z) < W.pond.r + margin) return false;
  return true;
}

/* nearest walkable point to (x, z); writes into out = {x, z} */
function clampWalk(W, x, z, out) {
  for (let pass = 0; pass < 3; pass++) {
    for (const o of [W.mountain, W.pond]) {
      const dx = x - o.x, dz = z - o.z, d = hyp(dx, dz), rr = o.r + 0.3;
      if (d < rr) { const k = d > 0.001 ? rr / d : 1; x = o.x + (d > 0.001 ? dx : rr) * k; z = o.z + dz * k; }
    }
    const r = hyp(x, z), lim = rimR(W, Math.atan2(x, z)) - 1.6;
    if (r > lim) { x *= lim / r; z *= lim / r; }
  }
  out.x = x; out.z = z;
  return out;
}
