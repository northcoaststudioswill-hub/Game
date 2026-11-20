import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
page.on('pageerror', e => console.log('ERR', e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600); await page.keyboard.press('Enter');
for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'opening')); i++) await wait(100);
await ev(() => { BTS.Brawl.tap = true; }); for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) await wait(100); await wait(2500);
await ev(() => { const o = BTS.Game.toTitle; BTS.Game.toTitle = function () { console.log('toTitle from', new Error().stack.split('\n').slice(2, 5).join(' | ')); return o.apply(this, arguments); }; });
page.on('console', m => console.log('LOG', m.text().slice(0, 400)));
await ev(() => { BTS.UI.clear(); ffScene('X', 'Y', () => BTS.FF.ford(), () => {}); });
for (let i = 0; i < 12; i++) { console.log(await ev(() => [BTS.G.mode, BTS.Cutscene.active, BTS.Cutscene.i, BTS.Brawl.active])); await wait(700); }
await browser.close();
