// The jumper against shooting references: launch angle (good shooters ~45-52 deg), how high the shooter gets (a few inches
// to a foot on a standing jumper), and where in the jump the ball leaves (on the way up, before the top). node tests/shotform.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 400, height: 300 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
const rows = await p.evaluate(() => { const P = __pit, out = []; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT, me = M.me;
  for (const q of M.P) if (q !== me) { q.x = 7; q.z = 13; q.ai.react = 99; }
  for (const [jid, x, z] of [['textbook', 0, 7.4], ['textbook', 2.5, 4.2], ['moon', 0, 7.4], ['quick', -5.6, 5.4]]) { me.b.moves.jumper = jid; M.phase = 'live'; M.needClear = false; M.clock = 14; M.B.state = 'held'; M.B.holder = me; me.live = 'drib'; me.st = 'free'; me.x = x; me.z = z; me.vx = me.vz = 0; window.__tick(5);
    P.startShot(me, 'user'); const rel = me.shot.rel; let maxY = 0, tUp = null, tTop = null, tRel = null, yPrev = 0, ang = null, kind = me.shot.kind;
    for (let i = 0; i < 90; i++) { if (me.st === 'shoot' && !me.shot.released && me.t >= rel) { me.shot.hold = rel; P.releaseShot(me); tRel = me.t; if (M.B.state === 'shot') ang = Math.atan2(M.B.vel.y, Math.hypot(M.B.vel.x, M.B.vel.z)) * 180 / Math.PI; }
      window.__tick(1); if (me.y > 0.005 && tUp === null) tUp = me.t; if (me.y < yPrev && tTop === null && me.y > 0.01) tTop = me.t - 1 / 60; yPrev = me.y; maxY = Math.max(maxY, me.y); if (me.st !== 'shoot' && i > 10) break; }
    out.push({ jid, kind, d: +Math.hypot(x, z).toFixed(1), ang: ang && +ang.toFixed(1), lift: +maxY.toFixed(2), takeoff: tUp && +(tUp / rel).toFixed(2), top: tTop && +(tTop / rel).toFixed(2), rel: 1 }); M.B.state = 'held'; M.B.holder = me; window.__tick(60); }
  return out; });
let ok = true; for (const r of rows) { const good = r.ang >= 44 && r.ang <= 54 && r.lift <= 0.35 && r.lift >= 0.1 && r.top > 1.0; if (!good) ok = false; console.log((good ? 'PASS ' : 'FAIL ') + `${r.jid} ${r.kind} from ${r.d} m: leaves at ${r.ang}°, lift ${r.lift} m, off the floor at ${r.takeoff} of the release time, top of the jump at ${r.top} (release at 1.00, so ${r.top > 1 ? 'on the way up' : 'after the top'})`); }
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); console.log(ok ? 'ALL PASS' : 'SOME FAILED'); await b.close();
