// How many pictures a second the real game loop manages in every level, on a CPU slowed 4x to stand in for a phone.
// (Timing draw calls in a tight loop misleads: the browser defers the painting and pays for it later in one lump.)
// Usage: node starhaven/game/tests/perf.js [slowdown]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const rate = +process.argv[2] || 4;
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2 });
  await page.route(/fonts\./, r => r.abort());
  await page.goto('file://' + path.resolve(__dirname, '..', 'starhaven.html')); await page.waitForTimeout(300);
  const cdp = await page.context().newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await page.evaluate(() => { SH.front.go(() => { }); const f = SH.draw.frame; window.__n = 0; SH.draw.frame = function (a, c) { window.__n++; return f(a, c); }; });
  let low = 99;
  for (const [room, x, y] of [['woods', 30, 16], ['woods', 96, 16], ['deep', 60, 16], ['ashes', 70, 16], ['ring', 80, 16], ['mountain', 20, 16], ['mountain', 134, 14], ['library', 20, 20], ['library', 80, 20], ['library', 135, 20]]) {
    await page.evaluate(([room, x, y]) => { SH.test.load(room, { story: false }); SH.test.place(x, y); const G = SH.game; if ((room === 'mountain' || room === 'library') && x > 100) { const bo = G.world.things.find(e => e.boss); bo.wake(); G.boss = bo; } if (room === 'library') { G.flags.bow4 = G.flags.stacks4 = true; } SH.input.forced = null; G.frozen = false; G.state = 'play'; }, [room, x, y]);
    await page.waitForTimeout(700); const n0 = await page.evaluate(() => window.__n); await page.waitForTimeout(3000); const n1 = await page.evaluate(() => window.__n);
    const fps = (n1 - n0) / 3; low = Math.min(low, fps);
    console.log((fps < 40 ? 'SLOW ' : 'ok   ') + (room + '@' + x).padEnd(14) + fps.toFixed(0) + ' pictures a second');
    await page.evaluate(() => { SH.game.frozen = true; });
  }
  console.log('slowest: ' + low.toFixed(0) + ' a second at ' + rate + 'x CPU slowdown (software drawing; a phone draws with its graphics chip)');
  await b.close();
})();
