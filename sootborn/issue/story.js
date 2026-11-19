//@@OBJECTIVE
  function objective() {
    let t = '', g = null;
    if (S.enc) t = S.enc.id === 'boss' ? 'CAPTAIN ROOK HOLDS MOORING ONE. TAKE IT.' : 'PUT THE DOCK GUARD DOWN';
    else if (!F.path) { t = 'STEP ONTO THE CHALKED SUN'; g = CROSS.alley; }
    else if (!F.e_alley) t = 'PUT THE DOCK GUARD DOWN';
    else if (!F.e_street) { t = 'OUT ONTO THE QUAY'; g = { x: 0, y: 0, z: 12 }; }
    else if (!F.gate) { t = 'HIGH DOCKS FREIGHT: OPEN THE YARD GATE'; g = { x: 18, y: 0, z: 7 }; }
    else if (!F.e_yard) { t = 'CROSS THE FREIGHT YARD'; g = { x: 19, y: 0, z: -8 }; }
    else if (!F.breaker) { t = 'THROW THE WINCH BREAKER TO RAISE THE SHUTTER'; g = { x: 31.2, y: 0, z: -8 }; }
    else if (!F.e_wh) { t = 'GO THROUGH THE BOND HOUSE'; g = { x: 3, y: 0, z: -6.5 }; }
    else if (!F.ledger) { t = 'SEARCH THE DOCK OFFICE UP THE STAIRS'; g = { x: -27.4, y: 4, z: -8.7 }; }
    else if (!F.hatch) { t = 'TAKE THE BACK STAIRS TO THE ROOF'; g = { x: -13.6, y: 8, z: -18.2 }; }
    else if (!F.e_roof && !F.bossIntro) { t = 'CROSS THE PLANK TO THE NEXT ROOF'; g = { x: -26, y: 9, z: -24 }; }
    else if (!F.boss) { t = 'MOORING ONE. THE LAST PAIR.'; g = { x: 2, y: 11, z: -34.2 }; }
    else if (!F.cut) { t = 'CUT THE LAST MOORING'; g = { x: MOOR.x, y: 11, z: MOOR.z }; }
    U.objective(t); S.goal = g;
  }
//@@ENCDONE
  function encDone(id) {
    setFlag('e_' + id);
    if (id === 'alley') U.toast('DOCK GUARD. ON THE STAIR ALREADY, WITH THEIR LAMPS LIT.', 3.5);
    if (id === 'street') { F.key = 1; save(); SC.audio.sfx('clue'); U.toast('THE STAIR BLADE CARRIED A *YARD KEY*. HIGH DOCKS FREIGHT.', 4); }
    if (id === 'yard') U.toast('THE SHUTTER IS DOWN. THERE WILL BE A *WINCH BREAKER*.', 3.5);
    if (id === 'wh') U.toast('QUIET. THE *DOCK OFFICE* IS UP THE STAIRS.', 3.5);
    if (id === 'roof') U.toast('ONE ROOF LEFT. MOORING ONE.', 3);
  }
