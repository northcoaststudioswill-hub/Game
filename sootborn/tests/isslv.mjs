import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
for (const k of ['riser', 'stair']) {
  await page.evaluate(k => { BTS.UI.clear(); BTS.Cutscene.play([{ issue: k, or: [{ card: 'FALLBACK', sub: 'x' }] }, { card: 'AFTER', sub: k, min: 0.5, max: 30 }], () => {}); }, k); await wait(4500);
  const fr = page.frames().find(f => f !== page.mainFrame());
  console.log(k, await page.evaluate(() => [Issue.on, Issue.ready, document.querySelector('iframe').title, document.querySelector('#bY').textContent]), await fr.evaluate(() => [SC.issue, SC.state, !!SC.ui.pg, Object.keys(SC.assets || {}).length]));
  for (let i = 0; i < 9; i++) { if (await fr.evaluate(() => SC.player.control && !SC.ui.pg && !SC.ui.dlg)) break; await page.keyboard.press("e"); await wait(450); }
  await fr.evaluate(() => { SC.manual = true; for (let i = 0; i < 40; i++) SC.tick(1 / 30); SC.manual = false; }); await wait(300);
  await page.keyboard.down('f'); await wait(700); const st = await fr.evaluate(() => [SC.player.control, SC.player.state, +(SC.player.lift || 0).toFixed(1), SC.player.pos.z.toFixed(1), Object.keys(SC.flags).join(), !!SC.ui.dlg, !!SC.ui.pg, !!SC.ui.mem]);
  await page.screenshot({ path: `shots/host-${k}.png` });
  await fr.evaluate(() => { SC.story.wipe(); SC.host('done', { skipped: 1 }); }); await wait(1200);
  console.log(k, 'held JUMP (state, height):', st, 'after', await page.evaluate(k => [Issue.on, BTS.G.flags['issue_' + k], document.querySelector('#bY').textContent], k)); await page.evaluate(() => BTS.Cutscene.skip(true)); await wait(400);
}
console.log('errors', errors); await browser.close();
