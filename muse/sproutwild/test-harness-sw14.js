// Sproutwild v3.6: NPC asks (Sprouts' mission system), the day cycle,
// hidden treasures, and type-flavored patch work (ZIP buds run faster).
// Usage: node test-harness-sw14.js <htmlPath>
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
const TYPES = ['EMBER', 'PEB', 'DEW', 'ZIP', 'LEAF', 'LUCKY'];

/* opening (hook tending; physical tending is sw4) */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && SWF.state() !== 'g4world'; i++) { tap('a'); frames(1); }
tap('b'); frames(2);
{ const lou = SWF.louie(); SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1); tap('a'); frames(2); tap('b'); frames(1); }
SWF.tend();
SWF.setPos(240, 312); hold('up', 6); frames(1);
tap('a'); frames(2); tap('a'); frames(2);
check('befriended DRIZZLET', SW.party.length === 1);

/* ---- asks: Pip in Lantern Town ---- */
SWF.enter('TOWN'); frames(2);
SWF.setPos(168, 238); hold('up', 2); frames(1);
check('Pip offers a talk prompt', SWF.near() && SWF.near().k === 'npc' && SWF.near().who === 'PIP');
tap('a'); frames(2);
check('talking to Pip opens his ASK', SWF.state() === 'g4ask');
const ask = SWF.ask('PIP');
check('Pip has an ask (buds / res / catch)', !!ask && ['buds', 'res', 'catch'].includes(ask.kind));
const res0 = ask.kind === 'res' ? SW.res[ask.res] : 0; /* balance BEFORE the gift — expectations must be relative (v4.6 flake fix) */
if (ask.kind === 'buds') SWF.giveBud(TYPES[ask.type], ask.n + 2); /* type NAME, not the object (suite bug: buds-kind asks never actually exercised before) */
if (ask.kind === 'res') SWF.give(ask.res, ask.n + 2);
if (ask.kind === 'catch') SW.caught[ask.sp] = (SW.caught[ask.sp] || 0) + 1;
const pet0 = SW.res.petal;
const budHave = ask.kind === 'buds' ? (SW.buds[TYPES[ask.type]] || 0) : 0;
tap('a'); frames(2); /* DELIVER / CLAIM is row 0 */
check('ask completed: reward paid, ask cleared, counter moved',
  SWF.state() === 'g4world' && SW.res.petal === pet0 + ask.rw - (ask.kind === 'res' && ask.res === 'petal' ? ask.n : 0) && SWF.ask('PIP') === null && SW.askDone === 1);
if (ask.kind === 'buds') check('the buds were actually handed over', (SW.buds[TYPES[ask.type]] || 0) === budHave - ask.n);
if (ask.kind === 'res') check('the goods were actually handed over', SW.res[ask.res] === (ask.res === 'petal' ? pet0 - ask.n + ask.rw : res0 + 2)); /* petal asks: the reward is petals too */

/* ---- an unready ask refuses politely (Louie's, via his menu) ---- */
SWF.enter('BASE'); frames(2);
{ const lou = SWF.louie(); SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1); tap('a'); frames(2); }
check('Louie menu opens', SWF.state() === 'g4lou');
tap('down'); tap('down'); tap('down'); /* ANY ASKS? is row 3 */
tap('a'); frames(2);
check("Louie's ASK opens from his menu", SWF.state() === 'g4ask');
const la = SWF.ask('LOUIE');
if (la && la.kind === 'buds') SW.buds[TYPES[la.type]] = 0;
if (la && la.kind === 'res') SW.res[la.res] = 0;
tap('a'); frames(2);
check('NOT READY refuses: still on the ask screen', SWF.state() === 'g4ask');
tap('b'); frames(1);
check('B backs out to the world', SWF.state() === 'g4world');

/* ---- the day turns (300s cycle, DAY counter) ---- */
const day0 = SW.day;
SWF.dayT(299.4); frames(45);
check('the day rolls over and DAY increments', SW.day === day0 + 1);
SWF.dayT(120); frames(5);
check('midday does not roll', SW.day === day0 + 1);

/* ---- a hidden treasure waits in the meadow ---- */
SWF.enter('MEADOW'); frames(2);
const tr = SWF.treasure();
check('a treasure sparkles somewhere in the sector', !!tr);
const wealth = () => SW.res.petal + SW.res.ingot + SW.tonics + Object.values(SW.buds).reduce((a, b) => a + b, 0);
const w0 = wealth();
SWF.setPos(tr.x, tr.y); frames(4);
check('walking into it digs it up', SW.treasures === 1 && SWF.treasure() === null && wealth() > w0);

/* ---- ZIP patch buds really do run faster (Sprouts: each kind is good at something) ---- */
SWF.enter('BASE'); frames(2);
const patch = SWF.patch();
const zip = patch[0], emb = patch[1];
const bush = SWF.bushes()[0]; /* v4.6: fetch reads pb.bush (typed fruit bushes) */
for (const [pb, ty] of [[zip, 3], [emb, 0]]) {
  pb.type = ty; pb.age = 99; pb.stage = 2; pb.x = 240; pb.y = 352; pb.mode = 'fetch'; pb.bush = bush; pb.item = false;
}
frames(40);
const dz = Math.hypot(zip.x - bush.x, zip.y - bush.y), de = Math.hypot(emb.x - bush.x, emb.y - bush.y);
check('ZIP bud outruns the EMBER bud to the same apple', dz < de - 4);

console.log('console.errors during run:', errors.length, errors.slice(0, 2));
if (fails.length) { console.log('SW14_FAIL: ' + fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V36_OK');
