// Guttercrown — the notice board: pit contracts (a small job to do in the ring, paid on completion) and the win streak
(function () {
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const stat = (st, k) => (st.stats || {})[k] || 0, pick = a => a[Math.floor(Math.random() * a.length)];
  // stat = what the pit counts; goal = how many since you took the paper down
  G.CONTRACTS = [
    { id: 'parry', name: 'Clean Hands', by: 'A fencing-master with a debt', desc: 'Parry 4 blows.', stat: 'parry', goal: 4, coin: 55, respect: 8 },
    { id: 'break', name: 'Make Them Kneel', by: 'The Ledger-Keeper', desc: 'Break an opponent’s posture twice.', stat: 'break', goal: 2, coin: 60, respect: 8 },
    { id: 'sever', name: 'The Butcher’s Bill', by: 'A man who sells sawdust', desc: 'Take two limbs.', stat: 'sever', goal: 2, coin: 70, respect: 10 },
    { id: 'heavy', name: 'Put Your Back In It', by: 'A smith on the third level', desc: 'Land 5 heavy blows.', stat: 'heavy', goal: 5, coin: 55, respect: 6 },
    { id: 'wall', name: 'Stonework', by: 'The pit masons', desc: 'Put an opponent into the wall twice.', stat: 'wall', goal: 2, coin: 50, respect: 8 },
    { id: 'perfect', name: 'Ghost Step', by: 'Nobody you can see', desc: 'Land 2 perfect dodges.', stat: 'perfect', goal: 2, coin: 60, respect: 9 },
    { id: 'block', name: 'Shieldwall', by: 'An old watch sergeant', desc: 'Block 6 blows.', stat: 'block', goal: 6, coin: 45, respect: 6 },
    { id: 'show', name: 'Give Them a Show', by: 'Mark of the Long Odds', desc: 'End a bout with the crowd at full roar.', stat: 'hype100', goal: 1, coin: 65, respect: 12 },
    { id: 'clean', name: 'Not a Scratch', by: 'A Seal-Warden, unofficially', desc: 'Win a bout without losing any health.', stat: 'flawless', goal: 1, coin: 120, respect: 18 },
    { id: 'wins', name: 'Two in a Row', by: 'The Deep Guild', desc: 'Win 2 bouts.', stat: 'win', goal: 2, coin: 70, respect: 10 }
  ];
  const BY = {}; G.CONTRACTS.forEach(c => BY[c.id] = c);
  const pay = (st, c) => { const k = 1 + G.rankOf(st.respect) * 0.25; return { coin: Math.round(c.coin * k), respect: Math.round(c.respect * k) }; };
  const offers = st => { if (!st.offers || st.offers.length < 3 || st.offers.some(id => !BY[id])) { const pool = G.CONTRACTS.map(c => c.id).sort(() => Math.random() - 0.5); st.offers = pool.slice(0, 3); } return st.offers.map(id => BY[id]); };
  const prog = (st, c) => Math.max(0, Math.min(c.goal, stat(st, c.stat) - (st.contract ? st.contract.base : 0)));
  G.contract = { active: st => st.contract && BY[st.contract.id] ? BY[st.contract.id] : null, prog };
  // called after a bout: pays out a finished contract and returns what to tell the player
  G.contract.settle = function () {
    const st = G.state, c = G.contract.active(st); if (!c || prog(st, c) < c.goal) return null;
    const p = pay(st, c); st.coin += p.coin; st.respect += p.respect; st.contract = null; st.offers = null; st.contractsDone = (st.contractsDone || 0) + 1; G.save();
    return { c, p };
  };
  ui.board = function (line) {
    const st = G.state, cur = G.contract.active(st);
    let h = '<div class="card"><h2>The Notice Board</h2><p class="dim">Paper nailed over paper. Somebody always wants something done in the pit, and will pay to watch it. ' + (st.contractsDone ? '<b>' + st.contractsDone + '</b> contracts honoured.' : 'Take one down and it is yours until it is done.') + '</p>' + (line ? '<p class="rankup">' + line + '</p>' : '');
    if (cur) { const p = pay(st, cur), n = prog(st, cur);
      h += '<h3>Your contract</h3><div class="ab-row deeddone"><div class="ab-ic pas">✉</div><div class="ab-tx"><b>' + cur.name + '</b><small>' + n + ' / ' + cur.goal + ' · posted by ' + cur.by + '</small><p>' + cur.desc + ' Pays <b>' + p.coin + ' coin</b> and <b>' + p.respect + ' respect</b>.</p><div class="bar xp"><i style="width:' + (n / cur.goal * 100) + '%"></i></div></div><button id="drop">Tear it up</button></div>';
    } else { h += '<h3>Posted today</h3>'; offers(st).forEach(c => { const p = pay(st, c); h += '<div class="ab-row"><div class="ab-ic pas">✉</div><div class="ab-tx"><b>' + c.name + '</b><small>Posted by ' + c.by + '</small><p>' + c.desc + ' Pays <b>' + p.coin + ' coin</b> and <b>' + p.respect + ' respect</b>.</p></div><button class="big" data-take="' + c.id + '">Take it</button></div>'; }); }
    h += '<h3>Also pinned here</h3><div class="ab-row"><div class="ab-ic pas">❦</div><div class="ab-tx"><b>The Guild Codex</b><p>Everything known about the Undercity, the pit and the throne above it.</p></div><button id="cx">Read</button></div>' +
      '<div class="ab-row"><div class="ab-ic pas">♛</div><div class="ab-tx"><b>Win streak: ' + (st.streak || 0) + '</b><p>Every win in a row adds 5% to the purse, up to 25%. One loss and the crowd forgets.</p></div></div>' +
      '<div class="row end"><button class="big" id="x">Step away</button></div></div>';
    show(h);
    on('#x', () => { ui.close(); ui.topbar(); }); on('#cx', () => ui.codex());
    on('[data-take]', el => { const c = BY[el.dataset.take]; st.contract = { id: c.id, base: stat(st, c.stat) }; G.save(); G.sfx('page'); ui.board('You pull it off the nail. ' + c.by + ' will know.'); });
    on('#drop', () => { st.contract = null; G.save(); G.sfx('page'); ui.board('Torn up. No hard feelings, the paper says, in smaller writing.'); });
  };
  // results: streak purse and contract payout
  const res0 = ui.results;
  ui.results = function (r) {
    const st = G.state; let extra = [];
    if (r.win && !r.forfeit) { st.streak = (st.streak || 0) + 1; const b = Math.round((r.coin || 0) * Math.min(0.25, (st.streak - 1) * 0.05)); if (b > 0) { st.coin += b; extra.push('Win streak of ' + st.streak + ': <b>+' + b + ' coin</b> from the crowd.'); } }
    else st.streak = 0;
    const done = G.contract.settle(); if (done) extra.push('Contract honoured: <b>' + done.c.name + '</b>. +' + done.p.coin + ' coin, +' + done.p.respect + ' respect.');
    G.save(); res0.apply(this, arguments);
    const end = document.querySelector('#panel .card.res .row.end'); if (end) extra.forEach(t => { const p = document.createElement('p'); p.className = 'rankup'; p.innerHTML = t; end.parentNode.insertBefore(p, end); });
    if (done) G.sfx('coin');
  };
  // tell the objective line about an open contract
  const obj0 = G.objective;
  G.objective = function () { const st = G.state, c = st.hero && G.contract.active(st), base = obj0.apply(this, arguments); return c && G.scene === 'hub' ? base + '  ·  Contract: ' + c.desc.replace(/\.$/, '') + ' (' + prog(st, c) + '/' + c.goal + ')' : base; };
})();
