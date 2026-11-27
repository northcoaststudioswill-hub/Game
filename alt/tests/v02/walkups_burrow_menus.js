/* Rootdeep / Pocket Lantern v0.2 test: walkups_burrow_menus
   Run from the repo root:  node v0.2/tests/walkups_burrow_menus.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/walkups_burrow_menus/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
const D = require('path').join(__dirname, 'out', 'walkups_burrow_menus') + '/'; require('fs').mkdirSync(D, { recursive: true });
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n')[1]));
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(700);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const hit = async (key, ms = 120) => { await page.keyboard.down(key); await page.waitForTimeout(60); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
  const cv = await page.$('canvas'); const shot = async nm => cv.screenshot({ path: D + nm + '.png' });
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  await E(`localStorage.removeItem('rootdeep-v1');Object.assign(RD,RDDEF());RD.set={mus:7,sfx:8,shake:true};LAN.capTut=0;meta.tix=0;meta.ltix=0;rdNewGame()`); await page.waitForTimeout(300);
  ok(await E('state') === 'g3cine', 'new game plays the intro');
  await hit('Enter', 300); ok(await E('state') === 'g3hub', 'skip lands in the Hearth');
  await page.waitForTimeout(500); ok(await E('state') === 'g3appr', 'Erin walks over (approach)'); await page.waitForTimeout(200); await shot('01_appr');
  await page.waitForTimeout(2500); ok(await E('state') === 'g3talk' && await E('talkNPC') === 'ERIN', 'Erin starts the welcome'); await shot('02_welcome');
  for (let i = 0; i < 8 && await E('state') === 'g3talk'; i++) await hit('KeyZ', 150);
  ok(await E('state') === 'g3hub' && await E('RD.flags.met_ERIN'), 'welcome over, back in the Hearth'); await page.waitForTimeout(1600);
  ok(await E('state') === 'g3hub', 'no other approach yet: ' + await E('state')); await shot('03_hub');
  // the Burrow
  await E(`P3.x=W/2;P3.y=H-14`); await page.waitForTimeout(100); ok((await E('hubMsg')).includes('BURROW'), 'bottom door reads ' + await E('hubMsg'));
  await hit('KeyZ', 200); ok(await E('state') === 'g3cine' && await E('rdCineKey') === 'descend', 'going down plays the descend scene');
  await page.waitForTimeout(1500); await shot('04_descend'); await E('rdCineT=RDCINES.descend[0].d-.7'); await page.waitForTimeout(150); await shot('05_fall');
  await hit('Enter', 200); ok(await E('state') === 'g3run' && await E('RUN.chamber') === 1, 'then chamber 1');
  // drop with rescued sprouts
  const b0 = await E('JSON.stringify(RD.bank)');
  await E(`RUN.waiting=[1,2,4];RUN.enemies=[];RUN.wave2=null;rdNextChamber()`); await page.waitForTimeout(150);
  ok(await E('state') === 'g3cine' && await E('rdCineKey') === 'drop', 'next chamber plays the drop scene');
  ok(await E('Object.values(RD.bank).reduce((a,b)=>a+b,0)') >= 3, 'rescued sprouts banked ' + b0 + ' -> ' + await E('JSON.stringify(RD.bank)'));
  await page.waitForTimeout(1300); await shot('06_drop_sprouts'); await E('rdCineT=RDCINES.drop[0].d-.6'); await page.waitForTimeout(100); await shot('07_drop_card');
  await hit('Enter', 200); ok(await E('state') === 'g3run' && await E('RUN.chamber') === 2, 'then chamber 2');
  await E(`RUN.enemies=[];RUN.wave2=null;rdNextChamber()`); await page.waitForTimeout(150);
  ok(await E('rdCineKey') === 'drop' && await E('RDCINES.drop[0].lines.length') === 0, 'a plain drop has no dialogue');
  await page.waitForTimeout(800); await shot('08_drop_plain'); await page.waitForTimeout(2200); ok(await E('state') === 'g3run', 'plain drop ends on its own');
  await shot('09_run_saved');
  // resume doesn't replay a drop
  await E(`rdCkpt();RUN=null;rdResume()`); await page.waitForTimeout(150); ok(await E('state') === 'g3run', 'CONTINUE resumes without a drop scene');
  // fall, then the walk-ups
  await E(`RUN.dew=30;window.__g.RDF().hurt(9999);if(state==='g3dying')rdDieFinish()`); await page.waitForTimeout(1000); await hit('KeyZ', 300);
  ok(await E('state') === 'g3hub', 'back in the Hearth after the fall'); await page.waitForTimeout(3600);
  ok(await E('state') === 'g3talk' && await E('talkNPC') === 'ERIN' && (await E('talkTxt')).includes('came back'), 'Erin walks up after the first fall'); await shot('10_fall_talk');
  for (let i = 0; i < 8 && await E('state') === 'g3talk'; i++) await hit('KeyZ', 150);
  await page.waitForTimeout(4500); ok(await E('state') === 'g3talk' && (await E('talkTxt')).includes('Ledger'), 'Erin explains the Ledger: ' + await E('talkTxt'));
  for (let i = 0; i < 8 && await E('state') === 'g3talk'; i++) await hit('KeyZ', 150);
  await E('meta.ltix=2'); await page.waitForTimeout(4500); ok(await E('talkNPC') === 'MARCUS' && (await E('talkTxt')).includes('capsule'), 'Marcus explains tickets'); await shot('11_marcus');
  for (let i = 0; i < 8 && await E('state') === 'g3talk'; i++) await hit('KeyZ', 150);
  ok(await E('RD.heard.e_fall&&RD.heard.e_ledger&&RD.heard.m_caps') ? true : false, 'walk-ups mark topics heard');
  // pause
  await page.waitForTimeout(500); await hit('Enter', 200); ok(await E('state') === 'g3hpause', 'START opens the Hearth menu'); await shot('12_hpause');
  await hit('ArrowDown'); await hit('KeyZ', 100); ok(await E('rdSavedT') > 0, 'SAVE GAME shows SAVED'); await hit('KeyX'); await page.waitForTimeout(200); await shot('13_saved');
  await hit('Enter', 200); await hit('ArrowDown'); await hit('ArrowDown'); await hit('ArrowDown'); await hit('KeyZ', 300);
  ok(await E('state') === 'lancaps', 'CAPSULES from the Hearth menu'); await shot('14_caps_tut');
  for (let i = 0; i < 3; i++) await hit('KeyZ', 150); ok(await E('LAN.capTut') === 1, 'Erin explains the machine once');
  for (let p = 0; p < 4; p++) { await shot('15_caps_pg' + await E('capR.pg')); await hit('ArrowRight', 150); }
  await hit('KeyX', 200); ok(await E('state') === 'g3hpause', 'B goes back to the Hearth menu');
  await hit('ArrowDown'); await hit('KeyZ'); ok(await E('hpArm') === 1, 'NEW GAME arms once'); await shot('16_newarm'); await hit('KeyZ'); ok(await E('hpArm') === 2, 'twice');
  await hit('KeyZ', 300); ok(await E('state') === 'g3cine' && await E('RD.stats.runs') === 0, 'third press starts over');
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'ERRORS: none');
  await browser.close();
})();
