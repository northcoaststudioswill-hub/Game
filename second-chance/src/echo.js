'use strict';
/* SECOND CHANCE - echoes: some places remember what happened in them, and the dead can watch.
   An echo is a short scene played by see-through figures on the real set, with the lights down. */
(function () {
  const G = SC.gfx, FX = G.fx, cam = SC.cam;
  const EC = SC.echo = { on: false, t: 0 };
  const cache = {};
  let saved = null;

  function actor(id, a) {
    let m = cache[id];
    if (!m) { m = cache[id] = SC.makeHumanoid(a.kind, a.opts); m.setGhost(a.ghost); }
    m.fade(1); G.scene.add(m.group); m.group.visible = true; m.expr = null; m.face(a.face || 'neutral');
    return m;
  }
  function keyAt(keys, t) { let i = 0; while (i < keys.length - 1 && keys[i + 1][0] <= t) i++; return i; }

  /* def: { actors: {id: {kind, opts, ghost, face}}, keys: {id: [[t, x, y, z, yaw|null, pose, face?], ...]},
            events: [[t, fn]], cam: [p0, l0, p1, l1, fov], dur, cap } */
  EC.play = function (def, done) {
    EC.on = true; EC.def = def; EC.t = 0; EC.done = done; EC.acts = {}; EC.ei = 0; EC.out = 0;
    EC.events = (def.events || []).slice().sort((a, b) => a[0] - b[0]);
    Object.keys(def.actors).forEach(id => {
      const a = def.actors[id], m = actor(id, a), k = def.keys[id][0];
      m.group.position.set(k[1], k[2], k[3]); m.group.rotation.y = k[4] || 0;
      EC.acts[id] = { a, m, keys: def.keys[id], over: null, yaw: k[4] || 0, lt: 0, ki: -1 };
    });
    // lights down, a cold wash over the page; the ghosts carry their own light
    saved = { amb: G.amb.intensity, sun: G.sun.intensity, bg: G.scene.background.clone(), fog: G.scene.fog.color.clone() };
    G.amb.intensity *= 0.5; G.sun.intensity *= 0.3; G.scene.background.set(0x07091c); G.scene.fog.color.set(0x0c1030);
    document.getElementById('stage').classList.add('echo');
    const cp = document.getElementById('echoCap'); cp.textContent = def.cap || 'ECHO'; cp.classList.add('on');
    cam.move(def.cam[0], def.cam[1], def.cam[2], def.cam[3], def.dur, def.cam[4] || 44);
    SC.emit('letterbox', true); SC.emit('flash', '#8fd8ff'); SC.audio.sfx('echo');
  };
  EC.over = function (id, pose, dur) { const a = EC.acts[id]; a.over = { pose, until: EC.t + dur }; };
  EC.hand = function (id, out) { return EC.acts[id].m.bones.haR.getWorldPosition(out || new THREE.Vector3()); };
  EC.model = id => EC.acts[id].m;
  EC.finish = () => { if (EC.on) EC.def.dur = Math.min(EC.def.dur, EC.t); };

  EC.update = function (dt) {
    if (!EC.on) return;
    EC.t += dt; const t = EC.t;
    while (EC.ei < EC.events.length && EC.events[EC.ei][0] <= t) EC.events[EC.ei++][1]();
    for (const id in EC.acts) {
      const A = EC.acts[id], K = A.keys, i = keyAt(K, t), k = K[i], n = K[i + 1], m = A.m;
      if (i !== A.ki) { A.ki = i; A.lt = 0; if (k[6]) m.face(k[6]); } else A.lt += dt;
      let x = k[1], y = k[2], z = k[3], mx = 0, mz = 0;
      if (n && (n[1] !== k[1] || n[3] !== k[3] || n[2] !== k[2])) {
        const u = SC.clamp((t - k[0]) / (n[0] - k[0]), 0, 1);
        x = SC.lerp(k[1], n[1], u); y = SC.lerp(k[2], n[2], u); z = SC.lerp(k[3], n[3], u); mx = n[1] - k[1]; mz = n[3] - k[3];
      }
      m.group.position.set(x, y, z);
      const want = k[4] !== null && k[4] !== undefined ? k[4] : (mx || mz ? Math.atan2(mx, mz) : A.yaw);
      A.yaw = SC.dampAng(A.yaw, want, 10, dt); m.group.rotation.y = A.yaw;
      let pose = A.over && A.over.until > t ? A.over.pose : (typeof k[5] === 'function' ? k[5](A.lt) : k[5]);
      m.anim.apply(pose, A.over && A.over.until > t ? 60 : 14, Math.max(dt, 0.0001));
    }
    if (t >= EC.def.dur) {
      EC.out += dt; const f = Math.max(0, 1 - EC.out / 0.5);
      for (const id in EC.acts) EC.acts[id].m.fade(f);
      if (f <= 0) end();
    }
  };
  function end() {
    for (const id in EC.acts) { const m = EC.acts[id].m; FX.ink(m.group.position, 2, 0.8); G.scene.remove(m.group); }
    G.amb.intensity = saved.amb; G.sun.intensity = saved.sun; G.scene.background.copy(saved.bg); G.scene.fog.color.copy(saved.fog);
    document.getElementById('stage').classList.remove('echo'); document.getElementById('echoCap').classList.remove('on');
    EC.on = false; const d = EC.done; EC.done = null; if (d) d();
  }
  /* stop at once, for a reload in the middle of one */
  EC.stop = function () { if (!EC.on) return; EC.done = null; for (const id in EC.acts) G.scene.remove(EC.acts[id].m.group); end(); };
})();
