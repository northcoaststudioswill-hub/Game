import { chromium } from 'playwright';
// each transition, caught twice: early and late. No WebGL needed
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(3500);
const C = [['wake', 'ASHGATE', 'Forty-one days after the furnace. Kael still fixes valves.'], ['furnace', 'ELEVEN MONTHS BEFORE THE FURNACE', 'The Festival of the First Fire. Ashgate Square.'], ['strip', 'FOUR YEARS AFTER THE FURNACE', 'The Assay. Night twenty-five.'], ['step', 'NIGHT TWENTY-EIGHT', 'The Assay. Night twenty-eight. Forty of them, and nobody sitting.'], ['chalk', 'MEANWHILE', 'Cinderwell. Five years after the furnace. Tavi.'], ['page', 'RISER NINE', 'Five years after the furnace. The Assay valley, at night.']];
for (const [tr, t, s] of C) { await ev(([tr, t, s]) => { BTS.UI.clear(); Cutscene.card(t, s, 1, tr === 'strip' || tr === 'step' ? undefined : tr); }, [tr, t, s]); await wait(330); await page.screenshot({ path: '/home/claude/shots/v67/tr-' + tr + '-0.png' }); await wait(1900); await page.screenshot({ path: '/home/claude/shots/v67/tr-' + tr + '-1.png' });
  console.log(tr, await ev(() => { const el = document.querySelector('#card'), r = el.getBoundingClientRect(), b = el.querySelector('.bigt').getBoundingClientRect(), a = el.querySelector('.acal'); return [el.className, 'title fits', b.left >= 0 && b.right <= innerWidth, a ? 'strip lit: ' + (a.querySelector('.on') || {}).textContent : 'no strip']; })); await ev(() => Cutscene.hideCard()); await wait(150); }
console.log('errors', errors); await browser.close();
