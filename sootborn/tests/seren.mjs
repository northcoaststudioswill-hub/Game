// Seren finds the line: in story order, with the exit refused until she knows. node seren.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v73/seren-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); window.__r = null; BTS.Brawl.start(BTS.FF.serenline(), w => { window.__r = 'ended:' + w; }); BTS.UI.clear(); });
const talk = async () => { for (let i = 0; i < 40 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('KeyE'); await wait(260); } };
await wait(2800); await shot(0); await talk();
const obj = () => ev(() => BTS.Brawl.active ? BTS.Brawl.def.walk.obj(BTS.Brawl.wk) : '(over)');
const go = async (id, n) => { const ok = await ev(id => { const B = BTS.Brawl, w = B.def.walk, t = (w.spots || []).concat(B.allies).find(s => s.id === id); B.p.x = t.x - 6; B.p.y = t.y + (t.y < 0 ? 12 : -8); return 1; }, id); await wait(450); const near = await ev(() => BTS.Brawl.wk.near && BTS.Brawl.wk.near.id); if (n !== undefined) await shot(n); await page.keyboard.press('KeyE'); await wait(400); await talk(); await wait(300); console.log(id, '-> near', near, '| still walking:', await ev(() => BTS.Brawl.active), '|', await obj()); };
console.log('first:', await obj());
await go('tee'); await go('orin'); await go('bank', 1); await go('grate', 2); await go('tee'); await go('orin', 3); await go('board'); await go('tee', 4);
await wait(800); console.log('result', await ev(() => window.__r), 'flag', await ev(() => BTS.G.flags.serenLine), 'errors', errors);
await browser.close();
