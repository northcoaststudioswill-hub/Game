// Guttercrown — the small moving things: rats, bats, laundry, buskers, the Wisp Table booth, and the dressing of the pit
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, box = gfx.box, mesh = gfx.mesh;
  const R = (a, b) => a + Math.random() * (b - a), L = c => gfx.lambert(c);
  const emis = (c, o) => new T.MeshBasicMaterial(Object.assign({ color: c }, o || {}));
  const npc = (scene, look, x, z, rot) => { const c = G.makeChar(look); c.root.position.set(x, 0, z); c.root.rotation.y = rot; scene.add(c.root); return c; };

  // A die made of light: translucent cube, bright edges, pips on every face.
  function wispDie(size, color) {
    const g = new T.Group(), geo = new T.BoxGeometry(size, size, size);
    g.add(new T.Mesh(geo, emis(color, { transparent: true, opacity: 0.22, blending: T.AdditiveBlending, depthWrite: false })));
    g.add(new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color })));
    const pm = emis(0xffffff), pg = new T.SphereGeometry(size * 0.07, 5, 4), h = size / 2 + 0.002, q = size * 0.26;
    const faces = [[[0, 0]], [[-q, -q], [q, q]], [[-q, -q], [0, 0], [q, q]], [[-q, -q], [q, q], [-q, q], [q, -q]], [[-q, -q], [q, q], [-q, q], [q, -q], [0, 0]], [[-q, -q], [q, q], [-q, q], [q, -q], [-q, 0], [q, 0]]];
    const axes = [[0, 1, 0], [1, 0, 0], [0, 0, 1], [0, 0, -1], [-1, 0, 0], [0, -1, 0]];
    faces.forEach((f, i) => f.forEach(p => { const m = new T.Mesh(pg, pm), a = axes[i]; if (a[1]) m.position.set(p[0], a[1] * h, p[1]); else if (a[0]) m.position.set(a[0] * h, p[0], p[1]); else m.position.set(p[0], p[1], a[2] * h); g.add(m); }));
    return g;
  }
  W.wispDie = wispDie;

  // ============================================================== the Lamp Market
  W.hubLife = function (s, obstacles) {
    const iron = L(0x1c1a1e), woodD = L(0x3a2616), wood = L(0x5a3c24);
    // ---- the Wisp Table: Marc's dice booth, east side
    const BX = 30.9, BZ = 6.2, booth = new T.Group(); booth.position.set(BX, 0, BZ); s.add(booth);
    box(3.6, 0.04, 3.4, L(0x143a2c), -0.3, 0.02, 0, booth).castShadow = false; box(3.2, 0.045, 3.0, L(0x1f5a3a), -0.3, 0.02, 0, booth).castShadow = false;
    box(0.7, 1.0, 2.6, woodD, 0.2, 0.5, 0, booth); box(0.85, 0.08, 2.75, L(0x1f5a3a), 0.2, 1.04, 0, booth); box(0.9, 0.05, 2.8, L(0xd9a93c), 0.2, 0.98, 0, booth);
    box(1.0, 1.0, 0.5, woodD, -0.3, 0.5, -1.3, booth); box(1.0, 1.0, 0.5, woodD, -0.3, 0.5, 1.3, booth); box(1.1, 0.08, 0.6, L(0x1f5a3a), -0.3, 1.04, -1.3, booth); box(1.1, 0.08, 0.6, L(0x1f5a3a), -0.3, 1.04, 1.3, booth);
    [[1.3, -1.6], [1.3, 1.6], [-1.9, -1.6], [-1.9, 1.6]].forEach(q => mesh(new T.CylinderGeometry(0.07, 0.07, 3.0, 5), woodD, q[0], 1.5, q[1], booth));
    box(0.09, 0.09, 3.3, woodD, 1.3, 3.0, 0, booth); box(0.09, 0.09, 3.3, woodD, -1.9, 3.0, 0, booth); box(3.3, 0.09, 0.09, woodD, -0.3, 3.0, -1.6, booth); box(3.3, 0.09, 0.09, woodD, -0.3, 3.0, 1.6, booth); box(0.07, 0.34, 3.3, L(0xd9a93c), -1.95, 2.8, 0, booth);
    for (let i = 0; i < 14; i++) { const u = i / 13, side = i % 2, m = new T.Mesh(new T.SphereGeometry(0.06, 5, 4), emis(i % 3 ? 0x6af0ff : 0xffd36b)); m.position.set(-1.9 + u * 3.2, 2.9 - Math.sin(u * Math.PI) * 0.25, side ? 1.6 : -1.6); booth.add(m); }
    const dice = [];
    for (let i = 0; i < 5; i++) { const z = (i - 2) * 0.5; mesh(new T.CylinderGeometry(0.1, 0.13, 0.1, 8), iron, 0.2, 1.12, z, booth); const d = wispDie(0.26, [0x6af0ff, 0x8affc0, 0x6af0ff, 0xc79bff, 0x6af0ff][i]); d.position.set(0.2, 1.55, z); booth.add(d); dice.push(d); }
    const bl = new T.PointLight(0x70f0ff, 14, 9, 1.6); bl.position.set(-0.2, 2.2, 0); booth.add(bl);
    { const big = wispDie(0.5, 0x6af0ff); big.position.set(-2.05, 3.6, 0); booth.add(big); dice.push(big); }                      // the sign: a slow-turning die over the entrance
    [-1.5, 1.5].forEach(z => { mesh(new T.CylinderGeometry(0.05, 0.07, 0.9, 6), L(0xd9a93c), -2.2, 0.45, z, booth); mesh(new T.SphereGeometry(0.09, 6, 5), L(0xd9a93c), -2.2, 0.95, z, booth); });
    [-0.9, 0.9].forEach(z => mesh(new T.CylinderGeometry(0.2, 0.2, 0.5, 7), wood, -1.0, 0.25, z, booth));
    const croup = npc(s, { cls: 'rogue', race: 'dwarf', tint: { cloth: '#1f5a3a', armor: '#143a2c', trim: '#d9a93c' } }, BX + 0.95, BZ, -Math.PI / 2);
    const roller = npc(s, { cls: 'cleric', race: 'human', tint: { cloth: '#5a2a4a', armor: '#3a3040' } }, BX - 0.75, BZ - 0.75, Math.PI / 2);
    obstacles.push([BX - 0.9, BZ - 1.7, BX + 1.5, BZ + 1.7]);

    // ---- pit gate guards, and a pair arguing about the odds
    const guards = [npc(s, { cls: 'fighter', race: 'halforc', tint: { cloth: '#5a1418', armor: '#2a2428', armor2: '#1a1618' } }, 3.2, 0.5, 0.2), npc(s, { cls: 'fighter', race: 'human', tint: { cloth: '#5a1418', armor: '#2a2428', armor2: '#1a1618' } }, 6.8, 0.5, -0.2)];
    const arg = [npc(s, { cls: 'rogue', race: 'human', tint: { cloth: '#6a5a3a', armor: '#4a4438' } }, 22.9, 0.3, 0.3), npc(s, { cls: 'sorcerer', race: 'dwarf', tint: { cloth: '#3a5a3a', armor: '#3a4038' } }, 23.2, 1.3, -2.8)];
    obstacles.push([2.9, 0.2, 3.5, 0.8], [6.5, 0.2, 7.1, 0.8], [22.6, 0, 23.5, 1.6]);
    // ---- a busker by the First Lamp, hat on the ground
    const busk = npc(s, { cls: 'rogue', race: 'elf', tint: { cloth: '#7a3a5a', armor: '#4a2a40', hair: '#f0c95a' } }, 18.4, 12.6, 2.2);
    mesh(new T.CylinderGeometry(0.22, 0.16, 0.12, 8), L(0x2a2228), 19.0, 0.06, 13.3, s); for (let i = 0; i < 4; i++) mesh(new T.CylinderGeometry(0.05, 0.05, 0.02, 6), new T.MeshPhongMaterial({ color: 0xf0c95a, shininess: 90 }), 18.95 + i * 0.04, 0.13, 13.27 + (i % 2) * 0.06, s).castShadow = false;
    obstacles.push([18.1, 12.3, 18.7, 12.9]);
    // ---- a cat on the crates by the notice board
    const cat = new T.Group(); cat.position.set(12.6, 0.85, -0.7); cat.rotation.y = 0.7; s.add(cat);
    const fur = L(0x1a1618); box(0.34, 0.2, 0.18, fur, 0, 0.1, 0, cat); box(0.16, 0.16, 0.16, fur, 0.22, 0.2, 0, cat); [-0.05, 0.05].forEach(z => mesh(new T.ConeGeometry(0.035, 0.08, 3), fur, 0.24, 0.32, z, cat));
    [-0.04, 0.04].forEach(z => { const e = new T.Mesh(new T.SphereGeometry(0.018, 4, 3), emis(0xc8ff60)); e.position.set(0.305, 0.22, z); cat.add(e); });
    const tail = new T.Group(); tail.position.set(-0.17, 0.14, 0); cat.add(tail); box(0.3, 0.05, 0.05, fur, -0.15, 0, 0, tail);
    // ---- washing lines across the far walls
    const cloths = [];
    const line = (x1, z1, x2, z2, y) => { const n = 6, dx = x2 - x1, dz = z2 - z1, len = Math.hypot(dx, dz); const rope = box(len, 0.02, 0.02, iron, (x1 + x2) / 2, y, (z1 + z2) / 2, s); rope.rotation.y = -Math.atan2(dz, dx); rope.castShadow = false;
      for (let i = 0; i < n; i++) { if (Math.random() < 0.2) continue; const u = (i + 0.5) / n, g = new T.Group(); g.position.set(x1 + dx * u, y, z1 + dz * u); g.rotation.y = -Math.atan2(dz, dx); s.add(g); const h = R(0.5, 0.95), c = new T.Mesh(new T.PlaneGeometry(len / n * 0.8, h), new T.MeshLambertMaterial({ color: G.pick([0x8a7a6a, 0x6a4a4a, 0x4a5a6a, 0x9a9080, 0x5a4a6a, 0x6a6a4a]), side: T.DoubleSide })); c.position.y = -h / 2; g.add(c); cloths.push([g, R(0, 6)]); } };
    line(-1.3, 4.6, -1.3, 7.6, 4.7); line(-1.3, 11, -1.3, 13.6, 4.5); line(8.8, -1.3, 11.6, -1.3, 4.7); line(26.6, -1.3, 28.8, -1.3, 5.0);
    // ---- rats along the walls
    const ratM = L(0x3a3436), rats = [[[1, -0.5], [9, -0.45]], [[18, -0.55], [23, -0.5]], [[-0.4, 5.5], [-0.35, 8]], [[-0.4, 11], [-0.35, 16.5]], [[20, 21.3], [31, 21.3]]].map(p => {
      const g = new T.Group(); mesh(new T.SphereGeometry(0.09, 6, 4), ratM, 0, 0.07, 0, g).scale.set(1, 0.8, 1.7); mesh(new T.SphereGeometry(0.05, 5, 4), ratM, 0, 0.08, 0.15, g); const t = box(0.015, 0.015, 0.2, L(0x8a6a6a), 0, 0.05, -0.22, g); t.castShadow = false; s.add(g);
      return { g, a: p[0], b: p[1], u: Math.random(), dir: 1, wait: R(0, 5) };
    });
    // ---- bats under the vault
    const batM = emis(0x0a080c, { side: T.DoubleSide }), bats = [];
    for (let i = 0; i < 6; i++) { const g = new T.Group(); const wl = new T.Mesh(new T.PlaneGeometry(0.28, 0.14), batM); wl.rotation.x = -Math.PI / 2; const wr = wl.clone(); wl.position.x = -0.14; wr.position.x = 0.14; const pl = new T.Group(), pr = new T.Group(); pl.add(wl); pr.add(wr); g.add(pl, pr); s.add(g); bats.push({ g, pl, pr, cx: R(5, 24), cz: R(3, 14), r: R(2.5, 6), y: R(6, 8.5), sp: R(0.5, 1.1) * (i % 2 ? 1 : -1), ph: R(0, 6) }); }
    // ---- steam grates and puddle ripples
    const grates = [[7.2, 6.4], [20.6, 6.9], [5.5, 4.6]]; grates.forEach(q => { box(0.9, 0.03, 0.9, emis(0x060508), q[0], 0.012, q[1], s).castShadow = false; for (let k = -1; k <= 1; k++) box(0.9, 0.04, 0.07, iron, q[0], 0.02, q[1] + k * 0.28, s).castShadow = false; });
    const rip = [[6.5, 6.5], [17, 12.2], [11.5, 3.2], [23, 6.6], [3.5, 10.6]].map(q => { const m = new T.Mesh(new T.RingGeometry(0.85, 1, 20), emis(0x7088b0, { transparent: true, opacity: 0, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(q[0] + R(-0.4, 0.4), 0.03, q[1] + R(-0.4, 0.4)); s.add(m); return { m, t: R(0, 3), x: q[0], z: q[1] }; });
    // ---- the Long Stair: the sealed gate to Highmarch, two Seal-Wardens, and the throne's colours
    { const GZ = 14.5, st = gfx.lambert(0xd8d4e0), goldM = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x4a3408, shininess: 90, flatShading: true });
      box(0.3, 3.4, 2.6, emis(0x05060c), -1.5, 1.7, GZ, s).castShadow = false;
      [-1.5, 1.5].forEach(dz => box(0.7, 3.8, 0.55, st, -1.3, 1.9, GZ + dz, s)); box(0.8, 0.5, 3.7, st, -1.3, 3.95, GZ, s); box(0.5, 0.3, 1.0, goldM, -1.05, 3.95, GZ, s);
      for (let i = -3; i <= 3; i++) mesh(new T.CylinderGeometry(0.045, 0.045, 3.3, 5), iron, -1.22, 1.65, GZ + i * 0.34, s); [0.8, 1.9, 3.0].forEach(y => box(0.08, 0.1, 2.5, iron, -1.2, y, GZ, s));
      [[0.25, 0xc8b8ff], [-0.25, 0xf0c95a]].forEach((q, i) => { const sl = mesh(new T.CylinderGeometry(0.17, 0.17, 0.05, 10), new T.MeshPhongMaterial({ color: q[1], emissive: i ? 0x4a3408 : 0x3a2a6a, shininess: 80 }), -1.14, 1.9, GZ + q[0], s); sl.rotation.z = Math.PI / 2; });
      for (let k = 0; k < 3; k++) box(0.5, 0.18, 2.3 - k * 0.2, st, -0.75 - k * 0.22, 0.09 + k * 0.18, GZ, s);
      [[-2.3, '#3a2a6a'], [2.3, '#5a1418']].forEach(q => { const bn = new T.Mesh(new T.PlaneGeometry(1.1, 2.6), new T.MeshLambertMaterial({ map: gfx.bannerTex(q[1], '#f0c95a'), transparent: true, alphaTest: 0.5, side: T.DoubleSide })); bn.position.set(-1.42, 3.0, GZ + q[0]); bn.rotation.y = Math.PI / 2; s.add(bn); });
      const sl2 = new T.PointLight(0xdfe6ff, 12, 9, 1.6); sl2.position.set(-0.4, 2.8, GZ); s.add(sl2); gfx.glow(0xdfe6ff, 2.2, -1.2, 2.6, GZ, s, 0.35);
      box(0.6, 0.4, 0.42, woodD, -0.55, 0.2, GZ + 1.05, s); box(0.64, 0.08, 0.46, goldM, -0.55, 0.42, GZ + 1.05, s);
      const wl = { cls: 'fighter', race: 'elf', gear: { weapon: 1, armor: 2 }, tint: { cloth: '#e8e4f8', armor: '#dfe2ec', armor2: '#a8b0c4', trim: '#f0c95a', legs: '#8a90a4' }, arm: 'f_spear' };
      var wardens = [npc(s, wl, 0.35, GZ - 1.3, Math.PI / 2), npc(s, Object.assign({}, wl, { race: 'human' }), 0.35, GZ + 1.3, Math.PI / 2)];
      obstacles.push([0.05, GZ - 1.6, 0.65, GZ - 1.0], [0.05, GZ + 1.0, 0.65, GZ + 1.6], [-0.9, GZ + 0.8, -0.2, GZ + 1.3]); }
    const WARD = ['Seal.', 'Nobody climbs.', 'By order of the throne.', 'Step back from the gate.'];
    let wardT = 8;
    const NOTES = [0xffd36b, 0xc79bff, 0x8ad0ff, 0xff9ac0];
    const ARG = ['Three to one! On GRUBB!', 'You are robbing me.', 'Marc said it was a sure thing.', 'Marc says everything is a sure thing.', 'I had it. I HAD it.'];
    let argT = 5, last = 0;
    // ---- the rest of the Undercity, falling away below the market: roofs, windows and far lamps in the dark
    { const under = s.children.find(c => c.isMesh && c.geometry.type === 'PlaneGeometry' && c.geometry.parameters.width === 200); if (under) { under.scale.set(38 / 200, 26 / 200, 1); under.position.set(16.5, -0.3, 10.5); } }       // let the dark below the market show
    { const N = 90, bm = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshLambertMaterial({ flatShading: true }), N), wm = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial(), N * 3), d = new T.Object3D(), col = new T.Color(); let wi = 0;
      for (let i = 0; i < N; i++) { const south = i % 2 === 0, out = 2.2 + Math.pow(Math.random(), 0.8) * 20, along = R(-10, 48), w = R(2, 5.5), dp = R(2, 5), top = -1.6 - out * 0.55 - R(0, 2.5), h = 9;
        const x = south ? along : 35 + out, z = south ? 23 + out : along;
        d.position.set(x, top - h / 2, z); d.scale.set(south ? w : dp, h, south ? dp : w); d.rotation.set(0, R(-0.08, 0.08), 0); d.updateMatrix(); bm.setMatrixAt(i, d.matrix); col.setHSL(R(0.66, 0.78), 0.2, R(0.09, 0.16)); bm.setColorAt(i, col);
        for (let k = 0; k < 3; k++) { if (Math.random() < 0.3) continue; const onX = Math.random() < 0.5, wc = [0xffc070, 0xffb060, 0xc080ff, 0x80d0ff, 0x9aff8a, 0xffe0a0][Math.floor(Math.random() * 6)];
          d.rotation.set(0, 0, 0); d.scale.set(onX ? 0.06 : 0.28, 0.4, onX ? 0.28 : 0.06); d.position.set(x + (onX ? (south ? w : dp) / 2 + 0.03 : R(-1, 1) * (south ? w : dp) * 0.35), top - R(0.5, 2.6), z + (onX ? R(-1, 1) * (south ? dp : w) * 0.35 : (south ? dp : w) / 2 + 0.03)); d.updateMatrix(); wm.setMatrixAt(wi, d.matrix); col.set(wc).multiplyScalar(Math.max(0.25, 1 - out / 26)); wm.setColorAt(wi, col); wi++; } }
      wm.count = wi; bm.castShadow = false; bm.receiveShadow = false; s.add(bm, wm);
      for (let i = 0; i < 9; i++) { const south = i % 2 === 0, out = R(4, 18), x = south ? R(-4, 40) : 35 + out, z = south ? 23 + out : R(-4, 26); gfx.glow([0xffb060, 0xc080ff, 0x80d0ff][i % 3], R(2.5, 5), x, -1.5 - out * 0.5, z, s, R(0.12, 0.28)); }
      // light falling from the First Lamp and the Wisp Table
      [[14, 9, 0xffd8a0, 3.4, 0.05], [30.9, 6.2, 0x8af0ff, 2.2, 0.04]].forEach(q => { const m = new T.Mesh(new T.ConeGeometry(q[3], 9, 14, 1, true), new T.MeshBasicMaterial({ color: q[2], transparent: true, opacity: q[4], blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); m.position.set(q[0], 4.6, q[1]); s.add(m); }); }
    return function (t) {
      const dt = Math.min(0.05, Math.max(0.001, t - last)); last = t;
      dice.forEach((d, i) => { d.rotation.set(t * (0.5 + i * 0.07), t * (0.8 + i * 0.05), 0); if (i < 5) d.position.y = 1.55 + Math.sin(t * 1.6 + i * 1.2) * 0.07; });
      bl.intensity = 13 + Math.sin(t * 3.1) * 2;
      croup.pose({ t, act: Math.sin(t * 0.5) > 0.7 ? 'cast' : 'idle', prog: 0.3 }); roller.pose({ t: t + 3, act: 'idle' });
      guards.forEach((c, i) => c.pose({ t: t + i * 2.5, act: 'idle' })); arg.forEach((c, i) => c.pose({ t: t + i, act: Math.sin(t * 1.3 + i * 3.14) > 0.5 ? 'cast' : 'idle', prog: 0.25 }));
      wardens.forEach((c, i) => c.pose({ t: t + i * 3.1, act: 'idle' })); wardT -= dt; if (wardT <= 0 && G.scene === 'hub' && !G.ui.isOpen() && !G.talk) { wardT = R(14, 24); const w = wardens[Math.random() < 0.5 ? 0 : 1].root.position; gfx.floatText(w.x, 2.7, w.z, WARD[Math.floor(Math.random() * WARD.length)], '#e8e4f8'); }
      if (Math.random() < 0.06) gfx.emit(-1.1, R(0.4, 3), 14.5 + R(-1, 1), R(0.2, 0.6), R(-0.1, 0.2), 0, 1.6, 0xdfe6ff, 0);
      busk.pose({ t, act: 'cast', prog: 0.2 + Math.abs(Math.sin(t * 2.2)) * 0.25 });
      if (Math.random() < 0.05) gfx.emit(18.4 + R(-0.3, 0.3), 1.6, 12.6 + R(-0.3, 0.3), R(-0.3, 0.3), R(0.6, 1.0), R(-0.3, 0.3), 1.6, NOTES[Math.floor(Math.random() * 4)], 0);
      tail.rotation.y = Math.sin(t * 1.4) * 0.7; cat.rotation.y = 0.7 + Math.sin(t * 0.23) * 0.15;
      cloths.forEach(c => { c[0].rotation.x = Math.sin(t * 1.1 + c[1]) * 0.12; });
      rats.forEach(r => { if (r.wait > 0) { r.wait -= dt; return; } r.u += r.dir * dt * 0.35; if (r.u > 1 || r.u < 0) { r.u = Math.max(0, Math.min(1, r.u)); r.dir *= -1; r.wait = R(1, 7); } r.g.position.set(r.a[0] + (r.b[0] - r.a[0]) * r.u, 0, r.a[1] + (r.b[1] - r.a[1]) * r.u); r.g.rotation.y = Math.atan2((r.b[0] - r.a[0]) * r.dir, (r.b[1] - r.a[1]) * r.dir); });
      bats.forEach(b => { const a = t * b.sp + b.ph; b.g.position.set(b.cx + Math.cos(a) * b.r, b.y + Math.sin(a * 2.3) * 0.5, b.cz + Math.sin(a) * b.r * 0.7); b.g.rotation.y = -a + (b.sp > 0 ? 0 : Math.PI); const f = Math.sin(t * 18 + b.ph) * 0.9; b.pl.rotation.z = f; b.pr.rotation.z = -f; });
      grates.forEach(q => { if (Math.random() < 0.1) gfx.emit(q[0] + R(-0.3, 0.3), 0.1, q[1] + R(-0.3, 0.3), R(-0.1, 0.1), R(0.8, 1.5), R(-0.1, 0.1), 2.2, 0x3a3a48, 0); });
      rip.forEach(r => { r.t += dt; if (r.t > 2.6) { r.t = R(-2, 0); r.m.position.set(r.x + R(-0.5, 0.5), 0.03, r.z + R(-0.5, 0.5)); } const u = Math.max(0, r.t) / 2.6; r.m.scale.setScalar(0.1 + u * 0.7); r.m.material.opacity = r.t < 0 ? 0 : 0.5 * (1 - u); });
      if (Math.random() < 0.08) gfx.emit(14 + R(-0.9, 0.9), 3.9 + R(-0.5, 0.6), 9 + R(-0.9, 0.9), R(-0.6, 0.6), R(-0.3, 0.3), R(-0.6, 0.6), 1.2, 0xffe0a0, 0);          // moths at the First Lamp
      if (Math.random() < 0.15) gfx.emit(BX + 0.2 + R(-0.2, 0.2), 1.6, BZ + R(-1.1, 1.1), 0, R(0.3, 0.8), 0, 1.0, 0x6af0ff, 0);
      argT -= dt; if (argT <= 0 && G.scene === 'hub' && !G.ui.isOpen() && !G.talk) { argT = R(9, 16); const w = arg[Math.random() < 0.5 ? 0 : 1].root.position; gfx.floatText(w.x, 2.6, w.z, ARG[Math.floor(Math.random() * ARG.length)], '#d8ccb0'); }
    };
  };

  // ============================================================== the Blood Pit
  W.arenaLife = function (s, AR, crowdSpots) {
    const iron = L(0x1c1a1e), woodD = L(0x3a2616), gold = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x4a3408, shininess: 90, flatShading: true }), bone = L(0xcfc6ae);
    const nx = -0.7071, nz = -0.7071, mx = -AR * 0.75, mz = -AR * 0.75, tx = 0.7071, tz = -0.7071;      // the far wall with the gate
    const at = (out, u, y) => [mx + nx * out + tx * u, y, mz + nz * out + tz * u], rotY = Math.atan2(-nx, -nz);
    // ---- the Guild box above the gate: canopy, drapes, a seat, and whoever is keeping the Ledger tonight
    const bx = new T.Group(), bp = at(4.3, 0, 3.5); bx.position.set(bp[0], bp[1], bp[2]); bx.rotation.y = rotY; s.add(bx);
    box(4.4, 1.3, 1.8, gfx.lambert(0x4a4448), 0, 0.65, 0, bx); box(4.7, 0.16, 2.1, L(0x2a2428), 0, 1.36, 0, bx); box(4.6, 0.5, 0.14, L(0x5a1f7a), 0, 1.05, 0.98, bx); box(4.6, 0.08, 0.16, gold, 0, 1.32, 0.98, bx); box(4.6, 0.08, 0.16, gold, 0, 0.78, 0.98, bx);
    [[-2.1, 0.85], [2.1, 0.85], [-2.1, -0.85], [2.1, -0.85]].forEach(q => mesh(new T.CylinderGeometry(0.07, 0.07, 2.9, 6), gold, q[0], 2.85, q[1], bx));
    const can = box(4.8, 0.12, 2.3, L(0x5a1f7a), 0, 4.32, 0, bx); can.rotation.x = 0.12; box(4.8, 0.36, 0.08, gold, 0, 4.05, 1.14, bx);
    [-2.2, 2.2].forEach(x => box(0.5, 2.4, 0.08, L(0x471862), x, 3.0, -0.9, bx));
    box(0.9, 1.5, 0.2, L(0x2a1438), 0, 2.2, -0.6, bx); box(0.9, 0.16, 0.8, L(0x5a1f7a), 0, 1.86, -0.2, bx); [-0.5, 0.5].forEach(x => { box(0.12, 0.5, 0.8, gold, x, 2.05, -0.2, bx); mesh(new T.SphereGeometry(0.1, 6, 5), gold, x, 3.0, -0.6, bx); });
    const mkBox = (look, x, z, rot) => { const c = G.makeChar(look); c.root.position.set(x, 1.44, z); c.root.rotation.y = rot; bx.add(c.root); return c; };
    const keeper = mkBox({ cls: 'sorcerer', race: 'elf', tint: { cloth: '#4a2a7a', armor: '#3a2060', armor2: '#2a1648', hair: '#e8e2f4', trim: '#d9a93c' } }, 0, 0.25, 0);
    const bg = [mkBox({ cls: 'fighter', race: 'halforc', tint: { cloth: '#5a1f7a', armor: '#2a2428', armor2: '#1a1618' } }, -1.5, 0.3, 0.15), mkBox({ cls: 'fighter', race: 'human', tint: { cloth: '#5a1f7a', armor: '#2a2428', armor2: '#1a1618' } }, 1.5, 0.3, -0.15)];
    const cloak = mkBox({ cls: 'rogue', race: 'human', tint: { cloth: '#4a4a52', armor: '#33333a', armor2: '#26262c' }, cos: { head: 'hood', back: 'greatcloak' } }, 0.95, -0.45, -0.25);       // they say he comes once a year, for the champion's bout
    const bxL = new T.PointLight(0xc79bff, 9, 9, 1.6); bxL.position.set(0, 3.4, 0.8); bx.add(bxL);
    // ---- eyes behind the gate bars
    const eyes = [[-0.45, 1.3], [0.5, 1.0], [0.1, 1.75]].map(q => { const g = new T.Group(), p = at(0.5, q[0], q[1]); g.position.set(p[0], p[1], p[2]); g.rotation.y = rotY; [-0.07, 0.07].forEach(x => { const e = new T.Mesh(new T.SphereGeometry(0.03, 5, 4), emis(0xff5030)); e.position.x = x; g.add(e); }); s.add(g); return { g, t: R(0, 4) }; });
    // ---- Marc's odds board on the left wall, and gibbets hung from the vault
    { const wxn = -1, wmx = -AR, p = [wmx - wxn * 0.56, 2.3, 1.3], g = new T.Group(); g.position.set(p[0], p[1], p[2]); g.rotation.y = Math.PI / 2; s.add(g); box(1.7, 1.3, 0.08, woodD, 0, 0, 0, g); for (let i = 0; i < 4; i++) { box(R(0.7, 1.3), 0.05, 0.02, L(0xdccba3), -0.1, 0.42 - i * 0.24, 0.05, g); box(0.16, 0.08, 0.02, L(i % 2 ? 0x9aff8a : 0xff7a6a), 0.68, 0.42 - i * 0.24, 0.05, g); } box(1.8, 0.1, 0.12, L(0x1f5a3a), 0, 0.7, 0.02, g); }
    const cages = [[-5.2, -2.4, 6.6], [-2.2, -5.4, 7.2], [3.8, -6.4, 6.9]].map((q, i) => {
      const g = new T.Group(); g.position.set(q[0], q[2] + 3.4, q[1]); s.add(g); const c = new T.Group(); c.position.y = -3.4; g.add(c);
      mesh(new T.CylinderGeometry(0.02, 0.02, 3.0, 4), iron, 0, -1.5, 0, g);
      mesh(new T.CylinderGeometry(0.42, 0.42, 0.06, 8), iron, 0, 0.5, 0, c); mesh(new T.CylinderGeometry(0.42, 0.42, 0.06, 8), iron, 0, -0.7, 0, c); mesh(new T.ConeGeometry(0.42, 0.3, 8), iron, 0, 0.66, 0, c);
      for (let k = 0; k < 8; k++) mesh(new T.CylinderGeometry(0.018, 0.018, 1.2, 4), iron, Math.cos(k * 0.785) * 0.4, -0.1, Math.sin(k * 0.785) * 0.4, c);
      if (i !== 1) { mesh(new T.SphereGeometry(0.13, 6, 5), bone, 0.05, -0.05, 0, c).scale.set(1, 0.9, 1.1); box(0.22, 0.4, 0.12, bone, 0, -0.38, 0, c); box(0.05, 0.4, 0.05, bone, 0.2, -0.5, 0.1, c).rotation.z = 0.5; }
      return { g, ph: i * 2.1 };
    });
    // ---- the stands: pennants, torches held up, sawdust on the floor
    const pens = [], tor = [];
    for (let i = 0; i < crowdSpots.length; i += 9) { const p = crowdSpots[i], g = new T.Group(); g.position.set(p[0], p[1] + 1.15, p[2]); g.rotation.y = Math.atan2(-p[0], -p[2]); s.add(g); mesh(new T.CylinderGeometry(0.015, 0.015, 0.8, 4), woodD, 0, 0.3, 0, g).castShadow = false; const f = new T.Mesh(new T.PlaneGeometry(0.5, 0.3), new T.MeshLambertMaterial({ color: G.pick([0x7a1c22, 0x5a1f7a, 0xd9a93c, 0x1f5a3a]), side: T.DoubleSide })); f.position.set(0.25, 0.55, 0); g.add(f); pens.push([g, R(0, 6)]); }
    for (let i = 4; i < crowdSpots.length; i += 13) { const p = crowdSpots[i], m = new T.Mesh(new T.SphereGeometry(0.07, 5, 4), emis(0xffb050)); m.position.set(p[0], p[1] + 1.35, p[2]); s.add(m); tor.push([m, p[1] + 1.35, R(0, 6)]); }
    for (let i = 0; i < 7; i++) { const d = new T.Mesh(new T.CircleGeometry(R(0.8, 1.7), 10), new T.MeshBasicMaterial({ color: 0xb09a6a, transparent: true, opacity: R(0.1, 0.2), depthWrite: false })); d.rotation.x = -Math.PI / 2; d.position.set(R(-5.5, 5.5), 0.011, R(-5.5, 5.5)); s.add(d); }
    let last = 0;
    return function (t, hype) {
      const dt = Math.min(0.05, Math.max(0.001, t - last)); last = t;
      cloak.root.visible = !!(G.fight && G.fight.active && G.fight.E && G.fight.E.boss); if (cloak.root.visible) cloak.pose({ t: t + 5, act: 'idle' });
      keeper.pose({ t, act: hype > 0.8 ? 'cast' : 'idle', prog: 0.3 }); bg.forEach((c, i) => c.pose({ t: t + i * 2, act: 'idle' }));
      eyes.forEach(e => { e.t -= dt; if (e.t < -0.15) e.t = R(1.5, 5); e.g.visible = e.t > 0; });
      cages.forEach(c => { c.g.rotation.z = Math.sin(t * 0.7 + c.ph) * (0.04 + hype * 0.05); c.g.rotation.x = Math.cos(t * 0.5 + c.ph) * 0.03; });
      pens.forEach(p => { p[0].rotation.z = Math.sin(t * (2 + hype * 5) + p[1]) * (0.15 + hype * 0.4); });
      tor.forEach(q => { q[0].position.y = q[1] + Math.abs(Math.sin(t * (2.5 + hype * 3) + q[2])) * (0.05 + hype * 0.25); if (Math.random() < 0.04) gfx.emit(q[0].position.x, q[0].position.y + 0.1, q[0].position.z, R(-0.2, 0.2), R(0.5, 1.2), R(-0.2, 0.2), 0.7, 0xff9a40, 0); });
      if (hype > 0.5 && Math.random() < hype * 0.3) { const a = R(0, 6.28), r = R(7, 9); gfx.emit(Math.cos(a) * r, R(5, 7), Math.sin(a) * r, -Math.cos(a) * R(1, 2.5), R(-0.5, 0.5), -Math.sin(a) * R(1, 2.5), 2.2, Math.random() < 0.5 ? 0xc22a22 : 0xffd36b, 2.5); }   // petals and coin from the stands
    };
  };
})();
