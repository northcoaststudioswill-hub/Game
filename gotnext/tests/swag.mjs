// Room to work: show-off dribbles when the defender sags, and his stance sagging off or up close. node tests/swag.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } };
  window.__pad = { connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false })) }; window.__usePad = false;
  navigator.getGamepads = () => window.__usePad ? [window.__pad] : [];
  window.__press = (n, hold) => { window.__pad.buttons[n].pressed = true; window.__tick(hold || 2); window.__pad.buttons[n].pressed = false; window.__tick(2); }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); });
const set = `var P = __pit, M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), d = opp[0]; M.phase = 'live'; M.needClear = false; for (const q of M.P) { q.st = 'free'; q.y = 0; q.vx = q.vz = 0; if (q.ai) q.ai.tick = 999; q.x = 7; q.z = 12; } while (P.IN.length < 8) P.IN.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null }); for (const q of opp) { q.user = true; q.ctrl = 7; }`;
let r = await p.evaluate(s => { eval(s); me.x = 0; me.z = 7.5; me.face = Math.PI; d.x = 0; d.z = 3.6; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; M.off = me.team; d.man = me; const seen = {}, hands = {}; let sw = 0, last = null, lost = 0;
  for (let i = 0; i < 60 * 24; i++) { M.clock = 14; window.__tick(1); if (me.swag) seen[me.swag] = 1; const h = me.drib && me.drib.hand; if (me.swag === 'tween' || me.swag === 'behind') { if (last && h !== last) sw++; } last = h; if (M.B.holder !== me) lost++; }
  return { seen: Object.keys(seen), sw, lost, def: d.an, far: +Math.hypot(d.x - me.x, d.z - me.z).toFixed(1) }; }, set);
ok(r.seen.length >= 5 && r.sw >= 6 && r.lost === 0, `defender ${r.far} m off: over 24 s the handler runs through ${r.seen.join(', ')}; the ball changed hands ${r.sw} times through the legs and behind the back; never lost it`);
await p.screenshot({ path: path.join(dir, 'shots', 'swag.png'), timeout: 300000 });
r = await p.evaluate(s => { eval(s); me.x = 0; me.z = 7.5; d.x = 0; d.z = 3.6; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; M.off = me.team; d.man = me; d.guard = me; window.__tick(30); const R = d.rig, far = { y: +R.yOff.toFixed(2), hi: Math.min(R.cur.shR[0], R.cur.shL[0]) };
  d.z = 6.6; window.__tick(40); const near = { y: +R.yOff.toFixed(2), hi: +Math.min(R.cur.shR[0], R.cur.shL[0]).toFixed(2) }; return { far: { y: far.y, hi: +far.hi.toFixed(2) }, near, sw: me.swag }; }, set);
ok(r.far.y > r.near.y + 0.05 && r.near.hi < -1.8 && r.far.hi > -1.9 && !r.sw, `the defender: sagging off he stands taller (hips ${r.far.y}) with his hands low and wide; up close he drops (${r.near.y}) with a hand up in the face (shoulder ${r.near.hi}); and the show-off dribbles stop`);
await p.screenshot({ path: path.join(dir, 'shots', 'tight.png'), timeout: 300000 });
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
