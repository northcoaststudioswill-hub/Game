// frames for the box art and sell sheet: node capture.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), O = '/home/claude/shots/box/';
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); }
const W = (process.env.F || 'keep,valley,scuffle1,son,ring1,circle,barge').split(',');
for (const k of W) {
  await ev(k => { if (BTS.Brawl.active) BTS.Brawl.end(true); BTS.UI.clear(); BTS.Brawl.start(Object.assign(BTS.FF[k](), { intro: null }), () => {}); BTS.UI.clear(); }, k);
  for (let i = 0; i < 14; i++) { await wait(200); if (await ev(() => BTS.Dialogue.active || BTS.UI.stack.length)) await page.keyboard.press('KeyE'); else if (i > 6 && i % 2) await page.keyboard.press('KeyE'); }
  await page.keyboard.down('KeyD'); await wait(500); await page.keyboard.up('KeyD'); await page.keyboard.press('KeyE'); await wait(260);
  await page.screenshot({ path: O + k + '.png' }); }
await ev(() => { if (BTS.Brawl.active) BTS.Brawl.end(true); BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; BTS.Cutscene.play([{ issue: 'stair', or: [] }], () => {}); });
let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
for (let i = 0; i < 120; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && SC.state === 'play' && SC.player.control).catch(() => 0)) break; await page.keyboard.press('Enter'); }
await wait(1500); await page.screenshot({ path: O + 'stair-play.png' });
await fr.evaluate(() => { const pl = SC.player; pl.meter = 100; pl.state = 'power'; pl.st = 0; pl.pw = { id: 'ember' }; });
for (const ms of [60, 140, 420, 500, 300]) { await wait(ms); await page.screenshot({ path: O + 'stair-e' + ms + '.png' }); }
await browser.close();
