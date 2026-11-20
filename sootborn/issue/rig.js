//@@SPECS
  /* SOOTBORN cast. The slot names are the engine's; the people are ours.
     hero = Kael Brennick, gilded, seven years on.  hollow = Dock Guard.  knifer = Stair Blade.
     bruiser = Warden.  boss = Stair Captain Ansel Rook.  clerk = Brand. */
  const SPECS = SC.SPECS = {
    hero: { h: 1.1, b: 1.12, face: 'kael', hair: 'kael', armor: true, cape: true, glowHand: true, washer: true, weapon: 'kblade', pauldron: true,
      pal: { skin: 0xe6c79a, top: 0xefe8d4, trim: 0xe8c25a, shirt: 0x5a3aa8, tie: 0xe8c25a, pants: 0x2e2a40, boots: 0x1a1620, hair: 0xe9cf7a, streak: 0x2a2630, glove: 0x2a2630, wrap: 0x2e2a40, band: 0x5a3aa8 } },
    hollow: { h: 1.0, b: 1.05, face: 'visor', helm: 'guard', weapon: 'baton', tabard: true, kit: { plate: 0xe9e6dc, trim: 0xd8a83a, belt: 0x1f2233, lamp: 0x5ff2e2, hands: 0xe9e6dc },
      pal: { skin: 0xefe8d4, top: 0x2f8f8a, trim: 0xe8c25a, shirt: 0xefe8d4, tie: 0xe8c25a, pants: 0x30344a, boots: 0x14141d, hair: 0xefe8d4, glove: 0xefe8d4, wrap: 0x2f8f8a } },
    knifer: { h: 0.97, b: 0.9, face: 'halfmask', hood: true, weapon: 'blade', sash: true, kit: { light: 1, mantle: 0x432a86, plate: 0x33206a, trim: 0xe8c25a, belt: 0x14141d, hands: 0x14141d, sheath: 1 },
      pal: { skin: 0xe6c79a, top: 0x5a3aa8, trim: 0x33206a, shirt: 0xe8c25a, tie: 0xe8c25a, pants: 0x23202c, boots: 0x14141d, hair: 0x5a3aa8, glove: 0x14141d, wrap: 0x5a3aa8 } },
    bruiser: { h: 1.24, b: 1.5, face: 'grille', helm: 'warden', weapon: 'halberd', apron: true, pauldron: true, kit: { noSh: 1, plate: 0x8a8ea6, trim: 0xb02a2a, belt: 0x14141d, hands: 0x23232e },
      pal: { skin: 0x9aa1b8, top: 0x3a3f5c, trim: 0xe8c25a, shirt: 0x8a1f24, tie: 0xe8c25a, pants: 0x23232e, boots: 0x14141d, hair: 0x9aa1b8, glove: 0x23232e, wrap: 0x3a3f5c } },
    boss: { h: 1.14, b: 1.08, face: 'rook', hat: 'captain', coat: true, weapon: 'gaff', pauldron: true, kit: { light: 1, noSh: 1, officer: 1, plate: 0xf2efe6, trim: 0xe8c25a, belt: 0x8a1f24, hands: 0x8a1f24, sheath: 1 },
      pal: { skin: 0xd9b48f, top: 0xf2efe6, trim: 0xe8c25a, shirt: 0x8a1f24, tie: 0xe8c25a, pants: 0x23232e, boots: 0x0c0c12, hair: 0xb9bcc8, glove: 0x8a1f24, wrap: 0xf2efe6 } },
    clerk: { h: 1.12, b: 1.25, face: 'brand', hair: 'brand', coat: true, weapon: 'halberd2',
      pal: { skin: 0xb98a66, top: 0x4a4650, trim: 0x2a2630, shirt: 0x6e6a78, tie: 0x2a2630, pants: 0x2a2630, boots: 0x15151f, hair: 0x9a9aa6, glove: 0x2a2630, wrap: 0x4a4650 } }
  };
  if (SC.issue === 'riser') {   // a clerk cannot be seen to fight: black cloth over the face, no cape, nothing gilt
    Object.assign(SPECS.hero, { face: 'cloth', cape: false, hood: true, pauldron: false, hair: null });
    Object.assign(SPECS.hero.pal, { top: 0x2a2630, trim: 0x4a4650, shirt: 0x2a2630, tie: 0x4a4650, band: 0x2a2630 });
    SPECS.boss = { h: 1.32, b: 1.55, face: 'grille', helm: 'warden', weapon: 'halberd', apron: true, pauldron: true, kit: { noSh: 1, officer: 1, plate: 0xefe8d4, trim: 0xe8c25a, belt: 0x8a1f24, hands: 0x23232e }, pal: { skin: 0xc9cbd6, top: 0xefe8d4, trim: 0xe8c25a, shirt: 0x8a1f24, tie: 0xe8c25a, pants: 0x23232e, boots: 0x14141d, hair: 0xefe8d4, glove: 0x23232e, wrap: 0xefe8d4 } };
  }
  if (SC.issue === 'stack') {   // House Teal's pickets hold the island; their blades wear teal, not violet
    Object.assign(SPECS.knifer.pal, { top: 0x1f6f6a, wrap: 0x1f6f6a });
  }
  if (SC.issue === 'array') {   // forty-three days after the furnace: a valve hand with a wrench, Dace in his hood, and the Array's own watch
    Object.assign(SPECS.hero, { h: 1.0, b: 1.0, face: 'kael0', hair: 'kael', armor: false, cape: false, pauldron: false, glowHand: false, weapon: 'wrench' });
    Object.assign(SPECS.hero.pal, { skin: 0xc8946a, hair: 0x6a2e18, streak: 0x6a2e18, top: 0x3d5a6a, trim: 0x2a3440, shirt: 0x3d5a6a, tie: 0xb8682a, pants: 0x2a3440, boots: 0x1e1418, glove: 0xc8946a, wrap: 0x3d5a6a, band: 0xb8682a });
    SPECS.clerk = { h: 1.03, b: 1.02, face: 'cloth', hood: true, kit: { light: 1, noSh: 1, soot: 1, plate: 0x2a2634, trim: 0x4a4030, belt: 0x1c1a24, hands: 0xb98a66, lamp: 0xffd98a }, pal: { skin: 0xb98a66, top: 0x2a2634, trim: 0x1c1a24, shirt: 0x2a2634, tie: 0x1c1a24, pants: 0x1c1a24, boots: 0x0c0c12, hair: 0x2a2634, glove: 0x4a4030, wrap: 0x2a2634 } };
    Object.assign(SPECS.hollow.pal, { top: 0x4a5068, wrap: 0x4a5068 }); if (SPECS.hollow.kit) SPECS.hollow.kit.lamp = 0xffb060;
  }
  if (SC.issue === 'docks') {   // seven years after: he is still Clerk Sorrel that night. A coat, not plate; gloves over the palms
    Object.assign(SPECS.hero, { armor: false, pauldron: false, coat: true, cape: false });
    Object.assign(SPECS.hero.pal, { top: 0xe6dcc4, wrap: 0xe6dcc4, glove: 0x6a5a44 });
  }
  // how each boss stands when he is not moving. Rook: upright, the gaff grounded like a staff, one hand behind his back.
  // The Warden-captain at the riser: low and square, the halberd across him. The Blade: both points down, the weight off the bad leg
  SC.bossIdle = (e, o) => { if (e.kind !== 'boss') return o; const t = e.t || 0, br = Math.sin(t * 1.4) * 0.02;
    if (SC.issue === 'stair') return Object.assign({}, o, { hips: [0, -0.2, 0.05], spine: [0.1 + br, -0.22, 0], chest: [0.06, -0.1, 0], head: [0.1, 0.3, 0], shR: [0.25, 0, -0.5], elR: [-0.45 - br, 0, 0], shL: [0.25, 0, 0.5], elL: [-0.45 + br, 0, 0], thL: [0.04, 0, 0.3], shnL: [0.02, 0, 0], ftL: [0.1, 0, 0], thR: [-0.32, 0, -0.08], shnR: [0.6, 0, 0], y: -0.06 + br * 0.3 });
    if (SC.issue === 'riser') return Object.assign({}, o, { hips: [0, -0.15, 0], spine: [0.22 + br * 1.5, 0.1, 0], chest: [0.1, 0.1, br], head: [0.08, 0.05, 0], shR: [-1.0, 0, -0.2], elR: [-1.15 - br, 0, 0], shL: [-1.0, 0, 0.5], elL: [-1.2 + br, 0, 0], thL: [-0.28, 0, 0.24], shnL: [0.4, 0, 0], thR: [0.2, 0, -0.24], shnR: [0.34, 0, 0], y: -0.07 + br * 0.5 });
    return Object.assign({}, o, { hips: [0, -0.1, 0], spine: [-0.05 + br * 0.5, 0, 0], chest: [-0.06, 0, 0], neck: [0, 0, 0], head: [0.06, Math.sin(t * 0.45) * 0.28, 0], shR: [-0.2, 0, -0.36], elR: [-0.4, 0, 0], shL: [0.4, 0, 0.08], elL: [-1.55, 0, 0], thL: [0, 0, 0.07], shnL: [0.03, 0, 0], thR: [0, 0, -0.07], shnR: [0.03, 0, 0], ftR: [0, 0, 0], y: 0 }); };
  // Oswin Hale's leg was broken on night forty-nine and set badly. Nine years on he is the Auditor's Blade, and it still does not bend
  SC.limp = (e, o) => { if (e.kind !== 'boss' || SC.issue !== 'stair') return o; const a = Math.sin(e.runPh || 0); return Object.assign(o, { thL: [-0.32 * a - 0.04, 0, 0.14], shnL: [0.05, 0, 0], ftL: [0.1, 0, 0], hips: [0, o.hips ? o.hips[1] : 0, 0.08 * a], y: (o.y || 0) + 0.035 * Math.abs(a) }); };
  if (SC.issue === 'stair') {   // the Auditor's Blade, and Tavi at sixteen
    SPECS.boss = { h: 1.18, b: 1.0, face: 'halfmask', hood: true, coat: true, weapon: 'blade', weapon2: true, sash: true, kit: { light: 1, officer: 1, mantle: 0x23232e, plate: 0x2a2a38, trim: 0xe8c25a, belt: 0xe8c25a, hands: 0x15151f }, pal: { skin: 0xe6c79a, top: 0x15151f, trim: 0xe8c25a, shirt: 0xe8c25a, tie: 0xe8c25a, pants: 0x15151f, boots: 0x0c0c12, hair: 0x15151f, glove: 0xe8c25a, wrap: 0x15151f } };
    SPECS.clerk = { h: 0.94, b: 0.9, face: 'tavi', hair: 'tavi', kit: { light: 1, noSh: 1, soot: 1, plate: 0x6a4a34, trim: 0xd9a05f, belt: 0x2a1c14, hands: 0xc98a62, lamp: 0xffd98a }, pal: { skin: 0xc98a62, top: 0x8a6a48, trim: 0x4a3524, shirt: 0xd9a05f, tie: 0x4a3524, pants: 0x3a3350, boots: 0x15151f, hair: 0x2a1c14, glove: 0xc98a62, wrap: 0x8a6a48 } };
  }
  if (SC.issue === 'gild') {   // the table: the man who went onto it, the man on it, the man who came off, the woman who did it, and two of the Unlit to hold the lamp
    const shift = { top: 0x6a6672, trim: 0x4f4b57, shirt: 0x6a6672, tie: 0x4f4b57, pants: 0x4f4b57, wrap: 0x6a6672 };
    SPECS.k0 = { h: 1.0, b: 1.0, face: 'kael0', hair: 'kael', pal: Object.assign({ skin: 0xc8946a, hair: 0x2a2018, streak: 0x2a2018, band: 0x2a2018, boots: 0xc8946a, glove: 0xc8946a }, shift) };
    SPECS.k1 = { h: 1.05, b: 1.05, face: 'kaelm', pal: Object.assign({ skin: 0xd8b088, hair: 0x2a2018, boots: 0xd8b088, glove: 0xc8946a }, shift) }; SPECS.k1w = Object.assign({}, SPECS.k1, { h: 1.08, face: 'kaelw' });   // months in: longer, shaved, the eyes wrapped. The hands are still his
    SPECS.k2 = { h: 1.1, b: 1.12, face: 'kael', hair: 'kael', pal: { skin: 0xe6c79a, hair: 0xe9cf7a, streak: 0x2a2630, band: 0xe9cf7a, top: 0xefe8d4, trim: 0xd8d0bc, shirt: 0xefe8d4, tie: 0xd8d0bc, pants: 0xd8d0bc, wrap: 0xefe8d4, boots: 0xe6c79a, glove: 0x2a2630 } };
    SPECS.ilse = { h: 1.15, b: 0.94, face: 'ilse', hair: 'ilse', coat: true, pal: { skin: 0xe6c79a, top: 0x3f3a48, trim: 0x2a2630, shirt: 0x9a9488, tie: 0x2a2630, pants: 0x2a2630, boots: 0x15151f, hair: 0xb9bcc8, glove: 0xefe8d4, wrap: 0x3f3a48 } };
    SPECS.unlit = { h: 1.0, b: 1.06, face: 'cloth', hood: true, pal: { skin: 0xc8946a, top: 0x2a2634, trim: 0x1c1a24, shirt: 0x2a2634, tie: 0x1c1a24, pants: 0x1c1a24, boots: 0x0c0c12, hair: 0x2a2634, glove: 0x4a4030, wrap: 0x2a2634 } };
  }
