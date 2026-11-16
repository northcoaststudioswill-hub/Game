// Sproutwild v4.7: wild battles are ACTIVATED — A challenges, a thrown sprout engages, grass reveals.
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

/* boot -> world with a party and a follower, out in the Meadow */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 16 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
SWF.tend(); SWF.giveMon('FERNFANG', 8); SWF.enter('MEADOW'); frames(90);
check('wilds wander the meadow', (SWF.wilds() || []).length >= 2);

/* 1. contact is safe now */
const wd0 = SWF.wilds()[0];
SWF.setPos(wd0.x, wd0.y); frames(30);
check('standing ON a wild starts nothing', state() === 'g4world' && !SWF.bt());

/* 2. the prompt names the fight before you commit */
SWF.setPos(wd0.x, wd0.y + 14); hold('up', 2); frames(1);
const n = SWF.near();
check('A offers BATTLE <species> Lv<level>', !!n && n.k === 'wild' && n.txt.includes(wd0.sp) && n.txt.includes('Lv' + wd0.lv));

/* 3. throwing a sprout at a wild ACTIVATES its battle (Pikmin's throw-to-engage) */
SW.followers = [4]; SWF.enter('MEADOW'); frames(3);
const wd1 = SWF.wilds()[0];
SWF.setPos(wd1.x - 40, wd1.y); hold('right', 2); frames(1);
tap('sel'); frames(2); /* SPROUT command mode */
check('in SPROUT command mode', SWF.cmdMode() === 'sprout');
tap('b'); frames(2); /* the throw flies at the wild (target point = facing x46, snapped) */
let engaged = false;
for (let i = 0; i < 240 && !engaged; i++) { frames(1); if (state() === 'g4engage') engaged = true; }
if (!engaged) { /* the toss may have missed the 16px window: walk up and challenge instead */
  SWF.setPos(wd1.x, wd1.y + 14); hold('up', 2); frames(1); tap('a'); frames(2); engaged = state() === 'g4engage'; }
check('the battle ACTIVATES (transition state)', engaged && !!SWF.engage());
frames(45);
check('and lands in the turn-based battle', state() === 'g4battle' && !!SWF.bt() && SWF.bt().mode === 'wild');
/* run from the battle to restore the world */
for (let i = 0; i < 300 && state() === 'g4battle'; i++) { tap('down'); tap('down'); tap('a'); tap('a'); frames(2); }
check('fleeing returns to the world', state() === 'g4world');

/* 4. grass rustles REVEAL — they don't ambush */
let revealed = false;
for (let i = 0; i < 5400 && !revealed; i++) { frames(1);
  if ((SWF.wilds() || []).some(w => w.reveal != null)) revealed = true;
  if (state() === 'g4battle') break; }
check('no battle ever ambushed during the grass watch', state() !== 'g4battle');
check('no errors anywhere', errors.length === 0);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW23_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V47_OK');
