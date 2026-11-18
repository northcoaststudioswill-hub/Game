// Guttercrown — the Ledger never closes: once you hold the crown, challengers keep coming, each a little worse than the last.
// Also: more ranks to climb, and kits priced for a long career rather than a short one.
(function () {
  const G = window.G, ui = G.ui;
  G.RANKS.push({ name: 'Crownbearer', at: 1100, color: '#f0c95a' }, { name: 'Terror of the Nine', at: 1800, color: '#ff4a6a' }, { name: 'A Name the Queen Knows', at: 2800, color: '#c8b8ff' });
  // kits: a slower climb. [cost, rank]
  { const P = { rags: [40, 0], leathers: [160, 1], silks: [340, 3], wraps: [340, 3], chain: [380, 3], plate: [750, 5], warden: [1300, 6] }; (G.KITS || []).forEach(k => { if (P[k.id]) { k.cost = P[k.id][0]; k.rank = P[k.id][1]; } }); }

  const BASE = G.OPPONENTS.length;
  const rng = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const FIRST = ['Orla', 'Dunmer', 'Hesk', 'Brannoch', 'Sable', 'Tolliver', 'Wyn', 'Garrow', 'Ilse', 'Mordecai', 'Pell', 'Rusk', 'Thessaly', 'Varn', 'Yorick', 'Kettle', 'Ashlin', 'Corvane', 'Dray', 'Fenwick', 'Halloran', 'Isolde', 'Jerrick', 'Marrow', 'Nettle', 'Quillon'];
  const LAST = ['Blackwater', 'of the Seventh Level', 'Nine-Fingers', 'the Unpaid', 'Coldharbour', 'Lampwright', 'the Quiet', 'Ironmonger', 'of the Flooded Gallery', 'Halfpenny', 'the Lender’s Son', 'Gravelthroat', 'of No Fixed Lamp', 'Two-Debts', 'the Patient', 'Stairborn', 'Candlewick', 'the Second-Best'];
  const TITLE = { fighter: ['Shield of the Lower Ring', 'a gate-guard with a grudge', 'the Guild’s hired wall'], rogue: ['a knife nobody heard', 'cutpurse turned contender', 'the shadow on the stair'], sorcerer: ['a bloodline gone wrong', 'the Guild’s arsonist', 'hedge-witch of the deep galleries'], cleric: ['of the Light Beneath', 'a chaplain owed money', 'penitent with a heavy hand'] };
  const TAUNT = ['That crown is brass. I only want it for the tenth of the gate.', 'The Keeper put my name under yours. I mean to move it.', 'They say the Queen knows your name. She will learn mine.', 'I have watched every bout you fought. You drop your left.', 'Nothing personal. I owe four hundred and you are worth five.', 'Ferren Voss says you are good. Ferren Voss says a lot.', 'I walked up from the seventh level for this. Do not waste my boots.', 'Mark gave me long odds. I put my stretcher money on myself.'];
  const ELITE = ['the Stair-Breaker', 'Last of the Old Watch', 'the Warden Who Stayed', 'Queen’s Mistake', 'the Ninth Level’s Answer', 'Who Beat Vexa Once, in Practice'];
  const PAL = [['#5a3a2a', '#4a4038'], ['#2a4a5a', '#3a4048'], ['#5a2a4a', '#3a3040'], ['#3a5a3a', '#3a4038'], ['#6a5a3a', '#4a4438'], ['#3a3a5a', '#30304a'], ['#6a1a2a', '#3a2028'], ['#1a5a6a', '#2a3a44']];
  function make(n) {
    const r = rng(n * 7919 + 13), pick = a => a[Math.floor(r() * a.length)], cls = pick(G.FOE_CLASSES || ['fighter', 'rogue', 'sorcerer', 'cleric']), C = G.CLASSES[cls], elite = n % 5 === 0;
    const sub = pick(Object.keys(C.subs)), pool = C.start.concat(C.l2, [C.subs[sub].ability], (G.EXTRA || {})[cls] || []).filter(id => G.ABILITIES[id]).sort(() => r() - 0.5);
    const arms = (G.ARMS || []).filter(w => w.cls === cls), pal = pick(PAL), name = pick(FIRST) + ' ' + (elite ? pick(ELITE) : pick(LAST));
    const o = { id: 'ch' + n, name, title: elite ? 'a name the whole level knows' : pick(TITLE[cls] || TITLE.fighter), cls, race: pick(Object.keys(G.RACES)), level: 5, sub, known: pool.slice(0, n > 4 ? 4 : 3), ult: n >= 2 ? C.ult : null, arm: arms.length ? pick(arms).id : null,
      hpMul: +((1 + 0.1 * n) * (elite ? 1.25 : 1)).toFixed(2), dmgMul: +Math.min(1.7, 0.8 + 0.04 * n).toFixed(2),
      ai: { react: Math.max(0.22, 0.42 - 0.012 * n), aggro: Math.min(0.85, 0.55 + 0.02 * n), dodge: Math.min(0.4, 0.18 + 0.015 * n), guard: Math.min(0.6, 0.3 + 0.02 * n), parry: Math.min(0.3, 0.12 + 0.012 * n) },
      xp: 0, coin: 140 + 22 * n + (elite ? 120 : 0), respect: 60 + 9 * n + (elite ? 60 : 0), taunt: pick(TAUNT), tint: { cloth: pal[0], armor: pal[1] }, challenger: n, elite };
    if (G.BIOS) G.BIOS[o.id] = name + ' came up the Ledger after you took the crown. ' + (elite ? 'Every fifth name is one the whole level already knows, and this is one of them.' : 'Somebody always does. The Guild makes sure of it.');
    return o;
  }
  // how many challengers you have turned away, in order
  G.defended = st => { let k = 0; while (st.wins['ch' + (k + 1)]) k++; return k; };
  G.ensureLedger = function () {
    const st = G.state; if (!st || !st.wins || !st.wins.vexa) { G.OPPONENTS.length = BASE; return; }
    const want = BASE + G.defended(st) + 1; while (G.OPPONENTS.length < want) G.OPPONENTS.push(make(G.OPPONENTS.length - BASE + 1)); G.OPPONENTS.length = want;
  };
  const pit0 = ui.pit;
  ui.pit = function () {
    G.ensureLedger(); pit0.apply(this, arguments);
    const st = G.state; if (!st.wins.vexa) return;
    const n = G.defended(st), p = document.querySelector('#panel .card > p.dim'); if (p) p.innerHTML = 'You hold the Guttercrown, and the Ledger never closes. <b>' + n + '</b> challenger' + (n === 1 ? '' : 's') + ' turned away. Each one is a little worse than the last.';
    const rows = document.querySelectorAll('#panel .ladder .opp'); rows.forEach((el, i) => { if (i >= BASE && i < G.OPPONENTS.length - 3) el.style.display = 'none'; if (i >= BASE) { const o = G.OPPONENTS[i]; el.classList.toggle('boss', !!o.elite); } });
    const lad = document.querySelector('#panel .ladder'); if (lad && rows.length) { const last = rows[rows.length - 1]; if (last.scrollIntoView) last.scrollIntoView({ block: 'nearest' }); }
  };
  const hub0 = ui.hub;
  ui.hub = function () { G.ensureLedger(); return hub0.apply(this, arguments); };
  const obj0 = G.objective;
  G.objective = function () { G.ensureLedger(); return obj0.apply(this, arguments); };
  if (G.LORE) G.LORE.push({ sec: 'The Pit', title: 'The Ledger Never Closes', unlock: st => !!st.wins.vexa, body: 'Winning the Guttercrown strikes your debt. It does not strike anyone else’s. Every debtor on nine levels can now clear their page by taking the crown from you, and the Guild sends them up in order, one after another, for as long as you can stand. Nobody has ever retired from it. Vexa lasted seven years. The Ledger-Keeper has started a fresh page for you, and left a great deal of room at the bottom.' });
})();
