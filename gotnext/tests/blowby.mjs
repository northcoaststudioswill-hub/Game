// Turbo blow-bys: a scripted handler at the top holds sprint and goes around his man again and again; how often does he get
// clean to the rim (inside 2.6 m with his defender not between him and it)? node tests/blowby.mjs [aiLvl]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), LVL = +(process.argv[2] || 0.78);
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 360 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
const r = await p.evaluate((LVL) => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[2], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; let g = 0; while (M.phase !== 'live' && g++ < 900) window.__tick(1);
  const me = M.me, d = M.P.find(q => q.team !== me.team && q.man === me) || M.P.find(q => q.team !== me.team), others = M.P.filter(q => q !== me && q !== d); let win = 0, n = 0, t = 0; const why = {};
  for (let k = 0; k < 40; k++) { const side = k % 2 ? 1 : -1; M.phase = 'live'; M.off = me.team; M.needClear = false; me.x = side * 0.6; me.z = 7.4; me.vx = me.vz = 0; me.st = 'free'; me.stam = 100; me.turboAt = -9; me.sprWas = false; P.call('give', me); me.live = 'drib';
    d.x = me.x * 0.85; d.z = 6.3; d.vx = d.vz = 0; d.st = 'free'; d.aiLvl = LVL; d.cool = 0; d.slowT = 0; d.man = me; for (const q of others) { q.x = side * -7; q.z = 1; q.vx = q.vz = 0; }
    for (const k2 in P.keys) P.keys[k2] = false; window.__tick(20); n++; let ok = false;
    for (let f = 0; f < 150; f++) { M.clock = 12; for (const q of others) { q.x = side * -7; q.z = 1; q.ai.tick = 9; } const K = P.keys; for (const k2 in K) K[k2] = false;
      // go wide of him first, then turn the corner at the rim: hold sprint the whole way
      const ph = f < 45 ? [side, 0.25] : [-me.x, -me.z]; const l = Math.hypot(ph[0], ph[1]) || 1, dx = ph[0] / l, dz = ph[1] / l; if (dx > 0.3) K.KeyD = true; if (dx < -0.3) K.KeyA = true; if (dz < -0.3) K.KeyW = true; if (dz > 0.3) K.KeyS = true; K.ShiftLeft = true;
      window.__tick(1); if (P.MT !== M || M.B.holder !== me) { why.lost = (why.lost || 0) + 1; ok = null; break; } const dh = Math.hypot(me.x, me.z), dd = Math.hypot(d.x, d.z);
      if (dh < 2.6) { ok = dd > dh - 0.2 || Math.hypot(d.x - me.x, d.z - me.z) > 1.5; t += f / 60; break; } }
    if (ok) win++; else if (ok === false) why[Math.hypot(me.x, me.z) < 2.6 ? 'cutoff' : 'short'] = (why[Math.hypot(me.x, me.z) < 2.6 ? 'cutoff' : 'short'] || 0) + 1; for (const k2 in P.keys) P.keys[k2] = false; }
  return { why, win, n, avg: +(t / Math.max(1, win)).toFixed(2) }; }, LVL);
console.log(`ai ${LVL}: the handler got clean to the rim ${r.win} times in ${r.n} ${JSON.stringify(r.why)}`, errs.length ? 'PAGE ERRORS ' + errs.slice(0, 2).join(' | ') : ''); await b.close();
