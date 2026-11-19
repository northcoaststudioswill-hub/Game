// Dev helper: opens the built game, runs a small script of steps, saves screenshots.
//   node tests/shot.js <outDir> [w] [h]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2] || 'playtest', w = +process.argv[3] || 1280, h = +process.argv[4] || 640;
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  await page.waitForTimeout(1500);
  const steps = require(path.resolve(process.argv[5] || path.join(__dirname, 'steps_title.js')));
  await steps(page, async name => { await page.screenshot({ path: path.join(out, name + '.png') }); console.log('shot', name); });
  console.log(errs.length ? 'ERRORS:\n' + errs.slice(0, 12).join('\n') : 'no console errors');
  await browser.close();
})();
