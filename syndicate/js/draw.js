// Underground Syndicate — procedural character art (drawn live over the pre-rendered plates)
(function () {
  const G = window.G;
  const OUT = '#0b0a0f';

  const BASE = {
    fighter: { armor: '#727883', armor2: '#474b55', trim: '#9a927a', cloth: '#6e1a20', legs: '#3a3d45', hair: '#3a2a20', weapon: '#d5dde6' },
    rogue: { armor: '#2e2b33', armor2: '#1c1a21', trim: '#6a5a3a', cloth: '#221f29', legs: '#25232b', hair: '#1a1a1a', weapon: '#c8d2dc' },
    sorcerer: { armor: '#6a181e', armor2: '#431016', trim: '#d09a44', cloth: '#7c1d24', legs: '#3a1216', hair: '#5a1418', weapon: '#ff8a3c' },
    cleric: { armor: '#5d5a62', armor2: '#3c3a42', trim: '#e3c15a', cloth: '#d9d2bf', legs: '#34323a', hair: '#cfc9bb', weapon: '#e8d48a' }
  };
  const TRIM = [null, '#c9d2dc', '#ffd36b'], WGLOW = [null, '#6fe8ff', '#ffd36b'];

  function palette(look) {
    const p = Object.assign({}, BASE[look.cls], look.tint || {});
    p.skin = G.RACES[look.race].skin;
    const g = look.gear || {};
    if (TRIM[g.armor]) p.trim = TRIM[g.armor];
    p.wglow = WGLOW[g.weapon] || null;
    return p;
  }

  function shape(c, fill, pts, close) {
    c.beginPath(); c.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
    if (close !== false) c.closePath();
    c.fillStyle = fill; c.fill(); c.stroke();
  }
  function limb(c, col, x1, y1, x2, y2, w) {
    c.lineCap = 'round';
    c.strokeStyle = OUT; c.lineWidth = w + 1.9; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.strokeStyle = OUT; c.lineWidth = 1.2;
  }
  function glow(c, x, y, r, col, a) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha *= (a == null ? 1 : a);
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.3); c.fill(); c.restore();
  }
  G.glow = glow;

  function weapon(c, cls, P, col, len, t) {
    // drawn pointing along +x from the hand
    if (cls === 'fighter') {
      if (P.wglow) { c.save(); c.shadowColor = P.wglow; c.shadowBlur = 10; }
      shape(c, col('weapon'), [3, -2.2, len - 4, -1.8, len, 0, len - 4, 1.8, 3, 2.2]);
      if (P.wglow) c.restore();
      shape(c, col('trim'), [1, -5.5, 4, -5.5, 4, 5.5, 1, 5.5]);
      shape(c, '#2a2018', [-5, -1.6, 1, -1.6, 1, 1.6, -5, 1.6]);
    } else if (cls === 'rogue') {
      if (P.wglow) { c.save(); c.shadowColor = P.wglow; c.shadowBlur = 8; }
      shape(c, col('weapon'), [2, -1.8, len - 3, -1.2, len, 0, len - 3, 1.4, 2, 1.8]);
      if (P.wglow) c.restore();
      shape(c, col('trim'), [0, -3.5, 2.5, -3.5, 2.5, 3.5, 0, 3.5]);
    } else if (cls === 'cleric') {
      shape(c, '#3a2e22', [-6, -1.5, len - 6, -1.5, len - 6, 1.5, -6, 1.5]);
      c.beginPath(); c.arc(len - 4, 0, 5.2, 0, 6.3); c.fillStyle = col('weapon'); c.fill(); c.stroke();
      for (let i = 0; i < 6; i++) { const a = i * 1.047 + 0.3; c.beginPath(); c.moveTo(len - 4 + Math.cos(a) * 5, Math.sin(a) * 5); c.lineTo(len - 4 + Math.cos(a) * 8, Math.sin(a) * 8); c.stroke(); }
      glow(c, len - 4, 0, 13, P.wglow || 'rgba(255,220,120,0.55)', 0.7 + Math.sin(t * 5) * 0.15);
    }
  }

  // look: {cls, race, gear, tint, scale, rank}
  // pose: {face:±1, wa: weapon angle in the facing frame, walk, moving, act:'idle|swing|cast|ko|stun|dodge', prog 0..1, flash, alpha, t}
  function rawChar(c, look, p) {
    const cls = look.cls, race = G.RACES[look.race], P = palette(look);
    const col = k => p.flash > 0 ? '#ffffff' : P[k];
    const t = p.t || 0, s = (look.scale || 1) * race.scale;
    const robed = cls === 'sorcerer' || cls === 'cleric';
    const wide = cls === 'fighter' ? 13 : cls === 'rogue' ? 9.5 : 11;
    c.save();
    c.scale((p.face || 1) * s, s);
    c.lineJoin = 'round'; c.strokeStyle = OUT; c.lineWidth = 1.2;
    if (p.act === 'ko') {
      const k = Math.min(1, (p.prog || 0) * 2.2);
      c.translate(-k * 10, -4 * k); c.rotate(-1.45 * k);
    }
    const moving = p.moving && p.act !== 'ko';
    const sw = moving ? Math.sin(p.walk || 0) * 7 : 0;
    const bob = moving ? Math.abs(Math.cos(p.walk || 0)) * 2 : Math.sin(t * 2.4) * 0.8;
    const lean = p.act === 'swing' ? 3 : p.act === 'dodge' ? 6 : moving ? 1.5 : 0;
    c.translate(lean * 0.4, -bob);

    // rank aura
    if (look.rank >= 3 && p.act !== 'ko') glow(c, 0, -30, 40, G.RANKS[look.rank].color, 0.10 + Math.sin(t * 2) * 0.03);

    // cape / hair back layer
    if (cls === 'fighter') shape(c, col('cloth'), [-7, -47, 3, -47, -3 - sw * 0.3, -10, -15 - sw * 0.5 + Math.sin(t * 3) * 1.5, -8, -12, -30]);
    if (cls === 'rogue') shape(c, col('cloth'), [-6, -47, 2, -46, -4 - sw * 0.3, -16, -13 + Math.sin(t * 3) * 1.5, -14, -10, -32]);
    if (cls === 'sorcerer') shape(c, col('hair'), [-8, -60, -2, -62, -3, -40, -11 + Math.sin(t * 3), -36, -10, -50]);

    // back arm
    const sh = { x: 5, y: -44 }, bsh = { x: -5, y: -44 };
    let wa = p.wa || 0;
    if (p.act === 'swing') wa += G.lerp(-1.9, 1.3, Math.min(1, (p.prog || 0)) ** 0.7);
    if (p.act === 'cast') wa += -0.5 + Math.sin(t * 20) * 0.05;
    if (p.act === 'ko' || p.act === 'stun') wa = 1.3;
    const armLen = 13;
    const hx = sh.x + Math.cos(wa) * armLen, hy = sh.y + Math.sin(wa) * armLen;
    let ba = cls === 'rogue' || cls === 'sorcerer' ? wa + 0.55 : 1.9 - sw * 0.05;
    if (p.act === 'cast') ba = wa + 0.4;
    const bx = bsh.x + Math.cos(ba) * 12, by = bsh.y + Math.sin(ba) * 12;
    limb(c, col('armor2'), bsh.x, bsh.y, bx, by, 5);
    if (cls === 'rogue' && p.act !== 'ko') { c.save(); c.translate(bx, by); c.rotate(ba); weapon(c, cls, P, col, 15, t); c.restore(); }

    // legs or robe
    if (robed) {
      const sway = Math.sin(t * 2.5) * 1.2 + sw * 0.4;
      limb(c, '#1a1418', -3 + sw * 0.5, -8, -3 + sw, -1.5, 5);
      limb(c, '#1a1418', 4 - sw * 0.5, -8, 4 - sw, -1.5, 5);
      shape(c, col('cloth'), [-wide + 2, -28, wide - 2, -28, wide + 3 + sway, -4, -wide - 3 + sway, -4]);
      c.beginPath(); c.moveTo(0, -27); c.lineTo(sway * 0.6, -5); c.strokeStyle = col('trim'); c.lineWidth = 1.6; c.stroke(); c.strokeStyle = OUT; c.lineWidth = 1.2;
    } else {
      limb(c, col('legs'), -4, -24, -4 - sw, -3, 6.5);
      limb(c, col('legs'), 4, -24, 4 + sw, -3, 6.5);
      limb(c, '#17151a', -4 - sw, -3, -2 - sw, -1.5, 6);
      limb(c, '#17151a', 4 + sw, -3, 6 + sw, -1.5, 6);
    }

    // torso
    c.beginPath();
    c.moveTo(-wide + 3, -49); c.lineTo(wide - 3, -49); c.quadraticCurveTo(wide, -48, wide, -44);
    c.lineTo(wide - 3, -25); c.lineTo(-wide + 3, -25); c.lineTo(-wide, -44); c.quadraticCurveTo(-wide, -48, -wide + 3, -49);
    c.fillStyle = col('armor'); c.fill(); c.stroke();
    c.fillStyle = p.flash > 0 ? '#fff' : P.armor2; c.fillRect(-wide + 2, -31, wide * 2 - 4, 4.5);   // belt
    if (cls === 'fighter') { shape(c, col('trim'), [0, -44, 4, -39, 0, -34, -4, -39]); }
    if (cls === 'rogue') { c.beginPath(); c.moveTo(-wide + 2, -47); c.lineTo(wide - 3, -32); c.strokeStyle = col('trim'); c.lineWidth = 2; c.stroke(); c.strokeStyle = OUT; c.lineWidth = 1.2; }
    if (cls === 'sorcerer') { c.beginPath(); c.moveTo(-5, -49); c.lineTo(0, -38); c.lineTo(5, -49); c.strokeStyle = col('trim'); c.lineWidth = 2; c.stroke(); c.strokeStyle = OUT; c.lineWidth = 1.2; }
    if (cls === 'cleric') { shape(c, col('cloth'), [-4.5, -49, 4.5, -49, 4.5, -31, -4.5, -31]); c.beginPath(); c.arc(0, -41, 2.6, 0, 6.3); c.fillStyle = col('trim'); c.fill(); }
    if (cls === 'fighter' || cls === 'cleric') {       // pauldrons
      c.beginPath(); c.ellipse(wide - 2, -46.5, 5.5, 4.2, 0, 0, 6.3); c.fillStyle = col('trim'); c.fill(); c.stroke();
      c.beginPath(); c.ellipse(-wide + 2, -46.5, 5.5, 4.2, 0, 0, 6.3); c.fill(); c.stroke();
    }

    // shield (fighter)
    if (cls === 'fighter') {
      const sx = p.act === 'swing' ? -9 : -3 + Math.cos(wa) * 5, sy = -36;
      shape(c, col('armor2'), [sx - 8, sy - 10, sx + 8, sy - 10, sx + 8, sy + 3, sx, sy + 12, sx - 8, sy + 3]);
      shape(c, col('trim'), [sx, sy - 5, sx + 4, sy, sx, sy + 6, sx - 4, sy]);
    }

    // head
    const hy0 = -56.5;
    c.beginPath(); c.arc(0.5, hy0, 7.8, 0, 6.3); c.fillStyle = col('skin'); c.fill(); c.stroke();
    if (look.race === 'elf') shape(c, col('skin'), [-6, hy0 - 1, -13, hy0 - 6, -5, hy0 + 3]);
    c.fillStyle = OUT; c.fillRect(3.5, hy0 - 1.5, 2, 2.2);                                   // eye
    if (look.race === 'halforc') { c.fillStyle = '#f2ead8'; c.fillRect(3, hy0 + 3.5, 1.6, 3); c.fillRect(6, hy0 + 3.5, 1.4, 2.5); }
    if (look.race === 'dwarf') shape(c, col('hair'), [-5, hy0 + 2, 8, hy0 + 2, 6, hy0 + 13, 0, hy0 + 15, -4, hy0 + 9]);
    if (cls === 'fighter') {
      c.beginPath(); c.arc(0.5, hy0, 8.6, Math.PI * 0.95, Math.PI * 2.12); c.lineTo(8, hy0 + 5); c.lineTo(3, hy0 + 6); c.lineTo(3, hy0 + 1); c.lineTo(-8, hy0 + 2); c.closePath();
      c.fillStyle = col('armor'); c.fill(); c.stroke();
      c.fillStyle = OUT; c.fillRect(3, hy0 - 2, 6, 1.8);
      shape(c, col('cloth'), [-2, hy0 - 8, 2, hy0 - 14, -9, hy0 - 11 + Math.sin(t * 4), -7, hy0 - 6]);
    } else if (cls === 'rogue') {
      shape(c, col('cloth'), [-9, hy0 + 6, -10, hy0 - 5, -3, hy0 - 10, 5, hy0 - 9, 8.5, hy0 - 3, 4, hy0 - 4, -1, hy0 - 1, -2, hy0 + 7]);
      shape(c, col('armor2'), [1, hy0 + 2, 8.5, hy0 + 2, 7, hy0 + 8, 1, hy0 + 8]);
    } else if (cls === 'sorcerer') {
      shape(c, col('hair'), [-8, hy0 + 2, -8.5, hy0 - 5, -2, hy0 - 9, 6, hy0 - 7, 3, hy0 - 4, -3, hy0 - 3, -4, hy0 + 4]);
      shape(c, col('trim'), [-5, hy0 - 7, -3.5, hy0 - 13, -1.5, hy0 - 8, 1, hy0 - 14, 3, hy0 - 8, 5.5, hy0 - 12, 6, hy0 - 6]);
    } else {
      shape(c, col('cloth'), [-9, hy0 + 7, -10, hy0 - 4, -3, hy0 - 10, 5, hy0 - 9, 7, hy0 - 5, 0, hy0 - 5, -3, hy0 + 1, -3, hy0 + 8]);
      c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(255,220,120,' + (0.7 + Math.sin(t * 3) * 0.2) + ')'; c.lineWidth = 1.8;
      c.beginPath(); c.ellipse(0, hy0 - 13, 8, 2.6, 0, 0, 6.3); c.stroke(); c.restore();
    }
    if (look.race === 'tiefling') {
      c.fillStyle = col('skin');
      shape(c, '#3a1a20', [3, hy0 - 6, 9, hy0 - 15, 6, hy0 - 5]);
      shape(c, '#3a1a20', [-4, hy0 - 6, -9, hy0 - 16, -1, hy0 - 6]);
    }

    // front arm + weapon
    limb(c, col(cls === 'sorcerer' ? 'cloth' : 'armor'), sh.x, sh.y, hx, hy, 5.5);
    c.beginPath(); c.arc(hx, hy, 2.6, 0, 6.3); c.fillStyle = col('skin'); c.fill(); c.stroke();
    if (p.act !== 'ko') {
      c.save(); c.translate(hx, hy); c.rotate(wa);
      const len = cls === 'fighter' ? 30 : cls === 'rogue' ? 16 : 22;
      weapon(c, cls, P, col, len, t);
      c.restore();
      if (cls === 'sorcerer') {
        const fl = 5 + Math.sin(t * 17) * 1.2 + (p.act === 'cast' ? 4 * (p.prog || 0) : 0);
        const fc = P.wglow || P.weapon;
        glow(c, hx + Math.cos(wa) * 4, hy + Math.sin(wa) * 4, fl * 2.6, fc, 0.9);
        glow(c, bx, by, fl * 2, fc, 0.7);
        c.fillStyle = '#fff3c0'; c.beginPath(); c.arc(hx + Math.cos(wa) * 4, hy + Math.sin(wa) * 4, fl * 0.45, 0, 6.3); c.fill();
      }
    }
    if (p.act === 'cast' && p.glowCol) glow(c, hx, hy, 12 + 14 * (p.prog || 0), p.glowCol, 0.8);

    // stun stars
    if (p.act === 'stun') {
      c.fillStyle = '#ffe27a';
      for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.09; c.beginPath(); c.arc(Math.cos(a) * 10, hy0 - 14 + Math.sin(a) * 3, 1.8, 0, 6.3); c.fill(); }
    }
    c.restore();
  }

  // Characters are drawn to a scratch canvas, lit to match the baked plates (warm from above,
  // falling into shadow at the feet), then composited onto the scene.
  const scratch = document.createElement('canvas'), sc = scratch.getContext('2d');
  const LW = 200, LH = 140, LOX = 100, LOY = 118;
  G.drawChar = function (c, look, p) {
    const m = c.getTransform(), k = Math.min(12, Math.hypot(m.a, m.b)) || 1;
    const w = Math.ceil(LW * k), h = Math.ceil(LH * k);
    if (scratch.width < w || scratch.height < h) { scratch.width = Math.max(scratch.width, w); scratch.height = Math.max(scratch.height, h); }
    sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.globalAlpha = 1; sc.clearRect(0, 0, w, h);
    sc.setTransform(k, 0, 0, k, LOX * k, LOY * k);
    rawChar(sc, look, p);
    if (!(p.flash > 0)) {
      sc.setTransform(k, 0, 0, k, 0, 0); sc.globalCompositeOperation = 'source-atop';
      const g = sc.createLinearGradient(0, LOY - 78, 0, LOY + 4);
      g.addColorStop(0, 'rgba(255,196,130,0.20)'); g.addColorStop(0.3, 'rgba(255,170,100,0.04)'); g.addColorStop(0.62, 'rgba(8,4,14,0.22)'); g.addColorStop(1, 'rgba(6,3,12,0.62)');
      sc.fillStyle = g; sc.fillRect(0, 0, LW, LH);
      const side = sc.createLinearGradient(LOX - 16, 0, LOX + 16, 0);
      side.addColorStop(0, 'rgba(6,3,14,0.26)'); side.addColorStop(0.55, 'rgba(0,0,0,0)'); side.addColorStop(1, 'rgba(255,180,110,0.10)');
      sc.fillStyle = side; sc.fillRect(0, 0, LW, LH);
    }
    c.save(); c.globalAlpha *= (p.alpha == null ? 1 : p.alpha);
    c.drawImage(scratch, 0, 0, w, h, -LOX, -LOY, LW, LH);
    c.restore();
  };

  // Small portrait canvas for UI cards.
  G.portrait = function (look, size, scale) {
    const cv = document.createElement('canvas'), dpr = 2;
    cv.width = cv.height = size * dpr; cv.style.width = cv.style.height = (size / 16) + 'em';
    cv.className = 'portrait';
    const c = cv.getContext('2d');
    c.scale(dpr, dpr);
    const g = c.createRadialGradient(size / 2, size * 0.45, 2, size / 2, size / 2, size * 0.7);
    g.addColorStop(0, '#3a2c3f'); g.addColorStop(1, '#0e0b12');
    c.fillStyle = g; c.fillRect(0, 0, size, size);
    c.translate(size / 2 - 2, size * 0.93);
    const k = (scale || 1) * size / 78;
    c.scale(k, k);
    G.drawChar(c, Object.assign({}, look, { scale: 1 }), { face: 1, wa: -0.5, t: 1, act: 'idle' });
    return cv;
  };

  // Inline SVG icons for ability tiles.
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
    const col = ab === 'potion' ? '#ff6a7a' : ab.color;
    return '<svg viewBox="0 0 24 24" fill="' + col + '">' + ICON[k] + '</svg>';
  };
})();
