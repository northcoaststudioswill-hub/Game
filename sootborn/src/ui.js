// ============================================================
// ui/ — HUD, modal menus (touch + keyboard + controller), title, intro, day end
// ============================================================
const HUD = {
  dirty: true, tt: 0,
  objective() {
    if (G.heist) return G.flags.relayCut ? 'Reach Valve Bank 7 (north wall) unseen' : 'Cut the audit relay (east wall) unseen';
    if (F('day1Done')) return "Day 2 isn't built yet — explore freely";
    if (!F('talkedTavi')) return 'Talk to Tavi';
    if (!F('talkedMara1')) return G.mapId === 'bay' ? 'Report to Mara' : 'Go to the Maintenance Bay (east, through the square)';
    if (!F('tookOrder')) return 'Take your work order from the shift board';
    if (!F('puzzleDone')) return 'Rebalance Valve Bank 7';
    if (!F('maraDebrief')) return 'Report back to Mara';
    if (!F('crateC')) return 'Check the outbound crates on the dock';
    if (!F('clockedOut')) return 'Clock out with Mara';
    if (!F('ivoTalk2') && G.mapId !== 'apt') return 'Go home (Ivo wanted to talk)';
    return 'Go home and get some sleep';
  },
  hint() {
    const d = Input.device;
    if (G.mode !== 'world' || Dialogue.active || Puzzle.active || UI.stack.length) return '';
    if (G.heist) return d === 'touch' ? 'B: throw a bolt · stay out of the light' : d === 'pad' ? 'Ⓑ throw a bolt · stay out of the light' : 'Esc/X: throw a bolt · stay out of the light';
    if (P.moved < 40 && !F('talkedTavi')) return d === 'touch' ? 'Drag the pad to move' : d === 'pad' ? 'Left stick or D-pad to move' : 'WASD or arrow keys to move';
    if (World.target && !F('interacted')) return d === 'touch' ? 'Tap A to interact' : d === 'pad' ? 'Press Ⓐ to interact' : 'Press E or Enter to interact';
    return '';
  },
  update(dt) {
    const world = G.mode === 'world' && !UI.stack.length;
    const o = $('#obj'), s = $('#stat'), h = $('#hint');
    o.classList.toggle('hidden', !(world && !Dialogue.active) && !Puzzle.active);
    s.classList.toggle('hidden', !world || Dialogue.active || Puzzle.active);
    if (Puzzle.active) { o.querySelector('b').textContent = 'WO-114 · VALVE ' + Puzzle.defs[Puzzle.si].name; o.querySelector('span').textContent = Puzzle.defs[Puzzle.si].tip; }
    else { o.querySelector('b').textContent = 'OBJECTIVE'; o.querySelector('span').textContent = this.objective(); }
    s.textContent = `Day ${G.day} · ${G.scrip} scrip` + (G.newJ ? ` · ✎${G.newJ}` : '');
    const ht = this.hint(); h.classList.toggle('hidden', !ht); h.querySelector('span').textContent = ht;
    document.body.classList.toggle('ctlfade', Dialogue.active || Puzzle.active);
    document.body.classList.toggle('ingame', world);
    document.body.classList.toggle('inpuzzle', Puzzle.active);
    if (this.tt > 0) { this.tt -= dt; if (this.tt <= 0) $('#toast').classList.remove('on'); }
  },
  toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('on'); this.tt = 2.4; }
};

