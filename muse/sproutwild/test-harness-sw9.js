// Sproutwild v3.1: starter cards for all three, gate lesson paths, old-save sign behavior.
// Usage: node test-harness-sw9.js <htmlPath>
const fs = require('fs');
const vm = require('vm');
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

/* fresh save: meet Louie in the heart of the base, not at the gate */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
const pp = SWF.pos();
check('you start in the heart of the base, far from the gate', pp.y < 400 && Math.hypot(pp.x - 240, pp.y - 498) > 120);
const lou = SWF.louie();
SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1);
tap('a'); frames(2);
check('Louie met — quest 1', SWF.quest() === 1 && state() === 'g4lou');
tap('b'); frames(1);
SWF.tend(); /* v3.4: the sprouts are grown (physical tending is covered in sw4) */

/* all three starter cards explain before they commit */
for (const [sp, x, y] of [['CINDERCAP', 184, 302], ['DRIZZLET', 240, 286], ['FERNFANG', 296, 302]]) {
  SWF.setPos(x, y + 26); hold('up', 6); frames(1);
  check(sp + ' offers itself', SWF.near() && SWF.near().k === 'choice' && SWF.near().sp === sp);
  tap('a'); frames(2);
  check(sp + ' card opens, still no partner', state() === 'g4choice' && SW.party.length === 0);
  tap('b'); frames(1);
  check(sp + ' card backs out cleanly', state() === 'g4world' && SW.party.length === 0);
}
/* commit to FERNFANG on the second visit */
SWF.setPos(296, 328); hold('up', 6); frames(1);
tap('a'); frames(2); tap('a'); frames(2);
check('confirmed FERNFANG after reading its card', SW.party.length === 1 && SW.party[0].sp === 'FERNFANG' && SWF.quest() === 2);
tap('a'); frames(2); /* v4.0: dismiss the partner-joined cinematic */

/* gate lesson: B defers it, and it never ambushes twice */
SWF.setPos(240, 488); hold('down', 1); frames(1);
tap('a'); frames(2);
check('gate lesson opens at first travel', state() === 'g4gate');
tap('b'); frames(1);
check('B defers the lesson back to the world', state() === 'g4world');
tap('a'); frames(2);
check('second visit goes straight to the map', state() === 'g4map');
tap('b'); frames(1);

/* an established save (quest 5 facts, no gateSeen) is never ambushed */
{
  const byId2 = {}; const carts2 = [0, 1, 2].map(i => el('cart' + i));
  let raf2 = null;
  const sb = { console, Math, JSON, setTimeout: () => {}, clearTimeout: () => {} };
  sb.window = sb; sb.globalThis = sb;
  sb.document = { getElementById: id => byId2[id] || (byId2[id] = el(id)), createElement: () => el('dyn'), addEventListener() {}, fonts: null };
  byId2['shelf'] = el('shelf');
  const oldSave = { party: [{ sp: 'CINDERCAP', lv: 9, xp: 40, hp: 40, moves: ['tackle', 'embershot'], uid: 1 }], box: [], badges: ['VERDANT SIGIL'], res: { wood: 9, stone: 3, petal: 40, berry: 4, ingot: 0 },
    orbs: 3, tonics: 1, buildings: [{ k: 'cottage', gx: 10, gy: 6, workers: [] }, { k: 'bed', gx: 11, gy: 6, workers: [] }], seen: { CINDERCAP: 1 }, caught: { CINDERCAP: 1, PEBBLIT: 1 }, uidN: 2,
    intro: 1, sector: 'BASE', gymDone: { 0: 1 }, playT: 900, baseLv: 2, hearts: 3, heartsTotal: 9, keeper: 'WILL', visited: {}, talkN: { LOUIE: 2 }, bottieSeen: 1 };
  const store2 = { 'sproutwild-v1': JSON.stringify(oldSave), 'sw-mig3': '1' };
  sb.localStorage = { getItem: k => store2[k] ?? null, setItem: (k, v) => { store2[k] = String(v); }, removeItem: k => { delete store2[k]; } };
  sb.Image = global.Image;
  sb.requestAnimationFrame = cb => { raf2 = cb; };
  sb.addEventListener = () => {};
  vm.createContext(sb);
  for (const s of scripts) vm.runInContext(s, sb);
  const G2 = sb.__g, SWF2 = G2.SWF();
  let t2 = 0;
  const fr2 = n => { for (let i = 0; i < n; i++) { t2 += 16.7; const cb = raf2; raf2 = null; cb(t2); } };
  const tap2 = k => { G2.keys[k] = 1; fr2(1); G2.keys[k] = 0; fr2(1); };
  /* the sandbox console starts powered off — boot it like a player would */
  fr2(3); tap2('right'); tap2('right'); tap2('a'); fr2(55); tap2('a'); fr2(3);
  for (let i = 0; i < 14 && SWF2.state() !== 'g4world'; i++) { tap2('a'); fr2(1); }
  SWF2.enter('BASE'); fr2(2);
  SWF2.setPos(240, 488); G2.keys['down'] = 1; fr2(1); G2.keys['down'] = 0; fr2(1);
  tap2('a'); fr2(2);
  check('established save: sign opens the map directly, no lesson', SWF2.state() === 'g4map');
}

frames(20);
console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW9_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V31_OK');
