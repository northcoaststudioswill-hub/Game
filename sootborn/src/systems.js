// ============================================================
// systems/ — state, save, dialogue, journal, puzzle, world
// ============================================================
const G = { mode: 'boot', name: 'Wren', look: 0, tendency: null, day: 1, mapId: 'apt', flags: {}, trust: {}, trust0: {}, scrip: 6, journal: [], newJ: 0, log: [], play: 0, time: 0, talkCount: {} };
const P = { x: 0, y: 0, dir: 0, anim: 0, moving: false, sheet: null, moved: 0 };
function freshState(name, look) {
  Object.assign(G, { name: name || 'Wren', look: look || 0, tendency: null, day: 1, mapId: 'apt', flags: {}, trust: { mara: 0, ivo: 0, tavi: 1, orin: 0, nell: 0 }, scrip: 6, journal: [], newJ: 0, log: [], play: 0, talkCount: {} });
  G.trust0 = { ...G.trust };
}
function phase() { if (typeof Cutscene !== 'undefined' && Cutscene.active) return Cutscene.pillarRed ? 'evening' : 'morning'; if (G.mapId === 'fest') return 'evening'; if (F('day2Done')) return 'morning'; if (F('day1Done')) return F('lanternBuilt') ? 'evening' : F('fuseDone') ? 'noon' : 'morning'; if (F('clockedOut')) return 'evening'; if (F('puzzleDone')) return 'noon'; return 'morning'; }
function trust(id, n) { G.trust[id] = clamp((G.trust[id] || 0) + n, -2, 2); }
function addJ(id, quiet) {
  if (G.journal.includes(id)) return; G.journal.push(id); G.newJ++;
  const e = JOURNAL[id]; if (!quiet) { HUD.toast('Journal: ' + e.title); if (e.tab !== 'evidence') Sound.play('page'); }
  if (!G.flags.journalHint) { G.flags.journalHint = 1; setTimeout(() => HUD.toast('Open ' + Input.label('START') + ' Menu → Journal to read it'), 2600); }
}
const fill = t => String(t).replace(/\{name\}/g, G.name);

// ---------- save system (schema versioned, slots: auto / manual)
const SAVE_V = 2;
const Save = {
  snapshot() { return { v: SAVE_V, t: Date.now(), name: G.name, look: G.look, tendency: G.tendency, day: G.day, map: G.mapId, x: Math.round(P.x), y: Math.round(P.y), dir: P.dir, flags: { ...G.flags }, trust: { ...G.trust }, trust0: { ...G.trust0 }, scrip: G.scrip, journal: G.journal.slice(), log: G.log.slice(-80), play: Math.round(G.play), talkCount: { ...G.talkCount } }; },
  write(slot) { const s = this.snapshot(); s.slot = slot; return Store.set('bts_save_' + slot, JSON.stringify(s)); },
  read(slot) { try { return this.migrate(JSON.parse(Store.get('bts_save_' + slot) || (slot === 's1' ? Store.get('bts_save_manual') : null))); } catch (e) { return null; } },
  del(slot) { Store.set('bts_save_' + slot, ''); if (slot === 's1') Store.set('bts_save_manual', ''); },
  SLOTS: [['auto', 'Autosave'], ['s1', 'Slot 1'], ['s2', 'Slot 2'], ['s3', 'Slot 3']],
  latest() { let b = null; for (const [k] of this.SLOTS) { const s = this.read(k); if (s && (!b || s.t > b.t)) b = s; } return b; },
  describe(s) { if (!s) return 'Empty'; const d = new Date(s.t), m = Math.floor((s.play || 0) / 60); let when = ''; try { when = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }); } catch (e) { } return `Day ${s.day} · ${MAPS[s.map].name} · ${m < 60 ? m + ' min' : Math.floor(m / 60) + 'h ' + (m % 60) + 'm'}${when ? ' · ' + when : ''}`; },
  migrate(s) {
    if (!s || typeof s !== 'object') return null;
    if (!s.v) { s.v = 1; s.trust = s.trust || {}; s.journal = s.journal || []; s.flags = s.flags || {}; }
    if (s.v === 1) { s.name = 'Kael'; s.look = 0; s.v = 2; } // v0.1/v0.2 saves: hero is now Kael Brennick
    if (typeof s.map !== 'string' || !MAPS[s.map] || typeof s.flags !== 'object') return null;
    return s;
  },
  apply(s) {
    Object.assign(G, { name: 'Kael', look: 0, tendency: s.tendency || null, day: s.day || 1, flags: s.flags, trust: Object.assign({ mara: 0, ivo: 0, tavi: 1, orin: 0, nell: 0 }, s.trust), trust0: s.trust0 || { ...s.trust }, scrip: s.scrip | 0, journal: (s.journal || []).filter(j => JOURNAL[j]), newJ: 0, log: s.log || [], play: s.play || 0, talkCount: s.talkCount || {} });
    World.load(s.map, { x: s.x, y: s.y, dir: s.dir | 0 });
  }
};

// ---------- dialogue runner (steps: {s,t} | {choice:[{t,fx,then}]} | {fx})
const Dialogue = {
  active: false, stack: [], cur: null, shown: 0, full: '', choices: null, sel: 0, onEnd: null, blipT: 0,
  el: null,
  start(steps, onEnd) { if (!steps || !steps.length) { onEnd && onEnd(); return; } this.stack = [{ a: steps, i: 0 }]; this.onEnd = onEnd || null; this.active = true; $('#dlg').classList.remove('hidden'); this.next(); },
  push(steps) { if (!this.active) return this.start(steps); this.stack.push({ a: steps, i: 0 }); },
  next() {
    this.choices = null;
    while (this.stack.length) {
      const top = this.stack[this.stack.length - 1];
      if (top.i >= top.a.length) { this.stack.pop(); continue; }
      const st = top.a[top.i++];
      if (!st) continue;
      if (st.fx) { st.fx(); if (!this.active) return; continue; }
      if (st.choice) { this.showChoice(st.choice); return; }
      this.showLine(st); return;
    }
    this.end();
  },
  end() { this.active = false; $('#dlg').classList.add('hidden'); Input.consume(); const cb = this.onEnd; this.onEnd = null; HUD.dirty = true; cb && cb(); },
  speaker(id) { if (id === 'you') id = 'kael'; if (id === 'narr') return null; const c = CAST[id]; return { name: id === 'kael' ? 'Kael' : c.name, bust: World.bustFor(id), acc: !!c.look().accredited }; },
  showLine(st) {
    const sp = this.speaker(st.s), box = $('#dlg'), cv = box.querySelector('canvas');
    cv.style.display = sp ? '' : 'none'; if (sp) { const g2 = cv.getContext('2d'); g2.imageSmoothingEnabled = false; g2.drawImage(sp.bust, 0, 0); }
    box.querySelector('.nm').style.color = sp && sp.acc ? '#ffe9a8' : '';
    box.querySelector('.nm').textContent = sp ? sp.name : '';
    box.querySelector('.nm').style.display = sp ? '' : 'none';
    this.full = fill(st.t); this.shown = Settings.d.speed === 3 ? this.full.length : 0; this.cur = st; this.bust = sp && !CAST[st.s === 'you' ? 'kael' : st.s].look().warden ? sp.bust : null; this.bdy = sp && CAST[st.s === 'you' ? 'kael' : st.s].look().kid ? 3 : 0; this.mouth = 0;
    box.querySelector('.choices').innerHTML = '';
    G.log.push((sp ? sp.name + ': ' : '') + this.full); if (G.log.length > 120) G.log.shift();
    this.render();
  },
  showChoice(ch) {
    this.choices = ch; this.sel = 0; this.cur = null;
    const box = $('#dlg'), wrap = box.querySelector('.choices');
    box.querySelector('canvas').style.display = ''; { const g2 = box.querySelector('canvas').getContext('2d'); g2.imageSmoothingEnabled = false; g2.drawImage(World.bustFor('kael'), 0, 0); } box.querySelector('.nm').style.color = '';
    box.querySelector('.nm').style.display = ''; box.querySelector('.nm').textContent = 'Kael';
    box.querySelector('.tx').innerHTML = '';
    wrap.innerHTML = '';
    ch.forEach((c, i) => { const b = document.createElement('button'); b.textContent = fill(c.t); b.onclick = e => { e.stopPropagation(); this.sel = i; this.pick(); }; wrap.appendChild(b); });
    this.hl();
  },
  hl() { [...$('#dlg .choices').children].forEach((b, i) => b.classList.toggle('sel', i === this.sel)); },
  pick() { const c = this.choices[this.sel]; Sound.play('ok'); G.log.push('> ' + fill(c.t)); this.choices = null; $('#dlg .choices').innerHTML = ''; if (c.fx) c.fx(); if (c.then) this.stack.push({ a: c.then, i: 0 }); this.next(); },
  render() { const tx = $('#dlg .tx'); const done = this.shown >= this.full.length; tx.innerHTML = esc(this.full.slice(0, Math.floor(this.shown))) + (done ? ' <span class="more">▼</span>' : ''); },
  advance() { if (this.choices) return; if (this.shown < this.full.length) { this.shown = this.full.length; this.render(); if (this.bust && this.mouth) { this.mouth = 0; $('#dlg canvas').getContext('2d').drawImage(this.bust, 0, 0); } } else { Sound.play('blip'); this.next(); } },
  update(dt) {
    if (this.choices) {
      if (Input.rep('up')) { this.sel = (this.sel + this.choices.length - 1) % this.choices.length; this.hl(); Sound.play('move'); }
      if (Input.rep('down')) { this.sel = (this.sel + 1) % this.choices.length; this.hl(); Sound.play('move'); }
      if (Input.p('A')) this.pick();
      return;
    }
    if (this.shown < this.full.length) {
      const cps = [28, 55, 110, 9999][Settings.d.speed] || 55; const before = Math.floor(this.shown);
      this.shown = Math.min(this.full.length, this.shown + cps * dt);
      if (this.bust && !Settings.d.reduce) { const open = this.shown < this.full.length && Math.floor(G.time * 9) % 2 ? 1 : 0; if (open !== this.mouth) { this.mouth = open; const g2 = $('#dlg canvas').getContext('2d'); g2.drawImage(this.bust, 0, 0); if (open) { g2.fillStyle = '#2a0e12'; g2.fillRect(14, 19 + this.bdy, 4, 2); g2.fillStyle = '#7a3a34'; g2.fillRect(14, 21 + this.bdy, 4, 1); } } }
      if (Math.floor(this.shown) !== before) { this.render(); this.blipT -= 1; if (this.blipT <= 0 && this.cur && this.cur.s !== 'narr') { Sound.play('blip'); this.blipT = 3; } }
    }
    else if (this.mouth && this.bust) { this.mouth = 0; $('#dlg canvas').getContext('2d').drawImage(this.bust, 0, 0); }
    if (Input.p('A') || Input.p('B')) this.advance();
  }
};
$('#dlg').addEventListener('click', () => { if (Dialogue.active && !Dialogue.choices) Dialogue.advance(); });

