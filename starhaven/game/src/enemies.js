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
      if (this.deadT > d.respawn && Math.abs(this.home.x - world.camCenterX()) > world.viewW * 0.6) this.reset();
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
          if (!SH.floorAhead(world.room, this.x + this.dir * (this.w / 2 + 2), this.y) || this.hitWall) { this.dir *= -1; this.pause = 30; }
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
    this.vx = hit.dir * kb; this.vy = hit.pogo ? 1 : -1.8;
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
  };
  Dummy.prototype.takeHit = function (hit) {
    this.tiltV += hit.dir * (hit.finisher ? 0.22 : 0.1);
    this.flash = 7;
    this.combo++; this.comboT = 50;
    const label = hit.finisher ? `${this.combo} hits!` : `${this.combo}`;
    SH.fx.word(this.x, this.y - this.h - 10, label, hit.finisher ? '#ffd27a' : '#ffffff', 40);
    SH.fx.burst(this.x - hit.dir * 4, this.y - this.h * 0.6, 6, { angle: hit.dir > 0 ? 0 : Math.PI, spread: 1.2, speed: 2, life: 18, colors: ['#e8c77a', '#b8924a', '#fff2c9'] });
    if (hit.finisher) SH.fx.ring(this.x, this.y - this.h * 0.6, '#ffd27a', 24, 14, 2);
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
  Bulb.prototype.update = function () {
    this.t += 0.05;
    if (this.closed > 0) this.closed--;
  };
  Bulb.prototype.takeHit = function (hit) {
    if (!hit.pogo) { SH.fx.word(this.x, this.y - 22, 'strike down', '#ffd27a', 40); return { landed: true, killed: false }; }
    this.closed = SH.ENEMY_DEFS.bulb.regrow;
    SH.fx.burst(this.x, this.y, 10, { speed: 2.2, life: 22, colors: ['#ff8fb8', '#ffd27a', '#ffffff'], glow: true });
    return { landed: true, killed: false };
  };

  SH.makeSpawn = function (s, room) {
    const T = TS();
    const x = s.x * T + T / 2;
    if (s.kind === 'bulb') return new Bulb(s.x * T, s.y * T);
    const y = s.y != null ? s.y * T : room.groundY(Math.floor(s.x), 0);
    if (s.kind === 'thornSprite') return new ThornSprite(x, y);
    if (s.kind === 'dummy') return new Dummy(x, y);
    throw new Error('unknown spawn ' + s.kind);
  };
})(window.SH = window.SH || {});
