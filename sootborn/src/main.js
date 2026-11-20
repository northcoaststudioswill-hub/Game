// ============================================================
// main — game flow + fixed-timestep loop
// ============================================================
const HEIST_LANE_MID = [[18, 6, 1, 0.9], [18, 6, 0, 0.9], [7, 6, 1, 0.9], [7, 6, 0, 0.9]], HEIST_LANE_N = [[16, 3, 0, 1.1], [5, 3, 0, 1.1]];
const Game = {
  toTitle() { World.gilded = 0; World.gildP2 = 0; if (DEV._tq !== undefined) { DEV.quick = DEV._tq; DEV._tq = undefined; }
    G.mode = 'title'; Dialogue.active = false; $('#dlg').classList.add('hidden'); if (Puzzle.active) Puzzle.close();
    if (!P.sheet) World.resetSheets(); World.showPlayer = false; G.flags = G.flags || {};
    World.load('square', { x: 13 * 16 + 8, y: 8 * 16, dir: 0 }); Sound.music('home');
    Menus.title(); $('#devback').classList.add('hidden');
    if (DEV.from) Menus.checkpoints(DEV.from);   /* a scene started from the Dev menu comes back to the Dev menu, at the list it was picked from */
  },
  // stop whatever is playing, wherever it is, without running what would have come next (the Dev menu's way back)
  abort() {
    try { if (Prelude.on) { Prelude.done = null; Prelude.finish(); } } catch (e) { /* not running */ }
    try { if (Issue.on) { Issue.done = null; Issue.closing = false; Issue.finish(false); } } catch (e) { /* not running */ }
    Cutscene.onEnd = null; Cutscene.steps = []; Cutscene.noSkip = false; if (Cutscene.active) Cutscene.end();
    if (Brawl.active) { Brawl.active = false; Brawl.onEnd = null; Brawl.cine = null; Brawl.sup = null; Sound.rage = 0; }
    Dialogue.stack = []; Dialogue.onEnd = null; if (Dialogue.active) { Dialogue.active = false; $('#dlg').classList.add('hidden'); }
    try { if (Puzzle.active) Puzzle.close(); } catch (e) { /* none open */ }
    try { Mission.done = null; G.heist = 0; World.seq = null; World.bolt = null; World.darkOverride = null; World.alert = 0; World.work = 0; World.gilded = 0; } catch (e) { /* no mission */ }
    Fade.a = 0; Fade.dir = 0; Fade.busy = false; Fade.cb = null; UI.clear(); $('#cskip').classList.add('hidden'); try { Cutscene.hideCard(); } catch (e) { /* none */ }
    if (DEV._tq !== undefined) { DEV.quick = DEV._tq; DEV._tq = undefined; } World.resetSheets(); Input.consume(); HUD.dirty = true;
  },
  devBack() { if (!DEV.from) return; Game.abort(); Game.toTitle(); },
  newGame() {
    freshState('Kael', 0); World.resetSheets(); World.showPlayer = true;
    const go = () => Cutscene.play(PROLOGUE_A, () => Game.startHeist());
    if (NOFF) go(); else Prelude.run(go);
  },
  startHeist() {
    G.heist = 1; World.load('bay', { x: 24, y: 7 * 16 + 4, dir: 3 }, true); World.darkOverride = 'rgba(3,2,9,.8)';
    G.mode = 'world'; Game.resetHeist(); Sound.music('mystery');
    Fade.a = 1; Fade.dir = -1; Fade.sp = 1; Fade.busy = true;
    setTimeout(() => HUD.toast('Hold A at the relay · B throws a bolt'), 900);
  },
  resetHeist() {
    if (G.heist === 3) return Mission.reset();
    if (G.heist === 2) return Game.resetFest();
    // Three lamps whose lanes interlock: no corridor is ever unwatched for long.
    //  - the Night Proctor walks the middle of the bay end to end, and looks up and down at each end
    //    (after the relay is cut he moves to the north lane, right past Bank Seven)
    //  - a second Proctor walks the centre column, and looks left and right at each end
    //  - the Watchman stands by the relay and turns all the way round
    const g = (id, x, y, dir, wander) => ({ id, patrol: 1, x: x * 16 + 8, y: y * 16 + 12, dir, home: dir, wander, wi: 0, wait: 1.6, anim: 0, moving: false, face: 0, barkCd: 99 });
    World.npcs = [
      { id: 'seren', x: 1 * 16 + 8, y: 8 * 16 + 12, dir: 1, home: 1, anim: 0, moving: false, face: 0, barkCd: 99 },
      g('proctor', 7, 6, 0, G.flags.relayCut ? HEIST_LANE_N : HEIST_LANE_MID),
      g('watchman', 12, 10, 2, [[12, 10, 2, 0.9], [12, 10, 3, 0.9], [12, 3, 3, 0.9], [12, 3, 2, 0.9]]),
      g('watchman', 19, 9, 2, [[19, 9, 2, 1.7], [19, 9, 1, 1.3], [19, 9, 3, 1.7], [19, 9, 0, 1.3]])
    ];
    if (G.flags.relayCut) { const p = World.npcs[1]; p.x = 5 * 16 + 8; p.y = 3 * 16 + 12; }
    World.grace = 2.6;
    if ((G.flags.caught | 0) >= 3) { // Seren keeps her promise: she knocks something over, far from where you are going
      const at = G.flags.relayCut ? { x: 3 * 16 + 8, y: 12 * 16 } : { x: 12 * 16 + 8, y: 12 * 16 + 8 };
      setTimeout(() => { if (G.heist !== 1) return; Sound.play('rumble'); Sound.play('clink'); HUD.toast('Seren knocks something over. Every lamp turns.'); for (const n of World.npcs) if (n.patrol) { n.inv = { x: at.x, y: at.y }; n.invT = 0; n.invGive = 0; n.bark = { t: '?!', life: 1.4 }; } }, 1500);
    }
    World.caughtT = 0; World.alert = 0; World.alertPeak = 0; World.work = 0; World.seenBy = null;
  },
  onHeistDone() {
    G.heist = 0; G.flags.relayCut = 0; World.darkOverride = null; World.bolt = null; World.ripple = null; World.dynLights = []; World.npcs = [];
    Codex.add('c_valve', true);
    Cutscene.play(PROLOGUE_B, () => Game.startPresent());
  },
  startPresent() {
    if (!G.tendency) G.tendency = 'caretaker';
    World.gilded = 0; World.gildP2 = 0;
    Codex.add('c_valve', true); Codex.add('c_eleven', true);
    World.load('apt', { x: 3 * 16 + 8, y: 3 * 16 + 12, dir: 2 }); G.mode = 'world';
    Fade.a = 1; Fade.dir = -1; Fade.sp = 0.8; Fade.busy = true; Sound.play('bell'); Sound.music('home');
    addJ('p_seren', true); addJ('p_celestine', true); G.newJ = 0; Game.autosave();
    setTimeout(() => HUD.toast('Ashgate, Tier 6 — 41 days after the furnace'), 900);
  },
  loadSave(s) {
    if (!s) return Game.toTitle();
    G.look = s.look | 0; World.resetSheets(); World.showPlayer = true; Save.apply(s); World.resetSheets();
    G.mode = 'world'; Fade.a = 1; Fade.dir = -1; Fade.sp = 2; Fade.busy = true; HUD.toast(`${MAPS[G.mapId].name} — ${whenS(G.day)}`);
  },
  autosave() { if (G.mode !== 'world' || G.heist) return; Codex.sync(); Save.write('auto'); },
  onPuzzleDone() {
    setF('puzzleDone'); addJ('e_aux9'); Sound.play('clue'); World.refreshNPCs(); Game.autosave();
    Dialogue.start([narr('The bank shudders, then settles. Every gauge swings into the green.'),
      narr("Including one labeled AUX-9 — an outlet that isn't on your work order. Or on any schematic you've ever seen."),
      narr('Behind you, Conveyor Two has gone quiet.'),
      narr("And there, two couplings down: the clinic branch. The same branch. You could bleed AUX-9 into the ward again. One more night of real air for forty kids."),
      narr('Vale is pacing the far end of the bay. He will be back at this bank in under half a minute.'),
      { choice: [
        { t: 'Do it. Right under his nose.', then: [fx(() => Puzzle.open([BLEED2], () => Game.onBleedAgain()))] },
        { t: 'Not today. Not with Vale watching.', fx: () => setF('heldBack'), then: [say('kael', "(Not today. But I know where you are now.)")] }
      ] }], () => World.afterBeat());
  },
  onBleedAgain() {
    setF('bledAgain'); fury(1); Sound.play('solved'); Game.autosave();
    Dialogue.start([narr('You seat the last coupling and step back just as Vale rounds the furnace.'), say('vale', '...Done, Brennick?'), say('kael', 'Bank Seven, balanced, Inspector. Boring as a bread line.'), say('vale', 'Hm.'), narr('He looks at the gauges for a long, long moment. Then he writes something down and walks away.'), narr('Somewhere across the square, a ward fan starts to spin like a storm.')], () => World.afterBeat());
  },
  dayEnd() { Dialogue.end(); Fade.go(() => DayEnd.run(), 1.5); },
  // ---- Day 2
  onFuseDone() {
    setF('fuseDone'); addJ('e_l0'); addJ('pl_fuse', true); Sound.play('clue'); World.refreshNPCs(); Game.autosave();
    const b = F('bledAgain'), nc = F('nearlyCaught');
    Dialogue.start([
      narr('Both buses settle. The panel stops ticking.'),
      narr('TIER 6 LIGHTS: 15. And the other bus, the one the work order only ever calls STANDBY — there is a brass plate under forty years of grime. You wipe it with your thumb.'),
      narr('L0 STBY.'),
      say('you', 'Lift Zero. Standby.'),
      say('you', "Every First Fire the lamps go dim, and we call it ceremony. It's the lift. Charging. On our lights."),
      narr('One breaker left over. The spare. Two little amps, doing nothing.'),
      { choice: [
        { t: 'Throw the spare onto Tier 6. Let her festival be bright.', fx: () => { setF('spareOn'); Sound.play('rotate'); }, then: [narr('Clack. Somewhere above you, the square gets one shade closer to day.')] },
        { t: 'Leave it. By the order. Today, be boring.', fx: () => setF('spareOff'), then: [narr('You take your hand off it. It is harder than it should be.')] }
      ] },
      narr('The door opens behind you. You know the footsteps. He walks like a man who is paid by the stride.'),
      say('vale', 'Brennick. Alone with the fuses. How restful.'),
      ...(b ? [
        narr('He opens his notebook. He turns it around so you can read it. Nobody has ever seen inside Vale\'s notebook.'),
        narr('"BANK 7. CLINIC BRANCH +3% FOR 61 MIN. OPERATOR: K.B." And through all of it, one clean stroke of the pen.'),
        say('vale', 'I wrote it down. I write everything down. Then I struck it. I have never struck anything.'),
        { choice: [
          { t: 'Why?', fx: () => setF('valeWhy'), then: [say('vale', 'Tier 8. Thirty years ago. A fever ward with twelve cots, and my sister in the ninth.'), say('vale', 'Nobody bled a line for her. I have often wondered what kind of man would have.'), say('vale', 'Now I know. He is insolent, and he is going to get people killed.')] },
          { t: 'What do you want for it?', fx: () => setF('valeDebt'), then: [say('vale', 'Want. Spoken like a man who expects a price. Good. You are learning how up there works.'), say('vale', 'One day I will ask you for a silence. You will give it. That is the price.')] },
          { t: "Strike it or don't. I'd do it again tonight.", fx: () => { setF('valeDefied'); fury(1); }, then: [say('vale', "Yes. She said that too. Those exact words, to an Accredited's face."), say('vale', 'You people keep saying it as though it were a defense.')] }
        ] }
      ] : nc ? [
        say('vale', "Yesterday you had your hands in the clinic coupling. Don't. I can smell a lie the way you can smell a leak."),
        say('vale', 'I wrote: "Operator inspecting branch seal." It is a generous sentence. I do not have many.')
      ] : [
        say('vale', 'A clean shift yesterday. Bank balanced. Mouth mostly shut. I wrote: "Compliant." Do you know how rarely I get to use that word?'),
        say('you', 'Frame it.')
      ]),
      ...(F('threatenedProctor') ? [say('vale', 'Proctor Sull has filed on you. I have delayed the filing. Paper moves slowly when I sit on it. I will not sit on it twice.')] : []),
      ...(F('spareOn') ? [say('vale', 'And the spare breaker is warm.'), narr('He looks at it. He looks at you. He does not write.'), say('vale', 'A faulty panel. Forty years old. I shall note the age of the panel.')] : []),
      say('vale', 'The High Auditor is coming down for First Fire. She lights it herself, some years. She asked whether "the loud one" still works Bank Seven.'),
      say('you', 'What did you tell her?'),
      say('vale', 'That you were quiet now.'),
      say('vale', 'Make me honest, Brennick. For one night. Carry your little lantern. Stand in your row. Go home.'),
      { choice: [
        { t: "I'll be a model of gratitude.", then: [say('vale', 'You will be a model of something.')] },
        { t: '(Say nothing.)', then: [say('vale', 'Better.')] },
        { t: 'Ask her why the lift runs on our lights.', fx: () => { setF('valeAsked'); fury(1); }, then: [say('vale', '...You read the plate.'), say('vale', 'Then you already know more than is safe, and I already know less than I would like.')] }
      ] },
      narr('At the door he stops, without turning.'),
      say('vale', 'Morrow went looking under the floor. Do not go looking under the floor.'),
      fx(() => { setF('vale2Done'); Sound.play('door'); Game.autosave(); })
    ], () => World.afterBeat());
  },
  startFestival() {
    Game.autosave(); Dialogue.end();
    Fade.go(() => Cutscene.play(festA(), () => Game.startFestStealth()), 1.5, true);
  },
  startFestStealth() {
    G.heist = 2; G.flags.caught2 = 0; G.flags.heistEase = F('sullTip') || F('beatSull') ? 1 : 0;
    World.load('fest', { x: 7 * 16 + 8, y: 13 * 16 + 4, dir: 1 }, true); G.mode = 'world'; Game.resetHeist(); Sound.music('mystery');
    Fade.a = 1; Fade.dir = -1; Fade.sp = 1; Fade.busy = true;
    setTimeout(() => HUD.toast('The Pillar. Top hook. Move when they look away.'), 900);
  },
  resetFest() {
    const slow = F('sullTip') || F('beatSull') ? 2.6 : 1.5;
    const g = (id, x, y, dir, wander) => ({ id, patrol: 1, x: x * 16 + 8, y: y * 16 + 12, dir, home: dir, wander, wi: 0, wait: 1.2, anim: 0, moving: false, face: 0, barkCd: 99 });
    const s = (id, x, y, dir) => ({ id, x: x * 16 + 8, y: y * 16 + 12, dir, home: dir, anim: 0, moving: false, face: 0, barkCd: 99 });
    World.npcs = [
      g('proctor', 9, 6, 3, [[17, 6, 0, 1.4], [17, 11, 2, slow], [9, 11, 1, slow], [9, 6, 3, 1.4]]),
      g('watchman', 13, 12, 2, [[13, 12, 2, 2], [13, 12, 1, 1.6], [13, 12, 3, 2], [13, 12, 1, 1.6]]),
      g('watchman', 13, 5, 0, [[13, 5, 2, 2.1], [13, 5, 0, 1.5], [13, 5, 3, 2.1], [13, 5, 0, 1.5]]),
      s('tavi', 6, 13, 3), s('ivo', 8, 14, 1), s('mara', 3, 6, 3), s('hollis', 2, 8, 3), s('marrow', 3, 10, 3), s('pell', 2, 12, 3), s('bao', 5, 11, 3), s('juno', 10, 14, 1), s('orin', 12, 14, 1), s('nell', 17, 14, 1), s('fen', 20, 14, 1), s('kit', 24, 10, 2)
    ];
    if (F('sullWar') && !F('beatSull')) World.npcs.push(g('watchman', 20, 8, 2, [[20, 8, 2, 2], [20, 8, 1, 1.5], [20, 8, 2, 2], [20, 8, 0, 1.5]]));
    World.caughtT = 0; World.alert = 0; World.alertPeak = 0; World.work = 0; World.seenBy = null; World.grace = 2.2;
    if ((G.flags.caught2 | 0) >= 2) { // Ivo gets clumsy with his cart: every lamp turns east
      setTimeout(() => { if (G.heist !== 2) return; Sound.play('rumble'); Sound.play('clink'); for (const n of World.npcs) if (n.patrol) { n.inv = { x: 23 * 16 + 8, y: 13 * 16 }; n.invT = 0; n.invGive = 0; n.bark = { t: '?!', life: 1.4 }; } const iv = World.npcs.find(n => n.id === 'ivo'); if (iv) iv.bark = { t: 'OH NO. MY CART.', life: 2.4 }; }, 1400);
    }
  },
  onFestDone() {
    G.heist = 0; World.bolt = null; World.ripple = null; World.dynLights = []; World.npcs = []; setF('hungLantern'); Sound.play('ok');
    Cutscene.play(festB(), () => DayEnd.run(2));
  }
};
World.showPlayer = true;

