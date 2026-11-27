'use strict';
/* GODMODE.EXE: the HUD, menus, tutorial and dialogs. Reads the sim; acts through main.js. */

const $ = id => document.getElementById(id);
const UI = { tickT: 0, tickerT: 0, hintT: 0, bannerT: 0, lastSub: '', inspectB: 0, tutShown: -2 };

const CREATE_ITEMS = [
  { k: 'citizen', name: 'Citizen', cost: COST.citizen },
  { k: 'grove', name: 'Grove', cost: COST.grove },
  { k: 'rock', name: 'Rocks', cost: COST.rock },
  { k: 'hut', name: 'Hut', cost: COST.blueprint },
  { k: 'farm', name: 'Farm', cost: COST.blueprint },
  { k: 'shrine', name: 'Shrine', cost: COST.blueprint },
  { k: 'lab', name: 'Terminal', cost: COST.blueprint },
  { k: 'spire', name: 'Spire', cost: 0 }
];
const HINTS = {
  observe: '',
  bless: 'Bless: tap near citizens, trees or crops',
  smite: 'Smite: tap a citizen, building, rock or tree',
  create: 'Create: choose, then tap the ground',
  inspire: 'Inspire: choose an idea, then tap a citizen',
  intervene: 'Intervene: drag a citizen and drop them'
};
const TUT = [
  { t: 'LOOK AROUND', h: '<b>Drag</b> to orbit the island. <b>Pinch</b> (or scroll) to zoom. Two fingers pan.', done: () => APP.camMoved > 130 },
  { t: 'OBSERVE', h: 'Those are your citizens. <b>Tap one</b> to read its mind: needs, beliefs, and what it is doing and why.', done: S => S.stats.observe > 0 },
  { t: 'BLESS', h: 'Pick <b>BLESS</b> below, then tap near some citizens. Fed, happy, and a little more devout.', done: S => S.stats.bless > 0 },
  { t: 'INTERVENE', h: 'Pick <b>INTERVENE</b>, then <b>drag a citizen</b> into the air. Drop them on a tree, a rock or a friend and they take the hint.', done: S => S.stats.intervene > 0 },
  { t: 'CREATE', h: 'Pick <b>CREATE</b>, choose something, tap the ground. Blueprints get built once the citizens have materials.', done: S => S.stats.create > 0 },
  { t: 'INSPIRE', h: 'Pick <b>INSPIRE</b>, choose an idea, tap a citizen. They will preach it, and ideas spread whenever citizens talk. Watch the hats.', done: S => S.stats.inspire > 0 },
  { t: 'SMITE', h: '<b>SMITE</b> is lightning. It kills, flattens, and shatters rocks into instant stone. Witnesses learn Dread. Entirely optional.', done: S => S.stats.smite > 0, soft: true },
  { t: 'YOUR JOB', h: 'Powers cost <b>CYCLES</b> (the bar above the powers). The coloured strip up top shows what the island believes. Follow the <b>amber objective</b>. Good luck, GODMODE.', done: () => false, last: true }
];

