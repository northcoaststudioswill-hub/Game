// Contested finishes by finisher quality: each profile drives at a rim protector N times through the real game.
// node tests/contest.mjs [N] [file.html]. Prints make %, block %, and which finishes the game picked.
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), N = +process.argv[2] || 40, file = path.resolve(process.argv[3] || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 120, height: 120 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
await page.goto('file://' + file); await page.evaluate(() => window.__tick(60));
await page.click('#titleBtns .btn'); await page.evaluate(() => window.__tick(5)); await page.click('#panel .pf .btn'); await page.evaluate(() => window.__tick(10));
await page.evaluate(() => { __pit.devMax(); __pit.devReel('contested'); window.__tick(200); });
const names = await page.evaluate(() => __pit.MT.reel.list.map(e => e.n));
for (let e = 0; e < 5; e++) {
  const r = await page.evaluate(([e, N]) => {
    const M = __pit.MT, R = M.reel, me = M.me, def = R.def; let made = 0, blk = 0, n = 0; const kinds = {};
    for (let k = 0; k < N; k++) {
      R.i = e; R.ph = 'setup'; R.t = 0; const f0 = me.stats.fgm, b0 = def.stats.blk; let kind = '';
      for (let i = 0; i < 400; i++) { window.__tick(1); if (me.st === 'finish') kind = me.finish.type === 'dunk' ? 'dunk:' + me.finish.style : me.finish.kind; if (R.i !== e) break; }
      R.i = e; n++; made += me.stats.fgm - f0; blk += def.stats.blk - b0; kinds[kind] = (kinds[kind] || 0) + 1;
    }
    return { made, blk, n, kinds };
  }, [e, N]);
  console.log(names[e].padEnd(18), `made ${String(Math.round(r.made / r.n * 100)).padStart(3)}%  blocked ${String(Math.round(r.blk / r.n * 100)).padStart(3)}%  picks ${JSON.stringify(r.kinds)}`);
}
console.log(errs.length ? errs.length + ' PAGE ERRORS ' + errs[0] : 'NO ERRORS'); await browser.close();
