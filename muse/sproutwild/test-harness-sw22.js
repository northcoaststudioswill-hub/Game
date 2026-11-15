// Sproutwild v4.6: THE GARDEN — plots with states, typed bushes, workers plant fruit as visible trips.
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

check('the garden has plots now (6)', plots().length === 6);
check('typed bushes flank the garden', (SWF.bushes() || []).length === 3 && SWF.bushes().every(b => b.fruit === 2));
check('the scattered apple field is gone', SWF.items() == null);

/* clear the garden completely: no workers at all */
for (const q of plots()) { q.type = -1; q.seedTy = null; q.by = null; q.mode = 'soil'; }
frames(900);
check('a workerless garden stays empty — planting is a trip, not magic', plots().every(q => q.seedTy == null && q.type < 0));

/* now give the garden ONE worker and watch it do the whole job */
const w = plots()[0];
w.type = 4; w.age = 40; w.stage = 2; w.x = w.sx; w.y = w.sy; w.dlv = 0; w.mode = 'soil'; w.t = 0;
let plantedPlot = null, sawPlantMode = false;
for (let i = 0; i < 9000 && !plantedPlot; i++) { frames(1);
  if (w.mode === 'plant') sawPlantMode = true;
  plantedPlot = plots().find(q => q.seedTy != null) || null; }
check('the worker carried a berry TO a plot (plant mode)', sawPlantMode);
check('and planted it — a seed is in the ground', !!plantedPlot);
check('the seed is a FRUIT type from the bushes', plantedPlot && [0, 2, 4].includes(plantedPlot.seedTy));
let popped = false;
for (let i = 0; i < 3600 && !popped; i++) { frames(1); if (plantedPlot.type === plantedPlot.seedTy || plantedPlot.type >= 0) popped = plantedPlot.type >= 0; }
check('the seed pops into a sprout on its plot', popped);

/* no double-planting: two workers never claim the same plot */
const claims = plots().filter(q => q.by);
check('plot claims are exclusive', new Set(claims.map(q => q.by)).size === claims.length);

/* a working sprout answers A — pluck or info, never silence */
let answer = null;
for (let i = 0; i < 3600 && !answer; i++) { frames(1);
  const busy = plots().find(q => q.type >= 0 && q.stage >= 2 && ['fetch', 'plant', 'carry'].includes(q.mode));
  if (busy) { SWF.setPos(busy.x, busy.y + 13); hold('up', 2); frames(1); const n = SWF.near();
    if (n && (n.k === 'sproutinfo' || n.k === 'pluck')) answer = n; } }
check('a WORKING sprout answers A (no dead interactions)', !!answer);
check('no errors anywhere', errors.length === 0);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW22_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V46_OK');
