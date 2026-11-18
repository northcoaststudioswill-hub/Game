// Story checks: every line fits its box, Louie stays short, each scene plays once and hands back control.
//   node tests/story.js [game.html]
const { chromium } = require('playwright');
const path = require('path');
const file = path.resolve(process.argv[2] || path.join(__dirname, '..', 'Sprouts+Rootdeep+Sproutwild+Thornwatch.html'));
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 430, height: 932 } })).newPage();
  let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail++; };
  p.on('pageerror', e => { fail++; console.log('PAGEERR', e.message); });
  await p.goto('file://' + file); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('.cart[data-i="3"]').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));
  await p.waitForTimeout(4300);
  const T = (fn, a) => p.evaluate(fn, a);
  const key = async k => { await T(k => { window.__g.keys[k] = 1; }, k); await p.waitForTimeout(60); await T(k => { window.__g.keys[k] = 0; }, k); await p.waitForTimeout(60); };
  const bad = await T(() => window.__g.TWF().storyAudit());
  ok(bad.length === 0, 'every story line fits in three rows; Louie <= 43 chars' + (bad.length ? '\n     ' + bad.join('\n     ') : ''));
  // fresh save: PLAY -> intro -> the run
  await key('start'); await p.waitForTimeout(200); await key('a'); await p.waitForTimeout(200); await key('a'); await p.waitForTimeout(300);
  ok(await T(() => window.__g.TWF().state()) === 'g5cine', 'first PLAY opens the intro');
  let n = 0; while (await T(() => window.__g.TWF().state()) === 'g5cine' && n < 80) { await key('a'); await p.waitForTimeout(140); n++; }
  ok(await T(() => window.__g.TWF().state()) === 'g5play', 'A walks the intro to the garden (' + n + ' presses)');
  ok(await T(() => window.__g.TWF().introSeen() && window.__g.TWF().seen().intro === 1), 'intro is marked seen');
  // each gated scene: plays once, START skips, then the game carries on
  for (const m of [2, 3]) {
    await T(m => window.__g.TWF().newRunAt(m, 's', 1), m);
    ok(await T(() => window.__g.TWF().intro().key) === 'g' + m, 'garden ' + m + ' opens with its scene');
    await key('start'); await p.waitForTimeout(150);
    ok(await T(() => { const R = window.__g.TWF().runMap(); return window.__g.TWF().state() === 'g5play' && R.map; }) === m, 'START skips it into garden ' + m);
    await T(m => window.__g.TWF().newRunAt(m, 's', 1), m);
    ok(await T(() => window.__g.TWF().state()) === 'g5play', 'second visit to garden ' + m + ' has no scene');
  }
  for (const m of [1, 2, 3]) {
    const last = m === 1 ? 10 : 8;
    await T(([m, last]) => { const F = window.__g.TWF(); F.meta().seen['g' + m] = 1; F.newRunAt(m, 's', last); F.run().card = null; F.startNight(); }, [m, last]);
    ok(await T(() => window.__g.TWF().intro() && window.__g.TWF().intro().key) === 'b' + m, 'boss night of garden ' + m + ' opens with its scene');
    await key('start'); await p.waitForTimeout(150);
    ok(await T(() => window.__g.TWF().state() === 'g5play' && window.__g.TWF().round()), 'then the round starts');
    // kill everything so the garden is held
    await T(() => { const F = window.__g.TWF(); F.skipCine(); const R = F.run(); R.queue.length = 0; R.creeps.length = 0; });
    await p.waitForTimeout(400);
    ok(await T(() => window.__g.TWF().intro() && window.__g.TWF().intro().key) === 'w' + m, 'holding garden ' + m + ' plays its ending');
    await key('start'); await p.waitForTimeout(150);
    ok(await T(() => window.__g.TWF().state()) === 'g5win', 'then the win screen');
    await key('a'); await p.waitForTimeout(150);
  }
  // an old save has no `seen`: it loads, and nothing is granted
  await T(() => { localStorage.setItem('thornwatch-v1', JSON.stringify({ best: 4, wins: 0, plays: 3, guideDone: true, introSeen: true, stars: { '1s1': 3 }, drops: 3, perks: [], endlessBest: 0 })); });
  await p.reload(); await p.waitForTimeout(400);
  const old = await T(() => { const s = window.__g.TW(); return { seen: JSON.stringify(s.seen), drops: s.drops, stars: Object.keys(s.stars).length }; });
  ok(old.seen === '{}' && old.drops === 3 && old.stars === 1, 'a v3.7 save loads with an empty seen list and nothing extra');
  console.log(fail ? fail + ' FAILED' : 'story: all passed'); await b.close(); process.exit(fail ? 1 : 0);
})();
