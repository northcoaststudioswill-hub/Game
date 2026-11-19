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
  await sleep(1200);
  check(await page.evaluate(() => APP.mode === 'play' && APP.S.citizens.length === 6), 'new world starts with six citizens');
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

  // save, reload, continue
  await page.evaluate(() => saveGame());
  const snap = await page.evaluate(() => ({ n: APP.S.citizens.length, b: APP.S.buildings.length, t: APP.S.t | 0 }));
  await page.reload(); await sleep(1500);
  check(await page.evaluate(() => !document.getElementById('btnContinue').hidden), 'continue is offered after a reload');
  await page.tap('#btnContinue'); await sleep(800);
  check(await page.evaluate(s => APP.S.citizens.length === s.n && APP.S.buildings.length === s.b, snap), 'the saved island comes back');

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

  const fps = await page.evaluate(() => new Promise(res => { let n = 0; const t = performance.now(); const f = () => { n++; if (performance.now() - t > 2000) res(n / 2); else requestAnimationFrame(f); }; requestAnimationFrame(f); }));
  console.log('frames per second in this software-rendered test browser:', fps.toFixed(0));
  check(errors.length === 0, 'no console or page errors' + (errors.length ? ': ' + errors.slice(0, 5).join(' | ') : ''));
  await browser.close();
  console.log(failures ? 'FAILED ' + failures : 'ALL OK');
  process.exit(failures ? 1 : 0);
})();
