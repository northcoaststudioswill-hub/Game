// Guttercrown — the Long Stair opens: three bouts above the pit, an ending that depends on what you did to get there,
// and the tiefling's infernal spirits
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), S32 = 32;
  const S = (who, name, text, shot) => ({ who, name, text, shot }), tied = st => !!(st.signed || st.bound), DAVID = 'David Roseinbeirg', KING = 'Vilhelm van Koheneim IV', QUEEN = 'Eerin Koheneim';

  // ------------------------------------------------------------ who stands on the stair
  const FOES = [
    { id: 'asc_captain', name: 'Captain Hale Morrow', title: 'of the Seal-Wardens', cls: 'fighter', race: 'human', level: 9, sub: 'battlemaster', known: ['shield_bash', 'cleave', 'leap_slam', 'second_wind'], ult: 'action_surge', arm: 'f_halberd', hpMul: 1.45, dmgMul: 0.92, ai: { react: 0.26, aggro: 0.75, dodge: 0.22, guard: 0.5, parry: 0.25 }, xp: 500, coin: 500, respect: 200, boss: 1,
      tint: { armor: '#e8e4f0', armor2: '#b0b8cc', cloth: '#f4f0ff', trim: '#f0c95a', legs: '#9aa0b4' }, lookKit: 'warden', taunt: 'Forty years nobody has set a boot on this stair. You will not be the first to set two.', bio: 'Hale Morrow has held the foot of the Long Stair since before you were born. Nobody has ever asked him to do anything else.' },
    { id: 'asc_king', name: KING, title: 'the hand in the iron glove', cls: 'fighter', race: 'human', level: 10, sub: 'champion', known: ['shield_bash', 'cleave', 'leap_slam', 'war_cry'], ult: 'action_surge', arm: 'f_basic', hpMul: 1.6, dmgMul: 1.0, ai: { react: 0.22, aggro: 0.8, dodge: 0.3, guard: 0.55, parry: 0.3 }, xp: 700, coin: 800, respect: 300, boss: 1, scale: 1.08,
      tint: { armor: '#3a3640', armor2: '#201c26', cloth: '#5a1f7a', trim: '#f0c95a', legs: '#26222c', hair: '#c8c0b0' }, lookKit: 'plate', taunt: 'I came down to your pit in a cloak and watched you. I was not impressed then either.', bio: 'The Queen’s husband, and the reason the Iron Peace has an edge. He has not lost a bout in his life, because until tonight nobody was permitted to offer him one.' },
    { id: 'asc_queen', name: 'Queen ' + QUEEN, title: 'faerie-born, of the Koheneim throne', cls: 'sorcerer', race: 'elf', level: 10, sub: 'draconic', known: ['ray_frost', 'misty_step', 'lightning_bolt', 'glyph'], ult: 'fireball', arm: 's_frost', hpMul: 1.55, dmgMul: 1.0, ai: { react: 0.2, aggro: 0.8, dodge: 0.4 }, xp: 1000, coin: 1500, respect: 500, boss: 1,
      tint: { armor: '#e6e4f0', armor2: '#b8b0d8', cloth: '#f4f0ff', trim: '#c8b8ff', legs: '#8a80b0', hair: '#f2eefc' }, cos: { back: 'wings' }, taunt: 'I have ruled since before your people had a word for king. Did the little clock-maker tell you that, when he sent you up?', bio: 'Eerin Koheneim, crowned before most living families had names. She has never once come down the Long Stair. She did not need to. You came up.' }
  ];
  FOES.forEach((o, i) => { o.ascent = i; G.BIOS[o.id] = o.bio; o.look = { cls: o.cls, race: o.race, tint: o.tint, arm: o.arm, kit: o.lookKit, cos: o.cos, scale: o.scale, gear: { weapon: 2, armor: 2 } }; });
  const stage = st => st.ascent || 0;
  const open = st => !!(st.wins && st.wins.vexa) && ((tied(st) && G.defended(st) >= 2) || G.defended(st) >= 5);
  G.ascent = { FOES, open, stage, begin: () => begin() };

  const INTRO = [
    (st, me) => [S('', '', 'The iron gate at the foot of the Long Stair has two seals on it. Tonight one of them is broken, and nobody will say by whom.', 'wide'), S('npc', FOES[0].name, 'Back down, pit-crown. That brass on your head is a joke the Guild tells. It does not open doors.', 'npc'), S('you', me, 'It opened this one.', 'you'), S('npc', FOES[0].name, 'Then I will close it. With you under it.', 'low')].concat(G.FL3 && G.FL3.captain[st.hero.cls] ? [S('npc', FOES[0].name, G.FL3.captain[st.hero.cls], 'npc')] : []),
    (st, me) => [S('', '', 'Nine hundred steps. White stone, clean air, and at the top a man waiting with his cloak already off.', 'wide'), S('npc', KING, 'So. The cellar has sent me its monarch. I told my wife this would happen. She said the pit would keep you busy for ever.', 'npc'), S('you', me, 'It nearly did.', 'you'), S('npc', KING, 'I know who is behind you. I can smell the gold on you from here. He was a coward eleven years ago and he has sent somebody else again.', 'low'), S('npc', KING, 'No crowd up here. No Guild. Only the two of us, and one glove.', 'npc')].concat(G.FL3 && G.FL3.king[st.hero.cls] ? [S('npc', KING, G.FL3.king[st.hero.cls], 'low')] : []),
    (st, me) => [S('', '', 'The throne room is white from floor to vault, and very quiet. She does not stand up.', 'wide'), S('npc', QUEEN, 'You killed my husband on my own stair. I heard it. I have heard everything that ever happened in this realm; it is the only thing I am really for.', 'npc'), S('you', me, 'Then you know why I am here.', 'you'), S('npc', QUEEN, tied(st) ? 'I know whose you are. A little clock-maker with a grudge has wound you up and pointed you at me. I wonder if you know how he means to spend you.' : 'I know nobody sent you. That is the part I did not expect. In four hundred years nobody has ever come up that stair for themselves.', 'low'), S('npc', QUEEN, 'Come, then. Let us see what the bottom of my realm has grown.', 'npc')].concat(st.hero.race === 'elf' ? [S('npc', QUEEN, 'And one of my own blood, too. I wondered which of the old families would be the one to forget itself.', 'low')] : st.hero.race === 'drow' ? [S('npc', QUEEN, 'A child of the deep. We sent your people down there, you know. I signed it. I see they kept the grudge.', 'low')] : G.FL3 && G.FL3.queen[st.hero.race] ? [S('npc', QUEEN, G.FL3.queen[st.hero.race], 'low')] : st.hero.cls === 'druid' ? [S('npc', QUEEN, 'A shape-wearer. There were faerie who could do that, once. I had them all to dinner, and then there were none.', 'low')] : [])
  ];
  const lookOf = o => o.look;
  function begin() { const st = G.state, i = stage(st), o = FOES[i]; if (!o) return; ui.close();
    const hall = i > 0 && G.cine && G.cine.throneStage ? { stage: G.cine.throneStage(), npc: [-0.8, 4.6], you: [1.3, 7.3] } : {};
    G.playScene(Object.assign({ place: 'arena', npc: [-1.6, -1.4], you: [1.6, 1.7], spawn: { look: lookOf(o) }, lines: INTRO[i](st, st.hero.name), done: () => { G.ui.hub(); ui.close(); ui.prefight(o); } }, hall)); }

  // ------------------------------------------------------------ the gate at the Long Stair
  const st0 = ui.stair;
  if (st0) ui.stair = function () {
    const r = st0.apply(this, arguments), st = G.state, card = document.querySelector('#panel .card'), end = card && card.querySelector('.row.end'); if (!end || !st.wins) return r;
    const i = stage(st), e = document.createElement('div'); e.className = 'ab-row';
    if (i >= 3) e.innerHTML = '<div class="ab-ic pas">♛</div><div class="ab-tx"><b>The gate stands open</b><p>' + ENDINGS[st.usurper || 'alone'].line + '</p></div><span class="lock">Yours</span>';
    else if (open(st)) { e.innerHTML = '<div class="ab-ic pas">♛</div><div class="ab-tx"><b>Climb the Long Stair</b><small>' + ['First: the Captain of the Seal-Wardens', 'Second: ' + KING, 'Last: the Queen'][i] + '</small><p>There is no undercard up there, and nobody will fetch a stretcher. ' + (tied(st) ? 'This is what he brought you back for.' : 'Nobody sent you. That makes it yours.') + '</p></div><button class="big">Climb</button>'; e.querySelector('button').onclick = () => { G.sfx('bell'); begin(); }; }
    else if (st.wins.vexa) e.innerHTML = '<div class="ab-ic pas">♛</div><div class="ab-tx"><b>The gate is sealed</b><p>Two seals: a faerie wing and a gauntlet. ' + (tied(st) ? 'Turn away ' + Math.max(0, 2 - G.defended(st)) + ' more challenger' + (2 - G.defended(st) === 1 ? '' : 's') + ' and the Oracle says he can break one.' : 'Hold the crown against ' + Math.max(0, 5 - G.defended(st)) + ' more challengers and even the Wardens will have to step aside. A certain cellar would get you there sooner.') + '</p></div><span class="lock">Sealed</span>';
    else return r;
    end.parentNode.insertBefore(e, end); return r;
  };
  const ENDINGS = {
    vessel: { title: 'The Vessel', line: 'You sit the Koheneim throne. David Roseinbeirg stands behind it, and decides.', text: 'You sit down on the white throne and it is cold. Before you have drawn breath there is a hand on your shoulder, heavy with rings. “Good dog,” says David Roseinbeirg, and laughs until the vault rings with it. You still owe him. You always will. The proclamations go out under your name; you are not asked to read them first. The hourglass houses come home. Everybody else learns to kneel.' },
    ash: { title: 'The Ash Throne', line: 'You owe nobody. You rule a realm you burned to take.', text: 'You owe David Roseinbeirg nothing, and he knows it, and it is the first time you have ever seen him afraid. He takes his lands and his gold and stays very polite. From the window of the throne room you can see smoke in the outlands, old and new. They will call you a monarch in Highmarch. In Fenrow and Low Barrow they have another word, and they will teach it to their children.' },
    free: { title: 'Paid in Full', line: 'You owe nobody, and you burned nothing. The throne is yours alone.', text: '“Mine,” says David Roseinbeirg, with his hand already out. You count his souls back to him, every one, paid. He stares at the ledger for a long time. Then he calls you things that would get a docker thrown out of a tavern, and you have the Wardens show him the stair. Nine hundred steps down. The realm above has a ruler who came up from the ninth level, owes nothing, and remembers what the bottom looks like.' },
    alone: { title: 'From the Bottom', line: 'Nobody sent you. You took it anyway.', text: 'No patron. No contract. No cellar full of clocks. You came up the Long Stair because it was there and nobody had said you could not, and now the white throne has pit sand on it. Somewhere under the sewers a man in a gold room is screaming at a wall. The Ledger-Keeper sends up a single line: “Debt struck. All of it.”' }
  };
  function ending() {
    const st = G.state, k = !tied(st) ? 'alone' : (st.soulDebt || 0) > 0 ? 'vessel' : (st.terror || 0) >= 2 ? 'ash' : 'free', E = ENDINGS[k];
    st.usurper = k; st.respect += 500; G.save(); G.sfx('level');
    show('<div class="card small res win"><small class="over">The realm, from the bottom to the top</small><h1>' + E.title + '</h1><p>' + E.text + '</p><p class="dim">+500 respect. The pit, the market and the Ledger are still there below you, and so is everything you left undone. Your fighter is saved.</p><div class="row end"><button class="big" id="ok">Go back down</button></div></div>');
    on('#ok', () => ui.levelCheck());
  }
  ui.ending = ending;
  const res0 = ui.results;
  ui.results = function (r) {
    const st = G.state, a = r && r.opp && r.opp.ascent; if (r && r.win && a != null && stage(st) === a) { st.ascent = a + 1; G.save(); }
    const out = res0.apply(this, arguments);
    if (r && r.win && a != null) { const cardEl = document.querySelector('#panel .card.res'), q = cardEl && cardEl.querySelector('.quote'), ok = cardEl && cardEl.querySelector('#ok');
      if (q) q.textContent = ['The Captain goes down on the first step of his own stair. Above you, nine hundred more.', 'The gauntlet comes off his hand and rings on the stone all the way down. Nobody picks it up.', 'She does not fall. She simply stops, like a clock, and all the light goes out of the wings.'][a];
      if (a === 2 && ok) { const nb = ok.cloneNode(true); nb.textContent = 'Sit down'; ok.parentNode.replaceChild(nb, ok); nb.addEventListener('click', () => { G.sfx('ui'); ending(); }); } }
    return out;
  };
  const obj0 = G.objective;
  G.objective = function () { const s = obj0.apply(this, arguments), st = G.state; if (st && st.hero && G.scene === 'hub' && open(st) && stage(st) < 3 && typeof s === 'string' && !/grudge|clock|Tally has news/.test(s)) return 'The gate at the Long Stair is open. ' + ['The Captain of the Wardens', KING, 'The Queen'][stage(st)] + ' is waiting'; return s; };
  if (G.LORE) G.LORE.push(
    { sec: 'The World', title: 'The Long Stair, Opened', unlock: st => stage(st) >= 1, body: 'Nine hundred steps of white stone between the ninth level and the throne. For forty years two seals and two Wardens kept it shut. It took a brass crown, a broken seal, and somebody who would not stay dead.' },
    { sec: 'The World', title: 'How It Ended', unlock: st => !!st.usurper, body: 'There are four ways to sit the Koheneim throne. As a vessel, with a debt of souls outstanding and a hand on your shoulder. Over ash, owing nothing but with the outlands burned behind you. Paid in full, with clean hands and a furious wizard on the stair. Or alone, with no contract at all. The Ledger-Keeper has written down which one was yours.' }
  );

  // ------------------------------------------------------------ tieflings: an infernal spirit answers when you taunt
  const SPIRITS = { hound: ['Hellhound', 'Your taunt looses it: it savages them for 8 + 2 per level.', '#ff5a1a'], cat: ['Ember Cat', 'Your taunt wakes it: 4s of speed, and nothing can touch you for a moment.', '#ffb060'], crow: ['Carrion Crow', 'Your taunt sends it: they are marked, taking 25% more for 4s.', '#c79bff'] };
  G.spirits = { SPIRITS, of: h => h.race === 'tiefling' ? (h.spirit || 'hound') : null,
    onTaunt: function (e, foe) { const h = G.state.hero, k = G.spirits.of(h); if (!k || !foe) return; const col = SPIRITS[k][2], x = foe.x / S32, z = foe.y / S32;
      for (let i = 0; i < 18; i++) gfx.emit(x + (Math.random() - 0.5), 0.3 + Math.random() * 1.2, z + (Math.random() - 0.5), (Math.random() - 0.5) * 3, 1 + Math.random() * 2, (Math.random() - 0.5) * 3, 0.6, col, 0);
      try { if (G.makeBeast) { const b = G.makeBeast(k === 'crow' ? 'bat' : 'wolf', k === 'hound' ? 0x6a140c : k === 'cat' ? 0x3a2418 : 0x1a1420, k === 'hound' ? 0xff5a1a : null), sc = gfx.scene(); b.root.scale.setScalar(k === 'hound' ? 0.75 : 0.5); const tx = k === 'cat' ? e.x / S32 : x, tz = k === 'cat' ? e.y / S32 : z; b.root.position.set(tx + 0.7, 0, tz + 0.4); b.root.rotation.y = Math.atan2(tx - b.root.position.x, tz - b.root.position.z); b.pose({ t: 0, act: 'swing', prog: 0.5 }); sc.add(b.root); setTimeout(() => sc.remove(b.root), 900); } } catch (er) { }
      if (k === 'hound') { const d = 8 + 2 * h.level; foe.hp = Math.max(1, foe.hp - d); foe.flash = 0.12; foe.hurt = 0.28; gfx.floatText(x, 2.6, z, 'HELLHOUND ' + d, col); G.sfx('crit'); }
      else if (k === 'cat') { e.buffs.speed = { t: 4, amt: 0.25 }; e.iframe = Math.max(e.iframe || 0, 0.6); gfx.floatText(e.x / S32, 2.9, e.y / S32, 'NINE LIVES', col); G.sfx('buff'); }
      else { foe.st.mark = { t: 4 }; gfx.floatText(x, 2.6, z, 'MARKED', col); G.sfx('swing'); } } };
  const sheet0 = ui.sheet;
  ui.sheet = function () { const r = sheet0.apply(this, arguments), st = G.state, h = st.hero, dv = document.querySelector('#panel .card .derived'); if (!dv || h.race !== 'tiefling') return r;
    const cur = G.spirits.of(h), d = document.createElement('div'); d.className = 'ab-row'; d.innerHTML = '<div class="ab-ic pas">♆</div><div class="ab-tx"><b>Infernal spirit: ' + SPIRITS[cur][0] + '</b><small>Tiefling blood</small><p>' + SPIRITS[cur][1] + '</p></div><div class="slots">' + Object.keys(SPIRITS).map(k => '<button class="slot' + (k === cur ? ' sel' : '') + '" data-spirit="' + k + '">' + SPIRITS[k][0].split(' ').pop() + '</button>').join('') + '</div>';
    dv.parentNode.insertBefore(d, dv.nextSibling); d.querySelectorAll('[data-spirit]').forEach(b => b.onclick = () => { h.spirit = b.dataset.spirit; G.save(); G.sfx('place'); ui.sheet(); }); return r; };
  if (G.RACES.tiefling) G.RACES.tiefling.desc = '+2 Charisma, +1 Intelligence. Infernal blood, and an infernal spirit that answers when you taunt: hellhound, ember cat or carrion crow.';
  if (G.LORE) G.LORE.push({ sec: 'The Trades', title: 'Infernal Spirits', unlock: st => !!(st.hero && st.hero.race === 'tiefling'), body: 'Every tiefling is followed by something. It came with the blood, from whichever ancestor made the bargain, and it does not answer to a whistle. It answers to nerve. Stand in the pit, turn your back and laugh at the other fighter, and it comes: a hellhound that takes a piece of them, an ember cat that makes you hard to hit, or a carrion crow that marks them for what comes next. Choose which with the Guildmaster.' });
})();