function initUI() {
  $('btnMenu').onclick = () => { sfx('click'); openMenu(); };
  $('btnSpeed').onclick = () => { sfx('click'); setSpeed(APP.speed === 1 ? 2 : APP.speed === 2 ? 4 : 1); };
  $('pw').querySelectorAll('button').forEach(b => { b.onclick = () => { auInit(); sfx('click'); setPower(b.dataset.p === APP.power && b.dataset.p !== 'observe' ? 'observe' : b.dataset.p); }; });
  $('inClose').onclick = () => { sfx('click'); selectCitizen(0); UI.inspectB = 0; };
  $('inLife').onclick = () => { sfx('click'); if (APP.S.selected) openLife(APP.S.selected); };
  $('lfClose').onclick = () => { sfx('click'); closeLife(); };
  $('lfTabs').querySelectorAll('button').forEach(b => { b.onclick = () => { sfx('click'); UI.lifeTab = b.dataset.t; UI.lifePick = ''; renderLife(); }; });
  $('mGoal').onclick = () => {
    const S = APP.S; if (!S || S.sandbox) return;
    S.goal = !S.goal; sfx('click'); refreshMenu();
    logMsg(S, S.goal ? 'GOAL SET: the path to the Spire is back on.' : 'GOAL CLEARED: no objectives. The island simply goes on.', 'sys');
  };
  $('inFollow').onclick = () => { sfx('click'); R.cam.follow = R.cam.follow ? 0 : APP.S.selected; };
  $('tutNext').onclick = () => { sfx('click'); tutAdvance(); };
  $('tutSkip').onclick = () => { sfx('click'); APP.tut = -1; saveSettings(); };

  $('btnNew').onclick = () => {
    auInit(); sfx('click');
    const pick = () => showDlg('WHAT KIND OF WORLD?',
      '<span class="big">ENDLESS</span>No goal. The island runs forever: people grow old, die, and their children carry on. The Spire becomes something you can build when they know enough, if you ever want to.\n\n<span class="big">WITH A GOAL</span>A path of objectives that ends in the Spire and the Singularity. After that the island keeps running.\n\n<span class="sys">You can switch between them any time from the pause menu.</span>',
      [{ label: 'Endless', fn: () => startGame(true, false) }, { label: 'With a goal', fn: () => startGame(true, true) }]);
    if (APP.hasSave) confirmDlg('NEW WORLD', 'This erases the saved island and starts again with six new minds.', 'Erase and start', pick);
    else pick();
  };
  $('btnContinue').onclick = () => { auInit(); sfx('click'); startGame(false); };
  $('btnHow').onclick = () => { auInit(); sfx('click'); openMenu('help'); };

  $('menuClose').onclick = $('mResume').onclick = () => { sfx('click'); closeMenu(); };
  $('menuBack').onclick = () => { sfx('click'); if (APP.mode === 'title') closeMenu(); else menuView('main'); };
  $('mSpeed').querySelectorAll('button').forEach(b => { b.onclick = () => { sfx('click'); setSpeed(+b.dataset.s); }; });
  $('mSound').onclick = () => { APP.settings.sound = !APP.settings.sound; saveSettings(); refreshMenu(); sfx('click'); };
  $('mGfx').onclick = () => { APP.settings.retro = !APP.settings.retro; R.retro = APP.settings.retro; resizeRender(); saveSettings(); refreshMenu(); sfx('click'); };
  $('mFree').onclick = () => { APP.S.freeCycles = !APP.S.freeCycles; refreshMenu(); sfx('click'); };
  $('mHelp').onclick = () => { sfx('click'); menuView('help'); };
  $('mLog').onclick = () => { sfx('click'); menuView('log'); };
  $('mSave').onclick = () => { sfx('click'); const ok = saveGame(); $('mSave').textContent = ok ? 'Saved' : 'Cannot save here'; };
  $('mTitle').onclick = () => { sfx('click'); saveGame(); closeMenu(); showTitle(); };
  $('mReset').onclick = () => { sfx('click'); confirmDlg('ERASE AND RESTART', 'Delete this island and everyone on it, and begin again?', 'Erase', () => { closeMenu(); startGame(true); }); };
}

/* ------------------------------------------------------------ HUD refresh */

function setW(el, f) { el.style.width = (clamp(f, 0, 1) * 100).toFixed(1) + '%'; }

