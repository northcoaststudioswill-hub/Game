/* Rootdeep / Pocket Lantern v0.2 test: saves_onboarding
   Run from the repo root:  node v0.2/tests/saves_onboarding.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/saves_onboarding/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
const D = require('path').join(__dirname, 'out', 'saves_onboarding') + '/'; require('fs').mkdirSync(D, { recursive: true });
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n')[1]));
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(700);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const hit = async (key, ms = 160) => { await page.keyboard.down(key); await page.waitForTimeout(70); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
  const cv = await page.$('canvas'); let n = 0; const shot = async nm => { await page.waitForTimeout(150); await cv.screenshot({ path: D + String(++n).padStart(2,'0') + '_' + nm + '.png' }) };
  await E(`localStorage.removeItem('rootdeep-v1')`);
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  await E(`Object.assign(RD,RDDEF());RD.set={mus:7,sfx:8,shake:true};state='g3title'`);
  await hit('KeyZ', 300); ok((await E('state')) === 'g3cine' && (await E('rdCineKey')) === 'intro', 'first start: A goes straight into a new game (the intro)');
  await hit('Enter', 400); ok((await E('state')) === 'g3hub', 'intro ends in the Hearth'); await page.waitForTimeout(200); await shot('hub_first');
  ok((await E('state')) === 'g3appr', 'Erin walks over'); await page.waitForTimeout(3300); await shot('erin_intro');
  ok((await E('rdTalkL===RDINTRO')) && (await E('state')) === 'g3talk', "Erin's welcome plays");
  for (let i = 0; i < 8 && (await E('state')) === 'g3talk'; i++) await hit('KeyZ', 120);
  ok((await E('rdObjective().t')) === 'GO DOWN THE BURROW', 'objective moves on: GO DOWN THE BURROW'); await shot('hub_door_obj');
  // menu: continue + new game
  await E(`state='g3title'`); await hit('KeyZ', 200); ok((await E('state')) === 'g3menu' && (await E('JSON.stringify(rdMenuItems())')).includes('CONTINUE'), 'with a save, the title opens the menu with CONTINUE');
  await shot('menu');
  await E('menuSel=1'); await hit('KeyZ', 150); ok((await E('newArm')) === 1 && (await E('state')) === 'g3menu', 'NEW GAME asks first'); await shot('menu_newarm');
  await E('menuSel=0;newArm=0');
  // run, checkpoint, save & quit, continue
  await E(`RD.char='WILL';rdStartRun();state='g3run'`); await E(`window.__g.RDF().clearRoom()`); await page.waitForTimeout(300);
  await E(`RUN.doors[0].kind='petals';window.__g.RDF().door(0)`); await page.waitForTimeout(200);
  const ck = JSON.parse(await E('JSON.stringify(RD.ckpt)')); ok(ck && ck.chamber === 2, 'checkpoint written at chamber ' + (ck && ck.chamber));
  await E(`pauseSel=3;pausePage=0;state='g3pause'`); await shot('pause'); await hit('KeyZ', 200);
  ok((await E('state')) === 'g3menu' && (await E('RUN===null')), 'SAVE & QUIT returns to the menu');
  await shot('menu_saved');
  await E('menuSel=0'); await hit('KeyZ', 300); ok((await E('state')) === 'g3run' && (await E('RUN.chamber')) === 2 && (await E('RUN.petals')) === ck.petals, 'CONTINUE resumes chamber 2 with the same petals');
  // capsules from Rootdeep's menu
  await E(`RUN=null;meta.tix=3;LAN.capTut=1;state='g3menu';menuSel=rdMenuItems().indexOf('CAPSULES')`); await hit('KeyZ', 200); ok((await E('state')) === 'lancaps', 'CAPSULES opens from the menu'); await shot('caps');
  const tix = await E('meta.tix'); await hit('KeyZ', 1500); await shot('caps_reveal'); ok((await E('meta.tix')) === tix - 1 && (await E('capR.ph')) === 'show', 'a pull from Rootdeep spends a ticket and reveals the item');
  await hit('KeyZ', 200); await hit('KeyX', 200);
  // death cinematic
  await E(`RD.char='WILL';rdStartRun();state='g3run';for(const t of [0,2,3])RUN.buds.push({type:t,x:P3.x+20,y:P3.y,a:0,cd:0,z:0});RUN.kills=12`);
  await page.waitForTimeout(300); await E(`RUN.lastHit='beetle';window.__g.RDF().hurt(9999)`);
  ok((await E('state')) === 'g3dying', 'dying plays a cinematic first'); await page.waitForTimeout(900); await shot('dying_a'); await page.waitForTimeout(1300); await shot('dying_b');
  await page.waitForTimeout(1500); ok((await E('state')) === 'g3over', 'then the death screen'); await page.waitForTimeout(900); await shot('over');
  console.log('death line:', await E('RD.lastRun.sub'), '| msgs:', await E('JSON.stringify(RD.lastRun.msgs)'), '| banked', await E('RD.lastRun.spr'));
  // swarm leap
  await E(`hubEnter();rdStartRun();state='g3run';RUN.wave2=null;for(const t of [0,2,3,4])RUN.buds.push({type:t,x:P3.x,y:P3.y,a:0,cd:0,z:0})`);
  let leaps = 0; for (let i = 0; i < 50; i++) { await page.waitForTimeout(60); leaps = Math.max(leaps, await E('RUN.buds.filter(b=>b.leap).length'));; if (i === 6) await shot('leap'); }
  ok(leaps >= 1, 'buds leap at foes (' + leaps + ' mid-air at once)');
  console.log('ERRORS:', errs.length ? '\n  ' + errs.join('\n  ') : 'none'); await browser.close();
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(1); });
