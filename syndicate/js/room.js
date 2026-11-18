// Guttercrown — the room builder: tabbed catalogue, floors and walls, wall-hung pieces, furniture you can use,
// four-way rotation, comfort rating and visitors. Overrides the simpler placement UI in ui.js.
(function () {
  const G = window.G, T = THREE, ui = G.ui, W = G.world, $ = id => document.getElementById(id);
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
  G.ROOM_USE = USE;
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
  // Pages down the left, a grid of pictured tiles in the middle, and a preview of whatever is selected.
  const TABS = [['furn', 'Furniture', '⌂', 'Beds, tables, shelves and the things that make a cellar a home. Many give a small edge in the pit.'], ['garden', 'Garden', '❀', 'For the cavern outside your door. Most of it glows.'], ['light', 'Lights', '✦', 'Lamps and fires. Each one lights the room around it.'], ['wall', 'Wall pieces', '▣', 'These hang on the two house walls. Buy one, then tap along a wall to choose its place.'], ['use', 'Useful', '☼', 'Pieces that do something: sleep, sit, train, change kit, bank your coin, roll dice.'], ['style', 'Floors & walls', '■', 'Relay the floor, redo the walls, or change the garden ground. Bought once, yours to swap for good.']];
  const tabOf = d => d.light && d.zone !== 'garden' && ['lantern', 'firebowl', 'hearth'].includes(d.id) ? 'light' : d.zone === 'garden' ? 'garden' : 'furn';
  // thumbnails: each piece rendered once from the same angle the room is seen from
  let tr = null, tsc, tcam; const tcache = {};
  G.furniThumb = function (kind, id) {
    const key = kind + ':' + id;
    if (tcache[key] == null) {
      try {
        if (!tr) { tr = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); tr.setSize(144, 144, false); tr.toneMapping = T.ACESFilmicToneMapping; tr.toneMappingExposure = 1.35; tsc = new T.Scene(); tsc.add(new T.HemisphereLight(0xb0a8d0, 0x3a2c24, 1.5)); const dl = new T.DirectionalLight(0xffe0c0, 2.4); dl.position.set(2, 6, 5); tsc.add(dl); tcam = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 80); }
        let g; if (kind === 'wall') { g = new T.Group(); W.wallBuilders()[id](g); } else g = W.buildItem(id, 0);
        tsc.add(g); g.updateMatrixWorld(true);
        const bb = new T.Box3(); g.traverse(o => { if (o.isMesh) { o.geometry.computeBoundingBox(); bb.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld)); } });
        const c = bb.getCenter(new T.Vector3()), sz = bb.getSize(new T.Vector3()), rad = Math.max(0.45, sz.length() / 2 * 0.9);
        tcam.left = tcam.bottom = -rad; tcam.right = tcam.top = rad; tcam.updateProjectionMatrix();
        if (kind === 'wall') tcam.position.set(c.x + 6, c.y + 3, c.z + 12); else tcam.position.set(c.x + 10, c.y + 8.2, c.z + 10);
        tcam.lookAt(c); tr.render(tsc, tcam); tcache[key] = tr.domElement.toDataURL('image/png'); tsc.remove(g);
      } catch (e) { tcache[key] = ''; }
    }
    return tcache[key];
  };
  ui.catalog = function (tab, sel) {
    const st = G.state, rk = G.rankOf(st.respect), own = G.owned(st), r = room(st), cf = G.comfort(st); tab = tab || G.catTab || 'furn'; G.catTab = tab;
    const T0 = TABS.find(t => t[0] === tab) || TABS[0];
    // every page is a flat list of entries so the grid and the preview do not care what kind of thing it is
    let items = [];
    if (tab === 'style') [['floor', 'Floor', G.FLOORS], ['wall', 'Walls', G.WALLS], ['garden', 'Garden ground', G.GARDENS]].forEach(g => g[2].forEach(x => { const have = r.owned[x.id], inuse = r[g[0]] === x.id;
      items.push({ key: g[0] + ':' + x.id, kind: 'style', name: x.name, cost: x.cost, rank: x.rank, desc: x.desc, col: hexc(x.sw || x.color), meta: [g[1], inuse ? 'In use' : have ? 'Owned' : 'Not owned'], locked: rk < x.rank && !have, badge: inuse ? '✔' : have ? '•' : '', act: inuse ? null : have ? ['Lay it', 'use'] : ['Buy · ' + x.cost, 'sty'], have: have }); }));
    else if (tab === 'wall') G.WALLITEMS.forEach(d => { const n = (st.wallItems || []).filter(q => q.id === d.id).length; items.push({ key: 'w:' + d.id, id: d.id, kind: 'wall', name: d.name, cost: d.cost, rank: d.rank, desc: d.desc, light: d.light, meta: ['Wall piece', n ? n + ' hung' : 'None hung'], locked: rk < d.rank, badge: n ? '×' + n : '', act: ['Buy and hang · ' + d.cost, 'wbuy'] }); });
    else G.DECOR.filter(d => tab === 'use' ? !!USE[d.id] : tabOf(d) === tab).forEach(d => { const n = own[d.id] || 0, full = n >= d.max;
      items.push({ key: 'f:' + d.id, id: d.id, kind: 'furn', name: d.name, cost: d.cost, rank: d.rank, desc: d.perk, light: d.light, meta: [d.zone === 'any' ? 'House or garden' : d.zone === 'house' ? 'House only' : 'Garden only', d.w + ' × ' + d.d + ' tiles', 'Own ' + n + ' of ' + d.max].concat(USE[d.id] ? ['You can ' + USE[d.id][0].toLowerCase()] : []), locked: rk < d.rank, full, badge: n ? (d.max > 1 ? n + '/' + d.max : '✔') : '', act: full ? null : ['Buy and place · ' + d.cost, 'buy'] }); });
    sel = sel || G.catSel; let cur = items.find(x => x.key === sel) || items.find(x => !x.locked && x.act) || items[0];
    const thumb = (x, big) => x.kind === 'style' ? '<span class="iso' + (big ? ' big' : '') + '" style="--c:' + x.col + '"></span>' : (() => { const u = G.furniThumb(x.kind, x.id); return u ? '<img src="' + u + '" alt="">' : '<span class="iso" style="--c:#6a5a4a"></span>'; })();
    const tile = x => '<button class="ct' + (x.key === cur.key ? ' sel' : '') + (x.locked ? ' lk' : '') + (x.full ? ' full' : '') + '" data-k="' + x.key + '" title="' + x.name + '">' + thumb(x) + (x.badge ? '<i class="bd">' + x.badge + '</i>' : '') + (x.locked ? '<i class="lkk">🔒</i>' : '<i class="pr">' + (x.cost ? x.cost : 'free') + '</i>') + '</button>';
    const preview = x => '<div class="cp-pic">' + thumb(x, true) + '</div><b class="cp-name">' + x.name + '</b><p class="cp-desc">' + x.desc + '</p><ul class="cp-meta">' + x.meta.map(m => '<li>' + m + '</li>').join('') + (x.light ? '<li><span class="dot" style="background:' + hexc(x.light) + '"></span>Gives light</li>' : '') + '</ul>' +
      (x.locked ? '<div class="cp-lock">Needs rank <b style="color:' + G.RANKS[x.rank].color + '">' + G.RANKS[x.rank].name + '</b></div>' : !x.act ? '<div class="cp-lock">' + (x.kind === 'style' ? 'Already in use' : 'You own as many as will fit') + '</div>' :
        '<div class="cp-buy"><span class="cp-price"><span class="coin"></span>' + (x.act[1] === 'use' ? 'Owned' : x.cost) + '</span><button class="big" id="cpGo"' + (x.act[1] !== 'use' && st.coin < x.cost ? ' disabled' : '') + '>' + (x.act[1] !== 'use' && st.coin < x.cost ? 'Not enough coin' : x.act[0].split(' · ')[0]) + '</button></div>');
    show('<div class="card catcard"><h2>The Quartermaster’s Catalogue</h2><div class="cat">' +
      '<nav class="cat-nav">' + TABS.map(t => '<button class="cn' + (t[0] === tab ? ' sel' : '') + '" data-tab="' + t[0] + '"><i>' + t[2] + '</i><span>' + t[1] + '</span></button>').join('') + '</nav>' +
      '<section class="cat-main"><div class="cat-head"><b>' + T0[1] + '</b><p>' + T0[3] + '</p></div><div class="cat-grid">' + items.map(tile).join('') + '</div></section>' +
      '<aside class="cat-prev" id="catPrev">' + preview(cur) + '</aside></div>' +
      '<div class="cat-foot"><span class="cat-purse"><span class="coin"></span><b>' + st.coin + '</b> coin</span><span class="cat-comf">Comfort <b>' + cf + '</b> · ' + G.comfortName(cf) + '</span><button class="big" id="x">Close</button></div></div>');
    const go = () => {
      const x = cur; if (!x.act || x.locked) return; const k = x.act[1], pr = x.key.split(':');
      if (k === 'buy') { const w = W.walker; ui.close(); ui.startPlace({ id: x.id, x: Math.round(w.x), z: Math.round(w.z) + 1, r: 0, from: null }); }
      else if (k === 'wbuy') { ui.close(); ui.startPlace({ id: x.id, wallItem: true, wall: 'n', s: 2, from: null }); }
      else if (k === 'sty') { if (st.coin < x.cost) return; st.coin -= x.cost; r.owned[pr[1]] = 1; r[pr[0]] = pr[1]; G.save(); G.sfx('coin'); H().refresh(); ui.topbar(); ui.catalog('style', x.key); }
      else if (k === 'use') { r[pr[0]] = pr[1]; G.save(); G.sfx('place'); H().refresh(); ui.catalog('style', x.key); }
    };
    const wireGo = () => { const b = $('cpGo'); if (b) b.onclick = () => go(); };
    wireGo();
    on('#x', () => { ui.close(); ui.topbar(); }); on('[data-tab]', el => { G.catSel = null; ui.catalog(el.dataset.tab); });
    on('[data-k]', (el, e) => { const x = items.find(q => q.key === el.dataset.k); if (!x) return; if (cur === x && e.detail > 1) return go(); cur = x; G.catSel = x.key; G.sfx('ui'); document.querySelectorAll('#panel .ct').forEach(q => q.classList.toggle('sel', q === el)); $('catPrev').innerHTML = preview(x); wireGo(); });
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
