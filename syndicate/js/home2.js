// Guttercrown — a home that works for you: sleep, train, brew and cook between bouts, rooms that help the Tally and the Oracle's ledger,
// and stalls that remember a good customer
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, ui = G.ui, box = gfx.box, mesh = gfx.mesh, L = c => gfx.lambert(c), show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const B = W.BUILD, USE = G.ROOM_USE; if (!B || !USE) return;
  const bouts = st => Object.keys(st.wins || {}).reduce((n, k) => n + st.wins[k], 0) + (st.losses || 0);
  const has = (st, id) => (st.items || []).some(p => p.id === id);
  // once per bout: each piece of the house can be used once between fights
  const ready = (st, id, every) => { const u = (st.homeUsed || {})[id]; return u == null || bouts(st) - u >= (every || 1); };
  const mark = (st, id) => { (st.homeUsed = st.homeUsed || {})[id] = bouts(st); G.save(); };
  const wait = (st, id, every) => { const n = (every || 1) - (bouts(st) - (st.homeUsed || {})[id]); return n + ' more bout' + (n === 1 ? '' : 's'); };

  // ------------------------------------------------------------ the old furniture learns to do something
  const REST = [4, 6, 9, 12, 15], tier = c => c < 30 ? 0 : c < 90 ? 1 : c < 180 ? 2 : c < 300 ? 3 : 4;
  const wrap = (id, fn) => { const u = USE[id]; if (!u) return; const f0 = u[1]; u[1] = function (p, c) { f0.apply(this, arguments); fn(G.state, p, c); }; };
  wrap('bed', st => { if (!ready(st, 'bed')) return ui.toast('You have slept since your last bout. Lying here longer is only hiding.'); const pct = REST[tier(G.comfort(st))]; st.rested = pct; mark(st, 'bed'); G.sfx('level'); setTimeout(() => ui.toast('Rested: +' + pct + '% XP from your next bout. A better home gives better sleep.'), 900); });
  wrap('dummy', st => { const arm = G.armOf(st.hero); if (!ready(st, 'dummy')) return ui.toast('Your arms are done for today. Fight somebody, then come back.'); st.mastery = st.mastery || {}; st.mastery[arm] = (st.mastery[arm] || 0) + 10; mark(st, 'dummy'); setTimeout(() => { G.sfx('hit'); ui.toast(G.ARM_BY[arm].name + ' mastery +10. The dummy has no opinion.'); }, 700); });
  wrap('cauldron', st => { if (!ready(st, 'cauldron', 2)) return ui.toast('It needs to stew. ' + wait(st, 'cauldron', 2) + '.'); if (st.potions >= G.POTION_MAX) return ui.toast('Your belt is full. The cauldron keeps it warm.'); st.potions++; mark(st, 'cauldron'); G.sfx('coin'); ui.topbar(); setTimeout(() => ui.toast('You ladle off a potion. It is the right colour, more or less.'), 400); });
  if (G.DECOR_BY) { const perk = (id, t) => { if (G.DECOR_BY[id]) G.DECOR_BY[id].perk = t; };
    perk('bed', 'Sleep once between bouts: +4% to +15% XP from the next one, by how comfortable your home is. (Also +10% health.)'); perk('dummy', 'Train once between bouts: +10 mastery with the weapon you carry.'); perk('cauldron', 'Ladle off a free potion every second bout.');
    perk('desk', 'Give orders from home. Your Tally rolls +1 on every job.'); perk('trophies', 'Admire your record. +2% respect for each named fighter you have beaten, up to +10%.'); }

  // ------------------------------------------------------------ three new rooms' worth of furniture
  const wood = () => new T.MeshLambertMaterial({ color: 0x6a4428, map: gfx.tex('wood'), flatShading: true }), iron = () => L(0x26232a), gold = () => new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x4a3408, shininess: 90, flatShading: true });
  const add = (d, build, use) => { G.DECOR.push(d); G.DECOR_BY[d.id] = d; B[d.id] = build; if (use) USE[d.id] = use; };
  if (G.BOONS) G.BOONS.homemeal = { slot: 'meal', name: 'Home Cooking', cost: 0, desc: '+6% health in your next bout.', fx: P => { P.maxHp = Math.round(P.maxHp * 1.06); P.hp = P.maxHp; } };
  add({ id: 'stove', name: 'Iron Stove', cost: 140, rank: 1, zone: 'house', w: 1, d: 1, max: 1, perk: 'Cook once between bouts: +6% health in the next one. Replaces a meal from Big Hobb.', light: 0xff8a30 },
    g => { const ir = iron(); box(0.8, 0.7, 0.7, ir, 0, 0.42, 0, g); [[-0.32, -0.27], [0.32, -0.27], [-0.32, 0.27], [0.32, 0.27]].forEach(q => box(0.08, 0.1, 0.08, ir, q[0], 0.05, q[1], g)); box(0.86, 0.06, 0.76, L(0x3a3640), 0, 0.8, 0, g);
      mesh(new T.CylinderGeometry(0.09, 0.09, 1.5, 6), ir, -0.25, 1.55, -0.2, g); const door = new T.Mesh(new T.PlaneGeometry(0.34, 0.24), new T.MeshBasicMaterial({ color: 0xff7a20 })); door.position.set(0, 0.4, 0.356); g.add(door); box(0.42, 0.32, 0.03, L(0x1a181e), 0, 0.4, 0.345, g);
      mesh(new T.CylinderGeometry(0.2, 0.17, 0.2, 8), L(0x4a4650), 0.15, 0.93, 0.05, g); mesh(new T.CylinderGeometry(0.02, 0.02, 0.3, 4), wood(), 0.22, 1.05, 0.1, g).rotation.z = 0.5; return [0, 0.6, 0.5]; },
    ['Cook', () => { const st = G.state; if (!ready(st, 'stove')) return ui.toast('You have eaten. Fight first.'); (st.boons = st.boons || {}).meal = 'homemeal'; mark(st, 'stove'); G.sfx('coin'); ui.toast('Something hot, eaten standing up. +6% health in your next bout.'); }]);
  add({ id: 'maptable', name: 'Map Table', cost: 220, rank: 2, zone: 'house', w: 2, d: 1, max: 1, perk: 'The outlands, pinned and marked. Your Tally rolls +1 on every job and expedition.' },
    g => { const w = wood(); box(1.8, 0.1, 0.9, w, 0, 0.82, 0, g); [[-0.8, -0.35], [0.8, -0.35], [-0.8, 0.35], [0.8, 0.35]].forEach(q => box(0.1, 0.8, 0.1, w, q[0], 0.4, q[1], g));
      box(1.5, 0.02, 0.72, L(0xd8c89a), 0, 0.885, 0, g).castShadow = false; [[-0.5, 0.1, 0xc8372d], [0.2, -0.15, 0xc8372d], [0.55, 0.2, 0x3a6ac8], [-0.15, 0.22, 0xf0c95a]].forEach(q => { mesh(new T.CylinderGeometry(0.012, 0.012, 0.14, 4), iron(), q[0], 0.96, q[1], g); mesh(new T.SphereGeometry(0.035, 6, 5), L(q[2]), q[0], 1.04, q[1], g); });
      box(0.3, 0.03, 0.05, L(0x4a6a8a), -0.1, 0.9, -0.05, g).rotation.y = 0.4; mesh(new T.CylinderGeometry(0.05, 0.05, 0.5, 6), L(0xefe2bc), 0.62, 0.92, -0.3, g).rotation.z = Math.PI / 2; },
    ['Study the map', () => ui.outlands()]);
  add({ id: 'shrine', name: 'Hourglass Shrine', cost: 260, rank: 2, zone: 'any', w: 1, d: 1, max: 1, perk: 'He had it delivered. Buying back a soul costs a quarter less while it stands in your home.', light: 0xffd36b },
    g => { const gd = gold(); box(0.6, 0.5, 0.6, L(0x2a1a3a), 0, 0.25, 0, g); box(0.68, 0.06, 0.68, gd, 0, 0.53, 0, g); mesh(new T.CylinderGeometry(0.2, 0.2, 0.04, 8), gd, 0, 0.6, 0, g); mesh(new T.CylinderGeometry(0.2, 0.2, 0.04, 8), gd, 0, 1.16, 0, g);
      const glass = new T.MeshPhongMaterial({ color: 0xfff0c8, transparent: true, opacity: 0.35, shininess: 120, side: T.DoubleSide }); mesh(new T.ConeGeometry(0.17, 0.27, 8, 1, true), glass, 0, 1.01, 0, g).rotation.x = Math.PI; mesh(new T.ConeGeometry(0.17, 0.27, 8, 1, true), glass, 0, 0.75, 0, g);
      const sand = new T.Mesh(new T.ConeGeometry(0.1, 0.12, 6), new T.MeshBasicMaterial({ color: 0xffd36b })); sand.position.y = 0.68; g.add(sand); [0, 2.09, 4.19].forEach(a => mesh(new T.CylinderGeometry(0.012, 0.012, 0.54, 4), gd, Math.cos(a) * 0.18, 0.88, Math.sin(a) * 0.18, g)); return [0, 1.0, 0]; },
    ['Turn it over', () => ui.toast(G.pick(['The sand runs up. Somewhere below the sewers, somebody laughs.', '“Do not TOUCH it, you ape, it is worth more than you.” The voice comes from nowhere in particular.', 'For a moment every clock you have ever heard ticks at once.']))]);
  ui.outlands = function () {
    const st = G.state, tied = st.signed || st.bound, burned = st.burned || [];
    show('<div class="card small"><h2>The Outlands</h2><p class="dim">Everything past the walls of Highmarch, as far as anybody down here has bothered to draw it.</p>' +
      (tied ? '<div class="ab-row"><div class="ab-ic pas">♜</div><div class="ab-tx"><b>Your riders</b><p>Expeditions sent: <b>' + (st.raids || 0) + '</b> · wizard gold held: <b>' + (st.wgold || 0) + '</b> · villages emptied: <b>' + (st.terror || 0) + '</b></p><p>' + (burned.length ? 'Crossed out on the map: ' + burned.join(', ') + '.' : 'Nothing crossed out yet.') + '</p></div></div><div class="ab-row"><div class="ab-ic pas">⚑</div><div class="ab-tx"><b>Heat: ' + (st.heat || 0) + ' of 10</b><p>' + ((st.heat || 0) >= 5 ? 'The Wardens are stopping you on the road, and the stalls are charging for it.' : (st.heat || 0) > 0 ? 'People have started to say your name carefully.' : 'Nobody up there has heard of you.') + (st.grudge ? ' Somebody from ' + st.grudge.place + ' is waiting on the Ledger.' : '') + '</p></div></div>'
        : '<p class="note">Roads, reed-beds, hill pasture, a few dozen villages. None of it is any business of yours. Yet.</p>') +
      '<div class="row end">' + (G.unlocked && G.unlocked('tally') ? '<button id="t">Give orders</button>' : '') + '<button class="big" id="x">Step back</button></div></div>');
    on('#x', () => { ui.close(); ui.topbar(); }); on('#t', () => ui.tally());
  };

  // ------------------------------------------------------------ what the house gives you without being asked
  const der0 = G.derive;
  G.derive = function (h, st) { const d = der0.apply(this, arguments); if (st && st.hero === h && has(st, 'trophies')) d.respectMul += Math.min(0.1, 0.02 * (G.OPPONENTS || []).slice(0, 5).filter(o => st.wins[o.id]).length); return d; };
  if (G.crew) { const tick0 = G.crew.tick; G.crew.tick = function () { const st = G.state, n = (has(st, 'desk') ? 1 : 0) + (has(st, 'maptable') ? 1 : 0), who = n ? (st.tally || []).filter(t => t.job && t.job.id !== 'train') : []; who.forEach(t => { t.skill += n; }); try { return tick0.apply(this, arguments); } finally { who.forEach(t => { t.skill -= n; }); } }; }
  if (G.oracle) { const p0 = G.oracle.price; G.oracle.price = st => Math.round(p0(st) * (has(st, 'shrine') ? 0.75 : 1)); }
  const fs0 = G.fight.start;
  G.fight.start = function (o) { const r = fs0.apply(this, arguments), st = G.state, P = G.fight.P; if (P && !G.fight.ex && !(o && o.spar) && st.rested) { P.d.xpMul *= 1 + st.rested / 100; P.restedUsed = 1; } return r; };
  const res0 = ui.results;
  ui.results = function (r) { const st = G.state, had = st.rested; if (had && r && r.opp && !r.opp.spar) { st.rested = 0; G.save(); } const out = res0.apply(this, arguments);
    if (had && r && r.xp > 0) { const end = document.querySelector('#panel .card.res .row.end'); if (end) { const p = document.createElement('p'); p.className = 'dim'; p.innerHTML = 'Well rested: <b>+' + had + '% XP</b> from this bout.'; end.parentNode.insertBefore(p, end); } } return out; };
  // the line at the top of the screen tells you what the house has ready
  const obj0 = G.objective;
  G.objective = function () { const s = obj0.apply(this, arguments), st = G.state; if (G.scene !== 'hideout' || !st || !st.hero) return s;
    const list = [['bed', 'sleep'], ['dummy', 'train'], ['stove', 'cook'], ['cauldron', 'ladle a potion', 2]].filter(q => has(st, q[0]) && ready(st, q[0], q[2]) && !(q[0] === 'cauldron' && st.potions >= G.POTION_MAX)).map(q => q[1]);
    return list.length ? 'Before your next bout you can still: ' + list.join(', ') : s; };

  // ------------------------------------------------------------ the stalls remember a good customer
  const TIERS = [[3, 'a Regular', 0.9], [8, 'Favoured', 0.8], [15, 'Family', 0.8]], PKEY = { tonic: 'apoth', meal: 'cook' };
  const pat = st => st.patron || (st.patron = {});
  const tierOf = n => { let t = -1; TIERS.forEach((q, i) => { if (n >= q[0]) t = i; }); return t; };
  const freeNow = (st, key) => tierOf(pat(st)[key] || 0) >= 2 && (st.patronFree || {})[key] !== bouts(st);
  G.priceMul = function (k, x) { const st = G.state, key = PKEY[x.slot]; if (!key || !x.cost0) return 1; if (freeNow(st, key)) return 0; const t = tierOf(pat(st)[key] || 0); return t < 0 ? 1 : TIERS[t][2]; };
  let lastKey = null, lastCoin = 0, lastBoon = null;
  const v0 = ui.vendor;
  ui.vendor = function (id) {
    const st = G.state, key = id === 'cook' ? 'cook' : 'apoth', slot = key === 'cook' ? 'meal' : 'tonic', nowBoon = (st.boons || {})[slot];
    if (lastKey === key && nowBoon && nowBoon !== lastBoon && nowBoon !== 'homemeal') { if (freeNow(st, key) && st.coin === lastCoin) (st.patronFree = st.patronFree || {})[key] = bouts(st); pat(st)[key] = (pat(st)[key] || 0) + 1; const t = tierOf(pat(st)[key]); if (t >= 0 && pat(st)[key] === TIERS[t][0]) setTimeout(() => ui.toast(key === 'cook' ? 'Big Hobb nods at you. You are ' + TIERS[t][1] + ' at the pot now.' : 'The apothecary remembers your name. You are ' + TIERS[t][1] + ' here now.'), 500); G.save(); }
    const r = v0.apply(this, arguments);
    lastKey = key; lastCoin = st.coin; lastBoon = (st.boons || {})[slot];
    const p = document.querySelector('#panel .card:not(.locked-card) .mk-top p.dim'), n = pat(st)[key] || 0, t = tierOf(n), nx = TIERS[t + 1];
    if (p) p.insertAdjacentHTML('afterend', '<p class="patron">' + (t < 0 ? 'A stranger here.' : 'You are <b>' + TIERS[t][1] + '</b>: ' + (t >= 2 ? '20% off, and the first one after each bout is on the house.' : Math.round((1 - TIERS[t][2]) * 100) + '% off.')) + (nx ? ' ' + (nx[0] - n) + ' more purchase' + (nx[0] - n === 1 ? '' : 's') + ' to become ' + nx[1] + '.' : '') + '</p>');
    return r;
  };
  const cl0 = ui.close; ui.close = function () { lastKey = null; return cl0.apply(this, arguments); };

  if (G.LORE) G.LORE.push(
    { sec: 'Home', title: 'A House That Works', unlock: st => !!st.homeUsed, body: 'A bed is for sleeping in before a bout, and the better the home around it the more you take from the fight after. A dummy keeps your weapon hand honest. A cauldron left alone for two bouts gives up a potion. A stove feeds you better than you deserve. A desk and a map table make your Tally sharper at whatever you send them to do, and a wall of trophies makes the crowd remember who put them there.' },
    { sec: 'How Things Work', title: 'Regulars', unlock: st => Object.keys(st.patron || {}).length > 0, body: 'The apothecary and Big Hobb both keep count. Three purchases makes you a Regular, and a tenth comes off the price. Eight makes you Favoured, and it is a fifth. Fifteen makes you Family: the first one after every bout is on the house. Heat still puts prices up. They like you; they are not fools.' }
  );
})();
