// Loads the built game, checks for errors, and screenshots every story screen and place.
// Usage: node starhaven/game/tests/smoke.js [outDir]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const file = path.resolve(__dirname, '..', 'starhaven.html');
  const out = process.argv[2] || path.resolve(__dirname, '..', 'shots');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const errors = [];

  async function open(opts) {
    const page = await browser.newPage(opts);
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|fonts\.g/.test(m.text())) errors.push(m.text()); });
    await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await page.goto('file://' + file);
    await page.waitForTimeout(300);
    return page;
  }
  const snap = (page, name) => page.screenshot({ path: path.join(out, name) });

  // A landscape phone (the main target), touch controls on.
  const phone = await open({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  await snap(phone, '01-title.png');
  await phone.click('#t-new'); await phone.waitForTimeout(300);
  await snap(phone, '04-chapter-card.png');
  await phone.click('#c-go'); await phone.waitForTimeout(200);
  // first line of dialogue starts on the first frame of play
  await phone.evaluate(() => { SH.game.frozen = true; SH.input.forced = { held: {}, pressed: {} }; SH.test.step(2, {}); SH.test.render(); });
  await snap(phone, '05-dialogue-woods.png');
  await phone.evaluate(() => { SH.test.load(1); SH.test.step(2, {}); SH.test.render(); });
  await snap(phone, '05b-dialogue-queen.png');
  await phone.evaluate(() => { SH.test.step(120, {}, null, true); SH.test.step(30, { right: true }); SH.test.render(); });
  await snap(phone, '06-deep-hint.png');
  await phone.evaluate(() => { SH.test.place(98, 16); SH.game.world.wyrm.on = true; SH.game.world.wyrm.x = 88 * SH.TILE; SH.test.step(20, { right: true }); SH.test.render(); });
  await snap(phone, '07-deep-wyrm-chase.png');

  // Chapter 1: Caelum, the dark street, the mural, the lit street
  await phone.evaluate(() => { SH.test.load(2); SH.test.step(2, {}); SH.test.render(); });
  await snap(phone, '08-ashes-caelum.png');
  await phone.evaluate(() => { SH.test.step(200, { right: true }, null, true); SH.test.place(66, 16); SH.test.step(60, { right: true }, null, true); SH.test.render(); });
  await snap(phone, '09-ashes-dark-street.png');
  await phone.evaluate(() => { SH.test.place(72, 16); SH.test.step(40, { up: true }, null, true); SH.test.render(); });
  await snap(phone, '10-ashes-painting.png');
  await phone.evaluate(() => { SH.test.step(50, { up: true }); SH.test.step(400, {}, null, true); SH.test.place(70, 16); SH.test.step(150, {}, null, true); SH.test.render(); });
  await snap(phone, '11-ashes-lit-street.png');
  await phone.evaluate(() => { SH.game.pause(); });
  await phone.click('#m-journal'); await phone.waitForTimeout(200);
  await snap(phone, '12-journal.png');
  await phone.click('#j-back');

  // Chapter 2: Bram, the Training Ring, the Thornwood
  await phone.evaluate(() => { SH.test.load(3); SH.test.step(2, {}); SH.test.render(); });
  await snap(phone, '13-ring-bram.png');
  await phone.evaluate(() => { SH.test.step(200, {}, null, true); SH.test.place(19, 16); SH.test.step(3, {}, ['attack']); SH.test.render(); });
  await snap(phone, '14-ring-dummy.png');
  await phone.evaluate(() => { SH.game.flags.combo = true; SH.game.flags.pit = true; SH.game.world.gates.forEach(g => SH.game.world.room.setGate(g, false)); SH.test.place(61, 16); SH.test.step(30, { right: true }); SH.test.render(); });
  await snap(phone, '15-ring-iris-gate.png');
  await phone.evaluate(() => { SH.test.place(76, 16); SH.test.step(20, { right: true }); SH.test.render(); });
  await snap(phone, '16-thornwood-sprites.png');

  console.log(JSON.stringify({ errors }, null, 1));
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
