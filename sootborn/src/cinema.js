// ============================================================
// systems/cinema — in-engine cutscenes: cards, actors, pans, light, letterbox
// Step types: {card,sub,big} {scene,cam,dark} {add:[[id,x,y,dir,who]]} {move,to,spd,wait}
// {face,dir} {remove} {say,t} {narr} {choice} {wait} {pan,dur} {music} {sfx} {flash} {beam}
// {shake} {fade:'out'|'in'} {pillarRed} {fx}
// ============================================================
// where a flash-forward lands inside the Assay: the beats in story order, the current one lit
const ASSAY_BEATS = [[/first night/i, 'NIGHT 1'], [/day three\b/i, 'DAY 3'], [/day nineteen/i, 'DAY 19'], [/night twenty-five/i, 'NIGHT 25'], [/day twenty-six/i, 'DAY 26'], [/night twenty-eight/i, 'NIGHT 28'], [/day thirty-one/i, 'DAY 31'], [/day forty/i, 'DAY 40'], [/last day\.?$/i, 'LAST DAY']];
function assayCal(sub) { if (!sub || !/assay/i.test(sub)) return ''; const k = ASSAY_BEATS.findIndex(b => b[0].test(sub)); if (k < 0) return ''; return '<div class="acal">' + ASSAY_BEATS.map((b, i) => `<span class="${i === k ? 'on' : ''}"><i></i>${b[1]}</span>`).join('') + '</div>'; }
// the strip that runs on past the Assay into years: lit at the year a flash-forward lands on
const YEAR_WORDS = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
function yearCal(title) { const m = /^(\w+) YEARS? AFTER THE FURNACE$/.exec(title || ''), k = m ? YEAR_WORDS.indexOf(m[1]) : -1; if (k < 0) return ''; return '<div class="acal years">' + YEAR_WORDS.map((w, i) => `<span class="${i === k ? 'on' : i < k ? 'past' : ''}"><i></i>${i === 0 ? 'FURNACE' : '+' + i}</span>`).join('') + '</div>'; }
const Cutscene = {
  active: false, steps: [], i: 0, actors: [], cam: { x: 0, y: 0 }, block: null, letter: 0, beam: 0, beamT: 0, flash: 0, flashC: '#fff', shake: 0, dark: null, onEnd: null, pillarRed: false, motes: [],
  actor(id) { return this.actors.find(a => a.id === id); },
  play(steps, onEnd) { this.noSkip = false;
    Object.assign(this, { steps, i: 0, onEnd, active: true, actors: [], letter: 1, beam: 0, flash: 0, shake: 0, dark: null, pillarRed: false, motes: [], furnace: 0, zoom: 1, zoomT: 1, heart: 0, heartT: 0, vignette: 0, lift: 0, hung: 0, glowK: 0, sun: 0, sunT: 0, panel: null });
    G.mode = 'cine'; $('#cskip').classList.remove('hidden'); this.next();
  },
  next() {
    this.block = null;
    while (this.active && this.i < this.steps.length) { const s = this.steps[this.i++]; if (s && this.run(s)) return; }
    if (this.active && !this.block) this.end();
  },
  // tr: how the card arrives. One look for each kind of jump in time, so it only has to be learned once:
  // wake (back to the present below), furnace (back to before the furnace), strip (to the Assay), step (on, inside the Assay), chalk (the same time, somewhere else), page (into a comic-book level)
  card(t, sub, big, tr) {
    const el = $('#card'); el.classList.remove('hidden'); if (!tr && big && /assay/i.test(sub || '')) tr = /^FOUR YEARS AFTER/.test(t) ? 'strip' : 'step';
    el.className = el.className.replace(/\s*\btr-\w+/g, ''); void el.offsetWidth; if (tr && !Settings.d.reduce) { el.classList.add('tr-' + tr); const sf = { wake: 'dash', furnace: 'heart', ash: 'heart', eleven: 'pillar', strip: 'stage', years: 'stage', chalk: 'clue', page: 'page' }[tr]; if (sf) Sound.play(sf); }
    el.innerHTML = big ? `<div class="bigt">${esc(t)}</div>${sub ? `<div class="bigs">${esc(sub)}</div>` : ''}${tr === 'years' ? yearCal(t) : assayCal(sub)}` : `<p>${esc(t)}</p>${sub ? `<p class="s">${esc(sub)}</p>` : ''}`;
    el.classList.remove('on'); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')));
  },
  hideCard() { const el = $('#card'); el.classList.add('hidden'); el.classList.remove('on'); },
  run(s) {
    const T = (x, y) => ({ x: x * 16 + 8, y: y * 16 + 12 });
    if (s.when && !s.when()) return false;
    if (s.plate || s.ledger || s.pages) { const rest = this.steps.slice(this.i), cb = this.onEnd, go = () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play(rest, cb); }; this.onEnd = null; this.steps = []; this.end();
      if (s.ledger) Prelude.ledger(go); else if (s.pages) Prelude.pages(typeof s.pages === 'function' ? s.pages() : s.pages, go, s.music); else Prelude.plate(s.plate, s.secs, go, { count: s.count, white: s.white, hold: s.hold, arg: s.arg }); return true; }
    if (s.issue) { const rest = this.steps.slice(this.i), cb = this.onEnd, or = s.or || []; this.onEnd = null; this.steps = []; this.end(); Issue.start(s.issue, ok => { G.flags['issue_' + s.issue + (s.cold ? 'cold' : '')] = ok ? 1 : 0; Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play((ok ? [] : or).concat(rest), cb); }, s.cold); return true; }
    if (s.mission) { const rest = this.steps.slice(this.i), cb = this.onEnd; this.onEnd = null; this.steps = []; this.end(); Mission.start(s.mission, () => { Fade.a = 1; Fade.dir = 0; Fade.busy = false; Cutscene.play(rest, cb); }); return true; }
    if (s.card !== undefined) { this.card(s.card, s.sub, s.big, s.tr); if (s.sfx) Sound.play(s.sfx); this.block = { type: 'card', t: 0, min: s.min || 1.4, max: s.max || 7 }; return true; }
    if (s.scene) { this.hideCard(); this.panel = null; World.load(s.scene, null, true); this.actors = []; this.dark = s.dark || null; this.cam = { x: s.cam[0] * 16 + 8, y: s.cam[1] * 16 }; this.pillarRed = false; this.beam = 0; this.furnace = 0; this.motes = []; this.zoomT = s.zoom || 1; this.zoom = this.zoomT; return false; }
    if (s.add) { for (const [id, x, y, dir, who] of s.add) { const p = T(x, y); this.actors.push({ id, who: who || id, x: p.x, y: p.y, dir: dir || 0, sheet: id === 'kael' ? P.sheet : World.sheetFor(who || id), anim: 0, moving: false }); } return false; }
    if (s.remove) { this.actors = this.actors.filter(a => a.id !== s.remove); return false; }
    if (s.face) { const a = this.actor(s.face); if (a) a.dir = s.dir; return false; }
    if (s.kneel) { for (const a of this.actors) if (s.kneel === 'all' ? !a.sheet.glow && !(s.but || []).includes(a.id) : [].concat(s.kneel).includes(a.id)) a.kneel = s.v === undefined ? 1 : s.v; return false; }
    if (s.emote) { const a = this.actor(s.emote); if (a) { a.emote = { t: s.t || '!', life: s.life || 1.5 }; a.hop = 0.3; Sound.play(s.t === 'heart' ? 'coin' : 'blip'); } return false; }
    if (s.move) { const a = this.actor(s.move), p = T(s.to[0], s.to[1]); a.tx = p.x; a.ty = p.y; a.spd = s.spd || 30; if (s.wait) { this.block = { type: 'move', a }; return true; } return false; }
    if (s.say || s.narr || s.choice) {
      const st = s.choice ? [{ choice: s.choice }] : s.narr ? [narr(s.narr)] : [say(s.say, s.t)];
      this.block = { type: 'dlg' }; Dialogue.start(st, () => { if (this.active) this.next(); }); return true;
    }
    if (s.brawl !== undefined) { const d = typeof s.brawl === 'function' ? s.brawl() : s.brawl; if (!d) return false; this.hideCard(); this.block = { type: 'brawl' }; Brawl.start(d, () => { if (!this.active) return; this.next(); if (this.active && Fade.a >= 1 && !Fade.busy) { Fade.dir = -1; Fade.sp = 1.6; Fade.busy = true; } }); Fade.a = 1; Fade.dir = -1; Fade.sp = 2.4; Fade.busy = true; return true; }
    if (s.noskip !== undefined) { this.noSkip = !!s.noskip; HUD.dirty = true; return false; }
    if (s.dlg) { this.block = { type: 'dlg' }; Dialogue.start(s.dlg, () => { if (this.active) this.next(); }); return true; }
    if (s.wait) { this.block = { type: 'wait', t: s.wait }; return true; }
    if (s.pan) { this.pan = { from: { ...this.cam }, to: { x: s.pan[0] * 16 + 8, y: s.pan[1] * 16 }, t: 0, d: s.dur || 2 }; if (s.hold !== false) { this.block = { type: 'pan' }; return true; } return false; }
    if (s.fade === 'out') { this.block = { type: 'fade' }; Fade.go(() => { if (this.active) this.next(); }, s.spd || 1.4, true); return true; }
    if (s.fade === 'in') { this.hideCard(); Fade.a = 1; Fade.dir = -1; Fade.sp = s.spd || 1; Fade.busy = true; }
    if (s.panel !== undefined) { this.hideCard(); this.panel = s.panel ? { id: s.panel, t: 0, stage: s.stage || 0, st: 0 } : null; }
    if (s.pstage !== undefined && this.panel) { this.panel.stage = s.pstage; this.panel.st = 0; }
    if (s.music !== undefined) Sound.music(s.music);
    if (s.sfx) Sound.play(s.sfx);
    if (s.flash) { this.flash = 1; this.flashC = s.flash; }
    if (s.beam !== undefined) this.beam = s.beam;
    if (s.shake) this.shake = s.shake;
    if (s.pillarRed) this.pillarRed = true;
    if (s.zoom !== undefined) this.zoomT = s.zoom;
    if (s.heart !== undefined) this.heart = s.heart;
    if (s.vignette !== undefined) this.vignette = s.vignette;
    if (s.letter !== undefined) this.letter = s.letter;
    if (s.fx) s.fx();
    return false;
  },
  // everything that moves: runs every frame, including while a line of dialogue is up
  anim(dt) {
    for (const a of this.actors) {
      a.kn = (a.kn || 0) + ((a.kneel ? 7 : 0) - (a.kn || 0)) * Math.min(1, dt * 7); if (a.hop > 0) a.hop -= dt; if (a.emote) { a.emote.life -= dt; if (a.emote.life <= 0) a.emote = null; }
      if (a.tx === undefined) { a.moving = false; continue; }
      const dx = a.tx - a.x, dy = a.ty - a.y, d = Math.hypot(dx, dy), sp = a.spd * dt;
      if (d <= sp) { a.x = a.tx; a.y = a.ty; a.tx = undefined; a.moving = false; continue; }
      a.x += dx / d * sp; a.y += dy / d * sp; a.moving = true; a.anim += dt;
      a.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 2 : 3) : (dy < 0 ? 1 : 0);
    }
    if (this.pan) { const p = this.pan; p.t += dt; const k = Math.min(1, p.t / p.d), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      this.cam = { x: p.from.x + (p.to.x - p.from.x) * e, y: p.from.y + (p.to.y - p.from.y) * e }; if (k >= 1) { this.pan = null; if (this.block && this.block.type === 'pan' && !Dialogue.active) this.next(); } }
    if (this.panel) { this.panel.t += dt; this.panel.st += dt; }
    this.zoom += (this.zoomT - this.zoom) * Math.min(1, dt * 2.5); this.sun += ((this.sunT || 0) - (this.sun || 0)) * Math.min(1, dt * 0.9);
    if (this.heart) { this.heartT -= dt; if (this.heartT <= 0) { Sound.play('heart'); this.heartT = 0.85; } }
    this.flash = Math.max(0, this.flash - dt * 0.8); this.shake = Math.max(0, this.shake - dt); this.beamT += dt;
  },
  update(dt) {
    this.anim(dt);
    const b = this.block; if (!b) return;
    if (b.type === 'card') { b.t += dt; if ((b.t > b.min && (Input.p('A') || this.tapped)) || b.t > b.max) { this.tapped = false; this.next(); } this.tapped = false; }
    else if (b.type === 'wait') { b.t -= dt; if (b.t <= 0) this.next(); }
    else if (b.type === 'move') { if (b.a.tx === undefined) this.next(); }
    if (Input.p('START')) this.skip();
  },
  skip(force) {
    if (!this.active || (this.noSkip && !force)) return; this.noSkip = false;
    if (Brawl.active) { Brawl.active = false; Brawl.onEnd = null; Brawl.cine = null; }
    Dialogue.stack = []; Dialogue.onEnd = null; if (Dialogue.active) { Dialogue.active = false; $('#dlg').classList.add('hidden'); }
    Fade.a = 0; Fade.dir = 0; Fade.busy = false; Fade.cb = null;
    this.end();
  },
  end() {
    this.active = false; this.hideCard(); $('#cskip').classList.add('hidden');
    this.beam = 0; this.letter = 0; this.dark = null; this.actors = []; this.block = null; this.furnace = 0; this.zoom = this.zoomT = 1; this.heart = 0; this.vignette = 0; this.lift = 0; this.hung = 0; this.glowK = 0; this.sun = this.sunT = 0; this.panel = null;
    const cb = this.onEnd; this.onEnd = null; Input.consume(); cb && cb();
  },
  // drawn after World lighting: the Accredited are never in shadow
  renderFX(g, cx, cy, t) {
    if (this.beam > 0) {
      const bx = 13 * 16 - cx, top = 24 - cy, a = this.beam * (0.55 + Math.sin(t * 2) * 0.05);
      g.globalCompositeOperation = 'lighter';
      const gr = g.createLinearGradient(0, top, 0, top + 120); gr.addColorStop(0, `rgba(255,246,214,${a})`); gr.addColorStop(1, 'rgba(255,230,170,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(bx - 14, top); g.lineTo(bx + 14, top); g.lineTo(bx + 46, top + 120); g.lineTo(bx - 46, top + 120); g.closePath(); g.fill();
      if (this.motes.length < 40) this.motes.push({ x: bx + (Math.random() - .5) * 60 + cx, y: top + cy + Math.random() * 100, v: 4 + Math.random() * 8 });
      g.fillStyle = 'rgba(255,240,190,.9)'; for (const m of this.motes) { m.y -= m.v / 60; g.fillRect(Math.round(m.x - cx), Math.round(m.y - cy), 1, 1); }
      this.motes = this.motes.filter(m => m.y - cy > top);
      g.globalCompositeOperation = 'source-over';
    }
    for (const a of this.actors) if (a.sheet.glow) {
      const x = Math.round(a.x - cx), y = Math.round(a.y - cy) - 10;
      g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 0, x, y, 26); gr.addColorStop(0, 'rgba(255,230,160,.2)'); gr.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = gr; g.fillRect(x - 26, y - 26, 52, 52);
      g.globalCompositeOperation = 'source-over';
      const f = a.moving ? 1 + (Math.floor(a.anim * 5) % 2) : 0; const ah = a.sheet.fh; g.drawImage(a.sheet, f * 16, a.dir * ah, 16, ah, x - 8, Math.round(a.y - cy) - ah + 1, 16, ah);
    }
    if (this.glowK) { const a = this.actor('kael'); if (a) { const x = Math.round(a.x - cx) + (a.dir === 2 ? -7 : 7), y = Math.round(a.y - cy) - 9; g.fillStyle = '#e8a040'; g.fillRect(x - 2, y - 2, 5, 5); g.fillStyle = '#fff0b0'; g.fillRect(x - 1, y - 1, 3, 3); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 0, x, y, 30); gr.addColorStop(0, 'rgba(255,200,110,.5)'); gr.addColorStop(1, 'rgba(255,200,110,0)'); g.fillStyle = gr; g.fillRect(x - 30, y - 30, 60, 60); g.globalCompositeOperation = 'source-over'; } }
    if (this.sun > 0.01) { const x = 13 * 16 + 8 - cx, y = 8 * 16 - 24 - cy, k = this.sun, rm = Settings.d.reduce;
      g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + (rm ? 0 : t * 0.07), wd = i % 2 ? 0.07 : 0.11; g.fillStyle = `rgba(255,214,120,${0.11 * k})`; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a - wd) * 300, y + Math.sin(a - wd) * 300); g.lineTo(x + Math.cos(a + wd) * 300, y + Math.sin(a + wd) * 300); g.closePath(); g.fill(); }
      const gr = g.createRadialGradient(x, y, 0, x, y, 180 * k + 1); gr.addColorStop(0, `rgba(255,236,170,${0.7 * k})`); gr.addColorStop(.35, `rgba(255,200,110,${0.3 * k})`); gr.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.fillStyle = `rgba(255,224,140,${0.2 * k})`; g.beginPath(); g.ellipse(x, y + 74, 78 * k, 34 * k, 0, 0, 6.3); g.fill();
      g.globalCompositeOperation = 'source-over';
      if (F('washerOn')) { g.strokeStyle = `rgba(40,20,10,${0.5 * k})`; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y + 74, 12, 5, 0, 0, 6.3); g.stroke(); } }
    if (this.furnace) { const fx = 15 * 16 - cx, fy = 16 + 8 - cy, k = 0.8 + Math.sin(t * 9) * .08 + Math.random() * .06;
      g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(fx, fy, 0, fx, fy, 130 * k); gr.addColorStop(0, 'rgba(255,190,90,.75)'); gr.addColorStop(.4, 'rgba(255,90,30,.35)'); gr.addColorStop(1, 'rgba(255,40,10,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.fillStyle = 'rgba(255,240,200,.9)'; g.fillRect(fx - 12, fy - 6, 24, 8); g.globalCompositeOperation = 'source-over';
      for (let i = 0; i < 6; i++) { g.fillStyle = '#ffb060'; g.fillRect(Math.round(fx - 20 + Math.random() * 40), Math.round(fy + Math.random() * 60), 1, 1); } }
  },
  renderOverlay(g, t) {
    if (this.vignette) { const p = this.heart ? 0.5 + 0.5 * Math.max(0, Math.sin(t * 7.4)) : 0.6; const gr = g.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.62); gr.addColorStop(0, 'rgba(80,0,0,0)'); gr.addColorStop(1, `rgba(90,0,0,${0.55 * p})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    if (this.letter) { g.fillStyle = '#000'; g.fillRect(0, 0, W, 14); g.fillRect(0, H - 14, W, 14); }
    if (this.flash > 0) { g.fillStyle = this.flashC; g.globalAlpha = Math.min(1, this.flash) * (Settings.d.reduce ? .3 : .85); g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  }
};

// ================= PROLOGUE A: the love, the fever, the plan =================
const PROLOGUE_A = [
  { music: 'mystery' }, { letter: 1 },
  { panel: 'world' }, { fade: 'in', spd: 0.7 }, { wait: 1.2 },
  { narr: 'They say the surface burned two hundred years ago. That the sky is poison now, and the sun is a furnace that eats lungs.' },
  { pstage: 1 }, { wait: 2.4 },
  { narr: 'So we live below. Cinderwell. Six tiers of rock wrapped around a machine called the Deep Array, which makes the only air there is.' },
  { pstage: 2 }, { wait: 0.8 },
  { narr: 'We keep the Array running. The Array Authority keeps the count. Every breath down here is rationed, logged, and owed.' },
  { narr: 'They have a word for us. Soot. The thing that is left over when something useful burns.' },
  { pstage: 3 }, { wait: 1.6 },
  { narr: 'Once in a decade they come down Lift Zero, in white, in light. We kneel. They go back up.' },
  { narr: 'Nobody from Cinderwell has ever gone with them.' },
  { narr: 'My name is Kael Brennick. I fix valves on Tier 6. And one year ago tonight, I thought the worst thing that could happen to me was a girl saying no.' },
  { fade: 'out' }, { panel: null }, { music: 'home' },
  { card: 'ELEVEN MONTHS BEFORE THE FURNACE', sub: 'The Festival of the First Fire. Ashgate Square.', tr: 'furnace', min: 1.6, max: 4 },
  { scene: 'square', cam: [11, 9], dark: 'rgba(8,5,16,.32)', zoom: 2.2 },
  { add: [['seren', 12, 9, 1], ['kael', 7, 9, 3], ['c1', 6, 5, 0, 'c1'], ['c2', 18, 6, 2, 'c2'], ['ivo', 16, 11, 2], ['juno', 9, 12, 1]] },
  { fade: 'in' }, { wait: 0.6 },
  { narr: 'Once a year, Cinderwell lights paper lanterns and pretends the Lumen Pillar is the sun. It is the only night anyone stays out past last bell.' },
  { move: 'kael', to: [11, 9], spd: 26, wait: true },
  { emote: 'seren', t: '!' }, { face: 'seren', dir: 2 },
  { say: 'seren', t: "Don't look. It's not finished." },
  { face: 'seren', dir: 1 },
  { say: 'kael', t: "It's a sun." },
  { face: 'seren', dir: 2 },
  { say: 'seren', t: "It's THE sun. The real one. Orin says it's white-gold, and you can't look straight at it, and it never needs a valve." },
  { choice: [
    { t: "I can't look straight at you either. Same problem.", then: [say('seren', '...That was disgusting.'), say('seren', 'Say it again.')] },
    { t: "Paint me one I can carry, then.", fx: () => setF('ambitiousYouth'), then: [say('seren', 'Greedy. You always want the one you can hold.')] },
    { t: "One day I'll show you the real one.", fx: () => setF('promisedSky'), then: [say('seren', "Don't promise me the sky, Kael Brennick. Promise me tomorrow. Tomorrow I can use.")] }
  ] },
  { panel: 'hands' }, { sfx: 'clue' },
  { narr: 'You have been carrying it in your pocket for three weeks. A brass washer from Bank Seven, filed smooth on your lunch breaks until it shines like something that matters.' },
  { say: 'kael', t: "Seren Holloway. I can't give you the sky. But I can give you a perfectly balanced pressure seal." },
  { say: 'seren', t: "...That is the worst proposal in the history of Cinderwell." },
  { pstage: 1 }, { sfx: 'coin' },
  { say: 'seren', t: 'Aye. Obviously aye. Put it on me before I come to my senses.' },
  { wait: 0.9 }, { panel: null }, { emote: 'seren', t: 'heart' }, { emote: 'kael', t: 'heart' }, { move: 'ivo', to: [13, 10], spd: 40 }, { move: 'juno', to: [10, 10], spd: 46 }, { move: 'c1', to: [8, 7], spd: 30 }, { move: 'c2', to: [15, 8], spd: 30 },
  { narr: 'Mara binds you at the Pillar, in front of the whole crew, with chalk on your hands and Ivo crying louder than anyone.' },
  { emote: 'ivo', t: '...' },
  { say: 'ivo', t: "I'm not crying. The square is dusty. The square is VERY dusty." },
  { emote: 'juno', t: '!' },
  { narr: 'Seren draws the last ray of her sun on your wrist with her finger. "There," she says. "Now you\'ve seen it."' },
  { fade: 'out' },
  { music: 'mystery' },
  { card: 'FOUR DAYS BEFORE THE FURNACE', sub: 'The fever comes to Tier Six.', min: 1.2, max: 4 },
  { scene: 'apt', cam: [4, 4], dark: 'rgba(4,3,12,.55)', zoom: 1.8 },
  { add: [['tavi', 1.5, 2.4, 0], ['kael', 3, 3, 2], ['nell', 4.4, 3, 2], ['seren', 5.6, 3.6, 2]] },
  { fade: 'in' }, { wait: 0.8 }, { sfx: 'cough' }, { wait: 0.9 }, { sfx: 'cough' },
  { emote: 'tavi', t: '...' },
  { say: 'tavi', t: '...Kael? Is it morning? It feels like breathing through a sock.' },
  { say: 'kael', t: "Not morning yet, Tav. Sleep. That's an order from your favorite person." },
  { say: 'tavi', t: "Seren's my favorite person." },
  { say: 'seren', t: 'Smart kid.' },
  { face: 'kael', dir: 3 }, { move: 'seren', to: [5, 3.2], spd: 14 },
  { say: 'nell', t: "I'll be honest, because you'd know if I wasn't. The fever isn't what kills them. It's the air." },
  { panel: 'ward' },
  { say: 'nell', t: 'The Authority cut the clinic to ration pressure a month ago. Forty kids, breathing each other\'s breath. Tavi\'s lungs are filling.' },
  { narr: 'You have seen the ward. Six cots to a row. You can hear a room full of children working for every breath, and once you have heard it you cannot stop.' },
  { panel: null },
  { say: 'kael', t: "Then we get the clinic more air." },
  { say: 'nell', t: "From where? Every cubic meter in Cinderwell is counted. Tier 6 doesn't get one breath more than its ration." },
  { panel: 'pipe' },
  { say: 'kael', t: "Not every meter. Bank Seven has a line nobody's allowed to touch. Authority seal. Fat as my arm." },
  { say: 'kael', t: "I read its gauge once. That one pipe carries more air than all of Tier 6 put together. Every night. Going somewhere." },
  { say: 'seren', t: "It's Authority, Kael. If they so much as see a needle twitch—" },
  { pstage: 1 }, { sfx: 'rotate' },
  { say: 'kael', t: "So we bleed it slow. A sliver, into the clinic line. And we balance the bank again before the morning audit. Nobody sees a thing." },
  { narr: 'Stealing air is the one crime the Authority never forgives. They do not fine you for it. They do not jail you. They commit you to the Array, and the Array runs on fire.' },
  { panel: null },
  { emote: 'nell', t: '...' },
  { say: 'nell', t: "...I didn't hear any of this. I'll have the ward vents open at second bell." },
  { move: 'nell', to: [6, 8], spd: 30 }, { move: 'seren', to: [4.2, 3], spd: 24 },
  { say: 'seren', t: 'Why you? Why does it always have to be you?' },
  { choice: [
    { t: "Because I won't watch Tav drown in their own bed.", fx: () => G.tendency = 'caretaker', then: [say('seren', "...Aye. That's the answer I married, you idiot. That exact one.")] },
    { t: "Because I'm better at this than anyone they've got.", fx: () => G.tendency = 'tinkerer', then: [say('seren', "Modest, too. Fine. You are. It's infuriating.")] },
    { t: 'Because one day I want to be the one who decides who breathes.', fx: () => G.tendency = 'seeker', then: [say('seren', "...Careful, Kael. That's how they talk."), say('kael', 'Then somebody had better learn the language.')] }
  ] },
  { say: 'seren', t: "Listen. The audit relay is on the east wall, straight across the bay from the door: the grey box with the red lamp. Cut that first, or the bank logs every turn you make." },
  { say: 'seren', t: "Then Valve Bank Seven, on the north wall. Relay, then bank. Say it back." },
  { say: 'kael', t: "Relay, east wall. Then the bank." },
  { say: 'seren', t: "Fine. I'll keep watch. Night Tallyman walks Bay Three every hour with a lantern. If he sees you, you're a thief. If he sees me, I'm lost." },
  { say: 'kael', t: "And if he sees both of us?" },
  { say: 'seren', t: "Then we're newlyweds looking for somewhere private. Try to look embarrassed. Shouldn't be hard." },
  { fade: 'out' },
  { card: 'Bay Three · Second bell', sub: 'Cross the bay to the audit relay on the far (east) wall and hold A to cut it. Then reach Valve Bank Seven on the north wall. A marker points the way. The lamps sweep: move when they turn away. Throw bolts to pull a guard off his post.', min: 1, max: 4 }
];

// ================= PROLOGUE B: the audit, the sentence, the furnace =================
const PROLOGUE_B = [
  { scene: 'bay', cam: [9, 3], dark: 'rgba(4,3,12,.55)', zoom: 2.4 },
  { add: [['kael', 10, 2, 1], ['seren', 8, 3, 3]] },
  { fade: 'in', spd: 3 },
  { narr: 'The forbidden line shudders. A sliver of the Authority\'s air bleeds sideways, into the clinic line, and runs downhill toward forty sleeping children.' },
  { face: 'kael', dir: 2 },
  { say: 'seren', t: 'Kael. Did it work?' },
  { say: 'kael', t: 'Listen.' },
  { panel: 'ward', stage: 1 }, { sfx: 'solved' },
  { narr: 'Far off, through the vents: the clinic fans spinning up. Then a cheer, thin and tired, from a ward full of children who can suddenly breathe.' },
  { wait: 0.8 }, { panel: null },
  { say: 'seren', t: "You're insufferable when you're right." },
  { say: 'kael', t: 'Then I plan to be insufferable for a very long time.' },
  { say: 'seren', t: "Balance it back before the audit. Promise me. Every night until the fever breaks, and then never again." },
  { say: 'kael', t: 'Every night. Balanced by dawn. On my breath.' },
  { narr: 'She pulls you close by the collar. For a moment, Cinderwell is warm for the right reasons.' },
  { fade: 'out' }, { music: null },
  { card: 'For three nights, you bled the line and balanced the bank by dawn.', sub: 'On the third night, the fever broke. Tavi asked for bread.', min: 1.6, max: 6 },
  { card: 'On the fourth morning, the audit came early.', sub: 'It did not come by gauge. It came down Lift Zero.', min: 1.6, max: 6 },
  { scene: 'square', cam: [13, 4], dark: 'rgba(10,6,14,.5)', zoom: 1.5 },
  { add: [['kael', 11, 7, 1], ['mara', 10, 7, 1], ['ivo', 12, 8, 1], ['tavi', 11, 9, 1], ['seren', 15, 7, 1], ['c1', 8, 7, 1, 'c1'], ['c2', 9, 8, 1, 'c2'], ['c3', 14, 9, 1, 'c3'], ['c4', 16, 8, 1, 'c4'],
    ['pell', 7, 8, 1], ['bao', 17, 7, 1], ['juno', 13, 10, 1], ['nell', 18, 8, 1], ['orin', 6, 7, 1], ['vale', 11, 4, 0]] },
  { fade: 'in' }, { wait: 0.8 },
  { narr: 'The whole tier was summoned to Ashgate. Nobody was told why. Nobody needed to be.' },
  { sfx: 'rumble' }, { shake: 0.9 }, { wait: 1 },
  { flash: '#fff6dc' }, { music: 'surface' }, { sfx: 'choir' }, { panel: 'lift' },
  { narr: 'Lift 0 opened for the first time in eleven years.' },
  { narr: 'Light came out of it like water out of a broken main. Real light. Not Pillar light. It had a color none of you had a word for.' },
  { wait: 0.6 }, { panel: null }, { beam: 1 },
  { add: [['celestine', 13, 1, 0], ['wl', 12, 1, 0, 'warden'], ['wr', 14, 1, 0, 'warden']] },
  { move: 'wl', to: [12, 4], spd: 14 }, { move: 'wr', to: [14, 4], spd: 14 }, { move: 'celestine', to: [13, 4], spd: 14, wait: true },
  { narr: 'They came down in light. Tall and unhurried, robed in white that had never known a smudge. Their skin had never known soot. Their voices had never needed to be raised.' },
  { narr: "Standing near them felt like standing near the sun Seren painted. You couldn't look straight at them. You couldn't look away." },
  { say: 'vale', t: 'Kneel for High Auditor Celestine Aurel of the Array Authority.' },
  { kneel: 'all', but: ['vale'] }, { sfx: 'step' },
  { narr: 'Cinderwell kneels. It is very good at kneeling.' },
  { zoom: 2.3 }, { pan: [13, 4], dur: 1.2 },
  { say: 'celestine', t: 'The Cinders. How... warm it is down here. I had been told. One is never quite prepared for the smell.' },
  { say: 'celestine', t: 'For three nights, a line that belongs to the Authority lost eleven percent of its pressure. And for three dawns, someone put it back. Very neatly.' },
  { say: 'celestine', t: 'I confess I admire it. A thief who tidies. It is almost civilized.' },
  { say: 'celestine', t: 'But the account must balance. And an account is not balanced by putting air back. It is balanced by taking something back.' },
  { say: 'vale', t: 'The bleed was routed through Valve Bank Seven. Crew Three. Night shift.' },
  { emote: 'kael', t: '!' },
  { narr: 'Your heart is a hammer. Your weight shifts to your feet. Mara feels it before you do.' },
  { pan: [11, 7], dur: 0.8 }, { zoom: 2.8 },
  { say: 'mara', t: "Don't. Kael. Don't you dare." },
  { zoom: 2.2 }, { pan: [13, 6], dur: 1 },
  { kneel: 'seren', v: 0 }, { wait: 0.5 }, { move: 'seren', to: [14, 6], spd: 22, wait: true },
  { say: 'seren', t: 'I turned the valve. Alone. Every night.' },
  { emote: 'ivo', t: '!' }, { emote: 'tavi', t: '!' },
  { narr: 'Every head in the square turns. She does not look at you. She is very, very careful not to look at you.' },
  { say: 'celestine', t: 'Oh, look. The soot has a spine.' },
  { say: 'celestine', t: 'Your name, little ember?' },
  { say: 'seren', t: "Seren Holloway. Crew Three. Forty kids are breathing because of me. I'd do it again tonight." },
  { say: 'celestine', t: 'There are always forty children. That is rather the problem with you.' },
  { choice: [
    { t: 'Stand up. Tell them it was you.', fx: () => { setF('triedConfess'); fury(1); }, then: [narr("You get one knee off the ground. Mara's hand closes on your collar like a vise. Ivo throws his whole weight on your other arm."), say('mara', "She's already chosen, boy. Don't you make it for nothing.")] },
    { t: 'Stay down. Let her save you.', fx: () => setF('stayedDown'), then: [narr('You stay down. It is the hardest thing you have ever done. You will do it again in your sleep, every night after.')] },
    { t: 'Will her to look at you.', fx: () => setF('caughtEye'), then: [narr('At the last moment, she does. And she smiles at you, like you just told her a terrible joke at a funeral.')] }
  ] },
  { say: 'celestine', t: 'Seren Holloway of Crew Three. For theft from the Array, you are committed to the Array. Your breath returns to the covenant.' },
  { say: 'celestine', t: "The heart-furnace, Bay Three, at last bell. Crew Three will attend. Gratitude is best learned up close." },
  { fade: 'out' }, { music: 'mystery' },
  { card: 'LAST BELL', sub: 'Bay Three · The heart-furnace', min: 1.2, max: 4 },
  { scene: 'bay', cam: [12, 6], dark: 'rgba(14,4,4,.5)', zoom: 2 },
  { add: [['kael', 12, 7, 1], ['mara', 11, 7, 1], ['ivo', 13, 7, 1], ['tavi', 12, 8, 1], ['dace', 10, 8, 1], ['nell', 14, 8, 1], ['c1', 15, 7, 1, 'c1'], ['c2', 16, 8, 1, 'c2'], ['c3', 9, 7, 1, 'c3'], ['c4', 17, 7, 1, 'c4'], ['orin', 8, 8, 1], ['vale', 18, 4, 2],
    ['celestine', 19, 3, 2], ['seren', 15, 5, 1], ['wl', 14, 5, 1, 'warden'], ['wr', 16, 5, 1, 'warden']] },
  { fade: 'in' }, { wait: 0.6 },
  { narr: 'They did not do it in the dark. The Authority believes in witnesses. All of Crew Three, front row. Tavi too. Especially Tavi.' },
  { say: 'kael', t: "Tav. Don't look. Look at me. Look at my boots." },
  { emote: 'tavi', t: '...' },
  { say: 'tavi', t: "I'm looking at her. Somebody has to." },
  { pan: [16, 4], dur: 2.2 }, { zoom: 2.4 },
  { say: 'celestine', t: 'Gratitude, Cinderwell, is not a feeling. It is a practice. One practises.' },
  { music: 'hum' },
  { narr: 'Somewhere in the back row, someone starts to hum the shift song. Then another. Then all of Crew Three, low, through closed teeth.' },
  { say: 'celestine', t: 'Silence.' },
  { move: 'wl', to: [15, 7], spd: 40, wait: true }, { sfx: 'hit' }, { shake: 0.5 }, { flash: '#ff2010' }, { face: 'c1', dir: 0 }, { kneel: 'c1' }, { emote: 'mara', t: '!' },
  { narr: 'A Warden drives a halberd butt into Hollis the welder. He folds without a sound. The humming stops. The silence after is worse.' },
  { move: 'wl', to: [14, 5], spd: 30 },
  { music: null }, { heart: 1 },
  { move: 'seren', to: [15, 3], spd: 9 }, { move: 'wr', to: [16, 3], spd: 9 }, { move: 'wl', to: [14, 3], spd: 9, wait: true },
  { sfx: 'roar' }, { flash: '#ff7a30' }, { shake: 1.2 }, { fx: () => { Cutscene.furnace = 1; } }, { vignette: 1 },
  { narr: 'The Wardens haul the furnace doors open. The heat hits the back row like a slap. The whole bay turns the color of a wound.' },
  { panel: 'furnace' },
  { narr: 'Her boots scrape on the grating. She is not crying. You will hate yourself, later, for being proud of that.' },
  { face: 'seren', dir: 0 }, { zoom: 3 }, { fx: () => { Cutscene.cam = { x: 15 * 16 + 8, y: 4 * 16 }; } },
  { say: 'seren', t: 'Hey. Hey, Kael. Look at me. Not at them. At me.' },
  { say: 'seren', t: 'You were always too much for this place. Too loud, too proud, too much. Good.' },
  { say: 'seren', t: 'Be too much for THEM.' },
  { narr: 'She lifts her hand so you can see the brass washer on her finger, catching the fire.' },
  { say: 'seren', t: 'Balance the bank. And don\'t you DARE stop breathing.' },
  { panel: null }, { fx: () => { Cutscene.cam = { x: 12 * 16 + 8, y: 6 * 16 }; } }, { zoom: 2.6 },
  { choice: [
    { t: 'SCREAM HER NAME.', fx: () => { fury(1); setF('screamed'); }, then: [narr("You scream her name until something in your throat tears and the sound turns to nothing. Mara's forearm locks across your chest. She is crying too. You will never forgive her for that. You will never forgive anyone for anything.")] },
    { t: 'BREAK FREE. RUN FOR HER.', fx: () => { fury(2); setF('ranForHer'); }, then: [{ fx: () => { Cutscene.shake = 1; Cutscene.flash = 1; Cutscene.flashC = '#ff2010'; Sound.play('hit'); } }, narr("Three steps. You make it three steps. A Warden's halberd takes you across the ribs and the grating comes up to meet your face. You taste iron. You crawl. Ivo lands on your back, sobbing, holding you down, saying sorry, sorry, sorry.")] },
    { t: "HOLD HER EYES. DON'T LET HER BE ALONE.", fx: () => setF('heldEyes'), then: [narr('You hold her eyes. You do not look away. Not for one second of what comes next. Whatever it costs. You owe her that. You owe her everything.')] }
  ] },
  { remove: 'seren' }, { panel: 'furnace', stage: 1 }, { wait: 2.8 },
  { narr: 'She walks the last of it herself. They do not have to push her. She would not give them that.' },
  { pstage: 2 }, { sfx: 'roar' }, { shake: 2 }, { heart: 0 }, { wait: 1.5 }, { sfx: 'hit' },
  { narr: 'The doors close.' }, { wait: 1.6 },
  { fade: 'out', spd: 3 }, { vignette: 0 },
  { card: 'ONE.', sub: 'She steals your bread on the first day of school and denies it with her mouth full.', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'TWO.', sub: 'Fifteen. Behind the noodle stall. She kisses you first, then tells the whole tier you started it.', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'THREE.', sub: 'She paints her first sun on your bunk wall. Your mother pretends to be angry for a week.', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'FOUR.', sub: 'The Tier 8 cave-in. She digs you out with her bare hands. She never once mentions it again.', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'FIVE.', sub: '"Kael Brennick, you are the most arrogant man in the Cinders." "Top three." "Top one."', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'SIX.', sub: 'The washer. Three weeks of lunch breaks. Her face when she sees it.', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'SEVEN.', sub: 'Pressure-bound at the Pillar. Ivo sobbing. Chalk on both your hands.', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'EIGHT.', sub: "Tavi's fever. Her hand flat on your back, all night, so you'd remember to breathe.", min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'NINE.', sub: 'The clinic fans spinning up. Her laughing into your collar.', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'TEN.', sub: '"Be too much for them."', min: 0.8, max: 2.6, sfx: 'heart' },
  { card: 'ELEVEN.', sub: '', min: 2.2, max: 4 },
  { scene: 'bay', cam: [13, 6], dark: 'rgba(10,4,4,.55)', zoom: 2.6 },
  { add: [['kael', 12, 6, 1], ['mara', 11, 7, 1], ['ivo', 13, 7, 1], ['tavi', 12, 8, 1], ['celestine', 17, 4, 2], ['wl', 14, 3, 0, 'warden'], ['wr', 16, 3, 0, 'warden'], ['vale', 18, 4, 2]] },
  { fade: 'in', spd: 0.8 }, { wait: 1.4 },
  { narr: 'Ash sifts down from the furnace vents. It lands in your hair. On your hands. You do not brush it off. You will never brush it off.' },
  { kneel: ['kael'] },
  { say: 'celestine', t: 'Balanced.' },
  { move: 'celestine', to: [13, 5], spd: 12, wait: true }, { face: 'celestine', dir: 2 }, { zoom: 3.2 },
  { say: 'celestine', t: 'You. The loud one.' },
  { say: 'celestine', t: 'Grief is a luxury item, little soot. You will be invoiced.' },
  { choice: [
    { t: '(Spit at her feet.)', fx: () => { fury(2); setF('spatAtHer'); }, then: [{ fx: () => { Cutscene.flash = 1; Cutscene.flashC = '#ff2010'; Cutscene.shake = 0.8; Sound.play('hit'); } }, narr('The Warden is faster than thought. You are on the floor again. Your ear is ringing.'), say('celestine', 'Charming. Invoice him for the cleaning as well.')] },
    { t: '(Say nothing. Memorize her face.)', fx: () => setF('memorized'), then: [narr('You memorize her. The exact gold of her eyes. The tiny scar at her hairline, the only flaw on her. The way she smells, like rain you have never felt.'), say('celestine', '...What an unpleasant stare. Do keep it. It suits the décor.')] },
    { t: "I'll see you again.", fx: () => { fury(1); setF('promisedCelestine'); }, then: [say('celestine', 'Everyone does, eventually.'), say('celestine', 'From below.')] }
  ] },
  { move: 'celestine', to: [19, 3], spd: 14 }, { move: 'wl', to: [19, 2], spd: 14 }, { move: 'wr', to: [20, 3], spd: 14 }, { move: 'vale', to: [21, 4], spd: 14 },
  { wait: 1.5 }, { zoom: 2.4 },
  { emote: 'mara', t: '...' },
  { say: 'mara', t: "Kael. Kael, son. Get up. She'd want you up." },
  { kneel: ['kael'], v: 0 },
  { panel: 'kael' },
  { say: 'kael', t: 'She told me to breathe.' },
  { say: 'kael', t: 'So every breath I take now is hers.' },
  { pstage: 1 },
  { say: 'kael', t: 'And every breath THEY take is mine.' },
  { narr: 'Something in you goes quiet, and stays quiet.' },
  { narr: 'Something else wakes up, and does not go back to sleep.' },
  { fade: 'out' },
  { panel: 'tin' }, { fade: 'in', spd: 0.8 }, { wait: 0.8 },
  { narr: 'Two days later, a tin arrives at your door. Authority grey, with a little sun stamped on the lid.' },
  { narr: 'Inside: a cup of ash. Less than you would think. And a brass washer, blackened, still round.' },
  { pstage: 1 }, { sfx: 'page' }, { wait: 0.8 },
  { narr: 'And an invoice. COMMITMENT FUEL — 14 SCRIP, deducted from future wages. GRATITUDE IS BREATH.' },
  { narr: 'They returned the ring. They kept the girl. And they sent you the bill for the fire.' },
  { fade: 'out' }, { panel: null },
  { card: 'SOOTBORN', sub: 'What they call us. What they will remember.', big: 1, sfx: 'splash', min: 2.2, max: 6 },
  { card: 'FORTY-ONE DAYS AFTER THE FURNACE', sub: 'Cinderwell. Tier Six. Kael still fixes valves.', min: 1.4, max: 4 }
];
const PROLOGUE = PROLOGUE_A;

// heist: the Night Proctor walks a lantern loop; reach Bank Seven unseen
const HEIST_PUZZLE = { name: 'BANK 7 · BLEED', tip: 'Bleed the Authority line into the clinic. Feed every pipe, leave no open ends.', cols: 5, rows: 3, cells: [
  ['', 'ES', 'EW', 'SW', ''],
  ['SRC:E:AUTH', 'NW', 'E', 'NSW', ''],
  ['', '', '', 'NE', 'OUT:W:CLINIC']] };
