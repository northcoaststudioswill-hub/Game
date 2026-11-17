// Starhaven — the HUD and menus (HTML on top of the game canvas, so text stays sharp on a phone).
(function (SH) {
  const $ = id => document.getElementById(id);
  const H = {};
  let lastHearts = -1, lastSign = null, toastT = 0;

  H.hearts = function (n, max) {
    if (n === lastHearts) return;
    const el = $('hearts');
    let html = '';
    for (let i = 0; i < max; i++) html += `<span class="gem ${i < n ? 'full' : 'empty'}"></span>`;
    el.innerHTML = html;
    if (lastHearts > n) { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); }
    lastHearts = n;
  };

  H.goal = function (mode) {
    $('goal').innerHTML = mode === 'done'
      ? 'Grove cleared. Run it again, or open the menu to tune the feel.'
      : '<span class="tag">GOAL</span> Cross the grove to the far lantern <span class="arrow">&rarr;</span>';
  };

  H.sign = function (s) {
    if (s === lastSign && !H.dirty) return;
    H.dirty = false;
    lastSign = s;
    const el = $('sign');
    if (!s) { el.classList.remove('show'); return; }
    el.innerHTML = SH.input.fill(s.text);
    el.classList.add('show');
  };

  H.toast = function (text) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 3200);
  };

  H.title = function (show) { $('title').classList.toggle('show', show); };
  H.menu = function (show) { $('menu').classList.toggle('show', show); };

  const fmt = s => { const m = Math.floor(s / 60), r = s - m * 60; return (m ? m + ':' + (r < 10 ? '0' : '') : '') + r.toFixed(1) + (m ? '' : ' s'); };
  H.results = function (r) {
    const el = $('results');
    if (!r) { el.classList.remove('show'); return; }
    $('res-body').innerHTML = `
      <div class="big">${fmt(r.secs)}</div>
      <div class="sub">${r.isBest ? 'New best time' : 'Best: ' + fmt(r.best)}</div>
      <ul>
        <li><b>${r.hurt}</b> hits taken</li>
        <li><b>${r.perfect}</b> perfect dodges</li>
        <li><b>${r.pogos}</b> pogo bounces</li>
      </ul>`;
    el.classList.add('show');
  };

  // ---------------- TUNE panel: live sliders for the movement numbers
  H.tune = function (show) {
    const el = $('tune');
    el.classList.toggle('show', !!show);
    if (show) H.buildTune();
  };
  H.buildTune = function () {
    const list = $('tune-list');
    list.innerHTML = '';
    for (const s of SH.TUNE_SLIDERS) {
      const row = document.createElement('label');
      row.className = 'trow';
      const val = SH.tune[s.key];
      row.innerHTML = `<span class="tl">${s.label}</span><input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${val}"><span class="tv">${fmtNum(val, s.step)}</span>`;
      const input = row.querySelector('input'), out = row.querySelector('.tv');
      input.addEventListener('input', () => {
        SH.tune[s.key] = parseFloat(input.value);
        out.textContent = fmtNum(SH.tune[s.key], s.step);
        out.classList.toggle('changed', SH.tune[s.key] !== SH.TUNE_DEFAULTS[s.key]);
        H.saveTune();
      });
      out.classList.toggle('changed', val !== SH.TUNE_DEFAULTS[s.key]);
      list.appendChild(row);
    }
  };
  const fmtNum = (v, step) => step >= 1 ? String(Math.round(v)) : v.toFixed(step < 0.05 ? 2 : 1);
  H.saveTune = function () {
    const diff = {};
    for (const k in SH.TUNE_DEFAULTS) if (SH.tune[k] !== SH.TUNE_DEFAULTS[k]) diff[k] = SH.tune[k];
    SH.store.set('starhaven.tune.v1', diff);
  };
  H.tuneText = function () {
    const parts = SH.TUNE_SLIDERS.map(s => `${s.label}: ${fmtNum(SH.tune[s.key], s.step)}${SH.tune[s.key] !== SH.TUNE_DEFAULTS[s.key] ? ' (changed)' : ''}`);
    return 'Starhaven feel numbers\n' + parts.join('\n');
  };

  H.bind = function () {
    const G = SH.game;
    $('title').addEventListener('click', () => G.start());
    $('pause-btn').addEventListener('click', () => G.state === 'pause' ? G.resume() : G.pause());
    $('m-resume').addEventListener('click', () => G.resume());
    $('m-tune').addEventListener('click', () => { H.menu(false); H.tune(true); });
    $('m-restart').addEventListener('click', () => { H.menu(false); G.restart(); });
    $('m-controls').addEventListener('click', () => $('controls').classList.toggle('show'));
    const fs = $('m-fullscreen');
    if (document.documentElement.requestFullscreen) fs.addEventListener('click', () => { document.documentElement.requestFullscreen().catch(() => { }); G.resume(); });
    else fs.style.display = 'none';
    $('t-back').addEventListener('click', () => G.resume());
    $('t-reset').addEventListener('click', () => { SH.tune = Object.assign({}, SH.TUNE_DEFAULTS); H.saveTune(); H.buildTune(); });
    $('t-copy').addEventListener('click', () => {
      const text = H.tuneText(), btn = $('t-copy');
      const done = () => { btn.textContent = 'Copied'; setTimeout(() => (btn.textContent = 'Copy numbers'), 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => { $('t-out').value = text; $('t-out').style.display = 'block'; });
      else { $('t-out').value = text; $('t-out').style.display = 'block'; }
    });
    $('r-again').addEventListener('click', () => { H.results(null); G.restart(); });
    $('r-stay').addEventListener('click', () => { H.results(null); G.state = 'play'; SH.input.clear(); });
    SH.input.onSourceChange = src => {
      document.body.dataset.input = src;
      H.dirty = true;
    };
    document.body.dataset.input = SH.input.source;
    const best = SH.store.get('starhaven.best.v1', null);
    if (best != null) $('title-best').textContent = 'Best time: ' + fmt(best);
  };

  SH.game.hud = H;
})(window.SH = window.SH || {});