//@@CROSSING
  /* ---------- what he remembers ---------- */
  const A_ = k => (SC.assets || {})[k] || null;
  const ARTS = [
    { k: 'furnace1', name: 'ELEVEN', line: 'ELEVEN SECONDS THE DOORS STOOD OPEN. I HAVE COUNTED THEM EVERY DAY FOR SEVEN YEARS.' },
    { k: 'ledger2', name: 'HER LINE', line: 'HOLLOWAY, S. STRUCK THROUGH IN A CLERK\'S HAND. I KEEP THAT BOOK NOW.' },
    { k: 'hands0', name: 'A RING', line: 'IT WAS THE ONLY ROUND THING I OWNED. SHE WORE IT ELEVEN MONTHS.' },
    { k: 'desk2', name: 'BALANCED', line: 'ELEVEN HUNDRED LINES AT ONE STROKE. THEY CALLED IT A BALANCING.' },
    { k: 'tin0', name: 'THE INVOICE', line: 'THEY SENT A TIN. AND A BILL FOR THE FUEL.' }
  ];
  const FIN = {
    count: { k: 'furnace2', name: 'ELEVEN', line: 'ONE. TWO. THREE. I COUNT THE SECONDS THE DOORS STOOD OPEN. THEN I GO TO WORK.' },
    warden: { k: 'furnace0', name: 'FOR HUMMING', line: 'A WARDEN STRUCK A WELDER DOWN FOR HUMMING HER GOODBYE. I WAS HELD ON THE FLOOR FOR IT.' },
    boss: { k: 'kael0', name: 'STRUCK THROUGH', line: 'I LEARNED TO COUNT THE WAY THEY DO. NOW I DO THE STRIKING.' }
  };
  const art = a => ({ img: A_(a.k), name: a.name, line: a.line });
  /* the question marks: what he sees, then what it makes him remember */
  const MEM = {
    casings: [{ k: 'desk5', cap: 'THAT AFTERNOON. THE COUNT.', cap2: 'I WROTE THE ROTA AT MY DESK. MAREN ALDANE TOOK IT FOR COPYING. *SHE HAD NEVER OFFERED TO COPY ANYTHING BEFORE.*' }],
    bike: [{ k: 'freight0', cap: 'LAST NIGHT. FREIGHT THREE.', cap2: '"IF THE NINE MINUTES ARE NOT THERE, THE STAIR WILL WANT HOLDING. *I HOLD IT.*"' }, { k: 'dockstair0', cap2: 'BRAND SAID IT LIKE A MAN READING OUT A LINE THAT WAS ALREADY WRITTEN.' }],
    masks: [{ k: 'furnace0', cap: 'YEAR NOUGHT. THE HEART-FURNACE.', cap2: 'A WARDEN PUT A HALBERD BUTT INTO HOLLIS FOR HUMMING. *THAT WARDEN IS HOLDING THE STAIR BEHIND ME.*' }],
    ledger: [{ k: 'desk4', cap: 'TWO YEARS AGO. THE MORNING AFTER RISER NINE.', cap2: '"SOMEONE WHO HAD DONE IT BEFORE," CADE SAID. HE LOOKED AT ME FOR AS LONG AS IT TAKES TO COUNT TO ELEVEN.' }, { k: 'ledger2', cap2: 'FOUR HUNDRED AND SIX LINES I HAVE STRUCK MYSELF. *I LEARNED EVERY ONE.*' }],
    lintel: [{ k: 'under0', cap: 'FIVE YEARS AGO. THE OLD TUNNEL.', cap2: 'DACE CHALKED TWO WORDS WHERE THE AUTHORITY WOULD NEVER LOOK. *STILL FLOWING.* THE AIR WENT UP. IT HAS ALWAYS GONE UP.' }],
    shoe: [{ k: 'ward0', cap: 'THE FEVER WARD. TIER SIX.', cap2: 'FORTY BEDS. FORTY CHILDREN BREATHING BECAUSE OF HER. *THE NUMBER FOLLOWS ME ABOUT.*' }],
    plates: [{ k: 'row0', cap: 'ROW K.', cap2: 'MARA KNELT AT FORTY-FOUR COMMITMENTS AND COUNTED EVERY ONE. *SHE STOOD UP AT THE FORTY-FIFTH.*' }],
    halberd: [{ k: 'dockstair0', cap: 'TWO YEARS AGO. THE DOCK STAIR.', cap2: 'ELEVEN MINUTES. SOMEBODY TIMED IT. *I ASKED THEM TO.*' }],
    loft: [{ k: 'lift0', cap: 'LAST YEAR. HER ROOM.', cap2: 'I HUMMED THE SHIFT SONG AT HER VALVE AND DID NOT HEAR MYSELF. *SHE HAS KNOWN SINCE.*' }, { k: 'hands0', cap2: 'THE WASHER IS UNDER MY COLLAR. IT HAS NOT GOT ANY HEAVIER.' }]
  };
  function pagesOf(list, done) {
    const m = (list || []).filter(p => A_(p.k)); if (!m.length) { done(); return; }
    const wide = window.innerWidth > window.innerHeight * 1.35 && m.length > 1;
    U.page({ cols: wide ? '1fr 1fr' : '1fr', rows: wide || m.length < 2 ? '1fr' : '1fr 1fr',
      panels: m.map((p, i) => ({ img: A_(p.k), cls: 'px', area: wide ? '1 / ' + (i + 1) + ' / 2 / ' + (i + 2) : (i + 1) + ' / 1 / ' + (i + 2) + ' / 2', cap: p.cap, cap2: p.cap2 })) }, done);
  }
  function sayThenMemory(id, lines, done) { U.say(lines, () => pagesOf(MEM[id], done)); }
  /* every chalked sun is a different thing he cannot put down: below, the Assay, and the two women */
  const SUN = {
    docks: {
      yard: { fury: 1, toast: 'THE WASHER. *FURY.*', p: [
        { k: 'desk3', cap: 'THE EAST MANIFOLD. LAST YEAR.', cap2: 'WREN HALLORAN TURNED MY HAND OVER AND SAW THE VALVE BURNS THE GILDING DID NOT TAKE. *SHE DID NOT ASK.*' },
        { k: 'hands0', cap2: 'THE WASHER WAS UNDER MY COLLAR. I WAITED FOR IT TO GET HEAVIER. *IT DID NOT, AND I HAVE NOT FORGIVEN IT.*' }] },
      roof: { toast: 'ELEVEN SECONDS. SAVED. HEALED.', p: [
        { k: 'assay0', cap: 'THE ASSAY. THREE YEARS AGO.', cap2: 'TWO SEALED IN A ROOM, ONE COMES OUT A CADET. TEO ALDANE SHARED HIS BREAD ON THE LIFT. *"I HOPE SHE WAS WORTH IT."*' },
        { k: 'ward0', cap: 'TIER SIX. THE FEVER WARD.', cap2: 'THE NIGHT THE FEVER BROKE, TAVI ASKED FOR BREAD. I NEVER TOLD TEO THERE WAS A SHE. *THERE WERE FORTY BEDS, AND A SHE.*' }] } },
    riser: {
      yard: { fury: 1, toast: 'HANDS. *FURY.*', p: [
        { k: 'desk3', cap: 'THIS VALLEY. NIGHT TWENTY-FIVE OF THE ASSAY.', cap2: 'AN APPRENTICE KEPT THE VENT STACK AT THIS PUMP HOUSE. SHE NEVER SAW MY FACE. *SHE PUT HER HAND ON THE PIPE THE WAY I DO.*' },
        { k: 'furnace2', cap2: 'SEREN TAUGHT ME THAT. HANDS, KAEL. EVERYTHING IS HANDS. *I HAD NOT KNOWN ANYONE ABOVE THE ROCK COULD LEARN IT.*' }] } },
    stair: {
      yard: { toast: 'ELEVEN SECONDS. SAVED. HEALED.', p: [
        { k: 'assay0', cap: 'THE LAST DAY OF THE ASSAY.', cap2: 'I TOOK A KEEP FROM THE HIGH AUDITOR\'S SON WHILE SHE WATCHED. SHE PINNED A SUN ON ME FOR IT. *SHE SAID I REMINDED HER OF SOMEONE.*' },
        { k: 'lift0', cap: 'ASHGATE SQUARE. NINE YEARS AGO.', cap2: 'THE FIRST TIME SHE LOOKED AT ME I WAS KNEELING WITH EVERYONE I KNEW. "A THIEF WHO TIDIES." *SHE HAS FORGOTTEN IT. I HAVE NOT.*' }] },
      roof: { fury: 1, toast: 'A SHELF CAN BE MADE LONGER. *FURY.*', p: [
        { k: 'weather2', cap: 'THE RAIL OF A BARGE. THIS YEAR.', cap2: '"I AM NOT ASKING FOR HER PLACE." "THERE IS NOT A PLACE. THERE IS A SHELF."' },
        { k: 'tin0', cap2: 'SEREN WOULD HAVE HECKLED. THEN SHE WOULD HAVE MOVED UP. *EVERY BREATH IS STILL HERS. THERE TURNED OUT TO BE A GREAT MANY OF THEM.*' }] } }
  };
  /* a chalked sun: he counts eleven. The first time, the count is what starts him. */
  function crossing(id) {
    return function () {
      const first = !F.path; S.cp = id; pl.hp = SC.T.hp; pl.chance = 1; SC.audio.sfx('clue');
      if (first) { pl.control = false; pl.setPath('ember'); F.path = 'ember'; save(); U.memory(art(FIN.count), bargain); }
      else { save(); FX.ring(pl.pos, 0xffe14a, 0.5, 3, 0.5); const sm = (SUN[SC.issue] || {})[id];
        if (sm && !F['sun_' + id]) { F['sun_' + id] = 1; save(); pl.control = false; pagesOf(sm.p, () => { pl.control = true; if (sm.fury) pl.gain(50); U.toast(sm.toast, 3.2); objective(); }); }
        else { U.toast('ELEVEN SECONDS. SAVED. HEALED. YOUR BREATH IS BACK.', 2.6); objective(); } }
    };
  }