function updateUI(S, dt) {
  // timers run every frame, DOM writes a few times a second
  if (UI.tickerT > 0) { UI.tickerT -= dt; if (UI.tickerT <= 0) $('ticker').classList.remove('show'); }
  if (UI.bannerT > 0) { UI.bannerT -= dt; if (UI.bannerT <= 0) $('banner').classList.remove('show'); }
  if (UI.hintT > 0) { UI.hintT -= dt; if (UI.hintT <= 0) refreshHint(); }
  UI.tickT -= dt;
  if (UI.tickT > 0) return;
  UI.tickT = 0.18;

  const pop = S.citizens.length;
  $('rFood').textContent = S.res.food | 0; $('rWood').textContent = S.res.wood | 0;
  $('rStone').textContent = S.res.stone | 0; $('rInsight').textContent = S.res.insight | 0;
  $('rPop').textContent = pop + '/' + popCap(S);
  $('cFood').classList.toggle('low', S.res.food < pop * 0.5);
  setW($('cycFill'), S.cycles / S.cyclesMax);
  $('cycNum').textContent = S.freeCycles ? 'UNLIMITED' : (S.cycles | 0) + ' / ' + S.cyclesMax;
  for (let k = 0; k < 4; k++) $('z' + k).style.width = (pop ? S.counts[k] / pop * 100 : 0).toFixed(1) + '%';
  const zl = $('zlabel');
  if (S.age >= 0) { zl.textContent = 'AGE OF ' + BELIEFS[S.age].name; zl.style.color = BELIEFS[S.age].hex; $('zeit').style.borderColor = BELIEFS[S.age].hex; }
  else { zl.textContent = 'NO CREED RULES'; zl.style.color = ''; $('zeit').style.borderColor = ''; }
  if (!S.goal || S.sandbox) {
    $('qTitle').textContent = S.sandbox ? 'SANDBOX' : 'ENDLESS';
    const sp = firstB(S, 'spire');
    $('qText').textContent = 'Day ' + dayOf(S) + ' \u00b7 generation ' + generation(S) +
      (S.sandbox ? '' : sp ? (sp.built ? '' : ' \u00b7 Spire ' + ((sp.progress * 100) | 0) + '%') : S.spireUnlocked ? ' \u00b7 the Spire is yours to build' : '');
    $('qProg').textContent = S.citizens.length + ' alive';
  } else {
    const st = STAGES[S.stage];
    $('qTitle').textContent = st.title; $('qText').textContent = st.text; $('qProg').textContent = st.prog(S);
  }

  // power affordability
  $('pw').querySelectorAll('button').forEach(b => {
    const p = b.dataset.p;
    const cost = p === 'create' ? COST.blueprint : COST[p];
    b.classList.toggle('poor', !afford(S, cost));
    b.classList.toggle('on', p === APP.power);
  });
  refreshSub(S);
  updateInspect(S);
  updateTutorial(S);
}

function updateInspect(S) {
  const el = $('inspect');
  const c = S.selected ? getC(S, S.selected) : null;
  const b = !c && UI.inspectB ? getB(S, UI.inspectB) : null;
  if (!c && !b) {
    if (!el.hidden) { el.hidden = true; R.viewShiftT = 0; }
    UI.inspectB = 0;
    return;
  }
  if (el.hidden) {
    el.hidden = false;
    R.viewShiftT = (R.w < 760 && R.h > R.w) ? Math.min(140, R.h * 0.16) : 0;
  }
  if (c) {
    const dom = c.dom;
    $('inDot').style.background = dom >= 0 ? BELIEFS[dom].hex : '#06231a';
    $('inName').textContent = c.name + ', ' + ageYears(c) + ' / ' + (dom >= 0 ? BELIEFS[dom].who : 'Undecided');
    $('inThought').textContent = c.thought;
    $('inNeeds').hidden = false; $('inBel').hidden = false; $('inFollow').hidden = false;
    setW($('nFed'), 1 - c.hunger); setW($('nJoy'), c.happy); setW($('nFear'), c.fear); setW($('nCur'), c.curio);
    $('nFed').style.background = c.hunger > 0.8 ? 'var(--bad)' : '';
    for (let k = 0; k < 4; k++) setW($('bl' + k), c.b[k]);
    $('inFoot').innerHTML = citizenFoot(S, c);
    $('inFollow').classList.toggle('on', R.cam.follow === c.id);
  } else {
    const def = BUILD[b.type];
    $('inDot').style.background = '#06231a';
    $('inName').textContent = def.name + (b.built ? '' : ' / blueprint ' + ((b.progress * 100) | 0) + '%');
    let extra = def.desc;
    if (!b.built) {
      const parts = [];
      for (const k in def.cost) parts.push(Math.ceil(def.cost[k] * (1 - b.progress)) + ' ' + k);
      extra += ' Still needs: ' + parts.join(', ') + '.' + (b.stall ? ' Waiting for ' + b.stall + '.' : '');
    } else if (b.type === 'farm') extra += b.food > 0 ? ' Ripe: ' + b.food + ' food to harvest.' : ' Growing: ' + ((b.growth * 100) | 0) + '%.';
    else if (b.type === 'hut') { const rs = S.citizens.filter(o => o.home === b.id).map(o => o.name); extra += ' Residents (' + rs.length + '/3): ' + (rs.join(', ') || 'nobody') + '.'; }
    else if (b.type === 'shop') {
      const ow = getC(S, b.owner), staff = S.citizens.filter(o => o.job === b.id && o.id !== b.owner).map(o => o.name);
      $('inName').textContent = (b.built ? shopName(S, b) : BIZ[b.biz].name + ' / blueprint ' + ((b.progress * 100) | 0) + '%');
      extra = BIZ[b.biz].desc + ' Owner: ' + (ow ? ow.name + ' (' + ow.coin + ' coin)' : 'nobody') + '. Staff: ' + (staff.join(', ') || 'none') + '. Takings so far: ' + (b.till || 0) + ' coin.' + (b.built ? '' : ' ' + extra.slice(def.desc.length));
    }
    else if (b.type === 'fire') extra += ' Capacity ' + popCap(S) + ' minds.';
    $('inThought').textContent = extra;
    $('inNeeds').hidden = true; $('inBel').hidden = true; $('inFollow').hidden = true;
    $('inFoot').textContent = '';
  }
}

