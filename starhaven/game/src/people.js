// Starhaven — the cast as pixel sprites: built from parts, shaded in three tones, outlined, cached.
// They breathe, blink, turn to whoever is speaking, hop, and show emote bubbles (!, ?, ..., a heart).
// (The character generator approach comes from Sootborn's art.js; these are side-on and taller.)
(function (SH) {
  const W = 32, H = 60, FX = 16, FY = 56;   // sheet cell; feet at (FX, FY)
  const cache = {};
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  // A hue-shifted ramp, as pixel artists build them: shadows are pulled toward a cool violet, highlights toward a
  // warm cream, so a colour never just gets "more black" or "more white".
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255;
    r *= f; g *= f; b *= f;
    if (f < 1) { const k = Math.min(0.5, (1 - f) * 0.55); r += (38 - r) * k; g += (30 - g) * k; b += (96 - b) * k; }
    else if (f > 1) { const k = Math.min(0.45, (f - 1) * 0.5); r += (255 - r) * k; g += (238 - g) * k; b += (196 - b) * k; }
    const c = v => Math.max(0, Math.min(255, Math.round(v)));
    return '#' + ((1 << 24) | (c(r) << 16) | (c(g) << 8) | c(b)).toString(16).slice(1);
  }
  SH.shade = shade;

  // Everyone faces right in the sheet. build: 0 slight, 1 broad. robe: a long garment instead of legs.
  const LOOKS = {
    wren: { skin: '#f6dcc6', hair: '#e0703f', style: 'braid', top: '#2f8f7a', trim: '#ffd27a', legs: '#3b3150', boots: '#6a4430', eye: '#3a8a6a', coat: true },
    mirelle: { skin: '#e8c8a8', hair: '#d8d4e0', style: 'bun', top: '#8a5a3a', trim: '#f4f0e0', robe: '#6a4a34', eye: '#3a2a1a', basket: true, small: 1 },
    caelum: { skin: '#ecd5c8', hair: '#1a1530', style: 'swept', top: '#241f48', trim: '#cfd6ff', legs: '#14122a', boots: '#0c0a1c', wings: true, eye: '#a58bff', tall: 2, coat: true },
    bram: { skin: '#d9a77f', hair: '#3a2a20', style: 'shaved', top: '#a8743a', trim: '#5a3a1c', legs: '#3a2a20', boots: '#241710', build: 1, beard: '#8a4426', eye: '#2a1a10', bare: true },
    iris: { skin: '#f2d9c8', hair: '#f4f0ff', style: 'bun', top: '#4f88c0', trim: '#ffe9a8', robe: '#3f72a8', eye: '#8fd8ff', thread: true },
    thane: { skin: '#8a5a3c', hair: '#9a9a9a', style: 'shaved', top: '#6a2a3a', trim: '#e8c070', robe: '#5a2232', eye: '#3a2a1a', glasses: true, book: true },
    nessa: { skin: '#f0d4c0', hair: '#2a1a14', style: 'long', top: '#5a5a6a', trim: '#8a8a9a', robe: '#4a4a5a', eye: '#2a1a14', axe: true },
    lissa: { skin: '#f0d4c0', hair: '#b8864a', style: 'braid', top: '#4a7a4a', trim: '#c8e0a0', robe: '#3f6a3f', eye: '#2a1a14', basket: true, small: 2 },
    rowan: { skin: '#f2d8b8', hair: '#e8c070', style: 'swept', top: '#3a5a2a', trim: '#e8c070', legs: '#2a3a1e', boots: '#3a2a14', eye: '#4ac06a', antlers: true, tall: 1, coat: true },
    queen: { skin: '#e8e4f2', hair: '#0c0a16', style: 'long', top: '#1a1630', trim: '#c8b8ff', robe: '#0e0c1c', eye: '#e8e0ff', crown: true, tall: 2 },
  };

  function drawBody(g, L, frame) {
    const R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(FX + x, FY + y, w, h); };
    const breathe = frame === 1 ? 1 : 0, blink = frame === 2;
    const tall = L.tall || 0, small = L.small || 0, broad = L.build ? 2 : 0;
    const hip = -18 - tall, sh = -34 - tall * 2 + small + breathe, head = sh - 11;   // y of hips, shoulders, top of the head
    const top = L.top, topL = shade(top, 1.28), topD = shade(top, 0.72), skin = L.skin, skinD = shade(skin, 0.8), skinL = shade(skin, 1.08);
    const hair = L.hair, hairL = shade(hair, 1.4), hairD = shade(hair, 0.7);
    // a mantle of dusk behind him, with stars in it (the Lord of Dusk; the Lit have no wings)
    if (L.wings) {
      R(-11, sh - 2, 8, 40, '#0e0b22'); R(-12, sh + 34, 7, 6, '#0e0b22'); R(-11, sh - 2, 1, 38, '#3a2a6a');
      for (let i = 0; i < 6; i++) R(-10 + (i * 3) % 6, sh + 3 + i * 6, 1, 1, i % 2 ? '#c8b8ff' : '#fff6d8');
    }
    if (L.style === 'long') { R(-6, head + 3, 4, 20, hairD); R(-5, head + 3, 2, 18, hair); }
    // legs or a robe
    if (L.robe) {
      const rb = L.robe, rbL = shade(rb, 1.25), rbD = shade(rb, 0.7);
      for (let y = hip - 2; y < 0; y++) { const k = (y - hip + 2) / (-hip + 2), half = 5 + broad + Math.round(k * 3); R(-half, y, half * 2, 1, rb); R(-half, y, 2, 1, rbD); R(half - 3, y, 2, 1, rbL); }
      R(-3, hip + 4, 1, -hip - 6, rbD); R(2, hip + 6, 1, -hip - 8, rbD);          // folds
      R(-8 - broad, -2, 16 + broad * 2, 2, rbD); R(-8 - broad, -3, 16 + broad * 2, 1, L.trim);
      R(-4, -1, 3, 1, '#1a1220'); R(3, -1, 3, 1, '#1a1220');
    } else {
      const lg = L.legs, lgD = shade(lg, 0.72), lgL = shade(lg, 1.3), bt = L.boots;
      R(-5 - broad, hip, 4 + broad, -hip - 4, lgD); R(1, hip, 4 + broad, -hip - 4, lg); R(4 + broad, hip, 1, -hip - 4, lgL);
      R(-6 - broad, -5, 6 + broad, 5, bt); R(0, -5, 7 + broad, 5, bt); R(0, -5, 7 + broad, 1, shade(bt, 1.8)); R(5 + broad, -2, 3, 2, bt);
    }
    // torso
    const tw = 6 + broad;
    R(-tw, sh, tw * 2, hip - sh + 2, top); R(-tw, sh, 2, hip - sh + 2, topD); R(tw - 3, sh, 2, hip - sh + 1, topL); R(-tw + 1, sh, tw * 2 - 2, 1, topL);
    if (L.coat) { R(-tw, hip, tw * 2, 8, top); R(-tw, hip, 2, 8, topD); R(-1, sh + 1, 1, hip - sh + 7, L.trim); R(tw - 1, hip + 2, 1, 6, topL); }
    else R(-1, sh + 2, 1, hip - sh - 2, L.trim);
    R(-tw, hip - 1, tw * 2, 2, shade(top, 0.5)); R(1, hip - 1, 2, 2, L.trim);                            // belt and buckle
    // the near arm
    const arm = L.bare ? skin : top, armD = L.bare ? skinD : topD;
    R(1, sh + 1, 4 + (broad ? 1 : 0), 12, arm); R(1, sh + 1, 1, 12, armD); R(2, sh + 13, 3, 3, skin); R(2, sh + 15, 3, 1, skinD);
    if (L.bare) { R(1, sh + 8, 5, 2, L.trim); }
    // neck and head
    R(-2, sh - 2, 5, 3, skinD);
    R(-4, head, 9, 10, skin); R(-4, head, 2, 10, skinD); R(-4, head + 8, 9, 2, skinD); R(4, head + 2, 1, 5, skinL);
    R(5, head + 5, 1, 2, skin);                                                                             // nose
    R(-5, head + 3, 2, 4, skin); R(-6, head + 1, 2, 3, skin);                                               // a pointed ear
    if (L.beard) { R(-2, head + 6, 7, 5, L.beard); R(-3, head + 5, 2, 4, L.beard); R(0, head + 11, 4, 1, shade(L.beard, 0.7)); }
    else R(2, head + 8, 3, 1, shade(skin, 0.62));                                                           // mouth
    if (blink) R(1, head + 4, 3, 1, shade(skin, 0.55)); else { R(1, head + 3, 3, 2, '#ffffff'); R(2, head + 3, 2, 2, L.eye); }
    R(1, head + 2, 3, 1, hairD);                                                                            // brow
    // hair
    if (L.style === 'swept') { R(-5, head - 2, 10, 4, hair); R(-5, head, 3, 7, hair); R(-4, head - 3, 7, 1, hairL); R(3, head + 1, 2, 1, hair); R(-6, head + 1, 1, 4, hairD); }
    if (L.style === 'shaved') { R(-4, head - 1, 9, 2, hair); R(-4, head, 2, 3, hair); R(-2, head - 1, 5, 1, hairL); }
    if (L.style === 'bun') { R(-5, head - 2, 10, 4, hair); R(-5, head, 2, 6, hair); R(-7, head - 5, 6, 6, hair); R(-6, head - 5, 4, 1, hairL); R(-3, head - 2, 6, 1, hairL); R(-7, head - 1, 6, 1, hairD); }
    if (L.style === 'long') { R(-5, head - 2, 10, 4, hair); R(-5, head, 3, 10, hair); R(-3, head - 2, 6, 1, hairL); }
    if (L.style === 'braid') { R(-5, head - 2, 10, 4, hair); R(-5, head, 3, 6, hair); R(-3, head - 2, 6, 1, hairL); for (let i = 0; i < 5; i++) R(-7 + (i % 2), head + 5 + i * 3, 3, 3, i % 2 ? hairD : hair); R(3, head - 1, 2, 2, '#ff9ac0'); }
    if (L.glasses) { R(0, head + 2, 5, 1, '#e8c070'); R(0, head + 5, 5, 1, '#e8c070'); R(0, head + 2, 1, 4, '#e8c070'); R(4, head + 2, 1, 4, '#e8c070'); }
    if (L.antlers) { for (let i = 0; i < 7; i++) { const hh = 2 + (3 - Math.abs(i - 3)); R(-4 + i * 1.5, head - 1 - hh, 1, hh, i % 2 ? '#ffd27a' : '#fff6d8'); } R(-4, head - 1, 9, 1, '#e8c070'); }   // a crown of morning light
    if (L.crown) { for (let i = 0; i < 5; i++) { R(-4 + i * 2, head - 6 + (i % 2) * 2, 1, 5 - (i % 2) * 2, '#1a1626'); R(-4 + i * 2, head - 6 + (i % 2) * 2, 1, 1, '#c8b8ff'); } R(-4, head - 2, 9, 1, '#6a5aa8'); }   // a crown of black glass
    if (L.wings) R(-4, head + 1, 9, 1, '#cfd6ff');                                                          // his circlet
    // what they carry
    if (L.book) { R(4, sh + 10, 7, 9, '#3a2a5a'); R(4, sh + 10, 7, 1, '#e8c070'); R(10, sh + 10, 1, 9, '#f4f0e0'); }
    if (L.axe) { R(8, sh - 2, 2, hip - sh + 18, '#6a4a2a'); R(6, sh - 5, 7, 5, '#9aa0b0'); R(6, sh - 5, 7, 1, '#d8dce8'); }
    if (L.basket) { R(4, sh + 14, 9, 6, '#a8743a'); R(4, sh + 14, 9, 1, '#d9a060'); R(5, sh + 12, 2, 2, '#ff9ac0'); R(9, sh + 12, 2, 2, '#ffe9a8'); R(7, sh + 11, 2, 2, '#b9a8ff'); }
  }

  // A one-pixel dark outline round every frame, so people read against any background.
  function outline(c, col) {
    const g = c.getContext('2d'), id = g.getImageData(0, 0, c.width, c.height), d = id.data, w = c.width, h = c.height, out = [];
    const on = (x, y, cell) => x >= cell * W && x < (cell + 1) * W && y >= 0 && y < h && d[(y * w + x) * 4 + 3] > 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (d[(y * w + x) * 4 + 3]) continue;
      const cell = (x / W) | 0;
      if (on(x - 1, y, cell) || on(x + 1, y, cell) || on(x, y - 1, cell) || on(x, y + 1, cell)) out.push(y * w + x);
    }
    const n = parseInt(col.slice(1), 16);
    for (const i of out) { d[i * 4] = n >> 16; d[i * 4 + 1] = n >> 8 & 255; d[i * 4 + 2] = n & 255; d[i * 4 + 3] = 255; }
    g.putImageData(id, 0, 0);
  }

  function sheet(id) {
    if (cache[id]) return cache[id];
    const L = LOOKS[id]; if (!L) return null;
    const c = canvas(W * 3, H), g = c.getContext('2d');
    for (let f = 0; f < 3; f++) { g.save(); g.translate(f * W, 0); drawBody(g, L, f); g.restore(); }
    g.globalCompositeOperation = 'source-atop';
    const lg = g.createLinearGradient(0, 4, 0, H); lg.addColorStop(0, 'rgba(255,240,205,0.20)'); lg.addColorStop(0.45, 'rgba(255,240,205,0)'); lg.addColorStop(1, 'rgba(24,16,70,0.30)'); g.fillStyle = lg; g.fillRect(0, 0, c.width, H);
    g.globalCompositeOperation = 'source-over';
    outline(c, '#0a0818');
    return (cache[id] = c);
  }

  const P = {};
  P.has = id => !!LOOKS[id];
  // Draw one person with their feet at (n.x, n.y).
  P.draw = function (ctx, n, t) {
    if (n.hidden) return;
    const s = sheet(n.id); if (!s) return;
    const seed = (n.id.charCodeAt(0) * 37) % 200;
    const blink = (t + seed) % 230 < 6, frame = blink ? 2 : Math.sin(t * 0.045 + seed) > 0.3 ? 1 : 0;
    let hop = 0;
    if (n.emote) { n.emote.t++; if (n.emote.e === '!' && n.emote.t < 14) hop = -Math.round(Math.sin(n.emote.t / 14 * Math.PI) * 5); if (n.emote.t > 110) n.emote = null; }
    const x = Math.round(n.x), y = Math.round(n.y) + hop, f = n.facing || 1;
    // contact shadow, then a soft glow so they read in the dark
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, Math.round(n.y), 11, 3, 0, 0, Math.PI * 2); ctx.fill();
    if (LOOKS[n.id].thread) {   // Iris sees the threads of fate
      ctx.strokeStyle = '#ffe9a8'; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(x + f * 6, y - 20);
      ctx.bezierCurveTo(x + f * 16, y - 34 + Math.sin(t * 0.05) * 4, x + f * 22, y - 10, x + f * 30, y - 26); ctx.stroke(); ctx.globalAlpha = 1;
    }
    const talking = SH.game && SH.game.speaking === n.id && SH.game.hud && SH.game.hud.typing && SH.game.hud.typing();
    const breathe = n.still ? 1 : 1 + 0.02 * Math.sin(t * 0.055 + seed), sway = n.still ? 0 : Math.sin(t * 0.021 + seed * 2) * 0.018;
    const shift = n.still ? 0 : ((t + seed * 5) % 520 < 40 ? Math.round(Math.sin(((t + seed * 5) % 520) / 40 * Math.PI) * 2) : 0);
    const nod = talking ? Math.round(Math.abs(Math.sin(t * 0.3)) * 1.5) : 0;
    ctx.save(); ctx.translate(x + shift * f, y); ctx.rotate(sway + (talking ? Math.sin(t * 0.15) * 0.02 : 0)); ctx.scale(f, breathe);
    ctx.drawImage(s, (talking ? (Math.floor(t / 7) % 2) : frame) * W, 0, W, H, -FX, -FY - nod, W, H);
    ctx.restore();
    // name plate and bubbles
    if (n.near || n.bubble) {
      const name = SH.STORY.CAST[n.id].name, tw = SH.ptextW(name, 1) + 8;
      ctx.fillStyle = '#0a0818'; ctx.fillRect(x - tw / 2 - 1, y - 73, tw + 2, 11);
      ctx.fillStyle = '#1c1838'; ctx.fillRect(x - tw / 2, y - 72, tw, 9);
      ctx.fillStyle = SH.STORY.CAST[n.id].color; ctx.fillRect(x - tw / 2, y - 72, tw, 1);
      SH.ptext(ctx, name, Math.round(x - tw / 2 + 4), y - 70, SH.STORY.CAST[n.id].color, 1);
    }
    const e = n.emote ? n.emote.e : n.bubble ? '...' : null;
    if (e) {
      const by = y - 90 + (n.emote ? -Math.min(4, n.emote.t) : Math.round(Math.sin(t * 0.1) * 2));
      ctx.fillStyle = '#0a0818'; ctx.fillRect(x - 10, by - 1, 20, 14); ctx.fillRect(x - 3, by + 12, 6, 4);
      ctx.fillStyle = '#fff6d8'; ctx.fillRect(x - 9, by, 18, 12); ctx.fillRect(x - 2, by + 12, 4, 3);
      if (e === 'heart') { ctx.fillStyle = '#ff5a78'; ctx.fillRect(x - 4, by + 3, 3, 3); ctx.fillRect(x + 1, by + 3, 3, 3); ctx.fillRect(x - 4, by + 5, 8, 2); ctx.fillRect(x - 3, by + 7, 6, 1); ctx.fillRect(x - 2, by + 8, 4, 1); ctx.fillRect(x - 1, by + 9, 2, 1); }
      else if (e === '...') { ctx.fillStyle = '#1c1430'; for (let i = 0; i < 3; i++) ctx.fillRect(x - 6 + i * 5, by + 5, 2, 2); }
      else SH.ptext(ctx, e, x - 2, by + 2, e === '!' ? '#d83a4a' : '#2c3d74', 2);
    }
  };
  SH.people = P;
})(window.SH = window.SH || {});
