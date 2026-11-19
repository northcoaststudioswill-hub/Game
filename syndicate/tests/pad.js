const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [], log = (...a) => console.log(...a);
  const p = await b.newPage({ viewport: { width: 640, height: 360 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); const gp = window.GP = { index: 0, connected: true, mapping: 'standard', id: 'test pad', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; navigator.getGamepads = () => [gp]; });
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(1500);
  const press = async (i, ms = 90) => { await p.evaluate(i => { GP.buttons[i] = { pressed: true, value: 1 }; }, i); await p.waitForTimeout(ms); await p.evaluate(i => { GP.buttons[i] = { pressed: false, value: 0 }; }, i); await p.waitForTimeout(160); };
  const stick = async (x, y, ms) => { await p.evaluate(([x, y]) => { GP.axes[0] = x; GP.axes[1] = y; }, [x, y]); await p.waitForTimeout(ms); await p.evaluate(() => { GP.axes[0] = 0; GP.axes[1] = 0; }); await p.waitForTimeout(120); };
  const S = () => p.evaluate(() => ({ scene: G.scene, open: G.ui.isOpen(), pad: !!(G.input && G.input.usingPad), focus: document.activeElement && (document.activeElement.id || document.activeElement.textContent.trim().slice(0, 24)), h2: (document.querySelector('#panel h2') || {}).textContent, talk: !!G.talk, boot: !!G.bootSkip }));
  for (let i = 0; i < 4; i++) { const s = await S(); if (!s.boot) break; await press(0); await p.waitForTimeout(300); }
  log('title', JSON.stringify(await S()));
  // title: focus should land on a button; A on New game
  await p.evaluate(() => { const n = document.getElementById('bNew'); n && n.focus(); }); await press(0); await p.waitForTimeout(600); log('after New', JSON.stringify(await S()));
  // cinematic: tap A = next shot, hold A = skip
  const w0 = await p.evaluate(() => G.cine.active ? G.cine.where().idx : -1); await press(0, 120); await p.waitForTimeout(400); const w1 = await p.evaluate(() => G.cine.active ? G.cine.where().idx : -1); log('cine tap A: shot', w0, '->', w1);
  await press(0, 1500); await p.waitForTimeout(500); log('cine hold A', JSON.stringify(await S()));
  // builder: A through whatever is focused until the hub
  for (let i = 0; i < 40; i++) { const s = await S(); if (s.scene === 'hub' && !s.open && !s.talk) break; if (s.talk) { await press(1); continue; } const big = await p.evaluate(() => { const l = [...document.querySelectorAll('#panel button')].filter(b => !b.disabled && b.offsetParent); const q = l.find(b => b.id === 'go' || b.id === 'ok') || l.find(b => b.classList.contains('big')) || l[l.length - 1]; if (q) q.focus(); return q ? (q.id || q.textContent.trim().slice(0, 20)) : null; }); await press(0); await p.waitForTimeout(250); if (i < 12) log('  builder step', i, big, JSON.stringify(await S()).slice(0, 110)); }
  log('hub', JSON.stringify(await S()));
  // menu navigation by d-pad inside the sheet
  await press(3); await p.waitForTimeout(300); const f0 = (await S()).focus; await press(13); await press(13); const f1 = (await S()).focus; await press(15); const f2 = (await S()).focus; log('sheet (Y) open:', (await S()).h2, '| focus', f0, '->', f1, '->', f2); await press(1); await p.waitForTimeout(250); log('B closes:', JSON.stringify(await S()).slice(0, 80));
  // walk with the stick
  const p0 = await p.evaluate(() => [G.world.walker.x, G.world.walker.z]); await stick(1, 0, 900); const p1 = await p.evaluate(() => [G.world.walker.x, G.world.walker.z]); log('stick walk dx,dz', (p1[0] - p0[0]).toFixed(2), (p1[1] - p0[1]).toFixed(2));
  // into a bout
  await p.evaluate(() => { const st = G.state; st.toured = 1; st.tourAsked = 1; st.kitPicked = 1; G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.pit(); }); await p.waitForTimeout(300);
  for (let i = 0; i < 8; i++) { const s = await S(); if (s.scene === 'fight' && !s.open) break; await p.evaluate(() => { const q = document.querySelector('[data-under]') || document.querySelector('#panel #go, #panel .big'); q && q.focus(); }); await press(0); await p.waitForTimeout(350); }
  await p.waitForFunction(() => G.fight.inFight && G.fight.inFight(), null, { timeout: 90000 }); log('in fight', JSON.stringify(await S()).slice(0, 80));
  const F = () => p.evaluate(() => ({ x: Math.round(G.fight.P.x), y: Math.round(G.fight.P.y), st: G.fight.P.state, act: G.fight.P.act ? G.fight.P.act.id : '', paused: !!G.fight.paused, sta: Math.round(G.fight.P.sta || G.fight.P.stamina || 0) }));
  await p.evaluate(() => { G.fight.E.hp = G.fight.E.maxHp = 9000; G.fight.P.hp = G.fight.P.maxHp = 9000; });
  const a = await F(); await stick(-1, 0, 700); const c = await F(); log('fight stick move', a.x, a.y, '->', c.x, c.y);
  const seen = {}; const watch = async (lbl, fn) => { await p.evaluate(() => { window._st = {}; window._iv = setInterval(() => { const P = G.fight.P; _st[P.state + (P.act ? ':' + P.act.id : '') + (P.guard > 0 ? '+guard' : '')] = 1; }, 16); }); await fn(); await p.waitForTimeout(700); log(lbl, await p.evaluate(() => { clearInterval(_iv); return Object.keys(_st).join(' | '); })); };
  await watch('X strike   ', () => press(2)); await watch('A dodge    ', () => press(0)); await watch('LT parry   ', () => press(6)); await watch('LB ability ', () => press(4)); await watch('RB ability ', () => press(5)); await watch('Y ability  ', () => press(3)); await watch('X hold heavy', () => press(2, 700));
  await press(9); await p.waitForTimeout(300); log('Menu pauses:', JSON.stringify(await F()).slice(-20), (await S()).h2); await press(1); await p.waitForTimeout(300); log('B resumes: paused', (await F()).paused, 'open', (await S()).open);
  await p.screenshot({ path: 'pad.png' }); log('ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
