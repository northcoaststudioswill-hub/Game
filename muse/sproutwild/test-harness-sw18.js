// Sproutwild v4.2: wild sprouts, plucked, FOLLOW you — and haul finds home.
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

/* boot -> world; finish the teaching via the hook (physical flow is sw15's) */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 16 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
SWF.tend();
SWF.giveMon('CINDERCAP', 10, false);

/* the Meadow: a wild sprout, plucked, becomes a follower */
SWF.enter('MEADOW'); frames(2);
const loose = SWF.loose();
check('wild sprouts grow in the meadow', !!loose && loose.length >= 1);
const lb = loose[0];
for (let ri = 0; ri < 6 && !(SWF.near() && SWF.near().k === 'wildpluck'); ri++) { SWF.setPos(lb.x, lb.y + 16); hold('up', 3); frames(1); }
tap('a'); frames(2);
check('plucked wild sprout joins your train', SWF.followers().length === 1 && (SWF.fol() || []).length === 1);
check('it starts out following', SWF.fol()[0].mode === 'follow');

/* it trails you as you walk */
const f0 = SWF.fol()[0], d0 = Math.hypot(f0.x - 120, f0.y - 300);
SWF.setPos(120, 300); frames(300);
const f1 = SWF.fol()[0];
check('the follower keeps up on the road', Math.hypot(f1.x - 120, f1.y - 300) < Math.min(50, d0 * 0.4));

/* sooner or later it hauls a find home — and the yield lands in your stores */
const wealth0 = SW.res.wood + SW.res.stone + SW.res.berry + SW.res.petal + SW.res.ingot + (SW.tonics || 0) + Object.values(SW.buds).reduce((a, b) => a + b, 0);
SWF.fol()[0].haulT = 0.05;
for (let i = 0; i < 200 && SWF.fol()[0].mode !== 'haul'; i++) frames(1);
check('the follower sets off with a find', SWF.fol()[0].mode === 'haul' && !!SWF.fol()[0].item);
for (let i = 0; i < 2400 && SWF.fol()[0].mode !== 'away'; i++) frames(1);
check('it reached the Gate and mailed the find home', SWF.fol()[0].mode === 'away');
const wealth1 = SW.res.wood + SW.res.stone + SW.res.berry + SW.res.petal + SW.res.ingot + (SW.tonics || 0) + Object.values(SW.buds).reduce((a, b) => a + b, 0);
check('your stores grew while you stood there', wealth1 > wealth0);

/* ...and after a little while, it comes back */
for (let i = 0; i < 3000 && SWF.fol()[0].mode !== 'follow'; i++) { frames(1); if (state() === 'g4battle') { tap('right'); tap('down'); tap('a'); frames(2); } }
check('the follower returns to your side', SWF.fol()[0].mode === 'follow');

/* a full train (4) sends the next pluck to the pouch instead */
SW.followers.push(0, 1, 2); SWF.enter('MEADOW'); frames(2);
check('the train syncs at four', (SWF.fol() || []).length === 4);
const loose2 = SWF.loose();
if (loose2 && loose2.length) {
  const lb2 = loose2[0], nm2 = ['EMBER', 'PEB', 'DEW', 'ZIP', 'LEAF', 'LUCKY'][lb2.type], st0 = SW.buds[nm2] || 0;
  for (let ri = 0; ri < 6 && !(SWF.near() && SWF.near().k === 'wildpluck'); ri++) { SWF.setPos(lb2.x, lb2.y + 16); hold('up', 3); frames(1); }
  tap('a'); frames(2);
  check('train full: the pluck goes to the pouch', SWF.followers().length === 4 && (SW.buds[nm2] || 0) === st0 + 1);
} else check('train full: the pluck goes to the pouch', false);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW18_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V42_OK');
