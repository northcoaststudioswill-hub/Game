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
    combo: 0, comboT: 0, comboPop: 0, best: 0,
  };

  // ---- a 3x5 pixel font for anything lettered on the game canvas
  const G5 = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
    G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101',
    S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111', 0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110',
    4: '101101111001001', 5: '111100110001110', 6: '011100110101010', 7: '111001010010010', 8: '010101010101010', 9: '010101011001110',
    ' ': '000000000000000', '!': '010010010000010', '?': '110001010000010', '.': '000000000000010', "'": '010010000000000', ',': '000000000010100', '-': '000000111000000', ':': '000010000010000',
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
    // memory: the story panel that cuts in beside the face; line: what is said as it does
    starfall: { name: 'STARFALL', who: 'caelum', sub: 'BOND ART - CAELUM', c1: '#2c3d74', c2: '#b9a8ff', c3: '#fff6d8', memory: 'rooftop', line: 'YOU WERE NEVER ALONE. NOT ONCE.' },
    firstlight: { name: 'FIRST LIGHT', who: 'wren', sub: 'BOND ART - WREN', c1: '#a8452a', c2: '#ffb057', c3: '#fff6d8', memory: 'fire', line: 'IT DOES NOT BURN. IT WAS ALWAYS MINE.' },
  };
  A.ARTS = ARTS;

  A.reset = function () { A.combo = A.comboT = 0; A.cutin = A.scene = A.band = null; A.opening = 0; A.stars.length = 0; A.queue.length = 0; A.whisperT = 0; A.whisperGap = 120; if (SH.game && SH.game.hud) SH.game.hud.whisper(null); };
  A.newGame = function () { A.meter = 0; A.next = 0; A.said = {}; A.reset(); };
  A.active = function () { return !SH.game.mortal; };
  A.nextKind = function () { return SH.game.can('flame') && A.next % 2 === 1 ? 'firstlight' : 'starfall'; };
  A.ready = function () { return A.active() && A.meter >= A.max && !A.cutin && !A.scene; };

  A.gain = function (n) {
    if (!A.active() || A.scene) return;
    const was = A.meter >= A.max;
    A.meter = Math.min(A.max, A.meter + n * (1 + 0.15 * SH.stars.level('bond')));
    if (A.meter > 20) SH.game.explain('bondbar');
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
    if (c.t === 14) SH.sfx.play('slash');
    if (c.t >= 84 || (c.t > 30 && (SH.input.pressed.jump || SH.input.pressed.attack || SH.input.pressed.art))) { A.scene = { kind: c.kind, t: 0 }; A.cutin = null; SH.fx.kick(6); }
    return true;
  };

  function foes(world) { return world.things.filter(e => (e.kind === 'thornSprite' || e.kind === 'wyrm') && e.hittable && e.hittable()); }

  A.update = function (world) {
    const p = world.player, fx = SH.fx;
    if (A.opening > 0) A.opening--;
    if (A.comboPop > 0) A.comboPop--;
    if (A.comboT > 0 && --A.comboT === 0) A.combo = 0;
    if (A.band) { A.band.t++; if (A.band.t > A.band.life) A.band = null; }
    A.whisperStep();
    if (A.buf > 0) A.buf--;
    if (SH.input.pressed.art || A.buf > 0) { const held = !SH.input.pressed.art; A.buf = 0; if (A.ready()) A.fire(world); else if (held) { /* a buffered press that came to nothing */ } else if (A.active() && !A.scene) fx.word(p.x, p.y - 52, 'bond not ready', '#b9b2dd', 30); }
    const s = A.scene; if (!s) return;
    s.t++;
    const vw = world.viewW, cx = world.cam.x, cy = world.cam.y;
    if (s.kind === 'starfall') {
      // Caelum lends her the night: she winnows through her target five times, and every cut lands at once.
      if (s.t === 1) {
        const on = foes(world).filter(e => e.x > cx - 20 && e.x < cx + vw + 20);
        s.tgt = on.sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0] || null;
        s.home = { x: p.x, y: p.y, facing: p.facing }; s.pass = 0;
        s.focus = s.tgt ? { x: s.tgt.x, y: s.tgt.y - (s.tgt.h || 24) / 2 } : { x: p.x, y: p.y - 30 };
      }
      if (s.t >= 4 && s.t < 36 && (s.t - 4) % 6 === 0) {
        const T = SH.TILE, tg = s.tgt, side = s.pass % 2 ? 1 : -1; s.pass++;
        const ax = tg ? tg.x : s.home.x + s.home.facing * 40, ay = tg ? tg.y - (tg.h || 24) / 2 : s.home.y - 24;
        const nx = ax + side * ((tg ? tg.w / 2 : 0) + 30);
        if (tg && !SH.isSolid(world.room.get(Math.floor(nx / T), Math.floor((tg.y - 4) / T))) && world.room.groundY(Math.floor(nx / T), 0) != null) {
          fx.burst(p.x, p.y - 22, 8, { speed: 1.6, life: 18, gravity: -0.02, colors: ['#b9a8ff', '#fff6d8'], glow: true });
          p.x = nx; p.y = tg.y; p.vx = p.vy = 0; p.facing = -side; p.grounded = true;
          if (tg.vx != null) tg.vx = 0;
        }
        const ang = (s.pass * 2.4) % Math.PI;
        fx.lines.push({ x: ax, y: ay, ang, len: 34, grow: 0, life: 44 - s.t, max: 44 - s.t, slash: true });
        SH.sfx.play('slash'); SH.game.punch(0.03);
      }
      if (s.t >= 4 && s.t < 36 && s.tgt && s.tgt.vx != null) s.tgt.vx = 0;
      if (s.t === 38) {
        fx.flashScreen(6, 'rgba(230,220,255,0.8)'); fx.stop(10); fx.kick(10); SH.game.punch(0.2); SH.sfx.play('kill');
        for (const e of foes(world)) {
          if (e.x < cx - 30 || e.x > cx + vw + 30) continue;
          const cy0 = e.y - (e.h || 20) / 2;
          for (let i = 0; i < 5; i++) fx.spark(e.x + (Math.random() - 0.5) * 20, cy0 + (Math.random() - 0.5) * 16, Math.random() * 6.3, true);
          A.stars.push({ x: e.x + 40, y: cy - 20, vx: -2.6, vy: 10, life: 60, tx: e.x, ty: cy0 });
          e.takeHit({ dmg: e === s.tgt ? 10 : 6, kb: 4, dir: e.x > s.home.x ? 1 : -1, finisher: true, art: true, open: true }, world);
        }
      }
      if (s.t === 44) { p.x = s.home.x; p.y = s.home.y; p.vx = p.vy = 0; p.facing = s.home.facing; fx.burst(p.x, p.y - 22, 10, { speed: 1.6, life: 18, gravity: -0.02, colors: ['#b9a8ff', '#fff6d8'], glow: true }); }
      if (s.t > 36 && s.t < 76 && s.t % 2 === 0) A.stars.push({ x: cx + Math.random() * (vw + 160) - 40, y: cy - 20, vx: -2.6, vy: 9 + Math.random() * 3, life: 60 });
      if (s.t >= 90) A.scene = null;
    } else {
      // Her own fire: she rises on it, and a ring of dawn bursts out. Burns what is near, lights braziers, burns thorn walls, mends a heart.
      if (s.t === 1) { s.focus = { x: p.x, y: p.y - 40 }; p.vy = -5.5; p.grounded = false; SH.sfx.play('lantern'); }
      if (s.t < 14) { p.vx = 0; if (s.t > 6) p.vy = Math.min(p.vy, -0.6); fx.burst(p.x + (Math.random() - 0.5) * 14, p.y, 2, { angle: -Math.PI / 2, spread: 0.5, speed: 3, life: 22, gravity: -0.08, colors: ['#ff8a3a', '#ffd27a', '#fff6d8'], glow: true }); }
      if (s.t === 14) { fx.flashScreen(8, 'rgba(255,220,150,0.7)'); SH.sfx.play('kill'); fx.kick(9); SH.game.punch(0.2); fx.stop(6); }
      if (s.t === 16) {
        const R = 190;
        for (const e of world.things) {
          if (e.arrowOnly || !e.hittable || !e.hittable() || Math.abs(e.x - p.x) > R || Math.abs(e.y - p.y) > 150) continue;
          const big = e.kind === 'thornSprite' || e.kind === 'wyrm';
          e.takeHit({ fire: true, dmg: big ? 10 : 1, kb: 6, dir: e.x > p.x ? 1 : -1, finisher: true, art: true, open: true }, world);
        }
        for (const t of world.thorns || []) if (t.solid && Math.abs((t.x + t.w / 2) * SH.TILE - p.x) < R) { world.room.setThorns(t, false); if (t.id === 'road') SH.game.queueScript('lib_wall'); }
        if (p.hearts < p.maxHearts) { p.hearts++; fx.word(p.x, p.y - 64, '+1 heart', '#ff9ac0', 60); }
        fx.burst(p.x, p.y - 22, 60, { speed: 6, life: 40, gravity: -0.03, colors: ['#ff8a3a', '#ffd27a', '#fff6d8'], glow: true });
      }
      if (s.t >= 70) A.scene = null;
    }
    for (const st of A.stars) { st.x += st.vx; st.y += st.vy; st.life--; if (st.ty != null && st.y >= st.ty) st.life = 0; }
    A.stars = A.stars.filter(st => st.life > 0);
  };

  // ---- the hit counter: unbroken hits, called out at 5, 10 and 20; being hit drops it
  A.hit = function () {
    A.combo++; A.comboT = 120; A.comboPop = 8; A.best = Math.max(A.best, A.combo);
    if (A.combo === 10) A.whisper('combo10');
    if (A.combo === 5 || A.combo === 10 || A.combo === 20) { A.gain(A.combo); const p = SH.game.world.player; SH.fx.word(p.x, p.y - 70, A.combo + ' HITS!', '#ffd27a', 60); }
  };
  A.dropCombo = function () { if (SH.game.boss) A.whisper('hurt'); A.combo = 0; A.comboT = 0; };

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
      const k = Math.min(1, s.t / 10) * Math.min(1, (90 - s.t) / 12);
      ctx.fillStyle = 'rgba(8,6,30,' + (0.55 * k) + ')'; ctx.fillRect(0, 0, vw, VH);
    }
    for (const st of A.stars) {
      const x = st.x - cx, y = st.y - cy;
      ctx.strokeStyle = 'rgba(185,168,255,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - st.vx * 4, y - st.vy * 4); ctx.stroke();
      ctx.fillStyle = '#fff6d8'; ctx.fillRect(x - 2, y - 2, 4, 4); ctx.fillStyle = '#b9a8ff'; ctx.fillRect(x - 4, y - 1, 8, 2); ctx.fillRect(x - 1, y - 4, 2, 8);
    }
    if (s && s.kind === 'firstlight') {
      const p = w.player, x = p.x - cx, y = p.y - 22 - cy, r = Math.min(200, Math.max(0, s.t - 14) * 16), k = s.t < 14 ? 0 : Math.max(0, 1 - (s.t - 14) / 56);
      if (s.t < 20) { const pk = Math.min(1, s.t / 6) * (s.t < 14 ? 1 : (20 - s.t) / 6); ctx.globalCompositeOperation = 'lighter'; const pg = ctx.createLinearGradient(x - 22, 0, x + 22, 0); pg.addColorStop(0, 'rgba(255,140,60,0)'); pg.addColorStop(0.5, 'rgba(255,230,170,' + (0.8 * pk) + ')'); pg.addColorStop(1, 'rgba(255,140,60,0)'); ctx.fillStyle = pg; ctx.fillRect(x - 22, 0, 44, y + 30); ctx.globalCompositeOperation = 'source-over'; }
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
    if (A.combo >= 2 && !A.cutin) {   // the hit counter
      const sc = A.comboPop > 4 ? 4 : 3, txt = A.combo + ' HITS', tw = SH.ptextW(txt, sc), fade = Math.min(1, A.comboT / 20);
      ctx.globalAlpha = fade; SH.ptext(ctx, txt, vw - tw - 16, 64 - (sc - 3) * 2, A.combo >= 10 ? '#ff8a3a' : A.combo >= 5 ? '#ffd27a' : '#fff6d8', sc, '#0a0818'); ctx.globalAlpha = 1;
    }
    if (A.band) drawBand(ctx, vw, VH);
    if (A.cutin) drawCutin(ctx, vw, VH, t);
  };

  function drawBand(ctx, vw, VH) {
    const b = A.band, inK = Math.min(1, b.t / 6), outK = Math.min(1, (b.life - b.t) / 10), k = Math.min(inK, outK);
    const h = 44 * k, y = VH * 0.2 - h / 2;
    ctx.fillStyle = 'rgba(6,5,18,0.86)'; ctx.fillRect(0, y, vw, h);
    ctx.fillStyle = b.color; ctx.fillRect(0, y, vw, 2); ctx.fillRect(0, y + h - 2, vw, 2);
    if (k < 0.8) return;
    const sc = SH.ptextW(b.text, 5) > vw - 30 ? 4 : 5, tw = SH.ptextW(b.text, sc), slide = (1 - Math.min(1, b.t / 10)) * 60;
    SH.ptext(ctx, b.text, Math.round(vw / 2 - tw / 2 + slide), Math.round(VH * 0.2 - (b.sub ? 16 : 12)), '#fff6d8', sc, '#0a0818');
    if (b.sub) SH.ptext(ctx, b.sub, Math.round(vw / 2 - SH.ptextW(b.sub, 2) / 2 - slide), Math.round(VH * 0.2 + 12), b.color, 2);
  }

  // The cut-in: two slanted panels. On the left the memory the art is drawn from; on the right the face.
  // Then the name of the blow and the line. (Sootborn's Memory Arts carry its story into its fights this way.)
  function slant(ctx, x0, x1, y0, y1, lean) { ctx.beginPath(); ctx.moveTo(x0 + lean, y0); ctx.lineTo(x1 + lean, y0); ctx.lineTo(x1 - lean, y1); ctx.lineTo(x0 - lean, y1); ctx.closePath(); }
  function drawCutin(ctx, vw, VH, t) {
    const c = A.cutin, a = ARTS[c.kind], k = Math.min(1, c.t / 9), out = c.t > 76 ? Math.min(1, (c.t - 76) / 8) : 0, e = 1 - Math.pow(1 - k, 3);
    ctx.fillStyle = 'rgba(4,3,14,' + (0.86 * k * (1 - out)) + ')'; ctx.fillRect(0, 0, vw, VH);
    ctx.save(); ctx.globalAlpha = 1 - out; ctx.imageSmoothingEnabled = false;
    const y0 = 34, y1 = VH - 92, lean = 26, mid = Math.round(vw * 0.56), pad = 5;
    // left: the memory, sliding in from the left with a slow push
    const lx0 = 18 - (1 - e) * vw, lx1 = mid - pad - (1 - e) * vw;
    ctx.save(); slant(ctx, lx0, lx1, y0, y1, lean); ctx.fillStyle = '#0a0818'; ctx.fill(); ctx.clip();
    const mem = SH.art.panel(a.memory), ms = Math.max((lx1 - lx0 + lean * 2) / mem.width, (y1 - y0) / mem.height) * (1.06 + c.t * 0.0016);
    ctx.drawImage(mem, (lx0 + lx1) / 2 - mem.width * ms / 2 - c.t * 0.25, (y0 + y1) / 2 - mem.height * ms / 2, mem.width * ms, mem.height * ms);
    ctx.fillStyle = 'rgba(10,8,24,0.18)'; ctx.fillRect(lx0 - lean, y0, lx1 - lx0 + lean * 2, y1 - y0);
    ctx.restore();
    ctx.strokeStyle = a.c2; ctx.lineWidth = 2; slant(ctx, lx0, lx1, y0, y1, lean); ctx.stroke();
    // right: the face, sliding in from the right
    const rx0 = mid + pad + (1 - e) * vw, rx1 = vw - 18 + (1 - e) * vw;
    ctx.save(); slant(ctx, rx0, rx1, y0, y1, lean); ctx.fillStyle = a.c1; ctx.fill(); ctx.clip();
    ctx.fillStyle = a.c2; ctx.globalAlpha = 0.35 * (1 - out);
    for (let i = 0; i < 12; i++) { const ly = y0 + ((i * 37 + c.t * 9) % (y1 - y0)); ctx.fillRect(rx0 - lean, ly, rx1 - rx0 + lean * 2, 2); }
    ctx.globalAlpha = 1 - out;
    const face = SH.art.portrait(a.who === 'wren' && SH.game.mortal ? 'wren_m' : a.who, c.t % 16 < 8 && c.t > 20 && c.t < 60 ? 'talk' : undefined), fs = Math.round((y1 - y0) * 1.25);
    ctx.drawImage(face, 6, 4, 36, 36, Math.round((rx0 + rx1) / 2 - fs / 2), y0 - 6, fs, fs);
    ctx.restore();
    ctx.strokeStyle = a.c3; ctx.lineWidth = 2; slant(ctx, rx0, rx1, y0, y1, lean); ctx.stroke();
    // the name of the blow, and the line
    if (c.t > 10) {
      const sc = SH.ptextW(a.name, 7) > vw * 0.6 ? 5 : 7, nx = Math.round(26 + (1 - Math.min(1, (c.t - 10) / 6)) * -60);
      SH.ptext(ctx, a.name, nx, VH - 82, a.c3, sc, '#0a0818');
      SH.ptext(ctx, a.sub, nx + 2, VH - 82 + sc * 6 + 3, a.c2, 2);
    }
    if (c.t > 22) { const n = Math.min(a.line.length, Math.floor((c.t - 22) * 1.2)), lw = SH.ptextW(a.line, 2); SH.ptext(ctx, a.line.slice(0, n), Math.round(vw - lw - 22), VH - 30, '#fff6d8', 2, '#0a0818'); }
    ctx.restore();
  }

  SH.arts = A;
})(window.SH = window.SH || {});