// ---------- valve-routing puzzle (Net-style: feed every tile, no open ends)
const BIT = { N: 1, E: 2, S: 4, W: 8 }, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
const rotCW = m => ((m << 1) | (m >> 3)) & 15;
const parseConn = s => s.split('').reduce((m, c) => m | (BIT[c] || 0), 0);
const Puzzle = {
  get ox() { return Math.floor((W - this.cols * this.T) / 2); }, get oy() { return 14 + Math.floor((H - 14 - 20 - this.rows * this.T) / 2); },
  active: false, defs: null, si: 0, grid: null, cols: 0, rows: 0, cur: { x: 0, y: 0 }, solved: false, t: 0, solveT: 0, hintT: 0, hintC: null, onDone: null, moves: 0, T: 24, flowR: null,
  build(def, seed) {
    const r = rng(seed || 7), g = [];
    for (let y = 0; y < def.rows; y++) { const row = []; for (let x = 0; x < def.cols; x++) {
      const s = def.cells[y][x];
      if (!s) row.push({ kind: 'blank', m: 0, sol: 0 });
      else if (s.startsWith('SRC')) row.push({ kind: 'src', m: parseConn(s.split(':')[1]), sol: parseConn(s.split(':')[1]), fixed: 1, label: s.split(':')[2] });
      else if (s.startsWith('OUT')) { const p = s.split(':'); row.push({ kind: 'out', m: parseConn(p[1]), sol: parseConn(p[1]), fixed: 1, label: p[2] }); }
      else { const m = parseConn(s); let c = m, n = 1 + Math.floor(r() * 3); for (let i = 0; i < n; i++) c = rotCW(c); if (c === m) c = rotCW(c); row.push({ kind: 'pipe', m: c, sol: m }); }
    } g.push(row); }
    return g;
  },
  open(defs, onDone) { this.defs = defs; this.onDone = onDone; this.timeLeft = defs[0].timer || 0; this.si = (defs === PUZZLES && G.flags.p1) ? 1 : 0; this.load(); this.active = true; Sound.music('work'); $('#pbar').classList.remove('hidden'); HUD.dirty = true; Input.consume(); },
  load() { const d = this.defs[this.si]; this.bk = null; this.cols = d.cols; this.rows = d.rows; if (d.kind !== 'breaker') this.grid = this.build(d, 11 + this.si * 31); this.solved = false; this.solveT = 0; this.moves = 0; this.T = d.cols > 4 ? 24 : 28;
    
    if (d.kind === 'breaker') { this.bk = { st: d.loads.map(() => 0), cur: 0 }; this.grid = [[]]; this.flowR = { seen: new Set(), leaks: [], total: 0 }; HUD.dirty = true; return; }
    const first = this.grid.flat().findIndex(c => c.kind === 'pipe'); this.cur = { x: first % this.cols, y: Math.floor(first / this.cols) }; this.flowR = this.flow(); HUD.dirty = true; },
  close() { this.active = false; $('#pbar').classList.add('hidden'); Sound.music(MAPS[G.mapId].music); HUD.dirty = true; Input.consume(); },
  cell(x, y) { return x >= 0 && y >= 0 && x < this.cols && y < this.rows ? this.grid[y][x] : null; },
  flow() {
    let sx = 0, sy = 0; this.grid.forEach((row, y) => row.forEach((c, x) => { if (c.kind === 'src') { sx = x; sy = y; } }));
    const seen = new Set([sx + ',' + sy]), q = [[sx, sy]], leaks = [];
    while (q.length) { const [x, y] = q.shift(), c = this.grid[y][x];
      for (let d = 0; d < 4; d++) { if (!(c.m & (1 << d))) continue; const nx = x + DX[d], ny = y + DY[d], n = this.cell(nx, ny);
        if (!n || n.kind === 'blank' || !(n.m & (1 << ((d + 2) % 4)))) { leaks.push([x, y, d]); continue; }
        const k = nx + ',' + ny; if (!seen.has(k)) { seen.add(k); q.push([nx, ny]); } } }
    const total = this.grid.flat().filter(c => c.kind !== 'blank').length;
    return { seen, leaks, total, ok: leaks.length === 0 && seen.size === total };
  },
  rotate(x, y) {
    const c = this.cell(x, y); if (!c || this.solved) return;
    if (c.kind !== 'pipe') { Sound.play('deny'); return; }
    c.m = rotCW(c.m); this.moves++; Sound.play('rotate'); this.flowR = this.flow();
    if (this.flowR.ok) { this.solved = true; this.solveT = 0; Sound.play(this.si === this.defs.length - 1 ? 'solved' : 'stage'); }
  },
  hint() { if (this.solved) return; if (this.bk) { const d = this.defs[this.si], i = d.sol.findIndex((v, k) => v !== this.bk.st[k]); if (i >= 0) { this.bk.cur = i; this.hintT = 2; Sound.play('move'); } return; } const flat = this.grid.flat(); const i = flat.findIndex(c => c.kind === 'pipe' && c.m !== c.sol); if (i < 0) return; this.cur = { x: i % this.cols, y: Math.floor(i / this.cols) }; this.hintT = 2; this.hintC = { ...this.cur }; Sound.play('move'); },
  bkSum(k) { const d = this.defs[this.si]; return d.loads.reduce((s, v, i) => s + (this.bk.st[i] === k ? v : 0), 0); },
  bkGeo() { const n = this.defs[this.si].loads.length, cw = Math.min(40, Math.floor((W - 12) / n)); return { n, cw, ox: Math.floor((W - cw * n) / 2), top: 46, bot: H - 52 }; },
  bkSet(i, dirn) { if (this.solved) return; const b = this.bk, d = this.defs[this.si]; b.cur = i; const s = b.st[i]; b.st[i] = dirn === 0 ? (s + 1) % 3 : dirn < 0 ? (s === 2 ? 0 : 1) : (s === 1 ? 0 : 2); if (b.st[i] !== s) { this.moves++; Sound.play('rotate'); }
    if (this.bkSum(1) === d.A && this.bkSum(2) === d.B) { this.solved = true; this.solveT = 0; Sound.play(this.si === this.defs.length - 1 ? 'solved' : 'stage'); } },
  bkUpdate() { const b = this.bk, n = b.st.length;
    if (Input.rep('left')) { b.cur = (b.cur + n - 1) % n; Sound.play('move'); } if (Input.rep('right')) { b.cur = (b.cur + 1) % n; Sound.play('move'); }
    if (Input.rep('up')) this.bkSet(b.cur, -1); if (Input.rep('down')) this.bkSet(b.cur, 1); if (Input.p('A')) this.bkSet(b.cur, 0); if (Input.p('Y')) this.hint();
    if (Input.p('B') || Input.p('START')) { this.close(); HUD.toast(this.defs[this.si].leaveMsg || 'Come back any time'); } },
  bkRender(g) { const d = this.defs[this.si], b = this.bk, G0 = this.bkGeo(), rm = Settings.d.reduce, a = this.bkSum(1), bb = this.bkSum(2);
    g.fillStyle = '#0d0f13'; g.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 8) { g.fillStyle = y % 16 ? '#12151a' : '#101318'; g.fillRect(0, y, W, 8); }
    const bar = (y, lab, v, tg, col) => { const ok = v === tg, over = v > tg, c = ok ? '#7cf27c' : over ? '#ff5a4a' : col; g.fillStyle = '#1e232b'; g.fillRect(6, y, W - 12, 13); g.fillStyle = '#2c333e'; g.fillRect(6, y, W - 12, 1); g.fillStyle = c; g.globalAlpha = .28; g.fillRect(7, y + 1, Math.min(1, v / tg) * (W - 14), 11); g.globalAlpha = 1; g.fillRect(7, y + 11, Math.min(1, v / tg) * (W - 14), 1); ptext(g, lab, 10, y + 4, c); const t = v + '/' + tg; ptext(g, t, W - 10 - ptextW(t, 2), y + 2, c, 2); return c; };
    const ca = bar(26, d.labA, a, d.A, PAL.amber), cb = bar(G0.bot + 8, d.labB, bb, d.B, '#e8c25a');
    for (let i = 0; i < G0.n; i++) { const x = G0.ox + i * G0.cw, cx = x + (G0.cw >> 1), st = b.st[i], mid = (G0.top + G0.bot) >> 1, ky = st === 1 ? G0.top + 8 : st === 2 ? G0.bot - 8 : mid;
      g.fillStyle = '#191d24'; g.fillRect(x + 2, G0.top, G0.cw - 4, G0.bot - G0.top); g.fillStyle = '#0c0e12'; g.fillRect(cx - 2, G0.top + 4, 4, G0.bot - G0.top - 8);
      if (st) { g.fillStyle = st === 1 ? ca : cb; if (st === 1) g.fillRect(cx - 1, 39, 2, ky - 39); else g.fillRect(cx - 1, ky, 2, G0.bot + 8 - ky); if (!rm) { g.fillStyle = '#fff'; const o = ((this.t * 30) | 0) % 9; g.fillRect(cx - 1, st === 1 ? ky - o : ky + o, 2, 2); } }
      const kw = Math.min(22, G0.cw - 6); g.fillStyle = '#0a0b0e'; g.fillRect(cx - kw / 2 - 1, ky - 8, kw + 2, 16); g.fillStyle = st === 1 ? '#8a5a20' : st === 2 ? '#7a6a20' : '#4a5260'; g.fillRect(cx - kw / 2, ky - 7, kw, 14); g.fillStyle = st ? '#ffe9a8' : '#aab2c0'; g.fillRect(cx - kw / 2, ky - 7, kw, 2);
      const t = String(d.loads[i]); ptext(g, t, cx - ptextW(t, 2) / 2 + 1, ky - 3, st ? '#fff6d0' : '#d8dce4', 2);
      if (!this.solved && i === b.cur && (Input.device !== 'touch' || !this.moves) && Math.floor(this.t * 3) % 3) { g.strokeStyle = PAL.amber; g.lineWidth = 2; g.strokeRect(x + 2, G0.top, G0.cw - 4, G0.bot - G0.top); }
      if (this.hintT > 0 && i === b.cur && Math.floor(this.hintT * 6) % 2) { g.strokeStyle = '#7cf27c'; g.lineWidth = 2; g.strokeRect(x + 1, G0.top - 1, G0.cw - 2, G0.bot - G0.top + 2); } }
    ptext(g, d.name, 8, H - 12, '#8a94a4'); const help = Input.device === 'touch' ? 'TAP ABOVE OR BELOW' : 'UP: TOP BUS  DOWN: LOW BUS'; ptext(g, help, W - 8 - ptextW(help), H - 12, '#6a7484');
    if (this.solved) { g.fillStyle = 'rgba(10,30,18,.6)'; g.fillRect(0, H / 2 - 14, W, 28); const t = this.si === this.defs.length - 1 ? (d.doneText || 'BALANCED') : 'STAGE CLEAR'; ptext(g, t, W / 2 - ptextW(t, 2) / 2, H / 2 - 5, '#9ff2c0', 2); } },
  tap(lx, ly) { if (this.bk) { const G0 = this.bkGeo(), i = Math.floor((lx - G0.ox) / G0.cw); if (i >= 0 && i < G0.n) { const st = this.bk.st[i], mid = (G0.top + G0.bot) / 2, ky = st === 1 ? G0.top + 8 : st === 2 ? G0.bot - 8 : mid; this.bkSet(i, Math.abs(ly - ky) < 9 ? 0 : ly < ky ? -1 : 1); } return; } const x = Math.floor((lx - this.ox) / this.T), y = Math.floor((ly - this.oy) / this.T); if (this.cell(x, y)) { this.cur = { x, y }; this.rotate(x, y); } },
  update(dt) {
    this.t += dt; this.hintT = Math.max(0, this.hintT - dt);
    if (this.solved) { this.solveT += dt; if (this.solveT > 1.5) { if (this.si < this.defs.length - 1) { this.si++; if (this.defs === PUZZLES) G.flags.p1 = 1; this.load(); HUD.toast(this.defs[this.si].name); } else { this.close(); this.onDone && this.onDone(); } } return; }
    if (this.bk) return this.bkUpdate();
    const mv = (dx, dy) => { let x = this.cur.x, y = this.cur.y; for (let i = 0; i < 8; i++) { x = (x + dx + this.cols) % this.cols; y = (y + dy + this.rows) % this.rows; if (this.grid[y][x].kind !== 'blank') break; } this.cur = { x, y }; Sound.play('move'); };
    if (Input.rep('left')) mv(-1, 0); if (Input.rep('right')) mv(1, 0); if (Input.rep('up')) mv(0, -1); if (Input.rep('down')) mv(0, 1);
    if (this.timeLeft > 0) { this.timeLeft -= dt; if (this.timeLeft <= 0) { const fail = this.defs[this.si].onFail; this.close(); fail && fail(); return; } if (Math.floor(this.timeLeft) !== Math.floor(this.timeLeft + dt) && this.timeLeft < 6) Sound.play('heart'); }
    if (Input.p('A')) this.rotate(this.cur.x, this.cur.y);
    if (Input.p('Y')) this.hint();
    if (Input.p('B') || Input.p('START')) { this.close(); HUD.toast(this.defs[this.si].leaveMsg || 'Bank 7 still drifting — come back any time'); }
  },
  render(g) {
    if (this.bk) return this.bkRender(g);
    const T = this.T, fr = this.flowR, rm = Settings.d.reduce;
    g.fillStyle = '#0f0b0e'; g.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 8) { g.fillStyle = y % 16 ? '#141014' : '#120d11'; g.fillRect(0, y, W, 8); }
    { const bx = this.ox - 7, by = this.oy - 7, bw = this.cols * T + 14, bh = this.rows * T + 14; g.fillStyle = '#0c0808'; g.fillRect(bx - 2, by - 2, bw + 4, bh + 4); g.fillStyle = '#c8a050'; g.fillRect(bx - 1, by - 1, bw + 2, bh + 2); g.fillStyle = '#6a5228'; g.fillRect(bx, by + bh, bw + 1, 1); g.fillRect(bx + bw, by, 1, bh + 1); g.fillStyle = '#2c2226'; g.fillRect(bx, by, bw, bh); g.fillStyle = '#e8c25a'; for (const [a, b] of [[bx + 1, by + 1], [bx + bw - 3, by + 1], [bx + 1, by + bh - 3], [bx + bw - 3, by + bh - 3]]) g.fillRect(a, b, 2, 2); }
    for (let y = 0; y < this.rows; y++) for (let x = 0; x < this.cols; x++) {
      const c = this.grid[y][x], px = this.ox + x * T, py = this.oy + y * T, wet = fr.seen.has(x + ',' + y), cx = px + T / 2, cy = py + T / 2;
      if (c.kind === 'blank') { stoneAt(g, px, py, T, T, '#231a1d', '#140d10'); g.fillStyle = '#3a2c30'; g.fillRect(px + 3, py + 3, 1, 1); g.fillRect(px + T - 5, py + 3, 1, 1); g.fillRect(px + 3, py + T - 5, 1, 1); g.fillRect(px + T - 5, py + T - 5, 1, 1); continue; }
      stoneAt(g, px, py, T, T, '#2e2428', '#140d10');
      const col = this.solved ? '#9ff2ea' : wet ? PAL.cyan : '#7a5038', w = 6;
      for (let k = 0; k < 4; k++) if (c.m & (1 << k)) {
        g.fillStyle = '#120c0e'; if (k === 0) g.fillRect(cx - w / 2 - 1, py, w + 2, T / 2); if (k === 2) g.fillRect(cx - w / 2 - 1, cy, w + 2, T / 2); if (k === 1) g.fillRect(cx, cy - w / 2 - 1, T / 2, w + 2); if (k === 3) g.fillRect(px, cy - w / 2 - 1, T / 2, w + 2);
        g.fillStyle = col; if (k === 0) g.fillRect(cx - w / 2, py, w, T / 2); if (k === 2) g.fillRect(cx - w / 2, cy, w, T / 2); if (k === 1) g.fillRect(cx, cy - w / 2, T / 2, w); if (k === 3) g.fillRect(px, cy - w / 2, T / 2, w);
        g.fillStyle = this.solved ? '#e0fffb' : wet ? '#a8f4ee' : '#b07a52'; if (k === 0) g.fillRect(cx - w / 2, py, 1, T / 2); if (k === 2) g.fillRect(cx - w / 2, cy, 1, T / 2); if (k === 1) g.fillRect(cx, cy - w / 2, T / 2, 1); if (k === 3) g.fillRect(px, cy - w / 2, T / 2, 1);
        g.fillStyle = this.solved ? '#5ab8b0' : wet ? '#2a8a86' : '#4a2e1e'; if (k === 0) g.fillRect(cx + w / 2 - 1, py, 1, T / 2); if (k === 2) g.fillRect(cx + w / 2 - 1, cy, 1, T / 2); if (k === 1) g.fillRect(cx, cy + w / 2 - 1, T / 2, 1); if (k === 3) g.fillRect(px, cy + w / 2 - 1, T / 2, 1);
        if (wet && !rm) { g.fillStyle = '#e8fffd'; const o = ((this.t * 24) | 0) % 8; for (let s = o; s < T / 2; s += 8) { if (k === 0) g.fillRect(cx - 1, cy - s, 2, 2); if (k === 2) g.fillRect(cx - 1, cy + s - 1, 2, 2); if (k === 1) g.fillRect(cx + s - 1, cy - 1, 2, 2); if (k === 3) g.fillRect(cx - s, cy - 1, 2, 2); } }
      }
      g.fillStyle = '#120c0e'; g.fillRect(cx - 5, cy - 5, 10, 10); g.fillStyle = wet ? '#2a7a76' : '#5a3a28'; g.fillRect(cx - 4, cy - 4, 8, 8); g.fillStyle = wet ? '#6adad2' : '#8a5e40'; g.fillRect(cx - 4, cy - 4, 8, 1); g.fillRect(cx - 4, cy - 4, 1, 8); g.fillStyle = col; g.fillRect(cx - 2, cy - 2, 4, 4); g.fillStyle = '#fff'; g.globalAlpha = .5; g.fillRect(cx - 2, cy - 2, 1, 1); g.globalAlpha = 1;
      if (c.kind === 'src') { g.fillStyle = PAL.amber; g.fillRect(cx - 7, cy - 7, 14, 14); g.fillStyle = '#5a2a10'; g.fillRect(cx - 5, cy - 5, 10, 10); ptext(g, 'P', cx - 1, cy - 2, PAL.amber); if (c.label) ptext(g, c.label, cx - ptextW(c.label) / 2, py + T - 5, PAL.red); }
      if (c.kind === 'out') { const lit = wet && fr.leaks.length === 0; g.fillStyle = '#d8dcd0'; g.fillRect(cx - 7, cy - 8, 14, 12); g.fillStyle = '#1a1e24'; g.fillRect(cx - 6, cy - 7, 12, 10);
        const a = lit ? 0.3 : 2.6 + (rm ? 0 : Math.sin(this.t * 9) * .15); g.fillStyle = lit ? '#7cf27c' : PAL.red; for (let s = 0; s < 6; s++) g.fillRect(cx + Math.round(Math.cos(-a) * s) - 1, cy - 1 + Math.round(-Math.sin(a) * s * .8), 2, 2);
        const lb = c.label; ptext(g, lb, cx - ptextW(lb) / 2, py + T - 7, lb === 'AUX-9' ? PAL.amber : PAL.cream); }
      if (this.hintT > 0 && this.hintC && this.hintC.x === x && this.hintC.y === y && Math.floor(this.hintT * 6) % 2) { g.strokeStyle = '#7cf27c'; g.lineWidth = 2; g.strokeRect(px + 2, py + 2, T - 4, T - 4); }
    }
    for (const [x, y, d2] of fr.leaks) { const px = this.ox + x * T + T / 2 + DX[d2] * (T / 2), py = this.oy + y * T + T / 2 + DY[d2] * (T / 2); g.fillStyle = '#ff5a4a';
      for (let i = 0; i < 4; i++) { const o = rm ? i * 2 : ((this.t * 30 + i * 7) | 0) % 7; g.fillRect(px + DX[d2] * o + (DY[d2] ? (i - 2) : 0), py + DY[d2] * o + (DX[d2] ? (i - 2) : 0), 2, 2); } }
    if (!this.solved && (Input.device !== 'touch' || this.moves === 0) && Math.floor(this.t * 3) % 3) { const px = this.ox + this.cur.x * T, py = this.oy + this.cur.y * T; g.strokeStyle = PAL.amber; g.lineWidth = 2; g.strokeRect(px + 1, py + 1, T - 2, T - 2); }
    ptext(g, `FED ${fr.seen.size}/${fr.total}   LEAKS ${fr.leaks.length}`, 8, H - 12, fr.leaks.length ? '#ff8a6a' : '#9ff2ea');
    if (this.timeLeft > 0 && !this.solved) { const tl = `VALE: ${Math.ceil(this.timeLeft)}S`; ptext(g, tl, W - ptextW(tl, 2) - 8, H - 14, this.timeLeft < 6 ? '#ff5a4a' : PAL.amber, 2); if (this.timeLeft < 6 && !Settings.d.reduce) { g.fillStyle = `rgba(120,0,0,${0.15 + 0.1 * Math.sin(this.t * 12)})`; g.fillRect(0, 0, W, H); } }
    if (this.solved) { g.fillStyle = 'rgba(10,30,28,.55)'; g.fillRect(0, H / 2 - 14, W, 28); const t = this.si === this.defs.length - 1 ? (this.defs[this.si].doneText || 'BANK 7 BALANCED') : 'STAGE CLEAR'; ptext(g, t, W / 2 - ptextW(t, 2) / 2, H / 2 - 5, '#9ff2ea', 2); }
  }
};
$('#pHint').onclick = () => Puzzle.hint();
$('#pLeave').onclick = () => { Puzzle.close(); };

