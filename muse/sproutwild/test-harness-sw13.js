// Sproutwild v3.5: buds are Sprouts' sprouts — the patch grows them through
// stages, grown buds work the base on their own, plucking stocks your pouch,
// and loose buds grow wild in the sectors. Creatures are buddies.
// Usage: node test-harness-sw13.js <htmlPath>
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
const budTotal = () => Object.values(SW.buds).reduce((a, b) => a + b, 0);

/* opening (physical tending covered by sw4; hook here) */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && SWF.state() !== 'g4world'; i++) { tap('a'); frames(1); }
tap('b'); frames(2);
{ const lou = SWF.louie(); SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1); tap('a'); frames(2); tap('b'); frames(1); }
SWF.tend();
SWF.setPos(240, 312); hold('up', 6); frames(1);
tap('a'); frames(2); tap('a'); frames(2);
check('befriended DRIZZLET (a buddy)', SW.party.length === 1 && SW.party[0].sp === 'DRIZZLET');

/* ---- the patch is a living bud farm now ---- */
SWF.enter('BASE'); frames(2);
const patch = SWF.patch();
check('the garden holds plots', !!patch && patch.length === 6);
patch[3].seedTy = 2; patch[3].age = -0.1; /* a seed a worker planted (v4.6: no seed, no sprout) */
for (let i = 0; i < 1600 && !patch.some(b => b.type >= 0); i++) frames(1);
const sprouted = patch.find(b => b.type >= 0);
check('a planted seed germinates in the soil', !!sprouted);
sprouted.age = 31; frames(3);
check('buds grow through stages (Sprouts-style: grown at 30s+)', sprouted.stage === 2);

/* a grown bud left alone goes to work: it delivers something to the Lantern */
const wealth = () => SW.res.berry + SW.res.wood + SW.res.petal + budTotal();
const w0 = wealth();
for (let i = 0; i < 6000 && wealth() === w0; i++) frames(1);
check('the grown bud works the base and delivers (fetch/carry, like Sprouts)', wealth() > w0);

/* plucking stocks the pouch */
const pb = patch.find(b => b.type >= 0) || patch[0];
pb.age = 99; pb.x = pb.sx; pb.y = pb.sy; pb.mode = 'soil'; pb.item = false; frames(3);
const typeName = ['EMBER', 'PEB', 'DEW', 'ZIP', 'LEAF', 'LUCKY'][pb.type];
const stock0 = SW.buds[typeName] || 0;
SWF.setPos(pb.sx, pb.sy + 16); hold('up', 2); frames(1);
check('a grown bud offers itself to pluck', SWF.near() && SWF.near().k === 'pluck');
tap('a'); frames(2);
check('plucked: +1 ' + typeName + ' bud in the pouch, plot empties for the next seed',
  (SW.buds[typeName] || 0) === stock0 + 1 && pb.type === -1);

/* ---- loose buds grow wild in the sectors, by habitat ---- */
SWF.enter('MEADOW'); frames(2);
const loose = SWF.loose();
check('wild buds grow in the meadow', !!loose && loose.length >= 1);
const lb = loose[0], lbName = ['EMBER', 'PEB', 'DEW', 'ZIP', 'LEAF', 'LUCKY'][lb.type];
const lbStock = SW.buds[lbName] || 0, ln0 = loose.length;
for (let ri = 0; ri < 6 && !(SWF.near() && SWF.near().k === 'wildpluck'); ri++) { SWF.setPos(lb.x, lb.y + 16); hold('up', 3); frames(1); }
check('a wild sprout offers a PLUCK, not a walk-over', SWF.near() && SWF.near().k === 'wildpluck');
tap('a'); frames(2);
check('plucking a wild sprout makes it FOLLOW you (v4.2)', SWF.followers().length === 1 && SWF.loose().length === ln0 - 1 && (SW.buds[lbName] || 0) === lbStock);
frames(30);
check('the follower trails behind you', (SWF.fol() || []).length === 1 && SWF.fol()[0].mode === 'follow');

console.log('console.errors during run:', errors.length, errors.slice(0, 2));
if (fails.length) { console.log('SW13_FAIL: ' + fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V35_OK');
