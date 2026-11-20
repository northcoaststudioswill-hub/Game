const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 390, height: 800 } }); p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1]));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(400);
  await p.click('#bNew'); await p.click('.c-skip'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
  const tick = n => p.evaluate(n => { const h = G.world.get('hub'); for (let i = 0; i < n; i++) { window._T = (window._T || 10) + 1 / 30; G.world.updateWalk(1 / 30, window._T, G.ui.isOpen() || !!G.talk || !!G.dicing); h.update(window._T, 1 / 30); } G.gfx.render(); const sum = (document.querySelector('#dicebar .dsum') || {}).textContent || ''; return { say: (document.getElementById('dsay') || {}).textContent, sum, btns: [...document.querySelectorAll('#dicebar button')].map(b => b.textContent).join('|'), coin: G.state.coin }; }, n);
  const click = sel => p.evaluate(sel => { const b = document.querySelector(sel); if (!b) return 'NO ' + sel; b.click(); return 'ok'; }, sel);
  await p.evaluate(() => { G.muted = true; const st = G.state; st.toured = 1; st.tourAsked = 1; st.kitPicked = 1; st.firstPath = 9; st.shownPlaces = { 'the Notice Board': 1, 'Big Hobb’s Pot': 1, 'the Low Lamp': 1, 'the Apothecary': 1, 'Marc’s table': 1, 'the Wisp Table': 1 }; st.respect = 400; st.wins = { a: 3 }; st.coin = 500; st.seen = Object.assign(st.seen || {}, { wisp: 1 }); G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); G.world.enter('hub'); G.ui.wisp(); });
  console.log('open   ', JSON.stringify(await tick(5))); await p.evaluate(() => document.querySelectorAll('#veil').forEach(v => v.remove())); await p.screenshot({ path: 'dice_open.png' });
  const shots = [];
  // Twenty-One: throw until 15+, then stand
  await click('[data-g=t21]'); await tick(2); await click('[data-s="25"]'); await click('#dgo'); await tick(3);
  for (let i = 0; i < 9; i++) { const s = await tick(2); if (!/Throw one/.test(s.btns)) break; await click('#droll'); for (let k = 0; k < 4; k++) { await tick(6); if (k === 1 && i === 1) shots.push((await p.screenshot({ type: 'jpeg', quality: 78 })).toString('base64')); } const s2 = await tick(2); const tot = +((s2.sum.match(/You (\d+)/) || [])[1] || 0); if (tot >= 15 && /Stand/.test(s2.btns)) { await click('#dstand'); break; } }
  for (let k = 0; k < 40; k++) { const s = await tick(6); if (k === 6) shots.push((await p.screenshot({ type: 'jpeg', quality: 78 })).toString('base64')); if (/Again/.test(s.btns)) break; }
  console.log('21 done', JSON.stringify(await tick(2))); shots.push((await p.screenshot({ type: 'jpeg', quality: 78 })).toString('base64'));
  // Poker Bones: hold two, rethrow
  await click('#dback'); await tick(2); await click('[data-g=poker]'); await click('#dgo'); for (let k = 0; k < 30; k++) { const s = await tick(6); if (/Throw all|Throw the rest/.test(s.btns)) break; }
  await click('[data-h="0"]'); await click('[data-h="1"]'); shots.push((await p.screenshot({ type: 'jpeg', quality: 78 })).toString('base64')); await click('#dreroll'); for (let k = 0; k < 50; k++) { const s = await tick(6); if (/Again/.test(s.btns)) break; }
  console.log('poker  ', JSON.stringify(await tick(2))); shots.push((await p.screenshot({ type: 'jpeg', quality: 78 })).toString('base64'));
  // High Bones via Marc
  await click('#dleave'); await tick(2); await p.evaluate(() => G.ui.bones()); await tick(2); await click('#dgo'); for (let k = 0; k < 30; k++) { const s = await tick(6); if (/Stand/.test(s.btns)) break; } await click('#dpress'); for (let k = 0; k < 20; k++) { const s = await tick(6); if (/Stand/.test(s.btns) && !/Press/.test(s.btns)) break; } await click('#dstand'); for (let k = 0; k < 40; k++) { const s = await tick(6); if (/Again/.test(s.btns)) break; }
  console.log('bones  ', JSON.stringify(await tick(2)));
  await click('#dleave'); console.log('left   ', await p.evaluate(() => [G.dicing, !!G.gfx.cine, !!document.getElementById('dicebar')].join(' ')));
  const pg = await b.newPage({ viewport: { width: 1500, height: 100 } }); await pg.setContent('<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(3,500px)">' + shots.map(f => `<img src="data:image/jpeg;base64,${f}" width=500>`).join('') + '</body>'); await pg.screenshot({ path: 'dice_sheet.png', fullPage: true });
  console.log('ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
