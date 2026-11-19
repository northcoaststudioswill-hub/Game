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
  PANELS: ['desk:2', 'desk:4', 'desk:5', 'ledger:2', 'freight:0', 'furnace:0', 'furnace:1', 'furnace:2', 'hands:0', 'kael:0', 'tin:0', 'lift:0', 'dockstair:0'],
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
    const html = (window.ISSUE_HTML || {})[key];
    if (!html || !this.can()) { done(false); return; }
    this.on = true; this.done = done; this.ready = false; this.key = key; this.last = ''; this.sent = '';
    try { if (Sound.mus) Sound.mus.gain.value = 0; window.__issueAudio = Sound.ctx || null; } catch (e) { /* no audio yet */ }
    const f = this.el = document.createElement('iframe');
    f.setAttribute('title', 'SOOTBORN: The High Docks'); f.setAttribute('tabindex', '-1');
    f.style.cssText = 'position:fixed;border:0;background:#07070d;image-rendering:auto';
    this.onMsg = e => {
      const d = e.data; if (!d || typeof d.sootborn !== 'string' || !this.el || e.source !== this.el.contentWindow) return;
      if (d.sootborn === 'issue-ready') { this.ready = true; try { this.el.contentWindow.postMessage({ sootborn: 'assets', panels: this.assets() }, '*'); } catch (er) { /* it plays without them */ } }
      if (d.sootborn === 'issue-done') this.finish(true, d.data);
    };
    window.addEventListener('message', this.onMsg);
    f.srcdoc = html; document.body.insertBefore(f, $('#controls')); this.place();
    // the fight buttons, named for what they do up here
    this.lab = {}; [['bY', 'LOOK'], ['bX', 'STRIKE'], ['bR', 'LOCK'], ['bL', 'ELEVEN']].forEach(([id, t]) => { const b = $('#' + id); if (b) { this.lab[id] = b.textContent; b.textContent = t; } });
    this.timer = setTimeout(() => { if (!this.ready) this.finish(false); }, 15000);
  },
  // once a frame from the main loop: hand the level this game's own input
  tick() {
    if (!this.on || !this.el) return; this.place();
    const bc = document.body.classList; if (!bc.contains('ingame')) bc.add('ingame'); if (!bc.contains('fight')) bc.add('fight'); if (bc.contains('ctlfade')) bc.remove('ctlfade');   // this game's pad and buttons stay up for the whole level
    if (!this.ready) return;
    const x = (Input.h('right') ? 1 : 0) - (Input.h('left') ? 1 : 0), y = (Input.h('up') ? 1 : 0) - (Input.h('down') ? 1 : 0), press = [];
    if (Input.p('A')) press.push('ctx'); if (Input.p('B')) press.push('dodge'); if (Input.p('X')) press.push('attack'); if (Input.p('Y')) press.push('interact');
    if (Input.p('L')) press.push('power'); if (Input.p('R')) press.push('lock'); if (Input.p('START')) press.push('pause');
    const k = x + ',' + y; if (k === this.sent && !press.length) return; this.sent = k;
    try { this.el.contentWindow.postMessage({ sootborn: 'in', x, y, press }, '*'); } catch (e) { /* frame is going away */ }
  },
  finish(ok, data) {
    if (!this.on) return; this.on = false; clearTimeout(this.timer); window.removeEventListener('message', this.onMsg);
    try { this.el.contentWindow.postMessage({ sootborn: 'stop' }, '*'); this.el.contentWindow.SC.audio.kill(); } catch (e) { /* its own context dies with the frame */ }
    if (this.el) this.el.remove(); this.el = null; window.__issueAudio = null; Sound.setVol(); try { window.focus(); } catch (e) { /* fine */ }
    if (this.lab) for (const id in this.lab) { const b = $('#' + id); if (b) b.textContent = this.lab[id]; } this.lab = null;
    if (ok && data && !data.skipped) Store.set('sootborn_issue_' + this.key, '1');
    const d = this.done; this.done = null; if (d) d(ok);
  }
};
