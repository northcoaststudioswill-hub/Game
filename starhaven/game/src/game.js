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
  SH.settings = Object.assign({ autoDown: true, sfx: 70, music: 50, textSpeed: 'normal', shake: true }, store.get('starhaven.settings.v1', {}));

  const G = SH.game = {
    state: 'front', world: null, frozen: false, slot: null,
    chapter: 0, flags: {}, activeGoal: null, script: null,
    progress: { reached: 0, bonds: {}, met: [], playFrames: 0 },
    heartQueue: [],
  };
  // Saves go to the current slot (none in chapter select). `where` overrides the resume point after a chapter ends.
  G.save = function (show) {
    if (G.slot == null) return;
    const pr = G.progress;
    SH.saves.write(G.slot, {
      chapter: G.resumeAt != null ? G.resumeAt : G.chapter, pending: G.resumeAt != null ? G.pending2 : null,
      reached: pr.reached, bonds: pr.bonds, met: pr.met, playFrames: pr.playFrames || 0, motes: pr.motes || {}, stars: pr.stars || {}, mem: pr.mem || {}, seen: pr.seen || {}, bonus: pr.bonus || 0, xp: pr.xp || 0, lore: pr.lore || {}, said: SH.arts.said, bondMeter: Math.round(SH.arts.meter),
    });
    if (show) G.hud.saved();
  };
  G.newGame = function (slot) {
    G.slot = slot == null ? null : slot;
    G.progress = { reached: 0, bonds: {}, met: [], playFrames: 0, motes: {}, stars: {} };
    SH.arts.newGame();
    G.startChapter(0);
  };
  G.playChapter = function (i) {   // chapter select: no saving
    G.slot = null;
    G.progress = { reached: i, bonds: {}, met: [], playFrames: 0, motes: {} };
    G.startChapter(i);
  };
  G.loadSlot = function (slot) {
    const s = SH.saves.all()[slot];
    if (!s) return G.newGame(slot);
    G.slot = slot;
    G.progress = { reached: s.reached, bonds: JSON.parse(JSON.stringify(s.bonds || {})), met: (s.met || []).slice(), playFrames: s.playFrames || 0, motes: Object.assign({}, s.motes), stars: Object.assign({}, s.stars), mem: JSON.parse(JSON.stringify(s.mem || {})), seen: Object.assign({}, s.seen), bonus: s.bonus || 0, xp: s.xp || 0, lore: Object.assign({}, s.lore) };
    SH.arts.newGame(); SH.arts.said = Object.assign({}, s.said); SH.arts.meter = s.bondMeter || 0;
    const N = ST.CHAPTERS.length, target = s.chapter;
    const goOn = () => { if (target < N) G.startChapter(target); else G.runScript('finale'); };
    if (s.pending) {           // quit during an evening: play it again, then go on
      G.chapter = Math.max(0, Math.min(N - 1, target - 1));
      G.flags = {}; G.activeGoal = null; G.script = null; G.pending = null; fx.reset();
      G.build(ST.CHAPTERS[G.chapter].room);
      G.resumeAt = target; G.pending2 = s.pending;
      G.afterScript = () => { G.resumeAt = null; G.pending2 = null; goOn(); };
      G.runScript(s.pending);
    } else if (target >= N) { G.chapter = N - 1; G.build(ST.CHAPTERS[N - 1].room); G.state = 'end'; G.hud.end(true); }
    else goOn();
  };

  // What Wren can do in this chapter. Mortal in the Winter Woods: one jump, no dash, a bow instead of daggers.
  const ABILITIES = { double: true, dash: true, daggers: true, bow: false, flame: false };
  G.can = name => { const ch = G.chapterDef(); const a = Object.assign({}, ABILITIES, ch && ch.abilities); return !!a[name]; };
  Object.defineProperty(G, 'mortal', { get: () => !!(G.chapterDef() && G.chapterDef().mortal) });
  G.chapterDef = () => ST.CHAPTERS[G.chapter];

  // ---------------------------------------------------------------- building a room
  G.build = function (roomId) {
    const def = SH.ROOMS[roomId], room = SH.buildRoom(def);
    const player = new SH.Player(def.start.x * TS + TS / 2, def.start.y * TS);
    const things = def.spawns.map(s => SH.makeSpawn(s, room));
    const lanterns = def.lanterns.map(l => ({ ...l, px: l.x * TS + TS / 2, py: room.groundY(l.x, l.from || 0), lit: !!l.lit }));
    const npcs = def.npcs.map(n => ({ ...n, x: n.x * TS + TS / 2, y: room.groundY(Math.floor(n.x), n.from || 0), facing: -1, near: false }));
    const gates = def.gates.map(g => ({ ...g, lift: g.open ? 1 : 0 }));
    const w = {
      room, player, things, lanterns, npcs, gates, input, motes: room.motes,
      targets: things,
      cam: { x: 0, y: 0 }, viewW: G.viewW || 640, time: 0, fade: 0,
      checkpoint: lanterns[0],
      fired: {},
      cityLight: def.cityLight || 0.05, cityLightTarget: def.cityLight || 0.05,
      muralProgress: 0,
      wyrm: def.chase ? { on: false, x: def.chase.wyrmX * TS, speed: def.chase.speed } : null,
      camCenterX() { return this.cam.x + this.viewW / 2; },
      onKill(e) { G.hud.goal(); SH.arts.whisper('kill');
        if (e && e.kind === 'thornSprite') { fx.burst(e.x, e.y - 12, 26, { speed: 3.2, life: 46, gravity: 0.1, drag: 0.95, size: 3, colors: ['#2f5c2b', '#8fd16b', '#5a1d3e', '#ff5a78'] }); fx.ring(e.x, e.y - 12, '#8fd16b', 34, 16, 2); } SH.xp.gain(e && e.boss ? 80 : e && e.kind === 'wyrm' ? 25 : 10, true); },
      onDash() { },
      onPerfectDodge() {
        fx.slowmo = 26; player.stats.perfect++;
        player.dashCd = 0; player.airDashes = 1;
        fx.word(player.x, player.y - 52, 'PERFECT DODGE', '#9fe8ff', 60); G.explain('opening'); SH.xp.gain(3);
        SH.arts.open(this);
        fx.ring(player.x, player.y - 20, '#9fe8ff', 44, 22, 2);
      },
      onKnockout() { G.knockout(); },
      arrows: [],
      spawnArrow(x, y, dir, ang, fae) { const sp = fae ? 10.5 * (SH.xp.level() >= 7 ? 1.2 : 1) : 8; this.arrows.push(fae ? { x, y, vx: dir * Math.cos(ang) * sp, vy: -Math.sin(ang) * sp, life: 90, stuck: false, fae: true, g: 0.03 } : { x, y, vx: dir * 8, vy: -0.5, life: 110, stuck: false }); },
      fireballs: [], rocks: [], waves: [],
      spawnFireball(x, y, dir, big) { const F = SH.GIFTS.flame; this.fireballs.push({ x, y, vx: dir * (big ? F.waveSpeed : F.speed), life: F.life, dir, big: !!big, hit: new Set() }); },
      spawnWave(x, y, dir) { this.waves.push({ x, y, dir, life: 80, t: 0 }); },
      // The Old Wyrm hits the cliff: rocks fall near Wren, with a shadow first so you can dodge.
      dropRocks(n, at) {
        for (let i = 0; i < n; i++) this.rocks.push({ x: at != null ? at + (i - (n - 1) / 2) * 30 : player.x + (Math.random() - 0.5) * 360, y: -20 - Math.random() * 120, vy: 0, warn: 50 + i * 10, ground: null });
      },
      onBossDown() { const b = this.things.find(e => e.boss), d = (b && b.def) || {}; if (b) G.look(b.x, b.y - 30, 1.5, 110); fx.slowmo = 90; SH.arts.finisher(d.slain || 'WYRMSLAYER', d.falls || 'THE OLD WYRM FALLS', '#ffd27a'); G.boss = null; SH.sfx.music(G.roomMusic); this.victoryT = 1; this.victoryAt = b ? { x: b.x, y: b.y - 30 } : null; this.victoryScript = d.after || 'mtn_peak'; this.victoryWords = d.quiet || 'THE HOLLOW IS QUIET'; this.rocks = []; this.waves = []; },
      onStagDown() { SH.sfx.play('kill'); G.queueScript('woods_kill'); },
      // the Winter Woods
      onPickup(what) {
        if (what === 'plums') { G.queueScript('ring_plums'); return; }
        if (what === 'cat') { G.queueScript('ashes_cat_found'); return; }
        if (what === 'page') { G.queueScript('mtn_page'); return; }
        if (what === 'lamp') { G.flags.n_lamps = (G.flags.n_lamps || 0) + 1; SH.xp.gain(5, true); SH.sfx.play('lantern'); fx.word(player.x, player.y - 50, 'Lamp ' + G.flags.n_lamps + '/4', '#ffd27a', 70); fx.ring(player.x, player.y - 30, '#ffd27a', 40, 20, 2); this.cityLightTarget = Math.min(1, (this.cityLightTarget || 0) + 0.08); if (G.flags.n_lamps === 4) { G.flags.lamps4 = true; G.queueScript(def.lampScript || 'ashes_lamps'); } return; }
        if (what === 'pack' || what === 'tally') { G.progress.seen = G.progress.seen || {}; G.progress.seen['d_' + what] = 1; SH.xp.gain(8, true); G.queueScript('deep_' + what); return; }
        if (what === 'herb') { G.remember('green', 'Found wintergreen under the snow for Lissa.', true); G.queueScript('woods_herb'); return; }
        G.flags.n_wood = (G.flags.n_wood || 0) + 1;
        fx.word(player.x, player.y - 50, 'Firewood ' + G.flags.n_wood + '/3', '#ffd27a', 60);
        if (G.flags.n_wood === 3) G.queueScript('woods_wood');
      },
      onAltar(a) { a.broken = true; fx.kick(5); SH.sfx.play('thud'); fx.burst(a.x, a.y - 40, 30, { speed: 2.4, life: 50, gravity: -0.03, colors: ['#1a1626', '#6a5aa8', '#c8b8ff'] }); G.queueScript('deep_altar_' + a.what); },   // the Weighing: whichever memory she lays down, the dark takes
      onSnare(n) { SH.xp.gain(3, true); G.flags.n_snares = (G.flags.n_snares || 0) + 1; if (G.flags.n_snares >= 3) G.flags.snares3 = true; G.hud.goal(true); G.queueScript('woods_snare' + n); },
      onTarget(tg) { SH.xp.gain(4, true); if (tg && tg.blade) { G.flags.n_rings = (G.flags.n_rings || 0) + 1; if (G.flags.n_rings === 3) G.queueScript('ring_rings'); return; } G.flags.n_targets = (G.flags.n_targets || 0) + 1; if (G.flags.n_targets === 3) G.queueScript('woods_targets'); },
      onWolf(what) { if (what === 'killed' || what === 'spared') SH.xp.gain(15, true); G.queueScript('woods_wolf_' + what); },
      onDummyCombo() { if (G.activeGoal === 'combo' && def.dummyCombo) G.queueScript(def.dummyCombo); },
      onDummyMove(m) { if (G.activeGoal === 'rise' && m === 'up') G.queueScript('ring_rise'); else if (G.activeGoal === 'lunge' && m === 'thrust') G.queueScript('ring_lunge'); },
      onGuard(parry) { if (G.activeGoal === 'guard') G.queueScript('ring_guard'); },
    };
    G.world = w;
    G.explainWait = Math.max(G.explainWait || 0, 60 * 6);   // let a new place be looked at first
    SH.arts.reset(); w.lowT = 0;
    document.body.dataset.court = { woods: 'mortal', deep: 'thorn' }[def.id] || 'dusk';   // whose realm this is: it colors the menus
    if (SH.xp.level() >= 5 && SH.arts.active()) SH.arts.meter = Math.max(SH.arts.meter, 34);
    SH.draw.init(room, w.viewW);   // drawn with gates open, so gates draw on top as objects
    for (const g of gates) room.setGate(g, !g.open);
    w.thorns = (def.thornWalls || []).map(t => ({ ...t }));
    for (const t of w.thorns) room.setThorns(t, true);
    G.boss = null;
    G.snapCamera();
    G.hud.hearts(player.hearts, player.maxHearts);
    G.hud.prompt(null); G.hud.talkButton(null);
    G.hud.xp(); G.hud.abilities(); G.hud.boss(null); G.hud.motes(0, room.motes.length);
    G.roomMusic = def.music || { winter: 'woods', deep: 'deep', mountain: 'mountain' }[def.theme] || 'city';
    SH.sfx.music(G.roomMusic);
    return w;
  };

  G.snapCamera = function () { const w = G.world; G.cameraTarget(); w.cam.x = w.camT.x; w.cam.y = w.camT.y; };
  // The camera director. It follows Wren, and it also acts: it pushes in on heavy hits, frames whoever is talking,
  // closes on a Bond Art, and goes to the boss when it roars or falls. (Sootborn and Guttercrown both shoot their
  // fights; Starhaven's camera only ever followed.)
  G.punch = function (amount) { const c = G.world.cam; c.kick = Math.min(0.22, Math.max(c.kick || 0, amount)); };
  G.look = function (x, y, zoom, frames) { G.world.cam.shot = { x, y, zoom, t: frames }; };
  G.direct = function () {
    const w = G.world, p = w.player, c = w.cam, A = SH.arts;
    let zt = 1, fx0 = p.x, fy0 = p.y - 30;
    if (c.shot && c.shot.t > 0) { c.shot.t--; zt = c.shot.zoom; fx0 = c.shot.x; fy0 = c.shot.y; }
    else if (A.cutin || A.scene) { zt = 1.22; const f = A.scene && A.scene.focus; if (f) { fx0 = f.x; fy0 = f.y; } }
    else if (G.state === 'talk') {
      const sp = w.npcs.filter(n => !n.hidden && Math.abs(n.x - p.x) < 220).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0];
      if (sp) { zt = 1.16; fx0 = (sp.x + p.x) / 2; fy0 = p.y - 44; }
    }
    c.kick = (c.kick || 0) * 0.86; if (c.kick < 0.002) c.kick = 0;
    c.zoomBase = (c.zoomBase || 1) + (zt - (c.zoomBase || 1)) * 0.09;
    c.zoom = c.zoomBase + c.kick;
    if (Math.abs(c.zoom - 1) < 0.003) c.zoom = 1;
    c.fx = c.fx == null ? fx0 : c.fx + (fx0 - c.fx) * 0.12; c.fy = c.fy == null ? fy0 : c.fy + (fy0 - c.fy) * 0.12;
    c.sx = Math.max(60, Math.min(w.viewW - 60, c.fx - c.x)); c.sy = Math.max(60, Math.min(SH.VIEW_H - 40, c.fy - c.y));
  };
  G.cameraTarget = function () {
    const w = G.world, p = w.player;
    const look = p.facing * 46 + p.vx * 8;
    let tx = p.x + look - w.viewW / 2;
    if (G.boss && !G.boss.dead && G.boss.kind === 'shadow') {   // a flying boss: keep both of them in the picture, Wren never too near an edge
      const midX = (p.x + G.boss.x) / 2 - w.viewW / 2; tx = Math.max(p.x - w.viewW * 0.76, Math.min(p.x - w.viewW * 0.24, midX));
    }
    let ty = p.y - SH.VIEW_H * (0.64 + (w.room.def.camLift || 0));   // a level with things in the air looks up a little more
    tx = Math.max(0, Math.min(w.room.pxW - w.viewW, tx));
    ty = Math.max(0, Math.min(w.room.pxH - SH.VIEW_H, ty));
    w.camT = { x: tx, y: ty };
  };

  // ---------------------------------------------------------------- chapters
  G.startChapter = function (i) {
    G.chapter = i;
    document.body.dataset.court = { woods: 'mortal', deep: 'thorn' }[ST.CHAPTERS[i].room] || 'dusk';
    G.resumeAt = null; G.pending2 = null;
    G.flags = {}; G.activeGoal = null; G.script = null; G.pending = null;
    fx.reset();
    const ch = G.chapterDef();
    G.build(ch.room);
    G.state = 'card';
    G.hud.card({ label: ch.label, name: ch.name, text: ch.card, goals: ch.goals.map(g => g.text), button: 'Begin' }, () => {
      G.state = 'play'; input.clear(); G.hud.goal();
    });
    G.hud.goal();
    G.save(true);
  };

  G.completeChapter = function () {
    const ch = G.chapterDef(), next = G.chapter + 1;
    G.progress.reached = Math.max(G.progress.reached, next);
    SH.xp.gain(20);
    G.resumeAt = next; G.pending2 = ch.after || null;
    G.save(true);
    G.state = 'card';
    // After the card: the chapter's evening (if it has one), then the next chapter, or the finale.
    const cont = () => { G.pending2 = null; G.save(); if (next < ST.CHAPTERS.length) G.startChapter(next); else G.runScript('finale'); };
    // how the chapter went: time, hearts lost, Starlight gathered (your best is kept)
    const w = G.world, got = w.motes.filter(m => m.got).length, total = w.motes.length;
    if (!G.progress.motes) G.progress.motes = {};
    G.progress.motes[ch.id] = Math.max(G.progress.motes[ch.id] || 0, got);
    const secs = Math.round((w.frames || 0) / 60);
    const stats = [`Time ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, `Hits taken ${w.player.stats.hurt}`];
    if (total) stats.push(`Starlight ${got} / ${total}${got === total ? ' \u2726 all of it' : ''}`);
    G.save();
    G.hud.card({ label: ch.label + ' complete', name: ch.name, text: ch.done, goals: null, stats, button: 'Continue' }, () => {
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
      const n = g.counter ? (G.flags['n_' + g.counter] || 0) : G.world.things.filter(e => e.kind === 'thornSprite' && e.dead).length;
      text += ` (${n}/${g.count})`;
    }
    if (g.id === 'stacks_done' && G.world && SH.ch4) { const tot = SH.ch4.pagesTotal(G.world); if (tot) text += ` \u00b7 pages safe ${tot - (G.flags.pagesLost || 0)}/${tot}`; }
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
        {   // acting: everyone turns to the speaker; the speaker reacts to their own line
          const w = G.world, sp = w.npcs.find(n => n.id === st[0] && !n.hidden), px = sp ? sp.x : w.player.x;
          for (const n of w.npcs) if (n !== sp && !n.hidden && Math.abs(n.x - px) > 4) n.facing = px > n.x ? 1 : -1;
          if (sp) { sp.facing = w.player.x > sp.x ? 1 : -1; const last = st[1].trim().slice(-1); sp.emote = last === '!' ? { e: '!', t: 0 } : last === '?' ? { e: '?', t: 0 } : /\.\.\.$/.test(st[1].trim()) ? { e: '...', t: 0 } : sp.emote; }
          else if (st[0] === 'wren') w.player.facing = (() => { const near = w.npcs.filter(n => !n.hidden).sort((a, b) => Math.abs(a.x - w.player.x) - Math.abs(b.x - w.player.x))[0]; return near && Math.abs(near.x - w.player.x) < 200 ? (near.x > w.player.x ? 1 : -1) : w.player.facing; })();
        }
        G.talkWait = 16; // a pause so a held or hurried tap doesn't skip a line unread
        return;
      }
      if (st.if) {   // the story comes back to something Wren did
        const has = k => G.recalls(k) || !!G.flags[k], yes = st.if[0] === '!' ? !has(st.if.slice(1)) : has(st.if);
        sc.steps = sc.steps.slice(0, sc.i).concat(yes ? st.then || [] : st.else || [], sc.steps.slice(sc.i));
        continue;
      }
      if (st.do === 'mode') {   // another way of seeing: the script waits for it, then carries on
        const sc0 = sc;
        SH.modes.start(st.name, st, r => {
          if (st.name === 'flight' && st.variant === 'wall') { if (r && r.stars) { SH.xp.gain(Math.min(20, r.stars)); G.hud.toast('Wisps gathered on the ride: ' + r.stars + '.'); } }
          else if (st.name === 'flight' && r) { G.bond('caelum', r.stars >= 40 ? 10 : 5, r.stars >= 40, r.stars >= 40 ? 'She leaned into the flight instead of away from it.' : 'She held on. That was enough for a first flight.'); G.hud.toast('Starlight gathered on the wing: ' + r.stars + (r.stars >= 40 ? '. Caelum noticed.' : '.')); }
          const nx = sc0.steps[sc0.i];
          if (typeof r === 'number' && nx && nx.choose) { sc0.i++; G.choosing = nx.choose; return G.pick(Math.min(r, nx.choose.length - 1)); }
          G.advance();
        });
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
      case 'mode': break;   // skipped along with the scene
      case 'remember': G.remember(st.key, st.text, st.good); break;
      case 'starlight': SH.xp.gain(15); G.progress.bonus = (G.progress.bonus || 0) + st.n; G.hud.toast('\u2726 +' + st.n + ' Starlight: ' + st.why); SH.sfx.play('lantern'); G.save(); break;
      case 'goal': G.activeGoal = st.id; G.hud.goal(true); break;
      case 'explain': G.explain(st.key); break;
      case 'flag': G.flags[st.name] = true; G.hud.goal(); if (st.name === 'giftgot') G.explain('moons'); break;
      case 'wyrm': SH.sfx.play('rumble'); SH.sfx.music('tense'); w.wyrm.on = true; w.wyrm.x = w.player.x - 13 * TS; fx.kick(8); fx.flashScreen(10, 'rgba(10,30,20,0.6)'); break;
      case 'gate': { const g = w.gates.find(x => x.id === st.id); if (g) { w.room.setGate(g, false); fx.kick(3); } break; }
      case 'meet': G.meet(st.who); break;
      case 'emote': { const n = w.npcs.find(x => x.id === st.npc); if (n) n.emote = { e: st.e, t: 0 }; break; }
      case 'bond': G.bond(st.who, st.pts, st.liked, st.why); break;
      case 'art': G.hud.sceneArt(st.id, st.title); break;
      case 'cue': G.hud.sceneCue(st.name); if (st.name === 'door' || st.name === 'end') SH.sfx.play('thud'); if (st.name === 'rise' || st.name === 'caelum') SH.sfx.play('chime'); break;
      case 'goto': { const sc = G.script; sc.steps = sc.steps.slice(0, sc.i).concat(ST.SCRIPTS[st.id], sc.steps.slice(sc.i)); break; }
      case 'winnow': G.winnow(st.npc, st.near != null ? Math.floor(w.player.x / TS) + st.near : st.to, st.y); break;
      case 'complete': G.afterScript = () => G.completeChapter(); break;
      case 'close': case 'open': { const g = w.gates.find(x => x.id === st.id); if (g) { w.room.setGate(g, st.do === 'close'); g.lift = st.do === 'open' ? 0 : 0; fx.kick(4); SH.sfx.play('thud'); } break; }
      case 'boss': { const b = w.things.find(e => e.boss); if (b) { b.wake(); G.boss = b; SH.sfx.music('tense'); G.look(b.x, b.y - 30, 1.35, 70); SH.arts.whisper('bossStart'); } break; }
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
    if (o.remember) G.remember(o.remember[0], o.remember[1], o.remember[2]);
    for (const who in (o.bond || {})) { G.bond(who, o.bond[who], o.liked === who, o.why && (typeof o.why === 'string' ? o.why : o.why[who])); const n = G.world.npcs.find(x => x.id === who && !x.hidden); if (n && o.liked === who) n.emote = { e: 'heart', t: 0 }; }
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
  // Explain a system the first time it matters: a short card that holds the game until it is read. Once per save.
  G.calm = () => { const w2 = G.world, p2 = w2.player; return p2.grounded && !(w2.wyrm && w2.wyrm.on) && !(G.boss && !G.boss.dead) && !w2.victoryT && !w2.koT
      && !w2.things.some(e => (e.kind === 'thornSprite' || e.kind === 'wyrm' || e.kind === 'wolf' || (e.kind === 'spy' && e.active())) && !e.dead && !e.gone && Math.abs(e.x - p2.x) < 260 && Math.abs(e.y - p2.y) < 120); };
  G.explain = function (key) {
    const seen = G.progress.seen = G.progress.seen || {};
    if (G.noExplain || seen[key] || !ST.EXPLAIN[key] || G.explaining) return;
    if (G.state !== 'play' || (G.explainWait || 0) > 0 || !G.world || !G.calm()) { G.explainQ = G.explainQ || []; if (!G.explainQ.includes(key)) G.explainQ.push(key); return; }        // wait for a quiet moment
    seen[key] = 1; G.explaining = key; G.state = 'explain'; input.clear(true);
    const e = ST.EXPLAIN[key];
    document.getElementById('ex-icon').textContent = e.icon; document.getElementById('ex-title').textContent = e.title; document.getElementById('ex-text').textContent = e.text;
    document.getElementById('explain').classList.add('show'); SH.sfx.play('select');
  };
  G.explainClose = function () {
    if (!G.explaining) return;
    G.explaining = null; document.getElementById('explain').classList.remove('show'); G.state = 'play'; input.clear(true); G.save();
    G.explainWait = 60 * 22;   // a good stretch of play before the next one
  };
  // What a decision did. Effects gather for a moment, then show together as one card.
  G.effects = []; G.effectT = 0;
  G.effect = function (e) { G.effects.push(e); G.effectT = 6; };
  G.effectStep = function () { if (G.effectT > 0 && --G.effectT === 0) { G.hud.effects(G.effects); G.effects = []; } };
  // A decision the story will come back to. good: true, false, or null for neither.
  G.remember = function (key, text, good) {
    const m = G.progress.mem = G.progress.mem || {};
    if (m[key]) return;
    m[key] = { text, good: good == null ? null : !!good, ch: G.chapter };
    G.explain('remember');
    G.effect({ mem: text, good: good == null ? null : !!good });
    G.save();
  };
  G.recalls = key => !!(G.progress.mem && G.progress.mem[key]);
  // A bond's boon is live once that heart is earned (see STORY.BOND_PATH).
  G.boon = (who, h) => { const b = G.progress.bonds && G.progress.bonds[who]; return !!b && G.heartsFor(b.pts) >= (h || 2); };
  // Journal pages: written the first time their condition is true. 1 = new, 2 = read.
  G.loreOpen = function (l) {
    const pr = G.progress, w = l.when;
    if (w.ch != null) return Math.max(G.chapter, pr.reached || 0) >= w.ch;
    if (w.met) return pr.met.includes(w.met);
    if (w.pts) return !!pr.bonds[w.pts[0]] && pr.bonds[w.pts[0]].pts >= w.pts[1];
    if (w.mem) return !!(pr.mem && pr.mem[w.mem]);
    if (w.seen) return !!(pr.seen && pr.seen[w.seen]);
    if (w.flag) return !!G.flags[w.flag];
    return false;
  };
  G.loreCheck = function (quiet) {
    if (!G.progress.lore && G.chapter > 0) quiet = true;   // an older save: fill the journal without a fanfare
    const lore = G.progress.lore = G.progress.lore || {}, fresh = [];
    for (const l of ST.LORE) if (!lore[l.id] && G.loreOpen(l)) { lore[l.id] = 1; fresh.push(l); }
    if (fresh.length && !quiet) { G.hud.toast(fresh.length === 1 ? `\u270E New page in Wren's journal: ${fresh[0].title}` : `\u270E ${fresh.length} new pages in Wren's journal`); SH.sfx.play('select'); }
    if (fresh.length) G.save();
    return fresh.length;
  };
  G.loreNew = () => Object.values(G.progress.lore || {}).filter(v => v === 1).length;
  G.bond = function (who, pts, liked, why) {
    if (!G.progress.bonds[who]) G.progress.bonds[who] = { pts: 0 };
    const b = G.progress.bonds[who], before = G.heartsFor(b.pts);
    b.pts = Math.max(0, b.pts + pts);
    G.explain('bonds');
    const after = G.heartsFor(b.pts);
    if (after > before) {
      G.heartQueue.push(`heart_${who}_${after}`); SH.sfx.play('heart');
      const step = ((ST.BOND_PATH[who] || {}).steps || []).find(x => x.h === after);
      if (step) G.hud.toast(`\u2665 ${ST.CAST[who].name}, heart ${after}: ${step.name}. ${step.text}`);
    }
    else if (pts < 0) SH.sfx.play('back');
    // every change is shown: who, how much, and why
    G.effect({ who, pts, why: why || (pts < 0 ? 'That stung.' : liked ? 'That meant a lot.' : 'She said what she thought, and it was heard.'), heart: after > before ? after : 0 });
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
    if (G.mode) { if (G.state === 'talk' || G.state === 'play') G.progress.playFrames = (G.progress.playFrames || 0) + 1; SH.modes.step(input); return; }
    if (G.state === 'play' || G.state === 'talk') G.progress.playFrames = (G.progress.playFrames || 0) + 1;
    G.effectStep();
    if (w.victoryT) G.victoryStep();
    if (w.time % 90 === 45 && G.state === 'play' && !G.noExplain) G.loreCheck();
    if (G.state === 'play' && (G.explainWait || 0) > 0) G.explainWait--;
    if (G.state === 'talk') G.explainWait = Math.max(G.explainWait || 0, 60 * 3);   // and never the moment a conversation ends
    // a card only ever opens in a calm moment: feet on the ground, nothing chasing her, no boss, no enemy close
    if (G.explainQ && G.explainQ.length && G.state === 'play' && !(G.explainWait > 0) && !G.mode && !SH.arts.cutin && !G.pending && G.calm()) { G.explain(G.explainQ.shift()); if (G.state !== 'play') return; }
    if (G.state === 'talk') { G.talkStep(); fx.update(); G.direct(); return; }
    if (input.pressed.pause && G.state === 'play') { G.pause(); return; }
    if (G.state !== 'play') return;
    if (G.pending) { const id = G.pending; G.pending = null; G.runScript(id); return; }
    if (w.koT > 0) { G.koStep(); fx.update(); return; }
    if (fx.hitstop > 0) {
      fx.hitstop--;
      if (input.pressed.attack) p.atkBuf = SH.COMBAT.attackBuffer + 1;
      if (input.pressed.jump) p.jumpBuf = SH.tune.jumpBufferFrames + 1;
      if (input.pressed.dash) p.dashBuf = 7;
      if (input.pressed.gift) p.giftBuf = 9;
      if (input.pressed.art) SH.arts.buf = 12;
      return;
    }
    if (SH.arts.cutinStep(w)) { G.direct(); return; }
    if (fx.slowmo > 0) fx.slowmo--;
    w.time++; w.frames = (w.frames || 0) + 1;
    // whispers down the bond
    if (w.time === 540) SH.arts.whisper('room_' + w.room.def.id);
    if (w.time === 900 && SH.stars.DEFS.some(d => SH.stars.canBuy(d))) SH.arts.whisper('stars');
    if (p.hearts <= 2 && !p.dead) { if (++w.lowT === 30) SH.arts.whisper('low'); } else w.lowT = 0;
    if (G.boss && G.boss.lastPhase !== w.bossPh) { w.bossPh = G.boss.lastPhase; if (w.bossPh > 1) SH.arts.whisper('boss' + w.bossPh, true); }
    // Starlight motes
    for (const m of w.motes) {
      { const rch = SH.xp.reach() * (G.boon('iris') ? 1.8 : 1); if (m.got || Math.abs(m.x - p.x) > rch || Math.abs(m.y - (p.y - 20)) > rch + 8) continue; }
      m.got = true; SH.sfx.play('mote'); G.explain('starlight'); SH.xp.gain(1);
      fx.burst(m.x, m.y, 6, { speed: 1.6, life: 18, gravity: -0.03, colors: ['#ffd27a', '#fff6d8'], glow: true });
      G.hud.motes(w.motes.filter(x => x.got).length, w.motes.length, true);
      if (w.motes.every(x => x.got)) { SH.arts.whisper('motesAll'); SH.fx.word(p.x, p.y - 64, 'ALL STARLIGHT', '#ffd27a', 90); }
    }

    const def = w.room.def;
    const painting = G.paintStep();
    if (!painting) p.update(w);
    for (const e of w.things) e.update(w);
    // arrows fly, drop a little, stick in the ground, and bring down the stag
    for (const a of w.arrows) {
      a.life--;
      if (a.stuck) continue;
      a.vy += a.g != null ? a.g : 0.05; a.x += a.vx; a.y += a.vy;
      const tile = w.room.get(Math.floor(a.x / TS), Math.floor(a.y / TS));
      if (tile === SH.T_SOLID) { a.stuck = true; a.life = Math.min(a.life, 60); continue; }
      for (const e of w.things) {
        if (!e.hittable() || (!e.arrowOnly && !a.fae) || (a.fae && (e.kind === 'bulb' || e.kind === 'brazier' || e.kind === 'lectern'))) continue;
        const hb = e.hurtBox(), pad = a.fae ? 4 : 0;
        if (a.x > hb.l - pad && a.x < hb.r + pad && a.y > hb.t - pad && a.y < hb.b + pad) { e.takeHit({ arrow: true, fae: a.fae, dmg: 2, kb: 1.5, dir: Math.sign(a.vx) || 1 }, w); a.life = 0; if (a.fae) { fx.spark(a.x, a.y, 0, true); if (e.kind === 'spy' && !G.flags.pinned1) G.flags.pinned1 = true; } break; }
      }
    }
    w.arrows = w.arrows.filter(a => a.life > 0);
    // fireballs: burn thorn walls, light braziers, set wyrms burning
    for (const f of w.fireballs) {
      f.life--; f.x += f.vx;
      if (w.time % 2 === 0) fx.burst(f.x, f.y, 1, { speed: 0.6, life: 16, gravity: -0.04, colors: ['#ff8a3a', '#ffd27a'], glow: true });
      const tx = Math.floor(f.x / TS), ty = Math.floor(f.y / TS);
      const wall = w.thorns.find(t => t.solid && tx >= t.x && tx < t.x + t.w && ty >= t.top);
      if (wall) {
        w.room.setThorns(wall, false); if (!f.big) f.life = 0; SH.sfx.play('kill');
        fx.burst((wall.x + wall.w / 2) * TS, 13 * TS, 50, { speed: 3, life: 50, gravity: -0.05, colors: ['#ff8a3a', '#ffd27a', '#5a1d3e', '#2a1024'], glow: true });
        fx.kick(4);
        if (wall.id === 'road') G.queueScript('lib_wall');
        continue;
      }
      if (SH.isSolid(w.room.get(tx, ty))) { f.life = 0; fx.burst(f.x, f.y, 10, { speed: 2, life: 20, colors: ['#ff8a3a', '#ffd27a'], glow: true }); continue; }
      for (const e of w.things) {
        if (e.arrowOnly || !e.hittable()) continue;
        const hb = e.hurtBox();
        const pad = f.big ? 16 : 6;
        if (f.x > hb.l - pad && f.x < hb.r + pad && f.y > hb.t - (f.big ? 14 : 0) && f.y < hb.b + (f.big ? 14 : 0)) {
          if (f.big) {   // a flame wave burns through everything in its path, once each
            if (f.hit.has(e)) continue;
            f.hit.add(e);
            { const r = e.takeHit({ fire: true, dmg: SH.GIFTS.flame.waveDamage, kb: 5, dir: f.dir, finisher: true }, w); if (r && r.killed && !e.boss) SH.arts.finisher('ASHES', 'FLAME WAVE', '#ffb057'); }
            fx.burst(f.x, f.y, 22, { speed: 3.2, life: 28, colors: ['#ff8a3a', '#ffd27a', '#ffffff'], glow: true }); fx.stop(5); fx.kick(5);
            continue;
          }
          e.takeHit({ fire: true, dmg: SH.GIFTS.flame.damage, kb: 2, dir: f.dir, finisher: false }, w);
          f.life = 0; fx.burst(f.x, f.y, 14, { speed: 2.4, life: 24, colors: ['#ff8a3a', '#ffd27a', '#ffffff'], glow: true }); fx.stop(3);
          break;
        }
      }
    }
    w.fireballs = w.fireballs.filter(f => f.life > 0);
    // shockwaves from the Old Wyrm's slam: they run along the ground; jump them
    for (const s of w.waves) {
      s.t++; s.life--; s.x += s.dir * 4.4;
      if (SH.isSolid(w.room.get(Math.floor((s.x + s.dir * 8) / TS), Math.floor((s.y - 4) / TS))) || !SH.floorAhead(w.room, s.x, s.y)) s.life = 0;
      if (s.t % 2 === 0) fx.burst(s.x, s.y - 2, 1, { angle: -Math.PI / 2, spread: 1, speed: 2.2, life: 16, size: 3, colors: ['#8a96b8', '#c8d2e2', '#5a6680'] });
      if (s.life > 0 && Math.abs(p.x - s.x) < 13 && p.y > s.y - 20 && p.y < s.y + 8 && !(p.dashT > 0 && p.iframes > 0)) p.hurt(s.x - s.dir * 10, 1, w);
    }
    w.waves = w.waves.filter(s => s.life > 0);
    // falling rocks
    for (const r of w.rocks) {
      if (r.ground == null) r.ground = (w.room.groundY(Math.floor(r.x / TS), 0) || w.room.pxH);
      if (r.warn > 0) { r.warn--; continue; }
      r.vy = Math.min(r.vy + 0.5, 10); r.y += r.vy;
      if (Math.abs(r.x - p.x) < 16 && r.y > p.y - p.h && r.y - 16 < p.y) p.hurt(r.x, 1, w);
      if (r.y >= r.ground) { r.done = true; fx.burst(r.x, r.ground - 4, 8, { speed: 2, life: 18, colors: ['#5a6680', '#8a96b8'] }); }
    }
    w.rocks = w.rocks.filter(r => !r.done);
    // chapter 3: all braziers lit
    if (G.activeGoal === 'flame' && !w.fired.brz) {
      const b = w.things.filter(e => e.kind === 'brazier');
      if (b.length && b.every(e => e.lit)) { w.fired.brz = true; G.queueScript('lib_braziers'); }
    }

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
        l.lit = true; p.hearts = p.maxHearts; SH.sfx.play('lantern');
        fx.ring(l.px, l.py - 46, '#ffd27a', 50, 26, 2);
        fx.burst(l.px, l.py - 46, 16, { speed: 2, life: 30, gravity: -0.03, colors: ['#ffd27a', '#fff6d8'], glow: true });
        G.explain('lantern');
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
      if (tr.below != null && !(p.grounded && p.y > tr.below * TS)) continue;
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
      // Caelum arrives, but the level only ends when you talk to him: time to gather any Starlight you missed
      G.winnow('caelum', Math.min(def.width - 4, Math.floor(tx) + 3));
      const c = w.npcs.find(n => n.id === 'caelum'); c.optional = 'ring_done';
      G.activeGoal = 'report'; G.hud.goal(true);
      const left = w.motes.filter(m => !m.got).length;
      G.hud.toast(left ? 'Caelum is here. ' + left + ' Starlight still out there: gather it, then talk to him.' : 'Caelum is here. Talk to him when you are ready.');
    }

    // control hints and the TALK / PAINT button
    const motesLeft = w.motes.filter(m => !m.got && (G.activeGoal === 'report' || m.x < p.x)).length;   // Starlight still behind her
    const hint = (def.hints || []).find(h => tx >= h.x0 && tx < h.x1 && (!h.flag || G.flags[h.flag]) && (!h.until || !G.flags[h.until]) && (!h.motesLeft || motesLeft > 0) && (h.above == null || p.y <= h.above * TS) && (h.below == null || p.y > h.below * TS));
    const canPaint = w.muralNear && def.mural && !G.flags[def.mural.flag];
    const bossTell = G.boss && !G.boss.dead ? (G.boss.tell ? { now: G.boss.tell() } : { windup: 'It is about to CHARGE. Jump over it, or dash straight through it ({DASH}): nothing can touch you mid-dash.', charge: 'CHARGING. Jump it, or dash through it ({DASH}). If it hits the cliff it dazes itself.', crouch: 'It is going to LEAP to the shadow on the ground. Get away from the shadow.', leap: 'Move away from the shadow, then jump the shockwave.', slamrest: 'It is winded. Strike!', inhale: 'It is breathing in. Throw the Flame ({GIFT}) down its throat NOW.', breath: 'Frost along the ground. Jump onto a ledge or get behind it.', stun: 'DAZED. Strike it now: every cut does more.', roar: 'It is getting faster. The bond bar is full: use your Bond Art.' })[G.boss.tell ? 'now' : G.boss.state] : null;
    { const text = bossTell ? input.fill(bossTell) : hint ? input.fill(hint.text).replace('{LEFT}', motesLeft) : canPaint ? input.fill('Use {PAINT} at the wall to paint it.') : null;
      if (bossTell) { w.hintNow = text; w.hintHold = 0; G.hud.prompt(text); }
      else if (text !== w.hintNow && (w.hintHold || 0) > 0 && w.hintNow) w.hintHold--;          // the hint on screen gets its time
      else { if (text !== w.hintNow) { w.hintNow = text; w.hintHold = text ? 60 * 5 : 60; } G.hud.prompt(text); } }
    const usable = w.things.find(e => e.usable && e.near);
    G.hud.talkButton(talkable ? 'TALK' : canPaint ? 'PAINT' : usable ? usable.label : null);

    for (const g of w.gates) if (!g.closed && (g.lift || 0) < 1) g.lift = (g.lift || 0) + 0.03;
    w.cityLight += (w.cityLightTarget - w.cityLight) * 0.03;
    G.hud.hearts(p.hearts, p.maxHearts);
    if (G.can('flame')) G.hud.pips(p.pips, SH.stars.maxPips());
    SH.arts.update(w); G.hud.art(SH.arts);
    G.hud.boss(G.boss);
    G.cameraTarget();
    w.cam.x += (w.camT.x - w.cam.x) * 0.14;
    w.cam.y += (w.camT.y - w.cam.y) * 0.10;
    G.direct();
    fx.update();
    if (w.fade > 0) w.fade = Math.max(0, w.fade - 0.08);
  };

  // Painting the mural: stand at the wall and hold TALK.
  G.paintStep = function () {
    const w = G.world, p = w.player, m = w.room.def.mural;
    if (!m) return false;
    const cx = (m.x + m.w / 2) * TS;
    w.muralNear = Math.abs(p.x - cx) < m.w * TS / 2 + 10 && p.grounded && !!G.flags[m.needs] && !G.flags[m.flag];
    if (G.flags[m.flag]) return false;
    if (!w.muralDone && (!w.muralNear || !(input.held.up || input.pressed.up))) return false;
    p.vx = 0; p.swing = null;
    // face to the wall: the mural is traced in its own view, and the street wakes when it is done
    if (!w.muralDone) { SH.modes.start('mural', {}, () => { w.muralDone = true; w.muralProgress = 1; }); return true; }
    w.muralProgress = 1;
    if (w.time % 6 === 0) SH.sfx.play('paint');
    if (w.time % 4 === 0) fx.burst(m.x * TS + m.w * TS * w.muralProgress, 16 * TS - 40 - Math.random() * 60, 2, { speed: 1, life: 20, colors: ['#ffd27a', '#ff9a7a', '#8a6aff', '#4ad8c8'], glow: true });
    if (w.muralProgress >= 1) {
      G.flags[m.flag] = true;
      G.flags.mural = true;
      w.cityLightTarget = 1;
      SH.sfx.play('mural');
      fx.ring(cx, 16 * TS - 54, '#ffd27a', 90, 40, 3);
      fx.burst(cx, 16 * TS - 54, 40, { speed: 3, life: 50, gravity: -0.02, colors: ['#ffd27a', '#fff6d8', '#ff9a7a', '#8a6aff'], glow: true });
      G.hud.toast('The first mural is finished. The street wakes up.');
      G.queueScript(m.script);
    }
    return true;
  };

  // Skip a scene: run it to its end (or to the next choice), still applying everything it does.
  G.skipScene = function () {
    let n = 0;
    while (G.script && !G.choosing && !G.mode && G.state === 'talk' && n++ < 400) { G.hud.finishTyping(); G.talkWait = 0; G.advance(); }
  };
  G.talkStep = function () {
    if (input.pressed.pause && !G.choosing) { G.skipScene(); return; }
    if (G.talkWait > 0) { G.talkWait--; return; }
    if (G.hud.typing()) { if (input.pressed.jump || input.pressed.attack || input.pressed.up || input.pressed.dash) G.hud.finishTyping(); return; }
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
    if (SH.arts.scene || SH.arts.cutin) return;
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

  // The Old Wyrm is down. Hold the moment: its light pours into Wren, her hearts fill, the hollow goes quiet. Then the story moves.
  G.victoryStep = function () {
    const w = G.world, p = w.player, t = w.victoryT++, at = w.victoryAt || p;
    p.invuln = 30;
    if (t === 40) { SH.sfx.play('chime'); G.look(at.x, at.y, 1.25, 150); }
    if (t > 40 && t < 200 && t % 3 === 0) {   // starlight leaves the beast and finds her
      const a = Math.random() * 6.28, r = 20 + Math.random() * 50, sx = at.x + Math.cos(a) * r, sy = at.y + Math.sin(a) * r * 0.5, k = 26;
      fx.parts.push({ x: sx, y: sy, vx: (p.x - sx) / k, vy: (p.y - 26 - sy) / k, g: 0, drag: 1, life: k, max: k, size: 3, color: t % 2 ? '#ffd27a' : '#fff6d8', glow: true, shape: 'sq' });
    }
    if (t > 60 && t < 200 && t % 28 === 0) { fx.ring(p.x, p.y - 24, '#ffd27a', 30 + (t % 3) * 8, 22, 2); if (p.hearts < p.maxHearts) { p.hearts++; SH.sfx.play('heart'); } }
    if (t === 120) { fx.word(p.x, p.y - 70, w.victoryWords || 'THE HOLLOW IS QUIET', '#fff6d8', 150); SH.arts.whisper('bossWon', true); }
    if (t === 215) SH.xp.gain(40, true);
    if (t === 210) { SH.sfx.play('lantern'); fx.burst(p.x, p.y - 24, 40, { speed: 3.4, life: 50, gravity: -0.03, colors: ['#ffd27a', '#fff6d8', '#b9a8ff'], glow: true }); G.look(p.x, p.y - 30, 1.4, 90); }
    if (t > 270) w.fade = Math.min(1, (t - 270) / 40);
    if (t >= 315) { w.victoryT = 0; G.queueScript(w.victoryScript || 'mtn_peak'); }
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
      for (const e of w.things) if (e.reset && !(e.kind === 'wyrm' && e.dead && !e.boss)) e.reset();
      w.rocks = []; w.fireballs = []; w.waves = [];
      if (G.boss) G.boss.wake();
      if (w.wyrm && w.wyrm.on) w.wyrm.x = p.x - 13 * TS;
      G.snapCamera();
      G.hud.toast('Knocked out. Back at the last lantern, no harm done.');
    }
    if (w.koT >= 46) w.fade = Math.max(0, 1 - (w.koT - 46) / 25);
    if (w.koT > 72) { w.koT = 0; w.fade = 0; }
  };

  G.pause = function () { if (G.state !== 'play') return; G.state = 'pause'; input.clear(); G.hud.navReset(); G.hud.menu(true); G.hud.nav('menu', 0); };
  G.resume = function () { G.state = 'play'; input.clear(); G.hud.menu(false); G.hud.tune(false); G.hud.journal(false); G.hud.stars(false); };

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
    if (G.mode) return SH.modes.draw(G.ctx, w.viewW);
    SH.draw.frame(G.ctx, w);
  };

  // Menus can be driven by keyboard and gamepad as well as taps.
  G.menuInput = function () {
    const go = () => input.take('jump') || input.take('attack');
    if (G.state === 'front') SH.front.menuInput(input);
    else if (G.state === 'card') { if (go()) G.hud.cardGo(); }
    else if (G.state === 'explain') { if (go()) G.explainClose(); }
    else if (G.state === 'pause' || G.state === 'end') {
      const id = G.state === 'end' ? 'end' : ['journal', 'tune', 'stars'].find(x => document.getElementById(x).classList.contains('show')) || 'menu';
      if (input.take('up')) G.hud.nav(id, -1);
      else if (input.take('down')) G.hud.nav(id, 1);
      else if (input.take('jump') || input.take('attack')) G.hud.nav(id, 0, true);
      else if (G.state === 'pause' && (input.take('pause') || input.take('dash'))) { SH.sfx.play('back'); G.resume(); }
    }
  };

  // ---------------------------------------------------------------- screen size
  G.fit = function () {
    const W = window.innerWidth, H = window.innerHeight;
    const viewW = Math.max(420, Math.min(720, Math.round(SH.VIEW_H * W / H)));
    const scale = Math.min(W / viewW, H / SH.VIEW_H);
    const cv = G.canvas;
    // Held upright, the picture sits at the top and everything you touch or read sits below it.
    const upright = H > W * 1.15;
    document.body.classList.toggle('upright', upright);
    document.documentElement.style.setProperty('--cvh', Math.floor(SH.VIEW_H * scale) + 'px');
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
      G.frozen = true; input.forced = { held: {}, pressed: {} }; SH.modes.auto = !opts.modes; G.noExplain = !opts.explain; G.explaining = null; G.explainQ = []; G.explainWait = 0; G.mode = null; SH.modes.cur = null; delete document.body.dataset.mode;
      document.getElementById('front').classList.remove('show'); G.slot = null;
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
