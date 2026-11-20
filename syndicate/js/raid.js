// Guttercrown — the Oracle's work: expeditions your Tally rides out on once you are his, and the heat that comes home with them
(function () {
  const G = window.G, ui = G.ui, O = G.oracle, crew = G.crew, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  if (!O || !crew) return;
  const pick = a => a[Math.floor(Math.random() * a.length)], d20 = () => 1 + Math.floor(Math.random() * 20), NAME = 'David Roseinbeirg';
  const tied = st => !!(st.signed || st.bound);
  const heat = st => st.heat || 0, HMAX = 10;
  const addHeat = (st, n) => { st.heat = Math.max(0, Math.min(HMAX, heat(st) + n)); st.heatT = 0; };
  const HEATNAME = h => h >= 8 ? 'Hunted' : h >= 5 ? 'Watched' : h >= 3 ? 'Talked about' : h >= 1 ? 'Noticed' : 'Unknown above';
  const PLACES = ['Fenrow', 'Low Barrow', 'the Ash Fields', 'Marrowmere', 'Saltkettle', 'Harrow’s Ford', 'Thistledown', 'Greywick', 'the Hollow Stones', 'Cold Orchard'];
  const TRIBES = ['the Reed Folk', 'the Hill Kin', 'the Stone Walkers', 'the People of the Long Grass'];

  // ------------------------------------------------------------ the three expeditions
  const RAIDS = {
    caravan: { name: 'Rob a Wizard-Gold Caravan', desc: 'The crowns pay their court mages in wizard gold. It travels by road. Take it.', fights: 2, dc: 13, gain: 'wizard gold', heat: 1 },
    tribes: { name: 'Harry the Tribes', desc: 'Ride on the folk of the outlands and take prisoners for ransom.', fights: 2, dc: 12, gain: 'ransom', heat: 1 },
    burn: { name: 'Burn a Village', desc: 'Empty a village so the land stands clear. He wants it empty. He does not say for whom.', fights: 3, dc: 14, gain: 'terror, wizard gold', heat: 3 }
  };
  Object.keys(RAIDS).forEach(id => { const r = RAIDS[id]; r.id = id; r.raid = 1; G.JOBS.push(r); });
  G.RAIDS = RAIDS;

  function resolve(st, t, i) {
    const job = RAIDS[t.job.id], roll = d20(), bonus = t.skill, total = roll + bonus, ok = roll !== 1 && (roll === 20 || total >= job.dc), place = pick(PLACES);
    const r = { who: t.name, job: job.name, roll, bonus, dc: job.dc, ok, text: '' };
    st.raids = (st.raids || 0) + 1; t.job = null;
    if (!ok) {
      addHeat(st, 1);
      if (roll === 1 && job.id === 'burn') { r.text = 'did not come back from ' + place + '. The folk there were waiting. Somebody new will swear to your Tally; it will not be the same somebody.'; st.tally.splice(i, 1); if (st.second === i) st.second = null; else if (st.second > i) st.second--; r.lost = 1; }
      else { t.skill = Math.max(1, t.skill - 1); r.text = pick(['came back bleeding and empty-handed. They were expected.', 'was driven off, and followed half the way home.', 'says the road was watched. Skill drops while the wound heals.']) + ' Skill is now ' + t.skill + '.'; }
      return r;
    }
    addHeat(st, job.heat);
    if (job.id === 'caravan') { const g = 1 + (roll + bonus >= job.dc + 6 ? 1 : 0); st.wgold = (st.wgold || 0) + g; r.text = 'took the caravan on the ' + place + ' road. <b>+' + g + ' wizard gold</b>. The drivers were left alive to say who did it.'; }
    else if (job.id === 'tribes') { const c = 110 + Math.floor(Math.random() * 90) + t.skill * 10; st.coin += c; r.text = 'rode on ' + pick(TRIBES) + ' and came back with prisoners. Their kin paid. <b>+' + c + ' coin</b> in ransom, and every one of them went home knowing your name.'; }
    else { st.terror = (st.terror || 0) + 1; st.wgold = (st.wgold || 0) + 1; st.burned = (st.burned || []).concat(place).slice(-12); r.text = 'burned ' + place + '. Nobody lives there now. <b>+1 wizard gold</b> from the Oracle, who is delighted. The smoke could be seen from the Long Stair.';
      if (heat(st) >= 3 && !st.grudge) st.grudge = { n: (st.grudges || 0) + 1, place }; }
    if (job.id !== 'burn' && heat(st) >= 5 && !st.grudge && Math.random() < 0.4) st.grudge = { n: (st.grudges || 0) + 1, place };
    return r;
  }
  const tick0 = crew.tick;
  crew.tick = function () {
    const st = G.state; st.reports = st.reports || [];
    if (heat(st) > 0) { st.heatT = (st.heatT || 0) + 1; if (st.heatT >= 3) { st.heat = heat(st) - 1; st.heatT = 0; } }      // people forget, slowly, if you let them
    for (let i = (st.tally || []).length - 1; i >= 0; i--) { const t = st.tally[i]; if (t.job && RAIDS[t.job.id] && t.job.left <= 1) st.reports.push(resolve(st, t, i)); }
    return tick0.apply(this, arguments);
  };

  // ------------------------------------------------------------ the Tally: his work appears once you are his
  const tally0 = ui.tally;
  ui.tally = function () {
    const r = tally0.apply(this, arguments), st = G.state, card = document.querySelector('#panel .card'); if (!card || card.classList.contains('locked-card') || !st.tally) return r;
    const btns = [...card.querySelectorAll('[data-job]')].filter(b => RAIDS[b.dataset.job.split(':')[1]]);
    if (!tied(st)) { btns.forEach(b => b.remove()); return r; }
    btns.forEach(b => b.classList.add('raid'));
    const p = card.querySelector('p.dim');
    if (p) { const n = document.createElement('p'); n.className = 'note raidnote'; n.innerHTML = '<b>The Oracle’s work</b> is marked in gold. It pays in wizard gold, ransom and terror, and it raises <b>heat</b>: ' + heatLine(st); p.parentNode.insertBefore(n, p.nextSibling); }
    if (!st.raidSeen) { st.raidSeen = 1; G.save(); const back = () => ui.tally();
      show('<div class="card small"><small class="over">New to you</small><h2>The Oracle’s Work</h2><p>Your Tally will now ride out past the walls. <b>Caravans</b> carry wizard gold, which pays down souls. <b>Tribes</b> yield prisoners, and prisoners yield ransom. <b>Villages</b> burn, and he wants them burned.</p><p>None of it is clean. Every expedition raises <b>heat</b>: the Wardens watch you, the honest stalls charge you more, and sooner or later somebody you wronged comes up the Ledger with your name in their mouth.</p><div class="row end"><button class="big" id="ok">Go on</button></div></div>'); on('#ok', back); }
    return r;
  };
  const heatLine = st => '<b>' + heat(st) + '</b> of ' + HMAX + ' (' + HEATNAME(heat(st)) + ')' + (heat(st) ? '. It cools by one every three bouts you leave the outlands alone.' : '.');

  // ------------------------------------------------------------ what heat does
  // honest stalls charge a known raider more
  if (G.BOONS) { const v0 = ui.vendor; ui.vendor = function () { const st = G.state, h = heat(st); Object.keys(G.BOONS).forEach(k => { const x = G.BOONS[k]; if (x.cost0 == null) x.cost0 = x.cost; x.cost = Math.round(x.cost0 * (1 + 0.06 * h) * (G.priceMul ? G.priceMul(k, x) : 1)); });
    const r = v0.apply(this, arguments), p = document.querySelector('#panel .card:not(.locked-card) .mk-top p.dim'); if (p && h >= 1) p.innerHTML += ' <span class="heat">Prices are up ' + Math.round(h * 6) + '% for you. Word travels.</span>'; return r; }; }
  // the Wardens stop you at the Long Stair
  const af0 = ui.afterFight;
  ui.afterFight = function () {
    const st = G.state, h = heat(st);
    if (st.hero && G.afterFight && h >= 5 && !st.markReport && !(st.reports || []).length && Math.random() < 0.4) {
      G.afterFight = false; const fine = h * 15, rep = h * 3;
      show('<div class="card small letter event"><h2>The Seal-Wardens</h2><p>Two of them, in step, across your road home. “There has been smoke in the outlands,” says the taller one. “The throne does not ask who. The throne asks that it be paid for.” A gauntleted hand, palm up.</p><div class="choices"><button data-c="pay"' + (st.coin < fine ? ' disabled' : '') + '><b>Pay the fine</b><small>' + fine + ' coin · heat −1</small></button><button data-c="no"><b>Walk past them</b><small>−' + rep + ' respect · they remember</small></button></div></div>');
      on('[data-c]', el => { const pay = el.dataset.c === 'pay'; if (pay) { st.coin -= fine; st.heat = Math.max(0, h - 1); } else st.respect = Math.max(G.RANKS[G.rankOf(st.respect)].at, st.respect - rep); G.save(); G.sfx(pay ? 'coin' : 'deny');
        show('<div class="card small letter event"><h2>The Seal-Wardens</h2><p>' + (pay ? 'They count it without looking at you and stand aside. A little of the smoke clears from your name.' : 'They let you pass. They write something down. Everyone on the street watches them do it.') + '</p><div class="row end"><button class="big" id="x">Carry on</button></div></div>'); on('#x', () => { ui.close(); ui.topbar(); }); });
      return;
    }
    return af0.apply(this, arguments);
  };
  const stair0 = ui.stair;
  if (stair0) ui.stair = function () { const r = stair0.apply(this, arguments), st = G.state, pr = document.querySelector('#panel .proc'); if (pr && heat(st) >= 1) { const p = document.createElement('p'); p.className = 'note'; p.innerHTML = 'The Wardens look at you a moment longer than they used to. Heat: ' + heatLine(st); pr.parentNode.insertBefore(p, pr.nextSibling); } return r; };

  // somebody you wronged comes up the Ledger
  const GN = ['Aldith', 'Corwen', 'Hale', 'Brenna', 'Osric', 'Mave', 'Tolan', 'Ysolt'];
  function grudgeOpp(st) {
    const g = st.grudge, h = st.hero, cls = g.n % 2 ? 'fighter' : 'cleric', C = G.CLASSES[cls], name = GN[g.n % GN.length] + ' of ' + g.place;
    const o = { id: 'gr' + g.n, name, title: 'who has not come for the purse', cls, race: 'human', level: Math.max(1, h.level - 1), known: C.start.slice(0, 2).concat(C.l2.slice(0, 1)), hpMul: +(0.95 + 0.04 * heat(st)).toFixed(2), dmgMul: 0.8,
      ai: { react: 0.36, aggro: 0.8, dodge: 0.1 }, xp: 90, coin: 15, respect: 0, taunt: 'You do not know my name. You burned the place it was known in.', tint: { cloth: '#6a6258', armor: '#4a463e' }, grudge: g.n };
    G.BIOS[o.id] = name + ' sold what was left to buy a place on the Ledger. There is no debt behind it and no purse in front of it. The Guild took the fee anyway.';
    return o;
  }
  const pit0 = ui.pit;
  ui.pit = function () {
    const r = pit0.apply(this, arguments), st = G.state, lad = document.querySelector('#panel .ladder'); if (!st.grudge || !lad) return r;
    const o = grudgeOpp(st), row = document.createElement('div'); row.className = 'opp grudge cur';
    row.innerHTML = '<span class="op"></span><div class="opp-tx"><b>' + o.name + '</b> <small>' + o.title + '</small><small>Level ' + o.level + ' ' + G.RACES[o.race].name + ' ' + G.clsName(o) + ' · a grudge</small><em class="taunt">“' + o.taunt + '”</em><small class="rew">' + o.xp + ' XP · ' + o.coin + ' coin · heat −2 · the named fighters wait until this is settled</small></div><button class="big">Answer it</button>';
    row.querySelector('.op').appendChild(G.portrait({ cls: o.cls, race: o.race, tint: o.tint }, 56, 1.2)); row.querySelector('button').onclick = () => { G.sfx('ui'); ui.prefight(o); };
    lad.insertBefore(row, lad.firstChild);
    lad.querySelectorAll('[data-fight]').forEach(b => { if (/^Fight$/.test(b.textContent)) { const s = document.createElement('span'); s.className = 'lock'; s.textContent = 'Grudge first'; b.parentNode.replaceChild(s, b); } });
    for (let e = lad.parentNode; e && e.id !== 'ui'; e = e.parentNode) e.scrollTop = 0;
    return r;
  };
  const res0 = ui.results;
  ui.results = function (r) {
    const st = G.state;
    if (r && r.opp && r.opp.grudge && r.win && st.grudge && st.grudge.n === r.opp.grudge) { st.grudges = st.grudge.n; st.grudge = null; st.heat = Math.max(0, heat(st) - 2); G.save(); }
    const out = res0.apply(this, arguments);
    if (r && r.opp && r.opp.grudge && r.win) { const q = document.querySelector('#panel .card.res .quote'); if (q) q.textContent = 'The crowd does not cheer this one. ' + r.opp.name + ' is carried out by people who came down from the outlands to do it.'; }
    return out;
  };

  // ------------------------------------------------------------ his cellar: wizard gold pays souls, and a clean ledger buys his favour
  O.favour = st => tied(st) && O.debt(st) === 0 && (st.raids || 0) > 0;
  const or0 = ui.oracle;
  ui.oracle = function (line) {
    const r = or0.apply(this, arguments), st = G.state, card = document.querySelector('#panel .card'); if (!card || !tied(st)) return r;
    const end = card.querySelector('.row.end'), wg = st.wgold || 0, d = O.debt(st), mk = h => { const e = document.createElement('div'); e.className = 'ab-row'; e.innerHTML = h; end.parentNode.insertBefore(e, end); return e; };
    const pay = mk('<div class="ab-ic pas">✦</div><div class="ab-tx"><b>Pay in wizard gold</b><small>You hold ' + wg + ' · one piece clears one soul</small><p>The only coin he prefers to coin. Your Tally brings it home from the outlands.</p></div><button class="big"' + (wg < 1 || d < 1 ? ' disabled' : '') + '>Give 1</button>');
    pay.querySelector('button').onclick = () => { if ((st.wgold || 0) < 1 || O.debt(st) < 1) return; st.wgold--; st.soulDebt = O.debt(st) - 1; G.save(); G.sfx('coin'); ui.oracle(pick(['He holds it to the lamp, then licks it. “Theirs. Now mine. Everything ends up mine.”', '“Minted by the swine who threw me out. I am going to buy their graves with it.”', 'He bites it and grins, gold between his teeth. “One soul lighter. Do not get comfortable.”'])); };
    mk('<div class="ab-ic pas">♜</div><div class="ab-tx"><b>The land he wants</b><small>Villages burned: ' + (st.terror || 0) + ' · expeditions: ' + (st.raids || 0) + ' · heat ' + heat(st) + ' of ' + HMAX + '</small><p>' + (O.favour(st) ? '<b>You owe him nothing, and he is pleased:</b> +8% damage and +8% coin from every bout while it stays that way.' : 'Owe him nothing and keep his work going, and he grants his favour: +8% damage and +8% coin.') + (st.burned && st.burned.length ? ' <span class="dim">Empty now: ' + st.burned.join(', ') + '.</span>' : '') + '</p></div>');
    return r;
  };
  const fs0 = G.fight.start;
  G.fight.start = function (o) { const r = fs0.apply(this, arguments), st = G.state, P = G.fight.P; if (P && !G.fight.ex && !(o && o.spar) && O.favour(st)) { P.d.dmgMul *= 1.08; P.d.coinMul *= 1.08; } return r; };
  // he has opinions about the reports
  const rep0 = ui.reports;
  ui.reports = function () {
    const st = G.state, rs = (st.reports || []).slice(), raid = rs.filter(r => Object.keys(RAIDS).some(k => RAIDS[k].name === r.job));
    const out = rep0.apply(this, arguments);
    if (raid.length) { const end = document.querySelector('#panel .card .row.end'); if (end) { const p = document.createElement('p'); p.className = 'quote'; const ok = raid.some(r => r.ok);
      p.textContent = '“' + (raid.some(r => r.lost) ? 'One of yours did not come back? Good. Fewer mouths. Send another. There are always more of you.' : ok ? pick(['Ha! I can hear them squealing from here. Everybody has something, pet. You only have to go and take it off the body.', 'Burn it, rob it, drag it home. That is what lesser people are FOR.', 'Empty land. No bleating. No smell. Do you know how hard I am smiling? It hurts.']) : pick(['Nothing? You sent men and they brought me NOTHING? I have wiped better soldiers off my heel.', 'Send harder bastards. Or the same ones, with something to be afraid of. Me, for instance.'])) + '” — ' + NAME; end.parentNode.insertBefore(p, end); } }
    return out;
  };
  const obj0 = G.objective;
  G.objective = function () { const s = obj0.apply(this, arguments), st = G.state; if (st && st.hero && st.grudge && G.scene !== 'hideout' && typeof s === 'string' && /Blood Pit|Ledger|fight /.test(s)) return 'A grudge has come up the Ledger. Answer it at the Blood Pit'; return s; };

  if (G.LORE) G.LORE.push(
    { sec: 'How Things Work', title: 'The Oracle’s Work', unlock: st => !!st.raidSeen, body: 'Once you are his, your Tally can be sent past the walls. A caravan robbed brings wizard gold, and one piece of it clears one soul from your debt. Tribes harried bring prisoners, held until their kin pay. A village burned is what he actually wants: land with nobody on it. A failed expedition costs your Tallyman skill, and sometimes more.' },
    { sec: 'How Things Work', title: 'Heat', unlock: st => (st.raids || 0) > 0, body: 'The outlands are far away and the news still arrives before your riders do. Heat runs from nought to ten. The honest stalls charge you more for every point. At five the Seal-Wardens start meeting you on the road home. And when it is high enough, somebody who lost everything will buy a line on the Ledger and call you out; the Guild will not match you against a named fighter until you have answered. Heat cools by one for every three bouts you leave the outlands alone.' },
    { sec: 'The World', title: 'The Outlands', unlock: st => (st.raids || 0) > 0, body: 'Beyond the walls of Highmarch the Kingdom of United Realms is mostly weather: reed-beds, hill pasture, villages of forty people and a well. The throne taxes them and otherwise forgets them. Fenrow, Low Barrow, Marrowmere, Greywick. The tribes of the long grass were there before the kingdom and expect to be there after it. None of them have ever heard of the Blood Pit. Some of them have now heard of you.' },
    { sec: 'The World', title: 'Wizard Gold', unlock: st => (st.wgold || 0) > 0 || (st.raids || 0) > 0, body: 'Paler than coin gold and faintly warm. Both crowns mint it for their court mages, because spells that will not take ordinary gold will take this. The hourglass houses used to be paid in nothing else. David Roseinbeirg counts every piece twice and remembers who struck it.' },
    { sec: 'The World', title: 'What Was Burned', unlock: st => (st.terror || 0) > 0, body: 'He calls it clearing. The word in the outlands is different. Each village your riders empty is a place his houses can be given when the throne is yours to give with, and each one is also forty people on the road with nothing, telling everyone they meet whose riders it was. The Ledger-Keeper has started keeping a second page on you. Nobody asked for it.' }
  );
  if (G.TIPS) G.TIPS.push('Heat cools if you leave the outlands alone for three bouts.');
})();
