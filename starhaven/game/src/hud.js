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
    el.classList.add('show'); document.body.classList.add('toasting');   // a toast takes the hint's place while it is up
    clearTimeout(toastT);
    toastT = setTimeout(() => { el.classList.remove('show'); document.body.classList.remove('toasting'); }, 4800);
  };

  // ---------------- dialogue box with a portrait
  H.dialog = function (who, text) {
    const el = $('dialog');
    if (!who) { el.classList.remove('show'); return; }
    const c = ST.CAST[who], narr = who === 'narr';
    el.classList.toggle('narr', narr);
    faceWho = narr ? null : (who === 'wren' && SH.game.mortal ? 'wren_m' : who); faceT = 0;
    if (!narr) $('d-face').src = SH.art.portraitURL(faceWho);
    $('d-name').textContent = c.name;
    $('d-name').style.color = c.color; el.style.setProperty('--spk', c.color);
    el.classList.add('show');
    H.typeStart(text, narr);
  };

  // Lines type out letter by letter (Settings > Text speed). A tap or button press finishes the line first.
  const SPEED = { slow: 0.5, normal: 0.9, fast: 2.2, instant: 1e9 };   // letters a frame: 'normal' is a reading pace, not a race
  let typed = 0, full = '', typingNarr = false, typeRAF = 0, faceWho = null, faceT = 0, faceNow = '';
  // Portraits move their mouths while a line types out, and blink.
  function faceSet(v) { if (!faceWho || faceNow === faceWho + v) return; faceNow = faceWho + v; $('d-face').src = SH.art.portraitURL(faceWho, v || undefined); }
  H.typeStart = function (text, narr) {
    full = text; typed = 0; typingNarr = narr;
    cancelAnimationFrame(typeRAF);
    H.typeTick();
  };
  H.typeTick = function () {
    const before = Math.floor(typed);
    typed = Math.min(full.length, typed + (SPEED[SH.settings.textSpeed] || 1.4) * (typingNarr ? 1.6 : 1));   // narration has no voice to keep pace with
    $('d-text').textContent = full.slice(0, Math.floor(typed));
    if (!typingNarr && Math.floor(typed) > before && Math.floor(typed) % 3 === 0) SH.sfx.play('blip');
    $('dialog').classList.toggle('typing', typed < full.length);
    faceT++; faceSet(typed >= full.length ? '' : faceT % 90 > 84 ? 'blink' : faceT % 12 < 6 && /[a-z]/i.test(full[Math.floor(typed) - 1] || '') ? 'talk' : '');
    if (typed < full.length) typeRAF = requestAnimationFrame(H.typeTick);
  };
  H.typing = () => typed < full.length && $('dialog').classList.contains('show');
  H.finishTyping = function () { faceSet(''); typed = full.length; $('d-text').textContent = full; $('dialog').classList.remove('typing'); cancelAnimationFrame(typeRAF); SH.game.talkWait = 4; };

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

  // What a decision did: a card per effect. Bond changes show the amount, the reason and the heart bar moving;
  // remembered decisions show a star (green if it was kind, red if it will cost her).
  H.effects = function (list) {
    const G = SH.game, box = $('effects');
    for (const e of list) {
      const row = document.createElement('div');
      if (e.mem) { row.className = 'fx-row mem'; row.innerHTML = `<span class="ico" style="color:${e.good === true ? '#7ad88a' : e.good === false ? '#ff7a8a' : 'var(--gold)'}">&#10022;</span><div><b>This will be remembered</b><small>${esc(e.mem)}</small></div>`; }
      else {
        if (!G.progress.bonds[e.who]) continue;
        const pts = G.progress.bonds[e.who].pts, h = G.heartsFor(pts), next = ST.HEARTS_AT[h - 1], prev = h > 1 ? ST.HEARTS_AT[h - 2] : 0;
        const k1 = next ? Math.max(0, Math.min(1, (pts - prev) / (next - prev))) : 1, k0 = e.heart ? 0 : next ? Math.max(0, Math.min(1, (pts - e.pts - prev) / (next - prev))) : 1;
        row.className = 'fx-row ' + (e.pts < 0 ? 'down' : 'up');
        row.innerHTML = `<img src="${SH.art.portraitURL(e.who)}" alt=""><div style="flex:1;min-width:0"><b>${esc(ST.CAST[e.who].name)} <i>${e.pts < 0 ? '&minus;' + (-e.pts) : '+' + e.pts} &hearts;</i>${e.heart ? ' &middot; heart ' + e.heart + ' of 5' : ''}</b><small>${esc(e.why)}</small><div class="hb"><span style="width:${Math.round(k0 * 100)}%"></span></div></div>`;
        const bar = row.querySelector('.hb span'); requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = Math.round(k1 * 100) + '%'; }));
      }
      box.appendChild(row); setTimeout(() => row.remove(), 7600);
    }
    while (box.children.length > 4) box.firstChild.remove();
  };

  H.xp = function () {
    const X = SH.xp, s = X.span(), el = $('lvl');
    el.firstChild.textContent = 'LV ' + X.level(); el.lastChild.firstChild.style.width = Math.round(s[0] / s[1] * 100) + '%';
  };
  // The bond meter, the Bond Art button, and whispers down the bond.
  let lastArt = '';
  H.art = function (a) {
    const on = a.active(), ready = a.ready(), key = on + '|' + ready + '|' + Math.round(a.meter) + '|' + a.nextKind() + '|' + !!a.cutin + '|' + !!a.band;
    if (key === lastArt) return; lastArt = key;
    document.body.classList.toggle('cutin', !!a.cutin); document.body.classList.toggle('banding', !!a.band);
    $('art').style.display = on ? 'block' : 'none';
    $('art').classList.toggle('ready', ready);
    $('art').firstChild.style.width = Math.round(a.meter / a.max * 100) + '%';
    $('b-art').style.display = ready ? 'flex' : 'none';
    $('b-art').innerHTML = a.ARTS[a.nextKind()].name.replace(' ', '<br>');
  };
  H.whisper = function (who, text) {
    const el = $('whisper');
    if (!who) { el.classList.remove('show'); return; }
    $('w-face').src = SH.art.portraitURL(who); $('w-name').textContent = who === 'wren' ? 'Wren' : ST.CAST[who].name + ', down the bond';
    $('w-name').style.color = ST.CAST[who].color; $('w-text').textContent = text;
    el.classList.add('show');
  };
  // Wren's Constellation: spend Starlight on stars.
  H.stars = function (show) {
    $('stars').classList.toggle('show', !!show);
    if (!show) return;
    const S = SH.stars;
    $('st-have').innerHTML = `&#10022; <b>${S.free()}</b> Starlight to spend (${S.gathered()} gathered). Starlight is the gold motes in every level; replay a chapter to find more.`;
    let html = '';
    for (const d of S.DEFS) {
      const lv = S.level(d.id), max = d.costs.length, locked = S.locked(d);
      html += `<div class="star-row"><span class="pipsrow">${'&#9733;'.repeat(lv)}${'&#9734;'.repeat(max - lv)}</span><div><b>${esc(d.name)}</b><small>${locked ? 'Sleeping until the Flame wakes.' : esc(d.text)}</small></div>`
        + (lv >= max ? '<span class="dim">Lit</span>' : `<button class="btn" data-star="${d.id}" ${S.canBuy(d) ? '' : 'disabled'}>&#10022; ${S.cost(d)}</button>`) + '</div>';
    }
    $('st-body').innerHTML = html;
    $('st-body').querySelectorAll('button[data-star]').forEach(b => b.addEventListener('click', () => { if (S.buy(b.dataset.star)) { H.hearts(SH.game.world.player.hearts, SH.game.world.player.maxHearts); H.stars(true); } }));
  };

  // Touch buttons and labels follow what Wren can do this chapter.
  H.abilities = function () {
    const G = SH.game;
    $('b-dash').style.display = G.can('dash') ? '' : 'none';
    $('b-down').style.display = G.can('daggers') ? '' : 'none';
    $('b-up').style.display = G.can('daggers') ? '' : 'none';
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

  H.menu = function (show) {
    $('menu').classList.toggle('show', show);
    if (!show) return;
    const G = SH.game, ch = G.chapterDef(), w = G.world, bonds = G.progress.bonds || {};
    const people = Object.keys(ST.BONDS).filter(id => bonds[id]).map(id => `<span style="white-space:nowrap;margin-right:8px"><img src="${SH.art.portraitURL(id)}" alt="">${'\u2665'.repeat(G.heartsFor(bonds[id].pts))}</span>`).join('');
    const mem = Object.keys(G.progress.mem || {}).length;
    $('m-status').innerHTML = `<div class="wide"><b>${esc(ch.label)}: ${esc(ch.name)}</b>${esc(G.goalText() || 'Keep going')}</div>`
      + `<div><b>Starlight here</b>&#10022; ${w.motes.filter(m => m.got).length} of ${w.motes.length} &middot; ${SH.stars.free()} to spend</div>`
      + `<div><b>Choices remembered</b>${mem || 'None yet'}</div>`
      + `<div class="wide"><b>Level ${SH.xp.level()}${SH.xp.level() < SH.xp.max() ? ' &middot; ' + SH.xp.span()[0] + ' / ' + SH.xp.span()[1] + ' XP to level ' + (SH.xp.level() + 1) + ': ' + esc(SH.xp.PERKS[SH.xp.level() + 1].name) : ' &middot; highest for now'}</b>${SH.xp.PERKS.slice(2, SH.xp.level() + 1).map(k => esc(k.name)).join(', ') || 'No perks yet. Fight, hunt, gather and help to earn them.'}</div>`
      + (people ? `<div class="wide"><b>Bonds</b>${people}</div>` : '');
    { const n = G.loreNew(); $('m-journal').textContent = "Wren's journal" + (n ? ` (${n} new ${n === 1 ? 'page' : 'pages'})` : ''); }
  };

  // ---------------- journal: what to do now, the story so far, and who's who
  let jTab = 'now';
  H.journal = function (show, tab) {
    $('journal').classList.toggle('show', !!show);
    if (!show) return;
    const G = SH.game, ch = G.chapterDef();
    G.loreCheck(true);
    if (tab) jTab = tab;
    const fresh = G.loreNew();
    const tabs = [['now', 'Today'], ['bonds', 'Bonds'], ['pages', 'Pages' + (fresh ? ` \u2022${fresh}` : '')], ['people', 'People']];
    $('j-tabs').innerHTML = tabs.map(t => `<button class="btn jtab${t[0] === jTab ? ' on' : ''}" data-tab="${t[0]}">${t[1]}</button>`).join('');
    $('j-tabs').querySelectorAll('button').forEach(b => { b.onclick = () => { SH.sfx.play('move'); H.journal(true, b.dataset.tab); }; });
    let html = '';
    if (jTab === 'now') {
      html += `<h3>Now: ${esc(ch.label)}, ${esc(ch.name)}</h3><ul class="goals">`;
      for (const g of ch.goals) {
        const done = !!G.flags[g.id];
        html += `<li class="${done ? 'done' : g.id === G.activeGoal ? 'now' : ''}">${done ? '&#10003;' : g.id === G.activeGoal ? '&#9656;' : '&#9675;'} ${esc(g.text)}</li>`;
      }
      html += '</ul><h3>What I am working toward</h3>';
      html += '<p>Keep Starhaven standing through a war between two courts, and be ready for the Iron King when he uses it. I cannot do that alone. Every heart someone gives me is a blade, a shield or a truth I will need before the end. The Bonds tab says exactly what each one gives.</p><ul class="goals road">';
      ST.CHAPTERS.forEach((c, i) => { html += `<li class="${i < G.chapter ? 'done' : i === G.chapter ? 'now' : ''}">${i < G.chapter ? '&#10003;' : i === G.chapter ? '&#9656;' : '&#9675;'} ${esc(c.label)}: ${esc(c.name)}</li>`; });
      html += '<li>&#9675; Still ahead: the spy in the Library, Starfall, my sisters, the siege.</li></ul>';
      html += '<h3>How I got here</h3>';
      html += `<p>${esc(ST.RECAP)}</p>`;
      for (let i = 0; i < G.chapter; i++) html += `<p><b>${esc(ST.CHAPTERS[i].label)}, ${esc(ST.CHAPTERS[i].name)}.</b> ${esc(ST.CHAPTERS[i].summary)}</p>`;
      html += `<p><b>${esc(ch.label)}, ${esc(ch.name)}.</b> ${esc(ch.card)}</p>`;
      const ms = G.progress.motes || {}, sum = Object.values(ms).reduce((a, b) => a + b, 0);
      if (sum) html += `<p><b>Starlight gathered:</b> &#10022; ${sum}. Spend it in the pause menu, under Constellation.</p>`;
      const mem = Object.values(G.progress.mem || {});
      if (mem.length) { html += '<h3>Things I did</h3><ul class="mem-list">' + mem.map(m => `<li class="${m.good === true ? 'good' : m.good === false ? 'bad' : ''}">${esc(m.text)}</li>`).join('') + '</ul><p><small>Green: someone is better for it. Red: it will cost her. Gold: it could go either way. The story comes back to these, and some write a page of their own.</small></p>'; }
    } else if (jTab === 'bonds') {
      html += '<h3>The people I am tied to</h3>';
      html += '<p>What I say and do moves people toward me or away. Every heart does three things: it plays a scene, it gives me something real in a fight, and it writes a page here. Further on, the hearts decide who stands with me at the end.</p>';
      const bonds = G.progress.bonds, ids = Object.keys(ST.BONDS).filter(id => bonds[id]);
      if (!ids.length) html += '<p>No bonds yet. They grow from the choices I make when I talk, the errands I run, and the evenings I spend.</p>';
      for (const id of ids) {
        const pts = bonds[id].pts, h = G.heartsFor(pts), next = ST.HEARTS_AT[h - 1];
        const prev = h > 1 ? ST.HEARTS_AT[h - 2] : 0, k = next ? Math.min(1, (pts - prev) / (next - prev)) : 1, path = ST.BOND_PATH[id];
        const nextStep = path.steps.find(x => x.h > h);
        html += `<div class="person bond"><img src="${SH.art.portraitURL(id)}" alt=""><div><b>${esc(ST.CAST[id].name)}</b> <span class="hearts">${'♥'.repeat(h)}<span class="dim">${'♡'.repeat(5 - h)}</span></span>
          <div class="bar"><span style="width:${Math.round(k * 100)}%"></span></div>
          <small>${next ? `${pts} / ${next} to the next heart` : 'Every heart earned'} &middot; Loves: ${esc(ST.BONDS[id].loves)}</small>
          <p class="toward"><b>Heading toward:</b> ${esc(path.toward)}</p>
          <ul class="ladder">${path.steps.map(x => `<li class="${h >= x.h ? 'got' : x === nextStep ? 'next' : 'far'}">${h >= x.h ? '&#10003;' : '&#9825;'} <b>Heart ${x.h}: ${esc(x.name)}.</b> ${esc(x.text)}${h >= x.h && x.now ? ' <i>Active now.</i>' : ''}</li>`).join('')}</ul></div></div>`;
      }
    } else if (jTab === 'pages') {
      const lore = G.progress.lore || {}, have = ST.LORE.filter(l => lore[l.id]).length;
      html += `<h3>What I have learned</h3><p>${have} of ${ST.LORE.length} pages written. Pages are written as I see more of the world, grow closer to people, and make choices that matter.</p>`;
      ST.LORE_PARTS.forEach((part, pi) => {
        const list = ST.LORE.filter(l => l.part === pi);
        const open = list.filter(l => lore[l.id]), shut = list.filter(l => !lore[l.id]);
        if (pi === 4 && !open.length) return;
        html += `<h3>${esc(part)}</h3>`;
        for (const l of open) html += `<div class="page${lore[l.id] === 1 ? ' new' : ''}"><b>${esc(l.title)}</b>${lore[l.id] === 1 ? ' <i>new</i>' : ''}<p>${esc(l.text)}</p></div>`;
        if (pi === 4) { if (shut.length) html += `<div class="page blank"><p>${shut.length} more ${shut.length === 1 ? 'page' : 'pages'} here for choices I have not made.</p></div>`; }
        else for (const l of shut) html += `<div class="page blank"><p>A blank page. ${esc(l.hint)}</p></div>`;
      });
      for (const k in lore) lore[k] = 2;
      G.save();
    } else {
      html += '<h3>Who is who</h3>';
      for (const p of G.knownPeople()) html += `<div class="person"><img src="${SH.STORY.CAST[p.id] ? SH.art.portraitURL(p.id) : ''}" alt="" ${SH.STORY.CAST[p.id] ? '' : 'style="visibility:hidden"'}><div><b>${esc(p.name)}</b><br>${esc(p.text)}</div></div>`;
    }
    $('j-body').innerHTML = html;
    $('journal').querySelector('.card').scrollTop = 0;
  };

  H.end = function (show) {
    $('end').classList.toggle('show', show);
    if (show) {
      const G = SH.game, bonds = G.progress.bonds || {}, lore = G.progress.lore || {};
      $('e-head').textContent = ST.END.title; $('e-text').textContent = ST.END.text;
      const who = Object.keys(ST.BONDS).filter(id => bonds[id]).map(id => { const h = G.heartsFor(bonds[id].pts), st = ST.BOND_PATH[id].steps.filter(x => x.h <= h && x.now).pop(); return `<li><b>${esc(ST.CAST[id].name)}</b> ${'\u2665'.repeat(h)}${st ? ': ' + esc(st.name) : ''}</li>`; }).join('');
      $('e-sum').innerHTML = `<p><b>Where Wren stands</b></p><ul>${who}</ul><p>${Object.keys(lore).length} of ${ST.LORE.length} journal pages written &middot; ${Object.keys(G.progress.mem || {}).length} choices remembered. A different Wren fills different pages.</p>`;
    }
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
    on('m-stars', () => { H.menu(false); H.stars(true); });
    on('m-howto', () => { H.menu(false); $('howto').classList.add('show'); $('hw-body').innerHTML = Object.values(ST.EXPLAIN).map(e => `<div class="hw-row"><span>${e.icon}</span><div><b>${esc(e.title)}</b><small>${esc(e.text)}</small></div></div>`).join(''); });
    on('hw-back', () => { $('howto').classList.remove('show'); H.menu(true); });
    on('ex-ok', () => SH.game.explainClose());
    on('st-back', () => { H.stars(false); H.menu(true); });
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
