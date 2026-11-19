//@@PAL
  /* The High Docks are Spire-built: ivory stone, enamelled plate, gilt, the dock's teal. Every colour the level was
     built with goes through here, so the streets stay where they were and only the place changes. */
  const _pc = new THREE.Color(), _ph = { h: 0, s: 0, l: 0 };
  function PAL(mat, color) {
    if (color === undefined || color === null || mat === 'glow' || mat === 'glass' || mat === 'wood' || mat === 'crate' || mat === 'asphalt') return color;
    _pc.set(color); _pc.getHSL(_ph, THREE.SRGBColorSpace);
    if (_ph.l < 0.17) return color;                                                    // ink stays ink
    if (mat === 'brick' || mat === 'win' || mat === 'concrete' || mat === 'roof') {
      const warm = mat !== 'roof';
      _pc.setHSL(warm ? 0.1 + _ph.h * 0.04 : 0.66, warm ? 0.16 : 0.18, SC.clamp(_ph.l * 0.5 + (mat === 'roof' ? 0.14 : 0.44), 0.2, 0.86), THREE.SRGBColorSpace);
    } else if (mat === 'metal' || mat === 'container') {
      if (_ph.s < 0.3 && _ph.h > 0.5 && _ph.h < 0.75) _pc.setHSL(0.11, 0.2, SC.clamp(_ph.l + 0.14, 0.4, 0.78), THREE.SRGBColorSpace);   // grey-blue plate -> ivory enamel
      else if (_ph.h < 0.13 || _ph.h > 0.9) _pc.setHSL(0.115, 0.62, SC.clamp(_ph.l + 0.06, 0.36, 0.6), THREE.SRGBColorSpace);           // rust and red -> gilt
      else if (_ph.h < 0.5) _pc.setHSL(0.49, 0.45, SC.clamp(_ph.l, 0.3, 0.5), THREE.SRGBColorSpace);                                    // green -> dock teal
      else _pc.setHSL(0.72, 0.4, SC.clamp(_ph.l, 0.3, 0.5), THREE.SRGBColorSpace);                                                      // blue -> Count violet
    } else if (mat === 'flat') {
      if (_ph.s > 0.5 && (_ph.h < 0.06 || _ph.h > 0.94)) _pc.setHSL(0.115, 0.62, 0.5, THREE.SRGBColorSpace);                            // signal red -> gilt
      else if (_ph.h > 0.55 && _ph.h < 0.72 && _ph.l < 0.4) _pc.setHSL(0.68, 0.3, _ph.l, THREE.SRGBColorSpace);                         // puddles keep the sky
    }
    return _pc.getHex();
  }
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
//@@BOARD
    // the watch board, face down by a spilled sled: where somebody changed the hour
    D('wood', 9.3, 0.5, 15.2, 1.5, 0.95, 0.08, 0x3a3350, { ry: 0.5, rx: -1.1, outline: 0.04 });
    D('flat', 9.26, 0.58, 15.14, 1.2, 0.7, 0.04, 0xece6d6, { ry: 0.5, rx: -1.1, outline: 0 });
    D('crate', 8.4, 0.3, 15.9, 0.6, 0.6, 0.6, 0xb98a55, { ry: -0.4, outline: 0.04 });
    D('crate', 10.2, 0.25, 14.4, 0.5, 0.5, 0.5, 0xd9a05f, { ry: 0.8, outline: 0.04 });

//@@ALLEY
    // ----- south side: Bond Alley between two bond houses; the dock stair is at its blind end -----
    cyl('metal', 1.5, 0.22, 38.8, 0.16, 0.2, 0.44, 0xc9a063, { outline: 0.03 }); D('glow', 1.5, 0.5, 38.8, 0.2, 0.2, 0.2, 0xffe9a0, { outline: 0 });
    D('flat', 0, 1.0, 45.2, 5.6, 0.1, 0.1, 0x23232e, { outline: 0.03 }); [-2.6, 0, 2.6].forEach(x => D('flat', x, 0.5, 45.2, 0.1, 1, 0.1, 0x23232e, { outline: 0.03 }));
    D('glow', -2.2, 1.3, 45.3, 0.25, 0.3, 0.25, 0xffe9a0, { outline: 0 }); D('glow', 2.2, 1.3, 45.3, 0.25, 0.3, 0.25, 0xffe9a0, { outline: 0 });
//@@MOORING
    // Mooring One: the last cleat, on the south edge of the roof
    cyl('metal', 16, 11.35, -22.9, 0.22, 0.3, 0.7, 0xc9a063, { outline: 0.04 }); D('metal', 16, 11.72, -22.9, 1.1, 0.14, 0.24, 0xc9a063, { outline: 0.04 });
    solid(15.6, -23.2, 16.4, -22.6, 11, 11.8, { cam: false });
//@@SPIRE
    // the Sun Spire, nine hundred steps of it, far off to the north
    { const sp = new THREE.Group(), mb = c => new THREE.MeshBasicMaterial({ color: c, fog: false });
      const put = (geo, c, y, back) => { const m = new THREE.Mesh(geo, mb(c)); if (back) m.material.side = THREE.BackSide; m.position.y = y; m.renderOrder = -8; sp.add(m); return m; };
      put(new THREE.CylinderGeometry(11.6, 21, 304, 10), INK, 120, true);
      put(new THREE.CylinderGeometry(10, 19, 300, 10), 0xb9b3cc, 120);
      [40, 95, 150, 205, 250].forEach(y => { const r = 19 - (y + 30) / 300 * 9 + 0.5; put(new THREE.CylinderGeometry(r, r + 0.3, 5, 10), 0xe8c25a, y); });
      put(new THREE.ConeGeometry(13.6, 50, 10), INK, 293, true); put(new THREE.ConeGeometry(12, 46, 10), 0xffd76a, 292);
      const halo = new THREE.Mesh(new THREE.CircleGeometry(46, 28), new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0.16, fog: false, depthWrite: false })); halo.position.set(0, 300, 14); halo.renderOrder = -9; sp.add(halo);
      sp.position.set(90, 0, -330); sp.lookAt(0, 0, 0); sp.rotation.x = 0; sp.rotation.z = 0; sky.add(sp); }
