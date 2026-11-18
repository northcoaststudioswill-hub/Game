// Guttercrown — moments: scenes that find you between bouts (a rival, Marc in trouble, a man in a plain cloak),
// Marc's loyalty tiers and partnership, and the strongbox and other things a home is for
(function () {
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), mk = G.mark;
  const S = (who, name, text, shot) => ({ who, name, text, shot });
  const bouts = st => Object.keys(st.wins).reduce((n, k) => n + st.wins[k], 0) + (st.losses || 0);
  const flags = st => st.story || (st.story = {});
  const RIVAL = { cls: 'fighter', race: 'human', tint: { cloth: '#1a5a6a', armor: '#2a3a44', armor2: '#16222a', trim: '#e8d8b0', hair: '#d8b45a' }, gear: { weapon: 1, armor: 1 }, arm: 'f_spear' };
  const rivalOpp = lvl => ({ id: 'ferren', name: 'Ferren Voss', title: 'the Last New Name', cls: 'fighter', race: 'human', level: lvl, sub: 'battlemaster', known: ['shield_bash', 'cleave'].concat(lvl >= 4 ? ['leap_slam'] : []), arm: 'f_spear', hpMul: 0.9, dmgMul: 0.7, ai: { react: 0.38, aggro: 0.6, dodge: 0.25, guard: 0.3, parry: 0.16 }, xp: 0, coin: 0, respect: 0, spar: true, look: RIVAL, tint: RIVAL.tint, taunt: '' });
  const CLOAK = { cls: 'rogue', race: 'human', tint: { cloth: '#4a4a52', armor: '#33333a', armor2: '#26262c', hair: '#8a8a90' }, cos: { head: 'hood', back: 'greatcloak' } };
  const back = () => { document.getElementById('hud').className = 'hidden'; ui.hub(); };
  const card = (title, text, got) => { show('<div class="card small letter event"><h2>' + title + '</h2><p>' + text + '</p>' + (got ? '<p class="got">' + got + '</p>' : '') + '<div class="row end"><button class="big" id="x">Carry on</button></div></div>'); on('#x', () => { ui.close(); ui.topbar(); }); };

  // each beat: when it can fire, and the scene. One beat at most per return to the market.
  const BEATS = [
    { id: 'keeper1', when: st => bouts(st) >= 1 && Object.keys(st.wins).length >= 1, scene: (st, done) => ({ place: 'hub', npc: [20.4, -0.2], you: [20.4, 2.4], lines: [
        S('npc', 'The Ledger-Keeper', 'One line struck. I did it with my own pen, as promised. You may look, if you like.', 'npc'),
        S('you', st.hero.name, 'It does not look like much.', 'you'),
        S('npc', 'The Ledger-Keeper', 'It never does. Queen Eerin Koheneim reads this page on the first of every month. She has never asked about a name before its third line. Give her a reason.', 'ots'),
        S('npc', 'The Ledger-Keeper', 'The Guild returns the cost of the stretcher you did not need. Do not spend it on Marc.', 'npc')],
      done: () => { st.coin += 25; G.save(); done(); card('A Line Struck', 'The Keeper counts out the stretcher money, coin by coin, and writes that down too.', '+25 coin'); } }) },
    { id: 'rival1', when: st => Object.keys(st.wins).length >= 2, scene: (st, done) => ({ place: 'arena', npc: [-1.7, -1.5], you: [1.8, 1.8], spawn: { look: RIVAL }, lines: [
        S('', '', 'The pit is empty at this hour. Almost.', 'wide'),
        S('npc', 'Ferren Voss', 'So you are the new name. Funny. A season ago that was me. Then you turned up, and the crowd forgot how to spell mine.', 'npc'),
        S('you', st.hero.name, 'Then fight better.', 'you'),
        S('npc', 'Ferren Voss', 'I intend to. Tonight, no Ledger, no crowd, no dying. Just you, me, and which of us the sand remembers. Unless you would rather not find out.', 'low')],
      choices: [{ label: 'Find out', go: () => { done(); rivalDuel(st, 1); } }, { label: 'Not tonight', go: () => { flags(st).rival1 = 0; flags(st).rivalAsk = bouts(st) + 2; G.save(); back(); } }], done: () => { flags(st).rival1 = 0; flags(st).rivalAsk = bouts(st) + 2; G.save(); back(); } }) },
    { id: 'markdebt', when: st => (st.met || {}).mark && bouts(st) >= 3, scene: (st, done) => ({ place: 'hub', npc: [25.6, -0.5], you: [25.6, 2.6], lines: [
        S('', '', 'Two Guild collectors are leaning on Marc’s table. One of them is holding his dice. The other is holding Marc.', 'wide'),
        S('npc', 'Marc dé Fleuprau', 'Bro. BRO. Perfect timing. Tell these gentlemen I am good for it. I am SO good for it. I just need eighty coin. By, like, now.', 'npc'),
        S('you', st.hero.name, 'What happened to the house always winning?', 'you'),
        S('npc', 'Marc dé Fleuprau', 'The house had a scheme. The scheme had a cart. Look, it is a long story and one of them is standing on my foot.', 'ots')],
      choices: [
        { label: 'Cover him (80 coin)', go: () => { done(); if (st.coin < 80) return card('Short', 'You turn out your purse. It is not eighty. The collectors take what Marc has on the table instead, and Marc looks at you like a man doing arithmetic.', ''); st.coin -= 80; flags(st).markOwes = bouts(st) + 2; G.save(); card('Marc Owes You', '“I will not forget this, bro. I mean I will, I forget everything, but I am writing it on my hand.” The collectors leave. Marc breathes out for what seems like the first time today.', '−80 coin · Marc owes you'); } },
        { label: 'Stand between them', go: () => { done(); G.spar({ id: 'collector', name: 'The Collector', title: 'of the Deep Guild', cls: 'cleric', race: 'dwarf', level: Math.max(2, st.hero.level), known: ['sacred_flame', 'holy_strike'], arm: 'c_pick', hpMul: 0.9, dmgMul: 0.7, ai: { react: 0.45, aggro: 0.55, dodge: 0.12, guard: 0.3, parry: 0.1 }, xp: 0, coin: 0, respect: 0, spar: true, taunt: '' }, win => { back(); ui.close(); if (win) { st.chits = (st.chits || 0) + 80; st.respect += 10; flags(st).markFriend = 1; G.save(); card('The Guild Withdraws', 'The collector picks himself up, writes something down, and goes. Marc presses a fistful of chits on you with both hands. “That is my guy. THAT is my guy.”', '+80 chits · +10 respect'); } else { st.coin = Math.max(0, st.coin - 30); G.save(); card('The Guild Collects', 'You wake to Marc fanning you with a betting slip. The collectors took their eighty from him and thirty from you, for the inconvenience.', '−30 coin'); } }); } },
        { label: 'Not your debt', go: () => { done(); card('The Long Odds, Closed', 'Marc pays in dice, coin and one boot. “No, it is fine. It is FINE. I respect it,” he says, hopping. He does not sound like he respects it.', ''); } }], done: () => { done(); } }) },
    { id: 'markpay', when: st => flags(st).markOwes && bouts(st) >= flags(st).markOwes, scene: (st, done) => ({ place: 'hub', npc: [25.6, -0.5], you: [25.6, 2.6], lines: [
        S('npc', 'Marc dé Fleuprau', 'There he is. THERE he is. Hold out your hands. Both of them. No, cup them.', 'npc'),
        S('npc', 'Marc dé Fleuprau', 'Eighty I owed you. That is a hundred and sixty, because I am a man of honour, and a stack of chits, because I am a man of chits.', 'ots'),
        S('you', st.hero.name, 'The scheme paid?', 'you'),
        S('npc', 'Marc dé Fleuprau', 'A DIFFERENT scheme paid. Do not ask which. You are family now, bro. Family gets the good odds.', 'npc')],
      done: () => { st.coin += 160; st.chits = (st.chits || 0) + 60; flags(st).markOwes = 0; flags(st).markFriend = 1; G.save(); done(); card('Paid in Full', 'It is all there. You count it twice, which Marc finds hurtful.', '+160 coin · +60 chits'); } }) },
    { id: 'partner', when: st => flags(st).markFriend && G.rankOf(st.respect) >= 2 && !st.partner, scene: (st, done) => ({ place: 'hub', npc: [25.6, -0.5], you: [25.6, 2.6], lines: [
        S('npc', 'Marc dé Fleuprau', 'Sit. No, stand, it is a standing conversation. I have been thinking. Dangerous, I know.', 'npc'),
        S('npc', 'Marc dé Fleuprau', 'The Long Odds needs a name over the awning that people are scared of. Mine makes them laugh. Yours makes them pay up.', 'ots'),
        S('you', st.hero.name, 'You want a partner.', 'you'),
        S('npc', 'Marc dé Fleuprau', 'Three hundred coin buys you a tenth of the house. Every night you fight, the house takes bets, and you take your cut. Forever. Or until the Queen notices.', 'low')],
      choices: [{ label: 'Buy in (300 coin)', go: () => { done(); if (st.coin < 300) { flags(st).partner = 0; flags(st).partnerAsk = bouts(st) + 2; G.save(); return card('Not Yet', '“Come back when you have got it, bro. The offer stands. Mostly. I am holding it open with my foot.”', ''); } st.coin -= 300; st.partner = true; G.save(); card('Partners', 'Marc spits in his palm. You decide a nod will do. By morning there is a second name chalked under the awning, smaller than his and spelled wrong.', '−300 coin · You take a cut of the house after every bout'); } },
        { label: 'Not for me', go: () => { flags(st).partner = 0; flags(st).partnerAsk = bouts(st) + 4; G.save(); done(); card('Offer Open', '“Think about it. Think about it while I spend the money I would have given you.”', ''); } }], done: () => { done(); } }) },
    { id: 'rival2', when: st => flags(st).rivalWon != null && G.rankOf(st.respect) >= 3 && bouts(st) >= (flags(st).rivalAsk || 0), scene: (st, done) => ({ place: 'arena', npc: [-1.7, -1.5], you: [1.8, 1.8], spawn: { look: RIVAL }, lines: [
        S('npc', 'Ferren Voss', flags(st).rivalWon ? 'You put me on the sand last time. I have thought about very little else.' : 'I put you on the sand last time. You have been thinking about it. I can tell.', 'npc'),
        S('npc', 'Ferren Voss', 'They say Vilhelm van Koheneim IV watches the champion’s bout from the Guild box. I mean to be the one he watches. So do you. One of us is wrong.', 'low'),
        S('you', st.hero.name, 'Same terms?', 'you'),
        S('npc', 'Ferren Voss', 'Same terms. And the loser carries the winner’s bag to the gate, the night they fight Vexa.', 'npc')],
      choices: [{ label: 'Again, then', go: () => { done(); rivalDuel(st, 2); } }, { label: 'Another night', go: () => { flags(st).rival2 = 0; flags(st).rivalAsk = bouts(st) + 2; G.save(); back(); } }], done: () => { flags(st).rival2 = 0; flags(st).rivalAsk = bouts(st) + 2; G.save(); back(); } }) },
    { id: 'cloak', when: st => !!st.wins.brakk, scene: (st, done) => ({ place: 'arena', npc: [-1.6, -1.6], you: [1.9, 1.9], spawn: { look: CLOAK }, lines: [
        S('', '', 'A man in a plain grey cloak is standing where Brakk Ironjaw fell. The sawdust has not been swept.', 'wide'),
        S('npc', 'The Man in Grey', 'Forty fights he stood here. I signed the order that sent him down the Stair. He was the best gate-sergeant I ever had.', 'npc'),
        S('you', st.hero.name, 'Vilhelm van Koheneim IV.', 'you'),
        S('npc', 'Vilhelm van Koheneim IV', 'Down here I am a man in a cloak. My wife, Eerin Koheneim, believes this place keeps the realm quiet. I come to see what the quiet costs.', 'low'),
        S('npc', 'Vilhelm van Koheneim IV', 'One bout left between you and a brass crown. Win it and she will send you a letter. Read it carefully. She means every word, and so do I.', 'npc')],
      done: () => { st.respect += 30; G.save(); done(); back(); ui.close(); card('The Gauntlet Seal', 'He leaves a gold piece on the sand, stamped with a gauntlet. Nobody in the Undercity will take it as money. Everybody will know where you got it.', '+30 respect'); } }) }
  ];
  function rivalDuel(st, n) {
    G.spar(rivalOpp(Math.max(2, st.hero.level)), win => { back(); ui.close(); const f = flags(st); f.rivalWon = win ? 1 : 0; f.rivalAsk = bouts(st) + 2;
      if (win) { st.respect += n === 1 ? 20 : 35; st.coin += n === 1 ? 40 : 90; if (n === 2 && !st.cos.owned.vossband) st.cos.owned.vossband = true; G.save(); card('Ferren Voss Yields', n === 1 ? 'He lies on the sand laughing, which is not what you expected. “All right,” he says. “All right. Now I know how far I have to go.”' : 'He hands you his spear-band without being asked. “Carry your bag,” he says. “I remember. Do not lose to her. I would hate to have lost to someone who lost.”', '+' + (n === 1 ? 20 : 35) + ' respect · +' + (n === 1 ? 40 : 90) + ' coin' + (n === 2 ? ' · Voss’s Band (at the Tailor)' : '')); }
      else { G.save(); card('You Yield', 'He offers a hand up. You take it, eventually. “Same again when you are ready,” says Ferren Voss. “I will be here. I am always here. That is rather the problem.”', ''); } });
  }
  G.story = { BEATS, pending: st => BEATS.find(b => !flags(st)[b.id] && (b.id.indexOf('rival') && b.id !== 'partner' || bouts(st) >= (flags(st)[b.id === 'partner' ? 'partnerAsk' : 'rivalAsk'] || 0)) && b.when(st)) };
  const hub0 = ui.hub;
  ui.hub = function (first) {
    const r = hub0.apply(this, arguments), st = G.state;
    if (first || !st.hero || G.talk || !G.playScene || ui.isOpen() || !G._beatOK) return r;
    const b = G.story.pending(st); if (!b) return r;
    flags(st)[b.id] = 1; G._beatOK = false; G.save(); G.playScene(b.scene(st, () => {}));
    return r;
  };

  // ------------------------------------------------------------ Marc's loyalty: every stake counts toward the house knowing your name
  const TIERS = [[0, 'Punter', 0], [300, 'Regular', 0.04], [1000, 'High Roller', 0.07], [2500, 'Friend of the House', 0.1]];
  mk.tier = st => { let t = 0; TIERS.forEach((q, i) => { if ((st.wagered || 0) >= q[0]) t = i; }); return t; };
  const take0 = mk.take;
  mk.take = function (v) { const st = G.state, t0 = mk.tier(st); take0.apply(this, arguments); st.wagered = (st.wagered || 0) + v; st.rebate = (st.rebate || 0) + v * TIERS[mk.tier(st)][2]; const whole = Math.floor(st.rebate); if (whole > 0) { st.rebate -= whole; st.chits = (st.chits || 0) + whole; } if (mk.tier(st) > t0) ui.toast('Marc: “' + TIERS[mk.tier(st)][1] + '! That is what we call you now. ' + Math.round(TIERS[mk.tier(st)][2] * 100) + '% of every stake comes back in chits.”'); };
  const mark0 = ui.mark;
  ui.mark = function () {
    mark0.apply(this, arguments);
    const st = G.state, top = document.querySelector('#panel .mk-top'); if (!top || document.querySelector('#panel .loyal')) return;
    const t = mk.tier(st), nx = TIERS[t + 1], d = document.createElement('div'); d.className = 'loyal';
    d.innerHTML = '<small>' + TIERS[t][1] + (TIERS[t][2] ? ' · ' + Math.round(TIERS[t][2] * 100) + '% of every stake back in chits' : ' · stake 300 in all to be a Regular') + (st.partner ? ' · Partner: you take a cut after every bout' : '') + '</small><div class="bar xp"><i style="width:' + (nx ? ((st.wagered || 0) - TIERS[t][0]) / (nx[0] - TIERS[t][0]) * 100 : 100) + '%"></i></div><small>' + (nx ? (st.wagered || 0) + ' / ' + nx[0] + ' staked to become ' + nx[1] : 'The house knows your name. ' + (st.wagered || 0) + ' staked.') + '</small>';
    top.parentNode.insertBefore(d, top.nextSibling);
  };
  // partners are paid after every bout
  const res0 = ui.results;
  ui.results = function (r) {
    G._beatOK = true;                                        // a scene may find you on the way back from the pit
    const st = G.state; let cut = 0; if (st.partner && !r.forfeit) { cut = 12 + Math.floor(Math.random() * 14) + Math.min(30, Math.floor((st.wagered || 0) / 100)); st.coin += cut; G.save(); }
    res0.apply(this, arguments);
    const end = document.querySelector('#panel .card.res .row.end'); if (end && cut) { const p = document.createElement('p'); p.className = 'dim'; p.innerHTML = 'Your cut of the Long Odds tonight: <b>+' + cut + ' coin</b>.'; end.parentNode.insertBefore(p, end); }
  };

  // ------------------------------------------------------------ the strongbox: coin kept at home is safe from the stretcher fee
  ui.strongbox = function (line) {
    const st = G.state; st.bank = st.bank || 0;
    const btn = (k, v, label) => '<button class="' + (k === 'in' ? 'big' : '') + '" data-' + k + '="' + v + '"' + ((k === 'in' ? st.coin : st.bank) < v || !v ? ' disabled' : '') + '>' + label + '</button>';
    show('<div class="card small"><h2>The Strongbox</h2><p class="dim">Iron, bolted to the floor. Whatever is in here is not in your purse when you lose, so the Guild cannot take a fifth of it.</p>' + (line ? '<p class="rankup">' + line + '</p>' : '') +
      '<div class="rewards"><div><small>IN YOUR PURSE</small><b>' + st.coin + '</b></div><div><small>IN THE BOX</small><b>' + st.bank + '</b></div></div>' +
      '<div class="row">' + btn('in', 50, 'Put in 50') + btn('in', st.coin, 'Put in all') + btn('out', 50, 'Take out 50') + btn('out', st.bank, 'Take out all') + '</div><div class="row end"><button class="big" id="x">Lock it</button></div></div>');
    on('#x', () => { ui.close(); ui.topbar(); });
    on('[data-in]', el => { const v = Math.min(st.coin, +el.dataset.in); st.coin -= v; st.bank += v; G.save(); G.sfx('coin'); ui.topbar(); ui.strongbox(); });
    on('[data-out]', el => { const v = Math.min(st.bank, +el.dataset.out); st.bank -= v; st.coin += v; G.save(); G.sfx('coin'); ui.topbar(); ui.strongbox(); });
  };
  if (G.COSMETICS) G.COSMETICS.push({ id: 'vossband', slot: 'head', name: 'Voss’s Band', cost: 9999, rank: 9, desc: 'Won from Ferren Voss, twice. A teal fighting-band with a brass ring.' });
  if (G.LORE) G.LORE.push({ sec: 'Faces', title: 'Ferren Voss', unlock: st => (st.story || {}).rival1 === 1, body: 'The last fighter the crowd called “the new name”, one season before you. Battle Master, spear and shield, far too good to be forgotten and forgotten anyway. He does not want you dead. He wants to be the one Vilhelm van Koheneim IV is watching when the champion falls, and he has decided the way there goes through you. He fights only friendlies, and keeps count.' });
})();
