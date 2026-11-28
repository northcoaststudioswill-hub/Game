// Starhaven — placeholder art drawn in code: dialogue portraits, intro panels, and the people in the world.
// Real art replaces this once Will approves an art direction (BUILD-PLAN rule).
(function (SH) {
  const A = SH.art = {};
  const cache = {};
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  // ---------------------------------------------------------------- portraits (48 x 48 pixels, shown big)
  const LOOKS = {
    wren: { bg: ['#2c3d74', '#11163a'], skin: '#f6dcc6', shade: '#e2b89c', hair: '#d8653a', hairD: '#9e3f22', eye: '#3f9c7a', style: 'pony', ears: true, cloth: '#2f8f7a', clothD: '#1f6656', scarf: '#ffd27a' , freckles: true },
    wren_m: { bg: ['#3a4a6a', '#121a2a'], skin: '#f6dcc6', shade: '#e2b89c', hair: '#d8653a', hairD: '#9e3f22', eye: '#3f9c7a', style: 'pony', ears: false, cloth: '#2f8f7a', clothD: '#1f6656', scarf: '#c8a060' },
    caelum: { bg: ['#3a2a6a', '#120d2a'], skin: '#ecd5c8', shade: '#cfb0a4', hair: '#1a1530', hairD: '#0c0a1a', eye: '#a58bff', style: 'swept', ears: true, cloth: '#1c1838', clothD: '#0e0c20', trim: '#cfd6ff', circlet: true, wings: true },
    queen: { bg: ['#2a1f4a', '#07050f'], skin: '#e8e4f2', shade: '#c4bcd8', hair: '#0c0a16', hairD: '#05040a', eye: '#e8e0ff', style: 'long', ears: true, cloth: '#1a1630', clothD: '#0e0c1c', crown: true, lips: '#5a3a8a' },
    bram: { bg: ['#5a3a1c', '#1c1008'], skin: '#d9a77f', shade: '#b8865f', hair: '#3a2a20', hairD: '#2a1c14', eye: '#5a3a22', style: 'shaved', ears: true, cloth: '#a8743a', clothD: '#6e4a22', beard: '#8a4426', scar: true, broad: true },
    nessa: { bg: ['#4a4a5a', '#16161e'], skin: '#f0d4c0', shade: '#d4b49e', hair: '#2a1a14', hairD: '#140c08', eye: '#5a6a7a', style: 'braid', ears: false, cloth: '#5a5a6a', clothD: '#3a3a48' },
    lissa: { bg: ['#4a6a3a', '#141e10'], skin: '#f6dcc6', shade: '#dcbca8', hair: '#b8864a', hairD: '#8a5a2a', eye: '#6a9a5a', style: 'long', ears: false, cloth: '#4a7a4a', clothD: '#2f5a2f', flower: true },
    rowan: { bg: ['#c8904a', '#3a2410'], skin: '#f2d8b8', shade: '#d4b490', hair: '#e8c070', hairD: '#b8903a', eye: '#4ac06a', style: 'swept', ears: true, cloth: '#3a5a2a', clothD: '#24381a', trim: '#e8c070', antlers: true },
    mirelle: { bg: ['#6a4a34', '#1c120c'], skin: '#e8c8a8', shade: '#c8a484', hair: '#d8d4e0', hairD: '#a8a4b8', eye: '#3a2a1a', style: 'bun', ears: true, cloth: '#8a5a3a', clothD: '#6a4a34', trim: '#f4f0e0' },
    thane: { bg: ['#5a2a3a', '#1a0c12'], skin: '#8a5a3c', shade: '#6e4630', hair: '#2a2a2a', hairD: '#9a9a9a', eye: '#3a2a1a', style: 'shaved', ears: true, cloth: '#6a2a3a', clothD: '#4a1a26', trim: '#e8c070', glasses: true },
    iris: { bg: ['#2a5a7a', '#0c1a2a'], skin: '#f2d9c8', shade: '#dcbca8', hair: '#f4f0ff', hairD: '#c8c0e8', eye: '#8fd8ff', style: 'bun', ears: true, cloth: '#4f88c0', clothD: '#2f5a88', thread: true },
  };

  // variant: undefined (resting), 'talk' (mouth open) or 'blink'
  A.portrait = function (who, variant) {
    const key = 'p_' + who + (variant || '');
    if (cache[key]) return cache[key];
    const L = LOOKS[who], c = canvas(48, 48), g = c.getContext('2d');
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    // backdrop
    const gr = g.createRadialGradient(24, 20, 2, 24, 24, 34); gr.addColorStop(0, L.bg[0]); gr.addColorStop(1, L.bg[1]);
    g.fillStyle = gr; g.fillRect(0, 0, 48, 48);
    {   // behind each face, something of where they belong
      const h = i => { const x = Math.sin(i * 127.1 + who.length * 31.7) * 43758.5453; return x - Math.floor(x); };
      const k = who.replace('_m', '');
      if (k === 'caelum') { for (let i = 0; i < 16; i++) R(h(i) * 48, h(i + 40) * 30, 1, 1, i % 4 ? '#cfd6ff' : '#fff6d8'); g.fillStyle = 'rgba(255,246,216,0.5)'; g.beginPath(); g.arc(38, 9, 4, 0, 6.3); g.fill(); g.fillStyle = L.bg[0]; g.beginPath(); g.arc(40, 8, 3.6, 0, 6.3); g.fill(); }
      else if (k === 'wren') { if (who === 'wren_m') { g.fillStyle = 'rgba(255,255,255,0.14)'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(4 + i * 13, 48); g.lineTo(10 + i * 13, 14 + h(i) * 10); g.lineTo(16 + i * 13, 48); g.fill(); } for (let i = 0; i < 10; i++) R(h(i) * 48, h(i + 9) * 40, 1, 1, '#ffffff'); } else for (let i = 0; i < 12; i++) R(h(i) * 48, h(i + 20) * 34, 1, 1, i % 2 ? '#ffd27a' : '#fff6d8'); }
      else if (k === 'bram') { const fg = g.createRadialGradient(24, 50, 2, 24, 50, 34); fg.addColorStop(0, 'rgba(255,150,70,0.6)'); fg.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = fg; g.fillRect(0, 0, 48, 48); for (let i = 0; i < 4; i++) { R(4 + i * 3, 4, 1, 16, 'rgba(200,210,226,0.5)'); } }
      else if (k === 'iris') { g.strokeStyle = 'rgba(255,233,168,0.5)'; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(0, 8 + i * 9); g.bezierCurveTo(16, 2 + i * 12, 30, 20 + i * 4, 48, 6 + i * 10); g.stroke(); } for (let i = 0; i < 8; i++) R(h(i) * 48, h(i + 3) * 26, 1, 1, '#fff6d8'); }
      else if (k === 'thane' || k === 'mirelle') { for (let y = 2; y < 34; y += 9) for (let x = 0; x < 48; x += 3) { const bh = 5 + h(x + y) * 3; g.globalAlpha = 0.45; R(x, y + 8 - bh, 2, bh, ['#7a2a3a', '#2c3d74', '#8a6a2a', '#3a5a2a'][(x + y) % 4]); } g.globalAlpha = 1; }
      else if (k === 'nessa' || k === 'lissa') { for (let x = 0; x < 48; x += 7) { g.globalAlpha = 0.25; R(x, 0, 6, 48, '#4a3020'); g.globalAlpha = 1; } if (k === 'lissa') { R(38, 6, 1, 8, '#4a7a4a'); R(36, 5, 3, 2, '#8fd16b'); R(39, 8, 3, 2, '#8fd16b'); } }
      else if (k === 'rowan') { for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? 'rgba(255,154,192,0.7)' : 'rgba(255,255,255,0.7)'; g.fillRect(h(i) * 48, h(i + 7) * 36, 2, 2); } }
      else if (k === 'queen') { g.strokeStyle = 'rgba(255,74,90,0.5)'; g.lineWidth = 2; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(i * 14, 48); g.quadraticCurveTo(i * 14 + 10, 20, i * 14 - 4, 0); g.stroke(); } g.lineWidth = 1; }
    }
    if (L.wings) { R(4, 34, 10, 14, '#0e0b22'); R(34, 34, 10, 14, '#0e0b22'); for (const [sx2, sy2] of [[6, 38], [10, 43], [37, 40], [41, 36], [8, 46], [39, 45]]) R(sx2, sy2, 1, 1, '#c8b8ff'); }   // his mantle of dusk, with stars in it
    if (L.thread) { g.strokeStyle = '#ffe9a8'; g.globalAlpha = 0.8; g.beginPath(); g.moveTo(0, 40); g.bezierCurveTo(14, 24, 30, 46, 48, 30); g.stroke(); g.globalAlpha = 1; }
    // long hair behind
    if (L.style === 'long') { R(11, 10, 26, 34, L.hair); }
    if (L.style === 'pony') { R(32, 14, 6, 16, L.hair); R(34, 28, 5, 8, L.hairD); }
    // shoulders
    const sw = L.broad ? 40 : 32, sx = 24 - sw / 2;
    R(sx, 38, sw, 10, L.cloth); R(sx, 38, 4, 10, L.clothD);
    if (L.trim) { R(18, 37, 12, 2, L.trim); R(22, 39, 4, 9, L.trim); }
    if (L.scarf) { R(15, 35, 18, 4, L.scarf); R(15, 38, 4, 7, L.scarf); }
    // neck + face
    R(20, 32, 8, 7, L.shade);
    R(15, 12, 18, 22, L.skin);
    R(15, 30, 18, 4, L.shade);
    if (L.ears) { R(13, 19, 2, 5, L.skin); R(33, 19, 2, 5, L.skin); }   // plain ears: the Lit are born from stars, not pointed
    if (L.freckles) { g.globalAlpha = 0.85; for (const [fx2, fy2] of [[17, 25], [19, 26], [18, 27], [29, 26], [31, 25], [30, 27], [22, 24], [26, 24]]) R(fx2, fy2, 1, 1, '#ffe9a8'); g.globalAlpha = 0.25; R(16, 24, 5, 4, '#ffe9a8'); R(28, 24, 5, 4, '#ffe9a8'); g.globalAlpha = 1; }   // her freckles glow: she is Lit
    // hair on top
    if (L.style === 'pony') { R(14, 9, 20, 6, L.hair); R(14, 12, 3, 9, L.hair); R(30, 11, 4, 6, L.hairD); }
    if (L.style === 'swept') { R(14, 8, 20, 6, L.hair); R(14, 12, 4, 10, L.hair); R(26, 12, 7, 3, L.hair); R(30, 12, 4, 8, L.hairD); }
    if (L.style === 'long') { R(14, 8, 20, 6, L.hair); R(14, 12, 3, 22, L.hair); R(31, 12, 3, 22, L.hair); }
    if (L.style === 'shaved') { R(15, 10, 18, 3, L.hair); }
    if (L.style === 'braid') { R(14, 9, 20, 5, L.hair); R(14, 12, 3, 9, L.hair); R(31, 12, 3, 9, L.hair); R(33, 18, 4, 4, L.hairD); R(34, 22, 4, 4, L.hair); R(35, 26, 4, 4, L.hairD); R(35, 30, 4, 4, L.hair); }
    if (L.flower) { R(30, 10, 4, 4, '#ff9ac0'); R(31, 11, 2, 2, '#ffe9a8'); }
    if (L.antlers) { R(14, 12, 20, 1, '#e8c070'); for (let i = 0; i < 9; i++) { const hh = 3 + (4 - Math.abs(i - 4)) * 1.5; R(15 + i * 2, 12 - hh, 1, hh, i % 2 ? '#ffd27a' : '#fff6d8'); } g.globalAlpha = 0.3; R(13, 2, 22, 10, '#ffe9a8'); g.globalAlpha = 1; }   // a crown of morning light
    if (L.glasses) { g.strokeStyle = '#e8c070'; g.strokeRect(17.5, 19.5, 6, 5); g.strokeRect(25.5, 19.5, 6, 5); g.beginPath(); g.moveTo(23.5, 21.5); g.lineTo(25.5, 21.5); g.stroke(); R(15, 10, 18, 2, L.hairD); }
    if (L.style === 'bun') { R(14, 9, 20, 5, L.hair); R(19, 3, 10, 7, L.hair); R(14, 12, 3, 7, L.hair); R(31, 12, 3, 7, L.hair); R(21, 4, 6, 1, L.hairD); }
    // eyes, brows, mouth
    R(18, 20, 4, 3, '#ffffff'); R(26, 20, 4, 3, '#ffffff');
    R(19, 20, 2, 3, L.eye); R(27, 20, 2, 3, L.eye);
    R(18, 18, 4, 1, L.hairD); R(26, 18, 4, 1, L.hairD);
    R(23, 23, 2, 4, L.shade);
    R(21, 28, 6, 1, L.lips || '#a5605a');
    if (variant === 'talk') { R(22, 28, 4, 3, '#3a1418'); R(22, 28, 4, 1, '#f4f0ff'); }
    if (variant === 'blink') { R(18, 20, 4, 3, L.skin); R(26, 20, 4, 3, L.skin); R(18, 22, 4, 1, L.shade); R(26, 22, 4, 1, L.shade); }
    if (L.beard) { R(15, 25, 18, 11, L.beard); R(17, 36, 14, 3, L.beard); R(21, 28, 6, 1, '#4a1a10'); R(18, 24, 12, 2, L.beard); }
    if (L.scar) { R(27, 16, 1, 9, '#a85a4a'); }
    if (L.circlet) { R(15, 13, 18, 1, '#cfd6ff'); R(23, 11, 2, 3, '#ffffff'); R(22, 12, 4, 1, '#ffffff'); }
    if (L.crown) {
      for (let i = 0; i < 6; i++) { R(14 + i * 4, 3 + (i % 2) * 2, 2, 8 - (i % 2) * 2, '#1a1626'); R(14 + i * 4, 3 + (i % 2) * 2, 1, 2, '#e0d4ff'); }   // black glass
      R(14, 10, 20, 2, '#2a2444');
    }
    // finer features: a lid line and a catch-light in each eye, a blush, a two-tone mouth, a softer jaw,
    // a shadow under the chin, and a highlight running through the hair
    if (variant !== 'blink') { R(18, 19, 4, 1, L.hairD); R(26, 19, 4, 1, L.hairD); R(20, 20, 1, 1, '#ffffff'); R(28, 20, 1, 1, '#ffffff'); R(19, 22, 2, 1, SH.shade ? SH.shade(L.eye, 0.6) : L.eye); R(27, 22, 2, 1, SH.shade ? SH.shade(L.eye, 0.6) : L.eye); }
    if (!L.beard) { g.globalAlpha = 0.22; R(16, 24, 4, 3, '#ff7a8a'); R(28, 24, 4, 3, '#ff7a8a'); g.globalAlpha = 1; R(22, 29, 4, 1, L.shade); R(15, 32, 2, 2, L.shade); R(31, 32, 2, 2, L.shade); R(15, 33, 1, 1, L.cloth); R(32, 33, 1, 1, L.cloth); }
    R(20, 34, 8, 2, L.shade); g.globalAlpha = 0.35; R(20, 36, 8, 2, '#000000'); g.globalAlpha = 1;
    g.globalAlpha = 0.5; R(18, 9, 9, 1, '#ffffff'); R(17, 10, 4, 1, '#ffffff'); g.globalAlpha = 0.25; R(24, 15, 1, 8, '#ffffff'); g.globalAlpha = 1;
    R(sx, 38, sw, 1, L.clothD); g.globalAlpha = 0.3; R(sx + sw - 5, 39, 5, 9, '#ffffff'); g.globalAlpha = 1;
    // light the whole bust: warm from the upper left, cool shadow lower right, and darken the corners
    g.globalCompositeOperation = 'source-atop';
    const pl = g.createLinearGradient(8, 6, 40, 46); pl.addColorStop(0, 'rgba(255,240,205,0.16)'); pl.addColorStop(0.5, 'rgba(255,240,205,0)'); pl.addColorStop(1, 'rgba(24,16,70,0.26)'); g.fillStyle = pl; g.fillRect(0, 0, 48, 48);
    const pv = g.createRadialGradient(24, 22, 14, 24, 24, 36); pv.addColorStop(0, 'rgba(0,0,0,0)'); pv.addColorStop(1, 'rgba(6,4,18,0.5)'); g.fillStyle = pv; g.fillRect(0, 0, 48, 48);
    g.globalCompositeOperation = 'source-over';
    // rim light on the side away from the viewer
    g.globalAlpha = 0.35; R(32, 13, 1, 20, '#ffffff'); g.globalAlpha = 1;
    return (cache[key] = c);
  };
  A.portraitURL = function (who, variant) {
    const key = 'u_' + who + (variant || '');
    if (cache[key]) return cache[key];
    return (cache[key] = A.portrait(who, variant).toDataURL());
  };

  // ---------------------------------------------------------------- intro panels (320 x 150)
  A.panel = function (id) {
    if (cache['panel_' + id]) return cache['panel_' + id];
    const W = 320, H = 150, c = canvas(W, H), g = c.getContext('2d');
    const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    const sky = (a, b) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
    const stars = (n, seed) => { let s = seed; for (let i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; const x = s % W; s = (s * 9301 + 49297) % 233280; R(x, s % 90, 1, 1, '#e8ecff'); } };
    const tri = (x1, y1, x2, y2, x3, y3, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineTo(x3, y3); g.fill(); };
    const person = (x, y, h, col, extra) => { R(x - 3, y - h, 6, h - 6, col); R(x - 2, y - h - 6, 5, 6, col); R(x - 3, y - 6, 2, 6, col); R(x + 1, y - 6, 2, 6, col); if (extra) extra(x, y); };

    if (id === 'woods') {
      sky('#1a2348', '#5a6a98'); stars(40, 3);
      g.fillStyle = '#0f1530';
      for (let i = 0; i < 14; i++) { const x = i * 25 + (i % 3) * 6, h = 60 + (i % 4) * 14; tri(x, 120 - h, x - 14, 122, x + 14, 122, '#121a3a'); }
      R(0, 118, W, 32, '#dfe8ff'); R(0, 118, W, 2, '#ffffff');
      person(140, 120, 26, '#2a2238', (x) => { g.strokeStyle = '#6a4a2a'; g.beginPath(); g.arc(x + 6, 102, 9, -1.3, 1.3); g.stroke(); });
      person(160, 120, 22, '#3a2a4a'); person(174, 120, 18, '#4a3a5a');
      R(138, 92, 6, 3, '#d8653a');
    } else if (id === 'mountain') {
      sky('#120610', '#3a0f1e');
      tri(160, 10, 20, 150, 300, 150, '#0a0306'); tri(160, 10, 120, 70, 200, 70, '#1a0810');
      R(150, 110, 20, 40, '#ff4a5a'); R(152, 112, 16, 38, '#ff9aa8');
      for (let i = 0; i < 7; i++) { R(128 + i * 9, 26 - (i % 2) * 5, 3, 12 + (i % 2) * 5, '#5a1a2a'); R(128 + i * 9, 26 - (i % 2) * 5, 3, 2, '#ff4a5a'); }
      R(128, 36, 64, 3, '#5a1a2a');
      person(160, 150, 22, '#0a0306');
    } else if (id === 'sparks') {
      sky('#0a0c20', '#1a1440'); stars(60, 7);
      R(110, 118, 100, 6, '#2a2a4a'); R(130, 112, 60, 6, '#3a3a5a');
      const cols = ['#ff8a3a', '#9fd8ff', '#8a6aff', '#ffe08a', '#4ad8c8', '#7ad86a', '#f0f4ff'];
      cols.forEach((col, i) => {
        const a = Math.PI + (i + 0.5) / 7 * Math.PI, x = 160 + Math.cos(a) * 90, y = 112 + Math.sin(a) * 80;
        const gr = g.createRadialGradient(x, y, 1, x, y, 14); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.fillRect(x - 14, y - 14, 28, 28); R(x - 2, y - 2, 4, 4, '#ffffff');
        g.strokeStyle = col; g.globalAlpha = 0.35; g.beginPath(); g.moveTo(x, y); g.lineTo(160, 108); g.stroke(); g.globalAlpha = 1;
      });
      R(140, 106, 40, 6, '#f6dcc6'); R(176, 104, 8, 8, '#d8653a');
    } else if (id === 'caelum') {
      sky('#0c0a24', '#3a2a6a'); stars(90, 11);
      const gr = g.createRadialGradient(240, 120, 4, 240, 120, 80); gr.addColorStop(0, 'rgba(255,210,122,0.6)'); gr.addColorStop(1, 'rgba(255,210,122,0)');
      g.fillStyle = gr; g.fillRect(140, 30, 200, 120);
      for (let i = 0; i < 9; i++) { const x = 200 + i * 10, h = 20 + (i % 3) * 14; R(x, 140 - h, 7, h + 10, '#1a1640'); R(x + 2, 140 - h + 4, 2, 2, '#ffd27a'); }
      g.fillStyle = '#05040e';
      g.beginPath(); g.moveTo(110, 70); g.quadraticCurveTo(40, 30, 20, 90); g.lineTo(60, 80); g.lineTo(50, 110); g.lineTo(100, 96); g.fill();
      g.beginPath(); g.moveTo(130, 70); g.quadraticCurveTo(200, 30, 220, 90); g.lineTo(180, 80); g.lineTo(190, 110); g.lineTo(140, 96); g.fill();
      g.beginPath(); g.arc(120, 52, 8, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(108, 64); g.lineTo(132, 64); g.lineTo(140, 150); g.lineTo(100, 150); g.closePath(); g.fill();
      R(116, 58, 8, 8, '#05040e');
      R(119, 40, 2, 5, '#ffffff'); R(116, 42, 8, 1, '#ffffff');
    } else if (id === 'ships') {
      sky('#1a0c0a', '#4a1c14');
      R(0, 100, W, 50, '#140a12'); for (let x = 0; x < W; x += 12) R(x, 100 + (x % 24 === 0 ? 0 : 2), 8, 1, '#5a2a22');
      for (let i = 0; i < 5; i++) {
        const x = 30 + i * 62, y = 102 - (i % 2) * 6, s = 1 - (i % 2) * 0.25;
        R(x, y - 6 * s, 40 * s, 8 * s, '#2a2a30'); R(x + 18 * s, y - 40 * s, 2, 34 * s, '#2a2a30');
        tri(x + 20 * s, y - 38 * s, x + 20 * s, y - 12 * s, x + 38 * s, y - 14 * s, '#8a1a14');
      }
      for (let i = 0; i < 5; i++) R(132 + i * 12, 14 + (i % 2 ? 4 : 0), 6, 14 - (i % 2 ? 4 : 0), '#6a6a74');
      R(130, 26, 62, 6, '#6a6a74');
    } else if (id === 'library') {
      // the Library: tall shelves, a reading table, candlelight, Wren's palm aglow
      sky('#1a1020', '#2a1a28');
      for (let x = 0; x < W; x += 40) { R(x + 2, 10, 34, 110, '#3a2418'); for (let y = 16; y < 116; y += 14) for (let b = 0; b < 6; b++) R(x + 5 + b * 5, y, 4, 11, ['#6a2a3a', '#2a4a6a', '#5a6a2a', '#8a6a2a'][(b + y) % 4]); }
      R(0, 118, W, 32, '#2a1a14'); R(90, 100, 140, 8, '#5a3a24'); R(100, 108, 6, 14, '#3a2418'); R(214, 108, 6, 14, '#3a2418');
      for (let i = 0; i < 3; i++) { const cx = 110 + i * 50; const gr = g.createRadialGradient(cx, 92, 1, cx, 92, 30); gr.addColorStop(0, 'rgba(255,200,120,0.5)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(cx - 30, 62, 60, 60); R(cx - 1, 90, 3, 10, '#f4f0e0'); R(cx - 1, 86, 3, 4, '#ffd27a'); }
      person(130, 120, 22, '#2f8f7a'); R(127, 96, 6, 4, '#d8653a');
      const gr2 = g.createRadialGradient(138, 104, 1, 138, 104, 14); gr2.addColorStop(0, 'rgba(255,160,70,0.9)'); gr2.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = gr2; g.fillRect(124, 90, 28, 28);
      person(190, 120, 24, '#6a2a3a'); R(187, 94, 6, 3, '#9a9a9a');
    } else if (id === 'peak') {
      // the peak at dawn: snow, Starhaven far below, Rowan with spring flowers in the snow
      sky('#3a3a6a', '#f0b8a0');
      g.fillStyle = '#e8eef8'; g.beginPath(); g.moveTo(0, 150); g.lineTo(0, 110); g.lineTo(90, 96); g.lineTo(200, 104); g.lineTo(320, 92); g.lineTo(320, 150); g.fill();
      for (let i = 0; i < 9; i++) { R(250 + i * 6, 120 + (i % 3) * 3, 2, 2, '#ffd27a'); }
      person(110, 104, 24, '#2f8f7a'); R(107, 78, 6, 4, '#d8653a');
      person(90, 102, 28, '#1c1838');
      person(190, 106, 30, '#3a5a2a'); R(187, 72, 6, 3, '#e8c070');
      for (let i = 0; i < 14; i++) R(170 + (i * 7) % 50, 104 + (i * 3) % 8, 3, 3, i % 2 ? '#ff9ac0' : '#9ad08a');
    } else if (id === 'spring') {
      // a gilded bedroom at the Spring Court: too many flowers, a window Wren can't leave through
      sky('#f4d6dc', '#d8a8b8');
      R(0, 110, W, 40, '#b88a98'); R(0, 108, W, 3, '#f0c8d0');
      R(210, 18, 70, 80, '#7ab0c8'); R(210, 18, 70, 4, '#e8c070'); R(243, 18, 4, 80, '#e8c070'); R(210, 56, 70, 3, '#e8c070');
      for (let i = 0; i < 9; i++) R(212 + i * 7, 24 + (i % 3) * 3, 2, 70, 'rgba(255,255,255,0.15)');
      R(40, 80, 120, 34, '#f8eef0'); R(40, 76, 120, 6, '#e8c070'); R(34, 60, 8, 54, '#c89a50'); R(158, 60, 8, 54, '#c89a50');
      R(60, 82, 60, 14, '#f6dcc6'); R(112, 80, 14, 10, '#d8653a');
      for (let i = 0; i < 26; i++) { const x = (i * 53) % W, y = 10 + (i * 37) % 90; R(x, y, 5, 5, i % 2 ? '#ff8fb0' : '#ffd0e0'); R(x + 1, y + 1, 2, 2, '#ffe9a8'); }
      R(178, 92, 22, 18, '#c89a50'); R(182, 86, 14, 7, '#fff6e0');
    } else if (id === 'window') {
      // midnight: the window open, Caelum's silhouette in it, wings and stars behind
      sky('#0a0820', '#2a1a48'); stars(70, 13);
      R(0, 0, 90, H, '#140e24'); R(230, 0, 90, H, '#140e24'); R(0, 0, W, 16, '#140e24'); R(0, 130, W, 20, '#140e24');
      R(88, 14, 4, 118, '#c89a50'); R(228, 14, 4, 118, '#c89a50'); R(88, 128, 144, 4, '#c89a50');
      g.fillStyle = '#05040e';
      g.beginPath(); g.moveTo(150, 60); g.quadraticCurveTo(100, 30, 96, 96); g.lineTo(130, 80); g.fill();
      g.beginPath(); g.moveTo(170, 60); g.quadraticCurveTo(220, 30, 224, 96); g.lineTo(190, 80); g.fill();
      g.beginPath(); g.arc(160, 52, 7, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(150, 60); g.lineTo(170, 60); g.lineTo(176, 128); g.lineTo(144, 128); g.fill();
      R(159, 40, 2, 4, '#ffffff'); R(157, 41, 6, 1, '#ffffff'); R(162, 50, 2, 2, '#a58bff');
      for (let i = 0; i < 6; i++) R(20 + i * 10, 120 - (i % 2) * 6, 4, 4, '#ff8fb0');
    } else if (id === 'rooftop') {
      // two figures on a rooftop over Starhaven at night
      sky('#070a22', '#2a2a60'); stars(110, 17);
      const gr = g.createRadialGradient(250, 34, 2, 250, 34, 30); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(0.3, 'rgba(255,246,216,0.4)'); gr.addColorStop(1, 'rgba(255,246,216,0)');
      g.fillStyle = gr; g.fillRect(210, 0, 80, 70);
      for (let i = 0; i < 26; i++) { const x = i * 13, h = 20 + ((i * 7) % 5) * 9; R(x, 118 - h, 11, h, '#16163e'); for (let k = 0; k < 3; k++) if ((i + k) % 3 === 0) R(x + 4, 122 - h + k * 7, 2, 2, '#ffd27a'); }
      R(0, 116, W, 34, '#0c0a1e'); R(0, 116, W, 2, '#d6ccff'); for (let x = 0; x < W; x += 10) R(x, 106, 2, 10, '#2a2650'); R(0, 105, W, 2, '#2a2650');
      g.fillStyle = '#05040e';
      R(128, 84, 10, 32, '#05040e'); g.beginPath(); g.arc(133, 78, 6, 0, Math.PI * 2); g.fill(); R(126, 74, 6, 12, '#d8653a');
      R(150, 80, 12, 36, '#05040e'); g.beginPath(); g.arc(156, 74, 6, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(152, 82); g.quadraticCurveTo(180, 70, 186, 104); g.lineTo(164, 96); g.fill();
      R(108, 108, 3, 8, '#5a3a5a'); R(107, 104, 5, 4, '#ffd27a');
    } else if (id === 'city') {
      // Starhaven at night from above: one bright street in a dark city
      sky('#070a22', '#1e2050'); stars(80, 23);
      for (let i = 0; i < 40; i++) { const x = (i * 29) % W, h = 30 + ((i * 11) % 6) * 12; R(x, 150 - h, 14, h, '#141438'); }
      R(0, 108, W, 6, '#3a2a40'); for (let x = 6; x < W; x += 18) { R(x, 100, 3, 3, '#ffd98a'); R(x - 4, 96, 11, 11, 'rgba(255,214,130,0.15)'); }
      R(150, 52, 3, 20, '#ffd27a'); R(140, 60, 23, 2, '#ffd27a');
    } else if (id === 'vision') {
      // threads of fate over the sea, an iron crown pulling two of them
      sky('#0a0a24', '#1a1a3a'); stars(40, 29);
      R(0, 110, W, 40, '#0c1424');
      const cols = ['#ffe9a8', '#9fe0ff', '#ff8fb8', '#b9a8ff', '#9be07a'];
      for (let i = 0; i < 9; i++) { g.strokeStyle = cols[i % cols.length]; g.globalAlpha = 0.55; g.beginPath(); g.moveTo(0, 30 + i * 10); g.bezierCurveTo(100, 10 + i * 14, 200, 90 - i * 6, W, 40 + i * 9); g.stroke(); }
      g.globalAlpha = 1;
      for (let i = 0; i < 5; i++) R(236 + i * 10, 38 + (i % 2 ? 4 : 0), 6, 16 - (i % 2 ? 4 : 0), '#7a7a88'); R(234, 52, 52, 6, '#7a7a88');
      g.strokeStyle = '#c0c0d0'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(260, 60); g.quadraticCurveTo(200, 90, 90, 96); g.stroke();
      g.beginPath(); g.moveTo(260, 60); g.quadraticCurveTo(210, 104, 110, 112); g.stroke();
      g.lineWidth = 1;
      person(90, 118, 18, '#e8d0ff'); person(110, 126, 14, '#ffd0e0');
    } else if (id === 'fire') {
      // the Training Ring after dark: a fire pit and two figures
      sky('#0a0818', '#2a1a28');
      R(0, 112, W, 38, '#2a2018'); R(0, 112, W, 2, '#6a4a30');
      for (let x = 20; x < W; x += 40) { R(x, 70, 4, 42, '#3a2a1e'); R(x - 2, 68, 8, 3, '#5a4430'); }
      const gr = g.createRadialGradient(160, 104, 2, 160, 104, 90); gr.addColorStop(0, 'rgba(255,170,80,0.6)'); gr.addColorStop(1, 'rgba(255,170,80,0)');
      g.fillStyle = gr; g.fillRect(60, 20, 200, 130);
      R(146, 108, 28, 6, '#4a3020');
      tri(150, 108, 160, 76, 170, 108, '#ff8a3a'); tri(154, 108, 160, 88, 166, 108, '#ffe08a');
      person(120, 116, 24, '#1a1010'); R(108, 92, 24, 18, '#1a1010');
      person(196, 116, 20, '#1a1010'); R(193, 92, 6, 4, '#d8653a');
    } else if (id === 'observatory') {
      // Iris's tower: round window, maps, candles, hanging threads of starlight
      sky('#0c1428', '#1a2440');
      g.fillStyle = '#0a1020'; g.beginPath(); g.arc(160, 60, 52, 0, Math.PI * 2); g.fill();
      g.save(); g.beginPath(); g.arc(160, 60, 48, 0, Math.PI * 2); g.clip(); stars(60, 31); g.restore();
      R(0, 114, W, 36, '#2a2238'); R(0, 114, W, 2, '#6a5a80');
      R(30, 90, 70, 24, '#5a4430'); R(34, 86, 40, 6, '#e8d8b0'); R(220, 90, 70, 24, '#5a4430'); R(226, 84, 50, 8, '#e8d8b0');
      for (let i = 0; i < 4; i++) { R(40 + i * 80, 78, 3, 10, '#f4f0e0'); R(40 + i * 80, 74, 3, 4, '#ffd27a'); }
      g.strokeStyle = '#ffe9a8'; g.globalAlpha = 0.6;
      for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(20 + i * 45, 0); g.quadraticCurveTo(30 + i * 45, 40, 18 + i * 45, 70 + (i % 3) * 8); g.stroke(); }
      g.globalAlpha = 1;
      person(150, 116, 18, '#4f88c0'); R(147, 92, 6, 4, '#f4f0ff');
      person(176, 116, 22, '#2a2238'); R(173, 92, 6, 4, '#d8653a');
    } else if (id === 'spark') {
      // Wren's open palm with a small flame waking in it
      sky('#0a0610', '#2a0e10');
      const gr = g.createRadialGradient(160, 70, 2, 160, 70, 80); gr.addColorStop(0, 'rgba(255,170,80,0.7)'); gr.addColorStop(1, 'rgba(255,120,60,0)');
      g.fillStyle = gr; g.fillRect(60, 0, 200, 150);
      g.fillStyle = '#f6dcc6';
      g.beginPath(); g.ellipse(160, 108, 34, 18, 0, 0, Math.PI * 2); g.fill();
      for (let i = 0; i < 4; i++) R(132 + i * 15, 76 + Math.abs(i - 1.5) * 4, 9, 30, '#f6dcc6');
      R(186, 96, 18, 9, '#f6dcc6'); R(130, 120, 60, 30, '#2f8f7a');
      tri(150, 92, 160, 50, 170, 92, '#ff8a3a'); tri(154, 92, 160, 64, 166, 92, '#ffe08a'); R(158, 82, 4, 8, '#ffffff');
    }
    return (cache['panel_' + id] = c);
  };

  // ---------------------------------------------------------------- people in the world (feet at x, y)
  A.npc = function (ctx, n, t) {
    if (n.hidden) return;
    const x = Math.round(n.x), y = Math.round(n.y), f = n.facing || 1;
    const R = (dx, dy, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x + (f > 0 ? dx : -dx - w), y + dy, w, h); };
    const breathe = Math.round(Math.sin(t * 0.05 + x) * 0.8);
    // a soft glow so people read against the dark
    const gl = ctx.createRadialGradient(x, y - 24, 4, x, y - 24, 36);
    gl.addColorStop(0, n.glow || 'rgba(200,190,255,0.14)'); gl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gl; ctx.fillRect(x - 36, y - 60, 72, 72);
    if (n.id === 'caelum') {
      // folded wings
      R(-12, -50 + breathe, 7, 40, '#0a0818'); R(-10, -54 + breathe, 5, 6, '#0a0818'); R(-12, -48 + breathe, 1, 36, '#6a5aa8');
      R(-4, -16, 4, 16, '#100e22'); R(1, -16, 4, 16, '#100e22');
      R(-7, -38 + breathe, 14, 26, '#1c1838'); R(-7, -14, 15, 3, '#1c1838');
      R(-1, -38 + breathe, 2, 26, '#cfd6ff');
      R(-5, -49 + breathe, 10, 11, '#ecd5c8'); R(-6, -51 + breathe, 12, 5, '#1a1530'); R(-6, -48 + breathe, 3, 7, '#1a1530');
      R(2, -45 + breathe, 2, 2, '#a58bff'); R(-5, -47 + breathe, 10, 1, '#cfd6ff');
      R(-7, -46 + breathe, 2, 3, '#ecd5c8'); R(-8, -48 + breathe, 1, 2, '#ecd5c8');
    } else if (n.id === 'bram') {
      R(-6, -16, 5, 16, '#3a2a20'); R(2, -16, 5, 16, '#3a2a20');
      R(-10, -36 + breathe, 20, 22, '#a8743a'); R(-10, -36 + breathe, 20, 3, '#d9a060'); R(-11, -20, 22, 4, '#5a3a1c');
      R(-14, -34 + breathe, 5, 14, '#d9a77f'); R(10, -34 + breathe, 5, 14, '#d9a77f');
      R(-5, -48 + breathe, 11, 12, '#d9a77f'); R(-5, -49 + breathe, 11, 2, '#3a2a20');
      R(-5, -41 + breathe, 11, 7, '#8a4426'); R(2, -45 + breathe, 2, 2, '#2a1a10');
    } else if (n.id === 'nessa' || n.id === 'lissa') {
      const ness = n.id === 'nessa';
      R(-6, -30 + breathe, 12, 30, ness ? '#5a5a6a' : '#4a7a4a'); R(-6, -30 + breathe, 3, 30, ness ? '#3a3a48' : '#2f5a2f');
      R(-4, -40 + breathe, 9, 10, '#f0d4c0');
      R(-5, -42 + breathe, 11, 4, ness ? '#2a1a14' : '#b8864a'); R(-6, -40 + breathe, 3, ness ? 12 : 14, ness ? '#2a1a14' : '#b8864a');
      R(2, -36 + breathe, 2, 2, '#2a1a14');
      if (ness) { R(-12, -22, 3, 20, '#6a4a2a'); R(-14, -24, 7, 4, '#9aa0b0'); } // her axe
      else { R(4, -18, 8, 6, '#a8743a'); R(5, -20, 2, 2, '#ff9ac0'); R(9, -20, 2, 2, '#ffe9a8'); } // a basket
    } else if (n.id === 'thane') {
      R(-7, -32 + breathe, 14, 32, '#6a2a3a'); R(-7, -32 + breathe, 3, 32, '#4a1a26'); R(-1, -32 + breathe, 2, 32, '#e8c070');
      R(-4, -42 + breathe, 9, 10, '#8a5a3c'); R(-5, -44 + breathe, 11, 3, '#2a2a2a'); R(-5, -44 + breathe, 4, 2, '#9a9a9a');
      R(1, -38 + breathe, 4, 2, '#e8c070');
      R(5, -24, 8, 10, '#3a2a5a'); R(6, -23, 6, 1, '#e8c070');   // a book under his arm
    } else if (n.id === 'iris') {
      R(-7, -30 + breathe, 14, 30, '#4f88c0'); R(-7, -30 + breathe, 3, 30, '#2f5a88');
      R(-4, -40 + breathe, 9, 10, '#f2d9c8'); R(-5, -42 + breathe, 11, 4, '#f4f0ff'); R(-3, -47 + breathe, 6, 5, '#f4f0ff');
      R(2, -36 + breathe, 2, 2, '#8fd8ff');
      ctx.strokeStyle = '#ffe9a8'; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(x + f * 6, y - 20);
      ctx.bezierCurveTo(x + f * 16, y - 34 + Math.sin(t * 0.05) * 4, x + f * 22, y - 10, x + f * 30, y - 26); ctx.stroke(); ctx.globalAlpha = 1;
    }
    // name tag, and a speech bubble when they have something to say
    if (n.near || n.bubble) {
      ctx.font = 'bold 10px system-ui, sans-serif'; ctx.textAlign = 'center';
      const name = SH.STORY.CAST[n.id].name;
      ctx.fillStyle = 'rgba(8,8,24,0.75)'; const tw = ctx.measureText(name).width + 8;
      ctx.fillRect(x - tw / 2, y - 72, tw, 13);
      ctx.fillStyle = SH.STORY.CAST[n.id].color; ctx.fillText(name, x, y - 62);
    }
    if (n.bubble) {
      const by = y - 86 + Math.round(Math.sin(t * 0.1) * 2);
      ctx.fillStyle = '#fff6d8'; ctx.fillRect(x - 9, by, 18, 11); ctx.fillRect(x - 3, by + 11, 4, 3);
      ctx.fillStyle = '#1c1430'; for (let i = 0; i < 3; i++) ctx.fillRect(x - 6 + i * 5, by + 5, 2, 2);
    }
  };
})(window.SH = window.SH || {});