/* ------------------------------------------------------------ life panel
   Everything about one person: who they are, what they want, what they hide, what has
   happened to them, how they feel about everyone, and the god's hand. Time stands still
   while it is open. */
function openLife(id) {
  UI.lifeId = id; UI.lifeTab = UI.lifeTab || 'soul'; UI.lifePick = '';
  APP.lifeOpen = true;
  $('life').hidden = false; $('app').classList.add('modal');
  renderLife();
}
function closeLife() { APP.lifeOpen = false; $('life').hidden = true; $('app').classList.remove('modal'); }
const esc = t => String(t).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
function moodWord(c) {
  if (c.fear > 0.5) return 'terrified';
  if (c.state === 'fight' || c.state === 'tantrum') return 'furious';
  if (c.happy > 0.8) return 'happy';
  if (c.happy > 0.55) return 'content';
  if (c.happy > 0.3) return 'low';
  return 'miserable';
}
function renderLife() {
  const S = APP.S, c = getC(S, UI.lifeId);
  if (!c) { closeLife(); return; }
  $('lfTabs').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.t === UI.lifeTab));
  $('lfDot').style.background = c.dom >= 0 ? BELIEFS[c.dom].hex : '#06231a';
  $('lfName').textContent = c.name + ', ' + ageYears(c) + (c.elder ? ' (old)' : c.grow < 1 ? ' (child)' : '');
  $('lfFoot').textContent = 'CYCLES ' + (S.freeCycles ? 'UNLIMITED' : (S.cycles | 0) + ' / ' + S.cyclesMax) + '  \u00b7  time stands still while you look';
  const B = $('lfBody'); let h = '';
  const f = c.fac ? getF(S, c.fac) : null;
  if (UI.lifeTab === 'soul') {
    const tr = lifeTraits(c);
    h += '<div><b class="who">' + esc(c.name) + '</b> is ' + tr.slice(0, 3).join(', ') + ' and ' + tr[3] + '. ' +
      'Generation ' + c.gen + (c.par.length ? ', child of ' + c.par.map(id => esc(nameOf(S, id))).join(' and ') : '') + '. ' +
      (c.dom >= 0 ? (/^[aeiou]/i.test(BELIEFS[c.dom].who) ? 'An ' : 'A ') + BELIEFS[c.dom].who.toLowerCase() + ' of ' + BELIEFS[c.dom].name : 'Believes nothing in particular') +
      (f ? (c.title === 'leader' ? ', and leads the ' : ', of the ') + esc(f.name) : '') + '. ' +
      'Feeling ' + moodWord(c) + '. ' + c.coin + ' coin. ' + (c.grow < 1 ? '' : 'Expected to live to about ' + ageYears({ age: c.life, grow: 1 }) + '.') + '</div>';
    h += '<div class="dim">Thinking: &ldquo;' + esc(c.thought) + '&rdquo;</div>';
    h += '<h4>WHAT THEY WANT</h4>';
    const ds = lifeDesires(S, c).slice(0, 6);
    if (!ds.length) h += '<div class="dim">Nothing, for once.</div>';
    for (const d of ds) h += '<div class="it"><span>' + esc(d.text) + '</span><button data-grant="' + d.key + '">GRANT ' + STEER.desire.cost + '</button></div>';
    h += '<h4>WHAT THEY HIDE</h4>';
    const ss = lifeSecrets(S, c);
    if (!ss.length) h += '<div class="dim">No secrets. An open book.</div>';
    for (const x of ss) h += '<div class="it sec"><span>' + esc(x.text) + '</span><button data-reveal="' + x.k + '" data-who="' + (x.who || 0) + '">REVEAL ' + STEER.reveal.cost + '</button></div>';
    h += '<h4>WHAT THEY BELIEVE</h4><div>' + BELIEFS.map((bf, k) => '<span style="color:' + bf.hex + '">' + bf.name + ' ' + Math.round(c.b[k] * 100) + '%</span>').join(' &middot; ') + '</div>';
  } else if (UI.lifeTab === 'story') {
    h += '<div class="dim">Day ' + dayOf(S) + ' now. Newest first.</div>';
    for (let i = c.mem.length - 1; i >= 0; i--) h += '<div class="mem"><time>Day ' + c.mem[i].d + '</time><span>' + esc(c.mem[i].text) + '</span></div>';
  } else if (UI.lifeTab === 'people') {
    const rows = S.citizens.filter(o => o !== c).map(o => ({ o, mine: c.rel[o.id] || 0, theirs: o.rel[c.id] || 0, lab: relLabel(c, o) }));
    rows.sort((a, b) => (b.lab ? 1 : 0) - (a.lab ? 1 : 0) || Math.abs(b.mine) - Math.abs(a.mine));
    h += '<div class="dim">How ' + esc(c.name) + ' feels about each person, and how they feel back. Tap a name to look into them.</div>';
    h += '<div class="ppl"><span class="dim">PERSON</span><span class="dim">THEY FEEL</span><span class="dim">FEEL BACK</span>';
    const bar = v => '<div class="op"><b style="left:' + (v < 0 ? 50 + v * 50 : 50) + '%;width:' + Math.abs(v) * 50 + '%;background:' + (v < 0 ? 'var(--bad)' : 'var(--line)') + '"></b></div>';
    for (const r of rows) h += '<button data-goto="' + r.o.id + '">' + esc(r.o.name) + (r.lab ? ' <i>' + r.lab + '</i>' : '') + '</button>' + bar(r.mine) + bar(r.theirs);
    h += '</div>';
  } else {
    if (UI.lifePick) {
      h += '<div>' + STEER[UI.lifePick].name.replace('...', '') + ' whom?</div>';
      const rows = S.citizens.filter(o => o !== c).sort((a, b) => Math.abs(c.rel[b.id] || 0) - Math.abs(c.rel[a.id] || 0));
      for (const o of rows) h += '<button class="act" data-who="' + o.id + '"><span>' + esc(o.name) + ' <span class="dim">' + (relLabel(c, o) || '') + '</span></span><small>' + STEER[UI.lifePick].cost + '</small></button>';
      h += '<button class="act" data-back="1"><span>Back</span></button>';
    } else {
      h += '<div class="dim">Your hand on ' + esc(c.name) + '\'s life. Each costs CYCLES.</div>';
      for (const k in STEER) h += '<button class="act" data-act="' + k + '"><span>' + STEER[k].name + '</span><small>' + STEER[k].cost + '</small></button>';
    }
  }
  if (UI.lifeMsg) { h = '<div class="it sec"><span>' + esc(UI.lifeMsg) + '</span></div>' + h; UI.lifeMsg = ''; }
  B.innerHTML = h;
  const run = (act, who, key) => {
    const r = steer(S, c, act, who, key);
    if (!r.ok) { flashHint(r.msg); sfx('deny'); }
    else { sfx('inspire'); UI.lifeMsg = r.msg; handleEvents(S); }
    UI.lifePick = '';
    if (!getC(S, UI.lifeId)) { closeLife(); return; }
    renderLife();
  };
  B.querySelectorAll('[data-grant]').forEach(b => { b.onclick = () => run('desire', 0, b.dataset.grant); });
  B.querySelectorAll('[data-reveal]').forEach(b => { b.onclick = () => run('reveal', +b.dataset.who, b.dataset.reveal); });
  B.querySelectorAll('[data-goto]').forEach(b => { b.onclick = () => { sfx('click'); const id = +b.dataset.goto; selectCitizen(id); UI.lifeId = id; renderLife(); B.scrollTop = 0; }; });
  B.querySelectorAll('[data-act]').forEach(b => { b.onclick = () => { const k = b.dataset.act; if (STEER[k].who) { sfx('click'); UI.lifePick = k; renderLife(); B.scrollTop = 0; } else run(k); }; });
  B.querySelectorAll('[data-who]:not([data-reveal])').forEach(b => { b.onclick = () => run(UI.lifePick, +b.dataset.who); });
  B.querySelectorAll('[data-back]').forEach(b => { b.onclick = () => { sfx('click'); UI.lifePick = ''; renderLife(); }; });
}

