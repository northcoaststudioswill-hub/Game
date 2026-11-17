// Starhaven — input. Keyboard, gamepad and touch all feed the same actions.
// held[a]: is it down right now. pressed[a]: was it pressed since the last game frame.
(function (SH) {
  const ACTIONS = ['left', 'right', 'up', 'down', 'jump', 'attack', 'dash', 'pause', 'downstrike'];
  const KEYS = {
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    Space: 'jump', KeyZ: 'jump',
    KeyJ: 'attack', KeyX: 'attack',
    ShiftLeft: 'dash', ShiftRight: 'dash', KeyC: 'dash', KeyK: 'dash',
    Escape: 'pause', KeyP: 'pause', Enter: 'pause',
  };

  const src = { kb: {}, touch: {}, pad: {} };
  const queue = {};
  const input = {
    held: {}, pressed: {},
    source: 'kb',          // last used: 'kb' | 'touch' | 'pad'
    onSourceChange: null,
    enabled: true,
  };
  ACTIONS.forEach(a => { queue[a] = 0; input.held[a] = false; input.pressed[a] = false; });

  function setSource(s) {
    if (input.source !== s) { input.source = s; if (input.onSourceChange) input.onSourceChange(s); }
  }
  function down(which, a) {
    if (!src[which][a]) { src[which][a] = true; queue[a]++; }
  }
  function up(which, a) { src[which][a] = false; }

  // Called once per game frame (60/s).
  input.step = function () {
    if (input.forced) { // automated tests drive the game through this
      for (const a of ACTIONS) { input.held[a] = !!input.forced.held[a]; input.pressed[a] = !!input.forced.pressed[a]; }
      input.forced.pressed = {};
      return;
    }
    for (const a of ACTIONS) {
      input.held[a] = !!(src.kb[a] || src.touch[a] || src.pad[a]);
      input.pressed[a] = queue[a] > 0;
      queue[a] = 0;
    }
  };
  // Drop pending presses (e.g. when a menu opens). Buttons still physically held stay held, so holding a button
  // doesn't count as a new press. `full` (window lost focus) also forgets held keys and touches.
  input.clear = function (full) {
    for (const a of ACTIONS) {
      queue[a] = 0; input.pressed[a] = false;
      if (full) { src.kb[a] = src.touch[a] = src.pad[a] = false; input.held[a] = false; }
    }
  };
  // For menus: did this action get pressed (consumes it).
  input.take = function (a) { if (queue[a] > 0) { queue[a] = 0; return true; } return false; };

  // ---- keyboard
  window.addEventListener('keydown', e => {
    const a = KEYS[e.code];
    if (!a) return;
    e.preventDefault();
    if (SH.sfx) SH.sfx.unlock();
    setSource('kb');
    if (!e.repeat) down('kb', a);
    if (input.onAnyPress) input.onAnyPress(a);
  });
  window.addEventListener('keyup', e => { const a = KEYS[e.code]; if (a) { e.preventDefault(); up('kb', a); } });
  window.addEventListener('blur', () => input.clear(true));

  // A Bluetooth or USB controller announces itself once any of its buttons is pressed.
  window.addEventListener('gamepadconnected', e => { input.source = 'pad'; if (input.onSourceChange) input.onSourceChange('pad'); if (input.onPad) input.onPad(e.gamepad.id); });
  // ---- gamepad (standard mapping: A jump, X attack, B dash, Y talk, Start pause)
  const PAD_BTNS = { 0: 'jump', 2: 'attack', 1: 'dash', 3: 'up', 5: 'dash', 9: 'pause', 12: 'up', 13: 'down', 14: 'left', 15: 'right' };
  input.pollPad = function () {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let pad = null;
    for (const p of pads) if (p && p.connected) { pad = p; break; }
    if (!pad) return;
    const want = {};
    for (const i in PAD_BTNS) { const b = pad.buttons[i]; if (b && b.pressed) want[PAD_BTNS[i]] = true; }
    const ax = pad.axes[0] || 0, ay = pad.axes[1] || 0;
    if (ax < -0.4) want.left = true;
    if (ax > 0.4) want.right = true;
    if (ay > 0.5) want.down = true;
    if (ay < -0.5) want.up = true;
    let any = false;
    for (const a of ACTIONS) {
      if (want[a] && !src.pad[a]) { down('pad', a); any = true; if (input.onAnyPress) input.onAnyPress(a); }
      else if (!want[a] && src.pad[a]) up('pad', a);
    }
    if (any) { setSource('pad'); if (SH.sfx) SH.sfx.unlock(); }
  };

  // ---- touch: floating stick on the left half, buttons on the right
  input.bindTouch = function (layer, stickBase, stickKnob) {
    let stickId = null, ox = 0, oy = 0;
    const DEAD = 14, DOWN = 20, MAXR = 46;
    function stickSet(dx, dy) {
      const ang = Math.atan2(dy, dx), dist = Math.min(MAXR, Math.hypot(dx, dy));
      stickKnob.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px)`;
      const L = dx < -DEAD, R = dx > DEAD, D = dy > DOWN && dy > Math.abs(dx) * 0.35, U = dy < -DOWN && -dy > Math.abs(dx) * 0.5;
      L ? down('touch', 'left') : up('touch', 'left');
      R ? down('touch', 'right') : up('touch', 'right');
      D ? down('touch', 'down') : up('touch', 'down');
      U ? down('touch', 'up') : up('touch', 'up');
    }
    layer.addEventListener('pointerdown', e => {
      if (SH.sfx) SH.sfx.unlock();
      if (e.pointerType === 'mouse') return;
      setSource('touch');
      const btn = e.target.closest('[data-act]');
      if (btn) {
        e.preventDefault();
        btn.setPointerCapture(e.pointerId);
        btn.classList.add('on');
        down('touch', btn.dataset.act);
        if (input.onAnyPress) input.onAnyPress(btn.dataset.act);
        return;
      }
      const r = layer.getBoundingClientRect();
      if (stickId === null && e.clientX - r.left < r.width * 0.5) {
        e.preventDefault();
        stickId = e.pointerId; ox = e.clientX; oy = e.clientY;
        layer.setPointerCapture(e.pointerId);
        stickBase.style.left = (ox - r.left) + 'px'; stickBase.style.top = (oy - r.top) + 'px';
        stickBase.classList.add('on');
        stickSet(0, 0);
      }
    });
    layer.addEventListener('pointermove', e => {
      if (e.pointerId === stickId) { e.preventDefault(); stickSet(e.clientX - ox, e.clientY - oy); }
    });
    const end = e => {
      const btn = e.target.closest && e.target.closest('[data-act]');
      if (btn && btn.classList.contains('on')) { btn.classList.remove('on'); up('touch', btn.dataset.act); }
      if (e.pointerId === stickId) {
        stickId = null; stickBase.classList.remove('on');
        ['left', 'right', 'up', 'down'].forEach(a => up('touch', a));
      }
    };
    layer.addEventListener('pointerup', end);
    layer.addEventListener('pointercancel', end);
    layer.addEventListener('lostpointercapture', end);
  };

  input.isTouchDevice = (window.matchMedia && matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
  if (input.isTouchDevice) input.source = 'touch';

  // Button names shown in signs, per input type.
  input.LABELS = {
    kb: { MOVE: 'A / D or the arrow keys', JUMP: 'Space', ATTACK: 'J', SHOOT: 'J', DASH: 'Shift', DOWN: 'S', TALK: 'W', PAINT: 'W', DOWNSTRIKE: 'hold S and press J' },
    touch: { MOVE: 'a thumb on the left half of the screen', JUMP: 'the JUMP button', ATTACK: 'the STRIKE button', SHOOT: 'the SHOOT button', DASH: 'the DASH button', DOWN: 'down on the stick', TALK: 'the TALK button', PAINT: 'the PAINT button', DOWNSTRIKE: 'tap the \u25BC button' },
    pad: { MOVE: 'the left stick', JUMP: 'A', ATTACK: 'X', SHOOT: 'X', DASH: 'B', DOWN: 'down', TALK: 'Y', PAINT: 'Y', DOWNSTRIKE: 'hold down and press X' },
  };
  input.fill = function (text) {
    const L = input.LABELS[input.source] || input.LABELS.kb;
    return text.replace(/\{(\w+)\}/g, (m, k) => L[k] ? `<b>${L[k]}</b>` : m);
  };

  SH.input = input;
})(window.SH = window.SH || {});
