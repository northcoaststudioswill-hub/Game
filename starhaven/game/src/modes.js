// Starhaven — other ways of seeing. The missions are side-on; these moments are not:
//   flight  into the screen, on Caelum's wings, out of the Spring Court (Chapter 1)
//   mural   face to the wall, tracing the first mural (Chapter 1; DESIGN.md "trace-and-fill")
//   city    from above, walking Starhaven's lamp square to whoever Wren spends the evening with
// A story script starts one with { do: 'mode', name: ... } and carries on when it ends.
(function (SH) {
  const M = { cur: null, auto: false };
  const VHf = () => SH.VIEW_H;
  const cap = { who: null, text: '', t: 0 };
  function say(who, text, frames) { cap.who = who; cap.text = text; cap.t = frames || 190; SH.sfx.play('blip'); }

  M.start = function (name, opts, done) {
    const G = SH.game;
    M.cur = { name, opts: opts || {}, done, t: 0, s: MODES[name].init(opts || {}) };
    cap.t = 0; G.mode = name;
    G.hud.dialog(null); G.hud.sceneArt(null); G.hud.prompt(null); G.hud.talkButton(null); G.hud.whisper(null);
    document.body.dataset.mode = name;
  };
  M.end = function (result) {
    const c = M.cur; if (!c) return;
    M.cur = null; SH.game.mode = null; delete document.body.dataset.mode; SH.input.clear();
    c.done(result);
  };
  M.step = function (input) {
    const c = M.cur; if (!c) return;
    c.t++;
    if (cap.t > 0) cap.t--;
    if (M.auto && c.t > 20) return M.end(MODES[c.name].autoResult ? MODES[c.name].autoResult(c.s) : null);   // tests of other things pass straight through
    if (input.pressed.pause && c.t > 30 && MODES[c.name].skippable !== false) return M.end(MODES[c.name].autoResult ? MODES[c.name].autoResult(c.s) : null);
    MODES[c.name].step(c.s, input, c);
  };
  M.draw = function (ctx, vw) {
    const c = M.cur; if (!c) return;
    ctx.imageSmoothingEnabled = false;
    MODES[c.name].draw(ctx, c.s, vw, VHf(), c);
    if (cap.t > 0 && cap.who) drawCaption(ctx, vw, VHf());
    if (c.t < 30) { ctx.fillStyle = 'rgba(5,5,13,' + (1 - c.t / 30) + ')'; ctx.fillRect(0, 0, vw, VHf()); }
  };
  M.state = () => M.cur ? Object.assign({ name: M.cur.name, t: M.cur.t }, MODES[M.cur.name].report ? MODES[M.cur.name].report(M.cur.s) : {}) : null;

  // A spoken line over the picture: a face, a name and the words, on a plate. It never stops the action.
  function drawCaption(ctx, vw, VH) {
    const C = SH.STORY.CAST[cap.who], k = Math.min(1, cap.t / 10), w = Math.min(vw - 40, 430), x = Math.round(vw / 2 - w / 2), y = VH - 62;
    ctx.globalAlpha = k;
    ctx.fillStyle = '#0a0818'; ctx.fillRect(x - 2, y - 2, w + 4, 50);
    ctx.fillStyle = '#1c1838'; ctx.fillRect(x, y, w, 46);
    ctx.fillStyle = C.color; ctx.fillRect(x, y, w, 1);
    ctx.drawImage(SH.art.portrait(cap.who, Math.floor(cap.t / 7) % 2 ? 'talk' : undefined), x + 3, y + 3, 40, 40);
    SH.ptext(ctx, C.name, x + 50, y + 5, C.color, 1);
    ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#f2eeff';
    const words = cap.text.split(' '); let line = '', ly = y + 24;
    for (const wd of words) { if (ctx.measureText(line + wd).width > w - 62) { ctx.fillText(line, x + 50, ly); line = ''; ly += 14; } line += wd + ' '; }
    ctx.fillText(line, x + 50, ly);
    ctx.globalAlpha = 1;
  }
  function plate(ctx, text, vw, y, col) { const tw = SH.ptextW(text, 2); ctx.fillStyle = 'rgba(10,8,24,0.8)'; ctx.fillRect(vw / 2 - tw / 2 - 8, y - 4, tw + 16, 18); SH.ptext(ctx, text, Math.round(vw / 2 - tw / 2), y, col || '#fff6d8', 2); }
  const rnd = (a, b) => a + Math.random() * (b - a);

  const MODES = {};

  // ================================================================ FLIGHT: into the screen
  const FL = { frames: 2640 };
  FL.lines = [
    [70, 'caelum', 'Don\'t look down. Actually, do. It\'s the best part.'],
    [330, 'wren', 'You could have used a door.'],
    [560, 'caelum', 'Rowan\'s archers have seen us. Lean with me.'],
    [930, 'wren', 'They\'re shooting at their own High Lord\'s guest!'],
    [1130, 'caelum', 'At me. You, they would like back.'],
    [1480, 'caelum', 'Storm over the border. Hold tight, and steer us through the gaps.'],
    [1900, 'wren', 'The thread in my chest. It stopped pulling.'],
    [2100, 'caelum', 'That is because you are finally going the right way.'],
    [2360, 'caelum', 'There. Do you see the lights? Starhaven.'],
  ];
  MODES.flight = {
    init() { return { x: 0, y: 0, vx: 0, vy: 0, objs: [], stars: 0, hits: 0, flash: 0, tilt: 0, li: 0, bgStars: Array.from({ length: 70 }, () => [Math.random(), Math.random() * 0.6, Math.random() * 6]) }; },
    autoResult: s => ({ stars: s.stars, hits: s.hits }),
    report: s => ({ stars: s.stars, hits: s.hits, objs: s.objs.length, x: s.x, y: s.y }),
    step(s, input, c) {
      const t = c.t, ax = (input.held.right ? 1 : 0) - (input.held.left ? 1 : 0), ay = (input.held.down ? 1 : 0) - (input.held.up ? 1 : 0);
      s.vx += (ax * 0.034 - s.vx) * 0.16; s.vy += (ay * 0.03 - s.vy) * 0.16;
      s.x = Math.max(-1, Math.min(1, s.x + s.vx)); s.y = Math.max(-0.8, Math.min(0.8, s.y + s.vy));
      s.tilt += (s.vx * 9 - s.tilt) * 0.12;
      if (s.flash > 0) s.flash--;
      while (s.li < FL.lines.length && t >= FL.lines[s.li][0]) { say(FL.lines[s.li][1], FL.lines[s.li][2]); s.li++; }
      // what comes at them: starlight always; arrows over Spring; storm cloud over the border; a last river of stars
      const spawn = (kind, x, y) => s.objs.push({ kind, x, y, z: 1 });
      if (t > 120 && t < FL.frames - 200) {
        if (t % 26 === 0) { const bx = Math.sin(t * 0.011) * 0.75, by = Math.cos(t * 0.017) * 0.5; spawn('star', bx, by); }
        if (t > 620 && t < 1420 && t % (t > 1000 ? 34 : 46) === 0) spawn('arrow', Math.random() < 0.6 ? s.x + rnd(-0.15, 0.15) : rnd(-0.9, 0.9), rnd(-0.6, 0.6));
        if (t > 1540 && t < 2250 && t % 38 === 0) { const gap = Math.sin(t * 0.006) * 0.7; for (const cxp of [-1, -0.5, 0, 0.5, 1]) if (Math.abs(cxp - gap) > 0.42) spawn('cloud', cxp + rnd(-0.08, 0.08), rnd(-0.5, 0.5)); }
      }
      if (t > FL.frames - 420 && t < FL.frames - 120 && t % 8 === 0) spawn('star', Math.sin(t * 0.05) * 0.5, Math.cos(t * 0.04) * 0.3);
      for (const o of s.objs) {
        o.z -= o.kind === 'arrow' ? 0.017 : 0.0115;
        if (o.z < 0.07 && !o.done) {
          o.done = true;
          const near = Math.abs(o.x - s.x) < (o.kind === 'cloud' ? 0.3 : 0.24) && Math.abs(o.y - s.y) < (o.kind === 'cloud' ? 0.36 : 0.26);
          if (near && o.kind === 'star') { s.stars++; o.got = true; SH.sfx.play('mote'); }
          else if (near && s.flash <= 0) {
            s.hits++; s.flash = 40; SH.sfx.play('hurt'); SH.fx.kick(5);
            if (s.hits === 1) say('caelum', o.kind === 'arrow' ? 'I have you. I have you. It only nicked the wing.' : 'I\'ve flown through worse. Hold on to me.', 150);
          }
        }
      }
      s.objs = s.objs.filter(o => o.z > -0.05 && !o.got);
      if (t >= FL.frames) M.end({ stars: s.stars, hits: s.hits });
    },
    draw(ctx, s, vw, VH, c) {
      const t = c.t, hz = Math.round(VH * 0.56 - s.y * 26), k = t / FL.frames, cx = vw / 2;
      // sky: Spring's rose dusk behind them gives way to Dusk's deep violet
      const g = ctx.createLinearGradient(0, 0, 0, hz);
      const mix = (a, b) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * Math.min(1, k * 1.6))).join(',') + ')';
      g.addColorStop(0, mix([40, 26, 70], [8, 8, 30])); g.addColorStop(1, mix([214, 120, 150], [52, 44, 110]));
      ctx.fillStyle = g; ctx.fillRect(0, 0, vw, hz);
      for (const b of s.bgStars) { ctx.globalAlpha = (0.3 + 0.7 * Math.abs(Math.sin(t * 0.03 + b[2]))) * Math.min(1, 0.25 + k * 1.5); ctx.fillStyle = '#fff6d8'; ctx.fillRect(((b[0] * vw * 1.4 - s.x * 30) % (vw + 20) + vw + 20) % (vw + 20) - 10, b[1] * hz, 2, 2); }
      ctx.globalAlpha = 1;
      const mx = cx + 150 - s.x * 40, my = hz * 0.34;
      const mg = ctx.createRadialGradient(mx, my, 6, mx, my, 70); mg.addColorStop(0, 'rgba(255,246,216,0.5)'); mg.addColorStop(1, 'rgba(255,246,216,0)'); ctx.fillStyle = mg; ctx.fillRect(mx - 70, my - 70, 140, 140);
      ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(mx, my, 20, 0, 6.3); ctx.fill(); ctx.fillStyle = mix([214, 120, 150], [52, 44, 110]); ctx.beginPath(); ctx.arc(mx + 8, my - 5, 18, 0, 6.3); ctx.fill();
      // far mountains, and at the end the lights of Starhaven between them
      ctx.fillStyle = mix([90, 50, 90], [20, 18, 52]);
      for (let i = -2; i < 14; i++) { const bx = i * 90 - ((s.x * 60 + t * 0.05) % 90), h = 22 + ((i * 53) % 37 + 37) % 37; ctx.beginPath(); ctx.moveTo(bx, hz); ctx.lineTo(bx + 45, hz - h); ctx.lineTo(bx + 100, hz); ctx.fill(); }
      const near = Math.max(0, (t - (FL.frames - 760)) / 760);
      if (near > 0) {
        const cw = 60 + near * 220, cxx = cx - s.x * 30;
        const gl = ctx.createRadialGradient(cxx, hz, 4, cxx, hz, cw); gl.addColorStop(0, 'rgba(255,210,122,' + (0.7 * near) + ')'); gl.addColorStop(1, 'rgba(255,210,122,0)'); ctx.fillStyle = gl; ctx.fillRect(cxx - cw, hz - cw, cw * 2, cw);
        for (let i = 0; i < 26; i++) { const bw = 5 + (i * 7) % 9, bh = (8 + (i * 13) % 26) * (0.3 + near), bx = cxx - cw * 0.7 + i * cw * 1.4 / 26; ctx.fillStyle = '#16122e'; ctx.fillRect(bx, hz - bh, bw * (0.4 + near), bh); if (i % 2) { ctx.fillStyle = '#ffd27a'; ctx.fillRect(bx + 1, hz - bh + 3, 2, 2); ctx.fillRect(bx + 1, hz - bh * 0.5, 2, 2); } }
      }
      // the sea below, rushing toward us
      const sg = ctx.createLinearGradient(0, hz, 0, VH); sg.addColorStop(0, mix([150, 90, 130], [34, 34, 90])); sg.addColorStop(1, mix([40, 30, 70], [6, 8, 26])); ctx.fillStyle = sg; ctx.fillRect(0, hz, vw, VH - hz);
      for (let i = 0; i < 9; i++) { const zz = ((i / 9 + t * 0.012) % 1), yy = hz + (VH - hz) * zz * zz; ctx.fillStyle = 'rgba(255,255,255,' + (0.05 + zz * 0.1) + ')'; for (let j = -6; j < 7; j++) { const xx = cx + (j * 70 - s.x * 80) * (0.25 + zz * 1.6); ctx.fillRect(xx, yy, 14 * (0.3 + zz), 1 + zz); } }
      // things in the air, far ones first
      const P = o => { const sc = 1 / (0.16 + o.z * 3.2); return [cx + (o.x - s.x * 0.85) * vw * 0.3 * sc * 0.42, VH * 0.5 + (o.y - s.y * 0.85) * VH * 0.5 * sc * 0.42, sc]; };
      for (const o of s.objs.slice().sort((a, b) => b.z - a.z)) {
        const [x, y, sc] = P(o), a = Math.min(1, (1 - o.z) * 3);
        ctx.globalAlpha = a;
        if (o.kind === 'star') { const r = 2 + sc * 2.2; ctx.fillStyle = 'rgba(255,210,122,0.35)'; ctx.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2); ctx.fillStyle = '#ffd27a'; ctx.fillRect(x - r / 3, y - r, r * 0.66, r * 2); ctx.fillRect(x - r, y - r / 3, r * 2, r * 0.66); ctx.fillStyle = '#fff6d8'; ctx.fillRect(x - r / 3, y - r / 3, r * 0.66, r * 0.66); }
        else if (o.kind === 'arrow') { const r = 1 + sc * 1.6; ctx.strokeStyle = '#e8c070'; ctx.lineWidth = Math.max(1, r * 0.5); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (x - cx) * 0.12 * o.z * 6, y - 26 * o.z * 3); ctx.stroke(); ctx.fillStyle = '#7ac05a'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); ctx.fillStyle = '#fff6d8'; ctx.fillRect(x - 1, y - 1, 2, 2); }
        else { const r = 7 + sc * 11; ctx.globalAlpha = a * 0.78; ctx.fillStyle = '#2a2452'; ctx.beginPath(); ctx.ellipse(x, y - r * 0.25, r * 1.3, r * 0.8, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = '#14102c'; ctx.beginPath(); ctx.ellipse(x, y, r * 1.5, r, 0, 0, 6.3); ctx.ellipse(x + r, y + r * 0.2, r, r * 0.7, 0, 0, 6.3); ctx.ellipse(x - r, y + r * 0.3, r * 1.1, r * 0.7, 0, 0, 6.3); ctx.fill(); if ((t + (o.x * 100 | 0)) % 50 < 4) { ctx.strokeStyle = '#cfd6ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - r * 0.4); ctx.lineTo(x - 5, y + r * 0.2); ctx.lineTo(x + 4, y + r * 0.3); ctx.lineTo(x - 2, y + r); ctx.stroke(); } }
      }
      ctx.globalAlpha = 1;
      // Caelum from behind, wings spread, Wren in his arms
      const fxp = cx + s.x * vw * 0.2, fyp = VH * 0.66 + s.y * VH * 0.14, flap = Math.sin(t * 0.14) * 0.26;
      if (!(s.flash > 0 && Math.floor(s.flash / 4) % 2)) {
        ctx.save(); ctx.translate(fxp, fyp); ctx.rotate(s.tilt * 0.6);
        for (const sd of [-1, 1]) {
          ctx.save(); ctx.scale(sd, 1); ctx.rotate(-flap);
          ctx.fillStyle = '#0a0818'; ctx.beginPath(); ctx.moveTo(4, -16); ctx.lineTo(42, -40); ctx.lineTo(96, -30); ctx.lineTo(84, -6); ctx.lineTo(70, -14); ctx.lineTo(60, 8); ctx.lineTo(44, -4); ctx.lineTo(32, 16); ctx.lineTo(18, 0); ctx.lineTo(6, 14); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#1c1838'; ctx.beginPath(); ctx.moveTo(6, -14); ctx.lineTo(42, -36); ctx.lineTo(92, -28); ctx.lineTo(82, -10); ctx.lineTo(44, -8); ctx.lineTo(18, -2); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = '#6a5aa8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, -15); ctx.lineTo(42, -38); ctx.lineTo(96, -30); ctx.moveTo(42, -38); ctx.lineTo(60, 6); ctx.moveTo(42, -38); ctx.lineTo(32, 14); ctx.stroke();
          ctx.restore();
        }
        const R = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };
        R(-10, -22, 20, 34, '#0a0818'); R(-8, -20, 16, 30, '#241f48'); R(-8, -20, 3, 30, '#16122e'); R(5, -20, 3, 30, '#322c62');     // his back
        R(-7, -36, 14, 16, '#0a0818'); R(-6, -35, 12, 14, '#1a1530'); R(-6, -35, 12, 2, '#cfd6ff');                                       // his head, the circlet
        R(-5, 10, 4, 16, '#14122a'); R(1, 10, 4, 16, '#14122a');
        R(8, -18, 9, 9, '#0a0818'); R(9, -17, 7, 7, '#e0703f'); R(9, -17, 7, 2, '#f08a52'); R(14, -12, 5, 9, '#e0703f');                   // Wren's hair over his shoulder
        R(-16, -8, 8, 5, '#2f8f7a'); R(-17, -4, 4, 4, '#f6dcc6');                                                                         // her arm round his neck
        ctx.restore();
      }
      if (s.flash > 30) { ctx.fillStyle = 'rgba(255,80,110,' + ((s.flash - 30) / 25) + ')'; ctx.fillRect(0, 0, vw, VH); }
      // what to do, and how it's going
      SH.ptext(ctx, 'STARLIGHT ' + s.stars, 12, 12, '#ffd27a', 2, '#0a0818');
      if (t < 260) plate(ctx, 'STEER WITH THE STICK. GATHER STARLIGHT. LEAN AWAY FROM ARROWS.', vw, 34, '#fff6d8');
      const left = Math.max(0, 1 - k); ctx.fillStyle = '#0a0818'; ctx.fillRect(vw - 112, 12, 100, 7); ctx.fillStyle = '#b9a8ff'; ctx.fillRect(vw - 111, 13, 98 * (1 - left), 5); SH.ptext(ctx, 'STARHAVEN', vw - 112, 23, '#b9a8ff', 1);
    },
  };

  // ================================================================ MURAL: face to the wall
  // Her first mural: the star of Dusk over the rooftops. Trace it point to point; colour follows the brush.
  const MU = { pts: [[0.5, 0.14], [0.56, 0.36], [0.74, 0.38], [0.6, 0.5], [0.66, 0.72], [0.5, 0.6], [0.34, 0.72], [0.4, 0.5], [0.26, 0.38], [0.44, 0.36], [0.5, 0.14]] };
  MODES.mural = {
    init() { return { bx: 0.5, by: 0.86, i: 0, done: 0, sparks: [], said: 0, idle: 0 }; },
    autoResult: () => true,
    report: s => ({ point: s.i, of: MU.pts.length, bx: s.bx, by: s.by, done: s.done }),
    step(s, input, c) {
      if (c.t === 40) say('caelum', 'Show me what you see when you look at this wall.');
      if (s.done) { s.done++; if (s.done === 30) say('caelum', '...Oh.', 120); if (s.done > 170) M.end(true); return; }
      const ax = (input.held.right ? 1 : 0) - (input.held.left ? 1 : 0), ay = (input.held.down ? 1 : 0) - (input.held.up ? 1 : 0);
      s.bx = Math.max(0.05, Math.min(0.95, s.bx + ax * 0.0062)); s.by = Math.max(0.05, Math.min(0.95, s.by + ay * 0.011));
      if (ax || ay) { if (c.t % 7 === 0) SH.sfx.play('paint'); } else s.idle++;
      const p = MU.pts[s.i], dx = (s.bx - p[0]) * 1.8, dy = s.by - p[1];
      if (dx * dx + dy * dy < 0.0022) {
        s.i++; SH.sfx.play('mote');
        for (let k = 0; k < 10; k++) s.sparks.push({ x: p[0], y: p[1], vx: rnd(-0.006, 0.006), vy: rnd(-0.012, 0.004), life: 30 });
        if (s.i === 5 && !s.said) { s.said = 1; say('caelum', 'You paint the way you fight. No hesitating.'); }
        if (s.i >= MU.pts.length) { s.done = 1; SH.sfx.play('mural'); SH.fx.kick(3); }
      }
      for (const sp of s.sparks) { sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.0006; sp.life--; }
      s.sparks = s.sparks.filter(sp => sp.life > 0);
    },
    draw(ctx, s, vw, VH, c) {
      const t = c.t, X = u => 30 + u * (vw - 60), Y = v => 16 + v * (VH - 70);
      // the wall: old plaster over brick, soot at the edges, a lantern's light on it
      ctx.fillStyle = '#17142e'; ctx.fillRect(0, 0, vw, VH);
      for (let r = 0; r < 20; r++) for (let q = -1; q < vw / 32 + 1; q++) { const bx = q * 32 + (r % 2) * 16, by = r * 16; ctx.fillStyle = SH.shade('#2a2650', 0.8 + ((q * 7 + r * 13) % 5) * 0.06); ctx.fillRect(bx, by, 31, 15); ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(bx, by, 31, 1); }
      const lg = ctx.createRadialGradient(vw / 2, VH * 0.42, 20, vw / 2, VH * 0.42, vw * 0.6); lg.addColorStop(0, 'rgba(255,210,150,0.16)'); lg.addColorStop(1, 'rgba(4,4,14,0.6)'); ctx.fillStyle = lg; ctx.fillRect(0, 0, vw, VH);
      // the painting, revealed as far as the brush has gone
      const prog = s.done ? 1 : s.i / MU.pts.length, full = s.done ? Math.min(1, s.done / 50) : 0;
      if (s.i > 1) {
        ctx.save(); ctx.beginPath(); for (let k = 0; k < s.i && k < MU.pts.length; k++) { const p = MU.pts[k]; k ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); } ctx.closePath(); ctx.clip();
        const sg = ctx.createRadialGradient(X(0.5), Y(0.45), 4, X(0.5), Y(0.45), 150); sg.addColorStop(0, '#fff6d8'); sg.addColorStop(0.35, '#ffd27a'); sg.addColorStop(1, '#8a6aff'); ctx.fillStyle = sg; ctx.globalAlpha = 0.55 + full * 0.45; ctx.fillRect(0, 0, vw, VH); ctx.globalAlpha = 1;
        ctx.restore();
      }
      if (full > 0) {   // finished: the night sky and the rooftops bloom out round the star
        ctx.globalAlpha = full;
        for (let k = 0; k < 40; k++) { ctx.fillStyle = k % 3 ? '#b9a8ff' : '#fff6d8'; ctx.fillRect(X(((k * 0.137) % 1)), Y(((k * 0.291) % 0.7)), 2, 2); }
        ctx.fillStyle = '#2c3d74'; for (let k = 0; k < 14; k++) { const bw = (vw - 60) / 14, bh = 18 + (k * 23) % 30; ctx.fillRect(30 + k * bw, Y(1) - bh + 20, bw - 2, bh); ctx.fillStyle = '#ffd27a'; ctx.fillRect(30 + k * bw + 4, Y(1) - bh + 26, 3, 3); ctx.fillStyle = '#2c3d74'; }
        ctx.strokeStyle = '#4ad8c8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(0.5), Y(0.45), 96 * full, 0, 6.3); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      // the chalk guide, the painted line, the next point
      ctx.setLineDash([3, 5]); ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 1; ctx.beginPath(); MU.pts.forEach((p, k) => k ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#ffd27a'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
      for (let k = 0; k < s.i && k < MU.pts.length; k++) { const p = MU.pts[k]; k ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); }
      if (s.i > 0 && !s.done) ctx.lineTo(X(s.bx), Y(s.by)); ctx.stroke();
      if (!s.done) {
        MU.pts.forEach((p, k) => { if (k < s.i) return; const nx = k === s.i, r = nx ? 6 + Math.sin(t * 0.15) * 2 : 3; ctx.fillStyle = nx ? '#fff6d8' : 'rgba(255,255,255,0.4)'; ctx.fillRect(X(p[0]) - r / 2, Y(p[1]) - r / 2, r, r); if (nx) { ctx.strokeStyle = '#ffd27a'; ctx.lineWidth = 1; ctx.strokeRect(X(p[0]) - 9, Y(p[1]) - 9, 18, 18); } });
        // the brush
        const bx = X(s.bx), by = Y(s.by); ctx.fillStyle = '#0a0818'; ctx.fillRect(bx - 3, by - 3, 20, 7); ctx.fillStyle = '#7a5638'; ctx.fillRect(bx + 4, by - 2, 12, 5); ctx.fillStyle = '#ffd27a'; ctx.fillRect(bx - 2, by - 2, 6, 5); ctx.fillStyle = '#fff6d8'; ctx.fillRect(bx - 2, by - 2, 2, 2);
      }
      for (const sp of s.sparks) { ctx.fillStyle = sp.life % 2 ? '#ffd27a' : '#fff6d8'; ctx.fillRect(X(sp.x), Y(sp.y), 2, 2); }
      if (!s.done) plate(ctx, s.i === 0 ? 'MOVE THE BRUSH TO THE BRIGHT POINT' : 'FOLLOW THE CHALK. ' + s.i + ' OF ' + MU.pts.length, vw, 8, '#fff6d8');
      else if (s.done > 60) plate(ctx, 'THE FIRST MURAL', vw, 8, '#ffd27a');
    },
  };

  // ================================================================ CITY: from above
  // The Lamp Square at night. Whoever Wren walks up to is who she spends the evening with.
  const CI = { w: 420, h: 300 };
  MODES.city = {
    skippable: false,
    init(o) {
      const spots = o.spots.map((sp, i) => Object.assign({ x: [150, 70, 350, 270][i], y: [78, 176, 176, 78][i] }, sp));
      return { x: 210, y: 230, f: 1, walk: 0, spots, near: -1, pick: -1, pickT: 0 };
    },
    autoResult: () => (SH.test && SH.test.choice) || 0,
    report: s => ({ x: s.x, y: s.y, near: s.near, spots: s.spots.map(p => ({ who: p.who, x: p.x, y: p.y })) }),
    step(s, input, c) {
      if (c.t === 30) say('wren', 'The whole square is lit. I could go anywhere tonight.', 170);
      if (s.pick >= 0) { if (++s.pickT > 40) M.end(s.pick); return; }
      const ax = (input.held.right ? 1 : 0) - (input.held.left ? 1 : 0), ay = (input.held.down ? 1 : 0) - (input.held.up ? 1 : 0), n = Math.hypot(ax, ay) || 1;
      const nx = s.x + ax / n * 1.9, ny = s.y + ay / n * 1.5;
      const blocked = (x, y) => x < 24 || x > CI.w - 24 || y < 96 || y > CI.h - 14 || (Math.abs(x - 210) < 26 && Math.abs(y - 176) < 16);   // walls and the lamp's plinth
      if (!blocked(nx, s.y)) s.x = nx; if (!blocked(s.x, ny)) s.y = ny;
      if (ax) s.f = ax; if (ax || ay) s.walk++; else s.walk = 0;
      s.near = s.spots.findIndex(p => Math.hypot(p.x - s.x, (p.y + 26 - s.y) * 1.3) < 34);
      if (s.near >= 0 && (input.pressed.jump || input.pressed.attack || input.pressed.up && !ay)) { s.pick = s.near; SH.sfx.play('select'); }
    },
    draw(ctx, s, vw, VH, c) {
      const t = c.t, ox = Math.round(vw / 2 - CI.w / 2), oy = Math.round((VH - CI.h) / 2);
      ctx.fillStyle = '#07061a'; ctx.fillRect(0, 0, vw, VH);
      ctx.save(); ctx.translate(ox, oy);
      // cobbles, laid in rings round the lamp
      for (let y = 96; y < CI.h; y += 12) for (let x = 0; x < CI.w; x += 16) { const off = (y / 12 % 2) * 8, d = Math.hypot(x - 210, (y - 176) * 1.4); ctx.fillStyle = SH.shade('#2a2650', 0.75 + ((x * 3 + y * 7) % 5) * 0.06 + Math.max(0, 0.5 - d / 300)); ctx.fillRect(x + off - 8, y, 15, 11); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x + off - 8, y, 15, 1); }
      // house fronts along the top, with a lit door for each place
      ctx.fillStyle = '#16122e'; ctx.fillRect(0, 0, CI.w, 96);
      for (let i = 0; i < 7; i++) { const bx = i * 60; ctx.fillStyle = SH.shade('#241f48', 0.8 + (i % 3) * 0.12); ctx.fillRect(bx + 2, 14 + (i % 2) * 8, 56, 82); ctx.fillStyle = '#0a0818'; ctx.fillRect(bx + 2, 12 + (i % 2) * 8, 56, 4); for (let wy = 0; wy < 2; wy++) for (let wx = 0; wx < 2; wx++) { ctx.fillStyle = (i + wx + wy) % 3 ? '#ffd27a' : '#3a3470'; ctx.fillRect(bx + 12 + wx * 24, 28 + wy * 22 + (i % 2) * 8, 9, 11); } }
      const door = (x, y, col) => { ctx.fillStyle = '#0a0818'; ctx.fillRect(x - 13, y - 30, 26, 32); ctx.fillStyle = col; ctx.fillRect(x - 11, y - 28, 22, 30); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(x - 11, y - 28, 22, 2); const gl = ctx.createRadialGradient(x, y + 6, 2, x, y + 6, 46); gl.addColorStop(0, 'rgba(255,210,122,0.35)'); gl.addColorStop(1, 'rgba(255,210,122,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 46, y - 40, 92, 92); };
      // the First Lamp in the middle
      const things = [];
      things.push({ y: 190, draw() { ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(210, 190, 28, 9, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = '#3a3470'; ctx.fillRect(190, 172, 40, 16); ctx.fillStyle = '#4a4488'; ctx.fillRect(190, 172, 40, 3); ctx.fillStyle = '#16122e'; ctx.fillRect(207, 122, 6, 52); ctx.fillStyle = '#ffd27a'; ctx.fillRect(202, 108, 16, 16); ctx.fillStyle = '#fff6d8'; ctx.fillRect(206, 112, 8, 8); const gl = ctx.createRadialGradient(210, 116, 4, 210, 116, 90 + Math.sin(t * 0.08) * 4); gl.addColorStop(0, 'rgba(255,214,130,0.45)'); gl.addColorStop(1, 'rgba(255,214,130,0)'); ctx.fillStyle = gl; ctx.fillRect(110, 16, 200, 200); } });
      s.spots.forEach((p, i) => {
        if (p.y < 100) door(p.x, 96, '#7a4a2a');
        things.push({ y: p.y + 26, draw() {
          if (p.y >= 100) { ctx.fillStyle = '#0a0818'; ctx.fillRect(p.x - 22, p.y - 6, 44, 34); ctx.fillStyle = i % 2 ? '#3a2a5a' : '#5a2a3a'; ctx.fillRect(p.x - 20, p.y - 4, 40, 30); ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(p.x - 20, p.y - 4, 40, 2); ctx.fillStyle = '#ffd27a'; ctx.fillRect(p.x - 3, p.y + 6, 6, 8); }
          SH.people.draw(ctx, { id: p.who, x: p.x, y: p.y + 30, facing: s.x > p.x ? 1 : -1, near: s.near === i, bubble: s.near !== i, emote: s.pick === i ? { e: 'heart', t: 20 } : null }, t);
        } });
      });
      things.push({ y: s.y, draw() { SH.people.draw(ctx, { id: 'wren', x: s.x, y: s.y + (s.walk && Math.floor(s.walk / 6) % 2 ? -1 : 0), facing: s.f }, s.walk ? 0 : t); } });
      things.sort((a, b) => a.y - b.y).forEach(th => th.draw());
      ctx.restore();
      // the night around the square
      const vg = ctx.createRadialGradient(vw / 2, VH / 2, 110, vw / 2, VH / 2, vw * 0.62); vg.addColorStop(0, 'rgba(4,4,16,0)'); vg.addColorStop(1, 'rgba(4,4,16,0.75)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, vw, VH);
      plate(ctx, c.opts.title || 'THE LAMP SQUARE', vw, 8, '#ffd27a');
      if (s.near >= 0 && s.pick < 0) plate(ctx, 'SPEND THE EVENING ' + s.spots[s.near].label.toUpperCase() + '  -  PRESS JUMP', vw, VH - 26, '#fff6d8');
      else if (s.pick < 0 && cap.t <= 0) plate(ctx, 'WALK UP TO SOMEONE', vw, VH - 26, '#b9b2dd');
      if (s.pick >= 0) { ctx.fillStyle = 'rgba(5,5,13,' + Math.min(1, s.pickT / 36) + ')'; ctx.fillRect(0, 0, vw, VH); }
    },
  };

  SH.modes = M;
})(window.SH = window.SH || {});
