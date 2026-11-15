// Sproutwild v4.6 (was v4.5's delivery-seed suite): the QUIET garden — bare plots, seeds, and soil, with nobody working.
// Usage: node test-harness-sw15.js <htmlPath>
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

/* boot -> world, teaching done via the hook (physical flow is sw15's) */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 16 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
SWF.tend(); SWF.enter('BASE'); frames(2);
const plots = () => SWF.patch();

/* empty the garden entirely: no sprouts, no followers, no seeds */
for (const q of plots()) { q.type = -1; q.seedTy = null; q.by = null; q.mode = 'soil'; }
frames(1800);
check('bare plots grow NOTHING on their own', plots().every(q => q.type < 0 && q.seedTy == null));

/* a planted seed: info, pop, growth — in a garden with nobody to interfere */
const spot = plots()[2];
spot.seedTy = 0; spot.age = -7; spot.x = spot.sx; spot.y = spot.sy;
SWF.setPos(spot.x, spot.y + 13); hold('up', 2); frames(1);
const nSeed = SWF.near();
check('a planted seed answers A', !!nSeed && nSeed.k === 'sproutinfo' && /SEED/.test(nSeed.msg));
let popped = false;
for (let i = 0; i < 1200 && !popped; i++) { frames(1); if (spot.type === 0) popped = true; }
check('the seed pops into a baby sprout', popped && spot.stage === 0);
spot.age = 31; frames(3);
check('and grows up on its plot', spot.stage === 2);

/* bare soil answers too — once the spot is empty and quiet again */
spot.type = -1; spot.seedTy = null; spot.mode = 'soil'; spot.x = spot.sx; spot.y = spot.sy;
SWF.setPos(spot.x, spot.y + 13); hold('up', 2); frames(1);
const nSoil = SWF.near();
check('bare soil answers A too', !!nSoil && nSoil.k === 'sproutinfo' && /PLOT/.test(nSoil.msg));
check('no errors from asking dirt', errors.length === 0);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW21_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V46B_OK');
