import { chromium } from 'playwright';
// VW/VH choose the window; TAG names the shots. Drives the level through SOOTBORN's own keys.
const VW = +(process.env.VW || 844), VH = +(process.env.VH || 390), TAG = process.env.TAG || 'l';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: VW, height: VH }, hasTouch: VW < VH })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('C:' + m.text().slice(0, 200)); });
const wait = ms => page.waitForTimeout(ms), shot = n => page.screenshot({ path: `shots/int-${TAG}-${n}.png` });
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(5000);
await page.evaluate(() => { BTS.UI.clear(); window.LOG = []; BTS.Cutscene.play([{ issue: 'docks', or: [{ card: 'FALLBACK', sub: 'x' }] }, { card: 'AFTER THE DOCKS', sub: 'resumed', min: 0.5, max: 30 }], () => LOG.push('cutscene-end')); });
await wait(4500);
const fr = page.frames().find(f => f !== page.mainFrame());
const fe = (f, a) => fr.evaluate(f, a);
console.log('start', await page.evaluate(() => { const r = document.querySelector('iframe').getBoundingClientRect(), c = document.querySelector('#game').getBoundingClientRect(); return [Issue.on, Issue.ready, [r.x, r.y, r.width, r.height].map(Math.round), [c.x, c.y, c.width, c.height].map(Math.round), document.body.classList.contains('fight'), document.querySelector('#bL').textContent]; }));
console.log('child', await fe(() => [SC.hosted, SC.state, !!SC.ui.pg, Object.keys(SC.assets || {}).length, document.body.className, getComputedStyle(document.getElementById('touch')).display, getComputedStyle(document.getElementById('rotate')).display, !!SC.audio.ctx]));
await shot('page');
const key = async (k, n, ms) => { for (let i = 0; i < (n || 1); i++) { await page.keyboard.press(k); await wait(ms || 350); } };
await key('e', 4, 450);
await fe(() => { SC.manual = true; for (let i = 0; i < 70; i++) SC.tick(1 / 30); }); await wait(300); await shot('dlg');
for (let i = 0; i < 14; i++) { await page.keyboard.press('e'); await wait(120); await fe(() => { for (let i = 0; i < 4; i++) SC.tick(1 / 30); }); }
await fe(() => { for (let i = 0; i < 60; i++) SC.tick(1 / 30); SC.manual = false; });
console.log('control', await fe(() => [SC.player.control, !!SC.ui.dlg, SC.flags.intro, +SC.player.pos.z.toFixed(1)]));
await page.keyboard.down('ArrowUp'); await wait(1600); await page.keyboard.up('ArrowUp'); await wait(200);
console.log('moved', await fe(() => [+SC.player.pos.x.toFixed(1), +SC.player.pos.z.toFixed(1)])); await shot('play');
// a question mark: what he sees, then the memory
await fe(() => { SC.manual = true; const it = SC.world.interacts.find(i => i.id === 'bike'); SC.flags.e_alley = 1; it.act(); });
for (let i = 0; i < 6 && await fe(() => !!SC.ui.dlg); i++) { await page.keyboard.press('e'); await wait(150); }
await wait(300); console.log('memory page', await fe(() => [!!SC.ui.pg, document.querySelectorAll('#page .pn').length])); await key('e', 1, 400); await shot('mem-page'); await key('e', 3, 400);
// the first sun: the count
await fe(() => { const it = SC.world.interacts.find(i => i.id === 'x_alley'); it.act(); }); await wait(500); console.log('count', await fe(() => [!!SC.ui.mem, SC.player.path, document.querySelector('#mem .mn').textContent])); await shot('count');
await key('e', 1, 600); await fe(() => { for (let i = 0; i < 200; i++) SC.tick(1 / 30); }); console.log('enc', await fe(() => [SC.story.enc && SC.story.enc.id, SC.enemies.length, !!SC.ui.menuOpen]));
// the ultimate, from this game's HOOK key
await fe(() => { SC.manual = false; SC.player.meter = 100; }); await wait(300); await page.keyboard.press('q'); await wait(700); console.log('eleven', await fe(() => [!!SC.ui.mem, SC.player.state, document.querySelector('#mem .mn').textContent])); await shot('eleven');
await key('e', 1, 1500); await shot('eleven2');
// pause from this game's menu key, then skip
await page.keyboard.press('m'); await wait(500); console.log('pause', await fe(() => [SC.ui.paused, document.getElementById('menu').innerText.replace(/\s+/g, ' ').slice(-60)])); await shot('pause');
await fe(() => document.querySelector('[data-go=x]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await wait(1500);
console.log('after', await page.evaluate(() => [Issue.on, document.querySelectorAll('iframe').length, BTS.Cutscene.active, document.querySelector('#bL').textContent, document.body.classList.contains('fight')]));
await shot('after'); console.log('errors', errors); await browser.close();
