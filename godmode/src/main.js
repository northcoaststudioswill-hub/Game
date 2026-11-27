'use strict';
/* GODMODE.EXE: boot, the fixed-timestep loop, saving, and the wiring between
   sim events and what the player sees and hears. */

const SAVE_KEY = 'godmode.exe.save.v1', SET_KEY = 'godmode.exe.settings.v1';
const APP = {
  S: null, mode: 'title', menuOpen: false, dlgOpen: false, speed: 1,
  power: 'observe', createKind: 'grove', inspireK: ACCEL, tut: 0, camMoved: 0,
  settings: { sound: true, retro: true }, hasSave: false, acc: 0, last: 0, saveT: 0, hidden: false
};

/* ---- storage (may be unavailable: private tabs, sandboxed frames) ---- */
function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) { /* ignore */ } }
function saveGame() {
  if (!APP.S || APP.mode !== 'play') return false;
  const ok = lsSet(SAVE_KEY, serialize(APP.S));
  if (ok) APP.hasSave = true;
  return ok;
}
function saveSettings() { lsSet(SET_KEY, JSON.stringify({ sound: APP.settings.sound, retro: APP.settings.retro, tut: APP.tut })); }
function loadSettings() {
  try {
    const o = JSON.parse(lsGet(SET_KEY) || 'null');
    if (o) { APP.settings.sound = o.sound !== false; APP.settings.retro = o.retro !== false; if (typeof o.tut === 'number') APP.tut = o.tut; }
  } catch (e) { /* defaults */ }
}
function loadGame() {
  const text = lsGet(SAVE_KEY);
  if (!text) return null;
  try { return deserialize(text); } catch (e) { return null; }
}

/* ---- screens ---- */
function setSim(S) {
  APP.S = S;
  APP.acc = 0;
  resetRender(S);
  UI.inspectB = 0; UI.lastSub = ''; UI.tickT = 0;
}
function showTitle() {
  APP.mode = 'title';
  $('hud').hidden = true; $('title').hidden = false;
  $('btnContinue').hidden = !APP.hasSave;
  $('btnNew').textContent = APP.hasSave ? 'New world' : 'Wake up';
  const C = R.cam;
  C.auto = true; C.follow = 0; C.tx = 0; C.tz = 0; C.dist = R.w < R.h ? 46 : 34; C.pitch = 0.6;
  R.viewShiftT = 0;
  bootText();
}
function startGame(fresh) {
  if (fresh) {
    lsDel(SAVE_KEY); APP.hasSave = false;
    setSim(newSim((Math.random() * 1e9) | 0));
    APP.tut = 0; APP.camMoved = 0;
    saveSettings();
  } else if (!APP.S) setSim(newSim(1));
  APP.mode = 'play';
  $('title').hidden = true; $('hud').hidden = false;
  const C = R.cam;
  C.auto = false; C.tx = 0; C.tz = 0; C.dist = R.w < R.h ? 30 : 24; C.pitch = 0.8;
  setPower('observe');
  setSpeed(1);
  APP.S.events.length = 0;
  if (fresh) ticker('ISLAND.SIM loaded. Six minds running.', 'sys');
  APP.last = performance.now();
  saveGame();
}

