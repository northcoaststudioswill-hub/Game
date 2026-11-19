'use strict';
/* SECOND CHANCE - story: Issue #1, "Dead on Arrival". Cutscenes, clues, crossings, encounters, objectives. */
(function () {
  const G = SC.gfx, W = SC.world, U = SC.ui, P = SC.pose, pl = SC.player, cam = SC.cam, FX = G.fx;
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const S = SC.story = { goal: null, enc: null, time: 0, cp: 'alley' };
  const SAVE = 'second-chance-save-v1', timers = [];
  let F = SC.flags;
  SC.after = (t, fn) => timers.push({ t, fn });
  function run(steps) { let i = 0; const next = () => { if (i >= steps.length) return; const s = steps[i++]; if (typeof s === 'number') SC.after(s, next); else s(next); }; next(); }

  const CROSS = {
    alley: { x: 0, y: 0, z: 34, yaw: Math.PI },
    yard: { x: 18, y: 0, z: 2.6, yaw: Math.PI },
    roof: { x: -6, y: 8.4, z: -13, yaw: -Math.PI / 2 }
  };
  const ENC = {
    alley: { arena: [-3.05, 8.5, 3.05, 45.5], floor: 0, waves: [[['hollow', -1.3, 21], ['hollow', 1.4, 19.4]]] },
    street: { arena: [-39.4, 6.6, 39.4, 17.4], floor: 0, waves: [[['hollow', -9, 12], ['hollow', 8, 9.5], ['hollow', 11, 14.5]], [['hollow', -12, 11], ['hollow', 13, 12], ['knifer', 0, 8.6]]] },
    yard: { arena: [6.6, -21.4, 31.4, 5.1], floor: 0, waves: [[['bruiser', 19, -10], ['hollow', 13, -6], ['hollow', 25, -8]]] },
    wh: { arena: [-21.2, -18.9, 4.9, 4.9], floor: 0, waves: [[['hollow', -6, -8], ['hollow', -14, -6], ['hollow', -3, -3], ['knifer', -16, -10]], [['bruiser', -8, -7], ['knifer', -15, -3], ['knifer', 0, -11]]] },
    roof: { arena: [-31.4, -45.4, -10.6, -22.6], floor: 9, waves: [[['knifer', -16, -30], ['knifer', -24, -40], ['hollow', -14, -38], ['hollow', -23, -29]]] },
    boss: { arena: [-1.4, -45.4, 31.4, -22.6], floor: 11, waves: [[['boss', 22, -34]]] }
  };
  Object.keys(ENC).forEach(k => { ENC[k].id = k; });

  /* ---------- save ---------- */
  function save() { try { localStorage.setItem(SAVE, JSON.stringify({ v: 1, cp: S.cp, flags: F, path: pl.path, rank: pl.rank, echoes: pl.echoes, time: S.time, stats: pl.stats })); } catch (e) { /* private mode: play on without saving */ } }
  function read() { try { const d = JSON.parse(localStorage.getItem(SAVE)); return d && d.v === 1 ? d : null; } catch (e) { return null; } }
  S.hasSave = () => !!read();
  S.wipe = () => { try { localStorage.removeItem(SAVE); } catch (e) { /* nothing to wipe */ } };

  /* ---------- objectives ---------- */
  function objective() {
    let t = '', g = null;
    if (S.enc) t = S.enc.id === 'boss' ? 'DEACON VOSS. MAKE HIM PAY.' : 'PUT THE HOLLOWS DOWN';
    else if (!F.path) { t = F.clue_casings ? 'STEP INTO THE MARK' : 'LOOK AROUND, THEN STEP INTO THE MARK'; g = CROSS.alley; }
    else if (!F.e_alley) t = 'PUT THE HOLLOWS DOWN';
    else if (!F.e_street) { t = 'FOLLOW THE BLOOD OUT TO FERRY STREET'; g = { x: 0, y: 0, z: 12 }; }
    else if (!F.gate) { t = 'PIER 9 FREIGHT: OPEN THE YARD GATE'; g = { x: 18, y: 0, z: 7 }; }
    else if (!F.e_yard) { t = 'SEARCH THE YARD'; g = { x: 19, y: 0, z: -8 }; }
    else if (!F.breaker) { t = 'THROW THE BREAKER TO RAISE THE SHUTTER'; g = { x: 31.2, y: 0, z: -8 }; }
    else if (!F.e_wh) { t = 'GO INTO WAREHOUSE 9'; g = { x: 3, y: 0, z: -6.5 }; }
    else if (!F.ledger) { t = 'SEARCH THE OFFICE UP THE STAIRS'; g = { x: -27.4, y: 4, z: -8.7 }; }
    else if (!F.hatch) { t = 'TAKE THE BACK STAIRS TO THE ROOF'; g = { x: -13.6, y: 8, z: -18.2 }; }
    else if (!F.e_roof && !F.bossIntro) { t = 'CROSS THE PLANK TO THE NEXT ROOF'; g = { x: -26, y: 9, z: -24 }; }
    else if (!F.boss) { t = 'THE MERIDIAN ROOF. VOSS IS WAITING.'; g = { x: 2, y: 11, z: -34.2 }; }
    U.objective(t); S.goal = g;
  }
  S.objective = objective;
  function setFlag(k) { F[k] = 1; save(); objective(); }

  /* ---------- encounters ---------- */
  function startEnc(id) {
    const e = ENC[id]; S.enc = e; e.wave = -1; e.wait = 0.2; objective();
  }
  function spawnWave(e) {
    e.wave++; e.waves[e.wave].forEach(s => SC.spawnEnemy(s[0], s[1], e.floor, s[2], e));
    if (e.wave > 0) { U.toast('MORE OF THEM.', 1.6); SC.audio.sfx('alert'); }
  }
  function updateEnc(dt) {
    const e = S.enc; if (!e) return;
    if (e.wait > 0) { e.wait -= dt; if (e.wait <= 0) spawnWave(e); return; }
    if (SC.enemies.some(x => x.enc === e)) return;
    if (e.wave < e.waves.length - 1) { e.wait = 0.9; return; }
    S.enc = null; if (e.id !== 'boss') { SC.slowmo(0.3, 0.5); encDone(e.id); }
  }
  function encDone(id) {
    setFlag('e_' + id);
    if (id === 'alley') U.toast('HOLLOWS. EMPTY SUITS WITH SOMEBODY ELSE INSIDE.', 3.5);
    if (id === 'street') { F.key = 1; save(); SC.audio.sfx('clue'); U.toast('THE ONE WITH THE KNIFE HAD A *YARD KEY*. PIER 9 FREIGHT.', 4); }
    if (id === 'yard') U.toast('THE SHUTTER IS DEAD. THERE MUST BE A *BREAKER*.', 3.5);
    if (id === 'wh') U.toast('QUIET. THERE IS AN *OFFICE* UP THE STAIRS.', 3.5);
    if (id === 'roof') U.toast('ONE ROOF LEFT. THE MERIDIAN.', 3);
  }

  /* ---------- clues ---------- */
  function clue(id, lines, after) {
    return function () {
      pl.setState('interact'); pl.control = false; SC.audio.sfx('clue');
      U.say(lines, () => {
        pl.setState('idle'); pl.control = true;
        if (!F['clue_' + id]) { pl.echoes++; setFlag('clue_' + id);
          if (pl.echoes >= 3 && pl.rank < 2) { pl.rank = 2; save(); SC.after(0.4, () => { U.toast('THREE CLUES. THE MARK BITES DEEPER: *' + (pl.path ? SC.PATHS[pl.path].power : 'YOUR POWER') + ' II*', 4); SC.audio.sfx('path'); }); } }
        if (after) after();
      });
    };
  }

  /* ---------- crossings ---------- */
  function crossing(id) {
    return function () {
      const first = !F.path; S.cp = id; pl.hp = SC.T.hp; pl.chance = 1; pl.control = false; SC.audio.sfx('clue');
      U.choosePath(pick => {
        const changed = pl.path !== pick; pl.setPath(pick); F.path = pick; save();
        if (first) bargain(); else { pl.control = true; if (changed) { FX.ring(pl.pos, SC.PATHS[pick].color, 0.5, 3, 0.5); SC.audio.sfx('path'); } U.toast('SAVED. HEALED. SECOND CHANCE RESTORED.', 2.6); objective(); }
      }, pl.path, first ? 'HOW WILL YOU COLLECT?' : 'THE CROSSING: KEEP YOUR PATH OR CHANGE IT');
    };
  }
  function bargain() {
    const p = SC.PATHS[pl.path];
    pl.setState('scripted'); pl.script = () => P.present; pl.scriptRate = 6; pl.faceOverride = 'angry'; U.showHud(false); SC.emit('letterbox', true);
    cam.orbit(v3(pl.pos.x, 1.25, pl.pos.z), 2.9, 0.25, 0.9, pl.yaw + 0.5, 44);
    SC.audio.sfx('path');
    run([0.7, n => { const h = pl.hand(v3()); FX.burst(h, p.color, 2.2); FX.ring(pl.pos, p.color, 0.4, 3.6, 0.7); FX.light(pl.pos, p.color, 120, 1); cam.shake(0.5); SC.emit('flash', p.css); h.y += 1.1; FX.word(p.name + '!', h, p.cssHot, 2); n(); },
      1.5, n => { SC.emit('letterbox', false); pl.faceOverride = null; pl.setState('idle'); pl.control = true; cam.endCine(0.7); U.showHud(true); pl.meter = SC.T.meter;
        U.toast('THE MARK IS YOURS. *' + p.power + '* SITS ON THE POWER BUTTON.', 4); startEnc('alley'); n(); },
      3.2, n => { if (S.enc) U.toast('*ATTACK* THREE TIMES FOR A COMBO. *DODGE* LATE AND TIME SLOWS.', 4.5); n(); }]);
  }

  /* ---------- cutscenes ---------- */
  let clerk;
  function showClerk(x, y, z, yaw) { clerk.group.visible = true; clerk.group.position.set(x, y, z); clerk.group.rotation.y = yaw; clerk.anim.apply(P.clerk(0), 999, 0.016); }
  function hideClerk() { if (clerk.group.visible) { FX.ink(clerk.group.position, 7, 1.4); SC.audio.sfx('shade'); } clerk.group.visible = false; }
  function shot(px, py, pz, lx, ly, lz, fov, w, h) { const c = G.camera; c.position.set(px, py, pz); c.fov = fov; c.updateProjectionMatrix(); c.lookAt(lx, ly, lz); return G.snap(w || 768, h || 432); }

  function intro() {
    SC.state = 'play'; U.showHud(false); pl.control = false; pl.setState('scripted'); pl.script = () => P.down(); pl.scriptRate = 999; pl.faceOverride = 'dead';
    pl.place(0.3, 0, 40.4, Math.PI * 0.86); pl.model.anim.apply(P.down(), 999, 0.016); pl.model.face('dead'); pl.model.group.updateMatrixWorld(true);
    clerk.group.visible = false;
    const a = shot(2.7, 6.4, 33.2, 0.1, 0.2, 40.2, 40, 768, 720);
    showClerk(1.0, 0, 38.2, 0.3);
    const b = shot(0.1, 0.45, 40.9, 1.0, 1.72, 38.2, 36);
    pl.model.face('shock'); const hd = pl.model.head.getWorldPosition(v3());
    const c = shot(hd.x + 0.5, hd.y + 1.0, hd.z - 0.15, hd.x, hd.y, hd.z, 27);
    pl.model.face('dead'); pl.model.expr = null;
    U.page({ cols: '1.25fr 1fr', rows: '1fr 1fr', panels: [
      { img: a, area: '1 / 1 / 3 / 2', cap: '11:47 PM. HALLORAN ALLEY.', cap2: 'THREE SHOTS. I NEVER SAW THE FACE. I DIED HOLDING SOMEBODY ELSE\'S MONEY.', fx: 'BLAM!' },
      { img: b, area: '1 / 2 / 2 / 3', cap2: '"MR. CALLOWAY. YOUR ACCOUNT IS CLOSED... UNLESS YOU WOULD CARE TO *REOPEN* IT."', cap2Cls: 'w' },
      { img: c, area: '2 / 2 / 3 / 3', cap: '11:48.', cap2: 'I GOT A *SECOND CHANCE*. IT CAME WITH TERMS.' }
    ] }, wake);
  }
  function wake() {
    SC.emit('letterbox', true); pl.st = 0; pl.scriptRate = 7; pl.faceOverride = 'hurt';
    const up = [[0, P.down()], [0.9, P.sit()], [1.9, P.kneel()], [2.9, P.idle(0)]];
    pl.script = t => SC.clip(up, t);
    cam.move(v3(-2.3, 0.7, 42.3), v3(0.3, 0.5, 40), v3(-2.6, 1.5, 36.4), v3(0.7, 1.3, 39.1), 3.4, 44);
    run([3.3, n => { pl.faceOverride = 'neutral'; pl.yaw = Math.PI * 0.95; U.say([
        { who: 'clerk', text: 'Up you get, Mr. Calloway. The dead do not usually argue with the ledger. *You did.*' },
        { who: 'hero', face: 'shock', text: 'I was shot. I felt it. Who are you?' },
        { who: 'clerk', text: 'Tally. I keep the books. Somebody in this city is *stealing souls* that belong to my employer.' },
        { who: 'clerk', text: 'You have until dawn to bring me a name. Do that, and you keep what you have borrowed.' },
        { who: 'hero', face: 'angry', text: 'A second chance.' },
        { who: 'clerk', text: 'On terms. Start with whoever killed you. And step into *the mark* when you have decided how you will collect.' }
      ], n); },
      n => { hideClerk(); SC.emit('letterbox', false); pl.faceOverride = null; pl.setState('idle'); pl.control = true; cam.snapBehind(Math.PI); cam.endCine(0.9); U.showHud(true); setFlag('intro');
        U.toast(SC.input.touch ? 'LEFT THUMB MOVES. DRAG THE RIGHT SIDE TO TURN THE CAMERA.' : 'WASD MOVES. DRAG THE MOUSE OR USE THE ARROWS TO TURN THE CAMERA.', 5); n(); }]);
  }
  function bossIntro() {
    const again = F.bossIntro; F.bossIntro = 1; save(); pl.control = false; pl.setState('scripted'); pl.script = t => P.guard(t); pl.scriptRate = 6; U.showHud(false); SC.emit('letterbox', true); cam.lock = null;
    const e = SC.spawnEnemy('boss', 22, 11, -34, ENC.boss); e.state = 'wait'; e.model.group.scale.set(1, 1, 1); e.yaw = -Math.PI / 2; S.bossE = e;
    pl.yaw = Math.PI / 2;
    cam.move(v3(26.5, 12.1, -31.5), v3(22, 12.9, -34), v3(18.6, 11.9, -32.2), v3(22, 12.6, -34), 4.5, 40);
    const lines = again ? [{ who: 'voss', text: 'Back again, Calloway? *Death* does not seem to stick to you.' }, { who: 'hero', face: 'angry', text: 'Neither do you. Let us fix one of those.' }] : [
      { who: 'voss', text: 'Calloway. I put *three* in you myself. I counted.' },
      { who: 'hero', face: 'angry', text: 'Count again.' },
      { who: 'voss', text: 'Mother Mercy pays me by the soul. For yours, I think she will pay *twice*.' },
      { who: 'hero', face: 'smirk', text: 'Then come and collect, Deacon.' }];
    run([0.8, n => U.say(lines, n), n => { SC.emit('letterbox', false); pl.setState('idle'); pl.control = true; cam.endCine(0.8); U.showHud(true); e.state = 'chase'; e.st = 0; e.cool = 1.2;
      S.enc = ENC.boss; ENC.boss.wave = 0; ENC.boss.wait = 0; U.boss(e, 'DEACON VOSS'); objective(); n(); }]);
  }
  function ending(e) {
    S.enc = null; setFlag('boss'); U.boss(null); pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 5; U.showHud(false); SC.emit('letterbox', true); SC.clearEnemies();
    const f = v3(Math.sin(pl.yaw), 0, Math.cos(pl.yaw)), r = v3(-f.z, 0, f.x);
    showClerk(pl.pos.x + f.x * 2.6 + r.x * 0.6, pl.pos.y, pl.pos.z + f.z * 2.6 + r.z * 0.6, pl.yaw + Math.PI); FX.ink(clerk.group.position, 6, 1.3);
    const c0 = v3(pl.pos.x - f.x * 2.2 + r.x * 2.4, pl.pos.y + 1.5, pl.pos.z - f.z * 2.2 + r.z * 2.4), l0 = v3(pl.pos.x + f.x * 1.3, pl.pos.y + 1.4, pl.pos.z + f.z * 1.3);
    cam.move(c0, l0, c0.clone().addScaledVector(r, 1.2).setY(c0.y + 0.4), l0, 9, 42);
    run([0.6, n => U.say([
        { who: 'cap', text: 'He came apart like wet newspaper. What was left of him said one thing.' },
        { who: 'voss', text: 'She has... the whole city on her books. You are a *rounding error*.' },
        { who: 'clerk', text: 'A name, Mr. Calloway. As agreed.' },
        { who: 'hero', face: 'angry', text: '*Mother Mercy.*' },
        { who: 'clerk', text: 'Then the ledger stays open. You have until dawn. Do try not to die a second time.' },
        { who: 'cap', text: 'It was 1:15 AM. Dawn was a long way off, and I had a debt to collect.' }
      ], n),
      n => { hideClerk(); n(); }, 0.8,
      n => { S.done = true;
        U.end({ time: S.time, path: SC.PATHS[pl.path].name, kills: pl.stats.kills, finishers: pl.stats.finishers, perfect: pl.stats.perfect, chances: pl.stats.chances, clues: pl.echoes }, () => { SC.emit('letterbox', false); cam.mode = 'follow'; S.newGame(); }); n(); }]);
  }

  /* ---------- set up interactables and markers ---------- */
  S.init = function () {
    clerk = S.clerk = SC.makeHumanoid('clerk'); G.scene.add(clerk.group); clerk.group.visible = false;
    W.dyn.push(t => { if (clerk.group.visible) clerk.anim.apply(P.clerk(t), 6, 0.016); });
    pl.model.setGlow(0xf6f2e6, '#f6f2e6');
    // crossings: a turning mark on the ground
    Object.keys(CROSS).forEach(id => {
      const c = CROSS[id], mk = (tex, s, col, op) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op, depthWrite: false, fog: false })); m.rotation.x = -Math.PI / 2; m.position.set(c.x, c.y + 0.05, c.z); m.renderOrder = 3; G.scene.add(m); return m; };
      const a = mk(G.tex.ring, 3.4, 0xffe14a, 0.9), b = mk(G.tex.disc, 2.3, 0xffe14a, 0.35);
      W.dyn.push(t => { a.rotation.z = t * 0.5; const col = pl.path ? SC.PATHS[pl.path].color : 0xffe14a; a.material.color.set(col); b.material.color.set(col); b.material.opacity = 0.25 + Math.sin(t * 3) * 0.12; });
      W.addInteract({ id: 'x_' + id, x: c.x, y: c.y, z: c.z, r: 1.9, label: 'THE MARK', act: crossing(id), when: () => F.intro });
    });
    W.addInteract({ id: 'casings', x: 1.5, y: 0, z: 38.8, r: 1.9, label: 'LOOK', marker: 'clue', mh: 1.1, when: () => F.intro && !F.clue_casings, act: clue('casings', [
      { who: 'cap', text: 'Three brass casings in the wet. Thirty-eights. And a pool of blood shaped a lot like me.' },
      { who: 'hero', face: 'hurt', text: 'Close range. Somebody stood right here and *took their time*.' }]) });
    W.addInteract({ id: 'bike', x: 9.2, y: 0, z: 13.7, fx: 9.3, fz: 15, r: 2.2, label: 'LOOK', marker: 'clue', mh: 1.4, when: () => F.e_alley && !F.clue_bike, act: clue('bike', [
      { who: 'cap', text: 'My bike. My satchel, slit open and empty. The Parish payroll is gone.' },
      { who: 'hero', text: 'There is a freight tag in the spokes. *PIER 9.* They did not even bother to hide it.' }]) });
    W.addInteract({ id: 'masks', x: 21, y: 0, z: -16.3, fx: 21, fz: -18.4, r: 2.2, label: 'LOOK', marker: 'clue', mh: 1.6, when: () => F.e_yard && !F.clue_masks, act: clue('masks', [
      { who: 'cap', text: 'The container is full of crates. The crates are full of white masks, packed in straw like eggs.' },
      { who: 'hero', face: 'shock', text: 'They are not hiring muscle. They are *hollowing people out* and wearing what is left.' }]) });
    W.addInteract({ id: 'ledger', x: -27.2, y: 4, z: -8.7, fx: -29, fz: -8.7, r: 2.1, label: 'SEARCH', marker: 'clue', mh: 1.8, when: () => F.e_wh && !F.ledger, act: clue('ledger', [
      { who: 'cap', text: 'A ledger under the desk lamp. Columns of names, each one ruled out in red.' },
      { who: 'hero', face: 'angry', text: 'D. CALLOWAY. Last line. Signed off by *Deacon Voss*, "collected, 11:47".' },
      { who: 'cap', text: 'Clipped to the page: a key marked ROOF, and a note. "Bring the book to the Meridian."' }], () => { setFlag('ledger'); U.toast('*ROOF KEY* TAKEN. THE BACK STAIRS GO UP.', 3.5); }) });
    W.addInteract({ id: 'loft', x: -27.8, y: 9, z: -26.7, fx: -29.7, fz: -26.7, r: 2.1, label: 'LOOK', marker: 'clue', mh: 1.8, when: () => !F.clue_loft, act: clue('loft', [
      { who: 'cap', text: 'A pigeon loft with no pigeons. Somebody has been using it as a letterbox.' },
      { who: 'hero', text: '"Mercy wants forty by Sunday." Forty what? ...Forty *of us*.' }]) });
    W.addInteract({ id: 'gate', x: 18, y: 0, z: 7.1, fx: 18, fz: 5.8, r: 2.2, label: 'OPEN GATE', marker: 'act', mh: 2.6, when: () => F.e_alley && !F.gate, act: () => {
      if (!F.key) { U.toast('LOCKED. SOMEBODY ON THIS STREET HAS THE KEY.', 2.6); SC.audio.sfx('deny'); return; }
      W.openDoor('gate'); SC.audio.sfx('door'); setFlag('gate'); U.toast('THE GATE ROLLS BACK.', 2); } });
    W.addInteract({ id: 'breaker', x: 31.1, y: 0, z: -8, fx: 32, fz: -8, r: 2, label: 'BREAKER', marker: 'act', mh: 2.6, when: () => F.e_yard && !F.breaker, act: () => {
      setFlag('breaker'); W.openDoor('shutter'); SC.audio.sfx('door'); pl.control = false; U.showHud(false); SC.emit('letterbox', true);
      cam.move(v3(13.5, 2.2, -3.2), v3(5.7, 1.6, -6.5), v3(11.5, 1.7, -4.4), v3(5.7, 2.6, -6.5), 2.2, 44);
      run([2.3, n => { SC.emit('letterbox', false); cam.endCine(0.6); U.showHud(true); pl.control = true; n(); }]); } });
    W.addInteract({ id: 'hatch', x: -13.5, y: 8.1, z: -18.2, fx: -12.5, fz: -18.2, r: 1.8, label: 'ROOF DOOR', marker: 'act', mh: 2.2, when: () => F.e_wh && !F.hatch, act: () => {
      if (!F.ledger) { U.toast('LOCKED. THE KEY WILL BE IN THAT *OFFICE*.', 2.6); SC.audio.sfx('deny'); return; }
      W.openDoor('hatch'); SC.audio.sfx('door'); setFlag('hatch'); } });
    SC.on('dazed', e => { if (!F.tutFinish) { F.tutFinish = 1; U.toast('WIDE OPEN. GET CLOSE AND HIT *INTERACT* TO FINISH IT.', 4); } });
    SC.on('secondchance', () => SC.after(1.4, () => U.toast('*SECOND CHANCE* SPENT. A CROSSING GIVES IT BACK.', 3.5)));
    SC.on('dead', () => SC.after(1.7, () => U.dead(S.load)));
    SC.on('kill', e => { if (e.kind === 'boss') S.bossDown = true; });
    SC.on('finisherEnd', e => { if (e.kind === 'boss') ending(e); });
    SC.on('bossPhase', e => { SC.spawnEnemy('hollow', e.pos.x + 3, 11, e.pos.z + 3, ENC.boss); SC.spawnEnemy('hollow', e.pos.x - 3, 11, e.pos.z - 3, ENC.boss); U.toast('"UP! ALL OF YOU! HE IS ONE DEAD MAN!"', 2.6); });
  };

  /* ---------- flow ---------- */
  S.title = function () {
    SC.state = 'title'; U.showHud(false); SC.clearEnemies(); clerk.group.visible = false;
    pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 6; pl.place(0.6, 0, 12.5, -0.55);
    cam.move(v3(-3.4, 0.7, 17), v3(-1.9, 1.45, 12.5), v3(-2.2, 1.0, 17.6), v3(-1.7, 1.5, 12.5), 40, 46);
    U.title(S.hasSave(), S.newGame, S.load);
  };
  S.newGame = function () {
    S.wipe(); W.reset(); SC.clearEnemies(); timers.length = 0; S.done = false; S.bossDown = false; U.boss(null); cam.lock = null;
    Object.keys(pl.stats).forEach(k => { pl.stats[k] = 0; });
    F = SC.flags = {}; S.cp = 'alley'; S.time = 0; S.enc = null; pl.path = null; pl.rank = 1; pl.echoes = 0; pl.hp = SC.T.hp; pl.meter = 0; pl.chance = 1;
    pl.model.setGlow(0xf6f2e6, '#f6f2e6'); intro();
  };
  S.load = function () {
    const d = read(); if (!d) { S.newGame(); return; }
    SC.state = 'play'; F = SC.flags = d.flags || {}; S.cp = d.cp || 'alley'; S.time = d.time || 0; S.enc = null; timers.length = 0;
    SC.clearEnemies(); U.boss(null); cam.lock = null; S.bossDown = false; SC.time.hitstop = 0; SC.time.slowT = 0;
    if (d.stats) Object.assign(pl.stats, d.stats);
    pl.rank = d.rank || 1; pl.echoes = d.echoes || 0; pl.hp = SC.T.hp; pl.chance = 1; pl.meter = d.path ? 68 : 0; pl.inv = 0; pl.lift = 0; pl.revived = false; pl.faceOverride = null;
    if (d.path) pl.setPath(d.path); else { pl.path = null; pl.model.setGlow(0xf6f2e6, '#f6f2e6'); }
    ['gate', 'hatch'].forEach(k => { if (F[k]) W.openDoor(k, true); }); if (F.breaker) W.openDoor('shutter', true);
    if (!F.intro) { intro(); return; }
    const c = CROSS[S.cp]; pl.place(c.x, c.y, c.z + 0.01, c.yaw); pl.setState('idle'); pl.control = true; pl.model.group.visible = true;
    cam.mode = 'follow'; cam.snapBehind(c.yaw); SC.emit('letterbox', false); U.showHud(true); objective();
    if (F.path && !F.e_alley) SC.after(0.8, () => startEnc('alley'));
  };

  S.update = function (dt, rdt) {
    for (let i = timers.length - 1; i >= 0; i--) { timers[i].t -= rdt; if (timers[i].t <= 0) { const f = timers[i].fn; timers.splice(i, 1); f(); } }
    if (SC.state !== 'play') return;
    if (pl.control) S.time += rdt;
    updateEnc(dt);
    if (!pl.control || S.enc || pl.state === 'dead') return;
    const x = pl.pos.x, y = pl.pos.y, z = pl.pos.z;
    if (F.e_alley && !F.e_street && z < 15.6 && y < 1) startEnc('street');
    else if (F.gate && !F.e_yard && x > 8 && x < 30.5 && z < 2.6 && z > -19 && y < 1) startEnc('yard');
    else if (F.breaker && !F.e_wh && W.inside(x, z) && x < 2.5 && y < 2) startEnc('wh');
    else if (F.hatch && !F.e_roof && !F.bossIntro && y > 8.7 && y < 10 && z < -23.6 && x < -11.5 && x > -31) startEnc('roof');
    else if (!F.boss && !S.bossDown && y > 10.6 && x > 0.4 && x < 31 && z < -23 && z > -45) bossIntro();
  };
})();
