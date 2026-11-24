// Defending: who you face. node tests/defend.mjs → also writes tests/shots/defend.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 900, height: 520 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + path.resolve(dir, '..', 'index.html')); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
const setup = (meX, meZ) => p.evaluate(([meX, meZ]) => { const P = __pit; if (!P.MT) { P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); }
  const M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), mate = M.P.find(q => q.team === me.team && q !== me); M.phase = 'live'; M.needClear = false; M.clock = 14;
  const h = opp[0], off = opp[1]; h.x = -3; h.z = 7; off.x = 4; off.z = 4; M.B.state = 'held'; M.B.holder = h; M.off = h.team; for (const q of opp) { q.st = 'free'; q.ai.tick = 999; q.aiLvl = 0; q.vx = q.vz = 0; q.in = { dx: 0, dz: 0 }; q.user = true; q.ctrl = 5; }
  while (P.IN.length < 6) P.IN.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null });
  P.S.set.dassist = 0; mate.x = -3; mate.z = 5.6; mate.ai.tick = 999; me.x = meX; me.z = meZ; me.vx = me.vz = 0; for (const k in P.keys) P.keys[k] = false; window.__tick(50);
  const ang = (a, b) => Math.atan2(b.x - a.x, b.z - a.z), d = (x, y) => Math.abs(Math.atan2(Math.sin(x - y), Math.cos(x - y)));
  P.S.set.dassist = 1; return { toMan: +d(me.face, ang(me, off)).toFixed(2), toBall: +d(me.face, ang(me, h)).toFixed(2), guard: me.guard && me.guard.b.name, man: off.b.name, holder: h.b.name, dMan: +Math.hypot(me.x - off.x, me.z - off.z).toFixed(1) }; }, [meX, meZ]);
let r = await setup(4, 2.9); ok(r.guard === r.man && r.toMan < 0.2 && r.toBall > 0.6, `tight on my man off the ball (${r.dMan} m): body faces him (off by ${r.toMan} rad), not the ball (${r.toBall} rad away)`);
await p.screenshot({ path: path.join(dir, 'shots', 'defend.png'), timeout: 120000 });
r = await setup(2.6, 2.6); ok(r.toMan > 0.1 && r.toBall > 0.1 && r.toMan < r.toBall + 0.9, `sagging off (${r.dMan} m): opened up between man (${r.toMan}) and ball (${r.toBall})`);
r = await setup(-3, 5.8); ok(r.guard === r.holder && r.toBall < 0.2, `on the ball handler: square to him (off by ${r.toBall} rad)`);
// --- defense controls ---
// 1. guard assist: the ball handler drives at the rim; stick released, the defender stays between him and the rim
const drive = assist => p.evaluate(assist => { const P = __pit, M = P.MT, me = M.me, h = M.B.holder; P.S.set.dassist = assist ? 1 : 0; me.x = h.x + 0.2; me.z = h.z - 1.1; me.vx = me.vz = 0; window.__tick(5);
  let between = 0, n = 0, gap = 0; for (let i = 0; i < 70; i++) { P.IN[5].mx = 0.35; P.IN[5].my = -0.9; window.__tick(1); const hh = Math.hypot(h.x, h.z), mh = Math.hypot(me.x, me.z); if (mh < hh) between++; gap += Math.hypot(me.x - h.x, me.z - h.z); n++; } P.IN[5].mx = P.IN[5].my = 0; P.S.set.dassist = 1; return { between: Math.round(between / n * 100), gap: +(gap / n).toFixed(2) }; }, assist);
await setup(0, 0); let on = await drive(true); await setup(0, 0); let offA = await drive(false);
ok(on.between >= 90 && on.gap < 1.8, `defense assist on, ball handler driving: goal-side ${on.between}% of the time, ${on.gap} m away on average (assist off: goal-side ${offA.between}%, ${offA.gap} m)`);
// 2. timed contest: jumping with the release counts more than jumping early
r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, h = M.B.holder; me.x = h.x; me.z = h.z - 1.2; me.st = 'free'; me.y = 0; h.st = 'free'; window.__tick(2); const out = {};
  for (const [k, t] of [['none', -1], ['early', 0.55], ['timed', 0.25]]) { me.st = 'free'; me.y = 0; me.handsUp = false; if (t >= 0) { me.st = 'jump'; me.t = t; me.jumpH = 0.6; } out[k] = +P.contestOn(h).toFixed(3); } me.st = 'free'; return out; });
ok(r.timed > r.early && r.timed > r.none, `contest at 1.2 m: timed jump ${r.timed}, early jump ${r.early}, no jump ${r.none}`);
// 3. closeout: jumping at a shooter 2.5 m away moves you at him
r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, h = M.B.holder; me.x = h.x + 2.5; me.z = h.z; me.st = 'free'; me.y = 0; h.st = 'free'; P.startShot(h, 'ai'); const d0 = Math.hypot(me.x - h.x, me.z - h.z); P.startJump(me); window.__tick(18); const d1 = Math.hypot(me.x - h.x, me.z - h.z); h.st = 'free'; window.__tick(40); return { d0: +d0.toFixed(2), d1: +d1.toFixed(2) }; });
ok(r.d1 < r.d0 - 0.6 && r.d1 > 0.5, `closeout: jumping at a shooter ${r.d0} m away ends ${r.d1} m from him`);
// 4. steals go for the ball: in front and close is far better than tucked on his far side
r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, h = M.B.holder; h.st = 'free'; h.protect = false; me.x = h.x; me.z = h.z - 1.0; me.face = 0; h.face = Math.PI;
  M.B.pos.set(h.x, 0.5, h.z - 0.35); const front = P.stealChance(me, h).ch; M.B.pos.set(h.x, 0.9, h.z + 0.45); const far = P.stealChance(me, h).ch; return { front: +front.toFixed(3), far: +far.toFixed(3) }; });
ok(r.front > r.far * 3, `steal chance with the ball low in front of you ${r.front}, tucked on his far side ${r.far}`);
// 5. jumping the passing lane intercepts more than standing there
const lane = press => p.evaluate(press => { const P = __pit, M = P.MT, me = M.me, h = M.opp ? 0 : M.P.filter(q => q.team !== me.team), a = h[0], b2 = h[1]; let got = 0; Math.random = (r => () => r())(Math.random);
  for (let k = 0; k < 40; k++) { M.phase = 'live'; a.st = b2.st = 'free'; a.x = -4; a.z = 6; b2.x = 4; b2.z = 6; me.x = 0.3; me.z = 4.6; me.st = 'free'; me.cool = 0; me.vx = me.vz = 0; M.B.state = 'held'; M.B.holder = a; M.off = a.team; a.drib = null; window.__tick(2);
    P.doPass(a, b2); if (press) { window.__tick(2); P.startSteal(me); } for (let i = 0; i < 40 && M.B.state === 'pass'; i++) window.__tick(1); if (M.B.holder === me) got++; window.__tick(10); }
  return got; }, press);
const l0 = await lane(false), l1 = await lane(true);
ok(l1 > l0 + 4, `passes thrown past you (40 each): intercepted ${l1} jumping the lane, ${l0} standing still`);
const tags = await p.evaluate(() => __pit.MT.P.map(q => q.tag && q.tag.isSprite ? 1 : 0)); ok(tags.every(n => n >= 1), 'every player has a name tag (under them): ' + tags.join(','));
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
