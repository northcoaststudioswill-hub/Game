// Sproutwild v3.0 render rig: cinematic beats, decluttered base, mid-base
// buildings + ready nursery, Lantern Town. Same op-recording rig as sw.
// Usage: node test-render-sw30.js <htmlPath> <outJson>
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let errors = [];
console.error = (...a) => { errors.push(String(a[0] && a[0].message || a[0])); };
let CID = 0;
const canvases = {};
function mult(m, n) { return [m[0]*n[0]+m[2]*n[1], m[1]*n[0]+m[3]*n[1], m[0]*n[2]+m[2]*n[3], m[1]*n[2]+m[3]*n[3], m[0]*n[4]+m[2]*n[5]+m[4], m[1]*n[4]+m[3]*n[5]+m[5]]; }
function makeCtx(owner) {
  const st = { fillStyle: '#000000', strokeStyle: '#000000', globalAlpha: 1, font: '10px monospace', lineWidth: 1, tf: [1,0,0,1,0,0], stack: [] };
  const ctx = {
    __st: st,
    measureText(s) { const m = /(\d+(?:\.\d+)?)px/.exec(st.font); const fs = m ? parseFloat(m[1]) : 10; return { width: String(s).length * fs * 0.6 }; },
    fillRect(x, y, w, h) { owner.__ops.push({ op: 'rect', x, y, w, h, c: st.fillStyle, a: st.globalAlpha, tf: st.tf.slice() }); },
    clearRect() { owner.__ops.length = 0; },
    drawImage(img, dx, dy, dw, dh) { if (img && img.__cid !== undefined) owner.__ops.push({ op: 'img', src: img.__cid, dx, dy, dw: dw === undefined ? null : dw, dh: dh === undefined ? null : dh, a: st.globalAlpha, tf: st.tf.slice() }); else { owner.__ops.push({ op: 'BADIMG' }); console.error('BADIMG: drawImage source has no __cid (sprite object?)'); } },
    save() { st.stack.push([st.tf.slice(), st.globalAlpha]); },
    restore() { const s = st.stack.pop(); if (s) { st.tf = s[0]; st.globalAlpha = s[1]; } },
    translate(x, y) { st.tf = mult(st.tf, [1,0,0,1,x,y]); },
    scale(x, y) { st.tf = mult(st.tf, [x,0,0,y,0,0]); },
    setTransform(a, b, c, d, e, f) { st.tf = [a,b,c,d,e,f]; },
    rotate(a) { const c = Math.cos(a), s = Math.sin(a); st.tf = mult(st.tf, [c, s, -s, c, 0, 0]); },
    beginPath() { owner.__path = []; },
    arc(x, y, r) { (owner.__path = owner.__path || []).push({ x, y, r }); },
    rect(x, y, w, h) { owner.__ops.push({ op: 'rect', x, y, w, h, c: st.fillStyle, a: st.globalAlpha, tf: st.tf.slice() }); },
    fill() { for (const p of owner.__path || []) owner.__ops.push({ op: 'circ', x: p.x, y: p.y, r: p.r, c: st.fillStyle, a: st.globalAlpha, tf: st.tf.slice() }); owner.__path = []; },
    stroke() { owner.__path = []; },
    fillText(s, x, y) { owner.__ops.push({ op: 'text', s: String(s), x, y, c: st.fillStyle, a: st.globalAlpha, tf: st.tf.slice(), font: st.font }); },
    strokeText(s, x, y) { owner.__ops.push({ op: 'text', s: String(s), x, y, c: st.strokeStyle, a: st.globalAlpha, tf: st.tf.slice(), font: st.font }); },
    clip() {}, moveTo() {}, lineTo() {}, closePath() {}, setLineDash() {}
  };
  for (const k of ['fillStyle', 'strokeStyle', 'globalAlpha', 'font', 'lineWidth', 'imageSmoothingEnabled', 'textAlign', 'textBaseline', 'shadowColor', 'shadowBlur']) {
    Object.defineProperty(ctx, k, { get: () => st[k], set: v => { st[k] = v; } });
  }
  return ctx;
}
function el(id) {
  const classes = new Set();
  const e = { id, __cid: CID++, __ops: [], hidden: false, textContent: '', clientWidth: 120, clientHeight: 60,
    width: 300, height: 150, offsetWidth: 100,
    style: { setProperty() {} },
    classList: { add: c => classes.add(c), remove: c => classes.delete(c), toggle: (c, f) => { f ? classes.add(c) : classes.delete(c); }, contains: c => classes.has(c) },
    addEventListener() {}, setPointerCapture() {},
    getBoundingClientRect: () => ({ top: 100, left: 50, width: 100, height: 120, bottom: 220, right: 150 }),
    parentNode: { clientWidth: 360, clientHeight: 300 },
    querySelectorAll: () => carts };
  e.getContext = () => e.__ctx || (e.__ctx = makeCtx(e));
  canvases[e.__cid] = e;
  return e;
}
const byId = {}; const carts = [0, 1, 2].map(i => el('cart' + i));
global.window = global;
global.document = { getElementById: id => byId[id] || (byId[id] = el(id)), createElement: () => el('dyn'), addEventListener() {}, fonts: null };
byId['shelf'] = el('shelf');
const store = {};
global.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.Image = class { constructor() { this.complete = false; } };
let rafCb = null; global.requestAnimationFrame = cb => { rafCb = cb; }; global.addEventListener = () => {};
for (const s of scripts) eval(s);
const G = global.window.__g, SWF = G.SWF(), SW = G.SW();
const screen = byId['screen'];
let t = 0;
function frames(n) { for (let i = 0; i < n; i++) { t += 16.7; const cb = rafCb; rafCb = null; cb(t); } }
function tap(key, hold = 1) { G.keys[key] = 1; frames(hold); G.keys[key] = 0; frames(1); }
function hold(key, n) { G.keys[key] = 1; frames(n); G.keys[key] = 0; frames(1); }
const shots = {};
function shot(name) {
  screen.__ops.length = 0;
  frames(1);
  shots[name] = { w: screen.width, h: screen.height, ops: screen.__ops.slice() };
  console.log('shot', name, 'ops', shots[name].ops.length, 'state', SWF.state());
}
/* v3.3 scenes: new battle stage (menu + moves), party leader, brighter world */
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
for (let i = 0; i < 7 && SWF.state() !== 'g4world'; i++) { tap('a'); frames(1); }
tap('b'); frames(2);
SWF.enter('MEADOW');
SWF.giveMon('CINDERCAP', 12); SWF.giveMon('DRIZZLET', 9); SWF.giveMon('ZIPWIG', 11);
SWF.giveBud('EMBER', 3); SWF.giveBud('DEW', 2); SWF.giveBud('LEAF', 1);
SWF.forceWild('FERNFANG', 8); frames(3);
for (let i = 0; i < 60 && !(SWF.bt() && SWF.bt().phase === 'menu'); i++) { tap('a'); frames(2); }
shot('v33-battle');
tap('a'); frames(2); shot('v33-moves');
tap('b'); frames(2);
tap('right'); tap('a'); frames(2); shot('v33-budpick');
for (let i = 0; i < 240 && SWF.state() !== 'g4world'; i++) { tap('a'); frames(2); }
tap('start'); frames(1); tap('a'); frames(1); shot('v33-party');
tap('b'); frames(1); tap('b'); frames(1);
SWF.enter('BASE'); SWF.setPos(240, 330); frames(4); shot('v33-base');
SWF.enter('MEADOW'); SWF.setPos(240, 214); frames(4); shot('v33-meadow');
const used = {};
function collect(cid) { if (used[cid]) return; const c = canvases[cid]; if (!c) return; used[cid] = { w: c.width, h: c.height, ops: c.__ops };
  for (const o of c.__ops) if (o.op === 'img') collect(o.src); }
for (const s of Object.values(shots)) for (const o of s.ops) if (o.op === 'img') collect(o.src);
fs.writeFileSync(process.argv[3], JSON.stringify({ shots, canvases: used, screenCid: screen.__cid }));
console.log('errors:', errors.length, errors.slice(0, 3));
console.log('RENDER_CAPTURE_OK');
