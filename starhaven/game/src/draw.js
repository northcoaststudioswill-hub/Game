// Starhaven — drawing. Placeholder art with a fixed direction: moody painted-style depth behind,
// a near-black play layer with lit edges, and a bright, clearly outlined Wren in front.
// Each place has its own palette (DESIGN.md "Palette by place"): the Deep in pale greens and roses,
// the road at dusk in violet and rose, Starhaven in night blues and starlight gold, the Thornwood in cold blue.
(function (SH) {
  const PAL = {
    star: '#ffffff', starDim: '#a9b8ff',
    plank: '#29233f', plankTop: '#cbb8ff',
    thornDark: '#2a1024', thornMid: '#5a1d3e', thornTip: '#ff5a78',
    gold: '#ffd27a', goldDeep: '#d9973f', warm: '#ffe9a8',
    hair: '#e0703f', hairDark: '#a8452a', skin: '#f6dcc6', tunic: '#2f8f7a', tunicDark: '#1f6656',
    cloak: '#2c3d74', cloakRim: '#9fc2ff', legs: '#3b3150', boots: '#6a4430', blade: '#eef8ff',
    sprite: '#2f5c2b', spriteRim: '#8fd16b', spriteEye: '#ffb057', spriteAngry: '#ff8a3a',
  };
  SH.PAL = PAL;

  const THEMES = {
    deep: {
      sky: ['#050807', '#0b1411', '#13201b', '#1b2a22'], stars: false, far: 'cave', mid: 'roots',
      farA: '#132019', farB: '#0d1712', midC: '#08100c', mist: 'rgba(150,220,180,0.10)', glow: 'rgba(255,140,170,0.20)',
      ground: '#060908', speck: '#18291f', edgeLight: '#d6f0dc', edgeMid: '#4f7a62', grass: '#8ccaa8', grassDark: '#3f6a58', side: '#16261e',
      motes: ['#cfeedd', '#ffb8c8'],
    },
    dusk: {
      sky: ['#0d0c26', '#2a2058', '#5a3270', '#9a5070'], stars: true, far: 'mountains', mid: 'trees',
      farA: '#2e2560', farB: '#221b4a', midC: '#16123a', mist: 'rgba(255,150,170,0.12)',
      ground: '#0b0a18', speck: '#151230', edgeLight: '#ffd6e0', edgeMid: '#8a5a8a', grass: '#7aa89a', grassDark: '#3f6a66', side: '#241c46',
      motes: ['#ffe9a8', '#ffc0d0'],
    },
    city: {
      sky: ['#070a22', '#151a48', '#2a2a60', '#3a3270'], stars: true, far: 'mountains', mid: 'spires',
      farA: '#1e2458', farB: '#161b46', midC: '#121540', mist: 'rgba(150,140,230,0.12)',
      ground: '#0b0b1a', speck: '#141632', edgeLight: '#e6dcff', edgeMid: '#6a62a8', grass: '#6a7ab8', grassDark: '#3a4278', side: '#22264e',
      motes: ['#ffe9a8', '#fff6d8'],
    },
    winter: {
      sky: ['#46557e', '#7a8cbc', '#b4c2e2', '#e2eafa'], stars: false, far: 'mountains', mid: 'pines', snow: true,
      farA: '#8a9ac4', farB: '#6a7aa6', midC: '#34405e', mist: 'rgba(255,255,255,0.22)',
      ground: '#1a2236', speck: '#222c44', edgeLight: '#ffffff', edgeMid: '#c8d6f0', grass: '#ffffff', grassDark: '#dfe8f8', side: '#2a3450',
      motes: ['#ffffff', '#e8f0ff'],
    },
    mountain: {
      sky: ['#1c2433', '#3a4a62', '#7a8aa6', '#c8d2e2'], stars: false, far: 'mountains', mid: 'pines', snow: true,
      farA: '#5a6a86', farB: '#44526e', midC: '#232c3c', mist: 'rgba(220,230,245,0.18)',
      ground: '#141a24', speck: '#1c2432', edgeLight: '#ffffff', edgeMid: '#9aa6c0', grass: '#e8eef8', grassDark: '#b8c4d8', side: '#2a3446',
      motes: ['#ffffff', '#dfe8f8'],
    },
    thornwood: {
      sky: ['#090b20', '#191a45', '#33295c', '#4d3a72'], stars: true, far: 'mountains', mid: 'trees',
      farA: '#23275a', farB: '#181b42', midC: '#11132e', mist: 'rgba(110,100,190,0.18)',
      ground: '#0a0b17', speck: '#121430', edgeLight: '#c3cdff', edgeMid: '#56609c', grass: '#5ba39a', grassDark: '#2f6a66', side: '#20264d',
      motes: ['#cfe0ff', '#ffe9a8'],
    },
  };
  SH.THEMES = THEMES;

  // Deterministic random so the art is the same every time.
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  const D = { off: {} };
  let room, layers = { bg: {}, fg: {}, haze: {} };

  D.init = function (r, viewW) {
    room = r;
    const def = r.def;
    layers.level = makeLevel(r, THEMES[def.theme]);
    const themes = def.zones ? def.zones.map(z => z.theme) : [def.theme];
    for (const th of themes) { if (!layers.bg[th]) layers.bg[th] = makeBackdrop(THEMES[th], th); if (!layers.fg[th]) layers.fg[th] = makeForeground(th); }
    if (!layers.stars) layers.stars = makeStars();
    D.resize(viewW);
  };
  D.resize = function (viewW) {
    layers.viewW = viewW;
    layers.vignette = makeVignette(viewW);
    layers.dark = canvas(Math.ceil(viewW / 2), SH.VIEW_H / 2);
    if (!layers.hole) {   // a soft round light, stamped out of the darkness wherever something glows
      const h = layers.hole = canvas(128, 128), g = h.getContext('2d');
      const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
      const wm = layers.warm = canvas(128, 128), g2 = wm.getContext('2d');
      const g3 = g2.createRadialGradient(64, 64, 2, 64, 64, 64); g3.addColorStop(0, 'rgba(255,190,110,0.5)'); g3.addColorStop(1, 'rgba(255,150,60,0)');
      g2.fillStyle = g3; g2.fillRect(0, 0, 128, 128);
    }
  };
  // How dark each place is away from a light: [colour, strength].
  const DARK = { deep: ['#020806', 0.46], thornwood: ['#06030c', 0.42], winter: ['#04061a', 0.34], dusk: ['#06041a', 0.34], city: ['#06041a', 0.26], mountain: ['#040818', 0.36] };
  function drawLight(ctx, w, cx, cy, vw, VH, t, themeA, themeB, k) {
    const a = DARK[themeA] || DARK.dusk, b = DARK[themeB] || a, strength = a[1] + (b[1] - a[1]) * k;
    const c = layers.dark, g = c.getContext('2d');
    g.setTransform(0.5, 0, 0, 0.5, 0, 0);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, vw + 2, VH);
    g.fillStyle = k > 0.5 ? b[0] : a[0]; g.globalAlpha = strength; g.fillRect(0, 0, vw + 2, VH);
    g.globalCompositeOperation = 'destination-out';
    const warm = [];
    const hole = (x, y, r, al, glow) => { const X = x - cx, Y = y - cy; if (X < -r || X > vw + r) return; g.globalAlpha = al; g.drawImage(layers.hole, X - r, Y - r, r * 2, r * 2); if (glow) warm.push(X, Y, r * glow); };
    const p = w.player, fl = Math.sin(t * 0.13) * 3;
    hole(p.x, p.y - 22, 105, 0.85);
    if (p.charging) hole(p.x + p.facing * 12, p.y - 24, 40 + Math.min(40, p.chargeT), 0.9, 0.7);
    for (const l of w.lanterns) if (l.lit) hole(l.px, l.py - 40, 120 + fl, 1, 0.9);
    for (const n of w.npcs) if (!n.hidden) hole(n.x, n.y - 24, 70, 0.6);
    for (const m of w.motes || []) if (!m.got) hole(m.x, m.y, 20, 0.7);
    for (const f of w.fireballs || []) hole(f.x, f.y, f.big ? 110 : 70, 1, 0.8);
    for (const e of w.things) {
      if (e.kind === 'brazier' && e.lit) hole(e.x, e.y - 34, 100 + fl, 1, 0.9);
      else if (e.kind === 'stag' && e.state !== 'down') hole(e.x, e.y - 22, 80, 0.8);
      else if (e.kind === 'wyrm' && !e.dead && e.boss) hole(e.x, e.y - e.h / 2, 120, 0.6);
      else if (e.kind === 'bulb') hole(e.x, e.y, 34, 0.5);
    }
    const def = w.room.def, TS = SH.TILE;
    if (def.exitLight != null) hole(def.exitLight * TS, 13 * TS, 190, 1);
    if (def.cottage != null) hole((def.cottage + 3) * TS, 14 * TS, 120, 0.8, 0.6);
    if (def.mural && SH.game.flags[def.mural.flag]) hole((def.mural.x + 2) * TS, 13 * TS, 110, 0.8);
    for (const pt of SH.fx.parts) if (pt.glow && pt.life > 6) hole(pt.x, pt.y, 12, 0.35);
    ctx.drawImage(c, 0, 0, c.width * 2, c.height * 2);
    // a little warm bloom around flames, so fire feels like light and not just a shape
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < warm.length; i += 3) { const r = warm[i + 2]; ctx.globalAlpha = 0.5; ctx.drawImage(layers.warm, warm[i] - r, warm[i + 1] - r, r * 2, r * 2); }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  function makeBackdrop(T, name) {
    const out = {};
    const s = canvas(16, 360), g = s.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 360);
    gr.addColorStop(0, T.sky[0]); gr.addColorStop(0.45, T.sky[1]); gr.addColorStop(0.78, T.sky[2]); gr.addColorStop(1, T.sky[3]);
    g.fillStyle = gr; g.fillRect(0, 0, 16, 360);
    out.sky = s;
    out.far = T.far === 'cave' ? makeCave(T) : makeMountains(T);
    out.near = makeNear(T, name);
    out.mid = T.mid === 'roots' ? makeRoots(T) : T.mid === 'spires' ? makeSpires(T) : T.mid === 'pines' ? makePines(T) : makeTrees(T);
    return out;
  }
  // The nearest background layer: things with real detail, just behind where Wren walks.
  function makeNear(T, name) {
    if (name === 'city') return null;
    const w = 1100, h = 300, c = canvas(w, h), g = c.getContext('2d'), r = rng(name.length * 13 + 5);
    const dark = SH.shade(T.midC, 0.75), lite = SH.shade(T.midC, 1.5);
    for (let i = 0; i < 9; i++) {
      const x = 50 + i * 122 + r() * 46;
      if (name === 'deep') {   // pillars of rock with a lit edge, and roots hanging between them
        const pw = 16 + r() * 14, top = 30 + r() * 60;
        g.fillStyle = dark; g.fillRect(x, top, pw, h - top); g.beginPath(); g.moveTo(x - 6, h); g.lineTo(x + 2, top + 30); g.lineTo(x + pw - 2, top + 30); g.lineTo(x + pw + 8, h); g.fill();
        g.fillStyle = lite; g.fillRect(x, top, 2, h - top); for (let k = 0; k < 6; k++) g.fillRect(x + 3 + r() * (pw - 6), top + 10 + r() * 200, 2, 1);
        g.strokeStyle = dark; g.lineWidth = 2; g.beginPath(); g.moveTo(x + pw, 0); g.quadraticCurveTo(x + pw + 40, 70 + r() * 40, x + 122, 0); g.stroke();
      } else if (name === 'thornwood') {   // twisted trunks with thorned branches
        g.strokeStyle = dark; g.lineCap = 'round'; g.lineWidth = 9; g.beginPath(); g.moveTo(x, h); g.quadraticCurveTo(x + 14, h - 90, x - 6, h - 170); g.stroke();
        for (let k = 0; k < 4; k++) { const by = h - 70 - k * 30, dir = k % 2 ? 1 : -1; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 4, by); g.quadraticCurveTo(x + dir * 30, by - 20, x + dir * 52, by - 8 - r() * 20); g.stroke(); g.fillStyle = dark; for (let q = 0; q < 3; q++) { const tx = x + dir * (16 + q * 12), ty = by - 12 - q * 2; g.beginPath(); g.moveTo(tx - 2, ty); g.lineTo(tx, ty - 7); g.lineTo(tx + 2, ty); g.fill(); } }
        g.strokeStyle = lite; g.lineWidth = 1; g.beginPath(); g.moveTo(x - 3, h); g.quadraticCurveTo(x + 10, h - 90, x - 9, h - 168); g.stroke();
      } else {   // pines with a trunk, tiers of boughs, and snow or moonlight on each tier
        const th = 150 + r() * 90, base = h;
        g.fillStyle = SH.shade(T.midC, 0.6); g.fillRect(x - 3, base - th * 0.3, 6, th * 0.3);
        for (let k = 0; k < 6; k++) { const ty = base - th * 0.22 - k * th * 0.13, tw = (34 - k * 4.6) * (th / 200);
          g.fillStyle = dark; g.beginPath(); g.moveTo(x, ty - th * 0.2); g.lineTo(x - tw, ty); g.lineTo(x - tw * 0.55, ty - 3); g.lineTo(x, ty + 4); g.lineTo(x + tw * 0.55, ty - 3); g.lineTo(x + tw, ty); g.fill();
          g.fillStyle = T.snow ? 'rgba(255,255,255,0.6)' : lite; g.beginPath(); g.moveTo(x, ty - th * 0.2); g.lineTo(x - tw * 0.8, ty - 3); g.lineTo(x - tw * 0.3, ty - th * 0.08); g.fill(); }
      }
    }
    return c;
  }
  function makeStars() {
    const r = rng(7), out = [];
    for (let i = 0; i < 140; i++) out.push({ x: r() * 2400, y: r() * 230, s: r() < 0.12 ? 2 : 1, tw: r() * 6, sp: 0.02 + r() * 0.05 });
    return out;
  }
  function ridge(g, w, base, amp, color, light, seed) {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, 360);
    const pts = [];
    for (let x = 0; x <= w; x += 8) {
      const n = Math.sin(x * 0.004 + seed) * amp + Math.sin(x * 0.011 + seed * 2) * amp * 0.45 + Math.sin(x * 0.031 + 2) * amp * 0.12;
      const y = base - Math.abs(n); pts.push([x, y]); g.lineTo(x, y);
    }
    g.lineTo(w, 360); g.closePath(); g.fill();
    if (light) { g.strokeStyle = light; g.globalAlpha = 0.5; g.lineWidth = 1; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.globalAlpha = 1; }
  }
  function makeMountains(T) {
    const w = 1600, c = canvas(w, 360), g = c.getContext('2d');
    ridge(g, w, 250, 80, T.farA, 'rgba(255,255,255,0.25)', 1.3);
    const m = g.createLinearGradient(0, 200, 0, 300); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(1, T.mist);
    g.fillStyle = m; g.fillRect(0, 200, w, 160);
    ridge(g, w, 300, 46, T.farB, null, 2.1);
    return c;
  }
  function makeTrees(T) {
    const w = 1400, c = canvas(w, 360), g = c.getContext('2d'), r = rng(11);
    for (let i = 0; i < 26; i++) {
      const x = r() * w, top = 70 + r() * 150, tw = 5 + r() * 9;
      g.fillStyle = T.midC;
      g.fillRect(x, top, tw, 360 - top);
      for (let b = 0; b < 4; b++) {
        const by = top + 10 + r() * 90, dir = r() < 0.5 ? -1 : 1, len = 14 + r() * 26;
        g.save(); g.translate(x + tw / 2, by); g.rotate(dir * (0.5 + r() * 0.5)); g.fillRect(0, -1.5, dir * len, 3); g.restore();
      }
      g.beginPath(); g.ellipse(x + tw / 2, top + 6, 22 + r() * 22, 14 + r() * 12, 0, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = T.midC; g.fillRect(0, 330, w, 30);
    return c;
  }
  function makePines(T) {
    const w = 1300, c = canvas(w, 360), g = c.getContext('2d'), r = rng(41);
    for (let i = 0; i < 34; i++) {
      const x = r() * w, h = 120 + r() * 150, base = 340;
      g.fillStyle = T.midC; g.fillRect(x - 2, base - 30, 4, 40);
      for (let k = 0; k < 4; k++) { const y = base - 30 - k * h / 5, wd = 26 - k * 5; g.beginPath(); g.moveTo(x, y - h / 4); g.lineTo(x - wd, y); g.lineTo(x + wd, y); g.fill(); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x - wd + 4, y - 2, wd * 2 - 8, 2); g.fillStyle = T.midC; }
    }
    g.fillRect(0, 336, w, 24);
    return c;
  }
  function makeSpires(T) {
    // Starhaven's skyline: towers with gold windows
    const w = 1500, c = canvas(w, 360), g = c.getContext('2d'), r = rng(31);
    for (let i = 0; i < 40; i++) {
      const x = r() * w, bw = 14 + r() * 26, top = 120 + r() * 140;
      g.fillStyle = T.midC; g.fillRect(x, top, bw, 360 - top);
      g.beginPath(); g.moveTo(x - 2, top); g.lineTo(x + bw / 2, top - 14 - r() * 20); g.lineTo(x + bw + 2, top); g.fill();
      for (let wy = top + 8; wy < 330; wy += 12) for (let wx = x + 4; wx < x + bw - 4; wx += 8) if (r() < 0.35) { g.fillStyle = r() < 0.5 ? '#ffd27a' : '#c9a050'; g.fillRect(wx, wy, 2, 3); }
    }
    return c;
  }
  function makeCave(T) {
    // the Deep: far rock walls and a faint rose glow from somewhere below
    const w = 1400, c = canvas(w, 360), g = c.getContext('2d'), r = rng(5);
    for (let i = 0; i < 9; i++) {
      const x = r() * w, gr = g.createRadialGradient(x, 200 + r() * 80, 4, x, 240, 140);
      gr.addColorStop(0, T.glow); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - 140, 100, 280, 260);
    }
    g.fillStyle = T.farA;
    for (let x = 0; x < w; x += 40) { const h = 60 + r() * 120; g.fillRect(x, 0, 42, h); g.beginPath(); g.moveTo(x, h); g.lineTo(x + 20, h + 20 + r() * 40); g.lineTo(x + 42, h); g.fill(); }
    for (let x = 0; x < w; x += 50) { const h = 40 + r() * 90; g.fillRect(x, 360 - h, 52, h); }
    return c;
  }
  function makeRoots(T) {
    const w = 1200, c = canvas(w, 360), g = c.getContext('2d'), r = rng(9);
    g.strokeStyle = T.midC; g.lineCap = 'round';
    for (let i = 0; i < 30; i++) {
      let x = r() * w, y = 0; g.lineWidth = 2 + r() * 5; g.beginPath(); g.moveTo(x, y);
      const len = 80 + r() * 200;
      while (y < len) { x += (r() - 0.5) * 18; y += 12; g.lineTo(x, y); }
      g.stroke();
    }
    g.fillStyle = T.midC;
    for (let x = 0; x < w; x += 30) { const h = 20 + r() * 50; g.beginPath(); g.moveTo(x, 360); g.lineTo(x + 15, 360 - h); g.lineTo(x + 30, 360); g.fill(); }
    return c;
  }
  // A strip of near things in silhouette along the bottom edge: boughs and grass outdoors, rock teeth in the Deep,
  // railings and crates in the city. Sparse, so it frames the picture without hiding the ground Wren stands on.
  function makeForeground(name) {
    const w = 900, h = 64, c = canvas(w, h), g = c.getContext('2d'), r = rng(name.length * 7 + 3);
    const col = { deep: '#020504', thornwood: '#040208', winter: '#0a1020', mountain: '#060a14', city: '#05040f', dusk: '#06040f' }[name] || '#05040f';
    g.fillStyle = col;
    for (let x = 0; x < w; x += 2) { const gh = 3 + Math.sin(x * 0.05) * 2 + r() * 5; g.fillRect(x, h - gh, 2, gh); }   // a low uneven edge
    for (let i = 0; i < 7; i++) {
      const x = 40 + i * 128 + r() * 50;
      if (name === 'deep') { const hh = 22 + r() * 30; g.beginPath(); g.moveTo(x - 16, h); g.lineTo(x - 3, h - hh); g.lineTo(x + 4, h - hh * 0.7); g.lineTo(x + 18, h); g.fill(); }
      else if (name === 'city') { if (i % 2) { g.fillRect(x - 14, h - 26, 28, 26); g.fillRect(x - 17, h - 30, 34, 5); } else { for (let k = 0; k < 5; k++) g.fillRect(x - 40 + k * 20, h - 30, 3, 30); g.fillRect(x - 44, h - 30, 90, 4); } }
      else if (name === 'thornwood') { g.lineWidth = 4; g.strokeStyle = col; g.beginPath(); g.moveTo(x - 30, h); g.quadraticCurveTo(x - 10, h - 50, x + 26, h - 30); g.stroke(); for (let k = 0; k < 5; k++) { const tx = x - 22 + k * 11, ty = h - 20 - k * 6 + (k > 3 ? 8 : 0); g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + 3, ty - 9); g.lineTo(tx + 6, ty); g.fill(); } }
      else { for (let k = 0; k < 9; k++) { const bx = x - 26 + k * 6.5, bh = 14 + Math.sin(k * 0.8) * 10 + r() * 10; g.beginPath(); g.moveTo(bx - 4, h); g.lineTo(bx, h - bh); g.lineTo(bx + 4, h); g.fill(); }   // a tuft of tall grass, or a pine bough
        if (i % 3 === 0) { g.beginPath(); g.moveTo(x + 40, h); g.lineTo(x + 58, h - 52); g.lineTo(x + 76, h); g.fill(); g.beginPath(); g.moveTo(x + 46, h - 18); g.lineTo(x + 58, h - 62); g.lineTo(x + 70, h - 18); g.fill(); } }
    }
    return c;
  }
  function makeVignette(w) {
    const VH = SH.VIEW_H, c = canvas(w, VH), g = c.getContext('2d');
    const gr = g.createRadialGradient(w / 2, VH / 2, 120, w / 2, VH / 2, w * 0.62);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(3,3,12,0.55)');
    g.fillStyle = gr; g.fillRect(0, 0, w, VH);
    return c;
  }

  THEMES.winter.gstyle = 'earth'; THEMES.dusk.gstyle = 'earth'; THEMES.thornwood.gstyle = 'earth'; THEMES.deep.gstyle = 'rock'; THEMES.mountain.gstyle = 'strata'; THEMES.city.gstyle = 'brick';
  function groundTile(g, T, style, x, y, tx, ty, depth, TS) {
    const H = (a, b) => { let h = (tx * 73856093) ^ (ty * 19349663) ^ (a * 83492791) ^ ((b || 0) * 2654435761); h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
    const lift = [1.42, 1.24, 1.12, 1.05, 1][depth], base = SH.shade(T.speck, lift);   // the ground stays a step quieter than the people on it
    if (style === 'brick') {   // two courses a tile, joints staggered, each stone lit top-left and dark bottom-right
      for (let row = 0; row < 2; row++) {
        const by = y + row * 12, off = ((ty * 2 + row) % 2) * 12 + ((tx * 7 + ty * 3) % 3) * 2;
        for (let bx = x - 24 + (off % 24); bx < x + TS; bx += 24) {
          const x0 = Math.max(x, bx), x1 = Math.min(x + TS, bx + 24); if (x1 <= x0) continue;
          const tone = 0.86 + ((((bx * 13 + by * 7) % 5) + 5) % 5) * 0.07;
          g.fillStyle = SH.shade(base, tone); g.fillRect(x0, by, x1 - x0, 12);
          g.fillStyle = SH.shade(base, tone * 1.3); g.fillRect(x0, by, x1 - x0, 1); if (bx >= x) g.fillRect(bx, by, 1, 11);
          g.fillStyle = T.ground; g.fillRect(x0, by + 11, x1 - x0, 1); if (bx + 23 < x + TS && bx + 23 >= x) g.fillRect(bx + 23, by, 1, 12);
        }
      }
      if (H(1) < 0.25) { g.fillStyle = T.ground; const cx0 = x + 3 + ((H(2) * 14) | 0), cy0 = y + 2 + ((H(3) * 14) | 0); g.fillRect(cx0, cy0, 1, 4); g.fillRect(cx0 + 1, cy0 + 3, 1, 3); }
    } else if (style === 'earth') {   // packed soil in soft bands, buried stones, roots near the top
      g.fillStyle = SH.shade(base, 0.8); g.fillRect(x, y, TS, TS);
      for (let i = 0; i < 4; i++) { g.fillStyle = SH.shade(base, 0.72 + H(10 + i) * 0.22); g.fillRect(x, y + i * 6 + ((tx + i) % 2), TS, 3); }
      for (let i = 0; i < 7; i++) { g.fillStyle = SH.shade(base, H(20 + i) < 0.5 ? 1.25 : 0.55); g.fillRect(x + ((H(30 + i) * TS) | 0), y + ((H(40 + i) * TS) | 0), 1 + (H(50 + i) * 2 | 0), 1); }
      const n = H(60) < 0.55 ? 1 : H(60) < 0.8 ? 2 : 0;
      for (let i = 0; i < n; i++) {
        const w = 5 + (H(61 + i) * 8 | 0), h = 4 + (H(63 + i) * 4 | 0), sx = x + 1 + (H(65 + i) * (TS - w - 2) | 0), sy = y + 2 + (H(67 + i) * (TS - h - 4) | 0), tone = 1.05 + H(69 + i) * 0.5;
        g.fillStyle = T.ground; g.fillRect(sx - 1, sy, w + 2, h + 1); g.fillRect(sx, sy - 1, w, h + 2);
        g.fillStyle = SH.shade(base, tone); g.fillRect(sx, sy, w, h); g.fillRect(sx + 1, sy - 0, w - 2, h);
        g.fillStyle = SH.shade(base, tone * 1.4); g.fillRect(sx + 1, sy, w - 3, 1); g.fillRect(sx, sy + 1, 1, h - 2);
        g.fillStyle = SH.shade(base, tone * 0.6); g.fillRect(sx + 1, sy + h - 1, w - 1, 1);
      }
      if (depth <= 1 && H(70) < 0.6) {   // a root working down through the soil
        g.fillStyle = SH.shade(base, 1.5); let rx = x + 2 + (H(71) * 18 | 0);
        for (let ry = 0; ry < TS; ry += 2) { rx += H(72, ry) < 0.4 ? -1 : H(72, ry) > 0.7 ? 1 : 0; g.fillRect(rx, y + ry, depth === 0 ? 2 : 1, 2); }
      }
    } else if (style === 'rock') {   // boulders: each tile is split into two to four stones of different sizes
      g.fillStyle = SH.shade(T.ground, 0.8); g.fillRect(x, y, TS, TS);
      const vx = 8 + (H(1) * 3 | 0) * 4, hy1 = 8 + (H(2) * 3 | 0) * 4, hy2 = 8 + (H(3) * 3 | 0) * 4;
      const stones = [[0, 0, vx, H(4) < 0.35 ? TS : hy1], [vx, 0, TS - vx, H(5) < 0.35 ? TS : hy2]];
      if (stones[0][3] < TS) stones.push([0, hy1, vx, TS - hy1]); if (stones[1][3] < TS) stones.push([vx, hy2, TS - vx, TS - hy2]);
      stones.forEach((st, i) => {
        const tone = 0.8 + H(6 + i) * 0.5, sx = x + st[0], sy = y + st[1], w = st[2] - 1, h = st[3] - 1;
        g.fillStyle = SH.shade(base, tone); g.fillRect(sx + 1, sy, w - 1, h); g.fillRect(sx, sy + 1, w + 1 - 1, h - 2);
        g.fillStyle = SH.shade(base, tone * 1.45); g.fillRect(sx + 1, sy, w - 3, 1); g.fillRect(sx, sy + 1, 1, Math.max(1, h - 4));
        g.fillStyle = SH.shade(base, tone * 0.6); g.fillRect(sx + 2, sy + h - 1, w - 2, 1); g.fillRect(sx + w - 1, sy + 2, 1, h - 3);
        if (H(12 + i) < 0.3) { g.fillStyle = SH.shade(base, tone * 0.55); g.fillRect(sx + 2 + (H(14 + i) * (w - 5) | 0), sy + 2, 1, Math.min(h - 3, 4)); }
      });
      if (depth <= 1) for (let i = 0; i < 4; i++) if (H(20 + i) < 0.5) { g.fillStyle = H(24 + i) < 0.5 ? T.grassDark : T.edgeMid; g.fillRect(x + (H(28 + i) * 22 | 0), y + (H(32 + i) * (depth ? 22 : 9) | 0), 2, 1); }   // moss
    } else {   // strata: the mountain's rock lies in tilted layers, with a crack here and there
      let yy = 0, i = 0;
      while (yy < TS) {
        const h = 4 + ((((ty * 4 + i) * 7) % 3 + 3) % 3), tone = 0.7 + ((((ty * 4 + i) * 5) % 4 + 4) % 4) * 0.14, sl = (tx % 3) - 1;
        g.fillStyle = SH.shade(base, tone); g.fillRect(x, y + yy, TS, h);
        g.fillStyle = SH.shade(base, tone * 1.35); g.fillRect(x, y + yy + (sl > 0 ? 1 : 0), 12, 1); g.fillRect(x + 12, y + yy + (sl < 0 ? 1 : 0), 12, 1);
        if (H(40 + i) < 0.3) { g.fillStyle = SH.shade(base, tone * 0.6); g.fillRect(x + (H(44 + i) * 20 | 0), y + yy + 1, 5 + (H(48 + i) * 6 | 0), 1); }
        yy += h; i++;
      }
      if (H(60) < 0.3) { g.fillStyle = T.ground; let cx0 = x + 4 + (H(61) * 14 | 0); for (let cy0 = 0; cy0 < 16; cy0 += 3) { g.fillRect(cx0, y + 3 + cy0, 1, 3); cx0 += H(62, cy0) < 0.5 ? -1 : 1; } }
    }
  }
  function makeLevel(r, T) {
    const TS = SH.TILE, c = canvas(r.pxW, r.pxH), g = c.getContext('2d'), rand = rng(21);
    const get = (x, y) => r.get(x, y);
    const solid = (x, y) => get(x, y) === SH.T_SOLID;
    // a room that changes place (city -> mountain) changes its ground with it
    const zones = r.def.zones, themeAt = tx => { if (!zones) return THEMES[r.def.theme]; let z = zones[0]; for (const q of zones) if (tx >= q.x) z = q; return THEMES[z.theme]; };
    for (let ty = 0; ty < r.h; ty++) for (let tx = 0; tx < r.w; tx++) {
      const t = get(tx, ty), x = tx * TS, y = ty * TS;
      T = themeAt(tx);
      if (t === SH.T_SOLID) {
        g.fillStyle = T.ground; g.fillRect(x, y, TS, TS);
        {   // what the ground is made of depends on where you are: laid brick in the city, earth and stones in the
            // woods, boulders Under the Mountain, layered rock on the mountain. Near open air it is lighter.
          let depth = 0; while (depth < 4 && solid(tx, ty - depth - 1) && ty - depth - 1 >= 0) depth++;
          const d = r.def, inCity = d.cityFrom != null && tx >= d.cityFrom - 1 && (d.cityTo == null || tx <= d.cityTo + 1);
          const style = inCity ? 'brick' : (T.gstyle || 'brick');
          groundTile(g, T, style, x, y, tx, ty, depth, TS);
          if (depth === 0 && !(ty > 0 && solid(tx, ty - 1))) { g.fillStyle = 'rgba(0,0,0,0.28)'; g.fillRect(x, y + 4, TS, 3); }   // shadow under the lip
        }
        const openUp = !solid(tx, ty - 1) && ty > 0, openL = !solid(tx - 1, ty), openR = !solid(tx + 1, ty), openDown = !solid(tx, ty + 1) && ty < r.h - 1;
        if (openL) { g.fillStyle = T.side; g.fillRect(x, y, 2, TS); }
        if (openR) { g.fillStyle = T.side; g.fillRect(x + TS - 2, y, 2, TS); }
        if (openDown) { // a roof edge: hanging roots
          g.fillStyle = T.side; g.fillRect(x, y + TS - 2, TS, 2);
          if (rand() < 0.5) { g.fillStyle = T.grassDark; g.fillRect(x + ((rand() * TS) | 0), y + TS, 1, 3 + ((rand() * 8) | 0)); }
        }
        if (openUp) {
          g.fillStyle = T.edgeMid; g.fillRect(x, y + 2, TS, 2);
          g.fillStyle = T.edgeLight; g.fillRect(x, y, TS, 2);
          if (T.snow) {   // a real cap of snow: thick, with an uneven underside
            g.fillStyle = T.edgeLight; g.fillRect(x, y, TS, 4);
            for (let i = 0; i < TS; i += 3) { const dh = ((tx * 5 + i * 7) % 4); g.fillStyle = T.edgeLight; g.fillRect(x + i, y + 4, 3, dh); g.fillStyle = T.edgeMid; g.fillRect(x + i, y + 4 + dh, 3, 1); }
          }
          for (let i = 0; i < 5; i++) {
            const gx = x + ((rand() * TS) | 0), gh = 1 + ((rand() * 4) | 0);
            g.fillStyle = rand() < 0.5 ? T.grass : T.grassDark; g.fillRect(gx, y - gh, 1, gh);
          }
          // Gold glint on a ledge that drops into a pit: "careful, edge here".
          const pitL = openL && r.groundY(tx - 1, ty) === null, pitR = openR && r.groundY(tx + 1, ty) === null;
          if (pitL) { g.fillStyle = PAL.gold; g.fillRect(x, y, 5, 2); g.fillRect(x, y, 2, 6); }
          if (pitR) { g.fillStyle = PAL.gold; g.fillRect(x + TS - 5, y, 5, 2); g.fillRect(x + TS - 2, y, 2, 6); }
        }
      } else if (t === SH.T_ONEWAY) {
        g.fillStyle = PAL.plank; g.fillRect(x, y, TS, 7);
        g.fillStyle = PAL.plankTop; g.fillRect(x, y, TS, 2);
        g.fillStyle = '#17132a'; g.fillRect(x + 2, y + 7, 2, 4); g.fillRect(x + TS - 4, y + 7, 2, 4);
      } else if (t === SH.T_THORNS) {
        const glow = g.createLinearGradient(0, y - 8, 0, y + TS); glow.addColorStop(0, 'rgba(255,60,100,0)'); glow.addColorStop(1, 'rgba(255,60,100,0.22)');
        g.fillStyle = glow; g.fillRect(x, y - 8, TS, TS + 8);
        g.fillStyle = PAL.thornDark; g.fillRect(x, y + TS - 6, TS, 6);
        for (let i = 0; i < 4; i++) {
          const bx = x + i * 6 + rand() * 3, h = 9 + rand() * 9;
          g.fillStyle = PAL.thornMid; g.beginPath(); g.moveTo(bx, y + TS); g.lineTo(bx + 3, y + TS - h); g.lineTo(bx + 6, y + TS); g.fill();
          g.fillStyle = PAL.thornTip; g.fillRect(bx + 2, y + TS - h, 2, 3);
        }
      }
    }
    // props: the things that make a place look lived in (data in rooms.js)
    for (const p of r.def.props || []) {
      const fn = PROPS[p.t]; if (!fn) continue;
      const px = p.x * TS, top = p.t === 'chain' || p.t === 'stal' ? ceilY(r, Math.floor(p.x)) : r.groundY(Math.floor(p.x), p.from || 0);
      if (top != null) fn(g, Math.round(px), top, p, themeAt(Math.floor(p.x)), rng(Math.floor(p.x * 31) + 5));
    }
    return c;
  }
  function ceilY(r, tx) { let ty = 0; while (ty < r.h && r.get(tx, ty) === SH.T_SOLID) ty++; return ty * SH.TILE; }

  // Each prop draws at (x, y) where y is the ground (or the ceiling, for hanging things).
  const PROPS = {
    log(g, x, y, p) { const w = (p.w || 2) * SH.TILE, h = SH.TILE; g.fillStyle = '#4a3020'; g.fillRect(x, y, w, h); g.fillStyle = '#5e3e28'; for (let i = 3; i < h; i += 6) g.fillRect(x + 4, y + i, w - 8, 2);
      g.fillStyle = '#7a5636'; g.beginPath(); g.ellipse(x + w - 3, y + h / 2, 5, h / 2, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#4a3020'; g.beginPath(); g.ellipse(x + w - 3, y + h / 2, 2.5, h / 4, 0, 0, Math.PI * 2); g.stroke();
      g.fillStyle = '#ffffff'; g.fillRect(x, y, w - 4, 3); g.fillRect(x + 6, y + 3, 10, 2); },
    boulder(g, x, y, p) { const w = (p.w || 2) * SH.TILE, h = (p.h || 2) * SH.TILE; g.fillStyle = '#3a4258'; g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + 2, y + 8); g.lineTo(x + w * 0.3, y); g.lineTo(x + w * 0.8, y + 3); g.lineTo(x + w, y + h * 0.5); g.lineTo(x + w, y + h); g.fill();
      g.fillStyle = '#4c566e'; g.beginPath(); g.moveTo(x + 4, y + 10); g.lineTo(x + w * 0.3, y + 2); g.lineTo(x + w * 0.6, y + 6); g.lineTo(x + w * 0.4, y + h * 0.5); g.fill(); g.fillStyle = '#ffffff'; g.fillRect(x + w * 0.25, y, w * 0.5, 3); },
    bush(g, x, y, p, T) { g.fillStyle = T.midC; g.beginPath(); g.ellipse(x, y - 5, 13, 8, 0, 0, Math.PI * 2); g.ellipse(x + 9, y - 3, 9, 6, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = T.grass; g.fillRect(x - 8, y - 12, 10, 2); g.fillRect(x + 6, y - 8, 7, 2); },
    drift(g, x, y, p, T) { g.fillStyle = T.edgeLight; g.beginPath(); g.ellipse(x, y, 20, 6, 0, Math.PI, 0); g.fill(); g.fillStyle = T.edgeMid; g.fillRect(x - 12, y - 1, 24, 1); },
    pine(g, x, y, p, T) { g.fillStyle = '#2a1c18'; g.fillRect(x - 1, y - 8, 3, 8); g.fillStyle = T.midC; for (let k = 0; k < 3; k++) { const yy = y - 8 - k * 9, w = 11 - k * 3; g.beginPath(); g.moveTo(x, yy - 12); g.lineTo(x - w, yy); g.lineTo(x + w + 1, yy); g.fill(); g.fillStyle = T.snow ? '#ffffff' : T.grass; g.fillRect(x - w + 3, yy - 2, w * 2 - 5, 1); g.fillStyle = T.midC; } },
    deadtree(g, x, y, p, T) { g.strokeStyle = T.midC; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2, y - 30); g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(x + 1, y - 18); g.lineTo(x - 12, y - 32); g.moveTo(x + 2, y - 26); g.lineTo(x + 14, y - 40); g.moveTo(x + 2, y - 30); g.lineTo(x - 4, y - 46); g.moveTo(x + 9, y - 34); g.lineTo(x + 18, y - 32); g.stroke(); g.lineWidth = 1; },
    bones(g, x, y) { g.fillStyle = '#c8ccd0'; g.fillRect(x - 10, y - 3, 20, 2); for (let i = 0; i < 4; i++) { g.fillRect(x - 8 + i * 5, y - 10 + (i % 2), 2, 8); } g.fillRect(x + 12, y - 7, 6, 6); g.fillStyle = '#1a1a20'; g.fillRect(x + 14, y - 5, 2, 2); },
    shroom(g, x, y, p, T, r) { for (let i = 0; i < 3; i++) { const sx = x + i * 7 - 7, h = 5 + ((r() * 6) | 0), col = i % 2 ? '#ffb8c8' : '#bff0d0'; const gl = g.createRadialGradient(sx, y - h, 1, sx, y - h, 14); gl.addColorStop(0, i % 2 ? 'rgba(255,184,200,0.35)' : 'rgba(190,240,208,0.35)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.fillRect(sx - 14, y - h - 14, 28, 28); g.fillStyle = '#d8e8dc'; g.fillRect(sx, y - h, 1, h); g.fillStyle = col; g.fillRect(sx - 2, y - h - 2, 5, 3); } },
    chain(g, x, y, p) { const n = (p.len || 4) * 4; g.fillStyle = '#3a4640'; for (let i = 0; i < n; i++) g.fillRect(x + (i % 2), y + i * 6, 3, 5); g.fillStyle = '#566a60'; g.fillRect(x - 2, y + n * 6, 7, 5); },
    stal(g, x, y, p, T) { const h = (p.len || 2) * 12; g.fillStyle = T.ground; g.beginPath(); g.moveTo(x - 7, y); g.lineTo(x, y + h); g.lineTo(x + 7, y); g.fill(); g.fillStyle = T.side; g.fillRect(x - 6, y, 2, 4); },
    banner(g, x, y, p) { g.fillStyle = '#16142c'; g.fillRect(x - 1, y - 70, 3, 70); g.fillRect(x - 1, y - 70, 18, 2); g.fillStyle = p.c || '#3a2a7a'; g.beginPath(); g.moveTo(x + 3, y - 68); g.lineTo(x + 17, y - 68); g.lineTo(x + 17, y - 38); g.lineTo(x + 10, y - 44); g.lineTo(x + 3, y - 38); g.fill();
      g.fillStyle = '#ffd27a'; g.fillRect(x + 9, y - 60, 2, 8); g.fillRect(x + 6, y - 57, 8, 2); },
    crate(g, x, y) { g.fillStyle = '#5a3e2a'; g.fillRect(x - 9, y - 18, 18, 18); g.fillStyle = '#7a5638'; g.fillRect(x - 9, y - 18, 18, 2); g.fillRect(x - 9, y - 10, 18, 2); g.fillStyle = '#3a2618'; g.fillRect(x - 9, y - 18, 2, 18); g.fillRect(x + 7, y - 18, 2, 18); },
    barrel(g, x, y) { g.fillStyle = '#4a3424'; g.fillRect(x - 7, y - 20, 14, 20); g.fillStyle = '#8a8a96'; g.fillRect(x - 7, y - 16, 14, 2); g.fillRect(x - 7, y - 6, 14, 2); g.fillStyle = '#6a4c34'; g.fillRect(x - 5, y - 20, 10, 2); },
    rack(g, x, y) { g.fillStyle = '#3a2a1e'; g.fillRect(x - 14, y - 26, 3, 26); g.fillRect(x + 11, y - 26, 3, 26); g.fillRect(x - 14, y - 22, 28, 3); g.fillStyle = '#c8d2e2'; for (let i = 0; i < 3; i++) { g.fillRect(x - 8 + i * 8, y - 44, 2, 40); g.fillRect(x - 9 + i * 8, y - 48, 4, 6); } },
    fence(g, x, y, p) { const w = (p.w || 6) * SH.TILE; g.fillStyle = '#3a2a1e'; g.fillRect(x, y - 22, w, 3); g.fillRect(x, y - 12, w, 3); for (let i = 0; i <= w; i += 24) g.fillRect(x + i - 2, y - 28, 4, 28); },
    cairn(g, x, y) { g.fillStyle = '#4c566e'; g.fillRect(x - 9, y - 6, 18, 6); g.fillRect(x - 6, y - 12, 13, 6); g.fillRect(x - 3, y - 17, 7, 5); g.fillStyle = '#ffffff'; g.fillRect(x - 3, y - 18, 7, 2); },
  };

  // ---------------------------------------------------------------- per frame
  D.frame = function (ctx, w) {
    const vw = layers.viewW, cam = w.cam, fx = SH.fx, t = w.time, VH = SH.VIEW_H;
    let sx = 0, sy = 0;
    if (fx.shake > 0) { sx = Math.round((Math.random() - 0.5) * fx.shake * 2); sy = Math.round((Math.random() - 0.5) * fx.shake * 2); }
    const cx = Math.round(cam.x), cy = Math.round(cam.y);
    const def = w.room.def;

    // backdrop: one theme, or two blended where the room changes place
    const zones = def.zones || [{ x: 0, theme: def.theme }];
    const mid = (cx + vw / 2) / SH.TILE;
    let zi = 0; for (let i = 0; i < zones.length; i++) if (mid >= zones[i].x - 6) zi = i;
    // the camera director's zoom: everything in the world is scaled about the point it is looking at
    const zoom = cam.zoom || 1, zfx = cam.sx != null ? cam.sx : vw / 2, zfy = cam.sy != null ? cam.sy : VH * 0.6;
    ctx.save();
    if (zoom !== 1) { ctx.translate(zfx, zfy); ctx.scale(zoom, zoom); if (cam.roll) ctx.rotate(cam.roll); ctx.translate(-zfx, -zfy); }
    {   // one backdrop, unless the camera is in the stretch where one place turns into the next
      const k = zi > 0 ? Math.min(1, (mid - (zones[zi].x - 6)) / 12) : 0;
      if (k < 1) drawBackdrop(ctx, w, zones[Math.max(0, zi - 1)].theme, cx, cy, vw, VH, 1);
      if (zi > 0) drawBackdrop(ctx, w, zones[zi].theme, cx, cy, vw, VH, k);
    }

    ctx.save();
    ctx.translate(-cx + sx, -cy + sy);
    if (def.cityFrom != null) drawStreet(ctx, w, cx, vw, t);
    if (def.arch != null) drawArch(ctx, w, def.arch);
    if (def.cottage != null) drawCottage(ctx, w, def.cottage, t);
    ctx.drawImage(layers.level, cx, cy, vw, VH, cx, cy, vw, VH);
    if (def.house) drawHouse(ctx, w, def.house);
    if (def.mural) drawMural(ctx, w, def.mural, t);
    for (const g of w.gates) drawGate(ctx, g);
    for (const t of w.thorns || []) if (t.solid) drawThornWall(ctx, t, w.time);
    if (def.exitLight != null) drawExitLight(ctx, def.exitLight, t);
    for (const l of w.lanterns) drawLantern(ctx, l, t);
    for (const m of w.motes || []) {
      if (m.got || m.x < cx - 20 || m.x > cx + vw + 20) continue;
      const my = m.y + Math.sin(t * 0.08 + m.x * 0.05) * 2, tw = 0.6 + 0.4 * Math.sin(t * 0.15 + m.x);
      ctx.globalAlpha = 0.25 * tw; ctx.fillStyle = '#ffd27a'; ctx.fillRect(m.x - 5, my - 5, 10, 10);
      ctx.globalAlpha = 1; ctx.fillStyle = '#ffd27a'; ctx.fillRect(m.x - 1, my - 4, 3, 9); ctx.fillRect(m.x - 4, my - 1, 9, 3);
      ctx.fillStyle = '#fff6d8'; ctx.fillRect(m.x - 1, my - 1, 3, 3);
    }
    for (const n of w.npcs) (SH.people.has(n.id) ? SH.people.draw : SH.art.npc)(ctx, n, t);
    for (const e of w.things) {
      if (e.x < cx - 80 || e.x > cx + vw + 80) continue;
      if (e.kind === 'thornSprite') drawSprite(ctx, e, t);
      else if (e.kind === 'dummy') drawDummy(ctx, e);
      else if (e.kind === 'bulb') drawBulb(ctx, e, t);
      else if (e.kind === 'stag') drawStag(ctx, e, t);
      else if (e.kind === 'brazier') drawBrazier(ctx, e, t);
      else if (e.kind === 'wyrm') drawWyrm2(ctx, e, t);
      else if (e.kind === 'pickup' || e.kind === 'snare' || e.kind === 'target' || e.kind === 'wolf') drawWoods(ctx, e, t);
    }
    for (const f of w.fireballs || []) {
      const R = f.big ? 34 : 16;
      const gl = ctx.createRadialGradient(f.x, f.y, 1, f.x, f.y, R); gl.addColorStop(0, 'rgba(255,200,110,0.9)'); gl.addColorStop(1, 'rgba(255,120,40,0)');
      ctx.fillStyle = gl; ctx.fillRect(f.x - R, f.y - R, R * 2, R * 2);
      if (f.big) {   // a flame wave: a tall burning crescent
        ctx.save(); ctx.translate(f.x, f.y); ctx.scale(f.dir, 1);
        const fl = Math.sin(t * 0.9) * 2;
        ctx.fillStyle = '#ff8a3a'; ctx.beginPath(); ctx.moveTo(-10, -24 - fl); ctx.quadraticCurveTo(22, 0, -10, 24 + fl); ctx.quadraticCurveTo(4, 0, -10, -24 - fl); ctx.fill();
        ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.moveTo(-6, -18); ctx.quadraticCurveTo(17, 0, -6, 18); ctx.quadraticCurveTo(6, 0, -6, -18); ctx.fill();
        ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.moveTo(-1, -10); ctx.quadraticCurveTo(13, 0, -1, 10); ctx.quadraticCurveTo(7, 0, -1, -10); ctx.fill();
        ctx.restore();
      } else {
        ctx.save(); ctx.translate(f.x, f.y); ctx.scale(f.dir, 1);
        ctx.fillStyle = '#ff8a3a'; ctx.beginPath(); ctx.moveTo(6, 0); ctx.quadraticCurveTo(0, -7, -14 - Math.sin(t * 0.8) * 3, 0); ctx.quadraticCurveTo(0, 7, 6, 0); ctx.fill();
        ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(1, 0, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    for (const sw of w.waves || []) {
      const k = Math.min(1, sw.life / 14), hgt = 20 + Math.sin(sw.t * 0.7) * 3;
      ctx.save(); ctx.translate(sw.x, sw.y); ctx.scale(sw.dir, 1); ctx.globalAlpha = k;
      ctx.fillStyle = '#0a0818'; ctx.beginPath(); ctx.moveTo(-17, 0); ctx.lineTo(-7, -hgt * 0.55 - 1); ctx.lineTo(-2, -5); ctx.lineTo(7, -hgt - 2); ctx.lineTo(13, 0); ctx.fill();
      ctx.fillStyle = '#8a96b8'; ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(-7, -hgt * 0.55); ctx.lineTo(-2, -4); ctx.lineTo(6, -hgt); ctx.lineTo(11, 0); ctx.fill();
      ctx.fillStyle = '#e8eef8'; ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(6, -hgt); ctx.lineTo(11, 0); ctx.fill();
      ctx.restore();
    }
    for (const r of w.rocks || []) {
      if (r.ground != null) { ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(r.x, r.ground - 1, 12, 3, 0, 0, Math.PI * 2); ctx.fill(); }
      if (r.warn <= 0) { ctx.fillStyle = '#5a6680'; ctx.fillRect(r.x - 9, r.y - 16, 18, 16); ctx.fillStyle = '#8a96b8'; ctx.fillRect(r.x - 9, r.y - 16, 18, 3); }
    }
    for (const a of w.arrows || []) {
      ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(Math.atan2(a.vy, a.vx)); ctx.globalAlpha = Math.min(1, a.life / 20);
      ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-14, -1, 14, 2); ctx.fillStyle = '#c8d0e0'; ctx.fillRect(0, -2, 4, 4); ctx.fillStyle = '#e8e0c8'; ctx.fillRect(-16, -2, 3, 4);
      ctx.restore();
    }
    for (const g of fx.ghosts) SH.wren.draw(ctx, w.player, { ghost: g });
    SH.wren.draw(ctx, w.player, {});
    if (w.wyrm && w.wyrm.on) drawWyrm(ctx, w.wyrm, cy, t);
    drawParticles(ctx, fx);
    ctx.restore();

    // the foreground: dark shapes close to the eye, sliding past faster than the world (depth, as in Hollow Knight)
    { const fgName = zones[zi].theme, fg = layers.fg[fgName] || (layers.fg[fgName] = makeForeground(fgName)), fxo = ((cx * 1.45) % fg.width + fg.width) % fg.width;
      ctx.globalAlpha = 0.9; for (let x0 = -fxo; x0 < vw; x0 += fg.width) ctx.drawImage(fg, Math.round(x0), Math.round(w.room.pxH - cy - fg.height + ((w.room.pxH - VH) - cy) * 0.35)); ctx.globalAlpha = 1; }
    if (!D.off.light) { const kk = zi > 0 ? Math.min(1, (mid - (zones[zi].x - 6)) / 12) : 0; drawLight(ctx, w, cx - sx, cy - sy, vw, VH, t, zones[Math.max(0, zi - 1)].theme, zones[zi].theme, kk); }
    ctx.restore();
    SH.arts.draw(ctx, w, vw, VH);
    // cinema bars slide in while people are talking
    w.letter = (w.letter || 0) + ((SH.game.state === 'talk' ? 1 : 0) - (w.letter || 0)) * 0.15;
    if (w.letter > 0.02) { const lh = Math.round(w.letter * 22); ctx.fillStyle = '#05050d'; ctx.fillRect(0, 0, vw, lh); ctx.fillRect(0, VH - lh, vw, lh); }
    ctx.drawImage(layers.vignette, 0, 0);
    if (fx.flash > 0) { ctx.fillStyle = fx.flashColor; ctx.globalAlpha = Math.min(1, fx.flash / 6); ctx.fillRect(0, 0, vw, VH); ctx.globalAlpha = 1; }
    if (fx.slowmo > 0) { ctx.fillStyle = 'rgba(120,190,255,0.10)'; ctx.fillRect(0, 0, vw, VH); }
    if (w.fade > 0) { ctx.fillStyle = w.fadeColor || '#05050d'; ctx.globalAlpha = Math.min(1, w.fade); ctx.fillRect(0, 0, vw, VH); ctx.globalAlpha = 1; }
  };

  function drawBackdrop(ctx, w, theme, cx, cy, vw, VH, alpha) {
    const T = THEMES[theme], L = layers.bg[theme], t = w.time;
    ctx.globalAlpha = alpha;
    ctx.drawImage(L.sky, 0, 0, vw, 360);
    if (T.stars) {
      for (const s of layers.stars) {
        const x = ((s.x - cx * s.sp) % 2400 + 2400) % 2400;
        if (x > vw) continue;
        ctx.globalAlpha = alpha * (0.45 + 0.55 * Math.abs(Math.sin(t * 0.03 + s.tw)));
        ctx.fillStyle = s.s > 1 ? PAL.star : PAL.starDim; ctx.fillRect(x, s.y - cy * 0.02, s.s, s.s);
      }
      ctx.globalAlpha = alpha;
    }
    if (w.room.def.cityGlowX != null) drawCity(ctx, w, vw, cx, cy);
    // Depth by air: each layer further away loses contrast and takes the colour of the sky; nearer layers are
    // darker, sharper and more detailed, and slide faster. (Atmospheric perspective + detail gradient + parallax.)
    const haze = (a, y0) => { if (D.off.haze) return; const key = theme + y0; let hc = layers.haze[key]; if (!hc) { hc = layers.haze[key] = canvas(4, VH); const hx = hc.getContext('2d'), hg = hx.createLinearGradient(0, y0, 0, VH); hg.addColorStop(0, 'rgba(0,0,0,0)'); hg.addColorStop(0.55, T.sky[2]); hg.addColorStop(1, T.sky[3]); hx.fillStyle = hg; hx.fillRect(0, 0, 4, VH); } ctx.globalAlpha = alpha * a; ctx.drawImage(hc, 0, 0, vw, VH); ctx.globalAlpha = alpha; };
    tile(ctx, L.far, cx * 0.12, 10 - cy * 0.08, vw);
    haze(0.5, 40);
    ctx.globalAlpha = alpha * 0.6; tile(ctx, L.mid, cx * 0.2 + 370, 6 - cy * 0.16, vw); ctx.globalAlpha = alpha;   // the same wood again, further off
    haze(0.42, 90);
    ctx.globalAlpha = alpha * 0.9; tile(ctx, L.mid, cx * 0.38, 30 - cy * 0.3, vw); ctx.globalAlpha = alpha;
    haze(0.2, 150);
    if (L.near) tile(ctx, L.near, cx * 0.62, 78 - cy * 0.55, vw);
    const mist = ctx.createLinearGradient(0, 180 - cy * 0.3, 0, VH);
    mist.addColorStop(0, 'rgba(0,0,0,0)'); mist.addColorStop(1, T.mist);
    ctx.fillStyle = mist; ctx.fillRect(0, 0, vw, VH);
    // shafts of light slanting down through the air (moonlight outdoors, a rose glow Under the Mountain)
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (D.off.shafts ? 0 : 5); i++) {
      const sx0 = ((i * 211 - cx * 0.22) % (vw + 260) + vw + 260) % (vw + 260) - 130, wd = 26 + (i * 17) % 30, a = alpha * (0.035 + 0.02 * Math.sin(t * 0.012 + i * 1.7));
      const sg = ctx.createLinearGradient(0, 0, 0, VH * 0.8); sg.addColorStop(0, 'rgba(' + (theme === 'deep' ? '255,150,180' : theme === 'city' ? '255,214,150' : '200,214,255') + ',' + a * 3 + ')'); sg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(sx0, 0); ctx.lineTo(sx0 + wd, 0); ctx.lineTo(sx0 + wd - 90, VH * 0.8); ctx.lineTo(sx0 - 110, VH * 0.8); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    // drifting motes
    for (let i = 0; i < (T.snow ? 70 : 22); i++) {
      const px = ((i * 137 + t * (0.15 + (i % 5) * 0.05) - cx * 0.6 + Math.sin(t * 0.02 + i) * 8) % (vw + 40) + vw + 40) % (vw + 40) - 20;
      const py = T.snow ? ((i * 53 + t * (0.5 + (i % 4) * 0.2) - cy * 0.5) % VH + VH) % VH : (i * 53 + Math.sin(t * 0.01 + i) * 20 - cy * 0.5 + 400) % VH;
      ctx.globalAlpha = alpha * (0.3 + 0.3 * Math.sin(t * 0.04 + i));
      ctx.fillStyle = T.motes[i % 2]; ctx.fillRect(px, py, 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  function tile(ctx, img, ox, oy, vw) {
    const iw = img.width; let x = -(((ox % iw) + iw) % iw);
    for (; x < vw; x += iw) ctx.drawImage(img, Math.round(x), Math.round(oy));
  }

  function drawCity(ctx, w, vw, cx, cy) {
    // Starhaven on the far horizon: the place you are working toward.
    const worldX = w.room.def.cityGlowX * SH.TILE;
    const x = Math.round(vw * 0.5 + (worldX - cx - vw * 0.5) * 0.06), y = 232 - cy * 0.05;
    if (x < -120 || x > vw + 120) return;
    const glow = ctx.createRadialGradient(x, y, 4, x, y, 110);
    glow.addColorStop(0, 'rgba(255,210,122,0.38)'); glow.addColorStop(1, 'rgba(255,210,122,0)');
    ctx.fillStyle = glow; ctx.fillRect(x - 120, y - 120, 240, 240);
    ctx.fillStyle = '#2a2558';
    const spires = [[-34, 18], [-24, 30], [-14, 22], [-6, 44], [4, 26], [12, 36], [22, 20], [30, 28]];
    for (const [dx, h] of spires) { ctx.fillRect(x + dx, y - h, 6, h + 20); ctx.beginPath(); ctx.moveTo(x + dx, y - h); ctx.lineTo(x + dx + 3, y - h - 8); ctx.lineTo(x + dx + 6, y - h); ctx.fill(); }
    ctx.fillStyle = PAL.gold;
    for (const [dx, h] of spires) for (let k = 6; k < h; k += 8) ctx.fillRect(x + dx + 2, y - h + k, 2, 2);
    const tw = 0.7 + 0.3 * Math.sin(w.time * 0.05);
    ctx.save(); ctx.globalAlpha *= tw; ctx.fillStyle = '#fff6d8';
    ctx.fillRect(x - 1, y - 74, 3, 3); ctx.fillRect(x - 5, y - 73, 11, 1); ctx.fillRect(x, y - 79, 1, 13);
    ctx.restore();
  }

  // ---------------------------------------------------------------- Starhaven pieces
  // House fronts along the street. Their windows light up as the street is restored (w.cityLight 0..1).
  function drawStreet(ctx, w, cx, vw, t) {
    const TS = SH.TILE, def = w.room.def, x0 = def.cityFrom * TS, x1 = (def.cityTo != null ? def.cityTo : def.house ? def.house.x0 : def.width) * TS;
    const gy = 16 * TS, light = w.cityLight || 0;
    if (!w.street) { // lay the street out once per room so it never shifts
      const r = rng(77); w.street = [];
      for (let x = x0; x < x1;) {
        const b = { x, bw: 70 + ((r() * 50) | 0), bh: 90 + ((r() * 70) | 0), hue: r(), wins: [] };
        for (let wy = gy - b.bh + 14; wy < gy - 26; wy += 22) for (let wx = x + 10; wx < x + b.bw - 22; wx += 22) b.wins.push({ wx, wy, k: r() });
        w.street.push(b); x += b.bw;
      }
    }
    for (const b of w.street) {
      const x = b.x, bw = b.bw, bh = b.bh;
      if (x + bw < cx - 20 || x > cx + vw + 20) continue;
      ctx.fillStyle = b.hue < 0.5 ? '#1a1838' : '#201c40'; ctx.fillRect(x, gy - bh, bw - 6, bh);
      ctx.fillStyle = '#2c2856'; ctx.beginPath(); ctx.moveTo(x - 4, gy - bh); ctx.lineTo(x + (bw - 6) / 2, gy - bh - 22); ctx.lineTo(x + bw - 2, gy - bh); ctx.fill();
      for (const { wx, wy, k } of b.wins) {
        const on = k < light * 1.1;
        ctx.fillStyle = on ? (Math.sin(t * 0.05 + wx) > -0.9 ? '#ffd98a' : '#e8b860') : '#0e0c22';
        ctx.fillRect(wx, wy, 9, 12);
        if (on) { ctx.globalAlpha = 0.18; ctx.fillStyle = '#ffd27a'; ctx.fillRect(wx - 6, wy - 6, 21, 24); ctx.globalAlpha = 1; }
      }
      ctx.fillStyle = '#0c0a1e'; ctx.fillRect(x + (bw - 6) / 2 - 7, gy - 26, 14, 26);
    }
    // street lamps
    for (let lx = x0 + 60; lx < x1; lx += 200) {
      const on = light > 0.3;
      if (on) { const g = ctx.createRadialGradient(lx, gy - 54, 2, lx, gy - 54, 50); g.addColorStop(0, 'rgba(255,214,130,0.4)'); g.addColorStop(1, 'rgba(255,214,130,0)'); ctx.fillStyle = g; ctx.fillRect(lx - 50, gy - 104, 100, 100); }
      ctx.fillStyle = '#16142c'; ctx.fillRect(lx - 1, gy - 50, 3, 50); ctx.fillRect(lx - 5, gy - 58, 11, 8);
      ctx.fillStyle = on ? PAL.warm : '#2a2850'; ctx.fillRect(lx - 3, gy - 56, 7, 5);
    }
  }
  function drawArch(ctx, w, ax) {
    const TS = SH.TILE, x = ax * TS, gy = 16 * TS;
    ctx.fillStyle = '#1e1a3c';
    ctx.fillRect(x - 40, gy - 120, 16, 120); ctx.fillRect(x + 24, gy - 120, 16, 120);
    ctx.beginPath(); ctx.moveTo(x - 44, gy - 116); ctx.quadraticCurveTo(x, gy - 170, x + 44, gy - 116); ctx.lineTo(x + 44, gy - 104); ctx.quadraticCurveTo(x, gy - 150, x - 44, gy - 104); ctx.fill();
    ctx.fillStyle = PAL.gold; ctx.fillRect(x - 1, gy - 150, 3, 10); ctx.fillRect(x - 5, gy - 146, 11, 2);
    ctx.font = 'bold 9px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#cfc4ff'; ctx.fillText('STARHAVEN', x, gy - 128);
  }
  function drawHouse(ctx, w, h) {
    const TS = SH.TILE, x0 = h.x0 * TS, x1 = h.x1 * TS, top = h.top * TS, gy = 16 * TS;
    ctx.fillStyle = '#1c1a3a'; ctx.fillRect(x0, top + 4, x1 - x0, gy - top - 4);
    ctx.fillStyle = '#d6ccff'; ctx.fillRect(x0, top, x1 - x0, 2);
    const light = w.cityLight || 0;
    for (let x = x0 + 18; x < x1 - 30; x += 40) { ctx.fillStyle = light > 0.5 ? '#ffd98a' : '#0e0c22'; ctx.fillRect(x, top + 26, 14, 18); ctx.fillRect(x, top + 74, 14, 18); }
    ctx.fillStyle = '#3a2a1e'; ctx.fillRect(x1 - 52, gy - 40, 22, 40); ctx.fillStyle = PAL.gold; ctx.fillRect(x1 - 34, gy - 22, 2, 2);
    // rooftop rail and a lantern
    ctx.fillStyle = '#2a2650'; for (let x = x0; x < x1; x += 10) ctx.fillRect(x, top - 10, 2, 10); ctx.fillRect(x0, top - 12, x1 - x0, 2);
  }
  function drawMural(ctx, w, m, t) {
    const TS = SH.TILE, x = m.x * TS, wd = m.w * TS, gy = 16 * TS, ht = 96, y = gy - ht - 6;
    ctx.fillStyle = '#2a2648'; ctx.fillRect(x - 4, y - 4, wd + 8, ht + 10);
    ctx.fillStyle = '#4a4668'; ctx.fillRect(x, y, wd, ht);
    for (let by = y; by < y + ht; by += 12) { ctx.fillStyle = '#3e3a5c'; ctx.fillRect(x, by, wd, 1); }
    const k = w.muralProgress || 0;
    if (k > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, wd * k, ht); ctx.clip();
      const g = ctx.createLinearGradient(0, y, 0, y + ht); g.addColorStop(0, '#1a2a7a'); g.addColorStop(0.6, '#6a3a9a'); g.addColorStop(1, '#ff9a7a');
      ctx.fillStyle = g; ctx.fillRect(x, y, wd, ht);
      ctx.fillStyle = '#fff6d8'; for (let i = 0; i < 14; i++) ctx.fillRect(x + (i * 37) % wd, y + 6 + (i * 13) % 40, 2, 2);
      ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.arc(x + wd * 0.75, y + 24, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a1438';
      for (let i = 0; i < 7; i++) { const bx = x + 8 + i * 15, bh = 20 + (i % 3) * 12; ctx.fillRect(bx, y + ht - bh, 11, bh); }
      ctx.fillStyle = '#ffd27a'; for (let i = 0; i < 7; i++) ctx.fillRect(x + 12 + i * 15, y + ht - 14, 3, 3);
      ctx.restore();
      if (k < 1) { ctx.fillStyle = '#fff6d8'; ctx.fillRect(x + wd * k - 1, y, 2, ht); }
    }
    if (w.muralNear && k < 1) {
      const bob = Math.round(Math.sin(t * 0.1) * 2);
      ctx.fillStyle = PAL.gold; ctx.fillRect(x + wd / 2 - 1, y - 18 + bob, 3, 8); ctx.fillRect(x + wd / 2 - 1, y - 8 + bob, 3, 3);
    }
  }
  function drawGate(ctx, g) {
    if (!g.closed && (g.lift || 0) >= 1) return;
    const TS = SH.TILE, x = g.x * TS, top = g.top * TS, bot = g.bottom * TS, lift = (g.lift || 0) * (bot - top);
    ctx.fillStyle = '#3a2a1e'; ctx.fillRect(x + 2, top - lift, TS - 4, bot - top);
    ctx.fillStyle = '#5a4430'; for (let y = top - lift + 6; y < bot - lift; y += 14) ctx.fillRect(x + 2, y, TS - 4, 3);
    ctx.fillStyle = '#ffd27a'; ctx.fillRect(x + TS / 2 - 2, bot - lift - 40, 4, 4);
  }
  function drawExitLight(ctx, ex, t) {
    const TS = SH.TILE, x = ex * TS + TS / 2;
    const g = ctx.createRadialGradient(x, 300, 6, x, 300, 150 + Math.sin(t * 0.05) * 10);
    g.addColorStop(0, 'rgba(255,250,230,0.85)'); g.addColorStop(0.3, 'rgba(255,220,180,0.35)'); g.addColorStop(1, 'rgba(255,220,180,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 160, 140, 320, 280);
    ctx.fillStyle = 'rgba(255,252,240,0.9)'; ctx.fillRect(x - 10, 96, 20, 288);
  }
  function drawWyrm(ctx, wy, cy, t) {
    // the Deep Wyrm: a wall of dark coils with pale eyes, filling everything behind its front edge
    const x = wy.x, top = cy - 20, bot = cy + SH.VIEW_H + 20;
    ctx.fillStyle = '#020403'; ctx.fillRect(x - 2000, top, 2000, bot - top);
    ctx.beginPath(); ctx.moveTo(x, top);
    for (let y = top; y <= bot; y += 16) ctx.lineTo(x + 18 + Math.sin(y * 0.05 + t * 0.2) * 14, y);
    ctx.lineTo(x - 10, bot); ctx.fill();
    ctx.fillStyle = '#d6f0dc';
    const ey = cy + 150 + Math.sin(t * 0.07) * 10;
    ctx.fillRect(x - 6, ey, 10, 4); ctx.fillRect(x - 6, ey + 30, 10, 4);
    ctx.fillStyle = '#ff7a8a'; ctx.fillRect(x - 2, ey + 1, 3, 2); ctx.fillRect(x - 2, ey + 31, 3, 2);
  }

  function drawParticles(ctx, fx) {
    for (const r of fx.rings) {
      ctx.globalAlpha = r.life / r.max; ctx.strokeStyle = r.color; ctx.lineWidth = r.width;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
    }
    for (const p of fx.parts) {
      const a = Math.min(1, p.life / p.max * 1.4);
      if (p.glow) { ctx.globalAlpha = a * 0.3; ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 3, p.size * 3); }
      ctx.globalAlpha = a; ctx.fillStyle = p.color; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.lineCap = 'round';
    for (const l of fx.lines) {
      const k = l.life / l.max, c = Math.cos(l.ang), sn = Math.sin(l.ang);
      ctx.globalAlpha = k; ctx.strokeStyle = l.slash ? '#ffffff' : '#ffe9a8'; ctx.lineWidth = l.slash ? 3 * k + 1 : 2;
      ctx.beginPath();
      if (l.slash) { ctx.moveTo(l.x - c * l.len * (1.2 - k * 0.4), l.y - sn * l.len * (1.2 - k * 0.4)); ctx.lineTo(l.x + c * l.len * (1.2 - k * 0.4), l.y + sn * l.len * (1.2 - k * 0.4)); }
      else { ctx.moveTo(l.x + c * l.dist, l.y + sn * l.dist); ctx.lineTo(l.x + c * (l.dist + l.len * k), l.y + sn * (l.dist + l.len * k)); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center'; ctx.font = 'bold 11px system-ui, sans-serif';
    for (const wd of fx.words) {
      ctx.globalAlpha = Math.min(1, wd.life / 15);
      ctx.fillStyle = '#05050d'; ctx.fillText(wd.text, wd.x + 1, wd.y + 1);
      ctx.fillStyle = wd.color; ctx.fillText(wd.text, wd.x, wd.y);
    }
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- props
  function drawLantern(ctx, l, t) {
    const x = l.px, y = l.py, big = l.end;
    const h = big ? 58 : 42;
    if (l.lit) {
      const r = (big ? 70 : 46) + Math.sin(t * 0.08 + x) * 3;
      const g = ctx.createRadialGradient(x, y - h, 2, x, y - h, r);
      g.addColorStop(0, 'rgba(255,214,130,0.55)'); g.addColorStop(1, 'rgba(255,214,130,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, y - h - r, r * 2, r * 2);
    }
    ctx.fillStyle = '#1b1830'; ctx.fillRect(x - 2, y - h + 6, 4, h - 6);
    ctx.fillRect(x - 6, y - 2, 12, 2);
    ctx.fillStyle = '#1b1830'; ctx.fillRect(x - 7, y - h - 8, 14, 16);
    ctx.fillStyle = l.lit ? (Math.sin(t * 0.2 + x) > -0.8 ? PAL.warm : PAL.gold) : '#3a3560';
    ctx.fillRect(x - 5, y - h - 6, 10, 12);
    ctx.fillStyle = '#1b1830'; ctx.fillRect(x - 1, y - h - 6, 2, 12);
    if (big) {
      ctx.fillStyle = l.lit ? '#fff6d8' : '#5a5590';
      ctx.fillRect(x - 1, y - h - 22, 2, 10); ctx.fillRect(x - 5, y - h - 18, 10, 2);
    }
  }

  function drawDummy(ctx, d) {
    ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.tilt);
    ctx.fillStyle = '#3a2a1e'; ctx.fillRect(-2, -40, 4, 40);
    ctx.fillStyle = d.flash > 0 ? '#ffffff' : '#c89c52'; ctx.fillRect(-10, -36, 20, 22);
    ctx.fillStyle = '#8a6630'; ctx.fillRect(-10, -26, 20, 2); ctx.fillRect(-12, -34, 24, 3);
    ctx.fillStyle = d.flash > 0 ? '#ffffff' : '#e2c48a'; ctx.fillRect(-7, -48, 14, 13);
    ctx.fillStyle = '#5a3f22'; ctx.fillRect(-3, -44, 2, 2); ctx.fillRect(2, -44, 2, 2);
    ctx.restore();
  }

  function drawBulb(ctx, b, t) {
    const y = b.y + Math.sin(b.t) * 3, x = b.x;
    if (b.closed > 0) {
      ctx.fillStyle = '#4a1d3a'; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      return;
    }
    const g = ctx.createRadialGradient(x, y, 2, x, y, 26); g.addColorStop(0, 'rgba(255,143,184,0.45)'); g.addColorStop(1, 'rgba(255,143,184,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 26, y - 26, 52, 52);
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 + b.t * 0.6;
      ctx.fillStyle = i % 2 ? '#c2477a' : '#ff8fb8';
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 7, y + Math.sin(a) * 7, 7, 4, a, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    // a down-arrow hint above: strike down here
    const bob = Math.round(Math.sin(t * 0.12) * 2);
    ctx.fillStyle = 'rgba(255,233,168,0.8)';
    ctx.fillRect(x - 1, y - 30 + bob, 2, 6); ctx.fillRect(x - 3, y - 25 + bob, 6, 2); ctx.fillRect(x - 1, y - 23 + bob, 2, 2);
  }

  function drawCottage(ctx, w, cx0, t) {
    // the sisters' cottage at the edge of the village
    const TS = SH.TILE, x = cx0 * TS, gy = 16 * TS;
    ctx.fillStyle = '#3a2a24'; ctx.fillRect(x, gy - 70, 110, 70);
    ctx.fillStyle = '#4a3a30'; for (let y = gy - 66; y < gy; y += 10) ctx.fillRect(x, y, 110, 2);
    ctx.fillStyle = '#e8eef8'; ctx.beginPath(); ctx.moveTo(x - 10, gy - 70); ctx.lineTo(x + 55, gy - 112); ctx.lineTo(x + 120, gy - 70); ctx.fill();
    ctx.fillStyle = '#2a1c18'; ctx.fillRect(x + 80, gy - 112, 12, 30);
    for (let i = 0; i < 6; i++) { const k = ((t * 0.4 + i * 20) % 120) / 120; ctx.globalAlpha = 0.5 * (1 - k); ctx.fillStyle = '#c8d0e0'; ctx.beginPath(); ctx.arc(x + 86 + Math.sin(k * 6 + i) * 6, gy - 116 - k * 70, 4 + k * 8, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
    const g = ctx.createRadialGradient(x + 30, gy - 40, 2, x + 30, gy - 40, 40); g.addColorStop(0, 'rgba(255,190,110,0.5)'); g.addColorStop(1, 'rgba(255,190,110,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 10, gy - 80, 80, 80);
    ctx.fillStyle = '#ffc070'; ctx.fillRect(x + 20, gy - 50, 20, 16); ctx.fillStyle = '#3a2a24'; ctx.fillRect(x + 29, gy - 50, 2, 16);
    ctx.fillStyle = '#5a3a24'; ctx.fillRect(x + 66, gy - 40, 18, 40);
  }
  function drawThornWall(ctx, tw, t) {
    const TS = SH.TILE, x = tw.x * TS, top = tw.top * TS, bot = 16 * TS, wd = tw.w * TS;
    ctx.fillStyle = '#2a1024'; ctx.fillRect(x + 4, top, wd - 8, bot - top);
    for (let y = top; y < bot; y += 10) for (let k = 0; k < 3; k++) {
      const sx = x + 4 + k * (wd - 8) / 3 + Math.sin(y * 0.3 + k) * 3;
      ctx.fillStyle = '#5a1d3e'; ctx.beginPath(); ctx.moveTo(sx, y); ctx.lineTo(sx + (k % 2 ? 9 : -9), y + 4); ctx.lineTo(sx, y + 7); ctx.fill();
      ctx.fillStyle = '#ff5a78'; ctx.fillRect(sx + (k % 2 ? 7 : -9), y + 3, 2, 2);
    }
    const g = ctx.createLinearGradient(x - 20, 0, x + wd + 20, 0); g.addColorStop(0, 'rgba(255,60,100,0)'); g.addColorStop(0.5, 'rgba(255,60,100,0.12)'); g.addColorStop(1, 'rgba(255,60,100,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 20, top, wd + 40, bot - top);
  }
  function drawBrazier(ctx, b, t) {
    const x = b.x, y = b.y;
    ctx.fillStyle = '#2a2236'; ctx.fillRect(x - 3, y - 22, 6, 22); ctx.fillRect(x - 9, y - 2, 18, 2);
    ctx.fillStyle = '#4a3a5a'; ctx.fillRect(x - 11, y - 30, 22, 8); ctx.fillStyle = '#6a5a7a'; ctx.fillRect(x - 11, y - 30, 22, 2);
    if (b.lit) {
      const f = Math.sin(t * 0.3 + x) * 2;
      const g = ctx.createRadialGradient(x, y - 36, 2, x, y - 36, 44); g.addColorStop(0, 'rgba(255,170,80,0.55)'); g.addColorStop(1, 'rgba(255,170,80,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 44, y - 80, 88, 88);
      ctx.fillStyle = '#ff8a3a'; ctx.beginPath(); ctx.moveTo(x - 9, y - 30); ctx.lineTo(x, y - 48 + f); ctx.lineTo(x + 9, y - 30); ctx.fill();
      ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.moveTo(x - 4, y - 30); ctx.lineTo(x, y - 40 - f); ctx.lineTo(x + 4, y - 30); ctx.fill();
    } else { ctx.fillStyle = '#1a1424'; ctx.fillRect(x - 8, y - 32, 16, 3); }
  }
  // Wyrms: a long, low, armored body; the head glows red while winding up; stars circle it when dazed.
  // Drawn twice: once enlarged in the outline colour, then in colour, so it reads against any ground.
  function wyrmBody(ctx, e, t, ol) {
    const fl = e.flash > 0 && !ol;
    const body = ol || (fl ? '#ffffff' : '#4a566e'), dark = ol || (fl ? '#ffffff' : '#343e54'), belly = ol || (fl ? '#ffffff' : '#7a86a0'), plate = ol || (fl ? '#ffffff' : '#c8d2e2');
    const g = ol ? 1.6 : 0;   // outline growth
    const wave = e.state === 'charge' ? Math.sin(e.t * 0.8) * 2 : Math.sin(t * 0.05) * 1;
    const open = e.state === 'inhale' || e.state === 'breath' || e.state === 'roar';
    const headUp = e.state === 'roar' ? -6 : e.state === 'inhale' ? -3 : e.state === 'stun' ? 4 : 0;
    // tail
    ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-24, -15 - g); ctx.quadraticCurveTo(-36, -14 + wave, -44 - g, -4 + wave * 2); ctx.lineTo(-24, -5 + g); ctx.fill();
    // legs
    ctx.fillStyle = dark;
    for (let i = 0; i < 4; i++) { const lift = (e.state === 'charge' || e.state === 'wander' || (e.state === 'rest' && e.vx)) && Math.floor(t / 4 + i) % 2 ? 2 : 0; ctx.fillRect(-19 + i * 10 - g, -6, 4 + g * 2, 6 - lift + (ol ? 1 : 0)); }
    // body segments
    ctx.fillStyle = body;
    for (let i = 0; i < 5; i++) { const bx = -22 + i * 9, by = -12 + Math.sin(i * 0.9 + t * 0.08) * wave; ctx.beginPath(); ctx.ellipse(bx, by, 8 + g, 8 + g, 0, 0, Math.PI * 2); ctx.fill(); }
    if (!ol) {
      ctx.fillStyle = belly; ctx.fillRect(-26, -7, 40, 4);
      // back plates
      ctx.fillStyle = plate;
      for (let i = 0; i < 5; i++) { const bx = -22 + i * 9, by = -19 + Math.sin(i * 0.9 + t * 0.08) * wave; ctx.beginPath(); ctx.moveTo(bx - 4, by + 2); ctx.lineTo(bx - 1, by - 5); ctx.lineTo(bx + 4, by + 2); ctx.fill(); }
      ctx.fillStyle = dark; for (let i = 0; i < 4; i++) ctx.fillRect(-18 + i * 9, -13, 1, 6);
    }
    // head
    ctx.save(); ctx.translate(14, -14 + headUp); ctx.rotate(headUp * -0.03);
    ctx.fillStyle = body; ctx.fillRect(-g, -7 - g, 15 + g * 2, 8 + g * 2);                       // skull
    ctx.fillRect(2 - g, 1 + (open ? 3 : 0) - g * 0.5, 12 + g * 2, 4 + g);                          // jaw
    ctx.fillStyle = plate; ctx.fillRect(1 - g, -9 - g, 14 + g * 2, 5 + g); ctx.fillRect(12, -8 - g, 4 + g, 9 + g);   // brow plate
    ctx.beginPath(); ctx.moveTo(1 - g, -9); ctx.lineTo(-4 - g, -18 - g); ctx.lineTo(6 + g, -9); ctx.fill();          // horn
    if (!ol) {
      const angry = e.state === 'windup' || e.state === 'charge' || e.state === 'crouch' || e.state === 'leap';
      ctx.fillStyle = e.state === 'stun' ? '#6a7690' : angry ? '#ff4a4a' : (e.state === 'inhale' || e.state === 'breath') ? '#7ad8ff' : '#ffd27a'; ctx.fillRect(8, -3, 3, 2);
      if (open) { ctx.fillStyle = e.state === 'roar' ? '#7a2a3a' : '#bfe8ff'; ctx.fillRect(4, 1, 9, 3); }
      ctx.fillStyle = '#e8eef8'; ctx.fillRect(11, 1, 2, 2); ctx.fillRect(7, 1, 2, 2);                                 // teeth
    }
    ctx.restore();
  }
  function drawWyrm2(ctx, e, t) {
    if (e.dead) return;
    const s = e.def.scale, x = e.x, y = e.y;
    const shakeX = (e.state === 'windup' || e.state === 'roar') ? Math.sin(e.t * 1.6) * 1.5 : 0;
    const sq = e.state === 'crouch' ? 1 - Math.min(0.22, e.t * 0.012) : e.state === 'slamrest' && e.t < 8 ? 0.8 + e.t * 0.025 : e.state === 'leap' ? 1.08 : 1;
    if (e.state === 'leap') { const gy = e.shadowY || y; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, e.home.y, 34, 5, 0, 0, Math.PI * 2); ctx.fill(); }
    if (e.state === 'breath') {   // the frost cone
      const hb = e.breathBox(), hx = x + e.dir * e.w / 2, k = Math.min(1, e.t / 8) * (0.5 + Math.sin(t * 0.6) * 0.08);
      const g = ctx.createLinearGradient(hx, 0, hx + e.dir * e.def.breathReach, 0); g.addColorStop(0, 'rgba(200,236,255,' + k + ')'); g.addColorStop(1, 'rgba(200,236,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx, y - e.h * 0.5 - 4); ctx.lineTo(hx + e.dir * e.def.breathReach, hb.t - 6); ctx.lineTo(hx + e.dir * e.def.breathReach, y); ctx.lineTo(hx, y - e.h * 0.5 + 6); ctx.fill();
    }
    ctx.save(); ctx.translate(Math.round(x + shakeX), Math.round(y)); ctx.scale(e.dir * s * (2 - sq), s * sq);
    wyrmBody(ctx, e, t, '#0a0818'); wyrmBody(ctx, e, t, null);
    ctx.restore();
    const hx = x + e.dir * 22 * s, hy = y - 16 * s;
    const glow = (e.state === 'windup' || e.state === 'charge' || e.state === 'crouch') ? '255,70,70' : (e.state === 'inhale' || e.state === 'breath') ? '120,210,255' : null;
    if (glow) { const r = (e.state === 'inhale' ? 12 + e.t * 0.35 : 18) * s; const g = ctx.createRadialGradient(hx, hy, 1, hx, hy, r); g.addColorStop(0, 'rgba(' + glow + ',0.5)'); g.addColorStop(1, 'rgba(' + glow + ',0)'); ctx.fillStyle = g; ctx.fillRect(hx - r, hy - r, r * 2, r * 2); }
    if (e.state === 'stun') for (let i = 0; i < 3; i++) { const a = t * 0.12 + i * 2.1; ctx.fillStyle = '#ffe9a8'; ctx.fillRect(x + e.dir * 20 * s + Math.cos(a) * 10 * s, y - 34 * s + Math.sin(a) * 3, 3, 3); }
    if (!e.boss && e.hp < e.def.hp) { const n = 10; for (let i = 0; i < n; i++) { ctx.fillStyle = i < Math.ceil(e.hp / e.def.hp * n) ? '#c8d2e2' : '#2a2a3a'; ctx.fillRect(x - 25 + i * 5, y - e.h * s - 14, 4, 3); } }
  }
  function drawWoods(ctx, e, t) {
    const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(e.x + x), Math.round(e.y + y), w, h); };
    if (e.kind === 'pickup') {
      if (e.got) return;
      const bob = Math.round(Math.sin(t * 0.08 + e.x) * 1.5);
      const gl = ctx.createRadialGradient(e.x, e.y - 8, 1, e.x, e.y - 8, 22); gl.addColorStop(0, 'rgba(255,246,216,0.3)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(e.x - 22, e.y - 30, 44, 44);
      if (e.what === 'cat') { const tl = Math.sin(t * 0.1) * 2; R(-7, -9, 13, 8, '#0a0818'); R(-6, -8, 11, 7, '#2a2630'); R(3, -13, 7, 7, '#0a0818'); R(4, -12, 5, 5, '#2a2630'); R(4, -14, 2, 2, '#2a2630'); R(7, -14, 2, 2, '#2a2630'); R(5, -10, 1, 1, '#ffd27a'); R(7, -10, 1, 1, '#ffd27a'); R(-9, -10 + tl, 2, 6, '#2a2630'); R(-5, -5, 3, 1, '#f4f0e0'); }
      else if (e.what === 'plums') { R(-7, -9 + bob, 14, 9, '#0a0818'); R(-6, -8 + bob, 12, 7, '#6a4a34'); R(-6, -8 + bob, 12, 1, '#a8743a'); for (let i = 0; i < 3; i++) { R(-5 + i * 4, -12 + bob, 3, 4, '#7a3a8a'); R(-5 + i * 4, -12 + bob, 1, 1, '#ffffff'); } }
      else if (e.what === 'page') { R(-6, -12 + bob, 12, 14, '#0a0818'); R(-5, -11 + bob, 10, 12, '#f4f0e0'); for (let i = 0; i < 4; i++) R(-3, -9 + i * 3 + bob, 6, 1, '#6a5aa8'); R(-5, -11 + bob, 3, 3, '#e8c070'); }
      else if (e.what === 'wood') { R(-10, -9 + bob, 20, 9, '#0a0818'); R(-9, -8 + bob, 18, 3, '#7a5636'); R(-9, -5 + bob, 18, 3, '#5e3e28'); R(-9, -2 + bob, 18, 1, '#4a3020'); R(-9, -8 + bob, 2, 6, '#c8a878'); R(-2, -10 + bob, 3, 10, '#c8b890'); R(-9, -8 + bob, 18, 1, '#ffffff'); }
      else { R(-1, -12 + bob, 2, 12, '#3f6a3f'); R(-6, -12 + bob, 5, 3, '#8fd16b'); R(1, -15 + bob, 5, 3, '#8fd16b'); R(-5, -7 + bob, 4, 3, '#6ab04a'); R(2, -9 + bob, 4, 3, '#6ab04a'); R(-1, -17 + bob, 2, 2, '#ff9ac0'); }
    } else if (e.kind === 'snare') {
      R(-10, -2, 20, 2, '#0a0818'); R(-9, -14, 2, 14, '#5e3e28'); R(-9, -15, 12, 2, '#5e3e28');
      ctx.strokeStyle = e.checked ? '#6a6a7a' : '#c8b890'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(e.x + 2, e.y - 14); ctx.lineTo(e.x + 2, e.y - 8); ctx.stroke(); ctx.beginPath(); ctx.arc(e.x + 2, e.y - 5, 3, 0, 6.3); ctx.stroke();
      if (!e.checked) { const by = e.y - 34 + Math.round(Math.sin(t * 0.1) * 2); ctx.fillStyle = '#0a0818'; ctx.fillRect(e.x - 5, by - 1, 10, 13); ctx.fillStyle = '#ffd27a'; ctx.fillRect(e.x - 4, by, 8, 11); SH.ptext(ctx, '?', e.x - 1, by + 3, '#1c1430', 1); }
    } else if (e.kind === 'target') {
      const wob = Math.round(Math.sin(e.wob * 0.9) * e.wob * 0.12);
      ctx.strokeStyle = '#5e3e28'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(e.x, e.y - 40); ctx.lineTo(e.x + wob, e.y - 12); ctx.stroke();
      for (const [r, c] of [[12, '#0a0818'], [11, '#e8e0c8'], [8, '#c8452e'], [5, '#e8e0c8'], [2, '#c8452e']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(e.x + wob, e.y, r, 0, 6.3); ctx.fill(); }
      if (e.hit) { R(wob - 12, -1, 12, 2, '#6a4a2a'); R(wob - 14, -2, 3, 4, '#e8e0c8'); }
    } else if (e.kind === 'wolf') {
      if (e.gone) return;
      ctx.save(); ctx.translate(Math.round(e.x), Math.round(e.y)); ctx.scale(e.dir, 1);
      if (e.dead) ctx.rotate(1.45);
      const run = e.state === 'lunge' || e.state === 'flee' ? Math.sin(t * 0.6) * 3 : e.state === 'prowl' || e.state === 'back' ? Math.sin(t * 0.2) * 1.5 : 0, low = e.state === 'crouch' ? 3 : e.state === 'hurt' ? 2 : 0;
      for (const ol of ['#0a0818', null]) {
        const g = ol ? 1.5 : 0, body = ol || (e.flash > 0 ? '#ffffff' : '#7a8296'), dark = ol || '#565e72', lite = ol || '#aab2c6';
        ctx.strokeStyle = dark; ctx.lineWidth = 3 + g * 2; ctx.lineCap = 'round';
        for (const [lx, sw] of [[-11, -run], [-7, run], [8, run], [12, -run]]) { ctx.beginPath(); ctx.moveTo(lx, -9 + low); ctx.lineTo(lx + sw, -1); ctx.stroke(); }
        ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-15 - g, -16 + low); ctx.quadraticCurveTo(0, -21 - g + low, 12, -18 + low - g); ctx.lineTo(15 + g, -11 + low); ctx.quadraticCurveTo(0, -5 + g + low, -14, -8 + low + g); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = body; ctx.lineWidth = 4 + g * 2; ctx.beginPath(); ctx.moveTo(-14, -14 + low); ctx.quadraticCurveTo(-22, -12 + low, -24, -5 + low + (e.state === 'hurt' ? 4 : 0)); ctx.stroke();   // tail, tucked when hurt
        const hx = 15, hy = -19 + low + (e.state === 'hurt' ? 4 : 0);
        ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(hx - 5 - g, hy - 5 - g); ctx.lineTo(hx + 4, hy - 4 - g); ctx.lineTo(hx + 12 + g, hy + 1); ctx.lineTo(hx + 11 + g, hy + 4 + g); ctx.lineTo(hx - 4 - g, hy + 5 + g); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(hx - 4, hy - 5); ctx.lineTo(hx - 3, hy - 11 - g); ctx.lineTo(hx + 1, hy - 5); ctx.fill();
        if (!ol) { ctx.fillStyle = lite; ctx.fillRect(-10, -9 + low, 20, 2); ctx.fillStyle = e.state === 'crouch' || e.state === 'lunge' ? '#ff5a5a' : '#ffd27a'; ctx.fillRect(hx + 2, hy - 2, 2, 2); ctx.fillStyle = '#1a1430'; ctx.fillRect(hx + 10, hy, 2, 2);
          ctx.fillStyle = dark; for (let i = 0; i < 4; i++) ctx.fillRect(-8 + i * 5, -15 + low, 1, 5); }   // ribs: it is starving too
      }
      ctx.restore();
    }
  }
  // The white stag: slender, long-necked, a crown of antlers, lit from within. Drawn once in the outline colour, once in white.
  function stagBody(ctx, e, t, ol) {
    const g = ol ? 1.5 : 0, W = ol || '#f4f6ff', S = ol || '#c9d2f2', D = ol || '#9aa6d8';
    const run = e.state === 'flee' ? Math.sin(t * 0.5) : 0, graze = e.state === 'graze' && Math.sin(t * 0.02) > 0.2, breathe = Math.sin(t * 0.06) * 0.6;
    const leg = (x, sw, back) => { ctx.strokeStyle = back ? D : W; ctx.lineWidth = 3 + g * 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, -17); ctx.lineTo(x + sw * 5, -9); ctx.lineTo(x + sw * 2, -1); ctx.stroke(); if (!ol) { ctx.fillStyle = '#3a4270'; ctx.fillRect(x + sw * 2 - 2, -2, 4, 2); } };
    leg(-12, -run, true); leg(9, run, true);
    // body: a deep chest tapering to the haunch
    ctx.fillStyle = W; ctx.beginPath(); ctx.moveTo(-20 - g, -25 + breathe); ctx.quadraticCurveTo(-8, -33 - g + breathe, 10, -30 - g + breathe); ctx.quadraticCurveTo(18 + g, -26, 16 + g, -19); ctx.quadraticCurveTo(2, -12 + g, -14, -15 + g); ctx.quadraticCurveTo(-23 - g, -17, -20 - g, -25 + breathe); ctx.fill();
    if (!ol) { ctx.fillStyle = S; ctx.beginPath(); ctx.moveTo(-17, -18); ctx.quadraticCurveTo(0, -12, 15, -19); ctx.quadraticCurveTo(2, -16, -17, -18); ctx.fill(); ctx.fillStyle = W; ctx.fillRect(-23, -26, 4, 5); }   // belly shade, the tail
    leg(-16, run, false); leg(13, -run, false);
    // neck and head: up and watchful, or down to graze
    const hx = graze ? 26 : 22, hy = graze ? -10 : -47 + breathe;
    ctx.strokeStyle = W; ctx.lineWidth = 7 + g * 2; ctx.beginPath(); ctx.moveTo(11, -26); ctx.quadraticCurveTo(graze ? 22 : 13, graze ? -22 : -38, hx - 3, hy + 3); ctx.stroke();
    ctx.fillStyle = W; ctx.beginPath(); ctx.moveTo(hx - 6 - g, hy - 3 - g); ctx.lineTo(hx + 2, hy - 4 - g); ctx.lineTo(hx + 9 + g, hy + 2); ctx.lineTo(hx + 8 + g, hy + 5 + g); ctx.lineTo(hx - 4 - g, hy + 5 + g); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hx - 5, hy - 3); ctx.lineTo(hx - 10 - g, hy - 8 - g); ctx.lineTo(hx - 3, hy - 1); ctx.fill();    // ear
    if (!ol) { ctx.fillStyle = '#1a1430'; ctx.fillRect(hx, hy - 1, 2, 2); ctx.fillStyle = '#3a4270'; ctx.fillRect(hx + 7, hy + 2, 2, 2); }
    // antlers: two beams, three tines each
    ctx.strokeStyle = ol || '#e6ebff'; ctx.lineWidth = 2 + g * 2; ctx.lineCap = 'round';
    for (const sd of [0, 1]) { const ax = hx - 3 + sd * 4, lean = sd ? 5 : -5; ctx.beginPath(); ctx.moveTo(ax, hy - 4); ctx.quadraticCurveTo(ax + lean * 0.4, hy - 14, ax + lean, hy - 24); ctx.moveTo(ax + lean * 0.3, hy - 11); ctx.lineTo(ax + lean * 0.3 + (sd ? 6 : -6), hy - 16); ctx.moveTo(ax + lean * 0.6, hy - 17); ctx.lineTo(ax + lean * 0.6 + (sd ? 6 : -6), hy - 23); ctx.moveTo(ax + lean, hy - 24); ctx.lineTo(ax + lean + (sd ? -3 : 3), hy - 30); ctx.stroke(); }
  }
  function drawStag(ctx, e, t) {
    ctx.save(); ctx.translate(e.x, e.y);
    if (e.state !== 'down') {
      const gl = ctx.createRadialGradient(0, -24, 2, 0, -24, 60); gl.addColorStop(0, 'rgba(230,236,255,0.34)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(-60, -84, 120, 120);
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 0, 20, 3, 0, 0, Math.PI * 2); ctx.fill();
      if (t % 9 === 0) SH.fx.burst(e.x + (Math.random() - 0.5) * 40, e.y - 10 - Math.random() * 40, 1, { speed: 0.3, life: 40, gravity: -0.02, colors: ['#fff6d8', '#cfd6ff'], glow: true });
    }
    ctx.rotate(e.fall * 1.4); ctx.scale(e.dir, 1);
    stagBody(ctx, e, t, '#0a0818'); stagBody(ctx, e, t, null);
    ctx.restore();
  }
  function drawSprite(ctx, e, t) {
    if (e.dead) return;
    const d = e.def, cy = e.y - d.h / 2;
    let x = e.x;
    const angry = e.state === 'windup' || e.state === 'lunge';
    if (e.state === 'windup') x += Math.round(Math.sin(e.t * 1.7) * 1.5);
    if (angry) {
      const k = e.state === 'windup' ? e.t / d.windup : 1;
      const g = ctx.createRadialGradient(x, cy, 2, x, cy, 30);
      g.addColorStop(0, `rgba(255,150,60,${0.55 * k})`); g.addColorStop(1, 'rgba(255,150,60,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 30, cy - 30, 60, 60);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x, e.y, 12, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0a0818'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) { const lx = x - 9 + i * 6, sw = (e.state === 'wander' || e.state === 'lunge') ? Math.sin(t * 0.4 + i * 1.6) * 3 : 0; ctx.beginPath(); ctx.moveTo(lx, cy + 6); ctx.lineTo(lx + sw, e.y - 1); ctx.stroke(); }
    ctx.strokeStyle = angry ? PAL.spriteAngry : PAL.spriteRim; ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) { const lx = x - 9 + i * 6, sw = (e.state === 'wander' || e.state === 'lunge') ? Math.sin(t * 0.4 + i * 1.6) * 3 : 0; ctx.beginPath(); ctx.moveTo(lx, cy + 6); ctx.lineTo(lx + sw, e.y - 1); ctx.stroke(); }
    const spikes = 10, rot = e.wobble * 0.2 * (e.dir || 1) + (e.state === 'windup' ? e.t * 0.12 : Math.sin(t * 0.03 + x) * 0.08);
    const body = e.flash > 0 ? '#ffffff' : angry ? '#6a4a1c' : PAL.sprite;
    const rim = e.flash > 0 ? '#ffffff' : angry ? PAL.spriteAngry : PAL.spriteRim;
    ctx.fillStyle = '#0a0818'; star(ctx, x, cy, 16, 10.5, spikes, rot);
    ctx.fillStyle = rim;
    star(ctx, x, cy, 14, 9, spikes, rot);
    ctx.fillStyle = body;
    star(ctx, x, cy + 1, 11.5, 7.5, spikes, rot);
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(Math.round(x - 5), Math.round(cy - 5), 4, 2);   // a glint
    // eyes look toward where it's going
    ctx.fillStyle = angry ? '#ffe0a0' : PAL.spriteEye;
    const ex = (e.dir || 1) * 3;
    ctx.fillRect(Math.round(x + ex - 4), Math.round(cy - 2), 3, 3);
    ctx.fillRect(Math.round(x + ex + 2), Math.round(cy - 2), 3, 3);
    if (e.state === 'recover' || e.state === 'stagger') { ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6; ctx.fillRect(Math.round(x + ex - 4), Math.round(cy), 3, 1); ctx.fillRect(Math.round(x + ex + 2), Math.round(cy), 3, 1); ctx.globalAlpha = 1; }
    // health pips once it's been hit
    if (e.hp < d.hp) {
      const n = Math.ceil(d.hp / SH.COMBAT.damage), left = Math.ceil(e.hp / SH.COMBAT.damage);
      for (let i = 0; i < n; i++) { ctx.fillStyle = i < left ? '#9be07a' : '#2a2a3a'; ctx.fillRect(Math.round(x - n * 4 + i * 8 + 1), Math.round(e.y - d.h - 12), 6, 3); }
    }
  }
  function star(ctx, x, y, R, r, n, rot) {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = rot + i / (n * 2) * Math.PI * 2, rr = i % 2 ? r : R; i ? ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  }

  SH.draw = D;
})(window.SH = window.SH || {});
