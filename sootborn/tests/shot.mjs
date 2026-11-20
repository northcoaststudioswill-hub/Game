import { chromium } from 'playwright';
// usage: K=stand,valley FURY=100 node shot.mjs  -> /home/claude/shots/ff/shot-<k>.png
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: +(process.env.VW || 844), height: +(process.env.VH || 390) } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html' + (process.env.HASH || '#noff')); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
for (const k of (process.env.K || 'stand').split(',')) {
  await ev(([k, fury, XX]) => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[k](); Object.assign(d, JSON.parse(XX)); delete d.arts; delete d.voice; delete d.outro; B.start(d, () => {}); B.phase = 'fight'; B.tipT = 0; if (fury) B.p.fury = +fury; }, [k, process.env.FURY || 0, process.env.X || '{}']);
  await wait(+(process.env.T || 1800)); if (process.env.FURY) await ev(f => { BTS.Brawl.p.fury = +f; }, process.env.FURY); await wait(300);
  await page.screenshot({ path: `/home/claude/shots/ff/shot-${k}${process.env.TAG || ''}.png` });
}
console.log('errors', errors); await browser.close();
