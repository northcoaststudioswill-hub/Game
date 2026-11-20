// ============================================================
// prelude — the animated intro (plan 0a). Eleven drawn stills that move, counted ONE to ELEVEN, no words.
// Three promises: a man underground, a woman, gold. Each picture below is answered by one above:
//   a hand flat on a pipe / a gauntlet closing on a hilt · a chalk sun / the real sun · her eye through the washer / the eye in the gold sun
//   faces in the ring · a Proctor writing · his eyes below / his eyes above · the blade.
// It draws on its own canvas at the screen's real resolution, laid exactly over the game screen, and hands back
// to the story when the count reaches eleven. Any button skips it. Nothing here is loaded: it is all paths.
// ============================================================
const Prelude = (() => {
  const VW = 1600, VH = 900, INK = '#0b0709', TAU = Math.PI * 2;
  const D = [3.4, 3.0, 2.8, 2.5, 2.2, 1.9, 1.6, 1.4, 1.15, 1.0, 1.25], LEAD = 1.3;
  const WORDS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN'];
  // camera per picture: centre x, y and zoom, from and to
  const CAM = [
    [840, 470, 1.0, 800, 450, 1.16], [800, 450, 1.16, 790, 440, 1.04], [700, 460, 1.02, 860, 430, 1.14], [860, 520, 1.16, 860, 420, 1.02],
    [840, 450, 1.0, 860, 430, 1.16], [860, 430, 1.16, 860, 440, 1.02], [640, 450, 1.12, 960, 450, 1.12], [800, 440, 1.02, 800, 525, 1.14],
    [800, 450, 1.02, 800, 450, 1.14], [800, 450, 1.14, 800, 450, 1.04], [800, 450, 1.0, 800, 450, 1.0]
  ];
  const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const ez = u => u * u * (3 - 2 * u), cl = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, u) => a + (b - a) * u;
  let pats = {};
  function pat(g, col, s) {
    const k = col + '|' + s; if (pats[k]) return pats[k];
    const q = 3, c = document.createElement('canvas'); c.width = c.height = s * 2 * q; const x = c.getContext('2d'); x.fillStyle = col;
    for (const [a, b] of [[0, 0], [2, 0], [0, 2], [2, 2], [1, 1]]) { x.beginPath(); x.arc(a * s * q, b * s * q, s * q * .43, 0, TAU); x.fill(); }
    const p = g.createPattern(c, 'repeat'); try { p.setTransform(new DOMMatrix([1 / q, 0, 0, 1 / q, 0, 0])); } catch (e) { /* coarser dots */ }
    return pats[k] = p;
  }
  const fs = (g, f) => { g.fillStyle = f; g.fill(); };
  const st = (g, w, c) => { g.lineWidth = w; g.strokeStyle = c || INK; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); };
  const tone = (g, col, a, s) => { g.save(); g.globalAlpha *= a; g.fillStyle = pat(g, col, s || 7); g.fill(); g.restore(); };
  const poly = (g, p) => { g.beginPath(); g.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.closePath(); };
  const capsule = (g, x0, y0, x1, y1, r) => { const a = Math.atan2(y1 - y0, x1 - x0); g.beginPath(); g.arc(x0, y0, r, a + Math.PI / 2, a - Math.PI / 2); g.arc(x1, y1, r, a - Math.PI / 2, a + Math.PI / 2); g.closePath(); };
  const circ = (g, x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, TAU); };
  const ell = (g, x, y, rx, ry, rot) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot || 0, 0, TAU); };
  const glow = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
  const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; };
  const almond = (g, x, y, w, h, tilt, low) => { g.beginPath(); g.moveTo(x - w / 2, y + tilt); g.quadraticCurveTo(x, y - h, x + w / 2, y - tilt); g.quadraticCurveTo(x, y + h * (low === undefined ? .8 : low), x - w / 2, y + tilt); g.closePath(); };

  // ---- the hand: bare and burned on the pipe, plated on the hilt. Drawn from the wrist, fingers toward -y.
  function hand(g, gaunt, curl) {
    const skin = gaunt ? '#f3ead4' : '#bd7a50', dark = gaunt ? '#8f7f62' : '#3b1a12', lite = gaunt ? '#ffffff' : '#f0a868', gilt = '#e2b84a';
    // forearm, off the bottom of the frame
    poly(g, [-80, 6, 80, 6, 170, 560, -120, 560]); fs(g, gaunt ? '#efe5cc' : '#33211f'); tone(g, gaunt ? '#9c8a68' : '#0b0709', .55, 8); st(g, 7);
    if (gaunt) { poly(g, [-96, 150, 112, 150, 122, 210, -106, 210]); fs(g, gilt); st(g, 6); poly(g, [-88, 14, 88, 14, 96, 64, -94, 64]); fs(g, '#6a3fb0'); tone(g, '#2a1650', .6, 6); st(g, 6); }
    else { poly(g, [-92, 40, 96, 40, 106, 120, -100, 120]); fs(g, '#4a3432'); tone(g, '#0b0709', .5, 6); st(g, 6); g.beginPath(); g.moveTo(-90, 82); g.lineTo(100, 78); st(g, 4); }
    // fingers
    const F = [[-76, -186, 150, -.13], [-26, -200, 178, -.04], [26, -197, 164, .05], [74, -180, 124, .16]];
    for (let i = 0; i < 4; i++) {
      const [x, y, L, a] = F[i], l = L * (1 - .45 * curl), sx = Math.sin(a), cy = -Math.cos(a), x1 = x + sx * l, y1 = y + cy * l;
      capsule(g, x, y, x1, y1, 25); fs(g, skin);
      g.save(); g.clip(); g.beginPath(); g.rect(x + 4, y - L - 40, 60, L + 80); tone(g, dark, gaunt ? .45 : .7, 6);
      if (curl > .3) { g.beginPath(); g.rect(x - 60, y1 - 30, 120, 40); g.globalAlpha = curl; tone(g, dark, .8, 5); g.globalAlpha = 1; } g.restore();
      capsule(g, x, y, x1, y1, 25); st(g, 6);
      for (const k of [.4, .72]) if (k * L < l - 6) { const jx = x + sx * L * k, jy = y + cy * L * k; g.beginPath(); g.moveTo(jx - 19, jy + 3); g.quadraticCurveTo(jx, jy - 6, jx + 19, jy + 3); st(g, gaunt ? 5 : 3); }
      if (gaunt) { circ(g, x, y + 6, 9); fs(g, gilt); st(g, 3); }
      else if (curl < .5) { g.beginPath(); g.moveTo(x1 - 12, y1 - 6); g.quadraticCurveTo(x1, y1 - 18, x1 + 12, y1 - 6); st(g, 3, '#5a2c1c'); }
    }
    // palm, over the roots of the fingers
    g.beginPath(); g.moveTo(-74, 12); g.quadraticCurveTo(-112, -90, -102, -186); g.quadraticCurveTo(0, -226, 100, -178); g.quadraticCurveTo(108, -80, 76, 12); g.closePath(); fs(g, skin);
    g.save(); g.clip(); g.beginPath(); g.rect(10, -240, 140, 280); tone(g, dark, gaunt ? .4 : .65, 7);
    if (!gaunt) { g.beginPath(); g.moveTo(-60, -40); g.quadraticCurveTo(-20, -70, 30, -50); st(g, 9, 'rgba(240,190,150,.5)'); g.beginPath(); g.moveTo(-70, -110); g.quadraticCurveTo(-30, -128, 0, -112); st(g, 7, 'rgba(240,190,150,.4)'); ell(g, 44, -20, 34, 22, .4); g.globalAlpha = .5; fs(g, '#1a0c0a'); g.globalAlpha = 1; }
    g.restore();
    g.beginPath(); g.moveTo(-74, 12); g.quadraticCurveTo(-112, -90, -102, -186); g.quadraticCurveTo(0, -226, 100, -178); g.quadraticCurveTo(108, -80, 76, 12); st(g, 7);
    if (gaunt) { g.beginPath(); g.moveTo(-96, -150); g.quadraticCurveTo(0, -186, 96, -146); st(g, 6, gilt); g.beginPath(); g.moveTo(-98, -80); g.quadraticCurveTo(0, -104, 100, -76); st(g, 4); g.beginPath(); g.moveTo(-86, -20); g.quadraticCurveTo(0, -36, 88, -18); st(g, 4); }
    else for (let i = 0; i < 4; i++) { const [x, y] = F[i]; g.beginPath(); g.arc(x, y + 8, 17, Math.PI * 1.15, Math.PI * 1.85); st(g, 3); }
    // thumb
    const tx = lerp(-196, -26, ez(curl)), ty = lerp(-150, -196, ez(curl));
    capsule(g, -92, -62, tx, ty, 28); fs(g, skin); g.save(); g.clip(); g.beginPath(); g.rect(-260, -110, 320, 90); tone(g, dark, gaunt ? .4 : .6, 6); g.restore(); capsule(g, -92, -62, tx, ty, 28); st(g, 6);
    if (gaunt) { circ(g, -92, -62, 10); fs(g, gilt); st(g, 3); }
    // the light catches the near edge
    g.beginPath(); g.moveTo(-98, -30); g.quadraticCurveTo(-110, -100, -100, -170); st(g, 4, lite);
  }

  // ONE: a hand flat on a pipe, somewhere dark
  function s1(g, u, T) {
    g.fillStyle = '#120a0c'; g.fillRect(-300, -200, 2200, 1300);
    for (let i = 0; i < 6; i++) { g.fillStyle = i & 1 ? '#1b1012' : '#170d10'; g.fillRect(-300, 40 + i * 150 + rnd(i) * 40, 2200, 18 + rnd(i + 9) * 30); }
    for (let i = 0; i < 5; i++) { g.fillStyle = '#1d1113'; g.fillRect(140 + i * 330 + rnd(i + 3) * 60, -200, 26, 1300); }
    glow(g, 330, 110, 900, '255,138,60', .34); glow(g, 330, 110, 300, '255,200,130', .3);
    g.save(); g.translate(800, 500); g.rotate(-.05);
    // the pipe
    g.beginPath(); g.rect(-1300, -112, 2600, 224); fs(g, lin(g, 0, -112, 0, 112, ['#e08a3a', '#a4551f', '#6a2f16', '#2a1210'])); tone(g, '#160a08', .6, 8);
    g.save(); g.beginPath(); g.rect(-1300, -112, 2600, 70); g.clip(); g.beginPath(); g.rect(-1300, -112, 2600, 70); tone(g, '#ffc27a', .35, 8); g.restore();
    g.beginPath(); g.moveTo(-1300, -112); g.lineTo(1300, -112); g.moveTo(-1300, 112); g.lineTo(1300, 112); st(g, 8);
    g.beginPath(); g.moveTo(-1300, -84); g.lineTo(1300, -84); st(g, 4, '#ffd9a0');
    for (const fx of [-500, 520]) {
      g.beginPath(); g.rect(fx - 30, -146, 60, 292); fs(g, lin(g, 0, -146, 0, 146, ['#c9783a', '#7a3c1c', '#24100e'])); st(g, 7);
      for (let i = 0; i < 5; i++) { circ(g, fx, -112 + i * 56, 11); fs(g, '#e9b06a'); st(g, 4); }
    }
    for (let i = 0; i < 14; i++) { circ(g, -1100 + i * 160, 86, 6); fs(g, '#3a1a12'); }
    g.font = "700 64px 'Pixelify Sans', monospace"; g.fillStyle = 'rgba(244,226,196,.34)'; g.fillText('B-7', -420, 44);
    // the gauge, needle trembling under the red
    g.beginPath(); g.rect(-296, -190, 32, 80); fs(g, '#5a2f1a'); st(g, 6);
    circ(g, -280, -262, 92); fs(g, '#7a4a22'); st(g, 8); circ(g, -280, -262, 74); fs(g, '#eadcbc'); st(g, 5);
    g.beginPath(); g.arc(-280, -262, 60, -.5, .35); st(g, 12, '#c8452e');
    for (let i = 0; i < 9; i++) { const a = Math.PI * (1.1 + i * .1); g.beginPath(); g.moveTo(-280 + Math.cos(a) * 52, -262 + Math.sin(a) * 52); g.lineTo(-280 + Math.cos(a) * 64, -262 + Math.sin(a) * 64); st(g, 4); }
    const na = -.62 + Math.sin(T * 31) * .035 + Math.sin(T * 2.3) * .05; g.beginPath(); g.moveTo(-280, -262); g.lineTo(-280 + Math.cos(na) * 58, -262 + Math.sin(na) * 58); st(g, 6); circ(g, -280, -262, 9); fs(g, INK);
    // the hand, its shadow first
    g.save(); g.translate(150, 196); g.rotate(-.16); g.save(); g.translate(26, 20); g.globalAlpha = .45; g.beginPath(); g.moveTo(-90, 12); g.lineTo(-120, -190); g.lineTo(-60, -380); g.lineTo(110, -350); g.lineTo(100, 12); g.closePath(); fs(g, '#0b0709'); g.restore();
    hand(g, 0, 0); g.restore();
    g.restore();
    // steam off a joint
    for (let i = 0; i < 5; i++) { const k = (T * .22 + i * .2) % 1; g.globalAlpha = (1 - k) * .16; circ(g, 1300 - k * 60 + Math.sin(i * 3 + T) * 20, 430 - k * 330, 50 + k * 90); fs(g, '#e8d8c8'); } g.globalAlpha = 1;
  }

  // TWO: the same hand in plate, closing on a hilt, in daylight
  function s2(g, u, T) {
    g.fillStyle = lin(g, 0, -200, 0, 1100, ['#7fc2ea', '#bfe2f4', '#f8f0da']); g.fillRect(-300, -200, 2200, 1300);
    glow(g, 330, 110, 760, '255,250,220', .9);
    for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + T * .05; g.beginPath(); g.moveTo(330, 110); g.lineTo(330 + Math.cos(a) * 2400, 110 + Math.sin(a) * 2400); g.lineTo(330 + Math.cos(a + .1) * 2400, 110 + Math.sin(a + .1) * 2400); g.closePath(); g.globalAlpha = .16; fs(g, '#ffffff'); } g.globalAlpha = 1;
    // a white wall, and the edge of a violet cloak in the wind
    poly(g, [900, 520, 1900, 430, 1900, 1100, 900, 1100]); fs(g, '#efe7d4'); tone(g, '#b9ad94', .5, 9); st(g, 6);
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(1000 + i * 240, 520 - i * 22); g.lineTo(1000 + i * 240, 1100); st(g, 3, '#a89c84'); }
    const w = Math.sin(T * 2.2) * 26;
    g.beginPath(); g.moveTo(-300, 520); g.quadraticCurveTo(60, 430 + w, 330, 640 - w); g.quadraticCurveTo(470, 800, 380, 1100); g.lineTo(-300, 1100); g.closePath(); fs(g, '#6a3fb0'); tone(g, '#2a1650', .6, 9); st(g, 7);
    g.beginPath(); g.moveTo(-200, 640 + w * .5); g.quadraticCurveTo(80, 600, 250, 760); st(g, 5, '#3a1f70');
    g.save(); g.translate(800, 500); g.rotate(-.05);
    // blade, guard, grip, pommel
    poly(g, [-1500, -124, -330, -112, -330, -36, -1500, -22]); fs(g, lin(g, 0, -124, 0, -22, ['#ffffff', '#dfe8f2', '#8fa4bd'])); st(g, 6);
    g.beginPath(); g.moveTo(-1500, -78); g.lineTo(-330, -74); st(g, 3, '#6f84a0');
    const gl = (T * 900) % 2600 - 1700; g.save(); poly(g, [-1500, -124, -330, -112, -330, -36, -1500, -22]); g.clip(); poly(g, [gl, -140, gl + 90, -140, gl + 30, 0, gl - 60, 0]); g.globalAlpha = .9; fs(g, '#ffffff'); g.restore();
    g.beginPath(); g.moveTo(-340, -210); g.quadraticCurveTo(-290, -74, -340, 62); g.lineTo(-286, 62); g.quadraticCurveTo(-250, -74, -286, -210); g.closePath(); fs(g, '#e2b84a'); tone(g, '#8a6418', .5, 6); st(g, 7);
    g.beginPath(); g.rect(-288, -112, 560, 76); fs(g, lin(g, 0, -112, 0, -36, ['#5a3a2a', '#2a1812'])); st(g, 6);
    for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(-270 + i * 46, -112); g.lineTo(-250 + i * 46, -36); st(g, 3, '#e2b84a'); }
    circ(g, 322, -74, 58); fs(g, '#e2b84a'); tone(g, '#8a6418', .5, 6); st(g, 7); circ(g, 322, -74, 24); fs(g, '#7a4fd0'); st(g, 4); circ(g, 314, -82, 7); fs(g, '#e8dcff');
    g.save(); g.translate(150, 196); g.rotate(-.16); hand(g, 1, ez(cl(u * 1.7, 0, 1))); g.restore();
    // a glint on the guard as the hand shuts
    const k = cl((u - .5) * 4, 0, 1), gs = Math.sin(k * Math.PI) * 120; if (gs > 2) { g.save(); g.translate(-312, -190); g.rotate(T * 1.5); g.beginPath(); for (let i = 0; i < 8; i++) { const r = i & 1 ? gs * .16 : gs; g.lineTo(Math.cos(i * Math.PI / 4) * r, Math.sin(i * Math.PI / 4) * r); } g.closePath(); fs(g, '#ffffff'); g.restore(); }
    g.restore();
  }

  // THREE: a chalk sun on a soot wall, and the woman drawing it
  const RAYS = 12;
  function s3(g, u, T) {
    g.fillStyle = '#1a1011'; g.fillRect(-300, -200, 2200, 1300);
    for (let r = 0; r < 13; r++) for (let c = 0; c < 13; c++) { const x = -260 + c * 170 + (r & 1) * 85, y = -150 + r * 86, k = rnd(r * 17 + c); g.fillStyle = k > .66 ? '#33211d' : k > .33 ? '#2b1b19' : '#3a2620'; g.fillRect(x + 4, y + 4, 162, 78); }
    glow(g, 880, 400, 780, '255,150,70', .34); glow(g, 880, 400, 330, '255,214,150', .2);
    // the sun: the ring twice over, then the rays one at a time
    const jit = (i, s) => (rnd(i) - .5) * s;
    for (let p = 0; p < 3; p++) { g.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, r = 122 + jit(i + p * 50, 9); g.lineTo(880 + Math.cos(a) * r + jit(p, 5), 400 + Math.sin(a) * r + jit(p + 3, 5)); } g.globalAlpha = .75; st(g, 9 - p * 2, '#ffe9a8'); }
    g.globalAlpha = .5; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(800 + i * 16 + jit(i, 8), 330 + jit(i + 20, 30)); g.lineTo(830 + i * 16 + jit(i + 40, 8), 470 + jit(i + 60, 30)); st(g, 7, '#ffdf8a'); } g.globalAlpha = 1;
    const prog = cl(u * 1.25, 0, 1) * RAYS; let hx = 880, hy = 400;
    for (let i = 0; i < RAYS; i++) {
      const k = cl(prog - i, 0, 1); if (k <= 0) break;
      const a = -Math.PI / 2 + i / RAYS * TAU, r0 = 164, r1 = 164 + (i & 1 ? 96 : 150) * k, x0 = 880 + Math.cos(a) * r0, y0 = 400 + Math.sin(a) * r0, x1 = 880 + Math.cos(a) * r1, y1 = 400 + Math.sin(a) * r1;
      for (let p = 0; p < 2; p++) { g.beginPath(); g.moveTo(x0 + jit(i * 7 + p, 6), y0 + jit(i * 7 + p + 1, 6)); g.lineTo(x1 + jit(i * 7 + p + 2, 6), y1 + jit(i * 7 + p + 3, 6)); g.globalAlpha = .8; st(g, 10 - p * 4, '#ffe9a8'); } g.globalAlpha = 1;
      if (k < 1 || i === RAYS - 1) { hx = x1; hy = y1; }
    }
    // chalk dust
    for (let i = 0; i < 26; i++) { const k = (T * .3 + rnd(i)) % 1; g.globalAlpha = (1 - k) * .5; circ(g, hx + (rnd(i + 5) - .5) * 120, hy + k * 260, 2 + rnd(i + 8) * 3); fs(g, '#ffefc0'); } g.globalAlpha = 1;
    // her hand and the chalk
    g.save(); g.translate(hx, hy); g.rotate(-.5);
    poly(g, [30, 20, 150, 300, 420, 760, 150, 760, -40, 320]); fs(g, '#2c1c1b'); st(g, 7);
    g.beginPath(); g.rect(-9, -8, 18, 60); fs(g, '#fff6d6'); st(g, 4);
    ell(g, 34, 74, 62, 50, .3); fs(g, '#c98a62'); g.save(); g.clip(); g.beginPath(); g.rect(30, 0, 100, 160); tone(g, '#5e3122', .7, 6); g.restore(); ell(g, 34, 74, 62, 50, .3); st(g, 6);
    capsule(g, 0, 60, -6, 30, 15); fs(g, '#d0936a'); st(g, 5); capsule(g, 26, 52, 12, 22, 15); fs(g, '#d0936a'); st(g, 5); capsule(g, -24, 86, -16, 48, 14); fs(g, '#c98a62'); st(g, 5);
    g.restore();
  }
  // the woman, close and dark against the lamp: drawn over the wall on a nearer layer
  function s3fg(g, u, T) {
    g.beginPath(); g.moveTo(-320, 1120); g.lineTo(-320, 210);
    g.bezierCurveTo(-260, 40, -40, -10, 150, 60); g.bezierCurveTo(250, 100, 300, 170, 312, 250);
    g.lineTo(330, 318); g.lineTo(320, 342); g.quadraticCurveTo(352, 386, 372, 420); g.lineTo(346, 434); g.lineTo(352, 456); g.quadraticCurveTo(340, 470, 344, 482); g.quadraticCurveTo(356, 496, 340, 506); g.lineTo(344, 536);
    g.quadraticCurveTo(330, 572, 280, 580); g.quadraticCurveTo(236, 600, 226, 660); g.quadraticCurveTo(300, 760, 470, 830); g.lineTo(600, 1120); g.closePath(); fs(g, '#0d0708');
    // the lamp on the edge of her face, and loose hair
    g.beginPath(); g.moveTo(312, 250); g.lineTo(330, 318); g.lineTo(320, 342); g.quadraticCurveTo(352, 386, 372, 420); g.lineTo(346, 434); g.lineTo(352, 456); g.quadraticCurveTo(340, 470, 344, 482); g.quadraticCurveTo(356, 496, 340, 506); g.lineTo(344, 536); g.quadraticCurveTo(330, 572, 280, 580); st(g, 5, '#ffb46a');
    g.beginPath(); g.moveTo(226, 660); g.quadraticCurveTo(300, 760, 470, 830); st(g, 4, '#c97a3a');
    const sw = Math.sin(T * 1.6) * 8; g.beginPath(); g.moveTo(240, 110); g.quadraticCurveTo(330 + sw, 170, 316 + sw, 262); st(g, 4, '#0d0708'); g.beginPath(); g.moveTo(200, 90); g.quadraticCurveTo(366 + sw, 150, 350 + sw * 1.4, 300); st(g, 3, '#0d0708');
    g.beginPath(); g.moveTo(150, 60); g.bezierCurveTo(250, 100, 300, 170, 312, 250); st(g, 3, '#7a4a2a');
    ell(g, -120, 250, 150, 130, 0); fs(g, '#0d0708');
  }

  // FOUR: the real sun, in the same place, over a valley
  function s4(g, u, T, L) {
    g.fillStyle = lin(g, 0, -200, 0, 900, ['#6fb6e6', '#a9d8f2', '#fdf3d2']); g.fillRect(-300, -200, 2200, 1300);
    L(.15, () => {
      glow(g, 880, 400, 900, '255,246,200', .95);
      for (let i = 0; i < RAYS; i++) { const a = -Math.PI / 2 + i / RAYS * TAU + T * .04, w = .07; g.beginPath(); g.moveTo(880 + Math.cos(a - w) * 150, 400 + Math.sin(a - w) * 150); g.lineTo(880 + Math.cos(a) * (i & 1 ? 620 : 900), 400 + Math.sin(a) * (i & 1 ? 620 : 900)); g.lineTo(880 + Math.cos(a + w) * 150, 400 + Math.sin(a + w) * 150); g.closePath(); g.globalAlpha = .5; fs(g, '#fff8dc'); g.globalAlpha = .35; tone(g, '#ffd86a', 1, 8); } g.globalAlpha = 1;
      circ(g, 880, 400, 122); fs(g, '#fffdf0'); st(g, 6, '#f2c84a');
    });
    L(.3, () => { poly(g, [-300, 700, -60, 470, 120, 560, 330, 380, 520, 520, 700, 430, 900, 560, 1090, 400, 1300, 540, 1480, 440, 1900, 640, 1900, 1100, -300, 1100]); fs(g, '#b9cfe8'); tone(g, '#7f9cc8', .5, 9); st(g, 5, '#5d79a8');
      for (const [x, y] of [[330, 380], [1090, 400], [-60, 470], [1480, 440]]) { poly(g, [x, y, x + 62, y + 64, x + 20, y + 52, x - 6, y + 78, x - 34, y + 50, x - 70, y + 70]); fs(g, '#ffffff'); st(g, 4, '#5d79a8'); } });
    L(.5, () => { poly(g, [-300, 760, 100, 600, 330, 690, 600, 580, 880, 700, 1180, 590, 1500, 700, 1900, 610, 1900, 1100, -300, 1100]); fs(g, '#7d9fca'); tone(g, '#4d6fa0', .55, 9); st(g, 6, '#2f4a78'); });
    L(.75, () => {
      g.beginPath(); g.moveTo(-300, 820); g.quadraticCurveTo(300, 690, 800, 780); g.quadraticCurveTo(1300, 700, 1900, 800); g.lineTo(1900, 1100); g.lineTo(-300, 1100); g.closePath(); fs(g, '#6fb35e'); tone(g, '#2f7a3c', .5, 9); st(g, 6, '#1f4a2a');
      g.beginPath(); g.moveTo(520, 1100); g.bezierCurveTo(760, 960, 560, 880, 800, 830); g.bezierCurveTo(900, 810, 860, 790, 960, 776); st(g, 30, '#d6f0ff'); g.beginPath(); g.moveTo(520, 1100); g.bezierCurveTo(760, 960, 560, 880, 800, 830); g.bezierCurveTo(900, 810, 860, 790, 960, 776); st(g, 4, '#7fb8dc');
      // the keep on its hill, banners out
      g.beginPath(); g.moveTo(1040, 780); g.quadraticCurveTo(1220, 640, 1420, 770); g.closePath(); fs(g, '#5fa052'); st(g, 5, '#1f4a2a');
      g.beginPath(); g.rect(1160, 640, 130, 76); fs(g, '#fbf6e8'); st(g, 5); for (const tx of [1146, 1206, 1272]) { g.beginPath(); g.rect(tx, tx === 1206 ? 580 : 612, 36, tx === 1206 ? 136 : 104); fs(g, '#fbf6e8'); g.save(); g.clip(); g.beginPath(); g.rect(tx + 20, 560, 20, 170); tone(g, '#b9ad94', .7, 5); g.restore(); g.beginPath(); g.rect(tx, tx === 1206 ? 580 : 612, 36, tx === 1206 ? 136 : 104); st(g, 5); }
      const fw = Math.sin(T * 5) * 6; for (const [fx, fy, c] of [[1164, 612, '#6a3fb0'], [1224, 580, '#e2b84a'], [1290, 612, '#2a9a94']]) { g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx, fy - 44); st(g, 3); poly(g, [fx, fy - 44, fx + 34, fy - 38 + fw, fx, fy - 26]); fs(g, c); st(g, 3); }
    });
    for (let i = 0; i < 5; i++) { const bx = 300 + i * 150 + T * 30, by = 250 + rnd(i) * 120 + Math.sin(T * 2 + i) * 8, f = Math.sin(T * 9 + i) * 8; g.beginPath(); g.moveTo(bx - 16, by - f); g.quadraticCurveTo(bx - 6, by - 6, bx, by); g.quadraticCurveTo(bx + 6, by - 6, bx + 16, by - f); st(g, 3); }
  }
  function s4fg(g, u, T) {
    // a standard in the near grass
    const w = Math.sin(T * 2.6) * 18;
    g.beginPath(); g.moveTo(210, 1120); g.lineTo(226, 300); st(g, 12); g.beginPath(); g.moveTo(226, 320); g.bezierCurveTo(340, 290 + w, 420, 380 - w, 540, 340 + w); g.lineTo(520, 560 + w); g.bezierCurveTo(420, 600 - w, 330, 520 + w, 224, 560); g.closePath(); fs(g, '#6a3fb0'); tone(g, '#2a1650', .6, 8); st(g, 7);
    circ(g, 376, 440 + w * .3, 38); fs(g, '#e2b84a'); st(g, 5);
    for (let i = 0; i < 40; i++) { const x = -280 + i * 55 + rnd(i) * 30, h = 60 + rnd(i + 4) * 90, s = Math.sin(T * 2 + i) * 10; poly(g, [x, 1120, x + 10 + s, 960 - h, x + 26, 1120]); fs(g, '#16301c'); }
    g.fillStyle = '#16301c'; g.fillRect(-320, 1000, 2300, 140);
  }

  // an eye, for every face here. o: { w, h, tilt, iris, r, look, lid, lash, glint }
  function eye(g, x, y, o) {
    const w = o.w, h = o.h, t = o.tilt || 0;
    almond(g, x, y, w, h, t, o.low); fs(g, o.white || '#f6ead8'); g.save(); g.clip();
    const ix = x + (o.look || 0), iy = y + (o.lookY || 0);
    circ(g, ix, iy, o.r); fs(g, o.iris); circ(g, ix, iy, o.r); st(g, 5, o.rim || INK);
    if (o.leaf) for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; g.beginPath(); g.moveTo(ix + Math.cos(a) * o.r * .45, iy + Math.sin(a) * o.r * .45); g.lineTo(ix + Math.cos(a) * o.r * .92, iy + Math.sin(a) * o.r * .92); st(g, 3, '#fff2b0'); }
    circ(g, ix, iy, o.r * .45); fs(g, '#0b0709');
    if (o.refl) { g.fillStyle = o.refl; g.fillRect(ix - o.r * .2, iy - o.r * .26, o.r * .26, o.r * .44); }
    circ(g, ix - o.r * .36, iy - o.r * .4, o.r * .2); fs(g, '#ffffff');
    g.beginPath(); g.rect(x - w, y - h * 1.2, w * 2, h * (o.lid === undefined ? .55 : o.lid)); g.globalAlpha = .4; fs(g, '#3a1a12'); g.globalAlpha = 1;
    g.restore();
    g.beginPath(); g.moveTo(x - w / 2, y + t); g.quadraticCurveTo(x, y - h, x + w / 2, y - t); st(g, o.lw || 9);
    g.beginPath(); g.moveTo(x + w / 2, y - t); g.quadraticCurveTo(x, y + h * (o.low === undefined ? .8 : o.low), x - w / 2, y + t); st(g, 4);
    if (o.lash) for (let i = 0; i < 5; i++) { const k = .55 + i * .1, px = x - w / 2 + w * k, py = y - h * .5 * Math.sin(k * Math.PI) - t * (k * 2 - 1); g.beginPath(); g.moveTo(px, py); g.lineTo(px + 10 + i * 4, py - 16 - i * 2); st(g, 4); }
  }

  // FIVE: she looks at you through the washer
  function s5(g, u, T) {
    g.fillStyle = '#c98a62'; g.fillRect(-300, -200, 2200, 1300);
    g.beginPath(); g.rect(-300, -200, 900, 1300); tone(g, '#6a3320', .7, 9);
    glow(g, 1500, 300, 900, '255,170,90', .5);
    // hair
    g.beginPath(); g.moveTo(-300, -200); g.lineTo(1900, -200); g.lineTo(1900, 220); g.bezierCurveTo(1500, 60, 1250, 130, 1000, 40); g.bezierCurveTo(700, -40, 420, 60, 250, 260); g.bezierCurveTo(160, 420, 150, 700, 60, 1100); g.lineTo(-300, 1100); g.closePath(); fs(g, '#160c0c'); st(g, 8);
    const sw = Math.sin(T * 1.3) * 10; for (const [a, b, c, d] of [[420, 60, 330, 420], [520, 20, 470, 250], [1200, 110, 1330, 330]]) { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo((a + c) / 2 + 60 + sw, (b + d) / 2, c + sw, d); st(g, 6, '#160c0c'); }
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(700 + i * 200, -60 + rnd(i) * 40); g.quadraticCurveTo(800 + i * 200, -150, 980 + i * 200, -90); st(g, 5, '#4a2c22'); }
    // the far eye, shut in a smile; brow, nose, mouth
    const sm = ez(cl((u - .3) * 2.2, 0, 1));
    g.beginPath(); g.moveTo(300, 470); g.quadraticCurveTo(410, 420 - sm * 14, 520, 476); st(g, 10); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(330 + i * 44, 458 - Math.sin((i + 1) / 5 * Math.PI) * 22); g.lineTo(318 + i * 44, 484 - Math.sin((i + 1) / 5 * Math.PI) * 14); st(g, 4); }
    g.beginPath(); g.moveTo(270, 370); g.quadraticCurveTo(400, 300, 560, 360); st(g, 16, '#160c0c');
    g.beginPath(); g.moveTo(640, 380); g.quadraticCurveTo(600, 560, 560, 640); g.quadraticCurveTo(600, 676, 668, 664); st(g, 7);
    g.beginPath(); g.moveTo(470, 780 - sm * 10); g.quadraticCurveTo(640, 830 + sm * 34, 850, 760 - sm * 30); st(g, 10); g.beginPath(); g.moveTo(560, 850); g.quadraticCurveTo(650, 880, 740, 846); st(g, 5, '#7a4630');
    g.beginPath(); g.moveTo(850, 760 - sm * 30); g.quadraticCurveTo(880, 740 - sm * 30, 884, 716 - sm * 30); st(g, 6);
    ell(g, 400, 650, 120, 44, -.25); g.globalAlpha = .4; fs(g, '#1a0c0a'); g.globalAlpha = 1;
    // the eye through the ring
    const cx = 880, cy = 430;
    g.beginPath(); g.moveTo(690, 320); g.quadraticCurveTo(880, 210, 1090, 300); st(g, 18, '#160c0c');
    eye(g, cx, cy, { w: 300, h: 150 - sm * 26, low: .8 - sm * .45, tilt: -8, iris: '#6a3c1a', rim: '#2a140a', r: 70, look: -10 + Math.sin(T * .9) * 6, lash: 1, lw: 12, refl: '#ffb46a', lid: .5 });
    // the washer, and the fingers that hold it up
    g.beginPath(); g.arc(cx, cy, 262, 0, TAU); g.arc(cx, cy, 168, 0, TAU, true); g.closePath(); fs(g, lin(g, cx - 260, cy - 260, cx + 260, cy + 260, ['#f2cd72', '#c2913a', '#7a5418'])); tone(g, '#5a3a10', .45, 7);
    circ(g, cx, cy, 262); st(g, 9); circ(g, cx, cy, 168); st(g, 8);
    g.beginPath(); g.arc(cx, cy, 240, Math.PI * 1.05, Math.PI * 1.5); st(g, 7, '#fff0b8'); g.beginPath(); g.arc(cx, cy, 186, Math.PI * .1, Math.PI * .45); st(g, 5, '#fff0b8');
    for (let i = 0; i < 3; i++) { const a = .9 + i * .5; g.beginPath(); g.moveTo(cx + Math.cos(a) * 196, cy + Math.sin(a) * 196); g.lineTo(cx + Math.cos(a + .08) * 236, cy + Math.sin(a + .08) * 236); st(g, 4, '#6a4a14'); }
    const tw = (T * .8) % 1; if (tw < .3) { const k = Math.sin(tw / .3 * Math.PI); g.save(); g.translate(cx - 150, cy - 180); g.beginPath(); for (let i = 0; i < 8; i++) { const r = (i & 1 ? 10 : 60) * k; g.lineTo(Math.cos(i * Math.PI / 4) * r, Math.sin(i * Math.PI / 4) * r); } g.closePath(); fs(g, '#ffffff'); g.restore(); }
    for (const [x0, y0, x1, y1, r] of [[1500, 1000, 1104, 596, 62], [1700, 760, 1150, 470, 56]]) { capsule(g, x0, y0, x1, y1, r); fs(g, '#d0936a'); g.save(); g.clip(); g.beginPath(); g.rect(x1 - 80, y1 + 10, 900, 600); tone(g, '#5e3122', .6, 7); g.restore(); capsule(g, x0, y0, x1, y1, r); st(g, 8); g.beginPath(); g.arc(x1, y1, r * .6, Math.PI * 1.0, Math.PI * 1.6); st(g, 4, '#f0c8a0'); }
  }

  // SIX: the eye in the gold sun, on white cloth
  function s6(g, u, T) {
    g.fillStyle = lin(g, 0, -200, 0, 1100, ['#8cc6ea', '#d2ecf8']); g.fillRect(-300, -200, 2200, 1300);
    const sw = Math.sin(T * 1.7) * 14;
    g.beginPath(); g.moveTo(330, -200); g.lineTo(1430, -200); g.bezierCurveTo(1450 + sw, 300, 1410 - sw, 700, 1440 + sw, 1100); g.lineTo(320 + sw, 1100); g.bezierCurveTo(350 - sw, 700, 310 + sw, 300, 330, -200); g.closePath(); fs(g, '#f8f2e2');
    g.save(); g.clip(); for (let i = 0; i < 5; i++) { g.beginPath(); g.rect(420 + i * 230 + sw * (i - 2) * .6, -200, 70, 1300); tone(g, '#c9bda2', .5, 8); } g.beginPath(); g.rect(300, 940, 1200, 40); fs(g, '#e2b84a'); g.restore();
    g.beginPath(); g.moveTo(330, -200); g.bezierCurveTo(310 + sw, 300, 350 - sw, 700, 320 + sw, 1100); st(g, 8); g.beginPath(); g.moveTo(1430, -200); g.bezierCurveTo(1450 + sw, 300, 1410 - sw, 700, 1440 + sw, 1100); st(g, 8);
    const cx = 880, cy = 430;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, w = .12, r1 = i & 1 ? 236 : 282; poly(g, [cx + Math.cos(a - w) * 178, cy + Math.sin(a - w) * 178, cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, cx + Math.cos(a + w) * 178, cy + Math.sin(a + w) * 178]); fs(g, '#e2b84a'); st(g, 6); }
    circ(g, cx, cy, 168); fs(g, lin(g, cx - 160, cy - 160, cx + 160, cy + 160, ['#f6d87a', '#d9a93a'])); g.save(); g.clip(); g.beginPath(); g.rect(cx, cy - 200, 220, 400); tone(g, '#8a6418', .45, 7); g.restore(); circ(g, cx, cy, 168); st(g, 9);
    eye(g, cx, cy, { w: 250, h: 112, tilt: 0, iris: '#e2b84a', rim: INK, r: 54, look: 0, lw: 10, white: '#fffaf0', lid: 0 });
    const gk = (T * .9) % 1; g.save(); circ(g, cx, cy, 168); g.clip(); poly(g, [cx - 400 + gk * 800, cy - 200, cx - 340 + gk * 800, cy - 200, cx - 440 + gk * 800, cy + 200, cx - 500 + gk * 800, cy + 200]); g.globalAlpha = .5; fs(g, '#ffffff'); g.restore();
  }

  // a cadet's face, lit hard from above: brow shadow, gold eyes. o: { skin, hair, cape, style, brow }
  function face(g, x, y, s, o) {
    g.save(); g.translate(x, y); g.scale(s, s);
    // cloak and plate
    poly(g, [-330, 560, -250, 250, 250, 250, 330, 560]); fs(g, o.cape); tone(g, '#120a20', .5, 8); st(g, 8);
    for (const m of [-1, 1]) { g.beginPath(); g.moveTo(m * 80, 250); g.quadraticCurveTo(m * 230, 210, m * 300, 330); g.quadraticCurveTo(m * 200, 380, m * 90, 340); g.closePath(); fs(g, '#f3ead4'); tone(g, '#a89674', .45, 7); st(g, 8); g.beginPath(); g.moveTo(m * 110, 318); g.quadraticCurveTo(m * 200, 350, m * 280, 318); st(g, 5, '#e2b84a'); }
    g.beginPath(); g.rect(-62, 130, 124, 150); fs(g, o.skin); g.save(); g.clip(); g.beginPath(); g.rect(-62, 130, 124, 70); fs(g, '#3a1c14'); g.restore(); g.beginPath(); g.rect(-62, 130, 124, 150); st(g, 7);
    // head
    const head = () => { g.beginPath(); g.moveTo(0, -176); g.bezierCurveTo(116, -176, 138, -70, 124, 10); g.bezierCurveTo(116, 90, 70, 150, 0, 172); g.bezierCurveTo(-70, 150, -116, 90, -124, 10); g.bezierCurveTo(-138, -70, -116, -176, 0, -176); g.closePath(); };
    head(); fs(g, o.skin); g.save(); g.clip();
    g.beginPath(); g.rect(-140, -180, 90, 380); tone(g, '#5a2c18', .6, 7);
    // the brow's shadow, and the eyes in it
    for (const m of [-1, 1]) {
      g.beginPath(); g.moveTo(m * 114, -30 + o.brow); g.quadraticCurveTo(m * 60, -54, m * 10, -30); g.lineTo(m * 14, 0); g.quadraticCurveTo(m * 60, 14, m * 110, 2); g.closePath(); g.globalAlpha = .82; fs(g, '#2a120c'); g.globalAlpha = 1;
      eye(g, m * 60, -10, { w: 88, h: 26, low: .6, tilt: m * -3, iris: '#ffd24a', rim: '#8a5a10', r: 15, look: 0, lw: 6, lid: .45, white: '#fff6e0' });
      g.beginPath(); g.moveTo(m * 120, -42 + o.brow); g.quadraticCurveTo(m * 60, -68, m * 8, -42 - o.brow * .6); g.lineTo(m * 10, -30 - o.brow * .6); g.quadraticCurveTo(m * 60, -50, m * 116, -30 + o.brow); g.closePath(); fs(g, o.browc || INK); st(g, 3);
    }
    poly(g, [-6, -30, 6, -30, 10, 46, 30, 66, 0, 74]); g.globalAlpha = .8; fs(g, '#3a1c12'); g.globalAlpha = 1;
    g.beginPath(); g.moveTo(-40, 112); g.quadraticCurveTo(0, 104 + (o.mouth || 0), 44, 112); st(g, 7); g.beginPath(); g.moveTo(-22, 130); g.lineTo(24, 130); st(g, 4, '#7a4630');
    if (o.scar) { g.beginPath(); g.moveTo(70, -90); g.lineTo(96, 60); st(g, 5, '#fff0e0'); }
    g.restore(); head(); st(g, 8);
    for (const m of [-1, 1]) { ell(g, m * 130, 6, 16, 34, 0); fs(g, o.skin); st(g, 6); }
    // hair
    g.beginPath();
    if (o.style === 0) { g.moveTo(-134, 0); g.bezierCurveTo(-170, -150, -80, -230, 10, -226); g.bezierCurveTo(110, -228, 170, -140, 134, 0); g.quadraticCurveTo(120, -90, 60, -110); g.quadraticCurveTo(0, -84, -70, -112); g.quadraticCurveTo(-118, -80, -134, 0); }
    else if (o.style === 1) { g.moveTo(-140, 60); g.bezierCurveTo(-190, -160, -70, -240, 20, -230); g.bezierCurveTo(130, -230, 180, -120, 140, 40); g.quadraticCurveTo(130, -70, 90, -120); g.quadraticCurveTo(10, -60, -110, -100); g.quadraticCurveTo(-130, -40, -140, 60); }
    else { g.moveTo(-132, -10); g.bezierCurveTo(-160, -150, -80, -214, 0, -212); g.bezierCurveTo(90, -214, 160, -150, 132, -10); g.quadraticCurveTo(110, -110, 0, -128); g.quadraticCurveTo(-110, -110, -132, -10); }
    g.closePath(); fs(g, o.hair); tone(g, INK, .4, 6); st(g, 8);
    if (o.style === 2) { capsule(g, 120, 30, 170, 300, 26); fs(g, o.hair); tone(g, INK, .4, 6); st(g, 7); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(104 + i * 12, 70 + i * 60); g.lineTo(160 + i * 12, 96 + i * 60); st(g, 4); } }
    g.restore();
  }
  // SEVEN: faces in the ring
  function s7(g, u, T, L) {
    g.fillStyle = lin(g, 0, -200, 0, 1100, ['#7fc2ea', '#f4ecd0']); g.fillRect(-300, -200, 2200, 1300);
    L(.4, () => { glow(g, 1300, 60, 800, '255,250,220', .9);
      for (let i = 0; i < 9; i++) { const x = -160 + i * 240, w = Math.sin(T * 3 + i) * 10; g.beginPath(); g.moveTo(x, 1100); g.lineTo(x, 40 + rnd(i) * 120); st(g, 9); if (i % 3 === 1) { poly(g, [x, 60 + rnd(i) * 120, x + 150, 90 + rnd(i) * 120 + w, x + 140, 250 + rnd(i) * 120 - w, x, 230 + rnd(i) * 120]); fs(g, i % 2 ? '#2a9a94' : '#6a3fb0'); tone(g, '#120a20', .45, 8); st(g, 7); } else { poly(g, [x - 9, 40 + rnd(i) * 120, x, -150 + rnd(i) * 120, x + 9, 40 + rnd(i) * 120]); fs(g, '#eef4fa'); st(g, 5); } } });
    L(.7, () => { for (let i = 0; i < 6; i++) { const x = -100 + i * 380; ell(g, x, 520, 100, 130, 0); fs(g, '#5a6f96'); poly(g, [x - 190, 1100, x - 150, 640, x + 150, 640, x + 190, 1100]); fs(g, i & 1 ? '#3a7f8a' : '#5a4a90'); for (const m of [-1, 1]) { ell(g, x + m * 38, 506, 12, 5, 0); fs(g, '#ffe9a0'); } } });
    face(g, 300, 500, 1.02, { skin: '#e6b98c', hair: '#2a1a16', cape: '#2a9a94', style: 0, brow: 6, scar: 1, mouth: 6 });
    face(g, 1300, 500, 1.02, { skin: '#d9a47a', hair: '#7a3a1c', cape: '#6a3fb0', style: 2, brow: 0, mouth: 0 });
    face(g, 800, 520, 1.16, { skin: '#f0c9a0', hair: '#e8c86a', cape: '#6a3fb0', style: 1, brow: -4, mouth: -4 });
  }

  // EIGHT: a Proctor, writing it down
  function s8(g, u, T) {
    g.fillStyle = lin(g, 0, -200, 0, 1100, ['#5fa8dc', '#cfeaf8']); g.fillRect(-300, -200, 2200, 1300);
    glow(g, 800, -100, 900, '255,250,220', .8); g.translate(0, 130);
    // mantle
    g.beginPath(); g.moveTo(-100, 1100); g.quadraticCurveTo(80, 560, 520, 500); g.lineTo(1080, 500); g.quadraticCurveTo(1520, 560, 1700, 1100); g.closePath(); fs(g, '#f8f2e2'); tone(g, '#c9bda2', .4, 9); st(g, 9);
    poly(g, [650, 520, 950, 520, 990, 1100, 610, 1100]); fs(g, '#6a3fb0'); tone(g, '#2a1650', .55, 8); st(g, 8);
    circ(g, 800, 700, 56); fs(g, '#e2b84a'); st(g, 6); almond(g, 800, 700, 76, 30, 0); fs(g, '#fffaf0'); st(g, 4); circ(g, 800, 700, 12); fs(g, INK);
    // the hood, and what looks out of it
    g.beginPath(); g.moveTo(800, -150); g.bezierCurveTo(1090, -130, 1160, 240, 1100, 560); g.lineTo(500, 560); g.bezierCurveTo(440, 240, 510, -130, 800, -150); g.closePath(); fs(g, '#fbf6e8'); g.save(); g.clip(); g.beginPath(); g.rect(880, -200, 300, 800); tone(g, '#b9ad94', .55, 8); g.restore();
    g.beginPath(); g.moveTo(800, -150); g.bezierCurveTo(1090, -130, 1160, 240, 1100, 560); g.lineTo(500, 560); g.bezierCurveTo(440, 240, 510, -130, 800, -150); st(g, 9);
    g.beginPath(); g.moveTo(800, 60); g.bezierCurveTo(960, 60, 1000, 260, 960, 470); g.quadraticCurveTo(800, 560, 640, 470); g.bezierCurveTo(600, 260, 640, 60, 800, 60); g.closePath(); fs(g, '#120a12'); st(g, 8);
    poly(g, [800, 330, 826, 420, 800, 436]); fs(g, '#2a1a26');
    const dn = ez(cl(u * 2, 0, 1)) * 16; for (const m of [-1, 1]) { ell(g, 800 + m * 78, 300 + dn * .3, 34, 13, m * .1); fs(g, '#ffd24a'); circ(g, 800 + m * 78, 304 + dn * .5, 8); fs(g, INK); glow(g, 800 + m * 78, 300, 70, '255,210,74', .35); }
    g.beginPath(); g.moveTo(560, 70); g.quadraticCurveTo(800, -30, 1040, 70); g.lineTo(1048, 130); g.quadraticCurveTo(800, 30, 552, 130); g.closePath(); fs(g, '#e2b84a'); tone(g, '#8a6418', .4, 6); st(g, 7);
    poly(g, [800, 20, 836, 62, 800, 104, 764, 62]); fs(g, '#4fb6e8'); st(g, 6); poly(g, [800, 34, 816, 60, 800, 70]); fs(g, '#d8f2ff');
  }
  function s8fg(g, u, T) {
    // the grading book, the glove, the pen
    g.translate(0, -70);
    poly(g, [120, 1120, 250, 720, 800, 760, 800, 1120]); fs(g, '#f4ead2'); st(g, 9); poly(g, [800, 1120, 800, 760, 1350, 720, 1480, 1120]); fs(g, '#fbf3df'); st(g, 9);
    for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(300 - i * 14, 800 + i * 44); g.lineTo(740, 826 + i * 44); st(g, 5, '#b0a488'); }
    const n = cl(u * 1.2, 0, 1) * 9;
    for (let i = 0; i < 9; i++) { const k = cl(n - i, 0, 1); if (k <= 0) break; const x = 880 + (i % 5) * 44 + Math.floor(i / 5) * 290, y = 820; g.beginPath(); if (i % 5 === 4) { g.moveTo(x - 200, y + 110); g.lineTo(x - 200 + 230 * k, y + 110 - 100 * k); } else { g.moveTo(x, y); g.lineTo(x + 6 * k, y + 120 * k); } st(g, 9, '#1a1016'); }
    const i = Math.min(8, Math.floor(n)), k = n - i, px = i % 5 === 4 ? 880 + 4 * 44 + Math.floor(i / 5) * 290 - 200 + 230 * k : 880 + (i % 5) * 44 + Math.floor(i / 5) * 290 + 6 * k, py = i % 5 === 4 ? 930 - 100 * k : 820 + 120 * k;
    g.save(); g.translate(px, py); g.rotate(.34 + Math.sin(T * 14) * .02);
    poly(g, [0, 0, 10, -40, 60, -420, 30, -424, -10, -40]); fs(g, '#fffaf0'); st(g, 6); poly(g, [0, 0, 10, -40, -10, -40]); fs(g, '#e2b84a'); st(g, 5);
    g.beginPath(); g.moveTo(60, -420); g.bezierCurveTo(150, -520, 120, -640, 70, -700); g.bezierCurveTo(30, -620, 10, -520, 30, -424); g.closePath(); fs(g, '#f8f2e2'); tone(g, '#c9bda2', .5, 6); st(g, 6);
    g.restore();
    g.save(); g.translate(px + 34, py - 96);
    g.beginPath(); g.moveTo(40, 30); g.quadraticCurveTo(200, 60, 520, 420); g.lineTo(260, 520); g.quadraticCurveTo(60, 200, -30, 90); g.closePath(); fs(g, '#f8f2e2'); tone(g, '#c9bda2', .4, 8); st(g, 8);
    ell(g, 30, 40, 96, 72, .5); fs(g, '#fffaf0'); g.save(); g.clip(); g.beginPath(); g.rect(20, 20, 200, 200); tone(g, '#b9ad94', .5, 7); g.restore(); ell(g, 30, 40, 96, 72, .5); st(g, 8);
    capsule(g, -20, 10, -62, 50, 24); fs(g, '#fffaf0'); st(g, 7); capsule(g, 10, -10, -40, 26, 22); fs(g, '#fffaf0'); st(g, 7);
    g.beginPath(); g.moveTo(96, 120); g.quadraticCurveTo(170, 110, 200, 60); st(g, 6, '#e2b84a');
    g.restore();
  }

  // NINE and TEN: his eyes, below and above. The smudge on the cheek is the same smudge.
  function eyes(g, u, T, gold) {
    g.fillStyle = gold ? '#f2cf9a' : '#a8683f'; g.fillRect(-300, -200, 2200, 1300);
    g.beginPath(); g.rect(-300, -200, gold ? 520 : 760, 1300); tone(g, gold ? '#b9844a' : '#3a1a10', gold ? .5 : .8, 9);
    if (gold) glow(g, 1200, -100, 1100, '255,255,240', .6); else { glow(g, 700, 1100, 1000, '255,120,40', .55); g.beginPath(); g.rect(900, -200, 1000, 520); tone(g, '#2a120c', .6, 9); }
    // the bridge of the nose and the hollows
    g.beginPath(); g.moveTo(744, 330); g.quadraticCurveTo(700, 560, 640, 760); g.lineTo(720, 800); g.quadraticCurveTo(770, 580, 790, 340); g.closePath(); fs(g, gold ? '#c9955a' : '#4a2012');
    g.beginPath(); g.moveTo(856, 340); g.quadraticCurveTo(880, 600, 960, 780); st(g, 6, gold ? '#b9844a' : '#3a1a10');
    for (const m of [-1, 1]) { const x = 800 + m * 280;
      g.beginPath(); g.moveTo(x - m * 210, 296); g.quadraticCurveTo(x - m * 40, 250 - (gold ? 0 : 0), x + m * 220, 332); g.lineTo(x + m * 210, 372); g.quadraticCurveTo(x - m * 20, 320, x - m * 196, 390); g.closePath(); fs(g, gold ? '#b98a2a' : '#140a0a'); st(g, 7);
      g.beginPath(); g.moveTo(x - m * 196, 392); g.quadraticCurveTo(x, 330, x + m * 200, 380); g.lineTo(x + m * 170, 440); g.quadraticCurveTo(x, 380, x - m * 170, 436); g.closePath(); g.globalAlpha = gold ? .35 : .75; fs(g, gold ? '#8a5a2a' : '#1a0a08'); g.globalAlpha = 1;
      eye(g, x, 470, { w: 330, h: 104, low: .62, tilt: m * -12, iris: gold ? '#f2c230' : '#3a2416', rim: gold ? '#8a5a10' : INK, r: 62, look: m * -8, lookY: -6, lw: 13, leaf: gold, refl: gold ? '#fffbe0' : '#ff8a3c', lid: .62, white: gold ? '#fffaf0' : '#e8d2bc' });
      g.beginPath(); g.moveTo(x - 150, 560); g.quadraticCurveTo(x, 600, x + 150, 556); st(g, 4, gold ? '#b9844a' : '#3a1a10');
    }
    // hair over the brow, and the one dark streak he keeps
    for (let i = 0; i < 12; i++) { const x = -200 + i * 170, d = 150 + rnd(i) * 120 + (i === 4 || i === 5 ? 60 : 0), sw = Math.sin(T * 1.4 + i) * 6; poly(g, [x - 40, -220, x + 190, -220, x + 150 + sw, d * .6, x + 70 + sw, d]); fs(g, gold ? (i === 7 ? '#1a0f0e' : '#e2c05a') : '#140a0a'); st(g, 7); }
    // soot
    g.save(); g.translate(1220, 700); g.rotate(-.3); ell(g, 0, 0, 170, 54, 0); g.globalAlpha = .7; fs(g, '#1a0c0a'); g.globalAlpha = 1; ell(g, 0, 0, 230, 80, 0); tone(g, '#1a0c0a', .7, 7); g.restore();
    if (!gold) for (let i = 0; i < 16; i++) { const k = (T * .4 + rnd(i)) % 1; g.globalAlpha = (1 - k) * .8; circ(g, rnd(i + 2) * 1600 + Math.sin(T + i) * 20, 900 - k * 900, 3 + rnd(i + 6) * 4); fs(g, '#ff9a4a'); } g.globalAlpha = 1;
  }

  // ELEVEN: the blade
  function s11(g, u, T) {
    g.fillStyle = '#050305'; g.fillRect(-300, -200, 2200, 1300);
    const k = ez(cl(u * 5, 0, 1));
    for (let i = 0; i < 22; i++) { const y = -100 + i * 52 + rnd(i) * 30, x = 1900 - k * (1500 + rnd(i + 3) * 900); g.globalAlpha = .25 + rnd(i) * .3; g.fillStyle = i % 3 ? '#e2b84a' : '#ffffff'; g.save(); g.translate(x, y); g.rotate(-.52); g.fillRect(0, 0, 500 + rnd(i + 7) * 500, 3 + rnd(i) * 5); g.restore(); } g.globalAlpha = 1;
    g.save(); g.translate(800, 450); g.rotate(-.52);
    const len = 2600 * k; poly(g, [1300, -8, 1300 - len, -70, 1300 - len - 160, 0, 1300 - len, 70, 1300, 8]); fs(g, '#ffffff'); poly(g, [1300, 8, 1300 - len, 70, 1300 - len - 160, 0, 1300 - len, 26, 1300, 2]); fs(g, '#e2b84a');
    g.restore();
    if (k >= 1) { const a = cl((u - .2) * 6, 0, 1); g.globalAlpha = a; g.font = "700 250px 'Pixelify Sans', monospace"; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 26; g.strokeStyle = INK; g.strokeText('ELEVEN', 800, 462); g.fillStyle = '#ffe08a'; g.fillText('ELEVEN', 800, 462); g.globalAlpha = 1; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; }
  }

  // ---- two plates for Part Two's flash-forwards, in the same hand as the intro
  // the book: the Count, open on a table, seen from his own chair. One line is red
  function pBook(g, u, T) {
    g.fillStyle = '#1a1210'; g.fillRect(-300, -200, 2200, 1300); glow(g, 800, 380, 1000, '255,236,190', .5);
    poly(g, [-300, 1100, -300, 250, 1900, 250, 1900, 1100]); fs(g, '#3a2418'); tone(g, '#120a08', .5, 9);
    // the pages, in perspective: wide at the near edge
    const page = (x0, x1, X0, X1) => { poly(g, [x0, 180, x1, 180, X1, 1010, X0, 1010]); };
    page(210, 800, -60, 800); fs(g, '#f1e6c8'); page(210, 800, -60, 800); st(g, 8); page(800, 1390, 800, 1660); fs(g, '#f8eed2'); page(800, 1390, 800, 1660); st(g, 8);
    g.save(); page(800, 1390, 800, 1660); g.clip(); g.beginPath(); g.rect(800, 100, 90, 1000); tone(g, '#b9a880', .5, 7); g.restore();
    g.beginPath(); g.moveTo(800, 180); g.lineTo(800, 1010); st(g, 6);
    // ruled lines: a name, a figure for air breathed, a figure for air owed
    const row = (side, i) => { const k = i / 13, y = 230 + k * k * 300 + k * 440, w = 1 + k * .46, xl = side < 0 ? lerp(240, -20, k) : lerp(840, 850, k), xr = side < 0 ? 770 : lerp(1360, 1620, k); return { y, w, xl, xr, k }; };
    for (const side of [-1, 1]) for (let i = 0; i < 14; i++) { const r = row(side, i), red = side > 0 && i === 8;
      g.beginPath(); g.moveTo(r.xl, r.y + 22 * r.w); g.lineTo(r.xr, r.y + 22 * r.w); st(g, 2, '#c9bb98');
      if (red) continue;
      const n = 3 + ((i * 7 + (side > 0 ? 3 : 0)) % 4); let x = r.xl + 14 * r.w; for (let j = 0; j < n; j++) { const len = (18 + rnd(i * 9 + j + side * 40) * 46) * r.w; g.beginPath(); g.moveTo(x, r.y + 6 * r.w); g.lineTo(x + len, r.y + 6 * r.w); st(g, 5 * r.w, '#3a2c24'); x += len + 12 * r.w; }
      for (const c of [.66, .84]) { const cx = lerp(r.xl, r.xr, c); g.beginPath(); g.moveTo(cx, r.y + 6 * r.w); g.lineTo(cx + 44 * r.w, r.y + 6 * r.w); st(g, 5 * r.w, '#5a4a3c'); }
      if ((i * 5 + (side > 0 ? 2 : 0)) % 6 === 0) { g.beginPath(); g.moveTo(r.xl + 6, r.y + 8 * r.w); g.lineTo(lerp(r.xl, r.xr, .58), r.y + 4 * r.w); st(g, 4 * r.w, '#1a1016'); } }
    // the red line: his own name. Nobody has struck it. The pen is over it
    { const r = row(1, 8); g.font = `700 ${Math.round(40 * r.w)}px 'Pixelify Sans', monospace`; g.fillStyle = '#b3261c'; g.textBaseline = 'alphabetic'; g.fillText('Brennick, K.', r.xl + 16 * r.w, r.y + 16 * r.w);
      glow(g, lerp(r.xl, r.xr, .3), r.y, 260, '255,60,40', .16 + Math.sin(T * 3) * .04);
      g.beginPath(); g.moveTo(r.xl + 14 * r.w, r.y + 26 * r.w); g.lineTo(r.xl + 300 * r.w, r.y + 26 * r.w); st(g, 3 * r.w, '#b3261c'); }
    // a cuff with gold on it, and the pen
    g.save(); g.translate(1370 - ez(u) * 60, 900 + Math.sin(T * 1.3) * 5);
    poly(g, [120, 400, 60, 60, 300, -20, 560, 400]); fs(g, '#f3ead4'); tone(g, '#a89674', .5, 8); st(g, 9); poly(g, [70, 100, 288, 26, 300, 66, 84, 140]); fs(g, '#e2b84a'); st(g, 6);
    ell(g, 150, 10, 110, 76, -.3); fs(g, '#e6c79a'); g.save(); g.clip(); g.beginPath(); g.rect(150, -80, 160, 200); tone(g, '#8a6a48', .55, 7); g.restore(); ell(g, 150, 10, 110, 76, -.3); st(g, 8);
    poly(g, [-150, -210, -130, -222, 150, 0, 120, 26]); fs(g, '#1a1016'); st(g, 5); poly(g, [-176, -232, -150, -210, -130, -222]); fs(g, '#e2b84a'); st(g, 4);
    capsule(g, 60, -34, 20, -70, 22); fs(g, '#e6c79a'); st(g, 7); capsule(g, 100, -60, 50, -96, 22); fs(g, '#e6c79a'); st(g, 7);
    g.restore();
  }
  // Tavi at sixteen, on the service stair, with a piece of chalk
  function pTavi(g, u, T) {
    g.fillStyle = '#2a2c34'; g.fillRect(-300, -200, 2200, 1300);
    for (let r = 0; r < 12; r++) for (let c = 0; c < 9; c++) { const x = -260 + c * 250 + (r & 1) * 125, y = -180 + r * 104, k = rnd(r * 13 + c); g.fillStyle = k > .6 ? '#3a3c46' : k > .3 ? '#34363f' : '#40424c'; g.fillRect(x + 5, y + 5, 240, 94); }
    glow(g, 1010, 360, 760, '255,220,150', .34);
    // steps going up to the right, and the painted line the service keeps to
    for (let i = 0; i < 9; i++) { const x = 760 + i * 150, y = 900 - i * 92; poly(g, [x, y, 1900, y, 1900, y + 92, x, y + 92]); fs(g, i & 1 ? '#565864' : '#4c4e5a'); st(g, 6); g.beginPath(); g.rect(x + 40, y + 4, 60, 14); fs(g, '#e2b84a'); }
    poly(g, [-300, 900, 760, 900, 760, 1100, -300, 1100]); fs(g, '#4c4e5a'); st(g, 6); g.beginPath(); g.rect(-300, 930, 1060, 16); fs(g, '#e2b84a');
    // the sun he is chalking on their wall
    const cx = 1010, cy = 360, jit = (i, s) => (rnd(i) - .5) * s, prog = cl(u * 1.3, 0, 1) * 10;
    for (let p = 0; p < 3; p++) { g.beginPath(); for (let i = 0; i <= 36; i++) { const a = i / 36 * TAU, r = 96 + jit(i + p * 40, 8); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.globalAlpha = .8; st(g, 9 - p * 2, '#ffe9a8'); } g.globalAlpha = 1;
    let hx = cx + 96, hy = cy; for (let i = 0; i < 10; i++) { const k = cl(prog - i, 0, 1); if (k <= 0) break; const a = -Math.PI / 2 + i / 10 * TAU, r1 = 130 + (i & 1 ? 70 : 110) * k; g.beginPath(); g.moveTo(cx + Math.cos(a) * 130, cy + Math.sin(a) * 130); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.globalAlpha = .85; st(g, 9, '#ffe9a8'); g.globalAlpha = 1; hx = cx + Math.cos(a) * r1; hy = cy + Math.sin(a) * r1; }
    for (let i = 0; i < 18; i++) { const k = (T * .3 + rnd(i)) % 1; g.globalAlpha = (1 - k) * .5; circ(g, hx + (rnd(i + 5) - .5) * 90, hy + k * 220, 2 + rnd(i + 8) * 3); fs(g, '#ffefc0'); } g.globalAlpha = 1;
    // the boy: bedroll, satchel, scarf, a lamp at his belt. Sixteen and all elbows
    g.save(); g.translate(520, 0);
    g.beginPath(); g.moveTo(-40, 1100); g.lineTo(-10, 700); g.quadraticCurveTo(-30, 520, 30, 440); g.lineTo(150, 440); g.quadraticCurveTo(230, 520, 200, 700); g.lineTo(230, 1100); g.closePath(); fs(g, '#6a5236'); tone(g, '#2a1c12', .55, 8); st(g, 9);
    capsule(g, -30, 470, 240, 420, 46); fs(g, '#8a7a5a'); tone(g, '#3a3020', .5, 7); st(g, 8); for (const x of [10, 110, 200]) { g.beginPath(); g.moveTo(x, 430 + x * -.18 + 46); g.lineTo(x + 8, 430 + x * -.18 - 40); st(g, 5); }
    poly(g, [-20, 620, 80, 600, 100, 800, -10, 820]); fs(g, '#4a3524'); st(g, 8); g.beginPath(); g.moveTo(170, 450); g.lineTo(10, 640); st(g, 9, '#2a1c12');
    circ(g, 190, 820, 34); fs(g, '#ffd98a'); st(g, 7); glow(g, 190, 820, 150, '255,217,138', .5);
    // arm up to the wall, chalk in the fingers
    g.lineCap = 'round'; g.beginPath(); g.moveTo(140, 486); g.quadraticCurveTo(270, 470, hx - 520 - 26, hy + 44); st(g, 78, '#120a0e'); st(g, 62, '#6a5236'); g.lineCap = 'butt';
    ell(g, hx - 520 - 16, hy + 14, 34, 28, .3); fs(g, '#c98a62'); st(g, 6); g.beginPath(); g.rect(hx - 520 - 6, hy - 14, 34, 14); fs(g, '#fff6d6'); st(g, 4);
    // head: turned three-quarters away, hair cropped, the scarf
    g.beginPath(); g.moveTo(20, 440); g.quadraticCurveTo(90, 470, 160, 440); g.lineTo(150, 380); g.lineTo(34, 380); g.closePath(); fs(g, '#b8682a'); tone(g, '#5a2c10', .5, 7); st(g, 8);
    g.beginPath(); g.moveTo(92, 180); g.bezierCurveTo(190, 180, 214, 270, 196, 330); g.bezierCurveTo(184, 384, 150, 404, 96, 404); g.bezierCurveTo(30, 404, 2, 350, 4, 290); g.bezierCurveTo(4, 220, 30, 180, 92, 180); g.closePath(); fs(g, '#c98a62'); g.save(); g.clip(); g.beginPath(); g.rect(-20, 160, 110, 260); tone(g, '#5e3122', .7, 7); g.restore();
    g.beginPath(); g.moveTo(92, 180); g.bezierCurveTo(190, 180, 214, 270, 196, 330); g.bezierCurveTo(184, 384, 150, 404, 96, 404); g.bezierCurveTo(30, 404, 2, 350, 4, 290); g.bezierCurveTo(4, 220, 30, 180, 92, 180); st(g, 8);
    g.beginPath(); g.moveTo(-6, 300); g.bezierCurveTo(-20, 190, 60, 140, 130, 156); g.bezierCurveTo(196, 166, 220, 220, 206, 268); g.quadraticCurveTo(150, 230, 110, 250); g.quadraticCurveTo(60, 290, 40, 360); g.quadraticCurveTo(10, 350, -6, 300); g.closePath(); fs(g, '#1e1416'); st(g, 8);
    g.beginPath(); g.moveTo(196, 300); g.lineTo(214, 322); g.lineTo(196, 334); st(g, 6); ell(g, 176, 292, 12, 6, 0); fs(g, '#1e1416');
    g.beginPath(); g.moveTo(196, 268); g.quadraticCurveTo(206, 300, 196, 330); st(g, 4, '#ffb46a');
    g.restore();
  }
  const PLATES = { book: [pBook, [860, 500, 1.0, 980, 600, 1.2]], tavi: [pTavi, [640, 480, 1.0, 860, 430, 1.16]] };
  const SHOTS = [
    [[1, s1]], [[1, s2]], [[1, s3], [1.5, s3fg]], [[1, s4], [1.6, s4fg]], [[1, s5]], [[1, s6]], [[1, s7]], [[1, s8], [1.35, s8fg]],
    [[1, (g, u, T) => eyes(g, u, T, 0)]], [[1, (g, u, T) => eyes(g, u, T, 1)]], [[1, s11]]
  ];

  return {
    on: false, el: null, g: null, t: 0, done: null, last: '', n: -1, D, LEAD,
    total() { return LEAD + D.reduce((a, b) => a + b, 0); },
    run(done) {
      this.on = true; this.done = done; this.t = 0; this.n = -1; this.last = ''; this.pl = null; pats = {};
      const c = this.el = document.createElement('canvas'); c.id = 'prelude'; c.style.cssText = 'position:fixed;background:#050305;image-rendering:auto';
      document.body.insertBefore(c, $('#ui')); this.g = c.getContext('2d'); this.place();
      try { document.body.classList.remove('ingame', 'fight'); $('#cskip').classList.remove('hidden'); } catch (e) { /* no button */ }
      Sound.music('hum'); Input.consume();
    },
    place() {
      const r = Layout.rect, dpr = Math.min(window.devicePixelRatio || 1, 2), k = r.x + ',' + r.y + ',' + r.w + ',' + r.h + ',' + dpr; if (k === this.last || !this.el) return; this.last = k;
      Object.assign(this.el.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
      const s = Math.min(dpr, 1920 / Math.max(1, r.w)); this.el.width = Math.max(2, Math.round(r.w * s)); this.el.height = Math.max(2, Math.round(r.h * s)); pats = {};
    },
    tick(dt) {
      if (!this.on) return; this.place(); this.t += dt;
      if (this.t > .5 && (Input.p('A') || Input.p('B') || Input.p('START'))) return this.finish();
      if (this.pl) { if (this.t >= this.pl.secs) return this.finish(); return this.drawPlate(); }
      const at = this.at(this.t);
      if (at.n !== this.n) { this.n = at.n; if (at.n >= 0) { Sound.play(at.n === 10 ? 'pillar' : 'heart'); if (at.n === 10) Sound.play('slash'); } }
      if (this.t >= this.total()) return this.finish();
      this.draw(at);
    },
    // which picture, and how far through it
    at(t) { let s = t - LEAD; if (s < 0) return { n: -1, u: 0, T: 0 }; for (let i = 0; i < D.length; i++) { if (s < D[i]) return { n: i, u: s / D[i], T: s }; s -= D[i]; } return { n: 10, u: 1, T: D[10] }; },
    draw(at) {
      const g = this.g, cw = this.el.width, ch = this.el.height, red = Settings.d.reduce;
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = '#050305'; g.fillRect(0, 0, cw, ch);
      if (at.n >= 0) {
        const C = CAM[at.n], e = red ? .5 : ez(at.u), punch = red ? 0 : Math.max(0, 1 - at.T / .22) * .045;
        const cx = lerp(C[0], C[3], e), cy = lerp(C[1], C[4], e), z = lerp(C[2], C[5], e) + punch, S = Math.max(cw / VW, ch / VH);
        const L = (d, fn) => { g.save(); g.translate((cx - 800) * (1 - d), (cy - 450) * (1 - d)); fn(); g.restore(); };
        for (const [d, fn] of SHOTS[at.n]) {
          g.save(); g.translate(cw / 2, ch / 2); g.scale(S * z, S * z); g.translate(-800 - (cx - 800) * d, -450 - (cy - 450) * d);
          fn(g, at.u, at.T, L); g.restore();
        }
        // the frame: ink edge, the count and its tally
        const vg = g.createRadialGradient(cw / 2, ch / 2, ch * .45, cw / 2, ch / 2, Math.max(cw, ch) * .72); vg.addColorStop(0, 'rgba(5,3,5,0)'); vg.addColorStop(1, 'rgba(5,3,5,.55)'); g.fillStyle = vg; g.fillRect(0, 0, cw, ch);
        const U = ch / 900, bar = 62 * U; g.fillStyle = '#050305'; g.fillRect(0, 0, cw, bar); g.fillRect(0, ch - bar, cw, bar);
        g.fillStyle = '#e2b84a'; g.fillRect(0, bar - 3 * U, cw, 3 * U); g.fillRect(0, ch - bar, cw, 3 * U);
        if (at.n < 10) {
          const pop = red ? 1 : 1 + Math.max(0, 1 - at.T / .18) * .35; g.save(); g.translate(40 * U, ch - bar - 34 * U); g.scale(pop, pop);
          g.font = `700 ${Math.round(96 * U)}px 'Pixelify Sans', monospace`; g.textBaseline = 'alphabetic'; g.lineJoin = 'round'; g.lineWidth = 16 * U; g.strokeStyle = INK; g.strokeText(WORDS[at.n], 0, 0); g.fillStyle = '#ffe9b0'; g.fillText(WORDS[at.n], 0, 0); g.restore();
          g.lineCap = 'round'; g.strokeStyle = '#ffe9b0'; g.lineWidth = 5 * U;
          for (let i = 0; i <= at.n; i++) { const x = cw - 44 * U - (10 - i) * 22 * U, y0 = bar * .26, y1 = bar * .74; g.beginPath(); if (i % 5 === 4) { g.moveTo(x - 96 * U, y1); g.lineTo(x - 14 * U, y0); } else { g.moveTo(x, y0); g.lineTo(x, y1); } g.stroke(); }
        }
        if (!red) { const fl = Math.max(0, 1 - at.T / .13); if (fl > 0) { g.fillStyle = `rgba(255,248,230,${fl * (at.n === 10 ? 1 : .55)})`; g.fillRect(0, 0, cw, ch); } }
        if (at.n === 10 && at.u > .72) { g.fillStyle = `rgba(255,252,240,${cl((at.u - .72) / .22, 0, 1)})`; g.fillRect(0, 0, cw, ch); }
      }
    },
    drawPlate() {
      const g = this.g, cw = this.el.width, ch = this.el.height, red = Settings.d.reduce, P = PLATES[this.pl.name], C = P[1], u = cl(this.t / this.pl.secs, 0, 1), e = red ? .5 : ez(u);
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = '#050305'; g.fillRect(0, 0, cw, ch);
      const cx = lerp(C[0], C[3], e), cy = lerp(C[1], C[4], e), z = lerp(C[2], C[5], e), S = Math.max(cw / VW, ch / VH);
      g.save(); g.translate(cw / 2, ch / 2); g.scale(S * z, S * z); g.translate(-cx, -cy); P[0](g, u, this.t); g.restore();
      const vg = g.createRadialGradient(cw / 2, ch / 2, ch * .45, cw / 2, ch / 2, Math.max(cw, ch) * .72); vg.addColorStop(0, 'rgba(5,3,5,0)'); vg.addColorStop(1, 'rgba(5,3,5,.6)'); g.fillStyle = vg; g.fillRect(0, 0, cw, ch);
      const U = ch / 900, bar = 62 * U; g.fillStyle = '#050305'; g.fillRect(0, 0, cw, bar); g.fillRect(0, ch - bar, cw, bar); g.fillStyle = '#e2b84a'; g.fillRect(0, bar - 3 * U, cw, 3 * U); g.fillRect(0, ch - bar, cw, 3 * U);
      const a = Math.max(1 - this.t / .7, (this.t - (this.pl.secs - .8)) / .8); if (a > 0) { g.fillStyle = `rgba(5,3,5,${cl(a, 0, 1)})`; g.fillRect(0, 0, cw, ch); }
    },
    finish() {
      if (!this.on) return; this.on = false; this.pl = null; const el = this.el, cb = this.done; this.el = this.g = this.done = null; pats = {};
      try { $('#cskip').classList.add('hidden'); } catch (e) { /* gone */ }
      Fade.a = 1; Fade.dir = 0; Fade.busy = false; Input.consume();
      if (cb) cb(); setTimeout(() => { if (el) el.remove(); }, 120);
    },
    // one drawn picture, held and slowly pushed in on, for a flash that has no words (the book; Tavi at sixteen)
    plate(name, secs, done) { if (!PLATES[name]) return done && done(); this.run(done); this.pl = { name, secs: secs || 9 }; Sound.music('hum'); Sound.play('heart'); },
    // for the Dev menu and the tests: hold one moment of it
    still(t, plate) { if (!this.on) this.run(() => {}); if (plate) this.pl = { name: plate, secs: 9 }; this.t = t; this.place(); if (this.pl) this.drawPlate(); else this.draw(this.at(t)); }
  };
})();
