// Starhaven — HUD, dialogue, story screens and menus (HTML over the canvas so text stays sharp on a phone).
(function (SH) {
  const $ = id => document.getElementById(id);
  const ST = SH.STORY;
  const H = {};
  let lastHearts = -1, lastPrompt = null, toastT = 0, cardDone = null;
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  H.hearts = function (n, max) {
    if (n === lastHearts) return;
    const el = $('hearts');
    let html = '';
    for (let i = 0; i < max; i++) html += `<span class="gem ${i < n ? 'full' : 'empty'}"></span>`;
    el.innerHTML = html;
    if (lastHearts > n) { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); }
    lastHearts = n;
  };

  // The GOAL line: chapter name + the one thing to do now. `fresh` makes it pulse (a new goal).
  // Moon pips (gift power) and the boss's health bar.
  let lastPips = '';
  H.pips = function (v, max) {
    const key = v.toFixed(2);
    if (key === lastPips) return; lastPips = key;
    let html = '';
    for (let i = 0; i < max; i++) html += `<span class="pip"><span style="height:${Math.round(Math.max(0, Math.min(1, v - i)) * 100)}%"></span></span>`;
    $('pips').innerHTML = html;
  };
  H.motes = function (n, total, pop) {
    const el = $('motes');
    el.style.display = total ? '' : 'none';
    el.innerHTML = `<i>&#10022;</i> ${n}<small> / ${total}</small>`;
    if (pop) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
  };
  H.boss = function (b) {
    const el = $('bossbar');
    if (!b || b.dead) { el.classList.remove('show'); return; }
    el.classList.add('show');
    el.querySelector('.bn').textContent = b.def.name;
    el.querySelector('.bb span').style.width = Math.max(0, b.hp / b.def.hp * 100) + '%';
  };

  H.goal = function (fresh) {
    const G = SH.game, ch = G.chapterDef();
    const text = G.goalText();
    $('goal').innerHTML = ch ? `<span class="ch">${esc(ch.label)}</span><span class="tag">GOAL</span> ${esc(text || 'Keep going')}` : '';
    if (fresh) { const el = $('goal'); el.classList.remove('new'); void el.offsetWidth; el.classList.add('new'); }
  };

  // Control hints (how to do the thing), shown near where you need them.
  H.prompt = function (html) {
    if (html === lastPrompt) return;
    lastPrompt = html;
    const el = $('sign');
    if (!html) { el.classList.remove('show'); return; }
    el.innerHTML = html;
    el.classList.add('show');
  };

  H.talkButton = function (label) {
    const b = $('b-talk');
    if (!label) { b.classList.remove('show'); return; }
    b.textContent = label; b.classList.add('show');
  };

  H.toast = function (text) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 3400);
  };

  // ---------------- dialogue box with a portrait
  H.dialog = function (who, text) {
    const el = $('dialog');
    if (!who) { el.classList.remove('show'); return; }
    const c = ST.CAST[who], narr = who === 'narr';
    el.classList.toggle('narr', narr);
    if (!narr) $('d-face').src = SH.art.portraitURL(who === 'wren' && SH.game.mortal ? 'wren_m' : who);
    $('d-name').textContent = c.name;
    $('d-name').style.color = c.color;
    el.classList.add('show');
    H.typeStart(text, narr);
  };

  // Lines type out letter by letter (Settings > Text speed). A tap or button press finishes the line first.
  const SPEED = { slow: 0.6, normal: 1.4, fast: 3, instant: 1e9 };
  let typed = 0, full = '', typingNarr = false, typeRAF = 0;
  H.typeStart = function (text, narr) {
    full = text; typed = 0; typingNarr = narr;
    cancelAnimationFrame(typeRAF);
    H.typeTick();
  };
  H.typeTick = function () {
    const before = Math.floor(typed);
    typed = Math.min(full.length, typed + (SPEED[SH.settings.textSpeed] || 1.4));
    $('d-text').textContent = full.slice(0, Math.floor(typed));
    if (!typingNarr && Math.floor(typed) > before && Math.floor(typed) % 3 === 0) SH.sfx.play('blip');
    $('dialog').classList.toggle('typing', typed < full.length);
    if (typed < full.length) typeRAF = requestAnimationFrame(H.typeTick);
  };
  H.typing = () => typed < full.length && $('dialog').classList.contains('show');
  H.finishTyping = function () { typed = full.length; $('d-text').textContent = full; $('dialog').classList.remove('typing'); cancelAnimationFrame(typeRAF); SH.game.talkWait = 4; };

  // A small "Saved" star in the corner when the game autosaves.
  let savedT = 0;
  H.saved = function () {
    const el = $('saving'); el.classList.add('show'); SH.sfx.play('save');
    clearTimeout(savedT); savedT = setTimeout(() => el.classList.remove('show'), 1600);
  };

  // ---------------- choices (under the last line of dialogue)
  let choiceSel = 0;
  H.choice = function (opts) {
    const box = $('d-choices');
    if (!opts) { box.innerHTML = ''; $('dialog').classList.remove('choosing'); return; }
    if (!$('dialog').classList.contains('show')) H.dialog('narr', 'What does Wren do?');
    choiceSel = 0;
    box.innerHTML = opts.map((t, i) => `<button class="choice${i === 0 ? ' sel' : ''}" data-i="${i}">${esc(t)}</button>`).join('');
    $('dialog').classList.add('choosing');
  };
  H.choiceMove = function (d) {
    const btns = [...$('d-choices').children];
    if (!btns.length) return;
    choiceSel = (choiceSel + d + btns.length) % btns.length;
    btns.forEach((b, i) => b.classList.toggle('sel', i === choiceSel));
  };
  H.choiceIndex = () => choiceSel;

  // ---------------- full-screen illustrated scenes behind the dialogue
  // Scenes animate: cinematics from cine.js, or a still panel with a slow push-in and drifting particles.
  let scene = null;
  H.sceneArt = function (id, title) {
    const el = $('scene');
    if (!id) { el.classList.remove('show'); scene = null; return; }
    const fresh = !scene;
    if (!scene || scene.id !== id) scene = { id, t: 0, cue: null };
    $('scene-title').textContent = title || '';
    el.classList.add('show');
    H.sceneDraw();
    if (fresh) requestAnimationFrame(H.sceneTick);
  };
  H.sceneCue = function (name) { if (scene) scene.cue = { name, start: scene.t }; };
  H.sceneTick = function () {
    if (!scene) return;
    scene.t++;
    H.sceneDraw();
    requestAnimationFrame(H.sceneTick);
  };
  H.sceneDraw = function () {
    if (!scene) return;
    const g = $('scene-art').getContext('2d');
    g.setTransform(3, 0, 0, 3, 0, 0);
    g.imageSmoothingEnabled = false;
    const cue = scene.cue ? { name: scene.cue.name, t: scene.t - scene.cue.start } : null;
    if (SH.cine.has(scene.id)) SH.cine[scene.id](g, scene.t, cue);
    else SH.cine.drawStatic(g, scene.id, scene.t);
    g.setTransform(1, 0, 0, 1, 0, 0);
  };
  H.sceneAdvance = function (n) { if (scene) { scene.t += n; H.sceneDraw(); } }; // tests and screenshots

  // ---------------- chapter cards (start and end of each chapter)
  H.card = function (o, done) {
    $('c-label').textContent = o.label;
    $('c-name').textContent = o.name;
    $('c-text').textContent = o.text;
    $('c-goals').innerHTML = o.goals ? '<div class="gl">Goals</div>' + o.goals.map(g => `<li>${esc(g)}</li>`).join('') : '';
    $('c-stats').innerHTML = o.stats ? o.stats.map(x => `<span>${esc(x)}</span>`).join('') : '';
    $('c-go').textContent = o.button;
    $('card').classList.add('show');
    cardDone = done;
  };
  H.cardGo = function () {
    if (!$('card').classList.contains('show')) return;
    $('card').classList.remove('show');
    const f = cardDone; cardDone = null;
    if (f) f();
  };

  // Touch buttons and labels follow what Wren can do this chapter.
  H.abilities = function () {
    const G = SH.game;
    $('b-dash').style.display = G.can('dash') ? '' : 'none';
    $('b-down').style.display = G.can('daggers') ? '' : 'none';
    $('b-attack').textContent = G.can('daggers') ? 'STRIKE' : 'SHOOT';
    $('b-gift').style.display = G.can('flame') ? 'flex' : 'none';
    $('pips').style.display = G.can('flame') ? 'flex' : 'none';
  };

  // Controller navigation for the HTML screens (pause menu, journal, tune, end): D-pad to choose, A to press.
  let navIdx = 0, navId = null;
  H.navButtons = id => [...document.querySelectorAll('#' + id + ' button.btn')].filter(b => b.offsetParent !== null);
  H.nav = function (id, d, press) {
    const btns = H.navButtons(id);
    if (!btns.length) return;
    if (navId !== id) { navId = id; navIdx = 0; }
    if (d) { navIdx = (navIdx + d + btns.length) % btns.length; SH.sfx.play('move'); }
    btns.forEach((b, i) => b.classList.toggle('pad-sel', i === navIdx));
    btns[navIdx].scrollIntoView({ block: 'nearest' });
    if (press) { SH.sfx.play('select'); btns[navIdx].click(); navId = null; }
  };
  H.navReset = () => { navId = null; document.querySelectorAll('.pad-sel').forEach(b => b.classList.remove('pad-sel')); };

  H.menu = function (show) { $('menu').classList.toggle('show', show); };

  // ---------------- journal: what to do now, the story so far, and who's who
  H.journal = function (show) {
    $('journal').classList.toggle('show', !!show);
    if (!show) return;
    const G = SH.game, ch = G.chapterDef();
    let html = `<h3>Now: ${esc(ch.label)}, ${esc(ch.name)}</h3><ul class="goals">`;
    for (const g of ch.goals) {
      const done = !!G.flags[g.id];
      html += `<li class="${done ? 'done' : g.id === G.activeGoal ? 'now' : ''}">${done ? '&#10003;' : g.id === G.activeGoal ? '&#9656;' : '&#9675;'} ${esc(g.text)}</li>`;
    }
    html += '</ul><h3>The story so far</h3>';
    html += `<p>${esc(ST.RECAP)}</p>`;
    for (let i = 0; i < G.chapter; i++) html += `<p><b>${esc(ST.CHAPTERS[i].label)}, ${esc(ST.CHAPTERS[i].name)}.</b> ${esc(ST.CHAPTERS[i].summary)}</p>`;
    html += `<p><b>${esc(ch.label)}, ${esc(ch.name)}.</b> ${esc(ch.card)}</p>`;
    const ms = G.progress.motes || {}, sum = Object.values(ms).reduce((a, b) => a + b, 0);
    if (sum) html += `<p><b>Starlight gathered:</b> &#10022; ${sum} (kept for rebuilding Starhaven, later)</p>`;
    html += '<h3>Bonds</h3>';
    const bonds = G.progress.bonds, ids = Object.keys(ST.BONDS).filter(id => bonds[id]);
    if (!ids.length) html += '<p>No bonds yet. Hearts grow from evenings together, gifts they love, and the choices you make when you talk.</p>';
    for (const id of ids) {
      const pts = bonds[id].pts, h = G.heartsFor(pts), next = ST.HEARTS_AT[h - 1];
      const prev = h > 1 ? ST.HEARTS_AT[h - 2] : 0, k = next ? Math.min(1, (pts - prev) / (next - prev)) : 1;
      html += `<div class="person bond"><img src="${SH.art.portraitURL(id)}" alt=""><div><b>${esc(ST.CAST[id].name)}</b> <span class="hearts">${'\u2665'.repeat(h)}<span class="dim">${'\u2661'.repeat(5 - h)}</span></span>
        <div class="bar"><span style="width:${Math.round(k * 100)}%"></span></div>
        <small>${next ? `${pts} / ${next} points to the next heart` : 'Every heart earned'} &middot; Loves: ${esc(ST.BONDS[id].loves)}</small></div></div>`;
    }
    html += '<h3>People</h3>';
    for (const p of G.knownPeople()) html += `<div class="person"><img src="${SH.STORY.CAST[p.id] ? SH.art.portraitURL(p.id) : ''}" alt="" ${SH.STORY.CAST[p.id] ? '' : 'style="visibility:hidden"'}><div><b>${esc(p.name)}</b><br>${esc(p.text)}</div></div>`;
    $('j-body').innerHTML = html;
  };

  H.end = function (show) {
    $('end').classList.toggle('show', show);
    if (show) { $('e-head').textContent = ST.END.title; $('e-text').textContent = ST.END.text; }
  };

  // ---------------- TUNE panel: live sliders for the movement numbers
  H.tune = function (show) {
    $('tune').classList.toggle('show', !!show);
    if (show) H.buildTune();
  };
  const fmtNum = (v, step) => step >= 1 ? String(Math.round(v)) : v.toFixed(step < 0.05 ? 2 : 1);
  H.buildTune = function () {
    const list = $('tune-list');
    list.innerHTML = '';
    for (const s of SH.TUNE_SLIDERS) {
      const row = document.createElement('label');
      row.className = 'trow';
      const val = SH.tune[s.key];
      row.innerHTML = `<span class="tl">${s.label}</span><input type="range" id="tune-${s.key}" min="${s.min}" max="${s.max}" step="${s.step}" value="${val}"><span class="tv">${fmtNum(val, s.step)}</span>`;
      const inp = row.querySelector('input'), out = row.querySelector('.tv');
      inp.addEventListener('input', () => {
        SH.tune[s.key] = parseFloat(inp.value);
        out.textContent = fmtNum(SH.tune[s.key], s.step);
        out.classList.toggle('changed', SH.tune[s.key] !== SH.TUNE_DEFAULTS[s.key]);
        H.saveTune();
      });
      out.classList.toggle('changed', val !== SH.TUNE_DEFAULTS[s.key]);
      list.appendChild(row);
    }
  };
  H.saveTune = function () {
    const diff = {};
    for (const k in SH.TUNE_DEFAULTS) if (SH.tune[k] !== SH.TUNE_DEFAULTS[k]) diff[k] = SH.tune[k];
    SH.store.set('starhaven.tune.v1', diff);
  };
  H.tuneText = function () {
    return 'Starhaven feel numbers\n' + SH.TUNE_SLIDERS.map(s => `${s.label}: ${fmtNum(SH.tune[s.key], s.step)}${SH.tune[s.key] !== SH.TUNE_DEFAULTS[s.key] ? ' (changed)' : ''}`).join('\n');
  };

  H.bind = function () {
    const G = SH.game, on = (id, f) => $(id).addEventListener('click', f);
    on('c-go', () => H.cardGo());
    on('d-skip', () => G.skipScene());
    // In a conversation, a tap anywhere goes to the next line.
    document.addEventListener('pointerdown', e => {
      if (G.state === 'talk' && G.talkWait <= 0 && !e.target.closest('button')) { e.preventDefault(); if (H.typing()) H.finishTyping(); else G.advance(); }
    });
    on('pause-btn', () => G.state === 'pause' ? G.resume() : G.pause());
    on('m-resume', () => G.resume());
    on('m-journal', () => { H.menu(false); H.journal(true); });
    on('m-tune', () => { H.menu(false); H.tune(true); });
    on('m-restart', () => { H.menu(false); G.startChapter(G.chapter); });
    on('m-controls', () => $('controls').classList.toggle('show'));
    on('m-title', () => { H.menu(false); SH.front.toTitle(); });
    const fs = $('m-fullscreen');
    if (document.documentElement.requestFullscreen) fs.addEventListener('click', () => { document.documentElement.requestFullscreen().catch(() => { }); G.resume(); });
    else fs.style.display = 'none';
    on('j-back', () => G.resume());
    on('t-back', () => { if (H.tuneBack) { const f = H.tuneBack; H.tuneBack = null; H.tune(false); f(); } else G.resume(); });
    on('t-reset', () => { SH.tune = Object.assign({}, SH.TUNE_DEFAULTS); H.saveTune(); H.buildTune(); });
    on('t-copy', () => {
      const text = H.tuneText(), btn = $('t-copy');
      const show = () => { $('t-out').value = text; $('t-out').style.display = 'block'; $('t-out').select(); };
      try {
        navigator.clipboard.writeText(text).then(() => { btn.textContent = 'Copied'; setTimeout(() => (btn.textContent = 'Copy numbers'), 1500); }, show);
      } catch (e) { show(); }
    });
    on('e-again', () => { H.end(false); SH.front.toTitle(); SH.front.slots('new'); });
    on('e-home', () => { H.end(false); SH.front.toTitle(); });
    SH.input.onSourceChange = src => { document.body.dataset.input = src; lastPrompt = null; };
    SH.input.onPad = () => H.toast('Controller connected: A jump, X strike, B dash, Y talk. Hold down + X in the air to strike down.');
    $('d-choices').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) G.pick(+b.dataset.i); });
    document.body.dataset.input = SH.input.source;
  };

  SH.game.hud = H;
})(window.SH = window.SH || {});
