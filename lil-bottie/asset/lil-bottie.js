/* lil Bottie — the 3D asset, in the Grok Fable Astra style (blocky, low-poly, flat shaded).
   Standalone: needs only three.js (r128). Not wired into any game yet.

   const b = LilBottie.build(THREE);      // b.group is a THREE.Group, about 1.5 units tall (feet at y=0)
   scene.add(b.group); b.group.scale.setScalar(2.2);   // 2.2 is the size the game uses for people
   b.setFace('smile');                    // smile, talk1, talk2, wink, hype, dead, btv
   b.setMouth(0..1);                      // lip sync: 0 closed smile, 1 wide open
   b.setPose('idle');                     // idle, walk, dance, point, thumbs, arms, sit
   b.update(timeInSeconds);               // call every frame

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

    // ---- legs and shoes (black pants, black shoes with a silver sole)
    var legs = [];
    [-1, 1].forEach(function (s) {
      var leg = new THREE.Group(); leg.position.set(s * .13, .42, 0);
      leg.add(new THREE.Mesh(bake([P(Box(.2, .4, .24), BLACK, M(0, -.2, 0)), P(Box(.21, .1, .34), BLACK2, M(0, -.39, .05)), P(Box(.22, .03, .35), 0x8a909c, M(0, -.44, .05))]), clothM));
      body.add(leg); legs.push(leg);
    });

    // ---- torso: black hoodie core, silver puffer over it, open down the front
    var torso = new THREE.Group(); torso.position.y = .4; body.add(torso);
    var T = [P(Cyl(.2, .25, .5, 10), BLACK, M(0, .25, 0)), P(Box(.3, .1, .1), BLACK2, M(0, .14, .22))];   // hoodie + pouch pocket
    T.push(P(Cyl(.02, .02, .2, 5), BLACK2, M(-.06, .38, .23)), P(Cyl(.02, .02, .16, 5), BLACK2, M(.06, .4, .23)));   // hood strings
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
    torso.add(new THREE.Mesh(bake(J), pufferM));

    // ---- arms: puffy sleeve, black cuff, chrome hand. Pivot at the shoulder and the elbow.
    function hand(side) {
      var H = [P(Box(.12, .12, .07), CHROME, M(0, -.07, 0)), P(Box(.125, .03, .075), CHROME2, M(0, -.02, 0))];
      for (var f = 0; f < 4; f++) { var fx = -.045 + f * .03; H.push(P(Box(.026, .06, .03), CHROME, M(fx, -.16, .005)), P(Box(.024, .05, .028), CHROME2, M(fx, -.21, .012, .25)), P(Box(.03, .012, .034), 0x4a4e58, M(fx, -.185, .008))); }
      H.push(P(Box(.03, .06, .032), CHROME, M(side * .075, -.09, .02, 0, 0, side * .6)), P(Box(.026, .045, .028), CHROME2, M(side * .1, -.13, .03, 0, 0, side * .3)));
      return H;
    }
    var arms = [];
    [-1, 1].forEach(function (s) {
      var sh = new THREE.Group(); sh.position.set(s * .36, .5, 0); torso.add(sh);
      var up = [P(Sph(.125, 8, 6), SILVER, M(0, -.01, 0)), P(Cyl(.115, .11, .12, 8), SILVER2, M(0, -.11, 0)), P(Cyl(.11, .105, .11, 8), SILVER, M(0, -.225, 0))];
      sh.add(new THREE.Mesh(bake(up), pufferM));
      var el = new THREE.Group(); el.position.y = -.29; sh.add(el);
      var lo = [P(Cyl(.105, .1, .11, 8), SILVER2, M(0, -.05, 0)), P(Cyl(.1, .09, .11, 8), SILVER, M(0, -.16, 0))];
      el.add(new THREE.Mesh(bake(lo), pufferM));
      el.add(new THREE.Mesh(bake([P(Cyl(.075, .07, .06, 8), BLACK, M(0, -.245, 0))]), clothM));
      var hg = new THREE.Group(); hg.position.y = -.27; el.add(hg);
      hg.add(new THREE.Mesh(bake(hand(s)), chromeM));
      if (s < 0) {   // the iced watch, on his right wrist
        var W = [P(Cyl(.072, .072, .04, 12), 0xdfe4ee, M(0, .0, 0)), P(Cyl(.05, .05, .02, 12), ICE, M(0, 0, .07, Math.PI / 2)), P(Cyl(.036, .036, .024, 10), 0xcfc6ae, M(0, 0, .072, Math.PI / 2)), P(Box(.004, .03, .006), 0x1a1a1a, M(0, .008, .086)), P(Box(.02, .004, .006), 0x1a1a1a, M(.008, 0, .086))];
        hg.add(new THREE.Mesh(bake(W), iceM));
      }
      arms.push({ sh: sh, el: el, hand: hg, s: s });
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
    head.add(new THREE.Mesh(bake(Hh), chromeM));
    var faceCv = document.createElement('canvas'); faceCv.width = 160; faceCv.height = 112;
    var faceTx = new THREE.CanvasTexture(faceCv); faceTx.magFilter = THREE.LinearFilter;
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(.39, .273), new THREE.MeshBasicMaterial({ map: faceTx, fog: false }));
    screen.position.set(0, .17, .2985); head.add(screen);

    // ---- braids: long, black, from under the dome to the chest and back
    var braidsBack = new THREE.Group(), braidsFront = new THREE.Group(); head.add(braidsBack); head.add(braidsFront);
    function braid(a, len, out, fwd) {
      var B = [], x0 = Math.sin(a) * .25, z0 = Math.cos(a) * .25, n = Math.round(len / .075);
      for (var j = 0; j < n; j++) { var t = j / n, x = x0 + Math.sin(a) * out * t, z = z0 + Math.cos(a) * out * t + fwd * t * t, yy = .06 - j * .075;
        B.push(P(Cyl(.02, .018, .088, 5), j % 2 ? 0x101014 : 0x18181e, M(x, yy, z, .12 * Math.cos(a) * (1 - t), 0, -.12 * Math.sin(a) * (1 - t)))); }
      B.push(P(Sph(.02, 5, 4), 0x2a2a34, M(x0 + Math.sin(a) * out, .06 - n * .075, z0 + Math.cos(a) * out + fwd)));
      return B;
    }
    var BB = [], BF = [];
    for (var b = 0; b < 17; b++) { var ba = Math.PI * .42 + b / 16 * Math.PI * 1.16; BB = BB.concat(braid(ba, .62 + ((b * 7) % 5) * .05, .19 + ((b * 3) % 4) * .02, 0)); }
    [-1, 1].forEach(function (s) { BF = BF.concat(braid(s * 1.02, .7, .17, .1), braid(s * 1.24, .78, .2, .05)); });
    braidsBack.add(new THREE.Mesh(bake(BB), clothM)); braidsFront.add(new THREE.Mesh(bake(BF), clothM));

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

    // ---- poses and motion
    var pose = 'idle';
    function setPose(p) { pose = p; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    var cur = { lsx: 0, lsz: 0, lex: 0, rsx: 0, rsz: 0, rex: 0, hx: 0, hy: 0, by: 0, bry: 0, ll: 0, rl: 0, tz: 0, sit: 0 };
    function update(t, dt) {
      dt = dt === undefined ? 1 / 60 : dt; var k = Math.min(1, dt * 9), w = Math.sin(t * 8), beat = t * (136 / 60) * Math.PI;   // 136 bpm, his tempo
      var tg = { lsx: 0, lsz: .1, lex: -.12, rsx: 0, rsz: -.1, rex: -.12, hx: 0, hy: 0, by: Math.sin(t * 2) * .008, bry: 0, ll: 0, rl: 0, tz: 0, sit: 0 };
      if (pose === 'walk') { tg.lsx = w * .7; tg.rsx = -w * .7; tg.ll = -w * .6; tg.rl = w * .6; tg.by = Math.abs(w) * .03; tg.lex = tg.rex = -.35; }
      else if (pose === 'dance') { var s2 = Math.sin(beat), c2 = Math.sin(beat / 2); tg.by = Math.abs(s2) * .05; tg.bry = c2 * .35; tg.tz = c2 * .08; tg.lsx = -.5 + s2 * .5; tg.rsx = -.5 - s2 * .5; tg.lex = tg.rex = -1.3; tg.lsz = .45; tg.rsz = -.45; tg.hx = Math.abs(s2) * .14; tg.hy = c2 * .25; tg.ll = Math.max(0, s2) * .25; tg.rl = Math.max(0, -s2) * .25; }
      else if (pose === 'point') { tg.lsx = -1.5; tg.lsz = .35; tg.lex = -.05; tg.hy = .35; tg.bry = .15; }
      else if (pose === 'thumbs') { tg.lsx = -1.25; tg.lsz = .5; tg.lex = -.5; tg.hx = -.05; }
      else if (pose === 'arms') { tg.lsz = 1.45; tg.rsz = -1.45; tg.lex = tg.rex = -.1; tg.hx = -.22; tg.by = Math.sin(t * 1.5) * .01; }
      else if (pose === 'sit') { tg.sit = 1; tg.ll = tg.rl = -1.45; tg.lsx = -.5; tg.lex = -1.2; tg.rsx = -.25; tg.rex = -.6; tg.by = -.16; tg.hx = .05; }
      for (var key in tg) cur[key] = lerp(cur[key], tg[key], k);
      body.position.y = cur.by; body.rotation.y = cur.bry; torso.rotation.z = cur.tz; torso.rotation.x = cur.sit * -.12;
      legs[0].rotation.x = cur.ll; legs[1].rotation.x = cur.rl;
      arms[1].sh.rotation.set(cur.lsx, 0, cur.lsz); arms[1].el.rotation.x = cur.lex;    // his left arm (the +x side)
      arms[0].sh.rotation.set(cur.rsx, 0, cur.rsz); arms[0].el.rotation.x = cur.rex;
      head.rotation.set(cur.hx + Math.sin(t * 1.3) * .02, cur.hy + Math.sin(t * .7) * .04, 0);
      var sway = Math.sin(t * 2.2) * .03 + cur.bry * .25 + (pose === 'walk' ? w * .05 : 0) + (pose === 'dance' ? Math.sin(beat) * .1 : 0);
      braidsBack.rotation.set(-.04 - Math.abs(sway) * .3, 0, sway); braidsFront.rotation.set(.02, 0, sway * .7);
      pendant.rotation.z = Math.sin(t * 2.6) * .12 + sway * 1.2; pendant.rotation.y = Math.sin(t * 1.1) * .35;
      arms.forEach(function (a) { a.hand.rotation.z = pose === 'thumbs' && a.s > 0 ? -.3 : 0; });
    }
    update(0, 1);
    return { group: group, parts: { body: body, torso: torso, head: head, screen: screen, arms: arms, legs: legs, pendant: pendant, braidsBack: braidsBack, braidsFront: braidsFront },
      faces: Object.keys(FACES), poses: ['idle', 'walk', 'dance', 'point', 'thumbs', 'arms', 'sit'], setFace: setFace, setMouth: setMouth, setPose: setPose, update: update, height: 1.5 };
  }
  root.LilBottie = { build: build, version: '0.1' };
})(typeof window !== 'undefined' ? window : this);
