import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('C:' + m.text().slice(0, 200)); });
const wait = ms => page.waitForTimeout(ms);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(5000);
console.log('has', await page.evaluate(() => [typeof Issue, !!window.ISSUE_HTML, (window.ISSUE_HTML.docks || '').length]));
await page.evaluate(() => { BTS.UI.clear(); window.LOG = []; BTS.Cutscene.play([{ issue: 'docks', or: [{ card: 'FALLBACK', sub: 'x' }] }, { card: 'AFTER THE DOCKS', sub: 'resumed', min: 0.5, max: 30 }], () => LOG.push('cutscene-end')); });
await wait(4000);
console.log('on', await page.evaluate(() => [Issue.on, Issue.ready, document.querySelectorAll('iframe').length]));
const fr = page.frames().find(f => f !== page.mainFrame());
console.log('frame', !!fr, fr && await fr.evaluate(() => [document.title, SC.hosted, SC.state]));
await page.screenshot({ path: 'shots/int-title.png' });
// pause menu has the skip entry when hosted
await fr.evaluate(() => { document.querySelector('[data-go=n]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); });
await wait(800);
await fr.evaluate(() => { SC.manual = true; for (let i = 0; i < 5; i++) { SC.ui.pg && (SC.ui.pg.t = 0); SC.ui.tap(); } for (let i = 0; i < 80; i++) SC.tick(1 / 30); while (SC.ui.dlg) { SC.ui.dlg.full = true; SC.ui.tap(); } for (let i = 0; i < 60; i++) SC.tick(1 / 30); SC.ui.pause(); });
await wait(400); await page.screenshot({ path: 'shots/int-pause.png' });
console.log('pause', await fr.evaluate(() => document.getElementById('menu').innerText.replace(/\s+/g, ' ').slice(-120)));
if (process.env.SKIP) { await fr.evaluate(() => document.querySelector('[data-go=x]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); }
else {
  await fr.evaluate(() => { document.querySelector('[data-go=r]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); const F = SC.flags; SC.debug.flags(['intro', 'path', 'e_alley', 'e_street', 'key', 'gate', 'e_yard', 'breaker', 'e_wh', 'ledger', 'hatch', 'e_roof', 'bossIntro', 'boss']); SC.player.setPath('ember'); SC.story.bossDown = true; SC.debug.warp(16, 11, -26); for (let i = 0; i < 20; i++) SC.tick(1 / 30); const it = SC.world.interacts.find(i => i.id === 'moor'); it.act(); for (let i = 0; i < 90; i++) SC.tick(1 / 30); while (SC.ui.dlg) { SC.ui.dlg.full = true; SC.ui.tap(); } for (let i = 0; i < 60; i++) SC.tick(1 / 30); });
  await wait(500); await page.screenshot({ path: 'shots/int-end.png' });
  console.log('end', await fr.evaluate(() => document.getElementById('menu').innerText.replace(/\s+/g, ' ').slice(-40)));
  await fr.evaluate(() => document.querySelector('[data-go=a]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
}
await wait(1500);
console.log('after', await page.evaluate(() => [Issue.on, document.querySelectorAll('iframe').length, BTS.Cutscene.active, document.body.innerText.replace(/\s+/g, ' ').slice(0, 120), LOG]));
await page.screenshot({ path: 'shots/int-after.png' });
console.log('errors', errors); await browser.close();
