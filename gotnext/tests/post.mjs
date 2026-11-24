// LT: post up on offense (back to the basket, back-down by strength, post moves), body up on defense; the ring arrow on your matchup. node tests/post.mjs
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
await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); window.__usePad = true; });
const set = `var P = __pit, M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), d = opp[0]; M.phase = 'live'; M.needClear = false; M.clock = 20; for (const q of M.P) { q.st = 'free'; q.y = 0; q.cool = 0; q.vx = q.vz = 0; if (q.ai) q.ai.tick = 999; q.x = 7; q.z = 12; } __pad.axes = [0, 0, 0, 0]; for (const bt of __pad.buttons) bt.pressed = false;`;
// 1. post up: LT with the ball turns your back to the rim; backing down moves a weaker defender more than a stronger one
const backdown = (myStr, dStr) => p.evaluate(([s, a, b]) => { eval(s); for (const k in me.A) me.A[k] = 70; me.A.str = a; d.A.str = b; d.ai.tick = 0; d.aiLvl = 1;
  me.x = 0; me.z = 5.2; d.x = 0; d.z = 4.3; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; M.off = me.team; window.__tick(3);
  __pad.buttons[6].pressed = true; window.__tick(20); const facing = Math.abs(Math.atan2(Math.sin(me.face - Math.atan2(me.x, me.z)), Math.cos(me.face - Math.atan2(me.x, me.z)))); const z0 = me.z, dz0 = d.z;
  __pad.axes = [0, -0.9, 0, 0]; window.__tick(120); const r = { post: me.post, an: me.an, facingAway: +facing.toFixed(2), moved: +(z0 - me.z).toFixed(2), dMoved: +(dz0 - d.z).toFixed(2), still: M.B.holder === me };
  __pad.axes = [0, 0, 0, 0]; __pad.buttons[6].pressed = false; window.__tick(5); return r; }, [set, myStr, dStr]);
const strong = await backdown(95, 40), weak = await backdown(40, 95);
ok(strong.post && strong.facingAway < 0.4, `LT with the ball: POST UP, back to the rim (facing ${strong.facingAway} rad off directly away)`);
ok(strong.dMoved > weak.dMoved + 0.3 && strong.moved > 0.4, `backing down 2 s: 95 strength vs 40 moves the defender ${strong.dMoved} m (gains ${strong.moved} m); 40 vs 95 moves him ${weak.dMoved} m (gains ${weak.moved} m)`);
await p.evaluate(s => { eval(s); me.x = 0; me.z = 4.6; d.x = 0.1; d.z = 3.8; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; M.off = me.team; __pad.buttons[6].pressed = true; window.__tick(30); }, set);
await p.screenshot({ path: path.join(dir, 'shots', 'post-up.png') });
// 2. post moves: shoot = turnaround fadeaway, flick toward the rim = hook, flick to a side = drop step
const move = (what) => p.evaluate(([s, what]) => { eval(s); me.x = 0.4; me.z = 3.4; d.x = 0.3; d.z = 2.6; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; M.off = me.team; __pad.buttons[6].pressed = true; window.__tick(20);
  if (what === 'shoot') { __pad.buttons[2].pressed = true; window.__tick(3); } else { __pad.axes[2] = what === 'up' ? 0 : 1; __pad.axes[3] = what === 'up' ? -1 : 0; window.__tick(3); }
  const r = { st: me.st, fade: me.shot && me.shot.fade, floater: me.shot && me.shot.floater, finish: me.finish && me.finish.kind }; __pad.axes = [0, 0, 0, 0]; for (const bt of __pad.buttons) bt.pressed = false; window.__tick(150); return r; }, [set, what]);
const m1 = await move('shoot'), m2 = await move('up'), m3 = await move('side');
ok(m1.st === 'shoot' && m1.fade, `post + shoot: turnaround fadeaway (${m1.st}, fade ${m1.fade})`);
ok(m2.st === 'shoot' && m2.floater, `post + stick toward the rim: hook (${m2.st})`);
ok(m3.st === 'finish', `post + stick to the side: drop step into a power finish (${m3.st})`);
// 3. body up: LT on defense plays tighter on the ball and slows his drive
const drive = (lt) => p.evaluate(([s, lt]) => { eval(s); P.S.set.dassist = 1; const h = d; h.user = true; h.ctrl = 5; while (P.IN.length < 6) P.IN.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null });
  h.x = 0; h.z = 7; me.x = 0; me.z = 6.1; M.B.state = 'held'; M.B.holder = h; h.live = 'drib'; M.off = h.team; me.man = h; __pad.buttons[6].pressed = lt; window.__tick(30);
  let gap = 0, n = 0; const z0 = h.z; for (let i = 0; i < 60; i++) { P.IN[5].mx = 0; P.IN[5].my = -0.8; window.__tick(1); gap += Math.hypot(me.x - h.x, me.z - h.z); n++; }
  const r = { bodyUp: me.bodyUp, an: me.an, gap: +(gap / n).toFixed(2), gained: +(z0 - h.z).toFixed(2) }; P.IN[5].my = 0; __pad.buttons[6].pressed = false; h.user = false; h.ctrl = undefined; window.__tick(5); return r; }, [set, lt]);
const off = await drive(false), on = await drive(true);
ok(on.bodyUp && on.gap < off.gap - 0.1 && on.gained < off.gained, `ball handler driving 1 s: body up keeps ${on.gap} m away and he gains ${on.gained} m; without it ${off.gap} m and ${off.gained} m`);
await p.evaluate(s => { eval(s); const h = d; h.x = 0.6; h.z = 6.8; me.x = 0.6; me.z = 6.0; me.face = 0; M.B.state = 'held'; M.B.holder = h; h.live = 'drib'; M.off = h.team; __pad.buttons[6].pressed = true; window.__tick(30); }, set);
await p.screenshot({ path: path.join(dir, 'shots', 'body-up.png') }); await p.evaluate(() => { __pad.buttons[6].pressed = false; window.__tick(3); });
// 4. the ring arrow points at your matchup from the opening check, even when you are standing next to someone else
const r4 = await p.evaluate(s => { eval(s); const mine = me.man, other = opp.find(q => q !== mine); mine.x = 5; mine.z = 4; other.x = me.x = 0; other.z = 6.5; me.z = 5.6; M.B.state = 'held'; M.B.holder = other; M.off = other.team; window.__tick(6);
  const w = me.ptr.children[0].getWorldPosition(new (me.ptr.children[0].position.constructor)()), dir = Math.atan2(w.x - me.x, w.z - me.z), want = Math.atan2(mine.x - me.x, mine.z - me.z); return { err: +Math.abs(Math.atan2(Math.sin(dir - want), Math.cos(dir - want))).toFixed(2), v: me.ptr.visible }; }, set);
ok(r4.v && r4.err < 0.2, `standing next to someone else, the arrow still points at your matchup (off by ${r4.err} rad)`);
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
