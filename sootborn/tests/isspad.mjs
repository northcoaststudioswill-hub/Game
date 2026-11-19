import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(5000);
await page.evaluate(() => { Settings.d.touch = 'on'; Layout.update(); BTS.UI.clear(); BTS.Cutscene.play([{ issue: 'docks' }, { card: 'AFTER', sub: 'x', min: 0.5, max: 30 }], () => {}); });
await wait(4500); const fr = page.frames().find(f => f !== page.mainFrame());
const tp = (sel, fx, fy, type) => page.evaluate(([sel, fx, fy, type]) => { const e = document.querySelector(sel), b = e.getBoundingClientRect(); e.dispatchEvent(new PointerEvent(type, { clientX: b.x + b.width * fx, clientY: b.y + b.height * fy, pointerId: 7, pointerType: 'touch', bubbles: true, cancelable: true })); }, [sel, fx, fy, type]);
const tap = async sel => { await tp(sel, 0.5, 0.5, 'pointerdown'); await wait(120); await tp(sel, 0.5, 0.5, 'pointerup'); await wait(350); };
for (let i = 0; i < 4; i++) await tap('#bA');                       // the three panels, with this game's A button
await fr.evaluate(() => { SC.manual = true; for (let i = 0; i < 70; i++) SC.tick(1 / 30); });
for (let i = 0; i < 12; i++) { await tap('#bA'); await fr.evaluate(() => { for (let i = 0; i < 4; i++) SC.tick(1 / 30); }); }
await fr.evaluate(() => { for (let i = 0; i < 60; i++) SC.tick(1 / 30); SC.manual = false; });
const z0 = await fr.evaluate(() => [SC.player.control, +SC.player.pos.z.toFixed(2)]);
await tp('#dpad', 0.5, 0.12, 'pointerdown'); await wait(2500); const z1 = await fr.evaluate(() => +SC.player.pos.z.toFixed(2)); await tp('#dpad', 0.5, 0.12, 'pointerup');
await page.screenshot({ path: 'shots/pad-portrait.png' });
console.log('control,z before', z0, 'z after holding up on the d-pad', z1, 'errors', errors); await browser.close();
