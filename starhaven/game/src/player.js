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
      dashT: 0, dashCd: 0, dashDir: 1, iframes: 0, bowCd: 0, bowT: 0, pips: SH.stars.maxPips(), giftCd: 0, castT: 0, giftBuf: 0, charging: false, chargeT: 0, hitFlash: 0,
      invuln: 0, stun: 0,
      swing: null, comboStep: 0, comboKind: null, comboGap: 0,
      hearts: SH.stars.maxHearts(), maxHearts: SH.stars.maxHearts(),
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
      this.pips = Math.min(SH.stars.maxPips(), this.pips + 1 / G.regenFrames);
      // press to start, release to throw; hold long enough (and have two moons) and it becomes a flame wave
      if (this.giftBuf > 0 && !this.charging && this.giftCd <= 0 && !this.dead && this.stun <= 0) { this.giftBuf = 0; this.charging = true; this.chargeT = 0; }
      if (this.charging) {
        this.chargeT++;
        const ready = this.chargeT >= G.flame.chargeFrames && this.pips >= G.flame.waveCost;
        if (this.chargeT === G.flame.chargeFrames && this.pips >= G.flame.waveCost) { SH.fx.ring(this.x + this.facing * 12, this.y - 24, '#ffb057', 26, 14, 2); SH.sfx.play('lantern'); }
        if (this.chargeT > 6 && this.chargeT % 3 === 0) SH.fx.burst(this.x + this.facing * 12, this.y - 24, 1, { speed: 1.2, life: 14, gravity: -0.05, colors: ready ? ['#fff6d8', '#ffb057'] : ['#ff8a3a', '#ffd27a'], glow: true });
        if (!inp.held.gift || this.stun > 0 || this.dead) {
          const d = (inp.held.right ? 1 : 0) - (inp.held.left ? 1 : 0); if (d) this.facing = d;
          if (this.stun > 0 || this.dead) { /* knocked out of it */ }
          else if (ready) {
            this.pips -= G.flame.waveCost; this.giftCd = Math.round((G.flame.cooldown + 8) * SH.xp.quick()); this.castT = 18;
            world.spawnFireball(this.x + this.facing * 16, this.y - 22, this.facing, true);
            this.vx -= this.facing * 2.4; SH.fx.kick(3); SH.sfx.play('kill');
          } else if (this.pips >= G.flame.cost) {
            this.pips -= G.flame.cost; this.giftCd = Math.round(G.flame.cooldown * SH.xp.quick()); this.castT = 14;
            world.spawnFireball(this.x + this.facing * 14, this.y - 22, this.facing, false);
            SH.sfx.play('dash');
          } else { SH.fx.word(this.x, this.y - 52, 'no moons left', '#b9b2dd', 34); this.giftCd = 20; }
          this.charging = false; this.chargeT = 0;
        }
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
        this.dashT = 0; this.dashCd = Math.round(t.dashCooldown * SH.xp.dash()); this.doJump(false);
        this.vx = this.dashDir * Math.max(t.runSpeed, t.dashSpeed * 0.7);
      } else if (this.dashT === 0) {
        this.dashCd = Math.round(t.dashCooldown * SH.xp.dash());
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
    if (this.hitFlash > 0) this.hitFlash--;
    // Dash strike: attack during a dash
    if (!stunned && this.dashT > 0 && this.atkBuf > 0 && !this.swing && SH.game.can('daggers')) {
      this.atkBuf = 0; this.comboStep = 0; this.comboKind = 'thrust';
      this.swing = { kind: 'thrust', step: 0, def: C.thrust, f: 0, hits: new Set() };
      this.dashT = Math.max(this.dashT, 7); this.iframes = Math.max(this.iframes, 9);
      SH.sfx.play('slash');
    }
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

  // Aim assist: with no direction held, an attack turns to the nearest thing worth hitting (so a thumb on STRIKE alone
  // never swings at empty air with an enemy at her back).
  Player.prototype.autoFace = function (world, range, bow) {
    let best = null, bd = range;
    for (const e of world.things) {
      if (!e.hittable || !e.hittable() || (bow ? !e.arrowOnly : e.arrowOnly) || e.kind === 'brazier' || e.kind === 'bulb') continue;
      const dx = e.x - this.x, dy = Math.abs(e.y - this.y);
      if (Math.abs(dx) < bd && dy < (bow ? 130 : 46)) { bd = Math.abs(dx); best = e; }
    }
    if (best && Math.abs(best.x - this.x) > 6) this.facing = best.x > this.x ? 1 : -1;
  };
  Player.prototype.tryAttack = function (world, inp) {
    if (this.atkBuf <= 0) return;
    if (!SH.game.can('daggers')) { // the hunting bow: one arrow, straight ahead
      if (SH.game.can('bow') && this.bowCd <= 0) {   // from the ground, or from the top of a jump
        this.atkBuf = 0; this.bowCd = Math.round(30 * SH.xp.quick()); this.bowT = 16; if (this.grounded) this.vx = 0;
        const d = (inp.held.right ? 1 : 0) - (inp.held.left ? 1 : 0); if (d) this.facing = d; else this.autoFace(world, 320, true);
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
    // Rising strike: up + attack on the ground
    if (kind === 'ground' && inp.held.up && !this.swing) {
      this.atkBuf = 0; this.comboStep = 0; this.comboKind = 'up';
      const d = (inp.held.right ? 1 : 0) - (inp.held.left ? 1 : 0); if (d) this.facing = d;
      this.swing = { kind: 'up', step: 0, def: C.up, f: 0, hits: new Set() };
      this.vy = -this.jumpV(C.up.hop); this.grounded = false; this.coyote = 0; this.rising = false;
      SH.sfx.play('slash'); SH.fx.dust(this.x, this.y, 0, 5);
      return;
    }
    const def = kind === 'pogo' ? C.pogo : C[kind][step];
    this.atkBuf = 0;
    this.comboKind = kind;
    this.comboStep = step + 1;
    if (kind !== 'pogo') { const d = (inp.held.right ? 1 : 0) - (inp.held.left ? 1 : 0); if (d) this.facing = d; else this.autoFace(world, 64, false); }
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
    if (s.kind === 'up') return { l: Math.min(this.x - f * 8, this.x + f * d.reach), r: Math.max(this.x - f * 8, this.x + f * d.reach), t: this.y - 78, b: this.y - 6 };
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
        const open = SH.arts.opening > 0;
        const r = tgt.takeHit({ dmg: (d.dmg || C.damage) + (open ? 1 : 0) + (d.finisher ? SH.stars.level('edge') : 0), kb: d.kb, dir: this.facing, finisher: !!d.finisher, pogo: s.kind === 'pogo', launch: d.launch || 0, open, move: s.kind }, world);
        if (!r) continue;
        if (r.deflect) continue;
        if (SH.game.can('flame')) this.pips = Math.min(SH.stars.maxPips(), this.pips + SH.GIFTS.perHit); // close-up hits refill the moons
        this.stats.hits++; SH.arts.gain(d.finisher ? 9 : 6); SH.arts.hit();
        SH.game.punch(r.killed ? 0.12 : d.finisher ? 0.08 : 0.035);
        { const hb2 = tgt.hurtBox(); fx.spark((Math.max(hb.l, hb2.l) + Math.min(hb.r, hb2.r)) / 2, (Math.max(hb.t, hb2.t) + Math.min(hb.b, hb2.b)) / 2, s.kind === 'pogo' ? Math.PI / 2 : s.kind === 'up' ? -Math.PI / 2 : (this.facing > 0 ? 0 : Math.PI), d.finisher || r.killed); }
        if (r.killed && !tgt.boss && (tgt.kind === 'wyrm' || tgt.kind === 'thornSprite')) { const nm = { thrust: ['RUN THROUGH', 'DASH STRIKE'], up: ['SKYBOUND', 'RISING STRIKE'], pogo: ['FROM ABOVE', 'DOWN STRIKE'] }[s.kind]; if (nm) SH.arts.finisher(nm[0], nm[1], '#9fe8ff'); }
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
    if (this.dead || this.invuln > 0 || SH.arts.cutin || SH.arts.scene) return false;   // nothing touches her mid Bond Art
    if (this.iframes > 0) return false;
    const fx = SH.fx;
    { const gw = SH.game.world;   // Bram, heart 2: his shield takes the first blow in each place
      if (gw && !gw.bramUsed && SH.game.boon('bram')) { gw.bramUsed = true; this.invuln = SH.PLAYER.hurtInvuln; fx.word(this.x, this.y - 64, 'BRAM\'S SHIELD', '#ffd27a', 90); fx.ring(this.x, this.y - 22, '#ffd27a', 34, 16, 2); SH.sfx.play('thud'); return false; } }
    this.hearts = Math.max(0, this.hearts - dmg);
    { const gw = SH.game.world;   // Caelum, heart 3: at the last heart, the Bond Art is ready
      if (gw && this.hearts === 1 && !gw.caelumUsed && SH.game.boon('caelum', 3) && SH.arts.max) { gw.caelumUsed = true; SH.arts.meter = SH.arts.max; SH.fx.word(this.x, this.y - 64, 'HE IS WITH YOU', '#b9a8ff', 90); } }
    SH.game.punch(0.07); SH.arts.dropCombo();
    this.stats.hurt++; this.hitFlash = 6; this.charging = false; this.chargeT = 0;
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
