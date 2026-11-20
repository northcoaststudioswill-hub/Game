import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
await page.evaluate(() => { BTS.UI.clear(); BTS.Cutscene.play([{ issue: 'riser', or: [{ card: 'FALLBACK', sub: 'x' }] }, { card: 'AFTER', sub: 'k', min: 0.5, max: 30 }], () => {}); }); await wait(5000);
const fr = page.frames().find(f => f !== page.mainFrame());
for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => SC.player.control && !SC.ui.pg && !SC.ui.dlg)) break; await fr.evaluate(() => { if (SC.ui.pg) SC.ui.pg.t = 0; if (SC.ui.dlg) SC.ui.dlg.full = true; SC.ui.tap(); }); await wait(400); }
const m = () => fr.evaluate(() => { const r = id => { const e = document.getElementById(id); return e ? Math.round(e.getBoundingClientRect().top) : null; }; return { obj: r('obj'), hud: r('hud'), pad: getComputedStyle(document.documentElement).paddingTop, st: getComputedStyle(document.documentElement).getPropertyValue('--st'), h: innerHeight }; });
console.log('as shipped', await m());
const kids = () => fr.evaluate(() => [...document.getElementById('hud').children].filter(e => e.getBoundingClientRect().height > 0 && getComputedStyle(e).display !== 'none').map(e => (e.id || e.className) + ':' + Math.round(e.getBoundingClientRect().top)).join(' '));
console.log('fixed   ', await kids());
await fr.evaluate(() => { const de = document.documentElement; de.style.setProperty('--st', '59px'); de.style.setProperty('--sb', '34px'); de.style.paddingTop = '59px'; }); await wait(300);
console.log('notch on', await kids()); await page.screenshot({ path: '/home/claude/shots/issue/safe-bad.png' });
console.log(await fr.evaluate(() => { const o = []; for (const sh of document.styleSheets) for (const r of sh.cssRules) if (r.cssText.includes('--st')) o.push(r.cssText.slice(0, 90)); return o.slice(0, 6); }));
console.log('errors', errors); await browser.close();