/* ---- sim events -> feedback ---- */
function handleEvents(S) {
  const W = S.world, evs = S.events;
  for (let i = 0; i < evs.length; i++) {
    const e = evs[i];
    const y = e.x !== undefined ? groundY(W, e.x, e.z) : 0;
    switch (e.type) {
      case 'log': ticker(e.text, e.cls); break;
      case 'deny': flashHint(e.text); sfx('deny'); break;
      case 'bless':
        fxRing(e.x, y, e.z, '#ffd447', 5.4, 0.9); fxRing(e.x, y, e.z, '#ffffff', 3, 0.6);
        fxSpark(e.x, y + 0.4, e.z, '#ffe98a', 34, 3.2, 4.2, -2, 1.3); fxBeam(e.x, y, e.z, '#ffe98a');
        sfx('bless'); break;
      case 'smite':
        fxBolt(e.x, y, e.z);
        $('flash').style.transition = 'none'; $('flash').style.opacity = '0.75';
        requestAnimationFrame(() => { $('flash').style.transition = 'opacity .45s'; $('flash').style.opacity = '0'; });
        sfx('smite'); break;
      case 'shatter':
        fxSpark(e.x, y + 0.5, e.z, e.res === 'stone' ? '#c9ccdc' : e.res === 'wood' ? '#c98a4a' : '#ff4f6e', 22, 4, 5, -10, 1);
        ticker('Shattered: +' + e.n + ' ' + e.res + ' straight to the stockpile.', '');
        break;
      case 'razed': fxSpark(e.x, y + 0.6, e.z, '#ffb37a', 40, 5, 6, -10, 1.2); break;
      case 'chop': fxSpark(e.x, y + 0.6, e.z, e.res === 'stone' ? '#c9ccdc' : e.res === 'wood' ? '#c98a4a' : '#ff6a8a', 5, 1.6, 2.6, -8, 0.5); break;
      case 'deposit': fxSpark(e.x, y + 1.2, e.z, '#ffffff', 3, 0.8, 1.6, -3, 0.4); break;
      case 'placed': fxRing(e.x, y, e.z, '#3fe8ff', BUILD[e.kind].r * 1.6, 0.7); break;
      case 'create':
        fxSpark(e.x, y + 0.4, e.z, '#3fe8ff', 26, 2.6, 4, -4, 1); fxRing(e.x, y, e.z, '#3fe8ff', 3, 0.6);
        sfx('create'); break;
      case 'built': fxSpark(e.x, y + 1.2, e.z, '#ffffff', 30, 3.5, 5, -6, 1.1); fxRing(e.x, y, e.z, '#7dffc4', BUILD[e.kind].r * 2.2, 0.8); sfx('built'); break;
      case 'birth':
        fxSpark(e.x, y + 0.6, e.z, e.made ? '#3fe8ff' : '#ff8ad8', 20, 2, 4, -3, 1.1); fxRing(e.x, y, e.z, '#ffffff', 2, 0.6);
        if (e.made) fxBeam(e.x, y, e.z, '#3fe8ff');
        sfx(e.made ? 'create' : 'birth'); break;
      case 'death': fxSpark(e.x, y + 0.8, e.z, '#b9bccf', 18, 1.6, 3.5, 1.5, 1.4); sfx('death'); break;
      case 'convert': fxRing(e.x, y, e.z, BELIEFS[e.k].hex, 1.8, 0.7); fxSpark(e.x, y + 1.6, e.z, BELIEFS[e.k].hex, 8, 1, 2.4, -1, 0.8); sfx('convert'); break;
      case 'meme': fxMeme(e.from, e.to, e.k); break;
      case 'pulse': fxRing(e.x, y, e.z, BELIEFS[e.k].hex, 4.6, 0.9); break;
      case 'argue': fxSpark(e.x, y + 1.6, e.z, '#ff4f6e', 10, 1.4, 2.5, -2, 0.6); sfx('argue'); break;
      case 'inspire': fxBeam(e.x, y, e.z, BELIEFS[e.k].hex); fxSpark(e.x, y + 1.4, e.z, BELIEFS[e.k].hex, 24, 2.2, 4, -2, 1.2); sfx('inspire'); break;
      case 'grab': sfx('grab'); break;
      case 'drop': fxRing(e.x, y, e.z, '#3fe8ff', 1.6, 0.4); sfx('drop'); break;
      case 'age':
        if (e.k >= 0) { banner('AGE OF ' + BELIEFS[e.k].name, AGE_FX[e.k], BELIEFS[e.k].hex); sfx('age'); }
        break;
      case 'stage':
        if (e.stage === 5) banner('THE SPIRE', 'A design has arrived. Create > Spire, or wait and see.', '#ff8ae6');
        else if (e.stage < 6) banner('OBJECTIVE COMPLETE', 'Next: ' + STAGES[e.stage].text, '#ffc857');
        sfx('stage'); break;
      case 'restore': banner('RESTORED FROM BACKUP', 'Six new minds. They do not remember.', '#ff8ae6'); break;
      case 'singularity': {
        R.singT = 0; R.singHex = e.k >= 0 ? BELIEFS[e.k].hex : '#ff5fd2';
        R.flashL = 1.5; R.shake = 0.8;
        const C = R.cam;
        C.follow = 0; C.tx = e.x; C.tz = e.z; C.dist = 34; C.pitch = 0.42; C.auto = true;
        fxSpark(e.x, y + 9, e.z, R.singHex, 90, 7, 9, -3, 2.6); fxRing(e.x, y, e.z, R.singHex, 16, 2.2); fxRing(e.x, y, e.z, '#ffffff', 9, 1.4);
        sfx('sing');
        selectCitizen(0); setPower('observe'); setSpeed(1);
        APP.tut = -1; saveSettings();
        setTimeout(() => singularityDlg(S), 2600);
        break;
      }
    }
  }
  evs.length = 0;
}

/* ---- the loop: fixed sim steps, free-running render ---- */
function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - APP.last) / 1000;
  APP.last = now;
  if (!(dt > 0) || dt > 0.25) dt = 0.016;        // tab was asleep: do not fast-forward
  const S = APP.S;
  const running = APP.mode === 'play' && !APP.menuOpen && !APP.dlgOpen && !APP.hidden;
  if (running) {
    APP.acc += dt * APP.speed;
    let n = 0;
    while (APP.acc >= SIM_DT && n < 14) { simStep(S, SIM_DT); APP.acc -= SIM_DT; n++; }
    if (n === 14) APP.acc = 0;
    handleEvents(S);
    auAmbient(S, dt);
    APP.saveT += dt;
    if (APP.saveT > 12) { APP.saveT = 0; saveGame(); }
  }
  renderFrame(S, running ? APP.acc / SIM_DT : 1, dt);
  if (APP.mode === 'play') updateUI(S, dt);
}

function boot() {
  loadSettings();
  const canvas = $('gl');
  try { initRender(canvas); }
  catch (e) {
    $('title').hidden = true;
    showDlg('NO WEBGL', 'This browser could not start WebGL, which the island needs. Try a current Safari, Chrome or Firefox.', []);
    return;
  }
  R.retro = APP.settings.retro;
  resizeRender();
  initUI();
  initControls(canvas);
  const saved = loadGame();
  APP.hasSave = !!saved;
  setSim(saved || newSim(20261119));
  showTitle();

  window.addEventListener('resize', resizeRender);
  window.addEventListener('orientationchange', () => setTimeout(resizeRender, 250));
  if (window.visualViewport) window.visualViewport.addEventListener('resize', resizeRender);
  document.addEventListener('visibilitychange', () => {
    APP.hidden = document.hidden;
    if (document.hidden) { saveGame(); auSuspend(true); }
    else { APP.last = performance.now(); APP.acc = 0; auSuspend(false); }
  });
  window.addEventListener('pagehide', saveGame);
  canvas.addEventListener('webglcontextlost', e => e.preventDefault());
  canvas.addEventListener('webglcontextrestored', () => { resetRender(APP.S); });

  APP.last = performance.now();
  requestAnimationFrame(frame);
}
boot();