//@@CUTSCENES
  /* ---------- cutscenes ---------- */
  let clerk, barge, cable = { visible: true };
  const MOOR = { x: 16, z: -23.4 };
  function showClerk(x, y, z, yaw) { clerk.group.visible = true; clerk.group.position.set(x, y, z); clerk.group.rotation.y = yaw; clerk.anim.apply(P.clerk(0), 999, 0.016); }
  function hideClerk() { clerk.group.visible = false; }
  function shot(px, py, pz, lx, ly, lz, fov, w, h) { const c = G.camera; c.position.set(px, py, pz); c.fov = fov; c.updateProjectionMatrix(); c.lookAt(lx, ly, lz); return G.snap(w || 768, h || 432); }
  /* Brand keeps the head of the dock stair, at the blind end of Bond Alley, for the whole issue. */
  function brandOnStair() { showClerk(2.7, 0, 42.4, Math.PI * 0.9); }   // to one side of the stair head: he was standing where the camera is

  function intro() {
    SC.state = 'play'; U.showHud(false); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; pl.faceOverride = 'shock';
    pl.place(0.3, 0, 40.2, Math.PI * 0.92); pl.model.anim.apply(P.idle(0), 999, 0.016); pl.model.face('shock'); pl.model.group.updateMatrixWorld(true);
    showClerk(1.3, 0, 38.4, -0.5); clerk.group.updateMatrixWorld(true);
    const a = shot(2.7, 6.4, 33.2, 0.4, 0.6, 39.6, 40, 768, 720);
    const b = shot(-0.6, 1.5, 36.2, 1.3, 1.85, 38.4, 30);
    pl.model.face('angry'); const hd = pl.model.head.getWorldPosition(v3());
    const c = shot(hd.x - 0.35, hd.y + 0.12, hd.z - 1.25, hd.x, hd.y, hd.z, 27);
    pl.model.expr = null;
    U.page({ cols: '1.25fr 1fr', rows: '1fr 1fr', panels: [
      { img: a, area: '1 / 1 / 3 / 2', cap: 'THE HIGH DOCKS. SEVEN YEARS AFTER THE FURNACE.', cap2: 'FOUR HUNDRED BARGES, MOORED IN PAIRS. CUT THE PAIRS AND THE WIND DOES THE REST.', fx: 'BONG!' },
      { img: b, area: '1 / 2 / 2 / 3', cap2: 'THE SECOND BELL. NINE MINUTES WHEN NOBODY LOOKS AT THE STAIR. *I WROTE THE ROTA MYSELF.*' },
      { img: c, area: '2 / 2 / 3 / 3', cap: 'THE LAMPS WERE ALREADY LIT.', cap2: 'SOMEBODY HAD TOLD THEM THE HOUR.' }
    ] }, wake);
  }
  function wake() {
    SC.emit('letterbox', true); pl.st = 0; pl.scriptRate = 7; pl.faceOverride = 'neutral'; pl.script = t => P.idle(t);
    cam.move(v3(-2.3, 1.0, 42.3), v3(0.6, 1.4, 39.4), v3(-2.5, 1.6, 36.6), v3(0.8, 1.4, 39.1), 3.4, 44);
    run([1.6, n => { pl.yaw = Math.PI * 0.95; U.say([
        { who: 'clerk', text: 'Lamps, Brennick. Trimmed and lit. *They were told the hour.*' },
        { who: 'hero', face: 'shock', text: 'I wrote that rota. It was nine minutes.' },
        { who: 'clerk', text: 'It is no minutes. I hold the stair. You cut the moorings. *Mooring One* is the last pair, on the far roof.' },
        { who: 'hero', face: 'angry', text: 'Brand.' },
        { who: 'clerk', text: 'You do not argue, and you do not come back for me. Count your eleven, decide how you mean to fight, and *go*.' }
      ], n); },
      n => { brandOnStair(); SC.emit('letterbox', false); pl.faceOverride = null; pl.setState('idle'); pl.control = true; cam.snapBehind(Math.PI); cam.endCine(0.9); U.showHud(true); setFlag('intro');
        U.toast(SC.hosted ? 'DRAG THE PICTURE TO LOOK ROUND. *A* CUTS AND USES; HELD, THREE HEAVY BLOWS. *B* DODGES.' : SC.input.touch ? 'LEFT THUMB MOVES. DRAG THE RIGHT SIDE TO TURN THE CAMERA.' : 'WASD MOVES. DRAG THE MOUSE OR USE THE ARROWS TO TURN THE CAMERA.', 5); n(); }]);
  }
  function bossIntro() {
    const again = F.bossIntro; F.bossIntro = 1; save(); pl.control = false; pl.setState('scripted'); pl.script = t => P.guard(t); pl.scriptRate = 6; U.showHud(false); SC.emit('letterbox', true); cam.lock = null;
    const e = SC.spawnEnemy('boss', 22, 11, -34, ENC.boss); e.state = 'wait'; e.model.group.scale.set(1, 1, 1); e.yaw = -Math.PI / 2; S.bossE = e;
    pl.yaw = Math.PI / 2;
    cam.move(v3(26.5, 12.1, -31.5), v3(22, 12.9, -34), v3(18.6, 11.9, -32.2), v3(22, 12.6, -34), 4.5, 40);
    const lines = again ? [{ who: 'voss', text: 'The clerk again. One had you marked down as *struck*.' }, { who: 'hero', face: 'angry', text: 'Check your figures, Captain.' }] : [
      { who: 'voss', text: 'Clerk Sorrel. One was told a clerk would come to the moorings at the second bell. One did not believe it.' },
      { who: 'hero', face: 'angry', text: 'Count your guard again, Captain. You are short.' },
      { who: 'voss', text: 'Four hundred hulls and one clerk. It is *noted*. Marshal Cade will have your hands for it.' },
      { who: 'hero', face: 'smirk', text: 'He can come up the stair and ask for them.' }];
    run([0.8, n => U.say(lines, n), n => { SC.emit('letterbox', false); pl.setState('idle'); pl.control = true; cam.endCine(0.8); U.showHud(true); e.state = 'chase'; e.st = 0; e.cool = 1.2;
      S.enc = ENC.boss; ENC.boss.wave = 0; ENC.boss.wait = 0; U.boss(e, 'STAIR CAPTAIN ANSEL ROOK'); objective(); n(); }]);
  }
  /* Rook is down. The level is not over until the last pair is cut. */
  function ending(e) {
    S.enc = null; U.boss(null); SC.clearEnemies(); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 5;
    run([0.5, n => U.say([
        { who: 'voss', text: 'It does not... balance. You were *one of us*. One sat at table with you.' },
        { who: 'hero', face: 'angry', text: 'I was never one of you. I only learned to count like you.' }
      ], n),
      n => { pl.setState('idle'); pl.control = true; setFlag('boss'); U.toast('THE GAFF IS ON THE CLEAT. *CUT THE LAST MOORING.*', 4); n(); }]);
  }
  function finale() {
    setFlag('cut'); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 5; U.showHud(false); SC.emit('letterbox', true);
    pl.place(MOOR.x, 11, MOOR.z - 0.9, 0); cable.visible = false; S.drift = 0.0001;
    const p = v3(MOOR.x, 11, MOOR.z); FX.burst(v3(p.x, 12, p.z + 1), 0xffd23a, 1.6); FX.word('SNAP!', v3(p.x, 13.2, p.z + 1), '#ffe14a', 2.2); cam.shake(0.6); SC.audio.sfx('door');
    cam.move(v3(p.x - 4.2, 12.3, p.z - 5.2), v3(p.x + 1, 15, p.z + 8), v3(p.x - 5.4, 13, p.z - 6.6), v3(p.x + 6, 21, p.z + 16), 11, 46);
    run([1.6, n => U.say([
        { who: 'cap', text: 'The last pair went out on the wind like the rest. Four hundred hulls, and not one lamp on any of them.' },
        { who: 'cap', text: 'Below me the dock stair was full of light. It should have been dark. I had written the hour myself.' },
        { who: 'hero', face: 'shock', text: 'Brand.' },
        { who: 'cap', text: 'Then a halberd butt struck stone at the foot of the stair. Once. Brand was counting them.' }
      ], n), 0.8,
      n => { S.done = true; if (SC.hosted) { S.wipe(); SC.host('done', { time: S.time, kills: pl.stats.kills, clues: pl.echoes }); return; }
        U.end({ time: S.time, path: SC.PATHS[pl.path].name, kills: pl.stats.kills, finishers: pl.stats.finishers, perfect: pl.stats.perfect, chances: pl.stats.chances, clues: pl.echoes }, () => { S.wipe(); if (!SC.host('done', { time: S.time, kills: pl.stats.kills, clues: pl.echoes })) { SC.emit('letterbox', false); cam.mode = 'follow'; S.newGame(); } }); n(); }]);
  }

  function makeBarge() {
    const hullM = G.toon({ map: G.tex.wood, color: 0x6e5a48 }), bagM = G.toon({ color: 0xefe8d4 }), giltM = G.toon({ color: 0xe8c25a }), darkM = G.toon({ color: 0x23232e });
    const g = new THREE.Group(), put = (geo, mat, x, y, z, t, rz) => { const o = G.inked(geo, mat, t === undefined ? 0.08 : t); o.position.set(x, y, z); if (rz) o.rotation.z = rz; g.add(o); return o; };
    put(new THREE.BoxGeometry(15, 2.2, 5.2), hullM, 0, 0, 0); put(new THREE.BoxGeometry(15.6, 0.3, 5.6), giltM, 0, 1.1, 0, 0.05);
    put(new THREE.BoxGeometry(2.6, 1.6, 4.4), hullM, -8.6, 0.5, 0, 0.08, 0.5); put(new THREE.BoxGeometry(2.6, 1.6, 4.4), hullM, 8.6, 0.5, 0, 0.08, -0.5);
    put(new THREE.BoxGeometry(4.2, 1.8, 3), bagM, 3.6, 2.2, 0); put(new THREE.BoxGeometry(4.6, 0.25, 3.4), darkM, 3.6, 3.2, 0, 0.05);
    const bag = put(new THREE.CylinderGeometry(2.7, 2.7, 15, 10), bagM, 0, 7.6, 0, 0.1); bag.rotation.z = Math.PI / 2;
    [-7.5, 7.5].forEach(x => { const c = put(new THREE.ConeGeometry(2.7, 2.6, 10), bagM, x + Math.sign(x) * 1.3, 7.6, 0, 0.1); c.rotation.z = -Math.sign(x) * Math.PI / 2; });
    [-4.4, 0, 4.4].forEach(x => put(new THREE.CylinderGeometry(2.76, 2.76, 0.35, 10), giltM, x, 7.6, 0, 0).rotation.z = Math.PI / 2);
    [[-5.5, 2.2], [5.5, 2.2], [-5.5, -2.2], [5.5, -2.2]].forEach(p => put(new THREE.BoxGeometry(0.14, 4.2, 0.14), darkM, p[0], 3.2, p[1], 0.03));
    const lampM = new THREE.MeshBasicMaterial({ color: 0x5ff2e2, fog: false });
    [[-7.4, 2.7], [7.4, 2.7], [-7.4, -2.7], [7.4, -2.7]].forEach(p => put(new THREE.BoxGeometry(0.34, 0.34, 0.34), lampM, p[0], 1.5, p[1], 0.03));
    return g;
  }
