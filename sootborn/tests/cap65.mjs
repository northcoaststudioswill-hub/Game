import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: '/home/claude/report/raw/' + n + '.png' });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6000);
await shot('title'); console.log('mode', await ev(() => [BTS.G.mode, BTS.UI.stack.length]));
const fight = async (m, n, ms, cam) => {
  await ev(m => { BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[m](); delete d.arts; delete d.voice; (d.foes || (d.waves && d.waves[0]) || []).forEach(f => { f.hp = 9999; }); BTS.Brawl.start(d, () => {}); }, m);
  await wait(ms || 2600);
  if (cam) { await ev(([cy, ch]) => { const B = BTS.Brawl; clearInterval(window.__iv); window.__iv = setInterval(() => { const c = B.cam; c.x = 0; c.y = B.p.y + cy; c.h = ch; B.foes.forEach(f => { f.cd = 99; }); }, 8); }, cam); await wait(900); }
  await ev(() => BTS.UI.clear()); await wait(200); await shot(n); await ev(() => { clearInterval(window.__iv); const B = BTS.Brawl; B.cine = null; try { B.end(true); } catch (e) {} }); await wait(700);
  console.log(n, 'ok', errors.length);
};
await fight('valley', 'valley', 2800, [150, 60]);
await fight('pairing', 'pairing', 2800, [170, 70]);
await fight('circle', 'circle', 1600);
await fight('ward', 'ward', 1600);
await fight('rowmorn', 'rowmorn', 1600);
await fight('drill', 'drill', 3200);
await fight('keep', 'keep', 3200);
// a 2D level
await ev(() => { BTS.UI.clear(); try { Mission.start('camp', () => {}); } catch (e) { window.__e = e.message; } }); await wait(2500);
for (let i = 0; i < 40 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('KeyE'); await wait(160); }
await wait(900); await shot('camp'); console.log('camp', await ev(() => [window.__e, BTS.G.mode]));
console.log('errors', errors); await browser.close();
