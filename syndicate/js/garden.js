// Guttercrown — the Hour Garden: what David does with the ones who will not sign.
(function () {
  'use strict';
  const G = window.G, ui = G.ui, O = G.oracle, W = G.world, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  if (!O || !O.revive) return;
  const NAME = 'David Roseinbeirg', SOULS = 10, pick = a => a[Math.floor(Math.random() * a.length)];
  const tied = st => !!(st.signed || st.bound);
  const SHADES = ['Nobody of Note', 'A Debtor, Unnamed', 'The One Before You', 'Somebody’s Brother', 'A Late Payer', 'The Understudy', 'Half-a-Chance', 'A Hopeful', 'The Substitute', 'A Name Ruled Through'];
  const TAUNTS = ['I signed nothing either. Look at me.', 'There is only one way out of here and it is through you.', 'He said the last one standing walks. He always says that.', 'I have been here since before your first bout.', 'Do not be sorry. I will not be.', 'You put me here. Did you know that?', 'The flowers are real. That is the worst part.', 'He is watching. He claps when it is close.', 'I do not remember my name. I remember yours.', 'Nine of us die today whatever happens. Make it ten.'];
  G.garden = { SOULS, run: null };

  function souls(st) {
    const f = (st.fallen || []).slice(-40).sort(() => Math.random() - 0.5).slice(0, SOULS), h = st.hero, cl = G.FOE_CLASSES || ['fighter', 'rogue', 'sorcerer', 'cleric'], races = Object.keys(G.RACES);
    return Array.from({ length: SOULS }, (_, i) => { const q = f[i], cls = (q && q.c && G.CLASSES[q.c]) ? q.c : cl[Math.floor(Math.random() * cl.length)], C = G.CLASSES[cls], lv = Math.max(1, h.level - 1);
      return { id: 'soul' + i, name: q ? q.n : SHADES[i], title: q ? 'whom you killed' : 'a soul he kept', cls, race: races[Math.floor(Math.random() * races.length)], level: lv, known: C.start.slice(0, 1 + (i >= 5 ? 1 : 0)).filter(id => G.ABILITIES[id]),
        hpMul: +(0.36 + i * 0.022).toFixed(2), dmgMul: +(0.52 + i * 0.03).toFixed(2), ai: { react: 0.6 - i * 0.02, aggro: 0.62, dodge: 0.06 + i * 0.01, guard: 0.2, parry: 0.03 + i * 0.008 }, xp: 0, coin: 0, respect: 0, garden: 1, taunt: TAUNTS[i],
        tint: { cloth: '#cfe0ee', armor: '#9fb4c8', armor2: '#7f94a8', trim: '#f4f8ff', hair: '#eef4ff', legs: '#aebccb' }, mine: !!q }; });
  }
  const arena = () => W.get('arena');
  function leave() { const a = arena(); if (a.garden) a.garden(false); G.garden.run = null; }

  function bout() {
    const run = G.garden.run, st = G.state, o = run.list[run.i]; ui.close();
    show('<div class="card small"><small class="over">The Hour Garden · soul ' + (run.i + 1) + ' of ' + SOULS + '</small><h2>' + o.name + '</h2><p class="dim">' + o.title + ' · ' + G.RACES[o.race].name + ' ' + G.CLASSES[o.cls].name + '</p><p class="quote">“' + o.taunt + '”</p>' +
      '<div class="pips gpips">' + run.list.map((q, k) => '<i class="' + (k < run.i ? 'on' : '') + '"></i>').join('') + '</div><p class="note">You carry your wounds from one to the next. You have <b>' + Math.round(run.hp * 100) + '%</b> of your health and <b>' + (st.potions || 0) + '</b> potion' + (st.potions === 1 ? '' : 's') + '. Fall once and it is over for good.</p><div class="row end"><button class="big" id="go">Fight</button></div></div>');
    on('#go', () => { ui.close(); if (ui.leaveHub) ui.leaveHub(); G.scene = 'fight'; ui.topbar(); const a = arena(); if (a.garden) a.garden(true);
      o.onDone = win => { const P = G.fight.P, frac = P ? Math.max(0, P.hp / P.maxHp) : 0; o.onDone = null;
        if (!win) return soulDeath(o);
        run.i++; run.hp = Math.min(1, frac + 0.18); G.sfx('holy');
        if (run.i >= SOULS) return survived();
        bout(); };
      G.fight.start(o); const P = G.fight.P; if (P) P.hp = Math.max(1, Math.round(P.maxHp * run.hp)); });
  }
  function survived() {
    const st = G.state, run = G.garden.run, then = run.then; leave(); st.gardens = (st.gardens || 0) + 1; G.save(); G.scene = 'hub';
    show('<div class="card small letter event"><small class="over">The Hour Garden</small><h2>Last One Standing</h2><p>The tenth one comes apart like breath on glass. The blossom keeps falling. Somewhere above the trees a man is applauding, slowly, with his rings on.</p><p class="quote">“' + pick(['OH, well DONE. I had money on the dwarf. I had money on all of them, actually. Up you get, meat. You have cost me a fortune and I have not enjoyed anything so much in years.', 'Ten! Ten of the whimpering little bastards, and you went through them like a dose. I am almost aroused. Go on. Back to the dirt. The pen is still warm whenever you tire of this.', 'You LIVE. Disgusting. Magnificent. Do it again some time, I will sell tickets.']) + '”</p><p class="got">You wake on the sand of the Blood Pit. You have survived the garden ' + st.gardens + ' time' + (st.gardens === 1 ? '' : 's') + '.</p><div class="row end"><button class="big" id="x">Wake</button></div></div>');
    on('#x', () => { ui.close(); then(); });
  }
  function soulDeath(by) {
    const st = G.state, h = st.hero, epi = h.name + ', level ' + h.level + ' ' + G.CLASSES[h.cls].name + ' · ' + G.RANKS[G.rankOf(st.respect)].name + ' · ' + (st.fallen || []).length + ' in the sand · fell to soul ' + (G.garden.run.i + 1) + ' of ' + SOULS;
    leave(); try { const g = JSON.parse(localStorage.getItem('guttercrown_graves') || '[]'); g.push(epi); localStorage.setItem('guttercrown_graves', JSON.stringify(g.slice(-20))); } catch (e) { }
    G.scene = 'hub'; G.gameOver = 1; G.wipe();
    show('<div class="card small letter event gameover"><small class="over">Soul death</small><h2>Game Over</h2><p>' + by.name + ' stands over you in the grass. There is no hatch this time, and no gold, and nobody turns anything back. The blossom covers you by evening.</p><p class="quote">“' + pick(['Pity. No, not pity. What is the other one? Lunch.', 'And THAT is what “not yet” buys you, you stubborn streak of piss. Next!', 'I did offer. I offered twice. Nobody can say I am not a generous man.']) + '”</p><p class="got">' + epi + '</p><p class="note">This fighter is gone. The save has been erased.</p><div class="row end"><button class="big" id="x">Back to the title</button></div></div>');
    on('#x', () => location.reload());
  }
  function gate(then) {
    const st = G.state;
    show('<div class="card small letter event"><small class="over">You would not sign</small><h2>The Hour Garden</h2><p>He does not send you back up. He opens a different door. There is sunlight behind it, which is wrong, and grass, and blossom coming down like snow.</p><p class="quote">“' + (st.gardens ? 'Back again, and STILL too proud to hold a pen. Good. I was getting bored.' : 'Unsigned meat does not get carried. Unsigned meat EARNS it. My garden. Ten souls I have been keeping for a rainy day, and you, and one way out.') + ' Last one breathing gets to go on breathing. I watch. It is the only thing down here that still gets my blood up.”</p>' +
      '<p class="note"><b>Ten souls, one after another.</b> Your wounds carry over; you get a little breath back between them. Survive all ten and you wake in the pit. <b>Die in the garden and the game is over: this fighter is erased.</b> Or sign, and he simply brings you back, as he does for everyone he owns.</p>' +
      '<div class="row end"><button id="sg">Sign the contract</button><button class="big danger" id="gd">Walk into the garden</button></div></div>');
    on('#sg', () => { st.signed = true; G.save(); G.sfx('level'); show('<div class="card small letter event"><h2>The Contract</h2><p>The pen is warm. The ink is gold. “There. Was that so hard? All that pride, and it folds like a wet hat.” He shuts the garden door with his foot.</p><p class="got">Signed · he will bring you back from now on · every death is a soul on your account</p><div class="row end"><button class="big" id="x">Carry on</button></div></div>'); on('#x', () => { ui.close(); then(); }); });
    on('#gd', () => { G.garden.run = { i: 0, hp: 0.7, list: souls(st), then }; G.save(); bout(); });
  }
  const rev0 = O.revive;
  O.revive = function (then) { const st = G.state; if (!(st.deaths > 0)) return rev0.call(this, then); return rev0.call(this, function () { if (tied(G.state)) return then(); gate(then); }); };

  if (G.LORE) G.LORE.push({ sec: 'The World', title: 'The Hour Garden', unlock: st => !!st.gardens || (st.deaths > 0 && !tied(st)), body: 'Under the cellar there is a door that opens on daylight. Nobody has explained the daylight. David Roseinbeirg keeps a garden there, walled and in blossom all year, and in it he keeps the ones who died owing him and would not sign. When somebody unsigned dies again he puts them in with ten of the others and shuts the door. The last one standing is turned back and wakes on the sand. The rest are not turned back. He calls it a fair offer, and by his lights it is: he has never once pretended it was anything but for his own amusement.' });
  if (G.objective) { const ob0 = G.objective; G.objective = function () { const s = ob0.apply(this, arguments), st = G.state; return st && st.hero && st.deaths > 0 && !tied(st) && s && !/garden/.test(s) ? s + ' · unsigned: your next death is the Hour Garden' : s; }; }
})();
