// Sproutwild PHYSICAL playtest: real inputs through the real menus.
// Only save-data seeding + position hooks are used; every system is
// driven the way a player's thumbs drive it.
// Usage: node test-harness-sw2.js <htmlPath>
const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let errors = [];
console.error = (...a) => { errors.push(a.map(x => (x && x.stack) || String(x)).join(' ')); };
function ctxStub() {
  const t = { measureText: s => ({ width: String(s).length * 6 }), drawImage: img => { if (img && img.ol && !img.getContext) throw new Error('drawImage got a sprite object (use .ol)'); } };
  return new Proxy(t, { get(o, k) { if (k in o) return o[k]; return () => undefined; }, set(o, k, v) { o[k] = v; return true; } });
}
function el(id) {
  const classes = new Set();
  return { id, hidden: false, textContent: '', clientWidth: 120, clientHeight: 60,
    style: { setProperty() {} },
    classList: { add: c => classes.add(c), remove: c => classes.delete(c), toggle: (c, f) => { f ? classes.add(c) : classes.delete(c); }, contains: c => classes.has(c) },
    addEventListener() {}, setPointerCapture() {},
    getBoundingClientRect: () => ({ top: 100, left: 50, width: 100, height: 120, bottom: 220, right: 150 }),
    getContext: () => ctxStub(), parentNode: { clientWidth: 360, clientHeight: 300 },
    querySelectorAll: () => carts };
}
const byId = {}; const carts = [0, 1, 2].map(i => el('cart' + i));
global.window = global;
global.document = { getElementById: id => byId[id] || (byId[id] = el(id)), createElement: () => el('dyn'), addEventListener() {}, fonts: null };
byId['shelf'] = el('shelf');
const store = {};
global.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.Image = class { constructor() { this.complete = false; } };
let rafCb = null;
global.requestAnimationFrame = cb => { rafCb = cb; };
global.addEventListener = () => {};
for (const s of scripts) eval(s);
const G = global.window.__g;
if (!G || !G.SWF) { console.log('FAIL no SW hooks'); process.exit(1); }
const SWF = G.SWF(), SW = G.SW();
let t = 0, fails = [];
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) { console.log('FAIL rAF chain broke'); process.exit(1); } } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
function hold(key, n) { G.keys[key] = 1; frames(n); G.keys[key] = 0; frames(1); }
function check(name, cond) { console.log((cond ? 'ok  ' : 'FAIL') + ' ' + name); if (!cond) fails.push(name); }
const state = () => SWF.state();
function driveBattle(max) {
  let i = 0;
  while (state() === 'g4battle' && i++ < max) {
    const bt = SWF.bt(); if (!bt) break;
    if (bt.phase === 'party') {
      const ix = SW.party.findIndex(m => m.hp > 0);
      for (let d = 0; d < ix; d++) tap('down');
      tap('a'); frames(2);
    } else tap('a');
    frames(3);
  }
  return i < max;
}

/* ---- boot + starter (physical) ---- */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && state() !== 'g4world'; i++) { tap('a'); frames(1); } /* title + story beats -> world */
SWF.giveMon('CINDERCAP', 5, false); /* starter seeded — the walk-up choice is covered in sw4 */
check('physical boot -> story -> base', state() === 'g4world' && SW.party.length === 1);
SW.quest = 5; /* v2.1: post-intro systems suite */
SWF.give('wood', 12); SWF.give('stone', 4); /* new saves start at 0; this suite tests building, not gathering */
SW.party[0].lv = 12; SW.party[0].hp = 999; /* save-data seeding: a trained starter */

/* ---- gather from a real node ---- */
SWF.enter('MEADOW'); frames(2);
const tree = SWF.nodes().find(n => n.k === 'tree');
check('meadow has a tree node', !!tree);
const wood0 = SW.res.wood;
SWF.setPos(tree.x, tree.y + 15); hold('up', 2); frames(1);
check('near a node -> interact prompt', SWF.near() && SWF.near().k === 'node');
for (let i = 0; i < 20 && !tree.got; i++) { tap('a'); frames(12); } /* v3.4: 15 hits, bare hands */
check('gathered +2 wood by hand (15 hits)', SW.res.wood === wood0 + 2 && tree.got === true);

/* ---- natural grass encounter ---- */
const realRandom = Math.random; Math.random = () => 0.05;
SWF.setPos(60, 90); frames(90); /* inside grass patch 1 */ /* let the entry grace expire, like reading the banner */
hold('left', 6); hold('right', 6); hold('left', 6); hold('right', 6); frames(10);
Math.random = realRandom;
const rv = (SWF.wilds() || []).find(w => w.reveal != null);
check('tall grass RUSTLES and reveals a wild — no ambush (v4.7)', !!rv && state() === 'g4world');
if (rv) { SWF.setPos(rv.x, rv.y + 14); hold('up', 2); frames(1); tap('a'); frames(45); }
const inBattle = state() === 'g4battle' && SWF.bt() && SWF.bt().mode === 'wild';
check('activating the revealed wild starts its battle', inBattle);
check('battle drive resolves', inBattle && driveBattle(400) && state() === 'g4world');

/* ---- gym by walking up and talking ---- */
SWF.enter('TOWN'); frames(2);
SWF.setPos(240, 92); hold('up', 2); frames(1);
check('near the gym leader', SWF.near() && SWF.near().k === 'gym');
tap('a'); frames(2);
check('gym talk opens', state() === 'g4gym');
tap('a'); frames(1); tap('a'); frames(2); tap('a'); frames(3); /* pages, then ARE YOU SURE -> YES */
frames(40); /* v4.7: the engage ritual plays first */
check('gym battle starts from talk', state() === 'g4battle' && SWF.bt().mode === 'gym');
check('gym battle resolves', driveBattle(600));
check('VERDANT SIGIL earned in person', SW.badges.includes('VERDANT SIGIL'));

