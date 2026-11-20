import { chromium } from 'playwright';
// PANELS=gild:1,weather:0 node pan.mjs -> /home/claude/shots/ff/pan-<id>-<stage>.png ; one sheet
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 640, height: 360 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
for (const ps of (process.env.PANELS || 'gild:1').split(',')) { const [id, st] = ps.split(':');
  await ev(([id, st]) => { BTS.UI.clear(); BTS.Cutscene.play([{ panel: id, stage: +st }, { fade: 'in', spd: 3 }, { wait: 30 }], () => {}); }, [id, st || 0]); await wait(+(process.env.T || 2600));
  await page.screenshot({ path: `/home/claude/shots/ff/pan-${id}-${st || 0}.png` }); await ev(() => BTS.Cutscene.skip(true)); await wait(300); }
console.log(errors); await browser.close();
