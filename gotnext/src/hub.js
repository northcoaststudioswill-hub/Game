// GOT NEXT — walking around: The Block (hub), The Pit (mode doors), My Crib (home court)
'use strict';
let W = null;
function worldPlayerRig() {
  if (W.me.rig) scene.remove(W.me.rig.root);
  W.me.rig = makeRig(myBuild()); scene.add(W.me.rig.root);
}
function addNpc(build, x, z, face, anim, extra) {
  const r = makeRig(build, !!(extra && extra.low)); r.root.position.set(x, 0, z); r.root.rotation.y = face; scene.add(r.root);
  const n = Object.assign({ rig: r, x, z, face, anim: anim || 'idle', ph: rnd(0, 6), hx: x, hz: z, tx: x, tz: z, wt: rnd(1, 5) }, extra || {}); W.npcs.push(n); return n;
}
function spot(x, z, r, label, fn) { W.spots.push({ x, z, r, label, fn }); }
function solid(x0, x1, z0, z1) { W.solids.push([x0, x1, z0, z1]); }
function building(x, z, w, d, h, col, label, labelCol, face) {
  ink(M(box(w, h, d), brickMat(col, Math.max(w, d), h), x, h / 2, z, scene), 1.015); solid(x - w / 2 - 0.4, x + w / 2 + 0.4, z - d / 2 - 0.4, z + d / 2 + 0.4);
  M(box(w + 0.5, 0.5, d + 0.5), toon('#16181c'), x, h + 0.25, z, scene); M(box(w + 0.1, 1.1, d + 0.1), toon('#26262c'), x, 0.55, z, scene);
  if (label) {
    const s = sign(label, Math.min(w, d) * 0.9, 2.4, labelCol, '#0a0a14'); const off = { n: [0, -d / 2 - 0.06, Math.PI], s: [0, d / 2 + 0.06, 0], e: [w / 2 + 0.06, 0, Math.PI / 2], w: [-w / 2 - 0.06, 0, -Math.PI / 2] }[face];
    s.position.set(x + (face === 'e' || face === 'w' ? off[0] : 0), h - 1.8, z + (face === 'n' || face === 's' ? off[1] : 0)); s.rotation.y = off[2]; scene.add(s);
    // door glow
    const dr = M(box(face === 'e' || face === 'w' ? 0.12 : 2.6, 3.4, face === 'e' || face === 'w' ? 2.6 : 0.12), flat(labelCol), s.position.x, 1.7, s.position.z, scene); void dr;
  }
}
function lamp(x, z, col) { M(cyl(0.07, 0.09, 5, 6), toon('#20242c'), x, 2.5, z, scene); M(sph(0.28, 8, 6), flat(col || 0xffe9a8), x, 5.1, z, scene); const g = M(geo('glow', () => new THREE.CircleGeometry(2.6, 16)), flat(col || 0xffe9a8, { transparent: true, opacity: 0.1, depthWrite: false }), x, 0.03, z, scene); g.rotation.x = -Math.PI / 2; }

function enterWorld(kind, sx, sz, face) {
  disposeScene(scene); scene = new THREE.Scene(); MT = null; hudShow(false);
  W = { kind, me: { x: sx || 0, z: sz || 0, face: face === undefined ? Math.PI : face, vx: 0, vz: 0, rig: null, ph: 0 }, yaw: face === undefined ? Math.PI : face, npcs: [], spots: [], solids: [], cars: [], near: null, t: 0, bounds: [-30, 30, -30, 30] };
  musicMode = 'hub';
  if (kind === 'hub') buildHub(); else if (kind === 'pit') buildPit(); else buildCrib();
  worldPlayerRig(); W.camInit = false; $('wtag').textContent = kind === 'hub' ? 'THE BLOCK · USA 2145' : kind === 'pit' ? 'THE PIT' : 'MY CRIB';
  document.body.dataset.state = 'world'; uiHud();
}

