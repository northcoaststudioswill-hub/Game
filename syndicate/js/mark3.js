// Guttercrown — Mark's back room: chits (house credit), his schemes, the Wisp Table (dice made of light) and the chit rack
(function () {
  const G = window.G, ui = G.ui, mk = G.mark, pick = a => a[Math.floor(Math.random() * a.length)];
  const show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), $ = id => document.getElementById(id);
  const d6 = () => 1 + Math.floor(Math.random() * 6);
  const timers = []; const later = (fn, ms) => timers.push(setTimeout(fn, ms)); const clearT = () => { timers.forEach(clearTimeout); timers.length = 0; };
  const leave = () => { clearT(); ui.close(); ui.topbar(); };

  // ------------------------------------------------------------ chits: Mark's own credit, good at his tables and nowhere else
  mk.chits = () => G.state.chits || 0;
  mk.funds = () => G.state.coin + mk.chits();
  mk.take = v => { const st = G.state, c = Math.min(mk.chits(), v); st.chits = mk.chits() - c; st.coin -= v - c; };
  const purse = () => 'You have <b>' + G.state.coin + '</b> coin' + (mk.chits() ? ' and <b class="chit">' + mk.chits() + '</b> chits' : '') + '.';
  mk.purse = purse;
  const head = (line) => '<div class="mk-top"><span id="mkp"></span><div><p class="quote">“' + line + '”</p><p class="dim">' + purse() + '</p></div></div>';
  const port = () => { const el = $('mkp'); if (el) el.appendChild(G.portrait(mk.look, 92)); };
  const stakes = () => [10, 25, 50, 100, 250].filter(v => v <= mk.funds());
  const stakeRow = () => '<div class="row">' + stakes().map(v => '<button class="big" data-s="' + v + '">Stake ' + v + '</button>').join('') + '</div>';

  // ------------------------------------------------------------ schemes: Mark always has one going
  const SCHEMES = [
    { id: 'glowcap', name: 'Glowcap Futures', pitch: 'A guy I know grows glowcaps in a flooded working. Harvest is soon. We buy now, we sell when the Low Lamp runs dry. It always runs dry.', win: 'The Low Lamp ran dry. I told you it runs dry.', lose: 'So the working flooded more. A lot more. The glowcaps are fine, they are just under a lake.' },
    { id: 'cart', name: 'A Cart That Has Not Fallen Yet', pitch: 'There is a Highmarch cart coming down the long stair. Things fall off those carts, bro. We are paying a man to stand near it.', win: 'It fell. All of it. The man barely had to lean.', lose: 'The cart did not fall. The man fell. He wants paying anyway.' },
    { id: 'rats', name: 'Racing Stock', pitch: 'Mistake has a nephew. Fast. Mean. Unbelievable legs on this rat. I need stake money to enter him on the upper level.', win: 'Mistake’s nephew won by a length. Three lengths. He bit a judge.', lose: 'He ran the wrong way. It runs in the family. Great legs, though.' },
    { id: 'oil', name: 'Lamp Oil, Slightly Improved', pitch: 'Lamp oil. We buy ten barrels, we add a little water, now we have twelve barrels. That is not a crime, that is arithmetic.', win: 'Sold all twelve. Nobody noticed. One guy said it burned cleaner.', lose: 'They noticed, bro. The Lampwrights noticed. I have had to be somewhere else all week.' },
    { id: 'debt', name: 'A Line in the Ledger', pitch: 'I can buy a slice of another fighter’s debt. When they win, the Guild pays us first. This is how the rich do it, bro. I asked one.', win: 'Our fighter won. The Guild paid out like it hurt them. Beautiful.', lose: 'Our fighter met Brakk. There is not really a debt any more. Or a fighter.' },
    { id: 'seal', name: 'Commemorative Seals', pitch: 'Guild seals. Not real ones. COMMEMORATIVE ones. They just happen to look exactly the same. Collectors go mad for this stuff.', win: 'Sold out in a morning. Collectors, bro. So many collectors.', lose: 'The Ledger-Keeper bought one. Looked at it for a long time. I ate the rest. Do not ask.' },
    { id: 'relic', name: 'The Saint’s Finger', pitch: 'I have a finger. A saint’s. Probably. The Dawn Chapel pays big for relics, I just need coin to get it blessed first.', win: 'The Chapel took it. They cried, bro. One of them hugged me.', lose: 'Turns out the saint still has all ten. He came to check. Awkward.' },
    { id: 'pit', name: 'Sand for the Pit', pitch: 'The Blood Pit goes through sand like you would not believe. Somebody has to sell it to them. Why not two handsome investors?', win: 'They took the lot and ordered more. Blood, bro. It is a growth business.', lose: 'They found a cheaper guy. He just scrapes the old sand and brings it back round. Genius. I hate him.' }
  ];
  const SBY = {}; SCHEMES.forEach(s => SBY[s.id] = s);
  mk.offer = () => { const st = G.state; if (!st.offer || !SBY[st.offer]) st.offer = pick(SCHEMES).id; return SBY[st.offer]; };
  // tick once per real bout: called through mark.resolve
  const resolve0 = mk.resolve;
  mk.resolve = function (win) {
    const st = G.state, r = resolve0.apply(this, arguments);
    if (st.scheme && --st.scheme.left <= 0) {
      const s = st.scheme, x = Math.random(), out = { id: s.id, stake: s.stake, coin: 0, chits: 0 };
      if (x < 0.42) out.coin = Math.round(s.stake * (1.5 + Math.random() * 0.8));
      else if (x < 0.54) { out.coin = Math.round(s.stake * 1.1); out.chits = Math.round(s.stake * 0.3); }
      else out.chits = Math.round(s.stake * (0.6 + Math.random() * 0.4));
      st.schemeDone = out; st.scheme = null;
    }
    const prev = st.offer; for (let i = 0; i < 4 && st.offer === prev; i++) st.offer = pick(SCHEMES).id;
    return r;
  };
  ui.schemeNews = function () {
    const st = G.state, o = st.schemeDone, s = SBY[o.id] || SCHEMES[0]; st.schemeDone = null;
    st.coin += o.coin; st.chits = mk.chits() + o.chits; G.save(); G.sfx(o.coin > o.stake ? 'coin' : 'deny'); ui.topbar();
    const good = o.coin > o.stake;
    const line = good ? s.win + ' Here is your end, bro.' : s.lose + (o.coin ? ' I got most of your stake back out. And have some chits, for the stress.' : ' Look. Your coin is gone. But I am a man of honour, so here: chits. Good as coin. At my tables. Only at my tables.');
    show('<div class="card small"><h2>' + s.name + '</h2>' + head(line) + '<p class="dim">You put in ' + o.stake + ' coin.</p><p class="rankup">' + [o.coin ? '+' + o.coin + ' coin' : '', o.chits ? '+' + o.chits + ' chits' : ''].filter(Boolean).join(' · ') + '</p>' +
      (o.chits ? '<p class="dim">Chits are Mark’s own credit. They are spent before coin at any of his games, and his rack takes nothing else.</p>' : '') + '<div class="row end"><button class="big" id="x">' + (good ? 'Pleasure doing business' : 'Of course it did') + '</button></div></div>');
    port(); on('#x', () => ui.mark());
  };
  ui.scheme = function () {
    const st = G.state, s = mk.offer();
    if (st.scheme) { const cur = SBY[st.scheme.id]; show('<div class="card small"><h2>' + cur.name + '</h2>' + head('It is cooking, bro. You cannot rush a scheme. Go hit somebody, come back.') + '<p>You have <b>' + st.scheme.stake + '</b> coin in this. News after <b>' + st.scheme.left + '</b> more bout' + (st.scheme.left === 1 ? '' : 's') + '.</p><div class="row end"><button class="big" id="b">Back</button></div></div>'); port(); on('#b', () => ui.mark()); return; }
    const opts = [25, 50, 100, 250, 500].filter(v => v <= st.coin);
    show('<div class="card small"><h2>Mark’s Scheme</h2>' + head(s.pitch) + '<h3>' + s.name + '</h3><p class="dim">Buy in with coin. Mark comes back with news after a bout or two. Sometimes it pays. Sometimes he pays you in chits and changes the subject.</p>' +
      (opts.length ? '<div class="row">' + opts.map(v => '<button class="big" data-in="' + v + '">Buy in ' + v + '</button>').join('') + '</div>' : '<p class="dim">You need at least 25 coin to buy in. Chits do not count: Mark will not take his own paper.</p>') + '<div class="row end"><button id="b">Not this one</button></div></div>');
    port(); on('#b', () => ui.mark());
    on('[data-in]', el => { const v = +el.dataset.in; if (st.coin < v) return; st.coin -= v; st.scheme = { id: s.id, stake: v, left: 1 + Math.floor(Math.random() * 2) }; G.save(); G.sfx('place'); ui.topbar(); ui.mark(pick(['That is my guy! You will not regret this. Probably. Statistically.', 'Smart money, bro. SMART money. I am writing your name on the back of my hand.', 'Partners. I love that for us.'])); });
  };

  // ------------------------------------------------------------ the menu
  ui.mark = function (line) {
    clearT(); const st = G.state;
    if (st.schemeDone) return ui.schemeNews();
    const s = mk.offer(), greet = line || pick(Math.random() < 0.3 ? ['Hang on. …What were we doing? Right. Money.', 'Is the ceiling lower today? No? Cool. Cool cool cool.', 'I am fine. I am extremely fine. Pick a game.'] : ['Bro. BRO. You look like someone who is about to be rich. Probably.', 'Step up, step up. I have got a guy for everything, bro. The guy is me.', 'Real ones bet big. I am just saying what real ones do, bro.', 'You want odds? I have got odds on the odds.', 'I have a scheme, bro. Sit down. No, stand. It is a standing scheme.']);
    const g = (id, name, sub, cls) => '<button id="' + id + '"' + (cls ? ' class="' + cls + '"' : '') + '><b>' + name + '</b><small>' + sub + '</small></button>';
    show('<div class="card"><h2>Mark of the Long Odds</h2>' + head(greet) +
      '<h3>Business</h3><div class="choices two">' + g('c8', st.scheme ? 'Scheme: ' + SBY[st.scheme.id].name : 'Scheme: ' + s.name, st.scheme ? 'Your coin is in. News after ' + st.scheme.left + ' more bout' + (st.scheme.left === 1 ? '' : 's') + '.' : 'Mark has an opportunity. He always has an opportunity.', st.scheme ? '' : 'hot') + g('c10', 'The Chit Rack', 'Things Mark will only part with for his own paper.') + '</div>' +
      '<h3>The pit</h3><div class="choices two">' + g('c1', 'Tonight’s card', 'Bet on undercard bouts, fought while you fight.') + g('c7', 'Duel Mark', 'A friendly, to the yield. Winner takes double the stake.') + '</div>' +
      '<h3>The table</h3><div class="choices two">' + g('c9', 'The Wisp Table', 'Dice made of light: Thirteen, Twenty-One and Poker Bones.') + g('c2', 'High Bones', 'Two dice each. Press your luck once.') + g('c3', 'Crown or Skull', 'Call the coin and let it ride.') +
      g('c4', 'The Rat Race', 'Four rats, one finish line, long odds on the slow one.') + g('c5', 'Three Cups', 'Follow the coin. Faster cups at higher stakes.') + g('c6', 'High Card', 'Higher or lower? The pot grows each time you are right.') +
      '</div><div class="row end"><button class="big" id="x">Walk away</button></div></div>');
    port(); on('#x', leave); on('#c1', () => ui.markCard()); on('#c2', () => ui.bones()); on('#c3', () => ui.coinflip());
    on('#c4', () => ui.ratRace()); on('#c5', () => ui.cups()); on('#c6', () => ui.highCard()); on('#c7', () => ui.duelMark());
    on('#c8', () => ui.scheme()); on('#c9', () => ui.wisp()); on('#c10', () => ui.chitRack());
  };

  // ------------------------------------------------------------ the chit rack
  ui.chitRack = function (line) {
    const st = G.state, c = st.cos, items = G.COSMETICS.filter(x => x.chit);
    show('<div class="card small"><h2>The Chit Rack</h2>' + head(line || 'House merchandise, bro. You cannot buy this with coin. You can only buy it by losing money to me first. That is called a business model.') +
      items.map(x => '<div class="ab-row"><div class="ab-tx"><b>' + x.name + '</b><p>' + x.desc + '</p></div>' + (c.owned[x.id] ? '<button disabled>Owned</button>' : '<button class="big" data-buy="' + x.id + '"' + (mk.chits() < x.chit ? ' disabled' : '') + '>' + x.chit + ' chits</button>') + '</div>').join('') +
      '<p class="dim">Wear what you own at the Tailor, round the side of the Fence.</p><div class="row end"><button class="big" id="b">Back</button></div></div>');
    port(); on('#b', () => ui.mark());
    on('[data-buy]', el => { const x = items.find(q => q.id === el.dataset.buy); if (!x || mk.chits() < x.chit) return; st.chits -= x.chit; c.owned[x.id] = true; c[x.slot] = x.id; G.save(); G.sfx('coin'); ui.topbar(); ui.chitRack('Looks incredible. Looks like money. Tell them Mark dressed you.'); });
  };

  // ------------------------------------------------------------ the Wisp Table
  const PIPS = [[], [4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];
  const die = (n, cls, attr) => '<span class="wd ' + (cls || '') + '"' + (attr || '') + '>' + (n ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => '<i' + (PIPS[n].includes(i) ? ' class="p"' : '') + '></i>').join('') : '') + '</span>';
  const rowOf = (arr, slots, cls) => { let h = ''; for (let i = 0; i < slots; i++) h += arr[i] ? die(arr[i], (cls || '') + (i === arr.length - 1 && arr.fresh ? ' pop' : '')) : die(0, 'empty'); return h; };
  const sum = a => a.reduce((x, y) => x + y, 0);
  ui.wisp = function (line) {
    clearT();
    if (mk.funds() < 10) return ui.mark('Bro. You have no coin. I respect the confidence. Come back with coin.');
    show('<div class="card small"><h2>The Wisp Table</h2>' + head(line || 'Wispdice. Guild-work, made of light. Cannot be loaded, cannot be palmed. I have tried, bro. I have really tried.') +
      '<div class="wdrow">' + [5, 2, 6, 1, 4].map((n, i) => die(n, 'float f' + i)).join('') + '</div><div class="choices">' +
      '<button id="w13"><b>Thirteen</b><small>Roll one die at a time. Stand close to 13, then Mark has to chase you. A dead 13 pays triple.</small></button>' +
      '<button id="w21"><b>Twenty-One</b><small>The long game. Same rules, to 21. A dead 21 pays triple.</small></button>' +
      '<button id="wpk"><b>Poker Bones</b><small>Five dice each. Hold what you like, roll the rest once. Best hand takes it.</small></button>' +
      '</div><div class="row end"><button id="b">Back to Mark</button><button class="big" id="x">Walk away</button></div></div>');
    port(); on('#x', leave); on('#b', () => ui.mark()); on('#w13', () => total(13, 10, 'Thirteen')); on('#w21', () => total(21, 17, 'Twenty-One')); on('#wpk', () => poker());
  };
  const done = (again) => '<button id="ag">Again</button><button id="bk">Other games</button><button class="big" id="x">Enough</button>';
  const wire = (again) => { on('#x', leave); on('#ag', again); on('#bk', () => ui.wisp()); };

  // Thirteen / Twenty-One: blackjack with dice
  function total(target, standAt, name) {
    const st = G.state, slots = target === 13 ? 5 : 8;
    show('<div class="card small"><h2>' + name + '</h2>' + head(target === 13 ? 'One die at a time. Get close to thirteen and stand. Go over and it is mine. Then I roll until I beat you or bust.' : 'Twenty-one, bro. The long game. Go over and it is mine. Then I chase your number until I catch it or bust.') + stakeRow() + '<div class="row end"><button id="b">Back</button></div></div>');
    port(); on('#b', () => ui.wisp());
    on('[data-s]', el => {
      const stake = +el.dataset.s; if (mk.funds() < stake) return; mk.take(stake); G.sfx('place'); ui.topbar();
      const you = [d6()], him = []; you.fresh = true; let over = false;
      const draw = (line, end) => {
        const ty = sum(you), th = sum(him);
        show('<div class="card small"><h2>' + name + '</h2>' + head(line) + '<div class="wtable"><div><small>Mark</small><div class="wdrow">' + rowOf(him, slots, 'him') + '</div><b>' + (him.length ? th : '–') + '</b></div><div><small>You</small><div class="wdrow">' + rowOf(you, slots) + '</div><b class="' + (ty > target ? 'bad' : ty === target ? 'good' : '') + '">' + ty + '</b></div></div>' +
          '<p class="dim">Staked ' + stake + '. Target ' + target + '.</p><div class="row end" id="wr">' + (end ? done() : over ? '' : '<button id="sd">Stand on ' + ty + '</button><button class="big" id="rl">Roll</button>') + '</div></div>');
        port(); you.fresh = him.fresh = false;
        if (end) return wire(() => total(target, standAt, name));
        on('#rl', () => { you.push(d6()); you.fresh = true; G.sfx('step'); const t = sum(you); if (t > target) { over = true; G.sfx('deny'); G.save(); return draw(pick(['Over. Ooh. Bro. That one is mine.', 'Bust! The wisps giveth. Mostly to me.']), true); } if (t === target) return stand(); draw(pick(['Again? Real ones roll again.', 'Looking good. Looking dangerous.', 'Hang on, what are you on? …Right. Go.'])); });
        on('#sd', stand);
      };
      const stand = () => { over = true; draw('Standing on ' + sum(you) + '. Okay. Okay okay okay. My roll.'); later(markRoll, 650); };
      const markRoll = () => {
        if (!$('wr')) return;
        const ty = sum(you); let th = sum(him);
        if (th < ty) { him.push(d6()); him.fresh = true; G.sfx('step'); draw(pick(['Come on. Come ON.', 'Papa needs a new pipe.', 'Wisps, do not do this to me.'])); return later(markRoll, 700); }
        let pay = 0, line;
        if (th > target) { pay = ty === target ? stake * 3 : stake * 2; line = 'OVER?! These dice are broken, bro. Guild-work, my foot. Paid ' + pay + '.'; }
        else if (ty > th) { pay = ty === target ? stake * 3 : stake * 2; line = (ty === target ? 'Dead on ' + target + '. That pays triple and I hate it. ' : 'Yours. Good roll. Respect. ') + 'Paid ' + pay + '.'; }
        else if (ty === th) { pay = stake; line = 'Same number. Nobody wins, which means I win a little, emotionally. Stake back.'; }
        else line = pick(['And THAT is why the house always wins. I am the house.', 'Mine. Happens to the best. Happens to you, too.']);
        if (pay) { st.coin += pay; G.sfx(pay > stake ? 'coin' : 'ui'); } else G.sfx('deny');
        G.save(); ui.topbar(); draw(line, true);
      };
      draw(target === 13 ? 'First die is down. Roll or stand, bro.' : 'Long way to twenty-one. Roll.');
    });
  }

  // Poker Bones
  const HANDS = ['Nothing', 'A Pair', 'Two Pairs', 'Three of a Kind', 'A Straight', 'Full House', 'Four of a Kind', 'Five of a Kind'];
  function score(d) {
    const c = [0, 0, 0, 0, 0, 0, 0]; d.forEach(v => c[v]++);
    const groups = []; for (let v = 6; v >= 1; v--) if (c[v]) groups.push([c[v], v]); groups.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    const shape = groups.map(g => g[0]).join(''), straight = shape === '11111' && (c[1] === 0 || c[6] === 0);
    const rank = shape === '5' ? 7 : shape === '41' ? 6 : shape === '32' ? 5 : straight ? 4 : shape === '311' ? 3 : shape === '221' ? 2 : shape === '2111' ? 1 : 0;
    return [rank].concat(groups.map(g => g[1]));
  }
  const cmp = (a, b) => { for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (a[i] || 0) - (b[i] || 0); if (d) return d; } return 0; };
  mk.pokerScore = score; mk.pokerCmp = cmp;
  function poker() {
    const st = G.state;
    show('<div class="card small"><h2>Poker Bones</h2>' + head('Five dice each. You hold the ones you like and roll the rest, once. Then me. Best hand wins. Dead level goes to the house, because the house is tired.') + stakeRow() + '<div class="row end"><button id="b">Back</button></div></div>');
    port(); on('#b', () => ui.wisp());
    on('[data-s]', el => {
      const stake = +el.dataset.s; if (mk.funds() < stake) return; mk.take(stake); G.sfx('place'); ui.topbar();
      let you = [d6(), d6(), d6(), d6(), d6()], him = [], hold = [false, false, false, false, false], phase = 0;
      const draw = (line, end) => {
        const sy = score(you);
        show('<div class="card small"><h2>Poker Bones</h2>' + head(line) + '<div class="wtable"><div><small>Mark</small><div class="wdrow">' + (him.length ? him.map(n => die(n, 'him')).join('') : [0, 0, 0, 0, 0].map(() => die(0, 'empty')).join('')) + '</div><b>' + (him.length ? HANDS[score(him)[0]] : '–') + '</b></div>' +
          '<div><small>You' + (phase === 0 ? ' · tap dice to hold' : '') + '</small><div class="wdrow">' + you.map((n, i) => die(n, (hold[i] ? 'held' : '') + (phase === 0 ? ' tap' : ''), ' data-d="' + i + '"')).join('') + '</div><b>' + HANDS[sy[0]] + '</b></div></div>' +
          '<p class="dim">Staked ' + stake + '. Five of a Kind pays 5x, Four of a Kind 3x, anything else 2x.</p><div class="row end" id="wr">' + (end ? done() : phase === 0 ? '<button id="sd">Keep all five</button><button class="big" id="rl">Roll the rest</button>' : '') + '</div></div>');
        port();
        if (end) return wire(poker);
        on('[data-d]', d => { if (phase) return; const i = +d.dataset.d; hold[i] = !hold[i]; G.sfx('ui'); d.classList.toggle('held', hold[i]); });
        on('#rl', () => { you = you.map((v, i) => hold[i] ? v : d6()); G.sfx('step'); go(); });
        on('#sd', go);
      };
      const go = () => { phase = 1; hold = [false, false, false, false, false]; draw('That is your hand? ' + HANDS[score(you)[0]] + '. Okay. Watch a professional.'); later(m1, 700); };
      const m1 = () => { if (!$('wr')) return; him = [d6(), d6(), d6(), d6(), d6()]; G.sfx('step'); draw(pick(['Hmm. HMM. I can work with this.', 'That is a start. That is definitely a start.'])); later(m2, 900); };
      const m2 = () => {
        if (!$('wr')) return;
        const s = score(him); if (s[0] !== 4 && s[0] !== 5 && s[0] !== 7) { const keep = s[0] === 0 ? Math.max.apply(null, him) : s[1], keep2 = s[0] === 2 ? s[2] : -1; him = him.map(v => v === keep || v === keep2 ? v : d6()); G.sfx('step'); }
        const a = score(you), b = score(him), c = cmp(a, b); let pay = 0, line;
        if (c > 0) { pay = stake * (a[0] === 7 ? 5 : a[0] === 6 ? 3 : 2); line = pick(['CLUTCH, BRO. ' + HANDS[a[0]] + '. I taught you that.', HANDS[a[0]] + ' beats ' + HANDS[b[0]] + '. The wisps have favourites. It is not me.']) + ' Paid ' + pay + '.'; }
        else line = c === 0 ? 'Dead level. House takes dead level. I said so before we started, I was very clear.' : pick([HANDS[b[0]] + '. Read it and weep, bro. Do not actually weep.', HANDS[b[0]] + ' takes it. The house thanks you for your service.']);
        if (pay) { st.coin += pay; G.sfx('coin'); } else G.sfx('deny');
        G.save(); ui.topbar(); draw(line, true);
      };
      draw('There is your five. Tap the ones you are keeping.');
    });
  }
})();
