// Starhaven — the prologue's cinematics and two more rooms, rebuilt in layers like the ones in cine2.js, plus the
// finish every scene gets: a vignette, a soft grade and a little film grain. This is a story game; these are its pages.
(function (SH) {
  const C = SH.cine, { W, H, rnd, R, sky, glow, cam, layer, starfield, shooting, moon, drift, person, lantern } = C._h;
  const ease = k => k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k);

  // the finish: called after any scene is drawn
  C.post = function (g, t, warm) {
    const vg = g.createRadialGradient(W / 2, H * 0.52, 50, W / 2, H * 0.52, 200); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(4,3,14,0.62)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    const tg = g.createLinearGradient(0, 0, 0, H); tg.addColorStop(0, 'rgba(4,3,14,0.35)'); tg.addColorStop(0.18, 'rgba(4,3,14,0)'); tg.addColorStop(0.84, 'rgba(4,3,14,0)'); tg.addColorStop(1, 'rgba(4,3,14,0.45)'); g.fillStyle = tg; g.fillRect(0, 0, W, H);
    g.globalAlpha = 0.05; for (let i = 0; i < 70; i++) R(g, rnd(i + (t >> 2) * 13) * W, rnd(i * 7 + (t >> 2) * 5) * H, 1, 1, i % 2 ? '#ffffff' : '#000000'); g.globalAlpha = 1;
  };

  function pineRow(g, base, col, snowCol, seed, n, hMin, hMax) {
    for (let i = 0; i < n; i++) { const x = rnd(i + seed) * (W + 60) - 30, h = hMin + rnd(i * 7 + seed) * (hMax - hMin);
      for (let k = 0; k < 4; k++) { const ty = base - h * 0.2 - k * h * 0.2, tw = (h * 0.24) * (1 - k * 0.2); g.fillStyle = col; g.beginPath(); g.moveTo(x, ty - h * 0.3); g.lineTo(x - tw, ty); g.lineTo(x + tw, ty); g.fill(); if (snowCol) { g.fillStyle = snowCol; g.beginPath(); g.moveTo(x, ty - h * 0.3); g.lineTo(x - tw * 0.7, ty - 2); g.lineTo(x - tw * 0.2, ty - h * 0.14); g.fill(); } }
      R(g, x - 1, base - h * 0.2, 3, h * 0.2, col); }
  }
  // the low star, drawn for the screen: a ball of white light trailing a veil. fall 0..1: it drops into the snow and goes out
  function stag(g, x, y, fall, t) {
    g.save(); g.translate(x, y - 26 + fall * 22);
    const R0 = 12 * (1 - fall * 0.5);
    for (let i = 0; i < 8; i++) { const k = i / 8; g.globalAlpha = (1 - k) * 0.45 * (1 - fall * 0.8); g.fillStyle = i % 2 ? '#cfd6ff' : '#fff6d8'; g.beginPath(); g.ellipse(-10 - k * 34, Math.sin(t * 0.06 + i) * 3 * k, R0 * (1 - k * 0.7), R0 * 0.5 * (1 - k * 0.6), 0, 0, 6.3); g.fill(); }
    g.globalAlpha = 1;
    glow(g, 0, 0, R0 * 3.4, 'rgba(255,250,235,' + (0.75 - fall * 0.6) + ')');
    g.fillStyle = fall < 1 ? '#ffffff' : '#c8c8d8'; g.beginPath(); g.arc(0, 0, R0 * 0.55, 0, 6.3); g.fill();
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + t * 0.01; g.globalAlpha = 0.8 - fall * 0.7; R(g, Math.cos(a) * R0 * 1.5 - 1, Math.sin(a) * R0 * 1.5 - 1, 2, 2, '#ffffff'); }
    g.globalAlpha = 1; g.restore();
  }


  // ---------------------------------------------------------------- The white stag
  C.hunt = function (g, t, cue) {
    const c = cam(t), shot = cue && cue.name === 'shoot' ? cue.t : -1, fall = shot < 12 ? 0 : ease((shot - 12) / 50), bloom = shot < 12 ? 0 : Math.min(1, (shot - 12) / 70);
    sky(g, ['#5a6c9c', '#8a9cc8', '#c4d0ec', '#eef2fc']);
    layer(g, c, 0.08, () => { glow(g, 232, 52, 90, 'rgba(255,246,216,0.5)'); g.fillStyle = '#c2cde8'; for (let i = -1; i < 7; i++) { g.beginPath(); g.moveTo(i * 64 - 20, 104); g.lineTo(i * 64 + 16, 58 + rnd(i * 3) * 22); g.lineTo(i * 64 + 60, 104); g.fill(); } });
    layer(g, c, 0.25, () => pineRow(g, 108, '#a9b6d8', null, 3, 18, 34, 60));
    layer(g, c, 0.45, () => { pineRow(g, 114, '#7f8fb8', '#e6ecfb', 9, 13, 44, 80); g.fillStyle = 'rgba(238,242,252,0.35)'; g.fillRect(-30, 84, W + 60, 34); });
    layer(g, c, 0.7, () => pineRow(g, 122, '#54648e', '#f4f8ff', 17, 9, 60, 104));
    layer(g, c, 1, () => {
      g.fillStyle = '#f4f8ff'; g.beginPath(); g.moveTo(-30, 124); g.quadraticCurveTo(90, 116, 170, 124); g.quadraticCurveTo(260, 130, 350, 120); g.lineTo(350, 150); g.lineTo(-30, 150); g.fill(); g.fillStyle = '#d6e0f6'; g.beginPath(); g.ellipse(120, 136, 60, 5, 0, 0, 6.3); g.ellipse(260, 140, 50, 4, 0, 0, 6.3); g.fill();
      for (let i = 0; i < 9; i++) { R(g, 150 + i * 9, 128 + (i % 2), 3, 1, '#b9c6ea'); if (i % 2) R(g, 151 + i * 9, 127, 1, 1, '#ffd27a'); }   // tracks that glitter
      const sx = 236, sy = 126;
      glow(g, sx, sy - 26, 54 + bloom * 120, 'rgba(255,246,216,' + (0.45 + bloom * 0.5) + ')');
      if (bloom > 0) { g.save(); g.translate(sx, sy - 16); for (let i = 0; i < 14; i++) { g.rotate(Math.PI / 7); g.fillStyle = 'rgba(255,224,150,' + (0.16 * bloom) + ')'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-7, -260 * bloom); g.lineTo(7, -260 * bloom); g.fill(); } g.restore(); }
      stag(g, sx, sy, fall, t);
      if (fall < 0.2) for (let k = 0; k < 3; k++) { const kk = ((t * 0.012 + k / 3) % 1); g.globalAlpha = 0.5 * (1 - kk); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(sx + 32 + kk * 9, sy - 40 - kk * 8, 1.5 + kk * 3, 0, 6.3); g.fill(); } g.globalAlpha = 1;   // its breath
      // Wren, half behind a trunk, bow drawn
      person(g, 'wren', 66, 132, 1, t);
      const pull = shot < 0 ? 1 : Math.max(0, 1 - shot / 3); g.strokeStyle = '#8a5a2a'; g.lineWidth = 2; g.beginPath(); g.arc(74, 104, 13, -1.25, 1.25); g.stroke(); g.strokeStyle = '#e8e0c8'; g.lineWidth = 1; g.beginPath(); g.moveTo(78, 92); g.lineTo(78 - pull * 9, 104); g.lineTo(78, 116); g.stroke();
      if (shot < 0) { R(g, 68, 103, 22, 1, '#6a4a2a'); R(g, 89, 102, 3, 3, '#e8eef8'); }
      else if (shot < 13) { const ax = 80 + (sx - 96) * (shot / 12); R(g, ax, 103 + shot * 0.5, 20, 1, '#6a4a2a'); R(g, ax + 19, 102 + shot * 0.5, 3, 3, '#e8eef8'); g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect(ax - 30, 103 + shot * 0.5, 30, 1); }
      if (bloom > 0) drift(g, t, 30, ['#ffd27a', '#fff6d8'], true, 77);
    });
    for (let i = 0; i < 60; i++) { const x = ((rnd(i) * W + t * (0.15 + rnd(i * 2) * 0.2) + Math.sin(t * 0.02 + i) * 6) % W + W) % W, y = (rnd(i * 5) * H + t * (0.3 + rnd(i * 3) * 0.3)) % H; R(g, x, y, i % 4 ? 1 : 2, i % 4 ? 1 : 2, '#ffffff'); }
    layer(g, c, 1.8, () => { R(g, -30, 0, 26, H, '#1c2440'); R(g, -6, 0, 3, H, '#2c3660'); g.fillStyle = '#1c2440'; g.beginPath(); g.moveTo(-10, 30); g.quadraticCurveTo(40, 34, 78, 20); g.lineTo(70, 30); g.quadraticCurveTo(36, 46, -10, 46); g.fill(); g.fillStyle = '#f4f8ff'; g.beginPath(); g.moveTo(-6, 30); g.quadraticCurveTo(38, 32, 74, 21); g.lineTo(60, 28); g.quadraticCurveTo(30, 36, -6, 34); g.fill(); });
    if (shot >= 12 && shot < 20) { g.fillStyle = 'rgba(255,255,255,' + (1 - (shot - 12) / 8) + ')'; g.fillRect(0, 0, W, H); }
    C.post(g, t);
  };

  // ---------------------------------------------------------------- That night: meat in the pot, and then the door
  C.cottage = function (g, t, cue) {
    const c = cam(t), d = cue && cue.name === 'door' ? cue.t : -1, open = d < 0 ? 0 : ease(d / 16), fl = 0.8 + 0.2 * Math.sin(t * 0.19) * Math.sin(t * 0.11);
    R(g, 0, 0, W, H, '#1a100c');
    layer(g, c, 0.7, () => {
      for (let i = -2; i < 24; i++) { R(g, i * 15, 0, 14, 128, SH.shade('#4a3020', 0.8 + rnd(i) * 0.4)); R(g, i * 15, 0, 1, 128, 'rgba(0,0,0,0.3)'); }
      R(g, -30, 28, W + 60, 5, '#2a1a12'); R(g, 100, 0, 6, 128, '#2a1a12'); R(g, 214, 0, 6, 128, '#2a1a12');
      R(g, 134, 46, 34, 30, '#0c1430'); R(g, 132, 44, 38, 3, '#2a1a12'); R(g, 150, 46, 2, 30, '#2a1a12'); R(g, 134, 60, 34, 2, '#2a1a12');   // a window: snow outside
      for (let i = 0; i < 9; i++) R(g, 135 + rnd(i) * 32, 47 + ((rnd(i * 3) * 28 + t * 0.3) % 28), 1, 1, '#ffffff');
      for (let i = 0; i < 4; i++) { R(g, 186 + i * 7, 34, 1, 12 + i % 2 * 4, '#6a4a2a'); R(g, 184 + i * 7, 44 + i % 2 * 4, 5, 7, i % 2 ? '#7a8a4a' : '#8a5a3a'); }   // herbs hung to dry
      glow(g, 52, 100, 130 * fl, 'rgba(255,150,70,0.34)');
    });
    layer(g, c, 0.85, () => {   // the hearth and the pot
      R(g, 22, 62, 62, 68, '#3a2a26'); R(g, 16, 56, 74, 8, '#4a3832'); R(g, 30, 74, 46, 56, '#0c0606');
      for (let i = 0; i < 6; i++) { const fx = 38 + i * 6, h = (12 + rnd(i) * 16) * (0.7 + 0.3 * Math.sin(t * 0.2 + i * 1.9)), sw = Math.sin(t * 0.13 + i) * 2; g.fillStyle = '#ff6a3d'; g.beginPath(); g.moveTo(fx - 4, 124); g.quadraticCurveTo(fx + sw, 124 - h * 0.6, fx + sw, 124 - h); g.quadraticCurveTo(fx + 3, 124 - h * 0.5, fx + 4, 124); g.fill(); g.fillStyle = '#ffd27a'; g.beginPath(); g.moveTo(fx - 2, 124); g.quadraticCurveTo(fx, 124 - h * 0.4, fx + sw * 0.5, 124 - h * 0.6); g.lineTo(fx + 2, 124); g.fill(); }
      R(g, 40, 96, 26, 16, '#1a1414'); R(g, 38, 94, 30, 3, '#3a3030'); R(g, 52, 70, 2, 24, '#1a1414');
      for (let k = 0; k < 4; k++) { const kk = ((t * 0.012 + k / 4) % 1); g.globalAlpha = 0.3 * (1 - kk); g.fillStyle = '#e8e0d8'; g.beginPath(); g.arc(53 + Math.sin(kk * 6 + k) * 4, 92 - kk * 26, 2 + kk * 4, 0, 6.3); g.fill(); } g.globalAlpha = 1;
    });
    layer(g, c, 1, () => {
      R(g, -30, 128, W + 60, 30, '#241610'); for (let i = -2; i < 16; i++) R(g, i * 24, 128, 23, 1, '#3a261a');
      R(g, 128, 112, 70, 4, '#6a4a2e'); R(g, 134, 116, 4, 14, '#4a3020'); R(g, 188, 116, 4, 14, '#4a3020');   // the table
      for (const bx of [140, 160, 180]) { R(g, bx, 108, 9, 4, '#c8b890'); R(g, bx + 1, 107, 7, 1, '#8a4a2a'); }
      const bend = open * 4; R(g, 168, 100, 2, 8, '#f4f0e0'); g.fillStyle = '#ffb057'; g.beginPath(); g.moveTo(167, 100); g.quadraticCurveTo(169 - bend, 94, 169 - bend * 1.6, 91 + Math.sin(t * 0.3)); g.quadraticCurveTo(171 - bend, 96, 171, 100); g.fill(); glow(g, 169, 97, 22 * (1 - open * 0.5), 'rgba(255,200,120,0.5)');
      person(g, 'lissa', 124, 132, 1, t, d > 10 ? { emote: { e: '!', t: 30 } } : null); person(g, 'nessa', 208, 132, d >= 0 ? 1 : -1, t); person(g, 'wren', 162, 134, d >= 0 ? 1 : -1, t);
      // the door
      const dx = 262; R(g, dx - 4, 56, 44, 74, '#1a100c');
      if (open > 0) { const cg = g.createLinearGradient(dx, 0, dx + 36, 0); cg.addColorStop(0, 'rgba(190,214,255,' + open + ')'); cg.addColorStop(1, 'rgba(120,150,220,' + open + ')'); g.fillStyle = cg; g.fillRect(dx, 60, 36, 70);
        g.fillStyle = 'rgba(190,214,255,' + 0.28 * open + ')'; g.beginPath(); g.moveTo(dx, 130); g.lineTo(dx + 36, 130); g.lineTo(dx - 40, 150); g.lineTo(dx - 150, 150); g.fill();
        glow(g, dx + 18, 96, 60 * open, 'rgba(255,220,140,' + 0.5 * open + ')'); if (d > 12) person(g, 'rowan', dx + 16, 132, -1, t);
        for (let i = 0; i < 30; i++) { const k = ((t * 0.02 + rnd(i)) % 1); R(g, dx + 20 - k * 190, 66 + rnd(i * 3) * 70 + Math.sin(k * 9 + i) * 5, 2, 1, 'rgba(255,255,255,' + (1 - k) * open + ')'); } }
      R(g, dx + (open > 0 ? 34 : 0), 60, open > 0 ? 6 : 36, 70, '#5a3e2a'); if (!open) { R(g, dx + 4, 64, 28, 30, '#4a3020'); R(g, dx + 4, 98, 28, 28, '#4a3020'); R(g, dx + 29, 96, 3, 3, '#c8a050'); }
    });
    if (open > 0) { g.fillStyle = 'rgba(120,150,220,' + 0.14 * open + ')'; g.fillRect(0, 0, W, H); }
    layer(g, c, 1.8, () => { g.fillStyle = '#0c0706'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 100); g.quadraticCurveTo(-4, 104, 10, 150); g.fill(); R(g, 300, 0, 40, 18, '#0c0706'); });
    if (d >= 0 && d < 8) { g.fillStyle = 'rgba(220,235,255,' + (1 - d / 8) * 0.8 + ')'; g.fillRect(0, 0, W, H); }
    C.post(g, t);
  };

  // ---------------------------------------------------------------- Beyond the Wall
  C.wall = function (g, t) {
    const c = cam(t), walk = Math.min(60, t * 0.05);
    sky(g, ['#070a1e', '#141c44', '#2c3a72', '#5a5a9a']);
    layer(g, c, 0.05, () => { starfield(g, t, 80, 14, 90); moon(g, 60, 26, 9); });
    layer(g, c, 0.2, () => { g.fillStyle = '#1a2248'; for (let i = -1; i < 7; i++) { g.beginPath(); g.moveTo(i * 60 - 20, 112); g.lineTo(i * 60 + 12, 76 + rnd(i * 2) * 18); g.lineTo(i * 60 + 56, 112); g.fill(); } R(g, 24, 104, 8, 6, '#0c1030'); R(g, 27, 106, 2, 2, '#ffd27a'); glow(g, 28, 107, 9, 'rgba(255,210,122,0.5)'); });   // the cottage, one light, far behind
    layer(g, c, 0.5, () => {   // the Wall: not stone, a standing curtain of light across the whole world
      for (let x = 150; x < W + 30; x += 3) { const h = 118 + Math.sin(x * 0.07 + t * 0.02) * 4, a = 0.10 + 0.08 * Math.sin(x * 0.19 + t * 0.03); g.fillStyle = 'rgba(' + (x % 9 < 3 ? '160,255,220' : x % 9 < 6 ? '190,170,255' : '255,180,220') + ',' + a + ')'; g.fillRect(x, 124 - h, 3, h); }
      const ag = g.createLinearGradient(150, 0, 210, 0); ag.addColorStop(0, 'rgba(255,255,255,0)'); ag.addColorStop(1, 'rgba(255,255,255,0.10)'); g.fillStyle = ag; g.fillRect(150, 0, 60, 124);
      glow(g, 226, 100, 46 + Math.sin(t * 0.04) * 4, 'rgba(255,246,216,0.55)'); g.fillStyle = 'rgba(255,246,216,0.7)'; g.beginPath(); g.moveTo(214, 124); g.lineTo(214, 96); g.quadraticCurveTo(226, 78, 238, 96); g.lineTo(238, 124); g.fill();   // the door in it
    });
    layer(g, c, 1, () => {
      g.fillStyle = '#dfe6fb'; g.beginPath(); g.moveTo(-30, 128); g.quadraticCurveTo(150, 118, 350, 126); g.lineTo(350, 150); g.lineTo(-30, 150); g.fill();
      for (let i = 0; i < 14; i++) R(g, 30 + i * 8, 131 + (i % 2) * 2, 3, 1, '#aab6da');   // two sets of footprints, going one way
      const wx = 104 + walk; person(g, 'rowan', wx + 34, 133, 1, t); person(g, 'wren', wx, 134, t % 420 > 300 ? -1 : 1, t);   // she looks back once
    });
    drift(g, t, 26, ['#ffffff', '#cfd6ff'], false, 4);
    layer(g, c, 1.8, () => { g.fillStyle = '#070a1a'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 92); g.lineTo(-10, 60); g.lineTo(6, 100); g.lineTo(28, 150); g.fill(); g.fillStyle = '#dfe6fb'; g.beginPath(); g.moveTo(-10, 60); g.lineTo(-22, 80); g.lineTo(-8, 74); g.lineTo(2, 88); g.fill(); });
    C.post(g, t);
  };

  // ---------------------------------------------------------------- Under the Mountain: his blood, and she wakes fae
  C.rebirth = function (g, t, cue) {
    const c = cam(t), r = cue && cue.name === 'rise' ? cue.t : -1, up = r < 0 ? 0 : ease(r / 90), light = r < 0 ? 0 : Math.min(1, r / 60);
    sky(g, ['#04030a', '#0a0816', '#120e22', '#0a0816']);
    layer(g, c, 0.3, () => { g.fillStyle = '#0e0c1c'; for (let i = -1; i < 12; i++) { const x = i * 32, h = 30 + rnd(i) * 50; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 16, h); g.lineTo(x + 34, 0); g.fill(); } glow(g, 160, 90, 150, 'rgba(190,160,255,' + (0.10 + light * 0.1) + ')'); });
    layer(g, c, 0.6, () => {   // the queen's thorns, which burn back from the light
      for (let i = 0; i < 9; i++) { const x = (i < 5 ? 10 + i * 22 : 190 + (i - 5) * 30) + (i < 5 ? -1 : 1) * light * 26, sw = Math.sin(t * 0.02 + i) * 2; g.strokeStyle = '#1c1830'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, 132); g.quadraticCurveTo(x + sw + (i < 5 ? 16 : -16), 90, x + (i < 5 ? 30 : -30) + sw, 56 + rnd(i) * 30); g.stroke(); g.fillStyle = light > 0.3 ? '#ff8a3a' : '#c8b8ff'; for (let k = 0; k < 4; k++) R(g, x + (i < 5 ? 1 : -1) * k * 7 + sw, 120 - k * 16, 2, 2, g.fillStyle); }
    });
    layer(g, c, 1, () => {
      R(g, -30, 128, W + 60, 30, '#08070e'); R(g, -30, 128, W + 60, 1, '#3a3266'); R(g, 124, 122, 76, 8, '#1a1626'); R(g, 124, 122, 76, 1, '#6a5aa8');   // the slab
      glow(g, 160, 112 - up * 22, 30 + light * 120, 'rgba(255,246,216,' + (0.18 + light * 0.6) + ')');
      if (light > 0) { g.save(); g.translate(160, 108 - up * 22); g.rotate(t * 0.004); for (let i = 0; i < 16; i++) { g.rotate(Math.PI / 8); g.fillStyle = 'rgba(255,224,150,' + 0.12 * light + ')'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, -220 * light); g.lineTo(6, -220 * light); g.fill(); } g.restore(); }
      // Wren: lying on the slab, then lifted upright by the light
      g.save(); g.translate(160, 122 - up * 16); g.rotate(-Math.PI / 2 * (1 - up)); person(g, 'wren', 0, up < 1 ? 0 : 0, 1, up > 0.9 ? t : 0); g.restore();
      person(g, 'caelum', 214, 134, -1, t, r > 30 && r < 140 ? { emote: { e: '!', t: 30 } } : null);
      if (r < 0) { glow(g, 196, 104, 14, 'rgba(200,184,255,0.7)'); for (let q = 0; q < 6; q++) { const k = ((t * 0.012 + q / 6) % 1); R(g, 196 - k * 34, 104 + k * 10 - Math.sin(k * 3.14) * 10, 2, 2, q % 2 ? '#c8b8ff' : '#fff6d8'); } }   // his own star, leaving his hands for her
      else { const pk = 0.5 + 0.4 * Math.sin(t * 0.08); g.strokeStyle = 'rgba(255,210,122,' + pk * light + ')'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(164, 106 - up * 22); g.quadraticCurveTo(188, 92, 210, 108); g.stroke(); }   // the Tether, pulled taut
      if (light > 0) for (let i = 0; i < 40; i++) { const a = rnd(i) * 6.283, k = ((r * 0.012 + rnd(i * 3)) % 1); R(g, 160 + Math.cos(a) * k * 170, 104 - up * 22 + Math.sin(a) * k * 100, 2, 2, i % 2 ? '#ffd27a' : '#fff6d8'); }
    });
    layer(g, c, 1.8, () => { g.fillStyle = '#030208'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 70); g.quadraticCurveTo(0, 96, 22, 150); g.fill(); g.beginPath(); g.moveTo(350, 150); g.lineTo(350, 84); g.quadraticCurveTo(310, 100, 292, 150); g.fill(); });
    if (r >= 0 && r < 12) { g.fillStyle = 'rgba(255,246,216,' + (1 - r / 12) + ')'; g.fillRect(0, 0, W, H); }
    C.post(g, t);
  };

  // ---------------------------------------------------------------- The Library of Starhaven
  C.library = function (g, t) {
    const c = cam(t);
    R(g, 0, 0, W, H, '#140c0a');
    const shelves = (base, top, col, seed, sp) => { for (let i = -2; i < W / sp + 3; i++) { const x = i * sp; R(g, x, top, sp - 6, base - top, col); for (let y = top + 4; y < base - 6; y += 13) { R(g, x + 2, y + 10, sp - 10, 2, SH.shade(col, 0.6)); for (let k = 0; k < (sp - 12) / 3; k++) { const hh = 6 + rnd(i * 31 + y + k + seed) * 4; R(g, x + 3 + k * 3, y + 10 - hh, 2, hh, ['#7a2a3a', '#2c3d74', '#3a5a2a', '#8a6a2a', '#5a2a5a', '#c8b890'][(i * 7 + k * 3 + y + seed) % 6 | 0]); } } } };
    layer(g, c, 0.3, () => { shelves(130, -10, '#2a1a14', 1, 40); g.fillStyle = 'rgba(20,12,10,0.55)'; g.fillRect(-30, 0, W + 60, H); g.fillStyle = '#0c1430'; g.beginPath(); g.arc(160, 40, 26, 0, 6.3); g.fill(); starfield(g, t, 10, 5, 60); g.strokeStyle = '#c8a050'; g.lineWidth = 2; g.beginPath(); g.arc(160, 40, 26, 0, 6.3); g.moveTo(134, 40); g.lineTo(186, 40); g.moveTo(160, 14); g.lineTo(160, 66); g.stroke(); });
    layer(g, c, 0.55, () => { g.fillStyle = 'rgba(200,214,255,0.10)'; g.beginPath(); g.moveTo(140, 20); g.lineTo(182, 20); g.lineTo(260, 150); g.lineTo(90, 150); g.fill(); for (let i = 0; i < 26; i++) { const k = ((t * 0.003 + rnd(i)) % 1); g.globalAlpha = Math.sin(k * 3.14) * 0.7; R(g, 110 + rnd(i * 3) * 130 + Math.sin(t * 0.01 + i) * 6, 30 + k * 100, 1, 1, '#fff6d8'); } g.globalAlpha = 1; });   // dust in the moonlight
    layer(g, c, 0.75, () => { shelves(132, 8, '#3a261c', 7, 54); for (const lx of [70, 250]) { g.strokeStyle = '#6a4a2e'; g.lineWidth = 2; g.beginPath(); g.moveTo(lx, 132); g.lineTo(lx + 10, 20); g.moveTo(lx + 12, 132); g.lineTo(lx + 22, 20); g.stroke(); for (let y = 30; y < 130; y += 12) R(g, lx + 2 + (132 - y) * 0.09, y, 12, 1, '#6a4a2e'); } });
    layer(g, c, 1, () => {
      R(g, -30, 130, W + 60, 30, '#1c120e'); for (let i = -2; i < 12; i++) { R(g, i * 32, 130, 31, 1, '#3a261c'); R(g, i * 32 + (i % 2) * 16, 138, 15, 1, '#2a1a14'); }
      R(g, 150, 110, 80, 5, '#5a3e2a'); R(g, 156, 115, 5, 17, '#3a2618'); R(g, 219, 115, 5, 17, '#3a2618');
      for (let k = 0; k < 5; k++) R(g, 158 + (k % 2) * 2, 106 - k * 4, 18, 4, ['#7a2a3a', '#2c3d74', '#8a6a2a', '#3a5a2a', '#5a2a5a'][k]); R(g, 196, 104, 16, 6, '#f4f0e0'); R(g, 203, 104, 1, 6, '#c8b890');
      for (let i = 0; i < 5; i++) { const cx = 40 + i * 62, cy = 40 + Math.sin(t * 0.02 + i * 1.7) * 6 + (i % 2) * 22; R(g, cx, cy, 2, 7, '#f4f0e0'); g.fillStyle = '#ffb057'; g.beginPath(); g.moveTo(cx, cy); g.quadraticCurveTo(cx + 1 + Math.sin(t * 0.3 + i), cy - 6, cx + 1, cy - 7); g.quadraticCurveTo(cx + 3, cy - 3, cx + 2, cy); g.fill(); glow(g, cx + 1, cy - 2, 20, 'rgba(255,200,120,0.4)'); }   // candles that float
      person(g, 'thane', 240, 134, -1, t); person(g, 'wren', 128, 134, 1, t);
    });
    layer(g, c, 1.8, () => { R(g, -34, 0, 30, H, '#080504'); for (let y = 10; y < 150; y += 16) R(g, -34, y, 30, 2, '#140c0a'); g.fillStyle = '#080504'; g.beginPath(); g.moveTo(350, 150); g.lineTo(350, 110); g.lineTo(304, 118); g.lineTo(296, 150); g.fill(); });
    C.post(g, t);
  };

  // ---------------------------------------------------------------- Iris's tower
  C.observatory = function (g, t) {
    const c = cam(t);
    R(g, 0, 0, W, H, '#0a0c1e');
    layer(g, c, 0.15, () => { g.save(); g.beginPath(); g.moveTo(120, 0); g.lineTo(200, 0); g.lineTo(214, 84); g.lineTo(106, 84); g.clip(); sky(g, ['#03040e', '#0c1238', '#1e1c5a']); starfield(g, t, 60, 51, 84); shooting(g, t, 300); g.restore(); });   // the open slit in the dome
    layer(g, c, 0.6, () => {
      g.fillStyle = '#14183a'; g.beginPath(); g.rect(-30, 0, W + 60, 132); g.moveTo(120, 0); g.lineTo(106, 84); g.lineTo(214, 84); g.lineTo(200, 0); g.closePath(); g.fill('evenodd');
      g.strokeStyle = '#2a2e5a'; g.lineWidth = 1; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-30 + i * 46, 132); g.quadraticCurveTo(160, -80, 350 - i * 46, 132); g.stroke(); }
      g.strokeStyle = '#c8a050'; g.lineWidth = 2; g.beginPath(); g.moveTo(120, 0); g.lineTo(106, 84); g.lineTo(214, 84); g.lineTo(200, 0); g.stroke();
      for (const [mx, my] of [[20, 60], [262, 54]]) { R(g, mx, my, 40, 28, '#d8c8a0'); R(g, mx, my, 40, 1, '#f4f0e0'); g.strokeStyle = '#8a6a4a'; g.lineWidth = 1; g.beginPath(); g.moveTo(mx + 4, my + 20); g.quadraticCurveTo(mx + 16, my + 4, mx + 36, my + 14); g.stroke(); R(g, mx + 26, my + 8, 2, 2, '#c8452e'); }   // star maps
    });
    layer(g, c, 0.85, () => {   // threads of starlight hanging in the air, swaying
      for (let i = 0; i < 12; i++) { const x = 24 + i * 25, len = 40 + rnd(i) * 60, sw = Math.sin(t * 0.02 + i) * 5; g.strokeStyle = 'rgba(255,233,168,' + (0.25 + 0.2 * Math.sin(t * 0.04 + i)) + ')'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + sw, len * 0.5, x + sw * 1.6, len); g.stroke(); R(g, x + sw * 1.6 - 1, len - 1, 2, 2, '#fff6d8'); glow(g, x + sw * 1.6, len, 6, 'rgba(255,233,168,0.5)'); }
    });
    layer(g, c, 1, () => {
      R(g, -30, 130, W + 60, 30, '#0c0e22'); g.strokeStyle = '#2a2e5a'; g.lineWidth = 1; for (let i = 1; i < 5; i++) { g.beginPath(); g.ellipse(160, 150, i * 46, i * 9, 0, Math.PI, 0); g.stroke(); }
      // the brass telescope
      R(g, 150, 108, 20, 24, '#3a2a1e'); R(g, 146, 128, 28, 4, '#5a3e2a'); g.save(); g.translate(160, 106); g.rotate(-0.72 + Math.sin(t * 0.004) * 0.05); R(g, -8, -5, 74, 10, '#c8a050'); R(g, -8, -5, 74, 2, '#ffe9a8'); R(g, 60, -7, 12, 14, '#8a6a2a'); R(g, -16, -3, 10, 6, '#8a6a2a'); R(g, 20, -6, 3, 12, '#8a6a2a'); g.restore(); g.fillStyle = '#c8a050'; g.beginPath(); g.arc(160, 106, 6, 0, 6.3); g.fill();
      for (const cx of [86, 236]) { R(g, cx, 118, 3, 12, '#f4f0e0'); g.fillStyle = '#ffb057'; g.beginPath(); g.moveTo(cx, 118); g.quadraticCurveTo(cx + 1.5 + Math.sin(t * 0.3 + cx), 111, cx + 1.5, 110); g.quadraticCurveTo(cx + 3.5, 114, cx + 3, 118); g.fill(); glow(g, cx + 1, 114, 26, 'rgba(255,200,120,0.4)'); }
      person(g, 'iris', 214, 134, -1, t); person(g, 'wren', 110, 134, 1, t);
    });
    drift(g, t, 16, ['#ffe9a8', '#9fd8ff'], true, 61);
    layer(g, c, 1.8, () => { g.fillStyle = '#04050f'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 60); g.quadraticCurveTo(6, 90, 20, 150); g.fill(); g.beginPath(); g.moveTo(350, 150); g.lineTo(350, 70); g.quadraticCurveTo(306, 96, 296, 150); g.fill(); });
    C.post(g, t);
  };

  // a thorn vine: grows from (x0, base) by `len`, swaying; buds glow at its tip and along it
  // a shard of the Eclipse's black glass, rising from (x0, base) by len: dark, sharp, with a cold lit face (was a thorn vine)
  const GLASS = { '#4a1226': '#1c1830', '#5a1830': '#241f3a', '#6a1c34': '#2a2444', '#3a1226': '#1a1626', '#05020a': '#05040a', '#3a1024': '#2a2444' };
  function vine(g, x0, base, len, i, t, col, bud) {
    if (len <= 3) return;
    col = GLASS[col] || col;
    const L = len, lean = Math.sin(i * 1.7) * L * 0.22, w = 3 + (i % 3) * 2 + L * 0.05;
    g.fillStyle = col; g.beginPath(); g.moveTo(x0 - w, base); g.lineTo(x0 + lean, base - L); g.lineTo(x0 + w, base); g.fill();
    g.fillStyle = 'rgba(120,100,200,0.35)'; g.beginPath(); g.moveTo(x0 + lean, base - L); g.lineTo(x0 + w, base); g.lineTo(x0 + w * 0.2, base); g.fill();
    g.strokeStyle = 'rgba(224,212,255,0.55)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + w * 0.4, base); g.lineTo(x0 + lean, base - L); g.stroke();
    if (L > 30) { const sx = x0 + lean * 0.45, sy = base - L * 0.45, sd = i % 2 ? 1 : -1; g.fillStyle = col; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + sd * L * 0.3, sy - L * 0.25); g.lineTo(sx, sy - 6); g.fill(); }
    if (L > 16 && bud) { glow(g, x0 + lean, base - L, 9, 'rgba(190,160,255,0.55)'); R(g, x0 + lean - 1, base - L - 1, 2, 2, '#fff6ff'); }
  }


  // ---------------------------------------------------------------- The Spring Court garden: she paints again, and he watches from the arch
  C.garden = function (g, t) {
    const c = cam(t);
    sky(g, ['#ffe9c8', '#ffd2d8', '#f6b6cc', '#e89ab8']);
    layer(g, c, 0.05, () => { glow(g, 232, 30, 80, 'rgba(255,246,216,0.8)'); g.fillStyle = '#fffbe8'; g.beginPath(); g.arc(232, 30, 11, 0, 6.3); g.fill(); });
    layer(g, c, 0.18, () => {   // the manor, far off, rose-stone and gold
      R(g, 30, 62, 90, 50, '#e8a8bc'); R(g, 22, 76, 14, 36, '#dc98b0'); R(g, 114, 70, 16, 42, '#dc98b0');
      g.fillStyle = '#c87a98'; g.beginPath(); g.moveTo(26, 62); g.lineTo(75, 40); g.lineTo(124, 62); g.fill(); g.beginPath(); g.moveTo(20, 76); g.lineTo(29, 60); g.lineTo(38, 76); g.fill(); g.beginPath(); g.moveTo(112, 70); g.lineTo(122, 54); g.lineTo(132, 70); g.fill();
      for (let i = 0; i < 5; i++) { R(g, 40 + i * 16, 72, 6, 12, '#fff2d8'); g.fillStyle = '#fff2d8'; g.beginPath(); g.arc(43 + i * 16, 72, 3, Math.PI, 0); g.fill(); }
      g.fillStyle = '#d88aa8'; for (let i = -1; i < 8; i++) { g.beginPath(); g.arc(i * 52 + 14, 114, 30 + rnd(i) * 12, Math.PI, 0); g.fill(); }
    });
    layer(g, c, 0.4, () => {   // the garden wall she is never allowed past, with roses over it
      R(g, -30, 86, W + 60, 30, '#f2dcd0'); R(g, -30, 84, W + 60, 3, '#fff6ea'); for (let i = -1; i < 12; i++) R(g, i * 30 + 6, 86, 1, 30, '#e2c4b8');
      for (let i = 0; i < 46; i++) { const x = rnd(i + 5) * (W + 40) - 20, y = 84 + rnd(i * 3) * 22; R(g, x, y, 3, 3, i % 3 ? '#e85a84' : '#fff0f4'); R(g, x + 3, y + 1, 2, 2, '#5a9a4a'); }
      R(g, 258, 60, 36, 56, '#f2dcd0'); g.fillStyle = '#b87a90'; g.beginPath(); g.moveTo(264, 116); g.lineTo(264, 80); g.quadraticCurveTo(276, 64, 288, 80); g.lineTo(288, 116); g.fill();   // the gate, shut
      for (let i = 0; i < 4; i++) R(g, 266 + i * 6, 76, 1, 40, '#e8c070'); R(g, 264, 96, 24, 1, '#e8c070');
    });
    layer(g, c, 0.7, () => {   // cherry trees with real crowns
      for (const [x, h, s] of [[40, 54, 1], [210, 60, 2], [300, 50, 3]]) {
        g.strokeStyle = '#6a4234'; g.lineWidth = 5; g.beginPath(); g.moveTo(x, 124); g.quadraticCurveTo(x + 4, 124 - h * 0.5, x - 3, 124 - h); g.stroke();
        g.lineWidth = 2; g.beginPath(); g.moveTo(x, 124 - h * 0.6); g.lineTo(x + 16, 124 - h * 0.9); g.moveTo(x, 124 - h * 0.7); g.lineTo(x - 15, 124 - h); g.stroke(); g.lineWidth = 1;
        for (let k = 0; k < 16; k++) { const a = rnd(k + s * 9) * 6.3, r = rnd(k * 3 + s) * 22, sw = Math.sin(t * 0.02 + k + s) * 1.2; g.fillStyle = k % 3 === 0 ? '#ffd6e4' : k % 3 === 1 ? '#f7a4c2' : '#ee88ae'; g.beginPath(); g.arc(x - 2 + Math.cos(a) * r + sw, 124 - h - 6 + Math.sin(a) * r * 0.6, 8 + rnd(k) * 5, 0, 6.3); g.fill(); }
      }
    });
    layer(g, c, 1, () => {
      const lg = g.createLinearGradient(0, 122, 0, 150); lg.addColorStop(0, '#9ed488'); lg.addColorStop(1, '#5a9a58'); g.fillStyle = lg; g.fillRect(-30, 122, W + 60, 30); R(g, -30, 122, W + 60, 1, '#c8f0b0');
      for (let i = 0; i < 60; i++) { const x = rnd(i + 70) * (W + 40) - 20; R(g, x, 123 + rnd(i * 2) * 24, 1, 3, '#7ab86a'); if (i % 4 === 0) R(g, x, 124 + rnd(i * 5) * 22, 2, 2, i % 8 ? '#fff0f4' : '#ffd27a'); }
      // the easel: a night sky full of stars, growing stroke by stroke. She paints what she has never seen.
      g.strokeStyle = '#7a5a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(150, 96); g.lineTo(143, 138); g.moveTo(172, 96); g.lineTo(179, 138); g.moveTo(161, 100); g.lineTo(161, 136); g.stroke(); g.lineWidth = 1;
      R(g, 144, 88, 34, 30, '#5a4028'); R(g, 146, 90, 30, 26, '#fffaf0');
      const n = Math.min(70, Math.floor(t / 5));
      for (let i = 0; i < n; i++) { const px = 146 + rnd(i + 3) * 27, py = 90 + rnd(i * 3 + 1) * 24; R(g, px, py, 3 + (i % 2), 2, i < 44 ? (i % 3 ? '#1c1a4a' : '#2f2c6e') : i % 2 ? '#ffd27a' : '#fff6d8'); }
      R(g, 138, 132, 8, 4, '#8a6a4a'); R(g, 139, 131, 2, 2, '#2f2c6e'); R(g, 142, 131, 2, 2, '#ffd27a'); R(g, 136, 131, 2, 2, '#e85a84');
      person(g, 'wren', 128, 138, 1, t);
      const by = Math.sin(t * 0.16) * 3; g.strokeStyle = '#5a4028'; g.lineWidth = 1; g.beginPath(); g.moveTo(136, 118); g.lineTo(145, 104 + by); g.stroke(); R(g, 145, 103 + by, 2, 2, n < 44 ? '#2f2c6e' : '#ffd27a');
      person(g, 'rowan', 236, 138, -1, t);
    });
    drift(g, t, 26, ['#ff9ac0', '#ffffff', '#ffd6e4'], false, 12);
    layer(g, c, 1.8, () => {   // close to the eye: a bough of blossom, and the bars of the gate she has not noticed yet
      g.strokeStyle = '#3a1c2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(-40, 6); g.quadraticCurveTo(40, 20, 110, 4); g.stroke(); g.lineWidth = 1;
      for (let i = 0; i < 14; i++) { g.fillStyle = i % 2 ? '#ffb8d0' : '#ffe0ea'; g.beginPath(); g.arc(-20 + i * 9 + Math.sin(t * 0.02 + i), 12 + rnd(i) * 10, 5 + rnd(i * 3) * 3, 0, 6.3); g.fill(); }
      for (let i = 0; i < 3; i++) R(g, 316 + i * 12, 0, 4, H, '#3a1c2a');
    });
  };

  // ---------------------------------------------------------------- The Blight: her thorns climb the courts, and she watches from the mountain
  C.thorns = function (g, t) {
    const c = cam(t), grow = ease(t / 300);
    sky(g, ['#04030a', '#0e0b1e', '#1e1838', '#3a2e5e']);
    layer(g, c, 0.05, () => { glow(g, 248, 36, 46, 'rgba(255,246,216,0.8)'); g.fillStyle = '#000000'; g.beginPath(); g.arc(250, 36, 15, 0, 6.3); g.fill(); g.strokeStyle = 'rgba(255,246,216,0.9)'; g.lineWidth = 1; g.beginPath(); g.arc(250, 36, 15.5, 0, 6.3); g.stroke(); });   // the eclipse itself
    layer(g, c, 0.05, () => { glow(g, 160, 96, 110, 'rgba(150,120,255,0.35)'); for (let i = 0; i < 30; i++) { g.globalAlpha = 0.3 + 0.4 * Math.abs(Math.sin(t * 0.02 + i)); R(g, rnd(i + 2) * W, rnd(i * 3) * 60, 1, 1, '#d8d0ff'); } g.globalAlpha = 1; });
    layer(g, c, 0.2, () => {   // the mountain, hollow, with one lit window near the top: hers
      g.fillStyle = '#0c0a18'; g.beginPath(); g.moveTo(40, 124); g.lineTo(120, 52); g.lineTo(146, 66); g.lineTo(170, 22); g.lineTo(198, 60); g.lineTo(226, 48); g.lineTo(290, 124); g.fill();
      g.fillStyle = '#16122a'; g.beginPath(); g.moveTo(170, 22); g.lineTo(198, 60); g.lineTo(186, 74); g.lineTo(176, 52); g.fill();
      const pk = 0.6 + 0.4 * Math.sin(t * 0.05); glow(g, 170, 48, 16 * pk, 'rgba(190,160,255,0.7)'); R(g, 168, 44, 4, 7, '#c8b8ff'); R(g, 169, 45, 2, 3, '#f0eaff');
      g.fillStyle = '#05020a'; g.beginPath(); g.moveTo(150, 124); g.lineTo(150, 104); g.quadraticCurveTo(170, 84, 190, 104); g.lineTo(190, 124); g.fill();   // the gate into the Deep
    });
    layer(g, c, 0.4, () => {   // a court on the plain below, its towers being taken
      const towers = [[36, 30], [58, 44], [78, 26], [232, 38], [256, 50], [280, 30]];
      for (const [x, h] of towers) { R(g, x, 122 - h, 12, h, '#18142c'); g.fillStyle = '#18142c'; g.beginPath(); g.moveTo(x - 2, 122 - h); g.lineTo(x + 6, 112 - h); g.lineTo(x + 14, 122 - h); g.fill(); const lit = grow < 0.5 + rnd(x) * 0.4; R(g, x + 4, 128 - h, 3, 4, lit ? '#ffd27a' : '#0a0814'); }
      towers.forEach(([x, h], i) => vine(g, x + 6, 124, grow * (h + 14), i + 20, t, '#1c1830', null));
    });
    layer(g, c, 0.75, () => { R(g, -30, 120, W + 60, 34, '#0a0814'); for (let i = 0; i < 9; i++) vine(g, 10 + i * 38 + rnd(i) * 14, 126, grow * (34 + rnd(i * 2) * 44), i, t, '#241f3a', '#c8b8ff'); });
    layer(g, c, 1, () => {
      R(g, -30, 132, W + 60, 20, '#06050c'); R(g, -30, 132, W + 60, 1, '#1c1830');
      for (let i = 0; i < 12; i++) { const x = rnd(i + 31) * W, dead = grow > rnd(i * 7); R(g, x, 126, 1, 6, dead ? '#3a2a22' : '#5a9a4a'); R(g, x - 1, 124, 3, 3, dead ? '#4a3a30' : i % 2 ? '#ff9ac0' : '#fff0f4'); }   // Spring's flowers, dying one by one
      person(g, 'queen', 160, 138, 1, t);
      for (let i = 0; i < 6; i++) vine(g, 160 + (i - 2.5) * 16, 138, grow * (14 + rnd(i) * 16), i + 50, t, '#2a2444', i % 2 ? '#c8b8ff' : null);
    });
    drift(g, t, 22, ['#a898e8', '#ffb057', '#241f3a'], true, 33);
    layer(g, c, 1.8, () => { for (const [x0, i] of [[-6, 90], [14, 91], [306, 92], [326, 93]]) { g.globalAlpha = 1; vine(g, x0, 154, 60 + grow * 80, i, t, '#05020a', null); } });
  };

  // ---------------------------------------------------------------- A cell in the Deep: fever, and then him
  C.cell = function (g, t, cue) {
    const c = cam(t), k = cue && cue.name === 'caelum' ? ease(cue.t / 70) : 0;
    R(g, 0, 0, W, H, '#06070c');
    layer(g, c, 0.3, () => {   // the back wall: wet stone, one barred slit high up, and the queen's thorns coming through the mortar
      for (let y = 0; y < 126; y += 12) for (let x = -30 + (y / 12 % 2) * 14; x < W + 30; x += 28) { R(g, x, y, 27, 11, rnd(x * 3 + y) < 0.3 ? '#14171f' : '#10131a'); }
      for (let i = 0; i < 10; i++) { const x = rnd(i + 8) * W; g.globalAlpha = 0.25; R(g, x, 0, 1, 40 + rnd(i * 2) * 70, '#3a4a5a'); const dy = (t * 0.6 + i * 37) % 120; g.globalAlpha = 0.7; R(g, x, dy, 1, 2, '#8ab0c8'); } g.globalAlpha = 1;
      R(g, 70, 22, 22, 16, '#03040a'); for (let i = 0; i < 4; i++) R(g, 73 + i * 5, 22, 2, 16, '#1c2028');
      const mg = g.createLinearGradient(80, 30, 130, 126); mg.addColorStop(0, 'rgba(160,190,230,0.22)'); mg.addColorStop(1, 'rgba(160,190,230,0)'); g.fillStyle = mg; g.beginPath(); g.moveTo(70, 38); g.lineTo(92, 38); g.lineTo(158, 128); g.lineTo(92, 128); g.fill();
      for (let i = 0; i < 4; i++) vine(g, 250 + i * 18, 0, -0, i, t, '#2a2444', null);
      g.save(); g.translate(0, 0); for (let i = 0; i < 4; i++) { g.strokeStyle = '#2a2444'; g.lineWidth = 2; g.beginPath(); g.moveTo(244 + i * 20, 0); for (let y = 0; y < 50 + rnd(i) * 40; y += 5) g.lineTo(244 + i * 20 + Math.sin(y * 0.1 + i) * 6, y); g.stroke(); } g.lineWidth = 1; g.restore();
    });
    layer(g, c, 1, () => {
      R(g, -30, 126, W + 60, 26, '#0c0e14'); R(g, -30, 126, W + 60, 1, '#262a36'); for (let i = -1; i < 14; i++) R(g, i * 26 + 8, 127, 1, 24, '#07080c');
      R(g, 84, 122, 40, 5, '#3a3020'); for (let i = 0; i < 12; i++) R(g, 84 + rnd(i) * 38, 120 + rnd(i * 2) * 3, 4, 1, '#6a5a34');   // straw
      R(g, 60, 116, 8, 10, '#2a2e3a'); R(g, 61, 114, 6, 2, '#3a4050');                                                             // a cup she cannot reach for
      g.strokeStyle = '#3a3e4a'; g.lineWidth = 1; g.beginPath(); g.moveTo(128, 60); for (let i = 0; i < 8; i++) g.lineTo(128 - i * 3 + (i % 2), 60 + i * 8); g.stroke();   // a chain
      // Wren, lying on her side in the straw, breathing fast; the wound in her arm glows the queen's red
      g.save(); g.translate(104, 124); g.rotate(-Math.PI / 2); person(g, 'wren', 0, 0, 1, 0); g.restore();
      const fever = 0.5 + 0.5 * Math.sin(t * 0.12); glow(g, 110, 118, 9 + fever * 4, 'rgba(190,160,255,' + (0.35 + fever * 0.3) + ')'); R(g, 109, 117, 3, 2, '#c8b8ff');
      if (k > 0) {   // he falls into the cell like a star: night first, then stars, then the streak, then the man
        glow(g, 206, 96, 80 * k, 'rgba(120,100,220,0.4)');
        for (let i = 0; i < 46; i++) { const a = i / 46 * 6.3 + t * 0.008, r = 30 + rnd(i) * 40; g.globalAlpha = k * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.08 + i))); R(g, 206 + Math.cos(a) * r, 92 + Math.sin(a) * r * 0.7, 1, 1, i % 3 ? '#fff6d8' : '#b9a8ff'); }
        for (let q = 0; q < 10; q++) { const kk = q / 10; g.globalAlpha = k * (1 - kk) * 0.6; g.fillStyle = q % 2 ? '#3a2a6a' : '#1c1838'; g.beginPath(); g.ellipse(206 + kk * 50, 96 - kk * 60, 12 * (1 - kk * 0.6), 6, -0.9, 0, 6.3); g.fill(); }   // the streak he fell along
        g.globalAlpha = k;
        person(g, 'caelum', 206, 138, -1, t);
        g.globalAlpha = k * (0.5 + 0.3 * Math.sin(t * 0.06)); g.strokeStyle = '#ffd27a'; g.beginPath(); g.moveTo(112, 116); g.bezierCurveTo(140, 100, 176, 124, 200, 112); g.stroke();   // the thread, though she cannot feel it yet
        g.globalAlpha = 1;
      }
    });
    layer(g, c, 1.6, () => { for (const x of [-14, 34, 262, 300, 338]) { R(g, x, 0, 5, H, '#020306'); R(g, x + 5, 0, 1, H, '#1a1e28'); } R(g, -30, 14, W + 60, 4, '#020306'); });   // the bars, between us and her
  };

  // ---------------------------------------------------------------- The Queen's throne: three trials won, and the last thorn
  C.trials = function (g, t, cue) {
    const c = cam(t), ct = cue ? cue.t : 0, strike = cue && cue.name === 'end' ? ease((ct - 150) / 40) : 0;
    sky(g, ['#06050c', '#100c20', '#241a40', '#100c20']);
    layer(g, c, 0.15, () => {   // the hall: pillars of root going up into the dark, braziers burning red
      for (let i = -1; i < 8; i++) { const x = i * 48 + 10; R(g, x, 0, 14, 126, '#0a0814'); R(g, x + 2, 0, 2, 126, '#16122a'); for (let k = 0; k < 5; k++) R(g, x + rnd(i * 5 + k) * 12, rnd(k + i) * 120, 2, 8, '#06050c'); }
      for (const x of [58, 262]) { const fl = Math.sin(t * 0.25 + x) * 2; glow(g, x, 84, 36 + fl * 2, 'rgba(170,140,255,0.45)'); R(g, x - 5, 90, 10, 3, '#3a2a2a'); R(g, x - 1, 93, 2, 33, '#2a1c1c'); g.fillStyle = '#b8a8ff'; g.beginPath(); g.moveTo(x - 4, 90); g.lineTo(x, 78 + fl); g.lineTo(x + 4, 90); g.fill(); R(g, x - 1, 85, 2, 4, '#ffd27a'); }
    });
    layer(g, c, 0.45, () => {   // the freed High Lords' empty chains, and a crowd of the court as shapes
      for (let i = 0; i < 16; i++) { const x = 8 + i * 20 + rnd(i) * 6, h = 20 + rnd(i * 3) * 8; if (x > 124 && x < 196) continue; R(g, x, 124 - h, 9, h, '#0a0814'); g.fillStyle = '#0a0814'; g.beginPath(); g.arc(x + 4.5, 122 - h, 4, 0, 6.3); g.fill(); if (i % 3 === 0) { R(g, x + 2, 120 - h, 1, 1, '#c8b8ff'); R(g, x + 6, 120 - h, 1, 1, '#c8b8ff'); } }
    });
    layer(g, c, 0.6, () => { glow(g, 160, 70, 130, 'rgba(150,120,255,0.35)'); glow(g, 160, 130, 90, 'rgba(200,184,255,0.2)'); });   // her cold light, so the hall can be seen
    layer(g, c, 0.8, () => {   // the throne: woven thorn, taller than it needs to be
      R(g, 118, 112, 84, 14, '#0e0c1a'); R(g, 126, 104, 68, 8, '#120e22'); R(g, 134, 96, 52, 8, '#18142c');
      g.fillStyle = '#0a0814'; g.beginPath(); g.moveTo(140, 96); g.lineTo(144, 34); g.lineTo(160, 14); g.lineTo(176, 34); g.lineTo(180, 96); g.fill();
      for (let i = 0; i < 9; i++) { g.strokeStyle = '#2a2444'; g.lineWidth = 2; g.beginPath(); g.moveTo(142 + i * 4.5, 96); g.quadraticCurveTo(160 + (i - 4) * 9, 50, 160 + (i - 4) * 7 + Math.sin(t * 0.02 + i) * 2, 18 + Math.abs(i - 4) * 6); g.stroke(); } g.lineWidth = 1;
      for (let i = 0; i < 7; i++) { const x = 146 + rnd(i + 3) * 28, y = 30 + rnd(i * 5) * 56; glow(g, x, y, 5, 'rgba(190,160,255,0.5)'); R(g, x - 1, y - 1, 3, 3, '#c8b8ff'); }
      person(g, 'queen', 160, 96, 1, t);
    });
    layer(g, c, 1, () => {
      R(g, -30, 126, W + 60, 26, '#06050c'); R(g, -30, 126, W + 60, 1, '#1c1830'); R(g, 100, 126, 120, 26, '#1c1636'); R(g, 100, 126, 2, 26, '#e8c070'); R(g, 218, 126, 2, 26, '#e8c070');   // the carpet to the throne
      const fall = strike;
      g.save(); g.translate(204, 142); g.rotate(fall * 1.45); person(g, 'wren', 0, 0, -1, fall > 0 ? 0 : t); g.restore();
      if (cue && cue.name === 'end' && ct > 120) {   // the last thorn: from the floor, through her
        const k = ease((ct - 120) / 30);
        g.strokeStyle = '#2a2444'; g.lineWidth = 3; g.beginPath(); g.moveTo(236, 150); g.quadraticCurveTo(230, 140, 236 - 28 * k, 150 - 30 * k); g.stroke(); g.lineWidth = 1;
        if (k >= 1 && fall < 0.5) { glow(g, 206, 120, 14, 'rgba(190,160,255,0.7)'); R(g, 204, 118, 4, 4, '#c8b8ff'); }
      }
      person(g, 'rowan', 60, 142, 1, t);   // free, and too late
    });
    drift(g, t, 18, ['#a898e8', '#c8b8ff', '#241f3a'], true, 71);
    layer(g, c, 1.8, () => { vine(g, -4, 154, 110, 3, t, '#05020a', null); vine(g, 324, 154, 120, 5, t, '#05020a', null); vine(g, 20, 154, 60, 8, t, '#05020a', null); });
    if (strike > 0) { g.fillStyle = 'rgba(0,0,0,' + Math.min(0.85, ease((ct - 230) / 80)) + ')'; g.fillRect(0, 0, W, H); }
  };

  // ---------------------------------------------------------------- Iris's vision: the threads over the sea, and the iron hand closing on two of them
  C.vision = function (g, t) {
    const c = cam(t), pull = 0.5 + 0.5 * Math.sin(t * 0.02), grow = ease(t / 260);
    sky(g, ['#02030c', '#081030', '#142a5a', '#0c2040']);
    layer(g, c, 0.05, () => { starfield(g, t, 80, 33, 90); moon(g, 54, 26, 9); });
    layer(g, c, 0.2, () => {   // the far shore: an iron keep, black on the horizon, one red window
      g.fillStyle = '#05060e'; g.beginPath(); g.moveTo(196, 92); g.lineTo(214, 70); g.lineTo(232, 80); g.lineTo(256, 58); g.lineTo(286, 82); g.lineTo(340, 92); g.fill();
      for (const [x, h] of [[238, 34], [250, 46], [262, 30], [272, 38]]) { R(g, x, 86 - h, 8, h, '#0a0c16'); g.fillStyle = '#0a0c16'; g.beginPath(); g.moveTo(x - 1, 86 - h); g.lineTo(x + 4, 78 - h); g.lineTo(x + 9, 86 - h); g.fill(); }
      const pk = 0.6 + 0.4 * Math.sin(t * 0.07); glow(g, 254, 50, 22 * pk, 'rgba(255,60,50,0.7)'); R(g, 252, 47, 4, 6, '#ff4a3a');
      for (let i = 0; i < 5; i++) { const sm = ((t * 0.006 + i / 5) % 1); g.globalAlpha = 0.3 * (1 - sm); g.fillStyle = '#3a3440'; g.beginPath(); g.arc(246 + i * 6 + Math.sin(sm * 5 + i) * 4, 44 - sm * 34, 3 + sm * 6, 0, 6.3); g.fill(); } g.globalAlpha = 1;   // forge smoke
    });
    layer(g, c, 0.5, () => {   // the sea between
      const sg = g.createLinearGradient(0, 90, 0, 132); sg.addColorStop(0, '#16306a'); sg.addColorStop(1, '#060c22'); g.fillStyle = sg; g.fillRect(-30, 90, W + 60, 44);
      for (let i = 0; i < 40; i++) { g.globalAlpha = 0.15 + 0.25 * Math.abs(Math.sin(t * 0.04 + i * 1.7)); R(g, rnd(i + 9) * (W + 40) - 20 + Math.sin(t * 0.01 + i) * 4, 92 + rnd(i * 3) * 38, 4 + rnd(i) * 10, 1, i % 4 ? '#8ab0ff' : '#ff8a7a'); } g.globalAlpha = 1;
      for (let i = 0; i < 3; i++) { const x = 300 - ((t * 0.05 + i * 60) % 190), y = 100 + i * 9; g.fillStyle = '#05060e'; g.beginPath(); g.moveTo(x - 8, y); g.lineTo(x + 8, y); g.lineTo(x + 5, y + 3); g.lineTo(x - 5, y + 3); g.fill(); R(g, x - 1, y - 9, 1, 9, '#05060e'); g.beginPath(); g.moveTo(x, y - 9); g.lineTo(x + 6, y - 3); g.lineTo(x, y - 2); g.fill(); }   // black ships, already on the water
    });
    layer(g, c, 1, () => {
      // the near shore: the cottage, a lit window, and the two of them at the door, not knowing
      g.fillStyle = '#0a1420'; g.beginPath(); g.moveTo(-30, 150); g.lineTo(-30, 122); g.quadraticCurveTo(60, 112, 132, 132); g.lineTo(150, 150); g.fill(); R(g, -30, 130, 150, 1, '#2a4a5a');
      g.save(); g.translate(-14, 132); g.scale(1.9, 1.9); g.translate(-14, -128);
      R(g, 20, 104, 40, 24, '#2a1c16'); g.fillStyle = '#3a2a20'; g.beginPath(); g.moveTo(15, 104); g.lineTo(40, 88); g.lineTo(65, 104); g.fill(); R(g, 48, 90, 5, 9, '#2a1c16');
      R(g, 26, 110, 8, 8, '#ffd27a'); glow(g, 30, 114, 22, 'rgba(255,210,122,0.5)'); R(g, 40, 112, 9, 16, '#1a100c');
      for (let k = 0; k < 4; k++) { const sm = ((t * 0.008 + k / 4) % 1); g.globalAlpha = 0.3 * (1 - sm); g.fillStyle = '#8a8a9a'; g.beginPath(); g.arc(50 + Math.sin(sm * 4) * 3, 88 - sm * 20, 2 + sm * 3, 0, 6.3); g.fill(); } g.globalAlpha = 1;
      g.restore();
      person(g, 'nessa', 96, 134, 1, t); person(g, 'lissa', 118, 135, 1, t);
      // every life is a thread. Most are gold and slack. Two of them have gone red and tight.
      for (let i = 0; i < 11; i++) { const y0 = 14 + i * 9, y1 = 120 - i * 8; g.strokeStyle = 'rgba(255,233,168,' + (0.1 + 0.1 * Math.sin(t * 0.03 + i)) + ')'; g.lineWidth = 1; g.beginPath(); g.moveTo(-20, y0); g.bezierCurveTo(100, y0 + 30 + Math.sin(t * 0.02 + i) * 8, 220, y1 - 30, W + 20, y1); g.stroke(); }
      for (const [fx, fy, o] of [[98, 110, 0], [120, 112, 6]]) {
        const ex = fx + (254 - fx) * grow, ey = fy + (52 - fy) * grow - Math.sin(grow * Math.PI) * 30;
        g.strokeStyle = 'rgba(255,74,60,' + (0.5 + 0.4 * pull) + ')'; g.lineWidth = 1 + pull; g.beginPath(); g.moveTo(fx, fy); g.quadraticCurveTo((fx + ex) / 2, Math.min(fy, ey) - 26 + o + pull * 6, ex, ey); g.stroke();
        const mk = (t * 0.01 + o) % 1; R(g, fx + (ex - fx) * mk - 1, fy + (ey - fy) * mk - 12 * Math.sin(mk * Math.PI) - 1, 2, 2, '#ffd0c8'); glow(g, fx, fy, 6 + pull * 4, 'rgba(255,74,60,0.5)');
      }
      g.lineWidth = 1;
      // and a third thread, gold, from the cottage to where Wren is standing
      g.strokeStyle = 'rgba(255,210,122,' + (0.6 + 0.3 * Math.sin(t * 0.05)) + ')'; g.beginPath(); g.moveTo(108, 112); g.bezierCurveTo(140, 70, 220, 150, 292, 122); g.stroke();
    });
    layer(g, c, 1.5, () => {   // an iron hand over all of it, closing a little as she watches
      const hx = 250, hy = 6 + pull * 4; g.fillStyle = 'rgba(5,6,14,0.85)';
      g.beginPath(); g.moveTo(hx - 34, -10); g.lineTo(hx + 44, -10); g.lineTo(hx + 40, hy + 8); g.lineTo(hx - 30, hy + 10); g.fill();
      for (let i = 0; i < 4; i++) { const fxx = hx - 26 + i * 18, len = 22 + (i % 2) * 8 + grow * 14 + pull * 4; g.beginPath(); g.moveTo(fxx, hy + 6); g.lineTo(fxx + 10, hy + 6); g.lineTo(fxx + 7 - grow * 6, hy + len); g.lineTo(fxx + 2 - grow * 6, hy + len + 5); g.fill(); }
      g.strokeStyle = 'rgba(255,74,60,0.35)'; g.beginPath(); g.moveTo(hx - 30, hy + 10); g.lineTo(hx + 40, hy + 8); g.stroke();
    });
    drift(g, t, 14, ['#ffe9a8', '#ff8a7a'], true, 44);
    layer(g, c, 1.2, () => { g.fillStyle = '#05060e'; g.beginPath(); g.moveTo(262, 150); g.quadraticCurveTo(300, 134, 350, 140); g.lineTo(350, 150); g.fill(); person(g, 'wren', 294, 146, -1, t); });   // Wren, on this side of the water, watching it happen
  };

  // every older scene gets the finish too
  for (const id of ['rooftop', 'window', 'spring', 'city', 'peak', 'fire', 'vision', 'garden', 'thorns', 'cell', 'trials']) { const f = C[id]; if (f) C[id] = function (g, t, cue) { f(g, t, cue); C.post(g, t); }; }
  const ds = C.drawStatic; C.drawStatic = function (g, id, t) { ds(g, id, t); C.post(g, t); };
})(window.SH = window.SH || {});
