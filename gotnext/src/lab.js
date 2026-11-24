// GOT NEXT — model lab: the game's own rig on a model sheet (turnaround, pose row, lineups, orbit), with the build,
// every drip slot, every pose and the body proportions live-editable. Proportions copy out as JSON for src/gfx.js PROP;
// a look copies out as a build code the game's Link can import.
'use strict';
const LS = 'gotnext-lab-v1';
const POSES = [
  // [id, label, group, fn(t) -> [anim, time, opts, extra]]  extra: { y: height off the floor, ball: 'hand'|'drib'|'chest'|null, yaw }
  ['idle', 'Idle', 'Stance', t => ['idle', t, {}, { ball: 'hip' }]],
  ['swag', 'Street walk', 'Stance', t => ['loco', 0, { v: 2.1, ph: t * 6.2, swag: 1 }, {}]],
  ['walk', 'Plain walk', 'Stance', t => ['loco', 0, { v: 1.5, ph: t * 6 }, {}]],
  ['jog', 'Jog (park)', 'Stance', t => ['loco', 0, { v: 3.3, ph: t * 8 }, {}]],
  ['run', 'Sprint (park)', 'Stance', t => ['loco', 0, { v: 6.6, ph: t * 9.5 }, { y: 0.03 * Math.abs(Math.sin(t * 9.5)) }]],
  ['courtrun', 'Run (court)', 'Stance', t => ['run', 0, { sp: 1, ph: t * 9 }, { y: 0.03 * Math.abs(Math.sin(t * 9)) }]],
  ['slide', 'Defense slide', 'Defense', t => ['slide', 0, { ph: t * 7 }, {}]],
  ['contest', 'Contest', 'Defense', t => ['slide', 0, { ph: t * 7, up: true }, {}]],
  ['steal', 'Steal reach', 'Defense', t => ['steal', (t % 0.6) * 0.6, {}, {}]],
  ['swat', 'Block', 'Defense', t => ['swat', 0, {}, { y: 0.45 }]],
  ['boxout', 'Box out', 'Defense', t => ['boxout', 0, {}, {}]],
  ['dribble', 'Dribble', 'Handle', t => { const d = Math.abs(Math.sin(t * 5.5)); return ['dribble', 0, { sp: 0.2, ph: t * 4, dr: 1 - d * 0.8, hand: 'R' }, { ball: 'drib', d }]; }],
  ['drive', 'Sprint dribble', 'Handle', t => { const d = Math.abs(Math.sin(t * 7)); return ['dribble', 0, { sp: 1, ph: t * 9, dr: 1 - d * 0.8, hand: 'R' }, { ball: 'drib', d }]; }],
  ['protect', 'Protect', 'Handle', t => { const d = Math.abs(Math.sin(t * 7)); return ['dribble', 0, { sp: 0.1, ph: t * 3, dr: 1 - d * 0.8, hand: 'R', protect: true }, { ball: 'drib', d }]; }],
  ['cross', 'Crossover', 'Handle', t => ['move', 0, { side: 1, kind: 'cross', u: 0.5 + 0.5 * Math.sin(t * 3) }, { ball: 'hand' }]],
  ['tween', 'Between the legs', 'Handle', t => ['move', 0, { side: 1, kind: 'tween', u: 0.5 }, { ball: 'tween' }]],
  ['behind', 'Behind the back', 'Handle', t => ['move', 0, { side: -1, kind: 'behind', u: 0.5 }, { ball: 'behind' }]],
  ['stepback', 'Stepback', 'Handle', t => ['move', 0, { side: 1, kind: 'stepback', u: 0.5 + 0.5 * Math.sin(t * 3) }, { ball: 'hand' }]],
  ['hesi', 'Hesitation', 'Handle', t => ['move', 0, { side: 1, kind: 'hesi', u: 0.5 }, { ball: 'hand' }]],
  ['spin', 'Spin', 'Handle', t => ['move', 0, { side: 1, kind: 'spin', u: 0.5 }, { ball: 'hand', yaw: (t * 4) % 6.283 }]],
  ['shoot', 'Jumper (loop)', 'Shoot', t => { const u = t % 1.5; return ['shoot', u, { rel: 0.6 }, { ball: u < 0.62 ? 'shot' : null, y: u > 0.25 && u < 0.95 ? Math.sin((u - 0.25) / 0.7 * Math.PI) * 0.35 : 0 }]; }],
  ['set', 'Set point', 'Shoot', t => ['shoot', 0.5, { rel: 0.6 }, { ball: 'shot', y: 0.3 }]],
  ['release', 'Follow-through', 'Shoot', t => ['shoot', 0.8, { rel: 0.6 }, { y: 0.3 }]],
  ['floater', 'Floater', 'Shoot', t => ['floater', 0.25, {}, { y: 0.35 }]],
  ['layup', 'Layup', 'Finish', t => ['layup', 0, { u: 0.6, euro: Math.sin(t) > 0 ? 1 : 0 }, { ball: 'shot', y: 0.55 }]],
  ['tomahawk', 'Tomahawk', 'Finish', t => { const u = (t * 0.7) % 1; return ['dunk', 0, { u, style: 'tomahawk' }, { ball: 'shot', y: Math.sin(Math.min(1, u / 0.75) * Math.PI / 2) * 0.75 }]; }],
  ['twohand', 'Two-hand slam', 'Finish', t => ['dunk', 0, { u: 0.85, style: 'twohand' }, { ball: 'shot', y: 0.75 }]],
  ['windmill', 'Windmill', 'Finish', t => { const u = (t * 0.7) % 1; return ['dunk', 0, { u, style: 'windmill' }, { ball: 'shot', y: Math.sin(Math.min(1, u / 0.75) * Math.PI / 2) * 0.75 }]; }],
  ['chest', 'Chest pass', 'Pass', t => ['pass', (t % 0.6) * 0.5, { pk: 'chest' }, { ball: 'chest' }]],
  ['bounce', 'Bounce pass', 'Pass', t => ['pass', (t % 0.6) * 0.5, { pk: 'bounce' }, { ball: 'chest' }]],
  ['overhead', 'Overhead', 'Pass', t => ['pass', (t % 0.6) * 0.5, { pk: 'overhead' }, { ball: 'high' }]],
  ['catch', 'Catch', 'Pass', t => ['catch', 0, {}, { ball: 'chest' }]],
  ['call', 'Call for it', 'Pass', t => ['call', t, {}, {}]],
  ['flex', 'Flex', 'Celebrate', t => ['celeb', t, { style: 'flex' }, {}]],
  ['salute', 'Salute', 'Celebrate', t => ['celeb', t, { style: 'salute' }, {}]],
  ['count', 'Count the VC', 'Celebrate', t => ['celeb', t, { style: 'count' }, {}]],
  ['eagle', 'Freedom Eagle', 'Celebrate', t => ['celeb', t, { style: 'eagle' }, {}]],
  ['dance', 'Dance', 'Celebrate', t => ['dance', t, {}, {}]],
  ['sulk', 'Sulk', 'Celebrate', t => ['sulk', t, {}, {}]],
  ['stagger', 'Ankles broken', 'Reaction', t => ['stagger', 0.5, { fall: true }, {}]],
  ['wobble', 'Stumble', 'Reaction', t => ['stagger', t, { fall: false }, {}]],
];
const POSE_BY = {}; POSES.forEach(p => POSE_BY[p.id = p[0]] = p);
const SHEET_POSES = ['idle', 'dribble', 'cross', 'set', 'tomahawk', 'slide'];
const STYLE_H = { sniper: 77, slasher: 78, general: 74, lockdown: 78, glass: 83, showman: 76 };
const PROP_RANGE = { leg: [0.8, 1.2, 'Leg length'], thighShare: [0.4, 0.6, 'Thigh / shin'], torso: [0.8, 1.25, 'Torso'], arm: [0.8, 1.2, 'Arm length'], upperArm: [0.4, 0.6, 'Upper / fore'], shoulder: [0.75, 1.35, 'Shoulders'], hips: [0.7, 1.4, 'Hips'], head: [0.75, 1.35, 'Head'], neck: [0.5, 1.8, 'Neck'], limb: [0.7, 1.5, 'Limb thickness'], hand: [0.7, 1.6, 'Hands'], foot: [0.8, 1.4, 'Feet'] };