// ---------- modal stack
const UI = {
  stack: [],
  top() { return this.stack[this.stack.length - 1]; },
  push(m) { for (const s of this.stack) s.el.style.display = 'none'; this.stack.push(m); $('#layer').appendChild(m.el); Input.consume(); HUD.dirty = true; },
  pop() { const m = this.stack.pop(); if (!m) return; m.el.remove(); const t = this.top(); if (t) { t.el.style.display = ''; t.refresh && t.refresh(); } m.onClose && m.onClose(); Input.consume(); HUD.dirty = true; },
  clear() { while (this.stack.length) { const m = this.stack.pop(); m.el.remove(); } HUD.dirty = true; }
};
// opts: {title, build(panel), items:[{label, value(), act(), adj(dir), disabled()}], onBack, clear, tabs}
function modal(opts) {
  const el = document.createElement('div'); el.className = 'modal' + (opts.clear ? ' clear' : '');
  const panel = document.createElement('div'); panel.className = 'panel'; el.appendChild(panel);
  if (opts.title) { const h = document.createElement('h2'); h.textContent = opts.title; panel.appendChild(h); }
  const body = document.createElement('div'); panel.appendChild(body);
  const list = document.createElement('div'); panel.appendChild(list);
  const m = {
    el, panel, body, sel: 0, items: opts.items || [], opts, born: G.time,
    refresh() {
      if (opts.build) { body.innerHTML = ''; opts.build(body, m); }
      list.innerHTML = '';
      m.items.forEach((it, i) => {
        const b = document.createElement('button'); b.className = 'mi';
        const dis = it.disabled && it.disabled(); if (dis) b.disabled = true;
        const v = it.value ? `<span class="v">${it.adj ? '<i>◀</i>' : ''}${esc(it.value())}${it.adj ? '<i>▶</i>' : ''}</span>` : '';
        b.innerHTML = `<span>${esc(typeof it.label === 'function' ? it.label() : it.label)}</span>${v}`;
        b.onclick = e => { m.sel = i; if (it.adj) { const r = b.getBoundingClientRect(); it.adj(e.clientX && e.clientX < r.left + r.width * 0.55 && it.value ? -1 : 1); Sound.play('move'); m.refresh(); } else if (it.act) { Sound.play('ok'); it.act(); } };
        list.appendChild(b);
      });
      m.hl();
    },
    hl() { [...list.children].forEach((b, i) => b.classList.toggle('sel', i === m.sel)); const s = list.children[m.sel]; if (s && s.scrollIntoView && Input.device !== 'touch') s.scrollIntoView({ block: 'nearest' }); },
    move(d) { const n = m.items.length; if (!n) return; for (let k = 0; k < n; k++) { m.sel = (m.sel + d + n) % n; const it = m.items[m.sel]; if (!(it.disabled && it.disabled())) break; } m.hl(); Sound.play('move'); },
    update() {
      if (G.time - m.born < 0.3) return;
      if (opts.tabs) { if (Input.p('L')) opts.tabs(-1); if (Input.p('R')) opts.tabs(1); }
      if (Input.rep('up')) m.move(-1); if (Input.rep('down')) m.move(1);
      const it = m.items[m.sel];
      if (it && it.adj) { if (Input.rep('left')) { it.adj(-1); Sound.play('move'); m.refresh(); } if (Input.rep('right')) { it.adj(1); Sound.play('move'); m.refresh(); } }
      else if (opts.tabs) { if (Input.p('left')) opts.tabs(-1); if (Input.p('right')) opts.tabs(1); }
      if (Input.p('A') && it && !(it.disabled && it.disabled())) { if (it.act) { Sound.play('ok'); it.act(); } else if (it.adj) { it.adj(1); m.refresh(); } }
      if ((Input.p('B') || (Input.p('START') && opts.startCloses)) && opts.onBack !== null) { Sound.play('back'); (opts.onBack || (() => UI.pop()))(); }
    }
  };
  m.onClose = opts.onClose;
  const first = m.items.findIndex(it => !(it.disabled && it.disabled())); m.sel = first < 0 ? 0 : first;
  m.refresh();
  return m;
}