// patch render to respect showPlayer (title screen pans an empty square)
const _wr = World.render.bind(World);
World.render = function (g, t) {
  if (this.showPlayer) return _wr(g, t);
  const keep = P.sheet; P.sheet = BLANK; const r = _wr(g, t); P.sheet = keep; return r;
};
const [BLANK] = mk(48, 64);

const canvas = $('#game'), ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false;
canvas.addEventListener('pointerdown', e => {
  const r = canvas.getBoundingClientRect(), lx = (e.clientX - r.left) / r.width * W, ly = (e.clientY - r.top) / r.height * H;
  if (UI.stack.length) return;
  if (Puzzle.active) { Puzzle.tap(lx, ly); return; }
  if (Dialogue.active && !Dialogue.choices) Dialogue.advance();
  else if (Cutscene.active) Cutscene.tapped = true;
});
$('#card').addEventListener('pointerdown', () => { Cutscene.tapped = true; });
window.addEventListener('pointerdown', () => { if (Brawl.active && Brawl.cine) Brawl.tap = true; }); window.addEventListener('keydown', e => { if (Brawl.active && Brawl.cine && Brawl.def.cineOnly && !e.repeat) Brawl.tap = true; });
$('#devback').addEventListener('click', e => { e.stopPropagation(); Game.devBack(); }); window.addEventListener('keydown', e => { if (e.code === 'F2' && DEV.from && G.mode !== 'title') { e.preventDefault(); Game.devBack(); } });
$('#cskip').addEventListener('click', e => { e.stopPropagation(); if (Prelude.on) Prelude.finish(); else Cutscene.skip(); });

