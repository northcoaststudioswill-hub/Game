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
    preview = G.makeChar(look); preview.root.position.set(21, 0, 15.5); h.scene.add(preview.root);
  };
  function leaveSpecial() {
    if (G.titleChars && G.scene !== 'title') G.titleChars.forEach(c => c.root.visible = false);
    if (preview && G.scene !== 'create') { preview.root.parent && preview.root.parent.remove(preview.root); preview = null; }
    if (W.walker.char) W.walker.char.root.visible = true;
  }

  // ---------------------------------------------------------------- input
  const KEYMAP = { Space: 'dodge', ShiftLeft: 'parry', ShiftRight: 'parry', KeyX: 'parry', KeyT: 'assist', KeyQ: 'a0', KeyE: 'a1', KeyR: 'a2', KeyF: 'ult', KeyC: 'potion', Digit1: 'a0', Digit2: 'a1', Digit3: 'a2', Digit4: 'ult' };
  window.addEventListener('keydown', e => {
    if (e.target && e.target.tagName === 'INPUT') return;
    if (G.bootSkip) return;
    if (G.scene === 'cine') { if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); G.cine.skip(); } return; }
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
      if (i >= 0) return G.ui.pickUp(i);
    }
    if (G.scene === 'hub' || G.scene === 'hideout') W.walkTo({ x: g.x, z: g.z, r: 0.3 });
  }
  cv.addEventListener('mousemove', e => { In.mouse.cx = e.clientX; In.mouse.cy = e.clientY; if (G.placing && In.mouse.down2) tapWorld(e.clientX, e.clientY); });
  cv.addEventListener('mousedown', e => {
    G.audioInit(); In.mouse.cx = e.clientX; In.mouse.cy = e.clientY;
    if (G.scene === 'fight') { if (e.button === 0) In.mouse.down = true; if (e.button === 2) In.pressed.push('parry'); }
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
  $('tParry').addEventListener('touchstart', e => { e.preventDefault(); In.pressed.push('parry'); }, { passive: false });
  $('pauseBtn').addEventListener('click', () => G.ui.pause());
  G.ui.placeInit();


  // ---------------------------------------------------------------- gamepad (Xbox layout / any "standard" pad)
  // Fight: left stick move, right stick aim (auto-aims when centred), X or RT attack, A or LT dodge,
  // LB / RB / Y abilities, B ultimate, D-pad up potion, Menu pause. Menus: D-pad or stick to move, A select, B back.
  let prevB = {}, navT = 0, usedPad = false;
  const setPad = on => { if (In.usingPad !== on) { In.usingPad = on; document.body.classList.toggle('pad', on); G.ui.refreshKeys(); } };
  window.addEventListener('mousemove', () => setPad(false)); window.addEventListener('keydown', () => setPad(false)); window.addEventListener('touchstart', () => setPad(false), { passive: true });
  G.rumble = (ms, strong) => { try { const gp = In.gp && navigator.getGamepads()[In.gp]; if (In.usingPad && gp && gp.vibrationActuator) gp.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: strong * 0.6 }); } catch (e) { } };
  function menuButtons() {
    const roots = G.ui.isOpen() ? [$('panel')] : [$('placebar'), $('prompt'), $('decorBtn'), $('topbar')];
    const out = [];
    roots.forEach(r => { if (!r || r.classList.contains('hidden')) return; (r.tagName === 'BUTTON' ? [r] : r.querySelectorAll('button')).forEach(el => { if (!el.disabled && el.offsetParent !== null) out.push(el); }); });
    return out;
  }
  function navigate(dx, dy) {
    const list = menuButtons(); if (!list.length) return;
    const cur = list.includes(document.activeElement) ? document.activeElement : null;
    if (!cur) { (list.find(b => b.classList.contains('big')) || list[0]).focus(); return; }
    const r = cur.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let best = null, bs = 1e9;
    list.forEach(el => {
      if (el === cur) return; const q = el.getBoundingClientRect(), ex = q.left + q.width / 2 - cx, ey = q.top + q.height / 2 - cy;
      const along = ex * dx + ey * dy, perp = Math.abs(ex * dy) + Math.abs(ey * dx);
      if (along > 4) { const sc = along + perp * 2.5; if (sc < bs) { bs = sc; best = el; } }
    });
    if (best) { best.focus(); best.scrollIntoView({ block: 'nearest' }); G.sfx('ui'); }
  }
  function pollPad(dt) {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gp = null; for (const p of pads) if (p && p.connected && p.mapping === 'standard') { gp = p; break; }
    if (!gp) for (const p of pads) if (p && p.connected) { gp = p; break; }
    if (!gp) { In.pad = null; return; }
    In.gp = gp.index;
    const dz = v => Math.abs(v) < 0.22 ? 0 : v, ax = i => dz(gp.axes[i] || 0);
    const now = {}; for (let i = 0; i < 17; i++) now[i] = !!(gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.5));
    const hit = i => now[i] && !prevB[i];
    const lx = ax(0), ly = ax(1), rx = ax(2), ry = ax(3);
    if (lx || ly || rx || ry || Object.keys(now).some(i => now[i])) { setPad(true); G.audioInit(); }
    In.pad = { lx, ly, rx, ry, atk: now[2] || now[7] };
    if (G.bootSkip) { if (Object.keys(now).some(i => now[i] && !prevB[i])) G.bootSkip(); prevB = now; return; }
    if (!In.usingPad) { prevB = now; return; }
    const sc = G.scene, open = G.ui.isOpen(), paused = sc === 'fight' && G.fight.paused;
    // one step per press for D-pad, repeating for a held stick
    let nx = (hit(15) ? 1 : 0) - (hit(14) ? 1 : 0), ny = (hit(13) ? 1 : 0) - (hit(12) ? 1 : 0);
    navT -= dt;
    if (!nx && !ny && (Math.abs(lx) > 0.6 || Math.abs(ly) > 0.6)) { if (navT <= 0) { if (Math.abs(lx) > Math.abs(ly)) nx = Math.sign(lx); else ny = Math.sign(ly); navT = 0.22; } } else if (!lx && !ly) navT = 0;
    if (sc === 'cine') { if (hit(0) || hit(1) || hit(9)) G.cine.skip(); }
    else if (sc === 'fight' && !open && !paused) {
      if (hit(0)) In.pressed.push('dodge'); if (hit(6)) In.pressed.push('parry'); if (hit(14)) In.pressed.push('assist');
      if (hit(4)) In.pressed.push('a0'); if (hit(5)) In.pressed.push('a1'); if (hit(3)) In.pressed.push('a2');
      if (hit(1)) In.pressed.push('ult'); if (hit(12)) In.pressed.push('potion'); if (hit(9)) G.ui.pause();
    } else if (G.placing && !open) {
      if (nx || ny) { const pl = G.placing; pl.x += nx; pl.z += ny; W.get('hideout').setGhost(pl); G.ui.placeBar(); }
      if (hit(0)) $('plOk').click(); if (hit(2)) $('plRot').click(); if (hit(1)) $('plCancel').click();
    } else if (open || sc === 'title' || sc === 'create') {
      if (nx || ny) navigate(nx, ny);
      const list = menuButtons(); if (list.length && !list.includes(document.activeElement)) (list.find(b => b.classList.contains('big')) || list[0]).focus();
      if (hit(0) && list.includes(document.activeElement)) document.activeElement.click();
      if (hit(1) || (paused && hit(9))) { const back = $('panel').querySelector('#x, #n, #rs'); if (back) back.click(); }
    } else if (sc === 'hub' || sc === 'hideout') {
      if (hit(0) && G.near) { G.sfx('ui'); G.near.go(); }
      if (hit(3)) { G.sfx('ui'); if (sc === 'hideout') G.ui.catalog(); else G.ui.sheet(); }
      if (hit(2) && sc === 'hideout') { const w = W.walker, H = W.get('hideout'); let i = H.itemAt(w.x + Math.sin(w.face), w.z + Math.cos(w.face)); if (i < 0) i = H.itemAt(w.x, w.z); if (i >= 0) G.ui.pickUp(i); }
    }
    prevB = now;
  }

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
    if (sc !== lastScene) { leaveSpecial(); lastScene = sc; G.music({ title: 'title', create: 'title', hub: 'hub', hideout: 'home', fight: G.fightTrack || 'fight', cine: 'boss' }[sc]); }
    pollPad(dt);
    let near = null;
    if (sc === 'fight') { G.fight.update(dt); }
    else if (sc === 'cine') { G.cine.update(dt, T); }
    else if (sc === 'hub' || sc === 'hideout') {
      near = W.updateWalk(dt, T, G.ui.isOpen() || !!G.placing);
      if (G.placing) { const k = Math.min(1, dt * 6); cam.x += (G.placing.x - cam.x) * k; cam.z += (G.placing.z - cam.z) * k; }
    } else if (sc === 'title') {
      cam.x = Math.sin(T * 0.12) * 1.2; cam.z = Math.cos(T * 0.1) * 1.2; cam.y = 0.9; cam.vh = port ? 23 : 16; cam.fx = 0.5; cam.fy = port ? 0.6 : 0.58; cam.shake = 0;
      if (G.titleChars) G.titleChars.forEach((c, i) => c.pose({ t: T + i * 1.3, act: 'idle' }));
    } else if (sc === 'create') {
      cam.x = 21; cam.z = 15.5; cam.y = 1.0; cam.shake = 0;
      if (port) { cam.vh = 9; cam.fx = 0.5; cam.fy = 0.2; } else { cam.vh = 5.2; cam.fx = 0.24; cam.fy = 0.52; }
      if (preview) { preview.root.rotation.y = 0.75 + Math.sin(T * 0.7) * 0.7; preview.pose({ t: T, act: 'idle' }); }
      W.get('hub').update(T, dt);
    }
    if (gfx.scene() === (W.cache.arena && W.cache.arena.scene)) W.cache.arena.update(T);
    G.near = (sc === 'hub' || sc === 'hideout') && !G.ui.isOpen() && !G.placing ? near : null;
    tags((sc === 'hub' || sc === 'hideout') ? W.walker.place : null, G.near);
    const pr = $('prompt'); if (G.near) { pr.textContent = (In.usingPad ? '(A) ' : '') + G.near.act; pr.className = 'big'; } else pr.className = 'big hidden';
    $('decorBtn').textContent = In.usingPad ? '(Y) Decorate' : 'Decorate'; $('decorBtn').className = sc === 'hideout' && !G.placing && !G.ui.isOpen() ? '' : 'hidden';
    $('touch').className = In.touch && (sc === 'fight' || ((sc === 'hub' || sc === 'hideout') && !G.placing && !G.ui.isOpen())) ? (sc === 'fight' ? 'fight' : '') : 'hidden';
    gfx.updateFires(T); gfx.updateParticles(dt); gfx.updateFloats(dt);
    gfx.render();
    requestAnimationFrame(frame);
  }

  G.ui.title();
  G.ui.boot();
  requestAnimationFrame(frame);
})();
