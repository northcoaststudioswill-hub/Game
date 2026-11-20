import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage(); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
await page.evaluate(() => { BTS.UI.clear(); BTS.Cutscene.play([{ fade: 'out' }, { issue: 'gild', or: [] }, { card: 'AFTER', sub: 'gild', min: 0.5, max: 30 }], () => {}); });
for (const t of [700, 1400, 2400]) { await wait(t === 700 ? 700 : t === 1400 ? 700 : 1000); console.log(t, await page.evaluate(() => [Issue.on, Issue.ready, Issue.el && Issue.el.style.opacity, !!document.querySelector('.bigt'), (document.querySelector('.bigt') || {}).textContent])); await page.screenshot({ path: `/home/claude/shots/issue/gt-${t}.png` }); }
await browser.close();