function buildHub() {
  scene.background = new THREE.Color(0x191a22); scene.fog = new THREE.Fog(0x191a22, 45, 170);
  baseLights(scene, 0xffe2c8, 0x34343c, 0xffc890, 1.5);
  const gt = canvasTex(1024, 1024, (x, S_) => {
    x.fillStyle = '#35363b'; x.fillRect(0, 0, S_, S_);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${Math.random() < 0.5 ? '0,0,0' : '255,255,255'},${rnd(0.02, 0.07)})`; x.fillRect(rnd(0, S_), rnd(0, S_), rnd(2, 30), rnd(2, 6)); }
    x.strokeStyle = '#f2c230'; x.lineWidth = 8; x.setLineDash([40, 30]); x.beginPath(); x.moveTo(S_ / 2, 0); x.lineTo(S_ / 2, S_); x.moveTo(0, S_ / 2); x.lineTo(S_, S_ / 2); x.stroke(); x.setLineDash([]);
    x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 10; x.beginPath(); x.arc(S_ / 2, S_ / 2, 120, 0, 6.3); x.stroke();
    x.fillStyle = 'rgba(236,233,226,.22)'; x.font = '900 expanded 54px Archivo, Impact'; x.textAlign = 'center'; x.fillText('THE BLOCK', S_ / 2, S_ / 2 + 230);
  });
  const g = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), new THREE.MeshToonMaterial({ map: gt, gradientMap: ramp() })); g.rotation.x = -Math.PI / 2; scene.add(g);
  const g2 = M(new THREE.PlaneGeometry(400, 400), toon('#1c1a28'), 0, -0.05, 0, scene); g2.rotation.x = -Math.PI / 2;
  skyline(scene, 46, 75, ['#f2c14e', '#ffe9a8', '#ffe9a8', '#7de3ff']);
  // The Pit — north
  building(0, -36, 30, 12, 13, '#6b3a30', 'THE PIT', '#ece9e2', 's');
  M(box(30.6, 0.5, 12.6), flat(0xff2d78), 0, 9.4, -36, scene);
  for (let i = 0; i < 5; i++) { poster(scene, -13 + i * 1.6, 2.2, -29.93, 0, i % 2); poster(scene, 6.6 + i * 1.6, 2.2, -29.93, 0, (i + 1) % 2); }
  spot(0, -28.6, 2.6, 'ENTER THE PIT', () => enterWorld('pit', 0, 6.5, Math.PI));
  // Drip Depot — east
  building(36, -2, 12, 18, 8, '#8a8378', 'THE PLUG', '#f2c14e', 'w');
  for (let i = 0; i < 3; i++) poster(scene, 29.93, 2.2, 3.4 + i * 1.6, -Math.PI / 2, i % 2);
  spot(28.4, -2, 2.6, 'THE PLUG (drip)', () => uiShop(false));
  // Gainz Lab — west
  building(-36, -2, 12, 18, 8, '#7a4034', 'THE LAB', '#3dffa0', 'e');
  for (let i = 0; i < 3; i++) poster(scene, -29.93, 2.2, -8.6 + i * 1.6, Math.PI / 2, i % 2);
  spot(-28.4, -2, 2.6, 'THE LAB (attributes)', () => uiPlayer('attrs'));
  // Crib — south-west
  building(-20, 35, 12, 10, 5.5, '#5e5e66', 'MY CRIB', '#7de3ff', 'n');
  spot(-20, 28.6, 2.4, 'GO HOME', () => enterWorld('crib', 0, 13.5, Math.PI));
  // Move Dealer stall — south-east
  building(20, 35, 10, 10, 5, '#4a4f5c', 'TAPE DECK', '#ff2d78', 'n');
  spot(20, 28.6, 2.4, 'TAPE DECK (moves)', () => uiPlayer('moves'));
  addNpc(aiBuild(80, 'showman'), 23.5, 28.2, Math.PI, 'idle');
  // statue: the Freedom Eagle, mid-dunk, in solid gold
  ink(M(cyl(2.2, 2.6, 1.2, 8), toon('#59606c'), 0, 0.6, 0, scene), 1.03); solid(-2.5, 2.5, -2.5, 2.5);
  const sb = aiBuild(99, 'slasher'); sb.worn = { hair: 'h_bald', head: 'hd_eagle', face: 'f_none', top: 't_jersey', arm: 'a_none', bottom: 'b_basic', socks: 's_high', shoes: 'k_gold', back: 'bk_wings', ball: 'bl_gold' };
  const st = makeRig(sb, true); const gold = toon('#ffc531'); st.root.traverse(o => { if (o.isMesh && o.material !== INK) o.material = gold; }); st.shadow.visible = false;
  st.root.position.set(0, 1.9, 0); st.root.scale.setScalar(1.7); st.root.rotation.y = 0.4; scene.add(st.root); applyPose(st, poseOf('dunk', 0, { u: 0.5, style: 'tomahawk' }), 10);
  const pl = sign('THE FREEDOM EAGLE\n"HE DUNKED SO YOU COULD SCROLL"', 3.6, 0.8, '#ffc531', '#20242c'); pl.position.set(0, 0.7, 2.62); scene.add(pl);
  // Money Rack hustler with a side hoop
  const h = hoopMesh(1, 'street'); h.position.set(17, 0, 12); h.rotation.y = -Math.PI / 2; scene.add(h); solid(18, 20, 11, 13);
  addNpc(aiBuild(75, 'sniper'), 14.5, 14.2, -2.2, 'idle');
  spot(14, 13, 2.6, 'MONEY RACK (shootout)', () => uiRack());
  // old head on a bench
  ink(M(box(2.4, 0.12, 0.6), toon('#7a5a3a'), -9, 0.5, -10, scene), 1.05); M(box(0.12, 0.5, 0.5), toon('#20242c'), -10, 0.25, -10, scene); M(box(0.12, 0.5, 0.5), toon('#20242c'), -8, 0.25, -10, scene); solid(-10.4, -7.6, -10.5, -9.5);
  const ob = aiBuild(60, 'general'); ob.worn.hair = 'h_bald'; ob.worn.head = 'hd_band'; ob.worn.face = 'f_goggles';
  const oh = addNpc(ob, -9, -9.92, 0.3, 'sit'); oh.sitLeg = 1;
  spot(-9, -8.6, 2.2, 'TALK TO THE OLD HEAD', () => uiDialog('OLD HEAD', pick(OLDHEAD), [['Respect.', null]]));
  // build fiends
  const bumSpots = [[6, -22], [-7, -24], [22, 6], [-21, 9], [8, 22], [-10, 21]];
  bumSpots.forEach((b, i) => { const bb = aiBuild(50); bb.worn = randomWorn(0, true); bb.name = BUM_NAMES[i % BUM_NAMES.length]; const n = addNpc(bb, b[0], b[1], rnd(0, 6), 'beg', { bum: true, wander: true, name: bb.name }); spot(b[0], b[1], 2.0, 'TALK', () => uiBum(n)); n.spot = W.spots[W.spots.length - 1]; });
  // ballers hanging around
  for (let i = 0; i < 5; i++) addNpc(aiBuild(rnd(60, 90)), rnd(-18, 18), rnd(-20, -12), rnd(0, 6), 'idle', { wander: true });
  // dressing
  for (const [x, z] of [[-12, -26], [12, -26], [-26, -14], [26, -14], [-26, 14], [26, 14], [-8, 26], [8, 26]]) lamp(x, z, 0xffd28a);
  billboard(scene, ADS[0], -22, 9, -33, 0.25, 11, 6); billboard(scene, ADS[1], 22, 9, -33, -0.25, 11, 6);
  billboard(scene, ADS[2], 34, 8, 20, -Math.PI / 2, 10, 5.5); billboard(scene, ADS[3], -34, 8, 20, Math.PI / 2, 10, 5.5);
  billboard(scene, ADS[4], 34, 8, -24, -Math.PI / 2, 10, 5.5); billboard(scene, ADS[5], -34, 8, -24, Math.PI / 2, 10, 5.5);
  billboard(scene, ADS[6], 0, 8, 36, Math.PI, 12, 5.5); billboard(scene, ADS[7], 0, 17, -40, 0, 16, 5);
  // the flag
  M(cyl(0.12, 0.16, 16, 8), toon('#c8d0d8'), -14, 8, -27, scene); solid(-14.5, -13.5, -27.5, -26.5);
  const ft = canvasTex(256, 160, (x, w, hh) => { for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#f4f4f4' : '#d02030'; x.fillRect(0, i * hh / 13, w, hh / 13 + 1); } x.fillStyle = '#2440a8'; x.fillRect(0, 0, w * 0.42, hh * 0.54); x.fillStyle = '#ffc531'; x.font = '900 60px Impact'; x.textAlign = 'center'; x.fillText('$', w * 0.21, hh * 0.42); });
  W.flag = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.6, 10, 1), new THREE.MeshBasicMaterial({ map: ft, side: THREE.DoubleSide })); W.flag.position.set(-10.9, 14, -27); scene.add(W.flag);
  // hover traffic
  for (let i = 0; i < 7; i++) { const c = new THREE.Group(); ink(M(box(2.6, 0.6, 1.2), toon(pick(['#ff5a3c', '#33e0ff', '#ffc531', '#f4f4f4', '#c66bff'])), 0, 0, 0, c), 1.05); M(box(1.3, 0.45, 1.0), toon('#16181c'), -0.1, 0.45, 0, c); M(box(2.2, 0.08, 1.0), flat(0x66ffff), 0, -0.34, 0, c); scene.add(c); W.cars.push({ c, a: rnd(0, 6.28), r: rnd(38, 60), y: rnd(14, 30), s: rnd(0.08, 0.2) * (i % 2 ? 1 : -1) }); }
  W.bounds = [-31, 31, -29.6, 30];
}

function buildPit() {
  scene.background = new THREE.Color(0x0b0b0e); scene.fog = new THREE.Fog(0x0b0b0e, 25, 70);
  baseLights(scene, 0xfff0e0, 0x26262c, 0xffe0c0, 1.6);
  const ft = canvasTex(512, 512, (x, S_) => { x.fillStyle = '#1d1d22'; x.fillRect(0, 0, S_, S_); x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 3; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, S_); x.moveTo(0, i * 64); x.lineTo(S_, i * 64); x.stroke(); } });
  ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(3, 2);
  const g = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), new THREE.MeshToonMaterial({ map: ft, gradientMap: ramp() })); g.rotation.x = -Math.PI / 2; scene.add(g);
  const wall = brickMat('#4a4a52', 30, 7);
  M(box(30, 7, 0.5), wall, 0, 3.5, -10, scene); M(box(0.5, 7, 20), wall, -15, 3.5, 0, scene); M(box(0.5, 7, 20), wall, 15, 3.5, 0, scene);
  M(box(30, 0.16, 0.3), flat(0xff2d78), 0, 6.8, -9.7, scene);
  for (let i = 0; i < 4; i++) { poster(scene, -14.72, 2.3, -7.5 + i * 1.6, Math.PI / 2, i % 2); poster(scene, 14.72, 2.3, -7.5 + i * 1.6, -Math.PI / 2, (i + 1) % 2); }
  const cols = ['#ece9e2', '#f2c14e', '#7de3ff', '#ff2d78'];
  MODES.forEach((m, i) => {
    const x = -10.5 + i * 7;
    M(box(3.2, 4.2, 0.2), flat(cols[i], { transparent: true, opacity: 0.85 }), x, 2.1, -9.7, scene); M(box(2.7, 3.8, 0.24), toon('#0b0b0e'), x, 1.9, -9.68, scene);
    const s = sign(m.n.replace(' ', '\n'), 3.2, 1.6, cols[i], '#0a0a14'); s.position.set(x, 5.2, -9.7); scene.add(s);
    const ic = sign(m.arcade ? 'TO 21' : 'TO 11', 1.8, 0.7, cols[i], '#0b0b0e', { border: false }); ic.position.set(x, 2.1, -9.54); scene.add(ic);
    spot(x, -8, 2.2, m.n, () => uiMode(m));
  });
  // Last Call kiosk (east) — the last-minute things
  ink(M(box(1.2, 1.1, 4), toon('#19c7b0'), 13, 0.55, 2, scene), 1.03); solid(12, 15, -0.3, 4.3);
  const k = sign('LAST CALL\nBOOSTS · PASTE · REGRET', 4, 1.3, '#33ff88', '#0a0a14'); k.position.set(14.7, 4, 2); k.rotation.y = -Math.PI / 2; scene.add(k);
  const vb = aiBuild(70, 'glass'); vb.worn.face = 'f_mask'; addNpc(vb, 13.9, 2, -Math.PI / 2, 'idle');
  for (let i = 0; i < 5; i++) M(cyl(0.12, 0.12, 0.35, 8), toon(pick(['#ff5a3c', '#ffc531', '#33ff88', '#c66bff'])), 12.9, 1.28, 0.6 + i * 0.7, scene);
  spot(11.2, 2, 2.2, 'LAST CALL (boosts)', () => uiKiosk());
  // Homie Terminal (west) — export / import builds
  ink(M(box(1.0, 2.2, 1.6), toon('#20242c'), -13.8, 1.1, 2, scene), 1.03); solid(-15, -13, 1, 3);
  const scn = sign('THE\nLINK', 1.3, 0.9, '#33e0ff', '#061018'); scn.position.set(-13.28, 1.6, 2); scn.rotation.y = Math.PI / 2; scene.add(scn);
  const hs = sign('EXPORT YOUR BUILD · IMPORT YOUR FRIENDS', 5, 0.9, '#33e0ff', '#0a0a14'); hs.position.set(-14.7, 4, 2); hs.rotation.y = Math.PI / 2; scene.add(hs);
  spot(-12, 2, 2.2, 'THE LINK (friends)', () => uiHomie());
  // exit
  M(box(4, 4.4, 0.2), flat(0xffe9a8, { transparent: true, opacity: 0.5 }), 0, 2.2, 10, scene);
  const ex = sign('THE BLOCK ↓', 4, 0.9, '#ffe9a8', '#0a0a14'); ex.position.set(0, 5, 9.9); ex.rotation.y = Math.PI; scene.add(ex);
  spot(0, 8.6, 2.0, 'BACK TO THE BLOCK', () => enterWorld('hub', 0, -25.5, 0));
  // got-next crowd
  for (let i = 0; i < 6; i++) addNpc(aiBuild(rnd(60, 92)), rnd(-11, 9), rnd(-4, 6), rnd(0, 6), i % 3 === 0 ? 'cheer' : 'idle', { wander: i % 2 === 0, lobby: true });
  for (const x of [-7, 0, 7]) { M(cyl(0.05, 0.05, 1.2, 6), toon('#20242c'), x, 6.4, 0, scene); M(sph(0.3, 8, 6), flat(0xffe9a8), x, 5.7, 0, scene); }
  W.bounds = [-14.2, 14.2, -9.2, 9.2];
}

function buildCrib() {
  const fl = cribTier('floor'), hp = cribTier('hoop');
  scene.background = new THREE.Color(0x3a3558); scene.fog = new THREE.Fog(0x3a3558, 40, 150);
  baseLights(scene, 0xffe0c8, 0x3a3050, 0xffd0a0, 1.5);
  const g2 = M(new THREE.PlaneGeometry(300, 300), toon('#2a2d34'), 0, -0.03, 0, scene); g2.rotation.x = -Math.PI / 2;
  addCourt(scene, ['drive', 'black', 'show', 'wood'][fl], hp);
  addFence(scene, -11, 11, -3.4, 16, 3, 0xffffff);
  skyline(scene, 30, 62, ['#ffc531', '#ffe9a8', '#33e0ff'], 34);
  // the shack you call home
  ink(M(box(5, 3.6, 6), toon('#59606c'), 11.2, 1.8, 5, scene), 1.02); M(box(5.6, 0.3, 6.6), toon('#c8482c'), 11.2, 3.75, 5, scene); M(box(0.1, 2.2, 1.2), toon('#3a2a1c'), 8.66, 1.1, 5, scene); solid(8.6, 14, 1.8, 8.2);
  spot(7.7, 5, 2.0, 'CLOSET (drip)', () => uiShop(true));
  // workbench: upgrades
  ink(M(box(1.6, 0.9, 0.8), toon('#7a5a3a'), 8.6, 0.45, 10.5, scene), 1.04); const ws = sign('CRIB UPGRADES', 2, 0.5, '#ffc531', '#20242c'); ws.position.set(8.6, 1.5, 10.5); ws.rotation.y = -0.6; scene.add(ws); solid(7.7, 9.5, 10, 11);
  spot(7.5, 10.9, 2.0, 'CRIB UPGRADES', () => uiCrib());
  spot(0, 6.5, 2.2, 'SHOOT AROUND', () => startPractice('free'));
  spot(0, 14.6, 1.8, 'BACK TO THE BLOCK', () => enterWorld('hub', -20, 26, Math.PI));
  const ex = sign('THE BLOCK ↓', 3, 0.7, '#ffe9a8', '#0a0a14'); ex.position.set(0, 3.4, 16); ex.rotation.y = Math.PI; scene.add(ex);
  // upgrade props
  const t = id => cribTier(id);
  if (t('couch') === 0) ink(M(box(0.5, 0.45, 0.5), toon('#e04848'), -9.3, 0.23, 6, scene), 1.05);
  else { const c = toon(t('couch') === 2 ? '#7a2a8a' : '#2a6a4a'); ink(M(box(1.0, 0.5, 2.6), c, -9.6, 0.35, 6, scene), 1.03); ink(M(box(0.3, 1.0, 2.6), c, -10.1, 0.6, 6, scene), 1.03); if (t('couch') === 2) M(box(0.1, 1.4, 2.6), flat(0xff4fd8), -10.3, 0.8, 6, scene); }
  solid(-10.6, -8.9, 4.6, 7.4);
  if (t('trophy')) { ink(M(box(0.4, 2.4, 3.2), toon('#3a2a1c'), -10.4, 1.2, 10.5, scene), 1.02); const n = [0, 3, 7, 12][t('trophy')]; for (let i = 0; i < n; i++) { const tx = -10.1, ty = 0.75 + Math.floor(i / 4) * 0.7, tz = 9.3 + (i % 4) * 0.8; M(cyl(0.1, 0.05, 0.22, 8), toon('#ffc531'), tx, ty + 0.11, tz, scene); M(box(0.14, 0.06, 0.14), toon('#20242c'), tx, ty - 0.02, tz, scene); } solid(-10.8, -9.8, 8.8, 12.2); }
  if (t('printer')) { ink(M(box(0.9, 1.5, 0.9), toon(t('printer') === 2 ? '#c8482c' : '#c8d0d8'), 6, 0.75, 14.6, scene), 1.03); M(box(0.6, 0.4, 0.05), flat(0x33ff88), 6, 1.1, 14.14, scene); const s = sign(t('printer') === 2 ? 'STEAK\nFABRICATOR' : 'PROTEIN\nPRINTER', 1.2, 0.6, '#33ff88', '#0a0a14'); s.position.set(6, 2, 14.6); s.rotation.y = Math.PI; scene.add(s); solid(5.4, 6.6, 14, 15.2); }
  if (t('shotdoc')) { ink(M(box(1.2, 1.8, 1.0), toon('#2440a8'), -6, 0.9, 14.6, scene), 1.03); M(cyl(0.3, 0.3, 0.6, 10), toon('#ff7a1f'), -6, 2.1, 14.4, scene).rotation.x = 1.1; const s = sign(t('shotdoc') === 2 ? 'SHOT SURGEON 9000' : 'SHOT DOCTOR 3000', 2, 0.4, '#33e0ff', '#0a0a14'); s.position.set(-6, 2.9, 14.6); s.rotation.y = Math.PI; scene.add(s); solid(-6.8, -5.2, 14, 15.2); }
  if (t('sign') === 1) { const s = sign('LIVE LAUGH LAYUP', 4, 0.9, '#ff4fd8', '#0a0a14'); s.position.set(8.64, 3.0, 5); s.rotation.y = -Math.PI / 2; scene.add(s); }
  if (t('sign') === 2) { const s = sign('★ ' + S.name + ' ★\nGREATEST EVER (SELF-REPORTED)', 8, 4, '#ffc531', '#0a0a14'); s.position.set(0, 7, -5); scene.add(s); M(cyl(0.15, 0.15, 5, 6), toon('#20242c'), -3, 2.5, -5.2, scene); M(cyl(0.15, 0.15, 5, 6), toon('#20242c'), 3, 2.5, -5.2, scene); }
  if (t('flag')) { const big = t('flag') === 2, hgt = big ? 22 : 7; M(cyl(0.1, 0.14, hgt, 8), toon('#c8d0d8'), -10, hgt / 2, -2.6, scene); const ft = canvasTex(256, 160, (x, w, hh) => { for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#f4f4f4' : '#d02030'; x.fillRect(0, i * hh / 13, w, hh / 13 + 1); } x.fillStyle = '#2440a8'; x.fillRect(0, 0, w * 0.42, hh * 0.54); }); W.flag = new THREE.Mesh(new THREE.PlaneGeometry(big ? 26 : 3, big ? 15 : 1.8, 10, 1), new THREE.MeshBasicMaterial({ map: ft, side: THREE.DoubleSide })); W.flag.position.set(-10 + (big ? 13.1 : 1.6), hgt - (big ? 7.6 : 1), -2.6); scene.add(W.flag); }
  W.bounds = [-10.4, 8.2, -1.2, 15.2];
}

function worldStep(dt) {
  if (!W) return; W.t += dt; const me = W.me, I = IN[0], busy = uiBusy();
  let mx = busy ? 0 : I.mx, my = busy ? 0 : I.my;
  if (!busy) W.yaw -= (I.rx * 2.4 + mx * 0.9 * Math.min(1, Math.abs(my) + 0.4)) * dt;
  // camera looks along (sin yaw, cos yaw)
  const fx = Math.sin(W.yaw), fz = Math.cos(W.yaw), rx = -fz, rz = fx;
  const sp = (I.sprint ? 7.5 : 4.6) * (W.kind === 'hub' ? 1.15 : 1);
  const tvx = (fx * -my + rx * mx) * sp, tvz = (fz * -my + rz * mx) * sp;
  me.vx += (tvx - me.vx) * Math.min(1, 12 * dt); me.vz += (tvz - me.vz) * Math.min(1, 12 * dt);
  let nx = me.x + me.vx * dt, nz = me.z + me.vz * dt;
  for (const s of W.solids) { if (nx > s[0] && nx < s[1] && nz > s[2] && nz < s[3]) { const px = Math.min(nx - s[0], s[1] - nx), pz = Math.min(nz - s[2], s[3] - nz); if (px < pz) nx = nx - s[0] < s[1] - nx ? s[0] : s[1]; else nz = nz - s[2] < s[3] - nz ? s[2] : s[3]; } }
  me.x = clamp(nx, W.bounds[0], W.bounds[1]); me.z = clamp(nz, W.bounds[2], W.bounds[3]);
  const v = Math.hypot(me.vx, me.vz); if (v > 0.5) me.face = lerpAng(me.face, Math.atan2(me.vx, me.vz), 1 - Math.exp(-12 * dt));
  me.ph += dt * (4 + v * 1.6);
  const R = me.rig; applyPose(R, poseOf(v > 0.5 ? 'run' : 'idle', v > 0.5 ? 0 : W.t, { sp: v / 8, ph: me.ph }), dt); R.root.position.set(me.x, 0, me.z); R.root.rotation.y = me.face; R.capeSwing = v / 8;
  // npcs
  for (const n of W.npcs) {
    let an = n.anim, o = { ph: n.ph, leg: n.rig.legLen };
    if (n.wander && !(n.bum && W.talk === n)) {
      n.wt -= dt; if (n.wt <= 0) { n.wt = rnd(3, 9); n.tx = n.hx + rnd(-2.5, 2.5); n.tz = n.hz + rnd(-2.5, 2.5); }
      const dx = n.tx - n.x, dz = n.tz - n.z, l = Math.hypot(dx, dz);
      if (l > 0.3) { n.x += dx / l * 1.1 * dt; n.z += dz / l * 1.1 * dt; n.face = lerpAng(n.face, Math.atan2(dx, dz), 0.1); n.ph += dt * 5.5; an = 'walk'; o = { sp: 0.12, ph: n.ph }; if (n.spot) { n.spot.x = n.x; n.spot.z = n.z; } }
      else if (Math.hypot(me.x - n.x, me.z - n.z) < 5 && n.bum) n.face = lerpAng(n.face, Math.atan2(me.x - n.x, me.z - n.z), 0.08);
    }
    n.rig.root.position.set(n.x, 0, n.z); n.rig.root.rotation.y = n.face; applyPose(n.rig, poseOf(an, W.t, o), dt);
  }
  for (const c of W.cars) { c.a += c.s * dt; c.c.position.set(Math.cos(c.a) * c.r, c.y, Math.sin(c.a) * c.r); c.c.rotation.y = -c.a + (c.s > 0 ? -Math.PI / 2 : Math.PI / 2); }
  if (W.flag) { const pa = W.flag.geometry.attributes.position; for (let i = 0; i < pa.count; i++) pa.setZ(i, Math.sin(pa.getX(i) * 1.2 + W.t * 3) * 0.25 * (pa.getX(i) / 3 + 1)); pa.needsUpdate = true; }
  // nearest interactable
  let near = null, nd = 99; for (const s of W.spots) { const d = Math.hypot(s.x - me.x, s.z - me.z); if (d < s.r && d < nd) { nd = d; near = s; } }
  if (near !== W.near) { W.near = near; const p = $('prompt'); if (near) { p.textContent = near.label; p.style.display = 'block'; } else p.style.display = 'none'; }
  if (busy) $('prompt').style.display = 'none'; else if (W.near) $('prompt').style.display = 'block';
  if (!busy && W.near && I.aP) { sfx('uiok'); W.near.fn(); }
  else if (!busy && I.start) uiPlayer('attrs');
  // camera
  const portrait = innerWidth < innerHeight, back = portrait ? 7.5 : 6.2, up = portrait ? 3.8 : 3.1;
  let cx = me.x - fx * back, cz = me.z - fz * back;
  // don't let the camera sit inside a building: pull it in until it is clear
  for (let b = back; b > 1.2; b -= 0.6) { cx = me.x - fx * b; cz = me.z - fz * b; if (!W.solids.some(s => cx > s[0] + 0.2 && cx < s[1] - 0.2 && cz > s[2] + 0.2 && cz < s[3] - 0.2)) break; }
  if (W.kind !== 'hub') { cx = clamp(cx, W.bounds[0] - (W.kind === 'crib' ? 6 : 0.3), W.bounds[1] + (W.kind === 'crib' ? 6 : 0.3)); cz = clamp(cz, W.bounds[2] - (W.kind === 'crib' ? 1 : 0.3), W.bounds[3] + (W.kind === 'crib' ? 6 : 0.4)); }
  if (W.look) {   // shop / closet: swing round to look at your drip
    const mfx = Math.sin(me.face), mfz = Math.cos(me.face), sx = mfz, sz = -mfx;
    if (portrait) { _v.set(me.x + mfx * 5.6, 0.6, me.z + mfz * 5.6); camera.position.lerp(_v, 1 - Math.exp(-6 * dt)); camera.lookAt(me.x, -0.6, me.z); }
    else { _v.set(me.x + mfx * 4.2 + sx * 1.6, 1.3, me.z + mfz * 4.2 + sz * 1.6); camera.position.lerp(_v, 1 - Math.exp(-6 * dt)); camera.lookAt(me.x + sx * 1.6, 1.0, me.z + sz * 1.6); }
    return;
  }
  _v.set(cx, up, cz); if (!W.camInit) { camera.position.copy(_v); W.camInit = true; } else camera.position.lerp(_v, 1 - Math.exp(-7 * dt));
  camera.lookAt(me.x + fx * 2, 1.7, me.z + fz * 2);
}

function startPractice(kind) {
  const fl = cribTier('floor'), back = W.kind;
  uiClose(); document.body.dataset.state = 'match';
  startMatch({ mode: { n: kind === 'rack' ? 'MONEY RACK' : 'SHOOT AROUND', size: 1, arcade: false, to: 999 }, tier: TIERS_COURT[0], practice: kind, court: kind === 'rack' ? 'street' : ['drive', 'black', 'show', 'wood'][fl], hoopTier: kind === 'rack' ? 1 : cribTier('hoop'), ball: S.worn.ball,
    teams: [[{ b: myBuild(), ctrl: 0, mine: true }], []], onEnd: res => afterPractice(res, back) });
}
