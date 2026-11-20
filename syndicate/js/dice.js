// Guttercrown — Sir Dedrick III's dice ring. The wispdice are played in the market, not in a card: he stands in a ring of
// glass plinths, throws every die himself, one at a time, and they land showing their faces. A slim bar does the rest.
(function () {
  'use strict';
  const G = window.G, T = THREE, W = G.world, gfx = G.gfx, ui = G.ui;
  const NAME = 'Sir Dedrick III', C = { x: 25.6, z: 9.4 }, R = 1.55, DS = 0.3;
  const d6 = () => 1 + Math.floor(Math.random() * 6), pick = a => a[Math.floor(Math.random() * a.length)];
  const D = G.dice = { on: false };
  const LOOK = { cls: 'cleric', race: 'human', tint: { cloth: '#26204a', armor: '#3a3060', armor2: '#1c1830', trim: '#f0c95a', hair: '#d8d4cc', legs: '#1c1830' }, cos: { head: 'widehat', back: 'greatcloak' }, scale: 0.98 };
  const LINES = {
    hello: ['Sir Dedrick the Third, at your service and at your expense. Choose a game.', 'Ah. Another brave purse. Sit, sit. Well. Stand. There are no chairs.', 'The dice are honest. I am merely charming. Pick your game.'],
    bust: ['Over. Dreadful luck. I shall treasure it.', 'Bust! My grandfather would have wept. With joy.', 'Too many. The light giveth and so on.'],
    win: ['Well rolled. I hate it. Here is your coin.', 'You win. I shall be gracious about it later, in private.', 'Splendid. Do it again so I can win it back.'],
    lose: ['The house prevails, as houses do.', 'Mine. Thank you ever so.', 'Unlucky. Lucky for me, which is the important bit.'],
    push: ['A draw. Your stake back, and my respect, which is worth less.', 'Even. Nobody is happy. Perfect.'],
    dead: ['DEAD ON. Triple! I shall need a moment.', 'Exactly the number. Triple, curse you.'],
    roll: ['Another?', 'And one more…', 'The light is warm tonight.', 'Steady hands.'],
    broke: ['Your purse is empty, friend. Come back heavier.']
  };
  const GAMES = {
    t13: { name: 'Thirteen', desc: 'Roll one die at a time. Stand close to 13; I have to beat you. A dead 13 pays triple.', target: 13, stand: 10 },
    t21: { name: 'Twenty-One', desc: 'The long game: the same, to 21. A dead 21 pays triple.', target: 21, stand: 17 },
    poker: { name: 'Poker Bones', desc: 'Five dice each. Tap dice to hold them, throw the rest once. Best hand wins.' },
    bones: { name: 'High Bones', desc: 'Two dice each, highest total wins. Press once: double the stake and rethrow your worst.' }
  };

  // ---------------------------------------------------------------- the dice, the plinths and the man
  const faceTex = (() => { const cache = {}; const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
    return (n, col) => { const k = n + col; if (cache[k]) return cache[k]; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.fillStyle = col; x.fillRect(0, 0, 64, 64); x.strokeStyle = 'rgba(255,255,255,0.65)'; x.lineWidth = 4; x.strokeRect(3, 3, 58, 58);
      x.fillStyle = '#140c22'; PIPS[n].forEach(i => { x.beginPath(); x.arc(14 + (i % 3) * 18, 14 + Math.floor(i / 3) * 18, 6, 0, 6.2832); x.fill(); }); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return (cache[k] = t); }; })();
  // box faces: +x, -x, +y, -y, +z, -z show 3, 4, 1, 6, 2, 5; the rotation that brings each value to the top
  const FACE = [3, 4, 1, 6, 2, 5], UP = { 1: [0, 0], 6: [Math.PI, 0], 2: [-Math.PI / 2, 0], 5: [Math.PI / 2, 0], 3: [0, Math.PI / 2], 4: [0, -Math.PI / 2] };
  const mkDie = col => { const mats = FACE.map(n => new T.MeshLambertMaterial({ map: faceTex(n, col), emissive: new T.Color(col), emissiveIntensity: 0.35 })); const g = new T.Group(), m = new T.Mesh(new T.BoxGeometry(DS, DS, DS), mats); m.castShadow = true; g.add(m); g.userData.m = m; return g; };
  let built = null;
  function build(hub) {
    if (built && built.scene === hub.scene) return built; const s = hub.scene, grp = new T.Group(); grp.position.set(C.x, 0, C.z); s.add(grp);
    const stone = new T.MeshLambertMaterial({ color: 0x2a2436 }), glass = new T.MeshBasicMaterial({ color: 0x9a8aff, transparent: true, opacity: 0.35, depthWrite: false, blending: T.AdditiveBlending });
    const floor = new T.Mesh(new T.CircleGeometry(R + 0.55, 40), new T.MeshLambertMaterial({ color: 0x1c1826 })); floor.rotation.x = -Math.PI / 2; floor.position.y = 0.012; floor.receiveShadow = true; grp.add(floor);
    const rim = new T.Mesh(new T.RingGeometry(R + 0.45, R + 0.55, 48), new T.MeshBasicMaterial({ color: 0xf0c95a, transparent: true, opacity: 0.55 })); rim.rotation.x = -Math.PI / 2; rim.position.y = 0.02; grp.add(rim);
    const slots = []; for (let i = 0; i < 16; i++) { const yours = i < 8, j = yours ? i : i - 8, a = yours ? (0.25 + j * (2.64 / 7)) : (Math.PI + 0.25 + j * (2.64 / 7)), x = Math.cos(a) * R, z = Math.sin(a) * R;
      const p = new T.Mesh(new T.CylinderGeometry(0.2, 0.24, 0.1, 10), stone); p.position.set(x, 0.05, z); grp.add(p); const gl = new T.Mesh(new T.RingGeometry(0.17, 0.23, 20), glass.clone()); gl.rotation.x = -Math.PI / 2; gl.position.set(x, 0.105, z); grp.add(gl); slots.push({ x, z, gl }); }
    const man = G.makeChar(LOOK); man.root.position.set(0, 0, -0.15); man.root.rotation.y = 0; grp.add(man.root);
    const L = new T.PointLight(0xb0a0ff, 6, 6, 1.6); L.position.set(0, 2.4, 0.4); grp.add(L);
    return (built = { scene: s, grp, slots, man, L, dice: [] });
  }
  const bh0 = W.buildHub;
  W.buildHub = function () { const h = bh0.apply(this, arguments); built = null; const b = build(h);
    const sp = h.spots.find(q => q.label === 'The Wisp Table'); if (sp) { sp.label = NAME + ' · Wispdice'; sp.x = C.x; sp.z = C.z + R + 0.9; sp.r = 1.6; sp.y = 3.0; sp.go = () => G.ui.wisp(); }
    const up0 = h.update; h.update = function (t, dt) { up0.apply(this, arguments); step(t, dt || 1 / 60); };
    return h; };

  // ---------------------------------------------------------------- throwing
  let flights = [], waitT = 0, queue = [];
  function clearDice() { const b = built; if (!b) return; b.dice.forEach(d => d.parent && d.parent.remove(d)); b.dice = []; flights = []; b.slots.forEach(s => s.gl.material.opacity = 0.35); }
  // throw a die to slot i, landing on value v; the man throws, it lands, then cb()
  function toss(i, v, yours, cb) { const b = built, sl = b.slots[i], d = mkDie(yours ? '#f0d890' : '#b8a8ff'); b.grp.add(d); b.dice[i] && b.dice[i].parent && b.dice[i].parent.remove(b.dice[i]); b.dice[i] = d;
    d.position.set(0, 1.25, 0.25); flights.push({ d, sl, v, t: 0, yaw: Math.random() * 6.28, cb, spin: [3 + Math.random() * 5, 2 + Math.random() * 4] }); b.manAct = { act: 'release', cs: 'throw', t: 0 }; b.man.root.rotation.y = Math.atan2(sl.x, sl.z); G.sfx('swing'); }
  function step(t, dt) { const b = built; if (!b) return; D.t = t;
    // the man: idle, turning to face where he throws, or whoever is playing
    if (b.manAct) { b.manAct.t += dt; b.man.pose({ t, act: b.manAct.act, cs: b.manAct.cs, prog: Math.min(1, b.manAct.t / 0.35) }); if (b.manAct.t > 0.45) b.manAct = null; }
    else { const w = W.walker, want = D.on ? Math.atan2(w.x - C.x, w.z - C.z) : 0.2 * Math.sin(t * 0.4); let dd = want - b.man.root.rotation.y; dd = Math.atan2(Math.sin(dd), Math.cos(dd)); b.man.root.rotation.y += dd * Math.min(1, dt * 4); b.man.pose({ t, act: 'idle' }); }
    b.L.intensity = D.on ? 9 + Math.sin(t * 3) : 5;
    for (let k = flights.length - 1; k >= 0; k--) { const f = flights[k]; f.t += dt; const u = Math.min(1, f.t / 0.55), x = G.lerp(0, f.sl.x, u), z = G.lerp(0.25, f.sl.z, u), top = 0.1 + DS / 2;
      if (u < 1) { f.d.position.set(x, G.lerp(1.25, top, u) + Math.sin(u * Math.PI) * 0.75, z); f.d.userData.m.rotation.set(f.t * f.spin[0] * 4, 0, f.t * f.spin[1] * 4); f.d.rotation.y = f.yaw + f.t * 6; }
      else { const bt = f.t - 0.55, bo = bt < 0.22 ? Math.sin(bt / 0.22 * Math.PI) * 0.07 : 0; f.d.position.set(f.sl.x, top + bo, f.sl.z); const r = UP[f.v]; f.d.userData.m.rotation.set(r[0], 0, r[1]); f.d.rotation.y = f.yaw;
        if (!f.landed) { f.landed = 1; G.sfx('clang'); f.sl.gl.material.opacity = 0.85; gfx.burst && gfx.burst(C.x + f.sl.x, top, C.z + f.sl.z, 0xc8b8ff, 6, 1.5, 1.5); }
        if (bt > 0.25) { flights.splice(k, 1); f.cb && f.cb(); } } }
    if (!flights.length && queue.length) { waitT -= dt; if (waitT <= 0) { const q = queue.shift(); waitT = 0.12; q(); } }
    if (D.on) { const p = gfx.portrait; gfx.cine = { pos: [C.x + (p ? 1.0 : 1.9), p ? 6.6 : 5.0, C.z + (p ? 5.0 : 4.4)], look: [C.x - 0.15, 0.2, C.z + (p ? 1.5 : 1.0)], fov: p ? 58 : 46, roll: 0 }; }
  }
  const after = fn => queue.push(fn);
  const say = (k, extra) => { const ln = typeof k === 'string' && LINES[k] ? pick(LINES[k]) : k; const el = document.getElementById('dsay'); if (el) el.textContent = ln + (extra ? ' ' + extra : ''); };

  // ---------------------------------------------------------------- the bar
  let G0 = null, stake = 10, phase = 'pick', you = [], his = [], holds = [], pressed = false, rolled = 0;
  const funds = () => (G.mark && G.mark.funds ? G.mark.funds() : G.state.coin), take = v => { if (G.mark && G.mark.take) G.mark.take(v); else G.state.coin -= v; };
  const STAKES = [10, 25, 50, 100, 250];
  function bar() {
    let el = document.getElementById('dicebar'); if (!el) { el = document.createElement('div'); el.id = 'dicebar'; document.getElementById('ui').appendChild(el); }
    const gm = G0 && GAMES[G0], tot = a => a.reduce((x, y) => x + y, 0), purse = '<span class="dpurse">' + G.state.coin + ' coin' + (G.state.chits ? ' · ' + G.state.chits + ' chits' : '') + '</span>';
    let h = '<div class="dtop"><b class="dname">' + NAME + '</b>' + purse + '</div><p id="dsay"></p>';
    if (phase === 'pick') h += '<div class="dgames">' + Object.keys(GAMES).map(k => '<button data-g="' + k + '"><b>' + GAMES[k].name + '</b><small>' + GAMES[k].desc + '</small></button>').join('') + '</div><div class="drow"><button id="dleave">Leave the ring</button></div>';
    else if (phase === 'stake') h += '<p class="dgame"><b>' + gm.name + '</b> · ' + gm.desc + '</p><div class="drow"><span class="dstake">Stake</span>' + STAKES.map(v => '<button class="slot' + (v === stake ? ' sel' : '') + '" data-s="' + v + '"' + (v > funds() ? ' disabled' : '') + '>' + v + '</button>').join('') + '</div><div class="drow"><button id="dback">Other games</button><button class="big" id="dgo">Throw</button></div>';
    else { const tgt = gm.target, sY = tgt ? '<span class="dsum">You <b>' + tot(you) + '</b>' + (his.length ? ' · Sir Dedrick <b>' + tot(his) + '</b>' : '') + ' · to ' + tgt + '</span>' : G0 === 'bones' ? '<span class="dsum">You <b>' + tot(you) + '</b>' + (his.length ? ' · Sir Dedrick <b>' + tot(his) + '</b>' : '') + '</span>' : '<span class="dsum">' + (you.length ? 'You: ' + hand(you).name : '') + (his.length ? ' · Sir Dedrick: ' + hand(his).name : '') + '</span>';
      h += '<div class="drow">' + sY + '<span class="dpot">Pot ' + (stake * 2) + '</span></div>';
      if (phase === 'yours' && tgt) h += '<div class="drow"><button class="big" id="droll">Throw one</button><button id="dstand"' + (!you.length ? ' disabled' : '') + '>Stand</button></div>';
      else if (phase === 'yours' && G0 === 'poker') h += '<div class="drow dholds">' + you.map((v, i) => '<button class="slot hold' + (holds[i] ? ' sel' : '') + '" data-h="' + i + '">' + v + (holds[i] ? ' held' : '') + '</button>').join('') + '</div><div class="drow"><button class="big" id="dreroll">' + (holds.some(x => x) ? 'Throw the rest' : 'Throw all again') + '</button><button id="dstand">Keep these</button></div>';
      else if (phase === 'yours' && G0 === 'bones') h += '<div class="drow">' + (!pressed && funds() >= stake ? '<button id="dpress">Press (stake ' + stake * 2 + ')</button>' : '') + '<button class="big" id="dstand">Stand</button></div>';
      else if (phase === 'done') h += '<div class="drow"><button id="dback">Other games</button><button id="dleave">Leave</button><button class="big" id="dagain">Again</button></div>';
      else h += '<div class="drow"><span class="dwait">…</span></div>'; }
    el.innerHTML = h; el.className = 'on';
    const on = (q, f) => el.querySelectorAll(q).forEach(b => b.onclick = () => { G.audioInit && G.audioInit(); G.sfx('ui'); f(b); });
    on('[data-g]', b => { G0 = b.dataset.g; phase = 'stake'; stake = Math.min(stake, funds()) >= 10 ? stake : 10; bar(); say(G0 === 'poker' ? 'Five each. Tap to hold, as many as you like.' : G0 === 'bones' ? 'Two each. Press if you dare.' : 'Closer than me without going over.'); });
    on('[data-s]', b => { stake = +b.dataset.s; bar(); }); on('#dback', () => { clearDice(); phase = 'pick'; bar(); say('hello'); }); on('#dleave', () => D.leave()); on('#dgo', start); on('#dagain', () => { clearDice(); phase = 'stake'; bar(); start(); });
    on('#droll', () => { phase = 'wait'; bar(); const v = d6(); you.push(v); toss(you.length - 1, v, true, () => { const s = tot(you); if (s > GAMES[G0].target) { settle(-1, 'bust'); } else if (s === GAMES[G0].target || you.length >= 8) { dealer(); } else { phase = 'yours'; bar(); say('roll'); } }); });
    on('#dstand', () => { phase = 'wait'; bar(); dealer(); });
    on('[data-h]', b => { const i = +b.dataset.h; holds[i] = !holds[i]; built.slots[i].gl.material.opacity = holds[i] ? 1 : 0.85; built.dice[i] && built.dice[i].userData.m.material.forEach(m => m.emissiveIntensity = holds[i] ? 0.9 : 0.35); bar(); });
    on('#dreroll', () => { phase = 'wait'; bar(); you.forEach((v, i) => { if (holds[i]) return; after(() => { const nv = d6(); you[i] = nv; toss(i, nv, true, null); }); }); after(() => { rolled = 1; dealer(); }); });
    on('#dpress', () => { take(stake); stake *= 2; pressed = true; ui.topbar(); phase = 'wait'; bar(); const i = you[0] <= you[1] ? 0 : 1; const nv = d6(); you[i] = nv; toss(i, nv, true, () => { phase = 'yours'; bar(); say('Pressing. How exciting for both of us.'); }); });
  }
  function start() { if (stake > funds()) { say('broke'); return; } take(stake); G.save(); ui.topbar(); clearDice(); you = []; his = []; holds = []; pressed = false; rolled = 0; phase = 'wait'; bar(); G.sfx('place');
    if (GAMES[G0].target) { phase = 'yours'; bar(); say('Your throw. One at a time.'); return; }
    const n = G0 === 'poker' ? 5 : 2; for (let i = 0; i < n; i++) { const v = d6(); you.push(v); after(() => toss(i, v, true, null)); }
    after(() => { phase = 'yours'; bar(); say(G0 === 'poker' ? 'Tap the dice to keep, then throw the rest.' : 'Stand, or press your luck.'); }); }
  function dealer() { const gm = GAMES[G0], tot = a => a.reduce((x, y) => x + y, 0);
    if (gm.target) { const ys = tot(you); const go = () => { const hs = tot(his); if (hs > gm.target) return settle(1, 'win'); if (hs > ys || (hs >= gm.stand && hs >= ys) || his.length >= 8) return settle(hs > ys ? -1 : hs === ys ? 0 : 1); const v = d6(); his.push(v); toss(8 + his.length - 1, v, false, () => { bar(); go(); }); }; say('My turn.'); go(); return; }
    const n = G0 === 'poker' ? 5 : 2; for (let i = 0; i < n; i++) { const v = d6(); his.push(v); after(() => toss(8 + i, v, false, () => bar())); }
    after(() => { if (G0 === 'poker') { const a = hand(you), b2 = hand(his); settle(a.score > b2.score ? 1 : a.score < b2.score ? -1 : 0); } else { const a = tot(you), b2 = tot(his); settle(a > b2 ? 1 : -1); } }); }
  function settle(r, line) { const gm = GAMES[G0], tot = a => a.reduce((x, y) => x + y, 0); let pay = 0, k = line || (r > 0 ? 'win' : r < 0 ? 'lose' : 'push');
    if (r > 0) { pay = stake * 2; if (gm.target && tot(you) === gm.target) { pay = stake * 3; k = 'dead'; } } else if (r === 0) pay = stake;
    G.state.coin += pay; G.save(); ui.topbar(); G.sfx(r > 0 ? 'coin' : r < 0 ? 'deny' : 'page'); phase = 'done'; bar(); say(k, pay ? '(+' + pay + ' coin)' : ''); if (r > 0 && built) gfx.burst && gfx.burst(C.x, 1.4, C.z + 0.8, 0xf0c95a, 30, 4, 3); }
  // poker hands, highest first
  function hand(a) { const c = {}; a.forEach(v => c[v] = (c[v] || 0) + 1); const n = Object.values(c).sort((x, y) => y - x), s = a.slice().sort().join(''), hi = Math.max(...a), sum = a.reduce((x, y) => x + y, 0);
    const R0 = n[0] === 5 ? [8, 'Five of a kind'] : n[0] === 4 ? [7, 'Four of a kind'] : n[0] === 3 && n[1] === 2 ? [6, 'Full house'] : (s === '12345' || s === '23456') ? [5, 'Straight'] : n[0] === 3 ? [4, 'Three of a kind'] : n[0] === 2 && n[1] === 2 ? [3, 'Two pair'] : n[0] === 2 ? [2, 'A pair'] : [1, 'Nothing, high ' + hi];
    return { name: R0[1], score: R0[0] * 100 + sum }; }

  // ---------------------------------------------------------------- stepping in and out
  D.open = function (game) { const st = G.state; if (!st || !st.hero) return; ui.close(); if (G.talk) return; if (!built) build(W.get('hub'));
    D.on = true; G.dicing = true; document.getElementById('ui').classList.add('dicing'); const w = W.walker; w.target = null; w.path = null; w.x = C.x - R - 0.75; w.z = C.z + 0.55; w.face = Math.atan2(C.x - w.x, C.z - w.z);
    clearDice(); G0 = game || null; phase = game ? 'stake' : 'pick'; bar(); say(game ? 'High Bones? A classic. Stake?' : 'hello'); G.sfx('ui'); };
  D.leave = function () { D.on = false; G.dicing = false; clearDice(); queue.length = 0; gfx.cine = null; const el = document.getElementById('dicebar'); if (el) el.remove(); document.getElementById('ui').classList.remove('dicing'); ui.topbar(); };
  D.name = NAME;
  // the Wisp Table menu and Marc's High Bones now send you to the ring
  const gated = ui.wisp;
  ui.wisp = function (line) { const st = G.state; if (G.unlocked && (!G.unlocked('wisp') || !(st.seen || {}).wisp)) return gated.apply(this, arguments); if ((G.state.chits || 0) + G.state.coin < 10) { ui.toast(NAME + ': “Your purse is empty, friend. Come back heavier.”'); return; } D.open(); };
  const bones0 = ui.bones; ui.bones = function () { D.open('bones'); };
  // leaving the market or opening anything else ends the session
  setInterval(() => { if (D.on && (G.scene !== 'hub' || G.talk)) D.leave(); }, 300);
  if (G.LORE) G.LORE.push({ sec: 'People', title: NAME, unlock: st => !!(st.seen || {}).wisp, body: 'Third of his name, first of his family to work for a living, and he would like you to know the first two never did. He keeps the wispdice ring behind Marc’s table: sixteen glass plinths, one honest man in a very good hat, and dice made of marsh-light that cannot be loaded. He throws every die himself. He says it is tradition. Marc says it is because nobody can be trusted with them. Both are true.' });
})();
