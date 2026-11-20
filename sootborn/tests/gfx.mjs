import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
for (const F of ['ford', 'ford2d', 'valley']) for (const q of [0, 1, 2]) { await ev(([F, q]) => { const B = BTS.Brawl; Settings.d.gfx = q; Settings.d.fps = 1; BTS.UI.clear(); DEV.quick = 1; B.start(BTS.FF[F](), () => {}); B.cine = null; B.phase = 'fight'; B.tipT = 0; Perf.a.length = 0; }, [F, q]); await wait(2600);
  console.log(F, ['LOW', 'MED', 'HIGH'][q], await ev(() => { const a = Perf.a, avg = a.reduce((x, y) => x + y, 0) / a.length; return [document.querySelector('#gl').width, 'avg ' + avg.toFixed(1) + 'ms', 'worst ' + Math.max(...a).toFixed(0), G3.tris + ' tris', 'ink ' + (G3.ol.n / 3 | 0), 'build ' + Perf.build.toFixed(1) + 'ms'].join('  '); })); }
console.log('readout:', await ev(() => Perf.el && Perf.el.textContent), 'errors', errors.slice(0, 3)); await browser.close();
