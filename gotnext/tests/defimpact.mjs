// Does defense change the shot? An AI shooter takes 200 jumpers per case against YOUR defender (a rookie or a good one):
// nobody near, hands up a step off, a timed jump in his face, a jump too early, a flying closeout. Make % per case.
// node tests/defimpact.mjs [court]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), COURT = +(process.argv[2] || 0);
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 400, height: 300 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
const res = await p.evaluate((COURT) => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[COURT], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT, me = M.me, sh = M.P.find(q => q.team !== me.team);
  const cases = { open: { d: 9, jump: null }, 'hands up 1.2 m': { d: 1.2, jump: null, hands: true }, 'jump in his face (timed)': { d: 0.8, jump: 0.75 }, 'jump too early': { d: 0.8, jump: 0.1 }, 'flying closeout from 3 m': { d: 3, jump: 0.55, run: true } }, out = {};
  const T0 = (ok) => { for (const q of M.P) if (q !== me && q !== sh) { q.x = 7; q.z = 13; q.ai.react = 99; q.cool = 99; } };
  for (const [name, c] of Object.entries(cases)) { let made = 0, n = 0, csum = 0;
    for (let i = 0; i < 160; i++) { T0(); M.phase = 'live'; M.needClear = false; M.clock = 14; M.B.state = 'held'; M.B.holder = sh; sh.st = 'free'; sh.live = 'drib'; sh.x = 0; sh.z = 6.6; sh.vx = sh.vz = 0; sh.y = 0;
      me.st = 'free'; me.y = 0; me.vx = me.vz = 0; me.x = 0; me.z = 6.6 - c.d; me.face = 0; me.handsUp = !!c.hands; window.__tick(1);
      P.startShot(sh, 'ai'); sh.shot.aiRel = sh.shot.rel; let jumped = false, cAt = 0;
      for (let f = 0; f < 80 && sh.st === 'shoot' && !sh.shot.released; f++) { if (c.run && !jumped) { const dx = sh.x - me.x, dz = sh.z - me.z, l = Math.hypot(dx, dz); me.vx = dx / l * 6; me.vz = dz / l * 6; me.x += me.vx / 60; me.z += me.vz / 60; }
        if (c.jump !== null && !jumped && sh.t >= sh.shot.rel * c.jump) { jumped = true; P.startJump(me); }
        if (c.hands) me.handsUp = true; cAt = P.contestOn(sh); window.__tick(1); }
      if (M.B.state === 'shot') { n++; csum += cAt; if (M.B.make) made++; if (i < 3) (window.__dbg = window.__dbg || []).push(name + ': me ' + me.st + ' t' + (me.t || 0).toFixed(2) + ' jv' + me.jv + ' y' + me.y.toFixed(2) + ' d' + Math.hypot(me.x - sh.x, me.z - sh.z).toFixed(2) + ' rel' + sh.shot.rel.toFixed(2)); } window.__tick(70); M.B.state = 'held'; M.B.holder = sh; }
    out[name] = { pct: n ? Math.round(made / n * 100) : 0, n, c: n ? +(csum / n).toFixed(2) : 0, jv: me.jv }; }
  out.__dbg = window.__dbg; return out; }, COURT);
console.log((res.__dbg || []).join('\n')); delete res.__dbg; for (const [k, v] of Object.entries(res)) console.log(`${k.padEnd(26)} makes ${String(v.pct).padStart(3)}% of ${v.n}   contest ${v.c}`);
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); await b.close();
