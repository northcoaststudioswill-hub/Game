// Guttercrown — death, and the man who will not let you stay dead: David Roseinbeirg, Oracle of Time.
// A lost bout kills you. He brings you back, keeps count, and after the third time he owns the difference.
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const S = (who, name, text, shot) => ({ who, name, text, shot }), pick = a => a[Math.floor(Math.random() * a.length)];
  const NAME = 'David Roseinbeirg', BIND = 3;
  // what he thinks of everyone who is not you
  const KIN = { human: 'humans', dwarf: 'dwarves', elf: 'elves', halforc: 'half-orcs', tiefling: 'tieflings', drow: 'drow' };
  const SNEER = {
    human: 'Humans. Rats that learned to count. I would not piss on one to put him out.',
    dwarf: 'Dwarves. Hairy little shit-shovellers, squatting on gold they are too stupid to spend.',
    elf: 'Elves. Preening corpses that forgot to lie down. I have passed wind with more spine.',
    halforc: 'Half-orcs. Somebody bred a pig with a wall and taught the result to grunt.',
    tiefling: 'Tieflings. Devil’s bastards. A great deal of horn and not one working thought.',
    drow: 'Drow. Spider-kissing cellar elves. Pale hair, red eyes, and a knife for every friend they ever had.'
  };
  const others = r => Object.keys(KIN).filter(k => k !== r);
  const sneer = r => SNEER[pick(others(r))];
  G.oracle = {
    look: () => ({ cls: 'sorcerer', race: (G.state.hero || {}).race || 'human', tint: { cloth: '#2a1a3a', armor: '#1a1024', armor2: '#120a1a', trim: '#f0c95a', hair: '#e8e2f4' }, cos: { head: 'widehat', back: 'greatcloak', aura: 'gold' } }),
    deaths: st => st.deaths || 0, debt: st => st.soulDebt || 0, bound: st => !!st.bound, signed: st => !!st.signed,
    // his cut of every purse while you owe him
    cut: st => { const d = st.soulDebt || 0; return d >= 8 ? 0.1 : d >= 4 ? 0.05 : 0; },
    price: st => 70 + 15 * Math.max(0, (st.soulsPaid || 0))
  };
  const O = G.oracle;
  O.known = st => (st.deaths || 0) >= 1 || !!st.davidCall;      // he can also send for you, if you insist on staying alive

  // what he says when he really gets going
  const HATE = {
    human: 'Humans. Breeding, bleating vermin. Sixty years of eating, rutting and begging, and then they have the gall to rot where I can smell it. When the realm is mine I will have them counted like cattle, and I will not be needing all of them.',
    dwarf: 'Dwarves. Squat, stinking misers who dig a hole, shit in it, and call that a kingdom. I am going to seal every mine they own with the lot of them still inside, and sell tickets to the noise.',
    elf: 'Elves. A thousand years apiece, and every one of them spent admiring their own arses. Bloodless, simpering things. I am going to burn their forests for the light to read by.',
    halforc: 'Half-orcs. Dumb meat that bleeds when you point at it. Good for holding a door or stopping an arrow. I shall use them for both, and I will not be learning their names.',
    tiefling: 'Tieflings. Some slattern of a great-grandmother lay down under a devil, and now the whole litter walks about expecting pity. They will get the knife, the same as everyone else. Only sooner.',
    drow: 'Drow. The elves even the elves threw out. They pray to a spider, they sell their own mothers by the pound, and they think living in the dark makes them deep. I will drown their tunnels and salt the water.'
  };
  // ------------------------------------------------------------ the scenes
  function scene(st, lines, opts) { return Object.assign({ place: 'arena', npc: [-1.5, -1.3], you: [1.6, 1.7], spawn: { look: O.look() }, lines }, O.stageOpts ? O.stageOpts() : {}, opts || {}); }
  function revive(then) {
    const st = G.state, h = st.hero, me = h.name, kin = KIN[h.race] || 'your people', n = O.deaths(st);
    const fin = () => { G.save(); then(); };
    if (!G.playScene) return fin();
    const ot = others(h.race), cap = k => KIN[k].charAt(0).toUpperCase() + KIN[k].slice(1);
    const TAIL = [
      S('npc', NAME, 'Hate? I am ABOVE them. There is me. Then there is a very long drop. And at the bottom there is everybody else, squirming. Hating them is only good manners. Your lot I can tolerate. You, I can use.', 'low'),
      S('npc', NAME, 'Eleven years the Kingdom of United Realms and Eireania butchered each other, and for eleven years my house turned the clocks back for both of the ungrateful bastards. Unmade their defeats. Sold them the same victory twice. And when they were done, the two crowns signed one clause between them: the hourglass houses go. Out. In a week. Like dogs.', 'npc'),
      S('npc', NAME, cap(ot[0]) + ' drew it up. ' + cap(ot[1]) + ' witnessed it. ' + cap(ot[2]) + ' carted my gold away, and ' + KIN[ot[3]] + ' held the gate and laughed. I have every name. I am going to hang them from that gate by their own guts, and I am going to stand underneath and applaud.', 'low'),
      S('npc', NAME, 'I tell the family it is a homeland for our people. And it will be. MINE. The throne, the treasury, the queen’s pretty wings nailed over my fireplace. It is mine by right, because I am better than every living thing in this realm, and I am sick to my back teeth of pretending otherwise.', 'npc'),
      S('npc', NAME, 'But a throne wants an arse the rabble will stomach, and they will not stomach mine. Not yet. So: you. Nobody, from nowhere, too stupid to stay dead. My vessel. You wear the crown. I wear you.', 'low'),
      S('npc', NAME, 'Sign. I keep hauling your carcass back, I lend you power you could not earn in ten lifetimes, and you climb until you are sitting exactly where I point. In return you owe me souls. Do not ask how many. More.', 'npc')];
    const OFFER = { choices: [
        { label: 'Sign it', go: () => { st.signed = true; G.save(); card('The Contract', 'The pen is warm. The ink is gold. Your name looks very small beside his, which takes up most of the page. “Good dog,” he says, and rubs his hands together, and laughs like a man watching a hanging he paid for.', 'Signed · the Oracle’s cellar is open to you in the market', then); } },
        { label: 'Not yet', go: () => { G.save(); if (G.garden && (st.deaths || 0) > 0) return then();       // unsigned and dead: the garden door is the answer, not another card
          card('An Open Offer', '“Not yet?” He leans in until you can smell the gold on him. “Take your time, meat. I have all of it. You will be back, and you will be deader, and I will be exactly this pleased.” He rolls the contract up, unsigned.', 'The Oracle’s cellar is open to you in the market', then); } }],
        done: fin };
    if (n === 0) { st.davidMet = 1; return G.playScene(scene(st, [
      S('', '', 'The hatch opens on gold. A great deal of gold, and a man in the middle of it, looking at you the way a butcher looks at a calf.', 'wide'),
      S('npc', NAME, 'Still alive. How bloody tedious. I had a whole entrance planned around your corpse.', 'npc'),
      S('you', me, 'Who are you?', 'you'),
      S('npc', NAME, 'David Roseinbeirg. Oracle of Time. The only thing under this city worth getting on your knees for. I have been watching you not die, and I am sick of waiting for it.', 'low'),
      S('npc', NAME, 'One of the ' + kin + ', at least. The only breed I can bear in the room. ' + SNEER[ot[0]], 'npc'),
      S('npc', NAME, HATE[ot[1]], 'low'),
      S('you', me, 'You hate everyone.', 'you')].concat(TAIL), OFFER)); }
    if (n === 1 && !st.davidMet) { st.davidMet = 1; return G.playScene(scene(st, [
      S('', '', 'You are dead. You are fairly sure of it. And yet somebody is swearing at you, and everything is gold.', 'wide'),
      S('npc', NAME, 'Up. UP, you sack of offal. I did not drag you back across the clock so you could leak on my floor. That floor is worth more than you, your mother, and the whole stinking level you crawled out of.', 'npc'),
      S('you', me, 'I was dead. Where is this?', 'you'),
      S('npc', NAME, 'Under the pit. Under the sewers. Under every last one of those bleating animals upstairs. I am David Roseinbeirg, Oracle of Time. Kneel or stand, I do not care. It all looks the same from up here.', 'low'),
      S('npc', NAME, 'One of the ' + kin + ', at least. Good. The only breed in this realm I can bear to have in the room. The rest I would not scrape off my boot.', 'npc'),
      S('npc', NAME, HATE[ot[0]], 'low'),
      S('npc', NAME, HATE[ot[1]], 'npc'),
      S('you', me, 'You hate everyone.', 'you')].concat(TAIL), OFFER)); }

    if (n === BIND && !G.garden) { st.bound = true; return G.playScene(scene(st, [
      S('npc', NAME, 'Three! Three times dead in the dirt, you clumsy bastard. Up. Oh, I do love a three.', 'npc'),
      S('you', me, 'You are in a good mood.', 'you'),
      S('npc', NAME, 'I am in a magnificent mood, and you are too thick to know why, which makes it better. Go on. Go and bleed on somebody. Not the ' + KIN[pick(others(h.race))] + ', mind. They cry. It puts me off my food.', 'low')], { done: fin })); }
    if (n > BIND && st.bound && !st.revealed) { st.revealed = true; return G.playScene(scene(st, [
      S('npc', NAME, 'Breathing again. Good. Sit down and shut up. I have a confession, and I have been saving it like a last bottle.', 'npc'),
      S('npc', NAME, 'That contract. Sign it, do not sign it. I could not give a rat’s cock either way, and I never could.', 'low'),
      S('you', me, 'What did you do?', 'you'),
      S('npc', NAME, 'ME? You died a third time, you witless lump, and I hauled you back a third time, and under a law older than both your crowns that is consent. Dying is a signature. Yours is on file. In triplicate. In your own blood.', 'npc'),
      S('npc', NAME, 'I told you about the week they threw us out. I did not tell you how many of them I mean to bury for it.', 'npc'),
      S('npc', NAME, 'So here is the rest, and you will carry it, because you no longer have a choice. The queen with her wings. Her husband with his sword. Every lord, priest and pot-boy between them and me. I want them broken, I want them kneeling, and then I want them dead, in that order. You take the crown. I take everything else. I am supreme, pet. The realm simply has not been told yet.', 'low')],
      { done: () => { G.save(); card('Dying Is a Signature', 'He laughs until he has to hold on to something. It is not a kind laugh. You find, to your disgust, that part of you wants to be on the same side of it.', 'You are bound to the Oracle · his plan is yours to carry', then); } })); }
    const lines = st.signed || st.bound ? [
      ['Again? Gods’ teeth, you die like you are being paid for it. That is another soul in the book. Gold ink. MY book.', 'Do not sulk at me. I make the rules. All of them. That is what being better than you is FOR.'],
      ['Up, you useless streak of piss. A ' + (G.RACES[h.race] || {}).name.toLowerCase() + ', cut down by THAT. You are an embarrassment to the only breed I can stomach.', sneer(h.race)],
      ['Every time I drag you back it gets easier. You are wearing thin, pet. Like a rag. I can see daylight through you.', 'Now get up there and open somebody. I want blood on that sand, and I want it by supper.']
    ] : [
      ['Still not signed, and I am still mopping you up. Do you know what my time is worth? More than your whole bloodline, boiled down and sold by the jar.', 'The offer stands. So do I. You, notably, do not.'],
      ['On your feet, meat. No charge. That is a lie. There is always a charge, and I always collect.', sneer(h.race)]
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
    cardEl.querySelectorAll('p.dim').forEach(p => { if (/Losing costs you/.test(p.textContent)) p.innerHTML = 'Death takes half your purse and a little of your name. A strongbox at home saves most of it. He turns the clock back one day, so nobody above the cellar remembers you fell. <b>Deaths: ' + O.deaths(st) + '</b>.'; });
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
    const greet = line || pick(tied ? ['There it is. My vessel. Wipe your feet, you are tracking peasant in.', 'Come in. Touch nothing. Breathe less.', sneer(h.race) + ' Now sit down and be useful.'].concat(st.revealed ? ['Four hundred clocks they made me leave behind. I am going to take a life for each. I have started a list. It is alphabetical.', 'A homeland, I tell them. Ha. A THRONE, pet. Mine. They can lick the steps.', 'My perfect vessel. Do not pull that face. A chamber pot is a vessel too, and I am fond of mine.'] : []) : ['Unsigned. And yet here you stand, in my cellar, breathing my air. I am a saint. Say it.', 'The contract is on the table. Under the lamp. It will wait. Corpses, I am told, are very patient.']);
    show('<div class="card small"><h2>The Oracle’s Cellar</h2><div class="mk-top"><span id="op"></span><div><p class="quote">“' + greet + '”</p><p class="dim">Deaths: <b>' + O.deaths(st) + '</b> · Souls owed: <b>' + d + '</b>' + (cutPct ? ' · he takes <b>' + cutPct + '%</b> of every purse' : ' · he takes no cut while you owe fewer than 3') + '</p></div></div>' +
      (!tied ? '<div class="ab-row"><div class="ab-ic pas">✒</div><div class="ab-tx"><b>The Contract</b><p>Power, and a way back from death, for a debt of souls and a throne to be named later.</p></div><button class="big" id="sign">Sign it</button></div>' : '<div class="ab-row deeddone"><div class="ab-ic pas">✒</div><div class="ab-tx"><b>The Contract</b><small>' + (st.revealed ? 'Binding. Signed three times, in the only ink that counts.' : 'In force.') + '</small><p>' + (st.revealed ? 'Usurp the Koheneim throne. Put a Roseinbeirg at your right hand. Then at your left. Then everywhere.' : 'You owe ' + NAME + ' a debt of souls. He will tell you what for when it suits him.') + '</p></div></div>') +
      (tied ? BOONS.map(b => { const onb = (st.favours || {})[b.id]; return '<div class="ab-row"><div class="ab-ic pas">⧗</div><div class="ab-tx"><b>' + b.name + '</b><small>A favour</small><p>' + b.desc + '</p></div><button data-fav="' + b.id + '" class="' + (onb ? 'big' : '') + '">' + (onb ? 'On' : 'Off') + '</button></div>'; }).join('') : '') +
      '<div class="ab-row"><div class="ab-ic pas">☠</div><div class="ab-tx"><b>Buy back a soul</b><small>' + price + ' coin · the price rises each time</small><p>Until he has other work for you, he will take gold. He will always take gold.</p></div><button class="big" id="pay"' + (d < 1 || st.coin < price ? ' disabled' : '') + '>' + (d < 1 ? 'Nothing owed' : 'Pay ' + price) + '</button></div>' +
      '<div class="row end"><button class="big" id="x">Climb out</button></div></div>');
    document.getElementById('op').appendChild(G.portrait(O.look(), 92));
    on('#x', () => { ui.close(); ui.topbar(); });
    on('#sign', () => { st.signed = true; G.save(); G.sfx('level'); ui.oracle('HA! Mine. No, keep the pen. No, give it back, it is gold, you thieving little shit.'); });
    on('#pay', () => { if (d < 1 || st.coin < price) return; st.coin -= price; st.soulDebt = d - 1; st.soulsPaid = (st.soulsPaid || 0) + 1; G.save(); G.sfx('coin'); ui.topbar(); ui.oracle(pick(['He counts it. Twice. Bites one. “Lovely. Now piss off and earn more.”', 'One soul, struck off. Do not look so pleased. I have the rest, and I like the rest.'])); });
    on('[data-fav]', el => { st.favours = st.favours || {}; st.favours[el.dataset.fav] = !st.favours[el.dataset.fav]; G.save(); G.sfx('place'); ui.oracle(st.favours[el.dataset.fav] ? 'Clever. On account, naturally. Everything is on account.' : 'Then die properly. See if I care. I will, slightly. It is expensive.'); });
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
    const up0 = h.update, MUTTER = ['Tick. Tick. Mine.', 'Gold keeps. People rot.', 'Kneel. All of them.', 'Supreme. Say it again.', 'Bleating animals.'];
    let mt = 10;
    h.update = function (t) {
      up0.apply(this, arguments);
      const st = G.state, open = !!(st.hero && O.known(st));
      g.visible = open; lt.intensity = open ? 9 + Math.sin(t * 2) * 2 : 0;
      spot.x = open ? X : -99; spot.z = open ? Z + 1.6 : -99;
      hands[0].rotation.z = -t * 0.9; hands[1].rotation.z = t * 0.13;
      if (open) { const key = st.hero.race; if (!david || lookKey !== key) { if (david) s.remove(david.root); david = G.makeChar(O.look()); david.root.position.set(X + 1.7, 0, Z - 0.2); david.root.rotation.y = 0.5; s.add(david.root); lookKey = key; }
        david.root.visible = true; david.pose({ t, act: Math.sin(t * 0.6) > 0.75 ? 'cast' : 'idle', prog: 0.25 });
        mt -= 0.016; if (mt <= 0 && G.scene === 'hub' && !ui.isOpen() && !G.talk) { mt = 16 + Math.random() * 14; gfx.floatText(X + 1.7, 2.9, Z - 0.2, pick(MUTTER), '#e8d8ff'); } }
      else if (david) david.root.visible = false;
    };
    const blocked0 = h.blocked;
    h.blocked = (x, z) => blocked0(x, z) || (!!(G.state.hero && O.known(G.state)) && ((x > X - 1.5 && x < X + 1.5 && z > Z - 1.5 && z < Z + 0.9) || (Math.abs(x - (X + 1.7)) < 0.5 && Math.abs(z - (Z - 0.2)) < 0.5)));
    return h;
  };
  const or0 = ui.oracle;
  ui.oracle = function () { G.state.cellarSeen = 1; return or0.apply(this, arguments); };
  const obj0 = G.objective;
  G.objective = function () { const st = G.state, base = obj0.apply(this, arguments); return st.hero && G.scene === 'hub' && O.known(st) && !st.cellarSeen ? 'A clock is ticking over a hatch on the south side of the market' : base; };

  if (G.LORE) G.LORE.push(
    { sec: 'Faces', title: 'David Roseinbeirg', unlock: st => (st.deaths || 0) >= 1, body: 'He calls himself the Oracle of Time, and the clocks in his cellar do run backwards when he looks at them. A wizard of the Roseinbeirg family: old gold, older grudges, and a great many cousins. He holds himself supreme: above the crowns, above every people in the realm, above his own family, and certainly above you. He says so, often, in language that would get a docker thrown out of a tavern. He wants the realm, he wants it for himself, and he talks about what he will do to everyone in his way with real appetite. Your kind he can tolerate. You he can use. He brought you back from the dead, and he has not yet said everything he wants for it.' },
    { sec: 'The World', title: 'A Debt of Souls', unlock: st => !!(st.signed || st.bound), body: 'Every time the Oracle turns the clock back for you, a soul goes on the account. Whose soul is a question he answers with a wave of the hand. While you owe three or more he takes a tenth of every purse; at six, a fifth. He will sell a soul back for gold, at a price that rises each time, because of course it does.' },
    { sec: 'The World', title: 'Dying Is a Signature', unlock: st => !!st.revealed, body: 'Under a law older than the Koheneim throne, to be raised from death three times by the same hand is to accept that hand’s terms. David Roseinbeirg knew this. He did not mention it. His terms are simple: you will take the throne of Queen Eerin Koheneim and Vilhelm van Koheneim IV, from the bottom of the realm to the top, and when you sit on it the Roseinbeirg family will move into the lands, the titles and the treasury. He has told nobody but you. He rubs his hands together when he says it.' }
  );
  if (G.LORE) G.LORE.push(
    { sec: 'The World', title: 'The Great Conflict', unlock: st => (st.deaths || 0) >= 1, body: 'Eleven years of war between the Kingdom of United Realms, which the Koheneim throne rules from Highmarch, and Eireania across the grey water. Nobody won. The peace that ended it had one clause both crowns signed without argument: the hourglass houses, the old families of time-wizards who had sold their craft to both sides, were to leave. Every one of them, from both kingdoms, within the week.' },
    { sec: 'The World', title: 'The Hourglass Houses', unlock: st => (st.deaths || 0) >= 1, body: 'Wizard families who learned, long ago, to make a moment happen twice. Kings paid them to undo defeats, and feared them for the same reason. Since the expulsion they have lived as guests in other people’s lands, welcome nowhere for long. The Roseinbeirgs are the richest of them and the angriest. David Roseinbeirg means to make his people a homeland out of the Kingdom of United Realms itself, and he has chosen you as his vessel: someone who can be put on the throne, and steered. Whether he grieves for his house or only wants its gold back is not a question he answers the same way twice.' }
  );
  if (G.TIPS) G.TIPS.push('A lost bout is a death. The coin in your purse is gone, but a strongbox at home keeps what is in it.', 'Souls owed to the Oracle cost you a share of every purse. Buy them back before they stack up.');
})();
