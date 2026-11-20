import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(5000);
await page.evaluate(m => { BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[m](); delete d.arts; delete d.voice; d.foes.forEach(f => { f.hp = 9999; }); BTS.Brawl.start(d, () => {}); }, process.env.M || 'pairing'); await wait(2600);
await page.evaluate(() => { const B = BTS.Brawl; B.foes.forEach(f => { f.cd = 99; f.x = B.p.x + 34; f.y = B.p.y; f.st = 'approach'; f.K = Object.assign({}, f.K, { spd: 0 }); }); window.__iv = setInterval(() => { const c = B.cam; c.x = B.p.x + 17; c.y = B.p.y + (window.__cy || 92); c.h = window.__ch || 52; B.foes.forEach(f => { f.cd = 99; f.x = B.p.x + 34; f.y = B.p.y; }); }, 8); BTS.UI.clear(); }); await wait(3200);
await page.screenshot({ path: '/home/claude/shots/ff/g3close-' + (process.env.TAG || 'a') + '.png' });
console.log('errors', errors); await browser.close();
