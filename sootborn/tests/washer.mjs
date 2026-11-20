import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); }
await ev(() => { BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; BTS.Cutscene.play([{ issue: 'stair', or: [] }], () => {}); });
let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
for (let i = 0; i < 120; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && SC.state === 'play' && SC.player.control).catch(() => 0)) break; await page.keyboard.press('Enter'); }
await wait(600);
const r = await fr.evaluate(() => { const pl = SC.player; pl.meter = 100; pl.state = 'power'; pl.st = 0; pl.pw = { id: 'ember' }; return 'ok'; }).catch(e => 'ERR ' + e.message);
console.log(r);
for (const ms of [120, 260]) { await wait(ms); await page.screenshot({ path: `/home/claude/shots/washer-${ms}.png` }); }
await browser.close();
