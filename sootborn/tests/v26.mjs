import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
console.log('title items', await ev(() => [...document.querySelectorAll('.mi')].map(e => e.textContent.trim())));
// training from title
await ev(() => BTS.Menus.training()); await wait(7000);
console.log('dbg', await ev(() => JSON.stringify([BTS.Cutscene.block, BTS.Cutscene.i, BTS.G.mode, typeof BTS.Cutscene.q]))); console.log('training', await ev(() => [BTS.G.mode, BTS.Brawl.def && BTS.Brawl.def.title, BTS.Brawl.phase]));
await page.screenshot({ path: 'shots/v26-train.png' });
// calendar card
await ev(() => { BTS.UI.clear(); BTS.Cutscene.play([{ card: 'FOUR YEARS FROM NOW', sub: 'The Assay. Day twenty-six.', big: 1, min: 9, max: 9 }], () => {}); }); await wait(1800);
await page.screenshot({ path: 'shots/v26-cal.png' });
console.log('cal', await ev(() => document.querySelector('#card .acal .on') && document.querySelector('#card .acal .on').textContent));
// chapter select
await ev(() => { localStorage.setItem('sootborn_done', '1'); }); 
// pause -> training -> back to world
await page.reload(); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
console.log('title items 2', await ev(() => [...document.querySelectorAll('.mi')].map(e => e.textContent.trim())));
await ev(() => { BTS.UI.clear(); BTS.Game.loadSave(BTS.Save.migrate(JSON.parse(JSON.stringify(CHECKPOINTS.day2)))); }); await wait(2500);
const before = await ev(() => [BTS.G.mode, BTS.G.mapId, BTS.G.day]);
await ev(() => { BTS.Game.autosave(); BTS.Menus.training(true); }); await wait(7000);
console.log('pause-training', before, await ev(() => [BTS.G.mode, BTS.Brawl.def && BTS.Brawl.def.title]));
// leave training: find how it ends
await ev(() => { const B = BTS.Brawl; B.cine = null; B.end(true); }); await wait(9000);
console.log('after', await ev(() => [BTS.G.mode, BTS.G.mapId, BTS.G.day]));
console.log('errors', errors); await browser.close();
