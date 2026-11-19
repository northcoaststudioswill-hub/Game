import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; window.__end = 0; B.start(BTS.FF.brandstair(), () => { window.__end = 1; }); B.phase = 'fight'; B.tipT = 0; });
await ev(() => { BTS.Brawl.t = 30; }); for (let i = 0; i < 14; i++) { for (const k of ['KeyE', 'KeyE', 'KeyC', 'KeyE']) { await page.keyboard.press(k); await wait(230); } if (i === 6) await page.screenshot({ path: 'shots/brand-1.png' }); if (i % 8 === 0) console.log(i, await ev(() => { const B = BTS.Brawl; return [Math.round(B.t), B.phase, B.p.hp, B.wave, B.foes.filter(f => f.st !== 'down').length, window.__end, B.active]; })); if (await ev(() => window.__end)) break; }
await page.screenshot({ path: 'shots/brand-2.png' });
console.log('end', await ev(() => [window.__end, BTS.Brawl.phase, BTS.Brawl.active]), errors); await browser.close();
