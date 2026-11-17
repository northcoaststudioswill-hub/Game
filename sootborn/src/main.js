// ============================================================
// main — game flow + fixed-timestep loop
// ============================================================
const Game = {
  toTitle() {
    G.mode = 'title'; Dialogue.active = false; $('#dlg').classList.add('hidden'); if (Puzzle.active) Puzzle.close();
    if (!P.sheet) World.resetSheets(); World.showPlayer = false; G.flags = G.flags || {};
    World.load('square', { x: 13 * 16 + 8, y: 8 * 16, dir: 0 }); Sound.music('home');
    Menus.title();
  },
  newGame() {
    freshState('Kael', 0); World.resetSheets(); World.showPlayer = true;
    Cutscene.play(PROLOGUE_A, () => Game.startHeist());
  },
  startHeist() {
    G.heist = 1; World.load('bay', { x: 24, y: 7 * 16 + 4, dir: 3 }, true); World.darkOverride = 'rgba(3,2,9,.8)';
    G.mode = 'world'; Game.resetHeist(); Sound.music('mystery');
    Fade.a = 1; Fade.dir = -1; Fade.sp = 1; Fade.busy = true;
    setTimeout(() => HUD.toast('B: throw a bolt to pull a guard away'), 900);
  },
  resetHeist() {
    World.npcs = [
      { id: 'seren', x: 2 * 16 + 8, y: 5 * 16 + 12, dir: 1, home: 1, anim: 0, moving: false, face: 0, barkCd: 99 },
      { id: 'proctor', patrol: 1, x: 5 * 16 + 8, y: 4 * 16 + 12, dir: 3, home: 3, wander: [[17, 4, 1, 2.2], [17, 8, 2, 1.2], [5, 8, 1, 2], [5, 4, 3, 1.4]], wi: 0, wait: 1.5, anim: 0, moving: false, face: 0, barkCd: 99 },
      { id: 'watchman', patrol: 1, x: 14 * 16 + 8, y: 10 * 16 + 12, dir: 2, home: 2, wander: [[14, 10, 2, 1.9], [14, 10, 1, 1.4], [14, 10, 3, 1.9], [14, 10, 0, 1.4]], wi: 0, wait: 1.9, anim: 0, moving: false, face: 0, barkCd: 99 }
    ];
    World.caughtT = 0;
  },
  onHeistDone() {
    G.heist = 0; G.flags.relayCut = 0; World.darkOverride = null; World.bolt = null; World.ripple = null; World.dynLights = []; World.npcs = [];
    Cutscene.play(PROLOGUE_B, () => Game.startPresent());
  },
  startPresent() {
    if (!G.tendency) G.tendency = 'caretaker';
    World.load('apt', { x: 3 * 16 + 8, y: 3 * 16 + 12, dir: 2 }); G.mode = 'world';
    Fade.a = 1; Fade.dir = -1; Fade.sp = 0.8; Fade.busy = true; Sound.play('bell'); Sound.music('home');
    addJ('p_seren', true); addJ('p_celestine', true); G.newJ = 0; Game.autosave();
    setTimeout(() => HUD.toast('Day 1 — Ashgate, Tier 6'), 900);
  },
  loadSave(s) {
    if (!s) return Game.toTitle();
    G.look = s.look | 0; World.resetSheets(); World.showPlayer = true; Save.apply(s); World.resetSheets();
    G.mode = 'world'; Fade.a = 1; Fade.dir = -1; Fade.sp = 2; Fade.busy = true; HUD.toast(`Day ${G.day} — ${MAPS[G.mapId].name}`);
  },
  autosave() { if (G.mode !== 'world' || G.heist) return; Save.write('auto'); },
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
  dayEnd() { Dialogue.end(); Fade.go(() => DayEnd.run(), 1.5); }
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
$('#cskip').addEventListener('click', e => { e.stopPropagation(); Cutscene.skip(); });

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
    if (document.hidden) { if (G.mode === 'world' && !UI.stack.length && !Dialogue.active) { if (Puzzle.active) Puzzle.close(); Menus.pause(); } Sound.suspend(); }
    else Sound.resume();
  });
  // press-to-start (also unlocks audio as a user gesture)
  const el = document.createElement('div'); el.className = 'splash'; el.style.background = '#07090d';
  el.innerHTML = '<div class="press">▶ Tap or press any key</div>'; $('#layer').appendChild(el);
  const go = () => { if (booted) return; booted = true; Sound.unlock(); el.remove(); Input.consume(); window.removeEventListener('keydown', go); G.mode = 'splash'; Splash.run(() => Game.toTitle()); };
  el.addEventListener('pointerdown', go); window.addEventListener('keydown', go);
  Boot.go = go;
  requestAnimationFrame(frame);
}
const Boot = { go: null };

let last = 0, acc = 0;
function frame(ts) {
  requestAnimationFrame(frame);
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
  else if (Dialogue.active) Dialogue.update(dt);
  else if (Puzzle.active) Puzzle.update(dt);
  else if (G.mode === 'world') { G.play += dt; World.update(dt); }
  else if (G.mode === 'intro') Intro.update(dt);
  else if (Cutscene.active) Cutscene.update(dt);
  if (G.mode === 'world' && !UI.stack.length && !Puzzle.active) World.updateNPCs(Dialogue.active ? 0 : 0);
  if (G.mode === 'title') { P.x = 13 * 16 + 8 + Math.sin(G.time * 0.08) * 110; P.y = 8 * 16 + Math.sin(G.time * 0.05) * 20; World.updateNPCs(dt); }
  Fade.update(dt); HUD.update(dt);
}
function render() {
  const g = ctx;
  if (G.mode === 'boot' || G.mode === 'splash' || !World.map || (Cutscene.active && !$('#card').classList.contains('hidden') && Fade.a >= 1)) { g.fillStyle = '#07090d'; g.fillRect(0, 0, W, H); return; }
  if (Puzzle.active) Puzzle.render(g);
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
window.BTS = { G, P, World, Puzzle, Dialogue, Game, Save, UI, Input, HUD, Menus, Cutscene };
boot();
