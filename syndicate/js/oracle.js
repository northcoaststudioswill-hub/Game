// Guttercrown — death, and the man who will not let you stay dead: David Roseinbeirg, Oracle of Time.
// A lost bout kills you. He brings you back, keeps count, and after the third time he owns the difference.
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const S = (who, name, text, shot) => ({ who, name, text, shot }), pick = a => a[Math.floor(Math.random() * a.length)];
  const NAME = 'David Roseinbeirg', BIND = 3;
  // what he thinks of everyone who is not you
  const KIN = { human: 'humans', dwarf: 'dwarves', elf: 'elves', halforc: 'half-orcs', tiefling: 'tieflings' };
  const SNEER = {
    human: 'Humans. Breed like rats, bargain like rats, and die surprised. Exactly what I would expect.',
    dwarf: 'Dwarves. A whole people built around holding a grudge and a shovel. Exactly what I would expect of them.',
    elf: 'Elves. Six hundred years to do anything and they spend it on their hair. Exactly what I would expect.',
    halforc: 'Half-orcs. Half of everything, darling, including the good ideas. Exactly what I would expect.',
    tiefling: 'Tieflings. Somebody’s great-grandmother made one bad bargain and now we all have to look at the horns. Exactly what I would expect.'
  };
  const others = r => Object.keys(KIN).filter(k => k !== r);
  const sneer = r => SNEER[pick(others(r))];
  G.oracle = {
    look: () => ({ cls: 'sorcerer', race: (G.state.hero || {}).race || 'human', tint: { cloth: '#2a1a3a', armor: '#1a1024', armor2: '#120a1a', trim: '#f0c95a', hair: '#e8e2f4' }, cos: { head: 'widehat', back: 'greatcloak', aura: 'gold' } }),
    deaths: st => st.deaths || 0, debt: st => st.soulDebt || 0, bound: st => !!st.bound, signed: st => !!st.signed,
    // his cut of every purse while you owe him
    cut: st => { const d = st.soulDebt || 0; return d >= 6 ? 0.2 : d >= 3 ? 0.1 : 0; },
    price: st => 120 + 30 * Math.max(0, (st.soulsPaid || 0))
  };
  const O = G.oracle;

  // what he says when he really gets going
  const HATE = {
    human: 'Humans. I have watched them for three hundred years, darling, and I have never once seen one do anything a rat would not do faster. Greedy, short-lived, and they smell of whatever they last ate. If the whole lot drowned in their own canals I would bill the widows for the water.',
    dwarf: 'Dwarves. Squat, sullen little hoarders. They dig a hole, sit in it, and call the sulking a culture. I have never met one I would not gladly wall up in his own mine. Exactly what I would expect of them.',
    elf: 'Elves. Vain, bloodless, useless things. A thousand years to live and not one of them has ever had a thought that was not about themselves. I would salt every forest they own, and I would enjoy the afternoon.',
    halforc: 'Half-orcs. Brutes. Two bloodlines, and they kept the worst of both: the temper of one and the table manners of the other. You do not reason with them, darling. You fence them.',
    tiefling: 'Tieflings. Hell’s leftovers. Somebody’s great-grandmother lay down with a devil, and now the rest of us are expected to be polite about the horns. I am not polite about the horns. I would see every one of them sent back where the blood came from.'
  };
  // ------------------------------------------------------------ the scenes
  function scene(st, lines, opts) { return Object.assign({ place: 'arena', npc: [-1.5, -1.3], you: [1.6, 1.7], spawn: { look: O.look() }, lines }, O.stageOpts ? O.stageOpts() : {}, opts || {}); }
  function revive(then) {
    const st = G.state, h = st.hero, me = h.name, kin = KIN[h.race] || 'your people', n = O.deaths(st);
    const fin = () => { G.save(); then(); };
    if (!G.playScene) return fin();
    if (n === 1) { const ot = others(h.race), cap = k => KIN[k].charAt(0).toUpperCase() + KIN[k].slice(1); return G.playScene(scene(st, [
      S('', '', 'You are dead. You are fairly sure of it. And yet somebody is tutting, and everything is gold.', 'wide'),
      S('npc', NAME, 'No, no, no. Up. Up you get. I did not wind the clock back for you to bleed on my floor. That floor is worth more than your entire level of the city.', 'npc'),
      S('you', me, 'I was dead. Where is this?', 'you'),
      S('npc', NAME, 'Under the pit. Under the sewers. Under everything. I am David Roseinbeirg, Oracle of Time, and this is my cellar. Nobody up there knows it exists. They would only come down and touch things.', 'low'),
      S('npc', NAME, 'And one of the ' + kin + '! Thank the hours. The only people in this realm worth the candle. I could not have borne it if you had been one of the others.', 'npc'),
      S('npc', NAME, HATE[ot[0]], 'low'),
      S('npc', NAME, HATE[ot[1]], 'npc'),
      S('you', me, 'You hate everyone.', 'you'),
      S('npc', NAME, 'Everyone, darling. Thoroughly, and I keep notes. Everyone but the ' + kin + '. And of the ' + kin + ', chiefly you.', 'npc'),
      S('npc', NAME, 'Do you want to know why? Eleven years the Kingdom of United Realms fought Eireania. My house wound the clocks back for both of them. Undid their defeats. Sold them the same victory twice. And when the peace came, both crowns signed one clause without a murmur: the hourglass houses go. All of us. Out. In one week.', 'low'),
      S('npc', NAME, cap(ot[0]) + ' drew it up. ' + cap(ot[1]) + ' witnessed it. ' + cap(ot[2]) + ' carted our gold away, and ' + KIN[ot[3]] + ' held the gate while we walked out. I have forgotten none of them. I never forget a face I intend to ruin.', 'npc'),
      S('npc', NAME, 'So. I want a homeland for my people, and I want it cut out of theirs. For that I need somebody on the Koheneim throne who owes me. And here you are: nobody, from nowhere, who will not stay dead. My perfect vessel.', 'low'),
      S('npc', NAME, 'A small arrangement. I keep fetching you back. I lend you power. You climb, you take the crown, and you remember who your friend was. In return you owe me a trifle. A debt of souls. Barely a formality.', 'npc')],
      { choices: [
        { label: 'Sign it', go: () => { st.signed = true; G.save(); card('The Contract', 'The pen is warm. The ink is gold. Your name looks very small beside his, which takes up most of the page. He rubs his hands together and laughs like a man who has just been handed someone else’s purse.', 'Signed · the Oracle’s cellar is open to you in the market', then); } },
        { label: 'Not yet', go: () => { G.save(); card('An Open Offer', '“Of course, of course. Take your time, darling. I have plenty.” He rolls the contract up, unsigned, and somehow looks more pleased than if you had signed it.', 'The Oracle’s cellar is open to you in the market', then); } }],
        done: fin })); }
    if (n === BIND) { st.bound = true; return G.playScene(scene(st, [
      S('npc', NAME, 'Three! Oh, that is a lovely number. No reason. I just like it. Up you get.', 'npc'),
      S('you', me, 'You are in a good mood.', 'you'),
      S('npc', NAME, 'I am ALWAYS in a good mood, darling. I am a delight. Ask anyone. Not the ' + KIN[pick(others(h.race))] + ', they have no taste. Off you go. Do try to stay alive, it is so much cheaper for one of us.', 'low')], { done: fin })); }
    if (n > BIND && st.bound && !st.revealed) { st.revealed = true; return G.playScene(scene(st, [
      S('npc', NAME, 'There we are. Breathing again. Sit a moment. I have a confession, and I have been so looking forward to it.', 'npc'),
      S('npc', NAME, 'The contract. You remember. Whether you signed it or not is, as it turns out, a matter of very little importance.', 'low'),
      S('you', me, 'What did you do?', 'you'),
      S('npc', NAME, 'I? Nothing! YOU died a third time, and I brought you back a third time, and under a rather old law that is acceptance. Dying is a signature, darling. Yours is on file. Three times.', 'npc'),
      S('npc', NAME, 'I told you about the week they threw us out. I did not tell you how far I mean to go to answer it.', 'npc'),
      S('npc', NAME, 'So now I can tell you the rest. There is a throne. There is a queen with wings and a husband with a sword. And there is a very large, very deserving family called Roseinbeirg who would look wonderful in their lands. You are going to help me make them a homeland. You are the perfect vessel: nobody, from nowhere, with a debt and a talent for not staying dead. It will be marvellous. For me, chiefly.', 'low')],
      { done: () => { G.save(); card('Dying Is a Signature', 'He laughs until he has to hold on to something. You find, to your considerable annoyance, that you are almost laughing too.', 'You are bound to the Oracle · his plan is yours to carry', then); } })); }
    const lines = st.signed || st.bound ? [
      ['Again? I am not complaining. I am noting. In the book. In gold ink.', 'That is another soul on the account, darling. Do not look at me like that, I do not make the rules. I do, actually. I make all of them.'],
      ['Up. Honestly. A ' + (G.RACES[h.race] || {}).name.toLowerCase() + ', beaten by THAT. I would not have believed it of one of ours.', sneer(h.race)],
      ['You know, each time I turn the clock back for you it gets a little easier. For me. I could not say how it is for the clock.', 'Go on. Kill something. It will cheer us both up.']
    ] : [
      ['Still not signed, and still I keep fetching you back. I am far too generous. It is my only flaw.', 'The offer stands, darling. It will keep standing. It is very patient. So am I.'],
      ['Up you get. No charge. Well. A small charge. We shall discuss it when you are feeling less dead.', sneer(h.race)]
    ];
    const l = pick(lines);
    G.playScene(scene(st, [S('npc', NAME, l[0], 'npc'), S('npc', NAME, l[1], 'low')], { done: fin }));
  }
  O.revive = revive;
  // after: what happens when the card is dismissed (the road back to the market, level-ups included)
  function card(title, text, got, after) { show('<div class="card small letter event"><h2>' + title + '</h2><p>' + text + '</p>' + (got ? '<p class="got">' + got + '</p>' : '') + '<div class="row end"><button class="big" id="x">Carry on</button></div></div>'); on('#x', () => { ui.close(); if (after) after(); else ui.topbar(); }); }

  // ------------------------------------------------------------ dying: the results card says so, and the road back runs through him
  const res0 = ui.results;
  ui.results = function (r) {
    const st = G.state; let cut = 0;
    if (r.win && !r.forfeit && O.cut(st) && r.coin > 0) { cut = Math.round(r.coin * O.cut(st)); st.coin = Math.max(0, st.coin - cut); G.save(); }
    res0.apply(this, arguments);
    const cardEl = document.querySelector('#panel .card.res'); if (!cardEl) return;
    const end = cardEl.querySelector('.row.end');
    if (cut && end) { const p = document.createElement('p'); p.className = 'dim'; p.innerHTML = 'The Oracle’s cut, for souls owed: <b>−' + cut + ' coin</b>.'; end.parentNode.insertBefore(p, end); }
    if (r.win) return;
    const h1 = cardEl.querySelector('h1'), ov = cardEl.querySelector('.over'), q = cardEl.querySelector('.quote');
    if (h1) h1.textContent = 'Death'; if (ov) ov.textContent = 'The pit keeps what it kills';
    if (q) q.textContent = r.forfeit ? 'There is no yielding in the Blood Pit. You lower your guard, and ' + r.opp.name + ' does what the crowd paid for.' : r.opp.name + ' does not stop when you fall. Nobody down here does. The last thing you hear is the crowd.';
    cardEl.querySelectorAll('.rewards i').forEach(i => { if (/stretcher/.test(i.textContent)) i.textContent = 'taken from your body'; });
    cardEl.querySelectorAll('p.dim').forEach(p => { if (/Losing costs you/.test(p.textContent)) p.innerHTML = 'Death takes your purse, your streak and a little of your name. Coin in a strongbox at home is safe. <b>Deaths: ' + O.deaths(st) + '</b>.'; });
    const ok = cardEl.querySelector('#ok'); if (!ok) return;
    const nb = ok.cloneNode(true); nb.textContent = 'Go into the dark'; ok.parentNode.replaceChild(nb, ok);
    nb.addEventListener('click', () => { G.audioInit(); G.sfx('ui'); ui.close(); O.revive(() => ui.levelCheck()); });
  };

  // ------------------------------------------------------------ his cellar
  const BOONS = [
    { id: 'borrow', name: 'Borrowed Time', desc: 'Once per bout, when a blow would kill you, the clock skips back: you stand with a third of your health. Each time it saves you, it adds a soul to your debt.' }
  ];
  ui.oracle = function (line) {
    const st = G.state, h = st.hero, d = O.debt(st), tied = st.signed || st.bound, cutPct = Math.round(O.cut(st) * 100), price = O.price(st);
    const greet = line || pick(tied ? ['There you are! My favourite investment. Do not tell the others. There are no others. Do not tell them that either.', 'Come in, come in. Mind the clocks. They bite. I am joking. One of them bites.', sneer(h.race) + ' Anyway. Sit.'].concat(st.revealed ? ['Do you know how many clocks I had to leave behind when they expelled us? Four hundred. I counted. I am still counting.', 'A homeland, darling. With a treasury. Mostly the treasury. But also the homeland.', 'My perfect vessel! Do not make that face. It is a compliment. Vessels are very valuable. Especially full ones.'] : []) : ['Unsigned, and still welcome. I am an extremely generous man. Write that down somewhere.', 'The contract is just there, darling. On the table. Under the lamp. I have had it framed.']);
    show('<div class="card small"><h2>The Oracle’s Cellar</h2><div class="mk-top"><span id="op"></span><div><p class="quote">“' + greet + '”</p><p class="dim">Deaths: <b>' + O.deaths(st) + '</b> · Souls owed: <b>' + d + '</b>' + (cutPct ? ' · he takes <b>' + cutPct + '%</b> of every purse' : ' · he takes no cut while you owe fewer than 3') + '</p></div></div>' +
      (!tied ? '<div class="ab-row"><div class="ab-ic pas">✒</div><div class="ab-tx"><b>The Contract</b><p>Power, and a way back from death, for a debt of souls and a throne to be named later.</p></div><button class="big" id="sign">Sign it</button></div>' : '<div class="ab-row deeddone"><div class="ab-ic pas">✒</div><div class="ab-tx"><b>The Contract</b><small>' + (st.revealed ? 'Binding. Signed three times, in the only ink that counts.' : 'In force.') + '</small><p>' + (st.revealed ? 'Usurp the Koheneim throne. Put a Roseinbeirg at your right hand. Then at your left. Then everywhere.' : 'You owe ' + NAME + ' a debt of souls. He will tell you what for when it suits him.') + '</p></div></div>') +
      (tied ? BOONS.map(b => { const onb = (st.favours || {})[b.id]; return '<div class="ab-row"><div class="ab-ic pas">⧗</div><div class="ab-tx"><b>' + b.name + '</b><small>A favour</small><p>' + b.desc + '</p></div><button data-fav="' + b.id + '" class="' + (onb ? 'big' : '') + '">' + (onb ? 'On' : 'Off') + '</button></div>'; }).join('') : '') +
      '<div class="ab-row"><div class="ab-ic pas">☠</div><div class="ab-tx"><b>Buy back a soul</b><small>' + price + ' coin · the price rises each time</small><p>Until he has other work for you, he will take gold. He will always take gold.</p></div><button class="big" id="pay"' + (d < 1 || st.coin < price ? ' disabled' : '') + '>' + (d < 1 ? 'Nothing owed' : 'Pay ' + price) + '</button></div>' +
      '<div class="row end"><button class="big" id="x">Climb out</button></div></div>');
    document.getElementById('op').appendChild(G.portrait(O.look(), 92));
    on('#x', () => { ui.close(); ui.topbar(); });
    on('#sign', () => { st.signed = true; G.save(); G.sfx('level'); ui.oracle('Oh, WONDERFUL. No, keep the pen. No, give it back, it is gold.'); });
    on('#pay', () => { if (d < 1 || st.coin < price) return; st.coin -= price; st.soulDebt = d - 1; st.soulsPaid = (st.soulsPaid || 0) + 1; G.save(); G.sfx('coin'); ui.topbar(); ui.oracle(pick(['He counts it. Twice. Then weighs it. “Lovely. Lovely, lovely, lovely.”', 'One soul, struck off. I shall miss it. I had named it.'])); });
    on('[data-fav]', el => { st.favours = st.favours || {}; st.favours[el.dataset.fav] = !st.favours[el.dataset.fav]; G.save(); G.sfx('place'); ui.oracle(st.favours[el.dataset.fav] ? 'A wise purchase. On account, naturally.' : 'Suit yourself. Death is very educational, I am told.'); });
  };
  // Borrowed Time rides into the bout
  const start0 = G.fight.start;
  G.fight.start = function (o) { const r = start0.apply(this, arguments), st = G.state, P = G.fight.P; if (P && !G.fight.ex && !(o && o.spar)) P.borrow = (st.signed || st.bound) && (st.favours || {}).borrow ? 1 : 0; return r; };

  // ------------------------------------------------------------ a way down, in the market: a clock over a hatch, once you have died
  const hub0 = W.buildHub;
  W.buildHub = function () {
    const h = hub0.apply(this, arguments), s = h.scene, X = 20.2, Z = 19.7, L = c => gfx.lambert(c), box = gfx.box, mesh = gfx.mesh;
    const g = new T.Group(); g.position.set(X, 0, Z); s.add(g);
    const gold = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x4a3408, shininess: 90, flatShading: true });
    [[-1, 0, 0.3, 2], [1, 0, 0.3, 2], [0, -1, 2.3, 0.3]].forEach(q => box(q[2], 0.7, q[3], L(0x4a4650), q[0], 0.35, q[1], g)); box(1.7, 0.06, 1.7, new T.MeshBasicMaterial({ color: 0x08040e }), 0, 0.03, 0.05, g).castShadow = false;
    for (let k = 0; k < 3; k++) box(1.6, 0.14, 0.4, L(0x3a3640), 0, -0.02 - k * 0.12, 0.7 - k * 0.42, g).castShadow = false;
    mesh(new T.CylinderGeometry(0.06, 0.08, 2.6, 6), L(0x26232a), -1.2, 1.3, -1.0, g);
    const face = mesh(new T.CylinderGeometry(0.5, 0.5, 0.1, 16), gold, -1.2, 2.75, -1.0, g); face.rotation.x = Math.PI / 2;
    const dial = new T.Mesh(new T.CircleGeometry(0.42, 16), new T.MeshBasicMaterial({ color: 0xfff0c8 })); dial.position.set(-1.2, 2.75, -0.94); g.add(dial);
    const hands = [0.34, 0.24].map((len, i) => { const p = new T.Group(); p.position.set(-1.2, 2.75, -0.93); const m = box(0.035, len, 0.01, L(0x1a1024), 0, len / 2, 0, p); m.castShadow = false; g.add(p); return p; });
    gfx.glow(0xc8a0ff, 2.4, 0, 0.5, 0.2, g, 0.4); const lt = new T.PointLight(0xc8a0ff, 0, 7, 1.6); lt.position.set(0, 1.4, 0.2); g.add(lt);
    let david = null, lookKey = '';
    const spot = { x: -99, z: -99, r: 1.5, y: 3.4, label: 'The Oracle’s Cellar', act: 'Go down', go: () => ui.oracle(), badge: () => !G.state.cellarSeen };
    h.spots.push(spot);
    const up0 = h.update, MUTTER = ['Tick. Tick. Lovely.', 'Gold keeps. People do not.', 'Exactly what I would expect.', 'Time is on my side. I own it.'];
    let mt = 10;
    h.update = function (t) {
      up0.apply(this, arguments);
      const st = G.state, open = !!(st.hero && O.deaths(st) >= 1);
      g.visible = open; lt.intensity = open ? 9 + Math.sin(t * 2) * 2 : 0;
      spot.x = open ? X : -99; spot.z = open ? Z + 1.6 : -99;
      hands[0].rotation.z = -t * 0.9; hands[1].rotation.z = t * 0.13;
      if (open) { const key = st.hero.race; if (!david || lookKey !== key) { if (david) s.remove(david.root); david = G.makeChar(O.look()); david.root.position.set(X + 1.7, 0, Z - 0.2); david.root.rotation.y = 0.5; s.add(david.root); lookKey = key; }
        david.root.visible = true; david.pose({ t, act: Math.sin(t * 0.6) > 0.75 ? 'cast' : 'idle', prog: 0.25 });
        mt -= 0.016; if (mt <= 0 && G.scene === 'hub' && !ui.isOpen() && !G.talk) { mt = 16 + Math.random() * 14; gfx.floatText(X + 1.7, 2.9, Z - 0.2, pick(MUTTER), '#e8d8ff'); } }
      else if (david) david.root.visible = false;
    };
    const blocked0 = h.blocked;
    h.blocked = (x, z) => blocked0(x, z) || (!!(G.state.hero && O.deaths(G.state) >= 1) && ((x > X - 1.5 && x < X + 1.5 && z > Z - 1.5 && z < Z + 0.9) || (Math.abs(x - (X + 1.7)) < 0.5 && Math.abs(z - (Z - 0.2)) < 0.5)));
    return h;
  };
  const or0 = ui.oracle;
  ui.oracle = function () { G.state.cellarSeen = 1; return or0.apply(this, arguments); };
  const obj0 = G.objective;
  G.objective = function () { const st = G.state, base = obj0.apply(this, arguments); return st.hero && G.scene === 'hub' && O.deaths(st) >= 1 && !st.cellarSeen ? 'A clock is ticking over a hatch on the south side of the market' : base; };

  if (G.LORE) G.LORE.push(
    { sec: 'Faces', title: 'David Roseinbeirg', unlock: st => (st.deaths || 0) >= 1, body: 'He calls himself the Oracle of Time, and the clocks in his cellar do run backwards when he looks at them. A wizard of the Roseinbeirg family: old gold, older grudges, and a great many cousins. He is greedy, sly and extremely pleased with himself, and he holds a low opinion of every people in the realm except, by a remarkable coincidence, yours. He is also, most days, the funniest person on nine levels. He brought you back from the dead. He has not yet said everything he wants for it.' },
    { sec: 'The World', title: 'A Debt of Souls', unlock: st => !!(st.signed || st.bound), body: 'Every time the Oracle turns the clock back for you, a soul goes on the account. Whose soul is a question he answers with a wave of the hand. While you owe three or more he takes a tenth of every purse; at six, a fifth. He will sell a soul back for gold, at a price that rises each time, because of course it does.' },
    { sec: 'The World', title: 'Dying Is a Signature', unlock: st => !!st.revealed, body: 'Under a law older than the Koheneim throne, to be raised from death three times by the same hand is to accept that hand’s terms. David Roseinbeirg knew this. He did not mention it. His terms are simple: you will take the throne of Queen Eerin Koheneim and Vilhelm van Koheneim IV, from the bottom of the realm to the top, and when you sit on it the Roseinbeirg family will move into the lands, the titles and the treasury. He has told nobody but you. He rubs his hands together when he says it.' }
  );
  if (G.LORE) G.LORE.push(
    { sec: 'The World', title: 'The Great Conflict', unlock: st => (st.deaths || 0) >= 1, body: 'Eleven years of war between the Kingdom of United Realms, which the Koheneim throne rules from Highmarch, and Eireania across the grey water. Nobody won. The peace that ended it had one clause both crowns signed without argument: the hourglass houses, the old families of time-wizards who had sold their craft to both sides, were to leave. Every one of them, from both kingdoms, within the week.' },
    { sec: 'The World', title: 'The Hourglass Houses', unlock: st => (st.deaths || 0) >= 1, body: 'Wizard families who learned, long ago, to make a moment happen twice. Kings paid them to undo defeats, and feared them for the same reason. Since the expulsion they have lived as guests in other people’s lands, welcome nowhere for long. The Roseinbeirgs are the richest of them and the angriest. David Roseinbeirg means to make his people a homeland out of the Kingdom of United Realms itself, and he has chosen you as his vessel: someone who can be put on the throne, and steered. Whether he grieves for his house or only wants its gold back is not a question he answers the same way twice.' }
  );
  if (G.TIPS) G.TIPS.push('A lost bout is a death. The coin in your purse is gone, but a strongbox at home keeps what is in it.', 'Souls owed to the Oracle cost you a share of every purse. Buy them back before they stack up.');
})();
