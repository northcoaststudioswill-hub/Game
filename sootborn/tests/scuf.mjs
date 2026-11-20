import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await page.waitForTimeout(600); await page.keyboard.press('Enter'); for (let i = 0; i < 100 && !(await page.evaluate(() => BTS.G.mode === 'opening')); i++) await page.waitForTimeout(100);
await page.evaluate(() => { BTS.Brawl.tap = true; }); await page.waitForTimeout(600);
await page.evaluate(() => { window.__r = null; BTS.Brawl.start({ bg2: 'rowk', era: 0, title: 'THE SCUFFLE', sub: 'TAM - OPEN HANDS, NO BLADES', foes: [{ id: 'tam', name: 'Tam', kind: 'quick', hp: 15 }] }, w => { window.__r = w; }); });
await page.waitForTimeout(5200); await page.screenshot({ path: '/home/claude/shots/issue/scuffle.png' });
// lose on purpose: check the line
await page.evaluate(() => { const B = BTS.Brawl; B.p.hp = 0; }); await page.waitForTimeout(1100); await page.screenshot({ path: '/home/claude/shots/issue/scuffle-lose.png' });
console.log('phase', await page.evaluate(() => BTS.Brawl.phase), 'errors', errors); await browser.close();
