// Phone-sized looks: title, intro page, play, path cards, dialogue, pause, end card.
module.exports = async (page, shot) => {
  const ev = (f, a) => page.evaluate(f, a);
  const snap = async n => { await page.waitForTimeout(260); await shot(n); };
  await page.touchscreen.tap(30, 30);
  await snap('m01-title');
  await ev(() => { SC.manual = true; window.ST = s => { const n = Math.round(s * 60); for (let i = 0; i < n; i++) SC.tick(1 / 60); }; localStorage.clear(); SC.ui.menuFns.n(); ST(0.1); });
  for (let i = 0; i < 2; i++) { await page.waitForTimeout(320); await ev(() => { SC.ui.tap(); ST(0.4); }); }
  await snap('m02-page');
  await page.waitForTimeout(320); await ev(() => { SC.ui.tap(); ST(4); }); await snap('m03-dialogue');
  await ev(() => { let n = 0; while (SC.ui.blocking() && n++ < 40) { SC.ui.tap(); ST(0.3); } ST(1.5); }); await snap('m04-play');
  await ev(() => { SC.player.place(0, 0, 34.2); SC.input.press('interact'); ST(0.1); }); await snap('m05-paths');
  await ev(() => { SC.ui.menuFns.tether(); ST(5); }); await snap('m06-fight');
  await ev(() => { SC.ui.pause(); }); await snap('m07-pause');
  await ev(() => { SC.ui.closeMenu(); SC.ui.paused = false; SC.ui.end({ time: 754, path: 'TETHER', kills: 25, finishers: 3, perfect: 4, chances: 1, clues: 4 }, () => {}); }); await snap('m08-end');
  await ev(() => { SC.ui.closeMenu(); SC.ui.dead(() => {}); }); await snap('m09-dead');
};
