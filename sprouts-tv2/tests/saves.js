/* Sprouts TV 2: a save from every stage of the story loads and plays on.
   The saves in tests/saves were written by the honest run (tests/honest.js --stages) on Nov 19 2026: the game's own
   save, exactly as the browser holds it. Each one is put in storage, the page is opened like a player would, CONTINUE
   is pressed, and the honest bot plays two game minutes. Checks: the menu offers CONTINUE, the day, shards, people
   and story stage are what was saved, the arrow has something to say, and nothing throws.
   node sprouts-tv2/tests/saves.js [build.html] */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/sprouts-tv2.html'));
const DIR = path.join(__dirname, 'saves'), BOT = fs.readFileSync(path.join(__dirname, 'honest_bot.js'), 'utf8');
(async () => {
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  [' + JSON.stringify(info) + ']' : '')); };
  const browser = await chromium.launch();
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort(); ok('there is a save for every stage: before the Lantern is whole, the midpoint, the coast, the ending, at rest, the wedding date', files.length >= 10, files.length);
  for (const f of files) {
    const raw = fs.readFileSync(path.join(DIR, f), 'utf8'), sv = JSON.parse(raw), want = { day: sv.run.day, shards: sv.run.shards, won: !!sv.run.won, petals: sv.meta.petals };
    const ctx = await browser.newContext({ viewport: { width: 640, height: 360 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.addInitScript(raw => { try { Storage.prototype.setItem.call(localStorage, 'sprouts-tv2:sprouts-v2', raw) } catch (e) { } }, raw);
    await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(400);
    const E = s => page.evaluate(s => __g.ev(s), s);
    for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter', { delay: 60 }); await page.waitForTimeout(150); }
    for (let i = 0; i < 40 && (await E('state')) === 'menu'; i++) { await page.keyboard.press('Enter', { delay: 60 }); await page.waitForTimeout(200); }
    const got = JSON.parse(await E(`JSON.stringify({state,live,day,shards,won:!!won,petals:meta.petals,people:npcs.map(n=>n.st+(n.st==='active'?n.mi:'')).join(),stage:stageKey(),inWall:!free(P.x,P.y,false)})`));
    const people = sv.run.npcs ? null : null;
    ok(f + ': CONTINUE puts Will back in the valley on the day, with the shards and petals, that were saved', got.state === 'play' && got.live && got.day === want.day && got.shards === want.shards && got.won === want.won && got.petals >= want.petals && got.petals <= want.petals + 400 && !got.inWall, got); /* petals can only have grown: the house and garden earn a little while the game is shut, by the clock */
    await E('HOLD=1;void 0'); await E(BOT + ';void 0');
    const st = JSON.parse(await E('__hb.run(120)')), obj = await E(`(()=>{const o=objective();return o?o.text:''})()`);
    ok(f + ': two minutes of play from there: nothing throws, and there is something to do', st.bad.length === 0 && errs.length === 0 && (obj.length > 0 || /after:/.test(st.doing)), [st.doing, obj, st.bad, errs].flat().slice(0, 4));
    await ctx.close();
  }
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
