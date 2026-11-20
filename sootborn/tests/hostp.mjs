import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
await page.evaluate(() => { BTS.UI.clear(); BTS.Cutscene.play([{ issue: 'docks', or: [{ card: 'FALLBACK', sub: 'x' }] }, { card: 'AFTER', sub: 'k', min: 0.5, max: 30 }], () => {}); }); await wait(5000);
const fr = page.frames().find(f => f !== page.mainFrame());
for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => SC.player.control && !SC.ui.pg && !SC.ui.dlg)) break; await fr.evaluate(() => { if (SC.ui.pg) SC.ui.pg.t = 0; if (SC.ui.dlg) SC.ui.dlg.full = true; SC.ui.tap(); }); await wait(400); }
await fr.evaluate(() => { SC.manual = true; for (let i = 0; i < 60; i++) SC.tick(1 / 30); SC.manual = false; }); await wait(400);
await page.screenshot({ path: '/home/claude/shots/issue/hd-0.png' });
const send = m => page.evaluate(m => Issue.el.contentWindow.postMessage(Object.assign({ sootborn: 'in', x: 0, y: 0, press: [], hold: {} }, m), '*'), m);
await send({ pad: 1 }); await wait(300);
console.log('legend', await fr.evaluate(() => { const e = document.getElementById('padleg'); return e ? [e.style.display, e.innerText.replace(/\n/g, ' | ')] : null; }), 'posted', await fr.evaluate(() => SC.enemies.map(e => e.state + ':' + (e.enc && e.enc.id)).join(' ')));
await fr.evaluate(() => SC.ui.toast('WIDE OPEN. GET CLOSE AND PRESS *A* TO FINISH IT.', 3)); await wait(300); await page.screenshot({ path: '/home/claude/shots/issue/hd-1.png' });
console.log('toast', await fr.evaluate(() => document.getElementById('toast').innerText));
await send({ press: ['pause'] }); await wait(400); const sel = () => fr.evaluate(() => Array.from(document.querySelectorAll('#menu .mbtn')).map(b => (b.classList.contains('y') ? '>' : '') + b.innerText.trim().slice(0, 14)).join(' / '));
console.log('menu', await sel()); await send({ y: -1 }); await wait(150); await send({ y: 0 }); await wait(100); await send({ y: -1 }); await wait(150); console.log('down x2', await sel()); await send({ y: 0 }); await send({ y: 1 }); await wait(150); console.log('up', await sel());
await page.screenshot({ path: '/home/claude/shots/issue/hd-2.png' });
console.log('errors', errors.slice(0, 4)); await browser.close();
