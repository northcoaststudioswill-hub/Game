// Underground Syndicate — 3D character miniatures (built from primitives, animated procedurally) + UI icons
(function () {
  const G = window.G, T = THREE, gfx = G.gfx;

  const BASE = {
    fighter: { armor: 0x8a909c, armor2: 0x4a4e58, trim: 0xb09a5a, cloth: 0x8a1c22, legs: 0x565a66, hair: 0x3a2a20, weapon: 0xdfe6ee },
    rogue: { armor: 0x4a4454, armor2: 0x2c2834, trim: 0x8a7240, cloth: 0x3a3048, legs: 0x3a3642, hair: 0x1a1a1a, weapon: 0xd0d8e2 },
    sorcerer: { armor: 0x8a1c24, armor2: 0x4f1016, trim: 0xe0a844, cloth: 0xa0222a, legs: 0x3a1216, hair: 0x5a1418, weapon: 0xff8a3c },
    cleric: { armor: 0x777480, armor2: 0x45424c, trim: 0xe8c860, cloth: 0xe2dcc8, legs: 0x34323a, hair: 0xd8d2c2, weapon: 0xf0d880 },
    druid: { armor: 0x4a5a34, armor2: 0x2e3a22, trim: 0xc8b070, cloth: 0x5a6e3a, legs: 0x3a3226, hair: 0x6a5a3a, weapon: 0x8a6a3a },
    warlock: { armor: 0x2a1e3a, armor2: 0x181024, trim: 0x8aff9a, cloth: 0x32204a, legs: 0x1a1422, hair: 0x1a1420, weapon: 0xb070ff }
  };
  const TRIM = [null, 0xd0d8e4, 0xffd36b], WGLOW = [0x000000, 0x2a9ab8, 0xb8862a], WCOL = [null, 0x8fe8ff, 0xffd36b];
  const hex = v => typeof v === 'string' ? parseInt(v.slice(1), 16) : v;

  // A figure is built from dozens of small boxes. Pieces that hang off the same joint and share a material never move
  // against each other, so they are welded into one mesh: the same look and the same animation for far fewer draw calls.
  const _m4 = new T.Matrix4(), _n3 = new T.Matrix3(), _v = new T.Vector3();
  function slim(root) {
    const groups = []; root.traverse(o => { if (o.children && o.children.length > 1) groups.push(o); });
    groups.forEach(g => { const by = new Map();
      g.children.forEach(c => { if (!c.isMesh || c.children.length || c.userData.keep || !c.visible || Array.isArray(c.material) || c.material.transparent || c.material.map || c.material.blending !== T.NormalBlending || !c.geometry.attributes.normal) return; const k = c.material.uuid; (by.get(k) || by.set(k, []).get(k)).push(c); });
      by.forEach(list => { if (list.length < 2) return; let n = 0; const parts = list.map(c => { c.updateMatrix(); const ge = c.geometry.index ? c.geometry.toNonIndexed() : c.geometry; n += ge.attributes.position.count; return [c, ge]; });
        const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0, shadow = false;
        parts.forEach(([c, ge]) => { _m4.copy(c.matrix); _n3.getNormalMatrix(_m4); const p = ge.attributes.position, q = ge.attributes.normal; shadow = shadow || c.castShadow;
          for (let i = 0; i < p.count; i++, o += 3) { _v.fromBufferAttribute(p, i).applyMatrix4(_m4); pos[o] = _v.x; pos[o + 1] = _v.y; pos[o + 2] = _v.z; _v.fromBufferAttribute(q, i).applyMatrix3(_n3).normalize(); nor[o] = _v.x; nor[o + 1] = _v.y; nor[o + 2] = _v.z; }
          g.remove(c); if (ge !== c.geometry) ge.dispose(); });
        const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('normal', new T.BufferAttribute(nor, 3)); const mm = new T.Mesh(geo, list[0].material); mm.castShadow = shadow; mm.receiveShadow = list[0].receiveShadow; g.add(mm); }); });
  }
  G.makeChar = function (look) {
    const rcls = look.cls, cls = ({ druid: 'cleric', warlock: 'sorcerer' })[rcls] || rcls, race = G.RACES[look.race], g = look.gear || {};      // new callings wear an older one's frame
    const P = Object.assign({}, BASE[rcls]); if (look.race === 'drow') P.hair = 0xe8e8f0;
    if (look.tint) Object.keys(look.tint).forEach(k => P[k] = hex(look.tint[k]));
    const cos = look.cos || {}, wsk = cos.weapon && G.WSKIN && G.WSKIN[cos.weapon];
    if (cos.dye && G.DYES && G.DYES[cos.dye]) Object.assign(P, G.DYES[cos.dye]);
    if (wsk) P.weapon = wsk.color;
    if (TRIM[g.armor]) P.trim = TRIM[g.armor];
    const mats = [];
    const M = (color, shiny, emissive) => {
      const m = shiny ? new T.MeshPhongMaterial({ color, flatShading: true, shininess: 60, specular: 0x666666 }) : new T.MeshLambertMaterial({ color, flatShading: true });
      m.emissive = new T.Color(emissive || 0); m.userData.e = m.emissive.clone(); mats.push(m); return m;
    };
    const m = { skin: M(hex(look.skin || race.skin)), armor: M(P.armor, true), armor2: M(P.armor2, true), trim: M(P.trim, true), cloth: M(P.cloth), legs: M(P.legs), hair: M(P.hair), dark: M(0x15131a), weapon: M(P.weapon, true, wsk ? wsk.e : WGLOW[g.weapon || 0]) };
    const box = gfx.box, mesh = gfx.mesh;
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const robed = cls === 'sorcerer' || cls === 'cleric';
    const w = { fighter: 0.74, rogue: 0.54, sorcerer: 0.56, cleric: 0.66 }[cls];
    const glows = [];

    // legs
    const legL = new T.Group(), legR = new T.Group(); legL.position.set(0.17, 0.62, 0); legR.position.set(-0.17, 0.62, 0); body.add(legL, legR);
    const legMat = robed ? m.dark : m.legs;
    [legL, legR].forEach(l => { box(0.25, 0.32, 0.29, legMat, 0, -0.15, 0, l);                                  // thigh
      const sh = new T.Group(); sh.position.y = -0.3; l.add(sh); l.userData.shin = sh;                            // the knee
      mesh(new T.SphereGeometry(0.125, 6, 5), cls === 'fighter' ? m.armor2 : legMat, 0, 0, 0.03, sh);            // kneecap
      box(0.21, 0.24, 0.25, legMat, 0, -0.13, 0, sh);                                                           // shin
      box(0.26, 0.1, 0.3, m.dark, 0, -0.2, 0.01, sh); box(0.27, 0.13, 0.4, m.dark, 0, -0.275, 0.06, sh);        // boot shaft and foot
      box(0.25, 0.09, 0.12, m.armor2, 0, -0.27, 0.23, sh); box(0.29, 0.035, 0.43, m.dark, 0, -0.335, 0.055, sh); });   // toe cap, sole
    // torso
    const torso = new T.Group(); torso.position.y = 0.6; body.add(torso);
    box(w, 0.38, 0.44, m.armor, 0, 0.47, 0, torso); box(w * 0.84, 0.3, 0.38, m.armor, 0, 0.16, 0, torso);       // chest, then a waist
    box(w * 0.86 + 0.03, 0.11, 0.42, m.armor2, 0, 0.06, 0, torso); box(0.13, 0.13, 0.04, m.trim, 0, 0.06, 0.215, torso);   // belt and buckle
    box(w * 0.82, 0.2, 0.36, robed ? m.cloth : m.legs, 0, -0.06, 0, torso);                                     // hips, so the legs join something
    mesh(new T.CylinderGeometry(0.1, 0.12, 0.14, 7), m.skin, 0, 0.7, 0, torso);                                  // neck
    [-1, 1].forEach(sd => mesh(new T.SphereGeometry(0.13, 6, 5), cls === 'sorcerer' ? m.cloth : m.armor2, sd * (w / 2 + 0.08), 0.57, 0, torso));   // shoulder joints
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
    { const white = new T.MeshLambertMaterial({ color: 0xe9e4d8 }), eyeC = { elf: 0x3aa06a, tiefling: 0xffb020, halforc: 0x8a2a1a, dwarf: 0x4a3a2a, drow: 0xff3a4a }[look.race] || 0x2a3a5a, iris = new T.MeshBasicMaterial({ color: look.race === 'tiefling' || look.race === 'drow' ? eyeC : 0x15131a });
      [-1, 1].forEach(sd => { box(0.085, 0.062, 0.03, white, sd * 0.1, 0.035, 0.232, head).castShadow = false; box(0.042, 0.052, 0.02, iris, sd * 0.095, 0.033, 0.25, head).castShadow = false;
        const br = box(0.11, 0.028, 0.04, m.hair, sd * 0.1, 0.09, 0.238, head); br.rotation.z = -sd * 0.16; br.castShadow = false;
        mesh(new T.SphereGeometry(0.055, 5, 4), m.skin, sd * 0.255, 0.0, 0.0, head).scale.set(0.5, 1, 0.8); });                        // ears
      box(0.05, 0.075, 0.06, m.skin, 0, -0.025, 0.262, head).castShadow = false;                                                      // nose
      box(0.1, 0.016, 0.02, m.dark, 0, -0.105, 0.24, head).castShadow = false;                                                        // mouth
      box(0.2, 0.1, 0.16, m.skin, 0, -0.19, 0.11, head).castShadow = false; }                                                         // jaw
    const cap = (mat, r) => mesh(new T.SphereGeometry(r || 0.3, 9, 5, 0, Math.PI * 2, 0, Math.PI * 0.55), mat, 0, 0.01, 0, head);
    if (cls === 'fighter') { cap(m.armor, 0.31); box(0.06, 0.26, 0.06, m.armor, 0, 0, 0.28, head); box(0.07, 0.24, 0.36, m.cloth, 0, 0.38, -0.04, head); }
    if (cls === 'rogue') { cap(m.cloth, 0.31); box(0.46, 0.44, 0.14, m.cloth, 0, -0.08, -0.22, head); box(0.4, 0.15, 0.1, m.armor2, 0, -0.12, 0.2, head); const tip = mesh(new T.ConeGeometry(0.12, 0.3, 5), m.cloth, 0, 0.3, -0.12, head); tip.rotation.x = -0.9; }
    if (rcls === 'warlock') { mesh(new T.SphereGeometry(0.34, 9, 6, 0, Math.PI * 2, 0, Math.PI * 0.62), m.cloth, 0, 0.02, -0.04, head).rotation.x = -0.3; box(0.5, 0.5, 0.14, m.cloth, 0, -0.12, -0.24, head); mesh(new T.ConeGeometry(0.1, 0.3, 5), m.cloth, 0, 0.3, -0.2, head).rotation.x = -1.1; [-1, 1].forEach(sd => { const e = new T.Mesh(new T.SphereGeometry(0.03, 5, 4), new T.MeshBasicMaterial({ color: 0x8aff9a })); e.position.set(sd * 0.095, 0.033, 0.262); head.add(e); }); }
    else if (cls === 'sorcerer') { cap(m.hair, 0.29); box(0.42, 0.55, 0.12, m.hair, 0, -0.2, -0.22, head); for (let i = 0; i < 5; i++) { const a = -1 + i * 0.5; mesh(new T.ConeGeometry(0.045, i === 2 ? 0.26 : 0.18, 4), m.trim, Math.sin(a) * 0.24, 0.3, Math.cos(a) * 0.2, head); } }
    if (cls === 'cleric') {
      cap(m.cloth, 0.31); box(0.46, 0.46, 0.14, m.cloth, 0, -0.1, -0.22, head);
      if (rcls === 'druid') { [-1, 1].forEach(sd => { const a = new T.Group(); a.position.set(sd * 0.16, 0.26, 0); a.rotation.z = -sd * 0.5; head.add(a); const horn = new T.MeshLambertMaterial({ color: 0xd8c8a0, flatShading: true }); mesh(new T.CylinderGeometry(0.022, 0.035, 0.34, 5), horn, 0, 0.16, 0, a); const t1 = mesh(new T.CylinderGeometry(0.015, 0.022, 0.18, 4), horn, sd * 0.06, 0.24, 0, a); t1.rotation.z = -sd * 0.8; const t2 = mesh(new T.CylinderGeometry(0.015, 0.02, 0.14, 4), horn, -sd * 0.04, 0.3, 0.03, a); t2.rotation.z = sd * 0.6; }); const leaf = new T.MeshLambertMaterial({ color: 0x4f7a34, flatShading: true }); [-1, 1].forEach(sd => [0, 1, 2].forEach(k => { const l = mesh(new T.ConeGeometry(0.11, 0.26, 4), leaf, sd * (w / 2 + 0.02 + k * 0.05), 0.68 - k * 0.05, (k - 1) * 0.12, torso); l.rotation.z = sd * (1.2 + k * 0.2); })); }
      else {
      const halo = new T.Mesh(new T.TorusGeometry(0.27, 0.03, 6, 18), new T.MeshBasicMaterial({ color: 0xffe08a })); halo.rotation.x = Math.PI / 2; halo.position.y = 0.48; head.add(halo);
      glows.push(gfx.glow(0xffc860, 1.1, 0, 0.48, 0, head, 0.45));
      }
    }
    if (look.race === 'elf' || look.race === 'drow') [-1, 1].forEach(sd => { const e = mesh(new T.ConeGeometry(0.06, 0.26, 4), m.skin, sd * 0.27, 0.06, -0.02, head); e.rotation.z = -sd * 0.9; });
    if (look.race === 'tiefling') [-1, 1].forEach(sd => { const e = mesh(new T.ConeGeometry(0.07, 0.38, 5), m.dark, sd * 0.17, 0.3, 0.06, head); e.rotation.x = -0.6; e.rotation.z = -sd * 0.35; });
    if (look.race === 'halforc') [-1, 1].forEach(sd => mesh(new T.ConeGeometry(0.035, 0.12, 4), new T.MeshLambertMaterial({ color: 0xf2ead8 }), sd * 0.09, -0.12, 0.23, head));
    if (look.race === 'dwarf') box(0.34, 0.32, 0.16, m.hair, 0, -0.24, 0.17, head);

    // arms: model faces +Z, weapon hand is on -X
    const armR = new T.Group(), armL = new T.Group(); armR.position.set(-(w / 2 + 0.11), 0.56, 0); armL.position.set(w / 2 + 0.11, 0.56, 0); torso.add(armR, armL);
    const sleeve = cls === 'sorcerer' ? m.cloth : m.armor2;
    [armR, armL].forEach((a, i) => { box(0.2, 0.28, 0.22, sleeve, 0, -0.12, 0, a);                                 // upper arm
      const f = new T.Group(); f.position.y = -0.27; a.add(f); a.userData.fore = f;                                 // the elbow
      mesh(new T.SphereGeometry(0.105, 6, 5), sleeve, 0, 0, -0.01, f);
      box(0.18, 0.24, 0.2, sleeve, 0, -0.11, 0, f);                                                                // forearm
      if (cls === 'fighter' || cls === 'cleric') box(0.215, 0.1, 0.235, m.trim, 0, -0.17, 0, f);                   // gauntlet cuff
      else if (cls === 'rogue') box(0.2, 0.14, 0.22, m.dark, 0, -0.14, 0, f);                                      // wrapped wrists
      box(0.13, 0.12, 0.16, cls === 'fighter' ? m.armor2 : m.skin, 0, -0.27, 0.01, f); box(0.05, 0.06, 0.08, cls === 'fighter' ? m.armor2 : m.skin, (i ? -1 : 1) * 0.075, -0.25, 0.05, f); });   // palm and thumb
    const foreR = armR.userData.fore, foreL = armL.userData.fore;
    const hand = (arm) => { const h = new T.Group(); h.position.y = -0.25; arm.userData.fore.add(h); return h; };
    const hR = hand(armR), hL = hand(armL);
    const blade = (h, len) => { box(0.09, 0.04, len, m.weapon, 0, 0, len / 2 + 0.1, h); box(0.3, 0.07, 0.07, m.trim, 0, 0, 0.1, h); if (g.weapon || wsk) glows.push(gfx.glow(wsk ? wsk.glow : WCOL[g.weapon], 0.7, 0, 0, len * 0.6, h, 0.55)); };
    const arm = look.arm ? String(look.arm).split('_')[1] : '', wglow = (z, hh) => { if (g.weapon || wsk) glows.push(gfx.glow(wsk ? wsk.glow : WCOL[g.weapon], 0.7, 0, 0, z, hh, 0.55)); };
    const wc = ({ axe: 'fighter', halberd: 'fighter', hammer: 'fighter', spear: 'fighter', rapier: 'rogue', chain: 'rogue', axes: 'rogue', flail: 'cleric', staff: 'cleric', pick: 'cleric' })[arm] || cls;      // any frame can carry any shape of weapon
    const shaft = (hh, len, z0) => { const s = mesh(new T.CylinderGeometry(0.035, 0.035, len, 5), m.dark, 0, 0, (z0 || 0) + len / 2, hh); s.rotation.x = Math.PI / 2; return s; };
    if (wc === 'fighter' && arm === 'axe') { shaft(hR, 1.25, -0.15); box(0.05, 0.42, 0.34, m.weapon, 0, 0.14, 0.95, hR); box(0.05, 0.2, 0.2, m.weapon, 0, -0.12, 0.95, hR); box(0.08, 0.1, 0.12, m.trim, 0, 0, 0.95, hR); wglow(0.95, hR); }
    else if (wc === 'fighter' && arm === 'halberd') { shaft(hR, 2.0, -0.55); box(0.05, 0.42, 0.3, m.weapon, 0, 0.15, 1.22, hR); box(0.05, 0.14, 0.18, m.weapon, 0, -0.1, 1.2, hR); const tp = mesh(new T.ConeGeometry(0.06, 0.34, 4), m.weapon, 0, 0, 1.6, hR); tp.rotation.x = Math.PI / 2; box(0.1, 0.1, 0.12, m.trim, 0, 0, 1.2, hR); wglow(1.3, hR); }
    else if (wc === 'fighter' && arm === 'hammer') { shaft(hR, 1.1, -0.1); box(0.24, 0.24, 0.4, m.weapon, 0, 0, 0.95, hR); box(0.27, 0.27, 0.08, m.trim, 0, 0, 0.78, hR); box(0.27, 0.27, 0.08, m.trim, 0, 0, 1.12, hR); wglow(0.95, hR); }
    else if (wc === 'fighter' && arm === 'spear') {
      shaft(hR, 1.9, -0.5); const tip = mesh(new T.ConeGeometry(0.08, 0.36, 4), m.weapon, 0, 0, 1.56, hR); tip.rotation.x = Math.PI / 2; box(0.16, 0.05, 0.05, m.trim, 0, 0, 1.36, hR); wglow(1.5, hR);
      const sh = mesh(new T.CylinderGeometry(0.4, 0.4, 0.07, 6), m.armor2, 0.1, -0.05, 0.12, foreL); sh.rotation.z = Math.PI / 2; sh.scale.z = 0.85;
    }
    else if (wc === 'fighter') {
      blade(hR, 1.0);
      const sh = mesh(new T.CylinderGeometry(0.4, 0.4, 0.07, 6), m.armor2, 0.1, -0.05, 0.12, foreL); sh.rotation.z = Math.PI / 2; sh.scale.z = 0.85;
      const boss = mesh(new T.CylinderGeometry(0.16, 0.16, 0.1, 6), m.trim, 0.14, -0.05, 0.12, foreL); boss.rotation.z = Math.PI / 2;
    }
    if (wc === 'rogue' && arm === 'rapier') { box(0.04, 0.03, 1.0, m.weapon, 0, 0, 0.6, hR); const cup = mesh(new T.SphereGeometry(0.1, 7, 5, 0, 6.28, 0, 1.6), m.trim, 0, 0, 0.12, hR); cup.rotation.x = Math.PI / 2; wglow(0.7, hR); blade(hL, 0.32); }
    else if (wc === 'rogue' && arm === 'chain') { for (let i = 0; i < 8; i++) box(0.05, 0.05, 0.09, m.dark, Math.sin(i * 1.3) * 0.04, -i * 0.02, 0.15 + i * 0.13, hR); mesh(new T.IcosahedronGeometry(0.12, 0), m.weapon, 0, -0.16, 1.22, hR); wglow(1.2, hR); blade(hL, 0.32); }
    else if (wc === 'rogue' && arm === 'axes') [hR, hL].forEach(hh => { shaft(hh, 0.5, -0.05); box(0.04, 0.24, 0.2, m.weapon, 0, 0.1, 0.4, hh); box(0.06, 0.07, 0.1, m.trim, 0, 0, 0.4, hh); wglow(0.4, hh); });
    else if (wc === 'rogue') { blade(hR, 0.5); blade(hL, 0.5); }
    if (wc === 'cleric' && arm === 'flail') { shaft(hR, 0.55, 0); [0.62, 0.72, 0.82].forEach((z, i) => box(0.04, 0.04, 0.07, m.dark, 0, -i * 0.05, z, hR)); mesh(new T.IcosahedronGeometry(0.16, 0), M(P.weapon, true, 0x7a5a10), 0, -0.2, 0.95, hR); for (let i = 0; i < 6; i++) { const sp = mesh(new T.ConeGeometry(0.035, 0.12, 4), m.trim, Math.cos(i) * 0.15, -0.2 + Math.sin(i * 2.1) * 0.15, 0.95 + Math.sin(i) * 0.15, hR); sp.rotation.set(i, i * 2, 0); } glows.push(gfx.glow((wsk && wsk.glow) || WCOL[g.weapon] || 0xffd060, 0.9, 0, -0.2, 0.95, hR, 0.55)); }
    else if (wc === 'cleric' && arm === 'staff') { shaft(hR, 1.9, -0.7); const rg = mesh(new T.TorusGeometry(0.1, 0.025, 5, 10), m.trim, 0, 0, 1.12, hR); mesh(new T.OctahedronGeometry(0.13, 0), M(P.weapon, true, 0x7a5a10), 0, 0, 1.3, hR); glows.push(gfx.glow((wsk && wsk.glow) || WCOL[g.weapon] || 0xffd060, 0.9, 0, 0, 1.3, hR, 0.55)); }
    else if (wc === 'cleric' && arm === 'pick') { shaft(hR, 0.95, -0.05); box(0.07, 0.56, 0.08, M(P.weapon, true, 0x7a5a10), 0, 0.06, 0.82, hR); const pt = mesh(new T.ConeGeometry(0.05, 0.22, 4), M(P.weapon, true, 0x7a5a10), 0, 0.44, 0.82, hR); box(0.12, 0.12, 0.12, m.trim, 0, 0, 0.82, hR); glows.push(gfx.glow((wsk && wsk.glow) || WCOL[g.weapon] || 0xffd060, 0.8, 0, 0.2, 0.82, hR, 0.5)); }
    else if (wc === 'cleric') {
      const hd = mesh(new T.CylinderGeometry(0.035, 0.035, 0.8, 5), m.dark, 0, 0, 0.35, hR); hd.rotation.x = Math.PI / 2;
      mesh(new T.IcosahedronGeometry(0.17, 0), M(P.weapon, true, 0x7a5a10), 0, 0, 0.78, hR);
      glows.push(gfx.glow((wsk && wsk.glow) || WCOL[g.weapon] || 0xffd060, 1.0, 0, 0, 0.78, hR, 0.6));
    }
    let orbs = null;
    if (cls === 'sorcerer') {
      const oc = (wsk && wsk.glow) || WCOL[g.weapon] || (arm === 'frost' ? 0x9fe0ff : arm === 'spark' ? 0xfff070 : arm === 'acid' ? 0x9be35a : 0xff8a3c);
      orbs = [hR, hL].map(h => { const o = new T.Mesh(new T.SphereGeometry(0.1, 8, 6), new T.MeshBasicMaterial({ color: 0xfff0c0 })); o.position.z = 0.08; h.add(o); const gl = gfx.glow(oc, 0.9, 0, 0, 0.08, h, 0.9); glows.push(gl); return gl; });
    }
    const castGlow = gfx.glow(0xffffff, 0.1, 0, 0, 0.2, hR, 0);

    // ---- outfit upgrades: armour tiers add real plates, not just a trim colour
    if (g.armor >= 1) {
      [armR, armL].forEach(a => { box(0.23, 0.18, 0.25, m.trim, 0, -0.1, 0, a.userData.fore); box(0.25, 0.05, 0.27, m.armor, 0, -0.2, 0, a); });
      [legL, legR].forEach(l => { box(0.28, 0.17, 0.33, m.trim, 0, -0.16, 0.02, l); box(0.25, 0.16, 0.29, m.trim, 0, -0.12, 0.02, l.userData.shin); });
      box(w * 0.74, 0.07, 0.05, m.trim, 0, 0.56, 0.22, torso); box(w * 0.5, 0.07, 0.05, m.trim, 0, 0.22, 0.22, torso); box(w * 0.74, 0.07, 0.05, m.trim, 0, 0.4, -0.22, torso);
    }
    if (g.armor >= 2) {
      [-1, 1].forEach(sd => { const sp = mesh(new T.ConeGeometry(0.07, 0.32, 4), m.trim, sd * (w / 2 + 0.1), 0.88, 0, torso); sp.rotation.z = -sd * 0.5; box(0.06, 0.5, 0.05, m.trim, sd * w * 0.3, 0.34, 0.225, torso); });
      const gem = new T.Mesh(new T.OctahedronGeometry(0.09), new T.MeshBasicMaterial({ color: 0xff5a4a })); gem.position.set(0, 0.44, 0.26); torso.add(gem); glows.push(gfx.glow(0xff5a4a, 0.5, 0, 0.44, 0.3, torso, 0.6));
      box(0.22, 0.5, 0.04, m.trim, 0, -0.2, 0.24, torso); box(w + 0.08, 0.06, 0.48, m.trim, 0, 0.0, 0, torso);
    }
    if (g.weapon >= 1 && (cls === 'fighter' || cls === 'rogue')) { box(0.36, 0.05, 0.1, m.trim, 0, 0, 0.14, hR); mesh(new T.SphereGeometry(0.06, 6, 5), m.trim, 0, 0, -0.06, hR); }
    if (g.weapon >= 2) { const gm = new T.Mesh(new T.OctahedronGeometry(0.075), new T.MeshBasicMaterial({ color: 0x6ad0ff })); gm.position.set(0, 0.03, cls === 'cleric' ? 0.56 : 0.1); hR.add(gm); glows.push(gfx.glow(0x6ad0ff, 0.45, 0, 0.03, cls === 'cleric' ? 0.56 : 0.1, hR, 0.7)); }
    // ---- cosmetics bought from the Tailor
    const bone = () => M(0xe8dfc8), gold = () => M(0xf0c95a, true, 0x4a3406);
    if (cos.head === 'horned') [-1, 1].forEach(sd => { const a = mesh(new T.ConeGeometry(0.09, 0.42, 5), bone(), sd * 0.3, 0.2, 0, head); a.rotation.z = -sd * 1.0; const b = mesh(new T.ConeGeometry(0.06, 0.34, 5), bone(), sd * 0.5, 0.42, 0, head); b.rotation.z = -sd * 0.25; });
    if (cos.head === 'plague') { const bk = mesh(new T.ConeGeometry(0.11, 0.5, 5), M(0x2a2420), 0, -0.06, 0.42, head); bk.rotation.x = Math.PI / 2; [-1, 1].forEach(sd => { const e = new T.Mesh(new T.SphereGeometry(0.065, 8, 6), new T.MeshBasicMaterial({ color: 0x9fe8ff })); e.position.set(sd * 0.11, 0.05, 0.23); head.add(e); }); mesh(new T.CylinderGeometry(0.36, 0.36, 0.04, 10), M(0x1c1814), 0, 0.2, 0, head); mesh(new T.CylinderGeometry(0.2, 0.22, 0.2, 8), M(0x1c1814), 0, 0.3, 0, head); }
    if (cos.head === 'skull') { const sk = mesh(new T.SphereGeometry(0.29, 9, 7, 0, Math.PI), bone(), 0, 0.02, 0.02, head); box(0.09, 0.09, 0.05, m.dark, 0.1, 0.05, 0.27, head); box(0.09, 0.09, 0.05, m.dark, -0.1, 0.05, 0.27, head); for (let i = -2; i <= 2; i++) box(0.035, 0.07, 0.03, bone(), i * 0.05, -0.2, 0.24, head); }
    if (cos.head === 'laurel') { const gm = gold(); for (let i = 0; i < 12; i++) { const a = 0.5 + i * 0.47; if (a > 2.6 && a < 3.7) continue; const lf = mesh(new T.ConeGeometry(0.05, 0.16, 3), gm, Math.sin(a) * 0.3, 0.14, Math.cos(a) * 0.3, head); lf.rotation.set(0.6 * Math.cos(a), 0, -0.6 * Math.sin(a)); } }
    if (cos.head === 'crown') { const gm = gold(); mesh(new T.CylinderGeometry(0.27, 0.25, 0.12, 8, 1, true), gm, 0, 0.3, 0, head).material.side = T.DoubleSide; for (let i = 0; i < 6; i++) mesh(new T.ConeGeometry(0.05, 0.18, 4), gm, Math.cos(i * 1.047) * 0.26, 0.44, Math.sin(i * 1.047) * 0.26, head); const j = new T.Mesh(new T.OctahedronGeometry(0.05), new T.MeshBasicMaterial({ color: 0xc22a22 })); j.position.set(0, 0.31, 0.27); head.add(j); }
    if (cos.back === 'pack') { const br = mesh(new T.CylinderGeometry(0.14, 0.14, 0.6, 7), M(0x6a5a40), 0, 0.5, -0.32, torso); br.rotation.z = Math.PI / 2; box(0.16, 0.5, 0.14, M(0x4a3020), 0.2, 0.3, -0.3, torso).rotation.z = -0.3; for (let i = 0; i < 3; i++) mesh(new T.CylinderGeometry(0.012, 0.012, 0.3, 3), bone(), 0.26 + i * 0.03, 0.62, -0.3, torso).rotation.z = -0.3; }
    if (cos.back === 'greatcloak') { const gcl = new T.Group(); gcl.position.set(0, 0.64, -0.24); torso.add(gcl); box(w * 1.25, 1.25, 0.07, m.cloth, 0, -0.6, 0, gcl); box(w * 1.35, 0.2, 0.3, M(0x8a7a66), 0, 0.0, 0.1, gcl); gcl.rotation.x = 0.14; if (!cape) cape = gcl; else cape.visible = false, cape = gcl; }
    if (cos.back === 'banner') { mesh(new T.CylinderGeometry(0.03, 0.03, 1.9, 5), m.dark, 0, 1.1, -0.28, torso); box(0.5, 0.04, 0.04, m.dark, 0.2, 2.0, -0.28, torso); const bn = new T.Mesh(new T.PlaneGeometry(0.5, 0.95), new T.MeshLambertMaterial({ map: gfx.bannerTex('#' + P.cloth.toString(16).padStart(6, '0'), '#d9a93c'), transparent: true, alphaTest: 0.5, side: T.DoubleSide })); bn.position.set(0.22, 1.5, -0.28); torso.add(bn); }
    if (cos.back === 'wings') [-1, 1].forEach(sd => { const wg = new T.Group(); wg.position.set(sd * 0.12, 0.5, -0.24); wg.rotation.y = sd * 0.5; torso.add(wg); for (let i = 0; i < 5; i++) { const f = box(0.16, 0.75 - i * 0.07, 0.03, M(0x16141c), sd * (0.16 + i * 0.15), 0.12 - i * 0.05, -i * 0.02, wg); f.rotation.z = -sd * (0.5 + i * 0.22); } });
    if (cos.head === 'widehat') { mesh(new T.CylinderGeometry(0.52, 0.52, 0.04, 12), m.dark, 0, 0.24, 0, head); mesh(new T.CylinderGeometry(0.24, 0.28, 0.22, 10), m.dark, 0, 0.36, 0, head); box(0.5, 0.05, 0.02, m.trim, 0, 0.28, 0.27, head); const fe = mesh(new T.ConeGeometry(0.05, 0.6, 4), M(0xc22a22), -0.28, 0.5, -0.1, head); fe.rotation.set(0.5, 0, 0.7); }
    if (cos.head === 'jester') [[-0.26, 0.9, 0x7a1c22], [0, 0, 0xd9a93c], [0.26, -0.9, 0x245a44]].forEach(q => { const pt = mesh(new T.ConeGeometry(0.13, 0.5, 5), M(q[2]), q[0], 0.38, 0, head); pt.rotation.z = q[1] * 0.7; const bl = new T.Mesh(new T.SphereGeometry(0.06, 6, 5), new T.MeshBasicMaterial({ color: 0xffd36b })); bl.position.set(q[0] * 1.9, 0.52 - Math.abs(q[1]) * 0.12, 0); head.add(bl); });
    if (cos.head === 'antlers') [-1, 1].forEach(sd => { const bn = bone(), st = mesh(new T.CylinderGeometry(0.035, 0.05, 0.6, 5), bn, sd * 0.24, 0.5, 0, head); st.rotation.z = -sd * 0.5; [[0.36, 0.62, 0.9], [0.44, 0.8, 0.3], [0.3, 0.86, -0.4]].forEach(q => { const t = mesh(new T.ConeGeometry(0.03, 0.26, 4), bn, sd * q[0], q[1], 0, head); t.rotation.z = -sd * q[2]; }); });
    if (cos.head === 'thorns') { const ir = M(0x1c1a20, true); const rg = mesh(new T.TorusGeometry(0.29, 0.035, 5, 14), ir, 0, 0.2, 0, head); rg.rotation.x = Math.PI / 2; for (let i = 0; i < 10; i++) { const a = i * 0.628, sp = mesh(new T.ConeGeometry(0.03, 0.2, 4), ir, Math.cos(a) * 0.3, 0.26, Math.sin(a) * 0.3, head); sp.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9); } }
    if (cos.head === 'lucky') { const gm = M(0x8aff9a, true, 0x1a6a2a); for (let i = 0; i < 12; i++) { const a = 0.5 + i * 0.47; if (a > 2.6 && a < 3.7) continue; const lf = mesh(new T.ConeGeometry(0.05, 0.16, 3), gm, Math.sin(a) * 0.3, 0.14, Math.cos(a) * 0.3, head); lf.rotation.set(0.6 * Math.cos(a), 0, -0.6 * Math.sin(a)); } glows.push(gfx.glow(0x8aff9a, 0.9, 0, 0.2, 0, head, 0.35)); }
    if (cos.back === 'greatsword') { const gs = new T.Group(); gs.position.set(0, 0.5, -0.3); gs.rotation.z = 0.6; torso.add(gs); box(0.13, 1.5, 0.04, M(0xcfd8e0, true), 0, 0.2, 0, gs); box(0.46, 0.08, 0.08, m.trim, 0, -0.52, 0, gs); box(0.08, 0.3, 0.07, m.dark, 0, -0.7, 0, gs); }
    if (cos.back === 'lanternpole') { mesh(new T.CylinderGeometry(0.03, 0.03, 2.1, 5), m.dark, -0.2, 1.2, -0.28, torso); box(0.4, 0.04, 0.04, m.dark, 0, 2.2, -0.28, torso); const lb = new T.Mesh(new T.BoxGeometry(0.2, 0.26, 0.2), new T.MeshBasicMaterial({ color: 0xfff0c8 })); lb.position.set(0.2, 2.02, -0.28); torso.add(lb); glows.push(gfx.glow(0xffb060, 1.6, 0.2, 2.0, -0.28, torso, 0.7)); }
    if (cos.back === 'skullrack') [-0.28, 0, 0.28].forEach((x, i) => { mesh(new T.CylinderGeometry(0.025, 0.025, 0.9 + (i === 1 ? 0.25 : 0), 4), m.dark, x, 1.0 + (i === 1 ? 0.12 : 0), -0.28, torso); const sk = mesh(new T.SphereGeometry(0.13, 7, 5), bone(), x, 1.5 + (i === 1 ? 0.25 : 0), -0.28, torso); sk.scale.set(1, 0.9, 1.1); box(0.05, 0.05, 0.03, m.dark, x - 0.05, 1.52 + (i === 1 ? 0.25 : 0), -0.16, torso); box(0.05, 0.05, 0.03, m.dark, x + 0.05, 1.52 + (i === 1 ? 0.25 : 0), -0.16, torso); });
    if (cos.head === 'exechood') { const hm = M(0x0c0a0c); hm.side = T.DoubleSide; const hd = mesh(new T.SphereGeometry(0.37, 9, 7, Math.PI / 2 + 0.3, Math.PI * 2 - 0.6, 0, 2.2), hm, 0, 0.02, -0.02, head); hd.scale.set(1, 1.1, 1.1); const tp = mesh(new T.ConeGeometry(0.2, 0.5, 5), hm, 0, 0.5, -0.05, head); tp.rotation.x = -0.25; [-0.09, 0.09].forEach(x => { const ey = new T.Mesh(new T.SphereGeometry(0.035, 5, 4), new T.MeshBasicMaterial({ color: 0xff4030 })); ey.position.set(x, 0.03, 0.3); head.add(ey); }); }
    if (cos.back === 'pennants') [-0.22, 0.22].forEach((x, i) => { mesh(new T.CylinderGeometry(0.02, 0.02, 1.6, 4), m.dark, x, 1.1, -0.28, torso); const fl = new T.Mesh(new T.PlaneGeometry(0.5, 0.32), new T.MeshLambertMaterial({ color: i ? 0xd9a93c : 0x7a1c22, side: T.DoubleSide })); fl.position.set(x + (i ? 0.25 : -0.25), 1.72, -0.28); torso.add(fl); });
    if (cos.head === 'vossband') { const bd = mesh(new T.CylinderGeometry(0.3, 0.3, 0.1, 10, 1, true), M(0x1a8a9a), 0, 0.12, 0, head); bd.material.side = T.DoubleSide; mesh(new T.TorusGeometry(0.07, 0.02, 4, 8), M(0xf0c95a, true), 0, 0.12, 0.31, head); box(0.08, 0.3, 0.02, M(0x1a8a9a), -0.1, -0.02, -0.3, head).rotation.z = 0.2; }
    if (cos.head === 'hood') { const hm = M(0x2a2428); hm.side = T.DoubleSide; const hd = mesh(new T.SphereGeometry(0.37, 9, 7, Math.PI / 2 + 0.75, Math.PI * 2 - 1.5, 0, 2.0), hm, 0, 0.02, -0.03, head); hd.scale.set(1, 1.08, 1.12); const tp = mesh(new T.ConeGeometry(0.16, 0.36, 5), hm, 0, 0.26, -0.3, head); tp.rotation.x = -1.9; }
    if (cos.head === 'mohawk') for (let i = -3; i <= 3; i++) { const a = Math.abs(i), sp = box(0.07, 0.3 - a * 0.045, 0.1, M(0xff3a8a, false, 0x5a0a2a), 0, 0.36 - a * a * 0.022, i * 0.09 - 0.02, head); sp.rotation.x = i * 0.16; }
    if (cos.head === 'candles') { const rg = mesh(new T.TorusGeometry(0.3, 0.03, 5, 12), M(0x1c1a20, true), 0, 0.2, 0, head); rg.rotation.x = Math.PI / 2; for (let i = 0; i < 6; i++) { const a = i * 1.047 + 0.5, cx = Math.cos(a) * 0.3, cz = Math.sin(a) * 0.3, ch = 0.12 + (i % 3) * 0.04; mesh(new T.CylinderGeometry(0.03, 0.035, ch, 5), M(0xefe6cc), cx, 0.22 + ch / 2, cz, head); const fl = new T.Mesh(new T.SphereGeometry(0.03, 5, 4), new T.MeshBasicMaterial({ color: 0xffd080 })); fl.position.set(cx, 0.26 + ch, cz); fl.scale.y = 1.6; head.add(fl); } glows.push(gfx.glow(0xffb060, 1.1, 0, 0.42, 0, head, 0.45)); }
    if (cos.head === 'dicecrown') { const gm = M(0xf0c95a, true, 0x6a4a08); const rg = mesh(new T.CylinderGeometry(0.3, 0.29, 0.12, 10, 1, true), gm, 0, 0.22, 0, head); rg.material.side = T.DoubleSide; for (let i = 0; i < 4; i++) { const a = i * 1.571 + 0.78, d = new T.Mesh(new T.BoxGeometry(0.13, 0.13, 0.13), new T.MeshBasicMaterial({ color: 0x9af6ff, transparent: true, opacity: 0.85 })); d.position.set(Math.cos(a) * 0.3, 0.38, Math.sin(a) * 0.3); d.rotation.set(0.6, a, 0.6); head.add(d); } glows.push(gfx.glow(0x6af0ff, 1.0, 0, 0.4, 0, head, 0.4)); }
    if (cos.back === 'quiver') { const qv = new T.Group(); qv.position.set(0.1, 0.45, -0.3); qv.rotation.z = -0.45; torso.add(qv); mesh(new T.CylinderGeometry(0.11, 0.09, 0.7, 6), M(0x4a2e1a), 0, 0, 0, qv); mesh(new T.CylinderGeometry(0.115, 0.115, 0.05, 6), m.trim, 0, 0.3, 0, qv); [-0.05, 0.02, 0.06].forEach((x, i) => { mesh(new T.CylinderGeometry(0.015, 0.015, 0.7, 4), M(0x8a6a4a), x, 0.55, (i - 1) * 0.04, qv); mesh(new T.ConeGeometry(0.035, 0.12, 4), M(0xcfd8e0, true), x, 0.95, (i - 1) * 0.04, qv); }); }
    if (cos.back === 'ratcage') { const cg = new T.Group(); cg.position.set(0, 0.5, -0.38); torso.add(cg); const ir = M(0x1c1a20, true); box(0.36, 0.03, 0.26, ir, 0, 0.17, 0, cg); box(0.36, 0.03, 0.26, ir, 0, -0.17, 0, cg); for (let i = 0; i < 5; i++) { mesh(new T.CylinderGeometry(0.012, 0.012, 0.34, 4), ir, -0.17 + i * 0.085, 0, -0.12, cg); if (i % 4 === 0) mesh(new T.CylinderGeometry(0.012, 0.012, 0.34, 4), ir, -0.17 + i * 0.085, 0, 0.12, cg); } const rt = mesh(new T.SphereGeometry(0.07, 6, 4), M(0x5a5052), 0, -0.1, 0, cg); rt.scale.set(1.5, 0.9, 1); mesh(new T.SphereGeometry(0.04, 5, 4), M(0x5a5052), 0.11, -0.08, 0, cg); box(0.14, 0.012, 0.012, M(0xc08a8a), -0.16, -0.12, 0, cg); }
    if (cos.back === 'moneybag') { const sk = mesh(new T.SphereGeometry(0.3, 8, 6), M(0x6a5236), 0, 0.42, -0.4, torso); sk.scale.set(1, 1.15, 0.85); mesh(new T.CylinderGeometry(0.1, 0.16, 0.14, 7), M(0x6a5236), 0, 0.78, -0.4, torso); mesh(new T.TorusGeometry(0.11, 0.02, 4, 8), m.trim, 0, 0.74, -0.4, torso).rotation.x = Math.PI / 2; [[-0.06, 0.88, -0.38], [0.05, 0.86, -0.42], [0.0, 0.9, -0.44], [0.2, 0.3, -0.62]].forEach(q => mesh(new T.CylinderGeometry(0.05, 0.05, 0.02, 7), M(0xf0c95a, true, 0x6a4a08), q[0], q[1], q[2], torso).rotation.x = q[0] * 6); }
    let auraM = null;
    if (cos.aura) { const ac = (G.COSMETICS.find(x => x.id === cos.aura) || {}).color || 0xffffff; glows.push(gfx.glow(ac, 2.4, 0, 0.15, 0, root, 0.3)); auraM = [0, 1, 2, 3].map(() => { const s = gfx.glow(ac, 0.3, 0, 0.5, 0, root, 0.9); glows.push(s); return s; }); }
    // what you wear changes your outline, not only your colours
    if (G.kitModel && look.kit) G.kitModel(look.kit, { torso, head, armL, armR, foreL, foreR, legL, legR, m, w, cls, box, mesh, M, robed });
    if (look.race === 'tiefling' && look.kit !== 'ashcloak') { let par = torso, y = 0.02, z = -0.22; for (let i = 0; i < 5; i++) { const sg = new T.Group(); sg.position.set(0, y, z); sg.rotation.x = i ? 0.42 : 0.9; par.add(sg); box(0.09 - i * 0.012, 0.09 - i * 0.012, 0.24, m.skin, 0, 0, -0.1, sg); par = sg; y = 0; z = -0.22; } mesh(new T.ConeGeometry(0.07, 0.16, 4), m.dark, 0, 0, -0.26, par).rotation.x = -Math.PI / 2; }
    const sc = (look.scale || 1) * race.scale, wide = { dwarf: 1.16, halforc: 1.09, elf: 0.93, drow: 0.94 }[look.race] || 1;
    root.scale.set(sc * wide, sc, sc * (look.race === 'elf' ? 0.96 : wide));
    root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });

    let lastAlpha = 1;
    const C = { root, body, mats, height: 1.9 * sc };
    // dismemberment: detach a limb (the caller throws it) and leave a wet stump where it was
    C.limbs = { armL, armR, legL, legR, head }; C.wHand = hR;
    C.sever = function (part) { const g = C.limbs[part]; if (!g || !g.parent || g.userData.gone) return null; g.userData.gone = 1; const st = new T.Mesh(new T.SphereGeometry(part === 'head' ? 0.15 : 0.11, 6, 5), new T.MeshLambertMaterial({ color: 0x7a0a0a, flatShading: true })); st.position.copy(g.position); st.scale.y = 0.55; g.parent.add(st); const bn = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 0.1, 5), new T.MeshLambertMaterial({ color: 0xe6dcc4 })); bn.position.copy(g.position); bn.position.y -= 0.04; g.parent.add(bn); return g; };
    // Joint targets are computed per state, then eased toward, so stances blend instead of snapping.
    let cur = {}, dtp = 1 / 60, lastPT = null, fresh = 0;
    const CAP = { arx: 30, arz: 30, alx: 30, alz: 30, ll: 22, lr: 22, bx: 12, bz: 10, ty: 16, tz: 12, hx: 14, hz: 14, by: 4.5, bpz: 4.5, kl: 26, kr: 26, er: 30, el: 30, cape: 20 };
    const J = (k, v, s) => { if (cur[k] == null) return (cur[k] = v); const a = 1 - Math.pow(1 - Math.min(0.999, s), dtp * 60), m = (CAP[k] || 30) * dtp; let d = (v - cur[k]) * a; if (d > m) d = m; else if (d < -m) d = -m; return (cur[k] += d); };
    const mix = G.lerp, eo = x => 1 - Math.pow(1 - x, 3), ei = x => x * x;
    const restL = cls === 'fighter' ? -0.9 : cls === 'rogue' || cls === 'sorcerer' ? -0.5 : 0.05;
    const FAM = { axe: 'heavy', hammer: 'heavy', pick: 'heavy', spear: 'pole', halberd: 'pole', staff: 'pole', rapier: 'fence', axes: 'dual', chain: 'swing', flail: 'swing', frost: 'orb', spark: 'orb', acid: 'orb' }[arm] || (cls === 'rogue' ? 'dual' : cls === 'sorcerer' ? 'orb' : '');
    let side = 1, prevHurt = 0, spinNow = 0;
    // pose: {moving, walk, act:'idle|swing|cast|stun|dodge|ko', prog, step (combo step), hurt, guard, flash, alpha, t, glow}
    C.pose = function (p) {
      const t = p.t || 0, act = p.act || 'idle', mv = p.moving && act !== 'ko' && act !== 'dodge';
      if (fresh === 1) { cur = {}; fresh = 2; }       // a figure posed once (a portrait, a stall-keeper) takes its pose outright
      dtp = lastPT == null || t <= lastPT || t - lastPT > 0.2 ? 1 / 60 : Math.max(1 / 240, t - lastPT); lastPT = t;
      const sw = mv ? Math.sin(p.walk) : 0, k = Math.max(0, Math.min(1, p.prog || 0));
      const q = { by: Math.sin(t * 2.4) * 0.015, bx: 0.06, bz: Math.sin(t * 1.2) * 0.02, bpz: 0, ll: 0.05, lr: -0.05, ty: Math.sin(t * 1.2) * 0.04, tz: 0, hx: 0, hz: 0,
        arx: -0.45 + Math.sin(t * 2.4) * 0.04, arz: 0, alx: restL + Math.sin(t * 2.4 + 1) * 0.03, alz: 0, cape: 0.16 + Math.sin(t * 2) * 0.04 };
      let snap = 0.28;
      if (mv) { q.by = Math.abs(Math.cos(p.walk)) * 0.1 - 0.02; q.bx = 0.2; q.ll = sw * 0.85; q.lr = -sw * 0.85; q.ty = sw * 0.16; q.arx += -sw * 0.38; q.alx += sw * 0.38; q.cape = 0.52 + sw * 0.1; q.hx = -0.06; snap = 0.5;
        const mf = p.mf == null ? 1 : p.mf, ms = p.ms || 0;
        if (mf < -0.3) { const b = Math.min(1, -mf); q.bx = mix(0.2, -0.04, b); q.ll *= mix(1, 0.5, b); q.lr *= mix(1, 0.5, b); q.by = Math.abs(Math.cos(p.walk)) * 0.05 - 0.05; q.hx = 0.04; q.cape = 0.2; }       // giving ground: short steps, weight back
        if (Math.abs(ms) > 0.35) { const a = Math.min(1, Math.abs(ms)); q.bz += ms * 0.13; q.tz -= ms * 0.08; q.ll *= mix(1, 0.62, a); q.lr *= mix(1, 0.62, a); q.by -= 0.03 * a; q.bx = mix(q.bx, 0.12, a); }       // circling: a crouched side-step
      }
      if (act === 'swing') {
        snap = k < 0.07 || k > 0.9 ? 0.45 : 1; const thrustMv = p.mv === 'drive' || p.mv === 'riposte' || p.mv === 'backstab', famAnim = !p.mv && (FAM === 'heavy' || FAM === 'swing' || FAM === 'dual' || arm === 'halberd' || arm === 'staff'), step = (p.chg && (thrustMv || p.mv === 'spin' || p.mv === 'rise' || p.mv === 'lowcut' || p.mv === 'bash')) ? 0 : (p.sty === 2 && !famAnim) || p.mv === 'smite' || p.mv === 'chop' ? 2 : (p.step || 0), w = Math.min(1, k / 0.5), r = Math.max(0, (k - 0.5) / 0.5);
        const rb = Math.max(0, (r - 0.3) / 0.7), cock = eo(Math.min(1, w / 0.6)), hit = ei(Math.max(0, (w - 0.6) / 0.4)), back = rb * rb * (3 - 2 * rb), amp = p.wt ? Math.max(0.5, Math.min(1, p.wt / 0.24)) : 1;
        const seq = (ready, cocked, struck) => k < 0.5 ? mix(mix(ready, ready + (cocked - ready) * amp, cock), struck, hit) : mix(struck, ready, back);
        if (step === 0) { q.arx = seq(-0.45, -2.6, 0.3); q.arz = seq(0, -0.5, 0.5); q.ty = seq(0, 0.6, -0.65); q.bx = seq(0.06, -0.06, 0.3); }
        else if (step === 1) { q.arx = seq(-0.45, -1.35, -1.15); q.arz = seq(0, 1.0, -1.2); q.ty = seq(0, -0.75, 0.8); q.bx = seq(0.06, 0.06, 0.22); }
        else { q.arx = seq(-0.45, -3.05, 0.5); q.alx = seq(restL, -2.9, 0.4); q.bx = seq(0.06, -0.3, 0.5); q.by = k < 0.5 ? Math.sin(w * Math.PI) * 0.42 : 0; q.ll = q.lr = k < 0.5 ? Math.sin(w * Math.PI) * 0.7 : 0; q.hx = seq(0, -0.3, 0.2); }
        if (p.sty === 1 && step < 2) { q.arx = seq(-0.45, 0.35, -1.62); q.arz = seq(0, 0.25, 0); q.ty = seq(0, 0.7, -0.45); q.bx = seq(0.06, -0.05, 0.34); q.ll = seq(0.05, -0.2, 0.55); q.lr = seq(-0.05, 0.2, -0.45); if (FAM === 'pole') { q.alx = seq(restL, -0.5, -1.4); q.alz = seq(0, -0.35, -0.25); } }       // a thrust, for anything with a point
        if (step < 2 && p.sty !== 1) { q.ll = seq(0.05, -0.28, 0.5); q.lr = seq(-0.05, 0.3, -0.42); q.by = -0.07 * (k < 0.5 ? cock : 1 - back); q.hx = seq(0, -0.12, 0.16); }      // weight goes back, then through the lead leg
        if (p.sty === 3) { q.arx = seq(-0.45, -1.5, -1.42); q.arz = seq(0, 1.5, -1.6); q.alx = seq(restL, -1.3, -1.15); q.alz = seq(0, 0.9, -0.9); q.ty = seq(0, -1.15, 1.25); q.bx = seq(0.06, 0.12, 0.32); q.by = -0.12 * (k < 0.5 ? cock : 1 - back); q.ll = seq(0.05, 0.38, -0.3); q.lr = seq(-0.05, -0.42, 0.52); q.hx = seq(0, 0.1, 0.05); }      // a full sweep: the whole body turns through it
        if (k >= 0.5) { const sg = Math.sin(r * Math.PI); q.by -= sg * 0.05; q.bx += sg * 0.08; q.hx += sg * 0.1; }      // the blow lands and the weight has to come back
        q.bpz = seq(0, -0.1, 0.24); q.cape = 0.3 + hit * 0.5;
        if ((cls === 'rogue' || FAM === 'dual') && step < 2 && !p.mv) { if (step === 1) { const ax = q.arx, az = q.arz; q.arx = seq(-0.45, -0.9, -0.7); q.arz = seq(0, -0.3, 0.2); q.alx = ax; q.alz = -az; }       // two blades: the second cut comes off the other hand
          else { q.alx = seq(restL, -0.9, -0.75); q.alz = seq(0, 0.3, -0.2); } }
        // ---- every family of weapon moves its own way
        if (!p.mv && step < 2) {
          if (FAM === 'heavy') { if (step === 0) { q.arx = seq(-0.45, -2.85, 0.15); q.arz = seq(-0.3, -0.95, 0.75); q.alx = seq(-1.45, -2.6, 0.0); q.alz = seq(0.5, -0.2, 0.3); q.ty = seq(0.45, 1.05, -0.95); q.bx = seq(0.1, -0.2, 0.5); q.by = seq(0, 0.06, -0.2); q.ll = seq(0.05, -0.35, 0.7); q.lr = seq(-0.05, 0.35, -0.6); q.hx = seq(0, -0.25, 0.3); }       // hauled off the shoulder and through, the whole back in it
            else { q.arx = seq(-0.45, 0.45, -2.3); q.arz = seq(0, 0.95, -0.5); q.alx = seq(-1.45, 0.2, -2.0); q.alz = seq(0.5, 0.6, -0.1); q.ty = seq(0, -1.0, 0.75); q.bx = seq(0.1, 0.5, -0.2); q.by = seq(0, -0.2, 0.1); q.ll = seq(0.05, 0.5, -0.2); q.lr = seq(-0.05, -0.5, 0.3); q.hx = seq(0, 0.25, -0.3); } }       // and dragged back up the other way
          else if (arm === 'halberd') { const sd = step ? -1 : 1; q.arx = seq(-1.15, -1.35, -1.2); q.arz = seq(0.1, 1.5 * sd, -1.45 * sd); q.alx = seq(-1.0, -1.2, -1.15); q.alz = seq(-0.5, 1.0 * sd, -1.0 * sd); q.ty = seq(0.55, -1.15 * sd, 1.15 * sd); q.bx = seq(0.2, 0.15, 0.36); q.by = -0.14 * (k < 0.5 ? cock : 1 - back); q.ll = seq(0.05, 0.42, -0.3); q.lr = seq(-0.05, -0.45, 0.5); }       // a long hooking sweep at arm's length
          else if (arm === 'staff' && FAM === 'pole') { if (step === 0) { q.arx = seq(-1.15, -2.1, -0.5); q.arz = seq(0.1, -0.4, 0.5); q.alx = seq(-1.0, -0.3, -1.75); q.alz = seq(-0.5, 0.2, -0.5); q.ty = seq(0.55, 0.85, -0.8); q.bx = seq(0.2, 0.0, 0.3); }
            else { q.arx = seq(-1.15, -0.3, -1.85); q.arz = seq(0.1, 0.6, -0.4); q.alx = seq(-1.0, -2.0, -0.4); q.alz = seq(-0.5, -0.2, 0.4); q.ty = seq(0.55, -0.85, 0.8); q.bx = seq(0.2, 0.0, 0.3); } q.ll = seq(0.05, -0.2, 0.45); q.lr = seq(-0.05, 0.2, -0.4); }       // one end, then the other: the staff never stops turning
          else if (FAM === 'fence') { q.alx = 0.85; q.alz = 0.25; if (step === 1) { q.arx = seq(-1.5, -1.75, -1.25); q.arz = seq(0, -0.75, 0.65); q.ty = seq(0.75, 0.95, 0.35); q.bx = seq(0.05, 0.0, 0.2); } else { q.ll = seq(0.32, -0.1, 1.05); q.lr = seq(-0.36, 0.1, -0.9); q.by = seq(-0.04, 0, -0.2); q.ty = seq(0.75, 0.95, 0.25); q.bpz = seq(0, -0.12, 0.4); } }       // side-on, off hand behind: a full lunge, then a flick of the wrist
        }
        if (!p.mv && step < 2) {       // and within a family, each weapon has its own hand
          if (arm === 'pick') { if (step === 0) { q.arx = seq(-0.45, -2.95, -0.85); q.arz = seq(0, -0.15, 0.1); q.alx = seq(restL, -0.9, -0.2); q.alz = seq(0, 0.3, 0); q.ty = seq(0, 0.45, -0.5); q.bx = seq(0.06, -0.18, 0.45); q.by = seq(0, 0.04, -0.12); q.hx = seq(0, -0.2, 0.25); }       // a one-handed overhand peck, point first
            else { q.arx = seq(-0.45, -0.15, -2.45); q.arz = seq(0, 0.75, -0.3); q.alx = seq(restL, -0.3, -0.9); q.alz = 0; q.ty = seq(0, -0.65, 0.5); q.bx = seq(0.06, 0.32, -0.12); q.by = seq(0, -0.12, 0.05); } }       // then ripped back up and out
          else if (cls === 'druid' && arm === 'axes') { if (step === 0) { q.arx = seq(-1.1, -1.5, -1.3); q.arz = seq(0.35, -1.45, 0.95); q.alx = seq(-1.1, -1.5, -1.3); q.alz = seq(-0.35, 1.45, -0.95); q.ty = 0; q.bx = seq(0.24, 0.02, 0.42); q.by = seq(-0.04, 0, -0.14); }       // sickles: arms thrown wide and hooked in together, like reaping
            else { q.arx = seq(-1.1, -0.15, -2.35); q.arz = seq(0.35, 0.4, -0.2); q.alx = seq(-1.1, -2.35, -0.25); q.alz = seq(-0.35, 0.2, -0.4); q.ty = seq(0, -0.55, 0.55); q.bx = seq(0.24, 0.3, 0.05); } }       // one rakes up as the other comes down
          else if (cls === 'rogue' && (arm === 'basic' || !arm)) { if (step === 0) { q.arx = seq(-1.1, -0.5, -1.68); q.arz = 0.1; q.alx = -1.25; q.alz = -0.35; q.ty = seq(0, 0.55, -0.42); q.bx = seq(0.24, 0.16, 0.34); q.bpz = seq(0, -0.06, 0.24); }       // daggers: a short jab from the hip
            else { q.arx = -1.0; q.arz = 0.3; q.alx = seq(-1.1, -1.65, -1.2); q.alz = seq(-0.35, -1.15, 0.95); q.ty = seq(0, -0.75, 0.62); q.bx = seq(0.24, 0.2, 0.36); } }       // and the off hand opens them up backhanded
          else if (arm === 'chain') { q.arx = seq(-0.55, -3.0, -1.5); q.arz = seq(0.3, -0.35, 0); q.alx = seq(restL, -0.7, 0.35); q.alz = 0; q.ty = seq(0.3, 0.55, -0.42); q.bx = seq(0.06, -0.28, 0.42); q.by = seq(0, 0.05, -0.1); q.ll = seq(0.05, -0.3, 0.6); q.lr = seq(-0.05, 0.3, -0.5); q.hx = seq(0, -0.2, 0.2); }       // cracked like a whip: up and back, then snapped out straight
        }
        if (!p.mv && step === 2 && !p.chg) {       // the third blow of a combo is the weapon's own flourish, not everybody's jump-chop
          if (FAM === 'dual' || (cls === 'rogue' && (arm === 'basic' || !arm))) { q.by = k < 0.5 ? Math.sin(w * Math.PI) * 0.2 : 0; q.ll = q.lr = k < 0.5 ? Math.sin(w * Math.PI) * 0.35 : 0; q.arx = seq(-1.1, -1.7, -1.2); q.arz = seq(0.35, -1.55, 1.35); q.alx = seq(-1.1, -1.7, -1.2); q.alz = seq(-0.35, 1.55, -1.35); q.bx = seq(0.2, -0.12, 0.5); q.hx = seq(0, -0.2, 0.2); q.ty = 0; }       // both blades out wide, then crossed through the target
          else if (FAM === 'fence') { q.by = 0; q.arx = seq(-1.5, -1.0, -1.62); q.arz = 0; q.alx = 0.95; q.alz = 0.3; q.ty = seq(0.75, 0.95, 0.1); q.bx = seq(0.05, 0.1, 0.78); q.ll = seq(0.3, -0.3, 1.25); q.lr = seq(-0.36, 0.2, -1.1); q.bpz = seq(0, -0.15, 0.62); q.hx = seq(0, 0, -0.62); }       // the flèche: everything thrown down the line of the blade
          else if (arm === 'spear') { q.arx = seq(-0.45, -2.95, -0.85); q.alx = seq(restL, -2.75, -1.05); q.alz = seq(0, -0.3, -0.2); q.bx = seq(0.06, -0.22, 0.62); q.hx = seq(0, -0.3, 0.3); }       // up off the ground and driven down point-first
        }
        if (FAM === 'swing' && step < 2 && !p.mv && p.sty !== 1) { const wh = k < 0.5 ? cock : 1; q.arx = seq(-0.45, -2.55, -0.75); q.arz = seq(0.3, step ? 1.3 : -1.3, step ? -1.2 : 1.2) + Math.sin(k * 14) * 0.25 * (k < 0.3 ? 1 : 0); q.ty = seq(0, step ? -0.9 : 0.9, step ? 0.8 : -0.8); q.bx = seq(0.06, -0.14, 0.28); q.hx = seq(0, -0.2, 0.1); q.alx = seq(restL, -0.6, -0.2); q.alz = seq(0, 0.5, 0.2); }       // a flail or chain is whirled up over the head and brought round, not chopped
        // ---- signature moves: each named technique has its own shape
        const m = p.mv, ld = k < 0.5 ? cock : 1 - back;
        if (m === 'bash') { q.alx = seq(restL, -0.5, -1.6); q.alz = seq(0, 0.6, -0.45); q.arx = seq(-0.45, 0.1, 0.2); q.arz = seq(0, -0.2, -0.3); q.ty = seq(0, -0.7, 0.85); q.bx = seq(0.06, -0.08, 0.42); q.bpz = seq(0, -0.14, 0.36); q.ll = seq(0.05, -0.3, 0.75); q.lr = seq(-0.05, 0.3, -0.65); q.by = -0.1 * ld; q.hx = seq(0, 0.1, 0.2); }
        else if (m === 'spin') { const su = Math.max(0, Math.min(1, (k - 0.12) / 0.66)); q.spin = k < 0.12 ? -0.5 * (k / 0.12) : -0.5 + 6.7832 * (su * su * (3 - 2 * su)); q.arx = -1.5; q.arz = seq(0, 0.5, -0.2); q.alx = cls === 'rogue' ? -1.5 : seq(restL, -1.2, -1.3); q.alz = cls === 'rogue' ? 0.9 : 0; q.ty = seq(0, -0.5, 0.3); q.by = -0.14 * ld; q.bx = seq(0.06, 0.1, 0.2); q.ll = seq(0.05, 0.4, 0.45); q.lr = seq(-0.05, -0.4, -0.5); q.hx = 0; q.cape = 0.9; }
        else if (m === 'smite') { if (k < 0.5) q.by = Math.sin(w * Math.PI) * 0.6; else { const hold = 1 - back; q.by = -0.3 * hold; q.ll = -1.2 * hold; q.lr = 0.5 * hold; q.bx = 0.06 + 0.5 * hold; } }
        else if (m === 'backstab') { q.arx = seq(-0.45, -2.95, -0.55); q.arz = seq(0, -0.35, 0.25); q.alx = seq(restL, -1.5, -0.8); q.alz = seq(0, 0.4, -0.6); q.ty = seq(0, 0.55, -0.5); q.bx = seq(0.06, -0.12, 0.6); q.by = seq(0, 0.08, -0.18); q.ll = seq(0.05, -0.35, 0.85); q.lr = seq(-0.05, 0.3, -0.7); q.hx = seq(0, -0.2, 0.25); q.bpz = seq(0, -0.1, 0.3); }
        else if (m === 'lowcut') { q.by = seq(0, -0.2, -0.26); q.bx = seq(0.06, 0.3, 0.5); q.arx = seq(-0.45, -0.55, -0.95); q.arz = seq(0, 1.35, -1.35); q.ty = seq(0, -0.95, 0.95); q.ll = seq(0.05, 0.5, 0.6); q.lr = seq(-0.05, -0.5, -0.6); q.hx = seq(0, -0.3, -0.35); if (cls === 'rogue') { q.alx = q.arx + 0.3; q.alz = -q.arz * 0.7; } }
        else if (m === 'riposte') { q.arx = seq(-0.45, -0.9, -1.62); q.arz = 0; q.alx = seq(restL, -2.3, -2.5); q.alz = seq(0, 0.5, 0.6); q.ty = seq(0, 0.9, -0.75); q.bx = seq(0.06, -0.1, 0.25); q.ll = seq(0.05, -0.1, 0.7); q.lr = seq(-0.05, 0.1, -0.6); q.by = seq(0, 0, -0.12); q.bpz = seq(0, -0.05, 0.3); q.hx = 0; }
        else if (m === 'drive' && FAM === 'pole') { q.arx = seq(-0.45, 0.45, -1.55); q.arz = seq(0, 0.2, 0); q.alx = seq(restL, -0.75, -1.45); q.alz = seq(0, -0.4, -0.2); q.ty = seq(0, 0.95, -0.5); q.bx = seq(0.06, 0.05, 0.55); q.by = seq(0, -0.12, -0.2); q.ll = seq(0.05, -0.45, 1.0); q.lr = seq(-0.05, 0.4, -0.85); q.bpz = seq(0, -0.22, 0.44); q.hx = seq(0, -0.05, -0.4); }
        else if (m === 'drive') { q.arx = seq(-0.45, -0.2, -1.6); q.arz = 0; q.alx = seq(restL, -0.6, -1.45); q.alz = seq(0, -0.3, -0.25); q.ty = seq(0, 0.85, -0.55); q.bx = seq(0.06, -0.1, 0.62); q.by = seq(0, -0.05, -0.2); q.ll = seq(0.05, -0.4, 1.0); q.lr = seq(-0.05, 0.35, -0.85); q.bpz = seq(0, -0.2, 0.42); q.hx = seq(0, 0, -0.45); }
        else if (m === 'rise') { q.arx = seq(-0.45, 0.5, -2.9); q.arz = seq(0, 0.7, -0.2); q.ty = seq(0, -0.8, 0.7); q.bx = seq(0.06, 0.45, -0.25); q.by = k < 0.5 ? mix(-0.22 * cock, 0.3, hit) : 0.3 * (1 - back); q.ll = seq(0.05, 0.5, -0.3); q.lr = seq(-0.05, -0.5, 0.2); q.hx = seq(0, 0.2, -0.35); q.alx = seq(restL, -0.3, -1.0); }
      } else if (act === 'cast') {
        snap = 0.6; q.arx = cls === 'cleric' ? mix(-1.4, -2.8, eo(k)) : -1.5 - k * 0.4; q.alx = cls === 'cleric' ? -0.4 : -1.5 - k * 0.4; q.arz = -0.25; q.alz = 0.25; q.bx = -0.1 - k * 0.08; q.by += k * 0.06; q.hx = -0.15 * k; q.cape = 0.3 + k * 0.4;
        const cs = p.cs;
        if (cs === 'nova') { q.by = -0.2 * k; q.arx = -1.25; q.arz = 0.95 * k; q.alx = -1.25; q.alz = -0.95 * k; q.hx = 0.35 * k; q.bx = 0.2 * k; }
        else if (cs === 'call') { q.arx = mix(-1.4, -3.05, eo(k)); q.arz = -0.12; q.alx = restL; q.alz = 0; q.hx = -0.4 * k; q.bx = -0.14 * k; q.by += 0.05 * k; }
        else if (cs === 'bless') { q.arx = -0.75; q.arz = -0.8 * k; q.alx = -0.75; q.alz = 0.8 * k; q.hx = -0.45 * k; q.bx = -0.12 * k; q.by += 0.05 * k; }
        else if (cs === 'cone') { q.arx = -0.7; q.arz = 0.55; q.alx = -0.95; q.alz = -0.75; q.ty = 0.55 * k; q.bx = 0.1; q.by -= 0.06 * k; }
        else if (cs === 'breath') { q.bx = -0.42 * k; q.arx = 0.55 * k; q.alx = 0.55 * k; q.arz = -0.3 * k; q.alz = 0.3 * k; q.hx = -0.5 * k; }
        else if (cs === 'plant') { q.by = -0.3 * k; q.bx = 0.5 * k; q.ll = -1.2 * k; q.lr = 0.45 * k; q.arx = mix(-0.45, -2.4, k); q.arz = 0; q.alx = 0.2; q.alz = 0; q.hx = 0.2 * k; }
        else if (cs === 'throw') { q.arx = mix(-0.45, -1.9, k); q.arz = 1.2 * k; q.ty = -0.8 * k; q.alx = -1.1; q.alz = -0.3; q.bx = -0.05; }
        else if (cs === 'steel') { q.arx = -1.9; q.arz = 0.8 * k; q.alx = -1.9; q.alz = -0.8 * k; q.by -= 0.1 * k; q.hx = 0.3 * k; q.bx = 0.12 * k; }
        if (cs === 'push') { q.arx = -1.1; q.alx = -1.1; q.arz = 0.35 * k; q.alz = -0.35 * k; q.bx = -0.12 * k; q.bpz = -0.1 * k; q.hx = 0.1 * k; }
        else if (cs === 'snap') { q.arx = mix(-0.45, 0.25, k); q.arz = -0.35 * k; q.alx = restL; q.alz = 0; q.ty = 0.55 * k; q.bx = 0.02; q.hx = 0; }
        else if (cs === 'lob') { q.arx = mix(-0.45, 0.95, k); q.arz = 0.15 * k; q.alx = -0.9; q.alz = -0.3; q.ty = 0.45 * k; q.by -= 0.12 * k; q.bx = 0.22 * k; q.hx = -0.1 * k; }
        else if (cs === 'point') { q.arx = mix(-0.9, -2.3, eo(k)); q.arz = 0.15; q.alx = mix(-0.9, -2.0, eo(k)); q.alz = -0.25; q.bx = -0.14 * k; q.by += 0.05 * k; q.hx = -0.2 * k; }
        else if (cs === 'claw') { q.arx = -1.4; q.arz = 0.55 * k; q.alx = -0.75; q.alz = -0.6; q.hx = 0.3 * k; q.bx = 0.18 * k; q.ty = 0.3 * k; q.by -= 0.05 * k; }
      } else if (act === 'release') { snap = k > 0.85 ? 0.4 : 0.9; const r = 1 - k; q.arx = mix(-0.45, -1.75, r); q.arz = 0.15 * r; q.alx = mix(restL, -0.2, r); q.ty = -0.5 * r; q.bx = 0.06 + 0.3 * r; q.bpz = 0.18 * r; q.ll = 0.35 * r; q.lr = -0.3 * r; q.cape = 0.3 + 0.5 * r;
        const cs = p.cs;
        if (cs === 'nova') { q.arx = mix(-0.45, -2.3, r); q.arz = -1.25 * r; q.alx = mix(restL, -2.3, r); q.alz = 1.25 * r; q.by = 0.14 * r; q.bx = 0.06 - 0.3 * r; q.hx = -0.45 * r; q.ty = 0; q.ll = 0.3 * r; q.lr = -0.3 * r; q.bpz = 0; }
        else if (cs === 'call') { q.arx = mix(-0.45, -1.0, r); q.arz = 0; q.bx = 0.06 + 0.4 * r; q.by = -0.08 * r; q.ll = 0.45 * r; q.lr = -0.35 * r; q.hx = 0.2 * r; q.ty = -0.3 * r; }
        else if (cs === 'bless') { q.arx = mix(-0.45, -1.3, r); q.arz = -1.0 * r; q.alx = mix(restL, -1.3, r); q.alz = 1.0 * r; q.by = 0.1 * r; q.hx = -0.5 * r; q.bx = -0.1 * r; q.ty = 0; q.ll = 0.05; q.lr = -0.05; q.bpz = 0; }
        else if (cs === 'cone') { q.arx = mix(-0.45, -1.55, r); q.alx = mix(restL, -1.55, r); q.arz = 0.22 * r; q.alz = -0.22 * r; q.ty = -0.1 * r; q.bx = 0.06 + 0.3 * r; q.bpz = 0.16 * r; q.ll = 0.5 * r; q.lr = -0.45 * r; }
        else if (cs === 'breath') { q.bx = 0.06 + 0.36 * r; q.hx = 0.12 * r; q.bpz = 0.14 * r; q.arx = mix(-0.45, 0.8, r); q.alx = mix(restL, 0.8, r); q.arz = -0.4 * r; q.alz = 0.4 * r; q.ll = 0.45 * r; q.lr = -0.4 * r; q.ty = 0; }
        else if (cs === 'plant') { q.by = -0.32 * r; q.bx = 0.06 + 0.55 * r; q.ll = mix(0.05, -1.25, r); q.lr = mix(-0.05, 0.5, r); q.arx = mix(-0.45, -0.6, r); q.arz = 0; q.ty = 0; q.hx = 0.3 * r; q.bpz = 0; }
        else if (cs === 'throw') { q.arx = mix(-0.45, -1.5, r); q.arz = -1.1 * r; q.ty = 0.8 * r; q.bx = 0.06 + 0.25 * r; q.ll = 0.4 * r; q.lr = -0.35 * r; }
        else if (cs === 'steel') { q.arx = mix(-0.45, -1.6, r); q.arz = -1.3 * r; q.alx = mix(restL, -1.6, r); q.alz = 1.3 * r; q.by = 0.05 * r; q.hx = -0.3 * r; q.bx = -0.15 * r; q.ty = 0; q.bpz = 0; q.ll = 0.3 * r; q.lr = -0.3 * r; }
        if (cs === 'push') { q.arx = mix(-0.45, -1.6, r); q.alx = mix(restL, -1.6, r); q.arz = 0.1 * r; q.alz = -0.1 * r; q.ty = 0; q.bx = 0.06 + 0.38 * r; q.bpz = 0.22 * r; q.ll = 0.55 * r; q.lr = -0.5 * r; q.hx = -0.15 * r; }
        else if (cs === 'snap') { q.arx = mix(-0.45, -1.5, r); q.arz = 0; q.alx = restL; q.ty = -0.65 * r; q.bx = 0.04; q.bpz = 0.05 * r; q.ll = 0.12 * r; q.lr = -0.12 * r; q.hx = 0; }
        else if (cs === 'lob') { q.arx = mix(-0.45, -2.7, r); q.arz = -0.1 * r; q.alx = mix(restL, -0.5, r); q.ty = -0.35 * r; q.bx = 0.06 - 0.22 * r; q.by = 0.1 * r; q.ll = 0.3 * r; q.lr = -0.25 * r; q.hx = -0.3 * r; q.bpz = 0; }
        else if (cs === 'point') { q.arx = mix(-0.45, -1.55, r); q.arz = 0.1 * r; q.alx = mix(restL, -1.35, r); q.alz = -0.3 * r; q.ty = -0.15 * r; q.bx = 0.06 + 0.28 * r; q.bpz = 0.15 * r; q.ll = 0.45 * r; q.lr = -0.4 * r; }
        else if (cs === 'claw') { q.arx = mix(-0.45, -1.75, r); q.arz = -0.25 * r; q.alx = mix(restL, -0.75, r); q.alz = -0.6 * r; q.ty = -0.45 * r; q.bx = 0.06 + 0.22 * r; q.hx = -0.25 * r; q.ll = 0.35 * r; q.lr = -0.3 * r; q.bpz = 0.1 * r; }
      } else if (act === 'tear') { snap = 1; const a1 = Math.min(1, k / 0.35), a2 = Math.max(0, Math.min(1, (k - 0.35) / 0.5)), sh = Math.sin(k * 60) * 0.04 * (a2 < 1 ? a1 : 0); q.arx = -1.45 + sh; q.alx = -1.45 - sh; q.arz = mix(0.25, -1.35, a2 * a2); q.alz = mix(-0.25, 1.35, a2 * a2); q.bx = mix(0.3, -0.2, a2); q.by = mix(-0.12, 0.04, a2); q.ll = 0.5; q.lr = -0.55; q.hx = mix(0.1, -0.4, a2); q.ty = 0; q.bpz = mix(0.1, -0.06, a2);       // both hands in, then apart
      } else if (act === 'kick') { snap = 1; const kk = Math.sin(Math.min(1, k * 1.25) * Math.PI); q.ll = -1.45 * kk; q.lr = 0.25 * kk; q.bx = -0.38 * kk; q.by = 0.03 * kk; q.arx = 0.5 * kk; q.arz = -0.5 * kk; q.alx = 0.4 * kk; q.alz = 0.5 * kk; q.hx = 0.15 * kk; q.bpz = 0.1 * kk;
      } else if (act === 'stomp') { snap = 1; const up = k < 0.62 ? Math.sin(k / 0.62 * Math.PI / 2) : 0, dn = k >= 0.62 ? 1 : 0; q.ll = -1.3 * up - 0.15 * dn; q.bx = -0.15 * up + 0.42 * dn; q.by = 0.08 * up - 0.14 * dn; q.arx = -1.2 * up + 0.3 * dn; q.alx = -1.0 * up + 0.3 * dn; q.hx = -0.2 * up + 0.4 * dn;
      } else if (act === 'hoist') { snap = 0.5; q.arx = -3.05; q.arz = -0.1; q.alx = -2.7; q.alz = 0.35; q.bx = -0.22; q.hx = -0.45; q.ll = 0.25; q.lr = -0.3; q.by = -0.03;
      } else if (act === 'lunge') { snap = 1; q.bx = 0.6; q.arx = -1.6; q.arz = 0.1; q.alx = 0.6; q.ll = 0.9; q.lr = -0.8; q.by = -0.08; q.hx = -0.45; q.cape = 0.9;
      } else if (act === 'parry') { snap = 1; q.arx = -1.9; q.arz = 1.1; q.alx = -1.2; q.alz = -0.6; q.ty = 0.5; q.bx = -0.05; q.by = -0.06; q.ll = 0.25; q.lr = -0.3;
      } else if (act === 'cheer') { snap = 0.4; const b = Math.abs(Math.sin(t * 5)); q.arx = -2.9 + b * 0.3; q.arz = -0.35; q.alx = -2.7 + b * 0.4; q.alz = 0.4; q.by = b * 0.12; q.bx = -0.12; q.hx = -0.3; q.cape = 0.3 + b * 0.3;
        if (rcls === 'rogue') { q.arx = -0.2; q.arz = 1.2; q.alx = 0.7; q.alz = 0; q.bx = 0.55 + b * 0.05; q.hx = 0.3; q.by = -0.04; q.ll = 0.3; q.lr = -0.2; }                      // a bow, with a flourish
        else if (rcls === 'sorcerer') { q.arx = -1.9 + b * 0.2; q.arz = -1.0; q.alx = -1.9 + b * 0.2; q.alz = 1.0; q.bx = -0.2; q.hx = -0.35; }                                       // arms wide, palms up
        else if (rcls === 'cleric') { q.arx = -3.0; q.arz = 0; q.alx = -1.3; q.alz = -0.5; q.bx = 0.05; q.hx = -0.5; q.by = b * 0.03; }                                                // weapon to the roof, hand on heart
        else if (rcls === 'druid') { q.bx = -0.35; q.hx = -0.8; q.arx = 0.3; q.arz = -0.5; q.alx = 0.3; q.alz = 0.5; q.by = b * 0.05; }                                               // head back, howling
        else if (rcls === 'warlock') { q.arx = -2.7; q.arz = -0.1; q.alx = 0.2; q.alz = 0; q.bx = -0.05; q.hx = 0.2; q.by = 0.02 + b * 0.02; q.tz = 0.05; }                          // one hand raised, head bowed
      } else if (act === 'salute') { snap = 0.3; q.arx = -2.2 + Math.sin(t * 3) * 0.08; q.arz = -0.2; q.ty = -0.2; q.bx = 0; q.hx = -0.1;
      } else if (act === 'kneel') { snap = 0.3; q.by = -0.44; q.ll = -1.5; q.lr = 0.4; q.bx = 0.5 + Math.sin(t * 4) * 0.03; q.hx = 0.45; q.arx = 0.25; q.alx = -0.35; q.tz = Math.sin(t * 3) * 0.05; q.cape = 0.5;
      } else if (act === 'sit') { q.ll = q.lr = -1.5; q.by = -0.3; q.bx = -0.06; q.arx = -0.75; q.alx = -0.75; snap = 0.4;
      } else if (act === 'dodge') { snap = 1; const s2 = Math.sin(k * Math.PI); const dd = p.dd || 0, fw = Math.cos(dd), sdw = Math.sin(dd); q.bx = (0.12 + 0.42 * fw) * s2; q.bz = (0.1 + 0.42 * sdw) * s2; q.by = -0.2 * s2; q.ll = (0.55 + 0.4 * fw) * s2; q.lr = (-0.45 - 0.3 * fw) * s2; q.arx = -0.9 - 0.4 * s2; q.alx = 0.4 * s2; q.tz = -0.2 * sdw * s2; q.hx = -0.15 * fw * s2; q.cape = 0.7;       // weight drops, one long step, no tumbling
      } else if (act === 'ko') { snap = 1; const f = Math.min(1, (p.prog || 0) * 2.2), e = eo(f); q.bx = -1.5 * e; q.bz = 0; q.bpz = 0; q.by = 0.2 * e + Math.sin(f * Math.PI) * 0.25; q.ll = 0.3 * e; q.lr = -0.15 * e; q.arx = -2.6 * e; q.arz = -0.5 * e; q.alx = -2.4 * e; q.alz = 0.6 * e; q.hx = -0.3 * e; q.hz = 0; q.ty = 0; q.tz = 0;
      } else if (act === 'stun') { q.hz = Math.sin(t * 9) * 0.3; q.tz = Math.sin(t * 7) * 0.12; q.arx = 0.1; q.alx = 0.1; q.bx = 0.28; q.by = -0.04; }
      if (p.ready && act === 'idle') { q.by -= 0.05; q.bx = 0.14; q.arx = -0.95 + Math.sin(t * 2.4) * 0.05; q.arz = 0.2; q.alx = (cls === 'fighter' ? -1.2 : restL - 0.45) + Math.sin(t * 2.4 + 1) * 0.04; q.ty = 0.25; if (!mv) { q.ll = 0.18; q.lr = -0.22; } }
      if (p.ready && act === 'idle' && !p.guard) { const br = Math.sin(t * 2.4) * 0.04;
        if (FAM === 'heavy') { q.arx = -2.05 + br; q.arz = -0.3; q.alx = -1.45 + br; q.alz = 0.5; q.ty = 0.45; q.bx = 0.1; }                         // carried high on the shoulder
        else if (FAM === 'pole') { q.arx = -1.15 + br; q.arz = 0.1; q.alx = -1.0 + br; q.alz = -0.5; q.ty = 0.55; q.bx = 0.2; q.by -= 0.03; }        // point low and forward
        else if (FAM === 'fence') { q.arx = -1.5 + br * 0.5; q.arz = 0; q.alx = 0.75; q.alz = 0.2; q.ty = 0.75; q.bx = 0.05; q.by -= 0.04; if (!mv) { q.ll = 0.32; q.lr = -0.36; } }      // side-on, off hand behind
        else if (FAM === 'dual') { q.arx = -1.1 + br; q.arz = 0.35; q.alx = -1.1 - br; q.alz = -0.35; q.bx = 0.24; q.by -= 0.04; }
        else if (FAM === 'swing') { q.arx = -0.55 + Math.sin(t * 3.4) * 0.28; q.arz = 0.3 + Math.cos(t * 3.4) * 0.12; q.ty = 0.3; }               // the head never stops moving
        else if (FAM === 'orb') { q.arx = -1.05 + br; q.arz = -0.3; q.alx = -1.05 - br; q.alz = 0.3; q.by += Math.sin(t * 1.6) * 0.012; }
      }
      if (p.tired && (act === 'idle' || act === 'cheer')) { q.bx += 0.2 + Math.sin(t * 5) * 0.04; q.hx = 0.25; q.by -= 0.04 + Math.abs(Math.sin(t * 2.5)) * 0.02; q.arx += 0.3; }
      if (p.wounded && (act === 'idle') && !p.guard) { q.alx = -0.95; q.alz = -0.75; q.bx += 0.14; q.bz += 0.07; q.hx = 0.12; q.by -= 0.03; if (mv) { q.lr *= 0.55; q.by += Math.abs(Math.sin(p.walk)) * 0.05; } }      // a hand pressed to the wound, and a limp
      if (p.crawl && act !== 'ko') { const c = Math.sin(mv ? p.walk * 1.3 : t * 1.4), reach = act === 'swing' ? Math.sin(k * Math.PI) : 0; q.bx = 1.36; q.by = 0.1; q.bpz = -0.45; q.bz = c * 0.07; q.tz = c * 0.1; q.hx = -1.05; q.arx = -2.55 + c * 0.75 - reach * 0.5; q.alx = -2.55 - c * 0.75; q.arz = 0.25; q.alz = -0.25; q.ll = 0.12; q.lr = -0.08; q.cape = 0.05; snap = 0.5; }      // on the belly, hauling forward on the arms
      if (p.hop) { q.bz += 0.16; q.tz -= 0.1; q.by += mv ? Math.abs(Math.sin(p.walk)) * 0.14 : Math.abs(Math.sin(t * 3)) * 0.02; q.lr = mv ? Math.sin(p.walk * 2) * 0.4 : 0; q.arx -= 0.3; }
      if (p.guard && act !== 'ko' && act !== 'dodge') { q.bx = 0.14; q.by = -0.05; snap = 0.5;
        if (FAM === 'pole') { q.arx = -1.5; q.arz = -0.55; q.alx = -1.5; q.alz = 0.55; q.by = -0.08; }                       // the shaft held across, both hands
        else if (FAM === 'fence') { q.arx = -1.75; q.arz = 0.95; q.alx = 0.85; q.alz = 0.25; q.ty = 0.6; }                  // blade across the body, off hand back
        else if (FAM === 'dual' || cls === 'rogue') { q.arx = -1.55; q.arz = 0.75; q.alx = -1.55; q.alz = -0.75; q.by = -0.1; }       // crossed in front of the face
        else if (FAM === 'heavy') { q.arx = -1.25; q.arz = 0.65; q.alx = -1.35; q.alz = -0.3; q.by = -0.12; q.bx = 0.2; }   // the haft across the chest, set low
        else if (FAM === 'orb') { q.arx = -1.5; q.arz = 0.12; q.alx = -1.5; q.alz = -0.12; q.bx = 0.02; }                   // both palms out, warding
        else { q.alx = -1.55; q.alz = -0.55; q.arx = -1.25; q.arz = 0.45; } }
      if (p.hurt > 0 && !(prevHurt > 0)) side = p.hs ? p.hs : -side; prevHurt = p.hurt || 0;
      if (act === 'ko') { /* the dead do not flinch */ }
      else if (p.hurt > 0 && p.guard) { const h = Math.min(1, p.hurt / 0.28); q.bx -= 0.16 * h; q.by -= 0.1 * h; q.bpz -= 0.16 * h; q.alx += 0.3 * h; q.arx += 0.2 * h; q.tz += 0.08 * h * side; q.ll = 0.3; q.lr = -0.4; snap = Math.max(snap, 0.7); }      // caught on the guard: driven back, not opened up
      else if (p.hurt > 0) { const h = Math.min(1, p.hurt / 0.28), big = p.hbig ? 1.25 : 1, fb = p.hb ? -1 : 1;       // the body goes the way the blow sent it: back from a hit in front, pitched forward from one behind, and twisted off the side it landed on
        q.tz += side * 0.3 * h * big; q.hz = side * 0.28 * h * big; q.ty += -side * 0.32 * h * big; q.bx -= (fb > 0 ? 0.5 : 0.34) * h * big * fb; q.hx = -0.45 * h * fb; q.by -= 0.06 * h * big; q.bpz -= 0.12 * h * big * fb; q.ll += 0.25 * h * fb; q.lr -= 0.35 * h * fb; q.arx += 0.55 * h; q.alx += 0.65 * h; if (side > 0) q.arz -= 0.5 * h * big; else q.alz += 0.5 * h * big; snap = Math.max(snap, 0.7); }
      body.position.y = J('by', q.by, snap); body.position.z = J('bpz', q.bpz, snap); if (q.spin != null) spinNow = q.spin; else if (spinNow) { spinNow = Math.atan2(Math.sin(spinNow), Math.cos(spinNow)) * 0.55; if (Math.abs(spinNow) < 0.02) spinNow = 0; }
      body.rotation.set(J('bx', q.bx, snap), spinNow, J('bz', q.bz, snap));
      legL.rotation.x = J('ll', q.ll, snap); legR.rotation.x = J('lr', q.lr, snap);
      torso.rotation.set(0, J('ty', q.ty, snap), J('tz', q.tz, snap)); head.rotation.set(J('hx', q.hx, snap), -cur.ty * 0.6, J('hz', q.hz, snap));
      armR.rotation.set(J('arx', q.arx, snap), 0, J('arz', q.arz, snap)); armL.rotation.set(J('alx', q.alx, snap), 0, J('alz', q.alz, snap));
      if (cape) cape.rotation.x = J('cape', q.cape, 0.2);
      if (robe) { const R = robe.userData, ty = cur.ty || 0, spin = Math.min(1, Math.abs(ty - (R.ty == null ? ty : R.ty)) / Math.max(dtp, 1e-3) / 9); R.ty = ty; R.fl = (R.fl || 0) + (spin - (R.fl || 0)) * Math.min(1, dtp * (spin > (R.fl || 0) ? 18 : 5));
        const tx = (mv ? -0.16 * (p.mf == null ? 1 : p.mf) : 0) - (cur.bx || 0) * 0.55 + (act === 'dodge' ? -0.25 : 0), tz = (mv ? sw * 0.14 : 0) - (cur.bz || 0) * 0.6 - (p.ms || 0) * (mv ? 0.12 : 0);       // the hem trails the stride, hangs plumb when the body leans, and flares on a fast turn
        R.x = (R.x || 0) + (tx - (R.x || 0)) * Math.min(1, dtp * 9); R.z = (R.z || 0) + (tz - (R.z || 0)) * Math.min(1, dtp * 9); robe.rotation.x = R.x; robe.rotation.z = R.z; const fl = 1 + R.fl * 0.2; robe.scale.set(fl, 1 - R.fl * 0.05, fl); }
      root.rotation.z = 0; root.rotation.x = 0; root.position.y = p.y || 0;
      { const crouch = Math.max(0, Math.min(1, -cur.by * 3.2)), sitting = act === 'sit' || act === 'kneel';
        if (!sitting && act !== 'dodge') { legL.rotation.x -= crouch * 0.42; legR.rotation.x -= crouch * 0.42; }
        const knee = l => Math.max(0, Math.min(1.75, Math.max(0, l) * 0.95 + Math.max(0, -l) * 0.3 + Math.max(0, -l - 0.9) * 2.0 + (sitting ? 0 : crouch * 0.85)));
        legL.userData.shin.rotation.x = J('kl', knee(legL.rotation.x), 0.6); legR.userData.shin.rotation.x = J('kr', knee(legR.rotation.x), 0.6);
        let eR = 0.28, eL = 0.28;
        if (act === 'swing') { eR = k < 0.5 ? mix(1.0, 0.04, Math.pow(Math.min(1, k / 0.5), 3)) : mix(0.04, 0.45, (k - 0.5) / 0.5); eL = p.sty === 2 || p.sty === 3 || cls === 'rogue' ? eR : 0.7; }
        else if (act === 'cast') { eR = eL = 0.55 - k * 0.3; } else if (act === 'release') { eR = 0.1; eL = 0.5; }
        else if (act === 'parry') { eR = 1.0; eL = 1.1; } else if (act === 'lunge') { eR = 0.05; eL = 0.6; }
        else if (act === 'cheer' || act === 'salute') { eR = 0.35; eL = 0.35; } else if (act === 'kneel' || act === 'stun') { eR = eL = 0.5; } else if (act === 'sit') { eR = eL = 0.9; }
        else if (p.guard) { eR = 0.9; eL = 1.15; }
        else if (p.ready) { eR = FAM === 'fence' ? 0.25 : FAM === 'heavy' ? 0.95 : 0.75; eL = FAM === 'fence' ? 0.9 : 0.8; }
        else if (mv) { eR = 0.35 + Math.max(0, sw) * 0.3; eL = 0.35 + Math.max(0, -sw) * 0.3; }
        if (p.hurt > 0) { eR += 0.3; eL += 0.3; }
        foreR.rotation.x = -J('er', eR, Math.max(0.35, snap)); foreL.rotation.x = -J('el', eL, Math.max(0.35, snap)); }
      if (act === 'kick') legL.userData.shin.rotation.x = 0.15;
      if (act === 'ko') { legL.userData.shin.rotation.x = 0.25; legR.userData.shin.rotation.x = 0.5; foreR.rotation.x = -0.3; foreL.rotation.x = -0.5; }
      // sorcerer flames + cast glow
      const fl = 0.85 + Math.sin(t * 17) * 0.12;
      if (orbs) orbs.forEach(o => o.scale.setScalar((act === 'cast' ? 1.2 + k * 0.9 : 0.9) * fl));
      if (act === 'cast' && p.glow) { castGlow.material.color.set(p.glow); castGlow.material.opacity = 0.9; castGlow.scale.setScalar(0.6 + k * 1.4); } else castGlow.material.opacity = 0;
      if (auraM) auraM.forEach((s, i) => { const a = t * 1.5 + i * 1.57; s.position.set(Math.cos(a) * 0.6, 0.35 + i * 0.38 + Math.sin(t * 2 + i) * 0.15, Math.sin(a) * 0.6); });
      // flash + stealth
      const fl2 = p.flash > 0;
      const fk = fl2 ? Math.min(1, p.flash / 0.09) : 0; for (const mt of mats) { if (fl2) { const e0 = mt.userData.e; mt.emissive.setRGB(e0.r + 0.085 * fk, e0.g + 0.06 * fk, e0.b + 0.04 * fk); } else mt.emissive.copy(mt.userData.e); }       // a hit lights them up without wiping them out
      const a = p.alpha == null ? 1 : p.alpha;
      if (a !== lastAlpha) { lastAlpha = a; for (const mt of mats) { mt.transparent = a < 1; mt.opacity = a; mt.needsUpdate = true; } glows.forEach(gl => gl.visible = a > 0.5); root.traverse(o => { if (o.isMesh) o.castShadow = a > 0.5; }); }
    };
    if (robe) robe.userData.keep = 1;
    slim(root);
    C.pose({ t: 0, act: 'idle' }); fresh = 1;
    return C;
  };

  // ------------------------------------------------------------ portraits (rendered once, cached as images)
  let pr = null, pscene, pcam; const pcache = {};
  G.portrait = function (look, size, full) {
    full = full === 'full';
    const key = JSON.stringify([look.cls, look.race, look.tint, look.gear, look.cos, look.skin, look.arm, look.kit, full]);
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
        { const r = full ? 1.02 : 0.62; pcam.left = pcam.bottom = -r; pcam.right = pcam.top = r; pcam.updateProjectionMatrix(); pcam.position.set(full ? 4.4 : 3, full ? 2.9 : 3.1, 4.2); pcam.lookAt(0, full ? 0.98 : 1.32, 0); if (full) c.pose({ t: 0, act: 'idle', ready: 1 }); }
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
