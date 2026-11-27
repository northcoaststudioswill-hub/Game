// the fixes from the first blind playtest: a reload mid-bout counts as walking out, the route-finder reaches the far side of the market,
// E opens a stall a few steps away, Escape steps back a page, a pillar fades when it hides a fighter, the builder keeps controller focus on a card,
// no cantrip repeats a class move, and the Ledger says its first line once
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const errs = []; const R = {};
  const ctx = await b.newContext({ viewport: { width: 1000, height: 650 } }); let p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { window.requestAnimationFrame = () => 0; });
  const boot = async () => { await p.goto('http://localhost:8765/index.html'); for (let i = 0; i < 20; i++) { await p.waitForTimeout(300); if (await p.evaluate(() => { if (window.G && G.bootSkip) { G.bootSkip(); G.bootSkip(); G.muted = true; } return !!document.getElementById('bNew'); })) break; } };
  await boot(); await p.click('#bNew'); await p.click('.c-skip');
  // builder: cantrips and controller focus
  R.builder = await p.evaluate(() => { const go = s => [...document.querySelectorAll('#panel [data-step]')].find(b => b.textContent.toLowerCase().includes(s)); const cls = document.querySelector('#panel [data-cls=sorcerer]'); if (!cls) return 'no builder'; cls.click();
    const card = document.querySelector('#panel [data-cls=rogue]'); card.focus(); card.click(); const n0 = (document.activeElement || {}).dataset || {}; G._pad.nav(1, 0); const f = document.activeElement;
    const focusOk = !!(f && f.dataset && f.dataset.cls); document.querySelector('#panel [data-cls=sorcerer]').click();
    const arts = go('art'); if (arts) arts.click(); const cans = [...document.querySelectorAll('#panel [data-can]')].map(b => b.textContent);
    return { focusOk, focusedCls: f && f.dataset && f.dataset.cls, sorcCantripsHaveFireBolt: cans.some(t => /^Fire Bolt/.test(t)), cans: cans.length }; });
  await p.evaluate(() => { const nx = () => document.querySelector('#panel #go, #panel #nx'); for (let i = 0; i < 8 && nx(); i++) nx().click(); }); await p.waitForTimeout(200); await p.evaluate(() => { const ok = document.querySelector('#panel #ok'); ok && ok.click(); });
  await p.evaluate(() => { const st = G.state; Object.assign(st, { kitPicked: 1, toured: 1, tourAsked: 1, firstPath: 9, shownPlaces: { a: 1 }, coin: 200 }); st.met = Object.assign(st.met || {}, { fence: 1, gm: 1, mark: 1 }); G.ui.close(); if (G.talk) G.talkApi.skip(); G.ui.close(); G.ui.hub(); G.ui.close(); G.world.enter('hub'); G.save(); });
  // Ledger line once
  R.ledger = await p.evaluate(() => { G.ui.pit(); const n = (document.querySelector('#panel').innerText.match(/Nobody is handed a name/g) || []).length; G.ui.close(); return n; });
  // route across the market, and E on a stall a few steps off
  R.walk = await p.evaluate(() => { const W = G.world, w = W.walker, h = W.get('hub'); w.x = 28; w.z = 9; const goal = { x: 5, z: 0.4, r: 2.2, go: () => {} }; W.walkTo(goal); const plen = (w.path || []).length; let t = 0; while (t++ < 60 * 40 && Math.hypot(w.x - 5, w.z - 0.4) > 1.6) { if (G.talk) { G.talkApi.skip(); G.ui.close(); } if (!w.target && !G.talk) W.walkTo(goal); window._T = (window._T || 10) + 1 / 60; W.updateWalk(1 / 60, window._T, false); }       // a street event may stop you to talk on the way: carry on after it
    const arrived = Math.hypot(w.x - 5, w.z - 0.4) < 2.4; for (let k = 0; k < 30 && G.talk; k++) G.talkApi.skip(); G.ui.close(); w.x = 15.6; w.z = 4.3; w.target = null; window._T += 0.1; W.updateWalk(1 / 60, window._T, false); const nearBefore = !!G.near;
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' })); const walking = !!w.target;
    for (let i = 0; i < 60 * 6 && !G.ui.isOpen() && !G.talk; i++) { window._T += 1 / 60; W.updateWalk(1 / 60, window._T, false); } const opened = G.ui.isOpen() || !!G.talk; if (G.talk) G.talkApi.skip(); G.ui.close(); return { plen, arrived, nearBefore, walking, opened }; });
  // a bout (not the first fight, which is a free lesson: see tests/first-fight.js), a pillar, a pause, Settings and Escape, then close the page mid-fight
  R.bout = await p.evaluate(() => { const st = G.state; st.deaths = 0; st.losses = 1; G.save(); G.ui.pit(); document.querySelector('[data-under]').click(); for (let i = 0; i < 6 && G.ui.isOpen(); i++) { const q = document.querySelector('#panel #go, #panel .big'); q && q.click(); }
    const F = G.fight, ar = G.world.get('arena'); for (let i = 0; i < 130; i++) F.update(1 / 60);
    const cam = G.gfx.camera, dir = new THREE.Vector3(); G.gfx.render(); cam.getWorldDirection(dir); let faded = 0; ar.pillars.forEach(pp => { const w = pp.meshes[0].getWorldPosition(new THREE.Vector3()); for (let i = 0; i < 30; i++) ar.seeThrough([[w.x + dir.x * 2.5, 1.1, w.z + dir.z * 2.5]], 1 / 30); const hid = pp.mats[0].opacity < 0.4; for (let i = 0; i < 30; i++) ar.seeThrough([[w.x - dir.x * 2.5, 1.1, w.z - dir.z * 2.5]], 1 / 30); if (hid && pp.mats[0].opacity === 1) faded++; });       // a pillar fades only when a fighter is behind it
    G.ui.pause(); const ps = document.querySelector('#panel #pset'); ps && ps.click(); window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' })); const backToPause = !!document.querySelector('#panel #pset');
    return { open: !!G.state.boutOpen, faded, backToPause, coin: G.state.coin }; });
  await p.close(); p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(() => { window.requestAnimationFrame = () => 0; }); await boot();
  R.reload = await p.evaluate(() => { const c = document.getElementById('bCont'); c && c.click(); return { deaths: G.state.deaths, open: !!G.state.boutOpen, coin: G.state.coin }; });
  await p.waitForTimeout(1700); R.reload.toast = await p.evaluate(() => (document.getElementById('toast') || {}).textContent || '');
  console.log(JSON.stringify(R, null, 1));
  const ok = R.builder.focusOk && !R.builder.sorcCantripsHaveFireBolt && R.ledger === 1 && R.walk.plen > 5 && R.walk.arrived && R.walk.walking && R.walk.opened && R.bout.open && R.bout.faded === 6 && R.bout.backToPause && R.reload.deaths === 1 && !R.reload.open && R.reload.coin < R.bout.coin;
  console.log(ok ? 'PASS' : 'FAIL', 'ERRORS', errs.length, errs.slice(0, 3).join(' | ')); await b.close(); process.exit(ok && !errs.length ? 0 : 1); })();
