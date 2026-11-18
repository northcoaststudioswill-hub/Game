/* Rootdeep / Pocket Lantern v0.2 test: lantern_menu
   Run from the repo root:  node v0.2/tests/lantern_menu.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/lantern_menu/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
const D = require('path').join(__dirname, 'out', 'lantern_menu') + '/'; require('fs').mkdirSync(D, { recursive: true });
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n')[1]));
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(800);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const hit = async (key, ms = 160) => { await page.keyboard.down(key); await page.waitForTimeout(70); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
  const cv = await page.$('canvas'); const shot = async nm => { await page.waitForTimeout(150); await cv.screenshot({ path: D + nm + '.png' }) };
  await E(`localStorage.removeItem('lantern-v1');LAN.ach={};LAN.played={};LAN.ko={w:0,cl:0};LAN.tixEarned=0;LAN.capTut=1;meta.ltix=5`);
  await page.screenshot({ path: D + 'shelf.png' });
  /* Nov 18 2026: the page opens on the power-on sequence and the shelf is rows of three, so: skip the sequence, then go down until the Lantern button is reached */
  for (let k = 0; k < 6 && (await E('state')) === 'pwr'; k++) await hit('KeyX', 200);
  for (let k = 0; k < 5 && !(await page.evaluate(() => document.getElementById('lanBtn').classList.contains('sel'))); k++) await hit('ArrowDown', 150);
  ok(await page.evaluate(() => document.getElementById('lanBtn').classList.contains('sel')), 'down on the shelf reaches the Lantern menu');
  await hit('KeyZ', 300); ok((await E('state')) === 'lan', 'A opens the Lantern menu'); await shot('menu');
  await hit('KeyZ', 200); ok((await E('state')) === 'lancaps', 'CAPSULES: the unified machine'); const t0 = await E('meta.ltix');
  await hit('KeyZ', 1500); ok((await E('capR.ph')) === 'show' && (await E('meta.ltix')) === t0 - 1, 'a pull from the console spends a ticket'); await shot('caps_reveal');
  await hit('KeyZ', 200); await hit('KeyX', 200); ok((await E('state')) === 'lan', 'B returns to the Lantern menu');
  await E(`lanSel=1`); await hit('KeyZ', 200); ok((await E('state')) === 'lanstats', 'STATS opens'); for (let p = 0; p < 4; p++) { await shot('stats_' + p); await hit('ArrowRight', 150); }
  await hit('KeyX', 200); await E(`lanSel=2`); await hit('KeyZ', 200); ok((await E('state')) === 'lanach', 'ACHIEVEMENTS opens'); await shot('ach');
  await hit('KeyX', 200); await hit('KeyX', 200); ok((await E('state')) === 'off' && await page.evaluate(() => !document.getElementById('shelf').hidden), 'B twice: back to the shelf');
  // cross-game achievement + Knockout tickets
  await E(`LAN.played={0:1,1:1,2:1};localStorage.setItem('ncko-v1',JSON.stringify({diff:0,clear:{will:1},w:12,l:3}))`); const tb = await E('meta.ltix');
  const r = JSON.parse(await E(`JSON.stringify(lanCheck(true))`)); ok(r.got.includes('TRIPLE THREAT') && r.tix >= 2 + 1 + 1 && (await E('meta.ltix')) === tb + r.tix, 'TRIPLE THREAT + a Knockout arcade clear + 10 wins pay ' + r.tix + ' tickets');
  await page.waitForTimeout(200); await page.screenshot({ path: D + 'shelf_toast.png' }); console.log('  shelf says:', await page.evaluate(() => document.getElementById('shelfMsg').textContent));
  // Sprouts' and Rootdeep's CAPSULES open the same machine and return home
  await page.evaluate(`document.querySelector('.cart[data-i="0"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  for (let k = 0; k < 30 && (await E('state')) !== 'menu'; k++) await hit('Enter', 250);
  await E(`mi=menuItems().indexOf('CAPSULES')`); await hit('KeyZ', 200); ok((await E('state')) === 'caps', "Sprouts' CAPSULES opens Sprouts' own machine (Nov 18)"); await hit('KeyX', 200); ok((await E('state')) === 'menu', 'and B returns to the Sprouts menu');
  await E('eject()'); await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  await E(`RD.flags.cineSeen=1;RD.stats.runs=1;state='g3menu';menuSel=rdMenuItems().indexOf('CAPSULES')`); await hit('KeyZ', 200); ok((await E('state')) === 'lancaps', "Rootdeep's CAPSULES opens the same machine"); await hit('KeyX', 200); ok((await E('state')) === 'g3menu', 'and B returns to the Rootdeep menu');
  // Rootdeep: the Burrow, overflow sprouts, the surface scene
  await E(`RD.flags.cine_burrow=0;RD.char='MARCUS';hubEnter();P3.x=28;P3.y=70`); await hit('KeyZ', 300); ok((await E('state')) === 'g3cine' && (await E('rdCineKey')) === 'burrow', 'first visit to the Burrow plays its scene'); await E('rdCineT=2'); await shot('burrow_cine');
  await hit('Enter', 300); ok((await E('state')) === 'g3mirror', 'then the Burrow upgrades'); await shot('burrow_screen');
  await E(`state='g3hub';RD.char='ERIN';rdStartRun();state='g3run';for(let i=0;i<6;i++)RUN.buds.push({type:i%5,x:P3.x,y:P3.y,a:0,cd:0,z:0});RUN.pods.push({type:2,x:P3.x,y:P3.y},{type:3,x:P3.x+2,y:P3.y})`);
  await page.waitForTimeout(300); ok((await E('(RUN.waiting||[]).length')) === 2, 'a full string: two found sprouts wait for the surface');
  const bank0 = await E('Object.values(RD.bank).reduce((a,b)=>a+b,0)');
  await E(`window.__g.RDF().clearRoom()`); await page.waitForTimeout(300); await E(`RUN.doors[0].kind='petals';window.__g.RDF().door(0)`); await page.waitForTimeout(200);
  ok((await E('state')) === 'g3cine' && (await E('rdCineKey')) === 'drop', 'next door: the drop scene plays, sprouts climbing up'); await E('rdCineT=2.2'); await shot('surface_cine');
  ok((await E('Object.values(RD.bank).reduce((a,b)=>a+b,0)')) === bank0 + 2, 'and the two sprouts are banked in the Ledger');
  await hit('Enter', 300); ok((await E('state')) === 'g3run' && (await E('RUN.chamber')) === 2, 'then back to the run, chamber 2');
  console.log('ERRORS:', errs.length ? '\n  ' + errs.join('\n  ') : 'none'); await browser.close();
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(1); });
