import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const P = process.env.PORTRAIT, page = await (await browser.newContext({ viewport: P ? { width: 390, height: 844 } : { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: `shots/${P ? 'p-' : ''}sup-${n}.png` });
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
for (const m of (process.env.M || 'keep,furnace,ring').split(',')) {
  await ev(m => { const B = BTS.Brawl; BTS.UI.clear(); const d = m === 'ring' ? { title: 'FINAL BOUT', sub: 'MARA VENN', foes: [{ id: 'mara', name: 'Mara', kind: 'boss', hp: 28 }], voice: { at: [[.2, 'MARA HELD ME DOWN WHILE THE DOORS CLOSED. NOW SHE IS ASKING ME TO HIT HER FOR IT.']] } } : BTS.FF[m](); delete d.intro; delete d.outro; B.start(d, () => {}); B.phase = 'fight'; B.p.fury = 100; const f = B.foes[0]; f.x = B.p.x + 34; f.y = B.p.y; f.cd = 9; }, m);
  await wait(500); await shot(m + '-0'); await page.keyboard.down('KeyE'); await wait(300); await shot(m + '-atk'); await wait(300); await page.keyboard.up('KeyE');
  await wait(450); await shot(m + '-cut'); await wait(700); await shot(m + '-rush'); 
  for (let i = 0; i < 60; i++) { const n = await ev(() => BTS.Brawl.sup ? BTS.Brawl.sup.n : -1); if (n >= 11 || n < 0) break; await wait(25); }
  await shot(m + '-fin0'); await wait(120); await shot(m + '-fin1'); await wait(350); await shot(m + '-fin2'); await wait(2500); await shot(m + '-after');
  await ev(() => { BTS.Brawl.active = false; });
}
console.log('errors', errors); await browser.close();
