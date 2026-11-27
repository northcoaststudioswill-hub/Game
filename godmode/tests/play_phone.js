/* Browser run of the built game at phone size (and a wide one): boots, starts a world,
   uses every power through real pointer input, checks state, and takes screenshots.
   node godmode/tests/play_phone.js [outDir]                                         */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const file = 'file://' + path.resolve(__dirname, '../index.html');
const out = process.argv[2] || path.join(require('os').tmpdir(), 'godmode-playtest');
fs.mkdirSync(out, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) failures++; };

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(file);
  await sleep(1500);
  await page.screenshot({ path: path.join(out, '01-title.png') });
  check(await page.evaluate(() => !document.getElementById('title').hidden), 'title screen shows');
  await page.tap('#btnNew');
  await sleep(400);
  check(await page.evaluate(() => APP.dlgOpen && /ENDLESS/.test(document.getElementById('dlgText').textContent)), 'a new world asks: endless or with a goal');
  await page.screenshot({ path: path.join(out, '01b-mode.png') });
  await page.tap('#dlgBtns button:nth-child(2)');
  await sleep(1200);
  check(await page.evaluate(() => APP.mode === 'play' && APP.S.citizens.length === 6 && APP.S.goal === true), 'new world starts with six citizens, aiming for the Spire');
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), 'page does not scroll');
  await page.screenshot({ path: path.join(out, '02-start.png') });

  // helpers that find things on screen the way a player would
  const citizenAt = i => page.evaluate(i => { const c = APP.S.citizens[i]; const o = R.cit.get(c.id); const p = toScreen(o.x, o.g.position.y + 0.75, o.z, { x: 0, y: 0 }); return { id: c.id, x: p.x, y: p.y }; }, i);
  const worldAt = (x, z) => page.evaluate(([x, z]) => { const p = toScreen(x, groundY(APP.S.world, x, z), z, { x: 0, y: 0 }); return { x: p.x, y: p.y }; }, [x, z]);
  const visibleCitizen = async () => {
    for (let i = 0; i < 6; i++) { const c = await citizenAt(i); if (c.x > 30 && c.x < 360 && c.y > 200 && c.y < 560) return c; }
    return citizenAt(0);
  };

  // drag to orbit
  const yaw0 = await page.evaluate(() => R.cam.yaw);
  await page.mouse.move(200, 400); await page.mouse.down(); await page.mouse.move(120, 410, { steps: 6 }); await page.mouse.up();
  check(await page.evaluate(y => Math.abs(R.cam.yaw - y) > 0.2, yaw0), 'drag orbits the camera');
  // wheel zoom
  const d0 = await page.evaluate(() => R.cam.dist);
  await page.mouse.wheel(0, -300);
  check(await page.evaluate(d => R.cam.dist < d, d0), 'scroll zooms');
  await sleep(300);

  // two real touch points through CDP: pinch zoom, two-finger pan, and no stray tap afterwards
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i + 1, radiusX: 4, radiusY: 4, force: 1 })) });
  const twoFinger = async (from, to, steps = 8) => {
    await touch('touchStart', from);
    for (let s = 1; s <= steps; s++) {
      const k = s / steps;
      await touch('touchMove', from.map((p, i) => [p[0] + (to[i][0] - p[0]) * k, p[1] + (to[i][1] - p[1]) * k]));
      await sleep(16);
    }
    // lift one finger, nudge the other, then lift it: neither may count as a tap
    await touch('touchEnd', [to[1]]);
    await touch('touchMove', [[to[1][0] + 2, to[1][1] + 2]]);
    await touch('touchEnd', []);
    await sleep(100);
  };
  const cam = () => page.evaluate(() => ({ d: R.cam.dist, tx: R.cam.tx, tz: R.cam.tz, sel: APP.S.selected, ev: APP.S.stats.bless }));
  await page.evaluate(() => setPower('bless'));  // armed, so a stray tap would show up as a blessing
  let k0 = await cam();
  await twoFinger([[170, 420], [220, 420]], [[110, 420], [280, 420]]);
  let k1 = await cam();
  check(k1.d < k0.d * 0.6, `pinch out zooms in (${k0.d.toFixed(1)} -> ${k1.d.toFixed(1)})`);
  await twoFinger([[150, 420], [240, 420]], [[180, 420], [210, 420]]);
  let k2 = await cam();
  check(k2.d > k1.d * 1.8, `pinch in zooms out (${k1.d.toFixed(1)} -> ${k2.d.toFixed(1)})`);
  await twoFinger([[160, 380], [230, 380]], [[160, 520], [230, 520]]);
  let k3 = await cam();
  check(Math.abs(k3.d - k2.d) < 0.5 && Math.hypot(k3.tx - k2.tx, k3.tz - k2.tz) > 1, 'two-finger drag pans without zooming');
  check(k3.sel === k0.sel && k3.ev === k0.ev, 'lifting fingers after a pinch is not a tap');
  await page.evaluate(k => { R.cam.tx = k.tx; R.cam.tz = k.tz; R.cam.dist = k.d; setPower('observe'); }, k0);
  await sleep(200);

  // observe
  let c = await visibleCitizen();
  await page.touchscreen.tap(c.x, c.y);
  await sleep(500);
  check(await page.evaluate(() => APP.S.selected > 0 && !document.getElementById('inspect').hidden), 'tap selects a citizen and opens the inspector');
  await page.screenshot({ path: path.join(out, '03-observe.png') });
  await page.tap('#inClose');

  // bless
  await page.tap('#pw button[data-p=bless]');
  await sleep(200);
  c = await visibleCitizen();
  await page.touchscreen.tap(c.x, c.y);
  await sleep(350);
  check(await page.evaluate(() => APP.S.stats.bless === 1), 'bless fires');
  await page.screenshot({ path: path.join(out, '04-bless.png') });

  // intervene: drag a citizen
  await page.tap('#pw button[data-p=intervene]');
  await sleep(1800);
  c = await visibleCitizen();
  await page.mouse.move(c.x, c.y); await page.mouse.down(); await page.mouse.move(c.x + 40, c.y - 60, { steps: 5 });
  await sleep(250);
  check(await page.evaluate(() => APP.S.held > 0), 'intervene picks a citizen up');
  await page.screenshot({ path: path.join(out, '05-intervene.png') });
  await page.mouse.up();
  await sleep(200);
  check(await page.evaluate(() => APP.S.held === 0 && APP.S.stats.intervene === 1), 'and sets them down');

  // create a grove
  await page.tap('#pw button[data-p=create]');
  await sleep(250);
  await page.screenshot({ path: path.join(out, '06-create.png') });
  const nodes0 = await page.evaluate(() => APP.S.world.nodes.length);
  let made = false;
  for (const [x, z] of [[5, 2], [-5, 3], [3, -6], [-4, -5], [6, 6]]) {
    const p = await worldAt(x, z);
    if (p.y < 170 || p.y > 600) continue;
    await page.touchscreen.tap(p.x, p.y); await sleep(250);
    if (await page.evaluate(n => APP.S.world.nodes.length > n, nodes0)) { made = true; break; }
  }
  check(made, 'create places a grove');

  // inspire
  await page.evaluate(() => { APP.S.cycles = 100; });
  await page.tap('#pw button[data-p=inspire]');
  await sleep(250);
  await page.screenshot({ path: path.join(out, '07-inspire-palette.png') });
  c = await visibleCitizen();
  await page.touchscreen.tap(c.x, c.y);
  await sleep(400);
  check(await page.evaluate(() => APP.S.stats.inspire === 1 && APP.S.citizens.some(c => c.inspired)), 'inspire makes a preacher');

  // smite a rock or tree (not a person)
  await page.tap('#pw button[data-p=smite]');
  await page.evaluate(() => { APP.S.cycles = 100; });
  const before = await page.evaluate(() => APP.S.stats.smite);
  const node = await page.evaluate(() => { let best = null, bd = 1e9; for (const n of APP.S.world.nodes) { if (n.dead || n.amount <= 0) continue; let near = 1e9; for (const c of APP.S.citizens) near = Math.min(near, Math.hypot(c.x - n.x, c.z - n.z)); const d = Math.hypot(n.x, n.z); if (near > 3 && d < bd) { bd = d; best = n; } } return best ? { x: best.x, z: best.z } : null; });
  await page.evaluate(n => { R.cam.tx = n.x; R.cam.tz = n.z; R.cam.dist = 16; }, node);
  await sleep(500);
  const np = await worldAt(node.x, node.z);
  await page.touchscreen.tap(np.x, np.y);
  await sleep(120);
  await page.screenshot({ path: path.join(out, '08-smite.png') });
  check(await page.evaluate(b => APP.S.stats.smite === b + 1, before), 'smite fires');
  await page.tap('#pw button[data-p=observe]');

  // pause menu, and the sim holds still while it is open
  await page.tap('#btnMenu');
  await sleep(300);
  const t0 = await page.evaluate(() => APP.S.t);
  await sleep(600);
  check(await page.evaluate(t => APP.S.t === t, t0), 'pause menu freezes the simulation');
  await page.screenshot({ path: path.join(out, '09-menu.png') });
  await page.tap('#mHelp'); await sleep(200);
  await page.screenshot({ path: path.join(out, '10-help.png') });
  await page.tap('#menuClose');

  // fast-forward a real slice of play, in the page, to a lived-in island
  await page.evaluate(() => { for (let i = 0; i < 20 * 60 * 6; i++) simStep(APP.S, SIM_DT); APP.S.events.length = 0; R.cam.tx = 0; R.cam.tz = 0; R.cam.dist = 26; });
  await sleep(1500);
  await page.screenshot({ path: path.join(out, '11-village.png') });
  check(await page.evaluate(() => APP.S.citizens.length >= 8 && APP.S.buildings.length >= 3), 'village has grown after six minutes');
  // society shows on screen: one flag per faction, a crown on each leader, small children, relationships in the inspector
  check(await page.evaluate(() => {
    const S = APP.S;
    const leaders = S.citizens.filter(c => c.title === 'leader');
    const kidsOk = S.citizens.filter(c => c.grow < 1).every(c => R.cit.get(c.id).g.scale.x < 0.98);
    return S.factions.length > 0 && R.flags.size === S.factions.length && leaders.every(c => R.cit.get(c.id).crown.visible) && kidsOk;
  }), 'factions fly flags, leaders wear crowns, children are small');
  check(await page.evaluate(() => { const c = APP.S.citizens.find(c => c.mate) || APP.S.citizens[0]; selectCitizen(c.id); updateInspect(APP.S); const t = document.getElementById('inFoot').textContent; selectCitizen(0); return /coin/.test(t) && (!c.mate || /partner/.test(t)); }), 'the inspector lists money and relationships');

  // the life panel: everything about one person, and the god's hand on them
  const who = await page.evaluate(() => { const c = APP.S.citizens.find(c => c.mate && c.grow >= 1) || APP.S.citizens[0]; selectCitizen(c.id); R.cam.tx = c.x; R.cam.tz = c.z; return c.id; });
  await sleep(500);
  await page.tap('#inLife'); await sleep(300);
  const lt0 = await page.evaluate(() => APP.S.t);
  await sleep(600);
  check(await page.evaluate(t0 => !document.getElementById('life').hidden && APP.S.t === t0 && /WHAT THEY WANT/.test(document.getElementById('lfBody').textContent) && /WHAT THEY HIDE/.test(document.getElementById('lfBody').textContent), lt0),
    'LIFE opens their soul (wants, secrets) and time stands still');
  await page.screenshot({ path: path.join(out, '11b-life-soul.png') });
  await page.tap('#lfTabs button[data-t=story]'); await sleep(200);
  check(await page.evaluate(() => document.querySelectorAll('#lfBody .mem').length >= 2), 'their life story is written down');
  await page.screenshot({ path: path.join(out, '11c-life-story.png') });
  await page.tap('#lfTabs button[data-t=people]'); await sleep(200);
  check(await page.evaluate(() => document.querySelectorAll('#lfBody .ppl button').length === APP.S.citizens.length - 1), 'they have a feeling about every other person');
  await page.tap('#lfTabs button[data-t=steer]'); await sleep(200);
  await page.evaluate(() => { APP.S.cycles = 100; });
  const coin0 = await page.evaluate(id => getC(APP.S, id).coin, who);
  await page.tap('#lfBody [data-act=rich]'); await sleep(200);
  check(await page.evaluate(([id, c0]) => getC(APP.S, id).coin === c0 + 15 && /fifteen coins/.test(getC(APP.S, id).mem.slice(-1)[0].text), [who, coin0]), 'steer: shower with coin, and they remember it');
  await page.tap('#lfBody [data-act=grudge]'); await sleep(200);
  const tgt = await page.evaluate(() => +document.querySelector('#lfBody [data-who]').dataset.who);
  const r0 = await page.evaluate(([a, b]) => getC(APP.S, a).rel[b] || 0, [who, tgt]);
  await page.tap('#lfBody [data-who]'); await sleep(200);
  check(await page.evaluate(([a, b, r0]) => (getC(APP.S, a).rel[b] || 0) < r0 - 0.3, [who, tgt, r0]), 'steer: sow a grudge against a chosen person');
  await page.screenshot({ path: path.join(out, '11d-life-steer.png') });
  await page.tap('#lfClose'); await sleep(200);
  check(await page.evaluate(() => document.getElementById('life').hidden && !APP.lifeOpen), 'and closes back to the island');
  await page.evaluate(() => selectCitizen(0));

  // save, reload, continue
  // snapshot in the same task as the save, so no sim step can slip in between
  const snap = await page.evaluate(() => { saveGame(); return { n: APP.S.citizens.length, b: APP.S.buildings.length, t: APP.S.t | 0 }; });
  await page.reload(); await sleep(1500);
  check(await page.evaluate(() => !document.getElementById('btnContinue').hidden), 'continue is offered after a reload');
  await page.tap('#btnContinue'); await sleep(800);
  // under a second of play has passed since the load, so allow one birth or one finished building, nothing more
  const back = await page.evaluate(() => ({ n: APP.S.citizens.length, b: APP.S.buildings.length, t: APP.S.t | 0 }));
  check(back.t - snap.t >= 0 && back.t - snap.t <= 3 && Math.abs(back.n - snap.n) <= 1 && back.b - snap.b >= 0 && back.b - snap.b <= 1,
    `the saved island comes back (saved ${snap.n} citizens/${snap.b} buildings at ${snap.t}s, loaded ${back.n}/${back.b} at ${back.t}s)`);

  // hidden tab: the sim must not run
  const th = await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); return APP.S.t; });
  await sleep(700);
  check(await page.evaluate(t => APP.S.t === t, th), 'simulation holds while the page is hidden');
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });

  // run to the Spire and through the Singularity
  await page.evaluate(() => {
    const S = APP.S;
    for (let i = 0; i < 20 * 60 * 30 && !S.sandbox; i++) {
      simStep(S, SIM_DT);
      if (S.spireUnlocked && !firstB(S, 'spire')) for (let k = 0; k < 60 && !firstB(S, 'spire'); k++) powerCreate(S, 'spire', Math.sin(k * 0.7) * (5 + k * 0.15), Math.cos(k * 0.7) * (5 + k * 0.15));
      if (firstB(S, 'spire') && firstB(S, 'spire').progress > 0.97) break;
      S.events.length = 0;
    }
    const sp = firstB(S, 'spire'); if (sp) { R.cam.tx = sp.x; R.cam.tz = sp.z; R.cam.dist = 30; }
  });
  await sleep(1200);
  await page.screenshot({ path: path.join(out, '12-spire-rising.png') });
  await page.evaluate(() => setSpeed(4));
  for (let i = 0; i < 60 && !(await page.evaluate(() => APP.dlgOpen)); i++) await sleep(500);
  check(await page.evaluate(() => APP.S.sandbox && APP.dlgOpen), 'completing the Spire triggers the Singularity');
  await page.screenshot({ path: path.join(out, '13-singularity.png') });
  for (let i = 0; i < 3; i++) { await page.tap('#dlgBtns button'); await sleep(300); }
  check(await page.evaluate(() => !APP.dlgOpen && APP.S.stage === 6), 'sandbox continues after the ending');
  // the island keeps the look of the idea it was built for
  for (let i = 0; i < 20 && !(await page.evaluate(() => { const k = APP.S.ending; return k >= 0 ? R.ageW[k] > 0.8 : R.ageW.every(w => w > 0.3); })); i++) await sleep(500);
  check(await page.evaluate(() => { const k = APP.S.ending, t = +document.getElementById('ageTint').style.opacity;
    return (k >= 0 ? R.ageW[k] > 0.8 && R.atm[k].m.visible : R.ageW.every(w => w > 0.3)) && t > 0.1; }), 'the ending\'s atmosphere settles over the sandbox');
  await sleep(800);
  await page.screenshot({ path: path.join(out, '14-sandbox.png') });
  await page.evaluate(() => { APP.S.day = 0.86; });
  await sleep(900);
  await page.screenshot({ path: path.join(out, '15-night.png') });

  // landscape phone and desktop layouts
  await page.setViewportSize({ width: 844, height: 390 }); await sleep(700);
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'landscape phone fits');
  await page.screenshot({ path: path.join(out, '16-landscape.png') });
  await page.setViewportSize({ width: 1280, height: 800 }); await sleep(700);
  const cc = await page.evaluate(() => { const c = APP.S.citizens[0]; const o = R.cit.get(c.id); const p = toScreen(o.x, o.g.position.y + 0.75, o.z, { x: 0, y: 0 }); return { x: p.x, y: p.y }; });
  await page.mouse.click(cc.x, cc.y); await sleep(500);
  await page.screenshot({ path: path.join(out, '17-desktop.png') });

  // soak: thirty seconds at 4x with the powers fired at random, to shake out every feedback path
  await page.evaluate(() => { setSpeed(4); APP.S.freeCycles = true; });
  for (let i = 0; i < 60; i++) {
    await page.evaluate(i => {
      const S = APP.S, r = Math.random, cs = S.citizens, c = cs[(r() * cs.length) | 0];
      const x = (r() - 0.5) * 22, z = (r() - 0.5) * 22;
      const kinds = ['citizen', 'grove', 'rock', 'hut', 'farm', 'shrine', 'lab'];
      switch (i % 8) {
        case 0: powerBless(S, x, z); break;
        case 1: if (c) powerSmite(S, c.x, c.z, c.id); break;
        case 2: powerCreate(S, kinds[(r() * kinds.length) | 0], x, z); break;
        case 3: if (c) powerInspire(S, c.id, (r() * 4) | 0); break;
        case 4: if (c) { powerGrab(S, c.id); powerDrag(S, x, z); } break;
        case 5: powerDrop(S); break;
        case 6: { const b = S.buildings[(r() * S.buildings.length) | 0]; powerSmite(S, b.x, b.z, 0); break; }
        case 7: if (c) selectCitizen(c.id); powerSmite(S, x, z, 0); break;
      }
    }, i);
    await sleep(500);
  }
  check(await page.evaluate(() => APP.S.citizens.every(c => isFinite(c.x) && isFinite(c.z)) && APP.S.buildings.length >= 1), 'state is sane after a 30 second random-power soak');
  await page.evaluate(() => { for (const c of APP.S.citizens.slice()) powerSmite(APP.S, c.x, c.z, c.id); });
  await sleep(3500);
  check(await page.evaluate(() => APP.S.citizens.length >= 6 && APP.S.citizens.length <= 8), 'an emptied island is restored from backup');
  await page.setViewportSize({ width: 390, height: 844 }); await sleep(500);
  await page.screenshot({ path: path.join(out, '18-after-soak.png') });

  // endless mode from the title screen, and switching goals from the pause menu
  await page.evaluate(() => { closeDlg(); openMenu(); });
  await page.tap('#mTitle'); await sleep(500);
  await page.tap('#btnNew'); await sleep(300);
  await page.tap('#dlgBtns button:nth-child(2)'); await sleep(300);     // confirm erase
  await page.tap('#dlgBtns button:nth-child(1)'); await sleep(1200);    // endless
  check(await page.evaluate(() => APP.mode === 'play' && APP.S.goal === false && document.getElementById('qTitle').textContent === 'ENDLESS'), 'an endless world has no goal');
  await page.evaluate(() => { for (let i = 0; i < 20 * 60 * 12; i++) simStep(APP.S, SIM_DT); APP.S.events.length = 0; });
  await sleep(800);
  check(await page.evaluate(() => !firstB(APP.S, 'spire') && APP.S.stage === 0 && /gen \d/.test(document.getElementById('qText').textContent)), 'after twelve minutes nobody has started a Spire; the bar shows day and generation');
  await page.screenshot({ path: path.join(out, '19-endless.png') });
  check(await page.evaluate(() => R.fog.length === 2 && R.fog[0].geometry.attributes.position.count > 0 && R.isles.filter(g => g.visible).length === APP.S.found.filter(Boolean).length),
    'the world beyond is fogged, and islands nobody has seen are hidden');
  const cam0 = await page.evaluate(() => ({ x: R.cam.tx, z: R.cam.tz, d: R.cam.dist }));
  await page.tap('#btnGo'); await sleep(300);
  check(await page.evaluate(c => R.cam.dist !== c.d || R.cam.tx !== c.x || R.cam.tz !== c.z, cam0), 'the jump button moves the view around the world');
  await page.tap('#btnGo'); await sleep(300);
  await page.evaluate(() => openMenu());
  await page.tap('#mGoal'); await sleep(200);
  check(await page.evaluate(() => APP.S.goal === true), 'the pause menu can turn the Spire goal back on');
  await page.tap('#mGoal'); await sleep(200);
  await page.evaluate(() => closeMenu());

  const fps = await page.evaluate(() => new Promise(res => { let n = 0; const t = performance.now(); const f = () => { n++; if (performance.now() - t > 2000) res(n / 2); else requestAnimationFrame(f); }; requestAnimationFrame(f); }));
  console.log('frames per second in this software-rendered test browser:', fps.toFixed(0));
  check(errors.length === 0, 'no console or page errors' + (errors.length ? ': ' + errors.slice(0, 5).join(' | ') : ''));
  await browser.close();
  console.log(failures ? 'FAILED ' + failures : 'ALL OK');
  process.exit(failures ? 1 : 0);
})();
