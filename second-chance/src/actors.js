'use strict';
/* SECOND CHANCE - actors: the player (always seen in full, from behind), the Hollows, and how they fight. */
(function () {
  const G = SC.gfx, W = SC.world, T = SC.T, P = SC.pose, FX = G.fx;
  const E = SC.enemies = [];
  const v3 = (x, y, z) => new THREE.Vector3(x || 0, y || 0, z || 0);
  const _a = v3(), _b = v3(), _c = v3();
  const combat = SC.combat = { tokens: 0, maxTokens: 2, freeze: null };
  SC.time = { scale: 1, hitstop: 0, slowT: 0, slowK: 1 };
  SC.slowmo = (k, t) => { SC.time.slowK = k; SC.time.slowT = t; };

  function physics(a, dt) {
    a.pos.x += a.vel.x * dt; a.pos.z += a.vel.z * dt;
    a.pos.x = SC.clamp(a.pos.x, -45.5, 45.5); a.pos.z = SC.clamp(a.pos.z, -45.6, 49.5);
    W.collide(a.pos, a.r, a.pos.y, a.h);
    const g = W.ground(a.pos.x, a.pos.z, a.pos.y);
    if (a.onGround) { if (a.pos.y - g <= T.step + 0.06) { a.pos.y = g; a.vy = 0; } else a.onGround = false; }
    if (!a.onGround) {
      a.vy -= T.gravity * dt; a.pos.y += a.vy * dt;
      if (a.pos.y <= g) { a.pos.y = g; a.onGround = true; if (a.vy < -9 && a.landed) a.landed(a.vy); a.vy = 0; }
    }
  }
  const fwd = (yaw, out) => out.set(Math.sin(yaw), 0, Math.cos(yaw));

  /* ====================== PLAYER ====================== */
  const pl = SC.player = {
    pos: v3(0, 0, 41), vel: v3(), vy: 0, yaw: Math.PI, r: 0.4, h: 1.8, onGround: true,
    state: 'idle', st: 0, t: 0, hp: T.hp, meter: 0, path: null, rank: 1, chance: 1, echoes: 0,
    combo: 0, inv: 0, dodgeCd: 0, runPh: 0, control: true, lift: 0, speed: 0, visY: 0, stats: { finishers: 0, kills: 0, perfect: 0, chances: 0 }
  };
  pl.init = function () {
    pl.model = SC.makeHumanoid('hero'); G.scene.add(pl.model.group);
    pl.chains = [];
    for (let i = 0; i < 6; i++) {
      const tx = G.tex.chain.clone(); tx.wrapS = THREE.RepeatWrapping; tx.needsUpdate = true;
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), 2)); geo.setIndex([0, 1, 2, 2, 1, 3]);
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tx, transparent: true, side: THREE.DoubleSide, depthWrite: false, fog: false }));
      m.frustumCulled = false; m.visible = false; m.renderOrder = 15; G.scene.add(m); pl.chains.push({ m, tx, target: null });
    }
  };
  pl.setPath = function (id) {
    pl.path = id; const p = SC.PATHS[id]; pl.model.setGlow(p.color, p.css); SC.emit('path', id);
  };
  pl.heal = n => { pl.hp = Math.min(T.hp, pl.hp + n); };
  pl.gain = n => { if (pl.path) pl.meter = Math.min(T.meter, pl.meter + n); };
  pl.hand = function (out) { return pl.model.bones.haL.getWorldPosition(out); };
  pl.place = function (x, y, z, yaw) { pl.pos.set(x, y, z); pl.vel.set(0, 0, 0); pl.vy = 0; pl.onGround = true; pl.visY = y; if (yaw !== undefined) pl.yaw = yaw; pl.model.group.position.copy(pl.pos); pl.model.group.rotation.y = pl.yaw; };
  pl.setState = function (s) { pl.state = s; pl.st = 0; };
  pl.landed = function () { FX.puff(pl.pos, 3, 0.7); SC.audio.sfx('land'); SC.cam.shake(0.12); };

  function alive(e) { return e && !e.gone && e.state !== 'dead' && e.state !== 'spawn'; }
  function pickTarget(maxD, minDot, dx, dz, skip) {
    const lk = SC.cam.lock;
    if (alive(lk) && lk !== skip && SC.dist2(pl.pos.x, pl.pos.z, lk.pos.x, lk.pos.z) < maxD * 1.7) return lk;
    let best = null, bs = 1e9;
    for (const e of E) {
      if (!alive(e) || e === skip || Math.abs(e.pos.y - pl.pos.y) > 2.2) continue;
      const ex = e.pos.x - pl.pos.x, ez = e.pos.z - pl.pos.z, d = Math.hypot(ex, ez); if (d > maxD) continue;
      const dot = d < 0.01 ? 1 : (ex * dx + ez * dz) / d; if (dot < minDot && d > 1.2) continue;
      const s = d - dot * 2.2; if (s < bs) { bs = s; best = e; }
    }
    return best;
  }
  SC.pickTarget = pickTarget;
  function face(x, z) { pl.yaw = Math.atan2(x - pl.pos.x, z - pl.pos.z); }

  const DMG = [9, 11, 19];
  function startAttack(i, mx, mz, mag) {
    pl.setState('attack'); pl.combo = i; pl.hitDone = false; pl.queued = false;
    const dx = mag > 0.3 ? mx : Math.sin(pl.yaw), dz = mag > 0.3 ? mz : Math.cos(pl.yaw);
    const t = pickTarget(4.4, 0.15, dx, dz);
    if (t) { face(t.pos.x, t.pos.z); const d = SC.dist2(pl.pos.x, pl.pos.z, t.pos.x, t.pos.z) - (t.r + 1.0); pl.lunge = SC.clamp(d, 0, 3.2) / P.ATTACK[i].hit; }
    else { if (mag > 0.3) pl.yaw = Math.atan2(mx, mz); pl.lunge = 3.2; }
    SC.audio.sfx('whoosh', i);
  }
  function attackHit(i) {
    const f = fwd(pl.yaw, _a), heavy = i === 2, reach = heavy ? 2.5 : 2.05, minDot = heavy ? -0.25 : 0.2, path = pl.path ? SC.PATHS[pl.path] : null;
    let hits = 0;
    _b.copy(pl.pos).addScaledVector(f, 1.15); _b.y += heavy ? 1.15 : 1.3;
    FX.slash(_b, pl.yaw + (i === 1 ? 0.4 : -0.3), i === 1 && path ? path.color : 0xffffff, heavy ? 3.2 : 2.3, (i === 0 ? -0.5 : i === 1 ? 0.45 : 0.08));
    for (const e of E) {
      if (!e.hittable() || Math.abs(e.pos.y - pl.pos.y) > 1.9) continue;
      const ex = e.pos.x - pl.pos.x, ez = e.pos.z - pl.pos.z, d = Math.hypot(ex, ez);
      if (d > reach + e.r) continue;
      if (d > 0.9 && (ex * f.x + ez * f.z) / d < minDot) continue;
      e.hit(DMG[i] + (pl.rank > 1 ? 1 : 0), d > 0.01 ? ex / d : f.x, d > 0.01 ? ez / d : f.z, { heavy, combo: i });
      if (heavy && pl.path === 'ember') e.burn = 3;
      hits++;
    }
    for (const c of W.crates) {
      if (!c.alive || Math.abs(c.y - pl.pos.y) > 1.5) continue;
      const ex = c.x - pl.pos.x, ez = c.z - pl.pos.z, d = Math.hypot(ex, ez);
      if (d < reach + 0.5 && (ex * f.x + ez * f.z) / Math.max(d, 0.01) > 0.1) { c.hp -= heavy ? 2 : 1; _c.set(c.x, c.y + c.s / 2, c.z); FX.burst(_c, 0xffffff, 1); if (c.hp <= 0) W.breakCrate(c); else SC.audio.sfx('hit', 0); hits += 0.01; }
    }
    if (hits >= 1) {
      SC.time.hitstop = heavy ? 0.11 : 0.05; SC.cam.shake(heavy ? 0.4 : 0.14); pl.gain(heavy ? 9 : 6);
      if (heavy && pl.path === 'ember') { FX.ring(pl.pos, path.color, 0.6, 2.6, 0.35); FX.light(pl.pos, path.color, 40, 0.3); }
    }
  }
  function startDodge(mx, mz, mag) {
    pl.setState('dodge'); pl.perfected = false;
    pl.dodgeBack = mag <= 0.3;
    if (pl.dodgeBack) { pl.ddx = -Math.sin(pl.yaw); pl.ddz = -Math.cos(pl.yaw); } else { pl.ddx = mx / mag; pl.ddz = mz / mag; pl.yaw = Math.atan2(mx, mz); }
    pl.inv = Math.max(pl.inv, 0.3); pl.dodgeCd = T.dodgeTime + T.dodgeCool;
    FX.puff(pl.pos, 2, 0.6); SC.audio.sfx('dodge'); SC.emit('speedlines', 0.35);
  }
  function perfectDodge() {
    pl.perfected = true; pl.inv = Math.max(pl.inv, 0.8); pl.gain(25); pl.stats.perfect++;
    SC.slowmo(0.28, 0.75); _a.copy(pl.pos); _a.y += 2.1; FX.word('TOO SLOW!', _a, '#ffffff', 1.5);
    SC.audio.sfx('perfect'); SC.emit('speedlines', 0.8); SC.emit('flash', '#ffffff');
  }

  /* called by anything that tries to hurt the player; returns true if it landed */
  SC.hitPlayer = function (dmg, fx, fz, heavy) {
    if (pl.state === 'dead' || pl.state === 'finish' || pl.state === 'scripted' || pl.state === 'revive' || pl.state === 'power' || !pl.control) return false;
    if (pl.state === 'dodge' && !pl.perfected && pl.st < (pl.path === 'shade' ? 0.3 : T.perfectWindow)) { perfectDodge(); return false; }
    if (pl.inv > 0) return false;
    pl.hp -= dmg; const dx = pl.pos.x - fx, dz = pl.pos.z - fz, d = Math.hypot(dx, dz) || 1;
    pl.vel.set(dx / d * (heavy ? 9 : 5), 0, dz / d * (heavy ? 9 : 5));
    pl.setState(heavy ? 'down' : 'hurt'); pl.inv = heavy ? 1.5 : 0.7; pl.hurtSide = Math.random() < 0.5 ? -1 : 1;
    _a.copy(pl.pos); _a.y += 1.4; FX.burst(_a, 0xff3b30, 1.4);
    if (heavy) { _a.y += 0.6; FX.word('KRAK!', _a, '#ff3b30', 1.5); }
    SC.time.hitstop = heavy ? 0.1 : 0.05; SC.cam.shake(heavy ? 0.6 : 0.3); SC.audio.sfx('hurt'); SC.emit('flash', '#ff3b30');
    if (pl.hp <= 0) { pl.hp = 0; die(); }
    return true;
  };
  function die() {
    if (pl.chance > 0) {
      pl.chance = 0; pl.stats.chances++; pl.setState('revive'); pl.inv = 4; SC.slowmo(0.2, 0.9); SC.emit('secondchance');
    } else { pl.setState('dead'); SC.cam.lock = null; SC.emit('dead'); }
  }

  /* ---------- powers: the character does every one of them in full view ---------- */
  function usePower(mx, mz, mag) {
    const path = SC.PATHS[pl.path], f = fwd(pl.yaw, _a);
    const dx = mag > 0.3 ? mx / mag : f.x, dz = mag > 0.3 ? mz / mag : f.z;
    pl.meter -= T.powerCost; pl.setState('power'); pl.pw = { id: pl.path, step: 0, hops: 0 }; pl.inv = Math.max(pl.inv, 1.2);
    SC.emit('power', pl.path);
    if (pl.path === 'ember') {
      const t = pickTarget(7, -0.2, dx, dz); pl.pw.from = pl.pos.clone();
      if (t) { face(t.pos.x, t.pos.z); const d = SC.dist2(pl.pos.x, pl.pos.z, t.pos.x, t.pos.z); pl.pw.dist = Math.max(0, d - 1.3); } else { if (mag > 0.3) pl.yaw = Math.atan2(mx, mz); pl.pw.dist = 2.4; }
      SC.audio.sfx('leap');
    } else if (pl.path === 'shade') {
      pl.pw.target = pickTarget(15, -0.3, dx, dz); if (!pl.pw.target && mag > 0.3) pl.yaw = Math.atan2(mx, mz);
      if (pl.pw.target) face(pl.pw.target.pos.x, pl.pw.target.pos.z);
      SC.audio.sfx('shade');
    } else {
      const t = pickTarget(11, 0.2, dx, dz); if (t) face(t.pos.x, t.pos.z); else if (mag > 0.3) pl.yaw = Math.atan2(mx, mz);
      pl.pw.targets = []; SC.audio.sfx('chainThrow');
    }
  }
  function emberImpact() {
    const path = SC.PATHS.ember, R = pl.rank > 1 ? 5.4 : 4.3, dmg = pl.rank > 1 ? 36 : 28;
    FX.ring(pl.pos, path.color, 0.8, R, 0.55); FX.ring(pl.pos, path.hot, 0.4, R * 0.7, 0.4);
    _a.copy(pl.pos); _a.y += 0.05; FX.spawn({ tex: G.tex.ink, pos: _a, ground: true, size: R * 1.1, life: 4, alpha: 0.75, rot: SC.rand(0, 6), hold: 0.7 });
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + SC.rand(-0.2, 0.2), r = R * SC.rand(0.45, 0.9); _b.set(pl.pos.x + Math.cos(a) * r, pl.pos.y + 0.8, pl.pos.z + Math.sin(a) * r);
      FX.spawn({ tex: G.tex.burst, pos: _b, size: 0.6, grow: 2.2, aspect: 0.55, life: SC.rand(0.3, 0.55), color: i % 2 ? path.color : path.hot, vel: v3(0, 3.5, 0), hold: 0.4 }); }
    _a.y += 2.2; FX.word(path.word, _a, path.cssHot, 2.4); FX.light(pl.pos, path.color, 140, 0.6);
    SC.cam.shake(0.9); SC.time.hitstop = 0.12; SC.audio.sfx('ember'); SC.emit('flash', path.css);
    for (const e of E) { if (!e.hittable() || Math.abs(e.pos.y - pl.pos.y) > 2.4) continue;
      const ex = e.pos.x - pl.pos.x, ez = e.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 0.01;
      if (d < R + e.r) { e.hit(dmg, ex / d, ez / d, { heavy: true, power: true }); e.burn = 3.5; } }
    for (const c of W.crates) if (c.alive && SC.dist2(c.x, c.z, pl.pos.x, pl.pos.z) < R && Math.abs(c.y - pl.pos.y) < 2) W.breakCrate(c);
  }
  function shadeStrike(t) {
    const path = SC.PATHS.shade, dx = t.pos.x - pl.pos.x, dz = t.pos.z - pl.pos.z, d = Math.hypot(dx, dz) || 1;
    _a.copy(pl.pos); _a.y += 1.2; FX.slash(_a, pl.yaw, path.color, 3.4, 0.9); FX.slash(_a, pl.yaw + 0.5, 0xffffff, 2.6, -0.7);
    _a.copy(t.pos); _a.y += 2.2; FX.word(path.word, _a, path.cssHot, 1.9);
    t.hit(pl.rank > 1 ? 40 : 34, dx / d, dz / d, { heavy: true, power: true, back: true });
    FX.light(pl.pos, path.color, 70, 0.4); SC.cam.shake(0.55); SC.time.hitstop = 0.1; SC.audio.sfx('shadeHit');
  }
  function shadeDest(t) {
    // the far side of the target, so the blow lands in the back; if that spot is over an edge or
    // behind a wall, try the flanks, then settle for the near side
    const dx = t.pos.x - pl.pos.x, dz = t.pos.z - pl.pos.z, d = Math.hypot(dx, dz) || 1, ux = dx / d, uz = dz / d, r = t.r + 0.95;
    const tries = [[ux, uz], [-uz, ux], [uz, -ux], [-ux, -uz]];
    for (let i = 0; i < tries.length; i++) {
      const cx = tries[i][0], cz = tries[i][1];
      _a.set(t.pos.x + cx * r, t.pos.y, t.pos.z + cz * r); W.collide(_a, pl.r, t.pos.y, pl.h);
      const g = W.ground(_a.x, _a.z, t.pos.y + 0.5), ox = _a.x - t.pos.x, oz = _a.z - t.pos.z, od = Math.hypot(ox, oz);
      if (Math.abs(g - t.pos.y) > 0.7 || od < 0.5 || od > r + 0.6) continue;
      if (W.ray(t.pos.x, t.pos.y + 0.4, t.pos.z, ox / od, 0, oz / od, od) < od - 0.02) continue;
      return _a;
    }
    return _a.copy(pl.pos);
  }
  function tetherCast() {
    const path = SC.PATHS.tether, f = fwd(pl.yaw, _a), max = pl.rank > 1 ? 5 : 3, list = [];
    for (const e of E) { if (!e.hittable() || Math.abs(e.pos.y - pl.pos.y) > 2.4) continue;
      const ex = e.pos.x - pl.pos.x, ez = e.pos.z - pl.pos.z, d = Math.hypot(ex, ez); if (d > 11) continue;
      if (d > 1.5 && (ex * f.x + ez * f.z) / d < 0.55) continue; list.push([d, e]); }
    list.sort((a, b) => a[0] - b[0]);
    pl.pw.targets = list.slice(0, max).map(a => a[1]);
    pl.pw.targets.forEach((e, i) => { e.bind(e.kind === 'boss' ? 1.8 : 3.8); e.hit(10, 0, 0, { power: true, quiet: true }); pl.chains[i].target = e; pl.chains[i].m.material.color.set(path.color); });
    if (!pl.pw.targets.length) { pl.meter = Math.min(T.meter, pl.meter + T.powerCost * 0.5); pl.chains[0].target = { pos: v3(pl.pos.x + f.x * 8, pl.pos.y, pl.pos.z + f.z * 8), h: 2.4, fake: true }; pl.chains[0].m.material.color.set(path.color); }
    FX.light(pl.pos, path.color, 60, 0.5); SC.audio.sfx('chain');
  }
  function tetherYank() {
    const path = SC.PATHS.tether, f = fwd(pl.yaw, _a), n = pl.pw.targets.length;
    pl.pw.targets.forEach((e, i) => { if (!alive(e)) return; const a = (i - (n - 1) / 2) * 0.55; e.pull = { x: pl.pos.x + Math.sin(pl.yaw + a) * 2.3, z: pl.pos.z + Math.cos(pl.yaw + a) * 2.3, t: 0.22 }; });
    if (n) { _b.copy(pl.pos).addScaledVector(f, 2); _b.y += 2.3; FX.word(path.word, _b, path.cssHot, 2); SC.cam.shake(0.5); SC.time.hitstop = 0.08; FX.ring(pl.pos, path.color, 0.5, 3.4, 0.4); }
    SC.audio.sfx('chainYank');
  }
  function updateChains() {
    for (const c of pl.chains) {
      if (!c.target) { c.m.visible = false; continue; }
      const t = c.target; if (!t.fake && !alive(t)) { c.target = null; c.m.visible = false; continue; }
      pl.hand(_a); _b.copy(t.pos); _b.y += (t.h || 1.8) * 0.6;
      _c.subVectors(_b, _a); const len = _c.length(); _c.cross(G.camera.getWorldDirection(v3())).normalize().multiplyScalar(0.11);
      const p = c.m.geometry.attributes.position;
      p.setXYZ(0, _a.x - _c.x, _a.y - _c.y, _a.z - _c.z); p.setXYZ(1, _a.x + _c.x, _a.y + _c.y, _a.z + _c.z);
      p.setXYZ(2, _b.x - _c.x, _b.y - _c.y, _b.z - _c.z); p.setXYZ(3, _b.x + _c.x, _b.y + _c.y, _b.z + _c.z); p.needsUpdate = true;
      c.tx.repeat.set(len / 0.42, 1); c.m.visible = true;
    }
  }
  function updatePower(dt) {
    const pw = pl.pw, st = pl.st, path = SC.PATHS[pw.id]; pl.vel.set(0, 0, 0);
    if (pw.id === 'ember') {
      const up = 0.4;
      if (st < up) { const k = st / up; pl.lift = Math.sin(k * Math.PI * 0.62) * 2.1; fwd(pl.yaw, _a);
        _b.copy(pl.pos); pl.pos.x = pw.from.x + _a.x * pw.dist * k; pl.pos.z = pw.from.z + _a.z * pw.dist * k; W.collide(pl.pos, pl.r, pl.pos.y, pl.h); pl.pose = P.leap; pl.poseRate = 22; }
      else { if (pw.step === 0) { pw.step = 1; pl.lift = 0; emberImpact(); } pl.pose = P.slamDown; pl.poseRate = 45; }
      if (st > 0.95) pl.setState('idle');
    } else if (pw.id === 'shade') {
      const t = pw.target;
      if (pw.step === 0) { pl.pose = P.cloak; pl.poseRate = 30;
        if (st > 0.14) { pw.step = 1; pw.t0 = st; _a.copy(pl.pos); FX.ink(_a, 4, 0.9); pl.model.group.visible = false; } }
      else if (pw.step === 1) {
        if (st - pw.t0 > 0.13) {
          if (alive(t)) { const d = shadeDest(t); pl.pos.copy(d); face(t.pos.x, t.pos.z); }
          else { fwd(pl.yaw, _a); for (let i = 0; i < 12; i++) { pl.pos.x += _a.x * 0.5; pl.pos.z += _a.z * 0.5; W.collide(pl.pos, pl.r, pl.pos.y, pl.h); } }
          pl.pos.y = W.ground(pl.pos.x, pl.pos.z, pl.pos.y + 0.6); pl.visY = pl.pos.y;
          pl.model.group.visible = true; _b.copy(pl.pos); _b.y -= 0.5; FX.ink(_b, 3, 0.7); pw.step = 2; pw.t0 = st; pl.model.anim.apply(P.cloak, 999, 0.016);
          if (alive(t)) shadeStrike(t);
        }
      } else {
        pl.pose = P.riseSlash; pl.poseRate = 40;
        if (st - pw.t0 > 0.24 && pl.rank > 1 && pw.hops < 1) {
          const n = pickTarget(11, -1, 0, 0, t);
          if (n && n !== t) { pw.hops++; pw.target = n; pw.step = 0; pl.st = 0.1; face(n.pos.x, n.pos.z); SC.audio.sfx('shade'); return; }
          pw.hops = 9;
        }
        if (st - pw.t0 > 0.42) pl.setState('idle');
      }
    } else {
      if (st < 0.18) { pl.pose = P.castWind; pl.poseRate = 30; }
      else if (st < 0.52) { if (pw.step === 0) { pw.step = 1; tetherCast(); } pl.pose = P.castThrow; pl.poseRate = 40; }
      else { if (pw.step === 1) { pw.step = 2; tetherYank(); } pl.pose = P.castYank; pl.poseRate = 35;
        if (st > 0.8) pl.chains.forEach(c => { c.target = null; });
        if (st > 1.0) pl.setState('idle'); }
    }
  }

  /* ---------- finisher: one of the few times the camera leaves the player's back ---------- */
  function finishable() {
    let best = null, bd = 3.2;
    for (const e of E) if (e.state === 'dazed' && Math.abs(e.pos.y - pl.pos.y) < 2) { const d = SC.dist2(pl.pos.x, pl.pos.z, e.pos.x, e.pos.z); if (d < bd) { bd = d; best = e; } }
    return best;
  }
  pl.finishable = finishable;
  function startFinisher(e) {
    pl.setState('finish'); pl.fin = { e, step: 0 }; pl.inv = 3; combat.freeze = e; e.state = 'held'; e.st = 0; e.vel.set(0, 0, 0);
    const dx = pl.pos.x - e.pos.x, dz = pl.pos.z - e.pos.z, d = Math.hypot(dx, dz) || 1;
    pl.pos.x = e.pos.x + dx / d * (e.r + 0.9); pl.pos.z = e.pos.z + dz / d * (e.r + 0.9); W.collide(pl.pos, pl.r, pl.pos.y, pl.h);
    face(e.pos.x, e.pos.z); e.yaw = Math.atan2(pl.pos.x - e.pos.x, pl.pos.z - e.pos.z);
    SC.cam.lock = null; SC.cam.finisher(pl, e); SC.slowmo(0.45, 0.5); SC.audio.sfx('finishWind'); SC.emit('letterbox', true);
  }
  function updateFinisher(dt) {
    const f = pl.fin, e = f.e, st = pl.st, path = SC.PATHS[pl.path || 'ember']; pl.vel.set(0, 0, 0);
    if (st < 0.42) { pl.pose = P.uppercutW; pl.poseRate = 20; }
    else {
      if (f.step === 0) {
        f.step = 1; pl.stats.finishers++;
        _a.copy(e.pos); _a.y += 1.5; FX.burst(_a, path.color, 3); FX.burst(_a, 0xffffff, 2);
        _a.y += 1.2; FX.word(e.kind === 'boss' ? 'PAID IN FULL!' : 'KA-THOOM!', _a, path.cssHot, 2.8);
        FX.ring(e.pos, path.color, 0.5, 4, 0.5); FX.light(e.pos, path.color, 160, 0.7); FX.ink(e.pos, 8, 1.6);
        SC.time.hitstop = 0.2; SC.cam.shake(1.1); SC.audio.sfx('finish'); SC.emit('flash', path.css);
        e.finished();
        if (pl.path === 'tether') pl.heal(12);
      }
      pl.pose = P.uppercut; pl.poseRate = 50; pl.lift = Math.max(0, Math.sin((st - 0.42) * 5) * 0.5) * (st < 1.05 ? 1 : 0);
    }
    if (st > 1.35) { pl.lift = 0; combat.freeze = null; pl.setState('idle'); SC.cam.endCine(0.45); SC.emit('letterbox', false); SC.emit('finisherEnd', e); }
  }

  pl.update = function (dt, rdt) {
    const inp = SC.input, can = pl.control && pl.state !== 'scripted';
    pl.t += dt; pl.st += dt; if (pl.inv > 0) pl.inv -= dt; pl.dodgeCd -= dt;
    let mx = 0, mz = 0, mag = 0;
    if (can) {
      const cy = SC.cam.yaw, sx = inp.move.x, sy = inp.move.y;
      mx = Math.sin(cy) * sy - Math.cos(cy) * sx; mz = Math.cos(cy) * sy + Math.sin(cy) * sx; mag = Math.min(1, Math.hypot(mx, mz));
    }
    pl.pose = null; pl.poseRate = 16;
    const free = pl.state === 'idle' || pl.state === 'run';
    const wantAtk = can && inp.buffered('attack', 0.22), wantDodge = can && inp.buffered('dodge', 0.18), wantPow = can && inp.buffered('power', 0.2), wantInt = can && inp.buffered('interact', 0.15);
    const inCombat = combat.active;

    if (can && inp.take('lock')) SC.cam.toggleLock();

    if (free || (pl.state === 'attack' && pl.st > 0.1)) {
      if (wantDodge && pl.dodgeCd <= 0 && pl.onGround) { inp.clear('dodge'); startDodge(mx, mz, mag); }
      else if (wantPow && pl.path && pl.onGround && free) { inp.clear('power'); if (pl.meter >= T.powerCost) usePower(mx, mz, mag); else { SC.emit('nometer'); SC.audio.sfx('deny'); } }
    }
    if (free) {
      if (wantInt && pl.onGround) {
        inp.clear('interact'); const e = finishable();
        if (e) startFinisher(e);
        else if (!inCombat) { const it = W.nearestInteract(pl.pos); if (it) { pl.vel.set(0, 0, 0); face(it.fx === undefined ? it.x : it.fx, it.fz === undefined ? it.z : it.fz); it.act(it); } }
      } else if (wantAtk && pl.onGround) { inp.clear('attack'); const e = finishable(); if (e && SC.dist2(pl.pos.x, pl.pos.z, e.pos.x, e.pos.z) < 2.2) startFinisher(e); else startAttack(0, mx, mz, mag); }
    }

    switch (pl.state) {
      case 'idle': case 'run': {
        const sp = T.playerSpeed * mag, k = 1 - Math.exp(-T.playerAccel / T.playerSpeed * dt);
        pl.vel.x += (mx / (mag || 1) * sp - pl.vel.x) * k; pl.vel.z += (mz / (mag || 1) * sp - pl.vel.z) * k;
        if (mag > 0.08) pl.yaw = SC.dampAng(pl.yaw, Math.atan2(mx, mz), T.turnRate, dt);
        pl.state = mag > 0.08 ? 'run' : 'idle';
        break; }
      case 'attack': {
        const A = P.ATTACK[pl.combo], f = fwd(pl.yaw, _a);
        if (pl.st < A.hit) pl.vel.set(f.x * pl.lunge, 0, f.z * pl.lunge); else pl.vel.multiplyScalar(Math.exp(-14 * dt));
        if (!pl.hitDone && pl.st >= A.hit) { pl.hitDone = true; attackHit(pl.combo); }
        if (wantAtk && pl.st > A.hit * 0.6) { inp.clear('attack'); pl.queued = true; }
        if (pl.queued && pl.st >= A.chain && pl.combo < 2) startAttack(pl.combo + 1, mx, mz, mag);
        else if (pl.st >= A.dur) pl.setState('idle');
        if (pl.state === 'attack') { pl.pose = P.attack(pl.combo, pl.st); pl.poseRate = 42; }
        break; }
      case 'dodge': {
        const k = pl.st / T.dodgeTime, sp = T.dodgeSpeed * (pl.path === 'shade' ? 1.28 : 1) * (1 - 0.72 * k);
        pl.vel.set(pl.ddx * sp, 0, pl.ddz * sp);
        if (pl.dodgeBack) { pl.pose = P.hurt(0); pl.pose = SC.mixPose(P.guard(0), P.leap, 0.35); pl.lift = Math.sin(Math.min(1, k) * Math.PI) * 0.45; pl.poseRate = 30; }
        else { pl.pose = P.roll(Math.min(1, k)); pl.poseRate = 60; }
        if (k >= 1) { pl.lift = 0; pl.setState('idle'); pl.model.anim.cur.hips[0] = 0; }
        break; }
      case 'hurt': pl.vel.multiplyScalar(Math.exp(-9 * dt)); pl.pose = P.hurt(pl.hurtSide); pl.poseRate = 30; if (pl.st > 0.34) pl.setState('idle'); break;
      case 'down': pl.vel.multiplyScalar(Math.exp(-6 * dt));
        pl.pose = pl.st < 0.75 ? P.down() : P.kneel(); pl.poseRate = pl.st < 0.75 ? 16 : 12; if (pl.st > 1.15) pl.setState('idle'); break;
      case 'power': updatePower(dt); break;
      case 'finish': updateFinisher(dt); break;
      case 'interact': pl.vel.set(0, 0, 0); pl.pose = P.kneel(); pl.poseRate = 10; break;
      case 'dead': pl.vel.multiplyScalar(Math.exp(-6 * dt)); pl.pose = P.down(); pl.poseRate = 12; break;
      case 'revive': {
        pl.vel.multiplyScalar(Math.exp(-6 * dt));
        if (pl.st < 0.9) { pl.pose = P.down(); pl.poseRate = 12; }
        else {
          if (!pl.revived) {
            pl.revived = true; pl.hp = T.hp * 0.5; pl.meter = Math.max(pl.meter, T.powerCost);
            const path = SC.PATHS[pl.path || 'ember']; FX.ring(pl.pos, path.color, 0.6, 6, 0.6); FX.ring(pl.pos, 0xffffff, 0.3, 4, 0.45); FX.light(pl.pos, path.color, 160, 0.8);
            _a.copy(pl.pos); _a.y += 2.6; FX.word('NOT YET!', _a, '#ffffff', 2.6); SC.cam.shake(1); SC.audio.sfx('revive'); SC.emit('flash', '#ffffff');
            for (const e of E) { if (!e.hittable()) continue; const ex = e.pos.x - pl.pos.x, ez = e.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 0.01; if (d < 6.5) e.hit(12, ex / d, ez / d, { heavy: true, power: true }); }
          }
          pl.pose = P.uppercut; pl.poseRate = 14;
          if (pl.st > 1.5) { pl.revived = false; pl.inv = 1.5; pl.setState('idle'); }
        }
        break; }
      case 'scripted': pl.vel.set(0, 0, 0); if (pl.script) pl.pose = pl.script(pl.st); pl.poseRate = pl.scriptRate || 8; break;
    }
    physics(pl, dt);
    pl.speed = Math.hypot(pl.vel.x, pl.vel.z);
    if (!pl.pose) {
      if (!pl.onGround) { pl.pose = SC.mixPose(P.leap, P.idle(pl.t), 0.45); pl.poseRate = 10; }
      else if (pl.state === 'run' || pl.speed > 0.6) { pl.runPh += pl.speed * dt * 1.72; pl.pose = P.run(pl.runPh, pl.speed / T.playerSpeed); pl.poseRate = 20;
        if (Math.sin(pl.runPh) * pl._ls < 0) SC.audio.sfx('step'); pl._ls = Math.sin(pl.runPh); }
      else { pl.pose = inCombat ? P.guard(pl.t) : P.idle(pl.t); pl.poseRate = 10; }
    }
    const m = pl.model; m.anim.apply(pl.pose, pl.poseRate, Math.max(dt, 0.0001));
    pl.visY = Math.abs(pl.visY - pl.pos.y) > 1.2 || !pl.onGround ? pl.pos.y : SC.damp(pl.visY, pl.pos.y, 22, dt);
    m.group.position.set(pl.pos.x, pl.visY, pl.pos.z); m.group.rotation.y = pl.yaw; m.inner.position.y = pl.lift;
    m.face(pl.state === 'hurt' || pl.state === 'down' ? 'hurt' : pl.state === 'dead' || (pl.state === 'revive' && pl.st < 0.9) ? 'dead' : pl.state === 'attack' || pl.state === 'power' || pl.state === 'finish' || pl.state === 'revive' ? 'angry'
      : pl.faceOverride || ((pl.t % 3.7) < 0.12 ? 'shut' : inCombat ? 'angry' : 'neutral'));
    m.tint(pl.inv > 0 && pl.state !== 'power' && pl.state !== 'finish' && pl.state !== 'dodge' && (pl.t * 14 | 0) % 2 ? 0.35 : 0);
    updateChains();
  };

  /* ====================== ENEMIES ====================== */
  const KINDS = SC.KINDS = {
    hollow: { hp: 42, speed: 3.4, r: 0.42, range: 1.75, wind: 0.56, rec: 0.75, dmg: 11, cool: [1.0, 2.1], atk: 'swing', ring: 3.4 },
    knifer: { hp: 30, speed: 4.9, r: 0.38, range: 5.4, wind: 0.46, rec: 0.85, dmg: 14, cool: [1.4, 2.6], atk: 'lunge', ring: 5.2 },
    bruiser: { hp: 130, speed: 2.6, r: 0.62, range: 2.5, wind: 0.88, rec: 1.1, dmg: 26, cool: [1.3, 2.1], atk: 'slam', armor: true, finisher: true, ring: 3 },
    boss: { hp: 400, speed: 4.2, r: 0.5, range: 2.9, wind: 0.48, rec: 0.8, dmg: 18, cool: [0.7, 1.3], atk: 'swing', armor: true, finisher: true, ring: 3 }
  };
  function Enemy(kind, x, y, z, enc) {
    const K = this.K = KINDS[kind]; this.kind = kind; this.enc = enc || null;
    const m = this.model = SC.makeHumanoid(kind); G.scene.add(m.group);
    this.pos = v3(x, y, z); this.vel = v3(); this.vy = 0; this.r = K.r; this.h = m.height; this.onGround = true;
    this.yaw = Math.atan2(pl.pos.x - x, pl.pos.z - z); this.hp = this.maxHp = K.hp;
    this.state = 'spawn'; this.st = 0; this.t = Math.random() * 10; this.cool = SC.rand(0.6, 1.8); this.strafe = Math.random() < 0.5 ? -1 : 1;
    this.runPh = Math.random() * 6; this.flash = 0; this.bound = 0; this.burn = 0; this.token = false; this.head = v3(); this.phase = 1; this.armorT = 0;
    m.group.position.copy(this.pos); m.group.scale.set(1, 0.02, 1);
    _a.copy(this.pos); _a.y += 0.05; FX.spawn({ tex: G.tex.ink, pos: _a, ground: true, size: 0.5, grow: 2.6, life: 1.4, rot: SC.rand(0, 6), hold: 0.6 });
    E.push(this);
  }
  SC.Enemy = Enemy;
  SC.spawnEnemy = (kind, x, y, z, enc) => new Enemy(kind, x, y, z, enc);
  const Ep = Enemy.prototype;
  Ep.hittable = function () { return !this.gone && this.state !== 'dead' && this.state !== 'spawn' && this.state !== 'held' && this.state !== 'wait' && !this.vanished; };
  Ep.release = function () { if (this.token) { this.token = false; combat.tokens = Math.max(0, combat.tokens - 1); } };
  Ep.bind = function (t) { this.release(); this.bound = t; if (this.state !== 'dazed') { this.state = 'bound'; this.st = 0; } this.vel.set(0, 0, 0); this.model.face('bound'); };
  Ep.hit = function (dmg, dx, dz, o) {
    o = o || {}; if (!this.hittable()) return;
    if (this.state === 'dazed') { this.flash = 0.1; return; }
    if (this.bound > 0) dmg *= 1.5;
    this.hp -= dmg; this.flash = 0.12;
    _a.copy(this.pos); _a.y += this.h * 0.68;
    if (!o.quiet) {
      FX.burst(_a, 0xffffff, o.heavy ? 1.7 : 1);
      if (o.heavy && !o.power) { _a.y += 0.7; FX.word(SC.pick(['WHAM!', 'KRAK!', 'POW!', 'THWAK!']), _a, '#ffe14a', 1.5); }
      SC.audio.sfx('hit', o.heavy ? 1 : 0);
    }
    const big = this.K.armor ? 0.3 : 1;
    this.vel.x += dx * (o.heavy ? 9 : 3.6) * big; this.vel.z += dz * (o.heavy ? 9 : 3.6) * big;
    if (this.hp <= 0) {
      this.hp = 0; this.release();
      if (this.K.finisher) { this.state = 'dazed'; this.st = 0; this.bound = 0; this.model.face('neutral'); SC.emit('dazed', this); SC.audio.sfx('dazed'); _a.y += 0.8; FX.word('FINISH!', _a, '#ffffff', 1.4); }
      else this.die(dx, dz, o);
      return;
    }
    if (this.state === 'bound') return;
    if (this.kind === 'boss') { if ((o.heavy || o.power) && this.armorT <= 0 && this.state !== 'leap' && this.state !== 'blink') { this.release(); this.state = 'hurt'; this.st = 0; this.armorT = 2.6; } return; }
    if (!this.K.armor || o.heavy || o.power) { this.release(); this.state = (o.heavy && !this.K.armor) ? 'down' : 'hurt'; this.st = 0; if (this.state === 'down') { this.vy = 4.5; this.onGround = false; } }
  };
  Ep.die = function (dx, dz, o) {
    this.state = 'dead'; this.st = 0; this.vel.set(dx * 7, 0, dz * 7); this.vy = 5.5; this.onGround = false; this.model.face('dead');
    pl.stats.kills++; pl.gain(12); if (pl.path === 'tether') pl.heal(4);
    if (SC.cam.lock === this) SC.cam.relock(this);
    SC.emit('kill', this);
  };
  Ep.finished = function () {
    this.state = 'dead'; this.st = 0; this.vel.set(0, 0, 0); this.vy = 13; this.onGround = false; this.model.face('dead'); this.wasFinished = true;
    pl.stats.kills++; pl.gain(30); SC.emit('kill', this);
  };
  Ep.remove = function () { this.gone = true; this.release(); G.scene.remove(this.model.group); const i = E.indexOf(this); if (i >= 0) E.splice(i, 1); if (SC.cam.lock === this) SC.cam.lock = null; };

  function steer(e, tx, tz, speed, dt) {
    let dx = tx - e.pos.x, dz = tz - e.pos.z; const d = Math.hypot(dx, dz) || 1; dx /= d; dz /= d;
    let vx = dx * speed * Math.min(1, d), vz = dz * speed * Math.min(1, d);
    for (const o of E) { if (o === e || o.gone || o.state === 'dead') continue; const ox = e.pos.x - o.pos.x, oz = e.pos.z - o.pos.z, od = Math.hypot(ox, oz); const min = e.r + o.r + 0.5; if (od < min && od > 0.001) { const k = (min - od) / min * 5; vx += ox / od * k; vz += oz / od * k; } }
    const k = 1 - Math.exp(-8 * dt); e.vel.x += (vx - e.vel.x) * k; e.vel.z += (vz - e.vel.z) * k;
  }
  function strike(e) {
    const K = e.K, f = fwd(e.yaw, _a), dx = pl.pos.x - e.pos.x, dz = pl.pos.z - e.pos.z, d = Math.hypot(dx, dz), dy = Math.abs(pl.pos.y + pl.lift - e.pos.y);
    if (K.atk === 'slam') {
      _b.copy(e.pos).addScaledVector(f, 1.5); FX.ring(_b, 0xff3b30, 0.5, 2.7, 0.4); FX.puff(_b, 5, 1.1); _c.copy(_b); _c.y += 1.6; FX.word('THOOM!', _c, '#ff3b30', 1.7);
      SC.cam.shake(0.6); SC.audio.sfx('slam');
      if (SC.dist2(pl.pos.x, pl.pos.z, _b.x, _b.z) < 2.6 && dy < 1.2) SC.hitPlayer(K.dmg, e.pos.x, e.pos.z, true);
      return;
    }
    const reach = (e.kind === 'boss' ? K.range : 1.75) + 0.35;
    if (d < reach && dy < 1.5 && (d < 0.8 || (dx * f.x + dz * f.z) / d > 0.25)) SC.hitPlayer(e.kind === 'boss' ? (e.sub === 2 ? 23 : K.dmg) : K.dmg, e.pos.x, e.pos.z, e.kind === 'boss' && e.sub === 2);
    _b.copy(e.pos).addScaledVector(f, 1.1); _b.y += 1.25; FX.slash(_b, e.yaw, e.kind === 'boss' ? 0xff3b30 : 0xdfe6ff, e.kind === 'boss' ? 3.2 : 2, SC.rand(-0.5, 0.5));
    SC.audio.sfx('whoosh', 1);
  }
  function alert(e) {
    FX.spawn({ tex: G.tex.alert, pos: e.head, follow: e.head, size: 0.5, grow: 1.1, life: 0.45, depthTest: false, order: 28, hold: 0.7 }); SC.audio.sfx('alert');
  }

  Ep.update = function (dt) {
    const e = this, K = e.K, m = e.model; e.t += dt; e.st += dt;
    if (combat.freeze && combat.freeze !== e) { return; }
    const dx = pl.pos.x - e.pos.x, dz = pl.pos.z - e.pos.z, d = Math.hypot(dx, dz) || 0.001, toYaw = Math.atan2(dx, dz);
    let pose = null, rate = 14;
    if (e.flash > 0) e.flash -= dt; if (e.armorT > 0) e.armorT -= dt;
    if (e.burn > 0 && e.hittable()) { e.burn -= dt; e.burnT = (e.burnT || 0) + dt; if (e.burnT > 0.5) { e.burnT = 0; _a.copy(e.pos); _a.y += 1.2; FX.spawn({ tex: G.tex.burst, pos: _a, size: 0.5, grow: 1.3, aspect: 0.6, life: 0.3, color: 0xff5a1f, vel: v3(0, 2.5, 0) }); if (e.state !== 'dazed' && e.hp > 3) { e.hp -= 3; e.flash = 0.06; } } }
    if (e.pull) { e.pull.t -= dt; const k = Math.min(1, dt / Math.max(0.02, e.pull.t + dt)); e.pos.x += (e.pull.x - e.pos.x) * k; e.pos.z += (e.pull.z - e.pos.z) * k; if (e.pull.t <= 0) e.pull = null; }

    switch (e.state) {
      case 'spawn': { const k = Math.min(1, e.st / 0.8); m.group.scale.set(1, SC.easeOut(k), 1); pose = P.lurk(e.t); if (k >= 1) { e.state = 'chase'; e.st = 0; } e.vel.set(0, 0, 0); break; }
      case 'chase': {
        e.cool -= dt; const dy = Math.abs(pl.pos.y - e.pos.y);
        const playerOK = pl.state !== 'dead' && pl.state !== 'scripted' && pl.control && dy < 1.6;
        if (e.kind === 'boss') { bossThink(e, d, toYaw, dt, playerOK); }
        else if (playerOK && e.cool <= 0 && combat.tokens < combat.maxTokens && d < K.range + 0.4) {
          e.token = true; combat.tokens++; e.state = 'windup'; e.st = 0; alert(e);
        }
        if (e.state === 'chase') {
          let tx = pl.pos.x, tz = pl.pos.z, sp = K.speed;
          const want = (e.cool <= 0.6 && combat.tokens < combat.maxTokens) ? K.range * 0.75 : K.ring + (e.kind === 'boss' ? 0 : 0.6);
          if (d < want + 0.5) { const a = Math.atan2(-dx, -dz) + e.strafe * 0.5; tx = pl.pos.x + Math.sin(a) * want; tz = pl.pos.z + Math.cos(a) * want; sp *= 0.6; if (Math.random() < dt * 0.25) e.strafe *= -1; }
          if (!playerOK && d < 3) sp = 0;
          steer(e, tx, tz, sp, dt);
          e.yaw = SC.dampAng(e.yaw, toYaw, 7, dt);
        }
        break; }
      case 'windup': {
        e.vel.multiplyScalar(Math.exp(-10 * dt)); if (e.st < K.wind * 0.75) e.yaw = SC.dampAng(e.yaw, toYaw, 9, dt);
        pose = P[K.atk](-(1 - e.st / K.wind)); rate = 26;
        if (e.st >= K.wind) { e.state = 'strike'; e.st = 0; e.struck = false; const f = fwd(e.yaw, _a);
          if (K.atk === 'lunge') e.vel.set(f.x * 18, 0, f.z * 18); else if (K.atk === 'swing') e.vel.set(f.x * 5, 0, f.z * 5); }
        break; }
      case 'strike': {
        pose = P[K.atk](e.st / 0.16); rate = 45;
        if (K.atk === 'lunge') { if (e.st > 0.22) e.vel.multiplyScalar(Math.exp(-14 * dt)); if (!e.struck && d < 1.25 && Math.abs(pl.pos.y - e.pos.y) < 1.5) { e.struck = true; SC.hitPlayer(K.dmg, e.pos.x - Math.sin(e.yaw), e.pos.z - Math.cos(e.yaw), false); } if (e.st < 0.05 && !e.sw) { e.sw = true; SC.audio.sfx('whoosh', 1); } }
        else { e.vel.multiplyScalar(Math.exp(-10 * dt)); if (!e.struck && e.st >= (K.atk === 'slam' ? 0.12 : 0.05)) { e.struck = true; strike(e); } }
        if (e.st > (K.atk === 'lunge' ? 0.34 : 0.3)) {
          if (e.kind === 'boss' && e.sub === 1) { e.sub = 2; e.state = 'windup'; e.st = K.wind * 0.45; alert(e); }
          else { e.state = 'recover'; e.st = 0; e.sw = false; }
        }
        break; }
      case 'recover': e.vel.multiplyScalar(Math.exp(-10 * dt)); pose = SC.mixPose(P[K.atk](1), P.lurk(e.t), SC.smooth(SC.clamp(e.st / K.rec, 0, 1))); rate = 10;
        if (e.st >= K.rec * (e.kind === 'boss' && e.phase > 1 ? 0.8 : 1)) { e.release(); e.state = 'chase'; e.st = 0; e.cool = SC.rand(K.cool[0], K.cool[1]); } break;
      case 'hurt': e.vel.multiplyScalar(Math.exp(-7 * dt)); pose = P.hurt(e.strafe); rate = 30; if (e.st > (e.kind === 'boss' ? 0.5 : 0.4)) { e.state = 'chase'; e.st = 0; e.cool = Math.max(e.cool, 0.5); } break;
      case 'down': e.vel.multiplyScalar(Math.exp(-3.5 * dt)); pose = e.st < 1.0 ? P.down() : P.kneel(); rate = e.st < 1 ? 18 : 10; if (e.st > 1.45) { e.state = 'chase'; e.st = 0; e.cool = SC.rand(0.4, 1.2); } break;
      case 'bound': e.vel.set(0, 0, 0); e.bound -= dt; pose = P.bound(e.t); rate = 30;
        if ((e.t * 3 | 0) !== ((e.t - dt) * 3 | 0)) FX.ring(e.pos, SC.PATHS.tether.color, 0.9, 1.3, 0.34);
        if (e.bound <= 0) { e.bound = 0; e.state = 'chase'; e.st = 0; e.model.face('neutral'); e.cool = SC.rand(0.5, 1.2); } break;
      case 'dazed': e.vel.multiplyScalar(Math.exp(-8 * dt)); pose = P.stunned(e.t); rate = 10;
        if ((e.t * 2 | 0) !== ((e.t - dt) * 2 | 0)) { _a.copy(e.head); FX.spawn({ tex: G.tex.burst, pos: _a, size: 0.5, grow: 0.9, life: 0.45, color: 0xffe14a, spin: 4 }); }
        if (e.st > (e.kind === 'boss' ? 7 : 5)) { e.hp = e.maxHp * (e.kind === 'boss' ? 0.12 : 0.25); e.state = 'chase'; e.st = 0; e.cool = 0.8; SC.emit('undazed', e); } break;
      case 'held': e.vel.set(0, 0, 0); pose = P.stunned(e.t); rate = 14; break;
      case 'wait': e.vel.set(0, 0, 0); pose = P.guard(e.t); rate = 8; break;
      case 'leap': bossLeap(e, dt); pose = e.pose; rate = 30; break;
      case 'blink': bossBlink(e, dt); pose = e.pose; rate = 30; break;
      case 'summon': e.vel.set(0, 0, 0); pose = e.st < 1 ? P.leap : P.lurk(e.t); rate = 12; e.yaw = SC.dampAng(e.yaw, toYaw, 5, dt); if (e.st > 1.5) { e.state = 'chase'; e.st = 0; e.cool = 0.6; } break;
      case 'dead': {
        pose = P.down(); rate = 20; e.vel.multiplyScalar(Math.exp(-2.5 * dt));
        const t0 = e.wasFinished ? 0.75 : 0.7;
        if (e.st > t0) { const k = Math.min(1, (e.st - t0) / 0.5); m.group.scale.setScalar(Math.max(0.02, 1 - k));
          if (!e.inked) { e.inked = true; _a.copy(e.pos); FX.ink(_a, 6, 1.3); _a.y += 1; FX.burst(_a, SC.PATHS[pl.path || 'ember'].color, 1.4); SC.audio.sfx('dissolve'); }
          if (k >= 1) { e.remove(); return; } }
        break; }
    }
    if (e.state !== 'dead' || !e.wasFinished) physics(e, dt); else { e.vy -= T.gravity * 0.5 * dt; e.pos.y += e.vy * dt; }
    if (e.enc && e.enc.arena && e.state !== 'dead') { const A = e.enc.arena; e.pos.x = SC.clamp(e.pos.x, A[0], A[2]); e.pos.z = SC.clamp(e.pos.z, A[1], A[3]); }
    if (e.pos.y < (e.enc && e.enc.floor !== undefined ? e.enc.floor - 0.5 : -1) && e.state !== 'dead') { e.pos.y = e.enc.floor; e.vy = 0; e.onGround = true; if (e.enc.arena) { e.pos.x = (e.enc.arena[0] + e.enc.arena[2]) / 2; e.pos.z = (e.enc.arena[1] + e.enc.arena[3]) / 2; } }
    if (!pose) { const sp = Math.hypot(e.vel.x, e.vel.z); if (sp > 0.5) { e.runPh += sp * dt * (e.kind === 'boss' ? 1.7 : 2.3); pose = e.kind === 'boss' || e.kind === 'knifer' ? P.run(e.runPh, sp / K.speed) : P.shamble(e.runPh, sp / K.speed + 0.5, e.t); } else pose = e.kind === 'boss' ? P.guard(e.t) : P.lurk(e.t); }
    m.anim.apply(pose, rate, Math.max(dt, 0.0001));
    m.group.position.copy(e.pos); m.group.rotation.y = e.yaw; m.group.visible = !e.vanished;
    m.tint(e.flash > 0 ? 0.9 : 0);
    if (e.state === 'windup' || e.state === 'strike') m.face('angry'); else if (e.state === 'chase' || e.state === 'recover') m.face('neutral');
    e.head.set(e.pos.x, e.pos.y + e.h + 0.45, e.pos.z);
  };

  /* ---------- Deacon Voss ---------- */
  function bossThink(e, d, toYaw, dt, ok) {
    if (!ok) return;
    if (e.phase === 1 && e.hp < e.maxHp * 0.5) { e.phase = 2; e.state = 'summon'; e.st = 0; e.armorT = 2; _a.copy(e.head); FX.word('RISE!', _a, '#ff3b30', 2.2); SC.cam.shake(0.8); SC.audio.sfx('roar'); SC.emit('bossPhase', e); return; }
    if (e.cool > 0) return;
    const r = Math.random();
    if (d > 6.5 || (r < 0.28 && d > 3)) { e.state = 'leap'; e.st = 0; e.lp = { step: 0, tx: pl.pos.x, tz: pl.pos.z }; alert(e); }
    else if (e.phase > 1 && r < 0.6) { e.state = 'blink'; e.st = 0; e.lp = { step: 0 }; alert(e); }
    else if (d < e.K.range + 0.6) { e.state = 'windup'; e.st = 0; e.sub = 1; e.token = true; combat.tokens++; alert(e); }
  }
  function bossLeap(e, dt) {
    const l = e.lp;
    if (l.step === 0) { e.vel.set(0, 0, 0); e.pose = P.uppercutW; e.yaw = SC.dampAng(e.yaw, Math.atan2(l.tx - e.pos.x, l.tz - e.pos.z), 10, dt);
      if (!l.ring) { l.ring = true; _a.set(l.tx, pl.pos.y, l.tz); l.y = pl.pos.y; FX.spawn({ tex: G.tex.ring, pos: _a.setY(_a.y + 0.07), ground: true, size: 6.6, grow: 6.2, life: 1.1, color: 0xff3b30, spin: 2, hold: 0.9 }); }
      if (e.st > 0.5) { l.step = 1; l.t = 0; l.x0 = e.pos.x; l.z0 = e.pos.z; SC.audio.sfx('leap'); } }
    else if (l.step === 1) { l.t += dt / 0.55; const k = Math.min(1, l.t); e.pos.x = SC.lerp(l.x0, l.tx, k); e.pos.z = SC.lerp(l.z0, l.tz, k); e.model.inner.position.y = Math.sin(k * Math.PI) * 3.2; e.pose = P.leap; e.vel.set(0, 0, 0);
      if (k >= 1) { l.step = 2; e.st = 0; e.model.inner.position.y = 0; FX.ring(e.pos, 0xff3b30, 0.6, 3.5, 0.5); FX.puff(e.pos, 6, 1.3); _a.copy(e.pos); _a.y += 2; FX.word('KRA-KOOM!', _a, '#ff3b30', 2.1); SC.cam.shake(0.9); SC.audio.sfx('slam');
        if (SC.dist2(pl.pos.x, pl.pos.z, e.pos.x, e.pos.z) < 3.3 && Math.abs(pl.pos.y - e.pos.y) < 1.4) SC.hitPlayer(30, e.pos.x, e.pos.z, true); } }
    else { e.pose = P.slamDown; if (e.st > 1.05) { e.state = 'chase'; e.st = 0; e.cool = SC.rand(0.5, 1.1); } }
  }
  function bossBlink(e, dt) {
    const l = e.lp; e.vel.set(0, 0, 0);
    if (l.step === 0) { e.pose = P.cloak; if (e.st > 0.3) { l.step = 1; e.vanished = true; FX.ink(e.pos, 7, 1.5); SC.audio.sfx('shade'); } }
    else if (l.step === 1) { if (e.st > 0.75) { l.step = 2; const f = fwd(pl.yaw, _a); e.pos.set(pl.pos.x - f.x * 1.9, pl.pos.y, pl.pos.z - f.z * 1.9); W.collide(e.pos, e.r, e.pos.y, e.h);
        e.yaw = Math.atan2(pl.pos.x - e.pos.x, pl.pos.z - e.pos.z); e.vanished = false; FX.ink(e.pos, 7, 1.5); e.state = 'windup'; e.st = e.K.wind * 0.3; e.sub = 2; e.token = true; combat.tokens++; alert(e); } }
  }

  SC.updateEnemies = function (dt) {
    for (let i = E.length - 1; i >= 0; i--) E[i].update(dt);
    let act = false;
    for (const e of E) if (e.state !== 'dead' && SC.dist2(e.pos.x, e.pos.z, pl.pos.x, pl.pos.z) < 20 && Math.abs(e.pos.y - pl.pos.y) < 5) { act = true; break; }
    combat.active = act;
    if (!E.length) combat.tokens = 0;
  };
  SC.clearEnemies = function () { while (E.length) E[0].remove(); combat.tokens = 0; combat.freeze = null; };
})();
