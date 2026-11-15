// Sproutwild v2.1: the intro quest chain, gates, and Will-the-NPC.
// Usage: node test-harness-sw4.js <htmlPath>
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

/* fresh game: the new opening — Louie, a choice, a catch, then building */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 14 && state() !== 'g4world'; i++) { tap('a'); frames(1); }
check('new game starts the intro (quest 0, no partner yet)', SWF.quest() === 0 && state() === 'g4world' && SW.party.length === 0);
check('base has starter trees to gather', SWF.nodes().filter(n => n.k === 'tree').length === 4);

/* step 0: talk to Louie */
let lou = SWF.louie();
SWF.setPos(lou.x, lou.y + 24); hold('up', 1); frames(1);
tap('a'); frames(2);
check('meeting Louie advances to quest 1', SWF.quest() === 1 && state() === 'g4lou');
tap('b'); frames(1);

/* travel is gated until you have a partner */
SWF.setPos(240, 488); hold('down', 1); frames(1);
tap('a'); frames(2);
check('map opens at the sign', state() === 'g4map');
tap('down'); tap('a'); frames(2); /* MEADOW */
check('travel blocked before choosing a partner', state() === 'g4map' && SW.sector === 'BASE');
tap('b'); frames(1);

/* v3.4: tend the sprout patch — the little buds fetch apples and grow */
SWF.setPos(240, 372); hold('up', 2); frames(1);
check('the sprout patch offers itself', SWF.near() && SWF.near().k === 'patch');
tap('a'); frames(2);
check('watering the seeds starts the growing (v4.1, no lesson)', state() === 'g4world' && SWF.tendState().stage === 1);
for (let i = 0; i < 4200 && SWF.tendState().stage < 3; i++) frames(1);
check('the sprouts grew stage by stage to grown', SWF.tendState().stage === 3 && SWF.tendState().tended >= 3); /* v4.4: growth is by AGE now, not a delivery quota */
function pluckGrown() { for (let ri = 0; ri < 40; ri++) { const gb = (SWF.tendBuds() || []).find(b => b.st === 'grown');
  if (gb) { SWF.setPos(gb.x, gb.y + 14); hold('up', 3); frames(1); if (SWF.near() && SWF.near().k === 'tendpluck') { tap('a'); frames(2); return true; } }
  frames(15); } return false; }
pluckGrown();
check('first grown sprout plucked by hand', SWF.tendState().plucked === 1);
pluckGrown();
check('second pluck finishes it — you EARNED these sprouts', SWF.tendState().done === true && SW.res.berry >= 3); /* berries = deliveries; v4.4 grows by age, fewer trips needed */

/* step 1: befriend a sprout by walking up to it (DRIZZLET waits center) */
SWF.setPos(240, 312); hold('up', 8); frames(1); /* DRIZZLET waits in the center clearing now */
check('a sprout offers itself', SWF.near() && SWF.near().k === 'choice' && SWF.near().sp === 'DRIZZLET');
tap('a'); frames(2);
check('the pick explains itself first (v3.1 card, no instant befriend)', state() === 'g4choice' && SW.party.length === 0);
tap('b'); frames(1);
check('B backs out to keep looking', state() === 'g4world' && SW.party.length === 0);
tap('a'); frames(2);
check('card reopens on the same sprout', state() === 'g4choice');
tap('a'); frames(2);
check('befriended DRIZZLET — quest 2', SW.party.length === 1 && SW.party[0].sp === 'DRIZZLET' && SWF.quest() === 2);
tap('a'); frames(2); /* v4.0: dismiss the partner-joined cinematic */

