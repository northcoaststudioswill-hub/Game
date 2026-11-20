//@@OBJECTIVE
  function objective() {
    let t = '', g = null;
    if (S.enc) t = S.enc.id === 'boss' ? 'CAPTAIN ROOK HOLDS MOORING ONE. TAKE IT.' : 'PUT THE DOCK GUARD DOWN';
    else if (!F.path) { t = 'ONTO THE CAUSEWAY'; g = CROSS.alley; }
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
    if (id === 'street') F.key = 1;   // the key first, before anything else can go wrong: a save with the quay cleared and no key is a level nobody can finish
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
  /* the same man remembers different things at +5, +7 and +9 */
  const ARTS_BY = {
    riser: [
      { k: 'furnace1', name: 'ELEVEN', line: 'ELEVEN SECONDS THE DOORS STOOD OPEN. I HAVE COUNTED THEM EVERY DAY FOR FIVE YEARS.' },
      { k: 'desk2', name: 'THE ORDER', line: 'A WHOLE TIER IN ONE LINE, WITH A COLUMN FOR THE AIR IT WOULD SAVE. IT CAME TO MY DESK FOR A SIGNATURE.' },
      { k: 'ward0', name: 'FORTY BEDS', line: 'SHE BOUGHT FORTY CHILDREN THREE NIGHTS OF AIR. TONIGHT I AM BUYING FORTY PEOPLE A SKY.' },
      { k: 'assay0', name: 'THIS VALLEY', line: 'I KILLED A BOY IN THIS VALLEY FOR A PLACE AT A DESK. THE DESK IS WHY THEY ARE STILL BREATHING.' },
      { k: 'hands0', name: 'A RING', line: 'IT WAS THE ONLY ROUND THING I OWNED. SHE WORE IT ELEVEN MONTHS.' }
    ],
    stair: [
      { k: 'dockstair0', name: 'ELEVEN MINUTES', line: 'BRAND HELD THE FOOT OF THIS STAIR FOR ELEVEN MINUTES. WE ARE GOING UP IT FOR HIM.' },
      { k: 'furnace1', name: 'ELEVEN', line: 'ELEVEN SECONDS THE DOORS STOOD OPEN. NINE YEARS. TODAY WE STOP COUNTING.' },
      { k: 'weather2', name: 'TWO YEARS', line: 'TWO YEARS IN THE WEATHER, LEARNING TO FLY WHAT WE STOLE. NOBODY UP HERE HAS EVER BEEN COLD.' },
      { k: 'row0', name: 'THE SHELF', line: 'MARA KEEPS TWO TINS ON A SHELF. ONE OF THEM IS EMPTY AND HAS MY NAME ON IT.' },
      { k: 'ledger2', name: 'HER LINE', line: 'HOLLOWAY, S. STRUCK THROUGH IN A CLERK\'S HAND. THE BOOK IS AT THE TOP OF THIS STAIR.' }
    ]
  };
  { const by = ARTS_BY[SC.issue]; if (by) { ARTS.length = 0; by.forEach(a => ARTS.push(a)); } }
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
    ledger: [{ k: 'desk4', cap: 'FIVE YEARS AFTER THE FURNACE. THE MORNING AFTER RISER NINE.', cap2: '"SOMEONE WHO HAD DONE IT BEFORE," CADE SAID. HE LOOKED AT ME FOR AS LONG AS IT TAKES TO COUNT TO ELEVEN.' }, { k: 'ledger2', cap2: 'FOUR HUNDRED AND SIX LINES I HAVE STRUCK MYSELF. *I LEARNED EVERY ONE.*' }],
    lintel: [{ k: 'under0', cap: 'THE YEAR OF THE FURNACE. THE OLD TUNNEL.', cap2: 'DACE CHALKED TWO WORDS WHERE THE AUTHORITY WOULD NEVER LOOK. *STILL FLOWING.* THE AIR WENT UP. IT HAS ALWAYS GONE UP.' }],
    shoe: [{ k: 'ward0', cap: 'THE FEVER WARD. TIER SIX.', cap2: 'FORTY BEDS. FORTY CHILDREN BREATHING BECAUSE OF HER. *THE NUMBER FOLLOWS ME ABOUT.*' }],
    plates: [{ k: 'row0', cap: 'ROW K.', cap2: 'MARA KNELT AT FORTY-FOUR COMMITMENTS AND COUNTED EVERY ONE. *SHE STOOD UP AT THE FORTY-FIFTH.*' }],
    halberd: [{ k: 'dockstair0', cap: 'SEVEN YEARS AFTER THE FURNACE. THE DOCK STAIR.', cap2: 'ELEVEN MINUTES. SOMEBODY TIMED IT. *I ASKED THEM TO.*' }],
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
        { k: 'desk3', cap: 'THE EAST MANIFOLD. LAST YEAR.', cap2: 'KESTREL DRAY TURNED MY HAND OVER AND SAW THE VALVE BURNS THE GILDING DID NOT TAKE. *SHE DID NOT ASK.*' },
        { k: 'hands0', cap2: 'THE WASHER WAS UNDER MY COLLAR. I WAITED FOR IT TO GET HEAVIER. *IT DID NOT, AND I HAVE NOT FORGIVEN IT.*' }] },
      roof: { toast: 'ELEVEN SECONDS. SAVED. HEALED.', p: [
        { k: 'assay0', cap: 'THE ASSAY. FOUR YEARS AFTER THE FURNACE.', cap2: 'TWO SEALED IN A ROOM, ONE COMES OUT A CADET. TEO ALDANE SHARED HIS BREAD ON THE LIFT. *"I HOPE SHE WAS WORTH IT."*' },
        { k: 'ward0', cap: 'TIER SIX. THE FEVER WARD.', cap2: 'THE NIGHT THE FEVER BROKE, TAVI ASKED FOR BREAD. I NEVER TOLD TEO THERE WAS A SHE. *THERE WERE FORTY BEDS, AND A SHE.*' }] } },
    riser: {
      yard: { fury: 1, toast: 'HANDS. *FURY.*', p: [
        { k: 'island0', cap: 'THIS VALLEY. NIGHT TWENTY-FIVE OF THE ASSAY.', cap2: 'AN APPRENTICE KEPT THE VENT STACK AT THIS PUMP HOUSE. SHE NEVER SAW MY FACE. *SHE PUT HER HAND ON THE PIPE THE WAY I DO.*' },
        { k: 'furnace2', cap2: 'SEREN TAUGHT ME THAT. HANDS, KAEL. EVERYTHING IS HANDS. *I HAD NOT KNOWN ANYONE ABOVE THE ROCK COULD LEARN IT.*' }] } },
    stair: {
      yard: { toast: 'ELEVEN SECONDS. SAVED. HEALED.', p: [
        { k: 'assay0', cap: 'THE LAST DAY OF THE ASSAY.', cap2: 'I TOOK A KEEP FROM THE HIGH AUDITOR\'S SON WHILE SHE WATCHED. SHE PINNED A SUN ON ME FOR IT. *SHE SAID I REMINDED HER OF SOMEONE.*' },
        { k: 'lift0', cap: 'ASHGATE SQUARE. THE MORNING OF THE FURNACE.', cap2: 'THE FIRST TIME SHE LOOKED AT ME I WAS KNEELING WITH EVERYONE I KNEW. "A THIEF WHO TIDIES." *SHE HAS FORGOTTEN IT. I HAVE NOT.*' }] },
      roof: { fury: 1, toast: 'A SHELF CAN BE MADE LONGER. *FURY.*', p: [
        { k: 'weather2', cap: 'THE RAIL OF A BARGE. THIS YEAR.', cap2: '"I AM NOT ASKING FOR HER PLACE." "THERE IS NOT A PLACE. THERE IS A SHELF."' },
        { k: 'tin0', cap2: 'SEREN WOULD HAVE HECKLED. THEN SHE WOULD HAVE MOVED UP. *EVERY BREATH IS STILL HERS. THERE TURNED OUT TO BE A GREAT MANY OF THEM.*' }] } }
  };
  /* a chalked sun: he counts eleven. The first time, the count is what starts him. */
  function crossing(id, viaAct) {
    return function () {
      const first = !F.path; S.cp = id; pl.hp = SC.T.hp; pl.chance = 1;
      if (first && SC.issue !== 'docks') { pl.setPath('ember'); F.path = 'ember'; save(); pl.meter = Math.max(pl.meter, 25); FX.ring(pl.pos, 0xffe14a, 0.5, 3, 0.5); if (!ENC.alley) { setFlag('e_alley'); S.objective && S.objective(); return; } startEnc('alley'); if (S.enc) S.enc.wait = 2.2; return; }   // a breath before the first of them lands   // he has counted eleven before. Once is the memory; after that it is only where he starts
      if (first) { SC.audio.sfx('clue'); pl.control = false; pl.setPath('ember'); F.path = 'ember'; save(); U.memory(art(FIN.count), bargain); return; }
      const sm = (SUN[SC.issue] || {})[id];
      if (viaAct && sm && !F['sun_' + id]) { SC.audio.sfx('clue'); F['sun_' + id] = 1; save(); pl.control = false; pagesOf(sm.p, () => { pl.control = true; if (sm.fury) pl.gain(50); U.toast(sm.toast, 3.2); objective(); }); return; }
      save(); if (!(S.quietT && S.time - S.quietT < 10)) { FX.ring(pl.pos, 0xffe14a, 0.5, 3, 0.5); U.toast('SAVED.', 1.3); } S.quietT = S.time;
    };
  }
