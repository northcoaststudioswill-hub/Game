import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); DEV.quick = 1; const B = BTS.Brawl, d = BTS.FF.keepEnd(); d.arts = []; delete d.voice; d.taunt = null; B.start(d, () => {}); BTS.UI.clear(); const u = B.update.bind(B); B.update = () => {}; for (let i = 0; i < 150; i++) u(1 / 60); const p = B.p, f = B.foes[0]; p.x = -22; p.y = 0; f.x = 22; f.y = 0; p.fx = 1; p.fy = 0; f.st = 'idle'; f.t = 0; p.st = 'idle'; B.tipT = 0; B.msgT = 0; window.face = (fx, fy, cx, cy, ch) => { f.fx = fx; f.fy = fy; p.fx = -fx; p.fy = fy; Object.assign(B.cam, { x: cx, y: cy, h: ch, f: 150, roll: 0 }); }; });
const views = { front: [-.5, .85, 6, 92, 50], side: [-1, .1, 0, 100, 52], back: [.5, -.85, 6, 92, 50] };
for (const k of Object.keys(views)) { await ev(v => face(...v), views[k]); await wait(1500); await page.screenshot({ path: '/home/claude/shots/v69/lucan-' + k + '.png' }); }
console.log('errors', errors); await browser.close();
