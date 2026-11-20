import { chromium } from 'playwright';
// the Table, hosted: every slide turned with the A button, in landscape and in portrait
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [vw, vh, tag] of [[844, 390, 'L'], [390, 844, 'P']]) {
  const page = await (await browser.newContext({ viewport: { width: vw, height: vh }, hasTouch: tag === 'P', isMobile: tag === 'P' })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
  await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
  await page.evaluate(() => { BTS.UI.clear(); BTS.Cutscene.play([{ issue: 'gild', or: [{ card: 'FALLBACK', sub: 'x' }] }, { card: 'AFTER', sub: 'gild', min: 0.5, max: 30 }], () => {}); }); await wait(1200);
  await page.screenshot({ path: `/home/claude/shots/issue/gh-${tag}-title.png` }); await wait(4200);
  const fr = page.frames().find(f => f !== page.mainFrame()); let n = 0;
  for (let i = 0; i < 24; i++) {
    const on = await page.evaluate(() => Issue.on); if (!on) break;
    const st = await fr.evaluate(() => SC.ui.pg ? [SC.ui.pg.n, SC.ui.pg.def.panels.length] : null).catch(() => null);
    if (st && (n === 0 || n === 3 || n === 5 || n === 9 || n === 12)) await page.screenshot({ path: `/home/claude/shots/issue/gh-${tag}-${n}.png` });
    await page.keyboard.press('e'); await wait(520); n++;
  }
  await wait(1500);
  console.log(tag, 'presses', n, 'after', await page.evaluate(() => [Issue.on, BTS.G.flags.issue_gild, (document.querySelector('.bigt') || {}).textContent]), 'errors', errors);
  await page.close();
}
await browser.close();
