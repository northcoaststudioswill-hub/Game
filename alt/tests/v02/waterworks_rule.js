/* Rootdeep / Pocket Lantern v0.2 test: waterworks_rule
   Run from the repo root:  node v0.2/tests/waterworks_rule.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/waterworks_rule/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(700);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  const all = () => E(`JSON.stringify(LINES.MARCUS.map(rdLn).concat(RDBARK.MARCUS.map(rdLn)))`);
  const i = await E(`ACH.findIndex(a=>a[0]==='MAKING WAVES')`);
  await E(`delete meta.ach[${i}];RD.flags={cineSeen:1,cine_king:1};hubEnter()`);
  const pre = JSON.parse(await all());
  ok(!(await E('rdWaterworks()')) && !pre.some(l => /waterworks|lazy river/i.test(l)), 'before Waterworks: Marcus never mentions it (' + pre.length + ' lines checked)');
  // page through every line in the real talk screen
  await E(`talkNPC='MARCUS';talkStart=0;talkLine=0;talkTxt=rdLn(LINES.MARCUS[0]);state='g3talk'`); const seen = [await E('talkTxt')];
  for (let k = 0; k < 16; k++) { await page.keyboard.down('KeyZ'); await page.waitForTimeout(60); await page.keyboard.up('KeyZ'); await page.waitForTimeout(80); if ((await E('state')) !== 'g3talk') break; seen.push(await E('talkTxt')); }
  ok(seen.length === 15 && !seen.some(l => /waterworks|lazy river/i.test(l)), 'paging all ' + seen.length + ' lines in the talk box: clean');
  await E(`meta.ach[${i}]=1`);
  const post = JSON.parse(await all());
  ok(await E('rdWaterworks()') && post.filter(l => /waterworks/i.test(l)).length === 3, 'after MAKING WAVES: Waterworks comes up (' + post.filter(l => /waterworks/i.test(l)).length + ' lines)');
  await E(`delete meta.ach[${i}]`);
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none'); await browser.close();
})();
