const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const mob of [false, true]) { const ctx = await b.newContext(mob ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 720 } }); const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
    await p.goto('http://localhost:8765/index.html'); for (let i = 0; i < 20; i++) { await p.waitForTimeout(400); const ok = await p.evaluate(() => { if (window.G && G.bootSkip) G.bootSkip(); if (window.G && G.bootSkip) G.bootSkip(); return !!document.querySelector('#panel .title-wrap'); }); if (ok) break; } await p.waitForTimeout(600);
    const box = await (await p.$('#panel .logo')).boundingBox(), x = box.x + box.width / 2, y = box.y + box.height / 2, t0 = Date.now(), ts = [];
    for (let i = 0; i < 5; i++) { if (mob) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); ts.push(Date.now() - t0); await p.waitForTimeout(120); }
    await p.waitForTimeout(500); console.log(mob ? 'touch' : 'mouse', 'tap times ms', ts.join(','), '→', await p.evaluate(() => (document.querySelector('#panel h2') || {}).textContent + ' | button after: ' + localStorage.getItem('guttercrown_guests')));
    await p.evaluate(() => G.ui.title()); await p.waitForTimeout(900); console.log('  title button present:', await p.evaluate(() => !!document.getElementById('bGuests'))); await ctx.close(); }
  await b.close(); })();