//@@CUTSCENES
  /* ---------- cutscenes ---------- */
  let clerk, barge, cable = { visible: true };
  const MOOR = { x: 16, z: -23.4 };
  function showClerk(x, y, z, yaw) { clerk.group.visible = true; clerk.group.position.set(x, y, z); clerk.group.rotation.y = yaw; clerk.anim.apply(P.clerk(0), 999, 0.016); }
  function hideClerk() { clerk.group.visible = false; }
  /* the air of each place: mist on the docks, ground mist and far lightning in the valley, embers going up past the Stair */
  function atmo(kind) {
    const soft = G.canvasTex(64, 64, g => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.22, 'rgba(255,255,255,.9)'); gr.addColorStop(.5, 'rgba(255,255,255,.3)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); });
    const mk = (col, op, add) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: col, transparent: true, opacity: op, depthWrite: false, fog: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending })); G.scene.add(s); return s; };
    const wrap = (v, c, span) => c + ((((v - c) % span) + span * 1.5) % span) - span / 2, L = [];
    if (kind === 'stair') for (let i = 0; i < 60; i++) { const s = mk(i % 3 ? 0xff8a2a : 0xffd890, .95, true), z = .3 + (i % 4) * .1; s.scale.set(z, z, 1); L.push({ s, x: i * 3.7, z: i * 5.3, ph: i * .61, sp: .7 + (i % 5) * .26, k: 0 }); }
    W.dyn.push((tt, dt) => { const p = pl.pos;
      for (const q of L) { if (q.k === 0) { const y = (tt * q.sp + q.ph * 3) % 10; q.s.position.set(wrap(q.x + tt * 1.3 + Math.sin(tt * .9 + q.ph) * .7, p.x, 26), p.y - .6 + y, wrap(q.z + Math.sin(tt * .5 + q.ph) * .5, p.z, 26)); q.s.material.opacity = Math.min(1, y * .8) * Math.max(0, 1 - y / 10) * (.8 + .2 * Math.sin(tt * 9 + q.ph)); }
        else q.s.position.set(wrap(q.x + tt * q.sp, p.x, 44), p.y + .5 + (q.ph % 1) * .9 + Math.sin(tt * .3 + q.ph) * .15, wrap(q.z + Math.sin(tt * .11 + q.ph) * 2, p.z, 40)); } });
  }
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
      { img: a, area: '1 / 1 / 3 / 2', cap: 'THE HIGH DOCKS. SEVEN YEARS AFTER THE FURNACE.', cap2: 'FOUR HUNDRED BARGES, MOORED IN PAIRS. CUT THE PAIRS AND THE WIND DOES THE REST.', fx: 'THE SECOND BELL' },
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
    run([0.8, n => U.say(lines, n), n => { SC.emit('letterbox', false); pl.setState('idle'); pl.control = true; cam.endCine(0.8); U.showHud(true); e.state = 'chase'; e.st = 0; e.cool = 1.2; cam.lock = e;
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
    const p = v3(MOOR.x, 11, MOOR.z); FX.burst(v3(p.x, 12, p.z + 1), 0xffd23a, 1.6); FX.word('THE LINE GOES.', v3(p.x, 13.2, p.z + 1), '#f3e3c3', 1.8); cam.shake(0.6); SC.audio.sfx('door');
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
    { let on = null; if (F.intro && !S.enc) for (const id in CROSS) { const c = CROSS[id]; if (Math.abs(y - c.y) < 1.2 && (F.path ? Math.hypot(x - c.x, z - c.z) < 1.6 : id === 'alley' && z < c.z + 1.4)) on = id; }   // the first sun cannot be walked past: in v0.50 it could, and then nothing on the docks ever started
      if (on && S.onSun !== on) { S.onSun = on; crossing(on)(); return; } if (!on) S.onSun = null; }
//@@INIT
  S.init = function () {
    clerk = S.clerk = SC.makeHumanoid('clerk'); G.scene.add(clerk.group); clerk.group.visible = false; atmo('docks');
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
      W.addInteract({ id: 'x_' + id, x: c.x, y: c.y, z: c.z, r: 1.9, label: 'REMEMBER', marker: 'clue', mh: 1.5, act: crossing(id, true), when: () => !!F.path && !S.enc && !!(SUN[SC.issue] || {})[id] && !F['sun_' + id] });
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
      if (!F.key && !F.e_street) { U.toast('LOCKED. SOMEBODY ON THIS QUAY CARRIES THE KEY.', 2.6); SC.audio.sfx('deny'); return; }
      W.openDoor('gate'); SC.audio.sfx('door'); setFlag('gate'); U.toast('THE GATE ROLLS BACK.', 2); } });
    W.addInteract({ id: 'breaker', x: 31.1, y: 0, z: -8, fx: 32, fz: -8, r: 2, label: 'BREAKER', marker: 'act', mh: 2.6, when: () => F.e_yard && !F.breaker, act: () => {
      setFlag('breaker'); W.openDoor('shutter'); SC.audio.sfx('door'); pl.control = false; U.showHud(false); SC.emit('letterbox', true);
      cam.move(v3(13.5, 2.2, -3.2), v3(5.7, 1.6, -6.5), v3(11.5, 1.7, -4.4), v3(5.7, 2.6, -6.5), 2.2, 44);
      run([2.3, n => { SC.emit('letterbox', false); cam.endCine(0.6); U.showHud(true); pl.control = true; n(); }]); } });
    W.addInteract({ id: 'hatch', x: -13.5, y: 8.1, z: -18.2, fx: -12.5, fz: -18.2, r: 1.8, label: 'ROOF DOOR', marker: 'act', mh: 2.2, when: () => F.e_wh && !F.hatch, act: () => {
      if (!F.ledger) { U.toast('LOCKED. THE KEY WILL BE IN THE *DOCK OFFICE*.', 2.6); SC.audio.sfx('deny'); return; }
      W.openDoor('hatch'); SC.audio.sfx('door'); setFlag('hatch'); } });
    W.addInteract({ id: 'moor', x: MOOR.x, y: 11, z: MOOR.z, r: 2.4, label: 'CUT THE LINE', marker: 'act', mh: 2.4, when: () => F.boss && !F.cut, act: finale });
    // the watch is already on its posts, talking. It knows him when he walks up to it.
    { const POST = ['street', 'yard', 'wh', 'roof'], PRE = { street: () => F.e_alley, yard: () => F.gate, wh: () => F.breaker, roof: () => F.hatch && !F.bossIntro },
        TALK = ['SECOND BELL SOON.', 'ROOK SAYS HOLD.', 'ONE CLERK. ONE.', 'FORTY HALBERDS FOR A CLERK.', 'THE STAIR IS NOT OURS TO WATCH.', 'IT WAS QUIET AT THE FIRST BELL.', 'WHO CHALKED OVER THE ROTA?', 'CADE SIGNED FOR IT.', 'MIND THE EDGE.', 'LAMPS LIT. EYES OPEN.', 'HE KEPT THE COUNT, THEY SAY.', 'A CLERK DOES NOT FIGHT.'];
      let seen = -1, talkT = 3, talkN = 0; const _pv = v3(), stuck = {}, inT = {};
      const post = () => { for (const id of POST) { const e = ENC[id]; e.posted = 0; if (F['e_' + id] || F.boss || S.bossDown || !e.waves || !e.waves[0]) continue; e.posted = 1; e.wave = 0; e.wait = 0;
          e.waves[0].forEach((w, i) => { const m = SC.spawnEnemy(w[0], w[1], e.floor, w[2], e); m.state = 'wait'; m.st = 0; m.drop = 0; m.model.group.scale.set(1, 1, 1); m.postI = i; }); } };
      const wake = (e, who) => { e.posted = 2; S.enc = e; e.wave = 0; e.wait = 0; for (const m of SC.enemies) if (m.enc === e && m.state === 'wait') { m.state = 'chase'; m.st = 0; m.cool = 0.9 + Math.random() * 0.9; }
        _pv.copy(who.pos); _pv.y += who.h + 0.5; FX.word(SC.pick(['THERE. THE CLERK!', 'IT IS HIM. TO ME!', 'SORREL! HOLD HIM!']), _pv, '#ff3b30', 1.4); SC.audio.sfx('alert'); objective(); };
      W.dyn.push((t, dt) => { if (SC.state !== 'play') return;
        if (seen !== (SC.cleared || 0)) { if (!pl.control) return; seen = SC.cleared || 0; post(); }
        if (F.e_street && !F.key) { F.key = 1; save(); objective(); U.toast('THE STAIR BLADE CARRIED A *YARD KEY*. HIGH DOCKS FREIGHT.', 4); }   // mends a save made by v0.49: the quay cleared, the key never handed over, so the level came back empty and locked every time
        talkT -= dt; let spoke = false;
        for (const id of POST) { const e = ENC[id]; if (e.posted !== 1) continue; const mem = SC.enemies.filter(m => m.enc === e && m.state === 'wait'); if (!mem.length) { e.posted = 2; continue; }
          for (const m of mem) { const o = mem[m.postI ^ 1] || mem[(m.postI + 1) % mem.length]; if (o && o !== m) m.yaw = SC.dampAng(m.yaw, Math.atan2(o.pos.x - m.pos.x, o.pos.z - m.pos.z) + Math.sin(t * 0.4 + m.postI) * 0.5, 2, dt); }
          const near = mem.find(m => Math.abs(m.pos.y - pl.pos.y) < 3 && SC.dist2(m.pos.x, m.pos.z, pl.pos.x, pl.pos.z) < 9.5);   // dist2 is metres, not metres squared: at 81 every watch woke the moment its turn came, wherever he was
          if (near && !S.enc && pl.control && PRE[id]()) { wake(e, near); continue; }
          if (talkT <= 0 && !spoke) { const m = mem[talkN % mem.length]; if (SC.dist2(m.pos.x, m.pos.z, pl.pos.x, pl.pos.z) < 24) { _pv.copy(m.pos); _pv.y += m.h + 0.35; FX.word(TALK[talkN % TALK.length], _pv, '#dfe6ff', 0.62); talkN++; spoke = true; } } }
        if (talkT <= 0) talkT = 3.4 + Math.random() * 2.4;
        // nobody is ever left locked out. If he is standing on their ground and they have not looked up, they look up; and if a watch is gone but was never closed off, it is closed off (the yard key with it)
        for (const id of POST) { const e = ENC[id]; if (F['e_' + id] || !PRE[id]() || S.enc || !pl.control) { stuck[id] = 0; inT[id] = 0; continue; }
          const mem = SC.enemies.filter(m => m.enc === e && m.state !== 'dead');
          if (mem.length) { stuck[id] = 0; const A = e.arena, w = mem.filter(m => m.state === 'wait'); if (w.length && A && pl.pos.x > A[0] && pl.pos.x < A[2] && pl.pos.z > A[1] && pl.pos.z < A[3] && Math.abs(pl.pos.y - e.floor) < 3) { inT[id] = (inT[id] || 0) + dt; if (inT[id] > 1.2) { inT[id] = 0; wake(e, w[0]); } } else inT[id] = 0; if (!w.length && mem.length) { S.enc = e; if (e.wave < 0) e.wave = 0; e.wait = 0; e.posted = 2; } continue; }
          stuck[id] = (stuck[id] || 0) + dt; if (stuck[id] > 2.5) { stuck[id] = 0; e.posted = 2; encDone(id); } } }); }
    // while the game is being built: a way out of anything that has gone wrong, without losing the level
    S.unstick = function () { const live = SC.enemies.filter(e => e.state !== 'dead' && e.state !== 'wait' && e.kind !== 'boss'); if (live.length) { live.forEach(e => e.die(0, 0, {})); U.toast('CLEARED.', 2); return; }
      if (F.e_alley && !S.enc) { const order = [['e_street', () => encDone('street')], ['gate', () => { W.openDoor('gate'); setFlag('gate'); }], ['e_yard', () => encDone('yard')], ['breaker', () => { setFlag('breaker'); W.openDoor('shutter'); }], ['e_wh', () => encDone('wh')], ['ledger', () => setFlag('ledger')], ['hatch', () => { W.openDoor('hatch'); setFlag('hatch'); }], ['e_roof', () => encDone('roof')]];
        for (const [k, fn] of order) if (!F[k]) { SC.enemies.filter(e => e.enc && 'e_' + e.enc.id === k).forEach(e => e.remove()); fn(); U.toast('UNSTUCK: *' + k.replace('e_', '').toUpperCase() + '* IS DONE.', 2.5); return; } }
      const c = CROSS[S.cp] || CROSS.alley; if (c) { pl.place(c.x, c.y, c.z, c.yaw); cam.snapBehind(c.yaw); U.toast('BACK ON THE LAST SUN.', 2); } };
    // he remembers in the middle of it, not only at the end of it
    SC.on('kill', () => { S.killN = (S.killN || 0) + 1; if (S.killN % 5 === 0 && SC.enemies.some(m => m.state !== 'dead' && m.state !== 'wait')) { S.artN = (S.artN || 0) + 1; U.memory(art(ARTS[(S.artN - 1) % ARTS.length])); } });
    SC.on('power', () => { S.artN = (S.artN || 0) + 1; U.memory(art(ARTS[(S.artN - 1) % ARTS.length])); });
    SC.on('finisherStart', e => { if (e.kind === 'boss') U.memory(art(FIN.boss)); else { S.finN = (S.finN || 0) + 1; if (S.finN <= 2) U.memory(art(FIN.warden)); } });
    SC.on('dazed', e => { if (!F.tutFinish) { F.tutFinish = 1; U.toast(SC.hosted ? 'WIDE OPEN. GET CLOSE AND PRESS *A* TO FINISH IT.' : 'WIDE OPEN. GET CLOSE AND HIT *INTERACT* TO FINISH IT.', 4); } });
    SC.on('secondchance', () => { if (S.enc && S.enc.id === 'boss') { const L = { docks: ['STILL ON THE PAGE', 'YOU HAVE MISCOUNTED, CAPTAIN. COUNT AGAIN.'], riser: ['FORTY BEHIND ME', 'IS THAT ALL OF YOU? SEND UP THE HILL FOR MORE.'], stair: ['BORN DOWN HERE', "I'VE BEEN ON THE FLOOR ALL MY LIFE. YOU SHOULD SEE WHAT I DO FROM IT."] }[SC.issue] || ['NOT YET', 'EVERY BREATH IS HERS. I HAVE PLENTY LEFT.']; SC.after(0.5, () => U.cut(L[0], L[1], true)); SC.after(2.6, () => U.toast('*' + L[1] + '*', 3.2)); } else SC.after(1.4, () => U.toast('*ON MY BREATH.* ONCE. A CHALKED SUN GIVES IT BACK.', 3.5)); });
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
    Object.assign(CROSS, RIS ? { alley: { x: 0.5, y: 0, z: 2.4, yaw: Math.PI }, yard: { x: -12, y: 0, z: 4, yaw: Math.PI } } : { alley: { x: 0, y: 0, z: 33, yaw: Math.PI }, yard: { x: 0, y: 6, z: 14.5, yaw: Math.PI }, roof: { x: 0, y: 12, z: -11, yaw: Math.PI } });
    Object.assign(ENC, RIS ? {
      alley: { arena: [-25, -22, 25, 10.6], floor: 0, waves: [[['hollow', 3, -20], ['hollow', 5, -21], ['hollow', 1.6, -21.5]]] },
      w2: { arena: [-25, -22, 25, 10.6], floor: 0, waves: [[['hollow', 4, -21], ['knifer', 2, -21.5], ['knifer', 6, -20.5]], [['hollow', 23, -10], ['hollow', -23, -6], ['knifer', 3.4, -21]]] },
      w3: { arena: [-25, -22, 25, 10.6], floor: 0, waves: [[['bruiser', -23, -15], ['hollow', -22, -12], ['hollow', 23, -14]], [['bruiser', 23, 4], ['knifer', -22, 8], ['knifer', 22, 9], ['hollow', -23, 2]]] },
      boss: { arena: [-25, -22, 25, 10.6], floor: 0, waves: [[['boss', 0, -15]]] }
    } : {
      alley: { arena: [-9.6, 30.4, 9.6, 45.6], floor: 0, waves: [[['hollow', -3, 32], ['hollow', 3, 32], ['knifer', 0, 31.4]], [['hollow', -5, 32.4], ['knifer', 5, 32.4], ['hollow', 0, 31.6]]] },
      l1: { arena: [-6.6, 4.4, 6.6, 17.6], floor: 6, waves: [[['knifer', -3, 7], ['knifer', 3, 7], ['hollow', 0, 6]], [['bruiser', 0, 6.4], ['hollow', -4, 8]]] },
      l2: { arena: [-6.6, -21.6, 6.6, -8.4], floor: 12, waves: [[['bruiser', -2, -19], ['bruiser', 3, -18]], [['knifer', -4, -19], ['knifer', 4, -19], ['hollow', 0, -20]]] },
      boss: { arena: [-9.4, -57, 9.4, -34.6], floor: 18, waves: [[['boss', 0, -50]]] }
    });
    if (SC.cold && !RIS) ENC.alley.waves = [ENC.alley.waves[0]];   /* Part Two's cold open: a minute of this stair, nine years on. One fight, one flight, and a cut */
    Object.keys(ENC).forEach(k => { ENC[k].id = k; });
    const up = () => (F.pump ? 10 : 0) + (F.e_w2 ? 10 : 0) + (F.e_w3 ? 10 : 0) + (F.pull ? 10 : 0);
    const tavi = (x, y, z, yaw) => { if (RIS) return; const g = clerk.group.position; if (clerk.group.visible && Math.hypot(g.x - pl.pos.x, g.z - pl.pos.z) < 30 && Math.abs(g.y - pl.pos.y) < 9) return; showClerk(x, y, z, yaw === undefined ? Math.PI : yaw); };   // Tavi walks now; he is only set down somewhere if he has been left a long way behind
    brandOnStair = function () { if (RIS) return; if (F.e_l2) tavi(-3, 18, -37); else if (F.e_l1) tavi(-2.5, 12, -10); else if (F.e_alley) tavi(-2.5, 6, 15); else tavi(-1.6, 0, 40.2, 2.4); };
    objective = function () {
      let t = '', g = null;
      if (RIS) {
        if (S.enc && S.enc.id === 'boss') t = 'THE WARDEN CAPTAIN. HE DOES NOT REACH THE HATCH.';
        else if (!F.path) { t = 'MEET THEM ON THE ROAD'; g = CROSS.alley; }
        else if (F.boss) t = 'FORTY OF FORTY';
        else if (S.enc) t = 'HOLD THE RISER · ' + up() + ' OF 40 UP';
        else if (F.e_alley && !F.pump) { t = 'THE HATCH IS STUCK. THE PUMP HOUSE.'; g = { x: -9.9, y: 0, z: -7.2 }; }
        else if (F.e_w2 && !F.pylon) { t = 'PUT OUT THE EYE ON THE PYLON'; g = { x: 0, y: 0, z: -19.2 }; }
        else if (F.e_w3 && !F.pull) { t = 'SOMEBODY HAS STOPPED ON THE LADDER'; g = { x: 0, y: 0, z: 12.7 }; }
        else t = 'HOLD THE RISER · ' + up() + ' OF 40 UP';
      } else {
        if (S.enc) t = S.enc.id === 'boss' ? (S.stage2 ? 'OSWIN HALE. THE DOOR IS BEHIND HIM.' : "THE AUDITOR'S BLADE. THE DOOR IS BEHIND HIM.") : 'CLEAR THE LANDING';
        else if (!F.path) { t = 'ONTO THE TERRACE'; g = CROSS.alley; }
        else if (!F.e_alley) t = 'CLEAR THE TERRACE';
        else if (!F.e_l1) { t = 'UP THE FIRST FLIGHT'; g = { x: 0, y: 6, z: 12 }; }
        else if (!F.bell) { t = 'CUT DOWN THE KNEELING BELL'; g = { x: -5.3, y: 6, z: 15.6 }; }
        else if (!F.e_l2) { t = 'UP THE SECOND FLIGHT'; g = { x: 0, y: 12, z: -13 }; }
        else if (!F.boss) { t = 'THE LAST FLIGHT. THE WHITE DOOR.'; g = { x: 0, y: 18, z: -40 }; }
      }
      U.objective(t); S.goal = g;
    };
    S.objective = objective;
    encDone = function (id) {
      setFlag('e_' + id); S.pending = false;
      if (RIS) { if (id === 'alley') U.toast('THE ROAD IS CLEAR FOR NOW. *THE HATCH HAS NOT LIFTED.*', 3.4); else { S.walk = 0.001; U.toast('*' + ['TEN', 'TWENTY', 'THIRTY', 'FORTY'][up() / 10 - 1] + '* UP THE RISER. THEY GO INTO THE PINES WITH THEIR LAMPS HOODED.', 3.6); } SC.audio.sfx('clue'); objective(); }
      else { brandOnStair(); U.toast(id === 'alley' ? 'THE TERRACE IS OURS. *UP.*' : id === 'l1' ? 'TAVI: "ON YOUR LEFT. KEEP GOING."' : 'ONE FLIGHT LEFT. *THE WHITE DOOR.*', 3.4); }
    };
    const begin = () => { SC.emit('letterbox', false); pl.faceOverride = null; pl.setState('idle'); pl.control = true; cam.mode = 'follow'; cam.snapBehind(Math.PI); U.showHud(true); setFlag('intro');
      U.toast(SC.hosted ? 'DRAG THE PICTURE TO LOOK ROUND. *A* CUTS; HELD, THREE HEAVY BLOWS. *JUMP*, HELD, HOVERS.' : 'WASD MOVES. J STRIKES. K DODGES. F IS THE BOOTS.', 5.5); };
    intro = function () {
      SC.state = 'play'; U.showHud(false); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; pl.faceOverride = 'angry';
      pl.place(0, 0, RIS ? 10.4 : 41, Math.PI); pl.model.anim.apply(P.idle(0), 999, 0.016); pl.model.face('angry'); pl.model.group.updateMatrixWorld(true); brandOnStair(); if (clerk) clerk.group.updateMatrixWorld(true);
      const pg = RIS ? [
        { img: shot(-9.5, 5.2, 4.5, 0.6, 0.6, 14, 42, 768, 720), area: '1 / 1 / 3 / 2', cap: 'RISER NINE. FIVE YEARS AFTER THE FURNACE.', cap2: 'NINE FLOORS OF LADDER UNDER TIER FOUR. IT COMES UP IN THE VALLEY WHERE I WON THEIR ASSAY.', fx: 'THE HATCH' },
        { img: shot(-1.2, 1.7, 8.1, 0, 1.75, 10.4, 30), area: '1 / 2 / 2 / 3', cap2: 'THE ORDER SAID ELEVEN HUNDRED. DACE SAID: HOLD THE TOP FOR AN HOUR. *A CLERK CANNOT BE SEEN TO FIGHT. I WORE A MASK.*' },
        { img: shot(1.6, 2.0, 13.2, 0, 5.2, -21, 40), area: '2 / 2 / 3 / 3', cap: 'THE WARDENS WERE ALREADY ON THE HILL ROAD.', cap2: 'FORTY PEOPLE BEHIND ME ON A LADDER.' }
      ] : [
        { img: shot(9, 4.5, 47, 0, 7, 10, 46, 768, 720), area: '1 / 1 / 3 / 2', cap: 'THE SUN SPIRE. NINE YEARS AFTER THE FURNACE.', cap2: 'FOUR HUNDRED HULLS CAME DOWN ON THE TERRACES AT DAWN. BY SUNSET THERE WAS ONE STAIR LEFT.', fx: 'THEY ARE HUMMING' },
        { img: shot(0.4, 1.5, 38.4, -1.6, 1.5, 40.2, 30), area: '1 / 2 / 2 / 3', cap2: '"I\'M ON YOUR LEFT THE WHOLE WAY UP. DON\'T ARGUE. *I\'VE FLOWN A BARGE.*"' },
        { img: shot(0, 1.6, 37, 0, 13, -20, 44), area: '2 / 2 / 3 / 3', cap: 'THE LAST OF NINE HUNDRED STEPS.', cap2: 'WE. IT WAS ALWAYS WE.' }
      ];
      pl.model.expr = null; if (SC.cold && !RIS) return begin(); U.page({ cols: '1.25fr 1fr', rows: '1fr 1fr', panels: pg }, begin);
    };
    // the cut: he comes over the top of the first flight and sees the rest of it, and who is standing at the end
    const coldEnd = () => { if (S.coldDone) return; S.coldDone = 1; S.enc = null; SC.clearEnemies(); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; U.showHud(false); SC.audio.sfx('clue');
      pl.place(0, 6, 15.5, Math.PI); pl.model.anim.apply(P.guard ? P.guard(0) : P.idle(0), 999, 0.016); pl.model.face('angry'); pl.model.group.updateMatrixWorld(true);
      { const m = new THREE.Group(), w = new THREE.MeshBasicMaterial({ color: 0x1a1420, fog: false }), body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.46, 1.5, 8), w), head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), w), blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.06), new THREE.MeshBasicMaterial({ color: 0xe8c25a, fog: false })); body.position.y = 0.75; head.position.y = 1.72; blade.position.set(0.42, 0.75, 0.1); m.add(body, head, blade); m.position.set(0, 18, -52); G.scene.add(m); m.updateMatrixWorld(true); }
      const a = shot(2.4, 20.4, -24, 0, 19.2, -52, 34, 768, 720), b = shot(1.1, 7.7, 13.2, 0, 7.6, 15.5, 26);
      U.page({ cols: '1.25fr 1fr', rows: '1fr', panels: [
        { img: a, area: '1 / 1 / 2 / 2', cap: 'NINE HUNDRED STEPS. AT THE TOP, A WHITE DOOR.', cap2: 'SOMEBODY WAS STANDING IN FRONT OF IT.', fx: 'UP' },
        { img: b, area: '1 / 2 / 2 / 3', cap2: '*I KNEW THE WAY HE STOOD.*' }
      ] }, () => done()); };
    const oswinUp = e => { e.maxHp = Math.round(e.maxHp * 0.85); e.hp = e.maxHp; e.K = Object.assign({}, e.K, { speed: e.K.speed * 1.22, wind: e.K.wind * 0.78, rec: e.K.rec * 0.8, cool: [0.4, 0.9], dmg: e.K.dmg + 5 }); e.phase = 2; };
    bossIntro = function () {
      const again = F.bossIntro; F.bossIntro = 1; save(); pl.control = false; pl.setState('scripted'); pl.script = t => P.guard(t); pl.scriptRate = 6; U.showHud(false); SC.emit('letterbox', true); cam.lock = null;
      S.vossName = S.vossName || U.SPEAK.voss.name; const osw = !RIS && !!F.oswin; if (!RIS) { S.stage2 = osw; SC.SPECS.boss.face = osw ? 'oswin' : 'halfmask'; U.SPEAK.voss.name = osw ? 'OSWIN HALE' : S.vossName; }
      if (RIS) pl.place(0, 0, 8.6, Math.PI);
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
      run([0.8, n => U.say(lines, n), n => { SC.emit('letterbox', false); pl.setState('idle'); pl.control = true; cam.endCine(0.8); U.showHud(true); e.state = 'chase'; e.st = 0; e.cool = 1.2; cam.lock = e;
        S.enc = ENC.boss; ENC.boss.wave = 0; ENC.boss.wait = 0; U.boss(e, RIS ? 'THE WARDEN CAPTAIN' : osw ? 'OSWIN HALE · HOUSE VIOLET' : "THE AUDITOR'S BLADE"); if (osw) oswinUp(e); objective(); n(); }]);
    };
    ending = function () {
      S.enc = null; U.boss(null); SC.clearEnemies(); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 5; setFlag('boss'); if (RIS) S.walk = 0.001;
      run([0.6, n => U.say(RIS ? [
          { who: 'cap', text: 'The last of them went into the pines with their lamps hooded. I counted forty past me. Then I pulled the hatch down and stood on it until my legs stopped.' },
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
      if (!RIS) { clerk = S.clerk = SC.makeHumanoid('clerk'); G.scene.add(clerk.group); clerk.group.visible = false; { let ph = 0; W.dyn.push((t, dt) => { if (!clerk.group.visible) return; const g = clerk.group.position, yaw = pl.yaw, tx = pl.pos.x - Math.sin(yaw) * 1.9 + Math.cos(yaw) * 1.35, tz = pl.pos.z - Math.cos(yaw) * 1.9 - Math.sin(yaw) * 1.35, dx = tx - g.x, dz = tz - g.z, d = Math.hypot(dx, dz);
          if (dt > 0 && SC.state === 'play' && !S.enc && pl.control && d > 0.7 && d < 45) { const sp = Math.min(6.4, 1.2 + d * 2), k = Math.min(1, sp * dt / d); g.x += dx * k; g.z += dz * k; g.y = SC.damp(g.y, W.ground(g.x, g.z, g.y + 0.7), 16, dt); clerk.group.rotation.y = SC.dampAng(clerk.group.rotation.y, Math.atan2(dx, dz), 9, dt); ph += sp * dt * 1.7; clerk.anim.apply(P.run(ph, sp / 6.4), 16, dt); }
          else { if (dt > 0) clerk.group.rotation.y = SC.dampAng(clerk.group.rotation.y, Math.atan2(pl.pos.x - g.x, pl.pos.z - g.z), 3, dt); clerk.anim.apply(P.idle(t), 6, 0.016); } }); } }
      else clerk = { group: { visible: false, position: v3(0, 0, 0), rotation: {}, updateMatrixWorld() {} }, anim: { apply() {} } };
      pl.model.setGlow(0xf6f2e6, '#f6f2e6'); atmo(SC.issue);
      Object.keys(CROSS).forEach(id => { const c = CROSS[id], mk = (tex, s, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(c.x, c.y + 0.07, c.z); m.renderOrder = 3; G.scene.add(m); return m; };
        const a = mk(G.tex.ring, 3.4, 0xffe14a, 0.9), b = mk(G.tex.disc, 2.3, 0xffe14a, 0.35); W.dyn.push(t => { a.rotation.z = t * 0.25; b.material.opacity = 0.25 + Math.sin(t * 3) * 0.12; });
        W.addInteract({ id: 'x_' + id, x: c.x, y: c.y, z: c.z, r: 1.9, label: 'REMEMBER', marker: 'clue', mh: 1.5, act: crossing(id, true), when: () => !!F.path && !S.enc && !!(SUN[SC.issue] || {})[id] && !F['sun_' + id] }); });
      if (RIS) {
        // the forty: hooded lamps and the people carrying them, going east along the rock and into the pines ten at a time
        const lamps = [], cloth = G.toon({ color: 0x2a2634 }); for (let i = 0; i < 10; i++) { const m = new THREE.Group(), sm = i % 4 === 3, body = new THREE.Mesh(new THREE.CylinderGeometry(sm ? 0.1 : 0.14, sm ? 0.2 : 0.27, sm ? 0.8 : 1.15, 7), cloth), head = new THREE.Mesh(new THREE.ConeGeometry(0.19, 0.4, 7), cloth), lamp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.2, 0.12), new THREE.MeshBasicMaterial({ color: 0xffd9a0, fog: false })); body.position.y = sm ? 0.4 : 0.58; head.position.y = sm ? 0.98 : 1.33; lamp.position.set(0.3, sm ? 0.45 : 0.62, 0.1); m.add(body, head, lamp); m.visible = false; G.scene.add(m); lamps.push(m); }
        W.dyn.push((t, dt) => { if (!S.walk) return; S.walk += dt; lamps.forEach((m, i) => { const k = (S.walk - i * 0.45) / 7; m.visible = k > 0 && k < 1; if (m.visible) { m.position.set(2.2 + k * 25, Math.abs(Math.sin(S.walk * 7 + i)) * 0.05, 13.0 - k * 0.6 + Math.sin(k * 3.1) * -1.6 + (i % 3 - 1) * 0.4); m.rotation.y = 1.5 + Math.sin(S.walk * 7 + i) * 0.08; } }); if (S.walk > 12) { S.walk = 0; lamps.forEach(m => { m.visible = false; }); } });
        const said = (flag, lines, after) => () => { setFlag(flag); SC.audio.sfx('clue'); pl.control = false; U.say(lines, () => { pl.control = true; if (after) after(); objective(); }); };
        const eye = new THREE.PointLight(0xffe9a0, 90, 34, 1.4); eye.position.set(0, 8.6, -19.6); G.scene.add(eye); const eyeM = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.42, 0.06), new THREE.MeshBasicMaterial({ color: 0xfff2c0, fog: false })); eyeM.position.set(0, 8.9, -19.96); G.scene.add(eyeM); const beam = new THREE.Mesh(new THREE.ConeGeometry(4.6, 10.5, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide, fog: false })); beam.geometry.translate(0, -5.25, 0); beam.position.set(0, 8.9, -19.9); beam.rotation.x = 0.62; G.scene.add(beam); W.dyn.push(tt => { beam.rotation.z = Math.sin(tt * 0.5) * 0.5; beam.rotation.x = 0.62 + Math.sin(tt * 0.31) * 0.12; });
        const eyeOff = () => { eye.intensity = 0; eyeM.material.color.set(0x1c1c26); beam.visible = false; }; if (F.pylon) eyeOff();
        W.addInteract({ id: 'pump', x: -9.9, y: 0, z: -7.3, fx: -11, fz: -7.9, r: 1.9, label: 'RAISE THE PRESSURE', marker: 'act', mh: 2.4, when: () => F.e_alley && !F.pump && !S.enc, act: said('pump', [
          { who: 'cap', text: 'The hatch had lifted a hand\'s width and stuck. The riser\'s own pump had not been run in thirty years. It still drew. Everything they forget down here still draws.' },
          { who: 'hero', face: 'angry', text: 'Up. One at a time. Lamps hooded.' }], () => { S.walk = 0.001; U.toast('*TEN* UP THE RISER. LAMPS ON THE HILL ROAD: *THEIRS.*', 3.4); }) });
        W.addInteract({ id: 'pylon', x: 0, y: 0, z: -19.2, fx: 0, fz: -21, r: 2, label: 'PUT OUT THE EYE', marker: 'act', mh: 3, when: () => F.e_w2 && !F.pylon && !S.enc, act: said('pylon', [
          { who: 'cap', text: 'The Authority puts an eye on every hill. This one lit the whole valley floor for anyone coming down the road.' },
          { who: 'hero', face: 'smirk', text: 'Then they can come down it in the dark. Like us.' }], () => { eyeOff(); FX.burst(v3(0, 8.9, -19.9), 0xffe9a0, 1.6); SC.audio.sfx('crate'); U.toast('THE VALLEY IS DARK. *THEY ARE COMING ANYWAY.*', 3); }) });
        W.addInteract({ id: 'pull', x: 0, y: 0, z: 12.7, fx: 0, fz: 15, r: 1.9, label: 'REACH DOWN', marker: 'act', mh: 1.6, when: () => F.e_w3 && !F.pull && !S.enc, act: said('pull', [
          { who: 'cap', text: 'The last of them had stopped on the ladder. A girl, with a smaller girl on her back, and no hand free.' },
          { who: 'hero', face: 'hurt', text: 'Give her to me. ...Now you.' },
          { who: 'cap', text: 'She did not say thank you. She said: is the sky blue. I said: go and look.' }], () => { S.walk = 0.001; U.toast('*FORTY* UP THE RISER. ONE MORE LAMP ON THE ROAD. *HIS.*', 3.4); }) });
        W.addInteract({ id: 'lintel', x: -9.9, y: 0, z: -9, fx: -11, fz: -9, r: 1.45, label: 'LOOK', marker: 'clue', mh: 2.2, when: () => F.e_alley && !F.clue_lintel, act: clue('lintel', [
          { who: 'cap', text: 'Names cut in the lintel, one Assay under another. Most are scored through. Mine is there, with a gold nail in it. It is not my name.' },
          { who: 'hero', face: 'angry', text: 'Sorrel, E. ...Forty feet under this grass there is a tier they are striking tonight.' }]) });
        W.addInteract({ id: 'shoe', x: 2.5, y: 0, z: 12.2, r: 1.45, label: 'LOOK', marker: 'clue', mh: 1.1, when: () => F.e_alley && !F.clue_shoe, act: clue('shoe', [
          { who: 'cap', text: 'A child\'s shoe by the hatch. Somebody went into the pines with one foot bare and did not come back for it.' },
          { who: 'hero', face: 'hurt', text: 'Good. Do not come back.' }]) });
      } else {
        // the kneeling bell on the first landing: it comes down
        { const bo = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.42, 0.62, 10), G.toon({ color: 0xe8c25a })); bo.position.set(-5.3, 8.55, 15.6); G.scene.add(bo); if (F.bell) { bo.position.y = 6.3; bo.rotation.z = 1.3; }
          W.dyn.push((tt, dt) => { if (S.bellT > 0 && S.bellT < 1) { S.bellT = Math.min(1, S.bellT + dt * 2.2); bo.position.y = 8.55 - 2.25 * S.bellT * S.bellT; bo.rotation.z = S.bellT * 1.3; if (S.bellT >= 1) { FX.puff(bo.position, 5, 1); SC.cam.shake(0.5); SC.audio.sfx('crate'); } } else if (!F.bell) bo.rotation.z = Math.sin(tt * 1.4) * 0.06; }); }
        W.addInteract({ id: 'bell', x: -4.3, y: 6, z: 15.6, fx: -5.3, fz: 15.6, r: 1.9, label: 'CUT IT DOWN', marker: 'act', mh: 3.4, when: () => F.e_l1 && !F.bell && !S.enc, act: () => { setFlag('bell'); S.bellT = 0.001; pl.control = false; SC.audio.sfx('clue'); U.say([
          { who: 'cap', text: 'One bell to kneel for a clerk. Two for a House. It has rung on this landing every day for longer than there has been a Tier Six.' },
          { who: 'hero', face: 'angry', text: 'Not tonight.' },
          { who: 'clerk', text: "They'll hear that go all the way down. Good." }], () => { pl.control = true; U.toast('THE BELL IS DOWN. *NOBODY KNEELS.*', 3); objective(); }); } });
        // the lamps of everyone coming up behind him: each landing he clears, they take
        { const rows = [['e_alley', 0, 37, 44.5], ['e_l1', 6, 12.5, 17], ['e_l2', 12, -13, -9], ['boss', 18, -39, -35.5]], gl = new THREE.BoxGeometry(0.13, 0.2, 0.13), cp = new THREE.BoxGeometry(0.2, 0.06, 0.2), all = [];
          rows.forEach((r, ri) => { for (let i = 0; i < 12; i++) { const m = new THREE.Mesh(gl, new THREE.MeshBasicMaterial({ color: i % 4 ? 0xffe9a0 : 0x5ff2e2, fog: false })), c2 = new THREE.Mesh(cp, new THREE.MeshBasicMaterial({ color: 0x23232e })); const x = -5.6 + (i % 6) * 2.24 + ((i * 7 + ri) % 5) * 0.12, z = r[2] + (r[3] - r[2]) * (Math.floor(i / 6) * 0.7 + ((i * 3) % 4) * 0.07); m.position.set(x, r[1] + 0.13, z); c2.position.set(x, r[1] + 0.26, z); m.visible = c2.visible = false; G.scene.add(m, c2); all.push([r[0], m, c2]); } });
          W.dyn.push(() => { for (const a of all) a[1].visible = a[2].visible = !!F[a[0]]; }); }
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
            FX.ring(e.pos, 0xffd23a, 0.5, 5, 0.6); FX.word('OSWIN HALE', v3(e.pos.x, 21.4, e.pos.z), '#ffe14a', 1.6); SC.audio.sfx('roar'); U.boss(e, 'OSWIN HALE · HOUSE VIOLET'); objective(); cam.lock = e; n(); }]);
      });
      S.unstick = function () { const live = SC.enemies.filter(e => e.state !== 'dead' && e.state !== 'wait' && e.kind !== 'boss'); if (live.length) { live.forEach(e => e.die(0, 0, {})); U.toast('CLEARED.', 2); return; } const c = CROSS[S.cp] || CROSS.alley; if (c) { pl.place(c.x, c.y, c.z, c.yaw); cam.snapBehind(c.yaw); U.toast('BACK ON THE LAST SUN.', 2); } };
      SC.on('dazed', () => { if (!F.tutFinish) { F.tutFinish = 1; U.toast(SC.hosted ? 'WIDE OPEN. GET CLOSE AND PRESS *A* TO FINISH IT.' : 'WIDE OPEN. GET CLOSE AND HIT *INTERACT* TO FINISH IT.', 4); } });
      SC.on('secondchance', () => { if (S.enc && S.enc.id === 'boss') { const L = { docks: ['STILL ON THE PAGE', 'YOU HAVE MISCOUNTED, CAPTAIN. COUNT AGAIN.'], riser: ['FORTY BEHIND ME', 'IS THAT ALL OF YOU? SEND UP THE HILL FOR MORE.'], stair: ['BORN DOWN HERE', "I'VE BEEN ON THE FLOOR ALL MY LIFE. YOU SHOULD SEE WHAT I DO FROM IT."] }[SC.issue] || ['NOT YET', 'EVERY BREATH IS HERS. I HAVE PLENTY LEFT.']; SC.after(0.5, () => U.cut(L[0], L[1], true)); SC.after(2.6, () => U.toast('*' + L[1] + '*', 3.2)); } else SC.after(1.4, () => U.toast('*ON MY BREATH.* ONCE. A CHALKED SUN GIVES IT BACK.', 3.5)); });
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
      if (S.enc && RIS && pl.control && pl.pos.z > 10.9) pl.pos.z = pl.pos.z > 11.6 ? Math.max(10.9, pl.pos.z - dt * 9) : 10.9;   // he holds the line north of the hatch; he does not fight from behind it
      if (S.enc && S.enc.arena && !RIS && pl.control && pl.state !== 'dead') { const A = S.enc.arena; pl.pos.x = SC.clamp(pl.pos.x, A[0] - 0.2, A[2] + 0.2); pl.pos.z = SC.clamp(pl.pos.z, A[1] - 0.2, A[3] + 0.2); }   // a landing is fought on the landing
      if (!pl.control || S.enc || pl.state === 'dead') return;
      const x = pl.pos.x, y = pl.pos.y, z = pl.pos.z;
      { let on = null; if (F.intro) for (const id in CROSS) { const c = CROSS[id]; if (Math.abs(y - c.y) < 1.2 && (F.path ? Math.hypot(x - c.x, z - c.z) < 1.6 : id === 'alley' && (Math.hypot(x - c.x, z - c.z) < 2.2 || z < c.z - 0.8))) on = id; } if (on && S.onSun !== on) { S.onSun = on; crossing(on)(); return; } if (!on) S.onSun = null; }
      if (RIS) {
        if (S.pending || !F.e_alley || F.boss || S.bossDown) return;
        const next = F.pump && !F.e_w2 ? 'w2' : F.pylon && !F.e_w3 ? 'w3' : F.pull ? 'boss' : null; if (!next) return; S.pending = true;
        SC.after(next === 'boss' ? 3.4 : 4.2, () => { if (next === 'boss') bossIntro(); else { U.toast('LAMPS ON THE HILL ROAD. *MORE OF THEM.*', 2.2); startEnc(next); } });
      } else {
        if (SC.cold) { if (F.e_alley && y > 5.4 && z < 17) coldEnd(); return; }
        if (F.e_alley && !F.e_l1 && y > 5.4 && z < 17) { if (!F.echo) { setFlag('echo'); U.toast('*NINE HUNDRED STEPS. A WHITE DOOR. SOMEBODY STANDING IN FRONT OF IT.*', 3.4); } startEnc('l1'); }   /* where the cold open cut away, from the inside */
        else if (F.e_l1 && F.bell && !F.e_l2 && y > 11.4 && z < -9) startEnc('l2');
        else if (F.e_l2 && !F.boss && !S.bossDown && y > 17.4 && z < -36.5) bossIntro();
      }
    };
  }
  /* ================= THE VENT STACK: the Assay, day thirty-one. No boss. A climb, three fights on the way, the collar at the top, and the edge ================= */
  if (SC.issue === 'stack') {
    const done = () => { S.done = true; S.wipe(); if (!SC.host('done', { time: S.time, kills: pl.stats.kills, clues: pl.echoes })) U.end({ time: S.time, path: '', kills: pl.stats.kills, finishers: pl.stats.finishers, perfect: pl.stats.perfect, chances: pl.stats.chances, clues: pl.echoes }, () => { SC.emit('letterbox', false); cam.mode = 'follow'; S.newGame(); }); };
    for (const k in CROSS) delete CROSS[k]; for (const k in ENC) delete ENC[k];
    Object.assign(CROSS, { alley: { x: -6.5, y: 0, z: 17.5, yaw: Math.PI }, yard: { x: -9.6, y: 12, z: 9.6, yaw: Math.PI / 2 }, roof: { x: -9.6, y: 24, z: 9.6, yaw: Math.PI / 2 } });
    Object.assign(ENC, {
      alley: { arena: [-16, 9.2, 16, 23.6], floor: 0, waves: [[['hollow', -2, 11], ['hollow', 4, 12], ['hollow', -8, 12]]] },
      l1: { arena: [-13.6, 5.4, -5.4, 13.6], floor: 12, waves: [[['hollow', -12, 12], ['knifer', -7, 12.4]]] },
      l2: { arena: [-13.6, 5.4, -5.4, 13.6], floor: 24, waves: [[['bruiser', -11.5, 11.5]], [['hollow', -12.4, 7], ['knifer', -7, 12.6]]] }
    });
    Object.keys(ENC).forEach(k => { ENC[k].id = k; });
    brandOnStair = function () {};
    S.noBoots = () => !F.charged;   // Voss's boots are dead until they have stood on the collar
    objective = function () {
      let t = '', g = null;
      if (S.enc) t = S.enc.id === 'alley' ? "HOUSE TEAL'S PICKETS. THE STAIR IS BEHIND THEM." : S.enc.id === 'l2' ? 'A WARDEN OF THE DAIS. HE SAW WHAT I DID TO VOSS.' : 'CLEAR THE PLATFORM';
      else if (!F.path) { t = 'THE FOOT OF THE STACK'; g = CROSS.alley; }
      else if (!F.e_alley) t = "HOUSE TEAL'S PICKETS. THE STAIR IS BEHIND THEM.";
      else if (!F.e_l1) { t = "UP THE KEEPER'S STAIR"; g = { x: -9.6, y: 12, z: 9.6 }; }
      else if (!F.e_l2) { t = 'THE SECOND TURN'; g = { x: -9.6, y: 24, z: 9.6 }; }
      else if (!F.charged) { t = 'THE CROWN. STAND THE BOOTS ON THE COLLAR.'; g = { x: 0, y: 36, z: 3.6 }; }
      else if (!F.boss) { t = 'THE EDGE.'; g = { x: 0, y: 36, z: 8 }; }
      U.objective(t); S.goal = g;
    };
    S.objective = objective;
    encDone = function (id) { setFlag('e_' + id); S.pending = false; SC.audio.sfx('clue'); U.toast(id === 'alley' ? 'THE STAIR IS OPEN. *THIRTY-SIX METRES OF IT.*' : id === 'l1' ? 'ONE TURN. THE BOOTS ARE STILL COLD.' : 'NOBODY LEFT ABOVE ME. *THE CROWN.*', 3.4); objective(); };
    const begin = () => { SC.emit('letterbox', false); pl.faceOverride = null; pl.setState('idle'); pl.control = true; cam.mode = 'follow'; cam.snapBehind(Math.PI); U.showHud(true); setFlag('intro');
      U.toast(SC.hosted ? 'THE BOOTS ARE DEAD. *NO HOVER, NO LEAP.* CLIMB.' : 'WASD MOVES. J STRIKES. K DODGES. THE BOOTS ARE DEAD.', 5); };
    intro = function () {
      SC.state = 'play'; U.showHud(false); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; pl.faceOverride = 'angry';
      pl.place(-6.5, 0, 21.5, Math.PI); pl.model.anim.apply(P.idle(0), 999, 0.016); pl.model.face('angry'); pl.model.group.updateMatrixWorld(true);
      const pg = [
        { img: shot(-24, 7, 30, 0, 17, 0, 50, 768, 720), area: '1 / 1 / 3 / 2', cap: 'THE VENT STACK. THE ASSAY, DAY THIRTY-ONE.', cap2: 'THE ONLY ONE IN THE VALLEY. THE LAMPS RUN OFF IT, AND THE PUMP, AND THE BOOTS THE PROCTORS STAND ON.', fx: 'COLD' },
        { img: shot(-5.2, 1.6, 19.2, -6.5, 1.5, 21.5, 30), area: '1 / 2 / 2 / 3', cap2: "I HAD VOSS'S BOOTS AND THEY WERE DEAD IN MY HANDS. *A PROCTOR CHARGES THEM AT THE TOP.*" },
        { img: shot(-8, 2.4, 26, 0, 3, 11, 46), area: '2 / 2 / 3 / 3', cap: 'HOUSE TEAL HOLDS THE ISLAND.', cap2: 'THE STAIR IS FOR WHOEVER KEEPS THE STACK. BELOW, THAT IS US.' }
      ];
      pl.model.expr = null; U.page({ cols: '1.25fr 1fr', rows: '1fr 1fr', panels: pg }, begin);
    };
    bossIntro = function () {};
    ending = function () {
      if (F.boss) return; setFlag('boss'); S.enc = null; SC.clearEnemies(); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; U.showHud(false); SC.audio.sfx('clue');
      const still = (x, y, z, yaw, pose) => { pl.place(x, y, z, yaw); pl.model.anim.apply(pose || P.idle(0), 999, 0.016); pl.model.group.updateMatrixWorld(true); };
      still(0, 36, 8.1, 0); const a = shot(4.2, 37.3, 12.6, 0, 37.2, 8.1, 34, 768, 720);
      still(0, 31, 13, 0, P.leap); const b = shot(0, 44, 9.5, 0, 30, 13.4, 50);
      still(7, 44, 30, 0.4, P.leap); const c = shot(-30, 6, 44, 2, 30, 14, 52);
      U.page({ cols: '1.25fr 1fr', rows: '1fr 1fr', panels: [
        { img: a, area: '1 / 1 / 3 / 2', cap: 'THIRTY-SIX METRES. THE WHOLE VALLEY UNDER MY HEELS.', cap2: 'THEY HAD TOLD US THE BOOTS WERE WHAT MADE A PROCTOR.', fx: 'LIVE' },
        { img: b, area: '1 / 2 / 2 / 3', cap2: 'THEY ARE A BATTERY, AND A STACK,' },
        { img: c, area: '2 / 2 / 3 / 3', cap2: "*AND A MAN WHO ISN'T AFRAID OF THE HEIGHT.*" }
      ] }, () => done());
    };
    S.init = function () {
      clerk = { group: { visible: false, position: v3(0, 0, 0), rotation: {}, updateMatrixWorld() {} }, anim: { apply() {} } };
      pl.model.setGlow(0xf6f2e6, '#f6f2e6'); atmo('riser');
      Object.keys(CROSS).forEach(id => { const c = CROSS[id], mk = (tex, s, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(c.x, c.y + 0.07, c.z); m.renderOrder = 3; G.scene.add(m); return m; };
        const a = mk(G.tex.ring, 3.4, 0xffe14a, 0.9), b = mk(G.tex.disc, 2.3, 0xffe14a, 0.35); W.dyn.push(t => { a.rotation.z = t * 0.25; b.material.opacity = 0.25 + Math.sin(t * 3) * 0.12; }); });
      const glow = new THREE.PointLight(0x5fd0ff, 0, 30, 1.4); glow.position.set(0, 38.4, 0); G.scene.add(glow); W.dyn.push(t => { glow.intensity = F.charged ? 70 + Math.sin(t * 9) * 16 : 14 + Math.sin(t * 2) * 4; });
      W.addInteract({ id: 'collar', x: 0, y: 36, z: 3.6, fx: 0, fz: 0, r: 1.9, label: 'STAND THE BOOTS ON IT', marker: 'act', mh: 1.4, when: () => F.e_l2 && !F.charged && !S.enc, act: () => { setFlag('charged'); pl.control = false; SC.audio.sfx('clue'); U.say([
        { who: 'cap', text: 'A collar on the crown of the stack, worn bright where a hundred Proctors have stood their heels. I put the dead boots on it, and my own weight on them.' },
        { who: 'cap', text: 'They took one long breath, the way a ward fan does when the branch comes up. Then they burned blue.' },
        { who: 'hero', face: 'smirk', text: 'It is our air. They have been flying on our air.' }], () => { pl.control = true; FX.burst(v3(0, 36.3, 3.6), 0x5fd0ff, 1.8); SC.cam.shake(0.4); U.toast('THE BOOTS ARE *LIVE*. THE EDGE.', 3.4); objective(); }); } });
      W.addInteract({ id: 'tag', x: -13.2, y: 12, z: 9.6, fx: -14, fz: 9.6, r: 1.45, label: 'LOOK', marker: 'clue', mh: 1.4, when: () => F.e_l1 && !F.clue_tag, act: clue('tag', [
        { who: 'cap', text: 'A slate tag wired to the rail. CHECKED, a date, two initials. K.D. The same hand has checked this stack every nine days all season.' },
        { who: 'hero', face: 'smirk', text: 'Somebody up here does the rounds. Somebody up here knows what a seal is.' }]) });
      W.addInteract({ id: 'plate', x: -6.4, y: 24, z: 6.4, fx: -5, fz: 3.4, r: 1.6, label: 'LOOK', marker: 'clue', mh: 1.8, when: () => F.e_l2 && !F.clue_plate, act: clue('plate', [
        { who: 'cap', text: 'A gilt plate riveted to the stack. DRAWN FROM RISER NINE. The lamps, the pump, the boots: all of it comes up one pipe from under the floor.' },
        { who: 'hero', face: 'angry', text: 'Forty feet under this grass somebody is turning a wheel so that a Proctor need not touch the ground.' }]) });
    };
    S.update = function (dt, rdt) {
      for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= rdt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } }
      if (SC.state !== 'play') return;
      if (pl.control) S.time += rdt;
      updateEnc(dt);
      if (S.enc && S.enc.arena && pl.control && pl.state !== 'dead') { const A = S.enc.arena; pl.pos.x = SC.clamp(pl.pos.x, A[0] - 0.2, A[2] + 0.2); pl.pos.z = SC.clamp(pl.pos.z, A[1] - 0.2, A[3] + 0.2); }
      if (!pl.control || S.enc || pl.state === 'dead') return;
      const x = pl.pos.x, y = pl.pos.y, z = pl.pos.z;
      { let on = null; if (F.intro) for (const id in CROSS) { const c = CROSS[id]; if (Math.abs(y - c.y) < 1.2 && (F.path ? Math.hypot(x - c.x, z - c.z) < 1.6 : id === 'alley' && (Math.hypot(x - c.x, z - c.z) < 2.2 || z < c.z - 0.8))) on = id; } if (on && S.onSun !== on) { S.onSun = on; crossing(on)(); return; } if (!on) S.onSun = null; }
      if (F.e_alley && !F.e_l1 && y > 11.4 && x < -5.6 && z > 5.6) startEnc('l1');
      else if (F.e_l1 && !F.e_l2 && y > 23.4 && x < -5.6 && z > 5.6) startEnc('l2');
      else if (F.charged && !F.boss && y > 35.4 && z > 7.5 && Math.abs(x) < 4.6) ending();
    };
  }
  /* ================= THE DEEP ARRAY: forty-three days after the furnace, with Dace. He is a valve hand with a wrench: no boots, no hook, no ELEVEN. A stair down, a lamp to get past, the heart of it, a brawl, and a run for the hatch ================= */
  if (SC.issue === 'array') {
    const done = () => { S.done = true; S.wipe(); if (!SC.host('done', { time: S.time, kills: pl.stats.kills, clues: pl.echoes })) U.end({ time: S.time, path: '', kills: pl.stats.kills, finishers: pl.stats.finishers, perfect: pl.stats.perfect, chances: pl.stats.chances, clues: pl.echoes }, () => { SC.emit('letterbox', false); cam.mode = 'follow'; S.newGame(); }); };
    for (const k in CROSS) delete CROSS[k]; for (const k in ENC) delete ENC[k];
    Object.assign(CROSS, { alley: { x: -14, y: 12, z: 23.5, yaw: Math.PI }, yard: { x: 16.3, y: 8, z: 2, yaw: Math.PI }, roof: { x: 9, y: 0, z: -11, yaw: -Math.PI / 2 } });
    Object.assign(ENC, {
      w1: { arena: [-13.6, 0.3, 14, 3.7], floor: 8, waves: [[['hollow', 12, 2], ['hollow', -12.6, 2]]] },
      l1: { arena: [-13, -27, 13, -5.6], floor: 0, waves: [[['hollow', 11, -8], ['hollow', -11, -9]], [['hollow', 10, -24], ['hollow', -10, -24], ['hollow', 0, -7]]] }
    });
    Object.keys(ENC).forEach(k => { ENC[k].id = k; });
    S.noBoots = () => true; S.plain = () => true;   // nothing he has not learned yet
    const dace = (x, y, z, yaw) => { const g = clerk.group.position; if (clerk.group.visible && Math.hypot(g.x - pl.pos.x, g.z - pl.pos.z) < 26 && Math.abs(g.y - pl.pos.y) < 9) return; showClerk(x, y, z, yaw === undefined ? Math.PI : yaw); };
    brandOnStair = function () { if (F.heart) dace(3, 0, -11); else if (F.down) dace(15, 0, -22, 0); else dace(-12.4, 12, 25.4, 2.6); };
    const left = () => Math.max(0, Math.ceil(S.runT || 0));
    objective = function () {
      let t = '', g = null;
      if (S.enc) t = S.enc.id === 'w1' ? 'THE ARRAY WATCH. THEY HAVE SEEN US.' : 'THE ARRAY WATCH. A WRENCH WILL HAVE TO DO.';
      else if (!F.path) { t = 'DOWN THE LADDER, AFTER DACE'; g = CROSS.alley; }
      else if (!F.across) { t = 'CROSS THE CATWALK WHEN THE LAMP HAS GONE BY'; g = { x: 16.3, y: 8, z: 2 }; }
      else if (!F.down) { t = 'DOWN TO THE FLOOR'; g = { x: 16.3, y: 0, z: -22 }; }
      else if (!F.heart) { t = 'THE HEART OF IT'; g = { x: 0, y: 0, z: -12.4 }; }
      else if (!F.e_l1) t = 'THE ARRAY WATCH. A WRENCH WILL HAVE TO DO.';
      else if (!F.boss) { t = 'THE SEAL HAS GONE. THE HATCH. ' + left(); g = { x: -14, y: 12, z: 24 }; }
      U.objective(t); S.goal = g;
    };
    S.objective = objective;
    encDone = function (id) { setFlag('e_' + id); S.pending = false; SC.audio.sfx('clue');
      if (id === 'w1') U.toast('TWO OF THE WATCH, AND NOBODY TO MISS THEM TILL THE BELL. *GO ON.*', 3.4);
      else { S.runT = 60; SC.cam.shake(0.8); U.toast('THE SEAL HAS GONE. *THE HATCH.* DACE IS ALREADY RUNNING.', 3.6); showClerk(-13, 12, 25, 2.6); }
      objective(); };
    const begin = () => { SC.emit('letterbox', false); pl.faceOverride = null; pl.setState('idle'); pl.control = true; cam.mode = 'follow'; cam.snapBehind(Math.PI); U.showHud(true); setFlag('intro');
      U.toast(SC.hosted ? 'A WRENCH AND TWO HANDS. *NO BOOTS, NO LINE, NO COUNT.*' : 'WASD MOVES. J STRIKES. K DODGES. THAT IS ALL HE KNOWS YET.', 5); };
    intro = function () {
      SC.state = 'play'; U.showHud(false); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; pl.faceOverride = 'angry';
      pl.place(-14, 12, 26, Math.PI); pl.model.anim.apply(P.idle(0), 999, 0.016); pl.model.face('angry'); pl.model.group.updateMatrixWorld(true); brandOnStair(); if (clerk) clerk.group.updateMatrixWorld(true);
      const pg = [
        { img: shot(-16, 15.5, 27, 4, 3, -16, 58, 768, 720), area: '1 / 1 / 3 / 2', cap: 'THE DEEP ARRAY. FORTY-THREE DAYS AFTER THE FURNACE.', cap2: 'UNDER THE FLOOR, UNDER ALL SIX TIERS. THE MACHINE THE AIR COMES FROM.', fx: 'THIRTY-ONE' },
        { img: shot(-11.6, 13.5, 23.6, -13.4, 13.4, 25.8, 34), area: '1 / 2 / 2 / 3', cap2: '"YOU WANT TO SEE WHAT THEY\'RE COUNTING?" DACE SAID. *I HAD A WRENCH, AND NO IDEA.*' },
        { img: shot(-16.6, 10.4, 6, 12, 8.6, 2, 46), area: '2 / 2 / 3 / 3', cap: 'I HAD READ ITS NAME ON A THOUSAND WORK ORDERS.', cap2: 'NOBODY FROM TIER SIX HAS BEEN LET IN TO SEE IT.' }
      ];
      pl.model.expr = null; U.page({ cols: '1.25fr 1fr', rows: '1fr 1fr', panels: pg }, begin);
    };
    bossIntro = function () {};
    ending = function () {
      if (F.boss) return; setFlag('boss'); S.runT = 0; S.enc = null; SC.clearEnemies(); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; U.showHud(false); SC.audio.sfx('clue');
      const still = (x, y, z, yaw) => { pl.place(x, y, z, yaw); pl.model.anim.apply(P.idle(0), 999, 0.016); pl.model.group.updateMatrixWorld(true); };
      still(-14, 12, 26.4, 0); showClerk(-12.6, 12, 25.6, -0.6); clerk.group.updateMatrixWorld(true);
      const a = shot(-11, 13.6, 22.4, -13.6, 13.3, 26.2, 36, 768, 720), b = shot(-15, 17, 24, 2, 3, -17, 54), c = shot(2, 7, -8, 0, 8, -27.9, 40);
      U.page({ cols: '1.25fr 1fr', rows: '1fr 1fr', panels: [
        { img: a, area: '1 / 1 / 3 / 2', cap: 'I CAME UP THROUGH THE FLOOR WITH TAR ON MY HANDS.', cap2: 'I HAD BEEN KEEPING IT ALIVE FOR TEN YEARS, ONE VALVE AT A TIME, AND NOBODY HAD EVER LET ME SEE IT.', fx: 'OURS' },
        { img: b, area: '1 / 2 / 2 / 3', cap2: '"NOW YOU KNOW WHAT THEY ARE COUNTING," DACE SAID.' },
        { img: c, area: '2 / 2 / 3 / 3', cap2: '*NOT WHO BREATHES. HOW LONG.*' }
      ] }, () => done());
    };
    S.init = function () {
      clerk = S.clerk = SC.makeHumanoid('clerk'); G.scene.add(clerk.group); clerk.group.visible = false;
      { let ph = 0; W.dyn.push((t, dt) => { if (!clerk.group.visible) return; const g = clerk.group.position, yaw = pl.yaw, tx = pl.pos.x - Math.sin(yaw) * 1.9 + Math.cos(yaw) * 1.35, tz = pl.pos.z - Math.cos(yaw) * 1.9 - Math.sin(yaw) * 1.35, dx = tx - g.x, dz = tz - g.z, d = Math.hypot(dx, dz);
          if (dt > 0 && SC.state === 'play' && !S.enc && pl.control && !(S.runT > 0) && d > 0.7 && d < 45) { const sp = Math.min(6.4, 1.2 + d * 2), k = Math.min(1, sp * dt / d); g.x += dx * k; g.z += dz * k; g.y = SC.damp(g.y, W.ground(g.x, g.z, g.y + 0.7), 16, dt); clerk.group.rotation.y = SC.dampAng(clerk.group.rotation.y, Math.atan2(dx, dz), 9, dt); ph += sp * dt * 1.7; clerk.anim.apply(P.run ? P.run(ph) : P.idle(t), 12, dt); }
          else { if (dt > 0) clerk.group.rotation.y = SC.dampAng(clerk.group.rotation.y, Math.atan2(pl.pos.x - g.x, pl.pos.z - g.z), 3, dt); clerk.anim.apply(P.idle(t), 6, 0.016); } }); }
      pl.model.setGlow(0xffd98a, '#ffd98a');
      try { const st = document.createElement('style'); st.textContent = '#tagPw,#tagEc{display:none!important}'; document.head.appendChild(st); } catch (e) { /* the chips stay */ }   // no ELEVEN and no Count on a man who has not learned them
      Object.keys(CROSS).forEach(id => { const c = CROSS[id], mk = (tex, s, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(c.x, c.y + 0.07, c.z); m.renderOrder = 3; G.scene.add(m); return m; };
        const a = mk(G.tex.ring, 3.4, 0xffe14a, 0.9), b = mk(G.tex.disc, 2.3, 0xffe14a, 0.35); W.dyn.push(t => { a.rotation.z = t * 0.25; b.material.opacity = 0.25 + Math.sin(t * 3) * 0.12; }); });
      // light: warm where people work, sea-green where the Array still runs
      [[-14, 15, 24, 0xffb060, 60], [0, 6, -18, 0x5ff2e2, 70], [0, 12, -24, 0xffe9a0, 40], [10, 6, -6, 0xffb060, 30], [-10, 6, -8, 0x5ff2e2, 26]].forEach(l => { const p = new THREE.PointLight(l[3], l[4], 34, 1.4); p.position.set(l[0], l[1], l[2]); G.scene.add(p); });
      // four great fans in the west wall. One turns. One is trying to. Two have stopped
      const fans = [[-22, 1.6], [-13, 0.22], [-4, 0], [-25.4, 0]].map((f, i) => { const g = new THREE.Group(), m = G.toon({ color: i < 2 ? 0xb8863a : 0x4a3a2c }); for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.6, 0.7), m); b.position.y = 1.8; const h = new THREE.Group(); h.add(b); h.rotation.x = k * Math.PI / 2; g.add(h); } const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 10), m); hub.rotation.z = Math.PI / 2; g.add(hub); g.position.set(-17.7, i === 3 ? 17 : 15.5, i === 3 ? -14 : f[0]); G.scene.add(g); return { g, sp: f[1] }; });
      W.dyn.push((t, dt) => { fans.forEach((f, i) => { if (f.sp) f.g.rotation.x += dt * f.sp * (i === 1 ? (Math.sin(t * 0.9) > 0.2 ? 1 : 0.05) : 1); }); });
      // the watch lamp: it runs up and down a rail over the middle of the catwalk
      const lamp = new THREE.PointLight(0xffe9a0, 60, 16, 1.6), cone = new THREE.Mesh(new THREE.ConeGeometry(2.5, 5, 18, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, fog: false })), spot = new THREE.Mesh(new THREE.CircleGeometry(2.5, 24), new THREE.MeshBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: 0.3, depthWrite: false, fog: false })), box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), new THREE.MeshBasicMaterial({ color: 0xfff2c0, fog: false }));
      spot.rotation.x = -Math.PI / 2; [lamp, cone, spot, box].forEach(o => G.scene.add(o)); S.lampX = 3;
      W.dyn.push(t => { const on = !F.across && !F.e_w1, x = 3 + Math.sin(t * 0.42) * 8.5; S.lampX = x; lamp.position.set(x, 12.6, 2); lamp.intensity = on ? 60 : 0; cone.position.set(x, 10.6, 2); spot.position.set(x, 8.05, 2); box.position.set(x, 13, 2); cone.visible = spot.visible = on; box.material.color.set(on ? 0xfff2c0 : 0x2a2a30); });
      const said = (flag, lines, after) => () => { setFlag(flag); SC.audio.sfx('clue'); pl.control = false; U.say(lines, () => { pl.control = true; if (after) after(); objective(); }); };
      W.addInteract({ id: 'heart', x: 0, y: 0, z: -12.4, fx: 0, fz: -14, r: 2, label: 'PUT A HAND ON IT', marker: 'act', mh: 2, when: () => F.down && !F.heart && !S.enc, act: said('heart', [
        { who: 'cap', text: 'The heart of the Array. Every breath on six tiers comes through this drum, and every breath above them. The main seal was weeping under my palm, the way a bank does a year before it goes.' },
        { who: 'clerk', text: 'Forty-eight banks. Count the lamps.' },
        { who: 'cap', text: 'Thirty-one lit. The dark ones had dates chalked on them, in hands I knew. Orin. Mara. One in a hand I knew better than my own.' },
        { who: 'hero', face: 'hurt', text: "Ten years I've kept my seven valves turning. I thought the rest of it was up here being looked after." },
        { who: 'clerk', text: "Nobody's looking after it. They're counting it. *That's what the Count is, Kael.* Lamps on the gantry. Move." }], () => { brandOnStair(); startEnc('l1'); }) });
      W.addInteract({ id: 'patch', x: 2.2, y: 0, z: -6.2, fx: 0.9, fz: -6.2, r: 1.6, label: 'LOOK', marker: 'clue', mh: 1.8, when: () => F.down && !F.clue_patch, act: clue('patch', [
        { who: 'cap', text: 'A split in the main, bound in rag and wire and tar. A date chalked beside it, forty years gone. Then another beside that. Nine patches on one pipe, and every one of them ours.' },
        { who: 'hero', face: 'angry', text: 'They never mended it. They let us.' }]) });
      W.addInteract({ id: 'board', x: 0, y: 0, z: -26.4, fx: 0, fz: -28, r: 1.9, label: 'LOOK', marker: 'clue', mh: 3, when: () => F.down && !F.clue_board, act: clue('board', [
        { who: 'cap', text: 'BANKS LIVE: 31 OF 48. Somebody has painted the 31 over an older number. Under the paint you can still read 36.' },
        { who: 'hero', face: 'hurt', text: 'Five banks since anybody last troubled to repaint it.' }]) });
    };
    S.update = function (dt, rdt) {
      for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= rdt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } }
      if (SC.state !== 'play') return;
      if (pl.control) S.time += rdt;
      updateEnc(dt);
      if (S.enc && S.enc.arena && pl.control && pl.state !== 'dead') { const A = S.enc.arena; pl.pos.x = SC.clamp(pl.pos.x, A[0] - 0.2, A[2] + 0.2); pl.pos.z = SC.clamp(pl.pos.z, A[1] - 0.2, A[3] + 0.2); }
      if (!pl.control || S.enc || pl.state === 'dead') return;
      const x = pl.pos.x, y = pl.pos.y, z = pl.pos.z;
      { let on = null; if (F.intro) for (const id in CROSS) { const c = CROSS[id]; if (Math.abs(y - c.y) < 1.2 && (F.path ? Math.hypot(x - c.x, z - c.z) < 1.6 : id === 'alley' && (Math.hypot(x - c.x, z - c.z) < 2.2 || z < c.z - 0.8))) on = id; } if (on && S.onSun !== on) { S.onSun = on; crossing(on)(); return; } if (!on) S.onSun = null; }
      if (!F.path) return;
      if (!F.across && !F.e_w1 && Math.abs(y - 8) < 0.8 && z < 4.2 && Math.abs(x - S.lampX) < 2.3) { U.toast('*SEEN.* THE WATCH IS ON THE CATWALK.', 2.6); SC.audio.sfx('hurt'); startEnc('w1'); return; }
      if (!F.across && Math.abs(y - 8) < 0.8 && x > 14.8) { setFlag('across'); if (!F.e_w1) U.toast('PAST IT. *NOBODY SAW.*', 2.6); objective(); }
      if (F.across && !F.down && y < 0.6 && z < -16) { setFlag('down'); brandOnStair(); objective(); }
      if (F.e_l1 && !F.boss) { const was = left(); S.runT -= rdt; if (S.runT <= 0) { S.runT = 25; pl.hp = Math.max(8, pl.hp - 22); SC.cam.shake(0.6); SC.emit('flash', '#ffffff'); U.toast('THE AIR IS GOING. *MOVE.*', 2.4); }
        if (left() !== was) objective(); if (Math.random() < dt * 5) FX.puff(v3((Math.random() - 0.5) * 30, 0.2 + Math.random() * 8, -26 + Math.random() * 44), 4, 1.2);
        if (y > 11.4 && z > 20.4) ending(); }
    };
  }
  /* ================= THE TABLE: the Gilding, drawn. Nobody fights. Fourteen pictures of what was done, in the order it was done ================= */
  if (SC.issue === 'gild') {
    for (const k in CROSS) delete CROSS[k]; for (const k in ENC) delete ENC[k];
    objective = function () {}; brandOnStair = function () {};
    const A = {}, PR = {}, HP = Math.PI / 2;
    const gold = new THREE.MeshBasicMaterial({ color: 0xffd26e, fog: false, depthTest: false }), goldS = new THREE.MeshBasicMaterial({ color: 0xffd26e, fog: false }), blackM = new THREE.MeshBasicMaterial({ color: 0x0c0b10 }), cutM = new THREE.MeshBasicMaterial({ color: 0x8a1f24, fog: false, depthTest: false });
    const stick = (r, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 6), mat); m.visible = false; m.renderOrder = 5; G.scene.add(m); m.span = (a, b) => { const d = b.clone().sub(a), len = d.length() || 0.001; m.scale.set(1, len, 1); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(v3(0, 1, 0), d.normalize()); m.visible = true; }; return m; };
    const bw = (m, n) => { m.group.updateMatrixWorld(true); return m.bones[n].getWorldPosition(v3()); };
    // poses. Lying down is the standing body tipped onto its back, so "forward" is up
    const LIE = { shL: [0, 0, 0.17], elL: [-0.06, 0, 0], shR: [0, 0, -0.17], elR: [-0.06, 0, 0], thL: [0, 0, 0.05], thR: [0, 0, -0.05] };
    const ARCH = { spine: [-0.14, 0, 0], chest: [-0.12, 0, 0], head: [0.1, 0, 0], shL: [0.1, 0, 0.3], elL: [-0.5, 0, 0], shR: [0.1, 0, -0.3], elR: [-0.5, 0, 0], thL: [-0.06, 0, 0.07], thR: [0.03, 0, -0.07], shnL: [0.1, 0, 0] };
    const PALM = { head: [0, -0.35, 0], shL: [0, 0, 0.17], elL: [-0.06, 0, 0], shR: [-1.15, 0, -0.55], elR: [-0.55, 0, 0], thL: [0, 0, 0.05], thR: [0, 0, -0.05] };
    const FISTS = { head: [0.22, -0.3, 0], shL: [-0.6, 0, -0.3], elL: [-2.15, 0, 0], shR: [-0.6, 0, 0.3], elR: [-2.15, 0, 0], thL: [0, 0, 0.05], thR: [0, 0, -0.05] };
    const BEND = { spine: [0.44, 0, 0], chest: [0.32, 0, 0], neck: [0.12, 0, 0], head: [0.3, 0, 0], shL: [-1.0, 0, 0.06], elL: [-0.75, 0, 0], shR: [-1.3, 0, -0.06], elR: [-0.4, 0, 0], thL: [-0.06, 0, 0.07], thR: [0.06, 0, -0.07], y: -0.02 };
    const DRAW = { spine: [0.3, 0, 0], chest: [0.2, 0, 0], head: [0.34, 0, 0], shL: [-0.9, 0, 0.1], elL: [-0.6, 0, 0], shR: [-2.0, 0, -0.2], elR: [-0.9, 0, 0], thL: [-0.05, 0, 0.07], thR: [0.05, 0, -0.07] };
    const LAMPUP = { spine: [0.1, 0, 0], head: [0.28, 0, 0], shL: [0.06, 0, 0.13], elL: [-0.28, 0, 0], shR: [-2.2, 0, -0.25], elR: [-0.5, 0, 0], thL: [-0.05, 0, 0.06], thR: [0.05, 0, -0.06] };
    const BACK = { spine: [-0.04, 0, 0], head: [0.2, 0, 0], shL: [0.06, 0, 0.14], elL: [-0.3, 0, 0], shR: [0.06, 0, -0.14], elR: [-0.3, 0, 0], thL: [-0.05, 0, 0.06], thR: [0.05, 0, -0.06] };
    const SIT = { spine: [0.12, 0, 0], chest: [0.06, 0, 0], head: [-0.08, 0, 0], shL: [-0.25, 0, 0.2], elL: [-0.5, 0, 0], shR: [-0.25, 0, -0.2], elR: [-0.5, 0, 0], thL: [-1.5, 0, 0.1], shnL: [1.5, 0, 0], thR: [-1.5, 0, -0.1], shnR: [1.5, 0, 0] };
    const SHOW = { spine: [0.06, 0, 0], head: [0.12, 0, 0], shL: [0.06, 0, 0.13], elL: [-0.28, 0, 0], shR: [-1.45, 0, -0.1], elR: [-0.95, 0, 0], thL: [-0.05, 0, 0.06], thR: [0.05, 0, -0.06] };
    const UNSURE = { spine: [0.14, 0, 0], chest: [0.08, 0, 0], head: [0.36, 0, 0], shL: [-0.3, 0, 0.3], elL: [-0.6, 0, 0], shR: [-0.25, 0, -0.26], elR: [-0.7, 0, 0], thL: [-0.2, 0, 0.14], shnL: [0.32, 0, 0], thR: [0.1, 0, -0.14], shnR: [0.22, 0, 0], y: -0.05 };
    const STEADY = { spine: [0.1, 0, 0], head: [0.1, 0, 0], shL: [-0.9, 0, 0.3], elL: [-0.9, 0, 0], shR: [0.06, 0, -0.13], elR: [-0.28, 0, 0], thL: [-0.05, 0, 0.06], thR: [0.05, 0, -0.06] };
    const hideAll = () => { for (const k in A) A[k].group.visible = false; for (const k in PR) { const p = PR[k]; if (Array.isArray(p)) p.forEach(q => { q.visible = false; }); else p.visible = false; } W.gildLamp.intensity = 46; PR.cone.visible = true; pl.model.group.visible = false; };
    const stand = (k, x, z, yaw, pose, expr, y) => { const m = A[k]; m.group.visible = true; m.group.rotation.set(0, yaw, 0); m.group.position.set(x, y || 0, z); m.anim.apply(Object.assign({}, P.idle(0), pose || {}), 999, 0.016); m.face(expr || 'neutral'); m.group.updateMatrixWorld(true); return m; };
    const lie = (k, pose, expr) => { const m = A[k], h = m.spec.h; m.group.visible = true; m.group.rotation.set(-HP, 0, 0); m.group.position.set(0, 0.94 + 0.125 * h, -0.78 + 1.73 * h); m.anim.apply(Object.assign({ sc1: [0, 0, 0] }, pose || LIE), 999, 0.016); m.face(expr || 'shut'); m.group.updateMatrixWorld(true); return m; };
    const straps = on => { PR.straps.forEach(s => { s.visible = on; }); };
    const wires = m => { const segs = [['thL', 'shnL'], ['shnL', 'ftL'], ['thR', 'shnR'], ['shnR', 'ftR'], ['shL', 'elL'], ['elL', 'haL'], ['shR', 'elR'], ['elR', 'haR']]; let n = 0;
      segs.forEach((s, i) => { const a = bw(m, s[0]), b = bw(m, s[1]); a.y += 0.02; b.y += 0.02; PR.wire[i].span(a, b); for (let j = 0; j < 2; j++) { const c = PR.cut[n++]; c.position.copy(a).lerp(b, 0.3 + j * 0.4); c.position.y += 0.03; c.rotation.y = i * 0.7 + j; c.visible = true; } }); };
    const sh = (px, py, pz, lx, ly, lz, fov) => shot(px, py, pz, lx, ly, lz, fov, 896, 504);
    S.init = function () {
      clerk = { group: { visible: false, position: v3(0, 0, 0), rotation: {}, updateMatrixWorld() {} }, anim: { apply() {} } };
      ['k0', 'k1', 'k1w', 'k2', 'ilse', 'u1', 'u2'].forEach(k => { const m = A[k] = SC.makeHumanoid(k[0] === 'u' ? 'unlit' : k); m.anim = m.anim || new SC.Anim(m); G.scene.add(m.group); m.group.visible = false; });
      // the valve burns: on every one of him
      ['k0', 'k1', 'k1w'].forEach(k => ['haL', 'haR'].forEach(hn => { [[0, -0.06, -0.04, 0.07, 0.035], [0.008, -0.105, -0.036, 0.05, 0.028]].forEach(q => { const b = new THREE.Mesh(new THREE.BoxGeometry(q[3], q[4], 0.012), new THREE.MeshBasicMaterial({ color: 0xa8482a })); b.position.set(q[0], q[1], q[2]); A[k].bones[hn].add(b); }); }));
      // what goes over him, into him, and out of him
      PR.straps = []; [[-0.28, 0.34], [0.42, 0.3], [0.86, 0.27]].forEach(s => { const mat = G.toon({ color: 0x5a4028 }); [[0, 1.2 + s[1] * 0.1, 0.58, 0], [-0.4, 1.07, 0.3, 1.05], [0.4, 1.07, 0.3, -1.05]].forEach(q => { const b = new THREE.Mesh(new THREE.BoxGeometry(q[2], 0.03, 0.1), mat); b.position.set(q[0], q[1], s[0]); b.rotation.z = q[3]; G.scene.add(b); PR.straps.push(b); }); });
      PR.wire = []; for (let i = 0; i < 8; i++) PR.wire.push(stick(0.011, gold));
      PR.cut = []; for (let i = 0; i < 24; i++) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.006, 0.012), cutM); c.renderOrder = 6; c.visible = false; G.scene.add(c); PR.cut.push(c); }
      PR.feed = stick(0.006, goldS); PR.tube = stick(0.008, goldS); PR.thread = stick(0.012, blackM);
      PR.coil = new THREE.Group(); [[0.075, 0, 0], [0.05, 0.02, 0.5], [0.03, 0.04, 1.1]].forEach(q => { const c = new THREE.Mesh(new THREE.TorusGeometry(q[0], 0.014, 6, 14), blackM); c.rotation.x = HP + 0.12 * q[2]; c.position.y = q[1]; PR.coil.add(c); }); PR.coil.position.set(1.16, 1.0, -0.24); G.scene.add(PR.coil);
      PR.leaf = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.004), goldS); G.scene.add(PR.leaf);
      PR.bare = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshBasicMaterial({ color: 0xfff6d8, fog: false })); G.scene.add(PR.bare); PR.bareL = new THREE.PointLight(0xfff0c8, 0, 5, 1.4); G.scene.add(PR.bareL);
      PR.gauze = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.12), G.toon({ color: 0xefe8d4 })); PR.gauze.position.set(-0.2, 0.96, -0.6); PR.gauze.rotation.y = 0.5; G.scene.add(PR.gauze);
      PR.cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.3, 22, 1, true), new THREE.MeshBasicMaterial({ color: 0xffecbe, transparent: true, opacity: 0.085, depthWrite: false, side: THREE.DoubleSide, fog: false })); PR.cone.position.set(0, 2.08, 0); G.scene.add(PR.cone);
      if (A.k2.setGlow) A.k2.setGlow(0xf6f2e6, '#f6f2e6');
      hideAll();
    };
    S.update = function (dt, rdt) { for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= rdt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } } pl.model.group.visible = false; };
    S.gild = { A, PR, bw, hideAll: () => hideAll(), stand: (...a) => stand(...a), lie: (...a) => lie(...a) };
    const TWO = { cols: '1fr 1fr', rows: '1fr' }, THREE_ = { cols: '1.25fr 1fr', rows: '1fr 1fr' }, a2 = ['1 / 1 / 2 / 2', '1 / 2 / 2 / 3'], a3 = ['1 / 1 / 3 / 2', '1 / 2 / 2 / 3', '2 / 2 / 3 / 3'];
    const PAGES = [
      () => { const out = [];
        hideAll(); stand('k0', 0.25, 2.0, Math.PI, { head: [0.18, 0, 0] }, 'neutral'); stand('ilse', 1.0, -0.45, 0.45, SHOW, 'neutral'); stand('u1', -1.35, -0.2, HP, BACK); stand('u2', -1.15, 1.35, HP * 1.3, BACK);
        out.push({ img: sh(4.3, 2.5, 4.3, -0.2, 1.0, -0.5, 46), cap: 'PUMP ROOM SEVEN. UNDER TIER SIX. SEALED FOR THIRTY YEARS.', cap2: 'SHE HAD CARRIED IT DOWN A PIECE AT A TIME. A TABLE. A LAMP. *EVERYTHING THEY USE ON THEIR OWN CHILDREN.*' });
        hideAll(); PR.feed.span(v3(1.4, 1.1, -0.22), v3(0.7, 1.75, 0.3));
        out.push({ img: sh(2.2, 1.5, -1.3, 1.3, 0.98, -0.45, 32), cap2: 'GOLD WIRE, FINER THAN PACKING THREAD. *THAT SPOOL WOULD BUY TIER SIX ITS AIR FOR A YEAR.* SHE HAD STOLEN IT FOR MY SHINS.' });
        hideAll(); lie('k0', LIE, 'neutral'); straps(true); stand('u2', -0.82, 0.45, HP, BEND); stand('ilse', 0.35, -1.85, 0.1, BACK, 'neutral');
        out.push({ img: sh(1.75, 1.75, 2.0, 0, 1.08, -0.25, 42), cap: 'THE STRAPS ARE NOT FOR THE PAIN.', cap2: '"THEY ARE FOR THE GROWING. A BONE THAT IS BEING LENGTHENED WILL TRY TO GO BACK TO WHAT IT WAS. *SO WILL YOU.*"' });
        return Object.assign({ panels: out.map((p, i) => Object.assign(p, { area: a3[i] })) }, THREE_); },
      () => { const out = [];
        hideAll(); const k = lie('k0', ARCH, 'angry'); straps(true); wires(k); stand('ilse', 0.8, 0.55, -HP, BEND, 'neutral'); stand('u1', -0.95, -0.35, HP, LAMPUP);
        PR.tube.span(v3(-0.8, 1.84, -0.93), bw(k, 'elL'));
        out.push({ img: sh(0, 3.08, 0.62, 0, 1.0, 0.12, 66), cap: 'FIRST THE BONES.', cap2: 'A CHILD\'S BONES ARE SOFT AND TAKE THE WIRE. MINE HAD TO BE OPENED. *I COUNTED THE PLACES. OF COURSE I COUNTED.*' });
        PR.feed.span(v3(1.4, 1.1, -0.22), bw(k, 'shnR').add(v3(0, 0.07, 0)));
        A.u1.group.visible = false;
        out.push({ img: sh(-0.95, 1.5, 1.75, 0.1, 1.08, 0.5, 34), cap2: 'A FINGER\'S WIDTH A DAY. THE WIRE DOES NOT STRETCH THE BONE. *IT GIVES THE BONE SOMETHING TO CLIMB.*'});
        A.ilse.group.visible = false; PR.feed.visible = false;
        out.push({ img: sh(0.5, 1.95, -0.1, 0, 1.13, -0.74, 28), cap2: 'THERE WERE MORE THAN ELEVEN, AND I HAD TO START AGAIN. *THAT WAS THE FIRST MONTH.*' });
        return Object.assign({ panels: out.map((p, i) => Object.assign(p, { area: a3[i] })) }, THREE_); },
      () => { const out = [];
        hideAll(); const k = lie('k1', LIE, 'hurt'); straps(true); const il = stand('ilse', 0, -1.62, 0, DRAW, 'neutral');
        PR.tube.span(v3(-0.8, 1.84, -0.93), bw(k, 'elL')); PR.thread.span(bw(k, 'neck').add(v3(0, 0.07, 0.03)), bw(il, 'haR'));
        out.push({ img: sh(1.45, 1.55, 0.25, 0.0, 1.32, -0.95, 36), cap: 'THEN THE THROAT.', cap2: 'TWENTY YEARS OF FURNACE AIR COMES OUT OF IT IN BLACK THREAD.' });
        hideAll(); PR.coil.visible = true; PR.thread.span(v3(1.16, 1.04, -0.24), v3(0.95, 1.6, -0.55));
        out.push({ img: sh(0.72, 1.36, 0.22, 1.18, 1.0, -0.26, 30), cap2: 'I HAD NOT KNOWN THAT WAS WHY EVERYBODY ON MY TIER SOUNDED ALIKE. *I HAD THOUGHT IT WAS ONLY HOW PEOPLE SOUND.*' });
        return Object.assign({ panels: out.map((p, i) => Object.assign(p, { area: a2[i] })) }, TWO); },
      () => { const out = [];
        hideAll(); const kp = lie('k1', PALM, 'neutral'); straps(true); stand('ilse', 0.95, -0.2, -HP, BEND, 'neutral'); const hp = bw(kp, 'haR');
        out.push({ img: sh(hp.x - 0.6, hp.y + 0.3, hp.z + 0.62, hp.x + 0.1, hp.y - 0.04, hp.z - 0.08, 26), cap: 'THEN SHE TURNED MY HANDS OVER UNDER THE LAMP.', cap2: '"AN HEIR HAS NO BURNS ON HIS PALMS. HE HAS NEVER HELD ANYTHING HOT."' });
        hideAll(); lie('k1', FISTS, 'angry'); straps(true); stand('ilse', 1.25, 0.1, -HP, BACK, 'neutral');
        out.push({ img: sh(-1.35, 2.05, 1.3, 0.25, 1.22, -0.25, 42), cap: '*NO.* "THEY WILL SEE THEM."', cap2: '"THEN THEY\'LL SEE THEM. THOSE ARE BANK SEVEN. THOSE ARE THE NIGHT I KEPT FORTY BEDS BREATHING. *TAKE THE REST. NOT THOSE.*"' });
        return Object.assign({ panels: out.map((p, i) => Object.assign(p, { area: a2[i] })) }, TWO); },
      () => { const out = [];
        hideAll(); const k = lie('k1', LIE, 'shock'); straps(true); const il = stand('ilse', 0.1, -1.72, 0, DRAW, 'neutral'); stand('u1', -0.92, -0.75, HP, BEND);
        PR.leaf.visible = true; PR.leaf.position.copy(bw(il, 'haR')).add(v3(0, -0.07, 0.05)); PR.leaf.rotation.set(0.6, 0.4, 0);
        out.push({ img: sh(0.72, 1.68, -0.05, 0.0, 1.16, -0.8, 28), cap: 'LAST, THE EYES. IT IS THE ONLY PART DONE AWAKE.', cap2: 'GOLD LEAF, LAID BEHIND THE LENS, SO THE SUN CANNOT BURN WHAT IT WAS NEVER MEANT TO REACH.' });
        hideAll(); lie('k1w', LIE, 'neutral'); W.gildLamp.intensity = 9; PR.cone.visible = false;
        out.push({ img: sh(-1.9, 1.5, 2.3, 0, 1.0, -0.1, 40), cap2: 'THEN A MONTH UNDER WRAPPINGS WITH THE LAMP OUT, GROWING. *I WAS NOT IN THAT ROOM FOR MOST OF IT.*' });
        return Object.assign({ panels: out.map((p, i) => Object.assign(p, { area: a2[i] })) }, TWO); },
      () => { const out = [];
        hideAll(); const k = stand('k2', 0.5, 0.1, HP, SIT, 'neutral', 0.94 - 0.94 * 1.1); const il = stand('ilse', 1.3, 0.25, -HP * 1.1, Object.assign({}, SHOW, { shR: [-1.72, 0, -0.1], elR: [-0.5, 0, 0] }), 'neutral'); PR.gauze.visible = true;
        PR.bare.visible = true; PR.bare.position.copy(bw(il, 'haR')).add(v3(-0.05, 0.02, 0)); PR.bareL.position.copy(PR.bare.position); PR.bareL.intensity = 26; W.gildLamp.intensity = 30;
        out.push({ img: sh(1.7, 1.86, -1.75, 0.82, 1.7, 0.1, 34), cap: 'WHEN THE WRAPPINGS CAME OFF SHE WAS HOLDING A BARE LAMP A HAND FROM MY FACE.', cap2: 'IT DID NOT HURT. NOTHING BRIGHT HAS HURT SINCE. *I HAVE NEVER FORGIVEN HOW EASY THAT WAS TO GIVE US.*' });
        hideAll(); PR.bareL.intensity = 0; PR.gauze.visible = true; stand('k2', 1.15, 1.75, HP * 0.5, UNSURE, 'hurt'); stand('u2', 0.55, 2.05, HP * 0.6, STEADY); stand('ilse', 2.6, 0.9, HP * 0.2, BACK, 'neutral');
        out.push({ img: sh(4.2, 1.15, 4.4, 1.2, 1.15, 1.2, 40), cap: 'NINE MONTHS.', cap2: 'THE FLOOR WAS FURTHER AWAY THAN I HAD LEFT IT. MY OWN BOOTS WERE UNDER THE COT. *THEY WOULD NEVER FIT AGAIN.*' });
        return Object.assign({ panels: out.map((p, i) => Object.assign(p, { area: a2[i] })) }, TWO); }
    ];
    intro = function () {
      SC.state = 'play'; U.showHud(false); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 999; pl.place(4.6, 0, -3.6, 0); pl.model.group.visible = false; cam.lock = null;
      let i = S.gildAt || 0; const next = () => { S.gildAt = i; if (i >= PAGES.length) { hideAll(); S.done = true; if (!SC.host('done', { time: S.time, kills: 0, clues: 0 })) U.toast('NINE MONTHS.', 4); return; } U.page(PAGES[i++](), next); };
      next();
    };
  }
