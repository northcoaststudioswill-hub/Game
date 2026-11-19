// Close looks at the powers, the finisher, the dodge, lock-on, the second chance and the phone layouts.
module.exports = async (page, shot) => {
  const ev = (f, a) => page.evaluate(f, a);
  const snap = async n => { await page.waitForTimeout(220); await shot(n); };
  await ev(() => {
    SC.manual = true; const DT = 1 / 60; window.ST = s => { const n = Math.round(s / DT); for (let i = 0; i < n; i++) SC.tick(DT); };
    window.SETUP = (path, kinds, rank) => {
      localStorage.setItem('second-chance-save-v1', JSON.stringify({ v: 1, cp: 'yard', flags: { intro: 1, path, e_alley: 1, e_street: 1, key: 1, gate: 1, e_yard: 1 }, path, rank: rank || 1, echoes: 0, time: 0 }));
      if (SC.ui.menuOpen) SC.ui.closeMenu(); SC.story.load(); SC.player.meter = 100; SC.player.place(18, 0, -4, Math.PI); SC.cam.snapBehind();
      (kinds || ['hollow', 'hollow', 'knifer']).forEach((k, i, a) => { const e = SC.spawnEnemy(k, 18 + (i - (a.length - 1) / 2) * 1.8, 0, -8.5 - (i % 2), null); e.cool = 99; });
      ST(1.3);
    };
  });
  await ev(() => { SETUP('ember'); SC.input.press('power'); ST(0.3); }); await snap('f01-ember-leap');
  await ev(() => { ST(0.14); }); await snap('f02-ember-impact');
  await ev(() => { ST(0.3); }); await snap('f03-ember-after');
  await ev(() => { SETUP('shade'); SC.input.press('power'); ST(0.12); }); await snap('f04-shade-cloak');
  await ev(() => { ST(0.2); }); await snap('f05-shade-strike');
  await ev(() => { ST(0.12); }); await snap('f06-shade-after');
  await ev(() => { SETUP('tether'); SC.input.press('power'); ST(0.34); }); await snap('f07-tether-throw');
  await ev(() => { ST(0.3); }); await snap('f08-tether-yank');
  await ev(() => { ST(0.6); }); await snap('f09-tether-bound');
  await ev(() => { SETUP('ember', ['bruiser']); const e = SC.enemies[0]; e.pos.set(18, 0, -6.4); e.hp = 1; e.hit(5, 0, -1, {}); ST(0.3); }); await snap('f10-dazed');
  await ev(() => { SC.input.press('interact'); ST(0.3); }); await snap('f11-finisher-wind');
  await ev(() => { ST(0.42); }); await snap('f12-finisher-hit');
  await ev(() => { ST(0.5); }); await snap('f13-finisher-after');
  await ev(() => { SETUP('shade'); SC.input.script = { x: 1, y: 0 }; SC.input.press('dodge'); ST(0.16); }); await snap('f14-dodge-roll');
  await ev(() => { SC.input.script = null; ST(0.6); SC.input.press('lock'); ST(0.8); }); await snap('f15-lock-on');
  await ev(() => { SC.input.script = { x: 0, y: 1 }; ST(0.5); SC.input.script = null; SC.input.press('attack'); ST(0.14); }); await snap('f16-jab');
  await ev(() => { SC.input.press('attack'); ST(0.3); SC.input.press('attack'); ST(0.34); }); await snap('f17-kick');
  await ev(() => { SETUP('tether', ['hollow']); const p = SC.player; p.hp = 4; SC.enemies[0].cool = 0; let n = 0; while (p.state !== 'revive' && n++ < 900) ST(1 / 60); ST(1.25); }); await snap('f18-second-chance');
  await ev(() => { const p = SC.player; p.hp = 3; p.inv = 0; SC.enemies.forEach(e => { e.cool = 0; e.state = 'chase'; }); let n = 0; while (p.state !== 'dead' && n++ < 1500) ST(1 / 60); ST(2.2); }); await snap('f19-dead');
  await ev(() => { SC.ui.menuFns.r(); ST(0.5); SC.ui.pause(); }); await snap('f20-pause');
  const info = await ev(() => { SC.ui.closeMenu(); SC.ui.paused = false; SETUP('ember', ['hollow', 'hollow', 'knifer', 'bruiser', 'hollow', 'knifer']); SC.gfx.render(); const i = SC.gfx.renderer.info; return { calls: i.render.calls, tris: i.render.triangles, geos: i.memory.geometries, tex: i.memory.textures }; });
  console.log('render info with 6 enemies:', JSON.stringify(info));
};
