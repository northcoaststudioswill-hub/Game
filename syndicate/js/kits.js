// Guttercrown — kits (armour sets with real trade-offs), weapon mastery, a fourth weapon per class, and techniques you can pay to learn:
// cantrips, traps and a few answers each class did not have
(function () {
  const G = window.G, A = G.ABILITIES, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const pct = v => (v > 0 ? '+' : '') + Math.round(v * 100) + '%';

  // ------------------------------------------------------------ new techniques
  Object.assign(A, {
    caltrops: { name: 'Caltrops', type: 'aoe', at: 'self', trap: 1, cost: 15, cd: 9, wind: 0.12, rec: 0.15, delay: 0.1, radius: 74, dmg: [1, 6], stat: 'str', slow: [0.55, 3], color: '#b8b0a0', icon: 'burst', desc: 'Scatter iron at your feet. It waits. Whoever walks in takes 1d6 + STR and is slowed 55% for 3s.' },
    war_cry: { name: 'War Cry', type: 'aoe', at: 'self', armor: 1, cost: 25, cd: 11, wind: 0.2, rec: 0.2, radius: 150, dmg: [1, 6], stat: 'str', knock: 260, slow: [0.35, 2.5], pz: 2.4, color: '#ffb060', icon: 'up', desc: 'A shout that hits like a wall: 1d6 + STR around you, a hard shove, and it rattles their posture.' },
    bear_trap: { name: 'Bear Trap', type: 'aoe', at: 'self', trap: 1, cost: 20, cd: 11, wind: 0.14, rec: 0.15, delay: 0.1, radius: 58, dmg: [2, 6], stat: 'dex', stun: 1.4, color: '#c8ccd4', icon: 'burst', desc: 'Set iron jaws where you stand. The first to step in takes 2d6 + DEX and is held for 1.4s.' },
    throwing_knife: { name: 'Throwing Knife', type: 'proj', cost: 8, cd: 1.6, wind: 0.1, rec: 0.12, speed: 860, pr: 7, dmg: [1, 6], stat: 'dex', color: '#d9e2ea', icon: 'arrow', shape: 'knife', desc: 'A cantrip of the trade: one fast knife for 1d6 + DEX. Cheap, quick, always ready.' },
    shocking_grasp: { name: 'Shocking Grasp', type: 'melee', spell: 1, cost: 15, cd: 5, wind: 0.14, rec: 0.2, range: 78, arc: 110, dmg: [2, 8], stat: 'cha', stun: 0.6, knock: 320, color: '#8fc8ff', icon: 'burst', desc: 'For when they get close: 2d8 + CHA, a jolt that stuns, and a long shove away.' },
    glyph: { name: 'Glyph of Warding', type: 'aoe', at: 'self', trap: 1, cost: 30, cd: 12, wind: 0.25, rec: 0.2, delay: 0.1, radius: 92, dmg: [4, 6], stat: 'cha', fire: 1, dot: ['burn', 3, [1, 4]], knock: 180, color: '#ff8a2a', icon: 'burst', desc: 'Scribe a sigil underfoot. When your foe crosses it: 4d6 + CHA, burning, and thrown back.' },
    toll_dead: { name: 'Toll the Dead', type: 'aoe', at: 'target', cost: 14, cd: 3.2, wind: 0.16, rec: 0.18, delay: 0.4, radius: 46, dmg: [1, 12], stat: 'wis', execute: 1, color: '#b8a8e8', icon: 'burst', desc: 'A cantrip: a bell only they can hear. 1d12 + WIS, doubled against a foe below 40% health.' },
    guardian_sigil: { name: 'Guardian Sigil', type: 'aoe', at: 'self', trap: 1, cost: 25, cd: 12, wind: 0.2, rec: 0.2, delay: 0.1, radius: 84, dmg: [3, 8], stat: 'wis', radiant: 1, stun: 0.9, color: '#fff0a0', icon: 'shield', desc: 'Bless the ground you hold. Whoever crosses it takes 3d8 + WIS and is stunned.' }
  });
  G.EXTRA = { fighter: ['caltrops', 'war_cry'], rogue: ['bear_trap', 'throwing_knife'], sorcerer: ['shocking_grasp', 'glyph'], cleric: ['toll_dead', 'guardian_sigil'] };
  const TEACH = { caltrops: [120, 1], war_cry: [220, 2], bear_trap: [160, 1], throwing_knife: [100, 0], shocking_grasp: [120, 0], glyph: [220, 2], toll_dead: [100, 0], guardian_sigil: [200, 2] };
  ui.trainer = function (line) {
    const st = G.state, h = st.hero, C = G.CLASSES[h.cls], rk = G.rankOf(st.respect);
    // the technique you passed over at level 2 can be bought back, alongside the class's extras
    const list = (h.level >= 2 ? C.l2.filter(id => !h.known.includes(id)).map(id => [id, 260, 2]) : []).concat((G.EXTRA[h.cls] || []).map(id => [id].concat(TEACH[id] || [240, 3])));
    show('<div class="card"><h2>Techniques for Hire</h2><p class="dim">The Ledger-Keeper knows who teaches what, and adds a finder’s fee. You have <b>' + st.coin + '</b> coin. Learn as many as you like: you still carry three into the pit.</p>' + (line ? '<p class="rankup">' + line + '</p>' : '') +
      list.map(q => { const ab = A[q[0]], known = h.known.includes(q[0]), locked = rk < q[2]; return '<div class="ab-row' + (locked && !known ? ' lockedrow' : '') + '"><div class="ab-ic">' + G.icon(ab) + '</div><div class="ab-tx"><b>' + ab.name + '</b>' + (ab.trap ? '<span class="tagk">Trap</span>' : ab.cd <= 3.5 ? '<span class="tagk">Cantrip</span>' : '') + '<small>' + (ab.cost || 0) + ' ' + C.res + ' · ' + ab.cd + 's cooldown</small><p>' + ab.desc + '</p></div>' + (known ? '<span class="lock">Known</span>' : locked ? '<span class="lock">' + G.RANKS[q[2]].name + '</span>' : '<button class="big" data-learn="' + q[0] + ':' + q[1] + '"' + (st.coin < q[1] ? ' disabled' : '') + '>' + q[1] + ' coin</button>') + '</div>'; }).join('') +
      '<div class="row end"><button class="big" id="b">Back to your sheet</button></div></div>');
    on('#b', () => ui.sheet());
    on('[data-learn]', el => { const p = el.dataset.learn.split(':'), cost = +p[1]; if (st.coin < cost || h.known.includes(p[0])) return; st.coin -= cost; h.known.push(p[0]); const free = h.slots.indexOf(null); if (free >= 0) h.slots[free] = p[0]; else if (h.slots.length < 3) h.slots.push(p[0]); G.save(); G.sfx('level'); ui.topbar(); ui.trainer('Learned: ' + A[p[0]].name + '. Set it to a slot on your sheet.'); });
  };

  // ------------------------------------------------------------ a fourth weapon for each class, earned by mastering another
  const W4 = (id, cls, name, model, base, o, blurb) => { A[id] = Object.assign({}, A[base], o, { name, basic: 1, _tempo: 0 }); G.ARMS.push({ id, cls, name, model, cost: 0, rank: 0, mast: 3, blurb }); };
  // (bases are already at the slow tempo, so these numbers are final)
  W4('f_halberd', 'fighter', 'Stairguard Halberd', 'halberd', 'f_basic', { range: 110, arc: 86, wind: A.f_basic.wind * 1.3, rec: A.f_basic.rec * 1.25, cost: 13, dmg: [1, 10], pz: 1.5 }, 'A Seal-Warden’s polearm. Enormous reach, and slow to bring back.');
  W4('r_chain', 'rogue', 'Weighted Chain', 'chain', 'r_basic', { range: 122, arc: 34, wind: A.r_basic.wind * 1.5, rec: A.r_basic.rec * 1.5, cost: 8, dmg: [1, 6], pz: 1.5, slow: [0.2, 0.8] }, 'A lead weight on four yards of chain. Hits from where they cannot reach you.');
  W4('s_acid', 'sorcerer', 'Acid Splash', 'acid', 's_basic', { speed: 600, dmg: [1, 6], fire: 0, dot: ['poison', 3, [1, 4]], color: '#9be35a' }, 'A cantrip that keeps eating after it lands.');
  W4('c_staff', 'cleric', 'Pilgrim’s Staff', 'staff', 'c_basic', { range: 94, arc: 124, wind: A.c_basic.wind * 0.82, rec: A.c_basic.rec * 0.85, cost: 8, dmg: [1, 6] }, 'Longer and quicker than a mace, and lighter for it.');
  const HEAVY = { fighter: 'Overhead Cleave', rogue: 'Gutting Thrust', sorcerer: 'Charged Bolt', cleric: 'Judgement Swing' };
  G.ARMS.forEach(w => { G.ARM_BY[w.id] = w; const b = A[w.id]; if (A[w.id + '_h']) return; b.pow = w.cls === 'sorcerer' ? 1.32 : 1.2;
    b.desc = (b.type === 'melee' ? 'Tap to strike' : 'Tap to loose') + ' for ' + b.dmg[0] + 'd' + b.dmg[1] + ' + ' + b.stat.toUpperCase() + '. Costs ' + b.cost + ', refunded on a hit. Hold, then release, for a heavy blow.';
    A[w.id + '_h'] = Object.assign({}, b, { basic: 0, heavy: 1, armor: 1, name: HEAVY[w.cls], wind: +(b.wind * 2.1).toFixed(3), rec: +(b.rec * 1.5).toFixed(3), cost: b.cost * 2, pow: 2.5, knock: 230, gain: 6, lunge: b.type === 'melee' ? 46 : 0, speed: b.speed ? b.speed * 1.15 : undefined, pr: b.pr ? b.pr * 1.6 : undefined }); });
  Object.keys(A).forEach(k => A[k].id = k);                 // clones must answer to their own names
  // the regulars have learned a few of these too
  { const more = { kessa: ['glyph'], brakk: ['war_cry'], vexa: ['throwing_knife'] }; G.OPPONENTS.forEach(o => { if (more[o.id]) o.known = o.known.concat(more[o.id]); }); }

  // ------------------------------------------------------------ mastery: a weapon gets better in the hand that keeps using it
  const STEPS = [0, 40, 110, 220, 380], NAMES = ['Unfamiliar', 'Handy', 'Practised', 'Deadly', 'Master'];
  G.mastery = { xp: (st, id) => (st.mastery || {})[id] || 0, level: (st, id) => { const x = G.mastery.xp(st, id); let l = 1; for (let i = 1; i < STEPS.length; i++) if (x >= STEPS[i]) l = i + 1; return l; }, best: st => Math.max.apply(null, [1].concat(Object.keys(st.mastery || {}).map(id => G.mastery.level(st, id)))), STEPS, NAMES };
  const owned0 = G.armOwned;
  G.armOwned = (st, w) => w.mast ? (!!(st.arms || {})[w.id] || G.mastery.best(st) >= w.mast) : owned0(st, w);

  // ------------------------------------------------------------ kits: what you wear changes how you fight
  const K = (id, name, cost, rank, mods, tint, vis, desc) => ({ id, name, cost, rank, mods, tint, vis, desc });
  G.KITS = [
    K('issue', 'Guild Issue', 0, 0, {}, null, 0, 'What they handed you. It fits nobody.'),
    K('rags', 'Beggar’s Rags', 40, 0, { hp: -0.12, coin: 0.25, respect: 0.25 }, { armor: '#5a4a3a', armor2: '#3a3026', cloth: '#6a5a44', trim: '#8a7a5a', legs: '#3a3228' }, 0, 'Almost nothing between you and the blade. The crowd pays extra to watch you risk it.'),
    K('leathers', 'Pit Leathers', 120, 1, { speed: 0.06, regen: 0.12 }, { armor: '#6a4428', armor2: '#3e2816', cloth: '#8a5a30', trim: '#c8a060', legs: '#3a2a1c' }, 0, 'Boiled leather cut for moving in. Quicker feet and deeper lungs.'),
    K('silks', 'Duellist’s Silks', 180, 2, { speed: 0.1, parry: 0.04, hp: -0.08 }, { armor: '#5a1430', armor2: '#2a0a18', cloth: '#8a1c44', trim: '#e8d8b0', legs: '#1a1018' }, 0, 'Highmarch fencing silks, smuggled down. Fast, and a wider parry, but it will not stop a thing.'),
    K('wraps', 'Penitent’s Wraps', 200, 2, { regen: 0.25, heal: 0.15, hp: 0.05 }, { armor: '#d8ccb0', armor2: '#a89878', cloth: '#efe6cc', trim: '#8a1c1c', legs: '#6a5e48' }, 0, 'Linen wound tight by the Sunless Chapel. You tire slower and mend better.'),
    K('chain', 'Chain Hauberk', 200, 2, { dr: 0.06, poise: 15 }, { armor: '#8a909c', armor2: '#5a606c', cloth: '#3a3a44', trim: '#c8ccd4', legs: '#44464e' }, 1, 'Riveted mail. Takes the edge off every blow and steadies your footing.'),
    K('plate', 'Guild Plate', 320, 3, { dr: 0.12, poise: 30, speed: -0.06 }, { armor: '#3a3640', armor2: '#201c26', cloth: '#5a1f7a', trim: '#f0c95a', legs: '#26222c' }, 2, 'Black plate with the Guild’s gold at the edges. Very hard to hurt, very hard to move.'),
    K('warden', 'Warden’s Harness', 420, 4, { dr: 0.08, poise: 20, parry: 0.03 }, { armor: '#e8e4f0', armor2: '#b0b8cc', cloth: '#f4f0ff', trim: '#f0c95a', legs: '#9aa0b4' }, 2, 'White plate off a Seal-Warden who no longer needs it. Do not wear it near the Stair.')
  ];
  G.KIT_BY = {}; G.KITS.forEach(k => G.KIT_BY[k.id] = k);
  G.kitOf = st => G.KIT_BY[st && st.kit] || G.KITS[0];
  const MODTXT = { hp: 'health', speed: 'speed', regen: 'stamina recovery', dr: 'damage taken', parry: 'parry window', poise: 'posture', heal: 'healing', coin: 'coin earned', respect: 'respect earned' };
  const modLine = m => Object.keys(m).map(k => k === 'dr' ? '−' + Math.round(m[k] * 100) + '% damage taken' : k === 'poise' ? '+' + m[k] + ' posture' : k === 'parry' ? '+' + Math.round(m[k] * 1000) + ' ms parry' : pct(m[k]) + ' ' + MODTXT[k]).join(' · ') || 'No effect';
  // fold the kit into the numbers and the look
  const derive0 = G.derive;
  G.derive = function (h, st) { const d = derive0.apply(this, arguments); if (st) { const m = G.kitOf(st).mods; if (m.hp) d.maxHp *= 1 + m.hp; if (m.speed) d.speed *= 1 + m.speed; if (m.regen) d.regen *= 1 + m.regen; if (m.dr) d.dr += m.dr; if (m.parry) d.parry = (d.parry || 0) + m.parry; if (m.heal) d.healMul += m.heal; if (m.coin) d.coinMul += m.coin; if (m.respect) d.respectMul += m.respect; d.poise = m.poise || 0; d.maxHp = Math.round(d.maxHp); } return d; };
  const look0 = G.lookOf;
  G.lookOf = function (h, st) { const l = look0.apply(this, arguments); if (st) { const k = G.kitOf(st); if (k.tint) l.tint = Object.assign({}, k.tint, l.tint); if (k.vis) l.gear = { weapon: (l.gear || {}).weapon || 0, armor: Math.max((l.gear || {}).armor || 0, k.vis) }; } return l; };
  ui.outfitter = function (sel) {
    const st = G.state, rk = G.rankOf(st.respect), cur = G.kitOf(st).id; st.kits = st.kits || { issue: 1 };
    const pick = G.KIT_BY[sel] || G.KIT_BY[cur];
    const card = k => { const own = st.kits[k.id], locked = !own && rk < k.rank; return '<button class="arm' + (k.id === pick.id ? ' sel' : '') + (locked ? ' lk' : '') + '" data-kit="' + k.id + '"><span class="arm-pic" id="kp_' + k.id + '"></span><b>' + k.name + '</b><small>' + (k.id === cur ? 'Worn' : own ? 'Owned' : locked ? G.RANKS[k.rank].name : k.cost + ' coin') + '</small></button>'; };
    const own = st.kits[pick.id], locked = !own && rk < pick.rank;
    show('<div class="card"><h2>The Outfitter</h2><p class="dim">A kit is a trade. Nothing here is simply better. You have <b>' + st.coin + '</b> coin.</p><div class="arms">' + G.KITS.map(card).join('') + '</div>' +
      '<div class="arm-detail"><div><b class="cp-name">' + pick.name + '</b><p class="cp-desc">' + pick.desc + '</p></div><div><p class="kitmods">' + modLine(pick.mods) + '</p><p class="dim">Dyes from the Tailor still go over the top.</p></div></div>' +
      '<div class="row end"><button id="b">Back to the Fence</button>' + (pick.id === cur ? '<span class="lock">Worn</span>' : own ? '<button class="big" id="eq">Wear it</button>' : locked ? '<span class="lock">Needs ' + G.RANKS[pick.rank].name + '</span>' : '<button class="big" id="buy"' + (st.coin < pick.cost ? ' disabled' : '') + '>Buy · ' + pick.cost + ' coin</button>') + '</div></div>');
    G.KITS.forEach(k => { const el = document.getElementById('kp_' + k.id); if (!el) return; const l = look0(st.hero, st); if (k.tint) l.tint = Object.assign({}, k.tint, l.tint); l.gear = { weapon: (l.gear || {}).weapon || 0, armor: Math.max((l.gear || {}).armor || 0, k.vis || 0) }; l.cos = Object.assign({}, l.cos, { dye: null }); el.appendChild(G.portrait(l, 84, 'full')); });
    const refresh = () => { G.save(); ui.topbar(); const wk = G.world.walker; wk.key = ''; if (G.scene === 'hub') G.world.enter('hub', { x: wk.x, z: wk.z }); };
    on('#b', () => ui.shop()); on('[data-kit]', el => { G.sfx('ui'); ui.outfitter(el.dataset.kit); });
    on('#eq', () => { st.kit = pick.id; G.sfx('place'); refresh(); ui.outfitter(pick.id); });
    on('#buy', () => { if (st.coin < pick.cost) return; st.coin -= pick.cost; st.kits[pick.id] = 1; st.kit = pick.id; G.sfx('coin'); refresh(); ui.outfitter(pick.id); });
  };

  // ------------------------------------------------------------ doors: the Fence sells kits, the sheet sells lessons, the armoury shows mastery
  const shop0 = ui.shop;
  ui.shop = function () {
    shop0.apply(this, arguments);
    const st = G.state, rows = document.querySelectorAll('#panel .ab-row'); if (!rows.length) return;
    const row = document.createElement('div'); row.className = 'ab-row';
    row.innerHTML = '<div class="ab-ic pas">⛨</div><div class="ab-tx"><b>The Outfitter</b><small>Wearing: ' + G.kitOf(st).name + '</small><p>Armour sets with real trade-offs: fast and thin, slow and sure. ' + Object.keys(st.kits || { issue: 1 }).length + ' of ' + G.KITS.length + ' owned.</p></div><button class="big">Browse</button>';
    row.querySelector('button').onclick = () => { G.sfx('ui'); ui.outfitter(); }; rows[0].parentNode.insertBefore(row, rows[1] || null);
  };
  const sheet0 = ui.sheet;
  ui.sheet = function () {
    sheet0.apply(this, arguments);
    const ft = document.querySelector('#panel .card .row.end:last-child'); if (!ft) return;
    const b = document.createElement('button'); b.textContent = 'Learn techniques'; b.onclick = () => { G.sfx('ui'); ui.trainer(); }; ft.insertBefore(b, ft.firstChild);
  };
  const arm0 = ui.armory;
  ui.armory = function (sel) {
    arm0.apply(this, arguments);
    const st = G.state, id = sel || G.armOf(st.hero), lv = G.mastery.level(st, id), x = G.mastery.xp(st, id), d = document.querySelector('#panel .arm-detail > div'); if (!d) return;
    const nx = STEPS[lv] || null, p = document.createElement('div'); p.className = 'mast';
    p.innerHTML = '<small>Mastery ' + lv + ' of 5 · ' + NAMES[lv - 1] + '</small><div class="bar xp"><i style="width:' + (nx ? (x - STEPS[lv - 1]) / (nx - STEPS[lv - 1]) * 100 : 100) + '%"></i></div><small>' + (lv > 1 ? '+' + (lv - 1) * 3 + '% damage with it. ' : '') + (nx ? (nx - x) + ' more to the next rank. Use it in the pit.' : 'Nothing left to learn.') + '</small>' + (G.ARM_BY[id] && G.ARM_BY[id].mast && !G.armOwned(st, G.ARM_BY[id]) ? '<small class="need">Unlocks when any weapon reaches mastery ' + G.ARM_BY[id].mast + '.</small>' : '');
    d.appendChild(p);
    const lk = document.querySelector('#panel .row.end .lock'); if (lk && /^Deed: $/.test(lk.textContent)) lk.textContent = 'Needs mastery ' + ((G.ARM_BY[id] || {}).mast || 3);
  };
  // the pit teaches: mastery after every bout, and the kit and mastery ride into the fight
  const start0 = G.fight.start;
  G.fight.start = function (o) { const r = start0.apply(this, arguments), P = G.fight.P; if (P && !G.fight.ex) P.mast = G.mastery.level(G.state, P.basic) - 1; return r; };
  const res0 = ui.results;
  ui.results = function (r) {
    const st = G.state, id = G.armOf(st.hero), l0 = G.mastery.level(st, id), gain = r.forfeit ? 0 : r.win ? 30 : 14;
    st.mastery = st.mastery || {}; st.mastery[id] = (st.mastery[id] || 0) + gain; const l1 = G.mastery.level(st, id); G.save();
    res0.apply(this, arguments);
    const end = document.querySelector('#panel .card.res .row.end'); if (!end || !gain) return;
    const p = document.createElement('p'); p.className = l1 > l0 ? 'rankup' : 'dim'; p.innerHTML = l1 > l0 ? G.ARM_BY[id].name + ' mastery: <b>' + NAMES[l1 - 1] + '</b> (rank ' + l1 + '). +' + (l1 - 1) * 3 + '% damage with it.' + (l1 === 3 ? ' A new weapon is waiting at the Armoury.' : '') : G.ARM_BY[id].name + ' mastery +' + gain + '.'; end.parentNode.insertBefore(p, end);
  };
})();
