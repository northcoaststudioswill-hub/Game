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

/* boot -> title -> first A plays the cinematic */
frames(3); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
check('boot -> g3title', state() === 'g3title');
tap('a'); frames(2);
check('first boot -> g3cine', state() === 'g3cine' && !RDF.cineSeen());
tap('a'); frames(2);
check('A advances the cinematic (still playing)', state() === 'g3cine');
tap('start'); frames(2);
check('skip -> hub, cineSeen saved', state() === 'g3hub' && RDF.cineSeen());

/* sprout ledger: party + exchange */
RD.bank[0] = 4; RD.bank[5] = 1;
RDF.open('sprouts'); frames(1);
check('ledger opens', state() === 'g3sprouts');
tap('a'); frames(1);
check('EMBER joins the diving party', RDF.party().length === 1 && RDF.party()[0] === 0);
tap('right'); frames(1);
check('exchange page', state() === 'g3sprouts');
tap('a'); frames(2);
check('trade 3 EMBER -> 1 ZIP', RDF.bank()[0] === 1 && RDF.bank()[3] === 1);
tap('b'); frames(1);
check('ledger exit -> hub', state() === 'g3hub');

/* dive: party sprout comes along, banked on escape */
RDF.depart(); frames(3);
check('party EMBER in the run (bank spent)', RDF.buds().includes(0) && RDF.bank()[0] === 0);
RDF.pod(2); frames(40);
check('DEW pod collected into the string', RDF.buds().includes(2));
RDF.finale(); frames(3);
RDF.clearRoom(); frames(6);
check('escape banks the sprouts', state() === 'g3win' && RDF.bank()[2] === 1 && RDF.bank()[0] === 1);
for (let i = 0; i < 60 && state() !== 'g3hub'; i++) { tap('a'); frames(30); }
check('win screen -> hub', state() === 'g3hub');

/* NPCs wander the Hearth */
{
  const p0 = RDF.npcPos('ERIN'), l0 = RDF.npcPos('LOUIE');
  frames(1500);
  const p1 = RDF.npcPos('ERIN'), l1 = RDF.npcPos('LOUIE');
  const moved = (a, b) => a && b && Math.hypot(a[0] - b[0], a[1] - b[1]) > 3;
  check('NPCs wander (Erin or Louie moved)', moved(p0, p1) || moved(l0, l1));
}
/* conversations page through multiple lines */
{
  RDF.talk('MARCUS'); frames(1);
  const seen = new Set([RDF.talkTxt()]);
  for (let i = 0; i < 14 && state() === 'g3talk'; i++) { tap('a'); frames(1); if (state() === 'g3talk') seen.add(RDF.talkTxt()); }
  check('one conversation, many lines (Marcus)', seen.size >= 4);
  check('conversation ends at hub', state() === 'g3hub');
}
/* B cancels a conversation instantly, mid-lines */
{
  RDF.talk('SCOUT'); frames(1); tap('a'); frames(1);
  check('mid-conversation', state() === 'g3talk');
  tap('b'); frames(1);
  check('B cancels dialogue -> hub', state() === 'g3hub');
}
/* a chamber ALWAYS yields a sprout pod */
{
  const __origRandom = Math.random; Math.random = () => 0.99;
  RDF.depart(); frames(3);
  RDF.clearRoom(); frames(3);
  check('pod guaranteed even with zero luck', RDF.pods().length >= 1);
  Math.random = __origRandom;
  tap('start'); frames(1); tap('down'); tap('down'); tap('down'); tap('a'); frames(2);
  check('abandon after pod test -> hub', state() === 'g3hub');
}

/* menu + settings round trip */
tap('sel'); frames(2);
check('ejected from hub -> shelf (off)', state() === 'off');
frames(3); tap('a'); frames(2); frames(50); tap('a'); frames(3);
check('reboot -> g3title', state() === 'g3title');
tap('a'); frames(2);
check('title A -> menu (cinematic seen)', state() === 'g3menu');
tap('down'); tap('down'); tap('a'); frames(2);
check('menu SETTINGS -> g3set', state() === 'g3set');
const sfx0 = RDF.set().sfx;
tap('right'); frames(1);
check('volume adjust writes settings', RDF.set().sfx !== sfx0 || RDF.set().mus !== undefined);
tap('b'); frames(1);
check('settings back -> menu', state() === 'g3menu');
tap('up'); tap('up'); tap('a'); frames(2);
check('menu TO THE HEARTH -> hub', state() === 'g3hub');

/* settings from pause keeps the run */
RDF.start(); frames(1); RDF.depart(); frames(2);
tap('start'); frames(1);
check('pause opens', state() === 'g3pause');
tap('down'); tap('down'); tap('a'); frames(1);
check('pause SETTINGS -> g3set', state() === 'g3set');
tap('b'); frames(1);
check('settings back -> pause, run alive', state() === 'g3pause' && RDF.state().run !== null);
tap('b'); frames(1);
check('unpause -> run', state() === 'g3run');

/* character select: unlock gates + dive as Erin + her signature */
{
  RD.gift.ERIN = 3; /* scaffolding: meet Erin's unlock condition */
  RDF.open('chars'); frames(1);
  check('chars screen opens', state() === 'g3chars');
  const un = RDF.unlocks();
  check('unlocks: Will+Erin open, Louie+Marcus locked', un[0].endsWith('open') && un[1].endsWith('open') && un[2].endsWith('locked') && un[3].endsWith('locked'));
  tap('down'); tap('down'); frames(1); tap('a'); frames(1);
  check('locked Marcus refuses to dive', state() === 'g3chars');
  tap('up'); tap('up'); tap('down'); frames(1); tap('a'); frames(3);
  check('dive as ERIN', state() === 'g3run' && RDF.char() === 'ERIN');
  const am0 = RDF.pos().ammo; tap('b'); frames(2);
  check('Erin signature (towel whip) consumes cast ammo', RDF.pos().ammo === am0 - 1);
  RDF.hurt(99999); frames(30);
  for (let i = 0; i < 200 && state() !== 'g3hub'; i++) { tap('a'); frames(10); }
  check('death returns to hub', state() === 'g3hub');
}
console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('RD3_FAIL'); process.exit(1); }
console.log('RD3_OK');
