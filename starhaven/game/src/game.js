// Starhaven — the game: chapters, story scripts, the 60 fps loop, camera, checkpoints, hazards, knockouts.
// Flow: title -> intro panels -> chapter card -> play (story scripts pause play for dialogue) -> chapter complete -> next.
(function (SH) {
  const fx = SH.fx, input = SH.input, TS = SH.TILE, ST = SH.STORY;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode: fine */ } },
  };
  SH.store = store;
  SH.tune = Object.assign({}, SH.TUNE_DEFAULTS, store.get('starhaven.tune.v1', {}));

  const G = SH.game = {
    state: 'title', world: null, frozen: false,
    chapter: 0, flags: {}, activeGoal: null, script: null,
    progress: Object.assign({ reached: 0, bonds: {}, met: [] }, store.get('starhaven.save.v1', {})),
    heartQueue: [],
  };
  G.save = function () { store.set('starhaven.save.v1', G.progress); };

  // What Wren can do in this chapter. Mortal in the Winter Woods: one jump, no dash, a bow instead of daggers.
  const ABILITIES = { double: true, dash: true, daggers: true, bow: false };
  G.can = name => { const ch = G.chapterDef(); const a = Object.assign({}, ABILITIES, ch && ch.abilities); return !!a[name]; };
  Object.defineProperty(G, 'mortal', { get: () => !!(G.chapterDef() && G.chapterDef().mortal) });
  G.chapterDef = () => ST.CHAPTERS[G.chapter];

  // ---------------------------------------------------------------- building a room
  G.build = function (roomId) {
    const def = SH.ROOMS[roomId], room = SH.buildRoom(def);
    const player = new SH.Player(def.start.x * TS + TS / 2, def.start.y * TS);
    const things = def.spawns.map(s => SH.makeSpawn(s, room));
    const lanterns = def.lanterns.map(l => ({ ...l, px: l.x * TS + TS / 2, py: room.groundY(l.x, 0), lit: !!l.lit }));
    const npcs = def.npcs.map(n => ({ ...n, x: n.x * TS + TS / 2, y: room.groundY(Math.floor(n.x), 0), facing: -1, near: false }));
    const gates = def.gates.map(g => ({ ...g }));
    const w = {
      room, player, things, lanterns, npcs, gates, input,
      targets: things,
      cam: { x: 0, y: 0 }, viewW: G.viewW || 640, time: 0, fade: 0,
      checkpoint: lanterns[0],
      fired: {},
      cityLight: def.cityLight || 0.05, cityLightTarget: def.cityLight || 0.05,
      muralProgress: 0,
      wyrm: def.chase ? { on: false, x: def.chase.wyrmX * TS, speed: def.chase.speed } : null,
      camCenterX() { return this.cam.x + this.viewW / 2; },
      onKill() { G.hud.goal(); },
      onDash() { },
      onPerfectDodge() {
        fx.slowmo = 26; player.stats.perfect++;
        player.dashCd = 0; player.airDashes = 1;
        fx.word(player.x, player.y - 52, 'PERFECT DODGE', '#9fe8ff', 60);
        fx.ring(player.x, player.y - 20, '#9fe8ff', 44, 22, 2);
      },
      onKnockout() { G.knockout(); },
      arrows: [],
      spawnArrow(x, y, dir) { this.arrows.push({ x, y, vx: dir * 8, vy: -0.5, life: 110, stuck: false }); },
      onStagDown() { G.queueScript('woods_kill'); },
      onDummyCombo() { if (G.activeGoal === 'combo' && def.dummyCombo) G.queueScript(def.dummyCombo); },
    };
    G.world = w;
    SH.draw.init(room, w.viewW);   // drawn with gates open, so gates draw on top as objects
    for (const g of gates) room.setGate(g, true);
    G.snapCamera();
    G.hud.hearts(player.hearts, player.maxHearts);
    G.hud.prompt(null); G.hud.talkButton(null);
    G.hud.abilities();
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

  // ---------------------------------------------------------------- chapters
  G.startChapter = function (i) {
    G.chapter = i;
    G.flags = {}; G.activeGoal = null; G.script = null; G.pending = null;
    fx.reset();
    const ch = G.chapterDef();
    G.build(ch.room);
    G.state = 'card';
    G.hud.card({ label: ch.label, name: ch.name, text: ch.card, goals: ch.goals.map(g => g.text), button: 'Begin' }, () => {
      G.state = 'play'; input.clear(); G.hud.goal();
    });
    G.hud.goal();
  };

  G.completeChapter = function () {
    const ch = G.chapterDef(), next = G.chapter + 1;
    G.progress.reached = Math.max(G.progress.reached, next);
    G.save();
    G.state = 'card';
    // After the card: the chapter's evening (if it has one), then the next chapter, or the finale.
    const cont = () => { if (next < ST.CHAPTERS.length) G.startChapter(next); else G.runScript('finale'); };
    G.hud.card({ label: ch.label + ' complete', name: ch.name, text: ch.done, goals: null, button: 'Continue' }, () => {
      if (ch.after) { G.afterScript = cont; G.runScript(ch.after); } else cont();
    });
  };

  G.knownPeople = function () {
    const ids = new Set();
    for (let i = 0; i <= G.chapter; i++) (ST.KNOWN_FROM[ST.CHAPTERS[i].id] || []).forEach(x => ids.add(x));
    G.progress.met.forEach(x => ids.add(x));
    return ST.PEOPLE.filter(p => ids.has(p.id));
  };
  // Text for the GOAL line.
  G.goalText = function () {
    const ch = G.chapterDef();
    if (!ch) return '';
    const g = ch.goals.find(x => x.id === G.activeGoal) || ch.goals.find(x => !G.flags[x.id]);
    if (!g) return '';
    let text = g.text;
    if (g.count && G.world) {
      const n = G.world.things.filter(e => e.kind === 'thornSprite' && e.dead).length;
      text += ` (${n}/${g.count})`;
    }
    return text;
  };

  // ---------------------------------------------------------------- story scripts
  G.queueScript = function (id) { if (!G.world.fired['s:' + id]) { G.world.fired['s:' + id] = true; G.pending = id; } };
  G.runScript = function (id) {
    const steps = ST.SCRIPTS[id];
    if (!steps) throw new Error('no script ' + id);
    G.script = { id, steps, i: 0 };
    G.state = 'talk';
    const p = G.world.player; p.vx = 0; p.swing = null; p.dashT = 0;
    G.hud.prompt(null); G.hud.talkButton(null);
    input.clear();
    G.advance();
  };
  G.advance = function () {
    const sc = G.script;
    if (!sc || G.choosing) return;
    while (sc.i < sc.steps.length) {
      const st = sc.steps[sc.i++];
      if (Array.isArray(st)) {
        G.hud.dialog(st[0], st[1]);
        G.talkWait = 10; // a short pause so a held button doesn't skip the line
        return;
      }
      if (st.choose) {
        G.choosing = st.choose;
        G.hud.choice(st.choose.map(o => o.text));
        G.talkWait = 12;
        return;
      }
      G.act(st);
    }
    // A bond reached a new heart during this conversation: its heart scene plays next.
    while (G.heartQueue.length) {
      const id = G.heartQueue.shift();
      if (ST.SCRIPTS[id]) { G.script = { id, steps: ST.SCRIPTS[id].slice(), i: 0 }; return G.advance(); }
    }
    G.script = null;
    G.hud.dialog(null);
    G.hud.sceneArt(null);
    input.clear();
    if (G.afterScript) { const f = G.afterScript; G.afterScript = null; f(); }
    else if (G.state === 'talk') G.state = 'play';
  };
  G.act = function (st) {
    const w = G.world;
    switch (st.do) {
      case 'goal': G.activeGoal = st.id; G.hud.goal(true); break;
      case 'flag': G.flags[st.name] = true; G.hud.goal(); break;
      case 'wyrm': w.wyrm.on = true; w.wyrm.x = w.player.x - 13 * TS; fx.kick(8); fx.flashScreen(10, 'rgba(10,30,20,0.6)'); break;
      case 'gate': { const g = w.gates.find(x => x.id === st.id); if (g) { w.room.setGate(g, false); fx.kick(3); } break; }
      case 'meet': G.meet(st.who); break;
      case 'bond': G.bond(st.who, st.pts); break;
      case 'art': G.hud.sceneArt(st.id, st.title); break;
      case 'cue': G.hud.sceneCue(st.name); break;
      case 'goto': { const sc = G.script; sc.steps = sc.steps.slice(0, sc.i).concat(ST.SCRIPTS[st.id], sc.steps.slice(sc.i)); break; }
      case 'winnow': G.winnow(st.npc, st.near != null ? Math.floor(w.player.x / TS) + st.near : st.to, st.y); break;
      case 'complete': G.afterScript = () => G.completeChapter(); break;
      case 'end': G.afterScript = () => { G.state = 'end'; G.hud.end(true); }; break;
    }
  };
  // The player picked choice `idx`: apply its bond points, then play its reply.
  G.pick = function (idx) {
    const opts = G.choosing, sc = G.script;
    if (!opts || !sc || !opts[idx]) return;
    const o = opts[idx];
    G.choosing = null;
    G.hud.choice(null);
    for (const who in (o.bond || {})) G.bond(who, o.bond[who], o.liked === who);
    sc.steps = sc.steps.slice(0, sc.i).concat(o.then || [], sc.steps.slice(sc.i));
    G.advance();
  };

  // ---------------------------------------------------------------- bonds (DESIGN.md: 5 hearts each)
  G.heartsFor = pts => 1 + ST.HEARTS_AT.filter(t => pts >= t).length;
  G.meet = function (who) {
    if (!G.progress.met.includes(who)) G.progress.met.push(who);
    if (!G.progress.bonds[who]) {
      G.progress.bonds[who] = { pts: 0 };
      G.hud.toast(`\u2665 ${ST.CAST[who].name}: heart 1 of 5`);
    }
    G.save();
  };
  G.bond = function (who, pts, liked) {
    if (!G.progress.bonds[who]) G.progress.bonds[who] = { pts: 0 };
    const b = G.progress.bonds[who], before = G.heartsFor(b.pts);
    b.pts += pts;
    const after = G.heartsFor(b.pts), name = ST.CAST[who].name;
    if (after > before) {
      G.hud.toast(`\u2665 ${name}: heart ${after} of 5`);
      G.heartQueue.push(`heart_${who}_${after}`);
    } else G.hud.toast(liked ? `${name} loved that.` : `${name} will remember that.`);
    G.save();
  };

  // Fae can "winnow": vanish in starlight and reappear somewhere else.
  G.winnow = function (id, toX, row) {
    const w = G.world;
    let n = w.npcs.find(x => x.id === id);
    if (!n) { n = { id, x: 0, y: 0, facing: -1, hidden: true }; w.npcs.push(n); }
    const sparkle = (x, y) => fx.burst(x, y - 24, 16, { speed: 2, life: 30, gravity: -0.02, colors: ['#b9a8ff', '#fff6d8', '#6a5aa8'], glow: true });
    if (!n.hidden) sparkle(n.x, n.y);
    n.x = toX * TS + TS / 2;
    n.y = row != null ? row * TS : w.room.groundY(Math.floor(toX), 0);
    n.hidden = false;
    sparkle(n.x, n.y);
  };

  // ---------------------------------------------------------------- one game frame (1/60 s)
  G.step = function () {
    const w = G.world, p = w.player;
    input.step();
    if (G.state === 'talk') { G.talkStep(); fx.update(); return; }
    if (input.pressed.pause && G.state === 'play') { G.pause(); return; }
    if (G.state !== 'play') return;
    if (G.pending) { const id = G.pending; G.pending = null; G.runScript(id); return; }
    if (w.koT > 0) { G.koStep(); fx.update(); return; }
    if (fx.hitstop > 0) {
      fx.hitstop--;
      if (input.pressed.attack) p.atkBuf = SH.COMBAT.attackBuffer + 1;
      if (input.pressed.jump) p.jumpBuf = SH.tune.jumpBufferFrames + 1;
      if (input.pressed.dash) p.dashBuf = 7;
      return;
    }
    if (fx.slowmo > 0) fx.slowmo--;
    w.time++;

    const def = w.room.def;
    const painting = G.paintStep();
    if (!painting) p.update(w);
    for (const e of w.things) e.update(w);
    // arrows fly, drop a little, stick in the ground, and bring down the stag
    for (const a of w.arrows) {
      a.life--;
      if (a.stuck) continue;
      a.vy += 0.05; a.x += a.vx; a.y += a.vy;
      const tile = w.room.get(Math.floor(a.x / TS), Math.floor(a.y / TS));
      if (tile === SH.T_SOLID) { a.stuck = true; a.life = Math.min(a.life, 60); continue; }
      for (const e of w.things) {
        if (!e.arrowOnly || !e.hittable()) continue;
        const hb = e.hurtBox();
        if (a.x > hb.l && a.x < hb.r && a.y > hb.t && a.y < hb.b) { e.takeHit({ arrow: true, dir: Math.sign(a.vx) }, w); a.life = 0; break; }
      }
    }
    w.arrows = w.arrows.filter(a => a.life > 0);

    // thorns and pits
    const b = p.box();
    const inThorns = SH.touchesThorns(w.room, b.l + 3, b.t, b.r - 3, b.b);
    if (inThorns || p.y > w.room.pxH + 40) G.hazard(inThorns ? 'thorns' : 'pit');

    // the Deep Wyrm
    if (w.wyrm && w.wyrm.on) {
      w.wyrm.x += w.wyrm.speed;
      if (w.time % 3 === 0) fx.kick(1.2);
      if (p.x - p.w / 2 < w.wyrm.x + 12 && !p.dead) G.caught();
    }

    // lanterns: checkpoints that restore your hearts when first lit
    for (const l of w.lanterns) {
      const at = Math.abs(p.x - l.px) < 22 && Math.abs(p.y - l.py) < 30;
      if (at && !l.lit) {
        l.lit = true; p.hearts = p.maxHearts;
        fx.ring(l.px, l.py - 46, '#ffd27a', 50, 26, 2);
        fx.burst(l.px, l.py - 46, 16, { speed: 2, life: 30, gravity: -0.03, colors: ['#ffd27a', '#fff6d8'], glow: true });
        G.hud.toast('Lantern lit: hearts restored. You come back here if knocked out.');
      }
      if (at && w.checkpoint !== l) w.checkpoint = l;
    }

    const tx = p.x / TS;
    // story triggers
    for (let i = 0; i < (def.triggers || []).length; i++) {
      const tr = def.triggers[i];
      if (w.fired[i] || tx < tr.x || (tr.flag && !G.flags[tr.flag])) continue;
      if (tr.above != null && !(p.grounded && p.y <= tr.above * TS + 2)) continue;
      w.fired[i] = true; G.runScript(tr.script); return;
    }
    // optional people you can talk to
    let talkable = null;
    for (const n of w.npcs) {
      n.near = !n.hidden && Math.abs(p.x - n.x) < 46 && Math.abs(p.y - n.y) < 50;
      if (!n.hidden) n.facing = p.x > n.x ? 1 : -1;
      n.bubble = !!n.optional && !w.fired['talk:' + n.id] && !n.hidden;
      if (n.near && n.optional) talkable = n;
    }
    if (talkable && input.pressed.up) { w.fired['talk:' + talkable.id] = true; G.runScript(talkable.optional); return; }
    // chapter 2: all sprites cleared -> Caelum arrives
    if (G.activeGoal === 'sprites' && !w.fired.spritesDone && w.things.filter(e => e.kind === 'thornSprite').every(e => e.dead)) {
      w.fired.spritesDone = true;
      G.winnow('caelum', Math.min(def.width - 4, Math.floor(tx) + 3));
      G.queueScript('ring_done');
    }

    // control hints and the TALK / PAINT button
    const hint = (def.hints || []).find(h => tx >= h.x0 && tx < h.x1 && (!h.flag || G.flags[h.flag]));
    const canPaint = w.muralNear && def.mural && !G.flags[def.mural.flag];
    G.hud.prompt(hint ? input.fill(hint.text) : canPaint ? input.fill('Hold {PAINT} to paint the wall.') : null);
    G.hud.talkButton(talkable ? 'TALK' : canPaint ? 'PAINT' : null);

    for (const g of w.gates) if (!g.closed && (g.lift || 0) < 1) g.lift = (g.lift || 0) + 0.03;
    w.cityLight += (w.cityLightTarget - w.cityLight) * 0.03;
    G.hud.hearts(p.hearts, p.maxHearts);
    G.cameraTarget();
    w.cam.x += (w.camT.x - w.cam.x) * 0.14;
    w.cam.y += (w.camT.y - w.cam.y) * 0.10;
    fx.update();
    if (w.fade > 0) w.fade = Math.max(0, w.fade - 0.08);
  };

  // Painting the mural: stand at the wall and hold TALK.
  G.paintStep = function () {
    const w = G.world, p = w.player, m = w.room.def.mural;
    if (!m) return false;
    const cx = (m.x + m.w / 2) * TS;
    w.muralNear = Math.abs(p.x - cx) < m.w * TS / 2 + 10 && p.grounded && !!G.flags[m.needs] && !G.flags[m.flag];
    if (!w.muralNear || !input.held.up) return false;
    p.vx = 0; p.swing = null;
    w.muralProgress = Math.min(1, w.muralProgress + 1 / m.frames);
    if (w.time % 4 === 0) fx.burst(m.x * TS + m.w * TS * w.muralProgress, 16 * TS - 40 - Math.random() * 60, 2, { speed: 1, life: 20, colors: ['#ffd27a', '#ff9a7a', '#8a6aff', '#4ad8c8'], glow: true });
    if (w.muralProgress >= 1) {
      G.flags[m.flag] = true;
      G.flags.mural = true;
      w.cityLightTarget = 1;
      fx.ring(cx, 16 * TS - 54, '#ffd27a', 90, 40, 3);
      fx.burst(cx, 16 * TS - 54, 40, { speed: 3, life: 50, gravity: -0.02, colors: ['#ffd27a', '#fff6d8', '#ff9a7a', '#8a6aff'], glow: true });
      G.hud.toast('The first mural is finished. The street wakes up.');
      G.queueScript(m.script);
    }
    return true;
  };

  G.talkStep = function () {
    if (G.talkWait > 0) { G.talkWait--; return; }
    if (G.choosing) {
      if (input.pressed.up) G.hud.choiceMove(-1);
      else if (input.pressed.down) G.hud.choiceMove(1);
      else if (input.pressed.jump || input.pressed.attack) G.pick(G.hud.choiceIndex());
      return;
    }
    if (input.pressed.jump || input.pressed.attack || input.pressed.up || input.pressed.dash) G.advance();
  };

  G.hazard = function (kind) {
    const w = G.world, p = w.player;
    if (p.invuln <= 0) { p.hearts = Math.max(0, p.hearts - 1); p.stats.hurt++; }
    fx.flashScreen(8, kind === 'thorns' ? 'rgba(255,80,110,0.4)' : 'rgba(10,10,30,0.8)');
    fx.kick(4);
    if (p.hearts <= 0) { G.knockout(); return; }
    p.respawnAt(p.lastSafe.x, p.lastSafe.y, SH.PLAYER.hazardInvuln);
    if (w.wyrm && w.wyrm.on) w.wyrm.x = Math.min(w.wyrm.x, p.x - 9 * TS);
    G.snapCamera();
    w.fade = 0.7;
    fx.word(p.x, p.y - 52, kind === 'thorns' ? 'ouch: thorns' : 'fell', '#ff9aa8', 40);
  };

  G.caught = function () {
    const w = G.world, p = w.player;
    fx.flashScreen(10, 'rgba(0,0,0,0.9)'); fx.kick(6);
    G.hud.toast('The Wyrm caught you. Try again: keep running and jump the gaps.');
    const c = w.checkpoint;
    p.respawnAt(c.px + 14, c.py, 40); p.facing = 1; p.hearts = p.maxHearts;
    w.wyrm.x = p.x - 13 * TS;
    G.snapCamera(); w.fade = 1;
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
      if (w.wyrm && w.wyrm.on) w.wyrm.x = p.x - 13 * TS;
      G.snapCamera();
      G.hud.toast('Knocked out. Back at the last lantern, no harm done.');
    }
    if (w.koT >= 46) w.fade = Math.max(0, 1 - (w.koT - 46) / 25);
    if (w.koT > 72) { w.koT = 0; w.fade = 0; }
  };

  G.pause = function () { if (G.state !== 'play') return; G.state = 'pause'; input.clear(); G.hud.menu(true); };
  G.resume = function () { G.state = 'play'; input.clear(); G.hud.menu(false); G.hud.tune(false); G.hud.journal(false); };

  // ---------------------------------------------------------------- loop
  let acc = 0, last = 0;
  G.loop = function (now) {
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
    last = now;
    input.pollPad();
    if (!G.frozen) {
      if (G.state === 'play' || G.state === 'talk') {
        acc += dt * (fx.slowmo > 0 ? 0.4 : 1);
        let n = 0;
        while (acc >= 1 / 60 && n < 5) { G.step(); acc -= 1 / 60; n++; }
        if (n === 5) acc = 0;
      } else { acc = 0; G.menuInput(); }
    }
    G.render();
    requestAnimationFrame(G.loop);
  };
  G.render = function () {
    if (document.body.dataset.state !== G.state) document.body.dataset.state = G.state;
    const w = G.world;
    if (!w) return;
    G.ctx.imageSmoothingEnabled = false;
    SH.draw.frame(G.ctx, w);
  };

  // Menus can be driven by keyboard and gamepad as well as taps.
  G.menuInput = function () {
    const go = () => input.take('jump') || input.take('attack');
    if (G.state === 'title') { if (go()) G.hud.titlePrimary(); }
    else if (G.state === 'card') { if (go()) G.hud.cardGo(); }
    else if (G.state === 'pause') { if (input.take('pause')) G.resume(); }
  };

  G.newGame = function () {
    G.progress = { reached: 0, bonds: {}, met: [] }; G.save();
    G.hud.title(false);
    G.startChapter(0);
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

  // ---------------------------------------------------------------- test hooks (tests/*.js)
  SH.test = {
    // load(chapterIndex): that chapter with its story, past its title card.
    // load('roomId', { story: false }): a bare room, every gate open, no story scripts.
    load(chapterOrRoom, opts) {
      opts = opts || {};
      G.frozen = true; input.forced = { held: {}, pressed: {} };
      G.hud.title(false);
      if (typeof chapterOrRoom === 'number') { G.startChapter(chapterOrRoom); G.hud.cardGo(); }
      else {
        const ci = ST.CHAPTERS.findIndex(c => c.room === chapterOrRoom);
        G.chapter = ci >= 0 ? ci : ST.CHAPTERS.length - 1; G.flags = { combo: true, pit: true, arrive: true }; G.activeGoal = null; G.script = null; G.pending = null;
        fx.reset(); G.build(chapterOrRoom);
        const w = G.world;
        for (const g of w.gates) w.room.setGate(g, false);
        if (opts.story === false) (w.room.def.triggers || []).forEach((t, i) => (w.fired[i] = true));
        G.state = 'play';
      }
      G.hud.dialog(null); G.hud.choice(null); G.hud.sceneArt(null); G.choosing = null; G.heartQueue = [];
      return SH.test.state();
    },
    // Step n frames holding `held` (e.g. {right:true}); `press` actions are pressed on the first frame.
    // With autoTalk, dialogue and chapter cards are clicked through as they appear.
    step(n, held, press, autoTalk) {
      for (let i = 0; i < n; i++) {
        input.forced.held = held || {};
        input.forced.pressed = {};
        if (i === 0 && press) for (const a of press) input.forced.pressed[a] = true;
        if (autoTalk && G.state === 'talk' && G.talkWait <= 0) {
          if (G.choosing) { G.pick(Math.min(SH.test.choice || 0, G.choosing.length - 1)); continue; }
          input.forced.pressed.jump = true;
        }
        if (autoTalk && G.state === 'card') G.hud.cardGo();
        G.step();
      }
      return SH.test.state();
    },
    place(tx, ty) { const p = G.world.player; p.respawnAt(tx * TS + TS / 2, ty * TS); p.grounded = true; G.snapCamera(); },
    state() {
      const p = G.world.player;
      return { x: p.x, y: p.y, tx: p.x / TS, ty: p.y / TS, vx: p.vx, vy: p.vy, grounded: p.grounded, hearts: p.hearts, stats: p.stats, state: G.state, chapter: G.chapter, goal: G.activeGoal, flags: Object.assign({}, G.flags), ko: G.world.koT || 0 };
    },
    render() { G.render(); },
  };
})(window.SH = window.SH || {});
