// Guttercrown — the long climb: undercard bouts between the named fighters, ten levels, and a market that opens up as you earn it
(function () {
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const NEED = [2, 2, 2, 3, 3, 3, 3, 3, 4], GATES = G.OPPONENTS.slice(0, 9), BASE = GATES.length, OLD = [0, 2, 4, 6, 8];
  // a save from the five-name ladder keeps its place: the four new names it has already climbed past are marked as beaten before its time
  const U = st => { if (!st.under) st.under = Object.keys(st.wins || {}).length && !st.wins.dolly && !st.wins.ansel ? [0, 0, 0, 0, 0] : NEED.map(() => 0); if (st.under.length < NEED.length) { const o = st.under, n = NEED.map(() => 0); OLD.forEach((t, i) => { n[t] = Math.min(NEED[t], o[i] || 0); }); [1, 3, 5, 7].forEach(t => { const nx = GATES[t + 1]; if (st.wins[nx.id] || n[t + 1] > 0) { n[t] = NEED[t]; if (!st.wins[GATES[t].id]) { st.wins[GATES[t].id] = 1; (st.before = st.before || {})[GATES[t].id] = 1; } } }); st.under = n; } return st.under; };
  const rankName = i => G.RANKS[i].name;

  // ------------------------------------------------------------ a longer ladder
  // the named five are stronger now: you reach them with more levels behind you
  { const LV = [1, 2, 3, 4, 5, 6, 6, 7, 8], HP = [1.34, 1, 1.24, 1, 1.2, 1, 1.14, 1, 0.94], DM = [1.34, 1, 1.4, 1, 1.44, 1, 1.44, 1, 1.22], GD = [0.3, 0.35, 0.4, 0.35, 0.3, 0.45, 0.6, 0.5, 0.45], PR = [0.06, 0.09, 0.12, 0.11, 0.1, 0.15, 0.2, 0.24, 0.28], AG = [0.62, 0.64, 0.66, 0.68, 0.7, 0.72, 0.74, 0.78, 0.82]; GATES.forEach((o, i) => { o.level = LV[i]; o.hpMul = +(o.hpMul * HP[i]).toFixed(2); o.dmgMul = +(o.dmgMul * DM[i]).toFixed(2); o.ai = Object.assign({}, o.ai, { react: +(o.ai.react * 0.82).toFixed(2), aggro: Math.max(o.ai.aggro, AG[i]), guard: GD[i], parry: PR[i] }); o.respect0 = Math.round(o.respect * 0.62); o.respect = Math.round(o.respect * 0.55 * 0.62); o.xp = Math.round(o.xp * 0.62); o.coin = Math.round(o.coin * 0.7); }); }       // nine names now, so each pays a little less   // respect is spread over four times as many bouts

  const rng = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const FIRST = ['Tam', 'Odger', 'Nell', 'Brisk', 'Hob', 'Cray', 'Wenna', 'Stitch', 'Lodd', 'Marnie', 'Pike', 'Sorrel', 'Duff', 'Ketch', 'Jory', 'Mab', 'Crick', 'Tansy', 'Garl', 'Ibb', 'Roon', 'Hesper'];
  const LAST = ['the Late Payer', 'Three-Loans', 'of the Wet Stair', 'Sootfoot', 'the Understudy', 'Lampless', 'Pawnticket', 'of the Second Shift', 'Borrowed-Boots', 'the Hopeful', 'Shortweight', 'of Nobody’s Stable', 'Half-a-Chance', 'the Substitute'];
  const TITLE = ['a debtor on the first page', 'a scrapper off the heap', 'a pit-hand with ideas', 'somebody’s hired knife', 'a Guild bruiser on wages', 'a name with a patron', 'a name the gate-men know', 'a veteran of the upper card', 'one bout from the champion’s card'];
  const TAUNT = ['They told me you were new. So am I. One of us stops being new tonight.', 'I owe less than you do. I checked.', 'The Keeper said win two and they will feed me. So.', 'Do not take it personal. I have a landlord.', 'My brother fought here. Ask the sand where he is.', 'I am only on the undercard until somebody notices me. Notice me.', 'You hit me, I hit you, the crowd throws coin. Simple trade.', 'I have been practising on rats. Big ones.', 'Somebody bet a week’s wages on me. I think it was me.', 'After you, the Guild says I get a real name on the board.'];
  const PAL = [['#5b4a2a', '#4a4031'], ['#3a4a3a', '#3a3a30'], ['#4a3a4a', '#35303a'], ['#5a3a2a', '#40342c'], ['#2f4450', '#333a40'], ['#55452f', '#3d362c']];
  const cache = {};
  function make(t, k) {
    const key = t + '_' + k + (k >= NEED[t] && G.state && G.state.hero ? '_' + G.state.hero.level : ''); if (cache[key]) return cache[key];
    const g = GATES[t], r = rng(t * 4099 + k * 131 + 7), pick = a => a[Math.floor(r() * a.length)], cls = pick(G.FOE_CLASSES || ['fighter', 'rogue', 'sorcerer', 'cleric']), C = G.CLASSES[cls], extra = k >= NEED[t], kk = Math.min(k, 4);
    const sub = t >= 6 ? pick(Object.keys(C.subs)) : null, known = C.start.slice(0, 2).concat(t >= 2 ? [C.l2[Math.floor(r() * C.l2.length)]] : [], sub ? [C.subs[sub].ability] : []).filter(id => G.ABILITIES[id]);
    const arms = (G.ARMS || []).filter(w => w.cls === cls), pal = pick(PAL), name = pick(FIRST) + ' ' + pick(LAST), pay = extra ? 0.6 : 1;
    const o = { id: 'u' + t + '_' + k, name, title: TITLE[t], cls, race: pick(Object.keys(G.RACES)), level: Math.max(1, g.level - 1, extra && G.state && G.state.hero ? G.state.hero.level - 2 : 0), sub, known, arm: t >= 4 && arms.length ? pick(arms).id : null,
      hpMul: +(g.hpMul * (0.8 + 0.04 * kk)).toFixed(2), dmgMul: +(g.dmgMul * (0.84 + 0.03 * kk)).toFixed(2),
      ai: { react: g.ai.react + 0.08, aggro: Math.max(0.5, g.ai.aggro - 0.08), dodge: g.ai.dodge * 0.8, guard: Math.max(0.2, g.ai.guard - 0.1), parry: Math.max(0.04, g.ai.parry - 0.04) },
      xp: Math.round(g.xp * 0.45 * pay), coin: Math.round(g.coin * 0.4 * pay), respect: Math.round(g.respect0 * 0.12 * pay), taunt: pick(TAUNT), tint: { cloth: pal[0], armor: pal[1] }, under: t, extra };
    G.BIOS[o.id] = name + ' is on the undercard: the bouts the Guild runs before the names anyone has heard of. Win enough of them and the Ledger-Keeper writes you in against ' + g.name + '.';
    return cache[key] = o;
  }
  const gateOpen = (st, t) => (t === 0 || !!st.wins[GATES[t - 1].id]) && (U(st)[t] >= NEED[t] || !!st.wins[GATES[t].id]);
  const tierNow = st => GATES.findIndex(o => !st.wins[o.id]);
  G.climb = { NEED, make, gateOpen, tierNow, next: st => { const t = tierNow(st); if (t < 0) { if (G.ensureLedger) G.ensureLedger(); return G.OPPONENTS.find(o => !st.wins[o.id]) || G.OPPONENTS[G.OPPONENTS.length - 1]; } return gateOpen(st, t) ? GATES[t] : make(t, U(st)[t]); }, left: st => { const t = tierNow(st); return t < 0 ? 0 : Math.max(0, NEED[t] - U(st)[t]); } };

  const row = (o, cls, body, btn) => '<div class="opp ' + cls + '"><span class="op" data-o="' + o.id + '"></span><div class="opp-tx"><b>' + o.name + '</b> <small>' + o.title + '</small>' + body + '</div>' + btn + '</div>';
  const rew = (o, wins) => '<small class="rew">' + (wins ? Math.round(o.xp * .6) : o.xp) + ' XP · ' + (wins ? Math.round(o.coin * .6) : o.coin) + ' coin · ' + (wins ? Math.round(o.respect * .3) : o.respect) + ' respect</small>';
  const who = o => '<small>Level ' + o.level + ' ' + G.RACES[o.race].name + ' ' + G.CLASSES[o.cls].name;
  ui.pit = function () {
    const st = G.state, u = U(st), now = tierNow(st), byId = {}; if (G.ensureLedger) G.ensureLedger();
    let h = '<div class="card"><h2>The Blood Ledger</h2><p class="dim">' + (now < 0 ? 'You hold the Guttercrown, and the Ledger never closes. <b>' + G.defended(st) + '</b> challenger' + (G.defended(st) === 1 ? '' : 's') + ' turned away. Each one is a little worse than the last.' : 'Nine names stand between you and the crown. Nobody is handed a name: win your <b>undercard</b> bouts and the Ledger-Keeper writes you in against the next one.') + '</p><div class="ladder">';
    GATES.forEach((o, t) => {
      const wins = st.wins[o.id] || 0, reach = t === 0 || !!st.wins[GATES[t - 1].id], open = gateOpen(st, t);
      if (t === now) {
        const uo = make(t, u[t]); byId[uo.id] = uo; const left = NEED[t] - u[t];
        h += '<div class="tier"><b>Tonight’s undercard</b><span class="pips">' + Array.from({ length: NEED[t] }, (_, i) => '<i class="' + (i < u[t] ? 'on' : '') + '"></i>').join('') + '</span><small>' + (left > 0 ? left + ' more to earn ' + o.name : 'Earned. Fight on for smaller purses, or face ' + o.name + '.') + '</small></div>';
        h += '<p class="uc-why">' + o.name + ' does not fight strangers. The <b>undercard</b> is the run of smaller bouts the Guild stages first: hungry nobodies, each one fighting for the same line in the Ledger you are. Beat <b>' + NEED[t] + '</b> of them and the Keeper writes you in. Nobody you kill comes back; the Guild always finds another.</p>';
        h += '<div class="uc-card">' + Array.from({ length: Math.max(NEED[t], u[t] + 1) }, (_, i) => { const q = make(t, i); return '<span class="' + (i < u[t] ? 'dead' : i === u[t] ? 'now' : '') + '">' + (i < u[t] ? '✝ ' : i === u[t] ? '▶ ' : '') + q.name + (i > u[t] ? ' <i>' + G.CLASSES[q.cls].name + '</i>' : '') + '</span>'; }).join('') + '</div>';
        h += row(uo, 'under' + (left > 0 ? ' cur' : ''), who(uo) + '</small><em class="taunt">“' + uo.taunt + '”</em>' + rew(uo, 0), '<button class="' + (left > 0 ? 'big' : '') + '" data-under="' + t + '">Fight</button>');
      }
      byId[o.id] = o;
      h += row(o, (open ? '' : 'locked') + (o.boss ? ' boss' : '') + (wins ? ' beaten' : '') + (open && !wins ? ' cur' : ''), who(o) + '</small>' + (wins ? '<em class="taunt">' + ((st.before || {})[o.id] ? 'Somebody else got there first. The sand does not keep names.' : 'Carried out by the gate-men. The Keeper drew one line through the name, with a ruler.') + '</em>' : (open ? '<em class="taunt">“' + o.taunt + '”</em>' : '') + rew(o, wins)),
        wins ? '<span class="lock dead">' + ((st.before || {})[o.id] ? 'Gone before you' : 'Dead') + '</span>' : open ? '<button class="big" data-fight="' + t + '">Fight</button>' : '<span class="lock">' + (reach ? 'Undercard first' : 'Sealed') + '</span>');
    });
    if (now < 0) G.OPPONENTS.forEach((o, i) => { if (i < BASE || i < G.OPPONENTS.length - 3) return; const wins = st.wins[o.id] || 0; byId[o.id] = o;
      h += row(o, (o.elite ? 'boss' : '') + (wins ? ' beaten' : ' cur'), who(o) + '</small>' + (wins ? '<em class="taunt">Came for the crown. Stayed in the sand.</em>' : '<em class="taunt">“' + o.taunt + '”</em>' + rew(o, wins)), wins ? '<span class="lock dead">Dead</span>' : '<button class="big" data-fight="' + i + '">Fight</button>'); });
    h += '</div><div class="row end"><button id="x">Back</button></div></div>';
    show(h);
    document.querySelectorAll('#panel .op').forEach(el => { const o = byId[el.dataset.o]; el.appendChild(G.portrait({ cls: o.cls, race: o.race, tint: o.tint }, 56, 1.2)); });
    on('#x', () => ui.close());
    on('[data-fight]', el => ui.prefight(G.OPPONENTS[+el.dataset.fight]));
    on('[data-under]', el => ui.prefight(make(+el.dataset.under, u[+el.dataset.under])));
    const cur = document.querySelectorAll('#panel .opp.cur'), last = cur[cur.length - 1]; if (last && last.scrollIntoView) last.scrollIntoView({ block: 'center' });
  };
  // challengers after the crown teach you something too
  if (G.ensureLedger) { const e0 = G.ensureLedger; G.ensureLedger = function () { e0.apply(this, arguments); G.OPPONENTS.forEach(o => { if (o.challenger && !o._scaled) { const n = o.challenger; o._scaled = 1; o.xp = 110 + 10 * n; o.level = 7; o.hpMul = +((1 + 0.06 * n) * (o.elite ? 1.2 : 1)).toFixed(2); o.dmgMul = +Math.min(1.9, 0.84 + 0.05 * n).toFixed(2); } }); }; }      // later challengers hit harder and think faster; they do not just take longer to cut down

  const res0 = ui.results;
  ui.results = function (r) {
    const st = G.state;
    if (r && r.win && r.opp && r.opp.under != null && !r._uc) { r._uc = 1; const t = r.opp.under, u = U(st); u[t]++; G.save();
      if (u[t] === NEED[t] && !st.wins[GATES[t].id]) setTimeout(() => ui.toast('The Ledger-Keeper writes your name against ' + GATES[t].name + '.'), 900); }
    return res0.apply(this, arguments);
  };
  // Marc pays on the bout you actually fought: an undercard win is not worth a named fighter's odds
  if (G.mark) {
    const oddsFor = o => Math.max(1.15, Math.round((1.35 + o.level * 0.22 - G.state.hero.level * 0.1) * (o.under != null ? 0.8 : 1) * 20) / 20);
    G.mark.selfOdds = function () { const st = G.state, t = tierNow(st); let o; if (t < 0) { if (G.ensureLedger) G.ensureLedger(); o = G.OPPONENTS.find(q => !st.wins[q.id]) || G.OPPONENTS[G.OPPONENTS.length - 1]; } else o = gateOpen(st, t) ? GATES[t] : make(t, U(st)[t]); return { opp: o, odds: oddsFor(o) }; };
    let fought = null; const fs0 = G.fight.start; G.fight.start = function (o) { fought = o && !o.spar ? o : fought; return fs0.apply(this, arguments); };
    const mr0 = G.mark.resolve; G.mark.resolve = function () { const c = G.state.card; if (c && c.self && fought) c.self.odds = Math.min(c.self.odds, oddsFor(fought)); return mr0.apply(this, arguments); };
  }
  const obj0 = G.objective;
  G.objective = function () {
    const s = obj0.apply(this, arguments), st = G.state; if (!st || !st.hero || typeof s !== 'string') return s;
    const t = tierNow(st), left = G.climb.left(st), fresh = KEYS.find(k => open(k, st) && !(st.seen || {})[k] && UN[k].spot);
    if (/Next on the Ledger|Go to the Blood Pit gate/.test(s)) {
      if (t >= 0 && left > 0) return 'Blood Pit: win ' + left + ' more undercard bout' + (left === 1 ? '' : 's') + ' to earn ' + GATES[t].name;
      if (fresh && st.wins.grubb) return s + ' · New in the market: ' + UN[fresh].name;
    }
    if (/, then fight /.test(s) && t >= 0 && left > 0) return s.replace(/, then fight .*/, ', then win your undercard bouts');
    return s;
  };

  // ------------------------------------------------------------ ten levels
  G.XP_FOR = [0, 0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200]; G.MAX_LEVEL = 10;
  const CAPS = { unbroken: ['Unbroken', '+15% maximum hit points and +20 posture.'], executioner: ['Executioner', '+10% damage with everything and +5% critical chance.'], well: ['Deep Well', '+30% resource regeneration and abilities recover 10% faster.'] };
  const der0 = G.derive;
  G.derive = function (h, st) {
    const d = der0.apply(this, arguments);
    if (h && h.xp != null && h.level > 5) d.dmgMul += 0.03 * (h.level - 5);      // past the fifth level you are learning to hurt people, not just to last
    if (h && h.cap === 'unbroken') { d.maxHp = Math.round(d.maxHp * 1.15); d.poise = (d.poise || 0) + 20; }
    if (h && h.cap === 'executioner') { d.dmgMul += 0.1; d.crit += 0.05; }
    if (h && h.cap === 'well') { d.regen *= 1.3; d.cdr += 0.1; }
    return d;
  };
  const lu0 = ui.levelUp;
  ui.levelUp = function () {
    const st = G.state, h = st.hero, C = G.CLASSES[h.cls], L = h.level;
    if (L <= 5) return lu0.apply(this, arguments);
    G.sfx('level');
    const d0 = G.derive(Object.assign({}, h, { level: L - 1 }), st), d1 = G.derive(h, st);
    const head = '<div class="card lvl"><div class="lvl-h"><small>THE GUILD TAKES NOTICE</small><h1>Level ' + L + '</h1><p>Max HP ' + d0.maxHp + ' → <b>' + d1.maxHp + '</b></p></div>';
    const fin = () => { G.save(); ui.levelCheck(); };
    const pool = C.l2.concat((G.EXTRA || {})[h.cls] || []).filter(id => G.ABILITIES[id] && !h.known.includes(id));
    const points = n => {
      const draw = () => {
        show(head + '<h3>Level ' + L + ' · ' + n + ' ability point' + (n === 1 ? '' : 's') + ' to place</h3><p class="dim">Yours to spend. ' + G.STAT_INFO[C.primary][0] + ' is what your class hits with.</p><div class="stats">' +
          G.STATS.map(k => '<button class="stat' + (k === C.primary ? ' prim' : '') + '" data-pick="' + k + '"' + (h.stats[k] >= 20 ? ' disabled' : '') + '><small>' + k.toUpperCase() + '</small><b>' + h.stats[k] + '</b><i>' + G.fmtMod(G.mod(h.stats[k])) + '</i><em>' + G.STAT_INFO[k][1] + '</em></button>').join('') + '</div></div>');
        on('[data-pick]', el => { h.stats[el.dataset.pick]++; n--; G.sfx('ui'); if (n > 0) draw(); else fin(); });
      };
      draw();
    };
    if (L === 7 && pool.length) {
      show(head + '<h3>Level 7 · learn one new technique</h3><p class="dim">Anything your class can be taught. Set your loadout with the Guildmaster afterwards.</p>' +
        pool.map(id => { const a = G.ABILITIES[id]; return '<div class="ab-row"><div class="ab-ic">' + (G.icon ? G.icon(a) : '') + '</div><div class="ab-tx"><b>' + a.name + '</b><p>' + a.desc + '</p></div><button class="big" data-pick="' + id + '">Learn</button></div>'; }).join('') + '</div>');
      on('[data-pick]', el => { h.known.push(el.dataset.pick); const i = h.slots.indexOf(null); if (i >= 0) h.slots[i] = el.dataset.pick; else h._newAb = 1; fin(); });
    } else if (L === 8) {
      const feats = Object.keys(G.FEATS).filter(k => k === 'asi' || !h.feats.includes(k));
      show(head + '<h3>Level 8 · a second feat</h3><p class="dim">A flat, permanent bonus.</p>' + feats.map(k => '<div class="ab-row"><div class="ab-ic pas">✦</div><div class="ab-tx"><b>' + G.FEATS[k].name + '</b><p>' + G.FEATS[k].desc + '</p></div><button class="big" data-pick="' + k + '">Take</button></div>').join('') + '</div>');
      on('[data-pick]', el => { const k = el.dataset.pick; if (k === 'asi') h.stats[C.primary] += 2; else h.feats.push(k); fin(); });
    } else if (L === 10) {
      show(head + '<h3>Level 10 · your capstone</h3><p class="dim">The last thing the pit can teach you. Permanent.</p>' + Object.keys(CAPS).map(k => '<div class="ab-row"><div class="ab-ic pas">♛</div><div class="ab-tx"><b>' + CAPS[k][0] + '</b><p>' + CAPS[k][1] + '</p></div><button class="big" data-pick="' + k + '">Take</button></div>').join('') + '</div>');
      on('[data-pick]', el => { h.cap = el.dataset.pick; fin(); });
    } else points(2);
  };

  // ------------------------------------------------------------ nothing all at once
  const rk = n => st => G.rankOf(st.respect) >= n, won = st => Object.keys(st.wins || {}).length > 0;
  // key: [name, when, what you are told while it is shut, what you are told the first time, how it works (codex), spot label]
  const UN = {
    board: { name: 'the Notice Board', when: won, need: 'your first win', shut: 'The board is for fighters. Nobody has pinned anything for you yet, because nobody knows whether you will last the night. Win a bout.', intro: 'Now that you have a win, the Guild lets you read the board. Take <b>one contract</b> at a time: a condition for your next bout, and a purse if you meet it. A lost bout voids it.', spot: /Notice/ },
    cook: { name: 'Big Hobb’s Pot', when: won, need: 'your first win', shut: 'Big Hobb does not look up. “Fighters eat here. You have not fought anybody yet. Come back with a win and an appetite.”', intro: '“Sit. Winners eat.” A meal from the pot lasts for your <b>next bout</b> only. One meal at a time; choose it for the fight you expect.', spot: /Hobb/ },
    tally: { name: 'the Low Lamp and your Tally', when: rk(1), need: rankName(1), shut: 'The Low Lamp is where people with followers go. You do not have any. Nobody follows Fresh Meat.', intro: 'A Scrapper is worth following. The people who owe you are your <b>Tally</b>. Give each one work here; it resolves after your next bout or two. One of them can stand as your <b>Second</b> in the pit.', spot: /Low Lamp/ },
    apoth: { name: 'the Apothecary', when: rk(1), need: rankName(1), shut: 'The apothecary covers the bottles with a cloth. “I do not sell to people the Guild has not ranked. If you die of it they blame me.”', intro: 'Tonics change your <b>next bout</b>: tougher, faster, harder-hitting, steadier. One tonic at a time, used up win or lose.', spot: /Apothecary/ },
    mark: { name: 'Marc’s table', when: rk(2), need: rankName(2), shut: 'The man at the card table looks you over and goes back to his cards. “No offence, bro. I only take money off people who have some. Come back Bloodied.”', spot: /Marc/ },
    wisp: { name: 'the Wisp Table', when: rk(2), need: rankName(2), shut: 'A lean-to full of blue light, and a rope across the door. A sign on the rope reads: BLOODIED AND ABOVE. MANAGEMENT IS MARK.', intro: 'Marc’s dice room. The wispdice glow with whatever they land on. Stake <b>coin or chits</b>; the dealer has to chase your total, so it is nearly fair. Nearly.', spot: /Wisp/ },
    armory: { name: 'the Armoury', when: rk(2), need: rankName(2), shut: 'The Fence taps a locked rack. “Those are for people who will be alive to pay the second instalment. Bloodied. Then we talk.”', intro: 'Every weapon changes your <b>basic attack</b>: reach, speed, weight and what the heavy blow does. Use one in bouts to raise its <b>mastery</b>.' },
    tailor: { name: 'the Tailor', when: rk(2), need: rankName(2), shut: '“Dress you? As what? Nobody knows who you are yet.” The tailor goes back to her hem. Come back Bloodied.', intro: 'Dyes, hoods, cloaks, weapon finishes and auras. None of it wins a bout. All of it is how the crowd knows you.' },
    outfit: { name: 'the Outfitter', when: rk(3), need: rankName(3), shut: 'Kits are fitted, and fitting costs the Outfitter an afternoon. He spends afternoons on Enforcers.', intro: 'A <b>kit</b> is what you wear into the pit. Each trades one thing for another: weight for speed, protection for breath. There is no best one, only the right one for tonight.' },
    charms: { name: 'the charm seller', when: rk(3), need: rankName(3), shut: 'She closes the tray. “They choose who they go home with, and they do not know you. Be somebody first. Enforcer would do.”', intro: 'A charm is one small rule bent in your favour. You can own many and wear <b>one</b>.', spot: /Charms/ },
    whisper: { name: 'Whisper', when: rk(3), need: rankName(3), shut: 'The hooded figure does not turn round. Whisper sells to people worth lying to. That starts at Enforcer.', intro: 'Whisper sells what your next opponent would rather you did not know. A <b>scouted</b> fighter is easier to read in the pit.', spot: /Whisper/ },
    trainer: { name: 'techniques for hire', when: rk(3), need: rankName(3), shut: 'The Fence knows people who teach. They do not teach anyone below Enforcer; it is bad for their names when the pupil dies.', intro: 'Old fighters will teach you a technique for coin. Learned moves go on your list; choose which three you carry with the Guildmaster.' }
  };
  const KEYS = Object.keys(UN);
  KEYS.forEach(k => { const i = G.RANKS.findIndex(r => r.name === UN[k].need); if (i > 0) UN[k].rank = i; });
  const open = (k, st) => !!(st && st.hero && UN[k].when(st));
  G.unlocked = k => !UN[k] || open(k, G.state);
  G.UNLOCKS = UN;
  const lockCard = k => { const x = UN[k]; G.sfx('ui'); show('<div class="card small locked-card"><small class="over">Not yet</small><h2>' + x.name.charAt(0).toUpperCase() + x.name.slice(1) + '</h2><p>' + x.shut + '</p><p class="note">Opens at <b>' + x.need + '</b>.' + (x.rank ? ' ' + Math.max(0, G.RANKS[x.rank].at - Math.round(G.state.respect)) + ' respect to go.' : '') + '</p><div class="row end"><button class="big" id="x">Back</button></div></div>'); on('#x', () => { ui.close(); if (ui.topbar) ui.topbar(); }); };
  const gate = (fn, keyOf) => {
    const f0 = ui[fn]; if (!f0) return;
    ui[fn] = function () {
      const st = G.state, k = keyOf.apply(null, arguments), self = this, args = arguments; if (!k || !st || !st.hero) return f0.apply(this, arguments);
      if (!open(k, st)) return lockCard(k);
      const seen = st.seen || (st.seen = {});
      if (!seen[k]) { seen[k] = 1; G.save(); if (UN[k].intro) { G.sfx('page'); show('<div class="card small"><small class="over">New to you</small><h2>' + UN[k].name.charAt(0).toUpperCase() + UN[k].name.slice(1) + '</h2><p>' + UN[k].intro + '</p><p class="dim">Written into your Codex.</p><div class="row end"><button class="big" id="ok">Go on</button></div></div>'); on('#ok', () => ui[fn].apply(self, args)); return; } }
      return f0.apply(this, arguments);
    };
  };
  gate('board', () => 'board'); gate('vendor', w => w === 'cook' ? 'cook' : 'apoth'); gate('tally', () => 'tally'); gate('mark', () => 'mark'); gate('wisp', () => 'wisp');
  gate('armory', () => 'armory'); gate('tailor', () => 'tailor'); gate('outfitter', () => 'outfit'); gate('charms', () => 'charms'); gate('whisper', () => 'whisper'); gate('trainer', () => 'trainer');
  // the Fence's back rooms show as shut until they are not
  { const sh0 = ui.shop; ui.shop = function () { const r = sh0.apply(this, arguments), st = G.state; if (!st || !st.hero) return r;
      const mark = (el, k) => { if (!el || open(k, st)) return; const b = el.tagName === 'BUTTON' ? el : el.querySelector('button'); if (el.classList.contains('ab-row')) el.classList.add('locked'); if (b) b.textContent = b.textContent.replace(/ ·.*$/, '') + ' · ' + UN[k].need; };
      document.querySelectorAll('#panel .ab-row').forEach(el => { const t = (el.querySelector('b') || {}).textContent || ''; if (/Armoury/.test(t)) mark(el, 'armory'); if (/Outfitter/.test(t)) mark(el, 'outfit'); if (/Tailor/.test(t)) mark(el, 'tailor'); });
      document.querySelectorAll('#panel .foot button, #panel .row.end button').forEach(b => { if (/Learn techniques/.test(b.textContent)) mark(b, 'trainer'); if (/Tailor/.test(b.textContent)) mark(b, 'tailor'); });
      return r; }; }
  // the Crown does not ask a tithe of people it has never heard of
  { const s0 = ui.stair; if (s0) ui.stair = function () { const r = s0.apply(this, arguments), b = document.querySelector('#panel #ti'); if (b && G.rankOf(G.state.respect) < 4) { const rowEl = b.closest('.ab-row'); if (rowEl) { rowEl.classList.add('locked'); b.disabled = true; b.textContent = rankName(4) + ' and above'; } } return r; }; }
  // market spots: a shut door says so before any scene plays
  const hub0 = G.world.buildHub;
  G.world.buildHub = function () {
    const h = hub0.apply(this, arguments);
    h.spots.forEach(sp => { const k = KEYS.find(q => UN[q].spot && UN[q].spot.test(sp.label)); if (!k) return; const go0 = sp.go, act0 = sp.act, badge0 = sp.badge;
      sp.go = () => open(k, G.state) ? go0() : lockCard(k);
      sp.isLocked = () => !open(k, G.state);
      Object.defineProperty(sp, 'act', { get: () => open(k, G.state) ? act0 : 'Not open to you yet' });
      sp.badge = () => open(k, G.state) && (!(G.state.seen || {})[k] || !!(badge0 && badge0())); });
    return h;
  };
  // Marc does not come looking for you before he will deal with you
  if (G.story && G.story.pending) { const p0 = G.story.pending; G.story.pending = function (st) { const b = p0.apply(this, arguments); return b && /mark|partner/.test(b.id) && !open('mark', st) ? null : b; }; }
  // tell the player when a door opens
  const uh0 = ui.hub;
  ui.hub = function () {
    const r = uh0.apply(this, arguments), st = G.state; if (!st || !st.hero) return r;
    const now = KEYS.filter(k => open(k, st));
    if (!st.unl) { st.unl = {}; now.forEach(k => { st.unl[k] = 1; }); if (won(st)) { st.seen = st.seen || {}; now.forEach(k => { st.seen[k] = 1; }); } G.save(); return r; }   // a fighter from before this existed already knows the market
    const fresh = now.filter(k => !st.unl[k]);
    if (fresh.length) { fresh.forEach(k => { st.unl[k] = 1; }); G.save(); setTimeout(() => { if (!G.talk) { G.sfx('page'); const nm = fresh.map(k => UN[k].name); ui.toast('Now open to you: ' + (nm.length > 3 ? nm.slice(0, 2).join(', ') + ' and ' + (nm.length - 2) + ' more' : nm.join(', ')) + '.'); } }, 1400); }
    return r;
  };
  if (G.LORE) {
    const seen = k => st => !!(st.seen || {})[k];
    G.LORE.push(
      { sec: 'How Things Work', title: 'The Undercard', unlock: st => (st.under || []).some(n => n > 0), body: 'The Guild does not waste a named fighter on somebody who might not turn up. Before each of the five names you fight the undercard: debtors, pit-hands and hired bruisers at about your own weight. Two bouts earn you Grubb. It takes four to earn the champion. After that you may keep fighting the undercard for smaller purses, which is how most people pay for their gear.' },
      { sec: 'How Things Work', title: 'Contracts on the Board', unlock: seen('board'), body: 'One contract at a time, taken before a bout: win quickly, win untouched, win with a finisher. Meet the condition and the Guild pays on top of the purse. Lose and the paper is void.' },
      { sec: 'How Things Work', title: 'A Meal Before', unlock: seen('cook'), body: 'Big Hobb’s pot never empties and is never washed. A bowl lasts one bout. Fighters are superstitious about which bowl.' },
      { sec: 'How Things Work', title: 'Your Tally', unlock: seen('tally'), body: 'Everybody in the Undercity owes somebody. The people who owe you are your Tally. Set them to work at the Low Lamp and they report after your next bout or two, with coin, news or bruises. One may stand as your Second and step into the pit once when you call.' },
      { sec: 'How Things Work', title: 'Tonics', unlock: seen('apoth'), body: 'Ironbark, quickroot, redcap, clear head. One at a time, good for one bout, and used up whether you win or not. The apothecary will not say what is in them and it is better that way.' },
      { sec: 'How Things Work', title: 'The Wispdice', unlock: seen('wisp'), body: 'Glass dice with a marsh-light sealed inside each. Thirteen, Twenty-One and Poker Bones are all played against a dealer who must chase your total. Marc insists this makes it fair. Marc also owns the dice.' },
      { sec: 'How Things Work', title: 'Arms and Mastery', unlock: seen('armory'), body: 'A weapon decides how you strike: reach, tempo, weight, and what a held blow does when you let it go. Fight with one and you learn it; five ranks of mastery, each worth a little more damage and, late on, something else.' },
      { sec: 'How Things Work', title: 'Being Seen', unlock: seen('tailor'), body: 'The crowd cannot tell two fighters apart by their footwork. They can by a red hood. The tailor sells the difference.' },
      { sec: 'How Things Work', title: 'Kits', unlock: seen('outfit'), body: 'Rags to warden’s plate. Every kit gives with one hand and takes with the other. Heavy kit soaks blows and tires you; light kit keeps your breath and none of your blood.' },
      { sec: 'How Things Work', title: 'Charms', unlock: seen('charms'), body: 'Small, odd, mostly bone. Each bends one rule slightly. Wear one. The others get jealous.' },
      { sec: 'How Things Work', title: 'Rumours', unlock: seen('whisper'), body: 'Whisper sells the habits of whoever is next on your page. A scouted opponent gives more away before they swing.' },
      { sec: 'How Things Work', title: 'Teachers', unlock: seen('trainer'), body: 'Retired fighters with one good trick each and a landlord. They will teach it for coin. You still only carry three techniques into the pit.' },
      { sec: 'How Things Work', title: 'Ten Levels', unlock: st => st.hero && st.hero.level >= 6, body: 'The first five levels make you a fighter: a technique, a calling, a feat, the move they will remember you for. The next five are yours to shape: ability points placed where you choose, another technique, a second feat, and at the tenth a capstone. Each level past the fifth also adds 3% to everything you hit with.' }
    );
  }
})();
