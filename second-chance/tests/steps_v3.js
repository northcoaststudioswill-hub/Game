// v0.3 screens: Otis and his choices, Nell on the radio, a chapter card, a one-liner, the case board, the last page.
module.exports = async (page, shot) => {
  const ev = (f, a) => page.evaluate(f, a);
  const snap = async n => { await page.waitForTimeout(300); await shot(n); };
  await ev(() => { SC.manual = true; window.ST = s => { const n = Math.round(s * 60); for (let i = 0; i < n; i++) SC.tick(1 / 60); };
    window.LOAD = (flags, at, yaw) => { localStorage.setItem('second-chance-save-v1', JSON.stringify({ v: 1, cp: 'alley', flags: Object.assign({ intro: 1, path: 'ember', ch_1: 1, call_wake: 1, tip_scrip: 1 }, flags), path: 'ember', rank: 1, echoes: 1, time: 0, scrip: 30, up: {} }));
      if (SC.ui.menuOpen) SC.ui.closeMenu(); SC.story.load(); SC.player.place(at[0], at[1], at[2], yaw); SC.cam.snapBehind(yaw); ST(0.8); }; });
  // Otis, with the reply choices up
  await ev(() => { LOAD({ e_alley: 1 }, [-0.9, 0, 26.6], -1.9); SC.input.press('interact'); ST(0.1); let n = 0; while (!(SC.ui.dlg && SC.ui.dlg.choosing) && n++ < 30) { SC.ui.tap(); ST(0.1); SC.ui.tap(); ST(0.1); } });
  await snap('w01-otis-choice');
  await ev(() => { SC.ui.pick(0); ST(0.1); let n = 0; while (SC.ui.blocking() && n++ < 40) { SC.ui.tap(); ST(0.1); } ST(1.2); });
  await snap('w02-radio');
  // a chapter card
  await ev(() => { SC.ui.chapter(2, 'PIER 9'); ST(0.5); });
  await page.waitForTimeout(500); await shot('w03-chapter');
  // a one-liner over Dez's head
  await ev(() => { SC.ui.bark('DEAD AN HOUR AND I AM DOING CARDIO.'); ST(0.1); });
  await snap('w04-bark');
  // the case board with three deductions pinned
  await ev(() => { LOAD({ e_alley: 1, clue_casings: 1, clue_otis: 1, clue_bike: 1, e_street: 1, gate: 1, e_yard: 1, clue_masks: 1, breaker: 1, e_wh: 1, clue_photo: 1, clue_ledger: 1, ledger: 1, ded_shooter: 1, ded_envelope: 1 }, [-6, 8.4, -13], -1.57);
    SC.story.openBoard(); SC.ui.menuFns.c_bike(); SC.ui.menuFns.c_masks(); });
  await page.waitForTimeout(700); await shot('w05-board');
  await ev(() => { SC.ui.menuFns.c_photo(); SC.ui.menuFns.c_casings(); });
  await page.waitForTimeout(500); await shot('w06-board-wrong');
  // the last page, both panels
  await ev(() => { SC.ui.closeMenu(); SC.story.cliffhanger(() => {}); });
  await page.waitForTimeout(400); await ev(() => SC.ui.tap()); await page.waitForTimeout(600); await shot('w07-cliffhanger');
};
