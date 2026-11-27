// Guttercrown — the Knife Board: three knives at a painted board on Tallow Row. No buffs, no chores. Just a game.
(function () {
  'use strict';
  window.G.LOOKDEF = window.G.LOOKDEF || {}; window.G.LOOKDEF['knife-kid'] = { id: 'knife-kid', cls: 'rogue', race: 'human', tint: { cloth: '#6a4a3a', armor: '#4a3a30', hair: '#2a1c10' }, scale: 0.72 };       // in the asset registry: see assets/REGISTRY.md
  const G = window.G, ui = G.ui, T = THREE, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), pick = a => a[Math.floor(Math.random() * a.length)];
  let iv = null; const stop = () => { if (iv) { clearInterval(iv); iv = null; } };
  const RING = [[0.09, 10, 'BULL'], [0.2, 7, 'Inner'], [0.33, 4, 'Middle'], [0.47, 2, 'Outer']];
  ui.knives = function () {
    stop(); const st = G.state, best = st.knifeBest || 0, paid = st.knf && st.knf.b === (st.boutN || 0) ? st.knf.n : 0, dry = paid >= 4;
    show('<div class="card small"><small class="over">Tallow Row</small><h2>The Knife Board</h2><p class="dim">Somebody painted rings on the yard wall years ago, and somebody else has been repainting them since. Three knives. The children keep score and they do not round up.</p>' +
      '<p class="note">The sight drifts. Throw when it crosses the middle. <b>Bull 10 · inner 7 · middle 4 · outer 2.</b> Beat the mark chalked on the wall to double your stake; thirty clean pays triple. A steady hand (Dexterity) drifts less.</p>' +
      '<div class="slots">' + [10, 25, 60].map(v => '<button class="slot" data-st="' + v + '"' + (st.coin < v || dry ? ' disabled' : '') + '>Stake ' + v + '</button>').join('') + '<button class="slot" data-st="0">For fun</button></div>' + (dry ? '<p class="dim">Nobody on the Row will take your money again until you have fought. You can still throw for fun.</p>' : '') + (best ? '<p class="dim">Your best: <b>' + best + '</b> of 30.</p>' : '') +
      '<div class="row end"><button class="big" id="x">Leave</button></div></div>');
    on('#x', () => { stop(); ui.close(); ui.topbar(); }); on('[data-st]', el => play(+el.dataset.st));
  };
  function play(stake) {
    const st = G.state, h = st.hero, dex = G.mod ? G.mod(h.stats.dex) : 0, mark = Math.min(22, 11 + G.rankOf(st.respect) * 2); if (stake > st.coin) return; st.coin -= stake; if (stake) st.knf = { b: st.boutN || 0, n: (st.knf && st.knf.b === (st.boutN || 0) ? st.knf.n : 0) + 1 }; G.save(); ui.topbar();
    let n = 0, score = 0, t = Math.random() * 6, over = false, last = performance.now(), cx = 0.5, cy = 0.5; const amp = Math.max(0.2, 0.36 - dex * 0.022);
    show('<div class="card small"><h2>Three Knives</h2><p class="dim" id="kn-s">Beat <b>' + mark + '</b>. Knife 1 of 3.</p><div class="kn-board" id="kn-b"><i class="r4"></i><i class="r3"></i><i class="r2"></i><i class="r1"></i><span class="kn-x" id="kn-x"></span></div><button class="big knk-go" id="kn-t">Throw</button></div>');
    const end = () => { over = true; stop(); const win = score > mark, clean = score >= 30, pay = win ? stake * (clean ? 3 : 2) : 0; st.coin += pay; if (score > (st.knifeBest || 0)) st.knifeBest = score; st.knifeN = (st.knifeN || 0) + 1; if (win) st.respect += stake ? 2 : 0; G.save(); ui.topbar(); G.sfx(win ? 'coin' : 'ui');
      setTimeout(() => { show('<div class="card small"><h2>' + (clean ? 'Thirty Clean' : win ? 'Over the Mark' : 'Short') + '</h2><p class="quote">' + pick(win ? ['A child chalks your number on the wall and underlines it twice.', '“Do it left-handed,” says somebody. Nobody has ever done it left-handed.', 'The neighbour with the soup nods once. High praise on this street.'] : ['A child sucks air through her teeth. “My nan throws better.”', 'The knife is handed back to you handle-first, which is somehow worse.', '“The wall moved,” you say. Nobody writes that down.']) + '</p><p class="note">You threw <b>' + score + '</b> against a mark of ' + mark + '.' + (stake ? (win ? ' +' + pay + ' coin · +2 respect.' : ' ' + stake + ' coin gone.') : '') + '</p><div class="row end"><button id="ag">Again</button><button class="big" id="x">Leave</button></div></div>'); on('#x', () => { ui.close(); ui.topbar(); }); on('#ag', () => ui.knives()); }, 650); };
    on('#kn-t', () => { if (over) return; const sc = Math.max(0.006, 0.03 - dex * 0.004), x = cx + (Math.random() - 0.5) * sc, y = cy + (Math.random() - 0.5) * sc, d = Math.hypot(x - 0.5, y - 0.5), r = RING.find(q => d <= q[0]), pts = r ? r[1] : 0; score += pts; n++;
      const k = document.createElement('span'); k.className = 'kn-k'; k.style.left = (x * 100) + '%'; k.style.top = (y * 100) + '%'; document.getElementById('kn-b').appendChild(k); G.sfx(pts >= 10 ? 'crit' : pts ? 'hit' : 'clang');
      document.getElementById('kn-s').innerHTML = (r ? r[2] + ': +' + pts : 'Wall. Nothing') + ' · <b>' + score + '</b> so far · beat ' + mark + (n < 3 ? '. Knife ' + (n + 1) + ' of 3.' : '.'); if (n >= 3) end(); });
    iv = setInterval(() => { const el = document.getElementById('kn-x'); if (over || !el) return stop(); const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now; t += dt * (1.5 + n * 0.45); cx = 0.5 + Math.sin(t * 1.3) * amp; cy = 0.5 + Math.sin(t * 1.9 + 0.7) * amp * 0.85; el.style.left = (cx * 100) + '%'; el.style.top = (cy * 100) + '%'; }, 16);
  }
  const hub0 = G.world.buildHub;
  G.world.buildHub = function () { const h = hub0.apply(this, arguments), s = h.scene, gfx = G.gfx, X = -11.4, Z = 21.2;
    gfx.box(1.5, 1.7, 0.12, gfx.lambert(0x5a4028), X, 1.5, Z, s); [[0.62, 0xd8d0c0], [0.46, 0x8a1c1c], [0.3, 0xd8d0c0], [0.14, 0xf0c95a]].forEach((q, i) => { const m = new T.Mesh(new T.CircleGeometry(q[0], 20), new T.MeshBasicMaterial({ color: q[1] })); m.position.set(X, 1.55, Z - 0.07 - i * 0.004); m.rotation.y = Math.PI; s.add(m); });
    [[-0.2, 1.7], [0.3, 1.35]].forEach(q => { const k = gfx.box(0.04, 0.04, 0.34, new T.MeshPhongMaterial({ color: 0xaab2bc, shininess: 60 }), X + q[0], q[1], Z - 0.24, s); k.rotation.x = 0.2; });
    const kid = G.makeChar(G.LOOKDEF['knife-kid']); kid.root.position.set(X + 1.3, 0, Z - 0.9); kid.root.rotation.y = -2.2; s.add(kid.root); const up0 = h.update; h.update = function (t) { up0.apply(this, arguments); kid.pose({ t: t + 5, act: 'idle' }); };
    h.spots.push({ x: X, z: Z - 1.3, r: 1.4, y: 2.9, label: 'The Knife Board', act: 'Throw knives', go: () => ui.knives() }); return h; };
  const close0 = ui.close; ui.close = function () { stop(); return close0.apply(this, arguments); };
})();
