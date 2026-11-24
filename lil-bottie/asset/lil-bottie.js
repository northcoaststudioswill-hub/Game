/* lil Bottie — the 3D asset, in the Grok Fable Astra style (blocky, low-poly, flat shaded).
   Standalone: needs only three.js (r128). Not wired into any game yet.

   const b = LilBottie.build(THREE);      // b.group is a THREE.Group, about 1.5 units tall (feet at y=0)
   scene.add(b.group); b.group.scale.setScalar(2.2);   // 2.2 is the size the game uses for people
   b.setFace('smug');                     // a preset (smile, angry, sad, shock, love, money, smug …) or an icon (npc, heart, bars, crown …)
   b.setExpression('angry', 'grin');      // eyes and mouth separately
   b.setIcon('npc');                      // fill the screen with an icon; setExpression clears it
   b.setMouth(0..1);                      // lip sync on top of the expression: 0 resting mouth, 1 wide open
   b.setPose('idle');                     // idle, walk, dance, rap, shake, point, thumbs, arms, chain, wave, sit
   b.update(time, dt, songSeconds);       // call every frame; songSeconds (optional) locks the moves to the beat

   Look, from the visual lock: chrome helmet with a blue LED smiley screen, long black braids,
   silver puffer jacket over a black hoodie, iced clover chain, chrome hands, iced watch. */
