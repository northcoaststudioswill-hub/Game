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
    const C = SH.STORY.CAST[cap.who], k = Math.min(1, cap.t / 10), w = Math.min(vw - 40, 440), x = Math.round(vw / 2 - w / 2);
    ctx.font = '600 12px system-ui, sans-serif'; ctx.textAlign = 'left';
    const lines = []; let line = '';
    for (const wd of cap.text.split(' ')) { if (ctx.measureText(line + wd).width > w - 62) { lines.push(line); line = ''; } line += wd + ' '; }
    lines.push(line);
    const h = Math.max(46, 22 + lines.length * 14), y = VH - 16 - h;
    ctx.globalAlpha = k;
    ctx.fillStyle = '#0a0818'; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.fillStyle = '#1c1838'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = C.color; ctx.fillRect(x, y, w, 1);
    ctx.drawImage(SH.art.portrait(cap.who, Math.floor(cap.t / 7) % 2 ? 'talk' : undefined), x + 3, y + 3, 40, 40);
    SH.ptext(ctx, C.name, x + 50, y + 5, C.color, 1);
    ctx.fillStyle = '#f2eeff'; lines.forEach((ln, i) => ctx.fillText(ln, x + 50, y + 24 + i * 14));
    ctx.globalAlpha = 1;
  }
  function plate(ctx, text, vw, y, col) { const tw = SH.ptextW(text, 2); ctx.fillStyle = 'rgba(10,8,24,0.8)'; ctx.fillRect(vw / 2 - tw / 2 - 8, y - 4, tw + 16, 18); SH.ptext(ctx, text, Math.round(vw / 2 - tw / 2), y, col || '#fff6d8', 2); }
  const rnd = (a, b) => a + Math.random() * (b - a);

  const MODES = {};

  // ================================================================ FLIGHT: into the screen
  const FLY = { frames: 2640 };
  FLY.lines = [
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
  // The same way of seeing, a different night: Rowan's horse through the winter pines, to the Wall. { variant: 'wall' }
  const RD = { frames: 1700 };
  RD.lines = [
    [60, 'rowan', 'Hold on to the mane. She knows the way better than I do.'],
    [300, 'wren', 'The stories say nobody crosses the Wall and comes back.'],
    [520, 'rowan', 'The stories are five hundred years old. So is the Wall. We built it, your kind and mine, after the last war.'],
    [800, 'rowan', 'Seven courts on the far side. Spring is mine. You will be safe in it.'],
    [1040, 'wren', 'Safe. You keep using that word.'],
    [1250, 'rowan', 'There. The light between the trees. Do not shut your eyes: it is only cold for a moment.'],
    [1500, 'wren', 'It\'s warm. Why is it warm?'],
  ];
  MODES.flight = {
    init(o) { return { v: o && o.variant === 'wall' ? 'wall' : 'fly', x: 0, y: 0, vx: 0, vy: 0, objs: [], stars: 0, hits: 0, flash: 0, tilt: 0, li: 0, bgStars: Array.from({ length: 70 }, () => [Math.random(), Math.random() * 0.6, Math.random() * 6]) }; },
    autoResult: s => ({ stars: s.stars, hits: s.hits }),
    report: s => ({ stars: s.stars, hits: s.hits, objs: s.objs.length, x: s.x, y: s.y }),
    step(s, input, c) {
      const wall = s.v === 'wall', FL = wall ? RD : FLY;
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
        if (wall) { if (t > 340 && t < FL.frames - 330 && t % 40 === 0) { const gap = Math.sin(t * 0.008) * 0.75; for (const cxp of [-1, -0.5, 0, 0.5, 1]) if (Math.abs(cxp - gap) > 0.45) spawn('cloud', cxp + rnd(-0.08, 0.08), rnd(-0.15, 0.45)); } }
        else if (t > 620 && t < 1420 && t % (t > 1000 ? 34 : 46) === 0) spawn('arrow', Math.random() < 0.6 ? s.x + rnd(-0.15, 0.15) : rnd(-0.9, 0.9), rnd(-0.6, 0.6));
        if (!wall && t > 1540 && t < 2250 && t % 38 === 0) { const gap = Math.sin(t * 0.006) * 0.7; for (const cxp of [-1, -0.5, 0, 0.5, 1]) if (Math.abs(cxp - gap) > 0.42) spawn('cloud', cxp + rnd(-0.08, 0.08), rnd(-0.5, 0.5)); }
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
            if (s.hits === 1 && wall) say('rowan', 'Keep low. The old pines do not like mortals.', 150);
            else if (s.hits === 1) say('caelum', o.kind === 'arrow' ? 'I have you. I have you. It only nicked the wing.' : 'I\'ve flown through worse. Hold on to me.', 150);
          }
        }
      }
      s.objs = s.objs.filter(o => o.z > -0.05 && !o.got);
      if (t >= FL.frames) M.end({ stars: s.stars, hits: s.hits });
    },
    draw(ctx, s, vw, VH, c) {
      const wall = s.v === 'wall', FL = wall ? RD : FLY;
      const PAL = wall ? { a0: [8, 12, 34], a1: [20, 30, 70], b0: [40, 60, 110], b1: [120, 200, 190], m0: [14, 26, 34], m1: [10, 40, 44], s0a: [190, 205, 235], s0b: [225, 240, 245], s1a: [90, 110, 160], s1b: [150, 190, 200] }
        : { a0: [40, 26, 70], a1: [8, 8, 30], b0: [214, 120, 150], b1: [52, 44, 110], m0: [90, 50, 90], m1: [20, 18, 52], s0a: [150, 90, 130], s0b: [34, 34, 90], s1a: [40, 30, 70], s1b: [6, 8, 26] };
      const t = c.t, hz = Math.round(VH * 0.56 - s.y * 26), k = t / FL.frames, cx = vw / 2;
      // sky: Spring's rose dusk behind them gives way to Dusk's deep violet
      const g = ctx.createLinearGradient(0, 0, 0, hz);
      const mix = (a, b) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * Math.min(1, k * 1.6))).join(',') + ')';
      g.addColorStop(0, mix(PAL.a0, PAL.a1)); g.addColorStop(1, mix(PAL.b0, PAL.b1));
      ctx.fillStyle = g; ctx.fillRect(0, 0, vw, hz);
      for (const b of s.bgStars) { ctx.globalAlpha = (0.3 + 0.7 * Math.abs(Math.sin(t * 0.03 + b[2]))) * Math.min(1, 0.25 + k * 1.5); ctx.fillStyle = '#fff6d8'; ctx.fillRect(((b[0] * vw * 1.4 - s.x * 30) % (vw + 20) + vw + 20) % (vw + 20) - 10, b[1] * hz, 2, 2); }
      ctx.globalAlpha = 1;
      const mx = cx + 150 - s.x * 40, my = hz * 0.34;
      const mg = ctx.createRadialGradient(mx, my, 6, mx, my, 70); mg.addColorStop(0, 'rgba(255,246,216,0.5)'); mg.addColorStop(1, 'rgba(255,246,216,0)'); ctx.fillStyle = mg; ctx.fillRect(mx - 70, my - 70, 140, 140);
      ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(mx, my, 20, 0, 6.3); ctx.fill(); ctx.fillStyle = mix(PAL.b0, PAL.b1); ctx.beginPath(); ctx.arc(mx + 8, my - 5, 18, 0, 6.3); ctx.fill();
      // far mountains, and at the end the lights of Starhaven between them
      if (wall) {   // the Wall itself: a curtain of light across the whole horizon, taller as they come to it
        const wk = Math.max(0, (t - 500) / (FL.frames - 500)), wh = 30 + wk * wk * (hz + 40);
        for (let i = 0; i < 40; i++) { const bx = (i / 40) * (vw + 60) - 30 - s.x * 20, ph = Math.sin(t * 0.03 + i * 0.7), col = i % 3 === 0 ? '160,255,220' : i % 3 === 1 ? '150,190,255' : '220,170,255';
          const gr = ctx.createLinearGradient(0, hz - wh, 0, hz); gr.addColorStop(0, 'rgba(' + col + ',0)'); gr.addColorStop(0.6, 'rgba(' + col + ',' + (0.1 + wk * 0.3 + ph * 0.06) + ')'); gr.addColorStop(1, 'rgba(' + col + ',' + (0.25 + wk * 0.5) + ')');
          ctx.fillStyle = gr; ctx.fillRect(bx + ph * 6, hz - wh, (vw + 60) / 40 + 1, wh); }
      }
      ctx.fillStyle = mix(PAL.m0, PAL.m1);
      if (wall) for (let i = -2; i < 40; i++) { const bx = i * 26 - ((s.x * 60 + t * 0.4) % 26), h = 26 + ((i * 53) % 31 + 31) % 31; ctx.beginPath(); ctx.moveTo(bx, hz); ctx.lineTo(bx + 9, hz - h); ctx.lineTo(bx + 18, hz); ctx.fill(); }
      else for (let i = -2; i < 14; i++) { const bx = i * 90 - ((s.x * 60 + t * 0.05) % 90), h = 22 + ((i * 53) % 37 + 37) % 37; ctx.beginPath(); ctx.moveTo(bx, hz); ctx.lineTo(bx + 45, hz - h); ctx.lineTo(bx + 100, hz); ctx.fill(); }
      const near = Math.max(0, (t - (FL.frames - 760)) / 760);
      if (near > 0 && !wall) {
        const cw = 60 + near * 220, cxx = cx - s.x * 30;
        const gl = ctx.createRadialGradient(cxx, hz, 4, cxx, hz, cw); gl.addColorStop(0, 'rgba(255,210,122,' + (0.7 * near) + ')'); gl.addColorStop(1, 'rgba(255,210,122,0)'); ctx.fillStyle = gl; ctx.fillRect(cxx - cw, hz - cw, cw * 2, cw);
        for (let i = 0; i < 26; i++) { const bw = 5 + (i * 7) % 9, bh = (8 + (i * 13) % 26) * (0.3 + near), bx = cxx - cw * 0.7 + i * cw * 1.4 / 26; ctx.fillStyle = '#16122e'; ctx.fillRect(bx, hz - bh, bw * (0.4 + near), bh); if (i % 2) { ctx.fillStyle = '#ffd27a'; ctx.fillRect(bx + 1, hz - bh + 3, 2, 2); ctx.fillRect(bx + 1, hz - bh * 0.5, 2, 2); } }
      }
      // the sea below, rushing toward us
      const sg = ctx.createLinearGradient(0, hz, 0, VH); sg.addColorStop(0, mix(PAL.s0a, PAL.s0b)); sg.addColorStop(1, mix(PAL.s1a, PAL.s1b)); ctx.fillStyle = sg; ctx.fillRect(0, hz, vw, VH - hz);
      for (let i = 0; i < 9; i++) { const zz = ((i / 9 + t * 0.012) % 1), yy = hz + (VH - hz) * zz * zz; ctx.fillStyle = 'rgba(255,255,255,' + (0.05 + zz * 0.1) + ')'; for (let j = -6; j < 7; j++) { const xx = cx + (j * 70 - s.x * 80) * (0.25 + zz * 1.6); ctx.fillRect(xx, yy, 14 * (0.3 + zz), 1 + zz); } }
      // speed: faint streaks pulled out from the middle of the picture
      for (let i = 0; i < 14; i++) { const a = i * 0.449 + 0.2, ph = ((t * 0.02 + i * 0.37) % 1), r0 = 40 + ph * vw * 0.5, r1 = r0 + 10 + ph * 40; ctx.strokeStyle = 'rgba(255,255,255,' + (0.03 + ph * 0.1) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - s.x * 30 + Math.cos(a) * r0, VH * 0.5 + Math.sin(a) * r0 * 0.6); ctx.lineTo(cx - s.x * 30 + Math.cos(a) * r1, VH * 0.5 + Math.sin(a) * r1 * 0.6); ctx.stroke(); }
      // things in the air, far ones first
      const P = o => { const sc = 1 / (0.16 + o.z * 3.2); return [cx + (o.x - s.x * 0.85) * vw * 0.3 * sc * 0.42, VH * 0.5 + (o.y - s.y * 0.85) * VH * 0.5 * sc * 0.42, sc]; };
      for (const o of s.objs.slice().sort((a, b) => b.z - a.z)) {
        const [x, y, sc] = P(o), a = Math.min(1, (1 - o.z) * 3);
        ctx.globalAlpha = a;
        if (o.kind === 'star') { const r = 2 + sc * 2.2; ctx.fillStyle = 'rgba(255,210,122,0.35)'; ctx.fillRect(x - r * 1.6, y - r * 1.6, r * 3.2, r * 3.2); ctx.fillStyle = '#ffd27a'; ctx.fillRect(x - r / 3, y - r, r * 0.66, r * 2); ctx.fillRect(x - r, y - r / 3, r * 2, r * 0.66); ctx.fillStyle = '#fff6d8'; ctx.fillRect(x - r / 3, y - r / 3, r * 0.66, r * 0.66); }
        else if (o.kind === 'arrow') { const r = 1 + sc * 1.6; ctx.strokeStyle = '#e8c070'; ctx.lineWidth = Math.max(1, r * 0.5); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (x - cx) * 0.12 * o.z * 6, y - 26 * o.z * 3); ctx.stroke(); ctx.fillStyle = '#7ac05a'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fill(); ctx.fillStyle = '#fff6d8'; ctx.fillRect(x - 1, y - 1, 2, 2); }
        else if (wall) { const r = 8 + sc * 13; ctx.globalAlpha = a; ctx.fillStyle = '#2a1c14'; ctx.fillRect(x - r * 0.12, y, r * 0.24, r * 1.6); for (let q = 0; q < 3; q++) { ctx.fillStyle = q ? '#123028' : '#0c241e'; ctx.beginPath(); ctx.moveTo(x, y - r * (1.5 - q * 0.5)); ctx.lineTo(x - r * (0.6 + q * 0.3), y + r * (q * 0.5)); ctx.lineTo(x + r * (0.6 + q * 0.3), y + r * (q * 0.5)); ctx.fill(); ctx.fillStyle = '#e8f0ff'; ctx.fillRect(x - r * 0.3, y - r * (1.1 - q * 0.5), r * 0.6, Math.max(1, r * 0.1)); } }
        else { const r = 7 + sc * 11; ctx.globalAlpha = a * 0.78; ctx.fillStyle = '#2a2452'; ctx.beginPath(); ctx.ellipse(x, y - r * 0.25, r * 1.3, r * 0.8, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = '#14102c'; ctx.beginPath(); ctx.ellipse(x, y, r * 1.5, r, 0, 0, 6.3); ctx.ellipse(x + r, y + r * 0.2, r, r * 0.7, 0, 0, 6.3); ctx.ellipse(x - r, y + r * 0.3, r * 1.1, r * 0.7, 0, 0, 6.3); ctx.fill(); if ((t + (o.x * 100 | 0)) % 50 < 4) { ctx.strokeStyle = '#cfd6ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - r * 0.4); ctx.lineTo(x - 5, y + r * 0.2); ctx.lineTo(x + 4, y + r * 0.3); ctx.lineTo(x - 2, y + r); ctx.stroke(); } }
      }
      ctx.globalAlpha = 1;
      // Caelum from behind, wings spread, Wren in his arms
      const fxp = cx + s.x * vw * 0.2, fyp = VH * 0.66 + s.y * VH * 0.14, flap = Math.sin(t * 0.14) * 0.26;
      if (wall && !(s.flash > 0 && Math.floor(s.flash / 4) % 2)) {   // Rowan's white mare from behind, the two of them on her back
        const gy = VH * 0.56 + s.y * VH * 0.05, gal = Math.sin(t * 0.32), R2 = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
        ctx.save(); ctx.translate(fxp, gy + gal * 2); ctx.rotate(s.tilt * 0.35);
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 44, 34, 6, 0, 0, 6.3); ctx.fill();
        R2(-14, 18 + gal * 3, 6, 24, '#c8d0e0'); R2(8, 18 - gal * 3, 6, 24, '#c8d0e0'); R2(-14, 40 + gal * 3, 6, 3, '#2a2420'); R2(8, 40 - gal * 3, 6, 3, '#2a2420');
        R2(-20, -8, 40, 30, '#0a0818'); R2(-18, -6, 36, 26, '#eef2fa'); R2(-18, -6, 6, 26, '#c8d0e0'); R2(12, -6, 6, 26, '#ffffff');
        for (let q = 0; q < 5; q++) R2(-3 + Math.sin(t * 0.2 + q) * (q + 1), 14 + q * 6, 6, 7, q % 2 ? '#dfe6f2' : '#ffffff');                        // her tail
        R2(-11, -40, 22, 36, '#0a0818'); R2(-9, -38, 18, 32, '#3a6a3a'); R2(-9, -38, 4, 32, '#2a5028'); R2(5, -38, 4, 32, '#4c8648'); R2(-9, -12, 18, 3, '#e8c070');   // Rowan's back, his belt
        R2(-7, -54, 14, 16, '#0a0818'); R2(-6, -53, 12, 14, '#e8c070');                                                                                 // his fair head
        for (const sd of [-1, 1]) { ctx.strokeStyle = '#f2e6c8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sd * 4, -53); ctx.lineTo(sd * 10, -64); ctx.lineTo(sd * 16, -62); ctx.moveTo(sd * 10, -64); ctx.lineTo(sd * 9, -72); ctx.stroke(); }   // antlers
        R2(-17, -34, 8, 14, '#0a0818'); R2(-16, -33, 6, 12, '#e0703f'); R2(-19, -26, 5, 12, '#e0703f'); R2(-15, -20, 5, 6, '#7a5a3a');                    // Wren in front of him: her hair, her old coat
        for (let q = 0; q < 4; q++) { ctx.globalAlpha = 0.5; R2(-30 + q * 20 + gal * 4, 40 + (q % 2) * 4, 3, 3, '#ffffff'); } ctx.globalAlpha = 1;       // snow kicked up
        ctx.restore();
      }
      if (!wall && !(s.flash > 0 && Math.floor(s.flash / 4) % 2)) {
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
      SH.ptext(ctx, (wall ? 'WISPS ' : 'STARLIGHT ') + s.stars, 12, 12, '#ffd27a', 2, '#0a0818');
      if (wall && t > FL.frames - 110) { ctx.fillStyle = 'rgba(255,250,240,' + Math.min(1, (t - (FL.frames - 110)) / 80) + ')'; ctx.fillRect(0, 0, vw, VH); }   // through the Wall
      if (t < 260) plate(ctx, wall ? 'STEER WITH THE STICK. GATHER THE WISPS. LEAN ROUND THE PINES.' : 'STEER WITH THE STICK. GATHER STARLIGHT. LEAN AWAY FROM ARROWS.', vw, 34, '#fff6d8');
      const left = Math.max(0, 1 - k); ctx.fillStyle = '#0a0818'; ctx.fillRect(vw - 112, 12, 100, 7); ctx.fillStyle = '#b9a8ff'; ctx.fillRect(vw - 111, 13, 98 * (1 - left), 5); SH.ptext(ctx, wall ? 'THE WALL' : 'STARHAVEN', vw - 112, 23, '#b9a8ff', 1);
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
  // The square is a flat place seen in depth: the ground runs away from the eye to the house fronts at the back, and
  // everyone on it is drawn larger the nearer they stand. s.x runs 0..420 across; s.y runs 96 (far) to 300 (near).
  const SQ_LORE = [
    { id: 'sq_lamp', x: 210, y: 150, label: 'THE FIRST LAMP', text: 'The First Lamp. Lit the night the city was hidden, and never out since. Everyone who lives here has touched it once: the brass is worn gold at the height of a child\'s hand.' },
    { id: 'sq_names', x: 112, y: 214, label: 'THE STONE OF NAMES', text: 'The Stone of Names. Everyone Starhaven lost to the Thorn Queen, cut small so they all fit. Someone leaves fresh bread at the foot of it every evening.' },
    { id: 'sq_well', x: 316, y: 214, label: 'THE STAR WELL', text: 'The Star Well. You drop a coin and say what you would give up, not what you want. Iris says it has never been wrong. Bram says it is a hole with water in it.' },
  ];
  MODES.city = {
    skippable: false,
    init(o) {
      const spots = o.spots.map((sp, i) => Object.assign({ x: [118, 302, 50, 370][i], y: [70, 70, 150, 150][i] }, sp));
      const folk = Array.from({ length: 7 }, (_, i) => ({ x: Math.random() * 420, y: i < 4 ? 104 + i * 5 : 276 + (i - 4) * 8, v: (0.25 + Math.random() * 0.3) * (i % 2 ? 1 : -1), c: ['#6a4a8a', '#8a4a5a', '#3a6a7a', '#7a6a3a', '#4a5a8a', '#8a5a3a', '#5a7a5a'][i], h: ['#2a1c1a', '#c8a050', '#5a3020', '#d8d0c0', '#1a1a2a', '#7a3a1a', '#3a2a1a'][i] }));
      return { x: 210, y: 262, f: 1, walk: 0, spots, near: -1, pick: -1, pickT: 0, lore: -1, read: {}, folk, stars: Array.from({ length: 80 }, () => [Math.random(), Math.random(), Math.random() * 6]) };
    },
    autoResult: () => (SH.test && SH.test.choice) || 0,
    report: s => ({ x: s.x, y: s.y, near: s.near, lore: s.lore, read: Object.keys(s.read), spots: s.spots.map(p => ({ who: p.who, x: p.x, y: p.y })) }),
    step(s, input, c) {
      if (c.t === 30) say('wren', 'The whole square is lit. I could go anywhere tonight. Or just look around first.', 200);
      if (s.pick >= 0) { if (++s.pickT > 40) M.end(s.pick); return; }
      const ax = (input.held.right ? 1 : 0) - (input.held.left ? 1 : 0), ay = (input.held.down ? 1 : 0) - (input.held.up ? 1 : 0), n = Math.hypot(ax, ay) || 1;
      const nx = s.x + ax / n * 2.1, ny = s.y + ay / n * 1.9;
      const solid = (x, y, px, py, rx, ry) => Math.abs(x - px) < rx && Math.abs(y - py) < ry;
      const blocked = (x, y) => x < 24 || x > CI.w - 24 || y < 96 || y > CI.h - 8 || solid(x, y, 210, 150, 22, 10) || solid(x, y, 112, 214, 16, 8) || solid(x, y, 316, 214, 18, 9);
      if (!blocked(nx, s.y)) s.x = nx; if (!blocked(s.x, ny)) s.y = ny;
      if (ax) s.f = ax; if (ax || ay) s.walk++; else s.walk = 0;
      for (const f of s.folk) { f.x += f.v; if (f.x < -20) f.x = 440; if (f.x > 440) f.x = -20; }
      s.near = s.spots.findIndex(p => Math.hypot(p.x - s.x, (p.y + 26 - s.y) * 1.3) < 34);
      s.lore = s.near >= 0 ? -1 : SQ_LORE.findIndex(p => Math.hypot(p.x - s.x, (p.y + 12 - s.y) * 1.2) < 34);
      const press = input.pressed.jump || input.pressed.attack || (input.pressed.up && !ay);
      if (s.near >= 0 && press) { s.pick = s.near; SH.sfx.play('select'); }
      else if (s.lore >= 0 && press) {
        const L = SQ_LORE[s.lore]; say('wren', L.text, 460); s.read[L.id] = 1;
        const G = SH.game; if (G.progress) { G.progress.seen = G.progress.seen || {}; if (!G.progress.seen[L.id]) { G.progress.seen[L.id] = 1; SH.xp.gain(5); } }
      }
    },
    draw(ctx, s, vw, VH, c) {
      const t = c.t, cx = vw / 2, hz = Math.round(VH * 0.3), F = 240;
      const pr = (x, y) => { const sc = F / (F + (300 - y) * 1.5); return [cx + (x - 210) * 1.55 * sc, hz + 172 * sc, sc]; };
      const quad = (a, b, c2, d, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c2[0], c2[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.fill(); };
      const up = (p, h) => [p[0], p[1] - h * p[2], p[2]];
      const glow = (x, y, r, col) => { const g = ctx.createRadialGradient(x, y, 1, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); };
      // ---- the sky over the roofs: Dusk's violet, the moon, the mountains that hide the city
      const sg = ctx.createLinearGradient(0, 0, 0, hz + 60); sg.addColorStop(0, '#060516'); sg.addColorStop(0.6, '#1a1444'); sg.addColorStop(1, '#4a3478'); ctx.fillStyle = sg; ctx.fillRect(0, 0, vw, VH);
      for (const b of s.stars) { ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.03 + b[2])); ctx.fillStyle = '#fff6d8'; ctx.fillRect(b[0] * vw, b[1] * (hz + 20), b[2] > 5 ? 2 : 1, b[2] > 5 ? 2 : 1); } ctx.globalAlpha = 1;
      glow(cx + 150, 34, 60, 'rgba(255,246,216,0.4)'); ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(cx + 150, 34, 15, 0, 6.3); ctx.fill(); ctx.fillStyle = 'rgba(190,190,225,0.5)'; ctx.beginPath(); ctx.arc(cx + 145, 31, 4, 0, 6.3); ctx.arc(cx + 155, 39, 3, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#15113a'; for (let i = -1; i < 9; i++) { const bx = cx - 340 + i * 96; ctx.beginPath(); ctx.moveTo(bx, hz + 40); ctx.lineTo(bx + 50, hz - 34 - (i * 37 % 26)); ctx.lineTo(bx + 110, hz + 40); ctx.fill(); }
      // ---- the house fronts at the far side of the square
      const b0 = pr(0, 96), b1 = pr(420, 96), bs = b0[2];
      for (let i = -2; i < 9; i++) {
        const x0 = cx + (i * 60 - 210) * 1.55 * bs, w = 60 * 1.55 * bs, h = (150 + (i * 53 % 3 + 3) % 3 * 26) * bs, y0 = b0[1];
        ctx.fillStyle = SH.shade('#2a2456', 0.85 + ((i + 4) % 3) * 0.1); ctx.fillRect(x0, y0 - h, w - 1, h);
        ctx.fillStyle = '#120e2c'; ctx.beginPath(); ctx.moveTo(x0 - 2, y0 - h); ctx.lineTo(x0 + w / 2, y0 - h - 16 * bs * 2); ctx.lineTo(x0 + w + 1, y0 - h); ctx.fill();
        for (let wy = 0; wy < 3; wy++) for (let wx = 0; wx < 2; wx++) { const lit = ((i * 7 + wy * 3 + wx) % 4 + 4) % 4 !== 0, fl = 0.75 + 0.25 * Math.sin(t * 0.03 + i + wy * 2 + wx); ctx.fillStyle = lit ? 'rgba(255,210,122,' + fl + ')' : '#0e0a24'; ctx.fillRect(x0 + w * (0.2 + wx * 0.38), y0 - h + (10 + wy * 22) * bs * 2, w * 0.2, 9 * bs * 2); }
      }
      // ---- the ground: cobbles running away from the eye, gold where the lamp reaches
      quad(pr(-90, 96), pr(510, 96), pr(510, 345), pr(-90, 345), '#1e1a40');
      for (let y = 96; y < 345; y += 9) { const a = pr(-90, y), b = pr(510, y), e = pr(-90, y + 9); ctx.fillStyle = (y / 9 | 0) % 2 ? 'rgba(90,84,160,0.16)' : 'rgba(10,8,30,0.2)'; ctx.fillRect(a[0], a[1], b[0] - a[0], Math.max(1, e[1] - a[1])); }
      ctx.strokeStyle = 'rgba(10,8,30,0.35)'; ctx.lineWidth = 1; for (let x = -80; x <= 500; x += 20) { const a = pr(x, 96), b = pr(x, 345); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      { const L = pr(210, 156); ctx.save(); ctx.translate(L[0], L[1]); ctx.scale(1, 0.36); const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 210 * L[2]); g.addColorStop(0, 'rgba(255,210,122,0.5)'); g.addColorStop(0.5, 'rgba(255,190,110,0.16)'); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.fillRect(-300, -300, 600, 600);
        ctx.strokeStyle = 'rgba(255,210,122,0.2)'; ctx.lineWidth = 2; for (const r of [60, 110, 170]) { ctx.beginPath(); ctx.arc(0, 0, r * L[2], 0, 6.3); ctx.stroke(); } ctx.restore(); }
      // ---- the houses down each side, getting larger as they come toward us
      for (const sd of [0, 1]) for (let k = 0; k < 4; k++) {
        const X = sd ? 440 : -20, ya = 96 + k * 54, yb = ya + 54, a = pr(X, ya), b = pr(X, yb), h = 170 + (k * 31 + sd * 17) % 50, outX = sd ? vw + 40 : -40;
        quad(a, b, up(b, h), up(a, h), SH.shade(sd ? '#2c2458' : '#262052', 0.7 + k * 0.1));
        quad(up(a, h), up(b, h), [outX, up(b, h)[1] - 30], [outX, up(a, h)[1] - 30], '#0e0a24');
        const dz = 0.5, m = pr(X, ya + 27), mh = 54 * m[2];
        ctx.fillStyle = '#0a0818'; ctx.fillRect(m[0] - (sd ? 0 : 10 * m[2]), m[1] - mh, 10 * m[2], mh);                                   // a doorway
        const wn = pr(X, ya + 14), fl = 0.7 + 0.3 * Math.sin(t * 0.04 + k * 2 + sd); ctx.fillStyle = 'rgba(255,200,120,' + fl + ')'; ctx.fillRect(wn[0] - (sd ? 0 : 7 * wn[2]), wn[1] - 120 * wn[2], 7 * wn[2], 26 * wn[2]);
        glow(wn[0], wn[1] - 106 * wn[2], 30 * wn[2], 'rgba(255,200,120,0.25)');
      }
      // ---- strings of lanterns across the square, at three depths
      for (const [y, h, n] of [[110, 150, 7], [170, 170, 6], [240, 200, 5]]) {
        const a = up(pr(-20, y), h), b = up(pr(440, y), h), sag = 26 * a[2];
        ctx.strokeStyle = 'rgba(10,8,24,0.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(cx, a[1] + sag * 2, b[0], b[1]); ctx.stroke();
        for (let i = 1; i <= n; i++) { const u = i / (n + 1), lx = a[0] + (b[0] - a[0]) * u + Math.sin(t * 0.03 + i + y) * 1.5, ly = a[1] + sag * 4 * u * (1 - u) * 1 + 2, r = 3 * a[2] + 1.5, col = ['#ffd27a', '#ff9ac0', '#b9a8ff', '#9fe8ff'][(i + (y | 0)) % 4];
          glow(lx, ly + r, r * 5, 'rgba(255,210,150,0.3)'); ctx.fillStyle = col; ctx.fillRect(lx - r, ly, r * 2, r * 2.4); ctx.fillStyle = '#fff6d8'; ctx.fillRect(lx - r / 2, ly + r * 0.6, r, r); }
      }
      // ---- everything standing on the square, far to near
      const things = [];
      const sprite = (x, y, fn) => things.push({ y, draw() { const p = pr(x, y), k = p[2] * 1.75; ctx.save(); ctx.translate(Math.round(p[0]), Math.round(p[1])); ctx.scale(k, k); fn(p); ctx.restore(); } });
      const shadow = (rx) => { ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 0, rx, rx * 0.3, 0, 0, 6.3); ctx.fill(); };
      sprite(210, 150, p => {   // the First Lamp: a brass post on a stepped plinth, older than anything round it
        shadow(22); ctx.fillStyle = '#3a3470'; ctx.fillRect(-16, -6, 32, 6); ctx.fillStyle = '#4a4488'; ctx.fillRect(-12, -11, 24, 5); ctx.fillStyle = '#5a54a0'; ctx.fillRect(-12, -11, 24, 1);
        ctx.fillStyle = '#8a6a2a'; ctx.fillRect(-2, -58, 4, 47); ctx.fillStyle = '#e8c070'; ctx.fillRect(-2, -30, 4, 6); ctx.fillStyle = '#c8a050'; ctx.fillRect(-7, -60, 14, 3);
        const fl = 0.85 + 0.15 * Math.sin(t * 0.2) * Math.sin(t * 0.07); glow(0, -68, 46 * fl, 'rgba(255,220,150,0.75)'); ctx.fillStyle = '#ffd27a'; ctx.fillRect(-5, -74, 10, 13); ctx.fillStyle = '#fff6d8'; ctx.fillRect(-2, -71, 4, 7); ctx.fillStyle = '#8a6a2a'; ctx.fillRect(-6, -76, 12, 2);
        for (let i = 0; i < 4; i++) { const a = t * 0.02 + i * 1.6, r = 14 + Math.sin(t * 0.05 + i) * 4; ctx.fillStyle = 'rgba(255,230,160,0.8)'; ctx.fillRect(Math.cos(a) * r, -68 + Math.sin(a) * r * 0.6, 1, 1); }   // moths
      });
      sprite(112, 214, () => {   // the Stone of Names, with the bread somebody always leaves
        shadow(14); ctx.fillStyle = '#4a4668'; ctx.fillRect(-9, -34, 18, 34); ctx.fillStyle = '#5c5880'; ctx.fillRect(-9, -34, 18, 2); ctx.fillStyle = '#4a4668'; ctx.beginPath(); ctx.arc(0, -34, 9, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#2a2644'; for (let r = 0; r < 9; r++) ctx.fillRect(-6 + (r % 2), -30 + r * 3, 11 - (r % 3), 1);
        ctx.fillStyle = '#c89a5a'; ctx.fillRect(-13, -4, 7, 4); ctx.fillStyle = '#e8c070'; ctx.fillRect(-13, -4, 7, 1); ctx.fillStyle = '#fff6d8'; ctx.fillRect(8, -7, 2, 7); glow(9, -9, 8, 'rgba(255,210,122,0.6)'); ctx.fillStyle = '#ffb057'; ctx.fillRect(8, -9, 2, 2);
      });
      sprite(316, 214, () => {   // the Star Well
        shadow(18); ctx.fillStyle = '#3a3660'; ctx.fillRect(-14, -12, 28, 12); ctx.fillStyle = '#4c487a'; ctx.fillRect(-14, -12, 28, 2); for (let i = 0; i < 4; i++) { ctx.fillStyle = '#2a2648'; ctx.fillRect(-14 + i * 7, -10, 1, 10); }
        ctx.fillStyle = '#0a1030'; ctx.fillRect(-11, -11, 22, 3); for (let i = 0; i < 4; i++) { ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.06 + i * 2)); ctx.fillStyle = '#fff6d8'; ctx.fillRect(-9 + i * 6, -10, 1, 1); } ctx.globalAlpha = 1;
        ctx.fillStyle = '#5a3e2a'; ctx.fillRect(-13, -34, 2, 24); ctx.fillRect(11, -34, 2, 24); ctx.fillRect(-15, -36, 30, 3); ctx.fillStyle = '#3a2a5a'; ctx.beginPath(); ctx.moveTo(-17, -36); ctx.lineTo(0, -46); ctx.lineTo(17, -36); ctx.fill();
        glow(0, -10, 16, 'rgba(160,190,255,0.3)');
      });
      for (const f of s.folk) sprite(f.x, f.y, () => {   // the people of the city, out late on purpose
        const st = Math.floor((t + f.x * 3) / 9) % 2, d = f.v > 0 ? 1 : -1; shadow(6);
        ctx.fillStyle = '#1a1630'; ctx.fillRect(-3, -6, 2, 6 - st); ctx.fillRect(1, -6, 2, 5 + st);
        ctx.fillStyle = f.c; ctx.fillRect(-4, -18, 8, 13); ctx.fillStyle = SH.shade(f.c, 1.3); ctx.fillRect(-4, -18, 8, 1);
        ctx.fillStyle = '#e8c8b0'; ctx.fillRect(-3, -24, 6, 6); ctx.fillStyle = f.h; ctx.fillRect(-3, -25, 6, 2); ctx.fillRect(d > 0 ? -3 : 2, -24, 1, 4);
      });
      s.spots.forEach((p, i) => {
        const back = p.y < 100;
        if (back) { const d = pr(p.x, 96), w = 26 * d[2] * 1.2, h = 62 * d[2] * 1.2; ctx.fillStyle = '#0a0818'; ctx.fillRect(d[0] - w / 2 - 1, d[1] - h - 1, w + 2, h + 1); ctx.fillStyle = '#7a4a2a'; ctx.fillRect(d[0] - w / 2, d[1] - h, w, h); ctx.fillStyle = '#ffd27a'; ctx.fillRect(d[0] - w / 2, d[1] - h, w, 2); glow(d[0], d[1] - h - 8, 26, 'rgba(255,210,122,0.5)'); ctx.fillStyle = '#ffd27a'; ctx.fillRect(d[0] - 2, d[1] - h - 11, 4, 5); }
        else sprite(p.x + (p.x < 210 ? -10 : 10), p.y + 22, () => { shadow(18); ctx.fillStyle = '#0a0818'; ctx.fillRect(-18, -22, 36, 22); ctx.fillStyle = i % 2 ? '#3a2a5a' : '#5a2a3a'; ctx.fillRect(-16, -20, 32, 18); ctx.fillStyle = '#5a3e2a'; ctx.fillRect(-18, -44, 2, 24); ctx.fillRect(16, -44, 2, 24); for (let a = 0; a < 6; a++) { ctx.fillStyle = a % 2 ? '#ffd27a' : '#8a3a5a'; ctx.fillRect(-18 + a * 6, -48, 6, 6); } ctx.fillStyle = '#ffd27a'; ctx.fillRect(-10, -24, 4, 3); ctx.fillStyle = '#cfd6ff'; ctx.fillRect(0, -25, 3, 4); ctx.fillStyle = '#ff9ac0'; ctx.fillRect(8, -24, 4, 3); });   // a market stall
        sprite(p.x, p.y + 30, () => SH.people.draw(ctx, { id: p.who, x: 0, y: 0, facing: s.x > p.x ? 1 : -1, near: s.near === i, bubble: s.near !== i, emote: s.pick === i ? { e: 'heart', t: 20 } : null }, t));
      });
      sprite(s.x, s.y, () => SH.people.draw(ctx, { id: 'wren', x: 0, y: s.walk && Math.floor(s.walk / 6) % 2 ? -1 : 0, facing: s.f }, s.walk ? 0 : t));
      things.sort((a, b) => a.y - b.y).forEach(th => th.draw());
      // what can be read, marked with a small star until it has been
      SQ_LORE.forEach((L, i) => { if (s.read[L.id]) return; const p = pr(L.x, L.y), by = Math.sin(t * 0.08 + i) * 2; ctx.fillStyle = '#ffd27a'; ctx.fillRect(Math.round(p[0]) - 1, Math.round(p[1] - (i ? 78 : 150) * p[2] + by) - 3, 2, 6); ctx.fillRect(Math.round(p[0]) - 3, Math.round(p[1] - (i ? 78 : 150) * p[2] + by) - 1, 6, 2); });
      // ---- close to the eye: an archway we are looking through, a lantern on it, petals on the wind
      ctx.fillStyle = '#04030c'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(54, 0); ctx.quadraticCurveTo(22, 40, 26, VH); ctx.lineTo(0, VH); ctx.fill(); ctx.beginPath(); ctx.moveTo(vw, 0); ctx.lineTo(vw - 54, 0); ctx.quadraticCurveTo(vw - 22, 40, vw - 26, VH); ctx.lineTo(vw, VH); ctx.fill();
      { const lx = 40 + Math.sin(t * 0.02) * 3; ctx.strokeStyle = '#04030c'; ctx.beginPath(); ctx.moveTo(36, 0); ctx.lineTo(lx, 44); ctx.stroke(); glow(lx, 54, 44, 'rgba(255,200,120,0.4)'); ctx.fillStyle = '#ffd27a'; ctx.fillRect(lx - 6, 44, 12, 16); ctx.fillStyle = '#fff6d8'; ctx.fillRect(lx - 2, 48, 4, 8); ctx.fillStyle = '#04030c'; ctx.fillRect(lx - 7, 42, 14, 3); ctx.fillRect(lx - 7, 59, 14, 2); }
      for (let i = 0; i < 16; i++) { const px = ((i * 97 + t * (0.3 + i % 3 * 0.15)) % (vw + 40)) - 20, py = ((i * 53 + t * 0.2 + Math.sin(t * 0.02 + i) * 14) % VH + VH) % VH; ctx.globalAlpha = 0.5; ctx.fillStyle = i % 2 ? '#ff9ac0' : '#fff6d8'; ctx.fillRect(px, py, 2, 2); } ctx.globalAlpha = 1;
      const vg = ctx.createRadialGradient(cx, VH * 0.6, 120, cx, VH * 0.6, vw * 0.66); vg.addColorStop(0, 'rgba(4,4,16,0)'); vg.addColorStop(1, 'rgba(4,4,16,0.7)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, vw, VH);
      plate(ctx, c.opts.title || 'THE LAMP SQUARE', vw, 8, '#ffd27a');
      if (cap.t <= 0) {
        if (s.near >= 0 && s.pick < 0) plate(ctx, 'SPEND THE EVENING ' + s.spots[s.near].label.toUpperCase() + '  -  PRESS JUMP', vw, VH - 26, '#fff6d8');
        else if (s.lore >= 0 && s.pick < 0) plate(ctx, SQ_LORE[s.lore].label + '  -  PRESS JUMP TO LOOK', vw, VH - 26, '#ffd27a');
        else if (s.pick < 0) plate(ctx, 'LOOK AROUND, THEN WALK UP TO SOMEONE', vw, VH - 26, '#b9b2dd');
      }
      if (s.pick >= 0) { ctx.fillStyle = 'rgba(5,5,13,' + Math.min(1, s.pickT / 36) + ')'; ctx.fillRect(0, 0, vw, VH); }
    },
  };

  SH.modes = M;
})(window.SH = window.SH || {});
