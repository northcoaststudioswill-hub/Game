'use strict';
/* SECOND CHANCE - camera: third person, always. It rides behind and above the character, keeps the whole body
   in frame, backs off in a fight, climbs instead of closing in when a wall is behind it, and only takes a
   staged angle for cutscenes and finishers. There is no first-person mode anywhere in this file. */
(function () {
  const G = SC.gfx, W = SC.world, T = SC.T;
  const v3 = (x, y, z) => new THREE.Vector3(x || 0, y || 0, z || 0);
  const cam = SC.cam = {
    yaw: Math.PI, pitch: T.camPitch, dist: T.camDist, lift: 0, pivot: v3(0, 1.2, 41), lock: null, mode: 'follow',
    shakeAmt: 0, qx: 0, qy: 0, sinceLook: 9, combatK: 0, blend: 0, blendT: 0, fromPos: v3(), fromQ: new THREE.Quaternion(), minSeen: 99
  };
  const _d = v3(), _p = v3(), _l = v3(), _r = v3(), _q = new THREE.Quaternion();
  let reticle;

  cam.init = function () {
    reticle = new THREE.Sprite(new THREE.SpriteMaterial({ map: G.tex.lock, transparent: true, depthTest: false, depthWrite: false, fog: false }));
    reticle.renderOrder = 40; reticle.visible = false; G.scene.add(reticle);
  };
  cam.shake = a => { cam.shakeAmt = Math.min(1.3, Math.max(cam.shakeAmt, a)); };
  cam.snapBehind = function (yaw) { const p = SC.player; cam.yaw = yaw === undefined ? p.yaw : yaw; cam.pitch = T.camPitch; cam.lift = 0; cam.pivot.set(p.pos.x, p.pos.y + 1.15, p.pos.z); cam.dist = T.camDist; cam.blend = 0; };

  function ok(e) { return e && !e.gone && e.state !== 'dead' && e.state !== 'spawn' && !e.vanished; }
  cam.toggleLock = function () {
    if (cam.lock) { cam.lock = null; SC.audio.sfx('ui'); return; }
    const p = SC.player; let best = null, bs = 1e9; const fx = Math.sin(cam.yaw), fz = Math.cos(cam.yaw);
    for (const e of SC.enemies) {
      if (!ok(e) || Math.abs(e.pos.y - p.pos.y) > 4) continue;
      const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z, d = Math.hypot(dx, dz); if (d > 24) continue;
      const s = d - (dx * fx + dz * fz) / (d || 1) * 6; if (s < bs) { bs = s; best = e; }
    }
    cam.lock = best; SC.audio.sfx(best ? 'lock' : 'deny');
  };
  cam.relock = function (old) {
    const p = SC.player; let best = null, bd = 14;
    for (const e of SC.enemies) { if (e === old || !ok(e)) continue; const d = SC.dist2(e.pos.x, e.pos.z, p.pos.x, p.pos.z); if (d < bd) { bd = d; best = e; } }
    cam.lock = best;
  };

  function clearance(pitch, yaw, want) {
    const cp = Math.cos(pitch); _d.set(-Math.sin(yaw) * cp, Math.sin(pitch), -Math.cos(yaw) * cp);
    return W.ray(cam.pivot.x, cam.pivot.y, cam.pivot.z, _d.x, _d.y, _d.z, want + 0.4) - 0.4;
  }

  cam.update = function (rdt, dt) {
    const c = G.camera, p = SC.player, inp = SC.input;
    if (cam.shakeAmt > 0.001) cam.shakeAmt *= Math.exp(-7 * rdt); else cam.shakeAmt = 0;
    if (cam.mode === 'cine') {
      const s = cam.shot; s.t += rdt; if (s.fn) s.fn(s.t, s);
      c.position.copy(s.pos); c.lookAt(s.look); setFov(s.fov || 42);
    } else {
      // --- input ---
      const lx = inp.look.x, ly = inp.look.y;
      if (p.control && (lx || ly)) { cam.sinceLook = 0; cam.qx += lx; cam.qy += ly; } else cam.sinceLook += rdt;
      // the drag is eased in over a few frames, so a thumb never jerks the view
      const ek = 1 - Math.exp(-26 * rdt), ax = cam.qx * ek, ay = cam.qy * ek; cam.qx -= ax; cam.qy -= ay;
      if (!cam.lock) cam.yaw -= ax; cam.pitch = SC.clamp(cam.pitch + ay, -0.12, 1.05);
      const combat = SC.combat.active || p.state === 'power';
      cam.combatK = SC.damp(cam.combatK, combat ? 1 : 0, 3, rdt);
      // --- lock-on, or drift back behind the runner ---
      if (cam.lock && !ok(cam.lock)) cam.relock(cam.lock);
      let sep = 0;
      if (cam.lock) {
        const e = cam.lock, dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z; sep = Math.hypot(dx, dz);
        if (sep > 30) cam.lock = null; else { if (sep > 0.6) cam.yaw = SC.dampAng(cam.yaw, Math.atan2(dx, dz), 5.5, rdt); if (cam.sinceLook > 0.6) cam.pitch = SC.damp(cam.pitch, 0.36, 2.5, rdt); }
      } else if (p.control && cam.sinceLook > 1.0 && p.speed > 1.5) {
        const diff = SC.angDiff(cam.yaw, p.yaw);
        if (Math.abs(diff) < 2.5) cam.yaw += diff * (1 - Math.exp(-1.25 * (p.speed / T.playerSpeed) * rdt));
        cam.pitch = SC.damp(cam.pitch, T.camPitch + cam.combatK * 0.07, 0.8, rdt);
      }
      // --- pivot on the character ---
      const ty = p.visY + 1.15 + p.lift * 0.5;
      cam.pivot.x = SC.damp(cam.pivot.x, p.pos.x, 16, rdt); cam.pivot.z = SC.damp(cam.pivot.z, p.pos.z, 16, rdt);
      cam.pivot.y = Math.abs(cam.pivot.y - ty) > 6 ? ty : SC.damp(cam.pivot.y, ty, 7, rdt);
      // --- how far back: further in a fight, further still with a far lock target ---
      let want = SC.lerp(T.camDist, T.camDistCombat, cam.combatK) + Math.min(2.6, sep * 0.22);
      if (G.portrait) want *= 1.18;
      // --- walls: if there is no room behind, climb, do not crowd the character ---
      let lift = 0, best = -1;
      for (let i = 0; i < 5; i++) {
        const cl = clearance(Math.min(1.25, cam.pitch + i * 0.24), cam.yaw, want);
        if (cl >= Math.min(want, 3.3)) { lift = i * 0.24; best = cl; break; }
        if (cl > best + 0.25) { best = cl; lift = i * 0.24; }
      }
      cam.lift = SC.damp(cam.lift, lift, lift > cam.lift ? 9 : 2.2, rdt);
      const pitch = Math.min(1.3, cam.pitch + cam.lift), cp = Math.cos(pitch);
      _d.set(-Math.sin(cam.yaw) * cp, Math.sin(pitch), -Math.cos(cam.yaw) * cp);
      _r.set(-Math.cos(cam.yaw), 0, Math.sin(cam.yaw)).multiplyScalar(0.34);
      let d = W.ray(cam.pivot.x, cam.pivot.y, cam.pivot.z, _d.x, _d.y, _d.z, want + 0.4) - 0.4;
      for (let s = -1; s <= 1; s += 2) {
        _p.copy(_d).multiplyScalar(want).addScaledVector(_r, s); const L = _p.length(); _p.multiplyScalar(1 / L);
        d = Math.min(d, W.ray(cam.pivot.x, cam.pivot.y, cam.pivot.z, _p.x, _p.y, _p.z, L + 0.3) - 0.4);
      }
      d = SC.clamp(d, 1.25, want);
      cam.dist = d < cam.dist ? d : SC.damp(cam.dist, d, 3.5, rdt);
      _p.copy(cam.pivot).addScaledVector(_d, cam.dist);
      // never inside the character: if a sudden move (a shadowstep, a throw) brings them to the lens, back off and up
      { const hx = _p.x - p.pos.x, hy = _p.y - (p.visY + 1), hz = _p.z - p.pos.z, hd = Math.hypot(hx, hy, hz);
        if (hd < 1.7) { const k = (1.7 - hd); if (hd > 0.05) { _p.x += hx / hd * k; _p.z += hz / hd * k; } _p.y += k * 1.2; } }
      _l.copy(cam.pivot); _l.y += 0.42 - Math.max(0, 3 - cam.dist) * 0.2;
      if (cam.lock) { const e = cam.lock, k = Math.min(0.32, 3 / (sep || 1)); _l.x += (e.pos.x - p.pos.x) * k; _l.z += (e.pos.z - p.pos.z) * k; _l.y += (e.pos.y - p.pos.y) * k; }
      if (cam.blend > 0) {
        cam.blend -= rdt; const k = SC.smooth(SC.clamp(1 - cam.blend / cam.blendT, 0, 1));
        c.position.copy(_p); c.lookAt(_l); _q.copy(c.quaternion);
        c.position.lerpVectors(cam.fromPos, _p, k); c.quaternion.slerpQuaternions(cam.fromQ, _q, k);
      } else { c.position.copy(_p); c.lookAt(_l); }
      setFov((G.portrait ? 74 : T.camFov) + cam.combatK * 3 + Math.max(0, 3.2 - cam.dist) * 9);
      if (p.control && p.state !== 'scripted') cam.minSeen = Math.min(cam.minSeen, c.position.distanceTo(_l.set(p.pos.x, p.visY + 1, p.pos.z)));
    }
    if (cam.shakeAmt) { c.position.x += (Math.random() - 0.5) * cam.shakeAmt * 0.5; c.position.y += (Math.random() - 0.5) * cam.shakeAmt * 0.5; c.position.z += (Math.random() - 0.5) * cam.shakeAmt * 0.5; }
    // lock-on marker
    if (cam.lock && cam.mode === 'follow') { const e = cam.lock; reticle.visible = true; reticle.position.set(e.pos.x, e.pos.y + e.h * 0.62, e.pos.z); const s = 0.95 + Math.sin(performance.now() * 0.008) * 0.06; reticle.scale.set(s, s, 1); reticle.material.rotation += rdt * 1.2; }
    else reticle.visible = false;
  };
  function setFov(f) { const c = G.camera; if (Math.abs(c.fov - f) > 0.05) { c.fov = SC.lerp(c.fov, f, 0.25); c.updateProjectionMatrix(); } }

  /* ---------- staged shots (cutscenes, finishers, big story beats only) ---------- */
  cam.cine = function (pos, look, fov, fn) { cam.mode = 'cine'; cam.shot = { pos: pos.clone(), look: look.clone(), fov: fov || 42, t: 0, fn: fn || null }; G.camera.fov = cam.shot.fov; G.camera.updateProjectionMatrix(); };
  cam.move = function (p0, l0, p1, l1, dur, fov) {
    cam.cine(p0, l0, fov, (t, s) => { const k = SC.smooth(SC.clamp(t / dur, 0, 1)); s.pos.lerpVectors(p0, p1, k); s.look.lerpVectors(l0, l1, k); });
  };
  cam.orbit = function (center, radius, height, speed, a0, fov) {
    cam.cine(center, center, fov || 40, (t, s) => { const a = a0 + t * speed; s.pos.set(center.x + Math.sin(a) * radius, center.y + height, center.z + Math.cos(a) * radius); s.look.copy(center); });
    cam.shot.fn(0, cam.shot);
  };
  cam.endCine = function (blend) {
    if (cam.mode !== 'cine') return; cam.mode = 'follow';
    cam.fromPos.copy(G.camera.position); cam.fromQ.copy(G.camera.quaternion); cam.blend = cam.blendT = blend || 0.5; cam.sinceLook = 0;
  };
  cam.finisher = function (pl, e) {
    const mx = (pl.pos.x + e.pos.x) / 2, mz = (pl.pos.z + e.pos.z) / 2, y = pl.pos.y;
    let dx = e.pos.x - pl.pos.x, dz = e.pos.z - pl.pos.z; const d = Math.hypot(dx, dz) || 1; dx /= d; dz /= d;
    // pick the side with more room
    const a = W.ray(mx, y + 1.3, mz, -dz, 0.12, dx, 5.4), b = W.ray(mx, y + 1.3, mz, dz, 0.12, -dx, 5.4), s = a >= b ? 1 : -1, r = Math.max(2.4, Math.max(a, b) - 0.5);
    const p0 = v3(mx - dz * s * r + dx * 1.2, y + 1.0 + r * 0.12, mz + dx * s * r + dz * 1.2), p1 = v3(mx - dz * s * (r - 0.7) - dx * 0.6, y + 0.75, mz + dx * s * (r - 0.7) - dz * 0.6);
    const l0 = v3(mx, y + 1.25, mz), l1 = v3(mx, y + 1.7, mz);
    cam.move(p0, l0, p1, l1, 1.25, 46);
  };
})();