const ZC = { c: null, g: null };
const BLEED2 = { name: 'BANK 7 · BLEED AGAIN', timer: 28, tip: "Feed AUX-9 into the clinic branch before Vale walks back. Don't get caught with your hands in it.", cols: 4, rows: 3, cells: [
  ['SRC:E:AUX9', 'EW', 'SW', ''],
  ['', 'ES', 'NSW', ''],
  ['', 'NE', 'NEW', 'OUT:W:CLINIC']],
  onFail: () => { setF('nearlyCaught'); Sound.play('alarm'); World.fxFlash('#ff3020', 0.3); Dialogue.start([narr("Boots on the grating. You snap the coupling back a half-second before Vale's shadow falls across the bank."), say('vale', 'Admiring your work, Brennick?'), say('kael', "Somebody should. You won't."), say('vale', '...Hm.'), narr('He writes something down. Your hands do not stop shaking until the next bell.')], () => World.afterBeat()); } };
let booted = false;
function boot() {
  Store.init(); Settings.load(); Input.init(); Settings.apply(); Layout.update();
  addEventListener('resize', () => Layout.update()); addEventListener('orientationchange', () => setTimeout(() => Layout.update(), 200));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (G.mode === 'world' && !UI.stack.length && !Dialogue.active && !Brawl.active) { if (Puzzle.active) Puzzle.close(); Menus.pause(); } Sound.suspend(); }
    else Sound.resume();
  });
  // press-to-start (also unlocks audio as a user gesture)
  const el = document.createElement('div'); el.className = 'splash'; el.style.background = '#07090d';
  el.innerHTML = '<div class="press">▶ Tap or press any key</div>'; $('#layer').appendChild(el);
  const go = () => { if (booted) return; booted = true; Sound.unlock(); el.remove(); Input.consume(); window.removeEventListener('keydown', go); G.mode = 'splash'; Splash.run(() => { if (!P.sheet) World.resetSheets(); Game.toTitle(); }); };
  el.addEventListener('pointerdown', go); window.addEventListener('keydown', go);
  Boot.go = go;
  requestAnimationFrame(frame);
}
const Boot = { go: null };

