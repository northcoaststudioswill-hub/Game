// Guttercrown — the pause menu: one place to stop, change settings, check the controls, and leave.
(function () {
  'use strict';
  const G = window.G, ui = G.ui, show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f);
  const inWorld = () => G.scene === 'hub' || G.scene === 'hideout', F = () => G.fight;
  let fromPause = false;

  const KEYS = '<div class="keys"><span><kbd>WASD</kbd> move</span><span><kbd>Mouse</kbd> aim</span><span><kbd>Click</kbd> strike · hold and release for a heavy blow</span><span><kbd>Space</kbd> dodge</span><span><kbd>Shift</kbd> or <kbd>Right-click</kbd> parry · hold to block</span><span><kbd>Q</kbd> <kbd>E</kbd> <kbd>R</kbd> abilities</span><span><kbd>F</kbd> ultimate</span><span><kbd>C</kbd> potion</span><span><kbd>G</kbd> taunt the crowd</span><span><kbd>T</kbd> call your Second</span><span><kbd>E</kbd> talk · use, in the market</span><span><kbd>Esc</kbd> pause</span></div>';
  const PAD = '<div class="keys"><span><kbd>Left stick</kbd> move</span><span><kbd>Right stick</kbd> aim</span><span><kbd>X</kbd> / <kbd>RT</kbd> strike · hold for heavy</span><span><kbd>A</kbd> dodge · talk · select</span><span><kbd>LT</kbd> parry · hold to block</span><span><kbd>LB</kbd> <kbd>RB</kbd> <kbd>Y</kbd> abilities</span><span><kbd>B</kbd> ultimate · back</span><span><kbd>D-pad up</kbd> potion</span><span><kbd>D-pad down</kbd> taunt</span><span><kbd>D-pad left</kbd> Second</span><span><kbd>Menu</kbd> pause</span></div>';
  const TOUCH = '<div class="keys"><span>Left thumb: move</span><span>Right buttons: strike, dodge, parry, abilities</span><span>Tap a name in the market to walk there</span><span>The ☰ button pauses</span></div>';

  const resume = () => { ui.close(); if (F().active) F().paused = false; if (ui.topbar && inWorld()) ui.topbar(); };
  ui.pauseMenu = function () {
    const fight = G.scene === 'fight' && F().active; if (!fight && !inWorld()) return; if (G.talk) return;
    if (fight) F().paused = true; fromPause = true; const st = G.state, h = st.hero, watching = !!G.spectating;
    show('<div class="card small pausecard"><small class="over">' + (fight ? (watching ? 'At the rail' : 'In the pit') : G.scene === 'hideout' ? 'At home' : 'In the market') + '</small><h2>Paused</h2>' +
      (h && !watching ? '<p class="dim">' + h.name + ' · level ' + h.level + ' ' + G.CLASSES[h.cls].name + ' · ' + G.RANKS[G.rankOf(st.respect)].name + '</p>' : '') +
      '<div class="choices">' +
      '<button class="big" id="rs"><b>Resume</b><small>Back to ' + (fight ? 'the bout' : 'where you were') + '.</small></button>' +
      '<button id="pset"><b>Settings</b><small>Sound, music, blood, screen shake, menu size, performance.</small></button>' +
      '<button id="pctl"><b>Controls</b><small>Keyboard, controller and touch.</small></button>' +
      (fight && !watching ? (G.garden && G.garden.run ? '<button id="ff" class="danger"><b>Give up (soul death)</b><small>There is no walking out of the garden. Giving up ends this fighter for good and erases the save.</small></button>' : '<button id="ff" class="danger"><b>Forfeit the bout</b><small>You walk out. It counts as a loss.</small></button>') : '') +
      (!fight ? '<button id="pquit"><b>Save and quit to title</b><small>Your progress is saved. Continue picks up here.</small></button>' : '') +
      '</div></div>');
    on('#rs', resume);
    on('#pset', () => ui.settings());
    on('#pctl', () => { show('<div class="card small"><h2>Controls</h2>' + G.controlsHTML() + '<div class="row end"><button class="big" id="x">Back</button></div></div>'); on('#x', () => ui.pauseMenu()); });
    on('#ff', () => { if (G.garden && G.garden.run) { show('<div class="card small"><h2>Give up?</h2><p>This fighter dies in the garden and the save is erased. There is no way back.</p><div class="row end"><button class="big" id="x">Keep fighting</button><button class="danger" id="gy">Give up</button></div></div>'); on('#x', () => ui.pauseMenu()); on('#gy', () => { fromPause = false; ui.close(); F().forfeit(); }); return; } fromPause = false; ui.close(); F().forfeit(); });
    on('#pquit', () => { show('<div class="card small"><h2>Quit to title?</h2><p>Everything is saved. You can continue from the title screen.</p><div class="row end"><button id="x">Back</button><button class="big" id="qy">Save and quit</button></div></div>'); on('#x', () => ui.pauseMenu()); on('#qy', () => { G.save(); location.reload(); }); });
  };
  // the old in-fight pause now opens the same menu
  ui.pause = () => ui.pauseMenu();
  // settings opened from the pause menu come back to it
  const set0 = ui.settings;
  ui.settings = function () { const r = set0.apply(this, arguments); if (fromPause) { const x = document.querySelector('#panel #x'); if (x) { const y = x.cloneNode(true); y.textContent = 'Back'; x.parentNode.replaceChild(y, x); y.onclick = () => { G.sfx && G.sfx('ui'); ui.pauseMenu(); }; } } return r; };
  // any other way of closing a menu also lets the bout go on
  const close0 = ui.close;
  ui.close = function () { fromPause = false; return close0.apply(this, arguments); };

  // the market button: one "Menu" instead of a bare Settings
  const tb0 = ui.topbar;
  if (tb0) ui.topbar = function () { const r = tb0.apply(this, arguments), b = document.getElementById('tbMute'); if (b && inWorld()) { b.textContent = '☰ Menu'; b.onclick = e => { e.stopPropagation(); G.sfx && G.sfx('ui'); ui.pauseMenu(); }; } return r; };

  // Esc in the market or at home, when nothing else is open
  document.addEventListener('keydown', e => {
    if (e.code !== 'Escape' && e.code !== 'KeyP') return; if (!inWorld()) return; const wasOpen = ui.isOpen(), onPause = !!document.querySelector('#panel .pausecard');
    if (onPause) { e.stopPropagation(); return resume(); }
    if (e.code === 'KeyP' && wasOpen) return;
    setTimeout(() => { if (!wasOpen && !ui.isOpen() && !G.talk && !G.placing && inWorld()) ui.pauseMenu(); }, 0);
  }, true);
  // the Menu button on a controller, outside a fight (in a fight main.js already calls ui.pause)
  let was = false;
  setInterval(() => { let down = false; try { const pads = navigator.getGamepads ? navigator.getGamepads() : []; for (const p of pads) if (p && p.buttons && p.buttons[9] && p.buttons[9].pressed) down = true; } catch (er) { }
    if (down && !was && inWorld() && !G.talk && !G.placing) { if (document.querySelector('#panel .pausecard')) resume(); else if (!ui.isOpen()) ui.pauseMenu(); }
    was = down; }, 60);
})();
