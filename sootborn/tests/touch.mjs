import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
for (const P of [1, 0]) {
  const page = await (await browser.newContext({ viewport: P ? { width: 390, height: 844 } : { width: 844, height: 390 }, hasTouch: true, isMobile: true })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
  await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.touchscreen.tap(P ? 195 : 400, P ? 400 : 200); await wait(6500);
  await ev(() => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; B.start(BTS.FF.pairing(), () => {}); }); for (let i = 0; i < 80 && !(await ev(() => BTS.Brawl.phase === 'fight' && document.body.classList.contains('fight'))); i++) await wait(150);
  console.log(await ev(() => [document.body.className, BTS.Brawl.phase, BTS.Brawl.active, !!BTS.Brawl.cine, BTS.UI.stack.length, BTS.G.mode])); const r = await ev(() => ['bA', 'bB', 'bX', 'bY', 'bR', 'bL', 'bM', 'dpad'].map(id => { const e = document.getElementById(id), b = e.getBoundingClientRect(); return [id, getComputedStyle(e).display, Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; }));
  const over = []; for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) { const a = r[i], b = r[j]; if (a[1] !== 'none' && b[1] !== 'none' && a[2] < b[4] && b[2] < a[4] && a[3] < b[5] && b[3] < a[5]) over.push(a[0] + '/' + b[0]); }
  console.log(P ? 'portrait' : 'landscape', JSON.stringify(r), 'overlaps', over);
  const bx = r.find(x => x[0] === 'bY'); await page.touchscreen.tap((bx[2] + bx[4]) / 2, (bx[3] + bx[5]) / 2); await wait(200);
  console.log('jumped z', await ev(() => Math.round(BTS.Brawl.p.z)), 'errors', errors);
  await page.screenshot({ path: `shots/touch-${P ? 'p' : 'l'}.png` }); await page.close();
}
await browser.close();
