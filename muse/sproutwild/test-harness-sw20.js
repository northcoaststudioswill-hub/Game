// Sproutwild v4.4: SELECT command swap, sprout throwing (Sprouts-style), apple claiming + regrowth.
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
SW.followers.push(4); SWF.enter('BASE'); frames(3);
check('a follower is with you', (SWF.fol() || []).length === 1);

/* ---- SELECT swaps the command, Sprouts-style ---- */
check('command starts on BUDDY', SWF.cmdMode() === 'buddy');
tap('sel'); frames(2);
check('SELECT swaps to SPROUT command', SWF.cmdMode() === 'sprout');

/* ---- B throws the sprout at the tree in front of you ---- */
const tree = SWF.nodes().find(n => n.k === 'tree' && !n.got);
check('base has a tree to work', !!tree);
SWF.setPos(tree.x, tree.y + 34); hold('up', 2); frames(1);
const wood0 = SW.res.wood;
tap('b'); frames(3);
check('the sprout is THROWN (fly)', ['fly', 'seek', 'work'].includes(SWF.fol()[0].mode));
let worked = false, delivered = false;
for (let i = 0; i < 2400; i++) { frames(1); const f = SWF.fol()[0];
  if (f.mode === 'work') worked = true;
  if (worked && tree.got && (f.mode === 'b_rest' || f.mode === 'follow')) { delivered = true; break; } }
check('it latched on and worked the tree down', worked && tree.got);
check('and BROUGHT the wood back to you', delivered && SW.res.wood === wood0 + 2);

/* ---- hold B: the whistle calls a working sprout back ---- */
const rock = SWF.nodes().find(n => n.k === 'rock' && !n.got);
SWF.setPos(rock.x, rock.y + 34); hold('up', 2); frames(1);
tap('b'); frames(3);
for (let i = 0; i < 900 && SWF.fol()[0].mode !== 'work'; i++) frames(1);
check('second sprout is working the rock', SWF.fol()[0].mode === 'work');
G.keys.b = 1; frames(50); G.keys.b = 0; frames(2);
check('the whistle calls it back', ['return', 'b_rest', 'follow'].includes(SWF.fol()[0].mode) && !rock.got);

/* ---- fruit lives on typed bushes now, and regrows there ---- */
SWF.enter('BASE'); frames(2);
const bushes = SWF.bushes();
check('typed bushes replaced the apple field', !!bushes && bushes.length === 3 && SWF.items() == null);
const b0 = bushes[0]; b0.fruit = 0; b0.rg = 11.9; frames(30);
check('bush fruit regrows on a timer', b0.fruit === 1);
const w2 = (SWF.patch() || [])[1]; /* a second grown worker, so two planters can overlap */
if (w2 && w2.type < 0) { w2.type = 2; w2.age = 40; w2.stage = 2; w2.x = w2.sx; w2.y = w2.sy; w2.mode = 'soil'; w2.t = 0; }
let claimedPair = false;
for (let i = 0; i < 7200 && !claimedPair; i++) { frames(1);
  const planting = (SWF.patch() || []).filter(b => b.mode === 'plant' || (b.mode === 'fetch' && b.forPlot));
  const targets = planting.map(b => b.forPlot).filter(Boolean);
  if (targets.length >= 2 && targets[0] !== targets[1]) claimedPair = true;
  if (planting.length >= 2 && new Set(planting.map(b => b.forPlot)).size === planting.length) claimedPair = true; }
check('two planters never claim the same plot', claimedPair);

console.log('console.errors during run:', errors.length, errors.slice(0, 3));
if (fails.length || errors.length) { console.log('SW20_FAIL:', fails.join('; ')); process.exit(1); }
console.log('SPROUTWILD_V44_OK');