const L = Object.assign({ view: 'turn', lineup: 'styles', pose: 'idle', play: true, t: 0, outline: true, skel: false, ball: true, ruler: true, bg: 'sheet', yaw: 0, orbit: { yaw: 0.5, pitch: 0.15, dist: 4.2 },
  build: { style: 'slasher', origin: 'rustbelt', body: { h: 78, w: 0, s: 0.3 }, skin: 2 },
  worn: { hair: 'h_braids', head: 'hd_band', face: 'f_none', top: 't_jersey', arm: 'a_sleeve', bottom: 'b_orange', socks: 's_high', shoes: 'k_red', back: 'bk_none', ball: 'bl_std' }, prop: {} }, (() => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } })());
Object.assign(PROP, PROP_DEFAULT, L.prop || {});
const persist = () => { L.prop = Object.assign({}, PROP); try { localStorage.setItem(LS, JSON.stringify(L)); } catch (e) { } };

// ---------- scene ----------
const lab = { figs: [], dirty: true, skel: null, ruler: null };
function boot() {
  renderer = new THREE.WebGLRenderer({ canvas: $('gl'), antialias: true, preserveDrawingBuffer: true }); renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  scene = new THREE.Scene(); camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100); lab.persp = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x6a6458, 1.7)); const d = new THREE.DirectionalLight(0xffffff, 2.1); d.position.set(3, 6, 6); scene.add(d);
  lab.floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshBasicMaterial({ color: 0xbdb5a6 })); lab.floor.rotation.x = -Math.PI / 2; lab.floor.position.y = -0.002; scene.add(lab.floor);
  lab.skel = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xff2d78, depthTest: false })); lab.skel.renderOrder = 10; scene.add(lab.skel);
  lab.dots = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0x08080a, size: 7, sizeAttenuation: false, depthTest: false })); lab.dots.renderOrder = 11; scene.add(lab.dots);
  addEventListener('resize', resize); resize(); rail(); input();
  let last = performance.now(); const loop = now => { requestAnimationFrame(loop); const dt = Math.min(0.05, (now - last) / 1000); last = now; if (L.play) L.t += dt; draw(dt); }; requestAnimationFrame(loop);
}
function resize() { const c = $('gl'), r = c.parentElement.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); lab.w = r.width; lab.h = r.height; }
function spec(over) { return Object.assign({ name: 'LAB', build: JSON.parse(JSON.stringify(L.build)), worn: Object.assign({}, L.worn) }, over || {}); }
// the figures for the current view: [{ spec, x, yaw, label, pose }]
function layout() {
  const out = [];
  if (L.view === 'turn') [['FRONT', 0], ['3/4', -0.75], ['SIDE', -Math.PI / 2], ['BACK', Math.PI]].forEach(([n, y], i) => out.push({ spec: spec(), x: i * 1.05, yaw: y, label: n }));
  else if (L.view === 'poses') SHEET_POSES.forEach((id, i) => out.push({ spec: spec(), x: i * 1.15, yaw: -0.6, label: POSE_BY[id][1], pose: id }));
  else if (L.view === 'orbit') out.push({ spec: spec(), x: 0, yaw: 0, label: '' });
  else if (L.lineup === 'styles') STYLES.forEach((st, i) => { const s = spec(); s.build.style = st.id; s.build.body.h = STYLE_H[st.id]; s.build.body.w = st.id === 'glass' ? 0.6 : st.id === 'general' ? -0.3 : 0; out.push({ spec: s, x: i * 0.95, yaw: -0.35, label: st.n + ' · ' + fmtH(s.build.body.h) }); });
  else if (L.lineup === 'heights') [69, 72, 75, 78, 81, 84, 87].forEach((h, i) => { const s = spec(); s.build.body.h = h; out.push({ spec: s, x: i * 0.9, yaw: -0.35, label: fmtH(h) }); });
  else [[-1, -1, 'SKINNY · SHORT ARMS'], [-1, 1, 'SKINNY · LONG ARMS'], [0, 0, 'BASE'], [1, -1, 'HEAVY · SHORT ARMS'], [1, 1, 'HEAVY · LONG ARMS']].forEach(([w, sp, n], i) => { const s = spec(); s.build.body.w = w; s.build.body.s = sp; out.push({ spec: s, x: i * 1.05, yaw: -0.35, label: n }); });
  return out;
}
function rebuild() {
  for (const f of lab.figs) { scene.remove(f.R.root); if (f.ball) scene.remove(f.ball); }
  INK.visible = L.outline; lab.floor.material.color.set(L.bg === 'sheet' ? 0xbdb5a6 : 0x23242a); scene.background = new THREE.Color(L.bg === 'sheet' ? 0xd3ccbf : 0x111216);
  const lay = layout(), cx = (lay[lay.length - 1].x) / 2;
  lab.figs = lay.map(f => { const R = makeRig(f.spec); R.root.position.x = f.x - cx; scene.add(R.root); const ball = makeBall(L.worn.ball); scene.add(ball); return Object.assign(f, { R, ball, x: f.x - cx }); });
  if (lab.ruler) scene.remove(lab.ruler);
  lab.ruler = new THREE.Group(); const span = Math.max(3, lay.length * 1.1 + 1.5);
  for (let ft = 1; ft <= 8; ft++) { const y = ft * 0.3048, m = new THREE.Mesh(new THREE.PlaneGeometry(span, ft % 1 === 0 ? 0.004 : 0.002), new THREE.MeshBasicMaterial({ color: L.bg === 'sheet' ? 0x9c9486 : 0x34363e })); m.position.set(0, y, -0.6); lab.ruler.add(m); }
  lab.ruler.visible = L.ruler; scene.add(lab.ruler); lab.span = span; lab.dirty = false; labels();
  $('sub').textContent = { turn: 'turnaround · ' + POSE_BY[L.pose][1], poses: 'pose sheet', orbit: 'orbit · drag to turn · scroll to zoom', lineup: 'lineup · ' + { styles: 'playstyles at their usual heights', heights: "5'9\" to 7'3\"", builds: 'weight and wingspan' }[L.lineup] + ' · ' + POSE_BY[L.pose][1] }[L.view];
}
function labels() {
  const el = $('labels'); el.innerHTML = '';
  lab.figs.forEach((f, i) => { const d = document.createElement('div'); d.className = 'lb'; d.textContent = f.label; d.dataset.i = i; el.appendChild(d); });
  if (L.ruler && L.view !== 'orbit') for (let ft = 5; ft <= 8; ft++) { const d = document.createElement('div'); d.className = 'ft'; d.textContent = ft + "'"; d.dataset.ft = ft; el.appendChild(d); }
}
const _w = new THREE.Vector3(), _w2 = new THREE.Vector3();
const BONES = [['hips', 'spine'], ['spine', 'chest'], ['chest', 'neck'], ['neck', 'head'], ['chest', 'shR'], ['shR', 'elR'], ['elR', 'wrR'], ['chest', 'shL'], ['shL', 'elL'], ['elL', 'wrL'], ['hips', 'hpR'], ['hpR', 'knR'], ['knR', 'anR'], ['hips', 'hpL'], ['hpL', 'knL'], ['knL', 'anL']];
function draw(dt) {
  if (lab.dirty) rebuild();
  const seg = [], pts = [];
  for (const f of lab.figs) {
    const id = f.pose || L.pose, [an, tt, o, ex] = POSE_BY[id][3](L.t);
    const R = f.R; o.leg = R.legLen; applyPose(R, poseOf(an, tt, o), dt);
    R.extraYaw = ex.yaw || 0; R.root.position.y = ex.y || 0; R.root.rotation.y = f.yaw + L.yaw + R.extraYaw; R.shadow.position.y = 0.015 - (ex.y || 0);
    R.root.updateMatrixWorld(true);
    // the ball, where a hand would have it
    f.ball.visible = L.ball && !!ex.ball;
    if (f.ball.visible) {
      const hr = R.handR.getWorldPosition(_w), hl = R.handL.getWorldPosition(_w2);
      if (ex.ball === 'drib') { const fl = _w2.set(hr.x, 0.125, hr.z); f.ball.position.copy(hr).setY(hr.y - 0.115).lerp(fl, ex.d); }
      else if (ex.ball === 'shot' || ex.ball === 'hand') f.ball.position.copy(hr).setY(hr.y + (ex.ball === 'shot' ? 0.12 : -0.115));
      else if (ex.ball === 'chest' || ex.ball === 'high') f.ball.position.copy(hr).lerp(hl, 0.5).setY((hr.y + hl.y) / 2 + 0.05);
      else if (ex.ball === 'tween' || ex.ball === 'behind') f.ball.position.copy(R.root.localToWorld(_w.set(0, 0.33, ex.ball === 'behind' ? -0.3 : 0.04)));
      else if (ex.ball === 'hip') f.ball.position.copy(hr).setY(hr.y - 0.05).add(_w2.set(0, 0, 0.08));
    }
    if (L.skel) for (const [a, b] of BONES) { R.joints[a].getWorldPosition(_w); R.joints[b].getWorldPosition(_w2); seg.push(_w.x, _w.y, _w.z, _w2.x, _w2.y, _w2.z); pts.push(_w2.x, _w2.y, _w2.z); }
  }
  lab.skel.visible = lab.dots.visible = L.skel;
  if (L.skel) { lab.skel.geometry.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3)); lab.dots.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); }
  // camera: a flat sheet camera for every view but orbit
  let cam = camera;
  if (L.view === 'orbit') {
    cam = lab.persp; cam.aspect = lab.w / lab.h; cam.updateProjectionMatrix(); const O = L.orbit, hgt = L.build.body.h * 0.0254;
    cam.position.set(Math.sin(O.yaw) * Math.cos(O.pitch) * O.dist, hgt * 0.55 + Math.sin(O.pitch) * O.dist, Math.cos(O.yaw) * Math.cos(O.pitch) * O.dist); cam.lookAt(0, hgt * 0.5, 0);
  } else {
    const wide = lab.span - 0.4, tall = 2.75, asp = lab.w / lab.h; let hw = wide / 2, hh = tall / 2; if (hw / hh < asp) hw = hh * asp; else hh = hw / asp;
    camera.left = -hw; camera.right = hw; camera.top = hh; camera.bottom = -hh; camera.updateProjectionMatrix(); camera.position.set(0, tall / 2 - 0.12, 10); camera.lookAt(0, tall / 2 - 0.12, 0);
  }
  renderer.render(scene, cam);
  // labels under the figures, foot marks on the ruler
  const el = $('labels');
  for (const d of el.children) {
    if (d.dataset.i !== undefined) { const f = lab.figs[+d.dataset.i]; _w.set(f.x, -0.06, 0.2).project(cam); d.style.left = ((_w.x + 1) / 2 * lab.w) + 'px'; d.style.top = ((1 - _w.y) / 2 * lab.h) + 'px'; }
    else { _w.set(0, +d.dataset.ft * 0.3048, -0.6).project(cam); d.style.top = ((1 - _w.y) / 2 * lab.h - 12) + 'px'; }
  }
}

