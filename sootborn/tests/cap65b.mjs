import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: '/home/claude/report/raw/' + n + '.png' });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter');
for (let i = 0; i < 6; i++) { await wait(1500); await shot('title' + i); }
console.log(await ev(() => [BTS.G.mode, BTS.UI.stack.length, Fade.a]));
// Ashgate, awake
await ev(() => { BTS.UI.clear(); try { Game.startPresent(); } catch (e) { window.__e = e.message; } }); await wait(3000);
for (let i = 0; i < 60 && await ev(() => BTS.Dialogue.active || Cutscene.active); i++) { await page.keyboard.press('KeyE'); await wait(200); }
await wait(1500); await shot('ashgate0'); console.log('ash', await ev(() => [window.__e, BTS.G.mode, BTS.G.day, BTS.Dialogue.active]));
const hold = async (k, ms) => { await page.keyboard.down(k); await wait(ms); await page.keyboard.up(k); };
await hold('ArrowRight', 1500); await wait(300); await shot('ashgate1'); await hold('ArrowDown', 1200); await hold('ArrowRight', 1200); await shot('ashgate2');
console.log('errors', errors); await browser.close();
