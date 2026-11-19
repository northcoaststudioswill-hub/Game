// ============================================================
// content/issue — a level played in third person, drawn like a comic.
// It is the cel-shaded engine from "Second Chance" (halftone, ink outlines, drawn faces), re-cast with our people
// and re-dressed as our places by issue/patch.mjs. It runs in its own frame so nothing of it leaks into the 2D game:
// when it posts "done" the frame is thrown away and the cutscene carries on. If it cannot start, the story falls
// back to the 2D fight that used to stand in this place.
// ============================================================
const Issue = {
  on: false, el: null, done: null, ready: false, timer: 0, onMsg: null,
  can() { if (Settings.d.issue3d === 0) return false; try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } },
  start(key, done) {
    const html = (window.ISSUE_HTML || {})[key];
    if (!html || !this.can()) { done(false); return; }
    this.on = true; this.done = done; this.ready = false; this.key = key;
    try { if (Sound.mus) Sound.mus.gain.value = 0; } catch (e) { /* no audio yet */ }
    const f = this.el = document.createElement('iframe');
    f.setAttribute('title', 'SOOTBORN: The High Docks'); f.setAttribute('allow', 'fullscreen; gamepad');
    f.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;border:0;z-index:99999;background:#07070d';
    this.onMsg = e => {
      const d = e.data; if (!d || typeof d.sootborn !== 'string' || !this.el || e.source !== this.el.contentWindow) return;
      if (d.sootborn === 'issue-ready') { this.ready = true; try { this.el.focus(); } catch (er) { /* fine */ } }
      if (d.sootborn === 'issue-done') this.finish(true, d.data);
    };
    window.addEventListener('message', this.onMsg);
    f.srcdoc = html; document.body.appendChild(f);
    this.timer = setTimeout(() => { if (!this.ready) this.finish(false); }, 15000);
  },
  finish(ok, data) {
    if (!this.on) return; this.on = false; clearTimeout(this.timer); window.removeEventListener('message', this.onMsg);
    if (this.el) this.el.remove(); this.el = null; Sound.setVol(); try { window.focus(); } catch (e) { /* fine */ }
    if (ok && data && !data.skipped) Store.set('sootborn_issue_' + this.key, '1');
    const d = this.done; this.done = null; if (d) d(ok);
  }
};
