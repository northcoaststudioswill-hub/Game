const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 900, height: 620 } }); p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1]));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(500);
  await p.click('#bNew'); await p.click('.c-skip'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
  console.log(await p.evaluate(() => { G.muted = true; const st = G.state; st.toured = 1; st.tourAsked = 1; st.kitPicked = 1; st.shownPlaces = { a: 1 }; G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); const out = [];
    for (const [c, r, lvl, rsp, extra] of [['fighter', 'human', 1, 0, {}], ['rogue', 'drow', 4, 400, { fallen: [{ n: 'A' }, { n: 'B' }, { n: 'C' }] }], ['warlock', 'tiefling', 8, 2000, { signed: true, loanM: 50 }], ['druid', 'dwarf', 3, 100, { deaths: 1 }], ['cleric', 'elf', 6, 900, {}], ['sorcerer', 'halforc', 2, 60, {}]]) {
      st.hero = G.newHero('T', r, c); st.hero.level = lvl; st.respect = rsp; st.signed = false; st.bound = false; st.loanM = 0; st.deaths = 0; st.fallen = []; Object.assign(st, extra); st.evRecent = []; const seen = {};
      for (let i = 0; i < 60; i++) { st.coin = 200; G.ui.event(); const t = (document.querySelector('#panel h2') || {}).textContent; seen[t] = (seen[t] || 0) + 1; const btn = document.querySelector('#panel [data-c]'); btn && btn.click(); const x = document.querySelector('#panel #x'); x && x.click(); G.ui.close(); }
      const names = Object.keys(seen), mine = names.filter(n => G.EVENTS_MORE.some(e => e.title === n && e.when)); out.push(c + '/' + r + ' L' + lvl + ': ' + names.length + ' different in 60, tailored seen: ' + mine.join(', ')); }
    return out.join('\n'); }));
  console.log('ERRORS', errs.length, errs.slice(0, 3).join(' || ')); await b.close(); })();
