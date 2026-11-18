// Underground Syndicate — real-time one-on-one combat. Simulation runs in "sim units" (32 per world unit),
// and is mirrored every frame onto the 3D isometric pit.
(function () {
  const G = window.G, A = G.ABILITIES, T = THREE, gfx = G.gfx, S = gfx.S;
  const RAD = G.world.AR * S, ER = 16;
  const F = G.fight = { active: false, paused: false, speed: 1 };
  let P, E, projs, zones, fx, time, hitstop, phase, phaseT, hype, opp, shake, result, lastAb, stolen, arena, sc, camVh = 12;

  const rand = G.rand, clamp = G.clamp;
  function clampArena(o) {
    o.x = clamp(o.x, -RAD, RAD); o.y = clamp(o.y, -RAD, RAD);
    const k = (Math.abs(o.x) + Math.abs(o.y)) / RAD;
    if (k > 1.5) { const f = 1.5 / k; o.x *= f; o.y *= f; }
  }
  const inArena = (x, y, m) => Math.abs(x) < RAD + m && Math.abs(y) < RAD + m && Math.abs(x) + Math.abs(y) < 1.5 * RAD + m * 1.4;

  function makeEntity(h, d, look, isPlayer) {
    const C = G.CLASSES[h.cls];
    return {
      isPlayer, name: h.name, cls: h.cls, C, look, stats: h.stats, level: h.level, d,
      x: isPlayer ? (gfx.portrait ? 105 : -150) : (gfx.portrait ? -105 : 150), y: isPlayer ? (gfx.portrait ? 105 : 150) : (gfx.portrait ? -105 : -150), z: 0, kx: 0, ky: 0, aim: isPlayer ? (gfx.portrait ? -2.36 : -0.78) : (gfx.portrait ? 0.78 : 2.36),
      hp: d.maxHp, maxHp: d.maxHp, res: 100, shield: 0,
      basic: C.basic, kit: (h.slots || h.known).filter(Boolean), ult: h.ult || null, cds: {}, dodgeT: 0,
      state: 'idle', t: 0, act: null, st: {}, buffs: {}, iframe: 0, flash: 0, walk: 0, moving: false, koT: 0,
      intent: { mx: 0, my: 0, aim: 0, pt: { x: 0, y: 0 }, attack: false, queue: [] }, buf: null,
      potions: 0, ai: null, think: 0.6, strafe: 1, strafeT: 1, combo: 0, lastSeen: { x: 0, y: 0 }, auraT: 0, dmgDealt: 0, vis: null
    };
  }

  F.start = function (o) {
    opp = o; const st = G.state, h = st.hero;
    arena = G.world.get('arena'); sc = arena.scene; gfx.setScene(sc);
    if (F.P) [F.P, F.E].forEach(e => { if (e.vis) { sc.remove(e.vis.g); if (e.vis.tele) sc.remove(e.vis.tele); } });
    (fx || []).forEach(killFx); (projs || []).forEach(p => p.m && sc.remove(p.m)); (zones || []).forEach(z => z.m && sc.remove(z.m));
    gfx.clearFloats();
    const pd = G.derive(h, st);
    P = makeEntity(h, pd, G.lookOf(h, st), true);
    P.potions = st.potions + pd.freePotion; P.startPotions = st.potions;
    if (pd.ward) P.shield = pd.ward;
    const eh = { name: o.name, cls: o.cls, race: o.race, level: o.level, stats: G.baseStats(o.cls, o.race), sub: o.sub || null, feats: [], known: o.known, ult: o.ult || null, tint: o.tint, scale: o.scale };
    const prim = G.CLASSES[o.cls].primary; eh.stats[prim] += Math.floor(o.level / 2); eh.stats.con += Math.floor(o.level / 3);
    const ed = G.derive(eh, null);
    ed.maxHp = Math.round(ed.maxHp * o.hpMul); ed.dmgMul *= o.dmgMul;
    E = makeEntity(eh, ed, G.lookOf(eh, null), false);
    E.ai = Object.assign({ react: 0.5, aggro: 0.5, dodge: 0.1 }, o.ai); E.boss = o.boss;
    P.foe = E; E.foe = P;
    [P, E].forEach(makeVis);
    if (!arena.flash.parent) sc.add(arena.flash);
    projs = []; zones = []; fx = []; time = 0; hitstop = 0; shake = 0; hype = 20; lastAb = null; stolen = 0;
    phase = 'intro'; phaseT = 1.8; result = null; F.said = 0;
    gfx.cam.x = 0; gfx.cam.z = 0; gfx.cam.y = 0.9; camVh = gfx.cam.vh = gfx.portrait ? 17 : 15;
    F.active = true; F.paused = false; F.P = P; F.E = E;
    G.ui.buildHud(P, E); G.ui.banner(o.name, o.title);
    G.sfx('bell'); G.sfx('crowd');
    sync(0);
  };

  // ------------------------------------------------------------------ visuals attached to each fighter
  const basicMat = (color, op, add) => new T.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false, side: T.DoubleSide, blending: add ? T.AdditiveBlending : T.NormalBlending });
  const flat = (m, a) => { m.rotation.set(-Math.PI / 2, 0, -(a || 0)); return m; };
  function makeVis(e) {
    const g = new T.Group(), c = G.makeChar(e.look); g.add(c.root);
    const ring = flat(new T.Mesh(new T.RingGeometry(0.52, 0.62, 28), basicMat(e.isPlayer ? 0xffd36b : 0xff5040, 0.7))); ring.position.y = 0.03; g.add(ring);
    const ward = new T.Mesh(new T.SphereGeometry(1.15, 14, 10), basicMat(0xffe9a0, 0.22, true)); ward.position.y = 1; ward.visible = false; g.add(ward);
    const aura = flat(new T.Mesh(new T.RingGeometry(0.9, 1, 48), basicMat(0xc8f0ff, 0.6, true))); aura.position.y = 0.05; aura.visible = false; g.add(aura);
    const auraOrbs = []; for (let i = 0; i < 5; i++) auraOrbs.push(gfx.glow(0xc8f0ff, 0.9, 0, 1, 0, g, 0.9)); auraOrbs.forEach(o => o.visible = false);
    const mark = gfx.glow(0xfff0a0, 0.8, 0, 2.5, 0, g, 0.9); mark.visible = false;
    const guard = new T.Mesh(new T.TorusGeometry(0.8, 0.05, 6, 20, Math.PI), basicMat(0x9fd0ff, 0.9, true)); guard.position.y = 1.1; guard.visible = false; g.add(guard);
    const stars = []; for (let i = 0; i < 3; i++) { const s = gfx.glow(0xffe27a, 0.35, 0, 2.3, 0, g, 1); s.visible = false; stars.push(s); }
    sc.add(g);
    e.vis = { g, c, ring, ward, aura, auraOrbs, mark, guard, stars, tele: null, teleAct: null };
  }
  function syncEntity(e) {
    const v = e.vis, X = e.x / S, Z = e.y / S;
    v.g.position.set(X, e.z / S, Z);
    v.c.root.rotation.y = Math.atan2(Math.cos(e.aim), Math.sin(e.aim));
    let act = 'idle', prog = 0, glow = null;
    if (e.state === 'ko') { act = 'ko'; prog = e.koT; }
    else if (e.st.stun) act = 'stun';
    else if (e.state === 'dodge') { act = 'dodge'; prog = 1 - e.t / 0.3; }
    else if (e.act) {
      const ab = e.act.ab, melee = ab.type === 'melee' && !ab.spell;
      if (e.state === 'wind') { prog = 1 - e.t / (ab.wind || 0.01); act = melee ? 'swing' : 'cast'; if (melee) prog *= 0.5; glow = ab.color; }
      else { prog = 1 - e.t / (ab.rec || 0.01); act = melee ? 'swing' : 'idle'; if (melee) prog = 0.5 + prog * 0.5; }
    }
    const alpha = e.buffs.stealth ? (e.isPlayer ? 0.4 : 0.1) : 1;
    v.c.pose({ moving: e.moving, walk: e.walk, act, prog, flash: e.flash, alpha, t: time + (e.isPlayer ? 0 : 1.7), glow });
    const alive = e.state !== 'ko';
    v.ring.visible = alive && alpha > 0.3; v.ring.position.y = 0.03 - e.z / S;
    v.ward.visible = alive && e.shield > 0; if (v.ward.visible) v.ward.material.opacity = 0.18 + Math.sin(time * 6) * 0.06;
    v.mark.visible = alive && !!e.st.mark; v.guard.visible = alive && !!e.buffs.counter; if (v.guard.visible) v.guard.rotation.y = v.c.root.rotation.y - Math.PI / 2;
    v.stars.forEach((s, i) => { s.visible = alive && !!e.st.stun; const a = time * 6 + i * 2.09; s.position.set(Math.cos(a) * 0.4, 2.25, Math.sin(a) * 0.4); });
    const au = alive && !!e.buffs.aura, ar = A.spirit_guardians.aura.radius / S;
    v.aura.visible = au; v.aura.scale.setScalar(ar);
    v.auraOrbs.forEach((o, i) => { o.visible = au; const a = time * 2.4 + i * 1.257; o.position.set(Math.cos(a) * ar * 0.8, 1 + Math.sin(time * 3 + i) * 0.3, Math.sin(a) * ar * 0.8); });
    if (alive) {
      if (e.st.burn && Math.random() < 0.5) gfx.emit(X + rand(-0.3, 0.3), rand(0.4, 1.8), Z + rand(-0.3, 0.3), 0, 2.5, 0, 0.4, 0xff8a2a, 0);
      if (e.st.poison && Math.random() < 0.3) gfx.emit(X + rand(-0.3, 0.3), rand(0.4, 1.8), Z + rand(-0.3, 0.3), 0, 1.5, 0, 0.5, 0x8fe05a, 0);
      if (e.st.slow && Math.random() < 0.3) gfx.emit(X + rand(-0.4, 0.4), 0.1, Z + rand(-0.4, 0.4), 0, 0.6, 0, 0.5, 0x9fe0ff, 0);
    }
    // telegraph for the action being wound up
    const want = e.state === 'wind' && e.act ? e.act : null;
    if (v.teleAct !== want) {
      if (v.tele) { sc.remove(v.tele); v.tele.geometry.dispose(); v.tele = null; }
      v.teleAct = want;
      if (want) {
        const ab = want.ab, hostile = !e.isPlayer, color = hostile ? 0xff3a30 : 0xffffff;
        let geo = null, px = X, pz = Z, a = want.aim;
        if (ab.type === 'melee' && (ab.wind >= 0.2 || hostile)) { const arc = ab.arc * Math.PI / 180; geo = new T.CircleGeometry((ab.range + (ab.lunge || 0) * 0.6) / S, 20, -arc / 2, arc); v.follow = true; }
        else if (ab.type === 'line') { geo = new T.PlaneGeometry(ab.range / S, ab.width * 2 / S); geo.translate(ab.range / S / 2, 0, 0); v.follow = true; }
        else if (ab.type === 'aoe' && ab.at !== 'target') { geo = new T.CircleGeometry(ab.radius / S, 32); if (ab.at === 'point') { px = want.pt.x / S; pz = want.pt.y / S; v.follow = false; } else v.follow = true; a = 0; }
        if (geo) { v.tele = flat(new T.Mesh(geo, basicMat(color, 0.2)), a); v.tele.position.set(px, 0.04, pz); sc.add(v.tele); }
      }
    }
    if (v.tele) { if (v.follow) v.tele.position.set(X, 0.04, Z); v.tele.material.opacity = 0.12 + (1 - e.t / (e.act.ab.wind || 0.01)) * (e.isPlayer ? 0.12 : 0.3); }
  }

  // ------------------------------------------------------------------ transient effects
  function killFx(f) { if (f.obj) { sc.remove(f.obj); f.obj.traverse(o => { if (o.geometry && !o.isSprite) o.geometry.dispose(); if (o.material && o.material.dispose) o.material.dispose(); }); f.obj = null; } }
  function flashLight(x, y, color, power) { const L = arena.flash; L.position.set(x / S, 1.6, y / S); L.color.set(color); L.intensity = Math.max(L.intensity, power); }
  function buildFx(f) {
    const g = f.obj = new T.Group(); sc.add(g);
    const k = f.k, col = f.col;
    if (k === 'slash') {
      const m = flat(new T.Mesh(new T.RingGeometry(f.r / S * 0.5, f.r / S, 22, 1, -f.arc / 2, f.arc), basicMat(col, 0.9, true)), f.a); g.add(m); g.position.set(f.x / S, 1.0, f.y / S);
      f.upd = p => { m.material.opacity = 0.9 * (1 - p); g.scale.setScalar(0.85 + p * 0.25); };
    } else if (k === 'cone') {
      const m = flat(new T.Mesh(new T.CircleGeometry(f.r / S, 18, -f.arc / 2, f.arc), basicMat(col, 0.7, true)), f.a); g.add(m); g.position.set(f.x / S, 0.7, f.y / S);
      const m2 = flat(new T.Mesh(new T.CircleGeometry(f.r / S * 0.6, 14, -f.arc / 2, f.arc), basicMat(0xfff0c0, 0.7, true)), f.a); m2.position.y = 0.2; g.add(m2);
      f.upd = p => { m.material.opacity = 0.7 * (1 - p * p); m2.material.opacity = 0.7 * (1 - p); g.scale.setScalar(0.5 + p * 0.6); };
    } else if (k === 'bolt' || k === 'trail') {
      const dx = (f.x2 - f.x1) / S, dz = (f.y2 - f.y1) / S, L = Math.hypot(dx, dz) || 0.01, a = Math.atan2(dz, dx);
      g.position.set(f.x1 / S, 1.1, f.y1 / S); g.rotation.y = -a;
      const core = new T.Mesh(new T.BoxGeometry(L, k === 'bolt' ? 0.1 : 0.5, k === 'bolt' ? 0.1 : 0.5), basicMat(k === 'bolt' ? 0xffffff : col, 0.9, true)); core.position.x = L / 2; g.add(core);
      const lines = [];
      if (k === 'bolt') {
        for (let j = 0; j < 4; j++) { const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(new Float32Array(16 * 3), 3)); const ln = new T.Line(geo, new T.LineBasicMaterial({ color: col, transparent: true, blending: T.AdditiveBlending })); g.add(ln); lines.push(ln); }
        for (let j = 0; j <= 6; j++) gfx.glow(col, 1.6, L * j / 6, 0, 0, g, 0.7);
      }
      f.upd = p => {
        core.material.opacity = 0.9 * (1 - p); core.scale.set(1, 1 - p, 1 - p);
        lines.forEach(ln => { const ps = ln.geometry.attributes.position.array; for (let i = 0; i < 16; i++) { const e = (i === 0 || i === 15) ? 0 : 1; ps[i * 3] = L * i / 15; ps[i * 3 + 1] = rand(-0.4, 0.4) * e; ps[i * 3 + 2] = rand(-0.5, 0.5) * e; } ln.geometry.attributes.position.needsUpdate = true; ln.material.opacity = 1 - p; });
        g.children.forEach(o => { if (o.isSprite) o.material.opacity = 0.7 * (1 - p); });
      };
    } else if (k === 'blast') {
      g.position.set(f.x / S, 0, f.y / S); const r = f.r / S;
      const ring = flat(new T.Mesh(new T.RingGeometry(0.82, 1, 40), basicMat(col, 0.9, true))); ring.position.y = 0.06; g.add(ring);
      const ball = new T.Mesh(new T.SphereGeometry(1, 14, 10), basicMat(col, 0.7, true)); ball.position.y = 0.4; g.add(ball);
      const gl = gfx.glow(0xffffff, r * 3, 0, 0.8, 0, g, 0.9);
      let pil = null; if (f.pillar) { pil = new T.Mesh(new T.CylinderGeometry(r * 0.5, r * 0.6, 9, 14, 1, true), basicMat(col, 0.6, true)); pil.position.y = 4.5; g.add(pil); }
      f.upd = p => { ring.scale.setScalar(r * (0.5 + p * 0.7)); ring.material.opacity = 0.9 * (1 - p); ball.scale.set(r * (0.4 + p * 0.5), r * (0.3 + p * 0.5), r * (0.4 + p * 0.5)); ball.material.opacity = 0.7 * (1 - p) * (1 - p); gl.material.opacity = 0.9 * (1 - p); if (pil) { pil.material.opacity = 0.6 * (1 - p); pil.scale.set(1 - p * 0.5, 1, 1 - p * 0.5); } };
    } else if (k === 'ring') {
      const ring = flat(new T.Mesh(new T.RingGeometry(0.85, 1, 36), basicMat(col, 0.9, true))); g.add(ring); g.position.set(f.x / S, 0.06, f.y / S);
      f.upd = p => { ring.scale.setScalar(0.4 + f.r / S * p); ring.material.opacity = 0.9 * (1 - p); };
    } else if (k === 'lob') {
      gfx.glow(col, 1.8, 0, 0, 0, g, 1); g.add(new T.Mesh(new T.SphereGeometry(0.16, 8, 6), new T.MeshBasicMaterial({ color: 0xfff0c0 })));
      f.upd = p => { const x = G.lerp(f.x1, f.x2, p) / S, z = G.lerp(f.y1, f.y2, p) / S, y = 1.2 + Math.sin(p * Math.PI) * 4; g.position.set(x, y, z); gfx.emit(x, y, z, rand(-0.5, 0.5), 0, rand(-0.5, 0.5), 0.35, col, 0); };
    } else if (k === 'smoke') {
      g.position.set(f.x / S, 0, f.y / S); const balls = [];
      for (let i = 0; i < 7; i++) { const b = new T.Mesh(new T.SphereGeometry(0.6, 8, 6), basicMat(0x5a5a66, 0.5)); const a = i * 0.9; b.userData.d = [Math.cos(a), Math.sin(a)]; b.position.y = 0.5 + i * 0.18; g.add(b); balls.push(b); }
      f.upd = p => balls.forEach(b => { b.position.x = b.userData.d[0] * p * 1.6; b.position.z = b.userData.d[1] * p * 1.6; b.scale.setScalar(1 + p * 1.4); b.material.opacity = 0.5 * (1 - p); });
    } else f.upd = () => { };
  }
  function syncProj(p) {
    if (!p.m) {
      const ab = p.ab, g = p.m = new T.Group();
      if (ab.shape === 'knife' || ab.shape === 'shard') { g.add(new T.Mesh(new T.BoxGeometry(0.7, 0.07, 0.14), new T.MeshBasicMaterial({ color: ab.color }))); g.rotation.y = -p.a; if (ab.shape === 'shard') gfx.glow(ab.color, 1.2, 0, 0, 0, g, 0.7); }
      else { g.add(new T.Mesh(new T.SphereGeometry(p.r / S * 0.6, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff }))); gfx.glow(ab.color, p.r / S * 6, 0, 0, 0, g, 1); }
      sc.add(g);
    }
    p.m.position.set(p.x / S, 1.05, p.y / S);
  }
  function syncZone(z) {
    if (!z.m) {
      const hostile = !z.owner.isPlayer, g = z.m = new T.Group(), r = z.r / S;
      g.add(flat(new T.Mesh(new T.CircleGeometry(r, 36), basicMat(hostile ? 0xff3a30 : 0xffffff, hostile ? 0.22 : 0.12))));
      g.add(flat(new T.Mesh(new T.RingGeometry(r * 0.95, r, 40), basicMat(hostile ? 0xff5a46 : 0xffffff, 0.8))));
      z.grow = flat(new T.Mesh(new T.RingGeometry(0.93, 1, 40), basicMat(z.ab.color, 0.9, true))); z.grow.position.y = 0.01; g.add(z.grow);
      g.position.set(z.x / S, 0.045, z.y / S); sc.add(g);
    }
    z.grow.scale.setScalar(Math.max(0.01, z.r / S * (z.delay ? z.t / z.delay : 1)));
  }

  // ------------------------------------------------------------------ helpers
  function text(e, s, col, big) { gfx.floatText(e.x / S, 2.3 + rand(0, 0.3), e.y / S, s, col || '#fff', big); }
  function spark(x, y, z, col, n, sp) { gfx.burst(x / S, (z || 30) / S, y / S, col, n, (sp || 160) / S, 3); }
  function addHype(v) { hype = clamp(hype + v, 0, 100); }
  function angDiff(a, b) { let d = a - b; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; return Math.abs(d); }
  function segDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1;
    const t = clamp(((px - ax) * dx + (py - ay) * dy) / l, 0, 1);
    return Math.hypot(px - ax - dx * t, py - ay - dy * t);
  }
  function setBuff(e, k, dur, amt) { e.buffs[k] = { t: dur, amt: amt || 0 }; }
  function heal(e, v) { v = Math.round(v * e.d.healMul); e.hp = Math.min(e.maxHp, e.hp + v); text(e, '+' + v, '#7dffa0'); spark(e.x, e.y, 30, '#7dffa0', 14, 90); G.sfx('heal'); }

  // ------------------------------------------------------------------ damage
  function hit(att, tgt, ab, o) {
    o = o || {};
    if (tgt.state === 'ko' || phase !== 'fight') return false;
    if (tgt.iframe > 0) {
      text(tgt, 'DODGED', '#9fe8ff');
      if (tgt.isPlayer && !tgt.dodgeCredit) { addHype(12); tgt.dodgeCredit = 1; }
      return false;
    }
    if (tgt.buffs.counter && !o.noCounter) {
      delete tgt.buffs.counter; text(tgt, 'RIPOSTE!', '#9fd0ff', true); G.sfx('crit');
      fx.push({ k: 'slash', x: tgt.x, y: tgt.y, a: Math.atan2(att.y - tgt.y, att.x - tgt.x), r: 80, arc: 2.2, col: '#9fd0ff', t: 0, life: 0.22 });
      if (Math.hypot(att.x - tgt.x, att.y - tgt.y) < 160) hit(tgt, att, A.riposte_hit, { noCounter: 1 });
      if (tgt.isPlayer) addHype(15);
      return false;
    }
    let dmg = G.roll(ab.dmg) + (ab.stat ? G.mod(att.stats[ab.stat]) : 0);
    if (ab.basic || (ab.type === 'melee' && !ab.spell)) dmg += att.d.weapon;
    if (att.d.fireBonus && ab.fire) dmg += ab.dmg[0];
    if (att.d.radiantMelee && ab.type === 'melee') dmg += G.roll([1, 6]);
    let crit = Math.random() < att.d.crit, sneak = false;
    if (att.buffs.sneak) { crit = true; sneak = true; dmg += G.roll([att.d.sneakDice, 6]); delete att.buffs.sneak; delete att.buffs.stealth; }
    let mul = att.d.dmgMul * (1 + (att.buffs.dmg ? att.buffs.dmg.amt : 0)) * (o.power || 1);
    if (ab.execute && tgt.hp / tgt.maxHp < 0.4) mul *= 2;
    if (crit) mul *= att.d.critMul;
    if (tgt.st.mark) mul *= 1.25;
    if (att.d.tactical && (tgt.st.stun || tgt.st.slow)) mul *= 1.3;
    dmg = Math.max(1, Math.round(dmg * mul * (1 - tgt.d.dr)));
    if (tgt.shield > 0) { const a = Math.min(tgt.shield, dmg); tgt.shield -= a; dmg -= a; if (a) text(tgt, 'WARD -' + a, '#ffe9a0'); }
    if (dmg > 0) {
      tgt.hp -= dmg; att.dmgDealt += dmg;
      text(tgt, (sneak ? 'SNEAK ' : '') + dmg + (crit ? '!' : ''), crit ? '#ffd23c' : (tgt.isPlayer ? '#ff7a6a' : '#ffffff'), crit);
    }
    tgt.flash = 0.12; hitstop = Math.max(hitstop, crit ? 0.09 : 0.045); shake = Math.max(shake, crit ? 9 : 4);
    spark(tgt.x, tgt.y, 34, ab.color || '#fff', crit ? 18 : 9, crit ? 260 : 170);
    spark(tgt.x, tgt.y, 30, '#c01818', 6, 120);
    flashLight(tgt.x, tgt.y, ab.color || '#ffffff', crit ? 40 : 18);
    G.sfx(crit ? 'crit' : tgt.isPlayer ? 'hurt' : 'hit');
    if (G.rumble) G.rumble(tgt.isPlayer ? 160 : crit ? 110 : 50, tgt.isPlayer ? 0.8 : crit ? 0.6 : 0.25);
    if (att.isPlayer) { addHype(crit ? 10 : 5); if (ab.gain) att.res = Math.min(100, att.res + ab.gain); }
    else addHype(-7);
    const resist = tgt.boss ? 0.6 : 1;
    if (ab.stun) { tgt.st.stun = { t: ab.stun * resist }; interrupt(tgt); G.sfx('stun'); }
    if (ab.slow) tgt.st.slow = { t: ab.slow[1], amt: ab.slow[0] };
    if (ab.mark) tgt.st.mark = { t: ab.mark };
    if (ab.dot) tgt.st[ab.dot[0]] = { t: ab.dot[1], dice: ab.dot[2], tick: 0.5, by: att };
    if (att.d.searing && ab.radiant) tgt.st.burn = { t: 3, dice: [1, 4], tick: 0.5, by: att };
    if (ab.chaos) {
      const r = Math.floor(Math.random() * 4);
      if (r === 0) tgt.st.burn = { t: 3, dice: [1, 6], tick: 0.5, by: att };
      if (r === 1) tgt.st.slow = { t: 3, amt: 0.5 };
      if (r === 2) { tgt.st.stun = { t: 0.7 * resist }; interrupt(tgt); }
      if (r === 3) tgt.st.mark = { t: 4 };
      text(tgt, ['SCORCH', 'CHILL', 'DAZE', 'HEX'][r], '#ff6ad5');
    }
    if (ab.steal && att.isPlayer) { stolen += ab.steal; text(tgt, '+' + ab.steal + ' coin', '#ffd36b'); G.sfx('coin'); }
    if (ab.knock) {
      const a = o.from != null ? o.from : Math.atan2(tgt.y - att.y, tgt.x - att.x);
      tgt.kx = Math.cos(a) * ab.knock * resist; tgt.ky = Math.sin(a) * ab.knock * resist;
    }
    if (tgt.hp <= 0) ko(tgt);
    return true;
  }
  function interrupt(e) { if (e.state === 'wind' || e.state === 'recover') { e.state = 'idle'; e.act = null; e.z = 0; } e.chain = null; }
  function ko(e) {
    e.hp = 0; e.state = 'ko'; e.koT = 0; e.st = {}; e.buffs = {}; e.act = null; e.z = 0;
    phase = 'ko'; phaseT = 2.4; shake = 16; hitstop = 0.18;
    result = { win: !e.isPlayer };
    G.ui.banner(result.win ? 'KNOCKOUT' : 'DEFEATED', '', result.win ? 'win' : 'loss');
    G.sfx(result.win ? 'win' : 'lose'); G.sfx('crowd');
    spark(e.x, e.y, 30, '#ffd36b', 30, 300); flashLight(e.x, e.y, '#ffd36b', 60);
  }

  // ------------------------------------------------------------------ abilities
  function canUse(e, id) { const ab = A[id]; return ab && !(e.cds[id] > 0) && e.res >= (ab.cost || 0); }
  function tryAbility(e, id) {
    const ab = A[id];
    if (e.state !== 'idle' || !ab) return false;
    if (!canUse(e, id)) { if (e.isPlayer && !ab.basic) G.sfx('deny'); return false; }
    const I = e.intent;
    e.res -= (ab.cost || 0);
    if (ab.cd) e.cds[id] = ab.cd;
    e.aim = I.aim;
    const act = e.act = { ab, id, aim: I.aim, total: ab.wind, pt: null, sx: e.x, sy: e.y };
    if (ab.type === 'aoe' && ab.at === 'point') {
      let dx = I.pt.x - e.x, dy = I.pt.y - e.y; const d = Math.hypot(dx, dy) || 1;
      if (d > ab.castRange) { dx *= ab.castRange / d; dy *= ab.castRange / d; }
      act.pt = { x: e.x + dx, y: e.y + dy }; clampArena(act.pt);
    }
    e.state = 'wind'; e.t = ab.wind;
    if (!ab.basic) {
      if (e.isPlayer) { if (lastAb !== id) addHype(6); lastAb = id; }
      if (e.d.wild && Math.random() < 0.25) wildSurge(e);
    }
    if (e.buffs.stealth && ab.type !== 'buff' && ab.type !== 'dash') delete e.buffs.stealth;
    G.sfx(ab.type === 'melee' && !ab.spell ? 'swing' : ab.type === 'dash' ? 'dash' : 'cast');
    return true;
  }
  function wildSurge(e) {
    const r = Math.floor(Math.random() * 4);
    if (r === 0) { heal(e, e.maxHp * 0.1); text(e, 'WILD SURGE: MEND', '#ff6ad5', true); }
    if (r === 1) { setBuff(e, 'haste', 3, 0.5); text(e, 'WILD SURGE: HASTE', '#ff6ad5', true); }
    if (r === 2) { e.res = Math.min(100, e.res + 35); text(e, 'WILD SURGE: MANA', '#ff6ad5', true); }
    if (r === 3) { zones.push({ x: e.foe.x, y: e.foe.y, r: 62, delay: 0.5, t: 0, owner: e, ab: { type: 'aoe', dmg: [2, 6], color: '#ff6ad5', knock: 120 } }); text(e, 'WILD SURGE: BLAST', '#ff6ad5', true); }
    spark(e.x, e.y, 40, '#ff6ad5', 18, 200);
    if (e.isPlayer) addHype(8);
  }
  function doDash(e, ab, first) {
    const foe = e.foe, ox = e.x, oy = e.y;
    let tx, ty;
    const d = Math.hypot(foe.x - e.x, foe.y - e.y) || 1, sees = !foe.buffs.stealth;
    if (ab.behind && sees && d < ab.dist * 1.35) { const ux = (foe.x - e.x) / d, uy = (foe.y - e.y) / d; tx = foe.x + ux * 48; ty = foe.y + uy * 48; }
    else { const a = e.act ? e.act.aim : e.aim; tx = e.x + Math.cos(a) * ab.dist; ty = e.y + Math.sin(a) * ab.dist; }
    const dst = { x: tx, y: ty }; clampArena(dst);
    if (ab.pathDmg && segDist(foe.x, foe.y, ox, oy, dst.x, dst.y) < 40) hit(e, foe, ab, { from: Math.atan2(dst.y - oy, dst.x - ox) });
    fx.push({ k: 'trail', x1: ox, y1: oy, x2: dst.x, y2: dst.y, col: ab.color, t: 0, life: 0.3 });
    spark(ox, oy, 30, ab.color, 10, 120); spark(dst.x, dst.y, 30, ab.color, 10, 120);
    e.x = dst.x; e.y = dst.y; e.iframe = Math.max(e.iframe, 0.28); e.dodgeCredit = 0;
    e.aim = Math.atan2(foe.y - e.y, foe.x - e.x);
    if (!first) G.sfx('dash');
  }
  function fire(e) {
    const act = e.act, ab = act.ab, foe = e.foe, a = act.aim;
    if (ab.type === 'melee') {
      const d = Math.hypot(foe.x - e.x, foe.y - e.y), ta = Math.atan2(foe.y - e.y, foe.x - e.x), arc = ab.arc * Math.PI / 180;
      if (ab.cone) {
        fx.push({ k: 'cone', x: e.x, y: e.y, a, r: ab.range, arc, col: ab.cone, t: 0, life: 0.38 }); G.sfx(ab.fire ? 'fire' : 'dodge');
        for (let i = 0; i < 26; i++) { const aa = a + rand(-arc / 2, arc / 2), v = rand(0.4, 1) * ab.range / S / 0.35; gfx.emit(e.x / S, 1, e.y / S, Math.cos(aa) * v, rand(-0.5, 1.5), Math.sin(aa) * v, rand(0.25, 0.45), ab.cone, 1); }
        flashLight(e.x + Math.cos(a) * 60, e.y + Math.sin(a) * 60, ab.cone, 35);
      } else fx.push({ k: 'slash', x: e.x, y: e.y, a, r: ab.range, arc, col: ab.color, t: 0, life: 0.18 });
      if (d < ab.range + ER && (angDiff(ta, a) < arc / 2 || d < ER * 1.6)) hit(e, foe, ab);
    } else if (ab.type === 'proj') {
      const n = ab.count || 1;
      for (let i = 0; i < n; i++) {
        const aa = a + (n > 1 ? (i / (n - 1) - 0.5) * ab.spread : 0);
        projs.push({ x: e.x + Math.cos(aa) * 20, y: e.y + Math.sin(aa) * 20, vx: Math.cos(aa) * ab.speed, vy: Math.sin(aa) * ab.speed, a: aa, r: ab.pr, owner: e, ab, t: 0 });
      }
      if (!ab.basic) G.sfx(ab.fire ? 'fire' : ab.slow ? 'ice' : ab.radiant ? 'holy' : 'swing');
    } else if (ab.type === 'line') {
      const x2 = e.x + Math.cos(a) * ab.range, y2 = e.y + Math.sin(a) * ab.range;
      fx.push({ k: 'bolt', x1: e.x, y1: e.y, x2, y2, col: ab.color, t: 0, life: 0.3 });
      G.sfx('zap'); shake = Math.max(shake, 6); flashLight(e.x + Math.cos(a) * 120, e.y + Math.sin(a) * 120, ab.color, 60);
      if (segDist(foe.x, foe.y, e.x, e.y, x2, y2) < ab.width + ER) hit(e, foe, ab, { from: a });
    } else if (ab.type === 'aoe') {
      let x = e.x, y = e.y;
      if (ab.at === 'point' && !ab.leap) { x = act.pt.x; y = act.pt.y; }
      if (ab.at === 'target') { const s = foe.buffs.stealth ? e.lastSeen : foe; x = s.x; y = s.y; }
      if (ab.id === 'fireball') fx.push({ k: 'lob', x1: e.x, y1: e.y, x2: x, y2: y, col: ab.color, t: 0, life: ab.delay });
      zones.push({ x, y, r: ab.radius, delay: ab.delay || 0, t: 0, owner: e, ab });
    } else if (ab.type === 'dash') {
      doDash(e, ab, true);
      if (ab.repeat) e.chain = { ab, n: ab.repeat - 1, t: 0.17 };
    }
    if (ab.type === 'buff' || ab.buff) {
      if (ab.buff) Object.keys(ab.buff).forEach(k => {
        const b = ab.buff[k];
        if (k === 'shield') { e.shield = b[1] + (ab.shieldLvl || 0) * e.level; e.buffs.shield = { t: b[0] }; }
        else setBuff(e, k, b[0], b[1]);
      });
      if (ab.heal) heal(e, G.roll(ab.heal) + G.mod(e.stats[ab.healStat]) + (ab.healLvl || 0) * e.level);
      else if (ab.type === 'buff') { G.sfx(ab.radiant ? 'holy' : 'buff'); spark(e.x, e.y, 30, ab.color, 16, 150); }
      if (ab.refresh) { e.cds = {}; e.cds[act.id] = ab.cd; }
      if (ab.restore) e.res = 100;
      if (ab.smoke) fx.push({ k: 'smoke', x: e.x, y: e.y, t: 0, life: 1.4 });
      if (ab.ult || ab.type === 'buff') { fx.push({ k: 'ring', x: e.x, y: e.y, r: 90, col: ab.color, t: 0, life: 0.45 }); flashLight(e.x, e.y, ab.color, 25); }
    }
  }
  function usePotion(e) {
    if (e.potions <= 0 || e.hp >= e.maxHp || e.state === 'ko' || e.st.stun) { if (e.isPlayer) G.sfx('deny'); return; }
    e.potions--; heal(e, e.maxHp * 0.35 / e.d.healMul);
  }

  // ------------------------------------------------------------------ entity update
  function updateEntity(e, dt) {
    e.iframe = Math.max(0, e.iframe - dt); e.flash = Math.max(0, e.flash - dt); e.dodgeT = Math.max(0, e.dodgeT - dt);
    for (const k in e.cds) if (e.cds[k] > 0) e.cds[k] -= dt * (1 + e.d.cdr);
    if (e.state === 'ko') { e.koT += dt; return; }
    e.res = Math.min(100, e.res + e.d.regen * dt);
    for (const k in e.st) {
      const s = e.st[k]; s.t -= dt;
      if (s.dice) { s.tick -= dt; if (s.tick <= 0) { s.tick += 0.5; const v = Math.max(1, Math.round(G.roll(s.dice) * (s.by ? s.by.d.dmgMul : 1))); e.hp -= v; if (s.by) s.by.dmgDealt += v; text(e, '' + v, k === 'poison' ? '#9be35a' : '#ff9a3c'); if (e.hp <= 0) { ko(e); return; } } }
      if (s.t <= 0) delete e.st[k];
    }
    for (const k in e.buffs) { e.buffs[k].t -= dt; if (e.buffs[k].t <= 0) { delete e.buffs[k]; if (k === 'shield') e.shield = 0; } }
    if (e.buffs.aura) {
      e.auraT -= dt;
      if (e.auraT <= 0) {
        e.auraT = 0.5; const au = A.spirit_guardians.aura;
        if (Math.hypot(e.foe.x - e.x, e.foe.y - e.y) < au.radius + ER) hit(e, e.foe, { type: 'aura', dmg: au.dmg, stat: au.stat, radiant: 1, color: '#c8f0ff', slow: [au.slow, 0.7] });
      }
    }
    if (e.kx || e.ky) { e.x += e.kx * dt; e.y += e.ky * dt; const f = Math.pow(0.002, dt); e.kx *= f; e.ky *= f; if (Math.abs(e.kx) + Math.abs(e.ky) < 8) e.kx = e.ky = 0; }
    if (e.chain) { e.chain.t -= dt; if (e.chain.t <= 0) { doDash(e, e.chain.ab); if (--e.chain.n <= 0) e.chain = null; else e.chain.t = 0.17; } }

    const I = e.intent, spd = 1 + (e.buffs.haste ? e.buffs.haste.amt : 0);
    let mv = 0;
    e.moving = false;
    if (e.st.stun) { if (e.state !== 'idle') interrupt(e); e.state = 'idle'; I.queue.length = 0; clampArena(e); return; }
    if (I.queue.length) { e.buf = { id: I.queue.shift(), t: 0.3 }; I.queue.length = 0; }
    if (e.buf) { e.buf.t -= dt; if (e.buf.t <= 0) e.buf = null; }

    if (e.state === 'dodge') {
      e.t -= dt; e.x += Math.cos(e.da) * 560 * dt; e.y += Math.sin(e.da) * 560 * dt;
      if (Math.random() < 0.5) gfx.emit(e.x / S, 0.1, e.y / S, 0, 0.5, 0, 0.3, 0x4a4038, 0);
      if (e.t <= 0) e.state = 'idle';
    } else if (e.state === 'wind') {
      const ab = e.act.ab; e.t -= dt * spd;
      const pr = 1 - Math.max(0, e.t) / (ab.wind || 0.01);
      if (ab.lunge) {
        const d = Math.hypot(e.foe.x - e.x, e.foe.y - e.y);
        if (d > 38) { const v = ab.lunge / ab.wind * spd; e.x += Math.cos(e.act.aim) * v * dt; e.y += Math.sin(e.act.aim) * v * dt; }
      } else if (ab.leap) {
        e.x = G.lerp(e.act.sx, e.act.pt.x, pr); e.y = G.lerp(e.act.sy, e.act.pt.y, pr); e.z = Math.sin(pr * Math.PI) * 70; e.iframe = Math.max(e.iframe, 0.05);
      } else mv = e.C.ranged ? 0.45 : 0.25;
      if (e.t <= 0) { e.z = 0; fire(e); if (e.state === 'wind') { e.state = 'recover'; e.t = ab.rec; } }
    } else if (e.state === 'recover') {
      e.t -= dt * spd; mv = 0.5;
      if (e.t <= 0) { e.state = 'idle'; e.act = null; }
    }
    if (e.state === 'idle' || (e.state === 'recover' && e.buf && e.buf.id === 'dodge')) {
      if (e.state === 'idle') mv = 1;
      const b = e.buf;
      if (b && b.id === 'dodge') {
        if (e.dodgeT <= 0) {
          const a = (I.mx || I.my) ? Math.atan2(I.my, I.mx) : I.aim + Math.PI;
          e.state = 'dodge'; e.t = 0.3; e.da = a; e.iframe = 0.27; e.dodgeT = e.d.dodgeCd; e.dodgeCredit = 0; e.act = null; e.buf = null; G.sfx('dodge'); mv = 0;
        }
      } else if (e.state === 'idle') {
        if (b && b.id === 'potion') { usePotion(e); e.buf = null; }
        else if (b && tryAbility(e, b.id)) e.buf = null;
        else if (I.attack) tryAbility(e, e.basic);
      }
    }
    if (mv > 0 && (I.mx || I.my)) {
      const l = Math.hypot(I.mx, I.my) || 1, m = Math.min(1, l);
      const v = e.d.speed * mv * m * (e.st.slow ? 1 - e.st.slow.amt : 1) * (1 + (e.buffs.speed ? e.buffs.speed.amt : 0));
      e.x += I.mx / l * v * dt; e.y += I.my / l * v * dt; e.walk += dt * 13 * m; e.moving = true;
    }
    if (e.state === 'idle' || e.state === 'recover') e.aim = I.aim;
    const f = e.foe;
    if (f.state !== 'ko' && e.state !== 'dodge' && e.z < 10) {
      const dx = e.x - f.x, dy = e.y - f.y, d = Math.hypot(dx, dy);
      if (d < ER * 1.7 && d > 0.01) { const push = (ER * 1.7 - d) / 2; e.x += dx / d * push; e.y += dy / d * push; }
    }
    clampArena(e);
  }

  // ------------------------------------------------------------------ AI
  function inRange(e, ab, d) {
    if (ab.type === 'melee') return d < ab.range + (ab.lunge || 0) * 0.8 + 8;
    if (ab.type === 'proj') return d < 470 && (d > 70 || !e.C.ranged);
    if (ab.type === 'line') return d < ab.range * 0.85;
    if (ab.type === 'aoe') return ab.at === 'self' ? d < ab.radius * 0.8 : ab.at === 'point' ? d < ab.castRange + ab.radius * 0.4 && (d > 110 || !ab.leap) : d < 600;
    if (ab.type === 'dash') return e.C.ranged ? d < 120 : (d > 150 || ab.pathDmg);
    if (ab.heal) return e.hp < e.maxHp * 0.5;
    if (ab.buff) return ab.buff.shield ? e.hp < e.maxHp * 0.8 && !e.shield : ab.buff.counter ? d < 95 && e.foe.state === 'wind' : d < 260;
    return false;
  }
  function think(e, dt) {
    const foe = e.foe, ai = e.ai, I = e.intent;
    const seen = !foe.buffs.stealth || !!foe.buffs.aura;
    if (seen) { e.lastSeen.x = foe.x; e.lastSeen.y = foe.y; }
    const tg = e.lastSeen, dx = tg.x - e.x, dy = tg.y - e.y, d = Math.hypot(dx, dy) || 1;
    I.aim = Math.atan2(dy, dx) + (seen ? 0 : Math.sin(time * 3) * 0.8);
    I.pt.x = tg.x; I.pt.y = tg.y; I.attack = false;
    const pref = e.C.pref;
    let mx = 0, my = 0;
    e.strafeT -= dt; if (e.strafeT <= 0) { e.strafeT = rand(0.8, 2.4); e.strafe = Math.random() < 0.5 ? -1 : 1; }
    const ux = dx / d, uy = dy / d;
    if (d > pref + 16) { mx += ux; my += uy; }
    else if (e.C.ranged && d < pref - 60) { mx -= ux; my -= uy; }
    const sf = e.C.ranged ? 0.8 : (d < pref + 40 ? 0.35 : 0.15);
    mx += -uy * e.strafe * sf; my += ux * e.strafe * sf;
    if (e.C.ranged && (Math.abs(e.x) + Math.abs(e.y)) / RAD > 1.25) { mx -= e.x / RAD; my -= e.y / RAD; }
    for (const z of zones) if (z.owner !== e && z.delay - z.t > 0.1) {
      const zd = Math.hypot(e.x - z.x, e.y - z.y);
      if (zd < z.r + 30) {
        if (!z.seen) { z.seen = 1; z.flee = Math.random() < ai.dodge + 0.35; if (z.flee && zd < z.r && Math.random() < ai.dodge * 2) I.queue.push('dodge'); }
        if (z.flee) { mx = (e.x - z.x) / (zd || 1); my = (e.y - z.y) / (zd || 1); if (zd < 4) mx = 1; }
      }
    }
    I.mx = mx; I.my = my;
    if (seen && foe.state === 'wind' && foe.act && !foe.act.seen) {
      foe.act.seen = 1; const ab = foe.act.ab;
      const threat = ab.type === 'melee' ? d < ab.range + (ab.lunge || 0) + 30 : ab.type === 'line';
      if (threat && Math.random() < ai.dodge) e.react = { t: Math.min(ab.wind * 0.6, ai.react * 0.4) };
    }
    for (const p of projs) if (p.owner !== e && !p.seen && Math.hypot(p.x - e.x, p.y - e.y) < 170) { p.seen = 1; if (Math.random() < ai.dodge) e.react = { t: 0.03, side: 1 }; }
    if (e.react) { e.react.t -= dt; if (e.react.t <= 0) { if (e.react.side) { I.mx = -uy * e.strafe; I.my = ux * e.strafe; } I.queue.push('dodge'); e.react = null; } }
    e.think -= dt;
    if (e.combo > 0 && e.state === 'idle' && d < A[e.basic].range + 14) I.attack = true;
    if (e.think <= 0 && e.state === 'idle') {
      e.think = ai.react * rand(0.6, 1.4);
      if (!seen) return;
      const healId = e.kit.find(id => A[id].heal && canUse(e, id) && inRange(e, A[id], d));
      if (healId) { I.queue.push(healId); return; }
      if (e.ult && canUse(e, e.ult) && (e.hp < e.maxHp * 0.75 || foe.hp < foe.maxHp * 0.6) && inRange(e, A[e.ult], d)) { I.queue.push(e.ult); return; }
      const c = e.kit.filter(id => !A[id].heal && canUse(e, id) && inRange(e, A[id], d));
      if (c.length && Math.random() < ai.aggro) { I.queue.push(G.pick(c)); return; }
      const b = A[e.basic];
      if (b.type === 'melee') { if (d < b.range + 14) e.combo = 1 + Math.floor(Math.random() * 3); }
      else if (d < 480 && Math.random() < 0.5 + ai.aggro * 0.5) I.attack = true;
    }
    if (e.state === 'wind' && e.act && e.act.ab.basic && e.combo > 0 && !e.act.counted) { e.act.counted = 1; e.combo--; }
  }

  function playerIntent() {
    const I = P.intent, In = G.input, k = In.keys;
    let ix = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0), iy = (k.KeyS || k.ArrowDown ? 1 : 0) - (k.KeyW || k.ArrowUp ? 1 : 0);
    if (In.stick.active) { ix = In.stick.x; iy = In.stick.y; }
    const pad = In.usingPad && In.pad;
    if (pad && (pad.lx || pad.ly)) { ix = pad.lx; iy = pad.ly; }
    const w = gfx.screenToWorld(ix, iy); I.mx = w.x; I.my = w.z;
    if (pad && Math.hypot(pad.rx, pad.ry) > 0.35) {
      const a = gfx.screenToWorld(pad.rx, pad.ry); I.aim = Math.atan2(a.z, a.x); I.pt.x = P.x + Math.cos(I.aim) * 220; I.pt.y = P.y + Math.sin(I.aim) * 220;
    } else if (In.touch || In.autoAim || pad) {
      const t = E.buffs.stealth ? { x: P.x + Math.cos(P.aim) * 100, y: P.y + Math.sin(P.aim) * 100 } : E;
      I.aim = Math.atan2(t.y - P.y, t.x - P.x); I.pt.x = t.x; I.pt.y = t.y;
    } else {
      const g = gfx.groundAt(In.mouse.cx, In.mouse.cy), wx = g.x * S, wy = g.z * S;
      I.aim = Math.atan2(wy - P.y, wx - P.x); I.pt.x = wx; I.pt.y = wy;
    }
    I.attack = In.mouse.down || In.touchAtk || k.KeyJ || !!(pad && pad.atk);
    while (In.pressed.length) {
      const a = In.pressed.shift();
      if (a === 'dodge' || a === 'potion') I.queue.push(a);
      else if (a === 'ult') { if (P.ult) I.queue.push(P.ult); }
      else { const id = P.kit[+a[1]]; if (id) I.queue.push(id); }
    }
  }

  // ------------------------------------------------------------------ main update
  F.update = function (rdt) {
    if (!F.active) return;
    if (F.paused) { sync(0); return; }
    let dt = rdt * F.speed;
    if (hitstop > 0) { hitstop -= dt; dt *= 0.05; }
    if (phase === 'ko') dt *= 0.45;
    time += dt; shake = Math.max(0, shake - dt * 40);
    if (phase === 'intro') { phaseT -= dt; G.input.pressed.length = 0; if (phaseT <= 0.6 && !F.said) { F.said = 1; G.ui.banner('FIGHT!', '', 'win'); } if (phaseT <= 0) { phase = 'fight'; G.ui.banner(null); } }
    if (phase === 'fight') {
      if (G.debugAuto) { if (!P.ai) P.ai = { react: 0.3, aggro: 0.7, dodge: 0.3 }; think(P, dt); } else playerIntent();
      think(E, dt);
      hype = Math.max(0, hype - dt * 1.2);
    } else { P.intent.mx = P.intent.my = E.intent.mx = E.intent.my = 0; P.intent.attack = E.intent.attack = false; P.intent.queue.length = E.intent.queue.length = 0; }
    updateEntity(P, dt); updateEntity(E, dt);

    for (let i = projs.length - 1; i >= 0; i--) {
      const p = projs[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      const f = p.owner.foe; let dead = false;
      if (Math.random() < 0.7) gfx.emit(p.x / S, 1.05, p.y / S, rand(-0.6, 0.6), rand(-0.3, 0.6), rand(-0.6, 0.6), 0.25, p.ab.color, 0);
      if (!p.passed && f.state !== 'ko' && f.z < 30 && Math.hypot(p.x - f.x, p.y - f.y) < p.r + ER) {
        const dodged = f.iframe > 0;
        hit(p.owner, f, p.ab, { from: p.a });
        if (dodged) p.passed = 1; else dead = true;
      }
      if (!dead && (!inArena(p.x, p.y, 30) || p.t > 2)) { spark(p.x, p.y, 30, p.ab.color, 6, 80); dead = true; }
      if (dead) { if (p.m) sc.remove(p.m); projs.splice(i, 1); }
    }
    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i]; z.t += dt;
      if (z.t >= z.delay) {
        const f = z.owner.foe, ab = z.ab;
        fx.push({ k: 'blast', x: z.x, y: z.y, r: z.r, col: ab.color, t: 0, life: 0.5, pillar: ab.radiant });
        spark(z.x, z.y, 20, ab.color, 26, z.r * 2.6); flashLight(z.x, z.y, ab.color, z.r > 80 ? 120 : 50);
        shake = Math.max(shake, z.r > 80 ? 12 : 5); G.sfx(ab.radiant ? 'holy' : 'boom');
        if (f.z < 30 && Math.hypot(f.x - z.x, f.y - z.y) < z.r + ER * 0.6) hit(z.owner, f, ab, { from: Math.atan2(f.y - z.y, f.x - z.x) });
        if (z.m) sc.remove(z.m); zones.splice(i, 1);
      }
    }
    if (phase === 'ko') { phaseT -= dt / 0.45; if (phaseT <= 0) { F.active = false; G.ui.banner(null); finish(); return; } }
    sync(dt);
    G.ui.updateHud(P, E, hype);
  };

  function sync(dt) {
    syncEntity(P); syncEntity(E);
    projs.forEach(syncProj); zones.forEach(syncZone);
    for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t += dt; if (!f.obj) buildFx(f); if (f.t >= f.life) { killFx(f); fx.splice(i, 1); } else f.upd(f.t / f.life); }
    arena.flash.intensity *= Math.pow(0.0005, dt); if (arena.flash.intensity < 0.3) arena.flash.intensity = 0;
    arena.setHype(hype / 100);
    // camera frames both fighters
    const c = gfx.cam, dx = (P.x - E.x) / S, dz = (P.y - E.y) / S, port = gfx.portrait;
    const sw = Math.abs(dx - dz) * 0.7071, sh = Math.abs(dx + dz) * 0.7071 * 0.5;
    const asp = gfx.W / gfx.H;
    let want = Math.max((sh + 6.5) / (port ? 0.5 : 0.78), (sw + (port ? 3.2 : 7)) / asp, port ? 13 : 10.5);
    if (port) want = Math.min(want, 21);
    const k = Math.min(1, dt * 3.5);
    camVh += (want - camVh) * k; c.vh = camVh; c.fx = 0.5; c.fy = port ? 0.44 : 0.47;
    // aim at the midpoint, but never let the player leave the frame
    let tx = (P.x + E.x) / 2 / S, tz = (P.y + E.y) / 2 / S;
    const halfW = camVh * asp / 2 - 1.4, px = P.x / S, pz = P.y / S, off = ((px - tx) - (pz - tz)) * 0.7071;
    if (Math.abs(off) > halfW) { const d = (Math.abs(off) - halfW) * Math.sign(off) * 0.7071; tx += d; tz -= d; }
    c.x += (tx - c.x) * k; c.z += (tz - c.z) * k; c.shake = shake / 45;
    // edge arrow when the opponent is off screen
    const ar = document.getElementById('foeArrow'), ep = gfx.project(E.x / S, 1, E.y / S), m = 26;
    if (E.state !== 'ko' && (ep.x < 0 || ep.x > gfx.W || ep.y < 0 || ep.y > gfx.H)) {
      const ax = clamp(ep.x, m, gfx.W - m), ay = clamp(ep.y, m + 70, gfx.H - m - 120);
      ar.className = ''; ar.style.transform = 'translate(' + ax + 'px,' + ay + 'px) translate(-50%,-50%) rotate(' + Math.atan2(ep.y - ay, ep.x - ax) + 'rad)';
    } else ar.className = 'hidden';
  }

  F.forfeit = function () { if (!F.active) return; result = { win: false, forfeit: true }; F.active = false; F.paused = false; G.ui.banner(null); finish(); };

  function finish() {
    const st = G.state, win = result.win, first = !st.wins[opp.id];
    const hy = Math.round(hype), base = win ? (first ? 1 : 0.6) : 0.25;
    const r = {
      win, opp, first, hype: hy, forfeit: result.forfeit,
      xp: Math.round(opp.xp * base * P.d.xpMul),
      coin: win ? Math.round(opp.coin * (first ? 1 : 0.6) * P.d.coinMul * (hy >= 80 ? 1.2 : 1)) + stolen : stolen,
      respect: win ? Math.round(opp.respect * (first ? 1 : 0.3) * P.d.respectMul * (1 + hy / 200)) : 0,
      tips: win && hy >= 80, stolen
    };
    if (result.forfeit) { r.xp = 0; r.coin = 0; }
    st.potions = Math.max(0, Math.min(P.startPotions, P.potions));
    if (win) st.wins[opp.id] = (st.wins[opp.id] || 0) + 1; else st.losses++;
    const rank0 = G.rankOf(st.respect);
    st.coin += r.coin; st.respect += r.respect; st.hero.xp += r.xp;
    r.rankUp = G.rankOf(st.respect) > rank0 ? G.rankOf(st.respect) : null;
    G.save(); gfx.cam.shake = 0; gfx.clearFloats(); document.getElementById('foeArrow').className = 'hidden';
    G.ui.results(r);
  }
})();
