// Underground Syndicate — isometric scenes built from geometry: the pit, the undercity street, the hideout
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, box = gfx.box, mesh = gfx.mesh;
  const W = G.world = { cache: {} };
  const R = (a, b) => a + Math.random() * (b - a), lerp3 = (a, b, t) => a + (b - a) * t;
  const dummy = new T.Object3D(), col = new T.Color();

  // A field of slightly uneven flagstones as one instanced mesh. cells: [{x,z,tint?}]
  function tiles(scene, cells, texName, base, opts) {
    opts = opts || {};
    const mat = new T.MeshLambertMaterial({ map: gfx.tex(texName), flatShading: true });
    const im = new T.InstancedMesh(new T.BoxGeometry(0.955, 0.4, 0.955), mat, cells.length);
    cells.forEach((c, i) => {
      dummy.position.set(c.x, (c.y || 0) - 0.2 + R(-0.025, 0.025), c.z); dummy.rotation.set(0, Math.floor(R(0, 4)) * Math.PI / 2, 0); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
      const k = R(0.72, 1.08); col.setRGB(base[0] * k, base[1] * k, base[2] * k); if (c.tint) col.multiply(c.tint); im.setColorAt(i, col);
    });
    im.receiveShadow = true; im.castShadow = false; scene.add(im);
    const under = new T.Mesh(new T.PlaneGeometry(200, 200), new T.MeshBasicMaterial({ color: opts.under || 0x050407 })); under.rotation.x = -Math.PI / 2; under.position.y = -0.3; scene.add(under);
    return im;
  }
  // hand-drawn surfaces for the pit: dressed stone in courses, and raked, stained sand
  const canvasT = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; return t; };
  let ashlarT = null, sandT = null;
  const ashlar = () => ashlarT || (ashlarT = canvasT(512, 256, (c, w, h) => { c.fillStyle = '#2a2624'; c.fillRect(0, 0, w, h); const bh = 42, rows = Math.ceil(h / bh);
    for (let r = 0; r < rows; r++) { let x = -R(0, 60); while (x < w) { const bw = R(70, 130), v = R(-16, 16) | 0; c.fillStyle = 'rgb(' + (150 + v) + ',' + (142 + v) + ',' + (134 + v) + ')'; c.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4); c.fillStyle = 'rgba(255,255,255,0.07)'; c.fillRect(x + 2, r * bh + 2, bw - 4, 3); c.fillStyle = 'rgba(0,0,0,0.16)'; c.fillRect(x + 2, r * bh + bh - 7, bw - 4, 5); for (let k = 0; k < 14; k++) { c.fillStyle = 'rgba(0,0,0,' + R(0.03, 0.1) + ')'; c.fillRect(x + R(4, bw - 8), r * bh + R(4, bh - 8), R(2, 9), R(1, 4)); } x += bw; } }
    for (let i = 0; i < 16; i++) { const x = R(0, w), g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(10,6,4,0.4)'); g.addColorStop(1, 'rgba(10,6,4,0)'); c.fillStyle = g; c.fillRect(x, 0, R(4, 16), R(h * 0.4, h)); }
    for (let i = 0; i < 5; i++) { c.fillStyle = 'rgba(90,14,10,' + R(0.12, 0.3) + ')'; c.beginPath(); c.ellipse(R(0, w), R(h * 0.4, h), R(10, 34), R(14, 40), 0, 0, 6.3); c.fill(); }
    c.strokeStyle = 'rgba(8,6,5,0.6)'; c.lineWidth = 1.3; for (let i = 0; i < 7; i++) { let x = R(0, w), y = R(0, h); c.beginPath(); c.moveTo(x, y); for (let k = 0; k < 5; k++) { x += R(-26, 26); y += R(6, 30); c.lineTo(x, y); } c.stroke(); } }));
  const sand = () => sandT || (sandT = canvasT(512, 512, (c, w, h) => { c.fillStyle = '#b3956a'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) { const v = R(-34, 30) | 0; c.fillStyle = 'rgba(' + (178 + v) + ',' + (150 + v) + ',' + (108 + v) + ',0.55)'; c.fillRect(R(0, w), R(0, h), R(1, 3), R(1, 3)); }
    for (let i = 0; i < 26; i++) { c.fillStyle = 'rgba(60,40,22,' + R(0.05, 0.14) + ')'; c.beginPath(); c.ellipse(R(0, w), R(0, h), R(20, 80), R(14, 50), R(0, 3), 0, 6.3); c.fill(); }
    c.lineWidth = 2; for (let r = 30; r < 360; r += 11) { c.strokeStyle = 'rgba(70,50,28,' + R(0.05, 0.12) + ')'; c.beginPath(); c.arc(w / 2, h / 2, r + R(-2, 2), R(0, 6), R(0, 6) + R(2, 5)); c.stroke(); }       // the rake
    for (let i = 0; i < 14; i++) { c.fillStyle = 'rgba(86,16,10,' + R(0.14, 0.34) + ')'; const x = R(40, w - 40), y = R(40, h - 40); c.beginPath(); c.ellipse(x, y, R(8, 34), R(6, 24), R(0, 3), 0, 6.3); c.fill(); for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(x + R(-46, 46), y + R(-46, 46), R(1, 5), 0, 6.3); c.fill(); } }       // old blood, gone brown
    for (let i = 0; i < 40; i++) { c.strokeStyle = 'rgba(50,34,18,0.22)'; c.lineWidth = R(1, 3); const x = R(0, w), y = R(0, h), a = R(0, 6.3), l = R(14, 60); c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); } }));       // drag marks
  const stoneMat = (c) => new T.MeshLambertMaterial({ color: c || 0x5d554e, map: gfx.tex('stone'), flatShading: true });
  // A wall made of a main block plus a darker cap and a base course so it does not read as one flat box.
  function wall(parent, len, h, thick, mat) {
    const g = new T.Group(); parent.add(g);
    box(len, h, thick, mat, 0, h / 2, 0, g);
    box(len + 0.1, 0.22, thick + 0.16, mat, 0, h + 0.11, 0, g);
    box(len + 0.06, 0.3, thick + 0.1, mat, 0, 0.15, 0, g);
    return g;
  }
  function brazier(parent, x, y, z, light, color) {
    const g = new T.Group(); g.position.set(x, y, z); parent.add(g);
    const iron = gfx.lambert(0x1c1a1e);
    mesh(new T.CylinderGeometry(0.1, 0.16, 0.7, 6), iron, 0, 0.35, 0, g);
    mesh(new T.CylinderGeometry(0.42, 0.22, 0.3, 8), iron, 0, 0.82, 0, g);
    gfx.fire(g, 0, 1.0, 0, color || 0xffa050, 0.8, light);
    return g;
  }
  function lantern(parent, x, y, z, color, light, tall) {
    const g = new T.Group(); g.position.set(x, y, z); parent.add(g);
    const iron = gfx.lambert(0x1c1a1e), h = tall || 2.3;
    mesh(new T.CylinderGeometry(0.06, 0.09, h, 5), iron, 0, h / 2, 0, g); box(0.5, 0.06, 0.06, iron, 0.2, h, 0, g);
    const l = new T.Mesh(new T.BoxGeometry(0.22, 0.3, 0.22), new T.MeshBasicMaterial({ color: 0xfff0c8 })); l.position.set(0.4, h - 0.22, 0); g.add(l);
    gfx.fire(g, 0.4, h - 0.5, 0, color, 0.5, light);
    return g;
  }
  W.props = { wall, brazier, lantern, stoneMat, tiles };

  // ============================================================== THE PIT
  const AR = 8.2;
  function buildArena() {
    const s = gfx.newScene({ ambient: 0.82, key: 1.4, shadowSize: 13, sky: 0x8a8cb8, ground: 0x2a2018, keyColor: 0xffdcb4 }); const engineSet = s.children.slice();
    s.fog = new T.Fog(0x07060a, 76, 112);
    const inOct = (x, z, m) => Math.abs(x) < AR + m && Math.abs(z) < AR + m && Math.abs(x) + Math.abs(z) < 1.5 * AR + m;
    const cells = [], bloodTint = new T.Color(1.15, 0.62, 0.58);
    for (let x = -10; x <= 10; x++) for (let z = -10; z <= 10; z++) if (inOct(x, z, 0.75)) cells.push({ x, z, y: Math.abs(x) < AR * 0.84 - 0.4 && Math.abs(z) < AR * 0.84 - 0.4 && Math.abs(x) + Math.abs(z) < 1.5 * AR * 0.84 - 0.6 ? -0.07 : 0, tint: null });
    tiles(s, cells, 'stone', [0.4, 0.37, 0.35]);
    { // the fighting ground is sand: raked, scuffed and stained, laid inside a border of dark flagstones with an iron gutter round it
      const k = 0.84, V0 = [[AR, -AR / 2], [AR, AR / 2], [AR / 2, AR], [-AR / 2, AR], [-AR, AR / 2], [-AR, -AR / 2], [-AR / 2, -AR], [AR / 2, -AR]], sh = new T.Shape(); V0.forEach((v, i) => { const x = v[0] * k, y = -v[1] * k; if (i) sh.lineTo(x, y); else sh.moveTo(x, y); });
      const geo = new T.ShapeGeometry(sh), uv = geo.attributes.uv, pos = geo.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / (AR * 2) + 0.5, pos.getY(i) / (AR * 2) + 0.5);
      const sd = new T.Mesh(geo, new T.MeshLambertMaterial({ map: sand(), color: 0xc4aa84, polygonOffset: true, polygonOffsetFactor: -1 })); sd.rotation.x = -Math.PI / 2; sd.position.y = 0.007; sd.receiveShadow = true; s.add(sd);
      const iron2 = gfx.lambert(0x141214); for (let i = 0; i < 8; i++) { const a = V0[i], b = V0[(i + 1) % 8], mx = (a[0] + b[0]) / 2 * k, mz = (a[1] + b[1]) / 2 * k, dx = b[0] - a[0], dz = b[1] - a[1], g2 = box(Math.hypot(dx, dz) * k + 0.1, 0.03, 0.16, iron2, mx, 0.012, mz, s); g2.rotation.y = -Math.atan2(dz, dx); g2.castShadow = false; } }
    { const apron = []; for (let x = -9; x <= 19; x++) for (let z = -9; z <= 19; z++) if (!inOct(x, z, 0.75) && x + z > -3 && Math.hypot(x, z) < 21) apron.push({ x, z, y: -0.04 }); tiles(s, apron, 'stone', [0.36, 0.33, 0.31]); }       // the walkway on the open side: dark, lower, and not a void
    for (let i = 0; i < 9; i++) { const d = gfx.decal(gfx.tex('blood'), R(1.6, 3.2), 0xffffff, R(0.35, 0.6)); d.position.set(R(-5, 5), 0.012 + i * 0.001, R(-5, 5)); d.rotation.z = R(0, 6); s.add(d); }
    const sig = gfx.decal(gfx.tex('sigil'), 7.5, 0xff6a30, 0.16, true); sig.position.y = 0.03; s.add(sig);

    const V = [[AR, -AR / 2], [AR, AR / 2], [AR / 2, AR], [-AR / 2, AR], [-AR, AR / 2], [-AR, -AR / 2], [-AR / 2, -AR], [AR / 2, -AR]];
    const mkAsh = (c, rx) => { const t = ashlar().clone(); t.needsUpdate = true; t.repeat.set(rx, 1); return new T.MeshLambertMaterial({ color: c, map: t, flatShading: true }); };
    const mat = mkAsh(0xa39a90, 2), matDark = mkAsh(0x6f6860, 2), crowdSpots = [], cineG = new T.Group(); cineG.visible = false; s.add(cineG);
    for (let i = 0; i < 8; i++) {
      const a = V[i], b = V[(i + 1) % 8], mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
      const nl = Math.hypot(mx, mz), nx = mx / nl, nz = mz / nl, rot = -Math.atan2(dz, dx), near = nx + nz > 0.5;
      if (near) { const w = wall(s, L + 0.5, 0.42, 0.7, mat); w.position.set(mx + nx * 0.95, 0, mz + nz * 0.95); w.rotation.y = rot;
        const cw = wall(cineG, L + 1.1, 3.4, 1, mat); cw.position.set(mx + nx * 1.6, 0, mz + nz * 1.6); cw.rotation.y = rot; const cb = wall(cineG, L + 5.4, 5.2, 1, matDark); cb.position.set(mx + nx * 5.2, 3.4, mz + nz * 5.2); cb.rotation.y = rot;
        const tx = dx / L, tz = dz / L; [-2.2, 2.2].forEach(u => { const m = new T.Mesh(new T.PlaneGeometry(1.25, 2.5), new T.MeshLambertMaterial({ map: gfx.bannerTex('#7a1c22', '#d9a93c'), transparent: true, alphaTest: 0.5, side: T.DoubleSide })); m.position.set(mx + nx * 1.05 + tx * u, 2.05, mz + nz * 1.05 + tz * u); m.rotation.y = Math.atan2(-nx, -nz); cineG.add(m); });
        [0, -3.6, 3.6].forEach(u => { const fx = mx + nx * 1.0 + tx * u, fz = mz + nz * 1.0 + tz * u; box(0.1, 0.5, 0.1, gfx.lambert(0x1c1a1e), fx, 1.7, fz, cineG); const fl = new T.Mesh(new T.ConeGeometry(0.11, 0.34, 5), new T.MeshBasicMaterial({ color: 0xffa040 })); fl.position.set(fx, 2.12, fz); cineG.add(fl); });
        const cl = new T.PointLight(0xff9a50, 5, 9, 1.6); cl.position.set(mx + nx * 0.2, 2.2, mz + nz * 0.2); cineG.add(cl); continue; }
      const H = 3.4;
      const w = wall(s, L + 1.1, H, 1, mat); w.position.set(mx + nx * 1.1, 0, mz + nz * 1.1); w.rotation.y = rot;
      { const pl = box(L + 1.0, 0.42, 0.34, matDark, mx + nx * 0.5, 0.21, mz + nz * 0.5, s); pl.rotation.y = rot; const sc2 = box(L + 1.0, 0.14, 0.16, matDark, mx + nx * 0.56, 1.02, mz + nz * 0.56, s); sc2.rotation.y = rot; const cp = box(L + 1.0, 0.2, 0.3, matDark, mx + nx * 0.52, 3.3, mz + nz * 0.52, s); cp.rotation.y = rot; }
      const walk = box(L + 3.2, 0.36, 3.4, matDark, mx + nx * 3.2, H + 0.1, mz + nz * 3.2, s); walk.rotation.y = rot;
      const rail = box(L + 1.6, 0.5, 0.2, matDark, mx + nx * 1.75, H + 0.5, mz + nz * 1.75, s); rail.rotation.y = rot;
      const back = wall(s, L + 5.4, 5.2, 1, matDark); back.position.set(mx + nx * 5.2, H, mz + nz * 5.2); back.rotation.y = rot;
      const tx = dx / L, tz = dz / L, n = Math.floor(L / 0.62);
      for (let k = 0; k < n; k++) for (let row = 0; row < 2; row++) { if (Math.random() < 0.18) continue; const u = (k + 0.5) / n - 0.5; crowdSpots.push([mx + nx * (2.5 + row * 0.9) + tx * u * (L + row), H + 0.28 + row * 0.22, mz + nz * (2.5 + row * 0.9) + tz * u * (L + row)]); }
      // banners + torches on the wall face
      const face = (u, y) => [mx + nx * 0.58 + tx * u, y, mz + nz * 0.58 + tz * u];
      const ban = (u, bg) => { const p = face(u, 2.05); const m = new T.Mesh(new T.PlaneGeometry(1.25, 2.5), new T.MeshLambertMaterial({ map: gfx.bannerTex(bg, '#d9a93c'), transparent: true, alphaTest: 0.5, side: T.DoubleSide })); m.position.set(p[0], p[1], p[2]); m.rotation.y = Math.atan2(-nx, -nz); s.add(m); };
      const torch = (u) => { const p = face(u, 1.9); box(0.1, 0.5, 0.1, gfx.lambert(0x1c1a1e), p[0], p[1] - 0.2, p[2], s); gfx.fire(s, p[0] - nx * 0.15, p[1] + 0.1, p[2] - nz * 0.15, 0xff8a30, 0.5, 0); };
      if (i === 5) {            // the far wall facing the camera: the gate
        const gp = face(0, 1.35); const gate = box(2.3, 2.7, 0.3, new T.MeshBasicMaterial({ color: 0x030203 }), gp[0], gp[1], gp[2], s); gate.rotation.y = rot; gate.castShadow = false;
        for (let k = -4; k <= 4; k++) { const bp = face(k * 0.25, 1.35); mesh(new T.CylinderGeometry(0.035, 0.035, 2.7, 4), gfx.lambert(0x26232a), bp[0] - nx * 0.18, bp[1], bp[2] - nz * 0.18, s); }
        ban(-2.1, '#5a1f7a'); ban(2.1, '#5a1f7a'); torch(-1.35); torch(1.35);
      } else if (i === 4 || i === 6) { ban(-2.4, '#7a1c22'); ban(2.4, '#7a1c22'); torch(0); torch(-3.6); torch(3.6); }
      else { ban(0, '#7a1c22'); torch(-1.8); torch(1.8); }
    }
    // pillars and braziers at the corners
    V.forEach((v, i) => {
      const x = v[0] * 1.1, z = v[1] * 1.1, far = i >= 3 || i === 0;
      if (far) {
        box(1.3, 4.9, 1.3, mat, x, 2.45, z, s); box(1.6, 0.3, 1.6, matDark, x, 5.05, z, s); box(1.55, 0.4, 1.55, matDark, x, 0.2, z, s);
        gfx.fire(s, x, 5.5, z, 0xff8a30, 1.1, (i === 5 || i === 6) ? 40 : (i === 4 || i === 7) ? 26 : 0);
        mesh(new T.CylinderGeometry(0.55, 0.3, 0.3, 8), gfx.lambert(0x1c1a1e), x, 5.35, z, s);
      } else { box(1.0, 0.9, 1.0, mat, x, 0.45, z, s); brazier(s, x, 0.9, z, 30); }
    });
    // chandelier, chains, light shafts, racks and the leavings of earlier bouts
    const ironM = gfx.lambert(0x1c1a1e), boneM = gfx.lambert(0xcfc6ae), steelM = new T.MeshPhongMaterial({ color: 0xaab2bc, shininess: 60, flatShading: true });
    const seg = (a, b, r) => { const d = new T.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), m = new T.Mesh(new T.CylinderGeometry(r, r, d.length(), 5), ironM); m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); s.add(m); };
    const chand = new T.Mesh(new T.TorusGeometry(2.2, 0.12, 6, 16), ironM); chand.rotation.x = Math.PI / 2; chand.position.y = 8.6; s.add(chand);
    for (let i = 0; i < 6; i++) { const a = i * 1.047; gfx.fire(s, Math.cos(a) * 2.2, 8.7, Math.sin(a) * 2.2, 0xffa050, 0.45, 0); seg([Math.cos(a) * 2.2, 8.6, Math.sin(a) * 2.2], [0, 12, 0], 0.03); }
    const chandL = new T.PointLight(0xffb070, 26, 24, 1.3); chandL.position.set(0, 8, 0); s.add(chandL);
    [3, 4, 5, 6, 7, 0].forEach(i => { const v = V[i], top = [v[0] * 1.1, 5.2, v[1] * 1.1]; let p0 = top; for (let k = 1; k <= 6; k++) { const u = k / 6, p1 = [lerp3(top[0], 0, u * 0.8), 5.2 + u * 3.4 - Math.sin(u * Math.PI) * 1.6, lerp3(top[2], 0, u * 0.8)]; seg(p0, p1, 0.045); p0 = p1; } });
    [[-3, -3], [2.5, -4], [-4.5, 1.5]].forEach((q, i) => { const m = new T.Mesh(new T.ConeGeometry(2.4, 13, 12, 1, true), new T.MeshBasicMaterial({ color: 0xffd8a0, transparent: true, opacity: 0.035, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); m.position.set(q[0], 6.5, q[1]); m.rotation.z = 0.08 * (i - 1); s.add(m); });
    for (let i = 0; i < 18; i++) {                         // bones, skulls and a dropped blade or two along the walls
      const a = R(0, 6.28), r = R(6.6, 7.8), x = Math.cos(a) * r, z = Math.sin(a) * r; if (!inOct(x, z, -0.5)) continue;
      if (i % 3 === 0) { const sk = mesh(new T.SphereGeometry(0.16, 6, 5), boneM, x, 0.14, z, s); sk.scale.set(1, 0.85, 1.15); sk.rotation.y = R(0, 6); }
      else if (i % 3 === 1) { const b = box(0.5, 0.06, 0.07, boneM, x, 0.04, z, s); b.rotation.y = R(0, 3); }
      else { const b = box(0.07, 0.03, R(0.6, 1), steelM, x, 0.03, z, s); b.rotation.y = R(0, 3); }
    }
    [[-AR - 0.2, 2.6, 1.57], [-AR - 0.2, -2.6, 1.57], [2.6, -AR - 0.2, 0], [-2.6, -AR - 0.2, 0]].forEach(q => {
      // a spike wall is part of the wall: a stone buttress, an iron plate bolted into it, and the points driven through from behind
      const g = new T.Group(); g.position.set(q[0] - (q[2] ? 0.35 : 0), 0, q[1] - (q[2] ? 0 : 0.35)); g.rotation.y = q[2]; s.add(g);
      box(2.5, 2.9, 0.62, mat, 0, 1.45, 0.2, g); box(2.8, 0.32, 0.8, matDark, 0, 0.16, 0.24, g); box(2.8, 0.26, 0.76, matDark, 0, 3.0, 0.22, g); [-1.32, 1.32].forEach(x => box(0.26, 2.9, 0.74, matDark, x, 1.45, 0.24, g));
      box(2.05, 2.05, 0.09, ironM, 0, 1.38, 0.55, g); [[-0.93, 0.45], [0.93, 0.45], [-0.93, 2.3], [0.93, 2.3], [0, 0.45], [0, 2.3]].forEach(p => mesh(new T.SphereGeometry(0.07, 6, 5), steelM, p[0], p[1], 0.62, g));
      [0.78, 1.38, 1.98].forEach(y => box(2.05, 0.07, 0.05, steelM, 0, y - 0.3, 0.61, g));
      for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) { const x = -0.76 + k * 0.38 + (r % 2) * 0.12, y = 0.66 + r * 0.46, len = 0.62 + ((r * 5 + k) % 3) * 0.11; mesh(new T.CylinderGeometry(0.085, 0.1, 0.07, 6), ironM, x, y, 0.6, g).rotation.x = Math.PI / 2; const sp = mesh(new T.ConeGeometry(0.06, len, 5), steelM, x, y, 0.6 + len / 2, g); sp.rotation.x = Math.PI / 2; }
      { const st = new T.Mesh(new T.PlaneGeometry(1.5, 1.2), new T.MeshBasicMaterial({ map: gfx.tex('blood'), color: 0x7a1010, transparent: true, opacity: 0.75, depthWrite: false })); st.position.set(R(-0.2, 0.2), 0.95, 0.605); g.add(st); const pool = gfx.decal(gfx.tex('blood'), 2.2, 0x8a1a14, 0.6); pool.position.set(0, 0.016, 1.3); g.add(pool); }
    });
    // ---- what the last bouts left behind: set out fresh before each fight, and not always there
    const remG = new T.Group(); s.add(remG); const remains = [];
    { const skin = [0xc9977a, 0x7f9a62, 0x8a6a52, 0xb5564e].map(c => gfx.lambert(c)), gorem = gfx.lambert(0x6a0e0c), cloth = [0x4a4031, 0x3a3a50, 0x5a2a2a].map(c => gfx.lambert(c));
      const piece = fn => { const g = new T.Group(); fn(g); g.visible = false; const d = gfx.decal(gfx.tex('blood'), 1.5, 0x8a1a14, 0.7); d.position.y = -0.05; g.add(d); remG.add(g); remains.push(g); };
      for (let i = 0; i < 4; i++) piece(g => { const sk = skin[i % 4]; mesh(new T.SphereGeometry(0.17, 7, 6), sk, 0, 0.16, 0, g); if (i % 2) { const hm = mesh(new T.SphereGeometry(0.19, 7, 5, 0, 6.28, 0, 1.7), steelM, 0, 0.18, 0, g); hm.rotation.x = 0.4; } else box(0.3, 0.1, 0.2, gfx.lambert(0x2a1c10), 0, 0.27, -0.06, g); mesh(new T.CylinderGeometry(0.07, 0.09, 0.08, 6), gorem, 0, 0.02, 0.1, g); });
      for (let i = 0; i < 4; i++) piece(g => { const sk = skin[(i + 1) % 4]; const a1 = box(0.13, 0.11, 0.42, cloth[i % 3], 0, 0.07, 0, g); const a2 = box(0.11, 0.1, 0.38, sk, 0.06, 0.07, 0.36, g); a2.rotation.y = 0.5; box(0.13, 0.09, 0.14, sk, 0.14, 0.06, 0.58, g); mesh(new T.SphereGeometry(0.08, 6, 5), gorem, 0, 0.07, -0.22, g); });
      for (let i = 0; i < 3; i++) piece(g => { const l1 = box(0.17, 0.15, 0.5, cloth[(i + 1) % 3], 0, 0.09, 0, g); const l2 = box(0.15, 0.14, 0.46, cloth[(i + 1) % 3], -0.05, 0.09, 0.44, g); l2.rotation.y = -0.4; box(0.18, 0.12, 0.26, gfx.lambert(0x1c1410), -0.15, 0.07, 0.7, g); mesh(new T.SphereGeometry(0.1, 6, 5), gorem, 0, 0.09, -0.27, g); });
      for (let i = 0; i < 2; i++) piece(g => { box(0.5, 0.26, 0.6, cloth[i], 0, 0.14, 0, g); mesh(new T.SphereGeometry(0.2, 7, 5), gorem, 0, 0.16, -0.3, g).scale.y = 0.6; for (let k = 0; k < 4; k++) { const rb = mesh(new T.TorusGeometry(0.2, 0.022, 4, 8, Math.PI), boneM, 0, 0.2, -0.26 - k * 0.07, g); rb.rotation.z = 0; } });
      for (let i = 0; i < 3; i++) piece(g => { const sk = mesh(new T.SphereGeometry(0.16, 7, 6), boneM, 0, 0.14, 0, g); sk.scale.set(1, 0.9, 1.15); box(0.16, 0.08, 0.1, boneM, 0, 0.05, 0.12, g); [-0.06, 0.06].forEach(x => mesh(new T.SphereGeometry(0.04, 5, 4), ironM, x, 0.16, 0.14, g)); if (i) for (let k = 0; k < 3; k++) { const bn = box(0.4, 0.05, 0.06, boneM, R(-0.3, 0.3), 0.04, R(0.3, 0.6), g); bn.rotation.y = R(0, 3); } }); }
    const setRemains = n => { const pool = remains.slice().sort(() => Math.random() - 0.5); pool.forEach((g, i) => { g.visible = i < n; if (i >= n) return; let x = 0, z = 0; for (let k = 0; k < 12; k++) { const a = R(0, 6.28), r = R(2.6, 7.3); x = Math.cos(a) * r; z = Math.sin(a) * r; if (inOct(x, z, -0.9)) break; } g.position.set(x, 0.05, z); g.rotation.y = R(0, 6.28); }); };
    // shackles on the walls and a gibbet or two overhead
    [[-AR - 0.5, 0.2, 1.57], [0.2, -AR - 0.5, 0]].forEach(q => { const g = new T.Group(); g.position.set(q[0], 0, q[1]); g.rotation.y = q[2]; s.add(g); [-0.5, 0.5].forEach(x => { mesh(new T.TorusGeometry(0.09, 0.025, 5, 8), ironM, x, 2.3, 0.12, g); for (let k = 0; k < 5; k++) mesh(new T.TorusGeometry(0.05, 0.016, 4, 6), ironM, x, 2.16 - k * 0.11, 0.14, g).rotation.y = k % 2 ? 1.57 : 0; mesh(new T.TorusGeometry(0.08, 0.03, 5, 8), steelM, x, 1.58, 0.16, g).rotation.x = 1.57; }); });
    [[-5.6, -5.6], [6.3, -3.2]].forEach((q, i) => { const g = new T.Group(); g.position.set(q[0], 5.6 + i * 0.5, q[1]); s.add(g); for (let k = 0; k < 8; k++) { const a = k * 0.785; mesh(new T.CylinderGeometry(0.02, 0.02, 1.5, 4), ironM, Math.cos(a) * 0.38, 0, Math.sin(a) * 0.38, g); } [0.75, 0, -0.75].forEach(y => mesh(new T.TorusGeometry(0.38, 0.03, 5, 12), ironM, 0, y, 0, g).rotation.x = 1.57); mesh(new T.ConeGeometry(0.4, 0.3, 8), ironM, 0, 0.9, 0, g); mesh(new T.CylinderGeometry(0.02, 0.02, 3, 4), ironM, 0, 2.5, 0, g);
      const sk = mesh(new T.SphereGeometry(0.13, 6, 5), boneM, 0.05, 0.25, 0, g); sk.scale.y = 0.9; box(0.2, 0.5, 0.14, boneM, 0, -0.15, 0, g); box(0.07, 0.5, 0.07, boneM, 0.16, -0.5, 0.05, g).rotation.z = 0.5; });
    { const worn = new T.Mesh(new T.RingGeometry(3.2, 5.6, 40), new T.MeshBasicMaterial({ color: 0x1a1210, transparent: true, opacity: 0.16, depthWrite: false })); worn.rotation.x = -Math.PI / 2; worn.position.y = 0.011; s.add(worn); }
    [[5, 0], [-5, 0], [0, 5], [0, -5]].forEach(q => { const gr = box(0.9, 0.02, 0.9, new T.MeshBasicMaterial({ color: 0x08060a }), q[0], 0.012, q[1], s); gr.castShadow = false; for (let k = -1; k <= 1; k++) box(0.9, 0.03, 0.06, ironM, q[0], 0.02, q[1] + k * 0.28, s); });
    // crowd
    const n = crowdSpots.length, bodies = new T.InstancedMesh(new T.CapsuleGeometry(0.2, 0.45, 2, 6), new T.MeshLambertMaterial({ flatShading: true }), n), heads = new T.InstancedMesh(new T.SphereGeometry(0.16, 6, 5), new T.MeshLambertMaterial({ flatShading: true }), n);
    const ph = crowdSpots.map(() => R(0, 6.3)), skins = [0xc9977a, 0x7f9a62, 0xb5564e, 0xd8c3ae, 0x8a6a52];
    crowdSpots.forEach((p, i) => { col.setHSL(R(0, 1), 0.2, R(0.05, 0.12)); bodies.setColorAt(i, col); col.set(G.pick(skins)).multiplyScalar(0.3); heads.setColorAt(i, col); });
    s.add(bodies, heads);
    // ---- the garden: not the pit dressed up, but a different place on the same ground. Everything of the pit is put away while it stands.
    const pitSet = s.children.filter(o => engineSet.indexOf(o) < 0); let lifeSet = [];
    const gardenG = new T.Group(); gardenG.visible = false; s.add(gardenG); const bg0 = s.background, fog0 = s.fog; let perch = null, davidC = null, goldG = null;
    { const LM = (c, e) => new T.MeshLambertMaterial({ color: c, flatShading: true, emissive: e || 0x000000 }), marble = new T.MeshPhongMaterial({ color: 0xf2efe8, shininess: 40, flatShading: true, emissive: 0x2a2826 }), dummyG = new T.Object3D(), cG = new T.Color();
      const flatDisc = (r, c, y, seg) => { const m = new T.Mesh(new T.CircleGeometry(r, seg || 40), new T.MeshLambertMaterial({ color: c, polygonOffset: true, polygonOffsetFactor: -1 })); m.rotation.x = -Math.PI / 2; m.position.y = y; m.receiveShadow = true; gardenG.add(m); return m; };
      { // a lawn you can see the grass in: mottled, clovered, daisied
        const lt = canvasT(512, 512, (c, w, h) => { c.fillStyle = '#5f9a48'; c.fillRect(0, 0, w, h); for (let i = 0; i < 14000; i++) { const v = R(-26, 30) | 0; c.fillStyle = 'rgba(' + (88 + v) + ',' + (150 + v) + ',' + (70 + v) + ',0.6)'; c.fillRect(R(0, w), R(0, h), R(1, 2.5), R(2, 6)); }
          for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(40,90,36,' + R(0.06, 0.16) + ')'; c.beginPath(); c.ellipse(R(0, w), R(0, h), R(16, 60), R(12, 40), R(0, 3), 0, 6.3); c.fill(); }
          for (let i = 0; i < 260; i++) { const x = R(0, w), y = R(0, h); c.fillStyle = i % 5 ? '#ffffff' : '#ffe680'; c.beginPath(); c.arc(x, y, R(1, 2.2), 0, 6.3); c.fill(); } });
        lt.colorSpace = T.SRGBColorSpace; lt.repeat.set(26, 26); const lawn = new T.Mesh(new T.CircleGeometry(70, 48), new T.MeshLambertMaterial({ map: lt, color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -1 })); lawn.rotation.x = -Math.PI / 2; lawn.position.y = 0.002; lawn.receiveShadow = true; gardenG.add(lawn); }
      { // sky: a dome that goes from deep blue overhead to a warm haze at the horizon, with a few clouds and far green hills
        const st = canvasT(8, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5f9fe0'); g.addColorStop(0.55, '#a9d2f2'); g.addColorStop(0.86, '#f6e6d4'); g.addColorStop(1, '#fff3e2'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
        const dg = new T.SphereGeometry(88, 24, 12, 0, 6.2832, 0, 1.62), dp = dg.attributes.position, dc = [], c0 = new T.Color(0x2f7fd8), c1 = new T.Color(0x8cc4f0), c2 = new T.Color(0xf4e2cc), ct = new T.Color();
        for (let i = 0; i < dp.count; i++) { const u = Math.max(0, Math.min(1, dp.getY(i) / 88)); if (u > 0.35) ct.copy(c1).lerp(c0, (u - 0.35) / 0.65); else ct.copy(c2).lerp(c1, u / 0.35); dc.push(ct.r, ct.g, ct.b); } dg.setAttribute('color', new T.Float32BufferAttribute(dc, 3));
        const dome = new T.Mesh(dg, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide, fog: false, depthWrite: false })); dome.renderOrder = -5; gardenG.add(dome);
        const cl = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, fog: false }); for (let i = 0; i < 14; i++) { const a = R(2.2, 5.7), r = R(58, 78), g = new T.Group(); g.position.set(Math.cos(a) * r, R(26, 44), Math.sin(a) * r); g.scale.setScalar(0.6); gardenG.add(g); for (let k = 0; k < 5; k++) { const m = new T.Mesh(new T.IcosahedronGeometry(R(3, 6), 1), cl); m.position.set(R(-7, 7), R(-1, 1), R(-3, 3)); m.scale.y = 0.45; g.add(m); } }
        const hillM = [0x5c9450, 0x4f8548, 0x6aa25c].map(c => new T.MeshLambertMaterial({ color: c, flatShading: true })); for (let i = 0; i < 18; i++) { const a = i / 18 * 6.2832 + R(-0.1, 0.1), r = R(46, 62), m = new T.Mesh(new T.SphereGeometry(R(10, 18), 10, 6, 0, 6.2832, 0, 1.5708), hillM[i % 3]); m.position.set(Math.cos(a) * r, -1, Math.sin(a) * r); m.scale.y = R(0.3, 0.6); gardenG.add(m); } }
      { // tufts of longer grass and fallen petals, so the ground is not a flat colour up close
        const NT = 700, tuft = new T.InstancedMesh(new T.ConeGeometry(0.05, 0.22, 3), LM(0x4f8a40), NT), NP = 500, pet = new T.InstancedMesh(new T.CircleGeometry(0.06, 5), new T.MeshLambertMaterial({ side: T.DoubleSide, emissive: 0x30181c }), NP);
        for (let i = 0; i < NT; i++) { const a = R(0, 6.28), r = i < 180 ? R(1.8, 8) : R(9.8, 26), x = Math.cos(a) * r, z = Math.sin(a) * r; dummyG.position.set(x, 0.1, z); dummyG.rotation.set(R(-0.3, 0.3), R(0, 3), R(-0.3, 0.3)); dummyG.scale.set(R(0.8, 1.6), i < 180 ? R(0.5, 0.9) : R(0.9, 2.2), R(0.8, 1.6)); dummyG.updateMatrix(); tuft.setMatrixAt(i, dummyG.matrix); }
        for (let i = 0; i < NP; i++) { const a = R(0, 6.28), r = R(0, 13); dummyG.position.set(Math.cos(a) * r, 0.012 + i * 0.00002, Math.sin(a) * r); dummyG.rotation.set(-Math.PI / 2 + R(-0.2, 0.2), 0, R(0, 6)); dummyG.scale.set(R(0.7, 1.5), R(0.5, 1), 1); dummyG.updateMatrix(); pet.setMatrixAt(i, dummyG.matrix); cG.set(i % 3 ? 0xf9cfe0 : 0xffffff); pet.setColorAt(i, cG); } tuft.castShadow = false; pet.castShadow = false; gardenG.add(tuft, pet); }
      { // lilies on the pool, urns on the walk, and two rose arches into the lawn
        for (let i = 0; i < 7; i++) { const a = R(0, 6.28), r = R(0.2, 0.95), pad = new T.Mesh(new T.CircleGeometry(R(0.14, 0.24), 8, 0.4, 5.6), new T.MeshLambertMaterial({ color: 0x3f8a48, polygonOffset: true, polygonOffsetFactor: -6 })); pad.rotation.x = -Math.PI / 2; pad.rotation.z = R(0, 6); pad.position.set(Math.cos(a) * r, 0.011, Math.sin(a) * r); gardenG.add(pad); if (i % 2) mesh(new T.ConeGeometry(0.07, 0.1, 6), LM(i % 4 === 1 ? 0xffffff : 0xf7a8c8, 0x302028), pad.position.x, 0.06, pad.position.z, gardenG).rotation.x = Math.PI; }
        V.forEach((v, i) => { const x = v[0] * 1.05, z = v[1] * 1.05; if (x + z > 4) return; const u = mesh(new T.CylinderGeometry(0.26, 0.14, 0.34, 8), marble, x, 1.62, z, gardenG); for (let k = 0; k < 6; k++) mesh(new T.IcosahedronGeometry(R(0.1, 0.17), 0), LM([0xff8aa8, 0xffffff, 0xc9a6ff, 0xffd36b][k % 4], 0x281018), x + R(-0.2, 0.2), 1.86 + R(0, 0.16), z + R(-0.2, 0.2), gardenG); });
        const roseM = [0xe0406a, 0xff8aa8, 0xffffff].map(c => LM(c, 0x30101a)), vine = LM(0x3f7a3a);
        [[-9.4, 2.2, 1.57], [2.2, -9.4, 0]].forEach(q => { const g = new T.Group(); g.position.set(q[0], 0, q[1]); g.rotation.y = q[2]; gardenG.add(g); [-1.1, 1.1].forEach(x => mesh(new T.CylinderGeometry(0.09, 0.11, 2.4, 6), marble, x, 1.2, 0, g)); const ar = mesh(new T.TorusGeometry(1.1, 0.09, 6, 14, Math.PI), vine, 0, 2.4, 0, g);
          for (let k = 0; k < 26; k++) { const t = k / 25 * Math.PI, onArch = k % 3 !== 0, x = onArch ? Math.cos(t) * 1.1 : (k % 2 ? 1.1 : -1.1), y = onArch ? 2.4 + Math.sin(t) * 1.1 : R(0.4, 2.3); mesh(new T.IcosahedronGeometry(R(0.11, 0.2), 0), roseM[k % 3], x + R(-0.1, 0.1), y + R(-0.08, 0.08), R(-0.16, 0.16), g); if (k % 2) mesh(new T.IcosahedronGeometry(R(0.14, 0.22), 0), vine, x + R(-0.12, 0.12), y + R(-0.1, 0.1), R(-0.18, 0.18), g); } }); }
      if (0) flatDisc(60, 0x6fa653, 0.002, 48);                                                     // the lawn, out to the horizon
      for (let i = 0; i < 9; i++) { const st = new T.Mesh(new T.PlaneGeometry(26, 1.25), new T.MeshLambertMaterial({ color: 0x7db55f, polygonOffset: true, polygonOffsetFactor: -2 })); st.rotation.x = -Math.PI / 2; st.rotation.z = 0.785; st.position.set((i - 4) * 1.77, 0.004, -(i - 4) * 1.77); st.receiveShadow = true; gardenG.add(st); }       // mown stripes
      { const path = new T.Mesh(new T.RingGeometry(8.5, 9.7, 48), new T.MeshLambertMaterial({ map: (() => { const t = canvasT(128, 128, (c, w, h) => { c.fillStyle = '#e2d6bc'; c.fillRect(0, 0, w, h); for (let i = 0; i < 1600; i++) { const v = R(-34, 22) | 0; c.fillStyle = 'rgb(' + (224 + v) + ',' + (212 + v) + ',' + (188 + v) + ')'; c.fillRect(R(0, w), R(0, h), R(1, 4), R(1, 4)); } }); t.colorSpace = T.SRGBColorSpace; t.repeat.set(14, 14); return t; })(), color: 0xffffff, polygonOffset: true, polygonOffsetFactor: -3 })); path.rotation.x = -Math.PI / 2; path.position.y = 0.006; path.receiveShadow = true; gardenG.add(path); }       // a pale gravel walk round the lawn
      { const pool = new T.Mesh(new T.CircleGeometry(1.25, 28), new T.MeshPhongMaterial({ color: 0x7fc4d8, shininess: 120, specular: 0xffffff, emissive: 0x1a3a48, polygonOffset: true, polygonOffsetFactor: -4 })); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.008; gardenG.add(pool); const rim = new T.Mesh(new T.RingGeometry(1.25, 1.5, 28), new T.MeshLambertMaterial({ color: 0xf2efe8, polygonOffset: true, polygonOffsetFactor: -4 })); rim.rotation.x = -Math.PI / 2; rim.position.y = 0.009; gardenG.add(rim); }       // a lily pool, flush with the grass
      // a low marble balustrade where the pit wall was, so the ground you can stand on still reads
      for (let i = 0; i < 8; i++) { const a = V[i], b2 = V[(i + 1) % 8], mx = (a[0] + b2[0]) / 2, mz = (a[1] + b2[1]) / 2, dx = b2[0] - a[0], dz = b2[1] - a[1], L = Math.hypot(dx, dz), rot = -Math.atan2(dz, dx), near = mx + mz > 4;
        const g = new T.Group(); g.position.set(mx * 1.04, 0, mz * 1.04); g.rotation.y = rot; gardenG.add(g); box(L, 0.16, 0.34, marble, 0, 0.08, 0, g); if (near) continue; box(L, 0.12, 0.3, marble, 0, 0.9, 0, g); const n = Math.floor(L / 0.42); for (let k = 0; k < n; k++) mesh(new T.CylinderGeometry(0.06, 0.09, 0.7, 6), marble, (k + 0.5) / n * L - L / 2, 0.5, 0, g); }
      V.forEach((v, i) => { const x = v[0] * 1.05, z = v[1] * 1.05; box(0.5, x + z > 4 ? 0.3 : 1.15, 0.5, marble, x, x + z > 4 ? 0.15 : 0.575, z, gardenG); if (x + z <= 4) { mesh(new T.SphereGeometry(0.2, 8, 6), marble, x, 1.3, z, gardenG); } });
      // flower beds along the far balustrade: thousands of blooms, a few shapes
      const cols = [0xf7c6d8, 0xffffff, 0xf2a0c0, 0xffe2a8, 0xc9a6ff, 0xff8a8a, 0xfff3b0], N = 900, bloom = new T.InstancedMesh(new T.ConeGeometry(0.075, 0.17, 5), new T.MeshLambertMaterial({ flatShading: true, emissive: 0x201014 }), N), stem = new T.InstancedMesh(new T.CylinderGeometry(0.012, 0.012, 0.3, 3), LM(0x4f8a40), N);
      for (let i = 0; i < N; i++) { let x, z; if (i < 520) { const a = R(0, 6.28), r = R(9.9, 12.6); x = Math.cos(a) * r; z = Math.sin(a) * r; if (x + z > 7) { x = -x; z = -z; } } else { const a = R(0, 6.28), r = R(1.7, 7.9); x = Math.cos(a) * r; z = Math.sin(a) * r; }
        const h = i < 520 ? R(0.22, 0.5) : R(0.06, 0.14); dummyG.position.set(x, h, z); dummyG.rotation.set(Math.PI + R(-0.3, 0.3), R(0, 3), R(-0.3, 0.3)); dummyG.scale.setScalar(i < 520 ? R(0.9, 1.9) : R(0.5, 0.9)); dummyG.updateMatrix(); bloom.setMatrixAt(i, dummyG.matrix); cG.set(cols[Math.floor(R(0, cols.length))]); bloom.setColorAt(i, cG);
        dummyG.position.set(x, h / 2, z); dummyG.rotation.set(0, 0, 0); dummyG.scale.set(1, h / 0.3, 1); dummyG.updateMatrix(); stem.setMatrixAt(i, dummyG.matrix); } gardenG.add(bloom, stem);
      // clipped box hedges and topiary behind the beds
      const hedgeM = LM(0x3f7a3a), hedgeD = LM(0x2f6230);
      for (let i = 0; i < 20; i++) { const a = i / 20 * 6.2832, r = 13.4, x = Math.cos(a) * r, z = Math.sin(a) * r; if (x + z > 6 || (x < -6 && z < -6)) continue; const hb = box(3.9, 1.5, 1.1, i % 2 ? hedgeM : hedgeD, x, 0.75, z, gardenG); hb.rotation.y = -a + Math.PI / 2; if (i % 3 === 0) { mesh(new T.ConeGeometry(0.7, 1.9, 7), hedgeD, x * 0.94, 2.4, z * 0.94, gardenG); } else if (i % 3 === 1) { mesh(new T.IcosahedronGeometry(0.62, 1), hedgeM, x * 0.94, 2.1, z * 0.94, gardenG); } }
      // blossom trees, close behind the hedge and standing off into the distance
      const bark = LM(0x4a3424), leafM = [0xf4b8d0, 0xfbe4ee, 0xe890b4, 0xffffff].map(c => LM(c, 0x3a1420));
      const tree = (x, z, h, sc) => { const tr = new T.Group(); tr.position.set(x, 0, z); tr.scale.setScalar(sc); gardenG.add(tr); const tk = mesh(new T.CylinderGeometry(0.16, 0.32, h, 6), bark, 0, h / 2, 0, tr); tk.rotation.z = R(-0.1, 0.1); for (let k = 0; k < 3; k++) { const br = mesh(new T.CylinderGeometry(0.05, 0.1, 1.6, 5), bark, R(-0.5, 0.5), h - 0.3, R(-0.5, 0.5), tr); br.rotation.set(R(-0.7, 0.7), 0, R(-0.7, 0.7)); } for (let k = 0; k < 7; k++) { const cn = mesh(new T.IcosahedronGeometry(R(1.1, 1.9), 0), leafM[Math.floor(R(0, 4))], R(-1.7, 1.7), h + R(-0.2, 1.8), R(-1.7, 1.7), tr); cn.scale.y = 0.72; } };
      for (let i = 0; i < 46; i++) { const ring = i % 3, a = R(0, 6.28), r = 15.5 + ring * 5 + R(0, 3), x = Math.cos(a) * r, z = Math.sin(a) * r; if (x + z > 5 || (x < -4 && z < -4)) continue; tree(x, z, R(3.2, 5.4), 1 + ring * 0.25); }
      // this is his realm, and he is the size he thinks he is: a giant on a gold throne that fills the far corner, with nothing in front of his face
      { const g = new T.Group(); g.position.set(-9.8, 0, -9.8); g.rotation.y = 0.785; g.scale.setScalar(0.55); gardenG.add(g);
        const gold = new T.MeshPhongMaterial({ color: 0xf6cf5a, emissive: 0x7a5208, shininess: 160, specular: 0xfff4c8, flatShading: true }), gem = c => new T.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.35, shininess: 200, flatShading: true }), velvet = LM(0x7a1030, 0x200810);
        mesh(new T.CylinderGeometry(7.2, 8.0, 1.0, 20), gold, 0, 0.5, 0, g); mesh(new T.CylinderGeometry(6.0, 6.6, 0.8, 20), marble, 0, 1.4, 0, g); mesh(new T.CylinderGeometry(4.9, 5.4, 0.8, 20), gold, 0, 2.2, 0, g);       // three steps of dais
        box(6.4, 1.4, 5.2, gold, 0, 3.3, -0.4, g); box(5.6, 0.5, 4.4, velvet, 0, 4.2, -0.2, g); box(6.8, 9.5, 1.2, gold, 0, 8.6, -3.0, g); box(5.4, 7.6, 0.4, velvet, 0, 8.4, -2.3, g);       // seat and back
        [-3.4, 3.4].forEach(x => { box(1.1, 3.0, 5.0, gold, x, 5.3, -0.3, g); mesh(new T.SphereGeometry(0.9, 10, 8), gem(x < 0 ? 0xd02040 : 0x2060d0), x, 7.2, 2.0, g); mesh(new T.ConeGeometry(0.7, 2.4, 6), gold, x, 14.6, -3.0, g); });
        mesh(new T.ConeGeometry(1.5, 3.4, 6), gold, 0, 15.1, -3.0, g); mesh(new T.SphereGeometry(0.8, 10, 8), gem(0x30c060), 0, 13.0, -2.3, g); { const sunb = mesh(new T.TorusGeometry(4.6, 0.3, 6, 24), gold, 0, 11.4, -3.7, g); for (let k = 0; k < 16; k++) { const a2 = k * 0.3927, ry = mesh(new T.ConeGeometry(0.35, 2.6, 4), gold, Math.cos(a2) * 5.9, 11.4 + Math.sin(a2) * 5.9, -3.7, g); ry.rotation.z = a2 - Math.PI / 2; } }
        [[-10, 3, 4.6, 5.6], [10, 2, 5.2, 6.4], [-7.4, 8.4, 3.4, 4.0], [7.8, 8.0, 3.8, 4.4], [-13.5, -1, 3.6, 4.6], [13.4, -2, 3.2, 3.8], [0, 10.5, 2.6, 2.4], [-3.6, 10.2, 1.8, 1.6], [4.2, 10.4, 2.0, 1.8]].forEach(q => mesh(new T.ConeGeometry(q[2], q[3], 10), gold, q[0], q[3] / 2, q[1], g));       // hills of it
        const cn = new T.InstancedMesh(new T.CylinderGeometry(0.16, 0.16, 0.05, 7), gold, 700); for (let i = 0; i < 700; i++) { const a2 = R(0, 3.14), r2 = R(5, 15); dummyG.position.set(Math.cos(a2) * r2, R(0.04, 0.9) * (r2 < 11 ? 1 : 0.15), Math.sin(a2) * r2 * 0.85 + 1); dummyG.rotation.set(R(-0.8, 0.8), R(0, 3), R(-0.8, 0.8)); dummyG.scale.setScalar(R(0.8, 1.6)); dummyG.updateMatrix(); cn.setMatrixAt(i, dummyG.matrix); } g.add(cn);
        [[-5.2, 8.6], [5.6, 8.9], [-9.4, 6.2], [9.6, 5.8]].forEach((q, i) => { box(2.0, 1.1, 1.3, LM(0x4a2e1a), q[0], 0.55, q[1], g); box(2.1, 0.2, 1.4, gold, q[0], 1.15, q[1], g); mesh(new T.SphereGeometry(0.8, 8, 5, 0, 6.28, 0, 1.3), gold, q[0], 1.1, q[1], g).scale.y = 0.6; mesh(new T.SphereGeometry(0.26, 8, 6), gem([0xd02040, 0x2060d0, 0x30c060, 0xc040d0][i]), q[0] + 0.3, 1.7, q[1], g); });
        // statues of himself, in gold, pointing at himself; and banners with his clock on
        [-8.6, 8.6].forEach(x => { const sg = new T.Group(); sg.position.set(x, 0, 3.6); sg.rotation.y = x < 0 ? 0.5 : -0.5; g.add(sg); mesh(new T.CylinderGeometry(1.0, 1.2, 1.6, 8), marble, 0, 0.8, 0, sg); mesh(new T.CylinderGeometry(0.5, 0.75, 2.6, 8), gold, 0, 2.9, 0, sg); mesh(new T.SphereGeometry(0.48, 8, 6), gold, 0, 4.6, 0, sg); mesh(new T.ConeGeometry(0.5, 0.5, 6), gold, 0, 5.2, 0, sg); const arm = box(0.26, 1.6, 0.26, gold, 0.7, 4.3, 0.2, sg); arm.rotation.z = -1.0; });
        [-5.6, 5.6].forEach(x => { mesh(new T.CylinderGeometry(0.14, 0.14, 13, 6), gold, x, 6.5, -4.2, g); const bn = new T.Mesh(new T.PlaneGeometry(2.6, 6.4), new T.MeshLambertMaterial({ color: 0x1a3a9a, emissive: 0x0a1640, side: T.DoubleSide })); bn.position.set(x + (x < 0 ? -1.5 : 1.5), 9.4, -4.1); g.add(bn); mesh(new T.TorusGeometry(0.7, 0.12, 6, 14), gold, x + (x < 0 ? -1.5 : 1.5), 10.4, -4.0, g); });
        const gl = new T.PointLight(0xffd070, 40, 30, 1.3); gl.position.set(0, 9, 6); g.add(gl); const gl2 = new T.PointLight(0xffe9a0, 20, 22, 1.4); gl2.position.set(0, 3, 9); g.add(gl2);
        perch = new T.Group(); perch.position.set(0, 4.45, 0.2); perch.scale.setScalar(4.6); g.add(perch); goldG = g; }
      [[-11.5, 1.5], [1.5, -11.5]].forEach((q, i) => { const g = new T.Group(); g.position.set(q[0], 0, q[1]); g.rotation.y = i ? 0 : 1.57; gardenG.add(g); box(0.8, 0.9, 0.8, marble, 0, 0.45, 0, g); mesh(new T.CylinderGeometry(0.2, 0.28, 1.1, 7), marble, 0, 1.45, 0, g); mesh(new T.SphereGeometry(0.19, 8, 6), marble, 0, 2.2, 0, g); const arm = box(0.12, 0.7, 0.12, marble, 0.28, 1.7, 0.1, g); arm.rotation.z = -0.5; });
      // light: a high sun, a rose fill, and the white of a clear day
      const sun = new T.PointLight(0xfff0c8, 64, 60, 1.1); sun.position.set(6, 16, 8); gardenG.add(sun); gardenG.add(new T.AmbientLight(0xeef0ff, 0.82)); const rose = new T.PointLight(0xffb8d4, 18, 26, 1.4); rose.position.set(-7, 4, -7); gardenG.add(rose);
      gfx.glow(0xfff6d8, 13, -40, 36, -40, gardenG, 0.6); }
    const gardenSky = new T.Color(0x7fb6e8); const stash = v => pitSet.concat(lifeSet).forEach(o => { if (v) { if (o.userData._gv == null) o.userData._gv = o.visible; o.visible = false; } else if (o.userData._gv != null) { o.visible = o.userData._gv; o.userData._gv = null; } });
    let hypeNow = 0, life = null;
    const update = (t) => {
      if (!gardenG.visible && Math.random() < 0.3) { const a = R(0, 6.28), r = R(0, 7.5); gfx.emit(Math.cos(a) * r, R(0.3, 4.5), Math.sin(a) * r, R(-0.15, 0.15), R(0.05, 0.3), R(-0.15, 0.15), 3.5, 0xffd9a0, 0); }       // dust hanging in the torchlight
      if (gardenG.visible && davidC) { const dt2 = performance.now() / 1000, ph = (dt2 * 0.16) % 1; davidC.pose({ t: dt2, act: ph > 0.72 ? 'cheer' : 'sit' }); if (Math.random() < 0.5) gfx.emit(-9.8 + R(-3, 3), R(6, 9.5), -9.8 + R(-3, 3), R(-0.5, 0.5), -R(1.5, 3), R(-0.5, 0.5), 3, 0xf6cf5a, 0); }       // one clock for him whoever is calling, or he twitches; and it rains coin on him, because of course it does
      if (gardenG.visible) { if (Math.random() < 0.7) { const a = R(0, 6.28), r = R(0, 11); gfx.emit(Math.cos(a) * r, R(3, 7), Math.sin(a) * r, R(-0.5, 0.2), -R(0.4, 1.0), R(-0.5, 0.2), 5, Math.random() < 0.5 ? 0xf7c6d8 : 0xffffff, 0); } if (Math.random() < 0.08) { const a = R(0, 6.28), r = R(2, 9); gfx.emit(Math.cos(a) * r, R(0.4, 1.6), Math.sin(a) * r, R(-0.8, 0.8), R(-0.1, 0.4), R(-0.8, 0.8), 2.5, [0xffe27a, 0x9fd0ff, 0xff9ac0][Math.floor(R(0, 3))], 0); } }       // blossom coming down, and now and then a butterfly
      if (!life && W.arenaLife) { const n0 = s.children.length; life = W.arenaLife(s, AR, crowdSpots); lifeSet = s.children.slice(n0); if (gardenG.visible) stash(true); }
      if (life) life(t, hypeNow);
      const amp = 0.03 + hypeNow * 0.2;
      for (let i = 0; i < n; i++) {
        const p = crowdSpots[i], y = p[1] + Math.abs(Math.sin(t * (3 + (i % 5) * 0.6) + ph[i])) * amp;
        dummy.position.set(p[0], y + 0.42, p[2]); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); bodies.setMatrixAt(i, dummy.matrix);
        dummy.position.y = y + 0.95; dummy.updateMatrix(); heads.setMatrixAt(i, dummy.matrix);
      }
      bodies.instanceMatrix.needsUpdate = true; heads.instanceMatrix.needsUpdate = true;
      sig.material.opacity = 0.13 + Math.sin(t * 1.5) * 0.04 + hypeNow * 0.12;
      if (Math.random() < 0.25) gfx.emit(R(-8, 8), R(0.5, 4), R(-8, 8), R(-0.2, 0.2), R(0.1, 0.4), R(-0.2, 0.2), 2.2, 0x3a2a18, 0);
      if (hypeNow > 0.75 && n && Math.random() < 0.35) { const p = crowdSpots[Math.floor(Math.random() * n)]; gfx.emit(p[0], p[1] + 1, p[2], -p[0] * R(0.25, 0.5), R(2, 4), -p[2] * R(0.25, 0.5), 1.4, 0xffd36b, 9); }
    };
    update(0);
    return { scene: s, update, remains: n => setRemains(n | 0), garden: v => { v = !!v; if (v === gardenG.visible) return; gardenG.visible = v; if (v && perch && !davidC && G.oracle && G.oracle.look) { davidC = G.makeChar(G.oracle.look()); perch.add(davidC.root); } stash(v); s.background = v ? gardenSky : bg0; s.fog = v ? new T.Fog(0xe4eef4, 96, 190) : fog0; }, inGarden: () => gardenG.visible, cineWall: v => { cineG.visible = !!v && !gardenG.visible; }, setHype: h => { hypeNow = h; }, flash: new T.PointLight(0xffffff, 0, 14, 1.4) };
  }

  W.get = function (name) {
    if (!W.cache[name]) W.cache[name] = name === 'arena' ? buildArena() : name === 'hub' ? W.buildHub() : W.buildHideout();
    return W.cache[name];
  };
  W.AR = AR;
})();
