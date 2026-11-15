// Sproutwild v4.3: followers work at home; crew live at the patch; every sprout answers A.
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
SWF.tend();

/* ---- a sprout grows up at the patch and STAYS there as crew ---- */
SWF.enter('BASE'); frames(2);
const pb = (SWF.patch() || []).find(b => b.type >= 0) || SWF.patch()[0];
pb.type = 4; pb.age = 31; frames(3);
check('patch sprout is grown', pb.stage === 2);
for (let i = 0; i < 5000 && !pb.crew; i++) frames(1);
check('three deliveries grow it into the crew', SW.crew.length === 1 && pb.crew === true);
check('...and it STAYS at the patch (atPatch)', SW.crew[0].atPatch === true && pb.type === 4);
frames(600);
check('it keeps working the patch as crew', pb.type === 4);

/* ---- every sprout answers A ---- */
SWF.setPos(pb.x, pb.y + 13); hold('up', 2); frames(1);
const nearPluck = SWF.near();
check('a grown patch sprout offers PLUCK (actionable first)', !!nearPluck && (nearPluck.k === 'pluck' || nearPluck.k === 'sproutinfo'));

/* ---- a follower WORKS at base instead of trailing you ---- */
SWF.enter('MEADOW'); frames(2);
const lb = SWF.loose()[0];
for (let ri = 0; ri < 6 && !(SWF.near() && SWF.near().k === 'wildpluck'); ri++) { SWF.setPos(lb.x, lb.y + 16); hold('up', 3); frames(1); }
tap('a'); frames(2);
check('follower plucked', SWF.followers().length === 1);
const wealth0 = SW.res.wood + SW.res.stone + SW.res.berry + SW.res.petal + SW.res.ingot + (SW.tonics || 0);
SWF.enter('BASE'); frames(2);
let sawWork = false;
for (let i = 0; i < 3600; i++) { frames(1); const f = SWF.fol()[0]; if (f && (f.mode === 'b_fetch' || f.mode === 'b_carry')) { sawWork = true; break; } }
check('at base the follower goes to WORK (no trailing)', sawWork);
for (let i = 0; i < 3600; i++) { frames(1); const w1 = SW.res.wood + SW.res.stone + SW.res.berry + SW.res.petal + SW.res.ingot + (SW.tonics || 0); if (w1 > wealth0) break; }
check('its patch work lands in your stores', (SW.res.wood + SW.res.stone + SW.res.berry + SW.res.petal + SW.res.ingot + (SW.tonics || 0)) > wealth0);
SWF.setPos(120, 200); frames(240);
{ const f = SWF.fol()[0]; check('it does NOT trail you around your own base', !f || f.mode[0] === 'b' || Math.hypot(f.x - 120, f.y - 200) > 40); }
SWF.enter('MEADOW'); frames(30);
check('back on the road it follows again', SWF.fol()[0].mode === 'follow' || SWF.fol()[0].mode === 'haul');

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW19_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V43_OK');
