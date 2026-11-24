// Leave a shoot-around at home from the pause menu, on desktop (P) and on a phone (a quick tap on the menu button)
import { createRequire } from 'module'; const { chromium, devices } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
for (const phone of [false, true]) {
  const ctx = await b.newContext(phone ? { ...devices['iPhone 13'] } : { viewport: { width: 1000, height: 600 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/Game/gotnext/index.html'); await p.waitForTimeout(1200);
  const tap = s => phone ? p.tap(s) : p.click(s); await tap('#titleBtns .btn'); await p.waitForTimeout(400); await tap('#panel .pf .btn'); await p.waitForTimeout(1200);
  await p.evaluate(() => { __pit.uiClose(); __pit.enterWorld('crib', 0, 7, Math.PI); }); await p.waitForTimeout(800);
  await p.evaluate(() => __pit.W.spots.find(s => s.label === 'SHOOT AROUND').fn()); await p.waitForTimeout(2500);
  const st0 = await p.evaluate(() => ({ mt: !!__pit.MT, state: document.body.dataset.state, menu: (() => { const e = document.getElementById('tMenu'); const r = e.getBoundingClientRect(); return [getComputedStyle(e).display, Math.round(r.x), Math.round(r.y), Math.round(r.width)]; })() }));
  if (phone) await p.tap('#tMenu'); else await p.keyboard.press('KeyP'); await p.waitForTimeout(800);
  const pan = await p.evaluate(() => ({ shown: getComputedStyle(document.getElementById('panel')).display, btns: [...document.querySelectorAll('#panel .btn')].map(b => b.textContent).filter(t => /LEAVE|RESUME|FORFEIT/.test(t)) }));
  let after = null; try { await tap('#panel .pf .btn.red'); await p.waitForTimeout(1500); after = await p.evaluate(() => ({ mt: !!__pit.MT, kind: __pit.W && __pit.W.kind, state: document.body.dataset.state })); } catch (e) { after = 'tap failed: ' + e.message.split('\n')[0]; }
  console.log(phone ? 'PHONE' : 'DESKTOP', JSON.stringify(st0), JSON.stringify(pan), JSON.stringify(after), errs.join(' | ')); await ctx.close();
}
await b.close();
