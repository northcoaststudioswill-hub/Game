// Sproutwild v3.7: the game explains itself — welcome lesson after the
// cinematic, the patch lesson on first touch, and the KEEPER'S GUIDE.
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

/* boot the console, pick the cartridge, ride the cinematic */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 16 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
check('v4.1: the cinematic hands straight to the WORLD — no text-box lesson', state() === 'g4world' && !SWF.lesson());
check('quest 0: meet Louie', SW.quest === 0);

/* Louie -> quest 1, and now he LEADS you to the patch himself */
const lou0 = SWF.louie();
{ SWF.setPos(lou0.x, lou0.y + 24); hold('up', 1); frames(1); tap('a'); frames(2); tap('b'); frames(1); }
check('quest 1: tend the patch', SW.quest === 1);
frames(150);
const lou1 = SWF.louie();
check('Louie guided you toward the patch', Math.hypot(lou1.x - 198, lou1.y - 330) < Math.hypot(lou0.x - 198, lou0.y - 330) - 24);

/* the patch starts as SEEDS — watering is the first lesson, taught by doing */
SWF.setPos(240, 344); frames(2);
check('the patch offers watering first', SWF.near() && SWF.near().k === 'patch' && /WATER/.test(SWF.near().txt || ''));
tap('a'); frames(2);
check('watering happens in the world, stage 1', state() === 'g4world' && SWF.tendState().stage === 1);
frames(100);
check('babies popped out of the Lantern soil', (SWF.tendBuds() || []).length === 3);
frames(280);
check('they fetch and carry on their own (stage 2)', SWF.tendState().stage === 2);
for (let i = 0; i < 4200 && SWF.tendState().stage < 3; i++) frames(1);
check('carrying grew them stage by stage to GROWN', SWF.tendState().stage === 3 && SWF.tendState().tended >= 3); /* v4.4: growth is by AGE */
check('still no free crew — grown is not given', SW.crew.length === 0);

/* pluck your first sprouts yourself: those are your catching sprouts */
const stock0 = Object.values(SW.buds).reduce((a, b) => a + b, 0);
function pluckGrown() { for (let ri = 0; ri < 40; ri++) { const gb = (SWF.tendBuds() || []).find(b => b.st === 'grown');
  if (gb) { SWF.setPos(gb.x, gb.y + 14); hold('up', 3); frames(1); if (SWF.near() && SWF.near().k === 'tendpluck') { tap('a'); frames(2); return true; } }
  frames(15); } return false; }
pluckGrown();
check('first grown sprout PLUCKED by hand', SWF.tendState().plucked === 1 && Object.values(SW.buds).reduce((a, b) => a + b, 0) === stock0 + 1);
pluckGrown();
check('second pluck completes the teaching', SWF.tendState().done === true);
check('the sprout you left behind stays at the patch', (SWF.patch() || [])[0] && SWF.patch()[0].type === 4);

/* the KEEPER'S GUIDE remains as a reference (pause -> GUIDE) */
tap('start'); frames(1);
for (let i = 0; i < 6; i++) tap('down');
tap('a'); frames(1);
check('pause -> KEEPER\'S GUIDE opens', state() === 'g4guide' && SWF.guidePage() === 0);
tap('a'); frames(1);
check('guide pages turn', SWF.guidePage() === 1);
tap('b'); frames(1); tap('b'); frames(1);
check('guide backs out to the world', state() === 'g4world');

/* first nightfall still gets its one line */
SWF.dayT(216); frames(50);
check('first-night line fires once', SW.lessons.night === 1);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW15_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V41_OK');