const Menus = {
  pause() {
    Sound.play('ok');
    UI.push(modal({ title: 'Paused', startCloses: true, build(b) { b.innerHTML = `<p>${esc(G.name)} · Day ${G.day} · ${esc(MAPS[G.mapId].name)}${G.tendency ? ' · ' + TEND[G.tendency] : ''}</p>`; }, items: [
      { label: 'Resume', act: () => UI.pop() },
      { label: () => 'Journal' + (G.newJ ? ` (${G.newJ} new)` : ''), act: () => Menus.journal() },
      { label: 'Save game', act: () => { const ok = Save.write('manual'); HUD.toast(ok ? 'Game saved' : 'Saved for this session — use Save data to keep it'); Sound.play('coin'); } },
      { label: 'Settings', act: () => Menus.settings() },
      { label: 'Dialogue history', act: () => Menus.log() },
      { label: 'Save data (export / import)', act: () => Menus.saveData() },
      { label: 'Quit to title', act: () => { Game.autosave(); UI.clear(); Game.toTitle(); } }
    ] }));
  },
  journal() {
    const tabs = ['evidence', 'people', 'places', 'theories'], names = ['Evidence', 'People', 'Places', 'Theories'];
    let tab = Menus._jt || 0; G.newJ = 0;
    const m = modal({ title: 'Journal', startCloses: true, tabs: d => { tab = (tab + d + 4) % 4; Menus._jt = tab; Sound.play('page'); m.refresh(); },
      build(b) {
        const t = document.createElement('div'); t.className = 'tabs';
        names.forEach((n, i) => { const bt = document.createElement('button'); bt.textContent = n; bt.className = i === tab ? 'on' : ''; bt.onclick = () => { tab = i; Menus._jt = i; Sound.play('page'); m.refresh(); }; t.appendChild(bt); });
        b.appendChild(t);
        const key = tabs[tab]; let html = '';
        if (key === 'theories') {
          html += '<div class="card ghost"><b>Theories form when clues connect.</b><p>Combining clues arrives in Act II.</p></div>';
          if (G.journal.includes('e_aux9') && G.journal.includes('e_crate')) html += G.journal.includes('e_riser') ? '<div class="card"><b>??? — Something up there is alive</b><p>The pressure goes up Riser 9. The greens go up Freight Three. The air that comes back down is warm and smells green. Whatever is above Tier 4 is not burning.</p></div>' : '<div class="card"><b>??? — Where does it all go?</b><p>The pressure goes up. The greens go up. Lift 0 goes... up? Something above Tier 4 is being fed.</p></div>';
          if (G.journal.includes('e_chalk') && G.journal.includes('p_dace')) html += '<div class="card"><b>??? — What did Dace find?</b><p>D.M. chalked the AUX-9 line: STILL FLOWING. A Crew 3 glove in the rubble. Then Dace vanished from the roster.</p></div>';
        } else {
          const es = G.journal.filter(j => JOURNAL[j].tab === key);
          if (!es.length) html = '<div class="card ghost"><p>Nothing yet.</p></div>';
          for (const j of es.slice().reverse()) { const e = JOURNAL[j]; html += `<div class="card"><b>${esc(e.title)}</b><p>${esc(fill(typeof e.body === 'function' ? e.body() : e.body))}</p></div>`; }
        }
        const d = document.createElement('div'); d.innerHTML = html; b.appendChild(d);
        const tip = document.createElement('p'); tip.style.opacity = .6; tip.textContent = Input.device === 'pad' ? 'L / R: switch tabs · Ⓑ close' : Input.device === 'kb' ? 'Q / R or ◀ ▶: switch tabs · Esc close' : 'Tap a tab to switch'; b.appendChild(tip);
      },
      items: [{ label: 'Close', act: () => UI.pop() }] });
    UI.push(m);
  },
  settings() {
    const S = Settings.d, upd = () => { Settings.save(); Settings.apply(); };
    const cyc = (k, n) => d => { S[k] = (S[k] + d + n) % n; upd(); };
    UI.push(modal({ title: 'Settings', build(b) { b.innerHTML = `<p style="opacity:.7">Saves: ${Store.ok ? 'kept in this browser' : 'this session only (storage blocked) — export from Save data'}. Keyboard: WASD/arrows, E/Enter, Esc, M menu, Q/R tabs, H hint. Controller supported.</p>`; }, items: [
      { label: 'Music', value: () => S.music * 10 + '%', adj: d => { S.music = clamp(S.music + d, 0, 10); upd(); } },
      { label: 'Sound effects', value: () => S.sfx * 10 + '%', adj: d => { S.sfx = clamp(S.sfx + d, 0, 10); upd(); Sound.play('blip'); } },
      { label: 'Text size', value: () => ['Small', 'Medium', 'Large', 'Huge'][S.text], adj: cyc('text', 4) },
      { label: 'Text speed', value: () => ['Slow', 'Normal', 'Fast', 'Instant'][S.speed], adj: cyc('speed', 4) },
      { label: 'Highlight interactables', value: () => S.highlight ? 'On' : 'Off', adj: cyc('highlight', 2) },
      { label: 'Reduce motion & flicker', value: () => S.reduce ? 'On' : 'Off', adj: cyc('reduce', 2) },
      { label: 'Touch controls', value: () => ({ auto: 'Auto', on: 'Always', off: 'Hidden' })[S.touch], adj: d => { const o = ['auto', 'on', 'off']; S.touch = o[(o.indexOf(S.touch) + d + 3) % 3]; upd(); } },
      { label: 'Touch control opacity', value: () => S.op + '%', adj: d => { S.op = clamp(S.op + d * 10, 20, 100); upd(); } },
      { label: 'Back', act: () => UI.pop() }
    ] }));
  },
  log() {
    UI.push(modal({ title: 'Dialogue history', build(b) { b.innerHTML = (G.log.slice(-60).map(l => `<p>${esc(l)}</p>`).join('') || '<p>Nothing yet.</p>'); setTimeout(() => { b.parentNode.scrollTop = 1e6; }, 0); }, items: [{ label: 'Close', act: () => UI.pop() }] }));
  },
  saveData() {
    const inGame = G.mode === 'world';
    UI.push(modal({ title: 'Save data', build(b, m) {
      const cur = inGame ? JSON.stringify(Save.snapshot()) : (Store.get('bts_save_auto') || Store.get('bts_save_manual') || '');
      b.innerHTML = `<p>Copy this text somewhere safe to back up your save, or paste a save below to load it.</p>
        <textarea id="sdOut" readonly>${esc(cur)}</textarea><div class="row"><button class="mi" id="sdCopy">Copy save text</button></div>
        <textarea id="sdIn" placeholder="Paste a save here"></textarea>
        <div class="row"><button class="mi" id="sdLoad">Load pasted save</button><label class="mi" style="justify-content:center">Load file<input type="file" id="sdFile" accept=".json,.txt,application/json,text/plain" hidden></label></div><p id="sdMsg"></p>`;
      const msg = t => b.querySelector('#sdMsg').textContent = t;
      b.querySelector('#sdCopy').onclick = () => { const ta = b.querySelector('#sdOut'); ta.select(); try { navigator.clipboard.writeText(ta.value).then(() => msg('Copied.'), () => msg('Copy blocked here — the text is selected; copy it manually.')); } catch (e) { msg('Copy blocked here — the text is selected; copy it manually.'); } };
      const load = txt => { let s = null; try { s = Save.migrate(JSON.parse(txt)); } catch (e) { } if (!s) { msg("That doesn't look like a Below the Sun save."); Sound.play('deny'); return; } UI.clear(); Game.loadSave(s); };
      b.querySelector('#sdLoad').onclick = () => load(b.querySelector('#sdIn').value);
      b.querySelector('#sdFile').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(load); };
    }, items: [{ label: 'Back', act: () => UI.pop() }] }));
  },
  title() {
    const s = Save.latest();
    UI.push(modal({ clear: true, onBack: null, build(b) {
      b.innerHTML = `<h1 class="logo">SOOTBORN</h1><div class="sub">Book One · The First Shift</div>`;
      b.parentNode.style.background = 'rgba(16,10,13,.82)'; b.parentNode.style.textAlign = 'center';
    }, items: [
      { label: s ? `Continue — Day ${s.day}, ${MAPS[s.map].name}` : 'Continue', disabled: () => !s, act: () => { UI.clear(); Game.loadSave(Save.latest()); } },
      { label: 'New game', act: () => Menus.newGame() },
      { label: 'Load / import save', act: () => Menus.saveData() },
      { label: 'Settings', act: () => Menus.settings() },
      { label: 'About & controls', act: () => Menus.about() }
    ] }));
  },
  about() {
    UI.push(modal({ title: 'About', build(b) { b.innerHTML = `<p><b>SOOTBORN</b> — a North Coast Studios × E Concepts game. Book One vertical slice (v0.3): the prologue and one shift in Cinderwell.</p><p>Forty-one days ago, the Array Authority took Seren Holloway for a crime Kael Brennick committed. Today, Kael goes back to work on the same valve bank.</p>
      <p>Original story, characters, pixel art and music, all generated in code.</p>
      <p><b>Touch:</b> pad to move, A to interact/confirm, B to back, ☰ for the menu. <b>Keyboard:</b> WASD/arrows, E or Enter, Esc, M (menu), Q/R (journal). <b>Controller:</b> stick/D-pad, Ⓐ, Ⓑ, Start, shoulders.</p>
      <p>Phone tip: landscape gives the biggest screen.</p>`; }, items: [{ label: 'Back', act: () => UI.pop() }] }));
  },
  newGame() {
    const has = !!Save.latest();
    if (!has) { UI.clear(); Game.newGame(); return; }
    UI.push(modal({ title: 'New game', build(b) { b.innerHTML = '<p>Start again from the prologue? Your current save will be replaced at the next autosave. (Export it from Save data first if you want to keep it.)</p>'; }, items: [
      { label: 'Begin the prologue', act: () => { UI.clear(); Game.newGame(); } }, { label: 'Back', act: () => UI.pop() }] }));
  },
  _oldNewGame() {
    let name = G.name || 'Wren', look = G.look || 0;
    const m = modal({ title: 'New game', build(b) {
      b.innerHTML = `<p>Your name</p><input type="text" id="ngName" maxlength="14" value="${esc(name)}" autocomplete="off"><p style="margin-top:10px">Look</p><div class="looks"></div>`;
      const inp = b.querySelector('#ngName'); inp.oninput = () => { name = inp.value; };
      inp.onkeydown = e => { if (e.key === 'Enter') inp.blur(); };
      const wrap = b.querySelector('.looks');
      LOOKS.forEach((L, i) => { const c = document.createElement('canvas'); c.width = 48; c.height = 48; portraitTo(c, makeChar(playerLook(i))); if (i === look) c.className = 'on'; c.onclick = () => { look = i; Sound.play('move'); m.refresh(); }; wrap.appendChild(c); });
    }, items: [
      { label: 'Look', value: () => LOOKS[look].label, adj: d => { look = (look + d + LOOKS.length) % LOOKS.length; } },
      { label: 'Begin first shift', act: () => { const n = (name || '').trim().slice(0, 14) || 'Wren'; UI.clear(); Game.newGame(n, look); } },
      { label: 'Back', act: () => UI.pop() }
    ] });
    UI.push(m);
  }
};

