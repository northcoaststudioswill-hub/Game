const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 1100, height: 620 } }); p.on('pageerror', e => errs.push(e.message + (e.stack || '').split('\n')[1]));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(700); await p.evaluate(() => { G.bootSkip(); G.bootSkip(); }); await p.waitForTimeout(500);
  await p.click('#bNew'); await p.click('.c-skip'); await p.click('#go'); await p.click('#ok'); await p.waitForTimeout(150);
  const res = await p.evaluate(() => { G.muted = true; const st = G.state; st.toured = 1; st.tourAsked = 1; st.kitPicked = 1; st.shownPlaces = { a: 1 }; st.coin = 3000; st.respect = 3000; st.hero.level = 6; st.wins = { a: 4, vexa: 1 }; st.deaths = 1; st.seen = {}; G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close();
    const seenK = new Set(); const MENUS = ['sheet', 'pit', 'trainer', 'board', 'tally', 'mark', 'wisp', 'armory', 'tailor', 'outfitter', 'charms', 'whisper', 'settings', 'oracle', 'catalog', 'codex', 'fallen', 'stair', 'pauseMenu', 'myMoves', 'homePerks', 'vendor:cook', 'vendor:apoth', 'talkTo:pip', 'talkTo:tibb', 'pipPlaces', 'knuckle', 'knives', 'fence', 'shop', 'loanMarc', 'loanDavid'];
    const out = [];
    for (const m0 of MENUS) { const [m, arg] = m0.split(':'); if (typeof G.ui[m] !== 'function') { out.push([m0, 'no such menu']); continue; }
      G.ui.close(); if (G.talk) G.talkApi.skip(); G.scene = m === 'catalog' || m === 'homePerks' ? 'hideout' : 'hub';
      try { G.ui[m](arg); } catch (e) { out.push([m0, 'THREW ' + e.message.slice(0, 60)]); continue; }
      if (G.talk) { out.push([m0, 'opened a conversation']); G.talkApi.skip(); continue; }
      // get past one-time intro cards
      for (let k = 0; k < 2; k++) { const intro = document.querySelector('#panel #ok'); if (intro && /Go on/.test(intro.textContent)) intro.click(); }
      if (!G.ui.isOpen()) { out.push([m0, 'did not open']); continue; }
      const h = ((document.querySelector('#panel h1, #panel h2') || {}).textContent || '').replace('✕', '').slice(0, 26), all = G._pad.list(); all.forEach((el, i) => el._i = i);
      document.activeElement && document.activeElement.blur(); G._pad.nav(0, 1); const st0 = document.activeElement; const got = new Set(st0 && st0._i != null ? [st0._i] : []), q = st0 ? [st0] : []; while (q.length) { const el = q.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { el.focus(); G._pad.nav(dx, dy); const a2 = document.activeElement; if (a2 && a2._i != null && !got.has(a2._i)) { got.add(a2._i); q.push(a2); } } }
      const miss = all.filter(el => !got.has(el._i)).map(el => el.textContent.trim().slice(0, 18) || el.className);
      const nonBtn = [...document.querySelectorAll('#panel [onclick], #panel [data-t], #panel [data-p], #panel .slot, #panel .opp, #panel label, #panel input, #panel select')].filter(el => el.tagName !== 'BUTTON' && el.offsetParent && (el.onclick || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'LABEL')).map(el => el.tagName + ':' + (el.textContent || '').trim().slice(0, 14));
      const backed = G._pad.back(); const after = G.ui.isOpen() ? ((document.querySelector('#panel h1, #panel h2') || {}).textContent || '').replace('✕', '').slice(0, 22) : 'closed';
      out.push([m0, h, all.length + ' btns', miss.length ? 'UNREACHABLE: ' + miss.slice(0, 6).join(' | ') : 'all reachable', nonBtn.length ? 'NOT-BUTTON: ' + nonBtn.slice(0, 4).join(' | ') : '', 'B→ ' + (backed ? after : 'NO WAY BACK')]); }
    return out.map(r => r.join('  ·  ')).join('\n'); });
  console.log(res); console.log('ERRORS', errs.length, [...new Set(errs)].slice(0, 4).join(' || ')); await b.close(); })();
