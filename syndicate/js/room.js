// Guttercrown — the room builder: tabbed catalogue, floors and walls, wall-hung pieces, furniture you can use,
// four-way rotation, comfort rating and visitors. Overrides the simpler placement UI in ui.js.
(function () {
  const G = window.G, ui = G.ui, W = G.world, $ = id => document.getElementById(id);
  const show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const H = () => W.get('hideout');
  const hexc = n => '#' + n.toString(16).padStart(6, '0');

  G.FLOORS = [
    { id: 'flag', name: 'Flagstones', cost: 0, rank: 0, desc: 'As the Guild left it.', sw: 0x9a8f80 },
    { id: 'checker', name: 'Chequerboard', cost: 80, rank: 0, desc: 'Black and bone, like a gaming house.', sw: 0x303038 },
    { id: 'wood', name: 'Scavenged Planks', cost: 90, rank: 1, desc: 'Warm underfoot. Mostly level.', sw: 0x8a5c36 },
    { id: 'carpet', name: 'Pit-Red Carpet', cost: 160, rank: 2, desc: 'Wall to wall, with a brass border.', sw: 0x8a1c24 },
    { id: 'mosaic', name: 'Old Mosaic', cost: 240, rank: 3, desc: 'Teal and gold tile from before the sealing.', sw: 0x3a9a9c }
  ];
  G.WALLS = [
    { id: 'stone', name: 'Bare Stone', cost: 0, rank: 0, desc: 'Damp, honest rock.', color: 0x857d74 },
    { id: 'plaster', name: 'Limewash', cost: 60, rank: 0, desc: 'Brightens the whole room.', color: 0xcfc6b0 },
    { id: 'panel', name: 'Wood Panelling', cost: 110, rank: 1, desc: 'Dark oak, or near enough.', color: 0x7a5234 },
    { id: 'pitred', name: 'Pit Red', cost: 150, rank: 2, desc: 'The colour of the banners.', color: 0x8a2a2e },
    { id: 'guild', name: 'Guild Violet', cost: 220, rank: 3, desc: 'You are allowed, now.', color: 0x5a3a8a }
  ];
  G.GARDENS = [
    { id: 'moss', name: 'Cave Moss', cost: 0, rank: 0, desc: 'What grew here on its own.', sw: 0x5a8a56 },
    { id: 'gravel', name: 'Raked Gravel', cost: 90, rank: 1, desc: 'A dry garden, swept in rings.', sw: 0x9a9690 },
    { id: 'glow', name: 'Glowmoss', cost: 200, rank: 3, desc: 'The floor itself gives light.', sw: 0x4ad0b0 }
  ];
  G.WALLITEMS = [
    { id: 'poster', name: 'Wanted Poster', cost: 20, rank: 0, desc: 'Somebody you have beaten. Or will.' },
    { id: 'sconce', name: 'Wall Sconce', cost: 35, rank: 0, desc: 'A lit bracket lamp.', light: 0xffb060 },
    { id: 'blades', name: 'Crossed Blades', cost: 70, rank: 1, desc: 'Two swords you no longer need.' },
    { id: 'jars', name: 'Shelf of Jars', cost: 90, rank: 1, desc: 'Glowing things in glass. Best not opened.', light: 0x8aff9a },
    { id: 'tapestry', name: 'Guild Tapestry', cost: 130, rank: 2, desc: 'Floor-length, gold on violet.' },
    { id: 'portrait', name: 'Your Portrait', cost: 180, rank: 2, desc: 'Painted from life, flatteringly.' },
    { id: 'skull', name: 'Mounted Skull', cost: 240, rank: 4, desc: 'Something large that lost.' }
  ];
  G.WALL_BY = {}; G.WALLITEMS.forEach(w => G.WALL_BY[w.id] = w);
  const room = st => st.room || (st.room = { floor: 'flag', wall: 'stone', garden: 'moss', owned: { flag: 1, stone: 1, moss: 1 } });
  G.roomOf = room;
  G.comfort = function (st) {
    const kinds = {}; let c = 0;
    (st.items || []).forEach(p => { const it = G.DECOR_BY[p.id]; if (it) { c += 4 + it.cost / 12; kinds[p.id] = 1; } });
    (st.wallItems || []).forEach(p => { const it = G.WALL_BY[p.id]; if (it) { c += 3 + it.cost / 12; kinds['w' + p.id] = 1; } });
    const r = room(st); [[G.FLOORS, r.floor], [G.WALLS, r.wall], [G.GARDENS, r.garden]].forEach(q => { const s = q[0].find(x => x.id === q[1]); if (s) c += s.cost / 10; });
    return Math.round(c + Object.keys(kinds).length * 3);
  };
  G.comfortName = c => c < 30 ? 'Bare' : c < 90 ? 'Liveable' : c < 180 ? 'Cosy' : c < 300 ? 'Handsome' : 'Envy of the Level';

  // what each piece does when you use it
  const USE = {
    bed: ['Sleep', (p, c) => pose(c, 'ko', 0.5, 'You sleep like someone with no debts. It is very convincing.')],
    bench: ['Sit', (p, c) => pose(c, 'sit', 0.28)], table: ['Sit down', (p, c) => pose(null, 'sit', 0)],
    dummy: ['Train', (p, c) => { const w = W.walker; w.emote = 'train'; w.face = Math.atan2(c.x - w.x, c.z - w.z); w.trainAt = c; }],
    bookshelf: ['Read', () => ui.codex()], desk: ['Give orders', () => ui.tally()], trophies: ['Admire', () => ui.record()],
    lantern: ['Light / douse', p => toggle(p)], firebowl: ['Light / douse', p => toggle(p)], hearth: ['Light / douse', p => toggle(p)], fountain: ['Start / stop', p => toggle(p)],
    cauldron: ['Stir', () => ui.toast('It bubbles. Something in it winks at you.')], statues: ['Salute', () => ui.toast('The statue does not salute back. You feel judged, fondly.')],
    willow: ['Rest beneath', (p, c) => pose(null, 'sit', 0, 'Light falls through the leaves like slow rain.')], crystals: ['Listen', () => ui.toast('The crystal hums. It sounds content.')], bloom: ['Listen', () => ui.toast('A low, pleased hum.')],
    glowcaps: ['Tend', () => ui.toast('You pinch off a dead cap. The rest glow a little brighter, or you imagine it.')], banner: ['Straighten', () => ui.toast('Perfect. It was already perfect.')]
  };
  function pose(c, emote, lift, msg) { const w = W.walker; if (c) { w.back = { x: w.x, z: w.z }; w.x = c.x; w.z = c.z; } w.emote = emote; w.lift = lift || 0; w.target = null; w.path = null; if (msg) ui.toast(msg); }
  function toggle(p) { p.off = !p.off; G.save(); G.sfx('place'); H().refresh(); }
  const centre = p => { const f = W.grid.footprint(G.DECOR_BY[p.id], p.r); return { x: p.x + (f[0] - 1) / 2, z: p.z + (f[1] - 1) / 2, f }; };
  function useItem(i) {
    const st = G.state, p = st.items[i], u = USE[p.id]; if (!u) return;
    const c = centre(p), w = W.walker; let best = null, bd = 1e9;
    for (let x = p.x - 1; x <= p.x + c.f[0]; x++) for (let z = p.z - 1; z <= p.z + c.f[1]; z++) { if (H().blocked(x, z)) continue; const d = Math.hypot(x - w.x, z - w.z); if (d < bd) { bd = d; best = { x, z }; } }
    if (!best || !W.findPath(H(), w, best)) return u[1](p, c);       // boxed in: no walk, just do it
    W.walkTo({ x: best.x, z: best.z, r: 0.5, go: () => u[1](p, c) });
  }

  // ------------------------------------------------------------ menus for a piece you tapped
  ui.itemMenu = function (i) {
    const st = G.state, p = st.items[i]; if (!p) return; const it = G.DECOR_BY[p.id], u = USE[p.id];
    show('<div class="card small"><h2>' + it.name + '</h2><p>' + it.perk + '</p><div class="row end">' + (u ? '<button class="big" id="us">' + u[0] + '</button>' : '') + '<button id="mv">Move</button><button id="tn">Turn</button><button id="st">Store (+' + it.cost + ')</button><button id="x">Close</button></div></div>');
    on('#x', () => ui.close());
    on('#us', () => { ui.close(); useItem(i); });
    on('#mv', () => { ui.close(); p.hidden = true; H().refresh(); ui.startPlace({ id: p.id, x: p.x, z: p.z, r: p.r, from: i }); });
    on('#tn', () => { for (let k = 1; k <= 3; k++) { const r = (p.r + k) % 4; if (H().canPlace(p.id, p.x, p.z, r, i)) { p.r = r; G.save(); G.sfx('place'); H().refresh(); return; } } ui.toast('No room to turn it here.'); });
    on('#st', () => { st.items.splice(i, 1); st.coin += it.cost; G.save(); G.sfx('coin'); H().refresh(); ui.close(); ui.topbar(); });
  };
  ui.pickUp = ui.itemMenu;
  ui.wallMenu = function (j) {
    const st = G.state, p = st.wallItems[j]; if (!p) return; const it = G.WALL_BY[p.id];
    show('<div class="card small"><h2>' + it.name + '</h2><p>' + it.desc + '</p><div class="row end"><button id="mv" class="big">Move</button><button id="st">Store (+' + it.cost + ')</button><button id="x">Close</button></div></div>');
    on('#x', () => ui.close());
    on('#mv', () => { ui.close(); p.hidden = true; H().refresh(); ui.startPlace({ id: p.id, wallItem: true, wall: p.wall, s: p.s, from: j }); });
    on('#st', () => { st.wallItems.splice(j, 1); st.coin += it.cost; G.save(); G.sfx('coin'); H().refresh(); ui.close(); ui.topbar(); });
  };
  ui.record = function () {
    const st = G.state;
    show('<div class="card small"><h2>Your Record</h2>' + G.OPPONENTS.map(o => '<div class="ab-row"><div class="ab-tx"><b>' + o.name + '</b><small>' + o.title + '</small><p>' + (st.wins[o.id] ? 'Ended ' + st.wins[o.id] + (st.wins[o.id] > 1 ? ' times' : ' time') + '. The Guild keeps finding more of them.' : 'Not yet faced, or not yet beaten.') + '</p></div></div>').join('') + '<p class="dim">Losses: ' + (st.losses || 0) + '. Comfort of this room: ' + G.comfort(st) + ' (' + G.comfortName(G.comfort(st)) + ').</p><div class="row end"><button class="big" id="x">Close</button></div></div>');
    on('#x', () => ui.close());
  };

  // ------------------------------------------------------------ the catalogue
  const TABS = [['furn', 'Furniture'], ['garden', 'Garden'], ['light', 'Lights'], ['wall', 'On the wall'], ['style', 'Floors & walls']];
  const tabOf = d => d.light && d.zone !== 'garden' && ['lantern', 'firebowl', 'hearth'].includes(d.id) ? 'light' : d.zone === 'garden' ? 'garden' : 'furn';
  ui.catalog = function (tab) {
    const st = G.state, rk = G.rankOf(st.respect), own = G.owned(st), r = room(st), cf = G.comfort(st); tab = tab || G.catTab || 'furn'; G.catTab = tab;
    let h = '<div class="card"><h2>The Quartermaster’s Catalogue</h2><p class="dim">You have <b>' + st.coin + '</b> coin. Comfort <b>' + cf + '</b>, ' + G.comfortName(cf) + '. A comfortable room draws visitors, and visitors leave coin.</p><div class="chips">' +
      TABS.map(t => '<button class="chip' + (t[0] === tab ? ' sel' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>';
    const row = (ic, col, name, sub, desc, btn, locked) => '<div class="ab-row' + (locked ? ' lockedrow' : '') + '"><div class="ab-ic pas" style="color:' + col + '">' + ic + '</div><div class="ab-tx"><b>' + name + '</b><small>' + sub + '</small><p>' + desc + '</p></div>' + btn + '</div>';
    if (tab === 'style') {
      [['floor', 'House floor', G.FLOORS], ['wall', 'House walls', G.WALLS], ['garden', 'Garden ground', G.GARDENS]].forEach(g => {
        h += '<h3>' + g[1] + '</h3>';
        g[2].forEach(s => { const have = r.owned[s.id], on2 = r[g[0]] === s.id, locked = rk < s.rank && !have;
          h += row('■', hexc(s.sw || s.color), s.name, on2 ? 'In use' : have ? 'Owned' : s.cost + ' coin', s.desc, on2 ? '<span class="lock">In use</span>' : have ? '<button class="big" data-use="' + g[0] + ':' + s.id + '">Lay it</button>' : locked ? '<span class="lock">' + G.RANKS[s.rank].name + '</span>' : '<button class="big" data-sty="' + g[0] + ':' + s.id + '"' + (st.coin < s.cost ? ' disabled' : '') + '>' + s.cost + ' coin</button>', locked); });
      });
    } else if (tab === 'wall') {
      h += '<p class="dim">These hang on the two house walls. Buy one, then tap along a wall to choose its place.</p>';
      G.WALLITEMS.forEach(d => { const locked = rk < d.rank; h += row('▣', d.light ? hexc(d.light) : 'var(--gold)', d.name, 'Wall piece · ' + (st.wallItems || []).filter(p => p.id === d.id).length + ' hung', d.desc, locked ? '<span class="lock">' + G.RANKS[d.rank].name + '</span>' : '<button class="big" data-wbuy="' + d.id + '"' + (st.coin < d.cost ? ' disabled' : '') + '>' + d.cost + ' coin</button>', locked); });
    } else G.DECOR.filter(d => tabOf(d) === tab).forEach(d => {
      const n = own[d.id] || 0, locked = rk < d.rank, full = n >= d.max;
      h += row(d.zone === 'garden' ? '❀' : d.zone === 'house' ? '⌂' : '✦', d.light ? hexc(d.light) : 'var(--gold)', d.name, (d.zone === 'any' ? 'House or garden' : d.zone === 'house' ? 'House' : 'Garden') + ' · ' + d.w + '×' + d.d + (d.max > 1 ? ' · ' + n + '/' + d.max : n ? ' · placed' : '') + (USE[d.id] ? ' · ' + USE[d.id][0].toLowerCase() : ''), d.perk,
        locked ? '<span class="lock">' + G.RANKS[d.rank].name + '</span>' : full ? '<span class="lock">Owned</span>' : '<button class="big" data-buy="' + d.id + '"' + (st.coin < d.cost ? ' disabled' : '') + '>' + d.cost + ' coin</button>', locked);
    });
    h += '<div class="row end"><button class="big" id="x">Close</button></div></div>';
    show(h);
    on('#x', () => { ui.close(); ui.topbar(); }); on('[data-tab]', el => ui.catalog(el.dataset.tab));
    on('[data-buy]', el => { const w = W.walker; ui.close(); ui.startPlace({ id: el.dataset.buy, x: Math.round(w.x), z: Math.round(w.z) + 1, r: 0, from: null }); });
    on('[data-wbuy]', el => { ui.close(); ui.startPlace({ id: el.dataset.wbuy, wallItem: true, wall: 'n', s: 2, from: null }); });
    on('[data-sty]', el => { const p = el.dataset.sty.split(':'), s = (p[0] === 'floor' ? G.FLOORS : p[0] === 'wall' ? G.WALLS : G.GARDENS).find(x => x.id === p[1]); st.coin -= s.cost; r.owned[s.id] = 1; r[p[0]] = s.id; G.save(); G.sfx('coin'); H().refresh(); ui.catalog('style'); ui.topbar(); });
    on('[data-use]', el => { const p = el.dataset.use.split(':'); r[p[0]] = p[1]; G.save(); G.sfx('place'); H().refresh(); ui.catalog('style'); });
  };

  // ------------------------------------------------------------ placing (floor pieces and wall pieces)
  ui.startPlace = function (pl) {
    const h = H();
    if (pl.wallItem) { if (!h.wallFree(pl.wall, pl.s, pl.from)) { let found = false; ['n', 'w'].forEach(wl => { for (let s = 0; s <= (wl === 'n' ? 9 : 6) && !found; s++) if (h.wallFree(wl, s, pl.from)) { pl.wall = wl; pl.s = s; found = true; } }); } }
    else if (pl.from == null && !h.canPlace(pl.id, pl.x, pl.z, pl.r)) { let best = null, bd = 1e9; for (let x = 0; x < W.grid.GW; x++) for (let z = 0; z < W.grid.GD; z++) if (h.canPlace(pl.id, x, z, 0)) { const d = Math.hypot(x - pl.x, z - pl.z); if (d < bd) { bd = d; best = [x, z]; } } if (best) { pl.x = best[0]; pl.z = best[1]; } }
    G.placing = pl; W.walker.emote = null; h.setGhost(pl); ui.placeBar();
  };
  ui.placeBar = function () {
    const pl = G.placing, bar = $('placebar');
    if (!pl || G.scene !== 'hideout') { bar.className = 'hidden'; return; }
    const it = pl.wallItem ? G.WALL_BY[pl.id] : G.DECOR_BY[pl.id];
    bar.className = '';
    bar.querySelector('span').innerHTML = '<b>' + it.name + '</b> ' + (pl.ok ? (pl.wallItem ? 'Tap along either house wall to hang it.' : 'Drag it, or tap a tile. Rugs can go under other pieces.') : '<i class="bad">' + (pl.wallItem ? 'That stretch of wall is taken.' : it.zone === 'house' ? 'Needs a free spot inside the house.' : it.zone === 'garden' ? 'Needs a free spot in the garden.' : 'That spot is taken.') + '</i>');
    $('plOk').disabled = !pl.ok; $('plRot').style.display = pl.wallItem ? 'none' : ''; $('plRot').textContent = 'Turn';
    $('plCancel').textContent = pl.from == null ? 'Cancel' : 'Put back'; $('plStore').style.display = pl.from == null ? 'none' : ''; $('plStore').textContent = 'Store (+' + it.cost + ')';
  };
  ui.placeMove = function (x, z) {
    const pl = G.placing; if (!pl) return;
    const wp = pl.wallItem && H().wallPick(x, z);
    if (wp) { pl.wall = wp.wall; pl.s = wp.s; }
    else if (pl.wallItem) { if (z <= x) { pl.wall = 'n'; pl.s = Math.max(0, Math.min(9, Math.round(x))); } else { pl.wall = 'w'; pl.s = Math.max(0, Math.min(6, Math.round(z))); } }
    else { const f = W.grid.footprint(G.DECOR_BY[pl.id], pl.r); pl.x = Math.round(x - (f[0] - 1) / 2); pl.z = Math.round(z - (f[1] - 1) / 2); }
    H().setGhost(pl); ui.placeBar();
  };
  const done = () => { G.placing = null; H().setGhost(null); H().refresh(); ui.placeBar(); ui.topbar(); G.save(); };
  $('plRot').onclick = () => { const pl = G.placing; if (!pl || pl.wallItem) return; G.sfx('ui'); pl.r = (pl.r + 1) % 4; H().setGhost(pl); ui.placeBar(); };
  $('plOk').onclick = () => {
    const pl = G.placing, st = G.state; if (!pl || !pl.ok) return;
    if (pl.wallItem) {
      const it = G.WALL_BY[pl.id]; st.wallItems = st.wallItems || [];
      if (pl.from == null) { st.coin -= it.cost; st.wallItems.push({ id: pl.id, wall: pl.wall, s: pl.s }); G.sfx('coin'); ui.toast(it.name + ' hung.'); } else { const p = st.wallItems[pl.from]; p.wall = pl.wall; p.s = pl.s; delete p.hidden; }
    } else {
      const it = G.DECOR_BY[pl.id];
      if (pl.from == null) { st.coin -= it.cost; st.items.push({ id: pl.id, x: pl.x, z: pl.z, r: pl.r }); G.sfx('coin'); ui.toast(it.name + ' placed. ' + it.perk); } else { const p = st.items[pl.from]; p.x = pl.x; p.z = pl.z; p.r = pl.r; delete p.hidden; }
      G.gfx.burst(pl.x, 0.6, pl.z, it.light || 0xffd36b, 26, 3, 4);
    }
    G.sfx('place'); done();
  };
  $('plCancel').onclick = () => { const pl = G.placing; if (!pl) return; G.sfx('ui'); if (pl.from != null) delete (pl.wallItem ? G.state.wallItems : G.state.items)[pl.from].hidden; done(); };
  $('plStore').onclick = () => { const pl = G.placing; if (!pl || pl.from == null) return; const it = pl.wallItem ? G.WALL_BY[pl.id] : G.DECOR_BY[pl.id]; (pl.wallItem ? G.state.wallItems : G.state.items).splice(pl.from, 1); G.state.coin += it.cost; G.sfx('coin'); ui.toast(it.name + ' stored. ' + it.cost + ' coin returned.'); done(); };

  // visitors' tips are collected when you come home
  const enter = ui.hideout;
  ui.hideout = function () {
    enter(); const st = G.state;
    if (st.roomTips > 0) { st.coin += st.roomTips; ui.toast('Visitors left ' + st.roomTips + ' coin on the table while you were out.'); st.roomTips = 0; G.save(); ui.topbar(); G.sfx('coin'); }
  };
})();

// main.js calls ui.placeInit() after this file loads; keep the simpler handlers from winning.
(function () {
  const G = window.G, ui = G.ui, $ = id => document.getElementById(id);
  const old = ui.placeInit, mine = { r: $('plRot').onclick, o: $('plOk').onclick, c: $('plCancel').onclick, s: $('plStore').onclick };
  ui.placeInit = function () { old(); $('plRot').onclick = mine.r; $('plOk').onclick = mine.o; $('plCancel').onclick = mine.c; $('plStore').onclick = mine.s; };
})();
