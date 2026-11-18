// Underground Syndicate — menus, HUD, and progression screens (DOM over the canvas)
(function () {
  const G = window.G, A = G.ABILITIES, esc = G.esc;
  const $ = s => document.querySelector(s);
  const ui = G.ui = {};
  const panel = () => $('#panel');

  function show(html, cls) {
    const p = panel(); p.className = cls || ''; p.innerHTML = html; p.scrollTop = 0;
    p.querySelectorAll('button,[data-click]').forEach(b => b.addEventListener('click', () => { G.audioInit(); G.sfx('ui'); }));
    return p;
  }
  ui._show = (h, c) => show(h, c); ui._on = (s, f) => on(s, f);
  ui.close = () => { const p = panel(); p.className = 'hidden'; p.innerHTML = ''; };
  ui.isOpen = () => !panel().classList.contains('hidden');
  const on = (sel, fn) => panel().querySelectorAll(sel).forEach(el => el.addEventListener('click', e => fn(el, e)));
  let toastT = 0;
  ui.toast = (s) => { const t = $('#toast'); t.textContent = s; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); };

  const abCard = (id, extra) => {
    const ab = A[id];
    return '<div class="ab-row"><div class="ab-ic">' + G.icon(ab) + '</div><div class="ab-tx"><b>' + ab.name + '</b>' +
      (ab.kind ? '<span class="tagk">' + ab.kind + '</span><span class="tagr r-' + ab.role + '">' + ab.role + '</span>' : '') +
      '<small>' + (ab.ult ? 'Ultimate · ' : '') + (ab.cost ? ab.cost + ' ' : '') + (ab.cost ? '{RES} · ' : '') + (ab.cd ? ab.cd + 's cooldown' : 'No cooldown') + '</small>' +
      '<p>' + ab.desc + '</p></div>' + (extra || '') + '</div>';
  };
  const withRes = (html, cls) => html.replace(/\{RES\}/g, G.CLASSES[cls].res);

  // ------------------------------------------------------------ top bar
  ui.topbar = function () {
    const st = G.state, h = st.hero, tb = $('#topbar');
    if (!h || (G.scene !== 'hub' && G.scene !== 'hideout')) { tb.className = 'hidden'; return; }
    const C = G.CLASSES[h.cls], rk = G.rankOf(st.respect), R = G.RANKS[rk], next = G.RANKS[rk + 1];
    const xp0 = G.XP_FOR[h.level], xp1 = G.XP_FOR[h.level + 1];
    const xpPct = xp1 ? (h.xp - xp0) / (xp1 - xp0) * 100 : 100;
    const rPct = next ? (st.respect - R.at) / (next.at - R.at) * 100 : 100;
    tb.className = '';
    tb.innerHTML =
      '<div class="tb-box tb-hero" data-go="sheet"><div class="tb-port"></div><div><b>' + esc(h.name) + '</b>' +
      '<small>Level ' + h.level + ' ' + (h.sub ? C.subs[h.sub].name + ' ' : '') + C.name + '</small>' +
      '<div class="bar xp"><i style="width:' + xpPct + '%"></i></div></div></div>' +
      '<div class="tb-box tb-rank"><small>GUILD RANK</small><b style="color:' + R.color + '">' + R.name + '</b>' +
      '<div class="bar rep"><i style="width:' + rPct + '%"></i></div><small>' + st.respect + (next ? ' / ' + next.at : '') + ' respect</small></div>' +
      '<div class="tb-box tb-coin"><span class="coin"></span><b>' + st.coin + '</b><small>coin</small><span class="pot">' + G.icon('potion') + '</span><b>' + st.potions + '</b></div>' +
      '<button class="mini" id="tbMute">' + (G.muted ? 'Sound off' : 'Sound on') + '</button>';
    tb.querySelector('.tb-port').appendChild(G.portrait(G.lookOf(h, st), 46, 1.25));
    tb.querySelector('.tb-hero').onclick = () => ui.sheet();
    $('#tbMute').onclick = () => { G.muted = !G.muted; ui.topbar(); };
  };


  // ------------------------------------------------------------ boot-up studio cards (tap, key or any pad button skips)
  ui.boot = function () {
    const el = document.createElement('div'); el.id = 'boot'; document.getElementById('ui').appendChild(el);
    const cards = [
      '<svg viewBox="0 0 120 120" class="b-mark" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="3"/><path d="M60 14 L70 56 L60 50 L50 56 Z" fill="currentColor"/><path d="M60 106 L52 64 L60 70 L68 64 Z" fill="currentColor" opacity=".45"/><path d="M22 78 q9.5 -9 19 0 t19 0 t19 0 t19 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M30 90 q7.5 -7 15 0 t15 0 t15 0 t15 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".6"/></svg><small>A game by</small><b>North Coast Studios</b>',
      '<span class="b-e" aria-hidden="true">E</span><small>with</small><b>E Concepts</b>'
    ];
    let i = -1, timer = 0, done = false;
    const finish = () => { if (done) return; done = true; clearTimeout(timer); G.bootSkip = null; el.classList.add('out'); setTimeout(() => el.remove(), 700); window.removeEventListener('keydown', skip, true); };
    const next = () => { i++; if (i >= cards.length) return finish(); el.innerHTML = '<div class="b-card">' + cards[i] + '</div><span class="b-skip">Tap to skip</span>'; timer = setTimeout(next, 2700); };
    const skip = e => { if (e && e.preventDefault && e.type !== 'keydown') e.preventDefault(); G.audioInit(); clearTimeout(timer); next(); };
    el.addEventListener('pointerdown', skip); window.addEventListener('keydown', skip, true); G.bootSkip = skip;
    next();
  };

  // ------------------------------------------------------------ title
  ui.title = function () {
    G.scene = 'title'; G.enterTitle(); ui.topbar(); $('#hud').className = 'hidden';
    const has = G.hasSave();
    show('<div class="title-wrap"><div class="logo"><svg class="crown" viewBox="0 0 120 70" aria-hidden="true"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a0"/><stop offset=".5" stop-color="#e2ad3c"/><stop offset="1" stop-color="#8a5a16"/></linearGradient></defs><path d="M8 62 L2 18 L30 40 L44 6 L60 34 L76 6 L90 40 L118 18 L112 62 Z" fill="url(#cg)" stroke="#1a1006" stroke-width="3" stroke-linejoin="round"/><path d="M8 62 h104 v6 H8z" fill="#6f4a12" stroke="#1a1006" stroke-width="3"/><path d="M52 62 l-6 -10 l8 3 l-3 -9 l9 6 l6 -8 l2 9 l7 -4 l-4 13z" fill="#1a1006" opacity=".55"/><circle cx="60" cy="48" r="6" fill="#c22a22" stroke="#1a1006" stroke-width="2.5"/><circle cx="32" cy="52" r="3.5" fill="#6ad0ff" stroke="#1a1006" stroke-width="2"/><circle cx="88" cy="52" r="3.5" fill="#6ad0ff" stroke="#1a1006" stroke-width="2"/></svg><div class="t-over">The Deep Guild presents</div><h1>Gutter<span>crown</span></h1><div class="ribbon"><span>Pit-fighters of the Undercity</span></div></div>' +
      '<div class="menu">' + (has ? '<button class="big" id="bCont">Continue</button>' : '') +
      '<button class="' + (has ? '' : 'big') + '" id="bNew">New Fighter</button><button id="bIntro">Watch the Intro</button><button id="bHow">How to Play</button></div>' +
      '<p class="t-foot">Bleed for coin. Climb the ledger. Take the crown.</p><p class="t-cred">A North Coast Studios game · with E Concepts</p></div>', 'title');
    on('#bIntro', () => G.cine.play(() => ui.title()));
    on('#bHow', () => { show('<div class="card small"><h2>How to Play</h2><p>Win pit fights for <b>XP</b>, <b>coin</b> and <b>respect</b>. Level up to shape your class. Spend coin on gear and on your hideout.</p><h3>Pit wisdom</h3><ul class="perks">' + G.TIPS.map(t => '<li>' + t + '</li>').join('') + '</ul>' + CONTROLS + '<div class="row end"><button class="big" id="x">Back</button></div></div>'); on('#x', () => ui.title()); });
    on('#bCont', () => { G.load(); ui.hub(); });
    on('#bNew', () => {
      if (has) show('<div class="card small"><h2>Start over?</h2><p>This replaces your current fighter and hideout.</p><div class="row"><button id="y" class="danger">Start over</button><button id="n">Keep my fighter</button></div></div>');
      else return G.cine.play(() => ui.create());
      on('#y', () => { G.wipe(); G.cine.play(() => ui.create()); }); on('#n', () => ui.title());
    });
  };

  // ------------------------------------------------------------ character creation
  ui.create = function () {
    G.scene = 'create'; G.enterCreate();
    const pick = G.createPick = G.createPick || { race: 'human', cls: 'fighter', name: '' };
    const render = () => {
      const C = G.CLASSES[pick.cls], R = G.RACES[pick.race], stats = G.baseStats(pick.cls, pick.race);
      let h = '<div class="card create"><h2>Who walks into the pit?</h2>';
      h += '<h3>Origin</h3><div class="chips">' + Object.keys(G.RACES).map(k => '<button class="chip' + (k === pick.race ? ' sel' : '') + '" data-race="' + k + '">' + G.RACES[k].name + '</button>').join('') + '</div><p class="dim">' + R.desc + '</p>';
      h += '<h3>Class</h3><div class="cls-grid">' + Object.keys(G.CLASSES).map(k => '<button class="cls' + (k === pick.cls ? ' sel' : '') + '" data-cls="' + k + '"><span class="cp" data-p="' + k + '"></span><b>' + G.CLASSES[k].name + '</b><small>' + G.CLASSES[k].role + '</small></button>').join('') + '</div>';
      h += '<p class="quote">“' + C.tag + '”</p><p><b>How it plays:</b> ' + G.PLAY[pick.cls] + '</p>';
      h += '<div class="stats">' + G.STATS.map(s => '<div class="stat' + (s === C.primary ? ' prim' : '') + '" title="' + G.STAT_INFO[s][1] + '"><small>' + s.toUpperCase() + '</small><b>' + stats[s] + '</b><i>' + G.fmtMod(G.mod(stats[s])) + '</i></div>').join('') + '</div>';
      h += '<h3>Starting kit <span class="dim">· resource: ' + C.res + '</span></h3>' + withRes(abCard(C.basic) + C.start.map(id => abCard(id)).join(''), pick.cls);
      h += '<p class="dim">Level 2: choose ' + C.l2.map(i => A[i].name).join(' or ') + '. Level 3: choose a subclass, ' + Object.values(C.subs).map(s => s.name).join(' or ') + '. Level 4: a feat. Level 5: ' + A[C.ult].name + '.</p>';
      h += '<div class="row end"><input id="nm" maxlength="16" placeholder="Name your fighter" value="' + esc(pick.name) + '"><button class="big" id="go">Enter the Undercity</button></div></div>';
      show(h, 'right'); G.setPreview({ cls: pick.cls, race: pick.race });
      panel().querySelectorAll('.cp').forEach(el => el.appendChild(G.portrait({ cls: el.dataset.p, race: pick.race }, 54)));
      const nm = $('#nm'); nm.oninput = () => pick.name = nm.value;
      on('[data-race]', el => { pick.race = el.dataset.race; render(); });
      on('[data-cls]', el => { pick.cls = el.dataset.cls; render(); });
      on('#go', () => {
        const name = (pick.name || '').trim() || G.pick(['Ash', 'Vane', 'Corvin', 'Mirel', 'Dask', 'Rook', 'Sable', 'Thorn']);
        G.state = G.newState(); G.state.hero = G.newHero(name, pick.race, pick.cls); G.state.coin = 30;
        G.save(); G.createPick = null; ui.hub(true);
      });
    };
    render();
  };

  // ------------------------------------------------------------ hub + hideout
  const W = () => G.world;
  ui.hub = function (first) {
    ui.close(); $('#hud').className = 'hidden'; G.placing = null; ui.placeBar();
    G.scene = 'hub'; W().enter('hub', G.hubPos); ui.topbar();
    if (first) show('<div class="card small letter"><h2>Notice of Debt</h2><p><i>To the bearer, ' + esc(G.state.hero.name) + ':</i></p><p>You owe the Deep Guild a debt, and the only currency we respect is blood on the pit floor.</p>' +
      '<p>Win fights to earn <b>XP</b>, <b>coin</b> and <b>respect</b>. Respect raises your rank in the Guild. Coin buys gear, and turns the damp cave we have lent you into a home.</p><p class="sig">Signed and sealed, the Ledger-Keeper</p><span class="seal"></span>' +
      '<p class="dim">Walk with WASD or the thumb stick, or tap where you want to go. Walk up to the Pit gate, the Fence, the Guildmaster or your Hideout door.</p><div class="row end"><button class="big" id="ok">Make my mark</button></div></div>');
    on('#ok', () => ui.close());
    if (!first) ui.afterFight();
  };
  ui.leaveHub = () => { const w = W().walker; if (G.scene === 'hub') G.hubPos = { x: w.x, z: Math.max(w.z, 1.2) }; };
  ui.hideout = function () {
    ui.leaveHub(); ui.close(); G.hubPos = { x: 1.2, z: 9 };
    G.scene = 'hideout'; W().enter('hideout'); ui.topbar();
    if (!G.state.seenHideout) { G.state.seenHideout = true; G.save(); ui.toast('This cave is yours. Press Decorate to buy furniture and plants. Tap anything you own to pick it up and move it.'); }
  };

  // The catalog: buy a piece, then place it on the grid.
  ui.catalog = function () {
    const st = G.state, rk = G.rankOf(st.respect), own = G.owned(st);
    let h = '<div class="card"><h2>The Quartermaster’s Catalogue</h2><p class="dim">Buy a piece, then choose where it stands. Out in the room, tap anything you own to pick it up, move it, turn it or store it. You have <b>' + st.coin + '</b> coin.</p>';
    G.DECOR.forEach(d => {
      const n = own[d.id] || 0, locked = rk < d.rank, full = n >= d.max, poor = st.coin < d.cost;
      h += '<div class="ab-row' + (locked ? ' lockedrow' : '') + '"><div class="ab-ic pas" style="color:' + (d.light ? '#' + d.light.toString(16).padStart(6, '0') : 'var(--gold)') + '">' + (d.zone === 'garden' ? '❀' : d.zone === 'house' ? '⌂' : '✦') + '</div><div class="ab-tx"><b>' + d.name + '</b>' +
        '<small>' + (d.zone === 'any' ? 'House or garden' : d.zone === 'house' ? 'House' : 'Garden') + ' · ' + d.w + '×' + d.d + (d.max > 1 ? ' · ' + n + '/' + d.max + ' placed' : n ? ' · placed' : '') + '</small><p>' + d.perk + '</p></div>' +
        (locked ? '<span class="lock">' + G.RANKS[d.rank].name + '</span>' : full ? '<span class="lock">Owned</span>' : '<button class="big" data-buy="' + d.id + '"' + (poor ? ' disabled' : '') + '>' + d.cost + ' coin</button>') + '</div>';
    });
    h += '<div class="row end"><button id="x">Close</button></div></div>';
    show(h);
    on('#x', () => { ui.close(); ui.topbar(); });
    on('[data-buy]', el => { const w = W().walker; ui.close(); ui.startPlace({ id: el.dataset.buy, x: Math.round(w.x), z: Math.round(w.z) + 1, r: 0, from: null }); });
  };
  ui.startPlace = function (pl) {
    const H = W().get('hideout'), it = G.DECOR_BY[pl.id];
    if (pl.from == null && !H.canPlace(pl.id, pl.x, pl.z, pl.r)) {       // find the nearest free spot to start from
      let best = null, bd = 1e9;
      for (let x = 0; x < W().grid.GW; x++) for (let z = 0; z < W().grid.GD; z++) if (H.canPlace(pl.id, x, z, 0)) { const d = Math.hypot(x - pl.x, z - pl.z); if (d < bd) { bd = d; best = [x, z]; } }
      if (best) { pl.x = best[0]; pl.z = best[1]; }
    }
    G.placing = pl; H.setGhost(pl); ui.placeBar();
  };
  ui.placeBar = function () {
    const pl = G.placing, bar = $('#placebar');
    if (!pl || G.scene !== 'hideout') { bar.className = 'hidden'; return; }
    const it = G.DECOR_BY[pl.id];
    bar.className = '';
    bar.querySelector('span').innerHTML = '<b>' + it.name + '</b> ' + (pl.ok ? 'Drag it, or tap a tile, then place.' : '<i class="bad">' + (it.zone === 'house' ? 'Needs a free spot inside the house.' : it.zone === 'garden' ? 'Needs a free spot in the garden.' : 'That spot is taken.') + '</i>');
    $('#plOk').disabled = !pl.ok; $('#plRot').style.display = it.w === it.d ? 'none' : '';
    $('#plCancel').textContent = pl.from == null ? 'Cancel' : 'Put back'; $('#plStore').style.display = pl.from == null ? 'none' : ''; $('#plStore').textContent = 'Store (+' + it.cost + ')';
  };
  ui.placeMove = function (x, z) {
    const pl = G.placing; if (!pl) return;
    const f = W().grid.footprint(G.DECOR_BY[pl.id], pl.r);
    pl.x = Math.round(x - (f[0] - 1) / 2); pl.z = Math.round(z - (f[1] - 1) / 2);
    W().get('hideout').setGhost(pl); ui.placeBar();
  };
  ui.placeInit = function () {
    const H = () => W().get('hideout'), done = () => { G.placing = null; H().setGhost(null); H().refresh(); ui.placeBar(); ui.topbar(); G.save(); };
    $('#plRot').onclick = () => { const pl = G.placing; if (!pl) return; G.sfx('ui'); pl.r = (pl.r + 1) % 2; H().setGhost(pl); ui.placeBar(); };
    $('#plOk').onclick = () => {
      const pl = G.placing, st = G.state; if (!pl || !pl.ok) return;
      const it = G.DECOR_BY[pl.id];
      if (pl.from == null) { st.coin -= it.cost; st.items.push({ id: pl.id, x: pl.x, z: pl.z, r: pl.r }); G.sfx('coin'); ui.toast(it.name + ' placed. ' + it.perk); }
      else { const p = st.items[pl.from]; p.x = pl.x; p.z = pl.z; p.r = pl.r; delete p.hidden; }
      G.sfx('place'); G.gfx.burst(pl.x, 0.6, pl.z, it.light || 0xffd36b, 26, 3, 4); done();
    };
    $('#plCancel').onclick = () => { const pl = G.placing; if (!pl) return; G.sfx('ui'); if (pl.from != null) delete G.state.items[pl.from].hidden; done(); };
    $('#plStore').onclick = () => { const pl = G.placing; if (!pl || pl.from == null) return; const it = G.DECOR_BY[pl.id]; G.state.items.splice(pl.from, 1); G.state.coin += it.cost; G.sfx('coin'); ui.toast(it.name + ' stored. ' + it.cost + ' coin returned.'); done(); };
    $('#decorBtn').onclick = () => { G.audioInit(); G.sfx('ui'); ui.catalog(); };
    $('#prompt').onclick = () => { G.audioInit(); G.sfx('ui'); if (G.near) G.near.go(); };
  };
  ui.pickUp = function (i) { const p = G.state.items[i]; if (!p) return; G.sfx('ui'); p.hidden = true; W().get('hideout').refresh(); ui.startPlace({ id: p.id, x: p.x, z: p.z, r: p.r, from: i }); };
  ui.itemCard = function (i) {
    const st = G.state, p = st.items[i], it = G.DECOR_BY[p.id];
    show('<div class="card small"><h2>' + it.name + '</h2><p>' + it.perk + '</p><div class="row end"><button id="st">Store (refund ' + it.cost + ')</button><button id="mv" class="big">Move</button><button id="x">Close</button></div></div>');
    on('#x', () => ui.close());
    on('#mv', () => { ui.close(); p.hidden = true; W().get('hideout').refresh(); ui.startPlace({ id: p.id, x: p.x, z: p.z, r: p.r, from: i }); });
    on('#st', () => { st.items.splice(i, 1); st.coin += it.cost; G.save(); G.sfx('coin'); W().get('hideout').refresh(); ui.close(); ui.topbar(); });
  };
  ui.banner = function (a, b, cls) {
    const el = $('#banner'); if (!a) { el.className = 'hidden'; return; }
    el.className = cls || ''; el.querySelector('b').textContent = a; el.querySelector('small').textContent = b || '';
  };

  // ------------------------------------------------------------ the pit ladder
  ui.pit = function () {
    const st = G.state;
    let unlocked = true, h = '<div class="card"><h2>The Blood Ledger</h2><p class="dim">Five names stand between you and the crown. Beat one to unlock the next. Rematches pay less, but the crowd still tips.</p><div class="ladder">';
    G.OPPONENTS.forEach((o, i) => {
      const wins = st.wins[o.id] || 0, open = unlocked;
      h += '<div class="opp' + (open ? '' : ' locked') + (o.boss ? ' boss' : '') + (wins ? ' beaten' : '') + '"><span class="op" data-i="' + i + '"></span><div class="opp-tx"><b>' + o.name + '</b> <small>' + o.title + '</small>' +
        '<small>Level ' + o.level + ' ' + G.RACES[o.race].name + ' ' + G.CLASSES[o.cls].name + (wins ? ' · beaten ' + wins + 'x' : '') + '</small>' +
        (open ? '<em class="taunt">“' + o.taunt + '”</em>' : '') + '<small class="rew">' + (wins ? Math.round(o.xp * .6) : o.xp) + ' XP · ' + (wins ? Math.round(o.coin * .6) : o.coin) + ' coin · ' + (wins ? Math.round(o.respect * .3) : o.respect) + ' respect</small></div>' +
        (open ? '<button class="' + (wins ? '' : 'big') + '" data-fight="' + i + '">' + (wins ? 'Rematch' : 'Fight') + '</button>' : '<span class="lock">Sealed</span>') + '</div>';
      if (!wins) unlocked = false;
    });
    h += '</div><div class="row end"><button id="x">Back</button></div></div>';
    show(h);
    panel().querySelectorAll('.op').forEach(el => { const o = G.OPPONENTS[+el.dataset.i]; el.appendChild(G.portrait({ cls: o.cls, race: o.race, tint: o.tint }, 56, 1.2)); });
    on('#x', () => ui.close());
    on('[data-fight]', el => ui.prefight(G.OPPONENTS[+el.dataset.fight]));
  };

  const CONTROLS = '<div class="keys"><span><kbd>WASD</kbd> move</span><span><kbd>Mouse</kbd> aim</span><span><kbd>Click</kbd> attack</span><span><kbd>Space</kbd> dodge</span><span><kbd>Shift</kbd> or <kbd>Right click</kbd> parry</span><span><kbd>T</kbd> call your Second</span><span><kbd>Q</kbd><kbd>E</kbd><kbd>R</kbd> abilities</span><span><kbd>F</kbd> ultimate</span><span><kbd>C</kbd> potion</span><span><kbd>Esc</kbd> pause</span></div>' +
    '<div class="keys"><span><kbd>Controller</kbd> left stick move · right stick aim · <kbd>X</kbd>/<kbd>RT</kbd> attack · <kbd>A</kbd> dodge · <kbd>LT</kbd> parry · <kbd>D-pad left</kbd> Second · <kbd>LB</kbd><kbd>RB</kbd><kbd>Y</kbd> abilities · <kbd>B</kbd> ultimate · <kbd>D-pad up</kbd> potion · <kbd>Menu</kbd> pause</span></div>' +
    '<p class="dim">On a phone: left thumb moves, buttons on the right, and your aim locks to your opponent. Red marks on the floor are incoming attacks. Dodge through them to thrill the crowd.</p>';
  ui.prefight = function (o) {
    const st = G.state, h = st.hero;
    show('<div class="card vs"><div class="vs-row"><div class="vs-side"><span id="vp"></span><b>' + esc(h.name) + '</b><small>Lv ' + h.level + ' ' + G.CLASSES[h.cls].name + '</small></div><div class="vs-mid">VS</div>' +
      '<div class="vs-side"><span id="ve"></span><b>' + o.name + '</b><small>Lv ' + o.level + ' ' + G.CLASSES[o.cls].name + '</small></div></div>' +
      '<p class="quote">“' + o.taunt + '”</p><p class="dim">' + G.BIOS[o.id].split('. ')[0] + '.</p><p class="note"><b>Pit wisdom:</b> ' + G.pick(G.TIPS) + '</p>' + CONTROLS +
      '<div class="row end"><button id="x">Back</button><button class="big" id="go">Enter the pit</button></div></div>');
    $('#vp').appendChild(G.portrait(G.lookOf(h, st), 96, 1.2)); $('#ve').appendChild(G.portrait({ cls: o.cls, race: o.race, tint: o.tint }, 96, 1.2));
    on('#x', () => ui.pit());
    on('#go', () => { ui.leaveHub(); ui.close(); G.scene = 'fight'; ui.topbar(); G.fight.start(o); });
  };

  // ------------------------------------------------------------ fight HUD
  let hudEls = null;
  ui.buildHud = function (P, E) {
    const hud = $('#hud'); hud.className = G.input.touch ? 'touch' : '';
    const side = (el, e) => { el.querySelector('.hud-name').textContent = e.name; el.querySelector('.res i').style.background = e.C.resColor; let m = el.querySelector('.medal'); if (!m) { m = document.createElement('div'); m.className = 'medal'; el.insertBefore(m, el.firstChild); } m.innerHTML = ''; m.appendChild(G.portrait(e.look, 44)); };
    side($('#hudP'), P); side($('#hudE'), E);
    const bar = $('#abar'); bar.innerHTML = '';
    const mk = (act, key, ab, cls) => {
      const b = document.createElement('button'); b.className = 'ab ' + (cls || '');
      b.innerHTML = (ab ? G.icon(ab) : '') + '<i class="cdv"></i><kbd></kbd><em></em>'; b.dataset.act = act;
      b.title = ab && ab !== 'potion' ? ab.name + ': ' + ab.desc : '';
      const fire = ev => { ev.preventDefault(); ev.stopPropagation(); G.input.pressed.push(act); };
      b.addEventListener('touchstart', fire, { passive: false }); b.addEventListener('mousedown', fire);
      bar.appendChild(b); return b;
    };
    hudEls = { slots: [] };
    ['Q', 'E', 'R'].forEach((k, i) => { const id = P.kit[i]; if (id) hudEls.slots.push({ id, el: mk('a' + i, k, A[id]) }); });
    if (P.ult) hudEls.slots.push({ id: P.ult, el: mk('ult', 'F', A[P.ult], 'ult') });
    hudEls.potion = mk('potion', 'C', 'potion', 'pot');
    hudEls.dodge = mk('dodge', 'SPC', { icon: 'dash', color: '#cfd8e0' }, 'dg');
    hudEls.parry = mk('parry', 'SHF', { icon: 'shield', color: '#ffe9a0' }, 'py'); hudEls.parry.title = G.PARRY_INFO[P.cls][0] + ': ' + G.PARRY_INFO[P.cls][1];
    hudEls.assist = P.second ? mk('assist', 'T', { icon: 'up', color: '#ffd36b' }, 'as') : null; if (hudEls.assist) hudEls.assist.title = 'Call ' + P.second.name + ', your Second';
    ui.refreshKeys();
  };
  ui.refreshKeys = function () {
    const K = G.input.usingPad ? { a0: 'LB', a1: 'RB', a2: 'Y', ult: 'B', potion: '▲', dodge: 'A', parry: 'LT', assist: '◀' } : { a0: 'Q', a1: 'E', a2: 'R', ult: 'F', potion: 'C', dodge: 'SPC', parry: 'SHF', assist: 'T' };
    document.querySelectorAll('#abar .ab').forEach(b => { b.querySelector('kbd').textContent = K[b.dataset.act] || ''; });
  };
  const stStr = e => {
    const o = [];
    if (e.shield > 0) o.push('WARD ' + Math.ceil(e.shield));
    if (e.guard > 0) o.push('GUARDING');
    ['stun', 'slow', 'burn', 'poison', 'mark'].forEach(k => { if (e.st[k]) o.push(k.toUpperCase()); });
    ['haste', 'stealth', 'sneak', 'dmg', 'aura'].forEach(k => { if (e.buffs[k]) o.push({ haste: 'HASTE', stealth: 'HIDDEN', sneak: 'SNEAK READY', dmg: 'SURGE', aura: 'GUARDIANS' }[k]); });
    return o.join(' · ');
  };
  ui.updateHud = function (P, E, hype) {
    const upd = (el, e) => {
      el.querySelector('.hp i').style.width = Math.max(0, e.hp / e.maxHp * 100) + '%';
      el.querySelector('.hp b').style.width = Math.min(100, e.shield / e.maxHp * 100) + '%';
      el.querySelector('.hp span').textContent = Math.max(0, Math.ceil(e.hp)) + ' / ' + e.maxHp;
      el.querySelector('.res i').style.width = e.res + '%';
      const s = stStr(e), se = el.querySelector('.hud-status'); if (se.textContent !== s) se.textContent = s;
    };
    upd($('#hudP'), P); upd($('#hudE'), E);
    const hb = $('.hype i'); hb.style.width = hype + '%'; hb.style.background = hype >= 80 ? '#ffd36b' : hype >= 45 ? '#ff9a4a' : '#a85a3a';
    if (!hudEls) return;
    hudEls.slots.forEach(s => {
      const ab = A[s.id], cd = Math.max(0, P.cds[s.id] || 0);
      s.el.querySelector('.cdv').style.height = (cd / ab.cd * 100) + '%';
      s.el.querySelector('em').textContent = cd > 0 ? Math.ceil(cd) : '';
      s.el.classList.toggle('off', cd <= 0 && P.res < (ab.cost || 0));
      s.el.classList.toggle('ready', cd <= 0 && P.res >= (ab.cost || 0));
    });
    hudEls.potion.querySelector('em').textContent = P.potions; hudEls.potion.classList.toggle('off', P.potions <= 0);
    hudEls.dodge.querySelector('.cdv').style.height = (P.dodgeT / P.d.dodgeCd * 100) + '%';
  };
  ui.pause = function () {
    const F = G.fight; if (!F.active) return;
    F.paused = true;
    show('<div class="card small"><h2>Catch Your Breath</h2>' + CONTROLS + '<div class="row end"><button id="gr">Blood: ' + (G.state.gore === false ? 'off' : 'on') + '</button><button id="ff" class="danger">Forfeit</button><button class="big" id="rs">Resume</button></div></div>');
    on('#gr', () => { G.state.gore = G.state.gore === false; G.save(); ui.pause(); });
    on('#rs', () => { ui.close(); F.paused = false; });
    on('#ff', () => { ui.close(); F.forfeit(); });
  };

  // ------------------------------------------------------------ results + level up
  ui.results = function (r) {
    $('#hud').className = 'hidden';
    const st = G.state;
    let h = '<div class="card small res ' + (r.win ? 'win' : 'loss') + '"><small class="over">' + (r.win ? 'The pit has spoken' : 'The pit is patient') + '</small><h1>' + (r.win ? 'Victory' : r.forfeit ? 'Forfeit' : 'Defeat') + '</h1>';
    h += '<p class="quote">' + (r.win ? (r.mortal ? r.mortal + '. What is left of ' + r.opp.name + ' is swept up to thunderous applause.' : 'The crowd chants your name.') : 'You wake up in the gutter, lighter in the purse. The Guild charges for the stretcher.') + '</p><div class="rewards">';
    h += '<div><small>XP</small><b>+' + r.xp + '</b></div><div><small>COIN</small><b>' + (r.lost ? '−' + r.lost : '+' + r.coin) + '</b>' + (r.lost ? '<i>stretcher fee</i>' : '') + (r.tips ? '<i>crowd tips +20%</i>' : '') + (r.stolen ? '<i>' + r.stolen + ' lifted</i>' : '') + '</div>';
    h += '<div><small>RESPECT</small><b>+' + r.respect + '</b>' + (r.win ? '<i>crowd hype ' + r.hype + '%</i>' : '') + '</div></div>';
    if (r.rankUp != null) h += '<p class="rankup">Rank up: <b style="color:' + G.RANKS[r.rankUp].color + '">' + G.RANKS[r.rankUp].name + '</b>. New hideout pieces are available.</p>';
    if (!r.win) h += '<p class="dim">Losing costs you a fifth of your purse and nothing else. ' + G.pick(G.TIPS) + '</p>';
    h += '<div class="row end"><button class="big" id="ok">Continue</button></div></div>';
    show(h);
    if (r.rankUp != null) G.sfx('level');
    on('#ok', () => {
      if (r.win && r.first && r.opp.boss) return ui.champion();
      ui.levelCheck();
    });
  };
  ui.champion = function () {
    show('<div class="card small res win"><small class="over">Long live the</small><h1>Guttercrown</h1><p>Vexa’s crown rolls across the stone and stops at your boot. The Deep Guild sends wine, a ledger with your debt struck through, and a new contract.</p>' +
      '<p class="dim">That is the end of this vertical slice. Your fighter is saved: keep rematching, finish the hideout, or start a different class and see how it plays.</p><div class="row end"><button class="big" id="ok">Back to the Undercity</button></div></div>');
    G.sfx('level'); on('#ok', () => ui.levelCheck());
  };
  ui.levelCheck = function () {
    const h = G.state.hero;
    if (h.level < G.MAX_LEVEL && h.xp >= G.XP_FOR[h.level + 1]) { h.level++; G.save(); return ui.levelUp(); }
    ui.hub();
    if (h.known.some(id => !h.slots.includes(id)) && h._newAb) { delete h._newAb; G.save(); ui.sheet('You know more abilities than you have slots. Choose your loadout.'); }
  };
  ui.levelUp = function () {
    const st = G.state, h = st.hero, C = G.CLASSES[h.cls], L = h.level;
    G.sfx('level');
    const learn = id => { h.known.push(id); const i = h.slots.indexOf(null); if (i >= 0) h.slots[i] = id; else h._newAb = 1; };
    let body = '', done;
    if (L === 2) {
      body = '<h3>Level 2 · learn one new technique</h3><p class="dim">You keep both of your starting moves. Pick the one that fills a gap: the coloured tag says what each is for.</p>' + C.l2.map(id => withRes(abCard(id, '<button class="big" data-pick="' + id + '">Learn</button>'), h.cls)).join('');
      done = k => learn(k);
    } else if (L === 3) {
      body = '<h3>Level 3 · choose your subclass</h3><p class="dim">Permanent. Each gives one passive that is always on and one new move.</p>' + Object.keys(C.subs).map(k => { const s = C.subs[k]; return '<div class="sub"><div class="sub-h"><b>' + s.name + '</b><small>' + s.desc + '</small><button class="big" data-pick="' + k + '">Choose</button></div><div class="ab-row"><div class="ab-ic pas">★</div><div class="ab-tx"><b>' + s.passive[0] + '</b><small>Passive</small><p>' + s.passive[1] + '</p></div></div>' + withRes(abCard(s.ability), h.cls) + '</div>'; }).join('');
      done = k => { h.sub = k; learn(C.subs[k].ability); };
    } else if (L === 4) {
      body = '<h3>Level 4 · choose one feat</h3><p class="dim">A flat, permanent bonus. If unsure, Ability Improvement is never wrong.</p>' + Object.keys(G.FEATS).map(k => '<div class="ab-row"><div class="ab-ic pas">✦</div><div class="ab-tx"><b>' + G.FEATS[k].name + '</b><p>' + G.FEATS[k].desc + (k === 'asi' ? ' (' + G.STAT_INFO[C.primary][0] + ' ' + h.stats[C.primary] + ' → ' + (h.stats[C.primary] + 2) + ')' : '') + '</p></div><button class="big" data-pick="' + k + '">Take</button></div>').join('');
      done = k => { if (k === 'asi') h.stats[C.primary] += 2; else h.feats.push(k); };
    } else {
      body = '<h3>Ultimate unlocked</h3>' + withRes(abCard(C.ult, '<button class="big" data-pick="ult">Claim</button>'), h.cls) + '<p class="dim">Your ultimate has its own slot: press F.</p>';
      done = () => { h.ult = C.ult; };
    }
    const d0 = G.derive(Object.assign({}, h, { level: L - 1 }), st), d1 = G.derive(h, st);
    show('<div class="card lvl"><div class="lvl-h"><small>THE GUILD TAKES NOTICE</small><h1>Level ' + L + '</h1><p>Max HP ' + d0.maxHp + ' → <b>' + d1.maxHp + '</b></p></div>' + body + '</div>');
    on('[data-pick]', el => { done(el.dataset.pick); G.save(); ui.levelCheck(); });
  };

  // ------------------------------------------------------------ character sheet
  ui.sheet = function (msg) {
    const st = G.state, h = st.hero, C = G.CLASSES[h.cls], d = G.derive(h, st), sub = h.sub ? C.subs[h.sub] : null;
    let s = '<div class="card sheet"><div class="sh-top"><span id="sp"></span><div><h2>' + esc(h.name) + '</h2><p>Level ' + h.level + ' ' + G.RACES[h.race].name + ' ' + (sub ? sub.name + ' ' : '') + C.name + ' · ' + G.RANKS[G.rankOf(st.respect)].name + '</p>' +
      '<p class="dim">' + (h.level < G.MAX_LEVEL ? h.xp + ' / ' + G.XP_FOR[h.level + 1] + ' XP to level ' + (h.level + 1) : 'Max level for this slice') + '</p></div></div>';
    if (msg) s += '<p class="note">' + msg + '</p>';
    s += '<div class="stats">' + G.STATS.map(k => '<div class="stat' + (k === C.primary ? ' prim' : '') + '"><small>' + k.toUpperCase() + '</small><b>' + h.stats[k] + '</b><i>' + G.fmtMod(G.mod(h.stats[k])) + '</i><em>' + G.STAT_INFO[k][1] + '</em></div>').join('') + '</div>';
    s += '<div class="derived"><span>HP <b>' + d.maxHp + '</b></span><span>Crit <b>' + Math.round(d.crit * 100) + '%</b></span><span>Damage <b>' + Math.round(d.dmgMul * 100) + '%</b></span><span>Armor <b>-' + Math.round(d.dr * 100) + '%</b></span><span>Speed <b>' + Math.round(d.speed) + '</b></span><span>' + C.res + ' <b>' + d.regen.toFixed(1) + '/s</b></span><span>Coin <b>' + Math.round(d.coinMul * 100) + '%</b></span><span>Respect <b>' + Math.round(d.respectMul * 100) + '%</b></span></div>';
    // the build path: one glance shows what you chose and what is coming
    const step = (n, title, got, todo) => '<div class="pstep' + (h.level >= n ? ' done' : '') + '"><span>' + n + '</span><b>' + title + '</b><small>' + (h.level >= n ? got : todo) + '</small></div>';
    s += '<h3>Your build</h3><div class="path">' + step(1, C.name, C.start.map(i => A[i].name).join(', '), '') +
      step(2, 'Technique', (C.l2.filter(i => h.known.includes(i)).map(i => A[i].name)[0] || 'chosen'), 'Choose ' + C.l2.map(i => A[i].name).join(' or ')) +
      step(3, 'Subclass', sub ? sub.name : '', Object.values(C.subs).map(x => x.name).join(' or ')) +
      step(4, 'Feat', h.feats.length ? G.FEATS[h.feats[0]].name : 'Ability Improvement', 'Choose a feat') +
      step(5, 'Ultimate', A[C.ult].name, A[C.ult].name) + '</div><p class="dim"><b>How it plays:</b> ' + G.PLAY[h.cls] + '</p>';
    s += '<h3>Loadout <span class="dim">· assign abilities to Q, E, R</span></h3>';
    s += withRes(h.known.map(id => abCard(id, '<div class="slots">' + ['Q', 'E', 'R'].map((k, i) => '<button class="slot' + (h.slots[i] === id ? ' sel' : '') + '" data-slot="' + i + '" data-id="' + id + '">' + k + '</button>').join('') + '</div>')).join(''), h.cls);
    if (h.ult) s += withRes(abCard(h.ult, '<div class="slots"><span class="slot sel">F</span></div>'), h.cls);
    s += '<h3>Always available</h3>' + withRes(abCard(C.basic), h.cls) +
      '<div class="ab-row"><div class="ab-ic">' + G.icon({ icon: 'shield', color: '#ffe9a0' }) + '</div><div class="ab-tx"><b>' + G.PARRY_INFO[h.cls][0] + '</b><span class="tagk">Parry</span><span class="tagr r-Defense">Defense</span><small>8 ' + C.res + ' · ' + Math.round((({ fighter: 0.30, rogue: 0.20, sorcerer: 0.24, cleric: 0.26 })[h.cls] + (d.parry || 0) + Math.max(0, G.mod(h.stats.dex)) * 0.008) * 1000) + ' ms window</small><p>' + G.PARRY_INFO[h.cls][1] + ' Better weapons and armour widen the window. Miss it and you are open.</p></div></div>' +
      '<div class="ab-row"><div class="ab-ic pas">☠</div><div class="ab-tx"><b>' + G.MORTAL[h.cls].name + '</b><span class="tagk">Mortal Blow</span><span class="tagr r-Finisher">Finisher</span><p>' + G.MORTAL[h.cls].desc + ' Delivered automatically when your opponent has nothing left.</p></div></div>';
    if (sub) s += '<div class="ab-row"><div class="ab-ic pas">★</div><div class="ab-tx"><b>' + sub.passive[0] + '</b><small>' + sub.name + '</small><p>' + sub.passive[1] + '</p></div></div>';
    h.feats.forEach(f => s += '<div class="ab-row"><div class="ab-ic pas">✦</div><div class="ab-tx"><b>' + G.FEATS[f].name + '</b><small>Feat</small><p>' + G.FEATS[f].desc + '</p></div></div>');
    const own = G.owned(st), perks = G.DECOR.filter(x => own[x.id] && /[+%]|ward|potion|less/.test(x.perk));
    if (perks.length) s += '<h3>Hideout comforts</h3><ul class="perks">' + perks.map(x => '<li><b>' + x.name + '</b> ' + x.perk + '</li>').join('') + '</ul>';
    s += '<div class="row end"><button id="cx">Guild Codex</button><button class="big" id="x">Done</button></div></div>';
    show(s);
    on('#cx', () => ui.codex());
    $('#sp').appendChild(G.portrait(G.lookOf(h, st), 84, 1.2));
    on('#x', () => { ui.close(); ui.topbar(); });
    on('[data-slot]', el => {
      const i = +el.dataset.slot, id = el.dataset.id, j = h.slots.indexOf(id);
      if (j === i) return;
      const prev = h.slots[i]; h.slots[i] = id; if (j >= 0) h.slots[j] = prev;
      G.save(); const sc = panel().scrollTop; ui.sheet(); panel().scrollTop = sc;
    });
  };

  // ------------------------------------------------------------ the Guild Codex (lore, unlocked by climbing)
  ui.codex = function () {
    const st = G.state, open = G.LORE.filter(e => e.unlock(st)).length;
    let h = '<div class="card codex"><h2>The Guild Codex</h2><p class="dim">' + open + ' of ' + G.LORE.length + ' entries unsealed. Win bouts and rise in rank to unseal the rest.</p>', sec = '';
    G.LORE.forEach(e => {
      if (e.sec !== sec) { sec = e.sec; h += '<h3>' + sec + '</h3>'; }
      h += e.unlock(st) ? '<details class="lore"><summary>' + e.title + '</summary><p>' + e.body + '</p></details>' : '<div class="lore sealed">Sealed entry</div>';
    });
    h += '<div class="row end"><button class="big" id="x">Close</button></div></div>';
    show(h);
    panel().querySelectorAll('summary').forEach(el => el.addEventListener('click', () => G.sfx('page')));
    on('#x', () => { ui.close(); ui.topbar(); });
  };

  // ------------------------------------------------------------ shop
  ui.shop = function () {
    const st = G.state;
    let s = '<div class="card"><h2>The Fence</h2><p class="quote">“Everything fell off a cart. Different carts.”</p><p class="dim">You have <b>' + st.coin + '</b> coin.</p>';
    s += '<div class="ab-row"><div class="ab-ic pas">✂</div><div class="ab-tx"><b>The Tailor’s Rack</b><small>Cosmetic</small><p>Dyes, headgear, cloaks, weapon finishes and auras. ' + Object.keys((st.cos || {}).owned || {}).length + ' of ' + G.COSMETICS.length + ' owned.</p></div><button class="big" id="tl">Browse</button></div>';
    ['weapon', 'armor'].forEach(k => {
      const g = G.GEAR[k], t = st.gear[k], nx = g.tiers[t + 1];
      s += '<div class="ab-row"><div class="ab-ic pas">' + (k === 'weapon' ? '⚔' : '⛨') + '</div><div class="ab-tx"><b>' + (nx ? nx.name : g.tiers[t].name) + '</b><small>' + g.name + ' tier ' + (nx ? t + 1 : t) + ' of 2</small><p>' + (nx ? nx.desc : 'Fully upgraded.') + '</p></div>' +
        (nx ? '<button class="big" data-gear="' + k + '"' + (st.coin < nx.cost ? ' disabled' : '') + '>' + nx.cost + ' coin</button>' : '<span class="lock">Owned</span>') + '</div>';
    });
    s += '<div class="ab-row"><div class="ab-ic">' + G.icon('potion') + '</div><div class="ab-tx"><b>Healing Potion</b><small>Carrying ' + st.potions + ' of ' + G.POTION_MAX + '</small><p>Restores 35% of your health mid-fight.</p></div>' +
      (st.potions < G.POTION_MAX ? '<button class="big" id="pot"' + (st.coin < G.POTION_COST ? ' disabled' : '') + '>' + G.POTION_COST + ' coin</button>' : '<span class="lock">Full</span>') + '</div>';
    s += '<div class="row end"><button id="x">Back</button></div></div>';
    show(s);
    on('#x', () => { ui.close(); ui.topbar(); });
    on('#tl', () => ui.tailor());
    on('[data-gear]', el => { const k = el.dataset.gear, nx = G.GEAR[k].tiers[st.gear[k] + 1]; st.coin -= nx.cost; st.gear[k]++; G.save(); G.sfx('coin'); ui.shop(); ui.topbar(); });
    on('#pot', () => { st.coin -= G.POTION_COST; st.potions++; G.save(); G.sfx('coin'); ui.shop(); ui.topbar(); });
  };
})();
