'use strict';
/* SECOND CHANCE - main: boot and the frame loop. */
(function () {
  const G = SC.gfx, pl = SC.player;
  let last = 0, t = 0, slowAcc = 0, slowN = 0;
  function boot() {
    G.init(document.getElementById('gl'));
    SC.world.build();
    pl.init(); SC.cam.init(); SC.input.init(); SC.ui.init(); SC.story.init();
    window.addEventListener('resize', () => { G.resize(); SC.ui.resize(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden && SC.state === 'play' && !SC.ui.blocking()) SC.ui.pause(); });
    const st = SC.settings; SC.input.sens = st.sens || 1; if (!st.sound) SC.audio.toggle(); if (st.quality) { G.setQuality(st.quality); SC.ui.userQuality = true; }
    SC.story.title();
    requestAnimationFrame(frame);
  }
  function tick(rdt) {
    const frozen = SC.ui.freeze;
    SC.input.frame(rdt);
    let dt = rdt; const tm = SC.time;
    if (frozen) { dt = 0; rdt = 0; }
    else if (tm.hitstop > 0) { tm.hitstop -= rdt; dt = 0; }
    else if (tm.slowT > 0) { tm.slowT -= rdt; dt = rdt * tm.slowK; }
    t += dt;
    pl.update(dt, rdt);
    SC.updateEnemies(dt);
    SC.world.update(dt, t);
    SC.story.update(dt, rdt);
    SC.cam.update(rdt, dt);
    G.update(dt, rdt, pl.pos);
    SC.ui.hud(rdt || 0.016);
    return frozen;
  }
  SC.tick = tick;
  function frame(ts) {
    requestAnimationFrame(frame);
    const rdt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts;
    if (SC.manual) { G.render(); return; }          // tests drive the clock themselves
    const frozen = tick(rdt);
    SC.audio.tick(SC.combat.active && SC.state === 'play');
    G.render();
    // drop to the fast picture by itself if this device cannot hold the frame rate
    if (!frozen && !SC.ui.userQuality && G.quality >= 1 && SC.state === 'play') {
      slowAcc += rdt; slowN++;
      if (slowN >= 150) { if (slowAcc / slowN > 0.03) G.setQuality(0.5); slowAcc = 0; slowN = 0; }
    }
  }
  SC.debug = {
    warp(x, y, z) { pl.place(x, y, z); SC.cam.snapBehind(); },
    flags(list) { list.forEach(k => { SC.flags[k] = 1; }); ['gate', 'hatch'].forEach(k => { if (SC.flags[k]) SC.world.openDoor(k, true); }); if (SC.flags.breaker) SC.world.openDoor('shutter', true); SC.story.objective(); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
