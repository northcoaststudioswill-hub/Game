// v0.2 features up close: counter, drums, Caller bottles, wall splat, fourth hit, the ledger, a climb, Ruth, Mother Mercy.
module.exports = async (page, shot) => {
  const ev = (f, a) => page.evaluate(f, a);
  const snap = async n => { await page.waitForTimeout(220); await shot(n); };
  const out = {};
  await ev(() => {
    SC.manual = true; const DT = 1 / 60; window.ST = s => { const n = Math.round(s / DT); for (let i = 0; i < n; i++) SC.tick(DT); };
    window.SETUP = (path, kinds, up, at) => {
      localStorage.setItem('second-chance-save-v1', JSON.stringify({ v: 1, cp: 'yard', flags: { intro: 1, path, e_alley: 1, e_street: 1, key: 1, gate: 1, e_yard: 1 }, path, rank: 1, echoes: 0, time: 0, scrip: 0, up: up || {} }));
      if (SC.ui.menuOpen) SC.ui.closeMenu(); SC.story.load(); SC.player.meter = 100; const a = at || [18, -4]; SC.player.place(a[0], 0, a[1], Math.PI); SC.cam.snapBehind();
      (kinds || []).forEach((k, i, arr) => { const e = SC.spawnEnemy(k[0], k[1], 0, k[2], null); e.cool = 99; });
      ST(1.2);
    };
  });
  // counter: a Hollow swings, we dodge late, then attack inside the slowdown
  out.counter = await ev(() => {
    SETUP('shade', [['hollow', 18, -6.2]]); const e = SC.enemies[0], p = SC.player; e.pos.set(18, 0, -6.0); e.vel.set(0, 0, 0);
    SC.input.press('dodge'); ST(0.03); SC.hitPlayer(10, e.pos.x, e.pos.z, false); const perfect = p.stats.perfect, slow = SC.time.slowT > 0;
    SC.input.press('attack'); ST(0.35); return { perfect, slow, counters: p.stats.counters, hp: e.hp, eState: e.state, slowAfter: SC.time.slowT > 0 };
  });
  await snap('v01-counter');
  // a drum, lit by a punch, takes the Hollows next to it
  out.drum = await ev(() => {
    SETUP('ember', [['hollow', 16.0, -12.6], ['hollow', 18.0, -12.4]], {}, [17, -9.6]); const p = SC.player;
    const b = SC.world.barrels.find(x => Math.abs(x.x - 17) < 0.1); SC.enemies[0].pos.set(15.9, 0, -12.5); SC.enemies[1].pos.set(18.1, 0, -12.6);
    SC.world.lightBarrel(b); ST(0.6);
    return { exploded: !b.alive, after: SC.enemies.map(e => Math.round(e.hp) + ':' + e.state), hp: p.hp, blasts: p.stats.blasts };
  });
  await snap('v02-drum');
  // a Caller lobs a bottle; standing still means it lands
  out.caller = await ev(() => {
    SETUP('tether', [['caller', 18, -11]]); const e = SC.enemies[0], p = SC.player; e.cool = 0; const hp0 = p.hp; let n = 0, sawShot = false;
    while (n++ < 240) { ST(1 / 60); if (SC.shots.length) { sawShot = true; break; } }
    ST(0.35); return { sawShot, flying: SC.shots.length, state: e.state };
  });
  await snap('v03-caller-bottle');
  out.caller.hit = await ev(() => { const p = SC.player, hp0 = p.hp; ST(0.9); return hp0 - p.hp; });
  // wall splat: a heavy hit drives a Hollow into the container wall
  out.splat = await ev(() => {
    SETUP('ember', [['hollow', 30.2, -9]], {}, [28.4, -9]); const p = SC.player, e = SC.enemies[0]; p.yaw = Math.PI / 2;
    e.hit(1, 0, 0, { quiet: true }); e.state = 'chase'; e.vel.set(0, 0, 0); ST(0.05);
    e.hit(5, 1, 0, { heavy: true }); let n = 0; while (!e.splatted && n++ < 60) ST(1 / 60); return { splats: p.stats.splats, state: e.state, x: e.pos.x.toFixed(2) };
  });
  await snap('v04-splat');
  // the fourth hit, bought from Tally
  out.due = await ev(() => {
    SETUP('ember', [['hollow', 18, -6.8], ['hollow', 19.4, -7.6]], { due: 1 }); const p = SC.player; let combos = [];
    for (let k = 0; k < 150; k++) { if (k % 8 === 0) SC.input.press('attack'); ST(1 / 60); if (p.state === 'attack' && combos[combos.length - 1] !== p.combo) combos.push(p.combo); }
    return { combos, lift: p.lift };
  });
  await ev(() => { const p = SC.player; let n = 0; while (!(p.state === 'attack' && p.combo === 3 && p.st > 0.18) && n++ < 120) ST(1 / 60); });
  await snap('v05-past-due');
  // the crossing ledger
  await ev(() => { SETUP('ember', []); SC.player.scrip = 64; SC.player.place(18, 0, 3.6, Math.PI); ST(0.2); SC.input.press('interact'); ST(0.1); });
  await snap('v06-ledger');
  out.ledger = await ev(() => { SC.ui.menuFns.b_hp(); SC.ui.menuFns.b_due(); const r = { up: JSON.stringify(SC.up), scrip: SC.player.scrip, max: SC.player.maxHp() }; SC.ui.menuFns.x(); ST(0.5); return r; });
  // a climb, mid-ladder
  await ev(() => { SETUP('shade', [], {}, [25.2, 0.9]); SC.player.yaw = 0; ST(0.2); SC.input.press('interact'); ST(0.9); });
  await snap('v07-climb');
  out.climb = await ev(() => { ST(2); return { y: SC.player.pos.y.toFixed(2), state: SC.player.state }; });
  // Ruth, close
  await ev(() => { SETUP('ember', [], {}, [-12.5, 36.6]); SC.player.place(-13.2, 11, 36.4, -2.2); SC.cam.snapBehind(-2.3); ST(1.2); });
  await snap('v08-ruth');
  console.log(JSON.stringify(out, null, 1));
};
