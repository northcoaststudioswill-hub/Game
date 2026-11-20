import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => Menus.controls()); await wait(400); await page.screenshot({ path: '/home/claude/shots/v79/controls.png' });
await ev(() => { BTS.UI.clear(); Prelude.still(5.5, 'lucan'); }); await wait(300); await page.screenshot({ path: '/home/claude/shots/v79/lucan.png' }); await ev(() => { Prelude.done = null; Prelude.finish(); Prelude.still(5.5, 'halberd'); }); await wait(300); await page.screenshot({ path: '/home/claude/shots/v79/halberd.png' });
console.log('errors', errors); await browser.close();
