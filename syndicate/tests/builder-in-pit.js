const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  for (const [nm, vp] of [['pc', { width: 1280, height: 720 }], ['phone', { width: 390, height: 844 }]]) {
    const p = await b.newPage({ viewport: vp }); p.on('pageerror', e => errs.push(nm + ': ' + e.message + (e.stack || '').split('\n')[1]));
    await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1500); await p.evaluate(() => { G.bootSkip && G.bootSkip(); G.bootSkip && G.bootSkip(); G.muted = true; }); await p.waitForTimeout(800);
    await p.evaluate(() => document.getElementById('bNew').click()); await p.waitForTimeout(600); await p.evaluate(() => G.cine.skip()); await p.waitForTimeout(2500); await p.screenshot({ path: 'bld_' + nm + '_1.png' });
    await p.evaluate(() => document.querySelector('[data-cls=rogue]').click()); await p.waitForTimeout(600); await p.screenshot({ path: 'bld_' + nm + '_2swing.png' }); await p.waitForTimeout(2500);
    await p.evaluate(() => { document.querySelector('[data-step="1"]').click(); }); await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('[data-race=tiefling]').click()); await p.waitForTimeout(2200); await p.screenshot({ path: 'bld_' + nm + '_3.png' });
    await p.evaluate(() => { document.querySelector('[data-step="5"]').click(); }); await p.waitForTimeout(300); await p.evaluate(() => { const b = document.querySelectorAll('[data-arm]'); b[b.length - 1].click(); }); await p.waitForTimeout(2600); await p.screenshot({ path: 'bld_' + nm + '_4.png' });
    await p.evaluate(() => { const o = G.state.opt = G.state.opt || {}; o.uiz = 1.3; G.applyOpts(); }); await p.waitForTimeout(400); await p.screenshot({ path: 'bld_' + nm + '_5zoom.png' }); await p.close(); }
  const pg = await b.newPage({ viewport: { width: 1600, height: 100 } }); const fs = require('fs');
  const imgs = ['pc_1', 'pc_2swing', 'pc_3', 'pc_4', 'pc_5zoom'].map(k => `<img src="data:image/png;base64,${fs.readFileSync('bld_' + k + '.png').toString('base64')}" width=520>`).join('') + '<br>' + ['phone_1', 'phone_3', 'phone_4', 'phone_5zoom'].map(k => `<img src="data:image/png;base64,${fs.readFileSync('bld_' + k + '.png').toString('base64')}" width=240>`).join('');
  await pg.setContent('<body style="margin:0;background:#111">' + imgs + '</body>'); await pg.screenshot({ path: 'bld_sheet.png', fullPage: true });
  console.log('ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
