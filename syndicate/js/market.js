// Guttercrown — the market works for a living: the stalls sell things for the next bout, and the busker and the beggars' fire do something
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const bouts = st => Object.keys(st.wins).reduce((n, k) => n + st.wins[k], 0) + (st.losses || 0);

  // ------------------------------------------------------------ boons: bought now, used up by your next real bout
  // slot = only one of each kind at a time
  const BOONS = {
    ironbark: { slot: 'tonic', name: 'Ironbark Tonic', cost: 30, desc: 'Take 8% less damage in your next bout.', fx: P => { P.d.dr += 0.08; } },
    quickroot: { slot: 'tonic', name: 'Quickroot', cost: 30, desc: 'Move 8% faster in your next bout.', fx: P => { P.d.speed *= 1.08; } },
    redcap: { slot: 'tonic', name: 'Redcap Draught', cost: 40, desc: 'Hit 10% harder in your next bout, at 5% less health.', fx: P => { P.d.dmgMul *= 1.1; P.maxHp = Math.round(P.maxHp * 0.95); P.hp = P.maxHp; } },
    clearhead: { slot: 'tonic', name: 'Clear Head', cost: 35, desc: '25% more posture in your next bout.', fx: P => { P.maxPoise = Math.round(P.maxPoise * 1.25); P.poise = P.maxPoise; } },
    stew: { slot: 'meal', name: 'Hearty Stew', cost: 20, desc: '10% more health in your next bout.', fx: P => { P.maxHp = Math.round(P.maxHp * 1.1); P.hp = P.maxHp; } },
    skewers: { slot: 'meal', name: 'Spiced Skewers', cost: 20, desc: 'Recover stamina 20% faster in your next bout.', fx: P => { P.d.regen *= 1.2; } },
    bread: { slot: 'meal', name: 'Bread and Dripping', cost: 12, desc: 'Potions heal 30% more in your next bout.', fx: P => { P.d.potionMul = (P.d.potionMul || 1) * 1.3; } },
    song: { slot: 'song', name: 'Your Song', cost: 10, desc: 'The crowd already knows your name: start the next bout with them warmed up.', fx: () => { if (G.fight.addHype) G.fight.addHype(25); } }
  };
  const CHARMS = [
    { id: 'ratfoot', name: 'Rat’s Foot', cost: 110, rank: 0, desc: '+3% critical chance.', fx: d => { d.crit += 0.03; } },
    { id: 'button', name: 'Warden’s Button', cost: 140, rank: 1, desc: '+8% respect earned.', fx: d => { d.respectMul += 0.08; } },
    { id: 'bead', name: 'Lamp-Glass Bead', cost: 160, rank: 1, desc: '+10% stamina recovery.', fx: d => { d.regen *= 1.1; } },
    { id: 'knuckle', name: 'Knucklebone of Saint Hob', cost: 180, rank: 2, desc: '+15 posture.', fx: d => { d.poise = (d.poise || 0) + 15; } },
    { id: 'olddie', name: 'Marc’s Old Die', cost: 200, rank: 2, desc: '+10% coin from bouts. He wants it back.', fx: d => { d.coinMul += 0.1; } }
  ];
  G.BOONS = BOONS; G.CHARMS = CHARMS;
  const boons = st => st.boons || (st.boons = {});
  G.boonList = st => Object.keys(boons(st)).map(k => k === 'scout' ? 'Scouted ' + ((G.OPPONENTS.find(o => o.id === boons(st).scout) || {}).name || '') : (BOONS[boons(st)[k]] || {}).name).filter(Boolean);
  const derive0 = G.derive;
  G.derive = function (h, st) { const d = derive0.apply(this, arguments); if (st && st.charm) { const c = CHARMS.find(q => q.id === st.charm); if (c) c.fx(d); } return d; };
  const start0 = G.fight.start;
  G.fight.start = function (o) {
    const r = start0.apply(this, arguments), st = G.state, P = G.fight.P; if (!P || G.fight.ex || (o && o.spar)) return r;
    const b = boons(st), used = [];
    ['tonic', 'meal', 'song'].forEach(s => { const x = BOONS[b[s]]; if (x) { x.fx(P); used.push(x.name); } });
    if (b.scout && o && b.scout === o.id) { P.d.dmgMul *= 1.1; used.push('Scouted'); }
    if (used.length) { ui.toast('Going in with: ' + used.join(', ') + '.'); st.boons = b.scout && !(o && b.scout === o.id) ? { scout: b.scout } : {}; G.save(); }
    return r;
  };

  // ------------------------------------------------------------ the stallholders
  const VEND = {
    apoth: { name: 'Ysolde Quill, Apothecary', say: 'Everything here is safe. I have tested it on people who owed the Guild.', look: { cls: 'cleric', race: 'dwarf', tint: { cloth: '#3a3038', armor: '#4a4048' } }, slot: 'tonic', stock: ['ironbark', 'quickroot', 'redcap', 'clearhead'], note: 'One tonic at a time. It is used up by your next bout.' },
    cook: { name: 'Big Hobb’s Pot', say: 'It is stew. Do not ask what kind. It is the kind that is in the pot.', look: { cls: 'rogue', race: 'halforc', tint: { cloth: '#6a3a1a', armor: '#4a3a30' } }, slot: 'meal', stock: ['stew', 'skewers', 'bread'], note: 'One meal at a time. Nobody fights well on two dinners.' }
  };
  const purse = st => 'You have <b>' + st.coin + '</b> coin.';
  ui.vendor = function (id, line) {
    const st = G.state, v = VEND[id], b = boons(st);
    show('<div class="card small"><h2>' + v.name + '</h2><div class="mk-top"><span id="vp"></span><div><p class="quote">“' + (line || v.say) + '”</p><p class="dim">' + purse(st) + ' ' + v.note + '</p></div></div>' +
      v.stock.map(k => { const x = BOONS[k], have = b[v.slot] === k; return '<div class="ab-row' + (have ? ' deeddone' : '') + '"><div class="ab-ic pas">' + (v.slot === 'tonic' ? '⚗' : '♨') + '</div><div class="ab-tx"><b>' + x.name + '</b><p>' + x.desc + '</p></div>' + (have ? '<span class="lock">Ready</span>' : '<button class="big" data-boon="' + k + '"' + (st.coin < x.cost ? ' disabled' : '') + '>' + x.cost + ' coin</button>') + '</div>'; }).join('') +
      '<div class="row end"><button class="big" id="x">Step away</button></div></div>');
    document.getElementById('vp').appendChild(G.portrait(v.look, 92));
    on('#x', () => { ui.close(); ui.topbar(); });
    on('[data-boon]', el => { const x = BOONS[el.dataset.boon]; if (st.coin < x.cost) return; st.coin -= x.cost; b[v.slot] = el.dataset.boon; G.save(); G.sfx('coin'); ui.topbar(); ui.vendor(id, v.slot === 'tonic' ? 'Drink it at the gate, not before. It does not last.' : 'Eat it while it is hot. Or at all.'); });
  };
  ui.charms = function (line) {
    const st = G.state, rk = G.rankOf(st.respect); st.charms = st.charms || {};
    show('<div class="card small"><h2>Maelis Vane, Charms</h2><div class="mk-top"><span id="vp"></span><div><p class="quote">“' + (line || 'Luck is a trade like any other. I only sell the kind that works.') + '”</p><p class="dim">' + purse(st) + ' You can own them all, but only one works at a time.</p></div></div>' +
      CHARMS.map(c => { const own = st.charms[c.id], worn = st.charm === c.id, locked = !own && rk < c.rank; return '<div class="ab-row' + (worn ? ' deeddone' : locked ? ' lockedrow' : '') + '"><div class="ab-ic pas">✧</div><div class="ab-tx"><b>' + c.name + '</b><p>' + c.desc + '</p></div>' + (worn ? '<span class="lock">Worn</span>' : own ? '<button class="big" data-wear="' + c.id + '">Wear</button>' : locked ? '<span class="lock">' + G.RANKS[c.rank].name + '</span>' : '<button class="big" data-charm="' + c.id + '"' + (st.coin < c.cost ? ' disabled' : '') + '>' + c.cost + ' coin</button>') + '</div>'; }).join('') +
      '<div class="row end"><button class="big" id="x">Step away</button></div></div>');
    document.getElementById('vp').appendChild(G.portrait({ cls: 'sorcerer', race: 'human', tint: { cloth: '#1a4a6a', armor: '#203a50', hair: '#2a2a2a' } }, 92));
    on('#x', () => { ui.close(); ui.topbar(); });
    on('[data-wear]', el => { st.charm = el.dataset.wear; G.save(); G.sfx('place'); ui.charms('It likes you. Do not tell the others.'); });
    on('[data-charm]', el => { const c = CHARMS.find(q => q.id === el.dataset.charm); if (st.coin < c.cost) return; st.coin -= c.cost; st.charms[c.id] = 1; st.charm = c.id; G.save(); G.sfx('coin'); ui.topbar(); ui.charms('Wear it against the skin. Not that skin.'); });
  };
  const WEAK = { rogue: 'Fast and frail. Block the flurry and answer with something heavy.', cleric: 'Slow hands. Stay on them so they cannot stop to heal.', sorcerer: 'Close the distance behind a raised guard. Up close, their bolts come slow and weak.', fighter: 'You will not out-trade them. Bait the heavy swing, step round it, and hit the back.' };
  const GOSSIP = ['They say the Queen has never once been seen to blink either.', 'Marc owes money on three levels and is owed it on four.', 'The Ledger-Keeper writes left-handed on the first of the month. Nobody knows why.', 'Ferren Voss sleeps in the pit sand. He says it is training.', 'A Warden was seen buying stew from Big Hobb. In a hood. Twice.', 'Brakk Ironjaw still salutes the Stair when he thinks nobody is looking.'];
  ui.whisper = function () {
    const st = G.state, b = boons(st), next = G.OPPONENTS.find(o => !st.wins[o.id]) || G.OPPONENTS[G.OPPONENTS.length - 1], scouted = b.scout === next.id;
    const arm = G.ARM_BY && next.arm && G.ARM_BY[next.arm] ? G.ARM_BY[next.arm].name : G.ABILITIES[G.CLASSES[next.cls].basic].name;
    show('<div class="card small"><h2>Whisper</h2><div class="mk-top"><span id="vp"></span><div><p class="quote">“' + G.pick(GOSSIP) + '”</p><p class="dim">' + purse(st) + ' She sells what she hears, and she hears everything.</p></div></div>' +
      '<div class="ab-row' + (scouted ? ' deeddone' : '') + '"><div class="ab-ic pas">◉</div><div class="ab-tx"><b>Scout ' + next.name + '</b><small>' + G.clsName(next) + ' · level ' + next.level + '</small><p>' + (scouted ? 'Carries: <b>' + arm + '</b>. Knows: ' + next.known.map(id => G.ABILITIES[id].name).join(', ') + '. ' + (WEAK[next.cls] || (G.WEAK2 || {})[next.cls] || '') + ' You hit them 10% harder for knowing it.' : 'What they carry, what they know, and where they are soft. Worth 10% more damage against them.') + '</p></div>' + (scouted ? '<span class="lock">Scouted</span>' : '<button class="big" id="sc"' + (st.coin < 25 ? ' disabled' : '') + '>25 coin</button>') + '</div>' +
      '<div class="row end"><button class="big" id="x">Step away</button></div></div>');
    document.getElementById('vp').appendChild(G.portrait({ cls: 'cleric', race: 'tiefling', tint: { cloth: '#6a1a2a', armor: '#4a2028' } }, 92));
    on('#x', () => { ui.close(); ui.topbar(); });
    on('#sc', () => { if (st.coin < 25) return; st.coin -= 25; b.scout = next.id; G.save(); G.sfx('coin'); ui.topbar(); ui.whisper(); });
  };
  ui.busker = function () {
    const st = G.state, b = boons(st);
    show('<div class="card small"><h2>The Busker</h2><p class="quote">“I do requests. I do your name, if the price is right. It scans better than most.”</p><p class="dim">' + purse(st) + '</p>' +
      '<div class="ab-row' + (b.song ? ' deeddone' : '') + '"><div class="ab-ic pas">♪</div><div class="ab-tx"><b>' + BOONS.song.name + '</b><p>' + BOONS.song.desc + '</p></div>' + (b.song ? '<span class="lock">Playing</span>' : '<button class="big" id="sg"' + (st.coin < 10 ? ' disabled' : '') + '>10 coin</button>') + '</div>' +
      '<div class="row end"><button class="big" id="x">Step away</button></div></div>');
    on('#x', () => { ui.close(); ui.topbar(); }); on('#sg', () => { if (st.coin < 10) return; st.coin -= 10; b.song = 'song'; G.save(); G.sfx('coin'); ui.topbar(); ui.busker(); });
  };
  ui.fireside = function () {
    const st = G.state, n = bouts(st), fresh = st.fireAt !== n; let got = '';
    if (fresh) { st.fireAt = n; const r = Math.random(); if (r < 0.35) { const c = 5 + Math.floor(Math.random() * 11); st.coin += c; got = 'Somebody presses ' + c + ' coin into your hand “for the last one”. They will not say which one.'; } else if (r < 0.5) { st.chits = (st.chits || 0) + 8; got = 'A man gives you eight of Marc’s chits. “No use to me. He barred me.”'; } else { st.respect += 2; got = 'They make room for you without being asked. That is new.'; } G.save(); ui.topbar(); }
    show('<div class="card small letter event"><h2>The Beggars’ Fire</h2><p>' + (fresh ? 'You warm your hands. ' : 'The same faces, the same fire. ') + 'Someone is telling a story: “' + G.pick(GOSSIP.concat(G.TIPS || [])) + '”</p>' + (got ? '<p class="got">' + got + '</p>' : '<p class="dim">Come back after your next bout.</p>') + '<div class="row end"><button class="big" id="x">Move on</button></div></div>');
    on('#x', () => { ui.close(); ui.topbar(); });
  };
  // what you are carrying into the pit, shown before the bout
  const pre0 = ui.prefight;
  ui.prefight = function (o) {
    pre0.apply(this, arguments);
    const st = G.state, l = G.boonList(st).filter(n => !/^Scouted/.test(n) || boons(st).scout === o.id), end = document.querySelector('#panel .card .row.end:last-child'); if (!end) return;
    const p = document.createElement('p'); p.className = 'dim'; p.innerHTML = l.length ? 'Going in with: <b>' + l.join(', ') + '</b>.' : 'Nothing eaten, nothing drunk. The stalls in the market sell an edge for the next bout.'; end.parentNode.insertBefore(p, end);
  };

  // ------------------------------------------------------------ put them on the map
  const hub0 = W.buildHub;
  W.buildHub = function () {
    const h = hub0.apply(this, arguments), s = h.scene;
    const spots = [
      { x: 6.5, z: 13.9, r: 1.3, y: 3.2, label: 'Apothecary', act: 'Buy a tonic', go: () => ui.vendor('apoth'), col: 0xc080ff },
      { x: 11.8, z: 16.1, r: 1.3, y: 3.2, label: 'Big Hobb’s Pot', act: 'Eat', go: () => ui.vendor('cook'), col: 0xffb060 },
      { x: 21.5, z: 15.3, r: 1.3, y: 3.2, label: 'Charms', act: 'Browse charms', go: () => ui.charms(), col: 0x80d0ff },
      { x: 27.3, z: 12.2, r: 1.3, y: 3.2, label: 'Whisper', act: 'Buy a rumour', go: () => ui.whisper(), col: 0xff7a7a },
      { x: 19.5, z: 13.8, r: 1.2, y: 3.0, label: 'Busker', act: 'Request a song', go: () => ui.busker(), col: 0xffd36b },
      { x: 29.2, z: 17.6, r: 1.3, y: 2.6, label: 'Beggars’ Fire', act: 'Warm your hands', go: () => ui.fireside(), col: 0xff8a30, badge: () => G.state.fireAt !== bouts(G.state) }
    ].filter(q => !h.blocked(q.x, q.z));
    spots.forEach(q => { h.spots.push(q); const r = new T.Mesh(new T.RingGeometry(0.5, 0.62, 24), new T.MeshBasicMaterial({ color: q.col, transparent: true, opacity: 0.45, depthWrite: false })); r.rotation.x = -Math.PI / 2; r.position.set(q.x, 0.03, q.z); s.add(r); });
    return h;
  };
  // sorcerers come with their close-range answer now, old saves included
  const hero0 = G.newHero;
  G.newHero = function () { const h = hero0.apply(this, arguments); if (h.cls === 'sorcerer' && !h.known.includes('shocking_grasp')) { h.known.push('shocking_grasp'); if (h.slots) { const i = h.slots.indexOf(null); if (i >= 0) h.slots[i] = 'shocking_grasp'; else if (h.slots.length < 3) h.slots.push('shocking_grasp'); } } return h; };
  const uhub0 = ui.hub;
  ui.hub = function () { const h = G.state.hero; if (h && h.cls === 'sorcerer' && !h.known.includes('shocking_grasp')) { h.known.push('shocking_grasp'); const i = (h.slots || []).indexOf(null); if (i >= 0) h.slots[i] = 'shocking_grasp'; else if (h.slots && h.slots.length < 3) h.slots.push('shocking_grasp'); G.save(); } return uhub0.apply(this, arguments); };
  if (G.LORE) G.LORE.push({ sec: 'The World', title: 'The Stalls', unlock: () => true, body: 'Ysolde Quill mixes tonics that last exactly one bout, and tests them on people who owe the Guild. Big Hobb has had the same pot on the same fire for eleven years. Maelis Vane sells charms and insists only the working kind. And at the red stall, Whisper sells what she hears. The busker by the First Lamp will put your name in a song for ten coin, and the crowd will have heard it by the time you reach the gate.' });
})();
