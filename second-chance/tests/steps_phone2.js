// v0.2 screens at phone size: the ledger, Mother Mercy in the office echo, a Caller up close.
module.exports = async (page, shot) => {
  const ev = (f, a) => page.evaluate(f, a);
  const snap = async n => { await page.waitForTimeout(260); await shot(n); };
  await page.touchscreen.tap(30, 30);
  await ev(() => { SC.manual = true; window.ST = s => { const n = Math.round(s * 60); for (let i = 0; i < n; i++) SC.tick(1 / 60); };
    localStorage.setItem('second-chance-save-v1', JSON.stringify({ v: 1, cp: 'yard', flags: { intro: 1, path: 'tether', e_alley: 1, e_street: 1, key: 1, gate: 1, e_yard: 1, breaker: 1, e_wh: 1, tip_scrip: 1 }, path: 'tether', rank: 1, echoes: 2, time: 0, scrip: 58, up: { hp: 1 } }));
    SC.ui.closeMenu(); SC.story.load(); SC.player.place(18, 0, 3.6, Math.PI); ST(0.3); SC.input.press('interact'); ST(0.1); });
  await snap('n01-ledger');
  await ev(() => { SC.ui.menuFns.x(); ST(0.3); SC.player.place(-26.6, 4, -8.7, -1.57); ST(0.2); SC.input.press('interact'); ST(0.1);
    let n = 0; while (!SC.echo.on && n++ < 60) { SC.ui.tap(); ST(0.15); } ST(3.3); });
  await snap('n02-mercy');
  await ev(() => { let n = 0; while (SC.ui.blocking() || SC.echo.on) { if (n++ > 80) break; SC.ui.tap(); ST(0.2); }
    SC.player.place(18, 0, -4, Math.PI); SC.cam.snapBehind(); const e = SC.spawnEnemy('caller', 18, 0, -7.2, null); e.cool = 99; ST(1.3); e.state = 'windup'; e.st = 0.3; e.yaw = 0; ST(0.25); });
  await snap('n03-caller');
};
