// Underground Syndicate — boot, input (keyboard, mouse, touch), scene switching and the main loop
(function () {
  const G = window.G, gfx = G.gfx, W = G.world;
  const cv = document.getElementById('cv'), $ = id => document.getElementById(id);
  let T = 0, preview = null, tagEls = [], tagPlace = null;
  G.scene = 'boot';
  G.input = { keys: {}, mouse: { cx: 0, cy: 0, down: false }, stick: { x: 0, y: 0, active: false }, touchAtk: false, pressed: [], touch: false, autoAim: false };
  const In = G.input;

  gfx.init(cv);
  window.addEventListener('resize', gfx.resize);
  window.addEventListener('orientationchange', () => setTimeout(gfx.resize, 200));

  // ---------------------------------------------------------------- scenes without gameplay
  G.enterTitle = function () {
    const a = W.get('arena'); gfx.setScene(a.scene);
    if (!G.titleChars) {
      G.titleChars = [['fighter', 'human', -1.6, 0.8, 0.9], ['sorcerer', 'tiefling', 1.6, -0.8, -2.2]].map(q => { const c = G.makeChar({ cls: q[0], race: q[1] }); c.root.position.set(q[2], 0, q[3]); c.root.rotation.y = q[4]; a.scene.add(c.root); return c; });
    }
    G.titleChars.forEach(c => c.root.visible = true);
  };
  G.enterCreate = function () { const h = W.get('hub'); gfx.setScene(h.scene); if (W.walker.char) W.walker.char.root.visible = false; };
  G.setPreview = function (look) {
    const h = W.get('hub');
    if (preview) h.scene.remove(preview.root);
    preview = G.makeChar(look); preview.root.position.set(8, 0, 5); h.scene.add(preview.root);
  };
  function leaveSpecial() {
    if (G.titleChars) G.titleChars.forEach(c => c.root.visible = false);
    if (preview && G.scene !== 'create') { preview.root.parent && preview.root.parent.remove(preview.root); preview = null; }
    if (W.walker.char) W.walker.char.root.visible = true;
  }

  // ---------------------------------------------------------------- input
  const KEYMAP = { Space: 'dodge', ShiftLeft: 'dodge', KeyQ: 'a0', KeyE: 'a1', KeyR: 'a2', KeyF: 'ult', KeyC: 'potion', Digit1: 'a0', Digit2: 'a1', Digit3: 'a2', Digit4: 'ult' };
  window.addEventListener('keydown', e => {
    if (e.target && e.target.tagName === 'INPUT') return;
    G.audioInit();
    if (G.scene === 'fight') {
      if (e.code === 'Escape' || e.code === 'KeyP') { if (G.fight.paused) { G.ui.close(); G.fight.paused = false; } else G.ui.pause(); }
      if (KEYMAP[e.code] && !e.repeat) In.pressed.push(KEYMAP[e.code]);
    } else if (G.scene === 'hub' || G.scene === 'hideout') {
      if (e.code === 'Escape' && G.ui.isOpen()) { G.ui.close(); G.ui.topbar(); }
      else if ((e.code === 'KeyE' || e.code === 'Enter' || e.code === 'Space') && !G.ui.isOpen() && !G.placing && G.near && !e.repeat) G.near.go();
    }
    if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
    In.keys[e.code] = true;
  });
  window.addEventListener('keyup', e => { In.keys[e.code] = false; });
  window.addEventListener('blur', () => { In.keys = {}; In.mouse.down = false; });
  function setTouch() { if (!In.touch) { In.touch = true; if (G.scene === 'fight') $('hud').classList.add('touch'); } }
  function tapWorld(cx, cy) {
    if (G.ui.isOpen()) return;
    const g = gfx.groundAt(cx, cy);
    if (G.scene === 'hideout') {
      if (G.placing) return G.ui.placeMove(g.x, g.z);
      const i = W.get('hideout').itemAt(g.x, g.z);
      if (i >= 0) { G.sfx('ui'); return G.ui.itemCard(i); }
    }
    if (G.scene === 'hub' || G.scene === 'hideout') W.walkTo({ x: g.x, z: g.z, r: 0.3 });
  }
  cv.addEventListener('mousemove', e => { In.mouse.cx = e.clientX; In.mouse.cy = e.clientY; if (G.placing && In.mouse.down2) tapWorld(e.clientX, e.clientY); });
  cv.addEventListener('mousedown', e => {
    G.audioInit(); In.mouse.cx = e.clientX; In.mouse.cy = e.clientY;
    if (G.scene === 'fight') { if (e.button === 0) In.mouse.down = true; if (e.button === 2) In.pressed.push('dodge'); }
    else { In.mouse.down2 = true; tapWorld(e.clientX, e.clientY); }
  });
  window.addEventListener('mouseup', () => { In.mouse.down = false; In.mouse.down2 = false; });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('touchstart', setTouch, { passive: true, capture: true });
  cv.addEventListener('touchstart', e => { G.audioInit(); setTouch(); e.preventDefault(); if (G.scene !== 'fight') { const t = e.changedTouches[0]; tapWorld(t.clientX, t.clientY); } }, { passive: false });
  cv.addEventListener('touchmove', e => { e.preventDefault(); if (G.placing) { const t = e.changedTouches[0]; tapWorld(t.clientX, t.clientY); } }, { passive: false });

  // thumb stick + fight buttons
  const zone = $('stickZone'), base = $('stickBase'), nub = $('stickNub');
  let stickId = null, sO = null;
  zone.addEventListener('touchstart', e => {
    e.preventDefault(); G.audioInit(); setTouch(); const t = e.changedTouches[0]; stickId = t.identifier; sO = { x: t.clientX, y: t.clientY };
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
  const endStick = e => { for (const t of e.changedTouches) if (t.identifier === stickId) { stickId = null; In.stick.active = false; In.stick.x = In.stick.y = 0; base.classList.remove('on'); base.style.left = base.style.top = ''; nub.style.transform = ''; } };
  zone.addEventListener('touchend', endStick); zone.addEventListener('touchcancel', endStick);
  const tAtk = $('tAtk'), tDodge = $('tDodge');
  tAtk.addEventListener('touchstart', e => { e.preventDefault(); In.touchAtk = true; }, { passive: false });
  tAtk.addEventListener('touchend', e => { e.preventDefault(); In.touchAtk = false; }); tAtk.addEventListener('touchcancel', () => { In.touchAtk = false; });
  tDodge.addEventListener('touchstart', e => { e.preventDefault(); In.pressed.push('dodge'); }, { passive: false });
  $('pauseBtn').addEventListener('click', () => G.ui.pause());
  G.ui.placeInit();

  // ---------------------------------------------------------------- floating name tags over doors and stalls
  function tags(place, near) {
    const host = $('tags');
    if (tagPlace !== place) {
      host.innerHTML = ''; tagEls = []; tagPlace = place;
      if (place) place.spots.forEach(sp => { const el = document.createElement('button'); el.className = 'tag'; el.textContent = sp.label; el.onclick = () => { G.audioInit(); G.sfx('ui'); if (!G.ui.isOpen() && !G.placing) W.walkTo(sp); }; host.appendChild(el); tagEls.push(el); });
    }
    if (!place) return;
    const hide = G.ui.isOpen() || !!G.placing;
    place.spots.forEach((sp, i) => {
      const p = gfx.project(sp.x, sp.y, sp.z), el = tagEls[i];
      el.style.transform = 'translate(' + p.x.toFixed(0) + 'px,' + p.y.toFixed(0) + 'px) translate(-50%,-50%)';
      el.classList.toggle('near', sp === near); el.style.display = hide ? 'none' : '';
    });
  }

  // ---------------------------------------------------------------- loop
  let last = performance.now(), lastScene = '';
  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000); last = now; T += dt;
    const sc = G.scene, cam = gfx.cam, port = gfx.portrait;
    if (sc !== lastScene) { leaveSpecial(); lastScene = sc; }
    let near = null;
    if (sc === 'fight') { G.fight.update(dt); }
    else if (sc === 'hub' || sc === 'hideout') {
      near = W.updateWalk(dt, T, G.ui.isOpen() || !!G.placing);
      if (G.placing) { const k = Math.min(1, dt * 6); cam.x += (G.placing.x - cam.x) * k; cam.z += (G.placing.z - cam.z) * k; }
    } else if (sc === 'title') {
      cam.x = Math.sin(T * 0.12) * 1.2; cam.z = Math.cos(T * 0.1) * 1.2; cam.y = 0.9; cam.vh = port ? 23 : 16; cam.fx = 0.5; cam.fy = port ? 0.6 : 0.58; cam.shake = 0;
      if (G.titleChars) G.titleChars.forEach((c, i) => c.pose({ t: T + i * 1.3, act: 'idle' }));
    } else if (sc === 'create') {
      cam.x = 8; cam.z = 5; cam.y = 1.0; cam.shake = 0;
      if (port) { cam.vh = 9; cam.fx = 0.5; cam.fy = 0.2; } else { cam.vh = 5.2; cam.fx = 0.24; cam.fy = 0.52; }
      if (preview) { preview.root.rotation.y = 0.75 + Math.sin(T * 0.7) * 0.7; preview.pose({ t: T, act: 'idle' }); }
      W.get('hub').update(T, dt);
    }
    if (gfx.scene() === (W.cache.arena && W.cache.arena.scene)) W.cache.arena.update(T);
    G.near = (sc === 'hub' || sc === 'hideout') && !G.ui.isOpen() && !G.placing ? near : null;
    tags((sc === 'hub' || sc === 'hideout') ? W.walker.place : null, G.near);
    const pr = $('prompt'); if (G.near) { pr.textContent = G.near.act; pr.className = 'big'; } else pr.className = 'big hidden';
    $('decorBtn').className = sc === 'hideout' && !G.placing && !G.ui.isOpen() ? '' : 'hidden';
    $('touch').className = In.touch && (sc === 'fight' || ((sc === 'hub' || sc === 'hideout') && !G.placing && !G.ui.isOpen())) ? (sc === 'fight' ? 'fight' : '') : 'hidden';
    gfx.updateFires(T); gfx.updateParticles(dt); gfx.updateFloats(dt);
    gfx.render();
    requestAnimationFrame(frame);
  }

  G.ui.title();
  requestAnimationFrame(frame);
})();
