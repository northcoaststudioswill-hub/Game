// Starhaven — boot and menus: studio splashes, "press any button", main menu, save slots, settings, credits.
// Every menu works with a controller (D-pad/stick + A, B to go back), a keyboard, or touch.
(function (SH) {
  const $ = id => document.getElementById(id);
  const F = SH.front = {};
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  let phase = null, menu = null, timer = 0;

  // The studio marks, drawn inline (no files).
  F.NCS_MARK = `<svg viewBox="0 0 120 80" aria-hidden="true"><defs><linearGradient id="ncsg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff6d8"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs>
    <path d="M60 4 L64 26 L84 30 L64 34 L60 56 L56 34 L36 30 L56 26 Z" fill="url(#ncsg)"/>
    <path d="M8 62 Q24 52 40 62 T72 62 T104 62 T120 60" stroke="#9fd0ff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M0 74 Q16 64 32 74 T64 74 T96 74 T120 72" stroke="#5a8ad8" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  F.E_MARK = `<svg viewBox="0 0 80 80" aria-hidden="true"><defs><linearGradient id="eg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#4ad8c8"/><stop offset="1" stop-color="#9a6aff"/></linearGradient></defs>
    <rect x="4" y="4" width="72" height="72" rx="18" fill="none" stroke="url(#eg)" stroke-width="5"/>
    <path d="M26 20 H56 M26 40 H50 M26 60 H56 M26 20 V60" stroke="url(#eg)" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`;

  // ---------------------------------------------------------------- boot
  F.boot = function () {
    SH.game.state = 'front';
    $('front').classList.add('show');
    try { window.focus(); } catch (e) { /* inside a frame: fine */ }
    F.splash('ncs');
  };
  F.splash = function (which) {
    phase = which;
    const el = $('splash');
    el.className = ''; void el.offsetWidth;   // restart the fade for each splash
    el.className = 'show ' + which;
    $('f-menu-wrap').classList.remove('show');
    $('f-press').classList.remove('show');
    el.innerHTML = which === 'ncs'
      ? `<div class="mark ncs">${F.NCS_MARK}</div><div class="word">NORTH COAST</div><div class="word2">STUDIOS</div>`
      : `<div class="mark e">${F.E_MARK}</div><div class="word">E CONCEPTS</div>`;
    clearTimeout(timer);
    timer = setTimeout(F.next, which === 'ncs' ? 2600 : 2200);
  };
  F.next = function () {
    clearTimeout(timer);
    if (phase === 'ncs') F.splash('econ');
    else if (phase === 'econ') F.press();
    else if (phase === 'press') { SH.sfx.play('select'); F.main(); }
  };
  F.press = function () {
    phase = 'press';
    $('splash').className = '';
    $('f-logo').classList.add('show');
    $('f-press').classList.add('show');
  };

  // ---------------------------------------------------------------- menus
  F.show = function (title, items, back, note, noteFirst) {
    $('f-menu-wrap').classList.toggle('note-first', !!noteFirst);
    phase = 'menu';
    $('f-logo').classList.toggle('show', !title);
    $('f-press').classList.remove('show');
    $('f-menu-wrap').classList.add('show');
    $('f-title').textContent = title || '';
    $('f-note').innerHTML = note || '';
    menu = { items, back, sel: Math.max(0, items.findIndex(i => !i.disabled)) };
    F.render();
  };
  F.render = function () {
    $('f-menu').innerHTML = menu.items.map((it, i) => {
      const v = it.value ? `<span class="val">&#9666; ${esc(it.value())} &#9656;</span>` : '';
      const sub = it.sub ? `<span class="sub">${it.sub}</span>` : '';
      return `<button class="fbtn${i === menu.sel ? ' sel' : ''}${it.disabled ? ' off' : ''}${it.danger ? ' danger' : ''}" data-i="${i}" ${it.disabled ? 'aria-disabled="true"' : ''}><span class="lbl">${esc(it.label)}</span>${v}${sub}</button>`;
    }).join('');
    const sel = $('f-menu').querySelector('.sel');
    if (sel && sel.scrollIntoView) sel.scrollIntoView({ block: 'nearest' });
  };
  F.move = function (d) {
    if (!menu) return;
    let i = menu.sel;
    for (let k = 0; k < menu.items.length; k++) { i = (i + d + menu.items.length) % menu.items.length; if (!menu.items[i].disabled) break; }
    if (i !== menu.sel) { menu.sel = i; SH.sfx.play('move'); F.render(); }
  };
  F.choose = function (i) {
    const it = menu && menu.items[i == null ? menu.sel : i];
    if (!it || it.disabled) return;
    if (it.value && !it.action) { it.right(); SH.sfx.play('move'); F.render(); return; }
    SH.sfx.play('select');
    it.action();
  };
  F.adjust = function (d) {
    const it = menu && menu.items[menu.sel];
    if (it && it.value) { (d > 0 ? it.right : it.left)(); SH.sfx.play('move'); F.render(); }
  };
  F.back = function () { if (menu && menu.back) { SH.sfx.play('back'); menu.back(); } };

  // Controller / keyboard, called every frame while the front end is up.
  F.input = function (input) {
    const any = ['jump', 'attack', 'dash', 'pause', 'up', 'down', 'left', 'right'].some(a => input.take(a));
    if (phase === 'ncs' || phase === 'econ' || phase === 'press') { if (any) F.next(); return; }
  };
  F.menuInput = function (input) {
    if (phase !== 'menu') return F.input(input);
    if (input.take('up')) F.move(-1);
    else if (input.take('down')) F.move(1);
    else if (input.take('left')) F.adjust(-1);
    else if (input.take('right')) F.adjust(1);
    else if (input.take('jump') || input.take('attack')) F.choose();
    else if (input.take('dash') || input.take('pause')) F.back();
  };

  // ---------------------------------------------------------------- the screens
  F.main = function () {
    const S = SH.saves, latest = S.latest(), slots = S.all(), any = slots.some(Boolean);
    const items = [];
    if (latest >= 0) { const d = S.describe(slots[latest]); items.push({ label: 'Continue', sub: `Slot ${latest + 1} &middot; ${esc(d.title)}`, action: () => F.go(() => SH.game.loadSlot(latest)) }); }
    items.push({ label: 'New game', action: () => F.slots('new') });
    items.push({ label: 'Load game', disabled: !any, action: () => F.slots('load') });
    items.push({ label: 'Chapter select', sub: 'Any chapter, without saving (concept build)', action: F.chapters });
    items.push({ label: 'Settings', action: () => F.settings(F.main) });
    items.push({ label: 'Credits', action: F.credits });
    F.show(null, items, null);
  };
  F.slots = function (mode) {
    const S = SH.saves, slots = S.all();
    const items = slots.map((s, i) => {
      const d = S.describe(s);
      const sub = d ? `${esc(d.title)} &middot; ${d.time} played${d.caelum ? ` &middot; Caelum ${'&#9829;'.repeat(d.caelum)}` : ''}${d.when ? ` &middot; ${esc(d.when)}` : ''}` : 'Empty';
      return {
        label: `Slot ${i + 1}`, sub, disabled: mode === 'load' && !s,
        action: () => {
          if (mode === 'load') return F.go(() => SH.game.loadSlot(i));
          if (!s) return F.go(() => SH.game.newGame(i));
          F.confirm(`Start a new game in slot ${i + 1}? The save there will be replaced.`, () => F.go(() => SH.game.newGame(i)), () => F.slots(mode));
        },
      };
    });
    if (mode === 'load') slots.forEach((s, i) => { if (s) items.push({ label: `Erase slot ${i + 1}`, danger: true, action: () => F.confirm(`Erase slot ${i + 1}? This can't be undone.`, () => { S.erase(i); F.slots('load'); }, () => F.slots('load')) }); });
    items.push({ label: 'Back', action: F.main });
    F.show(mode === 'new' ? 'New game: pick a slot' : 'Load game', items, F.main);
  };
  F.confirm = function (text, yes, no) {
    F.show('Are you sure?', [{ label: 'Yes', danger: true, action: yes }, { label: 'No', action: no }], no, esc(text));
    menu.sel = 1; F.render();
  };
  F.chapters = function () {
    const items = SH.STORY.CHAPTERS.map((c, i) => ({ label: `${c.label}: ${c.name}`, action: () => F.go(() => SH.game.playChapter(i)) }));
    items.push({ label: 'Back', action: F.main });
    F.show('Chapter select', items, F.main, 'Plays any chapter on its own. Nothing is saved.');
  };
  F.settings = function (back) {
    const s = SH.settings, save = () => { SH.store.set('starhaven.settings.v1', s); SH.sfx.volume(); };
    const speeds = ['slow', 'normal', 'fast', 'instant'];
    const cycle = (k, list, d) => { s[k] = list[(list.indexOf(s[k]) + d + list.length) % list.length]; save(); };
    const flip = k => { s[k] = !s[k]; save(); };
    const items = [
      { label: 'Sound effects', value: () => s.sfx ? `${s.sfx}%` : 'Off', left: () => { s.sfx = Math.max(0, s.sfx - 10); save(); }, right: () => { s.sfx = Math.min(100, s.sfx + 10); save(); SH.sfx.play('select'); } },
      { label: 'Music', value: () => s.music ? `${s.music}%` : 'Off', left: () => { s.music = Math.max(0, s.music - 10); save(); }, right: () => { s.music = Math.min(100, s.music + 10); save(); } },
      { label: 'Text speed', value: () => s.textSpeed[0].toUpperCase() + s.textSpeed.slice(1), left: () => cycle('textSpeed', speeds, -1), right: () => cycle('textSpeed', speeds, 1) },
      { label: 'Touch: strike down for me', value: () => s.autoDown ? 'On' : 'Off', left: () => flip('autoDown'), right: () => flip('autoDown') },
      { label: 'Screen shake', value: () => s.shake ? 'On' : 'Off', left: () => flip('shake'), right: () => flip('shake') },
      { label: 'Tune the movement feel', action: () => { $('front').classList.remove('show'); SH.game.hud.tune(true); SH.game.hud.tuneBack = () => { $('front').classList.add('show'); F.settings(back); }; } },
      { label: 'Back', action: back },
    ];
    F.show('Settings', items, back, 'Left and right change a setting. The music is a placeholder until Will\'s own tracks go in.');
  };
  F.credits = function () {
    F.show('Credits', [{ label: 'Back', action: F.main }], F.main, `
      <div class="credits">
        <div class="cmark">${F.NCS_MARK}</div>
        <p><b>STARHAVEN</b><br>A North Coast Studios game<br>with E Concepts</p>
        <p><b>Created and directed by</b><br>Will, North Coast Studios</p>
        <p><b>Design, story and code</b><br>Built with Claude from Will's design doc</p>
        <p><b>Art and sound</b><br>Placeholder, made in code, until the real art and music arrive</p>
        <p class="dim">Concept build. Prologue through Chapter 3.</p>
      </div>`, true);
  };

  // Leave the menus and start playing.
  F.go = function (start) {
    phase = null; menu = null;
    $('front').classList.remove('show');
    start();
  };
  // Back to the title from the game.
  F.toTitle = function () {
    SH.game.state = 'front';
    $('front').classList.add('show');
    F.main();
  };

  F.bind = function () {
    $('f-menu').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i; if (menu) { menu.sel = i; F.choose(i); } });
    $('f-menu').addEventListener('pointermove', e => { const b = e.target.closest('[data-i]'); if (b && menu && +b.dataset.i !== menu.sel && !menu.items[+b.dataset.i].disabled && e.pointerType === 'mouse') { menu.sel = +b.dataset.i; F.render(); } });
    $('front').addEventListener('click', e => { if (phase !== 'menu') F.next(); });
  };
})(window.SH = window.SH || {});
