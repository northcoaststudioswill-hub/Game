import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
const run = async fresh => { await page.evaluate(f => { BTS.UI.clear(); Issue.fresh = f; BTS.Cutscene.play([{ issue: 'docks', or: [] }, { card: 'AFTER', sub: 'k', min: 0.5, max: 30 }], () => {}); }, fresh); await wait(5000); return page.frames().find(f => f !== page.mainFrame()); };
let fr = await run(0);
for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => SC.player.control && !SC.ui.pg && !SC.ui.dlg)) break; await fr.evaluate(() => { if (SC.ui.pg) SC.ui.pg.t = 0; if (SC.ui.dlg) SC.ui.dlg.full = true; SC.ui.tap(); }); await wait(350); }
await fr.evaluate(() => { SC.flags.path = 'ember'; SC.flags.e_alley = 1; SC.story.objective(); localStorage.setItem; }); await fr.evaluate(() => { const k = Object.keys(localStorage); return k; }).then(k => console.log('keys', k.join(',').slice(0, 120)));
const y0 = await fr.evaluate(() => SC.cam.yaw);
await page.evaluate(() => Issue.el.contentWindow.postMessage({ sootborn: 'in', x: 0, y: 0, lk: [1, 0], press: [], hold: {}, pad: 1 }, '*')); await wait(900);
console.log('yaw moved by right stick', (await fr.evaluate(() => SC.cam.yaw) - y0).toFixed(2));
await page.evaluate(() => { Issue.finish(false); }); await wait(800);
fr = await run(0); await wait(500); console.log('resume: flags', await fr.evaluate(() => Object.keys(SC.flags).join(',')), 'page/dlg', await fr.evaluate(() => [!!SC.ui.pg, !!SC.ui.dlg]));
await page.evaluate(() => { Issue.finish(false); }); await wait(800);
fr = await run(1); await wait(500); console.log('fresh : flags', await fr.evaluate(() => Object.keys(SC.flags).join(',')), 'page/dlg', await fr.evaluate(() => [!!SC.ui.pg, !!SC.ui.dlg]));
console.log('errors', errors.slice(0, 3)); await browser.close();
