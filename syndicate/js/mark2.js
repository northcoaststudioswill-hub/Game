// Guttercrown — more of Marc's table: the Rat Race, Three Cups, High Card, and duels for a stake
(function () {
  const G = window.G, ui = G.ui, pick = a => a[Math.floor(Math.random() * a.length)];
  const show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), $ = id => document.getElementById(id);
  const head = (line) => '<div class="mk-top"><span id="mkp"></span><div><p class="quote">“' + line + '”</p><p class="dim">You have <b>' + G.state.coin + '</b> coin.</p></div></div>';
  const port = () => { const el = $('mkp'); if (el) el.appendChild(G.portrait(G.mark.look, 92)); };
  const stakes = (max) => [10, 25, 50, 100, 250].filter(v => v <= max);
  const leave = () => { ui.close(); ui.topbar(); };
  const stakeRow = (st) => '<div class="row">' + stakes(G.mark.funds()).map(v => '<button class="big" data-s="' + v + '">Stake ' + v + '</button>').join('') + '</div>';
  const broke = () => ui.mark('Bro. You have no coin. I respect the confidence. Come back with coin.');
  const timers = []; const later = (fn, ms) => timers.push(setTimeout(fn, ms)); const clearT = () => { timers.forEach(clearTimeout); timers.length = 0; };

  ui.mark = function (line) {
    clearT(); const st = G.state, greet = line || pick(Math.random() < 0.3 ? ['Hang on. …What were we doing? Right. Money.', 'Is the ceiling lower today? No? Cool. Cool cool cool.', 'I am fine. I am extremely fine. Pick a game.'] : ['Bro. BRO. You look like someone who is about to be rich. Probably.', 'Step up, step up. I have got a guy for everything, bro. The guy is me.', 'Real ones bet big. I am just saying what real ones do, bro.', 'You want odds? I have got odds on the odds.']);
    const g = (id, name, sub) => '<button id="' + id + '"><b>' + name + '</b><small>' + sub + '</small></button>';
    show('<div class="card"><h2>Marc of the Long Odds</h2>' + head(greet) + '<h3>The pit</h3><div class="choices two">' +
      g('c1', 'Tonight’s card', 'Bet on undercard bouts, fought while you fight.') + g('c7', 'Duel Marc', 'A friendly, to the yield. Winner takes double the stake.') + '</div><h3>The table</h3><div class="choices two">' +
      g('c2', 'High Bones', 'Two dice each. Press your luck once.') + g('c3', 'Crown or Skull', 'Call the coin and let it ride.') +
      g('c4', 'The Rat Race', 'Four rats, one finish line, long odds on the slow one.') + g('c5', 'Three Cups', 'Follow the coin. Faster cups at higher stakes.') +
      g('c6', 'High Card', 'Higher or lower? The pot grows each time you are right.') + '</div><div class="row end"><button class="big" id="x">Walk away</button></div></div>');
    port(); on('#x', leave); on('#c1', () => ui.markCard()); on('#c2', () => ui.bones()); on('#c3', () => ui.coinflip());
    on('#c4', () => ui.ratRace()); on('#c5', () => ui.cups()); on('#c6', () => ui.highCard()); on('#c7', () => ui.duelMark());
  };

  ui.duelMark = function () {
    const st = G.state;
    show('<div class="card small"><h2>Duel Marc</h2>' + head('You and me, bro, in the pit. Nobody dies, I have got customers to rob later. First one to yield pays up.') +
      '<p class="dim">Marc fights as a Wild Magic sorcerer at your level. A friendly costs nothing to lose.</p><div class="row"><button class="big" data-s="0">Friendly</button>' + stakes(G.mark.funds()).map(v => '<button data-s="' + v + '">Stake ' + v + '</button>').join('') + '</div><div class="row end"><button id="b">Back</button></div></div>');
    port(); on('#b', () => ui.mark()); on('[data-s]', el => G.markDuel(+el.dataset.s, false));
  };

  // ---- the Rat Race
  const RATS = [['Bishop', '#c79bff'], ['Gravy', '#ffb060'], ['Sir Squeak', '#8ad0ff'], ['Mistake', '#9aff8a']];
  ui.ratRace = function () {
    const st = G.state; if (G.mark.funds() < 10) return broke();
    const sp = RATS.map(() => 0.7 + Math.random() * 0.6), tot = sp.reduce((a, b) => a + Math.pow(b, 4), 0), odds = sp.map(s => Math.max(1.4, Math.round(0.9 * tot / Math.pow(s, 4) * 10) / 10));
    let stake = stakes(G.mark.funds())[0];
    const draw = (line) => {
      show('<div class="card small"><h2>The Rat Race</h2>' + head(line) + '<div class="chips">' + stakes(G.mark.funds()).map(v => '<button class="chip' + (v === stake ? ' sel' : '') + '" data-st="' + v + '">' + v + '</button>').join('') + '</div>' +
        RATS.map((r, i) => '<div class="ab-row"><div class="ab-ic pas" style="color:' + r[1] + '">●</div><div class="ab-tx"><b>' + r[0] + '</b><small>pays ' + odds[i].toFixed(1) + 'x</small></div><button class="big" data-rat="' + i + '">Back ' + r[0].split(' ').pop() + '</button></div>').join('') + '<div class="row end"><button id="b">Back</button></div></div>');
      port(); on('#b', () => ui.mark()); on('[data-st]', el => { stake = +el.dataset.st; draw(line); });
      on('[data-rat]', el => run(+el.dataset.rat));
    };
    const run = (mine) => {
      G.mark.take(stake); G.sfx('place'); const pos = [0, 0, 0, 0]; let done = false;
      show('<div class="card small"><h2>The Rat Race</h2>' + head('AND THEY ARE OFF. Sort of. Mistake is facing the wrong way.') + '<div class="track">' + RATS.map((r, i) => '<div class="lane' + (i === mine ? ' mine' : '') + '"><small>' + r[0] + '</small><span class="rat" id="rat' + i + '" style="background:' + r[1] + '"></span></div>').join('') + '</div><div class="row end" id="rr"></div></div>');
      port();
      const tick = () => {
        if (done) return;
        for (let i = 0; i < 4; i++) { pos[i] += sp[i] * (0.6 + Math.random() * 1.6); const e = $('rat' + i); if (!e) return; e.style.left = Math.min(100, pos[i]) + '%'; }
        const w = pos.findIndex(v => v >= 100);
        if (w < 0) return later(tick, 90);
        done = true; const best = pos.indexOf(Math.max(...pos)), win = best === mine, pay = Math.round(stake * odds[mine]);
        if (win) { st.coin += pay; G.sfx('coin'); } else G.sfx('deny');
        G.save(); ui.topbar();
        document.querySelector('#panel .quote').textContent = '“' + (win ? RATS[best][0].toUpperCase() + '! That is my guy! That is YOUR guy! Paid ' + pay + '.' : RATS[best][0] + ' takes it. ' + pick(['Ooh. Bro. That is rough.', 'The house thanks you for your service.', 'I had money on that one. Me, personally.'])) + '”';
        $('rr').innerHTML = '<button id="ag">Again</button><button class="big" id="x">Enough</button>'; on('#x', leave); on('#ag', () => ui.ratRace());
      };
      later(tick, 400);
    };
    draw('Four rats, bro. Bishop is the favourite. Mistake is called Mistake for a reason, but the pay is beautiful.');
  };

  // ---- Three Cups
  ui.cups = function () {
    const st = G.state; if (G.mark.funds() < 10) return broke();
    show('<div class="card small"><h2>Three Cups</h2>' + head('Coin goes under a cup. Cups go round. You point. Pays two and a half. Bigger stake, faster hands, that is just physics.') + stakeRow(st) + '<div class="row end"><button id="b">Back</button></div></div>');
    port(); on('#b', () => ui.mark());
    on('[data-s]', el => {
      const stake = +el.dataset.s; G.mark.take(stake); G.sfx('place'); ui.topbar();
      let slot = [0, 1, 2], coin = 1, swaps = 5 + Math.min(6, Math.floor(stake / 25)), ms = Math.max(170, 430 - stake * 1.1), locked = true;
      show('<div class="card small"><h2>Three Cups</h2>' + head('Watch the middle one. Watch it. Are you watching it?') + '<div class="cups">' + [0, 1, 2].map(i => '<button class="cup" id="cup' + i + '" data-cup="' + i + '"><i></i></button>').join('') + '</div><p class="dim" id="cmsg">The coin is under the middle cup.</p><div class="row end" id="cr"></div></div>');
      port();
      const lay = () => slot.forEach((s, i) => { const e = $('cup' + i); if (e) { e.style.left = (8 + s * 31) + '%'; e.style.transitionDuration = ms + 'ms'; } });
      lay(); $('cup1').classList.add('show');
      later(() => { $('cup1') && $('cup1').classList.remove('show'); }, 900);
      const step = (n) => {
        if (!$('cup0')) return;
        if (n <= 0) { locked = false; $('cmsg').textContent = 'Point at one.'; return; }
        const a = Math.floor(Math.random() * 3), b = (a + 1 + Math.floor(Math.random() * 2)) % 3, t = slot[a]; slot[a] = slot[b]; slot[b] = t; lay(); G.sfx('step'); later(() => step(n - 1), ms + 40);
      };
      later(() => step(swaps), 1300);
      on('[data-cup]', c => {
        if (locked) return; locked = true; const i = +c.dataset.cup, win = i === coin; $('cup' + coin).classList.add('show'); if (!win) c.classList.add('lift');
        const pay = Math.round(stake * 2.5); if (win) { st.coin += pay; G.sfx('coin'); } else G.sfx('deny');
        G.save(); ui.topbar();
        $('cmsg').textContent = win ? 'There it is. Paid ' + pay + '.' : 'Empty.'; document.querySelector('#panel .quote').textContent = '“' + (win ? pick(['Okay. OKAY. Good eyes. Respect.', 'CLUTCH, BRO. I taught you that.']) : pick(['Bro. It was RIGHT there. I basically showed you.', 'Happens to the best. Happens to you, too.'])) + '”';
        $('cr').innerHTML = '<button id="ag">Again</button><button class="big" id="x">Enough</button>'; on('#x', leave); on('#ag', () => ui.cups());
      });
    });
  };

  // ---- High Card
  const FACE = n => ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][n];
  ui.highCard = function () {
    const st = G.state; if (G.mark.funds() < 10) return broke();
    show('<div class="card small"><h2>High Card</h2>' + head('I turn a card. You say higher or lower. Right, and the pot grows. Same card twice is mine, because I said so first.') + stakeRow(st) + '<div class="row end"><button id="b">Back</button></div></div>');
    port(); on('#b', () => ui.mark());
    on('[data-s]', el => {
      let pot = +el.dataset.s, cur = 2 + Math.floor(Math.random() * 11), streak = 0; G.mark.take(pot); G.sfx('place'); ui.topbar();
      const draw = (line) => {
        // fair-ish multiplier: the unlikelier the call, the better it pays
        const pH = (13 - cur) / 13, pL = (cur - 1) / 13, mH = pH > 0 ? Math.min(6, Math.round(0.92 / pH * 10) / 10) : 0, mL = pL > 0 ? Math.min(6, Math.round(0.92 / pL * 10) / 10) : 0;
        show('<div class="card small"><h2>High Card</h2>' + head(line) + '<div class="table one"><div><span class="pcard">' + FACE(cur) + '</span><b>Pot ' + pot + '</b><small>' + streak + ' right so far</small></div></div><div class="row end">' + (streak ? '<button id="wk">Walk with ' + pot + '</button>' : '') +
          (mH ? '<button class="big" data-g="h">Higher · ' + mH.toFixed(1) + 'x</button>' : '') + (mL ? '<button class="big" data-g="l">Lower · ' + mL.toFixed(1) + 'x</button>' : '') + '</div></div>');
        port();
        on('#wk', () => { st.coin += pot; G.save(); G.sfx('coin'); ui.topbar(); ui.mark('Walking with ' + pot + '. Smart. Boring. Respect.'); });
        on('[data-g]', b => {
          const nx = 1 + Math.floor(Math.random() * 13), hi = b.dataset.g === 'h', ok = hi ? nx > cur : nx < cur;
          if (ok) { pot = Math.round(pot * (hi ? mH : mL)); streak++; cur = nx; G.sfx('coin'); draw(pick(['Called it. Again? Real ones go again.', 'The deck loves you, bro. The deck has never loved me.', 'Hang on. …right. Yes. Next card.'])); }
          else { G.save(); G.sfx('deny'); ui.topbar(); show('<div class="card small"><h2>High Card</h2>' + head(nx === cur ? 'Same card. That one is mine, bro. House rules.' : pick(['Ooh. Bro. That is rough.', 'The house thanks you for your service.'])) + '<div class="table one"><div><span class="pcard">' + FACE(nx) + '</span><b>Pot gone</b></div></div><div class="row end"><button id="ag">Again</button><button class="big" id="x">Enough</button></div></div>'); port(); on('#x', leave); on('#ag', () => ui.highCard()); }
        });
      };
      draw('First card is down, bro. Higher or lower?');
    });
  };
})();
