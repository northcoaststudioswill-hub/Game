// Guttercrown — abilities that come from who you are, not what you trained as:
//   BUY   one move for each blood, taught by your own kind for coin
//   EARN  one move for each trade, given by the pit itself after ten wins
//   GET   one move nobody sells: David hands it over with the contract
(function () {
  'use strict';
  const G = window.G, A = G.ABILITIES, ui = G.ui;
  const def = (id, o) => { A[id] = Object.assign({ id, cost: 20, cd: 9, wind: 0.16, rec: 0.2 }, o); return id; };
  const f = d => '<path d="' + d + '"/>', s = (d, w) => '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"/>', c = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
  const IC = G.ICON_EXTRA = G.ICON_EXTRA || {};
  // ---- blood
  const RACE = {
    human: def('rc_grit', { name: 'Stubborn Streak', type: 'buff', cost: 18, cd: 15, wind: 0.12, rec: 0.12, heal: [1, 8], healStat: 'con', healLvl: 2, buff: { haste: [3, 0.25] }, cs: 'steel', color: '#e8d8b0', kind: 'Human', role: 'Heal', desc: 'Humans do not know when to stop. Heal 1d8 + CON + 2 per level and strike 25% faster for 3s.' }),
    elf: def('rc_feystep', { name: 'Fey Step', type: 'dash', cost: 14, cd: 6, wind: 0.03, rec: 0.08, dist: 260, behind: 1, buff: { sneak: [2, 0] }, color: '#9ae0b8', kind: 'Elf', role: 'Mobility', desc: 'Step sideways out of the world and back in behind them. Your next blow lands as a sneak attack.' }),
    dwarf: def('rc_stomp', { name: 'Stonefoot', type: 'aoe', at: 'self', armor: 1, cost: 22, cd: 10, wind: 0.2, rec: 0.25, radius: 120, dmg: [2, 6], stat: 'con', stun: 0.8, knock: 200, pz: 2, cs: 'nova', color: '#c8b090', kind: 'Dwarf', role: 'Control', desc: 'One boot, put down the way the Old Seam taught: 2d6 + CON around you, stunned and shoved. You cannot be knocked out of it.' }),
    halforc: def('rc_charge', { name: 'Tusk Charge', type: 'melee', armor: 1, cost: 24, cd: 9, wind: 0.24, rec: 0.3, range: 72, arc: 70, lunge: 260, dmg: [3, 6], stat: 'str', knock: 380, pz: 2, mv: 'bash', color: '#9ad070', kind: 'Half-Orc', role: 'Damage', desc: 'Head down, straight through: a long charge for 3d6 + STR that carries them into whatever is behind.' }),
    tiefling: def('rc_flare', { name: 'Hellish Flare', type: 'aoe', at: 'target', cost: 24, cd: 9, wind: 0.2, rec: 0.2, delay: 0.35, radius: 78, dmg: [2, 8], stat: 'cha', fire: 1, dot: ['burn', 4, [1, 4]], cs: 'point', color: '#ff5a2a', kind: 'Tiefling', role: 'Damage', desc: 'What your grandmother bargained for: fire comes up under them for 2d8 + CHA and keeps burning for 4s.' }),
    drow: def('rc_faerie', { name: 'Faerie Fire', type: 'proj', cost: 16, cd: 7, wind: 0.14, rec: 0.18, speed: 820, pr: 10, dmg: [1, 8], stat: 'dex', slow: [0.35, 4], mark: 4, cs: 'throw', color: '#b890ff', kind: 'Drow', role: 'Control', desc: 'Cold violet light that will not rub off: 1d8 + DEX, slowed for 4s, and nowhere left to hide.' })
  };
  IC.rc_grit = f('M5 21v-8l-2-4 2-1 2 3V6a1.5 1.5 0 0 1 3 0v4V4a1.5 1.5 0 0 1 3 0v6V6a1.5 1.5 0 0 1 3 0v8c0 4-3 7-6 7z');
  IC.rc_feystep = f('M12 2c1 4 3 6 7 7-4 1-6 3-7 7-1-4-3-6-7-7 4-1 6-3 7-7z') + c(19, 19, 2) + c(5, 19, 1.5);
  IC.rc_stomp = f('M8 2h6v10l5 3v4H6v-5z') + s('M2 22h20 M4 19l-2 1 M20 19l2 1', 1.8);
  IC.rc_charge = f('M4 16c0-6 4-10 9-10 4 0 7 3 7 7v3h-5l-2 3H7z') + f('M19 9l4-5-1 7z') + s('M1 9h4 M1 13h3', 1.6);
  IC.rc_flare = f('M12 2c3 4 6 6 6 10a6 6 0 0 1-12 0c0-3 2-4 3-6 0 2 1 3 2 3 0-2 0-5 1-7z') + s('M3 21h18', 2.4);
  IC.rc_faerie = c(12, 12, 4) + c(5, 6, 1.6) + c(19, 6, 1.6) + c(5, 18, 1.6) + c(19, 18, 1.6) + c(12, 3, 1.2) + c(12, 21, 1.2);
  // ---- trade: what ten wins teach you
  const EARN = {
    fighter: def('pe_execute', { name: 'Headsman’s Due', type: 'melee', armor: 1, cost: 28, cd: 11, wind: 0.3, rec: 0.35, range: 78, arc: 90, lunge: 90, dmg: [3, 8], stat: 'str', execute: 1, mv: 'chop', color: '#e86050', kind: 'Pit-earned', role: 'Damage', desc: 'The blow you learned from being the one left standing: 3d8 + STR, doubled against a foe below 40% health.' }),
    rogue: def('pe_vanish', { name: 'Gone Again', type: 'buff', cost: 22, cd: 13, wind: 0.05, rec: 0.08, buff: { stealth: [2.5, 0], sneak: [3.5, 0], speed: [2.5, 0.35] }, smoke: 1, cs: 'plant', color: '#a8b0c0', kind: 'Pit-earned', role: 'Defense', desc: 'Ten bouts taught you where the crowd is not looking. Vanish for 2.5s, faster, with a sneak attack waiting.' }),
    sorcerer: def('pe_chain', { name: 'Chain Lightning', type: 'line', cost: 28, cd: 8, wind: 0.32, rec: 0.22, range: 600, width: 34, dmg: [4, 6], stat: 'cha', stun: 0.35, cs: 'cone', color: '#9ac8ff', kind: 'Pit-earned', role: 'Damage', desc: 'It stopped being one bolt somewhere around your eighth win: a wide line for 4d6 + CHA and a short stun.' }),
    cleric: def('pe_tide', { name: 'Turn the Tide', type: 'buff', cost: 30, cd: 20, wind: 0.3, rec: 0.15, heal: [3, 8], healStat: 'wis', healLvl: 3, buff: { shield: [6, 20] }, shieldLvl: 4, cs: 'bless', color: '#fff0b0', kind: 'Pit-earned', role: 'Heal', desc: 'A proper prayer, for once answered: heal 3d8 + WIS + 3 per level and stand behind a ward for 6s.' }),
    druid: def('pe_swarm', { name: 'The Crawling Dark', type: 'aoe', at: 'target', cost: 24, cd: 10, wind: 0.2, rec: 0.2, delay: 0.3, radius: 90, dmg: [1, 6], stat: 'wis', dot: ['poison', 5, [1, 6]], slow: [0.3, 5], cs: 'call', color: '#8aa050', kind: 'Pit-earned', role: 'Control', desc: 'Everything that lives under the sand comes up at once: 1d6 + WIS, then 5s of biting and slowing.' }),
    warlock: def('pe_rip', { name: 'Collect', type: 'proj', cost: 22, cd: 8, wind: 0.2, rec: 0.2, speed: 760, pr: 11, dmg: [3, 6], stat: 'cha', leech: 0.5, cs: 'claw', color: '#b070ff', kind: 'Pit-earned', role: 'Damage', desc: 'Your patron takes its share and passes you a little: 3d6 + CHA, and half of it comes back to you as health.' })
  };
  IC.pe_execute = f('M4 4h9l5 5-3 3-5-5H4z') + s('M11 10L4 20', 2.6) + f('M17 16l4 5-6-1z');
  IC.pe_vanish = '<g opacity="0.35">' + c(12, 7, 3) + f('M7 11h10l1 7-3 1v3H9v-3l-3-1z') + '</g>' + s('M3 4l18 16', 2);
  IC.pe_chain = f('M9 1L3 9h4l-2 6 7-8H8z') + f('M18 8l-5 7h3l-2 7 7-9h-4z');
  IC.pe_tide = s('M2 15c3-4 5-4 7 0s4 4 7 0 4-4 6 0', 2.4) + f('M12 2l2 4 4 .5-3 3 .8 4.5L12 12l-3.8 2 .8-4.5-3-3 4-.5z');
  IC.pe_swarm = [[6, 7], [12, 5], [18, 8], [8, 13], [15, 13], [5, 18], [12, 19], [19, 17]].map(q => c(q[0], q[1], 1.7)).join('') + s('M2 22h20', 1.6);
  IC.pe_rip = f('M12 21l-8-8a5 5 0 0 1 8-6 5 5 0 0 1 8 6z') + '<g fill="#000" opacity="0.55">' + f('M13 7l-3 5h3l-2 5 5-7h-3z') + '</g>';
  // ---- David's gift
  const GIFT = def('dv_second', { name: 'A Stolen Second', type: 'dash', cost: 10, cd: 14, wind: 0.02, rec: 0.05, dist: 220, behind: 1, buff: { haste: [3, 0.6], speed: [3, 0.3] }, color: '#f0c95a', kind: 'David’s gift', role: 'Burst', desc: 'He turns your clock back one tick. You are already behind them, and for 3s everything you do is quicker. It goes on your account.' });
  IC.dv_second = f('M6 2h12v3l-4 7 4 7v3H6v-3l4-7-4-7z') + '<g fill="#000" opacity="0.5">' + f('M9 5h6l-3 5z') + '</g>';
  G.RACE_MOVE = RACE; G.EARNED_MOVE = EARN; G.GIFT_MOVE = GIFT; const WINS = 10, RCOST = [200, 1];
  // the trainer sells you your own blood's move alongside your trade's
  const tr0 = ui.trainer;
  if (tr0) ui.trainer = function () { const h = G.state.hero, id = h && RACE[h.race]; if (!id) return tr0.apply(this, arguments); const cls = h.cls, base = G.EXTRA[cls] || []; (G.TEACH_EXTRA = G.TEACH_EXTRA || {})[id] = RCOST; G.EXTRA[cls] = base.includes(id) ? base : base.concat([id]); try { return tr0.apply(this, arguments); } finally { G.EXTRA[cls] = base; } };
  // what the pit and the contract hand you
  const wins = st => Object.keys(st.wins || {}).reduce((n, k) => n + (st.wins[k] || 0), 0);
  const give = (h, id) => { if (!id || !A[id] || h.known.includes(id)) return false; h.known.push(id); const free = (h.slots || []).indexOf(null); if (free >= 0) h.slots[free] = id; else if ((h.slots || []).length < 3) h.slots.push(id); return true; };
  const hub0 = ui.hub;
  ui.hub = function () { const r = hub0.apply(this, arguments), st = G.state, h = st && st.hero; if (!h || G.guest) return r; const got = [];
    if (wins(st) >= WINS && give(h, EARN[h.cls])) got.push(['The pit has taught you something', A[EARN[h.cls]]]);
    if ((st.signed || st.bound) && give(h, GIFT)) got.push(['Signed, and paid in advance', A[GIFT]]);
    if (got.length) { G.save(); setTimeout(() => { if (G.scene !== 'hub' || ui.isOpen() || G.talk) { ui.toast('New move: ' + got.map(q => q[1].name).join(', ') + '. Set it at the Guildmaster.'); return; }
      ui._show('<div class="card small"><small class="over">' + got[0][0] + '</small><h2>' + got.map(q => q[1].name).join(' · ') + '</h2>' + got.map(q => '<div class="ab-row"><div class="ab-ic">' + G.icon(q[1]) + '</div><div class="ab-tx"><b>' + q[1].name + '</b><small>' + q[1].kind + '</small><p>' + q[1].desc + '</p></div></div>').join('') + '<p class="dim">It is on your list. Choose which three you carry at the Guildmaster.</p><div class="row end"><button id="gl">Loadout</button><button class="big" id="x">Good</button></div></div>'); G.sfx('level');
      ui._on('#x', () => { ui.close(); ui.topbar(); }); ui._on('#gl', () => ui.sheet('New move learned. Choose your three.')); }, 400); }
    return r; };
  // the Loadout page says what is still out there
  const sh0 = ui.sheet;
  ui.sheet = function () { const r = sh0.apply(this, arguments), st = G.state, h = st.hero, card = document.querySelector('#panel .card'); if (!card || !h) return r; const host = [...card.querySelectorAll('h3')].find(e => /always/i.test(e.textContent)); if (!host) return r;
    const rows = [[RACE[h.race], 'Buy', 'Taught by your own kind: Learn, at the Guildmaster'], [EARN[h.cls], 'Earn', 'Win ' + WINS + ' bouts (' + Math.min(WINS, wins(st)) + ' of ' + WINS + ')'], [GIFT, 'Get', 'Nobody sells it. One man gives it away, at a price']].filter(q => q[0] && A[q[0]] && !h.known.includes(q[0]));
    if (!rows.length) return r; const box = document.createElement('div'); box.className = 'tolearn'; box.innerHTML = '<h3>Still to come</h3>' + rows.map(q => '<div class="ab-row lockedrow"><div class="ab-ic">' + G.icon(A[q[0]]) + '</div><div class="ab-tx"><b>' + A[q[0]].name + '</b><span class="tagk">' + q[1] + '</span><small>' + q[2] + '</small><p>' + A[q[0]].desc + '</p></div></div>').join(''); host.insertAdjacentElement('beforebegin', box); return r; };
  if (G.LORE) G.LORE.push({ sec: 'How Things Work', title: 'Blood, Trade and Gift', unlock: st => !!st.hero, body: 'Three kinds of move are not on any trade’s list. One comes with your blood, and your own people will teach it for coin. One the pit teaches: nobody wins ten bouts without learning something the Guild never wrote down. And one is a gift from the man under the market, who has never given anything away in his life.' });
})();
