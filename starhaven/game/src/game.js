// Starhaven — the game: world setup, the 60 fps loop, camera, checkpoints, hazards, signs, knockouts, results.
(function (SH) {
  const fx = SH.fx, input = SH.input;
  const TS = SH.TILE;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: fine */ } },
  };
  SH.store = store;

  // Live tuning = defaults + anything saved from the TUNE panel.
  SH.tune = Object.assign({}, SH.TUNE_DEFAULTS, store.get('starhaven.tune.v1', {}));

  const G = SH.game = { state: 'title', world: null, frozen: false };

  G.build = function () {
    const def = SH.ROOMS.grove, room = SH.buildRoom(def);
    const st = def.start;
    const player = new SH.Player(st.x * TS + TS / 2, st.y * TS);
    const things = def.spawns.map(s => SH.makeSpawn(s, room));
    const lanterns = def.lanterns.map(l => ({ ...l, px: l.x * TS + TS / 2, py: room.groundY(l.x, 0), lit: !!l.lit }));
    const signs = def.signs.map(s => ({ ...s, px: s.x * TS + TS / 2, py: room.groundY(s.x, 0), near: false, read: false }));
    const w = {
      room, player, things, lanterns, signs, input,
      targets: things,
      cam: { x: 0, y: 0 }, viewW: G.viewW || 640, time: 0, fade: 0,
      checkpoint: lanterns[0],
      run: { started: false, frames: 0, done: false },
      camCenterX() { return this.cam.x + this.viewW / 2; },
      onKill() { },
      onDash() { },
      onPerfectDodge(e) {
        fx.slowmo = 26; player.stats.perfect++;
        player.dashCd = 0; player.airDashes = 1;
        fx.word(player.x, player.y - 52, 'PERFECT DODGE', '#9fe8ff', 60);
        fx.ring(player.x, player.y - 20, '#9fe8ff', 44, 22, 2);
      },
      onKnockout() { G.knockout(); },
    };
    G.world = w;
    SH.draw.init(room, w.viewW);
    G.snapCamera();
    G.hud.hearts(player.hearts, player.maxHearts);
    G.hud.goal();
    return w;
  };

  G.snapCamera = function () { const w = G.world; G.cameraTarget(); w.cam.x = w.camT.x; w.cam.y = w.camT.y; };
  G.cameraTarget = function () {
    const w = G.world, p = w.player;
    const look = p.facing * 46 + p.vx * 8;
    let tx = p.x + look - w.viewW / 2;
    let ty = p.y - SH.VIEW_H * 0.64;
    tx = Math.max(0, Math.min(w.room.pxW - w.viewW, tx));
    ty = Math.max(0, Math.min(w.room.pxH - SH.VIEW_H, ty));
    w.camT = { x: tx, y: ty };
  };

  // ---------------------------------------------------------------- one game frame (1/60 s)
  G.step = function () {
    const w = G.world, p = w.player;
    input.step();
    if (input.pressed.pause && G.state === 'play') { G.pause(); return; }
    if (G.state !== 'play') return;
    if (w.koT > 0) { G.koStep(); fx.update(); return; }
    if (fx.hitstop > 0) {
      // Frozen for impact, but presses made now still count when it resumes.
      fx.hitstop--;
      if (input.pressed.attack) p.atkBuf = SH.COMBAT.attackBuffer + 1;
      if (input.pressed.jump) p.jumpBuf = SH.tune.jumpBufferFrames + 1;
      if (input.pressed.dash) p.dashBuf = 7;
      return;
    }
    if (fx.slowmo > 0) fx.slowmo--;
    w.time++;

    p.update(w);
    for (const e of w.things) e.update(w);

    // Run timer starts on your first move.
    if (!w.run.started && (Math.abs(p.vx) > 0.5 || !p.grounded)) w.run.started = true;
    if (w.run.started && !w.run.done) w.run.frames++;

    // Thorns and pits: lose a heart, go back to safe ground.
    const b = p.box();
    const inThorns = SH.touchesThorns(w.room, b.l + 3, b.t, b.r - 3, b.b);
    if (inThorns || p.y > w.room.pxH + 40) G.hazard(inThorns ? 'thorns' : 'pit');

    // Lanterns: checkpoint, and they restore your hearts.
    for (const l of w.lanterns) {
      if (Math.abs(p.x - l.px) < 22 && Math.abs(p.y - l.py) < 30) {
        if (!l.lit) {
          l.lit = true;
          fx.ring(l.px, l.py - 46, '#ffd27a', 50, 26, 2);
          fx.burst(l.px, l.py - 46, 16, { speed: 2, life: 30, gravity: -0.03, colors: ['#ffd27a', '#fff6d8'], glow: true });
          // Lighting a lantern restores your hearts once; after that it's a place to come back to.
          p.hearts = p.maxHearts;
          if (!l.end) G.hud.toast('Lantern lit. Hearts restored, and you will start here if knocked out.');
        }
        if (w.checkpoint !== l && !l.end) w.checkpoint = l;
        if (l.end && !w.run.done) G.finish();
      }
    }

    // Signs: stand near one to read it.
    let near = null;
    for (const s of w.signs) { s.near = Math.abs(p.x - s.px) < 44 && Math.abs(p.y - s.py) < 60; if (s.near) near = s; }
    G.hud.sign(near);
    if (near) near.read = true;

    G.hud.hearts(p.hearts, p.maxHearts);
    G.cameraTarget();
    w.cam.x += (w.camT.x - w.cam.x) * 0.14;
    w.cam.y += (w.camT.y - w.cam.y) * 0.10;
    fx.update();
    if (w.fade > 0) w.fade = Math.max(0, w.fade - 0.08);
  };

  G.hazard = function (kind) {
    const w = G.world, p = w.player;
    if (p.invuln <= 0) { p.hearts = Math.max(0, p.hearts - 1); p.stats.hurt++; }
    fx.flashScreen(8, kind === 'thorns' ? 'rgba(255,80,110,0.4)' : 'rgba(10,10,30,0.8)');
    fx.kick(4);
    if (p.hearts <= 0) { G.knockout(); return; }
    p.respawnAt(p.lastSafe.x, p.lastSafe.y, SH.PLAYER.hazardInvuln);
    G.snapCamera();
    w.fade = 0.7;
    fx.word(p.x, p.y - 52, kind === 'thorns' ? 'ouch: thorns' : 'fell', '#ff9aa8', 40);
  };

  G.knockout = function () {
    const w = G.world;
    if (w.koT > 0) return;
    w.koT = 1;
    w.player.dead = true;
  };
  G.koStep = function () {
    const w = G.world, p = w.player;
    w.koT++;
    w.fade = Math.min(1, w.koT / 30);
    if (w.koT === 45) {
      const c = w.checkpoint;
      p.dead = false;
      p.hearts = p.maxHearts;
      p.respawnAt(c.px + 14, c.py, 40);
      p.facing = 1;
      for (const e of w.things) if (e.reset) e.reset();
      G.snapCamera();
      G.hud.toast('Knocked out. Back at the last lantern, no harm done.');
    }
    if (w.koT >= 46) { w.fade = Math.max(0, 1 - (w.koT - 46) / 25); }
    if (w.koT > 72) { w.koT = 0; w.fade = 0; }
  };

  G.finish = function () {
    const w = G.world, p = w.player;
    w.run.done = true;
    const secs = w.run.frames / 60;
    const best = store.get('starhaven.best.v1', null);
    const isBest = best == null || secs < best;
    if (isBest) store.set('starhaven.best.v1', secs);
    G.hud.goal('done');
    G.hud.results({ secs, best: isBest ? secs : best, isBest, hurt: p.stats.hurt, perfect: p.stats.perfect, pogos: p.stats.pogos });
    G.state = 'results';
  };

  G.restart = function () {
    const vw = G.world ? G.world.viewW : 640;
    fx.reset();
    G.build();
    G.world.viewW = vw;
    G.state = 'play';
    G.hud.goal();
  };

  G.pause = function () { if (G.state !== 'play') return; G.state = 'pause'; input.clear(); G.hud.menu(true); };
  G.resume = function () { G.state = 'play'; input.clear(); G.hud.menu(false); G.hud.tune(false); };

  // ---------------------------------------------------------------- loop
  let acc = 0, last = 0;
  G.loop = function (now) {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    input.pollPad();
    if (!G.frozen) {
      if (G.state === 'play') {
        acc += dt * (fx.slowmo > 0 ? 0.4 : 1);
        let n = 0;
        while (acc >= 1 / 60 && n < 5) { G.step(); acc -= 1 / 60; n++; }
        if (n === 5) acc = 0;
      } else {
        acc = 0;
        G.menuInput();
      }
    }
    G.render();
    requestAnimationFrame(G.loop);
  };
  G.render = function () {
    const ctx = G.ctx, w = G.world;
    if (!w) return;
    ctx.imageSmoothingEnabled = false;
    SH.draw.frame(ctx, w);
  };

  // Menus can be driven by keyboard and gamepad as well as taps.
  G.menuInput = function () {
    if (G.state === 'title') { if (input.take('jump') || input.take('attack') || input.take('pause')) G.start(); }
    else if (G.state === 'pause') { if (input.take('pause')) G.resume(); }
    else if (G.state === 'results') { if (input.take('jump') || input.take('pause')) { G.hud.results(null); G.restart(); } }
  };

  G.start = function () {
    if (G.state !== 'title') return;
    G.hud.title(false);
    G.state = 'play';
    input.clear();
  };

  // ---------------------------------------------------------------- screen size
  G.fit = function () {
    const W = window.innerWidth, H = window.innerHeight;
    const viewW = Math.max(420, Math.min(720, Math.round(SH.VIEW_H * W / H)));
    const scale = Math.min(W / viewW, H / SH.VIEW_H);
    const cv = G.canvas;
    if (cv.width !== viewW) { cv.width = viewW; cv.height = SH.VIEW_H; }
    cv.style.width = Math.floor(viewW * scale) + 'px';
    cv.style.height = Math.floor(SH.VIEW_H * scale) + 'px';
    G.viewW = viewW;
    if (G.world) { G.world.viewW = viewW; SH.draw.resize(viewW); G.snapCamera(); }
  };

  // ---------------------------------------------------------------- test hooks (used by tests/*.js)
  SH.test = {
    freeze() { G.frozen = true; input.forced = { held: {}, pressed: {} }; if (G.state === 'title') { G.hud.title(false); G.state = 'play'; } },
    // Step n frames holding `held` (e.g. {right:true}); `press` actions are pressed on the first frame.
    step(n, held, press) {
      for (let i = 0; i < n; i++) {
        input.forced.held = held || {};
        input.forced.pressed = {};
        if (i === 0 && press) for (const a of press) input.forced.pressed[a] = true;
        G.step();
      }
      return SH.test.state();
    },
    place(tx, ty) { const p = G.world.player; p.respawnAt(tx * TS + TS / 2, ty * TS); p.grounded = true; G.snapCamera(); },
    state() {
      const p = G.world.player;
      return { x: p.x, y: p.y, tx: p.x / TS, ty: p.y / TS, vx: p.vx, vy: p.vy, grounded: p.grounded, hearts: p.hearts, stats: p.stats, state: G.state, ko: G.world.koT || 0 };
    },
    render() { G.render(); },
  };
})(window.SH = window.SH || {});
