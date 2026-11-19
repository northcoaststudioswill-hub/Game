// Guttercrown — the ending, filmed. When the Queen falls you sit down, and the camera shows what that cost and who noticed:
// the throne, whoever is standing behind it, the market, Tallow Row, the pit. Which lines you get depends on how you climbed.
(function () {
  'use strict';
  const G = window.G, T = THREE, ui = G.ui, gfx = G.gfx, W = G.world;
  const lerp = (p, q, u) => p + (q - p) * u, V = (p, q, u) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u), lerp(p[2], q[2], u)];
  const DAVID = 'David Roseinbeirg', MARC = 'Marc dé Fleuprau';
  const F = G.finale = { on: false };

  const TITLES = { vessel: 'The Vessel', ash: 'The Ash Throne', free: 'Paid in Full', alone: 'From the Bottom' };
  // what the throne room looks like for each way of getting there
  const SEAT = {
    vessel: ['The white throne is cold. You have barely drawn breath when a hand comes down on your shoulder, heavy with rings.', [DAVID, 'GOOD dog. Oh, look at you up there. Do not get comfortable, meat. You sit. I decide. That was always the arrangement.']],
    ash: ['The white throne is cold, and from its window you can see smoke over the outlands. Some of it is old. Some of it is yours.', ['', 'You owe the man in the cellar nothing. It is the first time you have seen him afraid. In Fenrow and Low Barrow they have a word for you, and they are teaching it to their children.']],
    free: ['The white throne is cold. A hand is already out beside it, palm up, rings and all.', [DAVID, 'Mine. …What is this? Paid? PAID? You counted them BACK to me? You jumped-up cellar rat, do you know what you have cost me?']],
    alone: ['The white throne is cold, and there is pit sand on it now. No patron stands behind it. No contract. No cellar full of clocks.', ['', 'You came up the Long Stair because it was there and nobody had said you could not. Somewhere under the sewers a man in a gold room is screaming at a wall.']] };

  function lines(st, k) {
    const h = st.hero, fallen = (st.fallen || []).length, owedM = st.loanM || 0, gardens = st.gardens || 0, deaths = st.deaths || 0, out = [];
    out.push({ shot: 'wide', t: 'Nine hundred steps of white stone. At the top, a hall with nobody left in it to tell you no.' });
    out.push({ shot: 'seat', t: SEAT[k][0] });
    out.push({ shot: k, n: SEAT[k][1][0], t: SEAT[k][1][1] });
    out.push({ shot: 'market', t: 'Below, the market opens as it always has. The Ledger-Keeper rules a single line through your name' + (fallen ? ', and beside it leaves the ' + fallen + ' name' + (fallen === 1 ? '' : 's') + ' the pit finished by your hand.' : '. The margin beside it is empty. That has not happened before.') });
    out.push({ shot: 'marc', n: MARC, t: owedM > 0 ? 'A monarch! And one who still owes me ' + owedM + ' coin. I am prepared to be reasonable. I am not prepared to be forgotten.' : st.marcTilt ? 'I taught that one everything. Everything! Write it down. And put the odds up, they will believe anything today.' : 'From my table to the throne. I had money on it. I have money on how long it lasts, too. Do not look at me like that.' });
    out.push({ shot: 'row', t: 'On Tallow Row the last door stays locked. The neighbours leave supper cooling on your sill anyway, in case.' });
    out.push({ shot: 'pit', t: (gardens ? (gardens === 1 ? 'Once' : gardens + ' times') + ' you walked into the Hour Garden unsigned and walked out again. ' : deaths ? 'You died ' + deaths + ' time' + (deaths === 1 ? '' : 's') + ' on that sand and it did not hold. ' : 'You never once died on that sand. ') + 'The names behind the nine gates have already changed. Somebody down there is looking at the stair.' });
    return out;
  }
  const CAM = {
    wide: [[[0.6, 1.0, 13.5], [0, 2.0, -0.4]], [[-0.2, 1.5, 8.2], [0, 1.9, -0.4]], 42],
    seat: [[[-3.6, 1.9, 4.2], [-0.95, 0.75, -0.1]], [[-2.8, 2.0, 3.3], [-0.95, 0.8, -0.1]], 40],
    vessel: [[[0.3, 1.7, 4.0], [-1.4, 0.95, -0.3]], [[-0.2, 1.9, 3.5], [-1.45, 1.0, -0.3]], 42],
    ash: [[[-2.6, 2.2, 3.2], [-0.95, 0.8, -0.1]], [[-1.2, 2.9, 5.2], [-0.95, 0.7, -0.1]], 42],
    free: [[[-2.2, 2.6, 2.4], [0.3, 0.2, 8]], [[-2.4, 2.9, 2.0], [0.3, 0.1, 10.5]], 40],
    alone: [[[-0.95, 1.6, 4.6], [-0.95, 0.9, -0.1]], [[-0.95, 3.6, 7.8], [-0.95, 0.5, -0.1]], 40],
    market: [[[24, 11, 19], [13, 0.8, 6]], [[21, 9, 16], [13, 0.8, 5]], 46],
    marc: [[[22.4, 2.7, 5.4], [25.7, 1.25, -0.1]], [[24.0, 3.0, 3.5], [25.7, 1.15, -0.1]], 44],
    row: [[[-2.2, 3.3, 24.9], [-5.6, 1.9, 17.6]], [[-4.6, 2.8, 24.3], [-9.6, 1.7, 18.3]], 50],
    pit: [[[6.5, 2.2, 6.5], [0, 0.8, 0]], [[9.5, 6.5, 9.5], [0, 0.4, 0]], 50] };

  F.play = function (k, done) {
    const st = G.state; if (!TITLES[k]) k = 'alone';
    ui.close(); if (ui.leaveHub) ui.leaveHub(); if (G.fight.exStop && !G.fight.active) G.fight.exStop();
    const hall = G.cine.throneStage(), hub = W.get('hub'), arena = W.get('arena'); hall.cineWall(true);
    if (G.titleChars) G.titleChars.forEach(c => c.root.visible = false); if (W.walker.char) W.walker.char.root.visible = false;
    G.scene = 'cine'; ui.topbar(); F.on = true;
    // you, crowned; and him, if he has a claim on you
    const look = Object.assign({}, G.lookOf(st.hero, st)); look.cos = Object.assign({}, look.cos, { head: 'crown' });
    const me = G.makeChar(look); hall.scene.add(me.root);
    const dv = (k === 'vessel' || k === 'free') ? G.makeChar(G.oracle && G.oracle.look ? G.oracle.look() : { cls: 'sorcerer', race: 'human', cos: { head: 'widehat', back: 'greatcloak' } }) : null; if (dv) hall.scene.add(dv.root);
    const glow = new T.PointLight(k === 'ash' ? 0xff5030 : k === 'vessel' ? 0xf0c95a : 0xfff0d0, 0, 12, 1.4); glow.position.set(-0.95, 3.2, 1.6); hall.scene.add(glow);
    const SH = lines(st, k), el = document.createElement('div'); el.id = 'talk'; el.className = 'finale';
    el.innerHTML = '<div class="c-bar top"></div><div class="fin-card"><small>Guttercrown</small><h1></h1></div><div class="tk-box"><b class="tk-name"></b><p class="tk-text"></p><span class="tk-hint"></span></div><button class="c-skip mini">Skip</button>';
    document.getElementById('ui').appendChild(el); document.getElementById('ui').classList.add('talking');
    let i = -1, t0 = 0, shown = 0, over = false, card = 0;
    const place = shot => {
      const inHall = !(shot === 'market' || shot === 'marc' || shot === 'row' || shot === 'pit');
      gfx.setScene(inHall ? hall.scene : shot === 'pit' ? arena.scene : hub.scene);
      if (shot === 'pit') { if (arena.garden && arena.inGarden && arena.inGarden()) arena.garden(false); arena.setHype(0); if (arena.remains) arena.remains(4); }
      if (shot === 'wide') { me.root.position.set(0, 0, 4.2); me.root.rotation.y = Math.PI; }
      else if (inHall) { me.root.position.set(-0.95, 0.65, -0.1); me.root.rotation.y = 0; }
      if (dv) { dv.root.visible = shot === 'vessel' || shot === 'free'; if (shot === 'vessel') { dv.root.position.set(-1.95, 0.65, -0.35); dv.root.rotation.y = 0.5; } if (shot === 'free') { dv.root.position.set(0.3, 0, 7.5); dv.root.rotation.y = 0; } }
      glow.intensity = inHall && shot !== 'wide' ? 16 : 0;
      G.sfx(shot === 'wide' ? 'throne' : shot === 'vessel' ? 'laugh' : shot === 'ash' ? 'dread' : shot === 'free' || shot === 'alone' ? 'dawn' : shot === 'market' ? 'quill' : shot === 'marc' ? 'coin' : shot === 'pit' ? 'bell' : 'page');
      if (shot === 'vessel') G.sfx('dread');
    };
    const end = () => { if (over) return; over = true; F.on = false; window.removeEventListener('keydown', key, true); el.remove(); document.getElementById('ui').classList.remove('talking'); gfx.cine = null;
      hall.scene.remove(me.root); if (dv) hall.scene.remove(dv.root); hall.scene.remove(glow); hall.cineWall(false); if (gfx.veil) gfx.veil(0.4); F.step = null; done && done(); };
    const next = () => { if (card) { if (performance.now() - card > 900) end(); return; } const s = SH[i]; if (s && shown < s.t.length) { shown = s.t.length; return; }
      i++; if (i >= SH.length) { card = performance.now(); el.classList.add('fin-end'); el.querySelector('.fin-card h1').textContent = TITLES[k]; G.sfx('bell'); G.sfx(k === 'vessel' || k === 'ash' ? 'dread' : 'dawn'); return; }
      t0 = performance.now(); shown = 0; place(SH[i].shot); if (gfx.veil) gfx.veil(0.25); };
    const key = e => { if (over) return; if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') { e.preventDefault(); e.stopPropagation(); next(); } else if (e.code === 'Escape') { e.stopPropagation(); end(); } };
    window.addEventListener('keydown', key, true); el.addEventListener('pointerdown', e => { if (!e.target.closest('button')) next(); }); el.querySelector('.c-skip').onclick = end;
    let padWas = true;
    const step = () => { if (over) return; const now = performance.now() / 1000;
      if (!card) { const s = SH[i], c = CAM[s.shot], tt = (performance.now() - t0) / 1000, u = Math.min(1, tt / 10), e2 = u * u * (3 - 2 * u);
        gfx.cine = { pos: V(c[0][0], c[1][0], e2), look: V(c[0][1], c[1][1], e2), fov: gfx.portrait ? Math.min(92, c[2] * 1.5) : c[2], roll: 0 };
        const inHall = !(s.shot === 'market' || s.shot === 'marc' || s.shot === 'row' || s.shot === 'pit');
        if (inHall) { hall.update(now); if (s.shot === 'wide') { me.root.position.z = 4.2 - Math.min(1, tt / 9) * 1.6; me.pose({ t: now, act: 'idle', moving: tt < 9, walk: now * 6 }); } else me.pose({ t: now, act: 'sit', prog: 1 });
          if (dv && dv.root.visible) { if (s.shot === 'free') { dv.root.position.z = 7.5 + Math.min(1, tt / 10) * 4; dv.pose({ t: now, act: 'idle', moving: true, walk: now * 9 }); } else dv.pose({ t: now, act: Math.sin(now * 1.3) > 0.2 ? 'cheer' : 'idle', prog: (now * 0.8) % 1 }); } }
        else if (s.shot === 'pit') { if (arena.update) arena.update(now, 1 / 60); } else hub.update(now, 1 / 60);
        shown = Math.min(s.t.length, shown + 0.9); const nm = el.querySelector('.tk-name'); nm.textContent = s.n || ''; nm.className = 'tk-name ' + (s.n ? 'npc' : 'none'); el.querySelector('.tk-text').textContent = s.t.slice(0, Math.floor(shown));
        el.querySelector('.tk-hint').textContent = shown >= s.t.length ? (G.input.usingPad ? '(A) continue' : G.input.touch ? 'Tap to continue' : 'Click or Space to continue') : ''; }
      let pad = false; try { for (const p of (navigator.getGamepads ? navigator.getGamepads() : [])) if (p && p.buttons && p.buttons[0] && p.buttons[0].pressed) pad = true; } catch (er) { } if (pad && !padWas) next(); padWas = pad; };
    const loop = () => { if (over) return; step(); requestAnimationFrame(loop); };
    F.step = step; F.next = next; F.where = () => ({ i, n: SH.length, card: !!card, shot: SH[i] && SH[i].shot });
    next(); loop();
  };

  // the ending card comes after the film, and carries the tally of the whole climb
  const e0 = ui.ending;
  if (e0) ui.ending = function () {
    const st = G.state, k = !(st.signed || st.bound) ? 'alone' : (st.soulDebt || 0) > 0 ? 'vessel' : (st.terror || 0) >= 2 ? 'ash' : 'free';
    F.play(k, () => { G.scene = 'hub'; e0.call(ui); tally(); });
  };
  function tally() {
    const st = G.state, h = st.hero, card = document.querySelector('#panel .card.res'), end = card && card.querySelector('.row.end'); if (!end) return;
    const wins = Object.keys(st.wins || {}).reduce((a, id) => a + (st.wins[id] || 0), 0), d = document.createElement('div'); d.className = 'fin-tally';
    const row = (a, b) => '<span><b>' + b + '</b><i>' + a + '</i></span>';
    d.innerHTML = row('bouts won', wins) + row('names in the sand', (st.fallen || []).length) + row('deaths', st.deaths || 0) + row('gardens survived', st.gardens || 0) + row('level', h.level) + row('respect', st.respect);
    end.parentNode.insertBefore(d, end);
    try { const r = JSON.parse(localStorage.getItem('guttercrown_reigns') || '[]'); r.push(h.name + ', ' + G.CLASSES[h.cls].name + ' · ' + TITLES[st.usurper || 'alone'] + ' · ' + wins + ' bouts'); localStorage.setItem('guttercrown_reigns', JSON.stringify(r.slice(-12))); } catch (e) { }
  }
  // once it is yours, the stair lets you remember how it went
  const st0 = ui.stair;
  if (st0) ui.stair = function () {
    const r = st0.apply(this, arguments), st = G.state; if (!st.usurper) return r;
    const lock = [...document.querySelectorAll('#panel .card .lock')].find(e => e.textContent === 'Yours'); if (!lock) return r;
    const b = document.createElement('button'); b.textContent = 'Remember it'; b.onclick = () => { G.sfx('ui'); F.play(st.usurper, () => { G.scene = 'hub'; ui.hub(); }); }; lock.parentNode.replaceChild(b, lock); return r;
  };
})();