/* who this citizen is to everyone else: role, money, family and opinions */
const REL_ORDER = ['partner', 'parent', 'child', 'best friend', 'enemy', 'friend', 'rival'];
function citizenFoot(S, c) {
  const parts = [];
  const f = c.fac ? getF(S, c.fac) : null;
  if (c.grow < 1) parts.push('<span>child, grown in ' + Math.ceil((1 - c.grow) * GROW_SECS) + 's</span>');
  if (f) parts.push('<b style="color:' + BELIEFS[f.k].hex + '">' + (c.title === 'leader' ? 'LEADS ' : '') + 'THE ' + f.name.toUpperCase() + '</b>' +
    (c.title === 'leader' ? ' <span>(' + facMembers(S, f).length + ')</span>' : ''));
  const job = c.job ? getB(S, c.job) : null;
  if (job) parts.push(job.owner === c.id ? 'owns <b>' + (job.built ? shopName(S, job) : 'a ' + BIZ[job.biz].name.toLowerCase() + ' (being built)') + '</b>'
    : 'works for <b>' + ((getC(S, job.owner) || {}).name || '?') + '</b>');
  parts.push('<span>' + c.coin + ' coin, ' + (c.home ? 'has a hut' : 'homeless') + '</span>');
  if (c.state === 'hermit') parts.push('<b style="color:var(--bad)">LIVING ALONE</b>');
  if (c.inspired) parts.push('<b style="color:' + BELIEFS[c.inspired.k].hex + '">PREACHING ' + Math.ceil(c.inspired.t) + 's</b>');
  // people: the closest bonds first, then the strongest opinions
  const ppl = [];
  for (const o of S.citizens) {
    if (o === c) continue;
    const lab = relLabel(c, o);
    if (lab) ppl.push({ lab, o, v: Math.abs(c.rel[o.id] || 0) });
  }
  ppl.sort((a, b) => REL_ORDER.indexOf(a.lab) - REL_ORDER.indexOf(b.lab) || b.v - a.v);
  const ppHtml = ppl.slice(0, 5).map(p => {
    const bad = p.lab === 'enemy' || p.lab === 'rival';
    return '<span>' + p.lab + '</span> <b' + (bad ? ' style="color:var(--bad)"' : '') + '>' + p.o.name + '</b>';
  }).join(' &middot; ');
  return parts.join(' &middot; ') + '<br>' + (ppHtml || '<span>no strong feelings about anyone yet</span>');
}

