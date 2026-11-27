/* Console checks: the power-on sequence, the shelf (rows of three, seven cartridges, the Lantern button), and that
   Clankawatch (cartridge 7) boots, reaches its menu and plays a night without errors.
   Run from the repo root:  node alt/tests/console_shelf.js [build.html]   Screenshots: alt/playtest/console/ */
const { chromium } = require('playwright');
const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-alt.html')), OUT = path.join(__dirname, '../playtest/console');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); };
  const E = s => page.evaluate(s => __g.ev(s), s), shot = n => page.screenshot({ path: path.join(OUT, n + '.png') });
  const key = async k => { await page.keyboard.down(k); await page.waitForTimeout(110); await page.keyboard.up(k); await page.waitForTimeout(110); };
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(150);
  ok('power on: the console plays its own start-up and the shelf waits', (await E('state')) === 'pwr' && await page.evaluate(() => document.getElementById('shelf').hidden));
  for (const [ms, n] of [[300, 'boot-1-dark'], [450, 'boot-2-lit'], [700, 'boot-3-name'], [900, 'boot-4-sprouts']]) { await page.waitForTimeout(ms); await shot(n); }
  await page.waitForTimeout(1700); ok('then the shelf comes up by itself', (await E('state')) === 'off' && !(await page.evaluate(() => document.getElementById('shelf').hidden))); await shot('shelf');
  const box = await page.evaluate(() => [...document.querySelectorAll('.cart')].map(c => { const r = c.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.right), Math.round(r.bottom)]; }));
  ok('seven cartridges in rows of three, all on screen, each at least 100 wide', box.length === 7 && box.every(b => b[0] >= 0 && b[3] <= 440 && b[2] >= 100) && Math.abs(box[1][1] - box[2][1]) < 2 && box[4][1] > box[1][1] + 50 && box[6][1] > box[4][1] + 50, box.map(b => b[2]));
  const lb = await page.evaluate(() => { const r = document.getElementById('lanBtn').getBoundingClientRect(); return [r.top, r.bottom]; });
  ok('the Lantern button sits below them, on screen', lb[0] >= Math.max(...box.map(b => b[4])) && lb[1] < 700, lb);
  const seq = []; for (const k of ['ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp']) { await key(k); seq.push((await E('cartSel')) + (await E('lanHi') ? 'L' : '')); }
  ok('the D-pad walks the rows and reaches the Lantern button', seq.join(' ') === '1 2 5 6 3 0 3 6 6L 6', seq.join(' '));
  await page.reload(); await page.waitForTimeout(500); await key('z'); ok('any button skips the start-up', (await E('state')) === 'off');
  await page.evaluate(() => document.querySelector('.cart[data-i="6"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  for (let i = 0; i < 30 && !(await E('state')).startsWith('g5'); i++) { await key('z'); }
  ok('Clankawatch boots to its title', (await E('state')) === 'g5title'); await page.waitForTimeout(300); await shot('clanka-1-title');
  const seen = []; for (let i = 0; i < 60 && !seen.includes('g5play'); i++) { await key(i % 9 === 8 ? 'Enter' : 'z'); const s = await E('state'); if (!seen.includes(s)) { seen.push(s); await shot('clanka-' + (seen.length + 1) + '-' + s); } }
  ok('files, menu, story and a night can be reached', ['g5file', 'g5menu', 'g5play'].every(s => seen.includes(s)), seen);
  await page.evaluate(() => { for (let i = 0; i < 900; i++) { __g.update(1 / 30); for (const k in __g.keys) __g.prev[k] = __g.keys[k]; } __g.draw(); }); await shot('clanka-play');
  ok('thirty seconds of it run clean', (await E('state')).startsWith('g5'), await E('state'));
  ok('its save keeps the old key', await page.evaluate(() => Object.keys(localStorage).some(k => /thornwatch/.test(k))));
  ok('no page errors', !errs.length, errs.slice(0, 5));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
