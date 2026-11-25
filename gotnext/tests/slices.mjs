// Off-ball screens and cuts, runs and hot/cold streaks, dives and tip-outs, touch passes. node tests/slices.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1100, height: 620 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); });
await p.evaluate(() => { const P = __pit; window.T = { start(size) { P.uiClose(); if (P.MT) P.call('quitMatch'); window.__tick(3); P.launchGame(P.MODES.find(m => m.size === size && !m.arcade), P.TIERS_COURT[1], { mates: Array(size - 1).fill(-1), rival: -1, p2: 'off' }); window.__tick(200); const M = P.MT; var g = 0; while (M.phase !== 'live' && g++ < 600) window.__tick(1); return M; },
  set(h) { const M = P.MT; P.call('give', h); P.call('changePoss', h.team); M.needClear = false; M.phase = 'live'; M.clock = 20; for (const q of M.P) { q.ai.tick = 99; q.st = 'free'; q.y = 0; q.vx = q.vz = 0; q.slowT = 0; q.diveT = 0; if (q !== h) { q.x = 7.5; q.z = 11 + q.i * 0.4; } } h.live = 'drib'; } }; });
// ---- off the ball
let r = await p.evaluate(() => { const P = __pit, M = T.start(2), me = M.me, mate = M.P.find(q => q.team === me.team && q !== me), opp = M.P.filter(q => q.team !== me.team), d = opp[0], out = {};
  T.set(mate); mate.x = 0; mate.z = 8; me.x = 0.6; me.z = 6.6; d.x = 0; d.z = 6.9; d.man = mate; opp[1].man = me; P.keys.KeyQ = true; for (let i = 0; i < 4; i++) { M.clock = 20; mate.ai.tick = 99; window.__tick(1); } out.screen = me.screen; out.lt = '';
  d.scrHit = -9; d.x = me.x - 0.5; d.z = me.z; d.vx = 3; const res = P.call('screenHit', me, d); out.res = res; out.slow = d.slowT > 0 || d.st === 'stagger' || res === 'over';
  let used = 0; for (let i = 0; i < 60; i++) { T.set(mate); mate.x = 0; mate.z = 8; me.x = 0.6; me.z = 6.6; me.screen = true; mate.ai.tick = 0; mate.ai.usedScr = null; mate.ai.mode = ''; mate.ai.hold = 0; d.x = 0; d.z = 6.9; P.call('aiThink', mate, 0.016); if (mate.ai.mode === 'drive') used++; }
  out.used = used; P.keys.KeyQ = false;
  // a cut
  let lost = 0, moved = 0; for (let i = 0; i < 100; i++) { T.set(mate); mate.x = 0; mate.z = 8; me.x = 4; me.z = 5; me.cutAt = -9; me.stam = 100; opp[1].man = me; opp[1].x = 4; opp[1].z = 4; opp[1].slowT = 0; const I = P.IN[0]; I.mx = -1; I.my = 0; I.flick = 'L'; const v0 = me.vx; P.call('humanThink', me, 0.016); if (me.vx < v0 - 4) moved++; if (opp[1].slowT > 0.2) lost++; I.flick = null; }
  out.lost = lost; out.moved = moved; return out; });
ok(r.screen && r.slow && r.used > 25, `off the ball, LT with your feet still sets a screen (${r.res}); your AI handler comes off it ${r.used}/60 looks`);
ok(r.moved === 100 && r.lost > 10 && r.lost < 80, `a cut: flick the stick for a burst (${r.moved}/100); your man loses you ${r.lost}/100 times`);
// ---- runs, hot and cold
r = await p.evaluate(() => { const P = __pit, M = T.start(2), me = M.me, o = M.P.find(q => q.team !== me.team), out = {}; const calls = []; const el = document.getElementById('call'); const tick = n => { for (let i = 0; i < n; i++) { window.__tick(1); const t = el.textContent; if (t && calls[calls.length - 1] !== t) calls.push(t); } };
  M.score = [0, 0]; for (let k = 0; k < 3; k++) { M.phase = 'live'; P.call('scorePts', me, 1, 'jumper'); M.phase = 'live'; tick(110); } out.run = M.runS.n; out.hot = me.hot; out.calls1 = calls.slice();
  const win = (pl) => { let g = 0; for (let i = 0; i < 400; i++) { T.set(pl); pl.x = 0; pl.z = 5; M.gamePt = false; P.call('startShot', pl, 'btn'); const s = pl.shot; pl.t = s.rel * (1 + (i / 400 - 0.5) * 0.36); s.hold = pl.t; P.call('releaseShot', pl); if (M.B.green) g++; } return g; };
  out.gHot = win(me); me.hot = 0; me.cold = 0; M.runS.n = 0; out.gFlat = win(me); me.cold = 3; out.gCold = win(me); me.cold = 0;
  M.phase = 'live'; M.runS = { team: me.team, n: 3, pts: 3 }; P.call('scorePts', o, 1, 'jumper'); tick(130); out.calls2 = calls.slice(out.calls1.length); out.after = [M.runS.team === o.team, M.runS.n];
  for (let k = 0; k < 3; k++) P.call('missed', o); out.cold = o.cold; return out; });
