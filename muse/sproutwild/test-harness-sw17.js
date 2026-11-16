'use strict';
/* Sproutwild v4.0 suite: confirms + selection cinematics, sprout tool jobs,
   BOTTIE (sky intro, Peak boss gating, raids), the 6-beat opening. */
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const errors = [];
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

/* boot: the opening is SIX beats now */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 10 && state() !== 'g4intro' && state() !== 'g4lesson' && state() !== 'g4world'; i++) { tap('a'); frames(1); }
check('the opening cinematic starts', state() === 'g4intro');
tap('a'); tap('a'); tap('a'); tap('a');
check('still cinematic after 4 beats (it grew)', state() === 'g4intro');
tap('a'); tap('a'); frames(2);
check('six beats hand straight off to the world (v4.1: no lesson)', state() === 'g4world');

/* keeper switch: ARE YOU SURE, then a selection cinematic */
tap('start'); frames(2);
for (let i = 0; i < 5; i++) tap('down'); /* KEEPER row */
tap('a'); frames(2);
check('keeper screen opens', state() === 'g4keeper');
tap('down'); /* ERIN */
tap('a'); frames(2);
check('switching asks ARE YOU SURE first', state() === 'g4confirm' && !!SWF.confirm());
tap('b'); frames(1);
check('NO backs out, keeper unchanged', state() === 'g4keeper' && SW.keeper === 'WILL');
tap('a'); frames(2);
tap('a'); frames(2); /* YES */
check('YES plays the selection cinematic', state() === 'g4cine' && SWF.cine() && SWF.cine().id === 'ERIN');
tap('a'); frames(1);
check('cinematic lands in the world as ERIN', state() === 'g4world' && SW.keeper === 'ERIN');
tap('start'); frames(1); tap('b'); frames(1); /* tidy: close any pause */

/* sprout TOOL JOBS: a sprout with the AXE works the base grove by itself */
SWF.tend(); SWF.enter('BASE'); frames(2);
SWF.addCrew(4); /* a free LEAF sprout */
const bench = SWF.build('bench', 12, 6);
SWF.setPos(260, 192); hold('up', 1); frames(2); /* bench cell (12,6) center (260,168): stand below, face up */
{ const n = SWF.near(); check('near something interactable at the bench', !!n); }
tap('a'); frames(2);
check('bench menu opens', state() === 'g4tools');
tap('down'); tap('down'); tap('down'); /* SPROUT JOBS row */
tap('a'); frames(2);
check('sprout jobs screen opens', state() === 'g4jobs');
tap('a'); frames(2); /* cycle the sprout: FREE -> AXE */
check('the sprout took the AXE job', SW.crew[0] && SW.crew[0].job === -2);
tap('b'); frames(1);
check('back in the world', state() === 'g4world');
const wood0 = SW.res.wood, trees0 = SWF.nodes().filter(n => n.k === 'tree' && !n.got).length;
frames(1500);
check('the axe sprout felled a tree on its own', SW.res.wood > wood0 || SWF.nodes().filter(n => n.k === 'tree' && !n.got).length < trees0);

/* BOTTIE descends after your first sigil */
SW.badges = ['VERDANT SIGIL']; SW.quest = 5;
SWF.enter('BASE'); frames(4);
check('Bottie clanks down (cinematic state)', state() === 'g4bottie');
frames(170);
check('he lands and starts talking', SWF.botState().ph === 1);
for (let i = 0; i < 5; i++) { tap('a'); frames(2); }
frames(80);
check('he rockets off; the valley knows his name now', state() === 'g4world' && SW.bottieSeen === 1);

/* his boss fight waits at the Peak once the champion falls */
SW.gymDone[4] = 1; SWF.enter('PEAK'); frames(2);
check('Peak gym becomes BOTTIE (index 5)', SWF.gymIx() === 5);

/* RAIDS: Bottie sends buddies at your base */
SWF.giveMon('EMBERCAP', 30, true); SWF.giveMon('TIDESTAG', 30, false);
const pet0 = SW.res.petal;
SWF.raid(); frames(2);
check('a raid starts a battle', state() === 'g4battle');
let fled = false;
for (let i = 0; i < 40 && state() === 'g4battle'; i++) {
  tap('a'); frames(2); /* advance any message */
  if (state() !== 'g4battle') break;
  tap('right'); tap('down'); tap('a'); frames(3); /* RUN (grid: 0 -> right 1 -> down 3) */
  if (state() !== 'g4battle') { fled = true; break; }
  for (let j = 0; j < 6 && state() === 'g4battle'; j++) { tap('a'); frames(2); }
}
check('the raid ends (fled or finished)', state() === 'g4world');
/* fleeing costs petals, winning pays them — either way the raid resolves (driver taps can win it) */

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW17_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V40_OK');
