// Guttercrown — the character registry, and character edits that have been approved into the code.
// Every character the game builds carries an id (see assets/REGISTRY.md). Changes made in the separate Workshop artifact
// (workshop.html; never part of the game players open) are written into js/look_edits.js by Claude once approved, and
// applied here as each character is built. The game itself has no editor and reads nothing from any store for this.
(function () {
  'use strict';
  const G = window.G, T = THREE;
  G.LOOKDEF = G.LOOKDEF || {};
  const EDITS = G.LOOK_EDITS = JSON.parse(JSON.stringify(G.BAKED_LOOKS || {}));       // approved edits, from js/look_edits.js
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
    if (e.adj) { o.adj = clone(look.adj || {}); Object.keys(e.adj).forEach(g => { o.adj[g] = Object.assign({}, o.adj[g] || {}, e.adj[g]); }); }       // fit: face, headgear, hat, back item, head
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

  applyAll();
  // which build this is: the same stamp shows at the top of the Workshop, so the two can be compared
  G.buildName = () => window.BUILD && window.BUILD.commit ? 'Build ' + window.BUILD.commit + ' · ' + window.BUILD.date : 'Build: a local copy';
  const set0 = G.ui && G.ui.settings;
  if (set0) G.ui.settings = function () { const r = set0.apply(this, arguments), card = document.querySelector('#panel .card'), end = card && card.querySelector('.row.end'); if (end && !card.querySelector('.buildname')) { const p = document.createElement('p'); p.className = 'dim buildname'; p.style.cssText = 'font-size:.8rem;margin:.6rem 0 0'; p.textContent = G.buildName(); end.parentNode.insertBefore(p, end); } return r; };
  G.looks = { merge, rebuild, applyAll, base: r => baseOf(r), seen: SEEN, edits: EDITS, colourOf, hexs, COLS, SLOTS, FRAMES, mk0, clone };
})();