/* ---- build through the real menus ---- */
SWF.enter('BASE'); frames(2);
if (state() === 'g4bottie') { frames(170); for (let i = 0; i < 5; i++) { tap('a'); frames(2); } frames(80); } /* v4.0: first sigil brings Bottie down */
tap('start'); frames(1); tap('down'); tap('down'); tap('a'); frames(1);
check('pause -> build list', state() === 'g4build');
tap('a'); frames(1);
check('cottage -> placement mode', state() === 'g4place');
tap('a'); frames(2);
check('cottage placed, back in world', state() === 'g4world' && SW.buildings.some(b => b.k === 'cottage'));
tap('start'); frames(1); tap('down'); tap('down'); tap('a'); frames(1);
tap('down'); tap('a'); frames(1);
check('bed -> placement mode', state() === 'g4place');
tap('a'); frames(1);
check('occupied cell refuses placement', state() === 'g4place' && !SW.buildings.some(b => b.k === 'bed'));
tap('right'); tap('a'); frames(2);
check('bed placed on a free cell', state() === 'g4world' && SW.buildings.some(b => b.k === 'bed'));

/* ---- cottage: rest + buy ---- */
const cot = SW.buildings.find(b => b.k === 'cottage');
SW.party[0].hp = 5;
SWF.setPos(cot.gx * 20 + 20, cot.gy * 20 + 62); hold('up', 3); frames(1);
check('near the cottage', SWF.near() && SWF.near().k === 'bld');
tap('a'); frames(2);
check('cottage menu opens', state() === 'g4cot');
tap('a'); frames(1);
check('REST healed the party', SW.party[0].hp > 5);
const buds0 = Object.values(SWF.buds()).reduce((a, b) => a + b, 0), pet0 = SW.res.petal;
tap('down'); tap('down'); tap('a'); frames(1);
check('BUY SPROUT works (v3.9: sprouts are the catch material)', Object.values(SWF.buds()).reduce((a, b) => a + b, 0) === buds0 + 1 && SW.res.petal === pet0 - 12);
tap('b'); frames(1);
check('cottage exit -> world', state() === 'g4world');

/* ---- assign a worker by hand, watch it produce in real time ---- */
SWF.addCrew(4); /* a LEAF sprout joins the crew (v3.9: sprouts work the base) */
const bed = SW.buildings.find(b => b.k === 'bed');
SWF.setPos(bed.gx * 20 + 20, bed.gy * 20 + 62); hold('up', 3); frames(1);
tap('a'); frames(2);
check('assign screen opens at the bed', state() === 'g4assign');
tap('a'); frames(1);
check('LEAF sprout assigned by hand', SWF.crew().filter(c => c.job === SW.buildings.indexOf(bed)).length === 1);
tap('b'); frames(1);
const berry0 = SW.res.berry;
frames(1600); /* ~27 game-seconds standing at base */
check('worker produced berries in real time', SW.res.berry > berry0);

/* ---- party / box / dex through the menus ---- */
tap('start'); frames(1); tap('a'); frames(1);
check('pause -> party screen', state() === 'g4party');
tap('down'); tap('a'); frames(1);
check('party -> box screen', state() === 'g4box');
tap('b'); frames(1); tap('b'); frames(1);
check('box/party back -> pause', state() === 'g4pause');
tap('down'); tap('a'); frames(1);
check('pause -> field guide', state() === 'g4dex');
tap('b'); frames(1); tap('b'); frames(1);
check('dex back -> world', state() === 'g4world');

/* ---- reload: fresh context, same save ---- */
const savedParty = SW.party.map(m => m.sp + ':' + m.lv).join(',');
const savedBadges = SW.badges.join(',');
{
  const byId2 = {}; const carts2 = [0, 1, 2].map(i => el('cart' + i));
  let raf2 = null;
  const sb = { console, Math, JSON, setTimeout: () => {}, clearTimeout: () => {} };
  sb.window = sb; sb.globalThis = sb;
  sb.document = { getElementById: id => byId2[id] || (byId2[id] = el(id)), createElement: () => el('dyn'), addEventListener() {}, fonts: null };
  byId2['shelf'] = el('shelf');
  sb.localStorage = global.localStorage;
  sb.Image = global.Image;
  sb.requestAnimationFrame = cb => { raf2 = cb; };
  sb.addEventListener = () => {};
  vm.createContext(sb);
  for (const s of scripts) vm.runInContext(s, sb);
  const G2 = sb.__g, SWF2 = G2.SWF(), SW2 = G2.SW();
  let t2 = 0; const fr2 = n => { for (let i = 0; i < n; i++) { t2 += 16.7; const cb = raf2; raf2 = null; cb(t2); } };
  const tap2 = k => { G2.keys[k] = 1; fr2(1); G2.keys[k] = 0; fr2(1); };
  fr2(3); tap2('right'); tap2('right'); tap2('a'); fr2(2); fr2(50); tap2('a'); fr2(3);
  check('reload: title boots on cart 3', SWF2.state() === 'g4title');
  tap2('a'); fr2(3);
  check('reload: save resumes straight into the world', SWF2.state() === 'g4world');
  check('reload: party + badges intact', SW2.party.map(m => m.sp + ':' + m.lv).join(',') === savedParty && SW2.badges.join(',') === savedBadges);
  check('reload: buildings intact', SW2.buildings.length === SW.buildings.length);
}

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW2_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_PHYSICAL_OK');
