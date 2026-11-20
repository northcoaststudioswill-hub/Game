import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await page.waitForTimeout(600); await page.keyboard.press('Enter'); await page.waitForTimeout(4000);
for (const k of ['riser', 'stair']) { await page.evaluate(k => { BTS.UI.clear(); DEV.quick = 1; BTS.Cutscene.play([{ issue: k, or: [{ brawl: () => BTS.FF[k]() }] }], () => {}); }, k); await page.waitForTimeout(1500);
  console.log(k, await page.evaluate(k => [Issue.on, BTS.Brawl.active, BTS.Brawl.def && BTS.Brawl.def.title, BTS.G.flags['issue_' + k]], k)); await page.evaluate(() => { BTS.Brawl.active = false; BTS.Brawl.cine = null; BTS.Cutscene.active && BTS.Cutscene.skip(true); }); }
console.log('ch2,ch5 build', await page.evaluate(() => [P2[2]().length, P2[5]().length]), 'errors', errors); await browser.close();
