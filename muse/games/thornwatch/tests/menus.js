// Menu checks, driven by real key presses: files, new game, erase, the main menu, options, almanac.
//   node tests/menus.js [game.html] [shots dir]
const { chromium } = require('playwright');
const path = require('path');
const file = path.resolve(process.argv[2] || path.join(__dirname, '..', 'Sprouts+Rootdeep+Sproutwild+Thornwatch.html'));
const out = process.argv[3] ? path.resolve(process.argv[3]) : null; if (out) require('fs').mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: out ? 2 : 1 })).newPage();
  let fail = 0, n = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail++; };
  p.on('pageerror', e => { fail++; console.log('PAGEERR', e.message); });
  const boot = async () => { await p.goto('file://' + file); await p.waitForTimeout(400); await p.evaluate(() => document.querySelector('.cart[data-i="3"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))); await p.waitForTimeout(4300); };
  const T = (fn, a) => p.evaluate(fn, a), S = () => T(() => window.__g.TWF().state());
  const key = async (k, times) => { for (let i = 0; i < (times || 1); i++) { await T(k => { window.__g.keys[k] = 1; }, k); await p.waitForTimeout(60); await T(k => { window.__g.keys[k] = 0; }, k); await p.waitForTimeout(90); } };
  const shot = async l => { if (!out) return; n++; await p.locator('#screen').screenshot({ path: out + '/' + String(n).padStart(2, '0') + '_' + l + '.png' }); };
  await boot();
  const bad = await T(() => { const F = window.__g.TWF(); return F.menuAudit(); });
  ok(bad.length === 0, 'every menu string fits its box' + (bad.length ? '\n     ' + bad.join('\n     ') : ''));
  await shot('title'); await key('start'); ok(await S() === 'g5file', 'START on the title opens the files'); await shot('files_empty');
  // a new game on file 2
  await key('down'); await key('a'); ok(await S() === 'g5menu' && await T(() => window.__g.TWF().slot()) === 1, 'A on file 2 starts a new game there'); await shot('menu_new');
  // earn something on file 2
  await T(() => { const F = window.__g.TWF(), M = F.meta(); M.stars['1s1'] = 3; M.stars['1s2'] = 2; M.drops = 5; M.introSeen = true; M.plays = 1; localStorage.setItem('thornwatch-v1-b', JSON.stringify(M)); });
  await shot('menu_progress');
  await key('down'); await key('a'); ok(await S() === 'g5map', 'GARDENS opens'); await shot('gardens'); await key('up'); await key('up'); await key('right'); await shot('gardens_locked'); await key('b');
  await key('down'); await key('a'); ok(await S() === 'g5upg', 'THE LANTERN opens'); await shot('lantern'); await key('b');
  await key('down'); await key('a'); ok(await S() === 'g5menu', 'THE LONG NIGHT stays shut until three gardens are held'); await shot('long_locked');
  await key('down'); await key('a'); ok(await T(() => window.__g.TWF().howPage()) === 0, 'ALMANAC opens'); await shot('almanac'); await key('right', 2); await shot('drones'); await key('right', 2); await shot('lore_open'); await key('right', 4); await shot('lore_shut'); await key('b');
  await key('down'); await key('a'); ok(await S() === 'g5set', 'OPTIONS opens'); await shot('options'); await key('down', 3); await key('a'); ok(await S() === 'g5file', 'CHANGE FILE goes back to the files'); await shot('files_one_used');
  // file 1 is still empty: progress did not leak across files
  const info = await T(() => [0, 1, 2].map(i => { const s = localStorage.getItem(['thornwatch-v1', 'thornwatch-v1-b', 'thornwatch-v1-c'][i]); return s ? Object.keys(JSON.parse(s).stars).length : -1; }));
  ok(info[1] === 2 && info[2] === -1, 'file 2 holds its stars, file 3 is untouched (' + info.join(',') + ')');
  // erase asks first, and defaults to KEEP
  await key('sel'); ok(await T(() => window.__g.TWF().files().erase), 'SELECT on a used file asks before erasing'); await shot('erase_ask');
  await key('a'); ok(await T(() => !!localStorage.getItem('thornwatch-v1-b')), 'A on the default answer keeps the file');
  await key('sel'); await key('right'); await key('a'); ok(await T(() => !localStorage.getItem('thornwatch-v1-b')), 'choosing ERASE removes it'); await shot('erased');
  await key('up'); await key('sel'); ok(await T(() => !window.__g.TWF().files().erase), 'SELECT on an empty file does nothing');
  // a v3.7 save in the old key shows up as file 1
  await T(() => localStorage.setItem('thornwatch-v1', JSON.stringify({ best: 4, wins: 0, plays: 3, guideDone: true, introSeen: true, stars: { '1s1': 3, '1s2': 3, '1s3': 2 }, drops: 8, perks: [], endlessBest: 0 })));
  await boot(); await key('start'); await shot('files_old_save'); await key('up', 3); await T(() => { }); 
  await T(() => { const f = window.__g.TWF().files(); });
  while (await T(() => window.__g.TWF().files().sel) !== 0) await key('up');
  await key('a'); ok(await T(() => window.__g.TWF().slot() === 0 && window.__g.TWF().drops() === 8), 'the old single save is file 1, with its drops'); await shot('menu_old_save');
  await key('a'); await p.waitForTimeout(300); ok(await S() === 'g5play' && await T(() => window.__g.TWF().runMap().night) === 4, 'CONTINUE goes to the next unheld night');
  await key('start'); await p.waitForTimeout(200); await key('start'); await p.waitForTimeout(300);
  console.log(fail ? fail + ' FAILED' : 'menus: all passed'); await b.close(); process.exit(fail ? 1 : 0);
})();
