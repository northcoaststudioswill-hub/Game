// GOT NEXT — highlights and CAGE magazine: big plays get a close-up, a banner and a photo; the photos become covers you collect
const HL_KINDS = [
  { k: 'poster', n: 'POSTER', line: (a, v) => `${a} PUTS ${v || 'A MAN'} ON A POSTER`, sub: 'Somebody frame it.' },
  { k: 'oop', n: 'ALLEY-OOP', line: (a) => `${a} CATCHES IT ABOVE THE RIM`, sub: 'The pass was a rumour until it wasn\'t.' },
  { k: 'putback', n: 'PUTBACK SLAM', line: (a) => `${a} CLEANS THE GLASS`, sub: 'Second chances, first-class finish.' },
  { k: 'dunk', n: 'SHOWTIME', line: (a) => `${a} PUTS ON A SHOW`, sub: 'Style points are still points.' },
  { k: 'ankles', n: 'ANKLE BREAKER', line: (a, v) => `${a} PUTS ${v || 'HIM'} ON SKATES`, sub: 'Witnesses say he is still falling.' },
  { k: 'swat', n: 'SWAT', line: (a, v) => `${a} SENDS ${v ? v + "'S SHOT" : 'IT'} BACK`, sub: 'Not in here. Not today.' },
  { k: 'buzzer', n: 'BUZZER BEATER', line: (a) => `${a} BEATS THE CLOCK`, sub: 'One second is a long time if you are calm.' },
  { k: 'winner', n: 'GAME WINNER', line: (a) => `${a} ENDS IT`, sub: 'Winners stay. Everybody else walks.' },
];
const HL = {}; HL_KINDS.forEach(h => HL[h.k] = h);
const MAG_KEEP = 24, MAG_PICS = 8, MAG_FIRST = 150, MAG_SET = 2500;
function magState() { if (!S.mag) S.mag = { n: 0, list: [], got: {} }; return S.mag; }
function fitOf(b) { const w = (b && b.worn) || {}, nm = id => { const d = DRIP.find(x => x.id === id); return d ? d.n : ''; }; return [nm(w.top), nm(w.shoes)].filter(Boolean); }

