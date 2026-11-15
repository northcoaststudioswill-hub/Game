// Sproutwild v3.4: gathering hits + stamina, axe/pickaxe at the Tinker Bench,
// partner works nodes hit-by-hit, grown-sprout bud grants.
// Usage: node test-harness-sw12.js <htmlPath>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let errors = [];
console.error = (...a) => { errors.push(a.map(x => (x && x.stack) || String(x)).join(' ')); };
function ctxStub() {
  const t = { measureText: s => ({ width: String(s).length * 6 }), drawImage: img => { if (img && img.ol && !img.getContext) throw new Error('drawImage got a sprite object'); } };
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
function swing() { tap('a'); frames(12); } /* respect the 0.22s swing pacing */
function swings(n) { for (let i = 0; i < n; i++) swing(); }

/* opening via the tend hook (physical tending is sw4's beat) */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
tap('b'); frames(2);
{ const lou = SWF.louie(); SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1); tap('a'); frames(2); tap('b'); frames(1); }
SWF.tend();
SWF.setPos(240, 312); hold('up', 6); frames(1);
tap('a'); frames(2); tap('a'); frames(2);
check('befriended DRIZZLET', SW.party.length === 1 && SW.party[0].sp === 'DRIZZLET');
check('v4.1: no free sprouts — the pouch holds the two you plucked (tend hook)',
  SW.buds.DEW === 1 && SW.buds.EMBER === 1);
SWF.giveBud('DEW', 2); SWF.giveBud('EMBER', 1); SWF.giveBud('LEAF', 2);

/* ---- node HP: a tree takes 15 bare-hand hits ---- */
SWF.enter('BASE'); frames(2);
const tree = SWF.nodes().find(n => n.k === 'tree');
check('tree starts at 15 HP', tree.hp === 15 && tree.max === 15);
SWF.setPos(tree.x, tree.y + 20); hold('up', 2); frames(1);
check('near the tree', SWF.near() && SWF.near().k === 'node');
SWF.stam(100);
swings(5);
check('5 hits: tree at 10 HP, stamina 75', tree.hp === 10 && SWF.stam() === 75);
const wood0 = SW.res.wood;
swings(10);
check('15 hits fells it: +2 wood', tree.got === true && SW.res.wood === wood0 + 2);

/* ---- stamina: winded swings are refused, rest regens ---- */
const rock = SWF.nodes().find(n => n.k === 'rock');
SWF.setPos(rock.x, rock.y + 20); hold('up', 2); frames(1);
SWF.stam(4);
swing();
check('winded: the swing is refused, rock untouched', rock.hp === 15 && SWF.stam() === 4);
frames(150); /* ~2.5s: regen kicks in after a 1s breather */
check('stamina regenerates while resting', SWF.stam() >= 10);

/* ---- tools at the Tinker Bench ---- */
SWF.give('wood', 40); SWF.give('stone', 40);
SWF.build('bench', 10, 10);
const bx = 10 + 10 * 20 + 10, by = 38 + 10 * 20 + 12;
SWF.setPos(bx, by + 26); hold('up', 2); frames(1);
check('near the bench', SWF.near() && SWF.near().k === 'bld');
tap('a'); frames(2);
check('the bench opens the TOOLS screen', state() === 'g4tools');
const wBefore = SW.res.wood, sBefore = SW.res.stone;
tap('a'); frames(2); /* CRAFT AXE (row 0): 6 wood 3 stone */
check('axe crafted: Lv1, materials paid', SWF.tools().axe === 1 && SW.res.wood === wBefore - 6 && SW.res.stone === sBefore - 3);
tap('down'); tap('a'); frames(2); /* CRAFT PICKAXE (row 1): 3 wood 6 stone */
check('pickaxe crafted: Lv1', SWF.tools().pick === 1);
tap('b'); frames(1);
check('back in the world', state() === 'g4world');

/* axe bites: a fresh tree falls in 8 swings of dmg 2 */
SWF.enter('BASE'); frames(2);
const tree2 = SWF.nodes().find(n => n.k === 'tree');
SWF.setPos(tree2.x, tree2.y + 20); hold('up', 2); frames(1);
SWF.stam(100);
swings(7);
check('7 axe swings: tree at 1 HP', tree2.hp === 1 && !tree2.got);
swing();
check('8th swing fells it', tree2.got === true);

/* ---- command toss: the partner works the node hit by hit ---- */
const rock2 = SWF.nodes().find(n => n.k === 'rock' && !n.got);
const stone0 = SW.res.stone;
SWF.setPos(rock2.x, rock2.y + 44); hold('up', 2); frames(1);
tap('b');
for (let i = 0; i < 400 && rock2.hp >= 15; i++) frames(1); /* partner runs over first */
check('partner is working the rock (HP dropping, not instant)', rock2.hp < 15 && !rock2.got);
for (let i = 0; i < 500 && !rock2.got; i++) frames(1);
check('partner finished the rock: +2 stone', rock2.got === true && SW.res.stone === stone0 + 2);

console.log('console.errors during run:', errors.length, errors.slice(0, 2));
if (fails.length) { console.log('SW12_FAIL: ' + fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V34_OK');
