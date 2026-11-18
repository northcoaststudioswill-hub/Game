// Underground Syndicate — real-time one-on-one combat. Simulation runs in "sim units" (32 per world unit),
// and is mirrored every frame onto the 3D isometric pit.
(function () {
  const G = window.G, A = G.ABILITIES, T = THREE, gfx = G.gfx, S = gfx.S;
  const RAD = G.world.AR * S, ER = 16;
  const F = G.fight = { active: false, paused: false, speed: 1 };
  let P, E, projs, zones, fx, time, hitstop, phase, phaseT, hype, opp, shake, result, lastAb, stolen, tossed = 0, arena, sc, camVh = 12;

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
      basic: (h.arm && G.ABILITIES[h.arm] && G.ARM_BY && G.ARM_BY[h.arm] && G.ARM_BY[h.arm].cls === h.cls) ? h.arm : C.basic, kit: (h.slots || h.known).filter(Boolean), ult: h.ult || null, cds: {}, dodgeT: 0,
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
    const eh = { name: o.name, cls: o.cls, race: o.race, level: o.level, stats: G.baseStats(o.cls, o.race), sub: o.sub || null, feats: [], known: o.known, ult: o.ult || null, tint: o.tint, scale: o.scale, arm: o.arm || null };
    const prim = G.CLASSES[o.cls].primary; eh.stats[prim] += Math.floor(o.level / 2); eh.stats.con += Math.floor(o.level / 3);
    const ed = G.derive(eh, null);
    F.sabotaged = !!st.sabotage; if (st.sabotage) { ed.maxHp *= 0.85; st.sabotage = 0; }
    ed.maxHp = Math.round(ed.maxHp * o.hpMul); ed.dmgMul *= o.dmgMul * (o.level >= 3 ? 1.12 : 1.04);
    let foeGear = 0; if (G.gearRace && !o.spar) { foeGear = G.gearRace.of(o); ed.weapon += G.gearRace.W[foeGear]; ed.dr += G.gearRace.A[foeGear]; ed.dmgMul *= 1 + G.gearRace.D[foeGear]; }
    const eLook = o.look || G.lookOf(eh, null); if (!o.look && foeGear) eLook.gear = { weapon: Math.min(2, foeGear), armor: Math.min(2, foeGear) };
    E = makeEntity(eh, ed, eLook, false); E.gearTier = foeGear;
    E.ai = Object.assign({ react: 0.5, aggro: 0.5, dodge: 0.1, guard: Math.min(0.6, 0.14 + o.level * 0.09), parry: Math.min(0.26, 0.02 + o.level * 0.045) }, o.ai); E.boss = o.boss;
    G.fightTrack = o.boss ? 'boss' : 'fight';
    P.foe = E; E.foe = P;
    [P, E].forEach(makeVis);
    if (!arena.flash.parent) sc.add(arena.flash);
    projs = []; zones = []; fx = []; time = 0; hitstop = 0; shake = 0; hype = 20; lastAb = null; stolen = 0; tossed = 0; F.frenzies = 0;
    phase = 'intro'; phaseT = 1.8; result = null; F.said = 0; M = null; clearGibs(); gfx.clearBlood(sc); gfx.cine = null; F.assistUsed = 0; marks.forEach(m => m.visible = false); markN = 0;
    { const tm = (st.tally || [])[st.second]; P.second = tm && !tm.job ? tm : null; }
    if (st.bless) { P.shield += 18; st.bless = 0; }
    gfx.cam.x = 0; gfx.cam.z = 0; gfx.cam.y = 0.9; camVh = gfx.cam.vh = gfx.portrait ? 17 : 15;
    F.active = true; F.paused = false; F.P = P; F.E = E; initPoise();
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
    { const ry = Math.atan2(Math.cos(e.aim), Math.sin(e.aim)); if (v.ry == null || e.state === 'dodge') v.ry = ry; let d = ry - v.ry; d = Math.atan2(Math.sin(d), Math.cos(d)); v.ry += d * 0.3; v.c.root.rotation.y = v.ry; }       // a body takes a moment to turn
    let act = 'idle', prog = 0, glow = null, stepOv = 0;
    if (e.state === 'ko') { act = 'ko'; prog = e.koT; }
    else if (e.down > 0) { act = 'ko'; prog = Math.min(e.downT - e.down, e.down) * 1.7; }
    else if (e.st.stun) act = e.st.broken ? 'kneel' : 'stun';
    else if (e.state === 'dodge') { act = 'dodge'; prog = 1 - e.t / 0.22; }
    else if (e.act) {
      const ab = e.act.ab, melee = ab.type === 'melee' && !ab.spell;
      if (e.state === 'wind') { prog = 1 - e.t / (e.act.total || ab.wind || 0.01); act = melee ? 'swing' : 'cast'; if (melee) prog *= 0.5; glow = ab.color; }
      else { prog = 1 - e.t / (ab.rec || 0.01); act = melee ? 'swing' : 'release'; if (melee) prog = 0.5 + prog * 0.5; }
      if (ab.type === 'dash') act = 'lunge'; if (ab.type === 'taunt') act = 'cheer';
    }
    else if (e.state === 'parry') act = 'parry';
    else if (e.charging > 0.1 && phase === 'fight') { act = e.C.ranged ? 'cast' : 'swing'; prog = e.C.ranged ? Math.min(1, e.charging * 2) : Math.min(0.3, 0.1 + e.charging * 0.5); stepOv = 2; glow = e.charging >= 0.28 ? '#ffe9a0' : null; }
    else if (phase === 'intro') act = 'salute';
    else if (phase === 'ko' || (phase === 'mortal' && M && e.isPlayer && M.t > (M.def.cheerAt || (M.def.imp || 1.2) + 0.6))) act = 'cheer';
    if (e.poseOv) { act = e.poseOv.act; prog = e.poseOv.prog || 0; }
    const alpha = e.buffs.stealth ? (e.isPlayer ? 0.4 : 0.1) : 1;
    if (act === 'cast' && e.state === 'wind' && glow && Math.random() < 0.6) { const ca = rand(0, 6.28), cr = rand(0.8, 1.5); gfx.emit(X + Math.cos(ca) * cr, 1.2 + rand(-0.4, 0.6), Z + Math.sin(ca) * cr, -Math.cos(ca) * cr * 3, 0, -Math.sin(ca) * cr * 3, 0.3, glow, 0); }
    let MF = 1, MS = 0; { const sp = Math.hypot(e.vx || 0, e.vy || 0), fx = e.foe ? e.foe.x - e.x : 0, fy = e.foe ? e.foe.y - e.y : 0, fd = Math.hypot(fx, fy); if (sp > 20 && fd > 1 && fd < 520) { MF = ((e.vx * fx + e.vy * fy) / (sp * fd)); MS = ((e.vx * fy - e.vy * fx) / (sp * fd)); } }
    v.c.pose({ moving: e.moving, walk: e.walk, act, prog, flash: e.flash, alpha, hurt: e.hurt || 0, step: e.act ? e.act.step : stepOv, guard: e.guard > 0, sty: e.act && e.act.ab.type === 'melee' && !e.act.ab.spell ? (e.act.ab.arc < 60 ? 1 : (e.act.ab.pz || 1) >= 1.4 ? 2 : e.act.ab.arc >= 120 ? 3 : 0) : 0, mf: MF, ms: MS, ready: 1, hop: !!(e.lost && e.lost.legL), tired: e.hp < e.maxHp * 0.25, crawl: !!e.crawl, wounded: e.hp < e.maxHp * 0.4 && e.hp > 0, t: time + (e.isPlayer ? 0 : 1.7), glow });
    const alive = e.state !== 'ko';
    if (alive && !F.ex && gore() && !v.c.beast) { const fr = e.hp / e.maxHp, want = fr < 0.25 ? 3 : fr < 0.45 ? 2 : fr < 0.7 ? 1 : 0; v.wounds = v.wounds || 0;
      while (v.wounds < want && v.c.body) { const w = new T.Mesh(new T.BoxGeometry(0.05 + Math.random() * 0.05, 0.22 + Math.random() * 0.22, 0.03), new T.MeshBasicMaterial({ color: 0x6a0808 })); w.position.set((Math.random() - 0.5) * 0.4, 1.0 + Math.random() * 0.45, 0.225 * (v.wounds === 1 ? -1 : 1)); w.rotation.z = (Math.random() - 0.5) * 1.6; v.c.body.add(w); v.wounds++; }
      if (fr < 0.4 && Math.random() < 0.05) { gfx.splat(X + rand(-0.25, 0.25), Z + rand(-0.25, 0.25), rand(0.12, 0.3)); if (Math.random() < 0.5) gfx.emit(X, 1.1, Z, rand(-0.4, 0.4), 0, rand(-0.4, 0.4), 0.6, '#8a0c0c', 1); } }
    v.ring.visible = alive && alpha > 0.3 && !F.ex; v.ring.scale.setScalar(1 + Math.min(1, (e.charging || 0) / 0.28) * 0.45); v.ring.position.y = 0.03 - e.z / S;
    v.ward.visible = alive && e.shield > 0; if (v.ward.visible) v.ward.material.opacity = 0.18 + Math.sin(time * 6) * 0.06;
    v.mark.visible = alive && !!e.st.mark; v.guard.visible = alive && (!!e.buffs.counter || e.guard > 0 || (e.state === 'parry' && e.parryT > 0)); if (v.guard.visible) v.guard.rotation.y = v.c.root.rotation.y - Math.PI / 2;
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
    if (v.tele) { if (v.follow) v.tele.position.set(X, 0.04, Z); v.tele.material.opacity = 0.12 + (1 - e.t / (e.act.total || e.act.ab.wind || 0.01)) * (e.isPlayer ? 0.12 : 0.3); }
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
    } else if (k === 'dust') {
      const ring = flat(new T.Mesh(new T.RingGeometry(0.7, 1, 30), basicMat(0x9a8a78, 0.5))); g.add(ring); g.position.set(f.x / S, 0.07, f.y / S);
      f.upd = p => { ring.scale.setScalar(0.3 + f.r / S * p); ring.material.opacity = 0.5 * (1 - p); };
    } else if (k === 'ghost') {
      g.position.set(f.x / S, 0, f.y / S); const m1 = new T.Mesh(new T.CapsuleGeometry(0.3, 0.9, 3, 6), basicMat(col, 0.5, true)); m1.position.y = 0.9; g.add(m1); const m2 = new T.Mesh(new T.SphereGeometry(0.26, 8, 6), basicMat(col, 0.5, true)); m2.position.y = 1.75; g.add(m2);
      f.upd = p => { const a = Math.max(0, 0.5 * (1 - p)); m1.material.opacity = a; m2.material.opacity = a; g.visible = f.t >= 0; };
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
  function text(e, s, col, big) { if (G.deeds && phase === 'fight' && !F.ex && !opp.spar) { if (s === 'PARRIED!' && !e.isPlayer) G.deeds.bump('parry'); else if (s === 'PERFECT DODGE' && e.isPlayer) G.deeds.bump('perfect'); else if (!e.isPlayer && String(s).indexOf('WALL ') === 0) G.deeds.bump('wall'); } gfx.floatText(e.x / S, 2.3 + rand(0, 0.3), e.y / S, s, col || '#fff', big); }
  function spark(x, y, z, col, n, sp) { gfx.burst(x / S, (z || 30) / S, y / S, col, n, (sp || 160) / S, 3); }
  function addHype(v) { const h0 = hype; hype = clamp(hype + v, 0, 100); if (h0 < 80 && hype >= 80) G.sfx('cheer'); if (h0 < 100 && hype >= 100 && phase === 'fight' && P && !P.buffs.frenzy && !F.ex) frenzy(); }
  // the whole pit on its feet: for a few seconds everything you do is bigger
  function frenzy() {
    setBuff(P, 'frenzy', 6, 0); F.frenzies = (F.frenzies || 0) + 1; text(P, 'THE PIT ERUPTS', '#ffd36b', true); G.sfx('cheer'); G.sfx('crowd'); G.sfx('level'); shake = Math.max(shake, 8); hitstop = Math.max(hitstop, 0.08);
    fx.push({ k: 'ring', x: P.x, y: P.y, r: 260, col: '#ffd36b', t: 0, life: 0.6 }); arena.setHype(1); if (G.rumble) G.rumble(260, 0.8);
    if (counted() && G.deeds) G.deeds.bump('frenzy');
  }
  const heavyId = e => e.mastered && A[e.basic + '_m'] ? e.basic + '_m' : e.basic + '_h';      // a mastered weapon's heavy blow is its signature
  const TAUNT = { type: 'taunt', rec: 0.9, name: '' };
  const TAUNTS = ['COME ON, THEN!', 'IS THAT ALL?', 'LOOK AT ME!', 'WHO IS NEXT?', 'LOUDER!'];
  function taunt(e) {
    if (phase !== 'fight' || e.state !== 'idle' || e.st.stun || time - (e.tauntT || -9) < 5) { if (e.isPlayer) G.sfx('deny'); return; }
    const foe = e.foe, big = !!(foe.st.stun || foe.st.broken);
    e.tauntT = time; e.state = 'recover'; e.t = TAUNT.rec; e.act = { ab: TAUNT, step: 0, aim: e.aim, taunt: 1, pay: big ? 12 : 8 }; e.charging = 0; e.guard = 0;
    if (e.isPlayer) { text(e, G.pick(TAUNTS), '#ffd36b', true); G.sfx('cheer'); addHype(big ? 14 : 8);  if (G.spirits) G.spirits.onTaunt(e, foe, big); } else { text(e, '…', '#ff8a6a', true); addHype(-6); }
  }
  F.taunt = () => taunt(P);
  function angDiff(a, b) { let d = a - b; while (d > Math.PI) d -= 6.283; while (d < -Math.PI) d += 6.283; return Math.abs(d); }
  function segDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy || 1;
    const t = clamp(((px - ax) * dx + (py - ay) * dy) / l, 0, 1);
    return Math.hypot(px - ax - dx * t, py - ay - dy * t);
  }
  function setBuff(e, k, dur, amt) { e.buffs[k] = { t: dur, amt: amt || 0 }; }
  function heal(e, v) { v = Math.round(v * e.d.healMul); e.hp = Math.min(e.maxHp, e.hp + v); text(e, '+' + v, '#7dffa0'); fx.push({ k: 'ring', x: e.x, y: e.y, r: 70, col: '#7dffa0', t: 0, life: 0.5 }); for (let hi = 0; hi < 16; hi++) { const ha = hi * 0.8; gfx.emit(e.x / S + Math.cos(ha) * 0.6, 0.2 + hi * 0.05, e.y / S + Math.sin(ha) * 0.6, -Math.sin(ha) * 1.2, rand(2, 3.5), Math.cos(ha) * 1.2, rand(0.6, 1), '#7dffa0', -0.5); } spark(e.x, e.y, 30, '#7dffa0', 14, 90); G.sfx('heal'); }

  // ------------------------------------------------------------------ floor marks: scorches, cracks and holy afterglow
  let marks = [], markN = 0, camKx = 0, camKz = 0, slowT = 0;
  // posture: every blow wears it down; when it goes, you reel and take the next one clean
  const POISE = { fighter: 120, cleric: 110, rogue: 85, sorcerer: 88, druid: 104, warlock: 86 };
  function initPoise() { [P, E].forEach(e => { if (!e || e.maxPoise) return; e.maxPoise = POISE[e.cls] * (e.boss ? 1.3 : 1) + (e.d.poise || 0); e.poise = e.maxPoise; e.poiseT = 0; e.d.speed *= 0.92; }); }
  const counted = () => phase === 'fight' && !F.ex && !opp.spar && G.deeds;
  function poiseHit(e, v, by) {
    if (!e.maxPoise || e.st.broken || e.state === 'ko' || e.hp <= 0 || F.ex) return;
    if ((e.braceT || 0) > time) v *= 0.4;                 // just been broken: braced, and much harder to break again
    e.poise -= v; e.poiseT = v >= 20 ? 1.8 : 0.9;         // a light tap interrupts recovery only briefly
    if (e.poise > 0) return;
    e.poise = e.maxPoise; e.braceT = time + 6; e.st.stun = { t: 1.3 }; e.st.broken = { t: 1.7 }; interrupt(e); e.guard = 0; e.charging = 0;
    text(e, 'POSTURE BROKEN', '#ffb070', true); G.sfx('stun'); G.sfx('clang'); shake = Math.max(shake, 12); hitstop = Math.max(hitstop, 0.14); slowT = Math.max(slowT, 0.2);
    fx.push({ k: 'ring', x: e.x, y: e.y, r: 130, col: '#ffb070', t: 0, life: 0.45 });
    if (by && by.isPlayer) { addHype(12); if (counted()) G.deeds.bump('break'); }
  }
  // full-screen punctuation: a red edge when you are hurt, a white pop on a crit, a splash when something comes off
  function screenFx(kind) { const el = document.getElementById('hitfx'); if (!el || F.ex) return; el.className = ''; void el.offsetWidth; el.className = kind; }
  function knockdown(e, t) { if (e.state === 'ko') return; e.st.stun = { t }; interrupt(e); e.down = e.downT = t; e.lastDown = time; e.vx = e.vy = 0; fx.push({ k: 'dust', x: e.x, y: e.y, r: 90, t: 0.12, life: 0.5 }); }
  // a limb comes off: it is thrown as a gib, the stump bleeds, and the fighter is worse for it
  function sever(tgt, part, att, dir) {
    const limb = tgt.vis.c.sever(part); if (!limb) return; tgt.lost = tgt.lost || {}; tgt.lost[part] = 1;
    sc.attach(limb); const a = dir + rand(-0.6, 0.6), v = rand(3, 5.5);
    gibs.push({ m: limb, vx: Math.cos(a) * v, vz: Math.sin(a) * v, vy: rand(5.5, 8.5), rx: rand(-10, 10), rz: rand(-10, 10) });
    blood(tgt.x, tgt.y, 70, dir); blood(tgt.x, tgt.y, 40); if (gore()) for (let i = 0; i < 5; i++) gfx.splat(tgt.x / S + rand(-1.2, 1.2), tgt.y / S + rand(-1.2, 1.2), rand(0.5, 1.2));
    if (att && att.isPlayer && counted()) G.deeds.bump('sever'); if (att && att.isPlayer) addHype(15);
    text(tgt, part === 'head' ? 'BEHEADED' : part === 'legR' ? 'LEGS GONE' : part === 'legL' ? 'LEG SEVERED' : 'ARM SEVERED', '#ff3020', true);
    if (tgt.lost.legL && tgt.lost.legR && !tgt.crawl && tgt.hp > 0) { tgt.crawl = 1; interrupt(tgt); tgt.guard = 0; tgt.st.stun = { t: 0.9 }; if (att && att.isPlayer) addHype(10); if (counted() && G.deeds) G.deeds.bump('crawl'); }      // nothing left to stand on: they come at you on their belly
    hitstop = Math.max(hitstop, 0.22); slowT = 0.5; shake = Math.max(shake, 19); camVh -= 0.9; flashLight(tgt.x, tgt.y, '#ff2010', 90);
    G.sfx('crit'); G.sfx('wall'); if (att && att.isPlayer) { addHype(16); G.sfx('cheer'); } if (G.rumble) G.rumble(300, 1);
    if (part === 'legL') tgt.d.speed *= 0.6; else tgt.d.dmgMul = (tgt.d.dmgMul || 1) * 0.85;
    knockdown(tgt, 0.85); screenFx('gore');
  }
  function mark(x, y, size, kind) {
    if (!sc) return;
    if (marks.length < 26) { const m = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; sc.add(m); marks.push(m); }
    const m = marks[markN % marks.length]; markN++; if (m.parent !== sc) sc.add(m);
    m.material.map = gfx.tex(kind === 'crack' ? 'crack' : 'scorch'); m.material.color.set(kind === 'glowmark' ? 0xfff0a0 : 0xffffff); m.material.blending = kind === 'glowmark' ? T.AdditiveBlending : T.NormalBlending; m.material.opacity = kind === 'glowmark' ? 0.35 : 0.8; m.material.needsUpdate = true;
    m.position.set(x / S, 0.016 + (markN % 26) * 0.0003, y / S); m.scale.setScalar(size * 2); m.rotation.z = rand(0, 6.28); m.visible = true;
  }

  // ------------------------------------------------------------------ blood, parries, mortal blows, the Second
  const gore = () => !G.state || G.state.gore !== false;
  function blood(x, y, n, dir) { if (!gore()) return spark(x, y, 30, '#c01818', Math.ceil(n / 3), 120); gfx.blood(x / S, 1.0, y / S, n, 4.6, dir); }
  const PARRY = { fighter: [0.30, 'SHIELD BLOCK'], rogue: [0.20, 'RIPOSTE'], sorcerer: [0.27, 'SHIELD'], cleric: [0.26, 'WARDING FLARE'], druid: [0.26, 'WARDING FLARE'], warlock: [0.27, 'SHIELD'] };
  function parryWindow(e) { return PARRY[e.cls][0] + (e.d.parry || 0) + Math.max(0, G.mod(e.stats.dex)) * 0.008; }
  // Each class answers a parried blow its own way.
  function parried(att, tgt, ab, o) {
    poiseHit(att, 40, tgt); tgt.ripT = time + 1.3;       // the opening a parry buys: the next blow is a riposte
    const cls = tgt.cls, resist = att.boss ? 0.6 : 1, pa = Math.atan2(att.y - tgt.y, att.x - tgt.x), near = Math.hypot(att.x - tgt.x, att.y - tgt.y) < 170;
    text(tgt, PARRY[cls][1] + '!', '#ffe9a0', true); G.sfx('clang'); G.sfx('perfect'); hitstop = Math.max(hitstop, 0.13); shake = Math.max(shake, 7);
    spark(tgt.x, tgt.y, 36, '#ffe9a0', 16, 240); flashLight(tgt.x, tgt.y, '#ffe9a0', 45);
    fx.push({ k: 'ring', x: tgt.x, y: tgt.y, r: 70, col: '#ffe9a0', t: 0, life: 0.3 });
    tgt.state = 'idle'; tgt.parryT = 0; tgt.parryCd = 0.25; tgt.res = Math.min(100, tgt.res + 14); tgt.act = null;
    if (tgt.isPlayer) addHype(14); else addHype(-6);
    if (o.proj) { if (cls === 'fighter' || cls === 'sorcerer') o.proj.reflect = 1; }
    else if (near) { att.st.stun = { t: (cls === 'fighter' ? 0.9 : 0.5) * resist }; interrupt(att); }
    if (cls === 'fighter' && near) { att.kx = Math.cos(pa) * 150; att.ky = Math.sin(pa) * 150; att.kBy = tgt; }
    if (cls === 'rogue' && near) { fx.push({ k: 'slash', x: tgt.x, y: tgt.y, a: pa, r: 70, arc: 1.4, col: '#cfd8e0', t: 0, life: 0.18 }); hit(tgt, att, { type: 'melee', dmg: [2, 6], stat: 'dex', color: '#cfd8e0' }, { noCounter: 1, power: 1.5 }); }
    if (cls === 'sorcerer' && near) { att.kx = Math.cos(pa) * 340 * resist; att.ky = Math.sin(pa) * 340 * resist; att.kBy = tgt; att.st.slow = { t: 1.5, amt: 0.4 }; }
    if (cls === 'cleric') { heal(tgt, G.roll([1, 6]) + G.mod(tgt.stats.wis)); if (near) att.st.slow = { t: 2.2, amt: 0.45 }; }
  }
  // The Second: one of your Tallymen in your corner. One call per bout.
  function callSecond() {
    const s2 = P.second; if (!s2 || F.assistUsed || phase !== 'fight' || P.state === 'ko') { G.sfx('deny'); return; }
    F.assistUsed = 1; const nm = s2.name.split(' ')[0];
    text(P, nm.toUpperCase() + '!', '#ffd36b', true); G.sfx('buff'); addHype(8);
    const a = Math.atan2(E.y - P.y, E.x - P.x) + 1.9, ex = { x: E.x + Math.cos(a) * 250, y: E.y + Math.sin(a) * 250 }; clampArena(ex);
    if (s2.cls === 'cleric') { heal(P, P.maxHp * 0.25); P.shield = Math.max(P.shield, 22); P.buffs.shield = { t: 6 }; fx.push({ k: 'blast', x: P.x, y: P.y, r: 60, col: '#fff0a0', t: 0, life: 0.5, pillar: 1 }); }
    else if (s2.cls === 'fighter') { fx.push({ k: 'trail', x1: ex.x, y1: ex.y, x2: E.x, y2: E.y, col: '#ffd36b', t: 0, life: 0.4 }); hit(P, E, { type: 'melee', dmg: [2, 8], stat: 'str', stun: 1.3, knock: 230, color: '#ffd36b' }, { noCounter: 1, from: a + Math.PI }); }
    else if (s2.cls === 'rogue') { for (let i = 0; i < 5; i++) { const aa = Math.atan2(E.y - ex.y, E.x - ex.x) + (i - 2) * 0.09; projs.push({ x: ex.x, y: ex.y, vx: Math.cos(aa) * 700, vy: Math.sin(aa) * 700, a: aa, r: 7, owner: P, ab: Object.assign({}, A.fan_knives, { dot: ['poison', 4, [1, 4]] }), t: 0 }); } G.sfx('swing'); }
    else { zones.push({ x: E.x, y: E.y, r: 85, delay: 0.6, t: 0, owner: P, ab: { type: 'aoe', dmg: [4, 6], stat: 'cha', fire: 1, color: '#ff8a2a', knock: 180, dot: ['burn', 3, [1, 4]] } }); fx.push({ k: 'lob', x1: ex.x, y1: ex.y, x2: E.x, y2: E.y, col: '#ff8a2a', t: 0, life: 0.6 }); G.sfx('fire'); }
  }
  // ---- mortal blows: a win is a kill, and each trade has its own way of ending things
  let M = null, gibs = [];
  function clearGibs() { gibs.forEach(g => sc.remove(g.m)); gibs = []; }
  // cut clean in two: each half goes its own way
  function halves(e, a) { const col = e.vis.c.mats[0] ? e.vis.c.mats[0].color.getHex() : 0x666666; [-1, 1].forEach(sd => { const g = new T.Group(); g.add(new T.Mesh(new T.BoxGeometry(0.34, 1.5, 0.4), new T.MeshLambertMaterial({ color: col, flatShading: true }))); const cut = new T.Mesh(new T.BoxGeometry(0.02, 1.46, 0.38), new T.MeshBasicMaterial({ color: 0x8a0c0c })); cut.position.x = -sd * 0.17; g.add(cut);
      g.position.set(e.x / S + Math.cos(a + Math.PI / 2) * sd * 0.2, 0.85, e.y / S + Math.sin(a + Math.PI / 2) * sd * 0.2); g.rotation.y = -a; sc.add(g); gibs.push({ m: g, vx: Math.cos(a + Math.PI / 2) * sd * 2.4, vz: Math.sin(a + Math.PI / 2) * sd * 2.4, vy: 2.6, rx: 0, rz: sd * 2.6 }); }); }
  // bits knocked loose by a blow that really landed
  function chunks(e, n) { for (let i = 0; i < n; i++) { const sz = rand(0.05, 0.11), m = new T.Mesh(new T.BoxGeometry(sz, sz, sz), new T.MeshLambertMaterial({ color: i % 3 ? 0x7a0c0c : 0xe6dcc4, flatShading: true })); m.position.set(e.x / S + rand(-0.2, 0.2), rand(0.9, 1.6), e.y / S + rand(-0.2, 0.2)); sc.add(m); const a = rand(0, 6.28), v = rand(1.5, 4); gibs.push({ m, vx: Math.cos(a) * v, vz: Math.sin(a) * v, vy: rand(3, 6), rx: rand(-12, 12), rz: rand(-12, 12) }); } }
  function makeGibs(e, ash, clean) {
    const cols = ash ? [0x3a3a3a, 0x555555, 0x222222] : e.vis.c.mats.slice(0, 5).map(m => m.color.getHex()).concat(gore() && !clean ? [0x7a0c0c, 0x5a0808, 0x8a1010] : []);
    for (let i = 0; i < (ash ? 26 : 20); i++) {
      const sz = rand(0.1, ash ? 0.2 : 0.32), m = new T.Mesh(new T.BoxGeometry(sz, sz * rand(0.6, 1.4), sz), new T.MeshLambertMaterial({ color: G.pick(cols), flatShading: true }));
      m.position.set(e.x / S + rand(-0.3, 0.3), rand(0.4, 1.7), e.y / S + rand(-0.3, 0.3)); m.castShadow = true; sc.add(m);
      const a = rand(0, 6.28), v = rand(1.5, ash ? 4 : 7); gibs.push({ m, vx: Math.cos(a) * v, vz: Math.sin(a) * v, vy: rand(3, 9), rx: rand(-9, 9), rz: rand(-9, 9), ash });
    }
  }
  function startMortal(e) {
    e.st = { stun: { t: 99 } }; e.buffs = {}; interrupt(e); e.kx = e.ky = 0; e.guard = 0; e.state = 'idle';
    P.st = {}; delete P.buffs.stealth; interrupt(P); P.state = 'idle'; P.kx = P.ky = 0; P.iframe = 9;
    projs.forEach(p => p.m && sc.remove(p.m)); projs = []; zones.forEach(z => z.m && sc.remove(z.m)); zones = [];
    const a = Math.atan2(e.y - P.y, e.x - P.x); P.x = e.x - Math.cos(a) * 66; P.y = e.y - Math.sin(a) * 66; clampArena(P); P.aim = a;
    const def = G.mortalOf ? G.mortalOf(G.state) : Object.assign({ id: 'base' }, G.MORTAL[P.cls]);
    M = { t: 0, e, a, f: {}, name: def.name, def, k: def.lead || def.id };
    phase = 'mortal'; hitstop = 0.3; shake = 10; result = { win: true };
    G.ui.banner('Mortal Blow', M.name, 'win mortal'); G.sfx('bell'); G.sfx('crowd');
  }
  function mortalStep(dt) {
    const m = M, e = m.e, cls = P.cls, def = m.def, k = m.k, IMP = def.imp || 1.2, cast = def.cast != null ? def.cast : (cls === 'sorcerer' || cls === 'cleric'); m.t += dt;
    const once = (key, tt, fn) => { if (m.t >= tt && !m.f[key]) { m.f[key] = 1; fn(); } };
    const every = (key, t0, t1, step, fn) => { for (let i = 0, tt = t0; tt < t1; i++, tt += step) once(key + i, tt, () => fn(i)); };
    const col = def.col || { fighter: '#ffd36b', rogue: '#c79bff', sorcerer: '#8aff5a', cleric: '#fff0a0', druid: '#8fe07a', warlock: '#b070ff' }[cls];
    if (m.t < IMP) { P.state = 'wind'; P.act = { ab: cast ? { type: 'aoe', at: 'target', color: col, wind: IMP } : A[P.basic], step: 2, fin: 1, total: IMP, aim: m.a }; P.t = IMP - m.t; P.aim = m.a; }
    else if (m.t < IMP + 0.45 && !cast) { P.state = 'recover'; P.t = Math.max(0.01, IMP + 0.45 - m.t); }
    else { P.state = 'idle'; P.act = null; }
    // ---- the lead-in, one per blow
    if (k === 'cuts') every('c', 0.3, 1.1, 0.12, () => { const a = rand(0, 6.28); fx.push({ k: 'trail', x1: e.x + Math.cos(a) * 110, y1: e.y + Math.sin(a) * 110, x2: e.x - Math.cos(a) * 110, y2: e.y - Math.sin(a) * 110, col, t: 0, life: 0.22 }); blood(e.x, e.y, 7, a); e.flash = 0.08; G.sfx('swing'); shake = Math.max(shake, 4); });
    if (k === 'quiet') {
      once('van', 0.2, () => { fx.push({ k: 'ghost', x: P.x, y: P.y, col, t: 0, life: 0.5 }); spark(P.x, P.y, 12, col, 10, 160); P.x = e.x + Math.cos(m.a) * 66; P.y = e.y + Math.sin(m.a) * 66; clampArena(P); m.a = Math.atan2(e.y - P.y, e.x - P.x); P.aim = m.a; G.sfx('dash'); });
      once('stab', 0.62, () => { fx.push({ k: 'trail', x1: P.x, y1: P.y, x2: e.x + Math.cos(m.a) * 90, y2: e.y + Math.sin(m.a) * 90, col: '#ffffff', t: 0, life: 0.3 }); blood(e.x, e.y, 10, m.a); e.flash = 0.12; G.sfx('swing'); hitstop = Math.max(hitstop, 0.14); text(e, '…', col, true); });
    }
    if (k === 'rain') every('r', 0.25, IMP, 0.07, i => { const a = i * 2.4; fx.push({ k: 'bolt', x1: e.x + Math.cos(a) * 280, y1: e.y + Math.sin(a) * 280, x2: e.x, y2: e.y, col: i % 3 ? col : '#ffffff', t: 0, life: 0.16 }); blood(e.x, e.y, 3, a + Math.PI); e.flash = 0.05; if (i % 2) G.sfx('swing'); shake = Math.max(shake, 3); });
    if (k === 'disint') { once('beam', 0.45, () => { fx.push({ k: 'bolt', x1: P.x, y1: P.y, x2: e.x, y2: e.y, col, t: 0, life: IMP - 0.45 }); G.sfx('zap'); }); if (m.t > 0.45 && m.t < IMP) { e.flash = 0.05; gfx.emit(e.x / S + rand(-0.4, 0.4), rand(0.3, 1.8), e.y / S + rand(-0.4, 0.4), 0, 3, 0, 0.4, col, 0); } }
    if (k === 'meteor') every('m', 0.3, IMP - 0.1, 0.27, () => { const a = rand(0, 6.28), d = rand(40, 120), x = e.x + Math.cos(a) * d, y = e.y + Math.sin(a) * d; fx.push({ k: 'blast', x, y, r: 70, col, t: 0, life: 0.45 }); fx.push({ k: 'dust', x, y, r: 110, t: 0, life: 0.6 }); mark(x, y, 2.2, 'scorch'); flashLight(x, y, col, 80); G.sfx('boom'); shake = Math.max(shake, 11); e.flash = 0.08; for (let fi = 0; fi < 10; fi++) gfx.emit(x / S + rand(-0.8, 0.8), 0.2, y / S + rand(-0.8, 0.8), 0, rand(3, 7), 0, rand(0.5, 1), fi % 2 ? '#ff8a2a' : '#ffd060', -1); });
    if (k === 'storm') every('s', 0.3, IMP, 0.09, i => { const a = rand(0, 6.28), d = rand(250, 380); fx.push({ k: 'bolt', x1: e.x + Math.cos(a) * d, y1: e.y + Math.sin(a) * d, x2: e.x, y2: e.y, col: i % 2 ? col : '#ffffff', t: 0, life: 0.18 }); e.flash = 0.06; flashLight(e.x, e.y, col, 50); if (i % 2 === 0) G.sfx('zap'); shake = Math.max(shake, 5); });
    if (k === 'strike') once('sky', 0.4, () => { zones.push({ x: e.x, y: e.y, r: 78, delay: IMP - 0.4, t: 0, owner: P, ab: { type: 'aoe', dmg: [1, 1], radiant: 1, color: col } }); G.sfx('holy'); });
    if (k === 'smite') every('g', 0.2, IMP - 0.1, 0.28, i => { fx.push({ k: 'ring', x: e.x, y: e.y, r: 230 - i * 55, col, t: 0, life: 0.45 }); e.flash = 0.06; G.sfx('holy'); });
    if (k === 'word') { once('w', 0.3, () => { fx.push({ k: 'ring', x: P.x, y: P.y, r: 420, col, t: 0, life: 0.9 }); G.sfx('holy'); text(P, '“Die.”', col, true); }); once('hush', IMP - 0.5, () => { hitstop = Math.max(hitstop, 0.28); flashLight(e.x, e.y, '#ffffff', 130); e.flash = 0.4; }); }
    if (k === 'wall') {
      once('h1', 0.35, () => { fx.push({ k: 'slash', x: P.x, y: P.y, a: m.a, r: 130, arc: 2.4, col, t: 0, life: 0.25 }); blood(e.x, e.y, 14, m.a); e.flash = 0.1; G.sfx('crit'); shake = 12; hitstop = Math.max(hitstop, 0.1); text(e, 'LAUNCHED', col, true); });
      if (m.t > 0.42 && m.t < IMP - 0.2 && !m.f.wl) { const nx = e.x + Math.cos(m.a) * 1100 * dt, ny = e.y + Math.sin(m.a) * 1100 * dt; if (inArena(nx, ny, -34)) { e.x = nx; e.y = ny; if (Math.random() < 0.5) fx.push({ k: 'dust', x: e.x, y: e.y, r: 44, t: 0, life: 0.4 }); } else { m.f.wl = 1; G.sfx('wall'); shake = 15; mark(e.x, e.y, 1.8, 'crack'); spark(e.x, e.y, 16, '#d8ccb0', 20, 260); blood(e.x, e.y, 12); } }
      once('chase', IMP - 0.25, () => { fx.push({ k: 'trail', x1: P.x, y1: P.y, x2: e.x, y2: e.y, col, t: 0, life: 0.3 }); for (let gi = 0; gi < 4; gi++) fx.push({ k: 'ghost', x: G.lerp(P.x, e.x, gi / 4), y: G.lerp(P.y, e.y, gi / 4), col, t: -gi * 0.03, life: 0.34 }); P.x = e.x - Math.cos(m.a) * 66; P.y = e.y - Math.sin(m.a) * 66; clampArena(P); G.sfx('dash'); });
    }
    if (k === 'quake') every('q', 0.3, IMP - 0.1, 0.27, i => { const a = rand(0, 6.28), d = 50 + i * 26; mark(e.x + Math.cos(a) * d, e.y + Math.sin(a) * d, 1.3 + i * 0.3, 'crack'); fx.push({ k: 'dust', x: e.x, y: e.y, r: 90 + i * 40, t: 0, life: 0.5 }); fx.push({ k: 'slash', x: P.x, y: P.y, a: m.a, r: 120, arc: 2, col, t: 0, life: 0.2 }); shake = Math.max(shake, 9 + i * 2); G.sfx('wall'); e.flash = 0.07; blood(e.x, e.y, 5, m.a); });
    if (k === 'pack') every('p', 0.2, IMP - 0.05, 0.14, i => { const a = i * 2.1 + 0.4, x1 = e.x + Math.cos(a) * 200, y1 = e.y + Math.sin(a) * 200; fx.push({ k: 'ghost', x: G.lerp(x1, e.x, 0.5), y: G.lerp(y1, e.y, 0.5), col, t: 0, life: 0.3 }); fx.push({ k: 'trail', x1, y1, x2: e.x, y2: e.y, col: i % 2 ? col : '#ffffff', t: 0, life: 0.2 }); blood(e.x, e.y, 9, a + Math.PI); e.flash = 0.08; e.x += Math.cos(a + Math.PI) * 7; e.y += Math.sin(a + Math.PI) * 7; G.sfx(i % 2 ? 'hit' : 'swing'); shake = Math.max(shake, 6); });
    if (k === 'sink') { every('k', 0.2, IMP, 0.22, i => { fx.push({ k: 'ring', x: e.x, y: e.y, r: 200 - i * 34, col, t: 0, life: 0.4 }); fx.push({ k: 'dust', x: e.x, y: e.y, r: 70 + i * 16, t: 0, life: 0.5 }); mark(e.x + rand(-30, 30), e.y + rand(-30, 30), 1.2 + i * 0.3, 'crack'); G.sfx('wall'); shake = Math.max(shake, 6 + i * 2); }); if (m.t > 0.45 && m.t < IMP) { e.z -= dt * 34; e.flash = 0.03; } }
    if (k === 'lift') { if (m.t > 0.2 && m.t < IMP - 0.12) { e.z = Math.min(95, e.z + dt * 150); e.flash = 0.04; if (Math.random() < 0.7) gfx.emit(e.x / S + rand(-0.3, 0.3), e.z / S + rand(0.2, 1.6), e.y / S + rand(-0.3, 0.3), rand(-1, 1), rand(-2, 0), rand(-1, 1), 0.4, col, 0); } once('lf', 0.2, () => { fx.push({ k: 'ring', x: e.x, y: e.y, r: 120, col, t: 0, life: 0.5 }); G.sfx('holy'); }); once('dr', IMP - 0.12, () => { e.z = 0; G.sfx('wall'); mark(e.x, e.y, 2.6, 'crack'); }); }
    if (k === 'impale') every('i', 0.25, IMP, 0.16, i => { const a = i * 1.26, ox = Math.cos(a) * 46, oy = Math.sin(a) * 46; fx.push({ k: 'bolt', x1: e.x + ox * 4, y1: e.y + oy * 4 - 260, x2: e.x + ox * 0.3, y2: e.y + oy * 0.3, col: '#e8eef4', t: 0, life: 0.2 }); blood(e.x, e.y, 10, a); e.flash = 0.1; G.sfx('crit'); shake = Math.max(shake, 8); hitstop = Math.max(hitstop, 0.05); text(e, i % 2 ? '' : 'PINNED', col); });
    if (k === 'spin') every('n', 0.25, IMP - 0.1, 0.22, i => { fx.push({ k: 'slash', x: P.x, y: P.y, a: m.a + (i % 2 ? 0.9 : -0.9), r: 140, arc: 3.0, col, t: 0, life: 0.22 }); blood(e.x, e.y, 12, m.a + i); e.flash = 0.09; G.sfx('swing'); shake = Math.max(shake, 7); });
    // ---- showier work: the body is part of the act
    const hold = (act, t0, dur) => { if (m.t >= t0 && m.t < t0 + dur) P.poseOv = { act, prog: (m.t - t0) / dur }; else if (P.poseOv && P.poseOv.act === act && m.t >= t0 + dur) P.poseOv = null; };
    if (k === 'stomp') { once('trip', 0.25, () => { fx.push({ k: 'slash', x: P.x, y: P.y, a: m.a, r: 120, arc: 2.2, col, t: 0, life: 0.22 }); e.state = 'ko'; e.koT = 0; e.st = {}; blood(e.x, e.y, 14, m.a); G.sfx('hit'); shake = Math.max(shake, 9); text(e, 'DOWN', col, true); });
      once('walk', 0.55, () => { P.x = e.x - Math.cos(m.a) * 34; P.y = e.y - Math.sin(m.a) * 34; clampArena(P); fx.push({ k: 'dust', x: P.x, y: P.y, r: 50, t: 0, life: 0.4 }); }); hold('stomp', IMP - 0.5, 0.75); }
    if (k === 'puppet') { if (m.t > 0.15 && m.t < IMP - 0.1) { e.z = Math.min(80, e.z + dt * 130); e.flash = 0.03; } once('p0', 0.15, () => { fx.push({ k: 'ring', x: e.x, y: e.y, r: 110, col, t: 0, life: 0.5 }); G.sfx('holy'); });
      ['armL', 'armR', 'legL'].forEach((part, i) => once('pp' + i, 0.5 + i * 0.3, () => { if (gore() && !e.vis.c.beast) sever(e, part, null, m.a + (i - 1) * 1.6); else blood(e.x, e.y, 20); fx.push({ k: 'bolt', x1: P.x, y1: P.y, x2: e.x, y2: e.y, col, t: 0, life: 0.14 }); e.flash = 0.12; G.sfx('crit'); shake = Math.max(shake, 9); hitstop = Math.max(hitstop, 0.07); })); }
    if (k === 'ice') { const ice = new T.Color(0xbfe8ff); every('ic', 0.2, IMP, 0.14, i => { e.vis.c.mats.forEach(mm => mm.color.lerp(ice, 0.3)); fx.push({ k: 'ring', x: e.x, y: e.y, r: 150 - i * 12, col: '#bfe8ff', t: 0, life: 0.3 }); e.flash = 0.05; if (i % 2 === 0) G.sfx('ice'); spark(e.x, e.y, 6, '#dff4ff', 8, 120); }); e.st = { stun: { t: 1 } }; }
    if (k === 'implode') { if (m.t > 0.25 && m.t < IMP) { const s = Math.max(0.12, 1 - (m.t - 0.25) / (IMP - 0.25)); e.vis.g.scale.setScalar(s); e.flash = 0.04; } every('im', 0.25, IMP, 0.2, i => { fx.push({ k: 'ring', x: e.x, y: e.y, r: 220 - i * 40, col, t: 0, life: 0.3 }); G.sfx('zap'); shake = Math.max(shake, 5 + i); }); }
    if (def.hoist) hold('hoist', 0.25, IMP - 0.2);
    once('imp', IMP, () => {
      const ash = !!def.ash;
      if (!cast) fx.push({ k: 'slash', x: P.x, y: P.y, a: m.a, r: 150, arc: 3.4, col, t: 0, life: 0.35 });
      fx.push({ k: 'blast', x: e.x, y: e.y, r: def.fire ? 150 : 100, col, t: 0, life: 0.6, pillar: !!def.pillar });
      fx.push({ k: 'ring', x: e.x, y: e.y, r: 240, col, t: 0, life: 0.7 }); fx.push({ k: 'dust', x: e.x, y: e.y, r: 200, t: 0, life: 0.8 });
      if (def.crack) mark(e.x, e.y, 3.4, 'crack'); if (def.fire || ash) mark(e.x, e.y, 3, 'scorch');
      spark(e.x, e.y, 30, col, 40, 420); flashLight(e.x, e.y, col, 170); shake = 22; hitstop = 0.22;
      if (!ash && !def.swallow && !def.ice) { blood(e.x, e.y, 70); blood(e.x, e.y, 40, m.a); }
      screenFx('crit');
      e.z = 0; e.vis.g.scale.setScalar(1); const behead = def.behead && gore() && !e.vis.c.beast && !(e.lost && e.lost.head); m.f.stand = behead && !e.crawl ? 1 : 0;
      if (behead) { sever(e, 'head', null, m.a); for (let bi = 0; bi < 26; bi++) gfx.emit(e.x / S + rand(-0.1, 0.1), 1.5, e.y / S + rand(-0.1, 0.1), rand(-1.4, 1.4), rand(4, 8), rand(-1.4, 1.4), rand(0.5, 0.9), '#8a0c0c', 1); }
      else if (def.swallow) { e.vis.g.visible = false; fx.push({ k: 'dust', x: e.x, y: e.y, r: 260, t: 0, life: 1 }); mark(e.x, e.y, 3.6, 'crack'); }
      else if (def.bisect && gore() && !e.vis.c.beast) { halves(e, m.a); e.vis.g.visible = false; for (let bi = 0; bi < 30; bi++) gfx.emit(e.x / S, rand(0.3, 1.7), e.y / S, rand(-1, 1), rand(1, 5), rand(-1, 1), rand(0.5, 0.9), '#8a0c0c', 1); }
      else if (def.keep) { chunks(e, 8); mark(e.x, e.y, 2.4, 'crack'); }
      else { makeGibs(e, ash, !!def.ice); e.vis.g.visible = false; }
      if (e.vis.tele) { sc.remove(e.vis.tele); e.vis.tele = null; }
      if (m.f.stand) { e.state = 'idle'; e.st = { stun: { t: 9 } }; } else if (def.keep) { if (e.state !== 'ko') { e.state = 'ko'; e.koT = 0; } e.st = {}; } else { e.state = 'ko'; e.koT = 9; e.st = {}; }
      hype = 100; arena.setHype(1); G.sfx('boom'); G.sfx('crit'); G.sfx('cheer'); if (G.rumble) G.rumble(400, 1);
      text(e, def.word, col, true);
    });
    // a headless body stands a moment; then it falls, or you help it
    if (m.f.stand) { if (def.kick) { hold('kick', IMP + 0.4, 0.5); once('boot', IMP + 0.66, () => { e.st = {}; e.state = 'ko'; e.koT = 0; G.sfx('hit'); G.sfx('wall'); shake = Math.max(shake, 12); hitstop = Math.max(hitstop, 0.08); blood(e.x, e.y, 20, m.a); text(e, 'AND STAY DOWN', col, true); m.f.slide = 1; }); if (m.f.slide && m.t < IMP + 1.15) { const nx = e.x + Math.cos(m.a) * 420 * dt, ny = e.y + Math.sin(m.a) * 420 * dt; if (inArena(nx, ny, -30)) { e.x = nx; e.y = ny; if (Math.random() < 0.4) fx.push({ k: 'dust', x: e.x, y: e.y, r: 36, t: 0, life: 0.35 }); } } }
      else once('topple', IMP + 0.6, () => { e.st = {}; e.state = 'ko'; e.koT = 0; G.sfx('wall'); fx.push({ k: 'dust', x: e.x, y: e.y, r: 70, t: 0, life: 0.5 }); }); }
    if (def.toss) { once('toss', IMP, () => { m.f.toss = 1; G.sfx('swing'); }); if (m.f.toss && m.t < IMP + 0.5) { const nx = e.x + Math.cos(m.a) * 620 * dt, ny = e.y + Math.sin(m.a) * 620 * dt; if (inArena(nx, ny, -30)) { e.x = nx; e.y = ny; if (Math.random() < 0.6) blood(e.x, e.y, 3, m.a); } else if (!m.f.tw) { m.f.tw = 1; G.sfx('wall'); shake = 14; mark(e.x, e.y, 1.8, 'crack'); blood(e.x, e.y, 30); } } }
    if (m.t > IMP + 2.2) P.poseOv = null;
    once('roar', IMP + 0.55, () => { G.sfx('cheer'); G.sfx('win'); G.ui.banner('Victory', 'The pit erupts', 'win mortal'); });
    once('roar2', IMP + 1.3, () => G.sfx('cheer'));
    if (m.t > IMP + (def.tail || 2.3)) { P.poseOv = null; phase = 'ko'; phaseT = 0.35; }
  }

  // ------------------------------------------------------------------ damage
  function hit(att, tgt, ab, o) {
    o = o || {};
    if (tgt.state === 'ko' || phase !== 'fight') return false;
    if (tgt.iframe > 0) {
      if (o.dot || ab.type === 'aura') return false;
      if (tgt.dodgeStart != null && time - tgt.dodgeStart < 0.15 && !tgt.perfect) {
        tgt.perfect = 1; tgt.dodgeT = 0; tgt.res = Math.min(100, tgt.res + 14); setBuff(tgt, 'dmg', 2.5, 0.3); hitstop = Math.max(hitstop, 0.14);
        text(tgt, 'PERFECT DODGE', '#9fe8ff', true); G.sfx('perfect'); if (tgt.isPlayer) addHype(18); spark(tgt.x, tgt.y, 30, '#9fe8ff', 14, 200);
      } else text(tgt, 'DODGED', '#9fe8ff');
      if (tgt.isPlayer && !tgt.dodgeCredit) { addHype(10); tgt.dodgeCredit = 1; }
      return false;
    }
    if (tgt.buffs.counter && !o.noCounter) {
      delete tgt.buffs.counter; text(tgt, 'RIPOSTE!', '#9fd0ff', true); G.sfx('crit');
      fx.push({ k: 'slash', x: tgt.x, y: tgt.y, a: Math.atan2(att.y - tgt.y, att.x - tgt.x), r: 80, arc: 2.2, col: '#9fd0ff', t: 0, life: 0.22 });
      if (Math.hypot(att.x - tgt.x, att.y - tgt.y) < 160) hit(tgt, att, A.riposte_hit, { noCounter: 1 });
      if (tgt.isPlayer) addHype(15);
      return false;
    }
    if (tgt.state === 'parry' && tgt.parryT > 0 && ab.type !== 'aura' && !o.noCounter && !o.dot) { parried(att, tgt, ab, o); return false; }
    if (ab.type === 'melee' && !ab.spell && !o.noCounter && !o.dot && tgt.state === 'wind' && tgt.act && tgt.t < 0.1 && tgt.act.ab.type === 'melee' && !tgt.act.ab.spell && !!tgt.act.ab.heavy === !!ab.heavy && !tgt.act.ab.leap && angDiff(tgt.act.aim, Math.atan2(att.y - tgt.y, att.x - tgt.x)) < 0.9 && Math.hypot(att.x - tgt.x, att.y - tgt.y) < 150) {
      const ca = Math.atan2(tgt.y - att.y, tgt.x - att.x), mx = (att.x + tgt.x) / 2, my = (att.y + tgt.y) / 2, kv = ab.heavy ? 260 : 170;
      text({ x: mx, y: my }, 'CLASH', '#ffe9a0', true); G.sfx('clang'); G.sfx('perfect'); spark(mx, my, 44, '#ffe9a0', ab.heavy ? 30 : 18, 300); flashLight(mx, my, '#ffe9a0', 70); fx.push({ k: 'ring', x: mx, y: my, r: 110, col: '#ffe9a0', t: 0, life: 0.35 });
      hitstop = Math.max(hitstop, ab.heavy ? 0.2 : 0.12); shake = Math.max(shake, ab.heavy ? 14 : 8); if (ab.heavy) slowT = Math.max(slowT, 0.2);
      interrupt(tgt); tgt.state = 'recover'; tgt.t = 0.28; tgt.act = { ab: tgt.C ? A[tgt.basic] : ab, step: 0, missed: 0, aim: tgt.aim }; tgt.kx = Math.cos(ca) * kv; tgt.ky = Math.sin(ca) * kv; att.kx = -Math.cos(ca) * kv; att.ky = -Math.sin(ca) * kv; att.clashed = 1;
      poiseHit(tgt, 8, att); poiseHit(att, 8, tgt); if (att.isPlayer || tgt.isPlayer) addHype(8); if (G.rumble) G.rumble(140, 0.7);
      return false;
    }
    if (tgt.guard > 0 && ab.type !== 'aura' && !o.noCounter && !o.dot) {
      if (ab.basic) {
        tgt.guardHits = (tgt.guardHits || 0) + 1; text(tgt, 'BLOCKED', '#cfd8e0'); G.sfx('clang'); spark(tgt.x, tgt.y, 36, '#ffe9a0', 7, 150); tgt.flash = 0.04; if (att.isPlayer) addHype(-4);
        poiseHit(tgt, o.proj ? 0 : 9, att);                  // a bolt on the shield costs little; a blade on it costs more
        if (tgt.isPlayer) { tgt.res = Math.max(0, tgt.res - (o.proj ? 3 : 9)); if (counted()) G.deeds.bump('block'); if (tgt.res <= 0) { tgt.guard = 0; tgt.st.stun = { t: 0.6 }; text(tgt, 'GUARD CRUSHED', '#ff7a6a', true); G.sfx('stun'); return false; } }
        if (tgt.guardHits >= (tgt.isPlayer ? 3 : 2)) {
          tgt.guard = 0; tgt.think = 0; text(att, 'PARRIED!', '#ff7a6a', true); att.st.stun = { t: 0.65 }; interrupt(att); G.sfx('stun'); shake = Math.max(shake, 6);
          const pa = Math.atan2(att.y - tgt.y, att.x - tgt.x); att.kx = Math.cos(pa) * 150; att.ky = Math.sin(pa) * 150; if (att.isPlayer) addHype(-8);
        }
        return false;
      }
      tgt.guard = 0; o.power = (o.power || 1) * 1.3; o.brk = 1;
    }
    let dmg = G.roll(ab.dmg) + (ab.stat ? G.mod(att.stats[ab.stat]) : 0);
    if (ab.basic || (ab.type === 'melee' && !ab.spell)) dmg += att.d.weapon;
    if (att.d.fireBonus && ab.fire) dmg += ab.dmg[0];
    if (att.d.radiantMelee && ab.type === 'melee') dmg += G.roll([1, 6]);
    let crit = Math.random() < att.d.crit, sneak = false;
    if (att.buffs.sneak) { crit = true; sneak = true; dmg += G.roll([att.d.sneakDice, 6]); delete att.buffs.sneak; delete att.buffs.stealth; }
    let mul = att.d.dmgMul * (1 + (att.buffs.dmg ? att.buffs.dmg.amt : 0)) * (o.power || 1) * (ab.pow || 1) * (att.mast && (ab.basic || ab.heavy) ? 1 + att.mast * 0.03 : 1) * (tgt.st.broken ? 1.35 : 1) * (tgt.st.winded ? 1.15 : 1);
    if (ab.execute && tgt.hp / tgt.maxHp < 0.4) mul *= 2;
    if (crit) mul *= att.d.critMul;
    if (tgt.st.mark) mul *= 1.25;
    if (att.d.tactical && (tgt.st.stun || tgt.st.slow)) mul *= 1.3;
    let tag = null; const real = ab.type !== 'aura' && !o.dot;
    if (real && tgt.act && tgt.act.taunt && !tgt.act.spoiled) { tgt.act.spoiled = 1; mul *= 1.25; text(tgt, 'SHOWBOAT', '#ff8a6a', true); if (tgt.isPlayer) addHype(-12); else addHype(10); }      // caught playing to the crowd
    if (att.buffs.frenzy) mul *= 1.15; if (att.crawl) mul *= 0.6;
    if (real && att.ripT > time) { att.ripT = 0; mul *= 1.3; text(tgt, 'RIPOSTE', '#9fd0ff', true); poiseHit(tgt, 20, att); if (att.isPlayer) addHype(8); }
    if (real && ab.type === 'melee' && tgt.state !== 'ko' && angDiff(Math.atan2(att.y - tgt.y, att.x - tgt.x), tgt.aim) > 2.2) { mul *= 1.2; if (time - (tgt.flankT || -9) > 1.5) { tgt.flankT = time; text(tgt, 'FLANKED', '#c79bff'); if (att.isPlayer) addHype(4); } }
    if (real && tgt.state === 'wind' && tgt.act) { mul *= 1.25; tag = 'COUNTER'; } else if (real && (tgt.state === 'recover' || tgt.state === 'parry')) { mul *= 1.4; tag = 'PUNISH'; }
    if (o.proj && o.proj.dis) mul *= 0.75;
    dmg = Math.max(1, Math.round(dmg * mul * (1 - tgt.d.dr)));
    if (tgt.shield > 0) { const a = Math.min(tgt.shield, dmg); tgt.shield -= a; dmg -= a; if (a) text(tgt, 'WARD -' + a, '#ffe9a0'); }
    if (dmg > 0) {
      tgt.hp -= dmg; att.dmgDealt += dmg;
      text(tgt, (sneak ? 'SNEAK ' : '') + dmg + (crit ? '!' : ''), crit ? '#ffd23c' : (tgt.isPlayer ? '#ff7a6a' : '#ffffff'), crit);
    }
    if (tag && att.isPlayer) { text(tgt, tag, '#ffd23c', true); addHype(6); }
    if (tag === 'COUNTER' && tgt.act && !tgt.act.ab.armor) interrupt(tgt);
    tgt.hurt = 0.28;
    if (real) { poiseHit(tgt, (ab.heavy ? 60 : ab.basic ? 9 : 28) * (ab.pz || 1) * (crit ? 1.3 : 1), att); if (ab.heavy && att.isPlayer && counted()) G.deeds.bump('heavy'); }
    const wt = Math.min(1, dmg / Math.max(1, tgt.maxHp) * 5), ha = o.from != null ? o.from : Math.atan2(tgt.y - att.y, tgt.x - att.x);       // weight: how much of them this blow took
    tgt.flash = 0.12; hitstop = Math.max(hitstop, (crit ? 0.13 : 0.065) + wt * 0.07); shake = Math.max(shake, (crit ? 12 : 5) + wt * 6);
    if (real && dmg > 0) {
      if (tgt.isPlayer && (wt > 0.25 || crit)) screenFx('hurt'); else if (att.isPlayer && crit) screenFx('crit');
      if (crit && wt > 0.45) slowT = Math.max(slowT, 0.22);
      const heavy = crit || wt > 0.3 || !ab.basic || (att.act && att.act.fin);
      if (!tgt.isPlayer && !F.ex && !opp.spar && gore() && tgt.hp > 0 && heavy) { const fr = tgt.hp / tgt.maxHp; tgt.lost = tgt.lost || {}; if (fr < 0.5 && !tgt.lost.armL) sever(tgt, 'armL', att, ha); else if (fr < 0.32 && !tgt.lost.legL) sever(tgt, 'legL', att, ha); else if (fr < 0.18 && tgt.lost.legL && !tgt.lost.legR) sever(tgt, 'legR', att, ha); }
      if (tgt.hp > 0 && wt > 0.6 && !(tgt.down > 0) && time - (tgt.lastDown || -9) > 6) knockdown(tgt, 0.6);
    }
    if (real) { const kk = (crit ? 0.5 : 0.22) + wt * 0.4; camKx += Math.cos(ha) * kk; camKz += Math.sin(ha) * kk; camVh -= crit ? 0.5 : 0.15; if (crit || wt > 0.75) { fx.push({ k: 'dust', x: tgt.x, y: tgt.y, r: 70 + wt * 60, t: 0, life: 0.45 }); if (wt > 0.75) mark(tgt.x, tgt.y, 1.1, 'crack'); } }
    spark(tgt.x, tgt.y, 34, ab.color || '#fff', crit ? 18 : 9, crit ? 260 : 170);
    blood(tgt.x, tgt.y, crit ? 18 : 9, o.from != null ? o.from : Math.atan2(tgt.y - att.y, tgt.x - att.x));
    flashLight(tgt.x, tgt.y, ab.color || '#ffffff', crit ? 40 : 18);
    G.sfx(crit ? 'crit' : tgt.isPlayer ? 'hurt' : 'hit');
    if (G.rumble) G.rumble(tgt.isPlayer ? 160 : crit ? 110 : 50, tgt.isPlayer ? 0.8 : crit ? 0.6 : 0.25);
    if (att.isPlayer) { addHype(crit ? 10 : 5); if (ab.gain) att.res = Math.min(100, att.res + ab.gain); if (att.hp < att.maxHp * 0.2 && time - (att.lbT || -9) > 3) { att.lbT = time; addHype(8); text(att, 'LAST BREATH', '#ff8a6a', true); } }
    else addHype(-7);
    const resist = tgt.boss ? 0.6 : 1;
    if (real && crit && (ab.heavy || !ab.basic) && gore() && tgt.vis && !tgt.vis.c.beast) chunks(tgt, 3 + Math.floor(Math.random() * 3));
    if (o.brk) { tgt.st.stun = { t: 1.0 * resist }; interrupt(tgt); text(tgt, 'GUARD BREAK', '#ffd23c', true); G.sfx('break'); if (att.isPlayer) addHype(12); }
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
    const finHit = !!(att.act && att.act.fin), kn = ab.knock || o.knock || (real && dmg > 0 ? Math.min(finHit ? 175 : 95, 45 + dmg * 2.2 + (finHit ? 70 : 0)) : 0);
    if (kn) {
      const a = o.from != null ? o.from : Math.atan2(tgt.y - att.y, tgt.x - att.x);
      tgt.kx = Math.cos(a) * kn * resist; tgt.ky = Math.sin(a) * kn * resist; tgt.kBy = att;
    }
    if (tgt.hp <= 0) ko(tgt);
    return true;
  }
  function interrupt(e) { if (e.state === 'wind' || e.state === 'recover') { e.state = 'idle'; e.act = null; e.z = 0; } e.chain = null; }
  function ko(e) {
    if (e.isPlayer && e.borrow && phase === 'fight' && !opp.spar && !F.ex) {       // Borrowed Time: the Oracle's clock skips back, on account
      e.borrow = 0; e.hp = Math.round(e.maxHp * 0.33); e.st = {}; e.iframe = 1.1; e.poise = e.maxPoise; text(e, 'TIME TURNS BACK', '#c8a0ff', true);
      fx.push({ k: 'ring', x: e.x, y: e.y, r: 260, col: '#c8a0ff', t: 0, life: 0.7 }); fx.push({ k: 'ring', x: e.x, y: e.y, r: 140, col: '#ffffff', t: -0.1, life: 0.5 }); flashLight(e.x, e.y, '#c8a0ff', 120); slowT = 0.6; hitstop = Math.max(hitstop, 0.2); G.sfx('holy'); G.sfx('bell');
      const f = e.foe, a = Math.atan2(f.y - e.y, f.x - e.x); f.kx = Math.cos(a) * 300; f.ky = Math.sin(a) * 300; f.st.stun = { t: 0.8 }; interrupt(f);
      G.state.soulDebt = (G.state.soulDebt || 0) + 1; G.save(); return;
    }
    e.hp = 0; if (!e.isPlayer && !F.ex && !opp.spar && phase === 'fight') return startMortal(e);
    e.state = 'ko'; e.koT = 0; e.st = {}; e.buffs = {}; e.act = null; e.z = 0;
    phase = 'ko'; phaseT = 2.4; shake = 16; hitstop = 0.18;
    result = { win: !e.isPlayer };
    G.ui.banner(opp.spar ? (result.win ? opp.name + ' Yields' : 'You Yield') : result.win ? 'KNOCKOUT' : 'DEFEATED', opp.spar ? 'A friendly. Nobody dies today.' : '', result.win ? 'win' : 'loss');
    G.sfx(result.win ? 'win' : 'lose'); G.sfx('crowd');
    spark(e.x, e.y, 30, '#ffd36b', 30, 300); flashLight(e.x, e.y, '#ffd36b', 60);
  }

  // ------------------------------------------------------------------ abilities
  function canUse(e, id) { const ab = A[id]; return ab && !(e.cds[id] > 0) && e.res >= (ab.cost || 0); }
  function tryAbility(e, id) {
    const ab = A[id];
    if (e.state !== 'idle' || !ab) return false;
    if (!canUse(e, id)) { if (e.isPlayer && !ab.basic) G.sfx('deny'); if (e.isPlayer && ab.basic && e.res < (ab.cost || 0) && time - (e.windedT || -9) > 1.2) { e.windedT = time; text(e, 'WINDED', '#9aa3ad'); G.sfx('deny'); } return false; }
    const I = e.intent;
    e.res -= (ab.cost || 0);
    if (e.res < 5 && !e.st.winded) { e.st.winded = { t: 1.8 }; if (time - (e.windedT || -9) > 1.2) { e.windedT = time; text(e, 'WINDED', '#9aa3ad'); } }
    if (ab.cd) e.cds[id] = ab.cd;
    e.aim = I.aim;
    const act = e.act = { ab, id, aim: I.aim, total: ab.wind, pt: null, sx: e.x, sy: e.y, step: 0 };
    if (ab.basic) {
      e.mash = Math.min(6, (e.mash || 0) + 1);
      if (ab.type === 'melee') { act.step = (e.cStep != null && time - (e.cEnd || -9) < 0.42) ? (e.cStep + 1) % 3 : 0; if (act.step === 2) { act.fin = 1; act.total = ab.wind * 1.75; } }
    } else e.mash = 0;
    if (ab.heavy && ab.type === 'melee') act.step = 2;
    if ((ab.type === 'proj' || ab.type === 'line') && Math.hypot(e.foe.x - e.x, e.foe.y - e.y) < (e.isPlayer ? 82 : 104)) { act.dis = 1; act.total *= 1.45; if (time - (e.disT || -9) > 1.6) { e.disT = time; text(e, 'DISADVANTAGE', '#c0a0ff'); } }
    if (ab.type === 'aoe' && ab.at === 'point') {
      let dx = I.pt.x - e.x, dy = I.pt.y - e.y; const d = Math.hypot(dx, dy) || 1;
      if (d > ab.castRange) { dx *= ab.castRange / d; dy *= ab.castRange / d; }
      act.pt = { x: e.x + dx, y: e.y + dy }; clampArena(act.pt);
    }
    e.state = 'wind'; e.t = act.total;
    if (!ab.basic) {
      if (e.isPlayer) { if (lastAb !== id) addHype(6); lastAb = id; e.recent = (e.recent || []).filter(q => time - q[1] < 8 && q[0] !== id); e.recent.push([id, time]); if (e.recent.length >= 4 && time - (e.showT || -99) > 8) { e.showT = time; e.recent = []; addHype(14); text(e, 'SHOWMAN', '#ffe9a0', true); G.sfx('cheer'); } }
      if (e.d.wild && Math.random() < 0.25) wildSurge(e);
    }
    if (e.buffs.stealth && ab.type !== 'buff' && ab.type !== 'dash') delete e.buffs.stealth;
    G.sfx(ab.type === 'melee' && !ab.spell ? 'swing' : ab.type === 'dash' ? 'dash' : 'cast');
    if (ab.heavy) { fx.push({ k: 'ring', x: e.x, y: e.y, r: 70, col: e.isPlayer ? '#ffe9a0' : '#ff5030', t: 0, life: 0.3 }); if (!e.isPlayer && !F.ex) { text(e, '!', '#ff5030', true); flashLight(e.x, e.y, '#ff5030', 30); } }       // a heavy blow is coming: read it
    if (!ab.basic && !ab.heavy && ab.name) { gfx.floatText(e.x / S, 2.9, e.y / S, ab.name, ab.color || '#fff'); if (ab.ult) { fx.push({ k: 'ring', x: e.x, y: e.y, r: 150, col: ab.color, t: 0, life: 0.5 }); hitstop = Math.max(hitstop, 0.1); flashLight(e.x, e.y, ab.color, 60); camVh += 1.5; } }
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
    for (let gi = 0; gi < 4; gi++) fx.push({ k: 'ghost', x: G.lerp(ox, dst.x, gi / 4), y: G.lerp(oy, dst.y, gi / 4), col: ab.color, t: -gi * 0.03, life: 0.34 });
    spark(ox, oy, 30, ab.color, 10, 120); spark(dst.x, dst.y, 30, ab.color, 10, 120);
    e.x = dst.x; e.y = dst.y; e.iframe = Math.max(e.iframe, 0.28); e.dodgeCredit = 0;
    e.aim = Math.atan2(foe.y - e.y, foe.x - e.x);
    if (!first) G.sfx('dash');
  }
  function fire(e) {
    const act = e.act, ab = act.ab, foe = e.foe, a = act.aim;
    if (ab.type === 'melee') {
      const fin = act.fin, rng = ab.range * (fin ? 1.2 : 1), d = Math.hypot(foe.x - e.x, foe.y - e.y), ta = Math.atan2(foe.y - e.y, foe.x - e.x), arc = ab.arc * Math.PI / 180 * (fin ? 1.5 : 1);
      if (ab.cone) {
        fx.push({ k: 'cone', x: e.x, y: e.y, a, r: ab.range, arc, col: ab.cone, t: 0, life: 0.38 }); G.sfx(ab.fire ? 'fire' : 'dodge');
        for (let i = 0; i < 26; i++) { const aa = a + rand(-arc / 2, arc / 2), v = rand(0.4, 1) * ab.range / S / 0.35; gfx.emit(e.x / S, 1, e.y / S, Math.cos(aa) * v, rand(-0.5, 1.5), Math.sin(aa) * v, rand(0.25, 0.45), ab.cone, 1); }
        flashLight(e.x + Math.cos(a) * 60, e.y + Math.sin(a) * 60, ab.cone, 35);
      } else { fx.push({ k: 'slash', x: e.x, y: e.y, a, r: rng, arc, col: fin ? '#ffe9a0' : ab.color, t: 0, life: fin ? 0.26 : 0.18 }); fx.push({ k: 'slash', x: e.x, y: e.y, a, r: rng * 0.72, arc: arc * 0.8, col: '#ffffff', t: -0.02, life: 0.14 });
        for (let si = 0; si < (fin ? 9 : 4); si++) { const sa = a + rand(-arc / 2, arc / 2); gfx.emit(e.x / S + Math.cos(sa) * rng / S, 1.0, e.y / S + Math.sin(sa) * rng / S, Math.cos(sa) * 3, rand(0, 2), Math.sin(sa) * 3, 0.22, fin ? '#ffe9a0' : '#ffffff', 4); }
        if (fin) fx.push({ k: 'dust', x: e.x + Math.cos(a) * rng * 0.7, y: e.y + Math.sin(a) * rng * 0.7, r: 60, t: 0, life: 0.45 }); }
      let landed = false;
      if (d < rng + ER && (angDiff(ta, a) < arc / 2 || d < ER * 1.6)) landed = hit(e, foe, ab, fin ? { power: 1.7, knock: 240 } : null);
      if (!landed && !ab.cone && !e.clashed) act.missed = 1; e.clashed = 0;
      if (fin) { shake = Math.max(shake, 5); if (landed && e.isPlayer) { text(foe, 'FINISHER', '#ffe9a0', true); addHype(8); } }
    } else if (ab.type === 'proj') {
      const n = ab.count || 1;
      for (let i = 0; i < n; i++) {
        const aa = a + (n > 1 ? (i / (n - 1) - 0.5) * ab.spread : 0);
        projs.push({ x: e.x + Math.cos(aa) * 20, y: e.y + Math.sin(aa) * 20, vx: Math.cos(aa) * ab.speed, vy: Math.sin(aa) * ab.speed, a: aa, r: ab.pr, owner: e, ab, t: 0, dis: act.dis });
      }
      if (!ab.basic) G.sfx(ab.fire ? 'fire' : ab.slow ? 'ice' : ab.radiant ? 'holy' : 'swing');
    } else if (ab.type === 'line') {
      const x2 = e.x + Math.cos(a) * ab.range, y2 = e.y + Math.sin(a) * ab.range;
      fx.push({ k: 'bolt', x1: e.x, y1: e.y, x2, y2, col: ab.color, t: 0, life: 0.3 });
      for (let bi = 1; bi <= 4; bi++) { const u = bi / 5, bx = G.lerp(e.x, x2, u), by = G.lerp(e.y, y2, u); if (inArena(bx, by, -10)) mark(bx + rand(-12, 12), by + rand(-12, 12), rand(0.5, 0.9), 'scorch'); const ba = a + rand(-1.2, 1.2); fx.push({ k: 'bolt', x1: bx, y1: by, x2: bx + Math.cos(ba) * 60, y2: by + Math.sin(ba) * 60, col: ab.color, t: -0.03 * bi, life: 0.2 }); }
      G.sfx('zap'); shake = Math.max(shake, 6); flashLight(e.x + Math.cos(a) * 120, e.y + Math.sin(a) * 120, ab.color, 60);
      if (segDist(foe.x, foe.y, e.x, e.y, x2, y2) < ab.width + ER) hit(e, foe, ab, { from: a, power: act.dis ? 0.75 : 1 });
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
      if (ab.form && G.forms) G.forms.start(e, ab.form, ab);
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
    e.potions--; heal(e, e.maxHp * 0.3 * (e.d.potionMul || 1) / e.d.healMul);
  }

  // ------------------------------------------------------------------ entity update
  function updateEntity(e, dt) {
    e.iframe = Math.max(0, e.iframe - dt); e.flash = Math.max(0, e.flash - dt); e.dodgeT = Math.max(0, e.dodgeT - dt);
    e.parryCd = Math.max(0, (e.parryCd || 0) - dt);
    e.mash = Math.max(0, (e.mash || 0) - dt * 0.9); if (e.guard > 0) e.guard -= dt; e.hurt = Math.max(0, (e.hurt || 0) - dt); if (e.down > 0) e.down -= dt;
    if (e.crawl && e.state !== 'ko' && e.moving && Math.random() < dt * 5) gfx.splat(e.x / S + rand(-0.2, 0.2), e.y / S + rand(-0.2, 0.2), rand(0.25, 0.5));
    if (e.lost && e.state !== 'ko' && gore()) { if (Math.random() < dt * 6) gfx.emit(e.x / S + rand(-0.2, 0.2), rand(0.6, 1.3), e.y / S + rand(-0.2, 0.2), rand(-0.6, 0.6), rand(-0.5, 1), rand(-0.6, 0.6), 0.5, 0xb01010, 9); if (Math.random() < dt * 2.2) gfx.splat(e.x / S + rand(-0.3, 0.3), e.y / S + rand(-0.3, 0.3), rand(0.2, 0.5)); }
    for (const k in e.cds) if (e.cds[k] > 0) e.cds[k] -= dt * (1 + e.d.cdr);
    if (e.state === 'ko') { e.koT += dt; return; }
    e.res = Math.min(100, e.res + e.d.regen * dt * (e.buffs.frenzy ? 1.6 : 1) * (e.guard > 0 || e.charging > 0 ? 0.25 : e.st.winded ? 0.6 : 1));
    if ((e.poiseT = (e.poiseT || 0) - dt) <= 0 && e.poise < e.maxPoise) e.poise = Math.min(e.maxPoise, e.poise + 24 * dt);
    for (const k in e.st) {
      const s = e.st[k]; s.t -= dt;
      if (s.dice) { s.tick -= dt; if (s.tick <= 0) { s.tick += 0.5; const v = Math.max(1, Math.round(G.roll(s.dice) * (s.by ? s.by.d.dmgMul : 1))); e.hp -= v; if (s.by) s.by.dmgDealt += v; text(e, '' + v, k === 'poison' ? '#9be35a' : '#ff9a3c'); if (e.hp <= 0) { ko(e); return; } } }
      if (s.t <= 0) delete e.st[k];
    }
    for (const k in e.buffs) { e.buffs[k].t -= dt; if (e.buffs[k].t <= 0) { delete e.buffs[k]; if (k === 'shield') e.shield = 0; if (k === 'frenzy') hype = Math.min(hype, 62); if (k === 'form' && G.forms) G.forms.end(e); } }
    if (e.buffs.aura) {
      e.auraT -= dt;
      if (e.auraT <= 0) {
        e.auraT = 0.5; const au = A.spirit_guardians.aura;
        if (Math.hypot(e.foe.x - e.x, e.foe.y - e.y) < au.radius + ER) hit(e, e.foe, { type: 'aura', dmg: au.dmg, stat: au.stat, radiant: 1, color: '#c8f0ff', slow: [au.slow, 0.7] });
      }
    }
    if (e.kx || e.ky) { e.x += e.kx * dt; e.y += e.ky * dt; const f = Math.pow(0.002, dt); e.kx *= f; e.ky *= f; if (Math.abs(e.kx) + Math.abs(e.ky) < 8) e.kx = e.ky = 0;
      const bx = e.x, by = e.y; clampArena(e);
      if (Math.hypot(e.x - bx, e.y - by) > 0.5 && Math.hypot(e.kx, e.ky) > 110 && phase === 'fight') {       // slammed into the pit wall
        const wd = 5 + (e.kBy ? e.kBy.level * 2 : 4); e.hp -= wd; e.kx = e.ky = 0; e.st.stun = { t: 0.4 }; interrupt(e); e.flash = 0.12; e.hurt = 0.3;
        text(e, 'WALL ' + wd, '#ffb070', true); spark(e.x, e.y, 30, '#c8b8a0', 14, 220); shake = Math.max(shake, 9); G.sfx('wall'); if (e.kBy && e.kBy.isPlayer) addHype(10);
        if (e.hp <= 0) { ko(e); return; }
      }
    }
    if (e.chain) { e.chain.t -= dt; if (e.chain.t <= 0) { doDash(e, e.chain.ab); if (!e.chain || --e.chain.n <= 0) e.chain = null; else e.chain.t = 0.17; } }

    const I = e.intent, spd = 1 + (e.buffs.haste ? e.buffs.haste.amt : 0);
    let mv = 0;
    e.moving = false;
    if (e.st.stun) { e.vx = e.vy = 0; if (e.state !== 'idle') interrupt(e); e.state = 'idle'; I.queue.length = 0; clampArena(e); return; }
    if (I.queue.length) { e.buf = { id: I.queue.shift(), t: 0.3 }; I.queue.length = 0; }
    if (e.buf) { e.buf.t -= dt; if (e.buf.t <= 0) e.buf = null; }

    if (e.state === 'parry') { e.t -= dt; e.parryT -= dt; if (e.t <= 0) e.state = 'idle'; }
    else if (e.state === 'dodge') {
      e.t -= dt; e.x += Math.cos(e.da) * (e.dSpd || 560) * dt; e.y += Math.sin(e.da) * (e.dSpd || 560) * dt;
      if (Math.random() < 0.5) gfx.emit(e.x / S, 0.1, e.y / S, 0, 0.5, 0, 0.3, 0x4a4038, 0);
      if (e.t <= 0) { e.state = 'idle'; e.vx = Math.cos(e.da) * 110; e.vy = Math.sin(e.da) * 110; G.sfx('step'); fx.push({ k: 'dust', x: e.x, y: e.y, r: 46, t: 0, life: 0.35 }); }       // land, and carry some of it
    } else if (e.state === 'wind') {
      const ab = e.act.ab; e.t -= dt * spd;
      const pr = 1 - Math.max(0, e.t) / (ab.wind || 0.01);
      if (ab.lunge) {
        const d = Math.hypot(e.foe.x - e.x, e.foe.y - e.y);
        if (d > 38) { const v = ab.lunge / ab.wind * spd; e.x += Math.cos(e.act.aim) * v * dt; e.y += Math.sin(e.act.aim) * v * dt; }
      } else if (ab.leap) {
        e.x = G.lerp(e.act.sx, e.act.pt.x, pr); e.y = G.lerp(e.act.sy, e.act.pt.y, pr); e.z = Math.sin(pr * Math.PI) * 70; e.iframe = Math.max(e.iframe, 0.05);
      } else mv = e.C.ranged ? 0.45 : 0.25;
      if (e.t <= 0) { e.z = 0; const a0 = e.act; fire(e); if (e.state === 'wind') { e.state = 'recover'; e.t = ab.rec * (a0.fin ? 1.5 : 1) * (a0.missed ? 1.8 : 1); } }
    } else if (e.state === 'recover') {
      e.t -= dt * spd; mv = 0.5;
      if (e.t <= 0) { if (e.act && e.act.ab.basic) { e.cStep = e.act.missed ? null : e.act.step; e.cEnd = time; } if (e.act && e.act.taunt && e.isPlayer && !e.act.spoiled) { addHype(e.act.pay || 8); text(e, 'THEY LOVE IT', '#ffe9a0'); } e.state = 'idle'; e.act = null; }
    }
    // a light blow can be abandoned for a dodge in the first half of its wind-up: a feint, paid for in stamina
    if (e.state === 'idle' || (e.state === 'recover' && e.buf && (e.buf.id === 'dodge' || e.buf.id === 'parry')) || (e.state === 'wind' && e.isPlayer && e.buf && e.buf.id === 'dodge' && e.act && e.act.ab.basic && e.t > (e.act.total || e.act.ab.wind) * 0.5)) {
      if (e.state === 'idle') mv = 1;
      const b = e.buf;
      if (b && b.id === 'parry') {
        if ((e.parryCd || 0) <= 0 && e.res >= 8) { e.res -= 8; e.parryT = parryWindow(e); e.parryCd = 0.85; e.state = 'parry'; e.t = e.parryT + 0.34; e.act = null; e.buf = null; mv = 0; G.sfx('swing'); }
        else e.buf = null;
      } else if (b && b.id === 'dodge') {
        if (e.dodgeT <= 0 && e.res < 12 && e.isPlayer && time - (e.windedT || -9) > 1.2) { e.windedT = time; text(e, 'WINDED', '#9aa3ad'); G.sfx('deny'); e.buf = null; }
        else if (e.dodgeT <= 0 && e.res >= 12) {
          const a = (I.mx || I.my) ? Math.atan2(I.my, I.mx) : I.aim + Math.PI;
          e.res -= 12; e.dodgeStart = time; e.perfect = 0;
          e.dSpd = 430 * (!e.C.ranged && Math.cos(a - Math.atan2(e.foe.y - e.y, e.foe.x - e.x)) > 0.5 ? 1.25 : 1);       // a sidestep, not a tumble       // melee close the gap faster
          e.state = 'dodge'; e.t = 0.22; e.da = a; e.iframe = 0.17; e.dodgeT = e.d.dodgeCd; e.dodgeCredit = 0; e.act = null; e.buf = null; G.sfx('dodge'); mv = 0;
        }
      } else if (e.state === 'idle') {
        if (b && b.id === 'potion') { usePotion(e); e.buf = null; }
        else if (b && tryAbility(e, b.id)) e.buf = null;
        else if (I.attack) tryAbility(e, e.basic);
      }
    }
    let tvx = 0, tvy = 0;
    if (mv > 0 && (I.mx || I.my) && Math.abs(e.kx) + Math.abs(e.ky) < 60) {       // no walking while being thrown
      const l = Math.hypot(I.mx, I.my) || 1, m = Math.min(1, l);
      let v = e.d.speed * mv * m * (e.st.slow ? 1 - e.st.slow.amt : 1) * (1 + (e.buffs.speed ? e.buffs.speed.amt : 0));
      { const fd = Math.hypot(e.foe.x - e.x, e.foe.y - e.y) || 1; if (fd < 430 && (I.mx * (e.foe.x - e.x) + I.my * (e.foe.y - e.y)) / (l * fd) < -0.5) v *= 0.8; }       // backpedalling is slow
      if (e.crawl) v *= 0.3; else if (e.lost && e.lost.legL) v *= 0.72;
      if (e.hurt > 0) v *= 0.55; if (e.st.winded) v *= 0.7; if (e.charging > 0) v *= 0.5; else if (e.guard > 0) v *= e.cls === 'fighter' ? 0.88 : 0.55;       // a fighter can walk a caster down behind the shield                                           // a hit takes the legs out of you for a moment
      tvx = I.mx / l * v; tvy = I.my / l * v;
    }
    { const kk = Math.min(1, dt * (tvx || tvy ? (e.isPlayer ? 12 : 9) : 13)); e.vx = (e.vx || 0) + (tvx - (e.vx || 0)) * kk; e.vy = (e.vy || 0) + (tvy - (e.vy || 0)) * kk;
      const spd = Math.hypot(e.vx, e.vy);
      if (spd > 6) { e.x += e.vx * dt; e.y += e.vy * dt; } else e.vx = e.vy = 0;
      if (spd > 45) { const w0 = e.walk; e.walk += dt * (4.5 + spd / Math.max(1, e.d.speed) * 6.5); e.moving = true; if (Math.floor(e.walk / Math.PI) !== Math.floor(w0 / Math.PI)) { G.sfx('step'); gfx.emit(e.x / S, 0.08, e.y / S, -e.vx / S * 0.15, 0.5, -e.vy / S * 0.15, 0.35, 0x5a5048, 0); } } }
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
    if (e.guard > 0) { I.mx = I.my = 0; I.attack = false; I.aim = Math.atan2(foe.y - e.y, foe.x - e.x); return; }
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
    else if (e.C.ranged && d < pref - 110 && e.res > 30) { mx -= ux * 0.7; my -= uy * 0.7; }       // casters give ground, but not forever and not when they are spent
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
    // a fighter does not stand and be shot at: close the distance in a rush
    if (!e.C.ranged && foe.C && foe.C.ranged && !e.crawl && seen && d > 240 && e.state === 'idle' && !e.rest && e.res > 30 && time - (e.rushT || -9) > 4.5 && ai.aggro > 0.6 && Math.random() < dt * (0.3 + ai.aggro * 0.6)) { e.rushT = time; I.mx = ux; I.my = uy; I.queue.push('dodge'); }
    if (seen && foe.state === 'wind' && foe.act && !foe.act.seen) {
      foe.act.seen = 1; const ab = foe.act.ab;
      const threat = ab.type === 'melee' ? d < ab.range + (ab.lunge || 0) + 30 : ab.type === 'line';
      if (threat && e.res >= 8 && Math.random() < ai.parry) e.react = { t: Math.max(0, foe.t - parryWindow(e) * 0.55), parry: 1 };
      else if (threat && Math.random() < ai.dodge * (foe.act.fin ? 2 : 1)) e.react = { t: Math.min(ab.wind * 0.6, ai.react * 0.4) };
    }
    for (const p of projs) if (p.owner !== e && !p.seen && Math.hypot(p.x - e.x, p.y - e.y) < 170) { p.seen = 1; if (e.res >= 8 && Math.random() < ai.parry) e.react = { t: 0.1, parry: 1 }; else if (Math.random() < ai.dodge) e.react = { t: 0.03, side: 1 }; }
    if (e.react) { e.react.t -= dt; if (e.react.t <= 0) { if (e.react.side) { I.mx = -uy * e.strafe; I.my = ux * e.strafe; } if (!e.crawl) I.queue.push(e.react.parry ? 'parry' : 'dodge'); e.react = null; } }
    // rules the AI plays by: rest when winded, never swing into a raised parry, punish whatever leaves the foe open
    if (e.res < 22) e.rest = 1; else if (e.res > 55) e.rest = 0;
    if (foe.guard > 0 && d < 140) e.combo = 0;                                            // do not chip at a raised guard: go through it
    if (!e.C.ranged && e.poise < e.maxPoise * 0.3 && d < 150 && foe.state !== 'recover' && !foe.st.stun) { I.mx = -ux; I.my = -uy; }
    const open = seen && (foe.state === 'recover' || (foe.state === 'parry' && foe.parryT <= 0) || !!foe.st.stun || !!foe.st.winded), turtled = foe.state === 'parry' && foe.parryT > 0;
    if (e.rest && !e.C.ranged && d < 150) { I.mx = -ux; I.my = -uy; e.combo = 0; }
    if (turtled) e.combo = 0;
    if (open && !e.rest && e.state === 'idle' && d < A[e.basic].range + 30 && e.punT !== foe.act) { e.punT = foe.act || time; if (Math.random() < ai.aggro * 0.4 + 0.1) { e.combo = Math.max(e.combo, 2); const big = e.kit.find(id => A[id].type === 'melee' && !A[id].heal && canUse(e, id)); if (big && Math.random() < ai.aggro * 0.7) I.queue.push(big); } }
    if (e.hurt > 0.2 && !e.rest && !turtled && e.state === 'idle' && d < A[e.basic].range + 14 && foe.guard <= 0) e.combo = Math.max(e.combo, 2);      // struck: strike back, do not stand and take it
    e.think -= dt;
    if (e.combo > 0 && !turtled && !e.rest && e.state === 'idle' && d < A[e.basic].range + 14) I.attack = true;
    if (e.think <= 0 && e.state === 'idle') {
      e.think = ai.react * rand(0.6, 1.4) * (d < 130 && !foe.C.ranged ? 0.72 : 1);      // toe to toe with another brawler, they do not wait their turn
      if (!seen || e.rest || turtled) return;
      if (ai.guard && (foe.mash || 0) >= 3 && d < 115 && Math.random() < Math.min(0.92, ai.guard + 0.35)) { e.guard = 1.3; e.guardHits = 0; e.combo = 0; return; }
      const healId = e.kit.find(id => A[id].heal && canUse(e, id) && inRange(e, A[id], d));
      if (healId) { I.queue.push(healId); return; }
      if (e.ult && canUse(e, e.ult) && (e.hp < e.maxHp * 0.75 || foe.hp < foe.maxHp * 0.6) && inRange(e, A[e.ult], d)) { I.queue.push(e.ult); return; }
      const c = e.kit.filter(id => !A[id].heal && canUse(e, id) && inRange(e, A[id], d));
      if (c.length && Math.random() < ai.aggro) { I.queue.push(G.pick(c)); return; }
      { const hv = e.basic + '_h', hb = A[hv]; if (hb && canUse(e, hv) && (hb.type === 'melee' ? d < hb.range + 46 : d < 420) && (foe.guard > 0 || foe.st.stun || foe.st.broken || foe.st.winded || Math.random() < ai.aggro * 0.32)) { I.queue.push(hv); return; } }
      const b = A[e.basic];
      if (b.type === 'melee') { if (d < b.range + 14) e.combo = 1 + Math.floor(Math.random() * 3) + (ai.aggro > 0.6 ? 1 : 0); }
      else if (d < 480 && Math.random() < 0.5 + ai.aggro * 0.5) I.attack = true;
    }
    if (e.state === 'wind' && e.act && e.act.ab.basic && e.combo > 0 && !e.act.counted) { e.act.counted = 1; e.combo--; }
  }

  function playerIntent(rdt) {
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
      if (!P.C.ranged && !E.buffs.stealth) { const fa = Math.atan2(E.y - P.y, E.x - P.x); if (Math.hypot(E.x - P.x, E.y - P.y) < 190 && angDiff(I.aim, fa) < 0.5) I.aim = fa; }       // close in, a near miss with the mouse still faces them
    }
    // tap to strike, hold and release for the heavy blow; holding parry past its window is a block
    const held = In.mouse.down || In.touchAtk || k.KeyJ || !!(pad && pad.atk); I.attack = false;
    if (held && !P.chgUsed) {
      P.chg = (P.chg || 0) + (rdt || 0.016);
      if (P.state === 'idle' && !P.st.stun) { const was = P.charging || 0; P.charging = P.chg; if (was < 0.28 && P.chg >= 0.28) { G.sfx('ui'); spark(P.x, P.y, 40, '#ffe9a0', 10, 160); } } else P.charging = 0;
      if (P.chg > 1.3) { I.queue.push(heavyId(P)); P.chgUsed = 1; P.charging = 0; }
    } else if (!held) { if (P.chg > 0 && !P.chgUsed) I.queue.push(P.chg >= 0.28 && P.charging > 0 ? heavyId(P) : P.basic); P.chg = 0; P.charging = 0; P.chgUsed = 0; }
    const blk = k.ShiftLeft || k.ShiftRight || k.KeyX || In.mouse.rdown || In.touchBlk || !!(pad && pad.blk);
    if (blk && P.state === 'idle' && !P.st.stun && P.res > 0 && !P.charging) { if (!(P.guard > 0)) P.guardHits = 0; P.guard = 0.12; }
    while (In.pressed.length) {
      const a = In.pressed.shift();
      if (a === 'dodge' || a === 'potion' || a === 'parry') I.queue.push(a);
      else if (a === 'assist') callSecond();
      else if (a === 'taunt') taunt(P);
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
    else if (slowT > 0) { slowT -= rdt; dt *= 0.3; }                       // the half-second after something terrible
    if (phase === 'ko') dt *= 0.45;
    if (phase === 'mortal') dt *= 0.8;
    time += dt; shake = Math.max(0, shake - dt * 40);
    if (phase === 'intro') { phaseT -= dt; G.input.pressed.length = 0; if (phaseT <= 0.6 && !F.said) { F.said = 1; G.ui.banner('FIGHT!', '', 'win'); } if (phaseT <= 0) { phase = 'fight'; G.ui.banner(null); } }
    if (phase === 'fight' && F.ex) { exThink(P); exThink(E); }
    else if (phase === 'fight') {
      if (G.debugAuto) { if (!P.ai) P.ai = { react: 0.3, aggro: 0.7, dodge: 0.3, parry: 0.15 }; think(P, dt); } else playerIntent(rdt);
      think(E, dt);
      hype = Math.max(0, hype - dt * (P.buffs.frenzy ? 0 : 1.2));
      // a roaring crowd throws coin, and the stands show it
      if (hype >= 80 && Math.random() < dt * (P.buffs.frenzy ? 2.4 : 0.9)) { const a = rand(0, 6.28), R0 = 9.5, x = Math.cos(a) * R0, z = Math.sin(a) * R0; for (let i = 0; i < 3; i++) gfx.emit(x, 2.6 + rand(0, 0.6), z, -Math.cos(a) * rand(4, 6), rand(2, 4), -Math.sin(a) * rand(4, 6), 1.1, i ? '#ffd36b' : '#fff0c0', 1); tossed += P.buffs.frenzy ? 2 : 1; if (Math.random() < 0.35) G.sfx('coin'); }
      if (P.buffs.frenzy && Math.random() < 0.6) gfx.emit(P.x / S + rand(-0.5, 0.5), rand(0.2, 2), P.y / S + rand(-0.5, 0.5), 0, rand(1.5, 3), 0, 0.5, '#ffd36b', 0);
      if (!G.debugAuto && E.state === 'idle' && !E.st.stun && E.hp > E.maxHp * 0.5 && (P.st.broken || (Math.hypot(P.x - E.x, P.y - E.y) > 300 && Math.random() < dt * 0.04))) taunt(E);
    } else { P.intent.mx = P.intent.my = E.intent.mx = E.intent.my = 0; P.intent.attack = E.intent.attack = false; P.intent.queue.length = E.intent.queue.length = 0; }
    updateEntity(P, dt); updateEntity(E, dt);
    if (phase === 'mortal') mortalStep(dt);

    for (let i = projs.length - 1; i >= 0; i--) {
      const p = projs[i]; if (!p) break; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      const f = p.owner.foe; let dead = false;
      if (Math.random() < 0.7) gfx.emit(p.x / S, 1.05, p.y / S, rand(-0.6, 0.6), rand(-0.3, 0.6), rand(-0.6, 0.6), 0.25, p.ab.color, 0);
      if (!p.passed && f.state !== 'ko' && f.z < 30 && Math.hypot(p.x - f.x, p.y - f.y) < p.r + ER) {
        const dodged = f.iframe > 0;
        hit(p.owner, f, p.ab, { from: p.a, proj: p });
        if (p.reflect) { p.reflect = 0; p.owner = f; p.vx *= -1.2; p.vy *= -1.2; p.a += Math.PI; p.t = 0; p.dis = 0; if (p.m) p.m.rotation.y = -p.a; }
        else if (dodged) p.passed = 1; else dead = true;
      }
      if (!dead && (!inArena(p.x, p.y, 30) || p.t > 2)) { spark(p.x, p.y, 30, p.ab.color, 6, 80); dead = true; }
      if (projs[i] !== p) break;                 // the list was cleared mid-loop (a killing blow)
      if (dead) { if (p.m) sc.remove(p.m); projs.splice(i, 1); }
    }
    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i]; if (!z) break;
      if (z.ab.trap && !z.sprung) {                          // a trap waits for a foot
        z.life = (z.life || 0) + dt; const tf = z.owner.foe, inside = z.life > 0.7 && tf.state !== 'ko' && !(tf.iframe > 0) && Math.hypot(tf.x - z.x, tf.y - z.y) < z.r * 0.85;
        if (!inside) { if (z.life > 18) { if (z.m) sc.remove(z.m); zones.splice(i, 1); } continue; }
        z.sprung = 1; z.t = z.delay; G.sfx('clang'); text(tf, 'TRAPPED', '#ffb070', true); if (z.owner.isPlayer) addHype(8);
      }
      z.t += dt;
      if (z.t >= z.delay) {
        const f = z.owner.foe, ab = z.ab;
        fx.push({ k: 'blast', x: z.x, y: z.y, r: z.r, col: ab.color, t: 0, life: 0.5, pillar: ab.radiant });
        fx.push({ k: 'dust', x: z.x, y: z.y, r: z.r * 1.5, t: 0, life: 0.7 }); fx.push({ k: 'ring', x: z.x, y: z.y, r: z.r * 1.9, col: ab.color, t: -0.08, life: 0.55 });
        mark(z.x, z.y, z.r / S * (ab.leap ? 2.0 : 1.7), ab.leap ? 'crack' : ab.radiant ? 'glowmark' : 'scorch'); camVh += z.r > 80 ? 1.6 : 0.7;
        if (ab.fire) for (let fi = 0; fi < 14; fi++) { const fa = rand(0, 6.28), fr = rand(0, z.r / S); gfx.emit(z.x / S + Math.cos(fa) * fr, 0.2, z.y / S + Math.sin(fa) * fr, 0, rand(2, 6), 0, rand(0.5, 1.1), fi % 2 ? '#ff8a2a' : '#ffd060', -1); }
        spark(z.x, z.y, 20, ab.color, 26, z.r * 2.6); flashLight(z.x, z.y, ab.color, z.r > 80 ? 120 : 50);
        shake = Math.max(shake, z.r > 80 ? 12 : 5); G.sfx(ab.radiant ? 'holy' : 'boom');
        if (f.z < 30 && Math.hypot(f.x - z.x, f.y - z.y) < z.r + ER * 0.6) hit(z.owner, f, ab, { from: Math.atan2(f.y - z.y, f.x - z.x) });
        if (zones[i] !== z) break;
        if (z.m) sc.remove(z.m); zones.splice(i, 1);
      }
    }
    if (phase === 'ko') { phaseT -= dt / 0.45; if (phaseT <= 0) { F.active = false; G.ui.banner(null); finish(); return; } }
    sync(dt);
    if (!F.ex) G.ui.updateHud(P, E, hype);
  };

  function sync(dt) {
    syncEntity(P); syncEntity(E);
    projs.forEach(syncProj); zones.forEach(syncZone);
    for (let i = fx.length - 1; i >= 0; i--) { const f = fx[i]; f.t += dt; if (f.t < 0) continue; if (!f.obj) buildFx(f); if (f.t >= f.life) { killFx(f); fx.splice(i, 1); } else f.upd(f.t / f.life); }
    arena.flash.intensity *= Math.pow(0.0005, dt); if (arena.flash.intensity < 0.3) arena.flash.intensity = 0;
    if (F.ex) { gfx.cam.shake = shake / 45; return; }
    arena.setHype(hype / 100);
    for (const g of gibs) { if (g.rest) continue; g.vy -= 20 * dt; g.m.position.x += g.vx * dt; g.m.position.y += g.vy * dt; g.m.position.z += g.vz * dt; g.m.rotation.x += g.rx * dt; g.m.rotation.z += g.rz * dt;
      if (g.m.position.y < 0.08) { g.m.position.y = 0.08; if (Math.abs(g.vy) < 2) { g.rest = 1; if (!g.ash && gore()) gfx.splat(g.m.position.x, g.m.position.z, rand(0.5, 1.1)); } else { g.vy *= -0.35; g.vx *= 0.6; g.vz *= 0.6; if (!g.ash && gore() && Math.random() < 0.5) gfx.splat(g.m.position.x, g.m.position.z, rand(0.3, 0.7)); } } }
    if (phase === 'mortal' && M) {                         // close orbiting camera for the kill
      // camera stands toward the middle of the pit and looks outward, so the wall and crowd are the backdrop
      const e = M.e, k = Math.min(1, M.t / 1.2), ex = e.x / S, ez = e.y / S, cd = Math.hypot(ex, ez);
      const base = cd > 1.5 ? Math.atan2(-ez, -ex) : M.a + 2.1, th = base + 0.55 - M.t * 0.3, r = G.lerp(6.6, 4.6, k) + Math.max(0, M.t - 1.7) * 1.1;
      const pos = [ex + Math.cos(th) * r, G.lerp(1.6, 2.5, k) + Math.max(0, M.t - 1.2) * 0.8, ez + Math.sin(th) * r];
      const pl = Math.hypot(pos[0], pos[2]); if (pl > 6.6) { pos[0] *= 6.6 / pl; pos[2] *= 6.6 / pl; }
      [P, e].forEach(q => { const dx = pos[0] - q.x / S, dz = pos[2] - q.y / S, d = Math.hypot(dx, dz) || 0.01; if (d < 3.4) { pos[0] = q.x / S + dx / d * 3.4; pos[2] = q.y / S + dz / d * 3.4; } });
      gfx.cine = { pos, look: [(e.x * 2 + P.x) / 3 / S, 1.0, (e.y * 2 + P.y) / 3 / S], fov: gfx.portrait ? 82 : 54, roll: 0.04 };
      gfx.cam.shake = shake / 45; document.getElementById('foeArrow').className = 'hidden'; return;
    }
    if (gfx.cine && !F.ex) gfx.cine = null;
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
    { const kf = Math.pow(0.002, dt); camKx *= kf; camKz *= kf; tx += camKx; tz += camKz; }
    c.x += (tx - c.x) * k; c.z += (tz - c.z) * k; c.shake = shake / 45 * (G.shakeMul == null ? 1 : G.shakeMul);
    // edge arrow when the opponent is off screen
    const ar = document.getElementById('foeArrow'), ep = gfx.project(E.x / S, 1, E.y / S), m = 26;
    if (E.state !== 'ko' && (ep.x < 0 || ep.x > gfx.W || ep.y < 0 || ep.y > gfx.H)) {
      const ax = clamp(ep.x, m, gfx.W - m), ay = clamp(ep.y, m + 70, gfx.H - m - 120);
      ar.className = ''; ar.style.transform = 'translate(' + ax + 'px,' + ay + 'px) translate(-50%,-50%) rotate(' + Math.atan2(ep.y - ay, ep.x - ax) + 'rad)';
    } else ar.className = 'hidden';
  }


  // ------------------------------------------------------------------ exhibition bouts (scripted, for the cinematic)
  function exThink(e) {
    const I = e.intent, f = e.foe, tg = e.faceAt || f;
    I.aim = Math.atan2(tg.y - e.y, tg.x - e.x); I.pt.x = e.orderPt ? e.orderPt.x : f.x; I.pt.y = e.orderPt ? e.orderPt.y : f.y; I.attack = !!e.exAttack;
    if (!(e.buf && e.buf.id === 'dodge')) I.mx = I.my = 0;
    if (e.goto) { const dx = e.goto.x - e.x, dy = e.goto.y - e.y, d = Math.hypot(dx, dy); if (d > 14) { I.mx = dx / d; I.my = dy / d; } else e.goto = null; }
    delete e.st.stun;
  }
  F.exStop = function () {
    if (F.P) [F.P, F.E].forEach(e => { if (e.vis) { sc.remove(e.vis.g); if (e.vis.tele) sc.remove(e.vis.tele); e.vis = null; } });
    (fx || []).forEach(killFx); (projs || []).forEach(p => p.m && sc.remove(p.m)); (zones || []).forEach(z => z.m && sc.remove(z.m));
    fx = []; projs = []; zones = []; clearGibs(); if (sc) gfx.clearBlood(sc); gfx.clearFloats(); F.ex = null; F.active = false; F.speed = 1; hitstop = 0; shake = 0; gfx.cam.shake = 0;
    if (arena) arena.flash.intensity = 0;
  };
  F.exStart = function (a, b, pa, pb) {
    arena = G.world.get('arena'); sc = arena.scene;
    F.exStop();
    const mk = (h, pos, pl) => {
      const hh = { name: h.name || '', cls: h.cls, race: h.race, level: 5, stats: G.baseStats(h.cls, h.race), sub: h.sub || null, feats: [], known: [], slots: [], ult: null };
      const d = G.derive(hh, null); d.maxHp = 1e6;
      const e = makeEntity(hh, d, { cls: h.cls, race: h.race, gear: h.gear || { weapon: 0, armor: 0 }, tint: h.tint, scale: h.scale || 1, rank: 0 }, pl);
      e.x = pos[0] * S; e.y = pos[1] * S; e.hp = e.maxHp = 1e6; return e;
    };
    P = mk(a, pa, true); E = mk(b, pb, false); P.foe = E; E.foe = P;
    P.aim = Math.atan2(E.y - P.y, E.x - P.x); E.aim = P.aim + Math.PI;
    F.ex = true; [P, E].forEach(makeVis); if (!arena.flash.parent) sc.add(arena.flash);
    time = 0; hitstop = 0; shake = 0; hype = 50; lastAb = null; stolen = 0; tossed = 0; phase = 'fight'; result = null;
    F.active = true; F.paused = false; F.P = P; F.E = E; initPoise(); sync(0);
    return { A: P, B: E };
  };
  F.exCast = function (e, id, pt) {
    e.cds = {}; e.res = 100; if (e.state === 'wind' || e.state === 'recover') interrupt(e); if (e.state === 'dodge') e.state = 'idle';
    e.orderPt = pt ? { x: pt[0] * S, y: pt[1] * S } : null; e.buf = null; e.intent.queue.push(id);
  };
  // the intro shows what the pit really does to people
  F.exSever = function (e, part, dir) { sever(e, part, null, dir == null ? Math.atan2(e.y - e.foe.y, e.x - e.foe.x) : dir); };
  F.exGib = function (e, ash) { const a = Math.atan2(e.y - e.foe.y, e.x - e.foe.x); if (!ash) { blood(e.x, e.y, 90); blood(e.x, e.y, 50, a); } fx.push({ k: 'blast', x: e.x, y: e.y, r: 100, col: '#ff3020', t: 0, life: 0.5 }); fx.push({ k: 'ring', x: e.x, y: e.y, r: 220, col: '#ff5030', t: 0, life: 0.6 }); makeGibs(e, ash); e.vis.g.visible = false; e.state = 'ko'; e.koT = 9; e.act = null; e.st = {}; shake = 20; hitstop = 0.18; G.sfx('boom'); G.sfx('crit'); };
  F.addHype = v => addHype(v);
  F.exDown = function (e) { e.state = 'ko'; e.koT = 0; e.act = null; e.st = {}; e.buffs = {}; e.chain = null; };
  F.exDodge = function (e, ang) { e.dodgeT = 0; if (e.state !== 'idle') interrupt(e); e.intent.mx = Math.cos(ang); e.intent.my = Math.sin(ang); e.buf = { id: 'dodge', t: 0.3 }; };

  F.forfeit = function () { if (!F.active) return; result = { win: false, forfeit: true }; F.active = false; F.paused = false; G.ui.banner(null); finish(); };

  function finish() {
    if (opp.spar) {                              // friendly duel: nothing at stake here but pride (and whatever was wagered)
      G.save(); gfx.cam.shake = 0; gfx.clearFloats(); gfx.cine = null; document.getElementById('foeArrow').className = 'hidden';
      const cb = opp.onDone; opp.onDone = null; return cb ? cb(result.win && !result.forfeit) : G.ui.hub();
    }
    const st = G.state, win = result.win, first = !st.wins[opp.id];
    const hy = Math.round(hype), base = win ? (first ? 1 : 0.6) : 0.25;
    const r = {
      win, opp, first, hype: hy, forfeit: result.forfeit,
      xp: Math.round(opp.xp * base * P.d.xpMul),
      coin: win ? Math.round(opp.coin * (first ? 1 : 0.6) * P.d.coinMul * (hy >= 80 ? 1.2 : 1)) + stolen : stolen,
      respect: win ? Math.round(opp.respect * (first ? 1 : 0.3) * P.d.respectMul * (1 + hy / 200)) : 0,
      tips: win && hy >= 80, stolen, tossed: win ? tossed : 0, frenzies: F.frenzies || 0
    };
    if (win) r.coin += tossed;
    if (result.forfeit) { r.xp = 0; r.coin = 0; }
    if (!win) {                                  // a lost bout is a death: the purse goes, and some of the name with it
      r.lost = st.coin; st.coin = 0; st.deaths = (st.deaths || 0) + 1; st.soulDebt = (st.soulDebt || 0) + 1;
      const floor = G.RANKS[G.rankOf(st.respect)].at; st.respect = Math.max(floor, st.respect - Math.max(4, Math.round((st.respect - floor) * 0.25)));
    }
    r.mortal = win ? (M ? M.name : G.MORTAL[P.cls].name) : null;
    if (win && G.deeds) { G.deeds.bump('win'); G.deeds.bump('mortal'); if (P.hp >= P.maxHp) G.deeds.bump('flawless'); if (hy >= 100) G.deeds.bump('hype100'); } gfx.cine = null; G.afterFight = true;
    if (G.crew) r.crew = G.crew.tick();
    if (G.mark) G.mark.resolve(win);
    if (G.comfort) st.roomTips = (st.roomTips || 0) + Math.floor(G.comfort(st) / 14);
    st.potions = Math.max(0, Math.min(P.startPotions, P.potions));
    if (win) st.wins[opp.id] = (st.wins[opp.id] || 0) + 1; else st.losses++;
    const rank0 = G.rankOf(st.respect);
    st.coin += r.coin; st.respect += r.respect; st.hero.xp += r.xp;
    r.rankUp = G.rankOf(st.respect) > rank0 ? G.rankOf(st.respect) : null;
    G.save(); gfx.cam.shake = 0; gfx.clearFloats(); document.getElementById('foeArrow').className = 'hidden';
    G.ui.results(r);
  }
})();