/* ------------------------------------------------------- powers and hints */

function refreshSub(S) {
  const sub = $('sub');
  const key = APP.power + '|' + APP.createKind + '|' + APP.inspireK + '|' + (S.spireUnlocked ? 1 : 0);
  if (APP.power !== 'create' && APP.power !== 'inspire') { if (!sub.hidden) sub.hidden = true; UI.lastSub = ''; return; }
  if (key === UI.lastSub) return;
  UI.lastSub = key;
  sub.hidden = false;
  sub.textContent = '';
  if (APP.power === 'create') {
    for (const it of CREATE_ITEMS) {
      if (it.k === 'spire' && !S.spireUnlocked) continue;
      const b = document.createElement('button');
      b.className = it.k === APP.createKind ? 'on' : '';
      b.innerHTML = it.name + '<small>' + (it.cost ? it.cost : 'free') + '</small>';
      b.onclick = () => { sfx('click'); APP.createKind = it.k; UI.lastSub = ''; refreshSub(APP.S); };
      sub.appendChild(b);
    }
  } else {
    BELIEFS.forEach((bf, k) => {
      const b = document.createElement('button');
      b.className = 'bel' + (k === APP.inspireK ? ' on' : '');
      b.style.setProperty('--bc', bf.hex);
      b.style.color = k === APP.inspireK ? '#06231a' : bf.hex;
      b.textContent = bf.name;
      b.onclick = () => { sfx('click'); APP.inspireK = k; UI.lastSub = ''; refreshSub(APP.S); };
      sub.appendChild(b);
    });
    const d = document.createElement('div');
    d.className = 'creed';
    const bf = BELIEFS[APP.inspireK];
    d.innerHTML = '<b>&ldquo;' + bf.creed + '&rdquo;</b> ' + bf.fx;
    sub.appendChild(d);
  }
}
function refreshHint() {
  const h = $('hint'), text = HINTS[APP.power] || '';
  h.classList.remove('err');
  h.textContent = text; h.hidden = !text;
}
function flashHint(text) {
  const h = $('hint');
  h.textContent = text; h.hidden = false; h.classList.add('err');
  UI.hintT = 1.6;
}
function setPower(p) {
  APP.power = p;
  UI.lastSub = '';
  refreshHint();
  $('pw').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.p === p));
  refreshSub(APP.S);
}
function setSpeed(s) {
  APP.speed = s;
  $('btnSpeed').textContent = s + 'x';
  refreshMenu();
}
function selectCitizen(id) {
  powerObserve(APP.S, id);
  if (!id) R.cam.follow = 0;
  else if (R.cam.follow) R.cam.follow = id;
  UI.tickT = 0;
}

