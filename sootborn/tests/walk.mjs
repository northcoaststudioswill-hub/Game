import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { BTS.UI.clear(); Mission.start('camp', () => BTS.Game.toTitle()); }); await wait(2500);
const pos = () => ev(() => [Math.round(BTS.P.x / 16 * 10) / 10, Math.round(BTS.P.y / 16 * 10) / 10, BTS.P.dir]);
console.log('start', await pos());
const go = async (k, ms) => { await page.keyboard.down(k); await wait(ms); await page.keyboard.up(k); await wait(150); };
await go('ArrowRight', 2600); console.log('right', await pos());
await go('ArrowDown', 500); console.log('down', await pos(), await ev(() => BTS.World.target && BTS.World.target.id));
await go('ArrowRight', 600); console.log('at petra?', await pos(), await ev(() => BTS.World.target && BTS.World.target.id));
await page.keyboard.press('KeyE'); await wait(500); console.log('dlg', await ev(() => [BTS.Dialogue.active, document.querySelector('#dlg .nm') && document.querySelector('#dlg .nm').textContent]));
await page.screenshot({ path: 'shots/walk-camp.png' });
// pause menu has skip
await ev(() => { BTS.Dialogue.end(); BTS.Menus.pause(); }); await wait(300); console.log('pause', await ev(() => [...document.querySelectorAll('.mi')].map(e => e.textContent.trim()).slice(0, 3)));
console.log(errors); await browser.close();
