// Crossovers cross (the ball goes to the hand on the side you go; toward the hand it is already in, a double cross),
// loose balls are grabbed (closing in: reaching for it; a scoop off the floor, a board pulled down from overhead) and on
// the back lot the ball stays live after a make. Stills: tests/shots/crossgrab.png.   node tests/crossgrab.mjs
// Stills: tests/shots/backlot-block.png, backlot-court.png.   node tests/backlot.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 800, height: 500 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; performance.now = () => window.__now;
  window.__pad = { connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; navigator.getGamepads = () => window.__usePad ? [window.__pad] : []; window.__press = (n, hold) => { window.__pad.buttons[n].pressed = true; window.__tick(hold || 2); window.__pad.buttons[n].pressed = false; window.__tick(2); }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(() => { const P = __pit; P.uiClose(); P.ev('window.__rr = renderer.render.bind(renderer); renderer.render = function () { }'); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); window.__usePad = true; });
const setup = (hand) => p.evaluate((hand) => { const P = __pit, M = P.MT, me = M.me; M.phase = 'live'; M.needClear = false; M.clock = 14; M.B.state = 'held'; M.B.holder = me; M.off = me.team; me.st = 'free'; me.y = 0; me.live = 'drib'; me.vx = me.vz = 0; me.x = 0; me.z = 6.5; me.face = Math.PI; me.moveCool = 0; me.stam = 100; for (const q of M.P) if (q !== me) { q.x = 7; q.z = 12; if (q.ai) q.ai.react = 99; } P.call('give', me); me.hand = hand; me.drib.hand = hand; me.handSwT = -9; window.__tick(40); me.x = 0; me.z = 6.5; me.face = Math.PI; me.vx = me.vz = 0; window.__tick(2); }, hand);
const cross = (dir) => p.evaluate((dir) => { const M = __pit.MT, me = M.me, B = M.B, seq = [me.hand], side = []; __pad.axes[2] = dir; window.__tick(2); __pad.axes[2] = 0; for (let f = 0; f < 75; f++) { window.__tick(1); if (seq[seq.length - 1] !== me.hand) seq.push(me.hand); side.push(B.pos.x - me.x); } const mv = me.mv && me.mv.mv.id; return { seq: seq.join('>'), mv, endX: +(side.slice(-10).reduce((a, b) => a + b, 0) / 10).toFixed(2), moved: +me.x.toFixed(2) }; }, dir);
for (const [h, dir, want] of [['R', -1, 'R>L'], ['L', 1, 'L>R'], ['L', -1, 'L>R>L'], ['R', 1, 'R>L>R']]) {
  await setup(h); const r = await cross(dir);
  const goes = dir < 0 ? 'left' : 'right', ok1 = r.seq === want && Math.sign(r.moved) === Math.sign(dir) && r.endX * dir > -0.06;      /* the ball ends on his side of the move (or centred in front of him) */
  ok(ok1, `ball in ${h === 'R' ? 'right' : 'left'} hand, cross ${goes}: hands ${r.seq} (${r.seq.length > 3 ? 'double cross' : 'crossover'}), went ${r.moved > 0 ? 'right' : 'left'}, ball ends on the ${r.endX > 0 ? 'right' : 'left'} of him`);
}
// a loose ball on the floor: reach for it, scoop it
let r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, B = M.B; B.state = 'loose'; B.holder = null; B.rebound = false; B.pos.set(0, 0.13, 3.2); B.vel.set(0, 0, 0); M.looseT = 0; me.x = 0; me.z = 6.0; me.face = Math.PI; me.st = 'free'; window.__tick(2);
  const away = () => { for (const q of M.P) if (q !== me) { q.x = 7; q.z = 12; q.vx = q.vz = 0; } }; let reach = 0, grab = null, path = []; __pad.axes[1] = -0.6; for (let f = 0; f < 90 && !grab; f++) { away(); window.__tick(1); if (me.grab) grab = { h: +me.grab.h.toFixed(2) }; } __pad.axes[1] = 0;
  const from = B.pos.clone(); for (let f = 0; f < 18; f++) { window.__tick(1); path.push(+B.pos.y.toFixed(2)); } return { grab, path: path.filter((_, i) => i % 3 === 0), held: B.holder === me }; });
