// ============================================================
// systems/brawl — real-time melee. The foundation for every fight in the game.
// Controls: move · A strike (3-hit chain) · B dodge (brief invulnerability).
// Dodge THROUGH a swing and time slows: an OPENING — your next hits land harder.
// Foes telegraph on the ground before they swing. Any number of foes can be in the ring.
// def: { title, sub, foes: [{ id, name, kind, hp }], taunt: {foeIndex: [lines]} }
// ============================================================
const FOE_KINDS = {
  jab: { spd: 36, wind: 0.6, reach: 26, dmg: 1, rec: 0.9, cd: [0.7, 1.5], soft: 1 },
  quick: { spd: 54, wind: 0.42, reach: 24, dmg: 1, rec: 0.65, cd: [0.5, 1.2] },
  heavy: { spd: 28, wind: 0.85, reach: 38, dmg: 2, rec: 1.2, cd: [0.8, 1.4], armor: 1, wide: 16 },
  baton: { spd: 40, wind: 0.6, reach: 30, dmg: 1, rec: 0.95, cd: [0.6, 1.2], sweep: 1, charge: 1 },
  boss: { spd: 46, wind: 0.46, reach: 28, dmg: 1, rec: 0.85, cd: [0.45, 1.0], double: 1 }
};
const Brawl = {
  active: false, def: null, onEnd: null, t: 0, p: null, foes: [], parts: [], freeze: 0, slow: 0, shake: 0, phase: 'intro', pt: 0, msg: '', msgT: 0, crowd: null,
  geo() { return { cx: W / 2, cy: H / 2 + 14, rx: Math.min(W / 2 - 12, 132), ry: 50 }; },
  start(def, onEnd) {
    const g = this.geo();
    Object.assign(this, { def, onEnd, active: true, t: 0, parts: [], freeze: 0, slow: 0, shake: 0, phase: 'intro', pt: 0, msg: '', msgT: 0, token: null });
    this.p = { x: g.cx - g.rx * .55, y: g.cy, dir: 3, hp: 6, max: 6, st: 'idle', t: 0, combo: 0, comboT: 0, inv: 0, dcd: 0, open: 0, anim: 0, hit: false, kx: 0, ky: 0 };
    this.foes = def.foes.map((f, i) => { const K = FOE_KINDS[f.kind]; return Object.assign({ x: g.cx + g.rx * .5, y: g.cy + (i - (def.foes.length - 1) / 2) * 34, dir: 2, max: f.hp, st: 'approach', t: 0, cd: 1 + i * .8, anim: 0, kx: 0, ky: 0, sheet: World.sheetFor(f.id), K, said: 0, flash: 0 }, f); });
    if (!this.crowd) this.crowd = ['bao', 'pell', 'juno', 'marrow', 'fen', 'orin', 'kit', 'hollis', 'tavi', 'c2', 'c3', 'c4'].map(id => World.sheetFor(id));
    Sound.music('work'); Input.consume(); HUD.dirty = true;
  },
  end(win) { this.active = false; Sound.music(MAPS[G.mapId].music); Input.consume(); HUD.dirty = true; const cb = this.onEnd; this.onEnd = null; cb && cb(win); },
  say(t) { this.msg = t; this.msgT = 1.1; },
  clampRing(o) { const g = this.geo(), dx = (o.x - g.cx) / (g.rx - 8), dy = (o.y - g.cy) / (g.ry - 4), d = Math.hypot(dx, dy); if (d > 1) { o.x = g.cx + dx / d * (g.rx - 8); o.y = g.cy + dy / d * (g.ry - 4); } },
  spark(x, y, c, n) { for (let i = 0; i < (n || 6); i++) { const a = Math.random() * 6.28, v = 30 + Math.random() * 70; this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, life: .25 + Math.random() * .2, c }); } },
  nearest() { let b = null, bd = 1e9; for (const f of this.foes) if (f.st !== 'down') { const d = Math.hypot(f.x - this.p.x, f.y - this.p.y); if (d < bd) { bd = d; b = f; } } return b; },
  hurtPlayer(f, dmg, ax, ay) {
    const p = this.p;
    if (p.inv > 0) { if (p.st === 'dodge' && p.open <= 0.9) { p.open = 1.6; this.slow = 0.45; this.say('OPENING!'); Sound.play('stage'); G.flags.brawlOpen = 1; } return; }
    p.hp -= dmg; p.st = 'hurt'; p.t = 0; p.inv = 0.8; p.kx = ax * 150; p.ky = ay * 150; p.combo = 0; this.freeze = 0.09; this.shake = 0.3; Sound.play('hit'); this.spark(p.x, p.y - 12, '#ff5a4a', 8);
    if (p.hp <= 0) { p.st = 'down'; this.phase = 'lose'; this.pt = 0; }
  },
  hitFoe(f, dmg, ax, ay, big) {
    const crit = this.p.open > 0;
    if (f.guardT > 0 && !crit) { f.flash = 0.06; Sound.play('deny'); this.spark(f.x, f.y - 12, '#8a94a4', 4); this.p.kx = -ax * 120; this.p.ky = -ay * 120; if (!f.blk) { f.blk = 1; f.bark = { t: 'BLOCKED', life: .7 }; } return; }
    f.hp -= dmg; f.flash = 0.12; f.kx = ax * (big ? 210 : 90); f.ky = ay * (big ? 210 : 90); this.freeze = big ? 0.1 : 0.05; this.shake = big ? 0.3 : 0.12; Sound.play(big ? 'hit' : 'clink'); this.spark(f.x, f.y - 12, big ? '#ffe08a' : '#fff', big ? 10 : 5);
    if (f.hp <= 0) { f.st = 'down'; f.t = 0; if (this.token === f) this.token = null; Sound.play('rumble'); if (!this.foes.some(o => o.st !== 'down')) { this.phase = 'win'; this.pt = 0; this.slow = 0.6; } return; }
    if ((f.st !== 'wind' || f.K.soft || big) && f.st !== 'charge') { if (this.token === f) this.token = null; f.st = 'hurt'; f.t = 0; }
    f.hits = (f.hits | 0) + 1; if (f.hits >= (f.K.soft ? 5 : 3) && !crit) { f.guardT = 1.1; f.cd = 0; f.hits = 0; f.blk = 0; }
    const tl = this.def.taunt && this.def.taunt[this.foes.indexOf(f)]; if (tl && f.said < tl.length && f.hp <= f.max * (1 - (f.said + 1) / (tl.length + 1))) { f.bark = { t: tl[f.said++], life: 2.2 }; }
  },
  update(dt) {
    this.t += dt; this.msgT = Math.max(0, this.msgT - dt); this.shake = Math.max(0, this.shake - dt);
    if (this.phase === 'intro') { this.pt += dt; if (this.pt > 1.5 || (this.pt > .5 && Input.p('A'))) { this.phase = 'fight'; this.say('FIGHT!'); Sound.play('bell'); Input.consume(); } return; }
    if (this.phase === 'win' || this.phase === 'lose') { this.pt += dt; this.stepParts(dt * .5); for (const f of this.foes) f.t += dt; if (this.pt > 1.9) this.end(this.phase === 'win'); return; }
    if (this.freeze > 0) { this.freeze -= dt; return; }
    const ts = this.slow > 0 ? 0.3 : 1; this.slow = Math.max(0, this.slow - dt); const pd = dt * (this.slow > 0 ? 0.75 : 1), ed = dt * ts;
    this.updPlayer(pd); for (const f of this.foes) this.updFoe(f, ed); this.stepParts(dt);
  },
  stepParts(dt) { for (const q of this.parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 200 * dt; q.life -= dt; } this.parts = this.parts.filter(q => q.life > 0); },
  updPlayer(dt) {
    const p = this.p; p.inv = Math.max(0, p.inv - dt); p.dcd = Math.max(0, p.dcd - dt); p.open = Math.max(0, p.open - dt); p.comboT -= dt; if (p.comboT <= 0) p.combo = 0;
    p.x += p.kx * dt; p.y += p.ky * dt; p.kx *= Math.pow(.001, dt); p.ky *= Math.pow(.001, dt);
    let vx = (Input.h('right') ? 1 : 0) - (Input.h('left') ? 1 : 0), vy = (Input.h('down') ? 1 : 0) - (Input.h('up') ? 1 : 0); if (vx && vy) { vx *= .7071; vy *= .7071; }
    const face = (dx, dy) => { p.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 2 : 3) : (dy < 0 ? 1 : 0); };
    if (p.st === 'hurt') { p.t += dt; if (p.t > 0.28) p.st = 'idle'; }
    else if (p.st === 'dodge') { p.t += dt; p.x += p.dx * 200 * dt; p.y += p.dy * 200 * dt; if (p.t > 0.3) p.st = 'idle'; }
    else if (p.st === 'atk') {
      p.t += dt; const dur = p.combo === 3 ? 0.36 : 0.24; if (p.t < 0.1) { p.x += p.ax * 90 * dt; p.y += p.ay * 90 * dt; }
      if (!p.hit && p.t >= 0.07) { p.hit = true; const big = p.combo === 3, R = big ? 34 : 28; let any = false;
        for (const f of this.foes) if (f.st !== 'down') { const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy); if (d < R && (d < 10 || (dx * p.ax + dy * p.ay) / d > 0.2)) { any = true; this.hitFoe(f, (big ? 2 : 1) + (p.open > 0 ? 1 : 0), dx / (d || 1), dy / (d || 1), big || p.open > 0); } }
        if (!any) Sound.play('move'); }
      if (p.t > dur) p.st = 'idle'; else if (p.t > 0.14 && Input.p('A') && p.combo < 3) this.strike();
      if (Input.p('B') && p.dcd <= 0 && p.t > 0.1) this.dodge(vx, vy);
    } else {
      if (vx || vy) { p.x += vx * 84 * dt; p.y += vy * 84 * dt; p.anim += dt; face(vx, vy); p.st = 'move'; } else { p.st = 'idle'; p.anim = 0; }
      if (Input.p('A')) this.strike(); else if (Input.p('B') && p.dcd <= 0) this.dodge(vx, vy);
    }
    this.clampRing(p);
  },
  strike() { const p = this.p, f = this.nearest(); let ax = [0, 0, -1, 1][p.dir], ay = [1, -1, 0, 0][p.dir];
    if (f) { const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy); if (d < 64) { ax = dx / (d || 1); ay = dy / (d || 1); p.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 2 : 3) : (dy < 0 ? 1 : 0); } }
    p.st = 'atk'; p.t = 0; p.hit = false; p.ax = ax; p.ay = ay; p.combo = p.combo % 3 + 1; p.comboT = 0.7; },
  dodge(vx, vy) { const p = this.p; if (!vx && !vy) { vx = -[0, 0, -1, 1][p.dir]; vy = -[1, -1, 0, 0][p.dir]; } const d = Math.hypot(vx, vy); p.st = 'dodge'; p.t = 0; p.dx = vx / d; p.dy = vy / d; p.inv = Math.max(p.inv, 0.26); p.dcd = 0.55; Sound.play('step'); },
  updFoe(f, dt) {
    const p = this.p, K = f.K; f.flash = Math.max(0, f.flash - dt); f.guardT = Math.max(0, (f.guardT || 0) - dt); if (f.bark) { f.bark.life -= dt; if (f.bark.life <= 0) f.bark = null; }
    f.x += f.kx * dt; f.y += f.ky * dt; f.kx *= Math.pow(.002, dt); f.ky *= Math.pow(.002, dt);
    const dx = p.x - f.x, dy = p.y - f.y, d = Math.hypot(dx, dy) || 1, face = (x, y) => { f.dir = Math.abs(x) > Math.abs(y) ? (x < 0 ? 2 : 3) : (y < 0 ? 1 : 0); };
    if (f.st === 'down') { f.t += dt; return; }
    if (f.st === 'hurt') { f.t += dt; if (f.t > 0.24) { f.st = 'approach'; f.cd = Math.min(f.cd, K.soft ? 0.6 : 0.12); } }
    else if (f.st === 'approach') {
      f.cd -= dt; face(dx, dy); const want = K.reach * 0.8;
      let mx = 0, my = 0; if (d > want) { mx = dx / d; my = dy / d; } else if (d < want * 0.55) { mx = -dx / d; my = -dy / d; } else { const s = (this.foes.indexOf(f) % 2 ? 1 : -1); mx = -dy / d * .6 * s; my = dx / d * .6 * s; }
      for (const o of this.foes) if (o !== f && o.st !== 'down') { const ox = f.x - o.x, oy = f.y - o.y, od = Math.hypot(ox, oy) || 1; if (od < 26) { mx += ox / od; my += oy / od; } }
      f.x += mx * K.spd * dt; f.y += my * K.spd * dt; f.anim += dt;
      if (f.cd <= 0 && (!this.token || this.token === f) && p.st !== 'down') {
        const far = K.charge && d > 60 && Math.random() < .7;
        if (d < K.reach * 1.25 || far) { this.token = f; f.st = 'wind'; f.t = 0; f.ax = dx / d; f.ay = dy / d; f.mode = far ? 'charge' : K.sweep && Math.random() < .45 ? 'sweep' : 'strike'; f.second = false; f.hits = 0; Sound.play('huh'); }
      }
    } else if (f.st === 'wind') {
      f.t += dt; const w = f.mode === 'charge' ? K.wind + .15 : f.second ? 0.3 : K.wind;
      if (f.t >= w) {
        if (f.mode === 'charge') { f.st = 'charge'; f.t = 0; Sound.play('roar'); }
        else { f.st = 'recover'; f.t = 0; Sound.play('move');
          if (f.mode === 'sweep') { if (d < K.reach + 6) this.hurtPlayer(f, K.dmg, dx / d, dy / d); this.spark(f.x, f.y - 10, '#c8ccd4', 8); }
          else { const hx = f.x + f.ax * K.reach, hy = f.y + f.ay * K.reach; f.x += f.ax * 10; f.y += f.ay * 10;
            const t = clamp(((p.x - f.x) * f.ax + (p.y - f.y) * f.ay) / K.reach, 0, 1), qx = f.x + (hx - f.x) * t, qy = f.y + (hy - f.y) * t; if (Math.hypot(p.x - qx, p.y - qy) < (K.wide || 12)) this.hurtPlayer(f, K.dmg, f.ax, f.ay); }
          if (K.double && !f.second && f.hp < f.max * .7) { f.st = 'wind'; f.t = 0; f.second = true; f.ax = dx / d; f.ay = dy / d; } }
      }
    } else if (f.st === 'charge') {
      f.t += dt; f.x += f.ax * 230 * dt; f.y += f.ay * 230 * dt; f.anim += dt * 2; face(f.ax, f.ay);
      if (Math.hypot(p.x - f.x, p.y - f.y) < 14 && !f.hitOnce) { f.hitOnce = 1; this.hurtPlayer(f, 2, f.ax, f.ay); }
      if (f.t > 0.5) { f.st = 'recover'; f.t = -0.3; f.hitOnce = 0; }
    } else if (f.st === 'recover') { f.t += dt; if (f.t >= K.rec) { f.st = 'approach'; f.cd = K.cd[0] + Math.random() * (K.cd[1] - K.cd[0]); if (this.token === f) this.token = null; } }
    this.clampRing(f);
  },
  render(g) {
    const G0 = this.geo(), rm = Settings.d.reduce, t = this.t, p = this.p;
    const sx = this.shake > 0 && !rm ? Math.round((Math.random() - .5) * 5) : 0, sy = this.shake > 0 && !rm ? Math.round((Math.random() - .5) * 3) : 0;
    g.fillStyle = '#120c10'; g.fillRect(0, 0, W, H);
    g.save(); g.translate(sx, sy);
    if (!this.floor) { const fm = { w: 21, h: 12, theme: 'city', seed: 5, grid: Array.from({ length: 12 }, () => Array(21).fill('.')) }; const [fc, fg] = mk(336, 192); for (let ty = 0; ty < 12; ty++) for (let tx = 0; tx < 21; tx++) drawTile(fg, fm, tx, ty); this.floor = fc; }
    g.drawImage(this.floor, 0, 0);
    // chalk ring
    g.fillStyle = 'rgba(20,12,16,.45)'; g.beginPath(); g.ellipse(G0.cx, G0.cy, G0.rx, G0.ry, 0, 0, 6.3); g.fill();
    g.fillStyle = '#e8e0d0'; for (let a = 0; a < 6.283; a += 0.05) g.fillRect(Math.round(G0.cx + Math.cos(a) * G0.rx), Math.round(G0.cy + Math.sin(a) * G0.ry), 2, 1);
    g.fillStyle = '#e8b23a'; g.fillRect(G0.cx - 2, G0.cy - 2, 5, 5); for (const [a, b] of [[-5, 0], [5, 0], [0, -5], [0, 5]]) g.fillRect(G0.cx + a, G0.cy + b, 1, 1);
    // crowd, top and bottom
    const crowd = this.crowd, n = Math.floor(W / 20);
    for (let i = 0; i < n; i++) { const s = crowd[i % crowd.length], bob = rm ? 0 : Math.round(Math.abs(Math.sin(t * 3 + i * 1.3)) * 2); g.drawImage(s, 0, 0, 16, s.fh || 16, 6 + i * 20, G0.cy - G0.ry - 28 - bob, 16, s.fh || 16); }
    // telegraphs
    for (const f of this.foes) if (f.st === 'wind') { const w = f.mode === 'charge' ? f.K.wind + .15 : f.second ? .3 : f.K.wind, k = Math.min(1, f.t / w); g.fillStyle = `rgba(255,70,50,${.18 + k * .4})`;
      if (f.mode === 'sweep') { g.beginPath(); g.ellipse(f.x, f.y, (f.K.reach + 6) * k, (f.K.reach + 6) * k * .7, 0, 0, 6.3); g.fill(); }
      else { const L = f.mode === 'charge' ? 115 : f.K.reach + 10, wd = (f.K.wide || 12); g.save(); g.translate(f.x, f.y); g.rotate(Math.atan2(f.ay, f.ax)); g.fillRect(0, -wd / 2, L * k, wd); g.restore(); } }
    // fighters, sorted
    const ents = this.foes.map(f => ({ o: f, foe: 1 })).concat([{ o: p }]).sort((a, b) => a.o.y - b.o.y);
    for (const e of ents) { const o = e.o, down = o.st === 'down';
      g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(o.x, o.y + 1, 11, 4, 0, 0, 6.3); g.fill();
      const sheet = e.foe ? o.sheet : P.sheet, fh = sheet.fh || 16, mv = e.foe ? (o.st === 'approach' || o.st === 'charge') : o.st === 'move', fr = mv ? 1 + (Math.floor(o.anim * 7) % 2) : 0;
      if (down) { const k = Math.min(1, o.t * 4); g.save(); g.translate(o.x, o.y - 4); g.rotate(k * 1.45); g.globalAlpha = .9; g.drawImage(sheet, 0, 0, 16, fh, -16, -fh * 2 + 8, 32, fh * 2); g.restore(); g.globalAlpha = 1; continue; }
      let ox = 0, oy = 0; if (e.foe && o.st === 'wind' && !rm) ox = Math.round(Math.sin(t * 50) * 1.5); if (!e.foe && o.st === 'dodge') oy = -Math.round(Math.sin(o.t / .3 * Math.PI) * 6);
      if (!e.foe && o.inv > 0 && o.st !== 'dodge' && Math.floor(t * 20) % 2) continue;
      if (!e.foe && o.st === 'dodge') g.globalAlpha = .6;
      g.drawImage(sheet, fr * 16, o.dir * fh, 16, fh, Math.round(o.x - 16 + ox), Math.round(o.y - fh * 2 + 3 + oy), 32, fh * 2); g.globalAlpha = 1;
      if (e.foe && o.flash > 0) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = .7; g.drawImage(sheet, fr * 16, o.dir * fh, 16, fh, Math.round(o.x - 16), Math.round(o.y - fh * 2 + 3), 32, fh * 2); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
      if (e.foe && o.guardT > 0 && o.st !== 'wind') { g.strokeStyle = '#aab2c0'; g.lineWidth = 2; g.beginPath(); g.arc(o.x, o.y - 12, 15, -2.4, -0.7); g.stroke(); }
      if (e.foe && o.st === 'wind') ptext(g, '!', Math.round(o.x) - 2, Math.round(o.y) - fh * 2 - 8, '#ff5a4a', 2);
      if (!e.foe && o.st === 'atk' && o.t < 0.18) { const k = Math.sin(Math.min(1, o.t / 0.09) * Math.PI / 2), fx2 = Math.round(o.x + o.ax * (8 + 12 * k)), fy2 = Math.round(o.y - 14 + o.ay * (6 + 10 * k)); g.fillStyle = '#120a0e'; g.fillRect(fx2 - 3, fy2 - 3, 7, 7); g.fillStyle = '#c48a64'; g.fillRect(fx2 - 2, fy2 - 2, 5, 5); g.fillStyle = '#e0a884'; g.fillRect(fx2 - 2, fy2 - 2, 4, 1); }
      if (e.foe && o.st === 'recover' && o.t < 0.16 && o.mode === 'strike') { const fx2 = Math.round(o.x + o.ax * 16), fy2 = Math.round(o.y - 14 + o.ay * 12); g.fillStyle = '#120a0e'; g.fillRect(fx2 - 3, fy2 - 3, 7, 7); g.fillStyle = '#b07a5a'; g.fillRect(fx2 - 2, fy2 - 2, 5, 5); }
      if (!e.foe && o.st === 'atk' && o.t < 0.16) { const a = Math.atan2(o.ay, o.ax), R = o.combo === 3 ? 26 : 20; g.strokeStyle = o.open > 0 ? '#ffe08a' : '#fff'; g.lineWidth = o.combo === 3 ? 4 : 3; g.beginPath(); g.arc(o.x, o.y - 12, R, a - .9 + o.t * 3, a + .9 - o.t * 2); g.stroke(); }
      if (!e.foe && o.open > 0 && Math.floor(t * 12) % 2) { g.fillStyle = '#ffe08a'; g.fillRect(Math.round(o.x) - 9, Math.round(o.y) + 3, 18, 1); }
      if (e.foe) { const w = 22, hx = Math.round(o.x - w / 2), hy = Math.round(o.y - fh * 2 - 1); g.fillStyle = '#120a0e'; g.fillRect(hx - 1, hy - 1, w + 2, 4); g.fillStyle = '#c8452e'; g.fillRect(hx, hy, Math.max(0, Math.round(w * o.hp / o.max)), 2); }
      if (e.foe && o.bark) { const tw = ptextW(o.bark.t), bx = clamp(Math.round(o.x - tw / 2 - 3), 2, W - tw - 8), by = Math.round(o.y - fh * 2 - 18); g.fillStyle = '#120a0e'; g.fillRect(bx - 1, by - 1, tw + 8, 11); g.fillStyle = '#f3e3c3'; g.fillRect(bx, by, tw + 6, 9); ptext(g, o.bark.t, bx + 3, by + 2, '#2a1408'); }
    }
    for (const q of this.parts) { g.fillStyle = q.c; g.fillRect(Math.round(q.x), Math.round(q.y), 2, 2); }
    for (let i = 0; i < n; i++) { const s = crowd[(i + 5) % crowd.length]; g.drawImage(s, 0, s.fh || 16, 16, s.fh || 16, 16 + i * 20, G0.cy + G0.ry + 5, 16, s.fh || 16); }
    g.restore();
    // darkness + lantern warmth
    const gr = g.createRadialGradient(G0.cx, G0.cy, 30, G0.cx, G0.cy, W * .62); gr.addColorStop(0, 'rgba(255,170,80,.06)'); gr.addColorStop(1, 'rgba(6,3,8,.7)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (this.slow > 0) { g.fillStyle = 'rgba(255,224,138,.10)'; g.fillRect(0, 0, W, H); }
    // HUD
    g.fillStyle = '#0e090b'; g.fillRect(0, 0, W, 13); g.fillStyle = '#6a5228'; g.fillRect(0, 12, W, 1); ptext(g, 'KAEL', 4, 4, PAL.cream);
    for (let i = 0; i < p.max; i++) { g.fillStyle = i < p.hp ? '#ffb35a' : '#3a2a24'; g.fillRect(24 + i * 6, 4, 4, 5); }
    const live = this.foes.filter(f => f.st !== 'down'), nm = (live[0] || this.foes[0]).name.toUpperCase() + (live.length > 1 ? ' +' + (live.length - 1) : ''); ptext(g, nm, W - 4 - ptextW(nm), 4, '#ff8a6a');
    g.fillStyle = '#0e090b'; g.fillRect(0, H - 11, W, 11); g.fillStyle = '#6a5228'; g.fillRect(0, H - 11, W, 1);
    const tip = Input.device === 'touch' ? 'A STRIKE  B DODGE' : Input.device === 'pad' ? 'A STRIKE  B DODGE' : 'E STRIKE  X DODGE'; if (this.phase === 'fight') { const full = tip + (W > 240 ? '  -  DODGE A SWING TO OPEN THEM UP' : ''); ptext(g, full, Math.max(3, Math.round(W / 2 - ptextW(full) / 2)), H - 8, '#f3e3c3'); }
    const big = (s, c, y) => { const bx = Math.round(W / 2 - ptextW(s, 2) / 2); ptext(g, s, bx + 1, y + 1, '#120a0e', 2); ptext(g, s, bx, y, c, 2); };
    if (this.phase === 'intro') { g.fillStyle = 'rgba(8,4,6,.6)'; g.fillRect(0, H / 2 - 22, W, 40); big(this.def.title, '#ffe08a', H / 2 - 16); if (this.def.sub) ptext(g, this.def.sub, Math.round(W / 2 - ptextW(this.def.sub) / 2), H / 2 + 2, PAL.cream); }
    else if (this.phase === 'win') big(this.def.winText || 'DOWN!', '#ffe08a', 26);
    else if (this.phase === 'lose') big('KAEL IS DOWN', '#ff5a4a', 26);
    else if (this.msgT > 0) big(this.msg, '#ffe08a', 26);
  }
};