// ---------- boot splash: North Coast Studios, then E Concepts
const Splash = {
  run(done) {
    const el = document.createElement('div'); el.className = 'splash';
    el.innerHTML = `<div class="mark" id="spA"><canvas class="ncs-lake" width="66" height="29"></canvas><div class="ncs-name">NORTH COAST</div><div class="ncs-tag">STUDIOS</div></div>`;
    $('#layer').appendChild(el);
    this.drawLake(el.querySelector('canvas'));
    let step = 0, timer = null;
    const next = () => {
      clearTimeout(timer); step++;
      if (step === 1) { el.querySelector('#spA').classList.add('on'); Sound.play('splash'); timer = setTimeout(next, 2200); }
      else if (step === 2) { el.querySelector('#spA').classList.remove('on'); timer = setTimeout(next, 700); }
      else if (step === 3) { el.innerHTML = `<div class="mark" id="spB"><div class="with">in association with</div><div class="ec-e">E</div><div class="ec-name">CONCEPTS</div></div>`; requestAnimationFrame(() => requestAnimationFrame(() => el.querySelector('#spB').classList.add('on'))); timer = setTimeout(next, 2200); }
      else if (step === 4) { el.style.opacity = 0; timer = setTimeout(next, 700); }
      else { el.remove(); window.removeEventListener('keydown', skip, true); done(); }
    };
    const t0 = performance.now(); const skip = () => { if (performance.now() - t0 < 900) return; if (step < 3) { step = 2; next(); } else if (step === 3) next(); };
    el.addEventListener('pointerdown', skip); window.addEventListener('keydown', skip, true);
    Splash.padSkip = skip;
    setTimeout(next, 250);
  },
  drawLake(c) {
    const g = c.getContext('2d'), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    const sky = ['#1b2a4a', '#2e3d64', '#5a4a72', '#a85a5a', '#e8884a']; sky.forEach((s, i) => R(0, i * 3, 66, 3, s));
    R(26, 9, 14, 6, '#ffc86a'); R(28, 7, 10, 2, '#ffc86a'); R(30, 6, 6, 1, '#ffd890');
    R(0, 15, 66, 14, '#16324a'); for (let y = 16; y < 29; y += 2) for (let x = (y * 3) % 7; x < 66; x += 7) R(x, y, 3, 1, '#2a5a7a');
    R(29, 16, 8, 1, '#e8a050'); R(31, 18, 5, 1, '#c88040'); R(32, 20, 3, 1, '#a86a3a');
    R(52, 4, 4, 12, '#e8e0d0'); R(52, 7, 4, 2, '#c8452e'); R(52, 11, 4, 2, '#c8452e'); R(51, 2, 6, 2, '#2a2a30'); R(53, 1, 2, 1, '#ffd890'); R(48, 15, 14, 2, '#2a2420');
    R(0, 13, 20, 2, '#141c2a'); R(4, 11, 3, 2, '#141c2a'); R(10, 10, 2, 3, '#141c2a'); R(14, 12, 4, 1, '#141c2a');
  }
};

