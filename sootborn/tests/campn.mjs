// the camp at night (day 31): walk it for real with the keys, and count who falls in. node campn.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v73/campn-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); window.__r = null; BTS.Brawl.start(BTS.FF.campnight(), w => { window.__r = 'ended:' + w; }); BTS.UI.clear(); });
await wait(2800); for (let i = 0; i < 6 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('KeyE'); await wait(300); }
const st = () => ev(() => { const B = BTS.Brawl; return { x: Math.round(B.p.x), y: Math.round(B.p.y), fol: B.allies.filter(a => a.fol).length, obj: B.def.walk.obj(B.wk) }; });
console.log('start', JSON.stringify(await st())); await shot(0);
const key = { right: 'KeyD', up: 'KeyW', down: 'KeyS' };
const go = async (k, ms) => { await page.keyboard.down(key[k]); await wait(ms); await page.keyboard.up(key[k]); };
await go('right', 1500); console.log(JSON.stringify(await st())); await shot(1);
await go('up', 500); await go('right', 1500); console.log(JSON.stringify(await st())); await shot(2);
await go('down', 700); await go('right', 1600); console.log(JSON.stringify(await st())); await shot(3);
await ev(() => { const p = BTS.Brawl.p; p.x = 168; p.y = -6; }); await wait(1200); console.log('at the cache', JSON.stringify(await st())); await shot(4);
await page.keyboard.press('KeyE'); await wait(400); await shot(5);
for (let i = 0; i < 10 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('KeyE'); await wait(300); }
await wait(800); console.log('result', await ev(() => window.__r), 'errors', errors);
await browser.close();