/* step 2: the Meadow — walk INTO a wandering sprout, orb it (intro catch cannot fail) */
SWF.setPos(240, 488); hold('down', 1); frames(1);
tap('a'); frames(2);
check('Louie teaches the Lantern Gate before first travel (v3.1)', state() === 'g4gate');
tap('a'); frames(1); tap('a'); frames(1); tap('a'); frames(2);
check('the lesson hands you the map, Meadow preselected', state() === 'g4map');
tap('a'); frames(2);
check('travel opens with a partner', state() === 'g4world' && SW.sector === 'MEADOW');
frames(85); /* entry grace expires */
check('wild sprouts wander the meadow', (SWF.wilds() || []).length >= 2);
if (state() !== 'g4battle') {
  const wd = SWF.wilds()[0];
  SWF.setPos(wd.x, wd.y); frames(3);
  check('walking INTO a wanderer no longer ambushes you (v4.7)', state() === 'g4world');
  SWF.setPos(wd.x, wd.y + 14); hold('up', 2); frames(1); tap('a'); frames(2);
  check('A ACTIVATES the battle (engage transition)', state() === 'g4engage');
  frames(45);
}
check('the activated battle starts', state() === 'g4battle' && !!SWF.bt());
const foeSp = SWF.bt().foe.sp;
let guard = 0;
while (SWF.bt() && SWF.bt().phase !== 'menu' && guard++ < 60) { tap('a'); frames(2); }
tap('right'); /* BUD is menu index 1 (grid nav: RIGHT = +1) */
tap('a'); frames(30);
guard = 0;
while (state() === 'g4battle' && guard++ < 150) { tap('a'); frames(2); }
check('intro catch completes — quest 3, partner caught', state() === 'g4world' && SWF.quest() === 3 && SW.caught[foeSp] === 1 && SW.party.length === 2);

/* gym refuses during the intro (gym 1 now lives in Lantern Town) */
SWF.enter('TOWN'); frames(2);
SWF.setPos(240, 92); hold('up', 2); frames(1);
check('at the gym leader', SWF.near() && SWF.near().k === 'gym');
tap('a'); frames(2);
check('gym refuses before the base stands', state() === 'g4world');

/* steps 3+4: buildings advance the quest (physical placement is covered elsewhere) */
SWF.enter('BASE'); frames(2);
SWF.build('cottage', 4, 2); frames(3);
check('cottage advances to quest 4', SWF.quest() === 4);
SWF.build('bed', 5, 2); frames(3);
check('garden bed completes the intro (quest 5)', SWF.quest() === 5);

/* and now the gym opens */
SWF.enter('TOWN'); frames(2);
SWF.setPos(240, 92); hold('up', 2); frames(1);
tap('a'); frames(2);
check('gym talk opens after the intro', state() === 'g4gym');
tap('b'); frames(1);

/* Will exists as an NPC when someone else holds the lantern */
SWF.enter('BASE'); frames(2);
SWF.setKeeper('ERIN');
check('Will is on the NPC roster as Erin', SWF.npcs().some(n => n.who === 'WILL'));
const willNpc = SWF.npcs().find(n => n.who === 'WILL');
SWF.setPos(willNpc.x, willNpc.y + 25); hold('up', 2); frames(1);
check('Will can be talked to', SWF.near() && SWF.near().k === 'npc' && SWF.near().who === 'WILL');
frames(30); /* draw frames run through the real draw path without errors */

/* old save (no quest field) with a FINISHED setup migrates to quest 5;
   unfinished old saves resume the intro instead (v2.3 — see sw7) */
{
  const byId2 = {}; const carts2 = [0, 1, 2].map(i => el('cart' + i));
  let raf2 = null;
  const sb = { console, Math, JSON, setTimeout: () => {}, clearTimeout: () => {} };
  sb.window = sb; sb.globalThis = sb;
  sb.document = { getElementById: id => byId2[id] || (byId2[id] = el(id)), createElement: () => el('dyn'), addEventListener() {}, fonts: null };
  byId2['shelf'] = el('shelf');
  const oldSave = { party: [], box: [], badges: [], res: { wood: 9, stone: 3, petal: 40, berry: 4, ingot: 0 },
    orbs: 3, tonics: 1, buildings: [{ k: 'cottage', gx: 4, gy: 2, workers: [] }, { k: 'bed', gx: 5, gy: 2, workers: [] }], seen: { CINDERCAP: 1, PEBBLIT: 1 }, caught: { CINDERCAP: 1, PEBBLIT: 1 }, uidN: 1,
    intro: 1, sector: 'BASE', gymDone: {}, playT: 0, baseLv: 1, hearts: 0, heartsTotal: 0, keeper: 'WILL', visited: {}, talkN: {} };
  sb.localStorage = { getItem: k => (k === 'sproutwild-v1' ? JSON.stringify(oldSave) : null), setItem: () => {}, removeItem: () => {} };
  sb.Image = global.Image;
  sb.requestAnimationFrame = cb => { raf2 = cb; };
  sb.addEventListener = () => {};
  vm.createContext(sb);
  for (const s of scripts) vm.runInContext(s, sb);
  const SWF2 = sb.__g.SWF();
  check('finished old save migrates to quest 5', SWF2.quest() === 5);
}

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW4_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_INTRO_OK');
