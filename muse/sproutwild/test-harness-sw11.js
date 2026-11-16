// Sproutwild v3.3: party leader selection + battle grid navigation.
// Usage: node test-harness-sw11.js <htmlPath>
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
function toMenu() { for (let i = 0; i < 60 && SWF.bt() && SWF.bt().phase !== 'menu'; i++) { tap('a'); frames(2); } }

/* opening: befriend DRIZZLET (same physical flow as sw10) */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
tap('b'); frames(2);
{ const lou = SWF.louie(); SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1); tap('a'); frames(2); tap('b'); frames(1); }
SWF.tend(); /* v3.4: sprouts grown before the choice */
SWF.setPos(240, 312); hold('up', 6); frames(1);
tap('a'); frames(2); tap('a'); frames(2);
tap('a'); frames(2); /* v4.0: dismiss the partner-joined cinematic */
check('opening done, party of 1', state() === 'g4world' && SW.party.length === 1 && SW.party[0].sp === 'DRIZZLET');
SWF.giveMon('PEBBLIT', 5); SWF.giveMon('ZIPWIG', 12); /* Lv12: full 4-move set for the grid checks */
check('party of 3 seeded', SW.party.length === 3 && SW.party[2].sp === 'ZIPWIG');

/* ---- leader selection ---- */
tap('start'); frames(1);
check('pause opens', state() === 'g4pause');
tap('a'); frames(1);
check('party screen opens', state() === 'g4party');
tap('down'); tap('down');
check('cursor on the third partner', SWF.sel() === 2);
tap('a'); frames(2);
check('ZIPWIG leads now (party[0], cursor reset)', SW.party[0].sp === 'ZIPWIG' && SWF.sel() === 0);
check('the rest keep their order', SW.party[1].sp === 'DRIZZLET' && SW.party[2].sp === 'PEBBLIT');
tap('b'); frames(1); tap('b'); frames(1);
check('back in the world', state() === 'g4world');

/* the leader opens battles */
SW.party.forEach(mm => mm.hp = 999);
SWF.forceWild('FERNFANG', 3); frames(3);
toMenu();
check('leader ZIPWIG is the active battler', SWF.bt() && SWF.bt().aiIx === 0 && SW.party[SWF.bt().aiIx].sp === 'ZIPWIG');

/* ---- battle menu grid navigation (2 columns) ---- */
check('menu cursor starts on FIGHT', SWF.sel() === 0);
tap('right'); check('RIGHT moves to BUD (next cell)', SWF.sel() === 1);
tap('down'); check('DOWN moves a ROW to PARTY (index 3)', SWF.sel() === 3);
tap('up'); check('UP returns to BUD', SWF.sel() === 1);
tap('left'); check('LEFT returns to FIGHT', SWF.sel() === 0);
tap('down'); check('DOWN from FIGHT lands on KEEPER (index 2)', SWF.sel() === 2);
tap('up'); check('UP returns to FIGHT', SWF.sel() === 0);
tap('a'); frames(2);
check('moves open', SWF.bt() && SWF.bt().phase === 'moves');
tap('down'); check('moves: DOWN = next row (index 2)', SWF.sel() === 2);
tap('right'); check('moves: RIGHT = index 3', SWF.sel() === 3);
tap('up'); check('moves: UP = index 1', SWF.sel() === 1);
tap('b'); frames(2);
check('B returns to the battle menu', SWF.bt() && SWF.bt().phase === 'menu');

/* ---- budpick is a grid too ---- */
SWF.bt().foe.hp = 1;
SWF.giveBud('EMBER', 2); SWF.giveBud('DEW', 2); SWF.giveBud('LEAF', 2);
tap('right'); tap('a'); frames(2);
check('bud picker opens', SWF.bt() && SWF.bt().phase === 'budpick');
check('picker cursor on first bud', SWF.sel() === 0);
tap('down');
check('picker: DOWN = next row (third bud type)', SWF.sel() === 2);
const leaf0 = SW.buds.LEAF;
tap('a'); frames(3);
check('the third bud type was thrown (LEAF spent)', SW.buds.LEAF === leaf0 - 1 && SWF.bt().phase !== 'budpick');
for (let i = 0; i < 240 && state() === 'g4battle'; i++) { tap('a'); frames(2); }
check('battle resolved back to the world', state() === 'g4world');

/* tonic still works on the leader from the party screen */
SW.party[0].hp = 3; SW.tonics = 1;
tap('start'); frames(1); tap('a'); frames(1);
tap('a'); frames(2);
check('tonic heals the leader', SW.party[0].hp > 3 && SW.tonics === 0);

console.log('console.errors during run:', errors.length, errors.slice(0, 2));
if (fails.length) { console.log('SW11_FAIL: ' + fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V33_OK');
