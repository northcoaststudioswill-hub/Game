// Starhaven — more animated cinematics, built in layers. Each layer slides by a different amount as the camera
// drifts and pushes in, which is what gives the picture depth. The cast are the same sprites as in the levels.
// Scenes here replace the still panels of the same name wherever a story script asks for them.
(function (SH) {
  const W = 320, H = 150, C = SH.cine;
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const sky = (g, stops) => { const gr = g.createLinearGradient(0, 0, 0, H); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const glow = (g, x, y, r, col) => { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
  // the camera: a slow sideways drift and a slow push. layer(f) draws at depth f (0 = infinitely far, 1 = the stage, >1 = close to the eye)
  function cam(t) { return { x: Math.sin(t * 0.0045) * 9, z: Math.min(0.07, t / 7000) }; }
  function layer(g, c, f, fn) { g.save(); const z = 1 + c.z * f; g.translate(W / 2, H * 0.6); g.scale(z, z); g.translate(-W / 2 - c.x * f, -H * 0.6); fn(); g.restore(); }
  function starfield(g, t, n, seed, maxY) { for (let i = 0; i < n; i++) { g.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.025 + i * 1.3)); R(g, rnd(i + seed) * (W + 40) - 20, rnd(i * 3 + seed) * maxY, rnd(i * 5) < 0.15 ? 2 : 1, 1, i % 7 ? '#eef0ff' : '#ffd27a'); } g.globalAlpha = 1; }
  function shooting(g, t, period) { const k = (t % period) / 50; if (k < 1) { const x = 60 + rnd(Math.floor(t / period)) * 200 + k * 70, y = 8 + k * 26; g.strokeStyle = 'rgba(255,246,216,' + (1 - k) + ')'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 18, y - 7); g.stroke(); } }
  function moon(g, x, y, r) { glow(g, x, y, r * 3.4, 'rgba(255,246,216,0.35)'); g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill(); g.fillStyle = 'rgba(200,200,230,0.5)'; g.beginPath(); g.arc(x - r * 0.3, y - r * 0.2, r * 0.22, 0, 6.3); g.arc(x + r * 0.25, y + r * 0.3, r * 0.15, 0, 6.3); g.fill(); }
  function skyline(g, t, base, col, seed, lit, hMin, hMax) {
    for (let i = -1; i < 22; i++) {
      const x = i * 17 + rnd(i + seed) * 6, w = 11 + rnd(i * 2 + seed) * 8, h = hMin + rnd(i * 3 + seed) * (hMax - hMin);
      R(g, x, base - h, w, h, col);
      if (rnd(i * 9 + seed) < 0.4) { g.fillStyle = col; g.beginPath(); g.moveTo(x - 1, base - h); g.lineTo(x + w / 2, base - h - 7); g.lineTo(x + w + 1, base - h); g.fill(); }
      if (lit) for (let wy = base - h + 4; wy < base - 4; wy += 7) for (let wx = x + 2; wx < x + w - 2; wx += 5) { const id = i * 131 + wy * 7 + wx; if (rnd(id + seed) < 0.42) { g.globalAlpha = 0.55 + 0.45 * Math.sin(t * 0.02 + id); R(g, wx, wy, 2, 3, rnd(id) < 0.7 ? '#ffd27a' : '#ffb057'); g.globalAlpha = 1; } }
    }
  }
  function drift(g, t, n, col, up, seed) { for (let i = 0; i < n; i++) { const yy = (rnd(i + seed) * H + t * (0.15 + rnd(i * 3) * 0.3) * (up ? -1 : 1)) % H, y = (yy + H) % H, x = (rnd(i * 2 + seed) * W + Math.sin(t * 0.02 + i) * 9 + W) % W; g.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.05 + i)); R(g, x, y, i % 3 ? 1 : 2, i % 3 ? 1 : 2, Array.isArray(col) ? col[i % col.length] : col); } g.globalAlpha = 1; }
  const person = (g, id, x, y, facing, t, extra) => SH.people.draw(g, Object.assign({ id, x, y, facing }, extra), t);
  // a hanging lantern that swings and flickers
  function lantern(g, x, y, t, r) { const sw = Math.sin(t * 0.03 + x) * 1.5, fl = 0.75 + 0.25 * Math.sin(t * 0.21 + x) * Math.sin(t * 0.13); glow(g, x + sw, y, (r || 26) * fl, 'rgba(255,200,120,0.5)'); R(g, x + sw - 2, y - 3, 5, 6, '#ffd27a'); R(g, x + sw - 1, y - 2, 3, 3, '#fff6d8'); R(g, x + sw - 3, y - 4, 7, 1, '#3a2a1e'); }

  // ---------------------------------------------------------------- The Rooftop House: where he tells her
  C.rooftop = function (g, t) {
    const c = cam(t);
    sky(g, ['#070616', '#16123a', '#3a2c6a', '#6a4a8a']);
    layer(g, c, 0.05, () => { starfield(g, t, 90, 3, 96); shooting(g, t, 520); moon(g, 246, 30, 13); });
    layer(g, c, 0.2, () => { g.fillStyle = '#1c1a44'; for (let i = -1; i < 8; i++) { g.beginPath(); g.moveTo(i * 60 - 20, 104); g.lineTo(i * 60 + 14, 70 + rnd(i) * 16); g.lineTo(i * 60 + 54, 104); g.fill(); } });
    layer(g, c, 0.35, () => skyline(g, t, 110, '#15123a', 11, true, 12, 34));
    layer(g, c, 0.55, () => {   // the river, and the nearer roofs with their chimney smoke
      const rg = g.createLinearGradient(0, 106, 0, 122); rg.addColorStop(0, '#2c2a66'); rg.addColorStop(1, '#0e0c26'); g.fillStyle = rg; g.fillRect(-20, 106, W + 40, 16);
      for (let i = 0; i < 26; i++) { g.globalAlpha = 0.25 + 0.3 * Math.sin(t * 0.05 + i * 2); R(g, rnd(i + 40) * W, 108 + rnd(i * 2) * 12, 5 + rnd(i) * 8, 1, i % 3 ? '#ffd27a' : '#cfd6ff'); } g.globalAlpha = 1;
      skyline(g, t, 126, '#0c0a24', 23, true, 10, 26);
      for (const sx of [62, 151, 238]) for (let k = 0; k < 5; k++) { const kk = ((t * 0.01 + k / 5 + sx) % 1); g.globalAlpha = 0.25 * (1 - kk); g.fillStyle = '#8a86b8'; g.beginPath(); g.arc(sx + Math.sin(kk * 5 + sx) * 4, 104 - kk * 24, 2 + kk * 4, 0, 6.3); g.fill(); } g.globalAlpha = 1;
    });
    layer(g, c, 1, () => {   // the terrace
      R(g, -30, 126, W + 60, 30, '#0a0818'); R(g, -30, 126, W + 60, 2, '#3a3470');
      for (let i = -1; i < 22; i++) { R(g, i * 16, 128, 15, 22, i % 2 ? '#15122e' : '#1a1638'); }
      R(g, -30, 112, W + 60, 3, '#2a2650'); for (let i = -1; i < 30; i++) R(g, i * 12, 114, 2, 12, '#1c1838');   // the railing
      lantern(g, 104, 98, t, 34); R(g, 103, 100, 1, 13, '#3a2a1e');
      R(g, 150, 118, 22, 2, '#5a3e2a'); R(g, 159, 120, 3, 8, '#3a2618'); R(g, 153, 113, 3, 5, '#cfd6ff'); R(g, 164, 113, 3, 5, '#cfd6ff'); R(g, 158, 110, 4, 8, '#3a2a5a');   // a table, two cups, the wine
      person(g, 'caelum', 186, 144, -1, t); person(g, 'wren', 132, 144, 1, t);
      // the thread between them: only they can feel it
      const pk = 0.35 + 0.3 * Math.sin(t * 0.045); g.strokeStyle = 'rgba(255,210,122,' + pk + ')'; g.lineWidth = 1; g.beginPath(); g.moveTo(136, 112); g.bezierCurveTo(150, 104 + Math.sin(t * 0.03) * 3, 170, 118 + Math.sin(t * 0.04) * 3, 183, 108); g.stroke();
      const mk = (t * 0.012) % 1; R(g, 136 + (183 - 136) * mk, 111 + Math.sin(mk * 6.3) * 3, 2, 2, '#fff6d8');
    });
    drift(g, t, 16, ['#ffd27a', '#fff6d8'], true, 5);
    layer(g, c, 1.7, () => {   // close to the eye: leaves in a pot, and the corner of the roof
      g.fillStyle = '#05040f'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 96); g.lineTo(18, 120); g.lineTo(30, 150); g.fill();
      for (let i = 0; i < 7; i++) { const a = -1.9 + i * 0.32 + Math.sin(t * 0.02 + i) * 0.06; g.strokeStyle = '#05040f'; g.lineWidth = 4; g.beginPath(); g.moveTo(300, 150); g.quadraticCurveTo(300 + Math.cos(a) * 22, 150 + Math.sin(a) * 30, 300 + Math.cos(a) * 40, 150 + Math.sin(a) * 44); g.stroke(); }
    });
  };

  // ---------------------------------------------------------------- Midnight at the Spring Court: he comes to the window
  C.window = function (g, t) {
    const c = cam(t), arrive = Math.min(1, Math.max(0, (t - 70) / 60));
    R(g, 0, 0, W, H, '#1c0f1e');
    layer(g, c, 0.25, () => {   // through the window: a spring night, petals on the wind
      g.save(); g.beginPath(); g.moveTo(118, 118); g.lineTo(118, 50); g.quadraticCurveTo(160, 6, 202, 50); g.lineTo(202, 118); g.closePath(); g.clip();
      sky(g, ['#0c0a26', '#2a1c4a', '#6a3a6a']); starfield(g, t, 40, 9, 90); moon(g, 178, 46, 10);
      g.fillStyle = '#2a1c3a'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(112 + i * 20, 122, 16 + rnd(i) * 6, 0, 6.3); g.fill(); }
      drift(g, t, 22, ['#ff9ac0', '#ffffff'], false, 2);
      if (arrive > 0) {   // wings first, then the man, then the eyes
        const y = 120 - arrive * 22, sp = arrive * 34;
        g.fillStyle = '#05040f'; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(160, y - 18); g.lineTo(160 + sd * sp, y - 38 - Math.sin(t * 0.05) * 3); g.lineTo(160 + sd * (sp + 10), y - 8); g.lineTo(160 + sd * sp * 0.6, y - 2); g.lineTo(160 + sd * sp * 0.3, y + 8); g.fill(); }
        R(g, 154, y - 26, 12, 30, '#05040f'); R(g, 155, y - 36, 10, 11, '#05040f');
        if (arrive >= 1) { const bl = (t % 200) < 5; if (!bl) { R(g, 157, y - 31, 2, 1, '#a58bff'); R(g, 162, y - 31, 2, 1, '#a58bff'); } glow(g, 160, y - 30, 10, 'rgba(165,139,255,0.35)'); }
      }
      g.restore();
    });
    layer(g, c, 0.8, () => {   // the wall, the arch, curtains that breathe with the night air
      g.fillStyle = '#2a1626'; g.beginPath(); g.rect(-30, 0, W + 60, H); g.moveTo(118, 118); g.lineTo(202, 118); g.lineTo(202, 50); g.quadraticCurveTo(160, 6, 118, 50); g.closePath(); g.fill('evenodd');
      g.strokeStyle = '#e8c070'; g.lineWidth = 2; g.beginPath(); g.moveTo(118, 118); g.lineTo(118, 50); g.quadraticCurveTo(160, 6, 202, 50); g.lineTo(202, 118); g.stroke();
      R(g, 159, 22, 2, 96, '#e8c070'); R(g, 118, 72, 84, 2, '#e8c070');
      for (const sd of [-1, 1]) { g.fillStyle = 'rgba(255,154,192,0.32)'; g.beginPath(); const bx = 160 + sd * 46; g.moveTo(bx, 24); for (let y = 24; y <= 122; y += 7) g.lineTo(bx + sd * (10 + Math.sin(t * 0.03 + y * 0.09) * 5 * (y / 122)), y); g.lineTo(bx - sd * 4, 122); g.fill(); }
      for (let i = 0; i < 5; i++) { g.globalAlpha = 0.06; R(g, 30 + i * 62, 0, 1, 126, '#ffffff'); } g.globalAlpha = 1;
      const mg = g.createLinearGradient(0, 118, 0, 150); mg.addColorStop(0, 'rgba(200,214,255,0.22)'); mg.addColorStop(1, 'rgba(200,214,255,0)'); g.fillStyle = mg; g.beginPath(); g.moveTo(118, 118); g.lineTo(202, 118); g.lineTo(236, 150); g.lineTo(96, 150); g.fill();   // moonlight on the floor
    });
    layer(g, c, 1, () => {
      R(g, -30, 126, W + 60, 30, '#150a16'); R(g, -30, 126, W + 60, 1, '#4a2a40');
      R(g, 26, 112, 62, 16, '#f4e8ee'); R(g, 26, 108, 62, 5, '#e8c070'); R(g, 22, 84, 5, 46, '#c8a050'); R(g, 86, 98, 5, 32, '#c8a050'); R(g, 30, 104, 18, 6, '#ffffff');   // the gilded bed
      R(g, 264, 108, 20, 22, '#c8a050'); R(g, 272, 98, 3, 10, '#f4f0e0'); const fl = Math.sin(t * 0.3) * 1; R(g, 272, 94 + fl, 3, 4, '#ffb057'); glow(g, 273, 96, 30 + fl * 3, 'rgba(255,190,110,0.4)');
      person(g, 'wren', 104, 142, 1, t, arrive > 0.2 && arrive < 1 ? { emote: { e: '!', t: 20 } } : null);
    });
    layer(g, c, 1.8, () => { R(g, -34, 0, 30, H, '#0a050c'); R(g, -6, 0, 3, H, '#e8c070'); g.fillStyle = '#0a050c'; g.beginPath(); g.moveTo(330, 150); g.lineTo(330, 60); g.quadraticCurveTo(296, 80, 300, 150); g.fill(); });
  };

  // ---------------------------------------------------------------- The Spring Court: everything she could want, and guards at every door
  C.spring = function (g, t) {
    const c = cam(t);
    sky(g, ['#ffd9e4', '#ffc2d2', '#f7a8c0', '#e890b0']);
    layer(g, c, 0.05, () => { glow(g, 70, 34, 90, 'rgba(255,246,216,0.75)'); g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(70, 34, 13, 0, 6.3); g.fill(); g.save(); g.translate(70, 34); g.rotate(t * 0.002); for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.fillStyle = 'rgba(255,246,216,0.10)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-10, 200); g.lineTo(10, 200); g.fill(); } g.restore(); });
    layer(g, c, 0.2, () => { g.fillStyle = '#d87aa0'; for (let i = -1; i < 7; i++) { g.beginPath(); g.arc(i * 64 + 10, 112, 44 + rnd(i) * 14, Math.PI, 0); g.fill(); } });
    layer(g, c, 0.45, () => { g.fillStyle = '#c0607e'; for (let i = -1; i < 12; i++) { g.beginPath(); g.arc(i * 30, 116, 16 + rnd(i * 3) * 8, Math.PI, 0); g.fill(); } for (let i = 0; i < 40; i++) R(g, rnd(i) * W, 100 + rnd(i * 2) * 14, 2, 2, i % 2 ? '#ffffff' : '#ffe9a8'); });
    layer(g, c, 0.7, () => { for (const x of [28, 96, 224, 292]) { R(g, x, 22, 12, 106, '#fbeef2'); R(g, x, 22, 3, 106, '#e0c8d2'); R(g, x - 3, 18, 18, 5, '#e8c070'); R(g, x - 3, 124, 18, 4, '#e8c070'); } R(g, -30, 14, W + 60, 6, '#fbeef2'); R(g, -30, 20, W + 60, 2, '#e8c070'); });
    layer(g, c, 1, () => {
      R(g, -30, 128, W + 60, 30, '#e8b8c8'); for (let i = -2; i < 24; i++) R(g, i * 16 + (i % 2) * 3, 128, 14, 1, '#f7d2de'); R(g, -30, 128, W + 60, 1, '#fbeef2');
      // the fountain: water rises, arcs and falls
      R(g, 140, 118, 40, 10, '#fbeef2'); R(g, 140, 118, 40, 2, '#ffffff'); R(g, 157, 96, 6, 22, '#fbeef2'); R(g, 152, 94, 16, 3, '#e8c070');
      for (let i = 0; i < 14; i++) { const k = ((t * 0.02 + i / 14) % 1), sd = i % 2 ? 1 : -1; g.globalAlpha = 1 - k; R(g, 160 + sd * k * 15, 94 - Math.sin(k * Math.PI) * 14 + k * 24, 1, 2, '#bfe8ff'); } g.globalAlpha = 1;
      person(g, 'wren', 116, 146, 1, t);
      // the guards never look at her, and never look away
      for (const [x, f] of [[40, 1], [262, -1]]) { R(g, x - 4, 104, 8, 26, '#3a5a2a'); R(g, x - 3, 96, 6, 8, '#f2d8b8'); R(g, x - 4, 93, 8, 4, '#e8c070'); R(g, x + f * 6, 84, 1, 46, '#c8a050'); R(g, x + f * 5, 82, 3, 5, '#e8eef8'); }
    });
    drift(g, t, 34, ['#ff9ac0', '#ffffff', '#ffd9e4'], false, 7);
    layer(g, c, 1.7, () => { g.strokeStyle = '#7a3a52'; g.lineWidth = 4; g.beginPath(); g.moveTo(-40, 10); g.quadraticCurveTo(40, 26 + Math.sin(t * 0.02) * 2, 110, 6); g.stroke(); for (let i = 0; i < 16; i++) { const bx = -20 + i * 8, by = 14 + Math.sin(i * 0.9) * 8 + Math.sin(t * 0.03 + i) * 1.5; g.fillStyle = i % 3 ? '#ff9ac0' : '#ffffff'; g.beginPath(); g.arc(bx, by, 4, 0, 6.3); g.fill(); } });
  };

  // ---------------------------------------------------------------- Starhaven at night
  C.city = function (g, t) {
    const c = cam(t);
    sky(g, ['#05051a', '#141240', '#33286a', '#5a3c7a']);
    layer(g, c, 0.05, () => { starfield(g, t, 110, 21, 100); shooting(g, t, 430); moon(g, 70, 28, 11); });
    layer(g, c, 0.15, () => { g.fillStyle = '#18163e'; for (let i = -1; i < 8; i++) { g.beginPath(); g.moveTo(i * 56 - 10, 96); g.lineTo(i * 56 + 20, 58 + rnd(i * 2) * 20); g.lineTo(i * 56 + 60, 96); g.fill(); } });
    layer(g, c, 0.3, () => { glow(g, 160, 100, 120, 'rgba(255,190,110,0.22)'); skyline(g, t, 100, '#191648', 5, true, 14, 40); R(g, 152, 44, 6, 56, '#191648'); g.fillStyle = '#191648'; g.beginPath(); g.moveTo(148, 46); g.lineTo(155, 30); g.lineTo(162, 46); g.fill(); glow(g, 155, 36, 12, 'rgba(255,246,216,0.6)'); R(g, 154, 35, 2, 2, '#fff6d8'); });   // the Library's tower and its light
    layer(g, c, 0.5, () => skyline(g, t, 114, '#110f34', 31, true, 12, 30));
    layer(g, c, 0.75, () => {
      const rg = g.createLinearGradient(0, 112, 0, 132); rg.addColorStop(0, '#2a2866'); rg.addColorStop(1, '#0a0a22'); g.fillStyle = rg; g.fillRect(-30, 112, W + 60, 20);
      for (let i = 0; i < 40; i++) { g.globalAlpha = 0.2 + 0.35 * Math.sin(t * 0.06 + i * 2.1); R(g, rnd(i + 70) * W, 114 + rnd(i * 2) * 16, 4 + rnd(i) * 10, 1, i % 4 ? '#ffd27a' : '#cfd6ff'); } g.globalAlpha = 1;
      const bx = ((t * 0.12) % (W + 60)) - 30; R(g, bx, 122, 16, 3, '#0a0818'); R(g, bx + 6, 115, 1, 7, '#0a0818'); lantern(g, bx + 7, 114, t, 10);   // a boat on the river
      g.fillStyle = '#0c0a26'; g.beginPath(); g.moveTo(84, 132); g.quadraticCurveTo(160, 100, 236, 132); g.lineTo(226, 132); g.quadraticCurveTo(160, 108, 94, 132); g.fill(); for (let i = 0; i < 7; i++) lantern(g, 100 + i * 20, 121 - Math.sin(i / 6 * Math.PI) * 11, t, 9);   // the bridge
    });
    layer(g, c, 1, () => { skyline(g, t, 150, '#07061a', 47, true, 12, 26); g.strokeStyle = '#3a3470'; g.lineWidth = 1; g.beginPath(); g.moveTo(-20, 112); g.quadraticCurveTo(80, 126 + Math.sin(t * 0.02) * 1.5, 170, 108); g.quadraticCurveTo(250, 124 + Math.sin(t * 0.025) * 1.5, 340, 110); g.stroke(); for (let i = 0; i < 12; i++) { const k = i / 11, x = -20 + k * 360, y = k < 0.53 ? 112 + Math.sin(k / 0.53 * Math.PI) * 10 : 108 + Math.sin((k - 0.53) / 0.47 * Math.PI) * 11; lantern(g, x, y + 2, t + i * 20, 8); } });
    drift(g, t, 14, ['#ffd27a'], true, 12);
    layer(g, c, 1.8, () => { g.fillStyle = '#04030c'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 104); g.lineTo(40, 132); g.lineTo(60, 150); g.fill(); R(g, 4, 100, 8, 24, '#04030c'); R(g, 2, 97, 12, 4, '#04030c'); });
  };

  // ---------------------------------------------------------------- The peak: Rowan brings spring up a mountain to get her back
  C.peak = function (g, t) {
    const c = cam(t);
    sky(g, ['#0a1024', '#1c2a4a', '#4a5a86', '#9aa6c8']);
    layer(g, c, 0.05, () => { starfield(g, t, 50, 8, 60);
      for (let b = 0; b < 3; b++) { g.beginPath(); for (let x = -20; x <= W + 20; x += 8) { const y = 26 + b * 9 + Math.sin(x * 0.02 + t * 0.008 + b) * 9 + Math.sin(x * 0.05 - t * 0.012) * 3; x === -20 ? g.moveTo(x, y) : g.lineTo(x, y); } for (let x = W + 20; x >= -20; x -= 8) g.lineTo(x, 26 + b * 9 + Math.sin(x * 0.02 + t * 0.008 + b) * 9 + 16); g.fillStyle = ['rgba(120,255,200,0.10)', 'rgba(150,180,255,0.10)', 'rgba(255,154,192,0.08)'][b]; g.fill(); } });   // an aurora
    layer(g, c, 0.2, () => { for (let i = -1; i < 7; i++) { const x = i * 62, h = 46 + rnd(i * 5) * 26; g.fillStyle = '#3a4a70'; g.beginPath(); g.moveTo(x - 20, 112); g.lineTo(x + 30, 112 - h); g.lineTo(x + 80, 112); g.fill(); g.fillStyle = '#e8eef8'; g.beginPath(); g.moveTo(x + 30, 112 - h); g.lineTo(x + 18, 112 - h + 14); g.lineTo(x + 28, 112 - h + 9); g.lineTo(x + 36, 112 - h + 16); g.lineTo(x + 44, 112 - h + 13); g.fill(); } });
    layer(g, c, 0.5, () => { g.fillStyle = '#26324e'; g.beginPath(); g.moveTo(-30, 126); g.lineTo(60, 96); g.lineTo(140, 118); g.lineTo(230, 90); g.lineTo(350, 124); g.lineTo(350, 150); g.lineTo(-30, 150); g.fill(); glow(g, 250, 132, 90, 'rgba(255,200,120,0.16)'); });
    layer(g, c, 1, () => {
      g.fillStyle = '#e8eef8'; g.beginPath(); g.moveTo(-30, 132); g.quadraticCurveTo(80, 122, 160, 130); g.quadraticCurveTo(250, 136, 350, 126); g.lineTo(350, 150); g.lineTo(-30, 150); g.fill(); R(g, -30, 144, W + 60, 6, '#c8d2e2');
      // the Old Wyrm, fallen, already snowing over
      g.fillStyle = '#343e54'; g.beginPath(); g.ellipse(262, 128, 40, 11, -0.05, Math.PI, 0); g.fill(); g.fillStyle = '#e8eef8'; g.beginPath(); g.ellipse(262, 121, 30, 4, -0.05, Math.PI, 0); g.fill(); for (let i = 0; i < 5; i++) { g.fillStyle = '#c8d2e2'; g.beginPath(); g.moveTo(238 + i * 11, 119); g.lineTo(242 + i * 11, 111); g.lineTo(246 + i * 11, 119); g.fill(); }
      // flowers come up through the snow wherever Rowan stands
      for (let i = 0; i < 16; i++) { const fx = 54 + rnd(i) * 70, grow = Math.min(1, Math.max(0, (t - 40 - i * 14) / 60)); if (!grow) continue; R(g, fx, 131 - grow * 6, 1, grow * 6, '#4a8a3a'); g.fillStyle = i % 2 ? '#ff9ac0' : '#ffe9a8'; g.beginPath(); g.arc(fx + 0.5, 131 - grow * 6, 2.2 * grow, 0, 6.3); g.fill(); }
      glow(g, 90, 112, 46, 'rgba(255,210,150,0.28)');
      person(g, 'rowan', 92, 134, 1, t); person(g, 'wren', 186, 135, -1, t); person(g, 'caelum', 214, 136, -1, t);
    });
    for (let i = 0; i < 46; i++) { const x = ((rnd(i) * W - t * (0.9 + rnd(i * 2))) % W + W) % W, y = (rnd(i * 5) * H + t * 0.3) % H; R(g, x, y, 3, 1, 'rgba(255,255,255,0.7)'); }   // wind-driven snow from his side meets...
    for (let i = 0; i < 14; i++) { const x = (rnd(i + 90) * 140 + t * 0.25 + Math.sin(t * 0.03 + i) * 6) % 170, y = (rnd(i * 3 + 90) * H + t * 0.2) % H; R(g, x, y, 2, 2, i % 2 ? '#ff9ac0' : '#ffe9a8'); }   // ...petals from his
    layer(g, c, 1.7, () => { g.fillStyle = '#0a1020'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 110); g.lineTo(-6, 100); g.lineTo(22, 124); g.lineTo(44, 150); g.fill(); g.beginPath(); g.moveTo(350, 150); g.lineTo(350, 96); g.lineTo(316, 118); g.lineTo(296, 150); g.fill(); });
  };

  // ---------------------------------------------------------------- By the fire
  C.fire = function (g, t) {
    const c = cam(t), fl = 0.8 + 0.2 * Math.sin(t * 0.17) * Math.sin(t * 0.11 + 1);
    R(g, 0, 0, W, H, '#150c0c');
    layer(g, c, 0.6, () => {   // the back wall: stone, a rack of practice blades, a banner
      for (let y = 0; y < 126; y += 14) for (let x = -30 + (y / 14 % 2) * 14; x < W + 30; x += 28) { R(g, x, y, 27, 13, SH.shade('#2a1a18', 0.8 + rnd(x * 3 + y) * 0.4)); R(g, x, y, 27, 1, 'rgba(255,200,150,0.06)'); }
      R(g, 40, 50, 52, 3, '#3a2a1e'); for (let i = 0; i < 5; i++) { R(g, 46 + i * 10, 30, 2, 46, '#c8d2e2'); R(g, 45 + i * 10, 52, 4, 6, '#5a3e2a'); }
      R(g, 246, 22, 2, 70, '#16142c'); g.fillStyle = '#7a2a4a'; g.beginPath(); g.moveTo(248, 24); g.lineTo(276, 24); g.lineTo(276, 78); g.lineTo(262, 68); g.lineTo(248, 78); g.fill(); R(g, 260, 38, 3, 14, '#ffd27a'); R(g, 255, 43, 13, 3, '#ffd27a');
      glow(g, 160, 104, 150 * fl, 'rgba(255,150,70,0.32)');
    });
    layer(g, c, 0.85, () => {   // the hearth and its fire
      R(g, 118, 50, 84, 78, '#1c1210'); R(g, 112, 44, 96, 8, '#3a2622'); R(g, 112, 44, 96, 2, '#5a3e36'); R(g, 126, 62, 68, 66, '#0a0606');
      R(g, 134, 122, 52, 6, '#3a2618'); R(g, 140, 118, 40, 5, '#4a3020');
      for (let i = 0; i < 9; i++) { const fx = 138 + i * 5.5, h = (16 + rnd(i) * 22) * (0.7 + 0.3 * Math.sin(t * 0.2 + i * 1.9)), sw = Math.sin(t * 0.13 + i) * 3; g.fillStyle = '#ff6a3d'; g.beginPath(); g.moveTo(fx - 5, 120); g.quadraticCurveTo(fx + sw, 120 - h * 0.6, fx + sw * 1.4, 120 - h); g.quadraticCurveTo(fx + 3, 120 - h * 0.5, fx + 5, 120); g.fill(); g.fillStyle = '#ffd27a'; g.beginPath(); g.moveTo(fx - 3, 120); g.quadraticCurveTo(fx + sw * 0.6, 120 - h * 0.4, fx + sw, 120 - h * 0.62); g.quadraticCurveTo(fx + 2, 120 - h * 0.3, fx + 3, 120); g.fill(); }
      glow(g, 160, 108, 34 * fl, 'rgba(255,246,216,0.5)');
    });
    layer(g, c, 1, () => {
      R(g, -30, 128, W + 60, 30, '#1a100e'); for (let i = -2; i < 16; i++) R(g, i * 24, 128, 23, 1, '#3a2622');
      const fg2 = g.createLinearGradient(0, 128, 0, 150); fg2.addColorStop(0, 'rgba(255,150,70,' + 0.35 * fl + ')'); fg2.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = fg2; g.beginPath(); g.moveTo(120, 128); g.lineTo(200, 128); g.lineTo(250, 150); g.lineTo(70, 150); g.fill();
      R(g, 60, 128, 34, 6, '#3a2618'); R(g, 226, 128, 34, 6, '#3a2618');   // two benches
      person(g, 'wren', 84, 132, 1, t); person(g, 'bram', 240, 132, -1, t);
    });
    drift(g, t, 22, ['#ffb060', '#ffd27a'], true, 3);
    layer(g, c, 1.8, () => { g.fillStyle = '#080404'; g.beginPath(); g.moveTo(-40, 150); g.lineTo(-40, 86); g.quadraticCurveTo(0, 96, 16, 150); g.fill(); R(g, 300, 104, 40, 46, '#080404'); R(g, 296, 100, 48, 5, '#080404'); });
  };

  // ---------------------------------------------------------------- Iris's vision: threads of light crossing the sea, and an iron crown pulling two of them
  C.vision = function (g, t) {
    const c = cam(t), pull = 0.5 + 0.5 * Math.sin(t * 0.02);
    sky(g, ['#02030c', '#0a1030', '#102048', '#0a1830']);
    layer(g, c, 0.1, () => starfield(g, t, 70, 33, 150));
    layer(g, c, 0.5, () => { for (let i = 0; i < 9; i++) { const y = 96 + i * 6; g.strokeStyle = 'rgba(120,160,255,' + (0.05 + i * 0.012) + ')'; g.lineWidth = 1; g.beginPath(); for (let x = -20; x <= W + 20; x += 6) { const yy = y + Math.sin(x * 0.05 + t * 0.03 + i) * (1 + i * 0.3); x === -20 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); } });   // the sea between the worlds
    layer(g, c, 1, () => {
      const cx = 160, cy = 46 + Math.sin(t * 0.015) * 3;
      // many threads, most of them slack and golden
      for (let i = 0; i < 9; i++) { const x0 = -20, y0 = 20 + i * 14, x1 = W + 20, y1 = 130 - i * 11; g.strokeStyle = 'rgba(255,233,168,' + (0.12 + 0.1 * Math.sin(t * 0.03 + i)) + ')'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.bezierCurveTo(100, y0 + 30 + Math.sin(t * 0.02 + i) * 8, 220, y1 - 30 + Math.sin(t * 0.025 + i) * 8, x1, y1); g.stroke(); const k = (t * 0.004 + i * 0.13) % 1; R(g, x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + Math.sin(k * 6.3) * 8, 2, 2, '#fff6d8'); }
      // two threads end at two small figures in a cottage doorway, far away
      R(g, 36, 110, 30, 18, '#1c1410'); g.fillStyle = '#2a1c16'; g.beginPath(); g.moveTo(32, 110); g.lineTo(51, 98); g.lineTo(70, 110); g.fill(); R(g, 47, 116, 8, 12, '#ffd27a'); glow(g, 51, 120, 22, 'rgba(255,210,122,0.4)');
      R(g, 44, 119, 3, 9, '#5a5a6a'); R(g, 44, 116, 3, 3, '#f0d4c0'); R(g, 55, 120, 3, 8, '#4a7a4a'); R(g, 55, 117, 3, 3, '#f0d4c0');
      for (const [fx, fy] of [[45, 120], [56, 121]]) { g.strokeStyle = 'rgba(255,90,90,' + (0.45 + 0.4 * pull) + ')'; g.lineWidth = 1 + pull; g.beginPath(); g.moveTo(fx, fy); g.quadraticCurveTo(110, fy - 10 - (1 - pull) * 22, cx + (fx < 50 ? -8 : 8), cy + 8); g.stroke(); }
      // the iron crown, turning slowly
      glow(g, cx, cy, 50, 'rgba(255,60,60,' + (0.15 + 0.15 * pull) + ')');
      for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + t * 0.01, px = cx + Math.cos(a) * 20, dep = Math.sin(a); if (dep < 0) continue; R(g, px - 2, cy - 14 - dep * 5, 4, 20, '#4a4a56'); g.fillStyle = '#6a6a78'; g.beginPath(); g.moveTo(px - 2, cy - 14 - dep * 5); g.lineTo(px, cy - 24 - dep * 6); g.lineTo(px + 2, cy - 14 - dep * 5); g.fill(); }
      R(g, cx - 21, cy + 2, 42, 6, '#3a3a46'); R(g, cx - 21, cy + 2, 42, 1, '#8a8a98'); R(g, cx - 2, cy + 3, 4, 4, '#ff4a4a');
    });
    drift(g, t, 18, ['#ffe9a8', '#9fd8ff'], true, 41);
    const vg = g.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 190); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(120,200,255,0.16)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  };
  C._h = { W, H, rnd, R, sky, glow, cam, layer, starfield, shooting, moon, skyline, drift, person, lantern };
})(window.SH = window.SH || {});
