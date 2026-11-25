// Post moves by stick direction, the dribble hand, and the RUCKUS slugfest. node tests/slug.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } };
  window.__pad = { connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false })) }; window.__usePad = false;
  navigator.getGamepads = () => window.__usePad ? [window.__pad] : [];
  window.__press = (n, hold) => { window.__pad.buttons[n].pressed = true; window.__tick(hold || 2); window.__pad.buttons[n].pressed = false; window.__tick(2); }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const launch = mi => p.evaluate(mi => { const P = __pit; if (P.MT) P.MT.cfg.onEnd = () => {}; P.uiClose(); window.__usePad = false; P.launchGame(P.MODES[mi], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(220); window.__usePad = true; }, mi);
const set = `var P = __pit, M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), d = opp[0]; M.phase = 'live'; M.needClear = false; M.clock = 20; M.brawl = null; for (const q of M.P) { q.st = 'free'; q.y = 0; q.cool = 0; q.vx = q.vz = 0; q.ko = 0; if (q.ai) q.ai.tick = 999; q.x = 7; q.z = 12; } __pad.axes = [0, 0, 0, 0]; for (const bt of __pad.buttons) bt.pressed = false;`;
await launch(0);
// 1. post moves: hold LT, push the stick, press X
const post = (ax, az) => p.evaluate(([s, ax, az]) => { eval(s); for (const q of opp) q.cool = 9; me.x = 0.3; me.z = 3.2; d.x = 0.25; d.z = 2.4; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; M.off = me.team; __pad.buttons[6].pressed = true; window.__tick(25);
  __pad.axes = [ax, az, 0, 0]; window.__tick(2); __pad.buttons[2].pressed = true; window.__tick(3); const r = { st: me.st, fade: me.shot && me.shot.fade, floater: me.shot && me.shot.floater, kind: me.finish && me.finish.kind };
  __pad.axes = [0, 0, 0, 0]; for (const bt of __pad.buttons) bt.pressed = false; window.__tick(150); return r; }, [set, ax, az]);
const away = await post(0, 1), toward = await post(0, -1), across = await post(1, 0), still = await post(0, 0);
ok(away.st === 'shoot' && away.fade, `LT + stick away from the rim + X: post fadeaway (${away.st}, fade ${away.fade})`);
ok(toward.st === 'finish', `LT + stick toward the rim + X, close in: drop step power move (${toward.st})`);
ok(across.st === 'shoot' && across.floater, `LT + stick across + X: jump hook (${across.st})`);
ok(still.st === 'shoot' && !still.fade && !still.floater, `LT + X with the stick still: turnaround jumper (${still.st}, fade ${still.fade})`);
// 2. the dribble hand: the side you are going; away from a defender up close
const hand = (ax, defSide) => p.evaluate(([s, ax, ds]) => { eval(s); window.__usePad = true; me.x = 0; me.z = 7; me.face = Math.PI; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; me.hand = ax < 0 ? 'R' : 'L'; M.off = me.team; me.drib = null; for (const q of opp) { q.in = { dx: 0, dz: 0 }; q.x = 7.5; q.z = 12.5; q.user = true; q.ctrl = 7; } while (P.IN.length < 8) P.IN.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null });
  if (ds) { d.x = me.x + ds * 0.9; d.z = me.z - 0.6; d.ai.tick = 999; } window.__tick(5); __pad.axes = [ax, 0, 0, 0]; window.__tick(90); const h = me.drib && me.drib.hand; __pad.axes = [0, 0, 0, 0]; for (const q of opp) { q.user = false; q.ctrl = undefined; } window.__tick(5); return h; }, [set, ax, defSide]);
