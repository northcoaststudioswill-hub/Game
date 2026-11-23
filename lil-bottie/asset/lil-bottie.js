/* lil Bottie — the 3D asset, in the Grok Fable Astra style (blocky, low-poly, flat shaded).
   Standalone: needs only three.js (r128). Not wired into any game yet.

   const b = LilBottie.build(THREE);      // b.group is a THREE.Group, about 1.5 units tall (feet at y=0)
   scene.add(b.group); b.group.scale.setScalar(2.2);   // 2.2 is the size the game uses for people
   b.setFace('smile');                    // smile, talk1, talk2, wink, hype, dead, btv
   b.setMouth(0..1);                      // lip sync: 0 closed smile, 1 wide open
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
      var hip = new THREE.Group(); hip.position.set(s * .13, .42, 0); body.add(hip);
      hip.add(new THREE.Mesh(bake([P(Cyl(.125, .112, .2, 8), PANT, M(0, -.1, 0, 0, 0, 0, 1, 1, 1.1)), P(Box(.012, .2, .03), PANT2, M(s * .118, -.1, 0)), P(Box(.09, .07, .02), PANT2, M(s * .03, -.07, .128))]), clothM));   // thigh, side seam, pocket
      var knee = new THREE.Group(); knee.position.y = -.2; hip.add(knee);
      knee.add(new THREE.Mesh(bake([P(Sph(.112, 8, 6), PANT, M(0, 0, 0, 0, 0, 0, 1, .8, 1.1)), P(Sph(.075, 8, 6), KNEE, M(0, -.005, .075, 0, 0, 0, 1.1, .9, .55)), P(Box(.15, .012, .02), PANT2, M(0, .045, .1)), P(Box(.15, .012, .02), PANT2, M(0, -.055, .1)),
        P(Cyl(.108, .1, .13, 8), PANT, M(0, -.075, 0, 0, 0, 0, 1, 1, 1.08)), P(Cyl(.112, .116, .035, 8), PANT2, M(0, -.125, 0, 0, 0, 0, 1, 1, 1.1)), P(Cyl(.116, .11, .035, 8), PANT, M(0, -.155, 0, 0, 0, 0, 1, 1, 1.1)), P(Box(.012, .15, .03), PANT2, M(s * .104, -.08, 0))]), clothM));   // kneecap, creases, shin, stacked cuffs
      var foot = new THREE.Group(); foot.position.y = -.17; knee.add(foot);
      foot.add(new THREE.Mesh(bake([P(Box(.2, .085, .26), 0x16161c, M(0, -.02, .02)), P(Box(.2, .07, .1), 0x2a2a34, M(0, -.03, .18)), P(Box(.15, .05, .09), 0x16161c, M(0, .03, .07, -.5)), P(Box(.19, .04, .05), 0x2a2a34, M(0, .0, -.12))]), clothM));
      foot.add(new THREE.Mesh(bake([P(Box(.215, .032, .36), 0xdfe4ee, M(0, -.072, .05)), P(Box(.05, .05, .012), CHROME, M(0, .0, -.148)), P(Box(.1, .012, .012), 0xdfe4ee, M(0, .035, .1)), P(Box(.1, .012, .012), 0xdfe4ee, M(0, .05, .075)), P(Box(.012, .03, .12), CHROME2, M(s * .102, -.02, .03))]), chromeM));   // sole, heel tab, laces, side stripe
      legs.push({ hip: hip, knee: knee, foot: foot, s: s });
    });

    // ---- torso: black hoodie core, silver puffer over it, open down the front
    var torso = new THREE.Group(); torso.position.y = .4; body.add(torso);
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
    torso.add(new THREE.Mesh(bake(J), pufferM));

    // ---- arms: shoulder, elbow, wrist; four fingers with two joints each, and a thumb
    var fA = bake([P(Box(.026, .055, .03), CHROME, M(0, -.0275, 0)), P(Box(.031, .013, .035), 0x4a4e58, M(0, -.003, 0))]);
    var fB = bake([P(Box(.023, .048, .027), CHROME2, M(0, -.024, 0)), P(Box(.028, .011, .032), 0x4a4e58, M(0, -.003, 0)), P(Box(.017, .012, .02), 0xeef2f8, M(0, -.05, .002))]);
    var tA = bake([P(Box(.033, .05, .035), CHROME, M(0, -.025, 0)), P(Box(.037, .013, .039), 0x4a4e58, M(0, -.003, 0))]);
    var tB = bake([P(Box(.028, .044, .03), CHROME2, M(0, -.022, 0)), P(Box(.032, .011, .034), 0x4a4e58, M(0, -.003, 0))]);
    var arms = [];
    [-1, 1].forEach(function (s) {
      var sh = new THREE.Group(); sh.position.set(s * .36, .5, 0); torso.add(sh);
      var up = [P(Sph(.125, 8, 6), SILVER, M(0, -.01, 0)), P(Cyl(.115, .11, .12, 8), SILVER2, M(0, -.11, 0)), P(Cyl(.11, .105, .11, 8), SILVER, M(0, -.225, 0))];
      sh.add(new THREE.Mesh(bake(up), pufferM));
      var el = new THREE.Group(); el.position.y = -.29; sh.add(el);
      el.add(new THREE.Mesh(bake([P(Sph(.1, 8, 6), SILVER2, M(0, 0, 0)), P(Cyl(.105, .1, .11, 8), SILVER2, M(0, -.06, 0)), P(Cyl(.1, .09, .11, 8), SILVER, M(0, -.165, 0))]), pufferM));
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
      arms.push({ sh: sh, el: el, hand: hg, fingers: fingers, thumb: th, thumb2: th2, s: s });
    });

    // ---- neck: ribbed chrome
    var N = []; for (var i = 0; i < 4; i++) N.push(P(Cyl(.085 - (i % 2) * .012, .085 - (i % 2) * .012, .034, 10), i % 2 ? CHROME2 : CHROME, M(0, .585 + i * .034, 0)));
    torso.add(new THREE.Mesh(bake(N), chromeM));

    // ---- head: riveted chrome dome, ear cups, a black screen with the LED face
    var head = new THREE.Group(); head.position.y = .725; head.scale.setScalar(.93); torso.add(head);
    var Hh = [P(new THREE.SphereGeometry(.3, 12, 8, 0, TAU, 0, Math.PI * .62), CHROME, M(0, .2, 0)), P(Cyl(.285, .26, .12, 12), CHROME2, M(0, .07, 0)), P(Cyl(.2, .16, .06, 10), CHROME2, M(0, 0, 0))];
    for (var rr = 0; rr < 3; rr++) for (var q = 0; q < 14; q++) { var ra = q / 14 * TAU + rr * .22, el2 = .5 + rr * .42, rx = Math.sin(ra) * Math.sin(el2) * .3, ry = .2 + Math.cos(el2) * .3, rz = Math.cos(ra) * Math.sin(el2) * .3; if (rz > .16 && ry < .34) continue; Hh.push(P(Sph(.016, 5, 4), 0xeef2f8, M(rx, ry, rz))); }
    [-1, 1].forEach(function (s) { Hh.push(P(Cyl(.085, .085, .06, 12), CHROME2, M(s * .29, .16, 0, 0, 0, Math.PI / 2)), P(Cyl(.05, .05, .07, 10), 0x4a4e58, M(s * .3, .16, 0, 0, 0, Math.PI / 2))); });
    Hh.push(P(Box(.46, .34, .06), CHROME2, M(0, .17, .255)), P(Box(.41, .29, .07), 0x050508, M(0, .17, .262)));   // bezel and glass
    Hh.push(P(Box(.48, .035, .09), CHROME, M(0, .355, .25, .25)), P(Box(.3, .07, .1), CHROME2, M(0, -.035, .2)), P(Box(.22, .03, .11), 0x4a4e58, M(0, -.035, .205)), P(Box(.02, .3, .02), 0x7a808c, M(0, .36, 0, 0, 0, 0, 1, 1, 14)));   // brow ridge, jaw, vent, centre seam
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) { Hh.push(P(Sph(.014, 5, 4), 0xeef2f8, M(c[0] * .215, .17 + c[1] * .155, .29))); });   // bezel bolts
    [-1, 1].forEach(function (s) { Hh.push(P(Cyl(.03, .03, .08, 8), CHROME, M(s * .31, .16, 0, 0, 0, Math.PI / 2)), P(Box(.02, .1, .02), CHROME2, M(s * .27, .3, .02, 0, 0, s * -.5))); });   // ear cup hub and band
    head.add(new THREE.Mesh(bake(Hh), chromeM));
    var faceCv = document.createElement('canvas'); faceCv.width = 160; faceCv.height = 112;
    var faceTx = new THREE.CanvasTexture(faceCv); faceTx.magFilter = THREE.LinearFilter;
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(.39, .273), new THREE.MeshBasicMaterial({ map: faceTx, fog: false }));
    screen.position.set(0, .17, .2985); head.add(screen);

    // ---- dreads: each one is a chain of five points joined by four segments. The points are simulated (they have
    //      weight and momentum) and are pushed out of the head, jacket, hood, shoulders and arms, so they drape
    //      over him and cannot pass through him.
    var dreadGeo = bake([P(Cyl(.021, .019, .09, 5), 0x101014, M(0, -.045, 0)), P(Cyl(.019, .02, .08, 5), 0x1a1a22, M(0, -.13, 0)), P(Cyl(.023, .023, .014, 5), 0x2a2a36, M(0, -.088, 0))]);   // one segment, .17 long
    var tipGeo = bake([P(Sph(.022, 5, 4), 0x30303c, M(0, -.012, 0))]);
    var dreadLayer = new THREE.Group(); group.add(dreadLayer);
    var dreads = [], dseed = 7, DOWN = new THREE.Vector3(0, -1, 0);
    function drand() { dseed = (dseed * 16807) % 2147483647; return dseed / 2147483647; }
    function dread(a, len) {
      var D = { a: a, root: new THREE.Vector3(Math.sin(a) * .25, .07, Math.cos(a) * .25), segL: len / 4, th: .9 + drand() * .4, pts: [], prev: [], mesh: [], drag: .25 + drand() * .2, n: dreads.length, rp: new THREE.Vector3(), rn: new THREE.Vector3() };
      for (var i = 0; i < 5; i++) { D.pts.push(new THREE.Vector3()); D.prev.push(new THREE.Vector3()); }
      for (var j = 0; j < 4; j++) { var m = new THREE.Mesh(dreadGeo, clothM); dreadLayer.add(m); D.mesh.push(m); }
      D.tip = new THREE.Mesh(tipGeo, clothM); D.tip.scale.setScalar(D.th); dreadLayer.add(D.tip); dreads.push(D);
    }
    for (var b = 0; b < 19; b++) dread(Math.PI * .4 + b / 18 * Math.PI * 1.2, .64 + ((b * 7) % 5) * .05);
    [-1, 1].forEach(function (s) { dread(s * 1.0, .7); dread(s * 1.22, .78); dread(s * .8, .5); });

    // ---- the chain and the iced clover
    var C = []; for (var c = 0; c < 15; c++) { var u = c / 14, ca = (u - .5) * 2.2, cx = Math.sin(ca) * .17, cy = .55 - Math.cos(ca) * .13 - Math.pow(1 - Math.abs(u - .5) * 2, 1.4) * .14, cz = .2 + Math.cos(ca) * .1; C.push(P(Sph(.015, 6, 4), c % 2 ? ICE : 0xc8ced8, M(cx, cy, cz, 0, 0, 0, 1.2, .7, 1))); }
    torso.add(new THREE.Mesh(bake(C), iceM));
    var pendant = new THREE.Group(); pendant.position.set(0, .29, .315); torso.add(pendant);
    var K = [P(Cyl(.014, .014, .05, 6), 0xc8ced8, M(0, .0, 0))], LOB = [[0, -.07], [-.066, -.136], [.066, -.136], [0, -.202]];
    LOB.forEach(function (o) { K.push(P(Cyl(.066, .066, .018, 12), 0x8a909c, M(o[0], o[1], -.004, Math.PI / 2)), P(Cyl(.056, .05, .022, 12), ICE, M(o[0], o[1], .012, Math.PI / 2))); });
    K.push(P(Cyl(.03, .026, .03, 8), 0xe8ecf4, M(0, -.136, .018, Math.PI / 2)));
    LOB.forEach(function (o, n) { for (var d = 0; d < 6; d++) { var da = d / 6 * TAU + n; K.push(P(Sph(.011, 4, 3), d % 2 ? 0xffffff : 0xb8c0d0, M(o[0] + Math.sin(da) * .03, o[1] + Math.cos(da) * .03, .026))); } });
    pendant.add(new THREE.Mesh(bake(K), iceM));

    // ---- the LED face: a 20 x 14 dot matrix, drawn to a canvas
    var FACES = {
      smile: ['....................', '....................', '....................', '....##.......##.....', '...#..#.....#..#....', '..#....#...#....#...', '....................', '....................', '.....#........#.....', '......#......#......', '.......######.......', '....................', '....................', '....................'],
      talk1: ['....................', '....................', '....................', '....##.......##.....', '...#..#.....#..#....', '..#....#...#....#...', '....................', '....................', '......########......', '......#......#......', '.......######.......', '....................', '....................', '....................'],
      talk2: ['....................', '....................', '....................', '....##.......##.....', '...#..#.....#..#....', '..#....#...#....#...', '....................', '.......######.......', '......#......#......', '......#......#......', '......#......#......', '.......######.......', '....................', '....................'],
      wink: ['....................', '....................', '....................', '....##..............', '...#..#.............', '..#....#...######...', '....................', '....................', '.....#........#.....', '......#......#......', '.......######.......', '....................', '....................', '....................'],
      hype: ['....................', '....................', '..#....#...#....#...', '...#..#.....#..#....', '....##.......##.....', '....................', '....................', '.....##########.....', '.....#........#.....', '......#......#......', '.......######.......', '....................', '....................', '....................'],
      dead: ['....................', '....................', '..#...#.....#...#...', '...#.#.......#.#....', '....#.........#.....', '...#.#.......#.#....', '..#...#.....#...#...', '....................', '....................', '......########......', '....................', '....................', '....................', '....................'],
      btv: ['....................', '....................', '....................', '.###..#####.#...#...', '.#..#...#...#...#...', '.#..#...#...#...#...', '.###....#...#...#...', '.#..#...#....#.#....', '.#..#...#....#.#....', '.###....#.....#.....', '....................', '....................', '....................', '....................']
    };
    var faceName = '';
    function setFace(name) {
      if (!FACES[name] || name === faceName) return; faceName = name;
      var g = faceCv.getContext('2d'), rows = FACES[name], cw = 160 / 20, ch = 112 / 14;
      g.fillStyle = '#04050a'; g.fillRect(0, 0, 160, 112);
      for (var yy = 0; yy < 14; yy++) for (var xx = 0; xx < 20; xx++) {
        var on = rows[yy][xx] === '#', px = xx * cw + cw / 2, py = yy * ch + ch / 2;
        g.fillStyle = on ? '#4fb4ff' : '#0a0e1a'; g.beginPath(); g.arc(px, py, on ? 3.7 : 1.2, 0, TAU); g.fill();
        if (on) { g.fillStyle = 'rgba(80,170,255,.34)'; g.beginPath(); g.arc(px, py, 7, 0, TAU); g.fill(); g.fillStyle = '#e6f6ff'; g.beginPath(); g.arc(px, py, 1.7, 0, TAU); g.fill(); }
      }
      faceTx.needsUpdate = true;
    }
    function setMouth(v) { setFace(v > .62 ? 'talk2' : v > .25 ? 'talk1' : 'smile'); }
    setFace('smile');

    // ---- poses and motion. Every joint is a spring chasing a target, so moves overshoot a little and settle.
    var pose = 'idle', bpm = 137.2, st = {};
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
    var HANDS = { open: [0, 0, 0, 0, 0, .2], relax: [.22, .28, .34, .4, .25, .05], fist: [1, 1, 1, 1, .9, 0], point: [0, 1, 1, 1, .9, 0], thumb: [1, 1, 1, 1, -.55, 0], peace: [0, 0, 1, 1, .9, .45], grip: [.6, .6, .62, .66, .3, 0], spread: [0, 0, 0, 0, -.25, .6], horns: [0, 1, 1, 0, .9, .25] };
    function A(o) { var r = { sx: .05, out: .13, tw: 0, ex: -.2, wx: 0, wy: 1.2, wz: 0, hand: 'relax' }; for (var k in o) r[k] = o[k]; return r; }
    function L0() { return { h: -.05, o: .03, k: .1, f: -.05 }; }   // knees never lock straight
    function frac(x) { return ((x % 1) + 1) % 1; }
    function crouch(g, c) { g.ll.h -= c; g.rl.h -= c; g.ll.k += 2 * c; g.rl.k += 2 * c; g.ll.f -= c; g.rl.f -= c; g.by -= .455 * (1 - Math.cos(c)); }
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
        g.L = A({ sx: -1.5 + j, out: .12, ex: -.08, wy: 1.57, hand: 'point' }); g.R = A({ sx: .25, out: .5, ex: -1.25, wy: 1.57, wx: .3, hand: 'fist' }); },
      shake: function (g, t, bt) { var b = Math.exp(-5 * frac(bt)), sd = Math.sin(bt * Math.PI), bar = Math.floor(bt / 8) % 2;   // head side to side on the beat (or a headbang, every other bar): this is the one that throws the dreads
        crouch(g, .14 + .14 * b); g.ll.o = .12; g.rl.o = .12; g.tx = .1 + b * .06;
        if (!bar) { g.hy = sd * .8; g.hz = sd * .18; g.hx = .1; g.ty = sd * .18; g.brz = sd * .04; } else { g.hx = -.25 + b * .75; g.tx = .05 + b * .2; g.hy = sd * .12; }
        g.L = A({ sx: -.5, out: .3, ex: -1.35 + b * .35, wy: 1.4, hand: 'fist' }); g.R = A({ sx: -.5, out: .3, ex: -1.35 + b * .35, wy: 1.4, hand: bar ? 'horns' : 'fist' }); },
      thumbs: function (g, t) { var j = Math.sin(t * 4) * .05; g.hz = .12; g.hy = -.1; g.tz = -.03; g.brz = .02; g.ll.o = .06; g.rl.o = .06;
        g.L = A({ sx: -.95, out: .22, ex: -.95 + j, wy: 1.57, wz: -.1, hand: 'thumb' }); g.R = A({ sx: .05, ex: -.25 }); },
      arms: function (g, t) { var w = Math.sin(t * 1.4); g.tx = -.2; g.hx = -.32; g.by += w * .012; g.ll.o = .16; g.rl.o = .16; g.brz = w * .015;
        g.L = A({ sx: -.12, out: 1.5 + w * .05, ex: -.14, wy: 0, wx: -.25, hand: 'spread' }); g.R = A({ sx: -.12, out: 1.5 - w * .05, ex: -.14, wy: 0, wx: -.25, hand: 'spread' }); },
      chain: function (g, t) { crouch(g, .06); g.tx = .2; g.hx = -.12; g.hy = Math.sin(t * .8) * .08; g.bry = -.12; g.pz = 1;
        g.L = A({ sx: -.48, out: .48, tw: -1.3, ex: -1.18, wy: .61, wx: .35, wz: Math.sin(t * 5) * .1, hand: 'grip' });   /* solved so the palm sits on the clover and the forearm clears the jacket */ g.R = A({ sx: .15, out: .45, ex: -1.1, wy: 1.57, wx: .3, hand: 'fist' }); },
      wave: function (g, t) { var w = Math.sin(t * 7); g.brz = -.03; g.tz = .05; g.hz = -.1; g.hy = .1; g.hx = -.06;
        g.R = A({ sx: -.15, out: 2.8 + w * .2, ex: -.25 - w * .12, wy: 0, wz: w * .4, hand: 'spread' }); g.L = A({ sx: .05, ex: -.25 }); },
      sit: function (g, t) { g.by = -.2; g.ll = { h: -1.5, o: .14, k: 1.5, f: 0 }; g.rl = { h: -1.42, o: .16, k: 1.3, f: .12 }; g.tx = -.14; g.hx = .1; g.hy = Math.sin(t * .5) * .14; g.hz = .05;
        g.L = A({ sx: -.6, out: .22, ex: -1.25 + Math.sin(t * .9) * .05, wy: 1.57, hand: 'grip' }); g.R = A({ sx: -.5, out: .12, ex: -.85, wy: .4, wx: .3, hand: 'relax' }); }
    };
    var prevTurn = 0, prevBy = 0, V1 = new THREE.Vector3(), INV = new THREE.Matrix4(), TINV = new THREE.Matrix4(), simDreads = true, dInit = false;
    // keep forearms and hands out of the jacket: measure how far a point is inside the torso and swing the arm out, or forward, by that much
    var ARMPTS = [['el', 0, .105], ['el', -.15, .095], ['hand', 0, .07], ['hand', -.09, .062], ['hand', -.2, .04]];
    function armFix(a) { var bx = a.sh.rotation.x, bz = a.sh.rotation.z, cOut = 0, cSx = 0;
      TINV.copy(torso.matrixWorld).invert();
      for (var it = 0; it < 6; it++) { var worst = 0, wx = 0, wz = 0;
        for (var i = 0; i < ARMPTS.length; i++) { var q = ARMPTS[i]; V1.set(0, q[1], 0).applyMatrix4(a[q[0]].matrixWorld).applyMatrix4(TINV); if (V1.y < -.06 || V1.y > .6) continue;
          var e = Math.sqrt(Math.pow(V1.x / (.345 + q[2]), 2) + Math.pow(V1.z / (.3 + q[2]), 2)); if (e < 1) { var pen = (1 - e) * (.32 + q[2]); if (pen > worst) { worst = pen; var l = Math.hypot(V1.x, V1.z) || 1; wx = V1.x / l; wz = V1.z / l; if (l < .02) { wx = 0; wz = 1; } } } }
        if (worst < .004) break;
        if (wz > .55) cSx -= worst * 1.7; else if (wz < -.55) cSx += worst * 1.7; else cOut += worst * 1.9;
        a.sh.rotation.x = bx + cSx; a.sh.rotation.z = bz + a.s * cOut; a.sh.updateMatrixWorld(true); } }
    // the things the dreads cannot pass through: [joint, x, y, z, radius], measured in that joint's own space
    var CAPS = [[head, 0, .2, 0, .25], [head, 0, .17, .16, .22], [torso, 0, .1, 0, .335], [torso, 0, .24, 0, .355], [torso, 0, .38, 0, .355], [torso, 0, .5, 0, .31], [torso, 0, .6, -.14, .2], [torso, 0, .62, 0, .15]];
    arms.forEach(function (a) { CAPS.push([a.sh, 0, 0, 0, .15], [a.sh, 0, -.15, 0, .13], [a.el, 0, 0, 0, .125], [a.el, 0, -.14, 0, .115], [a.hand, 0, -.08, 0, .085]); });
    legs.forEach(function (l) { CAPS.push([l.hip, 0, -.05, 0, .14], [l.knee, 0, 0, 0, .125]); });
    var CW = CAPS.map(function () { return new THREE.Vector3(); });
    function dSolve(D, iters) { var rad = .024 * D.th;
      for (var it = 0; it < iters; it++) {
        for (var i = 1; i < 5; i++) { var p = D.pts[i], q = D.pts[i - 1]; V1.subVectors(p, q); var l = V1.length() || 1e-4; p.copy(q).addScaledVector(V1, D.segL / l); }
        for (var k = 1; k < 5; k++) { var pp = D.pts[k]; for (var c = 0; c < CAPS.length; c++) { var R = CAPS[c][4] + rad, dx = pp.x - CW[c].x, dy = pp.y - CW[c].y, dz = pp.z - CW[c].z, d2 = dx * dx + dy * dy + dz * dz; if (d2 < R * R) { var d = Math.sqrt(d2) || 1e-4, f = R / d; pp.set(CW[c].x + dx * f, CW[c].y + dy * f, CW[c].z + dz * f); } } } } }
    function dreadSim(t, dt) {
      INV.copy(group.matrixWorld).invert();
      for (var c = 0; c < CAPS.length; c++) CW[c].set(CAPS[c][1], CAPS[c][2], CAPS[c][3]).applyMatrix4(CAPS[c][0].matrixWorld).applyMatrix4(INV);
      var reset = !dInit || dt > .2 || dt <= 0; dInit = true; var n = reset ? 1 : Math.min(5, Math.ceil(dt / .011)), h = dt / n;
      for (var di = 0; di < dreads.length; di++) { var D = dreads[di]; D.rn.copy(D.root).applyMatrix4(head.matrixWorld).applyMatrix4(INV);
        if (reset) { for (var i = 0; i < 5; i++) { D.pts[i].set(D.rn.x + Math.sin(D.a) * .05 * i, D.rn.y - D.segL * i, D.rn.z + Math.cos(D.a) * .05 * i); } D.pts[0].copy(D.rn); dSolve(D, 30); for (var j = 0; j < 5; j++) D.prev[j].copy(D.pts[j]); D.rp.copy(D.rn); }
        else if (simDreads) { var keep = Math.pow(D.drag, h);
          for (var sI = 1; sI <= n; sI++) { D.pts[0].lerpVectors(D.rp, D.rn, sI / n);
            for (var k = 1; k < 5; k++) { var p = D.pts[k], pv = D.prev[k], vx = (p.x - pv.x) * keep, vy2 = (p.y - pv.y) * keep, vz = (p.z - pv.z) * keep; pv.copy(p); p.x += vx + Math.sin(t * 1.3 + D.n * 1.7) * .02 * h * h; p.y += vy2 - 8.4 * h * h; p.z += vz; }
            dSolve(D, 3); }
          D.rp.copy(D.rn); }
        for (var m = 0; m < 4; m++) { var a = D.pts[m], bb = D.pts[m + 1]; V1.subVectors(bb, a); var len = V1.length() || 1e-4; D.mesh[m].position.copy(a); D.mesh[m].quaternion.setFromUnitVectors(DOWN, V1.multiplyScalar(1 / len)); var w = D.th * (1 - m * .06); D.mesh[m].scale.set(w, len / .17, w); }
        D.tip.position.copy(D.pts[4]); } }
    function update(t, dt, beatSeconds) {
      dt = dt === undefined ? 1 / 60 : dt; var bt = (beatSeconds === undefined ? t : beatSeconds) * bpm / 60;
      var g = { L: A(), R: A(), ll: L0(), rl: L0(), by: 0, bry: 0, brz: 0, tx: 0, ty: 0, tz: 0, hx: 0, hy: 0, hz: 0, pz: 0 };
      (POSES[pose] || POSES.idle)(g, t, bt);
      var by = ch('by', g.by, dt, 220, 24), bry = ch('bry', g.bry, dt), brz = ch('brz', g.brz, dt), tx = ch('tx', g.tx, dt), ty = ch('ty', g.ty, dt), tz = ch('tz', g.tz, dt);
      var hx = ch('hx', g.hx, dt, 130, 15), hy = ch('hy', g.hy, dt, 110, 15), hz = ch('hz', g.hz, dt, 110, 15);
      body.position.y = by; body.rotation.set(0, bry, brz); torso.rotation.set(tx, ty, tz); head.rotation.set(hx, hy, hz);
      [['R', arms[0], g.R], ['L', arms[1], g.L]].forEach(function (q) { var n = q[0], a = q[1], o = q[2], s = a.s, H = HANDS[o.hand] || HANDS.relax;
        a.sh.rotation.set(ch(n + 'sx', o.sx, dt), s * ch(n + 'tw', o.tw, dt), s * ch(n + 'out', o.out, dt)); a.el.rotation.x = ch(n + 'ex', o.ex, dt, 170, 18);
        a.hand.rotation.set(ch(n + 'wx', o.wx, dt, 190, 17), -s * ch(n + 'wy', o.wy, dt), s * ch(n + 'wz', o.wz, dt, 190, 17));
        var sp = ch(n + 'sp', H[5], dt, 200, 22);
        a.fingers.forEach(function (fg) { var c = ch(n + 'f' + fg.f, H[fg.f] + Math.sin(t * 1.7 + fg.f * 1.3 + s) * .03, dt, 240 - fg.f * 22, 23);   // the pinky lags the index
          fg.a.rotation.set(-c * 1.4, 0, s * (1.5 - fg.f) * sp * .22); fg.b.rotation.x = -c * 1.5; });
        var tc = ch(n + 'f4', H[4], dt, 220, 23); a.thumb.rotation.set(-Math.max(0, tc) * .9, 0, s * (.8 - tc * 1.0)); a.thumb2.rotation.z = -s * Math.max(0, tc) * .7; });
      [['r', legs[0], g.rl], ['l', legs[1], g.ll]].forEach(function (q) { var n = q[0], l = q[1], o = q[2];
        l.hip.rotation.set(ch(n + 'h', o.h, dt, 190, 21), 0, l.s * ch(n + 'o', o.o, dt)); l.knee.rotation.x = ch(n + 'k', o.k, dt, 190, 21); l.foot.rotation.x = ch(n + 'f', o.f, dt, 190, 21); });
      // follow-through: the braids and the clover lag behind his turns and bounces, then swing back
      var turn = bry + ty + hy, om = dt > 0 && dt < .2 ? (turn - prevTurn) / dt : 0, vy = dt > 0 && dt < .2 ? (by - prevBy) / dt : 0; prevTurn = turn; prevBy = by;
      torso.position.y = .4 + Math.min(1, Math.max(0, -(legs[0].hip.rotation.x + legs[1].hip.rotation.x) / 2 - .5)) * .06;   // the jacket rides up when he folds at the hips
      group.updateMatrixWorld(true); armFix(arms[0]); armFix(arms[1]); group.updateMatrixWorld(true); dreadSim(t, dt);
      var pz = ch('pz', g.pz, dt, 120, 14); pendant.position.set(0, .29 + pz * .05, .315 + pz * .09);
      pendant.rotation.set(Math.min(0, -pz * .5 + ch('pendx', -tx * .8 + vy * .5, dt, 45, 4)), Math.sin(t * 1.1) * .3 * (1 - pz), ch('pendz', -(tz + brz) * 1.2 - om * .1, dt, 45, 4));
    }
    update(0, 1);
    return { group: group, parts: { body: body, torso: torso, head: head, screen: screen, arms: arms, legs: legs, pendant: pendant, dreads: dreads },
      faces: Object.keys(FACES), poses: Object.keys(POSES), hands: Object.keys(HANDS), setFace: setFace, setMouth: setMouth, setPose: setPose, setTempo: setTempo, defs: POSES, arm: A, simDreads: function (v) { simDreads = v; }, update: update, height: 1.5 };
  }
  root.LilBottie = { build: build, version: '0.4' };
})(typeof window !== 'undefined' ? window : this);
