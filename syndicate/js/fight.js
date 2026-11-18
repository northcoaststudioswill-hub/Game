// Underground Syndicate — real-time one-on-one combat on the pre-rendered arena plate
(function () {
  const G = window.G, A = G.ABILITIES;
  const K = 0.42, CX = 590, CY = 478, RX = 254, RY = 250, ZOOM = 1.52, ER = 16;
  const F = G.fight = { active: false, paused: false, speed: 1 };
  const TORCHES = [[192, 495], [915, 545], [437, 285], [758, 287], [1018, 428], [155, 428], [435, 698], [757, 703], [495, 268], [883, 310], [320, 315]];
  let P, E, projs, zones, fx, parts, texts, cam, time, hitstop, phase, phaseT, hype, opp, shake, result, lastAb, stolen;

  const rand = G.rand, clamp = G.clamp;
  const sx = (x) => CX + x, sy = (y, z) => CY + y * K - (z || 0);

  function clampArena(o) {
    o.x = clamp(o.x, -RX, RX); o.y = clamp(o.y, -RY, RY);
    const k = Math.abs(o.x) / RX + Math.abs(o.y) / RY;
    if (k > 1.5) { const f = 1.5 / k; o.x *= f; o.y *= f; }
  }
  function inArena(x, y, m) { return Math.abs(x) < RX + m && Math.abs(y) < RY + m && Math.abs(x) / RX + Math.abs(y) / RY < 1.5 + m / 200; }

  function makeEntity(h, d, look, isPlayer) {
    const C = G.CLASSES[h.cls];
    return {
      isPlayer, name: h.name, cls: h.cls, C, look, stats: h.stats, level: h.level, d,
      x: isPlayer ? -150 : 150, y: 0, z: 0, kx: 0, ky: 0, aim: isPlayer ? 0 : Math.PI,
      hp: d.maxHp, maxHp: d.maxHp, res: 100, shield: 0,
      basic: C.basic, kit: (h.slots || h.known).filter(Boolean), ult: h.ult || null, cds: {}, dodgeT: 0,
      state: 'idle', t: 0, act: null, st: {}, buffs: {}, iframe: 0, flash: 0, walk: 0, moving: false, koT: 0,
      intent: { mx: 0, my: 0, aim: 0, pt: { x: 0, y: 0 }, attack: false, queue: [] }, buf: null,
      potions: 0, ai: null, think: 0.6, strafe: 1, strafeT: 1, combo: 0, lastSeen: { x: 0, y: 0 }, auraT: 0, dmgDealt: 0
    };
  }

  F.start = function (o) {
    opp = o; const st = G.state, h = st.hero;
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
    projs = []; zones = []; fx = []; parts = []; texts = [];
    cam = { x: CX, y: CY }; time = 0; hitstop = 0; shake = 0; hype = 20; lastAb = null; stolen = 0;
    phase = 'intro'; phaseT = 1.6; result = null;
    F.active = true; F.paused = false; F.P = P; F.E = E;
    G.ui.buildHud(P, E);
    G.sfx('bell'); G.sfx('crowd');
  };

  // ------------------------------------------------------------------ helpers
  function text(e, s, col, big) { texts.push({ x: e.x + rand(-8, 8), y: e.y, z: 70 + rand(0, 10), s, col: col || '#fff', t: 0, life: big ? 1.3 : 0.9, big }); }
  function spark(x, y, z, col, n, sp, add) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, 6.28), v = rand(0.3, 1) * (sp || 160);
      parts.push({ x, y, z: z || 20, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vz: rand(40, 200), life: rand(0.25, 0.6), t: 0, col, size: rand(1.5, 3.5), add: add !== false });
    }
  }
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
    spark(tgt.x, tgt.y, 34, ab.color || '#fff', crit ? 16 : 8, crit ? 260 : 170);
    spark(tgt.x, tgt.y, 30, '#b01818', 5, 120, false);
    G.sfx(crit ? 'crit' : tgt.isPlayer ? 'hurt' : 'hit');
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
    G.sfx(result.win ? 'win' : 'lose'); G.sfx('crowd');
    spark(e.x, e.y, 30, '#ffd36b', 30, 300);
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
      let dx = I.pt.x - e.x, dy = I.pt.y - e.y, d = Math.hypot(dx, dy) || 1;
      if (d > ab.castRange) { dx *= ab.castRange / d; dy *= ab.castRange / d; }
      act.pt = { x: e.x + dx, y: e.y + dy }; clampArena(act.pt);
    }
    e.state = 'wind'; e.t = ab.wind;
    if (!ab.basic) {
      if (e.isPlayer) { if (lastAb !== id) addHype(6); lastAb = id; }
      if (e.d.wild && Math.random() < 0.25) wildSurge(e);
    }
    if (e.buffs.stealth && ab.type !== 'buff' && ab.type !== 'dash') delete e.buffs.stealth;
    G.sfx(ab.type === 'melee' && !ab.spell ? 'swing' : ab.basic ? 'cast' : ab.type === 'dash' ? 'dash' : 'cast');
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
    const d = Math.hypot(foe.x - e.x, foe.y - e.y) || 1;
    const sees = !foe.buffs.stealth;
    if (ab.behind && sees && d < ab.dist * 1.35) {
      const ux = (foe.x - e.x) / d, uy = (foe.y - e.y) / d;
      tx = foe.x + ux * 48; ty = foe.y + uy * 48;
    } else { tx = e.x + Math.cos(e.act ? e.act.aim : e.aim) * ab.dist; ty = e.y + Math.sin(e.act ? e.act.aim : e.aim) * ab.dist; }
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
      const d = Math.hypot(foe.x - e.x, foe.y - e.y), ta = Math.atan2(foe.y - e.y, foe.x - e.x);
      const arc = ab.arc * Math.PI / 180;
      if (ab.cone) { fx.push({ k: 'cone', x: e.x, y: e.y, a, r: ab.range, arc, col: ab.cone, t: 0, life: 0.35 }); G.sfx(ab.fire ? 'fire' : 'dodge'); }
      else fx.push({ k: 'slash', x: e.x, y: e.y, a, r: ab.range, arc, col: ab.color, t: 0, life: 0.18 });
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
      fx.push({ k: 'bolt', x1: e.x, y1: e.y, x2, y2, col: ab.color, t: 0, life: 0.28, seed: Math.random() * 99 });
      G.sfx('zap'); shake = Math.max(shake, 6);
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
      if (ab.ult || ab.type === 'buff') fx.push({ k: 'ring', x: e.x, y: e.y, r: 70, col: ab.color, t: 0, life: 0.45 });
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
    // statuses
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
        if (Math.hypot(e.foe.x - e.x, e.foe.y - e.y) < au.radius + ER) { hit(e, e.foe, { type: 'aura', dmg: au.dmg, stat: au.stat, radiant: 1, color: '#c8f0ff', slow: [au.slow, 0.7] }); }
      }
    }
    // knockback
    if (e.kx || e.ky) { e.x += e.kx * dt; e.y += e.ky * dt; const f = Math.pow(0.002, dt); e.kx *= f; e.ky *= f; if (Math.abs(e.kx) + Math.abs(e.ky) < 8) e.kx = e.ky = 0; }
    // chained dashes (Flurry of Shadows)
    if (e.chain) { e.chain.t -= dt; if (e.chain.t <= 0) { doDash(e, e.chain.ab); if (--e.chain.n <= 0) e.chain = null; else e.chain.t = 0.17; } }

    const I = e.intent, spd = 1 + (e.buffs.haste ? e.buffs.haste.amt : 0);
    let mv = 0;
    e.moving = false;
    if (e.st.stun) { if (e.state !== 'idle') interrupt(e); e.state = 'idle'; I.queue.length = 0; clampArena(e); return; }
    // buffered inputs
    if (I.queue.length) { e.buf = { id: I.queue.shift(), t: 0.3 }; I.queue.length = 0; }
    if (e.buf) { e.buf.t -= dt; if (e.buf.t <= 0) e.buf = null; }

    if (e.state === 'dodge') {
      e.t -= dt; e.x += Math.cos(e.da) * 560 * dt; e.y += Math.sin(e.da) * 560 * dt;
      if (Math.random() < 0.5) parts.push({ x: e.x, y: e.y, z: 4, vx: 0, vy: 0, vz: 20, life: 0.3, t: 0, col: '#8a8078', size: 3, add: false });
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
          let a = (I.mx || I.my) ? Math.atan2(I.my, I.mx) : I.aim + Math.PI;
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
      let v = e.d.speed * mv * m * (e.st.slow ? 1 - e.st.slow.amt : 1) * (1 + (e.buffs.speed ? e.buffs.speed.amt : 0));
      e.x += I.mx / l * v * dt; e.y += I.my / l * v * dt; e.walk += dt * 13 * m; e.moving = true;
    }
    if (e.state === 'idle' || e.state === 'recover') e.aim = I.aim;
    // body collision
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
    if (e.C.ranged && Math.abs(e.x) / RX + Math.abs(e.y) / RY > 1.25) { mx -= e.x / RX; my -= e.y / RY; }
    // leave telegraphed blasts
    for (const z of zones) if (z.owner !== e && z.delay - z.t > 0.1) {
      const zd = Math.hypot(e.x - z.x, e.y - z.y);
      if (zd < z.r + 30) {
        if (!z.seen) { z.seen = 1; z.flee = Math.random() < ai.dodge + 0.35; if (z.flee && zd < z.r && Math.random() < ai.dodge * 2) I.queue.push('dodge'); }
        if (z.flee) { mx = (e.x - z.x) / (zd || 1); my = (e.y - z.y) / (zd || 1); if (zd < 4) mx = 1; }
      }
    }
    I.mx = mx; I.my = my;
    // defensive reactions
    if (seen && foe.state === 'wind' && foe.act && !foe.act.seen) {
      foe.act.seen = 1; const ab = foe.act.ab;
      const threat = ab.type === 'melee' ? d < ab.range + (ab.lunge || 0) + 30 : ab.type === 'line';
      if (threat && Math.random() < ai.dodge) e.react = { t: Math.min(ab.wind * 0.6, ai.react * 0.4) };
    }
    for (const p of projs) if (p.owner !== e && !p.seen && Math.hypot(p.x - e.x, p.y - e.y) < 170) { p.seen = 1; if (Math.random() < ai.dodge) e.react = { t: 0.03, side: 1 }; }
    if (e.react) { e.react.t -= dt; if (e.react.t <= 0) { if (e.react.side) { I.mx = -uy * e.strafe; I.my = ux * e.strafe; } I.queue.push('dodge'); e.react = null; } }
    // offense
    e.think -= dt;
    if (e.combo > 0 && e.state === 'idle' && d < A[e.basic].range + 14) { I.attack = true; }
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
  F.aiThink = think;

  function playerIntent() {
    const I = P.intent, In = G.input, k = In.keys;
    let mx = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0), my = (k.KeyS || k.ArrowDown ? 1 : 0) - (k.KeyW || k.ArrowUp ? 1 : 0);
    if (In.stick.active) { mx = In.stick.x; my = In.stick.y / 0.8; }
    I.mx = mx; I.my = my;
    if (In.touch || In.autoAim) {
      const t = E.buffs.stealth ? { x: P.x + Math.cos(P.aim) * 100, y: P.y + Math.sin(P.aim) * 100 } : E;
      I.aim = Math.atan2(t.y - P.y, t.x - P.x); I.pt.x = t.x; I.pt.y = t.y;
    } else {
      const wx = (In.mouse.x - G.W / 2) / ZOOM + cam.x - CX, wy = ((In.mouse.y - G.H / 2) / ZOOM + cam.y - CY) / K;
      I.aim = Math.atan2(wy - P.y, wx - P.x); I.pt.x = wx; I.pt.y = wy;
    }
    I.attack = In.mouse.down || In.touchAtk || k.KeyJ;
    while (In.pressed.length) {
      const a = In.pressed.shift();
      if (a === 'dodge' || a === 'potion') I.queue.push(a);
      else if (a === 'ult') { if (P.ult) I.queue.push(P.ult); }
      else { const id = P.kit[+a[1]]; if (id) I.queue.push(id); }
    }
  }

  // ------------------------------------------------------------------ main update
  F.update = function (dt) {
    if (!F.active || F.paused) return;
    dt *= F.speed;
    if (hitstop > 0) { hitstop -= dt; dt *= 0.05; }
    if (phase === 'ko') dt *= 0.45;
    time += dt; shake = Math.max(0, shake - dt * 40);
    if (phase === 'intro') { phaseT -= dt; G.input.pressed.length = 0; if (phaseT <= 0) { phase = 'fight'; } }
    if (phase === 'fight') {
      if (G.debugAuto) { if (!P.ai) P.ai = { react: 0.3, aggro: 0.7, dodge: 0.3 }; think(P, dt); } else playerIntent();
      think(E, dt);
      hype = Math.max(0, hype - dt * 1.2);
    } else { P.intent.mx = P.intent.my = E.intent.mx = E.intent.my = 0; P.intent.attack = E.intent.attack = false; P.intent.queue.length = E.intent.queue.length = 0; }
    updateEntity(P, dt); updateEntity(E, dt);

    for (let i = projs.length - 1; i >= 0; i--) {
      const p = projs[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      const f = p.owner.foe;
      if (Math.random() < 0.6) parts.push({ x: p.x, y: p.y, z: 34, vx: rand(-20, 20), vy: rand(-20, 20), vz: rand(-10, 30), life: 0.25, t: 0, col: p.ab.color, size: rand(1.5, 3), add: true });
      if (!p.passed && f.state !== 'ko' && f.z < 30 && Math.hypot(p.x - f.x, p.y - f.y) < p.r + ER) {
        const dodged = f.iframe > 0;
        hit(p.owner, f, p.ab, { from: p.a });
        if (dodged) p.passed = 1; else { projs.splice(i, 1); continue; }
      }
      if (!inArena(p.x, p.y, 70) || p.t > 2) { spark(p.x, p.y, 30, p.ab.color, 5, 80); projs.splice(i, 1); }
    }
    for (let i = zones.length - 1; i >= 0; i--) {
      const z = zones[i]; z.t += dt;
      if (z.t >= z.delay) {
        const f = z.owner.foe, ab = z.ab;
        fx.push({ k: 'blast', x: z.x, y: z.y, r: z.r, col: ab.color, t: 0, life: 0.45, pillar: ab.radiant });
        spark(z.x, z.y, 20, ab.color, 22, z.r * 2.4);
        shake = Math.max(shake, z.r > 80 ? 12 : 5); G.sfx(ab.radiant ? 'holy' : 'boom');
        if (f.z < 30 && Math.hypot(f.x - z.x, f.y - z.y) < z.r + ER * 0.6) hit(z.owner, f, ab, { from: Math.atan2(f.y - z.y, f.x - z.x) });
        zones.splice(i, 1);
      }
    }
    for (let i = fx.length - 1; i >= 0; i--) { fx[i].t += dt; if (fx[i].t >= fx[i].life) fx.splice(i, 1); }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.vz -= 420 * dt;
      if (p.z < 0) { p.z = 0; p.vz *= -0.3; p.vx *= 0.5; p.vy *= 0.5; }
      if (p.t >= p.life) parts.splice(i, 1);
    }
    for (let i = texts.length - 1; i >= 0; i--) { texts[i].t += dt; texts[i].z += dt * 46; if (texts[i].t >= texts[i].life) texts.splice(i, 1); }
    if (parts.length > 400) parts.splice(0, parts.length - 400);

    const tx = CX + (P.x + E.x) * 0.5 * 0.3, ty = CY - 6 + (P.y + E.y) * 0.5 * K * 0.3;
    cam.x += (tx - cam.x) * Math.min(1, dt * 4); cam.y += (ty - cam.y) * Math.min(1, dt * 4);

    if (phase === 'ko') {
      phaseT -= dt / 0.45;
      if (phaseT <= 0) { F.active = false; finish(); }
    }
    G.ui.updateHud(P, E, hype);
  };

  F.forfeit = function () { if (!F.active) return; result = { win: false, forfeit: true }; F.active = false; F.paused = false; finish(); };

  function finish() {
    const st = G.state, win = result.win, first = !st.wins[opp.id];
    const hy = Math.round(hype);
    const base = win ? (first ? 1 : 0.6) : 0.25;
    const r = {
      win, opp, first, hype: hy, forfeit: result.forfeit,
      xp: Math.round(opp.xp * base * P.d.xpMul),
      coin: win ? Math.round(opp.coin * (first ? 1 : 0.6) * P.d.coinMul * (hy >= 80 ? 1.2 : 1)) + stolen : stolen,
      respect: win ? Math.round(opp.respect * (first ? 1 : 0.3) * P.d.respectMul * (1 + hy / 200)) : 0,
      tips: win && hy >= 80, stolen
    };
    if (result.forfeit) { r.xp = 0; r.coin = 0; }
    const used = Math.max(0, P.d.freePotion + P.startPotions - P.potions - P.d.freePotion);
    st.potions = Math.max(0, P.startPotions - used);
    if (win) st.wins[opp.id] = (st.wins[opp.id] || 0) + 1; else st.losses++;
    const rank0 = G.rankOf(st.respect);
    st.coin += r.coin; st.respect += r.respect; st.hero.xp += r.xp;
    r.rankUp = G.rankOf(st.respect) > rank0 ? G.rankOf(st.respect) : null;
    G.save();
    G.ui.results(r);
  }

  // ------------------------------------------------------------------ render
  function ell(c, x, y, r, fill, stroke, lw) {
    c.beginPath(); c.ellipse(sx(x), sy(y), r, r * K, 0, 0, 6.3);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 2; c.stroke(); }
  }
  function wedge(c, x, y, r, a, arc, fill, stroke) {
    c.save(); c.translate(sx(x), sy(y)); c.scale(1, K);
    c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, a - arc / 2, a + arc / 2); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
    c.restore();
  }

  function drawEntity(c, e) {
    const X = sx(e.x), Y = sy(e.y, e.z);
    let alpha = 1;
    if (e.buffs.stealth) alpha = e.isPlayer ? 0.4 : 0.12;
    if (e.state === 'dodge') alpha *= 0.75;
    const ax = Math.cos(e.aim), ay = Math.sin(e.aim) * K;
    const face = ax >= 0 ? 1 : -1;
    let act = 'idle', prog = 0, glowCol = null;
    if (e.state === 'ko') { act = 'ko'; prog = e.koT; }
    else if (e.st.stun) act = 'stun';
    else if (e.state === 'dodge') act = 'dodge';
    else if (e.act) {
      const ab = e.act.ab, melee = ab.type === 'melee' && !ab.spell;
      if (e.state === 'wind') { prog = 1 - e.t / (ab.wind || 0.01); act = melee ? 'swing' : 'cast'; if (melee) prog *= 0.5; glowCol = ab.color; }
      else { prog = 1 - e.t / (ab.rec || 0.01); act = melee ? 'swing' : 'idle'; if (melee) prog = 0.5 + prog * 0.5; }
    }
    c.save(); c.translate(X, Y);
    if (e.state === 'dodge') c.rotate(face * 0.35);
    c.scale(1.22, 1.22);
    G.drawChar(c, e.look, { face, wa: Math.atan2(ay, Math.abs(ax)), walk: e.walk, moving: e.moving, act, prog, flash: e.flash, alpha, t: time + (e.isPlayer ? 0 : 1.7), glowCol });
    c.restore();
    if (e.state !== 'ko') {
      if (e.st.burn) for (let i = 0; i < 2; i++) parts.length < 380 && Math.random() < 0.3 && parts.push({ x: e.x + rand(-10, 10), y: e.y, z: rand(10, 60), vx: 0, vy: 0, vz: 160, life: 0.35, t: 0, col: '#ff8a2a', size: 3, add: true });
      if (e.st.poison && Math.random() < 0.2) parts.push({ x: e.x + rand(-10, 10), y: e.y, z: rand(10, 60), vx: 0, vy: 0, vz: 90, life: 0.4, t: 0, col: '#8fe05a', size: 2.5, add: true });
      if (e.shield > 0) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(255,233,160,' + (0.5 + Math.sin(time * 6) * 0.15) + ')'; c.lineWidth = 2.5; c.beginPath(); c.ellipse(X, Y - 36, 26, 42, 0, 0, 6.3); c.stroke(); c.restore(); }
      if (e.buffs.counter) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = '#9fd0ff'; c.lineWidth = 3; c.beginPath(); c.arc(X + face * 14, Y - 38, 22, -1.2, 1.2); c.stroke(); c.restore(); }
      if (e.st.mark) G.glow(c, X, Y - 80, 12, '#fff0a0', 0.9);
      if (e.st.slow) { c.fillStyle = 'rgba(150,220,255,0.35)'; c.beginPath(); c.ellipse(X, Y, 22, 9, 0, 0, 6.3); c.fill(); }
    }
  }

  F.draw = function (c) {
    const shx = shake ? rand(-shake, shake) * 0.5 : 0, shy = shake ? rand(-shake, shake) * 0.5 : 0;
    c.save();
    c.translate(G.W / 2 + shx, G.H / 2 + shy); c.scale(ZOOM, ZOOM); c.translate(-cam.x, -cam.y);
    c.drawImage(G.img.arena, 0, 0, G.W, G.H);
    // torch flicker
    TORCHES.forEach((t, i) => G.glow(c, t[0], t[1], 62, 'rgba(255,150,60,0.34)', 0.55 + Math.sin(time * 9 + i * 2.3) * 0.2 + Math.sin(time * 23 + i) * 0.1));
    if (F.debug) { c.strokeStyle = '#0f0'; c.lineWidth = 1; c.beginPath(); for (let a = 0; a < 6.3; a += 0.05) { const o = { x: Math.cos(a) * 500, y: Math.sin(a) * 500 }; clampArena(o); c.lineTo(sx(o.x), sy(o.y)); } c.closePath(); c.stroke(); }

    // ground layer
    [P, E].forEach(e => {
      if (e.look.rank >= 1 && e.isPlayer) ell(c, e.x, e.y, 24, null, G.RANKS[e.look.rank].color + '66', 1.5);
      const sh = e.buffs.stealth && !e.isPlayer ? 0.05 : 0.5;
      ell(c, e.x, e.y, 19 - Math.min(8, e.z * 0.1), 'rgba(0,0,0,' + sh + ')');
      if (e.buffs.aura) {
        const r = A.spirit_guardians.aura.radius;
        ell(c, e.x, e.y, r, 'rgba(160,220,255,0.10)', 'rgba(200,240,255,0.5)', 2);
        for (let i = 0; i < 5; i++) { const a = time * 2.4 + i * 1.257; G.glow(c, sx(e.x + Math.cos(a) * r * 0.8), sy(e.y + Math.sin(a) * r * 0.8, 30), 16, '#c8f0ff', 0.9); }
      }
      // telegraphs
      if (e.state === 'wind' && e.act) {
        const ab = e.act.ab, pr = 1 - e.t / (ab.wind || 0.01), hostile = !e.isPlayer;
        const col = hostile ? 'rgba(255,60,50,' : 'rgba(255,255,255,';
        if (ab.type === 'melee' && (ab.wind >= 0.2 || hostile)) wedge(c, e.x, e.y, ab.range + (ab.lunge || 0) * (1 - pr), e.act.aim, ab.arc * Math.PI / 180, col + (0.08 + pr * 0.16) + ')', col + '0.5)');
        if (ab.type === 'line') { c.save(); c.translate(sx(e.x), sy(e.y)); c.scale(1, K); c.rotate(e.act.aim); c.fillStyle = col + (0.1 + pr * 0.2) + ')'; c.fillRect(0, -ab.width, ab.range, ab.width * 2); c.restore(); }
        if (ab.type === 'aoe' && ab.at !== 'target') { const p = ab.at === 'self' ? e : e.act.pt; ell(c, p.x, p.y, ab.radius, col + (0.08 + pr * 0.14) + ')', col + '0.6)'); }
      }
    });
    zones.forEach(z => {
      const pr = z.delay ? z.t / z.delay : 1, hostile = !z.owner.isPlayer;
      ell(c, z.x, z.y, z.r, hostile ? 'rgba(255,60,50,0.16)' : 'rgba(255,255,255,0.10)', hostile ? 'rgba(255,90,70,0.8)' : 'rgba(255,255,255,0.6)', 2);
      ell(c, z.x, z.y, z.r * pr, null, z.ab.color, 2);
    });
    fx.forEach(f => {
      const p = f.t / f.life;
      if (f.k === 'blast') { ell(c, f.x, f.y, f.r * (0.5 + p * 0.6), null, f.col, 4 * (1 - p)); }
      if (f.k === 'ring') ell(c, f.x, f.y, 10 + f.r * p, null, f.col, 3 * (1 - p));
    });

    // actors + projectiles, depth sorted
    const list = [P, E].concat(projs).sort((a, b) => a.y - b.y);
    list.forEach(o => {
      if (o.ab) {
        const X = sx(o.x), Y = sy(o.y, 34), ab = o.ab;
        ell(c, o.x, o.y, o.r, 'rgba(0,0,0,0.3)');
        if (ab.shape === 'knife' || ab.shape === 'shard') {
          c.save(); c.translate(X, Y); c.rotate(Math.atan2(o.vy * K, o.vx));
          c.fillStyle = ab.color; c.beginPath(); c.moveTo(12, 0); c.lineTo(-8, -3); c.lineTo(-8, 3); c.closePath(); c.fill(); c.restore();
          if (ab.shape === 'shard') G.glow(c, X, Y, 20, ab.color, 0.6);
        } else { G.glow(c, X, Y, o.r * 3, ab.color, 1); c.fillStyle = '#fff'; c.beginPath(); c.arc(X, Y, o.r * 0.5, 0, 6.3); c.fill(); }
      } else drawEntity(c, o);
    });

    // air effects
    c.save(); c.globalCompositeOperation = 'lighter';
    fx.forEach(f => {
      const p = f.t / f.life;
      if (f.k === 'slash') {
        c.save(); c.translate(sx(f.x), sy(f.y, 30)); c.scale(1, K * 1.25);
        c.strokeStyle = f.col; c.globalAlpha = 1 - p; c.lineWidth = 9 * (1 - p) + 2; c.lineCap = 'round';
        const a0 = f.a - f.arc / 2, a1 = a0 + f.arc * Math.min(1, p * 2.2 + 0.25);
        c.beginPath(); c.arc(0, 0, f.r * 0.82, a0, a1); c.stroke();
        c.lineWidth = 2; c.globalAlpha = (1 - p) * 0.6; c.beginPath(); c.arc(0, 0, f.r, a0, a1); c.stroke();
        c.restore();
      } else if (f.k === 'cone') {
        c.save(); c.translate(sx(f.x), sy(f.y, 26)); c.scale(1, K * 1.2); c.rotate(f.a);
        const g = c.createRadialGradient(0, 0, 4, 0, 0, f.r * (0.4 + p * 0.7));
        g.addColorStop(0, '#fff6d0'); g.addColorStop(0.4, f.col); g.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = g; c.globalAlpha = 1 - p * p; c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, f.r * 1.1, -f.arc / 2, f.arc / 2); c.closePath(); c.fill();
        c.restore();
      } else if (f.k === 'bolt') {
        c.strokeStyle = f.col; c.lineCap = 'round'; c.lineJoin = 'round';
        for (let pass = 0; pass < 3; pass++) {
          c.globalAlpha = (1 - p) * (pass === 0 ? 1 : 0.6); c.lineWidth = pass === 0 ? 5 : 2;
          c.beginPath(); const n = 14;
          for (let i = 0; i <= n; i++) {
            const t = i / n, j = (i === 0 || i === n) ? 0 : 1, off = Math.sin(f.seed + i * 7.3 + pass * 3 + Math.floor(f.t * 40)) * 16 * j * (pass + 1) * 0.6;
            const x = G.lerp(f.x1, f.x2, t), y = G.lerp(f.y1, f.y2, t);
            c.lineTo(sx(x) + off * 0.6, sy(y, 34) + off);
          }
          c.stroke();
        }
        c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.globalAlpha = 1 - p; c.beginPath(); c.moveTo(sx(f.x1), sy(f.y1, 34)); c.lineTo(sx(f.x2), sy(f.y2, 34)); c.stroke();
      } else if (f.k === 'trail') {
        c.strokeStyle = f.col; c.globalAlpha = (1 - p) * 0.8; c.lineWidth = 18 * (1 - p); c.lineCap = 'round';
        c.beginPath(); c.moveTo(sx(f.x1), sy(f.y1, 30)); c.lineTo(sx(f.x2), sy(f.y2, 30)); c.stroke();
      } else if (f.k === 'blast') {
        c.globalAlpha = 1;
        G.glow(c, sx(f.x), sy(f.y, 10), f.r * (0.8 + p * 0.7), f.col, (1 - p) * 1.0);
        G.glow(c, sx(f.x), sy(f.y, 10), f.r * 0.5, '#ffffff', (1 - p) * 0.8);
        if (f.pillar) { const g = c.createLinearGradient(0, sy(f.y) - 420, 0, sy(f.y)); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, f.col); c.globalAlpha = (1 - p) * 0.8; c.fillStyle = g; c.fillRect(sx(f.x) - f.r * 0.5 * (1 - p * 0.5), sy(f.y) - 420, f.r * (1 - p * 0.5), 420); }
      } else if (f.k === 'lob') {
        const x = G.lerp(f.x1, f.x2, p), y = G.lerp(f.y1, f.y2, p), z = 40 + Math.sin(p * Math.PI) * 120;
        c.globalAlpha = 1; G.glow(c, sx(x), sy(y, z), 22, f.col, 1); c.fillStyle = '#fff'; c.beginPath(); c.arc(sx(x), sy(y, z), 4, 0, 6.3); c.fill();
      }
    });
    c.restore();
    fx.forEach(f => {
      if (f.k === 'smoke') { const p = f.t / f.life; c.fillStyle = 'rgba(70,70,80,' + (0.5 * (1 - p)) + ')'; for (let i = 0; i < 7; i++) { const a = i * 0.9 + f.t; c.beginPath(); c.arc(sx(f.x + Math.cos(a) * 30 * p * 2), sy(f.y + Math.sin(a) * 30, 20 + i * 5 + p * 30), 22 + p * 22, 0, 6.3); c.fill(); } }
    });
    parts.forEach(p => {
      const a = 1 - p.t / p.life;
      c.globalAlpha = a; c.globalCompositeOperation = p.add ? 'lighter' : 'source-over';
      c.fillStyle = p.col; c.beginPath(); c.arc(sx(p.x), sy(p.y, p.z), p.size, 0, 6.3); c.fill();
    });
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';

    // floating combat text
    c.textAlign = 'center';
    texts.forEach(t => {
      const a = Math.min(1, (t.life - t.t) * 3), pop = t.t < 0.1 ? 1 + (0.1 - t.t) * 6 : 1;
      c.globalAlpha = a; c.font = '900 ' + Math.round((t.big ? 19 : 14) * pop) + 'px Cinzel, Georgia, serif';
      c.lineWidth = 3.5; c.strokeStyle = 'rgba(0,0,0,0.85)'; c.strokeText(t.s, sx(t.x), sy(t.y, t.z)); c.fillStyle = t.col; c.fillText(t.s, sx(t.x), sy(t.y, t.z));
    });
    c.globalAlpha = 1;
    c.restore();

    // vignette + banners
    const v = c.createRadialGradient(G.W / 2, G.H / 2, G.H * 0.35, G.W / 2, G.H / 2, G.H * 0.85);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.72)');
    c.fillStyle = v; c.fillRect(0, 0, G.W, G.H);
    if (P.hp < P.maxHp * 0.3 && P.state !== 'ko') { c.fillStyle = 'rgba(160,0,0,' + (0.10 + Math.sin(time * 6) * 0.05) + ')'; c.fillRect(0, 0, G.W, G.H); }
    c.textAlign = 'center';
    if (phase === 'intro') banner(c, phaseT > 0.6 ? opp.name.toUpperCase() : 'FIGHT!', phaseT > 0.6 ? opp.title : '', phaseT > 0.6 ? '#e8dcc0' : '#ffd36b');
    if (phase === 'ko') banner(c, result.win ? 'KNOCKOUT' : 'DEFEATED', '', result.win ? '#ffd36b' : '#ff5a4a');
  };
  function banner(c, a, b, col) {
    c.fillStyle = 'rgba(0,0,0,0.55)'; c.fillRect(0, G.H / 2 - 62, G.W, 110);
    c.font = '900 62px Cinzel, Georgia, serif'; c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 24; c.fillText(a, G.W / 2, G.H / 2 + 8); c.shadowBlur = 0;
    if (b) { c.font = '500 20px Cinzel, Georgia, serif'; c.fillStyle = '#b8ad98'; c.fillText(b, G.W / 2, G.H / 2 + 36); }
  }
})();
