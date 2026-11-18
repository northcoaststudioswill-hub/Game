// Underground Syndicate — 3D character miniatures (built from primitives, animated procedurally) + UI icons
(function () {
  const G = window.G, T = THREE, gfx = G.gfx;

  const BASE = {
    fighter: { armor: 0x8a909c, armor2: 0x4a4e58, trim: 0xb09a5a, cloth: 0x8a1c22, legs: 0x565a66, hair: 0x3a2a20, weapon: 0xdfe6ee },
    rogue: { armor: 0x4a4454, armor2: 0x2c2834, trim: 0x8a7240, cloth: 0x3a3048, legs: 0x3a3642, hair: 0x1a1a1a, weapon: 0xd0d8e2 },
    sorcerer: { armor: 0x8a1c24, armor2: 0x4f1016, trim: 0xe0a844, cloth: 0xa0222a, legs: 0x3a1216, hair: 0x5a1418, weapon: 0xff8a3c },
    cleric: { armor: 0x777480, armor2: 0x45424c, trim: 0xe8c860, cloth: 0xe2dcc8, legs: 0x34323a, hair: 0xd8d2c2, weapon: 0xf0d880 }
  };
  const TRIM = [null, 0xd0d8e4, 0xffd36b], WGLOW = [0x000000, 0x2a9ab8, 0xb8862a], WCOL = [null, 0x8fe8ff, 0xffd36b];
  const hex = v => typeof v === 'string' ? parseInt(v.slice(1), 16) : v;

  G.makeChar = function (look) {
    const cls = look.cls, race = G.RACES[look.race], g = look.gear || {};
    const P = Object.assign({}, BASE[cls]);
    if (look.tint) Object.keys(look.tint).forEach(k => P[k] = hex(look.tint[k]));
    if (TRIM[g.armor]) P.trim = TRIM[g.armor];
    const mats = [];
    const M = (color, shiny, emissive) => {
      const m = shiny ? new T.MeshPhongMaterial({ color, flatShading: true, shininess: 60, specular: 0x666666 }) : new T.MeshLambertMaterial({ color, flatShading: true });
      m.emissive = new T.Color(emissive || 0); m.userData.e = m.emissive.clone(); mats.push(m); return m;
    };
    const m = { skin: M(hex(race.skin)), armor: M(P.armor, true), armor2: M(P.armor2, true), trim: M(P.trim, true), cloth: M(P.cloth), legs: M(P.legs), hair: M(P.hair), dark: M(0x15131a), weapon: M(P.weapon, true, WGLOW[g.weapon || 0]) };
    const box = gfx.box, mesh = gfx.mesh;
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const robed = cls === 'sorcerer' || cls === 'cleric';
    const w = { fighter: 0.74, rogue: 0.54, sorcerer: 0.56, cleric: 0.66 }[cls];
    const glows = [];

    // legs
    const legL = new T.Group(), legR = new T.Group(); legL.position.set(0.17, 0.62, 0); legR.position.set(-0.17, 0.62, 0); body.add(legL, legR);
    [legL, legR].forEach(l => { box(0.24, 0.5, 0.28, robed ? m.dark : m.legs, 0, -0.25, 0, l); box(0.27, 0.16, 0.38, m.dark, 0, -0.54, 0.05, l); });
    // torso
    const torso = new T.Group(); torso.position.y = 0.6; body.add(torso);
    box(w, 0.64, 0.42, m.armor, 0, 0.34, 0, torso); box(w + 0.03, 0.11, 0.45, m.armor2, 0, 0.06, 0, torso);
    let robe = null;
    if (robed) { robe = mesh(new T.CylinderGeometry(w * 0.52, 0.56, 0.66, 8), m.cloth, 0, -0.27, 0, torso); mesh(new T.CylinderGeometry(0.57, 0.57, 0.06, 8), m.trim, 0, -0.58, 0, torso); }
    if (cls === 'fighter') { const e = box(0.2, 0.2, 0.05, m.trim, 0, 0.4, 0.22, torso); e.rotation.z = Math.PI / 4; }
    if (cls === 'rogue') { const s = box(0.1, 0.8, 0.05, m.trim, 0, 0.34, 0.22, torso); s.rotation.z = 0.7; }
    if (cls === 'sorcerer') { box(0.3, 0.1, 0.46, m.trim, 0, 0.62, 0, torso); box(0.08, 0.5, 0.05, m.trim, 0, 0.3, 0.22, torso); }
    if (cls === 'cleric') { box(0.28, 0.95, 0.46, m.cloth, 0, 0.16, 0.005, torso); const sun = mesh(new T.SphereGeometry(0.09, 8, 6), m.trim, 0, 0.42, 0.23, torso); sun.scale.z = 0.4; }
    if (cls === 'fighter' || cls === 'cleric') [-1, 1].forEach(sd => { const p = mesh(new T.SphereGeometry(0.21, 7, 5), m.trim, sd * (w / 2 + 0.04), 0.64, 0, torso); p.scale.y = 0.7; });
    // cape / cloak
    let cape = null;
    if (cls === 'fighter' || cls === 'rogue') { cape = new T.Group(); cape.position.set(0, 0.62, -0.23); torso.add(cape); box(w * 0.86, cls === 'fighter' ? 0.95 : 0.6, 0.05, m.cloth, 0, cls === 'fighter' ? -0.47 : -0.3, 0, cape); cape.rotation.x = 0.16; }
    // head
    const head = new T.Group(); head.position.set(0, 0.92, 0); torso.add(head);
    mesh(new T.SphereGeometry(0.26, 9, 7), m.skin, 0, 0, 0, head);
    box(0.06, 0.07, 0.04, m.dark, 0.1, 0.03, 0.24, head); box(0.06, 0.07, 0.04, m.dark, -0.1, 0.03, 0.24, head);
    const cap = (mat, r) => mesh(new T.SphereGeometry(r || 0.3, 9, 5, 0, Math.PI * 2, 0, Math.PI * 0.55), mat, 0, 0.01, 0, head);
    if (cls === 'fighter') { cap(m.armor, 0.31); box(0.06, 0.26, 0.06, m.armor, 0, 0, 0.28, head); box(0.07, 0.24, 0.36, m.cloth, 0, 0.38, -0.04, head); }
    if (cls === 'rogue') { cap(m.cloth, 0.31); box(0.46, 0.44, 0.14, m.cloth, 0, -0.08, -0.22, head); box(0.4, 0.15, 0.1, m.armor2, 0, -0.12, 0.2, head); const tip = mesh(new T.ConeGeometry(0.12, 0.3, 5), m.cloth, 0, 0.3, -0.12, head); tip.rotation.x = -0.9; }
    if (cls === 'sorcerer') { cap(m.hair, 0.29); box(0.42, 0.55, 0.12, m.hair, 0, -0.2, -0.22, head); for (let i = 0; i < 5; i++) { const a = -1 + i * 0.5; mesh(new T.ConeGeometry(0.045, i === 2 ? 0.26 : 0.18, 4), m.trim, Math.sin(a) * 0.24, 0.3, Math.cos(a) * 0.2, head); } }
    if (cls === 'cleric') {
      cap(m.cloth, 0.31); box(0.46, 0.46, 0.14, m.cloth, 0, -0.1, -0.22, head);
      const halo = new T.Mesh(new T.TorusGeometry(0.27, 0.03, 6, 18), new T.MeshBasicMaterial({ color: 0xffe08a })); halo.rotation.x = Math.PI / 2; halo.position.y = 0.48; head.add(halo);
      glows.push(gfx.glow(0xffc860, 1.1, 0, 0.48, 0, head, 0.45));
    }
    if (look.race === 'elf') [-1, 1].forEach(sd => { const e = mesh(new T.ConeGeometry(0.06, 0.26, 4), m.skin, sd * 0.27, 0.06, -0.02, head); e.rotation.z = -sd * 0.9; });
    if (look.race === 'tiefling') [-1, 1].forEach(sd => { const e = mesh(new T.ConeGeometry(0.07, 0.38, 5), m.dark, sd * 0.17, 0.3, 0.06, head); e.rotation.x = -0.6; e.rotation.z = -sd * 0.35; });
    if (look.race === 'halforc') [-1, 1].forEach(sd => mesh(new T.ConeGeometry(0.035, 0.12, 4), new T.MeshLambertMaterial({ color: 0xf2ead8 }), sd * 0.09, -0.12, 0.23, head));
    if (look.race === 'dwarf') box(0.34, 0.32, 0.16, m.hair, 0, -0.24, 0.17, head);

    // arms: model faces +Z, weapon hand is on -X
    const armR = new T.Group(), armL = new T.Group(); armR.position.set(-(w / 2 + 0.11), 0.56, 0); armL.position.set(w / 2 + 0.11, 0.56, 0); torso.add(armR, armL);
    const sleeve = cls === 'sorcerer' ? m.cloth : m.armor2;
    [armR, armL].forEach(a => { box(0.2, 0.5, 0.22, sleeve, 0, -0.22, 0, a); mesh(new T.SphereGeometry(0.11, 6, 5), m.skin, 0, -0.52, 0, a); });
    const hand = (arm) => { const h = new T.Group(); h.position.y = -0.52; arm.add(h); return h; };
    const hR = hand(armR), hL = hand(armL);
    const blade = (h, len) => { box(0.09, 0.04, len, m.weapon, 0, 0, len / 2 + 0.1, h); box(0.3, 0.07, 0.07, m.trim, 0, 0, 0.1, h); if (g.weapon) glows.push(gfx.glow(WCOL[g.weapon], 0.7, 0, 0, len * 0.6, h, 0.55)); };
    if (cls === 'fighter') {
      blade(hR, 1.0);
      const sh = mesh(new T.CylinderGeometry(0.4, 0.4, 0.07, 6), m.armor2, 0.1, -0.3, 0.12, armL); sh.rotation.z = Math.PI / 2; sh.scale.z = 0.85;
      const boss = mesh(new T.CylinderGeometry(0.16, 0.16, 0.1, 6), m.trim, 0.14, -0.3, 0.12, armL); boss.rotation.z = Math.PI / 2;
    }
    if (cls === 'rogue') { blade(hR, 0.5); blade(hL, 0.5); }
    if (cls === 'cleric') {
      const hd = mesh(new T.CylinderGeometry(0.035, 0.035, 0.8, 5), m.dark, 0, 0, 0.35, hR); hd.rotation.x = Math.PI / 2;
      mesh(new T.IcosahedronGeometry(0.17, 0), M(P.weapon, true, 0x7a5a10), 0, 0, 0.78, hR);
      glows.push(gfx.glow(WCOL[g.weapon] || 0xffd060, 1.0, 0, 0, 0.78, hR, 0.6));
    }
    let orbs = null;
    if (cls === 'sorcerer') {
      const oc = WCOL[g.weapon] || 0xff8a3c;
      orbs = [hR, hL].map(h => { const o = new T.Mesh(new T.SphereGeometry(0.1, 8, 6), new T.MeshBasicMaterial({ color: 0xfff0c0 })); o.position.z = 0.08; h.add(o); const gl = gfx.glow(oc, 0.9, 0, 0, 0.08, h, 0.9); glows.push(gl); return gl; });
    }
    const castGlow = gfx.glow(0xffffff, 0.1, 0, 0, 0.2, hR, 0);

    const sc = (look.scale || 1) * race.scale;
    root.scale.set(sc * (look.race === 'dwarf' ? 1.16 : 1), sc, sc * (look.race === 'dwarf' ? 1.16 : 1));
    root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });

    let lastAlpha = 1;
    const C = { root, body, mats, height: 1.9 * sc };
    // pose: {moving, walk, act:'idle|swing|cast|stun|dodge|ko', prog, flash, alpha, t, glow(color)}
    C.pose = function (p) {
      const t = p.t || 0, mv = p.moving && p.act !== 'ko' && p.act !== 'dodge';
      const sw = mv ? Math.sin(p.walk) : 0;
      body.position.y = mv ? Math.abs(Math.cos(p.walk)) * 0.06 : Math.sin(t * 2.4) * 0.015;
      body.rotation.set(mv ? 0.12 : 0, 0, 0);
      legL.rotation.x = sw * 0.7; legR.rotation.x = -sw * 0.7;
      torso.rotation.set(0, 0, 0); head.rotation.set(0, 0, 0);
      let ar = -0.45 + (mv ? -sw * 0.3 : Math.sin(t * 2.4) * 0.04), al = (cls === 'fighter' ? -0.9 : cls === 'rogue' || cls === 'sorcerer' ? -0.5 : 0.05) + (mv ? sw * 0.3 : 0), arz = 0, alz = 0;
      if (p.act === 'swing') {
        const k = Math.min(1, p.prog || 0), e = k < 0.5 ? k * 2 : 1;
        ar = k < 0.5 ? G.lerp(-0.45, -2.7, Math.min(1, k * 4)) + (k > 0.25 ? (k - 0.25) * 4 * 2.6 : 0) : G.lerp(-0.1, -0.45, (k - 0.5) * 2);
        torso.rotation.y = G.lerp(0.5, -0.5, e) * (k < 0.5 ? 1 : 1 - (k - 0.5) * 2);
        body.rotation.x = 0.18; if (cls === 'rogue') al = ar + 0.5;
      } else if (p.act === 'cast') {
        const k = Math.min(1, p.prog || 0); ar = -1.5 - k * 0.3; al = cls === 'cleric' ? -0.3 : -1.5 - k * 0.3; arz = -0.25; alz = 0.25; body.rotation.x = -0.05;
      } else if (p.act === 'stun') { head.rotation.z = Math.sin(t * 9) * 0.3; torso.rotation.z = Math.sin(t * 7) * 0.12; ar = 0.1; al = 0.1; body.rotation.x = 0.25; }
      armR.rotation.set(ar, 0, arz); armL.rotation.set(al, 0, alz);
      if (cape) cape.rotation.x = 0.16 + (mv ? 0.35 + sw * 0.1 : Math.sin(t * 2) * 0.04);
      if (robe) robe.rotation.z = mv ? sw * 0.08 : 0;
      root.rotation.z = 0; root.rotation.x = 0; root.position.y = p.y || 0;
      if (p.act === 'dodge') { body.rotation.x = (p.prog || 0) * Math.PI * 2; body.position.y = 0.5; legL.rotation.x = legR.rotation.x = 1.6; ar = al = -2; armR.rotation.x = armL.rotation.x = -2; }
      if (p.act === 'ko') { const k = Math.min(1, (p.prog || 0) * 2.2); body.rotation.x = -1.5 * k; body.position.y = 0.2 * k; legL.rotation.x = 0.3 * k; armR.rotation.set(-2.6 * k, 0, -0.5 * k); armL.rotation.set(-2.4 * k, 0, 0.6 * k); }
      // sorcerer flames + cast glow
      const fl = 0.85 + Math.sin(t * 17) * 0.12;
      if (orbs) orbs.forEach(o => o.scale.setScalar((p.act === 'cast' ? 1.2 + (p.prog || 0) * 0.9 : 0.9) * fl));
      if (p.act === 'cast' && p.glow) { castGlow.material.color.set(p.glow); castGlow.material.opacity = 0.9; castGlow.scale.setScalar(0.6 + (p.prog || 0) * 1.4); } else castGlow.material.opacity = 0;
      // flash + stealth
      const fl2 = p.flash > 0;
      for (const mt of mats) { if (fl2) mt.emissive.setRGB(0.9, 0.9, 0.9); else mt.emissive.copy(mt.userData.e); }
      const a = p.alpha == null ? 1 : p.alpha;
      if (a !== lastAlpha) { lastAlpha = a; for (const mt of mats) { mt.transparent = a < 1; mt.opacity = a; mt.needsUpdate = true; } glows.forEach(gl => gl.visible = a > 0.5); root.traverse(o => { if (o.isMesh) o.castShadow = a > 0.5; }); }
    };
    C.pose({ t: 0, act: 'idle' });
    return C;
  };

  // ------------------------------------------------------------ portraits (rendered once, cached as images)
  let pr = null, pscene, pcam; const pcache = {};
  G.portrait = function (look, size) {
    const key = JSON.stringify([look.cls, look.race, look.tint, look.gear]);
    const img = document.createElement('img'); img.className = 'portrait'; img.style.width = img.style.height = (size / 16) + 'rem'; img.alt = '';
    if (!pcache[key]) {
      try {
        if (!pr) {
          pr = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); pr.setSize(160, 160, false); pr.toneMapping = T.ACESFilmicToneMapping; pr.toneMappingExposure = 1.3;
          pscene = new T.Scene(); pscene.add(new T.HemisphereLight(0x8a80a8, 0x2a1c14, 1.3));
          const d = new T.DirectionalLight(0xffd8b0, 2.2); d.position.set(-3, 5, 4); pscene.add(d);
          pcam = new T.OrthographicCamera(-0.62, 0.62, 0.62, -0.62, 0.1, 50); pcam.position.set(3, 3.1, 4.2); pcam.lookAt(0, 1.32, 0);
        }
        const c = G.makeChar(Object.assign({}, look, { scale: 1 })); const k = 1 / G.RACES[look.race].scale; c.root.scale.multiplyScalar(k);
        pscene.add(c.root); pr.render(pscene, pcam); pcache[key] = pr.domElement.toDataURL('image/png'); pscene.remove(c.root);
      } catch (e) { pcache[key] = ''; }
    }
    if (pcache[key]) img.src = pcache[key];
    return img;
  };

  // ------------------------------------------------------------ ability icons (inline SVG)
  const ICON = {
    sword: '<path d="M19 3l2 2-10 10-2 0 0-2zM6 14l4 4-2 2-1-1-3 3-1-1 3-3-1-1z"/>',
    arrow: '<path d="M3 12l12-2 0-4 7 6-7 6 0-4z"/>',
    burst: '<path d="M12 2l2 6 6-3-3 6 6 2-6 2 3 6-6-3-2 6-2-6-6 3 3-6-6-2 6-2-3-6 6 3z"/>',
    dash: '<path d="M2 7h10l-2-3h4l6 8-6 8h-4l2-3H2l2-5z"/>',
    shield: '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/>',
    cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    up: '<path d="M12 2l8 9h-5v4H9v-4H4zM9 17h6v2H9zM9 20h6v2H9z"/>',
    potion: '<path d="M9 2h6v2h-1v4l5 9c1 2 0 5-3 5H8c-3 0-4-3-3-5l5-9V4H9z"/>'
  };
  G.icon = (ab) => {
    const k = ab === 'potion' ? 'potion' : (ab.icon || (ab.type === 'melee' ? 'sword' : ab.type === 'proj' ? 'arrow' : 'burst'));
    return '<svg viewBox="0 0 24 24" fill="' + (ab === 'potion' ? '#ff6a7a' : ab.color) + '">' + ICON[k] + '</svg>';
  };
})();
