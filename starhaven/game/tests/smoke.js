// Loads the built game, checks for errors, and takes screenshots.
// Usage: node starhaven/game/tests/smoke.js [outDir]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const file = path.resolve(__dirname, '..', 'starhaven.html');
  const out = process.argv[2] || path.resolve(__dirname, '..', 'shots');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|fonts\.g/.test(m.text())) errors.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto('file://' + file);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, '01-title.png') });

  await page.evaluate(() => SH.test.freeze());
  const shot = async (name) => { await page.evaluate(() => SH.test.render()); await page.screenshot({ path: path.join(out, name) }); };
  // walk right a bit
  await page.evaluate(() => SH.test.step(40, { right: true }));
  await shot('02-start.png');
  // the sprites arena
  await page.evaluate(() => { SH.test.place(158, 16); SH.test.step(30, { right: true }); });
  await shot('03-sprites.png');
  // pogo section, mid jump
  await page.evaluate(() => { SH.test.place(126, 16); SH.test.step(10, { right: true }, ['jump']); SH.test.step(6, { right: true, jump: true }); });
  await shot('04-pogo.png');
  // dagger combo on the dummy
  await page.evaluate(() => { SH.test.place(103, 16); SH.test.step(1, {}); SH.test.step(3, {}, ['attack']); });
  await shot('05-attack.png');
  // A landscape phone with touch controls, standing at a sign
  const phone = await browser.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  phone.on('pageerror', e => errors.push(String(e)));
  await phone.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await phone.goto('file://' + file);
  await phone.waitForTimeout(300);
  await phone.screenshot({ path: path.join(out, '06-phone-title.png') });
  await phone.evaluate(() => { SH.test.freeze(); SH.test.place(62.6, 16); SH.test.step(4, {}); SH.test.render(); });
  await phone.screenshot({ path: path.join(out, '07-phone-sign.png') });
  await phone.evaluate(() => { SH.test.place(64, 16); SH.test.step(2, { right: true }); SH.test.step(4, { right: true, jump: true }, ['jump']); SH.test.step(16, { right: true, jump: true }); SH.test.step(3, { right: true, jump: true }, ['dash']); SH.test.render(); });
  await phone.screenshot({ path: path.join(out, '08-phone-dash.png') });
  console.log(JSON.stringify({ errors }, null, 1));
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
