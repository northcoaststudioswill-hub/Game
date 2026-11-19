'use strict';
/* SECOND CHANCE - world: Halloran Alley, Ferry Street, the Pier 9 yard and warehouse, and the rooftops.
   Everything is boxes and ramps: one list of solids serves walking, walls, and the camera. */
(function () {
  const G = SC.gfx, W = SC.world = { solids: [], dyn: [], interacts: [], pickups: [], crates: [], lamps: [] };
  const STEP = SC.T.step;
  let batch;

  /* ---------- collision ---------- */
  function solid(x0, z0, x1, z1, y0, y1, o) {
    const s = Object.assign({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1), y0, y1, on: true, cam: true, ramp: null }, o || {});
    W.solids.push(s); return s;
  }
  W.solid = solid;
  W.topAt = function (s, x, z) {
    if (!s.ramp) return s.y1;
    const t = s.ramp.axis === 'x' ? (x - s.x0) / (s.x1 - s.x0) : (z - s.z0) / (s.z1 - s.z0);
    return SC.lerp(s.ramp.a, s.ramp.b, SC.clamp(t, 0, 1));
  };
  W.ground = function (x, z, feet) {
    let g = 0; const L = W.solids;
    for (let i = 0; i < L.length; i++) {
      const s = L[i]; if (!s.on || x < s.x0 || x > s.x1 || z < s.z0 || z > s.z1) continue;
      const t = W.topAt(s, x, z); if (t <= feet + STEP && t > g) g = t;
    }
    return g;
  };
  W.collide = function (p, r, feet, h) {
    const L = W.solids;
    for (let it = 0; it < 2; it++) for (let i = 0; i < L.length; i++) {
      const s = L[i]; if (!s.on || s.y0 >= feet + h) continue;
      if (p.x < s.x0 - r || p.x > s.x1 + r || p.z < s.z0 - r || p.z > s.z1 + r) continue;
      const cx = SC.clamp(p.x, s.x0, s.x1), cz = SC.clamp(p.z, s.z0, s.z1);
      if (W.topAt(s, cx, cz) <= feet + STEP) continue;
      const dx = p.x - cx, dz = p.z - cz, d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;
      if (d2 > 1e-8) { const d = Math.sqrt(d2), k = (r - d) / d; p.x += dx * k; p.z += dz * k; }
      else {
        const a = p.x - s.x0, b = s.x1 - p.x, c = p.z - s.z0, e = s.z1 - p.z, m = Math.min(a, b, c, e);
        if (m === a) p.x = s.x0 - r; else if (m === b) p.x = s.x1 + r; else if (m === c) p.z = s.z0 - r; else p.z = s.z1 + r;
      }
    }
  };
  /* Distance along a ray to the first thing in the way. The camera uses this to stay out of walls. */
  W.ray = function (ox, oy, oz, dx, dy, dz, max) {
    let best = max; const L = W.solids;
    for (let i = 0; i < L.length; i++) {
      const s = L[i]; if (!s.on || !s.cam) continue;
      const y1 = s.ramp ? Math.max(s.ramp.a, s.ramp.b) : s.y1;
      let t0 = 0, t1 = best, a, b, inv;
      if (Math.abs(dx) < 1e-6) { if (ox < s.x0 || ox > s.x1) continue; } else { inv = 1 / dx; a = (s.x0 - ox) * inv; b = (s.x1 - ox) * inv; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) continue; }
      if (Math.abs(dy) < 1e-6) { if (oy < s.y0 || oy > y1) continue; } else { inv = 1 / dy; a = (s.y0 - oy) * inv; b = (y1 - oy) * inv; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) continue; }
      if (Math.abs(dz) < 1e-6) { if (oz < s.z0 || oz > s.z1) continue; } else { inv = 1 / dz; a = (s.z0 - oz) * inv; b = (s.z1 - oz) * inv; if (a > b) { const q = a; a = b; b = q; } if (a > t0) t0 = a; if (b < t1) t1 = b; if (t0 > t1) continue; }
      if (s.ramp) {
        let hit = -1;
        for (let k = 0; k <= 6; k++) { const t = t0 + (t1 - t0) * k / 6, y = oy + dy * t; if (y <= W.topAt(s, ox + dx * t, oz + dz * t) && y >= s.y0) { hit = t; break; } }
        if (hit < 0) continue; t0 = hit;
      }
      if (t0 < best) best = t0;
    }
    return best;
  };
  W.underRoof = (x, y, z) => x > -32 && x < 6 && z > -20 && z < 6 && y < 8.4;
  W.inside = (x, z) => x > -31.4 && x < 5.4 && z > -19.4 && z < 5.4;

  /* ---------- building helpers ---------- */
  /* box by its corners; adds the picture and the solid together */
  function B(mat, x0, z0, x1, z1, y0, y1, color, o) {
    o = o || {};
    if (o.vis !== false) batch.box(mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, Math.abs(x1 - x0), y1 - y0, Math.abs(z1 - z0), color, o);
    return o.col === false ? null : solid(x0, z0, x1, z1, y0, y1, o.s);
  }
  /* box by its centre, may be turned; no solid unless asked */
  function D(mat, x, y, z, w, h, d, color, o) { batch.box(mat, x, y, z, w, h, d, color, o); }
  function cyl(mat, x, y, z, rt, rb, h, color, o) {
    o = o || {}; const g = new THREE.CylinderGeometry(rt, rb, h, o.seg || 8);
    batch.add(mat, g, G.mx(x, y, z, o.ry, o.rx, o.rz), color, o.outline === undefined ? 0.05 : o.outline); g.dispose();
  }
  function building(x0, z0, x1, z1, h, color, base) {
    B('win', x0, z0, x1, z1, 3.4, h - 0.06, color, { snap: true, outline: 0.12, col: false });
    B('brick', x0 - 0.04, z0 - 0.04, x1 + 0.04, z1 + 0.04, 0, 3.4, base, { outline: 0.1, col: false });
    B('flat', x0 - 0.2, z0 - 0.2, x1 + 0.2, z1 + 0.2, 3.3, 3.62, 0x15151f, { outline: 0, col: false });
    B('roof', x0, z0, x1, z1, h - 0.06, h, 0x5a6088, { outline: 0, col: false });
    solid(x0, z0, x1, z1, 0, h);
  }
  function parapet(x0, z0, x1, z1, y, gaps, color) {
    // along the four edges of a roof; gaps: [{side:'n'|'s'|'e'|'w', a, b}]
    const t = 0.35, h = 0.75, c = color || 0x3a3f5c;
    const edge = (side, a, b) => {
      const gs = (gaps || []).filter(g => g.side === side).sort((p, q) => p.a - q.a); let from = a;
      const put = (u, v) => { if (v - u < 0.2) return;
        if (side === 'n') B('concrete', u, z0, v, z0 + t, y, y + h, c, { outline: 0.05 });
        if (side === 's') B('concrete', u, z1 - t, v, z1, y, y + h, c, { outline: 0.05 });
        if (side === 'w') B('concrete', x0, u, x0 + t, v, y, y + h, c, { outline: 0.05 });
        if (side === 'e') B('concrete', x1 - t, u, x1, v, y, y + h, c, { outline: 0.05 }); };
      gs.forEach(g => { put(from, g.a); from = g.b; }); put(from, b);
    };
    edge('n', x0, x1); edge('s', x0, x1); edge('w', z0, z1); edge('e', z0, z1);
  }
  function slabWithHoles(mat, x0, z0, x1, z1, y0, y1, color, holes, glass) {
    const xs = [x0, x1], zs = [z0, z1];
    holes.concat(glass).forEach(h => { xs.push(h[0], h[2]); zs.push(h[1], h[3]); });
    const u = a => Array.from(new Set(a)).sort((p, q) => p - q);
    const X = u(xs).filter(v => v >= x0 && v <= x1), Z = u(zs).filter(v => v >= z0 && v <= z1);
    const within = (h, cx, cz) => cx > h[0] && cx < h[2] && cz > h[1] && cz < h[3];
    for (let i = 0; i < X.length - 1; i++) for (let j = 0; j < Z.length - 1; j++) {
      const cx = (X[i] + X[i + 1]) / 2, cz = (Z[j] + Z[j + 1]) / 2;
      if (holes.some(h => within(h, cx, cz))) continue;
      if (glass.some(h => within(h, cx, cz))) {
        B('glass', X[i], Z[j], X[i + 1], Z[j + 1], y1 - 0.12, y1, 0xffffff, { outline: 0 });
        [[X[i], Z[j], X[i + 1], Z[j] + 0.15], [X[i], Z[j + 1] - 0.15, X[i + 1], Z[j + 1]], [X[i], Z[j], X[i] + 0.15, Z[j + 1]], [X[i + 1] - 0.15, Z[j], X[i + 1], Z[j + 1]], [cx - 0.07, Z[j], cx + 0.07, Z[j + 1]]]
          .forEach(f => B('flat', f[0], f[1], f[2], f[3], y0, y1 + 0.04, 0x15151f, { outline: 0, col: false }));
      } else B(mat, X[i], Z[j], X[i + 1], Z[j + 1], y0, y1, color, { outline: 0 });
    }
  }
  function ramp(mat, x0, z0, x1, z1, y0, a, b, axis, color, o) {
    o = o || {};
    solid(x0, z0, x1, z1, y0, Math.max(a, b), Object.assign({ ramp: { axis, a, b } }, o.s || {}));
    const len = axis === 'x' ? x1 - x0 : z1 - z0, wid = axis === 'x' ? z1 - z0 : x1 - x0, rise = b - a, L = Math.hypot(len, rise), ang = Math.atan2(rise, len);
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, cy = (a + b) / 2 - 0.09;
    if (axis === 'x') D(mat, cx, cy, cz, L, 0.18, wid, color, { rz: ang, outline: 0.05 });
    else D(mat, cx, cy, cz, wid, 0.18, L, color, { rx: -ang, outline: 0.05 });
    if (o.steps) { // tread lines so it reads as a stair
      const n = Math.round(len / 0.5);
      for (let i = 0; i < n; i++) { const t = (i + 0.5) / n, y = SC.lerp(a, b, t) + 0.02;
        if (axis === 'x') D('flat', x0 + len * t, y, cz, 0.08, 0.05, wid, 0x15151f, { rz: ang, outline: 0 });
        else D('flat', cx, y, z0 + len * t, wid, 0.05, 0.08, 0x15151f, { rx: -ang, outline: 0 }); }
    }
  }
  const signTex = {};
  function sign(text, x, y, z, ry, w, h, color, bg) {
    const key = text + color + bg;
    const t = signTex[key] || (signTex[key] = G.canvasTex(512, Math.round(512 * h / w), (g, cw, ch) => {
      g.fillStyle = bg || '#0b0d24'; g.fillRect(0, 0, cw, ch); g.strokeStyle = '#07070d'; g.lineWidth = 14; g.strokeRect(7, 7, cw - 14, ch - 14);
      g.font = 'italic 900 ' + Math.round(ch * 0.62) + 'px Impact, "Arial Black", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      const tw = g.measureText(text).width, sc = Math.min(1, (cw - 60) / tw); g.translate(cw / 2, ch / 2 + 4); g.scale(sc, 1);
      g.lineJoin = 'round'; g.lineWidth = 12; g.strokeStyle = '#07070d'; g.strokeText(text, 0, 0); g.fillStyle = color; g.fillText(text, 0, 0);
    }));
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t }));
    m.position.set(x, y, z); m.rotation.y = ry; G.scene.add(m);
    const back = new THREE.Mesh(new THREE.BoxGeometry(w + 0.25, h + 0.25, 0.16), G.outlineMat.clone()); back.material.side = THREE.FrontSide;
    back.position.set(x - Math.sin(ry) * 0.1, y, z - Math.cos(ry) * 0.1); back.rotation.y = ry; G.scene.add(back);
    return m;
  }

  /* ---------- props ---------- */
  function dumpster(x, z, alongZ, color) {
    const w = alongZ ? 1.5 : 2.6, d = alongZ ? 2.6 : 1.5;
    B('container', x - w / 2, z - d / 2, x + w / 2, z + d / 2, 0.15, 1.35, color || 0x2f7d5b);
    D('flat', x, 1.42, z, w + 0.1, 0.12, d + 0.1, 0x15151f, { outline: 0.03 });
  }
  function car(x, z, alongX, color) {
    const L = 4.5, Wd = 1.9, w = alongX ? L : Wd, d = alongX ? Wd : L, ry = alongX ? 0 : Math.PI / 2;
    solid(x - w / 2, z - d / 2, x + w / 2, z + d / 2, 0, 1.45);
    D('flat', x, 0.72, z, L, 0.62, Wd, color, { ry, outline: 0.07 });
    D('flat', x - (alongX ? 0.25 : 0), 1.27, z + (alongX ? 0 : 0.25), 2.4, 0.56, Wd - 0.22, color, { ry, outline: 0.07 });
    D('flat', x - (alongX ? 0.25 : 0), 1.27, z + (alongX ? 0 : 0.25), 2.1, 0.4, Wd - 0.16, 0x19224a, { ry, outline: 0 });
    D('flat', x - (alongX ? 0.25 : 0), 1.27, z + (alongX ? 0 : 0.25), 2.44, 0.4, Wd - 0.6, 0x19224a, { ry, outline: 0 });
    [[1.4, 0.95], [1.4, -0.95], [-1.4, 0.95], [-1.4, -0.95]].forEach(p => {
      const px = alongX ? p[0] : p[1], pz = alongX ? p[1] : p[0];
      cyl('flat', x + px, 0.36, z + pz, 0.36, 0.36, 0.26, 0x15151f, { rx: alongX ? Math.PI / 2 : 0, rz: alongX ? 0 : Math.PI / 2, seg: 10, outline: 0.03 });
    });
    [[2.26, 0.6, 0xffe9a0], [2.26, -0.6, 0xffe9a0], [-2.26, 0.6, 0xff3b30], [-2.26, -0.6, 0xff3b30]].forEach(p => {
      D('glow', x + (alongX ? p[0] : p[1]), 0.78, z + (alongX ? p[1] : p[0]), alongX ? 0.06 : 0.4, 0.16, alongX ? 0.4 : 0.06, p[2], { outline: 0 });
    });
  }
  function lamp(x, z, dx, dz) {
    solid(x - 0.15, z - 0.15, x + 0.15, z + 0.15, 0, 6, { cam: false });
    cyl('flat', x, 3, z, 0.07, 0.11, 6, 0x23232e, { outline: 0.03 }); cyl('flat', x, 0.3, z, 0.18, 0.22, 0.6, 0x23232e, { outline: 0.03 });
    D('flat', x + dx * 0.9, 5.95, z + dz * 0.9, dx ? 1.9 : 0.1, 0.1, dz ? 1.9 : 0.1, 0x23232e, { outline: 0.03 });
    const lx = x + dx * 1.7, lz = z + dz * 1.7;
    D('flat', lx, 5.82, lz, 0.6, 0.2, 0.6, 0x23232e, { outline: 0.04 }); D('glow', lx, 5.7, lz, 0.44, 0.08, 0.44, 0xffe9a0, { outline: 0 });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.6, 5.7, 14, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd76a, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false }));
    cone.position.set(lx, 2.85, lz); cone.renderOrder = 6; G.scene.add(cone);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), new THREE.MeshBasicMaterial({ map: G.tex.disc, color: 0xffd76a, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    pool.rotation.x = -Math.PI / 2; pool.position.set(lx, 0.2, lz); pool.renderOrder = 3; G.scene.add(pool);
    W.lamps.push({ cone, pool });
  }
  function container(x, z, alongX, color, y) {
    y = y || 0; const w = alongX ? 6 : 2.5, d = alongX ? 2.5 : 6;
    B('container', x - w / 2, z - d / 2, x + w / 2, z + d / 2, y, y + 2.6, color, { outline: 0.07 });
  }
  function crateStatic(x, z, s, y, color) { y = y || 0; B('crate', x - s / 2, z - s / 2, x + s / 2, z + s / 2, y, y + s, color || 0xb98a55, { outline: 0.05 }); }
  let crateMat;
  /* crates that break when hit */
  function crate(x, z, s, y, loot) {
    crateMat = crateMat || G.toon({ map: G.tex.crate, color: 0xd9a05f });
    y = y || 0; const m = G.inked(new THREE.BoxGeometry(s, s, s), crateMat, 0.05);
    m.position.set(x, y + s / 2, z); G.scene.add(m);
    const c = { m, x, z, y, s, hp: 2, loot: loot || null, alive: true, sol: solid(x - s / 2, z - s / 2, x + s / 2, z + s / 2, y, y + s) };
    W.crates.push(c); return c;
  }
  function acUnit(x, z, y) {
    B('metal', x - 1, z - 0.7, x + 1, z + 0.7, y, y + 1.3, 0x8d94ac, { outline: 0.06 });
    cyl('flat', x, y + 1.34, z, 0.5, 0.5, 0.08, 0x23232e, { seg: 10, outline: 0 });
  }
  function waterTower(x, z, y) {
    solid(x - 1.9, z - 1.9, x + 1.9, z + 1.9, y, y + 7);
    [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]].forEach(p => D('flat', x + p[0], y + 1.5, z + p[1], 0.2, 3, 0.2, 0x23232e, { outline: 0.03 }));
    cyl('wood', x, y + 4.4, z, 2.1, 2.1, 2.9, 0xa5683a, { seg: 12, outline: 0.07 });
    const g = new THREE.ConeGeometry(2.4, 1.3, 12); batch.add('flat', g, G.mx(x, y + 6.5, z), 0x3a3f5c, 0.07); g.dispose();
  }
  function fireEscape(x, z0, z1, side, y0, floors) {
    for (let f = 0; f < floors; f++) {
      const y = y0 + f * 3.3;
      D('metal', x + side * 0.7, y, (z0 + z1) / 2, 1.3, 0.1, z1 - z0, 0x23232e, { outline: 0.04 });
      D('flat', x + side * 1.32, y + 0.55, (z0 + z1) / 2, 0.06, 0.06, z1 - z0, 0x23232e, { outline: 0.025 });
      for (let z = z0; z <= z1 + 0.01; z += (z1 - z0) / 4) D('flat', x + side * 1.32, y + 0.3, z, 0.06, 0.55, 0.06, 0x23232e, { outline: 0.02 });
      if (f < floors - 1) D('flat', x + side * 0.7, y + 1.65, z0 + 0.6 + (f % 2) * (z1 - z0 - 1.2), 0.5, 3.4, 0.07, 0x23232e, { rx: 0.25 * (f % 2 ? -1 : 1), outline: 0.03 });
    }
  }
  function barrelFire(x, z) {
    solid(x - 0.4, z - 0.4, x + 0.4, z + 0.4, 0, 1, { cam: false });
    cyl('metal', x, 0.5, z, 0.42, 0.38, 1, 0x7a4a3a, { seg: 9, outline: 0.05 });
    const fl = [];
    for (let i = 0; i < 3; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: G.tex.burst, color: i ? 0xff7a1f : 0xffe14a, transparent: true, depthWrite: false, fog: false })); s.position.set(x, 1.25 + i * 0.12, z); G.scene.add(s); fl.push(s); }
    W.dyn.push(t => fl.forEach((s, i) => { const k = 0.8 + 0.25 * Math.sin(t * (9 + i * 3) + i); s.scale.set(k * (1 - i * 0.2), k * 1.25 * (1 - i * 0.2), 1); s.material.rotation = Math.sin(t * 7 + i) * 0.3; }));
  }

  /* doors and gates that open: a mesh and a solid that switches off */
  function door(id, geo, mat, x, y, z, sol, open) {
    const m = G.inked(geo, mat, 0.05); m.position.set(x, y, z); G.scene.add(m);
    const d = { id, m, sol, k: 0, to: 0, from: m.position.clone(), open };
    W.doors[id] = d; return d;
  }
  W.openDoor = function (id, instant) { const d = W.doors[id]; d.to = 1; d.sol.on = false; if (instant) { d.k = 1; d.m.position.copy(d.from).add(d.open); } };

  /* ---------- the level ---------- */
  W.build = function () {
    batch = new G.Batch(); W.doors = {};
    const ASPH = 0x4b5386, WALK = 0x868eb4;
    // ground
    D('asphalt', 0, -0.25, 0, 110, 0.5, 116, ASPH, { outline: 0 });
    // ----- south side: Halloran Alley between two tenements -----
    building(-46, 18, -3.5, 50, 11, 0x9a566a, 0x6e3a4e);
    building(3.5, 18, 46, 50, 9, 0x5a76a4, 0x3c5078);
    B('brick', -3.5, 46, 3.5, 50, 0, 6.5, 0x6e3a4e, { outline: 0.1 });
    sign('LETHE', -3.38, 4.6, 23.5, Math.PI / 2, 3.4, 1.3, '#19d3c5', '#0b0d24');
    sign('ROOMS', 3.38, 5.2, 29, -Math.PI / 2, 3, 1.1, '#ff5a1f', '#0b0d24');
    sign('NO WAY OUT', 0, 4.2, 45.9, Math.PI, 5, 1.1, '#ffe14a', '#8a1f24');
    fireEscape(-3.5, 30, 36, 1, 3.6, 2); fireEscape(3.5, 22, 28, -1, 3.6, 2);
    dumpster(-2.5, 29, true); dumpster(2.55, 38.5, true, 0x3c5078);
    crateStatic(-2.7, 43.6, 1.1); crateStatic(-2.75, 43.5, 0.8, 1.1, 0xd9a05f); crateStatic(2.6, 44.2, 1.2);
    crate(2.75, 31.5, 0.9, 0, 'hp'); crate(2.7, 32.5, 0.9); crate(-2.8, 24.2, 0.9, 0, 'meter');
    [[1.2, 40.8, 2.2, 1.3], [-1.4, 33, 1.6, 2.4], [1.6, 25.5, 2.4, 1.2]].forEach(p => D('flat', p[0], 0.012, p[1], p[2], 0.02, p[3], 0x2c3a78, { outline: 0, ry: 0.4 }));
    for (let z = 21; z < 46; z += 3.1) { D('flat', -3.3, 0.5, z, 0.3, 1, 0.5, 0x15151f, { outline: 0.03 }); }
    D('metal', -3.3, 1.4, 41, 0.25, 2.6, 1.4, 0x3c5078, { outline: 0.04 }); D('metal', 3.3, 1.3, 35, 0.25, 2.4, 1.3, 0x6e3a4e, { outline: 0.04 });
    cyl('flat', 3.25, 5, 41.5, 0.12, 0.12, 8, 0x23232e, { outline: 0.03 }); cyl('flat', -3.25, 5.5, 26.6, 0.12, 0.12, 11, 0x23232e, { outline: 0.03 });

    // ----- Ferry Street -----
    B('concrete', -40, 16, -3.5, 18, 0, 0.15, WALK, { outline: 0 }); B('concrete', 3.5, 16, 40, 18, 0, 0.15, WALK, { outline: 0 });
    B('concrete', -40, 6, 16, 8, 0, 0.15, WALK, { outline: 0 }); B('concrete', 20, 6, 40, 8, 0, 0.15, WALK, { outline: 0 });
    for (let x = -37; x < 40; x += 6) D('flat', x, 0.012, 12, 2.6, 0.02, 0.22, 0xe8e2c8, { outline: 0 });
    for (let x = -2.6; x <= 2.7; x += 1.3) D('flat', x, 0.012, 17, 0.7, 0.02, 2.2, 0xe8e2c8, { outline: 0 });
    B('wood', -41, 6, -40, 18, 0, 4.6, 0xb98a55, { outline: 0.08 }); B('wood', 40, 6, 41, 18, 0, 4.6, 0xb98a55, { outline: 0.08 });
    building(-46, 6, -41, 18, 8, 0x4a5078, 0x343b5c); building(41, 6, 46, 18, 8, 0x4a5078, 0x343b5c);
    sign('ROAD CLOSED', -39.9, 2.6, 12, Math.PI / 2, 6, 1.4, '#07070d', '#ffe14a');
    sign('SECOND CHANCE LOANS', 39.9, 2.9, 12, -Math.PI / 2, 8, 1.5, '#ffe14a', '#8a1f24');
    car(-15, 9.6, true, 0x9c2f3f); car(24, 14.6, true, 0x3f7a7a); car(-31, 14.4, true, 0xd9dde6);
    lamp(-24, 16.9, 0, -1); lamp(-6, 7.1, 0, 1); lamp(12, 16.9, 0, -1); lamp(30, 7.1, 0, 1);
    cyl('flat', 5.6, 0.55, 16.7, 0.18, 0.22, 0.8, 0xc22a2a, { outline: 0.04 }); cyl('flat', 5.6, 1, 16.7, 0.24, 0.18, 0.14, 0xc22a2a, { outline: 0.03 });
    solid(5.35, 16.45, 5.85, 16.95, 0, 1, { cam: false });
    B('metal', -10.6, 16.3, -9.5, 17.5, 0.15, 2.6, 0x3c5078, { outline: 0.06 }); D('flat', -10.05, 1.6, 16.28, 0.8, 1.4, 0.04, 0x9fd7ff, { outline: 0 });
    B('flat', -29, 6.3, -25, 6.5, 0.15, 2.6, 0x23232e, { outline: 0.05 }); D('flat', -27, 2.66, 7, 4.3, 0.12, 1.6, 0x23232e, { outline: 0.04 });
    D('wood', -27, 0.6, 6.9, 3, 0.1, 0.5, 0xb98a55, { outline: 0.03 });
    barrelFire(35.5, 9.2); barrelFire(-36, 15);
    crate(33.2, 16.6, 1, 0.15, 'hp'); crate(-37.5, 8.6, 1, 0.15); crate(-36.4, 8.4, 1, 0.15, 'meter');
    // the wrecked courier bike
    D('flat', 9.3, 0.42, 15.0, 1.5, 0.12, 0.14, 0xc22a2a, { ry: 0.5, rz: 0.2, outline: 0.03 });
    cyl('flat', 8.7, 0.38, 14.7, 0.36, 0.36, 0.07, 0x15151f, { rx: 1.3, ry: 0.5, seg: 10, outline: 0.03 }); cyl('flat', 10, 0.3, 15.4, 0.36, 0.36, 0.07, 0x15151f, { rx: 1.5, ry: 0.2, seg: 10, outline: 0.03 });
    D('flat', 8.4, 0.3, 15.9, 0.6, 0.3, 0.45, 0x7a5a2c, { ry: -0.4, outline: 0.04 });

    // ----- north side: tall blocks at each end, warehouse, yard -----
    building(-46, -46, -32, 6, 13, 0x6f5c98, 0x473a6c);
    building(32, -46, 46, 6, 12, 0x3f7a7a, 0x2a5458);
    building(-46, -54, 46, -46, 15, 0x4a5078, 0x343b5c);
    // yard fence and gate
    B('metal', 6, 5.7, 16, 6, 0, 3.2, 0x8d94ac, { outline: 0.05 }); B('metal', 20, 5.7, 32, 6, 0, 3.2, 0x8d94ac, { outline: 0.05 });
    D('flat', 16.1, 1.8, 5.85, 0.3, 3.6, 0.4, 0x23232e, { outline: 0.04 }); D('flat', 19.9, 1.8, 5.85, 0.3, 3.6, 0.4, 0x23232e, { outline: 0.04 });
    sign('PIER 9 FREIGHT', 11, 4.1, 6.05, 0, 7, 1.3, '#ffe14a', '#0b0d24');
    const metalMat = G.toon({ map: G.tex.metal, color: 0xb5613a });
    door('gate', new THREE.BoxGeometry(3.8, 3, 0.16), metalMat, 18, 1.5, 5.85, solid(16, 5.7, 20, 6, 0, 3.2), new THREE.Vector3(3.9, 0, -0.25));
    // yard dressing
    container(27, -1.6, true, 0xb5613a); container(27, -1.6, true, 0x3f6b55, 2.6); container(9.3, -15, false, 0x3c5078);
    container(28.4, -14, false, 0x9c2f3f); container(21, -18.4, true, 0xc9a063);
    crateStatic(13, 3.6, 1.3); crateStatic(14.2, 3.9, 1); crateStatic(13.2, 3.7, 0.9, 1.3, 0xd9a05f);
    crate(23, 3.8, 1, 0, 'hp'); crate(30.6, -7.4, 1, 0, 'meter'); crate(14, -17.6, 1, 0, 'hp'); crate(15.1, -17.9, 1);
    // forklift
    B('flat', 12.4, -1.2, 14.2, 0.2, 0.2, 1.3, 0xffb52e, { outline: 0.06 }); D('flat', 13.1, 1.75, -0.5, 1.2, 0.9, 1.2, 0x23232e, { outline: 0.04 });
    D('flat', 14.4, 1.2, -0.5, 0.12, 2.4, 1.1, 0x23232e, { outline: 0.03 }); D('flat', 14.95, 0.25, -0.5, 1, 0.07, 0.9, 0x8d94ac, { outline: 0.02 });
    // breaker box on the east wall
    D('metal', 31.8, 1.5, -8, 0.3, 1.2, 0.9, 0xffb52e, { outline: 0.05 }); D('flat', 31.62, 1.5, -8, 0.06, 0.5, 0.12, 0x15151f, { outline: 0 });
    lamp(8, -19.4, 1, 0); lamp(31.4, 3.6, -1, 0);

    // warehouse shell
    const WH = 0x7d86a8, RUST = 0xb5613a;
    B('metal', -32, 5.4, 6, 6, 0, 8.4, WH, { outline: 0.1 });                 // south
    B('metal', -32, -20, 6, -19.4, 0, 8.4, WH, { outline: 0.1 });             // north
    B('metal', -32, -19.4, -31.4, 5.4, 0, 8.4, WH, { outline: 0 });           // west
    B('metal', 5.4, -19.4, 6, -9, 0, 8.4, WH, { outline: 0 }); B('metal', 5.4, -4, 6, 5.4, 0, 8.4, WH, { outline: 0 });
    B('metal', 5.4, -9, 6, -4, 4.2, 8.4, WH, { outline: 0 });
    D('flat', 5.7, 2.1, -9.1, 0.8, 4.2, 0.3, RUST, { outline: 0.04 }); D('flat', 5.7, 2.1, -3.9, 0.8, 4.2, 0.3, RUST, { outline: 0.04 }); D('flat', 5.7, 4.3, -6.5, 0.8, 0.3, 5.5, RUST, { outline: 0.04 });
    B('flat', -32.06, 5.94, 6.06, 6.06, 0, 1.1, RUST, { outline: 0, col: false });
    sign('9', 6.08, 6, -6.5, Math.PI / 2, 2, 2, '#ffe14a', '#0b0d24');
    door('shutter', new THREE.BoxGeometry(0.2, 4.2, 5), G.toon({ map: G.tex.metal, color: 0xc9a063 }), 5.7, 2.1, -6.5, solid(5.4, -9, 6, -4, 0, 4.2), new THREE.Vector3(0, 4.0, 0));
    B('concrete', -31.4, -19.4, 5.4, 5.4, 0, 0.03, 0x7c82a2, { outline: 0, col: false });
    // roof with skylights and the stair hatch
    slabWithHoles('roof', -32, -20, 6, 6, 8, 8.4, 0x5a6088, [[-20, -19.4, -12.5, -16.8]], [[-8, -6.5, -3, -1.5], [-18, -9, -13, -4], [-3, -16, 2, -12], [-28, -3, -24, 2]]);
    parapet(-32, -20, 6, 6, 8.4, [{ side: 'n', a: -27.2, b: -24.8 }, { side: 'n', a: -20.2, b: -12.3 }]);
    // stairwell: partition wall, bulkhead on the roof, roof door
    B('metal', -22, -17, -12.5, -16.8, 4, 8.4, WH, { vis: false, s: { cam: false } });
    D('flat', -17.25, 7.15, -16.9, 10.5, 0.1, 0.1, RUST, { rz: 0.434, outline: 0.03 }); D('flat', -17.25, 6.6, -16.9, 10.5, 0.07, 0.07, 0x23232e, { rz: 0.434, outline: 0.02 });
    for (let x = -21.5; x < -12.6; x += 1.5) D('flat', x, 4 + (x + 22) * 0.463 + 0.5, -16.9, 0.08, 1, 0.08, 0x23232e, { outline: 0.02 });
    B('metal', -20.2, -17, -12.5, -16.8, 8.4, 10.6, RUST, { outline: 0.05 }); B('metal', -20.2, -19.4, -20, -16.8, 8.4, 10.6, RUST, { outline: 0.05 });
    B('metal', -20.2, -20, -12.5, -19.4, 8.4, 10.6, RUST, { outline: 0.05 });
    B('roof', -20.4, -20.1, -12.3, -16.6, 10.6, 10.8, 0x3a3f5c, { outline: 0.05 });
    door('hatch', new THREE.BoxGeometry(0.16, 2.2, 2.4), G.toon({ map: G.tex.metal, color: 0x3f6b55 }), -12.5, 9.5, -18.1, solid(-12.7, -19.4, -12.3, -17, 8.4, 10.6), new THREE.Vector3(0, 0, 2.5));
    // mezzanine office and stairs
    B('wood', -31.4, -19.4, -22, 5.4, 3.7, 4, 0x8a6a48, { outline: 0.05 });
    [[-22.3, -12], [-22.3, -3], [-22.3, 2]].forEach(p => B('flat', p[0] - 0.2, p[1] - 0.2, p[0] + 0.2, p[1] + 0.2, 0, 3.7, 0x23232e, { outline: 0.04 }));
    B('flat', -22.12, -17, -22, 2.3, 4, 5, 0x23232e, { outline: 0.03, s: { cam: false } }); D('flat', -22.06, 5.05, -7.35, 0.16, 0.1, 19.4, RUST, { outline: 0.03 });
    ramp('wood', -22, 2.4, -14, 5.0, 0, 4, 0, 'x', 0x8a6a48, { steps: true });
    ramp('wood', -22, -19.4, -12.5, -17, 3.6, 4, 8.4, 'x', 0x8a6a48, { steps: true });
    B('wood', -30.5, -9.6, -27.6, -7.9, 4, 4.85, 0x6e4a2c, { outline: 0.05 });                // desk
    D('flat', -29, 4.92, -8.8, 0.7, 0.06, 0.5, 0xece6d6, { ry: 0.2, outline: 0.02 }); cyl('flat', -30, 5.1, -8.3, 0.12, 0.16, 0.5, 0x3f6b55, { outline: 0.03 });
    D('glow', -30, 5.42, -8.3, 0.34, 0.2, 0.34, 0xffe9a0, { outline: 0 });
    B('metal', -31.3, -16, -30.4, -12, 4, 5.9, 0x3c5078, { outline: 0.05 }); B('metal', -31.3, -2, -30.4, 3, 4, 5.9, 0x3c5078, { outline: 0.05 });
    crateStatic(-24, -18.4, 1.1, 4); crateStatic(-29, 4.4, 1.2, 4);
    // floor: racks, pillars, crates
    const rack = (x0, z0, x1, z1) => { B('flat', x0, z0, x1, z1, 0, 0.25, 0x23232e, { outline: 0.03 }); solid(x0, z0, x1, z1, 0, 4.6);
      for (let y = 1.5; y < 4.7; y += 1.5) D('metal', (x0 + x1) / 2, y, (z0 + z1) / 2, x1 - x0, 0.1, z1 - z0, 0x3c5078, { outline: 0.03 });
      for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / 3) { D('flat', x, 2.3, z0 + 0.06, 0.12, 4.6, 0.12, RUST, { outline: 0.025 }); D('flat', x, 2.3, z1 - 0.06, 0.12, 4.6, 0.12, RUST, { outline: 0.025 }); }
      const rnd = SC.seeded(Math.abs(x0 * 31 + z0 * 7) | 0);
      for (let y = 0.25; y < 3.5; y += 1.5) for (let x = x0 + 0.8; x < x1 - 0.5; x += 1.5) if (rnd() < 0.7) { const s = 0.7 + rnd() * 0.5; D('crate', x, y + s / 2 + (y > 0.3 ? 0.05 : 0), (z0 + z1) / 2, s, s, Math.min(s, z1 - z0 - 0.1), rnd() < 0.5 ? 0xb98a55 : 0xd9a05f, { outline: 0.03 }); }
    };
    rack(-10, -15.2, 2, -14); rack(-8, 0.4, 3.5, 1.6); rack(-19.5, -13.6, -13, -12.4);
    [[-11, -7.5], [-1, -7.5], [-11, 3], [-1, -17]].forEach(p => B('concrete', p[0] - 0.3, p[1] - 0.3, p[0] + 0.3, p[1] + 0.3, 0, 8, 0x7c82a2, { outline: 0.04 }));
    crateStatic(3.6, -17.6, 1.6); crateStatic(3.9, -15.9, 1.2); crateStatic(3.7, -17.5, 1, 1.6, 0xd9a05f); crateStatic(-20.6, 0.6, 1.4); crateStatic(-25, -2, 1.3); crateStatic(-27.5, -14, 1.5);
    crate(-4.6, 4.4, 1, 0, 'hp'); crate(-5.7, 4.5, 1); crate(-18.6, -17.8, 1, 0, 'meter'); crate(2.6, 3.4, 1, 0, 'hp'); crate(-29.6, -18, 1, 0, 'hp');
    // hanging lamps (real lights: the hall is all shadow otherwise)
    [[-4.5, -9.5], [-15.5, -1], [-26, -8]].forEach((p, i) => {
      cyl('flat', p[0], 7.2, p[1], 0.02, 0.02, 1.8, 0x15151f, { outline: 0 }); cyl('flat', p[0], 6.2, p[1], 0.2, 0.7, 0.4, 0x23232e, { seg: 10, outline: 0.04 });
      D('glow', p[0], 5.98, p[1], 0.5, 0.06, 0.5, 0xffe9a0, { outline: 0 });
      const l = new THREE.PointLight(0xffd9a0, i === 2 ? 22 : 60, 20, 1.6); l.position.set(p[0], i === 2 ? 6.6 : 5.6, p[1]); G.scene.add(l);
    });

    // ----- back alley and the cut between the north blocks -----
    crate(-30.6, -21, 1, 0, 'hp'); crate(-6, -44.6, 1, 0, 'meter'); crate(-4.9, -44.8, 1, 0, 'hp');
    dumpster(-6.2, -30, true, 0x473a6c); D('flat', -6, 0.012, -38, 3, 0.02, 2, 0x2c3a78, { outline: 0, ry: 0.3 });
    fireEscape(-10, -42, -37, 1, 3.6, 2);

    // ----- rooftops -----
    building(-32, -46, -10, -22, 9, 0x8a6048, 0x5c3c2c);                           // block C (9 m)
    building(-2, -46, 32, -22, 11, 0x5a6690, 0x3a4468);                             // the Meridian (11 m)
    ramp('wood', -27, -22.3, -25, -19.7, 8.2, 9, 8.4, 'z', 0xb98a55);               // plank: warehouse -> C
    parapet(-32, -46, -10, -22, 9, [{ side: 's', a: -27.2, b: -24.8 }, { side: 'e', a: -35.8, b: -32.7 }]);
    ramp('wood', -10.3, -35.5, -1.7, -33, 8.6, 9, 11, 'x', 0xb98a55);              // scaffold bridge: C -> Meridian
    [[-8, -35.6], [-4, -35.6], [-8, -32.9], [-4, -32.9]].forEach(p => D('flat', p[0], 4.8, p[1], 0.14, 10, 0.14, 0x23232e, { outline: 0.03 }));
    D('flat', -6, 5, -35.6, 5.8, 0.1, 0.1, 0x23232e, { rz: 0.7, outline: 0.02 }); D('flat', -6, 5, -32.9, 5.8, 0.1, 0.1, 0x23232e, { rz: -0.7, outline: 0.02 });
    parapet(-2, -46, 32, -22, 11, [{ side: 'w', a: -35.8, b: -32.7 }]);
    waterTower(-28, -42, 9); acUnit(-22, -25.4, 9); acUnit(-13.5, -43.6, 9); acUnit(-18, -43.6, 9);
    B('glass', -21.5, -37.5, -18, -34, 9, 9.9, 0xffffff, { outline: 0 }); B('flat', -21.7, -37.7, -17.8, -33.8, 9, 9.3, 0x23232e, { outline: 0.04, col: false });
    B('brick', -30.5, -31.5, -29.3, -30.3, 9, 11.6, 0x5c3c2c, { outline: 0.05 });
    // pigeon loft
    B('wood', -30.8, -28, -28.6, -25.4, 9, 10.9, 0x8a6a48, { outline: 0.05 }); D('flat', -29.7, 10.98, -26.7, 2.6, 0.12, 3, 0x23232e, { outline: 0.03 });
    D('flat', -28.56, 10, -26.7, 0.04, 1.2, 1.8, 0x15151f, { outline: 0 });
    // billboard over the north edge of C
    [-23, -13].forEach(x => D('flat', x, 11.5, -45.4, 0.25, 5, 0.25, 0x23232e, { outline: 0.03 }));
    sign('EVERYBODY PAYS', -18, 13, -45.3, 0, 12, 3, '#ffe14a', '#8a1f24');
    // Meridian roof: the arena
    acUnit(27, -43.5, 11); acUnit(29.6, -24.6, 11); waterTower(1.2, -43, 11);
    B('brick', 14, -45.6, 15.2, -44.4, 11, 13.8, 0x3a4468, { outline: 0.05 });
    [6, 24].forEach(x => D('flat', x, 14, -45.6, 0.3, 6, 0.3, 0x23232e, { outline: 0.03 }));
    sign('MERIDIAN', 15, 15.6, -45.5, 0, 17, 3.2, '#ff3b30', '#0b0d24');
    crate(30, -34, 1, 11, 'hp'); crate(0.6, -24, 1, 11, 'hp'); crate(30, -40, 1, 11, 'meter');
    crate(-12, -24, 1, 9, 'hp'); crate(-30.6, -36, 1, 9, 'meter');

    W.statics = batch.build(G.scene); batch = null;
  };

  /* ---------- interactables, pickups, crates ---------- */
  W.addInteract = function (o) {
    const it = Object.assign({ r: 2.1, on: true, y: 0, label: 'LOOK' }, o);
    if (it.marker) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: it.marker === 'clue' ? G.tex.mark : G.tex.alert, transparent: true, depthWrite: false, fog: false }));
      s.scale.set(0.9, 0.9, 1); s.position.set(it.x, it.y + (it.mh || 1.7), it.z); s.visible = false; G.scene.add(s); it.spr = s;
    }
    W.interacts.push(it); return it;
  };
  W.nearestInteract = function (p) {
    let best = null, bd = 1e9;
    for (const it of W.interacts) {
      if (!it.on || (it.when && !it.when())) continue;
      if (Math.abs(p.y - it.y) > 2.2) continue;
      const d = SC.dist2(p.x, p.z, it.x, it.z); if (d < it.r && d < bd) { bd = d; best = it; }
    }
    return best;
  };
  const pickMat = {};
  W.dropPickup = function (kind, x, y, z) {
    const col = kind === 'hp' ? 0xff3b6b : 0xffffff;
    const m = pickMat[kind] || (pickMat[kind] = new THREE.MeshBasicMaterial({ color: col, fog: false }));
    const o = G.inked(new THREE.OctahedronGeometry(0.24), kind === 'hp' ? m : m.clone(), 0.035);
    o.position.set(x, y + 0.7, z); G.scene.add(o);
    W.pickups.push({ kind, o, x, y, z, t: Math.random() * 6 });
  };
  W.breakCrate = function (c) {
    if (!c.alive) return; c.alive = false; c.sol.on = false; G.scene.remove(c.m);
    const p = new THREE.Vector3(c.x, c.y + c.s / 2, c.z);
    G.fx.puff(p, 5, 1); G.fx.word(SC.pick(['KRAK!', 'SMASH!', 'KRUNCH!']), p, '#ffb52e', 1.2);
    if (c.loot) W.dropPickup(c.loot, c.x, c.y, c.z);
    SC.audio && SC.audio.sfx('crate');
  };
  W.update = function (dt, t) {
    for (const k in W.doors) {
      const d = W.doors[k];
      if (d.k !== d.to) { d.k = Math.min(d.to, d.k + dt * 0.9); d.m.position.copy(d.from).addScaledVector(d.open, SC.smooth(d.k)); }
    }
    for (let i = 0; i < W.dyn.length; i++) W.dyn[i](t, dt);
    for (const it of W.interacts) if (it.spr) {
      const vis = !!(it.on && (!it.when || it.when())) && G.camera.position.distanceToSquared(it.spr.position) > 7; it.spr.visible = vis;
      if (vis) { it.spr.position.y = it.y + (it.mh || 1.7) + Math.sin(t * 3 + it.x) * 0.1; const k = 0.85 + Math.sin(t * 6 + it.z) * 0.06; it.spr.scale.set(k, k, 1); }
    }
    const pl = SC.player;
    for (let i = W.pickups.length - 1; i >= 0; i--) {
      const p = W.pickups[i]; p.t += dt; p.o.position.y = p.y + 0.7 + Math.sin(p.t * 3) * 0.12; p.o.rotation.y = p.t * 2.5;
      if (p.kind === 'meter') p.o.material.color.set(SC.PATHS[pl.path || 'ember'].color);
      const d = SC.dist2(pl.pos.x, pl.pos.z, p.x, p.z);
      if (d < 3.2 && Math.abs(pl.pos.y - p.y) < 2.4) { const k = Math.min(1, dt * 7 / Math.max(0.3, d)); p.x += (pl.pos.x - p.x) * k; p.z += (pl.pos.z - p.z) * k; p.o.position.x = p.x; p.o.position.z = p.z; }
      if (d < 0.8 && Math.abs(pl.pos.y - p.y) < 2.4) {
        if (p.kind === 'hp') pl.heal(22); else pl.gain(30);
        G.fx.burst(p.o.position, p.kind === 'hp' ? 0xff3b6b : SC.PATHS[pl.path || 'ember'].color, 1.2); SC.audio && SC.audio.sfx('pickup');
        G.scene.remove(p.o); W.pickups.splice(i, 1);
      }
    }
  };
})();
