/* Rootdeep / Pocket Lantern v0.2 test: playtest_bot
   Run from the repo root:  node v0.2/tests/playtest_bot.js [path/to/build.html]
   Default build: v0.2/games/pocket-lantern_2026-11-14_v20_wip.html. Needs Playwright + Chromium
   (in Claude cloud sessions Chromium is at /opt/pw-browsers/chromium). Screenshots go to v0.2/tests/out/playtest_bot/. */
const { chromium } = require('playwright');
const BUILD = require('path').resolve(process.argv[2] || require('path').join(__dirname, '..', 'games', 'pocket-lantern_2026-11-14_v20_wip.html'));
const SHOTS = require('path').join(__dirname, 'out', 'playtest_bot') + '/'; require('fs').mkdirSync(SHOTS, { recursive: true });
(async () => {
  const browser = await chromium.launch(require('fs').existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] } : {});
  const page = await browser.newPage({ viewport: { width: 440, height: 956 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack||'').split('\n')[1]));
  page.on('console', m => { if (m.type() === 'error' && !/ERR_FILE_NOT_FOUND/.test(m.text())) errs.push('console: ' + m.text()); });
  await page.goto('file://' + BUILD + '?dev', { waitUntil: 'load' }); await page.waitForTimeout(700);
  const E = c => page.evaluate(c => window.__g.ev(c), c);
  const down = new Set(); const hold = async (k, on) => { if (on && !down.has(k)) { await page.keyboard.down(k); down.add(k) } else if (!on && down.has(k)) { await page.keyboard.up(k); down.delete(k) } };
  const tap = async (k, ms = 40) => { await page.keyboard.down(k); await page.waitForTimeout(ms); await page.keyboard.up(k); };
  const cv = await page.$('canvas'); const shot = async nm => cv.screenshot({ path: SHOTS + nm + '.png' });
  // frame timing
  await page.evaluate(() => { window.__ft = []; let l = performance.now(); const f = t => { window.__ft.push(t - l); l = t; if (window.__ft.length > 4000) window.__ft.shift(); requestAnimationFrame(f) }; requestAnimationFrame(f) });
  await page.evaluate(`document.querySelector('.cart[data-i="2"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`); await page.waitForTimeout(1500);
  await E(`localStorage.removeItem('rootdeep-v1');Object.assign(RD,RDDEF());RD.set={mus:7,sfx:8,shake:true};state='g3title'`);
  const log = { runs: [], notes: [], shots: [] };
  await tap('KeyZ', 60); await page.waitForTimeout(500);
  // watch the intro for real (no skipping) once
  let introT = 0; while ((await E('state')) === 'g3cine' && introT < 40) { await page.waitForTimeout(500); introT += .5; if (introT === 3) await shot('01_intro'); }
  log.notes.push('intro length ' + introT + 's');
  for (let k = 0; k < 8 && (await E('state')) === 'g3talk'; k++) { if (k === 0) await shot('02_erin_welcome'); await tap('KeyZ'); await page.waitForTimeout(500); }
  await page.waitForTimeout(500); await shot('03_hearth_first');
  const startAll = Date.now();
  for (let run = 1; run <= 6 && Date.now() - startAll < 13 * 60e3; run++) {
    // in the Hearth: buy what the Mirror can afford, then walk to the door
    if (run > 1) { await E(`uiSel=0;state='g3mirror'`); for (let i = 0; i < 8; i++) { await E(`uiSel=${i}`); await tap('KeyZ', 30); await page.waitForTimeout(60) } await tap('KeyX'); await page.waitForTimeout(200); }
    const mirror = await E(`JSON.stringify(RD.mirror)`);
    await E(`hubEnter()`); await page.waitForTimeout(300);
    for (let i = 0; i < 60 && (await E('state')) === 'g3hub'; i++) { const p = JSON.parse(await E('JSON.stringify([P3.x,P3.y,H])'));
      await hold('ArrowDown', p[1] < p[2] - 16); await hold('ArrowLeft', p[0] > 124); await hold('ArrowRight', p[0] < 116); await page.waitForTimeout(80);
      if (p[1] >= p[2] - 18) { for (const k of [...down]) await hold(k, false); await tap('KeyZ'); await page.waitForTimeout(300); if ((await E('state')) === 'g3chars') { await E(`uiSel=${run % 2 ? 0 : 0}`); await tap('KeyZ'); } } }
    for (const k of [...down]) await hold(k, false);
    const r = { run, mirror, chambers: [], boons: 0, maxBuds: 0, hits: 0, died: null, keeper: await E('RUN&&RUN.char') };
    let chStart = Date.now(), lastCh = 0, hpPrev = 999, t0 = Date.now(), tick = 0, stuck = 0, lastPos = [0, 0];
    while (Date.now() - t0 < 4 * 60e3) {
      tick++; const st = await E('state');
      if (st === 'g3cine') { await tap('Enter'); await page.waitForTimeout(200); continue }
      if (st === 'g3boon') { if (tick % 7 === 0 && r.boons < 1) await shot('05_boon'); await tap('KeyZ', 60); r.boons++; await page.waitForTimeout(150); continue }
      if (st === 'g3shop') { await shot('06_shop'); await tap('KeyX'); await page.waitForTimeout(150); continue }
      if (st === 'g3pause') { await tap('Enter'); continue }
      if (st === 'g3dying') { if (!log.shots.includes('dying')) { log.shots.push('dying'); await page.waitForTimeout(1500); await shot('08_death_cinematic') } await page.waitForTimeout(400); continue }
      if (st === 'g3over' || st === 'g3win') { await page.waitForTimeout(1200); if (!log.shots.includes(st)) { log.shots.push(st); await shot(st === 'g3over' ? '09_death_screen' : '10_escape') }
        r.died = st === 'g3over' ? await E('RD.lastRun.sub') : 'ESCAPED'; r.msgs = await E('JSON.stringify(RD.lastRun.msgs||[])'); r.banked = await E('RD.lastRun.spr'); r.dew = await E('RD.lastRun.dew'); await tap('KeyZ'); await page.waitForTimeout(400); break }
      if (st !== 'g3run') { await page.waitForTimeout(100); continue }
      const s = JSON.parse(await E(`JSON.stringify({p:[P3.x,P3.y],hp:RUN.hp,mx:rdStats().maxHp,ch:RUN.chamber,ph:RUN.phase,f:RUN.enemies.map(e=>[e.x,e.y,e.kind]),pods:(RUN.pods||[]).map(p=>[p.x,p.y]),doors:RUN.doors.map(d=>[d.x,d.y]),buds:RUN.buds.length,sup:RUN.sup||0,xc:RUN.xCd,yc:RUN.yCd,ints:(RUN.ints||[]).filter(i=>!i.done&&i.k!=='boom').map(i=>[i.x,i.y,i.k])})`));
      if (s.ch !== lastCh) { if (lastCh) r.chambers.push({ ch: lastCh, secs: +((Date.now() - chStart) / 1000).toFixed(1) }); lastCh = s.ch; chStart = Date.now();
        if (s.ch === 1 && run === 1) { await page.waitForTimeout(600); await shot('04_chamber1') } if (s.ch === 5 && !log.shots.includes('vault')) { log.shots.push('vault'); await page.waitForTimeout(500); await shot('07_vault') } }
      if (s.hp < hpPrev - .5) r.hits++; hpPrev = s.hp; r.maxBuds = Math.max(r.maxBuds, s.buds);
      let tx = null, ty = null, attack = false;
      const near = s.f.map(f => [f, Math.hypot(f[0] - s.p[0], f[1] - s.p[1])]).sort((a, b) => a[1] - b[1])[0];
      if (s.ph === 'doors') { const d = s.doors[run % 2 ? 0 : 1] || s.doors[0]; if (d) { tx = d[0]; ty = d[1] + 6 } }
      else if (near) { const [f, d] = near; if (s.hp < s.mx * .3 && d < 40) { tx = s.p[0] - (f[0] - s.p[0]); ty = s.p[1] - (f[1] - s.p[1]); if (tick % 3 === 0) { const k = Math.abs(f[0] - s.p[0]) > Math.abs(f[1] - s.p[1]) ? (f[0] > s.p[0] ? 'ArrowLeft' : 'ArrowRight') : (f[1] > s.p[1] ? 'ArrowUp' : 'ArrowDown'); await tap(k, 30); await page.waitForTimeout(40); await tap(k, 30) } }
        else { if (d > 24) { tx = f[0]; ty = f[1] } attack = d < 40 } }
      else if (s.pods.length) { tx = s.pods[0][0]; ty = s.pods[0][1] }
      else if (s.ints.length) { const it = s.ints[0]; tx = it[0]; ty = it[1]; if (Math.hypot(it[0] - s.p[0], it[1] - s.p[1]) < 14) attack = true }
      if (tx !== null) { const dx = tx - s.p[0], dy = ty - s.p[1]; await hold('ArrowRight', dx > 4); await hold('ArrowLeft', dx < -4); await hold('ArrowDown', dy > 4); await hold('ArrowUp', dy < -4) } else for (const k of [...down]) await hold(k, false);
      if (Math.hypot(s.p[0] - lastPos[0], s.p[1] - lastPos[1]) < .5 && tx !== null) stuck++; else stuck = 0; lastPos = s.p;
      if (stuck > 25) { await tap(['ArrowUp', 'ArrowLeft', 'ArrowRight'][tick % 3], 300); stuck = 0 }
      if (attack) await tap('KeyZ', 30);
      if (near && near[1] < 60) { if (s.xc <= 0 && tick % 4 === 0) await tap('KeyC', 30); else if (s.yc <= 0 && tick % 5 === 0) await tap('KeyV', 30); else if (s.sup >= 100) await tap('KeyX', 30); else if (tick % 9 === 0) await tap('KeyX', 30) }
      await page.waitForTimeout(70);
    }
    for (const k of [...down]) await hold(k, false);
    if (lastCh) r.chambers.push({ ch: lastCh, secs: +((Date.now() - chStart) / 1000).toFixed(1) });
    r.deepest = lastCh; r.sproutsFoundLifetime = await E('RD.stats.sproutsFound||0'); r.killsLifetime = await E('RD.stats.kills');
    log.runs.push(r); console.log(JSON.stringify(r));
    if ((await E('state')) !== 'g3hub') { await E('if(RUN){RUN=null}hubEnter()'); }
    if (run === 1) { await page.waitForTimeout(600); await shot('11_hearth_after_fall') }
  }
  const ft = await page.evaluate(() => { const a = window.__ft.slice(60).sort((x, y) => x - y); return { median: a[a.length >> 1], p95: a[(a.length * .95) | 0], worst: a[a.length - 1] } });
  log.frame = ft; log.errors = errs; log.end = JSON.parse(await E('JSON.stringify({stats:RD.stats,mirror:RD.mirror,heard:Object.keys(RD.heard||{}).length,kstats:RD.kstats,unlocked:CHARS.filter(c=>charUnlocked(c.id)).map(c=>c.id)})'));
  console.log('SUMMARY ' + JSON.stringify({ frame: ft, errors: errs, end: log.end, notes: log.notes }));
  await browser.close();
})().catch(e => { console.error('HARNESS FAIL', e.message); process.exit(1); });
