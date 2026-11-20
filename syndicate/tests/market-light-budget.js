// walks the Lamp Market and checks the light budget: never more than seven live point lights, and no shader rebuilt on the way
const { chromium } = require('playwright'); const SP = '';
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 1100, height: 700 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(900); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); G.muted = true; }); await p.waitForTimeout(400);
  await p.click('#bNew'); await p.click('.c-skip'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
  await p.evaluate(() => { const st = G.state; st.toured = 1; st.tourAsked = 1; st.kitPicked = 1; st.firstPath = 9; st.respect = 3000; G.guideOff = 1; st.wins = { a: 3 }; st.shownPlaces = { a: 1 }; st.seen = { wisp: 1 }; G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); G.world.enter('hub'); G.ui.close(); document.querySelectorAll('#veil').forEach(v => v.remove()); });
  const at = (x, z, n) => p.evaluate(([x, z, n]) => { const h = G.world.get('hub'), w = G.world.walker; w.x = x; w.z = z; w.target = null; w.path = null; let progs = new Set(), maxOn = 0;
    for (let i = 0; i < n; i++) { for (let k = 0; k < 30 && G.talk; k++) G.talkApi.skip(); if (G.ui.isOpen()) G.ui.close(); if (!G.dicing) G.gfx.cine = null; window._T = (window._T || 10) + 1 / 30; G.world.updateWalk(1 / 30, window._T, false); h.update(window._T, 1 / 30); G.gfx.render(); }
    let vis = 0, lit = 0; h.scene.traverse(o => { if (o.isPointLight) { let v = true, q = o; while (q) { if (!q.visible) v = false; q = q.parent; } if (v) { vis++; if (o.intensity > 0.01) lit++; } } });
    return { vis, lit, programs: G.gfx.renderer.info.programs.length, src: h.lightBudget.src.length }; }, [x, z, n]);
  const out = []; for (const q of [[13.5, 4.5], [5, 2], [20, 8], [28.5, 6.4], [9, 14], [-1, 12], [28.5, 6.4]]) out.push(await at(q[0], q[1], 40));
  console.log(out.map(o => JSON.stringify(o)).join('\n')); const ok = out.every(o => o.vis <= 7 && o.lit >= 4 && o.programs === out[1].programs) && out[0].src >= 15; await p.screenshot({ path: SP + 'table_idle.png' });
  await at(13.5, 6, 40); await p.screenshot({ path: SP + 'market_mid.png' });
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
