// Watch a live AI game with rendering on and photograph the moment each new thing happens. node tests/watch.mjs [outdir]
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url'; import fs from 'fs';
const dir = path.dirname(fileURLToPath(import.meta.url)), out = process.argv[2] || path.join(dir, 'shots', 'watch'); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 1000, height: 580 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn');
const WANT = { 'SCREENED': 8, 'LAID OUT': 14, 'TOOK THE CHARGE': 10, 'DIVE': 10, 'POSTING UP': 40, 'TIPPED OUT': 8, 'SWITCH': 6, 'EXTRA PASS': 4, 'CUTTING': 20, 'LOB': 22, 'c:AIRBALL': 10, 'c:ON A RUN': 10, 'c:LOCKED IN': 10, 'hl': 34, 'bubble': 6, 'c:TIE UP': 8, 'FOUGHT OVER': 8, 'c:GAME POINT': 10 };
await p.evaluate((WANT) => { window.__tick(10); const P = __pit; window.__seen = {}; window.__hit = null; window.__W = WANT;
  P.ev(`(function () { const f0 = floatTxt, c0 = call, h0 = highlight, b0 = bubble; const mark = (k) => { if (window.__W[k] === undefined || window.__hit) return; window.__seen[k] = (window.__seen[k] || 0) + 1; if (window.__seen[k] <= 1) window.__hit = k; };
    floatTxt = function (p, t, c) { mark(String(t)); return f0(p, t, c); }; call = function (a, s, c, d) { mark('c:' + a); return c0(a, s, c, d); };
    highlight = function (k, p, v) { const was = MT && MT.hl; const r = h0(k, p, v); if (MT && MT.hl && MT.hl !== was) mark('hl'); return r; }; bubble = function (p, l) { mark('bubble'); return b0(p, l); }; })()`); }, WANT);
let shots = 0, games = 0;
while (shots < 16 && games < 5) { games++;
  await p.evaluate((g) => { const P = __pit; P.uiClose(); const m = P.MODES.find(x => x.id === (g % 2 ? 's3' : 's2')); P.launchGame(m, P.TIERS_COURT[1], { mates: Array(m.size - 1).fill(-1), rival: -1, p2: 'off' }); window.__tick(30); const M = P.MT; M.me.user = false; M.locals = []; for (const q of M.P) q.aiLvl = 0.5 + 0.4 * ((q.i * 7) % 5) / 4; }, games);
  for (let i = 0; i < 2500 && shots < 16; i++) {
    const hit = await p.evaluate(() => { for (let k = 0; k < 4; k++) { if (!__pit.MT) return 'END'; window.__tick(1); if (window.__hit) break; } return window.__hit; });
    if (hit === 'END') break; if (!hit) continue;
    await p.evaluate((n) => { for (let k = 0; k < n; k++) { if (__pit.MT) window.__tick(1); } window.__hit = null; }, WANT[hit]);
    await p.waitForTimeout(1400); const name = String(shots).padStart(2, '0') + '-' + hit.replace(/[^A-Za-z]+/g, '_') + '.png'; await p.screenshot({ path: path.join(out, name), timeout: 120000 }); shots++; console.log('shot', name);
  }
  await p.evaluate(() => { if (__pit.MT) __pit.call('quitMatch'); window.__tick(10); __pit.uiClose(); });
}
console.log(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors', '· seen', JSON.stringify(await p.evaluate(() => window.__seen))); await b.close();
