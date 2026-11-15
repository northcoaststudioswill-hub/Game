// Sproutwild v2 systems: keepers, NPCs, Louie, base levels, gratitude,
// discovery, keeper battle moves. Physical inputs where practical.
// Usage: node test-harness-sw3.js <htmlPath>
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
function drainBattle(max) { let i = 0; while (state() === 'g4battle' && i++ < max) { const bt = SWF.bt(); if (!bt) break; if (bt.phase === 'menu') break; tap('a'); frames(2); } }

/* boot + starter */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && state() !== 'g4world'; i++) { tap('a'); frames(1); } /* title + story beats -> world */
SWF.giveMon('CINDERCAP', 5, false); /* starter seeded — the walk-up choice is covered in sw4 */
check('boot -> base', state() === 'g4world' && SW.keeper === 'WILL');

/* keeper select through the pause menu */
tap('start'); frames(1);
for (let i = 0; i < 5; i++) tap('down');
tap('a'); frames(1);
check('pause -> keeper screen', state() === 'g4keeper');
tap('down'); tap('a'); frames(2); /* select ERIN -> ARE YOU SURE */
tap('a'); frames(2); /* YES -> selection cinematic */
tap('a'); frames(2); /* dismiss cinematic */
check('switched to ERIN from the menu', SW.keeper === 'ERIN' && state() === 'g4world');
check('NPCs at base are the OTHER two', SWF.npcs().map(n => n.who).sort().join(',') === 'MARCUS,WILL');

/* talk to an NPC and take the lantern from them */
SWF.setKeeper('WILL');
const erinNpc = SWF.npcs().find(n => n.who === 'ERIN');
SWF.setPos(erinNpc.x, erinNpc.y + 25); hold('up', 2); frames(1);
tap('a'); frames(2);
check('talking to Erin', !!SWF.talk() && SWF.talk().who === 'ERIN');
tap('a'); frames(1);
check('talk page 2 (handoff prompt)', SWF.talk() && SWF.talk().page === 1);
tap('a'); frames(2);
check('became ERIN by talking to her', SW.keeper === 'ERIN' && !SWF.talk());

/* keeper battle moves: one per battle */
SWF.setKeeper('ERIN');
SWF.forceWild('PEBBLIT', 3); frames(80);
check('battle intro -> menu', SWF.bt() && SWF.bt().phase !== 'intro');
drainBattle(60);
const foeMax = SWF.bt().foe.hp;
tap('down'); tap('a'); frames(3); /* KEEPER = index 2 (grid: one DOWN) */
check('TOWEL WHIP fired, foe tangled', SWF.bt().keeperUsed === true && SWF.bt().foe.hp < foeMax);
drainBattle(80);
check('back at menu after rooted foe turn', state() === 'g4battle' && SWF.bt().phase === 'menu');
tap('down'); tap('a'); frames(2); /* KEEPER again (grid) */
check('keeper move is once per battle', state() === 'g4battle' && SWF.bt().phase === 'menu');
/* finish the fight physically-ish */
SW.party[0].lv = 15;
let guard = 0;
while (state() === 'g4battle' && guard++ < 300) { const bt = SWF.bt(); if (bt.phase === 'menu') { let g9 = 0; while (SWF.sel() !== 0 && g9++ < 5) tap('right'); tap('a'); } else tap('a'); frames(2); }
check('battle ends cleanly', state() === 'g4world');

/* base level 1 board -> ring the lantern */
SWF.give('wood', 40); SWF.give('stone', 20);
SWF.build('cottage', 4, 2); SWF.build('bed', 5, 2);
SWF.giveMon('FERNFANG', 5, true); SWF.giveMon('DRIZZLET', 5, true); SWF.giveMon('PEBBLIT', 5, true);
check('assign a worker to the bed', SWF.assignFirst(1) === true);
check('base board complete at Lv1', SWF.base().ready === true && SWF.base().lv === 1);
const plot1 = SWF.plot();
SWF.setPos(240, 74); hold('up', 2); frames(1);
check('near the Base Lantern', SWF.near() && SWF.near().k === 'lantern');
tap('a'); frames(2);
check('lantern opens its menu (v2.2)', state() === 'g4lamp');
tap('a'); frames(2); /* RING THE LANTERN is the first row when the board is done */
tap('a'); frames(2); /* ARE YOU SURE -> YES */
check('BASE LEVEL 2 after ringing the lantern', SW.baseLv === 2 && state() === 'g4world');
const plot2 = SWF.plot();
check('build field is the whole base from the start (v3.0)', plot1.c0 === 0 && plot1.c1 === 22 && plot1.r0 === 0 && plot1.r1 === 23 && plot2.c1 === 22);

/* gratitude: production drops hearts, walking collects them */
SWF.tick(60);
const gh = SWF.groundHearts();
check('workers dropped gratitude hearts', gh.length > 0);
if (gh.length) {
  const h0 = SW.hearts, g0 = gh.length;
  SWF.setPos(gh[0].x, gh[0].y); frames(3);
  check('walked over a heart and collected it', SW.hearts > h0 && SWF.groundHearts().length < g0);
}

/* Erin production passive (+1 yield) */
SWF.setKeeper('WILL'); const b0 = SW.res.berry; SWF.tick(1); const willGain = SW.res.berry - b0;
SWF.setKeeper('ERIN'); const b1 = SW.res.berry; SWF.tick(1); const erinGain = SW.res.berry - b1;
check('Erin Green Hands: +1 yield per tick', erinGain === willGain + 1);

/* Louie: talk menu, PET, SHOW ME tour */
SWF.enter('BASE'); frames(2);
let lou = SWF.louie();
SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1);
tap('a'); frames(2);
check('Louie menu opens', state() === 'g4lou');
tap('down'); tap('down'); tap('a'); frames(1);
check('PET LOUIE gives gratitude', SW.hearts >= 1);
tap('b'); frames(1);
/* SHOW ME: he should lead to the lantern (Lv2 board not ready -> first unbuilt/next goal) */
lou = SWF.louie(); SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1);
tap('a'); frames(2);
check('Louie menu reopens', state() === 'g4lou');
tap('a'); frames(2); /* SHOW ME THE WAY */
check('Louie sets off as guide', SWF.louie().mode === 'guide' || SWF.louie().mode === 'wait');
frames(500);
check('Louie arrives and waits', SWF.louie().mode === 'wait');
lou = SWF.louie(); SWF.setPos(lou.x + 6, lou.y + 6); frames(30);
check('Louie delivers the tour line and follows again', SWF.louie().mode === 'follow');

/* discovery banner: first visit only */
SW.badges.push('VERDANT SIGIL'); SWF.enter('WASTES'); frames(2);
check('first entry shows the discovery banner', !!SWF.banner() && SWF.banner().txt === 'EMBER WASTES' && SW.visited.WASTES === 1);
frames(220);
SWF.enter('MEADOW'); frames(220); /* Meadow's own first-visit banner plays out */
SWF.enter('WASTES'); frames(2);
check('revisiting does not re-banner', !SWF.banner() || SWF.banner().t <= 0);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW3_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V2_OK');
