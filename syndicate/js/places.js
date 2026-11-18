// Underground Syndicate — walkable isometric places: the undercity street and the hideout (with grid-placed decor)
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, box = gfx.box, mesh = gfx.mesh;
  const { wall, brazier, lantern, stoneMat, tiles } = W.props;
  const R = (a, b) => a + Math.random() * (b - a);
  const L = c => gfx.lambert(c);
  const iron = () => L(0x1c1a1e), wood = () => L(0x5a3c24), woodD = () => L(0x3a2616);
  const emis = c => new T.MeshBasicMaterial({ color: c });
  const em = (geo, c, x, y, z, g) => { const m = new T.Mesh(geo, emis(c)); m.position.set(x, y, z); g.add(m); return m; };

  function npc(scene, look, x, z, rot) { const c = G.makeChar(look); c.root.position.set(x, 0, z); c.root.rotation.y = rot; scene.add(c.root); return c; }
  function crate(p, x, z, s) { const m = box(s, s, s, wood(), x, s / 2, z, p); m.rotation.y = R(0, 1); box(s + 0.04, 0.08, s + 0.04, woodD(), x, s, z, p).rotation.y = m.rotation.y; }
  function barrel(p, x, z) { mesh(new T.CylinderGeometry(0.34, 0.3, 0.8, 8), wood(), x, 0.4, z, p); mesh(new T.CylinderGeometry(0.36, 0.36, 0.08, 8), iron(), x, 0.62, z, p); mesh(new T.CylinderGeometry(0.34, 0.34, 0.08, 8), iron(), x, 0.2, z, p); }
  function stall(p, x, z, color, goods) {
    const g = new T.Group(); g.position.set(x, 0, z); p.add(g);
    [[-1.2, -0.6], [1.2, -0.6], [-1.2, 0.6], [1.2, 0.6]].forEach(q => mesh(new T.CylinderGeometry(0.06, 0.06, 2.3, 5), woodD(), q[0], 1.15, q[1], g));
    const can = box(2.8, 0.1, 1.7, L(color), 0, 2.4, 0, g); can.rotation.x = 0.12; box(2.8, 0.3, 0.06, L(color), 0, 2.1, 0.9, g);
    box(2.5, 0.12, 0.9, wood(), 0, 0.9, 0.2, g); box(2.3, 0.8, 0.7, woodD(), 0, 0.45, 0.2, g);
    for (let i = 0; i < 7; i++) { const c = G.pick(goods); const b = new T.Mesh(new T.CylinderGeometry(0.07, 0.1, 0.26, 6), emis(c)); b.position.set(-1 + i * 0.33 + R(-0.05, 0.05), 1.1, 0.2 + R(-0.25, 0.25)); g.add(b); gfx.glow(c, 0.5, b.position.x, 1.15, b.position.z, g, 0.5); }
    return g;
  }
  function doorway(p, x, z, rot, glowColor, w, h) {
    const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = rot; p.add(g);
    const st = stoneMat(0x8a847c);
    box(0.5, h + 0.4, 0.7, st, -w / 2 - 0.25, (h + 0.4) / 2, 0, g); box(0.5, h + 0.4, 0.7, st, w / 2 + 0.25, (h + 0.4) / 2, 0, g); box(w + 1.3, 0.55, 0.8, st, 0, h + 0.5, 0, g);
    const d = box(w, h, 0.2, new T.MeshBasicMaterial({ color: 0x040305 }), 0, h / 2, 0.1, g); d.castShadow = false;
    gfx.glow(glowColor, w * 1.6, 0, h * 0.45, 0.5, g, 0.35);
    return g;
  }
  function windowLight(p, x, y, z, rot) { const m = new T.Mesh(new T.PlaneGeometry(0.5, 0.8), emis(0xffc070)); m.position.set(x, y, z); m.rotation.y = rot; p.add(m); gfx.glow(0xffa040, 1.6, x, y, z, p, 0.3); }

  // ============================================================== UNDERCITY STREET
  W.buildHub = function () {
    const s = gfx.newScene({ ambient: 1.5, key: 1.35, shadowSize: 16, sky: 0x8a88c0, ground: 0x241c1a, keyColor: 0xd8d0ff });
    s.fog = new T.Fog(0x07060a, 74, 110);
    const key = s.userData.key; key.position.set(14, 16, 16); key.target.position.set(8.5, 0, 4.5);
    const X1 = 17, Z1 = 9, cells = [];
    for (let x = -1; x <= X1 + 1; x++) for (let z = -1; z <= Z1 + 1; z++) cells.push({ x, z });
    tiles(s, cells, 'cobble', [0.5, 0.5, 0.56]);
    const m1 = stoneMat(0x6f6a72), m2 = stoneMat(0x56525c);
    // far building line (along z = -2) and left building line (along x = -2)
    const bw = wall(s, X1 + 5, 5.2, 1, m1); bw.position.set(X1 / 2, 0, -2.05);
    const lw = wall(s, Z1 + 5, 5.2, 1, m2); lw.position.set(-2.05, 0, Z1 / 2); lw.rotation.y = Math.PI / 2;
    box(X1 + 6, 0.5, 2.2, m2, X1 / 2, 5.6, -2.6, s); box(2.2, 0.5, Z1 + 6, m2, -2.6, 5.6, Z1 / 2, s);
    for (let i = 0; i < 6; i++) { windowLight(s, 1 + i * 3.2, 3.9, -1.5, 0); if (i < 3) windowLight(s, -1.5, 3.9, 1.2 + i * 3.4, Math.PI / 2); }
    [[-1.6, -1.6], [7, -1.7], [14.6, -1.7], [-1.7, 8]].forEach(p => box(1.1, 6, 1.1, m2, p[0], 3, p[1], s));
    // curb on the near edges
    box(X1 + 3.4, 0.4, 0.5, m2, X1 / 2, 0.1, Z1 + 1.65, s); box(0.5, 0.4, Z1 + 3.4, m2, X1 + 1.65, 0.1, Z1 / 2, s);

    // The Blood Pit gate
    doorway(s, 3.6, -1.45, 0, 0xff4020, 2.6, 3.2);
    brazier(s, 1.6, 0, -0.7, 28, 0xff7030); brazier(s, 5.6, 0, -0.7, 28, 0xff7030);
    const ban = (x, y, z, rot, bg) => { const m = new T.Mesh(new T.PlaneGeometry(1.1, 2.2), new T.MeshLambertMaterial({ map: gfx.bannerTex(bg, '#d9a93c'), transparent: true, alphaTest: 0.5, side: T.DoubleSide })); m.position.set(x, y, z); m.rotation.y = rot; s.add(m); };
    ban(0.3, 3.2, -1.5, 0, '#7a1c22'); ban(6.9, 3.2, -1.5, 0, '#7a1c22');
    // The Fence
    stall(s, 10.2, -0.3, 0x245a44, [0x7ad0ff, 0xffd36b, 0xff7a7a, 0x9aff8a]);
    const fence = npc(s, { cls: 'rogue', race: 'human', tint: { cloth: '#245a44', armor: '#3a4a40' } }, 10.2, -1.0, 0);
    lantern(s, 12.1, 0, -0.9, 0xffb060, 16);
    // Guildmaster
    ban(15.6, 3.1, -1.5, 0, '#5a1f7a');
    const gm = npc(s, { cls: 'sorcerer', race: 'elf', tint: { cloth: '#4a2a7a', armor: '#3a2060', armor2: '#2a1648', hair: '#e8e2f4', trim: '#d9a93c' } }, 15.6, -0.2, 0.2);
    box(1.6, 0.25, 1.6, m1, 15.6, 0.02, -0.2, s);
    lantern(s, 16.9, 0, -0.8, 0xb070ff, 18);
    // Hideout door
    doorway(s, -1.45, 5.2, Math.PI / 2, 0x50b0ff, 1.5, 2.5);
    lantern(s, -0.9, 0, 6.9, 0x60b8ff, 16, 2.0).rotation.y = -Math.PI / 2;
    // dressing
    stall(s, 14.3, 7.6, 0x4a2a6a, [0xc080ff, 0x80ffd0, 0xff80c0]).rotation.y = -Math.PI / 2;
    const idle1 = npc(s, { cls: 'cleric', race: 'dwarf', tint: { cloth: '#3a3038', armor: '#4a4048' } }, 13.2, 7.6, Math.PI / 2);
    crate(s, 6.6, -0.6, 0.8); crate(s, 7.4, -0.8, 0.6);
    barrel(s, 0.2, 8.6); barrel(s, 1.0, 9.0); barrel(s, 16.6, 4.2); crate(s, 0.1, 1.2, 0.7);
    lantern(s, 5.5, 0, 8.8, 0xffb060, 16); lantern(s, 16.8, 0, 2.2, 0xffb060, 0);
    box(1.7, 1.25, 0.1, woodD(), 7.0, 1.9, -1.5, s); [[-0.45, 0.2, 0.5, 0.6], [0.3, 0.25, 0.55, 0.45], [0.05, -0.3, 0.7, 0.4], [-0.5, -0.32, 0.36, 0.34]].forEach(q => { const m = new T.Mesh(new T.PlaneGeometry(q[2], q[3]), new T.MeshLambertMaterial({ color: 0xdccba3 })); m.position.set(7.0 + q[0], 1.9 + q[1], -1.43); m.rotation.z = q[0] * 0.2; s.add(m); });
    // the Low Lamp tavern, where your Tally drinks
    doorway(s, -1.45, 1.7, Math.PI / 2, 0xffb060, 1.4, 2.4);
    box(0.08, 0.5, 0.9, woodD(), -1.0, 3.1, 1.7, s); { const lm = new T.Mesh(new T.BoxGeometry(0.2, 0.26, 0.2), emis(0xffe0a0)); lm.position.set(-0.8, 2.7, 1.7); s.add(lm); gfx.fire(s, -0.8, 2.5, 1.7, 0xffb060, 0.4, 12); }
    barrel(s, -0.3, 0.4); box(0.9, 0.08, 0.6, wood(), 0.3, 0.55, 3.0, s); box(0.1, 0.55, 0.1, woodD(), 0.3, 0.27, 3.0, s);
    // a beggars' fire, strung lamps, puddles
    mesh(new T.CylinderGeometry(0.4, 0.34, 0.8, 8), iron(), 16.4, 0.4, 8.6, s); gfx.fire(s, 16.4, 0.9, 8.6, 0xff8a30, 0.7, 14);
    const sit = npc(s, { cls: 'rogue', race: 'dwarf', tint: { cloth: '#3a3028', armor: '#3a3430' } }, 15.3, 8.9, 1.2), sit2 = npc(s, { cls: 'cleric', race: 'human', tint: { cloth: '#4a4238', armor: '#3a3632' } }, 16.9, 7.6, -2.6);
    [[2, 8], [9, 13], [13.5, 17]].forEach((q, n) => { for (let i = 0; i <= 8; i++) { const u = i / 8, x = q[0] + (q[1] - q[0]) * u, y = 4.3 - Math.sin(u * Math.PI) * 0.7, z = -1.2 + u * 0.0 + n * 0.0; if (i % 2 === 0) { const b = new T.Mesh(new T.SphereGeometry(0.07, 6, 5), emis([0xffc070, 0xc080ff, 0x80d0ff][(i / 2 + n) % 3])); b.position.set(x, y, z + 0.4); s.add(b); gfx.glow([0xffc070, 0xc080ff, 0x80d0ff][(i / 2 + n) % 3], 0.6, x, y, z + 0.4, s, 0.5); } } });
    [[4.5, 5.5, 1.6], [11, 6.8, 1.1], [7.5, 2.5, 0.9], [13.8, 3.6, 1.3]].forEach(q => { const d = new T.Mesh(new T.CircleGeometry(q[2], 14), new T.MeshBasicMaterial({ color: 0x1a2030, transparent: true, opacity: 0.55, depthWrite: false })); d.rotation.x = -Math.PI / 2; d.position.set(q[0], 0.012, q[1]); d.scale.z = 0.6; s.add(d); });
    // people going about their business
    const TINTS = [{ cloth: '#5a3a2a', armor: '#4a4038' }, { cloth: '#2a4a5a', armor: '#3a4048' }, { cloth: '#5a2a4a', armor: '#3a3040' }, { cloth: '#3a5a3a', armor: '#3a4038' }, { cloth: '#6a5a3a', armor: '#4a4438' }];
    const walkers = [[[1, 6.5], [16, 6.2]], [[15.5, 4.6], [2.5, 4.2]], [[5, 8.4], [12, 2.6]], [[13, 8.6], [8.5, 3.4]], [[2, 2.6], [6.5, 7.6]]].map((pth, i) => ({ c: npc(s, { cls: ['rogue', 'cleric', 'fighter', 'sorcerer', 'rogue'][i], race: Object.keys(G.RACES)[i % 5], tint: TINTS[i] }, pth[0][0], pth[0][1], 0), a: pth[0], b: pth[1], u: Math.random(), dir: 1, wait: 0, sp: 0.045 + i * 0.008 }));
    const CHAT = ['…heard Vexa has never once blinked.', 'Guild raised the rent again.', 'Glowcaps are coming in nicely.', 'Put ten coin on the new one. Ten!', 'Nobody leaves the Ledger.', 'Different carts, he says.', 'My cousin fought Brakk. Once.', 'The Light went ahead to wait.', 'They say the Keeper never sleeps.', 'Highmarch sealed another stair.'];
    let chatT = 4;
    const npcs = [fence, gm, idle1, sit, sit2];
    const obstacles = [[8.6, -1.6, 11.8, 0.7], [14.8, -1, 16.4, 0.6], [12.4, 6.6, 15.6, 8.6], [6.1, -1.2, 7.9, -0.1], [1.2, -1.2, 2.0, -0.3], [5.2, -1.2, 6.0, -0.3], [-0.3, 8.2, 1.4, 9.4], [16.2, 3.8, 17, 4.6], [5.2, 8.5, 5.8, 9.1]];
    return {
      scene: s, start: { x: 8, z: 5 }, zoom: [12.5, 21],
      spots: [
        { x: 3.6, z: 0.1, r: 2.1, y: 4.5, label: 'The Blood Pit', act: 'Enter the pit', go: () => G.ui.pit() },
        { x: 7.0, z: 0.7, r: 1.4, y: 3.0, label: 'Notice Board', act: 'Read the Codex', go: () => G.ui.codex() },
        { x: 10.2, z: 1.3, r: 1.9, y: 3.2, label: 'The Fence', act: 'Trade', go: () => G.ui.shop() },
        { x: 15.6, z: 1.3, r: 1.9, y: 3.2, label: 'Guildmaster', act: 'Character', go: () => G.ui.sheet() },
        { x: -0.2, z: 5.2, r: 1.9, y: 3.6, label: 'Your Hideout', act: 'Go home', go: () => G.ui.hideout() },
        { x: -0.2, z: 1.7, r: 1.5, y: 3.5, label: 'The Low Lamp', act: 'See your Tally', go: () => G.ui.tally() }
      ],
      blocked: (x, z) => x < -0.55 || x > X1 + 0.9 || z < -0.75 || z > Z1 + 0.9 || obstacles.some(o => x > o[0] - 0.35 && x < o[2] + 0.35 && z > o[1] - 0.35 && z < o[3] + 0.35),
      update: (t) => {
        npcs.forEach((c, i) => c.pose({ t: t + i * 2, act: 'idle' }));
        const dt2 = 0.016;
        walkers.forEach(w => {
          if (w.wait > 0) { w.wait -= dt2; w.c.pose({ t, act: 'idle' }); return; }
          w.u += w.dir * w.sp * dt2 * 4; if (w.u > 1 || w.u < 0) { w.u = Math.max(0, Math.min(1, w.u)); w.dir *= -1; w.wait = 1.5 + Math.random() * 3; }
          const x = w.a[0] + (w.b[0] - w.a[0]) * w.u, z = w.a[1] + (w.b[1] - w.a[1]) * w.u; w.c.root.position.set(x, 0, z);
          w.c.root.rotation.y = Math.atan2((w.b[0] - w.a[0]) * w.dir, (w.b[1] - w.a[1]) * w.dir); w.c.pose({ t, act: 'idle', moving: true, walk: t * 7 + w.sp * 99 });
        });
        chatT -= dt2; if (chatT <= 0 && G.scene === 'hub' && !G.ui.isOpen()) { chatT = 5 + Math.random() * 5; const w = walkers[Math.floor(Math.random() * walkers.length)], p = w.c.root.position; gfx.floatText(p.x, 2.6, p.z, CHAT[Math.floor(Math.random() * CHAT.length)], '#d8ccb0'); }
        if (Math.random() < 0.3) gfx.emit(R(0, X1), R(0.2, 3), R(0, Z1), R(-0.3, 0.3), R(0, 0.2), R(-0.3, 0.3), 2.5, 0x2a2a44, 0);
      }
    };
  };

  // ============================================================== DECOR ITEMS
  function mush(g, x, z, h, c) { mesh(new T.CylinderGeometry(0.04, 0.06, h, 5), L(0xd8d0c0), x, h / 2, z, g); const cap = new T.Mesh(new T.SphereGeometry(h * 0.42, 7, 4, 0, 6.3, 0, 1.6), emis(c)); cap.position.set(x, h, z); g.add(cap); }
  function shard(g, x, z, h, c, tilt) { const m = new T.Mesh(new T.ConeGeometry(h * 0.2, h, 5), emis(c)); m.position.set(x, h / 2, z); m.rotation.set(tilt * Math.cos(x * 9), 0, tilt * Math.sin(z * 9)); g.add(m); }
  const BUILD = {
    lantern: g => { mesh(new T.CylinderGeometry(0.05, 0.1, 1.5, 5), iron(), 0, 0.75, 0, g); mesh(new T.CylinderGeometry(0.2, 0.2, 0.06, 6), iron(), 0, 0.03, 0, g); em(new T.BoxGeometry(0.24, 0.32, 0.24), 0xfff0c8, 0, 1.62, 0, g); mesh(new T.ConeGeometry(0.22, 0.16, 4), iron(), 0, 1.86, 0, g).rotation.y = 0.78; return [0, 1.6, 0]; },
    rug: g => { box(1.86, 0.04, 1.86, L(0x5a1f7a), 0, 0.02, 0, g).castShadow = false; box(1.5, 0.045, 1.5, L(0x7a2a9a), 0, 0.022, 0, g).castShadow = false; box(1.9, 0.035, 0.12, L(0xd9a93c), 0, 0.02, 0.9, g); box(1.9, 0.035, 0.12, L(0xd9a93c), 0, 0.02, -0.9, g); },
    bed: g => { box(0.92, 0.3, 1.9, woodD(), 0, 0.2, 0, g); box(0.86, 0.2, 1.8, L(0x6a3aa0), 0, 0.42, 0.03, g); box(0.7, 0.14, 0.4, L(0xe8e0d0), 0, 0.56, -0.62, g); box(0.96, 0.9, 0.12, woodD(), 0, 0.5, -0.93, g); box(0.88, 0.22, 0.9, L(0x8a52c0), 0, 0.46, 0.45, g); },
    glowcaps: g => { mush(g, -0.2, -0.1, 0.5, 0x6ab0ff); mush(g, 0.2, 0.1, 0.36, 0xa080ff); mush(g, 0, 0.28, 0.26, 0x6ad8ff); mush(g, -0.28, 0.24, 0.2, 0xa080ff); mush(g, 0.25, -0.25, 0.22, 0x6ab0ff); return [0, 0.5, 0]; },
    trophies: g => { box(1.8, 1.7, 0.4, woodD(), 0, 0.85, 0, g); [0.55, 1.1].forEach(y => box(1.7, 0.06, 0.44, wood(), 0, y, 0.02, g)); for (let i = 0; i < 4; i++) { const y = i < 2 ? 0.58 : 1.13, x = -0.5 + (i % 2) * 1.0 + (i < 2 ? 0 : -0.1); mesh(new T.CylinderGeometry(0.13, 0.05, 0.22, 6), new T.MeshPhongMaterial({ color: 0xe0b040, shininess: 80 }), x, y + 0.2, 0.08, g); mesh(new T.CylinderGeometry(0.03, 0.09, 0.1, 6), new T.MeshPhongMaterial({ color: 0xe0b040 }), x, y + 0.05, 0.08, g); } gfx.glow(0xffd36b, 1.6, 0, 1, 0.3, g, 0.25); },
    desk: g => { box(1.7, 0.1, 0.8, wood(), 0, 0.78, 0, g); [[-0.75, -0.3], [0.75, -0.3], [-0.75, 0.3], [0.75, 0.3]].forEach(q => box(0.1, 0.76, 0.1, woodD(), q[0], 0.38, q[1], g)); box(0.9, 0.02, 0.6, L(0xd8c8a0), -0.2, 0.84, 0, g).castShadow = false; mesh(new T.CylinderGeometry(0.04, 0.04, 0.2, 5), L(0xe8e0d0), 0.6, 0.93, -0.15, g); em(new T.SphereGeometry(0.05, 6, 5), 0xffe0a0, 0.6, 1.08, -0.15, g); return [0.6, 1.1, -0.15]; },
    banner: g => { mesh(new T.CylinderGeometry(0.05, 0.07, 2.6, 5), woodD(), 0, 1.3, 0, g); mesh(new T.CylinderGeometry(0.22, 0.26, 0.12, 6), stoneMat(0x777), 0, 0.06, 0, g); box(0.9, 0.06, 0.06, woodD(), 0.35, 2.5, 0, g); const m = new T.Mesh(new T.PlaneGeometry(0.8, 1.6), new T.MeshLambertMaterial({ map: gfx.bannerTex('#5a1f7a', '#d9a93c'), transparent: true, alphaTest: 0.5, side: T.DoubleSide })); m.position.set(0.38, 1.68, 0); m.castShadow = true; g.add(m); },
    bloom: g => { mesh(new T.CylinderGeometry(0.42, 0.46, 0.3, 8), stoneMat(0x888078), 0, 0.15, 0, g); shard(g, 0, 0, 0.9, 0xb090ff, 0); shard(g, 0.2, 0.1, 0.6, 0x8ab0ff, 0.5); shard(g, -0.2, 0.05, 0.55, 0xd0a0ff, 0.5); shard(g, 0.02, -0.22, 0.5, 0x90d0ff, 0.5); g.children.slice(1).forEach(c => c.position.y += 0.25); return [0, 0.8, 0]; },
    fountain: g => { mesh(new T.CylinderGeometry(0.95, 1.0, 0.4, 12), stoneMat(0x8a8680), 0, 0.2, 0, g); const w = new T.Mesh(new T.CylinderGeometry(0.82, 0.82, 0.05, 12), emis(0x58c8f0)); w.position.y = 0.4; g.add(w); mesh(new T.CylinderGeometry(0.12, 0.18, 0.9, 6), stoneMat(0x8a8680), 0, 0.75, 0, g); mesh(new T.CylinderGeometry(0.4, 0.15, 0.14, 8), stoneMat(0x8a8680), 0, 1.22, 0, g); const w2 = new T.Mesh(new T.CylinderGeometry(0.33, 0.33, 0.04, 8), emis(0x8ae0ff)); w2.position.y = 1.3; g.add(w2); g.userData.fx = 'fountain'; return [0, 1.0, 0]; },
    cauldron: g => { const b = mesh(new T.SphereGeometry(0.42, 8, 6, 0, 6.3, 1.0, 2.2), iron(), 0, 0.5, 0, g); b.material.side = T.DoubleSide; const w = new T.Mesh(new T.CylinderGeometry(0.34, 0.34, 0.04, 8), emis(0x8aff5a)); w.position.y = 0.62; g.add(w); [0, 2.1, 4.2].forEach(a => mesh(new T.CylinderGeometry(0.04, 0.04, 0.3, 4), iron(), Math.cos(a) * 0.3, 0.12, Math.sin(a) * 0.3, g)); g.userData.fx = 'cauldron'; return [0, 0.8, 0]; },
    statues: g => { const st = stoneMat(0x9a968e); box(0.7, 0.4, 0.7, st, 0, 0.2, 0, g); box(0.42, 0.75, 0.3, st, 0, 0.78, 0, g); mesh(new T.SphereGeometry(0.18, 6, 5), st, 0, 1.32, 0, g); box(0.1, 1.2, 0.1, st, 0.3, 1.0, 0.16, g); mesh(new T.ConeGeometry(0.1, 0.28, 4), st, 0.3, 1.72, 0.16, g); box(0.44, 0.5, 0.06, st, -0.12, 0.8, 0.2, g); },
    crystals: g => { [[0, 0, 1.7, 0], [0.22, 0.12, 1.1, 0.35], [-0.2, 0.1, 1.2, 0.35], [0.05, -0.24, 0.8, 0.5], [-0.12, -0.2, 0.6, 0.6]].forEach(q => shard(g, q[0], q[1], q[2], q[2] > 1.5 ? 0xd8f0ff : 0x8ad0ff, q[3])); mesh(new T.DodecahedronGeometry(0.4, 0), stoneMat(0x5a5660), 0, 0.1, 0, g); return [0, 1.0, 0]; }
  };
  Object.assign(BUILD, {
    fern: g => { mesh(new T.CylinderGeometry(0.2, 0.15, 0.22, 6), L(0x6a4a34), 0, 0.11, 0, g); for (let i = 0; i < 7; i++) { const a = i * 0.9, m = mesh(new T.ConeGeometry(0.09, 0.75, 4), L(i % 2 ? 0x3f8a4a : 0x2f6e3c), Math.cos(a) * 0.14, 0.52, Math.sin(a) * 0.14, g); m.rotation.set(Math.sin(a) * 0.55, 0, -Math.cos(a) * 0.55); } },
    bench: g => { const st = stoneMat(0x8a8680); box(1.7, 0.14, 0.5, st, 0, 0.5, 0, g); box(0.25, 0.44, 0.44, st, -0.6, 0.22, 0, g); box(0.25, 0.44, 0.44, st, 0.6, 0.22, 0, g); },
    weaponrack: g => { box(1.8, 0.1, 0.3, woodD(), 0, 0.08, 0, g); box(0.1, 1.5, 0.12, woodD(), -0.8, 0.75, 0, g); box(0.1, 1.5, 0.12, woodD(), 0.8, 0.75, 0, g); box(1.7, 0.08, 0.1, wood(), 0, 1.3, 0, g); box(1.7, 0.08, 0.1, wood(), 0, 0.55, 0, g); const steel = new T.MeshPhongMaterial({ color: 0xcfd8e0, shininess: 70, flatShading: true }); [-0.5, 0, 0.5].forEach((x, i) => { box(0.08, i === 1 ? 1.35 : 1.1, 0.03, steel, x, 0.85, 0.08, g); box(0.26, 0.06, 0.06, L(0xb09a5a), x, 0.38, 0.08, g); }); },
    table: g => { box(1.8, 0.1, 1.5, wood(), 0, 0.8, 0, g); [[-0.75, -0.6], [0.75, -0.6], [-0.75, 0.6], [0.75, 0.6]].forEach(q => box(0.12, 0.78, 0.12, woodD(), q[0], 0.39, q[1], g)); mesh(new T.CylinderGeometry(0.2, 0.2, 0.04, 8), L(0xd8c8a0), -0.4, 0.87, 0.2, g); mesh(new T.CylinderGeometry(0.2, 0.2, 0.04, 8), L(0xd8c8a0), 0.45, 0.87, -0.25, g); mesh(new T.CylinderGeometry(0.07, 0.09, 0.22, 6), L(0x8a6a34), 0.1, 0.96, 0.35, g); mesh(new T.CylinderGeometry(0.04, 0.04, 0.26, 5), L(0xe8e0d0), 0, 0.98, 0, g); em(new T.SphereGeometry(0.06, 6, 5), 0xffe0a0, 0, 1.16, 0, g); return [0, 1.2, 0]; },
    firebowl: g => { brazier(g, 0, 0, 0, 0, 0xff8a30); return [0, 1.2, 0]; },
    bookshelf: g => { box(1.8, 1.9, 0.42, woodD(), 0, 0.95, 0, g); [0.5, 1.0, 1.5].forEach(y => { box(1.66, 0.05, 0.44, wood(), 0, y, 0.02, g); for (let i = 0; i < 9; i++) box(0.13, 0.3 + (i * 7 % 3) * 0.05, 0.3, L([0x7a1c22, 0x245a44, 0x4a2a7a, 0x8a6a34, 0x2a4a7a][(i + y * 10 | 0) % 5]), -0.72 + i * 0.18, y + 0.2, 0.06, g); }); },
    hearth: g => { const st = stoneMat(0x7a746e); box(1.9, 1.5, 0.7, st, 0, 0.75, 0, g); box(1.3, 2.2, 0.5, st, 0, 1.1, -0.08, g); box(2.0, 0.14, 0.8, stoneMat(0x57524e), 0, 1.5, 0.02, g); const hole = box(1.1, 0.85, 0.3, new T.MeshBasicMaterial({ color: 0x0a0504 }), 0, 0.5, 0.24, g); hole.castShadow = false; box(0.7, 0.12, 0.2, woodD(), 0, 0.16, 0.3, g); gfx.fire(g, 0, 0.3, 0.32, 0xff8a30, 0.7, 0); return [0, 0.8, 0.5]; },
    dummy: g => { mesh(new T.CylinderGeometry(0.07, 0.09, 1.3, 6), woodD(), 0, 0.65, 0, g); box(0.5, 0.06, 0.5, woodD(), 0, 0.03, 0, g); mesh(new T.CylinderGeometry(0.26, 0.22, 0.7, 8), L(0xb8a070), 0, 1.15, 0, g); box(1.1, 0.1, 0.1, woodD(), 0, 1.3, 0, g); mesh(new T.SphereGeometry(0.2, 7, 6), L(0xb8a070), 0, 1.72, 0, g); const tg = new T.Mesh(new T.CircleGeometry(0.14, 12), emis(0xc22a22)); tg.position.set(0, 1.18, 0.27); g.add(tg); },
    willow: g => { mesh(new T.CylinderGeometry(0.18, 0.3, 2.2, 6), L(0x4a3a30), 0, 1.1, 0, g); mesh(new T.DodecahedronGeometry(0.9, 0), L(0x2f6e5a), 0, 2.6, 0, g); for (let i = 0; i < 12; i++) { const a = i * 0.524, r = 0.75 + (i % 3) * 0.12, len = 1.0 + (i % 4) * 0.25; const m = new T.Mesh(new T.CylinderGeometry(0.03, 0.02, len, 4), emis(i % 2 ? 0x7affc0 : 0x5ad8a0)); m.position.set(Math.cos(a) * r, 2.5 - len / 2, Math.sin(a) * r); g.add(m); } gfx.glow(0x7affc0, 4, 0, 2.2, 0, g, 0.3); g.userData.fx = 'willow'; return [0, 2.2, 0]; }
  });
  const footprint = (it, r) => r % 2 ? [it.d, it.w] : [it.w, it.d];
  function buildItem(id, r) {
    const it = G.DECOR_BY[id], g = new T.Group(), inner = new T.Group(); g.add(inner);
    const lp = BUILD[id](inner); inner.rotation.y = -(r || 0) * Math.PI / 2;
    g.userData.lightPos = lp ? new T.Vector3(lp[0], lp[1], lp[2]).applyAxisAngle(new T.Vector3(0, 1, 0), inner.rotation.y) : null;
    if (it.light) gfx.glow(it.light, 2.6, g.userData.lightPos.x, g.userData.lightPos.y, g.userData.lightPos.z, g, 0.45);
    g.userData.fx = inner.userData.fx;
    return g;
  }

  // ============================================================== HIDEOUT
  const GW = 18, GD = 16, HX = 9, HZ = 6, isHouse = (x, z) => x <= HX && z <= HZ;
  W.grid = { GW, GD, isHouse, footprint };
  W.buildHideout = function () {
    const s = gfx.newScene({ ambient: 1.3, key: 1.15, shadowSize: 20, sky: 0x7a80b8, ground: 0x182018, keyColor: 0xc8d0ff });
    s.fog = new T.Fog(0x07060a, 74, 112);
    const key = s.userData.key; key.position.set(18, 20, 20); key.target.position.set(8, 0, 7);
    const house = [], garden = [], pathTint = new T.Color(0.95, 0.9, 0.82);
    for (let x = 0; x < GW; x++) for (let z = 0; z < GD; z++) (isHouse(x, z) ? house : garden).push({ x, z, tint: !isHouse(x, z) && (x === 13 || x === 14) && z < 9 ? pathTint : null });
    tiles(s, house, 'stone', [0.72, 0.66, 0.6]);
    tiles(s, garden, 'moss', [0.62, 0.78, 0.6]);
    const st = stoneMat(0x857d74), stD = stoneMat(0x645e58), rock = new T.MeshLambertMaterial({ color: 0x4a4650, map: gfx.tex('rock'), flatShading: true });
    // house walls on the two far sides
    const w1 = wall(s, HX + 1.7, 3.2, 0.6, st); w1.position.set(HX / 2, 0, -0.85);
    const w2 = wall(s, HZ + 1.7, 3.2, 0.6, st); w2.position.set(-0.85, 0, HZ / 2); w2.rotation.y = Math.PI / 2;
    box(0.9, 3.6, 0.9, stD, -0.85, 1.8, -0.85, s); box(0.8, 3.5, 0.8, stD, HX + 0.75, 1.75, -0.85, s); box(0.8, 3.5, 0.8, stD, -0.85, 1.75, HZ + 0.75, s);
    [1.5, 4.5, 7.5].forEach(x => windowLight(s, x, 2.1, -0.52, 0)); windowLight(s, -0.52, 2.1, 3.5, Math.PI / 2);
    // low walls: the outer edge of the house, and a partition that makes two rooms. Gaps are doorways.
    const low = [[-0.5, HZ + 0.5, 3.3, HZ + 0.5], [4.7, HZ + 0.5, HX + 0.5, HZ + 0.5], [HX + 0.5, -0.5, HX + 0.5, 2.3], [HX + 0.5, 3.7, HX + 0.5, HZ + 0.5], [5.5, -0.5, 5.5, 1.3], [5.5, 2.7, 5.5, HZ + 0.5]];
    low.forEach(q => { const len = Math.hypot(q[2] - q[0], q[3] - q[1]); box(q[1] === q[3] ? len : 0.3, 0.7, q[1] === q[3] ? 0.3 : len, st, (q[0] + q[2]) / 2, 0.35, (q[1] + q[3]) / 2, s); });
    [[3.3, HZ + 0.5], [4.7, HZ + 0.5], [HX + 0.5, 2.3], [HX + 0.5, 3.7], [HX + 0.5, HZ + 0.5], [5.5, 1.3], [5.5, 2.7]].forEach(q => box(0.42, 1.0, 0.42, stD, q[0], 0.5, q[1], s));
    // cave rock around the garden
    const boulder = (x, y, z, r) => { const m = mesh(new T.DodecahedronGeometry(r, 0), rock, x, y, z, s); m.rotation.set(R(0, 3), R(0, 3), R(0, 3)); m.scale.y = R(0.8, 1.5); };
    for (let x = HX + 1.6; x < GW + 1; x += 1.3) boulder(x + R(-0.2, 0.2), R(0.6, 1.8), -1.4 + R(-0.3, 0.2), R(1.1, 1.8));
    for (let z = HZ + 1.6; z < GD + 1; z += 1.3) boulder(-1.4 + R(-0.3, 0.2), R(0.6, 1.8), z + R(-0.2, 0.2), R(1.1, 1.8));
    for (let x = -1; x < GW + 1; x += 1.5) boulder(x + R(-0.3, 0.3), -0.1, GD + 0.3 + R(-0.1, 0.3), R(0.5, 0.8));
    for (let z = -1; z < GD + 1; z += 1.5) boulder(GW + 0.3 + R(-0.1, 0.3), -0.1, z + R(-0.3, 0.3), R(0.5, 0.8));
    // stalactites hanging in the dark above the far rock, and wild crystal in the corners
    for (let i = 0; i < 14; i++) { const far = i % 2, m = mesh(new T.ConeGeometry(R(0.25, 0.5), R(1.5, 3.2), 5), rock, far ? R(HX + 2, GW) : -1.6 + R(-0.5, 0.3), R(5.2, 6.5), far ? -1.7 + R(-0.5, 0.3) : R(HZ + 2, GD)); m.rotation.x = Math.PI; }
    [[HX + 2.2, -1.2, 0x8ad0ff], [-1.2, 12.5, 0xb090ff], [17.8, 15.6, 0x8ad0ff], [-1.1, 9.2, 0x8ad0ff], [16.5, -1.2, 0xb090ff], [8, 16.4, 0x7affc0]].forEach(q => { const g = new T.Group(); g.position.set(q[0], 0.9, q[1]); s.add(g); shard(g, 0, 0, 0.7, q[2], 0.3); shard(g, 0.2, 0.1, 0.45, q[2], 0.6); gfx.glow(q[2], 2.2, 0, 0.4, 0, g, 0.35); });
    // exit to the undercity
    doorway(s, 13.5, -0.95, 0, 0xffa040, 1.5, 2.5);
    [[1.2, 0.6], [7.6, 0.6]].forEach(q => { const l = new T.PointLight(0xffb070, 13, 12, 1.6); l.position.set(q[0], 2.6, q[1]); s.add(l); box(0.1, 0.4, 0.1, iron(), q[0] - 1, 2.5, -0.5, s); gfx.fire(s, q[0] - 1, 2.75, -0.4, 0xffa050, 0.45, 0); });
    const exitLight = new T.PointLight(0xffa040, 10, 9, 1.6); exitLight.position.set(13.5, 2, 0.4); s.add(exitLight);

    const itemsGroup = new T.Group(); s.add(itemsGroup);
    const lights = []; for (let i = 0; i < 9; i++) { const l = new T.PointLight(0xffffff, 0, 8, 1.5); s.add(l); lights.push(l); }
    let occ = {}, fxItems = [], ghost = null, ghostPad = null, crewActors = [];
    const H = {
      scene: s, start: { x: 13.5, z: 1.4 }, zoom: [13.5, 23],
      spots: [{ x: 13.5, z: 0.2, r: 1.6, y: 3.5, label: 'Undercity', act: 'Leave', go: () => G.ui.hub() }],
      itemAt: (x, z) => { const v = occ[Math.round(x) + ',' + Math.round(z)]; return v == null ? -1 : v.i; },
      canPlace: (id, x, z, r, skip) => {
        const it = G.DECOR_BY[id], f = footprint(it, r);
        for (let i = 0; i < f[0]; i++) for (let j = 0; j < f[1]; j++) {
          const cx = x + i, cz = z + j;
          if (cx < 0 || cz < 0 || cx >= GW || cz >= GD) return false;
          if (it.zone === 'house' && !isHouse(cx, cz)) return false;
          if (it.zone === 'garden' && isHouse(cx, cz)) return false;
          if ((cx === 13 || cx === 14) && cz <= 1) return false;                 // keep the exit clear
          const o = occ[cx + ',' + cz]; if (o && o.i !== skip) return false;
        }
        return true;
      },
      refresh: () => {
        while (itemsGroup.children.length) itemsGroup.remove(itemsGroup.children[0]);
        occ = {}; fxItems = []; let li = 0;
        lights.forEach(l => l.intensity = 0);
        crewActors.forEach(c => s.remove(c.root)); crewActors = [];
        (G.state.tally || []).filter(t => !t.job).slice(0, 5).forEach((t, i) => { const q = [[12, 3.2, 2.4], [15.6, 3.6, -1.2], [11.6, 6.6, 0.8], [16, 7.6, -2], [12.4, 10.2, 1.6]][i], c = G.makeChar(G.crew.look(t)); c.root.position.set(q[0], 0, q[1]); c.root.rotation.y = q[2]; s.add(c.root); crewActors.push(c); });
        (G.state.items || []).forEach((p, i) => {
          if (p.hidden) return;
          const it = G.DECOR_BY[p.id]; if (!it) return;
          const f = footprint(it, p.r), g = buildItem(p.id, p.r);
          g.position.set(p.x + (f[0] - 1) / 2, 0, p.z + (f[1] - 1) / 2); itemsGroup.add(g);
          for (let a = 0; a < f[0]; a++) for (let b = 0; b < f[1]; b++) occ[(p.x + a) + ',' + (p.z + b)] = { i, walk: it.walk };
          if (it.light && li < lights.length) { const l = lights[li++]; l.color.set(it.light); l.intensity = 9; l.position.copy(g.position).add(g.userData.lightPos); l.position.y += 0.3; }
          if (g.userData.fx) fxItems.push({ fx: g.userData.fx, x: g.position.x, z: g.position.z });
        });
      },
      setGhost: (pl) => {
        if (ghost) { s.remove(ghost); ghost = null; } if (ghostPad) { s.remove(ghostPad); ghostPad = null; }
        if (!pl) return;
        const it = G.DECOR_BY[pl.id], f = footprint(it, pl.r), ok = H.canPlace(pl.id, pl.x, pl.z, pl.r, pl.from);
        ghost = buildItem(pl.id, pl.r); ghost.position.set(pl.x + (f[0] - 1) / 2, 0.08, pl.z + (f[1] - 1) / 2); s.add(ghost);
        ghostPad = new T.Mesh(new T.PlaneGeometry(f[0] * 0.96, f[1] * 0.96), new T.MeshBasicMaterial({ color: ok ? 0x60ff90 : 0xff5040, transparent: true, opacity: 0.45, depthWrite: false }));
        ghostPad.rotation.x = -Math.PI / 2; ghostPad.position.set(ghost.position.x, 0.05, ghost.position.z); s.add(ghostPad);
        pl.ok = ok;
      },
      blocked: (x, z) => {
        if (x < -0.4 || z < -0.4 || x > GW - 0.6 || z > GD - 0.6) return true;
        if (low.some(q => x > Math.min(q[0], q[2]) - 0.4 && x < Math.max(q[0], q[2]) + 0.4 && z > Math.min(q[1], q[3]) - 0.4 && z < Math.max(q[1], q[3]) + 0.4)) return true;
        for (const dx of [-0.3, 0.3]) for (const dz of [-0.3, 0.3]) { const o = occ[Math.round(x + dx) + ',' + Math.round(z + dz)]; if (o && !o.walk) return true; }
        return false;
      },
      update: (t) => {
        fxItems.forEach(f => {
          if (f.fx === 'fountain' && Math.random() < 0.6) gfx.emit(f.x + R(-0.1, 0.1), 1.35, f.z + R(-0.1, 0.1), R(-0.9, 0.9), R(1.5, 2.6), R(-0.9, 0.9), 0.7, 0x8ae0ff, 7);
          if (f.fx === 'cauldron' && Math.random() < 0.3) gfx.emit(f.x + R(-0.2, 0.2), 0.7, f.z + R(-0.2, 0.2), 0, R(0.5, 1.2), 0, 0.9, 0x8aff5a, 0);
          if (f.fx === 'willow' && Math.random() < 0.25) gfx.emit(f.x + R(-1, 1), R(1, 2.4), f.z + R(-1, 1), 0, -0.25, 0, 1.6, 0x7affc0, 0);
        });
        if (ghost) ghost.position.y = 0.1 + Math.sin(t * 5) * 0.04;
        crewActors.forEach((c, i) => c.pose({ t: t + i * 1.7, act: 'idle' }));
        if (Math.random() < 0.3) gfx.emit(R(0, GW), R(0.3, 2.5), R(HZ, GD), R(-0.15, 0.15), R(0, 0.15), R(-0.15, 0.15), 3, 0x3a5a6a, 0);
      }
    };
    H.refresh();
    return H;
  };

  // ============================================================== WALKING AROUND
  const walker = W.walker = { x: 0, z: 0, face: 0, walk: 0, moving: false, char: null, key: '', place: null, target: null };
  W.enter = function (name, at) {
    const pl = W.get(name), st = G.state;
    gfx.setScene(pl.scene); walker.place = pl; walker.target = null;
    const look = G.lookOf(st.hero, st), key = JSON.stringify(look);
    if (walker.key !== key || !walker.char) { if (walker.char && walker.char.root.parent) walker.char.root.parent.remove(walker.char.root); walker.char = G.makeChar(look); walker.key = key; }
    if (walker.char.root.parent !== pl.scene) pl.scene.add(walker.char.root);
    const p = at || pl.start; walker.x = p.x; walker.z = p.z; walker.face = 0.6;
    gfx.cam.x = p.x; gfx.cam.z = p.z; gfx.cam.y = 0.9; gfx.cam.shake = 0;
    if (pl.refresh) pl.refresh();
    return pl;
  };
  W.walkTo = function (spot) { walker.target = spot; };
  W.updateWalk = function (dt, t, frozen) {
    const pl = walker.place; if (!pl) return null;
    const In = G.input, k = In.keys;
    let ix = 0, iy = 0;
    if (!frozen) {
      ix = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0); iy = (k.KeyS || k.ArrowDown ? 1 : 0) - (k.KeyW || k.ArrowUp ? 1 : 0);
      if (In.stick.active) { ix = In.stick.x; iy = In.stick.y; }
      if (In.usingPad && In.pad && (In.pad.lx || In.pad.ly)) { ix = In.pad.lx; iy = In.pad.ly; }
    }
    let mx = 0, mz = 0;
    if (ix || iy) { const w = gfx.screenToWorld(ix, iy); mx = w.x; mz = w.z; walker.target = null; }
    else if (walker.target && !frozen) {
      const dx = walker.target.x - walker.x, dz = walker.target.z - walker.z, d = Math.hypot(dx, dz);
      if (d < (walker.target.r || 0.3) * 0.7) { const tg = walker.target; walker.target = null; if (tg.go) tg.go(); }
      else { mx = dx / d; mz = dz / d; walker.stuck = (walker.stuck || 0); }
    }
    const l = Math.hypot(mx, mz); walker.moving = l > 0.1;
    if (walker.moving) {
      const sp = 5.2 * Math.min(1, l) * dt, nx = walker.x + mx / l * sp, nz = walker.z + mz / l * sp, ox = walker.x, oz = walker.z;
      if (!pl.blocked(nx, walker.z)) walker.x = nx;
      if (!pl.blocked(walker.x, nz)) walker.z = nz;
      if (walker.target && Math.hypot(walker.x - ox, walker.z - oz) < sp * 0.2) { walker.stuckT = (walker.stuckT || 0) + dt; if (walker.stuckT > 0.5) { walker.target = null; walker.stuckT = 0; } } else walker.stuckT = 0;
      walker.face = Math.atan2(mx, mz); walker.walk += dt * 12;
    }
    const c = walker.char; c.root.position.set(walker.x, 0, walker.z);
    let d = walker.face - c.root.rotation.y; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; c.root.rotation.y += d * Math.min(1, dt * 14);
    c.pose({ t, act: 'idle', moving: walker.moving, walk: walker.walk });
    const cam = gfx.cam, kk = Math.min(1, dt * 5);
    cam.x += (walker.x - cam.x) * kk; cam.z += (walker.z - cam.z) * kk; cam.fx = 0.5; cam.fy = gfx.portrait ? 0.45 : 0.5;
    cam.vh += ((gfx.portrait ? pl.zoom[1] : pl.zoom[0]) - cam.vh) * kk;
    pl.update(t, dt);
    let near = null, best = 1e9;
    pl.spots.forEach(sp => { const dd = Math.hypot(sp.x - walker.x, sp.z - walker.z); if (dd < sp.r && dd < best) { best = dd; near = sp; } });
    return near;
  };
})();
