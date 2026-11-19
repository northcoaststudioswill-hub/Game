//@@SLED
  function car(x, z, alongX, color) {
    // a freight sled, loaded and left where the watch stopped it
    const L = 4.5, Wd = 1.9, w = alongX ? L : Wd, d = alongX ? Wd : L, ry = alongX ? 0 : Math.PI / 2;
    solid(x - w / 2, z - d / 2, x + w / 2, z + d / 2, 0, 1.45);
    D('wood', x, 0.36, z, L, 0.24, Wd, 0x8a6a48, { ry, outline: 0.06 });
    [-0.7, 0.7].forEach(o => D('flat', x + (alongX ? 0 : o), 0.12, z + (alongX ? o : 0), L + 0.5, 0.16, 0.16, 0x23232e, { ry, outline: 0.03 }));
    [[-1.4, 1.0, 0xb98a55], [-0.1, 1.1, color], [1.35, 0.85, 0xd9a05f]].forEach(c => D('crate', x + (alongX ? c[0] : 0), 0.48 + c[1] / 2, z + (alongX ? 0 : c[0]), c[1] * 1.15, c[1], c[1] * 1.3, c[2], { ry, outline: 0.05 }));
    D('flat', x + (alongX ? 2.1 : 0), 0.9, z + (alongX ? 0 : 2.1), 0.1, 1.0, 0.1, 0x23232e, { outline: 0.03 });
    D('glow', x + (alongX ? 2.1 : 0), 1.48, z + (alongX ? 0 : 2.1), 0.22, 0.24, 0.22, 0x5ff2e2, { outline: 0 });
  }
