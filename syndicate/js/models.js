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
    // Joint targets are computed per state, then eased toward, so stances blend instead of snapping.
    const cur = {}, J = (k, v, s) => (cur[k] = cur[k] == null ? v : cur[k] + (v - cur[k]) * s);
    const mix = G.lerp, eo = x => 1 - Math.pow(1 - x, 3), ei = x => x * x;
    const restL = cls === 'fighter' ? -0.9 : cls === 'rogue' || cls === 'sorcerer' ? -0.5 : 0.05;
    // pose: {moving, walk, act:'idle|swing|cast|stun|dodge|ko', prog, step (combo step), hurt, guard, flash, alpha, t, glow}
    C.pose = function (p) {
      const t = p.t || 0, act = p.act || 'idle', mv = p.moving && act !== 'ko' && act !== 'dodge';
      const sw = mv ? Math.sin(p.walk) : 0, k = Math.max(0, Math.min(1, p.prog || 0));
      const q = { by: Math.sin(t * 2.4) * 0.015, bx: 0.06, bz: Math.sin(t * 1.2) * 0.02, bpz: 0, ll: 0.05, lr: -0.05, ty: Math.sin(t * 1.2) * 0.04, tz: 0, hx: 0, hz: 0,
        arx: -0.45 + Math.sin(t * 2.4) * 0.04, arz: 0, alx: restL + Math.sin(t * 2.4 + 1) * 0.03, alz: 0, cape: 0.16 + Math.sin(t * 2) * 0.04 };
      let snap = 0.28;
      if (mv) { q.by = Math.abs(Math.cos(p.walk)) * 0.075; q.bx = 0.17; q.ll = sw * 0.85; q.lr = -sw * 0.85; q.ty = sw * 0.16; q.arx += -sw * 0.38; q.alx += sw * 0.38; q.cape = 0.52 + sw * 0.1; q.hx = -0.06; snap = 0.5; }
      if (act === 'swing') {
        snap = 1; const step = p.step || 0, w = Math.min(1, k / 0.5), r = Math.max(0, (k - 0.5) / 0.5);
        const cock = eo(Math.min(1, w / 0.6)), hit = ei(Math.max(0, (w - 0.6) / 0.4)), back = r * r * (3 - 2 * r);
        const seq = (ready, cocked, struck) => k < 0.5 ? mix(mix(ready, cocked, cock), struck, hit) : mix(struck, ready, back);
        if (step === 0) { q.arx = seq(-0.45, -2.6, 0.3); q.arz = seq(0, -0.5, 0.5); q.ty = seq(0, 0.6, -0.65); q.bx = seq(0.06, -0.06, 0.3); }
        else if (step === 1) { q.arx = seq(-0.45, -1.35, -1.15); q.arz = seq(0, 1.0, -1.2); q.ty = seq(0, -0.75, 0.8); q.bx = seq(0.06, 0.06, 0.22); }
        else { q.arx = seq(-0.45, -3.05, 0.5); q.alx = seq(restL, -2.9, 0.4); q.bx = seq(0.06, -0.3, 0.5); q.by = k < 0.5 ? Math.sin(w * Math.PI) * 0.42 : 0; q.ll = q.lr = k < 0.5 ? Math.sin(w * Math.PI) * 0.7 : 0; q.hx = seq(0, -0.3, 0.2); }
        q.bpz = seq(0, -0.1, 0.24); q.cape = 0.3 + hit * 0.5;
        if (cls === 'rogue' && step < 2) { q.alx = q.arx + 0.5; q.alz = -q.arz * 0.6; }
      } else if (act === 'cast') {
        snap = 0.6; q.arx = cls === 'cleric' ? mix(-1.4, -2.8, eo(k)) : -1.5 - k * 0.4; q.alx = cls === 'cleric' ? -0.4 : -1.5 - k * 0.4; q.arz = -0.25; q.alz = 0.25; q.bx = -0.1 - k * 0.08; q.by += k * 0.06; q.hx = -0.15 * k; q.cape = 0.3 + k * 0.4;
      } else if (act === 'stun') { q.hz = Math.sin(t * 9) * 0.3; q.tz = Math.sin(t * 7) * 0.12; q.arx = 0.1; q.alx = 0.1; q.bx = 0.28; q.by = -0.04; }
      if (p.guard) { q.alx = -1.55; q.alz = -0.55; q.arx = -1.25; q.arz = 0.45; q.bx = 0.14; q.by = -0.05; snap = 0.5; }
      if (p.hurt > 0) { const h = Math.min(1, p.hurt / 0.28); q.bx -= 0.42 * h; q.hx = -0.4 * h; q.arx += 0.55 * h; q.alx += 0.65 * h; q.bpz -= 0.1 * h; snap = Math.max(snap, 0.7); }
      body.position.y = J('by', q.by, snap); body.position.z = J('bpz', q.bpz, snap); body.rotation.set(J('bx', q.bx, snap), 0, J('bz', q.bz, snap));
      legL.rotation.x = J('ll', q.ll, snap); legR.rotation.x = J('lr', q.lr, snap);
      torso.rotation.set(0, J('ty', q.ty, snap), J('tz', q.tz, snap)); head.rotation.set(J('hx', q.hx, snap), -cur.ty * 0.6, J('hz', q.hz, snap));
      armR.rotation.set(J('arx', q.arx, snap), 0, J('arz', q.arz, snap)); armL.rotation.set(J('alx', q.alx, snap), 0, J('alz', q.alz, snap));
      if (cape) cape.rotation.x = J('cape', q.cape, 0.2);
      if (robe) robe.rotation.z = mv ? sw * 0.08 : 0;
      root.rotation.z = 0; root.rotation.x = 0; root.position.y = p.y || 0;
      if (act === 'dodge') { body.rotation.x = k * Math.PI * 2; body.position.y = 0.5; legL.rotation.x = legR.rotation.x = 1.6; armR.rotation.x = armL.rotation.x = -2; cur.bx = 0.3; cur.by = 0.2; }
      if (act === 'ko') { const f = Math.min(1, (p.prog || 0) * 2.2), e = eo(f); body.rotation.x = -1.5 * e; body.position.y = 0.2 * e + Math.sin(f * Math.PI) * 0.25; legL.rotation.x = 0.3 * e; legR.rotation.x = -0.15 * e; armR.rotation.set(-2.6 * e, 0, -0.5 * e); armL.rotation.set(-2.4 * e, 0, 0.6 * e); head.rotation.x = -0.3 * e; }
      // sorcerer flames + cast glow
      const fl = 0.85 + Math.sin(t * 17) * 0.12;
      if (orbs) orbs.forEach(o => o.scale.setScalar((act === 'cast' ? 1.2 + k * 0.9 : 0.9) * fl));
      if (act === 'cast' && p.glow) { castGlow.material.color.set(p.glow); castGlow.material.opacity = 0.9; castGlow.scale.setScalar(0.6 + k * 1.4); } else castGlow.material.opacity = 0;
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