// ---------- world: map, player, NPCs, interaction, rendering
const World = {
  map: null, layer: null, npcs: [], sheets: {}, cam: { x: 0, y: 0 }, target: null, exitArmed: true, parts: [],
  sheetFor(id) { if (!this.sheets[id]) { const L = CAST[id].look(); this.sheets[id] = L.cadet ? makeCadet(L) : L.accredited ? makeAccredited(L) : makeChar(L); } return this.sheets[id]; },
  resetSheets() { this.sheets = {}; this.busts = {}; P.sheet = makeChar(playerLook()); },
  busts: {},
  bustFor(id) { if (id === 'kael') return makeBust(Object.assign(playerLook(), { mouth: MOUTH.kael, scar: G.mode === 'world' && (F('ranForHer') || F('spatAtHer')) })); if (!this.busts[id]) this.busts[id] = makeBust(Object.assign({}, CAST[id].look(), { mouth: MOUTH[id] })); return this.busts[id]; },
  load(id, spawn, noNPC) {
    G.mapId = id; this.map = MAPS[id]; this.layer = renderMapLayer(this.map);
    if (spawn) { P.x = spawn.x; P.y = spawn.y; P.dir = spawn.dir | 0; }
    this.exitArmed = !this.exitAt(P.x, P.y);
    if (noNPC) this.npcs = []; else { this.refreshNPCs(); if (G.mode === 'world' && !G.heist) setTimeout(() => HUD.toast(this.map.name), 350); } this.parts = []; if (!noNPC) Sound.music(this.map.music); this.snapCam(true); HUD.dirty = true;
    if (!this.map.visited) { this.map.visited = 1; }
  },
  refreshNPCs() {
    if (G.heist) return;
    const keep = {}; for (const n of this.npcs) keep[n.id] = n;
    this.npcs = NPCS.filter(n => n.map === G.mapId && (!n.when || n.when())).map(n => {
      const k = keep[n.id]; const base = { barkCd: k ? k.barkCd : undefined, id: n.id, x: n.at[0] * 16 + 8, y: n.at[1] * 16 + 12, dir: n.dir, home: n.dir, wander: n.wander, wi: 0, wait: 1 + Math.random() * 2, anim: 0, moving: false, face: 0 };
      if (k && n.wander) { base.x = k.x; base.y = k.y; base.wi = k.wi; }
      return base;
    });
  },
  tileAt(px, py) { const tx = Math.floor(px / 16), ty = Math.floor(py / 16), m = this.map; if (tx < 0 || ty < 0 || tx >= m.w || ty >= m.h) return '#'; return m.grid[ty][tx]; },
  solidAt(px, py) { return SOLID.has(this.tileAt(px, py)); },
  boxHits(x, y, self) {
    const x0 = x - 5, x1 = x + 5, y0 = y - 5, y1 = y + 1;
    for (const [px, py] of [[x0, y0], [x1, y0], [x0, y1], [x1, y1], [x, y0], [x, y1]]) if (this.solidAt(px, py)) return true;
    for (const n of this.npcs) if (n !== self && Math.abs(n.x - x) < 10 && Math.abs(n.y - y) < 7) return true;
    if (self && Math.abs(P.x - x) < 10 && Math.abs(P.y - y) < 7) return true;
    return false;
  },
  exitAt(x, y) { const tx = Math.floor(x / 16), ty = Math.floor((y - 2) / 16); for (const e of this.map.exits) for (const [ex, ey] of e.tiles) if (ex === tx && ey === ty) return e; return null; },
  findTarget() {
    const FX = [0, 0, -1, 1][P.dir], FY = [1, -1, 0, 0][P.dir]; // facing: 0 down, 1 up, 2 left, 3 right
    const fx = P.x + FX * 12, fy = P.y - 4 + FY * 12;
    let best = null, bd = 13;
    for (const n of this.npcs) { const d = Math.hypot(n.x - fx, n.y - 4 - fy); if (d < bd) { bd = d; best = { kind: 'npc', id: n.id, n, x: n.x, y: n.y - 23 }; } }
    if (best) return best;
    const probes = [[fx, fy], [fx + FY * 5, fy + FX * 5], [fx - FY * 5, fy - FX * 5]];
    for (const [px, py] of probes) { const tx = Math.floor(px / 16), ty = Math.floor(py / 16);
      for (const h of this.map.hot) for (const [hx, hy] of h.tiles) if (hx === tx && hy === ty) { const xs = h.tiles.map(t => t[0]), ys = h.tiles.map(t => t[1]); return { kind: 'hot', id: h.id, x: (Math.min(...xs) + Math.max(...xs) + 1) * 8, y: Math.min(...ys) * 16 - 4 }; } }
    return null;
  },
  interact(t) {
    G.flags.interacted = 1; HUD.dirty = true;
    if (G.heist === 2) { if (t.id === 'pillarFest') { Game.onFestDone(); return; } Dialogue.start(t.kind === 'npc' && !t.n.patrol ? FEST_WHISPER(t.id) : [narr('Not now. The Pillar. Top hook.')]); return; }
    if (G.heist) { if (t.id === 'relay') { if (G.flags.relayCut) { Dialogue.start([narr('The relay is dead. The audit gauge is frozen on a lie.')]); return; } G.flags.relayCut = 1; Sound.play('rotate'); { const pr = this.npcs.find(n => n.id === 'proctor'); if (pr) { pr.wander = HEIST_LANE_N; pr.wi = 0; pr.wait = 0.2; } } this.grace = 3; Dialogue.start([narr('You pry the panel and pull the audit fuse. The needle on the relay freezes mid-twitch.'), say('kael', 'There. For the next hour, the Authority thinks Bank Seven is the most boring bank in Cinderwell.'), narr('The click carries. Across the bay, the Night Proctor stops, listens, and turns north. He is going to walk the valve wall now. Right past Bank Seven.'), narr('Checkpoint: if you are seen now, you will start back here.')]); return; }
      if (t.id === 'valves') { if (!G.flags.relayCut) { Dialogue.start([say('kael', "(Not yet. The audit relay on the east wall will log any twitch on this bank. Cut it first.)")]); return; } Puzzle.open([HEIST_PUZZLE], Game.onHeistDone); return; } Dialogue.start([t.id === 'seren' ? say('seren', "Go. I've got the door. If his lantern turns your way, freeze, or get behind something solid.") : narr('Not now. Bank Seven. Before the lantern comes back around.')]); return; }
    if (t.kind === 'npc') { const n = t.n; n.dir = Math.abs(P.x - n.x) > Math.abs(P.y - n.y) ? (P.x < n.x ? 2 : 3) : (P.y < n.y ? 1 : 0); n.face = 2.5; Dialogue.start(TALK[t.id](), () => this.afterBeat()); }
    else { const s = HOT[t.id](); Dialogue.start(s, () => this.afterBeat()); }
  },
  afterBeat() { this.refreshNPCs(); HUD.dirty = true; },
  update(dt) {
    if (Input.p('START')) { Menus.pause(); return; }
    if (Input.p('L') || Input.p('R')) { Menus.journal(); return; }
    let vx = (Input.h('right') ? 1 : 0) - (Input.h('left') ? 1 : 0), vy = (Input.h('down') ? 1 : 0) - (Input.h('up') ? 1 : 0);
    P.moving = !!(vx || vy);
    if (P.moving) {
      if (vx && vy) { vx *= .7071; vy *= .7071; }
      if (Math.abs(vx) > Math.abs(vy)) P.dir = vx < 0 ? 2 : 3; else if (Math.abs(vy) > Math.abs(vx)) P.dir = vy < 0 ? 1 : 0; else if (!((P.dir === 2 && vx < 0) || (P.dir === 3 && vx > 0) || (P.dir === 1 && vy < 0) || (P.dir === 0 && vy > 0))) P.dir = vy < 0 ? 1 : 0;
      const sp = 74 * dt, nx = P.x + vx * sp, ny = P.y + vy * sp;
      if (!this.boxHits(nx, P.y)) P.x = nx; if (!this.boxHits(P.x, ny)) P.y = ny;
      P.anim += dt; P.moved += sp; P.stepT = (P.stepT || 0) + dt; if (P.stepT > 0.3) { P.stepT = 0; Sound.play(this.tileAt(P.x, P.y - 2) === ',' ? 'stepg' : 'step'); if (!Settings.d.reduce) for (let i = 0; i < 2; i++) this.parts.push({ x: P.x - 3 + Math.random() * 6, y: P.y, v: 4 + Math.random() * 5, s: Math.random() * 6, c: '#7a6a60', steam: 1, life: 0.5 }); }
    } else P.anim = 0;
    if (G.heist) { this.heistCheck(dt); if (this.caughtT > 0) return; this.boltCd = (this.boltCd || 0) - dt; if (Input.p('B') && this.boltCd <= 0) this.throwBolt(); const t = this.target = this.findTarget(), hold = t && ((G.heist === 1 && t.id === 'relay' && !G.flags.relayCut) || (G.heist === 2 && t.id === 'pillarFest'));
      if (hold) { if (Input.h('A') && !P.moving) { const w0 = this.work || 0; this.work = w0 + dt; if (Math.floor(this.work * 5) !== Math.floor(w0 * 5)) Sound.play('rotate'); if (this.work >= WORK_T) { this.work = 0; this.interact(t); } } else this.work = Math.max(0, (this.work || 0) - dt * 0.6); }
      else { this.work = 0; if (Input.p('A') && t) { Sound.play('blip'); this.interact(t); } }
      this.updateNPCs(dt); return; }
    const ex = this.exitAt(P.x, P.y);
    if (!ex) this.exitArmed = true; else if (this.exitArmed && ex.when && !ex.when()) { this.exitArmed = false; Sound.play('deny'); Dialogue.start(ex.deny()); return; } else if (this.exitArmed) { this.exitArmed = false; Sound.play('door'); Fade.go(() => { this.load(ex.to, ex.spawn); Game.autosave(); }); return; }
    this.target = this.findTarget();
    if (Input.p('A') && this.target) { Sound.play('blip'); this.interact(this.target); }
    this.updateNPCs(dt);
  },
  updateNPCs(dt) {
    for (const n of this.npcs) {
      if (n.patrol) { // lamps sweep: turn toward the wanted facing instead of snapping
        if (n.ang === undefined) n.ang = DIRA[n.dir];
        if (!(n.inv && n.invT > 0)) { let d = DIRA[n.dir] - n.ang; d = Math.atan2(Math.sin(d), Math.cos(d)); const sp = (n.moving ? 6 : 1.5) * dt; n.ang += Math.abs(d) < sp ? d : Math.sign(d) * sp; }
        n.vdir = [3, 0, 2, 1][Math.round(n.ang / (Math.PI / 2)) & 3];
      }
      n.barkCd = (n.barkCd === undefined ? 1 + Math.random() * 3 : n.barkCd) - dt;
      if (n.bark) { n.bark.life -= dt; if (n.bark.life <= 0) n.bark = null; }
      if (!n.bark && n.barkCd <= 0 && !Dialogue.active && G.mode === 'world' && Math.hypot(P.x - n.x, P.y - n.y) < 48) { const l = barks(n.id); if (l.length) { n.bark = { t: l[Math.floor(Math.random() * l.length)], life: 2.6 }; } n.barkCd = 14 + Math.random() * 10; }
      if (n.face > 0) { n.face -= dt; if (n.face <= 0 && !n.wander) n.dir = n.home; n.moving = false; continue; }
      if (n.inv) { // heard a noise: walk over, look around, go back to the route
        if (n.invT > 0) { n.invT -= dt; n.moving = false; n.ang += 2.7 * dt; if (n.invT <= 0) { n.inv = null; n.wait = 0.3; n.dir = [3, 0, 2, 1][Math.round(n.ang / (Math.PI / 2)) & 3]; } continue; } // a full, slow look around
        const dx = n.inv.x - n.x, dy = n.inv.y - n.y, sp = 40 * dt;
        if (Math.abs(dx) < 2 && Math.abs(dy) < 6 || n.invGive > 4) { n.invT = 2.4; n.invK = -1; continue; }
        n.invGive = (n.invGive || 0) + dt;
        let moved = false;
        if (Math.abs(dx) >= 2) { const nx = n.x + Math.sign(dx) * Math.min(sp, Math.abs(dx)); if (!this.solidAt(nx, n.y) && !this.solidAt(nx, n.y - 6)) { n.x = nx; n.dir = dx < 0 ? 2 : 3; moved = true; } }
        if (!moved && Math.abs(dy) >= 2) { const ny = n.y + Math.sign(dy) * Math.min(sp, Math.abs(dy)); if (!this.solidAt(n.x, ny) && !this.solidAt(n.x, ny - 6)) { n.y = ny; n.dir = dy < 0 ? 1 : 0; moved = true; } }
        if (!moved) { n.invT = 2.4; n.invK = -1; }
        n.moving = moved; n.anim += dt; continue;
      }
      if (!n.wander) { n.moving = false; continue; }
      if (n.wait > 0) { n.wait -= dt; n.moving = false; continue; }
      const [tx, ty] = n.wander[n.wi], gx = tx * 16 + 8, gy = ty * 16 + 12;
      const dx = gx - n.x, dy = gy - n.y;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) { const wp = n.wander[n.wi]; if (wp[2] !== undefined) n.dir = wp[2]; n.wi = (n.wi + 1) % n.wander.length; n.wait = n.patrol ? (wp[3] || 1.6) * (G.flags.heistEase ? 1.8 : 1) : 0.8 + Math.random() * 2.2; n.moving = false; continue; }
      const sp = 30 * dt; let mx = 0, my = 0;
      if (Math.abs(dx) >= 1) { mx = Math.sign(dx) * Math.min(sp, Math.abs(dx)); n.dir = dx < 0 ? 2 : 3; } else { my = Math.sign(dy) * Math.min(sp, Math.abs(dy)); n.dir = dy < 0 ? 1 : 0; }
      if (!n.patrol && Math.hypot(P.x - (n.x + mx), P.y - (n.y + my)) < 13) { n.moving = false; n.wait = 0.4; continue; }
      n.x += mx; n.y += my; n.moving = true; n.anim += dt;
    }
  },
  flash: 0, flashC: '#f00', shakeT: 0, darkOverride: null, dynLights: [], caughtT: 0,
  fxFlash(c, s) { this.flash = 1; this.flashC = c; this.shakeT = s || 0; },
  // ---- heist: lantern vision cones with line of sight; caught = back to the door
  seesPlayer(n) {
    const ox = n.x, oy = n.y - 6, dx = P.x - ox, dy = (P.y - 4) - oy, d = Math.hypot(dx, dy);
    if (d < 12) return true; if (d > 72) return false;
    let df = Math.atan2(dy, dx) - (n.ang === undefined ? DIRA[n.dir] : n.ang); df = Math.atan2(Math.sin(df), Math.cos(df)); if (Math.abs(df) > 0.55) return false;
    for (let s = 6; s < d; s += 4) if (this.solidAt(ox + dx * s / d, oy + dy * s / d)) return false;
    return true;
  },
  throwBolt() {
    const FX = [0, 0, -1, 1][P.dir], FY = [1, -1, 0, 0][P.dir]; let x = P.x, y = P.y - 4, d = 0;
    while (d < 70 && !this.solidAt(x + FX * 4, y + FY * 4)) { x += FX * 4; y += FY * 4; d += 4; }
    this.bolt = { x0: P.x, y0: P.y - 8, x1: x, y1: y + 4, t: 0 }; this.boltCd = 1.2; Sound.play('move');
  },
  boltLand(b) {
    Sound.play('clink'); this.ripple = { x: b.x1, y: b.y1, t: 0 };
    for (const n of this.npcs) if (n.patrol && Math.hypot(n.x - b.x1, n.y - b.y1) < 120) { n.inv = { x: b.x1, y: b.y1 + 4 }; n.invT = 0; n.invGive = 0; n.bark = { t: '?!', life: 1.4 }; Sound.play('huh'); }
  },
  heistCheck(dt) {
    if (this.bolt) { this.bolt.t += dt / 0.45; if (this.bolt.t >= 1) { const b = this.bolt; this.bolt = null; this.boltLand(b); } }
    if (this.ripple) { this.ripple.t += dt; if (this.ripple.t > 0.7) this.ripple = null; }
    if (this.caughtT > 0) { if (Dialogue.active) return; this.caughtT -= dt; if (this.caughtT <= 0) { if (G.heist === 2) { P.x = 7 * 16 + 8; P.y = 13 * 16 + 4; P.dir = 1; } else if (G.flags.relayCut) { P.x = 20 * 16 + 8; P.y = 6 * 16 + 4; P.dir = 2; } else { P.x = 24; P.y = 7 * 16 + 4; P.dir = 3; } Game.resetHeist(); } return; }
    this.dynLights = this.npcs.filter(n => n.patrol).map(n => { const a = n.ang === undefined ? DIRA[n.dir] : n.ang; return { x: n.x + Math.cos(a) * 14, y: n.y - 6 + Math.sin(a) * 14, r: 46, c: '#ffd070' }; });
    let seen = 0, by = null; if (this.grace > 0) this.grace -= dt;
    for (const n of this.npcs) if (n.patrol && !(this.grace > 0) && this.seesPlayer(n)) { const d = Math.hypot(P.x - n.x, P.y - 4 - (n.y - 6)), k = d < 14 ? 99 : 1.5 + (72 - d) / 72 * 2.8; if (k > seen) { seen = k; by = n; } }
    if (seen) { this.alert = Math.min(1, (this.alert || 0) + seen * (G.flags.heistEase ? .6 : 1) * dt); this.alertPeak = Math.max(this.alertPeak || 0, this.alert); this.seenBy = by; this.hbT = (this.hbT || 0) - dt; if (this.hbT <= 0) { Sound.play('heart'); this.hbT = 0.32; } }
    else if (this.alert > 0) { this.alert = Math.max(0, this.alert - dt * 0.9); if (this.alert === 0) { if (this.alertPeak > 0.4) { G.flags.closeCalls = (G.flags.closeCalls | 0) + 1; HUD.toast(G.heist === 1 ? ['Seren: "Close. Too close."', 'Seren: "Breathe. He didn\'t see."', 'Seren: "Stop showing off."'][G.flags.closeCalls % 3] : ['Ivo: "I felt that from here."', 'Tavi: "...Kael!"', 'Close call'][G.flags.closeCalls % 3]); Sound.play('back'); } this.alertPeak = 0; this.seenBy = null; } }
    for (const n of this.npcs) if (n === by && this.alert >= 1) {
      this.alert = 0; this.alertPeak = 0; this.work = 0;
      if (G.heist === 2) { this.caughtT = 0.6; const k = G.flags.caught2 = (G.flags.caught2 || 0) + 1; Sound.play('alarm'); this.fxFlash('#ff3020', 0.4); if (k >= 2) G.flags.heistEase = 1; Dialogue.start(FEST_CAUGHT(k, n.id)); return; }
      this.caughtT = 0.6; G.flags.caught = (G.flags.caught || 0) + 1; Sound.play('alarm'); this.fxFlash('#ff3020', 0.4);
      const n2 = G.flags.caught; if (n2 >= 3) G.flags.heistEase = 1;
      Dialogue.start([say('seren', ['Back! Back! He nearly had you.', 'Kael! Down! ...Okay. Okay. Slower this time. Use the crates.', "I'll knock something over by the door when he's at the far end. Move when you hear it."][Math.min(2, n2 - 1)])]);
      return;
    }
  },
  drawCones(g, cx, cy, t) {
    if (this.bolt) { const b = this.bolt, k = b.t, x = b.x0 + (b.x1 - b.x0) * k, y = b.y0 + (b.y1 - b.y0) * k - Math.sin(k * Math.PI) * 18; g.fillStyle = '#c8ccd4'; g.fillRect(Math.round(x - cx) - 1, Math.round(y - cy) - 1, 2, 2); }
    if (this.ripple) { const r = this.ripple; g.strokeStyle = `rgba(255,255,255,${0.6 - r.t * 0.8})`; g.lineWidth = 1; g.beginPath(); g.arc(r.x - cx, r.y - cy, 4 + r.t * 40, 0, Math.PI * 2); g.stroke(); }
    for (const n of this.npcs) if (n.patrol) {
      const a0 = n.ang === undefined ? DIRA[n.dir] : n.ang, ox = n.x - cx, oy = n.y - 6 - cy, R = 72, hot = this.seenBy === n ? (this.alert || 0) : 0;
      g.fillStyle = this.caughtT > 0 ? 'rgba(255,60,40,.25)' : hot ? `rgba(255,${214 - hot * 150 | 0},${120 - hot * 80 | 0},${.16 + hot * .14})` : 'rgba(255,214,120,.15)';
      g.beginPath(); g.moveTo(ox, oy); for (let a = -0.55; a <= 0.551; a += 0.11) { let r = 0; while (r < R && !this.solidAt(n.x + Math.cos(a0 + a) * r, n.y - 6 + Math.sin(a0 + a) * r)) r += 3; g.lineTo(ox + Math.cos(a0 + a) * r, oy + Math.sin(a0 + a) * r); } g.closePath(); g.fill();
      g.strokeStyle = hot ? 'rgba(255,120,80,.5)' : 'rgba(255,230,160,.22)'; g.lineWidth = 1; g.stroke();
      if (hot > 0.15) ptext(g, hot > 0.6 ? '!' : '?', Math.round(n.x - cx) - 1, Math.round(n.y - cy) - 32, hot > 0.6 ? '#ff5a4a' : '#ffe08a', 2);
    }
    // the eye over Kael's head: how close he is to being made
    if (this.grace > 0 && Math.floor(t * 8) % 2) { g.fillStyle = 'rgba(160,240,230,.5)'; g.fillRect(Math.round(P.x - cx) - 7, Math.round(P.y - cy) + 1, 14, 1); }
    if (this.alert > 0.02) { const x = Math.round(P.x - cx), y = Math.round(P.y - cy) - 27, a = this.alert; g.fillStyle = '#120a0e'; g.fillRect(x - 9, y - 1, 18, 5); g.fillStyle = '#3a2a24'; g.fillRect(x - 8, y, 16, 3); g.fillStyle = a > 0.6 ? '#ff5a4a' : '#ffb35a'; g.fillRect(x - 8, y, Math.round(16 * a), 3); if (!Settings.d.reduce) { g.fillStyle = `rgba(160,10,10,${a * 0.22})`; g.fillRect(0, 0, W, H); } }
    // hold-to-work progress
    if (this.work > 0 && this.target) { const x = Math.round(this.target.x - cx), y = Math.round(this.target.y - cy) - 8, k = Math.min(1, this.work / WORK_T); g.fillStyle = '#120a0e'; g.fillRect(x - 13, y - 1, 26, 6); g.fillStyle = '#3a2a24'; g.fillRect(x - 12, y, 24, 4); g.fillStyle = '#7cf27c'; g.fillRect(x - 12, y, Math.round(24 * k), 4); }
  },
  snapCam(hard) { const m = this.map; if (Cutscene.active) { const mw = m.w * 16, mh = m.h * 16, c = Cutscene.cam, up = this.land ? H * 0.11 : 0; /* keep the action above the dialogue box */ this.cam.x = mw <= W ? (mw - W) / 2 : clamp(c.x - W / 2, 0, mw - W); this.cam.y = mh <= H ? (mh - H) / 2 + (mh <= H * .8 ? up : 0) : clamp(c.y + up - H / 2, 0, mh - H); if (Cutscene.shake && !Settings.d.reduce) { this.cam.x += (Math.random() - .5) * 4 * Cutscene.shake; this.cam.y += (Math.random() - .5) * 4 * Cutscene.shake; } return; } const mw = m.w * 16, mh = m.h * 16, tx = mw <= W ? (mw - W) / 2 : clamp(P.x - W / 2, 0, mw - W), ty = mh <= H ? (mh - H) / 2 : clamp(P.y - 8 - H / 2, 0, mh - H); if (hard || this.camHard || Math.abs(tx - this.cam.x) > 90 || Math.abs(ty - this.cam.y) > 90 || Settings.d.reduce) { this.cam.x = tx; this.cam.y = ty; this.camHard = false; } else { this.cam.x += (tx - this.cam.x) * 0.16; this.cam.y += (ty - this.cam.y) * 0.16; if (Math.abs(tx - this.cam.x) < 0.5) this.cam.x = tx; if (Math.abs(ty - this.cam.y) < 0.5) this.cam.y = ty; } },
  render(g, t) {
    const m = this.map; this.snapCam(); const cx = Math.round(this.cam.x), cy = Math.round(this.cam.y), rm = Settings.d.reduce;
    g.fillStyle = '#0b0709'; g.fillRect(0, 0, W, H);
    if (this.shakeT > 0) this.shakeT -= 1 / 60;
    const sk = this.shakeT > 0 && !Settings.d.reduce ? Math.round((Math.random() - .5) * 4) : 0;
    g.drawImage(this.layer, -cx + sk, -cy);
    // animated props
    if (G.mapId === 'square' || G.mapId === 'fest') {
      const px = 13 * 16 - cx, py = 8 * 16 - cy, pulse = rm ? 0 : Math.sin(t * 1.3) * .5 + .5, ph = phase();
      g.fillStyle = '#5a5058'; g.fillRect(px + 4, py - 22, 8, 32); g.fillStyle = ph === 'evening' ? `rgb(255,${90 + pulse * 30 | 0},${70 + pulse * 20 | 0})` : ph === 'noon' ? `rgb(255,${238 + pulse * 15 | 0},${215 + pulse * 30 | 0})` : `rgb(255,${180 + pulse * 30 | 0},${100 + pulse * 40 | 0})`; g.fillRect(px + 5, py - 21, 6, 29); g.fillStyle = '#fff6e0'; g.fillRect(px + 7, py - 20, 2, 27);
      for (const [lx, ly] of [[7, 4], [19, 4], [9, 13], [22, 9]]) { g.fillStyle = '#3a3a40'; g.fillRect(lx * 16 + 4 - cx, ly * 16 - 13 - cy, 8, 4); g.fillStyle = '#ffd890'; g.fillRect(lx * 16 + 5 - cx, ly * 16 - 9 - cy, 6, 2); }
      const cs = typeof Cutscene !== 'undefined' && Cutscene.active ? Cutscene : null, liftOn = (cs && cs.lift) || (F('day1Done') && !F('day2Done')) || G.mapId === 'fest';
      g.fillStyle = cs && cs.lift > 1 ? '#ffffff' : liftOn ? '#3aff6a' : F('ivoTalk2') && Math.floor(t * 1.5) % 7 === 0 && !rm ? '#3aff6a' : '#1a2a1a'; g.fillRect(12 * 16 + 28 - cx, 16 + 6 - cy, 2, 2);
      if (cs && cs.lift > 1) { g.fillStyle = '#fff6dc'; g.fillRect(12 * 16 + 3 - cx, 16 + 4 - cy, 26, 12); g.fillStyle = '#cfe8ff'; g.fillRect(12 * 16 + 5 - cx, 16 + 13 - cy, 22, 3); g.fillStyle = '#3ac85a'; g.fillRect(12 * 16 + 15 - cx, 16 + 13 - cy, 3, 2); g.fillRect(12 * 16 + 16 - cx, 16 + 12 - cy, 1, 1); }
      if ((cs && cs.hung) || (F('hungLantern') && !F('day2Done') && G.mapId === 'fest')) { const lx = px + 8, ly = py - 27; g.fillStyle = '#3a2a14'; g.fillRect(lx, ly - 4, 1, 4); g.fillStyle = '#e8a040'; g.fillRect(lx - 3, ly - 1, 7, 7); g.fillRect(lx - 4, ly, 9, 5); g.fillStyle = '#ffe08a'; g.fillRect(lx - 2, ly, 5, 5); g.fillStyle = '#fff6d0'; g.fillRect(lx - 1, ly + 1, 3, 3); g.fillStyle = '#e8a040'; for (const [a, b] of [[-6, 2], [6, 2], [0, -4], [0, 8], [-4, -2], [4, -2], [-4, 6], [4, 6]]) g.fillRect(lx + a, ly + b, 1, 1); }
    }
    if (G.mapId === 'square' && F('day1Done') && !F('day2Done')) { g.fillStyle = '#d8d0c0'; for (let k = 0; k < 6.283; k += 0.14) g.fillRect(Math.round(21.5 * 16 + Math.cos(k) * 30 - cx), Math.round(6 * 16 + 12 + Math.sin(k) * 15 - cy), 2, 1); g.fillStyle = '#e8b23a'; g.fillRect(21.5 * 16 - 1 - cx, 6 * 16 + 11 - cy, 3, 3); }
    if (G.mapId === 'bay') {
      const fl = rm ? 0 : Math.random() * .3; g.fillStyle = `rgba(255,${110 + fl * 100 | 0},40,${.75 + fl})`; for (let i = 5; i < 28; i += 4) g.fillRect(14 * 16 + i - cx, 16 + 5 - cy, 2, 8);
      const off = rm || F('puzzleDone') ? 0 : ((t * 20) | 0) % 8; g.fillStyle = '#4a4a52'; for (let i = off; i < 96; i += 8) g.fillRect(2 * 16 + i - cx, 10 * 16 + 6 - cy, 4, 6);
      for (let i = 0; i < 3; i++) { const ok = F('puzzleDone'); g.fillStyle = ok || Math.floor(t * 4 + i) % 3 ? (ok ? '#7cf27c' : PAL.cyan) : '#1a3a3a'; g.fillRect(9 * 16 + 7 + i * 16 - cx, 16 + 11 - cy, 2, 2); }
      if (Math.floor(t * 2) % 2) { g.fillStyle = '#ff3020'; g.fillRect(19 * 16 + 29 - cx, 16 + 4 - cy, 2, 2); }
    }
    if (G.mapId === 'clinic') { const a = t * (F('bledAgain') ? 7 : 1.6); g.fillStyle = '#8a9a94'; for (let i = 0; i < 4; i++) { const ang = a + i * Math.PI / 2; g.fillRect(Math.round(7 * 16 + 8 - cx + Math.cos(ang) * 4) - 1, Math.round(16 + 7 - cy + Math.sin(ang) * 4) - 1, 3, 2); } }
    if (G.mapId === 'fuse') { for (let i = 0; i < 7; i++) { g.fillStyle = F('fuseDone') ? '#7cf27c' : Math.floor(t * 3 + i * 1.7) % 4 ? '#e8b23a' : '#3a2a10'; g.fillRect(2 * 16 + 5 + i * 6 - cx, 16 + 2 - cy, 2, 1); } }
    if (G.mapId === 'apt') { if (Math.floor(t * 1.2) % 2) { g.fillStyle = '#ffd070'; g.fillRect(8 * 16 + 10 - cx, 16 + 5 - cy, 3, 2); } }
    // entities sorted by y
    let ents;
    if (Cutscene.active) ents = Cutscene.actors.map(a => ({ x: a.x, y: a.y, dir: a.dir, f: a.moving ? 1 + (Math.floor(a.anim * 6) % 2) : 0, sheet: a.sheet, kn: a.kn || 0, hop: a.hop > 0 ? Math.sin(a.hop / 0.3 * Math.PI) * 4 : 0, emote: a.emote }));
    else { ents = this.npcs.map(n => ({ x: n.x, y: n.y, dir: n.vdir === undefined ? n.dir : n.vdir, f: n.moving ? 1 + (Math.floor(n.anim * 6) % 2) : 0, sheet: this.sheetFor(n.id) }));
      ents.push({ x: P.x, y: P.y, dir: P.dir, f: P.moving ? 1 + (Math.floor(P.anim * 8) % 2) : 0, sheet: P.sheet, me: 1 }); }
    ents.sort((a, b) => a.y - b.y);
    this.land = !document.body.classList.contains('portrait');
    for (const e of ents) { const fh = e.sheet.fh || 16, sx = Math.round(e.x - 8 - cx), sy = Math.round(e.y - fh + 1 - cy); if (!e.f && !rm && e.sheet.width >= 64 && ((t * 1.1 + e.x * 0.137 + e.y * 0.071) % 3.9) < 0.13) e.f = 3; g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(sx + 2, sy + fh - 2, 12, 2); g.fillRect(sx + 4, sy + fh - 3, 8, 4); g.fillRect(sx + 3, sy + fh, 10, 1); const br = !e.f && !rm && ((t * 0.9 + e.x * 0.07) % 2.4) < 0.35 ? 1 : 0; const kn = Math.round(e.kn || 0), hp = Math.round(e.hop || 0); g.drawImage(e.sheet, e.f * 16, e.dir * fh, 16, fh - br - kn, sx, sy + br + kn - hp - (e.f === 1 && !rm ? 1 : 0), 16, fh - br - kn);
      if (e.emote) { const bx = sx + 8, by = sy + kn - 12 - Math.round(Math.min(1, (1.5 - e.emote.life) * 8) * 2), tx = e.emote.t; g.fillStyle = '#120a0e'; g.fillRect(bx - 7, by - 1, 15, 11); g.fillStyle = '#f3e3c3'; g.fillRect(bx - 6, by, 13, 9); g.fillRect(bx - 1, by + 9, 3, 2);
        if (tx === 'heart') { g.fillStyle = '#c8452e'; g.fillRect(bx - 3, by + 2, 3, 3); g.fillRect(bx + 1, by + 2, 3, 3); g.fillRect(bx - 2, by + 4, 5, 2); g.fillRect(bx - 1, by + 6, 3, 1); g.fillRect(bx, by + 7, 1, 1); g.fillStyle = '#f0a090'; g.fillRect(bx - 3, by + 2, 1, 1); }
        else ptext(g, tx, bx - Math.floor(ptextW(tx) / 2), by + 2, tx === '!' ? '#c8452e' : '#2a1408'); } }
    // overhead: laundry and chains hang above everyone
    for (const [x0, y0, x1, y1] of m.overhead || []) { const ax = x0 * 16 - cx, ay = y0 * 16 - cy, bx = x1 * 16 - cx, by = y1 * 16 - cy, sw = rm ? 0 : Math.sin(t * 1.4 + x0) * 1.5;
      g.strokeStyle = '#1a1214'; g.lineWidth = 1; g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo((ax + bx) / 2, (ay + by) / 2 + 8, bx, by); g.stroke();
      const cols = G.mapId === 'bay' ? ['#4a4a52', '#5a5a62'] : ['#8a5a4a', '#5a6a7a', '#a89a7a', '#6a4a5a'];
      for (let i = 1; i < 7; i++) { const k = i / 7, px = ax + (bx - ax) * k, py = ay + (by - ay) * k + Math.sin(k * Math.PI) * 6; g.fillStyle = cols[i % cols.length];
        if (G.mapId === 'bay') { g.fillRect(Math.round(px), Math.round(py), 1, 6); g.fillRect(Math.round(px) - 1, Math.round(py) + 6, 3, 2); }
        else if (G.mapId === 'fest' || (F('day1Done') && !F('day2Done') && G.mapId === 'square')) { const lit = G.mapId === 'fest', X = Math.round(px + sw * (i % 2 ? 1 : -1)), Y = Math.round(py); g.fillStyle = '#1a1214'; g.fillRect(X, Y, 1, 2); g.fillStyle = lit ? ['#ffb040', '#ff8a3a', '#ffd070'][i % 3] : ['#8a6a3a', '#7a4a3a', '#8a7a4a'][i % 3]; g.fillRect(X - 2, Y + 2, 5, 5); if (lit) { g.fillStyle = '#fff0b0'; g.fillRect(X - 1, Y + 3, 3, 3); g.globalAlpha = .18; g.fillStyle = '#ffb040'; g.fillRect(X - 5, Y - 1, 11, 11); g.globalAlpha = 1; } }
        else g.fillRect(Math.round(px + sw * (i % 2 ? 1 : -1)) - 3, Math.round(py), 6, 5 + (i % 3)); } }
    // Authority screens: propaganda on a loop, the Watcher between messages
    for (const [sx0, sy0, sw0] of m.screens || []) { const x = sx0 * 16 - cx + 2, y = sy0 * 16 - cy + 2, w = sw0 * 16 - 4, phs = Math.floor(t / 3.2) % 5, glitch = !rm && Math.random() < 0.02;
      g.fillStyle = '#0a1820'; g.fillRect(x, y, w, 10);
      if (phs === 4) { const ex = x + w / 2, ey = y + 5; g.fillStyle = '#e8c25a'; g.fillRect(ex - 3, ey - 3, 7, 7); g.fillRect(ex - 5, ey, 11, 1); g.fillRect(ex, ey - 5, 1, 11); g.fillStyle = '#0a1820'; g.fillRect(ex - 1, ey - 1, 3, 3); g.fillStyle = '#ffffff'; g.fillRect(ex, ey, 1, 1); }
      else { const L = [['GRATITUDE', 'IS BREATH'], ['THE SURFACE', 'BURNS'], ['REPORT AIR', 'THEFT'], ['THE AUTHORITY', 'PROVIDES']][phs]; ptext(g, L[0], x + w / 2 - ptextW(L[0]) / 2, y - 1 + 1, '#9ae8ff'); ptext(g, L[1], x + w / 2 - ptextW(L[1]) / 2, y + 5, '#9ae8ff'); }
      g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 10; i += 2) g.fillRect(x, y + i, w, 1);
      if (glitch) { g.fillStyle = 'rgba(160,240,255,.5)'; g.fillRect(x, y + (Math.random() * 10 | 0), w, 1); } }
    // steam from floor vents
    if (!rm) for (const p of m.props) if (p.t === 'vent' && Math.random() < 0.25) this.parts.push({ x: p.x * 16 + 4 + Math.random() * 8, y: p.y * 16 + 8, v: 10 + Math.random() * 8, s: Math.random() * 6, c: '#8a8a90', steam: 1, life: 1.4 });
    if (!rm && !Cutscene.active) {
      for (const p of m.props) { if (p.t === 'pipes' && Math.random() < 0.004 * (p.w || 1)) this.parts.push({ x: p.x * 16 + 4 + Math.random() * ((p.w || 1) * 16 - 8), y: p.y * 16 + 12, v: -34, s: 0, c: '#8ac0d0', drip: 1, life: 0.42 }); else if (p.t === 'stall' && Math.random() < 0.2) this.parts.push({ x: p.x * 16 + 7 + Math.random() * 4, y: p.y * 16 - 2, v: 9 + Math.random() * 6, s: Math.random() * 6, c: '#c8c8d0', steam: 1, life: 1.1 }); }
      // a rat along the south wall, now and then
      if (!this.rat && !G.heist && (G.mapId === 'square' || G.mapId === 'tunnel' || G.mapId === 'bay') && Math.random() < 0.0016) { const d = Math.random() < .5 ? 1 : -1; this.rat = { x: d > 0 ? cx - 8 : cx + W + 8, y: (m.h - 2) * 16 + 11, d, map: G.mapId }; }
      if (this.rat) { const r = this.rat; r.x += r.d * 1.5; const X = Math.round(r.x - cx), Y = Math.round(r.y - cy) - (Math.floor(r.x / 5) % 2); if (r.map !== G.mapId || r.x < cx - 20 || r.x > cx + W + 20) this.rat = null; else { g.fillStyle = '#2a2024'; g.fillRect(X - 3, Y - 2, 6, 3); g.fillRect(X + (r.d > 0 ? 2 : -4), Y - 3, 2, 2); g.fillStyle = '#4a3a3e'; g.fillRect(X - 2, Y - 2, 4, 1); g.fillStyle = '#6a4a4a'; g.fillRect(X + (r.d > 0 ? -6 : 3), Y - 1, 3, 1); } }
    }
    // particles: embers in bay, dust elsewhere
    if (!rm) { if (this.parts.filter(p => !p.soot && !p.steam && !p.drip).length < (G.mapId === 'bay' ? 26 : 12)) this.parts.push({ x: cx + Math.random() * W, y: cy + H + 4, v: 6 + Math.random() * 10, s: Math.random() * 6, c: G.mapId === 'bay' ? '#ff8a40' : '#8a7a70' });
      if (Math.random() < 0.35) this.parts.push({ x: cx + Math.random() * W, y: cy - 2, v: -(5 + Math.random() * 6), s: Math.random() * 6, c: '#3a3436', soot: 1 });
      for (const p of this.parts) { p.y -= p.v / 60; p.x += Math.sin(t * 1.5 + p.s) * (p.soot ? .3 : .15); if (p.life !== undefined) p.life -= 1 / 60; g.fillStyle = p.c; g.globalAlpha = p.drip ? .8 : p.steam ? Math.max(0, p.life) * .3 : p.soot ? .7 : .55; const sz = p.steam ? 3 : 1; g.fillRect(Math.round(p.x - cx), Math.round(p.y - cy), p.drip ? 1 : sz, p.drip ? 2 : sz); g.globalAlpha = 1; }
      this.parts = this.parts.filter(p => p.y > cy - 6 && p.y < cy + H + 8 && (p.life === undefined || p.life > 0)).slice(-120); }
    if (G.mapId === 'tunnel') { const off = rm ? 0 : ((t * 12) | 0) % 6; g.fillStyle = 'rgba(255,240,180,.5)'; for (let i = off; i < 40; i += 6) g.fillRect(23 * 16 + 12 + (i * 7) % 10 - cx, 16 + 10 + i - cy, 1, 2); }
    Light.draw(g, m, cx, cy, t);
    if (!this.vig || this.vig.width !== W || this.vig.height !== H) { const [vc, vg] = mk(W, H), gr = vg.createRadialGradient(W / 2, H / 2, H * .42, W / 2, H / 2, W * .68); gr.addColorStop(0, 'rgba(6,3,6,0)'); gr.addColorStop(1, 'rgba(6,3,6,.55)'); vg.fillStyle = gr; vg.fillRect(0, 0, W, H); this.vig = vc; }
    g.drawImage(this.vig, 0, 0);
    if (G.heist) this.drawCones(g, cx, cy, t);
    if (this.flash > 0) { g.fillStyle = this.flashC; g.globalAlpha = Math.min(1, this.flash) * (Settings.d.reduce ? .25 : .7); g.fillRect(0, 0, W, H); g.globalAlpha = 1; this.flash -= 1 / 60; }
    if (phase() === 'evening' && G.mapId !== 'tunnel') { g.fillStyle = 'rgba(70,12,30,.16)'; g.fillRect(0, 0, W, H); }
    // ambient bark bubbles
    if (!Dialogue.active) for (const n of this.npcs) if (n.bark) { const tw = ptextW(n.bark.t), bx = clamp(Math.round(n.x - cx - tw / 2 - 3), 2, W - tw - 8), by = Math.round(n.y - cy - 35);
      g.fillStyle = '#120a0e'; g.fillRect(bx - 1, by - 1, tw + 8, 11); g.fillStyle = '#f3e3c3'; g.fillRect(bx, by, tw + 6, 9); g.fillRect(clamp(Math.round(n.x - cx) - 1, bx + 2, bx + tw + 2), by + 9, 3, 2); ptext(g, n.bark.t, bx + 3, by + 2, '#2a1408'); }
    // interaction prompt
    if (Cutscene.active) { Cutscene.renderFX(g, cx, cy, t); return; }
    const show = (this.target && !Dialogue.active && !UI.stack.length);
    if (G.heist === 1 && !Dialogue.active && !UI.stack.length) { const cut = G.flags.relayCut, o = cut ? { x: 10.5 * 16, y: 20 } : { x: 21.5 * 16, y: 7 * 16 }, sx = o.x - cx, sy = o.y - cy, on = sx > 8 && sx < W - 8 && sy > 20 && sy < H - 14, px = Math.round(clamp(sx, 12, W - 12)), py = Math.round(clamp(sy - (on ? 18 : 0), 30, H - 20)), lab = cut ? 'BANK 7' : 'RELAY'; g.fillStyle = '#120a0e'; g.fillRect(px - 4, py - 4, 9, 9); g.fillStyle = Math.floor(t * 3) % 2 ? PAL.amber : '#fff2c0'; g.fillRect(px - 3, py - 3, 7, 7); ptext(g, lab, Math.round(clamp(px - ptextW(lab) / 2, 2, W - ptextW(lab) - 2)), py + 7, '#fff2c0'); }
    if (show) { const bx = Math.round(this.target.x - cx), by = Math.round(this.target.y - cy) + (rm ? 0 : Math.round(Math.sin(t * 5))); g.fillStyle = '#120a0e'; g.fillRect(bx - 5, by - 6, 11, 10); g.fillStyle = PAL.amber; g.fillRect(bx - 4, by - 5, 9, 8); g.fillStyle = '#120a0e'; g.fillRect(bx, by + 3, 1, 2); ptext(g, Input.device === 'kb' ? 'E' : 'A', bx - 1, by - 4, '#2a1408'); if (G.heist && (this.target.id === 'pillarFest' || (this.target.id === 'relay' && !G.flags.relayCut)) && !this.work) { g.fillStyle = '#120a0e'; g.fillRect(bx - 10, by + 6, 21, 9); ptext(g, 'HOLD', bx - 7, by + 8, PAL.amber); } }
    if (Settings.d.highlight && !Dialogue.active) { const a = Math.floor(t * 2) % 2 ? PAL.cyan : PAL.amber; g.fillStyle = a;
      for (const h of m.hot) { const [hx, hy] = h.tiles[0]; g.fillRect(hx * 16 + 7 - cx, hy * 16 - cy + (isWall(m.grid[hy][hx]) ? 13 : 1), 2, 2); }
      for (const n of this.npcs) g.fillRect(Math.round(n.x - 1 - cx), Math.round(n.y - 24 - cy), 2, 2); }
  }
};

