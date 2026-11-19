const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  for (const [nm, vw, vh, tw] of [['L', 800, 450, 400], ['P', 390, 800, 190]]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh } }); p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1]));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(600); await p.click('#bNew'); await p.evaluate(() => { G.muted = true; });
  let tt = 5; const pts = [0.15, 0.55, 0.9], rows = [];
  for (let guard = 0; guard < 60; guard++) { const w = await p.evaluate(() => G.cine.active ? G.cine.where() : null); if (!w) break; const idx = w.idx, fr = [];
    for (const q of pts) { tt = await p.evaluate(([q, tt, idx]) => { let n = 0; while (G.cine.active && G.cine.where().idx === idx && G.cine.where().t < G.cine.where().dur * q && n++ < 400) { tt += 0.04; G.cine.update(0.04, tt); G.gfx.updateParticles && G.gfx.updateParticles(0.04); } G.gfx.render(); return tt; }, [q, tt, idx]); await p.waitForTimeout(50); fr.push((await p.screenshot({ type: 'jpeg', quality: 72 })).toString('base64')); }
    rows.push([idx, fr]);
    tt = await p.evaluate(([tt, idx]) => { let n = 0; while (G.cine.active && G.cine.where().idx === idx && n++ < 400) { tt += 0.04; G.cine.update(0.04, tt); } return tt; }, [tt, idx]); }
  const per = nm === 'L' ? 4 : 8, cols = nm === 'L' ? 3 : 6; const pg = await b.newPage({ viewport: { width: nm === 'L' ? 1200 : 1140, height: 100 } });
  for (let k = 0, i = 0; k < rows.length; k += per, i++) { const chunk = rows.slice(k, k + per); await pg.setContent('<body style="margin:0;background:#111;color:#fff;font:11px sans-serif"><div style="display:grid;grid-template-columns:repeat(' + cols + ',' + tw + 'px)">' + chunk.map(r => r[1].map((f, j) => `<div style="position:relative"><img src="data:image/jpeg;base64,${f}" width=${tw}><span style="position:absolute;left:2px;top:2px;background:#000">${r[0]}</span></div>`).join('')).join('') + '</div></body>'); await pg.screenshot({ path: 'cine' + nm + i + '.png', fullPage: true }); }
  console.log(nm, 'shots', rows.length); await pg.close(); await p.close(); }
  console.log('ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