//@@SUNS
    // a chalked sun works when he steps onto it; nothing to press
    { let on = null; if (F.intro && !S.enc) for (const id in CROSS) { const c = CROSS[id]; if (Math.abs(y - c.y) < 1.2 && Math.hypot(x - c.x, z - c.z) < 1.5) on = id; }
      if (on && S.onSun !== on) { const still = Math.hypot(pl.vel.x, pl.vel.z) < 1.6 && (pl.state === 'idle' || pl.state === 'run'), now = S.time; if (!still || S.sunId !== on) { if (S.sunId !== on && !S.sunHint) { S.sunHint = 1; U.toast('STAND ON THE SUN', 2.2); } S.sunId = on; S.sunAt = now; } else { const k = (now - S.sunAt) / 0.9; if (((now * 8) | 0) !== S.sunTick) { S.sunTick = (now * 8) | 0; FX.ring(pl.pos, 0xffe14a, Math.max(0.4, 1.6 - k * 1.2), 0.3, 0.2); } if (k >= 1) { S.onSun = on; S.sunId = null; crossing(on)(); return; } } } if (!on) { S.onSun = null; S.sunId = null; } }
//@@INIT
  S.init = function () {
    clerk = S.clerk = SC.makeHumanoid('clerk'); G.scene.add(clerk.group); clerk.group.visible = false;
    W.dyn.push(t => { if (clerk.group.visible) clerk.anim.apply(P.clerk(t), 6, 0.016); });
    pl.model.setGlow(0xf6f2e6, '#f6f2e6');
    // the last pair, riding over the freight yard on one line from Mooring One
    barge = S.barge = makeBarge(); barge.position.set(MOOR.x + 2, 17.5, -11.5); barge.rotation.y = 0.18; G.scene.add(barge);
    const pair = makeBarge(); pair.position.set(MOOR.x - 20, 25, 4); pair.rotation.y = -0.5; G.scene.add(pair);
    { const a = v3(MOOR.x, 11.9, -22.2), b = v3(MOOR.x + 1, 16.6, -14), len = a.distanceTo(b);
      cable = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len, 5), new THREE.MeshBasicMaterial({ color: G.INK })); cable.position.copy(a).add(b).multiplyScalar(0.5);
      cable.quaternion.setFromUnitVectors(v3(0, 1, 0), b.clone().sub(a).normalize()); G.scene.add(cable); }
    W.dyn.push((t, dt) => {
      if (S.drift) { S.drift += dt; const k = S.drift; barge.position.set(MOOR.x + 2 + k * k * 0.22, 17.5 + k * 0.9, -11.5 + k * 1.6); barge.rotation.y = 0.18 + k * 0.03; barge.rotation.z = Math.sin(k * 0.9) * 0.04; }
      else { barge.position.y = 17.5 + Math.sin(t * 0.7) * 0.25; barge.rotation.z = Math.sin(t * 0.5) * 0.02; }
      pair.position.y = 25 + Math.sin(t * 0.6 + 2) * 0.3;
    });
    // chalked suns: where he counts eleven
    Object.keys(CROSS).forEach(id => {
      const c = CROSS[id], mk = (tex, s, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(c.x, c.y + 0.05, c.z); m.renderOrder = 3; G.scene.add(m); return m; };
      const a = mk(G.tex.ring, 3.4, 0xffe14a, 0.9), b = mk(G.tex.disc, 2.3, 0xffe14a, 0.35);
      W.dyn.push(t => { a.rotation.z = t * 0.25; const col = pl.path ? SC.PATHS[pl.path].color : 0xffe14a; a.material.color.set(col); b.material.color.set(col); b.material.opacity = 0.25 + Math.sin(t * 3) * 0.12; });
      W.addInteract({ id: 'x_' + id, x: c.x, y: c.y, z: c.z, r: 1.9, label: 'COUNT ELEVEN', act: crossing(id), when: () => false });
    });
    W.addInteract({ id: 'casings', x: 1.5, y: 0, z: 38.8, r: 1.45, label: 'LOOK', marker: 'clue', mh: 1.1, when: () => F.path && !F.clue_casings, act: clue('casings', [
      { who: 'cap', text: 'A watch lamp on the stones. The wick is trimmed and the well is full.' },
      { who: 'hero', face: 'hurt', text: 'Nobody trims a lamp for a watch that is about to go off. They were *waiting*.' }]) });
    W.addInteract({ id: 'bike', x: 9.2, y: 0, z: 13.7, fx: 9.3, fz: 15, r: 1.45, label: 'LOOK', marker: 'clue', mh: 1.4, when: () => F.e_alley && !F.clue_bike, act: clue('bike', [
      { who: 'cap', text: 'The watch board, face down by a spilled sled. My rota, chalked up fair. I know my own sevens.' },
      { who: 'hero', text: 'The second bell is struck through. Somebody has chalked *FIRST* over it.' }]) });
    W.addInteract({ id: 'masks', x: 21, y: 0, z: -16.3, fx: 21, fz: -18.4, r: 1.45, label: 'LOOK', marker: 'clue', mh: 1.6, when: () => F.e_yard && !F.clue_masks, act: clue('masks', [
      { who: 'cap', text: 'The freight box is full of crates. The crates are full of halberds, forty to a crate, greased and tagged for tonight.' },
      { who: 'hero', face: 'shock', text: 'Nobody needs forty halberds to guard a barge. This was never a watch. It is a *stair party*.' }]) });
    W.addInteract({ id: 'ledger', x: -27.2, y: 4, z: -8.7, fx: -29, fz: -8.7, r: 1.45, label: 'SEARCH', marker: 'clue', mh: 1.8, when: () => F.e_wh && !F.ledger, act: clue('ledger', [
      { who: 'cap', text: 'The dock log, open under the lamp. An entry at the first bell, in the Stair Captain\'s hand.' },
      { who: 'hero', face: 'angry', text: '"By order, the Clerk\'s rota is set aside. In the Dockmaster\'s absence *Rook* holds the moorings." Initialled by Marshal Cade.' },
      { who: 'cap', text: 'Somebody gave Cade the hour. I did not have the time to wonder who. Clipped to the page: a key marked ROOF.' }], () => { setFlag('ledger'); U.toast('*ROOF KEY* TAKEN. THE BACK STAIRS GO UP.', 3.5); }) });
    W.addInteract({ id: 'loft', x: -27.8, y: 9, z: -26.7, fx: -29.7, fz: -26.7, r: 1.45, label: 'LOOK', marker: 'clue', mh: 1.8, when: () => !F.clue_loft, act: clue('loft', [
      { who: 'cap', text: 'A signal hut. The lamp inside is aimed straight down the Spire, and the glass is still warm.' },
      { who: 'hero', text: 'They did not only know. They *answered*. Every Warden under the docks is on that stair by now.' }]) });
    W.addInteract({ id: 'gate', x: 18, y: 0, z: 7.1, fx: 18, fz: 5.8, r: 2.2, label: 'OPEN GATE', marker: 'act', mh: 2.6, when: () => F.e_alley && !F.gate, act: () => {
      if (!F.key) { U.toast('LOCKED. SOMEBODY ON THIS QUAY CARRIES THE KEY.', 2.6); SC.audio.sfx('deny'); return; }
      W.openDoor('gate'); SC.audio.sfx('door'); setFlag('gate'); U.toast('THE GATE ROLLS BACK.', 2); } });
    W.addInteract({ id: 'breaker', x: 31.1, y: 0, z: -8, fx: 32, fz: -8, r: 2, label: 'BREAKER', marker: 'act', mh: 2.6, when: () => F.e_yard && !F.breaker, act: () => {
      setFlag('breaker'); W.openDoor('shutter'); SC.audio.sfx('door'); pl.control = false; U.showHud(false); SC.emit('letterbox', true);
      cam.move(v3(13.5, 2.2, -3.2), v3(5.7, 1.6, -6.5), v3(11.5, 1.7, -4.4), v3(5.7, 2.6, -6.5), 2.2, 44);
      run([2.3, n => { SC.emit('letterbox', false); cam.endCine(0.6); U.showHud(true); pl.control = true; n(); }]); } });
    W.addInteract({ id: 'hatch', x: -13.5, y: 8.1, z: -18.2, fx: -12.5, fz: -18.2, r: 1.8, label: 'ROOF DOOR', marker: 'act', mh: 2.2, when: () => F.e_wh && !F.hatch, act: () => {
      if (!F.ledger) { U.toast('LOCKED. THE KEY WILL BE IN THE *DOCK OFFICE*.', 2.6); SC.audio.sfx('deny'); return; }
      W.openDoor('hatch'); SC.audio.sfx('door'); setFlag('hatch'); } });
    W.addInteract({ id: 'moor', x: MOOR.x, y: 11, z: MOOR.z, r: 2.4, label: 'CUT THE LINE', marker: 'act', mh: 2.4, when: () => F.boss && !F.cut, act: finale });
    SC.on('power', () => { S.artN = (S.artN || 0) + 1; U.memory(art(ARTS[(S.artN - 1) % ARTS.length])); });
    SC.on('finisherStart', e => { if (e.kind === 'boss') U.memory(art(FIN.boss)); else { S.finN = (S.finN || 0) + 1; if (S.finN <= 2) U.memory(art(FIN.warden)); } });
    SC.on('dazed', e => { if (!F.tutFinish) { F.tutFinish = 1; U.toast(SC.hosted ? 'WIDE OPEN. GET CLOSE AND PRESS *A* TO FINISH IT.' : 'WIDE OPEN. GET CLOSE AND HIT *INTERACT* TO FINISH IT.', 4); } });
    SC.on('secondchance', () => SC.after(1.4, () => U.toast('*ON MY BREATH.* ONCE. A CHALKED SUN GIVES IT BACK.', 3.5)));
    SC.on('dead', () => SC.after(1.7, () => U.dead(S.load)));
    SC.on('kill', e => { if (e.kind === 'boss') S.bossDown = true; });
    SC.on('finisherEnd', e => { if (e.kind === 'boss') ending(e); });
    SC.on('bossPhase', e => { SC.spawnEnemy('hollow', e.pos.x + 3, 11, e.pos.z + 3, ENC.boss); SC.spawnEnemy('knifer', e.pos.x - 3, 11, e.pos.z - 3, ENC.boss); U.toast('"TO THE MOORINGS! HE IS ONE CLERK!"', 2.6); });
  };