const goL = await hand(-0.7, 0), goR = await hand(0.7, 0), defL = await hand(0, -1), defR = await hand(0, 1);
ok(goL === 'L' && goR === 'R', `dribbling left the ball goes to the left hand (${goL}), right to the right (${goR})`);
ok(defL === 'R' && defR === 'L', `defender up close on the left: right hand (${defL}); on the right: left hand (${defR})`);
// 3. street: LT + A off the ball is still a call for the ball, not a punch
let r = await p.evaluate(s => { eval(s); me.x = 2; me.z = 6; d.x = 2; d.z = 5.3; M.B.state = 'held'; M.B.holder = M.P.find(q => q.team === me.team && q !== me); M.off = me.team; __pad.buttons[6].pressed = true; window.__tick(2); __pad.buttons[0].pressed = true; window.__tick(2); const st = me.st; for (const bt of __pad.buttons) bt.pressed = false; window.__tick(10); return st; }, set);
ok(r !== 'punch' && r !== 'clothes', `street game, LT + A off the ball: no punches (${r})`);
// 4. RUCKUS: haymaker, clothesline, and a knockout that gets called
await launch(2);
r = await p.evaluate(s => { eval(s); const h = d; h.x = 0; h.z = 6; me.x = 0; me.z = 5.1; me.face = 0; M.B.state = 'held'; M.B.holder = h; M.off = h.team; h.live = 'drib'; window.__tick(2);
  const R = Math.random; Math.random = () => 0.5; __pad.buttons[6].pressed = true; window.__tick(2); __pad.buttons[2].pressed = true; window.__tick(2); const st = me.st; __pad.buttons[2].pressed = false; window.__tick(20); Math.random = R; for (const bt of __pad.buttons) bt.pressed = false;
  const out = { st, hit: h.st, fall: h.stg && h.stg.fall, ball: M.B.state }; window.__tick(120); return out; }, set);
ok(r.st === 'punch' && r.hit === 'stagger' && r.fall, `RUCKUS, LT + X at the ball handler: haymaker (${r.st}), he goes down (${r.hit}), ball ${r.ball}`);
r = await p.evaluate(s => { eval(s); const a = opp[0], c = opp[1]; a.x = -0.3; a.z = 4; c.x = 0.3; c.z = 3.2; me.x = 0; me.z = 7.5; M.B.state = 'held'; M.B.holder = M.P.find(q => q.team === me.team && q !== me); M.B.holder.x = 6; M.off = me.team; window.__tick(2);
  __pad.axes = [0, -1, 0, 0]; __pad.buttons[7].pressed = true; window.__tick(24); __pad.buttons[0].pressed = true; window.__tick(3); __pad.buttons[0].pressed = false; let st = me.st, downs = 0; for (let i = 0; i < 30; i++) { window.__tick(1); downs = Math.max(downs, [a, c].filter(q => q.st === 'stagger' && q.stg.fall).length); }
  __pad.axes = [0, 0, 0, 0]; for (const bt of __pad.buttons) bt.pressed = false; window.__tick(150); return { st, downs }; }, set);
ok(r.st === 'clothes' && r.downs >= 1, `RUCKUS, sprinting + A through two of them: clothesline (${r.st}), ${r.downs} down`);
r = await p.evaluate(s => { eval(s); const h = d; h.x = 0; h.z = 6; me.x = 0; me.z = 5.1; me.face = 0; M.B.state = 'held'; M.B.holder = h; M.off = h.team; h.live = 'drib'; window.__tick(2);
  const R = Math.random; Math.random = () => 0.01; __pad.buttons[6].pressed = true; window.__tick(2); __pad.buttons[2].pressed = true; window.__tick(25); Math.random = R; for (const bt of __pad.buttons) bt.pressed = false;
  const ko = h.ko > 0, calls = []; const hc = document.querySelector('#call'); for (let i = 0; i < 140; i++) { window.__tick(1); const t = hc && hc.firstElementChild.textContent; if (t && !calls.includes(t)) calls.push(t); }
  const phase = M.phase; window.__tick(220); return { ko, calls, phase, off: M.off, victimTeam: h.team, holderTeam: M.B.holder && M.B.holder.team }; }, set);
ok(r.ko && r.calls.includes('WE HAVE TO CALL THAT') && r.holderTeam === r.victimTeam, `a knockout stops the game: ${r.calls.join(' → ')}; the team that got hit has the ball after (${r.holderTeam === r.victimTeam})`);
await p.evaluate(s => { eval(s); const h = d; h.x = 0.4; h.z = 6; me.x = 0.4; me.z = 5.1; me.face = 0; M.B.state = 'held'; M.B.holder = h; M.off = h.team; h.live = 'drib'; window.__tick(2); const R = Math.random; Math.random = () => 0.01; __pad.buttons[6].pressed = true; window.__tick(2); __pad.buttons[2].pressed = true; window.__tick(10); Math.random = R; for (const bt of __pad.buttons) bt.pressed = false; window.__tick(40); }, set);
await p.screenshot({ path: path.join(dir, 'shots', 'jam-ko.png'), timeout: 120000 });
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
