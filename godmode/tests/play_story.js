/* Plays all four story chapters in a phone-sized browser, doing what each step asks through
   real taps and drags where it reasonably can, and fast-forwarding the world while waiting.
   node godmode/tests/play_story.js [outDir]                                                  */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const file = 'file://' + path.resolve(__dirname, '../index.html');
const out = process.argv[2] || path.join(require('os').tmpdir(), 'godmode-story');
const FROM = +process.argv[3] || 1, TO = +process.argv[4] || 4;     // which chapters to play
fs.mkdirSync(out, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
const check = (ok, msg) => { console.log((ok ? 'ok   ' : 'FAIL ') + msg); if (!ok) failures++; };

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(file); await sleep(1200);

  const step = () => page.evaluate(() => APP.S.story ? APP.S.story.step : -1);
  const scr = (x, z, y) => page.evaluate(([x, z, y]) => { const p = toScreen(x, y === undefined ? groundY(APP.S.world, x, z) : y, z, {}); return { x: p.x, y: p.y }; }, [x, z, y]);
  const citizenScr = id => page.evaluate(id => { const o = R.cit.get(id); if (!o) return null; const p = toScreen(o.x, o.g.position.y + 0.75 * o.g.scale.y, o.z, {}); return { x: p.x, y: p.y }; }, id);
  const look = (x, z, d) => page.evaluate(([x, z, d]) => { R.cam.follow = 0; UI.goBoat = 0; R.cam.tx = x; R.cam.tz = z; R.cam.dist = d || 20; R.cam.pitch = 0.95; }, [x, z, d]);
  const lookAt = async id => { const p = await page.evaluate(id => { const c = getC(APP.S, id); return c && { x: c.x, z: c.z }; }, id); if (p) await look(p.x, p.z, 16); await sleep(500); };
  const data = () => page.evaluate(() => APP.S.story && APP.S.story.data);
  const tapCitizen = async id => { await lookAt(id); const p = await citizenScr(id); if (p) await page.touchscreen.tap(p.x, p.y); await sleep(400); };
  const dragCitizenTo = async (id, x, z) => {
    await page.evaluate(() => { APP.speed = 1; });
    await lookAt(id);
    const a = await citizenScr(id), b = await scr(x, z);
    await page.mouse.move(a.x, a.y); await page.mouse.down(); await page.mouse.move(b.x, b.y, { steps: 8 }); await sleep(150); await page.mouse.up(); await sleep(400);
  };
  const closeIns = async () => { if (await page.evaluate(() => !document.getElementById('inspect').hidden)) await closeIns(); await sleep(150); };
  // wait (in real time, letting the game run) for the story to reach a step
  const waitStep = async (n, ms) => { for (let i = 0; i < (ms || 3000) / 150; i++) { if ((await step()) >= n) return true; await sleep(150); } return (await step()) >= n; };
  let d, p, id, fp, w, t3, dk;
  const ff = s => page.evaluate(s => storyFastForward(s), s);
  const until = async (n, maxSecs, act) => { for (let i = 0; i < maxSecs / 5 && (await step()) === n; i++) { if (act) await act(); await ff(5); await sleep(60); } };
  const shot = n => page.screenshot({ path: path.join(out, n + '.png') });
  const ended = async title => { await sleep(500); const t = await page.evaluate(() => APP.dlgOpen ? document.getElementById('dlgText').textContent : ''); check(/COMPLETE|THE /.test(await page.evaluate(() => document.getElementById('dlgTitle').textContent)) && t.length > 40, title + ': the chapter ends with its outcome'); return t; };

  // ---------------------------------------------------------------- chapter 1
  if (FROM <= 1 && TO >= 1) {
  await page.tap('#btnStory'); await sleep(300);
  check(await page.evaluate(() => APP.dlgOpen && document.querySelectorAll('#dlgBtns button').length === 5), 'the story menu lists four chapters');
  await shot('s0-menu');
  await page.tap('#dlgBtns button:nth-child(1)'); await sleep(1200);
  check(await page.evaluate(() => !!APP.S.story && !document.getElementById('story').hidden && APP.S.citizens.length === 6), 'chapter 1 starts with its story card');
  await shot('s1-intro');
  await page.tap('#storyGo'); await sleep(300);
  await page.mouse.move(200, 420); await page.mouse.down(); await page.mouse.move(80, 430, { steps: 8 }); await page.mouse.up(); await sleep(400);
  check(await waitStep(2), 'ch1: dragging the view completes "look around"');
  id = await page.evaluate(() => APP.S.citizens[0].id);
  await tapCitizen(id);
  check(await waitStep(3), 'ch1: tapping a person completes "observe"');
  await closeIns();
  await shot('s1-bless-step');
  check(await page.evaluate(() => document.querySelector('#pw [data-p=bless]').classList.contains('hl')), 'ch1: the Bless button pulses');
  await page.tap('#pw [data-p=bless]'); await look(0, 0, 20); await sleep(400);
    for (const [x, z] of [[0.5, 0.5], [1.5, -1], [-1, 1.5]]) { if ((await step()) !== 3) break; p = await scr(x, z); await page.touchscreen.tap(p.x, p.y); await sleep(500); }
  check(await waitStep(4), 'ch1: blessing completes the step');
  await page.tap('#pw [data-p=create]'); await sleep(300);
  check(await page.waitForFunction(() => document.querySelector('#sub [data-k=hut].hl'), null, { timeout: 3000 }).then(() => true, () => false), 'ch1: Hut pulses in the Create palette');
  await page.tap('#sub [data-k=hut]'); await sleep(200);
  for (const [x, z] of [[4, 2], [-4, 3], [3, -4], [5, -1], [-2, -5]]) { if ((await step()) !== 4) break; p = await scr(x, z); await page.touchscreen.tap(p.x, p.y); await sleep(300); }
  check(await waitStep(5), 'ch1: placing a hut completes the step');
  await until(5, 150);
  check(await waitStep(6), 'ch1: the hut gets built');
  await page.tap('#pw [data-p=inspire]'); await sleep(300); await page.tap('#sub [data-k=b0]'); await sleep(200);
  id = await page.evaluate(() => APP.S.citizens[1].id); await tapCitizen(id);
  check(await waitStep(7), 'ch1: inspiring Devotion completes the step');
  await until(7, 200);
  check(await waitStep(8), 'ch1: four believers');
  await page.tap('#pw [data-p=create]'); await sleep(300); await page.tap('#sub [data-k=shrine]'); await sleep(200); await look(0, 0, 22); await sleep(300);
  for (const [x, z] of [[-4, 3], [4, -3], [-3, -4], [5, 3], [0, 6], [-6, 0]]) { if ((await step()) !== 8) break; p = await scr(x, z); await page.touchscreen.tap(p.x, p.y); await sleep(300); }
  check(await waitStep(9), 'ch1: a shrine is staked out');
  await page.tap('#pw [data-p=observe]');
  await until(9, 200); await until(10, 300);
  await shot('s1-end');
  await ended('ch1');

  }
  // ---------------------------------------------------------------- chapter 2
  if (FROM <= 2 && TO >= 2) {
  if (FROM === 2) { await page.evaluate(() => startStory(1)); } else await page.tap('#dlgBtns button:nth-child(1)');
  await sleep(1500);
  check(await page.evaluate(() => APP.S.story && APP.S.story.ch === 1), 'chapter 2 follows from the end of chapter 1');
  await page.tap('#storyGo'); await sleep(200);
  d = await data();
  await tapCitizen(d.hero);
  check(await waitStep(2), 'ch2: tapping the hero');
  await page.tap('#inLife'); await sleep(400);
  check((await step()) === 3 && await page.evaluate(() => document.getElementById('story').classList.contains('over')), 'ch2: LIFE opens and the story card stays on top of it');
  await shot('s2-life');
  await page.tap('#storyGo'); await sleep(200);
  await page.tap('#lfTabs [data-t=steer]'); await sleep(200);
  await page.tap('#lfBody [data-act=love]'); await sleep(200);
  await page.tap('#lfBody [data-who="' + d.love + '"]'); await sleep(300);
  check(await waitStep(5), 'ch2: kindling love makes a couple');
  await page.tap('#lfClose'); await sleep(200);
  await until(5, 400);
  check(await waitStep(6), 'ch2: a child is born to them');
  d = await data();
  await tapCitizen(d.hero); await page.tap('#inLife'); await sleep(300); await page.tap('#lfTabs [data-t=story]'); await sleep(300);
  check(await waitStep(7), 'ch2: their STORY tab');
  await shot('s2-story');
  await page.tap('#lfClose'); await sleep(200);
  await tapCitizen(d.trader); await page.tap('#inLife'); await sleep(300); await page.tap('#lfTabs [data-t=steer]'); await sleep(200); await page.tap('#lfBody [data-act=rich]'); await sleep(300);
  check(await waitStep(8), 'ch2: coin for the trader');
  await page.tap('#lfClose'); await sleep(200);
  await until(8, 200);
  check(await waitStep(9), 'ch2: the bakery opens');
  await page.evaluate(() => selectCitizen(0));
  await ff(1); d = await data(); await sleep(300);
  await page.tap('#pw [data-p=bless]'); await lookAt(d.fa);
  fp = await citizenScr(d.fa); await page.touchscreen.tap(fp.x, fp.y); await sleep(400);
  await shot('s2-end');
  await ended('ch2');

  }
  // ---------------------------------------------------------------- chapter 3
  if (FROM <= 3 && TO >= 3) {
  if (FROM === 3) { await page.evaluate(() => startStory(2)); } else await page.tap('#dlgBtns button:nth-child(1)');
  await sleep(1500);
  await page.tap('#storyGo'); await sleep(200);
  d = await data();
  check(await page.evaluate(d => getC(APP.S, d.la).title === 'leader' && getC(APP.S, d.lb).title === 'leader', d), 'ch3: two faith leaders are ready');
  await page.tap('#pw [data-p=observe]');
  await tapCitizen(d.la); check(await waitStep(2), 'ch3: first leader');
  await closeIns(); await tapCitizen(d.lb); check(await waitStep(3), 'ch3: second leader');
  await page.tap('#inLife'); await sleep(300); await page.tap('#lfTabs [data-t=steer]'); await sleep(200); await page.tap('#lfBody [data-act=enrage]'); await sleep(300);
  check(await waitStep(4), 'ch3: rage');
  await page.tap('#lfClose'); await sleep(200);
  await until(4, 300);
  check((await step()) === 5 && await page.evaluate(() => !!APP.S.war), 'ch3: war breaks out');
  await shot('s3-war');
  w = await page.evaluate(() => ({ x: (APP.S.war.ax + APP.S.war.bx) / 2, z: (APP.S.war.az + APP.S.war.bz) / 2 }));
  await page.tap('#pw [data-p=bless]'); await look(w.x, w.z, 18); await sleep(400); p = await scr(w.x, w.z); await page.touchscreen.tap(p.x, p.y); await sleep(400);
  await until(5, 60);
  t3 = await ended('ch3');
  check(/MIRACLE|put down their fists/.test(t3), 'ch3: blessing the battlefield gives the miracle ending');

  }
  // ---------------------------------------------------------------- chapter 4
  if (FROM <= 4 && TO >= 4) {
  if (FROM === 4) { await page.evaluate(() => startStory(3)); } else await page.tap('#dlgBtns button:nth-child(1)');
  await sleep(1500);
  await page.tap('#storyGo'); await sleep(200);
  d = await data();
  await page.tap('#pw [data-p=observe]');
  dk = await page.evaluate(id => { const b = getB(APP.S, id); return { x: b.x, z: b.z }; }, d.dock);
  await look(dk.x, dk.z, 16); await sleep(400); p = await scr(dk.x, dk.z); await page.touchscreen.tap(p.x, p.y); await sleep(400);
  check(await waitStep(2), 'ch4: tapping the dock');
  await page.tap('#pw [data-p=intervene]'); await sleep(1600);
  await dragCitizenTo(d.explorer, dk.x, dk.z);
  await ff(12);
  check((await step()) >= 3, 'ch4: dropping the explorer on the dock sends a boat out');
  await page.tap('#btnGo'); await sleep(300); await page.tap('#btnGo'); await sleep(300);
  await until(3, 40); await until(4, 300);
  check(await waitStep(5), 'ch4: land is sighted');
  await shot('s4-land');
  d = await data();
  await page.tap('#pw [data-p=intervene]'); await sleep(1600);
  await dragCitizenTo(d.leader, dk.x, dk.z);
  await ff(2);
  check(await waitStep(6), 'ch4: dropping the faith leader on the dock starts an exodus');
  await until(6, 300);
  await shot('s4-end');
  await ended('ch4');
  }
  check(await page.evaluate(() => Object.keys(APP.settings.storyDone).length >= TO - FROM + 1), 'all four chapters are marked complete');
  check(errors.length === 0, 'no console or page errors' + (errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''));
  await browser.close();
  console.log(failures ? 'FAILED ' + failures : 'ALL OK');
  process.exit(failures ? 1 : 0);
})();
