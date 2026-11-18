// Screenshots of Thornwatch at an iPhone-shaped screen. Run:
//   node tests/shots.js [game.html] [out dir]
// Writes one PNG per screen plus sheet-ready names. Uses the TWF test hooks to jump around.
const { chromium } = require('playwright');
const path = require('path');
const file = path.resolve(process.argv[2] || path.join(__dirname, '..', 'Sprouts+Rootdeep+Sproutwild+Thornwatch.html'));
const out = path.resolve(process.argv[3] || path.join(__dirname, '..', 'shots', 'latest'));
require('fs').mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  let errs = 0;
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('ERR_FILE')) { errs++; console.log('CONSOLE', m.text().slice(0, 300)); } });
  p.on('pageerror', e => { errs++; console.log('PAGEERR', e.message); });
  await p.goto('file://' + file);
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.cart[data-i="3"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await p.waitForTimeout(4300);
  const key = async (k, ms) => { await p.evaluate(k => { window.__g.keys[k] = 1; }, k); await p.waitForTimeout(ms || 70); await p.evaluate(k => { window.__g.keys[k] = 0; }, k); await p.waitForTimeout(110); };
  let n = 0;
  const shot = async l => { n++; await p.locator('#screen').screenshot({ path: out + '/' + String(n).padStart(2, '0') + '_' + l + '.png' }); };
  const T = fn => p.evaluate(fn);
  await shot('title'); await key('start'); await p.waitForTimeout(300); await shot('files'); await key('a'); await p.waitForTimeout(300); await shot('menu');
  await key('a'); await p.waitForTimeout(600);
  for (let i = 0; i < 12; i++) { const st = await T(() => window.__g.TWF().state()); if (st !== 'g5cine') break; await shot('story' + i); await key('a'); await p.waitForTimeout(350); }
  await p.waitForTimeout(400); await key('a'); await p.waitForTimeout(300); await shot('g1_day_empty');
  // a built garden, mid-fight, on each map
  for (const m of [1, 2, 3]) {
    await T(() => { const s = window.__g.TWF().meta(); s.guideDone = true; s.introSeen = true; if (s.seen) for (const k of ['g1', 'g2', 'g3', 'b1', 'b2', 'b3']) s.seen[k] = 1; });
    await p.evaluate(m => { const F = window.__g.TWF(); F.newRunAt(m, 's', 5); const R = F.run(); R.card = null; R.petals = 999;
      let k = 0; for (let y = 60; y < 250 && k < 9; y += 16) for (let x = 24; x < 220 && k < 9; x += 16) { if (F.spotOK(x, y) && Math.abs(F.distToPath(x, y) - 20) < 6 && (x * 7 + y * 3) % 5 === 0) { const t = F.plantAt(x, y, k % 6, 1 + (k % 3)); t.variant = t.lv > 1 ? 1 + (k % 2) : 0; k++; } }
      for (let h = 0; h < 3; h++) { for (let y = 70 + h * 50; y < 260; y += 16) { let done = false; for (let x = 40 + h * 30; x < 200; x += 16) if (F.spotOK(x, y)) { F.placeHero(x, y, h); done = true; break; } if (done) break; } } }, m);
    await p.waitForTimeout(250); await shot('g' + m + '_day');
    await T(() => { window.__g.TWF().startNight(); window.__g.TWF().skipCine(); });
    await p.waitForTimeout(7000); await shot('g' + m + '_night');
    await p.waitForTimeout(5000); await shot('g' + m + '_night2');
  }
  await key('start'); await p.waitForTimeout(250); await shot('pause');
  await key('a'); await p.waitForTimeout(150);
  // one frame from each story scene
  for (const k of (process.env.ALLSTORY ? ['b1', 'w1', 'g2', 'b2', 'w2', 'g3', 'b3', 'w3'] : ['b1', 'b3'])) {
    const scenes = await p.evaluate(k => { const F = window.__g.TWF(); F.storyPlay(k); return 1; }, k);
    let last = -1;
    for (let i = 0; i < 14; i++) { const st = await T(() => window.__g.TWF().intro()); if (!st) break;
      await p.waitForTimeout(st.scene !== last ? 2300 : 1500); if (st.scene !== last || st.line === 1 || st.line === 2) await shot('story_' + k + '_' + st.scene + '_' + st.line); last = st.scene;
      await key('a'); await key('a'); }
  }
  console.log('shots', n, 'errors', errs, '->', out);
  await b.close();
  process.exit(errs ? 1 : 0);
})();