//@@FACES
  function drawFace(g, kind, expr, glow) {
    const S = 128, ink = '#07070d';
    g.setTransform(1, 0, 0, 1, 0, 0); g.lineCap = 'round'; g.lineJoin = 'round';
    const eye = (x, y, w, h, iris, lid) => {
      g.fillStyle = ink; g.beginPath(); g.ellipse(x, y, w + 3, h + 3, 0, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y + 1, w, h, 0, 0, 7); g.fill();
      g.fillStyle = iris; g.beginPath(); g.arc(x, y + 1, Math.min(h + 1, 6), 0, 7); g.fill();
      g.fillStyle = ink; g.beginPath(); g.arc(x, y + 1, 2.4, 0, 7); g.fill();
      g.fillStyle = ink; g.fillRect(x - w - 4, y - h - 4, (w + 4) * 2, h * lid + 3);
    };
    const stroke = (pts, w, col) => { g.strokeStyle = col || ink; g.lineWidth = w; g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.stroke(); };
    const EX = { neutral: [5.5, 0.35, 0, 0], angry: [5, 0.5, 7, 0], hurt: [3, 0.9, -6, 0], shock: [8, 0, -3, -4], smirk: [5, 0.45, 3, 0], shut: [1, 1.2, 0, 0], dead: [1, 1.2, -4, 0] };
    const mouth = (y, col) => {
      if (expr === 'angry') { g.fillStyle = ink; g.fillRect(44, y - 7, 42, 15); g.fillStyle = '#fff'; g.fillRect(47, y - 4, 36, 9); stroke([56, y - 4, 56, y + 5], 1.5); stroke([65, y - 4, 65, y + 5], 1.5); stroke([74, y - 4, 74, y + 5], 1.5); }
      else if (expr === 'hurt' || expr === 'dead') { g.fillStyle = ink; g.beginPath(); g.ellipse(65, y, 13, 8, 0, 0, 7); g.fill(); g.fillStyle = col || '#8a1f24'; g.beginPath(); g.ellipse(65, y + 2, 8, 4, 0, 0, 7); g.fill(); }
      else if (expr === 'shock') { g.fillStyle = ink; g.beginPath(); g.ellipse(65, y + 1, 7, 9, 0, 0, 7); g.fill(); }
      else if (expr === 'smirk') stroke([48, y + 1, 70, y + 2, 84, y - 6], 4);
      else stroke([50, y, 80, y], 4);
    };
    if (kind === 'cloth') {
      g.fillStyle = '#1a1620'; g.fillRect(0, 0, S, S); g.fillStyle = '#e6c79a'; g.fillRect(14, 46, 100, 30);
      const e = EX[expr] || EX.neutral; eye(42, 60, 11, e[0], '#e2a81c', e[1] + 0.2); eye(86, 60, 11, e[0], '#e2a81c', e[1] + 0.2);
      stroke([10, 44, 118, 44], 4); stroke([10, 78, 118, 78], 4); for (let x = 30; x < 110; x += 16) stroke([x, 88, x - 4, 118], 2, '#2e2a40');
    } else if (kind === 'tavi' || kind === 'oswin') {
      const os = kind === 'oswin'; g.fillStyle = os ? '#e6c79a' : '#c98a62'; g.fillRect(0, 0, S, S); g.fillStyle = os ? '#c29a6a' : '#a56e4c'; g.beginPath(); g.moveTo(0, 36); g.lineTo(28, 60); g.lineTo(28, 100); g.lineTo(50, 128); g.lineTo(0, 128); g.fill();
      const e = EX[expr] || EX.neutral; eye(42, 60, 12, e[0] + 1, os ? '#e2a81c' : '#4a2e1c', e[1]); eye(86, 60, 12, e[0] + 1, os ? '#e2a81c' : '#4a2e1c', e[1]); if (os) { stroke([20, 30, 60, 52, 54, 90], 3, '#8a1f24'); stroke([40, 96, 86, 100], 4); }
      stroke([28, 44, 54, 46], 5, '#2a1c14'); stroke([100, 44, 74, 46], 5, '#2a1c14'); stroke([66, 60, 62, 78, 68, 81], 2.5);
      stroke([50, 98, 66, 104, 82, 98], 4); g.fillStyle = 'rgba(30,26,34,0.5)'; g.fillRect(24, 74, 14, 8);
    } else if (kind === 'kael') {
      // gilded: warm gold skin, gold-leaf eyes, and the soot he never quite washes off one cheek
      g.fillStyle = '#e6c79a'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#c29a6a'; g.beginPath(); g.moveTo(0, 36); g.lineTo(30, 60); g.lineTo(28, 98); g.lineTo(50, 128); g.lineTo(0, 128); g.fill();
      g.fillStyle = '#c29a6a'; g.fillRect(42, 110, 56, 18);
      const e = EX[expr] || EX.neutral;
      eye(42, 60, 11, e[0], '#e2a81c', e[1]); eye(86, 60, 11, e[0], glow === '#f6f2e6' ? '#e2a81c' : glow, e[1]);
      stroke([27, 45 + e[3] - e[2] * 0.3, 54, 47 + e[3] + e[2]], 7, '#4a3a22'); stroke([101, 45 + e[3] - e[2] * 0.3, 74, 47 + e[3] + e[2]], 7, '#4a3a22');
      stroke([66, 58, 61, 80, 68, 84], 3);
      // the smudge
      g.fillStyle = 'rgba(30,26,34,0.62)'; g.beginPath(); g.moveTo(88, 76); g.lineTo(112, 70); g.lineTo(116, 84); g.lineTo(96, 92); g.fill();
      stroke([90, 80, 110, 74], 2.2, 'rgba(7,7,13,0.7)'); stroke([94, 86, 112, 80], 2, 'rgba(7,7,13,0.7)');
      // the seam the Gilding left along the jaw
      stroke([18, 92, 30, 104, 44, 112], 2, '#a87a4c');
      mouth(101); stroke([58, 113, 72, 113], 2);
    } else if (kind === 'kael0' || kind === 'kaelm' || kind === 'kaelw') {
      // before the gold: Tier Six skin, grey-brown eyes, soot in both cheeks. And in the middle of it: shaved, paler, the eyes under wrappings
      const w = kind === 'kaelw', mid = kind !== 'kael0'; g.fillStyle = mid ? '#d8b088' : '#c8946a'; g.fillRect(0, 0, S, S);
      g.fillStyle = mid ? '#b88c62' : '#a56e4c'; g.beginPath(); g.moveTo(0, 36); g.lineTo(30, 60); g.lineTo(28, 98); g.lineTo(50, 128); g.lineTo(0, 128); g.fill(); g.fillRect(42, 110, 56, 18);
      const e = EX[expr] || EX.neutral;
      if (w) {
        g.fillStyle = '#efe8d4'; g.fillRect(0, 40, S, 40); stroke([0, 40, S, 40], 3); stroke([0, 80, S, 80], 3); stroke([0, 55, S, 50], 1.6, '#b8b0a0'); stroke([0, 68, S, 71], 1.6, '#b8b0a0');
        g.fillStyle = 'rgba(232,194,90,0.6)'; g.beginPath(); g.ellipse(42, 61, 10, 5, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(86, 61, 10, 5, 0, 0, 7); g.fill();
      } else {
        eye(42, 60, 11, e[0], '#6a5846', e[1]); eye(86, 60, 11, e[0], '#6a5846', e[1]);
        stroke([27, 45 + e[3] - e[2] * 0.3, 54, 47 + e[3] + e[2]], 7, '#2a2018'); stroke([101, 45 + e[3] - e[2] * 0.3, 74, 47 + e[3] + e[2]], 7, '#2a2018');
        if (!mid) { g.fillStyle = 'rgba(30,26,34,0.6)'; g.beginPath(); g.moveTo(88, 76); g.lineTo(112, 70); g.lineTo(116, 84); g.lineTo(96, 92); g.fill(); g.beginPath(); g.moveTo(14, 72); g.lineTo(34, 78); g.lineTo(30, 90); g.lineTo(16, 86); g.fill(); }
      }
      if (mid) { stroke([18, 92, 30, 104, 44, 112], 2.4, '#8a1f24'); stroke([22, 96, 26, 92], 1.6, '#8a1f24'); stroke([30, 106, 34, 102], 1.6, '#8a1f24'); stroke([38, 111, 41, 106], 1.6, '#8a1f24'); }   // the seam along the jaw, new, with its stitches
      stroke([66, 58, 61, 80, 68, 84], 3); mouth(101); stroke([58, 113, 72, 113], 2);
    } else if (kind === 'ilse') {
      // Accredited once: the height, the gold in the eye, and forty years on the seam they gave her at twelve
      g.fillStyle = '#e6c79a'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#c9a678'; g.beginPath(); g.moveTo(0, 30); g.lineTo(28, 58); g.lineTo(26, 128); g.lineTo(0, 128); g.fill();
      const e = EX[expr] || EX.neutral;
      eye(42, 60, 11, Math.max(1, e[0] - 1), '#e2a81c', e[1] + 0.15); eye(86, 60, 11, Math.max(1, e[0] - 1), '#e2a81c', e[1] + 0.15);
      stroke([27, 43, 54, 46 + e[2] * 0.5], 4, '#8f8f9c'); stroke([101, 43, 74, 46 + e[2] * 0.5], 4, '#8f8f9c');
      stroke([66, 58, 62, 80, 69, 83], 2.5);
      stroke([22, 68, 32, 73], 1.8); stroke([96, 73, 106, 68], 1.8); stroke([40, 92, 46, 106], 1.6, '#a87a4c'); stroke([90, 92, 84, 106], 1.6, '#a87a4c');
      stroke([18, 92, 30, 104, 44, 112], 2, '#a87a4c');
      mouth(100);
    } else if (kind === 'brand') {
      g.fillStyle = '#b98a66'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#946a4c'; g.beginPath(); g.moveTo(0, 30); g.lineTo(30, 56); g.lineTo(26, 128); g.lineTo(0, 128); g.fill();
      const e = EX[expr] || EX.neutral;
      eye(42, 60, 10, Math.max(1, e[0] - 1.5), '#5a4a3a', e[1] + 0.2); eye(86, 60, 10, Math.max(1, e[0] - 1.5), '#5a4a3a', e[1] + 0.2);
      stroke([26, 46, 55, 50 + e[2] * 0.5], 9, '#8f8f9c'); stroke([102, 46, 73, 50 + e[2] * 0.5], 9, '#8f8f9c');
      stroke([66, 56, 60, 80, 70, 84], 3.5);
      stroke([30, 30, 40, 44, 36, 56], 2.5, '#6e3a30');                                   // an old cut through the brow
      stroke([24, 70, 34, 74], 2); stroke([96, 74, 106, 70], 2);                           // lines
      g.fillStyle = '#8f8f9c'; g.beginPath(); g.moveTo(22, 84); g.lineTo(106, 84); g.lineTo(100, 128); g.lineTo(28, 128); g.fill();   // beard
      g.fillStyle = '#b98a66'; g.beginPath(); g.ellipse(64, 82, 22, 7, 0, 0, 7); g.fill();
      for (let i = 0; i < 12; i++) stroke([30 + i * 6.4, 96 + (i % 3) * 4, 32 + i * 6.4, 112 + (i % 2) * 6], 1.8, '#6a6a78');
      stroke([50, 100, 78, 100], 4.5);
    } else if (kind === 'rook') {
      g.fillStyle = '#d9b48f'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#b58e6c'; g.beginPath(); g.moveTo(0, 40); g.lineTo(28, 62); g.lineTo(30, 100); g.lineTo(52, 128); g.lineTo(0, 128); g.fill();
      g.fillStyle = ink; g.fillRect(0, 0, S, 26);                                          // the shade of the cap peak
      const e = EX[expr] || EX.angry;
      eye(42, 60, 11, Math.max(1, e[0] - 1), '#ffd23a', e[1] + 0.15); eye(86, 60, 11, Math.max(1, e[0] - 1), '#ffd23a', e[1] + 0.15);
      stroke([26, 40, 54, 49 + e[2] * 0.4], 6); stroke([102, 40, 74, 49 + e[2] * 0.4], 6);
      stroke([66, 56, 70, 80, 62, 84], 3);
      stroke([40, 92, 64, 88, 88, 92], 6, '#b9bcc8'); stroke([40, 92, 30, 98], 4, '#b9bcc8'); stroke([88, 92, 98, 98], 4, '#b9bcc8');   // moustache
      if (expr === 'hurt' || expr === 'dead') { g.fillStyle = ink; g.beginPath(); g.ellipse(64, 104, 11, 7, 0, 0, 7); g.fill(); }
      else stroke([50, 103, 70, 104, 82, 99], 3.5);
      stroke([96, 30, 104, 64, 98, 90], 2.5, '#8a1f24');                                  // a duelling scar, kept on purpose
      g.fillStyle = '#b9bcc8'; g.fillRect(52, 110, 24, 14);
    } else if (kind === 'halfmask') {
      g.fillStyle = '#e6c79a'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#e8c25a'; g.beginPath(); g.moveTo(0, 0); g.lineTo(S, 0); g.lineTo(S, 70); g.lineTo(78, 84); g.lineTo(64, 74); g.lineTo(50, 84); g.lineTo(0, 70); g.fill();
      g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 70); g.lineTo(50, 84); g.lineTo(64, 74); g.lineTo(78, 84); g.lineTo(S, 70); g.stroke();
      g.fillStyle = '#b8902e'; g.fillRect(0, 0, 26, 70);
      const lit = expr === 'dead' ? null : (expr === 'bound' ? '#19d3c5' : '#ffffff');
      [[42, -1], [86, 1]].forEach(a => { g.fillStyle = ink; g.beginPath(); g.moveTo(a[0] - 17, 50 + a[1] * 5); g.lineTo(a[0] + 17, 50 - a[1] * 5); g.lineTo(a[0] + 12, 64); g.lineTo(a[0] - 12, 64); g.fill();
        if (lit) { g.fillStyle = lit; g.beginPath(); g.arc(a[0], 58, expr === 'angry' ? 4.6 : 3.2, 0, 7); g.fill(); } });
      stroke([64, 6, 64, 40], 2.5, '#8a6a1e'); stroke([40, 20, 56, 30], 2, '#8a6a1e'); stroke([88, 20, 72, 30], 2, '#8a6a1e');
      stroke([52, 102, 76, 102], 4); stroke([58, 112, 70, 112], 2);
    } else if (kind === 'grille') {
      g.fillStyle = '#9aa1b8'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#6f7690'; g.beginPath(); g.moveTo(0, 20); g.lineTo(28, 50); g.lineTo(24, 128); g.lineTo(0, 128); g.fill();
      const lit = expr === 'dead' ? null : (expr === 'bound' ? '#19d3c5' : '#ff3b30');
      g.fillStyle = ink; g.fillRect(22, 46, 84, 18); g.fillRect(56, 46, 16, 62);          // the T
      if (lit) { g.fillStyle = lit; g.beginPath(); g.arc(42, 55, expr === 'angry' ? 5 : 3.6, 0, 7); g.fill(); g.beginPath(); g.arc(86, 55, expr === 'angry' ? 5 : 3.6, 0, 7); g.fill(); }
      for (let x = 34; x < 100; x += 11) if (x < 54 || x > 74) stroke([x, 78, x, 112], 4);
      stroke([20, 72, 108, 72], 3); stroke([14, 30, 114, 30], 3, '#e8c25a');
      [[18, 38], [110, 38], [18, 118], [110, 118]].forEach(p => { g.fillStyle = '#e8c25a'; g.beginPath(); g.arc(p[0], p[1], 3.5, 0, 7); g.fill(); });
    } else {
      // 'visor': the Dock Guard's helm. White enamel, one slit, somebody behind it.
      g.fillStyle = '#efe8d4'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#c4bda8'; g.beginPath(); g.moveTo(0, 26); g.lineTo(28, 54); g.lineTo(22, 128); g.lineTo(0, 128); g.fill();
      const lit = expr === 'dead' ? null : (expr === 'bound' ? '#19d3c5' : '#5ff2e2');
      g.fillStyle = ink; g.beginPath(); g.moveTo(20, 48); g.lineTo(108, 48); g.lineTo(102, 68); g.lineTo(26, 68); g.fill();
      if (lit) { g.fillStyle = lit; g.beginPath(); g.arc(44, 58, expr === 'angry' ? 5 : 3.4, 0, 7); g.fill(); g.beginPath(); g.arc(84, 58, expr === 'angry' ? 5 : 3.4, 0, 7); g.fill(); }
      g.fillStyle = '#efe8d4'; g.fillRect(60, 44, 8, 30); g.strokeStyle = ink; g.lineWidth = 2.5; g.strokeRect(60, 44, 8, 30);
      stroke([30, 84, 98, 84], 3); for (let x = 44; x < 90; x += 10) stroke([x, 92, x, 106], 3);
      stroke([12, 36, 116, 36], 4, '#e8c25a'); stroke([100, 80, 94, 100, 100, 114], 2.2);
    }
  }
