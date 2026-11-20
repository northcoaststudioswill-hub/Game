// Guttercrown — three fighters on one machine, and Marc's table straight from the title screen (house money, nothing saved)
(function () {
  'use strict';
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), W = G.world;
  const line = q => q ? '<b>' + G.esc(q.hero.name) + '</b><small>Level ' + q.hero.level + ' ' + (G.RACES[q.hero.race] || {}).name + ' ' + (G.CLASSES[q.hero.cls] || {}).name + ' · ' + G.RANKS[G.rankOf(q.respect || 0)].name + ' · ' + (q.coin || 0) + ' coin' + (q.usurper ? ' · crowned' : '') + '</small>' : '<b>Empty</b><small>A fresh page in the Ledger.</small>';
  const slots = () => { const a = []; for (let n = 1; n <= G.SLOTS; n++) a.push(G.slotInfo(n)); return a; };

  // ---------------------------------------------------------------- choosing a fighter
  ui.saves = function (mode) {        // mode: 'load' or 'new'
    const all = slots();
    show('<div class="card small"><h2>' + (mode === 'new' ? 'A New Fighter' : 'Your Fighters') + '</h2><p class="dim">' + (mode === 'new' ? 'Choose a page to write them on.' : 'Three pages in the Ledger. Each keeps its own fighter, home and debts.') + '</p><div class="saveslots">' +
      all.map((q, i) => '<div class="saveslot' + (q ? '' : ' empty') + (i + 1 === G.slot && q ? ' cur' : '') + '"><span class="sp" data-sp="' + i + '"></span><div class="ss-tx"><small class="over">Page ' + (i + 1) + '</small>' + line(q) + '</div><div class="ss-btn">' +
        (mode === 'new' ? '<button class="' + (q ? 'danger' : 'big') + '" data-new="' + (i + 1) + '">' + (q ? 'Replace' : 'Start here') + '</button>' : (q ? '<button class="big" data-load="' + (i + 1) + '">Continue</button><button class="mini danger" data-del="' + (i + 1) + '">Erase</button>' : '<button data-new="' + (i + 1) + '">New fighter</button>')) + '</div></div>').join('') +
      '</div><div class="row end"><button class="big" id="x">Back</button></div></div>');
    all.forEach((q, i) => { const el = document.querySelector('[data-sp="' + i + '"]'); if (el && q) { try { el.appendChild(G.portrait(G.lookOf(q.hero, q), 64)); } catch (e) { } } });
    on('#x', () => ui.title());
    on('[data-load]', b => { G.setSlot(+b.dataset.load); G.load(); G.applyOpts(); ui._coin = G.state.coin; ui.hub(); });
    const begin = n => { G.setSlot(n); G.wipeSlot(n); G.state = G.newState(); G.cine.play(() => ui.create()); };
    on('[data-new]', b => { const n = +b.dataset.new, q = G.slotInfo(n); if (!q) return begin(n);
      show('<div class="card small"><h2>Replace ' + G.esc(q.hero.name) + '?</h2><p>Page ' + n + ' is wiped: this fighter, their home and everything they owe are gone for good.</p><div class="row end"><button class="big" id="n">Keep them</button><button class="danger" id="y">Replace</button></div></div>'); on('#n', () => ui.saves(mode)); on('#y', () => begin(n)); });
    on('[data-del]', b => { const n = +b.dataset.del, q = G.slotInfo(n);
      show('<div class="card small"><h2>Erase ' + G.esc(q.hero.name) + '?</h2><p>This cannot be undone.</p><div class="row end"><button class="big" id="n">Keep them</button><button class="danger" id="y">Erase</button></div></div>'); on('#n', () => ui.saves(mode)); on('#y', () => { G.wipeSlot(n); G.hasSave() ? ui.saves(mode) : ui.title(); }); });
  };

  // ---------------------------------------------------------------- the title screen
  const t0 = ui.title;
  ui.title = function () {
    if (G.guest) { G.guest = false; G.state = G.newState(); }
    const r = t0.apply(this, arguments), all = slots(), n = all.filter(Boolean).length, menu = document.querySelector('#panel .menu'); if (!menu) return r;
    const swap = (id, fn) => { const b = document.getElementById(id); if (!b) return null; const c = b.cloneNode(true); b.parentNode.replaceChild(c, b); c.onclick = () => { G.audioInit && G.audioInit(); G.sfx('ui'); fn(); }; return c; };
    // Continue: the fighter you last played; with more than one, a line says who, and Fighters lists them all
    if (n) { if (!all[G.slot - 1]) G.setSlot(all.findIndex(Boolean) + 1); const cur = all[G.slot - 1]; const c = swap('bCont', () => { G.load(); G.applyOpts(); ui._coin = G.state.coin; ui.hub(); }); if (c) c.innerHTML = 'Continue<small class="t-who">' + G.esc(cur.hero.name) + ' · level ' + cur.hero.level + ' ' + G.CLASSES[cur.hero.cls].name + '</small>'; }
    swap('bNew', () => { if (!n) { G.setSlot(1); return G.cine.play(() => ui.create()); } const free = all.findIndex(q => !q); if (free >= 0) { G.setSlot(free + 1); G.state = G.newState(); return G.cine.play(() => ui.create()); } ui.saves('new'); });
    const add = (id, label, fn, after) => { const b = document.createElement('button'); b.id = id; b.textContent = label; b.onclick = () => { G.audioInit && G.audioInit(); G.sfx('ui'); fn(); }; after.insertAdjacentElement('afterend', b); return b; };
    const nw = document.getElementById('bNew'); let last = nw;
    if (n) last = add('bSaves', 'Fighters (' + n + ' of ' + G.SLOTS + ')', () => ui.saves('load'), nw);
    add('bMarc', 'Marc’s Table', () => guest(), last);
    return r;
  };

  // ---------------------------------------------------------------- Marc's table, from the title: house money, nothing kept
  const STAKE = 300;
  function guest() {
    G.guest = true; const st = G.state = G.newState(), h = st.hero = G.newHero('Guest', 'human', 'rogue');
    Object.assign(st, { coin: STAKE, respect: 500, toured: 1, tourAsked: 1, kitPicked: 1, kitShown: 1, firstPath: 9, shownPlaces: { guest: 1 }, wins: { guest: 3 }, met: { mark: 1 }, seen: { mark: 1, wisp: 1, board: 1, cook: 1, apoth: 1, tally: 1, armory: 1 } }); h.level = 3;
    G.applyOpts(); ui._coin = st.coin; ui.hub(); ui.close(); if (G.talk) G.talkApi.skip(); const w = W.walker; w.x = 25.6; w.z = 4.6; w.target = null; card();
  }
  function card(line) {
    const st = G.state, up = st.coin + (st.chits || 0) - STAKE;
    show('<div class="card small"><small class="over">House money · nothing here is saved</small><h2>Marc’s Table</h2><p class="quote">“' + (line || (st.coin + (st.chits || 0) < 10 ? 'Cleaned out! On house money! Bro. That is almost impressive. Here, take another purse.' : 'No fighter, no debts, no Ledger. Just you, me, and money that is not real. My favourite kind of customer.')) + '”</p><p class="dim">You have <b>' + st.coin + '</b> coin' + (up ? ' · ' + (up > 0 ? 'up ' + up : 'down ' + -up) + ' on the night' : '') + '.</p><div class="fence-rooms">' +
      '<button class="fence-room" id="gm"><span class="fr-ic">♣</span><b>Marc’s games</b><small>Bones, cups, cards, the Rat Race</small></button>' +
      '<button class="fence-room" id="gd"><span class="fr-ic">⚄</span><b>Sir Dedrick III</b><small>The wispdice ring</small></button>' +
      '<button class="fence-room" id="gp"><span class="fr-ic">❂</span><b>New purse</b><small>Back to ' + STAKE + ' coin</small></button>' +
      '</div><div class="row end"><button class="big" id="x">Back to the title</button></div></div>');
    on('#gm', () => { topUp(); ui.mark(); }); on('#gd', () => { topUp(); ui.wisp(); }); on('#gp', () => { st.coin = STAKE; st.chits = 0; ui._coin = st.coin; ui.topbar(); card('A fresh purse. It spends exactly like the last one.'); });
    on('#x', () => { G.guest = false; G.state = G.newState(); if (G.dice && G.dice.on) G.dice.leave(); ui.title(); });
  }
  const topUp = () => { const st = G.state; if (st.coin + (st.chits || 0) < 10) { st.coin = STAKE; ui.topbar(); } };
  // as a guest there is no market to wander: whenever nothing is open, the table's own card comes back
  setInterval(() => { if (!G.guest || G.scene !== 'hub' || ui.isOpen() || G.talk || G.dicing || G.spectating || (G.fight && G.fight.active)) return; card(); }, 250);
  G.guestCard = card;
})();