ok(r.grab && r.grab.h < 0.4 && r.held && r.path[0] < r.path[r.path.length - 1], `walk onto a ball on the floor: a scoop (picked up at ${r.grab && r.grab.h} m), the ball comes up into his hands ${r.path.join('→')}`);
// a board from overhead
r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, B = M.B; B.state = 'loose'; B.holder = null; B.rebound = true; me.x = 0; me.z = 3; me.st = 'jump'; me.t = 0.25; me.y = 0.4; me.jumpH = 0.5; B.pos.set(0, 2.55, 3.1); B.vel.set(0, -0.5, 0); M.looseT = 0; let g = null; for (let f = 0; f < 20 && !g; f++) { window.__tick(1); if (me.grab) g = +me.grab.h.toFixed(2); } return g; });
ok(r !== null && r > 0.95, `a board grabbed overhead (at ${r} of his height): both hands up, pulled down`);
// stills: the scoop and the board
await p.evaluate(() => __pit.ev('renderer.render = window.__rr'));
await p.evaluate(() => document.querySelectorAll('#keys,#calls,#call,#toasts,#hud,#sb,.bub,#padhint').forEach(e => e.style.visibility = 'hidden'));
const shots = [];
for (const kind of ['scoop', 'board']) {
  await p.evaluate((kind) => { const P = __pit, M = P.MT, me = M.me, B = M.B; B.state = 'loose'; B.holder = null; B.rebound = kind === 'board'; M.looseT = 0; me.x = 0; me.z = 4; me.face = Math.PI; me.vx = me.vz = 0;
    if (kind === 'scoop') { me.st = 'free'; me.y = 0; B.pos.set(0.15, 0.13, 3.55); B.vel.set(0, 0, 0); } else { me.st = 'jump'; me.t = 0.25; me.y = 0.45; me.jumpH = 0.5; B.pos.set(0, 2.5, 4.05); B.vel.set(0, -0.3, 0); } window.__tick(1); }, kind);
  for (let i = 0; i < 4; i++) { await p.evaluate((kind) => { window.__tick(4); const me = __pit.MT.me; __pit.ev(`(() => { const m = MT.me; const hi = ${kind === 'board'}; camera.position.set(m.x + 2.6, hi ? 2.2 : 1.5, m.z + 1.4); camera.lookAt(m.x, hi ? 1.6 : 0.9, m.z); renderer.render(scene, camera); })()`); }, kind); shots.push((await p.screenshot({ clip: { x: 250, y: 40, width: 300, height: 420 } })).toString('base64')); }
}
// the back lot: a make drops through and stays live
r = await p.evaluate(() => { const P = __pit; P.ev('renderer.render = function () { }'); P.MT.cfg.onEnd = () => {}; P.ev('quitMatch()'); P.enterWorld('hub', -3.6, 16.6, 0); window.__tick(10); P.call('startPractice', 'lot'); window.__tick(30); const M = P.MT, me = M.me, B = M.B; me.x = 0; me.z = 3; window.__tick(2);
  P.startShot(me, 'stick'); window.__tick(Math.round(me.shot.rel * 60)); P.call('releaseShot', me); window.__tick(10); me.x = 6; me.z = 9; let st = []; for (let f = 0; f < 240; f++) { window.__tick(1); if (f % 30 === 0) st.push(B.state + (B.holder ? ':' + (B.holder === me ? 'me' : 'x') : '')); }
  const live = B.state === 'loose'; me.x = B.pos.x; me.z = B.pos.z + 1.5; me.face = Math.PI; __pad.axes[1] = -0.5; let got = false; for (let f = 0; f < 120 && !got; f++) { window.__tick(1); const dx = B.pos.x - me.x, dz = B.pos.z - me.z, l = Math.hypot(dx, dz) || 1; __pad.axes[0] = dx / l; __pad.axes[1] = dz / l; got = B.holder === me; } __pad.axes[0] = __pad.axes[1] = 0;
  return { st: st.join(' '), live, got }; });
ok(r.live && r.got, `the lot: after the shot the ball is ${r.st.split(' ').pop()} (${r.st}) and you go get it: ${r.got ? 'got it' : 'never got there'}`);
const q = await ctx.newPage(); await q.setViewportSize({ width: 4 * 240, height: 2 * 320 }); await q.setContent('<body style="margin:0;background:#111;display:flex;flex-wrap:wrap">' + shots.map(s => `<img style="width:240px;height:320px" src="data:image/png;base64,${s}">`).join('') + '</body>'); await q.screenshot({ path: path.join(dir, 'shots', 'crossgrab.png') });
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close(); process.exit(fails ? 1 : 0);