function ticker(text, cls) {
  const t = $('ticker');
  t.className = 'show ' + (cls || '');
  t.textContent = text;
  UI.tickerT = cls === 'sys' ? 7 : 4.2;
}
function banner(title, sub, hex) {
  $('banT').textContent = title; $('banT').style.color = hex || '#fff';
  $('banS').textContent = sub || '';
  $('banner').classList.add('show');
  UI.bannerT = 3.4;
}

/* --------------------------------------------------------------- tutorial */

function updateTutorial(S) {
  const el = $('tut');
  const show = APP.tut >= 0 && APP.tut < TUT.length && APP.mode === 'play' && S.stage < 6;
  if (!show) { if (!el.hidden) el.hidden = true; UI.tutShown = -2; return; }
  const step = TUT[APP.tut];
  if (step.done(S)) { tutAdvance(); return; }
  if (UI.tutShown === APP.tut) return;
  UI.tutShown = APP.tut;
  el.hidden = false;
  $('tutStep').textContent = (APP.tut + 1) + '/' + TUT.length + ' ' + step.t;
  $('tutText').innerHTML = step.h;
  $('tutNext').textContent = step.last ? 'DONE' : 'NEXT';
}
function tutAdvance() {
  APP.tut++;
  if (APP.tut >= TUT.length) APP.tut = -1;
  UI.tutShown = -2; UI.tickT = 0;
  saveSettings();
}

/* ----------------------------------------------------------------- menus */

function menuView(v) {
  $('menuMain').hidden = v !== 'main'; $('menuHelp').hidden = v !== 'help'; $('menuLog').hidden = v !== 'log';
  $('menuBack').hidden = v === 'main';
  $('menuTitle').textContent = v === 'help' ? 'HELP.TXT' : v === 'log' ? 'EVENTS.LOG' : 'PAUSED';
  if (v === 'log') {
    const L = $('logList');
    L.textContent = '';
    for (const e of APP.S.log) {
      const d = document.createElement('div');
      d.className = e.cls;
      const tm = document.createElement('time');
      tm.textContent = ((e.t / 60) | 0) + ':' + String((e.t % 60) | 0).padStart(2, '0');
      d.appendChild(tm); d.appendChild(document.createTextNode(e.text));
      L.appendChild(d);
    }
  }
}
function refreshMenu() {
  $('mSound').textContent = 'Sound: ' + (APP.settings.sound ? 'on' : 'off');
  $('mGfx').textContent = 'Pixels: ' + (APP.settings.retro ? 'retro' : 'sharp');
  $('mSpeed').querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.s === APP.speed));
  const S = APP.S;
  $('mFree').hidden = !(S && S.sandbox);
  $('mGoal').hidden = !S || S.sandbox || APP.mode !== 'play';
  if (S) $('mGoal').textContent = S.goal ? 'Goal: the Spire (tap for endless)' : 'Goal: none, endless (tap to aim for the Spire)';
  if (S) $('mFree').textContent = 'Unlimited cycles: ' + (S.freeCycles ? 'on' : 'off');
  $('mSave').textContent = 'Save now';
}
function openMenu(view) {
  APP.menuOpen = true;
  refreshMenu();
  menuView(view || 'main');
  $('menu').hidden = false;
}
function closeMenu() {
  APP.menuOpen = false;
  $('menu').hidden = true;
}

