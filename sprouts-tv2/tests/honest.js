/* Sprouts TV 2: the honest run. A bot plays from a new game with the controller's buttons only (see honest_bot.js)
   and this prints what it got done, when, and where it gave up. Nothing is carried, opened, spawned or counted for it.
   node sprouts-tv2/tests/honest.js [--days N] [--from save.json] [--save out.json] [--stages dir] [--stop id] [--beat secs] [--quiet]
     --from    start from a real save: it is put in the browser's storage, the page is opened and CONTINUE is pressed
     --save    write the game's own save at the end (what the browser would hold)
     --stages  write a save into this folder each time the story moves to a new stage
     --stop    stop when this ask is handed in (for example --stop e8), or "end" for the last scene */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i < 0 ? d : (process.argv[i + 1] || true) };
const BUILD = path.resolve(arg('build', path.join(__dirname, '../games/sprouts-tv2.html')));
const DAYS = +arg('days', 3), FROM = arg('from', ''), SAVE = arg('save', ''), STOP = arg('stop', ''), STAGES = arg('stages', ''), QUIET = process.argv.includes('--quiet');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  if (FROM) { const raw = fs.readFileSync(FROM, 'utf8'); await page.addInitScript(raw => { try { Storage.prototype.setItem.call(localStorage, 'sprouts-tv2:sprouts-v2', raw) } catch (e) { } }, raw); }
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
  const E = s => page.evaluate(s => __g.ev(s), s);
  for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter', { delay: 70 }); await page.waitForTimeout(200); }
  if (FROM) { /* the menu must offer CONTINUE, and pressing it must put Will back in the valley */
    const first = await E(`(()=>{const L=[];return typeof menuItems==='function'?menuItems()[mi]:''})()`).catch(() => '');
    for (let i = 0; i < 40 && (await E('state')) === 'menu'; i++) { await page.keyboard.press('Enter', { delay: 70 }); await page.waitForTimeout(250); }
    if ((await E('state')) !== 'play' || !(await E('live'))) { console.log('LOAD FAILED: state ' + await E('state') + ' ' + first); await browser.close(); process.exit(2) }
    await E('HOLD=1;void 0');
  } else { await E('HOLD=1;void 0'); await E(`init();live=true;persist(true);c3Play('dawn',()=>c3Play('open',()=>talk(npcs[0])));void 0`); } /* exactly what PLAY on the menu does */
  await E(fs.readFileSync(path.join(__dirname, 'honest_bot.js'), 'utf8') + ';void 0'); await E(`__hb.beat=${+arg('beat', 0)};void 0`);
  const dump = () => E(`(()=>{persist(true);return localStorage.getItem('sprouts-v2')})()`);
  const day0 = await E('day'); let st, shown = 0, stage = await E('stageKey()');
  if (STAGES) fs.mkdirSync(STAGES, { recursive: true });
  for (; ;) {
    st = JSON.parse(await E('__hb.run(20)'));
    const log = JSON.parse(await E('JSON.stringify(__hb.log)')); if (!QUIET) for (; shown < log.length; shown++)console.log(log[shown]); else shown = log.length;
    if (STAGES && st.state === 'play') { const k = await E('stageKey()+"|"+shards+"|"+(run.key?1:0)'); if (k !== stage) { stage = k; fs.writeFileSync(path.join(STAGES, 'day' + String(st.day).padStart(2, '0') + '-' + k.replace(/\|/g, '_') + '.json'), await dump()) } }
    if (st.day >= day0 + DAYS) break; if (STOP === 'end' ? await E('!!run.rest&&!!run.wed') : STOP && await E(`!!__hb.done[${JSON.stringify(STOP)}]`)) break; if (st.bad.length > 5) break;
  }
  console.log('\nSTATUS ' + JSON.stringify(st));
  console.log('DONE   ' + await E('JSON.stringify(__hb.done)'));
  console.log('STORY  ' + await E(`JSON.stringify({stage:stageKey(),shards,won,fin:!!run.fin,rest:!!run.rest,wed:!!run.wed,book:wedN()+'/'+WED.length,lou:louLv(),treasures:meta.trs.length,petals:meta.petals,rank:rankOf(meta.xp)[0],scenes:Object.keys(meta.scn||{}).length,gaveUp:__hb.gave})`));
  if (SAVE) { fs.writeFileSync(SAVE, await dump()); console.log('saved ' + SAVE) }
  if (errs.length) console.log('PAGE ERRORS', errs.slice(0, 5));
  await browser.close(); process.exit(errs.length || st.bad.length ? 1 : 0);
})();