let last = 0, acc = 0;
function frame(ts) {
  requestAnimationFrame(frame); if (Issue.on) { last = ts; Input.update(1 / 60); Issue.tick(); return; }
  if (Prelude.on) { const d = Math.min(0.1, last ? (ts - last) / 1000 : STEP); last = ts; Input.update(d); Prelude.tick(d); Sound.tick(); return; }
  Perf.tick(ts);
  const dt = Math.min(0.1, last ? (ts - last) / 1000 : STEP); last = ts; acc += dt; Debug.frame(dt);
  let n = 0; while (acc >= STEP && n < 6) { step(STEP); acc -= STEP; n++; } if (n === 6) acc = 0;
  render(); Sound.tick();
}
function step(dt) {
  Input.update(dt); G.time += dt;
  if (G.mode === 'boot') { if (Input.p('A') || Input.p('START')) Boot.go && Boot.go(); }
  else if (G.mode === 'splash') { if (Input.p('A') || Input.p('B')) Splash.padSkip && Splash.padSkip(); }
  else if (UI.stack.length) UI.top().update(dt);
  else if (Fade.busy && Fade.dir > 0) { }
  else if (Dialogue.active) { Dialogue.update(dt); if (Cutscene.active) Cutscene.anim(dt); }
  else if (Puzzle.active) Puzzle.update(dt);
  else if (Brawl.active) Brawl.update(dt);
  else if (G.mode === 'world') { G.play += dt; World.update(dt); }
  else if (G.mode === 'intro') Intro.update(dt);
  else if (Cutscene.active) Cutscene.update(dt);
  if (G.mode === 'world' && !UI.stack.length && !Puzzle.active) World.updateNPCs(Dialogue.active ? 0 : 0);
  if (G.mode === 'title') { P.x = 13 * 16 + 8 + Math.sin(G.time * 0.08) * 110; P.y = 8 * 16 + Math.sin(G.time * 0.05) * 20; World.updateNPCs(dt); }
  Fade.update(dt); HUD.update(dt);
}
function render() { G3.used = false; render0(); G3.sync(); }
function render0() {
  const g = ctx;
  if (Brawl.active && !Puzzle.active && G.mode !== 'boot' && G.mode !== 'splash') { Brawl.render(g); if (Fade.a > 0) { g.fillStyle = `rgba(7,5,10,${Fade.a})`; g.fillRect(0, 0, W, H); } return; }
  if (G.mode === 'boot' || G.mode === 'splash' || !World.map || (Cutscene.active && !$('#card').classList.contains('hidden') && Fade.a >= 1)) { g.fillStyle = '#07090d'; g.fillRect(0, 0, W, H); return; }
  if (Brawl.active && !Puzzle.active) Brawl.render(g);
  else if (Puzzle.active) Puzzle.render(g);
  else if (Cutscene.active && Cutscene.panel) Panels.draw(g, Cutscene.panel);
  else if (Cutscene.active && Cutscene.zoom > 1.02) { // cinematic zoom: render a smaller window, scale it up
    const z = Cutscene.zoom, ow = W, oh = H, zw = Math.round(W / z), zh = Math.round(H / z);
    if (!ZC.c || ZC.c.width !== zw || ZC.c.height !== zh) [ZC.c, ZC.g] = mk(zw, zh);
    W = zw; H = zh; World.render(ZC.g, G.time); W = ow; H = oh;
    g.imageSmoothingEnabled = false; g.drawImage(ZC.c, 0, 0, zw, zh, 0, 0, W, H);
  } else World.render(g, G.time);
  if (Cutscene.active) Cutscene.renderOverlay(g, G.time);
  if (G.mode === 'intro') { g.fillStyle = 'rgba(6,3,5,.82)'; g.fillRect(0, 0, W, H); }
  if (G.mode === 'title') { g.fillStyle = 'rgba(6,3,5,.25)'; g.fillRect(0, 0, W, H); }
  Fade.draw(g);
}
// test/QA hook (harmless in release)
window.BTS = { G, P, World, Puzzle, Dialogue, Game, Save, UI, Input, HUD, Menus, Cutscene, Brawl, Fade, FF, Opening };
boot();
