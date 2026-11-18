// Guttercrown — the arms race: the Fence sells five grades of steel and armour, and everyone on the Ledger has been buying too.
// Keep pace and a bout is even. Walk in with what the Guild issued and the upper names will take you apart.
(function () {
  const G = window.G, ui = G.ui;
  // five grades each. The first two are as they always were; the next three are finer steps.
  const WT = G.GEAR.weapon.tiers, AT = G.GEAR.armor.tiers;
  WT[1].desc = '+2 damage on weapon hits, +6% to all damage, and a wider parry window.'; WT[2].desc = '+4 damage on weapon hits, +12% to all damage, and a wider parry window still.';
  WT.push({ name: 'Guild-Forged Edge', cost: 380, desc: '+5 damage on weapon hits and +18% to all damage. What the Guild issues to people it expects to keep.' }, { name: 'Warden Steel', cost: 600, desc: '+6 damage on weapon hits and +24% to all damage. White steel off the Long Stair. Do not ask.' }, { name: 'Crownsmith’s Work', cost: 900, desc: '+7 damage on weapon hits and +30% to all damage. Made for whoever holds the crown, or means to.' });
  AT[1].desc = 'Take 8% less damage; parry window widens.'; AT[2].desc = 'Take 15% less damage; parry window widens again.';
  AT.push({ name: 'Lamellar and Mail', cost: 380, desc: 'Take 22% less damage.' }, { name: 'Warden Plate', cost: 600, desc: 'Take 28% less damage.' }, { name: 'Crownsmith’s Harness', cost: 900, desc: 'Take 34% less damage.' });
  const W = [0, 2, 4, 5, 6, 7], A = [0, 0.08, 0.15, 0.22, 0.28, 0.34], D = [0, 0.06, 0.12, 0.18, 0.24, 0.30], WN = ['Guild-issue steel'].concat(WT.slice(1).map(t => t.name)), AN = ['Guild-issue kit'].concat(AT.slice(1).map(t => t.name));
  // the base rules give +2 damage and 6% per grade; past the second grade the steps are smaller
  const der0 = G.derive;
  G.derive = function (h, st) { const d = der0.apply(this, arguments); if (st && st.gear && st.hero === h) { const w = st.gear.weapon || 0, a = st.gear.armor || 0; d.weapon += W[Math.min(5, w)] - w * 2; d.dr += A[Math.min(5, a)] - a * 0.06; d.dmgMul += D[Math.min(5, w)]; d.parry -= Math.max(0, w - 2) * 0.015 + Math.max(0, a - 2) * 0.012; } return d; };
  const look0 = G.lookOf;
  G.lookOf = function (h, st) { const l = look0.apply(this, arguments); if (l && l.gear) l.gear = { weapon: Math.min(2, l.gear.weapon || 0), armor: Math.min(2, l.gear.armor || 0) }; return l; };
  // what grade a given opponent carries
  const of = o => { if (!o) return 0; if (o.ascent != null) return 5; if (o.challenger) return 5; if (o.under != null) return Math.min(4, o.under + (o.extra ? 1 : 0)); if (o.grudge) return 2; const i = G.OPPONENTS.indexOf(G.OPPONENTS.find(q => q.id === o.id)); return i >= 0 && i < 5 ? i + 1 : 0; };
  G.gearRace = { W, A, D, WN, AN, of };

  // the card before a bout says what they are carrying, and what you are
  const pre0 = ui.prefight;
  ui.prefight = function (o) { const r = pre0.apply(this, arguments), st = G.state, card = document.querySelector('#panel .card.vs'), end = card && card.querySelector('.row.end:last-child'); if (!end || !o || o.spar || !st.gear) return r;
    const k = of(o), mw = st.gear.weapon || 0, ma = st.gear.armor || 0, gap = Math.max(k - mw, k - ma), cls = gap >= 2 ? 'bad' : gap >= 1 ? 'warn' : 'ok';
    const anchor = card.querySelector('.prep') || end, d = document.createElement('div'); d.className = 'gearcmp ' + cls;
    d.innerHTML = '<div><small>THEIR STEEL</small><b>' + WN[k] + '</b><small>THEIR ARMOUR</small><b>' + AN[k] + '</b></div><div><small>YOUR STEEL</small><b class="' + (mw < k ? 'low' : '') + '">' + WN[Math.min(5, mw)] + '</b><small>YOUR ARMOUR</small><b class="' + (ma < k ? 'low' : '') + '">' + AN[Math.min(5, ma)] + '</b></div>' +
      '<p>' + (gap >= 2 ? 'You are badly out-geared. They will hit harder and shrug off more. The Fence sells better.' : gap >= 1 ? 'They are a grade ahead of you. Skill can cover it. The Fence can too.' : gap <= -1 ? 'You are better equipped than they are.' : 'Evenly equipped.') + '</p>';
    anchor.parentNode.insertBefore(d, anchor); return r; };
  // and the line at the top nags you when you are falling behind
  const obj0 = G.objective;
  G.objective = function () { const s = obj0.apply(this, arguments), st = G.state; if (!st || !st.hero || !st.gear || G.scene !== 'hub' || typeof s !== 'string' || /^NEW|grudge|clock|has news/.test(s) || !G.climb) return s;
    const nx = G.climb.next(st), k = of(nx), mw = st.gear.weapon || 0, ma = st.gear.armor || 0, gap = Math.max(k - mw, k - ma); if (gap < 2) return s;
    const which = k - mw >= k - ma ? 'weapon' : 'armor', t = G.GEAR[which].tiers[(st.gear[which] || 0) + 1]; if (!t) return s;
    return 'Your ' + (which === 'weapon' ? 'steel' : 'armour') + ' is ' + gap + ' grades behind ' + nx.name.split(' ')[0] + '’s: the Fence has ' + t.name + ' for ' + t.cost + ' coin' + (st.coin >= t.cost ? '' : ' (you have ' + st.coin + ')') + ' · then ' + s.replace(/^.* · then /, '').replace(/^Blood Pit: /, ''); };
  if (G.TIPS) G.TIPS.push('Everyone on the Ledger buys steel and armour as they climb. The card before a bout shows theirs against yours.');
  if (G.LORE) G.LORE.push({ sec: 'How Things Work', title: 'Steel and Armour', unlock: st => !!(st.gear && (st.gear.weapon || st.gear.armor)), body: 'The Fence sells five grades of each. Every fighter on the Ledger is equipped for their place on it: the first undercard in what the Guild hands out, the champion in the best the Crownsmith makes. Keep pace and a bout is decided by the fighting. Fall two grades behind and they will hit you harder than you hit them and feel it less. A good fighter can still win that way. Most do not.' });
})();
