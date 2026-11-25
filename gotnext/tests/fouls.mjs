// Fouls, out of bounds, line awareness and the guard pointer. node tests/fouls.mjs → tests/shots/pointer.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 900, height: 520 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
await p.evaluate(() => { const P = __pit; P.uiClose(); P.launchGame(P.MODES[0], P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(200); });
const reset = `var P = __pit, M = P.MT, me = M.me, opp = M.P.filter(q => q.team !== me.team), h = opp[0]; M.phase = 'live'; M.needClear = false; M.clock = 14;
  for (const q of M.P) { q.st = 'free'; q.y = 0; q.vx = q.vz = 0; q.cool = 0; q.reach = []; if (q.ai) q.ai.tick = 999; }
  h.x = 0; h.z = 6; h.face = Math.PI; M.B.state = 'held'; M.B.holder = h; M.off = h.team; me.x = 0; me.z = 5; me.face = 0; opp[1].x = 5; opp[1].z = 3; var mate = M.P.find(q => q.team === me.team && q !== me); mate.x = 5; mate.z = 2;`;
// 1. spamming steal: four presses a second at the handler — reach-ins and hand checks get called
let r = await p.evaluate(reset => { let fouls = 0, steals = 0, n = 0; for (let k = 0; k < 60; k++) { eval(reset); const f0 = me.stats.fouls, s0 = me.stats.stl;
    for (let i = 0; i < 8; i++) { P.startSteal(me); window.__tick(15); n++; if (M.phase !== 'live' || M.B.holder !== h) break; } if (me.stats.fouls > f0) fouls++; if (me.stats.stl > s0) steals++; }
  return { fouls, steals, n }; }, reset);
ok(r.fouls >= 12 && r.steals >= 3, `spamming steal (60 possessions, ${r.n} presses): ${r.fouls} ended in a foul, ${r.steals} in a steal`);
// 2. one timed reach in front: fouls are rare
r = await p.evaluate(reset => { let fouls = 0; for (let k = 0; k < 80; k++) { eval(reset); const f0 = me.stats.fouls; me.st = 'steal'; me.t = 0; me.stealDone = false; me.reach = [M.time]; P.resolveSteal(me); if (me.stats.fouls > f0) fouls++; } return fouls; }, reset);
ok(r <= 14, `a single clean reach (80 tries): ${r} fouls`);
// 3. a foul gives the ball back to the offense
r = await p.evaluate(reset => { eval(reset); const team = h.team; let tries = 0; while (M.phase === 'live' && tries++ < 200) { me.cool = 0.5; me.reach = [M.time, M.time, M.time, M.time, M.time]; P.startSteal(me); } window.__tick(150); return { off: M.off === team, holderTeam: M.B.holder && M.B.holder.team === team, phase: M.phase }; }, reset);
ok(r.off && r.holderTeam, `after a foul the fouled team checks it (offense ${r.off}, ball ${r.holderTeam}, phase ${r.phase})`);
// 4. out of bounds: the handler driven over the sideline turns it over
r = await p.evaluate(reset => { eval(reset); h.user = true; h.ctrl = 5; while (P.IN.length < 6) P.IN.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null });
  h.x = 7.4; h.z = 6; me.x = 3; let i = 0; for (; i < 120 && M.phase === 'live'; i++) { P.IN[5].mx = 1; P.IN[5].my = 0; P.IN[5].sprint = true; window.__tick(1); } const maxX = h.x; P.IN[5].mx = 0; P.IN[5].sprint = false; window.__tick(160); h.user = false; h.ctrl = undefined;
  return { called: i < 120, maxX: +maxX.toFixed(2), off: M.off, me: me.team }; }, reset);
ok(r.called && r.off === r.me, `sprinting straight out of bounds is called (handler reached x=${r.maxX}); ball goes the other way`);
// 5. line awareness: a handler drifting toward the line without meaning to (stick angled, no sprint) stays in
r = await p.evaluate(reset => { eval(reset); h.user = true; h.ctrl = 5; h.x = 6.6; h.z = 4; me.x = -3; let i = 0, maxX = 0;
  for (; i < 150 && M.phase === 'live'; i++) { P.IN[5].mx = 0.6; P.IN[5].my = 0.8; P.IN[5].sprint = false; window.__tick(1); maxX = Math.max(maxX, h.x); } P.IN[5].mx = P.IN[5].my = 0; window.__tick(5); h.user = false; h.ctrl = undefined;
  return { stayed: i >= 150, maxX: +maxX.toFixed(2) }; }, reset);
ok(r.stayed && r.maxX < 8, `drifting along the sideline for 2.5 s stays in bounds (closest x=${r.maxX}, line at 8)`);
// 6. the pointer: on defense, the arrow on your ring aims at your man
r = await p.evaluate(reset => { eval(reset); me.x = 2; me.z = 3; opp[1].x = 5; opp[1].z = 3; me.man = opp[1]; me.guard = opp[1]; window.__tick(4); const v = me.ptr && me.ptr.visible;
  const w = new (me.ptr.children[0].position.constructor)(); me.ptr.children[0].getWorldPosition(w); const d = (wx, wz) => Math.hypot(wx - me.x, wz - me.z);
  const dir = Math.atan2(w.x - me.x, w.z - me.z), want = Math.atan2(me.guard.x - me.x, me.guard.z - me.z); return { v, err: +Math.abs(Math.atan2(Math.sin(dir - want), Math.cos(dir - want))).toFixed(2), r: +d(w.x, w.z).toFixed(2) }; }, reset);
await p.screenshot({ path: path.join(dir, 'shots', 'pointer.png'), timeout: 120000 });
ok(r.v && r.err < 0.15, `pointer shows on defense and aims at your man (off by ${r.err} rad, ${r.r} m from you)`);
r = await p.evaluate(reset => { eval(reset); M.B.holder = me; M.off = me.team; window.__tick(3); return me.ptr.visible; }, reset); ok(!r, 'pointer hides on offense');
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close();
