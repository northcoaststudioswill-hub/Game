/* real-time playthrough of Patch & Plate from a fresh save: the real game loop runs, a bot presses the buttons */
const { chromium } = require('playwright'); const fs = require('fs');
const src = fs.readFileSync(require('path').join(__dirname,'pp_test.js'), 'utf8');
const kit = src.slice(src.indexOf('const PAGE_KIT = () => {') + 'const PAGE_KIT = '.length, src.indexOf('\n};\n\nasync function main') + 2);
const OUT = require('path').resolve(process.argv[2] || require('path').join(__dirname, '../playtest/pp'));   /* node alt/tests/pp_realtime.js [folder for screenshots]; takes about 7 minutes */
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 440, height: 956 } }); const errs = [];
  p.on('pageerror', e => errs.push(String(e.message))); 
  await p.goto('file://'+require('path').resolve(__dirname,'../games/pocket-lantern-alt.html')+'?dev'); await p.waitForTimeout(800);
  await p.evaluate(() => __g.ev('cartPick(3)')); await p.waitForTimeout(3200);
  await p.evaluate('(' + kit + ')()');
  const press = async k => { await p.evaluate(k => { __g.keys[k] = 1; }, k); await p.waitForTimeout(90); await p.evaluate(k => { __g.keys[k] = 0; }, k); await p.waitForTimeout(140); };
  const st = () => p.evaluate(() => { const G = __g.PP._.G; return { s: G.s, k: G.cine && G.cine.k, t: G.cine && (G.cine.d.title || G.cine.d.who), from: G.cine && G.cine.from, d: G.L && G.L.d }; });
  const log = []; let n = 0; const shot = async name => { await p.screenshot({ path: OUT + '/rt_' + String(n++).padStart(2, '0') + '_' + name + '.png' }); };
  await shot('title'); await press('a'); await shot('stand'); await press('a');
  let last = '', t0 = Date.now(), days = 0;
  while (Date.now() - t0 < 9.5 * 60000 && days < 4) {
    const s = await st(); const key = s.s + ':' + (s.k || '') + ':' + (s.t || '');
    if (key !== last) { log.push(Math.round((Date.now() - t0) / 1000) + 's ' + key + (s.d != null ? ' day' + (s.d + 1) : '')); last = key; if (s.s === 'cine') { await p.waitForTimeout(700); await shot('cine_' + s.k + '_' + String(s.t || '').replace(/[^A-Z]/g, '')); } }
    if (s.s === 'intro') { await p.waitForTimeout(400); await press('a'); }
    else if (s.s === 'play') { await p.evaluate(() => __botTick()); await p.waitForTimeout(16); }
    else if (s.s === 'cine') { await p.waitForTimeout(120); }           /* watch the scenes, do not skip */
    else if (s.s === 'done') { await p.waitForTimeout(900); await shot('done_day' + (s.d + 1)); const r = await p.evaluate(() => __g.PP._.G.res); log.push('   result ' + JSON.stringify({ st: r.st, coins: r.coins, served: r.served, n: r.n, missed: r.missed })); days++; await press('a'); }
    else if (s.s === 'stand') { await press('a'); }
    else await p.waitForTimeout(100);
  }
  const sv = await p.evaluate(() => { const S = __g.PP._.SV; return { day: S.day, stars: S.stars, buds: S.buds, big: S.big, story: S.story, fav: S.fav, friend: S.friend, crew: S.crew }; });
  console.log(log.join('\n')); console.log(JSON.stringify(sv)); console.log('page errors:', errs.length ? errs : 'none'); await b.close();
})();
