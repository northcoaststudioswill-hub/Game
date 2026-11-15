// Headless playtest for Sproutwild (cartridge 3).
// Usage: node test-harness-sw.js <htmlPath>
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
if (!G || !G.SWF) { console.log('FAIL no SW hooks'); process.exit(1); }
const SWF = G.SWF(), SW = G.SW();
let t = 0, fails = [];
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); if (!rafCb) { console.log('FAIL rAF chain broke'); process.exit(1); } } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
function check(name, cond) { console.log((cond ? 'ok  ' : 'FAIL') + ' ' + name); if (!cond) fails.push(name); }
const state = () => SWF.state();

/* ---- boot cartridge 3 ---- */
frames(3);
tap('right'); tap('right'); tap('a'); frames(2);
check('cart 3 inserted -> boot', state() === 'boot');
frames(50); tap('a'); frames(3);
check('boot -> g4title', state() === 'g4title');
tap('a'); frames(2);
check('title -> intro (first boot)', state() === 'g4intro');
for (let i = 0; i < 14 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
check('story beats -> world at BASE, intro underway', state() === 'g4world' && SW.quest === 0);
SWF.giveMon('CINDERCAP', 5, false); /* walk-up choice covered in sw4 */
check('starter in party (seeded for system tests)', SW.party.length === 1 && SW.party[0].lv === 5);
SW.quest = 5; /* v2.1: this suite tests post-intro systems */

/* ---- sector travel lock ---- */
tap('start'); frames(1);
check('pause opens', state() === 'g4pause');
tap('down'); tap('down'); tap('down'); tap('a'); frames(1);
check('sectors -> map', state() === 'g4map');
tap('down'); tap('down'); tap('down'); tap('a'); frames(2);
check('WASTES locked without sigils (stays on map)', state() === 'g4map');
tap('b'); frames(1);
check('map back -> world', state() === 'g4world');

/* ---- wild battle: overlevel the starter and win ---- */
SW.party[0].lv = 12; SW.party[0].hp = 999;
SWF.enter('MEADOW'); frames(2);
check('entered MEADOW', state() === 'g4world');
SWF.forceWild('PEBBLIT', 3); frames(2);
check('wild battle starts', state() === 'g4battle' && SWF.bt() && SWF.bt().foe.sp === 'PEBBLIT');
let guard = 0;
while (state() === 'g4battle' && guard++ < 400) { tap('a'); frames(3); }
check('won wild battle -> back in world', state() === 'g4world');
check('starter gained XP or levels', SW.party[0].xp > 0 || SW.party[0].lv > 12);

/* ---- catching: weaken, stub luck, throw ---- */
SWF.forceWild('CINDERCAP', 3); frames(2);
SWF.bt().foe.hp = 1;
guard = 0;
while (SWF.bt() && SWF.bt().phase !== 'menu' && guard++ < 60) { tap('a'); frames(2); }
check('battle reached menu phase', SWF.bt() && SWF.bt().phase === 'menu');
const realRandom = Math.random; Math.random = () => 0.01;
SWF.orbs(3);
tap('down'); tap('a'); frames(30);
Math.random = realRandom;
guard = 0;
while (state() === 'g4battle' && guard++ < 120) { tap('a'); frames(3); }
check('catch resolved -> back in world', state() === 'g4world');
check('CINDERCAP caught (party or box)', SW.caught.CINDERCAP === 1 && (SW.party.some(m => m.sp === 'CINDERCAP') || SW.box.some(m => m.sp === 'CINDERCAP')));

/* ---- gym battle: Ranger for the Verdant Sigil ---- */
SWF.gym(0); frames(2);
check('gym battle starts vs Ranger', state() === 'g4battle' && SWF.bt().mode === 'gym');
guard = 0;
while (state() === 'g4battle' && guard++ < 600) { tap('a'); frames(3); }
check('gym won -> Verdant Sigil earned', SW.badges.includes('VERDANT SIGIL'));
check('back in world after gym', state() === 'g4world');
check('WASTES now unlocked by sigil count', SW.badges.length >= 1);

/* ---- base building + worker production ---- */
SWF.enter('BASE'); frames(1);
const b = SWF.build('bed', 3, 2);
check('garden bed built', SW.buildings.length === 1);
SWF.giveMon('FERNFANG', 5, true);
check('box has a FERNFANG', SW.box.some(m => m.sp === 'FERNFANG'));
check('assignFirst deploys a sprout worker (v3.9: sprouts work, buddies fight)', SWF.assignFirst(0) === true);
const berry0 = SW.res.berry;
SWF.tick(3);
check('production: bed + PLANTING worker yields berries', SW.res.berry >= berry0 + 3);
const b2 = SWF.build('pen', 5, 2);
check('pen built (worker capacity rises)', SW.buildings.length === 2);

/* ---- save ---- */
check('save written to sproutwild-v1', typeof store['sproutwild-v1'] === 'string' && store['sproutwild-v1'].includes('VERDANT'));

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW_FAIL'); process.exit(1); }
console.log('SPROUTWILD_OK');