//@@BUILD
  /* ---------- the level: the High Docks ----------
     A shelf of white stone hung off the flank of the Sun Spire, above the weather. Nothing here is a street.
     South: the dock stair comes up onto a causeway with a mooring basin on either side. The causeway meets the
     quay. North of the quay: the freight yard and the bond house (the dock office is on its gallery). Over the
     bond-house roof to the signal roof, and up the gangway to Mooring One, the highest cleat on the docks.
     The footprint, floor heights and doors are the ones the encounters were tuned on; everything seen is new. */
  W.build = function () {
    batch = new G.Batch(); W.doors = {};
    const STONE = 0xe4dfd2, STONE2 = 0xcfc9bc, DECK = 0xa7a3c0, DECK2 = 0x8f8bb0, GILT = 0xe8c25a, IRON = 0x23232e, TEAL = 0x2f8f8a, VIOLET = 0x5a3aa8, SLATE = 0x5a6088, IVORY = 0xefe8d4, HULL = 0x6e5a48, LAMP = 0xffe9a0, TLAMP = 0x5ff2e2;
    const rnd = SC.seeded(77);
    /* unseen walls keep bodies on the deck; the camera is allowed to swing out over the drop */
    const wall = (x0, z0, x1, z1, y0, y1) => solid(x0, z0, x1, z1, y0 || 0, y1 || 9, { cam: false });
    function rail(x0, z0, x1, z1, y) {
      const ax = Math.abs(x1 - x0) > Math.abs(z1 - z0), len = ax ? x1 - x0 : z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, L = Math.abs(len);
      D('concrete', cx, y + 0.12, cz, ax ? L : 0.5, 0.24, ax ? 0.5 : L, STONE2, { outline: 0.04 });
      D('concrete', cx, y + 1.02, cz, ax ? L : 0.42, 0.16, ax ? 0.42 : L, STONE, { outline: 0.04 });
      const n = Math.max(1, Math.round(L / 1.5));
      for (let i = 0; i <= n; i++) { const t = i / n, px = ax ? x0 + len * t : cx, pz = ax ? cz : z0 + len * t, big = i % 4 === 0;
        D('concrete', px, y + 0.58, pz, big ? 0.42 : 0.15, 0.74, big ? 0.42 : 0.15, big ? STONE : STONE2, { outline: big ? 0.04 : 0.02 });
        if (big) D('flat', px, y + 1.2, pz, 0.3, 0.2, 0.3, GILT, { outline: 0.03 }); }
    }
    /* a block of dressed Spire stone: coursed face, footing, gilt string course, cornice, pilasters, lit slits */
    function mass(x0, z0, x1, z1, h, col, o) {
      o = o || {};
      B('brick', x0, z0, x1, z1, 0, h, col || STONE2, { outline: 0.1 });
      B('concrete', x0 - 0.18, z0 - 0.18, x1 + 0.18, z1 + 0.18, 0, 0.9, STONE, { outline: 0.05, col: false });
      B('flat', x0 - 0.1, z0 - 0.1, x1 + 0.1, z1 + 0.1, h - 1.25, h - 1.0, GILT, { outline: 0.03, col: false });
      if (!o.flatTop) B('concrete', x0 - 0.3, z0 - 0.3, x1 + 0.3, z1 + 0.3, h - 0.5, h - 0.02, STONE, { outline: 0.06, col: false });
      const pil = (x, z, alongX) => D('concrete', x, (h - 1.25) / 2 + 0.2, z, alongX ? 0.8 : 0.34, h - 1.6, alongX ? 0.34 : 0.8, STONE, { outline: 0.04 });
      for (let x = x0 + 1.2; x <= x1 - 1; x += Math.max(4.5, (x1 - x0 - 2.4) / Math.max(1, Math.round((x1 - x0) / 6)))) { pil(x, z0 - 0.1, true); pil(x, z1 + 0.1, true); }
      for (let z = z0 + 1.2; z <= z1 - 1; z += Math.max(4.5, (z1 - z0 - 2.4) / Math.max(1, Math.round((z1 - z0) / 6)))) { pil(x0 - 0.1, z, false); pil(x1 + 0.1, z, false); }
      if (h > 5) for (let y = 3; y < h - 2.4; y += 3.1) {
        for (let x = x0 + 3.2; x < x1 - 2; x += 3) { if (rnd() < 0.55) D('glow', x, y, z1 + 0.03, 0.34, 1.3, 0.06, rnd() < 0.8 ? LAMP : TLAMP, { outline: 0 }); if (rnd() < 0.55) D('glow', x, y, z0 - 0.03, 0.34, 1.3, 0.06, LAMP, { outline: 0 }); }
        for (let z = z0 + 3.2; z < z1 - 2; z += 3) { if (rnd() < 0.5) D('glow', x1 + 0.03, y, z, 0.06, 1.3, 0.34, LAMP, { outline: 0 }); if (rnd() < 0.5) D('glow', x0 - 0.03, y, z, 0.06, 1.3, 0.34, LAMP, { outline: 0 }); }
      }
    }
    /* a lift-barge at its mooring: a wooden hull slung under a long ivory gas cell. Batched, so it costs nothing to draw. */
    function bargeS(x, y, z, ry) {
      const c = Math.cos(ry), s = Math.sin(ry), P = (dx, dz) => [x + dx * c + dz * s, z - dx * s + dz * c];
      const bx = (mat, dx, dy, dz, w, h, d, col, ol, rz) => { const p = P(dx, dz); D(mat, p[0], y + dy, p[1], w, h, d, col, { ry, rz: rz || 0, outline: ol }); };
      bx('wood', 0, 0, 0, 15, 2.2, 5.2, HULL, 0.08); bx('flat', 0, 1.1, 0, 15.6, 0.3, 5.6, GILT, 0.05);
      bx('wood', -8.6, 0.5, 0, 2.6, 1.6, 4.4, HULL, 0.08, 0.5); bx('wood', 8.6, 0.5, 0, 2.6, 1.6, 4.4, HULL, 0.08, -0.5);
      bx('flat', 3.6, 2.2, 0, 4.2, 1.8, 3, IVORY, 0.07); bx('flat', 3.6, 3.2, 0, 4.6, 0.25, 3.4, IRON, 0.04);
      bx('glow', 3.6, 2.3, 1.52, 0.5, 0.6, 0.04, LAMP, 0); bx('glow', 2.4, 2.3, 1.52, 0.5, 0.6, 0.04, LAMP, 0);
      [-3, -1, 1].forEach(dx => bx('crate', dx - 2.5, 1.7, (dx % 2) * 0.9, 1.1, 1.1, 1.1, 0xb98a55, 0.04));
      let g = new THREE.CylinderGeometry(2.7, 2.7, 15, 10); batch.add('flat', g, G.mx(x, y + 7.6, z, ry, 0, Math.PI / 2), IVORY, 0.1); g.dispose();
      [-1, 1].forEach(k => { const p = P(k * 8.8, 0); g = new THREE.ConeGeometry(2.7, 2.6, 10); batch.add('flat', g, G.mx(p[0], y + 7.6, p[1], ry, 0, -k * Math.PI / 2), IVORY, 0.1); g.dispose(); });
      [-4.4, 0, 4.4].forEach(dx => { const p = P(dx, 0); g = new THREE.CylinderGeometry(2.77, 2.77, 0.35, 10); batch.add('flat', g, G.mx(p[0], y + 7.6, p[1], ry, 0, Math.PI / 2), GILT, 0); g.dispose(); });
      [[-5.5, 2.2], [5.5, 2.2], [-5.5, -2.2], [5.5, -2.2]].forEach(q => bx('flat', q[0], 3.2, q[1], 0.14, 4.2, 0.14, IRON, 0.03));
      [[-7.4, 2.7], [7.4, 2.7], [-7.4, -2.7], [7.4, -2.7]].forEach(q => bx('glow', q[0], 1.5, q[1], 0.34, 0.34, 0.34, TLAMP, 0));
    }
    /* a rope or a spar between two points */
    function line(ax, ay, az, bx, by, bz, r, col) {
      const a = new THREE.Vector3(ax, ay, az), b = new THREE.Vector3(bx, by, bz), len = a.distanceTo(b), g = new THREE.CylinderGeometry(r, r, len, 5);
      const m = new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize()), new THREE.Vector3(1, 1, 1));
      batch.add('flat', g, m, col === undefined ? IRON : col, r > 0.09 ? 0.03 : 0); g.dispose();
    }
    function bollard(x, z, y) { y = y || 0; cyl('flat', x, y + 0.4, z, 0.2, 0.26, 0.8, IRON, { outline: 0.04 }); cyl('flat', x, y + 0.86, z, 0.3, 0.22, 0.14, GILT, { outline: 0.03 }); }
    /* a lantern on a stone column */
    function column(x, z, h, col) {
      cyl('concrete', x, h / 2, z, 0.22, 0.28, h, STONE, { outline: 0.04 }); D('concrete', x, 0.2, z, 0.8, 0.4, 0.8, STONE2, { outline: 0.04 }); D('flat', x, h + 0.08, z, 0.6, 0.16, 0.6, GILT, { outline: 0.03 });
      D('glow', x, h + 0.42, z, 0.34, 0.5, 0.34, col || LAMP, { outline: 0 }); D('flat', x, h + 0.74, z, 0.5, 0.12, 0.5, IRON, { outline: 0.03 });
    }
    function winch(x, z, y, alongX) {
      [-1, 1].forEach(k => D('flat', x + (alongX ? k * 1.1 : 0), y + 0.75, z + (alongX ? 0 : k * 1.1), alongX ? 0.2 : 1.3, 1.5, alongX ? 1.3 : 0.2, IRON, { outline: 0.04 }));
      cyl('flat', x, y + 0.95, z, 0.6, 0.6, 1.9, GILT, { rz: alongX ? Math.PI / 2 : 0, rx: alongX ? 0 : Math.PI / 2, seg: 10, outline: 0.05 });
      cyl('flat', x, y + 0.95, z, 0.72, 0.72, 0.12, IRON, { rz: alongX ? Math.PI / 2 : 0, rx: alongX ? 0 : Math.PI / 2, seg: 10, outline: 0.03 });
    }
    function standard(x, z, y, h, col) {
      cyl('flat', x, y + h / 2, z, 0.07, 0.09, h, IRON, { outline: 0.03 }); D('flat', x + 0.75, y + h - 0.12, z, 1.6, 0.1, 0.1, IRON, { outline: 0.02 });
      D('flat', x + 0.8, y + h - 1.6, z, 1.3, 2.8, 0.06, col, { outline: 0.04 }); D('flat', x + 0.8, y + h - 1.2, z + 0.04, 0.5, 0.5, 0.04, GILT, { rz: 0.785, outline: 0 }); D('flat', x, y + h + 0.1, z, 0.22, 0.22, 0.22, GILT, { outline: 0.03 });
    }

    // ----- the weather, far below -----
    D('flat', 0, -58, 0, 1400, 2, 1400, 0x343a80, { outline: 0 });
    { const rc = SC.seeded(404), ico = new THREE.IcosahedronGeometry(1, 1);
      for (let i = 0; i < 110; i++) { const near = i < 26, a = rc() * 6.283, r = near ? 34 + rc() * 50 : 80 + rc() * 240, sc = (near ? 9 : 16) + rc() * 26, g = ico.clone(); g.scale(sc, sc * (0.26 + rc() * 0.14), sc * (0.6 + rc() * 0.4));
        batch.add('flat', g, G.mx(Math.cos(a) * r, -22 - rc() * 26 - (near ? 8 : 0), Math.sin(a) * r - 4, rc() * 3), [0x9d98d8, 0x8580c4, 0xb7b0e4][i % 3], 0); g.dispose(); } }

    // ----- the Sun Spire: the docks hang off its eastern flank -----
    { const R = 62, cx = -109, cz = -8, rAt = y => R + 6 * (270 - y) / 300;
      let g = new THREE.CylinderGeometry(R, R + 6, 300, 64, 1, true); const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 98, uv.getY(k) * 72);
      batch.add('concrete', g, G.mx(cx, 120, cz), 0xd8d3e2, 0); g.dispose();
      [9.5, 30, 58, 96, 140, 190, 240].forEach(y => { const r = rAt(y) + 0.9; g = new THREE.CylinderGeometry(r, r + 0.1, y < 12 ? 1.2 : 2.4, 64, 1, true); batch.add('flat', g, G.mx(cx, y, cz), GILT, 0); g.dispose(); });
      const rs = SC.seeded(909);
      for (let y = 16; y < 230; y += y < 60 ? 5.5 : 9) for (let a = -0.72; a <= 0.72; a += 0.052) { if (rs() > 0.42) continue; const r = rAt(y) + 0.12;
        D('glow', cx + Math.cos(a) * r, y, cz + Math.sin(a) * r, 0.16, 2.4, 0.9, rs() < 0.85 ? LAMP : TLAMP, { ry: -a, outline: 0 }); }
      // the great brackets the shelf sits on
      for (let z = -48; z <= 14; z += 12.4) { D('concrete', -48.5, -5, z, 9, 9, 1.6, STONE2, { rz: -0.6, outline: 0.08 }); } }

    // ----- the shelf itself -----
    D('concrete', 0, -0.75, -18, 92, 1.5, 72, DECK, { outline: 0 });                           // main deck: quay, yard, bond house, roofs' footings
    D('concrete', 0, -0.75, 34, 7.8, 1.5, 32.4, DECK, { outline: 0.06 });                      // the causeway out to the dock stair
    B('flat', -46.2, 17.9, -3.9, 18.25, -1.6, -1.2, GILT, { outline: 0.04, col: false }); B('flat', 3.9, 17.9, 46.2, 18.25, -1.6, -1.2, GILT, { outline: 0.04, col: false });
    D('concrete', 0, -1.9, 18.6, 92, 0.9, 1.6, STONE2, { outline: 0.06 });
    for (let x = -42; x <= 42; x += 7) if (Math.abs(x) > 5) { D('concrete', x, -3.4, 18.9, 0.9, 4.4, 2.2, STONE2, { rx: 0.5, outline: 0.06 }); }
    for (let z = 22; z <= 46; z += 6) { D('concrete', 0, -2.6, z, 7.2, 2.4, 0.8, STONE2, { outline: 0.05 }); D('flat', 0, -1.55, z, 8.1, 0.2, 0.3, GILT, { outline: 0.03 }); }
    // deck inlay: gilt lines the freight sleds follow, and the mooring numbers
    for (let x = -37; x < 40; x += 6) D('flat', x, 0.012, 12, 2.6, 0.02, 0.16, GILT, { outline: 0 });
    D('flat', 0, 0.012, 15.2, 79, 0.02, 0.1, DECK2, { outline: 0 }); D('flat', 0, 0.012, 8.8, 79, 0.02, 0.1, DECK2, { outline: 0 });
    for (let z = 20; z < 46; z += 2.2) D('flat', 0, 0.012, z, 0.14, 0.02, 1.2, GILT, { outline: 0 });
    [[1.2, 40.8, 2.2, 1.3], [-1.4, 33, 1.6, 2.4], [1.6, 25.5, 2.4, 1.2], [-20, 10, 3, 1.6], [14, 13, 2.4, 1.4], [22, -6, 3, 2], [-6, -38, 3, 2]].forEach(p => D('flat', p[0], 0.014, p[1], p[2], 0.02, p[3], 0x5c5e9c, { outline: 0, ry: 0.4 }));

    // ----- the causeway and the head of the dock stair -----
    wall(-4.3, 18, -3.5, 46.4); wall(3.5, 18, 4.3, 46.4); wall(-3.5, 46, 3.5, 46.6);
    rail(-3.72, 18.3, -3.72, 46, 0); rail(3.72, 18.3, 3.72, 46, 0);
    [22.5, 31, 39.5].forEach(z => { column(-3.72, z, 4.2); column(3.72, z, 4.2); });
    // the stair gate: two pylons, a lintel, and the first flights going down into the weather
    [-1, 1].forEach(k => { D('brick', k * 3.2, 3.2, 46.8, 1.5, 6.4, 1.6, STONE2, { outline: 0.08 }); D('concrete', k * 3.2, 0.45, 46.8, 1.9, 0.9, 2, STONE, { outline: 0.05 }); D('flat', k * 3.2, 6.55, 46.8, 1.8, 0.3, 1.9, GILT, { outline: 0.04 }); D('glow', k * 3.2, 7.1, 46.8, 0.5, 0.7, 0.5, LAMP, { outline: 0 }); });
    D('concrete', 0, 5.6, 46.8, 7.9, 1.1, 1.3, STONE, { outline: 0.07 });
    sign('DOCK STAIR', 0, 5.6, 46.1, Math.PI, 5, 0.9, '#07070d', '#e8c25a');
    for (let i = 0; i < 9; i++) D('concrete', 0, -0.2 - i * 0.55, 47.8 + i * 0.9, 4.8, 0.3, 1.0, i % 2 ? STONE2 : STONE, { outline: 0.04 });
    line(-2.4, 1.0, 47.4, -2.4, -4.2, 55.6, 0.06); line(2.4, 1.0, 47.4, 2.4, -4.2, 55.6, 0.06);
    cyl('metal', 1.5, 0.22, 38.8, 0.16, 0.2, 0.44, 0xc9a063, { outline: 0.03 }); D('glow', 1.5, 0.5, 38.8, 0.2, 0.2, 0.2, LAMP, { outline: 0 });       // the trimmed lamp
    crateStatic(-2.55, 29, 1.3); crateStatic(-2.6, 30.25, 1.0, 0, 0xd9a05f); crateStatic(-2.6, 29.2, 0.8, 1.3, 0xd9a05f); solid(-3.3, 28.2, -1.9, 30.9, 0, 1.3);
    crateStatic(2.6, 38.2, 1.2); crateStatic(2.65, 39.4, 0.9, 0, 0xd9a05f); cyl('wood', 2.5, 0.55, 37.1, 0.42, 0.42, 1.1, 0x8a6a48, { seg: 9, outline: 0.05 }); solid(1.9, 36.6, 3.3, 39.9, 0, 1.2);
    crateStatic(-2.7, 43.6, 1.1); crateStatic(-2.75, 43.5, 0.8, 1.1, 0xd9a05f); crateStatic(2.6, 44.2, 1.2);
    crate(2.75, 31.5, 0.9, 0, 'hp'); crate(2.7, 32.5, 0.9); crate(-2.8, 24.2, 0.9, 0, 'meter');
    for (let z = 20.5; z < 46; z += 4.25) { bollard(-3.15, z); if (z > 21 && z < 44) bollard(3.15, z + 2.1); }

    // ----- the mooring basins either side of the causeway: the fleet, in pairs -----
    [[-10.5, 31.5], [-17, 31.5], [-31, 33], [-37.5, 33], [10.5, 31.5], [17, 31.5], [31, 33], [37.5, 33]].forEach((p, i) => bargeS(p[0], -1.4 + (i % 2) * 0.35, p[1], Math.PI / 2 + (i % 3 - 1) * 0.03));
    [[-3.15, 24.75, -8, 30], [-3.15, 37.5, -8, 36], [3.15, 26.85, 8, 30], [3.15, 39.6, 8, 37], [-24, 18.2, -19.6, 26], [-28, 18.2, -28.6, 26], [24, 18.2, 19.6, 26], [28, 18.2, 28.6, 26]].forEach(l => line(l[0], 0.8, l[1], l[2], 0.3, l[3], 0.045));
    [[-13.75, 31.5], [-34.25, 33], [13.75, 31.5], [34.25, 33]].forEach(p => { line(p[0], 0.2, p[1] - 5, p[0], 0.2, p[1] - 5.01 + 0.02, 0.05); D('wood', p[0], 0.1, p[1], 1.3, 0.14, 4, 0x8a6a48, { outline: 0.04 }); });   // the plank lashing each pair
    [-24, -28, 24, 28].forEach(x => bollard(x, 17.3));

    // ----- the quay -----
    wall(-40, 18, -4.3, 18.5); wall(4.3, 18, 40, 18.5); rail(-40, 18.2, -4.4, 18.2, 0); rail(4.4, 18.2, 40, 18.2, 0);
    // west end: the Spire gate. Behind it, the Count.
    mass(-46, 6, -40, 18, 8.4, STONE2);
    D('flat', -39.92, 2.4, 12, 0.1, 4.8, 3.6, 0x15151f, { outline: 0 }); D('concrete', -39.8, 5.0, 12, 0.4, 0.5, 4.6, STONE, { outline: 0.05 }); [-1, 1].forEach(k => D('concrete', -39.8, 2.4, 12 + k * 2.05, 0.4, 4.8, 0.5, STONE, { outline: 0.05 }));
    for (let i = 0; i < 5; i++) D('flat', -39.86, 2.4, 10.6 + i * 0.7, 0.06, 4.6, 0.1, GILT, { outline: 0 });
    sign('THE COUNT IS KEPT', -39.7, 6.5, 12, Math.PI / 2, 5.4, 0.9, '#07070d', '#e8c25a');
    standard(-39.2, 8.2, 0, 6.2, VIOLET); standard(-39.2, 15.8, 0, 6.2, TEAL);
    // east end: the quay runs out into the air; a cargo crane stands over the drop
    wall(40, 6, 40.6, 18); rail(40.25, 6.3, 40.25, 18, 0);
    B('concrete', 40.6, 6, 46, 18, -1.5, 0.02, DECK, { outline: 0.05, col: false }); D('brick', 43.4, 3.0, 12, 3.2, 6, 3.2, STONE2, { outline: 0.08 }); D('flat', 43.4, 6.2, 12, 3.6, 0.4, 3.6, GILT, { outline: 0.04 });
    line(43.4, 6.4, 12, 43.4, 16, 12, 0.22); line(43.4, 15.4, 12, 43.4, 13.2, 26, 0.16); line(43.4, 15.4, 12, 43.4, 14.2, 5, 0.16); line(43.4, 16, 12, 43.4, 13.3, 25.6, 0.04); line(43.4, 13.2, 25.4, 43.4, 5.5, 25.4, 0.035);
    D('crate', 43.4, 4.8, 25.4, 1.5, 1.5, 1.5, 0xb98a55, { ry: 0.3, outline: 0.05 }); D('glow', 43.4, 16.4, 12, 0.4, 0.4, 0.4, TLAMP, { outline: 0 });
    sign('AIR BREATHED. AIR OWED.', 40.0, 3.4, 12, -Math.PI / 2, 8, 1.2, '#e8c25a', '#0b0d24');
    car(-15, 9.6, true, 0x5a3aa8); car(24, 14.6, true, 0x2f8f8a); car(-31, 14.4, true, 0xd9dde6);
    lamp(-24, 16.9, 0, -1); lamp(-6, 7.1, 0, 1); lamp(12, 16.9, 0, -1); lamp(30, 7.1, 0, 1);
    bollard(5.6, 16.7); solid(5.35, 16.45, 5.85, 16.95, 0, 1, { cam: false });
    // the tally booth, and the watch shelter with its bench
    B('brick', -10.6, 16.3, -9.5, 17.5, 0, 2.6, STONE, { outline: 0.06 }); D('glow', -10.05, 1.6, 16.27, 0.7, 1.0, 0.04, LAMP, { outline: 0 }); D('flat', -10.05, 2.72, 16.9, 1.4, 0.16, 1.5, GILT, { outline: 0.04 });
    B('flat', -29, 6.3, -25, 6.5, 0, 2.6, IRON, { outline: 0.05 }); D('flat', -27, 2.66, 7, 4.3, 0.12, 1.6, VIOLET, { outline: 0.04 }); D('flat', -27, 2.56, 7.82, 4.3, 0.2, 0.06, GILT, { outline: 0 });
    D('wood', -27, 0.5, 6.9, 3, 0.1, 0.5, 0xb98a55, { outline: 0.03 });
    barrelFire(35.5, 9.2); barrelFire(-36, 15);
    crate(33.2, 16.6, 1, 0, 'hp'); crate(-37.5, 8.6, 1, 0); crate(-36.4, 8.4, 1, 0, 'meter');
    // the watch board, face down by a spilled sled: where somebody changed the hour
    D('wood', 9.3, 0.5, 15.2, 1.5, 0.95, 0.08, 0x3a3350, { ry: 0.5, rx: -1.1, outline: 0.04 }); D('flat', 9.26, 0.58, 15.14, 1.2, 0.7, 0.04, 0xece6d6, { ry: 0.5, rx: -1.1, outline: 0 });
    D('crate', 8.4, 0.3, 15.9, 0.6, 0.6, 0.6, 0xb98a55, { ry: -0.4, outline: 0.04 }); D('crate', 10.2, 0.25, 14.4, 0.5, 0.5, 0.5, 0xd9a05f, { ry: 0.8, outline: 0.04 });

    // ----- the masses to west, east and north -----
    mass(-46, -46, -32, 6, 13, 0xd6d0c2);                                   // the Spire's footing: the docks are bolted to this
    // east: the winch house, low, with the sky open over it
    mass(32, -46, 46, 6, 5.2, STONE2); wall(32, -46, 46, 6, 5.2, 14);
    D('roof', 39, 5.24, -20, 14, 0.06, 52, SLATE, { outline: 0 }); [-36, -14, 0].forEach(z => winch(40, z, 5.2, true));
    [-36, -14].forEach(z => { line(40, 6.1, z, 62, 9.4, z - 2, 0.05); }); bargeS(63, 7, -16, Math.PI / 2 + 0.05); bargeS(69.6, 7.3, -16.5, Math.PI / 2 + 0.02);
    for (let z = -44; z <= 4; z += 8) D('flat', 32.6, 5.9, z, 0.1, 1.2, 0.1, IRON, { outline: 0.02 }); D('flat', 32.6, 6.5, -20, 0.08, 0.08, 50, IRON, { outline: 0.02 });
    // north: a sea wall, and beyond it nothing
    B('brick', -46, -54, 46, -46, 0, 3.4, STONE2, { outline: 0.1 }); B('concrete', -46.2, -54.2, 46.2, -45.8, 3.4, 3.8, STONE, { outline: 0.05, col: false }); wall(-46, -54, 46, -46, 3.4, 20);

    // ----- the freight yard -----
    B('metal', 6, 5.7, 16, 6, 0, 3.2, IVORY, { outline: 0.05 }); B('metal', 20, 5.7, 32, 6, 0, 3.2, IVORY, { outline: 0.05 });
    B('flat', 5.95, 5.65, 16, 6.05, 3.2, 3.42, GILT, { outline: 0.03, col: false }); B('flat', 20, 5.65, 32.05, 6.05, 3.2, 3.42, GILT, { outline: 0.03, col: false });
    D('concrete', 16.1, 2.1, 5.85, 0.6, 4.2, 0.7, STONE, { outline: 0.05 }); D('concrete', 19.9, 2.1, 5.85, 0.6, 4.2, 0.7, STONE, { outline: 0.05 });
    D('glow', 16.1, 4.5, 5.85, 0.36, 0.5, 0.36, LAMP, { outline: 0 }); D('glow', 19.9, 4.5, 5.85, 0.36, 0.5, 0.36, LAMP, { outline: 0 });
    sign('HIGH DOCKS FREIGHT', 11, 4.4, 6.05, 0, 7, 1.2, '#e8c25a', '#0b0d24');
    const gateMat = G.toon({ map: G.tex.metal, color: 0xc9a063 });
    door('gate', new THREE.BoxGeometry(3.8, 3, 0.16), gateMat, 18, 1.5, 5.85, solid(16, 5.7, 20, 6, 0, 3.2), new THREE.Vector3(3.9, 0, -0.25));
    container(27, -1.6, true, 0xe2dccb); container(27, -1.6, true, TEAL, 2.6); container(9.3, -15, false, VIOLET);
    container(28.4, -14, false, 0xc9a063); container(21, -18.4, true, 0xe2dccb);
    crateStatic(13, 3.6, 1.3); crateStatic(14.2, 3.9, 1); crateStatic(13.2, 3.7, 0.9, 1.3, 0xd9a05f);
    crate(23, 3.8, 1, 0, 'hp'); crate(30.6, -7.4, 1, 0, 'meter'); crate(14, -17.6, 1, 0, 'hp'); crate(15.1, -17.9, 1);
    // a hand winch on a sled, where the yard gang left it
    B('flat', 12.4, -1.2, 14.2, 0.2, 0.2, 0.7, IRON, { outline: 0.05 }); winch(13.3, -0.5, 0.7, false); solid(12.4, -1.2, 14.2, 0.2, 0.7, 2.2, { cam: false });
    D('flat', 14.95, 0.25, -0.5, 1, 0.07, 0.9, 0x8d94ac, { outline: 0.02 });
    D('metal', 31.8, 1.5, -8, 0.3, 1.2, 0.9, GILT, { outline: 0.05 }); D('flat', 31.62, 1.5, -8, 0.06, 0.5, 0.12, 0x15151f, { outline: 0 }); D('glow', 31.62, 2.3, -8, 0.06, 0.16, 0.16, 0xff5a1f, { outline: 0 });
    lamp(8, -19.4, 1, 0); lamp(31.4, 3.6, -1, 0);
    for (let x = 9; x < 31; x += 5.5) D('flat', x, 0.012, -9, 0.14, 0.02, 20, GILT, { outline: 0 });
    // the yard gantry: a rail overhead from the gate to the back wall
    [[7.2, 3.2], [7.2, -19.6]].forEach(p => line(p[0], 0, p[1], p[0], 7.4, p[1], 0.14)); line(7.2, 7.3, 3.4, 7.2, 7.3, -19.8, 0.12); line(7.2, 7.3, -6, 7.2, 5.2, -6, 0.03); D('flat', 7.2, 5.0, -6, 0.3, 0.4, 0.3, GILT, { outline: 0.03 });

    // ----- the bond house (the dock office is on its gallery) -----
    const WH = 0xdcd6c8, TRIM = GILT;
    B('brick', -32, 5.4, 6, 6, 0, 8.4, WH, { outline: 0.1 });
    B('brick', -32, -20, 6, -19.4, 0, 8.4, WH, { outline: 0.1 });
    B('brick', -32, -19.4, -31.4, 5.4, 0, 8.4, WH, { outline: 0 });
    B('brick', 5.4, -19.4, 6, -9, 0, 8.4, WH, { outline: 0 }); B('brick', 5.4, -4, 6, 5.4, 0, 8.4, WH, { outline: 0 });
    B('brick', 5.4, -9, 6, -4, 4.2, 8.4, WH, { outline: 0 });
    D('concrete', 5.7, 2.1, -9.1, 0.9, 4.2, 0.4, STONE, { outline: 0.04 }); D('concrete', 5.7, 2.1, -3.9, 0.9, 4.2, 0.4, STONE, { outline: 0.04 }); D('flat', 5.7, 4.36, -6.5, 0.9, 0.3, 5.7, TRIM, { outline: 0.04 });
    B('concrete', -32.1, 5.9, 6.1, 6.1, 0, 1.0, STONE, { outline: 0.04, col: false }); B('flat', -32.06, 5.94, 6.06, 6.08, 7.1, 7.32, TRIM, { outline: 0.03, col: false }); B('flat', 5.94, -20.04, 6.08, 5.94, 7.1, 7.32, TRIM, { outline: 0.03, col: false });
    for (let x = -28.5; x < 5; x += 5.6) { D('concrete', x, 3.9, 6.08, 0.8, 6.3, 0.3, STONE, { outline: 0.04 }); if (x < 2) { D('flat', x + 2.8, 4.2, 6.03, 1.5, 3.4, 0.08, 0x15151f, { outline: 0.04 }); D('glow', x + 2.8, 4.2, 6.06, 1.2, 3.1, 0.06, 0xf2c14e, { outline: 0 }); D('flat', x + 2.8, 4.2, 6.1, 0.1, 3.1, 0.04, IRON, { outline: 0 }); D('flat', x + 2.8, 4.6, 6.1, 1.2, 0.1, 0.04, IRON, { outline: 0 }); } }
    for (let z = -17; z < 5; z += 5.6) if (z < -10 || z > -3) D('concrete', 6.08, 3.9, z, 0.3, 6.3, 0.8, STONE, { outline: 0.04 });
    sign('BOND HOUSE', 6.08, 6, -6.5, Math.PI / 2, 5.6, 1.1, '#e8c25a', '#0b0d24');
    door('shutter', new THREE.BoxGeometry(0.2, 4.2, 5), G.toon({ map: G.tex.metal, color: 0xc9a063 }), 5.7, 2.1, -6.5, solid(5.4, -9, 6, -4, 0, 4.2), new THREE.Vector3(0, 4.0, 0));
    B('concrete', -31.4, -19.4, 5.4, 5.4, 0, 0.03, 0xb7b2c8, { outline: 0, col: false });
    slabWithHoles('roof', -32, -20, 6, 6, 8, 8.4, SLATE, [[-20, -19.4, -12.5, -16.8]], [[-8, -6.5, -3, -1.5], [-18, -9, -13, -4], [-3, -16, 2, -12], [-28, -3, -24, 2]]);
    parapet(-32, -20, 6, 6, 8.4, [{ side: 'n', a: -27.2, b: -24.8 }, { side: 'n', a: -20.2, b: -12.3 }], STONE2);
    B('metal', -22, -17, -12.5, -16.8, 4, 8.4, WH, { vis: false, s: { cam: false } });
    D('flat', -17.25, 7.15, -16.9, 10.5, 0.1, 0.1, TRIM, { rz: 0.434, outline: 0.03 }); D('flat', -17.25, 6.6, -16.9, 10.5, 0.07, 0.07, IRON, { rz: 0.434, outline: 0.02 });
    for (let x = -21.5; x < -12.6; x += 1.5) D('flat', x, 4 + (x + 22) * 0.463 + 0.5, -16.9, 0.08, 1, 0.08, IRON, { outline: 0.02 });
    B('brick', -20.2, -17, -12.5, -16.8, 8.4, 10.6, STONE2, { outline: 0.05 }); B('brick', -20.2, -19.4, -20, -16.8, 8.4, 10.6, STONE2, { outline: 0.05 });
    B('brick', -20.2, -20, -12.5, -19.4, 8.4, 10.6, STONE2, { outline: 0.05 });
    B('roof', -20.4, -20.1, -12.3, -16.6, 10.6, 10.8, SLATE, { outline: 0.05 }); B('flat', -20.45, -20.15, -12.25, -16.55, 10.5, 10.62, TRIM, { outline: 0.02, col: false });
    door('hatch', new THREE.BoxGeometry(0.16, 2.2, 2.4), G.toon({ map: G.tex.metal, color: 0x2f8f8a }), -12.5, 9.5, -18.1, solid(-12.7, -19.4, -12.3, -17, 8.4, 10.6), new THREE.Vector3(0, 0, 2.5));
    // the gallery: the dock office
    B('wood', -31.4, -19.4, -22, 5.4, 3.7, 4, 0x8a6a48, { outline: 0.05 });
    [[-22.3, -12], [-22.3, -3], [-22.3, 2]].forEach(p => { B('concrete', p[0] - 0.24, p[1] - 0.24, p[0] + 0.24, p[1] + 0.24, 0, 3.7, STONE, { outline: 0.04 }); D('flat', p[0], 3.5, p[1], 0.62, 0.2, 0.62, TRIM, { outline: 0.03 }); });
    B('flat', -22.12, -17, -22, 2.3, 4, 5, IRON, { outline: 0.03, s: { cam: false } }); D('flat', -22.06, 5.05, -7.35, 0.16, 0.1, 19.4, TRIM, { outline: 0.03 });
    ramp('wood', -22, 2.4, -14, 5.0, 0, 4, 0, 'x', 0x8a6a48, { steps: true });
    ramp('wood', -22, -19.4, -12.5, -17, 3.6, 4, 8.4, 'x', 0x8a6a48, { steps: true });
    B('wood', -30.5, -9.6, -27.6, -7.9, 4, 4.85, 0x6e4a2c, { outline: 0.05 });
    D('flat', -29, 4.92, -8.8, 0.7, 0.06, 0.5, 0xece6d6, { ry: 0.2, outline: 0.02 }); cyl('flat', -30, 5.1, -8.3, 0.12, 0.16, 0.5, 0xc9a063, { outline: 0.03 }); D('glow', -30, 5.42, -8.3, 0.34, 0.2, 0.34, LAMP, { outline: 0 });
    // pigeonholes for the manifests, and the dock's own copy of the Count
    [[-16, -12], [-2, 3]].forEach(r => { B('wood', -31.3, r[0], -30.4, r[1], 4, 5.9, 0x6e4a2c, { outline: 0.05 }); for (let y = 4.4; y < 5.8; y += 0.45) for (let z = r[0] + 0.35; z < r[1] - 0.2; z += 0.55) D('flat', -30.38, y, z, 0.04, 0.3, 0.4, rnd() < 0.6 ? 0xece6d6 : 0x15151f, { outline: 0 }); });
    standard(-31, -5.6, 4, 3.6, VIOLET);
    crateStatic(-24, -18.4, 1.1, 4); crateStatic(-29, 4.4, 1.2, 4);
    const rack = (x0, z0, x1, z1) => { B('flat', x0, z0, x1, z1, 0, 0.25, IRON, { outline: 0.03 }); solid(x0, z0, x1, z1, 0, 4.6);
      for (let y = 1.5; y < 4.7; y += 1.5) D('wood', (x0 + x1) / 2, y, (z0 + z1) / 2, x1 - x0, 0.1, z1 - z0, 0x8a6a48, { outline: 0.03 });
      for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / 3) { D('flat', x, 2.3, z0 + 0.06, 0.12, 4.6, 0.12, TRIM, { outline: 0.025 }); D('flat', x, 2.3, z1 - 0.06, 0.12, 4.6, 0.12, TRIM, { outline: 0.025 }); }
      const rr = SC.seeded(Math.abs(x0 * 31 + z0 * 7) | 0);
      for (let y = 0.25; y < 3.5; y += 1.5) for (let x = x0 + 0.8; x < x1 - 0.5; x += 1.5) if (rr() < 0.7) { const s = 0.7 + rr() * 0.5; D('crate', x, y + s / 2 + (y > 0.3 ? 0.05 : 0), (z0 + z1) / 2, s, s, Math.min(s, z1 - z0 - 0.1), rr() < 0.5 ? 0xb98a55 : 0xd9a05f, { outline: 0.03 }); }
    };
    rack(-10, -15.2, 2, -14); rack(-8, 0.4, 3.5, 1.6); rack(-19.5, -13.6, -13, -12.4);
    [[-11, -7.5], [-1, -7.5], [-11, 3], [-1, -17]].forEach(p => { B('concrete', p[0] - 0.34, p[1] - 0.34, p[0] + 0.34, p[1] + 0.34, 0, 8, STONE, { outline: 0.04 }); D('concrete', p[0], 0.3, p[1], 1, 0.6, 1, STONE2, { outline: 0.04 }); D('flat', p[0], 7.5, p[1], 0.95, 0.3, 0.95, TRIM, { outline: 0.03 }); });
    crateStatic(3.6, -17.6, 1.6); crateStatic(3.9, -15.9, 1.2); crateStatic(3.7, -17.5, 1, 1.6, 0xd9a05f); crateStatic(-20.6, 0.6, 1.4); crateStatic(-25, -2, 1.3); crateStatic(-27.5, -14, 1.5);
    crate(-4.6, 4.4, 1, 0, 'hp'); crate(-5.7, 4.5, 1); crate(-18.6, -17.8, 1, 0, 'meter'); crate(2.6, 3.4, 1, 0, 'hp'); crate(-29.6, -18, 1, 0, 'hp');
    D('flat', -13, 0.02, -6.5, 30, 0.02, 0.5, VIOLET, { outline: 0 }); D('flat', -13, 0.022, -6.5, 30, 0.02, 0.1, TRIM, { outline: 0 });       // the runner down the hall
    [[-4.5, -9.5], [-15.5, -1], [-26, -8]].forEach((p, i) => {
      cyl('flat', p[0], 7.2, p[1], 0.02, 0.02, 1.8, 0x15151f, { outline: 0 }); cyl('flat', p[0], 6.2, p[1], 0.2, 0.7, 0.4, TRIM, { seg: 10, outline: 0.04 });
      D('glow', p[0], 5.98, p[1], 0.5, 0.06, 0.5, LAMP, { outline: 0 });
      const l = new THREE.PointLight(0xffd9a0, i === 2 ? 22 : 60, 20, 1.6); l.position.set(p[0], i === 2 ? 6.6 : 5.6, p[1]); G.scene.add(l);
    });

    // ----- the service cut behind the bond house -----
    crate(-30.6, -21, 1, 0, 'hp'); crate(-6, -44.6, 1, 0, 'meter'); crate(-4.9, -44.8, 1, 0, 'hp');
    crateStatic(-6.2, -29.4, 1.4); crateStatic(-6.2, -30.9, 1.1, 0, 0xd9a05f); solid(-6.95, -31.5, -5.45, -28.7, 0, 1.4);
    column(-6, -40, 3.6, TLAMP);

    // ----- the roofs -----
    mass(-32, -46, -10, -22, 9, STONE2, { flatTop: true }); D('roof', -21, 9.02, -34, 22, 0.04, 24, SLATE, { outline: 0 });        // the signal roof
    mass(-2, -46, 32, -22, 11, 0xd6d0c2, { flatTop: true }); D('concrete', 15, 11.02, -34, 34, 0.04, 24, DECK, { outline: 0 });   // Mooring One
    ramp('wood', -27, -22.3, -25, -19.7, 8.2, 9, 8.4, 'z', 0xb98a55);
    parapet(-32, -46, -10, -22, 9, [{ side: 's', a: -27.2, b: -24.8 }, { side: 'e', a: -35.8, b: -32.7 }], STONE2);
    ramp('wood', -10.3, -35.5, -1.7, -33, 8.6, 9, 11, 'x', 0xb98a55);                                                               // the gangway up to Mooring One
    [[-8, -35.6], [-4, -35.6], [-8, -32.9], [-4, -32.9]].forEach(p => D('flat', p[0], 4.8, p[1], 0.14, 10, 0.14, IRON, { outline: 0.03 }));
    D('flat', -6, 5, -35.6, 5.8, 0.1, 0.1, IRON, { rz: 0.7, outline: 0.02 }); D('flat', -6, 5, -32.9, 5.8, 0.1, 0.1, IRON, { rz: -0.7, outline: 0.02 });
    line(-10.2, 10.1, -35.5, -1.8, 12.1, -35.5, 0.035, GILT); line(-10.2, 10.1, -33, -1.8, 12.1, -33, 0.035, GILT);
    parapet(-2, -46, 32, -22, 11, [{ side: 'w', a: -35.8, b: -32.7 }], STONE2);
    // signal roof: the cable drum, line lockers, a skylight, the signal hut and its mast
    solid(-29.9, -43.9, -26.1, -40.1, 9, 12); winch(-28, -42, 9, true); D('concrete', -28, 9.2, -42, 3.8, 0.4, 3.8, STONE2, { outline: 0.05 }); line(-28, 10.4, -42, -28, 21, -42, 0.1); line(-28, 20.4, -42, -41, 26, -70, 0.04);
    [[-22, -25.4], [-13.5, -43.6], [-18, -43.6]].forEach(p => { B('concrete', p[0] - 1, p[1] - 0.7, p[0] + 1, p[1] + 0.7, 9, 10.3, STONE, { outline: 0.06 }); D('flat', p[0], 10.36, p[1], 2.1, 0.12, 1.5, GILT, { outline: 0.03 }); });
    B('glass', -21.5, -37.5, -18, -34, 9, 9.9, 0xffffff, { outline: 0 }); B('flat', -21.7, -37.7, -17.8, -33.8, 9, 9.3, IRON, { outline: 0.04, col: false });
    B('brick', -30.5, -31.5, -29.3, -30.3, 9, 11.6, STONE2, { outline: 0.05 }); D('glow', -29.9, 11.9, -30.9, 0.5, 0.5, 0.5, TLAMP, { outline: 0 });
    B('wood', -30.8, -28, -28.6, -25.4, 9, 10.9, 0x8a6a48, { outline: 0.05 }); D('flat', -29.7, 10.98, -26.7, 2.6, 0.12, 3, IRON, { outline: 0.03 });
    D('flat', -28.56, 10, -26.7, 0.04, 1.2, 1.8, 0x15151f, { outline: 0 }); D('glow', -28.52, 10.1, -26.7, 0.04, 0.5, 0.5, LAMP, { outline: 0 });
    standard(-23, -45.6, 9.75, 5.4, VIOLET); standard(-13, -45.6, 9.75, 5.4, TEAL);
    // Mooring One: the last cleat, the winches, the mast, and the lines going out to the pairs still made fast
    cyl('metal', 16, 11.35, -22.9, 0.22, 0.3, 0.7, 0xc9a063, { outline: 0.04 }); D('metal', 16, 11.72, -22.9, 1.1, 0.14, 0.24, 0xc9a063, { outline: 0.04 });
    solid(15.6, -23.2, 16.4, -22.6, 11, 11.8, { cam: false });
    [[27, -43.5], [29.6, -24.6]].forEach(p => { solid(p[0] - 1, p[1] - 0.7, p[0] + 1, p[1] + 0.7, 11, 12.3); winch(p[0], p[1], 11, true); });
    solid(-0.7, -44.9, 3.1, -41.1, 11, 14); D('brick', 1.2, 12.5, -43, 3.6, 3, 3.6, STONE2, { outline: 0.07 }); D('flat', 1.2, 14.1, -43, 3.9, 0.3, 3.9, GILT, { outline: 0.04 });
    line(1.2, 14.2, -43, 1.2, 25, -43, 0.14); line(-0.8, 22, -43, 3.2, 22, -43, 0.06); D('glow', 1.2, 25.3, -43, 0.5, 0.5, 0.5, TLAMP, { outline: 0 }); D('glow', -0.8, 21.7, -43, 0.3, 0.4, 0.3, LAMP, { outline: 0 }); D('glow', 3.2, 21.7, -43, 0.3, 0.4, 0.3, LAMP, { outline: 0 });
    B('brick', 14, -45.6, 15.2, -44.4, 11, 13.8, STONE2, { outline: 0.05 });
    [6, 24].forEach(x => D('flat', x, 14, -45.6, 0.3, 6, 0.3, IRON, { outline: 0.03 }));
    sign('MOORING ONE', 15, 15.6, -45.5, 0, 17, 3.2, '#e8c25a', '#0b0d24');
    crate(30, -34, 1, 11, 'hp'); crate(0.6, -24, 1, 11, 'hp'); crate(30, -40, 1, 11, 'meter');
    crate(-12, -24, 1, 9, 'hp'); crate(-30.6, -36, 1, 9, 'meter');
    [8, 22].forEach(x => { bollard(x, -44.9, 11); bollard(x, -23.3, 11); });
    for (let x = 3; x < 31; x += 4.6) D('flat', x, 11.05, -34, 0.12, 0.02, 20, GILT, { outline: 0 });
    // the pairs out past the north edge, riding level with the roof
    [[6, -66], [12.6, -66.4], [25, -64], [31.6, -64.6], [-20, -66], [-26.6, -66.5]].forEach((p, i) => bargeS(p[0], 9.2 + (i % 2) * 0.4 - (p[0] < 0 ? 2 : 0), p[1], Math.PI / 2 + (i % 3 - 1) * 0.04));
    [[8, 11.9, -45.2, 8, 10, -58], [22, 11.9, -45.2, 26, 10, -56], [-18, 9.9, -45.2, -21, 8, -58]].forEach(l => line(l[0], l[1], l[2], l[3], l[4], l[5], 0.045));

    W.statics = batch.build(G.scene); batch = null;
  };

