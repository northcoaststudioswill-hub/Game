const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); p.on('pageerror', e => console.log('ERR', e.message));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(500);
  await p.click('#bNew'); await p.click('.c-skip'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
  console.log(await p.evaluate(() => { const st = G.state, out = []; Object.assign(st, { kitPicked: 1, toured: 1, tourAsked: 1, firstPath: 9, shownPlaces: { a: 1 }, deaths: 1, cellarSeen: 1 }); G.ui.hub(); G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); out.push('unsigned: ' + G.objective()); st.signed = true; st.soulDebt = 0; out.push('signed, 0: ' + G.objective()); st.soulDebt = 2; out.push('signed, 2: ' + G.objective()); return out.join('\n'); }));
  await b.close(); })();
