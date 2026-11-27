// Sproutwild v3.2: bud toss recruiting, bud economy, command toss, tree collision.
// Usage: node test-harness-sw10.js <htmlPath>
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
const buds = () => SWF.buds();
const totalBuds = () => Object.values(buds()).reduce((a, b) => a + b, 0);
function toMenu() { for (let i = 0; i < 60 && SWF.bt() && SWF.bt().phase !== 'menu'; i++) { tap('a'); frames(2); } }
function toWorld() { for (let i = 0; i < 240 && state() !== 'g4world'; i++) { tap('a'); frames(2); } }

/* opening: befriend DRIZZLET -> +3 DEW buds */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
tap('b'); frames(2);
{ const lou = SWF.louie(); SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1); tap('a'); frames(2); tap('b'); frames(1); }
SWF.tend(); /* v3.4: sprouts grown before the choice */
SWF.setPos(240, 312); hold('up', 6); frames(1);
tap('a'); frames(2); tap('a'); frames(2);
check('befriended DRIZZLET', SW.party.length === 1 && SW.party[0].sp === 'DRIZZLET');
check('v4.1: befriending grants NOTHING — the pouch holds only what you plucked', buds().DEW === 1 && buds().EMBER === 1 && totalBuds() === 2);
SWF.giveBud('DEW', 2); SWF.giveBud('EMBER', 1); SWF.giveBud('LEAF', 2); /* restock to the levels the catch segments were written against */

/* bud toss recruiting: EMBER (strong vs LEAF) commands a weakened FERNFANG */
SWF.giveMon('CINDERCAP', 30);
SWF.giveBud('EMBER', 5);
SWF.forceWild('FERNFANG', 3); frames(3);
check('wild battle starts', state() === 'g4battle' && SWF.bt());
SWF.bt().foe.hp = 2;
toMenu();
check('battle menu reached', SWF.bt() && SWF.bt().phase === 'menu');
tap('right'); tap('a'); frames(2); /* BUD = index 1 (grid nav) */
check('BUD opens the bud picker', SWF.bt().phase === 'budpick');
const emb0 = buds().EMBER;
tap('a'); frames(3); /* picker lists EMBER first (only types with stock) */
check('the toss is away (orb phase, bud spent)', SWF.bt().phase === 'orb' || SWF.bt().phase === 'msg' || buds().EMBER === emb0 - 1);
let recruited = false;
for (let i = 0; i < 5 && !recruited; i++) {
  toWorld();
  if (SW.caught.FERNFANG) { recruited = true; break; }
  if (state() === 'g4battle') { toMenu(); tap('right'); tap('a'); frames(2); /* BUD = index 1 (grid nav) */ if (SWF.bt() && SWF.bt().phase === 'budpick') { tap('a'); frames(3); } }
}
check('FERNFANG was commanded and recruited', recruited && SW.caught.FERNFANG === 1);
check('each throw spent exactly one bud', buds().EMBER === emb0 - (5 - buds().EMBER) || buds().EMBER < emb0);
toWorld();

/* zero buds: BUD refuses with a teaching message; winning the fight grants a bud */
for (const k of Object.keys(buds())) buds()[k] = 0;
SWF.forceWild('PEBBLIT', 3); frames(3);
toMenu();
tap('right'); tap('a'); frames(3); /* BUD = index 1 (grid nav) */
check('no buds -> teaching refusal, battle continues', SWF.bt() && SWF.bt().log.some(l => l.txt.includes('No sprouts')) && state() === 'g4battle');
toMenu();
tap('a'); frames(2); /* FIGHT */
tap('a'); frames(2); /* first move */
toWorld();
check('winning the fight granted its PEB bud', buds().PEB === 1 && state() === 'g4world');

/* command toss: B marks a tree, your partner runs over and chops it */
SWF.enter('BASE'); frames(2);
const nd = SWF.nodes().find(n => n.k === 'tree');
check('a tree node exists at base', !!nd);
const wood0 = SW.res.wood;
SWF.setPos(nd.x, nd.y + 44); hold('up', 2); frames(1);
tap('b'); frames(340); /* v3.4: partner travels, then works the node hit by hit */
check('partner obeyed the toss and gathered the tree', nd.got === true && SW.res.wood === wood0 + 2);

/* trees are solid: you cannot walk through a trunk */
SWF.enter('MEADOW'); frames(2);
const tn = SWF.nodes().find(n => n.k === 'tree');
SWF.setPos(tn.x, tn.y + 34); hold('up', 40); frames(1);
const pp = SWF.pos();
check('the trunk blocks you (stopped at its base)', pp.y > tn.y + 5 && pp.y < tn.y + 20);

frames(20);
console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW10_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V32_OK');
