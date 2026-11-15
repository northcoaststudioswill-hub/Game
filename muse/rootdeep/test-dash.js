// Headless playtest for Rootdeep (cartridge 2) + Sprouts regression.
// Usage: node test-harness-rd.js <htmlPath>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 2) { console.log('FAIL script blocks', scripts.length); process.exit(1); }
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
if (!G || !G.RDF) { console.log('FAIL no RD hooks'); process.exit(1); }
const RDF = G.RDF(), RD = G.RD();
let t = 0, fails = [];
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) { console.log('FAIL rAF chain broke'); process.exit(1); } } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
function hold(key, n) { G.keys[key] = 1; frames(n); G.keys[key] = 0; frames(1); }
function check(name, cond) { console.log((cond ? 'ok  ' : 'FAIL') + ' ' + name); if (!cond) fails.push(name); }
const st = () => RDF.state();
const state = () => st().state;


/* charge-aware dash reliability retest */
const L = (...a) => console.log('PLAY|', ...a);
function dtap(dir) { G.keys[dir] = 1; frames(1); G.keys[dir] = 0; frames(2); G.keys[dir] = 1; frames(1); G.keys[dir] = 0; frames(1); }
frames(3); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
tap('a'); frames(2); tap('start'); frames(2);
RDF.depart(); frames(5); RDF.clearRoom(); frames(5);
let okD = 0; const dirs = ['left', 'right', 'up', 'down'];
for (let i = 0; i < 12; i++) { let w = 0; while (RDF.pos().chg < 1 && w++ < 240) frames(5);
  dtap(dirs[i % 4]); let dashed = false;
  for (let j = 0; j < 8; j++) { frames(1); if (RDF.pos().dashT > 0) { dashed = true; break; } }
  if (dashed) okD++; frames(10); }
L('DASH deliberate double-taps (charge-aware):', okD + '/12');
console.log('DASH_RETEST_DONE errors:', errors.length);
