/* Sprouts tour for the ALT build: plays from a fresh save by following the objective marker, in real time.
   Run from the repo root:  node bottie/tests/sprouts_tour.js [build.html] [seconds]
   Screenshots (one every ~5 s) and a log go to bottie/playtest/sprouts/. */
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/pocket-lantern-bottie.html'));
const SECS = +(process.argv[3] || 150);
const OUT = path.join(__dirname, '../playtest/sprouts'); fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.png')) fs.unlinkSync(path.join(OUT, f)); // fresh shots each run
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/blob|Failed to load|ERR_FILE/.test(m.text())) errs.push('console: ' + m.text()); });
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector('.cart[data-i="0"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  const E = s => page.evaluate(s => __g.ev(s), s);
  const st = () => E('state');
  const tap = async (k, ms = 60) => { await page.keyboard.down(k); await page.waitForTimeout(70); await page.keyboard.up(k); await page.waitForTimeout(ms); };
  const cv = await page.$('#screen');
  let n = 0; const shot = async tag => { await cv.screenshot({ path: path.join(OUT, String(n++).padStart(2, '0') + '_' + tag + '.png') }); };
  for (let i = 0; i < 40 && (await st()) !== 'menu'; i++) await tap('Enter', 250);
  await shot('menu');
  await tap('Enter', 600);
  const log = []; const seen = new Set();
  const t0 = Date.now(); let lastShot = 0, held = null;
  const hold = async k => { if (held === k) return; if (held) await page.keyboard.up(held); held = k; if (k) await page.keyboard.down(k); };
  while (Date.now() - t0 < SECS * 1000) {
    const s = await st();
    if (!seen.has(s)) { seen.add(s); log.push(((Date.now() - t0) / 1000).toFixed(0) + 's state ' + s); await shot('state_' + s); }
    if (['cine', 'talk', 'card', 'intro', 'rewards', 'dayend', 'win', 'hop'].includes(s)) { await hold(null); await tap('KeyZ', 200); continue; }
    if (s === 'pan' || s === 'travel') { await hold(null); await page.waitForTimeout(200); continue; }
    if (s !== 'play') { await hold(null); await tap('KeyX', 200); continue; }
    const o = await E('(()=>{const o=objective();return o?{t:o.text,x:o.x,y:o.y,px:P.x,py:P.y,buds:buds.length,day,time:Math.round(dayT||0)}:null})()');
    if (!o) { await hold(null); await page.waitForTimeout(200); continue; }
    if (!log.length || log[log.length - 1].indexOf(o.t) < 0) log.push(((Date.now() - t0) / 1000).toFixed(0) + 's obj: ' + o.t + ' (buds ' + o.buds + ', day ' + o.day + ')');
    const dx = o.x - o.px, dy = o.y - o.py;
    if (Math.hypot(dx, dy) > 14) await hold(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (dy > 0 ? 'ArrowDown' : 'ArrowUp'));
    else { await hold(null); await tap('KeyZ', 80); }
    if (Math.random() < .08) await tap('KeyZ', 30);
    await page.waitForTimeout(90);
    if (Date.now() - lastShot > 5000) { lastShot = Date.now(); await shot('play'); }
  }
  await hold(null);
  log.push('page errors: ' + (errs.length ? errs.join(' | ') : 'none'));
  fs.writeFileSync(path.join(OUT, 'log.txt'), log.join('\n'));
  console.log(log.join('\n'));
  await browser.close();
})();
