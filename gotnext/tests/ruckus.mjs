// RUCKUS: after shoving, the game still ends and the shot clock still runs. node tests/ruckus.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 900, height: 520 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => { window.__tick(10); __pit.S.tut = 1; __pit.ev('renderer.render = function () { }'); });
const r = await p.evaluate(() => { const P = __pit; P.uiClose(); const m = P.MODES.find(x => x.id === 'j2'); P.launchGame(m, P.TIERS_COURT[1], { mates: [-1], rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; M.me.user = false; M.locals = []; let g = 0; while (M.phase !== 'live' && g++ < 900) window.__tick(1);
  M.brawlHeat = 3; M.B.state = 'held'; P.call('give', M.me); M.clock = 6; const c0 = M.clock; for (let i = 0; i < 60; i++) { M.brawlHeat = 3; for (const q of M.P) q.ai.tick = 9; window.__tick(1); } const ran = c0 - M.clock;
  // one bucket from winning, with the heat still up
  M.score[M.me.team] = M.cfg.mode.to - 1; M.brawlHeat = 3; P.call('scorePts', M.me, 2, 'jumper'); let f = 0; while (P.MT === M && f++ < 60 * 8) { if (P.MT) P.MT.brawlHeat = Math.max(P.MT.brawlHeat || 0, 2); window.__tick(1); }
  return { ran: +ran.toFixed(2), ended: P.MT !== M || M.over, secs: +(f / 60).toFixed(1) }; });
ok(r.ran > 0.8, `the shot clock runs while tempers are up: ${r.ran} s off it in one second`);
ok(r.ended && r.secs < 6, `the winning bucket ends the game in ${r.secs} s, heat or no heat`);
console.log(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors', '·', fails ? fails + ' FAILED' : 'ALL PASS'); await b.close(); process.exit(fails || errs.length ? 1 : 0);
