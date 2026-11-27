// Guttercrown — the Knuckle Table: arm-wrestling on Tallow Row, for coin, between bouts.
(function () {
  'use strict';
  window.G.LOOKDEF = window.G.LOOKDEF || {}; window.G.LOOKDEF['knuckle-fighter'] = { id: 'knuckle-fighter', cls: 'fighter', race: 'halforc', tint: { cloth: '#5a4a3a', armor: '#4a3a2a', armor2: '#2e2418' } };       // in the asset registry: see assets/REGISTRY.md
  const G = window.G, ui = G.ui, T = THREE, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), pick = a => a[Math.floor(Math.random() * a.length)];
  const WHO = [['Big Annic', 'who carries barrels for a living', 0], ['Tolly Greaves', 'a gate-man on his night off', 1], ['Mother Hesk', 'who has never lost at this table', 2], ['The Smelter', 'whose forearms have their own names', 3]];
  const SAY = { win: ['“Hah. All right. ALL right. Do not tell the gate-men.”', '“Again. No. My wrist says no. Take your coin.”', '“You have done this before. Nobody is that rude by accident.”'], lose: ['“Soft hands. Pit hands, but soft.”', '“Come back when you have eaten something.”', '“That is the rent paid. Kind of you.”'] };
  let iv = null;
  const stop = () => { if (iv) { clearInterval(iv); iv = null; } };
  const left = st => 3 - ((st.knk && st.knk.b === (st.boutN || 0)) ? st.knk.n : 0);
  ui.knuckle = function () {
    stop(); const st = G.state, h = st.hero, n = left(st), tier = Math.min(3, G.rankOf(st.respect) >> 1), w = WHO[Math.min(3, tier + (Math.random() < 0.3 ? 1 : 0))];
    show('<div class="card small"><small class="over">Tallow Row</small><h2>The Knuckle Table</h2><p class="dim">An upturned barrel, two stools, and a queue of people who think they are strong. Elbows down. First to the wood.</p>' +
      '<p class="quote">' + w[0] + ', ' + w[1] + ', is sitting down opposite.</p><p class="note">Stop the mark in the <b>green</b> to heave; the <b>gold</b> middle heaves twice as hard. Miss and you give ground. They pull the whole time. Your Strength widens the green.</p>' +
      (n > 0 ? '<div class="slots">' + [10, 25, 60].map(v => '<button class="slot" data-st="' + v + '"' + (st.coin < v ? ' disabled' : '') + '>Stake ' + v + '</button>').join('') + '<button class="slot" data-st="0">For nothing</button></div><p class="dim">' + n + ' bout' + (n === 1 ? '' : 's') + ' left at the table before your arm needs a real fight to recover.</p>' : '<p class="note">Your arm is done. Fight in the pit, then come back.</p>') +
      '<div class="row end"><button class="big" id="x">Leave</button></div></div>');
    on('#x', () => { stop(); ui.close(); ui.topbar(); });
    on('[data-st]', el => play(+el.dataset.st, w));
  };
  function play(stake, w) {
    const st = G.state, h = st.hero, str = G.mod ? G.mod(h.stats.str) : 0, zone = Math.max(0.14, Math.min(0.34, 0.2 + str * 0.022 - w[2] * 0.015)), z0 = 0.5 - zone / 2;
    if (stake > st.coin) return; st.coin -= stake; st.knk = { b: st.boutN || 0, n: (st.knk && st.knk.b === (st.boutN || 0) ? st.knk.n : 0) + 1 }; G.save(); ui.topbar();
    let pos = 0, p = 0, dir = 1, sp = 0.9 + w[2] * 0.18, pull = 0, over = false, last = performance.now();
    show('<div class="card small"><h2>' + w[0] + '</h2><div class="knk-arm" id="ka"></div><div class="knk-bar"><div class="knk-zone" style="left:' + (z0 * 100) + '%;width:' + (zone * 100) + '%"><i></i></div><div class="knk-mark" id="km"></div></div><p class="dim" id="kt">Elbows down.</p><button class="big knk-go" id="hv">Heave</button></div>');
    const arm = () => { const el = document.getElementById('ka'); if (el) el.innerHTML = [-3, -2, -1, 0, 1, 2, 3].map(i => '<span class="' + (i === 0 ? 'mid ' : '') + (pos > 0 && i > 0 && i <= pos ? 'you' : pos < 0 && i < 0 && i >= pos ? 'them' : '') + '"></span>').join(''); };
    const say = s => { const el = document.getElementById('kt'); if (el) el.textContent = s; };
    const end = win => { if (over) return; over = true; stop(); let got = ''; if (win) { const pay = stake * 2; st.coin += pay; st.respect += stake ? 2 : 1; got = (stake ? '+' + pay + ' coin · ' : '') + '+' + (stake ? 2 : 1) + ' respect'; G.sfx('coin'); } else { got = stake ? stake + ' coin gone' : 'Nothing lost but pride'; G.sfx('hit'); } G.save(); ui.topbar();
      show('<div class="card small"><h2>' + (win ? 'To the Wood' : 'Pinned') + '</h2><p class="quote">' + pick(SAY[win ? 'win' : 'lose']) + '</p><p class="note">' + got + '</p><div class="row end"><button id="ag">Again</button><button class="big" id="x">Leave</button></div></div>'); on('#x', () => { ui.close(); ui.topbar(); }); on('#ag', () => ui.knuckle()); };
    arm();
    on('#hv', () => { if (over) return; const d = Math.abs(p - 0.5); if (d < zone * 0.07 + 0.012) { pos += 2; say('A proper heave. They felt that.'); G.sfx('crit'); } else if (d < zone / 2) { pos += 1; say('Good. Hold it there.'); G.sfx('hit'); } else { pos -= 1; say('Mistimed. They take a hand’s width.'); G.sfx('ui'); } pos = Math.max(-3, Math.min(3, pos)); sp += 0.1; arm(); if (pos >= 3) end(true); else if (pos <= -3) end(false); });
    iv = setInterval(() => { if (over || !document.getElementById('km')) return stop(); const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now; p += dir * sp * dt; if (p > 1) { p = 1; dir = -1; } if (p < 0) { p = 0; dir = 1; } document.getElementById('km').style.left = (p * 100) + '%';
      pull += dt; if (pull > 2.6 - w[2] * 0.25) { pull = 0; pos = Math.max(-3, pos - 1); say(w[0].split(' ')[0] + ' leans in.'); arm(); if (pos <= -3) end(false); } }, 16);
  }
  // the table itself, in the alley
  const hub0 = G.world.buildHub;
  G.world.buildHub = function () { const h = hub0.apply(this, arguments), s = h.scene, gfx = G.gfx, wood = gfx.lambert(0x6a4a2c), X = -8.6, Z = 20.75;
    gfx.mesh(new T.CylinderGeometry(0.42, 0.38, 0.85, 10), wood, X, 0.42, Z, s); gfx.mesh(new T.CylinderGeometry(0.46, 0.46, 0.06, 10), gfx.lambert(0x3a2616), X, 0.87, Z, s); [-0.8, 0.8].forEach(dx => gfx.mesh(new T.CylinderGeometry(0.2, 0.2, 0.45, 8), wood, X + dx, 0.22, Z, s));
    const c = G.makeChar(G.LOOKDEF['knuckle-fighter']); c.root.position.set(X + 0.8, -0.28, Z); c.root.rotation.y = -1.57; s.add(c.root); const up0 = h.update; h.update = function (t) { up0.apply(this, arguments); c.pose({ t: t + 3, act: 'sit' }); };
    h.spots.push({ x: X - 0.2, z: Z - 1.1, r: 1.4, y: 2.4, label: 'The Knuckle Table', act: 'Arm-wrestle', go: () => ui.knuckle(), badge: () => !G.state.knk && (G.state.boutN || 0) >= 1 });
    return h; };
  const close0 = ui.close; ui.close = function () { stop(); return close0.apply(this, arguments); };
  if (G.LORE) G.LORE.push({ sec: 'The World', title: 'The Knuckle Table', unlock: st => !!st.knk, body: 'Halfway down Tallow Row there is a barrel with a board on it that has been there longer than the houses. Nobody owns it. The rule is elbows down, first to the wood, and whoever loses buys or pays. Gate-men, smelters and barrel-carriers sit at it most nights, and so do pit-fighters who ought to be resting the arm. Mother Hesk has never lost at it. She is seventy-one.' });
})();
