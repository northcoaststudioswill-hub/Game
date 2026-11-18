// Starhaven — the mate bond in play: Bond Arts (supers with a cut-in and a scene), finisher bands,
// openings after a perfect dodge, and Caelum's whispers down the bond.
// Techniques borrowed from the studio's newer games: supers with cut-ins (Knockout, Lightswarm),
// finisher bands with a freeze (lil Bottie), openings (Sootborn's brawl), the radio (Lightswarm).
(function (SH) {
  const A = {
    meter: 0, max: 100, next: 0, buf: 0,
    cutin: null,      // { kind, t }  the world is frozen while this plays
    scene: null,      // { kind, t }  the art itself, played live
    band: null,       // { text, sub, color, t }
    opening: 0,       // frames left in which every cut bites deeper and breaks armor
    stars: [],
    said: {}, queue: [], whisperT: 0, whisperGap: 0,
  };

  // ---- a 3x5 pixel font for anything lettered on the game canvas
  const G5 = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
    G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101',
    S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
    4: '101101111001001', 5: '111100110001110', 6: '011100110101010', 7: '111001010010010', 8: '010101010101010', 9: '010101011001110',
    ' ': '000000000000000', '!': '010010010000010', '?': '110001010000010', '.': '000000000000010', "'": '010010000000000', '-': '000000111000000', ':': '000010000010000',
  };
  SH.ptext = function (g, str, x, y, col, scale, shadow) {
    scale = scale || 1; str = String(str).toUpperCase();
    const put = (ox, oy, c) => {
      g.fillStyle = c;
      for (let i = 0; i < str.length; i++) { const gl = G5[str[i]] || G5['?']; for (let p = 0; p < 15; p++) if (gl[p] === '1') g.fillRect(x + ox + i * 4 * scale + (p % 3) * scale, y + oy + ((p / 3) | 0) * scale, scale, scale); }
    };
    if (shadow) put(scale, scale, shadow);
    put(0, 0, col || '#fff6d8');
  };
  SH.ptextW = (s, sc) => String(s).length * 4 * (sc || 1) - (sc || 1);

  const ARTS = {
    starfall: { name: 'STARFALL', who: 'caelum', sub: 'BOND ART - CAELUM', c1: '#2c3d74', c2: '#b9a8ff', c3: '#fff6d8' },
    firstlight: { name: 'FIRST LIGHT', who: 'wren', sub: 'BOND ART - WREN', c1: '#a8452a', c2: '#ffb057', c3: '#fff6d8' },
  };
  A.ARTS = ARTS;

  A.reset = function () { A.cutin = A.scene = A.band = null; A.opening = 0; A.stars.length = 0; A.queue.length = 0; A.whisperT = 0; A.whisperGap = 120; if (SH.game && SH.game.hud) SH.game.hud.whisper(null); };
  A.newGame = function () { A.meter = 0; A.next = 0; A.said = {}; A.reset(); };
  A.active = function () { return !SH.game.mortal; };
  A.nextKind = function () { return SH.game.can('flame') && A.next % 2 === 1 ? 'firstlight' : 'starfall'; };
  A.ready = function () { return A.active() && A.meter >= A.max && !A.cutin && !A.scene; };

  A.gain = function (n) {
    if (!A.active() || A.scene) return;
    const was = A.meter >= A.max;
    A.meter = Math.min(A.max, A.meter + n * (1 + 0.15 * SH.stars.level('bond')));
    if (!was && A.meter >= A.max) {
      SH.sfx.play('lantern');
      const p = SH.game.world.player; SH.fx.ring(p.x, p.y - 22, '#b9a8ff', 60, 26, 3);
      SH.fx.word(p.x, p.y - 60, 'BOND ART READY', '#b9a8ff', 70);
      A.whisper('ready');
    }
  };

  A.fire = function (world) {
    if (!A.ready() || world.player.dead) return false;
    const kind = A.nextKind();
    A.meter = 0; A.next++;
    A.cutin = { kind, t: 0 };
    SH.sfx.play('rumble'); SH.sfx.play('lantern');
    world.player.stats.arts = (world.player.stats.arts || 0) + 1;
    return true;
  };

  // The world holds still while the cut-in plays. Returns true while it does.
  A.cutinStep = function (world) {
    if (!A.cutin) return false;
    const c = A.cutin; c.t++;
    world.player.invuln = Math.max(world.player.invuln || 0, 4);
    if (c.t === 14) SH.sfx.play('slash');
    if (c.t >= 54) { A.scene = { kind: c.kind, t: 0 }; A.cutin = null; SH.fx.kick(6); }
    return true;
  };

  function foes(world) { return world.things.filter(e => (e.kind === 'thornSprite' || e.kind === 'wyrm') && e.hittable && e.hittable()); }

  A.update = function (world) {
    const p = world.player, fx = SH.fx;
    if (A.opening > 0) A.opening--;
    if (A.band) { A.band.t++; if (A.band.t > A.band.life) A.band = null; }
    A.whisperStep();
    if (A.buf > 0) A.buf--;
    if (SH.input.pressed.art || A.buf > 0) { const held = !SH.input.pressed.art; A.buf = 0; if (A.ready()) A.fire(world); else if (held) { /* a buffered press that came to nothing */ } else if (A.active() && !A.scene) fx.word(p.x, p.y - 52, 'bond not ready', '#b9b2dd', 30); }
    const s = A.scene; if (!s) return;
    s.t++;
    p.invuln = Math.max(p.invuln || 0, 6);
    const vw = world.viewW, cx = world.cam.x, cy = world.cam.y;
    if (s.kind === 'starfall') {
      // stars rain across everything in sight: three waves of 3
      if (s.t < 70 && s.t % 2 === 0) A.stars.push({ x: cx + Math.random() * (vw + 160) - 40, y: cy - 20, vx: -2.6, vy: 9 + Math.random() * 3, life: 60 });
      if (s.t === 16 || s.t === 36 || s.t === 56) {
        fx.kick(5); SH.sfx.play('hit');
        for (const e of foes(world)) {
          if (e.x < cx - 30 || e.x > cx + vw + 30) continue;
          A.stars.push({ x: e.x + 40, y: cy - 20, vx: -2.6, vy: 10, life: 60, tx: e.x, ty: e.y - (e.h || 20) / 2 });
          e.takeHit({ dmg: 3, kb: 1.5, dir: e.x > p.x ? 1 : -1, finisher: s.t === 56, art: true, open: true }, world);
          fx.spark(e.x, e.y - (e.h || 20) / 2, Math.PI / 2, true);
        }
      }
      if (s.t >= 86) A.scene = null;
    } else {
      // a ring of dawn bursts out of her: burns everything near, lights braziers, burns thorn walls, mends one heart
      if (s.t === 1) { fx.flashScreen(8, 'rgba(255,220,150,0.7)'); SH.sfx.play('kill'); fx.kick(9); }
      if (s.t === 8) {
        const R = 190;
        for (const e of world.things) {
          if (e.arrowOnly || !e.hittable || !e.hittable() || Math.abs(e.x - p.x) > R || Math.abs(e.y - p.y) > 130) continue;
          const big = e.kind === 'thornSprite' || e.kind === 'wyrm';
          e.takeHit({ fire: true, dmg: big ? 10 : 1, kb: 6, dir: e.x > p.x ? 1 : -1, finisher: true, art: true, open: true }, world);
        }
        for (const t of world.thorns || []) if (t.solid && Math.abs((t.x + t.w / 2) * SH.TILE - p.x) < R) { world.room.setThorns(t, false); if (t.id === 'road') SH.game.queueScript('lib_wall'); }
        if (p.hearts < p.maxHearts) { p.hearts++; fx.word(p.x, p.y - 64, '+1 heart', '#ff9ac0', 60); }
        fx.burst(p.x, p.y - 22, 60, { speed: 6, life: 40, gravity: -0.03, colors: ['#ff8a3a', '#ffd27a', '#fff6d8'], glow: true });
      }
      if (s.t >= 60) A.scene = null;
    }
    for (const st of A.stars) { st.x += st.vx; st.y += st.vy; st.life--; if (st.ty != null && st.y >= st.ty) st.life = 0; }
    A.stars = A.stars.filter(st => st.life > 0);
  };

  // ---- finisher bands: a strip of text across the screen, a short freeze and a shake
  A.finisher = function (text, sub, color) {
    A.band = { text, sub: sub || '', color: color || '#ffd27a', t: 0, life: 64 };
    SH.fx.stop(12); SH.fx.kick(8); SH.sfx.play('thud');
  };

  // ---- an opening: dash through an attack and for a moment everything you cut is wide open
  A.open = function (world) {
    A.opening = 80; A.gain(14);
    const p = world.player; SH.fx.word(p.x, p.y - 66, 'OPENING!', '#fff6d8', 60);
    A.whisper('dodge');
  };

  // ---- whispers: Caelum (and later the others) speak down the bond without stopping play
  A.whisper = function (key, force) {
    if (!A.active()) return;
    const set = SH.STORY.WHISPERS[key]; if (!set) return;
    const n = (A.said[key] || 0);
    if (!force && n >= set.length) return;         // each line is said once per save
    A.said[key] = n + 1;
    const line = set[n % set.length];
    if (A.queue.length < 2) A.queue.push(line);
  };
  A.whisperStep = function () {
    if (A.whisperT > 0) { A.whisperT--; if (A.whisperT === 0) { SH.game.hud.whisper(null); A.whisperGap = 240; } return; }
    if (A.whisperGap > 0) { A.whisperGap--; return; }
    if (!A.queue.length || A.band || A.cutin) return;
    const [who, text] = A.queue.shift();
    A.whisperT = 150 + text.length * 2;
    SH.game.hud.whisper(who, text); SH.sfx.play('blip');
  };

  // ---------------------------------------------------------------- drawing (screen space, after the lighting)
  A.draw = function (ctx, w, vw, VH) {
    const cx = Math.round(w.cam.x), cy = Math.round(w.cam.y), t = w.time;
    const s = A.scene;
    if (s && s.kind === 'starfall') {
      const k = Math.min(1, s.t / 10) * Math.min(1, (86 - s.t) / 12);
      ctx.fillStyle = 'rgba(8,6,30,' + (0.55 * k) + ')'; ctx.fillRect(0, 0, vw, VH);
    }
    for (const st of A.stars) {
      const x = st.x - cx, y = st.y - cy;
      ctx.strokeStyle = 'rgba(185,168,255,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - st.vx * 4, y - st.vy * 4); ctx.stroke();
      ctx.fillStyle = '#fff6d8'; ctx.fillRect(x - 2, y - 2, 4, 4); ctx.fillStyle = '#b9a8ff'; ctx.fillRect(x - 4, y - 1, 8, 2); ctx.fillRect(x - 1, y - 4, 2, 8);
    }
    if (s && s.kind === 'firstlight') {
      const p = w.player, x = p.x - cx, y = p.y - 22 - cy, r = Math.min(200, s.t * 16), k = Math.max(0, 1 - s.t / 60);
      ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createRadialGradient(x, y, r * 0.5, x, y, r + 10); g.addColorStop(0, 'rgba(255,170,80,0)'); g.addColorStop(0.8, 'rgba(255,190,100,' + (0.75 * k) + ')'); g.addColorStop(1, 'rgba(255,120,40,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r - 12, y - r - 12, r * 2 + 24, r * 2 + 24);
      ctx.strokeStyle = 'rgba(255,246,216,' + k + ')'; ctx.lineWidth = 2;
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + s.t * 0.02; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5); ctx.lineTo(x + Math.cos(a) * (r + 8), y + Math.sin(a) * (r + 8)); ctx.stroke(); }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (A.opening > 0) {   // a thin gold frame while the opening lasts
      ctx.globalAlpha = Math.min(1, A.opening / 20) * 0.6; ctx.strokeStyle = '#fff6d8'; ctx.lineWidth = 3; ctx.strokeRect(3, 3, vw - 6, VH - 6); ctx.globalAlpha = 1;
    }
    if (A.band) drawBand(ctx, vw, VH);
    if (A.cutin) drawCutin(ctx, vw, VH, t);
  };

  function drawBand(ctx, vw, VH) {
    const b = A.band, inK = Math.min(1, b.t / 6), outK = Math.min(1, (b.life - b.t) / 10), k = Math.min(inK, outK);
    const h = 44 * k, y = VH * 0.42 - h / 2;
    ctx.fillStyle = 'rgba(6,5,18,0.86)'; ctx.fillRect(0, y, vw, h);
    ctx.fillStyle = b.color; ctx.fillRect(0, y, vw, 2); ctx.fillRect(0, y + h - 2, vw, 2);
    if (k < 0.8) return;
    const sc = SH.ptextW(b.text, 5) > vw - 30 ? 4 : 5, tw = SH.ptextW(b.text, sc), slide = (1 - Math.min(1, b.t / 10)) * 60;
    SH.ptext(ctx, b.text, Math.round(vw / 2 - tw / 2 + slide), Math.round(VH * 0.42 - (b.sub ? 16 : 12)), '#fff6d8', sc, '#0a0818');
    if (b.sub) SH.ptext(ctx, b.sub, Math.round(vw / 2 - SH.ptextW(b.sub, 2) / 2 - slide), Math.round(VH * 0.42 + 12), b.color, 2);
  }

  function drawCutin(ctx, vw, VH, t) {
    const c = A.cutin, a = ARTS[c.kind], k = Math.min(1, c.t / 8), out = c.t > 46 ? (c.t - 46) / 8 : 0;
    ctx.fillStyle = 'rgba(4,3,14,' + (0.8 * k * (1 - out)) + ')'; ctx.fillRect(0, 0, vw, VH);
    ctx.save(); ctx.translate(vw / 2, VH / 2); ctx.rotate(-0.16); ctx.globalAlpha = 1 - out;
    const W = vw * 1.4, slide = (1 - k) * vw;
    ctx.fillStyle = a.c1; ctx.fillRect(-W / 2 - slide, -66, W, 132);
    ctx.fillStyle = '#0a0818'; ctx.fillRect(-W / 2 + slide, -50, W, 100);
    ctx.fillStyle = a.c2; ctx.fillRect(-W / 2 + slide, -44, W, 88);
    // speed lines along the band
    ctx.fillStyle = a.c3; ctx.globalAlpha = 0.5 * (1 - out);
    for (let i = 0; i < 14; i++) { const lx = ((i * 97 + c.t * 34) % (W + 80)) - W / 2 - 40; ctx.fillRect(lx, -40 + (i * 29) % 80, 46, 2); }
    ctx.restore();
    ctx.globalAlpha = 1 - out;
    // the face, big and square-pixelled, sliding in from the side
    const face = SH.art.portrait(a.who === 'wren' && SH.game.mortal ? 'wren_m' : a.who), fs = 144;
    const fx = Math.round(vw * 0.5 - fs - 20 - (1 - k) * 200), fy = Math.round(VH / 2 - fs / 2 - 6);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#0a0818'; ctx.fillRect(fx - 4, fy - 4, fs + 8, fs + 8);
    ctx.drawImage(face, fx, fy, fs, fs);
    ctx.strokeStyle = a.c3; ctx.lineWidth = 2; ctx.strokeRect(fx - 3, fy - 3, fs + 6, fs + 6);
    if (c.t > 8) {
      const tx = Math.round(vw * 0.5 + 4 + (1 - Math.min(1, (c.t - 8) / 6)) * 80);
      SH.ptext(ctx, a.name, tx, Math.round(VH / 2 - 24), '#0a0818', 6);
      SH.ptext(ctx, a.sub, tx, Math.round(VH / 2 + 16), '#0a0818', 2);
    }
    ctx.globalAlpha = 1;
  }

  SH.arts = A;
})(window.SH = window.SH || {});
