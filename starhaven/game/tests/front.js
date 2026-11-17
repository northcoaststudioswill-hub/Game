// Boot, menus and saves, driven the way a player would: a simulated Bluetooth controller, then touch.
// Usage: node starhaven/game/tests/front.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const file = path.resolve(__dirname, '..', 'starhaven.html');
  const browser = await chromium.launch();
  const out = [];
  const check = (name, ok, info) => out.push({ name, ok: !!ok, info });
  const errors = [];

  // ---- a phone with a controller paired, never touched
  const page = await browser.newPage({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
  page.on('pageerror', e => errors.push(String(e)));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.addInitScript(() => {
    try { localStorage.clear(); } catch (e) { }
    window.__pad = { id: 'Xbox Wireless Controller', connected: true, axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) };
    navigator.getGamepads = () => [window.__pad];
  });
  await page.goto('file://' + file);
  await page.waitForTimeout(300);
  const press = async (i, hold) => { await page.evaluate(i => { __pad.buttons[i].pressed = true; }, i); await page.waitForTimeout(hold || 90); await page.evaluate(i => { __pad.buttons[i].pressed = false; }, i); await page.waitForTimeout(110); };
  const A = 0, B = 1, DOWN = 13;
  const st = () => page.evaluate(() => ({
    state: SH.game.state, splash: document.getElementById('splash').className,
    press: document.getElementById('f-press').classList.contains('show'),
    menu: [...document.querySelectorAll('#f-menu .fbtn')].map(b => b.querySelector('.lbl').textContent + (b.classList.contains('sel') ? '*' : '')),
    title: document.getElementById('f-title').textContent, chapter: SH.game.chapter, slot: SH.game.slot,
  }));

  let s = await st();
  check('Boot: opens on the North Coast Studios splash', s.state === 'front' && /ncs/.test(s.splash), s);
  await page.waitForTimeout(2700);
  s = await st();
  check('Boot: then the E Concepts splash', /econ/.test(s.splash), s);
  await press(A);                                     // skip it
  s = await st();
  check('Boot: then "Press any button" (a controller button works, no touch needed)', s.press, s);
  await press(A);
  s = await st();
  check('Main menu: New game is selected, no Continue yet', s.menu[0] === 'New game*' && !s.menu.some(m => m.startsWith('Continue')), s.menu);
  await press(A);                                     // New game -> slots
  s = await st();
  check('New game: pick a slot', /slot/i.test(s.title) && s.menu.length === 4, s);
  await press(A);                                     // slot 1
  await page.waitForTimeout(200);
  s = await st();
  const slots1 = await page.evaluate(() => SH.saves.all());
  check('New game in slot 1: the first chapter card is up and slot 1 is saved', s.state === 'card' && s.slot === 0 && slots1[0] && slots1[0].chapter === 0, { state: s.state, slot0: slots1[0] && slots1[0].chapter });
  await press(A);                                     // Begin
  await page.waitForTimeout(200);
  s = await st();
  check('Controller: A on the chapter card starts play (first dialogue)', s.state === 'talk', s.state);

  // ---- progress, quit, Continue
  await page.evaluate(() => {
    SH.game.progress.bonds = { caelum: { pts: 50 } };
    SH.game.startChapter(2);                         // as if the player got to Chapter 1
    SH.game.hud.cardGo();
  });
  await page.evaluate(() => { SH.game.script = null; SH.game.hud.dialog(null); SH.game.hud.sceneArt(null); SH.game.state = 'play'; SH.game.pause(); });
  await page.click('#m-title');
  await page.waitForTimeout(150);
  s = await st();
  check('Quit to title: back on the main menu with Continue on top', s.state === 'front' && s.menu[0] === 'Continue*', s.menu);
  await press(A);
  await page.waitForTimeout(200);
  s = await st();
  check('Continue: resumes slot 1 at Chapter 1 with Caelum\'s bond kept', s.chapter === 2 && s.state === 'card' && (await page.evaluate(() => SH.game.progress.bonds.caelum.pts)) === 50, s);

  // ---- quitting during an evening replays the evening first
  await page.evaluate(() => {
    SH.game.hud.cardGo(); SH.game.completeChapter();   // Chapter 1 done -> evening 1 pending
    SH.game.hud.cardGo();                              // the evening starts...
    SH.game.state = 'play'; SH.game.script = null; SH.game.hud.dialog(null); SH.game.hud.sceneArt(null); SH.game.choosing = null; SH.game.hud.choice(null);
    SH.front.toTitle();                                // ...and the player quits
  });
  const mid = await page.evaluate(() => SH.saves.all()[0]);
  await page.evaluate(() => SH.front.go(() => SH.game.loadSlot(0)));
  await page.waitForTimeout(150);
  const ev = await page.evaluate(() => ({ script: SH.game.script && SH.game.script.id, state: SH.game.state }));
  check('Quit mid-evening: loading replays the evening, then goes on to Chapter 2', mid.chapter === 3 && mid.pending === 'evening1' && ev.script === 'evening1', { saved: { chapter: mid.chapter, pending: mid.pending }, ev });
  await page.evaluate(() => { for (let i = 0; i < 400 && SH.game.state === 'talk'; i++) { if (SH.game.choosing) SH.game.pick(0); else { SH.game.hud.finishTyping(); SH.game.advance(); } } });
  const after = await page.evaluate(() => ({ chapter: SH.game.chapter, state: SH.game.state, slot: SH.saves.all()[0] }));
  check('...and after the evening, Chapter 2 starts and the save moves on', after.chapter === 3 && after.state === 'card' && after.slot.chapter === 3 && !after.slot.pending, { chapter: after.chapter, state: after.state, saved: after.slot.chapter, pending: after.slot.pending });

  // ---- controller in the pause menu
  await page.evaluate(() => { SH.game.hud.cardGo(); SH.game.script = null; SH.game.hud.dialog(null); SH.game.hud.sceneArt(null); SH.game.choosing = null; SH.game.hud.choice(null); (SH.game.world.room.def.triggers || []).forEach((t, i) => (SH.game.world.fired[i] = true)); SH.game.state = 'play'; });
  await press(9);                                     // Start
  const paused = await page.evaluate(() => SH.game.state);
  await press(DOWN); await press(A);                  // Resume -> Story & goals
  const journal = await page.evaluate(() => document.getElementById('journal').classList.contains('show'));
  await press(B);
  const back = await page.evaluate(() => SH.game.state);
  check('Controller in game: Start pauses, D-pad + A opens Story & goals, B returns to play', paused === 'pause' && journal && back === 'play', { paused, journal, back });

  // ---- touch: settings and erase
  await page.evaluate(() => SH.front.toTitle());
  await page.waitForTimeout(100);
  const items = await page.$$eval('#f-menu .fbtn .lbl', els => els.map(e => e.textContent));
  await page.locator('#f-menu .fbtn').nth(items.indexOf('Settings')).tap();
  await page.waitForTimeout(100);
  s = await st();
  check('Settings (touch): sound, music, text speed, touch down-strike, screen shake, tune, back', s.menu.length === 7 && /Settings/.test(s.title), s.menu);
  await page.locator('#f-menu .fbtn').nth(2).tap();     // text speed: normal -> fast
  const speed = await page.evaluate(() => [SH.settings.textSpeed, JSON.parse(localStorage.getItem('starhaven.settings.v1')).textSpeed]);
  check('Settings: a change applies and is remembered', speed[0] === 'fast' && speed[1] === 'fast', speed);
  await press(B);
  s = await st();
  check('Controller B: goes back to the main menu', s.menu.some(m => m.startsWith('New game')), s.menu);
  await page.evaluate(() => SH.front.slots('load'));
  const loadMenu = (await st()).menu;
  const eraseIdx = loadMenu.findIndex(m => m.startsWith('Erase slot 1'));
  await page.evaluate(i => { SH.front.choose(i); }, eraseIdx);
  await page.evaluate(() => SH.front.choose(0));          // "Yes"
  const erased = await page.evaluate(() => SH.saves.all()[0]);
  check('Load game: erase a slot (with a confirm)', eraseIdx >= 0 && erased === null, { loadMenu, erased });

  await browser.close();
  let fails = 0;
  for (const r of out) { if (!r.ok) fails++; console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  ${JSON.stringify(r.info)}`); }
  if (errors.length) { console.log('PAGE ERRORS', errors); fails++; }
  console.log(`\n${out.length - fails}/${out.length} passed`);
  process.exit(fails ? 1 : 0);
})();