// ---------- lighting: cheap darkness overlay with light holes + additive glow
const Light = {
  c: null, g: null,
  draw(g, m, cx, cy, t) {
    if (!this.c || this.c.width !== W || this.c.height !== H) { [this.c, this.g] = mk(W, H); }
    const lg = this.g, rm = Settings.d.reduce;
    lg.globalCompositeOperation = 'source-over'; lg.clearRect(0, 0, W, H); lg.fillStyle = (Cutscene.active && Cutscene.dark) || World.darkOverride || m.dark; lg.fillRect(0, 0, W, H);
    lg.globalCompositeOperation = 'destination-out';
    const all = (Cutscene.active ? m.lights : m.lights.concat([{ x: P.x, y: P.y - 8, r: G.heist === 2 ? 36 : G.heist ? 26 : 44 }])).concat(World.dynLights || []);
    for (const L of all) { const fl = rm ? 1 : L.furnace ? 1 + Math.sin(t * 7) * .04 + Math.random() * .03 : L.pillar ? 1 + Math.sin(t * 1.3) * .05 : 1 + Math.sin(t * 5.3 + L.x * .7) * .018 + (Math.sin(t * 1.7 + L.y) > .985 ? -.07 : 0);
      const x = L.x - cx, y = L.y - cy, r = L.r * fl; if (x < -r || y < -r || x > W + r || y > H + r) continue;
      const gr = lg.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.55, 'rgba(0,0,0,.65)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); lg.fillStyle = gr; lg.fillRect(x - r, y - r, r * 2, r * 2); }
    g.drawImage(this.c, 0, 0);
    g.globalCompositeOperation = 'lighter';
    const ph = phase();
    for (const L of m.lights) { const x = L.x - cx, y = L.y - cy, r = L.r * .8; if (x < -r || y < -r || x > W + r || y > H + r) continue;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); const c = L.pillar ? (ph === 'evening' ? '#ff5a40' : ph === 'noon' ? '#fff4e0' : '#ffc070') : (L.c || '#ffb35a'); gr.addColorStop(0, c + '30'); gr.addColorStop(1, c + '00'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
    g.globalCompositeOperation = 'source-over';
  }
};

const DIRA = [Math.PI / 2, -Math.PI / 2, Math.PI, 0], WORK_T = 1.7; // facing angle per dir (down, up, left, right)
const Fade = {
  a: 0, dir: 0, cb: null, busy: false,
  go(cb, speed, hold) { this.busy = true; this.dir = 1; this.cb = cb; this.sp = speed || 4; this.hold = !!hold; },
  out(cb) { this.go(cb); },
  update(dt) {
    if (!this.dir) return; this.a += this.dir * dt * this.sp;
    if (this.dir > 0 && this.a >= 1) { this.a = 1; const cb = this.cb, hold = this.hold; this.cb = null; this.hold = false; if (hold) { this.dir = 0; this.busy = false; } else this.dir = -1; cb && cb(); }
    else if (this.dir < 0 && this.a <= 0) { this.a = 0; this.dir = 0; this.busy = false; }
  },
  draw(g) { if (this.a > 0) { g.fillStyle = `rgba(6,3,5,${this.a})`; g.fillRect(0, 0, W, H); } }
};
