const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  for (const [nm, vp, cls] of [['pc', { width: 1280, height: 720 }, 'fighter'], ['ph', { width: 390, height: 844 }, 'sorcerer']]) {
    const p = await b.newPage({ viewport: vp, deviceScaleFactor: nm === 'ph' ? 2 : 1 }); p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1]));
    await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(500);
    await p.click('#bNew'); await p.click('.c-skip'); await p.click('[data-cls=' + cls + ']'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
    await p.evaluate(() => { const st = G.state; Object.assign(st, { toured: 1, tourAsked: 1, kitPicked: 1, firstPath: 9, shownPlaces: { a: 1 } }); G.ui.hub(); G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); G.ui.sheet(); G.gfx.render(); });
    await p.screenshot({ path: 'stn_' + nm + '_home.png' }); await p.click('[data-stance]'); await p.waitForTimeout(300); await p.screenshot({ path: 'stn_' + nm + '.png' });
    await p.click('[data-stn="3"]'); await p.waitForTimeout(100); const ok = await p.evaluate(() => [G.state.hero.stance, G.state.hero.fstance, !!document.querySelector('.stance.on[data-stn="3"]')]); console.log(nm, JSON.stringify(ok)); await p.close(); }
  console.log('ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
