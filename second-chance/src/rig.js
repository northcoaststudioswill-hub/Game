'use strict';
/* SECOND CHANCE - rig: low-poly people built from parts, skinned to a skeleton, with ink shells and drawn faces. */
(function () {
  const G = SC.gfx;

  const SPECS = SC.SPECS = {
    hero: { h: 1, b: 1, face: 'hero', hair: 'hero', coat: true, scarf: true, glowHand: true,
      pal: { skin: 0xe8b48a, top: 0xc9a063, trim: 0x7a5a2c, shirt: 0xece6d6, tie: 0x8a1f24, pants: 0x1f2233, boots: 0x101018, hair: 0x15151f, streak: 0xf6f2e6, glove: 0x23232e, wrap: 0xece6d6 } },
    hollow: { h: 0.98, b: 1.02, face: 'mask', hood: true,
      pal: { skin: 0xe9e6da, top: 0x56608a, trim: 0x343b5c, shirt: 0x343b5c, tie: 0x343b5c, pants: 0x2b2f47, boots: 0x14141d, hair: 0x343b5c, glove: 0xe9e6da, wrap: 0x56608a } },
    knifer: { h: 0.95, b: 0.9, face: 'maskK', hood: true, weapon: 'knife',
      pal: { skin: 0xe9e6da, top: 0x9c2f3f, trim: 0x5c1a26, shirt: 0x5c1a26, tie: 0x5c1a26, pants: 0x23202c, boots: 0x14141d, hair: 0x5c1a26, glove: 0x14141d, wrap: 0x9c2f3f } },
    bruiser: { h: 1.24, b: 1.5, face: 'maskB', hair: 'bald', weapon: 'pipe', apron: true,
      pal: { skin: 0xe9e6da, top: 0x3f6b55, trim: 0x244234, shirt: 0xb9a57a, tie: 0xb9a57a, pants: 0x2a2c33, boots: 0x14141d, hair: 0xe9e6da, glove: 0xb9a57a, wrap: 0xe9e6da } },
    boss: { h: 1.14, b: 1.08, face: 'skull', hat: 'brim', coat: true, weapon: 'hook',
      pal: { skin: 0xd9c9b0, top: 0xefe9da, trim: 0x15151f, shirt: 0x15151f, tie: 0xb3202a, pants: 0x15151f, boots: 0x0c0c12, hair: 0x15151f, glove: 0xb3202a, wrap: 0xefe9da } },
    clerk: { h: 1.06, b: 0.84, face: 'clerk', hat: 'bowler', hair: 'bald', book: true,
      pal: { skin: 0xc9cbd6, top: 0x6f7690, trim: 0x474c62, shirt: 0xe9e6da, tie: 0x15151f, pants: 0x474c62, boots: 0x101018, hair: 0x15151f, glove: 0xe9e6da, wrap: 0x6f7690 } }
  };

  function tbox(w, h, d, top, bot) {
    const g = new THREE.BoxGeometry(w, h, d), p = g.attributes.position;
    top = top === undefined ? 1 : top; bot = bot === undefined ? 1 : bot;
    for (let i = 0; i < p.count; i++) { const k = p.getY(i) > 0 ? top : bot; p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); }
    g.computeVertexNormals(); return g;
  }
  function limb(rt, rb, h) { const g = new THREE.CylinderGeometry(rt, rb, h, 7); return g; }

  /* ---------- faces ---------- */
  const hex = c => '#' + ('000000' + c.toString(16)).slice(-6);
  function drawFace(g, kind, expr, glow) {
    const S = 128, ink = '#07070d';
    g.setTransform(1, 0, 0, 1, 0, 0); g.lineCap = 'round'; g.lineJoin = 'round';
    const eye = (x, y, w, h, iris, lid) => {
      g.fillStyle = ink; g.beginPath(); g.ellipse(x, y, w + 3, h + 3, 0, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, y + 1, w, h, 0, 0, 7); g.fill();
      g.fillStyle = iris; g.beginPath(); g.arc(x, y + 1, Math.min(h + 1, 6), 0, 7); g.fill();
      g.fillStyle = ink; g.beginPath(); g.arc(x, y + 1, 2.4, 0, 7); g.fill();
      g.fillStyle = ink; g.fillRect(x - w - 4, y - h - 4, (w + 4) * 2, h * lid + 3);
    };
    const stroke = (pts, w, col) => { g.strokeStyle = col || ink; g.lineWidth = w; g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.stroke(); };
    if (kind === 'hero') {
      g.fillStyle = '#e8b48a'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#b97f5c'; g.beginPath(); g.moveTo(0, 40); g.lineTo(34, 62); g.lineTo(30, 96); g.lineTo(52, 128); g.lineTo(0, 128); g.fill();
      g.fillStyle = '#b97f5c'; g.fillRect(40, 106, 60, 22);
      const e = { neutral: [5.5, 0.35, 0, 0], angry: [5, 0.5, 7, 0], hurt: [3, 0.9, -6, 0], shock: [8, 0, -3, -4], smirk: [5, 0.45, 3, 0], shut: [1, 1.2, 0, 0], dead: [1, 1.2, -4, 0] }[expr] || [5.5, 0.35, 0, 0];
      eye(42, 60, 11, e[0], '#3b2a20', e[1]); eye(86, 60, 11, e[0], glow, e[1]);
      stroke([28, 44 + e[3] - e[2] * 0.3, 54, 46 + e[3] + e[2]], 7); stroke([100, 44 + e[3] - e[2] * 0.3, 74, 46 + e[3] + e[2]], 7);
      stroke([66, 58, 62, 80, 68, 83], 3);
      stroke([92, 34, 98, 52], 2.5, '#8c4a3a'); stroke([90, 40, 100, 38], 2, '#8c4a3a');
      if (expr === 'angry') { g.fillStyle = ink; g.fillRect(44, 94, 42, 15); g.fillStyle = '#fff'; g.fillRect(47, 97, 36, 9); stroke([56, 97, 56, 106], 1.5); stroke([65, 97, 65, 106], 1.5); stroke([74, 97, 74, 106], 1.5); }
      else if (expr === 'hurt' || expr === 'dead') { g.fillStyle = ink; g.beginPath(); g.ellipse(65, 101, 13, 8, 0, 0, 7); g.fill(); g.fillStyle = '#8a1f24'; g.beginPath(); g.ellipse(65, 103, 8, 4, 0, 0, 7); g.fill(); }
      else if (expr === 'shock') { g.fillStyle = ink; g.beginPath(); g.ellipse(65, 102, 7, 9, 0, 0, 7); g.fill(); }
      else if (expr === 'smirk') stroke([48, 102, 70, 103, 84, 95], 4);
      else stroke([50, 101, 80, 101], 4);
      stroke([58, 112, 72, 112], 2);
      g.fillStyle = 'rgba(7,7,13,0.5)'; for (let i = 0; i < 26; i++) g.fillRect(40 + (i * 37 % 52), 86 + (i * 13 % 34), 1.6, 1.6);
    } else if (kind === 'clerk') {
      g.fillStyle = '#c9cbd6'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#9a9db0'; g.fillRect(0, 0, 30, S); g.fillRect(36, 108, 60, 20);
      [42, 86].forEach(x => { g.fillStyle = ink; g.beginPath(); g.arc(x, 60, 19, 0, 7); g.fill(); g.fillStyle = '#f4f6ff'; g.beginPath(); g.arc(x, 60, 14, 0, 7); g.fill(); g.fillStyle = '#b9c6ff'; g.beginPath(); g.moveTo(x - 10, 68); g.lineTo(x + 4, 48); g.lineTo(x + 10, 52); g.lineTo(x - 4, 72); g.fill(); });
      stroke([58, 58, 70, 58], 4); stroke([64, 70, 62, 84], 2.5);
      stroke([48, 96, 64, 92, 80, 96], 5); stroke([54, 104, 76, 104], 3);
    } else if (kind === 'skull') {
      g.fillStyle = '#d9c9b0'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#efe9da'; g.fillRect(0, 0, S, 84); g.fillStyle = ink; g.fillRect(0, 82, S, 5);
      [[42, -1], [86, 1]].forEach(a => { g.fillStyle = ink; g.beginPath(); g.moveTo(a[0] - 16, 46); g.lineTo(a[0] + 16, 50 - a[1] * 4); g.lineTo(a[0] + 12, 72); g.lineTo(a[0] - 12, 72); g.fill(); g.fillStyle = '#ff3b30'; g.beginPath(); g.arc(a[0], 61, 4.2, 0, 7); g.fill(); });
      g.fillStyle = ink; g.beginPath(); g.moveTo(64, 66); g.lineTo(71, 80); g.lineTo(57, 80); g.fill();
      stroke([20, 20, 34, 34, 30, 44], 2.5); stroke([100, 14, 92, 30], 2.5);
      g.fillStyle = ink; g.fillRect(38, 94, 54, 16); g.fillStyle = '#fff'; g.fillRect(41, 97, 48, 10);
      for (let x = 49; x < 88; x += 8) stroke([x, 97, x, 107], 1.6);
      g.fillStyle = '#b09a7c'; g.fillRect(0, 112, S, 16);
    } else {
      g.fillStyle = '#e9e6da'; g.fillRect(0, 0, S, S);
      g.fillStyle = '#b7b3a4'; g.beginPath(); g.moveTo(0, 30); g.lineTo(30, 60); g.lineTo(24, 128); g.lineTo(0, 128); g.fill();
      const pupil = expr === 'dead' ? null : (expr === 'bound' ? '#19d3c5' : '#c8ff3a');
      const hole = (x, dir, w, h) => {
        g.fillStyle = ink; g.beginPath(); g.moveTo(x - w, 52 + dir * 5); g.lineTo(x + w, 52 - dir * 5); g.lineTo(x + w * 0.8, 52 + h); g.lineTo(x - w * 0.8, 52 + h); g.fill();
        if (pupil) { g.fillStyle = pupil; g.beginPath(); g.arc(x, 52 + h * 0.55, expr === 'angry' ? 5 : 3.4, 0, 7); g.fill(); }
      };
      if (kind === 'maskK') {
        hole(42, -1, 16, 10); hole(86, 1, 16, 10);
        stroke([52, 84, 76, 108], 6, '#9c2f3f'); stroke([76, 84, 52, 108], 6, '#9c2f3f');
        stroke([64, 10, 60, 30, 66, 40], 2.2);
      } else if (kind === 'maskB') {
        hole(40, -1, 17, 20);
        stroke([70, 6, 82, 30, 76, 50, 92, 66, 86, 84], 3.5); stroke([82, 30, 100, 36], 2.5); stroke([92, 66, 110, 62], 2.5);
        g.fillStyle = ink; g.fillRect(34, 92, 62, 20); g.fillStyle = '#e9e6da'; for (let x = 38; x < 92; x += 10) g.fillRect(x, 95, 7, 14);
      } else {
        hole(42, -1, 15, 18); hole(86, 1, 15, 18);
        stroke([64, 8, 60, 24, 68, 34], 2.2); stroke([104, 80, 96, 96, 100, 110], 2.2);
        stroke([46, 100, 82, 100], 3); for (let x = 50; x < 82; x += 8) stroke([x, 95, x, 105], 2);
      }
    }
  }
  SC.drawFace = drawFace;

  function headGeo(rx, ry, rz) {
    const g0 = new THREE.SphereGeometry(1, 10, 7), p0 = g0.attributes.position;
    for (let i = 0; i < p0.count; i++) {
      let x = p0.getX(i), y = p0.getY(i), z = p0.getZ(i);
      if (y < 0) { const k = 1 + 0.34 * y; x *= k; z *= z > 0 ? 1 + 0.1 * y : k; }
      if (z > 0) z *= 0.92;
      p0.setXYZ(i, x * rx, y * ry, z * rz);
    }
    g0.computeVertexNormals();
    const g = g0.toNonIndexed(), p = g.attributes.position, uv = g.attributes.uv;
    for (let t = 0; t < p.count; t += 3) {
      const cz = (p.getZ(t) + p.getZ(t + 1) + p.getZ(t + 2)) / 3;
      for (let k = 0; k < 3; k++) {
        const i = t + k;
        if (cz > rz * 0.12) uv.setXY(i, 0.5 + p.getX(i) / (2 * rx) * 0.94, 0.5 + p.getY(i) / (2 * ry) * 0.94);
        else uv.setXY(i, 0.04, 0.96);
      }
    }
    return g;
  }

  /* ---------- the builder ---------- */
  SC.makeHumanoid = function (kind) {
    const sp = SPECS[kind], b = sp.b, pal = sp.pal;
    const defs = [
      ['root', null, 0, 0, 0], ['hips', 'root', 0, 0.96, 0], ['spine', 'hips', 0, 0.1, 0], ['chest', 'spine', 0, 0.2, 0], ['neck', 'chest', 0, 0.27, 0], ['head', 'neck', 0, 0.07, 0],
      ['shL', 'chest', 0.215 * b, 0.2, 0], ['elL', 'shL', 0, -0.29, 0], ['haL', 'elL', 0, -0.26, 0],
      ['shR', 'chest', -0.215 * b, 0.2, 0], ['elR', 'shR', 0, -0.29, 0], ['haR', 'elR', 0, -0.26, 0],
      ['thL', 'hips', 0.1 * b, -0.04, 0], ['shnL', 'thL', 0, -0.44, 0], ['ftL', 'shnL', 0, -0.42, 0],
      ['thR', 'hips', -0.1 * b, -0.04, 0], ['shnR', 'thR', 0, -0.44, 0], ['ftR', 'shnR', 0, -0.42, 0],
      ['tailL', 'hips', 0.13 * b, -0.02, 0.02], ['tailR', 'hips', -0.13 * b, -0.02, 0.02], ['tailB', 'hips', 0, -0.02, -0.1 * b],
      ['sc1', 'chest', 0, 0.25, -0.13], ['sc2', 'sc1', 0, 0, -0.27], ['sc3', 'sc2', 0, 0, -0.27]
    ];
    const bones = {}, list = [], world = {};
    defs.forEach((d, i) => {
      const bn = new THREE.Bone(); bn.name = d[0]; bn.position.set(d[2], d[3], d[4]); bn.userData.idx = i; bn.userData.rest = bn.position.clone();
      bones[d[0]] = bn; list.push(bn);
      if (d[1]) { bones[d[1]].add(bn); world[d[0]] = world[d[1]].clone().add(bn.position); } else world[d[0]] = bn.position.clone();
    });
    const A = { pos: [], nor: [], col: [], si: [], sw: [], idx: [] }, O = { pos: [], si: [], sw: [], idx: [] };
    const v = new THREE.Vector3(), n = new THREE.Vector3(), m = new THREE.Matrix4(), m3 = new THREE.Matrix3(), col = new THREE.Color();
    const q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
    function part(bone, geo, x, y, z, color, rot, ol) {
      const w = world[bone], bi = bones[bone].userData.idx;
      e.set(rot ? rot[0] : 0, rot ? rot[1] : 0, rot ? rot[2] : 0); q.setFromEuler(e);
      m.compose(v.set(x + w.x, y + w.y, z + w.z), q, one); m3.getNormalMatrix(m); col.set(color);
      const p = geo.attributes.position, nn = geo.attributes.normal, base = A.pos.length / 3, ix = geo.index;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).applyMatrix4(m); A.pos.push(v.x, v.y, v.z);
        n.fromBufferAttribute(nn, i).applyMatrix3(m3).normalize(); A.nor.push(n.x, n.y, n.z);
        A.col.push(col.r, col.g, col.b); A.si.push(bi, 0, 0, 0); A.sw.push(1, 0, 0, 0);
      }
      if (ix) for (let i = 0; i < ix.count; i++) A.idx.push(base + ix.getX(i)); else for (let i = 0; i < p.count; i++) A.idx.push(base + i);
      ol = ol === undefined ? 0.022 : ol;
      if (ol > 0) {
        geo.computeBoundingBox(); const bb = geo.boundingBox, ob = O.pos.length / 3;
        const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
        const sx = 1 + 2 * ol / Math.max(0.02, bb.max.x - bb.min.x), sy = 1 + 2 * ol / Math.max(0.02, bb.max.y - bb.min.y), sz = 1 + 2 * ol / Math.max(0.02, bb.max.z - bb.min.z);
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i); v.set(cx + (v.x - cx) * sx, cy + (v.y - cy) * sy, cz + (v.z - cz) * sz).applyMatrix4(m);
          O.pos.push(v.x, v.y, v.z); O.si.push(bi, 0, 0, 0); O.sw.push(1, 0, 0, 0);
        }
        if (ix) for (let i = 0; i < ix.count; i++) O.idx.push(ob + ix.getX(i)); else for (let i = 0; i < p.count; i++) O.idx.push(ob + i);
      }
    }
    // trunk
    part('hips', tbox(0.34 * b, 0.2, 0.23 * b, 1, 0.9), 0, 0, 0, sp.coat || sp.apron ? pal.top : pal.pants);
    part('hips', tbox(0.36 * b, 0.05, 0.25 * b), 0, 0.09, 0, pal.trim, null, 0.012);
    part('spine', tbox(0.33 * b, 0.24, 0.21 * b, 1.08, 1), 0, 0.09, 0, pal.top);
    part('chest', tbox(0.46 * b, 0.3, 0.25 * b, 1, 0.78), 0, 0.12, 0, pal.top);
    part('chest', tbox(0.13 * b, 0.3, 0.03), 0, 0.1, 0.118 * b, pal.shirt, null, 0);
    part('chest', tbox(0.04, 0.24, 0.02), 0, 0.09, 0.136 * b, pal.tie, null, 0);
    if (sp.coat) {
      part('chest', tbox(0.1, 0.2, 0.03), 0.1 * b, 0.14, 0.125 * b, pal.trim, [0, 0, -0.2], 0.01);
      part('chest', tbox(0.1, 0.2, 0.03), -0.1 * b, 0.14, 0.125 * b, pal.trim, [0, 0, 0.2], 0.01);
      part('chest', tbox(0.12, 0.13, 0.05), 0.12 * b, 0.32, -0.02, pal.top, [0, 0, 0.5]);
      part('chest', tbox(0.12, 0.13, 0.05), -0.12 * b, 0.32, -0.02, pal.top, [0, 0, -0.5]);
      part('tailL', tbox(0.2 * b, 0.56, 0.05, 1, 1.25), 0.02, -0.28, 0.05, pal.top, [0, -0.5, 0]);
      part('tailR', tbox(0.2 * b, 0.56, 0.05, 1, 1.25), -0.02, -0.28, 0.05, pal.top, [0, 0.5, 0]);
      part('tailB', tbox(0.34 * b, 0.6, 0.05, 1, 1.25), 0, -0.3, 0, pal.top);
    }
    if (sp.apron) part('hips', tbox(0.3 * b, 0.5, 0.04, 1, 0.9), 0, -0.2, 0.13 * b, pal.shirt);
    part('neck', limb(0.055, 0.065, 0.12), 0, 0.02, 0, pal.skin, null, 0.01);
    // arms
    [['L', 1], ['R', -1]].forEach(s => {
      const L = s[0], hero = kind === 'hero' && L === 'L';
      part('sh' + L, tbox(0.15 * b, 0.13, 0.17 * b, 0.85, 1), 0.01 * s[1], 0, 0, pal.top);
      part('sh' + L, limb(0.062 * b, 0.054 * b, 0.3), 0, -0.15, 0, pal.top);
      part('el' + L, limb(0.054 * b, 0.044 * b, 0.27), 0, -0.13, 0, hero ? pal.wrap : pal.top);
      if (sp.coat && !hero) part('el' + L, tbox(0.125 * b, 0.07, 0.125 * b), 0, -0.22, 0, pal.trim, null, 0.01);
      if (!hero) part('ha' + L, tbox(0.085 * b, 0.11, 0.095 * b, 1, 0.8), 0, -0.05, 0, L === 'R' || !sp.glowHand ? pal.glove : pal.skin);
      part('th' + L, limb(0.085 * b, 0.066 * b, 0.46), 0, -0.22, 0, pal.pants);
      part('shn' + L, limb(0.064 * b, 0.05 * b, 0.42), 0, -0.2, 0, pal.pants);
      part('shn' + L, tbox(0.125 * b, 0.16, 0.135 * b, 1.05, 0.95), 0, -0.33, 0, pal.boots, null, 0.012);
      part('ft' + L, tbox(0.115 * b, 0.1, 0.27, 0.8, 1), 0, -0.01, 0.065, pal.boots);
    });
    // hair, hoods, hats, ears
    if (sp.hair === 'hero') {
      part('head', tbox(0.25, 0.1, 0.26, 0.8, 1), 0, 0.235, -0.02, pal.hair, [-0.12, 0, 0]);
      part('head', tbox(0.245, 0.2, 0.09, 1, 0.8), 0, 0.13, -0.105, pal.hair);
      part('head', tbox(0.04, 0.12, 0.14), 0.118, 0.17, -0.03, pal.hair, null, 0.01);
      part('head', tbox(0.04, 0.12, 0.14), -0.118, 0.17, -0.03, pal.hair, null, 0.01);
      part('head', tbox(0.09, 0.07, 0.17, 0.4, 1), -0.055, 0.275, 0.07, pal.hair, [0.35, 0.25, 0.1]);
      part('head', tbox(0.075, 0.075, 0.2, 0.4, 1), 0.06, 0.28, 0.075, pal.streak, [0.42, -0.2, -0.1]);
      part('head', tbox(0.07, 0.06, 0.16, 0.3, 1), 0, 0.3, -0.06, pal.hair, [-0.5, 0, 0]);
    }
    if (sp.hood) {
      part('head', tbox(0.29, 0.16, 0.29, 0.72, 1), 0, 0.235, -0.025, pal.top);
      part('head', tbox(0.28, 0.26, 0.11, 1, 0.9), 0, 0.11, -0.115, pal.top);
      part('head', tbox(0.05, 0.25, 0.2), 0.13, 0.12, -0.02, pal.top); part('head', tbox(0.05, 0.25, 0.2), -0.13, 0.12, -0.02, pal.top);
      part('chest', tbox(0.36 * b, 0.09, 0.3 * b), 0, 0.29, -0.01, pal.trim);
    }
    if (sp.hat === 'bowler') {
      part('head', limb(0.115, 0.125, 0.13), 0, 0.3, 0, pal.hair); part('head', limb(0.19, 0.19, 0.025), 0, 0.235, 0, pal.hair);
    }
    if (sp.hat === 'brim') {
      part('head', limb(0.11, 0.13, 0.15), 0, 0.31, 0, pal.hair); part('head', limb(0.27, 0.27, 0.025), 0, 0.24, 0, pal.hair);
      part('head', limb(0.132, 0.132, 0.035), 0, 0.26, 0, pal.tie, null, 0);
    }
    if (!sp.hood) { part('head', tbox(0.03, 0.06, 0.04), 0.118, 0.13, 0, pal.skin, null, 0.008); part('head', tbox(0.03, 0.06, 0.04), -0.118, 0.13, 0, pal.skin, null, 0.008); }

    const mkGeo = (S, full) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(S.pos, 3));
      if (full) { g.setAttribute('normal', new THREE.Float32BufferAttribute(S.nor, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(S.col, 3)); }
      g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(S.si, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(S.sw, 4));
      g.setIndex(S.idx); return g;
    };
    const group = new THREE.Group(), inner = new THREE.Group(); group.add(inner); inner.scale.setScalar(sp.h);
    const bodyMat = G.toon({ vertexColors: true });
    const mesh = new THREE.SkinnedMesh(mkGeo(A, true), bodyMat);
    mesh.add(bones.root); inner.add(mesh); mesh.updateMatrixWorld(true);
    const skel = new THREE.Skeleton(list); mesh.bind(skel);
    const olMat = new THREE.MeshBasicMaterial({ color: G.INK, side: THREE.BackSide });
    const ol = new THREE.SkinnedMesh(mkGeo(O, false), olMat); inner.add(ol); ol.bind(skel, new THREE.Matrix4());
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false; ol.frustumCulled = false;

    // head with a drawn face
    const faces = {}, faceCv = {};
    const faceMat = G.toon({});
    const model = { kind, spec: sp, group, inner, bones, mesh, ol, bodyMat, faceMat, mats: [bodyMat, faceMat], glow: '#ff5a1f', extra: [] };
    model.face = function (expr) {
      if (model.expr === expr) return; model.expr = expr;
      let t = faces[expr];
      if (!t) {
        const c = faceCv[expr] = document.createElement('canvas'); c.width = c.height = 128;
        drawFace(c.getContext('2d'), sp.face, expr, model.glow);
        t = faces[expr] = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      }
      faceMat.map = t; faceMat.needsUpdate = true;
    };
    const hd = G.inked(headGeo(0.118, 0.142, 0.125), faceMat, 0.02);
    hd.position.set(0, 0.14, 0.012); bones.head.add(hd); model.head = hd;
    model.face('neutral');
    const add = (bone, geo, mat, x, y, z, t) => { const o = G.inked(geo, mat, t); o.position.set(x, y, z); bones[bone].add(o); model.extra.push(o); return o; };

    if (sp.scarf) {
      const sm = model.scarfMat = G.toon({ color: 0xff5a1f }); model.mats.push(sm);
      add('chest', tbox(0.25, 0.09, 0.24), sm, 0, 0.275, 0.005, 0.02);
      add('sc1', tbox(0.15, 0.035, 0.3), sm, 0, 0, -0.13, 0.016);
      add('sc2', tbox(0.14, 0.035, 0.3), sm, 0, 0, -0.13, 0.016);
      add('sc3', tbox(0.12, 0.035, 0.3, 1, 1), sm, 0, 0, -0.13, 0.016);
    }
    if (sp.glowHand) {
      const gm = model.glowMat = new THREE.MeshBasicMaterial({ color: 0xff5a1f, fog: false });
      add('haL', tbox(0.095, 0.115, 0.1, 1, 0.8), gm, 0, -0.05, 0, 0.02);
      add('elL', tbox(0.115, 0.03, 0.115), gm, 0, -0.07, 0, 0); add('elL', tbox(0.11, 0.03, 0.11), gm, 0, -0.16, 0, 0);
      add('chest', tbox(0.05, 0.05, 0.02), gm, 0.09, 0.16, 0.135, 0).rotation.z = 0.785;
    }
    const steel = G.toon({ color: 0xd9dde6 }), dark = G.toon({ color: 0x23232e });
    if (sp.weapon === 'knife') { add('haR', tbox(0.025, 0.3, 0.07, 1, 0.2), steel, 0, -0.25, 0.02, 0.014); model.mats.push(steel); }
    if (sp.weapon === 'pipe') { add('haR', limb(0.035, 0.035, 0.9), steel, 0, -0.42, 0, 0.016); add('haR', limb(0.06, 0.06, 0.12), dark, 0, -0.84, 0, 0.016); model.mats.push(steel, dark); }
    if (sp.weapon === 'hook') {
      add('haR', limb(0.022, 0.022, 1.2), dark, 0, -0.5, 0, 0.014);
      add('haR', tbox(0.03, 0.05, 0.3), steel, 0, -1.1, 0.13, 0.014); add('haR', tbox(0.03, 0.18, 0.05, 0.3, 1), steel, 0, -1.0, 0.27, 0.014);
      model.mats.push(steel, dark);
    }
    if (sp.book) { const bk = G.toon({ color: 0x8a1f24 }); add('haL', tbox(0.05, 0.3, 0.22), bk, 0.02, -0.06, 0.08, 0.014); model.mats.push(bk); }

    model.setGlow = function (colorHex, css) {
      model.glow = css;
      if (model.scarfMat) model.scarfMat.color.set(colorHex);
      if (model.glowMat) model.glowMat.color.set(colorHex);
      Object.keys(faceCv).forEach(k => { drawFace(faceCv[k].getContext('2d'), sp.face, k, css); faces[k].needsUpdate = true; });
    };
    model.tint = function (k) { for (let i = 0; i < model.mats.length; i++) model.mats[i].emissive.setScalar(k); };
    model.height = 1.82 * sp.h;
    model.anim = new Anim(model);
    return model;
  };

  /* ---------- animation: every frame a pose is chosen and the joints ease toward it ---------- */
  const NAMES = ['hips', 'spine', 'chest', 'neck', 'head', 'shL', 'elL', 'haL', 'shR', 'elR', 'haR', 'thL', 'shnL', 'ftL', 'thR', 'shnR', 'ftR', 'tailL', 'tailR', 'tailB', 'sc1', 'sc2', 'sc3'];
  const ZERO = [0, 0, 0], REST = { sc1: [-1.12, 0, 0], sc2: [-0.25, 0, 0], sc3: [-0.1, 0, 0] };
  function Anim(model) {
    this.m = model; this.cur = {}; NAMES.forEach(nm => { this.cur[nm] = [0, 0, 0]; });
    this.y = 0; this.baseY = model.bones.hips.position.y;
  }
  Anim.prototype.apply = function (pose, rate, dt) {
    const k = rate >= 999 ? 1 : 1 - Math.exp(-rate * dt), b = this.m.bones;
    for (let i = 0; i < NAMES.length; i++) {
      const nm = NAMES[i], c = this.cur[nm], t = pose[nm] || REST[nm] || ZERO;
      c[0] += ((t[0] || 0) - c[0]) * k; c[1] += ((t[1] || 0) - c[1]) * k; c[2] += ((t[2] || 0) - c[2]) * k;
      b[nm].rotation.set(c[0], c[1], c[2]);
    }
    this.y += ((pose.y || 0) - this.y) * k;
    b.hips.position.y = this.baseY + this.y;
  };
  SC.Anim = Anim;

  function mix(a, b, t) {
    const o = { y: SC.lerp(a.y || 0, b.y || 0, t) };
    for (let i = 0; i < NAMES.length; i++) {
      const nm = NAMES[i], pa = a[nm], pb = b[nm]; if (!pa && !pb) continue;
      const x = pa || REST[nm] || ZERO, z = pb || REST[nm] || ZERO;
      o[nm] = [SC.lerp(x[0] || 0, z[0] || 0, t), SC.lerp(x[1] || 0, z[1] || 0, t), SC.lerp(x[2] || 0, z[2] || 0, t)];
    }
    return o;
  }
  /* keys: [[time, pose], ...] */
  function clip(keys, t) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) return mix(keys[i - 1][1], keys[i][1], SC.smooth((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
    return keys[keys.length - 1][1];
  }
  SC.mixPose = mix; SC.clip = clip;

  const P = SC.pose = {};
  P.idle = t => { const br = Math.sin(t * 1.7) * 0.02; return {
    spine: [0.03 + br, 0, 0], chest: [0.03 + br, 0, 0], head: [-0.03 - br, Math.sin(t * 0.5) * 0.08, 0],
    shL: [0.06, 0, 0.13], elL: [-0.28, 0, 0], shR: [0.06, 0, -0.13], elR: [-0.28, 0, 0],
    thL: [-0.05, 0, 0.06], shnL: [0.08, 0, 0], thR: [0.05, 0, -0.06], shnR: [0.06, 0, 0],
    tailL: [0.03, 0, 0.05], tailR: [0.03, 0, -0.05], tailB: [0.05 + br, 0, 0],
    sc1: [-1.15 + br * 2, 0, 0], sc2: [-0.25, 0, 0], sc3: [-0.1, Math.sin(t * 1.3) * 0.1, 0], y: -0.012 + br * 0.3 }; };
  P.guard = t => { const br = Math.sin(t * 3) * 0.02; return {
    hips: [0, -0.4, 0], spine: [0.14 + br, 0.12, 0], chest: [0.1, 0.14, 0], neck: [0, 0.14, 0], head: [0.02, 0.1, 0],
    shL: [-0.95, 0, 0.25], elL: [-1.75 + br, 0, 0], shR: [-0.45, 0, -0.35], elR: [-2.05 - br, 0, 0],
    thL: [-0.42, 0, 0.1], shnL: [0.55, 0, 0], thR: [0.3, 0, -0.14], shnR: [0.42, 0, 0], ftR: [-0.2, 0, 0],
    tailL: [0.1, 0, 0.1], tailR: [0.1, 0, -0.1], tailB: [0.2, 0, 0],
    sc1: [-1.0, 0, 0], sc2: [-0.3, 0, 0], sc3: [-0.1, Math.sin(t * 2) * 0.15, 0], y: -0.09 + br * 0.3 }; };
  P.run = (ph, s) => { const a = Math.sin(ph), c = Math.cos(ph), f = SC.clamp(s, 0.25, 1.15); return {
    hips: [0, -0.14 * a * f, 0], spine: [0.2 * f, 0, 0], chest: [0.1 * f, 0.26 * a * f, 0], neck: [0, -0.1 * a * f, 0], head: [-0.2 * f, 0, 0],
    shL: [0.85 * a * f, 0, 0.12], elL: [-1.25 - 0.35 * a, 0, 0], shR: [-0.85 * a * f, 0, -0.12], elR: [-1.25 + 0.35 * a, 0, 0],
    thL: [(-0.95 * a - 0.12) * f, 0, 0.03], shnL: [(0.22 + 1.15 * Math.max(0, c)) * f, 0, 0], ftL: [0.25 * Math.max(0, -a), 0, 0],
    thR: [(0.95 * a - 0.12) * f, 0, -0.03], shnR: [(0.22 + 1.15 * Math.max(0, -c)) * f, 0, 0], ftR: [0.25 * Math.max(0, a), 0, 0],
    tailL: [0.75 * f + 0.15 * c, 0, 0.3 * f], tailR: [0.75 * f - 0.15 * c, 0, -0.3 * f], tailB: [0.95 * f + 0.12 * Math.sin(ph * 2), 0, 0],
    sc1: [-0.12 + 0.1 * Math.sin(ph * 2), 0.12 * a, 0], sc2: [0.08 * c, 0.2 * c, 0], sc3: [0.12 * a, -0.25 * a, 0],
    y: -0.05 * f + 0.045 * Math.cos(ph * 2) * f }; };
  /* enemies shamble rather than run */
  P.shamble = (ph, s, t) => { const o = P.run(ph, s * 0.6); o.spine = [0.38, 0, Math.sin(ph) * 0.08]; o.head = [0.05, Math.sin(t * 0.9) * 0.25, 0.18];
    o.shL = [-0.35 + 0.3 * Math.sin(ph), 0, 0.12]; o.elL = [-0.55, 0, 0]; o.shR = [-0.35 - 0.3 * Math.sin(ph), 0, -0.12]; o.elR = [-0.55, 0, 0]; return o; };
  P.lurk = t => ({ spine: [0.36 + Math.sin(t * 1.3) * 0.03, 0, Math.sin(t * 0.7) * 0.05], chest: [0.1, 0, 0], head: [0.1, Math.sin(t * 0.9) * 0.3, 0.2],
    shL: [-0.2, 0, 0.1], elL: [-0.5, 0, 0], shR: [-0.2, 0, -0.1], elR: [-0.5, 0, 0], thL: [-0.12, 0, 0.08], shnL: [0.25, 0, 0], thR: [0.1, 0, -0.08], shnR: [0.2, 0, 0], y: -0.05 });

  const A1w = { hips: [0, -0.55, 0], spine: [0.1, -0.2, 0], chest: [0.05, -0.3, 0], head: [0, 0.75, 0], shL: [-1.0, 0, 0.2], elL: [-1.6, 0, 0], shR: [0.5, 0, -0.35], elR: [-2.1, 0, 0], thL: [-0.45, 0, 0.1], shnL: [0.6, 0, 0], thR: [0.35, 0, -0.1], shnR: [0.5, 0, 0], tailB: [0.3, 0, 0], sc1: [-0.9, 0, 0], y: -0.12 };
  const A1s = { hips: [0, 0.45, 0], spine: [0.22, 0.2, 0], chest: [0.1, 0.3, 0], head: [-0.1, -0.85, 0], shL: [0.5, 0, 0.3], elL: [-2.0, 0, 0], shR: [-1.5, 0, 0.15], elR: [-0.06, 0, 0], thL: [-0.75, 0, 0.05], shnL: [0.85, 0, 0], thR: [0.6, 0, -0.1], shnR: [0.25, 0, 0], ftR: [-0.5, 0, 0], tailB: [0.6, 0, 0], sc1: [-0.4, 0, 0], y: -0.16 };
  const A2w = { hips: [0, 0.6, 0], spine: [0.1, 0.25, 0], chest: [0.05, 0.4, 0], head: [0, -0.9, 0], shL: [0.3, 0, 1.1], elL: [-1.5, 0, 0], shR: [-0.9, 0, -0.2], elR: [-1.9, 0, 0], thL: [0.2, 0, 0.12], shnL: [0.45, 0, 0], thR: [-0.4, 0, -0.1], shnR: [0.55, 0, 0], sc1: [-0.9, 0, 0], y: -0.12 };
  const A2s = { hips: [0, -0.75, 0], spine: [0.2, -0.3, 0], chest: [0.12, -0.5, 0], head: [-0.05, 1.2, 0], shL: [-1.45, -0.7, 0.35], elL: [-0.85, 0, 0], shR: [0.3, 0, -0.4], elR: [-2.0, 0, 0], thL: [-0.6, 0, 0.1], shnL: [0.7, 0, 0], thR: [0.5, 0, -0.14], shnR: [0.3, 0, 0], ftR: [-0.4, 0, 0], tailB: [0.5, 0, 0], sc1: [-0.4, 0.5, 0], y: -0.15 };
  const A3w = { hips: [0, -0.5, 0], spine: [0.35, 0, 0], chest: [0.1, -0.2, 0], head: [-0.2, 0.6, 0], shL: [-0.6, 0, 0.5], elL: [-1.6, 0, 0], shR: [-0.6, 0, -0.5], elR: [-1.6, 0, 0], thL: [-0.5, 0, 0.1], shnL: [0.9, 0, 0], thR: [-0.9, 0, -0.1], shnR: [1.7, 0, 0], y: -0.22 };
  const A3s = { hips: [-0.25, 1.35, 0.1], spine: [0.1, -0.3, -0.2], chest: [0, -0.4, 0], neck: [0, -0.3, 0], head: [0, -0.35, 0], shL: [0.4, 0, 0.9], elL: [-0.6, 0, 0], shR: [-0.5, 0, -1.0], elR: [-0.9, 0, 0], thL: [0.1, 0, 0.12], shnL: [0.22, 0, 0], thR: [-0.25, 0, -1.5], shnR: [0.06, 0, 0], ftR: [0.5, 0, 0], tailB: [0.6, 0, 0.5], sc1: [-0.5, -0.6, 0], y: -0.04 };
  P.attack = (i, t) => {
    const g = P.guard(0);
    if (i === 0) return clip([[0, g], [0.06, A1w], [0.13, A1s], [0.24, A1s], [0.42, g]], t);
    if (i === 1) return clip([[0, g], [0.07, A2w], [0.15, A2s], [0.27, A2s], [0.46, g]], t);
    return clip([[0, g], [0.12, A3w], [0.22, A3s], [0.38, A3s], [0.62, g]], t);
  };
  P.ATTACK = [{ dur: 0.4, hit: 0.12, chain: 0.2 }, { dur: 0.44, hit: 0.14, chain: 0.22 }, { dur: 0.62, hit: 0.2, chain: 0.5 }];
  P.roll = k => { const tuck = { hips: [k * Math.PI * 2, 0, 0], spine: [0.95, 0, 0], chest: [0.5, 0, 0], head: [0.5, 0, 0], shL: [-1.1, 0, 0.2], elL: [-2.0, 0, 0], shR: [-1.1, 0, -0.2], elR: [-2.0, 0, 0], thL: [-2.0, 0, 0.1], shnL: [2.2, 0, 0], thR: [-1.9, 0, -0.1], shnR: [2.2, 0, 0], tailB: [1.3, 0, 0], tailL: [1, 0, 0.5], tailR: [1, 0, -0.5], sc1: [-0.2, 0, 0], y: -0.52 }; return tuck; };
  P.dash = () => ({ spine: [0.75, 0, 0], chest: [0.2, 0, 0], head: [-0.75, 0, 0], shL: [1.1, 0, 0.35], elL: [-0.3, 0, 0], shR: [1.1, 0, -0.35], elR: [-0.3, 0, 0], thL: [-1.15, 0, 0], shnL: [1.2, 0, 0], thR: [0.75, 0, 0], shnR: [0.5, 0, 0], tailB: [1.4, 0, 0], tailL: [1.2, 0, 0.4], tailR: [1.2, 0, -0.4], sc1: [0.1, 0, 0], y: -0.3 });
  P.hurt = s => ({ spine: [-0.4, 0.3 * s, 0], chest: [-0.2, 0.3 * s, 0], head: [-0.45, 0, 0.2 * s], shL: [-0.5, 0, 1.0], elL: [-0.8, 0, 0], shR: [-0.5, 0, -1.0], elR: [-0.8, 0, 0], thL: [-0.35, 0, 0.1], shnL: [0.7, 0, 0], thR: [0.1, 0, -0.1], shnR: [0.5, 0, 0], sc1: [-0.6, 0, 0], y: -0.14 });
  P.down = () => ({ hips: [-1.5, 0, 0], spine: [0.05, 0, 0], head: [0.1, 0.5, 0], shL: [0.1, 0, 1.2], elL: [-0.5, 0, 0], shR: [-0.2, 0, -0.9], elR: [-0.9, 0, 0], thL: [-0.1, 0, 0.25], shnL: [0.1, 0, 0], thR: [-0.5, 0, -0.2], shnR: [0.9, 0, 0], tailB: [-0.2, 0, 0], sc1: [-0.2, 0.6, 0], y: -0.8 });
  P.sit = () => ({ hips: [-0.5, 0, 0], spine: [0.5, 0, 0], chest: [0.3, 0, 0], head: [0.3, 0, 0], shL: [0.5, 0, 0.3], elL: [-0.4, 0, 0], shR: [-0.6, 0, -0.2], elR: [-1.2, 0, 0], thL: [-1.1, 0, 0.2], shnL: [1.5, 0, 0], thR: [-0.9, 0, -0.2], shnR: [1.0, 0, 0], sc1: [-1.2, 0, 0], y: -0.72 });
  P.kneel = () => ({ spine: [0.42, 0, 0], chest: [0.15, 0, 0], head: [0.3, 0, 0], shL: [-1.15, 0, 0.1], elL: [-0.45, 0, 0], shR: [-0.2, 0, -0.2], elR: [-1.3, 0, 0], thL: [-1.5, 0, 0.1], shnL: [1.6, 0, 0], thR: [0.15, 0, -0.1], shnR: [1.6, 0, 0], ftR: [0.6, 0, 0], tailB: [0.9, 0, 0], tailL: [0.3, 0, 0.5], tailR: [0.7, 0, -0.3], sc1: [-1.2, 0, 0], y: -0.46 });
  P.stunned = t => ({ spine: [0.3 + Math.sin(t * 3) * 0.12, 0, Math.sin(t * 2.2) * 0.2], chest: [0.15, 0, 0], head: [0.4, Math.sin(t * 2.6) * 0.5, Math.sin(t * 3.1) * 0.3], shL: [0.05, 0, 0.2], elL: [-0.15, 0, 0], shR: [0.05, 0, -0.2], elR: [-0.15, 0, 0], thL: [-0.3, 0, 0.15], shnL: [0.7, 0, 0], thR: [-0.2, 0, -0.15], shnR: [0.6, 0, 0], y: -0.2 });
  P.bound = t => ({ spine: [-0.15 + Math.sin(t * 17) * 0.05, Math.sin(t * 13) * 0.08, 0], head: [-0.4, Math.sin(t * 9) * 0.3, 0], shL: [0.15, 0, -0.05], elL: [-0.1, 0, 0], shR: [0.15, 0, 0.05], elR: [-0.1, 0, 0], thL: [0, 0, 0.02], shnL: [0.1, 0, 0], thR: [0, 0, -0.02], shnR: [0.1, 0, 0], y: 0.06 + Math.sin(t * 15) * 0.01 });
  // enemy strikes
  const Sw = { hips: [0, -0.4, 0], spine: [-0.1, -0.3, 0], chest: [-0.1, -0.4, 0], head: [0.1, 0.6, 0], shR: [-2.7, 0, -0.4], elR: [-1.0, 0, 0], shL: [-0.9, 0, 0.3], elL: [-1.0, 0, 0], thL: [-0.4, 0, 0.1], shnL: [0.5, 0, 0], thR: [0.3, 0, -0.1], shnR: [0.4, 0, 0], y: -0.08 };
  const Ss = { hips: [0, 0.5, 0], spine: [0.55, 0.3, 0], chest: [0.2, 0.4, 0], head: [-0.4, -0.7, 0], shR: [-0.75, 0, 0.35], elR: [-0.15, 0, 0], shL: [0.5, 0, 0.4], elL: [-0.8, 0, 0], thL: [-0.8, 0, 0.1], shnL: [0.9, 0, 0], thR: [0.5, 0, -0.1], shnR: [0.3, 0, 0], y: -0.2 };
  P.swing = k => k < 0 ? mix(P.lurk(0), Sw, SC.smooth(SC.clamp(1 + k, 0, 1))) : mix(Sw, Ss, SC.smooth(SC.clamp(k * 5, 0, 1)));
  const Lw = { spine: [0.6, -0.3, 0], chest: [0.2, -0.3, 0], head: [-0.5, 0.5, 0], shR: [0.6, 0, -0.3], elR: [-1.6, 0, 0], shL: [-0.8, 0, 0.3], elL: [-1.0, 0, 0], thL: [-0.9, 0, 0.1], shnL: [1.3, 0, 0], thR: [-0.3, 0, -0.1], shnR: [1.2, 0, 0], y: -0.38 };
  const Ls = { spine: [0.5, 0.3, 0], chest: [0.1, 0.4, 0], head: [-0.5, -0.6, 0], shR: [-1.55, 0, 0.1], elR: [-0.05, 0, 0], shL: [0.9, 0, 0.3], elL: [-0.4, 0, 0], thL: [-1.0, 0, 0], shnL: [0.9, 0, 0], thR: [0.8, 0, 0], shnR: [0.2, 0, 0], y: -0.3 };
  P.lunge = k => k < 0 ? mix(P.lurk(0), Lw, SC.smooth(SC.clamp(1 + k, 0, 1))) : mix(Lw, Ls, SC.smooth(SC.clamp(k * 6, 0, 1)));
  const Ow = { spine: [-0.35, 0, 0], chest: [-0.2, 0, 0], head: [0.3, 0, 0], shR: [-2.9, 0, -0.15], elR: [-0.5, 0, 0], shL: [-2.9, 0, 0.15], elL: [-0.5, 0, 0], thL: [-0.3, 0, 0.15], shnL: [0.4, 0, 0], thR: [0.2, 0, -0.15], shnR: [0.3, 0, 0], y: 0.02 };
  const Os = { spine: [0.85, 0, 0], chest: [0.3, 0, 0], head: [-0.6, 0, 0], shR: [-0.9, 0, 0.1], elR: [-0.1, 0, 0], shL: [-0.9, 0, -0.1], elL: [-0.1, 0, 0], thL: [-0.9, 0, 0.2], shnL: [1.1, 0, 0], thR: [-0.2, 0, -0.2], shnR: [0.9, 0, 0], y: -0.34 };
  P.slam = k => k < 0 ? mix(P.lurk(0), Ow, SC.smooth(SC.clamp(1 + k, 0, 1))) : mix(Ow, Os, SC.smooth(SC.clamp(k * 6, 0, 1)));
  // powers
  P.leap = { spine: [-0.2, 0, 0], chest: [-0.2, 0, 0], head: [0.2, 0, 0], shL: [-2.9, 0, 0.3], elL: [-0.5, 0, 0], shR: [-2.8, 0, -0.3], elR: [-0.7, 0, 0], thL: [-1.0, 0, 0.15], shnL: [1.6, 0, 0], thR: [-0.2, 0, -0.1], shnR: [1.3, 0, 0], tailB: [-0.4, 0, 0], tailL: [-0.2, 0, 0.5], tailR: [-0.2, 0, -0.5], sc1: [0.6, 0, 0], y: 0.1 };
  P.slamDown = { spine: [0.8, 0, 0], chest: [0.3, 0, 0], head: [-0.3, 0, 0], shL: [-0.7, 0, 0.1], elL: [-0.15, 0, 0], shR: [0.6, 0, -0.7], elR: [-0.6, 0, 0], thL: [-1.5, 0, 0.2], shnL: [1.7, 0, 0], thR: [0.1, 0, -0.15], shnR: [1.6, 0, 0], ftR: [0.6, 0, 0], tailB: [1.1, 0, 0], tailL: [0.6, 0, 0.7], tailR: [0.6, 0, -0.7], sc1: [0.3, 0, 0], y: -0.5 };
  P.cloak = { spine: [0.5, 0, 0], chest: [0.25, 0.3, 0], head: [0.4, 0, 0], shL: [-0.9, 0, -0.7], elL: [-1.7, 0, 0], shR: [-0.9, 0, 0.7], elR: [-1.7, 0, 0], thL: [-0.7, 0, 0.1], shnL: [1.2, 0, 0], thR: [-0.5, 0, -0.1], shnR: [1.1, 0, 0], y: -0.4 };
  P.riseSlash = { hips: [0, -0.6, 0], spine: [-0.1, -0.3, 0], chest: [-0.1, -0.4, 0], head: [0.1, 1.0, 0], shL: [-2.7, -0.4, 0.5], elL: [-0.15, 0, 0], shR: [0.5, 0, -0.5], elR: [-1.2, 0, 0], thL: [-0.6, 0, 0.1], shnL: [0.6, 0, 0], thR: [0.5, 0, -0.1], shnR: [0.3, 0, 0], tailB: [0.4, 0, 0], sc1: [-0.3, 0.5, 0], y: -0.08 };
  P.castWind = { hips: [0, 0.7, 0], spine: [0.05, 0.3, 0], chest: [0, 0.4, 0], head: [0, -1.0, 0], shL: [0.7, 0, 0.5], elL: [-1.5, 0, 0], shR: [-1.2, 0, 0.2], elR: [-0.6, 0, 0], thL: [0.3, 0, 0.15], shnL: [0.4, 0, 0], thR: [-0.5, 0, -0.15], shnR: [0.6, 0, 0], y: -0.14 };
  P.castThrow = { hips: [0, -0.5, 0], spine: [0.25, -0.2, 0], chest: [0.1, -0.3, 0], head: [-0.1, 0.8, 0], shL: [-1.55, -0.35, 0.1], elL: [-0.05, 0, 0], shR: [-1.1, 0, 0.55], elR: [-1.1, 0, 0], thL: [-0.7, 0, 0.15], shnL: [0.8, 0, 0], thR: [0.55, 0, -0.15], shnR: [0.3, 0, 0], tailB: [0.6, 0, 0], sc1: [-0.4, 0, 0], y: -0.18 };
  P.castYank = { hips: [0, 0.4, 0], spine: [-0.25, 0.2, 0], chest: [-0.1, 0.2, 0], head: [0.2, -0.5, 0], shL: [0.5, 0, 0.5], elL: [-2.2, 0, 0], shR: [0.2, 0, -0.5], elR: [-1.8, 0, 0], thL: [0.4, 0, 0.15], shnL: [0.3, 0, 0], thR: [-0.6, 0, -0.15], shnR: [0.9, 0, 0], sc1: [-1.0, 0, 0], y: -0.16 };
  P.uppercutW = { hips: [0, 0.5, 0], spine: [0.6, 0.2, 0], chest: [0.2, 0.3, 0], head: [-0.4, -0.7, 0], shL: [0.9, 0, 0.3], elL: [-1.6, 0, 0], shR: [-0.6, 0, -0.3], elR: [-1.8, 0, 0], thL: [-0.9, 0, 0.15], shnL: [1.4, 0, 0], thR: [-0.4, 0, -0.15], shnR: [1.3, 0, 0], y: -0.42 };
  P.uppercut = { hips: [0, -0.5, 0], spine: [-0.3, -0.2, 0], chest: [-0.2, -0.3, 0], head: [0.4, 0.7, 0], shL: [-2.95, 0, 0.1], elL: [-0.25, 0, 0], shR: [0.6, 0, -0.5], elR: [-1.4, 0, 0], thL: [-0.2, 0, 0.1], shnL: [0.15, 0, 0], thR: [-0.9, 0, -0.1], shnR: [1.5, 0, 0], tailB: [-0.3, 0, 0], sc1: [0.5, 0, 0], y: 0.12 };
  P.present = { spine: [-0.05, 0, 0], chest: [-0.05, 0, 0], head: [0.15, 0.2, 0], shL: [-1.35, 0, 0.3], elL: [-1.2, 0, 0], shR: [0.1, 0, -0.2], elR: [-0.3, 0, 0], thL: [-0.05, 0, 0.1], shnL: [0.08, 0, 0], thR: [0.05, 0, -0.1], shnR: [0.06, 0, 0], sc1: [-1.1, 0, 0], sc2: [-0.2, 0, 0], y: 0 };
  P.clerk = t => ({ spine: [0.04, 0, 0], head: [0.1 + Math.sin(t * 0.8) * 0.04, Math.sin(t * 0.6) * 0.1, 0], shL: [-0.75, 0, 0.1], elL: [-1.5, 0, 0], shR: [-0.2, 0, -0.1], elR: [-1.7, 0, 0.3], thL: [0, 0, 0.03], thR: [0, 0, -0.03], y: Math.sin(t * 1.4) * 0.03 + 0.06 });

  /* A studio shot of one character, used for the speaker pictures in dialogue. */
  SC.portrait = function (kind, expr, bg, glow) {
    const scene = new THREE.Scene(); scene.background = new THREE.Color(bg);
    scene.add(new THREE.AmbientLight(new THREE.Color(0.27, 0.3, 0.5), Math.PI));
    const d = new THREE.DirectionalLight(new THREE.Color(0.8, 0.76, 0.56), Math.PI); d.position.set(2, 2.2, 3); scene.add(d);
    const m = SC.makeHumanoid(kind); if (glow) m.setGlow(glow[0], glow[1]); m.face(expr || 'neutral');
    m.anim.apply(kind === 'clerk' ? P.clerk(0) : (kind === 'hero' ? P.idle(0) : P.lurk(1)), 999, 0.016);
    m.group.rotation.y = -0.35; scene.add(m.group);
    const hy = 1.62 * m.spec.h, cam = new THREE.PerspectiveCamera(24, 1, 0.1, 20);
    cam.position.set(0.25, hy + 0.05, 1.9 * m.spec.h); cam.lookAt(0, hy - 0.02, 0);
    const r = G.renderer, src = r.domElement, old = new THREE.Vector2(); r.getSize(old); const pr = r.getPixelRatio();
    r.setPixelRatio(1); r.setSize(192, 192, false); r.render(scene, cam);
    const c = document.createElement('canvas'); c.width = c.height = 192; c.getContext('2d').drawImage(src, 0, 0);
    r.setPixelRatio(pr); r.setSize(old.x, old.y, false);
    return c.toDataURL('image/png');
  };
})();
