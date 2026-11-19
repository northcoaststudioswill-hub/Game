const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  for (const [nm, vw, vh, tw, kinds] of [['L', 800, 450, 400, ['vessel', 'ash', 'free', 'alone']], ['P', 390, 800, 190, ['vessel', 'alone']]]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh } }); p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1]));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(500);
  await p.click('#bNew'); await p.click('.c-skip'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
  const fr = [];
  for (const k of kinds) { await p.evaluate(k => { G.muted = true; const st = G.state; st.toured = 1; st.tourAsked = 1; st.kitPicked = 1; st.loanM = k === 'ash' ? 120 : 0; st.gardens = k === 'alone' ? 2 : 0; st.fallen = [{ n: 'A' }, { n: 'B' }, { n: 'C' }]; G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); window._done = 0; G.finale.play(k, () => { window._done = 1; }); }, k);
    for (let guard = 0; guard < 12; guard++) { const w = await p.evaluate(() => { const w = G.finale.where(); for (let i = 0; i < 150; i++) { const o = Date.now; G.finale.step && G.finale.step(); } return w; }); if (w.card) break;
      await p.evaluate(() => { const t = performance.now; let off = 0; performance.now = () => t.call(performance) + off; off = 6000; for (let i = 0; i < 80; i++) G.finale.step(); G.gfx.render(); performance.now = t; }); await p.waitForTimeout(60);
      if (!(nm === 'L' && k !== 'vessel' && guard > 2 && guard < 7 && k !== 'ash')) fr.push([(await p.screenshot({ type: 'jpeg', quality: 72 })).toString('base64'), k + ' ' + w.shot]);
      await p.evaluate(() => { G.finale.next(); G.finale.next(); }); }
    await p.waitForTimeout(1500); fr.push([(await p.screenshot({ type: 'jpeg', quality: 72 })).toString('base64'), k + ' card']); await p.waitForTimeout(200); await p.evaluate(() => G.finale.next()); await p.waitForTimeout(100); console.log(nm, k, 'done', await p.evaluate(() => [window._done, G.finale.on, !!G.gfx.cine].join(' '))); }
  const cols = nm === 'L' ? 3 : 6, pg = await b.newPage({ viewport: { width: cols * tw, height: 100 } });
  for (let q = 0, n = 0; q < fr.length; q += 12, n++) { await pg.setContent('<body style="margin:0;background:#111;color:#fff;font:11px sans-serif"><div style="display:grid;grid-template-columns:repeat(' + cols + ',' + tw + 'px)">' + fr.slice(q, q + 12).map(f => `<div style="position:relative"><img src="data:image/jpeg;base64,${f[0]}" width=${tw}><span style="position:absolute;left:2px;top:2px;background:#000">${f[1]}</span></div>`).join('') + '</div></body>'); await pg.screenshot({ path: 'fin' + nm + n + '.png', fullPage: true }); }
  await pg.close(); await p.close(); }
  console.log('ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
