// Plays the whole slice with a bot, on a fixed clock, and checks the camera rules the whole way:
// the camera never comes closer than arm's length (no first person), and the character stays in frame.
//   node tests/playthrough.js [ember|shade|tether] [shotsDir]
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const pathId = process.argv[2] || 'ember', shots = process.argv[3] || null;
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' ' + (e.stack || '').split('\n').slice(1, 3).join(' ')));
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  await page.waitForTimeout(1200);
  await page.evaluate(skill => {
    localStorage.clear(); SC.manual = true;
    const DT = 1 / 30, pl = SC.player, cam = SC.cam, U = SC.ui, I = SC.input, B = window.BOT = { log: [], minD: 99, total: 0, off: 0, front: 0, frames: 0, hpLow: 100, skill };
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    function check() {
      if (cam.mode !== 'follow' || !pl.control || pl.state === 'scripted' || SC.state !== 'play' || !pl.model.group.visible || cam.blend > 0) return;
      const k = SC.gfx.camera; k.updateMatrixWorld(); k.matrixWorldInverse.copy(k.matrixWorld).invert();
      const d = k.position.distanceTo(a.set(pl.pos.x, pl.visY + 1, pl.pos.z)); if (d < B.minD) { B.minD = d; B.minAt = [pl.pos.x.toFixed(1), pl.pos.y.toFixed(1), pl.pos.z.toFixed(1)].join(','); }
      b.set(pl.pos.x, pl.visY + 1.85 + pl.lift, pl.pos.z).project(k); c.set(pl.pos.x, pl.visY + pl.lift, pl.pos.z).project(k);
      B.total++; if (Math.abs(b.x) > 1 || Math.abs(b.y) > 1 || b.z > 1 || Math.abs(c.x) > 1 || Math.abs(c.y) > 1 || c.z > 1) { B.off++; B.offAt = [pl.pos.x.toFixed(1), pl.pos.y.toFixed(1), pl.pos.z.toFixed(1), pl.state].join(','); }
      B.hpLow = Math.min(B.hpLow, pl.hp);
    }
    B.step = n => { for (let i = 0; i < (n || 1); i++) { SC.tick(DT); B.frames++; check(); } };
    B.wait = s => B.step(Math.round(s / DT));
    B.taps = () => { let n = 0; while (U.blocking() && !U.menuOpen && n++ < 300) { U.tap(); B.step(9); } };
    const stick = (wx, wz) => { const cy = cam.yaw; I.script = { x: -wx * Math.cos(cy) + wz * Math.sin(cy), y: wx * Math.sin(cy) + wz * Math.cos(cy) }; };
    B.fight = function (maxS) {
      let n = 0; const max = (maxS || 240) / DT;
      while (SC.story.enc && n++ < max) {
        if (pl.state === 'dead') { B.log.push('DIED in ' + SC.story.enc.id); return false; }
        if (U.blocking()) { if (U.menuOpen) { B.log.push('menu open in fight'); return false; } B.taps(); continue; }
        if (!pl.control) { I.script = null; B.step(1); continue; }
        const dz = SC.enemies.find(e => e.state === 'dazed');
        if (dz) { const d = Math.hypot(dz.pos.x - pl.pos.x, dz.pos.z - pl.pos.z); if (d < 2.4) { I.script = null; I.press('interact'); B.step(2); } else { stick((dz.pos.x - pl.pos.x) / d, (dz.pos.z - pl.pos.z) / d); B.step(1); } continue; }
        const E = SC.enemies.filter(e => e.hittable());
        if (!E.length) { I.script = null; B.step(1); continue; }
        E.sort((p, q) => Math.hypot(p.pos.x - pl.pos.x, p.pos.z - pl.pos.z) - Math.hypot(q.pos.x - pl.pos.x, q.pos.z - pl.pos.z));
        const e = E[0], dx = e.pos.x - pl.pos.x, dzz = e.pos.z - pl.pos.z, d = Math.hypot(dx, dzz) || 1;
        const th = SC.enemies.find(t => ((t.state === 'strike' && t.st < 0.1) || (t.state === 'windup' && t.st > t.K.wind - 0.1) || (t.state === 'leap' && t.lp.step === 1 && t.lp.t > 0.72)) && Math.hypot(t.pos.x - pl.pos.x, t.pos.z - pl.pos.z) < 5.5);
        if (th && pl.dodgeCd <= 0 && B.skill !== 0) { const tx = th.pos.x - pl.pos.x, tz = th.pos.z - pl.pos.z, td = Math.hypot(tx, tz) || 1; stick(-tz / td, tx / td); I.press('dodge'); }
        else if (pl.path && pl.meter >= 34 && d < 6 && n % 30 === 0) I.press('power');
        else if (d < 2.1 + e.r) { I.script = null; if (n % 4 === 0) I.press('attack'); }
        else stick(dx / d, dzz / d);
        B.step(1);
      }
      I.script = null; if (SC.story.enc) B.log.push('FIGHT TIMEOUT ' + SC.story.enc.id + ' enemies ' + SC.enemies.map(e => e.kind + ':' + e.state + ':' + Math.round(e.hp)).join(' '));
      return !SC.story.enc;
    };
    B.go = function (x, z, o) {
      o = o || {}; const tol = o.tol || 0.45; let n = 0;
      while (n++ < (o.max || 700)) {
        if (pl.state === 'dead') { B.log.push('DEAD on the way to ' + x + ',' + z); return false; }
        if (SC.story.enc) { if (!B.fight()) return false; continue; }
        if (U.blocking()) { if (U.menuOpen) break; B.taps(); continue; }
        const dx = x - pl.pos.x, dz = z - pl.pos.z, d = Math.hypot(dx, dz); if (d < tol) break; if (o.until && o.until()) break;
        if (pl.control) stick(dx / d, dz / d); else I.script = null; B.step(1);
      }
      I.script = null; const ok = Math.hypot(x - pl.pos.x, z - pl.pos.z) < tol + 0.4 || (o.until && o.until());
      if (!ok) B.log.push('GOTO FAIL ' + x + ',' + z + ' stopped at ' + pl.pos.x.toFixed(1) + ',' + pl.pos.y.toFixed(1) + ',' + pl.pos.z.toFixed(1) + ' state ' + pl.state);
      return ok;
    };
    B.use = function (flag) { I.press('interact'); B.step(3); B.taps(); B.step(3); B.taps(); if (flag && !SC.flags[flag]) B.log.push('USE did not set ' + flag + ' at ' + pl.pos.x.toFixed(1) + ',' + pl.pos.y.toFixed(1) + ',' + pl.pos.z.toFixed(1)); };
    B.mark = m => B.log.push('ok ' + m + ' t=' + (B.frames * DT).toFixed(0) + 's hp=' + Math.round(pl.hp) + ' chance=' + pl.chance);
  }, process.env.SKILL === '0' ? 0 : 1);
  const ev = (f, a) => page.evaluate(f, a);
  const snap = async n => { if (shots) { await page.evaluate(() => { SC.gfx.render(); }); await page.waitForTimeout(250); await page.screenshot({ path: path.join(shots, n + '.png') }); } };

  await ev(() => { SC.ui.menuFns.n(); BOT.step(2); }); await snap('p01-intro-page-1');
  await ev(() => { SC.ui.tap(); BOT.step(10); SC.ui.tap(); BOT.step(10); }); await snap('p02-intro-page');
  await ev(() => { SC.ui.tap(); BOT.step(10); SC.ui.tap(); BOT.step(50); }); await snap('p03-wake');
  await ev(() => { BOT.wait(3); }); await snap('p04-dialogue');
  await ev(() => { BOT.taps(); BOT.wait(1.2); BOT.mark('intro'); }); await snap('p05-control');
  await ev(() => { BOT.go(1.5, 39.4); BOT.use('clue_casings'); BOT.go(0, 34.3); SC.input.press('interact'); BOT.step(3); }); await snap('p06-paths');
  await ev(id => { SC.ui.menuFns[id](); BOT.wait(1.2); }, pathId); await snap('p07-bargain');
  await ev(() => { BOT.wait(2.2); BOT.mark('path'); BOT.step(40); }); await snap('p08-first-fight');
  await ev(() => { BOT.fight(); BOT.mark('alley'); BOT.go(0, 19); BOT.go(0, 14, { until: () => !!SC.story.enc }); BOT.step(45); }); await snap('p09-street');
  await ev(() => { BOT.fight(); BOT.mark('street'); BOT.go(9.2, 13.4); BOT.use('clue_bike'); BOT.go(18, 7.4); BOT.use('gate'); BOT.wait(1.6); }); await snap('p10-gate');
  await ev(() => { BOT.go(18, 2.9); SC.input.press('interact'); BOT.step(3); SC.ui.menuFns[SC.player.path](); BOT.step(3); BOT.go(18, -3, { until: () => !!SC.story.enc }); BOT.step(50); }); await snap('p11-yard');
  await ev(() => { BOT.fight(); BOT.mark('yard'); BOT.go(21, -15.9); BOT.use('clue_masks'); BOT.go(26, -9); BOT.go(30.9, -8); BOT.use('breaker'); BOT.wait(3); }); await snap('p12-shutter');
  await ev(() => { BOT.go(10, -6.5); BOT.go(1, -6.5, { until: () => !!SC.story.enc }); BOT.step(60); }); await snap('p13-warehouse');
  await ev(() => { BOT.fight(); BOT.mark('warehouse'); BOT.go(-12, -4); BOT.go(-12.6, 3.7); BOT.go(-23.5, 3.7); }); await snap('p14-mezzanine');
  await ev(() => { BOT.go(-26.6, -8.7); BOT.use('ledger'); BOT.go(-24, -18.2); BOT.go(-17, -18.2); }); await snap('p15-roof-stairs');
  await ev(() => { BOT.go(-13.6, -18.2, { tol: 0.6 }); BOT.use('hatch'); BOT.wait(1.6); BOT.go(-10.5, -18.2); BOT.go(-6, -13.2); SC.input.press('interact'); BOT.step(3); SC.ui.menuFns[SC.player.path](); BOT.step(3); BOT.mark('roof'); }); await snap('p16-roof');
  await ev(() => { BOT.go(-26, -17); BOT.go(-26, -21); }); await snap('p17-plank');
  await ev(() => { BOT.go(-26, -25, { until: () => !!SC.story.enc }); BOT.step(50); BOT.fight(); BOT.mark('rooftop fight'); BOT.go(-27.3, -26.7); BOT.use('clue_loft'); BOT.go(-12, -34.2); BOT.go(-6, -34.2); }); await snap('p18-bridge');
  await ev(() => { BOT.go(1.5, -34.2, { until: () => !SC.player.control }); BOT.wait(1.2); }); await snap('p19-boss-intro');
  await ev(() => { BOT.taps(); BOT.wait(1.5); let n = 0; while (SC.story.enc && n++ < 250) BOT.step(1); }); await snap('p20-boss');
  let res = await ev(() => {
    BOT.fight(400); BOT.mark('boss'); BOT.wait(2.5); BOT.taps(); BOT.wait(2);
    return { log: BOT.log, minD: +BOT.minD.toFixed(2), minAt: BOT.minAt, offscreenFrames: BOT.off, offAt: BOT.offAt, followFrames: BOT.total, hpLow: Math.round(BOT.hpLow), flags: Object.keys(SC.flags).join(' '), ended: !!SC.story.done, menu: SC.ui.menuOpen, clock: Math.round(BOT.frames / 30), stats: SC.player.stats, rank: SC.player.rank };
  });
  await snap('p21-end');
  // PLAY AGAIN must put the level back without reloading the page
  res.again = await ev(() => { SC.ui.menuFns.a(); BOT.step(5); const W = SC.world;
    return { page: !!SC.ui.pg, flags: Object.keys(SC.flags).length, doorsShut: Object.keys(W.doors).every(k => W.doors[k].sol.on), cratesWhole: W.crates.every(c => c.alive), enemies: SC.enemies.length, path: SC.player.path }; });
  console.log(JSON.stringify(res, null, 1));
  console.log(errs.length ? 'ERRORS:\n' + errs.slice(0, 10).join('\n') : 'no console errors');
  const pass = res.ended && res.again.page && res.again.doorsShut && res.again.cratesWhole && !res.again.path && !errs.length && res.minD >= 1.2 && res.offscreenFrames / Math.max(1, res.followFrames) < 0.01 && !res.log.some(l => !l.startsWith('ok'));
  console.log(pass ? 'PASS' : 'FAIL');
  await browser.close(); process.exit(pass ? 0 : 1);
})();
