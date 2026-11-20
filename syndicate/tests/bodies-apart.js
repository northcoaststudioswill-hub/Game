// the two fighters never stand inside each other during a bout: their centres stay at least about a body and a half apart
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = []; const res = [];
  const p = await b.newPage({ viewport: { width: 700, height: 450 } }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(900); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); G.muted = true; }); await p.waitForTimeout(300);
  await p.click('#bNew'); await p.click('.c-skip'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
  for (const cls of ['fighter', 'rogue', 'cleric', 'druid']) {
    res.push(await p.evaluate(cls => { const st = G.state; st.hero = G.newHero('T', 'human', cls); st.hero.level = 5; Object.assign(st, { kitPicked: 1, toured: 1, tourAsked: 1, firstPath: 9, shownPlaces: { a: 1 }, wins: {} }); G.scene = 'hub'; G.fight.active = false; G.ui.hub(); G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); G.debugAuto = true; G.ui.pit(); document.querySelector('[data-under]').click(); for (let i = 0; i < 6 && G.ui.isOpen(); i++) { const q = document.querySelector('#panel #go, #panel .big'); q && q.click(); }
      const F = G.fight; let t = 0, n = 0, inside = 0, minD = 999; while (F.active && t++ < 60 * 90) { F.update(1 / 60); const P = F.P, E = F.E; if (P.state !== 'ko' && E.state !== 'ko' && P.state !== 'dodge' && E.state !== 'dodge' && !(P.z > 10) && !(E.z > 10) && !G.fight.ex) { const d = Math.hypot(P.x - E.x, P.y - E.y); n++; minD = Math.min(minD, d); if (d < 30) inside++; } if (F.E.state === 'ko' || F.P.state === 'ko') break; }
      while (F.active && t++ < 60 * 120) F.update(1 / 30); G.debugAuto = false; return { cls, frames: n, inside, minD: Math.round(minD) }; }, cls)); }
  console.log(res.map(r => JSON.stringify(r)).join('\n')); const ok = res.every(r => r.frames > 200 && r.inside <= 3);
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
