'use strict';
/* GODMODE.EXE: touch, mouse and keyboard. One finger orbits (or carries a citizen
   when Intervene is armed), two fingers pinch-zoom and pan, a clean tap uses the power. */

function initControls(canvas) {
  const pts = new Map();
  let tap = null, pinch = null, grabbing = false;
  const local = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const playing = () => APP.mode === 'play' && !APP.menuOpen && !APP.dlgOpen && !APP.lifeOpen;

  function panBy(dx, dy) {
    const C = R.cam, k = C.dist * 0.0021;
    C.tx += (-Math.cos(C.yaw) * dx - Math.sin(C.yaw) * dy) * k;
    C.tz += (Math.sin(C.yaw) * dx - Math.cos(C.yaw) * dy) * k;
    const r = hyp(C.tx, C.tz), lim = APP.S && APP.S.knownR ? APP.S.knownR : 19;
    if (r > lim) { C.tx *= lim / r; C.tz *= lim / r; }
    C.follow = 0; C.auto = false; UI.goBoat = 0;
  }
  function dragHeld(p) {
    const g = groundPoint(p.x, p.y);
    if (g) powerDrag(APP.S, g.x, g.z);
  }
  function endGrab() {
    if (!grabbing) return;
    grabbing = false;
    powerDrop(APP.S);
  }

  canvas.addEventListener('pointerdown', e => {
    if (!playing()) return;
    auInit();
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    const p = local(e);
    pts.set(e.pointerId, p);
    const touch = e.pointerType !== 'mouse';
    if (pts.size === 1) {
      tap = { id: e.pointerId, x0: p.x, y0: p.y, moved: false, pan: e.button === 2 || e.button === 1 || e.shiftKey, touch };
      if (APP.power === 'intervene' && !tap.pan) {
        const id = pickCitizen(APP.S, p.x, p.y, touch ? 48 : 30);
        if (id) {
          const r = powerGrab(APP.S, id);
          if (r.ok) { grabbing = true; tap.moved = true; dragHeld(p); }
          else tap.moved = true;
        }
      }
    } else {
      endGrab();
      tap = null;
      const a = [...pts.values()];
      pinch = { d: hyp(a[0].x - a[1].x, a[0].y - a[1].y), mx: (a[0].x + a[1].x) / 2, my: (a[0].y + a[1].y) / 2 };
    }
  });

  canvas.addEventListener('pointermove', e => {
    const prev = pts.get(e.pointerId);
    if (!prev) return;
    const p = local(e);
    pts.set(e.pointerId, p);
    if (grabbing) { dragHeld(p); return; }
    if (pts.size === 1 && tap && tap.id === e.pointerId) {
      const dx = p.x - prev.x, dy = p.y - prev.y;
      if (!tap.moved && hyp(p.x - tap.x0, p.y - tap.y0) > (tap.touch ? 10 : 5)) tap.moved = true;
      if (tap.moved) {
        if (tap.pan) panBy(dx, dy);
        else { R.cam.yaw -= dx * 0.0065; R.cam.pitch += dy * 0.005; R.cam.auto = false; }
        APP.camMoved += Math.abs(dx) + Math.abs(dy);
      }
    } else if (pts.size === 2 && pinch) {
      const a = [...pts.values()];
      const d = hyp(a[0].x - a[1].x, a[0].y - a[1].y), mx = (a[0].x + a[1].x) / 2, my = (a[0].y + a[1].y) / 2;
      if (d > 10 && pinch.d > 10) R.cam.dist = clamp(R.cam.dist * pinch.d / d, 8, 140);
      panBy(mx - pinch.mx, my - pinch.my);
      APP.camMoved += Math.abs(d - pinch.d) + Math.abs(mx - pinch.mx) + Math.abs(my - pinch.my);
      pinch.d = d; pinch.mx = mx; pinch.my = my;
    }
  });

  const up = e => {
    const p = pts.get(e.pointerId);
    if (!p) return;
    pts.delete(e.pointerId);
    if (grabbing) endGrab();
    else if (tap && tap.id === e.pointerId && !tap.moved && e.type === 'pointerup' && playing()) worldTap(p.x, p.y, tap.touch);
    if (pts.size < 2) pinch = null;
    // a finger left over from a pinch must not turn into a tap
    tap = pts.size === 1 ? { id: [...pts.keys()][0], x0: 0, y0: 0, moved: true, pan: false, touch: true } : null;
  };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('lostpointercapture', e => { if (pts.has(e.pointerId)) up(e); });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    if (!playing()) return;
    R.cam.dist = clamp(R.cam.dist * Math.exp(e.deltaY * 0.0012), 8, 140);
    R.cam.auto = false;
    APP.camMoved += 40;
  }, { passive: false });
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  // the page itself must never scroll, zoom or rubber-band during play
  const scrollable = t => t && t.closest && t.closest('#menu .body, #dlg .body');
  document.addEventListener('touchmove', e => { if (!scrollable(e.target)) e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('gesturechange', e => e.preventDefault());
  document.addEventListener('dblclick', e => e.preventDefault());
  let lastTouchEnd = 0;
  document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTouchEnd < 320 && !scrollable(e.target) && !(e.target.closest && e.target.closest('button'))) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  const KEYS = { '1': 'observe', '2': 'bless', '3': 'smite', '4': 'create', '5': 'inspire', '6': 'intervene' };
  window.addEventListener('keydown', e => {
    if (e.repeat) return;
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      if (APP.dlgOpen) return;
      if (APP.lifeOpen) { closeLife(); return; }
      if (APP.menuOpen) closeMenu(); else if (APP.mode === 'play') openMenu();
      return;
    }
    if (!playing()) return;
    if (KEYS[e.key]) setPower(KEYS[e.key]);
    else if (e.key === ' ') { e.preventDefault(); setSpeed(APP.speed === 1 ? 2 : APP.speed === 2 ? 4 : 1); }
    else if (e.key === 'ArrowLeft') R.cam.yaw -= 0.25;
    else if (e.key === 'ArrowRight') R.cam.yaw += 0.25;
    else if (e.key === 'ArrowUp') R.cam.dist = clamp(R.cam.dist * 0.88, 8, 140);
    else if (e.key === 'ArrowDown') R.cam.dist = clamp(R.cam.dist * 1.14, 8, 140);
  });
}

