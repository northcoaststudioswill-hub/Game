// Render rig: records every canvas draw call the game makes, so the
// frames can be rasterized in Python and actually LOOKED at.
// Usage: node test-render.js <htmlPath> <outJson>
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
const shots = {};
function shot(name) {
  screen.__ops.length = 0;
  frames(1);
  shots[name] = { w: screen.width, h: screen.height, ops: screen.__ops.slice() };
  console.log('shot', name, 'ops', shots[name].ops.length, 'screen', screen.width, 'x', screen.height, 'state', SWF.state());
}
frames(3); tap('right'); tap('right'); tap('a'); frames(2); frames(50); tap('a'); frames(3);
shot('title');
tap('a'); frames(2);
for (let i = 0; i < 5 && SWF.state() !== 'g4starter'; i++) { tap('a'); frames(1); }
shot('starter');
tap('a'); frames(2);
SWF.build('cottage', 1, 0); SWF.build('bed', 3, 1); SWF.build('kiln', 5, 1); SWF.build('quarry', 7, 1); SWF.build('bench', 9, 0); SWF.build('pen', 9, 2);
SWF.giveMon('FERNFANG', 5, true); SWF.assignFirst(1);
SWF.giveMon('CINDERCAP', 6, true);
frames(3); shot('base');
SWF.enter('MEADOW'); frames(3); shot('meadow');
tap('start'); frames(1); tap('down'); tap('down'); tap('down'); tap('a'); frames(2); shot('map');
tap('b'); frames(1);
SWF.forceWild('CINDERCAP', 4); frames(2);
for (let i = 0; i < 80 && SWF.bt() && SWF.bt().phase !== 'menu'; i++) { if (SWF.bt().phase === 'msg' || SWF.bt().phase === 'intro') tap('a'); frames(2); }
shot('battle');
const used = {};
function collect(cid) { if (used[cid]) return; const c = canvases[cid]; if (!c) return; used[cid] = { w: c.width, h: c.height, ops: c.__ops };
  for (const o of c.__ops) if (o.op === 'img') collect(o.src); }
for (const s of Object.values(shots)) for (const o of s.ops) if (o.op === 'img') collect(o.src);
fs.writeFileSync(process.argv[3], JSON.stringify({ shots, canvases: used, screenCid: screen.__cid }));
console.log('errors:', errors.length, errors.slice(0, 3));
console.log('RENDER_CAPTURE_OK');
