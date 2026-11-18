// ============================================================
// systems/brawl — the fights. Pseudo-3D arena brawler.
// The ground is a perspective plane (drawn a scanline at a time), fighters are big billboards,
// and the camera dollies, cranes and punches in with the action.
// Controls: move · A strike (3-hit chain) · B dodge (invulnerable; dodge THROUGH a swing for an OPENING)
//           FURY fills as Kael hits and is hit. When full, hold A: ELEVEN — an eleven-hit rush.
// Logic lives on a flat plane: x = left/right, y = depth (larger y is nearer the camera).
// def: { title, sub, bg, arena, foes | waves, allies, hero, taunt, intro/outro (cine shots), legend, doomed, endAt, rage, skip }
// ============================================================
const FOE_KINDS = {
  jab: { spd: 36, wind: 0.6, reach: 26, dmg: 1, rec: 0.9, cd: [0.7, 1.5], soft: 1 },
  quick: { spd: 54, wind: 0.42, reach: 24, dmg: 1, rec: 0.65, cd: [0.5, 1.2] },
  heavy: { spd: 28, wind: 0.85, reach: 38, dmg: 2, rec: 1.2, cd: [0.8, 1.4], armor: 1, wide: 16 },
  baton: { spd: 40, wind: 0.6, reach: 30, dmg: 1, rec: 0.95, cd: [0.6, 1.2], sweep: 1, charge: 1 },
  boss: { spd: 46, wind: 0.46, reach: 28, dmg: 1, rec: 0.85, cd: [0.45, 1.0], double: 1 },
  cadet: { spd: 42, wind: 0.55, reach: 32, dmg: 1, rec: 0.85, cd: [0.8, 1.8], sweep: 1, blade: 1 },
  lancer: { spd: 34, wind: 0.7, reach: 50, dmg: 1, rec: 1.0, cd: [1.0, 2.0], blade: 2, wide: 10 },
  captain: { spd: 40, wind: 0.6, reach: 40, dmg: 2, rec: 0.9, cd: [0.6, 1.2], sweep: 1, charge: 1, double: 1, blade: 1 },
  duelist: { spd: 58, wind: 0.44, reach: 36, dmg: 1, rec: 0.7, cd: [0.4, 0.9], sweep: 1, charge: 1, double: 1, blink: 1, blade: 1 },
  warden: { spd: 30, wind: 0.7, reach: 46, dmg: 2, rec: 1.0, cd: [0.9, 1.6], blade: 2, wide: 12 }
};
const ELEVEN = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN'];
const Brawl = {
  active: false, K: 2.4, def: null, onEnd: null, t: 0, p: null, foes: [], allies: [], props: [], parts: [], rings: [], freeze: 0, slow: 0, shake: 0, punch: 0, impact: 0,
  phase: 'intro', pt: 0, msg: '', msgT: 0, cam: { x: 0, y: 170, h: 62, f: 150, hor: 58 }, tex: {}, pat: {}, cine: null, sup: null, wave: 0,

  // ---------------------------------------------------------- setup
  start(def, onEnd) {
    const hero = def.hero || {}, A = def.arena || { kind: 'ring', rx: 118, ry: 64 };
    Object.assign(this, { def, onEnd, active: true, t: 0, parts: [], rings: [], freeze: 0, slow: 0, shake: 0, punch: 0, impact: 0, phase: 'intro', pt: 0, msg: '', msgT: 0, token: [], sup: null, wave: 0, arena: A, cine: null, tipT: 5, hitsN: 0, hitsT: 0, clang: 0, slashes: [], fin: null, vq: [], vcur: null, vdone: {}, ft: 0, art: null, artDone: {}, lines: [], tex: {}, pat: {} });
    const hw = A.kind === 'ring' ? A.rx : A.w / 2;
    this.p = { x: -hw * .5, y: 4, fx: 1, fy: 0, hp: hero.hp || 6, max: hero.hp || 6, pow: hero.pow || 1, blade: hero.blade || 0, sheet: hero.id ? World.sheetFor(hero.id) : P.sheet, st: 'idle', t: 0, combo: 0, comboT: 0, inv: 0, dcd: 0, open: 0, anim: 0, hit: false, kx: 0, ky: 0, hold: 0, trail: [],
      fury: hero.fury0 !== undefined ? hero.fury0 : Math.min(60, ((G.flags || {}).fury | 0) * 7), rage: def.rage || 0 };
    this.pb = hero.id ? World.bustFor(hero.id) : makeBust(Object.assign(playerLook(), { mouth: 'frown' }));
    this.foes = []; this.spawn(def.waves ? def.waves[0] : def.foes, true); this.tap = false;
    this.allies = (def.allies || []).map((a, i) => ({ id: a, x: -hw * .5 - 14 + (i % 2) * 30, y: -24 + i * 22, fx: 1, fy: 0, st: 'approach', t: 0, cd: .6 + i * .4, anim: 0, kx: 0, ky: 0, sheet: World.sheetFor(a), ally: 1, flash: 0 }));
    this.buildProps(def.bg || 'ring', A); this.cam = { x: 0, y: 190, h: 62, f: 150, hor: Math.round(H * .32) };
    Sound.music(def.music || (def.bg && def.bg !== 'ring' ? 'battle' : 'work')); Input.consume(); HUD.dirty = true; Fade.a = 0; Fade.dir = 0; Fade.busy = false;
    if (def.intro) this.playCine(def.intro, () => { if (def.cineOnly) return this.end(true); this.phase = 'intro'; this.pt = 0; });
  },
  spawn(list, first) {
    const A = this.arena, hw = A.kind === 'ring' ? A.rx : A.w / 2, hh = A.kind === 'ring' ? A.ry : A.h / 2, n = list.length, base = this.foes.length;
    list.forEach((f, i) => { const K = FOE_KINDS[f.kind];
      this.foes.push(Object.assign({ x: first && A.kind === 'ring' ? hw * .5 : (i - (n - 1) / 2) * Math.min(48, (hw * 1.6) / n), y: first && A.kind === 'ring' ? (i - (n - 1) / 2) * 30 : -hh + 6 - (first ? 0 : 40) - (i % 2) * 14,
        fx: -1, fy: 0, max: f.hp, st: 'approach', t: 0, cd: 1 + i * .7, anim: 0, kx: 0, ky: 0, sheet: World.sheetFor(f.id), K, said: 0, flash: 0, sc: f.sc || 1, idx: base + i, enter: !first }, f)); });
  },
  buildProps(bg, A) {
    const pr = [], hw = A.kind === 'ring' ? A.rx : A.w / 2, hh = A.kind === 'ring' ? A.ry : A.h / 2;
    if (bg === 'ring') { const ids = ['bao', 'pell', 'juno', 'marrow', 'fen', 'orin', 'kit', 'hollis', 'tavi', 'c2', 'c3', 'c4', 'nell', 'c1'];
      for (let i = 0; i < 15; i++) { const a = Math.PI + (i + .5) / 15 * Math.PI; pr.push({ t: 'crowd', x: Math.cos(a) * (hw + 16), y: Math.sin(a) * (hh + 12), s: World.sheetFor(ids[i % ids.length]), k: i }); }
      for (let i = 0; i < 5; i++) pr.push({ t: 'lamp', x: -hw - 10 + i * (hw * 2 + 20) / 4, y: -hh - 26, k: i });
    } else if (bg === 'furnace') {
      for (let i = 0; i < 6; i++) pr.push({ t: 'lamp', x: -hw - 10 + i * (hw * 2 + 20) / 5, y: -hh - 20, k: i });
      for (let i = 0; i < 4; i++) pr.push({ t: 'rock', x: (i - 1.5) * 60, y: -hh - 10, k: i });
    } else {
      const r = rng(bg.length * 7 + 3);
      for (let i = 0; i < 16; i++) pr.push({ t: bg === 'keep' ? 'merlon' : 'tree', x: -hw - 80 + i * (hw * 2 + 160) / 15 + (r() - .5) * 14, y: -hh - 24 - r() * (bg === 'keep' ? 2 : 50), k: i, h: 60 + r() * 30 });
      if (bg !== 'keep') for (let i = 0; i < 6; i++) { pr.push({ t: 'tree', x: -hw - 34 - r() * 50, y: -hh + i * 34, k: i + 20, h: 64 + r() * 26 }); pr.push({ t: 'tree', x: hw + 34 + r() * 50, y: -hh + i * 34, k: i + 40, h: 64 + r() * 26 }); }
      if (bg !== 'keep') for (let i = 0; i < 9; i++) pr.push({ t: 'melee', x: -hw - 40 + i * (hw * 2 + 80) / 8 + (r() - .5) * 16, y: -hh - 34 - r() * 70, k: i, a: World.sheetFor(i % 2 ? 'cadv1' : 'cadv2'), b: World.sheetFor(i % 2 ? 'cadt2' : 'cadt1') });
      if (bg !== 'keep') { for (let i = 0; i < 4; i++) pr.push({ t: 'tent', x: (i < 2 ? -1 : 1) * (hw + 30 + (i % 2) * 44), y: -hh - 6 - (i % 2) * 26, c: i < 2 ? '#7a5ac8' : '#2aa6a0', k: i });
        for (let i = 0; i < 30; i++) pr.push({ t: 'grass', x: (r() - .5) * (hw * 2 + 150), y: r() < .5 ? -hh - 4 - r() * 26 : hh + 6 + r() * 30, k: i, reed: bg === 'ford' && r() < .5 });
        for (let i = 0; i < 10; i++) pr.push({ t: 'grass', x: (r() < .5 ? -1 : 1) * (hw + 8 + r() * 40), y: (r() - .5) * hh * 2, k: i + 60 }); }
      else for (let i = 0; i < 4; i++) pr.push({ t: 'brazier', x: (i % 2 ? 1 : -1) * (hw + 14), y: i < 2 ? -hh + 10 : hh - 10, k: i });
      pr.push({ t: 'banner', x: -hw + 20, y: -hh + 6, c: '#7a5ac8', k: 1 }, { t: 'banner', x: hw - 20, y: -hh + 6, c: '#2aa6a0', k: 2 });
      for (let i = 0; i < 5; i++) pr.push({ t: 'rock', x: (r() - .5) * hw * 2.2, y: -hh - 8 - r() * 20, k: i });
    }
    this.props = pr;
  },
  end(win) { this.active = false; if (Cutscene.active) { Fade.a = 1; Fade.dir = 0; Fade.busy = false; } else if (MAPS[G.mapId]) Sound.music(MAPS[G.mapId].music); Input.consume(); HUD.dirty = true; const cb = this.onEnd; this.onEnd = null; cb && cb(win); },
  // Kael narrates. Lines come on a clock and on events, and never stop the fight.
  voice(key) { const v = this.def.voice; if (!v || !v[key] || this.vdone[key]) return; this.vdone[key] = 1; this.vq.push(v[key]); },
  updVoice(dt) { const v = this.def.voice; if (!v) return; this.ft += dt; (v.at || []).forEach(([at, t], i) => { if (this.ft >= at && !this.vdone['t' + i]) { this.vdone['t' + i] = 1; this.vq.push(t); } });
    if (this.vcur) { this.vcur.life -= dt; if (this.vcur.life <= 0) this.vcur = null; } if (!this.vcur && this.vq.length) { const t = this.vq.shift(); this.vcur = { t, life: 2.2 + t.length * .045, max: 2.2 + t.length * .045 }; } },
  say(t, big) { this.msg = t; this.msgT = big ? 1.6 : 1.1; },
  clampA(o) { const A = this.arena; if (A.kind === 'ring') { const dx = o.x / (A.rx - 6), dy = o.y / (A.ry - 4), d = Math.hypot(dx, dy); if (d > 1) { o.x = dx / d * (A.rx - 6); o.y = dy / d * (A.ry - 4); } } else { o.x = clamp(o.x, -A.w / 2, A.w / 2); o.y = clamp(o.y, -A.h / 2, A.h / 2); } },
  spark(x, y, c, n, h) { for (let i = 0; i < (n || 6); i++) { const a = Math.random() * 6.28, v = 30 + Math.random() * 80; this.parts.push({ x, y, h: h === undefined ? 22 : h, vx: Math.cos(a) * v, vy: Math.sin(a) * v * .5, vh: 30 + Math.random() * 70, life: .3 + Math.random() * .25, c }); } },
  ring(x, y, c, r) { this.rings.push({ x, y, c, r: 4, max: r || 46, life: 1 }); },
  nearest(o, list) { let b = null, bd = 1e9; for (const f of list || this.foes) if (f.st !== 'down' && !f.enter) { const d = Math.hypot(f.x - o.x, f.y - o.y); if (d < bd) { bd = d; b = f; } } return b; },
  gain(v) { const p = this.p, was = p.fury; p.fury = Math.min(100, p.fury + v); if (was < 100 && p.fury >= 100) { this.voice('fury'); this.say('FURY', true); Sound.play('roar'); this.ring(p.x, p.y, '#ff7a30', 60); } },

  // ---------------------------------------------------------- hits
  hurtPlayer(f, dmg, ax, ay) {
    const p = this.p;
    if (p.inv > 0 || this.sup) { if (p.st === 'dodge' && p.open <= 0.9) { p.open = 1.6; this.slow = 0.5; this.say('OPENING!'); Sound.play('stage'); this.gain(22); } return; }
    this.voice('hurt'); p.hp -= dmg; p.st = 'hurt'; p.t = 0; p.inv = 0.8; p.kx = ax * 160; p.ky = ay * 160; p.combo = 0; this.freeze = 0.1; this.shake = 0.35; this.impact = .12; Sound.play('hit'); this.spark(p.x, p.y, '#ff5a4a', 9); this.gain(16);
    if (p.hp <= 0) { if (this.def.legend) { p.hp = p.max; p.fury = 100; p.inv = 1.6; this.say('NOT TODAY.', true); this.ring(p.x, p.y, '#ffe08a', 90); Sound.play('roar'); for (const o of this.foes) if (o.st !== 'down') { const d = Math.hypot(o.x - p.x, o.y - p.y) || 1; if (d < 90) { o.kx = (o.x - p.x) / d * 260; o.ky = (o.y - p.y) / d * 260; o.st = 'hurt'; o.t = 0; } } } else { p.st = 'down'; this.phase = 'lose'; this.pt = 0; } }
  },
  hitFoe(f, dmg, ax, ay, big) {
    const crit = this.p.open > 0 || !!this.sup || !!this.art;
    if (this.def.doomed) { f.flash = 0.08; Sound.play('deny'); this.spark(f.x, f.y, '#c8ccd4', 5); this.p.kx = -ax * 150; this.p.ky = -ay * 150; this.clang++; f.bark = { t: ['CLANG', '...', 'CLANG'][this.clang % 3], life: .5 }; this.gain(10); return; }
    if (f.guardT > 0 && !crit) { f.flash = 0.06; Sound.play('deny'); this.spark(f.x, f.y, '#8a94a4', 4); this.p.kx = -ax * 120; this.p.ky = -ay * 120; if (!f.blk) { f.blk = 1; f.bark = { t: 'BLOCKED', life: .7 }; } return; }
    f.hp -= dmg; f.flash = 0.14; f.kx = ax * (big ? 230 : 95); f.ky = ay * (big ? 230 : 95); this.freeze = big ? 0.11 : 0.05; this.shake = big ? 0.32 : 0.12; if (big) { this.impact = .14; this.punch = .22; this.ring(f.x, f.y, '#fff2c0', 40); f.vz = 150; }
    this.slashes.push({ x: f.x, y: f.y, a: Math.random() * 3.14, life: .16, big });
    Sound.play(big ? 'hit' : 'clink'); this.spark(f.x, f.y, this.p.blade ? '#ffe08a' : big ? '#ffe08a' : '#fff', big ? 12 : 6); this.gain(this.sup || this.art ? 0 : 5); this.hitsN = this.hitsT > 0 ? this.hitsN + 1 : 1; this.hitsT = 1.4;
    if (this.foes.reduce((a, o) => a + Math.max(0, o.hp), 0) < this.foes.reduce((a, o) => a + o.max, 0) * .5) this.voice('half');
    const endAt = this.def.endAt && f.hp <= f.max * this.def.endAt;
    if (f.hp <= 0 || endAt) { f.st = 'down'; f.t = 0; f.kx = ax * 260; f.ky = ay * 260; f.vz = 190; this.token = this.token.filter(o => o !== f); Sound.play('rumble'); this.ring(f.x, f.y, '#fff', 60);
      if (!this.foes.some(o => o.st !== 'down')) { if (this.def.waves && this.wave < this.def.waves.length - 1) { this.wave++; this.spawn(this.def.waves[this.wave]); this.say('MORE OF THEM', true); this.voice('wave'); if (this.def.onWave) this.def.onWave(this.wave, this); } else { this.phase = 'win'; this.pt = 0; this.slow = 0.9; this.punch = .5; this.sup = null; } }
      return; }
    if ((f.st !== 'wind' || f.K.soft || big) && f.st !== 'charge') { this.token = this.token.filter(o => o !== f); f.st = 'hurt'; f.t = 0; }
    f.hits = (f.hits | 0) + 1; if (f.hits >= (f.K.soft ? 5 : 3) && !crit) { f.guardT = 1.1; f.cd = 0; f.hits = 0; f.blk = 0; }
    const tl = this.def.taunt && this.def.taunt[f.idx]; if (tl && f.said < tl.length && f.hp <= f.max * (1 - (f.said + 1) / (tl.length + 1))) f.bark = { t: tl[f.said++], life: 2.2 };
  },

  // ---------------------------------------------------------- update
  update(dt) {
    this.t += dt; if (this.fin) { this.fin.t += dt; if (this.fin.t > 1.1) this.fin = null; } this.msgT = Math.max(0, this.msgT - dt); this.shake = Math.max(0, this.shake - dt); this.punch = Math.max(0, this.punch - dt); this.impact = Math.max(0, this.impact - dt); this.hitsT -= dt; this.tipT -= dt;
    if (this.cine) return this.updCine(dt);
    if (Input.p('START')) { this.pauseMenu(); return; }
    if (this.phase === 'intro') { this.pt += dt; this.camFollow(dt); if (this.pt > 1.5 || (this.pt > .5 && Input.p('A'))) { this.phase = 'fight'; this.say('FIGHT!', true); Sound.play('bell'); Input.consume(); } return; }
    if (this.phase === 'win' || this.phase === 'lose') { this.pt += dt; this.stepParts(dt * .5); this.camFollow(dt * .5); for (const f of this.foes) { f.t += dt * .5; f.x += f.kx * dt * .4; f.y += f.ky * dt * .4; f.kx *= .9; f.ky *= .9; } if (this.pt > 2.1) { if (this.phase === 'win' && this.def.outro) this.playCine(this.def.outro, () => this.end(true)); else this.end(this.phase === 'win'); } return; }
    if (this.def.doomed && this.t > this.def.doomed + 1.6) { const p = this.p; p.st = 'down'; p.t = 0; this.impact = .3; this.shake = .8; Sound.play('hit'); this.phase = 'lose'; this.pt = 0.9; return; }
    this.updVoice(dt); if (this.p.fury >= 100 && this.phase === 'fight') { this.hbT = (this.hbT || 0) - dt; if (this.hbT <= 0) { Sound.play('heart'); this.hbT = .62; if (!Settings.d.reduce) this.spark(this.p.x, this.p.y, '#ff7a30', 3, 2); } }
    if (this.freeze > 0) { this.freeze -= dt; return; }
    if (this.art) { this.updArt(dt); this.stepParts(dt); this.camFollow(dt); return; }
    if (this.sup) { this.updSuper(dt); this.stepParts(dt); this.camFollow(dt); return; }
    if (this.def.arts && this.phase === 'fight' && this.p.st !== 'down') { const tot = this.foes.reduce((a, o) => a + Math.max(0, o.hp), 0) / Math.max(1, this.foes.reduce((a, o) => a + o.max, 0)), live = this.foes.some(f => f.st !== 'down' && !f.enter);
      this.def.arts.forEach((a, i) => { if (!this.art && !this.artDone[i] && live && (a.on === 'wave' ? this.wave >= 1 : a.on === 'start' ? this.ft > (a.after || 4) : tot <= a.at)) { this.artDone[i] = 1; this.startArt(a); } }); if (this.art) return; }
    const ts = this.slow > 0 ? 0.3 : 1; this.slow = Math.max(0, this.slow - dt); const pd = dt * (this.slow > 0 ? 0.75 : 1), ed = dt * ts;
    this.updPlayer(pd); if (this.sup) return; for (const f of this.foes) this.updFoe(f, ed); for (const a of this.allies) this.updAlly(a, ed); this.stepParts(dt); this.camFollow(dt);
  },
  stepParts(dt) { for (const q of this.parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.h += q.vh * dt; q.vh -= 260 * dt; if (q.h < 0) { q.h = 0; q.vh *= -.3; } q.life -= dt; } this.parts = this.parts.filter(q => q.life > 0); for (const r of this.rings) { r.r += (r.max - r.r) * Math.min(1, dt * 9); r.life -= dt * 2.4; } this.rings = this.rings.filter(r => r.life > 0); for (const q of this.slashes) q.life -= dt; this.slashes = this.slashes.filter(q => q.life > 0); },
  camFollow(dt) {
    if (this.phase === 'win') { const p = this.p, c = this.cam, k = Math.min(1, dt * 5); c.x += (p.x - c.x) * k; c.y += (p.y + 92 - c.y) * k; c.h += (52 - c.h) * k; c.f += (190 - c.f) * k; return; }
    if (this.art && this.art.t > 1.9) { const p = this.p, c = this.cam, f = this.art.tg, rise = this.art.a.kind === 'rise', k = Math.min(1, dt * 7); c.x += ((p.x + f.x) / 2 - c.x) * k; c.y += (Math.max(p.y, f.y) + (rise ? 96 : 118) - c.y) * k; c.h += ((rise ? 30 : 50) - c.h) * k; c.f += (170 * (1 + this.punch * .8) - c.f) * Math.min(1, dt * 12); c.hor += (Math.round(H * (rise && !this.art.done ? .56 : .32)) - c.hor) * k; return; }
    const p = this.p, c = this.cam, tg = this.sup && this.sup.tg || this.nearest(p) || p, sp = Math.hypot(tg.x - p.x, tg.y - p.y), A = this.arena, hw = A.kind === 'ring' ? A.rx : A.w / 2;
    const wx = clamp((p.x * 1.3 + tg.x * .7) / 2, -hw * .75, hw * .75), wy = Math.max(p.y, tg.y) + clamp(112 + sp * .5, 122, 205), k = Math.min(1, dt * 4.5);
    c.x += (wx - c.x) * k; c.y += (wy - c.y) * k; c.h += ((this.sup ? 46 : 62) - c.h) * k; c.f += (150 * (1 + this.punch * .9) - c.f) * Math.min(1, dt * 12); c.hor += (Math.round(H * .32) - c.hor) * k;
  },
  updPlayer(dt) {
    const p = this.p; p.inv = Math.max(0, p.inv - dt); p.dcd = Math.max(0, p.dcd - dt); p.open = Math.max(0, p.open - dt); p.comboT -= dt; if (p.comboT <= 0) p.combo = 0;
    p.x += p.kx * dt; p.y += p.ky * dt; p.kx *= Math.pow(.001, dt); p.ky *= Math.pow(.001, dt);
    let vx = (Input.h('right') ? 1 : 0) - (Input.h('left') ? 1 : 0), vy = (Input.h('down') ? 1 : 0) - (Input.h('up') ? 1 : 0); if (vx && vy) { vx *= .7071; vy *= .7071; }
    // fury: hold A (or press Y / L) when the gauge is full
    if (p.fury >= 100 && p.st !== 'hurt' && p.st !== 'down') { if (Input.h('A')) p.hold += dt; else p.hold = 0; if (p.hold > 0.42 || Input.p('Y') || Input.p('L')) { this.startSuper(); return; } } else p.hold = 0;
    if (p.st === 'hurt') { p.t += dt; if (p.t > 0.28) p.st = 'idle'; }
    else if (p.st === 'dodge') { p.t += dt; p.x += p.dx * 215 * dt; p.y += p.dy * 215 * dt; if (Math.floor(p.t * 40) % 2 === 0) p.trail.push({ x: p.x, y: p.y, life: .22 }); if (p.t > 0.3) p.st = 'idle'; }
    else if (p.st === 'atk') {
      p.t += dt; const dur = p.combo === 3 ? 0.36 : 0.24; if (p.t < 0.1) { p.x += p.ax * 100 * dt; p.y += p.ay * 100 * dt; }
      if (!p.hit && p.t >= 0.07) { p.hit = true; const big = p.combo === 3, R = (big ? 36 : 30) + (p.blade ? 8 : 0); let any = false;
        for (const f of this.foes) if (f.st !== 'down') { const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy); if (d < R && (d < 10 || (dx * p.ax + dy * p.ay) / d > (p.blade ? -0.1 : 0.2))) { any = true; this.hitFoe(f, ((big ? 2 : 1) + (p.open > 0 ? 1 : 0) + (p.fury >= 100 ? 1 : 0)) * p.pow, dx / (d || 1), dy / (d || 1), big || p.open > 0); } }
        if (!any) Sound.play('move'); }
      if (p.t > dur) p.st = 'idle'; else if (p.t > 0.14 && Input.p('A') && p.combo < 3) this.strike();
      if (Input.p('B') && p.dcd <= 0 && p.t > 0.1) this.dodge(vx, vy);
    } else {
      if (vx || vy) { p.x += vx * 88 * dt; p.y += vy * 88 * dt; p.anim += dt; p.fx = vx; p.fy = vy; p.st = 'move'; } else { p.st = 'idle'; p.anim = 0; const f = this.nearest(p); if (f) { const d = Math.hypot(f.x - p.x, f.y - p.y) || 1; p.fx = (f.x - p.x) / d; p.fy = (f.y - p.y) / d; } }
      if (Input.p('A')) this.strike(); else if (Input.p('B') && p.dcd <= 0) this.dodge(vx, vy);
    }
    for (const q of p.trail) q.life -= dt; p.trail = p.trail.filter(q => q.life > 0);
    this.clampA(p);
  },
  strike() { const p = this.p, f = this.nearest(p); let ax = p.fx, ay = p.fy; const m = Math.hypot(ax, ay) || 1; ax /= m; ay /= m;
    if (f) { const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy); if (d < 70) { ax = dx / (d || 1); ay = dy / (d || 1); } }
    p.fx = ax; p.fy = ay; p.st = 'atk'; p.t = 0; p.hit = false; p.ax = ax; p.ay = ay; p.combo = p.combo % 3 + 1; p.comboT = 0.7; },
  dodge(vx, vy) { const p = this.p; if (!vx && !vy) { vx = -p.fx; vy = -p.fy; } const d = Math.hypot(vx, vy) || 1; p.st = 'dodge'; p.t = 0; p.dx = vx / d; p.dy = vy / d; p.inv = Math.max(p.inv, 0.26); p.dcd = 0.55; Sound.play('step'); this.spark(p.x, p.y, '#8a7a6a', 3, 0); },
  // MEMORY ARTS: the big attacks carry the story. A memory cuts in, says its line, and becomes a strike.
  startArt(a) { const p = this.p, live = this.foes.filter(f => f.st !== 'down' && !f.enter); this.art = { a, t: 0, tg: live.sort((x, y) => y.hp - x.hp)[0], n: 0, done: 0 }; this.token = []; this.slow = 0; this.vcur = null; for (const f of this.foes) if (f.st === 'wind' || f.st === 'charge') { f.st = 'approach'; f.cd = 1.2; } p.st = 'idle'; p.hold = 0; this.impact = .2; Sound.play('choir'); Sound.play('stage'); },
  updArt(dt) {
    const A = this.art, a = A.a, p = this.p, f = A.tg, C = 1.9; A.t += dt; p.inv = .6; if (p.st === 'atk') { p.t += dt; if (p.t > .3) p.st = 'idle'; }
    if (A.t < C) { if (A.t > .5 && (Input.p('A') || Input.p('B'))) A.t = C; return; }
    const tau = A.t - C, cut = (side, big) => { const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy) || 1; p.fx = p.ax = dx / d; p.fy = p.ay = dy / d; p.st = 'atk'; p.t = 0; p.hit = true; p.combo = 1 + A.n % 3; this.slashes.push({ x: f.x, y: f.y, a: A.n * 1.1, life: .18, big: 1, h: 26 + (f.z || 0) }); this.spark(f.x, f.y, '#ffe08a', 7, 22 + (f.z || 0)); f.flash = .12; this.hitsN = this.hitsT > 0 ? this.hitsN + 1 : 1; this.hitsT = 1.6; this.shake = .2; Sound.play(big ? 'hit' : 'clink'); A.n++; };
    const land = () => { A.done = 1; f.z = 0; p.z = 0; this.impact = .3; this.shake = .9; this.punch = .6; this.ring(f.x, f.y, '#fff2c0', 120); this.ring(f.x, f.y, a.hex || '#ffb040', 80); this.fin = { x: f.x, y: f.y, t: 0 }; Sound.play('roar'); Sound.play('rumble'); this.freeze = .3;
      const live = this.foes.filter(o => o.st !== 'down' && !o.enter); for (const o of live) { if (!this.art) break; const main = o === f, d = Math.hypot(o.x - f.x, o.y - f.y); if (main || d < 90) this.hitFoe(o, main ? (a.dmg || Math.max(6, Math.round(o.max * .14))) : 4, main ? p.ax : (o.x - f.x) / (d || 1), main ? p.ay : (o.y - f.y) / (d || 1), true); } };
    if (a.kind === 'rise') { // launch, three cuts in the air, and down
      if (A.n === 0 && tau >= 0) { p.x = f.x - 20; p.y = f.y + 2; this.clampA(p); cut(); this.ring(f.x, f.y, '#fff', 40); }
      const k = Math.min(1, tau / .3), z = 52 * (1 - Math.pow(1 - k, 2)); if (!A.done) { f.z = z; p.z = z * .9; f.st = 'hurt'; f.t = 0; }
      for (let i = 1; i <= 3; i++) if (A.n === i && tau >= .2 + i * .2) { p.x = f.x + (i % 2 ? 20 : -20); p.y = f.y + 2; cut(); }
      if (!A.done && tau >= 1.05) { cut(0, 1); land(); }
      if (tau > 1.7) this.art = null;
    } else { // storm: six passes straight through, then every line goes off at once
      for (let i = 0; i < 6; i++) if (A.n === i && tau >= i * .12) { const ang = i * 2.4 + 0.6, x0 = p.x, y0 = p.y; p.trail.push({ x: p.x, y: p.y, life: .3 }); p.x = f.x + Math.cos(ang) * 40; p.y = f.y + Math.sin(ang) * 24; this.lines.push({ x0: f.x * 2 - p.x, y0: f.y * 2 - p.y, x1: p.x, y1: p.y, life: 1.6 - tau }); cut(); f.st = 'hurt'; f.t = 0; }
      if (!A.done && tau >= .95) { for (const l of this.lines) l.life = .25; land(); }
      if (tau > 1.5) { this.art = null; this.lines = []; }
    }
    for (const l of this.lines) l.life -= dt; this.lines = this.lines.filter(l => l.life > 0);
    if (!this.art) { p.z = 0; if (f.st !== 'down') f.z = 0; this.voice('art'); }
  },
  // ELEVEN: one blow for every second the doors stood open
  startSuper() { this.voice('eleven'); const p = this.p; p.hold = 0; p.st = 'idle'; p.fury = 0; this.sup = { t: 0, n: 0, next: 0.95, tg: this.nearest(p) }; this.slow = 0; Sound.play('roar'); Sound.play('choir'); this.shake = .4; this.token = []; for (const f of this.foes) if (f.st === 'wind' || f.st === 'charge') { f.st = 'approach'; f.cd = 1; } },
  updSuper(dt) {
    const s = this.sup, p = this.p; s.t += dt; p.inv = .5;
    if (s.t < 0.95) return;
    if (s.wt !== undefined) s.wt += dt; if (p.st === 'atk') { p.t += dt; if (p.t > .3) p.st = 'idle'; }
    if (s.n >= 11) { if (s.t > s.next + 0.45) { this.sup = null; } return; }
    if (s.t >= s.next) {
      const live = this.foes.filter(f => f.st !== 'down' && !f.enter); if (!live.length) { this.sup = null; return; }
      const f = live.sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[live.length > 1 ? s.n % Math.min(3, live.length) : 0], side = s.n % 2 ? 1 : -1, last = s.n === 10;
      p.trail.push({ x: p.x, y: p.y, life: .3 }); p.x = f.x + side * 18; p.y = f.y + (s.n % 3 - 1) * 8; this.clampA(p); const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy) || 1; p.fx = p.ax = dx / d; p.fy = p.ay = dy / d; p.st = 'atk'; p.t = 0; p.hit = true; p.combo = last ? 3 : 1 + s.n % 2; s.tg = f;
      s.word = ELEVEN[s.n]; s.wt = 0; s.n++; s.next = s.t + (last ? 0 : Math.max(0.085, 0.16 - s.n * 0.008));
      this.hitFoe(f, (last ? 3 : 1) * p.pow, last ? p.ax : 0, last ? p.ay : 0, last); if (!this.sup) return;
      if (last) { this.impact = .3; this.shake = .9; this.punch = .6; this.ring(f.x, f.y, '#ff7a30', 110); this.ring(f.x, f.y, '#fff2c0', 70); if (!this.def.doomed) this.fin = { x: f.x, y: f.y, t: 0 }; Sound.play('roar'); Sound.play('rumble'); f.vz = 230; for (const o of live) if (this.sup && o !== f && o.st !== 'down' && Math.hypot(o.x - f.x, o.y - f.y) < 70) this.hitFoe(o, 2 * p.pow, (o.x - f.x) / 70, (o.y - f.y) / 70, true); }
      this.freeze = last ? 0.34 : 0.03;
    }
  },
  updFoe(f, dt) {
    const p = this.p, K = f.K; f.flash = Math.max(0, f.flash - dt); f.guardT = Math.max(0, (f.guardT || 0) - dt); if (f.bark) { f.bark.life -= dt; if (f.bark.life <= 0) f.bark = null; }
    f.x += f.kx * dt; f.y += f.ky * dt; f.kx *= Math.pow(.002, dt); f.ky *= Math.pow(.002, dt);
    if (f.vz || f.z > 0) { f.z = (f.z || 0) + f.vz * dt; f.vz -= 560 * dt; if (f.z <= 0) { if (f.vz < -120) this.spark(f.x, f.y, '#c8c0a0', 4, 0); f.z = 0; f.vz = 0; } }
    if (f.st === 'down') { f.t += dt; return; }
    if (f.enter) { f.y += 80 * dt; f.anim += dt; f.fx = 0; f.fy = 1; const A = this.arena, hh = A.kind === 'ring' ? A.ry : A.h / 2; if (f.y > -hh + 10) f.enter = false; return; }
    // who to go for: Kael mostly, but allies pull some of them off him
    if (!f.tg || f.tgT <= 0) { let best = p, bd = Math.hypot(p.x - f.x, p.y - f.y) * (this.allies.length ? .75 : 0); for (const a of this.allies) { const d = Math.hypot(a.x - f.x, a.y - f.y); if (d < bd) { bd = d; best = a; } } f.tg = best; f.tgT = 2 + Math.random() * 2; } f.tgT -= dt;
    const T = f.tg, dx = T.x - f.x, dy = T.y - f.y, d = Math.hypot(dx, dy) || 1, face = () => { f.fx = dx / d; f.fy = dy / d; };
    if (f.st === 'hurt') { f.t += dt; if (f.t > 0.24) { f.st = 'approach'; f.cd = Math.min(f.cd, K.soft ? 0.6 : 0.12); } }
    else if (f.st === 'approach') {
      f.cd -= dt; face(); const want = K.reach * 0.8;
      let mx = 0, my = 0; if (d > want) { mx = dx / d; my = dy / d; } else if (d < want * 0.55) { mx = -dx / d; my = -dy / d; } else { const s = (f.idx % 2 ? 1 : -1); mx = -dy / d * .6 * s; my = dx / d * .6 * s; }
      for (const o of this.foes) if (o !== f && o.st !== 'down') { const ox = f.x - o.x, oy = f.y - o.y, od = Math.hypot(ox, oy) || 1; if (od < 26) { mx += ox / od; my += oy / od; } }
      f.x += mx * K.spd * dt; f.y += my * K.spd * dt; f.anim += dt;
      const cap = T === p ? (this.foes.length > 3 ? 2 : 1) : 99;
      if (f.cd <= 0 && (T !== p || this.token.length < cap || this.token.includes(f)) && p.st !== 'down') {
        const far = K.charge && d > 60 && Math.random() < .7;
        if (K.blink && T === p && d > 44 && Math.random() < .5) { this.spark(f.x, f.y, '#fff6dc', 10); f.x = p.x - p.fx * 30; f.y = p.y - p.fy * 30; this.clampA(f); this.spark(f.x, f.y, '#fff6dc', 10); Sound.play('page'); f.cd = .25; return; }
        if (d < K.reach * 1.25 || far) { if (T === p && !this.token.includes(f)) this.token.push(f); f.st = 'wind'; f.t = 0; f.ax = dx / d; f.ay = dy / d; f.mode = far ? 'charge' : K.sweep && Math.random() < .45 ? 'sweep' : 'strike'; f.second = false; f.hits = 0; if (T === p) Sound.play('huh'); }
      }
    } else if (f.st === 'wind') {
      f.t += dt; const w = f.mode === 'charge' ? K.wind + .15 : f.second ? 0.3 : K.wind;
      if (f.t >= w) {
        if (f.mode === 'charge') { f.st = 'charge'; f.t = 0; Sound.play('roar'); }
        else { f.st = 'recover'; f.t = 0; Sound.play('move'); f.swing = .18;
          if (f.mode === 'sweep') { if (d < K.reach + 6) this.strikeAt(f, T, K.dmg, dx / d, dy / d); this.ring(f.x, f.y, '#c8ccd4', K.reach + 6); }
          else { const hx = f.x + f.ax * K.reach, hy = f.y + f.ay * K.reach; f.x += f.ax * 10; f.y += f.ay * 10;
            const t = clamp(((T.x - f.x) * f.ax + (T.y - f.y) * f.ay) / K.reach, 0, 1), qx = f.x + (hx - f.x) * t, qy = f.y + (hy - f.y) * t; if (Math.hypot(T.x - qx, T.y - qy) < (K.wide || 12)) this.strikeAt(f, T, K.dmg, f.ax, f.ay); }
          if (K.double && !f.second && f.hp < f.max * .7) { f.st = 'wind'; f.t = 0; f.second = true; f.ax = dx / d; f.ay = dy / d; } }
      }
    } else if (f.st === 'charge') {
      f.t += dt; f.x += f.ax * 230 * dt; f.y += f.ay * 230 * dt; f.anim += dt * 2; f.fx = f.ax; f.fy = f.ay;
      if (Math.hypot(T.x - f.x, T.y - f.y) < 14 && !f.hitOnce) { f.hitOnce = 1; this.strikeAt(f, T, 2, f.ax, f.ay); }
      if (f.t > 0.5) { f.st = 'recover'; f.t = -0.3; f.hitOnce = 0; }
    } else if (f.st === 'recover') { f.t += dt; f.swing = Math.max(0, (f.swing || 0) - dt); if (f.t >= K.rec) { f.st = 'approach'; f.cd = K.cd[0] + Math.random() * (K.cd[1] - K.cd[0]); this.token = this.token.filter(o => o !== f); } }
    this.clampA(f);
  },
  strikeAt(f, T, dmg, ax, ay) { if (T === this.p) this.hurtPlayer(f, dmg, ax, ay); else { T.st = 'hurt'; T.t = 0; T.kx = ax * 120; T.ky = ay * 120; T.flash = .1; this.spark(T.x, T.y, '#fff', 4); } },
  updAlly(a, dt) {
    a.flash = Math.max(0, a.flash - dt); a.x += a.kx * dt; a.y += a.ky * dt; a.kx *= Math.pow(.002, dt); a.ky *= Math.pow(.002, dt); if (a.bark) { a.bark.life -= dt; if (a.bark.life <= 0) a.bark = null; }
    if (a.st === 'hurt') { a.t += dt; if (a.t > .5) a.st = 'approach'; this.clampA(a); return; }
    const f = this.nearest(a); if (!f) { a.anim = 0; return; } const dx = f.x - a.x, dy = f.y - a.y, d = Math.hypot(dx, dy) || 1; a.fx = dx / d; a.fy = dy / d; a.cd -= dt; a.swing = Math.max(0, (a.swing || 0) - dt);
    if (d > 26) { a.x += dx / d * 46 * dt; a.y += dy / d * 46 * dt; a.anim += dt; } else if (a.cd <= 0) { a.cd = 1.1 + Math.random() * .8; a.swing = .18; a.ax = a.fx; a.ay = a.fy; if (f.st !== 'wind' && f.hp > 1) { f.hp -= 1; f.flash = .1; f.kx = dx / d * 60; f.ky = dy / d * 60; this.spark(f.x, f.y, '#ffe08a', 3); } if (Math.random() < .2 && this.def.shouts) a.bark = { t: this.def.shouts[(Math.random() * this.def.shouts.length) | 0], life: 1.4 }; }
    this.clampA(a);
  },
  pauseMenu() { const items = [{ label: 'Back to the fight', act: () => UI.pop() }]; if (this.def.skip) items.push({ label: 'Skip this fight', act: () => { UI.pop(); this.cine = null; this.end(true); } }); items.push({ label: 'Settings', act: () => Menus.settings() }); UI.push(modal({ title: 'Paused', startCloses: true, items })); },

  // ---------------------------------------------------------- cinematics: hard cuts, moving camera, captions that do not wait
  // shot: { d, cam:[x,y,h,f], to:[x,y,h,f], acts:[{id, a:[x,y], b:[x,y], fx, fy, blade, aura, sc, swing}], cap, big, sfx, shake, flash }
  playCine(shots, done) { this.cine = { shots, i: -1, t: 0, done }; this.nextShot(); },
  nextShot() { const c = this.cine; c.i++; c.t = 0; c.cn = -1; c.ct = 0; if (c.i >= c.shots.length) { this.cine = null; c.done && c.done(); return; } const s = c.shots[c.i]; if (s.sfx) Sound.play(s.sfx); if (s.music) Sound.music(s.music); if (s.bg) { this.def = Object.assign({}, this.def, { bg: s.bg }); this.buildProps(s.bg, this.arena); } if (s.shake) this.shake = s.shake; this.impact = s.flash ? .22 : .06; this.parts = []; this.rings = []; c.acts = (s.acts || []).map(a => Object.assign({ sheet: World.sheetFor(a.id), anim: Math.random(), x: a.a[0], y: a.a[1] }, a)); },
  updCine(dt) { const c = this.cine, s = c.shots[c.i]; c.t += dt; this.stepParts(dt);
    const k = Math.min(1, c.t / s.d), e = s.lin ? k : 1 - Math.pow(1 - k, 2), cam = this.cam, a = s.cam || [cam.x, cam.y, cam.h, cam.f], b = s.to || a; cam.x = a[0] + (b[0] - a[0]) * e; cam.y = a[1] + (b[1] - a[1]) * e; cam.h = a[2] + (b[2] - a[2]) * e; cam.f = a[3] + (b[3] - a[3]) * e; cam.hor = Math.round(H * ((a[4] || .32) + ((b[4] || a[4] || .32) - (a[4] || .32)) * e));
    if (s.count) { const idx = Math.min(s.count - 1, Math.floor(Math.pow(Math.min(1, c.t / (s.d * .92)), 1.25) * s.count)); if (idx !== c.cn) { c.cn = idx; c.ct = c.t; Sound.play(idx === s.count - 1 ? 'hit' : 'heart'); this.shake = .12; } }
    for (const o of c.acts) { const q = o.b || o.a; o.x = o.a[0] + (q[0] - o.a[0]) * k; o.y = o.a[1] + (q[1] - o.a[1]) * k; if (o.b) { o.anim += dt; if (Math.random() < .2) this.parts.push({ x: o.x, y: o.y, h: 0, vx: (Math.random() - .5) * 20, vy: 0, vh: 20 + Math.random() * 20, life: .4, c: s.dust || '#b8c080' }); } }
    const tap = this.tap; this.tap = false;
    if (Input.p('START') || (this.def.cineOnly && this.t > .8 && (tap || Input.p('A') || Input.p('B')))) { const d = c.done; this.cine = null; Input.consume(); d && d(); return; }
    if (c.t >= s.d || (c.t > .35 && (tap || Input.p('A') || Input.p('B')))) { Input.consume(); this.nextShot(); }
  },

  // ---------------------------------------------------------- drawing
  proj(x, y, h) { if (this.g3) return G3.proj(x, y, h); const c = this.cam, dz = Math.max(16, c.y - y), s = c.f / dz; return { x: W / 2 + (x - c.x) * s, y: c.hor + c.h * s - (h || 0) * s, s, dz }; },
  texture(bg) {
    if (this.tex[bg]) return this.tex[bg];
    const [c, g] = mk(512, 512), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); }, r = rng(bg.length * 31 + 7), A = this.arena, arx = A.rx || A.w / 2, ary = A.ry || A.h / 2;
    if (bg === 'ring' || bg === 'furnace') { const fm = { w: 32, h: 32, theme: 'city', seed: 5, grid: Array.from({ length: 32 }, () => Array(32).fill('.')) }; for (let ty = 0; ty < 32; ty++) for (let tx = 0; tx < 32; tx++) drawTile(g, fm, tx, ty);
      if (bg === 'furnace') { g.fillStyle = 'rgba(255,90,30,.16)'; g.fillRect(0, 0, 512, 512); for (let y = 0; y < 512; y += 16) { g.fillStyle = `rgba(255,120,40,${Math.max(0, .3 - Math.abs(y - 180) / 300)})`; g.fillRect(0, y, 512, 16); } }
      else { g.fillStyle = 'rgba(12,6,10,.5)'; g.fillRect(0, 0, 512, 512); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.ellipse(256, 256, arx, ary, 0, 0, 6.3); g.fill(); g.globalCompositeOperation = 'source-over';
        // punched-out circle shows nothing through a pattern, so lay the lit stones back in underneath
        g.globalCompositeOperation = 'destination-over'; for (let ty = 8; ty < 24; ty++) for (let tx = 6; tx < 26; tx++) { g.save(); drawTile(g, fm, tx, ty); g.restore(); } g.globalCompositeOperation = 'source-over';
        g.fillStyle = 'rgba(255,170,80,.10)'; g.beginPath(); g.ellipse(256, 256, arx, ary, 0, 0, 6.3); g.fill(); g.strokeStyle = '#efe6d4'; g.lineWidth = 3; g.setLineDash([7, 3]); g.beginPath(); g.ellipse(256, 256, arx, ary, 0, 0, 6.3); g.stroke(); g.setLineDash([]);
        R(252, 252, 9, 9, '#e8b23a'); for (const [a, b] of [[-10, 0], [10, 0], [0, -10], [0, 10], [-7, -7], [7, 7], [-7, 7], [7, -7]]) R(255 + a, 255 + b, 3, 3, '#e8b23a'); }
    } else if (bg === 'keep') { for (let y = 0; y < 512; y += 32) for (let x = (y / 32 % 2) * 16 - 16; x < 512; x += 32) { const c0 = ['#d6cfc0', '#cdc5b4', '#dcd6c8'][(r() * 3) | 0]; R(x, y, 32, 32, '#9a9284'); R(x, y, 31, 31, c0); R(x, y, 31, 2, shade(c0, 1.08)); R(x, y + 29, 31, 2, shade(c0, .86)); if (r() > .8) R(x + 6 + r() * 16, y + 8, 1, 10, '#a8a090'); }
      g.strokeStyle = '#e8c25a'; g.lineWidth = 4; g.beginPath(); g.ellipse(256, 256, arx * .8, ary * .8, 0, 0, 6.3); g.stroke(); g.lineWidth = 2; g.beginPath(); g.ellipse(256, 256, arx * .45, ary * .45, 0, 0, 6.3); g.stroke(); R(246, 250, 20, 12, '#e8c25a'); R(251, 244, 10, 24, '#e8c25a'); R(252, 252, 8, 8, '#2a2438');
    } else { // grass: the Assay valley (the ford reuses it with a river and a different light)
      R(0, 0, 512, 512, '#4f8a3c'); for (let i = 0; i < 2600; i++) { const x = r() * 512, y = r() * 512, k = r(); R(x, y, 3 + r() * 5, 2, k < .4 ? '#3f7a32' : k < .8 ? '#5e9a44' : '#6fae4c'); }
      for (let i = 0; i < 500; i++) { const x = r() * 512, y = r() * 512; R(x, y, 1, 3, '#2f6a2a'); R(x + 1, y + 1, 1, 2, '#7ab850'); }
      for (let i = 0; i < 140; i++) { const x = r() * 512, y = r() * 512; R(x, y, 2, 2, r() < .5 ? '#fff6d0' : '#ffd84a'); }
      g.fillStyle = 'rgba(96,70,40,.55)'; for (let i = 0; i < 40; i++) { const t0 = i / 40; g.beginPath(); g.ellipse(256 + (t0 - .5) * 420 + Math.sin(i) * 10, 256 + Math.sin(t0 * 5) * 26, 20 + r() * 16, 10 + r() * 6, 0, 0, 6.3); g.fill(); }
      if (bg === 'ford') { for (let y = 206; y < 250; y++) { const k = Math.sin((y - 206) / 44 * Math.PI); R(0, y, 512, 1, `rgb(${60 - k * 20 | 0},${130 + k * 20 | 0},${170 + k * 40 | 0})`); } for (let i = 0; i < 260; i++) R(r() * 512, 208 + r() * 40, 6 + r() * 10, 1, r() < .5 ? '#bfe6ff' : '#3a86b0'); for (let i = 0; i < 60; i++) { const x = r() * 512; R(x, 204 + r() * 3, 6, 3, '#8a8a80'); R(x, 249 + r() * 3, 6, 3, '#8a8a80'); } }
    }
    this.tex[bg] = c; return c;
  },
  backdrop(g, bg, hor, t) {
    const c = this.cam, px = -c.x * .12, R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }, rm = Settings.d.reduce;
    if (bg === 'furnace') {
      for (let y = 0; y <= hor; y++) R(0, y, W, 1, `rgb(${30 + y * 1.4 | 0},${10 + y * .4 | 0},${10 + y * .15 | 0})`);
      const fx = W / 2 + px * 3; R(fx - 70, hor - 46, 140, 46, '#1a1014'); R(fx - 66, hor - 42, 132, 42, '#2a181a'); R(fx - 40, hor - 34, 80, 34, '#120608');
      g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(fx, hor - 14, 0, fx, hor - 14, 110); gr.addColorStop(0, 'rgba(255,170,70,.9)'); gr.addColorStop(.3, 'rgba(255,100,30,.4)'); gr.addColorStop(1, 'rgba(255,60,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, hor + 30); g.globalCompositeOperation = 'source-over';
      R(fx - 36, hor - 30, 72, 30, '#ff8a30'); R(fx - 30, hor - 24, 60, 24, '#ffc060'); R(fx - 20, hor - 16, 40, 16, '#fff0b0');
      if (!rm) for (let i = 0; i < 8; i++) R(fx - 30 + (i * 37 + t * 40) % 60, hor - 30 + Math.sin(t * 7 + i) * 4, 4, 6, '#ffe08a');
      for (let i = 0; i < 6; i++) { R(i * (W / 5) - 8 + px, 0, 10, hor, '#140a0c'); R(i * (W / 5) - 8 + px, 0, 2, hor, '#3a2020'); }
    } else if (bg === 'ring') {
      for (let y = 0; y <= hor; y++) R(0, y, W, 1, `rgb(${14 + y * .35 | 0},${9 + y * .2 | 0},${14 + y * .25 | 0})`);
      const pxl = W / 2 + px * 3; g.globalCompositeOperation = 'lighter'; let gr = g.createRadialGradient(pxl, hor - 10, 0, pxl, hor - 10, 90); gr.addColorStop(0, 'rgba(255,214,150,.5)'); gr.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, hor + 20); g.globalCompositeOperation = 'source-over';
      R(pxl - 3, 0, 6, hor, '#ffe9b8'); R(pxl - 1, 0, 2, hor, '#fff');
      for (let i = 0; i < 9; i++) { const x = ((i * 53 + px * 2) % (W + 60) + W + 60) % (W + 60) - 30, h = 14 + (i * 7 % 13); R(x, hor - h, 34, h, '#1a1216'); R(x + 4, hor - h + 4, 3, 4, i % 2 ? '#ffb35a' : '#3a2a20'); R(x + 20, hor - h + 7, 3, 4, i % 3 ? '#3a2a20' : '#ffb35a'); }
      for (let s2 = 0; s2 < 3; s2++) for (let i = 0; i < 12; i++) { const x = (i / 11) * (W + 40) - 20 + px, y = 10 + s2 * 11 + Math.sin(i / 11 * Math.PI) * 9 + (rm ? 0 : Math.sin(t * 1.4 + i + s2) * 1); R(x, y, 4, 5, ['#ffb040', '#ff8a3a', '#ffd070'][(i + s2) % 3]); R(x + 1, y + 1, 2, 2, '#fff0b0'); }
    } else {
      const dusk = bg === 'ford', dawn = bg === 'keep', top = dusk ? [70, 50, 110] : dawn ? [90, 120, 190] : [58, 122, 208], bot = dusk ? [255, 150, 90] : dawn ? [255, 200, 170] : [190, 226, 255];
      for (let y = 0; y <= hor; y++) { const k = Math.pow(y / Math.max(1, hor), 1.4); R(0, y, W, 1, `rgb(${top[0] + (bot[0] - top[0]) * k | 0},${top[1] + (bot[1] - top[1]) * k | 0},${top[2] + (bot[2] - top[2]) * k | 0})`); }
      // the sun. It is rather more yellow than she painted it.
      const sx = W * (dusk ? .26 : .72) + px, sy = dusk || dawn ? hor - 9 : hor * .34, sr = dusk || dawn ? 15 : 10;
      g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(sx, sy, 0, sx, sy, sr * 7); gr.addColorStop(0, 'rgba(255,240,190,.75)'); gr.addColorStop(.3, 'rgba(255,214,120,.28)'); gr.addColorStop(1, 'rgba(255,200,100,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, hor + 30);
      if (!rm) for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + t * .1; g.fillStyle = 'rgba(255,236,170,.10)'; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a - .06) * 160, sy + Math.sin(a - .06) * 160); g.lineTo(sx + Math.cos(a + .06) * 160, sy + Math.sin(a + .06) * 160); g.fill(); }
      g.globalCompositeOperation = 'source-over'; g.fillStyle = '#fff6c8'; g.beginPath(); g.arc(sx, sy, sr, 0, 6.3); g.fill(); g.fillStyle = '#ffe070'; g.beginPath(); g.arc(sx, sy, sr - 2, 0, 6.3); g.fill();
      for (let i = 0; i < 4; i++) { const x = ((i * 97 + t * 2 + px * .5) % (W + 80) + W + 80) % (W + 80) - 40, y = 8 + i * 9; g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x, y, 30, 4); g.fillRect(x + 6, y - 3, 16, 4); }
      const mt = (off, hh, col, snow, par) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, hor + 1); for (let x = -20; x <= W + 20; x += 10) { const wx = x - px * par + off; g.lineTo(x, hor - hh * (.55 + .45 * Math.sin(wx * .021) * Math.sin(wx * .013 + 1.7)) - 4); } g.lineTo(W, hor + 1); g.fill(); if (snow) { g.fillStyle = snow; for (let x = -20; x <= W + 20; x += 10) { const wx = x - px * par + off, y = hor - hh * (.55 + .45 * Math.sin(wx * .021) * Math.sin(wx * .013 + 1.7)) - 4; if (y < hor - hh * .7) g.fillRect(x - 4, y, 9, 3); } } };
      mt(0, hor * .62, dusk ? '#5a4a80' : dawn ? '#8a90c0' : '#7a9ad0', '#f4f8ff', .3); mt(140, hor * .4, dusk ? '#3e3466' : dawn ? '#6a70a8' : '#5a84b8', null, .6);
      // a white keep on the ridge, and its standard
      const kx = W * (dusk ? .68 : .2) + px * 1.4; R(kx, hor - 30, 26, 26, '#f0ece4'); R(kx + 22, hor - 30, 4, 26, '#c8c4bc'); R(kx - 5, hor - 20, 8, 16, '#e4e0d8'); R(kx + 8, hor - 40, 9, 12, '#f8f6f0'); for (let i = 0; i < 4; i++) R(kx + i * 7, hor - 33, 4, 3, '#f0ece4'); R(kx, hor - 30, 26, 1, '#e8c25a'); R(kx + 12, hor - 52, 1, 12, '#8a8478'); R(kx + 13, hor - 52, 8 + (rm ? 0 : Math.sin(t * 5) * 2), 5, '#e8c25a');
      g.fillStyle = dusk ? '#1e3a2e' : '#2a5a34'; g.beginPath(); g.moveTo(0, hor + 1); for (let x = -8; x <= W + 8; x += 4) { const wx = Math.round((x - px * 2) / 4); g.lineTo(x, hor - 5 - (hash(wx, 3) * 7) - (wx % 3 === 0 ? 4 : 0)); } g.lineTo(W, hor + 1); g.fill();
      if (!rm) for (let i = 0; i < 5; i++) { const x = (i * 71 + t * 9) % (W + 20) - 10, y = 14 + i * 5 + Math.sin(t * 2 + i) * 3; R(x, y, 2, 1, '#2a2a34'); R(x - 2, y - 1, 2, 1, '#2a2a34'); R(x + 2, y - 1, 2, 1, '#2a2a34'); }
    }
  },
  floor(g, bg) {
    const c = this.cam, tex = this.texture(bg); if (!this.pat[bg]) this.pat[bg] = g.createPattern(tex, 'repeat');
    g.imageSmoothingEnabled = false; g.fillStyle = this.pat[bg]; const b = g.getTransform();
    for (let sy = Math.ceil(c.hor) + 1; sy < H; sy++) { const s = (sy - c.hor) / c.h, dz = c.f / s, wy = c.y - dz; g.setTransform(b.a * s, 0, 0, b.d, b.e + b.a * (W / 2 - (256 + c.x) * s), b.f + b.d * (sy - (wy + 256))); g.fillRect(256 + c.x - (W / 2) / s - 1, wy + 256, W / s + 2, 1.02); }
    g.setTransform(b);
    const haze = bg === 'ring' ? '20,12,16' : bg === 'furnace' ? '255,110,40' : bg === 'ford' ? '255,170,120' : bg === 'keep' ? '255,214,190' : '200,230,255'; const gr = g.createLinearGradient(0, c.hor, 0, c.hor + 46); gr.addColorStop(0, `rgba(${haze},.85)`); gr.addColorStop(1, `rgba(${haze},0)`); g.fillStyle = gr; g.fillRect(0, c.hor, W, 47);
  },
  poly(g, pts, col) { if (this.g3) return G3.poly(pts, col); g.fillStyle = col; g.beginPath(); pts.forEach((q, i) => { const pr = this.proj(q[0], q[1]); if (i) g.lineTo(pr.x, pr.y); else g.moveTo(pr.x, pr.y); }); g.closePath(); g.fill(); },
  disc(g, x, y, r, col, stroke) { if (this.g3 && stroke) return G3.ring(x, y, r, col, stroke * .9); const pts = []; for (let i = 0; i < 18; i++) pts.push([x + Math.cos(i / 18 * 6.283) * r, y + Math.sin(i / 18 * 6.283) * r]); if (stroke) { g.strokeStyle = col; g.lineWidth = stroke; g.beginPath(); pts.forEach((q, i) => { const pr = this.proj(q[0], q[1]); if (i) g.lineTo(pr.x, pr.y); else g.moveTo(pr.x, pr.y); }); g.closePath(); g.stroke(); } else this.poly(g, pts, col); },
  // one fighter: billboard, lean, shine, aura, weapon
  fighter(g, o, opt) {
    if (this.g3) { // above the rock the fighter is a 3D figure; only the pixel HUD is drawn here
      G3.char(o, opt); if (o.st === 'down') return; const hp = this.proj(o.x, o.y, 76 + (o.z || 0) * 1.2); if (hp.dz < 10) return; const cx = hp.x, top = Math.round(hp.y);
      if (opt.foe && o.st === 'wind') ptext(g, '!', Math.round(cx) - 2, top - 10, '#ff5a4a', 2);
      if (opt.foe && !opt.boss && o.hp < o.max) { const bw = clamp(Math.round(30 * hp.s), 14, 34), hx = Math.round(cx - bw / 2); g.fillStyle = '#120a0e'; g.fillRect(hx - 1, top - 5, bw + 2, 4); g.fillStyle = '#c8452e'; g.fillRect(hx, top - 4, Math.max(0, Math.round(bw * o.hp / o.max)), 2); }
      if (o.bark) { const tw = ptextW(o.bark.t), bx = clamp(Math.round(cx - tw / 2 - 3), 2, W - tw - 8), by = Math.max(28, top - 20); g.fillStyle = '#120a0e'; g.fillRect(bx - 1, by - 1, tw + 8, 11); g.fillStyle = '#f3e3c3'; g.fillRect(bx, by, tw + 6, 9); ptext(g, o.bark.t, bx + 3, by + 2, '#2a1408'); }
      return; }
    const pr = this.proj(o.x, o.y), sh = o.sheet, fh = sh.fh || 16, sc = this.K * pr.s * (o.sc || 1), w = 16 * sc, hgt = fh * sc, t = this.t, rm = Settings.d.reduce;
    if (pr.dz < 24 || pr.x < -60 || pr.x > W + 60) return;
    const nfr = Math.round(sh.width / 16), fx = o.fx || 0, fy = o.fy || 0, dir = Math.abs(fx) > Math.abs(fy) * .7 ? (fx < 0 ? 2 : 3) : fy > 0 ? 0 : 1, side = dir === 2 ? -1 : dir === 3 ? 1 : 0;
    const mv = opt.run || o.st === 'move' || o.st === 'approach' || o.st === 'charge' || (o.ally && o.anim > 0 && o.st !== 'hurt'), fr = mv ? 1 + (Math.floor(o.anim * 8) % 2) : (!rm && nfr >= 4 && ((t * 1.1 + o.x * .1) % 3.7) < .12 ? 3 : 0);
    const bgN = this.def.bg;
    if (bgN === 'keep' && o.st !== 'down' && !rm) { g.save(); g.globalAlpha = .13; g.translate(pr.x, pr.y + 1); g.scale(1, -.7); g.drawImage(sh, 0, dir * fh, 16, fh, -w / 2, -hgt, w, hgt); g.restore(); g.globalAlpha = 1; }
    g.fillStyle = 'rgba(0,0,0,.34)'; g.beginPath(); g.ellipse(pr.x, pr.y + 1, 7 * sc * .9, 2.2 * sc * .9, 0, 0, 6.3); g.fill();
    if (bgN === 'ford' && o.y > -50 && o.y < -6 && !rm) { g.strokeStyle = 'rgba(220,244,255,.7)'; g.lineWidth = 1; for (let i = 0; i < 2; i++) { const ph = (t * 1.3 + i * .5 + (o.idx || 0) * .2) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.ellipse(pr.x, pr.y, (6 + ph * 12) * sc * .9, (2 + ph * 3.5) * sc * .9, 0, 0, 6.3); g.stroke(); } g.globalAlpha = 1; }
    if (mv && !rm && Math.random() < .12 && bgN !== 'keep' && bgN !== 'ring') this.parts.push({ x: o.x, y: o.y, h: 0, vx: (Math.random() - .5) * 24, vy: 0, vh: 18 + Math.random() * 22, life: .35, c: bgN === 'ford' && o.y > -50 && o.y < -6 ? '#cfeeff' : bgN === 'furnace' ? '#5a4038' : '#9aa860' });
    const zz = (o.z || 0) * pr.s;
    if (o.st === 'down') { const k = Math.min(1, o.t * 3.5); g.save(); g.translate(pr.x, pr.y - 2 * sc - zz); g.rotate((side || 1) * -(k * 1.5 + (o.z > 0 ? o.t * 9 : 0))); g.globalAlpha = Math.max(.25, 1 - Math.max(0, o.t - 1.2)); g.drawImage(sh, 0, dir * fh, 16, fh, -w / 2, -hgt, w, hgt); g.restore(); g.globalAlpha = 1; return; }
    const aura = opt.aura || 0;
    if (aura > 0 && !rm) { g.globalCompositeOperation = 'lighter'; const n = 6 + aura * 3; for (let i = 0; i < n; i++) { const ph = (t * (1.6 + i * .13) + i * .37) % 1, ax = pr.x + Math.sin(i * 2.4 + t * 3) * w * (.34 + aura * .06), ay = pr.y - ph * hgt * (1.0 + aura * .22), rr = (1 - ph) * w * (.28 + aura * .05); g.fillStyle = opt.auraC || `rgba(255,${90 + ph * 120 | 0},${30 + ph * 40 | 0},${.34 * (1 - ph)})`; g.beginPath(); g.ellipse(ax, ay, rr * .7, rr * 1.5, 0, 0, 6.3); g.fill(); } const gr = g.createRadialGradient(pr.x, pr.y - hgt * .5, 0, pr.x, pr.y - hgt * .5, hgt * (.7 + aura * .15)); gr.addColorStop(0, opt.auraG || `rgba(255,120,40,${.22 + aura * .06})`); gr.addColorStop(1, 'rgba(255,90,30,0)'); g.fillStyle = gr; g.fillRect(pr.x - hgt * 1.3, pr.y - hgt * 1.8, hgt * 2.6, hgt * 2.6); g.globalCompositeOperation = 'source-over'; }
    if (opt.cape && dir !== 0 && !rm && o.st !== 'down') { const wv = Math.sin(t * 7 + (o.idx || 0)) * w * .08, bk = dir === 1 ? 0 : -side, ext = (mv || o.st === 'atk' || o.st === 'dodge' ? .55 : .2) * w, x0 = pr.x + bk * w * .12, y0 = pr.y - hgt * .64 - (o.z || 0) * pr.s; g.fillStyle = opt.cape; g.beginPath(); g.moveTo(x0 - w * .2, y0); g.lineTo(x0 + w * .2, y0); g.lineTo(x0 + w * .26 + bk * ext + wv, y0 + hgt * .5); g.lineTo(x0 + bk * ext * 1.25 - wv, y0 + hgt * .58); g.lineTo(x0 - w * .26 + bk * ext * .8 + wv, y0 + hgt * .5); g.fill(); g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + w * .2, y0); g.lineTo(x0 + w * .26 + bk * ext + wv, y0 + hgt * .5); g.lineTo(x0 + bk * ext * 1.25 - wv, y0 + hgt * .58); g.fill(); }
    let lean = 0, sqx = 1, sqy = 1, oy = 0, alpha = 1, jx = 0;
    if (o.st === 'atk') { const k = Math.sin(Math.min(1, o.t / .14) * Math.PI); lean = side * (o.combo === 3 ? .4 : .28) * k; sqx = 1 + .14 * k; sqy = 1 - .06 * k; jx = (o.ax || 0) * k * 5 * sc * .4; if (o.combo === 3) oy = -Math.sin(Math.min(1, o.t / .22) * Math.PI) * 9 * sc * .4; }
    else if (o.st === 'idle' || o.st === 'approach' || o.st === 'move') { sqy = 1 + Math.sin(t * 3.2 + (o.idx || 0) * 1.7) * .018; if (mv) oy = -Math.abs(Math.sin(o.anim * 8 * Math.PI / 2)) * 1.5 * sc * .4; }
    else if (o.st === 'hurt') { lean = -side * .3 - (side ? 0 : .12); sqy = .92; }
    else if (o.st === 'dodge') { alpha = .65; oy = -Math.sin(o.t / .3 * Math.PI) * 7 * sc * .4; sqx = 1.15; sqy = .9; }
    else if (o.st === 'wind') { lean = -side * .16; if (!rm) jx = Math.sin(t * 50) * 1.2; }
    else if (o.st === 'charge' || opt.run) lean = side * .2;
    else if (o.st === 'recover' && o.t < .16) lean = side * .22;
    if (o === this.p && o.inv > 0 && o.st !== 'dodge' && !this.sup && Math.floor(t * 20) % 2) alpha = .35;
    oy -= zz; g.save(); g.translate(Math.round(pr.x + jx), Math.round(pr.y + oy)); g.rotate(lean); g.scale(sqx, sqy); g.globalAlpha = alpha; g.drawImage(sh, fr * 16, dir * fh, 16, fh, -w / 2, -hgt, w, hgt);
    if (o.flash > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = .8; g.drawImage(sh, fr * 16, dir * fh, 16, fh, -w / 2, -hgt, w, hgt); g.globalCompositeOperation = 'source-over'; }
    if (sh.glow && !rm) { const ph = ((t * .55 + (o.idx || 0) * .23 + (o.ally ? .5 : 0)) % 1) * 2.4 - .7; if (ph > -.3 && ph < 1.3) { g.save(); g.beginPath(); g.moveTo(-w / 2 + ph * w, -hgt); g.lineTo(-w / 2 + ph * w + w * .22, -hgt); g.lineTo(-w / 2 + ph * w - w * .2, 0); g.lineTo(-w / 2 + ph * w - w * .42, 0); g.clip(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .55; g.drawImage(sh, fr * 16, dir * fh, 16, fh, -w / 2, -hgt, w, hgt); g.restore(); } } // the gold shines
    g.restore(); g.globalAlpha = 1;
    // arms and weapons: a real sword arm that swings from the shoulder, three different cuts in the chain
    const base = Math.atan2(fy * .45, fx || (dir === 0 ? .01 : -.01)), sg = side >= 0 ? 1 : -1, up = -Math.PI / 2, blade = opt.blade, cb = o.combo || 1;
    const shx = pr.x + jx + (side ? side * w * .1 : w * .26), shy = pr.y + oy - hgt * .6, armL = hgt * .17, armC = sh.glow ? '#e8e0cc' : '#c48a64';
    let sw = -1; if (o.st === 'atk') sw = Math.min(1, o.t / .13); else if (o.swing > 0) sw = 1 - o.swing / .18;
    const limb = (a, len, col, wd) => { const hx = shx + Math.cos(a) * len, hy = shy + Math.sin(a) * len; g.strokeStyle = '#2a1e16'; g.lineWidth = wd + 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(shx, shy); g.lineTo(hx, hy); g.stroke(); g.strokeStyle = col; g.lineWidth = wd; g.stroke(); g.lineCap = 'butt'; return [hx, hy]; };
    if (blade) { const L = hgt * (blade === 2 ? .9 : .55); let a = up + sg * (blade === 2 ? .25 : .5) + Math.sin(t * 2.2 + (o.idx || 0)) * .05, a0 = a, tr = 0;
      if (sw >= 0) { const e = 1 - Math.pow(1 - sw, 2); if (blade === 2) { a0 = base; a = base; tr = 0; } else if (cb === 2) { a0 = base + 2.0 * sg; a = a0 + (base - 1.0 * sg - a0) * e; tr = 1; } else if (cb === 3) { a0 = up - .9 * sg; a = a0 + (base + .9 * sg - a0) * e; tr = 1; } else { a0 = base - 2.0 * sg; a = a0 + (base + 1.0 * sg - a0) * e; tr = 1; } }
      else if (o.st === 'wind') a = up - sg * (.7 + Math.min(.5, o.t)) + (rm ? 0 : Math.sin(t * 60) * .04);
      else if (o.st === 'hurt') a = up + sg * 1.6; else if (o.st === 'recover' && o.t < .2) a = base + sg * (blade === 2 ? 0 : .9);
      const reachK = blade === 2 && sw >= 0 ? 1 + Math.sin(sw * Math.PI) * .9 : 1, [hx, hy] = limb(a, armL * reachK, armC, Math.max(2, sc * 1.5));
      if (tr && sw < 1.01 && !rm) { const r1 = armL + L * 1.08, r0 = armL + L * .35, N = 7; g.globalCompositeOperation = 'lighter'; for (let i = 0; i < N; i++) { const k0 = i / N, k1 = (i + 1) / N, b0 = a0 + (a - a0) * k0, b1 = a0 + (a - a0) * k1; g.fillStyle = (opt.aura > 1.5 ? 'rgba(255,150,60,' : 'rgba(255,240,190,') + (.12 + k1 * .5) * (cb === 3 ? 1.2 : 1) + ')'; g.beginPath(); g.moveTo(shx + Math.cos(b0) * r0, shy + Math.sin(b0) * r0); g.lineTo(shx + Math.cos(b0) * r1, shy + Math.sin(b0) * r1); g.lineTo(shx + Math.cos(b1) * r1, shy + Math.sin(b1) * r1); g.lineTo(shx + Math.cos(b1) * r0, shy + Math.sin(b1) * r0); g.fill(); } g.strokeStyle = '#fff'; g.lineWidth = 1; g.beginPath(); g.arc(shx, shy, r1, Math.min(a0, a), Math.max(a0, a)); g.stroke(); g.globalCompositeOperation = 'source-over'; }
      const tx = hx + Math.cos(a) * L, ty = hy + Math.sin(a) * L; g.strokeStyle = '#3a2e1a'; g.lineWidth = Math.max(3, sc * 1.3); g.beginPath(); g.moveTo(hx, hy); g.lineTo(tx, ty); g.stroke(); g.strokeStyle = blade === 2 ? '#c8ccd4' : '#fff6dc'; g.lineWidth = Math.max(1, sc * .6); g.stroke();
      const gx = Math.cos(a + 1.57) * sc * 1.6, gy = Math.sin(a + 1.57) * sc * 1.6; g.strokeStyle = '#e8c25a'; g.lineWidth = Math.max(2, sc); g.beginPath(); g.moveTo(hx - gx, hy - gy); g.lineTo(hx + gx, hy + gy); g.stroke();
      if (blade === 2) { g.fillStyle = '#e8ecf2'; g.beginPath(); g.moveTo(tx + Math.cos(a) * sc * 4, ty + Math.sin(a) * sc * 4); g.lineTo(tx + gx, ty + gy); g.lineTo(tx - gx, ty - gy); g.fill(); }
      if (!rm && (o.st === 'wind' ? o.t > .12 && Math.floor(t * 10) % 2 : Math.sin(t * 3 + (o.idx || 0)) > .96)) { g.fillStyle = '#fff'; g.fillRect(tx - sc * 2.5, ty, sc * 5 + 1, 1); g.fillRect(tx, ty - sc * 2.5, 1, sc * 5 + 1); }
    } else if (sw >= 0 || (o.st === 'recover' && o.t < .16 && o.mode === 'strike') || o.st === 'wind') { // fists: jab, cross, uppercut
      const k = sw >= 0 ? Math.sin(Math.min(1, sw * 1.3) * Math.PI / 2) : o.st === 'wind' ? -.5 : 1, upper = sw >= 0 && cb === 3, a = upper ? base + (up - base) * .6 * k : base, [hx, hy] = limb(a + (cb === 2 && sw >= 0 ? -.25 * sg * (1 - k) : 0), armL * (.6 + 1.1 * k), sh.glow ? '#e8e0cc' : '#8a5a44', Math.max(2, sc * 1.5)), q = Math.max(3, sc * 3);
      g.fillStyle = '#120a0e'; g.fillRect(hx - q / 2 - 1, hy - q / 2 - 1, q + 2, q + 2); g.fillStyle = '#c48a64'; g.fillRect(hx - q / 2, hy - q / 2, q, q); g.fillStyle = '#e8b08c'; g.fillRect(hx - q / 2, hy - q / 2, q, 1);
      if (sw >= 0 && sw < .9 && !rm) { g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,236,200,${.7 * (1 - sw)})`; g.lineWidth = q; g.beginPath(); g.moveTo(shx, shy); g.lineTo(hx, hy); g.stroke(); g.globalCompositeOperation = 'source-over'; }
      if (o === this.p && o.open > 0) { g.fillStyle = 'rgba(255,224,138,.6)'; g.fillRect(hx - q, hy - q, q * 2, q * 2); } }
    const cx = pr.x, cy = pr.y - hgt * .52;
    if (o.guardT > 0 && o.st !== 'wind') { g.strokeStyle = '#c8d0dc'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, hgt * .5, -2.5, -.6); g.stroke(); }
    if (opt.foe && o.st === 'wind') ptext(g, '!', Math.round(cx) - 2, Math.round(pr.y - hgt) - 10, '#ff5a4a', 2);
    if (opt.foe && !opt.boss && o.hp < o.max) { const bw = Math.max(14, w * .8), hx = Math.round(cx - bw / 2), hy = Math.round(pr.y - hgt) - 4; g.fillStyle = '#120a0e'; g.fillRect(hx - 1, hy - 1, bw + 2, 4); g.fillStyle = '#c8452e'; g.fillRect(hx, hy, Math.max(0, Math.round(bw * o.hp / o.max)), 2); }
    if (o.bark) { const tw = ptextW(o.bark.t), bx = clamp(Math.round(cx - tw / 2 - 3), 2, W - tw - 8), by = Math.max(28, Math.round(pr.y - hgt) - 20); g.fillStyle = '#120a0e'; g.fillRect(bx - 1, by - 1, tw + 8, 11); g.fillStyle = '#f3e3c3'; g.fillRect(bx, by, tw + 6, 9); ptext(g, o.bark.t, bx + 3, by + 2, '#2a1408'); }
  },
  prop(g, q) {
    const pr = this.proj(q.x, q.y), s = pr.s, t = this.t, R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(pr.x + x * s), Math.round(pr.y + y * s), Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s))); };
    if (pr.dz < 30 || pr.x < -80 || pr.x > W + 80) return;
    if (q.t === 'crowd') { const fh = q.s.fh || 16, sc = this.K * s * .95, bob = Settings.d.reduce ? 0 : Math.abs(Math.sin(t * 3 + q.k * 1.3)) * 2 * s; g.drawImage(q.s, 0, 0, 16, fh, Math.round(pr.x - 8 * sc), Math.round(pr.y - fh * sc - bob), 16 * sc, fh * sc); if (q.k % 3 === 0) { R(7, -fh * 2.5, 5, 6, '#ffb040'); R(8, -fh * 2.5 + 1, 3, 3, '#fff0b0'); } }
    else if (q.t === 'lamp') { R(-1, -70, 2, 70, '#2a2228'); R(-5, -78, 10, 9, '#ffb040'); R(-3, -76, 6, 5, '#fff0b0'); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(pr.x, pr.y - 74 * s, 0, pr.x, pr.y - 74 * s, 34 * s); gr.addColorStop(0, 'rgba(255,190,100,.5)'); gr.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gr; g.fillRect(pr.x - 40 * s, pr.y - 114 * s, 80 * s, 80 * s); g.globalCompositeOperation = 'source-over'; }
    else if (q.t === 'tree') { const h = q.h; R(-3, -h * .3, 6, h * .3, '#4a3020'); R(-3, -h * .3, 2, h * .3, '#6a4a30'); for (let i = 0; i < 4; i++) { const w = (22 - i * 4.5), y = -h * .28 - i * h * .19; g.fillStyle = ['#1e5a2a', '#246a30', '#2a7a36', '#308a3c'][i]; g.beginPath(); g.moveTo(pr.x - w * s, pr.y + y * s); g.lineTo(pr.x, pr.y + (y - h * .3) * s); g.lineTo(pr.x + w * s, pr.y + y * s); g.fill(); g.fillStyle = 'rgba(160,230,120,.25)'; g.beginPath(); g.moveTo(pr.x - w * s, pr.y + y * s); g.lineTo(pr.x, pr.y + (y - h * .3) * s); g.lineTo(pr.x - w * .2 * s, pr.y + y * s); g.fill(); } }
    else if (q.t === 'banner') { R(-1, -76, 2, 76, '#8a8478'); R(-2, -80, 4, 4, '#e8c25a'); const wv = Settings.d.reduce ? 0 : Math.sin(t * 4 + q.k) * 2; g.fillStyle = q.c; g.beginPath(); g.moveTo(pr.x + s, pr.y - 76 * s); g.lineTo(pr.x + (26 + wv) * s, pr.y - 72 * s); g.lineTo(pr.x + (24 - wv) * s, pr.y - 50 * s); g.lineTo(pr.x + s, pr.y - 46 * s); g.fill(); R(8, -66, 8, 8, '#e8c25a'); R(10, -64, 4, 4, q.c); }
    else if (q.t === 'melee') { const sc = this.K * s, fh = 28, ph = t * 2.2 + q.k * 1.7, lunge = Math.max(0, Math.sin(ph)) * 3, fr = 1 + (Math.floor(ph) & 1);
      g.drawImage(q.a, fr * 16, 3 * fh, 16, fh, Math.round(pr.x - (15 - lunge) * s - 8 * sc), Math.round(pr.y - fh * sc), 16 * sc, fh * sc); g.drawImage(q.b, (3 - fr) * 16, 2 * fh, 16, fh, Math.round(pr.x + (15 - lunge) * s - 8 * sc), Math.round(pr.y - fh * sc), 16 * sc, fh * sc);
      if (Math.sin(ph) > .8) { g.fillStyle = '#fff6dc'; g.fillRect(Math.round(pr.x) - 1, Math.round(pr.y - 16 * sc), 3, 1); g.fillRect(Math.round(pr.x), Math.round(pr.y - 16 * sc) - 1, 1, 3); } }
    else if (q.t === 'tent') { const fl = Settings.d.reduce ? 0 : Math.sin(t * 2 + q.k) * 1; g.fillStyle = '#f4f0e6'; g.beginPath(); g.moveTo(pr.x - 26 * s, pr.y); g.lineTo(pr.x, pr.y - 44 * s); g.lineTo(pr.x + 26 * s, pr.y); g.fill(); g.fillStyle = '#d0cabc'; g.beginPath(); g.moveTo(pr.x + 6 * s, pr.y); g.lineTo(pr.x, pr.y - 44 * s); g.lineTo(pr.x + 26 * s, pr.y); g.fill(); g.fillStyle = q.c; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(pr.x - (20 - i * 8) * s, pr.y); g.lineTo(pr.x, pr.y - 44 * s); g.lineTo(pr.x - (16 - i * 8) * s, pr.y); g.fill(); } R(-5, -16, 10, 16, '#2a2030'); R(-1, -56, 1, 12, '#8a8478'); R(0, -56, 9 + fl, 5, q.c); R(-27, -2, 54, 2, '#e8c25a'); }
    else if (q.t === 'grass') { const sw2 = Settings.d.reduce ? 0 : Math.sin(t * 2.4 + q.k * 1.3 + q.x * .05) * 2.5, hh2 = q.reed ? 20 : 9; for (let i = 0; i < (q.reed ? 3 : 4); i++) { g.strokeStyle = q.reed ? ['#5a7a3a', '#6a8a44', '#4a6a30'][i % 3] : ['#3f8a34', '#6fbe4c', '#2f6a2a', '#8ad060', '#4f9a3c'][i]; g.lineWidth = Math.max(1, s); g.beginPath(); g.moveTo(pr.x + (i - 2) * 2 * s, pr.y); g.lineTo(pr.x + ((i - 2) * 3 + sw2 * (1 + i * .15)) * s, pr.y - (hh2 - Math.abs(i - 2) * 2) * s); g.stroke(); } if (q.reed) R(sw2 - 1, -22, 2, 5, '#6a4a2a'); else if (q.k % 4 === 0) R(sw2 * 1.2 - 1, -10, 2, 2, q.k % 8 ? '#fff6d0' : '#ff9ac0'); }
    else if (q.t === 'brazier') { R(-2, -22, 4, 22, '#6a6258'); R(-7, -28, 14, 7, '#3a3430'); R(-7, -28, 14, 1, '#e8c25a'); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const ph = (t * (1.4 + i * .2) + i * .3 + q.k) % 1; g.fillStyle = `rgba(255,${120 + ph * 110 | 0},40,${.6 * (1 - ph)})`; g.beginPath(); g.ellipse(pr.x + Math.sin(i * 2 + t * 4) * 3 * s, pr.y - (30 + ph * 22) * s, (5 - ph * 4) * s, (8 - ph * 5) * s, 0, 0, 6.3); g.fill(); } const gr = g.createRadialGradient(pr.x, pr.y - 30 * s, 0, pr.x, pr.y - 30 * s, 40 * s); gr.addColorStop(0, 'rgba(255,170,80,.4)'); gr.addColorStop(1, 'rgba(255,140,60,0)'); g.fillStyle = gr; g.fillRect(pr.x - 40 * s, pr.y - 70 * s, 80 * s, 80 * s); g.globalCompositeOperation = 'source-over'; }
    else if (q.t === 'rock') { R(-9, -8, 18, 8, '#7a7a74'); R(-7, -12, 12, 5, '#8e8e86'); R(-7, -12, 10, 2, '#b0b0a6'); R(-9, -2, 18, 2, '#56564e'); }
    else if (q.t === 'merlon') { R(-11, -34, 22, 34, '#d8d2c4'); R(-11, -34, 22, 3, '#f0ece2'); R(8, -31, 3, 31, '#aaa496'); R(-11, -12, 22, 1, '#b8b2a4'); if (q.k % 4 === 1) { R(-1, -70, 2, 36, '#8a8478'); R(1, -70, 16, 9, q.k % 8 === 1 ? '#7a5ac8' : '#2aa6a0'); } }
  },
  scene(g, extra) {
    const bg = this.def.bg || 'ring', rm = Settings.d.reduce, c = this.cam;
    const sx = this.shake > 0 && !rm ? Math.round((Math.random() - .5) * 6) : 0, sy = this.shake > 0 && !rm ? Math.round((Math.random() - .5) * 4) : 0;
    const artOn = this.art && this.art.t > 1.9, rush = ((this.sup && this.sup.t >= .95) || artOn) && !this.cine, d3 = this.g3 = G3.want(bg);
    g.save(); g.translate(sx, sy);
    if (d3) { g.clearRect(-8, -8, W + 16, H + 16); G3.begin(this, rush && !rm ? (artOn ? [.04, .025, .09] : [.1, .01, .02]) : null, sx, sy); } else { this.backdrop(g, bg, c.hor, this.t); this.floor(g, bg); }
    if (!rm && !d3 && (bg === 'valley' || bg === 'ford')) { const t = this.t; for (let i = 0; i < 3; i++) { const cx0 = ((i * 190 + t * 9) % 620) - 310, cy0 = -90 + i * 70; this.poly(g, Array.from({ length: 14 }, (_, k) => [cx0 + Math.cos(k / 14 * 6.283) * (70 + i * 14), cy0 + Math.sin(k / 14 * 6.283) * 30]), 'rgba(10,30,40,.13)'); }
      if (bg === 'ford') for (let i = 0; i < 26; i++) { const wx = ((i * 47.3 + t * (14 + i % 4 * 5)) % 420) - 210, wy = -48 + (i * 13) % 40, pr = this.proj(wx, wy); if (Math.sin(t * 5 + i * 2.1) > .2) { g.fillStyle = i % 3 ? 'rgba(255,230,190,.8)' : 'rgba(255,255,255,.9)'; g.fillRect(Math.round(pr.x), Math.round(pr.y), Math.max(2, Math.round(5 * pr.s)), 1); } } }
    if (!rm && !d3 && bg === 'keep') { const A = this.arena; for (let i = 0; i < 4; i++) { const x0 = -A.w / 2 - 40 + i * 90 + Math.sin(this.t * .2 + i) * 6; this.poly(g, [[x0, -A.h / 2 - 20], [x0 + 26, -A.h / 2 - 20], [x0 + 86, A.h / 2 + 60], [x0 + 40, A.h / 2 + 60]], 'rgba(255,236,200,.10)'); } }
    for (const r of this.rings) this.disc(g, r.x, r.y, r.r, r.c === '#fff' ? `rgba(255,255,255,${r.life * .8})` : r.c + (Math.round(clamp(r.life, 0, 1) * 200).toString(16).padStart(2, '0')), 2);
    if (rush && !rm) { const tg = artOn ? this.art.tg : this.sup.tg || this.p, pr = this.proj(tg.x, tg.y, 24), t = this.t; if (!d3) { g.fillStyle = artOn ? (this.art.a.dark || 'rgba(10,6,22,.8)') : 'rgba(26,2,4,.78)'; g.fillRect(-8, -8, W + 16, H + 16); } g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const a = i / 40 * 6.283 + (i % 5) * .13, r0 = 26 + (i * 37 + t * 520) % 150, r1 = r0 + 30 + (i % 4) * 16; g.strokeStyle = i % 3 ? (artOn ? `rgba(${this.art.a.rgb || '255,200,90'},.5)` : 'rgba(255,90,30,.5)') : 'rgba(255,220,160,.6)'; g.lineWidth = i % 4 === 0 ? 2 : 1; g.beginPath(); g.moveTo(pr.x + Math.cos(a) * r0, pr.y + Math.sin(a) * r0 * .7); g.lineTo(pr.x + Math.cos(a) * r1, pr.y + Math.sin(a) * r1 * .7); g.stroke(); } g.globalCompositeOperation = 'source-over'; }
    const list = (rush || d3 ? [] : this.props.map(q => ({ y: q.y, d: () => this.prop(g, q) }))).concat(extra);
    list.sort((a, b) => a.y - b.y); for (const e of list) e.d();
    if (d3) G3.end(this);
    g.globalCompositeOperation = 'lighter'; for (const q of this.slashes) { const pr = this.proj(q.x, q.y, q.h || 26), L = (q.big ? 46 : 28) * pr.s * (1.2 - q.life * 2), cx = Math.cos(q.a), cy = Math.sin(q.a) * .6; g.strokeStyle = `rgba(255,246,214,${Math.min(1, q.life * 8)})`; g.lineWidth = q.big ? 3 : 2; g.beginPath(); g.moveTo(pr.x - cx * L, pr.y - cy * L); g.lineTo(pr.x + cx * L, pr.y + cy * L); g.stroke(); g.lineWidth = 1; g.strokeStyle = '#fff'; g.stroke(); } g.globalCompositeOperation = 'source-over';
    if (this.lines.length) { g.globalCompositeOperation = 'lighter'; for (const l of this.lines) { const a0 = this.proj(l.x0, l.y0, 24), a1 = this.proj(l.x1, l.y1, 24), al = Math.min(1, l.life * 4); g.strokeStyle = `rgba(${this.art ? this.art.a.rgb || '255,200,90' : '255,200,90'},${al * .6})`; g.lineWidth = 5; g.beginPath(); g.moveTo(a0.x, a0.y); g.lineTo(a1.x, a1.y); g.stroke(); g.strokeStyle = `rgba(255,255,255,${al})`; g.lineWidth = 1.5; g.stroke(); } g.globalCompositeOperation = 'source-over'; }
    if (this.fin && !rm) { const F0 = this.fin, pr = this.proj(F0.x, F0.y), k = Math.min(1, F0.t / .12), fade = Math.max(0, 1 - F0.t / 1.1), wd = (16 + 26 * k) * pr.s * fade; g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) { const ww = wd * (1 - i * .22), gr = g.createLinearGradient(0, pr.y, 0, -10); gr.addColorStop(0, ['rgba(255,80,20,.55)', 'rgba(255,140,40,.6)', 'rgba(255,210,110,.7)', 'rgba(255,250,220,.9)'][i]); gr.addColorStop(1, 'rgba(255,80,20,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(pr.x - ww, pr.y); for (let y = pr.y; y > -10; y -= 12) g.lineTo(pr.x - ww * (.8 + .2 * Math.sin(y * .2 + this.t * 30 + i)), y); for (let y = -10; y < pr.y; y += 12) g.lineTo(pr.x + ww * (.8 + .2 * Math.sin(y * .23 + this.t * 26 + i)), y); g.lineTo(pr.x + ww, pr.y); g.fill(); }
      g.globalCompositeOperation = 'source-over'; }
    for (const q of this.parts) { const pr = this.proj(q.x, q.y, q.h); g.fillStyle = q.c; const z = Math.max(1, Math.round(pr.s * 1.6)); g.fillRect(Math.round(pr.x), Math.round(pr.y), z, z); }
    // air: petals in the valley, embers at dusk and at the furnace, lantern motes in the ring
    if (!rm) { const t = this.t, n = bg === 'keep' ? 10 : 22; for (let i = 0; i < n; i++) { const up = bg === 'ring' || bg === 'furnace' || bg === 'ford', px = ((i * 71.3 + t * (12 + i % 5 * 4) - c.x * (.4 + i % 3 * .3)) % (W + 20) + W + 20) % (W + 20) - 10, yy = ((i * 37.7 + t * (up ? -(9 + i % 4 * 5) : 7 + i % 4 * 4)) % (H - 20) + H - 20) % (H - 20) + 10 + Math.sin(t * 1.3 + i) * 4;
        g.fillStyle = bg === 'ring' ? 'rgba(255,190,100,.55)' : bg === 'furnace' ? 'rgba(255,140,50,.7)' : bg === 'ford' ? 'rgba(255,200,120,.5)' : bg === 'keep' ? 'rgba(255,255,255,.45)' : ['rgba(255,236,244,.7)', 'rgba(255,224,120,.6)', 'rgba(220,255,200,.5)'][i % 3]; g.fillRect(Math.round(px), Math.round(yy), i % 4 === 0 ? 2 : 1, 1); } }
    g.restore();
  },
  render(g) {
    const def = this.def, p = this.p, t = this.t, rm = Settings.d.reduce;
    g.fillStyle = '#07050a'; g.fillRect(0, 0, W, H);
    if (this.cine) return this.renderCine(g);
    const ex = [];
    // ground marks first (far depth in the sorted list, so fighters sit on top)
    ex.push({ y: -1e6, d: () => { for (const f of this.foes) if (f.st === 'wind') { const w = f.mode === 'charge' ? f.K.wind + .15 : f.second ? .3 : f.K.wind, k = Math.min(1, f.t / w), col = `rgba(255,60,40,${.2 + k * .45})`;
        if (f.mode === 'sweep') this.disc(g, f.x, f.y, (f.K.reach + 6) * k, col); else { const L = (f.mode === 'charge' ? 115 : f.K.reach + 10) * k, wd = (f.K.wide || 12) / 2, nx = -f.ay * wd, ny = f.ax * wd; this.poly(g, [[f.x + nx, f.y + ny], [f.x + f.ax * L + nx, f.y + f.ay * L + ny], [f.x + f.ax * L - nx, f.y + f.ay * L - ny], [f.x - nx, f.y - ny]], col); } }
      if (p.open > 0) this.disc(g, p.x, p.y, 16, 'rgba(255,224,138,.9)', 2); if (p.fury >= 100 && !rm) this.disc(g, p.x, p.y, 20 + Math.sin(t * 9) * 2, 'rgba(255,120,40,.55)', 2); } });
    for (const q of p.trail) ex.push({ y: q.y - .1, d: () => { if (this.g3) return G3.glow(q.x, 24, q.y, 22, [1, .8, .5], q.life * 1.6); const pr = this.proj(q.x, q.y), sh = p.sheet, fh = sh.fh || 16, sc = this.K * pr.s; g.globalAlpha = Math.min(1, q.life * 2.2) * .5; g.globalCompositeOperation = 'lighter'; g.drawImage(sh, 0, 3 * fh, 16, fh, pr.x - 8 * sc, pr.y - fh * sc, 16 * sc, fh * sc); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; } });
    for (const f of this.foes) ex.push({ y: f.y, d: () => this.fighter(g, f, { foe: 1, id: f.id, cape: (CAST[f.id].look().cape) || null, boss: this.foes.length === 1, blade: f.K.blade, aura: f.K.blink ? 1 : 0, auraC: 'rgba(255,244,200,.22)', auraG: 'rgba(255,240,190,.2)' }) });
    for (const a of this.allies) ex.push({ y: a.y, d: () => this.fighter(g, a, { blade: 1, id: a.id }) });
    const furyA = p.fury >= 100 || this.sup ? 2 + p.rage : p.rage > 0 ? p.rage * .6 + p.fury / 100 : p.fury > 60 ? .6 : 0;
    ex.push({ y: p.y + .1, d: () => this.fighter(g, p, { blade: p.blade, aura: furyA, id: (this.def.hero && this.def.hero.id) || 'kael', cape: this.def.hero && this.def.hero.id ? '#5a3aa8' : null }) });
    this.scene(g, ex);
    // screen FX
    if (this.impact > 0 && !rm) { g.fillStyle = `rgba(255,255,255,${Math.min(.85, this.impact * 5)})`; g.fillRect(0, 0, W, H); const pr = this.proj(p.x, p.y, 20); g.strokeStyle = 'rgba(20,10,10,.55)'; g.lineWidth = 1; for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283 + t, r0 = 40 + (i % 3) * 14; g.beginPath(); g.moveTo(pr.x + Math.cos(a) * r0, pr.y + Math.sin(a) * r0 * .7); g.lineTo(pr.x + Math.cos(a) * 320, pr.y + Math.sin(a) * 320 * .7); g.stroke(); } }
    if (this.slow > 0) { g.fillStyle = 'rgba(255,224,138,.10)'; g.fillRect(0, 0, W, H); }
    if (this.fin && this.fin.t < .1 && !rm && !this.g3) { g.globalCompositeOperation = 'difference'; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; }
    if ((this.sup && this.sup.t >= .95) || (this.art && this.art.t > 1.9)) { g.fillStyle = '#07050a'; g.fillRect(0, 0, W, 10); g.fillRect(0, H - 10, W, 10); }
    if (p.fury > 40 && !rm) { const fk = Math.pow((p.fury - 40) / 60, 2), full = p.fury >= 100, gr = g.createRadialGradient(W / 2, H / 2, H * (.42 - fk * .1), W / 2, H / 2, W * .72); gr.addColorStop(0, 'rgba(160,20,10,0)'); gr.addColorStop(1, `rgba(170,24,10,${fk * (.32 + (full ? Math.sin(t * 8.5) * .1 : 0))})`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      if (full) { g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const side = i % 2, ph = (t * (.5 + (i % 5) * .13) + i * .31) % 1, x = side ? W - 2 - (i * 7 % 22) : 2 + (i * 7 % 22), y = H - ph * H; g.fillStyle = `rgba(255,${110 + (i % 3) * 40},40,${.5 * (1 - ph)})`; g.fillRect(x, y, 2, 3 + (i % 3)); } g.globalCompositeOperation = 'source-over'; } }
    if (def.doomed) { g.fillStyle = `rgba(0,0,0,${clamp(this.t / (def.doomed + 1.6), 0, 1) * .35})`; g.fillRect(0, 0, W, H); }
    this.hud(g);
    if (this.sup) this.renderSuper(g);
    if (this.art && this.art.t < 1.9) this.renderArt(g);
    const big = (s, c, y, k) => { if (!s) return; const bx = Math.round(W / 2 - ptextW(s, k || 2) / 2); ptext(g, s, bx + 1, y + 1, '#120a0e', k || 2); ptext(g, s, bx, y, c, k || 2); };
    if (this.phase === 'intro') { g.fillStyle = 'rgba(8,4,6,.62)'; g.fillRect(0, H / 2 - 24, W, 44); g.fillStyle = '#c8a050'; g.fillRect(0, H / 2 - 24, W, 1); g.fillRect(0, H / 2 + 19, W, 1); big(def.title, '#ffe08a', H / 2 - 17); if (def.sub) ptext(g, def.sub, Math.round(W / 2 - ptextW(def.sub) / 2), H / 2 + 4, PAL.cream); }
    else if (this.phase === 'win') big(def.winText || 'DOWN!', '#ffe08a', 40, W > 300 && (def.winText || 'DOWN!').length < 14 ? 3 : 2);
    else if (this.phase === 'lose') big(def.doomed ? '' : 'KAEL IS DOWN', '#ff5a4a', 40);
    else if (this.msgT > 0 && !this.sup) big(this.msg, this.msg === 'FURY' ? '#ff7a30' : '#ffe08a', 40, this.msgT > 1.1 && ptextW(this.msg, 3) < W - 8 ? 3 : 2);
  },
  hud(g) {
    const p = this.p, t = this.t, bw = Math.min(104, Math.floor(W / 2) - 30), live = this.foes.filter(f => f.st !== 'down');
    const bar = (x, y, w, v, c1, c2, flip) => { g.fillStyle = '#0c0808'; g.fillRect(x - 1, y - 1, w + 2, 7); g.fillStyle = '#3a2a24'; g.fillRect(x, y, w, 5); const vw = Math.round(w * clamp(v, 0, 1)); g.fillStyle = c1; g.fillRect(flip ? x + w - vw : x, y, vw, 5); g.fillStyle = c2; g.fillRect(flip ? x + w - vw : x, y, vw, 1); g.fillStyle = '#c8a050'; g.fillRect(x - 1, y + 6, w + 2, 1); };
    g.fillStyle = '#0c0808'; g.fillRect(2, 2, 22, 22); g.drawImage(this.pb, 4, 4, 24, 24, 3, 3, 20, 20); g.strokeStyle = '#c8a050'; g.lineWidth = 1; g.strokeRect(2.5, 2.5, 21, 21);
    bar(27, 4, bw, p.hp / p.max, p.hp / p.max < .34 ? '#c8452e' : '#ffb35a', '#ffe0a0'); ptext(g, 'KAEL', 27, 14, PAL.cream);
    const full = p.fury >= 100; bar(27 + 22, 14, bw - 22, p.fury / 100, full ? (Math.floor(t * 8) % 2 ? '#ff5a2a' : '#ffb040') : '#a83a1e', '#ffb080');
    if (full && this.phase === 'fight' && !this.sup) { const s = Input.device === 'kb' ? 'HOLD E: ELEVEN' : 'HOLD A: ELEVEN'; ptext(g, s, 27, 24, Math.floor(t * 6) % 2 ? '#ffb040' : '#fff0b0'); }
    const boss = this.foes.length === 1 ? this.foes[0] : null, tot = this.foes.reduce((a, f) => a + Math.max(0, f.hp), 0) / Math.max(1, this.foes.reduce((a, f) => a + f.max, 0));
    const nm = (boss ? boss.name : live.length ? (this.def.foeName || live[0].name) + (live.length > 1 ? ' x' + live.length : '') : '').toUpperCase();
    if (boss) { if (!boss.bust) boss.bust = World.bustFor(boss.id); g.fillStyle = '#0c0808'; g.fillRect(W - 24, 2, 22, 22); g.drawImage(boss.bust, 4, 4, 24, 24, W - 23, 3, 20, 20); g.strokeStyle = '#c8a050'; g.strokeRect(W - 23.5, 2.5, 21, 21); }
    const rx = boss ? W - 27 - bw : W - 4 - bw; bar(rx, 4, bw, boss ? boss.hp / boss.max : tot, '#c8452e', '#f08a70', true); ptext(g, nm, rx + bw - ptextW(nm), 14, '#ff9a7a');
    if (this.hitsT > 0 && this.hitsN > 1) { const s = this.hitsN + ' HITS'; ptext(g, s, W - 6 - ptextW(s, 2) + 1, 31, '#120a0e', 2); ptext(g, s, W - 6 - ptextW(s, 2), 30, this.hitsN > 7 ? '#ff7a30' : '#ffe08a', 2); }
    if (this.vcur && (this.phase === 'fight' || this.phase === 'win') && !(this.sup && this.sup.t < .95) && !this.art) { const v = this.vcur, lines = wrapP(v.t, W - 20), a = Math.min(1, (v.max - v.life) * 5, v.life * 3), y0 = H - 6 - lines.length * 9 - (this.tipT > 0 ? 11 : 0); g.globalAlpha = Math.max(0, a); g.fillStyle = 'rgba(7,5,10,.62)'; g.fillRect(0, y0 - 3, W, lines.length * 9 + 5); g.fillStyle = '#c8a050'; g.fillRect(0, y0 - 3, W, 1); lines.forEach((ln, i) => ptext(g, ln, Math.round(W / 2 - ptextW(ln) / 2), y0 + i * 9, '#fff6dc')); g.globalAlpha = 1; }
    if (this.tipT > 0 && this.phase === 'fight' && !this.art && !this.sup) { const k = Input.device === 'kb', tip = W > 300 ? (k ? 'E' : 'A') + ' STRIKE   ' + (k ? 'X' : 'B') + ' DODGE THROUGH THE RED' : (k ? 'E' : 'A') + ' STRIKE  ' + (k ? 'X' : 'B') + ' DODGE'; g.fillStyle = 'rgba(12,8,10,.8)'; g.fillRect(0, H - 11, W, 11); ptext(g, tip, Math.max(3, Math.round(W / 2 - ptextW(tip) / 2)), H - 8, '#f3e3c3'); }
  },
  renderSuper(g) {
    const s = this.sup, t = s.t;
    if (t < 0.95) { const k = Math.min(1, t / .18), bh = Math.round(H * .34), y0 = Math.round(H * .3), hh = Math.round(bh * k), yy = y0 + Math.round((bh - hh) / 2);
      g.fillStyle = 'rgba(6,2,4,.72)'; g.fillRect(0, 0, W, H); g.fillStyle = '#1a0606'; g.fillRect(0, yy, W, hh); g.fillStyle = '#ff5a2a'; g.fillRect(0, yy, W, 2); g.fillRect(0, yy + hh - 2, W, 2);
      if (k >= 1) { { // his eyes, drawn big: brows down, the furnace in both of them
          const L = playerLook(), sk = L.skin, gold = this.def.hero && this.def.hero.id, cxm = Math.round(W / 2 + (1 - Math.min(1, (t - .18) / .2)) * 40), u = Math.max(3, Math.floor(bh / 15)), R = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(cxm + x * u, y0 + 2 + y * u, w * u, h * u); }, rows = Math.floor((bh - 4) / u);
          g.save(); g.beginPath(); g.rect(0, y0 + 2, W, bh - 4); g.clip(); R(-40, 0, 80, rows, sk); R(-40, 0, 80, 2, shade(gold ? '#e9cf7a' : L.hair, .8)); R(-40, rows - 3, 80, 3, shade(sk, .86)); R(-2, 3, 4, rows, shade(sk, .9));
          for (const sd of [-1, 1]) { const ex = sd * 11; R(ex - 7, 6, 14, 6, '#1a0e0c'); R(ex - 6, 7, 12, 4, '#f0e8dc'); R(ex - 2 - sd, 7, 5, 4, gold ? '#d8a830' : '#5a3418'); R(ex - 1 - sd, 8, 3, 3, '#140a08'); R(ex - sd, 8, 1, 1, '#fff'); R(ex - 1 - sd, 10, 3, 1, Math.floor(t * 20) % 2 ? '#ff8a30' : '#ffd070');
            for (let i = 0; i < 8; i++) R(ex + sd * (7 - i * 2) - 1, 2 + Math.floor(i * .55), 2, 3, '#1a0e0c'); R(ex - 7, 12, 14, 1, shade(sk, .78)); R(ex + sd * 4, 13, 4, 1, '#5a4a44'); }
          g.restore(); }
        g.fillStyle = 'rgba(200,40,10,.22)'; g.fillRect(0, y0 + 2, W, bh - 4); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,90,30,${.16 + Math.sin(t * 30) * .06})`; g.fillRect(0, y0 + 2, W, bh - 4); g.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 14; i++) { g.fillStyle = 'rgba(255,220,180,.5)'; g.fillRect((i * 47 + t * 900) % (W + 40) - 20, y0 + 4 + (i * 13) % (bh - 8), 26, 1); }
        const w = 'ELEVEN', sc = W > 300 ? 4 : 3; ptext(g, w, Math.round(W / 2 - ptextW(w, sc) / 2) + 2, Math.round(H * .7) + 2, '#120a0e', sc); ptext(g, w, Math.round(W / 2 - ptextW(w, sc) / 2), Math.round(H * .7), '#ff7a30', sc); const c2 = 'ONE FOR EVERY SECOND THE DOORS STOOD OPEN', c3 = W > 300 ? c2 : 'ONE FOR EVERY SECOND'; if (t > .45) ptext(g, c3, Math.round(W / 2 - ptextW(c3) / 2), Math.round(H * .7) + sc * 6 + 4, '#f3e3c3'); } }
    else if (s.word) { const fin = s.n >= 11, sc = fin ? (W > 300 ? 5 : 4) : 3, a = Math.max(0, 1 - (s.wt || 0) * (fin ? 1.2 : 4)); if (a > 0) { g.globalAlpha = a; const x = fin ? Math.round(W / 2 - ptextW(s.word, sc) / 2) : (s.n % 2 ? 10 : W - 10 - ptextW(s.word, sc)), y = fin ? Math.round(H * .4) : 52 + (s.n % 3) * 16; ptext(g, s.word, x + 2, y + 2, '#120a0e', sc); ptext(g, s.word, x, y, fin ? '#fff0b0' : '#ff7a30', sc); g.globalAlpha = 1; } }
  },
  // the cut-in: two slanted panels. One is the memory, one is him. Then the name of the blow and the line it carries.
  renderArt(g) {
    const A = this.art, a = A.a, t = A.t, e = 1 - Math.pow(1 - Math.min(1, t / .22), 3), out = Math.max(0, (t - 1.72) / .18), wide = W > 300, rgb = a.rgb || '255,200,90', rm = Settings.d.reduce;
    g.fillStyle = `rgba(6,4,10,${.82 * (1 - out)})`; g.fillRect(0, 0, W, H); if (out > 0) g.globalAlpha = 1 - out;
    const quad = (pts, draw, edge) => { g.save(); g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.clip(); draw(); g.restore(); g.strokeStyle = '#fff6dc'; g.lineWidth = 2; g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.stroke(); g.strokeStyle = edge; g.lineWidth = 1; g.stroke(); };
    // memory panel
    const sl = wide ? 26 : 12, dxA = -(1 - e) * W, dxB = (1 - e) * W, y0 = 16, y1 = wide ? H - 44 : Math.round(H * .46), xm = wide ? Math.round(W * .56) : W - 6;
    if (!Panels.c) [Panels.c, Panels.g] = mk(320, 180);
    const pg = Panels.g; pg.globalAlpha = 1; pg.globalCompositeOperation = 'source-over'; pg.fillStyle = '#07050a'; pg.fillRect(0, 0, 320, 180); Panels.narrow = false; if (PANELS[a.panel]) PANELS[a.panel](pg, 6 + t, a.stage || 0, 6 + t);
    quad([[6 + dxA, y0], [xm + sl + dxA, y0], [xm - sl + dxA, y1], [6 + dxA, y1]], () => { const sc = Math.max((xm + sl) / 320, (y1 - y0) / 180) * 1.12, pw = 320 * sc, ph = 180 * sc; g.imageSmoothingEnabled = false; g.drawImage(Panels.c, 6 + dxA + (xm - pw) / 2 - (rm ? 0 : t * 5), y0 + (y1 - y0 - ph) / 2, pw, ph); g.fillStyle = `rgba(${rgb},.14)`; g.fillRect(0, 0, W, H); for (let i = 0; i < 5; i++) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, y0 + i * 2 + ((t * 40) % 8), W, 1); } }, `rgb(${rgb})`);
    // him
    const bx0 = wide ? xm + sl + 6 : 6, by0 = wide ? y0 : y1 + 6, by1 = wide ? y1 : H - 50;
    quad([[bx0 + dxB, by0], [W - 6 + dxB, by0], [W - 6 + dxB, by1], [bx0 - (wide ? sl * 2 : 0) + dxB, by1]], () => { const gr = g.createLinearGradient(0, by0, 0, by1); gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(1, '#1a0606'); g.fillStyle = gr; g.fillRect(0, 0, W * 2, H);
      if (!rm) for (let i = 0; i < 18; i++) { g.fillStyle = i % 3 ? 'rgba(255,255,255,.35)' : 'rgba(20,6,6,.4)'; g.fillRect(((i * 53 - t * 700) % (W + 60) + W + 60) % (W + 60) - 30 + dxB, by0 + (i * 17) % (by1 - by0), 30 + i % 4 * 12, i % 4 ? 1 : 2); }
      const k = Math.max(3, Math.ceil((by1 - by0) / 26)), cx = (bx0 + W - 6) / 2 + dxB - (wide ? sl * .4 : 0) + (rm ? 0 : (1 - Math.min(1, t / .5)) * 14); g.imageSmoothingEnabled = false; g.drawImage(this.pb, 3, 3, 26, 29, Math.round(cx - 13 * k), Math.round(by1 - 27 * k), 26 * k, 29 * k);
      g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,90,30,${.16 + (rm ? 0 : Math.sin(t * 26) * .05)})`; g.fillRect(0, by0, W * 2, by1 - by0); g.globalCompositeOperation = 'source-over'; }, '#ff7a30');
    // words
    const nsc = wide ? 3 : 2, ny = wide ? H - 40 : H - 46, nx = Math.round(8 - (1 - e) * 60);
    g.save(); g.translate(0, ny); g.rotate(wide ? -0.035 : 0); g.fillStyle = '#07050a'; g.fillRect(-10, -4, W + 20, nsc * 5 + 8); g.fillStyle = `rgb(${rgb})`; g.fillRect(-10, -4, W + 20, 1); g.fillRect(-10, nsc * 5 + 3, W + 20, 1);
    ptext(g, a.name, nx + 2, 2, '#07050a', nsc); ptext(g, a.name, nx, 0, '#fff6dc', nsc); const tag = 'MEMORY'; ptext(g, tag, W - 8 - ptextW(tag), wide ? 6 : 2, `rgb(${rgb})`); g.restore();
    if (t > .3) { const lines = wrapP(a.line, W - 16), ch = Math.floor((t - .3) * 95); let used = 0; lines.forEach((ln, i) => { const part = ln.slice(0, Math.max(0, ch - used)); used += ln.length; ptext(g, part, Math.round(W / 2 - ptextW(ln) / 2), H - (wide ? 20 : 26) + i * 8 + (lines.length > 1 && wide ? -4 : 0), '#f3e3c3'); }); }
    g.globalAlpha = 1; if (t < .1 && !rm) { g.fillStyle = `rgba(255,255,255,${1 - t * 10})`; g.fillRect(0, 0, W, H); }
  },
  renderCine(g) {
    const c = this.cine, s = c.shots[c.i], rm = Settings.d.reduce; if (s.black) { g.fillStyle = '#050307'; g.fillRect(0, 0, W, H); }
    const ex = c.acts.map(o => ({ y: o.y, d: () => this.fighter(g, { x: o.x, y: o.y, fx: o.fx || 0, fy: o.fy === undefined ? 1 : o.fy, sheet: o.sheet, anim: o.anim, sc: o.sc, st: o.st || 'idle', t: o.t || 0, idx: o.k || 0, swing: o.swing ? (c.t % .5 < .18 ? .18 - (c.t % .5) : 0) : 0, ax: o.fx || 0, ay: o.fy || 0, combo: 1 + (Math.floor(c.t / .5 + (o.k || 0)) % 3) }, { run: !!o.b, id: o.id, blade: o.blade, aura: o.aura || 0, cape: CAST[o.id].look().cape || null }) }));
    if (!s.black) this.scene(g, ex); else this.g3 = false;
    if (s.bolt && !rm) { // rage as weather: red-gold lightning
      const sd = rng(Math.floor(c.t * 14) * 97 + c.i * 13 + 5), on = sd() < .75; if (on) { g.globalCompositeOperation = 'lighter'; for (let b = 0; b < (s.bolt > 1 ? 4 : 2); b++) { let x = sd() * W, y = 12; const pts = [[x, y]]; while (y < H - 14 - sd() * 60) { y += 8 + sd() * 16; x += (sd() - .5) * 44; pts.push([x, y]); if (sd() < .2) { g.strokeStyle = 'rgba(255,150,60,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (sd() - .5) * 60, y + 10 + sd() * 26); g.stroke(); } }
          for (const [wd, col] of [[5, 'rgba(255,70,20,.35)'], [2.5, 'rgba(255,170,80,.7)'], [1, '#fff6dc']]) { g.strokeStyle = col; g.lineWidth = wd; g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.stroke(); } }
        g.fillStyle = 'rgba(255,60,20,.08)'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; } }
    if (s.speed && !rm) { g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283 + i, r0 = 50 + (i * 17 + c.t * 400) % 70; g.beginPath(); g.moveTo(W / 2 + Math.cos(a) * r0, H / 2 + Math.sin(a) * r0 * .6); g.lineTo(W / 2 + Math.cos(a) * (r0 + 40), H / 2 + Math.sin(a) * (r0 + 40) * .6); g.stroke(); } }
    if (s.tint) { g.fillStyle = s.tint; g.fillRect(0, 0, W, H); }
    if (this.impact > 0 && !rm) { g.fillStyle = `rgba(255,255,255,${Math.min(.9, this.impact * 4.5)})`; g.fillRect(0, 0, W, H); }
    g.fillStyle = '#07050a'; g.fillRect(0, 0, W, 14); g.fillRect(0, H - 14, W, 14);
    const big = (str, col, y, k) => { const bx = Math.round(W / 2 - ptextW(str, k) / 2); ptext(g, str, bx + 1, y + 1, '#120a0e', k); ptext(g, str, bx, y, col, k); };
    if (s.count) { const idx = Math.min(s.count - 1, Math.floor(Math.pow(Math.min(1, c.t / (s.d * .92)), 1.25) * s.count)), w = ELEVEN[idx], sc = W > 300 ? 5 : 4, pop = Math.max(0, 1 - (c.t - (c.ct || 0)) * 7); ptext(g, w, Math.round(W / 2 - ptextW(w, sc) / 2) + 2, Math.round(H * .3) + 2, '#120a0e', sc); ptext(g, w, Math.round(W / 2 - ptextW(w, sc) / 2), Math.round(H * .3), idx === s.count - 1 ? '#fff0b0' : '#ff7a30', sc); if (pop > 0 && !rm) { g.fillStyle = `rgba(255,120,60,${pop * .35})`; g.fillRect(0, 0, W, H); } }
    if (s.credit) { const a = Math.min(1, c.t * 2.5, (s.d - c.t) * 2.5), cw = s.credit.split('').join(' '), x = W > 300 ? 14 : Math.max(4, Math.round(W / 2 - ptextW(cw) / 2)); g.globalAlpha = Math.max(0, a) * .55; g.fillStyle = '#07050a'; g.fillRect(x - 4, 17, ptextW(cw) + 8, 14); g.globalAlpha = Math.max(0, a); ptext(g, cw, x + 1, 21, '#120a0e'); ptext(g, cw, x, 20, '#e8c25a'); g.fillStyle = '#e8c25a'; g.fillRect(x, 28, Math.min(W - x * 2, Math.round(ptextW(cw) * Math.min(1, c.t * 1.5))), 1); g.globalAlpha = 1; }
    if (s.big) big(s.big, s.bigC || '#fff6dc', Math.round(H * (s.acts && s.acts.length && !s.black ? .16 : .36)), ptextW(s.big, 3) < W - 8 ? 3 : 2);
    if (s.sub2) { ptext(g, s.sub2, Math.round(W / 2 - ptextW(s.sub2) / 2), Math.round(H * .36) + 24, '#e8c25a'); }
    if (s.cap) { const lines = wrapP(s.cap, W - 24), a = Math.min(1, c.t * 4); g.globalAlpha = a; lines.forEach((ln, i) => { const y = H - 30 - (lines.length - 1 - i) * 9; g.fillStyle = 'rgba(7,5,10,.6)'; g.fillRect(Math.round(W / 2 - ptextW(ln) / 2) - 3, y - 2, ptextW(ln) + 6, 9); ptext(g, ln, Math.round(W / 2 - ptextW(ln) / 2), y, '#fff6dc'); }); g.globalAlpha = 1; }
    if (c.i === 0 && c.t < 2.5) { const h = this.def.cineOnly ? (Input.device === 'kb' ? 'ANY KEY: SKIP' : 'TAP: SKIP') : Input.device === 'kb' ? 'E: NEXT   M: SKIP' : 'TAP: NEXT'; ptext(g, h, W - 4 - ptextW(h), H - 10, '#6a6470'); }
  }
};
function wrapP(s, maxW) { const out = []; let cur = ''; for (const w of s.split(' ')) { const t = cur ? cur + ' ' + w : w; if (ptextW(t) > maxW && cur) { out.push(cur); cur = w; } else cur = t; } if (cur) out.push(cur); return out; }