/* a clean tap on the world: use the armed power there */
function worldTap(sx, sy, touch) {
  const S = APP.S;
  let id = pickCitizen(S, sx, sy, touch ? 44 : 28);
  // in a story, a tap near the person the story points at means that person, even in a crowd
  const mk = UI.storyMark;
  if (mk && mk.id && (APP.power === 'observe' || APP.power === 'inspire' || APP.power === 'bless')) {
    const o = R.cit.get(mk.id);
    if (o) { const p = toScreen(o.x, o.g.position.y + 0.75 * o.g.scale.y, o.z, {}); if (hyp(p.x - sx, p.y - sy) < (touch ? 70 : 45)) id = mk.id; }
  }
  const g = groundPoint(sx, sy);
  const c = id ? getC(S, id) : null;
  switch (APP.power) {
    case 'observe': {
      if (c) { UI.inspectB = 0; selectCitizen(id); sfx('observe'); break; }
      const b = g && g.on ? pickBuilding(S, g.x, g.z) : null;
      selectCitizen(0);
      UI.inspectB = b ? b.id : 0;
      if (b) sfx('observe');
      UI.tickT = 0;
      break;
    }
    case 'bless':
      if (c) powerBless(S, c.x, c.z); else if (g && g.on) powerBless(S, g.x, g.z); else flashHint('Tap the island');
      break;
    case 'smite':
      if (c) powerSmite(S, c.x, c.z, id); else if (g && g.on) powerSmite(S, g.x, g.z, 0); else flashHint('Tap the island');
      break;
    case 'create':
      if (g && g.on) powerCreate(S, APP.createKind, g.x, g.z); else flashHint('Tap the island');
      break;
    case 'inspire':
      if (c) powerInspire(S, id, APP.inspireK); else flashHint('Tap a citizen');
      break;
    case 'intervene':
      flashHint(c ? 'Drag them, do not tap' : 'Drag a citizen');
      break;
  }
}
