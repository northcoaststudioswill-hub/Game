// Guttercrown — Marc of the Long Odds: the Undercity's bookie. Dice, coin, and a card of undercard bouts
// that are fought (simulated) while you are in the pit.
(function () {
  const G = window.G, ui = G.ui, pick = a => a[Math.floor(Math.random() * a.length)], d6 = () => 1 + Math.floor(Math.random() * 6);
  const show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);

  const SAY = {
    hello: ['Bro. BRO. You look like someone who is about to be rich. Probably.', 'There they are. My favourite fighter. Do not tell the others, I say it to all of them.', 'Step up, step up. I have got a guy for everything, bro. The guy is me.', 'You want odds? I have got odds. I have got odds on the odds.', 'Real ones bet big. I am just saying what real ones do, bro.'],
    high: ['Hang on. …What were we doing? Right. Money.', 'Is the ceiling lower today? No? Cool. Cool cool cool.', 'Bro, I have had one glowcap pipe. One. And then some others.', 'Do not look at the lanterns too long. Trust me on that one.', 'I am fine. I am extremely fine. Deal the dice.'],
    win: ['CLUTCH, BRO. I taught you that.', 'Okay. OKAY. Beginner’s luck. Respect, though.', 'Look at you. Do not spend it all at the Fence. Spend it here.', 'That is my guy! That is my guy. Pay the fighter.'],
    lose: ['Ooh. Bro. That is rough. Run it back?', 'The house thanks you for your service.', 'Happens to the best. Happens to you, too.', 'Barely even trying, by the way. That was me barely trying.'],
    tie: ['Tie goes to the house. House rules, bro. I am the house.'],
    broke: ['Bro. You have no coin. I respect the confidence. Come back with coin.'],
    card: ['Three bouts tonight on the undercard. They fight while you fight. I watch both. I am very talented.', 'Pick a winner, bro. Or do not, and be poor. Up to you.'],
    self: ['You want to bet on YOURSELF? Bro. That is either heart or brain damage. I will take it.']
  };
  const say = k => { if (G.marcSaid) G.marcSaid(k); return pick(SAY[k]); }; G.marcSAY = SAY;
  const NAMES = [['Hod', 'the Lamplighter'], ['Sela', 'Two-Rings'], ['Big Orrin', ''], ['Crow', 'of the Ninth Stair'], ['Mags', 'Ironside'], ['Thimble', ''], ['Dray', 'the Unpaid'], ['Wick', ''], ['Bess', 'Coldwater'], ['Old Pell', ''], ['Varn', 'Half-Hand'], ['Juniper', 'Slate'], ['Kettle', ''], ['Roan', 'the Quiet']];
  const ENDS = ['put {l} into the wall in the second exchange.', 'bled {l} out slowly. The crowd got restless.', 'took one clean shot from {l} and answered with six.', 'was losing badly until {l} whiffed a finisher.', 'parried everything {l} had. It was honestly rude.', 'won ugly. {l} will not be fighting again.', 'ended it with a single mortal blow. {l} never saw it.'];

  const mk = G.mark = {
    look: { id: 'marc', cls: 'sorcerer', race: 'human', tint: { hair: '#2a1c10' }, cos: { dye: 'emerald', head: 'laurel', back: null, weapon: 'gilded', aura: null } },
    card: function () {                          // tonight's undercard
      const st = G.state; if (st.card && st.card.bouts) return st.card;
      const pool = NAMES.slice().sort(() => Math.random() - 0.5), bouts = [];
      for (let i = 0; i < 3; i++) { const a = pool[i * 2], b = pool[i * 2 + 1], ra = 3 + Math.floor(Math.random() * 8), rb = 3 + Math.floor(Math.random() * 8); bouts.push({ a: a[0] + (a[1] ? ' ' + a[1] : ''), b: b[0] + (b[1] ? ' ' + b[1] : ''), ra, rb, bet: null }); }
      return st.card = { bouts, self: null };
    },
    odds: (r, o) => Math.max(1.15, Math.round(0.92 * (r + o) / r * 20) / 20),       // payout multiplier, with the house's cut
    selfOdds: function () { const st = G.state, i = G.OPPONENTS.findIndex(o => !st.wins[o.id]), o = G.OPPONENTS[i < 0 ? G.OPPONENTS.length - 1 : i]; return { opp: o, odds: Math.round((1.35 + o.level * 0.22 - st.hero.level * 0.1) * 20) / 20 }; },
    resolve: function (won) {                    // called when your bout ends: the undercard was fought meanwhile
      const st = G.state, c = st.card; if (!c) return;
      const lines = []; let net = 0, any = false;
      c.bouts.forEach(b => {
        const aWins = Math.random() < b.ra / (b.ra + b.rb), w = aWins ? b.a : b.b, l = aWins ? b.b : b.a;
        let res = '';
        if (b.bet) { any = true; const hit = (b.bet.pick === 'a') === aWins; if (hit) { const pay = Math.round(b.bet.stake * mk.odds(aWins ? b.ra : b.rb, aWins ? b.rb : b.ra)); st.coin += pay; net += pay - b.bet.stake; res = 'You had ' + w.split(' ')[0] + '. Paid ' + pay + '.'; } else { net -= b.bet.stake; res = 'You had ' + l.split(' ')[0] + '. Gone.'; } }
        lines.push({ text: w + ' ' + pick(ENDS).replace('{l}', l.split(' ')[0]), res });
      });
      if (c.self) { any = true; if (won) { const pay = Math.round(c.self.stake * c.self.odds); st.coin += pay; net += pay - c.self.stake; lines.push({ text: 'And you. You actually did it.', res: 'You backed yourself. Paid ' + pay + '.' }); } else { net -= c.self.stake; lines.push({ text: 'And you. Bro.', res: 'You backed yourself. Gone.' }); } }
      st.card = null; if (any) st.markReport = { lines, net };
    }
  };

  const head = (line) => '<div class="mk-top"><span id="mkp"></span><div><p class="quote">“' + line + '”</p><p class="dim">You have <b>' + G.state.coin + '</b> coin.</p></div></div>';
  const port = () => { const el = document.getElementById('mkp'); if (el) el.appendChild(G.portrait(mk.look, 92)); };
  const stakes = (max) => [10, 25, 50, 100, 250].filter(v => v <= max);
  const leave = () => { ui.close(); ui.topbar(); };

  ui.mark = function (line) {
    const st = G.state;
    show('<div class="card small"><h2>Marc of the Long Odds</h2>' + head(line || (Math.random() < 0.3 ? say('high') : say('hello'))) +
      '<div class="choices"><button id="c1"><b>Tonight’s card</b><small>Bet on the undercard bouts. They are fought while you are in the pit.</small></button>' +
      '<button id="c2"><b>High Bones</b><small>Two dice each. Highest pair of bones takes the pot. You may press your luck once.</small></button>' +
      '<button id="c3"><b>Crown or Skull</b><small>Call the coin. Double it, then decide whether to let it ride.</small></button></div>' +
      '<div class="row end"><button class="big" id="x">Walk away</button></div></div>');
    port(); on('#x', leave); on('#c1', () => ui.markCard()); on('#c2', () => ui.bones()); on('#c3', () => ui.coinflip());
  };

  // ---- the card
  ui.markCard = function (line) {
    const st = G.state, c = mk.card(), so = mk.selfOdds();
    let h = '<div class="card"><h2>Tonight’s Card</h2>' + head(line || say('card'));
    c.bouts.forEach((b, i) => {
      const oa = mk.odds(b.ra, b.rb), ob = mk.odds(b.rb, b.ra);
      h += '<div class="bout"><div class="bside' + (b.bet && b.bet.pick === 'a' ? ' sel' : '') + '"><b>' + b.a + '</b><small>pays ' + oa.toFixed(2) + 'x</small></div><span class="bvs">vs</span><div class="bside' + (b.bet && b.bet.pick === 'b' ? ' sel' : '') + '"><b>' + b.b + '</b><small>pays ' + ob.toFixed(2) + 'x</small></div>' +
        (b.bet ? '<p class="bbet">' + b.bet.stake + ' coin on ' + (b.bet.pick === 'a' ? b.a : b.b).split(' ')[0] + '.</p>' :
          '<div class="row bst">' + ['a', 'b'].map(pk => stakes(G.mark.funds()).slice(0, 4).map(v => '<button class="mini" data-bet="' + i + ':' + pk + ':' + v + '">' + v + ' on ' + (pk === 'a' ? b.a : b.b).split(' ')[0] + '</button>').join('')).join('<i></i>') + '</div>') + '</div>';
    });
    h += '<div class="bout self"><div class="bside sel"><b>Yourself</b><small>against ' + so.opp.name + ' · pays ' + so.odds.toFixed(2) + 'x</small></div>' +
      (c.self ? '<p class="bbet">' + c.self.stake + ' coin on yourself to win your next bout.</p>' : '<div class="row bst">' + stakes(G.mark.funds()).map(v => '<button class="mini" data-self="' + v + '">' + v + ' on me</button>').join('') + '</div>') + '</div>';
    h += '<p class="dim">Bets are settled when your next bout ends, win or lose. Marc keeps a cut of every payout.</p><div class="row end"><button id="b">Back</button><button class="big" id="x">Done</button></div></div>';
    show(h); port(); on('#x', leave); on('#b', () => ui.mark());
    on('[data-bet]', el => { const p = el.dataset.bet.split(':'), b = c.bouts[+p[0]], v = +p[2]; if (G.mark.funds() < v) return; G.mark.take(v); b.bet = { pick: p[1], stake: v }; G.save(); G.sfx('coin'); ui.markCard('Locked in. No refunds, bro. I checked, there is a rule.'); ui.topbar(); });
    on('[data-self]', el => { const v = +el.dataset.self; if (G.mark.funds() < v) return; G.mark.take(v); c.self = { stake: v, odds: so.odds }; G.save(); G.sfx('coin'); ui.markCard(say('self')); ui.topbar(); });
  };
  ui.markReport = function () {
    const st = G.state, r = st.markReport; st.markReport = null; G.save();
    show('<div class="card small"><h2>Marc Settles Up</h2>' + head(r.net > 0 ? say('win') : r.net < 0 ? say('lose') : 'Dead even. Weird. I do not like it.') +
      r.lines.map(l => '<div class="ab-row"><div class="ab-tx"><p>' + l.text + '</p>' + (l.res ? '<small class="rew">' + l.res + '</small>' : '') + '</div></div>').join('') +
      '<p class="rankup">' + (r.net >= 0 ? 'Up ' + r.net : 'Down ' + (-r.net)) + ' coin on the night.</p><div class="row end"><button class="big" id="x">Carry on</button></div></div>');
    port(); G.sfx(r.net > 0 ? 'coin' : 'deny'); on('#x', () => { ui.close(); ui.topbar(); ui.afterFight(); });
  };

  // ---- High Bones
  const die = (n, cls) => '<span class="bone ' + (cls || '') + '">' + ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][n] + '</span>';
  ui.bones = function () {
    const st = G.state;
    if (G.mark.funds() < 10) return ui.mark(say('broke'));
    show('<div class="card small"><h2>High Bones</h2>' + head('Two bones each, highest total wins. Tie goes to me. You can press once: double the stake, re-throw your worst bone.') +
      '<div class="row">' + stakes(G.mark.funds()).map(v => '<button class="big" data-s="' + v + '">Stake ' + v + '</button>').join('') + '</div><div class="row end"><button id="b">Back</button></div></div>');
    port(); on('#b', () => ui.mark());
    on('[data-s]', el => {
      let stake = +el.dataset.s, you = [d6(), d6()], pressed = false; G.mark.take(stake); G.sfx('place');
      const table = (line, done, mine) => {
        show('<div class="card small"><h2>High Bones</h2>' + head(line) + '<div class="table"><div><small>YOU</small>' + die(you[0]) + die(you[1]) + '<b>' + (you[0] + you[1]) + '</b></div><div><small>MARK</small>' + (mine ? die(mine[0], 'm') + die(mine[1], 'm') + '<b>' + (mine[0] + mine[1]) + '</b>' : die(0, 'm hid') + die(0, 'm hid') + '<b>?</b>') + '</div></div><p class="dim">Pot: ' + stake * 2 + ' coin.</p>' +
          '<div class="row end">' + (done ? '<button id="ag">Again</button><button class="big" id="x">Enough</button>' : (!pressed && st.coin >= stake ? '<button id="pr">Press (stake ' + stake * 2 + ')</button>' : '') + '<button class="big" id="st">Stand</button>') + '</div></div>');
        port(); on('#x', leave); on('#ag', () => ui.bones());
        on('#pr', () => { G.mark.take(stake); stake *= 2; pressed = true; const i = you[0] <= you[1] ? 0 : 1; you[i] = d6(); G.sfx('place'); table('Pressing. I respect it. I also hope it goes badly.', false); });
        on('#st', () => {
          const m = [d6(), d6()], ys = you[0] + you[1], ms = m[0] + m[1], win = ys > ms;
          if (win) { st.coin += stake * 2; G.sfx('coin'); } else G.sfx('deny');
          G.save(); ui.topbar(); table(win ? say('win') : ys === ms ? say('tie') : say('lose'), true, m);
        });
      };
      table(Math.random() < 0.25 ? say('high') : 'Bones are down, bro. What is it going to be?', false);
    });
  };

  // ---- Crown or Skull
  ui.coinflip = function () {
    const st = G.state;
    if (G.mark.funds() < 10) return ui.mark(say('broke'));
    show('<div class="card small"><h2>Crown or Skull</h2>' + head('One coin. You call it. Win and the pot doubles, and then you have to decide if you are a real one. Five in a row is the record. It is my record.') +
      '<div class="row">' + stakes(G.mark.funds()).map(v => '<button class="big" data-s="' + v + '">Stake ' + v + '</button>').join('') + '</div><div class="row end"><button id="b">Back</button></div></div>');
    port(); on('#b', () => ui.mark());
    on('[data-s]', el => {
      let pot = +el.dataset.s, streak = 0; G.mark.take(pot); G.sfx('place');
      const round = (line, last) => {
        show('<div class="card small"><h2>Crown or Skull</h2>' + head(line) + '<div class="table one"><div>' + (last ? '<span class="flip">' + (last === 'crown' ? '♛' : '☠') + '</span>' : '<span class="flip spin">◉</span>') + '<b>Pot ' + pot + '</b><small>' + streak + ' in a row</small></div></div>' +
          '<div class="row end">' + (streak > 0 ? '<button id="wk">Walk with ' + pot + '</button>' : '') + (streak < 5 ? '<button class="big" data-call="crown">Call Crown</button><button class="big" data-call="skull">Call Skull</button>' : '') + '</div></div>');
        port();
        on('#wk', () => { st.coin += pot; G.save(); G.sfx('coin'); ui.topbar(); ui.mark('Walking away. Smart. Boring, but smart. Respect.'); });
        on('[data-call]', el2 => {
          const face = Math.random() < 0.5 ? 'crown' : 'skull';
          if (face === el2.dataset.call) { pot *= 2; streak++; G.sfx('coin'); if (streak >= 5) { st.coin += pot; G.save(); ui.topbar(); return ui.mark('FIVE. Bro. BRO. You tied my record. Take your ' + pot + ' and get out before I cry.'); } round(pick(['Called it. Let it ride? Real ones let it ride.', 'Again! The coin loves you. The coin has never loved me.', say('high')]), face); }
          else { G.save(); G.sfx('deny'); ui.topbar(); show('<div class="card small"><h2>Crown or Skull</h2>' + head(say('lose')) + '<div class="table one"><div><span class="flip">' + (face === 'crown' ? '♛' : '☠') + '</span><b>Pot gone</b></div></div><div class="row end"><button id="ag">Again</button><button class="big" id="x">Enough</button></div></div>'); port(); on('#x', leave); on('#ag', () => ui.coinflip()); }
        });
      };
      round('Coin is in the air, bro. Call it.', null);
    });
  };
})();
