/* Rootdeep / Pocket Lantern v0.2 test: keeper_moves
   Run from the repo root:  node v0.2/tests/keeper_moves.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/keeper_moves/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
const D = require('path').join(__dirname, 'out', 'keeper_moves') + '/'; require('fs').mkdirSync(D, { recursive: true });
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n')[1]));
  await page.goto('file://' + BUILD, { waitUntil: 'load' }); await page.waitForTimeout(700);
  const st = () => page.evaluate(() => window.__g.s.state);
  const hit = async (key, ms=200) => { await page.keyboard.down(key); await page.waitForTimeout(80); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  await page.evaluate(() => document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})));
  await page.waitForTimeout(1500);
  const cv = await page.$('canvas');
  const shot = async n => cv.screenshot({ path: D + n + '.png' });
  const xyShown = await page.evaluate(() => getComputedStyle(document.getElementById('bX')).display);
  console.log('X button display while Rootdeep is in:', xyShown);
  await page.evaluate(() => window.__g.RDF().start());
  for (const ch of ['WILL','ERIN','LOUIE','MARCUS']) {
    await page.evaluate(ch => { window.__g.RD().char = ch; window.__g.RDF().depart(); }, ch);
    await page.waitForTimeout(500);
    const hp0 = await page.evaluate(() => window.__g.RDF().foes().reduce((a,f)=>a+f.hp,0));
    // walk toward the foes a bit so moves land
    await page.keyboard.down('ArrowUp'); await page.waitForTimeout(500); await page.keyboard.up('ArrowUp');
    await hit('KeyC', 60); await page.waitForTimeout(90); await shot(ch+'_X');
    await page.waitForTimeout(400);
    await hit('KeyV', 60); await page.waitForTimeout(110); await shot(ch+'_Y');
    await page.waitForTimeout(400);
    await page.evaluate(() => window.__g.RDF().superFill()); await page.waitForTimeout(100);
    await hit('KeyX', 60); await page.waitForTimeout(200); await shot(ch+'_cutin');
    await page.waitForTimeout(700); await shot(ch+'_super');
    // a few seconds of rough play
    for (let t=0;t<40;t++){ const info = await page.evaluate(()=>({p:window.__g.RDF().pos(),f:window.__g.RDF().foes(),s:window.__g.s.state}));
      if(info.s!=='g3run'||!info.f.length) break;
      const e=info.f[0],dx=e.x-info.p.x,dy=e.y-info.p.y,key=Math.abs(dx)>Math.abs(dy)?(dx>0?'ArrowRight':'ArrowLeft'):(dy>0?'ArrowDown':'ArrowUp');
      if(Math.hypot(dx,dy)>20){await page.keyboard.down(key);await page.waitForTimeout(110);await page.keyboard.up(key)}
      await hit(['KeyZ','KeyZ','KeyC','KeyZ','KeyV'][t%5],40) }
    const r = await page.evaluate(() => { const R=window.__g.RDF().run(); return R?{state:window.__g.s.state,hp:Math.round(R.hp),sup:Math.round(R.sup),xCd:+R.xCd.toFixed(1),yCd:+R.yCd.toFixed(1),kills:R.kills,foeHp:window.__g.RDF().foes().reduce((a,f)=>a+f.hp,0)}:{state:window.__g.s.state} });
    console.log(ch, 'start foe hp', hp0, '->', JSON.stringify(r));
    await page.evaluate(() => { window.__g.RDF().start() }); await page.waitForTimeout(200);
  }
  // character select, pause, boon offer screens
  await page.evaluate(() => { const RD=window.__g.RD(); RD.gift.ERIN=3; window.__g.RDF().open('chars') }); await page.waitForTimeout(200);
  await hit('ArrowDown',200); await shot('chars');
  await page.evaluate(() => { window.__g.RD().char='MARCUS'; window.__g.RDF().depart() }); await page.waitForTimeout(400);
  await hit('Enter',300); await shot('pause'); await hit('Enter',300);
  await page.evaluate(() => window.__g.RDF().forceBoon('DEW')); await page.waitForTimeout(200); await shot('boon');
  console.log('final', await st(), '| errors:', errs.length ? '\n  '+errs.join('\n  ') : 'none');
  await browser.close();
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(1); });
