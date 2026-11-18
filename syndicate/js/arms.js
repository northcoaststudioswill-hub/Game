// Guttercrown — arms: the slower, heavier tempo of the pit, charged heavy blows, and the weapons you can carry into it
(function () {
  const G = window.G, A = G.ABILITIES, ui = G.ui;
  const show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);

  // ------------------------------------------------------------ weapons (each is its own basic attack)
  // pz = how hard it hits posture. Costs and timings here are written at the old tempo and slowed with everything else below.
  const W = (id, cls, name, model, cost, rank, deed, base, o, blurb) => { A[id] = Object.assign({}, A[base], o, { name, basic: 1 }); return { id, cls, name, model, cost, rank, deed, blurb }; };
  G.ARMS = [
    { id: 'f_basic', cls: 'fighter', name: 'Longsword', model: 'sword', cost: 0, rank: 0, blurb: 'Sword and shield. Nothing it does badly.' },
    W('f_spear', 'fighter', 'Pit Spear', 'spear', 140, 1, null, 'f_basic', { range: 100, arc: 44, wind: 0.15, lunge: 18, dmg: [1, 8] }, 'Long reach, narrow thrust. Keeps them where you want them.'),
    W('f_axe', 'fighter', 'Greataxe', 'axe', 220, 2, null, 'f_basic', { range: 76, arc: 140, wind: 0.22, rec: 0.26, cost: 8, dmg: [1, 12], pz: 1.4 }, 'Two hands, no shield. Slow, wide and ruinous.'),
    W('f_hammer', 'fighter', 'Warhammer', 'hammer', 0, 0, 'breaker', 'f_basic', { range: 64, wind: 0.26, rec: 0.3, cost: 8, dmg: [1, 10], pz: 2.1, knock: 130 }, 'Slowest thing in the pit. Nobody keeps their footing against it.'),
    { id: 'r_basic', cls: 'rogue', name: 'Twin Daggers', model: 'daggers', cost: 0, rank: 0, blurb: 'Fast and close. Death by arithmetic.' },
    W('r_rapier', 'rogue', 'Duellist’s Rapier', 'rapier', 140, 1, null, 'r_basic', { range: 84, arc: 40, wind: 0.11, rec: 0.15, dmg: [1, 6] }, 'A long thin point. Reach without weight.'),
    W('r_axes', 'rogue', 'Hand Axes', 'axes', 0, 0, 'heavy', 'r_basic', { range: 58, arc: 130, wind: 0.13, rec: 0.18, cost: 5, dmg: [1, 6], pz: 1.4 }, 'Two hatchets. Slower than knives and far ruder.'),
    { id: 's_basic', cls: 'sorcerer', name: 'Fire Bolt', model: 'fire', cost: 0, rank: 0, blurb: 'A mote of fire. Reliable.' },
    W('s_frost', 'sorcerer', 'Frost Shard', 'frost', 140, 1, null, 's_basic', { speed: 580, dmg: [1, 6], slow: [0.3, 1.2], fire: 0, color: '#9fe0ff', shape: 'shard' }, 'Slower in the air, but whatever it hits slows down too.'),
    W('s_spark', 'sorcerer', 'Arc Spark', 'spark', 0, 0, 'heavy', 's_basic', { speed: 940, pr: 7, wind: 0.15, rec: 0.18, dmg: [1, 6], fire: 0, color: '#fff070' }, 'Small, quick and very hard to sidestep.'),
    { id: 'c_basic', cls: 'cleric', name: 'Mace', model: 'mace', cost: 0, rank: 0, blurb: 'A blessed weight on a stick.' },
    W('c_flail', 'cleric', 'Penitent’s Flail', 'flail', 140, 1, null, 'c_basic', { range: 82, arc: 150, wind: 0.2, rec: 0.26, dmg: [1, 8] }, 'A wide, wandering arc. Hard to step inside.'),
    W('c_pick', 'cleric', 'War Pick', 'pick', 0, 0, 'breaker', 'c_basic', { range: 62, arc: 80, wind: 0.24, rec: 0.28, cost: 8, dmg: [1, 10], pz: 1.7 }, 'One point, a great deal of conviction behind it.')
  ];
  G.ARM_BY = {}; G.ARMS.forEach(w => G.ARM_BY[w.id] = w);

  // ------------------------------------------------------------ the tempo: fewer, heavier blows, and a charged one
  const HEAVY = { fighter: 'Overhead Cleave', rogue: 'Gutting Thrust', sorcerer: 'Charged Bolt', cleric: 'Judgement Swing' };
  G.ARMS.forEach(w => {
    const b = A[w.id]; if (!b || b._tempo) return; b._tempo = 1;
    b.wind = +(b.wind * 1.45).toFixed(3); b.rec = +(b.rec * 1.3).toFixed(3); b.cost = Math.round(b.cost * 1.6); b.pow = w.cls === 'sorcerer' ? 1.32 : 1.2;
    b.desc = (b.type === 'melee' ? 'Tap to strike' : 'Tap to loose') + ' for ' + b.dmg[0] + 'd' + b.dmg[1] + ' + ' + b.stat.toUpperCase() + '. Costs ' + b.cost + ', refunded on a hit. ' + (b.type === 'melee' ? 'The third blow of a clean combo is a finisher. ' : '') + 'Hold, then release, for a heavy blow.';
    A[w.id + '_h'] = Object.assign({}, b, { basic: 0, heavy: 1, armor: 1, name: HEAVY[w.cls], wind: +(b.wind * 2.1).toFixed(3), rec: +(b.rec * 1.5).toFixed(3), cost: b.cost * 2, pow: 2.5, knock: 230, gain: 6, lunge: b.type === 'melee' ? 46 : 0, speed: b.speed ? b.speed * 1.15 : undefined, pr: b.pr ? b.pr * 1.6 : undefined, pz: (b.pz || 1) });
  });
  G.armOf = h => (h.arm && G.ARM_BY[h.arm] && G.ARM_BY[h.arm].cls === h.cls) ? h.arm : G.CLASSES[h.cls].basic;
  G.armOwned = (st, w) => !w.cost && !w.deed ? true : !!(st.arms || {})[w.id] || (w.deed && (st.deeds || {})[w.deed]);

  // ------------------------------------------------------------ the armoury
  const speedOf = b => b.wind + b.rec, bar = (v, max) => '<span class="sbar"><i style="width:' + Math.max(6, Math.min(100, v / max * 100)) + '%"></i></span>';
  ui.armory = function (sel) {
    const st = G.state, h = st.hero, rk = G.rankOf(st.respect), list = G.ARMS.filter(w => w.cls === h.cls), cur = G.armOf(h); st.arms = st.arms || {};
    const pick = list.find(w => w.id === sel) || list.find(w => w.id === cur);
    const card = w => { const b = A[w.id], own = G.armOwned(st, w), locked = !own && (w.deed ? true : rk < w.rank);
      return '<button class="arm' + (w.id === pick.id ? ' sel' : '') + (locked ? ' lk' : '') + '" data-arm="' + w.id + '"><span class="arm-pic" id="ap_' + w.id + '"></span><b>' + w.name + '</b><small>' + (w.id === cur ? 'Carried' : own ? 'Owned' : w.deed ? 'Deed' : locked ? G.RANKS[w.rank].name : w.cost + ' coin') + '</small></button>'; };
    const b = A[pick.id], hv = A[pick.id + '_h'], own = G.armOwned(st, pick), deed = pick.deed && (G.DEEDS || []).find(d => d.id === pick.deed), locked = !own && !pick.deed && rk < pick.rank;
    show('<div class="card"><h2>The Armoury</h2><p class="dim">What you carry changes how every blow lands. You have <b>' + st.coin + '</b> coin.</p><div class="arms">' + list.map(card).join('') + '</div>' +
      '<div class="arm-detail"><div><b class="cp-name">' + pick.name + '</b><p class="cp-desc">' + pick.blurb + '</p><p class="dim">Heavy blow: <b>' + hv.name + '</b>. Slow to start, cannot be knocked out of, breaks a guard.</p></div><div class="wstats">' +
      '<label>Damage<em>' + b.dmg[0] + 'd' + b.dmg[1] + '</em></label>' + bar(b.dmg[1], 12) + '<label>Speed</label>' + bar(0.95 - speedOf(b), 0.6) + '<label>' + (b.type === 'melee' ? 'Reach' : 'Flight') + '</label>' + bar(b.type === 'melee' ? b.range : b.speed / 9, 105) + (b.type === 'melee' ? '<label>Sweep</label>' + bar(b.arc, 150) : '') + '<label>Posture damage</label>' + bar(b.pz || 1, 2.1) + '</div></div>' +
      '<div class="row end"><button id="b">Back to the Fence</button>' + (pick.id === cur ? '<span class="lock">Carried</span>' : own ? '<button class="big" id="eq">Carry it</button>' : pick.deed ? '<span class="lock">Deed: ' + (deed ? deed.name : '') + '</span>' : locked ? '<span class="lock">Needs ' + G.RANKS[pick.rank].name + '</span>' : '<button class="big" id="buy"' + (st.coin < pick.cost ? ' disabled' : '') + '>Buy · ' + pick.cost + ' coin</button>') + '</div></div>');
    list.forEach(w => { const el = document.getElementById('ap_' + w.id); if (el) el.appendChild(G.portrait(Object.assign({}, G.lookOf(h, st), { arm: w.id }), 84, 'full')); });
    const refresh = () => { G.save(); ui.topbar(); const wk = G.world.walker; wk.key = ''; if (G.scene === 'hub') G.world.enter('hub', { x: wk.x, z: wk.z }); };
    on('#b', () => ui.shop()); on('[data-arm]', el => { G.sfx('ui'); ui.armory(el.dataset.arm); });
    on('#eq', () => { h.arm = pick.id; G.sfx('place'); refresh(); ui.armory(pick.id); });
    on('#buy', () => { if (st.coin < pick.cost) return; st.coin -= pick.cost; st.arms[pick.id] = 1; h.arm = pick.id; G.sfx('coin'); refresh(); ui.armory(pick.id); });
  };
  // a door into it from the Fence
  const shop0 = ui.shop;
  ui.shop = function () {
    shop0.apply(this, arguments);
    const st = G.state, first = document.querySelector('#panel .ab-row'); if (!first) return;
    const row = document.createElement('div'); row.className = 'ab-row'; const n = G.ARMS.filter(w => w.cls === st.hero.cls);
    row.innerHTML = '<div class="ab-ic pas">⚔</div><div class="ab-tx"><b>The Armoury</b><small>Carrying: ' + G.ARM_BY[G.armOf(st.hero)].name + '</small><p>Weapons change your reach, speed and how hard you hit posture. ' + n.filter(w => G.armOwned(st, w)).length + ' of ' + n.length + ' owned.</p></div><button class="big">Browse</button>';
    row.querySelector('button').onclick = () => { G.sfx('ui'); ui.armory(); }; first.parentNode.insertBefore(row, first);
  };
  // the first time into the pit, say how the new tempo works
  const start0 = G.fight.start;
  G.fight.start = function (o) { const r = start0.apply(this, arguments); if (o && !o.spar && !Object.keys(G.state.wins).length) ui.toast(G.input.touch ? 'Tap Attack to strike. Hold it, then let go, for a heavy blow. Hold Parry to block.' : 'Click to strike. Hold, then release, for a heavy blow. Hold parry (Shift or right mouse) to block.'); return r; };
  if (G.TIPS) G.TIPS.push('Tap to strike, hold and release for a heavy blow. Heavy blows cannot be knocked out of and break a guard.', 'Hold parry to keep blocking after the parry window. Blocking costs stamina; a heavy blow goes straight through it.', 'Break their posture and they reel, wide open. Heavy blows and parries break it fastest.', 'Stamina is the whole fight. Swing at air and you will be winded when it matters.');
})();
