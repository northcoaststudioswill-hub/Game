/* Rootdeep / Pocket Lantern v0.2 test: capsules_reset
   Run from the repo root:  node v0.2/tests/capsules_reset.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/capsules_reset/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(700);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const hit = async (key, ms = 60) => { await page.keyboard.down(key); await page.waitForTimeout(50); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
  await page.evaluate(`document.querySelector('.cart[data-i="0"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  for (let k = 0; k < 30 && (await E('state')) !== 'menu'; k++) await hit('Enter', 250);
  await E(`meta.tix=80;state='caps';capS={ph:'idle',t:0,it:null}`);
  let pulls = 0;
  /* Nov 18 2026: two machines now. Sprouts' own holds only Sprouts styles and takes Sprouts tickets; the Lantern machine holds Rootdeep's unlocks and takes Lantern tickets (meta.ltix). */
  while (await E(`pool('sp').length`)) { await hit('KeyZ'); if ((await E('capS.ph')) !== 'shake') { console.log('pull did not start'); break }
    await E('capS.t=1.29'); await page.waitForTimeout(80); await E('capS.t=1'); await hit('KeyZ', 80); pulls++; if (pulls > 80) break; }
  console.log((await E('meta.own.rd.length')) === 0 ? 'PASS the Sprouts machine gives no Rootdeep items' : 'FAIL the Sprouts machine gave a Rootdeep item');
  await E(`meta.ltix=20;LAN.capTut=1;lanOpen('menu','caps')`);
  while (await E(`pool('rd').length`)) { await hit('KeyZ'); if ((await E('capR.ph')) !== 'shake') { console.log('lantern pull did not start'); break }
    await E('capR.t=1.19'); await page.waitForTimeout(80); await E('capR.t=1'); await hit('KeyZ', 80); pulls++; if (pulls > 120) break; }
  await E(`state='menu'`);
  const own = JSON.parse(await E('JSON.stringify({rd:meta.own.rd.length,left:pool().length,tix:meta.tix})'));
  ok(own.rd === 11 && own.left === 0, `machine emptied in ${pulls} real pulls; Rootdeep items ${own.rd}/11; tickets left ${own.tix}`);
  ok(await E(`charUnlocked('KING')&&charUnlocked('MARCUS')&&charUnlocked('ERIN')&&charUnlocked('LOUIE')`), 'capsule keepers unlock in Rootdeep');
  ok(await E(`rdOwnsWeapon('maul')&&rdOwnsWeapon('bow')`), 'capsule weapons owned in the Armory');
  ok(await E(`RDLANTERNS.every((l,i)=>i===0||rdCapHas(c=>c.lan===l[1]))`), 'all lantern colours selectable');
  const tb = await E('meta.tix+meta.ltix'), pc = await E('pulledCount()');
  await E(`state='settings';setFrom='menu';seti=2;resetArm=0`); await hit('KeyZ', 120); await hit('KeyZ', 150);
  const a = JSON.parse(await E('JSON.stringify({rd:meta.own.rd.length,tix:meta.tix+meta.ltix,pc:pulledCount()})'));
  ok(a.rd === 0 && a.pc === 0 && a.tix === tb + pc, `reset returned ${pc} items, tickets (both kinds) ${tb} -> ${a.tix}`);
  ok(await E('pool().length') === pulls, 'every item is back in the machine');
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none'); await browser.close();
})();
