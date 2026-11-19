const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 800, height: 450 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(600); await p.click('#bNew');
  const r = await p.evaluate(() => { G.muted = true; let tt = 5, n = 0, total = 0; while (G.cine.active && G.cine.where().idx < 18 && n++ < 5000) { tt += 0.04; total += 0.04; G.cine.update(0.04, tt); } const inG = G.world.get('arena').inGarden(); const at = G.cine.where().idx; G.cine.skip(); return { at, inGardenDuring: inG, inGardenAfter: G.world.get('arena').inGarden(), secondsToDavid: Math.round(total), ex: !!G.fight.ex, scene: G.scene }; });
  console.log(JSON.stringify(r));
  const full = await p.evaluate(() => { G.cine.play(() => { window._done = 1; }); let tt = 50, n = 0, total = 0; while (G.cine.active && n++ < 9000) { tt += 0.04; total += 0.04; G.cine.update(0.04, tt); } return { done: window._done, seconds: Math.round(total), inGarden: G.world.get('arena').inGarden() }; });
  console.log(JSON.stringify(full), 'ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