ok(r.run === 3 && /ON A RUN/.test(r.calls1.join('|')) && /RUN OVER/.test(r.calls2.join('|')) && r.after[1] === 1, `three unanswered buckets is ON A RUN; the other team scoring ends it (RUN OVER)`);
ok(r.gHot > r.gCold + 6 && r.cold === 3, `streaks move the release window: ${r.gHot} greens in 400 when heating up and on a run, ${r.gFlat} flat, ${r.gCold} ice cold`);
// ---- loose balls
r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, o = M.P.find(q => q.team !== me.team), out = {}; let dive = 0, plain = 0;
  me.A.speed = 55; me.A.accel = 55; o.A.speed = 85; o.A.accel = 85; const loose = () => { T.set(me); const B = M.B; B.state = 'loose'; B.holder = null; B.rebound = false; B.pos.set(0, 0.3, 6); B.vel.set(0, 0, 0); B.t = 0.3; M.looseT = 0; me.x = -2.4; me.z = 6; o.x = 3.0; o.z = 6; o.vx = -4; me.diveAt = -9; P.keys.KeyD = true; };
  for (let i = 0; i < 60; i++) { loose(); P.keys.KeyE = true; window.__tick(1); P.keys.KeyE = false; let g = 0; while (M.B.state === 'loose' && g++ < 40) { o.ai.tick = 99; o.in.dx = -1; o.in.dz = 0; window.__tick(1); } if (M.B.holder === me) dive++; }
  for (let i = 0; i < 60; i++) { loose(); let g = 0; while (M.B.state === 'loose' && g++ < 40) { o.ai.tick = 99; o.in.dx = -1; o.in.dz = 0; window.__tick(1); } if (M.B.holder === me) plain++; }
  P.keys.KeyD = false; out.dive = dive; out.plain = plain;
  // tip-outs
  let tips = 0, toMate = 0; const mate = M.P.find(q => q.team === me.team && q !== me); for (let i = 0; i < 200; i++) { T.set(me); const B = M.B; B.state = 'loose'; B.holder = null; B.rebound = true; B.tipped = false; B.pos.set(0, 2.6, 1.6); B.vel.set(0, 0, 0); B.t = 0.3; M.looseT = 0; me.x = 0; me.z = 1.6; me.st = 'jump'; me.t = 0.2; me.y = 0.7; o.x = 0.5; o.z = 1.9; mate.x = 3; mate.z = 5; const v = P.call('stepBall', 0.016); if (B.tipped) { tips++; if (B.vel.x > 0 && B.vel.z > 0) toMate++; } me.st = 'free'; me.y = 0; void v; }
  out.tips = tips; out.toMate = toMate; return out; });
ok(r.dive > r.plain + 15, `a loose ball 2.4 m away with a man coming for it: you get it ${r.dive}/60 times with a dive (pass/steal button), ${r.plain}/60 without`);
ok(r.tips > 25 && r.tips < 110 && r.toMate === r.tips, `a rebound in a crowd is tipped out ${r.tips}/200 times, toward your teammate every time`);
// ---- touch passes
r = await p.evaluate(() => { const P = __pit, M = T.start(3), me = M.me, mates = M.P.filter(q => q.team === me.team && q !== me), a = mates[0], c = mates[1], out = {};
  T.set(a); a.x = -4; a.z = 7; me.x = 0; me.z = 7; c.x = 4.5; c.z = 6; P.call('doPass', a, me); const I = P.IN[0]; P.keys.KeyD = true; window.__tick(1); P.keys.KeyE = true; window.__tick(1); P.keys.KeyE = false; P.keys.KeyD = false; out.set = me.touchTo === c; let g = 0, held = 0; while (g++ < 90 && !(M.B.state === 'held' && M.B.holder === c)) { for (const q of M.P) q.ai.tick = 99; M.clock = 20; if (M.B.holder === me) held++; window.__tick(1); } I.mx = 0;
  out.got = M.B.holder === c; out.held = held; out.touchT = c.touchT > 0;
  let extra = 0; const opp = M.P.filter(q => q.team !== me.team); for (let i = 0; i < 200; i++) { T.set(me); me.x = -4; me.z = 7; a.x = 0; a.z = 7; a.aiLvl = 0.9; c.x = 4.5; c.z = 6; opp[0].x = 0.4; opp[0].z = 6.2; P.call('doPass', me, a); const B = M.B; B.pos.set(a.x - 0.2, 1.2, a.z); P.call('stepBall', 0.016); if (B.state === 'pass' && B.target !== a) extra++; }
  out.extra = extra; return out; });