// called by the match on a big play. One at a time, and not every trip down the floor
function highlight(kind, p, vic) {
  const M_ = MT; if (!kind || !M_ || !HL[kind] || M_.practice || M_.drill || M_.reel || M_.net === 'guest') return;
  if (kind !== 'winner' && (M_.hl || M_.time - (M_.hlAt || -99) < 12)) return;
  M_.hlAt = M_.time; M_.hl = { kind, p, vic: vic || null, t: 0, dur: kind === 'winner' ? 2.3 : 1.7, cap: !!p.mine && !M_.spectate, shot: false };
  M_.slow = Math.max(M_.slow || 0, kind === 'winner' ? 1.1 : 0.8);
  const e = $('hl'); if (!e) return; const fit = fitOf(p.b);
  e.querySelector('b').textContent = HL[kind].n; e.querySelector('.who').textContent = p.b.name + (vic ? '  ›  ' + vic.b.name : '');
  e.querySelector('.fit').textContent = fit.length ? 'FIT · ' + fit.join(' · ') : ''; e.className = ''; void e.offsetWidth; e.className = 'on' + (p.team === M_.me.team ? '' : ' them');
}
function hlStep(dt) { const M_ = MT, h = M_ && M_.hl; if (!h) return; h.t += dt; if (h.t >= h.dur) hlEnd(); }
function hlEnd() { if (MT) MT.hl = null; const e = $('hl'); if (e) e.className = ''; }
// 0..1: how far the camera has pushed in
function hlZoom() { const h = MT && MT.hl; if (!h || (S.set && S.set.hlcam === 0)) return 0; const u = Math.min(h.t / 0.22, (h.dur - h.t) / 0.35, 1); return u <= 0 ? 0 : u * u * (3 - 2 * u); }
// right after the frame is drawn: take the picture (your own plays only)
function hlCapture() {
  const M_ = MT, h = M_ && M_.hl; if (!h || !h.cap || h.shot || h.t < 0.55) return; h.shot = true;
  let img = '';
  try { const src = renderer.domElement, c = document.createElement('canvas'); c.width = 300; c.height = 375; const sh = src.height, sw = Math.min(src.width, sh * 0.8), x = c.getContext('2d');
    x.drawImage(src, (src.width - sw) / 2, 0, sw, sh, 0, 0, 300, 375); img = c.toDataURL('image/jpeg', 0.52); if (img.length < 2000) img = ''; } catch (e) { img = ''; }
  const G = magState(), first = !G.got[h.kind]; G.got[h.kind] = (G.got[h.kind] || 0) + 1; G.n++;
  G.list.unshift({ k: h.kind, who: h.p.b.name, vs: h.vic ? h.vic.b.name : '', court: M_.cfg.tier ? M_.cfg.tier.n : 'THE CAGES', mode: M_.cfg.mode.n, sc: M_.score[M_.me.team] + '–' + M_.score[1 - M_.me.team], iss: G.n, day: new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' }).toUpperCase(), fit: fitOf(h.p.b), img });
  if (G.list.length > MAG_KEEP) G.list.length = MAG_KEEP; G.list.forEach((it, i) => { if (i >= MAG_PICS && it.img) it.img = ''; });      /* only the newest covers keep their photo: the save has to stay small */
  const e = $('hl'); if (e) e.classList.add('snap'); sfx('unlock');
  if (first) { S.vc += MAG_FIRST; const got = HL_KINDS.filter(k => G.got[k.k]).length; toast('NEW CLIP · ' + HL[h.kind].n, `${got} / ${HL_KINDS.length} collected · +${MAG_FIRST} HC`, 'ach');
    if (got === HL_KINDS.length && !G.full) { G.full = 1; S.vc += MAG_SET; setTimeout(() => toast('THE FULL SET', `Every kind of highlight, on a CAGE cover. +${MAG_SET.toLocaleString()} HC`, 'ach'), 1800); } }
  save();
}
// ---------- the magazine ----------
function magCover(it, big) {
  const h = HL[it.k] || HL_KINDS[0], bg = it.img ? `background-image:url(${it.img})` : `background:linear-gradient(160deg,#2a0f1c,#0c0c10 55%,#10202a)`;
  return `<div class="mag${big ? ' big' : ''}${it.img ? '' : ' nopic'}" style="${bg}"><div class="mh"><b>CAGE</b><span>ISSUE ${String(it.iss).padStart(3, '0')} · THE BLOCK · ${esc(it.day || 'TODAY')}</span></div>`
    + `<div class="mk">${h.n}</div><div class="ml"><b>${esc(h.line(it.who.toUpperCase(), it.vs ? it.vs.toUpperCase() : ''))}</b><span>${esc(h.sub)}</span></div>`
    + `<div class="mf"><span>${esc(it.court)} · ${esc(it.mode || '')} · ${esc(it.sc)}</span>${it.fit && it.fit.length ? `<span>THE FIT: ${esc(it.fit.join(' + '))}</span>` : ''}<i></i><em>${40 + (it.iss * 7) % 60} HC</em></div></div>`;
}
function magTab() {
  const G = magState(); let h = `<p class="mu">CAGE puts the big plays on the cover: your posters, lobs, putbacks, show dunks, ankle-breakers, swats and game winners. The first of each kind pays ${MAG_FIRST} HC, the full set ${MAG_SET.toLocaleString()}. The newest ${MAG_PICS} covers keep their photo.</p>`;
  h += `<div class="card"><div class="row" style="flex-wrap:wrap;gap:6px">` + HL_KINDS.map(k => `<span class="tag" style="${G.got[k.k] ? 'border-color:var(--gold);color:var(--gold)' : 'opacity:.45'}">${G.got[k.k] ? '✓ ' : ''}${k.n}${G.got[k.k] > 1 ? ' ×' + G.got[k.k] : ''}</span>`).join('') + `</div></div>`;
  if (!G.list.length) return h + `<div class="card"><p>No covers yet. Dunk on somebody.</p></div>`;
  h += `<div class="maggrid">` + G.list.map((it, i) => `<div class="magcell">${magCover(it)}${Btn('READ', () => uiMag(i), 'sm')}</div>`).join('') + `</div>`; return h;
}
function uiMag(i) {
  openPanel(() => { const G = magState(), it = G.list[i]; if (!it) return `<h2>CAGE</h2>` + Btn('BACK', () => uiPlayer('mag'));
    return `<h2>CAGE · ISSUE ${String(it.iss).padStart(3, '0')}</h2>${magCover(it, true)}<div class="pf">${Btn('BACK', () => uiPlayer('mag'))} ${i > 0 ? Btn('NEWER', () => uiMag(i - 1), 'alt') : ''} ${i < G.list.length - 1 ? Btn('OLDER', () => uiMag(i + 1), 'alt') : ''} ${Btn('BIN IT', () => { G.list.splice(i, 1); save(); uiPlayer('mag'); }, 'alt')}</div>`; }, '', () => uiPlayer('mag'));
}
