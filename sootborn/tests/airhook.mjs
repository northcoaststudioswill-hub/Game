import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(5000);
await ev(() => { BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF.docks(); delete d.arts; delete d.voice; BTS.Brawl.start(d, () => {}); }); await wait(2600); await ev(() => BTS.UI.clear());
const st = () => ev(() => { const B = BTS.Brawl, p = B.p, f = B.foes.find(o => o.hauled !== undefined) || B.foes[0]; return [B.phase, 'pz', Math.round(p.z), 'camH', Math.round(B.cam.h), 'camF', Math.round(B.cam.f), p.st, 'fz', Math.round(f.z || 0), f.st, 'fhp', Math.round(f.hp), B.msg].join(' '); });
for (let i = 0; i < 40 && await ev(() => BTS.Brawl.phase !== 'fight'); i++) await wait(150); console.log('ground', await st());
// fly up: hold jump (F)
await page.keyboard.down('KeyF'); await wait(1100); console.log('up     ', await st()); await page.screenshot({ path: '/home/claude/shots/ff/air-0.png' });
// bring a man near and hook him
await ev(() => { const B = BTS.Brawl, p = B.p, f = B.foes.find(o => !o.K.poise && o.st !== 'down'); B.foes.forEach(o => { o.hauled = undefined; if (o !== f) { o.x = p.x - 400; o.cd = 99; } }); f.x = p.x + 40; f.y = p.y; f.hauled = 0; p.hcd = 0; B.hook(); }); await wait(260);
console.log('hooked ', await st()); await page.screenshot({ path: '/home/claude/shots/ff/air-1.png' });
await wait(200); await ev(() => { const B = BTS.Brawl; B.p.st = 'idle'; B.strike(); }); await wait(220); console.log('cut    ', await st()); await wait(700); console.log('after  ', await st());
await page.keyboard.up('KeyF'); await wait(200);
// dive: fly, then dodge key in the air (plunge)
await page.keyboard.down('KeyF'); await wait(1000); await page.keyboard.up('KeyF'); await page.keyboard.press('KeyV'); await wait(110); console.log('diving ', await st()); await page.screenshot({ path: '/home/claude/shots/ff/air-2.png' }); await wait(900); console.log('landed ', await st());
console.log('errors', errors); await browser.close();
