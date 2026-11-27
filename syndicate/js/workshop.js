// Guttercrown — the character registry and the Workshop.
// Every character the game builds carries an id (see assets/REGISTRY.md). The Workshop, open only to the artifact's
// owner (or anyone running the game from disk), edits a character's frame, people, size, colours and cosmetics on a
// turning preview. Saving asks for confirmation, then writes the change to the published page's store (edits/looks),
// which every player reads when the game opens: the character changes in the game for everyone, no republish needed.
// "Copy for Claude" gives the same change as JSON, to be written into the code for good.
(function () {
  'use strict';
  const G = window.G, T = THREE;
  G.LOOKDEF = G.LOOKDEF || {};
  const EDITS = G.LOOK_EDITS = {};
  const SEEN = {}, BUILT = {};                     // SEEN: each id's own look as the code wrote it; BUILT: models in the world, to rebuild after a save
  const clone = o => JSON.parse(JSON.stringify(o || {}));
  // the colour a body part really shows: its class's base, then the look's own colours, then any dye on top
  const colourOf = (look, k) => { if (k === 'skin') return look.skin || (G.RACES[look.race] || {}).skin; const D = look.cos && look.cos.dye && G.DYES && G.DYES[look.cos.dye]; if (D && D[k] != null) return D[k]; return (look.tint || {})[k] != null ? look.tint[k] : (G.MODEL_BASE[look.cls] || {})[k]; };
  const hexs = v => typeof v === 'number' ? '#' + v.toString(16).padStart(6, '0') : (v || '#888888');
  const COLS = [['cloth', 'Cloth'], ['armor', 'Armour'], ['armor2', 'Armour, dark'], ['trim', 'Trim'], ['legs', 'Legs'], ['hair', 'Hair'], ['skin', 'Skin']];
  const SLOTS = [['head', 'Hat'], ['back', 'Back'], ['dye', 'Dye'], ['aura', 'Aura'], ['weapon', 'Weapon skin']];
  const FRAMES = ['fighter', 'rogue', 'sorcerer', 'warlock', 'cleric', 'druid'];

  function merge(look, e) {
    if (!e) return look; const o = Object.assign({}, look);
    ['cls', 'race', 'scale', 'skin'].forEach(k => { if (e[k] != null && e[k] !== '') o[k] = e[k]; });
    if (e.tint) o.tint = Object.assign({}, look.tint || {}, e.tint);
    if (e.cos) { o.cos = Object.assign({}, look.cos || {}); Object.keys(e.cos).forEach(k => { if (e.cos[k] === 'none') delete o.cos[k]; else if (e.cos[k]) o.cos[k] = e.cos[k]; }); }
    const D = o.cos && o.cos.dye && G.DYES && G.DYES[o.cos.dye];       // a dye repaints cloth, armour, trim and legs after the colours: when one of those is edited, write the dye out as colours and let the edit win
    if (D && e.tint && Object.keys(e.tint).some(k => D[k] != null)) { const dt = {}; Object.keys(D).forEach(k => dt[k] = hexs(D[k])); o.tint = Object.assign({}, look.tint || {}, dt, e.tint); o.cos = Object.assign({}, o.cos); delete o.cos.dye; }
    return o;
  }

  // ---------------------------------------------------------------- every model with an id is built with its edit, and remembered
  const mk0 = G.makeChar;
  G.makeChar = function (look) {
    if (!look || !look.id) return mk0.apply(this, arguments);
    if (!SEEN[look.id]) SEEN[look.id] = clone(look);
    const c = mk0.call(this, merge(look, EDITS[look.id]));
    (BUILT[look.id] = BUILT[look.id] || []).push({ c, look }); if (BUILT[look.id].length > 12) BUILT[look.id] = BUILT[look.id].filter(b => b.c.root && b.c.root.parent);
    return c;
  };
  function rebuild(id) {
    (BUILT[id] || []).forEach(b => { const old = b.c.root, par = old && old.parent; if (!par) return;
      const n = mk0(merge(b.look, EDITS[id])); n.root.position.copy(old.position); n.root.rotation.copy(old.rotation); n.root.scale.copy(old.scale); n.root.visible = old.visible;
      par.add(n.root); par.remove(old); Object.assign(b.c, n); });
  }

  // ---------------------------------------------------------------- the named fighters keep their colours on their own records (portraits read them too)
  const ORIG = {};
  const fighters = () => [].concat(G.OPPONENTS || [], (G.ascent && G.ascent.FOES) || []).filter(o => o && o.id && !o.gen);
  function applyFighter(o) {
    if (!ORIG[o.id]) ORIG[o.id] = { tint: clone(o.tint), scale: o.scale, cos: clone(o.cos) };
    const e = EDITS['fighter:' + o.id] || {}, b = ORIG[o.id];
    o.tint = Object.assign({}, b.tint, e.tint || {}); o.scale = e.scale || b.scale;
    if (o.look) { o.look.tint = o.tint; if (o.scale) o.look.scale = o.scale; if (e.cos) o.look.cos = merge({ cos: o.look.cos }, { cos: e.cos }).cos; }
  }
  const applyAll = () => fighters().forEach(applyFighter);

  // ---------------------------------------------------------------- the registry: who exists, what they look like by default, where the code keeps them
  const NPC = [
    ['The market', [['marc', 'Marc dé Fleuprau', 'js/mark.js'], ['pip', 'Pip Tallow', 'js/guide.js'], ['fence', 'The Fence', 'js/places.js'], ['guildmaster', 'The Guildmaster', 'js/places.js'], ['dedrick', 'Sir Dedrick III', 'js/dice.js'], ['tibb', 'Old Marrow Tibb', 'js/guide.js'], ['carr', 'Sergeant Ysolde Carr', 'js/guide.js'], ['ilva', 'Ilvaren of the Hanging Markets', 'js/guide.js'], ['david', 'David Roseinbeirg', 'js/oracle.js']]],
    ['The pit', [['ledger-keeper', 'The Ledger-Keeper, in the Guild box', 'js/life.js'], ['box-guard-west', 'Guild box guard, west', 'js/life.js'], ['box-guard-east', 'Guild box guard, east', 'js/life.js'], ['pit-guard-west', 'Pit gate guard, west', 'js/life.js'], ['pit-guard-east', 'Pit gate guard, east', 'js/life.js']]],
    ['The Long Stair and the throne', [['stair-warden-elf', 'Seal-Warden at the Stair (elf)', 'js/life.js'], ['stair-warden-human', 'Seal-Warden at the Stair (human)', 'js/life.js'], ['throne-king', 'King Vilhelm van Koheneim IV', 'js/cine.js'], ['throne-queen', 'Queen Eerin Koheneim', 'js/cine.js']]],
    ['Townsfolk', [['marcs-punter', 'Marc’s punter', 'js/places.js'], ['wisp-gambler', 'Gambler at the Wisp Table', 'js/life.js'], ['odds-arguer-human', 'Arguing about the odds (human)', 'js/life.js'], ['odds-arguer-dwarf', 'Arguing about the odds (dwarf)', 'js/life.js'], ['busker', 'The busker', 'js/life.js'],
      ['stallkeeper-dwarf', 'Stall-keeper (dwarf)', 'js/places.js'], ['stallkeeper-halforc', 'Stall-keeper (half-orc)', 'js/places.js'], ['stallkeeper-human', 'Stall-keeper (human)', 'js/places.js'], ['stallkeeper-tiefling', 'Stall-keeper (tiefling)', 'js/places.js'],
      ['corner-sitter-dwarf', 'Sitting in the corner (dwarf)', 'js/places.js'], ['corner-sitter-human', 'Sitting in the corner (human)', 'js/places.js'],
      ['tallow-neighbour-dwarf', 'Tallow Row neighbour (dwarf)', 'js/places.js'], ['tallow-neighbour-child', 'Tallow Row neighbour (child)', 'js/places.js'], ['tallow-neighbour-halforc', 'Tallow Row neighbour (half-orc)', 'js/places.js'],
      ['passer-by-1', 'Passer-by 1', 'js/places.js'], ['passer-by-2', 'Passer-by 2', 'js/places.js'], ['passer-by-3', 'Passer-by 3', 'js/places.js'],
      ['knife-kid', 'The knife-throwing kid', 'js/knives.js'], ['knuckle-fighter', 'The knuckle fighter', 'js/knuckle.js']]]
  ];
  function warm() { try { G.world.get('hub'); G.world.get('arena'); } catch (e) { } }       // building the market and the pit records every look in them
  G.registry = function () {
    warm(); const out = [];
    const led = (G.OPPONENTS || []).filter(o => o.id && !o.gen), stair = ((G.ascent && G.ascent.FOES) || []);
    led.forEach(o => out.push({ id: 'fighter:' + o.id, name: o.name + (o.title ? ' ' + o.title : ''), group: 'Fighters on the Ledger', file: 'js/data.js', fighter: o }));
    stair.forEach(o => out.push({ id: 'fighter:' + o.id, name: o.name + (o.title ? ', ' + o.title : ''), group: 'The Long Stair', file: 'js/ascent.js', fighter: o }));
    NPC.forEach(([grp, list]) => list.forEach(([id, name, file]) => out.push({ id, name, group: grp, file })));
    return out;
  };
  const baseOf = r => r.fighter ? { cls: r.fighter.cls, race: r.fighter.race, tint: clone((ORIG[r.fighter.id] || r.fighter).tint), scale: (ORIG[r.fighter.id] || r.fighter).scale || 1, cos: clone(r.fighter.look ? (ORIG[r.fighter.id] || {}).cos || r.fighter.look.cos : null) }
    : clone(SEEN[r.id] || G.LOOKDEF[r.id] || (r.id === 'marc' && G.mark && G.mark.look) || (r.id === 'david' && G.oracle && G.oracle.look && G.oracle.look()) || null);

  // ---------------------------------------------------------------- reading and writing the saved edits
  let db = null, owner = false;
  G.workshopReady = (async () => {
    if (!window.claude || !window.claude.use) return;
    try { const [d, u] = await Promise.all([window.claude.use('db'), window.claude.use('user')]); db = d; owner = !!(u && (await u.isOwner())); } catch (e) { return; }
    if (!db) return;
    try { const s = await db.doc('edits/looks').get(); const looks = s.exists && s.data().looks; if (looks) { Object.assign(EDITS, clone(looks)); applyAll(); Object.keys(EDITS).forEach(rebuild); } } catch (e) { }
    if (owner && G.scene === 'title' && G.ui && G.ui.title) addButton();
  })();
  const local = location.protocol === 'file:';       // running from disk: the developer's own copy
  G.workshopAllowed = () => owner || local;

  // ---------------------------------------------------------------- the title screen gets a Workshop button for the owner
  function addButton() { const m = document.querySelector('#panel .title-wrap .menu, #panel .t-btns'); if (!m || m.querySelector('#bShop')) return;
    const b = document.createElement('button'); b.id = 'bShop'; b.textContent = 'Workshop'; b.onclick = () => { G.audioInit && G.audioInit(); G.sfx && G.sfx('ui'); open(); }; m.appendChild(b); }
  const title0 = G.ui.title; G.ui.title = function () { const r = title0.apply(this, arguments); if (G.workshopAllowed()) addButton(); return r; };

  // ---------------------------------------------------------------- the editor
  let el = null, rend = null, scn = null, cam = null, cur = null, live = null, edit = {}, pose = 'idle', spin = 0.5, raf = 0, t0 = 0, drag = null;
  const css = `#workshop{position:fixed;inset:0;z-index:90;display:grid;grid-template-columns:minmax(200px,260px) 1fr minmax(240px,300px);background:#100d12;color:#e8dcc0;font:14px/1.35 var(--body,Georgia,serif)}
#workshop *{box-sizing:border-box}#workshop h2{font-family:var(--title,Georgia,serif);color:#f6dc8a;margin:0 0 6px;font-size:1.5rem}
#workshop .ws-list{overflow:auto;border-right:1px solid #3a2f2a;padding:calc(10px + env(safe-area-inset-top,0px)) 10px 10px max(10px,env(safe-area-inset-left,0px))}
#workshop .ws-pick{display:none}
#workshop .ws-list input{width:100%;margin:0 0 8px;font:inherit;padding:6px 8px;background:#1d1720;border:1px solid #3a2f2a;color:inherit;border-radius:4px}
#workshop .ws-g{font-family:var(--display,Georgia,serif);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#b9a986;margin:10px 0 4px}
#workshop .ws-i{display:block;width:100%;text-align:left;text-transform:none;letter-spacing:0;font:inherit;font-size:.9rem;padding:5px 8px;margin:1px 0;background:none;border:1px solid transparent;color:inherit;border-radius:4px;box-shadow:none}
#workshop .ws-i.on{border-color:#e0b04a;background:rgba(224,176,74,.14)}#workshop .ws-i .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#e0b04a;margin-left:6px}
#workshop .ws-view{position:relative;min-width:0}#workshop canvas{display:block;width:100%;height:100%;touch-action:none;cursor:grab}
#workshop .ws-top{position:absolute;left:12px;right:12px;top:calc(10px + env(safe-area-inset-top,0px));display:flex;justify-content:space-between;gap:8px;pointer-events:none}
#workshop .ws-top>*{pointer-events:auto}#workshop .ws-name b{display:block;font-family:var(--title,Georgia,serif);font-size:1.6rem;color:#f6dc8a}#workshop .ws-name small{color:#b9a986}
#workshop .ws-poses{position:absolute;left:0;right:0;bottom:calc(10px + env(safe-area-inset-bottom,0px));display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
#workshop .ws-poses button,#workshop .ws-ctl button{font-size:.72rem;padding:.5em .8em}#workshop .ws-poses button.on{outline:2px solid #e0b04a}
#workshop .ws-ctl{overflow:auto;border-left:1px solid #3a2f2a;padding:calc(10px + env(safe-area-inset-top,0px)) max(12px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) 12px;display:flex;flex-direction:column;gap:10px}
#workshop label{display:grid;grid-template-columns:7.5em 1fr auto;align-items:center;gap:6px;font-size:.88rem}
#workshop select,#workshop input[type=range]{width:100%;min-width:0;font:inherit;background:#1d1720;color:inherit;border:1px solid #3a2f2a;border-radius:4px;padding:3px}
#workshop input[type=color]{width:100%;height:28px;border:1px solid #3a2f2a;border-radius:4px;background:#1d1720;padding:1px}
#workshop .ws-x{background:none;border:0;box-shadow:none;color:#b9a986;font-size:.75rem;padding:2px 4px;text-transform:none;letter-spacing:0}
#workshop .ws-x[disabled]{visibility:hidden}#workshop .ws-h{font-family:var(--display,Georgia,serif);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#b9a986;border-bottom:1px solid #3a2f2a;padding-bottom:3px}
#workshop .ws-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}#workshop .ws-note{font-size:.8rem;color:#b9a986}
#workshop .ws-modal{position:absolute;inset:0;background:rgba(5,4,8,.72);display:grid;place-items:center;padding:16px;z-index:2}
#workshop .ws-card{background:#1d1720;border:1px solid #8a6a34;border-radius:6px;padding:18px;max-width:440px;width:100%;max-height:90%;overflow:auto}
#workshop .ws-diff{margin:10px 0;padding:0;list-style:none;font-size:.9rem}#workshop .ws-diff li{display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid #2a2228}
#workshop .sw{display:inline-block;width:18px;height:14px;border:1px solid #000;border-radius:2px;vertical-align:middle}
@media (max-width:760px){#workshop .ws-pick{display:block;width:100%;margin:0 0 4px}#workshop .ws-list input[type=search]{display:none}#workshop{grid-template-columns:1fr;grid-template-rows:auto 42vh 1fr}#workshop .ws-list{max-height:none;border-right:0;border-bottom:1px solid #3a2f2a;padding-bottom:6px}#workshop .ws-list .ws-all{display:none}#workshop .ws-ctl{border-left:0}}`;
  function open() {
    if (!G.workshopAllowed()) return; G.ui.close && G.ui.close(); applyAll();
    if (!document.getElementById('wscss')) { const s = document.createElement('style'); s.id = 'wscss'; s.textContent = css; document.head.appendChild(s); }
    el = document.createElement('div'); el.id = 'workshop';
    el.innerHTML = '<div class="ws-list"><h2>Workshop</h2><select class="ws-pick" aria-label="Character"></select><input type="search" placeholder="Find a character" aria-label="Find a character"><div class="ws-all"></div></div>' +
      '<div class="ws-view"><canvas></canvas><div class="ws-top"><div class="ws-name"><b></b><small></small></div><button class="ws-close">Close</button></div><div class="ws-poses"></div></div><div class="ws-ctl"></div>';
    document.body.appendChild(el); G.workshopOpen = true;
    const reg = G.registry(), list = el.querySelector('.ws-all'), pick = el.querySelector('.ws-pick');
    const drawList = q => { list.innerHTML = ''; let g = ''; reg.filter(r => !q || r.name.toLowerCase().includes(q)).forEach(r => { if (r.group !== g) { g = r.group; const h = document.createElement('div'); h.className = 'ws-g'; h.textContent = g; list.appendChild(h); }
      const b = document.createElement('button'); b.className = 'ws-i' + (cur && cur.id === r.id ? ' on' : ''); b.textContent = r.name; if (EDITS[r.id]) { const d = document.createElement('span'); d.className = 'dot'; d.title = 'Edited'; b.appendChild(d); } b.onclick = () => choose(r); list.appendChild(b); }); };
    pick.innerHTML = reg.map((r, i) => '<option value="' + i + '">' + G.esc(r.group + ' · ' + r.name) + (EDITS[r.id] ? ' •' : '') + '</option>').join(''); pick.onchange = () => choose(reg[+pick.value]);
    el.querySelector('input[type=search]').oninput = e => drawList(e.target.value.trim().toLowerCase());
    el.querySelector('.ws-close').onclick = close;
    el.querySelector('.ws-poses').innerHTML = [['idle', 'Stand'], ['walk', 'Walk'], ['swing', 'Swing'], ['cast', 'Cast'], ['guard', 'Guard'], ['cheer', 'Cheer'], ['ko', 'Down']].map(p => '<button data-pose="' + p[0] + '"' + (p[0] === pose ? ' class="on"' : '') + '>' + p[1] + '</button>').join('');
    el.querySelectorAll('[data-pose]').forEach(b => b.onclick = () => { pose = b.dataset.pose; el.querySelectorAll('[data-pose]').forEach(x => x.classList.toggle('on', x === b)); });
    const cv = el.querySelector('canvas');
    rend = new T.WebGLRenderer({ canvas: cv, antialias: true }); rend.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); rend.outputColorSpace = T.SRGBColorSpace;
    scn = new T.Scene(); scn.background = new T.Color(0x16121a); scn.add(new T.AmbientLight(0xfff0e0, 1.1)); scn.add(new T.HemisphereLight(0xfff2dc, 0x3a3040, 2.2)); const key = new T.DirectionalLight(0xffe2c0, 3.2); key.position.set(3, 5, 4); scn.add(key); const rim = new T.DirectionalLight(0x9fb8ff, 1.6); rim.position.set(-4, 3, -3); scn.add(rim);
    const fl = new T.Mesh(new T.CircleGeometry(1.6, 40), new T.MeshLambertMaterial({ color: 0x3a2c22 })); fl.rotation.x = -Math.PI / 2; scn.add(fl);
    cam = new T.PerspectiveCamera(30, 1, 0.1, 50); cam.position.set(0, 1.3, 6.6); cam.lookAt(0, 0.95, 0);
    cv.onpointerdown = e => { drag = { x: e.clientX, s: spin }; cv.setPointerCapture(e.pointerId); }; cv.onpointermove = e => { if (drag) spin = drag.s + (e.clientX - drag.x) * 0.012; }; cv.onpointerup = cv.onpointercancel = () => { drag = null; };
    drawList(''); choose(reg.find(r => r.id === 'marc') || reg[0]); t0 = performance.now(); loop();
  }
  function close() { cancelAnimationFrame(raf); raf = 0; if (rend) { rend.dispose(); rend = null; } if (el) el.remove(); el = null; G.workshopOpen = false; G.ui.title && G.scene === 'title' && G.ui.title(); }
  function loop() { raf = requestAnimationFrame(loop); if (!el || !rend) return; const cv = rend.domElement, w = cv.clientWidth, h = cv.clientHeight; if (cv.width !== Math.floor(w * rend.getPixelRatio()) || cv.height !== Math.floor(h * rend.getPixelRatio())) { rend.setSize(w, h, false); cam.aspect = w / Math.max(1, h); cam.updateProjectionMatrix(); }
    const t = (performance.now() - t0) / 1000; if (live) { if (!drag) spin += 0.004; live.root.rotation.y = spin; const k = (t * 0.9) % 1, p = pose;
      live.pose(p === 'walk' ? { t, act: 'idle', moving: true, walk: t * 9 } : p === 'swing' ? { t, act: 'swing', prog: k, step: Math.floor(t * 0.9) % 3 } : p === 'cast' ? { t, act: 'cast', prog: Math.min(1, k * 1.4) } : p === 'guard' ? { t, act: 'idle', guard: true, ready: 1 } : p === 'ko' ? { t, act: 'ko' } : p === 'cheer' ? { t, act: 'cheer', prog: k } : { t, act: 'idle', ready: 1 }); }
    rend.render(scn, cam); }
  const effective = () => merge(cur.base, edit);
  function show() { if (live) scn.remove(live.root); live = null; try { live = mk0(effective()); scn.add(live.root); } catch (e) { } }
  function choose(r) {
    cur = r; cur.base = baseOf(r) || { cls: 'fighter', race: 'human' }; edit = clone(EDITS[r.id]);
    el.querySelector('.ws-name b').textContent = r.name; el.querySelector('.ws-name small').textContent = r.group + ' · ' + r.file + ' · id ' + r.id;
    el.querySelectorAll('.ws-i').forEach(b => b.classList.toggle('on', b.firstChild && b.firstChild.textContent === r.name));
    const reg = G.registry(), pk = el.querySelector('.ws-pick'); pk.value = String(reg.findIndex(q => q.id === r.id));
    controls(); show();
  }
  function controls() {
    const c = el.querySelector('.ws-ctl'), e = effective(), fighter = !!cur.fighter, base = G.MODEL_BASE[e.cls] || {}, race = G.RACES[e.race] || {};
    const colOf = k => hexs(colourOf(e, k));
    const opt = (v, list, none) => (none ? '<option value="">' + none + '</option>' : '') + list.map(x => '<option value="' + x[0] + '"' + (x[0] === v ? ' selected' : '') + '>' + G.esc(x[1]) + '</option>').join('');
    const cosOf = s => [['none', 'None']].concat((G.COSMETICS || []).filter(x => x.slot === s).map(x => [x.id, x.name]));
    let h = '<div class="ws-h">Body</div>';
    if (!fighter) { h += '<label>Frame<select data-k="cls">' + opt(e.cls, FRAMES.map(f => [f, f[0].toUpperCase() + f.slice(1)])) + '</select><button class="ws-x" data-r="cls"' + (edit.cls ? '' : ' disabled') + '>reset</button></label>';
      h += '<label>People<select data-k="race">' + opt(e.race, Object.keys(G.RACES).map(k => [k, G.RACES[k].name])) + '</select><button class="ws-x" data-r="race"' + (edit.race ? '' : ' disabled') + '>reset</button></label>'; }
    h += '<label>Size<input type="range" min="0.6" max="1.4" step="0.02" data-k="scale" value="' + (e.scale || 1) + '"><button class="ws-x" data-r="scale"' + (edit.scale ? '' : ' disabled') + '>reset</button></label>';
    h += '<div class="ws-h">Colours</div>' + COLS.filter(k => !(fighter && k[0] === 'skin')).map(k => '<label>' + k[1] + '<input type="color" data-c="' + k[0] + '" value="' + colOf(k[0]).slice(0, 7) + '"><button class="ws-x" data-rc="' + k[0] + '"' + ((k[0] === 'skin' ? edit.skin : (edit.tint || {})[k[0]]) ? '' : ' disabled') + '>reset</button></label>').join('');
    h += '<div class="ws-h">Cosmetics</div>' + SLOTS.map(s => '<label>' + s[1] + '<select data-s="' + s[0] + '">' + opt((e.cos || {})[s[0]] || 'none', cosOf(s[0])) + '</select><button class="ws-x" data-rs="' + s[0] + '"' + ((edit.cos || {})[s[0]] ? '' : ' disabled') + '>reset</button></label>').join('');
    if (fighter) h += '<p class="ws-note">A fighter’s frame and people decide how they fight, so only their looks are edited here.</p>';
    h += '<div class="ws-btns"><button class="big ws-save"' + (db && owner ? '' : ' disabled') + '>Save…</button><button class="ws-revert"' + (EDITS[cur.id] || Object.keys(edit).length ? '' : ' disabled') + '>Back to original</button><button class="ws-copy">Copy for Claude</button></div>';
    h += '<p class="ws-note">' + (db && owner ? 'Saving changes this character in the game for everyone who plays it.' : 'Saving needs the published game, opened by its owner. You can still copy the change for Claude to put in the code.') + '</p>';
    c.innerHTML = h;
    const upd = () => { show(); controls(); };
    c.querySelectorAll('[data-k]').forEach(i => i.oninput = i.onchange = () => { const v = i.dataset.k === 'scale' ? +i.value : i.value; edit[i.dataset.k] = v; if (i.dataset.k === 'scale') show(); else upd(); });
    c.querySelectorAll('[data-k=scale]').forEach(i => i.onchange = upd);
    c.querySelectorAll('[data-c]').forEach(i => { i.oninput = () => { const k = i.dataset.c; if (k === 'skin') edit.skin = i.value; else (edit.tint = edit.tint || {})[k] = i.value; show(); }; i.onchange = upd; });
    c.querySelectorAll('[data-s]').forEach(i => i.onchange = () => { (edit.cos = edit.cos || {})[i.dataset.s] = i.value; upd(); });
    c.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { delete edit[b.dataset.r]; upd(); });
    c.querySelectorAll('[data-rc]').forEach(b => b.onclick = () => { const k = b.dataset.rc; if (k === 'skin') delete edit.skin; else if (edit.tint) delete edit.tint[k]; upd(); });
    c.querySelectorAll('[data-rs]').forEach(b => b.onclick = () => { if (edit.cos) delete edit.cos[b.dataset.rs]; upd(); });
    c.querySelector('.ws-revert').onclick = () => confirmSave(true);
    c.querySelector('.ws-save').onclick = () => confirmSave(false);
    c.querySelector('.ws-copy').onclick = () => { const txt = JSON.stringify({ id: cur.id, name: cur.name, file: cur.file, change: tidy(edit) }, null, 1); const done = ok => note(ok ? 'Copied. Paste it to Claude to make the change permanent in the code.' : txt); try { navigator.clipboard.writeText(txt).then(() => done(true), () => done(false)); } catch (er) { done(false); } };
  }
  function tidy(e) { const o = clone(e); if (o.tint && !Object.keys(o.tint).length) delete o.tint; if (o.cos && !Object.keys(o.cos).length) delete o.cos; return o; }
  function note(msg) { const m = document.createElement('div'); m.className = 'ws-modal'; m.innerHTML = '<div class="ws-card"><p style="white-space:pre-wrap;user-select:text;-webkit-user-select:text"></p><button class="big">OK</button></div>'; m.querySelector('p').textContent = msg; m.querySelector('button').onclick = () => m.remove(); el.appendChild(m); }
  function diffRows(before, after) {
    const rows = [], sw = v => '<span class="sw" style="background:' + G.esc(hexs(v)) + '"></span>';
    ['cls', 'race', 'scale'].forEach(k => { if (String(before[k] || '') !== String(after[k] || '')) rows.push([k === 'cls' ? 'Frame' : k === 'race' ? 'People' : 'Size', G.esc(String(before[k] || (k === 'scale' ? 1 : '—'))), G.esc(String(after[k] || (k === 'scale' ? 1 : '—')))]); });
    COLS.forEach(([k, n]) => { const a = colourOf(before, k), b = colourOf(after, k); if (hexs(a).toLowerCase() !== hexs(b).toLowerCase()) rows.push([n, sw(a) + ' ' + G.esc(hexs(a)), sw(b) + ' ' + G.esc(hexs(b))]); });
    const cn = id => id ? ((G.COSMETICS || []).find(x => x.id === id) || { name: id }).name : 'None';
    SLOTS.forEach(([k, n]) => { const a = (before.cos || {})[k], b = (after.cos || {})[k]; if ((a || '') !== (b || '')) rows.push([n, G.esc(cn(a)), G.esc(cn(b))]); });
    return rows;
  }
  function confirmSave(revert) {
    const was = merge(cur.base, EDITS[cur.id]), will = revert ? cur.base : effective(), rows = diffRows(was, will);
    if (!rows.length) { note(revert ? cur.name + ' already looks the way the code made them.' : 'Nothing has changed yet.'); return; }
    const m = document.createElement('div'); m.className = 'ws-modal';
    m.innerHTML = '<div class="ws-card"><h2>' + (revert ? 'Put ' : 'Save ') + G.esc(cur.name) + (revert ? ' back?' : '?') + '</h2><p class="ws-note">' + (revert ? 'This removes your saved changes.' : 'Check the changes.') + ' Everyone who plays will see it the next time the game opens.</p><ul class="ws-diff">' + rows.map(r => '<li><b style="min-width:7em">' + r[0] + '</b>' + r[1] + ' → ' + r[2] + '</li>').join('') + '</ul><div class="ws-btns"><button class="big ws-yes">' + (revert ? 'Put back' : 'Save') + '</button><button class="ws-no">Keep editing</button></div></div>';
    el.appendChild(m); m.querySelector('.ws-no').onclick = () => m.remove();
    m.querySelector('.ws-yes').onclick = async () => { const btn = m.querySelector('.ws-yes'); btn.disabled = true; btn.textContent = 'Saving…';
      const next = clone(EDITS); if (revert) delete next[cur.id]; else next[cur.id] = tidy(edit);
      try { await db.doc('edits/looks').set({ looks: next, at: Date.now() }); }
      catch (er) { m.remove(); note('Not saved: ' + (er && er.code === 'invalid_argument' ? 'only the game’s owner can save changes.' : er && er.code === 'quota_exceeded' ? 'the game’s store is full.' : 'the store could not be reached. Try again in a moment.')); return; }
      Object.keys(EDITS).forEach(k => delete EDITS[k]); Object.assign(EDITS, next); if (revert) edit = {}; applyAll(); rebuild(cur.id); m.remove();
      const r = cur; open2(r); note(revert ? r.name + ' is back to the original.' : 'Saved. ' + r.name + ' is updated in the game.'); };
  }
  function open2(r) { const keep = r.id; choose(G.registry().find(q => q.id === keep) || r); const s = el.querySelector('input[type=search]'); s.dispatchEvent(new Event('input')); }
  G.ui.workshop = open; G.workshop = { open, close, merge, edits: EDITS, seen: SEEN, base: r => baseOf(r) };
  window.addEventListener('keydown', e => { if (el && e.code === 'Escape') { const m = el.querySelector('.ws-modal'); if (m) m.remove(); else close(); e.stopPropagation(); } }, true);
  if (location.hash === '#workshop') setTimeout(() => G.workshopAllowed() && open(), 1500);
})();
