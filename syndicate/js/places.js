// Underground Syndicate — walkable isometric places: the undercity street and the hideout (with grid-placed decor)
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, box = gfx.box, mesh = gfx.mesh;
  const { wall, brazier, lantern, stoneMat, tiles } = W.props;
  const R = (a, b) => a + Math.random() * (b - a);
  const L = c => gfx.lambert(c);
  const iron = () => L(0x1c1a1e);
  let _w1 = null, _w2 = null;
  const wood = () => _w1 || (_w1 = new T.MeshLambertMaterial({ color: 0x8a5c38, map: gfx.tex('wood'), flatShading: true })), woodD = () => _w2 || (_w2 = new T.MeshLambertMaterial({ color: 0x5c3c24, map: gfx.tex('wood'), flatShading: true }));
  const brickMat = (c, rx, ry) => { const t = gfx.tex('brick').clone(); t.needsUpdate = true; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); return new T.MeshLambertMaterial({ color: c, map: t, flatShading: true }); };
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

  // ============================================================== UNDERCITY: the Lamp Market, a plaza under the Pit
  W.buildHub = function () {
    const s = gfx.newScene({ ambient: 1.5, key: 1.35, shadowSize: 24, sky: 0x8a88c0, ground: 0x241c1a, keyColor: 0xd8d0ff });
    s.fog = new T.Fog(0x07060a, 74, 116);
    const X1 = 29, Z1 = 17, key = s.userData.key; key.position.set(24, 22, 24); key.target.position.set(14, 0, 8);
    const cells = [], plaza = new T.Color(1.12, 1.06, 0.98), lane = new T.Color(1.34, 1.26, 1.1);
    // worn paths: the promenade along the north row, the west lane to your door, and spokes into the square
    const onLane = (x, z) => (z >= 2 && z <= 3 && x >= 0 && x <= 28) || (x >= 1 && x <= 2 && z >= 2 && z <= 15) || (x >= 13 && x <= 15 && z >= 3 && z <= 5) || (z >= 8 && z <= 10 && x >= 2 && x <= 9) || (z >= 8 && z <= 10 && x >= 19 && x <= 23) || (x >= 22 && x <= 23 && z >= 3 && z <= 8) || (z >= 5 && z <= 6 && x >= 23 && x <= 25);
    for (let x = -1; x <= X1 + 1; x++) for (let z = -1; z <= Z1 + 1; z++) cells.push({ x, z, tint: Math.hypot(x - 14, z - 9) < 4.6 ? plaza : onLane(x, z) ? lane : null });
    tiles(s, cells, 'cobble', [0.5, 0.5, 0.56]);
    const m1 = stoneMat(0x6f6a72), m2 = stoneMat(0x56525c), m3 = stoneMat(0x625a5a);
    // building line on the two far sides, broken into houses of different heights
    const b1 = brickMat(0x8a8088, 11, 2), b2 = brickMat(0x74707c, 8, 2), bh1 = brickMat(0x8a7a78, 2.2, 0.7), bh2 = brickMat(0x726c7a, 2.2, 0.7);
    const bw = wall(s, X1 + 5, 5.2, 1, b1); bw.position.set(X1 / 2, 0, -2.05);
    const lw = wall(s, Z1 + 5, 5.2, 1, b2); lw.position.set(-2.05, 0, Z1 / 2); lw.rotation.y = Math.PI / 2;
    [[2, 7.5, 6.6, bh1], [12, 6, 7.4, bh2], [18, 5, 6.2, bh1], [23, 6.5, 7.8, bh2], [28.5, 4, 6.4, bh1]].forEach(q => { box(q[1], q[2] - 5.2, 1.6, q[3], q[0], 5.2 + (q[2] - 5.2) / 2, -2.5, s); box(q[1] + 0.5, 0.35, 2.3, m2, q[0], q[2] + 0.15, -2.5, s); });
    [[3, 6, 6.8, bh1], [10, 5, 6.2, bh2], [15.5, 4, 7.2, bh1]].forEach(q => { box(1.6, q[2] - 5.2, q[1], q[3], -2.5, 5.2 + (q[2] - 5.2) / 2, q[0], s); box(2.3, 0.35, q[1] + 0.5, m2, -2.5, q[2] + 0.15, q[0], s); });
    for (let i = 0; i < 10; i++) { windowLight(s, 1 + i * 3.1, 3.9, -1.5, 0); if (i % 3 === 0) windowLight(s, 1.6 + i * 3.1, 6.1, -1.65, 0); if (i < 6) windowLight(s, -1.5, 3.9, 1.2 + i * 3.2, Math.PI / 2); }
    [[-1.6, -1.6], [8.3, -1.7], [17.2, -1.7], [22.6, -1.7], [28.6, -1.7], [-1.7, 6], [-1.7, 12.4]].forEach(p => box(1.1, 6, 1.1, m2, p[0], 3, p[1], s));
    box(X1 + 3.4, 0.4, 0.5, m2, X1 / 2, 0.1, Z1 + 1.65, s); box(0.5, 0.4, Z1 + 3.4, m2, X1 + 1.65, 0.1, Z1 / 2, s);
    for (let x = 1; x < X1; x += 4) box(0.4, 0.9, 0.4, m2, x, 0.45, Z1 + 1.65, s);
    for (let z = 1; z < Z1; z += 4) box(0.4, 0.9, 0.4, m2, X1 + 1.65, 0.45, z, s);
    const ban = (x, y, z, rot, bg) => { const m = new T.Mesh(new T.PlaneGeometry(1.1, 2.2), new T.MeshLambertMaterial({ map: gfx.bannerTex(bg, '#d9a93c'), transparent: true, alphaTest: 0.5, side: T.DoubleSide })); m.position.set(x, y, z); m.rotation.y = rot; s.add(m); };

    // ---- the Blood Pit gate
    doorway(s, 5, -1.45, 0, 0xff4020, 2.8, 3.4);
    brazier(s, 2.8, 0, -0.6, 28, 0xff7030); brazier(s, 7.2, 0, -0.6, 28, 0xff7030);
    ban(1.4, 3.3, -1.5, 0, '#7a1c22'); ban(8.6, 3.3, -1.5, 0, '#7a1c22');
    box(3.6, 0.12, 2.2, stoneMat(0x4a2a2a), 5, 0.02, 0.2, s);
    // ---- notice board
    box(1.7, 1.25, 0.1, woodD(), 11, 1.9, -1.5, s); [[-0.45, 0.2, 0.5, 0.6], [0.3, 0.25, 0.55, 0.45], [0.05, -0.3, 0.7, 0.4], [-0.5, -0.32, 0.36, 0.34]].forEach(q => { const m = new T.Mesh(new T.PlaneGeometry(q[2], q[3]), new T.MeshLambertMaterial({ color: 0xdccba3 })); m.position.set(11 + q[0], 1.9 + q[1], -1.43); m.rotation.z = q[0] * 0.2; s.add(m); });
    crate(s, 12.6, -0.7, 0.8); crate(s, 13.3, -0.9, 0.6);
    // ---- the Fence
    stall(s, 15.6, -0.3, 0x245a44, [0x7ad0ff, 0xffd36b, 0xff7a7a, 0x9aff8a]);
    const fence = npc(s, { cls: 'rogue', race: 'human', tint: { cloth: '#245a44', armor: '#3a4a40' } }, 15.6, -1.0, 0);
    lantern(s, 17.6, 0, -0.9, 0xffb060, 16);
    // ---- the Guildmaster
    ban(20.4, 3.1, -1.5, 0, '#5a1f7a');
    const gm = npc(s, { cls: 'sorcerer', race: 'elf', tint: { cloth: '#4a2a7a', armor: '#3a2060', armor2: '#2a1648', hair: '#e8e2f4', trim: '#d9a93c' } }, 20.4, -0.2, 0.2);
    box(1.8, 0.25, 1.8, m1, 20.4, 0.02, -0.2, s); box(1.0, 1.0, 0.6, woodD(), 21.6, 0.5, -0.6, s); box(0.8, 0.1, 0.5, L(0x5a1f1f), 21.6, 1.05, -0.6, s);
    lantern(s, 19, 0, -0.8, 0xb070ff, 18);
    // ---- Mark's corner: the Long Odds
    const mk = new T.Group(); mk.position.set(25.6, 0, 0.2); s.add(mk);
    [[-1.9, -1.1], [1.9, -1.1], [-1.9, 1.3], [1.9, 1.3]].forEach(q => mesh(new T.CylinderGeometry(0.07, 0.07, 2.7, 5), woodD(), q[0], 1.35, q[1], mk));
    const aw = box(4.3, 0.1, 2.9, L(0x1f5a3a), 0, 2.78, 0.1, mk); aw.rotation.x = 0.1; box(4.3, 0.34, 0.07, L(0xd9a93c), 0, 2.5, 1.5, mk);
    mesh(new T.CylinderGeometry(1.15, 1.15, 0.12, 12), L(0x1f5a3a), 0, 0.92, 0.5, mk); mesh(new T.CylinderGeometry(1.2, 1.2, 0.08, 12), woodD(), 0, 0.86, 0.5, mk); mesh(new T.CylinderGeometry(0.16, 0.3, 0.86, 6), woodD(), 0, 0.43, 0.5, mk);
    [[-0.3, 0.4], [0.1, 0.7], [0.35, 0.3]].forEach((q, i) => { const d = box(0.13, 0.13, 0.13, L(0xefe8d6), q[0], 1.05, q[1], mk); d.rotation.y = i; });
    for (let i = 0; i < 9; i++) { const c = mesh(new T.CylinderGeometry(0.07, 0.07, 0.02, 8), new T.MeshPhongMaterial({ color: 0xf0c95a, shininess: 90 }), -0.6 + (i % 3) * 0.09, 1.0 + Math.floor(i / 3) * 0.022, 0.75 + (i % 2) * 0.05, mk); c.castShadow = false; }
    [-1.2, 1.2].forEach(x => { mesh(new T.CylinderGeometry(0.2, 0.2, 0.5, 7), wood(), x, 0.25, 1.5, mk); });
    box(1.5, 1.0, 0.1, woodD(), 0, 1.9, -1.55, mk); for (let i = 0; i < 3; i++) box(1.3, 0.04, 0.12, L(0xdccba3), 0, 2.15 - i * 0.25, -1.48, mk);
    gfx.fire(mk, -1.7, 2.2, 1.2, 0x8aff5a, 0.4, 0); gfx.fire(mk, 1.7, 2.2, 1.2, 0xffd36b, 0.4, 0);
    const mkL = new T.PointLight(0xa0ffb0, 16, 11, 1.6); mkL.position.set(0, 2.2, 0.8); mk.add(mkL);
    const mark = npc(s, G.mark.look, 25.6, -0.5, 0);
    const punter = npc(s, { cls: 'fighter', race: 'dwarf', tint: { cloth: '#5a3a2a', armor: '#4a4038' } }, 24.4, 1.4, 1.2);
    // ---- west side: the Low Lamp, your door, a shuttered chandler's
    doorway(s, -1.45, 3, Math.PI / 2, 0xffb060, 1.4, 2.4);
    box(0.08, 0.5, 0.9, woodD(), -1.0, 3.1, 3, s); { const lm = new T.Mesh(new T.BoxGeometry(0.2, 0.26, 0.2), emis(0xffe0a0)); lm.position.set(-0.8, 2.7, 3); s.add(lm); gfx.fire(s, -0.8, 2.5, 3, 0xffb060, 0.4, 12); }
    barrel(s, -0.3, 1.4); barrel(s, 0.3, 4.6); box(0.9, 0.08, 0.6, wood(), 0.6, 0.55, 1.6, s); box(0.1, 0.55, 0.1, woodD(), 0.6, 0.27, 1.6, s);
    doorway(s, -1.45, 9, Math.PI / 2, 0x50b0ff, 1.5, 2.5);
    lantern(s, -0.9, 0, 10.7, 0x60b8ff, 16, 2.0).rotation.y = -Math.PI / 2;
    // (the Long Stair gate stands here: see life.js)
    // ---- the First Lamp: the monument in the middle of the market
    const mon = new T.Group(); mon.position.set(14, 0, 9); s.add(mon);
    mesh(new T.CylinderGeometry(2.4, 2.6, 0.35, 10), m1, 0, 0.17, 0, mon); mesh(new T.CylinderGeometry(1.6, 1.8, 0.35, 10), m2, 0, 0.5, 0, mon); mesh(new T.CylinderGeometry(0.4, 0.55, 2.6, 8), m1, 0, 1.95, 0, mon);
    mesh(new T.CylinderGeometry(0.75, 0.4, 0.3, 8), iron(), 0, 3.4, 0, mon); const fl = new T.Mesh(new T.BoxGeometry(0.5, 0.7, 0.5), emis(0xfff0c8)); fl.position.y = 3.95; mon.add(fl); mesh(new T.ConeGeometry(0.6, 0.5, 4), iron(), 0, 4.55, 0, mon).rotation.y = 0.78;
    gfx.fire(mon, 0, 3.7, 0, 0xffc060, 1.0, 34);
    [0, 1.57, 3.14, 4.71].forEach(a => box(1.2, 0.5, 0.4, m2, Math.cos(a) * 2.9, 0.25, Math.sin(a) * 2.9, mon).rotation.y = -a + 1.57);
    // ---- market stalls, kept in two clusters so the middle stays open
    stall(s, 7, 12.6, 0x4a2a6a, [0xc080ff, 0x80ffd0, 0xff80c0]).rotation.y = Math.PI;
    stall(s, 10.6, 14.2, 0x6a3a1a, [0xffc070, 0xff9050, 0xffe0a0]).rotation.y = Math.PI;
    stall(s, 21.5, 13, 0x1a4a6a, [0x80d0ff, 0xa0ffe0, 0xd0f0ff]).rotation.y = Math.PI;
    stall(s, 25, 9.5, 0x6a1a2a, [0xff7a7a, 0xffb0a0, 0xffd36b]).rotation.y = -Math.PI / 2;
    const k1 = npc(s, { cls: 'cleric', race: 'dwarf', tint: { cloth: '#3a3038', armor: '#4a4048' } }, 7, 13.4, Math.PI), k2 = npc(s, { cls: 'rogue', race: 'halforc', tint: { cloth: '#6a3a1a', armor: '#4a3a30' } }, 10.6, 15, Math.PI), k3 = npc(s, { cls: 'sorcerer', race: 'human', tint: { cloth: '#1a4a6a', armor: '#203a50', hair: '#2a2a2a' } }, 21.5, 13.8, Math.PI), k4 = npc(s, { cls: 'cleric', race: 'tiefling', tint: { cloth: '#6a1a2a', armor: '#4a2028' } }, 25.9, 9.5, -Math.PI / 2);
    // ---- a well, a beggars' fire, carts and clutter
    mesh(new T.CylinderGeometry(0.9, 1.0, 0.8, 10), m2, 4, 0.4, 14, s); const wt = new T.Mesh(new T.CylinderGeometry(0.72, 0.72, 0.05, 10), emis(0x162838)); wt.position.set(4, 0.72, 14); s.add(wt); [-0.85, 0.85].forEach(x => box(0.12, 1.6, 0.12, woodD(), 4 + x, 1.4, 14, s)); box(2.0, 0.12, 0.3, woodD(), 4, 2.2, 14, s);
    mesh(new T.CylinderGeometry(0.4, 0.34, 0.8, 8), iron(), 27, 0.4, 15.4, s); gfx.fire(s, 27, 0.9, 15.4, 0xff8a30, 0.7, 14);
    const sit = npc(s, { cls: 'rogue', race: 'dwarf', tint: { cloth: '#3a3028', armor: '#3a3430' } }, 25.9, 15.8, 1.3), sit2 = npc(s, { cls: 'cleric', race: 'human', tint: { cloth: '#4a4238', armor: '#3a3632' } }, 27.8, 14.4, -2.6);
    { const c = new T.Group(); c.position.set(18.5, 0, 15.6); c.rotation.y = 0.4; s.add(c); box(2.2, 0.14, 1.2, wood(), 0, 0.7, 0, c); box(2.2, 0.5, 0.08, woodD(), 0, 1.0, 0.6, c); box(2.2, 0.5, 0.08, woodD(), 0, 1.0, -0.6, c); [-0.8, 0.8].forEach(x => { const w = mesh(new T.CylinderGeometry(0.5, 0.5, 0.1, 10), woodD(), x, 0.5, 0.7, c); w.rotation.x = Math.PI / 2; const w2 = mesh(new T.CylinderGeometry(0.5, 0.5, 0.1, 10), woodD(), x, 0.5, -0.7, c); w2.rotation.x = Math.PI / 2; }); crate(c, -0.4, 0, 0.6); c.children[c.children.length - 1].position.y = 1.07; c.children[c.children.length - 2].position.y = 1.07; }
    crate(s, 0.3, 12.4, 0.7); crate(s, 1.0, 12.9, 0.5); barrel(s, 28.4, 2.6); barrel(s, 28.5, 8.1); crate(s, 9.2, -0.6, 0.6); barrel(s, 22.8, -0.7); crate(s, 16.5, 8.2, 0.5);
    [[9, 5.5], [19.5, 5.5], [8.5, 16.3], [20, 9.5], [27.6, 11.8], [3, 7.2], [13, 16.6]].forEach((q, i) => lantern(s, q[0], 0, q[1], i % 3 === 2 ? 0xb070ff : 0xffb060, i < 3 ? 15 : 0));
    // strung lamps and puddles
    [[1, 9], [12, 19], [21, 29]].forEach((q, n) => { for (let i = 0; i <= 10; i++) { const u = i / 10, x = q[0] + (q[1] - q[0]) * u, y = 4.4 - Math.sin(u * Math.PI) * 0.7, col = [0xffc070, 0xc080ff, 0x80d0ff, 0x9aff8a][(i + n) % 4]; if (i % 2 === 0) { const b = new T.Mesh(new T.SphereGeometry(0.07, 6, 5), emis(col)); b.position.set(x, y, -0.8); s.add(b); gfx.glow(col, 0.6, x, y, -0.8, s, 0.5); } } });
    [[6.5, 6.5, 1.6], [17, 12.2, 1.2], [11.5, 3.2, 0.9], [23, 6.6, 1.4], [3.5, 10.6, 1.1], [20.5, 16.2, 1.0]].forEach(q => { const d = new T.Mesh(new T.CircleGeometry(q[2], 14), new T.MeshBasicMaterial({ color: 0x1a2030, transparent: true, opacity: 0.55, depthWrite: false })); d.rotation.x = -Math.PI / 2; d.position.set(q[0], 0.012, q[1]); d.scale.y = 0.6; s.add(d); });

    // ---- people going about their business (routes kept apart so the square never bunches up)
    const TINTS = [{ cloth: '#5a3a2a', armor: '#4a4038' }, { cloth: '#2a4a5a', armor: '#3a4048' }, { cloth: '#5a2a4a', armor: '#3a3040' }, { cloth: '#3a5a3a', armor: '#3a4038' }, { cloth: '#6a5a3a', armor: '#4a4438' }, { cloth: '#3a3a5a', armor: '#30304a' }];
    const walkers = [[[1.5, 5.4], [21.4, 5.2]], [[27.5, 3.8], [8.6, 4.0]], [[2.2, 11.3], [10.4, 10.7]], [[23.65, 16.4], [23.65, 11.6]], [[2, 15.6], [15.5, 16.6]], [[19.5, 3.6], [22.5, 10.8]]]
      .map((pth, i) => ({ c: npc(s, { cls: ['rogue', 'cleric', 'fighter', 'sorcerer', 'rogue', 'cleric'][i], race: Object.keys(G.RACES)[i % 5], tint: TINTS[i] }, pth[0][0], pth[0][1], 0), a: pth[0], b: pth[1], u: Math.random(), dir: 1, wait: Math.random() * 3, sp: 0.03 + i * 0.006 }));
    const CHAT = ['…heard Vexa has never once blinked.', 'Long live Queen Eerin. From up there.', 'They say Vilhelm the Fourth watches the pit in a plain cloak.', 'No seals down here. That is the whole point.', 'Crown’s tithe went up the stair this morning.', 'Guild raised the rent again.', 'Glowcaps are coming in nicely.', 'Put ten coin on the new one. Ten!', 'Nobody leaves the Ledger.', 'Different carts, he says.', 'My cousin fought Brakk. Once.', 'The Light went ahead to wait.', 'They say the Keeper never sleeps.', 'Highmarch sealed another stair.', 'Mark owes me money. Mark owes everyone money.', 'Meet me by the First Lamp.'];
    const MARKSAY = ['I have got a guy, bro. The guy is me.', 'Real ones bet big.', 'Odds! Fresh odds!', 'Bro. BRO. Look at this roll.', '…what were we doing?', 'Respect. Respect.'];
    let chatT = 4, markT = 6;
    const npcs = [fence, gm, mark, punter, k1, k2, k3, k4, sit, sit2];
    const obstacles = [[14, -1.6, 17.2, 0.7], [19.4, -1, 22.2, 0.7], [23.5, -1.2, 27.7, 1.9], [12.1, -1.3, 13.8, -0.2], [2.4, -1.1, 3.2, -0.2], [6.8, -1.1, 7.6, -0.2], [11.2, 6.2, 16.8, 11.8], [5.4, 11.8, 8.6, 13.8], [9, 13.4, 12.2, 15.4], [19.9, 12.2, 23.1, 14.2], [24.2, 7.9, 26.3, 11.1], [3, 13, 5, 15], [26.5, 14.9, 27.5, 15.9], [17.2, 14.8, 19.8, 16.4], [-0.7, 1, 0.1, 1.8], [-0.1, 4.2, 0.7, 5], [0.1, 1.2, 1.1, 2], [27.8, 3.8, 28.7, 5.5], [-0.1, 12, 1.4, 13.3]];
    // thresholds: a coloured ring on the ground wherever something can be used, so destinations read from across the square
    [[5, 0.4, 0xff5030], [11, 0.6, 0xdccba3], [15.6, 1.3, 0x4ad0a0], [20.4, 1.3, 0xb070ff], [25.6, 2.5, 0x8aff5a], [24.9, 5.4, 0x6af0ff], [-0.2, 3, 0xffb060], [-0.2, 9, 0x60b8ff], [1.3, 14.5, 0xe8e4f8]].forEach(q => { const r = new T.Mesh(new T.RingGeometry(0.62, 0.78, 28), new T.MeshBasicMaterial({ color: q[2], transparent: true, opacity: 0.5, depthWrite: false })); r.rotation.x = -Math.PI / 2; r.position.set(Math.max(0.3, q[0]), 0.03, q[1]); s.add(r); const d = new T.Mesh(new T.CircleGeometry(0.62, 24), new T.MeshBasicMaterial({ color: q[2], transparent: true, opacity: 0.1, depthWrite: false })); d.rotation.x = -Math.PI / 2; d.position.copy(r.position); s.add(d); });
    // bout posters and damp on the walls
    { const pm = new T.MeshLambertMaterial({ map: gfx.tex('poster') }); [[1.9, 0], [9.6, 0.06], [10.3, -0.05], [13.9, 0.04], [18.2, -0.07], [22.9, 0.05], [28, -0.04]].forEach(q => { const p2 = new T.Mesh(new T.PlaneGeometry(0.62, 0.86), pm); p2.position.set(q[0], 1.75, -1.42); p2.rotation.z = q[1]; s.add(p2); }); [[5.6, 0.05], [7.2, -0.06], [12.2, 0.04], [16.4, -0.05]].forEach(q => { const p2 = new T.Mesh(new T.PlaneGeometry(0.62, 0.86), pm); p2.position.set(-1.42, 1.75, q[0]); p2.rotation.y = Math.PI / 2; p2.rotation.z = q[1]; s.add(p2); });
      for (let i = 0; i < 16; i++) { const d = gfx.decal(gfx.tex('blood'), R(1.2, 2.6), i % 3 ? 0x24301c : 0x101418, R(0.35, 0.6)); if (i < 10) d.position.set(R(0, 29), 0.014 + i * 0.0006, R(-0.3, 0.5)); else d.position.set(R(-0.3, 0.5), 0.014 + i * 0.0006, R(0, 17)); d.rotation.z = R(0, 6); s.add(d); } }
    const life = W.hubLife ? W.hubLife(s, obstacles) : null;
    return {
      scene: s, start: { x: 13.5, z: 4.5 }, zoom: [13.5, 22], bounds: [0, 0, 29, 17],
      spots: [
        { x: 5, z: 0.4, r: 2.2, y: 4.7, label: 'The Blood Pit', act: 'Enter the pit', go: () => G.ui.pit(), badge: () => !G.state.wins.grubb },
        { x: 11, z: 0.6, r: 1.5, y: 3.0, label: 'Notice Board', act: 'Read the board', go: () => G.ui.board(), badge: () => !G.state.contract },
        { x: 15.6, z: 1.3, r: 1.9, y: 3.2, label: 'The Fence', act: 'Trade', go: () => G.meet('fence', () => G.ui.shop()), badge: () => !(G.state.met || {}).fence },
        { x: 20.4, z: 1.3, r: 1.9, y: 3.2, label: 'Guildmaster', act: 'Character', go: () => G.meet('gm', () => G.ui.sheet()), badge: () => !(G.state.met || {}).gm || G.state.hero.known.some(id => !G.state.hero.slots.includes(id)) && G.state.hero.slots.includes(null) },
        { x: 25.6, z: 2.5, r: 1.9, y: 3.6, label: 'Mark · The Long Odds', act: 'Gamble', go: () => G.meet('mark', () => G.ui.mark()), badge: () => !(G.state.met || {}).mark || !!G.state.schemeDone },
        { x: 24.9, z: 5.4, r: 1.7, y: 4.4, label: 'The Wisp Table', act: 'Roll the wispdice', go: () => G.ui.wisp() },
        { x: -0.2, z: 3, r: 1.6, y: 3.5, label: 'The Low Lamp', act: 'See your Tally', go: () => G.ui.tally(), badge: () => (G.state.reports || []).length > 0 || (G.state.tally || []).some(t => !t.job) && G.state.second == null },
        { x: -0.2, z: 9, r: 1.9, y: 3.6, label: 'Your Hideout', act: 'Go home', go: () => G.ui.hideout() },
        { x: 1.3, z: 14.5, r: 1.5, y: 4.2, label: 'The Long Stair', act: 'Read the proclamation', go: () => G.ui.stair(), badge: () => G.state.stairSeen !== (Object.keys(G.state.wins).length + (G.state.losses || 0)) }
      ],
      blocked: (x, z) => x < -0.55 || x > X1 + 0.9 || z < -0.75 || z > Z1 + 0.9 || obstacles.some(o => x > o[0] - 0.35 && x < o[2] + 0.35 && z > o[1] - 0.35 && z < o[3] + 0.35),
      update: (t) => {
        if (life) life(t);
        npcs.forEach((c, i) => c.pose({ t: t + i * 2, act: 'idle' }));
        mark.pose({ t, act: Math.sin(t * 0.7) > 0.6 ? 'cast' : 'idle', prog: 0.3 });
        const dt2 = 0.016;
        walkers.forEach(w => {
          if (w.wait > 0) { w.wait -= dt2; w.c.pose({ t, act: 'idle' }); return; }
          w.u += w.dir * w.sp * dt2 * 4; if (w.u > 1 || w.u < 0) { w.u = Math.max(0, Math.min(1, w.u)); w.dir *= -1; w.wait = 2 + Math.random() * 4; }
          const x = w.a[0] + (w.b[0] - w.a[0]) * w.u, z = w.a[1] + (w.b[1] - w.a[1]) * w.u; w.c.root.position.set(x, 0, z);
          w.c.root.rotation.y = Math.atan2((w.b[0] - w.a[0]) * w.dir, (w.b[1] - w.a[1]) * w.dir); w.c.pose({ t, act: 'idle', moving: true, walk: t * 7 + w.sp * 99 });
        });
        const quiet = G.scene === 'hub' && !G.ui.isOpen();
        chatT -= dt2; if (chatT <= 0 && quiet) { chatT = 6 + Math.random() * 6; const w = walkers[Math.floor(Math.random() * walkers.length)], p = w.c.root.position; gfx.floatText(p.x, 2.6, p.z, CHAT[Math.floor(Math.random() * CHAT.length)], '#d8ccb0'); }
        markT -= dt2; if (markT <= 0 && quiet) { markT = 9 + Math.random() * 8; gfx.floatText(25.6, 2.9, -0.5, MARKSAY[Math.floor(Math.random() * MARKSAY.length)], '#a0ffb0'); }
        if (Math.random() < 0.12) gfx.emit(25.6 + R(-0.15, 0.15), 1.9, -0.3, R(-0.1, 0.1), R(0.4, 0.8), R(-0.1, 0.1), 1.8, 0x3a7a5a, 0);       // glowcap pipe smoke
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
  W.buildItem = (id, r, off) => buildItem(id, r, off); W.wallBuilders = () => WALLB; W.BUILD = BUILD;
  function buildItem(id, r, off) {
    const it = G.DECOR_BY[id], g = new T.Group(), inner = new T.Group(); g.add(inner);
    const lp = BUILD[id](inner); inner.rotation.y = -(r || 0) * Math.PI / 2;
    g.userData.lightPos = lp ? new T.Vector3(lp[0], lp[1], lp[2]).applyAxisAngle(new T.Vector3(0, 1, 0), inner.rotation.y) : null;
    if (it.light) gfx.glow(it.light, 2.6, g.userData.lightPos.x, g.userData.lightPos.y, g.userData.lightPos.z, g, 0.45);
    g.userData.fx = inner.userData.fx;
    if (off) { g.userData.fx = null; g.traverse(o => { if (o.isSprite) o.visible = false; else if (o.isMesh && o.material && o.material.isMeshBasicMaterial && !o.material.map) { o.material = o.material.clone(); o.material.color.multiplyScalar(0.18); } }); }
    return g;
  }

  // ============================================================== HIDEOUT (the room builder)
  const GW = 18, GD = 16, HX = 9, HZ = 6, isHouse = (x, z) => x <= HX && z <= HZ;
  W.grid = { GW, GD, isHouse, footprint };
  const jit = (x, z) => 0.82 + (((x * 73 + z * 31 + x * z * 7) % 11) / 11) * 0.24;
  const FLOORP = {
    flag: (x, z) => { const k = jit(x, z); return [0.72 * k, 0.66 * k, 0.6 * k]; },
    checker: (x, z) => (x + z) % 2 ? [0.17, 0.17, 0.21] : [0.88, 0.85, 0.8],
    wood: (x, z) => { const k = 0.78 + ((x * 5 + z * 3) % 5) * 0.07; return [0.66 * k, 0.43 * k, 0.25 * k]; },
    carpet: (x, z) => (x === 0 || z === 0 || x === HX || z === HZ) ? [0.9, 0.68, 0.24] : [0.62 * jit(x, z), 0.11, 0.15],
    mosaic: (x, z) => [[0.2, 0.62, 0.64], [0.92, 0.76, 0.34], [0.24, 0.3, 0.62], [0.2, 0.62, 0.64]][(x * 2 + z) % 4],
    moss: (x, z) => { const k = jit(x, z), p = (x === 13 || x === 14) && z < 9 ? 1.25 : 1; return [0.62 * k * p, 0.78 * k * p * (p > 1 ? 0.92 : 1), 0.6 * k * p]; },
    gravel: (x, z) => { const k = 0.8 + (Math.round(Math.hypot(x - 13, z - 11)) % 2) * 0.16; return [0.74 * k, 0.72 * k, 0.7 * k]; },
    glow: (x, z) => { const k = jit(x, z); return [0.36 * k, 0.98 * k, 0.8 * k]; }
  };
  // things that hang on the house walls. Built facing +Z with the wall surface at z = 0.
  const WALLB = {
    poster: g => { const m = new T.Mesh(new T.PlaneGeometry(0.7, 0.95), L(0xdccba3)); m.position.set(0, 1.9, 0.02); g.add(m); box(0.3, 0.3, 0.02, L(0x2a1c10), 0, 2.05, 0.03, g); box(0.4, 0.05, 0.02, L(0x5e120f), 0, 1.72, 0.03, g); box(0.3, 0.04, 0.02, L(0x2a1c10), 0, 1.6, 0.03, g); },
    sconce: g => { box(0.1, 0.5, 0.14, iron(), 0, 1.9, 0.07, g); mesh(new T.CylinderGeometry(0.16, 0.08, 0.18, 6), iron(), 0, 2.1, 0.2, g); gfx.fire(g, 0, 2.25, 0.2, 0xffb060, 0.42, 0); return [0, 2.3, 0.5]; },
    blades: g => { const st = new T.MeshPhongMaterial({ color: 0xcfd8e0, shininess: 70, flatShading: true }); [-1, 1].forEach(sd => { const b = box(0.08, 1.3, 0.03, st, 0, 2.0, 0.05, g); b.rotation.z = sd * 0.75; const gd = box(0.3, 0.06, 0.05, L(0xb09a5a), -sd * 0.33, 1.63, 0.05, g); gd.rotation.z = sd * 0.75; }); mesh(new T.CylinderGeometry(0.16, 0.16, 0.06, 8), L(0xb09a5a), 0, 2.0, 0.08, g).rotation.x = Math.PI / 2; },
    jars: g => { box(1.0, 0.07, 0.3, woodD(), 0, 1.7, 0.16, g); [0x8aff9a, 0x8ad0ff, 0xc79bff, 0xffb060].forEach((c, i) => { const j = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.26, 7), emis(c)); j.position.set(-0.36 + i * 0.24, 1.87, 0.16); g.add(j); gfx.glow(c, 0.5, -0.36 + i * 0.24, 1.9, 0.2, g, 0.5); }); return [0, 1.9, 0.5]; },
    tapestry: g => { const m = new T.Mesh(new T.PlaneGeometry(1.05, 2.3), new T.MeshLambertMaterial({ map: gfx.bannerTex('#5a1f7a', '#d9a93c'), transparent: true, alphaTest: 0.5 })); m.position.set(0, 1.75, 0.03); g.add(m); box(1.2, 0.07, 0.07, woodD(), 0, 2.9, 0.05, g); },
    portrait: g => { box(0.95, 1.15, 0.06, new T.MeshPhongMaterial({ color: 0xd9a93c, shininess: 80, flatShading: true }), 0, 2.0, 0.03, g); let src = ''; try { src = G.portrait(G.lookOf(G.state.hero, G.state), 64).src; } catch (e) { } const tex = src ? new T.TextureLoader().load(src) : null; if (tex) tex.colorSpace = T.SRGBColorSpace; const m = new T.Mesh(new T.PlaneGeometry(0.78, 0.98), new T.MeshBasicMaterial({ map: tex, color: tex ? 0xffffff : 0x3a2c3f })); m.position.set(0, 2.0, 0.065); g.add(m); },
    skull: g => { box(0.9, 0.9, 0.08, woodD(), 0, 2.1, 0.04, g); const bn = L(0xe8dfc8), sk = mesh(new T.SphereGeometry(0.3, 8, 6), bn, 0, 2.15, 0.3, g); sk.scale.set(1, 0.9, 1.25); box(0.34, 0.2, 0.3, bn, 0, 1.95, 0.5, g); [-1, 1].forEach(sd => { const h = mesh(new T.ConeGeometry(0.09, 0.8, 5), bn, sd * 0.5, 2.5, 0.25, g); h.rotation.z = -sd * 0.9; box(0.09, 0.09, 0.05, L(0x15131a), sd * 0.12, 2.2, 0.56, g); }); }
  };
  W.buildHideout = function () {
    const s = gfx.newScene({ ambient: 1.3, key: 1.15, shadowSize: 20, sky: 0x7a80b8, ground: 0x182018, keyColor: 0xc8d0ff });
    s.fog = new T.Fog(0x07060a, 74, 112);
    const key = s.userData.key; key.position.set(18, 20, 20); key.target.position.set(8, 0, 7);
    const house = [], garden = [], pc = new T.Color();
    for (let x = 0; x < GW; x++) for (let z = 0; z < GD; z++) (isHouse(x, z) ? house : garden).push({ x, z });
    const houseIM = tiles(s, house, 'stone', [0.72, 0.66, 0.6]), gardenIM = tiles(s, garden, 'moss', [0.62, 0.78, 0.6]);
    const paint = (im, cells, fn, bright) => { cells.forEach((c, i) => { const k = fn(c.x, c.z); pc.setRGB(k[0] * bright, k[1] * bright, k[2] * bright); im.setColorAt(i, pc); }); im.instanceColor.needsUpdate = true; };
    const stD = stoneMat(0x645e58), wallMat = stoneMat(0x857d74), st = wallMat, rock = new T.MeshLambertMaterial({ color: 0x4a4650, map: gfx.tex('rock'), flatShading: true });
    const w1 = wall(s, HX + 1.7, 3.2, 0.6, wallMat); w1.position.set(HX / 2, 0, -0.85);
    const w2 = wall(s, HZ + 1.7, 3.2, 0.6, wallMat); w2.position.set(-0.85, 0, HZ / 2); w2.rotation.y = Math.PI / 2;
    box(0.9, 3.6, 0.9, stD, -0.85, 1.8, -0.85, s); box(0.8, 3.5, 0.8, stD, HX + 0.75, 1.75, -0.85, s); box(0.8, 3.5, 0.8, stD, -0.85, 1.75, HZ + 0.75, s);
    box(HX + 1.9, 0.18, 0.2, stD, HX / 2, 0.5, -0.5, s); box(0.2, 0.18, HZ + 1.9, stD, -0.5, 0.5, HZ / 2, s);           // skirting
    const low = [[-0.5, HZ + 0.5, 3.3, HZ + 0.5], [4.7, HZ + 0.5, HX + 0.5, HZ + 0.5], [HX + 0.5, -0.5, HX + 0.5, 2.3], [HX + 0.5, 3.7, HX + 0.5, HZ + 0.5], [5.5, -0.5, 5.5, 1.3], [5.5, 2.7, 5.5, HZ + 0.5]];
    low.forEach(q => { const len = Math.hypot(q[2] - q[0], q[3] - q[1]); box(q[1] === q[3] ? len : 0.3, 0.7, q[1] === q[3] ? 0.3 : len, st, (q[0] + q[2]) / 2, 0.35, (q[1] + q[3]) / 2, s); });
    [[3.3, HZ + 0.5], [4.7, HZ + 0.5], [HX + 0.5, 2.3], [HX + 0.5, 3.7], [HX + 0.5, HZ + 0.5], [5.5, 1.3], [5.5, 2.7]].forEach(q => box(0.42, 1.0, 0.42, stD, q[0], 0.5, q[1], s));
    const boulder = (x, y, z, r) => { const m = mesh(new T.DodecahedronGeometry(r, 0), rock, x, y, z, s); m.rotation.set(R(0, 3), R(0, 3), R(0, 3)); m.scale.y = R(0.8, 1.5); };
    for (let x = HX + 1.6; x < GW + 1; x += 1.3) boulder(x + R(-0.2, 0.2), R(0.6, 1.8), -1.4 + R(-0.3, 0.2), R(1.1, 1.8));
    for (let z = HZ + 1.6; z < GD + 1; z += 1.3) boulder(-1.4 + R(-0.3, 0.2), R(0.6, 1.8), z + R(-0.2, 0.2), R(1.1, 1.8));
    for (let x = -1; x < GW + 1; x += 1.5) boulder(x + R(-0.3, 0.3), -0.1, GD + 0.3 + R(-0.1, 0.3), R(0.5, 0.8));
    for (let z = -1; z < GD + 1; z += 1.5) boulder(GW + 0.3 + R(-0.1, 0.3), -0.1, z + R(-0.3, 0.3), R(0.5, 0.8));
    for (let i = 0; i < 14; i++) { const far = i % 2, m = mesh(new T.ConeGeometry(R(0.25, 0.5), R(1.5, 3.2), 5), rock, far ? R(HX + 2, GW) : -1.6 + R(-0.5, 0.3), R(5.2, 6.5), far ? -1.7 + R(-0.5, 0.3) : R(HZ + 2, GD)); m.rotation.x = Math.PI; }
    [[HX + 2.2, -1.2, 0x8ad0ff], [-1.2, 12.5, 0xb090ff], [17.8, 15.6, 0x8ad0ff], [-1.1, 9.2, 0x8ad0ff], [16.5, -1.2, 0xb090ff], [8, 16.4, 0x7affc0]].forEach(q => { const g = new T.Group(); g.position.set(q[0], 0.9, q[1]); s.add(g); shard(g, 0, 0, 0.7, q[2], 0.3); shard(g, 0.2, 0.1, 0.45, q[2], 0.6); gfx.glow(q[2], 2.2, 0, 0.4, 0, g, 0.35); });
    doorway(s, 13.5, -0.95, 0, 0xffa040, 1.5, 2.5);
    const ceil = new T.PointLight(0xffc890, 15, 16, 1.5); ceil.position.set(4.5, 3.4, 3); s.add(ceil);
    const exitLight = new T.PointLight(0xffa040, 10, 9, 1.6); exitLight.position.set(13.5, 2, 0.4); s.add(exitLight);
    const hov = new T.Mesh(new T.PlaneGeometry(0.94, 0.94), new T.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0.28, depthWrite: false })); hov.rotation.x = -Math.PI / 2; hov.visible = false; s.add(hov);

    const itemsGroup = new T.Group(); s.add(itemsGroup);
    const lights = []; for (let i = 0; i < 9; i++) { const l = new T.PointLight(0xffffff, 0, 8, 1.5); s.add(l); lights.push(l); }
    let occ = {}, rugs = {}, wocc = {}, fxItems = [], ghost = null, ghostPad = null, crewActors = [], visitors = [], sayT = 5;
    const wallPos = (wl, sl) => wl === 'n' ? [sl, -0.52, 0] : [-0.52, sl, Math.PI / 2];
    const buildWall = (id, wl, sl) => { const g = new T.Group(), lp = WALLB[id](g), q = wallPos(wl, sl); g.position.set(wl === 'n' ? q[0] : q[0], 0, wl === 'n' ? q[1] : q[1]); g.rotation.y = q[2]; g.userData.lp = lp; return g; };
    const VISIT = [['Mark', () => G.mark.look, ['Bro. BRO. You LIVE here? Respect.', 'I would bet on this room. I would bet on anything, but still.', 'Is that real brass? Do not answer, I am valuing it.']],
      ['The Fence', () => ({ cls: 'rogue', race: 'human', tint: { cloth: '#245a44', armor: '#3a4a40' } }), ['I could find you a buyer for that. Any of that.', 'Nice. Fell off a nice cart, did it?', 'You have done well. I take a little credit.']],
      ['A neighbour', () => ({ cls: 'cleric', race: 'dwarf', tint: { cloth: '#5a3a2a', armor: '#4a4038' } }), ['It is ever so cosy.', 'The glow carries right down the tunnel.', 'We never had a room like this on the eighth.']],
      ['A pit fan', () => ({ cls: 'fighter', race: 'halforc', tint: { cloth: '#2a4a5a', armor: '#3a4048' } }), ['I saw the last bout! I SAW it!', 'This is where the champion-to-be sleeps. Wow.', 'Can I touch the trophies? I will not touch the trophies.']]];
    const H = {
      scene: s, start: { x: 13.5, z: 1.4 }, zoom: [13.5, 23], bounds: [0, 0, GW - 1, GD - 1],
      spots: [{ x: 13.5, z: 0.2, r: 1.6, y: 3.5, label: 'Undercity', act: 'Leave', go: () => G.ui.hub() }],
      itemAt: (x, z) => { const k = Math.round(x) + ',' + Math.round(z), v = occ[k] || rugs[k]; return v == null ? -1 : v.i; },
      wallPick: (x, z) => {                       // a tap on a wall lands on the ground behind it; work back to the slot
        const hn = (-0.5 - z) / 1.22, hw = (-0.5 - x) / 1.22, okN = hn > 0.2 && hn < 3.4, okW = hw > 0.2 && hw < 3.4;
        const sn = Math.round(x + 1.22 * hn), sw = Math.round(z + 1.22 * hw);
        if (okN && sn >= 0 && sn <= HX && (!okW || hn < hw)) return { wall: 'n', s: sn };
        if (okW && sw >= 0 && sw <= HZ) return { wall: 'w', s: sw };
        return null;
      },
      wallAt: (x, z) => { const p = H.wallPick(x, z); if (!p) return -1; const v = wocc[p.wall + p.s]; return v == null ? -1 : v; },
      wallFree: (wl, sl, skip) => { if (sl < 0 || sl > (wl === 'n' ? HX : HZ)) return false; const v = wocc[wl + sl]; return v == null || v === skip; },
      hover: (x, z) => { const cx = Math.round(x), cz = Math.round(z); hov.visible = cx >= 0 && cz >= 0 && cx < GW && cz < GD && !G.placing; hov.position.set(cx, 0.02, cz); },
      canPlace: (id, x, z, r, skip) => {
        const it = G.DECOR_BY[id], f = footprint(it, r);
        for (let i = 0; i < f[0]; i++) for (let j = 0; j < f[1]; j++) {
          const cx = x + i, cz = z + j, k = cx + ',' + cz;
          if (cx < 0 || cz < 0 || cx >= GW || cz >= GD) return false;
          if (it.zone === 'house' && !isHouse(cx, cz)) return false;
          if (it.zone === 'garden' && isHouse(cx, cz)) return false;
          if ((cx === 13 || cx === 14) && cz <= 1) return false;                 // keep the exit clear
          const o = it.walk ? rugs[k] : occ[k]; if (o && o.i !== skip) return false;      // rugs sit on their own layer, so things can stand on them
        }
        return true;
      },
      refresh: () => {
        const st = G.state, rm = G.roomOf(st);
        while (itemsGroup.children.length) itemsGroup.remove(itemsGroup.children[0]);
        occ = {}; rugs = {}; wocc = {}; fxItems = []; let li = 0;
        lights.forEach(l => l.intensity = 0);
        paint(houseIM, house, FLOORP[rm.floor] || FLOORP.flag, 1); paint(gardenIM, garden, FLOORP[rm.garden] || FLOORP.moss, rm.garden === 'glow' ? 1.25 : 1);
        wallMat.color.set((G.WALLS.find(w => w.id === rm.wall) || G.WALLS[0]).color);
        crewActors.forEach(c => s.remove(c.root)); crewActors = [];
        (st.tally || []).filter(t => !t.job).slice(0, 5).forEach((t, i) => { const q = [[12, 3.2, 2.4], [15.6, 3.6, -1.2], [11.6, 6.6, 0.8], [16, 7.6, -2], [12.4, 10.2, 1.6]][i], c = G.makeChar(G.crew.look(t)); c.root.position.set(q[0], 0, q[1]); c.root.rotation.y = q[2]; s.add(c.root); crewActors.push(c); });
        (st.items || []).forEach((p, i) => {
          if (p.hidden) return;
          const it = G.DECOR_BY[p.id]; if (!it) return;
          const f = footprint(it, p.r), g = buildItem(p.id, p.r, p.off);
          g.position.set(p.x + (f[0] - 1) / 2, it.walk ? 0 : 0, p.z + (f[1] - 1) / 2); itemsGroup.add(g);
          for (let a = 0; a < f[0]; a++) for (let b = 0; b < f[1]; b++) (it.walk ? rugs : occ)[(p.x + a) + ',' + (p.z + b)] = { i, walk: it.walk };
          if (it.light && !p.off && li < lights.length) { const l = lights[li++]; l.color.set(it.light); l.intensity = 9; l.position.copy(g.position).add(g.userData.lightPos); l.position.y += 0.3; }
          if (g.userData.fx) fxItems.push({ fx: g.userData.fx, x: g.position.x, z: g.position.z });
        });
        (st.wallItems || []).forEach((p, j) => {
          if (p.hidden || !WALLB[p.id]) return;
          const g = buildWall(p.id, p.wall, p.s); itemsGroup.add(g); wocc[p.wall + p.s] = j;
          const it = G.WALL_BY[p.id]; if (it.light && g.userData.lp && li < lights.length) { const l = lights[li++]; l.color.set(it.light); l.intensity = 8; l.position.set(p.wall === 'n' ? p.s : 0.2, 2.3, p.wall === 'n' ? 0.2 : p.s); }
        });
        // visitors come when the place is worth visiting
        const cf = G.comfort(st); G.roomComfort = cf;
        const want = Math.min(3, Math.floor(cf / 70));
        while (visitors.length > want) s.remove(visitors.pop().c.root);
        while (visitors.length < want) { const v = VISIT[visitors.length % VISIT.length], c = G.makeChar(v[1]()); const o = { c, name: v[0], lines: v[2], x: 12.5 + visitors.length, z: 2.5 + visitors.length * 0.6, path: [], wait: R(1, 4), walk: 0 }; c.root.position.set(o.x, 0, o.z); s.add(c.root); visitors.push(o); }
      },
      setGhost: (pl) => {
        if (ghost) { s.remove(ghost); ghost = null; } if (ghostPad) { s.remove(ghostPad); ghostPad = null; }
        if (!pl) return;
        hov.visible = false;
        if (pl.wallItem) {
          const ok = H.wallFree(pl.wall, pl.s, pl.from), q = wallPos(pl.wall, pl.s); ghost = buildWall(pl.id, pl.wall, pl.s); s.add(ghost);
          ghostPad = new T.Mesh(new T.PlaneGeometry(1, 3), new T.MeshBasicMaterial({ color: ok ? 0x60ff90 : 0xff5040, transparent: true, opacity: 0.3, depthWrite: false, side: T.DoubleSide }));
          ghostPad.position.set(pl.wall === 'n' ? pl.s : -0.5, 1.6, pl.wall === 'n' ? -0.5 : pl.s); ghostPad.rotation.y = q[2]; s.add(ghostPad); pl.ok = ok; pl.x = pl.wall === 'n' ? pl.s : 0; pl.z = pl.wall === 'n' ? 0 : pl.s; return;
        }
        const it = G.DECOR_BY[pl.id], f = footprint(it, pl.r), ok = H.canPlace(pl.id, pl.x, pl.z, pl.r, pl.from);
        ghost = buildItem(pl.id, pl.r); ghost.position.set(pl.x + (f[0] - 1) / 2, 0.08, pl.z + (f[1] - 1) / 2); s.add(ghost);
        ghostPad = new T.Mesh(new T.PlaneGeometry(f[0] * 0.96, f[1] * 0.96), new T.MeshBasicMaterial({ color: ok ? 0x60ff90 : 0xff5040, transparent: true, opacity: 0.45, depthWrite: false }));
        ghostPad.rotation.x = -Math.PI / 2; ghostPad.position.set(ghost.position.x, 0.05, ghost.position.z); s.add(ghostPad);
        pl.ok = ok;
      },
      blocked: (x, z) => {
        if (x < -0.4 || z < -0.4 || x > GW - 0.6 || z > GD - 0.6) return true;
        if (low.some(q => x > Math.min(q[0], q[2]) - 0.4 && x < Math.max(q[0], q[2]) + 0.4 && z > Math.min(q[1], q[3]) - 0.4 && z < Math.max(q[1], q[3]) + 0.4)) return true;
        for (const dx of [-0.3, 0.3]) for (const dz of [-0.3, 0.3]) { if (occ[Math.round(x + dx) + ',' + Math.round(z + dz)]) return true; }
        return false;
      },
      update: (t) => {
        fxItems.forEach(f => {
          if (f.fx === 'fountain' && Math.random() < 0.6) gfx.emit(f.x + R(-0.1, 0.1), 1.35, f.z + R(-0.1, 0.1), R(-0.9, 0.9), R(1.5, 2.6), R(-0.9, 0.9), 0.7, 0x8ae0ff, 7);
          if (f.fx === 'cauldron' && Math.random() < 0.3) gfx.emit(f.x + R(-0.2, 0.2), 0.7, f.z + R(-0.2, 0.2), 0, R(0.5, 1.2), 0, 0.9, 0x8aff5a, 0);
          if (f.fx === 'willow' && Math.random() < 0.25) gfx.emit(f.x + R(-1, 1), R(1, 2.4), f.z + R(-1, 1), 0, -0.25, 0, 1.6, 0x7affc0, 0);
        });
        if (ghost) ghost.position.y = (G.placing && G.placing.wallItem ? 0 : 0.1) + Math.sin(t * 5) * 0.04;
        hov.material.opacity = 0.2 + Math.sin(t * 5) * 0.08;
        crewActors.forEach((c, i) => c.pose({ t: t + i * 1.7, act: 'idle' }));
        const dt = 0.016;
        visitors.forEach(v => {
          if (v.path.length) {
            const q = v.path[0], dx = q.x - v.x, dz = q.z - v.z, d = Math.hypot(dx, dz);
            if (d < 0.12) v.path.shift(); else { v.x += dx / d * 2.1 * dt; v.z += dz / d * 2.1 * dt; v.c.root.rotation.y = Math.atan2(dx, dz); v.walk += dt * 9; }
            v.c.root.position.set(v.x, 0, v.z); v.c.pose({ t, act: 'idle', moving: true, walk: v.walk }); if (!v.path.length) v.wait = R(3, 9);
          } else {
            v.c.pose({ t, act: 'idle' }); v.wait -= dt;
            if (v.wait <= 0) { for (let k = 0; k < 6; k++) { const tx = Math.floor(R(0, GW)), tz = Math.floor(R(0, GD)); if (!H.blocked(tx, tz)) { v.path = W.findPath(H, v, { x: tx, z: tz }) || []; break; } } v.wait = 2; }
          }
        });
        sayT -= dt; if (sayT <= 0 && visitors.length && G.scene === 'hideout' && !G.ui.isOpen() && !G.placing) { sayT = 7 + Math.random() * 7; const v = visitors[Math.floor(Math.random() * visitors.length)]; gfx.floatText(v.x, 2.7, v.z, v.lines[Math.floor(Math.random() * v.lines.length)], '#d8ccb0'); }
        if (Math.random() < 0.3) gfx.emit(R(0, GW), R(0.3, 2.5), R(HZ, GD), R(-0.15, 0.15), R(0, 0.15), R(-0.15, 0.15), 3, 0x3a5a6a, 0);
      }
    };
    H.refresh();
    return H;
  };

  // Breadth-first path over the tile grid of a place, so walking goes round furniture and walls instead of into them.
  W.findPath = function (pl, from, to) {
    if (!pl.bounds) return null;
    const B = pl.bounds, sx = Math.max(B[0], Math.min(B[2], Math.round(from.x))), sz = Math.max(B[1], Math.min(B[3], Math.round(from.z)));
    let gx = Math.max(B[0], Math.min(B[2], Math.round(to.x))), gz = Math.max(B[1], Math.min(B[3], Math.round(to.z)));
    const key = (x, z) => x + ',' + z, free = (x, z) => x >= B[0] && z >= B[1] && x <= B[2] && z <= B[3] && !pl.blocked(x, z);
    if (!free(gx, gz)) { let best = null, bd = 1e9; for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) if (free(gx + dx, gz + dz)) { const d = Math.hypot(gx + dx - to.x, gz + dz - to.z); if (d < bd) { bd = d; best = [gx + dx, gz + dz]; } } if (!best) return null; gx = best[0]; gz = best[1]; }
    const prev = {}, q = [[sx, sz]]; prev[key(sx, sz)] = 0; let found = false;
    for (let n = 0; n < q.length && n < 900; n++) {
      const c = q[n]; if (c[0] === gx && c[1] === gz) { found = true; break; }
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nx = c[0] + d[0], nz = c[1] + d[1], k = key(nx, nz); if (k in prev || !free(nx, nz)) continue;
        if (pl.blocked(c[0] + d[0] / 2, c[1] + d[1] / 2)) continue;
        if (d[0] && d[1] && (!free(c[0] + d[0], c[1]) || !free(c[0], c[1] + d[1]))) continue;
        prev[k] = c; q.push([nx, nz]);
      }
    }
    if (!found) return null;
    const out = []; let c = [gx, gz]; while (c && !(c[0] === sx && c[1] === sz)) { out.unshift({ x: c[0], z: c[1] }); c = prev[key(c[0], c[1])]; }
    return out;
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
  W.walkTo = function (spot) { walker.target = spot; walker.emote = null; walker.lift = 0; walker.path = walker.place && walker.place.bounds ? W.findPath(walker.place, walker, spot) : null; };
  W.updateWalk = function (dt, t, frozen) {
    const pl = walker.place; if (!pl) return null;
    const In = G.input, k = In.keys;
    let ix = 0, iy = 0;
    if (!frozen) {
      ix = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0); iy = (k.KeyS || k.ArrowDown ? 1 : 0) - (k.KeyW || k.ArrowUp ? 1 : 0);
      if (In.stick.active) { ix = In.stick.x; iy = In.stick.y; }
      if (In.usingPad && In.pad && (In.pad.lx || In.pad.ly)) { ix = In.pad.lx; iy = In.pad.ly; }
    }
    if (walker.back && (ix || iy || walker.target)) { walker.x = walker.back.x; walker.z = walker.back.z; walker.back = null; walker.emote = null; walker.lift = 0; }      // step off the furniture first
    let mx = 0, mz = 0;
    if (ix || iy) { const w = gfx.screenToWorld(ix, iy); mx = w.x; mz = w.z; walker.target = null; }
    else if (walker.target && !frozen) {
      const dx = walker.target.x - walker.x, dz = walker.target.z - walker.z, d = Math.hypot(dx, dz);
      if (d < (walker.target.r || 0.3) * 0.7) { const tg = walker.target; walker.target = null; if (tg.go) tg.go(); }
      else { let wx = dx, wz = dz; const pth = walker.path; while (pth && pth.length && Math.hypot(pth[0].x - walker.x, pth[0].z - walker.z) < 0.3) pth.shift(); if (pth && pth.length > 1) { wx = pth[0].x - walker.x; wz = pth[0].z - walker.z; } const wd = Math.hypot(wx, wz) || 1; mx = wx / wd; mz = wz / wd; }
    }
    const l = Math.hypot(mx, mz); walker.moving = l > 0.1;
    if (walker.moving) {
      walker.v = (walker.v || 0) + (1 - (walker.v || 0)) * Math.min(1, dt * 6);
      const sp = 4.9 * walker.v * Math.min(1, l) * dt, nx = walker.x + mx / l * sp, nz = walker.z + mz / l * sp, ox = walker.x, oz = walker.z;
      if (!pl.blocked(nx, walker.z)) walker.x = nx;
      if (!pl.blocked(walker.x, nz)) walker.z = nz;
      if (walker.target && Math.hypot(walker.x - ox, walker.z - oz) < sp * 0.2) { walker.stuckT = (walker.stuckT || 0) + dt; if (walker.stuckT > 0.5) { walker.target = null; walker.stuckT = 0; } } else walker.stuckT = 0;
      walker.face = Math.atan2(mx, mz); { const w0 = walker.walk; walker.walk += dt * (3 + 8 * walker.v); if (Math.floor(walker.walk / Math.PI) !== Math.floor(w0 / Math.PI) && !frozen) G.sfx('step'); }
    }
    if (walker.moving) { walker.emote = null; walker.lift = 0; } else walker.v = 0;
    const c = walker.char; c.root.position.set(walker.x, walker.lift || 0, walker.z);
    let d = walker.face - c.root.rotation.y; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; c.root.rotation.y += d * Math.min(1, dt * 14);
    const em = walker.emote;
    if (em === 'train') { const beat = Math.floor(t * 1.5), pr = (t * 1.5) % 1; c.pose({ t, act: 'swing', prog: pr, step: beat % 3 }); if (pr > 0.42 && walker.trainS !== beat && walker.trainAt) { walker.trainS = beat; gfx.burst(walker.trainAt.x, 1.2, walker.trainAt.z, 0xffe9a0, 4, 2.5, 2); G.sfx('hit'); } }
    else c.pose({ t, act: em || 'idle', prog: 1, moving: walker.moving, walk: walker.walk });
    const cam = gfx.cam, kk = Math.min(1, dt * 5);
    cam.x += (walker.x - cam.x) * kk; cam.z += (walker.z - cam.z) * kk; cam.fx = 0.5; cam.fy = gfx.portrait ? 0.45 : 0.5;
    cam.vh += ((gfx.portrait ? pl.zoom[1] : pl.zoom[0]) - cam.vh) * kk;
    pl.update(t, dt);
    let near = null, best = 1e9;
    pl.spots.forEach(sp => { const dd = Math.hypot(sp.x - walker.x, sp.z - walker.z); if (dd < sp.r && dd < best) { best = dd; near = sp; } });
    return near;
  };
})();
