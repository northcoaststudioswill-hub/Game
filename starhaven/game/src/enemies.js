// Starhaven — things you hit: the thorn sprite (first enemy), the training dummy, and thorn buds (pogo targets).
(function (SH) {
  const TS = () => SH.TILE;

  // ---------------- Thorn sprite: wanders, glows orange, then lunges. 4 HP = 2 dagger hits.
  function ThornSprite(x, y) {
    const d = SH.ENEMY_DEFS.thornSprite;
    Object.assign(this, { kind: 'thornSprite', def: d, home: { x, y }, w: d.w, h: d.h });
    this.reset();
  }
  ThornSprite.prototype.reset = function () {
    Object.assign(this, {
      x: this.home.x, y: this.home.y, vx: 0, vy: 0,
      hp: this.def.hp, dir: Math.random() < 0.5 ? -1 : 1,
      state: 'wander', t: 0, flash: 0, dead: false, deadT: 0, grounded: false,
      wobble: Math.random() * 6, pause: 0,
    });
  };
  ThornSprite.prototype.hittable = function () { return !this.dead; };
  ThornSprite.prototype.hurtBox = function () { return { l: this.x - this.w / 2 - 2, r: this.x + this.w / 2 + 2, t: this.y - this.h - 2, b: this.y }; };
  ThornSprite.prototype.bodyBox = function () { return { l: this.x - this.w / 2 + 3, r: this.x + this.w / 2 - 3, t: this.y - this.h + 4, b: this.y }; };

  ThornSprite.prototype.update = function (world) {
    const d = this.def, p = world.player, fx = SH.fx;
    this.wobble += 0.12;
    if (this.flash > 0) this.flash--;
    if (this.dead) {
      this.deadT++;
      // Come back after a while, but never in view.
      if (this.respawns !== false && this.deadT > d.respawn && Math.abs(this.home.x - world.camCenterX()) > world.viewW * 0.6) this.reset();
      return;
    }
    this.t++;
    const dx = p.x - this.x, dy = p.y - this.y;
    const sees = !p.dead && Math.abs(dx) < d.sight && Math.abs(dy) < d.sightY;

    switch (this.state) {
      case 'wander':
        if (this.pause > 0) { this.pause--; this.vx = 0; }
        else {
          this.vx = this.dir * d.wander;
          // turn at ledges and walls, and stay near home (a leash of a few tiles) so sprites never wander into town
          const away = (this.x - this.home.x) * this.dir > d.leash * SH.TILE;
          if (!SH.floorAhead(world.room, this.x + this.dir * (this.w / 2 + 2), this.y) || this.hitWall || away) { this.dir *= -1; this.pause = 30; }
          if (Math.random() < 0.004) this.pause = 40 + Math.random() * 40;
        }
        if (sees && this.grounded) { this.state = 'windup'; this.t = 0; this.dir = dx > 0 ? 1 : -1; this.vx = 0; fx.word(this.x, this.y - this.h - 8, '!', '#ffb057', 28); }
        break;
      case 'windup':
        this.vx = 0;
        if (this.t >= d.windup) {
          this.state = 'lunge'; this.t = 0;
          this.vx = this.dir * d.lungeSpeed; this.vy = -d.lungeHop;
          fx.burst(this.x, this.y, 6, { angle: this.dir > 0 ? Math.PI : 0, spread: 0.8, speed: 1.6, life: 14, colors: ['#ffb057', '#ffe0a0'] });
        }
        break;
      case 'lunge':
        if (this.grounded && this.t > 4) this.vx *= 0.86;
        if (this.t >= d.lungeFrames) { this.state = 'recover'; this.t = 0; }
        break;
      case 'recover':
        this.vx *= 0.8;
        if (this.t >= d.recover) { this.state = 'wander'; this.t = 0; this.pause = 20; }
        break;
      case 'stagger':
        this.vx *= 0.88;
        if (this.t >= 18) { this.state = 'recover'; this.t = d.recover - 16; }
        break;
    }

    this.vy = Math.min(this.vy + d.gravity, 8);
    const res = SH.moveBody(world.room, this);
    this.grounded = res.ground;
    this.hitWall = res.wall !== 0;
    if (this.y > world.room.pxH + 60) { this.dead = true; this.deadT = 0; }

    // Touching Wren hurts her (dash invincibility protects; a dash through a lunge is a perfect dodge).
    if (SH.overlap(this.bodyBox(), p.box())) {
      if (p.dashT > 0 && p.iframes > 0) {
        if (this.state === 'lunge' && !this.dodged) { this.dodged = true; world.onPerfectDodge(this); }
      } else p.hurt(this.x, d.damage, world);
    }
    if (this.state !== 'lunge') this.dodged = false;
  };

  ThornSprite.prototype.takeHit = function (hit, world) {
    const fx = SH.fx;
    this.hp -= hit.dmg;
    this.flash = 8;
    const kb = hit.pogo ? 0 : hit.kb;
    this.vx = hit.dir * kb; this.vy = hit.pogo ? 1 : hit.launch ? -hit.launch : -1.8;
    fx.burst(this.x, this.y - this.h / 2, 7, { angle: hit.pogo ? Math.PI / 2 : (hit.dir > 0 ? 0 : Math.PI), spread: 1.4, speed: 2.4, life: 18, colors: ['#9be07a', '#d8ffb8', '#ffffff'] });
    if (this.hp <= 0) {
      this.dead = true; this.deadT = 0;
      fx.burst(this.x, this.y - this.h / 2, 22, { speed: 3.2, life: 34, size: 3, gravity: 0.08, colors: ['#5f9e4c', '#9be07a', '#3d6b33', '#ffe9a8'] });
      fx.ring(this.x, this.y - this.h / 2, '#d8ffb8', 30, 18, 2);
      world.onKill(this);
      return { landed: true, killed: true };
    }
    this.state = 'stagger'; this.t = 0;
    return { landed: true, killed: false };
  };

  // ---------------- Training dummy: can't die, counts your combo.
  function Dummy(x, y) {
    const d = SH.ENEMY_DEFS.dummy;
    Object.assign(this, { kind: 'dummy', x, y, w: d.w, h: d.h, tilt: 0, tiltV: 0, flash: 0, combo: 0, comboT: 0 });
  }
  Dummy.prototype.reset = function () { this.tilt = this.tiltV = 0; this.combo = 0; };
  Dummy.prototype.hittable = () => true;
  Dummy.prototype.hurtBox = function () { return { l: this.x - this.w / 2, r: this.x + this.w / 2, t: this.y - this.h, b: this.y }; };
  Dummy.prototype.update = function () {
    this.tiltV += -this.tilt * 0.12; this.tiltV *= 0.86; this.tilt += this.tiltV;
    if (this.flash > 0) this.flash--;
    if (this.comboT > 0) this.comboT--; else this.combo = 0;
    // Bram's guard lesson: the dummy's arm swings round. Guard it. It never hurts.
    const G = SH.game, w = G.world, p = w && w.player;
    if (G.activeGoal === 'guard' && p && G.state === 'play') {
      this.armT = (this.armT || 0) + 1;
      if (this.armT === 70) { this.flash = 14; SH.fx.word(this.x, this.y - this.h - 12, 'swinging...', '#ffb057', 40); }
      if (this.armT >= 110) {
        this.armT = 0; this.tiltV += (p.x < this.x ? -1 : 1) * 0.3; SH.sfx.play('slash');
        if (Math.abs(p.x - this.x) < 64 && Math.abs(p.y - this.y) < 40) {
          const g0 = p.guard > 0; p.invuln = 0;
          if (g0 && (this.x - p.x) * p.facing >= -6) p.hurt(this.x, 0, w);
          else { p.vx = (p.x < this.x ? -1 : 1) * 4; SH.fx.word(p.x, p.y - 60, 'bonk', '#ffffff', 40); p.invuln = 20; }
        }
      }
    } else this.armT = 0;
  };
  Dummy.prototype.takeHit = function (hit, world) {
    this.tiltV += hit.dir * (hit.finisher ? 0.22 : 0.1);
    this.flash = 7;
    this.combo++; this.comboT = 50;
    const label = hit.finisher ? `${this.combo} hits!` : `${this.combo}`;
    SH.fx.word(this.x, this.y - this.h - 10, label, hit.finisher ? '#ffd27a' : '#ffffff', 40);
    SH.fx.burst(this.x - hit.dir * 4, this.y - this.h * 0.6, 6, { angle: hit.dir > 0 ? 0 : Math.PI, spread: 1.2, speed: 2, life: 18, colors: ['#e8c77a', '#b8924a', '#fff2c9'] });
    if (hit.finisher) SH.fx.ring(this.x, this.y - this.h * 0.6, '#ffd27a', 24, 14, 2);
    if (hit.finisher && this.combo >= 3 && world && world.onDummyCombo) world.onDummyCombo();
    if (world && world.onDummyMove && hit.move) world.onDummyMove(hit.move);
    return { landed: true, killed: false };
  };

  // ---------------- Thorn bud: floats over thorns. Pogo off it; it closes, then reopens.
  function Bulb(x, y) {
    const d = SH.ENEMY_DEFS.bulb;
    Object.assign(this, { kind: 'bulb', x, y, r: d.r, w: d.r * 2, h: d.r * 2, closed: 0, t: Math.random() * 6 });
  }
  Bulb.prototype.reset = function () { this.closed = 0; };
  Bulb.prototype.hittable = function () { return this.closed <= 0; };
  Bulb.prototype.hurtBox = function () { const y = this.y + Math.sin(this.t) * 3; return { l: this.x - this.r, r: this.x + this.r, t: y - this.r, b: y + this.r }; };
  Bulb.prototype.update = function (world) {
    this.t += 0.05;
    if (this.closed > 0) this.closed--;
    // Touch assist: buds are springy. Falling onto an open bud bounces you, strike or no strike.
    const p = world && world.player;
    if (p && this.closed <= 0 && SH.settings.autoDown && p.vy > 0 && !p.grounded) {
      const y = this.y + Math.sin(this.t) * 3;
      if (Math.abs(p.x - this.x) < this.r + 18 && p.y > y - this.r - 8 && p.y < y + 8) {
        this.closed = SH.ENEMY_DEFS.bulb.regrow;
        SH.fx.burst(this.x, y, 10, { speed: 2.2, life: 22, colors: ['#ff8fb8', '#ffd27a', '#ffffff'], glow: true });
        p.bounce();
      }
    }
  };
  Bulb.prototype.takeHit = function (hit) {
    if (!hit.pogo) { SH.fx.word(this.x, this.y - 22, 'strike down', '#ffd27a', 40); return { landed: true, killed: false }; }
    this.closed = SH.ENEMY_DEFS.bulb.regrow;
    SH.fx.burst(this.x, this.y, 10, { speed: 2.2, life: 22, colors: ['#ff8fb8', '#ffd27a', '#ffffff'], glow: true });
    return { landed: true, killed: false };
  };

  // ---------------- The white stag (the Winter Woods). Grazes; bolts if you get too close; only an arrow brings it down.
  function Stag(x, y, spots) {
    Object.assign(this, { kind: 'stag', x, y, w: 40, h: 34, spots, spot: 0, state: 'graze', t: 0, fall: 0, dir: -1, arrowOnly: true });
  }
  Stag.prototype.reset = function () { };
  Stag.prototype.hittable = function () { return this.state !== 'down'; };
  Stag.prototype.hurtBox = function () { return { l: this.x - 20, r: this.x + 20, t: this.y - 34, b: this.y }; };
  Stag.prototype.update = function (world) {
    const T = SH.TILE, p = world.player;
    this.t++;
    if (this.state === 'down') { this.fall = Math.min(1, this.fall + 0.03); return; }
    if (this.state === 'flee') {
      const tx = this.spots[this.spot] * T + T / 2;
      this.dir = 1; this.x = Math.min(tx, this.x + 5);
      if (this.x >= tx) { this.state = 'graze'; this.dir = -1; }
      return;
    }
    // too close, and it bolts deeper into the clearing (twice at most)
    if (Math.abs(p.x - this.x) < 3.5 * T && this.spot < this.spots.length - 1) {
      this.spot++; this.state = 'flee';
      SH.game.hud.toast('Too close. The stag bolted. Stop further back and shoot.');
      SH.fx.burst(this.x, this.y, 10, { angle: Math.PI, spread: 1, speed: 2, life: 22, colors: ['#ffffff', '#dfe8ff'] });
    }
  };
  Stag.prototype.takeHit = function (hit, world) {
    if (!hit.arrow) return null;
    this.state = 'down';
    SH.fx.burst(this.x, this.y - 20, 24, { speed: 2.4, life: 50, gravity: -0.04, colors: ['#ffd27a', '#fff6d8'], glow: true });
    SH.fx.flashScreen(8, 'rgba(255,255,255,0.6)');
    if (world.onStagDown) world.onStagDown();
    return { landed: true, killed: true };
  };

  // ---------------- Brazier: only fire lights it.
  function Brazier(x, y) { Object.assign(this, { kind: 'brazier', x, y, w: 18, h: 30, lit: false, fireOnly: true }); }
  Brazier.prototype.reset = function () { };
  Brazier.prototype.hittable = function () { return !this.lit; };
  Brazier.prototype.hurtBox = function () { return { l: this.x - 12, r: this.x + 12, t: this.y - 34, b: this.y }; };
  Brazier.prototype.update = function () { };
  Brazier.prototype.takeHit = function (hit) {
    if (!hit.fire) { SH.fx.word(this.x, this.y - 44, 'needs fire', '#ffb057', 40); return { landed: true }; }
    this.lit = true; SH.sfx.play('lantern');
    SH.fx.burst(this.x, this.y - 32, 20, { speed: 2.4, life: 34, gravity: -0.05, colors: ['#ff8a3a', '#ffd27a', '#fff6d8'], glow: true });
    return { landed: true };
  };

  // ---------------- Things to do in the Winter Woods before the stag: firewood and wintergreen to gather,
  // snares to check, old targets to shoot, and a starving wolf.
  function Pickup(x, y, what) { Object.assign(this, { kind: 'pickup', what, x, y, got: false }); }
  Pickup.prototype.reset = function () { };
  Pickup.prototype.hittable = () => false;
  Pickup.prototype.update = function (world) {
    const p = world.player;
    if (this.got || Math.abs(p.x - this.x) > 16 || Math.abs(p.y - this.y) > 30) return;
    this.got = true; SH.sfx.play('mote');
    SH.fx.burst(this.x, this.y - 8, 8, { speed: 1.6, life: 20, gravity: -0.03, colors: this.what === 'herb' ? ['#8fd16b', '#fff6d8'] : ['#c89a5a', '#fff6d8'] });
    world.onPickup(this.what);
  };
  function Snare(x, y, n) { Object.assign(this, { kind: 'snare', n, x, y, checked: false, usable: true, near: false, label: 'CHECK' }); }
  Snare.prototype.reset = function () { };
  Snare.prototype.hittable = () => false;
  Snare.prototype.update = function (world) {
    const p = world.player;
    this.near = !this.checked && Math.abs(p.x - this.x) < 26 && Math.abs(p.y - this.y) < 30 && p.grounded;
    if (this.near && world.input.pressed.up) { this.checked = true; this.near = false; world.onSnare(this.n); }
  };
  // The first trial: three altars in the dark, each an answer. Wren answers by standing before one.
  function Altar(x, y, what) { Object.assign(this, { kind: 'altar', what, x, y, usable: true, near: false, broken: false, label: 'CHOOSE' }); }
  Altar.prototype.reset = function () { };
  Altar.prototype.hittable = () => false;
  Altar.prototype.update = function (world) {
    const p = world.player;
    this.near = !this.broken && !SH.game.flags.riddle && !!SH.game.flags.asked && Math.abs(p.x - this.x) < 26 && Math.abs(p.y - this.y) < 30 && p.grounded;
    if (this.near && (world.input.pressed.up || world.input.pressed.attack)) { this.near = false; p.atkBuf = 0; world.onAltar(this); }   // the gold CHOOSE button, or STRIKE
  };
  function Target(x, y, blade) { Object.assign(this, { kind: 'target', x, y, hit: false, arrowOnly: !blade, blade: !!blade, wob: 0 }); }   // blade: Bram's rings, cut with daggers
  Target.prototype.reset = function () { };
  Target.prototype.hittable = function () { return !this.hit; };
  Target.prototype.hurtBox = function () { return { l: this.x - 10, r: this.x + 10, t: this.y - 15, b: this.y + 15 }; };
  Target.prototype.update = function () { if (this.wob > 0) this.wob--; };
  Target.prototype.takeHit = function (hit, world) {
    this.hit = true; this.wob = 30; SH.sfx.play('hit');
    SH.fx.word(this.x, this.y - 22, this.blade ? 'CLEAN CUT' : 'BULLSEYE', '#ffd27a', 50); SH.fx.spark(this.x, this.y, 0, true);
    world.onTarget(this); return { landed: true };
  };
  // The wolf is as hungry as the sisters. One arrow and it backs off hurt: then it is Wren's choice,
  // made with the bow and not a menu. Shoot again, or lower the bow and let it go.
  function Wolf(x, y) { Object.assign(this, { kind: 'wolf', home: { x, y }, w: 34, h: 20, arrowOnly: true }); this.reset(); }
  Wolf.prototype.reset = function () { if (this.gone) return; Object.assign(this, { x: this.home.x, y: this.home.y, vx: 0, vy: 0, dir: -1, state: 'prowl', t: 0, hp: 2, flash: 0, dead: false }); };
  Wolf.prototype.hittable = function () { return !this.gone && !this.dead && this.state !== 'flee'; };
  Wolf.prototype.hurtBox = function () { return { l: this.x - 18, r: this.x + 18, t: this.y - 32, b: this.y }; };
  Wolf.prototype.update = function (world) {
    if (this.gone) return;
    const p = world.player, dx = p.x - this.x; this.t++; if (this.flash > 0) this.flash--;
    if (this.dead) { this.vx = 0; return; }
    switch (this.state) {
      case 'prowl': this.dir = dx > 0 ? 1 : -1; this.vx = Math.sin(this.t * 0.03) * 0.5;
        if (Math.abs(dx) < 200 && !this.seen) { this.seen = true; world.onWolf('seen'); }
        if (Math.abs(dx) < 86 && Math.abs(p.y - this.y) < 40 && !p.dead) { this.state = 'crouch'; this.t = 0; SH.sfx.play('rumble'); SH.fx.word(this.x, this.y - 34, '!', '#ff5a5a', 30); } break;
      case 'crouch': this.vx = 0; if (this.t > 30) { this.state = 'lunge'; this.t = 0; this.vx = this.dir * 5.2; this.vy = -3; } break;
      case 'lunge': if (this.t > 22) { this.state = 'back'; this.t = 0; } if (SH.overlap(this.hurtBox(), p.box())) p.hurt(this.x, 1, world); break;
      case 'back': this.vx = -this.dir * 1.6; if (this.t > 50) { this.state = 'prowl'; this.t = 0; } break;
      case 'hurt': this.dir = dx > 0 ? 1 : -1; this.vx = Math.abs(dx) < 150 ? -this.dir * 0.8 : 0;
        if (this.t % 50 === 10) SH.fx.word(this.x, this.y - 30, '...', '#c8d2e2', 40);
        if (this.t > 260) { this.state = 'flee'; this.t = 0; world.onWolf('spared'); } break;
      case 'flee': this.dir = 1; this.vx = 4.2; if (this.t > 120) this.gone = true; break;
    }
    this.vy = Math.min((this.vy || 0) + 0.5, 9);
    const res = SH.moveBody(world.room, this); if (res.ground) this.vy = 0;
  };
  Wolf.prototype.takeHit = function (hit, world) {
    if (!hit.arrow) return null;
    this.hp--; this.flash = 8; SH.sfx.play('hit'); SH.fx.spark(this.x, this.y - 12, 0, false);
    if (this.hp <= 0) { this.dead = true; SH.fx.kick(4); world.onWolf('killed'); }
    else { this.state = 'hurt'; this.t = 0; this.vx = -hit.dir * -2; world.onWolf('hurt'); }
    return { landed: true };
  };

  // ---------------- Wyrms: the mountain wyrmling, and the Old Wyrm (same creature, bigger, from data).
  // Wander -> wind up (armored head, eyes glow) -> charge in a straight line -> dazed (open to hits) -> rest.
  function Wyrm(x, y, kind) {
    const d = SH.ENEMY_DEFS[kind];
    Object.assign(this, { kind: 'wyrm', defKind: kind, def: d, home: { x, y }, w: d.w, h: d.h, boss: !!d.boss, respawns: false });
    this.reset();
  }
  Wyrm.prototype.reset = function () {
    Object.assign(this, { x: this.home.x, y: this.home.y, vx: 0, vy: 0, hp: this.def.hp, dir: -1, state: this.boss ? 'sleep' : 'wander', t: 0, flash: 0, dead: false, burn: 0, burnT: 0, grounded: false, hitWall: false,
      moveN: 0, lastPhase: 1, roarDue: false, again: 0, highT: 0 });
  };
  Wyrm.prototype.hittable = function () { return !this.dead && this.state !== 'sleep'; };
  Wyrm.prototype.hurtBox = function () { return { l: this.x - this.w / 2, r: this.x + this.w / 2, t: this.y - this.h, b: this.y }; };
  Wyrm.prototype.bodyBox = function () { return { l: this.x - this.w / 2 + 6, r: this.x + this.w / 2 - 6, t: this.y - this.h + 6, b: this.y }; };
  Wyrm.prototype.wake = function () { if (this.state === 'sleep') { this.state = 'rest'; this.t = 0; } };
  // The Old Wyrm fights in three phases: it gets faster and gains moves as it weakens.
  Wyrm.prototype.phase = function () { if (!this.boss) return 1; const k = this.hp / this.def.hp; return k > 0.66 ? 1 : k > 0.33 ? 2 : 3; };
  Wyrm.prototype.breathBox = function () {
    const head = this.x + this.dir * this.w / 2, far = head + this.dir * this.def.breathReach;
    return { l: Math.min(head, far), r: Math.max(head, far), t: this.y - 46, b: this.y };
  };
  Wyrm.prototype.pickMove = function (world, dx) {
    const d = this.def, p = world.player, ph = this.phase();
    this.dir = dx > 0 ? 1 : -1; this.t = 0;
    if (!this.boss) { this.state = 'windup'; return; }
    const order = ph === 1 ? ['charge', 'slam'] : ph === 2 ? ['charge', 'breath', 'slam'] : ['charge', 'slam', 'breath', 'slam'];
    let m = order[this.moveN++ % order.length];
    if (m === 'breath' && p.y < this.y - 50) m = 'slam';              // she's up on a ledge: frost can't reach
    if (m === 'breath' && Math.abs(dx) > d.breathReach + 60) m = 'charge';
    if (m === 'charge') { this.state = 'windup'; this.again = ph === 3 ? 1 : 0; SH.sfx.play('rumble'); }
    else if (m === 'slam') { this.state = 'crouch'; const ar = world.room.arena; this.leapX = Math.max(ar ? ar[0] : -1e9, Math.min(ar ? ar[1] : 1e9, p.x)); }   // it picks its landing spot NOW: move, and it misses
    else { this.state = 'inhale'; SH.sfx.play('rumble'); }
  };
  Wyrm.prototype.update = function (world) {
    const d = this.def, p = world.player, fx = SH.fx;
    if (this.dead || this.state === 'sleep') return;
    this.t++;
    if (this.flash > 0) this.flash--;
    if (this.burn > 0) { this.burn--; if (++this.burnT % SH.GIFTS.flame.burnEvery === 0) this.damage(1, world); if (this.t % 4 === 0) fx.burst(this.x, this.y - this.h * 0.7, 1, { speed: 0.6, life: 20, gravity: -0.06, colors: ['#ff8a3a', '#ffd27a'] }); }
    if (this.dead) return;
    const ph = this.phase(), quick = [1, 1, 0.85, 0.65][ph];
    const dx = p.x - this.x, sees = !p.dead && Math.abs(dx) < d.sight && Math.abs(p.y - this.y) < d.sightY;
    // a new phase: it roars as soon as it has its feet under it
    if (this.boss && this.roarDue && this.grounded && this.state !== 'charge' && this.state !== 'leap') {
      this.roarDue = false; this.state = 'roar'; this.t = 0; this.vx = 0;
      SH.game.look(this.x + this.dir * 20, this.y - this.h * 0.6, 1.4, 50); if (p.hearts < p.maxHearts) { p.hearts++; fx.word(p.x, p.y - 70, '+1 heart: the bond steadies her', '#ff9ac0', 100); } if (SH.arts.active() && !SH.arts.scene) { SH.arts.meter = Math.max(SH.arts.meter, SH.arts.max - 0.5); SH.arts.gain(1); }   // the bond answers its rage
      fx.kick(8); SH.sfx.play('rumble'); SH.sfx.play('thud');
      fx.ring(this.x + this.dir * this.w / 2, this.y - this.h * 0.7, '#c8d2e2', 90, 30, 3);
      fx.word(this.x, this.y - this.h - 34, ph === 3 ? 'It is furious!' : 'It is angry now!', '#ff8a8a', 80);
      if (Math.abs(dx) < 150) { p.vx = (dx > 0 ? 1 : -1) * 6.5; p.vy = Math.min(p.vy, -3); }
      world.dropRocks(2 + ph);
    }
    // camping up on a ledge brings the roof down on her
    if (this.boss) { this.highT = p.y < this.y - 60 ? this.highT + 1 : 0; if (this.highT > 200) { this.highT = 0; world.dropRocks(3, p.x); } }
    switch (this.state) {
      case 'wander':
        this.vx = this.dir * d.wander;
        if (!SH.floorAhead(world.room, this.x + this.dir * (this.w / 2 + 2), this.y) || this.hitWall || Math.abs(this.x - this.home.x) > 5 * SH.TILE && (this.x - this.home.x) * this.dir > 0) this.dir *= -1;
        if (sees && this.grounded) { this.pickMove(world, dx); if (!this.boss) { fx.word(this.x, this.y - this.h - 10, '!', '#ff5a5a', 30); SH.sfx.play('rumble'); } }
        break;
      case 'windup':
        this.vx = 0;
        if (this.t % 6 === 0) fx.dust(this.x - this.dir * this.w / 2, this.y, -this.dir, 2);
        if (this.t >= d.windup * quick) { this.state = 'charge'; this.t = 0; }
        break;
      case 'charge': {
        this.vx = this.dir * d.chargeSpeed * (2 - quick > 1.2 ? 1.18 : 2 - quick > 1 ? 1.08 : 1);
        if (this.t % 3 === 0) fx.dust(this.x - this.dir * this.w / 2, this.y, -this.dir, 2);
        const edge = !SH.floorAhead(world.room, this.x + this.dir * (this.w / 2 + 4), this.y);
        const passed = this.boss && this.t > 24 && (p.x - this.x) * this.dir < -150;   // she's well behind it: stop short
        if (this.hitWall || edge || passed || this.t > d.chargeFrames) {
          this.vx = 0;
          if (this.hitWall) {
            fx.kick(this.boss ? 9 : 5); SH.sfx.play('thud');
            if (d.rocks) world.dropRocks(d.rocks);
            this.state = 'stun'; this.t = 0; this.again = 0;
          } else if (this.again > 0) { this.again--; this.state = 'windup'; this.t = Math.floor(d.windup * quick * 0.4); this.dir = p.x > this.x ? 1 : -1; SH.sfx.play('rumble'); }
          else if (this.boss) { this.state = 'slamrest'; this.t = 0; SH.fx.dust(this.x, this.y, -this.dir, 8); }   // a charge that misses leaves it winded: every dodge earns an opening
          else { this.state = edge ? 'stun' : 'rest'; this.t = edge ? Math.floor(d.stun / 2) : 0; }
        }
        break;
      }
      // ---- leap slam: crouch, jump to where she is, land with a shockwave along the ground each way
      case 'crouch':
        this.vx = 0;
        if (this.t % 5 === 0) fx.dust(this.x, this.y, 0, 2);
        if (this.t >= 44 * quick) {
          const air = 36, tx = this.leapX != null ? this.leapX : p.x;
          this.state = 'leap'; this.t = 0; this.vy = -9; this.grounded = false;
          this.leapVx = Math.max(-7.5, Math.min(7.5, (tx - this.x) / air)); this.dir = this.leapVx >= 0 ? 1 : -1;
          SH.sfx.play('dash'); fx.dust(this.x, this.y, 0, 8);
        }
        break;
      case 'leap':
        this.vx = this.leapVx;
        if (this.grounded && this.t > 6) {
          this.vx = 0; this.state = 'slamrest'; this.t = 0;
          fx.kick(10); SH.sfx.play('thud'); SH.game.punch(0.14);
          fx.ring(this.x, this.y - 4, '#c8d2e2', 60, 18, 3);
          fx.burst(this.x, this.y - 4, 24, { angle: -Math.PI / 2, spread: 2.6, speed: 3.6, life: 30, size: 3, colors: ['#5a6680', '#8a96b8', '#c8d2e2'] });
          world.spawnWave(this.x - this.w / 2, this.y, -1); world.spawnWave(this.x + this.w / 2, this.y, 1);
          if (ph === 3) world.dropRocks(2);
        }
        break;
      case 'slamrest':
        this.vx = 0;
        if (this.t >= 80 * quick) { this.state = 'rest'; this.t = Math.floor(d.rest * quick * 0.5); }
        break;
      // ---- frost breath: a long breath in (fire down its throat chokes it), then a cone of frost along the ground
      case 'inhale':
        this.vx = 0;
        if (this.t % 2 === 0) { const a = Math.random() * 1.4 - 0.7, r = 60 + Math.random() * 50, hx = this.x + this.dir * this.w / 2, hy = this.y - this.h * 0.55;
          fx.parts.push({ x: hx + this.dir * Math.cos(a) * r, y: hy + Math.sin(a) * r, vx: -this.dir * Math.cos(a) * r / 16, vy: -Math.sin(a) * r / 16, g: 0, drag: 1, life: 15, max: 15, size: 2, color: '#bfe8ff', glow: true, shape: 'sq' }); }
        if (this.t >= 52 * quick) { this.state = 'breath'; this.t = 0; SH.sfx.play('dash'); }
        break;
      case 'breath': {
        this.vx = 0;
        const hx = this.x + this.dir * this.w / 2, hy = this.y - this.h * 0.5;
        fx.burst(hx, hy, 3, { angle: this.dir > 0 ? 0.12 : Math.PI - 0.12, spread: 0.5, speed: 7.5, life: 26, gravity: 0.03, drag: 0.95, size: 3, colors: ['#bfe8ff', '#ffffff', '#7ac8ff'], glow: true });
        if (this.t % 4 === 0) fx.kick(1.2);
        if (this.t > 5 && SH.overlap(this.breathBox(), p.box()) && !(p.dashT > 0 && p.iframes > 0)) p.hurt(this.x, 1, world);
        if (this.t >= 66) { this.state = 'rest'; this.t = 0; }
        break;
      }
      case 'roar':
        this.vx = 0;
        if (this.t % 6 === 0) fx.kick(3);
        if (this.t >= 54) { this.state = 'rest'; this.t = Math.floor(d.rest * quick * 0.5); }
        break;
      case 'stun':
        this.vx = 0;
        if (this.t >= d.stun) { this.state = 'rest'; this.t = 0; }
        break;
      case 'rest':
        this.vx = 0;
        if (this.boss && this.t > 4) { this.dir = dx > 0 ? 1 : -1; if (Math.abs(dx) > 120) this.vx = this.dir * d.wander * 1.6; }
        if (this.t >= d.rest * quick) { if (this.boss) { if (!p.dead && this.grounded) this.pickMove(world, dx); } else { this.state = 'wander'; this.t = 0; if (sees) this.pickMove(world, dx); } }
        break;
    }
    this.vy = Math.min(this.vy + d.gravity, 9);
    const res = SH.moveBody(world.room, this);
    this.grounded = res.ground; this.hitWall = res.wall !== 0;
    const hard = this.state === 'charge' || this.state === 'leap';
    const fromAbove = p.swing && p.swing.kind === 'pogo';                                   // a down strike lands on its back, it doesn't run into it
    const leaping = this.state === 'leap' && this.vy < 2;                                  // it only hurts where it comes down
    if (SH.overlap(this.bodyBox(), p.box()) && !(p.dashT > 0 && p.iframes > 0) && !fromAbove && !leaping && this.state !== 'stun') p.hurt(this.x, hard ? d.damage : 1, world);
  };
  Wyrm.prototype.damage = function (n, world) {
    this.hp -= n; this.flash = 8;
    if (this.hp <= 0 && !this.dead) {
      this.dead = true; this.vx = 0;
      SH.fx.burst(this.x, this.y - this.h / 2, this.boss ? 60 : 26, { speed: 3.4, life: 46, size: 3, colors: ['#8a96b8', '#c8d2e2', '#5a6680', '#ffd27a'] });
      SH.fx.kick(this.boss ? 10 : 4); SH.sfx.play('kill');
      world.onKill(this);
      if (this.boss && world.onBossDown) world.onBossDown();
      return true;
    }
    if (this.boss) { const ph = this.phase(); if (ph > this.lastPhase) { this.lastPhase = ph; this.roarDue = true; } }
    return false;
  };
  Wyrm.prototype.takeHit = function (hit, world) {
    const facingHer = hit.dir === -this.dir;
    if (this.state === 'roar') return null;
    if (!hit.fire && !hit.open && !hit.pogo && facingHer && (this.state === 'windup' || this.state === 'charge')) {
      // the armored head turns a blade: but it still feels it (1), and the words say where to hit instead
      this.damage(1, world);
      SH.fx.word(this.x + this.dir * this.w / 2, this.y - this.h - 6, this.boss ? 'ARMORED HEAD: hit its back' : 'ARMORED: hit its back', '#c8d2e2', 70);
      SH.fx.burst(this.x + this.dir * this.w / 2, this.y - this.h / 2, 8, { speed: 2.6, life: 14, colors: ['#ffffff', '#ffd27a'] });
      SH.sfx.play('hit');
      world.player.vx = hit.dir * -3;
      return { landed: true, deflect: true };
    }
    let dmg = hit.dmg;
    if (hit.fire) {
      this.burn = SH.GIFTS.flame.burn * SH.GIFTS.flame.burnEvery;
      if (this.state === 'inhale' && facingHer) {
        // fire down its throat while it breathes in: it chokes, and is wide open
        this.state = 'stun'; this.t = -Math.floor(this.def.stun * 0.3); dmg += 2;
        SH.arts.finisher('CHOKED', 'FIRE DOWN ITS THROAT', '#ffb057'); SH.arts.whisper('choke');
        SH.fx.burst(this.x + this.dir * this.w / 2, this.y - this.h * 0.5, 22, { speed: 3, life: 30, colors: ['#ff8a3a', '#ffd27a', '#bfe8ff'], glow: true });
      }
    } else if (this.boss && this.state === 'stun') dmg += 1;   // dazed: every cut bites deeper
    SH.fx.burst(this.x, this.y - this.h / 2, 7, { angle: hit.dir > 0 ? 0 : Math.PI, spread: 1.4, speed: 2.4, life: 18, colors: ['#c8d2e2', '#ffffff'] });
    const killed = this.damage(dmg, world);
    return { landed: true, killed };
  };

  SH.makeSpawn = function (s, room) {
    const T = TS();
    const x = s.x * T + T / 2;
    if (s.kind === 'bulb') return new Bulb(s.x * T, s.y * T);
    const y = s.y != null ? s.y * T : room.groundY(Math.floor(s.x), 0);
    if (s.kind === 'thornSprite') { const e = new ThornSprite(x, y); e.respawns = s.respawn; return e; }
    if (s.kind === 'dummy') return new Dummy(x, y);
    if (s.kind === 'stag') return new Stag(x, y, s.spots || [s.x]);
    if (s.kind === 'brazier') return new Brazier(x, y);
    if (s.kind === 'pickup') return new Pickup(x, y, s.what);
    if (s.kind === 'altar') return new Altar(x, y, s.what);
    if (s.kind === 'snare') return new Snare(x, y, s.n);
    if (s.kind === 'target') return new Target(x, s.y * T, s.blade);
    if (s.kind === 'wolf') return new Wolf(x, y);
    if (s.kind === 'wyrmling' || s.kind === 'oldWyrm') return new Wyrm(x, y, s.kind);
    if (SH.ch4) { const e = SH.ch4.spawn(s, x, y); if (e) return e; }
    throw new Error('unknown spawn ' + s.kind);
  };
})(window.SH = window.SH || {});
