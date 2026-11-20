import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600); await page.keyboard.press('Enter'); for (let i = 0; i < 100 && !(await page.evaluate(() => BTS.G.mode === 'opening')); i++) await wait(100);
await page.evaluate(() => { BTS.Brawl.tap = true; }); await wait(800);
await page.evaluate(m => { window.__r = null; BTS.Brawl.start(BTS.FF[m](), w => { window.__r = 'ended:' + w; }); }, process.env.M || 'circle');
await wait(1200); await page.screenshot({ path: '/home/claude/shots/issue/walk-0.png' });
const hold = async (k, ms) => { await page.keyboard.down(k); await wait(ms); await page.keyboard.up(k); };
await hold('ArrowRight', 900); await hold('ArrowUp', 500); await wait(300); await page.screenshot({ path: '/home/claude/shots/issue/walk-1.png' });
console.log('near', await page.evaluate(() => { const k = BTS.Brawl.wk; return [k.near && (k.near.name), Math.round(BTS.Brawl.p.x), Math.round(BTS.Brawl.p.y)]; }));
await page.keyboard.press('KeyE'); await wait(700); await page.screenshot({ path: '/home/claude/shots/issue/walk-2.png' });
console.log('dlg', await page.evaluate(() => BTS.Dialogue.active));
for (let i = 0; i < 8 && await page.evaluate(() => BTS.Dialogue.active); i++) { await page.keyboard.press('KeyE'); await wait(350); }
// walk to the fire and say it
await page.evaluate(() => { BTS.Brawl.p.x = -20; BTS.Brawl.p.y = 10; }); await hold('ArrowRight', 250); await wait(200);
console.log('near2', await page.evaluate(() => { const k = BTS.Brawl.wk; return [k.near && k.near.name, k.n]; })); await page.screenshot({ path: '/home/claude/shots/issue/walk-3.png' });
await page.keyboard.press('KeyE'); await wait(600);
console.log('result', await page.evaluate(() => [window.__r, BTS.Brawl.active]), 'errors', errors); await browser.close();
