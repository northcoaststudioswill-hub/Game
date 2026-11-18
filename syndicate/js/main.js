// Underground Syndicate — boot, input, scene rendering (title, creation, hub, hideout), main loop
(function () {
  const G = window.G;
  const cv = document.getElementById('cv'), ctx = cv.getContext('2d'), stage = document.getElementById('stage');
  let scale = 1, T = 0, hover = null, hotspots = [];
  G.scene = 'boot';
  G.input = { keys: {}, mouse: { x: G.W / 2, y: G.H / 2, down: false }, stick: { x: 0, y: 0, active: false }, touchAtk: false, pressed: [], touch: false, autoAim: false };
  const In = G.input;

  function resize() {
    const ww = window.innerWidth, wh = window.innerHeight, ar = G.W / G.H;
    let w = ww, h = ww / ar; if (h > wh) { h = wh; w = wh * ar; }
    stage.style.width = w + 'px'; stage.style.height = h + 'px';
    stage.style.fontSize = Math.max(9, w / G.W * 16) + 'px';
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    scale = cv.width / G.W;
  }
  window.addEventListener('resize', resize); resize();

  // ---------------------------------------------------------------- input
  const toPlate = (cx, cy) => { const r = cv.getBoundingClientRect(); return { x: (cx - r.left) / r.width * G.W, y: (cy - r.top) / r.height * G.H }; };
  const KEYMAP = { Space: 'dodge', ShiftLeft: 'dodge', KeyQ: 'a0', KeyE: 'a1', KeyR: 'a2', KeyF: 'ult', KeyC: 'potion', Digit1: 'a0', Digit2: 'a1', Digit3: 'a2', Digit4: 'ult' };
  window.addEventListener('keydown', e => {
    if (e.target && e.target.tagName === 'INPUT') return;
    G.audioInit();
    if (G.scene === 'fight') {
      if (e.code === 'Escape' || e.code === 'KeyP') { if (G.fight.paused) { G.ui.close(); G.fight.paused = false; } else G.ui.pause(); }
      if (KEYMAP[e.code] && !e.repeat) In.pressed.push(KEYMAP[e.code]);
      if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
    } else if (e.code === 'Escape' && G.ui.isOpen() && (G.scene === 'hub' || G.scene === 'hideout')) { G.ui.close(); G.ui.topbar(); }
    In.keys[e.code] = true;
  });
  window.addEventListener('keyup', e => { In.keys[e.code] = false; });
  window.addEventListener('blur', () => { In.keys = {}; In.mouse.down = false; });
  cv.addEventListener('mousemove', e => { const p = toPlate(e.clientX, e.clientY); In.mouse.x = p.x; In.mouse.y = p.y; });
  cv.addEventListener('mousedown', e => {
    G.audioInit(); const p = toPlate(e.clientX, e.clientY); In.mouse.x = p.x; In.mouse.y = p.y;
    if (G.scene === 'fight') { if (e.button === 0) In.mouse.down = true; if (e.button === 2) In.pressed.push('dodge'); }
    else click(p);
  });
  window.addEventListener('mouseup', () => { In.mouse.down = false; });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  cv.addEventListener('touchstart', e => {
    G.audioInit(); setTouch();
    if (G.scene !== 'fight') { const t = e.changedTouches[0]; const p = toPlate(t.clientX, t.clientY); In.mouse.x = p.x; In.mouse.y = p.y; click(p); e.preventDefault(); }
  }, { passive: false });
  function setTouch() { if (!In.touch) { In.touch = true; if (G.scene === 'fight') { document.getElementById('hud').className = 'touch'; document.getElementById('touch').className = ''; } } }
  function click(p) {
    if (G.ui.isOpen()) return;
    const h = hotspots.find(s => Math.hypot(p.x - s.x, p.y - s.y) < s.r);
    if (h) { G.sfx('ui'); h.go(); }
  }
  // touch stick + buttons
  const zone = document.getElementById('stickZone'), base = document.getElementById('stickBase'), nub = document.getElementById('stickNub');
  let stickId = null, sO = null;
  zone.addEventListener('touchstart', e => {
    e.preventDefault(); setTouch(); const t = e.changedTouches[0]; stickId = t.identifier; sO = { x: t.clientX, y: t.clientY };
    const r = zone.getBoundingClientRect(); base.style.left = (t.clientX - r.left) + 'px'; base.style.top = (t.clientY - r.top) + 'px'; base.classList.add('on'); In.stick.active = true; In.stick.x = In.stick.y = 0;
  }, { passive: false });
  zone.addEventListener('touchmove', e => {
    e.preventDefault();
    for (const t of e.changedTouches) if (t.identifier === stickId) {
      const max = base.offsetWidth * 0.45; let dx = t.clientX - sO.x, dy = t.clientY - sO.y; const d = Math.hypot(dx, dy);
      if (d > max) { dx *= max / d; dy *= max / d; }
      nub.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; In.stick.x = dx / max; In.stick.y = dy / max;
    }
  }, { passive: false });
  const endStick = e => { for (const t of e.changedTouches) if (t.identifier === stickId) { stickId = null; In.stick.active = false; In.stick.x = In.stick.y = 0; base.classList.remove('on'); nub.style.transform = ''; } };
  zone.addEventListener('touchend', endStick); zone.addEventListener('touchcancel', endStick);
  const tAtk = document.getElementById('tAtk'), tDodge = document.getElementById('tDodge');
  tAtk.addEventListener('touchstart', e => { e.preventDefault(); In.touchAtk = true; }, { passive: false });
  tAtk.addEventListener('touchend', e => { e.preventDefault(); In.touchAtk = false; }); tAtk.addEventListener('touchcancel', () => { In.touchAtk = false; });
  tDodge.addEventListener('touchstart', e => { e.preventDefault(); In.pressed.push('dodge'); }, { passive: false });
  document.getElementById('pauseBtn').addEventListener('click', () => G.ui.pause());

  // ---------------------------------------------------------------- scene drawing
  function cover(img, zoom, ox, oy) {
    if (!img || !img.width) { ctx.fillStyle = '#0b0a0f'; ctx.fillRect(0, 0, G.W, G.H); return; }
    const z = zoom || 1; ctx.drawImage(img, (G.W - G.W * z) / 2 + (ox || 0), (G.H - G.H * z) / 2 + (oy || 0), G.W * z, G.H * z);
  }
  function vignette(a) {
    const v = ctx.createRadialGradient(G.W / 2, G.H / 2, G.H * 0.3, G.W / 2, G.H / 2, G.H * 0.9);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,' + a + ')'); ctx.fillStyle = v; ctx.fillRect(0, 0, G.W, G.H);
  }
  function hero(x, y, s, face, moving) {
    const st = G.state, h = st.hero; if (!h) return;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.ellipse(x, y, 17 * s, 7 * s, 0, 0, 6.3); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    G.drawChar(ctx, G.lookOf(h, st), { face: face || 1, wa: 0.9, t: T, act: 'idle', moving, walk: T * 9 });
    ctx.restore();
  }
  function marker(s, i) {
    const hot = hover === s, pulse = 0.5 + Math.sin(T * 3 + i) * 0.5, y = s.y - 6 - pulse * 4;
    G.glow(ctx, s.x, s.y, 46 + pulse * 10, s.col || 'rgba(255,200,90,0.5)', hot ? 0.9 : 0.5);
    ctx.save(); ctx.translate(s.x, y); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = s.locked ? '#5a5560' : (s.col2 || '#ffd36b'); ctx.strokeStyle = '#1a1208'; ctx.lineWidth = 2;
    const k = hot ? 12 : 9.5; ctx.fillRect(-k, -k, k * 2, k * 2); ctx.strokeRect(-k, -k, k * 2, k * 2); ctx.restore();
    ctx.fillStyle = '#1a1208'; ctx.font = '900 13px Cinzel, Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText(s.glyph || '!', s.x, y + 5);
    ctx.font = '700 ' + (hot ? 17 : 15) + 'px Cinzel, Georgia, serif';
    const w = Math.max(ctx.measureText(s.label).width, s.sub ? ctx.measureText(s.sub).width * 0.8 : 0) + 18;
    ctx.fillStyle = 'rgba(10,8,14,0.82)'; ctx.fillRect(s.x - w / 2, s.y + 14, w, s.sub ? 40 : 24);
    ctx.strokeStyle = hot ? '#ffd36b' : 'rgba(255,211,107,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(s.x - w / 2 + 0.5, s.y + 14.5, w - 1, (s.sub ? 40 : 24) - 1);
    ctx.fillStyle = s.locked ? '#9a94a0' : '#f2e6c8'; ctx.fillText(s.label, s.x, s.y + 31);
    if (s.sub) { ctx.font = '500 12px "Crimson Pro", Georgia, serif'; ctx.fillStyle = s.subCol || '#b8ad98'; ctx.fillText(s.sub, s.x, s.y + 47); }
  }

  const LANTERNS = [[127, 268], [312, 188], [602, 175], [427, 366], [683, 352], [197, 598], [1037, 322], [922, 100], [52, 665], [288, 425], [890, 332], [826, 118]];
  function drawHub() {
    cover(G.img.street);
    LANTERNS.forEach((l, i) => G.glow(ctx, l[0], l[1], 70, i > 5 && i < 9 ? 'rgba(170,90,255,0.3)' : 'rgba(255,170,70,0.3)', 0.6 + Math.sin(T * 7 + i * 1.9) * 0.2 + Math.sin(T * 19 + i) * 0.1));
    hero(640, 600, 1.5, Math.sin(T * 0.3) > 0 ? 1 : -1);
    ctx.fillStyle = 'rgba(150,150,170,0.05)';
    for (let i = 0; i < 7; i++) { const x = ((i * 233 + T * (12 + i * 3)) % (G.W + 400)) - 200, y = 330 + i * 62 + Math.sin(T * 0.4 + i) * 20; ctx.beginPath(); ctx.ellipse(x, y, 190, 46, 0, 0, 6.3); ctx.fill(); }
    vignette(0.6);
    const st = G.state, next = G.OPPONENTS.find(o => !st.wins[o.id]);
    hotspots = [
      { x: 165, y: 165, r: 80, label: 'The Blood Pit', sub: next ? 'Next: ' + next.name : 'You are the champion', glyph: '⚔', col: 'rgba(255,80,50,0.5)', col2: '#ff8a5a', go: () => G.ui.pit() },
      { x: 592, y: 318, r: 75, label: 'The Fence', sub: 'Gear and potions', glyph: '$', go: () => G.ui.shop() },
      { x: 1040, y: 150, r: 80, label: 'Guildmaster', sub: 'Character and loadout', glyph: '★', col: 'rgba(170,90,255,0.5)', col2: '#c79bff', go: () => G.ui.sheet() },
      { x: 110, y: 610, r: 80, label: 'Your Hideout', sub: 'House and garden', glyph: '⌂', col: 'rgba(90,200,255,0.45)', col2: '#8fdcff', go: () => G.ui.hideout() }
    ];
    hotspots.forEach(marker);
  }

  // Hideout: the plate is drawn full, then a darkness layer with a hole punched for every installed piece.
  let dark = null;
  function buildDark() {
    if (!dark) { dark = document.createElement('canvas'); dark.width = G.W / 2; dark.height = G.H / 2; }
    const d = dark.getContext('2d'); d.setTransform(0.5, 0, 0, 0.5, 0, 0);
    d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, G.W, G.H);
    d.fillStyle = 'rgba(6,5,12,0.86)'; d.fillRect(0, 0, G.W, G.H);
    d.globalCompositeOperation = 'destination-out';
    const hole = (x, y, r, a) => { const g = d.createRadialGradient(x, y, r * 0.25, x, y, r); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); d.fillStyle = g; d.beginPath(); d.arc(x, y, r, 0, 6.3); d.fill(); };
    hole(590, 440, 210, 0.55);
    G.DECOR.forEach(it => { if (G.state.decor[it.id]) it.lights.forEach(l => { hole(l[0], l[1], l[2], 1); hole(l[0], l[1], l[2] * 0.7, 1); }); });
    G.hideoutDirty = false;
  }
  function drawHideout() {
    const st = G.state, rk = G.rankOf(st.respect);
    if (G.hideoutDirty || !dark) buildDark();
    cover(G.img.hideout);
    ctx.drawImage(dark, 0, 0, G.W, G.H);
    hotspots = [];
    let owned = 0;
    G.DECOR.forEach((it, i) => {
      if (st.decor[it.id]) {
        owned++;
        it.lights.forEach((l, j) => {
          G.glow(ctx, l[0], l[1], l[2] * 0.75, it.glow, 0.10 + Math.sin(T * 2.2 + i + j) * 0.035);
          for (let k = 0; k < 3; k++) {       // drifting motes
            const a = T * (0.3 + k * 0.13) + i * 2 + j + k * 2.1, rr = l[2] * (0.25 + 0.2 * k);
            G.glow(ctx, l[0] + Math.cos(a) * rr, l[1] + Math.sin(a * 1.3) * rr * 0.5 - 10, 5, it.glow, 0.55 + Math.sin(T * 4 + k) * 0.3);
          }
        });
        hotspots.push({ x: it.x, y: it.y, r: 46, owned: true, go: () => G.ui.decor(it) });
      } else {
        const locked = rk < it.rank;
        const s = { x: it.x, y: it.y, r: 52, label: it.name, sub: locked ? 'Rank: ' + G.RANKS[it.rank].name : it.cost + ' coin', subCol: locked ? '#c07a70' : st.coin >= it.cost ? '#ffd36b' : '#b8ad98', glyph: locked ? '×' : '+', locked, col: 'rgba(120,180,255,0.35)', col2: '#9fd6ff', go: () => G.ui.decor(it) };
        hotspots.push(s);
      }
    });
    if (G.decorPop) { const p = G.decorPop, it = G.DECOR.find(d => d.id === p.id); p.t += 0.016; G.glow(ctx, it.x, it.y, 60 + p.t * 260, '#fff2c0', Math.max(0, 0.8 - p.t)); if (p.t > 0.9) G.decorPop = null; }
    hero(655, 462, 0.9, Math.sin(T * 0.25) > 0 ? 1 : -1);
    vignette(0.5);
    hotspots.filter(s => s.label).forEach(marker);
    const back = { x: 96, y: 716, r: 70, label: 'Undercity', sub: 'Back to the streets', glyph: '←', go: () => G.ui.hub() };
    hotspots.push(back); marker(back, 9);
    ctx.textAlign = 'right'; ctx.font = '700 15px Cinzel, Georgia, serif'; ctx.fillStyle = '#d8ccb0';
    ctx.fillText('Hideout ' + owned + ' / ' + G.DECOR.length + ' pieces installed', G.W - 24, G.H - 22);
  }

  function drawTitle() {
    cover(G.img.title, 1.08 + Math.sin(T * 0.1) * 0.03, Math.sin(T * 0.07) * 14, 0);
    const g = ctx.createLinearGradient(0, 0, 0, G.H); g.addColorStop(0, 'rgba(6,5,10,0.55)'); g.addColorStop(0.5, 'rgba(6,5,10,0.35)'); g.addColorStop(1, 'rgba(6,5,10,0.9)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H); vignette(0.7);
  }
  function drawCreate() {
    cover(G.img.street, 1.5, 320, -160);
    ctx.fillStyle = 'rgba(6,5,10,0.62)'; ctx.fillRect(0, 0, G.W, G.H);
    const p = G.createPick; if (!p) return;
    G.glow(ctx, 215, 520, 230, 'rgba(255,170,80,0.3)', 0.8);
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.ellipse(215, 600, 80, 30, 0, 0, 6.3); ctx.fill();
    ctx.save(); ctx.translate(215, 600); ctx.scale(4.6, 4.6);
    G.drawChar(ctx, { cls: p.cls, race: p.race }, { face: 1, wa: 0.5 + Math.sin(T * 1.5) * 0.15, t: T, act: 'idle' });
    ctx.restore();
    ctx.textAlign = 'center'; ctx.fillStyle = '#f2e6c8'; ctx.font = '700 26px Cinzel, Georgia, serif';
    ctx.fillText(G.RACES[p.race].name + ' ' + G.CLASSES[p.cls].name, 215, 672);
    ctx.font = '500 16px "Crimson Pro", Georgia, serif'; ctx.fillStyle = '#b8ad98'; ctx.fillText(G.CLASSES[p.cls].role, 215, 696);
    vignette(0.5);
  }

  // ---------------------------------------------------------------- loop
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000); last = now; T += dt;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    if (G.scene !== 'hub' && G.scene !== 'hideout') hotspots = [];
    if (G.scene === 'fight') { G.fight.update(dt); if (G.scene === 'fight') G.fight.draw(ctx); }
    else if (G.scene === 'hub') drawHub();
    else if (G.scene === 'hideout') drawHideout();
    else if (G.scene === 'create') drawCreate();
    else drawTitle();
    hover = G.ui.isOpen() ? null : hotspots.find(s => Math.hypot(In.mouse.x - s.x, In.mouse.y - s.y) < s.r) || null;
    cv.style.cursor = hover ? 'pointer' : G.scene === 'fight' ? 'crosshair' : 'default';
    requestAnimationFrame(frame);
  }
  G.step = (dt) => { G.fight.update(dt); };          // test hook: advance the sim without rendering

  G.loadImages(['arena', 'street', 'hideout', 'title'], () => { G.ui.title(); });
  G.ui.title();
  requestAnimationFrame(frame);
})();