ok(r.set && r.got && r.held <= 2 && r.touchT, `touch pass: press pass with the ball on its way and it goes straight on to the man your stick points at (in your hands ${r.held} frames)`);
ok(r.extra > 30 && r.extra < 180, `an AI catching it with a defender on him and a teammate open makes the extra pass ${r.extra}/200 times`);
// ---- dribble combos and reads
r = await p.evaluate(() => { const P = __pit, M = T.start(2), me = M.me, d = M.P.find(q => q.team !== me.team), out = {}; me.A.handle = 80; d.A.perd = 75;
  const run = (seq) => { let ank = 0, read = 0; for (let i = 0; i < 300; i++) { T.set(me); me.x = 0; me.z = 7; d.x = 0; d.z = 5.9; me.mvHist = []; me.combo = 0; me.comboT = -9; me.stam = 100; for (const [slot, dx, dz] of seq) { me.st = 'free'; me.moveCool = 0; d.st = 'free'; d.slowT = 0; me.slowT = 0; M.hl = null; M.hlAt = -99; P.call('startMove', me, slot, dx, dz); if (d.st === 'stagger') { ank++; break; } if (me.slowT > 0.1) read++; } M.slow = 0; } return [ank, read]; };
  out.same = run([['side', 1, -0.15], ['side', 1, -0.15], ['side', 1, -0.15], ['side', 1, -0.15]]); out.mix = run([['side', 1, -0.15], ['back', -0.55, 1], ['side', -1, -0.15], ['diag', 0.8, -0.8]]); return out; });
ok(r.mix[0] > r.same[0] && r.same[1] > 40 && r.mix[1] === 0, `four moves in a row: mixed up they break ankles ${r.mix[0]}/300 times, the same one four times ${r.same[0]}/300 and it gets READ ${r.same[1]} times`);
// ---- scouting
r = await p.evaluate(() => { const P = __pit, M = P.MT, me = M.me, d = M.P.find(q => q.team !== me.team && q.man === me) || M.P.find(q => q.team !== me.team); d.man = me; d.aiLvl = 0.8; const gapAt = (tend) => { T.set(me); me.tend = tend; me.x = 0; me.z = 8.5; d.x = 0; d.z = 4; d.ai.mx = me.x; d.ai.mz = me.z; d.ai.scout = ''; for (let i = 0; i < 4; i++) P.call('aiThink', d, 0.2); return Math.hypot(d.ai.tx - me.x, d.ai.tz - me.z); };
  return { none: gapAt(null), shooter: gapAt({ three: 5, mid: 1, close: 0, drive: 0 }), driver: gapAt({ three: 0, mid: 0, close: 2, drive: 5 }) }; });
ok(r.shooter < r.none - 0.15 && r.driver > r.none + 0.15, `scouting: the on-ball gap is ${r.none.toFixed(2)} m to start, ${r.shooter.toFixed(2)} m against a man who keeps shooting, ${r.driver.toFixed(2)} m against one who keeps driving`);
// ---- buzzer beaters, stops, tie-ups, hustle stats
r = await p.evaluate(() => { const P = __pit, M = T.start(2), me = M.me, o = M.P.find(q => q.team !== me.team), out = {}; const calls = []; const el = document.getElementById('call'); const tick = n => { for (let i = 0; i < n; i++) { window.__tick(1); const t = el.textContent; if (t && calls[calls.length - 1] !== t) calls.push(t); } };
  T.set(me); M.hl = null; M.hlAt = -99; M.B.shooter = me; M.B.clockAt = 0.8; P.call('scorePts', me, 1, 'jumper'); out.hl = M.hl && M.hl.kind; tick(120); out.kinds = P.ev('HL_KINDS').length;
  M.stops = [0, 0]; for (let k = 0; k < 3; k++) { M.phase = 'live'; M.off = o.team; P.call('changePoss', me.team); } out.stops = M.stops[me.team]; tick(80); M.phase = 'live'; P.call('scorePts', o, 1, 'jumper'); out.reset = M.stops[me.team]; tick(100);
  T.set(me); const B = M.B; M.tieAt = -99; M.arrow = undefined; B.state = 'loose'; B.holder = null; B.rebound = false; B.pos.set(0, 0.4, 6); B.vel.set(0, 0, 0); B.t = 0.3; M.looseT = 0; me.x = -0.4; me.z = 6; o.x = 0.4; o.z = 6; me.A.reb = o.A.reb = 60; me.H = o.H; const rn = Math.random; Math.random = () => 0.5; P.call('stepBall', 0.016); Math.random = rn; out.tie = M.phase === 'scored' && M.lastScorer.dead; out.arrow = M.arrow; tick(60);
  out.calls = calls.join(' | '); return out; });
ok(r.hl === 'buzzer' && r.kinds === 8 && /BUZZER BEATER/.test(r.calls), `a make released with under 1.6 s on the clock is a BUZZER BEATER highlight (${r.kinds} kinds to collect now)`);
ok(r.stops === 3 && /LOCKED IN/.test(r.calls) && r.reset === 0, `three stops in a row is LOCKED IN; giving up a bucket resets it`);
ok(r.tie && /TIE UP/.test(r.calls) && (r.arrow === 0 || r.arrow === 1), `two men on a loose ball at once is a TIE UP and the arrow flips`);
console.log(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors', '·', fails ? fails + ' FAILED' : 'ALL PASS'); await b.close(); process.exit(fails || errs.length ? 1 : 0);
