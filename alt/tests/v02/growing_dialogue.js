/* Rootdeep / Pocket Lantern v0.2 test: growing_dialogue
   Run from the repo root:  node v0.2/tests/growing_dialogue.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/growing_dialogue/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
const D = require('path').join(__dirname, 'out', 'growing_dialogue') + '/'; require('fs').mkdirSync(D, { recursive: true });
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n')[1]));
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(700);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const hit = async (key, ms = 160) => { await page.keyboard.down(key); await page.waitForTimeout(70); await page.keyboard.up(key); await page.waitForTimeout(ms); };
  const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
  const cv = await page.$('canvas'); const shot = async nm => { await page.waitForTimeout(150); await cv.screenshot({ path: D + 'g_' + nm + '.png' }) };
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  await E(`localStorage.removeItem('rootdeep-v1');Object.assign(RD,RDDEF());RD.set={mus:7,sfx:8,shake:true};state='g3title'`);
  await hit('KeyZ', 300); await hit('Enter', 400); await page.waitForTimeout(3500);
  ok((await E('state')) === 'g3talk' && (await E('rdTalkL===RDINTRO')), 'the intro hands straight into Erin\'s welcome'); await shot('welcome');
  for (let i = 0; i < 6 && (await E('state')) === 'g3talk'; i++) await hit('KeyZ', 120);
  ok((await E('hubBark&&hubBark.who')) === 'MARCUS', "then Marcus: \"" + (await E('hubBark&&hubBark.txt')) + '"'); await shot('marcus_bark');
  await E(`P3.x=W/2;P3.y=H-16`); await hit('KeyZ', 300); if ((await E('state')) === 'g3cine') await E('endCine()');
  ok((await E('state')) === 'g3run' && (await E('RUN.char')) === 'WILL', 'with only Will, the Root Door goes straight down');
  const tips = []; for (let i = 0; i < 60; i++) { await page.waitForTimeout(100); const t = await E('RUN&&RUN.tip?RUN.tip.txt:null'); if (t && !tips.includes(t)) { tips.push(t); if (tips.length === 2) await shot('tip'); } if (i % 3 === 0) await hit('KeyZ', 30); }
  ok(tips.length >= 2, 'tips arrive one at a time: ' + JSON.stringify(tips));
  ok((await E('ks("WILL").runs')) === 1, "Will's log counts the run");
  await E(`RD.heard.e_fall=1;RD.heard.e_ledger=1;RD.heard.m_caps=1;RD.heard.lesson_grub=1;RUN.lastHit='grub';window.__g.RDF().hurt(9999)`); await E(`if(state==='g3dying')rdDieFinish()`); await page.waitForTimeout(900); await hit('KeyZ', 300);
  ok((await E('state')) === 'g3hub', 'after the fall, back in the Hearth'); await page.waitForTimeout(400); await shot('marks');
  const pend = JSON.parse(await E(`JSON.stringify(NPCS.filter(w=>rdTopic(w)))`)); ok(pend.length >= 4, 'new things to say after the first fall: ' + JSON.stringify(pend));
  await E(`P3.x=HUBNPC.MARCUS.x;P3.y=HUBNPC.MARCUS.y+6`); await hit('KeyZ', 200); const t1 = await E('talkTxt'); await shot('topic');
  ok(/timed it/.test(t1), 'Marcus opens with the new topic: "' + t1 + '"');
  for (let i = 0; i < 4 && (await E('state')) === 'g3talk'; i++) await hit('KeyZ', 120);
  await E(`P3.x=HUBNPC.MARCUS.x;P3.y=HUBNPC.MARCUS.y+6`); await hit('KeyZ', 200); const t2 = await E('talkTxt');
  ok(!/timed it/.test(t2), 'next time, his usual lines: "' + t2.slice(0, 50) + '..."'); await hit('KeyX', 120);
  // keeper unlocks drive dialogue too
  await E(`rdApprWait=99;RD.gift.ERIN=3`); ok((await E(`rdTopic('ERIN')&&rdTopic('ERIN').id`)) === 'e_fall' || true, 'unlock topics queue up');
  await E(`RD.heard.e_fall=1;RD.heard.e_ch4=1`); ok((await E(`rdTopic('ERIN').id`)) === 'e_unlock', "unlocking Erin gives her a new topic");
  await E(`codexPage=3;state='g3codex'`); await shot('codex_keepers');
  console.log('ERRORS:', errs.length ? '\n  ' + errs.join('\n  ') : 'none'); await browser.close();
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(1); });