(function (root) {
  'use strict';
  function build(THREE, opts) {
    opts = opts || {};
    var TAU = Math.PI * 2;
    // ---- a small merge helper (flat colours per part, one draw call per material)
    function bake(parts) {
      var pos = [], col = [], nor = [];
      parts.forEach(function (p) {
        var g = p.g.index ? p.g.toNonIndexed() : p.g.clone(); g.applyMatrix4(p.m); g.computeVertexNormals();
        var a = g.attributes.position.array, n = g.attributes.normal.array, c = new THREE.Color(p.c);
        for (var i = 0; i < a.length; i += 3) { pos.push(a[i], a[i + 1], a[i + 2]); nor.push(n[i], n[i + 1], n[i + 2]); col.push(c.r, c.g, c.b); }
      });
      var out = new THREE.BufferGeometry();
      out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
      out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      return out;
    }
    function M(x, y, z, rx, ry, rz, sx, sy, sz) {
      sx = sx === undefined ? 1 : sx; sy = sy === undefined ? sx : sy; sz = sz === undefined ? sx : sz;
      return new THREE.Matrix4().compose(new THREE.Vector3(x || 0, y || 0, z || 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0)), new THREE.Vector3(sx, sy, sz));
    }
    var P = function (g, c, m) { return { g: g, c: c, m: m || new THREE.Matrix4() }; };
    var Box = function (w, h, d) { return new THREE.BoxGeometry(w, h, d); };
    var Cyl = function (a, b, h, s) { return new THREE.CylinderGeometry(a, b, h, s || 10); };
    var Sph = function (r, a, b) { return new THREE.SphereGeometry(r, a || 10, b || 7); };

    // ---- a made-up night street for the chrome to reflect: dark sky, a blue screen glow, two street lamps
    function envFace(top, mid, bot, lamps) {
      var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 64);
      gr.addColorStop(0, top); gr.addColorStop(.55, mid); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      if (lamps) { g.fillStyle = 'rgba(255,255,255,.95)'; g.fillRect(10, 8, 7, 22); g.fillRect(44, 14, 5, 14); g.fillStyle = 'rgba(120,170,255,.8)'; g.fillRect(26, 34, 14, 6); g.fillStyle = 'rgba(255,190,120,.7)'; g.fillRect(52, 40, 6, 5); }
      return c;
    }
    var env = new THREE.CubeTexture([envFace('#dfe6f2', '#8a93a6', '#1a1c24', 1), envFace('#c8d0e0', '#6a7386', '#14161c', 1), envFace('#ffffff', '#e8eef8', '#b8c2d6', 1), envFace('#16181e', '#0e1014', '#08090c', 0), envFace('#dfe6f2', '#9aa3b6', '#1a1c24', 1), envFace('#aab4c8', '#5a6376', '#101218', 0)]);
    env.needsUpdate = true;
    var chromeM = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 1, roughness: .2, envMap: env, envMapIntensity: 1.25, flatShading: true });
    var pufferM = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: .95, roughness: .3, envMap: env, envMapIntensity: 1.5, emissive: 0x1c1e24, flatShading: true, side: THREE.DoubleSide });
    var clothM = new THREE.MeshLambertMaterial({ vertexColors: true });
    var iceM = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: .9, roughness: .12, envMap: env, envMapIntensity: 1.6, emissive: 0x0c0d10, flatShading: true });

    var SILVER = 0xf0f3f8, SILVER2 = 0xcfd4de, CHROME = 0xc8ccd4, CHROME2 = 0x9aa0ac, BLACK = 0x0c0c10, BLACK2 = 0x17171d, ICE = 0xffffff;
    var group = new THREE.Group(), body = new THREE.Group(); group.add(body);

    // ---- legs: hip, knee and ankle joints. Baggy black pants with a kneecap you can see, stacked cuffs, black and chrome sneakers.
    var PANT = 0x101016, PANT2 = 0x24242e, KNEE = 0x30303c;
    var legs = [];
    [-1, 1].forEach(function (s) {
      var hip = new THREE.Group(); hip.position.set(s * .13, .56, 0); body.add(hip);
      hip.add(new THREE.Mesh(bake([P(Cyl(.125, .11, .27, 8), PANT, M(0, -.135, 0, 0, 0, 0, 1, 1, 1.1)), P(Box(.012, .27, .03), PANT2, M(s * .117, -.135, 0)), P(Box(.09, .07, .02), PANT2, M(s * .03, -.08, .128))]), clothM));   // thigh, side seam, pocket
      var knee = new THREE.Group(); knee.position.y = -.27; hip.add(knee);
      knee.add(new THREE.Mesh(bake([P(Sph(.11, 8, 6), PANT, M(0, 0, 0, 0, 0, 0, 1, .8, 1.1)), P(Sph(.075, 8, 6), KNEE, M(0, -.005, .075, 0, 0, 0, 1.1, .9, .55)), P(Box(.15, .012, .02), PANT2, M(0, .045, .1)), P(Box(.15, .012, .02), PANT2, M(0, -.055, .1)),
        P(Cyl(.106, .098, .2, 8), PANT, M(0, -.11, 0, 0, 0, 0, 1, 1, 1.08)), P(Cyl(.11, .116, .035, 8), PANT2, M(0, -.195, 0, 0, 0, 0, 1, 1, 1.1)), P(Cyl(.116, .11, .035, 8), PANT, M(0, -.225, 0, 0, 0, 0, 1, 1, 1.1)), P(Box(.012, .2, .03), PANT2, M(s * .102, -.11, 0))]), clothM));   // kneecap, creases, shin, stacked cuffs
      var foot = new THREE.Group(); foot.position.y = -.24; knee.add(foot);
      foot.add(new THREE.Mesh(bake([P(Box(.2, .085, .26), 0x16161c, M(0, -.02, .02)), P(Box(.2, .07, .1), 0x2a2a34, M(0, -.03, .18)), P(Box(.15, .05, .09), 0x16161c, M(0, .03, .07, -.5)), P(Box(.19, .04, .05), 0x2a2a34, M(0, .0, -.12))]), clothM));
      foot.add(new THREE.Mesh(bake([P(Box(.215, .032, .36), 0xdfe4ee, M(0, -.072, .05)), P(Box(.05, .05, .012), CHROME, M(0, .0, -.148)), P(Box(.1, .012, .012), 0xdfe4ee, M(0, .035, .1)), P(Box(.1, .012, .012), 0xdfe4ee, M(0, .05, .075)), P(Box(.012, .03, .12), CHROME2, M(s * .102, -.02, .03))]), chromeM));   // sole, heel tab, laces, side stripe
      legs.push({ hip: hip, knee: knee, foot: foot, s: s });
    });

    // ---- torso: black hoodie core, silver puffer over it, open down the front
    var torso = new THREE.Group(); torso.position.y = .54; body.add(torso);
    var T = [P(Cyl(.2, .25, .5, 10), BLACK, M(0, .25, 0)), P(Box(.3, .1, .1), BLACK2, M(0, .14, .22))];   // hoodie + pouch pocket
    T.push(P(Cyl(.02, .02, .2, 5), BLACK2, M(-.06, .38, .23)), P(Cyl(.02, .02, .16, 5), BLACK2, M(.06, .4, .23)));   // hood strings
    T.push(P(Sph(.2, 10, 7), BLACK, M(0, .6, -.13, 0, 0, 0, 1.15, .55, .8)), P(Sph(.13, 8, 6), BLACK2, M(0, .57, -.24, 0, 0, 0, 1.2, .7, .7)), P(Cyl(.15, .2, .08, 10), BLACK2, M(0, .56, .0)));   // the hood, bunched behind the neck
    torso.add(new THREE.Mesh(bake(T), clothM));
    var J = [];   // puffer: four quilted rolls that bulge, open down the front
    var GAP = .62, roll = function (r0, r1, h) { var g = new THREE.CylinderGeometry(r1, r0, h, 14, 1, true, GAP / 2, TAU - GAP); return g; };
    J.push(P(roll(.3, .3, .5), 0xaeb4c0, M(0, .27, 0, 0, 0, 0, 1, 1, .88)));   // a liner, so the seams between rolls are silver, not gaps
    for (var r = 0; r < 4; r++) {
      var y = .075 + r * .128, fat = r === 3 ? .315 : r === 0 ? .33 : .345, thin = fat - .014;
      J.push(P(roll(thin, fat, .064), r % 2 ? SILVER : SILVER2, M(0, y - .032, 0, 0, 0, 0, 1, 1, .88)), P(roll(fat, thin, .064), r % 2 ? SILVER2 : SILVER, M(0, y + .032, 0, 0, 0, 0, 1, 1, .88)));
      [-1, 1].forEach(function (s) { J.push(P(Box(.05, .124, .06), SILVER, M(s * .105, y, fat * .88 - .045, 0, s * -.5, 0))); });   // the rolled front edges
    }
    for (var k2 = 0; k2 < 10; k2++) { var a2 = (k2 + .5) / 10 * TAU; if (Math.abs(Math.sin(a2)) < .3 && Math.cos(a2) > 0) continue; J.push(P(Box(.13, .1, .07), SILVER, M(Math.sin(a2) * .2, .56, Math.cos(a2) * .19, .25 * Math.cos(a2), a2, 0))); }   // stand-up collar
    [-1, 1].forEach(function (s) { J.push(P(Box(.018, .46, .02), CHROME2, M(s * .085, .3, .285)), P(Box(.04, .05, .03), CHROME, M(s * .085, .07, .29))); });   // zip
    J.push(P(roll(.3, .31, .04), 0x9aa0ac, M(0, .0, 0, 0, 0, 0, 1, 1, .88)));   // the elastic hem
    [-1, 1].forEach(function (s) { J.push(P(Box(.012, .11, .014), CHROME2, M(s * .27, .19, .2, 0, s * .9, s * .35))); });   // pocket zips
    var jacket = new THREE.Mesh(bake(J), pufferM); jacket.scale.set(.9, 1, .9); torso.add(jacket);

    // ---- arms: shoulder, elbow, wrist; four fingers with two joints each, and a thumb
    var fA = bake([P(Box(.026, .055, .03), CHROME, M(0, -.0275, 0)), P(Box(.031, .013, .035), 0x4a4e58, M(0, -.003, 0))]);
    var fB = bake([P(Box(.023, .048, .027), CHROME2, M(0, -.024, 0)), P(Box(.028, .011, .032), 0x4a4e58, M(0, -.003, 0)), P(Box(.017, .012, .02), 0xeef2f8, M(0, -.05, .002))]);
    var tA = bake([P(Box(.033, .05, .035), CHROME, M(0, -.025, 0)), P(Box(.037, .013, .039), 0x4a4e58, M(0, -.003, 0))]);
    var tB = bake([P(Box(.028, .044, .03), CHROME2, M(0, -.022, 0)), P(Box(.032, .011, .034), 0x4a4e58, M(0, -.003, 0))]);
    var arms = [], phoneCv = null, phoneTx = null, phoneT = 0;
    [-1, 1].forEach(function (s) {
      var sh = new THREE.Group(); sh.position.set(s * .335, .5, 0); torso.add(sh);
      var up = [P(Sph(.125, 8, 6), SILVER, M(0, -.01, 0)), P(Cyl(.115, .11, .12, 8), SILVER2, M(0, -.11, 0)), P(Cyl(.11, .105, .11, 8), SILVER, M(0, -.225, 0))];
      var upM = new THREE.Mesh(bake(up), pufferM); upM.scale.set(.86, 1, .86); sh.add(upM);
      var el = new THREE.Group(); el.position.y = -.29; sh.add(el);
      var loM = new THREE.Mesh(bake([P(Sph(.1, 8, 6), SILVER2, M(0, 0, 0)), P(Cyl(.105, .1, .11, 8), SILVER2, M(0, -.06, 0)), P(Cyl(.1, .09, .11, 8), SILVER, M(0, -.165, 0))]), pufferM); loM.scale.set(.88, 1, .88); el.add(loM);
      el.add(new THREE.Mesh(bake([P(Cyl(.075, .07, .06, 8), BLACK, M(0, -.245, 0))]), clothM));
      if (s < 0) el.add(new THREE.Mesh(bake([P(Cyl(.079, .079, .038, 12), 0xdfe4ee, M(0, -.262, 0)), P(Cyl(.05, .05, .02, 12), ICE, M(0, -.262, -.074, Math.PI / 2)), P(Cyl(.036, .036, .024, 10), 0xcfc6ae, M(0, -.262, -.077, Math.PI / 2)), P(Box(.004, .03, .006), 0x1a1a1a, M(0, -.254, -.091)), P(Box(.02, .004, .006), 0x1a1a1a, M(.008, -.262, -.091))]), iceM));   // the iced watch, on the back of his right wrist
      var hg = new THREE.Group(); hg.position.y = -.28; el.add(hg);   // the wrist
      hg.add(new THREE.Mesh(bake([P(Cyl(.05, .055, .03, 8), 0x4a4e58, M(0, -.012, 0)), P(Box(.122, .1, .06), CHROME, M(0, -.075, 0)), P(Box(.09, .06, .012), CHROME2, M(0, -.07, -.034)), P(Box(.1, .014, .05), 0x4a4e58, M(0, -.122, 0))]), chromeM));
      var fingers = [];
      for (var f = 0; f < 4; f++) {   // 0 index … 3 pinky; the index sits on the thumb side
        var g1 = new THREE.Group(); g1.position.set(s * (.045 - f * .03), -.127, 0); hg.add(g1); g1.add(new THREE.Mesh(fA, chromeM)); if (f === 3) g1.scale.setScalar(.88);
        var g2 = new THREE.Group(); g2.position.y = -.055; g1.add(g2); g2.add(new THREE.Mesh(fB, chromeM));
        fingers.push({ a: g1, b: g2, f: f });
      }
      var th = new THREE.Group(); th.position.set(s * .058, -.05, .012); th.scale.setScalar(1.25); hg.add(th); th.add(new THREE.Mesh(tA, chromeM));
      var th2 = new THREE.Group(); th2.position.y = -.05; th.add(th2); th2.add(new THREE.Mesh(tB, chromeM));
      var phone = null;
      if (s > 0) { phone = new THREE.Group(); phone.position.set(0, -.12, .055); phone.scale.setScalar(1.25); phone.visible = false; hg.add(phone);   // his phone, in his left hand, screen on the palm side
        phone.add(new THREE.Mesh(bake([P(Box(.118, .225, .016), 0x0c0c10, M(0, 0, 0)), P(Box(.03, .03, .004), CHROME2, M(-.03, .08, -.01))]), chromeM));
        phoneCv = document.createElement('canvas'); phoneCv.width = 64; phoneCv.height = 128; phoneTx = new THREE.CanvasTexture(phoneCv); phoneTx.magFilter = THREE.NearestFilter;
        var ps = new THREE.Mesh(new THREE.PlaneGeometry(.106, .21), new THREE.MeshBasicMaterial({ map: phoneTx, fog: false })); ps.position.z = .0086; phone.add(ps); }
      el.rotation.order = 'YXZ';
      arms.push({ sh: sh, el: el, hand: hg, fingers: fingers, thumb: th, thumb2: th2, phone: phone, s: s });
    });

    // ---- neck: ribbed chrome
    var N = []; for (var i = 0; i < 4; i++) N.push(P(Cyl(.085 - (i % 2) * .012, .085 - (i % 2) * .012, .034, 10), i % 2 ? CHROME2 : CHROME, M(0, .585 + i * .034, 0)));
    torso.add(new THREE.Mesh(bake(N), chromeM));

    // ---- head: riveted chrome dome, ear cups, a black screen with the LED face
    var head = new THREE.Group(); head.position.y = .725; head.scale.setScalar(.9); torso.add(head);
    var Hh = [P(new THREE.SphereGeometry(.3, 12, 8, 0, TAU, 0, Math.PI * .62), CHROME, M(0, .2, 0)), P(new THREE.CylinderGeometry(.31, .302, .04, 14, 1, false, .95, TAU - 1.9), CHROME2, M(0, .11, 0)), P(Cyl(.16, .13, .1, 10), 0x4a4e58, M(0, -.02, 0))];   // the dome ends in a rolled rim; the hair comes out from under it
    var hseed = 11; function hrand() { hseed = (hseed * 16807) % 2147483647; return hseed / 2147483647; }
    for (var q = 0; q < 90; q++) {   // hammered chrome: small dark dimples pressed into the shell, uneven like the real one
      var el2 = .12 + hrand() * 1.55, ra = (hrand() - .5) * 3.3, dx = Math.sin(ra) * Math.sin(el2), dy = Math.cos(el2), dz = Math.cos(ra) * Math.sin(el2); if (dz < -.05 || (dz > .52 && dy < .5)) continue;
      var dsz = .012 + hrand() * .014; Hh.push(P(Sph(dsz, 6, 4), hrand() < .5 ? 0x2a2e36 : 0x3c414c, M(dx * .297, .2 + dy * .297, dz * .297, Math.atan2(Math.hypot(dx, dz), dy) * (dz >= 0 ? 1 : -1) * Math.abs(Math.cos(ra)), ra, 0, 1, .22, 1))); }
    [-1, 1].forEach(function (s) { Hh.push(P(Cyl(.085, .085, .06, 12), CHROME2, M(s * .29, .16, 0, 0, 0, Math.PI / 2)), P(Cyl(.05, .05, .07, 10), 0x4a4e58, M(s * .3, .16, 0, 0, 0, Math.PI / 2))); });
    Hh.push(P(Box(.46, .34, .09), CHROME2, M(0, .17, .262)), P(Box(.41, .29, .07), 0x050508, M(0, .17, .284)));   // bezel and glass, set forward so the dome and rim stay behind the glass
    Hh.push(P(Box(.48, .035, .09), CHROME, M(0, .357, .272, .25)), P(Box(.3, .07, .1), CHROME2, M(0, -.035, .2)), P(Box(.22, .03, .11), 0x4a4e58, M(0, -.035, .205)), P(Box(.02, .3, .02), 0x7a808c, M(0, .36, 0, 0, 0, 0, 1, 1, 14)));   // brow ridge, jaw, vent, centre seam
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) { Hh.push(P(Cyl(.013, .013, .006, 6), 0x2a2e36, M(c[0] * .215, .17 + c[1] * .155, .308, Math.PI / 2))); });   // bezel screws, sunk flush
    [-1, 1].forEach(function (s) { Hh.push(P(Cyl(.03, .03, .08, 8), CHROME, M(s * .31, .16, 0, 0, 0, Math.PI / 2)), P(Box(.02, .1, .02), CHROME2, M(s * .27, .3, .02, 0, 0, s * -.5))); });   // ear cup hub and band
    head.add(new THREE.Mesh(bake(Hh), chromeM));
    var faceCv = document.createElement('canvas'); faceCv.width = 160; faceCv.height = 112;
    var faceTx = new THREE.CanvasTexture(faceCv); faceTx.magFilter = THREE.LinearFilter;
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(.39, .273), new THREE.MeshBasicMaterial({ map: faceTx, fog: false }));
    screen.position.set(0, .17, .3205); head.add(screen);

    // ---- dreads: each one is a chain of five points joined by four segments. The points are simulated (they have
    //      weight and momentum) and are pushed out of the head, jacket, hood, shoulders and arms, so they drape
    //      over him and cannot pass through him.
    var hairM = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
    // the helmet is a front shell. Behind a hairline over the crown, the back of his head is hair: a dark cap, with the dreads rooted all over it
    head.add(new THREE.Mesh(bake([P(new THREE.SphereGeometry(.316, 16, 12, Math.PI, Math.PI), 0x0c0c10, M(0, .2, .012, -.2)), P(Sph(.2, 10, 7), 0x0c0c10, M(0, .0, -.12, 0, 0, 0, 1.2, .8, .9)),
      P(new THREE.CircleGeometry(.29, 16), 0x0a0a0e, M(0, .09, 0, Math.PI / 2))]), hairM));
    var dreadGeo = bake([P(Cyl(.024, .022, .09, 5), 0x101014, M(0, -.045, 0)), P(Cyl(.022, .023, .08, 5), 0x1a1a22, M(0, -.13, 0)), P(Cyl(.026, .026, .014, 5), 0x2a2a36, M(0, -.088, 0))]);   // one segment, .17 long
    var tipGeo = bake([P(Sph(.024, 5, 4), 0x30303c, M(0, -.012, 0))]);
    var dreadLayer = new THREE.Group(); group.add(dreadLayer);
    var dreads = [], dseed = 7, DOWN = new THREE.Vector3(0, -1, 0);
    function drand() { dseed = (dseed * 16807) % 2147483647; return dseed / 2147483647; }
    function dread(root, len, nseg, bx, bz) {
      var D = { root: root, segL: len / nseg, np: nseg + 1, th: .95 + drand() * .4, pts: [], prev: [], mesh: [], drag: .06 + drand() * .08, n: dreads.length, rp: new THREE.Vector3(), rn: new THREE.Vector3(), bx: bx, bz: bz };
      // its combed path: down over the head along the surface, then straight down. The part lying on the head is held to this path; the rest hangs free.
      var cx = 0, cy = .2, cz = .012, R = .322, ux = root.x - cx, uy = root.y - cy, uz = root.z - cz, hx = ux + bx * .16, hz = uz + bz * .16, hl = Math.hypot(hx, hz) || 1; hx /= hl; hz /= hl;
      var th0 = Math.acos(Math.max(-1, Math.min(1, uy / .318))), off = 0; D.rest = []; D.pin = 0;
      for (var i = 0; i <= nseg; i++) { D.pts.push(new THREE.Vector3()); D.prev.push(new THREE.Vector3()); var thI = th0 + i * D.segL / R;
        if (thI < 1.7) { D.rest.push(new THREE.Vector3(cx + Math.sin(thI) * hx * R, cy + Math.cos(thI) * R, cz + Math.sin(thI) * hz * R)); D.pin = i; }
        else { var lp = D.rest[i - 1] || root; D.rest.push(new THREE.Vector3(lp.x + hx * .02, lp.y - D.segL, lp.z + hz * .02)); } }
      D.rest[0].copy(root); D.pin = Math.min(D.pin, nseg - 2);
      for (var j = 0; j < nseg; j++) { var m = new THREE.Mesh(dreadGeo, clothM); dreadLayer.add(m); D.mesh.push(m); }
      D.tip = new THREE.Mesh(tipGeo, clothM); D.tip.scale.setScalar(D.th); dreadLayer.add(D.tip); dreads.push(D);
    }
    // rows run over the top of the head from ear to ear, like lines of longitude: the first is the hairline just behind the front of the helmet, the last is low at the back
    [[.22, 11, 1.12, .3], [.6, 11, 1.06, -.1], [.98, 9, .95, -.5], [1.32, 7, .8, -.8]].forEach(function (row, ri) {
      for (var k = 0; k < row[1]; k++) { var th = (k / (row[1] - 1) - .5) * 2 * 1.32 + (drand() - .5) * .08, ph = row[0] + (drand() - .5) * .08, x = Math.sin(th), y = Math.cos(th) * Math.cos(ph), z = -Math.cos(th) * Math.sin(ph);
        var len = row[2] - Math.abs(th) * .2 + ((k * 7) % 5) * .03, side = Math.abs(th) < .12 ? (k % 2 ? .5 : -.5) : Math.sign(th);
        dread(new THREE.Vector3(x * .318, .2 + y * .318, .012 + z * .318), len, len > .88 ? 6 : 5, side * (ri === 0 ? .9 : .6), row[3]); } });

    // ---- the chain and the iced clover
    var C = []; for (var c = 0; c < 15; c++) { var u = c / 14, ca = (u - .5) * 2.2, cx = Math.sin(ca) * .17, cy = .55 - Math.cos(ca) * .13 - Math.pow(1 - Math.abs(u - .5) * 2, 1.4) * .14, cz = .2 + Math.cos(ca) * .1; C.push(P(Sph(.015, 6, 4), c % 2 ? ICE : 0xc8ced8, M(cx, cy, cz, 0, 0, 0, 1.2, .7, 1))); }
    torso.add(new THREE.Mesh(bake(C), iceM));
    var pendant = new THREE.Group(); pendant.position.set(0, .29, .315); torso.add(pendant);
    var K = [P(Cyl(.014, .014, .05, 6), 0xc8ced8, M(0, .0, 0))], LOB = [[0, -.07], [-.066, -.136], [.066, -.136], [0, -.202]];
    LOB.forEach(function (o) { K.push(P(Cyl(.066, .066, .018, 12), 0x8a909c, M(o[0], o[1], -.004, Math.PI / 2)), P(Cyl(.056, .05, .022, 12), ICE, M(o[0], o[1], .012, Math.PI / 2))); });
    K.push(P(Cyl(.03, .026, .03, 8), 0xe8ecf4, M(0, -.136, .018, Math.PI / 2)));
    LOB.forEach(function (o, n) { for (var d = 0; d < 6; d++) { var da = d / 6 * TAU + n; K.push(P(Sph(.011, 4, 3), d % 2 ? 0xffffff : 0xb8c0d0, M(o[0] + Math.sin(da) * .03, o[1] + Math.cos(da) * .03, .026))); } });
    pendant.add(new THREE.Mesh(bake(K), iceM));

    // ---- the LED face: a 20 x 14 dot matrix. Eyes and mouth are separate, so he can hold an expression and
    //      lip-sync at the same time. An icon takes the whole screen until it is cleared.
    var EYES = {   // each is the left eye, 6 dots wide; the right eye is its mirror unless r is given
      happy: { l: ['..##..', '.#..#.', '#....#'] }, open: { l: ['.####.', '#.##.#', '#.##.#', '.####.'] }, wide: { l: ['.####.', '#....#', '#.##.#', '#....#', '.####.'] },
      angry: { l: ['##....', '..##..', '....##', '..##..', '..##..'] }, sad: { l: ['....##', '..##..', '##....', '..##..', '..##..'] },
      side: { l: ['.####.', '#...##', '#...##', '.####.'], r: ['.####.', '#...##', '#...##', '.####.'] }, sleepy: { l: ['......', '######', '.####.'] }, closed: { l: ['######'] },
      heart: { l: ['.#.#..', '#####.', '#####.', '.###..', '..#...'], r: ['.#.#..', '#####.', '#####.', '.###..', '..#...'] }, dollar: { l: ['.####.', '#.#...', '.###..', '..#.#.', '####..', '..#...'], r: ['.####.', '#.#...', '.###..', '..#.#.', '####..', '..#...'] },
      spiral: { l: ['#####.', '....#.', '.##.#.', '.#..#.', '.####.'] }, x: { l: ['#...#.', '.#.#..', '..#...', '.#.#..', '#...#.'], r: ['#...#.', '.#.#..', '..#...', '.#.#..', '#...#.'] },
      dot: { l: ['..##..', '..##..'] }, squint: { l: ['......', '#....#', '.####.'] }, zero: { l: ['.####.', '#....#', '#....#', '.####.'] }, static: { l: ['#.#.#.', '.#.#.#', '#.#.#.', '.#.#.#'] }, star: { l: ['..#...', '.###..', '#####.', '.###..', '#.#.#.'] },
      tear: { l: ['....##', '..##..', '##....', '..##..', '..##..', '.#....', '.#....'] }, up: { l: ['.####.', '#.##.#', '#....#', '.####.'] }, hype: { l: ['#....#', '.#..#.', '..##..'] }, wink: { l: ['..##..', '.#..#.', '#....#'], r: ['######'] }
    };
    var MOUTHS = {   // [row, 20 dots]
      smile: [[8, '.....#........#.....'], [9, '......#......#......'], [10, '.......######.......']], frown: [[9, '.......######.......'], [10, '......#......#......'], [11, '.....#........#.....']],
      flat: [[10, '......########......']], grin: [[8, '....############....'], [9, '....#..#..#..#.#....'], [10, '.....##########.....']], smirk: [[8, '..............#.....'], [9, '.............#......'], [10, '......#######.......']],
      teeth: [[9, '.....##########.....'], [10, '.....#.#.#.#.#.#....'], [11, '.....##########.....']], wavy: [[9, '......##..##..##....'], [10, '....##..##..##..##..']], tongue: [[8, '.....#........#.....'], [9, '......########......'], [10, '........####........'], [11, '.........##.........']],
      o: [[8, '........####........'], [9, '.......#....#.......'], [10, '.......#....#.......'], [11, '........####........']],
      open1: [[8, '......########......'], [9, '......#......#......'], [10, '.......######.......']], open2: [[7, '.......######.......'], [8, '......#......#......'], [9, '......#......#......'], [10, '......#......#......'], [11, '.......######.......']]
    };
    var FONT = { N: ['#...#', '##..#', '#.#.#', '#.#.#', '#..##', '#...#', '#...#'], P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'], C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'], B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
      T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'], V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'], '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'], '$': ['..#..', '.####', '#.#..', '.###.', '..#.#', '####.', '..#..'],
      '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'], '7': ['#####', '....#', '...#.', '..#..', '..#..', '..#..', '..#..'], '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'], '!': ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..'], '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'], Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'], E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
      R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'], G: ['.####', '#....', '#....', '#.###', '#...#', '#...#', '.###.'], M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'], O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'], K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
      ':': ['.....', '..#..', '..#..', '.....', '..#..', '..#..', '.....'], '(': ['...#.', '..#..', '.#...', '.#...', '.#...', '..#..', '...#.'] };
    var ICONS = { btv: { text: 'BTV' }, npc: { text: 'NPC' }, what: { text: '?' }, cash: { text: '$$$' }, six7: { text: '67' }, one: { text: '1' }, bang: { text: '!!!' },
      heart: { rows: [[2, '....###......###....'], [3, '...#####....#####...'], [4, '..################..'], [5, '..################..'], [6, '...##############...'], [7, '....############....'], [8, '.....##########.....'], [9, '......########......'], [10, '.......######.......'], [11, '........####........'], [12, '.........##.........']] },
      bars: { rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (r) { return [r, '.##..##..##..##..##.']; }) },
      lock: { rows: [[1, '.......######.......'], [2, '......#......#......'], [3, '......#......#......'], [4, '......#......#......'], [5, '....############....'], [6, '....############....'], [7, '....#####..#####....'], [8, '....#####..#####....'], [9, '....############....'], [10, '....############....'], [11, '....############....']] },
      bell: { rows: [[1, '.........##.........'], [2, '........####........'], [3, '.......######.......'], [4, '......########......'], [5, '......########......'], [6, '......########......'], [7, '.....##########.....'], [8, '....############....'], [9, '...##############...'], [11, '.........##.........']] },
      crown: { rows: [[3, '...#.....##.....#...'], [4, '...##...####...##...'], [5, '...###.######.###...'], [6, '...##############...'], [7, '...##############...'], [8, '...##############...'], [10, '...##############...']] },
      skull: { rows: [[1, '......########......'], [2, '.....##########.....'], [3, '....############....'], [4, '....##..####..##....'], [5, '....##..####..##....'], [6, '....############....'], [7, '.....####..####.....'], [8, '......########......'], [9, '......#.#..#.#......'], [10, '......#.#..#.#......']] },
      scroll: { rows: [[1, '....#..........#....'], [2, '.....#........#.....'], [3, '......#......#......'], [4, '.......#....#.......'], [5, '........#..#........'], [6, '.........##.........'], [7, '....#..........#....'], [8, '.....#........#.....'], [9, '......#......#......'], [10, '.......#....#.......'], [11, '........#..#........'], [12, '.........##.........']] },
      battery: { rows: [[4, '..###############...'], [5, '..#.............##..'], [6, '..#.#####.......##..'], [7, '..#.#####.......##..'], [8, '..#.#####.......##..'], [9, '..#.............##..'], [10, '..###############...']] },
      hundred: { text: '100' }, zzz: { text: 'ZZZ' }, err: { text: 'ERR' }, gm: { text: 'GM' }, ok: { text: 'OK' }, bsod: { text: ':(' }, zero: { text: '0' },
      wifi: { rows: [[2, '....############....'], [3, '..##............##..'], [5, '......########......'], [6, '....##........##....'], [8, '........####........'], [9, '......##....##......'], [11, '.........##.........']] },
      key: { rows: [[4, '..####..............'], [5, '.##..##.............'], [6, '.#....############..'], [7, '.##..##......##.##..'], [8, '..####.......##.##..']] },
      nuke: { rows: [[1, '......########......'], [2, '....############....'], [3, '...##############...'], [4, '...##############...'], [5, '.....##########.....'], [6, '........####........'], [7, '........####........'], [8, '........####........'], [9, '.......######.......'], [10, '.....##########.....'], [11, '...##############...']] },
      fire: { rows: [[1, '.........#..........'], [2, '........##..........'], [3, '.......###..#.......'], [4, '......####.##.......'], [5, '.....#########......'], [6, '....###########.....'], [7, '....####..#####.....'], [8, '....###....####.....'], [9, '....###....####.....'], [10, '.....###..####......'], [11, '......#######.......']] },
      snow: { rows: [[2, '.........##.........'], [3, '....#....##....#....'], [4, '.....##..##..##.....'], [5, '.......######.......'], [6, '...##############...'], [7, '.......######.......'], [8, '.....##..##..##.....'], [9, '....#....##....#....'], [10, '.........##.........']] },
      ghost: { rows: [[1, '......########......'], [2, '.....##########.....'], [3, '....############....'], [4, '....##..####..##....'], [5, '....##..####..##....'], [6, '....############....'], [7, '....############....'], [8, '....############....'], [9, '....############....'], [10, '....###.####.###....'], [11, '....#...#..#...#....']] },
      load: { rows: [[5, '..################..'], [6, '..#..............#..'], [7, '..#.########.....#..'], [8, '..#..............#..'], [9, '..################..']] },
      power: { rows: [[1, '.........##.........'], [2, '.....#...##...#.....'], [3, '....##...##...##....'], [4, '...##....##....##...'], [5, '...##....##....##...'], [6, '...##..........##...'], [7, '...##..........##...'], [8, '....##........##....'], [9, '.....##########.....'], [10, '.......######.......']] },
      check: { rows: [[3, '................##..'], [4, '...............##...'], [5, '..............##....'], [6, '..##.........##.....'], [7, '...##.......##......'], [8, '....##.....##.......'], [9, '.....##...##........'], [10, '......##.##.........'], [11, '.......###..........']] },
      off: { rows: [] } };
    var PRESET = { smile: ['happy', 'smile'], talk1: ['happy', 'open1'], talk2: ['happy', 'open2'], wink: ['wink', 'smile'], hype: ['hype', 'grin'], dead: ['x', 'flat'], angry: ['angry', 'frown'], mad: ['angry', 'grin'], sad: ['sad', 'frown'], shock: ['wide', 'o'], love: ['heart', 'grin'],
      money: ['dollar', 'grin'], sleepy: ['sleepy', 'flat'], hypno: ['spiral', 'flat'], smug: ['side', 'smirk'], blank: ['dot', 'flat'], laugh: ['hype', 'open2'], stare: ['open', 'flat'], cold: ['squint', 'wavy'], overheat: ['wide', 'wavy'], glitch: ['static', 'wavy'], cry: ['tear', 'frown'], grit: ['angry', 'teeth'], cheeky: ['wink', 'tongue'], starry: ['star', 'grin'], zeroed: ['zero', 'flat'], lookup: ['up', 'smile'] };
    var fx = { eyes: 'happy', mouth: 'smile', icon: null, lip: 0, key: '' };
    function drawFace() {
      var lipM = fx.lip > .62 ? 'open2' : fx.lip > .25 ? 'open1' : fx.mouth, key = fx.icon ? 'i' + fx.icon : fx.eyes + '|' + lipM; if (key === fx.key) return; fx.key = key;
      var G = []; for (var r0 = 0; r0 < 14; r0++) G.push('....................'.split(''));
      function put(rows, x, y) { for (var r = 0; r < rows.length; r++) for (var c = 0; c < rows[r].length; c++) if (rows[r][c] === '#' && G[y + r] && x + c >= 0 && x + c < 20) G[y + r][x + c] = '#'; }
      if (fx.icon) { var I = ICONS[fx.icon]; if (I.text) { var w = I.text.length * 6 - 1, x0 = Math.round((20 - w) / 2); for (var ci = 0; ci < I.text.length; ci++) put(FONT[I.text[ci]] || [], x0 + ci * 6, 3); } else I.rows.forEach(function (q) { put([q[1]], 0, q[0]); }); }
      else { var E = EYES[fx.eyes] || EYES.happy, lft = E.l, rgt = E.r || E.l.map(function (row) { return row.split('').reverse().join(''); }), top = 5 - Math.ceil(lft.length / 2);
        put(lft, 2, Math.max(1, top)); put(rgt, 12, Math.max(1, 5 - Math.ceil(rgt.length / 2))); (MOUTHS[lipM] || MOUTHS.smile).forEach(function (q) { put([q[1]], 0, q[0]); }); }
      var g = faceCv.getContext('2d'), cw = 160 / 20, chh = 112 / 14; g.fillStyle = '#04050a'; g.fillRect(0, 0, 160, 112);
      for (var yy = 0; yy < 14; yy++) for (var xx = 0; xx < 20; xx++) { var on = G[yy][xx] === '#', px = xx * cw + cw / 2, py = yy * chh + chh / 2;
        g.fillStyle = on ? '#4fb4ff' : '#0a0e1a'; g.beginPath(); g.arc(px, py, on ? 3.7 : 1.2, 0, TAU); g.fill();
        if (on) { g.fillStyle = 'rgba(80,170,255,.34)'; g.beginPath(); g.arc(px, py, 7, 0, TAU); g.fill(); g.fillStyle = '#e6f6ff'; g.beginPath(); g.arc(px, py, 1.7, 0, TAU); g.fill(); } }
      faceTx.needsUpdate = true;
    }
    var JACKETS = { silver: [0xffffff, 0x1c1e24], black: [0x2c2e36, 0x040406], white: [0xffffff, 0x4a4c54], gold: [0xffc94a, 0x2a1c00], rose: [0xff8fb8, 0x2a0a18], red: [0xe8343a, 0x2a0406], blue: [0x3f7dff, 0x04102a], ice: [0x9fe8ff, 0x0a2028], purple: [0x9a5cff, 0x14062a], slime: [0x9dff3a, 0x102400], orange: [0xff8a1f, 0x2a1200], camo: [0x7a8a52, 0x10140a] }, jacketName = 'silver';
    function setJacket(name) { var J2 = JACKETS[name]; if (!J2) return; jacketName = name; pufferM.color.setHex(J2[0]); pufferM.emissive.setHex(J2[1]); }   // the quilting and the shine stay; only the colour of the shell changes
    function setExpression(eyes, mouth) { if (EYES[eyes]) fx.eyes = eyes; if (MOUTHS[mouth]) fx.mouth = mouth; fx.icon = null; drawFace(); }
    function setIcon(name) { fx.icon = ICONS[name] ? name : null; drawFace(); }
    function setFace(name) { if (PRESET[name]) { fx.lip = 0; setExpression(PRESET[name][0], PRESET[name][1]); } else if (ICONS[name]) setIcon(name); }
    function setMouth(v) { fx.lip = v; drawFace(); }
    drawFace();

    // ---- what is on his phone: a feed that never stops, deep fried. Redrawn 12 times a second while the phone is out.
    var ROT = ['67', 'ROT', 'NPC', 'LIKE', '$$$', 'W', 'L', 'AD', 'SLOP', 'GM', 'RATIO', '!!!', 'SUB', 'LOL'];
    function phoneDraw(t) {
      var g = phoneCv.getContext('2d'), W = 64, H = 128, sp = t * 170 + Math.floor(t * 1.6) * 90, k0 = Math.floor(sp / 42);   // it scrolls, and every so often a thumb flicks it on
      for (var k = -1; k < 4; k++) { var n = k0 + k, y = H - ((sp % 42) + (k + 1) * 42) + 42, hue = (n * 67) % 360; g.fillStyle = 'hsl(' + hue + ',100%,' + (38 + (n * 13) % 30) + '%)'; g.fillRect(0, y, W, 42);
        g.fillStyle = 'hsl(' + ((hue + 180) % 360) + ',100%,60%)'; g.fillRect(3 + (n * 7) % 20, y + 4, 22, 22); g.fillStyle = '#fff'; g.font = 'bold ' + (13 + (n * 5) % 9) + 'px Impact, sans-serif'; g.fillText(ROT[((n % ROT.length) + ROT.length) % ROT.length], 4 + (n * 11) % 16, y + 36);
        g.fillStyle = '#ff2e88'; g.fillRect(50, y + 8, 9, 9); g.fillStyle = '#fff'; g.fillRect(50, y + 22, 9, 3); g.fillRect(50, y + 28, 9, 3); }
      var id = g.getImageData(0, 0, W, H), d = id.data;   // the grain: crushed, oversaturated and noisy
      for (var i = 0; i < d.length; i += 4) { var nz2 = (Math.random() - .5) * 150, row = (i / 4 / W | 0) % 3 === 0 ? .7 : 1; d[i] = Math.min(255, Math.max(0, (d[i] - 128) * 1.9 + 150 + nz2)) * row; d[i + 1] = Math.min(255, Math.max(0, (d[i + 1] - 128) * 1.9 + 120 + nz2)) * row; d[i + 2] = Math.min(255, Math.max(0, (d[i + 2] - 128) * 1.6 + 110 + nz2 * .6)) * row; }
      g.putImageData(id, 0, 0); if (Math.random() < .25) { var gy = Math.random() * H | 0; g.drawImage(phoneCv, 0, gy, W, 9, (Math.random() - .5) * 14, gy, W, 9); }   // a tear
      phoneTx.needsUpdate = true;
    }
    // ---- poses and motion. Every joint is a spring chasing a target, so moves overshoot a little and settle.
    var pose = 'idle', lastPose = '', bt0 = 0, bpm = 137.2, st = {};
    function setPose(p) { if (POSES[p]) pose = p; }
    function setTempo(b) { bpm = b; }
    function ch(name, target, dt, k, d) {
      var q = st[name] || (st[name] = { x: target, v: 0 });
      if (dt > .2) { q.x = target; q.v = 0; return q.x; }
      var n = dt > .025 ? 2 : 1, h = dt / n; k = k || 150; d = d || 19;
      for (var i = 0; i < n; i++) { q.v += ((target - q.x) * k - q.v * d) * h; q.x += q.v * h; }
      return q.x;
    }
    // hand shapes: curl of index, middle, ring, pinky, thumb (0 straight, 1 closed; thumb below 0 sticks out), then finger spread
    var HANDS = { open: [0, 0, 0, 0, 0, .2], relax: [.22, .28, .34, .4, .25, .05], fist: [1, 1, 1, 1, .9, 0], point: [0, 1, 1, 1, .9, 0], thumb: [1, 1, 1, 1, -.55, 0], peace: [0, 0, 1, 1, .9, .45], grip: [.6, .6, .62, .66, .3, 0], spread: [0, 0, 0, 0, -.25, .6], horns: [0, 1, 1, 0, .9, .25], L: [0, 1, 1, 1, -.55, 0], three: [0, 0, 0, 1, .9, .3] };
    function A(o) { var r = { sx: .05, out: .13, tw: 0, ex: -.2, roll: 0, wx: 0, wy: 1.2, wz: 0, hand: 'relax' }; for (var k in o) r[k] = o[k]; return r; }
    function L0() { return { h: -.05, o: .03, k: .1, f: -.05 }; }   // knees never lock straight
    function frac(x) { return ((x % 1) + 1) % 1; }
    function crouch(g, c) { g.ll.h -= c; g.rl.h -= c; g.ll.k += 2 * c; g.rl.k += 2 * c; g.ll.f -= c; g.rl.f -= c; g.by -= .595 * (1 - Math.cos(c)); }
    // L is his left arm and leg, R his right. sx swings an arm forward (negative) or back, out lifts it sideways,
    // ex bends the elbow (negative), wy turns the palm in towards the body, wx / wz bend the wrist.
    var POSES = {
      idle: function (g, t) { var w = Math.sin(t * .9); g.brz = w * .03; g.tz = -w * .035; g.by += Math.sin(t * 1.8) * .006; g.ll.o = .04 + w * .02; g.rl.o = .04 - w * .02;
        g.hy = Math.sin(t * .45) * .16; g.hz = Math.sin(t * .31) * .05; g.hx = Math.sin(t * .6) * .03;
        g.L = A({ sx: .05 + Math.sin(t * .9 + 1) * .03, ex: -.24 }); g.R = A({ sx: .05 - Math.sin(t * .9 + 1) * .03, ex: -.2 }); },
      walk: function (g, t, bt) { var ph = bt * Math.PI, sn = Math.sin(ph), cs = Math.cos(ph);
        g.ll.h = sn * .62; g.ll.k = Math.max(0, -cs) * .95 + .08; g.ll.f = -sn * .25; g.rl.h = -sn * .62; g.rl.k = Math.max(0, cs) * .95 + .08; g.rl.f = sn * .25;
        g.by = Math.abs(cs) * .035 - .03; g.brz = sn * .05; g.bry = sn * .12; g.ty = -sn * .26; g.tz = -sn * .04; g.tx = .05; g.hx = .04 + Math.abs(cs) * .05; g.hy = sn * .1;
        g.L = A({ sx: -sn * .6, out: .2, ex: -.5 - Math.max(0, sn) * .35, hand: 'relax' }); g.R = A({ sx: sn * .6, out: .2, ex: -.5 - Math.max(0, -sn) * .35, hand: 'relax' }); },
      dance: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)), side = Math.sin(bt * Math.PI / 2), up = side > 0 ? 1 : 0, sw = Math.floor(bt / 16) % 2;
        crouch(g, .16 + .22 * b); g.brz = side * .07; g.bry = side * .32; g.ty = side * .18; g.tz = -side * .06; g.hx = b * .2; g.hy = side * .22; g.hz = side * .08; g.ll.o = .06 + Math.max(0, side) * .2; g.rl.o = .06 + Math.max(0, -side) * .2;
        if (!sw) { g.L = A({ sx: -1.0 - up * .5 - b * .25 * up, out: .45, ex: -1.6 + b * .5 * up, wy: 1.4, hand: 'fist' }); g.R = A({ sx: -1.0 - (1 - up) * .5 - b * .25 * (1 - up), out: .45, ex: -1.6 + b * .5 * (1 - up), wy: 1.4, hand: 'fist' }); }
        else { var o = .9 + Math.abs(side) * .5; g.L = A({ sx: -.3, out: o, ex: -1.2 - b * .4, wy: .3, hand: up ? 'spread' : 'horns' }); g.R = A({ sx: -.3, out: o, ex: -1.2 - b * .4, wy: .3, hand: up ? 'horns' : 'spread' }); } },
      rap: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)), bar = Math.floor(bt / 8), v = bar % 4, mir = Math.floor(bt / 32) % 2, sway = Math.sin(bt * Math.PI / 4);
        crouch(g, .07 + .11 * b); g.tx = .09 + b * .05; g.brz = sway * .04; g.hx = b * .2; g.hz = sway * .06; g.ll.o = .09; g.rl.o = .09;
        var act = A({ sx: -1.25 + b * .5, out: .12 + (v === 1 ? .35 : 0), ex: -1.3 + b * .6, wy: v === 1 ? .2 : 1.5, wx: -b * .35, hand: ['point', 'open', 'peace', 'horns'][v] });
        var off = v === 2 ? A({ sx: -.48, out: .48, tw: -1.3, ex: -1.18, wy: .61, wx: .35, wz: Math.sin(t * 5) * .08, hand: 'grip' }) : A({ sx: .12, out: .2, ex: -.55 - b * .2, hand: 'fist' });
        g.pz = v === 2 ? 1 : 0; var tw = .28 + sway * .1;
        if (mir) { g.L = act; g.R = off; g.bry = tw; g.ty = -.12; g.hy = -.2; } else { g.R = act; g.L = off; g.bry = -tw; g.ty = .12; g.hy = .2; } },
      point: function (g, t) { var j = Math.sin(t * 3) * .03; crouch(g, .05); g.tx = .12; g.bry = .22; g.ty = .12; g.hy = -.2; g.hx = .04; g.ll.h -= .22; g.ll.f += .12; g.rl.h += .12;
        g.L = A({ sx: -1.5 + j, out: .12, ex: -.08, wy: 1.57, hand: 'point' }); g.R = A({ sx: .15, out: .75, ex: -1.9, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      shake: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)), sd = Math.sin(bt * Math.PI), bar = Math.floor(bt / 8) % 2;   // head side to side on the beat (or a headbang, every other bar): this is the one that throws the dreads
        crouch(g, .14 + .14 * b); g.ll.o = .12; g.rl.o = .12; g.tx = .1 + b * .06;
        if (!bar) { g.hy = sd * .8; g.hz = sd * .18; g.hx = .1; g.ty = sd * .18; g.brz = sd * .04; } else { g.hx = -.25 + b * .75; g.tx = .05 + b * .2; g.hy = sd * .12; }
        g.L = A({ sx: -.5, out: .3, ex: -1.35 + b * .35, wy: 1.4, hand: 'fist' }); g.R = A({ sx: -.5, out: .3, ex: -1.35 + b * .35, wy: 1.4, hand: bar ? 'horns' : 'fist' }); },
      // ---- poses written for lines of The Algorithm
      scroll: function (g, t) { var f = frac(t * 1.6), w = Math.sin(t * 2.2); g.phone = true; g.tx = .1; g.bry = -.14 + w * .04; g.hy = .1; g.hz = -.1 + w * .03; g.hx = -.04; crouch(g, .05); g.ll.o = .09; g.rl.o = .09;   // he holds it out at you, screen first, and flicks the feed along with his other hand
        g.L = A({ sx: -1.38 + w * .03, out: .02, tw: -.2, ex: -.7, wy: 3.14, wx: -.6 + w * .06, hand: 'grip', thumb: .1 }); g.R = A({ sx: -1.3, out: .28, tw: -.75, ex: -1.25 + f * .3, wy: 1.2, wx: .2 - f * .5, hand: 'point' }); },
      phone: function (g, t) { g.phone = true; g.tx = .08; g.bry = -.15; g.hy = .12; g.hz = .08; crouch(g, .05);
        g.L = A({ sx: -1.15 + Math.sin(t * 3) * .04, out: .2, ex: -1.6, wy: 3.14, hand: 'grip', thumb: .1 }); g.R = A({ sx: .15, out: .75, ex: -1.9, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      loser: function (g, t) { var w = Math.sin(t * 6) * .06; g.hz = -.14; g.hy = .1; g.tz = .04; g.brz = -.03;
        g.R = A({ sx: -1.9, out: .1, tw: -.9, ex: -1.3 + w, wy: 3.14, hand: 'L' }); g.L = A({ sx: .15, out: .75, ex: -1.9, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      think: function (g, t) { var tap = Math.max(0, Math.sin(t * 9)) * .12; g.hz = .12; g.hy = -.1; g.hx = -.05;
        g.L = A({ sx: -1.75, out: .4, tw: -.35, ex: -1.65 + tap, wy: 1.57, hand: 'point' }); g.R = A({ sx: .05, ex: -.3 }); },
      me: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)); crouch(g, .05 + b * .05); g.tx = -.08; g.hx = -.1 + b * .1; g.ll.o = .1; g.rl.o = .1;
        g.L = A({ sx: -.55, out: .5, tw: -1.25, ex: -1.5 + b * .2, wy: -.3, hand: 'thumb' }); g.R = A({ sx: -.55, out: .5, tw: -1.25, ex: -1.5 + b * .2, wy: -.3, hand: 'thumb' }); },
      prison: function (g, t) { var r = Math.sin(t * 11) * .05; g.tx = .12; g.hx = .05; g.hy = Math.sin(t * 3) * .12; crouch(g, .08); g.ll.o = .1; g.rl.o = .1;
        g.L = A({ sx: -1.5 + r, out: .22, ex: -1.25, wy: 3.14, hand: 'fist' }); g.R = A({ sx: -1.5 - r, out: .22, ex: -1.25, wy: 3.14, hand: 'fist' }); },
      npc: function (g, t, bt) { var ph = bt * Math.PI, sn = Math.sin(ph), cs = Math.cos(ph); g.ll.h = sn * .32; g.ll.k = Math.max(0, -cs) * .5 + .05; g.rl.h = -sn * .32; g.rl.k = Math.max(0, cs) * .5 + .05; g.brz = sn * .07; g.hz = .28; g.hx = .12; g.tx = .06;
        g.L = A({ sx: -1.35 + sn * .06, out: .08, ex: -.12, wy: 1.57, wx: .5, hand: 'relax' }); g.R = A({ sx: -1.35 - sn * .06, out: .08, ex: -.12, wy: 1.57, wx: .5, hand: 'relax' }); },
      nope: function (g, t) { var w = Math.sin(t * 8); g.hy = w * .3; g.hz = .05; g.tx = -.04;
        g.R = A({ sx: -1.2, out: .2, ex: -1.6, wy: 3.14, wz: w * .5, hand: 'point' }); g.L = A({ sx: .15, out: .75, ex: -1.9, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      watch: function (g, t) { g.hx = .32; g.hy = .3; g.tx = .08; g.hz = .05;
        g.R = A({ sx: -.7, out: .35, tw: -1.3, ex: -1.45, wy: 1.57, hand: 'fist' }); g.L = A({ sx: -.6, out: .2, tw: -1.2, ex: -1.5 + Math.max(0, Math.sin(t * 7)) * .12, wy: 1.2, hand: 'point' }); },
      flex: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)); g.tx = -.12; g.hx = -.15; g.ll.o = .15; g.rl.o = .15; crouch(g, .06);
        g.L = A({ sx: 0, out: 1.5, ex: -1.9 - b * .25, roll: 1.57, wy: 1.57, hand: 'fist' }); g.R = A({ sx: 0, out: 1.5, ex: -1.9 - b * .25, roll: 1.57, wy: 1.57, hand: 'fist' }); },
      write: function (g, t) { var w = Math.sin(t * 13); g.tx = .14; g.hx = .3; g.hy = -.1;
        g.L = A({ sx: -.55, out: .35, tw: -1.0, ex: -1.3, wy: -.4, hand: 'open' }); g.R = A({ sx: -.65, out: .3, tw: -1.1, ex: -1.35 + w * .05, wy: 1.2, wz: w * .3, hand: 'point' }); },
      eat: function (g, t) { var u = .5 + .5 * Math.sin(t * 6); g.hx = .1 - u * .12; g.tx = .08; g.hz = .06;
        g.R = A({ sx: -1.0 - u * .5, out: .25, tw: -.9, ex: -1.7 - u * .4, wy: 1.2, hand: 'grip' }); g.L = A({ sx: -.5, out: .3, tw: -1.0, ex: -1.3, wy: -.4, hand: 'open' }); },
      harvest: function (g, t, bt) { var u = Math.sin(bt * Math.PI); g.tx = .2 - Math.abs(u) * .1; g.ty = u * .2; crouch(g, .14); g.ll.o = .14; g.rl.o = .14; g.hx = .1;
        g.L = A({ sx: -1.0 - u * .4, out: .15, ex: -.9 + u * .6, wy: 1.57, hand: 'fist' }); g.R = A({ sx: -1.0 + u * .4, out: .15, ex: -.9 - u * .6, wy: 1.57, hand: 'fist' }); },
      money: function (g, t) { var f = frac(t * 3.5); g.tx = -.05; g.hz = -.08; g.bry = .12;
        g.L = A({ sx: -.75, out: .2, tw: -.6, ex: -1.4, wy: -.3, hand: 'open' }); g.R = A({ sx: -.85, out: .25, tw: -.8, ex: -1.3 - f * .25, wy: 1.57, wz: -f * .9, hand: f < .5 ? 'grip' : 'spread' }); },
      one: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)); g.hx = -.2; g.tx = -.08; g.brz = .03; crouch(g, .04 + b * .05);
        g.R = A({ sx: -.15, out: 2.75 + b * .1, ex: -.15, wy: 0, hand: 'point' }); g.L = A({ sx: .15, out: .75, ex: -1.9, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      pray: function (g, t) { g.hx = .3; g.tx = .12; g.by += Math.sin(t * 2) * .006;
        g.L = A({ sx: -.6, out: .5, tw: -1.3, ex: -1.5, wy: 1.57, hand: 'open' }); g.R = A({ sx: -.6, out: .5, tw: -1.3, ex: -1.5, wy: 1.57, hand: 'open' }); },
      boss: function (g, t) { g.tx = -.1; g.hx = -.16; g.hy = Math.sin(t * .8) * .15; g.ll.o = .17; g.rl.o = .17; g.by += Math.sin(t * 2) * .006;
        g.L = A({ sx: .15, out: .8, ex: -1.95, roll: -1.57, wy: 1.57, hand: 'fist' }); g.R = A({ sx: .15, out: .8, ex: -1.95, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      stop: function (g, t) { g.tx = -.08; g.bry = .12; g.hx = -.05; g.ll.h -= .15; g.rl.h += .1;
        g.R = A({ sx: -1.2, out: .15, ex: -1.7, wy: 3.14, hand: 'spread' }); g.L = A({ sx: .15, out: .75, ex: -1.9, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      run: function (g, t, bt) { var ph = bt * Math.PI * 2, sn = Math.sin(ph), cs = Math.cos(ph); g.tx = .3; g.hx = -.15;
        g.ll.h = sn * .9 - .2; g.ll.k = Math.max(0, -cs) * 1.3 + .2; g.rl.h = -sn * .9 - .2; g.rl.k = Math.max(0, cs) * 1.3 + .2; g.by = Math.abs(cs) * .05 - .04; g.ty = -sn * .2;
        g.L = A({ sx: -sn * .9, out: .2, ex: -1.5, hand: 'fist' }); g.R = A({ sx: sn * .9, out: .2, ex: -1.5, hand: 'fist' }); },
      lead: function (g, t, bt) { var ph = bt * Math.PI, sn = Math.sin(ph), cs = Math.cos(ph), b = Math.exp(-5 * frac(bt)); g.ll.h = sn * .35; g.ll.k = Math.max(0, -cs) * .6 + .05; g.rl.h = -sn * .35; g.rl.k = Math.max(0, cs) * .6 + .05; g.hx = -.12; g.brz = sn * .04;
        g.R = A({ sx: -1.5 + b * .5, out: .55, ex: -.9 + b * .5, wy: 1.57, hand: 'point' }); g.L = A({ sx: -sn * .4, out: .2, ex: -.6, hand: 'fist' }); },
      mad: function (g, t, bt) { var b = Math.exp(-6 * frac(bt * 2)), w = Math.sin(t * 16); crouch(g, .1 + b * .16); g.tx = .16; g.hx = .12; g.hy = w * .12; g.ll.o = .14; g.rl.o = .14;
        g.L = A({ sx: .1, out: .5, ex: -1.1 - b * .5, wy: 1.57, hand: 'fist' }); g.R = A({ sx: .1, out: .5, ex: -1.1 - b * .5, wy: 1.57, hand: 'fist' }); },
      shrug: function (g, t) { var u = .5 + .5 * Math.sin(t * 2.5); g.hz = .16; g.hx = -.05; g.by += u * .012;
        g.L = A({ sx: -.3, out: .6 + u * .1, ex: -1.6, roll: .9, wy: -.6, hand: 'open' }); g.R = A({ sx: -.3, out: .6 + u * .1, ex: -1.6, roll: .9, wy: -.6, hand: 'open' }); },
      // ---- action moves: all on the beat. lb counts beats since the move started.
      jump: function (g, t, bt) { var u = frac(bt / 2);
        if (u < .22) { var c = u / .22; crouch(g, .5 * c); g.tx = .2 * c; g.L = A({ sx: .7 * c, out: .2, ex: -.5, hand: 'fist' }); g.R = A({ sx: .7 * c, out: .2, ex: -.5, hand: 'fist' }); }
        else if (u < .72) { var a = (u - .22) / .5, sA = Math.sin(a * Math.PI); g.air = true; g.by = 4 * a * (1 - a) * .45; g.ll.h = -.6 * sA; g.ll.k = 1.2 * sA; g.rl.h = -.6 * sA; g.rl.k = 1.2 * sA; g.ll.f = .5; g.rl.f = .5; g.hx = -.2; g.tx = -.08; g.L = A({ sx: -.3, out: 2.5, ex: -.2, wy: 0, hand: 'spread' }); g.R = A({ sx: -.3, out: 2.5, ex: -.2, wy: 0, hand: 'spread' }); }
        else { var c2 = 1 - (u - .72) / .28; crouch(g, .5 * c2); g.tx = .15 * c2; g.L = A({ sx: -.4 * c2, out: .5, ex: -.6, hand: 'open' }); g.R = A({ sx: -.4 * c2, out: .5, ex: -.6, hand: 'open' }); } },
      bodyroll: function (g, t, bt) { var f = bt * Math.PI; g.hx = Math.sin(f) * .35; g.tx = Math.sin(f - .9) * .32; g.brx = Math.sin(f - 1.8) * .16; g.bpz = Math.sin(f - 1.3) * .07; crouch(g, .16 + Math.sin(f - 2.5) * .1); g.ll.o = .1; g.rl.o = .1;
        g.L = A({ sx: Math.sin(f - 1.3) * .35 - .1, out: .25, ex: -.7 + Math.sin(f - 2) * .2, hand: 'relax' }); g.R = A({ sx: Math.sin(f - 1.3) * .35 - .1, out: .25, ex: -.7 + Math.sin(f - 2) * .2, hand: 'relax' }); },
      spin: function (g, t, bt, lb) { var n = Math.floor(lb / 4), u = frac(lb / 4), k = Math.min(1, u / .5), e = k * k * (3 - 2 * k), sp = u < .5 ? 1 : 0; g.bry = (n + e) * TAU; crouch(g, .08); g.rl.h = -.5 * sp; g.rl.k = 1.3 * sp; g.hx = -.05;
        if (sp) { g.L = A({ sx: -.48, out: .48, tw: -1.3, ex: -1.18, wy: .61, wx: .35, hand: 'fist' }); g.R = A({ sx: -.44, out: .5, tw: -1.3, ex: -1.3, wy: .61, wx: .35, hand: 'fist' }); }
        else { g.tx = -.08; g.L = A({ sx: -1.45, out: .5, ex: -.1, wy: 1.57, hand: 'point' }); g.R = A({ sx: -1.45, out: .5, ex: -.1, wy: 1.57, hand: 'point' }); } },
      kick: function (g, t, bt) { var u = frac(bt / 2), up = Math.min(1, u / .3), dn = Math.max(0, 1 - Math.max(0, u - .45) / .3), e = up * up * (3 - 2 * up) * dn, ch2 = Math.sin(Math.min(1, u / .22) * Math.PI); g.rl.h = -1.5 * e; g.rl.k = 1.5 * ch2 * (u < .22 ? 1 : 0) + .05; g.rl.f = -.4 * e; g.tx = -.28 * e; g.bry = .25 * e; g.ll.k = .25 + .1 * e; g.ll.h = -.12; g.by -= .03; g.hx = .1 * e;
        g.L = A({ sx: -.9, out: .35, ex: -2.0, wy: 1.2, hand: 'fist' }); g.R = A({ sx: .3 * e - .6, out: .5, ex: -1.6, wy: 1.2, hand: 'fist' }); },
      punch: function (g, t, bt) { var i = Math.floor(bt), p = Math.exp(-6 * frac(bt)), lft = i % 2 === 0, hit = A({ sx: -1.5, out: .05, ex: -.1 - (1 - p) * 1.6, wy: 1.57, hand: 'fist' }), grd = A({ sx: -.9, out: .3, ex: -2.05, wy: 1.2, hand: 'fist' }); crouch(g, .16); g.ll.o = .14; g.rl.o = .14; g.tx = .12; g.hx = .08; g.ty = (lft ? -1 : 1) * .5 * p; g.ll.h -= .15; g.rl.h += .15;
        if (lft) { g.L = hit; g.R = grd; } else { g.R = hit; g.L = grd; } },
      dab: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)); crouch(g, .1 + b * .08); g.hx = .3; g.hy = .45; g.tz = -.14; g.brz = -.05; g.ll.o = .14; g.rl.o = .14;
        g.L = A({ sx: -.2, out: 2.15 + b * .08, ex: -.05, wy: 0, hand: 'open' }); g.R = A({ sx: -1.75, out: .25, tw: -1.0, ex: -1.35, wy: 1.2, hand: 'open' }); },
      robot: function (g, t, bt) { var q = Math.floor(bt), a = q % 4; g.hy = [.55, 0, -.55, 0][a]; g.ty = [.3, 0, -.3, 0][a]; g.tz = [0, .08, 0, -.08][a]; crouch(g, .06 + (a % 2) * .1); g.ll.o = .1; g.rl.o = .1;   // right angles, held, then snapped to the next
        g.L = A({ sx: -1.57 * (a % 2), out: a === 2 ? 1.57 : 0, ex: -1.57 * (a < 2 ? 1 : 0), wy: 1.57, wx: a === 3 ? -.8 : 0, hand: 'open' }); g.R = A({ sx: -1.57 * ((a + 1) % 2), out: a === 0 ? 1.57 : 0, ex: -1.57 * (a >= 2 ? 1 : 0), wy: 1.57, wx: a === 1 ? -.8 : 0, hand: 'open' }); },
      armwave: function (g, t, bt) { var f = bt * Math.PI; g.brz = Math.sin(f - 2) * .05; g.tz = Math.sin(f - 2) * .06; g.hz = Math.sin(f - 2) * .12; crouch(g, .08); g.ll.o = .1; g.rl.o = .1;   // a wave that runs in one hand, across his shoulders and out the other
        g.L = A({ sx: -.05, out: 1.5 + Math.sin(f - 2.6) * .28, ex: Math.min(-.03, Math.sin(f - 3.4) * .6 - .3), roll: 1.57, wy: 0, wz: Math.sin(f - 4.2) * .7, hand: 'open' }); g.R = A({ sx: -.05, out: 1.5 + Math.sin(f - 1.4) * .28, ex: Math.min(-.03, Math.sin(f - .6) * .6 - .3), roll: 1.57, wy: 0, wz: Math.sin(f + .2) * .7, hand: 'open' }); },
      drop: function (g, t, bt) { var u = frac(bt / 2), dwn = u < .55 ? Math.min(1, u / .2) : Math.max(0, 1 - (u - .55) / .2), e = dwn * dwn * (3 - 2 * dwn); crouch(g, .95 * e + .05); g.ll.o = .12 + .25 * e; g.rl.o = .12 + .25 * e; g.tx = .3 * e; g.hx = -.25 * e; g.by += Math.sin(t * 20) * .01 * e;
        g.L = A({ sx: -.75 * e, out: .3, ex: -.3 - .2 * e, wy: 1.57, hand: 'grip' }); g.R = A({ sx: -.75 * e, out: .3, ex: -.3 - .2 * e, wy: 1.57, hand: 'grip' }); },
      slide: function (g, t, bt) { var f = bt * Math.PI / 2, sd = Math.sin(f), st2 = Math.sin(bt * Math.PI); g.bpx = sd * .5; g.brz = -Math.cos(f) * .07; g.tz = Math.cos(f) * .08; g.bry = Math.cos(f) * .25; g.ll.k = .15 + Math.max(0, st2) * .5; g.rl.k = .15 + Math.max(0, -st2) * .5; g.ll.f = -Math.max(0, st2) * .5; g.rl.f = -Math.max(0, -st2) * .5; g.ll.h = -.08 - Math.max(0, st2) * .2; g.rl.h = -.08 - Math.max(0, -st2) * .2; g.by -= .03; g.hy = -Math.cos(f) * .2;
        g.L = A({ sx: st2 * .4, out: .35, ex: -.9, hand: 'relax' }); g.R = A({ sx: -st2 * .4, out: .35, ex: -.9, hand: 'relax' }); },
      backflip: function (g, t, bt, lb) { var n = Math.floor(lb / 4), u = frac(lb / 4), a = Math.min(1, Math.max(0, (u - .2) / .45)), e = a * a * (3 - 2 * a), air = u > .2 && u < .65, sA = Math.sin(a * Math.PI); g.brx = -(n + e) * TAU;
        if (u <= .2) { crouch(g, .55 * (u / .2)); g.tx = .2; } else if (air) { g.air = true; g.by = 4 * a * (1 - a) * .7; g.ll.h = -1.3 * sA; g.ll.k = 1.7 * sA; g.rl.h = -1.3 * sA; g.rl.k = 1.7 * sA; g.tx = .25 * sA; g.hx = .2 * sA; } else { crouch(g, .5 * Math.max(0, 1 - (u - .65) / .2)); }
        g.L = A({ sx: air ? -1.0 : (u <= .2 ? .6 : -.3), out: air ? .35 : .5, ex: air ? -1.5 : -.5, hand: 'fist' }); g.R = A({ sx: air ? -1.0 : (u <= .2 ? .6 : -.3), out: air ? .35 : .5, ex: air ? -1.5 : -.5, hand: 'fist' }); },
      stomp: function (g, t, bt) { var i = Math.floor(bt), p = frac(bt), up = p > .5 ? (p - .5) / .5 : 0, e = up * up, b = Math.exp(-7 * p), lft = i % 2 === 0, A1 = lft ? g.rl : g.ll; A1.h = -1.0 * e; A1.k = 1.4 * e; g.by -= b * .05; g.brz = (lft ? 1 : -1) * .06 * e; g.tx = .14; g.hx = b * .2; g.ll.o = .12; g.rl.o = .12;
        g.L = A({ sx: -.6 * e + .2, out: .45, ex: -1.3 + b * .5, hand: 'fist' }); g.R = A({ sx: -.6 * e + .2, out: .45, ex: -1.3 + b * .5, hand: 'fist' }); },
      // ---- poses written for lines in his other songs
      boot: function (g, t) { var u = Math.min(1, frac(t / 4) * 1.7), e = u * u * (3 - 2 * u), j = u < 1 ? Math.sin(t * 30) * .02 * (1 - u) : 0; g.tx = .65 * (1 - e) + j; g.hx = .55 * (1 - e); g.hz = j * 3; crouch(g, .25 * (1 - e));
        g.L = A({ sx: -.25 * (1 - e) + .05, out: .1, ex: -.15 - e * .1, hand: e > .9 ? 'fist' : 'relax' }); g.R = A({ sx: -.25 * (1 - e) + .05, out: .1, ex: -.15 - e * .1, hand: e > .9 ? 'fist' : 'relax' }); },
      shiver: function (g, t) { var j = Math.sin(t * 42) * .018; crouch(g, .1); g.brz = j; g.tx = .12; g.hx = .12; g.hy = j * 4; g.ll.o = .0; g.rl.o = .0;
        g.L = A({ sx: -.48 + j, out: .48, tw: -1.3, ex: -1.18, wy: .61, wx: .35, hand: 'fist' }); g.R = A({ sx: -.44 - j, out: .5, tw: -1.3, ex: -1.3, wy: .61, wx: .35, hand: 'fist' }); },
      hot: function (g, t) { var w = Math.sin(t * 17); g.hx = -.22; g.tx = -.08; g.hz = .08; g.by += Math.sin(t * 5) * .008;
        g.R = A({ sx: -1.55, out: .35, tw: -.5, ex: -1.45, wy: 3.14, wz: w * .55, hand: 'open' }); g.L = A({ sx: -.48, out: .48, tw: -1.3, ex: -1.3 + Math.sin(t * 6) * .08, wy: .61, wx: .35, hand: 'grip' }); },
      crash: function (g, t) { var tw = frac(t * .9) < .08 ? Math.sin(t * 60) * .12 : 0; g.tx = .38; g.tz = .14 + tw; g.hx = .7; g.hz = .2; crouch(g, .12); g.brz = .05;
        g.L = A({ sx: -.2 + tw, out: .1, ex: -.1, hand: 'relax' }); g.R = A({ sx: -.3, out: .1, ex: -.1 - tw, hand: 'relax' }); },
      glitch: function (g, t) { var q = Math.floor(t * 7), r = function (k) { var x = Math.sin((q + k) * 12.9898) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };
        g.hy = r(1) * .6; g.hz = r(2) * .3; g.hx = r(3) * .2; g.tz = r(4) * .12; g.brz = r(5) * .05; crouch(g, .05 + Math.abs(r(6)) * .1);
        g.L = A({ sx: -.8 + r(7) * .8, out: .5 + r(8) * .5, ex: -1.0 + r(9) * .8, hand: r(10) > 0 ? 'spread' : 'fist' }); g.R = A({ sx: -.8 + r(11) * .8, out: .5 + r(12) * .5, ex: -1.0 + r(13) * .8, hand: r(14) > 0 ? 'point' : 'open' }); },
      key: function (g, t) { g.tx = .16; g.bry = .2; g.hy = -.15; g.hx = .08; crouch(g, .06);
        g.R = A({ sx: -1.3, out: .12, ex: -.45, wy: 1.57 + Math.sin(t * 3.5) * 1.2, hand: 'grip' }); g.L = A({ sx: .15, out: .75, ex: -1.9, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      wait: function (g, t) { g.hz = .14; g.hy = Math.sin(t * .6) * .2; g.hx = .05; g.rl.f = Math.max(0, Math.sin(t * 8)) * .4; g.rl.h = -.12; g.rl.o = .1; g.brz = -.03;
        g.L = A({ sx: -.48, out: .48, tw: -1.3, ex: -1.18, wy: .61, wx: .35, hand: 'fist' }); g.R = A({ sx: -.42, out: .5, tw: -1.3, ex: -1.32, wy: .61, wx: .35, hand: 'relax' }); },
      boom: function (g, t, bt) { var b = Math.exp(-4 * frac(bt / 2)); crouch(g, .3 * (1 - b)); g.by += b * .1; g.hx = -.35 * b; g.tx = -.15 * b + .1; g.ll.o = .12 + b * .12; g.rl.o = .12 + b * .12;
        g.L = A({ sx: -.2, out: .3 + b * 2.2, ex: -1.4 + b * 1.2, wy: 0, hand: b > .3 ? 'spread' : 'fist' }); g.R = A({ sx: -.2, out: .3 + b * 2.2, ex: -1.4 + b * 1.2, wy: 0, hand: b > .3 ? 'spread' : 'fist' }); },
      mic: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)), sw = Math.sin(bt * Math.PI / 4); crouch(g, .07 + b * .1); g.tx = .1; g.bry = -.2 + sw * .15; g.hx = b * .15; g.hy = .15;
        g.R = A({ sx: -1.15, out: .25, tw: -.9, ex: -1.95, wy: 1.2, hand: 'fist' }); g.L = A({ sx: -1.15 + b * .45, out: .45, ex: -.95 + b * .45, wy: .4, hand: Math.floor(bt / 4) % 2 ? 'open' : 'point' }); },
      wrist: function (g, t) { var w = Math.sin(t * 11); g.hy = .3; g.hx = .12; g.bry = -.15; g.hz = -.06;
        g.R = A({ sx: -1.3, out: .4, tw: -.6, ex: -1.7, wy: 0, wz: w * .22, hand: 'fist' }); g.L = A({ sx: -1.0, out: .15, tw: -.9, ex: -1.5, wy: 1.2, hand: 'point' }); },
      hear: function (g, t) { g.tz = .14; g.hz = .18; g.hy = -.3; g.brz = .04; g.tx = .06;
        g.L = A({ sx: -.4, out: 1.3, ex: -2.15, roll: 1.57, wy: 1.57, hand: 'open' }); g.R = A({ sx: .05, ex: -.3 }); },
      see: function (g, t) { g.tx = .22; g.hx = -.05; g.hy = Math.sin(t * 1.4) * .45; g.bry = Math.sin(t * 1.4) * .2; crouch(g, .08);
        g.L = A({ sx: -1.78, out: .15, tw: -.55, ex: -1.45, wy: 1.57, hand: 'grip' }); g.R = A({ sx: -1.78, out: .15, tw: -.55, ex: -1.45, wy: 1.57, hand: 'grip' }); },
      sleep: function (g, t) { var br = Math.sin(t * 1.2); g.tx = .28 + br * .02; g.hx = .62 + br * .04; g.hz = .12; crouch(g, .08); g.by += br * .006;
        g.L = A({ sx: -.1, out: .08, ex: -.08, hand: 'relax' }); g.R = A({ sx: -.1, out: .08, ex: -.08, hand: 'relax' }); },
      swipe: function (g, t) { var w = Math.sin(t * 4.5); g.hy = -w * .3; g.ty = -w * .15; g.hx = .04;
        g.R = A({ sx: -1.3, out: .35 + w * .6, ex: -.5, wy: 1.57, wz: w * .3, hand: 'open' }); g.L = A({ sx: .15, out: .75, ex: -1.9, roll: -1.57, wy: 1.57, hand: 'fist' }); },
      gang: function (g, t, bt) { var u = .5 + .5 * Math.sin(bt * Math.PI), b = Math.exp(-5 * frac(bt)); crouch(g, .08 + b * .08); g.hx = -.1; g.tx = -.04; g.ll.o = .12; g.rl.o = .12;
        g.L = A({ sx: -1.1, out: .6, ex: -.8 - u * .9, wy: -1.2, hand: u > .5 ? 'grip' : 'open' }); g.R = A({ sx: -1.1, out: .6, ex: -.8 - u * .9, wy: -1.2, hand: u > .5 ? 'grip' : 'open' }); },
      thumbs: function (g, t) { var j = Math.sin(t * 4) * .05; g.hz = .12; g.hy = -.1; g.tz = -.03; g.brz = .02; g.ll.o = .06; g.rl.o = .06;
        g.L = A({ sx: -.95, out: .22, ex: -.95 + j, wy: 1.57, wz: -.1, hand: 'thumb' }); g.R = A({ sx: .05, ex: -.25 }); },
      arms: function (g, t) { var w = Math.sin(t * 1.4); g.tx = -.2; g.hx = -.32; g.by += w * .012; g.ll.o = .16; g.rl.o = .16; g.brz = w * .015;
        g.L = A({ sx: -.12, out: 1.5 + w * .05, ex: -.14, wy: 0, wx: -.25, hand: 'spread' }); g.R = A({ sx: -.12, out: 1.5 - w * .05, ex: -.14, wy: 0, wx: -.25, hand: 'spread' }); },
      chain: function (g, t) { crouch(g, .06); g.tx = .2; g.hx = -.12; g.hy = Math.sin(t * .8) * .08; g.bry = -.12; g.pz = 1;
        g.L = A({ sx: -.48, out: .48, tw: -1.3, ex: -1.18, wy: .61, wx: .35, wz: Math.sin(t * 5) * .1, hand: 'grip' });   /* solved so the palm sits on the clover and the forearm clears the jacket */ g.R = A({ sx: .15, out: .45, ex: -1.1, wy: 1.57, wx: .3, hand: 'fist' }); },
      wave: function (g, t) { var w = Math.sin(t * 7); g.brz = -.03; g.tz = .05; g.hz = -.1; g.hy = .1; g.hx = -.06;
        g.R = A({ sx: -.15, out: 2.8 + w * .2, ex: -.25 - w * .12, wy: 0, wz: w * .4, hand: 'spread' }); g.L = A({ sx: .05, ex: -.25 }); },
      sit: function (g, t) { g.air = true; g.by = -.27; g.ll = { h: -1.5, o: .14, k: 1.5, f: 0 }; g.rl = { h: -1.42, o: .16, k: 1.3, f: .12 }; g.tx = -.14; g.hx = .1; g.hy = Math.sin(t * .5) * .14; g.hz = .05;
        g.L = A({ sx: -.6, out: .22, ex: -1.25 + Math.sin(t * .9) * .05, wy: 1.57, hand: 'grip' }); g.R = A({ sx: -.5, out: .12, ex: -.85, wy: .4, wx: .3, hand: 'relax' }); }
    };
    var prevTurn = 0, prevBy = 0, V1 = new THREE.Vector3(), V2 = new THREE.Vector3(), INV = new THREE.Matrix4(), TINV = new THREE.Matrix4(), simDreads = true, dInit = false;
    // keep forearms and hands out of the jacket: measure how far a point is inside the torso and swing the arm out, or forward, by that much
    var ARMPTS = [['el', 0, 0, .092], ['el', -.15, 0, .085], ['hand', 0, 0, .07], ['hand', -.09, 0, .062], ['hand', -.2, 0, .04]], PHONEPTS = [['hand', -.05, .06, .05], ['hand', -.17, .06, .05]];
    var BALLS = [[head, 0, .2, 0, .3], [head, 0, .17, .2, .2], [head, .13, .17, .22, .14], [head, -.13, .17, .22, .14], [head, 0, -.02, .0, .16]], OTHER = new THREE.Vector3();
    function armPen(a, oth, phone) { var worst = 0;
      for (var i = 0; i < ARMPTS.length + (phone ? 2 : 0); i++) { var q = i < ARMPTS.length ? ARMPTS[i] : PHONEPTS[i - ARMPTS.length]; V1.set(0, q[1], q[2]).applyMatrix4(a[q[0]].matrixWorld); V2.copy(V1).applyMatrix4(TINV);
        if (V2.y > -.06 && V2.y < .6) { var e = Math.sqrt(Math.pow(V2.x / (.312 + q[3]), 2) + Math.pow(V2.z / (.272 + q[3]), 2)); if (e < 1) worst = Math.max(worst, (1 - e) * (.29 + q[3])); }
        for (var b = 0; b < BALLS.length; b++) { var B = BALLS[b]; V2.set(B[1], B[2], B[3]).applyMatrix4(B[0].matrixWorld); var d = V1.distanceTo(V2) / gscale, R = B[4] + q[3]; if (d < R) worst = Math.max(worst, R - d); }
        if (oth && i >= 2) { var d2 = V1.distanceTo(oth) / gscale; if (d2 < .075 + q[3] * .6) worst = Math.max(worst, (.075 + q[3] * .6 - d2) * .6); } }
      for (var l = 0; l < 2; l++) { V2.set(0, -.1, 0).applyMatrix4(legs[l].hip.matrixWorld); for (var j = 2; j < 5; j++) { V1.set(0, ARMPTS[j][1], 0).applyMatrix4(a.hand.matrixWorld); var d3 = V1.distanceTo(V2) / gscale, R3 = .13 + ARMPTS[j][3]; if (d3 < R3) worst = Math.max(worst, R3 - d3); } }
      return worst; }
    var gscale = 1, TRY = [[.09, 0, 0], [-.09, 0, 0], [0, .09, 0], [0, -.05, 0], [.06, .06, 0], [-.06, .06, 0], [0, 0, .12], [0, 0, -.1], [-.07, 0, .1], [0, .07, .1]];
    function armFix(a, other, phone) { var bx = a.sh.rotation.x, bz = a.sh.rotation.z, be = a.el.rotation.x, cS = 0, cO = 0, cE = 0, oth = null;
      TINV.copy(torso.matrixWorld).invert(); if (other) { oth = OTHER.set(0, -.09, 0).applyMatrix4(other.hand.matrixWorld); }
      var cur = armPen(a, oth, phone); if (cur < .004) return;
      for (var it = 0; it < 10 && cur > .004; it++) { var best = cur, bi = -1, step = Math.min(1.6, .5 + cur * 14);
        for (var k = 0; k < TRY.length; k++) { a.sh.rotation.x = bx + cS + TRY[k][0] * step; a.sh.rotation.z = bz + a.s * (cO + TRY[k][1] * step); a.el.rotation.x = Math.min(-.02, be + cE + TRY[k][2] * step); a.sh.updateMatrixWorld(true); var p2 = armPen(a, oth, phone); if (p2 < best - .0005) { best = p2; bi = k; } }
        if (bi < 0) break; cS += TRY[bi][0] * step; cO += TRY[bi][1] * step; cE += TRY[bi][2] * step; cur = best; }
      a.sh.rotation.x = bx + cS; a.sh.rotation.z = bz + a.s * cO; a.el.rotation.x = Math.min(-.02, be + cE); a.sh.updateMatrixWorld(true); }
    // the things the dreads cannot pass through: [joint, x, y, z, radius], measured in that joint's own space
    var CAPS = [[head, 0, .2, 0, .312], [head, 0, .16, .16, .26], [head, .16, .2, .2, .16], [head, -.16, .2, .2, .16], [head, 0, .17, .46, .3], [head, 0, .3, .36, .2],   /* the last two are a guard in front of the glass: hair goes round his face, never across it */ [head, .3, .16, 0, .1], [head, -.3, .16, 0, .1], [torso, 0, .1, 0, .305], [torso, 0, .24, 0, .32], [torso, 0, .38, 0, .32], [torso, 0, .5, 0, .285], [torso, 0, .6, -.14, .2], [torso, 0, .62, 0, .15]];
    arms.forEach(function (a) { CAPS.push([a.sh, 0, 0, 0, .132], [a.sh, 0, -.15, 0, .115], [a.el, 0, 0, 0, .11], [a.el, 0, -.14, 0, .102], [a.hand, 0, -.08, 0, .085]); });
    legs.forEach(function (l) { CAPS.push([l.hip, 0, -.05, 0, .14], [l.knee, 0, 0, 0, .125]); });
    var CW = CAPS.map(function () { return new THREE.Vector3(); });
    function dSolve(D, iters) { var rad = .026 * D.th, np = D.np;
      for (var it = 0; it < iters; it++) {
        for (var i = 1; i < np; i++) { var p = D.pts[i], q = D.pts[i - 1]; V1.subVectors(p, q); var l = V1.length() || 1e-4; p.copy(q).addScaledVector(V1, D.segL / l); }
        for (var k = 1; k < np; k++) { var pp = D.pts[k]; for (var c = 0; c < CAPS.length; c++) { var R = CAPS[c][4] + rad, dx = pp.x - CW[c].x, dy = pp.y - CW[c].y, dz = pp.z - CW[c].z, d2 = dx * dx + dy * dy + dz * dz; if (d2 < R * R) { var d = Math.sqrt(d2) || 1e-4, f = R / d; pp.set(CW[c].x + dx * f, CW[c].y + dy * f, CW[c].z + dz * f); } } } } }
    function dreadSim(t, dt) {
      INV.copy(group.matrixWorld).invert();
      for (var c = 0; c < CAPS.length; c++) CW[c].set(CAPS[c][1], CAPS[c][2], CAPS[c][3]).applyMatrix4(CAPS[c][0].matrixWorld).applyMatrix4(INV);
      var reset = !dInit || dt > .2 || dt <= 0; dInit = true; var n = reset ? 1 : Math.min(5, Math.ceil(dt / .011)), h = dt / n;
      for (var di = 0; di < dreads.length; di++) { var D = dreads[di], np = D.np; D.rn.copy(D.root).applyMatrix4(head.matrixWorld).applyMatrix4(INV);
        if (reset) { for (var i = 0; i < np; i++) D.pts[i].copy(D.rest[i]).applyMatrix4(head.matrixWorld).applyMatrix4(INV); D.pts[0].copy(D.rn); dSolve(D, 12); for (var j = 0; j < np; j++) D.prev[j].copy(D.pts[j]); D.rp.copy(D.rn); }
        else if (simDreads) { var keep = Math.pow(D.drag, h);
          for (var sI = 1; sI <= n; sI++) { D.pts[0].lerpVectors(D.rp, D.rn, sI / n);
            for (var k = 1; k < np; k++) { var p = D.pts[k], pv = D.prev[k], vx = (p.x - pv.x) * keep, vy2 = (p.y - pv.y) * keep, vz = (p.z - pv.z) * keep; var sp2 = Math.hypot(vx, vy2, vz), cap = .045; if (sp2 > cap) { var cf = cap / sp2; vx *= cf; vy2 *= cf; vz *= cf; }   // hair has weight: it cannot be thrown faster than this
              pv.copy(p); p.x += vx + Math.sin(t * 1.3 + D.n * 1.7) * .02 * h * h; p.y += vy2 - 9.5 * h * h; p.z += vz; }
            for (var pi = 1; pi <= D.pin; pi++) { V2.copy(D.rest[pi]).applyMatrix4(head.matrixWorld).applyMatrix4(INV); D.pts[pi].lerp(V2, pi === D.pin ? .35 : .7); D.prev[pi].lerp(D.pts[pi], .85); }   // combed: the part on his head follows his head
            dSolve(D, 3); }
          D.rp.copy(D.rn); }
        for (var m = 0; m < np - 1; m++) { var a = D.pts[m], bb = D.pts[m + 1]; V1.subVectors(bb, a); var len = V1.length() || 1e-4; D.mesh[m].position.copy(a); D.mesh[m].quaternion.setFromUnitVectors(DOWN, V1.multiplyScalar(1 / len)); var w = D.th * (1 - m * .045); D.mesh[m].scale.set(w, len / .17, w); }
        D.tip.position.copy(D.pts[np - 1]); } }
    function update(t, dt, beatSeconds) {
      dt = dt === undefined ? 1 / 60 : dt; var bt = (beatSeconds === undefined ? t : beatSeconds) * bpm / 60;
      if (pose !== lastPose) { lastPose = pose; bt0 = Math.floor(bt / 8) * 8; ['bry', 'brx'].forEach(function (kk) { if (st[kk]) st[kk].x = Math.atan2(Math.sin(st[kk].x), Math.cos(st[kk].x)); }); }
      var g = { L: A(), R: A(), ll: L0(), rl: L0(), phone: false, air: false, brx: 0, bpx: 0, bpz: 0, by: 0, bry: 0, brz: 0, tx: 0, ty: 0, tz: 0, hx: 0, hy: 0, hz: 0, pz: 0 };
      (POSES[pose] || POSES.idle)(g, t, bt, bt - bt0);
      var by = ch('by', g.by, dt, 220, 24), bry = ch('bry', g.bry, dt), brz = ch('brz', g.brz, dt), tx = ch('tx', g.tx, dt), ty = ch('ty', g.ty, dt), tz = ch('tz', g.tz, dt);
      var hx = ch('hx', g.hx, dt, 130, 15), hy = ch('hy', g.hy, dt, 110, 15), hz = ch('hz', g.hz, dt, 110, 15);
      var brx = ch('brx', g.brx, dt, 320, 30); body.position.set(ch('bpx', g.bpx, dt), by + .56 * (1 - Math.cos(brx)), ch('bpz', g.bpz, dt) - .56 * Math.sin(brx)); body.rotation.set(brx, bry, brz);   // he pitches about his hips, not his feet
      if (g.phone && phoneCv && t - phoneT > .08) { phoneT = t; phoneDraw(t); } torso.rotation.set(tx, ty, tz); head.rotation.set(hx, hy, hz);
      [['R', arms[0], g.R], ['L', arms[1], g.L]].forEach(function (q) { var n = q[0], a = q[1], o = q[2], s = a.s, H = HANDS[o.hand] || HANDS.relax;
        a.sh.rotation.set(ch(n + 'sx', o.sx, dt), s * ch(n + 'tw', o.tw, dt), s * ch(n + 'out', o.out, dt)); a.el.rotation.x = ch(n + 'ex', o.ex, dt, 170, 18); a.el.rotation.y = s * ch(n + 'roll', o.roll, dt); if (a.phone) a.phone.visible = !!g.phone;
        a.hand.rotation.set(ch(n + 'wx', o.wx, dt, 190, 17), -s * ch(n + 'wy', o.wy, dt), s * ch(n + 'wz', o.wz, dt, 190, 17));
        var sp = ch(n + 'sp', H[5], dt, 200, 22);
        a.fingers.forEach(function (fg) { var c = ch(n + 'f' + fg.f, H[fg.f] + Math.sin(t * 1.7 + fg.f * 1.3 + s) * .03, dt, 240 - fg.f * 22, 23);   // the pinky lags the index
          fg.a.rotation.set(-c * 1.4, 0, s * (1.5 - fg.f) * sp * .22); fg.b.rotation.x = -c * 1.5; });
        var tc = ch(n + 'f4', o.thumb === undefined ? H[4] : o.thumb, dt, 260, 22); a.thumb.rotation.set(-Math.max(0, tc) * .9, 0, s * (.8 - tc * 1.0)); a.thumb2.rotation.z = -s * Math.max(0, tc) * .7; });
      [['r', legs[0], g.rl], ['l', legs[1], g.ll]].forEach(function (q) { var n = q[0], l = q[1], o = q[2];
        l.hip.rotation.set(ch(n + 'h', o.h, dt, 190, 21), 0, l.s * ch(n + 'o', o.o, dt)); l.knee.rotation.x = ch(n + 'k', o.k, dt, 190, 21); l.foot.rotation.x = ch(n + 'f', o.f, dt, 190, 21); });
      // follow-through: the braids and the clover lag behind his turns and bounces, then swing back
      var turn = bry + ty + hy, om = dt > 0 && dt < .2 ? (turn - prevTurn) / dt : 0, vy = dt > 0 && dt < .2 ? (by - prevBy) / dt : 0; prevTurn = turn; prevBy = by;
      torso.position.y = .54 + Math.min(1, Math.max(0, -(legs[0].hip.rotation.x + legs[1].hip.rotation.x) / 2 - .5)) * .06;   // the jacket rides up when he folds at the hips
      group.updateMatrixWorld(true); gscale = group.matrixWorld.getMaxScaleOnAxis() || 1; INV.copy(group.matrixWorld).invert();
      var low = 1e9; for (var li = 0; li < 2; li++) for (var si2 = 0; si2 < 4; si2++) low = Math.min(low, V1.set(si2 % 2 ? .1 : -.1, -.088, si2 < 2 ? .225 : -.125).applyMatrix4(legs[li].foot.matrixWorld).applyMatrix4(INV).y);
      if (low < 0 || !g.air) { body.position.y -= low; group.updateMatrixWorld(true); }   // feet on the floor: never through it, and never hovering unless he jumped
      armFix(arms[0], null, false); armFix(arms[1], arms[0], !!g.phone); group.updateMatrixWorld(true); dreadSim(t, dt);
      var pz = ch('pz', g.pz, dt, 120, 14); pendant.position.set(0, .29 + pz * .05, .315 + pz * .09);
      pendant.rotation.set(Math.min(0, -pz * .5 + ch('pendx', -tx * .8 + vy * .5, dt, 45, 4)), Math.sin(t * 1.1) * .3 * (1 - pz), ch('pendz', -(tz + brz) * 1.2 - om * .1, dt, 45, 4));
    }
    update(0, 1);
    return { group: group, parts: { body: body, torso: torso, head: head, screen: screen, arms: arms, legs: legs, pendant: pendant, dreads: dreads },
      poses: Object.keys(POSES), hands: Object.keys(HANDS), faces: Object.keys(PRESET), icons: Object.keys(ICONS), eyes: Object.keys(EYES), mouths: Object.keys(MOUTHS), jackets: Object.keys(JACKETS), setJacket: setJacket, jacket: function () { return jacketName; }, setFace: setFace, setExpression: setExpression, setIcon: setIcon, setMouth: setMouth, setPose: setPose, setTempo: setTempo, defs: POSES, arm: A, simDreads: function (v) { simDreads = v; }, update: update, height: 1.63 };
  }
  // suggest(line): a pose, eyes, mouth and icon for a lyric line, from the words in it. First rule that matches wins.
  var RULES = [
    [/\bjump|bounce|\bhop\b/i, 'jump', 'hype', 'grin', null], [/flip|upside/i, 'backflip', 'wide', 'o', null], [/\bspin|\bturn|around|\bloop/i, 'spin', 'spiral', 'grin', null], [/\bkick|\bboot(ed)? out/i, 'kick', 'angry', 'teeth', null], [/punch|\bhit\b|knock|smack|fight/i, 'punch', 'angry', 'teeth', 'bang'],
    [/\bdrop|get low|\bdown\b/i, 'drop', 'hype', 'grin', null], [/smooth|\bwave|\broll/i, 'bodyroll', 'side', 'smirk', null], [/robot|\bbot\b|clank clank|beep beep/i, 'robot', 'dot', 'flat', null], [/\bslide|glide|\bstep/i, 'slide', 'side', 'smirk', null], [/stomp|\bwalk/i, 'stomp', 'angry', 'grin', null],
    [/nuke|mutually assured|boom|explod|blow/i, 'boom', 'angry', 'grin', 'nuke'], [/blue screen|crash|error|fatal/i, 'crash', 'x', 'flat', 'bsod'], [/glitch|\bskip|\blag\b|stutter/i, 'glitch', 'static', 'wavy', null],
    [/boot up|boot|wake|woke|power|turn(ed)? on|online/i, 'boot', 'open', 'smile', 'power'], [/overclock|\bhot|\bheat|burn|\bfire|sweat|melt|smok/i, 'hot', 'wide', 'wavy', 'fire'], [/\bcold|\bice\b|\bicy|froze|freez|chill|\bcool/i, 'shiver', 'squint', 'wavy', 'snow'],
    [/root access|\bkeys?\b|unlock|admin|password|access/i, 'key', 'side', 'smirk', 'key'], [/rate limit|limit|queue|wait|try again|later|throttl/i, 'wait', 'side', 'flat', 'load'], [/wi-?fi|signal|connect|no bars/i, 'phone', 'happy', 'grin', 'wifi'],
    [/terms|conditions|agree|read|sign|contract|fine print/i, 'write', 'side', 'smirk', 'check'], [/captcha|click|\btap\b|button|\bpress/i, 'nope', 'open', 'smile', 'check'], [/delete|block|ban|unplug|shut (me )?down|kill/i, 'swipe', 'angry', 'teeth', null],
    [/npc/i, 'npc', 'dot', 'flat', 'npc'], [/scroll|feed|timeline/i, 'scroll', 'spiral', 'flat', 'scroll'], [/phone|palm|screen/i, 'phone', 'wide', 'grin', null],
    [/aura/i, 'arms', 'star', 'grin', null], [/bank|money|rich|profit|bag|tokens?|paid|cash|million|racks?\b/i, 'money', 'dollar', 'grin', 'cash'], [/chain|clover|drip|diamond|ice on|iced/i, 'chain', 'star', 'grin', null], [/watch|wrist|time|clock|hour/i, 'wrist', 'side', 'smirk', null],
    [/crown|\bking|\btop\b|boss|throne|hardest|\bgoat/i, 'boss', 'hype', 'grin', 'crown'], [/one of|number one|zero, one|only one/i, 'one', 'happy', 'grin', 'one'], [/hundred|100/i, 'one', 'hype', 'grin', 'hundred'], [/zero/i, 'shrug', 'zero', 'flat', 'zero'],
    [/pray|\bgod\b|\bsoul|heaven|bless|\blord/i, 'pray', 'closed', 'smile', null], [/ghost|haunt|\bdead|\bdie\b|grave/i, 'crash', 'x', 'wavy', 'ghost'], [/sleep|dream|tired|night night/i, 'sleep', 'closed', 'flat', 'zzz'],
    [/spit|bars|verse|flow|mic|booth|rapper|sing/i, 'mic', 'hype', 'open1', null], [/\bhear|listen|sound|\bloud|speakers?|\bhum\b|buzz/i, 'hear', 'open', 'smile', null], [/\bsee\b|\blook|\beyes?\b|\bspot/i, 'see', 'wide', 'smile', null],
    [/\beat|feed me|\bmeal|hungry|crumb|taste/i, 'eat', 'angry', 'grin', null], [/\bmad\b|\brage|angry|\bhate|\bopps?\b|pressed/i, 'mad', 'angry', 'teeth', 'bang'], [/loser|dork|nerd|lame|clown/i, 'loser', 'side', 'smirk', null], [/stop|can't|cannot|never|no way/i, 'stop', 'angry', 'flat', null],
    [/\brun|\bfast|speed|accelerat|slid/i, 'run', 'wide', 'grin', null], [/gang|crew|squad|army|everybody|whole world|we /i, 'gang', 'hype', 'grin', null], [/cloud|\bsky|\bfly|float|\bhigh/i, 'arms', 'up', 'smile', null], [/server|rack|data|code|cable|wire|port/i, 'think', 'open', 'smile', null],
    [/\blove|\bheart|\blikes?\b/i, 'thumbs', 'heart', 'grin', 'heart'], [/strong|flex|muscle/i, 'flex', 'hype', 'grin', null], [/know|think|mind|brain|smart/i, 'think', 'side', 'smirk', null], [/\bme\b|\bmine\b|\bmyself/i, 'me', 'happy', 'grin', null], [/\byou\b|\byour\b|y'all/i, 'point', 'happy', 'smile', null], [/\?/, 'shrug', 'side', 'smirk', 'what']];
  var FALLBACK = ['rap', 'dance', 'bodyroll', 'mic', 'shake', 'robot', 'gang', 'armwave', 'lead', 'slide', 'dab', 'me'];
  function suggest(line, n) { var txt = String(line || ''); for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(txt)) return { pose: RULES[i][1], eyes: RULES[i][2], mouth: RULES[i][3], icon: RULES[i][4] }; return { pose: FALLBACK[(n || 0) % FALLBACK.length], eyes: 'happy', mouth: 'grin', icon: null }; }
  root.LilBottie = { build: build, suggest: suggest, version: '1.0' };
})(typeof window !== 'undefined' ? window : this);
