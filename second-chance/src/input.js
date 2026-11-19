'use strict';
/* SECOND CHANCE - input: left thumb moves, right thumb turns the camera, buttons on the right act.
   Keyboard, mouse and gamepad drive the same state. */
(function () {
  const I = SC.input = { move: { x: 0, y: 0 }, look: { x: 0, y: 0 }, touch: false, sens: 1 };
  const press = {}, keys = {}, stick = { id: null, ox: 0, oy: 0, x: 0, y: 0 }, drag = { id: null, x: 0, y: 0, moved: 0, t: 0, mouse: false };
  let lookX = 0, lookY = 0, padPrev = [];
  const now = () => performance.now() / 1000;
  I.press = n => { press[n] = now(); I.last = n; };
  I.buffered = (n, w) => press[n] !== undefined && now() - press[n] <= w;
  I.clear = n => { delete press[n]; };
  I.take = n => { if (I.buffered(n, 0.25)) { delete press[n]; return true; } return false; };
  I.reset = () => { for (const k in press) delete press[k]; lookX = lookY = 0; };

  const KEY = { KeyJ: 'attack', KeyK: 'dodge', Space: 'dodge', KeyL: 'power', KeyQ: 'power', KeyE: 'interact', KeyF: 'interact', Tab: 'lock', KeyR: 'lock', Escape: 'pause', KeyP: 'pause', Enter: 'interact' };
  I.init = function () {
    const stage = document.getElementById('stage'), el = document.getElementById('stick'), nub = el.firstElementChild;
    const blocked = () => SC.ui.blocking();
    window.addEventListener('keydown', e => {
      if (e.repeat) return; keys[e.code] = true; SC.audio.unlock();
      if (KEY[e.code]) { e.preventDefault(); if (SC.ui.key(KEY[e.code])) return; I.press(KEY[e.code]); } else SC.ui.key('any');
      if (e.code.indexOf('Arrow') === 0) e.preventDefault();
    });
    window.addEventListener('keyup', e => { keys[e.code] = false; });
    window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
    document.querySelectorAll('.btn').forEach(b => {
      b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); SC.audio.unlock(); if (e.pointerType === 'touch') setTouch(); b.classList.add('dn'); if (!blocked()) I.press(b.dataset.act); });
      const up = () => b.classList.remove('dn'); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
    });
    function setTouch() { if (!I.touch) { I.touch = true; document.body.classList.add('touch'); } }
    if (window.matchMedia && matchMedia('(pointer:coarse)').matches) setTouch();
    window.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') setTouch(); }, true);
    stage.addEventListener('pointerdown', e => {
      SC.audio.unlock(); if (e.target.closest('.btn,[data-ui],.mbtn,.pcard,#rotate')) return;
      if (blocked()) { SC.ui.tap(); return; }
      if (e.pointerType === 'touch') {
        setTouch();
        if (e.clientX < window.innerWidth * 0.42 && stick.id === null) {
          stick.id = e.pointerId; stick.ox = e.clientX; stick.oy = e.clientY; stick.x = stick.y = 0;
          el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px'; el.style.bottom = 'auto'; el.style.translate = '-50% -50%'; el.classList.add('on');
        } else if (drag.id === null) { drag.id = e.pointerId; drag.x = e.clientX; drag.y = e.clientY; drag.mouse = false; }
      } else if (drag.id === null) { drag.id = e.pointerId; drag.x = e.clientX; drag.y = e.clientY; drag.moved = 0; drag.t = now(); drag.mouse = true; try { stage.setPointerCapture(e.pointerId); } catch (er) { /* fine */ } }
      e.preventDefault();
    });
    stage.addEventListener('pointermove', e => {
      if (e.pointerId === stick.id) {
        let dx = e.clientX - stick.ox, dy = e.clientY - stick.oy; const d = Math.hypot(dx, dy), R = 56;
        if (d > R) { dx *= R / d; dy *= R / d; }
        stick.x = dx / R; stick.y = -dy / R; nub.style.translate = dx + 'px ' + dy + 'px';
      } else if (e.pointerId === drag.id) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy);
        const k = 0.0062 * I.sens * (drag.mouse ? 0.8 : 1) * Math.min(1.6, 700 / Math.max(320, window.innerHeight)); lookX += dx * k; lookY += dy * k * 0.7;
      }
    });
    const end = e => {
      if (e.pointerId === stick.id) { stick.id = null; stick.x = stick.y = 0; nub.style.translate = '0 0'; el.classList.remove('on'); el.style.left = el.style.top = el.style.bottom = el.style.translate = ''; }
      if (e.pointerId === drag.id) { if (drag.mouse && drag.moved < 7 && now() - drag.t < 0.3 && !blocked()) I.press('attack'); drag.id = null; }
    };
    stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
    stage.addEventListener('contextmenu', e => e.preventDefault());
  };

  I.frame = function (rdt) {
    let mx = stick.x, my = stick.y;
    if (keys.KeyA) mx -= 1; if (keys.KeyD) mx += 1; if (keys.KeyW) my += 1; if (keys.KeyS) my -= 1;
    let lx = lookX, ly = lookY; lookX = lookY = 0;
    if (keys.ArrowLeft) lx -= 2.4 * rdt; if (keys.ArrowRight) lx += 2.4 * rdt; if (keys.ArrowUp) ly -= 1.4 * rdt; if (keys.ArrowDown) ly += 1.4 * rdt;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp || !gp.connected) continue;
      const dz = v => Math.abs(v) < 0.18 ? 0 : v;
      mx += dz(gp.axes[0] || 0); my -= dz(gp.axes[1] || 0); lx += dz(gp.axes[2] || 0) * 2.8 * rdt; ly += dz(gp.axes[3] || 0) * 1.6 * rdt;
      const map = { 0: 'interact', 1: 'dodge', 2: 'attack', 3: 'power', 5: 'lock', 11: 'lock', 9: 'pause', 7: 'attack', 4: 'power' };
      gp.buttons.forEach((b, i) => { if (b.pressed && !padPrev[i] && map[i]) { SC.audio.unlock(); if (!SC.ui.key(map[i])) I.press(map[i]); } padPrev[i] = b.pressed; });
      break;
    }
    if (I.script) { mx = I.script.x; my = I.script.y; lx += I.script.lx || 0; ly += I.script.ly || 0; }
    const m = Math.hypot(mx, my); if (m > 1) { mx /= m; my /= m; }
    I.move.x = m < 0.12 ? 0 : mx; I.move.y = m < 0.12 ? 0 : my; I.look.x = lx; I.look.y = ly;
  };
})();