// ---------- controls ----------
const h = (tag, attrs, kids) => { const e = document.createElement(tag); for (const k in attrs || {}) { if (k === 'on') for (const ev in attrs.on) e.addEventListener(ev, attrs.on[ev]); else if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); } for (const c of [].concat(kids || [])) if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); return e; };
const toast = t => { const e = $('toast'); e.textContent = t; e.style.opacity = 1; clearTimeout(toast.t); toast.t = setTimeout(() => e.style.opacity = 0, 1600); };
function copyText(txt, what) {
  const done = () => toast(what + ' copied');
  const fall = () => { const ta = h('textarea', {}); ta.value = txt; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) { } ta.remove(); ok ? done() : prompt('Copy this:', txt); };
  try { navigator.clipboard.writeText(txt).then(done, fall); } catch (e) { fall(); }
}
function seg(opts, cur, set) { return h('div', { class: 'seg' }, opts.map(([v, n]) => h('button', { 'aria-pressed': String(v === cur), on: { click: () => { set(v); changed(true); } } }, n))); }
function slider(label, min, max, step, val, fmt, set) {
  const b = h('b', { text: fmt(val) }), i = h('input', { type: 'range', min, max, step, value: val, 'aria-label': label });
  i.addEventListener('input', () => { set(+i.value); b.textContent = fmt(+i.value); changed(false); });
  return h('label', { class: 'r' }, [h('span', { text: label }), i, b]);
}
function changed(redrawRail) { lab.dirty = true; persist(); if (redrawRail) rail(); }
function rail() {
  const r = $('rail'), st = r.scrollTop; r.innerHTML = '';
  const sec = (title, kids) => r.appendChild(h('div', { class: 'sec' }, [h('h2', { text: title })].concat(kids)));
  sec('View', [seg([['turn', 'Turnaround'], ['poses', 'Pose sheet'], ['lineup', 'Lineup'], ['orbit', 'Orbit']], L.view, v => L.view = v),
    L.view === 'lineup' ? h('div', { style: 'margin-top:4px' }, [seg([['styles', 'Playstyles'], ['heights', 'Heights'], ['builds', 'Weight · wingspan']], L.lineup, v => L.lineup = v)]) : null]);
  const ps = h('select', { 'aria-label': 'Pose', on: { change: e => { L.pose = e.target.value; changed(false); } } });
  let grp = null; for (const p of POSES) { if (!grp || grp.label !== p[2]) { grp = h('optgroup', { label: p[2] }); ps.appendChild(grp); } grp.appendChild(h('option', { value: p[0], text: p[1] })); } ps.value = L.pose;
  sec('Pose', [ps, h('div', { class: 'row', style: 'margin-top:6px' }, [h('button', { class: 'btn', on: { click: () => { L.play = !L.play; rail(); } } }, L.play ? 'Pause' : 'Play'), h('button', { class: 'btn', on: { click: () => { L.t = 0; } } }, 'Restart')]),
    L.view === 'poses' ? h('p', { class: 'note', text: 'The pose sheet always shows the same six poses; the pose picker drives the other views.' }) : null]);
  const ss = h('select', { 'aria-label': 'Playstyle', on: { change: e => { L.build.style = e.target.value; changed(false); } } }); STYLES.forEach(s => ss.appendChild(h('option', { value: s.id, text: s.n }))); ss.value = L.build.style;
  sec('Body', [ss,
    slider('Height', H_MIN, H_MAX, 1, L.build.body.h, fmtH, v => L.build.body.h = v),
    slider('Weight', -1, 1, 0.05, L.build.body.w, v => (v > 0 ? '+' : '') + v.toFixed(2), v => L.build.body.w = v),
    slider('Wingspan', -1, 1, 0.05, L.build.body.s, v => (v > 0 ? '+' : '') + v.toFixed(2), v => L.build.body.s = v),
    h('div', { style: 'margin-top:6px' }, SKINS.map((c, i) => h('span', { class: 'sw', role: 'button', tabindex: 0, 'aria-label': 'Skin ' + (i + 1), 'aria-pressed': String(i === L.build.skin), style: 'background:' + c, on: { click: () => { L.build.skin = i; changed(true); } } })))]);
  const slots = SLOTS.map(([k, n]) => { const s = h('select', { 'aria-label': n, on: { change: e => { L.worn[k] = e.target.value; changed(false); } } }); DRIP.filter(d => d.slot === k).forEach(d => s.appendChild(h('option', { value: d.id, text: d.n + (d.r ? ' · ' + RAR[d.r][0] : '') }))); s.value = L.worn[k]; return h('div', { class: 'slot' }, [h('span', { text: n }), s]); });
  sec('Drip', slots.concat([h('div', { class: 'row', style: 'margin-top:6px' }, [
    h('button', { class: 'btn', on: { click: () => { const w = randomWorn(4); for (const k in w) if (w[k]) L.worn[k] = w[k]; changed(true); } } }, 'Random fit'),
    h('button', { class: 'btn', on: { click: () => { for (const [k] of SLOTS) L.worn[k] = DRIP.find(d => d.slot === k && d.src === 'start').id; changed(true); } } }, 'Starter fit')])]));
  sec('Proportions', Object.keys(PROP_RANGE).map(k => slider(PROP_RANGE[k][2], PROP_RANGE[k][0], PROP_RANGE[k][1], 0.01, PROP[k], v => v.toFixed(2), v => PROP[k] = v)).concat([
    h('div', { class: 'row', style: 'margin-top:6px' }, [h('button', { class: 'btn hot', on: { click: () => copyText(JSON.stringify(Object.fromEntries(Object.entries(PROP).map(([k, v]) => [k, +v.toFixed(3)]))), 'Proportions') } }, 'Copy proportions'),
      h('button', { class: 'btn', on: { click: () => { Object.assign(PROP, PROP_DEFAULT); changed(true); } } }, 'Reset')]),
    h('p', { class: 'note', text: 'Proportions change every body in the lab. Send the copied numbers back and they go into the game\'s rig (PROP in src/gfx.js).' })]));
  const chk = (label, key) => { const i = h('input', { type: 'checkbox' }); i.checked = !!L[key]; i.addEventListener('change', () => { L[key] = i.checked; changed(false); }); return h('label', { class: 'chk' }, [i, label]); };
  sec('Display', [chk('Ink outline', 'outline'), chk('Skeleton (17 joints)', 'skel'), chk('Ball', 'ball'), chk('Height lines (feet)', 'ruler'),
    seg([['sheet', 'Sheet'], ['dark', 'Dark']], L.bg, v => L.bg = v)]);
  sec('Take it into the game', [h('div', { class: 'row' }, [h('button', { class: 'btn', on: { click: () => { const s = spec(); s.attrs = startAttrs(s.build); s.badges = {}; s.moves = { side: 'cross', back: 'stepback', diag: 'spin', jumper: 'textbook', dunk: 'tomahawk', celeb: 'flex' }; copyText(encodeBuild(s), 'Build code'); } } }, 'Copy build code')]),
    h('p', { class: 'note', text: 'Paste it at The Link in The Cages and this look runs with you as a homie.' })]);
  r.scrollTop = st;
}
function input() {
  const c = $('gl'); let drag = null;
  c.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; c.setPointerCapture(e.pointerId); c.style.cursor = 'grabbing'; });
  c.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag = { x: e.clientX, y: e.clientY };
    if (L.view === 'orbit') { L.orbit.yaw -= dx * 0.01; L.orbit.pitch = clamp(L.orbit.pitch + dy * 0.006, -0.3, 1.2); } else L.yaw += dx * 0.01; });
  const up = () => { if (drag) persist(); drag = null; c.style.cursor = 'grab'; }; c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  c.addEventListener('wheel', e => { if (L.view !== 'orbit') return; e.preventDefault(); L.orbit.dist = clamp(L.orbit.dist * (1 + e.deltaY * 0.001), 1.6, 9); }, { passive: false });
  c.addEventListener('dblclick', () => { L.yaw = 0; persist(); });
}
(document.fonts && document.fonts.load ? Promise.race([document.fonts.load('900 expanded 20px Archivo'), new Promise(r => setTimeout(r, 1200))]) : Promise.resolve()).then(boot, boot);
