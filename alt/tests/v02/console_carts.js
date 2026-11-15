/* Rootdeep / Pocket Lantern v0.2 test: console_carts
   Run from the repo root:  node v0.2/tests/console_carts.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/console_carts/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const fresh = async () => { await page.goto('file://' + BUILD, { waitUntil: 'load' }); await page.waitForTimeout(700); };
  const st = () => page.evaluate(() => window.__g.s.state);
  const pick = async i => { await page.evaluate(i => document.querySelector(`.cart[data-i="${i}"]`).dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})), i); await page.waitForTimeout(1500); };
  const hit = async (key, ms=250) => { await page.keyboard.down(key); await page.waitForTimeout(90); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  const tag = process.argv[3] || 'build';
  // Sprouts: menu -> PLAY -> through the cinematic
  await fresh(); await pick(0);
  for (let k=0;k<30 && (await st())!=='menu';k++) await hit('Enter',300);
  await hit('Enter',800);
  let s=''; for (let k=0;k<60;k++){ s=await st(); if(s!=='cine') break; await hit('KeyZ',200) }
  console.log(tag,'sprouts after cinematic ->', await st());
  const hasRD = await page.evaluate(() => !!window.__g.RDF);
  if (hasRD) {
    await fresh(); await pick(2);
    for (let k=0;k<40;k++){ const s=await st(); if(s==='g3hub') break; await hit(s==='g3cine'?'KeyZ':'Enter',250) }
    console.log(tag,'rootdeep title+intro ->', await st());
    await hit('KeyQ',700);
    console.log(tag,'rootdeep Select in hub ->', await st(), '| shelf visible:', await page.evaluate(() => !document.getElementById('shelf').hidden));
    if (await st()==='off') {
      await pick(0); for (let k=0;k<30 && (await st())!=='menu';k++) await hit('Enter',300);
      console.log(tag,'sprouts after ejecting rootdeep ->', await st());
      await page.evaluate(()=>document.getElementById('shelf').hidden=false).catch(()=>{});
    }
  }
  console.log(tag,'PAGE ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await browser.close();
})();
