import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: `shots/look-${n}.png` });
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
for (const m of ['valley', 'ford']) {
  await ev(m => { const B = BTS.Brawl; BTS.UI.clear(); const d = BTS.FF[m](); delete d.intro; delete d.outro; delete d.arts; B.start(d, () => {}); B.phase = 'fight'; B.tipT = 0; for (const f of B.foes) f.cd = 99; B.p.fury = 100; }, m);
  await wait(2200); await shot(m + '-fury'); await page.keyboard.press('KeyX'); await wait(130); await shot(m + '-dodge');
  await ev(() => { const B = BTS.Brawl; B.p.fury = 20; const f = B.foes[0]; f.x = B.p.x + 30; f.y = B.p.y; B.hitFoe(f, 2, 1, 0, true); }); await wait(120); await shot(m + '-hit');
  await ev(() => { const B = BTS.Brawl; B.def.waves = null; for (const f of B.foes.slice()) if (f.st !== 'down') B.hitFoe(f, 999, 1, 0, true); }); await wait(900); await shot(m + '-win');
  await ev(() => { BTS.Brawl.active = false; });
}
console.log('errors', errors); await browser.close();
