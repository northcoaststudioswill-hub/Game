import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(5000);
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
await fr.evaluate(() => { SC.debug.warp(1.2, 0, 39.6); }); await wait(900); await page.screenshot({ path: '/home/claude/shots/issue/pad-hud.png' });
const pr = await fr.evaluate(() => [SC.ui.promptOn, document.getElementById('prompt').textContent, SC.ui.hudK]); await tap('#bA'); await wait(400);
console.log('prompt', pr, 'A on the question mark opens it:', await fr.evaluate(() => !!SC.ui.dlg));
for (let i = 0; i < 8 && await fr.evaluate(() => !!(SC.ui.dlg || SC.ui.pg)); i++) await tap('#bA');
await fr.evaluate(() => { SC.debug.warp(0, 0, 35.6); SC.cam.snapBehind(Math.PI); }); await tp('#dpad', 0.5, 0.12, 'pointerdown'); await wait(2600); await tp('#dpad', 0.5, 0.12, 'pointerup');
console.log('walked onto the sun:', await fr.evaluate(() => [!!SC.ui.mem, SC.player.path, +SC.player.pos.z.toFixed(1)])); await tap('#bA'); await wait(600);
// a Warden, worn down, then finished with A
await fr.evaluate(() => { SC.manual = true; for (let i = 0; i < 160; i++) SC.tick(1 / 30); SC.clearEnemies(); SC.story.enc = null; const e = window.WE = SC.spawnEnemy('bruiser', SC.player.pos.x, 0, SC.player.pos.z - 2.2, null); e.model.group.scale.set(1, 1, 1); e.state = 'chase'; e.hit(999, 0, -1, { heavy: true }); for (let i = 0; i < 10; i++) SC.tick(1 / 30); SC.player.meter = 80; });
console.log('dazed', await fr.evaluate(() => [WE.state, SC.ui.promptOn, document.getElementById('prompt').textContent])); await tp('#bA', 0.5, 0.5, 'pointerdown'); await wait(60); await fr.evaluate(() => { for (let i = 0; i < 3; i++) SC.tick(1 / 60); }); await tp('#bA', 0.5, 0.5, 'pointerup');
console.log('finisher memory', await fr.evaluate(() => [!!SC.ui.mem, SC.player.state])); await fr.evaluate(() => SC.ui.memEnd());
for (const t of [0.3, 0.6, 0.95, 1.12]) { await fr.evaluate(t => { while (SC.player.st < t && SC.player.state === 'finish') SC.tick(1 / 60); }, t); await wait(250); await page.screenshot({ path: '/home/claude/shots/issue/fin-' + t + '.png', clip: { x: 6, y: 8, width: 378, height: 327 } }); }
await fr.evaluate(() => { for (let i = 0; i < 60; i++) SC.tick(1 / 30); }); console.log('after finisher', await fr.evaluate(() => [SC.player.state, SC.enemies.length, SC.player.stats.finishers]));
await page.screenshot({ path: '/home/claude/shots/issue/pad-portrait.png' });
console.log('control,z before', z0, 'z after holding up on the d-pad', z1, 'errors', errors); await browser.close();
