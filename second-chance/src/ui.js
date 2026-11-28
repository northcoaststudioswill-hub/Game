'use strict';
/* SECOND CHANCE - ui: HUD, illustrated dialogue panels, story pages, menus. All drawn like a comic. */
(function () {
  const U = SC.ui = { freeze: false, dlg: null, pg: null, menuOpen: false };
  const $ = id => document.getElementById(id), G = SC.gfx;
  const SPEAK = {
    hero: { name: 'DEZ', kind: 'hero', bg: 0x2a2a70, cls: '' },
    clerk: { name: 'MR. TALLY', kind: 'clerk', bg: 0x3a3f5c, cls: 'pale' },
    voss: { name: 'DEACON VOSS', kind: 'boss', bg: 0x8a1f24, cls: 'dark' },
    mercy: { name: 'MOTHER MERCY', kind: 'mercy', bg: 0x2a0d1c, cls: 'dark' },
    ruth: { name: 'RUTH OKAFOR', kind: 'ruth', bg: 0x1a2a4a, cls: 'pale' },
    cap: { cls: 'cap' }
  };
  const pics = {};
  U.pic = function (who, face) {
    const p = SC.player.path ? SC.PATHS[SC.player.path] : null, key = who + (face || '') + (who === 'hero' && p ? p.id : '');
    return pics[key] || (pics[key] = SC.portrait(SPEAK[who].kind, face || 'neutral', SPEAK[who].bg, who === 'hero' && p ? [p.color, p.css] : null));
  };
  U.blocking = () => !!(U.dlg || U.pg || U.menuOpen);
  const fmt = t => t.replace(/\*([^*]+)\*/g, '<b>$1</b>'), plain = t => t.replace(/\*/g, '');

  U.init = function () {
    $('whoPic').src = U.pic('hero', 'neutral');
    $('pause').addEventListener('pointerdown', e => { e.stopPropagation(); SC.audio.unlock(); if (!U.blocking()) U.pause(); });
    $('rotate').addEventListener('pointerdown', e => { e.stopPropagation(); $('rotate').classList.remove('want'); U.noRotate = true; });
    $('menu').addEventListener('pointerdown', e => {
      const b = e.target.closest('[data-go]'); if (!b) return; e.stopPropagation(); SC.audio.unlock(); SC.audio.sfx('ui');
      const fn = U.menuFns && U.menuFns[b.dataset.go]; if (fn) fn(b);
    });
    SC.on('flash', col => { const f = $('flash'); f.style.transition = 'none'; f.style.background = col; f.style.opacity = 0.5; requestAnimationFrame(() => { f.style.transition = 'opacity .35s'; f.style.opacity = 0; }); });
    SC.on('speedlines', t => { $('lines').style.opacity = 0.8; clearTimeout(U._sl); U._sl = setTimeout(() => { $('lines').style.opacity = 0; }, t * 1000); });
    SC.on('letterbox', on => { $('bars').classList.toggle('on', !!on); $('hud').classList.toggle('cine', !!on); });
    SC.on('nometer', () => { const b = $('mBar'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); });
    SC.on('path', id => { const p = SC.PATHS[id]; document.documentElement.style.setProperty('--path', p.css); document.documentElement.style.setProperty('--hot', p.cssHot); $('whoPic').src = U.pic('hero', 'neutral'); });
    U.resize();
  };
  U.resize = function () {
    const c = $('lines'), w = c.width = Math.round(window.innerWidth / 2), h = c.height = Math.round(window.innerHeight / 2), g = c.getContext('2d'), rnd = SC.seeded(5);
    g.clearRect(0, 0, w, h); g.fillStyle = '#fff'; const R = Math.hypot(w, h) / 2;
    for (let i = 0; i < 90; i++) { const a = rnd() * Math.PI * 2, r0 = R * (0.5 + rnd() * 0.3), wd = 0.006 + rnd() * 0.02;
      g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * r0, h / 2 + Math.sin(a) * r0); g.lineTo(w / 2 + Math.cos(a - wd) * R * 1.1, h / 2 + Math.sin(a - wd) * R * 1.1); g.lineTo(w / 2 + Math.cos(a + wd) * R * 1.1, h / 2 + Math.sin(a + wd) * R * 1.1); g.fill(); }
    if (!U.noRotate) { $('rotate').classList.add('want'); clearTimeout(U._rt); U._rt = setTimeout(() => $('rotate').classList.remove('want'), 7000); }
  };

  /* ---------- dialogue ---------- */
  U.say = function (lines, done) { U.dlg = { lines, i: -1, done, n: 0, full: false }; $('dlg').classList.remove('hide'); nextLine(); };
  function nextLine() {
    const d = U.dlg; d.i++;
    if (d.i >= d.lines.length) { $('dlg').classList.add('hide'); U.dlg = null; SC.input.reset(); if (d.done) d.done(); return; }
    const l = d.lines[d.i], s = SPEAK[l.who || 'cap'], el = $('dlg');
    el.className = s.cls; d.n = 0; d.full = false; d.text = plain(l.text);
    if (s.kind) { $('dlgPic').src = U.pic(l.who, l.face); $('dlgNm').textContent = s.name; }
    $('dlgTx').textContent = ''; if (l.fn) l.fn();
  }
  U.tap = function () {
    if (U.menuOpen) return;
    if (U.pg) { pageNext(); return; }
    const d = U.dlg; if (!d) return;
    if (!d.full) { d.full = true; $('dlgTx').innerHTML = fmt(d.lines[d.i].text); } else { SC.audio.sfx('ui'); nextLine(); }
  };
  U.key = function (a) {
    if (a === 'pause') { if (U.paused) { closeMenu(); U.paused = false; } else if (!U.blocking() && SC.state === 'play') U.pause(); return true; }
    if (U.blocking()) { if (a === 'interact' || a === 'attack' || a === 'dodge' || a === 'any') U.tap(); return true; }
    return false;
  };

  /* ---------- story pages: panels revealed one tap at a time ---------- */
  U.page = function (def, done) {
    const el = $('page'); el.innerHTML = ''; el.style.gridTemplateColumns = def.cols; el.style.gridTemplateRows = def.rows;
    def.panels.forEach(p => {
      const d = document.createElement('div'); d.className = 'pn'; d.style.gridArea = p.area; d.style.backgroundImage = 'url(' + p.img + ')'; if (p.pos) d.style.backgroundPosition = p.pos;
      d.innerHTML = (p.cap ? '<div class="cp' + (p.capCls ? ' ' + p.capCls : '') + '">' + fmt(p.cap) + '</div>' : '') + (p.cap2 ? '<div class="cp b' + (p.cap2Cls ? ' ' + p.cap2Cls : '') + '">' + fmt(p.cap2) + '</div>' : '') + (p.fx ? '<div class="fx">' + p.fx + '</div>' : '');
      el.appendChild(d);
    });
    const go = document.createElement('div'); go.className = 'go'; go.innerHTML = 'TAP &#9654;'; el.appendChild(go);
    el.classList.remove('hide'); U.pg = { n: 0, def, done, t: performance.now() }; U.freeze = true; pageNext(true);
  };
  function pageNext(first) {
    const pg = U.pg, el = $('page'); if (!first && performance.now() - pg.t < 250) return; pg.t = performance.now();
    if (pg.n < pg.def.panels.length) { el.children[pg.n].classList.add('on'); pg.n++; SC.audio.sfx('page'); return; }
    el.classList.add('hide'); U.pg = null; U.freeze = false; SC.input.reset(); if (pg.done) pg.done();
  }

  /* ---------- menus ---------- */
  function openMenu(html, fns, clear) { $('toast').classList.remove('on'); const m = $('menu'); m.innerHTML = html; m.classList.remove('hide'); m.classList.toggle('clear', !!clear); U.menuOpen = true; U.menuFns = fns; }
  function closeMenu() { $('menu').classList.add('hide'); U.menuOpen = false; U.menuFns = null; U.freeze = false; SC.input.reset(); }
  U.closeMenu = closeMenu;
  U.title = function (hasSave, onNew, onCont) {
    openMenu('<div style="text-align:center"><div class="tag">ISSUE #1 &middot; DEAD ON ARRIVAL</div><div class="logo"><span>SECOND</span>CHANCE</div>' +
      '<div style="margin-top:3vh">' + (hasSave ? '<div class="mbtn y" data-go="c">CONTINUE</div><div class="mbtn s" data-go="n">NEW GAME</div>' : '<div class="mbtn y" data-go="n">START</div>') + '</div></div>',
      { n: () => { closeMenu(); onNew(); }, c: () => { closeMenu(); onCont(); } }, true);
  };
  U.choosePath = function (cb, cur, head) {
    let h = '<div><div class="phead">' + (head || 'HOW WILL YOU COLLECT?') + '</div><div id="paths">';
    Object.keys(SC.PATHS).forEach(id => { const p = SC.PATHS[id];
      h += '<div class="pcard" data-go="' + id + '"><canvas width="160" height="160" data-s="' + id + '" style="background:' + p.css + '"></canvas><h3 style="color:' + p.css + '">' + p.name + '</h3><em>' + p.title + (cur === id ? ' &middot; YOURS NOW' : '') + '</em><p>' + p.blurb + '</p><u>' + p.power + '</u><p>' + p.passive + '</p></div>'; });
    h += '</div></div>';
    const fns = {}; Object.keys(SC.PATHS).forEach(id => { fns[id] = () => { closeMenu(); cb(id); }; });
    openMenu(h, fns); U.freeze = true;
    document.querySelectorAll('#paths canvas').forEach(c => SC.drawSigil(c.getContext('2d'), c.dataset.s, 160, false));
  };
  const CONTROLS = '<table><tr><td>MOVE</td><td>Left thumb &middot; WASD &middot; left stick</td></tr><tr><td>CAMERA</td><td>Drag right side &middot; mouse drag &middot; arrows &middot; right stick</td></tr>' +
    '<tr><td>ATTACK</td><td>Button &middot; J or click &middot; pad X. Three hits make a combo.</td></tr><tr><td>DODGE</td><td>Button &middot; Space &middot; pad B. Dodge late and time slows.</td></tr>' +
    '<tr><td>POWER</td><td>Button &middot; L or Q &middot; pad Y. Costs a third of the bar.</td></tr><tr><td>INTERACT</td><td>Button &middot; E &middot; pad A. Look, open, finish.</td></tr><tr><td>LOCK-ON</td><td>Button &middot; Tab &middot; pad RB</td></tr></table>';
  U.pause = function () {
    U.paused = true; U.freeze = true;
    const F = SC.flags, S = SC.story, found = S.IOUS ? S.IOUS.filter((q, j) => F['iou_' + j]).length : 0;
    const side = F.ruth_done ? "RUTH'S LOCKET: RETURNED" : F.locket ? "RUTH'S LOCKET: TAKE IT BACK TO HER ROOF" : F.ruth_met ? "RUTH'S LOCKET: PIER 9, ON THE CONTAINERS" : '';
    const keep = () => { SC.settings.sound = SC.audio.on; SC.settings.sens = SC.input.sens; SC.settings.quality = U.userQuality ? G.quality : 0; SC.saveSettings(); draw(); U.freeze = true; };
    const draw = () => openMenu('<div class="card split"><h2>PAUSED</h2><div>' + CONTROLS +
      '<p class="sub">IOUS FOUND ' + found + '/8 &middot; SCRIP ' + SC.player.scrip + (side ? '<br>SIDE: ' + side : '') + '</p></div>' +
      '<div><div class="mbtn y" data-go="r">RESUME</div><div class="mbtn s" data-go="d">CHALLENGE: ' + SC.diff().name + '</div><div class="mbtn s" data-go="q">PICTURE: ' + (G.quality >= 1 ? 'SHARP' : 'FAST') + '</div><div class="mbtn s" data-go="s">SOUND: ' + (SC.audio.on ? 'ON' : 'OFF') + '</div>' +
      '<div class="mbtn s" data-go="v">CAMERA SPEED: ' + (SC.input.sens === 1 ? 'NORMAL' : SC.input.sens > 1 ? 'FAST' : 'SLOW') + '</div><div class="mbtn s" data-go="c">BACK TO LAST CROSSING</div></div></div>', {
      r: () => { closeMenu(); U.paused = false; }, q: () => { G.setQuality(G.quality >= 1 ? 0.5 : 1); U.userQuality = true; keep(); }, s: () => { SC.audio.toggle(); keep(); },
      d: () => { const o = ['story', 'normal', 'hard']; SC.settings.diff = o[(o.indexOf(SC.settings.diff) + 1) % 3]; keep(); },
      v: () => { SC.input.sens = SC.input.sens === 1 ? 1.5 : SC.input.sens > 1 ? 0.65 : 1; keep(); }, c: () => { closeMenu(); U.paused = false; SC.story.load(); }
    });
    draw();
  };
  /* the crossing: saved, healed, and Tally's ledger open for business */
  U.crossing = function (fns) {
    const p = SC.player, draw = () => {
      let rows = '';
      SC.UPGRADES.forEach(u => {
        const lv = SC.up[u.id], done = lv >= u.max, cost = done ? 0 : u.cost[lv], can = !done && p.scrip >= cost;
        rows += '<div class="up' + (done ? ' done' : '') + '"><div><b>' + u.name + '</b> <i>' + '&#9670;'.repeat(lv) + '&#9671;'.repeat(u.max - lv) + '</i><small>' + (done ? 'Owned' : u.text[lv]) + '</small></div>' +
          '<div class="mbtn s' + (can ? ' y' : ' off') + '" data-go="b_' + u.id + '">' + (done ? 'OWNED' : cost + ' SCRIP') + '</div></div>';
      });
      const go = { p: () => { closeMenu(); fns.path(); }, x: () => { closeMenu(); fns.leave(); } };
      SC.UPGRADES.forEach(u => { go['b_' + u.id] = () => { fns.buy(u.id); draw(); U.freeze = true; }; });
      openMenu('<div class="card ledger"><h2>THE CROSSING</h2><p>Saved. Healed. Second chance back. Mr. Tally has the ledger open.</p>' +
        '<div class="purse">SCRIP <b>' + p.scrip + '</b></div><div class="ups">' + rows + '</div>' +
        '<div class="row"><div class="mbtn s" data-go="p">CHANGE PATH</div><div class="mbtn y" data-go="x">GO ON</div></div></div>', go);
      U.freeze = true;
    };
    draw();
  };
  U.dead = function (onRetry) {
    openMenu('<div class="card"><h2>DEAD. AGAIN.</h2><p>No third chances. Mr. Tally closes the book.</p><div class="mbtn y" data-go="r">BACK TO THE LAST CROSSING</div></div>', { r: () => { closeMenu(); onRetry(); } });
    U.freeze = true;
  };
  U.end = function (st, onAgain) {
    openMenu('<div class="card"><div class="tag">END OF ISSUE #1</div><h2 style="margin-top:8px">TO BE CONTINUED</h2><p>Deacon Voss paid in full. Mother Mercy still owes.</p>' +
      '<table><tr><td>TIME</td><td>' + Math.floor(st.time / 60) + ' min ' + ('0' + Math.floor(st.time % 60)).slice(-2) + ' s</td></tr><tr><td>PATH</td><td>' + st.path + '</td></tr><tr><td>HOLLOWS PUT DOWN</td><td>' + st.kills + '</td></tr>' +
      '<tr><td>FINISHERS</td><td>' + st.finishers + '</td></tr><tr><td>LATE DODGES</td><td>' + st.perfect + ' (' + st.counters + ' countered)</td></tr><tr><td>CLUES</td><td>' + st.clues + ' of 5</td></tr>' +
      '<tr><td>IOUS</td><td>' + st.ious + ' of 8</td></tr><tr><td>RUTH</td><td>' + (st.ruth ? 'At rest' : 'Still hanging the washing') + '</td></tr><tr><td>CHALLENGE</td><td>' + st.diff + '</td></tr><tr><td>SECOND CHANCES USED</td><td>' + st.chances + '</td></tr></table>' +
      '<div class="mbtn y" data-go="a">PLAY AGAIN</div></div>', { a: () => { closeMenu(); onAgain(); } });
    U.freeze = true;
  };

  /* ---------- HUD ---------- */
  U.showHud = on => $('hud').classList.toggle('off', !on);
  U.objective = function (t) { const o = $('obj'); if (o.textContent === t) return; o.textContent = t; o.classList.remove('pop'); void o.offsetWidth; o.classList.add('pop'); };
  U.toast = function (t, dur) { const el = $('toast'); el.innerHTML = fmt(t); el.classList.add('on'); clearTimeout(U._tt); U._tt = setTimeout(() => el.classList.remove('on'), (dur || 3.2) * 1000); };
  U.boss = function (e, name) { U.bossE = e; $('boss').classList.toggle('hide', !e); if (e) $('bossNm').textContent = name; };
  const _v = new THREE.Vector3(); let lastPrompt = '';
  U.hud = function (rdt) {
    const d = U.dlg;
    if (d && !d.full) { d.n += rdt * 62; const n = Math.floor(d.n); if (n >= d.text.length) { d.full = true; $('dlgTx').innerHTML = fmt(d.lines[d.i].text); } else { if (n % 3 === 0 && $('dlgTx').textContent.length !== n) SC.audio.sfx('blip'); $('dlgTx').textContent = d.text.slice(0, n); } }
    const p = SC.player, T = SC.T;
    $('hpFill').style.transform = $('hpLag').style.transform = 'scaleX(' + Math.max(0, p.hp / p.maxHp()) + ')';
    $('hpBar').style.width = 'calc(clamp(120px,30vw,250px) * ' + (p.maxHp() / T.hp) + ')';
    $('mFill').style.transform = 'scaleX(' + (p.meter / T.meter) + ')';
    $('tagCh').classList.toggle('used', p.chance <= 0);
    const path = p.path ? SC.PATHS[p.path] : null, ready = path && p.meter >= p.cost();
    $('tagPw').classList.toggle('hide', !path); if (path) $('tagPw').textContent = path.power + (p.rank > 1 ? ' II' : '');
    $('tagEc').classList.toggle('hide', !p.echoes); if (p.echoes) $('tagEc').textContent = 'CLUES ' + p.echoes + '/5';
    if (U._sc !== p.scrip) { const el = $('tagSc'); el.classList.toggle('hide', !p.scrip); el.textContent = 'SCRIP ' + p.scrip; if (U._sc !== undefined && p.scrip > U._sc) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); } U._sc = p.scrip; }
    $('bP').classList.toggle('low', !ready); $('bPl').innerHTML = (path ? path.btn : 'POWER') + (SC.input.touch ? '' : '<small>L</small>');
    $('bPf').style.transform = 'scaleY(' + (path ? 1 - Math.min(1, p.meter / p.cost()) : 1) + ')';
    $('bL').classList.toggle('on', !!SC.cam.lock);
    if (U.bossE) { const k = Math.max(0, U.bossE.hp / U.bossE.maxHp); $('bossFill').style.transform = $('bossLag').style.transform = 'scaleX(' + k + ')'; }
    // what the Interact button would do right now
    let label = '', hot = false;
    if (p.control && p.state !== 'scripted' && !U.blocking()) {
      if (p.finishable()) { label = 'FINISH!'; hot = true; }
      else if (!SC.combat.active) { const it = SC.world.nearestInteract(p.pos); if (it) label = it.label; }
    }
    if (label !== lastPrompt) {
      lastPrompt = label; $('bIl').innerHTML = (label || 'LOOK').replace(' ', '<br>'); $('bI').classList.toggle('hot', hot || !!label);
      $('prompt').classList.toggle('hide', !label); if (label) $('prompt').innerHTML = (SC.input.touch ? '' : '<kbd>E</kbd>') + label;
    }
    // objective marker
    const g = SC.story.goal, el = $('goal');
    if (g && p.control && !U.blocking() && SC.cam.mode === 'follow') {
      const dist = Math.hypot(g.x - p.pos.x, g.z - p.pos.z, (g.y || 0) - p.pos.y);
      if (dist < 3.5) el.classList.add('hide');
      else {
        _v.set(g.x, (g.y || 0) + 1.6, g.z).project(G.camera); const w = window.innerWidth, h = window.innerHeight;
        let x = _v.x, y = _v.y; if (_v.z > 1) { x = -x; y = -y; const m = Math.max(Math.abs(x), Math.abs(y)) || 1; x /= m; y /= m; }
        x = SC.clamp(x, -0.9, 0.9); y = SC.clamp(y, -0.62, 0.72);
        el.classList.remove('hide'); el.style.transform = 'translate(' + ((x * 0.5 + 0.5) * w) + 'px,' + ((-y * 0.5 + 0.5) * h) + 'px)'; el.lastElementChild.textContent = Math.round(dist) + ' M';
      }
    } else el.classList.add('hide');
  };
})();
