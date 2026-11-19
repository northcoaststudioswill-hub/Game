import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
for (const m of ['ford', 'ember', 'pairing', 'gallery']) { await ev(m => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[m](); delete d.arts; delete d.voice; B.start(d, () => {}); B.phase = 'fight'; B.tipT = 0; B.foes[0].cd = 99; B.foes[0].x = B.p.x + 44; B.foes[0].y = B.p.y; }, m); await wait(2500); await page.keyboard.press('KeyE'); await wait(110); await page.screenshot({ path: `shots/dc-${m}.png` }); }
console.log('errors', errors.slice(0, 2)); await browser.close();
