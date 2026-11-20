const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [], log = (...a) => console.log(...a);
  const p = await b.newPage({ viewport: { width: 900, height: 520 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); const gp = window.GP = { index: 0, connected: true, mapping: 'standard', id: 'test pad', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; navigator.getGamepads = () => [gp]; });
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1500);
  const press = async (i, ms = 120) => { await p.evaluate(i => { GP.buttons[i] = { pressed: true, value: 1 }; }, i); await p.waitForTimeout(ms); await p.evaluate(i => { GP.buttons[i] = { pressed: false, value: 0 }; }, i); await p.waitForTimeout(260); };
  for (let i = 0; i < 4; i++) { if (!(await p.evaluate(() => !!G.bootSkip))) break; await press(0); await p.waitForTimeout(300); }
  await p.evaluate(() => { document.getElementById('bNew').click(); }); await p.waitForTimeout(500); await p.evaluate(() => { G.cine.skip(); }); await p.waitForTimeout(300);
  await p.evaluate(() => { document.querySelector('#go').click(); document.querySelector('#ok').click(); const st = G.state; st.toured = 1; st.tourAsked = 1; st.kitPicked = 1; G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); }); await p.waitForTimeout(400);
  const S = () => p.evaluate(() => ({ talk: !!G.talk, under: !!(G.talk && document.querySelector('#talk.under')), open: G.ui.isOpen(), h2: (document.querySelector('#panel h2') || {}).textContent, line: G.talk ? G.talk.i : -1, choosing: !!(G.talk && G.talkApi.choosing()), sel: (document.querySelector('#talk .tk-choices .sel') || {}).textContent, res: window._res }));
  // 1: a conversation with a choice, driven by the pad
  await p.evaluate(() => { const w = G.world.walker; window._res = ''; G.playScene({ place: 'hub', npc: [w.x + 2.5, w.z], you: [w.x, w.z], lines: [{ who: 'npc', name: 'Ferren Voss', text: 'One.' }, { who: 'npc', name: 'Ferren Voss', text: 'Two. Unless you would rather not find out.' }], choices: [{ label: 'Find out', go: () => { window._res = 'find'; } }, { label: 'Not tonight', go: () => { window._res = 'not'; } }], done: () => { window._res = 'done'; } }); });
  await p.waitForTimeout(400);
  // 2: a card opens over it (as in the screenshots)
  await p.evaluate(() => G.ui.sheet()); await p.waitForTimeout(400); log('card over talk  ', JSON.stringify(await S()));
  await press(0); await press(13); log('pad on the card ', JSON.stringify(await S()), '| focus:', await p.evaluate(() => document.activeElement && document.activeElement.textContent.trim().slice(0, 20)));
  await press(1); await press(1); await p.waitForTimeout(300); log('B closes card   ', JSON.stringify(await S()));
  for (let i = 0; i < 6; i++) { const s = await S(); if (s.choosing) break; await press(0); }
  log('at the choice   ', JSON.stringify(await S())); await press(15); log('d-pad right     ', JSON.stringify(await S())); await press(14); log('d-pad left      ', JSON.stringify(await S())); await press(15); await press(0); await p.waitForTimeout(300); log('A takes it      ', JSON.stringify(await S()));
  // 3: keyboard on a choice
  await p.evaluate(() => { const w = G.world.walker; window._res = ''; G.playScene({ place: 'hub', npc: [w.x + 2.5, w.z], you: [w.x, w.z], lines: [{ who: 'npc', name: 'X', text: 'Pick.' }], choices: [{ label: 'A', go: () => { window._res = 'A'; } }, { label: 'B', go: () => { window._res = 'B'; } }] }); }); await p.waitForTimeout(300);
  await p.keyboard.press('Space'); await p.waitForTimeout(150); await p.keyboard.press('Space'); await p.waitForTimeout(150); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(100); await p.keyboard.press('Enter'); await p.waitForTimeout(300); log('keyboard choice ', JSON.stringify(await S()));
  log('ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
