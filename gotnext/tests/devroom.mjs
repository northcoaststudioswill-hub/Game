// Clicks through the Dev Room like a person: every tab, max out, a reel, a 1v1 against a maxed player, then back out.
// node tests/devroom.mjs [file.html] · screenshots in tests/shots/dev-*.png
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url)), file = path.resolve(process.argv[2] || path.join(dir, '..', 'index.html'));
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await browser.newContext({ viewport: { width: 1100, height: 720 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
const T = n => page.evaluate(n => window.__tick(n), n); const shot = async n => { fs.mkdirSync(path.join(dir, 'shots'), { recursive: true }); await page.screenshot({ path: path.join(dir, 'shots', `dev-${n}.png`) }); };
const click = async (sel, text) => { const b = page.locator(sel, { hasText: text }).first(); await b.click(); await T(4); };
await page.goto('file://' + file); await T(60);
await click('#titleBtns .btn', 'Dev room'); await T(30);
for (const t of ['PROFILE', 'BUILD', 'MOVES', 'PLAY', 'REEL']) { await click('#panel .tabs .btn', t); await T(20); await shot(t.toLowerCase()); }
await click('#panel .tabs .btn', 'PROFILE'); await click('#panel .btn', 'MAX ME OUT'); await T(30); await shot('maxed');
const ovr = await page.evaluate(() => __pit.S.attrs.dunk + '/' + __pit.S.badges.nofly + '/' + __pit.S.vc);
await click('#panel .tabs .btn', 'MOVES'); await click('#panel .btn', 'PREVIEW'); await T(40); await shot('preview');
await click('#panel .tabs .btn', 'REEL'); await click('#panel .btn', 'PLAY REEL'); await T(400);
const reel = await page.evaluate(() => ({ on: !!__pit.MT && !!__pit.MT.reel, i: __pit.MT && __pit.MT.reel.i, st: __pit.MT && __pit.MT.me.st })); await shot('reel');
await page.evaluate(() => { __pit.MT.cfg.onEnd({ practice: 'dev', quit: true }); }); await T(20);
await click('#panel .tabs .btn', 'PLAY'); await click('#panel .btn', '1 v 1'); await T(300);
const game = await page.evaluate(() => { const M = __pit.MT; return M ? { n: M.P.length, opp: M.P[1].b.name, oppDunk: M.P[1].b.attrs.dunk, phase: M.phase } : null; }); await shot('1v1');
await page.evaluate(() => { __pit.MT.cfg.onEnd({ quit: true }); }); await T(20);
await click('#panel .pf .btn', 'LEAVE'); await T(20);
const back = await page.evaluate(() => getComputedStyle(document.getElementById('title')).display);
console.log('maxed (dunk/badge/vc):', ovr); console.log('reel:', JSON.stringify(reel)); console.log('1v1:', JSON.stringify(game)); console.log('left to title:', back === 'flex');
console.log(errs.length ? errs.join('\n') + `\n${errs.length} PAGE ERRORS` : 'NO ERRORS'); await browser.close();
