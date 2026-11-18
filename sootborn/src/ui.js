// ============================================================
// ui/ — HUD, modal menus (touch + keyboard + controller), title, intro, day end
// ============================================================
const HUD = {
  dirty: true, tt: 0,
  objective() {
    if (G.heist === 2) return D2OBJ();
    if (G.heist) return G.flags.relayCut ? 'Reach Valve Bank 7 (north wall) unseen' : 'Cut the audit relay (east wall) unseen';
    if (F('day1Done')) return D2OBJ();
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
    if (G.mode !== 'world' || Dialogue.active || Puzzle.active || Brawl.active || UI.stack.length) return '';
    if (G.heist) { const b = d === 'touch' ? 'B' : d === 'pad' ? 'Ⓑ' : 'X', a = d === 'kb' ? 'E' : d === 'pad' ? 'Ⓐ' : 'A'; return document.body.classList.contains('portrait') ? `${b}: bolt · hold ${a}: work` : `${b}: throw a bolt · hold ${a} to work · watch the lamps turn`; }
    if (P.moved < 40 && !F('talkedTavi')) return d === 'touch' ? 'Drag the pad to move' : d === 'pad' ? 'Left stick or D-pad to move' : 'WASD or arrow keys to move';
    if (World.target && !F('interacted')) return d === 'touch' ? 'Tap A to interact' : d === 'pad' ? 'Press Ⓐ to interact' : 'Press E or Enter to interact';
    return '';
  },
  update(dt) {
    const world = G.mode === 'world' && !UI.stack.length;
    const o = $('#obj'), s = $('#stat'), h = $('#hint');
    o.classList.toggle('hidden', (!(world && !Dialogue.active) && !Puzzle.active) || Brawl.active);
    s.classList.toggle('hidden', !world || Dialogue.active || Puzzle.active || Brawl.active);
    if (Puzzle.active) { o.querySelector('b').textContent = Puzzle.defs[Puzzle.si].wo || ('WO-114 · VALVE ' + Puzzle.defs[Puzzle.si].name); o.querySelector('span').textContent = Puzzle.defs[Puzzle.si].tip; }
    else { o.querySelector('b').textContent = 'OBJECTIVE'; o.querySelector('span').textContent = this.objective(); }
    s.textContent = `Day ${G.day} · ${G.scrip} scrip` + (F('d2Tavi') && !F('day2Done') ? ` · ☀${G.flags.rays | 0}` : '') + (G.newJ ? ` · ✎${G.newJ}` : '');
    const ht = this.hint(); h.classList.toggle('hidden', !ht); h.querySelector('span').textContent = ht;
    document.body.classList.toggle('ctlfade', Dialogue.active || Puzzle.active);
    document.body.classList.toggle('ingame', world || (Brawl.active && !Brawl.cine)); if (Cutscene.active) $('#cskip').classList.toggle('hidden', Brawl.active || !!Cutscene.noSkip);
    document.body.classList.toggle('inpuzzle', Puzzle.active);
    document.body.classList.toggle('inpanel', Cutscene.active && !!Cutscene.panel);
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
      { label: 'Map of Cinderwell', act: () => Menus.map() },
      { label: 'Save game', act: () => { if (G.heist) { HUD.toast('Not now — finish this first'); Sound.play('deny'); return; } Menus.slots('save'); } },
      { label: 'Load game', act: () => Menus.slots('load') },
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
  // cutaway of the world as Kael understands it: what is known is lit, what is not is rock
  map() {
    UI.push(modal({ title: 'Cinderwell', startCloses: true, build(b) {
      const [c, g] = mk(300, 190); c.style.cssText = 'width:100%;image-rendering:pixelated;display:block;border:2px solid #c8a050;border-radius:2px'; b.appendChild(c);
      const J = id => G.journal.includes(id), R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
      for (let y = 0; y < 190; y += 2) for (let x = 0; x < 300; x += 2) { const r = hash(x, y); R(x, y, 2, 2, r < .33 ? '#1a1114' : r < .66 ? '#20151a' : '#150e11'); }
      const cave = (cx, cy, rx, ry, lit, glow) => { g.fillStyle = '#0a0608'; g.beginPath(); g.ellipse(cx, cy, rx + 2, ry + 2, 0, 0, 6.3); g.fill(); g.fillStyle = lit ? '#3a2a24' : '#221a1c'; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 6.3); g.fill(); g.fillStyle = lit ? '#4a352a' : '#281e20'; g.fillRect(cx - rx + 4, cy + ry - 5, rx * 2 - 8, 3);
        if (lit) { const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rx); gr.addColorStop(0, (glow || '#ffb35a') + '55'); gr.addColorStop(1, (glow || '#ffb35a') + '00'); g.fillStyle = gr; g.fillRect(cx - rx, cy - ry, rx * 2, ry * 2); for (let i = 0; i < rx / 5; i++) R(Math.round(cx - rx + 6 + hash(cx + i, cy) * (rx * 2 - 12)), Math.round(cy - 3 + hash(i, cx) * 8), 1, 1, '#ffd890'); } };
      const plate = (t, cx, y, dim) => { const w = ptextW(t) + 6, x = Math.round(cx - w / 2); R(x - 1, y - 1, w + 2, 11, '#0c0808'); R(x, y, w, 9, dim ? '#5a4a30' : '#c8a050'); R(x + 1, y + 1, w - 2, 7, '#1e1512'); ptext(g, t, x + 3, y + 2, dim ? '#8a7a60' : '#f3e3c3'); };
      const here = (cx, cy) => { R(cx - 3, cy - 3, 7, 7, '#120a0e'); R(cx - 2, cy - 2, 5, 5, '#ff6a3d'); R(cx - 1, cy - 1, 3, 3, '#ffe08a'); };
      // above: what they told us, and what we have started to suspect
      const sus = F('celestineSlip') || J('e_riser') || J('pl_meridian');
      for (let y = 0; y < 30; y++) R(0, y, 300, 1, sus ? `rgb(${30 + y * 2},${24 + y},${34 - y / 2})` : `rgb(${40 + y},${10 + y / 3},${10})`);
      if (sus) { const gr = g.createRadialGradient(120, 4, 0, 120, 4, 90); gr.addColorStop(0, 'rgba(255,236,170,.5)'); gr.addColorStop(1, 'rgba(255,236,170,0)'); g.fillStyle = gr; g.fillRect(0, 0, 300, 30); }
      R(104, 14, 32, 16, '#e8e4dc'); R(108, 8, 24, 6, '#f4f2ec'); R(116, 2, 8, 6, '#f4f2ec'); R(119, 0, 2, 2, '#e8c25a'); R(104, 28, 32, 2, '#e8c25a'); for (let i = 0; i < 4; i++) R(108 + i * 7, 16, 3, 10, '#c8ccd8');
      plate(J('pl_meridian') ? 'MERIDIAN TERRACE - TIER 1?' : sus ? 'ABOVE - NOT BURNING?' : 'THE SURFACE - BURNS', 214, 10, !sus);
      for (let x = 0; x < 300; x += 3) R(x, 30 + (hash(x, 3) * 3 | 0), 3, 9, '#2a1c1e');
      // tiers we only hear through the pipes
      for (const [x, y, rx] of [[40, 56, 20], [86, 54, 16], [170, 56, 22]]) cave(x, y, rx, 7, false); plate('TIERS 4-5', 40, 50, true);
      for (const [x, y, rx] of [[36, 160, 24], [104, 166, 20], [168, 160, 26], [236, 172, 18]]) cave(x, y, rx, 8, false); plate('TIERS 7-9', 104, 176, true);
      // shafts
      R(118, 30, 5, 58, '#0a0608'); R(119, 30, 3, 58, F('day1Done') ? '#fff6dc' : '#8a8a92'); R(238, 44, 5, 46, '#0a0608'); R(239, 44, 3, 46, '#6a5a2a'); for (let y = 30; y < 44; y += 3) R(240, y, 1, 2, J('e_crate') ? '#e8b23a' : '#3a2c1e');
      // tier 6: home
      cave(40, 98, 22, 10, true); cave(120, 100, 44, 14, true, '#ffe2b0'); cave(184, 82, 20, 8, F('visitedWard') || G.mapId === 'clinic', '#cfe8ff'); cave(226, 102, 34, 13, J('pl_bay') || G.mapId === 'bay', '#ff7a30'); cave(266, 84, 14, 7, J('pl_fuse'), '#4fd6d0');
      R(62, 97, 14, 4, '#3a2a24'); R(160, 88, 8, 3, '#3a2a24'); R(164, 99, 28, 4, '#3a2a24'); R(256, 90, 6, 3, '#3a2a24');
      R(119, 90, 3, 14, '#ffd890'); R(117, 104, 7, 2, '#5a5058'); R(230, 92, 8, 6, '#ff6a20'); R(232, 93, 4, 3, '#ffe08a');
      plate('ROW K', 40, 82); plate('ASHGATE SQUARE', 120, 116); plate('LIFT 0', 96, 62); if (F('visitedWard') || G.mapId === 'clinic') plate('FEVER WARD', 184, 68); if (J('pl_bay') || G.mapId === 'bay') plate('BAY 3', 206, 117); if (J('pl_fuse')) plate('FUSE C', 262, 70); if (J('e_crate')) plate('FREIGHT 3', 216, 50);
      // under the floor
      if (J('pl_tunnel') || G.mapId === 'tunnel') { g.fillStyle = '#0a0608'; g.fillRect(204, 127, 88, 12); R(206, 129, 84, 8, '#2a2024'); R(226, 115, 3, 14, '#2a2024'); R(206, 132, 84, 1, '#c87a3a'); plate('OLD TUNNEL', 236, 141);
        if (J('e_dacenote')) { R(250, 129, 5, 8, '#1a1114'); R(244, 133, 2, 2, '#ffd890'); }
        if (J('e_riser')) { R(286, 30, 3, 100, '#0a0608'); R(287, 30, 1, 100, '#e8b23a'); for (let y = 34; y < 128; y += 8) R(287, y, 1, 3, '#fff0b0'); plate('RISER 9', 268, 52); } }
      if (J('e_aux9')) { R(214, 108, 1, 22, '#c87a3a'); plate('AUX-9', 168, 128); R(180, 132, 34, 1, '#c87a3a'); }
      const at = { apt: [40, 100], square: [120, 106], fest: [120, 106], clinic: [184, 84], bay: [222, 106], fuse: [266, 86], tunnel: [222, 133] }[G.mapId]; if (at) here(at[0], at[1]);
      const p = document.createElement('p'); p.style.opacity = .7; p.textContent = 'What Kael knows is lit. The rest is rock. The map fills in as you find things.'; b.appendChild(p);
    }, items: [{ label: 'Close', act: () => UI.pop() }] }));
  },
  settings() {
    const S = Settings.d, upd = () => { Settings.save(); Settings.apply(); };
    const cyc = (k, n) => d => { S[k] = (S[k] + d + n) % n; upd(); };
    UI.push(modal({ title: 'Settings', build(b) { b.innerHTML = `<p style="opacity:.7">Saves: ${Store.ok ? 'kept in this browser' : 'this session only (storage blocked) — export from Save data'}. Keyboard: WASD/arrows, E/Enter, Esc, M menu, Q/R tabs, H hint. Controller supported.</p>`; }, items: [
      { label: 'Sound test', value: () => !Sound.ctx ? 'audio off' : Sound.ctx.state === 'running' ? 'tap to hear' : 'blocked: tap again', act: () => { Sound.unlock(); setTimeout(() => { Sound.play('horn'); Sound.play('win'); }, 60); } },
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
  // save slots: one autosave (written at every story beat) and three you choose
  slots(mode) {
    const items = [];
    for (const [k, nm] of Save.SLOTS) { if (mode === 'save' && k === 'auto') continue; const s = Save.read(k);
      items.push({ label: `${nm} — ${Save.describe(s)}`, disabled: () => mode !== 'save' && !s, act: () => {
        if (mode === 'save') { const go = () => { const ok = Save.write(k); HUD.toast(ok ? `Saved to ${nm}` : `Saved to ${nm} for this session only`); Sound.play('coin'); UI.pop(); };
          if (s) UI.push(modal({ title: `Overwrite ${nm}?`, build(b) { b.innerHTML = `<p>${esc(Save.describe(s))}</p>`; }, items: [{ label: 'Overwrite', act: () => { UI.pop(); go(); } }, { label: 'Cancel', act: () => UI.pop() }] })); else go(); }
        else if (mode === 'delete') { Save.del(k); Sound.play('deny'); UI.pop(); UI.pop(); Menus.slots('load'); }
        else { UI.clear(); Game.loadSave(s); } } }); }
    if (mode === 'load') { items.push({ label: 'Delete a save', act: () => Menus.slots('delete') }); items.push({ label: 'Export / import save text', act: () => Menus.saveData() }); }
    items.push({ label: 'Back', act: () => UI.pop() });
    UI.push(modal({ title: mode === 'save' ? 'Save game' : mode === 'delete' ? 'Delete which save?' : 'Load game', build(b) { b.innerHTML = Store.ok ? '<p>The game autosaves at every story beat. Slots are yours.</p>' : '<p>This view cannot keep saves after you close it. Use <b>Export</b> on the Load screen to copy your save text somewhere safe.</p>'; }, items }));
  },
  // dev: jump to any point of the slice
  checkpoints() {
    const fresh = () => { UI.clear(); freshState('Kael', 0); World.resetSheets(); World.showPlayer = true; }, load = k => () => { UI.clear(); Game.loadSave(Save.migrate(JSON.parse(JSON.stringify(CHECKPOINTS[k])))); };
    const ff = (card, sub, k, then) => () => { UI.clear(); ffScene(card, sub, () => FF[k](), then || (() => Game.toTitle())); };
    const fest = k => () => { UI.clear(); Game.loadSave(Save.migrate(JSON.parse(JSON.stringify(CHECKPOINTS.fest)))); setTimeout(() => { UI.clear(); Game[k](); }, 60); };
    const S = {
      'Fights': [
        ['The Valley · battle (the first fight)', ff('FOUR YEARS FROM NOW', 'The Assay. Day forty.', 'valley')],
        ['Three Steps · the Warden at the furnace', () => { fresh(); G.flags.ranForHer = 1; ffScene('THREE STEPS', 'You make it three steps.', () => FF.furnace(), () => Game.toTitle()); }],
        ['The Pairing · duel with Teo Aldane', ff('FOUR YEARS FROM NOW', 'The Assay. The first night.', 'pairing')],
        ['The Ford · duel with Captain Vant', ff('THE ASSAY', 'Four years from now. Day nineteen.', 'ford')],
        ['The Proctor · duel with Halden Voss', ff('FOUR YEARS FROM NOW', 'The Assay. Day thirty-one.', 'proctor')],
        ['The Keep · duel with Lucan Aurel', ff('FOUR YEARS FROM NOW', 'The Assay. The last day.', 'keep')],
        ['The Ember Ring · bouts below', load('ring')]
      ],
      'Story beats': [
        ['Opening film', () => { UI.clear(); Sound.tname = null; Brawl.start({ bg: 'valley', arena: FIELD, music: 'battle', cineOnly: 1, intro: OPENING, foes: [] }, () => Game.toTitle()); G.mode = 'opening'; }],
        ['New game from the top (Valley, then prologue)', () => { UI.clear(); Game.newGame(); }],
        ['Prologue · story only', () => { fresh(); Cutscene.play(PROLOGUE_A.filter(s => !s.brawl && !/^FOUR YEARS FROM/.test(s.card || '')), () => Game.startHeist()); }],
        ['Prologue · the relay heist', () => { fresh(); Game.startHeist(); }],
        ['Prologue · Lift Zero, the furnace, the Pairing', () => { fresh(); Game.onHeistDone(); }],
        ['Day 1 · wake up in Ashgate', () => { fresh(); Game.startPresent(); }],
        ['End of Day 1 · the Ford, then Day 2', ff('THE ASSAY', 'Four years from now. Day nineteen.', 'ford', load('day2'))],
        ['Day 2 · morning', load('day2')],
        ['Day 2 · lantern built, festival next', load('fest')],
        ['Day 2 · Last Bell (the Proctor, then the ceremony)', fest('startFestival')],
        ['Day 2 · the lantern climb (stealth)', fest('startFestStealth')],
        ['Day 2 · First Fire (the Keep, then the ending)', fest('onFestDone')]
      ]
    };
    const sub = k => () => UI.push(modal({ title: k, items: S[k].map(([label, act]) => ({ label, act })).concat([{ label: 'Back', act: () => UI.pop() }]) }));
    const onoff = v => v ? 'On' : 'Off';
    UI.push(modal({ title: 'Dev menu', build(b) { b.innerHTML = '<p>Jump straight to any fight or story beat. Your save slots are not touched until the game autosaves.</p>'; }, items: [
      { label: 'Fights', act: sub('Fights') }, { label: 'Story beats', act: sub('Story beats') },
      { label: 'Start fights at full fury', value: () => onoff(DEV.fury), adj: () => { DEV.fury = DEV.fury ? 0 : 1; } },
      { label: 'Skip fight intro films', value: () => onoff(DEV.quick), adj: () => { DEV.quick = DEV.quick ? 0 : 1; } },
      { label: 'Back', act: () => UI.pop() }] }));
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
      b.innerHTML = `<h1 class="logo">SOOTBORN</h1><div class="sub">Every breath is hers.</div>`;
      b.parentNode.style.background = 'rgba(16,10,13,.82)'; b.parentNode.style.textAlign = 'center';
    }, items: [
      { label: s ? `Continue — Day ${s.day}, ${MAPS[s.map].name}` : 'Continue', disabled: () => !s, act: () => { UI.clear(); Game.loadSave(Save.latest()); } },
      { label: 'New game', act: () => Menus.newGame() },
      { label: 'Load game', act: () => Menus.slots('load') },
      { label: 'Settings', act: () => Menus.settings() },
      { label: 'About & controls', act: () => Menus.about() },
      { label: 'Dev menu · jump to a scene', act: () => Menus.checkpoints() }
    ] }));
  },
  about() {
    UI.push(modal({ title: 'About', build(b) { b.innerHTML = `<p><b>SOOTBORN</b> — a North Coast Studios × E Concepts game. <i>Every breath is hers.</i> Vertical slice (v0.12.8): the prologue, two days in Cinderwell, and five fights from the Assay, four years on, three of them single combat. In a fight: A strikes (three-hit chain), B dodges (dodge through the red for an opening), and when the fury bar is full, hold A for ELEVEN.</p><p>Forty-one days ago, the Array Authority took Seren Holloway for a crime Kael Brennick committed. Today, Kael goes back to work on the same valve bank.</p>
      <p>Original story, characters, pixel art and music, all generated in code.</p>
      <p><b>Fights:</b> A strikes (three-hit chain), B dodges. Dodge through a swing and time slows: your next hits land harder. <b>Touch:</b> pad to move, A to interact/confirm, B to back, ☰ for the menu. <b>Keyboard:</b> WASD/arrows, E or Enter, Esc, M (menu), Q/R (journal). <b>Controller:</b> stick/D-pad, Ⓐ, Ⓑ, Start, shoulders.</p>
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
      { label: 'Begin', act: () => { const n = (name || '').trim().slice(0, 14) || 'Wren'; UI.clear(); Game.newGame(n, look); } },
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
  run(day) {
    if (day === 2) return this.run2();
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
  run2() {
    G.mode = 'dayend'; Sound.music('mystery'); Fade.a = 0; Fade.dir = 0; Fade.busy = false; World.load('square', { x: 11 * 16 + 8, y: 7 * 16 + 12, dir: 0 }, true);
    const L = [], n = G.flags.rays | 0, r = G.flags.ring | 0;
    L.push(`Seren's lantern hung on the Pillar with ${n} borrowed ray${n === 1 ? '' : 's'}.` + (n >= 7 ? ' The whole square stood in a row for it.' : n >= 4 ? ' Three people stood in front of it.' : ' Mara stood in front of it alone.'));
    L.push(F('fireTheirs') ? 'You lit it from the First Fire. Her fire. They do not get to keep it.' : F('fireOwn') ? 'You lit it with your own striker. An unlicensed light.' : F('fireTavi') ? 'Tavi lit it. Fourth try.' : 'It burned for three candle-hours.');
    if (F('washerOn')) L.push('Her ring hung in the middle of the sun.');
    L.push(r >= 3 ? 'You hold the Ember Ring belt. Three notches. Two are hers.' : r > 0 ? `You won ${r} bout${r > 1 ? 's' : ''} in the Ember Ring. The belt is still on Hollis's shoulder.` : 'You never stepped into the chalk.');
    if (F('beatSull')) L.push('You put a Proctor on the ground. Nothing was written down.');
    else if (F('sullTip')) L.push('Sull complained to you about his knee. Then he guarded the wrong side of the square for an hour.');
    else if (F('sullWar')) L.push('Sull has your name spelled right, and your sibling\'s.');
    L.push(F('valeDebt') ? 'You owe Vale one silence.' : F('valeWhy') ? "Vale's sister was in the ninth cot. Nobody bled a line for her." : F('valeDefied') ? 'Vale struck his note. You told him you would do it again.' : 'Vale wrote: "Compliant."');
    if (F('spareOn')) L.push('The festival ran two amps bright. Faulty panel.');
    if (F('lockerD')) L.push(F('tookBlood') ? "You took the fifty scrip from Dace's locker." : F('burnBlood') ? 'You burned an informant envelope in their own fire. Marrow and Hollis saw.' : 'You left the envelope sealed, the way Dace left it.');
    if (F('daceNote')) L.push('Dace is alive, under the floor, and waiting for you.');
    L.push('"It is rather more yellow than—" She has seen the sun.');
    const fu = G.flags.fury || 0; L.push(fu >= 8 ? 'The ember in Kael is white-hot. He has stopped trying to bank it.' : fu >= 4 ? 'The ember in Kael is burning steady. He is learning where to aim it.' : 'Kael is still keeping count. The list is longer.');
    Object.assign(G.flags, { day2Done: 1 }); G.day = 3; G.trust0 = { ...G.trust }; addJ('e_leaf', true); addJ('e_slip', true); G.newJ = 0;
    G.mapId = 'apt'; P.x = 3 * 16 + 8; P.y = 4 * 16 + 12; P.dir = 0;
    const ok = Save.write('auto');
    UI.push(modal({ title: 'End of Day 2 — First Fire', onBack: null, build(b) { b.innerHTML = L.map(l => `<p>· ${esc(l)}</p>`).join('') + `<p style="opacity:.7">${ok ? 'Progress saved.' : 'Progress kept for this session — export it from Save data to keep it.'}</p>`; },
      items: [{ label: 'Continue', act: () => { UI.pop(); DayEnd.outro2(); } }] }));
  },
  outro2() {
    UI.push(modal({ clear: true, onBack: null, build(b) {
      b.parentNode.style.textAlign = 'center'; b.parentNode.style.background = 'rgba(10,6,9,.9)';
      b.innerHTML = `<p>By first bell the Proctors have taken the lantern down. It does not matter. Four hundred people saw a sun, and you cannot scrub a thing like that off stone.</p>
        <p>In Row K, a child sleeps with a leaf pressed in a worksheet. In Fuse Room C, one bus hums at nineteen, exactly. And at the gate of Lift Zero, a grey Inspector waits with a ledger, to see who comes to carry it up.</p>
        <p><i>"Be too much for them."</i></p>
        <h2 style="margin-top:16px">END OF FIRST FIRE</h2><p style="opacity:.7">SOOTBORN · Every breath is hers · vertical slice · thanks for playing.</p>`;
    }, items: [
      { label: 'Keep exploring (Day 3)', act: () => { UI.clear(); Game.loadSave(Save.read('auto') || Save.snapshot()); } },
      { label: 'Back to title', act: () => { UI.clear(); Game.toTitle(); } }
    ] }));
  },
  outro() {
    UI.push(modal({ clear: true, onBack: null, build(b) {
      b.parentNode.style.textAlign = 'center'; b.parentNode.style.background = 'rgba(10,6,9,.9)';
      b.innerHTML = `<p>Far above Cinderwell — above the rock, above the warnings — a crate of cold greens arrives somewhere that doesn't exist.</p>
        <p>Below, Kael Brennick dreams of ${F('sawRiser') ? 'warm air falling from a pipe with no destination' : 'a lift light, green for eleven seconds'} — and of Seren, laughing at him for being right.</p>
        <p><i>"They came down in light. One day, I'm going up in it."</i></p>
        <h2 style="margin-top:16px">END OF DAY ONE</h2><p style="opacity:.7">SOOTBORN · Every breath is hers · vertical slice · thanks for playing.</p>`;
    }, items: [
      { label: 'Wake up: Day 2 — First Fire', act: () => { UI.clear(); const sv = Save.read('auto') || Save.snapshot(); if (NOFF) return Game.loadSave(sv); ffScene('THE ASSAY', 'Four years from now. Day nineteen.', () => FF.ford(), () => Game.loadSave(sv)); } },
      { label: 'Back to title', act: () => { UI.clear(); Game.toTitle(); } }
    ] }));
  }
};
