// Starhaven — animated cinematics. Each scene draws itself at 320 x 150 for frame t (60 per second).
// `cue` is the last cue the story script sent ({ name, t: frames since }), so dialogue can trigger the action:
// e.g. { do: 'cue', name: 'shoot' } fires the arrow. Static panels (art.js) get a slow push-in and drifting particles.
(function (SH) {
  const W = 320, H = 150;
  const C = SH.cine = {};
  const ease = k => k < 0 ? 0 : k > 1 ? 1 : k * k * (3 - 2 * k);
  const clamp01 = k => Math.max(0, Math.min(1, k));
  function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

  // helpers ---------------------------------------------------------------
  function sky(g, a, b) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  function R(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
  function stars(g, n, seed, t) { for (let i = 0; i < n; i++) { g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 0.04 + i); R(g, rnd(i + seed) * W, rnd(i * 3 + seed) * 95, 1, 1, '#eef'); } g.globalAlpha = 1; }
  function pines(g, base, col, seed, n) { g.fillStyle = col; for (let i = 0; i < n; i++) { const x = rnd(i + seed) * W, h = 40 + rnd(i * 7 + seed) * 50; g.beginPath(); g.moveTo(x, base - h); g.lineTo(x - 13, base); g.lineTo(x + 13, base); g.fill(); } }
  function snow(g, t, n, wind) { g.fillStyle = '#ffffff'; for (let i = 0; i < n; i++) { const x = ((rnd(i) * W + t * (0.2 + wind) + Math.sin(t * 0.02 + i) * 6) % W + W) % W, y = (rnd(i * 5) * H + t * (0.35 + rnd(i * 9) * 0.4)) % H; g.globalAlpha = 0.5 + rnd(i * 2) * 0.5; g.fillRect(x, y, rnd(i) < 0.2 ? 2 : 1, rnd(i) < 0.2 ? 2 : 1); } g.globalAlpha = 1; }
  function glow(g, x, y, r, col) { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  function stag(g, x, y, s, fall, headDown) {
    // a white stag with silver antlers; fall 0..1 tips it onto its side
    if (fall > 0.5) { // lying in the snow
      g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = Math.min(1, (fall - 0.5) * 3);
      g.fillStyle = 'rgba(70,80,120,0.35)'; g.beginPath(); g.ellipse(0, 1, 30, 4, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#8a96b8'; g.fillRect(-19, -10, 34, 11); g.fillRect(13, -7, 14, 7);
      g.fillStyle = '#f2f4ff'; g.fillRect(-18, -9, 32, 9); g.fillRect(14, -6, 12, 5);
      g.fillRect(-14, -3, 12, 2); g.fillRect(2, -3, 12, 2);
      g.strokeStyle = '#d6dcff'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(24, -5); g.lineTo(32, -12); g.lineTo(36, -16); g.moveTo(32, -12); g.lineTo(38, -10); g.stroke();
      g.fillStyle = '#1a1430'; g.fillRect(22, -5, 2, 1);
      g.restore(); g.globalAlpha = 1; return;
    }
    g.save(); g.translate(x, y); g.rotate(fall * 0.5); g.scale(s, s);
    g.fillStyle = '#f2f4ff';
    g.fillRect(-16, -22, 30, 12);                 // body
    g.fillRect(-14, -12, 3, 12); g.fillRect(-8, -12, 3, 12); g.fillRect(4, -12, 3, 12); g.fillRect(10, -12, 3, 12);
    const hy = headDown ? -14 : -34;
    g.fillRect(10, hy, 6, 18 - (headDown ? 6 : 0)); g.fillRect(12, hy - 4, 10, 7);
    g.strokeStyle = '#d6dcff'; g.lineWidth = 1.5; g.beginPath();
    g.moveTo(14, hy - 4); g.lineTo(10, hy - 14); g.lineTo(6, hy - 18); g.moveTo(10, hy - 14); g.lineTo(14, hy - 20);
    g.moveTo(17, hy - 4); g.lineTo(21, hy - 14); g.lineTo(25, hy - 17); g.moveTo(21, hy - 14); g.lineTo(19, hy - 21); g.stroke();
    g.fillStyle = '#1a1430'; g.fillRect(19, hy - 2, 2, 2);
    g.restore();
  }
  function figure(g, x, y, h, col, hair) { R(g, x - 3, y - h, 6, h - 6, col); R(g, x - 2, y - h - 6, 5, 6, '#f6dcc6'); if (hair) R(g, x - 3, y - h - 7, 6, 4, hair); R(g, x - 3, y - 6, 2, 6, col); R(g, x + 1, y - 6, 2, 6, col); }

  // the shot -------------------------------------------------------------
  C.hunt = function (g, t, cue) {
    sky(g, '#9fb4d8', '#e6eefc');
    pines(g, 110, '#6a7ea8', 3, 16); pines(g, 120, '#40506e', 9, 12);
    R(g, 0, 112, W, 38, '#f4f8ff'); R(g, 0, 112, W, 2, '#ffffff');
    const shot = cue && cue.name === 'shoot' ? cue.t : -1;
    const hit = shot >= 0 && shot > 22;
    const fall = hit ? ease((shot - 22) / 40) : 0;
    stag(g, 230, 114, 1.3, fall, !hit && Math.sin(t * 0.02) > 0);
    // Wren, kneeling with the bow drawn
    figure(g, 60, 114, 20, '#2f8f7a', '#d8653a');
    g.strokeStyle = '#8a5a2a'; g.lineWidth = 2; g.beginPath(); g.arc(66, 100, 9, -1.3, 1.3); g.stroke();
    if (shot < 0) { g.strokeStyle = '#e8e0c8'; g.lineWidth = 1; g.beginPath(); g.moveTo(69, 92); g.lineTo(62, 100); g.lineTo(69, 108); g.stroke(); }
    if (shot >= 0 && shot <= 22) { const k = shot / 22, ax = 70 + k * 158, ay = 100 - Math.sin(k * Math.PI) * 6; R(g, ax - 10, ay, 12, 1, '#5a3a1a'); R(g, ax, ay - 1, 3, 3, '#c0c8d8'); }
    if (hit) {
      if (shot < 30) { g.fillStyle = 'rgba(255,255,255,' + (1 - (shot - 22) / 8) + ')'; g.fillRect(0, 0, W, H); }
      // golden fae light rising out of the stag: it was never just a deer
      for (let i = 0; i < 18; i++) { const k = ((shot - 30) * 0.6 + i * 7) % 80; if (shot < 30) break; g.globalAlpha = 1 - k / 80; R(g, 222 + rnd(i) * 30, 100 - k, 2, 2, '#ffd27a'); }
      g.globalAlpha = 1;
      if (shot > 40) glow(g, 236, 100, 40 + Math.sin(t * 0.1) * 4, 'rgba(255,210,122,0.35)');
    }
    snow(g, t, 60, 0.1);
  };

  // the cottage at night; the door bursts in -----------------------------
  C.cottage = function (g, t, cue) {
    R(g, 0, 0, W, H, '#2a1c18');
    for (let x = 0; x < W; x += 22) R(g, x, 0, 2, 112, '#20140f');
    R(g, 0, 112, W, 38, '#3a2a20');
    // the fire
    const f = Math.sin(t * 0.3) * 2;
    glow(g, 60, 98, 90 + f * 3, 'rgba(255,150,70,0.45)');
    R(g, 36, 82, 48, 30, '#4a3428'); R(g, 44, 92, 32, 20, '#120a08');
    g.fillStyle = '#ff8a3a'; g.beginPath(); g.moveTo(48, 112); g.lineTo(60, 92 + f); g.lineTo(72, 112); g.fill();
    g.fillStyle = '#ffe08a'; g.beginPath(); g.moveTo(54, 112); g.lineTo(60, 100 - f); g.lineTo(66, 112); g.fill();
    figure(g, 100, 116, 20, '#5a5a6a', '#2a1a14');   // Nessa
    figure(g, 116, 116, 17, '#4a7a4a', '#a87a4a');   // Lissa
    figure(g, 140, 116, 22, '#2f8f7a', '#d8653a');   // Wren
    // the door
    const d = cue && cue.name === 'door' ? cue.t : -1;
    const open = d >= 0 ? ease(d / 10) : 0;
    R(g, 236, 40, 52, 72, '#0a0c18');
    if (d >= 0) {
      sky(g, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)');
      g.save(); g.beginPath(); g.rect(236, 40, 52, 72); g.clip();
      R(g, 236, 40, 52, 72, '#1a2240'); snow(g, t * 3, 30, 2);
      // the lord in the doorway: antler crown, gold eyes
      const k = clamp01((d - 12) / 30);
      g.globalAlpha = k; R(g, 252, 52, 20, 60, '#05060c'); R(g, 256, 44, 12, 12, '#05060c');
      g.strokeStyle = '#05060c'; g.lineWidth = 2; g.beginPath(); g.moveTo(258, 46); g.lineTo(252, 34); g.moveTo(266, 46); g.lineTo(272, 34); g.moveTo(255, 40); g.lineTo(249, 38); g.moveTo(269, 40); g.lineTo(275, 38); g.stroke();
      R(g, 258, 49, 2, 2, '#ffd27a'); R(g, 264, 49, 2, 2, '#ffd27a');
      g.globalAlpha = 1; g.restore();
      // snow blowing into the room
      g.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) { const k2 = ((d * 3 + i * 17) % 220); g.globalAlpha = 1 - k2 / 220; g.fillRect(236 - k2 * (0.8 + rnd(i) * 0.5), 50 + rnd(i * 3) * 60 + Math.sin(k2 * 0.1 + i) * 4, 2, 1); }
      g.globalAlpha = 1;
    }
    g.save(); g.translate(236, 40); g.scale(1 - open * 0.92, 1); R(g, 0, 0, 52, 72, '#5a3a24'); R(g, 4, 6, 44, 2, '#3a2414'); R(g, 4, 60, 44, 2, '#3a2414'); g.restore();
    if (d >= 0 && d < 8) { g.fillStyle = 'rgba(255,255,255,' + (0.5 - d / 16) + ')'; g.fillRect(0, 0, W, H); }
  };

  // crossing the Wall ------------------------------------------------------
  C.wall = function (g, t) {
    sky(g, '#0c1026', '#2a2448'); stars(g, 50, 5, t);
    R(g, 0, 112, W, 38, '#e8eef8');
    // the Wall: a curtain of shimmering light between the mortal lands and the fae
    for (let y = 0; y < 112; y += 2) { const x = 180 + Math.sin(y * 0.08 + t * 0.05) * 3; g.globalAlpha = 0.25 + 0.2 * Math.sin(y * 0.3 + t * 0.1); R(g, x, y, 6, 2, '#b9f0ff'); }
    g.globalAlpha = 1;
    // beyond the Wall, it is spring
    g.save(); g.beginPath(); g.rect(186, 0, W - 186, H); g.clip();
    sky(g, '#f8d8e8', '#ffeef4'); R(g, 0, 112, W, 38, '#9ad08a');
    for (let i = 0; i < 20; i++) R(g, 190 + rnd(i) * 130, 108 - rnd(i * 3) * 30, 4, 4, i % 2 ? '#ff9ac0' : '#fff0f6');
    g.restore();
    const k = ((t % 600) / 600), x = 40 + k * 220;
    figure(g, x, 114, 30, '#3a5a2a', '#e8c070');           // the lord
    figure(g, x - 16, 114, 22, '#2f8f7a', '#d8653a');      // Wren, a step behind
    if (Math.abs(x - 183) < 20) glow(g, 183, 80, 50, 'rgba(185,240,255,0.5)');
    snow(g, t, 25, 0);
  };

  // the Spring Court garden: Wren paints for the first time -------------------
  C.garden = function (g, t) {
    sky(g, '#ffe4ee', '#fff6f0');
    R(g, 0, 108, W, 42, '#8ac87a'); R(g, 0, 108, W, 2, '#b8e8a0');
    for (let i = 0; i < 8; i++) { const x = 20 + i * 42; R(g, x, 60, 6, 48, '#7a5a3a'); g.fillStyle = '#ffb8d0'; g.beginPath(); g.arc(x + 3, 56, 18, 0, Math.PI * 2); g.fill(); }
    // easel and the painting growing stroke by stroke
    R(g, 150, 70, 3, 40, '#7a5a3a'); R(g, 176, 70, 3, 40, '#7a5a3a'); R(g, 146, 62, 38, 30, '#fffaf0');
    const n = Math.min(40, Math.floor(t / 8)), cols = ['#2a3a7a', '#6a3a9a', '#ffd27a', '#2f8f7a', '#ff9a7a'];
    for (let i = 0; i < n; i++) R(g, 149 + rnd(i) * 30, 65 + rnd(i * 3) * 24, 4, 2, cols[i % cols.length]);
    figure(g, 134, 112, 22, '#2f8f7a', '#d8653a');
    R(g, 138, 92 + Math.sin(t * 0.2) * 2, 6, 1, '#7a5a3a');
    figure(g, 230, 112, 30, '#3a5a2a', '#e8c070');           // Rowan, watching
    for (let i = 0; i < 30; i++) { const y = (rnd(i) * H + t * (0.3 + rnd(i) * 0.3)) % H, x = (rnd(i * 2) * W + Math.sin(t * 0.02 + i) * 10 + W) % W; R(g, x, y, 2, 2, i % 2 ? '#ff9ac0' : '#ffffff'); }
  };

  // the Thorn Queen's blight spreads ----------------------------------------
  C.thorns = function (g, t) {
    sky(g, '#2a0a12', '#6a1a22');
    g.fillStyle = '#12040a'; g.beginPath(); g.moveTo(110, 120); g.lineTo(170, 30); g.lineTo(240, 120); g.fill();
    glow(g, 170, 90, 40, 'rgba(255,60,90,0.35)');
    R(g, 0, 118, W, 32, '#1a0810');
    const grow = Math.min(1, t / 360);
    g.strokeStyle = '#4a1a2a'; g.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const x0 = rnd(i) * W, len = grow * (60 + rnd(i * 2) * 70);
      g.beginPath(); g.moveTo(x0, H);
      for (let k = 0; k < len; k += 6) g.lineTo(x0 + Math.sin(k * 0.08 + i) * 10, H - k);
      g.stroke();
      if (len > 20) R(g, x0 + Math.sin(len * 0.08 + i) * 10 - 1, H - len, 3, 3, '#ff4a5a');
    }
    g.lineWidth = 1;
  };

  // a cell in the Deep. Caelum comes out of the dark --------------------------
  C.cell = function (g, t, cue) {
    R(g, 0, 0, W, H, '#07080a');
    for (let x = 60; x < 260; x += 16) R(g, x, 0, 4, 120, '#1a1c20');
    R(g, 0, 118, W, 32, '#101214');
    figure(g, 120, 120, 14, '#2f6a5a', '#a8452a');   // Wren, curled up, feverish
    R(g, 112, 112, 16, 6, '#2f6a5a');
    const c = cue && cue.name === 'caelum' ? cue.t : -1;
    if (c >= 0) {
      const k = clamp01(c / 60);
      glow(g, 190, 80, 70 * k, 'rgba(160,140,255,0.35)');
      for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2 + t * 0.01, r = 40 * k + rnd(i) * 20; g.globalAlpha = k * (0.5 + 0.5 * Math.sin(t * 0.1 + i)); R(g, 190 + Math.cos(a) * r, 80 + Math.sin(a) * r * 0.6, 1, 1, '#ffffff'); }
      g.globalAlpha = k;
      g.fillStyle = '#05040e';
      g.beginPath(); g.moveTo(186, 70); g.quadraticCurveTo(150, 50, 146, 104); g.lineTo(176, 90); g.fill();
      g.beginPath(); g.moveTo(196, 70); g.quadraticCurveTo(232, 50, 236, 104); g.lineTo(206, 90); g.fill();
      figure(g, 191, 120, 34, '#05040e', '#05040e');
      R(g, 190, 74, 2, 2, '#a58bff');
      g.globalAlpha = 1;
    }
  };

  // the three trials ------------------------------------------------------
  C.trials = function (g, t, cue) {
    const name = cue ? cue.name : 'riddle', ct = cue ? cue.t : t;
    if (name === 'riddle' || !cue) {
      R(g, 0, 0, W, H, '#14060c');
      for (let i = 0; i < 9; i++) { g.globalAlpha = 0.4 + 0.4 * Math.sin(t * 0.05 + i); g.fillStyle = '#ff7a8a'; g.font = '14px serif'; g.fillText('ᚠᚱᛁᛟᛒᚹ'.charAt(i % 6), 40 + i * 30, 50 + Math.sin(i) * 20); }
      g.globalAlpha = 1; figure(g, 160, 130, 22, '#2f8f7a', '#d8653a');
    } else if (name === 'maze') {
      R(g, 0, 0, W, H, '#0a0a08');
      g.strokeStyle = '#6a5a3a'; g.lineWidth = 2;
      const n = Math.min(60, ct / 2);
      for (let i = 0; i < n; i++) { const x = 20 + (i % 10) * 28, y = 14 + Math.floor(i / 10) * 22; g.beginPath(); g.moveTo(x, y); rnd(i) < 0.5 ? g.lineTo(x + 28, y) : g.lineTo(x, y + 22); g.stroke(); }
      g.lineWidth = 1; R(g, 30 + Math.min(240, ct * 1.2), 128, 4, 6, '#ffd27a');
    } else if (name === 'beast') {
      R(g, 0, 0, W, H, '#0a0f0a'); R(g, 0, 100, W, 50, '#1a2418');
      const k = clamp01(ct / 50);
      for (let i = 0; i < 6; i++) { g.fillStyle = '#050805'; g.beginPath(); g.ellipse(80 + i * 34, 104 - Math.sin(t * 0.05 + i) * 6 * k, 22, 14 * k + 2, 0, 0, Math.PI * 2); g.fill(); }
      R(g, 250, 82, 10, 4, '#d6f0dc'); R(g, 250, 96, 10, 4, '#d6f0dc');
      figure(g, 60, 110, 20, '#2f8f7a', '#d8653a');
    } else if (name === 'end') {
      R(g, 0, 0, W, H, '#1a0408');
      figure(g, 160, 120, 22, '#2f8f7a', '#d8653a');
      const k = clamp01(ct / 30);
      g.strokeStyle = '#4a1a2a'; g.lineWidth = 3;
      for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(rnd(i) * W, H); g.lineTo(160 + (rnd(i) - 0.5) * 6, 120 - 14 * k * rnd(i * 4)); g.stroke(); }
      g.lineWidth = 1;
      if (ct > 30) { g.fillStyle = 'rgba(0,0,0,' + clamp01((ct - 30) / 60) + ')'; g.fillRect(0, 0, W, H); }
    }
  };

  // Caelum's blood brings her back, and the bond wakes -----------------------
  C.rebirth = function (g, t, cue) {
    sky(g, '#05060e', '#141436'); stars(g, 70, 11, t);
    R(g, 0, 124, W, 26, '#1a1830');
    const rise = cue && cue.name === 'rise' ? cue.t : -1;
    // Caelum, kneeling, wings half open
    g.fillStyle = '#05040e';
    const wing = 0.6 + 0.2 * Math.sin(t * 0.03);
    g.beginPath(); g.moveTo(196, 86); g.quadraticCurveTo(160, 40 - wing * 20, 150, 110); g.lineTo(184, 98); g.fill();
    g.beginPath(); g.moveTo(206, 86); g.quadraticCurveTo(246, 40 - wing * 20, 256, 110); g.lineTo(218, 98); g.fill();
    R(g, 194, 84, 16, 30, '#100e22'); g.beginPath(); g.arc(202, 78, 6, 0, Math.PI * 2); g.fill();
    R(g, 196, 112, 22, 12, '#100e22');
    R(g, 201, 70, 2, 2, '#cfd6ff'); R(g, 204, 77, 2, 2, '#a58bff');
    R(g, 176, 96, 20, 3, '#100e22');                     // his arm, reaching over her
    if (rise < 0) {
      R(g, 130, 116, 46, 8, '#2f8f7a'); R(g, 124, 114, 8, 8, '#f6dcc6'); R(g, 120, 113, 6, 5, '#d8653a');
      // drops of starlight blood
      for (let i = 0; i < 3; i++) { const k = ((t + i * 25) % 75) / 75; g.globalAlpha = 1 - k * 0.4; R(g, 176, 99 + k * 15, 2, 3, i % 2 ? '#c8b8ff' : '#ffffff'); }
      g.globalAlpha = 1;
      glow(g, 128, 116, 18 + Math.sin(t * 0.08) * 3, 'rgba(185,168,255,0.35)');
    } else {
      const k = ease(rise / 60);
      if (rise < 12) { g.fillStyle = 'rgba(255,255,255,' + (1 - rise / 12) + ')'; g.fillRect(0, 0, W, H); }
      glow(g, 150, 100, 40 + 10 * Math.sin(t * 0.1), 'rgba(255,246,216,0.3)');
      figure(g, 150, 124, 10 + 14 * k, '#2f8f7a', '#d8653a');
      // the bond: a thread of gold light between them, pulsing
      g.strokeStyle = 'rgba(255,210,122,' + (0.4 + 0.4 * Math.sin(t * 0.12)) * k + ')'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(151, 112 - 14 * k); g.quadraticCurveTo(176, 80 + Math.sin(t * 0.05) * 6, 200, 92); g.stroke(); g.lineWidth = 1;
    }
  };

  // Static panels get a slow push-in and drifting particles, so no scene is a still picture.
  const DRIFT = { woods: 'snow', spring: 'petals', window: 'stars', rooftop: 'stars', city: 'stars', vision: 'threads', fire: 'embers', observatory: 'stars', spark: 'embers', library: 'embers', peak: 'snow', mountain: 'embers', caelum: 'stars', ships: 'embers' };
  C.drawStatic = function (g, id, t) {
    const img = SH.art.panel(id), z = 1 + Math.min(0.08, t / 6000);
    g.save(); g.translate(W / 2, H / 2); g.scale(z, z); g.translate(-W / 2, -H / 2);
    g.drawImage(img, 0, 0, W, H); g.restore();
    const kind = DRIFT[id];
    if (kind === 'snow') snow(g, t, 50, 0.1);
    else if (kind === 'petals') for (let i = 0; i < 24; i++) { const y = (rnd(i) * H + t * 0.3) % H, x = (rnd(i * 2) * W + Math.sin(t * 0.02 + i) * 10 + W) % W; R(g, x, y, 2, 2, i % 2 ? '#ff9ac0' : '#ffffff'); }
    else if (kind === 'embers') for (let i = 0; i < 20; i++) { const y = H - (rnd(i) * H + t * 0.4) % H, x = rnd(i * 2) * W + Math.sin(t * 0.03 + i) * 6; g.globalAlpha = y / H; R(g, x, y, 1, 2, '#ffb060'); g.globalAlpha = 1; }
    else if (kind === 'stars') for (let i = 0; i < 16; i++) { g.globalAlpha = Math.max(0, Math.sin(t * 0.03 + i * 1.7)); R(g, rnd(i) * W, rnd(i * 4) * 90, 1, 1, '#ffffff'); g.globalAlpha = 1; }
    else if (kind === 'threads') { g.strokeStyle = 'rgba(255,233,168,0.3)'; g.beginPath(); g.moveTo(0, 70 + Math.sin(t * 0.02) * 10); g.bezierCurveTo(100, 40, 220, 110 + Math.sin(t * 0.03) * 10, W, 60); g.stroke(); }
  };

  C.has = id => typeof C[id] === 'function' && !['has', 'drawStatic'].includes(id);
})(window.SH = window.SH || {});
