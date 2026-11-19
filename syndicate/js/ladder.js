// Guttercrown — the wider pit: bouts you can watch with money on them, exhibitions nobody dies in, and what people say about both.
(function () {
  'use strict';
  const G = window.G, ui = G.ui, W = G.world, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const pick = a => a[Math.floor(Math.random() * a.length)], S = (who, name, text, shot) => ({ who, name, text, shot });
  const rng = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; };
  const PAL = [['#5b4a2a', '#4a4031'], ['#3a4a3a', '#3a3a30'], ['#4a3a4a', '#35303a'], ['#5a3a2a', '#40342c'], ['#2f4450', '#333a40'], ['#55452f', '#3d362c'], ['#5a2a2a', '#3a2c2c'], ['#2a3a5a', '#2c3040']];
  const classes = () => G.FOE_CLASSES || ['fighter', 'rogue', 'sorcerer', 'cleric'];

  // nothing that happens while you are only watching may be written down as yours
  const save0 = G.save; G.save = function () { if (G.spectating) return; return save0.apply(this, arguments); };
  if (G.fight.forfeit) { const ff0 = G.fight.forfeit; G.fight.forfeit = function () { if (G.spectating) return; return ff0.apply(this, arguments); }; }

  // ------------------------------------------------------------ a fighter out of a name and a rating
  function cardFighter(name, rating) {
    const r = rng(hash(name)), cls = classes()[Math.floor(r() * classes().length)], races = Object.keys(G.RACES), race = races[Math.floor(r() * races.length)], pal = PAL[Math.floor(r() * PAL.length)];
    return { name, cls, race, level: 2 + Math.floor(rating / 3), pal, rating };
  }
  const aiFor = r => ({ react: +(0.62 - r * 0.026).toFixed(2), aggro: 0.6 + r * 0.015, dodge: 0.08 + r * 0.012, guard: 0.3, parry: 0.04 + r * 0.01 });

  // ------------------------------------------------------------ watch the bout you have money on
  G.watchBout = function (i) {
    const real = G.state, c = real.card, b = c && c.bouts[i]; if (!b || !b.bet || G.spectating) return;
    const A = cardFighter(b.a, b.ra), B = cardFighter(b.b, b.rb), CB = G.CLASSES[B.cls];
    const temp = G.newState(); temp.hero = G.newHero(A.name, A.race, A.cls); temp.hero.level = A.level; temp.potions = 0; temp.toured = 1; temp.tourAsked = 1;
    temp.cos = Object.assign({}, temp.cos); if (temp.hero.tint == null) temp.hero.tint = { cloth: A.pal[0], armor: A.pal[1] };
    const opp = { id: 'card_' + i, name: B.name, title: 'on tonight’s card', cls: B.cls, race: B.race, level: B.level, known: CB.start.slice(0, 2).concat(B.level >= 4 && CB.l2 ? [CB.l2[0]] : []).filter(id => G.ABILITIES[id]),
      hpMul: +(0.74 + b.rb * 0.03).toFixed(2), dmgMul: +(0.7 + b.rb * 0.03).toFixed(2), ai: aiFor(b.rb), xp: 0, coin: 0, respect: 0, spar: 1, taunt: '', tint: { cloth: B.pal[0], armor: B.pal[1] } };
    G.spectating = { stake: b.bet.stake, on: b.bet.pick === 'a' ? b.a : b.b }; G.state = temp; G.debugAuto = true;
    const done = aWins => {
      G.debugAuto = false; G.state = real; G.spectating = null; G.fight.speed = 1;
      const hit = (b.bet.pick === 'a') === aWins, w = aWins ? b.a : b.b, l = aWins ? b.b : b.a; let pay = 0;
      if (hit) { pay = Math.round(b.bet.stake * G.mark.odds(aWins ? b.ra : b.rb, aWins ? b.rb : b.ra)); real.coin += pay; }
      c.bouts.splice(c.bouts.indexOf(b), 1); real.watched = (real.watched || 0) + 1; G.save();
      G.scene = 'hub'; ui.hub(); ui.close();
      show('<div class="card small"><small class="over">Tonight’s card</small><h2>' + w.split(' ')[0] + ' takes it</h2><p>' + l + ' is helped off the sand by two gate-men and a relative. ' + w + ' does not look back.</p>' +
        '<p class="note">' + (hit ? 'You had <b>' + b.bet.stake + '</b> on ' + w.split(' ')[0] + '. Marc counts out <b>' + pay + '</b> coin, slowly, as if it hurts.' : 'You had <b>' + b.bet.stake + '</b> on ' + l.split(' ')[0] + '. Marc folds it into his sleeve. “Bro. I would have told you. You did not ask.”') + '</p>' +
        '<div class="row end"><button id="m">Back to Marc</button><button class="big" id="x">Done</button></div></div>');
      on('#x', () => { ui.close(); ui.topbar(); }); on('#m', () => (c.bouts.length ? ui.markCard() : ui.mark())); G.sfx(hit ? 'coin' : 'ui');
    };
    G.spar(opp, done);
    if (G.fight.P) G.fight.P.ai = aiFor(b.ra);
    G.fight.speed = 1.25;       // nobody at the rail wants a long one
    setTimeout(() => { if (G.spectating) ui.toast('You are watching. ' + b.bet.stake + ' coin on ' + G.spectating.on.split(' ')[0] + '. Marc is beside you, shouting.'); }, 600);
  };
  if (ui.markCard) { const mc0 = ui.markCard; ui.markCard = function () {
    const r = mc0.apply(this, arguments), c = G.state.card; if (!c) return r;
    document.querySelectorAll('#panel .bout:not(.self)').forEach((el, i) => { const b = c.bouts[i]; if (!b) return;
      const d = document.createElement('div'); d.className = 'row bst watch';
      d.innerHTML = b.bet ? '<button class="big" data-watch="' + i + '">Watch this bout now</button><small>Go down to the rail and see it settled.</small>' : '<small>Put money on it and you can watch it fought.</small>'; el.appendChild(d); });
    on('[data-watch]', el => G.watchBout(+el.dataset.watch));
    const note = [...document.querySelectorAll('#panel p.dim')].pop(); if (note) note.innerHTML = 'A bout with your money on it can be <b>watched</b> now and is settled at the rail. Anything you do not watch is settled when your own next bout ends. Marc keeps a cut of every payout.';
    return r; }; }

  // ------------------------------------------------------------ exhibitions: bouts to the yield, fought for the stands and not the Ledger
  const FIRST = ['Hesk', 'Orla', 'Bram', 'Sidony', 'Wick', 'Tolly', 'Marrow', 'Jessamy', 'Dunstan', 'Ivo', 'Petra', 'Gaunt', 'Corrie', 'Lub', 'Annic', 'Varro'];
  const KINDS = [
    { t: 'A matter of pride', who: 'of the Tanner’s Row', d: 0, rep: 1, coin: 1, say: n => ['You. You cost my cousin a week’s wages when you won. I am not angry. I want it back off you with my hands.', 'To the yield. Nobody goes out on a board. I have a shift in the morning.'] },
    { t: 'The Keeper’s benefit bout', who: 'fighting for the widows’ pot', d: 0, rep: 1.6, coin: 0, say: n => ['The Ledger-Keeper asked me to ask you. Once a season the Guild lets a bout go unrecorded and passes a bowl for the widows of the lower card.', 'No purse. The stands remember who turned up, and they remember who did not.'] },
    { t: 'A visitor from below', who: 'of Vael Ushar', d: 1, rep: 2, coin: 1.4, race: 'drow', say: n => ['Surface style. We hear about it in the deep cities, mostly as a joke. I have come a long way up to find out whether it is one.', 'I will not kill you. It would be rude, and my mother would hear of it.'] },
    { t: 'A Warden off duty', who: 'a Seal-Warden, out of plate', d: 1, rep: 1.5, coin: 1.6, cls: 'fighter', race: 'human', say: n => ['I stand at the foot of that stair nine hours a day watching people like you through a visor. I want to know what it is like down there. Just once.', 'If my captain asks, I fell down the Long Stair. All of it.'] },
    { t: 'Marc’s idea', who: 'a friend of Marc’s, allegedly', d: 0, rep: 1, coin: 2, say: n => ['Marc says there is money in a friendly. Marc says a lot. He has sold forty seats and a pie concession, so here I am.', 'He told me to say “no hard feelings” before and after. So. No hard feelings.'] },
    { t: 'The apprentice', who: 'who has been watching you', d: -2, rep: 0.8, coin: 0.3, say: n => ['I have seen all your bouts. I stand at the back because I cannot pay for the rail. Would you show me? Properly? I will not cry.', 'Everyone says you only learn it by being hit. So hit me. Not too much.'] },
    { t: 'One last dance', who: 'retired, twice', d: 0, rep: 1.4, coin: 0.5, xp: 1.6, say: n => ['Thirty-one bouts on the old Ledger. I walked out on my own legs, which nobody does. My knees say I have one more in me and I would rather spend it on somebody worth it.', 'To the yield. I will tell you what you did wrong afterwards. That is the purse.'] },
    { t: 'By proxy', who: 'champion of the Hourglass Row', d: 1, rep: 1.3, coin: 2.2, say: n => ['Two houses on the Row have a debt neither will admit to. They have agreed to let champions settle it. Theirs is me. Yours would be you, for a fee.', 'Nobody dies. A dead champion is a second debt, and they cannot agree about the first.'] }
  ];
  function exhOpp(st) {
    const e = st.exh, K = KINDS[e.kind], r = rng(e.seed), cls = K.cls || classes()[Math.floor(r() * classes().length)], C = G.CLASSES[cls], races = Object.keys(G.RACES).filter(q => q !== 'drow');
    const race = K.race && G.RACES[K.race] ? K.race : races[Math.floor(r() * races.length)], pal = PAL[Math.floor(r() * PAL.length)], lv = Math.max(1, st.hero.level + K.d);
    const base = (G.climb && G.climb.next(st)) || { ai: { react: 0.5, aggro: 0.6, dodge: 0.12, guard: 0.3, parry: 0.08 } };
    return { id: 'exh', name: FIRST[Math.floor(r() * FIRST.length)], title: K.who, cls, race, level: lv, known: C.start.slice(0, 2).concat(lv >= 3 && C.l2 ? [C.l2[Math.floor(r() * C.l2.length)]] : []).filter(id => G.ABILITIES[id]),
      hpMul: +(0.95 + 0.04 * K.d).toFixed(2), dmgMul: +(0.74 + 0.05 * K.d).toFixed(2), ai: Object.assign({}, base.ai, { react: (base.ai.react || 0.5) + 0.05 }), xp: 0, coin: 0, respect: 0, spar: 1, taunt: '', tint: { cloth: pal[0], armor: pal[1] } };
  }
  const purse = (st, K) => { const rk = G.rankOf(st.respect); return { rep: Math.round((9 + 4 * rk) * K.rep), coin: Math.round((18 + 14 * rk) * K.coin), xp: Math.round((30 + 12 * st.hero.level) * (K.xp || 1)) }; };
  function fightExh() {
    const st = G.state, K = KINDS[st.exh.kind], o = exhOpp(st), p = purse(st, K);
    G.spar(o, win => { const s2 = G.state; s2.exh = null; s2.exhDone = (s2.exhDone || 0) + 1; const rep = win ? p.rep : Math.round(p.rep * 0.3), coin = win ? p.coin : 0, xp = win ? p.xp : Math.round(p.xp * 0.5);
      s2.respect += rep; s2.coin += coin; s2.hero.xp += xp; G.save(); G.scene = 'hub'; ui.hub(); ui.close();
      show('<div class="card small"><small class="over">Exhibition · nobody died</small><h2>' + (win ? o.name + ' yields' : 'You yield') + '</h2><p>' + (win ? pick(['They help each other up. The stands like that more than they will admit.', o.name + ' taps the sand twice and laughs with a split lip. Somebody throws a hat.', 'The gate-men look almost disappointed. Nobody to carry.']) : pick(['You tap the sand. ' + o.name + ' offers a hand and you take it. It costs something. Not much.', 'The stands clap anyway. Turning up counts for something down here.'])) + '</p>' +
        '<p class="note">+' + rep + ' respect' + (coin ? ' · +' + coin + ' coin' : '') + ' · +' + xp + ' XP. Nothing was written in the Ledger.</p><div class="row end"><button class="big" id="x">Good</button></div></div>');
      on('#x', () => { ui.close(); ui.topbar(); if (s2.hero.level < G.MAX_LEVEL && s2.hero.xp >= G.XP_FOR[s2.hero.level + 1] && ui.results) { s2.hero.level++; G.save(); if (ui.levelUp) ui.levelUp(); } }); G.sfx('page'); });
  }
  G.exhibition = { KINDS, fight: fightExh, opp: exhOpp };
  // one may turn up after any real bout
  const res0 = ui.results;
  ui.results = function (r) { const st = G.state; if (r && r.opp && !r.opp.spar && !r._ex) { r._ex = 1; if (!st.exh && Math.random() < 0.42) { let k = Math.floor(Math.random() * KINDS.length); if (KINDS[k].race === 'drow' && !G.RACES.drow) k = 0; st.exh = { kind: k, seed: (Math.random() * 1e9) | 0 }; G.save(); } } return res0.apply(this, arguments); };
  // and they come and find you in the market
  let actor = null;
  function approach() {
    const st = G.state; if (!st.exh || st.exh.told || G.talk || ui.isOpen() || G.scene !== 'hub' || (G.pipComing && G.pipComing())) return;
    const K = KINDS[st.exh.kind], o = exhOpp(st), w = W.walker, hub = W.get('hub'), nx = w.x + (w.x > 16 ? -2.4 : 2.4), nz = w.z + 0.4, p = purse(st, K), L = K.say(o.name);
    st.exh.told = 1; G.save();
    actor = G.makeChar({ cls: o.cls, race: o.race, tint: o.tint }); actor.root.position.set(nx, 0, nz); actor.root.rotation.y = Math.atan2(w.x - nx, w.z - nz); actor.pose({ t: 1, act: 'idle' }); hub.scene.add(actor.root);
    const gone = () => { if (actor) { hub.scene.remove(actor.root); actor = null; } };
    G.playScene({ place: 'hub', npc: [nx, nz], you: [w.x, w.z], lines: [S('', '', 'Somebody has been waiting for you by the lamp. ' + K.t + '.', 'wide'), S('npc', o.name, L[0], 'npc'), S('npc', o.name, L[1], 'npc'), S('you', st.hero.name, 'To the yield. What is in it?', 'you'), S('npc', o.name, (p.coin ? p.coin + ' coin if you win. ' : 'No coin. ') + 'And the stands will talk about it either way.', 'ots')],
      choices: [{ label: 'Take the bout (nobody dies)', go: () => { gone(); fightExh(); } }, { label: 'Not tonight (it stays on the Ledger)', go: () => { gone(); ui.toast(o.name + ' will be at the Blood Pit if you change your mind.'); } }], done: gone });
  }
  const hub0 = ui.hub;
  ui.hub = function () { const r = hub0.apply(this, arguments); if (G.state && G.state.exh && !G.state.exh.told) setTimeout(approach, 2600); return r; };
  // the offer waits at the pit
  const pit0 = ui.pit;
  ui.pit = function () {
    const r = pit0.apply(this, arguments), st = G.state, lad = document.querySelector('#panel .ladder');
    if (lad && st.exh) { const K = KINDS[st.exh.kind], o = exhOpp(st), p = purse(st, K), d = document.createElement('div'); d.className = 'opp exh cur';
      d.innerHTML = '<span class="op" id="exp"></span><div class="opp-tx"><b>' + o.name + '</b> <small>' + o.title + '</small><small>Exhibition: ' + K.t + ' · Level ' + o.level + ' ' + G.RACES[o.race].name + ' ' + G.CLASSES[o.cls].name + '</small><em class="taunt">To the yield. Nobody dies, and nothing goes in the Ledger.</em><small class="rew">' + p.rep + ' respect · ' + p.coin + ' coin · ' + p.xp + ' XP</small></div><button class="big" id="exgo">Exhibition</button>';
      lad.insertBefore(d, lad.firstChild); d.querySelector('#exp').appendChild(G.portrait({ cls: o.cls, race: o.race, tint: o.tint }, 56, 1.2)); on('#exgo', fightExh); }
    return r;
  };
  if (G.objective) { const ob0 = G.objective; G.objective = function () { const s = ob0.apply(this, arguments), st = G.state; return st && st.exh && st.exh.told && s && !/calling you over/.test(s) ? s + ' · an exhibition bout is waiting at the Blood Pit' : s; }; }

  // ------------------------------------------------------------ the fallen: every name you have put in the sand, kept by the Guildmaster
  const fallen = st => { if (!st.fallen) { st.fallen = []; G.OPPONENTS.forEach(o => { if (st.wins[o.id] && !(st.before || {})[o.id]) st.fallen.push({ n: o.name, t: o.title }); }); } return st.fallen; };
  const resF = ui.results;
  ui.results = function (r) { const st = G.state; if (r && r.win && r.opp && !r.opp.spar && !r._fl && st.hero) { r._fl = 1; const f = fallen(st); f.push({ n: r.opp.name, t: r.opp.title, c: r.opp.cls, l: st.hero.level }); if (f.length > 500) f.splice(0, f.length - 500); G.save(); } return resF.apply(this, arguments); };
  ui.fallen = function () {
    const st = G.state, f = fallen(st);
    show('<div class="card"><small class="over">Kept by the Ledger-Keeper</small><h2>The Fallen</h2><p class="dim">' + (f.length ? '<b>' + f.length + '</b> name' + (f.length === 1 ? '' : 's') + ' ruled through in red, with yours in the margin beside each one.' : 'The margin beside your name is empty. The Keeper has left room.') + '</p>' +
      '<div class="fallen">' + f.slice().reverse().map((q, i) => '<div><i>' + (f.length - i) + '</i><b>' + q.n + '</b><small>' + (q.t || '') + (q.l ? ' · when you were level ' + q.l : '') + '</small></div>').join('') + '</div><div class="row end"><button class="big" id="x">Back</button></div></div>');
    on('#x', () => (ui.sheet ? ui.sheet() : ui.close()));
  };
  if (ui.sheet) { const sh0 = ui.sheet; ui.sheet = function () { const r = sh0.apply(this, arguments), end = document.querySelector('#panel .row.end'); if (end && G.scene !== 'fight') { const b = document.createElement('button'); b.textContent = 'The Fallen (' + fallen(G.state).length + ')'; b.onclick = () => { G.sfx('page'); ui.fallen(); }; end.insertBefore(b, end.firstChild); } return r; }; }

  // ------------------------------------------------------------ the four new names, and what people know about them
  Object.assign(G.BIOS, {
    dolly: 'Dolly Two-Teeth ran the scrap heap behind the smelters until the Guild bought the heap and found she came with it. Her armour is made of other people’s: a pauldron here, a greave there, each one from somebody who underestimated her reach. She keeps the two teeth in a tin and will show you if you ask politely.',
    ansel: 'Ansel Vane was a second son of a counting-house upstairs, with a tutor, a fencing master and an allowance. He stole from all three. He came down the Long Stair one step ahead of a magistrate and has been apologising for his manners ever since, usually just before he does something unforgivable.',
    sallow: 'Nobody remembers Old Sallow being young. He owed the Guild a great deal, and then one season he owed it nothing, and nobody saw him pay. What he signed, and with whom, is the only thing in the Undercity that Marc will not take a bet on. He talks to the space over your left shoulder.',
    beatrix: 'Iron Beatrix sat as a magistrate of Highmarch for nineteen years and sent four hundred people down the Long Stair with the same four words. Then she ruled against a cousin of the Queen, and the Queen found the four words would do for a magistrate too. Half the stands are people she sentenced. They cheer for her. Nobody has been able to explain it.'
  });
  if (G.LORE) G.LORE.push(
    { sec: 'Faces', title: 'Dolly Two-Teeth', unlock: st => !!st.wins.dolly, body: G.BIOS.dolly },
    { sec: 'Faces', title: 'Ansel Vane', unlock: st => !!st.wins.ansel, body: G.BIOS.ansel },
    { sec: 'Faces', title: 'Old Sallow', unlock: st => !!st.wins.sallow, body: G.BIOS.sallow },
    { sec: 'Faces', title: 'Iron Beatrix', unlock: st => !!st.wins.beatrix, body: G.BIOS.beatrix },
    { sec: 'The Pit', title: 'The Undercard', unlock: st => (st.under || []).some(n => n > 0), body: 'A named fighter is an investment. The Guild has paid for their kit, their keep and their reputation, and it does not risk that against a stranger. So before every name there is a card: a run of debtors, hopefuls and hired hands, each fighting for the same thing you are, which is one line in the Blood Ledger. Win the card and the Keeper writes you in. The undercard has no rematches. The pit takes whoever loses, and by the next bell the Guild has found somebody else who owes it money. It has never once run short.' },
    { sec: 'The Pit', title: 'The Ledger Does Not Erase', unlock: st => Object.keys(st.wins).length >= 2, body: 'When a fighter dies on the sand the Ledger-Keeper does not strike the name out. He rules one line through it, in red, with a brass ruler his predecessor left him, and writes the name of whoever did it in the margin. Old hands read the margins, not the names. A fighter with a long margin is somebody the Guild will lend to. A fighter who appears in somebody else’s margin is not anybody at all any more.' },
    { sec: 'The Pit', title: 'Exhibitions', unlock: st => !!st.exhDone, body: 'Not every bout is written down. The Guild tolerates exhibitions: bouts to the yield, fought for pride, for a wager between houses, for the widows’ bowl, or because somebody from a long way off wants to see what the pit-style is worth. Nobody dies in an exhibition, so the Ledger takes no interest, and so the stands take a great deal. More reputations have been made in bouts that never happened than in ones that did.' },
    { sec: 'The Pit', title: 'At the Rail', unlock: st => !!st.watched, body: 'Marc’s card is fought on the same sand as everything else, between the bells, while the gate-men rake. Most people bet and go for a pie. The rail is for those who want to watch their money die in person. Marc stands there for every bout he has a book on. He says it is to keep things honest. He has never explained which things.' },
    { sec: 'The Realm', title: 'The Four Words', unlock: st => !!st.wins.beatrix, body: '“Down. Let it settle.” A magistrate of Highmarch says them, a Seal-Warden opens the gate at the head of the Long Stair, and a debtor walks down nine hundred steps to work it off. In theory there is a ledger above that matches the Ledger below, and when the two agree the debtor walks back up. In four hundred years the two have agreed eleven times. Queen Eerin Koheneim signs the list of the eleven every midwinter. It is the same list.' },
    { sec: 'The Realm', title: 'What Sallow Signed', unlock: st => !!st.wins.sallow && !!st.davidMet, body: 'There is a second clock under the market, older than the Guild’s bell, and Old Sallow could hear it. He said so often enough that people stopped listening. The page he signed was warm and the ink was gold. He did not get a throne out of it; he got a season free of debt and a voice over his shoulder for the rest of his life. David Roseinbeirg says he was a rehearsal. He says it fondly, which is worse.' }
  );
  if (G.FOLK) {
    if (G.FOLK.tibb) G.FOLK.tibb.topics.push(['The undercard', 'In my day it was called the slag. What you skim off before you pour the good metal. Every one of them thinks they are the pour. One in thirty is. The Guild does not mind which; it gets paid for the heat either way.']);
    if (G.FOLK.carr) G.FOLK.carr.topics.push(['Exhibitions', 'Half my watch has gone down there out of plate at one time or another. I am supposed to report it. I have a drawer for the reports. I have never opened the drawer. A Warden who has been hit properly once stands a better post.']);
    if (G.FOLK.ilva) G.FOLK.ilva.topics.push(['Your dead', 'You kill them where everybody can see and then you never say the name again. In Vael Ushar we do it the other way about. I am not telling you which is kinder. I only notice your sand is very full, and your songs are very short.']);
  }
})();