// ---------- intro cinematic
const Intro = {
  i: 0, t: 0, el: null,
  start() {
    G.mode = 'intro'; this.i = 0; this.t = 0; Sound.music('mystery');
    const el = this.el = document.createElement('div'); el.className = 'cine';
    el.innerHTML = '<p></p><button class="skip">Skip ▸▸</button>'; $('#layer').appendChild(el);
    el.querySelector('.skip').onclick = e => { e.stopPropagation(); this.finish(); };
    el.addEventListener('click', () => this.adv());
    this.show();
  },
  show() { const p = this.el.querySelector('p'); p.style.opacity = 0; setTimeout(() => { p.textContent = INTRO_CARDS[this.i]; p.style.opacity = 1; }, 150); this.t = 0; },
  adv() { if (this.t < 0.4) return; this.i++; if (this.i >= INTRO_CARDS.length) this.finish(); else { Sound.play('blip'); this.show(); } },
  update(dt) { this.t += dt; if (Input.p('A')) this.adv(); if (Input.p('B') || Input.p('START')) this.finish(); if (this.t > 6) this.adv(); },
  finish() { if (G.mode !== 'intro') return; this.el.remove(); Sound.play('bell'); G.mode = 'world'; Fade.a = 1; Fade.dir = -1; Fade.sp = 0.8; Fade.busy = true; Sound.music('home'); Game.autosave(); }
};

