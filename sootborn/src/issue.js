// ============================================================
// content/issue — a level played in third person, drawn like a comic.
// It is the cel-shaded engine from "Second Chance" (halftone, ink outlines, drawn faces), re-cast with our people
// and re-dressed as our places by issue/patch.mjs. It runs in its own frame so nothing of it leaks into the 2D game:
// when it posts "done" the frame is thrown away and the cutscene carries on. If it cannot start, the story falls
// back to the 2D fight that used to stand in this place.
// ============================================================
const Issue = {
  on: false, el: null, done: null, ready: false, timer: 0, onMsg: null, last: '', lab: null,
  // the memories the level may show, drawn by the same panel code as the rest of the game
  LEVELS: { docks: 'The High Docks', riser: 'Riser Nine', stair: 'The Stair', gild: 'The Table' },
  PANELS: ['desk:3', 'assay:0', 'weather:2', 'under:0', 'ward:0', 'row:0', 'desk:2', 'desk:4', 'desk:5', 'ledger:2', 'freight:0', 'furnace:0', 'furnace:1', 'furnace:2', 'hands:0', 'kael:0', 'tin:0', 'lift:0', 'dockstair:0', 'island:0'],
  can() { if (Settings.d.issue3d === 0) return false; try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } },
  assets() {
    const out = {}, was = Panels.narrow;
    for (const ps of this.PANELS) { const [id, st] = ps.split(':'); try { const [c, g] = mk(320, 180); Panels.narrow = false; PANELS[id](g, 2.2, +st, 0); Panels.finish(g, { id, stage: +st, t: 2.2 }); out[id + st] = c.toDataURL('image/png'); } catch (e) { /* that memory is simply not shown */ } }
    Panels.narrow = was; return out;
  },
  place() { // the level sits exactly where the game screen is, under the same buttons
    const r = Layout.rect, k = r.x + ',' + r.y + ',' + r.w + ',' + r.h; if (k === this.last || !this.el) return; this.last = k;
    Object.assign(this.el.style, { left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px' });
  },
  start(key, done) {
    // one engine, three levels: the frame is told which one it is
    const base = (window.ISSUE_HTML || {}).docks, fr = this.fresh, html = base && this.LEVELS[key] ? base.replace("issue: 'docks'", "issue: '" + key + "'" + (fr ? ', devFresh: 1' : '')) : null; this.fresh = 0;
    if (!html || !this.can()) { done(false); return; }
    this.on = true; this.done = done; this.ready = false; this.key = key; this.last = ''; this.sent = '';
    try { if (Sound.mus) Sound.mus.gain.value = 0; window.__issueAudio = Sound.ctx || null; } catch (e) { /* no audio yet */ }
    const f = this.el = document.createElement('iframe');
    f.setAttribute('title', 'SOOTBORN: ' + this.LEVELS[key]); f.setAttribute('tabindex', '-1');
    f.style.cssText = 'position:fixed;border:0;background:#07070d;image-rendering:auto;opacity:0;transition:opacity .6s';
    // a title holds the screen while the level wakes, and the level fades up under it
    const TT = { docks: ['THE HIGH DOCKS', 'Seven years after the furnace. The second bell.'], riser: ['RISER NINE', 'Five years after the furnace. The Assay valley, at night.'], stair: ['THE STAIR', 'Nine years after the furnace. Sunset.'], gild: ['THE TABLE', 'Half a year after the furnace. A sealed pump room under Tier Six.'] }[key]; try { Cutscene.card(TT[0], TT[1], 1); } catch (e) { /* no title */ } this.t0 = performance.now();
    this.onMsg = e => {
      const d = e.data; if (!d || typeof d.sootborn !== 'string' || !this.el || e.source !== this.el.contentWindow) return;
      if (d.sootborn === 'issue-ready') { this.ready = true; setTimeout(() => { if (this.el) this.el.style.opacity = 1; try { Cutscene.hideCard(); } catch (er) { /* gone */ } }, Math.max(0, 1500 - (performance.now() - this.t0))); try { this.el.contentWindow.postMessage({ sootborn: 'assets', panels: this.assets(), fps: Settings.d.fps ? 1 : 0 }, '*'); } catch (er) { /* it plays without them */ } }
      if (d.sootborn === 'issue-done') this.finish(true, d.data);
    };
    window.addEventListener('message', this.onMsg);
    f.srcdoc = html; document.body.insertBefore(f, $('#controls')); this.place();
    // the fight buttons, named for what they do up here
    this.lab = {}; [['bY', 'JUMP'], ['bX', 'HOOK'], ['bR', 'KICK'], ['bL', 'LUNGE']].forEach(([id, t]) => { const b = $('#' + id); if (b) { this.lab[id] = b.textContent; b.textContent = t; } });
    this.timer = setTimeout(() => { if (!this.ready) this.finish(false); }, 15000);
  },
  // once a frame from the main loop: hand the level this game's own input
  tick() {
    if (!this.on || !this.el) return; this.place();
    const bc = document.body.classList; if (!bc.contains('ingame')) bc.add('ingame'); if (!bc.contains('fight')) bc.add('fight'); if (bc.contains('ctlfade')) bc.remove('ctlfade');   // this game's pad and buttons stay up for the whole level
    if (!this.ready) return;
    const x = (Input.h('right') ? 1 : 0) - (Input.h('left') ? 1 : 0), y = (Input.h('up') ? 1 : 0) - (Input.h('down') ? 1 : 0), press = [];
    if (Input.p('A')) press.push('ctx'); if (Input.p('B')) press.push('dodge'); if (Input.p('X')) press.push('hook'); if (Input.p('Y')) press.push('jump');
    if (Input.p('L')) press.push('boots'); if (Input.p('R')) press.push('kick'); if (Input.p('START')) press.push('pause');
    // the level does not read the controller itself: both sticks and the stick click go to it from here
    let ax = 0, ay = 0, lx = 0, ly = 0, r3 = 0; try { for (const gp of (navigator.getGamepads ? navigator.getGamepads() : [])) { if (!gp || !gp.connected) continue; const dz = v => Math.abs(v) < .18 ? 0 : Math.round(v * 10) / 10; ax = dz(gp.axes[0] || 0); ay = dz(gp.axes[1] || 0); lx = dz(gp.axes[2] || 0); ly = dz(gp.axes[3] || 0); r3 = gp.buttons[11] && gp.buttons[11].pressed ? 1 : 0; break; } } catch (e) { /* no pad */ }
    if (r3 && !this.r3) press.push('lock'); this.r3 = r3;
    const sx = ax || ay ? ax : x, sy = ax || ay ? -ay : y;
    const hold = { a: Input.h('A') ? 1 : 0, y: Input.h('Y') ? 1 : 0 }, pad = Input.device === 'pad' ? 1 : 0, k = sx + ',' + sy + ',' + lx + ',' + ly + ',' + hold.a + hold.y + pad; if (k === this.sent && !press.length) return; this.sent = k;
    try { this.el.contentWindow.postMessage({ sootborn: 'in', x: sx, y: sy, lk: [lx, ly], press, hold, pad }, '*'); } catch (e) { /* frame is going away */ }
  },
  finish(ok, data) {
    if (!this.on) return;
    if (ok && this.el && !this.closing) { this.closing = true; this.el.style.transition = 'opacity .45s'; this.el.style.opacity = 0; setTimeout(() => this.finish(ok, data), 460); return; }
    this.closing = false; try { Cutscene.hideCard(); } catch (e) { /* gone */ } this.on = false; clearTimeout(this.timer); window.removeEventListener('message', this.onMsg);
    try { this.el.contentWindow.postMessage({ sootborn: 'stop' }, '*'); this.el.contentWindow.SC.audio.kill(); } catch (e) { /* its own context dies with the frame */ }
    if (this.el) this.el.remove(); this.el = null; window.__issueAudio = null; Sound.setVol(); try { window.focus(); } catch (e) { /* fine */ }
    if (this.lab) for (const id in this.lab) { const b = $('#' + id); if (b) b.textContent = this.lab[id]; } this.lab = null;
    if (ok && data && !data.skipped) Store.set('sootborn_issue_' + this.key, '1');
    const d = this.done; this.done = null; if (d) d(ok);
  }
};
