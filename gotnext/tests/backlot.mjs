// The back lot: the street behind the tracks on the Block is a half court. Pick up a ball there with the pad and you
// are on it with the whole game's moveset (a crossover, a step-back jumper); Ⓐ puts it down and you are back on the
// Block where you stood. Sharpie's book keeps what you do (in games, and apart on the lot) and reads it back.
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
const hide = () => p.evaluate(() => document.querySelectorAll('.bubble,.bub,#emobar,#whud,#keys,#toasts,#goal,#padhint,#panel').forEach(e => e.style.visibility = 'hidden'));
// on the Block: walk to the back lot
let r = await p.evaluate(() => { const P = __pit; P.uiClose(); P.S.tut = 1; P.S.vip = null; P.enterWorld('hub', 0, 9, Math.PI); window.__tick(30); window.__usePad = true; const W = P.W; return { b: W.bounds[3], near: null }; });
ok(r.b > 18, `the Block reaches back to the wall now (z to ${r.b})`);
await hide(); await p.evaluate(() => __pit.ev(`(() => { camera.position.set(2, 6.5, 6.5); camera.lookAt(2, 0.6, 15.5); renderer.render(scene, camera); })()`)); await p.screenshot({ path: path.join(dir, 'shots', 'backlot-block.png') });
r = await p.evaluate(() => { const W = __pit.W; W.me.x = -3.6; W.me.z = 16.6; W.me.face = 0; window.__tick(6); const lab = document.getElementById('prompt').textContent; window.__press(0); window.__tick(20); const M = __pit.MT; return { lab, on: !!M, lot: !!(M && M.cfg.lot), court: M && M.cfg.court, held: !!(M && M.B.holder === M.me), x: M && +M.me.x.toFixed(2), z: M && +M.me.z.toFixed(2) }; });
ok(/BACK LOT/.test(r.lab) && r.on && r.lot && r.court === 'backlot' && r.held, `Ⓐ at the crate ("${r.lab}"): on the lot court with the ball`);
ok(Math.abs(r.x - (2 - -3.6)) < 0.9 && Math.abs(r.z - (17.6 - 16.6)) < 0.9, `you start where you stood (court ${r.x}, ${r.z})`);
// the whole moveset: a crossover with the right stick, a step-back, a jumper
r = await p.evaluate(() => { const M = __pit.MT, me = M.me; me.x = 0; me.z = 6.5; window.__tick(10); window.__pad.axes[2] = 1; window.__tick(2); window.__pad.axes[2] = 0; let seen = me.st === 'move' ? me.mv.mv.id : null; for (let i = 0; i < 30 && !seen; i++) { window.__tick(1); if (me.st === 'move') seen = me.mv.mv.id; } window.__tick(40); return seen; });
ok(!!r, `a move off the right stick: ${r}`);
r = await p.evaluate(() => { const M = __pit.MT, me = M.me; window.__tick(30); window.__pad.axes[2] = -0.75; window.__pad.axes[3] = 0.75; window.__tick(2); window.__pad.axes[2] = 0; window.__pad.axes[3] = 0; let mv = null; for (let i = 0; i < 20; i++) { window.__tick(1); if (me.st === 'move') mv = me.mv.mv.id; } window.__pad.buttons[2].pressed = true; window.__tick(2); const shot = me.st; window.__tick(30); window.__pad.buttons[2].pressed = false; window.__tick(80); return { mv, shot }; });
ok(r.shot === 'shoot', `a jumper with Ⓧ (${r.mv ? 'off a ' + r.mv : 'off the dribble'})`);
await hide(); await p.evaluate(() => { window.__tick(20); }); await p.screenshot({ path: path.join(dir, 'shots', 'backlot-court.png') });
// Ⓐ puts it down: back on the Block where you stood
r = await p.evaluate(() => { const M = __pit.MT; M.me.x = 3; M.me.z = 5; window.__tick(2); const at = [M.me.x, M.me.z]; window.__press(0); window.__tick(30); const W = __pit.W; return { mt: !!__pit.MT, w: W && W.kind, x: W && +W.me.x.toFixed(2), z: W && +W.me.z.toFixed(2), want: [2 - at[0], 17.6 - at[1]] }; });
ok(!r.mt && r.w === 'hub' && Math.abs(r.x - r.want[0]) < 0.3 && Math.abs(r.z - r.want[1]) < 0.3, `Ⓐ puts it down: on the Block at ${r.x}, ${r.z} (stood at ${r.want.map(v => v.toFixed(1))})`);
// the book: the lot is kept apart from games
r = await p.evaluate(() => { const V = __pit.S.vip; return { p: V && V.p.sh, mv: V && Object.keys(V.p.mv), g: V && V.g.sh }; });
ok(r.p && (r.p.mid + r.p.three + r.p.close) >= 1 && r.mv.length >= 1 && !(r.g.mid + r.g.three), `the book: lot shots ${JSON.stringify(r.p)}, moves ${r.mv.join(', ')}; games untouched`);
// a real game counts in the game book
r = await p.evaluate(() => { const P = __pit; window.__usePad = false; P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); const M = P.MT, me = M.me;
  for (let k = 0; k < 6; k++) { M.phase = 'live'; M.needClear = false; M.B.state = 'held'; M.B.holder = me; M.off = me.team; me.st = 'free'; me.live = 'drib'; me.x = (k - 2.5) * 1.6; me.z = 5.5; for (const q of M.P) if (q.team !== me.team) { q.x = 7; q.z = 12; } window.__tick(2); P.startShot(me, 'stick'); window.__tick(Math.round(me.shot.rel * 60)); P.call('releaseShot', me); window.__tick(120); }
  const V = P.S.vip; return V.g.sh; });
ok(r.mid + r.three >= 5, `six jumpers in a game go in the game book: ${JSON.stringify(r)}`);
r = await p.evaluate(() => { const P = __pit; if (P.MT) { P.MT.cfg.onEnd = () => {}; P.ev('quitMatch()'); } P.enterWorld('hub', 9, 13, 0); window.__tick(10); P.ev('uiVip()'); window.__tick(3); const t = document.getElementById('panel').textContent; const svg = !!document.querySelector('#panel svg'); P.uiClose(); return { t: t.slice(0, 400), svg }; });
ok(/SHARPIE'S BOOK/.test(r.t) && r.svg, `Sharpie reads it back with a shot chart: "${r.t.replace(/\s+/g, ' ').slice(0, 160)}"`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close(); process.exit(fails ? 1 : 0);
