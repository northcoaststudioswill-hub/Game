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
  // the white stag, drawn for the screen: slender, antlered, lit from inside
  function stag(g, x, y, fall, t) {
    g.save(); g.translate(x, y); g.rotate(-fall * 1.42); g.translate(fall * 6, -fall * 9);
    const br = Math.sin(t * 0.05) * 0.5;
    for (const ol of ['#5a6a98', null]) {
      const e = ol ? 1.2 : 0, wc = ol || '#f6f8ff', sc = ol || '#cfd8f4';
      g.strokeStyle = ol || '#dfe6fb'; g.lineWidth = 2.4 + e * 2; g.lineCap = 'round';
      for (const lx of [-13, -8, 8, 13]) { g.beginPath(); g.moveTo(lx, -15); g.lineTo(lx + (lx < 0 ? -1 : 1), -7); g.lineTo(lx, 0); g.stroke(); }
      g.fillStyle = wc; g.beginPath(); g.moveTo(-18 - e, -23 + br); g.quadraticCurveTo(-4, -30 - e + br, 12, -27 - e + br); g.quadraticCurveTo(18 + e, -22, 15 + e, -16); g.quadraticCurveTo(0, -11 + e, -14, -13 + e); g.quadraticCurveTo(-21 - e, -16, -18 - e, -23 + br); g.fill();
      if (!ol) { g.fillStyle = sc; g.beginPath(); g.moveTo(-15, -15); g.quadraticCurveTo(0, -11, 14, -16); g.quadraticCurveTo(0, -13.5, -15, -15); g.fill(); }
      g.strokeStyle = wc; g.lineWidth = 6 + e * 2; g.beginPath(); g.moveTo(11, -24); g.quadraticCurveTo(13, -36, 19, -42 + br); g.stroke();
      g.fillStyle = wc; g.beginPath(); g.moveTo(15 - e, -47 + br - e); g.lineTo(23, -47 + br - e); g.lineTo(30 + e, -41 + br); g.lineTo(29 + e, -38 + br + e); g.lineTo(17 - e, -38 + br + e); g.closePath(); g.fill();
      g.strokeStyle = ol || '#eef2ff'; g.lineWidth = 1.6 + e * 2;
      for (const sd of [0, 1]) { const ax = 18 + sd * 4, ln = sd ? 6 : -6; g.beginPath(); g.moveTo(ax, -46 + br); g.quadraticCurveTo(ax + ln * 0.4, -57, ax + ln, -68); g.moveTo(ax + ln * 0.3, -54); g.lineTo(ax + ln * 0.3 + (sd ? 7 : -7), -60); g.moveTo(ax + ln * 0.65, -61); g.lineTo(ax + ln * 0.65 + (sd ? 7 : -7), -68); g.stroke(); }
      if (!ol) R(g, 24, -44 + br, 2, 2, '#1a1430');
    }
    g.restore();
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
    sky(g, ['#040608', '#0a1410', '#12201a', '#0c1612']);
    layer(g, c, 0.3, () => { g.fillStyle = '#0e1a14'; for (let i = -1; i < 12; i++) { const x = i * 32, h = 30 + rnd(i) * 50; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 16, h); g.lineTo(x + 34, 0); g.fill(); } glow(g, 160, 90, 150, 'rgba(255,140,170,' + (0.10 + light * 0.1) + ')'); });
    layer(g, c, 0.6, () => {   // the queen's thorns, which burn back from the light
      for (let i = 0; i < 9; i++) { const x = (i < 5 ? 10 + i * 22 : 190 + (i - 5) * 30) + (i < 5 ? -1 : 1) * light * 26, sw = Math.sin(t * 0.02 + i) * 2; g.strokeStyle = '#2a1024'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, 132); g.quadraticCurveTo(x + sw + (i < 5 ? 16 : -16), 90, x + (i < 5 ? 30 : -30) + sw, 56 + rnd(i) * 30); g.stroke(); g.fillStyle = light > 0.3 ? '#ff8a3a' : '#ff5a78'; for (let k = 0; k < 4; k++) R(g, x + (i < 5 ? 1 : -1) * k * 7 + sw, 120 - k * 16, 2, 2, g.fillStyle); }
    });
    layer(g, c, 1, () => {
      R(g, -30, 128, W + 60, 30, '#0a100c'); R(g, -30, 128, W + 60, 1, '#2f4a3c'); R(g, 124, 122, 76, 8, '#1c2a22'); R(g, 124, 122, 76, 1, '#4f7a62');   // the slab
      glow(g, 160, 112 - up * 22, 30 + light * 120, 'rgba(255,246,216,' + (0.18 + light * 0.6) + ')');
      if (light > 0) { g.save(); g.translate(160, 108 - up * 22); g.rotate(t * 0.004); for (let i = 0; i < 16; i++) { g.rotate(Math.PI / 8); g.fillStyle = 'rgba(255,224,150,' + 0.12 * light + ')'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-6, -220 * light); g.lineTo(6, -220 * light); g.fill(); } g.restore(); }
      // Wren: lying on the slab, then lifted upright by the light
      g.save(); g.translate(160, 122 - up * 16); g.rotate(-Math.PI / 2 * (1 - up)); person(g, 'wren', 0, up < 1 ? 0 : 0, 1, up > 0.9 ? t : 0); g.restore();
      person(g, 'caelum', 214, 134, -1, t, r > 30 && r < 140 ? { emote: { e: '!', t: 30 } } : null);
      if (r < 0) { const k = (t % 90) / 90; R(g, 190 - k * 24, 100 + k * 16, 2, 3, '#ff5a78'); glow(g, 190 - k * 24, 101 + k * 16, 6, 'rgba(255,90,120,0.6)'); }   // his blood, a drop at a time
      else { const pk = 0.5 + 0.4 * Math.sin(t * 0.08); g.strokeStyle = 'rgba(255,210,122,' + pk * light + ')'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(164, 106 - up * 22); g.quadraticCurveTo(188, 92, 210, 108); g.stroke(); }   // the bond, pulled taut
      if (light > 0) for (let i = 0; i < 40; i++) { const a = rnd(i) * 6.283, k = ((r * 0.012 + rnd(i * 3)) % 1); R(g, 160 + Math.cos(a) * k * 170, 104 - up * 22 + Math.sin(a) * k * 100, 2, 2, i % 2 ? '#ffd27a' : '#fff6d8'); }
    });
    layer(g, c, 1.8, () => { g.fillStyle = '#030504'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 70); g.quadraticCurveTo(0, 96, 22, 150); g.fill(); g.beginPath(); g.moveTo(350, 150); g.lineTo(350, 84); g.quadraticCurveTo(310, 100, 292, 150); g.fill(); });
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

  // every older scene gets the finish too
  for (const id of ['rooftop', 'window', 'spring', 'city', 'peak', 'fire', 'vision', 'garden', 'thorns', 'cell', 'trials']) { const f = C[id]; if (f) C[id] = function (g, t, cue) { f(g, t, cue); C.post(g, t); }; }
  const ds = C.drawStatic; C.drawStatic = function (g, id, t) { ds(g, id, t); C.post(g, t); };
})(window.SH = window.SH || {});
