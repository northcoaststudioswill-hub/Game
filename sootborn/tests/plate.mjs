// the drawn flash-forwards and the years strip: node plate.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +(process.env.VW || 1280), height: +(process.env.VH || 720) } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v72/plate-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); BTS.G.mode = 'cut'; window.__end = 0; BTS.Cutscene.play([{ card: 'NINE YEARS AFTER THE FURNACE', sub: 'The Count. A book as wide as a table.', big: 1, tr: 'years', min: 3, max: 3 }, { plate: 'book', secs: 10 }, { card: 'NINE YEARS AFTER THE FURNACE', sub: 'The Sun Spire. The service stair. Tavi, sixteen.', big: 1, tr: 'years', min: 2, max: 2 }, { plate: 'tavi', secs: 10 }, { narr: 'after' }], () => { window.__end = 1; }); });
await wait(2300); await shot('card');
for (let i = 0; i < 40 && !(await ev(() => Prelude.on)); i++) await wait(200);
console.log('book plate on:', await ev(() => Prelude.on && Prelude.pl && Prelude.pl.name)); await wait(2500); await shot('book-a'); await wait(5500); await shot('book-b');
for (let i = 0; i < 60 && (await ev(() => Prelude.on)); i++) await wait(200);
console.log('book ended by itself; cutscene went on:', await ev(() => BTS.Cutscene.active));
for (let i = 0; i < 60 && !(await ev(() => Prelude.on)); i++) await wait(200);
console.log('tavi plate on:', await ev(() => Prelude.on && Prelude.pl && Prelude.pl.name)); await wait(2500); await shot('tavi-a'); await wait(5000); await shot('tavi-b');
await page.keyboard.press('Enter'); await wait(400); console.log('skipped by a button:', !(await ev(() => Prelude.on)));
await wait(800); console.log('line after:', await ev(() => document.querySelector('#cine, #dlg, body').innerText.includes('after')), 'errors', errors);
await browser.close();
