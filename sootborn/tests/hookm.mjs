import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
for (const [key, flags] of [['ksuns', {}], ['wardboard', {}], ['pillar', { proctorDone: 1, chalkedSun: 1 }]]) {
  await ev(([key, flags]) => { BTS.UI.clear(); BTS.G.mode = 'world'; Object.assign(BTS.G.flags, flags); const f = (typeof HOT !== 'undefined' && HOT[key]) || TALK[key]; BTS.Dialogue.start(f()); }, [key, flags]);
  let res = null;
  for (let i = 0; i < 30 && !res; i++) { res = await ev(() => { const D = BTS.Dialogue, B = BTS.Brawl; if (B.active && B.def && B.def.walk) return B.def.title + ' / ' + B.def.sub; if (!D.active) return 'dialogue ended, nothing started'; const b = [...document.querySelectorAll('button')].find(b => /memory/i.test(b.textContent)); if (b) b.click(); else D.next(); return null; }); await wait(120); }
  const dlgAfter = await ev(() => BTS.Dialogue.active); await ev(() => BTS.Brawl.active && BTS.Brawl.end(true)); await wait(300);
  console.log(key, '->', res, '| dialogue closed under it:', !dlgAfter, '| after leaving:', await ev(() => [BTS.Brawl.active, BTS.Dialogue.active && document.querySelector('#dlg').innerText.replace(/\s+/g, ' ').slice(0, 44), BTS.G.mode]));
  await ev(() => { while (BTS.Dialogue.active) BTS.Dialogue.next(); });
  // offered once only
  console.log('   second time offers it:', await ev(key => { const f = (typeof HOT !== 'undefined' && HOT[key]) || TALK[key]; return JSON.stringify(f()).includes('memory'); }, key));
}
console.log('errors', errors); await browser.close();
