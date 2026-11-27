// Guttercrown — finding your way: a line at the top that says what is new and what is worth doing, a guide who walks you round the market,
// what your home is doing for you, people to talk to (David included), and names under the buttons when you play with keys or a pad
(function () {
  const G = window.G, T = THREE, gfx = G.gfx, W = G.world, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), pick = a => a[Math.floor(Math.random() * a.length)];
  const S = (who, name, text, shot) => ({ who, name, text, shot });
  const bouts = st => Object.keys(st.wins || {}).reduce((n, k) => n + st.wins[k], 0) + (st.losses || 0);
  const rank = st => G.rankOf(st.respect), has = (st, id) => (st.items || []).some(p => p.id === id);
  const UN = G.UNLOCKS || {}, KEYS = Object.keys(UN), open = k => !G.unlocked || G.unlocked(k);

  // ------------------------------------------------------------ what is worth doing next
  const WHAT = { board: ['the Notice Board', 'take a contract for extra pay', 'by the pit gate'], cook: ['Big Hobb’s Pot', 'a meal lasts your next bout', 'south side of the market'], tally: ['the Low Lamp', 'people owe you now: give them work', 'west wall'], apoth: ['the Apothecary', 'a tonic for your next bout', 'south-west stalls'],
    mark: ['Marc’s table', 'bets, dice and schemes', 'north-east corner'], wisp: ['the Wisp Table', 'Marc’s dice room', 'east side'], armory: ['the Armoury', 'new weapons, through the Fence', 'at the Fence'], tailor: ['the Tailor', 'change how you look, through the Fence', 'at the Fence'],
    outfit: ['the Outfitter', 'kits and sets, through the Fence', 'at the Fence'], charms: ['the charm seller', 'one charm bends one rule', 'south stalls'], whisper: ['Whisper', 'scout your next opponent', 'east stalls'], trainer: ['teachers', 'learn techniques, on the Guildmaster’s sheet', 'at the Guildmaster'] };
  const nextRankLine = st => { const r = rank(st), nx = G.RANKS[r + 1]; if (!nx) return ''; const ks = KEYS.filter(k => UN[k].rank === r + 1).map(k => WHAT[k] ? WHAT[k][0] : UN[k].name); return ks.length ? nx.name + ' in ' + Math.max(0, nx.at - Math.round(st.respect)) + ' respect opens ' + ks.slice(0, 3).join(', ') : ''; };
  const obj0 = G.objective;
  G.objective = function () {
    const s = obj0.apply(this, arguments), st = G.state; if (!st || !st.hero || typeof s !== 'string' || G.scene !== 'hub') return s;
    if (!bouts(st) && (coming || (!st.toured && !st.tourAsked))) return 'Somebody is calling you over';
    if (/grudge|clock|has news|loadout|Long Stair is open|New in the market/.test(s) && !/New in the market/.test(s)) return s;
    const base = s.replace(/\s*·\s*New in the market:.*$/, ''), short = base.replace(/^Blood Pit: /, '').replace(/^Next on the Ledger: /, 'fight ').replace(/^Go to the Blood Pit gate and face /, 'fight ');
    const fresh = KEYS.filter(k => open(k) && !(st.seen || {})[k] && WHAT[k] && !(st.shownPlaces || {})[WHAT[k][0]]);
    if (fresh.length) { const w = WHAT[fresh[0]]; return 'NEW · ' + w[0] + ' (' + w[2] + '): ' + w[1] + (fresh.length > 1 ? ' · and ' + (fresh.length - 1) + ' more' : '') + ' · then ' + short; }
    const tips = [];
    { const mo = st.loanM && st.loanM.owed, dov = st.loanD && st.loanD.owed; if (mo) tips.push('You owe Marc ' + Math.round(mo) + ' coin: pay it off at his table before he comes to collect', 'You owe Marc ' + Math.round(mo) + ' coin'); if (dov) tips.push('David’s loan stands at ' + Math.round(dov) + ' coin and grows every bout: pay it in his cellar', 'You owe David ' + Math.round(dov) + ' coin, growing'); }
    if (bouts(st) >= 1 && !(st.items || []).length) tips.push('Your hideout (down Tallow Row, south-west) is empty: a bed there gives bonus XP');
    if (bouts(st) >= 2 && !st.talked) tips.push('People in the market will talk: try the old miner east of the lamp');
    if (open('apoth') && (st.seen || {}).apoth && st.coin >= 60 && !(st.boons || {}).tonic && bouts(st) % 2 === 0) tips.push('You can afford a tonic before your next bout');
    if ((st.deaths || 0) >= 1 && (st.signed || st.bound) && (st.soulDebt || 0) >= 4) tips.push('You owe David ' + st.soulDebt + ' souls: he is taking a cut. Pay some down in his cellar');
    if (has(st, 'bed') && G.homeReady && G.homeReady(st)) tips.push('Things at home are ready before your next bout');
    const nr = nextRankLine(st); if (nr && (Math.floor(performance.now() / 9000) % 2)) tips.push(nr);
    return tips.length ? tips[Math.floor(performance.now() / 9000) % tips.length] + ' · then ' + short : base;
  };

  // where the marker in the market should sit: whatever the line at the top is pointing at
  let goalAt = 0, goalSp = null;
  G.goalSpot = function () { const now = performance.now(); if (now - goalAt < 600) return goalSp; goalAt = now; goalSp = null; const st = G.state; if (!st || !st.hero || G.scene !== 'hub' || coming) return null;
    const s = G.objective(), hub = W.cache.hub; if (!hub || typeof s !== 'string') return null; let re = null;
    if (/^NEW · /.test(s)) { const k = KEYS.find(q => open(q) && !(st.seen || {})[q] && WHAT[q]); re = k && UN[k].spot ? UN[k].spot : /Fence|Guildmaster/.test(s) ? /Fence/ : (k === 'trainer' ? /Guildmaster/ : /Fence/); }
    else { const head = s.split(' · then ')[0], tail = s.split(' · then ').pop();
      if (/the Fence has/.test(head)) re = /Fence/; else if (/^Your hideout/.test(head)) re = /Hideout/; else if (/old miner/.test(head)) re = /Tibb/; else if (/You owe David|clock is ticking/.test(head)) re = /Oracle/; else if (/afford a tonic/.test(head)) re = /Apothecary/;
      else if (/Tally has news|Give your Tally work/.test(tail)) re = /Low Lamp/; else if (/Marc has news/.test(tail)) re = /Marc/; else if (/loadout/.test(tail)) re = /Guildmaster/; else if (/Long Stair is open/.test(tail)) re = /Long Stair/; else re = /Blood Pit/; }
    goalSp = re ? hub.spots.find(sp => re.test(sp.label) && !(sp.isLocked && sp.isLocked())) || null : null; return goalSp; };

  // ------------------------------------------------------------ Pip shows you round
  const PIP = 'Pip Tallow', pipLook = { id: 'pip', cls: 'rogue', race: 'human', tint: { cloth: '#7a5a2a', armor: '#5a4630', armor2: '#3a2c1e', trim: '#c8a060', legs: '#3a3024', hair: '#8a5a2a' }, scale: 0.86 };
  G.LOOKDEF = G.LOOKDEF || {}; G.LOOKDEF.pip = pipLook;
  let pip = null;
  const placePip = (x, z, fx, fz) => { const hub = W.get('hub'); if (!pip) pip = G.makeChar(pipLook); if (pip.root.parent !== hub.scene) hub.scene.add(pip.root); pip.root.visible = true; pip.root.position.set(x, 0, z); pip.root.rotation.y = Math.atan2(fx - x, fz - z); pip.pose({ t: 1, act: 'idle' }); };
  const STOPS = st => { const me = st.hero.name; return [
    { npc: [12.6, 4.6], you: [14.2, 5.6], lines: [S('npc', PIP, 'Oi. Fresh meat. Keeper pays me a penny a head to walk the new ones round, so do not get lost before I collect.', 'npc'), S('you', me, 'Where do I start?', 'you'), S('npc', PIP, 'This is the Lamp Market. Everything you need is under that lamp or along these walls. The yellow line at the top of your eye tells you what is worth doing next. Read it. Most do not, and most are dead.', 'low')] },
    { npc: [6.3, 2.2], you: [4.6, 3.2], lines: [S('npc', PIP, 'The Blood Pit. You do not get a named fighter just for turning up: win your undercard bouts first and the Keeper writes you in against the next name.', 'npc'), S('npc', PIP, 'Lose in there and you are dead. Proper dead. Your purse goes with you. So do not carry what you cannot lose.', 'low'), S('npc', PIP, 'And do not just swing. They block a flurry now and hit you while you are still flapping. Hold your strike for a heavy blow, hold parry to block, sidestep the red marks.', 'npc')] },
    { npc: [16.9, 3.0], you: [15.4, 3.6], lines: [S('npc', PIP, 'The Fence. Potions, better steel, better armour. Later the Armoury, the Tailor and the Outfitter are through the back, once you have a name.', 'npc'), S('npc', PIP, 'Next door, the Guildmaster keeps your page: your three techniques, your feats, your finishers. Learn more than three moves and you choose which you carry, right there.', 'low')] },
    { npc: [0.6, 19.0], you: [2.0, 20.3], lines: [S('npc', PIP, 'Your hideout. Guild housing. Looks like nothing. But furniture in there WORKS: a bed gives you more from your next bout, a strongbox keeps coin safe when you die, a dummy sharpens your weapon hand.', 'npc'), S('npc', PIP, 'Tap the Comfort sign inside and it lists what every piece is doing for you.', 'low')] },
    { npc: [12.6, 8.0], you: [14.4, 8.6], lines: [S('npc', PIP, 'Now. See all these shut stalls? They open as you earn RESPECT. Win a bout: the Notice Board and Big Hobb. Make Scrapper: the Low Lamp and the Apothecary. Bloodied: Marc’s table, the Armoury, the Tailor. Enforcer: the Outfitter, charms, Whisper.', 'npc'), S('you', me, 'And until then?', 'you'), S('npc', PIP, 'Until then, fight, and talk to people. The old miner by the lamp, the sergeant, the deep trader. I am usually by the pit gate. That is the tour. Try not to die before Thursday.', 'low')] }
  ]; };
  function tour(i) { const st = G.state, stops = STOPS(st); if (i >= stops.length) { if (pip) pip.root.visible = false; st.toured = 1; G.save(); ui.toast('Tour over. Pip is by the pit gate if you want it again.'); return; }
    const sp = stops[i]; if (i === 0 && G.scene === 'hub') { const w = W.walker, live = pip && pip.root.visible, qx = live ? pip.root.position.x - w.x : -0.8, qz = live ? pip.root.position.z - w.z : -0.6, qd = Math.hypot(qx, qz) || 1; sp.you = [w.x, w.z]; sp.npc = [w.x + qx / qd * 2.4, w.z + qz / qd * 2.4]; } placePip(sp.npc[0], sp.npc[1], sp.you[0], sp.you[1]); G.playScene({ place: 'hub', npc: sp.npc, you: sp.you, npcH: 1.24, lines: sp.lines, done: skipped => { if (skipped) { if (pip) pip.root.visible = false; st.toured = 1; G.save(); return; } tour(i + 1); } }); }
  G.tour = () => { ui.close(); coming = null; tour(0); };
  // he sees a new face and comes straight over
  let coming = null, lastT = 0;
  const stepPip = t => { const dt = Math.min(0.1, Math.max(0, t - lastT)); lastT = t; if (!coming || !pip) return; if (G.talk || ui.isOpen() || G.scene !== 'hub' || G.dicing) return;
    const w = W.walker, dx = w.x - pip.root.position.x, dz = w.z - pip.root.position.z, d = Math.hypot(dx, dz);
    if (!coming.said) { coming.said = 1; ui.toast(coming.fetch ? '“Oi! ' + G.state.hero.name + '! Something has opened!” Pip is running over.' : '“Oi! Fresh meat! Hold up!” Somebody is running over.'); G.sfx('ui'); }
    if (d > 2.3) { const v = 4.2 * dt; pip.root.position.x += dx / d * v; pip.root.position.z += dz / d * v; pip.root.rotation.y = Math.atan2(dx, dz); coming.walk = (coming.walk || 0) + dt * 9; pip.pose({ t, act: 'idle', moving: 1, walk: coming.walk }); }
    else { const fl = coming.fetch; coming = null; if (fl) usher(fl); else tour(0); } };
  G.pipComing = () => !!coming || !!leading;
  // ------------------------------------------------------------ when something new opens, Pip comes to fetch you, walks you to it and says what it is for
  const PLACE = [
    [/Notice Board/, 'the Notice Board', 'Paper nailed over paper. Somebody always wants something done in the pit: win without a potion, finish it fast, that sort of thing.', 'Take one contract down, do it in your next bouts, come back for the coin and the respect. One at a time.'],
    [/Hobb/, 'Big Hobb’s Pot', 'Hobb sells a hot meal. Eat before a bout and you go in with more health or more wind, depending on the bowl.', 'One meal lasts one bout. Cheap, and it is the difference in a close one.'],
    [/Low Lamp/, 'the Low Lamp', 'That is where your Tally drinks: the fighters you beat and spared, who owe you now.', 'Send them on jobs for coin, or name one your Second and call them into a bout with you.'],
    [/Apothecary/, 'the Apothecary', 'Tonics. Drink one before a bout: harder skin, quicker hands, a hotter temper. They wear off after one fight.', 'Potions for mid-fight are the Fence. Tonics for before are here.'],
    [/Marc/, 'Marc’s table', 'Marc dé Fleuprau. Dice, a bet on tonight’s other bouts, and a loan if you are short. You can watch the bout you bet on.', 'He is fun and he is a crook. Borrow from him and he collects at the pit gate.'],
    [/Wisp/, 'the Wisp Table', 'Wispdice. Dice made of light, Guild-work, cannot be loaded. Marc’s back room.', 'Pure gambling. Set a stake, roll, walk away while you are ahead. Nobody does.'],
    [/Charms/, 'the charm seller', 'Charms. One worn at a time. Small edges: a bit of luck, a bit of coin, a second wind.', 'Some are cut to go with a particular kit and weapon. Wear all three and they add up.'],
    [/Whisper/, 'Whisper', 'She sells what she hears. Pay her and she tells you how your next opponent fights: what they open with, what they fear.', 'Worth it before a named bout. Not worth it for an undercard.'],
    [/Long Stair/, 'the Long Stair', 'The way up. Wardens on it, and the Crown’s tithe.', 'When you hold the crown long enough, that gate is the next thing.']];
  const placeOf = sp => PLACE.find(q => q[0].test(sp.label)), openNow = hub => hub.spots.filter(sp => sp.isLocked && !sp.isLocked() && placeOf(sp) && !/Pip/.test(sp.label));
  let leading = null;
  const seenAll = (st, list) => { st.shownPlaces = st.shownPlaces || {}; list.forEach(sp => { st.shownPlaces[placeOf(sp)[1]] = 1; }); G.save(); };
  function usher(list) { const st = G.state, sp = list[0], pl = placeOf(sp), w = W.walker, me = st.hero.name;
    const px = pip.root.position.x, pz = pip.root.position.z;
    G.playScene({ place: 'hub', npc: [px, pz], you: [w.x, w.z], npcH: 1.24, lines: [S('npc', PIP, 'There you are. ' + (list.length > 1 ? list.length + ' doors have opened for you since I last looked. ' : '') + 'You have earned your way into ' + pl[1] + '. Want showing?', 'npc')],
      choices: [{ label: 'Show me', go: () => { leading = { sp, list, t0: lastT, walk: 0 }; W.walkTo({ x: sp.x, z: sp.z }); } }, { label: 'Not now', go: () => { seenAll(st, list); if (pip) pip.root.visible = false; ui.toast('Pip is by the pit gate. Ask him about any place, any time.'); } }],
      done: () => { seenAll(st, list); if (pip) pip.root.visible = false; } }); }
  function explain(L) { const st = G.state, sp = L.sp, pl = placeOf(sp), rest = L.list.slice(1).map(q => placeOf(q)[1]), w = W.walker;
    G.playScene({ place: 'hub', npc: [pip.root.position.x, pip.root.position.z], you: [w.x, w.z], npcH: 1.24, lines: [S('npc', PIP, pl[2], 'npc'), S('npc', PIP, pl[3], 'low')].concat(rest.length ? [S('npc', PIP, 'Also open to you now: ' + rest.join(', ') + '. I am not walking you to all of them for a penny. Find me by the pit gate and ask.', 'npc')] : [S('npc', PIP, 'That is it. Forget any of that, I am by the pit gate. Ask me about any place.', 'npc')]),
      done: () => { seenAll(st, L.list); if (pip) pip.root.visible = false; } }); }
  const stepLead = t => { const dt = Math.min(0.1, Math.max(0, t - lastT)); lastT = t; const L = leading; if (!L || !pip) return; if (G.talk || ui.isOpen() || G.scene !== 'hub') return;
    const w = W.walker, tx = L.sp.x + 1.1, tz = L.sp.z + 0.5, dx = tx - pip.root.position.x, dz = tz - pip.root.position.z, d = Math.hypot(dx, dz), near = Math.hypot(w.x - L.sp.x, w.z - L.sp.z) < 2.6; L.age = (L.age || 0) + dt;
    if (d > 0.4) { const ahead = Math.hypot(pip.root.position.x - w.x, pip.root.position.z - w.z), v = (ahead > 5 ? 1.5 : 4.6) * dt; pip.root.position.x += dx / d * v; pip.root.position.z += dz / d * v; pip.root.rotation.y = Math.atan2(dx, dz); L.walk += dt * 9; pip.pose({ t, act: 'idle', moving: 1, walk: L.walk }); }
    else { pip.root.rotation.y = Math.atan2(w.x - pip.root.position.x, w.z - pip.root.position.z); pip.pose({ t, act: near ? 'idle' : 'cheer', prog: (t * 0.8) % 1 }); }
    if (near && d <= 0.4) { leading = null; explain(L); }
    else if (L.age > 40) { leading = null; seenAll(G.state, L.list); pip.root.visible = false; ui.toast('Pip gives up waiting. He is by the pit gate if you want to ask.'); } };
  ui.pipPlaces = function (k) { const hub = W.get('hub'), open = openNow(hub).concat(hub.spots.filter(sp => !sp.isLocked && placeOf(sp))), pl = k != null ? placeOf(open[k]) : null;
    show('<div class="card small"><h2>' + PIP + '</h2><div class="mk-top"><span id="fp"></span><div><p class="dim">Ask about a place</p><p class="quote">“' + (pl ? pl[2] + ' ' + pl[3] : open.length ? 'Which one? I know them all. I have been thrown out of most.' : 'Nothing has opened for you yet. Win a bout.') + '”</p></div></div><div class="choices">' + open.map((sp, i) => '<button data-p="' + i + '"' + (i === k ? ' class="sel"' : '') + '><b>' + sp.label + '</b></button>').join('') + '</div><div class="row end"><button id="bk">Back</button><button class="big" id="x">Leave him be</button></div></div>');
    const el = document.getElementById('fp'); if (el) el.appendChild(G.portrait(pipLook, 92)); on('#x', () => { ui.close(); ui.topbar(); }); on('#bk', () => ui.talkTo('pip')); on('[data-p]', b => { G.sfx('page'); ui.pipPlaces(+b.dataset.p); }); };
  const hub0 = ui.hub;
  ui.hub = function (first) { const r = hub0.apply(this, arguments), st = G.state; if (!st || !st.hero) return r;
    if (!st.casterKit && !bouts(st) && (st.hero.cls === 'sorcerer' || st.hero.cls === 'warlock')) { st.casterKit = 1; st.potions = Math.max(st.potions || 0, 2); G.save(); }      // casters start with a second potion: their first bouts are the hardest
    { const hub = W.get('hub'), open = openNow(hub); if (!st.shownPlaces) { st.shownPlaces = {}; if (bouts(st) > 1) open.forEach(sp => { st.shownPlaces[placeOf(sp)[1]] = 1; }); }
      const fresh = open.filter(sp => !st.shownPlaces[placeOf(sp)[1]]); if (fresh.length && st.toured && !coming && !leading && !G.talk && G.scene === 'hub') { const w = W.walker; placePip(Math.max(1.5, w.x - 7), Math.max(3, w.z + 3.5), w.x, w.z); coming = { said: 0, t0: 0, fetch: fresh }; } }
    if (!st.tourAsked && !bouts(st) && !(st.deaths > 0)) { st.tourAsked = 1; G.save(); const w = W.walker; placePip(Math.max(1.5, w.x - 7), Math.max(3, w.z + 3.5), w.x, w.z); coming = { said: 0, t0: 0 }; }
    return r; };

  // ------------------------------------------------------------ the market calls out to you: whoever has something new says so
  const HAWK = [[/Fence/, ['Oi! New steel in. Over here!', 'You! Yes, you. Come and look at this.']], [/Guildmaster/, ['A word. You have something to choose.', 'Your page wants attention. Come here.']], [/Apothecary/, ['Tonics! Fresh today!', 'You look pale. I have something for that.']], [/Hobb/, ['Hot bowl! You look thin!', 'Eat before you fight, fool! Over here!']], [/Marc/, ['Bro. BRO. Over here.', 'Psst! Good odds tonight. For you, special.']], [/Low Lamp/, ['Your people are asking for you!', 'Oi, boss! News from the jobs!']], [/Whisper/, ['Psst. I heard something about your next one.', 'A rumour. Cheap. Come closer.']], [/Charms/, ['Something new on the cloth!', 'Lucky face, you have. Come and prove it.']], [/Notice Board/, ['(a fresh sheet has been nailed up)']], [/Knuckle/, ['Fancy your arm? Sit down!']], [/Blood Pit/, ['The gate is open! Who is next?']]];
  let hawkT = 9, hawkLast = '';
  setInterval(() => { const st = G.state; if (!st || !st.hero || G.scene !== 'hub' || ui.isOpen() || G.talk || coming || leading || G.placing || G.dicing) return; hawkT -= 1; if (hawkT > 0) return;
    const hub = W.get('hub'), w = W.walker, want = hub.spots.filter(sp => !(sp.isLocked && sp.isLocked()) && HAWK.some(h => h[0].test(sp.label)) && sp.label !== hawkLast && Math.hypot(sp.x - w.x, sp.z - w.z) > 3 && Math.hypot(sp.x - w.x, sp.z - w.z) < 22);
    const hot = want.filter(sp => { try { return sp.badge && sp.badge(); } catch (e) { return false; } }), pool = hot.length ? hot : (Math.random() < 0.35 ? want.filter(sp => /Hobb|Apothecary|Marc|Knuckle|Fence/.test(sp.label)) : []);
    if (!pool.length) { hawkT = 6; return; } const sp = pool[Math.floor(Math.random() * pool.length)], ln = HAWK.find(h => h[0].test(sp.label))[1]; hawkLast = sp.label; hawkT = hot.length ? 14 + Math.random() * 8 : 24 + Math.random() * 14;
    G.gfx.floatText(sp.x, (sp.y || 2.6) + 0.5, sp.z - 0.6, '“' + ln[Math.floor(Math.random() * ln.length)] + '”', hot.length ? '#ffe9a0' : '#d8d0c0', false); }, 1000);

  // ------------------------------------------------------------ what your home is doing for you
  const READY = [['bed', 'Sleep'], ['dummy', 'Train'], ['stove', 'Cook'], ['cauldron', 'Ladle a potion', 2]];
  const used = (st, id, every) => { const u = (st.homeUsed || {})[id]; return !(u == null || bouts(st) - u >= (every || 1)); };
  G.homeReady = st => READY.some(q => has(st, q[0]) && !used(st, q[0], q[2]) && !(q[0] === 'cauldron' && st.potions >= G.POTION_MAX));
  ui.homePerks = function () {
    const st = G.state, own = {}; (st.items || []).forEach(p => own[p.id] = 1); const mine = Object.keys(own).map(id => G.DECOR_BY[id]).filter(d => d && d.perk && !/^Something|^For getting|^Eerin/.test(d.perk));
    const want = ['bed', 'strongbox', 'dummy', 'bookshelf', 'stove', 'desk', 'cauldron', 'trophies', 'maptable'].filter(id => !own[id] && G.DECOR_BY[id]).slice(0, 4).map(id => G.DECOR_BY[id]);
    show('<div class="card small"><h2>What your home does</h2><p class="dim">Furniture is not only for looking at. Each working piece is listed here. Pieces marked <b>once between bouts</b> are used by walking up to them.</p>' +
      (mine.length ? mine.map(d => { const q = READY.find(x => x[0] === d.id); return '<div class="ab-row' + (q && !used(st, d.id, q[2]) ? ' deeddone' : '') + '"><div class="ab-ic pas">⌂</div><div class="ab-tx"><b>' + d.name + '</b>' + (q ? '<small>' + (used(st, d.id, q[2]) ? 'used: ready again after your next bout' : 'ready: walk up and ' + q[1].toLowerCase()) + '</small>' : '<small>always on</small>') + '<p>' + d.perk + '</p></div></div>'; }).join('') : '<p class="note">Nothing here is working for you yet.</p>') +
      (want.length ? '<h3>Worth buying</h3>' + want.map(d => '<div class="ab-row lockedrow"><div class="ab-ic pas">+</div><div class="ab-tx"><b>' + d.name + '</b><small>' + d.cost + ' coin' + (rank(st) < (d.rank || 0) ? ' · needs ' + G.RANKS[d.rank].name : '') + '</small><p>' + d.perk + '</p></div></div>').join('') : '') +
      '<div class="row end"><button id="cat">Open the catalogue</button><button class="big" id="x">Done</button></div></div>');
    on('#x', () => ui.close()); on('#cat', () => { ui.close(); ui.catalog(); });
  };
  const rc = document.getElementById('roomchip'); if (rc) { rc.style.pointerEvents = 'auto'; rc.style.cursor = 'pointer'; rc.title = 'What your home does'; rc.addEventListener('click', () => { if (G.scene === 'hideout' && !ui.isOpen() && !G.placing) { G.sfx('ui'); ui.homePerks(); } }); }
  const hide0 = ui.hideout;
  ui.hideout = function () { const r = hide0.apply(this, arguments), st = G.state; if (st && st.hero && !st.homeShown && (st.items || []).length >= 1) { st.homeShown = 1; G.save(); setTimeout(() => { if (G.scene === 'hideout' && !ui.isOpen() && !G.placing) ui.homePerks(); }, 1200); } return r; };

  // ------------------------------------------------------------ people to talk to
  const rn = () => (G.RACES[G.state.hero.race] || {}).name.toLowerCase(), cn = () => (G.CLASSES[G.state.hero.cls] || {}).name.toLowerCase();
  const FOLK = {
    tibb: { name: 'Old Marrow Tibb', sub: 'forty years a miner', look: { id: 'tibb', cls: 'cleric', race: 'dwarf', tint: { cloth: '#5a4a3a', armor: '#4a4038', armor2: '#2e2822', trim: '#8a7a5a', hair: '#c8c0b0' } }, at: [20.6, 8.0],
      hi: () => ({ dwarf: '“Old Seam? I can hear it in your boots. Sit, cousin.”', drow: '“Deep folk. Hm. We broke into one of your halls in ’forty. Nobody talks about what we found.”', druid: '“You have the wet galleries on you. Good. Somebody should still go down there.”' })[G.state.hero.race] || ({ druid: '“You have the wet galleries on you. Good. Somebody should still go down there.”' })[G.state.hero.cls] || '“Sit down, sit down. Nobody under sixty ever sits down.”',
      topics: [['The mine', 'It was the richest seam in the realm, and Highmarch was built with it. Then the ore ran thin, the lifts stopped, and the people who owned it walked up the stair and sealed it behind them. Nobody told us to leave. Nobody told us anything.'], ['The Deep Guild', 'They were our lending-house. Miners paying into a pot for the lean weeks. When the owners went, the pot was the only money left below the stair. So the pot became the law. Funny thing, a pot.'], ['The nine levels', 'Landing, Market, Rookeries, Old Seam, Ember Rows, the Flooded Gallery, the Wet Galleries, the Counting Vaults, and the bottom. I have worked seven of them. The eighth you need a debt to enter. The ninth you need a reason.'],
        ['The First Lamp', 'I was there when they lit it. Well. I was nine. I held the ladder. It has not gone out since, and the oil has not got cheaper either.']] },
    carr: { name: 'Sergeant Ysolde Carr', sub: 'used to wear the white', look: { id: 'carr', cls: 'fighter', race: 'human', tint: { armor: '#8a8a94', armor2: '#5a5a66', cloth: '#4a4a56', trim: '#a89868', legs: '#44464e', hair: '#5a3a2a' } }, at: [6.4, 6.6],
      hi: () => ({ fighter: '“You carry that like you were drilled. Lower garrison? Thought so. They left you too.”', rogue: '“Hands. Where I can see them. Old habit. Yours and mine both.”', warlock: '“There was a standing order about your sort. I never liked it. I never questioned it either.”' })[G.state.hero.cls] || ({ elf: '“An elf below the stair. I will not ask. I was a Warden; I know better than to ask.”', drow: '“The orders about your people were forty years old when I learned them. Never thought I would meet one.”' })[G.state.hero.race] || '“You want something, or are you just standing in my light?”',
      topics: [['The Seal-Wardens', 'White plate, gold trim, two to a post. We answer to the gauntlet seal. One rule going down, one coming up: nobody passes. I held the Landing eleven years and never once drew steel. That is the job done right.'], ['Why she left', 'A woman came to the gate with a sick child and the wrong papers. Orders said no. I said no. I heard about the child later. Next morning I walked down the stair instead of up it. They do not come looking. Deserters below the Landing are not their problem.'],
        ['The King', 'Vilhelm van Koheneim IV. He inspected us twice a year. Never raised his voice. Never needed to. He fights like he is doing sums. If you ever stand across from him, do not wait for a mistake.'], ['The Queen', 'I saw her once, at a distance, at a window. She did not move for an hour. Faerie blood. They say she hears every word spoken in the realm. I have been careful what I say for twenty years, just in case.'], ['Fighting', 'Free advice. Stop swinging when they raise a guard: go heavy, or go round. Block more than you parry until you know their timing. And when the crowd is roaring, that is when you are most likely to do something stupid.']] },
    ilva: { name: 'Ilvaren of the Hanging Markets', sub: 'a trader from below', look: { id: 'ilva', cls: 'rogue', race: 'drow', tint: { cloth: '#2a2a44', armor: '#22222e', armor2: '#14141c', trim: '#8a8aff', legs: '#1a1a24' } }, at: [30.4, 14.2],
      hi: () => ({ drow: '“Vael’shen. You are a long way up, deep-kin. Whose house? No. Do not answer. That is how it starts.”', elf: '“A sun-cousin. Your people sent mine below. I do not hold it against you personally. I hold it against you generally.”', tiefling: '“Ember-blood. We trade with the Rows. You pay your debts, which is more than I can say for most up here.”' })[G.state.hero.race] || '“You may look. Touching is a transaction.”',
      topics: [['Below the ninth', 'Your Guild thinks it found the bottom. Under its ninth level there are three cities, and under those, the places we do not build. Vael Ushar has more people in it than Highmarch. We simply do not light it for visitors.'], ['The drow and the Guild', 'We traded with the first miners. Glass for iron. Then they dug into the wrong hall, and after that we sealed our gates. The Guild bought our old ledgers. They cannot read them. I have seen them try.'],
        ['The pit', 'We have pits. Ours are quieter. Nobody cheers. You fight until one of you is not interesting any more. I come up for yours when I am homesick for noise.'], ['What answers from below', 'The warlocks think they found something. They found two of the small ones. There are others, further down, that do not bargain, because there is nothing they want. Be glad of the ones that want things.'], ['The Oracle', 'The clock-wizard? We know him. He tried to buy a city once. We said no. He is still down there under your market, counting. Do not owe him. If you already owe him, pay it quickly, and in his own gold.']] },
    pip: { name: PIP, sub: 'Guild runner, penny a head', look: pipLook, at: [8.2, 3.8],
      hi: () => '“Still alive, then. Good. That is my reputation, that is.”',
      topics: [['How things open', () => { const st = G.state, nr = nextRankLine(st); return 'It is all respect. Win a bout: the Notice Board and Big Hobb. Scrapper: the Low Lamp, the Apothecary, Marc and his dice room. Bloodied: the Tailor. Enforcer: the Outfitter, charms, Whisper. Underboss: the Crown’s tithe at the Stair.' + (nr ? ' For you, next: ' + nr + '.' : ' You have the lot open, far as I know.'); }],
        ['Getting ready for a bout', 'Tonic from the Apothecary, a meal from Hobb or your own stove, a song off the busker, a word with Whisper, a night in your own bed. The card before the bout shows what you have and what you skipped. None of it is needed. All of it adds up.'], ['Dying', 'You lose in the pit, you are dead. Purse gone. Unless you have a strongbox at home: what is in the box stays in the box. And they say some come back. I have seen one or two walking about who should not be. I do not ask.'],
        ['Your home', 'Furniture works. Bed, dummy, stove, cauldron: use them once between bouts. Desk, map table, trophies, shrine: they work just by standing there. Tap the Comfort sign in your hideout and it lists the lot.'], ['Ask about a place', '__places'], ['Show me round again', '__tour']] }
  };
  G.FOLK = FOLK;
  ui.talkTo = function (id, topic) {
    const st = G.state, f = FOLK[id]; if (!f) return; st.talked = (st.talked || 0) + (topic == null ? 1 : 0); if (topic == null) G.save();
    const t = topic != null ? f.topics[topic] : null; if (t && t[1] === '__tour') return G.tour(); if (t && t[1] === '__places') return ui.pipPlaces();
    const body = t ? (typeof t[1] === 'function' ? t[1]() : t[1]) : null;
    show('<div class="card small"><h2>' + f.name + '</h2><div class="mk-top"><span id="fp"></span><div><p class="dim">' + f.sub + '</p><p class="quote">' + (body ? '“' + body + '”' : f.hi()) + '</p></div></div><div class="choices">' + f.topics.map((q, i) => '<button data-t="' + i + '"' + (i === topic ? ' class="sel"' : '') + '><b>' + q[0] + '</b></button>').join('') + '</div><div class="row end"><button class="big" id="x">Leave them be</button></div></div>');
    const el = document.getElementById('fp'); if (el) el.appendChild(G.portrait(f.look, 92)); on('#x', () => { ui.close(); ui.topbar(); }); on('[data-t]', el2 => { G.sfx('page'); ui.talkTo(id, +el2.dataset.t); });
  };
  const bh0 = W.buildHub;
  let pipFolk = null;
  W.buildHub = function () { const h = bh0.apply(this, arguments), folk = [];
    Object.keys(FOLK).forEach(id => { const f = FOLK[id]; let x = f.at[0], z = f.at[1]; for (let k = 0; k < 12 && h.blocked(x, z); k++) { x += 0.5; z += k % 2 ? 0.4 : -0.3; } const c = G.makeChar(f.look); c.root.position.set(x, 0, z); c.root.rotation.y = Math.atan2(14 - x, 9 - z); h.scene.add(c.root); folk.push(c);
      const sp = { x, z: z + 0.9, r: 1.3, y: 2.6, label: f.name.split(' of ')[0], act: 'Talk', go: () => ui.talkTo(id) }; if (id === 'pip') { pipFolk = c; sp.isLocked = () => !G.state.toured || !!(pip && pip.root.visible); } h.spots.push(sp); });
    const up0 = h.update; h.update = function (t) { up0.apply(this, arguments); folk.forEach((c, i) => c.pose({ t: t + i * 1.7, act: 'idle' })); if (pipFolk) pipFolk.root.visible = !!G.state.toured && !(pip && pip.root.visible); if (coming) stepPip(t); else if (leading) stepLead(t); else if (pip && pip.root.visible) pip.pose({ t, act: 'idle' }); };
    pip = null; return h; };

  // ------------------------------------------------------------ and David, who will talk for as long as you will listen
  const DT = st => [
    ['His family', 'The Roseinbeirgs. Four hundred years of the best clock-work in two kingdoms, and not one of the bastards has written to me since the expulsion. I am building them a homeland out of spite. They will have to thank me in person. On their knees. I have had the floor measured.'],
    ['The Queen', 'Eerin Koheneim. Faerie-born. Wings. Sits in a white room listening to the whole realm breathe. She signed the paper that threw me out without looking up. I want her to look up. Once. At me, in her chair. Then I do not much mind what happens to her.'],
    ['The King', 'Vilhelm. A glove with a man in it. He is the only one of them worth a damn in a fight, which is why you are going to do it and not me. I am a genius, pet, not an idiot.'],
    ['The others below', 'The Guild? Bookkeepers. I respect a ledger, but they think small. That gambler, Marc? I like him. He would sell you for a good hand and tell you so. The dwarves, the drow, the Chapel: cattle, in different pens.'],
    ['What I am to him', st.usurper ? 'You sat down. I did not think you had it in you. ' + (st.usurper === 'vessel' ? 'And you still owe me. Good dog.' : 'And you owe me NOTHING. Do you know how that feels? It feels like indigestion.') : (st.soulDebt || 0) > 0 ? 'You are ' + st.soulDebt + ' souls in my book, a pair of hands, and the arse I intend to put on a throne. Do not mistake that for affection. It is investment. I am very attached to my investments.' : 'Paid up. Hm. I liked you better in arrears. A creature that owes nothing has ideas.'],
    ['Why he keeps bringing you back', 'Because I can, and nobody else in this realm can, and every time I do it the clocks upstairs lose a second. One day the Queen will notice her mornings are short. I want to be there for that.'],
    ['The golden room', 'Every piece of it is somebody’s. That pile is a duke. That chest was a monastery. The throne I had made early. I sit in it when you are not here. Do NOT tell anyone.']
  ];
  ui.davidTalk = function (i) { const st = G.state, T2 = DT(st), t = i != null ? T2[i] : null, O = G.oracle; if (!O) return;
    show('<div class="card small"><h2>David Roseinbeirg</h2><div class="mk-top"><span id="dp"></span><div><p class="quote">“' + (t ? t[1] : pick(['Talk? I ADORE talking. Chiefly about me. Go on.', 'Ask. I may even tell you the truth. It costs me nothing; nobody would believe you.'])) + '”</p></div></div><div class="choices">' + T2.map((q, k) => '<button data-t="' + k + '"' + (k === i ? ' class="sel"' : '') + '><b>' + q[0] + '</b></button>').join('') + '</div><div class="row end"><button class="big" id="x">Back</button></div></div>');
    const el = document.getElementById('dp'); if (el) el.appendChild(G.portrait(O.look(), 92)); on('#x', () => ui.oracle()); on('[data-t]', el2 => { G.sfx('page'); ui.davidTalk(+el2.dataset.t); });
    const p = document.getElementById('panel'); if (G.scene === 'hub') p.classList.add('cellar');
  };
  const or0 = ui.oracle;
  if (or0) ui.oracle = function () { const r = or0.apply(this, arguments), card = document.querySelector('#panel .card'), end = card && card.querySelector('.row.end'); if (!end || !/Oracle’s Cellar/.test((card.querySelector('h2') || {}).textContent || '')) return r;
    const b = document.createElement('button'); b.textContent = 'Talk to him'; b.onclick = () => { G.sfx('ui'); ui.davidTalk(); }; end.insertBefore(b, end.firstChild); return r; };

  // ------------------------------------------------------------ names under the buttons, for keys and pad (the phone layout is left alone)
  const bh = ui.buildHud;
  ui.buildHud = function (P, E) { const r = bh.apply(this, arguments); if (G.input.touch) return r; const A = G.ABILITIES, bar = document.getElementById('abar'); if (!bar) return r;
    const NAME = { dodge: 'Dodge', parry: 'Parry · hold: Block', potion: 'Potion', assist: 'Second' };
    bar.querySelectorAll('.ab').forEach(b => { const a = b.dataset.act; let n = NAME[a]; if (/^a\d$/.test(a)) { const ab = A[P.kit[+a[1]]]; n = ab && ab.name; } else if (a === 'ult') n = A[P.ult] && A[P.ult].name; if (n && !b.querySelector('.abn')) { const s = document.createElement('span'); s.className = 'abn'; s.textContent = n; b.appendChild(s); } });
    bar.classList.add('named'); let lg = document.getElementById('ablegend'); if (!lg) { lg = document.createElement('div'); lg.id = 'ablegend'; bar.parentNode.insertBefore(lg, bar); } legend(); return r; };
  const legend = () => { const lg = document.getElementById('ablegend'); if (!lg) return; const pad = G.input.usingPad; lg.innerHTML = pad ? '<kbd>X</kbd>/<kbd>RT</kbd> strike · hold for a heavy blow &nbsp; <kbd>▼</kbd> taunt &nbsp; <kbd>R-stick</kbd> aim' : '<kbd>Click</kbd> strike · hold for a heavy blow &nbsp; <kbd>G</kbd> taunt &nbsp; <kbd>Mouse</kbd> aim'; lg.className = G.input.touch ? 'hidden' : ''; };
  const rk0 = ui.refreshKeys; ui.refreshKeys = function () { const r = rk0.apply(this, arguments); legend(); return r; };
  // ------------------------------------------------------------ first steps: a lit path from the first stall to the pit gate
  const FP = [
    { re: /^The Fence/, name: 'the Fence', say: 'Steel, potions, armour: that is me. Now the Guildmaster, next door. He keeps your page.' },
    { re: /^Guildmaster/, name: 'the Guildmaster', say: 'Your page is written. Only one place to go from here: the pit gate. Follow the light.' },
    { re: /^The Blood Pit/, name: 'the pit gate', say: null }];
  const fpOn = st => st && st.hero && st.firstPath !== 9 && !bouts(st) && !(st.deaths > 0) && (st.toured || st.tourAsked);
  let beam = null;
  const mkBeam = sc => { const T3 = THREE, c = document.createElement('canvas'); c.width = 4; c.height = 128; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, 'rgba(255,214,140,0)'); g.addColorStop(0.55, 'rgba(255,214,140,0.28)'); g.addColorStop(1, 'rgba(255,230,170,0.75)'); x.fillStyle = g; x.fillRect(0, 0, 4, 128);
    const tex = new T3.CanvasTexture(c), grp = new T3.Group(), col = new T3.Mesh(new T3.CylinderGeometry(0.75, 0.95, 8, 18, 1, true), new T3.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: T3.AdditiveBlending, side: T3.DoubleSide }));
    col.position.y = 4; grp.add(col); const ring = new T3.Mesh(new T3.RingGeometry(0.85, 1.15, 32), new T3.MeshBasicMaterial({ color: 0xffd890, transparent: true, opacity: 0.7, depthWrite: false, blending: T3.AdditiveBlending })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.06; grp.add(ring);
    grp.visible = false; sc.add(grp); return { grp, col, ring, L: null, sc }; };       // the light is added once, only for a fighter who is on the path, and never toggled: a light that comes and goes rebuilds every material in the market
  const bh1 = W.buildHub;
  W.buildHub = function () { const h = bh1.apply(this, arguments); beam = mkBeam(h.scene);
    const up1 = h.update; h.update = function (t) { up1.apply(this, arguments); const st = G.state, on = fpOn(st) && G.scene === 'hub' && !coming && !leading;
      if (!on) { beam.grp.visible = false; if (beam.L) beam.L.intensity = 0; return; }
      if (!beam.L) { beam.L = new THREE.PointLight(0xffd08a, 0, 10, 1.3); beam.sc.add(beam.L); }
      const k = st.firstPath || 0, sp = h.spots.find(q => FP[k].re.test(q.label)); if (!sp) return;
      if (ui.isOpen() && st.fpSeen !== k) { const w = W.walker; if (Math.hypot(w.x - sp.x, w.z - sp.z) < (sp.r || 1.3) + 1.6) st.fpSeen = k; }
      beam.grp.visible = !G.talk; beam.grp.position.set(sp.x, 0, sp.z); beam.L.position.set(sp.x, 3, sp.z); const pu = 0.5 + 0.5 * Math.sin(t * 2.4); beam.L.intensity = G.talk ? 0 : 22 + pu * 10; beam.col.material.opacity = 0.75 + pu * 0.25; beam.ring.scale.setScalar(1 + pu * 0.15);
      if (st.fpSeen === k && !ui.isOpen() && !G.talk) { st.fpSeen = null; if (FP[k].say) { G.gfx.floatText(sp.x, (sp.y || 2.6) + 0.6, sp.z - 0.4, '“' + FP[k].say + '”', '#ffe9a0', false); ui.toast(FP[k].say); G.sfx('page'); } st.firstPath = Math.min(FP.length - 1, k + 1); G.save(); } };
    return h; };
  const ob1 = G.objective;
  G.objective = function () { const s0 = ob1.apply(this, arguments), st = G.state; if (G.scene !== 'hub' || !fpOn(st) || coming || leading) return s0; const k = st.firstPath || 0; return 'First steps · follow the light to ' + FP[k].name + (k < FP.length - 1 ? ', then the pit' : ': your first bout'); };
  const fs0 = G.fight.start;
  G.fight.start = function (o) { const st = G.state; if (st && st.firstPath !== 9 && !(o && o.spar) && !G.fight.ex) { st.firstPath = 9; } return fs0.apply(this, arguments); };
})();