//@@HEADGEAR
    if (sp.hair === 'kael') {
      // gold, cropped at the sides, pushed up at the front; one streak the Gilding never took
      part('head', tbox(0.25, 0.09, 0.26, 0.82, 1), 0, 0.23, -0.02, pal.hair, [-0.1, 0, 0]);
      part('head', tbox(0.245, 0.18, 0.09, 1, 0.8), 0, 0.13, -0.105, pal.hair);
      part('head', tbox(0.04, 0.1, 0.14), 0.118, 0.18, -0.03, pal.hair, null, 0.01);
      part('head', tbox(0.04, 0.1, 0.14), -0.118, 0.18, -0.03, pal.hair, null, 0.01);
      [[-0.075, 0.3, 0.07, 0.5, 0.3], [0, 0.325, 0.085, 0.62, 0], [0.075, 0.3, 0.07, 0.5, -0.3], [-0.045, 0.32, -0.01, 0.1, 0.2], [0.05, 0.315, -0.02, 0.05, -0.2], [0, 0.3, -0.09, -0.5, 0]].forEach((s, i) =>
        part('head', tbox(0.07, 0.15, 0.075, 0.12, 1), s[0], s[1], s[2], i === 2 ? pal.streak : pal.hair, [s[3], 0, s[4]], 0.014));
      // more of it: a second row behind the first, the nape, and what falls over the band
      [[-0.09, 0.285, -0.06, -0.25, 0.45], [0.09, 0.285, -0.06, -0.25, -0.45], [-0.035, 0.31, -0.06, -0.3, 0.12], [0.04, 0.305, -0.07, -0.35, -0.15], [-0.06, 0.2, -0.14, -0.9, 0.2], [0.06, 0.2, -0.14, -0.9, -0.2], [0, 0.17, -0.15, -1.1, 0]].forEach((s, i) =>
        part('head', tbox(0.065, 0.13, 0.07, 0.12, 1), s[0], s[1], s[2], pal.hair, [s[3], 0, s[4]], 0.012));
      part('head', tbox(0.05, 0.07, 0.03, 1, 0.3), -0.05, 0.225, 0.118, pal.hair, [0.25, 0, 0.3], 0.008); part('head', tbox(0.04, 0.06, 0.03, 1, 0.3), 0.065, 0.23, 0.115, pal.streak, [0.25, 0, -0.35], 0.008);
      part('head', tbox(0.258, 0.026, 0.268), 0, 0.243, -0.008, pal.band, null, 0.006);   // the band
    }
    if (sp.hair === 'tavi') {
      part('head', tbox(0.26, 0.09, 0.27, 0.85, 1), 0, 0.23, -0.02, pal.hair); part('head', tbox(0.25, 0.2, 0.09, 1, 0.85), 0, 0.12, -0.108, pal.hair);
      part('head', tbox(0.04, 0.14, 0.14), 0.12, 0.15, -0.03, pal.hair, null, 0.01); part('head', tbox(0.04, 0.14, 0.14), -0.12, 0.15, -0.03, pal.hair, null, 0.01);
      part('head', tbox(0.1, 0.07, 0.1, 0.5, 1), 0.05, 0.27, 0.08, pal.hair, [0.3, 0, -0.2], 0.012);
    }
    if (sp.hair === 'ilse') {   // grey, drawn back hard, knotted
      part('head', tbox(0.255, 0.08, 0.265, 0.85, 1), 0, 0.228, -0.02, pal.hair);
      part('head', tbox(0.25, 0.2, 0.09, 1, 0.85), 0, 0.12, -0.108, pal.hair);
      part('head', tbox(0.035, 0.1, 0.13), 0.12, 0.17, -0.03, pal.hair, null, 0.01); part('head', tbox(0.035, 0.1, 0.13), -0.12, 0.17, -0.03, pal.hair, null, 0.01);
      part('head', tbox(0.11, 0.11, 0.1), 0, 0.2, -0.19, pal.hair, null, 0.012);
    }
    if (sp.hair === 'brand') {
      part('head', tbox(0.25, 0.07, 0.26, 0.85, 1), 0, 0.225, -0.02, pal.hair);
      part('head', tbox(0.245, 0.16, 0.08, 1, 0.85), 0, 0.14, -0.108, pal.hair);
      part('head', tbox(0.035, 0.09, 0.13), 0.12, 0.17, -0.03, pal.hair, null, 0.01); part('head', tbox(0.035, 0.09, 0.13), -0.12, 0.17, -0.03, pal.hair, null, 0.01);
      part('head', tbox(0.2, 0.1, 0.09, 1, 0.6), 0, 0.02, 0.085, pal.hair, [0.25, 0, 0], 0.012);   // the beard, standing off the jaw
    }
    if (sp.hood) {
      part('head', tbox(0.29, 0.16, 0.29, 0.72, 1), 0, 0.235, -0.025, pal.top);
      part('head', tbox(0.28, 0.26, 0.11, 1, 0.9), 0, 0.11, -0.115, pal.top);
      part('head', tbox(0.05, 0.25, 0.2), 0.13, 0.12, -0.02, pal.top); part('head', tbox(0.05, 0.25, 0.2), -0.13, 0.12, -0.02, pal.top);
      part('chest', tbox(0.36 * b, 0.09, 0.3 * b), 0, 0.29, -0.01, pal.trim);
      part('head', tbox(0.06, 0.1, 0.06, 0.2, 1), 0, 0.33, -0.06, pal.top, [-0.5, 0, 0], 0.012);   // the cowl's point
    }
    if (sp.helm === 'guard') {
      part('head', tbox(0.3, 0.15, 0.3, 0.7, 1), 0, 0.235, -0.02, pal.hair);
      part('head', tbox(0.29, 0.25, 0.11, 1, 0.92), 0, 0.11, -0.115, pal.hair);
      part('head', tbox(0.05, 0.24, 0.21), 0.135, 0.12, -0.02, pal.hair); part('head', tbox(0.05, 0.24, 0.21), -0.135, 0.12, -0.02, pal.hair);
      part('head', tbox(0.035, 0.09, 0.3, 1, 1), 0, 0.33, -0.03, pal.top, null, 0.012);            // crest, in the dock's teal
      part('head', tbox(0.31, 0.03, 0.31), 0, 0.165, -0.02, pal.trim, null, 0.006);
      part('chest', tbox(0.38 * b, 0.07, 0.3 * b), 0, 0.29, -0.01, pal.hair);                      // gorget
    }
    if (sp.helm === 'warden') {
      part('head', tbox(0.31, 0.2, 0.31, 0.62, 1), 0, 0.25, -0.02, pal.hair);
      part('head', tbox(0.3, 0.27, 0.12, 1, 0.92), 0, 0.11, -0.12, pal.hair);
      part('head', tbox(0.055, 0.27, 0.22), 0.14, 0.11, -0.02, pal.hair); part('head', tbox(0.055, 0.27, 0.22), -0.14, 0.11, -0.02, pal.hair);
      part('head', tbox(0.05, 0.2, 0.34, 1, 1), 0, 0.4, -0.04, pal.shirt, null, 0.014);            // the red comb
      part('head', tbox(0.33, 0.035, 0.33), 0, 0.16, -0.02, pal.trim, null, 0.006);
      part('chest', tbox(0.4 * b, 0.1, 0.32 * b), 0, 0.3, -0.01, pal.hair);
    }
    if (sp.hat === 'captain') {
      part('head', tbox(0.25, 0.06, 0.26, 0.85, 1), 0, 0.215, -0.02, pal.hair);                    // grey hair under it
      part('head', tbox(0.245, 0.15, 0.08, 1, 0.85), 0, 0.14, -0.108, pal.hair);
      part('head', limb(0.15, 0.128, 0.11), 0, 0.3, -0.01, pal.top);                               // the white crown
      part('head', limb(0.132, 0.132, 0.04), 0, 0.255, -0.01, pal.shirt, null, 0.004);             // red band
      part('head', tbox(0.2, 0.02, 0.13, 1, 1), 0, 0.243, 0.12, 0x15151f, [0.22, 0, 0], 0.012);   // peak
      part('head', tbox(0.05, 0.05, 0.02), 0, 0.3, 0.13, pal.trim, [0, 0, 0.785], 0.006);          // badge
      part('head', tbox(0.04, 0.24, 0.07, 0.3, 1), 0.13, 0.42, -0.04, pal.shirt, [-0.25, 0, -0.2], 0.014);   // plume
    }
    if (sp.armor) {
      // the Accredited plate they gave him, worn like a valve man wears a harness: for use
      part('chest', tbox(0.5 * b, 0.1, 0.29 * b, 1, 0.92), 0, 0.235, 0, pal.top, null, 0.014);                 // collar plate
      part('chest', tbox(0.3 * b, 0.05, 0.05), 0, 0.215, 0.135 * b, pal.trim, null, 0.008);
      part('chest', tbox(0.11, 0.11, 0.03), 0, 0.1, 0.14 * b, pal.trim, [0, 0, 0.785], 0.008);                 // the sun they pinned on him
      part('spine', tbox(0.3 * b, 0.07, 0.24 * b), 0, 0.14, 0, pal.trim, null, 0.008); part('spine', tbox(0.28 * b, 0.07, 0.235 * b), 0, 0.04, 0, pal.top, null, 0.008);
      part('hips', tbox(0.38 * b, 0.07, 0.27 * b), 0, 0.09, 0, pal.trim, null, 0.012); part('hips', tbox(0.09, 0.09, 0.04), 0, 0.09, 0.14 * b, pal.top, null, 0.008);
      part('hips', tbox(0.15 * b, 0.36, 0.035, 1, 0.8), 0, -0.14, 0.125 * b, pal.shirt, null, 0.012);         // the violet fall
      [['L', 1], ['R', -1]].forEach(q => {
        part('th' + q[0], tbox(0.17 * b, 0.26, 0.06, 1, 0.85), 0.045 * q[1], -0.12, 0.05, pal.top, [0, 0.5 * q[1], 0], 0.012);   // tassets
        part('th' + q[0], tbox(0.17 * b, 0.035, 0.065), 0.045 * q[1], -0.24, 0.05, pal.trim, [0, 0.5 * q[1], 0], 0.006);
        part('shn' + q[0], tbox(0.13 * b, 0.26, 0.08, 0.9, 1.05), 0, -0.2, 0.045, pal.top, null, 0.012);                         // greaves
        part('shn' + q[0], tbox(0.14 * b, 0.07, 0.11), 0, -0.03, 0.05, pal.trim, null, 0.01);                                    // knee
        part('sh' + q[0], tbox(0.24 * b, 0.1, 0.25 * b, 0.75, 1), 0.03 * q[1], 0.075, 0, pal.top, [0, 0, -0.22 * q[1]], 0.014);  // big pauldron under the gilt rim
      });
      part('elR', tbox(0.14 * b, 0.2, 0.14 * b, 1, 0.85), 0, -0.14, 0, pal.top, null, 0.012); part('elR', tbox(0.145 * b, 0.035, 0.145 * b), 0, -0.05, 0, pal.trim, null, 0.006);
    }
    if (sp.pauldron) {
      part('shL', tbox(0.2 * b, 0.07, 0.2 * b, 0.8, 1), 0.02, 0.06, 0, pal.trim, [0, 0, -0.18], 0.012);
      part('shR', tbox(0.2 * b, 0.07, 0.2 * b, 0.8, 1), -0.02, 0.06, 0, pal.trim, [0, 0, 0.18], 0.012);
    }
    if (sp.tabard) { part('hips', tbox(0.22 * b, 0.42, 0.03, 1, 0.85), 0, -0.16, 0.125 * b, pal.shirt); part('hips', tbox(0.1 * b, 0.1, 0.035), 0, -0.08, 0.13 * b, pal.trim, [0, 0, 0.785], 0.006); }
    if (sp.sash) part('chest', tbox(0.5 * b, 0.07, 0.27 * b), 0, 0.12, 0, pal.shirt, [0, 0, 0.6], 0.008);
    if (!sp.hood && !sp.helm) { part('head', tbox(0.03, 0.06, 0.04), 0.118, 0.13, 0, pal.skin, null, 0.008); part('head', tbox(0.03, 0.06, 0.04), -0.118, 0.13, 0, pal.skin, null, 0.008); }
    if (sp.kit) {   // what a man on a post actually wears: plate where he gets hit, a belt with things on it, hands
      const k = sp.kit, c1 = k.plate, c2 = k.trim, cb = k.belt;
      part('neck', tbox(0.19, 0.06, 0.19, 0.85, 1), 0, 0.0, 0, c1, null, 0.01);
      if (k.mantle) { part('chest', tbox(0.56 * b, 0.1, 0.34 * b, 0.7, 1), 0, 0.22, -0.01, k.mantle, null, 0.014); part('chest', tbox(0.58 * b, 0.025, 0.35 * b), 0, 0.165, -0.01, c2, null, 0.006); }
      else part('chest', tbox(0.47 * b, 0.07, 0.28 * b, 1, 0.92), 0, 0.24, 0, c1, null, 0.012);
      if (!k.light) { part('chest', tbox(0.34 * b, 0.2, 0.05, 0.85, 1), 0, 0.1, 0.13 * b, c1, null, 0.012); part('chest', tbox(0.35 * b, 0.03, 0.055), 0, 0.0, 0.13 * b, c2, null, 0.006); part('chest', tbox(0.32 * b, 0.22, 0.04, 0.9, 1), 0, 0.09, -0.135 * b, c1, null, 0.01); }
      if (k.officer) { [-1, 1].forEach(q => { part('chest', tbox(0.035, 0.035, 0.03), 0.07 * q * b, 0.15, 0.14 * b, c2, null, 0.004); part('chest', tbox(0.035, 0.035, 0.03), 0.07 * q * b, 0.07, 0.14 * b, c2, null, 0.004); }); part('chest', tbox(0.09, 0.05, 0.03), -0.13 * b, 0.13, 0.14 * b, cb, null, 0.005); }
      part('hips', tbox(0.38 * b, 0.06, 0.27 * b), 0, 0.09, 0, cb, null, 0.01); part('hips', tbox(0.07, 0.07, 0.04), 0, 0.09, 0.14 * b, c2, null, 0.008);
      part('hips', tbox(0.09, 0.12, 0.07), 0.16 * b, 0.02, 0.07, cb, null, 0.008);
      if (k.sheath) { part('hips', tbox(0.045, 0.34, 0.06, 1, 0.6), -0.2 * b, -0.1, -0.04, cb, [0.3, 0, 0], 0.01); part('hips', tbox(0.055, 0.05, 0.07), -0.2 * b, 0.06, 0.0, c2, null, 0.006); }
      if (k.lamp) { part('hips', tbox(0.07, 0.1, 0.07), -0.17 * b, -0.0, 0.08, 0x23232e, null, 0.006); part('hips', tbox(0.05, 0.055, 0.075), -0.17 * b, -0.0, 0.085, k.lamp, null, 0); }
      if (k.soot) { part('chest', tbox(0.34 * b, 0.11, 0.11), 0, 0.2, -0.17 * b, 0x5a5348, [0, 0, 0.12], 0.012); part('chest', tbox(0.05, 0.34, 0.03), 0.09 * b, 0.1, 0.125 * b, cb, [0, 0, -0.5], 0.006); part('neck', tbox(0.22, 0.07, 0.22, 0.9, 1), 0, 0.02, 0, c2, null, 0.01); part('chest', tbox(0.07, 0.2, 0.03, 1, 0.7), -0.08, 0.1, 0.13 * b, c2, [0, 0, 0.12], 0.006); }
      [['L', 1], ['R', -1]].forEach(q => {
        part('el' + q[0], tbox(0.13 * b, 0.16, 0.13 * b, 1, 0.85), 0, -0.15, 0, c1, null, 0.01); part('el' + q[0], tbox(0.137 * b, 0.03, 0.137 * b), 0, -0.07, 0, c2, null, 0.006);
        part('shn' + q[0], tbox(0.135 * b, 0.065, 0.1), 0, -0.03, 0.045, k.light ? c1 : c2, null, 0.008); part('shn' + q[0], tbox(0.15, 0.045, 0.16), 0, -0.25, 0, c2, null, 0.007);
        if (!k.light) { part('shn' + q[0], tbox(0.125 * b, 0.2, 0.075, 0.9, 1.05), 0, -0.17, 0.04, c1, null, 0.01); part('th' + q[0], tbox(0.15 * b, 0.2, 0.05, 1, 0.85), 0.04 * q[1], -0.1, 0.05, c1, [0, 0.45 * q[1], 0], 0.01); part('th' + q[0], tbox(0.155 * b, 0.03, 0.055), 0.04 * q[1], -0.19, 0.05, c2, [0, 0.45 * q[1], 0], 0.005); }
        if (!k.noSh) { part('sh' + q[0], tbox(0.2 * b, 0.08, 0.21 * b, 0.75, 1), 0.03 * q[1], 0.07, 0, c1, [0, 0, -0.2 * q[1]], 0.012); part('sh' + q[0], tbox(0.21 * b, 0.025, 0.22 * b), 0.03 * q[1], 0.03, 0, c2, [0, 0, -0.2 * q[1]], 0.006); }
        part('ha' + q[0], tbox(0.085, 0.045, 0.06, 1, 0.85), 0, -0.118, 0.03, k.hands, null, 0.008); part('ha' + q[0], tbox(0.028, 0.055, 0.04), 0.05 * q[1], -0.07, 0.03, k.hands, null, 0.006); part('ha' + q[0], tbox(0.095, 0.04, 0.1), 0, -0.02, 0, c2, null, 0.008);
      });
    }
