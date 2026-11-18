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
  ui.close = () => { const p = panel(); p.className = 'hidden'; p.innerHTML = ''; };
  ui.isOpen = () => !panel().classList.contains('hidden');
  const on = (sel, fn) => panel().querySelectorAll(sel).forEach(el => el.addEventListener('click', e => fn(el, e)));
  let toastT = 0;
  ui.toast = (s) => { const t = $('#toast'); t.textContent = s; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600); };

  const abCard = (id, extra) => {
    const ab = A[id];
    return '<div class="ab-row"><div class="ab-ic">' + G.icon(ab) + '</div><div class="ab-tx"><b>' + ab.name + '</b>' +
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
      '<div class="tb-box tb-rank"><small>SYNDICATE RANK</small><b style="color:' + R.color + '">' + R.name + '</b>' +
      '<div class="bar rep"><i style="width:' + rPct + '%"></i></div><small>' + st.respect + (next ? ' / ' + next.at : '') + ' respect</small></div>' +
      '<div class="tb-box tb-coin"><span class="coin"></span><b>' + st.coin + '</b><small>coin</small><span class="pot">' + G.icon('potion') + '</span><b>' + st.potions + '</b></div>' +
      '<button class="mini" id="tbMute">' + (G.muted ? 'Sound off' : 'Sound on') + '</button>';
    tb.querySelector('.tb-port').appendChild(G.portrait(G.lookOf(h, st), 46, 1.25));
    tb.querySelector('.tb-hero').onclick = () => ui.sheet();
    $('#tbMute').onclick = () => { G.muted = !G.muted; ui.topbar(); };
  };

  // ------------------------------------------------------------ title
  ui.title = function () {
    G.scene = 'title'; G.enterTitle(); ui.topbar(); $('#hud').className = 'hidden';
    const has = G.hasSave();
    show('<div class="title-wrap"><div class="t-over">DEEP GUILD · SHADOW · COIN · OATH</div><h1>Underground<br>Syndicate</h1>' +
      '<p class="t-sub">One-on-one pit fighting. Build a class. Earn respect. Make the dark your home.</p>' +
      '<div class="t-btns">' + (has ? '<button class="big" id="bCont">Continue</button>' : '') +
      '<button class="' + (has ? '' : 'big') + '" id="bNew">New Fighter</button></div>' +
      '<p class="t-foot">Vertical slice · 4 classes · 5 opponents · a hideout to furnish</p></div>', 'title');
    on('#bCont', () => { G.load(); ui.hub(); });
    on('#bNew', () => {
      if (has) show('<div class="card small"><h2>Start over?</h2><p>This replaces your current fighter and hideout.</p><div class="row"><button id="y" class="danger">Start over</button><button id="n">Keep my fighter</button></div></div>');
      else return ui.create();
      on('#y', () => { G.wipe(); ui.create(); }); on('#n', () => ui.title());
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
      h += '<p class="quote">“' + C.tag + '”</p>';
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
    if (first) show('<div class="card small"><h2>The Undercity</h2><p>You owe the Deep Guild a debt, and the only currency they respect is blood on the pit floor.</p>' +
      '<p>Win fights to earn <b>XP</b>, <b>coin</b> and <b>respect</b>. Respect raises your syndicate rank. Coin buys gear and turns the damp cave they gave you into a home.</p>' +
      '<p class="dim">Walk with WASD or the thumb stick, or tap where you want to go. Walk up to the Pit gate, the Fence, the Guildmaster or your Hideout door.</p><div class="row end"><button class="big" id="ok">Let’s go</button></div></div>');
    on('#ok', () => ui.close());
  };
  ui.leaveHub = () => { const w = W().walker; if (G.scene === 'hub') G.hubPos = { x: w.x, z: Math.max(w.z, 1.2) }; };
  ui.hideout = function () {
    ui.leaveHub(); ui.close(); G.hubPos = { x: 1.2, z: 5.2 };
    G.scene = 'hideout'; W().enter('hideout'); ui.topbar();
    if (!G.state.seenHideout) { G.state.seenHideout = true; G.save(); ui.toast('This cave is yours. Press Decorate to furnish the house and plant the garden.'); }
  };

  // The catalog: buy a piece, then place it on the grid.
  ui.catalog = function () {
    const st = G.state, rk = G.rankOf(st.respect), own = G.owned(st);
    let h = '<div class="card"><h2>Decorate</h2><p class="dim">Buy a piece, then choose where it stands. Tap anything already placed to move or store it. You have <b>' + st.coin + '</b> coin.</p>';
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
    bar.querySelector('span').innerHTML = '<b>' + it.name + '</b> ' + (pl.ok ? 'Tap a tile to move it.' : '<i class="bad">' + (it.zone === 'house' ? 'Needs a free spot inside the house.' : it.zone === 'garden' ? 'Needs a free spot in the garden.' : 'That spot is taken.') + '</i>');
    $('#plOk').disabled = !pl.ok; $('#plRot').style.display = it.w === it.d ? 'none' : '';
    $('#plCancel').textContent = pl.from == null ? 'Cancel' : 'Put back';
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
      G.sfx('buff'); G.gfx.burst(pl.x, 0.6, pl.z, it.light || 0xffd36b, 26, 3, 4); done();
    };
    $('#plCancel').onclick = () => { const pl = G.placing; if (!pl) return; G.sfx('ui'); if (pl.from != null) delete G.state.items[pl.from].hidden; done(); };
    $('#decorBtn').onclick = () => { G.audioInit(); G.sfx('ui'); ui.catalog(); };
    $('#prompt').onclick = () => { G.audioInit(); G.sfx('ui'); if (G.near) G.near.go(); };
  };
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
    let unlocked = true, h = '<div class="card"><h2>The Blood Pit</h2><p class="dim">Beat a fighter to unlock the next. Rematches pay less, but the crowd still tips.</p><div class="ladder">';
    G.OPPONENTS.forEach((o, i) => {
      const wins = st.wins[o.id] || 0, open = unlocked;
      h += '<div class="opp' + (open ? '' : ' locked') + (o.boss ? ' boss' : '') + '"><span class="op" data-i="' + i + '"></span><div class="opp-tx"><b>' + o.name + '</b> <small>' + o.title + '</small>' +
        '<small>Level ' + o.level + ' ' + G.RACES[o.race].name + ' ' + G.CLASSES[o.cls].name + (wins ? ' · beaten ' + wins + 'x' : '') + '</small>' +
        '<small class="rew">' + (wins ? Math.round(o.xp * .6) : o.xp) + ' XP · ' + (wins ? Math.round(o.coin * .6) : o.coin) + ' coin · ' + (wins ? Math.round(o.respect * .3) : o.respect) + ' respect</small></div>' +
        (open ? '<button class="' + (wins ? '' : 'big') + '" data-fight="' + i + '">' + (wins ? 'Rematch' : 'Fight') + '</button>' : '<span class="lock">Locked</span>') + '</div>';
      if (!wins) unlocked = false;
    });
    h += '</div><div class="row end"><button id="x">Back</button></div></div>';
    show(h);
    panel().querySelectorAll('.op').forEach(el => { const o = G.OPPONENTS[+el.dataset.i]; el.appendChild(G.portrait({ cls: o.cls, race: o.race, tint: o.tint }, 56, 1.2)); });
    on('#x', () => ui.close());
    on('[data-fight]', el => ui.prefight(G.OPPONENTS[+el.dataset.fight]));
  };

  const CONTROLS = '<div class="keys"><span><kbd>WASD</kbd> move</span><span><kbd>Mouse</kbd> aim</span><span><kbd>Click</kbd> attack</span><span><kbd>Space</kbd> dodge</span><span><kbd>Q</kbd><kbd>E</kbd><kbd>R</kbd> abilities</span><span><kbd>F</kbd> ultimate</span><span><kbd>C</kbd> potion</span><span><kbd>Esc</kbd> pause</span></div>' +
    '<div class="keys"><span><kbd>Controller</kbd> left stick move · right stick aim · <kbd>X</kbd>/<kbd>RT</kbd> attack · <kbd>A</kbd> dodge · <kbd>LB</kbd><kbd>RB</kbd><kbd>Y</kbd> abilities · <kbd>B</kbd> ultimate · <kbd>D-pad up</kbd> potion · <kbd>Menu</kbd> pause</span></div>' +
    '<p class="dim">On a phone: left thumb moves, buttons on the right, and your aim locks to your opponent. Red marks on the floor are incoming attacks. Dodge through them to thrill the crowd.</p>';
  ui.prefight = function (o) {
    const st = G.state, h = st.hero;
    show('<div class="card vs"><div class="vs-row"><div class="vs-side"><span id="vp"></span><b>' + esc(h.name) + '</b><small>Lv ' + h.level + ' ' + G.CLASSES[h.cls].name + '</small></div><div class="vs-mid">VS</div>' +
      '<div class="vs-side"><span id="ve"></span><b>' + o.name + '</b><small>Lv ' + o.level + ' ' + G.CLASSES[o.cls].name + '</small></div></div>' +
      '<p class="quote">“' + o.taunt + '”</p>' + CONTROLS +
      '<div class="row end"><button id="x">Back</button><button class="big" id="go">Enter the pit</button></div></div>');
    $('#vp').appendChild(G.portrait(G.lookOf(h, st), 96, 1.2)); $('#ve').appendChild(G.portrait({ cls: o.cls, race: o.race, tint: o.tint }, 96, 1.2));
    on('#x', () => ui.pit());
    on('#go', () => { ui.leaveHub(); ui.close(); G.scene = 'fight'; ui.topbar(); G.fight.start(o); });
  };

  // ------------------------------------------------------------ fight HUD
  let hudEls = null;
  ui.buildHud = function (P, E) {
    const hud = $('#hud'); hud.className = G.input.touch ? 'touch' : '';
    const side = (el, e) => { el.querySelector('.hud-name').textContent = e.name; el.querySelector('.res i').style.background = e.C.resColor; };
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
    ui.refreshKeys();
  };
  ui.refreshKeys = function () {
    const K = G.input.usingPad ? { a0: 'LB', a1: 'RB', a2: 'Y', ult: 'B', potion: '▲', dodge: 'A' } : { a0: 'Q', a1: 'E', a2: 'R', ult: 'F', potion: 'C', dodge: 'SPC' };
    document.querySelectorAll('#abar .ab').forEach(b => { b.querySelector('kbd').textContent = K[b.dataset.act] || ''; });
  };
  const stStr = e => {
    const o = [];
    if (e.shield > 0) o.push('WARD ' + Math.ceil(e.shield));
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
    show('<div class="card small"><h2>Paused</h2>' + CONTROLS + '<div class="row end"><button id="ff" class="danger">Forfeit</button><button class="big" id="rs">Resume</button></div></div>');
    on('#rs', () => { ui.close(); F.paused = false; });
    on('#ff', () => { ui.close(); F.forfeit(); });
  };

  // ------------------------------------------------------------ results + level up
  ui.results = function (r) {
    $('#hud').className = 'hidden';
    const st = G.state;
    let h = '<div class="card small res ' + (r.win ? 'win' : 'loss') + '"><h1>' + (r.win ? 'Victory' : r.forfeit ? 'Forfeit' : 'Defeat') + '</h1>';
    h += '<p class="quote">' + (r.win ? 'The crowd chants your name as they drag ' + r.opp.name + ' out.' : 'You wake up in the gutter. The pit never runs out of tomorrow.') + '</p><div class="rewards">';
    h += '<div><small>XP</small><b>+' + r.xp + '</b></div><div><small>COIN</small><b>+' + r.coin + '</b>' + (r.tips ? '<i>crowd tips +20%</i>' : '') + (r.stolen ? '<i>' + r.stolen + ' lifted</i>' : '') + '</div>';
    h += '<div><small>RESPECT</small><b>+' + r.respect + '</b>' + (r.win ? '<i>crowd hype ' + r.hype + '%</i>' : '') + '</div></div>';
    if (r.rankUp != null) h += '<p class="rankup">Rank up: <b style="color:' + G.RANKS[r.rankUp].color + '">' + G.RANKS[r.rankUp].name + '</b>. New hideout pieces are available.</p>';
    if (!r.win) h += '<p class="dim">Tip: spend coin at the Fence, re-slot abilities with the Guildmaster, or rematch an earlier fighter.</p>';
    h += '<div class="row end"><button class="big" id="ok">Continue</button></div></div>';
    show(h);
    if (r.rankUp != null) G.sfx('level');
    on('#ok', () => {
      if (r.win && r.first && r.opp.boss) return ui.champion();
      ui.levelCheck();
    });
  };
  ui.champion = function () {
    show('<div class="card small res win"><h1>Pit Champion</h1><p>Vexa’s crown rolls across the stone and stops at your boot. The Deep Guild sends wine, a ledger with your debt struck through, and a new contract.</p>' +
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
      body = '<h3>Choose a new ability</h3>' + C.l2.map(id => withRes(abCard(id, '<button class="big" data-pick="' + id + '">Learn</button>'), h.cls)).join('');
      done = k => learn(k);
    } else if (L === 3) {
      body = '<h3>Choose your subclass</h3>' + Object.keys(C.subs).map(k => { const s = C.subs[k]; return '<div class="sub"><div class="sub-h"><b>' + s.name + '</b><small>' + s.desc + '</small><button class="big" data-pick="' + k + '">Choose</button></div><div class="ab-row"><div class="ab-ic pas">★</div><div class="ab-tx"><b>' + s.passive[0] + '</b><small>Passive</small><p>' + s.passive[1] + '</p></div></div>' + withRes(abCard(s.ability), h.cls) + '</div>'; }).join('');
      done = k => { h.sub = k; learn(C.subs[k].ability); };
    } else if (L === 4) {
      body = '<h3>Choose a feat</h3>' + Object.keys(G.FEATS).map(k => '<div class="ab-row"><div class="ab-ic pas">✦</div><div class="ab-tx"><b>' + G.FEATS[k].name + '</b><p>' + G.FEATS[k].desc + (k === 'asi' ? ' (' + G.STAT_INFO[C.primary][0] + ' ' + h.stats[C.primary] + ' → ' + (h.stats[C.primary] + 2) + ')' : '') + '</p></div><button class="big" data-pick="' + k + '">Take</button></div>').join('');
      done = k => { if (k === 'asi') h.stats[C.primary] += 2; else h.feats.push(k); };
    } else {
      body = '<h3>Ultimate unlocked</h3>' + withRes(abCard(C.ult, '<button class="big" data-pick="ult">Claim</button>'), h.cls) + '<p class="dim">Your ultimate has its own slot: press F.</p>';
      done = () => { h.ult = C.ult; };
    }
    const d0 = G.derive(Object.assign({}, h, { level: L - 1 }), st), d1 = G.derive(h, st);
    show('<div class="card lvl"><div class="lvl-h"><small>LEVEL UP</small><h1>Level ' + L + '</h1><p>Max HP ' + d0.maxHp + ' → <b>' + d1.maxHp + '</b></p></div>' + body + '</div>');
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
    s += '<h3>Loadout <span class="dim">· assign abilities to Q, E, R</span></h3>';
    s += withRes(h.known.map(id => abCard(id, '<div class="slots">' + ['Q', 'E', 'R'].map((k, i) => '<button class="slot' + (h.slots[i] === id ? ' sel' : '') + '" data-slot="' + i + '" data-id="' + id + '">' + k + '</button>').join('') + '</div>')).join(''), h.cls);
    if (h.ult) s += withRes(abCard(h.ult, '<div class="slots"><span class="slot sel">F</span></div>'), h.cls);
    s += '<h3>Basic attack and passives</h3>' + withRes(abCard(C.basic), h.cls);
    if (sub) s += '<div class="ab-row"><div class="ab-ic pas">★</div><div class="ab-tx"><b>' + sub.passive[0] + '</b><small>' + sub.name + '</small><p>' + sub.passive[1] + '</p></div></div>';
    h.feats.forEach(f => s += '<div class="ab-row"><div class="ab-ic pas">✦</div><div class="ab-tx"><b>' + G.FEATS[f].name + '</b><small>Feat</small><p>' + G.FEATS[f].desc + '</p></div></div>');
    const own = G.owned(st), perks = G.DECOR.filter(x => own[x.id] && /[+%]|ward|potion|less/.test(x.perk));
    if (perks.length) s += '<h3>Hideout comforts</h3><ul class="perks">' + perks.map(x => '<li><b>' + x.name + '</b> ' + x.perk + '</li>').join('') + '</ul>';
    s += '<div class="row end"><button class="big" id="x">Done</button></div></div>';
    show(s);
    $('#sp').appendChild(G.portrait(G.lookOf(h, st), 84, 1.2));
    on('#x', () => { ui.close(); ui.topbar(); });
    on('[data-slot]', el => {
      const i = +el.dataset.slot, id = el.dataset.id, j = h.slots.indexOf(id);
      if (j === i) return;
      const prev = h.slots[i]; h.slots[i] = id; if (j >= 0) h.slots[j] = prev;
      G.save(); const sc = panel().scrollTop; ui.sheet(); panel().scrollTop = sc;
    });
  };

  // ------------------------------------------------------------ shop
  ui.shop = function () {
    const st = G.state;
    let s = '<div class="card"><h2>The Fence</h2><p class="dim">“Everything fell off a cart. Different carts.” · You have <b>' + st.coin + '</b> coin.</p>';
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
    on('[data-gear]', el => { const k = el.dataset.gear, nx = G.GEAR[k].tiers[st.gear[k] + 1]; st.coin -= nx.cost; st.gear[k]++; G.save(); G.sfx('coin'); ui.shop(); ui.topbar(); });
    on('#pot', () => { st.coin -= G.POTION_COST; st.potions++; G.save(); G.sfx('coin'); ui.shop(); ui.topbar(); });
  };
})();
