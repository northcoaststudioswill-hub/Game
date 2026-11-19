// Guttercrown — the Hour Garden: what David does with the ones who will not sign.
(function () {
  'use strict';
  const G = window.G, ui = G.ui, O = G.oracle, W = G.world, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  if (!O || !O.revive) return;
  const NAME = 'David Roseinbeirg', SOULS = 10, pick = a => a[Math.floor(Math.random() * a.length)];
  const tied = st => !!(st.signed || st.bound);
  const SHADES = ['Nobody of Note', 'A Debtor, Unnamed', 'The One Before You', 'Somebody’s Brother', 'A Late Payer', 'The Understudy', 'Half-a-Chance', 'A Hopeful', 'The Substitute', 'A Name Ruled Through'];
  const TAUNTS = ['I signed nothing either. Look at me.', 'There is only one way out of here and it is through you.', 'He said the last one standing walks. He always says that.', 'I have been here since before your first bout.', 'Do not be sorry. I will not be.', 'You put me here. Did you know that?', 'The flowers are real. That is the worst part.', 'He is watching. He claps when it is close.', 'I do not remember my name. I remember yours.', 'Nine of us die today whatever happens. Make it ten.'];
  G.garden = { SOULS, run: null };

  function souls(st) {
    const f = (st.fallen || []).slice(-40).sort(() => Math.random() - 0.5).slice(0, SOULS), h = st.hero, cl = G.FOE_CLASSES || ['fighter', 'rogue', 'sorcerer', 'cleric'], races = Object.keys(G.RACES);
    return Array.from({ length: SOULS }, (_, i) => { const q = f[i], cls = (q && q.c && G.CLASSES[q.c]) ? q.c : cl[Math.floor(Math.random() * cl.length)], C = G.CLASSES[cls], lv = Math.max(1, h.level - 1);
      return { id: 'soul' + i, name: q ? q.n : SHADES[i], title: q ? 'whom you killed' : 'a soul he kept', cls, race: races[Math.floor(Math.random() * races.length)], level: lv, known: C.start.slice(0, 1 + (i >= 5 ? 1 : 0)).filter(id => G.ABILITIES[id]),
        hpMul: +(0.36 + i * 0.022).toFixed(2), dmgMul: +(0.52 + i * 0.03).toFixed(2), ai: { react: 0.6 - i * 0.02, aggro: 0.62, dodge: 0.06 + i * 0.01, guard: 0.2, parry: 0.03 + i * 0.008 }, xp: 0, coin: 0, respect: 0, garden: 1, taunt: TAUNTS[i],
        tint: { cloth: '#cfe0ee', armor: '#9fb4c8', armor2: '#7f94a8', trim: '#f4f8ff', hair: '#eef4ff', legs: '#aebccb' }, mine: !!q }; });
  }
  const arena = () => W.get('arena');
  function leave() { const a = arena(); if (a.garden) a.garden(false); G.garden.run = null; }

  // ------------------------------------------------------------ the brawl: all ten at once, everybody against everybody
  const S = 32, RAD = (W.AR || 8.2) * S; let mobs = [], chunks = [], hudEl = null, tPrev = 'idle', clock = 0;
  const clampA = o => { const R2 = RAD - 22; o.x = Math.max(-R2, Math.min(R2, o.x)); o.y = Math.max(-R2, Math.min(R2, o.y)); const k = (Math.abs(o.x) + Math.abs(o.y)) / (RAD - 28); if (k > 1.5) { o.x *= 1.5 / k; o.y *= 1.5 / k; } };
  const word = (x, y, s, col, big) => G.gfx.floatText(x / S, 2.3, y / S, s, col, big);
  // he watches from the rotunda, and cannot keep it to himself
  const HIS = ['OH, that is LOVELY. Do it again. Slower. I want to remember it.', 'Look at them go! I paid nothing for this. NOTHING. It is the best thing I own.', 'I could watch this all day. I have. I own the day.', 'Bleed on the lilies, meat, the gardener gets paid either way. He does not, actually.', 'Do you know what this is worth? I do. I counted it. Then I counted it again for pleasure.', 'That one owed me eleven. Now it owes me nothing, and I STILL feel robbed. Wonderful.', 'Gold under my arse and guts on my lawn. A man could weep. A lesser man.', 'Not the roses! …No, go on. The roses can be bought. Everything can.', 'Scream if you like. It carries beautifully in here. I had the dome built for it.', 'I love it. I LOVE it. Somebody write that down. Not you, you are busy dying.'];
  const HIS_KILL = ['ERASED! Oh, the look on its face. It had a face a moment ago.', 'Another one off the books. I adore a clean ledger.', 'HA! Gone. Not dead, GONE. Do you understand how much better that is?', 'That is one. I am keeping count. I am always keeping count.'];
  // and he has opinions about everybody's blood but his own
  const HATE = {
    elf: ['Look at the elf run. Six hundred years to learn that, and it is still wrong.', 'Pointy-eared, leaf-chewing, poem-writing waste of a long life. ERASE it.', 'An elf! I had one stuffed once. It was better company.'],
    dwarf: ['The dwarf! Go on, stunty, dig. DIG. It is the only thing your kind was ever for.', 'Half a man and all beard. Somebody step on it.', 'I can smell the tunnel on that one from up here. Scrub the lawn after.'],
    halforc: ['Tusks! In MY garden! Put it down before it breeds.', 'A half-orc. Half of what, I ask you? Half of something that should have been drowned.', 'It thinks with its jaw. Watch. There. Told you.'],
    tiefling: ['Horns and a tail and it wonders why nobody lends to it. Burn it back where it came from.', 'Hell-spawn on the grass. The gardener will have to salt it.', 'A tiefling. Somebody’s grandmother made a very poor bargain, and here it is, bleeding on my lilies.'],
    drow: ['Cave-pale spider-kisser. Squinting, is it? GOOD. Have some more sun.', 'A drow in daylight. Look at it flinch. I could watch that for a year.', 'Crawl back under your rock, you bleached little grub. Oh, you cannot. HA!'],
    human: ['A human. Seventy years if it is lucky, and it spends them on THIS.', 'Mayflies, the lot of you. Loud, greasy mayflies.', 'Humans. Bred like rats, think like rats, and they will die like rats while I applaud.'] };
  const ALL_HATE = ['Every one of you is beneath me. I had to build the throne this high just to be sure.', 'Elves, dwarves, orc-get, hell-get, cave-get, and the common herd. A full set! I shall have you all mounted.', 'Not one drop of decent blood on the whole lawn. Mine is the only kind worth spilling, and I am not offering.', 'I am the only real person here. The rest of you are furniture that screams.'];
  const hateFor = r => HATE[r] || ALL_HATE;
  let davT = 6, davEl = null;
  function says(pool) { if (!G.garden.run || !G.garden.run.brawl) return; if (!davEl) { davEl = document.createElement('div'); davEl.id = 'gdavid'; document.getElementById('ui').appendChild(davEl); } davEl.innerHTML = '<b>David</b> “' + pick(pool) + '”'; davEl.classList.remove('on'); void davEl.offsetWidth; davEl.classList.add('on'); davT = 7 + Math.random() * 4; }
  function hud() { if (!hudEl) { hudEl = document.createElement('div'); hudEl.id = 'gsouls'; document.getElementById('ui').appendChild(hudEl); } hudEl.textContent = 'SOULS LEFT · ' + (mobs.length + 1); }
  function gore(x, y, big) {
    const gf = G.gfx, X = x / S, Z = y / S, on = G.state.gore !== false;
    if (on) { gf.blood(X, 1.0, Z, big ? 90 : 50, 6); for (let i = 0; i < (big ? 6 : 3); i++) gf.splat(X + (Math.random() - 0.5) * 2.4, Z + (Math.random() - 0.5) * 2.4, 0.5 + Math.random() * 0.9); }
    gf.burst(X, 1.1, Z, 0xffffff, 26, 7, 3); gf.burst(X, 1.1, Z, 0xbfe0ff, 18, 4, 5);       // and then the white: not dead, removed
    const sc = arena().scene, T = THREE; for (let i = 0; i < (on ? 9 : 4); i++) { const m = new T.Mesh(new T.BoxGeometry(0.16 + Math.random() * 0.2, 0.14 + Math.random() * 0.16, 0.16 + Math.random() * 0.2), new T.MeshLambertMaterial({ color: on && i % 3 ? [0x8a1410, 0xb02018, 0x5a0c0a][i % 3] : 0xcfe0ee, transparent: true })); m.position.set(X, 0.9 + Math.random() * 0.6, Z); sc.add(m); const a = Math.random() * 6.28, v = 2 + Math.random() * 4.5; chunks.push({ m, vx: Math.cos(a) * v, vz: Math.sin(a) * v, vy: 4 + Math.random() * 5, t: 0 }); }
    G.sfx('crit'); G.sfx('wall');
  }
  function dropMob(m, by) { const i = mobs.indexOf(m); if (i < 0) return; mobs.splice(i, 1); gore(m.x, m.y, true); word(m.x, m.y, 'ERASED', '#ff3020', true); if (Math.random() < 0.6) says(Math.random() < 0.6 ? hateFor(m.race) : HIS_KILL); m.dead = 0.001; m.c.root.visible = false; arena().scene.remove(m.c.root); hud(); if (by === 'you' && G.fight.addHypeX) G.fight.addHypeX(8); }
  // the soul you were fighting is gone: the nearest one left turns to face you
  function nextSoul(e) {
    if (!mobs.length) { G.fight.noSever = false; return false; }
    const P = G.fight.P; gore(e.x, e.y, true); word(e.x, e.y, 'ERASED', '#ff3020', true);
    const m = mobs.slice().sort((a, b) => Math.hypot(a.x - P.x, a.y - P.y) - Math.hypot(b.x - P.x, b.y - P.y))[0]; mobs.splice(mobs.indexOf(m), 1); arena().scene.remove(m.c.root);
    e.x = m.x; e.y = m.y; e.maxHp = Math.round(e.maxHp * 1.03); e.hp = Math.round(e.maxHp * Math.max(0.45, m.hp / m.maxHp)); e.st = {}; e.kx = e.ky = 0; e.state = 'idle'; e.act = null; e.down = 0; e.iframe = 0.5; if (e.poise != null && e.maxPoise) e.poise = e.maxPoise;
    G.gfx.burst(e.x / S, 1, e.y / S, 0xcfe0ee, 16, 3, 2); hud(); if (!mobs.length) G.fight.noSever = false; return true;
  }
  function hitMobs() {             // what the player's blow does to everybody who is not the one they are locked on to
    const F = G.fight, P = F.P, E = F.E, st = P.state; const fired = tPrev === 'wind' && st !== 'wind' && P.act && P.act.ab; tPrev = st; if (!fired) return;
    const ab = P.act.ab, a = P.act.aim != null ? P.act.aim : P.aim, n = (ab.dmg || [1, 6]), base = n[0] * (n[1] + 1) / 2 + 3 + (P.d.weapon || 0), dmg = Math.max(2, Math.round(base * (P.d.dmgMul || 1) * (0.85 + Math.random() * 0.3)));
    const ang = (x, y) => { let d = Math.atan2(y - P.y, x - P.x) - a; return Math.abs(Math.atan2(Math.sin(d), Math.cos(d))); };
    mobs.slice().forEach(m => { const d = Math.hypot(m.x - P.x, m.y - P.y); let hit = false;
      if (ab.type === 'melee') hit = d < (ab.range || 60) + 26 && (ang(m.x, m.y) < ((ab.arc || 100) * Math.PI / 180) / 2 + 0.15 || d < 26);
      else if (ab.type === 'aoe') { const cx = ab.at === 'self' ? P.x : E.x, cy = ab.at === 'self' ? P.y : E.y; hit = Math.hypot(m.x - cx, m.y - cy) < (ab.radius || 90) + 16; }
      else if (ab.type === 'proj' || ab.type === 'line' || ab.type === 'dash') hit = d < (ab.type === 'dash' ? (ab.dist || 200) : 460) && ang(m.x, m.y) < Math.atan2(30, Math.max(30, d));
      if (!hit) return; m.hp -= dmg; m.flash = 0.12; m.hurt = 0.25; const ka = Math.atan2(m.y - P.y, m.x - P.x); m.kx = Math.cos(ka) * 190; m.ky = Math.sin(ka) * 190; m.state = 'idle'; m.t = 0; m.cd = Math.max(m.cd, 0.5);
      if (G.state.gore !== false) G.gfx.blood(m.x / S, 1.1, m.y / S, 14, 4); word(m.x, m.y, String(dmg), '#ffffff', false); if (m.hp <= 0) dropMob(m, 'you'); });
  }
  function stepMobs(dt) {
    const F = G.fight, P = F.P, E = F.E; if (!P || !E) return; clock += dt; if (davEl) davEl.style.top = G.gfx.portrait ? '41%' : '45%';       // his words hang in the gap between the foot of the throne and the fight
    davT -= dt; if (davT <= 0) { const r = Math.random(), alive = mobs.length ? mobs[Math.floor(Math.random() * mobs.length)] : null; says(r < 0.3 ? HIS : r < 0.5 ? ALL_HATE : r < 0.7 ? hateFor(G.state.hero.race) : hateFor(alive ? alive.race : G.state.hero.race)); } const live = F.inFight && F.inFight();
    for (let i = chunks.length - 1; i >= 0; i--) { const c = chunks[i]; c.t += dt; c.vy -= 20 * dt; c.m.position.x += c.vx * dt; c.m.position.z += c.vz * dt; c.m.position.y += c.vy * dt; c.m.rotation.x += dt * 6; c.m.rotation.z += dt * 5; if (c.m.position.y < 0.08) { c.m.position.y = 0.08; c.vy *= -0.3; c.vx *= 0.5; c.vz *= 0.5; } if (c.t > 2.2) { c.m.material.opacity = Math.max(0, 1 - (c.t - 2.2) / 0.6); if (c.t > 2.8) { c.m.parent && c.m.parent.remove(c.m); chunks.splice(i, 1); } } }
    if (live) hitMobs();
    const onYou = mobs.filter(m => m.tg === P).length;
    mobs.slice().forEach((m, idx) => {
      m.flash = Math.max(0, (m.flash || 0) - dt); m.hurt = Math.max(0, (m.hurt || 0) - dt); m.cd = Math.max(0, m.cd - dt); m.pickT -= dt;
      if (m.kx || m.ky) { m.x += m.kx * dt; m.y += m.ky * dt; const f = Math.pow(0.004, dt); m.kx *= f; m.ky *= f; if (Math.abs(m.kx) + Math.abs(m.ky) < 8) m.kx = m.ky = 0; }
      const alive = t => t && (t === P ? P.hp > 0 : t === E ? E.hp > 0 : mobs.indexOf(t) >= 0);
      if (m.pickT <= 0 || !alive(m.tg)) { m.pickT = 1.6 + Math.random() * 1.4; const pool = mobs.filter(q => q !== m).concat([E]); if (onYou < 2 || m.tg === P) pool.push(P); const dOf = q => Math.hypot(q.x - m.x, q.y - m.y) * (0.7 + Math.random() * 0.6); m.tg = pool.sort((p, q) => dOf(p) - dOf(q))[0]; }
      const tg = m.tg, dx = tg.x - m.x, dy = tg.y - m.y, d = Math.hypot(dx, dy) || 1; let moving = false, act = 'idle', prog = 0;
      if (m.state === 'idle') { m.face = Math.atan2(dy, dx); if (d > 54 && !m.hurt) { const v = m.spd * dt; m.x += dx / d * v; m.y += dy / d * v; m.walk += dt * 9; moving = true; } else if (live && m.cd <= 0 && clock > 2.6 && d <= 64) { m.state = 'wind'; m.t = 0; m.aim = m.face; } }
      else if (m.state === 'wind') { m.t += dt; act = 'swing'; prog = Math.min(0.5, m.t / 0.5 * 0.5); if (m.t >= 0.5) { m.state = 'rec'; m.t = 0; m.cd = 1.3 + Math.random() * 0.9; G.sfx('swing');
          const t2 = m.tg, dd = Math.hypot(t2.x - m.x, t2.y - m.y); let da = Math.atan2(t2.y - m.y, t2.x - m.x) - m.aim; da = Math.abs(Math.atan2(Math.sin(da), Math.cos(da)));
          if (alive(t2) && dd < 84 && da < 1.0) { if (t2 === P) { if (P.iframe > 0 || P.state === 'dodge') word(P.x, P.y, 'DODGED', '#9fd0ff', false); else { const g = P.guard > 0, dmg = Math.max(1, Math.round(m.dmg * (g ? 0.3 : 1) * (1 - Math.min(0.6, P.d.dr || 0)))); P.hp -= dmg; P.flash = 0.1; P.hurt = g ? 0.12 : 0.26; word(P.x, P.y, (g ? 'BLOCKED ' : '') + dmg, g ? '#cfd8e0' : '#ff7060', false); G.sfx('hit'); if (G.state.gore !== false && !g) G.gfx.blood(P.x / S, 1.1, P.y / S, 10, 3); if (P.hp <= 0) { P.hp = 0; F.koEntity(P); } } }
            else if (t2 === E) { E.hp -= Math.round(m.dmg * 0.7); E.flash = 0.1; if (G.state.gore !== false) G.gfx.blood(E.x / S, 1.1, E.y / S, 8, 3); if (E.hp <= 0) { E.hp = 1; if (mobs.length > 1) nextSoul(E); } }
            else { t2.hp -= m.dmg * 0.8; t2.flash = 0.1; t2.hurt = 0.2; if (G.state.gore !== false) G.gfx.blood(t2.x / S, 1.1, t2.y / S, 10, 3); if (t2.hp <= 0) dropMob(t2, 'them'); } } } }
      else { m.t += dt; act = 'swing'; prog = 0.5 + Math.min(0.5, m.t / 0.4 * 0.5); if (m.t >= 0.4) m.state = 'idle'; }
      [P, E].concat(mobs).forEach(q => { if (q === m) return; const ex = m.x - q.x, ey = m.y - q.y, ed = Math.hypot(ex, ey); if (ed < 36 && ed > 0.01) { const push = Math.min((36 - ed) / 2, 260 * dt); m.x += ex / ed * push; m.y += ey / ed * push; } });
      clampA(m); m.c.root.position.set(m.x / S, 0, m.y / S); m.c.root.rotation.y = Math.atan2(Math.cos(m.face), Math.sin(m.face));
      m.c.pose({ t: clock + idx * 1.3, act, prog, moving, walk: m.walk, ready: 1, flash: m.flash, hurt: m.hurt, step: idx % 2, wounded: m.hp < m.maxHp * 0.4 });
    });
  }
  const fu0 = G.fight.update;
  G.fight.update = function (dt) { const r = fu0.apply(this, arguments), run = G.garden.run; if (run && run.brawl && G.fight.active && !G.fight.paused) { try { stepMobs(Math.min(0.05, dt) * (G.fight.speed || 1)); } catch (e) { console.error(e); } } return r; };
  function endBrawl() { const sc = arena().scene; mobs.forEach(m => sc.remove(m.c.root)); mobs = []; chunks.forEach(c => c.m.parent && c.m.parent.remove(c.m)); chunks = []; G.fight.onFoeDown = null; G.fight.wideCam = false; G.fight.noSever = false; if (hudEl) { hudEl.remove(); hudEl = null; } if (davEl) { davEl.remove(); davEl = null; } if (G.garden.run) G.garden.run.brawl = 0; }

  function bout() {
    const run = G.garden.run, st = G.state, o = run.list[0]; ui.close();
    ui.close(); if (ui.leaveHub) ui.leaveHub(); G.scene = 'fight'; ui.topbar(); const a = arena(); if (a.garden) a.garden(true);
    o.name = 'The Ten'; o.title = 'everybody he kept'; o.hpMul = 0.5; o.dmgMul = 0.55;
    o.onDone = win => { o.onDone = null; run.left = mobs.length + 1; endBrawl(); if (!win) return soulDeath(o); G.sfx('holy'); survived(); };
    G.fight.start(o); const F = G.fight, lv = st.hero.level; clock = 0; tPrev = 'idle'; mobs = []; chunks = [];
    run.list.slice(1).forEach((q, i) => { const an = i / 9 * 6.2832 + 0.35, r = 150 + (i % 3) * 34, c = G.makeChar({ cls: q.cls, race: q.race, tint: q.tint }), hp = 34 + lv * 9 + i * 3;
      const m = { c, name: q.name, race: q.race, x: Math.cos(an) * r, y: Math.sin(an) * r, hp, maxHp: hp, dmg: 2.5 + lv * 0.7, spd: 105 + Math.random() * 40, state: 'idle', t: 0, cd: 1 + Math.random() * 2, pickT: Math.random(), walk: Math.random() * 6, face: an + Math.PI, kx: 0, ky: 0, tg: null }; a.scene.add(c.root); mobs.push(m); });
    run.brawl = 1; G.fight.wideCam = true; davT = 5; F.noSever = true; F.onFoeDown = e => nextSoul(e); hud();
  }
  function survived() {
    const st = G.state, run = G.garden.run, then = run.then; leave(); st.gardens = (st.gardens || 0) + 1; G.save(); G.scene = 'hub';
    show('<div class="card small letter event"><small class="over">The Hour Garden</small><h2>Last One Standing</h2><p>The last of them comes apart like breath on glass, and the grass is red to the hedges. The blossom keeps falling. Somewhere above the trees a man is applauding, slowly, with his rings on.</p><p class="quote">“' + pick(['OH, well DONE. I had money on the dwarf. I had money on all of them, actually. Up you get, meat. You have cost me a fortune and I have not enjoyed anything so much in years.', 'Ten! Ten of the whimpering little bastards, and you went through them like a dose. I am almost aroused. Go on. Back to the dirt. The pen is still warm whenever you tire of this.', 'You LIVE. Disgusting. Magnificent. Do it again some time, I will sell tickets.']) + '”</p><p class="got">You wake on the sand of the Blood Pit. You have survived the garden ' + st.gardens + ' time' + (st.gardens === 1 ? '' : 's') + '.</p><div class="row end"><button class="big" id="x">Wake</button></div></div>');
    on('#x', () => { ui.close(); then(); });
  }
  function soulDeath(by) {
    const st = G.state, h = st.hero, epi = h.name + ', level ' + h.level + ' ' + G.CLASSES[h.cls].name + ' · ' + G.RANKS[G.rankOf(st.respect)].name + ' · ' + (st.fallen || []).length + ' in the sand · fell in the garden with ' + ((G.garden.run || {}).left || 1) + ' of ' + SOULS + ' still standing';
    leave(); try { const g = JSON.parse(localStorage.getItem('guttercrown_graves') || '[]'); g.push(epi); localStorage.setItem('guttercrown_graves', JSON.stringify(g.slice(-20))); } catch (e) { }
    G.scene = 'hub'; G.gameOver = 1; G.wipe();
    show('<div class="card small letter event gameover"><small class="over">Soul death</small><h2>Game Over</h2><p>' + by.name + ' stands over you in the grass. There is no hatch this time, and no gold, and nobody turns anything back. The blossom covers you by evening.</p><p class="quote">“' + pick(['Pity. No, not pity. What is the other one? Lunch.', 'And THAT is what “not yet” buys you, you stubborn streak of piss. Next!', 'I did offer. I offered twice. Nobody can say I am not a generous man.']) + '”</p><p class="got">' + epi + '</p><p class="note">This fighter is gone. The save has been erased.</p><div class="row end"><button class="big" id="x">Back to the title</button></div></div>');
    on('#x', () => location.reload());
  }
  // ------------------------------------------------------------ before the door shuts: him, and all of it
  function intro(done) {
    ui.close(); if (ui.leaveHub) ui.leaveHub(); const a = arena(); G.gfx.setScene(a.scene); if (a.garden) a.garden(true); if (G.fight.exStop && !G.fight.active) G.fight.exStop(); if (G.titleChars) G.titleChars.forEach(c => c.root.visible = false); if (G.world.walker.char) G.world.walker.char.root.visible = false;
    const prev = G.scene; G.scene = 'cine'; ui.topbar();
    const kin = (G.RACES[G.state.hero.race] || {}).name || 'meat', lerp = (p, q, u) => p + (q - p) * u, V = (p, q, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u), lerp(p[2], q[2], u)];
    const SH = [
      { a: [[-1.5, 0.7, 1.5], [-9, 1.6, -8]], b: [[-3.5, 1.2, -1.5], [-9.8, 2.4, -9.8]], fov: 58, t: 'Gold. Hills of it, spilling down marble steps onto a lawn that has never seen rain. And above it, on a throne the size of a chapel, the man who owns the weather.' },
      { a: [[-4.2, 4.6, -4.2], [-9.8, 5.6, -9.8]], b: [[-5.0, 5.4, -5.0], [-9.8, 5.8, -9.8]], fov: 44, n: 1, t: 'LOOK at it. Look at ME. Do you know what I am worth, ' + kin.toLowerCase() + '? No. You cannot count that high. I had to invent numbers.' },
      { a: [[-8.6, 9.8, -8.6], [1, 0, 1]], b: [[-8.0, 9.0, -8.0], [2, 0, 2]], fov: 66, n: 1, t: 'My garden. My sun. My rules. Ten of the wretches I have been keeping, and you, and one way out. I am going to sit up here on more money than your whole bloodline ever touched, and I am going to WATCH.' },
      { a: [[-5.6, 5.5, -5.6], [-9.8, 5.7, -9.8]], b: [[-6.3, 5.7, -6.3], [-9.8, 5.75, -9.8]], fov: 34, n: 1, t: 'Oh, I love this part. I LOVE it. Bleed prettily. Die slowly. And do try not to get any on the gold.' }];
    const el = document.createElement('div'); el.id = 'talk'; el.innerHTML = '<div class="c-bar top"></div><div class="tk-box"><b class="tk-name"></b><p class="tk-text"></p><span class="tk-hint"></span></div><button class="c-skip mini">Skip</button>'; document.getElementById('ui').appendChild(el); document.getElementById('ui').classList.add('talking');
    let i = 0, t0 = performance.now(), shown = 0, over = false; G.sfx('holy'); G.sfx('bell');
    const end = () => { if (over) return; over = true; window.removeEventListener('keydown', key, true); el.remove(); document.getElementById('ui').classList.remove('talking'); G.gfx.cine = null; if (G.gfx.veil) G.gfx.veil(0.4); done(); };
    const next = () => { const s = SH[i]; if (shown < s.t.length) { shown = s.t.length; return; } i++; if (i >= SH.length) return end(); t0 = performance.now(); shown = 0; G.sfx('page'); if (G.gfx.veil) G.gfx.veil(0.25); };
    const key = e => { if (over) return; if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') { e.preventDefault(); e.stopPropagation(); next(); } else if (e.code === 'Escape') { e.stopPropagation(); end(); } };
    window.addEventListener('keydown', key, true); el.addEventListener('pointerdown', e => { if (!e.target.closest('button')) next(); }); el.querySelector('.c-skip').onclick = end;
    let padWas = true; const step = () => { if (over) return; const s = SH[i], tt = (performance.now() - t0) / 1000, u = Math.min(1, tt / 9), e2 = u * u * (3 - 2 * u), now = performance.now() / 1000;
      G.gfx.cine = { pos: V(s.a[0], s.b[0], e2), look: V(s.a[1], s.b[1], e2), fov: G.gfx.portrait ? Math.min(92, s.fov * 1.5) : s.fov, roll: 0 }; if (a.update) a.update(now);
      shown = Math.min(s.t.length, shown + 0.8); el.querySelector('.tk-name').textContent = s.n ? NAME : ''; el.querySelector('.tk-name').className = 'tk-name ' + (s.n ? 'npc' : 'none'); el.querySelector('.tk-text').textContent = s.t.slice(0, Math.floor(shown)); el.querySelector('.tk-hint').textContent = shown >= s.t.length ? (G.input.usingPad ? '(A) continue' : G.input.touch ? 'Tap to continue' : 'Click or Space to continue') : '';
      let pad = false; try { for (const p of (navigator.getGamepads ? navigator.getGamepads() : [])) if (p && p.buttons && p.buttons[0] && p.buttons[0].pressed) pad = true; } catch (er) { } if (pad && !padWas) next(); padWas = pad; };
    const loop = () => { if (over) return; step(); requestAnimationFrame(loop); }; G.garden.step = step; loop();       // on the frame, not a timer, so the camera does not judder against the renderer
  }
  G.garden.intro = intro;
  function gate(then) {
    const st = G.state;
    show('<div class="card small letter event"><small class="over">You would not sign</small><h2>The Hour Garden</h2><p>He does not send you back up. He opens a different door. There is sunlight behind it, which is wrong, and grass, and blossom coming down like snow.</p><p class="quote">“' + (st.gardens ? 'Back again, and STILL too proud to hold a pen. Good. I was getting bored.' : 'Unsigned meat does not get carried. Unsigned meat EARNS it. My garden. Ten souls I have been keeping for a rainy day, and you, and one way out.') + ' Last one breathing gets to go on breathing. I watch. It is the only thing down here that still gets my blood up.”</p>' +
      '<p class="note"><b>Ten souls, all at once.</b> Everybody against everybody: they will cut each other down as gladly as you. Be the last one standing and you wake in the pit. <b>Die in the garden and the game is over: this fighter is erased.</b> Or sign, and he simply brings you back, as he does for everyone he owns.</p>' +
      '<div class="row end"><button id="sg">Sign the contract</button><button class="big danger" id="gd">Walk into the garden</button></div></div>');
    on('#sg', () => { st.signed = true; G.save(); G.sfx('level'); show('<div class="card small letter event"><h2>The Contract</h2><p>The pen is warm. The ink is gold. “There. Was that so hard? All that pride, and it folds like a wet hat.” He shuts the garden door with his foot.</p><p class="got">Signed · he will bring you back from now on · every death is a soul on your account</p><div class="row end"><button class="big" id="x">Carry on</button></div></div>'); on('#x', () => { ui.close(); then(); }); });
    on('#gd', () => { G.garden.run = { list: souls(st), then }; G.save(); intro(bout); });
  }
  const rev0 = O.revive;
  O.revive = function (then) { const st = G.state; if (!(st.deaths > 0)) return rev0.call(this, then); return rev0.call(this, function () { if (tied(G.state)) return then(); gate(then); }); };

  if (G.LORE) G.LORE.push({ sec: 'The World', title: 'The Hour Garden', unlock: st => !!st.gardens || (st.deaths > 0 && !tied(st)), body: 'Under the cellar there is a door that opens on daylight. Nobody has explained the daylight. David Roseinbeirg keeps a garden there, walled and in blossom all year, and in it he keeps the ones who died owing him and would not sign. When somebody unsigned dies again he puts them in with ten of the others and shuts the door. The last one standing is turned back and wakes on the sand. The rest are not turned back. He calls it a fair offer, and by his lights it is: he has never once pretended it was anything but for his own amusement.' });
  if (G.objective) { const ob0 = G.objective; G.objective = function () { const s = ob0.apply(this, arguments), st = G.state; return st && st.hero && st.deaths > 0 && !tied(st) && s && !/garden/.test(s) ? s + ' · unsigned: your next death is the Hour Garden' : s; }; }
})();
