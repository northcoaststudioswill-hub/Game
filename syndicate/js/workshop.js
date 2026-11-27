// Guttercrown Workshop — the character editor. Built only into workshop.html, a separate private artifact; the game
// players open never contains it. It uses the game's own model code, so the preview is exactly what the game draws.
// Saving asks for confirmation, then keeps the edit in the Workshop's own store (edits/looks, owner-only writes).
// Claude reads that store and writes approved edits into js/look_edits.js, which the game applies.
(function () {
  'use strict';
  const G = window.G, T = THREE, L = G.looks; if (!window.WORKSHOP_ONLY || !L) return;
  const { merge, colourOf, hexs, COLS, SLOTS, FRAMES, mk0, clone } = L;
  const EDITS = {};                                                     // what the Workshop has saved (may be ahead of the game)
  const BAKED = G.BAKED_LOOKS || {};
  const baseOf = r => L.base(r);
  const same = (a, b) => JSON.stringify(a || null) === JSON.stringify(b || null);
  const pending = () => [...new Set(Object.keys(EDITS).concat(Object.keys(BAKED)))].filter(id => !same(EDITS[id], BAKED[id]));
  // ---------------------------------------------------------------- the Workshop's own store: starts from what the game already has, then whatever was saved here since
  let db = null, owner = false;
  Object.assign(EDITS, clone(BAKED));
  G.workshopReady = (async () => {
    if (!window.claude || !window.claude.use) return;
    try { const [d, u] = await Promise.all([window.claude.use('db'), window.claude.use('user')]); db = d; owner = !!(u && (await u.isOwner())); } catch (e) { return; }
    if (!db) return;
    try { const s = await db.doc('edits/looks').get(); const looks = s.exists && s.data().looks; if (looks) { Object.keys(EDITS).forEach(k => delete EDITS[k]); Object.assign(EDITS, clone(looks)); } } catch (e) { }
    if (el && cur) { choose(cur); drawList && drawList(''); }
  })();
  // the game boots underneath (the model code needs it), but nothing of it is drawn or heard: the Workshop is the whole page
  const boot = setInterval(() => { if (!G.ui || !G.gfx || !document.getElementById('panel')) return; clearInterval(boot); G.muted = true; try { G.bootSkip && G.bootSkip(); G.bootSkip && G.bootSkip(); } catch (e) { } G.gfx.render = () => {}; open(); }, 200);

  // ---------------------------------------------------------------- the editor
  let drawList = null, el = null, rend = null, scn = null, cam = null, cur = null, live = null, edit = {}, pose = 'idle', spin = 0.5, raf = 0, t0 = 0, drag = null;
  const css = `#workshop{position:fixed;inset:0;z-index:90;display:grid;grid-template-columns:minmax(200px,260px) 1fr minmax(240px,300px);background:#100d12;color:#e8dcc0;font:14px/1.35 var(--body,Georgia,serif)}
#workshop *{box-sizing:border-box}#workshop h2{font-family:var(--title,Georgia,serif);color:#f6dc8a;margin:0 0 6px;font-size:1.5rem}
#workshop .ws-list{overflow:auto;border-right:1px solid #3a2f2a;padding:calc(10px + env(safe-area-inset-top,0px)) 10px 10px max(10px,env(safe-area-inset-left,0px))}
#workshop .ws-pick{display:none}
#workshop .ws-list input{width:100%;margin:0 0 8px;font:inherit;padding:6px 8px;background:#1d1720;border:1px solid #3a2f2a;color:inherit;border-radius:4px}
#workshop .ws-g{font-family:var(--display,Georgia,serif);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#b9a986;margin:10px 0 4px}
#workshop .ws-i{display:block;width:100%;text-align:left;text-transform:none;letter-spacing:0;font:inherit;font-size:.9rem;padding:5px 8px;margin:1px 0;background:none;border:1px solid transparent;color:inherit;border-radius:4px;box-shadow:none}
#workshop .ws-i.on{border-color:#e0b04a;background:rgba(224,176,74,.14)}#workshop .ws-i .dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#e0b04a;margin-left:6px}
#workshop .ws-view{position:relative;min-width:0}#workshop canvas{display:block;width:100%;height:100%;touch-action:none;cursor:grab}
#workshop .ws-top{position:absolute;left:12px;right:12px;top:calc(10px + env(safe-area-inset-top,0px));display:flex;justify-content:space-between;gap:8px;pointer-events:none}
#workshop .ws-top>*{pointer-events:auto}#workshop .ws-name b{display:block;font-family:var(--title,Georgia,serif);font-size:1.6rem;color:#f6dc8a}#workshop .ws-name small{color:#b9a986}
#workshop .ws-poses{position:absolute;left:0;right:0;bottom:calc(10px + env(safe-area-inset-bottom,0px));display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
#workshop .ws-poses button,#workshop .ws-ctl button{font-size:.72rem;padding:.5em .8em}#workshop .ws-poses button.on{outline:2px solid #e0b04a}
#workshop .ws-ctl{overflow:auto;border-left:1px solid #3a2f2a;padding:calc(10px + env(safe-area-inset-top,0px)) max(12px,env(safe-area-inset-right,0px)) calc(12px + env(safe-area-inset-bottom,0px)) 12px;display:flex;flex-direction:column;gap:10px}
#workshop label{display:grid;grid-template-columns:7.5em 1fr auto;align-items:center;gap:6px;font-size:.88rem}
#workshop select,#workshop input[type=range]{width:100%;min-width:0;font:inherit;background:#1d1720;color:inherit;border:1px solid #3a2f2a;border-radius:4px;padding:3px}
#workshop input[type=color]{width:100%;height:28px;border:1px solid #3a2f2a;border-radius:4px;background:#1d1720;padding:1px}
#workshop .ws-x{background:none;border:0;box-shadow:none;color:#b9a986;font-size:.75rem;padding:2px 4px;text-transform:none;letter-spacing:0}
#workshop .ws-x[disabled]{visibility:hidden}#workshop .ws-h{font-family:var(--display,Georgia,serif);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#b9a986;border-bottom:1px solid #3a2f2a;padding-bottom:3px}
#workshop .ws-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}#workshop .ws-note{font-size:.8rem;color:#b9a986}
#workshop .ws-modal{position:absolute;inset:0;background:rgba(5,4,8,.72);display:grid;place-items:center;padding:16px;z-index:2}
#workshop .ws-card{background:#1d1720;border:1px solid #8a6a34;border-radius:6px;padding:18px;max-width:440px;width:100%;max-height:90%;overflow:auto}
#workshop .ws-diff{margin:10px 0;padding:0;list-style:none;font-size:.9rem}#workshop .ws-diff li{display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid #2a2228}
#workshop .sw{display:inline-block;width:18px;height:14px;border:1px solid #000;border-radius:2px;vertical-align:middle}
@media (max-width:760px){#workshop .ws-pick{display:block;width:100%;margin:0 0 4px}#workshop .ws-list input[type=search]{display:none}#workshop{grid-template-columns:1fr;grid-template-rows:auto 42vh 1fr}#workshop .ws-list{max-height:none;border-right:0;border-bottom:1px solid #3a2f2a;padding-bottom:6px}#workshop .ws-list .ws-all{display:none}#workshop .ws-ctl{border-left:0}}`;
  function open() {
    if (el) return; G.ui.close && G.ui.close();
    if (!document.getElementById('wscss')) { const s = document.createElement('style'); s.id = 'wscss'; s.textContent = css; document.head.appendChild(s); }
    el = document.createElement('div'); el.id = 'workshop';
    el.innerHTML = '<div class="ws-list"><h2>Workshop</h2><div class="ws-wait"></div><select class="ws-pick" aria-label="Character"></select><input type="search" placeholder="Find a character" aria-label="Find a character"><div class="ws-all"></div></div>' +
      '<div class="ws-view"><canvas></canvas><div class="ws-top"><div class="ws-name"><b></b><small></small></div></div><div class="ws-poses"></div></div><div class="ws-ctl"></div>';
    document.body.appendChild(el); G.workshopOpen = true;
    const reg = G.registry(), list = el.querySelector('.ws-all'), pick = el.querySelector('.ws-pick');
    drawList = q => { status(); list.innerHTML = ''; let g = ''; reg.filter(r => !q || r.name.toLowerCase().includes(q)).forEach(r => { if (r.group !== g) { g = r.group; const h = document.createElement('div'); h.className = 'ws-g'; h.textContent = g; list.appendChild(h); }
      const b = document.createElement('button'); b.className = 'ws-i' + (cur && cur.id === r.id ? ' on' : ''); b.textContent = r.name; if (EDITS[r.id]) { const d = document.createElement('span'); d.className = 'dot'; d.title = 'Edited'; b.appendChild(d); } b.onclick = () => choose(r); list.appendChild(b); }); };
    pick.innerHTML = reg.map((r, i) => '<option value="' + i + '">' + G.esc(r.group + ' · ' + r.name) + (EDITS[r.id] ? ' •' : '') + '</option>').join(''); pick.onchange = () => choose(reg[+pick.value]);
    el.querySelector('input[type=search]').oninput = e => drawList(e.target.value.trim().toLowerCase());
    el.querySelector('.ws-poses').innerHTML = [['idle', 'Stand'], ['walk', 'Walk'], ['swing', 'Swing'], ['cast', 'Cast'], ['guard', 'Guard'], ['cheer', 'Cheer'], ['ko', 'Down']].map(p => '<button data-pose="' + p[0] + '"' + (p[0] === pose ? ' class="on"' : '') + '>' + p[1] + '</button>').join('');
    el.querySelectorAll('[data-pose]').forEach(b => b.onclick = () => { pose = b.dataset.pose; el.querySelectorAll('[data-pose]').forEach(x => x.classList.toggle('on', x === b)); });
    const cv = el.querySelector('canvas');
    rend = new T.WebGLRenderer({ canvas: cv, antialias: true }); rend.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); rend.outputColorSpace = T.SRGBColorSpace;
    scn = new T.Scene(); scn.background = new T.Color(0x16121a); scn.add(new T.AmbientLight(0xfff0e0, 1.1)); scn.add(new T.HemisphereLight(0xfff2dc, 0x3a3040, 2.2)); const key = new T.DirectionalLight(0xffe2c0, 3.2); key.position.set(3, 5, 4); scn.add(key); const rim = new T.DirectionalLight(0x9fb8ff, 1.6); rim.position.set(-4, 3, -3); scn.add(rim);
    const fl = new T.Mesh(new T.CircleGeometry(1.6, 40), new T.MeshLambertMaterial({ color: 0x3a2c22 })); fl.rotation.x = -Math.PI / 2; scn.add(fl);
    cam = new T.PerspectiveCamera(30, 1, 0.1, 50); cam.position.set(0, 1.3, 6.6); cam.lookAt(0, 0.95, 0);
    cv.onpointerdown = e => { drag = { x: e.clientX, s: spin }; cv.setPointerCapture(e.pointerId); }; cv.onpointermove = e => { if (drag) spin = drag.s + (e.clientX - drag.x) * 0.012; }; cv.onpointerup = cv.onpointercancel = () => { drag = null; };
    drawList(''); choose(reg.find(r => r.id === 'marc') || reg[0]); t0 = performance.now(); loop();
  }
  // which saved changes are not in the game yet, and a way to hand them all to Claude
  function status() { const w = el && el.querySelector('.ws-wait'); if (!w) return; const p = pending(), reg = G.registry(), nm = id => (reg.find(r => r.id === id) || { name: id }).name;
    w.innerHTML = p.length ? '<p class="ws-note"><b>' + p.length + ' waiting to go into the game:</b> ' + p.map(id => G.esc(nm(id))).join(', ') + '. Tell Claude “apply the workshop edits”.</p><button class="ws-all-copy">Copy all for Claude</button>' : '<p class="ws-note">Everything saved here is in the game.</p>';
    const b = w.querySelector('.ws-all-copy'); if (b) b.onclick = () => { const txt = JSON.stringify({ workshop: 'Guttercrown', changes: pending().map(id => ({ id, name: nm(id), change: EDITS[id] || 'back to original' })) }, null, 1); try { navigator.clipboard.writeText(txt).then(() => note('Copied. Paste it to Claude.'), () => note(txt)); } catch (e) { note(txt); } }; }
  function close() { cancelAnimationFrame(raf); raf = 0; if (rend) { rend.dispose(); rend = null; } if (el) el.remove(); el = null; G.workshopOpen = false; G.ui.title && G.scene === 'title' && G.ui.title(); }
  function loop() { raf = requestAnimationFrame(loop); if (!el || !rend) return; const cv = rend.domElement, w = cv.clientWidth, h = cv.clientHeight; if (cv.width !== Math.floor(w * rend.getPixelRatio()) || cv.height !== Math.floor(h * rend.getPixelRatio())) { rend.setSize(w, h, false); cam.aspect = w / Math.max(1, h); cam.updateProjectionMatrix(); }
    const t = (performance.now() - t0) / 1000; if (live) { if (!drag) spin += 0.004; live.root.rotation.y = spin; const k = (t * 0.9) % 1, p = pose;
      live.pose(p === 'walk' ? { t, act: 'idle', moving: true, walk: t * 9 } : p === 'swing' ? { t, act: 'swing', prog: k, step: Math.floor(t * 0.9) % 3 } : p === 'cast' ? { t, act: 'cast', prog: Math.min(1, k * 1.4) } : p === 'guard' ? { t, act: 'idle', guard: true, ready: 1 } : p === 'ko' ? { t, act: 'ko' } : p === 'cheer' ? { t, act: 'cheer', prog: k } : { t, act: 'idle', ready: 1 }); }
    rend.render(scn, cam); }
  const effective = () => merge(cur.base, edit);
  function show() { if (live) scn.remove(live.root); live = null; try { live = mk0(effective()); scn.add(live.root); } catch (e) { } }
  function choose(r) {
    cur = r; cur.base = baseOf(r) || { cls: 'fighter', race: 'human' }; edit = clone(EDITS[r.id]);
    el.querySelector('.ws-name b').textContent = r.name; el.querySelector('.ws-name small').textContent = r.group + ' · ' + r.file + ' · id ' + r.id;
    el.querySelectorAll('.ws-i').forEach(b => b.classList.toggle('on', b.firstChild && b.firstChild.textContent === r.name));
    const reg = G.registry(), pk = el.querySelector('.ws-pick'); pk.value = String(reg.findIndex(q => q.id === r.id));
    controls(); show();
  }
  function controls() {
    const c = el.querySelector('.ws-ctl'), e = effective(), fighter = !!cur.fighter, base = G.MODEL_BASE[e.cls] || {}, race = G.RACES[e.race] || {};
    const colOf = k => hexs(colourOf(e, k));
    const opt = (v, list, none) => (none ? '<option value="">' + none + '</option>' : '') + list.map(x => '<option value="' + x[0] + '"' + (x[0] === v ? ' selected' : '') + '>' + G.esc(x[1]) + '</option>').join('');
    const cosOf = s => [['none', 'None']].concat((G.COSMETICS || []).filter(x => x.slot === s).map(x => [x.id, x.name]));
    let h = '<div class="ws-h">Body</div>';
    if (!fighter) { h += '<label>Frame<select data-k="cls">' + opt(e.cls, FRAMES.map(f => [f, f[0].toUpperCase() + f.slice(1)])) + '</select><button class="ws-x" data-r="cls"' + (edit.cls ? '' : ' disabled') + '>reset</button></label>';
      h += '<label>People<select data-k="race">' + opt(e.race, Object.keys(G.RACES).map(k => [k, G.RACES[k].name])) + '</select><button class="ws-x" data-r="race"' + (edit.race ? '' : ' disabled') + '>reset</button></label>'; }
    h += '<label>Size<input type="range" min="0.6" max="1.4" step="0.02" data-k="scale" value="' + (e.scale || 1) + '"><button class="ws-x" data-r="scale"' + (edit.scale ? '' : ' disabled') + '>reset</button></label>';
    h += '<div class="ws-h">Colours</div>' + COLS.filter(k => !(fighter && k[0] === 'skin')).map(k => '<label>' + k[1] + '<input type="color" data-c="' + k[0] + '" value="' + colOf(k[0]).slice(0, 7) + '"><button class="ws-x" data-rc="' + k[0] + '"' + ((k[0] === 'skin' ? edit.skin : (edit.tint || {})[k[0]]) ? '' : ' disabled') + '>reset</button></label>').join('');
    h += '<div class="ws-h">Cosmetics</div>' + SLOTS.map(s => '<label>' + s[1] + '<select data-s="' + s[0] + '">' + opt((e.cos || {})[s[0]] || 'none', cosOf(s[0])) + '</select><button class="ws-x" data-rs="' + s[0] + '"' + ((edit.cos || {})[s[0]] ? '' : ' disabled') + '>reset</button></label>').join('');
    if (fighter) h += '<p class="ws-note">A fighter’s frame and people decide how they fight, so only their looks are edited here.</p>';
    h += '<div class="ws-btns"><button class="big ws-save"' + (db && owner ? '' : ' disabled') + '>Save…</button><button class="ws-revert"' + (EDITS[cur.id] || Object.keys(edit).length ? '' : ' disabled') + '>Back to original</button><button class="ws-copy">Copy for Claude</button></div>';
    h += '<p class="ws-note">' + (db && owner ? 'Saving keeps the change here in the Workshop. It reaches the game when Claude applies the workshop edits, after a check.' : 'Saving needs the published Workshop, opened by its owner. You can still copy the change for Claude.') + '</p>';
    c.innerHTML = h;
    const upd = () => { show(); controls(); };
    c.querySelectorAll('[data-k]').forEach(i => i.oninput = i.onchange = () => { const v = i.dataset.k === 'scale' ? +i.value : i.value; edit[i.dataset.k] = v; if (i.dataset.k === 'scale') show(); else upd(); });
    c.querySelectorAll('[data-k=scale]').forEach(i => i.onchange = upd);
    c.querySelectorAll('[data-c]').forEach(i => { i.oninput = () => { const k = i.dataset.c; if (k === 'skin') edit.skin = i.value; else (edit.tint = edit.tint || {})[k] = i.value; show(); }; i.onchange = upd; });
    c.querySelectorAll('[data-s]').forEach(i => i.onchange = () => { (edit.cos = edit.cos || {})[i.dataset.s] = i.value; upd(); });
    c.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { delete edit[b.dataset.r]; upd(); });
    c.querySelectorAll('[data-rc]').forEach(b => b.onclick = () => { const k = b.dataset.rc; if (k === 'skin') delete edit.skin; else if (edit.tint) delete edit.tint[k]; upd(); });
    c.querySelectorAll('[data-rs]').forEach(b => b.onclick = () => { if (edit.cos) delete edit.cos[b.dataset.rs]; upd(); });
    c.querySelector('.ws-revert').onclick = () => confirmSave(true);
    c.querySelector('.ws-save').onclick = () => confirmSave(false);
    c.querySelector('.ws-copy').onclick = () => { const txt = JSON.stringify({ id: cur.id, name: cur.name, file: cur.file, change: tidy(edit) }, null, 1); const done = ok => note(ok ? 'Copied. Paste it to Claude to make the change permanent in the code.' : txt); try { navigator.clipboard.writeText(txt).then(() => done(true), () => done(false)); } catch (er) { done(false); } };
  }
  function tidy(e) { const o = clone(e); if (o.tint && !Object.keys(o.tint).length) delete o.tint; if (o.cos && !Object.keys(o.cos).length) delete o.cos; return o; }
  function note(msg) { const m = document.createElement('div'); m.className = 'ws-modal'; m.innerHTML = '<div class="ws-card"><p style="white-space:pre-wrap;user-select:text;-webkit-user-select:text"></p><button class="big">OK</button></div>'; m.querySelector('p').textContent = msg; m.querySelector('button').onclick = () => m.remove(); el.appendChild(m); }
  function diffRows(before, after) {
    const rows = [], sw = v => '<span class="sw" style="background:' + G.esc(hexs(v)) + '"></span>';
    ['cls', 'race', 'scale'].forEach(k => { if (String(before[k] || '') !== String(after[k] || '')) rows.push([k === 'cls' ? 'Frame' : k === 'race' ? 'People' : 'Size', G.esc(String(before[k] || (k === 'scale' ? 1 : '—'))), G.esc(String(after[k] || (k === 'scale' ? 1 : '—')))]); });
    COLS.forEach(([k, n]) => { const a = colourOf(before, k), b = colourOf(after, k); if (hexs(a).toLowerCase() !== hexs(b).toLowerCase()) rows.push([n, sw(a) + ' ' + G.esc(hexs(a)), sw(b) + ' ' + G.esc(hexs(b))]); });
    const cn = id => id ? ((G.COSMETICS || []).find(x => x.id === id) || { name: id }).name : 'None';
    SLOTS.forEach(([k, n]) => { const a = (before.cos || {})[k], b = (after.cos || {})[k]; if ((a || '') !== (b || '')) rows.push([n, G.esc(cn(a)), G.esc(cn(b))]); });
    return rows;
  }
  function confirmSave(revert) {
    const was = merge(cur.base, EDITS[cur.id]), will = revert ? cur.base : effective(), rows = diffRows(was, will);
    if (!rows.length) { note(revert ? cur.name + ' already looks the way the code made them.' : 'Nothing has changed yet.'); return; }
    const m = document.createElement('div'); m.className = 'ws-modal';
    m.innerHTML = '<div class="ws-card"><h2>' + (revert ? 'Put ' : 'Save ') + G.esc(cur.name) + (revert ? ' back?' : '?') + '</h2><p class="ws-note">' + (revert ? 'This removes your saved changes.' : 'Check the changes.') + ' Saved here first; it goes into the game when Claude applies the workshop edits.</p><ul class="ws-diff">' + rows.map(r => '<li><b style="min-width:7em">' + r[0] + '</b>' + r[1] + ' → ' + r[2] + '</li>').join('') + '</ul><div class="ws-btns"><button class="big ws-yes">' + (revert ? 'Put back' : 'Save') + '</button><button class="ws-no">Keep editing</button></div></div>';
    el.appendChild(m); m.querySelector('.ws-no').onclick = () => m.remove();
    m.querySelector('.ws-yes').onclick = async () => { const btn = m.querySelector('.ws-yes'); btn.disabled = true; btn.textContent = 'Saving…';
      const next = clone(EDITS); if (revert) delete next[cur.id]; else next[cur.id] = tidy(edit);
      try { await db.doc('edits/looks').set({ looks: next, at: Date.now() }); }
      catch (er) { m.remove(); note('Not saved: ' + (er && er.code === 'invalid_argument' ? 'only the game’s owner can save changes.' : er && er.code === 'quota_exceeded' ? 'the game’s store is full.' : 'the store could not be reached. Try again in a moment.')); return; }
      Object.keys(EDITS).forEach(k => delete EDITS[k]); Object.assign(EDITS, next); if (revert) edit = {}; m.remove();
      const r = cur; open2(r); note(revert ? r.name + ' is back to the original here. Tell Claude “apply the workshop edits” to put it back in the game.' : 'Saved in the Workshop. Tell Claude “apply the workshop edits” to put ' + r.name + ' into the game.'); };
  }
  function open2(r) { const keep = r.id; choose(G.registry().find(q => q.id === keep) || r); const s = el.querySelector('input[type=search]'); s.dispatchEvent(new Event('input')); }
  G.workshop = { open, edits: EDITS, pending };
  window.addEventListener('keydown', e => { if (el && e.code === 'Escape') { const m = el.querySelector('.ws-modal'); if (m) m.remove(); e.stopPropagation(); } }, true);
})();