// ---------- day end + outro
const DayEnd = {
  run() {
    G.mode = 'dayend'; Sound.music('mystery');
    const lines = [], t0 = G.trust0, desc = (id, nm, up, down, same) => { const d = (G.trust[id] || 0) - (t0[id] || 0); lines.push(d > 0 ? `${nm} ${up}` : d < 0 ? `${nm} ${down}` : `${nm} ${same}`); };
    lines.push(`Wages: 18 scrip${F('ateNoodles') ? ' (minus noodles, worth it)' : ''}`);
    desc('mara', 'Mara', 'trusts you a little more.', 'is watching you more carefully.', "hasn't forgiven herself. Or you.");
    if (F('metIvo')) desc('ivo', 'Ivo', 'feels closer to you.', 'is hurt.', 'is waiting for you to open up.');
    if (F('taviNight')) desc('tavi', 'Tavi', 'knows you\'ll tell the truth.', 'can tell when you lie.', 'is asleep before you finish your tea.');
    lines.push(`Journal: ${G.journal.length} entries`);
    const fu = G.flags.fury || 0; lines.push(fu >= 5 ? 'The ember in Kael burns white-hot now. People step out of his way.' : fu >= 3 ? 'The ember in Kael is burning. Mara has noticed. So has Vale.' : fu >= 1 ? 'Kael kept the ember banked. Mostly.' : 'Kael swallowed every insult today. He is keeping count.');
    if (F('bledAgain')) lines.push('You bled AUX-9 into the ward again, under Vale\'s nose. Forty kids breathe easier tonight. Vale wrote something down.');
    else if (F('nearlyCaught')) lines.push('You nearly got caught bleeding the line. Vale wrote something down.');
    if (F('sawRiser')) lines.push('You followed AUX-9 down, and felt their air falling from above.');
    lines.push(F('vowRise') ? 'Kael swore to climb their world.' : F('vowSeek') ? 'Kael swore to learn who sits at the top of the pipe.' : F('vowHeart') ? "Kael swore to close Seren's account." : 'Kael kept his head down. For now.');
    const choice = F('tookSlip') ? 'You kept the manifest slip.' : F('reportedCrate') ? 'You flagged the cold crate.' : '';
    // advance to day 2 morning, then save
    Object.assign(G.flags, { day1Done: 1 }); G.day = 2; G.trust0 = { ...G.trust };
    G.mapId = 'apt'; P.x = 3 * 16 + 8; P.y = 4 * 16 + 12; P.dir = 0;
    const ok = Save.write('auto');
    UI.push(modal({ title: 'End of Day 1', onBack: null, build(b) { b.innerHTML = lines.map(l => `<p>· ${esc(l)}</p>`).join('') + (choice ? `<p>· ${esc(choice)}</p>` : '') + `<p style="opacity:.7">${ok ? 'Progress saved.' : 'Progress kept for this session — export it from Save data to keep it.'}</p>`; },
      items: [{ label: 'Continue', act: () => { UI.pop(); DayEnd.outro(); } }] }));
  },
  outro() {
    UI.push(modal({ clear: true, onBack: null, build(b) {
      b.parentNode.style.textAlign = 'center'; b.parentNode.style.background = 'rgba(10,6,9,.9)';
      b.innerHTML = `<p>Far above Cinderwell — above the rock, above the warnings — a crate of cold greens arrives somewhere that doesn't exist.</p>
        <p>Below, Kael Brennick dreams of ${F('sawRiser') ? 'warm air falling from a pipe with no destination' : 'a lift light, green for eleven seconds'} — and of Seren, laughing at him for being right.</p>
        <p><i>"They came down in light. One day, I'm going up in it."</i></p>
        <h2 style="margin-top:16px">END OF THE FIRST SHIFT</h2><p style="opacity:.7">SOOTBORN · Book One vertical slice v0.3 · thanks for playing.</p>`;
    }, items: [
      { label: 'Keep exploring (Day 2)', act: () => { UI.clear(); Game.loadSave(Save.read('auto') || Save.snapshot()); } },
      { label: 'Back to title', act: () => { UI.clear(); Game.toTitle(); } }
    ] }));
  }
};
