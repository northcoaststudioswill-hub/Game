// Online: the host checks the guest's reported shot hold against its own clock. An honest guest keeps their release;
// a doctored client that claims a perfect hold after letting go early gets its real one. node tests/netcheat.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 400, height: 300 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
const run = (letGoAfter, claim, jitter) => p.evaluate(([letGoAfter, claim, jitter]) => { const P = __pit; P.uiClose(); P.launchGame(P.MODES.find(m => m.id === 's2'), P.TIERS_COURT[0], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT, g = M.P.find(q => q !== M.me && q.team === M.me.team);
  while (P.IN.length < 6) P.IN.push({ mx: 0, my: 0, rx: 0, ry: 0, sprint: false, a: false, b: false, aP: false, bP: false, bR: false, flick: null, rdir: null });
  g.user = true; g.remote = true; g.ctrl = 5; M.phase = 'live'; M.needClear = false; M.B.state = 'held'; M.B.holder = g; g.live = 'drib'; g.x = 0; g.z = 6; g.st = 'free'; for (const q of M.P) if (q.team !== g.team) { q.x = 7; q.z = 12; }
  P.startShot(g, 'user'); const rel = g.shot.rel, wait = Math.round((letGoAfter * rel + jitter) * 60); for (let i = 0; i < wait; i++) window.__tick(1);
  P.IN[5].relEdge = true; P.IN[5].rh = claim * rel; window.__tick(1); P.IN[5].relEdge = false; for (let i = 0; i < 60 && !g.shot.released; i++) window.__tick(1);
  const r = { rel: +rel.toFixed(3), held: +(g.shot.hold != null ? g.shot.hold : NaN).toFixed(3), err: +(g.shot.err || 0).toFixed(3), flagged: g.relOff || 0 }; P.call('quitMatch'); window.__tick(5); P.uiClose(); return r; }, [letGoAfter, claim, jitter]);
let ok = true; const check = (n, c, x) => { console.log((c ? 'PASS ' : 'FAIL ') + n + ' · ' + JSON.stringify(x)); if (!c) ok = false; };
const honest = await run(1.0, 1.0, 0), honestLag = await run(1.0, 1.0, 0.05), cheat = await run(0.5, 1.0, 0), late = await run(1.6, 1.0, 0);
check('honest guest, perfect release: kept', Math.abs(honest.err) < 0.04 && !honest.flagged, honest);
check('honest guest, 50 ms of network lag: still kept', Math.abs(honestLag.err) < 0.12 && !honestLag.flagged, honestLag);
check('doctored client lets go at half time but claims perfect: given its real (early) hold', cheat.err < -0.3 && cheat.flagged, cheat);
check('doctored client holds far too long but claims perfect: given its real (late) hold', late.err > 0.3 && late.flagged, late);
console.log(errs.length ? 'PAGE ERRORS: ' + errs.slice(0, 3).join(' | ') : 'no page errors'); console.log(ok ? 'ALL PASS' : 'SOME FAILED'); await b.close();
