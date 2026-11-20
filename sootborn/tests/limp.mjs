import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
for (const key of ['stair', 'docks']) {
  await ev(k => { BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; BTS.Cutscene.play([{ issue: k, or: [] }], () => {}); }, key);
  let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
  for (let i = 0; i < 80; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && !!SC.limp && !!SC.player).catch(() => 0)) break; }
  console.log(key, await fr.evaluate(() => { const o = SC.limp({ kind: 'boss', runPh: 1.2 }, { hips: [0, .1, 0], thL: [-.9, 0, .03], shnL: [1.2, 0, 0], ftL: [0, 0, 0], y: 0 }), o2 = SC.limp({ kind: 'knifer', runPh: 1.2 }, { thL: [-.9, 0, .03] }); return JSON.stringify({ boss: [o.thL, o.shnL], other: o2.thL, hero: [SC.SPECS.hero.armor, SC.SPECS.hero.cape] }); }));
  if (key === 'docks') { for (let i = 0; i < 60; i++) { await wait(250); if (await fr.evaluate(() => SC.state === 'play' && SC.player.control).catch(() => 0)) break; await page.keyboard.press('Enter'); } await wait(1500); await page.screenshot({ path: '/home/claude/shots/v75/s10-docks2.png' }); }
  await ev(() => { Issue.finish(false); }); await wait(900); }
await ev(() => { BTS.UI.clear(); Prelude.still(5.5, 'docklog'); }); await wait(300); await page.screenshot({ path: '/home/claude/shots/v75/s10-docklog2.png' });
console.log('errors', errors); await browser.close();
