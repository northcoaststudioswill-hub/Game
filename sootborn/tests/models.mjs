import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
const ids = (process.env.IDS || 'kael2,celf,warden,voss,lucan,sg1,cadt1,tyr').split(','), tag = process.env.TAG || 'm';
await ev(() => { const B = BTS.Brawl; BTS.UI.clear(); const d = BTS.FF.keep(); B.start(d, () => {}); });
for (const id of ids) {
  await ev(id => { const B = BTS.Brawl; B.playCine([{ d: 99, ...cu(0, 0, 2.3, 2.3, 0), acts: [{ id, a: [0, 0], blade: 0, fx: .35, fy: 1, sc: 1 }] }], () => {}); }, id);
  await wait(900); await page.screenshot({ path: `/home/claude/shots/ff/${tag}-${id}.png`, clip: { x: 222, y: 0, width: 400, height: 390 } });
}
console.log('errors', errors.slice(0, 3)); await browser.close();
