// Starhaven — Wren. Movement (run, jump, double jump, dash) and daggers (combo, air combo, pogo).
(function (SH) {
  const sign = v => (v > 0 ? 1 : v < 0 ? -1 : 0);
  const approach = (v, target, rate) => (v < target ? Math.min(v + rate, target) : Math.max(v - rate, target));

  function Player(x, y) {
    const P = SH.PLAYER;
    Object.assign(this, {
      x, y, vx: 0, vy: 0, w: P.w, h: P.h,
      facing: 1, grounded: false, wasGrounded: false,
      coyote: 0, jumpBuf: 0, dashBuf: 0, atkBuf: 0,
      airJumps: 1, airDashes: 1, rising: false,
      dashT: 0, dashCd: 0, dashDir: 1, iframes: 0, bowCd: 0, bowT: 0, pips: SH.GIFTS.pips, giftCd: 0, castT: 0,
      invuln: 0, stun: 0,
      swing: null, comboStep: 0, comboKind: null, comboGap: 0,
      hearts: P.hearts, maxHearts: P.hearts,
      lastSafe: { x, y }, dropT: 0,
      anim: { t: 0, run: 0, squash: 0, land: 0 },
      scarf: [], dead: false,
      stats: { hits: 0, hurt: 0, perfect: 0, pogos: 0 },
    });
    for (let i = 0; i < 6; i++) this.scarf.push({ x: x, y: y - 30 });
  }

  Player.prototype.box = function () { return SH.boxOf(this); };

  Player.prototype.jumpV = function (tiles) {
    const t = SH.tune;
    // Speed needed to rise this many tiles under rising gravity (ignores the apex float, which adds a little).
    return Math.sqrt(2 * t.gravityUp * tiles * SH.TILE) * 0.94;
  };

  Player.prototype.update = function (world) {
    const t = SH.tune, inp = world.input, C = SH.COMBAT, fx = SH.fx;
    const a = this.anim;
    a.t++;
    if (this.dead) return;

    // ---- buffers
    if (inp.pressed.jump) this.jumpBuf = t.jumpBufferFrames; else if (this.jumpBuf > 0) this.jumpBuf--;
    if (inp.pressed.dash) this.dashBuf = 6; else if (this.dashBuf > 0) this.dashBuf--;
    if (inp.pressed.attack || inp.pressed.downstrike) this.atkBuf = C.attackBuffer; else if (this.atkBuf > 0) this.atkBuf--;
    if (this.dashCd > 0) this.dashCd--;
    if (this.bowCd > 0) this.bowCd--;
    if (this.bowT > 0) this.bowT--;
    if (this.giftCd > 0) this.giftCd--;
    if (inp.pressed.gift) this.giftBuf = 8; else if (this.giftBuf > 0) this.giftBuf--;
    if (this.castT > 0) this.castT--;
    // Flame: cast a fireball for one moon pip; pips refill slowly over time
    if (SH.game.can('flame')) {
      const G = SH.GIFTS;
      this.pips = Math.min(G.pips, this.pips + 1 / G.regenFrames);
      if (this.giftBuf > 0 && this.giftCd <= 0 && !this.dead && this.stun <= 0) {
        this.giftBuf = 0;
        if (this.pips >= G.flame.cost) {
          this.pips -= G.flame.cost; this.giftCd = G.flame.cooldown; this.castT = 14;
          const d = (inp.held.right ? 1 : 0) - (inp.held.left ? 1 : 0); if (d) this.facing = d;
          world.spawnFireball(this.x + this.facing * 14, this.y - 22, this.facing);
          SH.sfx.play('dash');
        } else { SH.fx.word(this.x, this.y - 52, 'no moons left', '#b9b2dd', 34); this.giftCd = 20; }
      }
    }
    if (this.iframes > 0) this.iframes--;
    if (this.invuln > 0) this.invuln--;
    if (this.comboGap > 0) this.comboGap--; else if (!this.swing) this.comboStep = 0;

    const dir = (inp.held.right ? 1 : 0) - (inp.held.left ? 1 : 0);
    const stunned = this.stun > 0;
    if (stunned) this.stun--;

    // Mortal Wren (the Winter Woods) has one jump and no dash; the fae body brings the rest.
    const can = SH.game.can;
    if (this.grounded) { this.coyote = t.coyoteFrames; this.airJumps = can('double') ? 1 : 0; this.airDashes = 1; }
    else if (this.coyote > 0) this.coyote--;

    // ---- dash start
    if (!stunned && this.dashT <= 0 && this.dashBuf > 0 && this.dashCd <= 0 && can('dash') && (this.grounded || this.airDashes > 0)) {
      this.dashBuf = 0;
      if (!this.grounded) this.airDashes--;
      this.dashDir = dir !== 0 ? dir : this.facing;
      this.facing = this.dashDir;
      this.dashT = t.dashFrames;
      SH.sfx.play('dash');
      this.iframes = t.dashIFrames;
      this.swing = null;
      this.vy = 0;
      fx.dust(this.x, this.y, this.dashDir, this.grounded ? 6 : 0);
      fx.burst(this.x - this.dashDir * 6, this.y - 20, 6, { angle: this.dashDir > 0 ? Math.PI : 0, spread: 0.6, speed: 2.6, gravity: 0, life: 14, size: 2, colors: ['#ffe9a8', '#9fe8ff'], glow: true });
      if (world.onDash) world.onDash(this);
    }

    if (this.dashT > 0) {
      // ---- dashing: straight line, no gravity
      this.dashT--;
      this.vx = this.dashDir * t.dashSpeed;
      this.vy = this.grounded ? 0.5 : 0; // a ground dash hugs the floor; an air dash flies dead straight
      if (a.t % 2 === 0) fx.ghost({ x: this.x, y: this.y, facing: this.facing, pose: 'dash', life: 12, max: 12 });
      // Jumping out of a ground dash keeps some of its speed.
      if (this.jumpBuf > 0 && (this.grounded || this.coyote > 0)) {
        this.dashT = 0; this.dashCd = t.dashCooldown; this.doJump(false);
        this.vx = this.dashDir * Math.max(t.runSpeed, t.dashSpeed * 0.7);
      } else if (this.dashT === 0) {
        this.dashCd = t.dashCooldown;
        this.vx = this.dashDir * t.runSpeed * (dir === this.dashDir ? 1 : 0.3);
      }
    } else if (!stunned) {
      // ---- run
      const accel = t.runSpeed / Math.max(1, t.runAccelFrames);
      const decel = t.runSpeed / Math.max(1, t.stopFrames);
      const turn = (t.runSpeed * 2) / Math.max(1, t.turnFrames);
      const air = this.grounded ? 1 : t.airControl;
      let target = dir * t.runSpeed;
      if (this.swing && this.grounded && this.comboKind === 'ground') target *= 0.25;
      // Above run speed (after a dash-jump) bleed speed off gently instead of snapping.
      let rate;
      if (dir === 0) rate = decel * air;
      else if (sign(this.vx) !== 0 && sign(this.vx) !== dir) rate = turn * air;
      else if (Math.abs(this.vx) > t.runSpeed) rate = 0.12;
      else rate = accel * air;
      if (this.grounded && dir !== 0 && sign(this.vx) === -dir && Math.abs(this.vx) > t.runSpeed * 0.6) fx.dust(this.x, this.y, -dir, 2);
      this.vx = approach(this.vx, target, rate);
      if (dir !== 0 && (!this.swing || this.swing.f >= this.swing.def.next)) this.facing = dir;

      // ---- jump / double jump
      if (inp.pressed.jump && !this.grounded && this.coyote <= 0 && this.airJumps > 0) {
        this.airJumps--; this.jumpBuf = 0; this.doJump(true);
      } else if (this.jumpBuf > 0 && (this.grounded || this.coyote > 0)) {
        if (inp.held.down && this.groundTile === SH.T_ONEWAY && this.grounded) { this.dropT = 10; this.jumpBuf = 0; this.y += 1; }
        else this.doJump(false);
      }
      if (this.rising && !inp.held.jump && this.vy < 0) { this.vy *= t.jumpCut; this.rising = false; }
      if (this.vy >= 0) this.rising = false;

      // ---- gravity
      let g = this.vy < 0 ? t.gravityUp : t.gravityDown;
      if (Math.abs(this.vy) < 1.4 && inp.held.jump) g *= t.apexFloat;
      this.vy = Math.min(this.vy + g, t.maxFall);
    } else {
      // stunned after a hit: just fall and slow down
      this.vx = approach(this.vx, 0, 0.18);
      this.vy = Math.min(this.vy + t.gravityDown, t.maxFall);
    }

    // ---- attacks
    if (!stunned && this.dashT <= 0) this.tryAttack(world, inp);
    if (this.swing) this.updateSwing(world);

    // ---- move and collide
    if (this.dropT > 0) this.dropT--;
    this.dropThrough = this.dropT > 0;
    this.wasGrounded = this.grounded;
    const fallSpeed = this.vy;
    const res = SH.moveBody(world.room, this);
    this.grounded = res.ground;
    this.groundTile = res.groundTile;
    if (res.ceil) this.rising = false;

    if (this.grounded && !this.wasGrounded) {
      a.land = 8; a.squash = Math.min(1, fallSpeed / 9);
      if (fallSpeed > 5) SH.sfx.play('land');
      if (fallSpeed > 3) fx.dust(this.x, this.y, 0, fallSpeed > 7 ? 8 : 4);
    }
    if (a.land > 0) a.land--;
    if (this.grounded && Math.abs(this.vx) > 0.5) {
      a.run += Math.abs(this.vx) * 0.075;
      if (Math.floor(a.run * 2) !== Math.floor((a.run - Math.abs(this.vx) * 0.075) * 2) && Math.abs(this.vx) > 2) fx.dust(this.x - this.facing * 4, this.y, this.facing, 1);
    } else if (this.grounded) a.run = 0;

    // ---- remember safe footing (both feet on solid ground, no thorns close by)
    if (this.grounded && this.groundTile === SH.T_SOLID) {
      const TS = SH.TILE, room = world.room, ty = Math.floor(this.y / TS);
      const l = Math.floor((this.x - 10) / TS), r = Math.floor((this.x + 10) / TS);
      let ok = SH.isSolid(room.get(l, ty)) && SH.isSolid(room.get(r, ty));
      for (let tx = l - 1; tx <= r + 1 && ok; tx++) if (room.get(tx, ty - 1) === SH.T_THORNS) ok = false;
      if (ok) { this.lastSafe.x = this.x; this.lastSafe.y = this.y; }
    }

    // ---- scarf trails behind
    const anchor = { x: this.x - this.facing * 3, y: this.y - 31 };
    this.scarf[0].x = anchor.x; this.scarf[0].y = anchor.y;
    for (let i = 1; i < this.scarf.length; i++) {
      const p = this.scarf[i], q = this.scarf[i - 1];
      p.x += (q.x - this.facing * 3.2 - p.x) * 0.45 - this.vx * 0.04;
      p.y += (q.y + 0.9 - p.y) * 0.45 + Math.sin(a.t * 0.15 + i) * 0.25;
      const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1;
      if (d > 4) { p.x = q.x + dx / d * 4; p.y = q.y + dy / d * 4; }
    }
  };

  Player.prototype.doJump = function (isDouble) {
    const t = SH.tune, fx = SH.fx;
    this.vy = -this.jumpV(isDouble ? t.doubleJumpTiles : t.jumpTiles);
    this.rising = true;
    this.coyote = 0; this.jumpBuf = 0; this.grounded = false;
    this.anim.squash = -0.6;
    SH.sfx.play(isDouble ? 'djump' : 'jump');
    if (isDouble) {
      fx.ring(this.x, this.y - 4, '#bfe9ff', 20, 14, 2);
      fx.burst(this.x, this.y - 2, 8, { angle: Math.PI / 2, spread: 2.2, speed: 1.8, gravity: 0.02, life: 18, size: 2, colors: ['#e6f6ff', '#9fd8ff', '#ffe9a8'], glow: true });
    } else fx.dust(this.x, this.y, 0, 4);
  };

  Player.prototype.tryAttack = function (world, inp) {
    if (this.atkBuf <= 0) return;
    if (!SH.game.can('daggers')) { // the hunting bow: one arrow, straight ahead
      if (SH.game.can('bow') && this.bowCd <= 0 && this.grounded) {
        this.atkBuf = 0; this.bowCd = 30; this.bowT = 16; this.vx = 0;
        const d = (inp.held.right ? 1 : 0) - (inp.held.left ? 1 : 0); if (d) this.facing = d;
        world.spawnArrow(this.x + this.facing * 12, this.y - 27, this.facing);
        SH.sfx.play('bow');
      }
      return;
    }
    const C = SH.COMBAT;
    let kind, step;
    // On touch, a strike in the air aims down by itself when there's something to bounce on below (doc: auto-aim on phones).
    const autoDown = !this.grounded && !inp.held.down && SH.input.source === 'touch' && SH.settings.autoDown && this.somethingBelow(world);
    if (!this.grounded && (inp.held.down || inp.pressed.downstrike || autoDown)) { kind = 'pogo'; step = 0; }
    else {
      kind = this.grounded ? 'ground' : 'air';
      const list = C[kind];
      if (this.swing) {
        if (this.swing.kind !== kind || this.swing.f < this.swing.def.next || this.comboStep >= list.length) return;
        step = this.comboStep;
      } else step = (this.comboKind === kind && this.comboGap > 0 && this.comboStep < list.length) ? this.comboStep : 0;
    }
    if (this.swing && kind === 'pogo') return;
    const def = kind === 'pogo' ? C.pogo : C[kind][step];
    this.atkBuf = 0;
    this.comboKind = kind;
    this.comboStep = step + 1;
    if (kind !== 'pogo') { const d = (inp.held.right ? 1 : 0) - (inp.held.left ? 1 : 0); if (d) this.facing = d; }
    this.swing = { kind, step, def, f: 0, hits: new Set() };
    SH.sfx.play('slash');
    if (def.lunge && this.grounded) this.vx = this.facing * Math.max(Math.abs(this.vx) * 0.5, def.lunge * 1.6);
  };

  // A bud, enemy or thorns just below Wren's feet (what a down-strike could bounce on).
  Player.prototype.somethingBelow = function (world) {
    for (const t of world.targets) {
      if (!t.hittable() || t.kind === 'dummy') continue;
      const hb = t.hurtBox(), cx = (hb.l + hb.r) / 2, cy = (hb.t + hb.b) / 2;
      if (Math.abs(cx - this.x) < 46 && cy > this.y - 14 && cy < this.y + 110) return true;
    }
    const TS = SH.TILE, tx = Math.floor(this.x / TS);
    for (let d = 0; d < 4; d++) {
      const tile = world.room.get(tx, Math.floor(this.y / TS) + d);
      if (tile === SH.T_THORNS) return true;
      if (tile === SH.T_SOLID || tile === SH.T_ONEWAY) break;
    }
    return false;
  };

  Player.prototype.swingBox = function () {
    const s = this.swing, d = s.def;
    if (s.kind === 'pogo') return { l: this.x - 22, r: this.x + 22, t: this.y - 8, b: this.y + d.reach };
    const f = this.facing, cy = this.y - 20;
    const h = d.arc === 'big' ? 40 : 30;
    const near = this.x + f * 2, far = this.x + f * d.reach;
    return { l: Math.min(near, far), r: Math.max(near, far), t: cy - h / 2, b: cy + h / 2 };
  };

  Player.prototype.updateSwing = function (world) {
    const s = this.swing, d = s.def, C = SH.COMBAT, fx = SH.fx;
    s.f++;
    if (s.f >= d.active[0] && s.f <= d.active[1]) {
      const hb = this.swingBox();
      for (const tgt of world.targets) {
        if (s.hits.has(tgt) || !tgt.hittable()) continue;
        if (!SH.overlap(hb, tgt.hurtBox())) continue;
        s.hits.add(tgt);
        const r = tgt.takeHit({ dmg: C.damage, kb: d.kb, dir: this.facing, finisher: !!d.finisher, pogo: s.kind === 'pogo' }, world);
        if (!r) continue;
        if (r.deflect) continue;
        if (SH.game.can('flame')) this.pips = Math.min(SH.GIFTS.pips, this.pips + SH.GIFTS.perHit); // close-up hits refill the moons
        this.stats.hits++;
        SH.sfx.play(r.killed ? 'kill' : 'hit');
        fx.stop(r.killed ? C.killStop : d.stop);
        fx.kick(r.killed ? 4 : d.finisher ? 3 : 1.6);
        if (s.kind === 'pogo') this.bounce();
        else if (this.grounded) this.vx -= this.facing * C.recoil;
      }
      // Pogo also bounces off thorn tiles (a forgiving rule: chill, not punishing).
      if (s.kind === 'pogo' && !s.bounced && SH.touchesThorns(world.room, hb.l, hb.t, hb.r, hb.b + 6)) {
        s.bounced = true; this.bounce(); fx.stop(4);
        fx.burst(this.x, this.y + 16, 8, { angle: -Math.PI / 2, spread: 1.6, speed: 2.2, life: 16, colors: ['#ffd27a', '#ff7a8a'], glow: true });
      }
    }
    if (s.f >= d.frames) {
      this.swing = null;
      this.comboGap = 14;
      if (s.kind === 'pogo' || this.comboStep >= (SH.COMBAT[s.kind] || []).length) { this.comboStep = 0; this.comboGap = 0; }
    }
  };

  Player.prototype.bounce = function () {
    this.vy = -SH.tune.pogoBounce;
    this.rising = false;
    this.airJumps = 1; this.airDashes = 1; this.dashCd = 0;
    this.stats.pogos++;
    SH.sfx.play('pogo');
    SH.fx.ring(this.x, this.y + 12, '#ffe9a8', 26, 14, 2);
    if (this.swing) this.swing.bounced = true;
  };

  // Returns true if the hit landed.
  Player.prototype.hurt = function (fromX, dmg, world) {
    if (this.dead || this.invuln > 0) return false;
    if (this.iframes > 0) return false;
    const fx = SH.fx;
    this.hearts = Math.max(0, this.hearts - dmg);
    this.stats.hurt++;
    SH.sfx.play('hurt');
    this.invuln = SH.PLAYER.hurtInvuln;
    this.stun = SH.PLAYER.hurtStun;
    this.swing = null; this.dashT = 0;
    const d = this.x >= fromX ? 1 : -1;
    this.vx = d * 4.2; this.vy = -5;
    this.rising = false;
    fx.stop(7); fx.kick(5); fx.flashScreen(6, 'rgba(255,90,110,0.35)');
    fx.burst(this.x, this.y - 20, 12, { speed: 3, life: 22, colors: ['#ff7a8a', '#ffd0d6', '#ffffff'], glow: true });
    if (this.hearts <= 0 && world.onKnockout) world.onKnockout();
    return true;
  };

  Player.prototype.respawnAt = function (x, y, invuln) {
    this.x = x; this.y = y; this.vx = this.vy = 0;
    this.dashT = 0; this.swing = null; this.stun = 0;
    this.invuln = invuln || 0;
    this.grounded = false;
    for (const p of this.scarf) { p.x = x; p.y = y - 30; }
  };

  SH.Player = Player;
})(window.SH = window.SH || {});
