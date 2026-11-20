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
      D('flat', x + 0.8, y + h - 1.6, z, 1.3, 2.8, 0.06, col, { outline: 0.04 }); cyl('flat', x + 0.8, y + h - 1.2, z + 0.05, 0.3, 0.3, 0.04, GILT, { rx: Math.PI / 2, seg: 12, outline: 0 }); D('flat', x + 0.8, y + h - 1.2, z + 0.08, 0.3, 0.12, 0.02, 0xffffff, { outline: 0 }); D('flat', x + 0.8, y + h - 1.2, z + 0.1, 0.1, 0.1, 0.02, IRON, { outline: 0 }); D('flat', x, y + h + 0.1, z, 0.22, 0.22, 0.22, GILT, { outline: 0.03 });
    }

    /* ----- lived in: what people leave behind them ----- */
    const CHALK = 0xfff6d8;
    // a sun in chalk on a wall: the Unlit's mark, low down, where the Accredited do not look
    function chalkW(x, y, z, ry, s) { const tx = Math.cos(ry), tz = -Math.sin(ry); D('flat', x, y, z, s, s, 0.02, CHALK, { ry, outline: 0 });
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, r = s * 1.15; D('flat', x + tx * Math.cos(a) * r, y + Math.sin(a) * r, z + tz * Math.cos(a) * r, s * 0.3, s * 0.3, 0.02, CHALK, { ry, outline: 0 }); } }
    function chalkF(x, y, z, s) { D('flat', x, y, z, s, 0.012, s, CHALK, { ry: 0.5, outline: 0 }); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; D('flat', x + Math.cos(a) * s * 1.2, y, z + Math.sin(a) * s * 1.2, s * 0.3, 0.012, s * 0.3, CHALK, { ry: a, outline: 0 }); } }
    // a litter: the Accredited do not walk the docks, they are carried over them
    function litter(x, z, y, ry, col) { const c = Math.cos(ry), sn = Math.sin(ry);
      solid(x - 1.2, z - 1.2, x + 1.2, z + 1.2, y, y + 2.2, { cam: false });
      D('flat', x, y + 0.95, z, 1.9, 1.1, 1.1, IVORY, { ry, outline: 0.05 }); D('flat', x, y + 1.62, z, 2.1, 0.16, 1.3, GILT, { ry, outline: 0.04 }); D('flat', x, y + 1.8, z, 1.3, 0.2, 0.8, GILT, { ry, outline: 0.03 });
      D('flat', x, y + 1.0, z, 1.0, 0.8, 1.14, col, { ry, outline: 0 }); D('flat', x, y + 0.36, z, 2.0, 0.1, 1.2, GILT, { ry, outline: 0.03 });
      [-0.66, 0.66].forEach(o => D('wood', x - sn * o, y + 0.5, z - c * o * -1, 4.2, 0.09, 0.09, 0x4a3524, { ry, outline: 0.03 }));
      [[-0.9, -0.5], [0.9, -0.5], [-0.9, 0.5], [0.9, 0.5]].forEach(p => D('flat', x + c * p[0] + sn * p[1], y + 0.18, z - sn * p[0] + c * p[1], 0.1, 0.36, 0.1, GILT, { outline: 0.02 }));
      // and the four pads worn into the stone where the bearers stand
      [[-1.9, -0.66], [1.9, -0.66], [-1.9, 0.66], [1.9, 0.66]].forEach(p => D('flat', x + c * p[0] + sn * p[1], y + 0.033, z - sn * p[0] + c * p[1], 0.34, 0.02, 0.2, 0x8f8a7c, { ry, outline: 0 })); }
    // a porter's load, put down where he was told to kneel
    function load(x, y, z, ry) { D('crate', x, y + 0.3, z, 0.7, 0.6, 0.5, 0xb98a55, { ry, outline: 0.04 }); D('crate', x + 0.05, y + 0.76, z, 0.5, 0.32, 0.42, 0xd9a05f, { ry: ry + 0.2, outline: 0.04 }); D('flat', x, y + 0.5, z, 0.74, 0.06, 0.54, IRON, { ry, outline: 0 }); D('flat', x + 0.5, y + 0.04, z + 0.3, 0.5, 0.03, 0.08, 0x8a6a48, { ry: ry + 0.9, outline: 0 }); }
    function halbD(x, y, z, ry) { D('wood', x, y + 0.05, z, 2.5, 0.06, 0.06, 0x4a3524, { ry, outline: 0.02 }); D('flat', x + Math.cos(ry) * 1.2, y + 0.05, z - Math.sin(ry) * 1.2, 0.34, 0.04, 0.3, 0xd9dde6, { ry, outline: 0.03 }); }
    function helmD(x, y, z, ry) { cyl('flat', x, y + 0.14, z, 0.15, 0.19, 0.28, 0xd9dde6, { seg: 8, outline: 0.03 }); D('flat', x, y + 0.3, z, 0.05, 0.12, 0.34, GILT, { ry, outline: 0.02 }); }
    // a House banner, torn down and walked on
    function torn(x, y, z, ry, col) { D('flat', x, y + 0.02, z, 1.0, 0.02, 2.2, col, { ry, outline: 0 }); D('flat', x + 0.2, y + 0.035, z + 0.3, 0.5, 0.02, 0.5, GILT, { ry: ry + 0.4, outline: 0 }); D('wood', x - 0.6, y + 0.05, z - 0.8, 1.6, 0.05, 0.05, GILT, { ry: ry + 1.2, outline: 0.02 }); }
    // what is left of a camp: poles, a ridge line, canvas gone grey
    function tentD(x, z, ry, col) { const c = Math.cos(ry), sn = Math.sin(ry); [-1, 1].forEach(k => { cyl('wood', x + c * k * 1.2, 0.8, z - sn * k * 1.2, 0.04, 0.05, 1.6 - (k > 0 ? 0.5 : 0), 0x4a3524, { outline: 0.02 }); });
      line(x - c * 1.2, 1.6, z + sn * 1.2, x + c * 1.2, 1.1, z - sn * 1.2, 0.02, 0x8a6a48); D('flat', x + sn * 0.5, 0.5, z + c * 0.5, 2.3, 0.03, 1.5, 0xb9b3a4, { ry, rx: 0.9, outline: 0.03 }); D('flat', x - sn * 0.7, 0.05, z - c * 0.7, 2.0, 0.03, 1.2, 0x9a9486, { ry: ry + 0.2, outline: 0 }); D('flat', x - sn * 0.7, 0.07, z - c * 0.7, 0.5, 0.03, 0.5, col, { ry: ry + 0.5, outline: 0 }); }
    function fireRing(x, z, lit) { for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; D('concrete', x + Math.cos(a) * 0.7, 0.1, z + Math.sin(a) * 0.7, 0.3, 0.2, 0.26, STONE2, { ry: a, outline: 0.03 }); } cyl('flat', x, 0.03, z, 0.6, 0.6, 0.03, 0x15151f, { seg: 10, outline: 0 }); D('wood', x, 0.12, z, 0.8, 0.09, 0.1, 0x2a1f18, { ry: 0.6, outline: 0.02 }); D('wood', x, 0.14, z, 0.8, 0.09, 0.1, 0x2a1f18, { ry: -0.7, outline: 0.02 }); if (lit) D('glow', x, 0.2, z, 0.2, 0.1, 0.2, 0xff7a1f, { outline: 0 }); }
    // a marker stone with a gilt nail: the Authority counts everything, even the ground
    function marker(x, z, n) { D('concrete', x, 0.3, z, 0.34, 0.6, 0.24, STONE, { ry: n, rz: 0.06 * (n % 3 - 1), outline: 0.04 }); D('flat', x, 0.62, z, 0.08, 0.06, 0.08, GILT, { outline: 0 }); }
    const DOCKS_A = () => {
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
    D('concrete', 0, -0.76, 34.15, 7.8, 1.5, 32.2, DECK, { outline: 0.06 });                      // the causeway out to the dock stair
    B('flat', -46.2, 17.9, -3.9, 18.25, -1.6, -1.2, GILT, { outline: 0.04, col: false }); B('flat', 3.9, 17.9, 46.2, 18.25, -1.6, -1.2, GILT, { outline: 0.04, col: false });
    D('concrete', 0, -1.9, 18.6, 92, 0.9, 1.6, STONE2, { outline: 0.06 });
    for (let x = -42; x <= 42; x += 7) if (Math.abs(x) > 5) { D('concrete', x, -3.4, 18.9, 0.9, 4.4, 2.2, STONE2, { rx: 0.5, outline: 0.06 }); }
    for (let z = 22; z <= 46; z += 6) { D('concrete', 0, -2.6, z, 7.2, 2.4, 0.8, STONE2, { outline: 0.05 }); D('flat', 0, -1.55, z, 8.1, 0.2, 0.3, GILT, { outline: 0.03 }); }
    // deck inlay: gilt lines the freight sleds follow, and the mooring numbers
    for (let x = -37; x < 40; x += 6) D('flat', x, 0.011, 12, 2.6, 0.02, 0.16, GILT, { outline: 0 });
    D('flat', 0, 0.011, 15.2, 79, 0.02, 0.1, DECK2, { outline: 0 }); D('flat', 0, 0.011, 8.8, 79, 0.02, 0.1, DECK2, { outline: 0 });
    for (let z = 20; z < 46; z += 2.2) D('flat', 0, 0.011, z, 0.14, 0.02, 1.2, GILT, { outline: 0 });
    [[1.2, 40.8, 2.2, 1.3], [-1.4, 33, 1.6, 2.4], [1.6, 25.5, 2.4, 1.2], [-20, 10, 3, 1.6], [14, 13, 2.4, 1.4], [22, -6, 3, 2], [-6, -38, 3, 2]].forEach(p => D('flat', p[0], 0.032, p[1], p[2], 0.02, p[3], 0x5c5e9c, { outline: 0, ry: 0.4 }));

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
    D('brick', 43.4, 3.0, 12, 3.2, 6, 3.2, STONE2, { outline: 0.08 }); D('flat', 43.4, 6.2, 12, 3.6, 0.4, 3.6, GILT, { outline: 0.04 });
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
    for (let x = 9; x < 31; x += 5.5) D('flat', x, 0.011, -9, 0.14, 0.02, 20, GILT, { outline: 0 });
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
    D('flat', -13, 0.052, -6.5, 30, 0.02, 0.5, VIOLET, { outline: 0 }); D('flat', -13, 0.074, -6.5, 30, 0.02, 0.1, TRIM, { outline: 0 });       // the runner down the hall
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
    for (let x = 3; x < 31; x += 4.6) D('flat', x, 11.07, -34, 0.12, 0.02, 20, GILT, { outline: 0 });
    // the pairs out past the north edge, riding level with the roof
    [[6, -66], [12.6, -66.4], [25, -64], [31.6, -64.6], [-20, -66], [-26.6, -66.5]].forEach((p, i) => bargeS(p[0], 9.2 + (i % 2) * 0.4 - (p[0] < 0 ? 2 : 0), p[1], Math.PI / 2 + (i % 3 - 1) * 0.04));
    [[8, 11.9, -45.2, 8, 10, -58], [22, 11.9, -45.2, 26, 10, -56], [-18, 9.9, -45.2, -21, 8, -58]].forEach(l => line(l[0], l[1], l[2], l[3], l[4], l[5], 0.045));

    };
    // ===== theirs: what the Accredited build to be looked at, and what they build to keep us in line =====
    const GREEN = 0x3f9a5c, GREEN2 = 0x2f7a4a, WATER = 0x9fd7ff;
    const blob = (x, y, z, sx, sy, sz, col, ol) => { const g = new THREE.IcosahedronGeometry(1, 1); g.scale(sx, sy, sz); batch.add('flat', g, G.mx(x, y, z, x * 1.7), col, ol === undefined ? 0.06 : ol); g.dispose(); };
    /* the Watcher: a gold sun with an open eye. The same cloth hangs over Ashgate Square. */
    function watcher(x, y, z, ry, s) {
      const rx = Math.cos(ry), rz = -Math.sin(ry), nx = Math.sin(ry), nz = Math.cos(ry);
      cyl('flat', x, y, z, s, s, 0.14, GILT, { rx: Math.PI / 2, ry, seg: 20, outline: 0.06 });
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, d = s * (i % 2 ? 1.5 : 1.75); D('flat', x + rx * Math.cos(a) * d, y + Math.sin(a) * d, z + rz * Math.cos(a) * d, s * 0.16, s * (i % 2 ? 0.6 : 1.0), 0.1, GILT, { ry, rz: a - Math.PI / 2, outline: 0.04 }); }
      D('flat', x + nx * 0.1, y, z + nz * 0.1, s * 1.25, s * 0.5, 0.06, 0xffffff, { ry, outline: 0.04 });
      cyl('flat', x + nx * 0.15, y, z + nz * 0.15, s * 0.24, s * 0.24, 0.06, IRON, { rx: Math.PI / 2, ry, seg: 10, outline: 0 });
    }
    /* an Auditor in gold, twice the height of anybody who has to walk past it, holding the light */
    function statue(x, z, y, h, ry, solidToo) {
      if (solidToo !== false) solid(x - 0.8, z - 0.8, x + 0.8, z + 0.8, y, y + 1.2 + h, { cam: false });
      D('concrete', x, y + 0.6, z, 1.6, 1.2, 1.6, STONE, { outline: 0.06 }); D('flat', x, y + 1.24, z, 1.75, 0.12, 1.75, GILT, { outline: 0.03 });
      const b = y + 1.3, fx = Math.sin(ry), fz = Math.cos(ry), sx = Math.cos(ry), sz = -Math.sin(ry);
      cyl('flat', x, b + h * 0.3, z, h * 0.11, h * 0.2, h * 0.6, GILT, { seg: 8, outline: 0.06 });
      D('flat', x, b + h * 0.68, z, h * 0.26, h * 0.2, h * 0.15, GILT, { ry, outline: 0.05 });
      blob(x, b + h * 0.86, z, h * 0.075, h * 0.09, h * 0.075, GILT, 0.04);
      cyl('glow', x - fx * h * 0.06, b + h * 0.88, z - fz * h * 0.06, h * 0.17, h * 0.17, 0.05, LAMP, { rx: Math.PI / 2, ry, seg: 16, outline: 0 });     // the halo
      D('flat', x + sx * h * 0.2, b + h * 0.86, z + sz * h * 0.2, h * 0.06, h * 0.36, h * 0.06, GILT, { ry, rz: -0.35, outline: 0.04 });                 // the raised arm
      D('glow', x + sx * h * 0.27, b + h * 1.06, z + sz * h * 0.27, h * 0.09, h * 0.09, h * 0.09, LAMP, { outline: 0 });
      D('flat', x - sx * h * 0.17, b + h * 0.56, z - sz * h * 0.17 + fz * 0.05, h * 0.1, h * 0.14, h * 0.04, STONE, { ry, outline: 0.03 });               // the book in the other hand: the Count
    }
    /* a tree. Nobody below the rock has seen one. Up here they are furniture. */
    function tree(x, z, y, s) {
      s = s || 1; solid(x - 0.55, z - 0.55, x + 0.55, z + 0.55, y, y + 0.8, { cam: false });
      D('concrete', x, y + 0.35, z, 1.1, 0.7, 1.1, STONE, { outline: 0.05 }); D('flat', x, y + 0.72, z, 1.2, 0.1, 1.2, GILT, { outline: 0.03 });
      cyl('wood', x, y + 1.3 * s, z, 0.07, 0.1, 1.4 * s, 0x6e4a2c, { outline: 0.03 });
      blob(x, y + 2.3 * s, z, 0.75 * s, 0.7 * s, 0.75 * s, GREEN); blob(x + 0.2, y + 3.0 * s, z - 0.1, 0.5 * s, 0.5 * s, 0.5 * s, GREEN2);
    }
    const DOCKS_B = () => {
    // the Watcher, inlaid where the causeway meets the quay: everyone who comes up the stair walks across the eye
    cyl('flat', 0, 0.053, 12, 2.5, 2.5, 0.02, GILT, { seg: 28, outline: 0 }); cyl('flat', 0, 0.074, 12, 2.1, 2.1, 0.02, DECK, { seg: 28, outline: 0 });
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; D('flat', Math.sin(a) * 3.6, 0.053, 12 + Math.cos(a) * 3.6, 0.3, 0.02, i % 2 ? 1.2 : 2.0, GILT, { ry: a, outline: 0 }); }
    D('flat', 0, 0.095, 12, 2.6, 0.02, 1.0, 0xffffff, { outline: 0 }); cyl('flat', 0, 0.116, 12, 0.48, 0.48, 0.02, IRON, { seg: 14, outline: 0 });
    // the Auditors on the quay rail, and on Mooring One
    statue(-18, 16.9, 0, 4.4, Math.PI); statue(18, 16.9, 0, 4.4, Math.PI);
    statue(10, -44.3, 11, 3.6, 0); statue(20, -44.3, 11, 3.6, 0);
    statue(7.6, -11.4, 0, 3.0, Math.PI / 2); statue(7.6, -1.6, 0, 3.0, Math.PI / 2);
    // the twelve standards, one a House, along the open rail
    [0x5a3aa8, 0x2f8f8a, 0xd98a1f, 0x8a1f24, 0x3a5fa8, 0xefe8d4, 0x2f7a4a, 0xc9a063, 0x7a2f8a, 0x23232e, 0xb5484a, 0x4a8ac8].forEach((c, i) => { const x = i < 6 ? -36.5 + i * 5.6 : 8.5 + (i - 6) * 5.6; standard(x, 17.75, 0, 5.4, c); });
    // the great eye over the freight yard, and the words under it
    watcher(15, 7.6, -21.82, 0, 1.25); sign('GRATITUDE IS BREATH', 15, 4.5, -21.86, 0, 9.5, 1.0, '#07070d', '#e8c25a');
    watcher(-43, 11.4, 12, Math.PI / 2, 1.3); D('concrete', -43, 9.2, 12, 0.5, 1.6, 0.5, STONE, { outline: 0.04 });
    // greens: trees in gilt tubs along the bond house, by the Spire gate, on Mooring One
    [[-21, 7.0], [-15, 7.0], [-1.6, 7.0], [3.4, 7.0], [-38.6, 10.2], [-38.6, 13.8], [38.6, 7.2], [38.6, 16.8]].forEach(p => tree(p[0], p[1], 0, 1));
    tree(30.4, -44.8, 11, 0.9); tree(-0.4, -23.4, 11, 0.9); tree(-30.8, -23.2, 9, 0.8);
    // a fountain, running, on a shelf where the tiers below are rationed by the cup
    solid(18.3, 8.9, 21.7, 12.3, 0, 0.7, { cam: false }); cyl('concrete', 20, 0.3, 10.6, 1.75, 1.85, 0.6, STONE, { seg: 14, outline: 0.06 }); cyl('flat', 20, 0.62, 10.6, 1.5, 1.5, 0.04, WATER, { seg: 14, outline: 0 });
    cyl('concrete', 20, 1.1, 10.6, 0.16, 0.24, 1.2, STONE, { outline: 0.04 }); cyl('flat', 20, 1.75, 10.6, 0.7, 0.2, 0.22, GILT, { seg: 12, outline: 0.04 }); cyl('flat', 20, 1.87, 10.6, 0.6, 0.6, 0.03, WATER, { seg: 12, outline: 0 });
    [0, 1.6, 3.2, 4.8].forEach(a => line(20 + Math.cos(a) * 0.55, 1.8, 10.6 + Math.sin(a) * 0.55, 20 + Math.cos(a) * 1.0, 0.66, 10.6 + Math.sin(a) * 1.0, 0.03, WATER));
    // the viewing pavilion: where they sit to watch the barges come in
    D('flat', -28.2, 0.36, 7.3, 1.7, 0.26, 0.62, IVORY, { outline: 0.04 }); D('flat', -28.95, 0.66, 7.3, 0.2, 0.6, 0.62, IVORY, { rz: 0.35, outline: 0.04 }); D('flat', -28.2, 0.52, 7.3, 1.4, 0.08, 0.5, VIOLET, { outline: 0 });
    cyl('flat', -26.2, 0.4, 7.3, 0.3, 0.2, 0.8, GILT, { seg: 8, outline: 0.04 }); blob(-26.2, 0.92, 7.3, 0.24, 0.14, 0.24, GREEN, 0.03); cyl('glow', -25.7, 0.9, 7.5, 0.05, 0.05, 0.2, LAMP, { outline: 0 });
    [-29, -25].forEach(x => { D('flat', x, 1.3, 7.8, 0.1, 2.6, 0.1, GILT, { outline: 0.03 }); D('flat', x, 1.5, 7.76, 0.5, 2.0, 0.04, IVORY, { outline: 0.03 }); });
    // and ours: the line soot walk, the plates where porters kneel, the meter at the gate
    for (let x = -30; x < 5; x += 1.6) D('flat', x, 0.032, 8.15, 1.0, 0.02, 0.14, IRON, { outline: 0 });
    sign('SERVICE KEEP TO THE LINE', -9.5, 1.5, 6.14, 0, 3.6, 0.55, '#e8c25a', '#07070d'); sign('KNEEL AT THE BELL', -39.72, 1.5, 15.6, Math.PI / 2, 2.8, 0.5, '#e8c25a', '#07070d');
    for (let x = -38.2; x < -35.4; x += 0.85) for (let z = 10.4; z <= 13.6; z += 0.8) D('flat', x, 0.032, z, 0.36, 0.02, 0.2, 0xb8902e, { outline: 0 });
    D('metal', 16.9, 1.1, 6.5, 0.4, 2.2, 0.5, GILT, { outline: 0.05 }); D('glow', 16.9, 1.7, 6.77, 0.24, 0.5, 0.04, 0xff5a1f, { outline: 0 }); sign('AIR OWED', 16.9, 2.5, 6.78, 0, 1.3, 0.34, '#07070d', '#e8c25a');   // the breath meter every porter passes
    // a colonnade on the east edge of Mooring One, to frame the fleet
    [-43, -38, -33, -28].forEach(z => { cyl('concrete', 31.8, 13.95, z, 0.22, 0.27, 4.4, STONE, { outline: 0.04 }); D('flat', 31.8, 16.2, z, 0.7, 0.16, 0.7, GILT, { outline: 0.03 }); });
    D('concrete', 31.8, 16.6, -35.5, 0.7, 0.6, 16.4, STONE, { outline: 0.06 }); D('flat', 31.8, 16.95, -35.5, 0.8, 0.12, 16.6, GILT, { outline: 0.03 });
    // ===== lived in =====
    litter(-19.5, 15.6, 0, 0, VIOLET); litter(27.5, 8.4, 0, 0.5, TEAL);
    // the porters' tap: one cup a shift, the cups on chains, and the tally of who has drunk
    D('metal', -22, 1.0, 6.3, 0.5, 0.9, 0.3, 0x8d94ac, { outline: 0.04 }); D('flat', -22, 0.72, 6.5, 0.08, 0.08, 0.3, IRON, { outline: 0.02 }); D('concrete', -22, 0.25, 6.6, 0.8, 0.5, 0.5, STONE2, { outline: 0.04 }); D('flat', -22, 0.51, 6.6, 0.6, 0.02, 0.34, WATER, { outline: 0 });
    [-0.3, 0.3].forEach(o => { line(-22 + o, 1.3, 6.4, -22 + o * 1.6, 0.62, 6.84, 0.012, IRON); cyl('metal', -22 + o * 1.6, 0.58, 6.84, 0.06, 0.05, 0.1, 0xb98a55, { seg: 6, outline: 0.02 }); });
    sign('PORTERS. ONE CUP. NOTED.', -22, 1.9, 6.14, 0, 2.6, 0.4, '#e8c25a', '#07070d');
    // the board where this quarter's struck lines are posted, and what somebody left under it
    D('wood', -16, 1.7, 6.16, 2.6, 1.7, 0.08, 0x3a3350, { outline: 0.05 }); sign('STRUCK THIS QUARTER', -16, 2.4, 6.22, 0, 2.3, 0.3, '#07070d', '#e8c25a');
    for (let i = 0; i < 15; i++) D('flat', -17.05 + (i % 5) * 0.52, 2.0 - Math.floor(i / 5) * 0.4, 6.22, 0.42, 0.3, 0.02, i === 7 ? 0xffe14a : 0xece6d6, { rz: (i * 7 % 5 - 2) * 0.03, outline: 0 });
    for (let i = 0; i < 6; i++) D('glow', -17 + i * 0.4, 0.1, 6.5 + (i % 2) * 0.16, 0.08, 0.16 + (i % 3) * 0.05, 0.08, i % 2 ? LAMP : 0xff9a3c, { outline: 0 });
    D('crate', -15.2, 0.07, 6.6, 0.3, 0.14, 0.2, 0x8a1f24, { ry: 0.4, outline: 0.02 });
    chalkW(-17.6, 0.5, 6.13, 0, 0.16); chalkW(-38.6, 0.45, 6.6, 0, 0.14); chalkF(6.9, 0.034, 16.9, 0.2); chalkF(-33.5, 0.034, 17.2, 0.16);
    // loads put down at the kneeling plates, and never picked up again tonight
    load(-37.2, 0, 14.6, 0.3); load(-36.2, 0, 10.9, -0.4); load(13.5, 0, 16.9, 1.1); halbD(1.5, 0, 8.6, 0.7); helmD(2.6, 0, 9.5, 0.4); halbD(-12.4, 0, 16.4, -0.3);
    // a wine table by the pavilion, knocked over when the bell went wrong
    D('flat', -24.2, 0.3, 8.6, 0.9, 0.06, 0.9, IVORY, { rz: 1.2, outline: 0.04 }); cyl('glow', -23.6, 0.06, 9.1, 0.07, 0.07, 0.12, 0xff5a8a, { seg: 6, outline: 0 }); D('flat', -23.4, 0.034, 9.3, 0.7, 0.02, 0.4, 0x8a1f3a, { ry: 0.6, outline: 0 }); cyl('flat', -24.8, 0.06, 9.2, 0.05, 0.07, 0.12, GILT, { seg: 6, outline: 0.02 });
    torn(31.5, 0, 12.6, 0.4, VIOLET);
    };
    const cloudSea = (y, n, seed) => { D('flat', 0, y - 30, 0, 1400, 2, 1400, 0x343a80, { outline: 0 }); const rc = SC.seeded(seed), ico = new THREE.IcosahedronGeometry(1, 1);
      for (let i = 0; i < n; i++) { const a = rc() * 6.283, r = 50 + rc() * 250, sc = 14 + rc() * 26, g = ico.clone(); g.scale(sc, sc * 0.3, sc * 0.8); batch.add('flat', g, G.mx(Math.cos(a) * r, y - rc() * 20, Math.sin(a) * r, rc() * 3), [0xe0a08a, 0xc98aa8, 0xf2c8a0][i % 3], 0); g.dispose(); } };
    const pine = (x, z, s, solidToo) => { if (solidToo) solid(x - 0.4, z - 0.4, x + 0.4, z + 0.4, 0, 6, { cam: false }); cyl('wood', x, 1.1 * s, z, 0.16 * s, 0.24 * s, 2.2 * s, 0x4a3524, { outline: 0.05 });
      [[2.6, 1.9, 3.0], [4.4, 1.45, 2.6], [5.9, 0.95, 2.2]].forEach(c => { const g = new THREE.ConeGeometry(c[1] * s, c[2] * s, 7); batch.add('flat', g, G.mx(x, c[0] * s, z, x), c[0] > 5 ? 0x2f6a4c : 0x24543c, 0.07); g.dispose(); }); };

    /* ===== RISER NINE: the Assay valley, five years on, at night in the rain. Grass, pines, the pump house, and a hatch. ===== */
    const RISER = () => {
      W.underRoof = () => false; W.inside = () => false;
      D('roof', 0, -0.5, 0, 150, 1, 150, 0x2c5a40, { outline: 0 });
      [[-27, -24, 27, -23], [-27, 23, 27, 24], [-27, -24, -26, 24], [26, -24, 27, 24]].forEach(w => wall(w[0], w[1], w[2], w[3]));
      const rp = SC.seeded(55);
      for (let i = 0; i < 64; i++) { const a = i / 64 * 6.283, r = 33 + rp() * 16; pine(Math.cos(a) * r * 1.05, Math.sin(a) * r * 0.9, 1.3 + rp() * 1.3); }
      [[-20, 14], [-23, -3], [21, -15], [18, 12], [-8, -19], [9, 19], [23, 2]].forEach(p => pine(p[0], p[1], 1.5, true));
      // ---- the ground: a meadow, not a lawn. Mottled turf, the road worn down from the pylon, standing water, stones, flowers
      const rq = SC.seeded(91), HZ = 15, roadX = z => Math.sin(z * 0.23) * 1.3 + (z < -12 ? (-12 - z) * 0.42 : 0);   // it swings wide of the pylon
      let dn = 0; const disc = (x, z, rad, y, col, sx) => { const g = new THREE.CylinderGeometry(rad, rad, 0.004, 9); g.scale(sx || 1, 1, 1); batch.add('flat', g, G.mx(x, y * 4 + (dn++ % 11) * 0.0045, z, rq() * 3), col, 0); g.dispose(); };   // every patch at its own height, well apart: laid level with each other they flickered
      for (let i = 0; i < 46; i++) disc((rq() - 0.5) * 50, (rq() - 0.5) * 44, 1.6 + rq() * 3.2, 0.006, i % 3 ? 0x2a5640 : 0x316246, 1 + rq() * 0.8);
      for (let z = -23.6; z <= 9.4; z += 1.1) disc(roadX(z) + (rq() - 0.5) * 0.5, z, 1.25 + rq() * 0.5, 0.012, (z * 10 | 0) % 2 ? 0x5a5346 : 0x625a4a, 1.15);
      for (let z = -23; z <= 8.6; z += 0.9) { D('flat', roadX(z) - 0.55, 0.105, z, 0.14, 0.012, 0.8, 0x463f34, { ry: -Math.cos(z * 0.23) * 0.3, outline: 0 }); D('flat', roadX(z) + 0.55, 0.105, z, 0.14, 0.012, 0.8, 0x463f34, { ry: -Math.cos(z * 0.23) * 0.3, outline: 0 }); }
      for (let i = 0; i < 16; i++) { const a2 = i / 16 * 6.283; disc(Math.cos(a2) * 2.8 * rq(), 11.4 + Math.sin(a2) * 1.7 * rq(), 1.2 + rq() * 0.8, 0.013, i % 2 ? 0x5a5346 : 0x625a4a, 1.2); }   // trodden flat in front of the hatch
      [[-6.5, -3, 1.1], [5.5, -9, 0.9], [8, 3.5, 1.3], [-13, -15, 1.0], [14.5, -3.5, 0.8], [-4.4, 6.2, 0.7], [17, 7, 1.1], [-19, -2, 0.9], [1.4, -12.5, 0.6]].forEach(p => { disc(p[0], p[1], p[2] * 1.12, 0.017, 0x234a38, 1.5); disc(p[0], p[1], p[2], 0.02, 0x1c3050, 1.5); disc(p[0] + 0.2, p[1] - 0.12, p[2] * 0.4, 0.024, 0x2e4c78, 1.5); });
      const open = (x, z) => !(z < 10.5 && Math.abs(x - roadX(z)) < 2.1) && Math.hypot(x, z - 11.4) > 3.4 && Math.hypot(x, z - HZ) > 3.2 && !(x > -19 && x < -10 && z > -13 && z < -5);
      for (let i = 0; i < 240; i++) { const x = (rq() - 0.5) * 50, z = (rq() - 0.5) * 43; if (!open(x, z)) continue; const c = [0x3f7a52, 0x5a9a62, 0x356a48, 0x4a8a58][i % 4]; for (let k = 0; k < 3; k++) D('flat', x + (k - 1) * 0.07, 0.14 + rq() * 0.08, z + (rq() - 0.5) * 0.12, 0.05, 0.3 + rq() * 0.2, 0.05, c, { rz: (k - 1) * 0.36 + (rq() - 0.5) * 0.2, outline: 0 }); }
      for (let i = 0; i < 44; i++) { const x = (rq() - 0.5) * 48, z = (rq() - 0.5) * 42; if (!open(x, z)) continue; D('flat', x, 0.12, z, 0.025, 0.24, 0.025, 0x3f7a52, { outline: 0 }); D('flat', x, 0.26, z, 0.09, 0.06, 0.09, [0xe8e0f4, 0xb89ae8, 0xf0d870][i % 3], { ry: i, outline: 0 }); }
      for (let i = 0; i < 13; i++) { const x = (rq() - 0.5) * 46, z = (rq() - 0.5) * 40; if (!open(x, z)) continue; const g = new THREE.IcosahedronGeometry(1, 0), s = 0.3 + rq() * 0.3; g.scale(s * 1.4, s * 0.7, s); batch.add('concrete', g, G.mx(x, s * 0.25, z, rq() * 3), i % 2 ? 0x6a6e7a : 0x585c68, 0.04); g.dispose(); }
      // the edge of the meadow is the edge of the wood: undergrowth all the way round, open only where the hill road comes in
      { const bush = (x, z) => { const g = new THREE.IcosahedronGeometry(1, 0), s = 1.0 + rq() * 0.7; g.scale(s * 1.3, s * 0.8, s * 1.1); batch.add('flat', g, G.mx(x, s * 0.3, z, rq() * 3), [0x1f4a34, 0x24553a, 0x1a4030][(rq() * 3) | 0], 0.07); g.dispose(); };
        for (let x = -26; x <= 26; x += 2.1) { if (Math.abs(x - roadX(-23)) > 2.6) bush(x + (rq() - 0.5), -23.6 - rq() * 0.8); bush(x + (rq() - 0.5), 23.9 + rq() * 0.8); }
        for (let z = -22; z <= 22; z += 2.1) { bush(-26.8 - rq() * 0.8, z + (rq() - 0.5)); bush(26.8 + rq() * 0.8, z + (rq() - 0.5)); }
        [-2.9, 2.9].forEach(x => { D('concrete', roadX(-23) + x, 0.7, -23.2, 0.5, 1.4, 0.5, STONE, { outline: 0.05 }); D('flat', roadX(-23) + x, 1.44, -23.2, 0.6, 0.1, 0.6, GILT, { outline: 0.03 }); }); }
      // the hill the road comes down: it rises straight out of the north treeline, lamps all the way up it
      { const th = 0.46, L = 50, cz = -24 - Math.cos(th) * L / 2, cy = Math.sin(th) * L / 2 - 0.3, rx0 = roadX(-23);
        D('roof', rx0, cy - 0.5, cz, 96, 1, L, 0x285238, { rx: th, outline: 0 }); D('flat', rx0, cy + 0.08, cz, 3.0, 0.06, L, 0x5a5346, { rx: th, outline: 0 });
        for (let i = 1; i < 9; i++) { const d = i * 5, z = -24 - Math.cos(th) * d, y = Math.sin(th) * d - 0.3, sd = i % 2 ? -1 : 1; D('flat', rx0 + sd * 2.1, y + 1.1, z, 0.1, 2.2, 0.1, IRON, { outline: 0.02 }); D('glow', rx0 + sd * 2.1, y + 2.3, z, 0.5, 0.56, 0.5, 0x7ad9c8, { outline: 0 }); }
        for (let i = 0; i < 26; i++) { const d = 3 + rq() * 40, x = rx0 + (rq() < 0.5 ? -1 : 1) * (5 + rq() * 38), z = -24 - Math.cos(th) * d, y = Math.sin(th) * d - 0.3, s = 1.2 + rq() * 1.2, g = new THREE.ConeGeometry(1.5 * s, 5.2 * s, 6); batch.add('flat', g, G.mx(x, y + 2.9 * s, z, rq() * 3), [0x1c4432, 0x173a2a, 0x21503a][i % 3], 0.06); g.dispose(); }
        { const g = new THREE.IcosahedronGeometry(1, 1); g.scale(60, 9, 16); batch.add('flat', g, G.mx(rx0 - 6, Math.sin(th) * L - 4, -24 - Math.cos(th) * L - 6, 0.1), 0x1f4a3a, 0.12); g.dispose(); } }
      cyl('wood', -13.6, 0.22, 15.6, 0.2, 0.24, 3.0, 0x4a3524, { rz: Math.PI / 2, ry: 0.5, seg: 8, outline: 0.04 }); cyl('wood', 12, 0.2, -16.4, 0.18, 0.2, 2.4, 0x3e2c1e, { rz: Math.PI / 2, ry: -0.7, seg: 8, outline: 0.04 });   // windfall
      // hills, and the white keep on its ridge: the same valley he won the Assay in
      [[-30, -64, 60, 20, 0.5], [34, -70, 70, 26, -0.4], [-66, -20, 50, 22, 1.2], [68, 4, 56, 20, -1.3], [0, 70, 90, 16, 0.1]].forEach(h => { const g = new THREE.IcosahedronGeometry(1, 1); g.scale(h[2], h[3], h[2] * 0.6); batch.add('flat', g, G.mx(h[0], -4, h[1], h[4]), 0x1f4a3a, 0.2); g.dispose(); });
      D('brick', 30, 24, -78, 14, 12, 10, 0xd8d3e2, { outline: 0.14 }); D('brick', 24, 30, -78, 4, 20, 4, 0xd8d3e2, { outline: 0.1 }); D('brick', 37, 28, -78, 3.4, 16, 3.4, 0xd8d3e2, { outline: 0.1 }); D('flat', 24, 40.6, -78, 4.6, 0.8, 4.6, GILT, { outline: 0.06 }); D('glow', 30, 26, -72.9, 1.2, 2.4, 0.1, LAMP, { outline: 0 });
      // the river along the south edge
      D('flat', 0, 0.02, 30, 150, 0.04, 12, 0x3a5fa8, { outline: 0 }); for (let x = -40; x < 40; x += 3.3) D('flat', x, 0.06, 26 + (x * 7 % 5), 1.6, 0.02, 0.12, 0xcfe0ff, { outline: 0 });
      // Riser Nine: a maintenance hatch nobody above has looked at in thirty years. Warm air and people come out of it.
      { const g = new THREE.IcosahedronGeometry(1, 1); g.scale(7, 1.5, 3.2); batch.add('flat', g, G.mx(0, -0.25, HZ + 5, 0.08), 0x24503a, 0.1); g.dispose(); }
      [[-3.3, 0.55, HZ + 3.5, 1.5, 1.2, 1.2, 0.4], [3.0, 0.45, HZ + 3.8, 1.3, 1.0, 1.1, 1.9], [0.3, 0.35, HZ + 4.3, 1.6, 0.8, 1.0, 0.9], [-5.6, 0.3, HZ + 2.2, 0.8, 0.6, 0.7, 2.4]].forEach(k => { const g = new THREE.IcosahedronGeometry(1, 0); g.scale(k[3], k[4], k[5]); batch.add('concrete', g, G.mx(k[0], k[1], k[2], k[6]), 0x565a68, 0.06); g.dispose(); });
      solid(-5, HZ + 2.5, 5, HZ + 5.4, 0, 2.2); pine(-6.4, HZ + 4.4, 1.8, true); pine(6.2, HZ + 4.8, 1.6, true);
      solid(-1.75, HZ - 1.75, 1.75, HZ + 1.75, 0, 1.4, { cam: false });
      cyl('concrete', 0, 0.2, HZ, 1.9, 2.06, 0.4, STONE2, { seg: 10, outline: 0.07 }); cyl('concrete', 0, 0.42, HZ, 1.9, 1.9, 0.05, 0xe9e4d6, { seg: 10, outline: 0 });
      cyl('flat', 0, 0.452, HZ, 1.5, 1.5, 0.012, 0x0c0b10, { seg: 10, outline: 0 }); cyl('glow', 0, 0.46, HZ, 1.0, 1.0, 0.012, 0xb04a16, { seg: 10, outline: 0 }); cyl('glow', 0.06, 0.468, HZ + 0.1, 0.52, 0.52, 0.012, 0xff9a3a, { seg: 10, outline: 0 });   // the dark of the shaft, and light a long way down it
      for (let i = 0; i < 10; i++) { const a2 = i / 10 * 6.283 + 0.31; D('flat', Math.cos(a2) * 1.72, 0.46, HZ + Math.sin(a2) * 1.72, 0.12, 0.05, 0.12, IRON, { ry: -a2, outline: 0 }); }
      [-0.34, 0.34].forEach(x => D('flat', x, 1.5, HZ + 1.25, 0.09, 2.6, 0.09, 0xe8b23a, { rx: -0.14, outline: 0.03 })); [0.62, 0.98, 1.34, 1.7, 2.06, 2.42].forEach(y => D('flat', 0, y, HZ + 1.25 + (y - 1.5) * 0.14, 0.62, 0.06, 0.06, 0xe8e0cc, { outline: 0.02 }));   // the ladder head: yellow rails standing well clear of the collar, pale rungs
      { const top = [0, 3.5, HZ]; [[-1.9, 1.1], [1.9, 1.1], [0, -1.95]].forEach(f => { const dx = top[0] - f[0], dz = -f[1], L = Math.hypot(dx, 3.5, dz); const g = new THREE.CylinderGeometry(0.06, 0.08, L, 6); const m = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, 3.5, dz).normalize())); m.setPosition(f[0] + dx / 2, 1.75, HZ + f[1] + dz / 2); batch.add('wood', g, m, 0x5a4030, 0.03); g.dispose(); });
        cyl('metal', 0, 3.3, HZ, 0.2, 0.2, 0.1, IRON, { rz: Math.PI / 2, seg: 8, outline: 0.03 }); D('flat', 0, 1.9, HZ, 0.03, 2.9, 0.03, 0xd8c8a0, { outline: 0 }); D('glow', 0.5, 2.7, HZ, 0.16, 0.24, 0.16, 0xffb060, { outline: 0 }); D('flat', 0.5, 2.86, HZ, 0.2, 0.06, 0.2, IRON, { outline: 0.02 }); }   // a hoist of three poles over the shaft, a rope down it, a lamp hung on it
      cyl('metal', 3.1, 0.13, HZ + 0.5, 1.5, 1.5, 0.16, 0x8d94ac, { seg: 10, outline: 0.05 }); cyl('flat', 3.1, 0.22, HZ + 0.5, 0.5, 0.5, 0.04, IRON, { seg: 8, outline: 0.03 }); D('flat', 3.1, 0.25, HZ + 0.5, 1.5, 0.05, 0.1, IRON, { ry: 0.5, outline: 0.02 }); D('flat', 3.1, 0.25, HZ + 0.5, 1.5, 0.05, 0.1, IRON, { ry: 2.07, outline: 0.02 }); D('flat', 2.0, 0.3, HZ + 0.2, 0.5, 0.1, 0.16, IRON, { ry: 0.3, outline: 0.03 });   // the lid, thrown back on the grass, wheel uppermost
      sign('RISER 9', -1.5, 1.3, HZ + 2.46, Math.PI, 1.7, 0.46, '#e8c25a', '#07070d'); D('concrete', -1.5, 1.3, HZ + 2.62, 1.9, 0.66, 0.3, 0x565a68, { outline: 0.04 });   // cut into a slab against the rock, where nothing can get behind it
      { const l = new THREE.PointLight(0xff8a2e, 60, 15, 1.6); l.position.set(0, 1.5, HZ - 0.4); G.scene.add(l); }
      // the pump house, with every Assay's names cut in the lintel
      B('brick', -18, -12, -11, -6, 0, 3.6, STONE2, { outline: 0.1 }); B('roof', -18.4, -12.4, -10.6, -5.6, 3.6, 3.9, SLATE, { outline: 0.06, col: false }); D('flat', -10.95, 1.2, -9, 0.1, 2.4, 1.3, 0x15151f, { outline: 0.04 }); D('concrete', -10.9, 2.7, -9, 0.3, 0.5, 2.2, STONE, { outline: 0.04 }); D('glow', -10.9, 1.6, -7.2, 0.06, 0.5, 0.4, LAMP, { outline: 0 });
      // what the Authority left here: a pylon with the eye on it, and the road the Wardens come down
      D('brick', 0, 4, -21, 2.4, 8, 2.4, 0xd8d3e2, { outline: 0.08 }); solid(-1.6, -22.6, 1.6, -19.4, 0, 8); D('flat', 0, 8.2, -21, 2.8, 0.4, 2.8, GILT, { outline: 0.04 });
      D('concrete', 0, 0.3, -21, 3.2, 0.6, 3.2, 0xb8b3c4, { outline: 0.06 }); D('flat', 0, 0.66, -21, 2.7, 0.12, 2.7, GILT, { outline: 0.03 }); D('flat', 0, 5.4, -21, 2.52, 0.2, 2.52, GILT, { outline: 0.03 }); D('flat', 0, 8.9, -21, 1.3, 1.0, 1.3, 0x23232e, { outline: 0.04 }); D('flat', 0, 8.9, -20.2, 0.9, 0.6, 0.5, 0x23232e, { outline: 0.03 }); D('flat', 0, 9.5, -21, 1.7, 0.16, 1.7, GILT, { outline: 0.03 });   // a plinth, two bands, and the housing the eye looks out of
      // the riser's own pump, on the pump-house wall: a standpipe, a gauge, and a wheel nobody has turned in thirty years
      cyl('metal', -10.78, 1.2, -7.9, 0.09, 0.09, 2.4, 0x6f7a86, { seg: 8, outline: 0.03 }); D('flat', -10.78, 2.36, -7.55, 0.1, 0.1, 0.8, 0x6f7a86, { outline: 0.03 }); D('flat', -10.74, 1.25, -7.9, 0.07, 0.07, 0.56, 0xb23a2e, { outline: 0.03 }); D('flat', -10.74, 1.25, -7.9, 0.07, 0.56, 0.07, 0xb23a2e, { outline: 0.03 }); D('flat', -10.86, 1.9, -7.9, 0.06, 0.26, 0.26, 0xece6d6, { outline: 0.03 });
      [[-9, 9], [10, -9], [12, 10], [-11, 2]].forEach(p => { solid(p[0] - 0.2, p[1] - 0.2, p[0] + 0.2, p[1] + 0.2, 0, 2.4, { cam: false }); cyl('wood', p[0], 1.1, p[1], 0.06, 0.08, 2.2, 0x4a3524, { outline: 0.03 }); D('flat', p[0], 2.12, p[1], 0.34, 0.05, 0.34, 0x23232e, { outline: 0.02 }); D('glow', p[0], 2.3, p[1], 0.24, 0.3, 0.24, TLAMP, { outline: 0 }); D('flat', p[0], 2.5, p[1], 0.36, 0.07, 0.36, 0x23232e, { outline: 0.02 }); const l = new THREE.PointLight(0x5ff2e2, 7, 7, 1.6); l.position.set(p[0], 2.2, p[1]); G.scene.add(l); });
      crateStatic(-9.6, -6.4, 1.1); crate(-9.2, -4.9, 0.9, 0, 'hp'); crate(14, 16, 0.9, 0, 'meter'); crate(-16, 17, 0.9, 0, 'hp'); crate(20, -8, 0.9, 0, 'hp');
      D('crate', 2.5, 0.09, HZ - 2.5, 0.16, 0.1, 0.3, 0x8a1f24, { ry: 0.6, outline: 0.02 }); D('flat', 2.46, 0.045, HZ - 2.5, 0.2, 0.03, 0.34, 0x2a1c14, { ry: 0.6, outline: 0 });    // a child's shoe
      // ===== nine years on: what the Assay left in this valley, and nobody was sent to clear =====
      tentD(-15, 10, 0.4, VIOLET); tentD(-19, 6.5, -0.5, VIOLET); tentD(16, 15, 2.2, TEAL); tentD(19.5, -3, 1.2, 0xb8902e);
      fireRing(-16.6, 7.6, false); fireRing(15.5, 12, false); fireRing(-6.2, HZ - 0.6, true);
      // the Violet standard, down in the grass where he left it standing
      D('wood', -13.2, 0.08, 12.4, 4.4, 0.08, 0.08, GILT, { ry: 0.5, outline: 0.03 }); torn(-11.6, 0, 13.6, 0.5, VIOLET);
      [[-22, 18, 1], [-6, 20, 2], [8, 21, 3], [22, 17, 4], [24, -12, 5], [10, -20, 6], [-12, -21, 7], [-24, -16, 8], [-25, 1, 9]].forEach(m => marker(m[0], m[1], m[2]));
      // a wooden practice blade, and a ration tin with a House seal, gone to rust
      D('wood', -17.6, 0.06, 9.2, 1.1, 0.05, 0.09, 0x8a6a48, { ry: 1.0, outline: 0.02 }); cyl('metal', 16.4, 0.08, 13.2, 0.12, 0.12, 0.16, 0x8a5a3a, { seg: 8, outline: 0.02 }); helmD(18.6, 0, -4.2, 1); halbD(20.6, 0, -1.8, 2.0);
      // what came up the riser with them: bundles, a handcart, blankets, the lamps set down in a ring
      // east of the hatch: the handcart, and what they carried. West: a fire, the lamps set down round it, and the bedrolls of people who expected to wait
      load(5.0, 0, HZ - 1.9, 0.4); load(8.6, 0, HZ + 1.3, 2.0); load(5.4, 0, HZ + 2.0, 1.0); solid(4.5, HZ - 2.3, 5.5, HZ - 1.5, 0, 1, { cam: false }); solid(8.1, HZ + 0.9, 9.1, HZ + 1.7, 0, 1, { cam: false });
      D('wood', 7.2, 0.5, HZ - 0.4, 1.6, 0.1, 1.0, 0x8a6a48, { ry: 0.3, outline: 0.04 }); cyl('wood', 7.9, 0.3, HZ + 0.12, 0.3, 0.3, 0.08, 0x4a3524, { seg: 10, rx: Math.PI / 2, ry: 0.3, outline: 0.03 }); cyl('wood', 6.9, 0.3, HZ - 0.95, 0.3, 0.3, 0.08, 0x4a3524, { seg: 10, rx: Math.PI / 2, ry: 0.3, outline: 0.03 }); D('wood', 6.0, 0.36, HZ - 0.78, 1.3, 0.06, 0.06, 0x4a3524, { ry: 0.3, rz: -0.25, outline: 0.02 }); D('crate', 7.2, 0.78, HZ - 0.4, 0.7, 0.44, 0.6, 0xb98a55, { ry: 0.5, outline: 0.04 }); solid(6.4, HZ - 1.0, 8.0, HZ + 0.2, 0, 1.0, { cam: false });
      [[-4.5, HZ + 1.3, 0x6a3a3a, 0.5], [-8.2, HZ + 0.6, 0x3a4a6a, 2.2], [-7.4, HZ - 2.4, 0x6a5a40, 1.2]].forEach(b => { D('flat', b[0], 0.04, b[1], 1.5, 0.06, 0.62, b[2], { ry: b[3], outline: 0.02 }); cyl('flat', b[0] + Math.cos(b[3]) * 0.7, 0.11, b[1] - Math.sin(b[3]) * 0.7, 0.11, 0.11, 0.6, 0xb9b3a4, { rx: Math.PI / 2, ry: b[3], seg: 8, outline: 0.02 }); });
      for (let i = 0; i < 6; i++) { const a2 = i / 6 * 6.283 + 0.4; cyl('metal', -6.2 + Math.cos(a2) * 1.5, 0.05, HZ - 0.6 + Math.sin(a2) * 1.5, 0.08, 0.08, 0.04, 0x23232e, { seg: 6, outline: 0 }); D('glow', -6.2 + Math.cos(a2) * 1.5, 0.16, HZ - 0.6 + Math.sin(a2) * 1.5, 0.11, 0.18, 0.11, i % 3 ? LAMP : TLAMP, { outline: 0 }); D('flat', -6.2 + Math.cos(a2) * 1.5, 0.27, HZ - 0.6 + Math.sin(a2) * 1.5, 0.16, 0.04, 0.16, 0x23232e, { outline: 0 }); }
      [[0, 0.3, 0.16], [0.08, 0.44, 0.1], [-0.06, 0.52, 0.06]].forEach(f => D('glow', -6.2 + f[0], f[1], HZ - 0.6, f[2], f[2] * 1.6, f[2], f[1] > 0.4 ? 0xffd070 : 0xff7a1f, { ry: f[1] * 9, outline: 0 }));
      { const l = new THREE.PointLight(0xffa24a, 26, 9, 1.6); l.position.set(-6.2, 0.9, HZ - 0.6); G.scene.add(l); }
      chalkW(-10.93, 0.5, -10.4, Math.PI / 2, 0.16); chalkF(-2.6, 0.016, HZ - 2.6, 0.22); chalkW(0, 0.6, -19.78, 0, 0.18);
      // the Authority's notice on the pylon, and the tally of the riser's air
      sign('SEALED BY THE COUNT', 0, 2.6, -19.78, 0, 2.2, 0.4, '#07070d', '#e8c25a'); sign('NINE HOUSES. ONE STANDING.', -10.92, 3.1, -9, Math.PI / 2, 4.2, 0.36, '#e8c25a', '#07070d');
    };

    /* ===== THE STAIR: the last flights up the Sun Spire at sunset, nine years on. Three flights, three landings, the white door. ===== */
    /* ===== THE TABLE: a sealed pump room under Tier Six. Everything the Accredited use on their own children, carried down a piece at a time. Nobody fights here. ===== */
    const GILD = () => {
      W.underRoof = () => true; W.inside = () => true;
      const BR = 0x24202c, TILE = 0x3a3644, DARK = 0x15131c, STEELC = 0x8d94ac, BODY = 0x3f4a56;
      // floor: worn tile, a drain, and thirty years of nobody
      D('concrete', 0, -0.5, 0, 14, 1, 12, 0x2c2834, { outline: 0 });
      for (let x = -6; x <= 6; x += 1.2) D('flat', x, 0.008, 0, 0.03, 0.012, 10.6, DARK, { outline: 0 });
      for (let z = -4.8; z <= 5; z += 1.2) D('flat', 0, 0.008, z, 12.6, 0.012, 0.03, DARK, { outline: 0 });
      cyl('flat', 0.95, 0.014, 1.35, 0.2, 0.2, 0.02, 0x0c0b10, { seg: 10, outline: 0 });
      [[1.5, 0.6, 0.5], [-1.2, 1.4, 0.36], [0.4, -1.5, 0.3]].forEach(s => cyl('flat', s[0], 0.012, s[1], s[2], s[2], 0.012, 0x221f29, { seg: 9, outline: 0 }));
      // walls: brick above, tile to the shoulder
      D('brick', 0, 2.1, -5.3, 13.2, 4.6, 0.6, BR, { outline: 0 }); D('flat', 0, 0.85, -4.98, 12.6, 1.7, 0.04, TILE, { outline: 0 }); D('flat', 0, 1.72, -4.97, 12.6, 0.06, 0.05, 0x4a4650, { outline: 0 });
      D('brick', 0, 2.1, 5.3, 13.2, 4.6, 0.6, BR, { outline: 0 }); D('flat', 0, 0.85, 4.98, 12.6, 1.7, 0.04, TILE, { outline: 0 });
      D('brick', 6.3, 2.1, 0, 0.6, 4.6, 11, BR, { outline: 0 }); D('flat', 5.98, 0.85, 0, 0.04, 1.7, 10.6, TILE, { outline: 0 }); D('flat', 5.97, 1.72, 0, 0.05, 0.06, 10.6, 0x4a4650, { outline: 0 });
      D('brick', -6.3, 2.1, 0, 0.6, 4.6, 11, BR, { outline: 0 }); D('flat', -5.98, 0.85, 0, 0.04, 1.7, 10.6, TILE, { outline: 0 }); D('flat', -5.97, 1.72, 0, 0.05, 0.06, 10.6, 0x4a4650, { outline: 0 });
      D('concrete', 0, 4.5, 0, 14, 0.4, 12, DARK, { outline: 0 });
      // the pipes that still run through it
      D('flat', 0, 3.95, -3.9, 12.6, 0.24, 0.24, 0x4a4650, { outline: 0.03 }); D('flat', 0, 3.72, -3.4, 12.6, 0.12, 0.12, 0x6a4a3a, { outline: 0.02 }); D('flat', 0, 3.9, 3.6, 12.6, 0.18, 0.18, 0x3a3640, { outline: 0.03 });
      [-4.4, -1.2, 2.2, 4.8].forEach(x => D('flat', x, 3.95, -3.9, 0.1, 0.34, 0.34, 0x2a2630, { outline: 0.02 }));
      D('flat', 3.6, 3.0, -4.9, 0.2, 2.4, 0.2, 0x4a4650, { outline: 0.03 }); D('flat', -5.2, 2.9, -4.9, 0.14, 2.2, 0.14, 0x6a4a3a, { outline: 0.02 });
      // the pump itself: two bodies, a wheel, a dead gauge
      cyl('metal', -2.9, 1.15, -4.2, 0.78, 0.78, 2.3, BODY, { seg: 12, outline: 0.06 }); cyl('metal', -2.9, 2.42, -4.2, 0.42, 0.78, 0.26, BODY, { seg: 12, outline: 0.05 }); cyl('flat', -2.9, 3.2, -4.2, 0.12, 0.12, 1.4, 0x4a4650, { seg: 8, outline: 0.03 });
      cyl('metal', -1.3, 0.85, -4.4, 0.5, 0.5, 1.7, 0x35404b, { seg: 10, outline: 0.05 }); D('flat', -2.1, 0.9, -4.3, 1.0, 0.16, 0.16, 0x4a4650, { outline: 0.03 });
      D('flat', -2.9, 1.5, -3.38, 0.64, 0.08, 0.06, 0xb23a2e, { outline: 0.03 }); D('flat', -2.9, 1.5, -3.38, 0.08, 0.64, 0.06, 0xb23a2e, { outline: 0.03 }); D('flat', -2.9, 1.5, -3.34, 0.14, 0.14, 0.06, 0x2a2630, { outline: 0.02 });
      D('flat', -1.3, 1.5, -3.88, 0.3, 0.3, 0.05, 0xece6d6, { outline: 0.03 }); D('flat', -1.3, 1.56, -3.85, 0.02, 0.14, 0.02, 0x15131c, { rz: 0.9, outline: 0 });
      sign('PUMP ROOM 7', -2.2, 3.05, -4.96, 0, 2.6, 0.42, '#b8b0a0', '#15131c'); sign('SEALED BY THE COUNT', 3.2, 2.5, -4.96, 0, 3.0, 0.36, '#07070d', '#e8c25a');
      // the table: an Accredited child's table, lengthened with a welded plate for a grown man
      D('metal', 0, 0.9, 0, 0.92, 0.08, 2.0, 0x6a6672, { outline: 0.04 }); D('metal', 0, 0.9, 1.22, 0.92, 0.07, 0.44, 0x4f4b57, { outline: 0.04 }); D('flat', 0, 0.945, 1.0, 0.92, 0.012, 0.05, 0xb8742e, { outline: 0 });
      D('flat', 0, 0.83, 0.1, 0.8, 0.06, 2.3, 0x2a2630, { outline: 0.03 }); D('metal', 0, 0.42, 0, 0.3, 0.78, 0.7, 0x2a2630, { outline: 0.04 }); D('metal', 0, 0.045, 0, 0.9, 0.09, 1.5, 0x3a3640, { outline: 0.04 });
      D('flat', 0, 0.948, -0.8, 0.4, 0.016, 0.34, 0x8a8478, { outline: 0.02 });
      [[-0.5, -0.2], [0.5, -0.2], [-0.5, 0.5], [0.5, 0.5], [-0.5, 1.15], [0.5, 1.15]].forEach(b => { D('flat', b[0], 0.84, b[1], 0.05, 0.2, 0.1, 0x8a7a5a, { outline: 0.02 }); D('flat', b[0] * 1.04, 0.9, b[1], 0.03, 0.06, 0.07, 0xc8ccd4, { outline: 0 }); });
      // the lamp she rigged over it: three, off one arm
      D('flat', 0, 4.0, 0, 0.07, 0.7, 0.07, 0x2a2630, { outline: 0.02 }); D('flat', 0, 3.62, 0, 1.9, 0.07, 0.07, 0x2a2630, { outline: 0.02 });
      [[0, 0.74, 0.5], [-0.85, 0.42, 0.3], [0.85, 0.42, 0.3]].forEach(l => { cyl('metal', l[0], 3.36, 0, l[1] * 0.62, l[1], 0.26, 0x4a4650, { seg: 12, outline: 0.05 }); cyl('glow', l[0], 3.22, 0, l[1] * 0.86, l[1] * 0.86, 0.03, 0xfff0c8, { seg: 12, outline: 0 }); });
      // the tray: what she works with
      D('metal', 1.3, 0.92, -0.5, 0.52, 0.04, 0.9, STEELC, { outline: 0.03 }); D('flat', 1.3, 0.5, -0.5, 0.46, 0.03, 0.84, 0x4a4650, { outline: 0.02 });
      [[1.08, -0.9], [1.52, -0.9], [1.08, -0.1], [1.52, -0.1]].forEach(l => D('flat', l[0], 0.46, l[1], 0.035, 0.92, 0.035, 0x4a4650, { outline: 0.02 }));
      for (let i = 0; i < 7; i++) D('flat', 1.2 + (i % 2) * 0.05, 0.95, -0.88 + i * 0.075, 0.26, 0.014, 0.02, i % 3 === 1 ? 0xe8c25a : 0xd9dde6, { ry: (i % 3 - 1) * 0.12, outline: 0 });
      D('flat', 1.07, 0.955, -0.6, 0.02, 0.024, 0.2, 0x15131c, { outline: 0 }); D('flat', 1.07, 0.955, -0.78, 0.02, 0.024, 0.1, 0x8a1f24, { outline: 0 });
      cyl('flat', 1.4, 1.02, -0.22, 0.085, 0.085, 0.13, 0xe8c25a, { seg: 10, outline: 0.02 }); cyl('flat', 1.4, 0.95, -0.22, 0.12, 0.12, 0.02, 0x4a3524, { seg: 10, outline: 0.02 }); cyl('flat', 1.4, 1.09, -0.22, 0.12, 0.12, 0.02, 0x4a3524, { seg: 10, outline: 0.02 });
      cyl('flat', 1.16, 0.975, -0.24, 0.14, 0.1, 0.08, 0xece6d6, { seg: 10, outline: 0.02 }); cyl('flat', 1.16, 1.012, -0.24, 0.12, 0.12, 0.01, 0xc9c2b0, { seg: 10, outline: 0 });
      // the drip: gold in oil, a drop at a time for nine months
      cyl('metal', -0.95, 1.12, -0.95, 0.022, 0.022, 2.24, STEELC, { seg: 6, outline: 0.02 }); D('flat', -0.95, 2.24, -0.95, 0.4, 0.03, 0.03, STEELC, { outline: 0.02 }); D('flat', -0.95, 0.03, -0.95, 0.44, 0.05, 0.44, 0x4a4650, { outline: 0.02 });
      D('flat', -0.8, 2.02, -0.95, 0.19, 0.34, 0.09, 0x4a4030, { outline: 0.03 }); D('glow', -0.8, 2.0, -0.9, 0.14, 0.26, 0.02, 0xffd26e, { outline: 0 });
      // where he sleeps, when she lets him: a cot, a blanket, a bucket, his own boots that no longer fit
      D('wood', 4.5, 0.32, 3.4, 1.0, 0.08, 2.1, 0x4a3524, { outline: 0.04 }); [[4.05, 2.45], [4.95, 2.45], [4.05, 4.35], [4.95, 4.35]].forEach(l => D('wood', l[0], 0.15, l[1], 0.07, 0.3, 0.07, 0x3a2a1c, { outline: 0.02 }));
      D('flat', 4.5, 0.42, 3.7, 0.98, 0.1, 1.4, 0x5a3a3a, { outline: 0.03 }); D('flat', 4.5, 0.44, 2.66, 0.62, 0.12, 0.34, 0xd8d0bc, { outline: 0.03 });
      cyl('metal', 3.5, 0.2, 4.3, 0.2, 0.16, 0.4, 0x4a4650, { seg: 10, outline: 0.03 }); D('flat', 3.5, 0.13, 2.5, 0.14, 0.26, 0.3, 0x2a2018, { outline: 0.03 }); D('flat', 3.7, 0.13, 2.56, 0.14, 0.26, 0.3, 0x2a2018, { ry: 0.3, outline: 0.03 });
      // her shelf: jars, a lamp, the gloves he will wear for a year
      D('wood', 5.8, 1.9, -1.6, 0.34, 0.05, 2.6, 0x4a3524, { outline: 0.03 }); D('wood', 5.8, 2.6, -1.6, 0.34, 0.05, 2.6, 0x4a3524, { outline: 0.03 });
      for (let i = 0; i < 6; i++) { cyl('flat', 5.8, 2.06, -2.7 + i * 0.42, 0.08, 0.08, 0.26, [0x8d94ac, 0x6e7a5a, 0x8d94ac][i % 3], { seg: 8, outline: 0.02 }); if (i % 2) cyl('glow', 5.8, 2.02, -2.7 + i * 0.42, 0.06, 0.06, 0.14, 0xffd26e, { seg: 8, outline: 0 }); }
      for (let i = 0; i < 4; i++) D('flat', 5.8, 2.74, -2.6 + i * 0.5, 0.2, 0.22 + (i % 2) * 0.06, 0.07, [0x5a3aa8, 0x4a4650, 0x8a1f24, 0x3a3640][i], { outline: 0.02 });
      // nine months, kept in chalk the way a tier keeps anything
      for (let m = 0; m < 9; m++) D('flat', 5.955, 1.25 + (m % 2) * 0.012, 1.0 + m * 0.13 + (m > 4 ? 0.14 : 0), 0.012, 0.3, 0.028, 0xefe8d4, { rx: (m % 3 - 1) * 0.05, outline: 0 });
      D('flat', 5.953, 1.25, 1.27, 0.012, 0.03, 0.7, 0xefe8d4, { rx: 0.42, outline: 0 });
      // a stool, a basin, and the curtain she hangs when the eyes are done
      cyl('wood', 1.35, 0.3, 1.0, 0.2, 0.2, 0.6, 0x4a3524, { seg: 8, outline: 0.03 }); cyl('metal', -1.6, 0.42, 1.4, 0.26, 0.18, 0.84, 0x4a4650, { seg: 10, outline: 0.03 }); cyl('flat', -1.6, 0.85, 1.4, 0.24, 0.24, 0.02, 0x3c4e8a, { seg: 10, outline: 0 });
      D('flat', -3.2, 3.5, 2.4, 0.04, 0.04, 5.0, 0x4a4650, { outline: 0 }); for (let i = 0; i < 9; i++) D('flat', -3.2, 2.0, 0.2 + i * 0.52, 0.05, 3.0, 0.46, i % 2 ? 0x2e2a40 : 0x363248, { ry: (i % 2 ? 0.3 : -0.3), outline: 0.02 });
      { const l = new THREE.PointLight(0xffecbe, 46, 13, 1.5); l.position.set(0, 2.9, 0); G.scene.add(l); W.gildLamp = l; const c = new THREE.PointLight(0x5ff2e2, 9, 9, 1.6); c.position.set(-2.4, 2.2, -3.2); G.scene.add(c); const w = new THREE.PointLight(0xffb060, 10, 7, 1.6); w.position.set(5, 2.3, -1.6); G.scene.add(w); }
    };
    const STAIR = () => {
      W.underRoof = () => false; W.inside = () => false;
      cloudSea(-26, 90, 77);
      { const R = 62, cx = -71, cz = -8, rAt = y => R + 6 * (270 - y) / 300; let g = new THREE.CylinderGeometry(R, R + 6, 320, 64, 1, true); const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * 98, uv.getY(k) * 76);
        batch.add('concrete', g, G.mx(cx, 110, cz), 0xf0e2cc, 0); g.dispose();
        [54, 92, 140].forEach(y => { const r = rAt(y) + 0.9; g = new THREE.CylinderGeometry(r, r + 0.1, 2.2, 64, 1, true); batch.add('flat', g, G.mx(cx, y, cz), GILT, 0); g.dispose(); }); }
      const W0 = 7;
      // the terrace the barges came down on
      B('concrete', -W0 - 3, 30, W0 + 3, 46, -3, 0, DECK, { outline: 0.08 }); wall(-W0 - 3.6, 46, W0 + 3.6, 46.6); wall(-W0 - 3.6, 30, -W0 - 3, 46); wall(W0 + 3, 30, W0 + 3.6, 46); rail(W0 + 2.8, 30.4, W0 + 2.8, 46, 0); rail(-W0 - 2.4, 46, W0 + 2.8, 46, 0);
      wall(-W0 - 3, 29.4, -W0, 30); wall(W0, 29.4, W0 + 3, 30);
      // three flights and two landings
      const flight = (z0, z1, a, b) => { ramp('concrete', -W0, z0, W0, z1, Math.min(a, b) - 3, a, b, 'z', STONE, { steps: true }); for (let z = z0; z < z1; z += 1) { const y = SC.lerp(a, b, (z + 0.5 - z0) / (z1 - z0)); D('flat', 0, y + 0.07, z + 0.5, 0.3, 0.03, 0.7, GILT, { rx: Math.atan2(a - b, z1 - z0), outline: 0 }); } };   // the painted line, laid on the steps: it was measured from the wrong end of each piece and hung in the air
      const landing = (z0, z1, y) => { B('concrete', -W0, z0, W0, z1, y - 4, y, DECK, { outline: 0.08 }); D('flat', 0, y + 0.012, (z0 + z1) / 2, 0.3, 0.02, z1 - z0 - 1, GILT, { outline: 0 }); };
      flight(18, 30, 6, 0); landing(4, 18, 6); flight(-8, 4, 12, 6); landing(-22, -8, 12); flight(-34, -22, 18, 12);
      wall(-W0 - 0.6, -34, -W0, 30, -4, 30); wall(W0, -34, W0 + 0.6, 30, -4, 30);
      [[18, 30, 6, 0], [-8, 4, 12, 6], [-34, -22, 18, 12]].forEach(f => { for (let z = f[0] + 1; z < f[1]; z += 3) { const y = SC.lerp(f[2], f[3], (z - f[0]) / (f[1] - f[0])); D('concrete', W0 - 0.2, y + 0.6, z, 0.4, 1.2, 0.4, STONE, { outline: 0.04 }); D('concrete', -W0 + 0.2, y + 0.6, z, 0.4, 1.2, 0.4, STONE, { outline: 0.04 }); } line(W0 - 0.2, f[2] + 1.25, f[0], W0 - 0.2, f[3] + 1.25, f[1], 0.09, STONE); line(-W0 + 0.2, f[2] + 1.25, f[0], -W0 + 0.2, f[3] + 1.25, f[1], 0.09, STONE); });
      [[4, 18, 6], [-22, -8, 12]].forEach(l => { rail(W0 - 0.2, l[0], W0 - 0.2, l[1], l[2]); rail(-W0 + 0.2, l[0], -W0 + 0.2, l[1], l[2]); statue(W0 - 1.3, l[0] + 1.4, l[2], 3.4, -Math.PI / 2); statue(-W0 + 1.3, l[1] - 1.4, l[2], 3.4, Math.PI / 2); column(W0 - 1.2, l[1] - 1.2, 4, LAMP); column(-W0 + 1.2, l[0] + 1.2, 4, LAMP); });
      // the porters' line, all the way up, and the plates they kneel on
      for (let x = -3.2; x <= -1.6; x += 0.8) for (let z = 7; z <= 10; z += 0.8) D('flat', x, 6.03, z, 0.36, 0.02, 0.2, 0xb8902e, { outline: 0 });
      sign('KNEEL AT THE BELL', -W0 + 0.42, 7.6, 11, Math.PI / 2, 3, 0.5, '#e8c25a', '#07070d'); sign('SERVICE KEEP TO THE LINE', W0 - 0.42, 13.6, -15, -Math.PI / 2, 4, 0.5, '#e8c25a', '#07070d');
      crate(4.6, 16, 0.9, 6, 'hp'); crate(-4.8, 6, 0.9, 6, 'meter'); crate(4.6, -10, 0.9, 12, 'hp'); crate(-4.6, -20, 0.9, 12, 'hp'); crateStatic(5.4, 6.2, 1.2, 6); crateStatic(-5.3, -19.6, 1.3, 12);
      // Brand's halberd, stood in a crack on the second landing
      D('flat', 3.2, 13.3, -12, 0.07, 2.6, 0.07, IRON, { rz: 0.08, outline: 0.03 }); D('flat', 3.1, 14.5, -11.86, 0.05, 0.34, 0.3, 0xd9dde6, { rz: 0.08, outline: 0.03 }); solid(3, -12.2, 3.4, -11.8, 12, 14, { cam: false });
      // the top: the first ring, and the white door
      B('concrete', -10, -58, 10, -34, 14, 18, DECK, { outline: 0.08 }); wall(-10.6, -58, -10, -34, 14, 30); wall(10, -58, 10.6, -34, 14, 30); wall(-10, -34.6, -W0, -34, 14, 30); wall(W0, -34.6, 10, -34, 14, 30);
      rail(9.8, -57.6, 9.8, -34.4, 18); rail(-9.8, -57.6, -9.8, -34.4, 18);
      B('brick', -10, -62, 10, -58, 14, 32, 0xf4efe2, { outline: 0.12 }); D('flat', 0, 22.2, -57.94, 4.2, 8.4, 0.12, 0xffffff, { outline: 0.08 }); D('flat', 0, 22.2, -57.9, 0.12, 8.4, 0.14, GILT, { outline: 0 }); D('flat', 0, 26.6, -57.9, 5, 0.4, 0.3, GILT, { outline: 0.04 });
      watcher(0, 29, -57.86, 0, 1.3); [-6.5, 6.5].forEach(x => { statue(x, -56, 18, 4.6, 0); tree(x * 0.62, -55.6, 18, 1); });
      cyl('flat', 0, 18.05, -46, 3.2, 3.2, 0.02, GILT, { seg: 28, outline: 0 }); cyl('flat', 0, 18.07, -46, 2.8, 2.8, 0.02, DECK, { seg: 28, outline: 0 }); D('flat', 0, 18.09, -46, 3.2, 0.02, 1.2, 0xffffff, { outline: 0 }); cyl('flat', 0, 18.11, -46, 0.6, 0.6, 0.02, IRON, { seg: 14, outline: 0 });
      crate(8.4, -36, 0.9, 18, 'hp'); crate(-8.4, -36, 0.9, 18, 'meter'); crate(8.4, -50, 0.9, 18, 'hp');
      // below and behind: the fleet where it fell, one hull still burning, and the lamps of everyone who came up with him
      bargeS(26, -7, 34, 0.5); bargeS(-4, -5.4, 60, -0.3); bargeS(30, -9, 6, 1.2);
      [[38, 40], [46, 30], [35, 22]].forEach((p, i) => { D('glow', p[0], -6 + i, p[1], 2.2, 3 + i, 2.2, i ? 0xff7a1f : 0xffe14a, { ry: i, outline: 0 });   // the barges they burned behind them: three columns of smoke, well off the terrace, leaning with the wind
        for (let k = 0; k < 8; k++) { const g = new THREE.IcosahedronGeometry(1, 1), s = 1.6 + k * 0.75; g.scale(s, s * 0.8, s); batch.add('flat', g, G.mx(p[0] + k * k * 0.42, -2 + k * 4.6, p[1] - k * 1.1, k + i), [0x4a3c4a, 0x5a4a58, 0x6e5c68, 0x837079][Math.min(3, k >> 1)], 0); g.dispose(); } });
      for (let i = 0; i < 26; i++) { const lx = -8.4 + (i % 13) * 1.4 + (i * 7 % 5) * 0.08, lz = 43.4 + Math.floor(i / 13) * 1.3 + (i * 3 % 4) * 0.1; cyl('flat', lx, 0.03, lz, 0.09, 0.1, 0.06, IRON, { seg: 8, outline: 0.02 }); cyl('glow', lx, 0.15, lz, 0.06, 0.07, 0.18, i % 4 ? LAMP : TLAMP, { seg: 8, outline: 0 }); cyl('flat', lx, 0.27, lz, 0.03, 0.09, 0.06, IRON, { seg: 8, outline: 0.02 }); }
      standard(-8.6, 44.6, 0, 5, 0x8a6a48); standard(7.4, 44.6, 0, 5, 0x8a6a48);
      // ===== the stair after four hundred hulls came down on it =====
      { const g = new THREE.IcosahedronGeometry(1, 2); g.scale(26, 26, 2); batch.add('glow', g, G.mx(40, 34, 190), 0xffe2a8, 0); g.dispose(); for (let i = 0; i < 7; i++) D('glow', 40 + (i - 3) * 16, 34 - Math.abs(i - 3) * 1.5, 189, 60 - Math.abs(i - 3) * 12, 0.5, 0.4, 0xffc27a, { outline: 0 }); }
      torn(-3.6, 0, 37, 0.5, VIOLET); torn(4.2, 6, 9, -0.6, TEAL); torn(-4.4, 12, -14, 1.0, 0xb8902e); torn(5.5, 18, -40, 0.2, 0xd9dde6);
      halbD(3.2, 0, 34.4, 0.5); helmD(4.4, 0, 35.6, 0.2); halbD(-4.6, 6, 13.6, -0.9); helmD(-2.2, 6, 5.6, 1); helmD(5.2, 12, -18.6, 0.6); halbD(2.6, 12, -20.2, 2.2); halbD(-6.2, 18, -38.4, 0.2); helmD(7.2, 18, -44, 2);
      // the loads the porters put down when the bell said kneel, and did not pick up when they stood
      load(-5.6, 6, 8.2, 0.2); load(-5.2, 6, 10.4, -0.5); load(-5.8, 12, -12.6, 0.6); load(5.6, 12, -9.6, 2.2); load(-7.8, 18, -36.6, 0.3);
      // a litter left on the first landing with the curtain still swinging; a wine jar; one slipper
      litter(4.2, 14.2, 6, 1.2, VIOLET); cyl('flat', 2.4, 6.16, 12.4, 0.12, 0.16, 0.32, GILT, { seg: 8, outline: 0.03 }); D('flat', 2.1, 6.034, 11.9, 0.9, 0.02, 0.5, 0x8a1f3a, { ry: 0.4, outline: 0 }); D('flat', 1.2, 6.06, 15.6, 0.26, 0.08, 0.12, IVORY, { ry: 0.8, outline: 0.02 });
      // suns, chalked all the way up, by everyone who has ever carried on this stair
      [[0.7, 6, 16.5, 0.6], [0.5, 6, 6, 0.8], [0.6, 12, -9.5, 0.7], [0.5, 12, -20.5, 0.9], [0.6, 3, 24, 0.7], [0.6, 9, -2, 0.7]].forEach((c, i) => chalkW(-W0 + 0.02, c[1] + c[0], c[2], Math.PI / 2, 0.2 + i * 0.03));
      [[0.6, 6, 12], [0.5, 12, -15.5], [0.6, 15, -28]].forEach(c => chalkW(W0 - 0.02, c[1] + c[0], c[2], -Math.PI / 2, 0.22));
      chalkF(0, 18.13, -46, 0.26);
      // barge wreck on the terrace: a spar through the rail, hull planks, mooring line run out across the stone
      D('wood', 8.4, 1.4, 40, 7, 0.24, 0.24, HULL, { ry: 0.4, rz: 0.3, outline: 0.05 }); D('wood', 6.6, 0.1, 37.6, 2.6, 0.1, 0.7, HULL, { ry: 1.0, outline: 0.04 }); D('wood', 7.9, 0.14, 35.4, 2.0, 0.1, 0.6, HULL, { ry: -0.3, outline: 0.04 }); line(8.6, 0.08, 44, 2.4, 0.08, 36, 0.05, 0x8a6a48); line(2.4, 0.08, 36, -1.6, 0.08, 34.6, 0.05, 0x8a6a48);
      // the names. Mara's list, begun in chalk on the door wall, because nobody had paper
      sign('MARA KEEPS THE LIST', -8.6, 19.6, -57.9, 0, 2.6, 0.36, '#fff6d8', '#3a3350'); for (let i = 0; i < 18; i++) D('flat', -9.6 + (i % 3) * 0.72, 19.1 - Math.floor(i / 3) * 0.2, -57.92, 0.5 + (i * 5 % 3) * 0.08, 0.06, 0.02, CHALK, { outline: 0 });
      // the Auditor's own table, set for one, under the door
      D('flat', 6.4, 18.5, -54.6, 1.6, 0.08, 1.0, IVORY, { outline: 0.04 }); D('flat', 6.4, 18.24, -54.6, 0.2, 0.5, 0.2, GILT, { outline: 0.03 }); D('flat', 6.4, 18.57, -54.6, 0.5, 0.03, 0.4, 0xece6d6, { ry: 0.2, outline: 0 }); cyl('glow', 6.9, 18.66, -54.4, 0.04, 0.04, 0.24, LAMP, { seg: 6, outline: 0 }); D('flat', 5.9, 18.6, -54.8, 0.1, 0.12, 0.1, 0x15151f, { outline: 0.02 });
      // the frame the kneeling bell hangs in, on the first landing
      [-0.7, 0.7].forEach(o => D('wood', -5.3, 7.5, 15.6 + o, 0.14, 3, 0.14, 0x4a3524, { outline: 0.03 })); D('wood', -5.3, 9.05, 15.6, 0.16, 0.16, 1.7, 0x4a3524, { outline: 0.03 }); D('flat', -5.3, 8.92, 15.6, 0.05, 0.14, 0.05, IRON, { outline: 0 }); solid(-5.5, 14.7, -5.1, 16.5, 6, 9, { cam: false });
    };
    // ===== THE VENT STACK: the island in the river on day thirty-one. One white chimney, and the iron stair the people who keep it climb =====
    const STACK = () => {
      W.underRoof = () => false; W.inside = () => false;
      const C = 5, O = 8.4, IR = 0x3a3f4c, WHITE = 0xe9e6dc, BLUE = 0x5fd0ff, rs = SC.seeded(31);
      // the river, the island, its shingle
      D('roof', 0, -0.9, 0, 260, 1, 260, 0x1c4a5e, { outline: 0 }); cyl('roof', 0, -0.3, 0, 31, 33, 0.6, 0x8a8674, { seg: 44, outline: 0 }); cyl('roof', 0, -0.26, 0, 28, 29, 0.6, 0x2c5a40, { seg: 44, outline: 0 });
      [[-26, -26, 26, -25], [-26, 25, 26, 26], [-26, -26, -25, 26], [25, -26, 26, 26]].forEach(w => wall(w[0], w[1], w[2], w[3]));
      for (let i = 0; i < 30; i++) { const a = i / 30 * 6.283 + rs() * 0.1, r = 21 + rs() * 5; const px = Math.cos(a) * r, pz = Math.sin(a) * r * 0.95; if (pz > 8 && Math.abs(px + 5) < 15) continue; pine(px, pz, 1.2 + rs() * 1.1, r < 24.5); }
      for (let i = 0; i < 70; i++) { const a = i / 70 * 6.283, r = 60 + rs() * 40; pine(Math.cos(a) * r, Math.sin(a) * r, 1.6 + rs() * 1.6); }
      // House Teal's camp, south of the stack, and the pump house the lamps run from
      tentD(-15, 17, 0.5, TEAL); tentD(-19, 11, 1.1, TEAL); tentD(13, 19, -0.4, TEAL); standard(8.6, 21, 0, 5, TEAL); standard(-11.4, 21.6, 0, 5, TEAL);
      B('brick', 13, 2, 20, 9, 0, 3.6, 0xd8d0bc, { outline: 0.1 }); D('roof', 16.5, 3.9, 5.5, 8, 0.5, 8, 0x4a4234, { outline: 0.06 }); D('flat', 12.96, 1.3, 5.5, 0.1, 2.2, 1.3, 0x2a2630, { outline: 0.03 }); sign('PUMP', 12.94, 2.9, 5.5, -Math.PI / 2, 1.6, 0.5, '#e8c25a', '#07070d');
      D('flat', 9, 0.5, 5.5, 8, 0.5, 0.5, IR, { outline: 0.04 }); D('flat', 5.4, 2.2, 5.5, 0.5, 4, 0.5, IR, { outline: 0.04 });
      for (let i = 0; i < 9; i++) { const a = -0.6 + i * 0.5, r = 15 + (i % 3) * 3; cyl('flat', Math.sin(a) * r, 0.04, 14 + Math.cos(a) * 6, 0.09, 0.1, 0.06, IR, { seg: 8, outline: 0.02 }); cyl('glow', Math.sin(a) * r, 0.18, 14 + Math.cos(a) * 6, 0.07, 0.08, 0.22, TLAMP, { seg: 8, outline: 0 }); }
      crate(-3, 20, 0.9, 0, 'hp'); crate(4.5, 17, 0.9, 0, 'meter'); crateStatic(10.5, 12, 1.2, 0); crateStatic(-12.5, 13.6, 1.1, 0);
      // the stack: white enamel, gilt bands, thirty-six metres of it, and the soot of whoever keeps it
      B('concrete', -C, -C, C, C, 0, 36, WHITE, { outline: 0.12 });
      [0.5, 12, 24, 35.4].forEach(y => D('flat', 0, y, 0, 2 * C + 0.5, 0.7, 2 * C + 0.5, GILT, { outline: 0.05 }));
      for (let i = 0; i < 14; i++) { const sd = i % 4, u = -4 + rs() * 8, y = 3 + rs() * 30, h = 2 + rs() * 5; D('flat', sd === 0 ? u : sd === 1 ? C + 0.02 : sd === 2 ? u : -C - 0.02, y, sd === 0 ? C + 0.02 : sd === 1 ? u : sd === 2 ? -C - 0.02 : u, sd % 2 ? 0.03 : 0.5, h, sd % 2 ? 0.5 : 0.03, 0x8a8478, { outline: 0 }); }
      watcher(0, 30, C + 0.06, 0, 1.5); sign('AUTHORITY VENT · SEALED BY THE COUNT', 0, 8.4, C + 0.08, 0, 6, 0.6, '#e8c25a', '#07070d');
      // the keeper's stair: iron, four flights to a turn, three turns
      const post = (x, y, z) => D('flat', x, y + 0.55, z, 0.1, 1.1, 0.1, IR, { outline: 0.02 });
      const edge = (x0, z0, x1, z1, ya, yb) => { if (z0 === z1) solid(x0, z0 - 0.1, x1, z0 + 0.1, Math.min(ya, yb) - 0.5, Math.max(ya, yb) + 1.25, { cam: false }); else solid(x0 - 0.1, z0, x0 + 0.1, z1, Math.min(ya, yb) - 0.5, Math.max(ya, yb) + 1.25, { cam: false });
        const n = Math.max(1, Math.round(Math.hypot(x1 - x0, z1 - z0) / 1.7)); for (let i = 0; i <= n; i++) post(SC.lerp(x0, x1, i / n), SC.lerp(ya, yb, i / n), SC.lerp(z0, z1, i / n)); };
      const pad = (x0, z0, x1, z1, y) => B('flat', x0, z0, x1, z1, y - 0.45, y, IR, { outline: 0.05 });
      for (let t = 0; t < 3; t++) { const H = t * 12;
        ramp('flat', -C, C, C, O, H - 0.45, H, H + 3, 'x', IR, { steps: true }); edge(-C, O, C, O, H, H + 3);
        pad(C, C, O, O, H + 3); edge(O, C, O, O, H + 3, H + 3); edge(C, O, O, O, H + 3, H + 3);
        ramp('flat', C, -C, O, C, H + 2.55, H + 6, H + 3, 'z', IR, { steps: true }); edge(O, -C, O, C, H + 6, H + 3);
        pad(C, -O, O, -C, H + 6); edge(O, -O, O, -C, H + 6, H + 6); edge(C, -O, O, -O, H + 6, H + 6);
        ramp('flat', -C, -O, C, -C, H + 5.55, H + 9, H + 6, 'x', IR, { steps: true }); edge(-C, -O, C, -O, H + 9, H + 6);
        pad(-O, -O, -C, -C, H + 9); edge(-O, -O, -O, -C, H + 9, H + 9); edge(-O, -O, -C, -O, H + 9, H + 9);
        ramp('flat', -O, -C, -C, C, H + 8.55, H + 9, H + 12, 'z', IR, { steps: true }); edge(-O, -C, -O, C, H + 9, H + 12);
        if (t < 2) {   // a working platform at the foot of each turn, hung off the south-west corner
          const y = H + 12; pad(-14, C, -C, 14, y); edge(-14, C, -14, 14, y, y); edge(-14, 14, -C, 14, y, y); edge(-C, O, -C, 14, y, y); edge(-14, C, -O, C, y, y);
          [[-13.7, 13.7], [-5.3, 13.7], [-13.7, 5.3]].forEach(p => D('flat', p[0], y - 1.4, p[1], 0.2, 1.9, 0.2, IR, { outline: 0.03 })); D('flat', -9.5, y - 0.75, 9.5, 8.6, 0.24, 0.3, IR, { outline: 0.03 }); D('flat', -9.5, y - 0.75, 9.5, 0.3, 0.24, 8.6, IR, { outline: 0.03 });
          crateStatic(-12.6, 12.6, 1.1, y); crate(-6.6, 12.4, 0.9, y, t ? 'meter' : 'hp'); cyl('flat', -13.2, y + 0.04, 6.2, 0.1, 0.11, 0.06, IR, { seg: 8, outline: 0.02 }); cyl('glow', -13.2, y + 0.2, 6.2, 0.08, 0.09, 0.26, LAMP, { seg: 8, outline: 0 });
        }
      }
      // the top: the crown of the stack, and the collar the Proctors stand their heels on
      pad(-O, C, -C, O, 36); pad(-C, C, C, O, 36); edge(-O, C, -O, O, 36, 36); edge(-O, O, -C, O, 36, 36); edge(C, C, C, O, 36, 36);
      edge(C, -C, C, C, 36, 36); edge(-C, -C, C, -C, 36, 36); edge(-C, -C, -C, C - 0.2, 36, 36);
      cyl('flat', 0, 36.55, 0, 2.5, 2.9, 1.1, IR, { seg: 18, outline: 0.06 }); cyl('glow', 0, 37.14, 0, 2.1, 2.1, 0.1, BLUE, { seg: 18, outline: 0 }); solid(-2.5, -2.5, 2.5, 2.5, 36, 37.1, { cam: false });
      cyl('flat', 0, 36.06, 3.6, 0.7, 0.7, 0.1, GILT, { seg: 14, outline: 0.03 }); cyl('glow', 0, 36.13, 3.6, 0.5, 0.5, 0.04, BLUE, { seg: 14, outline: 0 });
      for (let k = 0; k < 6; k++) { const g = new THREE.IcosahedronGeometry(1, 1), sz = 1.4 + k * 0.7; g.scale(sz, sz * 0.8, sz); batch.add('flat', g, G.mx(k * k * 0.5, 39 + k * 3.4, -k * 0.9, k), [0xc9d6e2, 0xb4c4d4, 0x9fb2c6][Math.min(2, k >> 1)], 0); g.dispose(); }
      // the keeper's marks: slate tags wired to the rail, and the plate that says where the air comes from
      D('flat', -13.86, 13.1, 9.6, 0.04, 0.5, 0.36, 0x23232e, { outline: 0.02 }); D('flat', -C - 0.06, 25.6, 3.4, 0.05, 0.9, 1.5, GILT, { outline: 0.03 }); D('flat', -C - 0.1, 25.6, 3.4, 0.03, 0.6, 1.2, 0x23232e, { outline: 0 });
      chalkW(-C - 0.04, 13.2, 6.6, -Math.PI / 2, 0.24); chalkW(C + 0.04, 4.4, 1, Math.PI / 2, 0.22);
    };
    // ===== THE DEEP ARRAY: under the floor of Tier Six, forty-three days after the furnace. The machine the air comes from, and what is left of it =====
    const ARRAY = () => {
      W.underRoof = () => true; W.inside = () => true;
      const IR = 0x3a3f4c, RUST = 0x7a4a2a, BR = 0xb8863a, WALL = 0x26302c, WARM = 0xffb060, SEAL = 0x5ff2e2, rs = SC.seeded(77);
      D('roof', 0, -0.5, 0, 44, 1, 64, 0x1f2624, { outline: 0 });
      B('concrete', -20, -29.6, 20, -28, 0, 24, WALL, { outline: 0.1 }); B('concrete', -20, 28, 20, 29.6, 0, 24, WALL, { outline: 0.1 }); B('concrete', -20.6, -29, -18, 29, 0, 24, WALL, { outline: 0.1 }); B('concrete', 18, -29, 20.6, 29, 0, 24, WALL, { outline: 0.1 });
      D('roof', 0, 24.4, 0, 42, 0.8, 60, 0x141918, { outline: 0 });
      for (let i = 0; i < 9; i++) { D('flat', -17.9, 3 + i * 2.3, -24 + (i * 13) % 48, 0.2, 0.3, 9 + (i % 3) * 4, i % 2 ? RUST : IR, { outline: 0.03 }); D('flat', 17.9, 2 + i * 2.4, -20 + (i * 17) % 44, 0.2, 0.3, 7 + (i % 4) * 3, i % 2 ? IR : BR, { outline: 0.03 }); }
      const post = (x, y, z) => D('flat', x, y + 0.55, z, 0.1, 1.1, 0.1, IR, { outline: 0.02 });
      const edge = (x0, z0, x1, z1, ya, yb) => { if (z0 === z1) solid(x0, z0 - 0.1, x1, z0 + 0.1, Math.min(ya, yb) - 0.5, Math.max(ya, yb) + 1.25, { cam: false }); else solid(x0 - 0.1, z0, x0 + 0.1, z1, Math.min(ya, yb) - 0.5, Math.max(ya, yb) + 1.25, { cam: false });
        const n = Math.max(1, Math.round(Math.hypot(x1 - x0, z1 - z0) / 1.7)); for (let i = 0; i <= n; i++) post(SC.lerp(x0, x1, i / n), SC.lerp(ya, yb, i / n), SC.lerp(z0, z1, i / n)); };
      const pad = (x0, z0, x1, z1, y) => B('flat', x0, z0, x1, z1, y - 0.45, y, IR, { outline: 0.05 });
      // the hatch gantry, the ladder down from the tunnel, and the stair along the west wall
      pad(-18, 20, -10, 28, 12); edge(-14.6, 20, -10, 20, 12, 12); edge(-10, 20, -10, 28, 12, 12);
      [-0.4, 0.4].forEach(o => D('flat', -14 + o, 18, 27.7, 0.1, 12, 0.1, IR, { outline: 0.02 })); for (let y = 12.6; y < 24; y += 0.7) D('flat', -14, y, 27.7, 0.9, 0.07, 0.07, IR, { outline: 0 }); D('glow', -14, 23.9, 27.2, 1.6, 0.1, 1.2, WARM, { outline: 0 });
      ramp('flat', -18, 4, -14.6, 20, 7.55, 8, 12, 'z', IR, { steps: true }); edge(-14.6, 4, -14.6, 20, 8, 12);
      // the long catwalk across the hall, and a bay to stand in while the watch lamp goes by
      pad(-18, 0, 18, 4, 8); edge(-18, 0, 14.6, 0, 8, 8); edge(-14.6, 4, -12, 4, 8, 8); edge(-8, 4, 18, 4, 8, 8);
      pad(-12, 4, -8, 7.4, 8); edge(-12, 7.4, -8, 7.4, 8, 8); edge(-12, 4, -12, 7.4, 8, 8); edge(-8, 4, -8, 7.4, 8, 8); crateStatic(-11, 6.5, 1.3, 8); crateStatic(-9.4, 6.7, 0.9, 8);
      for (let x = -15; x <= 15; x += 6) [0.3, 3.7].forEach(z => D('flat', x, 3.8, z, 0.26, 7.6, 0.26, IR, { outline: 0.03 }));
      D('flat', 3, 13.2, 2, 16, 0.14, 0.14, IR, { outline: 0.02 });   // the rail the watch lamp runs on
      // the east stair down to the floor
      ramp('flat', 14.6, -20, 18, 0, -0.45, 0, 8, 'z', IR, { steps: true }); edge(14.6, -20, 14.6, 0, 0, 8);
      // the floor: the heart of it, the main, forty-eight banks
      cyl('flat', 0, 2.2, -18, 4.2, 4.8, 4.4, RUST, { seg: 20, outline: 0.1 }); cyl('flat', 0, 4.6, -18, 4.5, 4.5, 0.4, BR, { seg: 20, outline: 0.06 }); solid(-4.3, -22.3, 4.3, -13.7, 0, 4.8, {});
      cyl('glow', 0, 1.5, -13.52, 0.5, 0.5, 0.1, SEAL, { seg: 12, outline: 0 }); D('glow', 0, 0.9, -13.5, 0.12, 1.2, 0.06, SEAL, { outline: 0 }); D('flat', 0, 0.02, -12.6, 2.4, 0.02, 1.8, 0x1f4a48, { outline: 0 });
      D('flat', 0, 1.3, -6.5, 1.7, 1.7, 14, BR, { outline: 0.08 }); solid(-0.85, -13.5, 0.85, 0.5, 0, 2.15, { cam: false });
      [[-9.5, 0x8a7a5a], [-6.2, 0x6a5a48], [-2.6, 0x9a8468]].forEach(p => D('wood', 0, 1.3, p[0], 1.86, 1.86, 0.7, p[1], { outline: 0.03 }));
      for (let i = 0; i < 4; i++) D('flat', (i < 2 ? -1 : 1) * 9, 1.1, -18 + (i % 2 ? 5 : -5), 14, 1.1, 1.1, i % 2 ? RUST : BR, { outline: 0.06 });
      for (let k = 0; k < 48; k++) { const side = k < 24 ? -1 : 1, i = k % 24, x = side * (16.4 - (i % 2) * 2.4), z = -26 + Math.floor(i / 2) * 3.6, live = (k * 7) % 48 < 31;
        D('flat', x, 0.65, z, 0.5, 1.3, 0.5, IR, { outline: 0.03 }); cyl('flat', x, 1.4, z, 0.52, 0.52, 0.09, live ? BR : 0x4a3a2c, { seg: 10, outline: 0.03 }); D(live ? 'glow' : 'flat', x, 1.62, z, 0.14, 0.14, 0.14, live ? SEAL : 0x2a2220, { outline: 0 }); }
      // the board on the south wall, repainted when somebody can be bothered
      sign('BANKS LIVE   31 OF 48', 0, 9.4, -27.94, 0, 11, 1.3, '#e8c25a', '#07070d'); for (let k = 0; k < 48; k++) { const live = (k * 7) % 48 < 31; D(live ? 'glow' : 'flat', -8.2 + (k % 16) * 1.09, 7.6 - Math.floor(k / 16) * 0.7, -27.94, 0.5, 0.36, 0.06, live ? SEAL : 0x2a2220, { outline: 0 }); }
      watcher(0, 14, -27.9, 0, 1.6); sign('GRATITUDE IS BREATH', 0, 11.6, -27.94, 0, 8, 0.7, '#e8c25a', '#07070d');
      // what the people who keep it leave: lamps, a tar pot, chalk on everything
      [[-6, -10], [5, -9.4], [-3, 2.6], [11, -22]].forEach(p => { cyl('flat', p[0], 0.04, p[1], 0.1, 0.11, 0.06, IR, { seg: 8, outline: 0.02 }); cyl('glow', p[0], 0.2, p[1], 0.08, 0.09, 0.26, LAMP, { seg: 8, outline: 0 }); });
      cyl('flat', 1.6, 0.3, -5, 0.34, 0.3, 0.6, 0x15151f, { seg: 10, outline: 0.03 }); chalkW(0.88, 1.5, -9.5, Math.PI / 2, 0.22); chalkW(0.88, 1.4, -6.2, Math.PI / 2, 0.2); chalkW(-0.88, 1.5, -2.6, -Math.PI / 2, 0.22); chalkF(-14, 12.03, 23.5, 0.22);
      crate(-12, -6, 0.9, 0, 'hp'); crate(10, -4, 0.9, 0, 'hp'); crateStatic(-13, -22, 1.3, 0); crateStatic(12.6, -25, 1.1, 0);
    };
    if (SC.issue === 'riser') RISER(); else if (SC.issue === 'stair') STAIR(); else if (SC.issue === 'gild') GILD(); else if (SC.issue === 'stack') STACK(); else if (SC.issue === 'array') ARRAY(); else { DOCKS_A(); DOCKS_B(); }

    W.statics = batch.build(G.scene); batch = null;
  };