//@@ALT
  /* ================= the other two levels: the same engine and the same man, a different night ================= */
  if (SC.issue === 'riser' || SC.issue === 'stair') {
    const RIS = SC.issue === 'riser', BY = RIS ? 0 : 18, done = () => { S.done = true; S.wipe(); if (!SC.host('done', { time: S.time, kills: pl.stats.kills, clues: pl.echoes })) U.end({ time: S.time, path: '', kills: pl.stats.kills, finishers: pl.stats.finishers, perfect: pl.stats.perfect, chances: pl.stats.chances, clues: pl.echoes }, () => { SC.emit('letterbox', false); cam.mode = 'follow'; S.newGame(); }); };
    for (const k in CROSS) delete CROSS[k]; for (const k in ENC) delete ENC[k];
    Object.assign(CROSS, RIS ? { alley: { x: 0, y: 0, z: 9, yaw: Math.PI }, yard: { x: -12, y: 0, z: 4, yaw: Math.PI } } : { alley: { x: 0, y: 0, z: 39, yaw: Math.PI }, yard: { x: 0, y: 6, z: 14.5, yaw: Math.PI }, roof: { x: 0, y: 12, z: -11, yaw: Math.PI } });
    Object.assign(ENC, RIS ? {
      alley: { arena: [-25, -22, 25, 22], floor: 0, waves: [[['hollow', -4, -14], ['hollow', 4, -15], ['hollow', 0, -17]]] },
      w2: { arena: [-25, -22, 25, 22], floor: 0, waves: [[['hollow', -12, -12], ['knifer', 10, -14], ['knifer', -2, -18], ['hollow', 14, -6]]] },
      w3: { arena: [-25, -22, 25, 22], floor: 0, waves: [[['bruiser', 0, -16], ['hollow', -8, -14], ['hollow', 8, -14]], [['bruiser', 6, -17], ['knifer', -10, -10], ['knifer', 12, -12]]] },
      boss: { arena: [-25, -22, 25, 22], floor: 0, waves: [[['boss', 0, -15]]] }
    } : {
      alley: { arena: [-9.6, 30.4, 9.6, 45.6], floor: 0, waves: [[['hollow', -3, 32], ['hollow', 3, 32], ['knifer', 0, 31.4]]] },
      l1: { arena: [-6.6, 4.4, 6.6, 17.6], floor: 6, waves: [[['knifer', -3, 7], ['knifer', 3, 7], ['hollow', 0, 6]], [['bruiser', 0, 6.4], ['hollow', -4, 8]]] },
      l2: { arena: [-6.6, -21.6, 6.6, -8.4], floor: 12, waves: [[['bruiser', -2, -19], ['bruiser', 3, -18]], [['knifer', -4, -19], ['knifer', 4, -19], ['hollow', 0, -20]]] },
      boss: { arena: [-9.4, -57, 9.4, -34.6], floor: 18, waves: [[['boss', 0, -50]]] }
    });
    Object.keys(ENC).forEach(k => { ENC[k].id = k; });
    const up = () => (F.e_w3 ? 30 : F.e_w2 ? 20 : F.e_alley ? 10 : 0);
    const tavi = (x, y, z, yaw) => { if (!RIS) showClerk(x, y, z, yaw === undefined ? Math.PI : yaw); };
    brandOnStair = function () { if (RIS) return; if (F.e_l2) tavi(-3, 18, -37); else if (F.e_l1) tavi(-2.5, 12, -10); else if (F.e_alley) tavi(-2.5, 6, 15); else tavi(-1.6, 0, 40.2, 2.4); };
    objective = function () {
      let t = '', g = null;
      if (RIS) {
        if (S.enc && S.enc.id === 'boss') t = 'THE WARDEN CAPTAIN. HE DOES NOT REACH THE HATCH.';
        else if (!F.path) { t = 'STEP ONTO THE CHALKED SUN'; g = CROSS.alley; }
        else if (F.boss) t = 'FORTY OF FORTY';
        else t = 'HOLD THE RISER · ' + up() + ' OF 40 UP';
      } else {
        if (S.enc) t = S.enc.id === 'boss' ? (S.stage2 ? 'OSWIN HALE. THE DOOR IS BEHIND HIM.' : "THE AUDITOR'S BLADE. THE DOOR IS BEHIND HIM.") : 'CLEAR THE LANDING';
        else if (!F.path) { t = 'STEP ONTO THE CHALKED SUN'; g = CROSS.alley; }
        else if (!F.e_alley) t = 'CLEAR THE TERRACE';
        else if (!F.e_l1) { t = 'UP THE FIRST FLIGHT'; g = { x: 0, y: 6, z: 12 }; }
        else if (!F.e_l2) { t = 'UP THE SECOND FLIGHT'; g = { x: 0, y: 12, z: -13 }; }
        else if (!F.boss) { t = 'THE LAST FLIGHT. THE WHITE DOOR.'; g = { x: 0, y: 18, z: -40 }; }
      }
      U.objective(t); S.goal = g;
    };
    S.objective = objective;
    encDone = function (id) {
      setFlag('e_' + id); S.pending = false;
      if (RIS) { S.walk = 0.001; U.toast('*' + ['TEN', 'TWENTY', 'THIRTY'][up() / 10 - 1] + '* UP THE RISER. THEY GO UP THE HILL ROAD WITH THEIR LAMPS OUT.', 3.6); SC.audio.sfx('clue'); }
      else { brandOnStair(); U.toast(id === 'alley' ? 'THE TERRACE IS OURS. *UP.*' : id === 'l1' ? 'TAVI: "ON YOUR LEFT. KEEP GOING."' : 'ONE FLIGHT LEFT. *THE WHITE DOOR.*', 3.4); }
    };
    const begin = () => { SC.emit('letterbox', false); pl.faceOverride = null; pl.setState('idle'); pl.control = true; cam.mode = 'follow'; cam.snapBehind(Math.PI); U.showHud(true); setFlag('intro');
      U.toast(SC.hosted ? 'DRAG THE PICTURE TO LOOK ROUND. *A* CUTS; HELD, THREE HEAVY BLOWS. *JUMP*, HELD, HOVERS.' : 'WASD MOVES. J STRIKES. K DODGES. F IS THE BOOTS.', 5.5); };
    intro = function () {
      SC.state = 'play'; U.showHud(false); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; pl.faceOverride = 'angry';
      pl.place(0, 0, RIS ? 5.5 : 41, Math.PI); pl.model.anim.apply(P.idle(0), 999, 0.016); pl.model.face('angry'); pl.model.group.updateMatrixWorld(true); brandOnStair(); if (clerk) clerk.group.updateMatrixWorld(true);
      const pg = RIS ? [
        { img: shot(7, 6.5, 13, 0, 0.6, 1, 44, 768, 720), area: '1 / 1 / 3 / 2', cap: 'RISER NINE. FIVE YEARS AFTER THE FURNACE.', cap2: 'NINE FLOORS OF LADDER UNDER TIER FOUR. IT COMES UP IN THE VALLEY WHERE I WON THEIR ASSAY.', fx: 'CLANG!' },
        { img: shot(-1.2, 1.7, 3.2, 0, 1.75, 5.5, 30), area: '1 / 2 / 2 / 3', cap2: 'THE ORDER SAID ELEVEN HUNDRED. DACE SAID: HOLD THE TOP FOR AN HOUR. *A CLERK CANNOT BE SEEN TO FIGHT. I WORE A MASK.*' },
        { img: shot(1.5, 2.2, 2, 0, 6.5, -21, 40), area: '2 / 2 / 3 / 3', cap: 'THE WARDENS WERE ALREADY ON THE HILL ROAD.', cap2: 'FORTY PEOPLE BEHIND ME ON A LADDER.' }
      ] : [
        { img: shot(9, 4.5, 47, 0, 7, 10, 46, 768, 720), area: '1 / 1 / 3 / 2', cap: 'THE SUN SPIRE. NINE YEARS AFTER THE FURNACE.', cap2: 'FOUR HUNDRED HULLS CAME DOWN ON THE TERRACES AT DAWN. BY SUNSET THERE WAS ONE STAIR LEFT.', fx: 'HMMMM' },
        { img: shot(0.4, 1.5, 38.4, -1.6, 1.5, 40.2, 30), area: '1 / 2 / 2 / 3', cap2: '"I\'M ON YOUR LEFT THE WHOLE WAY UP. DON\'T ARGUE. *I\'VE FLOWN A BARGE.*"' },
        { img: shot(0, 1.6, 37, 0, 13, -20, 44), area: '2 / 2 / 3 / 3', cap: 'THE LAST OF NINE HUNDRED STEPS.', cap2: 'WE. IT WAS ALWAYS WE.' }
      ];
      pl.model.expr = null; U.page({ cols: '1.25fr 1fr', rows: '1fr 1fr', panels: pg }, begin);
    };
    const oswinUp = e => { e.maxHp = Math.round(e.maxHp * 0.85); e.hp = e.maxHp; e.K = Object.assign({}, e.K, { speed: e.K.speed * 1.22, wind: e.K.wind * 0.78, rec: e.K.rec * 0.8, cool: [0.4, 0.9], dmg: e.K.dmg + 5 }); e.phase = 2; };
    bossIntro = function () {
      const again = F.bossIntro; F.bossIntro = 1; save(); pl.control = false; pl.setState('scripted'); pl.script = t => P.guard(t); pl.scriptRate = 6; U.showHud(false); SC.emit('letterbox', true); cam.lock = null;
      S.vossName = S.vossName || U.SPEAK.voss.name; const osw = !RIS && !!F.oswin; if (!RIS) { S.stage2 = osw; SC.SPECS.boss.face = osw ? 'oswin' : 'halfmask'; U.SPEAK.voss.name = osw ? 'OSWIN HALE' : S.vossName; }
      const bz = RIS ? -15 : -50, e = SC.spawnEnemy('boss', 0, BY, bz, ENC.boss); e.state = 'wait'; e.model.group.scale.set(1, 1, 1); e.yaw = 0; S.bossE = e; pl.yaw = Math.PI;
      cam.move(v3(4, BY + 1.9, bz + 6), v3(0, BY + 2, bz), v3(2.4, BY + 1.7, bz + 4.2), v3(0, BY + 2.1, bz), 4.5, 40);
      const lines = osw ? [{ who: 'voss', face: 'angry', text: 'Get up, Sorrel. One has not finished paying.' }, { who: 'hero', face: 'angry', text: "It's Kael. It was always Kael." }] : again ? [{ who: 'voss', text: RIS ? 'Still on the hatch. *Stand off it.*' : 'Again, Clerk. One has the whole evening.' }, { who: 'hero', face: 'angry', text: RIS ? 'Count them again.' : "So've we." }] : RIS ? [
        { who: 'voss', text: 'You. In the mask. Stand off that hatch. That is an Authority riser, and those are *lines to be struck*.' },
        { who: 'hero', face: 'angry', text: 'They are forty people. Count them again.' },
        { who: 'voss', text: 'It is not a Warden\'s work to count. It is a Warden\'s work to *balance*.' },
        { who: 'hero', face: 'angry', text: 'Then come and do your work.' }] : [
        { who: 'voss', text: 'Clerk. One is the Auditor\'s Blade. One had another name. She took it when she gave one the post.' },
        { who: 'hero', face: 'angry', text: "We've got names for everybody. Mara has a list. We'll find you one." },
        { who: 'voss', text: 'One does not kneel, and one is not sorry. *Come up.*' },
        { who: 'hero', face: 'smirk', text: "That's all right. I've done enough of both for two." }];
      run([0.8, n => U.say(lines, n), n => { SC.emit('letterbox', false); pl.setState('idle'); pl.control = true; cam.endCine(0.8); U.showHud(true); e.state = 'chase'; e.st = 0; e.cool = 1.2;
        S.enc = ENC.boss; ENC.boss.wave = 0; ENC.boss.wait = 0; U.boss(e, RIS ? 'THE WARDEN CAPTAIN' : osw ? 'OSWIN HALE · HOUSE VIOLET' : "THE AUDITOR'S BLADE"); if (osw) oswinUp(e); objective(); n(); }]);
    };
    ending = function () {
      S.enc = null; U.boss(null); SC.clearEnemies(); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 5; setFlag('boss'); if (RIS) S.walk = 0.001;
      run([0.6, n => U.say(RIS ? [
          { who: 'cap', text: 'The last of them went up the hill road with their lamps out. I counted forty past me. Then I pulled the hatch down and stood on it until my legs stopped.' },
          { who: 'hero', face: 'hurt', text: 'Forty.' },
          { who: 'cap', text: 'The order said eleven hundred. I was back at my desk before the bell, and I wrote "clerical" beside the difference.' }
        ] : [
          { who: 'cap', text: 'He went down on the eye they had inlaid in their own floor. I put his name on Mara\'s list myself. Hale, O. It was a good name. He should have kept it.' },
          { who: 'cap', text: 'Behind me the stair was full, flight on flight, and nobody on it was kneeling.' },
          { who: 'clerk', text: "That's nine hundred. I counted. You count everything else." },
          { who: 'hero', face: 'smirk', text: 'Aye.' },
          { who: 'cap', text: 'There was one door left. It was white, and there was somebody standing in front of it with a pen.' }
        ], n), 0.6, n => { done(); n(); }]);
    };
    S.init = function () {
      if (!RIS) { clerk = S.clerk = SC.makeHumanoid('clerk'); G.scene.add(clerk.group); clerk.group.visible = false; W.dyn.push(t => { if (clerk.group.visible) clerk.anim.apply(P.idle(t), 6, 0.016); }); }
      else clerk = { group: { visible: false, position: v3(0, 0, 0), rotation: {}, updateMatrixWorld() {} }, anim: { apply() {} } };
      pl.model.setGlow(0xf6f2e6, '#f6f2e6');
      Object.keys(CROSS).forEach(id => { const c = CROSS[id], mk = (tex, s, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(c.x, c.y + 0.07, c.z); m.renderOrder = 3; G.scene.add(m); return m; };
        const a = mk(G.tex.ring, 3.4, 0xffe14a, 0.9), b = mk(G.tex.disc, 2.3, 0xffe14a, 0.35); W.dyn.push(t => { a.rotation.z = t * 0.25; b.material.opacity = 0.25 + Math.sin(t * 3) * 0.12; }); });
      if (RIS) {
        // the forty: lamps with hoods on, going up the hill road ten at a time
        const lamps = []; for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.22), new THREE.MeshBasicMaterial({ color: 0xffd9a0, fog: false })); m.visible = false; G.scene.add(m); lamps.push(m); }
        W.dyn.push((t, dt) => { if (!S.walk) return; S.walk += dt; lamps.forEach((m, i) => { const k = (S.walk - i * 0.45) / 7; m.visible = k > 0 && k < 1; if (m.visible) m.position.set(2.5 + k * 26, 0.9 + Math.sin(S.walk * 9 + i) * 0.06, 1 + k * 9 + (i % 3 - 1) * 0.5); }); if (S.walk > 12) { S.walk = 0; lamps.forEach(m => { m.visible = false; }); } });
        W.addInteract({ id: 'lintel', x: -9.9, y: 0, z: -9, fx: -11, fz: -9, r: 1.45, label: 'LOOK', marker: 'clue', mh: 2.2, when: () => F.e_alley && !F.clue_lintel, act: clue('lintel', [
          { who: 'cap', text: 'Names cut in the lintel, one Assay under another. Most are scored through. Mine is there, with a gold nail in it. It is not my name.' },
          { who: 'hero', face: 'angry', text: 'Sorrel, E. ...Forty feet under this grass there is a tier they are striking tonight.' }]) });
        W.addInteract({ id: 'shoe', x: 3.6, y: 0, z: 3.6, r: 1.45, label: 'LOOK', marker: 'clue', mh: 1.1, when: () => F.e_alley && !F.clue_shoe, act: clue('shoe', [
          { who: 'cap', text: 'A child\'s shoe by the hatch. Somebody went up the hill road with one foot bare and did not come back for it.' },
          { who: 'hero', face: 'hurt', text: 'Good. Do not come back.' }]) });
      } else {
        W.addInteract({ id: 'plates', x: -2.4, y: 6, z: 8.5, r: 1.45, label: 'LOOK', marker: 'clue', mh: 1.2, when: () => F.e_l1 && !F.clue_plates, act: clue('plates', [
          { who: 'cap', text: 'Brass plates set in the landing, worn bright in two places each. Knees.' },
          { who: 'hero', face: 'angry', text: "Nobody's using them tonight." }]) });
        W.addInteract({ id: 'halberd', x: 2.4, y: 12, z: -12.6, fx: 3.2, fz: -12, r: 1.45, label: 'LOOK', marker: 'clue', mh: 2.9, when: () => F.e_l2 && !F.clue_halberd, act: clue('halberd', [
          { who: 'cap', text: 'Brand\'s halberd, stood upright in a crack in the stone. Somebody carried it up nine hundred steps and did not tell me.' },
          { who: 'hero', face: 'hurt', text: 'Hollis. ...He is still finishing the bar he was on.' }]) });
      }
      SC.on('power', () => { S.artN = (S.artN || 0) + 1; U.memory(art(ARTS[(S.artN - 1) % ARTS.length])); });
      SC.on('finisherStart', e => { if (e.kind === 'boss') U.memory(art(FIN.boss)); else { S.finN = (S.finN || 0) + 1; if (S.finN <= 2) U.memory(art(FIN.warden)); } });
      // the last boss has a second stage: the mask comes off, and it is somebody he lit a fire for
      SC.on('dazed', e => {
        if (RIS || e.kind !== 'boss' || S.stage2) return; S.stage2 = true; e.state = 'wait'; e.st = 0; e.hp = 1; pl.control = false; pl.setState('scripted'); pl.script = t => P.guard(t); pl.scriptRate = 6; U.showHud(false); SC.emit('letterbox', true); cam.lock = null;
        SC.clearEnemies && SC.enemies.slice().forEach(x => { if (x !== e) x.die(0, 0, {}); });
        FX.burst(e.head || e.pos, 0xffffff, 2); SC.audio.sfx('crate'); SC.cam.shake(0.6); e.model.spec = Object.assign({}, e.model.spec, { face: 'oswin' }); SC.SPECS.boss.face = 'oswin'; e.model.expr = null; e.model.setGlow(0xff5a1f, '#ff5a1f'); e.model.face('hurt'); U.SPEAK.voss.name = 'OSWIN HALE';
        { const dx = pl.pos.x - e.pos.x, dz = pl.pos.z - e.pos.z, L = Math.hypot(dx, dz) || 1, ux = dx / L, uz = dz / L; e.yaw = Math.atan2(ux, uz); if (L < 3.2) { pl.pos.x = e.pos.x + ux * 3.2; pl.pos.z = e.pos.z + uz * 3.2; }
          cam.move(v3(e.pos.x + ux * 2.6 - uz * 1.5, 20.3, e.pos.z + uz * 2.6 + ux * 1.5), v3(e.pos.x, 19.9, e.pos.z), v3(e.pos.x + ux * 1.7 - uz * 0.9, 20.1, e.pos.z + uz * 1.7 + ux * 0.9), v3(e.pos.x, 20.0, e.pos.z), 7, 32); }
        run([0.9, n => U.say([
            { who: 'cap', text: 'The mask came off in two pieces. Under it was a face I had last seen across a fire I lit in a starving camp.' },
            { who: 'hero', face: 'shock', text: 'Oswin.' },
            { who: 'voss', face: 'hurt', text: 'One\'s father finished ninth for thirty years. She said one need not. *She only wanted the name.*' },
            { who: 'hero', face: 'hurt', text: "You said you'd carry the water yourself. You said not to tell your mother." },
            { who: 'voss', face: 'angry', text: 'It is *noted*. One has been paying on it nine years. Come and collect, Sorrel.' },
            { who: 'cap', text: 'He drew the second blade and set the bad leg behind him. The salve came eleven days late. He had finished second in the Assay, behind a man who lit a fire.' }
          ], n),
          n => { SC.emit('letterbox', false); pl.setState('idle'); pl.control = true; cam.endCine(0.8); U.showHud(true);
            oswinUp(e); F.oswin = 1; save(); e.armorT = 1.5; e.state = 'chase'; e.st = 0; e.cool = 0.8; e.model.face('angry');
            FX.ring(e.pos, 0xffd23a, 0.5, 5, 0.6); FX.word('OSWIN HALE', v3(e.pos.x, 21.4, e.pos.z), '#ffe14a', 1.6); SC.audio.sfx('roar'); U.boss(e, 'OSWIN HALE · HOUSE VIOLET'); objective(); n(); }]);
      });
      SC.on('dazed', () => { if (!F.tutFinish) { F.tutFinish = 1; U.toast(SC.hosted ? 'WIDE OPEN. GET CLOSE AND PRESS *A* TO FINISH IT.' : 'WIDE OPEN. GET CLOSE AND HIT *INTERACT* TO FINISH IT.', 4); } });
      SC.on('secondchance', () => SC.after(1.4, () => U.toast('*ON MY BREATH.* ONCE. A CHALKED SUN GIVES IT BACK.', 3.5)));
      SC.on('dead', () => SC.after(1.7, () => U.dead(S.load)));
      SC.on('kill', e => { if (e.kind === 'boss') S.bossDown = true; });
      SC.on('finisherEnd', e => { if (e.kind === 'boss') ending(e); });
      SC.on('bossPhase', e => { SC.spawnEnemy('hollow', e.pos.x + 3, BY, e.pos.z + 3, ENC.boss); SC.spawnEnemy(RIS ? 'hollow' : 'knifer', e.pos.x - 3, BY, e.pos.z + 3, ENC.boss); U.toast(RIS ? '"ON THE HATCH! BALANCE IT!"' : '"TO THE DOOR!"', 2.6); });
    };
    S.update = function (dt, rdt) {
      for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= rdt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } }
      if (SC.state !== 'play') return;
      if (pl.control) S.time += rdt;
      updateEnc(dt);
      if (!pl.control || S.enc || pl.state === 'dead') return;
      const x = pl.pos.x, y = pl.pos.y, z = pl.pos.z;
      { let on = null; if (F.intro) for (const id in CROSS) { const c = CROSS[id]; if (Math.abs(y - c.y) < 1.2 && Math.hypot(x - c.x, z - c.z) < 1.5) on = id; } if (on && S.onSun !== on) { const still = Math.hypot(pl.vel.x, pl.vel.z) < 1.6 && (pl.state === 'idle' || pl.state === 'run'), now = S.time; if (!still || S.sunId !== on) { if (S.sunId !== on && !S.sunHint) { S.sunHint = 1; U.toast('STAND ON THE SUN', 2.2); } S.sunId = on; S.sunAt = now; } else { const k = (now - S.sunAt) / 0.9; if (((now * 8) | 0) !== S.sunTick) { S.sunTick = (now * 8) | 0; FX.ring(pl.pos, 0xffe14a, Math.max(0.4, 1.6 - k * 1.2), 0.3, 0.2); } if (k >= 1) { S.onSun = on; S.sunId = null; crossing(on)(); return; } } } if (!on) { S.onSun = null; S.sunId = null; } }
      if (RIS) {
        if (S.pending || !F.e_alley || F.boss || S.bossDown) return;
        const next = !F.e_w2 ? 'w2' : !F.e_w3 ? 'w3' : 'boss'; S.pending = true;
        SC.after(next === 'boss' ? 3.4 : 4.2, () => { if (next === 'boss') bossIntro(); else { U.toast('LAMPS ON THE HILL ROAD. *MORE OF THEM.*', 2.2); startEnc(next); } });
      } else {
        if (F.e_alley && !F.e_l1 && y > 5.4 && z < 17) startEnc('l1');
        else if (F.e_l1 && !F.e_l2 && y > 11.4 && z < -9) startEnc('l2');
        else if (F.e_l2 && !F.boss && !S.bossDown && y > 17.4 && z < -36.5) bossIntro();
      }
    };
  }