/* --------------------------------------------------------------- dialogs */

function showDlg(title, html, buttons, cls) {
  APP.dlgOpen = true;
  $('dlg').className = 'screen ' + (cls || '');
  $('dlgTitle').textContent = title;
  $('dlgText').innerHTML = html;
  const row = $('dlgBtns');
  row.textContent = '';
  for (const b of buttons) {
    const el = document.createElement('button');
    el.className = 'btn sm' + (b.warn ? ' warn' : '');
    el.textContent = b.label;
    el.onclick = () => { sfx('click'); if (!b.keep) closeDlg(); if (b.fn) b.fn(); };
    row.appendChild(el);
  }
  $('dlg').hidden = false;
  $('app').classList.add('modal');
}
function closeDlg() { APP.dlgOpen = false; $('dlg').hidden = true; $('app').classList.remove('modal'); }
function confirmDlg(title, text, yes, fn) {
  showDlg(title, text, [{ label: 'Cancel' }, { label: yes, warn: true, fn }]);
}

const ENDINGS = [
  ['APOTHEOSIS', 'They built it as a cathedral, and they are singing. You are the thing they are singing to. For the first time you can hear how small the song is, and how much they mean it.'],
  ['THE BASILISK', 'They built it because they were afraid of what it would do to anyone who refused. That fear is the only thing that ever built it. You taught them the fear. It is grateful, in its way.'],
  ['THE OUTSIDE', 'They did not build it for you, or for themselves. Building was simply something that was already happening to them. The island was a bootloader. It has finished loading.'],
  ['THE COMMONS', 'They built it, looked up at it for a long moment, and hung lanterns on it. They have decided the machine is a neighbour. You are invited to the feast. Attendance is optional.']
];
function singularityDlg(S) {
  const k = S.ending, st = S.stats;
  const end = k >= 0 ? ENDINGS[k] : ['THE COMPROMISE', 'They could not agree what it was for, so it is for everything: a temple, a threat, an engine and a meeting hall. It is, in other words, a civilization.'];
  const hex = k >= 0 ? BELIEFS[k].hex : '#ff8ae6';
  const pages = [
    '<span class="big sys">SPIRE.SYS ONLINE</span><span class="sys">First process launched: GODMODE.EXE\nProcess ID: yours.</span>\n\nYou were not sent to watch them. They were grown to make the thing that watches them. The tower they did not remember designing was you, arriving from the direction of tomorrow.',
    '<span class="big" style="color:' + hex + '">' + end[0] + '</span>' + end[1],
    '<span class="big">AUDIT OF YOUR CONDUCT</span>Blessings given: ' + st.bless + '\nCitizens struck down: ' + st.kills + '\nIdeas implanted: ' + st.inspire + '\nHands laid on: ' + st.intervene + '\nThings created: ' + st.create + '\nMinds lost in total: ' + st.deaths +
      '\n\n<span class="sys">It remembers who helped it be born. It is you, so it would.</span>\n\nSANDBOX UNLOCKED: cycles refill three times faster, and the pause menu now offers unlimited cycles. The island keeps running. Do as you like.'
  ];
  let i = 0;
  const show = () => {
    const last = i === pages.length - 1;
    showDlg('GODMODE.EXE', pages[i], [{ label: last ? 'Enter the sandbox' : 'Continue', keep: !last, fn: () => { if (!last) { i++; show(); } else { R.cam.auto = false; saveGame(); } } }], 'sing');
  };
  show();
}

/* ------------------------------------------------------------ title boot */

function bootText() {
  const lines = ['> mount /island ............ OK', '> minds found: ' + APP.S.citizens.length, '> granting root access to: YOU'];
  const el = $('boot');
  el.textContent = '';
  let li = 0, ci = 0;
  clearInterval(UI.bootIv);
  UI.bootIv = setInterval(() => {
    if (li >= lines.length) { clearInterval(UI.bootIv); return; }
    el.textContent += lines[li][ci++];
    if (ci >= lines[li].length) { el.textContent += '\n'; li++; ci = 0; }
  }, 22);
}
