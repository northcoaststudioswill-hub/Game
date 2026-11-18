import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const P = process.env.PORTRAIT, page = await (await browser.newContext({ viewport: P ? { width: 390, height: 844 } : { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: `shots/${P ? 'p-' : ''}art-${n}.png` });
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
for (const [m, frac] of [['ford', .69], ['ford', .35], ['keep', .59], ['valley', 0]]) {
  await ev(([m, frac]) => { const B = BTS.Brawl; BTS.UI.clear(); const d = BTS.FF[m](); delete d.intro; delete d.outro; B.start(d, () => {}); B.phase = 'fight'; const f = B.foes[0]; f.x = B.p.x + 34; f.y = B.p.y; for (const o of B.foes) o.cd = 9; if (frac) { for (const o of B.foes) o.hp = Math.round(o.max * frac); if (frac < .5) B.artDone[0] = 1; if (m === 'keep') B.artDone[0] = 1; } else B.ft = 4.9; }, [m, frac]);
  const tag = m + Math.round(frac * 100);
  for (let i = 0; i < 80 && !(await ev(() => !!BTS.Brawl.art)); i++) await wait(50);
  const until = async f => { for (let i = 0; i < 200 && !(await ev(f)); i++) await wait(40); };
  await wait(700); await shot(tag + '-a'); await wait(1900); await shot(tag + '-b'); await until(() => !BTS.Brawl.art || BTS.Brawl.art.t > BTS.Brawl.art.C - .55); await shot(tag + '-c');
  await until(() => !BTS.Brawl.art || BTS.Brawl.art.t > BTS.Brawl.art.C + .3); await shot(tag + '-d'); await wait(350); await shot(tag + '-e'); await wait(450); await shot(tag + '-f'); await wait(1500);
  console.log(tag, await ev(() => [!!BTS.Brawl.art, BTS.Brawl.foes.map(f => f.hp + '/' + f.max + ' z' + (f.z || 0)), BTS.Brawl.p.z, BTS.Brawl.phase]));
  await ev(() => { BTS.Brawl.active = false; });
}
console.log('errors', errors); await browser.close();
