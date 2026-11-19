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
    const s = gfx.newScene({ ambient: 1.25, key: 1.5, shadowSize: 13, sky: 0x8a8cb8, ground: 0x2a2018, keyColor: 0xffe6cc });
    s.fog = new T.Fog(0x07060a, 76, 112);
    const inOct = (x, z, m) => Math.abs(x) < AR + m && Math.abs(z) < AR + m && Math.abs(x) + Math.abs(z) < 1.5 * AR + m;
    const cells = [], bloodTint = new T.Color(1.15, 0.62, 0.58);
    for (let x = -10; x <= 10; x++) for (let z = -10; z <= 10; z++) if (inOct(x, z, 0.75)) cells.push({ x, z, tint: (Math.hypot(x, z) < 5 && Math.random() < 0.09) ? bloodTint : null });
    tiles(s, cells, 'stone', [0.66, 0.63, 0.6]);
    { const apron = []; for (let x = -9; x <= 19; x++) for (let z = -9; z <= 19; z++) if (!inOct(x, z, 0.75) && x + z > -3 && Math.hypot(x, z) < 21) apron.push({ x, z, y: -0.04 }); tiles(s, apron, 'stone', [0.36, 0.33, 0.31]); }       // the walkway on the open side: dark, lower, and not a void
    for (let i = 0; i < 9; i++) { const d = gfx.decal(gfx.tex('blood'), R(1.6, 3.2), 0xffffff, R(0.35, 0.6)); d.position.set(R(-5, 5), 0.012 + i * 0.001, R(-5, 5)); d.rotation.z = R(0, 6); s.add(d); }
    const sig = gfx.decal(gfx.tex('sigil'), 7.5, 0xff6a30, 0.16, true); sig.position.y = 0.03; s.add(sig);

    const V = [[AR, -AR / 2], [AR, AR / 2], [AR / 2, AR], [-AR / 2, AR], [-AR, AR / 2], [-AR, -AR / 2], [-AR / 2, -AR], [AR / 2, -AR]];
    const mat = stoneMat(0x7a746e), matDark = stoneMat(0x57524e), crowdSpots = [], cineG = new T.Group(); cineG.visible = false; s.add(cineG);
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
    const chandL = new T.PointLight(0xffb070, 16, 22, 1.4); chandL.position.set(0, 8, 0); s.add(chandL);
    [3, 4, 5, 6, 7, 0].forEach(i => { const v = V[i], top = [v[0] * 1.1, 5.2, v[1] * 1.1]; let p0 = top; for (let k = 1; k <= 6; k++) { const u = k / 6, p1 = [lerp3(top[0], 0, u * 0.8), 5.2 + u * 3.4 - Math.sin(u * Math.PI) * 1.6, lerp3(top[2], 0, u * 0.8)]; seg(p0, p1, 0.045); p0 = p1; } });
    [[-3, -3], [2.5, -4], [-4.5, 1.5]].forEach((q, i) => { const m = new T.Mesh(new T.ConeGeometry(2.4, 13, 12, 1, true), new T.MeshBasicMaterial({ color: 0xffd8a0, transparent: true, opacity: 0.035, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); m.position.set(q[0], 6.5, q[1]); m.rotation.z = 0.08 * (i - 1); s.add(m); });
    for (let i = 0; i < 18; i++) {                         // bones, skulls and a dropped blade or two along the walls
      const a = R(0, 6.28), r = R(6.6, 7.8), x = Math.cos(a) * r, z = Math.sin(a) * r; if (!inOct(x, z, -0.5)) continue;
      if (i % 3 === 0) { const sk = mesh(new T.SphereGeometry(0.16, 6, 5), boneM, x, 0.14, z, s); sk.scale.set(1, 0.85, 1.15); sk.rotation.y = R(0, 6); }
      else if (i % 3 === 1) { const b = box(0.5, 0.06, 0.07, boneM, x, 0.04, z, s); b.rotation.y = R(0, 3); }
      else { const b = box(0.07, 0.03, R(0.6, 1), steelM, x, 0.03, z, s); b.rotation.y = R(0, 3); }
    }
    [[-AR - 0.2, 2.6, 1.57], [-AR - 0.2, -2.6, 1.57], [2.6, -AR - 0.2, 0], [-2.6, -AR - 0.2, 0]].forEach(q => {
      const g = new T.Group(); g.position.set(q[0] + (q[2] ? 0.72 : 0), 0, q[1] + (q[2] ? 0 : 0.72)); g.rotation.y = q[2]; s.add(g);
      box(1.7, 1.5, 0.14, ironM, 0, 1.05, -0.02, g); box(1.8, 0.1, 0.2, steelM, 0, 1.82, 0, g); box(1.8, 0.1, 0.2, steelM, 0, 0.28, 0, g);
      for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { const sp = mesh(new T.ConeGeometry(0.075, 0.95, 5), steelM, -0.6 + k * 0.4 + (r % 2) * 0.1, 0.6 + r * 0.45, 0.5, g); sp.rotation.x = Math.PI / 2; }       // points toward the sand
    });
    [[5, 0], [-5, 0], [0, 5], [0, -5]].forEach(q => { const gr = box(0.9, 0.02, 0.9, new T.MeshBasicMaterial({ color: 0x08060a }), q[0], 0.012, q[1], s); gr.castShadow = false; for (let k = -1; k <= 1; k++) box(0.9, 0.03, 0.06, ironM, q[0], 0.02, q[1] + k * 0.28, s); });
    // crowd
    const n = crowdSpots.length, bodies = new T.InstancedMesh(new T.CapsuleGeometry(0.2, 0.45, 2, 6), new T.MeshLambertMaterial({ flatShading: true }), n), heads = new T.InstancedMesh(new T.SphereGeometry(0.16, 6, 5), new T.MeshLambertMaterial({ flatShading: true }), n);
    const ph = crowdSpots.map(() => R(0, 6.3)), skins = [0xc9977a, 0x7f9a62, 0xb5564e, 0xd8c3ae, 0x8a6a52];
    crowdSpots.forEach((p, i) => { col.setHSL(R(0, 1), 0.2, R(0.05, 0.12)); bodies.setColorAt(i, col); col.set(G.pick(skins)).multiplyScalar(0.3); heads.setColorAt(i, col); });
    s.add(bodies, heads);
    let hypeNow = 0, life = null;
    const update = (t) => {
      if (!life && W.arenaLife) life = W.arenaLife(s, AR, crowdSpots);
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
    return { scene: s, update, cineWall: v => { cineG.visible = !!v; }, setHype: h => { hypeNow = h; }, flash: new T.PointLight(0xffffff, 0, 14, 1.4) };
  }

  W.get = function (name) {
    if (!W.cache[name]) W.cache[name] = name === 'arena' ? buildArena() : name === 'hub' ? W.buildHub() : W.buildHideout();
    return W.cache[name];
  };
  W.AR = AR;
})();