//@@WEAPONS
    const steel = G.toon({ color: 0xd9dde6 }), dark = G.toon({ color: 0x23232e }), gilt = G.toon({ color: 0xe8c25a });
    if (sp.armor) {
      // ears, and hands that are hands: a thumb and a row of fingers closed on the hilt, and open on the off side
      { const sk = G.toon({ color: sp.pal.skin || 0xe6c79a }), kn = G.toon({ color: 0xefe8d4 }); model.mats.push(sk, kn);
        [-1, 1].forEach(k => add('head', tbox(0.03, 0.065, 0.045, 0.8, 0.7), sk, 0.119 * k, 0.135, -0.005, 0.008));
        add('haR', tbox(0.095, 0.045, 0.06, 1, 0.85), kn, 0, -0.118, 0.03, 0.01); add('haR', tbox(0.03, 0.06, 0.045), kn, 0.052, -0.07, 0.03, 0.008);
        [-0.03, -0.01, 0.01, 0.03].forEach((x, i) => add('haL', tbox(0.018, 0.06 - Math.abs(i - 1.5) * 0.008, 0.03, 0.7, 1), kn, x, -0.135, 0.01, 0.006)); add('haL', tbox(0.022, 0.05, 0.03, 0.7, 1), kn, 0.055, -0.09, 0.015, 0.006).rotation.z = 0.5; }
      // what the plate carries on it: gauntlet knuckles, a scabbard on the hip, the cord the washer hangs from, boot cuffs
      const dk = G.toon({ color: 0x2a2630 }), gl = G.toon({ color: 0xe8c25a }), iv = G.toon({ color: 0xefe8d4 }); model.mats.push(dk, gl, iv);
      add('haR', tbox(0.1, 0.05, 0.11), gl, 0, -0.02, 0, 0.01); add('haR', tbox(0.1, 0.04, 0.03), iv, 0, -0.09, 0.05, 0.008);
      add('hips', tbox(0.05, 0.6, 0.07, 1, 0.6), dk, 0.21, -0.22, -0.06, 0.012).rotation.x = 0.35; add('hips', tbox(0.06, 0.06, 0.08), gl, 0.21, 0.04, -0.01, 0.008);
      add('hips', tbox(0.1, 0.11, 0.06), dk, -0.19, -0.02, 0.1, 0.01);                                              // the pouch the tin's invoice lives in
      ['shnL', 'shnR'].forEach(b => add(b, tbox(0.15, 0.05, 0.16), gl, 0, -0.24, 0, 0.008));
      add('neck', tbox(0.2, 0.07, 0.2, 0.85, 1), iv, 0, 0.0, 0, 0.012);                                             // gorget
      add('chest', tbox(0.06, 0.2, 0.05), dk, 0.17, 0.05, -0.15, 0.008).rotation.z = 0.5; add('chest', tbox(0.06, 0.2, 0.05), dk, -0.17, 0.05, -0.15, 0.008).rotation.z = -0.5;   // cape straps
      add('head', tbox(0.02, 0.07, 0.02), gl, 0.125, 0.09, 0.02, 0.004);                                            // the Count's ring in one ear, never taken out
    }
    if (sp.cape) {
      // House Violet's cape, cut short so it does not catch on a valve wheel
      const cm = model.capeMat = G.toon({ color: SC.issue === 'stack' ? 0xf4efe2 : 0x5a3aa8 }), hem = G.toon({ color: 0xe8c25a }); model.mats.push(cm, hem);
      add('chest', tbox(0.5, 0.08, 0.12), cm, 0, 0.29, -0.1, 0.016);
      add('sc1', tbox(0.5, 0.03, 0.31), cm, 0, 0, -0.13, 0.016); add('sc2', tbox(0.56, 0.03, 0.31), cm, 0, 0, -0.13, 0.016); add('sc3', tbox(0.62, 0.03, 0.31), cm, 0, 0, -0.13, 0.016);
      add('sc3', tbox(0.63, 0.034, 0.045), hem, 0, 0, -0.275, 0.008);
      const brass = G.toon({ color: 0xb5793a }); model.mats.push(brass);
      add('elL', limb(0.088, 0.076, 0.2), brass, 0, -0.13, 0, 0.014);                                          // the valve ram on his off arm
    }
    if (sp.weapon === 'kblade') {
      add("haR", tbox(0.03, 0.6, 0.07, 0.6, 1), steel, 0, -0.43, 0.005, 0.014); add("haR", tbox(0.012, 0.5, 0.074), gilt, 0, -0.4, 0.005, 0);
      // the bank hook: the curved knife a valve tech cuts a seized seat out with, made long, in their steel
      [[-0.8, 0.035, 0.45, 0.2], [-0.9, 0.12, 1.0, 0.2], [-0.93, 0.24, 1.6, 0.18], [-0.88, 0.33, 2.3, 0.12]].forEach(c => { add('haR', tbox(0.028, c[3], 0.062, 0.6, 1), steel, 0, c[0], c[1], 0.012).rotation.x = -c[2]; });
     
      add('haR', tbox(0.06, 0.035, 0.22), gilt, 0, -0.12, 0.005, 0.01); add('haR', tbox(0.045, 0.05, 0.045), gilt, 0, 0.07, 0, 0.008); model.mats.push(steel, gilt);
    }
    if (sp.washer) {
      // Seren's washer, on a cord. The only round thing he owns.
      const brass = G.toon({ color: 0xc9923a }); model.mats.push(brass);
      const w = add('chest', new THREE.TorusGeometry(0.036, 0.013, 6, 12), brass, -0.03, 0.1, 0.145, 0.008);
      add('chest', tbox(0.012, 0.16, 0.012), dark, -0.03, 0.2, 0.14, 0); model.mats.push(dark); model.washer = w;
    }
    if (sp.weapon === 'wrench') { add('haR', limb(0.028, 0.032, 0.5), dark, 0, -0.22, 0, 0.012); add('haR', tbox(0.05, 0.1, 0.13), steel, 0, -0.5, 0, 0.01); add('haR', tbox(0.05, 0.08, 0.035), steel, 0, -0.57, 0.048, 0.008); add('haR', tbox(0.05, 0.08, 0.035), steel, 0, -0.57, -0.048, 0.008); }
    if (sp.weapon === 'baton') { add('haR', limb(0.03, 0.036, 0.78), dark, 0, -0.34, 0, 0.014); add('haR', limb(0.042, 0.042, 0.07), gilt, 0, -0.03, 0, 0.01); add('haR', limb(0.04, 0.04, 0.05), gilt, 0, -0.66, 0, 0.008); add('haR', tbox(0.026, 0.2, 0.11, 0.25, 1), steel, 0, -0.8, 0.035, 0.012); add('haR', tbox(0.024, 0.07, 0.1), steel, 0, -0.74, -0.06, 0.008).rotation.x = 0.7; model.mats.push(dark, gilt, steel); }   // a dock bill: a boat hook with an edge on it
    if (sp.weapon2) { add('haL', tbox(0.028, 0.56, 0.06, 0.15, 1), steel, 0, -0.4, 0.01, 0.014); add('haL', tbox(0.05, 0.03, 0.16), gilt, 0, -0.1, 0.01, 0.01); }
    if (sp.weapon === 'blade') { add('haR', tbox(0.028, 0.56, 0.06, 0.15, 1), steel, 0, -0.4, 0.01, 0.014); add('haR', tbox(0.05, 0.03, 0.16), gilt, 0, -0.1, 0.01, 0.01); model.mats.push(steel, gilt); }
    if (sp.weapon === 'halberd') {
      // held short, a hand under the head, the way a Warden carries it in a crowd
      add('haR', limb(0.03, 0.03, 1.5), dark, -0.075, 0.08, 0, 0.016);
      add('haR', tbox(0.03, 0.32, 0.28, 1, 0.35), steel, -0.075, -0.46, 0.13, 0.016); add('haR', tbox(0.04, 0.22, 0.07, 1, 0.1), steel, -0.075, -0.77, 0, 0.014);
      add('haR', limb(0.05, 0.05, 0.08), gilt, -0.075, -0.3, 0, 0.01); model.mats.push(steel, dark, gilt);
    }
    if (sp.weapon === 'halberd2') {
      // Brand's: carried upright at his side, butt on the stone
      add('haR', limb(0.028, 0.028, 2.5), dark, -0.07, 0.42, 0.03, 0.016);
      add('haR', tbox(0.03, 0.34, 0.3, 1, 0.35), steel, -0.07, 1.42, 0.16, 0.016).rotation.x = Math.PI;
      add('haR', tbox(0.04, 0.3, 0.07, 0.1, 1), steel, -0.07, 1.78, 0.03, 0.014); model.mats.push(steel, dark);
    }
    if (sp.weapon === 'gaff') {
      // a mooring gaff: what you haul a barge in with
      add('haR', limb(0.024, 0.024, 1.3), dark, 0, -0.52, 0, 0.014);
      add('haR', tbox(0.03, 0.05, 0.32), gilt, 0, -1.16, 0.14, 0.014); add('haR', tbox(0.03, 0.2, 0.05, 0.3, 1), gilt, 0, -1.05, 0.29, 0.014);
      add('haR', tbox(0.035, 0.22, 0.06, 1, 0.1), steel, 0, -1.28, 0, 0.012); model.mats.push(steel, dark, gilt);
    }
