// Starhaven — Chapter 4, The Spy in the Library: winged spies, the lecterns they rob, and the Spymaster's Shadow.
// DESIGN.md: "Winged spy: flies out of dagger reach, dives. Teaches the bow." and "The Spymaster's Shadow: a winged
// leader in the Library stacks. Shoot it down, then dagger it on the ground."
(function (SH) {
  'use strict';
  const TS = () => SH.TILE;
  const K = SH.ch4 = {};

  SH.ENEMY_DEFS.spy = { name: 'Winged spy', hp: 6, damage: 1, sight: 230, diveSpeed: 5.2, mark: 34, down: 120 };
  SH.ENEMY_DEFS.shadow = { name: 'The Spymaster\'s Shadow', hp: 30, damage: 1, slain: 'SPYBREAKER', falls: 'THE SHADOW IS UNMADE', quiet: 'THE STACKS ARE STILL', after: 'lib4_end', whisper: 'bossStart4' };

  // ---------------------------------------------------------------- the lectern: an open book the spies come to rob
  function Lectern(x, y) { Object.assign(this, { kind: 'lectern', x, y, pages: 2, max: 2, robbed: 0 }); }
  Lectern.prototype.reset = function () { };
  Lectern.prototype.hittable = () => false;
  Lectern.prototype.update = function () { if (this.robbed > 0) this.robbed--; };

  // ---------------------------------------------------------------- the winged spy
  function Spy(x, y, wave) {
    Object.assign(this, { kind: 'spy', def: SH.ENEMY_DEFS.spy, home: { x, y }, wave: wave || 1, w: 22, h: 18 });
    this.reset();
  }
  Spy.prototype.reset = function () {
    if (this.dead && this.counted) return;   // a spy that is down stays down, even after a knockout
    Object.assign(this, { x: this.home.x, y: this.home.y, vx: 0, vy: 0, hp: this.def.hp, state: 'hover', t: 0, flash: 0, dead: false, deadT: 0,
      dir: -1, cd: 50 + Math.random() * 60, flap: Math.random() * 6, steal: 0, aim: null, lect: null, grounded: false, drift: Math.random() * 6 });
  };
  Spy.prototype.active = function () { const f = SH.game.flags; return this.wave === 1 ? !!f.bow4 : !!f.stacks4; };
  Spy.prototype.hittable = function () { return !this.dead && this.active(); };
  Spy.prototype.hurtBox = function () { return { l: this.x - 15, r: this.x + 15, t: this.y - 22, b: this.y + 4 }; };
  Spy.prototype.bodyBox = function () { return { l: this.x - 9, r: this.x + 9, t: this.y - 16, b: this.y }; };
  const toward = (o, tx, ty, sp) => { const dx = tx - o.x, dy = ty - o.y, d = Math.hypot(dx, dy); if (d < sp) { o.x = tx; o.y = ty; return true; } o.x += dx / d * sp; o.y += dy / d * sp; if (Math.abs(dx) > 2) o.dir = dx > 0 ? 1 : -1; return false; };
  Spy.prototype.pickLectern = function (world) {
    const open = world.things.filter(e => e.kind === 'lectern' && e.pages > 0);
    if (!open.length) return null;
    open.sort((a, b) => Math.abs(a.x - this.x) + Math.abs(a.y - this.y) - Math.abs(b.x - this.x) - Math.abs(b.y - this.y));
    return open[Math.random() < 0.7 ? 0 : open.length - 1];
  };
  Spy.prototype.update = function (world) {
    const p = world.player, fx = SH.fx, d = this.def, T = TS();
    if (this.dead) { this.deadT++; return; }
    this.flap += this.state === 'dive' ? 0.5 : this.state === 'down' ? 0 : 0.3;
    if (this.flash > 0) this.flash--;
    if (!this.active()) { this.x = this.home.x + Math.sin(this.flap * 0.1) * 6; this.y = this.home.y + Math.sin(this.flap * 0.07) * 3; return; }   // waiting, wings folded, on a ledge
    this.t++;
    const dx = p.x - this.x, dy = (p.y - 18) - this.y, thief = this.wave === 2;
    const canDive = () => { if (--this.cd > 0 || p.dead) return false; if (Math.abs(dx) < d.sight && dy > -20 && dy < 220) { this.state = 'mark'; this.t = 0; this.aim = { x: p.x, y: p.y - 18 }; this.dir = dx > 0 ? 1 : -1; fx.word(this.x, this.y - 30, '!', '#ff5a5a', 30); SH.sfx.play('rumble'); return true; } return false; };
    switch (this.state) {
      case 'hover': {
        this.drift += 0.02;
        if (thief) {
          this.wait = (this.wait || 0) + 1;
          if (this.wait < 150) { toward(this, this.home.x + Math.sin(this.drift) * 40, this.home.y, 1); break; }   // they circle a moment when the door opens: time to get inside
          if (!this.lect || this.lect.pages <= 0) this.lect = this.pickLectern(world);
          if (this.lect && toward(this, this.lect.x, this.lect.y - 34, 1.5)) { this.state = 'steal'; this.t = 0; }
          else if (!this.lect) toward(this, this.home.x + Math.sin(this.drift) * 60, this.home.y + Math.sin(this.drift * 1.7) * 14, 1.2);
          if (Math.abs(dx) < 140 && Math.abs(dy) < 90) canDive();
        } else {
          toward(this, this.home.x + Math.sin(this.drift) * 70, this.home.y + Math.sin(this.drift * 1.9) * 16, 1.3);
          canDive();
        }
        break;
      }
      case 'steal':
        this.steal++;
        this.x = this.lect.x + Math.sin(this.t * 0.08) * 3; this.y = this.lect.y - 34 + Math.sin(this.t * 0.11) * 2;
        if (this.steal % 40 === 0) fx.burst(this.lect.x, this.lect.y - 18, 3, { speed: 0.8, life: 22, gravity: -0.04, colors: ['#fff6d8', '#ffd27a'] });
        if (this.steal >= 380) { this.steal = 0; this.lect.pages--; this.lect.robbed = 60; K.pageStolen(this.lect, this, world); this.lect = null; this.state = 'climb'; this.t = 0; }
        else if (Math.abs(dx) < 120 && Math.abs(dy) < 80) canDive();
        break;
      case 'mark':   // a red glare and a shriek: it is about to dive along this line
        this.x += Math.sin(this.t * 1.3) * 0.6;
        if (this.t >= d.mark) { const ax = this.aim.x - this.x, ay = this.aim.y - this.y, n = Math.hypot(ax, ay) || 1; this.vx = ax / n * d.diveSpeed; this.vy = ay / n * d.diveSpeed; this.state = 'dive'; this.t = 0; SH.sfx.play('dash'); }
        break;
      case 'dive': {
        this.x += this.vx; this.y += this.vy;
        const gy = world.room.groundY(Math.floor(this.x / T), Math.max(0, Math.floor(this.y / T) + 1));
        if (this.t > 60 || (gy != null && this.y > gy - 6) || this.y > world.room.pxH - T) { this.state = 'climb'; this.t = 0; this.cd = 90 + Math.random() * 80; }
        if (SH.overlap(this.bodyBox(), p.box())) {
          if (p.dashT > 0 && p.iframes > 0) { if (!this.dodged) { this.dodged = true; world.onPerfectDodge(this); } }
          else if (p.hurt(this.x, d.damage, world) === false && p.guard > 0) { this.state = 'climb'; this.t = 0; this.vx *= -0.5; }   // it glances off her blades
        }
        break;
      }
      case 'climb': {
        this.dodged = false;
        const tx = thief && this.lect ? this.lect.x : this.home.x, ty = thief && this.lect ? this.lect.y - 34 : this.home.y;
        if (toward(this, tx, ty, 2.2) || this.t > 160) { this.state = 'hover'; this.t = 0; if (this.cd < 60) this.cd = 60; }
        break;
      }
      case 'falling': {   // an arrow through the wing: it drops
        this.vy = Math.min(this.vy + 0.35, 7); const r = SH.moveBody(world.room, this); this.grounded = r.ground; this.vx *= 0.96;
        if (this.grounded) { this.state = 'down'; this.t = 0; SH.fx.kick(2); fx.burst(this.x, this.y, 8, { speed: 1.6, life: 20, colors: ['#3a3450', '#1a1630'] }); }
        break;
      }
      case 'down':   // on the ground, wings crumpled: the daggers' moment
        this.vx *= 0.8;
        if (this.t >= d.down) { this.state = 'climb'; this.t = 0; this.cd = 70; }
        break;
    }
    this.x = Math.max(T * 2.5, Math.min(world.room.pxW - T * 2.5, this.x));
    if (this.state !== 'falling' && this.state !== 'down') this.y = Math.max(T * 5.5, this.y);
  };
  Spy.prototype.takeHit = function (hit, world) {
    if (!this.hittable()) return null;
    const fx = SH.fx;
    let dmg = hit.dmg || 1; if (this.state === 'down') dmg += 1;
    this.hp -= dmg; this.flash = 8;
    fx.burst(this.x, this.y - 10, 8, { angle: hit.dir > 0 ? 0 : Math.PI, spread: 1.4, speed: 2.4, life: 18, colors: ['#3a3450', '#ff5a5a', '#c8c0e0'] });
    if (this.hp <= 0) {
      this.dead = true; this.deadT = 0; this.counted = true; this.steal = 0;
      fx.burst(this.x, this.y - 10, 24, { speed: 3, life: 40, gravity: 0.06, size: 3, colors: ['#1a1630', '#3a3450', '#8a80b0', '#ff5a5a'] });
      fx.ring(this.x, this.y - 10, '#c8c0e0', 30, 18, 2);
      world.onKill(this); K.spyDown(this, world);
      return { landed: true, killed: true };
    }
    if (hit.arrow && this.state !== 'down' && this.state !== 'falling') { this.state = 'falling'; this.vy = -1; this.vx = hit.dir * 1.2; this.t = 0; this.steal = 0; fx.word(this.x, this.y - 30, 'WING PINNED', '#ffd27a', 60); }
    else if (this.state !== 'down' && this.state !== 'falling') { this.state = 'climb'; this.t = 0; this.steal = 0; this.y -= 6; }
    return { landed: true, killed: false };
  };

  // ---------------------------------------------------------------- the Spymaster's Shadow
  function Shadow(x, y) {
    Object.assign(this, { kind: 'shadow', def: SH.ENEMY_DEFS.shadow, boss: true, home: { x, y }, w: 40, h: 40 });
    this.reset();
  }
  Shadow.prototype.reset = function () {
    Object.assign(this, { halfRose: false, x: this.home.x, y: this.home.y, vx: 0, vy: 0, hp: this.def.hp, state: 'idle', t: 0, flash: 0, dead: false, wing: 0, darts: [], cyc: 0, swoops: 0, flap: 0, dir: -1, lastPhase: 1 });
  };
  Shadow.prototype.wake = function () { if (this.state === 'idle') { this.state = 'circle'; this.t = 0; } };
  Shadow.prototype.phase = function () { return this.hp > this.def.hp * 0.5 ? 1 : 2; };
  Shadow.prototype.need = function () { return this.phase() === 1 ? 3 : 4; };
  Shadow.prototype.hittable = function () { return !this.dead && this.state !== 'idle'; };
  Shadow.prototype.hurtBox = function () { return { l: this.x - 24, r: this.x + 24, t: this.y - 36, b: this.y + 6 }; };
  Shadow.prototype.bodyBox = function () { return { l: this.x - 16, r: this.x + 16, t: this.y - 28, b: this.y }; };
  Shadow.prototype.arena = function (world) { const a = world.room.def.shadowArena; return { l: a[0] * TS(), r: a[1] * TS(), top: a[2] * TS(), floor: a[3] * TS() }; };
  Shadow.prototype.tell = function () {
    const s = this.state, n = this.need();
    if (s === 'circle') return `Shoot it with {BOW}: ${this.wing} of ${n} hits and its wings fail. Daggers reach it only when it swoops low.`;
    if (s === 'volley') return 'It is drawing SHADOW DARTS. Guard ({GUARD}) facing it, or get off their line.';
    if (s === 'swoopWind') return 'It is going to SWOOP across the hall. Get up on a gallery, jump it, or dash through it ({DASH}).';
    if (s === 'swoop') return 'SWOOPING. Get above it, jump it, or dash through it.';
    if (s === 'fall' || s === 'grounded') return 'IT IS DOWN. Cut it with {ATTACK} before it rises.';
    if (s === 'rise') return 'It is rising. Get ready to shoot it down again.';
    return null;
  };
  Shadow.prototype.update = function (world) {
    const p = world.player, fx = SH.fx, A = this.arena(world), ph = this.phase();
    // shadow darts fly on, even if it falls
    for (const d of this.darts) {
      d.x += d.vx; d.y += d.vy; d.life--;
      if (SH.isSolid(world.room.get(Math.floor(d.x / TS()), Math.floor(d.y / TS())))) d.life = 0;
      if (d.life > 0 && Math.abs(d.x - p.x) < 10 && d.y > p.y - 40 && d.y < p.y) { const r = p.hurt(d.x, 1, world); if (r !== false || p.guard > 0) { d.life = 0; fx.burst(d.x, d.y, 6, { speed: 1.6, life: 14, colors: ['#8a5ad8', '#ff5a8a'] }); } }
    }
    this.darts = this.darts.filter(d => d.life > 0);
    if (this.dead || this.state === 'idle') return;
    this.t++; this.flap += this.state === 'swoop' ? 0.45 : this.state === 'grounded' ? 0 : 0.22;
    if (this.flash > 0) this.flash--;
    if (ph !== this.lastPhase) { this.lastPhase = ph; fx.word(this.x, this.y - 50, 'IT SCREAMS', '#ff5a8a', 70); SH.fx.kick(5); }
    const mid = (A.l + A.r) / 2, half = (A.r - A.l) / 2 - 50;
    switch (this.state) {
      case 'circle': {
        const sp = ph === 1 ? 1 : 1.35, cxm = Math.max(A.l + 200, Math.min(A.r - 200, (mid + p.x) / 2)), tx = cxm + Math.sin(this.t * 0.012 * sp + 1) * 190, ty = A.floor - 150 + Math.sin(this.t * 0.024 * sp) * 22;   // it circles where she can see it
        this.x += (tx - this.x) * 0.05; this.y += (ty - this.y) * 0.05; this.dir = p.x > this.x ? 1 : -1;
        if (this.t > (ph === 1 ? 170 : 130)) { this.cyc++; this.t = 0; this.state = this.cyc % 2 ? 'volley' : 'swoopWind'; this.swoops = ph === 2 ? 2 : 1; SH.sfx.play('rumble'); }
        break;
      }
      case 'volley':
        this.dir = p.x > this.x ? 1 : -1;
        if (this.t === 46) {
          const n = ph === 1 ? 3 : 5, base = Math.atan2(p.y - 20 - this.y, p.x - this.x);
          for (let i = 0; i < n; i++) { const a = base + (i - (n - 1) / 2) * 0.2; this.darts.push({ x: this.x, y: this.y - 12, vx: Math.cos(a) * 3.3, vy: Math.sin(a) * 3.3, life: 200 }); }
          SH.sfx.play('dash');
        }
        if (this.t > 70) { this.state = 'circle'; this.t = 0; }
        break;
      case 'swoopWind': {   // to the side away from her, high, with a shriek
        if (this.side == null) this.side = (p.x < mid ? 1 : -1);
        const side = Math.max(A.l + 30, Math.min(A.r - 30, p.x + this.side * 270));
        this.x += (side - this.x) * 0.08; this.y += (A.floor - 170 - this.y) * 0.08; this.dir = side > p.x ? -1 : 1;
        if (this.t > 56) { this.state = 'swoop'; this.t = 0; this.vx = this.dir * (ph === 1 ? 5.6 : 6.6); this.swoopTo = p.x + this.dir * 270; this.side = null; SH.sfx.play('dash'); }
        break;
      }
      case 'swoop': {
        const low = A.floor - 30;
        this.x += this.vx; this.y += (low - this.y) * 0.12;
        if (SH.overlap(this.bodyBox(), p.box())) { if (p.dashT > 0 && p.iframes > 0) { if (!this.dodged) { this.dodged = true; world.onPerfectDodge(this); } } else p.hurt(this.x, this.def.damage, world); }
        if ((this.vx > 0 && (this.x > A.r - 30 || this.x > this.swoopTo)) || (this.vx < 0 && (this.x < A.l + 30 || this.x < this.swoopTo))) {
          this.dodged = false;
          if (--this.swoops > 0) { this.state = 'swoopWind'; this.t = 30; } else { this.state = 'circle'; this.t = 0; }
        }
        break;
      }
      case 'fall':
        this.vy = Math.min(this.vy + 0.4, 8); this.y += this.vy;
        if (this.y >= A.floor) { this.y = A.floor; this.state = 'grounded'; this.t = 0; SH.fx.kick(7); fx.burst(this.x, this.y, 26, { speed: 3, life: 30, colors: ['#1a1630', '#3a3450', '#8a5ad8'] }); SH.sfx.play('thud'); }
        break;
      case 'grounded':
        if (this.t > (ph === 1 ? 170 : 140)) { this.state = 'rise'; this.t = 0; this.wing = 0; }
        break;
      case 'rise':
        this.y -= 2.2; if (this.y < A.floor - 150) { this.state = 'circle'; this.t = 0; }
        break;
    }
    this.x = Math.max(A.l + 20, Math.min(A.r - 20, this.x));
  };
  Shadow.prototype.takeHit = function (hit, world) {
    if (!this.hittable()) return null;
    const fx = SH.fx, grounded = this.state === 'grounded' || this.state === 'fall';
    let dmg = hit.dmg || 1;
    if (!grounded && hit.arrow) dmg = 1;
    this.hp -= dmg; this.flash = 8;
    fx.burst(this.x, this.y - 18, 9, { angle: hit.dir > 0 ? 0 : Math.PI, spread: 1.5, speed: 2.6, life: 20, colors: ['#1a1630', '#8a5ad8', '#ff5a8a', '#ffffff'] });
    if (this.hp <= 0) { this.dead = true; this.darts = []; world.onBossDown(); return { landed: true, killed: true }; }
    if (grounded && this.hp <= this.def.hp * 0.5 && !this.halfRose) { this.halfRose = true; this.state = 'rise'; this.t = 0; this.wing = 0; fx.word(this.x, this.y - 50, 'IT TEARS FREE', '#ff5a8a', 80); SH.fx.kick(6); }
    if (!grounded && this.state !== 'rise') {   // hits while it is still rising hurt it, but do not count toward the next fall
      this.wing++;
      if (this.wing >= this.need()) { this.state = 'fall'; this.vy = 0; this.t = 0; fx.word(this.x, this.y - 50, 'ITS WINGS FAIL', '#ffd27a', 80); SH.arts.whisper('shadowDown'); }
    }
    return { landed: true, killed: false };
  };

  // ---------------------------------------------------------------- what the story hears
  K.spyDown = function (e, world) {
    const G = SH.game, key = e.wave === 1 ? 'skyspies' : 'stackspies';
    G.flags['n_' + key] = (G.flags['n_' + key] || 0) + 1;
    const all = world.things.filter(s => s.kind === 'spy' && s.wave === e.wave);
    G.hud.goal(true);
    if (all.every(s => s.dead)) { if (e.wave === 2) G.flags.pagesKeptAll = !(G.flags.pagesLost > 0); G.queueScript(e.wave === 1 ? 'lib4_sky_done' : 'lib4_stacks_done'); }
  };
  K.pageStolen = function (lect, spy, world) {
    const G = SH.game; G.flags.pagesLost = (G.flags.pagesLost || 0) + 1;
    SH.fx.word(lect.x, lect.y - 56, 'A PAGE IS TAKEN', '#ff7a8a', 90); SH.sfx.play('back'); SH.fx.kick(2);
    G.hud.goal(true);
    if (G.flags.pagesLost === 1) SH.arts.whisper('pageLost');
  };
  K.pagesTotal = world => world.things.filter(e => e.kind === 'lectern').reduce((a, l) => a + l.max, 0);

  K.spawn = function (s, x, y) {
    if (s.kind === 'spy') return new Spy(x, s.y * TS(), s.wave);
    if (s.kind === 'lectern') return new Lectern(x, y);
    if (s.kind === 'shadow') return new Shadow(x, s.y * TS());
    return null;
  };

  // ---------------------------------------------------------------- drawing
  K.draws = k => k === 'spy' || k === 'lectern' || k === 'shadow';
  function wings(ctx, span, up, col, edge) {   // a bat-like wing pair, spread `span`, raised by `up` (-1..1)
    for (const sd of [-1, 1]) {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, -4);
      ctx.lineTo(sd * span * 0.45, -8 - up * span * 0.4); ctx.lineTo(sd * span, -4 - up * span * 0.55);
      ctx.lineTo(sd * span * 0.8, 2 - up * span * 0.2); ctx.lineTo(sd * span * 0.6, 0); ctx.lineTo(sd * span * 0.45, 4); ctx.lineTo(sd * span * 0.25, 1); ctx.lineTo(0, 4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = edge; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(sd * span * 0.45, -8 - up * span * 0.4); ctx.lineTo(sd * span, -4 - up * span * 0.55); ctx.stroke();
    }
  }
  function drawSpy(ctx, e, t) {
    if (e.dead) return;
    const T = TS(), x = Math.round(e.x), y = Math.round(e.y), fl = e.flash > 0 && e.flash % 2;
    ctx.save(); ctx.translate(x, y);
    if (!e.active() && e.wave === 1) { ctx.fillStyle = '#0a0818'; ctx.fillRect(-6, -14, 12, 14); ctx.fillStyle = '#ff5a5a'; ctx.fillRect(-3, -11, 2, 1); ctx.fillRect(2, -11, 2, 1); ctx.restore(); return; }   // folded on a ledge, eyes open
    if (e.state === 'down') {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(0, 1, 18, 4, 0, 0, 6.3); ctx.fill();
      ctx.rotate(0.15 * e.dir); wings(ctx, 20, -0.6, fl ? '#ffffff' : '#241f3a', '#6a5a9a');
      ctx.fillStyle = fl ? '#ffffff' : '#14102a'; ctx.fillRect(-6, -10, 12, 9); ctx.fillStyle = '#8a8aa0'; ctx.fillRect(-4, -14, 8, 5);
      for (let i = 0; i < 3; i++) { const a = t * 0.12 + i * 2.1; ctx.fillStyle = '#ffd27a'; ctx.fillRect(Math.cos(a) * 10 - 1, -20 + Math.sin(a) * 3, 2, 2); }   // dazed
      ctx.restore(); return;
    }
    const mark = e.state === 'mark', up = Math.sin(e.flap) * (e.state === 'dive' ? 0.3 : 0.9);
    { const g = ctx.createRadialGradient(0, -10, 2, 0, -10, 34); g.addColorStop(0, 'rgba(185,168,255,0.32)'); g.addColorStop(1, 'rgba(185,168,255,0)'); ctx.fillStyle = g; ctx.fillRect(-34, -44, 68, 68); }   // a pale aura, so it reads against a night sky
    if (mark) { const g = ctx.createRadialGradient(0, -10, 2, 0, -10, 30); g.addColorStop(0, 'rgba(255,60,60,0.5)'); g.addColorStop(1, 'rgba(255,60,60,0)'); ctx.fillStyle = g; ctx.fillRect(-30, -40, 60, 60); }
    if (e.state === 'dive') ctx.rotate(Math.atan2(e.vy, e.vx * e.dir) * 0.6 * e.dir);
    ctx.scale(e.dir, 1);
    ctx.fillStyle = '#0a0818'; ctx.save(); ctx.translate(0, -8); wings(ctx, e.state === 'dive' ? 16 : 24, up, fl ? '#ffffff' : '#0a0818', '#0a0818'); ctx.restore();
    ctx.save(); ctx.translate(0, -9); wings(ctx, e.state === 'dive' ? 14 : 22, up, fl ? '#ffffff' : '#3a3260', '#c8b8ff'); ctx.restore();
    ctx.fillStyle = '#0a0818'; ctx.fillRect(-6, -19, 12, 15); ctx.fillStyle = fl ? '#ffffff' : '#1c1830'; ctx.fillRect(-5, -18, 10, 13);   // a hooded body
    ctx.fillStyle = '#d8d8ea'; ctx.fillRect(-4, -18, 8, 6); ctx.fillStyle = '#8a8aa0'; ctx.fillRect(-4, -14, 8, 2);                    // the iron mask, catching the light
    ctx.fillStyle = mark ? '#ffffff' : '#ff3a4a'; ctx.fillRect(1, -16, 2, 2); ctx.fillRect(-3, -16, 2, 2);
    ctx.fillStyle = '#14102a'; ctx.fillRect(-3, -5, 2, 5); ctx.fillRect(1, -5, 2, 5); ctx.fillStyle = '#8a8aa0'; ctx.fillRect(-3, 0, 2, 2); ctx.fillRect(1, 0, 2, 2);   // talons
    ctx.restore();
    if (e.state === 'steal' && e.lect) {   // a page lifting off the book toward it, and how long until it is gone
      const k = e.steal / 380, px = e.lect.x + Math.sin(t * 0.1) * 3, py = e.lect.y - 16 - k * 18;
      ctx.fillStyle = '#fff6d8'; ctx.fillRect(Math.round(px) - 3, Math.round(py) - 4, 6, 8); ctx.fillStyle = '#c8b890'; ctx.fillRect(Math.round(px) - 2, Math.round(py) - 2, 4, 1);
      ctx.fillStyle = '#0a0818'; ctx.fillRect(x - 13, y - 38, 26, 5); ctx.fillStyle = '#ff7a8a'; ctx.fillRect(x - 12, y - 37, Math.round(24 * k), 3);
    }
  }
  function drawLectern(ctx, e, t) {
    const x = Math.round(e.x), y = Math.round(e.y), R = (a, b, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + a, y + b, w, h); };
    R(-2, -22, 4, 22, '#0a0818'); R(-1, -22, 2, 22, '#6a4a2a'); R(-8, -2, 16, 2, '#0a0818'); R(-7, -2, 14, 1, '#8a6444');
    ctx.fillStyle = '#0a0818'; ctx.beginPath(); ctx.moveTo(x - 12, y - 20); ctx.lineTo(x + 12, y - 26); ctx.lineTo(x + 12, y - 22); ctx.lineTo(x - 12, y - 16); ctx.fill();
    if (e.pages > 0) {
      const gl = ctx.createRadialGradient(x, y - 26, 1, x, y - 26, 26); gl.addColorStop(0, 'rgba(255,233,168,0.45)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(x - 26, y - 52, 52, 52);
      ctx.fillStyle = '#f4ecd8'; ctx.beginPath(); ctx.moveTo(x - 11, y - 21); ctx.lineTo(x, y - 25); ctx.lineTo(x, y - 22); ctx.lineTo(x - 11, y - 18); ctx.fill(); ctx.beginPath(); ctx.moveTo(x, y - 25); ctx.lineTo(x + 11, y - 28); ctx.lineTo(x + 11, y - 24); ctx.lineTo(x, y - 22); ctx.fill();
      ctx.fillStyle = '#8a7a5a'; for (let i = 0; i < 3; i++) { ctx.fillRect(x - 9 + i * 1, y - 21 + i * 1.5 - i * 0.4, 7, 1); ctx.fillRect(x + 2, y - 25 + i * 1.5, 7, 1); }
    }
    for (let i = 0; i < e.max; i++) R(-6 + i * 8, -36 + Math.round(Math.sin(t * 0.06 + i) * 1), 5, 6, i < e.pages ? '#fff6d8' : 'rgba(255,122,138,0.5)');   // the pages it still holds
    if (e.robbed > 0) { ctx.globalAlpha = e.robbed / 60; R(-14, -44, 28, 2, '#ff7a8a'); ctx.globalAlpha = 1; }
  }
  function drawShadow(ctx, e, t) {
    for (const d of e.darts) {
      ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(Math.atan2(d.vy, d.vx));
      const g = ctx.createRadialGradient(0, 0, 1, 0, 0, 18); g.addColorStop(0, 'rgba(255,120,170,0.85)'); g.addColorStop(1, 'rgba(138,90,216,0)'); ctx.fillStyle = g; ctx.fillRect(-18, -18, 36, 36);
      ctx.fillStyle = 'rgba(200,160,255,0.5)'; ctx.fillRect(-22, -1, 14, 2);   // its trail
      ctx.fillStyle = '#0a0818'; ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-8, -5); ctx.lineTo(-4, 0); ctx.lineTo(-8, 5); ctx.fill(); ctx.fillStyle = '#ffd0e0'; ctx.fillRect(0, -1, 6, 2);
      ctx.restore();
    }
    if (e.dead) return;
    const x = Math.round(e.x), y = Math.round(e.y), fl = e.flash > 0 && e.flash % 2, down = e.state === 'grounded' || e.state === 'fall', idle = e.state === 'idle';
    ctx.save(); ctx.translate(x, y);
    // smoke trails off it always
    for (let i = 0; i < 8; i++) { const k = ((t * 0.02 + i / 8) % 1); ctx.globalAlpha = 0.35 * (1 - k); ctx.fillStyle = '#1a1630'; ctx.beginPath(); ctx.arc(-e.dir * k * 30 + Math.sin(i * 2 + t * 0.05) * 6, -14 + k * 20, 4 + k * 8, 0, 6.3); ctx.fill(); }
    ctx.globalAlpha = 1;
    if (down) {
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 1, 40, 7, 0, 0, 6.3); ctx.fill();
      ctx.save(); ctx.translate(0, -6); wings(ctx, 44, -0.7, fl ? '#ffffff' : '#1c1830', '#8a5ad8'); ctx.restore();
    } else {
      const up = idle ? -0.4 : Math.sin(e.flap) * 0.8;
      { const g = ctx.createRadialGradient(0, -20, 4, 0, -20, 80); g.addColorStop(0, 'rgba(170,120,255,0.42)'); g.addColorStop(0.6, 'rgba(120,80,220,0.14)'); g.addColorStop(1, 'rgba(120,80,220,0)'); ctx.fillStyle = g; ctx.fillRect(-80, -100, 160, 160); }
      ctx.save(); ctx.translate(0, -18); wings(ctx, e.state === 'swoop' ? 46 : 58, up, fl ? '#ffffff' : '#0a0818', '#0a0818'); ctx.restore();
      ctx.save(); ctx.translate(0, -19); wings(ctx, e.state === 'swoop' ? 44 : 55, up, fl ? '#ffffff' : '#3a2a6a', '#e0c8ff'); ctx.restore();
      ctx.globalAlpha = 0.5; ctx.save(); ctx.translate(0, -19); wings(ctx, e.state === 'swoop' ? 30 : 38, up, '#5a3aa0', '#5a3aa0'); ctx.restore(); ctx.globalAlpha = 1;
      if (e.state === 'volley' || e.state === 'swoopWind') { const g = ctx.createRadialGradient(0, -20, 2, 0, -20, 44); g.addColorStop(0, 'rgba(255,90,138,0.45)'); g.addColorStop(1, 'rgba(255,90,138,0)'); ctx.fillStyle = g; ctx.fillRect(-44, -64, 88, 88); }
    }
    ctx.scale(e.dir, 1);
    const by = down ? 6 : 0;
    ctx.fillStyle = '#0a0818'; ctx.fillRect(-11, -36 + by, 22, 32 - by); ctx.fillStyle = fl ? '#ffffff' : '#14102a'; ctx.fillRect(-10, -35 + by, 20, 30 - by);
    ctx.fillStyle = '#241f3a'; for (let i = 0; i < 5; i++) ctx.fillRect(-10 + i * 4, -8, 3, 6 + (i % 2) * 3);                 // a ragged cloak hem
    ctx.fillStyle = '#e8e8f6'; ctx.fillRect(-7, -34 + by, 14, 11); ctx.fillStyle = '#7a7a90'; ctx.fillRect(-7, -27 + by, 14, 3); ctx.fillRect(-1, -34 + by, 2, 11);   // the iron mask, a seam down its face
    ctx.fillStyle = '#ff2a5a'; ctx.fillRect(2, -31 + by, 3, 2); ctx.fillRect(-5, -31 + by, 3, 2);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = '#7a7a90'; ctx.fillRect(-6 + i * 5, -39 + by, 2, 5); }                       // a crown of iron spikes: the Iron King's
    if (!down) for (let i = 0; i < e.wing; i++) { ctx.fillStyle = '#ffd27a'; ctx.fillRect(-10 + i * 6, -48, 4, 4); }           // arrows it has taken
    ctx.restore();
    if (down) for (let i = 0; i < 4; i++) { const a = t * 0.1 + i * 1.6; ctx.fillStyle = '#ffd27a'; ctx.fillRect(x + Math.cos(a) * 18 - 1, y - 46 + Math.sin(a) * 4, 2, 2); }
  }
  K.draw = function (ctx, e, t) { if (e.kind === 'spy') drawSpy(ctx, e, t); else if (e.kind === 'lectern') drawLectern(ctx, e, t); else drawShadow(ctx, e, t); };
})(window.SH = window.SH || {});
