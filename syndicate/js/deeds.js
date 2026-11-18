// Guttercrown — more mortal blows, deeds that unlock cosmetics, and the mirror (hair, skin, build, name)
(function () {
  const G = window.G, ui = G.ui, $ = id => document.getElementById(id);
  const show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // ------------------------------------------------------------ mortal blows: three per class, earned by rank
  const B = G.MORTAL;
  G.MORTALS = {
    fighter: [
      Object.assign({ id: 'verdict', rank: 0 }, B.fighter),
      { id: 'wall', rank: 1, name: 'Through the Wall', word: 'FLATTENED', desc: 'One blow sends them the length of the pit. The second arrives before they stop sliding.' },
      { id: 'quake', rank: 3, name: 'Earthbreaker', word: 'BURIED', desc: 'Three strikes that split the floor, and a fourth that drops them into it.', crack: 1 }
    ],
    rogue: [
      Object.assign({ id: 'cuts', rank: 0 }, B.rogue),
      { id: 'quiet', rank: 1, name: 'The Quiet Word', word: 'SILENCED', desc: 'You are in front of them. Then you are not. One thrust, a long pause, and it is over.', imp: 1.5 },
      { id: 'rain', rank: 3, name: 'Rain of Knives', word: 'PINNED', desc: 'Every blade you own, from every direction at once.' }
    ],
    sorcerer: [
      Object.assign({ id: 'disint', rank: 0, ash: 1 }, B.sorcerer),
      { id: 'meteor', rank: 1, name: 'Meteor Swarm', word: 'CRATERED', desc: 'Four burning stones, called down one after another onto the same unlucky spot.', col: '#ff8a2a', fire: 1, imp: 1.4 },
      { id: 'storm', rank: 3, name: 'Chain Lightning', word: 'GROUNDED', desc: 'Every bolt in the vault finds the same body.', col: '#9fd8ff', ash: 1 }
    ],
    cleric: [
      Object.assign({ id: 'strike', rank: 0, pillar: 1 }, B.cleric),
      { id: 'smite', rank: 1, name: 'Banishing Smite', word: 'BANISHED', desc: 'Three rings of light close in, and the mace sends what is left somewhere else.', pillar: 1, cast: false },
      { id: 'word', rank: 3, name: 'Power Word Kill', word: 'UNSPOKEN', desc: 'A single word. Nobody in the stands hears it. Everybody sees what it does.', col: '#e8d8ff', ash: 1, imp: 1.5 }
    ]
  };
  G.mortalsOpen = st => G.MORTALS[st.hero.cls].filter(m => m.rank <= G.rankOf(st.respect));
  G.mortalOf = st => { const open = G.mortalsOpen(st), pref = open.find(m => m.id === st.hero.mortal); return pref || open[Math.floor(Math.random() * open.length)]; };
  ui.finishers = function () {
    const st = G.state, h = st.hero, rk = G.rankOf(st.respect), list = G.MORTALS[h.cls];
    show('<div class="card small"><h2>Mortal Blows</h2><p class="dim">How a won bout ends. New ones are taught as your rank rises. Leave it to the crowd and you will use a different one each time.</p>' +
      '<div class="ab-row"><div class="ab-ic pas">☠</div><div class="ab-tx"><b>Crowd’s Choice</b><p>Any blow you know, picked on the night.</p></div>' + (!h.mortal ? '<span class="lock">Chosen</span>' : '<button class="big" data-m="">Choose</button>') + '</div>' +
      list.map(m => { const open = m.rank <= rk; return '<div class="ab-row' + (open ? '' : ' lockedrow') + '"><div class="ab-ic pas">☠</div><div class="ab-tx"><b>' + m.name + '</b><span class="tagr r-Finisher">' + m.word + '</span><p>' + m.desc + '</p></div>' + (!open ? '<span class="lock">' + G.RANKS[m.rank].name + '</span>' : h.mortal === m.id ? '<span class="lock">Chosen</span>' : '<button class="big" data-m="' + m.id + '">Choose</button>') + '</div>'; }).join('') +
      '<div class="row end"><button class="big" id="b">Back</button></div></div>');
    on('#b', () => ui.sheet()); on('[data-m]', el => { h.mortal = el.dataset.m || null; G.save(); G.sfx('place'); ui.finishers(); });
  };

  // ------------------------------------------------------------ deeds: things you did in the pit, and what they earned you
  const stat = (st, k) => (st.stats || {})[k] || 0;
  G.DEEDS = [
    { id: 'first', name: 'First Blood', desc: 'Win a bout in the Blood Pit.', goal: 1, cur: st => Object.keys(st.wins).length ? 1 : 0, reward: 'bloodied' },
    { id: 'deflect', name: 'Deflector', desc: 'Parry 25 attacks.', goal: 25, cur: st => stat(st, 'parry'), reward: 'mirror' },
    { id: 'ghost', name: 'Not There', desc: 'Land 12 perfect dodges.', goal: 12, cur: st => stat(st, 'perfect'), reward: 'afterimage' },
    { id: 'exec', name: 'Executioner', desc: 'Deliver 8 mortal blows.', goal: 8, cur: st => stat(st, 'mortal'), reward: 'exechood' },
    { id: 'wall', name: 'Mason', desc: 'Slam opponents into the wall 8 times.', goal: 8, cur: st => stat(st, 'wall'), reward: 'masonry' },
    { id: 'clean', name: 'Untouched', desc: 'Win a bout without losing any health.', goal: 1, cur: st => stat(st, 'flawless'), reward: 'saintly' },
    { id: 'crowd', name: 'Crowd Favourite', desc: 'End 3 bouts with the crowd at full roar.', goal: 3, cur: st => stat(st, 'hype100'), reward: 'pennants' },
    { id: 'partner', name: 'Silent Partner', desc: 'See 3 of Mark’s schemes through to the end.', goal: 3, cur: st => stat(st, 'schemes'), reward: 'luckyedge' },
    { id: 'home', name: 'House Proud', desc: 'Raise your hideout’s comfort to 40.', goal: 40, cur: st => G.comfort ? G.comfort(st) : 0, reward: 'hearth' },
    { id: 'breaker', name: 'Posture Breaker', desc: 'Break an opponent’s posture 10 times.', goal: 10, cur: st => stat(st, 'break'), reward: 'obsidian', also: 'a class weapon at the Armoury' },
    { id: 'heavy', name: 'Heavy Hand', desc: 'Land 20 heavy blows.', goal: 20, cur: st => stat(st, 'heavy'), reward: 'bronze', also: 'a class weapon at the Armoury' },
    { id: 'wallguard', name: 'Immovable', desc: 'Block 30 blows.', goal: 30, cur: st => stat(st, 'block'), reward: 'steam' },
    { id: 'queen', name: 'The Guttercrown', desc: 'Take the crown from Vexa.', goal: 1, cur: st => st.wins.vexa ? 1 : 0, reward: 'palequeen' }
  ];
  const cosName = id => (G.COSMETICS.find(c => c.id === id) || { name: id }).name;
  G.deeds = {
    bump: (k, n) => { const st = G.state; st.stats = st.stats || {}; st.stats[k] = (st.stats[k] || 0) + (n || 1); },
    // returns the deeds completed since the last check, and hands out their rewards
    check: () => { const st = G.state; if (!st.hero) return []; st.deeds = st.deeds || {}; const got = []; G.DEEDS.forEach(d => { if (!st.deeds[d.id] && d.cur(st) >= d.goal) { st.deeds[d.id] = 1; st.cos.owned[d.reward] = true; got.push(d); } }); if (got.length) G.save(); return got; }
  };
  ui.deeds = function (back) {
    const st = G.state; G.deeds.check(); const done = G.DEEDS.filter(d => st.deeds[d.id]).length;
    show('<div class="card"><h2>Deeds</h2><p class="dim">The pit remembers. Each deed unlocks something to wear that coin cannot buy. <b>' + done + ' of ' + G.DEEDS.length + '</b> done.</p>' +
      G.DEEDS.map(d => { const ok = st.deeds[d.id], cur = Math.min(d.goal, d.cur(st)); return '<div class="ab-row' + (ok ? ' deeddone' : '') + '"><div class="ab-ic pas">' + (ok ? '✔' : '✦') + '</div><div class="ab-tx"><b>' + d.name + '</b><small>' + (ok ? 'Done' : cur + ' / ' + d.goal) + '</small><p>' + d.desc + '</p><div class="bar xp"><i style="width:' + (ok ? 100 : cur / d.goal * 100) + '%"></i></div></div><span class="lock">' + cosName(d.reward) + (d.also ? '<br>+ ' + d.also : '') + '</span></div>'; }).join('') +
      '<div class="row end"><button class="big" id="b">Back</button></div></div>');
    on('#b', () => back ? back() : ui.close());
  };
  // tell the player: on the results card, and as a toast when it happens elsewhere
  const results0 = ui.results;
  ui.results = function (r) {
    results0.apply(this, arguments);
    const got = G.deeds.check(), end = document.querySelector('#panel .card.res .row.end');
    if (got.length && end) got.forEach(d => { const p = document.createElement('p'); p.className = 'rankup'; p.innerHTML = 'Deed done: <b>' + d.name + '</b>. Unlocked ' + cosName(d.reward) + ' at the Tailor.'; end.parentNode.insertBefore(p, end); });
  };
  const hub0 = ui.hub;
  ui.hub = function () { const r = hub0.apply(this, arguments); const got = G.deeds.check(); if (got.length) ui.toast('Deed done: ' + got[0].name + '. ' + cosName(got[0].reward) + ' unlocked.'); return r; };

  // ------------------------------------------------------------ the mirror
  const HAIR = [['Soot', '#1a1618'], ['Chestnut', '#5a3420'], ['Rust', '#a8481c'], ['Straw', '#d8b45a'], ['Ash', '#b8b4b0'], ['Bone', '#efe8d8'], ['Wine', '#7a1c3a'], ['Moss', '#4a7a3a'], ['Lamp Blue', '#3a6aa8'], ['Guild Violet', '#7a3aa8']];
  const SKIN = [['As born', ''], ['Pale', '#e6cdb8'], ['Tan', '#c9977a'], ['Umber', '#8a5a3c'], ['Deep', '#5a3826'], ['Ashen', '#a8a4a0'], ['Moss', '#7f9a62'], ['Ember', '#b5564e'], ['Slate', '#6a7a94']];
  const BUILD = [['Slight', 0.94], ['Average', 1], ['Broad', 1.06]];
  ui.mirror = function (back) {
    const st = G.state, h = st.hero, tint = h.tint || {}, sw = (list, cur, key) => '<div class="swatches">' + list.map(q => '<button class="sw' + ((cur || '') === q[1] ? ' sel' : '') + '" data-' + key + '="' + q[1] + '" title="' + q[0] + '" style="background:' + (q[1] || 'repeating-linear-gradient(45deg,#3a3440 0 4px,#221e28 4px 8px)') + '"></button>').join('') + '</div>';
    show('<div class="card small"><h2>The Mirror</h2><div class="tl-top"><span id="mrp"></span><div><p class="dim">A cracked glass behind the Tailor’s rack. Free to look, free to change.</p><label class="fld"><small>Name</small><input id="mrn" maxlength="14" value="' + esc(h.name) + '"></label></div></div>' +
      '<h3>Hair</h3>' + sw(HAIR, tint.hair, 'hair') + '<h3>Skin</h3>' + sw(SKIN, h.skin, 'skin') +
      '<h3>Build</h3><div class="slots">' + BUILD.map(q => '<button class="slot' + ((h.scale || 1) === q[1] ? ' sel' : '') + '" data-build="' + q[1] + '">' + q[0] + '</button>').join('') + '</div>' +
      '<div class="row end"><button class="big" id="b">Done</button></div></div>');
    $('mrp').appendChild(G.portrait(G.lookOf(h, st), 120));
    const again = () => { G.save(); G.sfx('place'); ui.mirror(back); };
    on('[data-hair]', el => { h.tint = Object.assign({}, h.tint, { hair: el.dataset.hair }); again(); });
    on('[data-skin]', el => { h.skin = el.dataset.skin || null; again(); });
    on('[data-build]', el => { h.scale = +el.dataset.build; again(); });
    $('mrn').addEventListener('change', e => { const v = e.target.value.trim(); if (v) { h.name = v.slice(0, 14); G.save(); } });
    on('#b', () => { const v = $('mrn').value.trim(); if (v) h.name = v.slice(0, 14); G.save(); ui.topbar(); const w = G.world.walker; w.key = ''; if (G.scene === 'hub') G.world.enter('hub', { x: w.x, z: w.z }); back ? back() : ui.close(); });
  };

  // ------------------------------------------------------------ doors into the new panels
  const tailor0 = ui.tailor;
  ui.tailor = function (tab) {
    tailor0.apply(this, arguments);
    const end = document.querySelector('#panel .row.end'); if (!end) return;
    const mk = (label, fn) => { const b = document.createElement('button'); b.textContent = label; b.onclick = () => { G.sfx('ui'); fn(); }; end.insertBefore(b, end.firstChild); };
    mk('Deeds', () => ui.deeds(() => ui.tailor(tab))); mk('The Mirror', () => ui.mirror(() => ui.tailor(tab)));
  };
  const sheet0 = ui.sheet;
  ui.sheet = function () {
    sheet0.apply(this, arguments);
    const st = G.state, h = st.hero, row = [...document.querySelectorAll('#panel .ab-row')].find(r => /Mortal Blow/.test(r.textContent)); if (!row) return;
    const open = G.mortalsOpen(st), cur = open.find(m => m.id === h.mortal);
    row.querySelector('b').textContent = cur ? cur.name : 'Crowd’s Choice';
    row.querySelector('p').textContent = (cur ? cur.desc : 'Any mortal blow you know, picked on the night.') + ' You know ' + open.length + ' of ' + G.MORTALS[h.cls].length + '.';
    const b = document.createElement('button'); b.className = 'big'; b.textContent = 'Choose'; b.onclick = () => { G.sfx('ui'); ui.finishers(); }; row.appendChild(b);
  };
})();
