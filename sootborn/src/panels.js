// ============================================================
// systems/panels — illustrated story panels for cutscenes.
// A cutscene can CUT to one of these full-screen drawings ({panel:'id', stage}) and back,
// so the story is told with close-ups and tableaux, not only with pans and zooms.
// Each panel draws on a 320x180 canvas: fn(g, t, stage, st)  (t = time on panel, st = time in stage)
// ============================================================
const FUTURE_PANELS = new Set(['voss', 'gild', 'lesson', 'assay', 'spire', 'desk', 'ledger', 'ante', 'weather', 'dockstair', 'dawn']);
const Panels = {
  c: null, g: null, sil: {},
  draw(g, p) {
    if (!this.c) [this.c, this.g] = mk(320, 180);
    const pg = this.g; pg.globalAlpha = 1; pg.globalCompositeOperation = 'source-over'; pg.fillStyle = '#07050a'; pg.fillRect(0, 0, 320, 180);
    this.narrow = W < 320; const fn = PANELS[p.id]; if (fn) fn(pg, p.t, p.stage, p.st);
    this.finish(pg, p);
    g.fillStyle = '#07050a'; g.fillRect(0, 0, W, H); g.drawImage(this.c, Math.round((W - 320) / 2), Math.round((H - 180) / 2)); // portrait shows the middle 208px: panels keep their focus there
  },
  // the same last pass on every panel, so memories and things not yet happened each have a look: drifting motes, a closing vignette, a slow sweep of light, grain,
  // and for the years ahead a thin gilt plate line, as if the scene were already engraved somewhere.
  finish(g, p) {
    const fut = FUTURE_PANELS.has(p.id), t = p.t, rm = Settings.d.reduce;
    g.globalCompositeOperation = 'lighter';
    if (!rm) { const sx = ((t * 14) % 520) - 100, gr = g.createLinearGradient(sx, 0, sx + 90, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.5, fut ? 'rgba(255,224,150,.05)' : 'rgba(255,170,110,.035)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(sx, 0, 90, 180); }
    for (let i = 0; i < (rm ? 0 : 16); i++) { const a = hash(i * 7 + 1, 3), b = hash(i * 3 + 2, 9), sp = 2 + a * 5, x = (a * 320 + Math.sin(t * .4 + i) * 6 + t * (fut ? 1.5 : -1)) % 320, y = fut ? 180 - ((b * 180 + t * sp) % 190) : (b * 180 + t * sp) % 190, k = .12 + .1 * Math.sin(t * 1.3 + i * 2);
      g.fillStyle = fut ? `rgba(255,220,140,${k})` : `rgba(210,190,170,${k * .8})`; g.fillRect((x + 320) % 320 | 0, y | 0, 1, 1); }
    g.globalCompositeOperation = 'source-over';
    if (!this.vg) { const [c, vg] = mk(320, 180), gr = vg.createRadialGradient(160, 84, 70, 160, 90, 200); gr.addColorStop(0, 'rgba(5,3,8,0)'); gr.addColorStop(.7, 'rgba(5,3,8,.28)'); gr.addColorStop(1, 'rgba(5,3,8,.72)'); vg.fillStyle = gr; vg.fillRect(0, 0, 320, 180); this.vg = c; }
    g.drawImage(this.vg, 0, 0);
    if (!rm) { g.fillStyle = 'rgba(255,255,255,.035)'; const f = (t * 24) | 0; for (let i = 0; i < 26; i++) g.fillRect((hash(i + f * 13, f) * 320) | 0, (hash(f, i + f * 7) * 180) | 0, 1, 1); }
    if (fut) { const x0 = this.narrow ? 58 : 3, x1 = this.narrow ? 262 : 317; g.fillStyle = 'rgba(232,194,90,.5)'; g.fillRect(x0, 3, x1 - x0, 1); g.fillRect(x0, 3, 1, 9); g.fillRect(x1 - 1, 3, 1, 9); g.fillStyle = 'rgba(232,194,90,.9)'; g.fillRect(x0, 3, 5, 1); g.fillRect(x1 - 5, 3, 5, 1); g.fillRect(x0, 3, 1, 5); g.fillRect(x1 - 1, 3, 1, 5); }
  },
  // a character sprite as a flat dark shape, for figures against a light
  shape(id, dir, col) { const k = id + dir + col; if (!this.sil[k]) { const s = World.sheetFor(id), fh = s.fh || 16, [c, g] = mk(16, fh); g.drawImage(s, 0, dir * fh, 16, fh, 0, 0, 16, fh); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, 16, fh); c.fh = fh; this.sil[k] = c; } return this.sil[k]; }
};
const PX = {
  R(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); },
  glow(g, x, y, r, rgb, a) { g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.globalCompositeOperation = 'source-over'; },
  plate(g, t, cx, y, dim) { const w = ptextW(t) + 6, x = Math.round(cx - w / 2); PX.R(g, x - 1, y - 1, w + 2, 11, '#0c0808'); PX.R(g, x, y, w, 9, dim ? '#5a4a30' : '#c8a050'); PX.R(g, x + 1, y + 1, w - 2, 7, '#1e1512'); ptext(g, t, x + 3, y + 2, dim ? '#8a7a60' : '#f3e3c3'); },
  rock(g, y0, y1) { if (!PX._rock) { const [c, cg] = mk(320, 180); for (let y = 0; y < 180; y += 2) for (let x = 0; x < 320; x += 2) { const r = hash(x, y); cg.fillStyle = r < .33 ? '#1a1114' : r < .66 ? '#20151a' : '#150e11'; cg.fillRect(x, y, 2, 2); } PX._rock = c; } g.drawImage(PX._rock, 0, y0, 320, y1 - y0, 0, y0, 320, y1 - y0); }, // drawn once: 14,000 rects a frame is too many for a phone
  plates(g, c) { PX._pl = PX._pl || {}; if (PX._pl[c]) { g.drawImage(PX._pl[c], 0, 0); return; } const [pc, og] = mk(320, 180), g0 = g; g = og; PX.R(g, 0, 0, 320, 180, c); for (let y = 0; y < 180; y += 30) for (let x = (y / 30 % 2) * 20; x < 320; x += 40) { PX.R(g, x, y, 1, 30, shade(c, .6)); PX.R(g, x + 1, y, 1, 30, shade(c, 1.2)); PX.R(g, x + 4, y + 4, 1, 1, shade(c, 1.6)); PX.R(g, x + 36, y + 25, 1, 1, shade(c, 1.6)); } for (let y = 0; y < 180; y += 30) { PX.R(g, 0, y, 320, 1, shade(c, .6)); PX.R(g, 0, y + 1, 320, 1, shade(c, 1.15)); } PX._pl[c] = pc; g0.drawImage(pc, 0, 0); },
  spr(g, s, dir, x, y, sc) { const fh = s.fh || 16; g.drawImage(s, 0, dir * fh, 16, fh, Math.round(x - 8 * sc), Math.round(y - fh * sc), 16 * sc, fh * sc); },
  fade(g, a) { if (a > 0) { g.fillStyle = `rgba(7,5,10,${Math.min(1, a)})`; g.fillRect(0, 0, 320, 180); } }
};
const PANELS = {
  // ---- the world as Cinderwell is told it: a burning sky, six tiers, one machine, one lift
  world(g, t, st, s) {
    const { R, glow, plate } = PX, k = a => Math.max(0, Math.min(1, a));
    PX.rock(g, 0, 180);
    for (let y = 0; y < 30; y++) R(g, 0, y, 320, 1, `rgb(${70 + y * 3 + Math.sin(t * 2 + y) * 8 | 0},${14 + y | 0},${8})`);
    for (let i = 0; i < 26; i++) { const x = (hash(i, 1) * 320 + t * (6 + i % 5)) % 320, y = 28 - ((t * (5 + i % 4) + hash(i, 2) * 30) % 30); R(g, x, y, 1, 1, i % 3 ? '#ffb040' : '#ffe08a'); }
    glow(g, 160, 0, 150, '255,90,30', .35 + Math.sin(t * 1.7) * .06);
    for (let x = 0; x < 320; x += 3) R(g, x, 30 + (hash(x, 3) * 3 | 0), 3, 9, '#2a1c1e');
    const nx = Panels.narrow; plate(g, 'THE SURFACE  -  BURNS', nx ? 204 : 232, 17);
    if (st >= 1) { const a = k(s / 1.2 + (st > 1 ? 1 : 0));
      // the Deep Array: one machine through every tier
      g.globalAlpha = a; R(g, 150, 42, 20, 104, '#0c1416'); R(g, 152, 42, 16, 104, '#1e3438'); R(g, 152, 42, 2, 104, '#3a6468'); for (let y = 46; y < 144; y += 10) { const p = (Math.sin(t * 3 - y * .12) + 1) / 2; R(g, 150, y, 20, 3, `rgb(${40 + p * 40 | 0},${150 + p * 90 | 0},${150 + p * 80 | 0})`); } g.globalAlpha = 1;
      glow(g, 160, 94, 64, '79,214,208', .18 * a);
      for (let tier = 0; tier < 6; tier++) { const y = 50 + tier * 17, on = k((s - tier * .35) / .5 + (st > 1 ? 1 : 0)); if (on <= 0) continue; g.globalAlpha = on;
        for (const side of [-1, 1]) for (let j = 0; j < 2; j++) { const cx = 160 + side * (52 + j * 62), rx = 24 - j * 3; g.fillStyle = '#0a0608'; g.beginPath(); g.ellipse(cx, y, rx + 2, 7.5, 0, 0, 6.3); g.fill(); g.fillStyle = tier === 2 ? '#4a3428' : '#33262a'; g.beginPath(); g.ellipse(cx, y, rx, 6, 0, 0, 6.3); g.fill(); R(g, cx - rx + 4, y + 2, rx * 2 - 8, 2, '#221a1c'); for (let q = 0; q < 5; q++) R(g, cx - rx + 6 + hash(cx + q, tier) * (rx * 2 - 12), y - 3 + hash(q, cx) * 5, 1, 1, Math.sin(t * 3 + q + cx) > -.6 ? '#ffd890' : '#6a4a30');
          R(g, Math.min(cx, 160) + (side > 0 ? 10 : rx), y, Math.abs(cx - 160) - rx - 10, 1, '#2e6a68'); if (st >= 2) { const d = Math.abs(cx - 160) - rx - 10, o = (t * 26 + j * 9 + tier * 5) % d; R(g, side > 0 ? 170 + o : 150 - o, y - 1, 2, 3, '#9ff2ea'); } }
        ptext(g, nx ? 'T' + (tier + 4) : 'TIER ' + (tier + 4), nx ? 60 : 6, y - (nx ? 9 : 2), tier === 2 ? '#ffb35a' : '#8a7a70'); g.globalAlpha = 1; }
      if (a >= 1) plate(g, 'THE DEEP ARRAY', 160, 34);
    }
    if (st >= 2) { plate(g, nx ? 'TIER 6 - HOME' : 'TIER 6 - ASHGATE - HOME', nx ? 222 : 250, 74); for (let tier = 0; tier < 6; tier++) { const y = 50 + tier * 17, f = .35 + hash(tier, 9) * .3; const bx = nx ? 240 : 292; R(g, bx, y - 4, 22, 5, '#0c0808'); R(g, bx + 1, y - 3, 20, 3, '#3a2a24'); R(g, bx + 1, y - 3, 20 * f, 3, f < .45 ? '#c8452e' : '#e8b23a'); } ptext(g, 'RATION', nx ? 239 : 291, 40, '#8a7a60'); }
    if (st >= 3) { R(g, 108, 28, 5, 58, '#0a0608'); R(g, 109, 28, 3, 58, '#e8e4dc'); const y = 30 + (Math.sin(s * .9 - 1.2) * .5 + .5) * 50; R(g, 107, y, 7, 5, '#ffffff'); glow(g, 110, y + 2, 26, '255,246,214', .7);
      R(g, 96, 12, 28, 18, '#e8e4dc'); R(g, 100, 6, 20, 6, '#f4f2ec'); R(g, 107, 1, 6, 5, '#f4f2ec'); R(g, 96, 28, 28, 2, '#e8c25a'); glow(g, 110, 14, 40, '255,246,214', .35); plate(g, 'LIFT 0', nx ? 88 : 84, 40); }
  },
  // ---- the washer: three weeks of lunch breaks
  hands(g, t, st, s) {
    const { R, glow } = PX;
    for (let y = 0; y < 180; y++) R(g, 0, y, 320, 1, `rgb(${18 + y / 9 | 0},${12 + y / 14 | 0},${30 - y / 12 | 0})`);
    for (let i = 0; i < 16; i++) { const x = (hash(i, 4) * 360 + t * (2 + i % 3)) % 360 - 20, y = 14 + hash(i, 5) * 110 + Math.sin(t * .6 + i) * 3, r = 7 + hash(i, 6) * 10; glow(g, x, y, r * 2.2, i % 3 ? '255,170,70' : '255,220,130', .22); g.fillStyle = `rgba(255,${190 + i * 3},110,.16)`; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill(); }
    // his palm, soot in the creases
    const sk = '#c48a64', sd = '#9a6a4a', sl = '#dca27c', px = 96, py = 58 + Math.sin(t * 1.3) * 1.5;
    R(g, px - 80, py + 22, 120, 110, sd); R(g, px - 80, py + 20, 118, 4, sk); R(g, px, py, 92, 62, sk); R(g, px, py, 92, 3, sl); R(g, px + 88, py + 3, 4, 59, sd);
    for (let f = 0; f < 4; f++) { R(g, px + 92, py + 2 + f * 15, 46 - (f === 3 ? 12 : f === 0 ? 6 : 0), 13, sk); R(g, px + 92, py + 2 + f * 15, 46 - (f === 3 ? 12 : f === 0 ? 6 : 0), 2, sl); R(g, px + 92, py + 13 + f * 15, 46 - (f === 3 ? 12 : f === 0 ? 6 : 0), 2, sd); R(g, px + 112, py + 4 + f * 15, 1, 9, sd); }
    R(g, px + 14, py - 16, 40, 18, sk); R(g, px + 14, py - 16, 40, 3, sl); R(g, px + 20, py + 18, 30, 1, sd); R(g, px + 30, py + 34, 36, 1, sd); R(g, px + 12, py + 44, 2, 2, '#4a3028'); R(g, px + 60, py + 50, 3, 1, '#4a3028');
    // her fingers, reaching in
    if (st >= 1) { const hx = 320 - Math.min(1, s / .8) * 96, hk = '#9a6448', hd = '#74483a'; R(g, hx, py + 6, 110, 40, hk); R(g, hx, py + 6, 110, 3, '#b47a5c'); for (let f = 0; f < 3; f++) { R(g, hx - 34, py + 8 + f * 12, 36, 10, hk); R(g, hx - 34, py + 8 + f * 12, 36, 2, '#b47a5c'); R(g, hx - 34, py + 16 + f * 12, 36, 2, hd); } }
    // the ring
    const rx = st >= 1 ? 320 - Math.min(1, s / .8) * 96 - 14 : px + 46, ry = st >= 1 ? py + 22 : py + 26;
    glow(g, rx, ry, 34, '255,214,120', .5 + Math.sin(t * 4) * .1);
    g.strokeStyle = '#3a2408'; g.lineWidth = 9; g.beginPath(); g.ellipse(rx, ry, 11, st >= 1 ? 11 : 8, 0, 0, 6.3); g.stroke(); g.strokeStyle = '#d8a040'; g.lineWidth = 6; g.stroke(); g.strokeStyle = '#ffe9a8'; g.lineWidth = 2; g.beginPath(); g.ellipse(rx, ry - 1, 12, st >= 1 ? 12 : 9, 0, 3.5, 5.6); g.stroke();
    const tw = (Math.sin(t * 5) + 1) / 2; R(g, rx - 9, ry - 12, 1, 5 * tw, '#fff'); R(g, rx - 11, ry - 10, 5 * tw, 1, '#fff');
  },
  // ---- the fever ward: forty children on ration air (stage 1: the fans come up)
  ward(g, t, st, s) {
    const { R, glow } = PX, on = st >= 1 ? Math.min(1, s / 1.5) : 0;
    for (let y = 0; y < 180; y++) R(g, 0, y, 320, 1, `rgb(${14 + on * 22 | 0},${22 + y / 12 + on * 18 | 0},${26 + y / 10 + on * 10 | 0})`);
    R(g, 0, 118, 320, 62, '#182020'); R(g, 0, 118, 320, 2, '#34423e'); for (let x = 0; x < 320; x += 20) R(g, x, 120, 1, 60, '#101616');
    for (let x = 10; x < 320; x += 44) { R(g, x, 34, 2, 84, '#101818'); }
    // the fan
    R(g, 138, 18, 44, 44, '#0c1212'); R(g, 140, 20, 40, 40, '#27332f'); const a = st >= 1 ? s * (1 + on * 13) : 0.4;
    g.save(); g.translate(160, 40); g.rotate(a); for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 2); R(g, -3, -17, 6, 15, '#8a9a94'); R(g, -3, -17, 2, 15, '#b8c8c0'); } g.restore(); R(g, 157, 37, 6, 6, '#3a4440');
    if (st >= 1) { glow(g, 160, 40, 90, '200,236,255', .25 * on); for (let i = 0; i < 14; i++) { const y = 62 + ((s * 60 + i * 23) % 60), x = 130 + hash(i, 3) * 60 + Math.sin(s * 3 + i) * 6; R(g, x, y, 1, 4, 'rgba(210,240,255,.5)'); } }
    // cots in a row, small chests rising
    for (let i = 0; i < 6; i++) { const x = 8 + i * 53, y = 104, b = Math.sin(t * (st >= 1 ? 1.5 : 2.6) + i * 1.3) * (st >= 1 ? 2.2 : 0.9);
      R(g, x, y + 8, 46, 4, '#3a4246'); R(g, x + 2, y + 12, 3, 10, '#2a3034'); R(g, x + 41, y + 12, 3, 10, '#2a3034'); R(g, x + 2, y, 42, 9, '#c8ccc4'); R(g, x + 2, y, 12, 6, '#eef2ea');
      R(g, x + 5, y - 5, 7, 6, ['#c08a6a', '#5e3a2a', '#e0b090', '#9a6448', '#c48a64', '#7a4e36'][i]); R(g, x + 5, y - 6, 7, 2, ['#6a3a1a', '#1a1014', '#c8a040', '#1e1416', '#6a2e18', '#1a1014'][i]);
      R(g, x + 13, y - 2 - b, 30, 8 + b, '#4e7284'); R(g, x + 13, y - 2 - b, 30, 2, '#7aa2b6');
      if (st < 1 && Math.sin(t * 2.6 + i * 1.3) > .8) R(g, x + 3, y - 9, 2, 1, 'rgba(220,230,230,.5)'); }
    if (st < 1) { PX.plate(g, 'RATION PRESSURE', 60, 24, true); R(g, 22, 40, 76, 8, '#0c0808'); R(g, 23, 41, 74, 6, '#3a2a24'); R(g, 23, 41, 16 + Math.sin(t * 3) * 2, 6, '#c8452e'); }
    else { PX.plate(g, 'BREATHING ON THEIR OWN', 80, 24); R(g, 22, 40, 76, 8, '#0c0808'); R(g, 23, 41, 74, 6, '#3a2a24'); R(g, 23, 41, 16 + 54 * on, 6, '#7cf27c'); }
  },
  // ---- the crime, drawn plainly: one fat sealed line, one starving one, and a bleed between them
  pipe(g, t, st, s) {
    const { R, glow, plate } = PX; PX.plates(g, '#3a3038');
    const big = (y, h, c) => { R(g, 0, y - 2, 320, h + 4, '#120a0c'); R(g, 0, y, 320, h, c); R(g, 0, y, 320, 3, shade(c, 1.4)); R(g, 0, y + 3, 320, 3, shade(c, 1.18)); R(g, 0, y + h - 5, 320, 5, shade(c, .6)); for (let x = 28; x < 320; x += 96) { R(g, x, y - 5, 10, h + 10, shade(c, .7)); R(g, x, y - 5, 3, h + 10, shade(c, 1.1)); for (let q = 0; q < 3; q++) R(g, x + 4, y - 2 + q * (h / 2), 2, 2, '#e8c890'); } };
    big(38, 40, '#9a6238'); big(126, 14, '#4a6464');
    for (let i = 0; i < 12; i++) R(g, (t * 90 + i * 30) % 340 - 10, 50 + (i % 3) * 6, 8, 2, 'rgba(255,230,190,.35)');
    for (let i = 0; i < 3; i++) R(g, (t * (st >= 1 ? 50 : 8) + i * 110) % 340 - 10, 132, 5, 2, st >= 1 ? 'rgba(160,250,240,.8)' : 'rgba(160,220,220,.25)');
    // the seal
    R(g, 150, 34, 5, 48, '#e8c25a'); R(g, 150, 34, 2, 48, '#fff0b0'); g.fillStyle = '#7a1e14'; g.beginPath(); g.arc(152, 58, 13, 0, 6.3); g.fill(); g.fillStyle = '#c8452e'; g.beginPath(); g.arc(152, 57, 11, 0, 6.3); g.fill(); R(g, 148, 53, 8, 8, '#e8c25a'); R(g, 150, 50, 4, 14, '#e8c25a'); R(g, 145, 55, 14, 4, '#e8c25a'); R(g, 150, 55, 4, 4, '#7a1e14');
    plate(g, 'ARRAY AUTHORITY  -  SEALED LINE', 160, 18); plate(g, 'CLINIC BRANCH  -  TIER 6', 160, 108);
    const gauge = (cx, cy, v, lab) => { g.fillStyle = '#120a0c'; g.beginPath(); g.arc(cx, cy, 19, 0, 6.3); g.fill(); g.fillStyle = '#c8a050'; g.beginPath(); g.arc(cx, cy, 17, 0, 6.3); g.fill(); g.fillStyle = '#f0e8d0'; g.beginPath(); g.arc(cx, cy, 14, 0, 6.3); g.fill(); for (let i = 0; i <= 6; i++) { const a = Math.PI * (1 + i / 6); R(g, cx + Math.cos(a) * 11 - 1, cy + Math.sin(a) * 11 - 1, 2, 2, i < 2 ? '#c8452e' : '#3a2a20'); }
      const a = Math.PI * (1 + v) + Math.sin(t * 11) * .03; g.strokeStyle = '#c8452e'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 12, cy + Math.sin(a) * 12); g.stroke(); R(g, cx - 2, cy - 2, 4, 4, '#2a1a14'); ptext(g, lab, cx - ptextW(lab) / 2, cy + 5, '#3a2a20'); };
    const gx = Panels.narrow ? 232 : 262; gauge(gx, 58, st >= 1 ? .96 - Math.min(.11, s * .06) : .96, st >= 1 ? '-11' : 'FULL'); gauge(gx, 132, st >= 1 ? .08 + Math.min(.62, s * .3) : .08 + Math.sin(t * 5) * .02, st >= 1 ? 'AIR' : 'LOW');
    if (st >= 1) { const h = Math.min(52, s * 60); R(g, 62, 74, 12, h + 2, '#120a0c'); R(g, 64, 74, 8, h, '#2a8a86'); R(g, 64, 74, 2, h, '#9ff2ea'); for (let i = 0; i < 4; i++) { const y = 76 + ((s * 50 + i * 14) % 50); if (y < 74 + h) R(g, 67, y, 2, 4, '#e8fffd'); } R(g, 56, 70, 24, 7, '#3a3a44'); R(g, 56, 70, 24, 2, '#6a6a78'); if (h >= 52) { glow(g, 68, 132, 30, '79,214,208', .5); plate(g, 'A SLIVER. BALANCED BY DAWN.', Panels.narrow ? 160 : 230, 100); } }
    else { R(g, 56, 70, 24, 7, '#3a3a44'); R(g, 56, 70, 24, 2, '#6a6a78'); R(g, 64, 78, 8, 10, '#2a2a32'); }
  },
  // ---- Lift Zero opens: light, and three shapes in it, and a tier on its knees
  lift(g, t, st, s) {
    const { R, glow } = PX, op = Math.min(1, t / 2.2), w = 6 + op * 54;
    PX.plates(g, '#241c22');
    R(g, 84, 0, 152, 150, '#e4e2dc'); R(g, 84, 0, 4, 150, '#ffffff'); R(g, 232, 0, 4, 150, '#aaa8a4'); R(g, 84, 148, 152, 3, '#e8c25a'); R(g, 92, 0, 136, 148, '#101014');
    R(g, 160 - w, 0, w * 2, 148, '#fff6dc'); glow(g, 160, 70, 90 * op + 20, '255,244,206', .3);
    g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const a = Math.PI / 2 + (i - 4) * .2 + Math.sin(t * .4 + i) * .02; g.fillStyle = `rgba(255,236,180,${.045 * op})`; g.beginPath(); g.moveTo(160, 40); g.lineTo(160 + Math.cos(a - .05) * 300, 40 + Math.sin(a - .05) * 300); g.lineTo(160 + Math.cos(a + .05) * 300, 40 + Math.sin(a + .05) * 300); g.fill(); } g.globalCompositeOperation = 'source-over';
    // door leaves sliding apart, gold trim
    R(g, 92, 0, 68 - w, 148, '#b8bcc8'); R(g, 160 + w, 0, 68 - w, 148, '#b8bcc8'); for (let x = 96; x < 160 - w; x += 8) R(g, x, 0, 2, 148, '#7a7e8a'); for (let x = 224; x > 160 + w; x -= 8) R(g, x, 0, 2, 148, '#7a7e8a'); R(g, 160 - w - 3, 0, 3, 148, '#e8c25a'); R(g, 160 + w, 0, 3, 148, '#e8c25a');
    // three figures, taller than anyone you know
    if (st >= 4) { R(g, 0, 0, 320, 180, '#f2f0ea'); for (let x = 20; x < 320; x += 56) { R(g, x, 0, 1, 150, '#dcd8ce'); R(g, x + 1, 0, 1, 150, '#ffffff'); } R(g, 0, 0, 320, 5, '#e8c25a'); R(g, 0, 150, 320, 30, '#d6d2c8'); R(g, 0, 150, 320, 2, '#e8c25a'); R(g, 96, 112, 128, 8, '#ffffff'); R(g, 96, 120, 128, 4, '#dcd8ce'); R(g, 100, 124, 6, 26, '#dcd8ce'); R(g, 214, 124, 6, 26, '#dcd8ce'); PX.spr(g, World.sheetFor('kael'), 0, 160, 136, 3); const y = (t * 60) % 190; R(g, 6, y - 10, 3, 10, '#e8c25a'); R(g, 311, y - 10, 3, 10, '#e8c25a'); R(g, 6, (y + 95) % 190 - 10, 3, 10, '#e8c25a'); R(g, 311, (y + 95) % 190 - 10, 3, 10, '#e8c25a'); glow(g, 160, 20, 120, '255,250,230', .25); const fl = Math.floor(t / 1.1) % 10; PX.plate(g, 'LEVEL ' + Math.min(9, fl), 160, 14); return; }
    if (op > .35 && st < 3) { const a = Math.min(1, (op - .35) * 2.2), sc = 3; g.globalAlpha = a; const cs = World.sheetFor('celestine'), ws = World.sheetFor('warden'); PX.spr(g, ws, 0, 122, 150, sc); PX.spr(g, ws, 0, 198, 150, sc); PX.spr(g, cs, 0, 160, 150, sc + 1); g.globalAlpha = 1; }
    for (let i = 0; i < 30; i++) { const x = 100 + hash(i, 7) * 120, y = 148 - ((t * (8 + i % 7) + hash(i, 8) * 150) % 150); R(g, x, y, 1, 1, 'rgba(255,246,214,.9)'); }
    // the tier, kneeling, backs to us
    R(g, 0, 150, 320, 30, '#0a0608'); for (let i = 0; i < 17; i++) { const x = 4 + i * 19 + (i % 2) * 4, y = 150 + (i % 3) * 3; g.fillStyle = '#0a0608'; g.beginPath(); g.arc(x + 8, y, 7, 0, 6.3); g.fill(); R(g, x - 2, y + 2, 20, 30, '#0a0608'); R(g, x + 4, y - 6, 8, 1, 'rgba(255,236,180,.35)'); }
  },
  // ---- the heart-furnace (0: she stands before it · 1: she walks · 2: the doors close)
  furnace(g, t, st, s) {
    const { R, glow } = PX; PX.plates(g, '#3a1c18');
    const close = st >= 2 ? Math.min(1, s / 1.3) : 0, mx = 160, mw = 76 * (1 - close);
    // the mouth
    R(g, 70, 8, 180, 150, '#120808'); R(g, 76, 14, 168, 144, '#2a1410'); for (let i = 0; i < 9; i++) { R(g, 78 + i * 19, 10, 2, 2, '#b08a64'); }
    R(g, 84, 22, 152, 136, '#0c0404');
    if (mw > 0.5) { g.save(); g.beginPath(); g.rect(mx - mw, 22, mw * 2, 136); g.clip();
      for (let y = 22; y < 158; y++) R(g, 84, y, 152, 1, `rgb(255,${60 + (y - 22) * 1.3 | 0},${10 + (y - 22) * .5 | 0})`);
      for (let x = 84; x < 236; x += 4) { const h = 40 + Math.sin(t * 7 + x * .4) * 18 + Math.sin(t * 13 + x) * 10 + hash(x, (t * 9) | 0) * 14; R(g, x, 158 - h, 4, h, '#ffb030'); R(g, x, 158 - h * .62, 4, h * .62, '#ffe070'); R(g, x + 1, 158 - h * .3, 2, h * .3, '#fff8d8'); }
      g.restore(); glow(g, 160, 100, 170 * (1 - close * .8), '255,110,30', .55 * (1 - close)); }
    // Seren, small against it
    const walk = st >= 1 ? Math.min(1, (st >= 2 ? 1 : s / 2.6)) : 0, sy = 140 - walk * 14, sc = 4 - walk * 1.4;
    if (close < .9) { const ss = Panels.shape('seren', 1, '#140806'); PX.spr(g, ss, 0, 160, sy, sc); if (st === 0) { const hx = 160 + 7 * sc, hy = sy - 13 * sc; R(g, hx - 2, hy, 4, 3 * sc, '#140806'); const tw = (Math.sin(t * 6) + 1) / 2; R(g, hx - 1, hy - 3, 3, 3, '#ffe9a8'); R(g, hx, hy - 3 - 5 * tw, 1, 5 * tw + 8, '#fff'); R(g, hx - 4 * tw, hy - 2, 8 * tw + 1, 1, '#fff'); glow(g, hx, hy - 2, 14, '255,236,170', .7); } }
    const ws = Panels.shape('warden', 1, '#1a0e0c'); PX.spr(g, ws, 0, 104, 146, 4); PX.spr(g, ws, 0, 216, 146, 4); R(g, 0, 140, 320, 40, '#0c0606'); R(g, 0, 140, 320, 1, '#3a1c18');
    // doors
    if (st >= 2) { const dw = 76 * close; R(g, 84, 22, dw, 136, '#3a2a2e'); R(g, 236 - dw, 22, dw, 136, '#3a2a2e'); R(g, 84 + dw - 4, 22, 4, 136, '#6a5a62'); R(g, 236 - dw, 22, 4, 136, '#1a1014'); for (let y = 30; y < 158; y += 22) { R(g, 84, y, dw, 2, '#22181c'); R(g, 236 - dw, y, dw, 2, '#22181c'); }
      if (close >= 1) { const a = Math.max(0, 1 - (s - 1.3) / 1.6); R(g, 159, 22, 2, 136, `rgba(255,170,60,${a})`); glow(g, 160, 90, 40, '255,120,40', .4 * a); PX.fade(g, (s - 1.6) / 2.2); } }
    for (let i = 0; i < 24; i++) { const x = 60 + hash(i, 2) * 200 + Math.sin(t + i) * 6, y = 170 - ((t * (10 + i % 9) + hash(i, 3) * 170) % 170); R(g, x, y, 1, 1, close >= 1 ? '#5a4a48' : '#ffb060'); }
  },
  // ---- Kael, after. Ash in his hair.
  kael(g, t, st, s) {
    const { R, glow } = PX; R(g, 0, 0, 320, 180, '#0c0708');
    glow(g, 40, 120, 200, '255,90,30', .22 + Math.sin(t * 6) * .03 + Math.sin(t * 17) * .015);
    const b = makeBustCached('kael'); g.drawImage(b, 0, 0, 32, 32, 80, 12, 160, 160);
    g.globalCompositeOperation = 'multiply'; const gr = g.createLinearGradient(80, 0, 240, 0); gr.addColorStop(0, '#ffb070'); gr.addColorStop(.55, '#8a5a5a'); gr.addColorStop(1, '#2a2030'); g.fillStyle = gr; g.fillRect(80, 12, 160, 160); g.globalCompositeOperation = 'source-over';
    R(g, 0, 0, 80, 180, '#0c0708'); R(g, 240, 0, 80, 180, '#0c0708'); glow(g, 60, 130, 120, '255,90,30', .18);
    for (let i = 0; i < 40; i++) { const x = hash(i, 1) * 320 + Math.sin(t * .7 + i) * 8, y = (t * (9 + i % 6) + hash(i, 2) * 180) % 180; R(g, x, y, i % 4 ? 1 : 2, 1, i % 3 ? '#8a8080' : '#c8c0c0'); }
    for (const [x, y] of [[118, 34], [150, 28], [176, 36], [200, 44], [132, 42]]) R(g, x, y, 3, 2, '#c8c0c0');
    if (st >= 1) { const a = Math.min(1, s / 1.2); R(g, 132, 82, 20, 5, `rgba(255,120,40,${.5 * a})`); R(g, 172, 82, 20, 5, `rgba(255,120,40,${.5 * a})`); glow(g, 142, 84, 14, '255,140,50', .5 * a); glow(g, 182, 84, 14, '255,140,50', .5 * a); }
  },
  // ---- Row K: Mara's room and the shelf (0: one tin · 1: two · 2: he comes home · 3: with Tavi)
  row(g, t, st, s) {
    const ivoHere = st === 4; if (ivoHere) st = 0; const { R, glow, plate } = PX; R(g, 0, 0, 320, 180, '#1a1214'); for (let y = 0; y < 130; y += 9) for (let x = (y / 9 % 2) * 12; x < 320; x += 24) R(g, x, y, 23, 8, (x * 3 + y) % 5 ? '#241a1c' : '#2a1e20'); R(g, 0, 130, 320, 50, '#2e2220'); for (let x = 0; x < 320; x += 26) R(g, x, 130, 1, 50, '#221816'); R(g, 0, 130, 320, 1, '#4a3830');
    const fl = .8 + Math.sin(t * 9) * .05 + Math.sin(t * 3.7) * .05; R(g, 44, 36, 3, 20, '#3a3028'); R(g, 38, 56, 15, 10, '#5a4a30'); R(g, 41, 58, 9, 6, `rgba(255,190,90,${fl})`); glow(g, 45, 60, 80 * fl, '255,170,80', .22); glow(g, 45, 60, 20, '255,210,120', .6 * fl);
    R(g, 190, 62, 96, 4, '#5a4030'); R(g, 190, 66, 96, 2, '#3a2a1c'); R(g, 196, 68, 3, 10, '#3a2a1c'); R(g, 278, 68, 3, 10, '#3a2a1c');
    const tin = (x, a) => { g.globalAlpha = a; R(g, x, 48, 20, 14, '#8a8e96'); R(g, x, 48, 20, 2, '#b0b4bc'); R(g, x + 7, 52, 6, 6, '#6a6e76'); R(g, x + 9, 54, 2, 2, '#e8c25a'); R(g, x, 61, 20, 1, '#5a5e66'); g.globalAlpha = 1; };
    tin(204, 1); if (st >= 1) tin(238, st === 1 ? Math.min(1, s / 1.4) : 1); R(g, 268, 52, 8, 10, '#3a5a3a'); R(g, 270, 46, 1, 6, '#5a8a4a'); R(g, 273, 48, 1, 4, '#5a8a4a');
    R(g, 96, 112, 90, 6, '#5a4030'); R(g, 96, 118, 90, 3, '#3a2a1c'); R(g, 102, 121, 5, 30, '#3a2a1c'); R(g, 175, 121, 5, 30, '#3a2a1c'); R(g, 130, 106, 10, 6, '#c8c0b0'); R(g, 150, 108, 8, 4, '#8a6a4a');
    R(g, 10, 96, 60, 34, '#3a2e30'); R(g, 10, 96, 60, 5, '#5a4a4c'); R(g, 12, 102, 22, 8, '#c8c0b0');
    if (ivoHere) PX.spr(g, World.sheetFor('ivo'), 2, 250, 150, 3);
    PX.spr(g, World.sheetFor('mara'), 3, 86, 150, 3); if (st >= 3 || st === 0) PX.spr(g, World.sheetFor('tavi'), 2, 214, 152, 2.6);
    if (st === 2 || st === 3) PX.spr(g, World.sheetFor('kael2'), 2, 176, 152, 2.6); else if (st < 2 && st >= 0 && s >= 0) { if (st === 0) PX.spr(g, World.sheetFor('kael'), 2, 176, 150, 3); }
    if (st === 0) plate(g, 'ROW K', 160, 168);
  },
  // ---- Freight Three: where things arrive that are on no manifest (0: Sable · 1: the cold crate open)
  freight(g, t, st, s) {
    const { R, glow, plate } = PX; R(g, 0, 0, 320, 180, '#0c0e12'); PX.plates(g, '#1c2028'); R(g, 0, 132, 320, 48, '#14181e'); R(g, 0, 132, 320, 1, '#2e3640');
    R(g, 90, 20, 140, 112, '#2a3038'); for (let y = 24; y < 130; y += 8) { R(g, 94, y, 132, 6, '#3a424c'); R(g, 94, y, 132, 1, '#4e5864'); } R(g, 86, 16, 148, 5, '#e8b23a'); for (let x = 90; x < 230; x += 16) R(g, x, 16, 8, 5, '#1a1c20'); plate(g, 'FREIGHT 3', 160, 10);
    for (const [x, y, w, h, c] of [[22, 100, 34, 32, '#5a4a30'], [44, 76, 30, 26, '#4a3e2a'], [250, 104, 40, 28, '#5a4a30'], [262, 82, 30, 24, '#4a3e2a']]) { R(g, x, y, w, h, c); R(g, x, y, w, 2, '#7a6644'); R(g, x + 3, y + h / 2 - 1, w - 6, 2, '#3a3020'); }
    R(g, 140, 136, 44, 22, '#0a0c10'); for (let x = 142; x < 184; x += 6) R(g, x, 136, 2, 22, '#2e3640'); glow(g, 162, 150, 30, '255,170,80', .25 + Math.sin(t * 3) * .05);
    R(g, 196, 108, 36, 24, '#8aa4b4'); R(g, 196, 108, 36, 3, '#b8d0dc'); R(g, 200, 114, 28, 1, '#5a7484'); for (let i = 0; i < 8; i++) { const ph = (t * .3 + i * .125) % 1; R(g, 198 + hash(i, 5) * 32 + Math.sin(t + i) * 2, 106 - ph * 26, 2, 1, `rgba(200,230,255,${.5 * (1 - ph)})`); }
    if (st >= 1) { const a = Math.min(1, s / 1.2); R(g, 196, 104, 36, 5, '#5a7484'); for (let i = 0; i < 7; i++) { R(g, 199 + i * 4.5, 100 - (i % 3) * 2 - a * 3, 3, 6 + a * 2, i % 2 ? '#4a9a4e' : '#6ab85a'); } glow(g, 214, 100, 22 * a, '120,220,120', .4 * a); }
    PX.spr(g, World.sheetFor('sable'), 2, 250, 150, 3); PX.spr(g, World.sheetFor('kael'), 3, 96, 150, 3);
  },
  // ---- the dock stair (0: Brand holds it · 1: the barges go · 2: what was left)
  dockstair(g, t, st, s) {
    const { R, glow, plate } = PX; const gr = g.createLinearGradient(0, 0, 0, 180); gr.addColorStop(0, '#060a1c'); gr.addColorStop(1, '#1c2444'); g.fillStyle = gr; g.fillRect(0, 0, 320, 180); for (let i = 0; i < 50; i++) R(g, hash(i, 1) * 320, hash(i, 2) * 90, 1, 1, `rgba(255,255,255,${.3 + hash(i, 3) * .5})`);
    for (let i = 0; i < 6; i++) { const x = ((i * 70 + t * (2 + i % 3)) % 420) - 50; R(g, x, 150 + (i % 3) * 8, 80, 10, 'rgba(180,196,230,.25)'); }
    if (st >= 1) for (let i = 0; i < 7; i++) { const a = Math.min(1, s / 3), x = 30 + i * 22 - a * (20 + i * 8), y = 30 + (i % 3) * 14 + a * (i * 3); R(g, x, y, 26, 6, '#1a1e2a'); R(g, x + 4, y - 3, 14, 3, '#2a2e3a'); R(g, x + 24, y + 2, 2, 2, '#ffb040'); glow(g, x + 25, y + 3, 5, '255,170,80', .6); }
    for (let k = 0; k < 10; k++) { R(g, 150 + k * 16, 150 - k * 12, 170 - k * 16, 12, k % 2 ? '#3a4054' : '#30364a'); R(g, 150 + k * 16, 150 - k * 12, 170 - k * 16, 1, '#5a6480'); } R(g, 0, 162, 320, 18, '#22283a');
    for (let i = 0; i < 5; i++) { const x = 256 + i * 13, y = 40 - i * 3 + Math.round(Math.sin(t * 3 + i)); R(g, x, y, 7, 18, '#e8e4dc'); R(g, x + 1, y - 5, 5, 5, '#d8dce4'); R(g, x + 8, y - 12, 1, 30, '#c8ccd4'); glow(g, x + 3, y + 4, 8, '255,240,200', .3); }
    if (st < 2) { const b = Math.round(Math.sin(t * 2.4)); R(g, 196, 86 + b, 10, 20, '#4a4e58'); R(g, 197, 78 + b, 8, 8, '#b88a6a'); R(g, 197, 77 + b, 8, 3, '#8a8a8a'); R(g, 196, 106, 4, 10, '#2a2c34'); R(g, 202, 106, 4, 10, '#2a2c34'); R(g, 208, 64 + b, 2, 52, '#8a8478'); R(g, 205, 60 + b, 8, 6, '#c8ccd4'); for (let i = 0; i < 3; i++) R(g, 214 + i * 12, 92 - i * 9, 9, 4, '#8a8e96'); }
    else { R(g, 208, 70, 2, 46, '#8a8478'); R(g, 205, 66, 8, 6, '#c8ccd4'); glow(g, 209, 70, 18, '255,240,200', .25 + Math.sin(t * 2) * .05); }
    if (st === 0) plate(g, 'THE DOCK STAIR', 70, 20); if (st === 2) plate(g, 'ELEVEN MINUTES', 209, 130);
  },
  // ---- two years in the weather (0: the hidden fleet · 1: they learn to fly)
  weather(g, t, st, s) {
    const { R, glow, plate } = PX; const gr = g.createLinearGradient(0, 0, 0, 180); gr.addColorStop(0, '#2a3a7a'); gr.addColorStop(.6, '#c8a0b0'); gr.addColorStop(1, '#f0d0b0'); g.fillStyle = gr; g.fillRect(0, 0, 320, 180); glow(g, 250, 120, 80, '255,220,170', .5);
    for (let i = 0; i < 40; i++) { const a2 = hash(i, 11), b2 = hash(i, 23); R(g, a2 * 320, b2 * 60, 1, 1, `rgba(255,255,255,${.15 + .35 * Math.abs(Math.sin(t * .8 + i))})`); }
    g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const an = -2.9 + i * .34 + Math.sin(t * .2) * .03; g.fillStyle = 'rgba(255,214,150,.045)'; g.beginPath(); g.moveTo(250, 122); g.lineTo(250 + Math.cos(an) * 260, 122 + Math.sin(an) * 260); g.lineTo(250 + Math.cos(an + .12) * 260, 122 + Math.sin(an + .12) * 260); g.fill(); } g.globalCompositeOperation = 'source-over';
    R(g, 240, 112, 20, 20, '#fff0c8'); R(g, 243, 109, 14, 26, '#fff0c8'); R(g, 237, 115, 26, 14, '#fff0c8'); R(g, 244, 116, 12, 12, '#fffbe8');
    for (let i = 0; i < 26; i++) { const x = ((i * 23 + t * 1.2) % 360) - 20, y = 78 + (i % 5) * 4 + Math.sin(t * .5 + i) * 1; R(g, x, y, 6, 2, '#3a3a52'); R(g, x + 1, y - 1, 3, 1, '#4a4a62'); if (i % 3 === 0) R(g, x + 5, y, 1, 1, '#ffc060'); if (i % 2) R(g, x + 6, y + 1, 17, 1, 'rgba(40,40,60,.35)'); }
    for (let i = 0; i < 7; i++) { const x = ((t * 9 + i * 13) % 380) - 30, y = 40 + i * 3 + Math.sin(t * 2 + i) * 3, w = Math.sin(t * 9 + i) > 0 ? 1 : 0; R(g, x, y - w, 2, 1, '#1a1a2a'); R(g, x + 2, y, 1, 1, '#1a1a2a'); R(g, x + 3, y - w, 2, 1, '#1a1a2a'); }
    for (let L = 0; L < 4; L++) for (let i = 0; i < 7; i++) { const x = ((i * 64 + t * (2 + L * 2) + L * 30) % 440) - 60, y = 60 + L * 30 + (i % 2) * 8, a = .35 + L * .16; R(g, x, y, 70, 12, `rgba(255,${240 - L * 10},${236 - L * 16},${a})`); R(g, x + 12, y - 6, 40, 8, `rgba(255,255,255,${a})`); if (L === 1 || L === 2) { const bx = x + 18 + (i * 7) % 20; if (i % 2) { R(g, bx, y - 2, 24, 5, '#2a2c3a'); R(g, bx + 4, y - 5, 12, 3, '#3a3c4a'); R(g, bx + 22, y, 1, 1, '#ffb040'); } } }
    if (st >= 1) { R(g, 0, 148, 320, 32, '#2a2c3a'); R(g, 0, 148, 320, 2, '#5a5c6c'); for (let x = 0; x < 320; x += 20) R(g, x, 142, 2, 8, '#3a3c4a'); R(g, 0, 142, 320, 1, '#4a4c5c'); const ids = ['hollis', 'ivo', 'nell', 'kit', 'juno', 'dace']; for (let i = 0; i < 6; i++) PX.spr(g, World.sheetFor(ids[i]), 1, 40 + i * 44 + (i % 2) * 6, 166, 2); PX.spr(g, World.sheetFor('ilse'), 0, 290, 168, 2.4); if (st >= 2) { g.fillStyle = 'rgba(20,16,30,.45)'; g.fillRect(0, 0, 320, 180); PX.spr(g, World.sheetFor('kael2'), 3, 132, 172, 3.4); PX.spr(g, World.sheetFor('tavi'), 2, 190, 172, 3.2); glow(g, 250, 60, 70, '255,236,170', .5); R(g, 244, 54, 12, 12, '#fff6c0'); } }
    if (st === 0) plate(g, 'FOUR HUNDRED BARGES, IN THE WEATHER', 160, 168);
  },
  // ---- the Proctor on the ground (0: kneeling in the rain · 1: struck down · 2: the boots · 3: the cloak)
  voss(g, t, st, s) {
    const { R, glow, plate } = PX; const gr = g.createLinearGradient(0, 0, 0, 180); gr.addColorStop(0, '#0a0c1c'); gr.addColorStop(.6, '#1a2238'); gr.addColorStop(1, '#141c20'); g.fillStyle = gr; g.fillRect(0, 0, 320, 180);
    const bolt = (Math.sin(t * .9) > .985 || (st === 1 && s < .25)) ? 1 : 0; if (bolt) { g.fillStyle = 'rgba(210,220,255,.5)'; g.fillRect(0, 0, 320, 180); let bx = 70 + ((t * 7) % 3) * 80, by = 0; g.fillStyle = '#f4f6ff'; for (let i = 0; i < 9; i++) { const nx = bx + (hash(i, (t * 3) | 0) - .5) * 22; R(g, Math.min(bx, nx), by, Math.abs(nx - bx) + 2, 9, '#f4f6ff'); bx = nx; by += 9; } }
    for (let i = 0; i < 7; i++) { const x = i * 52 - 10 + (i % 2) * 14, h2 = 34 + (i * 13) % 22; R(g, x, 96 - h2, 26, h2, '#0c1420'); R(g, x + 6, 86 - h2, 14, 12, '#0c1420'); R(g, x + 10, 78 - h2, 6, 9, '#0c1420'); }
    R(g, 0, 96, 320, 84, '#161e1c'); R(g, 0, 96, 320, 1, '#2a3632'); for (let i = 0; i < 40; i++) { const a = hash(i, 5), b = hash(i, 8); R(g, a * 320, 100 + b * 76, 6 + a * 10, 1, b > .5 ? '#1e2a28' : '#0e1614'); }
    R(g, 258, 30, 44, 4, '#c8c4d4'); R(g, 262, 34, 3, 62, '#8a8698'); R(g, 295, 34, 3, 62, '#8a8698'); R(g, 256, 26, 48, 4, '#e8c25a'); glow(g, 280, 44, 26, '255,230,160', .25); for (let i = 0; i < 3; i++) PX.spr(g, World.sheetFor('warden'), 0, 266 + i * 10, 62, 1.2);
    const ids = ['cadv1', 'cadv2', 'cadt1', 'cadv1', 'cadt2', 'cadv2', 'cadt1', 'cadv1']; for (let i = 0; i < 8; i++) { const x = 20 + i * 38 + (i % 2) * 8, y = 118 + (i % 3) * 4; if (x > 120 && x < 210) continue; PX.spr(g, World.sheetFor(ids[i]), x < 160 ? 3 : 2, x, y, 1.6); if (st >= 3) R(g, x + (x < 160 ? 6 : -7), y - 46 - Math.round(Math.sin(t * 2 + i)), 1, 16, '#dfe6ff'); }
    for (let i = 0; i < 5; i++) { const x = 122 + i * 20; R(g, x, 164, 16, 3, 'rgba(60,80,90,.5)'); }
    if (st === 0) { PX.spr(g, World.sheetFor('voss'), 2, 186, 158, 3); PX.spr(g, World.sheetFor('kael2'), 3, 134, 160, 3.2); R(g, 150, 108, 2, 30, '#dfe6ff'); glow(g, 151, 110, 10, '200,220,255', .5); }
    else { g.save(); g.translate(196, 160); g.rotate(1.45); PX.spr(g, World.sheetFor('voss'), 0, 0, 0, 3); g.restore(); R(g, 170, 162, 56, 3, 'rgba(120,20,20,.55)'); R(g, 214, 150, 2, 14, '#b8b8c8'); R(g, 208, 150, 14, 2, '#b8b8c8');
      PX.spr(g, World.sheetFor('kael2'), 0, 140, 160, 3.2);
      if (st === 2) { R(g, 128, 150, 9, 12, '#e8c25a'); R(g, 126, 160, 13, 4, '#fff0b0'); R(g, 152, 150, 9, 12, '#e8c25a'); R(g, 150, 160, 13, 4, '#fff0b0'); glow(g, 144, 164, 22, '255,220,140', .5 + .2 * Math.sin(t * 6)); for (let i = 0; i < 6; i++) R(g, 126 + i * 6, 168 + ((t * 30 + i * 5) % 10), 1, 2, '#ffd65a'); }
      if (st >= 3) { g.fillStyle = '#f4f2ec'; g.beginPath(); g.moveTo(128, 102); g.lineTo(156, 102); g.lineTo(166 + Math.sin(t * 2) * 3, 160); g.lineTo(118 + Math.sin(t * 2 + 1) * 3, 160); g.fill(); R(g, 119, 157, 46, 3, '#e8c25a'); R(g, 150, 120, 8, 14, 'rgba(150,20,20,.7)'); PX.spr(g, World.sheetFor('kael2'), 0, 140, 160, 3.2); g.globalAlpha = .82; g.fillStyle = '#f4f2ec'; g.fillRect(126, 104, 6, 50); g.fillRect(152, 104, 6, 50); g.globalAlpha = 1; glow(g, 142, 120, 46, '255,245,220', .22); } }
    g.fillStyle = 'rgba(190,205,235,.35)'; for (let i = 0; i < 90; i++) { const x = (hash(i, 2) * 360 + t * 60) % 340 - 10, y = (hash(i, 7) * 200 + t * (240 + (i % 5) * 30)) % 190; g.fillRect(x | 0, y | 0, 1, 5); }
    if (st === 0) plate(g, 'DAY THIRTY-ONE', 160, 12);
  },
  // ---- Part Two: the Clerk's desk (0: the order · 1: the pen · 2: done)
  desk(g, t, st, s) {
    const { R, glow, plate } = PX; R(g, 0, 0, 320, 180, '#e9e6de'); for (let x = 0; x < 320; x += 40) { R(g, x, 0, 1, 110, '#d6d2c8'); } R(g, 0, 0, 320, 5, '#e8c25a');
    R(g, 206, 16, 96, 74, '#b8943a'); const gr = g.createLinearGradient(0, 19, 0, 87); gr.addColorStop(0, '#3a78d8'); gr.addColorStop(1, '#dcecf8'); g.fillStyle = gr; g.fillRect(209, 19, 90, 68); for (let i = 0; i < 3; i++) { const x = 209 + ((t * (2 + i) + i * 34) % 110) - 16; g.save(); g.beginPath(); g.rect(209, 19, 90, 68); g.clip(); R(g, x, 34 + i * 14, 26, 5, '#ffffff'); g.restore(); } R(g, 253, 19, 2, 68, '#b8943a'); g.fillStyle = 'rgba(255,244,200,.14)'; g.beginPath(); g.moveTo(209, 87); g.lineTo(299, 87); g.lineTo(230, 180); g.lineTo(60, 180); g.closePath(); g.fill();
    R(g, 0, 110, 320, 70, '#cfcabd'); R(g, 0, 110, 320, 2, '#f6f4ee'); R(g, 30, 118, 230, 10, '#5a4030'); R(g, 30, 128, 230, 4, '#3a2a1c'); R(g, 40, 132, 8, 48, '#3a2a1c'); R(g, 242, 132, 8, 48, '#3a2a1c'); R(g, 30, 118, 230, 1, '#7a5a40');
    PX.spr(g, World.sheetFor('kael2'), 0, 86, 122, 3); R(g, 66, 118, 40, 10, '#5a4030');
    R(g, 120, 96, 86, 24, '#f4eedc'); R(g, 120, 96, 86, 1, '#fff8e8'); R(g, 120, 119, 86, 1, '#c8bca0'); ptext(g, 'TIER 4', 126, 100, '#3a2e22'); R(g, 126, 108, 60, 1, '#8a7a5a'); R(g, 126, 111, 48, 1, '#8a7a5a'); R(g, 126, 114, 54, 1, '#8a7a5a'); ptext(g, '1100', 176, 100, '#a02a1a'); R(g, 190, 108, 10, 10, '#a02a1a'); R(g, 192, 110, 6, 6, '#e8c25a');
    R(g, 214, 108, 10, 10, '#2a2630'); R(g, 216, 104, 6, 5, '#14121a');
    if (st >= 3) { PX.spr(g, World.sheetFor(st === 3 ? 'wren' : st === 5 ? 'maren' : 'cade'), 2, 268, 176, 3); if (st === 3) { R(g, 232, 112, 5, 4, '#2a2420'); R(g, 236, 114, 3, 3, '#3a3028'); } R(g, 126, 117, 40, 1, '#1a2a6a'); }
    else if (st >= 1) { const a = Math.min(1, s / 1.5), px = 150 + a * 30, py = 112 - Math.sin(a * 3.14) * 6; g.save(); g.translate(px, py); g.rotate(-.7); R(g, 0, -1, 20, 2, '#e8c25a'); R(g, -3, -1, 3, 2, '#2a2630'); g.restore(); if (st >= 2) { R(g, 126, 117, Math.round(40 * Math.min(1, s / .8)), 1, '#1a2a6a'); glow(g, 160, 108, 50, '255,90,40', .12); } }
    if (st === 0) plate(g, 'THE CLERK OF THE COUNT', 160, 168);
  },
  // ---- Part Two: the ledger of who breathes (0: the book · 1: struck names · 2: hers)
  ledger(g, t, st, s) {
    const { R, glow, plate } = PX; R(g, 0, 0, 320, 180, '#14110e'); glow(g, 160, 60, 150, '255,200,120', .12 + Math.sin(t * 5) * .01); R(g, 0, 150, 320, 30, '#2a1e14'); R(g, 0, 150, 320, 2, '#4a3624');
    R(g, 30, 22, 260, 132, '#3a2a1c'); R(g, 34, 26, 124, 124, '#efe6d0'); R(g, 162, 26, 124, 124, '#e8dec6'); R(g, 158, 26, 4, 124, '#b8a888'); R(g, 34, 26, 252, 1, '#fff8e8');
    for (const x0 of [40, 168]) { R(g, x0, 32, 112, 1, '#b8943a'); R(g, x0 + 70, 32, 1, 112, '#d8c8a0'); R(g, x0 + 92, 32, 1, 112, '#d8c8a0'); ptext(g, 'NAME', x0 + 2, 34, '#8a6a2a'); ptext(g, 'AIR', x0 + 73, 34, '#8a6a2a'); ptext(g, 'DUE', x0 + 95, 34, '#8a6a2a'); }
    const N = ['MORROW D', 'VENN M', 'HOLLIS', 'FEN', 'MARROW', 'TAVI B', 'ORIN', 'NELL', 'BAO', 'PELL', 'JUNO', 'KIT', 'SABLE', 'ADA', 'MOSI', 'PIP'], struck = [0, 3, 6, 9, 12, 14];
    for (let i = 0; i < 16; i++) { const x0 = i < 8 ? 40 : 168, y = 44 + (i % 8) * 12, hit = st >= 1 && struck.includes(i), a = hit ? Math.min(1, Math.max(0, s * 2 - struck.indexOf(i) * .5)) : 0; ptext(g, N[i], x0 + 2, y, '#3a2e22'); R(g, x0 + 73, y + 1, 14 - (i * 5) % 8, 3, '#6a8aa0'); ptext(g, String(3 + (i * 7) % 9), x0 + 96, y, '#8a2a1a'); if (a > 0) { R(g, x0, y + 2, Math.round(68 * a), 1, '#a02a1a'); if (a >= 1 && st < 2) ptext(g, 'BALANCED', x0 + 30, y + 6, '#a02a1a'); } }
    if (st >= 2) { const a = Math.min(1, s / 1.4); g.globalAlpha = a; R(g, 60, 70, 200, 44, '#efe6d0'); R(g, 60, 70, 200, 1, '#b8943a'); R(g, 60, 113, 200, 1, '#b8943a'); ptext(g, 'HOLLOWAY S', 72, 78, '#3a2e22', 2); R(g, 70, 84, Math.round(128 * a), 2, '#a02a1a'); ptext(g, 'COMMITTED - TIER 6 - BALANCED', 72, 98, '#a02a1a'); g.globalAlpha = 1; glow(g, 160, 92, 90, '255,120,60', .12 * a); }
    R(g, 250, 120, 3, 34, '#e8e0cc'); R(g, 251, 114 + Math.round(Math.sin(t * 8)), 1, 6, '#ffd26e'); glow(g, 251, 116, 12, '255,200,110', .7); if (st === 0) plate(g, 'THE COUNT', 160, 168);
  },
  // ---- the end: Ashgate Square with the lift standing open (0: the light · 1: they look up · 2: her sun)
  dawn(g, t, st, s) {
    const { R, glow, plate } = PX; R(g, 0, 0, 320, 180, '#120c10'); PX.rock(g, 0, 60); for (let y = 60; y < 150; y += 10) for (let x = (y / 10 % 2) * 16; x < 320; x += 32) R(g, x, y, 31, 9, (x + y) % 3 ? '#2a2026' : '#30262c'); R(g, 0, 150, 320, 30, '#3a3036'); for (let x = 0; x < 320; x += 20) R(g, x, 150, 1, 30, '#2a2228'); R(g, 0, 150, 320, 1, '#5a4c54');
    const a = Math.min(1, t / 3); R(g, 132, 30, 56, 120, '#e4e2dc'); R(g, 138, 30, 44, 120, '#fff8e0'); R(g, 132, 30, 56, 3, '#e8c25a'); g.fillStyle = `rgba(255,244,200,${.2 * a})`; g.beginPath(); g.moveTo(138, 30); g.lineTo(182, 30); g.lineTo(300, 180); g.lineTo(20, 180); g.closePath(); g.fill(); glow(g, 160, 60, 140 * a, '255,240,190', .35 * a); g.fillStyle = `rgba(255,236,170,${.1 * a})`; g.fillRect(0, 150, 320, 30);
    for (let i = 0; i < 40; i++) { const ph = (t * .08 + hash(i, 2)) % 1; R(g, 60 + hash(i, 1) * 200, 40 + ph * 130, 1, 1, `rgba(255,250,220,${.8 * a})`); }
    const ids = ['mara', 'tavi', 'ivo', 'orin', 'nell', 'hollis', 'dace', 'bao', 'pell', 'juno', 'kit', 'marrow'];
    for (let i = 0; i < 12; i++) { const x = 14 + i * 26 + (i % 2) * 6, y = 160 + (i % 3) * 6; if (Math.abs(x - 160) < 24) continue; PX.spr(g, World.sheetFor(ids[i]), st >= 1 ? 1 : (x < 160 ? 3 : 2), x, y, 2); }
    if (st >= 2) { const b = Math.min(1, s / 1.6); g.strokeStyle = `rgba(255,236,170,${b})`; g.lineWidth = 2; g.beginPath(); g.arc(160, 100, 12, 0, 6.3); g.stroke(); for (let k = 0; k < 8; k++) { const an = k / 8 * 6.283; R(g, 160 + Math.cos(an) * 18, 100 + Math.sin(an) * 18, 2, 2, `rgba(255,236,170,${b})`); } g.lineWidth = 1; PX.spr(g, World.sheetFor('kael2'), 1, 160, 152, 2.5); }
    if (st === 0) plate(g, 'ASHGATE SQUARE', 60, 20);
  },
  // ---- Day 3: the top of Lift Zero (0: the room · 1: she is there · 2: the window)
  ante(g, t, st, s) {
    const { R, glow, plate } = PX; R(g, 0, 0, 320, 180, '#e9e6de'); for (let x = 0; x < 320; x += 40) { R(g, x, 0, 1, 130, '#d6d2c8'); R(g, x + 1, 0, 1, 130, '#f6f4ee'); } R(g, 0, 0, 320, 6, '#e8c25a'); R(g, 0, 6, 320, 1, '#b8943a');
    R(g, 0, 130, 320, 50, '#cfcabd'); for (let i = 0; i < 9; i++) { R(g, i * 40 - 10, 130, 1, 50, '#bdb8aa'); } R(g, 0, 130, 320, 2, '#f6f4ee'); R(g, 0, 156, 320, 1, '#bdb8aa');
    const open = st > 2 ? 1 : st === 2 ? Math.min(1, s / 2.2) : 0; // the window
    R(g, 196, 26, 96, 84, '#b8943a'); R(g, 199, 29, 90, 78, '#8a8478'); const sh = Math.round(78 * (1 - open));
    const gr = g.createLinearGradient(0, 29, 0, 107); gr.addColorStop(0, '#3a78d8'); gr.addColorStop(.7, '#9ccaf4'); gr.addColorStop(1, '#eef4f8'); g.fillStyle = gr; g.fillRect(199, 29, 90, 78);
    for (let i = 0; i < 3; i++) { const x = 199 + ((t * (2 + i) + i * 34) % 110) - 16, y = 44 + i * 16; g.save(); g.beginPath(); g.rect(199, 29, 90, 78); g.clip(); R(g, x, y, 26, 5, '#ffffff'); R(g, x + 5, y - 3, 14, 4, '#f6faff'); g.restore(); }
    R(g, 266, 36, 10, 10, '#fff6c0'); glow(g, 271, 41, 26 * open + 2, '255,244,190', .8 * open); R(g, 199, 96, 90, 11, '#4f9a4c'); R(g, 199, 95, 90, 1, '#7ac06a');
    for (let y = 0; y < sh; y += 6) { R(g, 199, 29 + y, 90, 5, '#d8d4ca'); R(g, 199, 34 + y, 90, 1, '#a8a498'); } R(g, 243, 29, 2, 78, '#b8943a');
    if (open > 0) { g.fillStyle = `rgba(255,244,200,${.16 * open})`; g.beginPath(); g.moveTo(199, 29 + sh); g.lineTo(289, 29 + sh); g.lineTo(250, 180); g.lineTo(40, 180); g.closePath(); g.fill(); for (let i = 0; i < 24; i++) { const ph = (t * .1 + hash(i, 9)) % 1; R(g, 80 + hash(i, 3) * 190, 60 + ph * 110, 1, 1, `rgba(255,250,220,${.7 * open})`); } }
    R(g, 20, 104, 60, 6, '#f6f4ee'); R(g, 20, 110, 60, 3, '#d6d2c8'); R(g, 24, 113, 4, 17, '#d6d2c8'); R(g, 72, 113, 4, 17, '#d6d2c8'); R(g, 20, 88, 4, 16, '#f6f4ee'); // the bench
    const gold = st >= 4 && st !== 7; if (st === 5) { const a = t * .8; R(g, 60, 84, 28, 28, '#8a8478'); R(g, 62, 86, 24, 24, '#3a3e46'); g.strokeStyle = '#c8ccd4'; g.lineWidth = 2; g.beginPath(); g.arc(74, 98, 9, 0, 6.3); for (let k = 0; k < 4; k++) { g.moveTo(74, 98); g.lineTo(74 + Math.cos(a + k * 1.57) * 9, 98 + Math.sin(a + k * 1.57) * 9); } g.stroke(); g.lineWidth = 1; R(g, 40, 96, 22, 4, '#8a8478'); const NT = [0, 3, 7, 5, 3, 2, 0]; for (let i = 0; i < 7; i++) { const ph = (t * .22 + i / 7) % 1, x = 92 + ph * 60 + Math.sin(ph * 9 + i) * 3, y = 84 - NT[i] * 2 - ph * 34; g.globalAlpha = Math.sin(ph * 3.14); R(g, x, y, 3, 2, '#3a2e22'); R(g, x + 2, y - 6, 1, 7, '#3a2e22'); g.globalAlpha = 1; } }
    const ks = World.sheetFor(gold ? 'kael2' : 'kael'); PX.spr(g, ks, st === 5 ? 2 : st >= 2 ? 3 : 0, st === 5 ? 96 : 108, 150, 3); R(g, 96, 150, 26, 2, 'rgba(0,0,0,.18)');
    if (st === 7) { PX.spr(g, World.sheetFor('wren'), 2, 64, 150, 2.6); R(g, 54, 150, 22, 2, 'rgba(0,0,0,.18)'); R(g, 50, 128, 10, 8, '#8a8478'); R(g, 52, 124, 6, 4, '#c8ccd4'); }
    if (st === 4) { PX.spr(g, World.sheetFor('lucan'), 2, 170, 150, 3); R(g, 158, 150, 26, 2, 'rgba(0,0,0,.18)'); return; }
    if (st === 6) { g.save(); g.translate(0, 62); g.scale(1, .6); } if (st === 5) { R(g, 150, 118, 44, 4, '#f6f4ee'); R(g, 150, 122, 44, 2, '#d6d2c8'); R(g, 154, 124, 3, 26, '#d6d2c8'); R(g, 187, 124, 3, 26, '#d6d2c8'); R(g, 160, 112, 6, 6, '#ffffff'); R(g, 160, 112, 6, 1, '#e8c25a'); }
    if (st >= 1) { const a = Math.min(1, st > 1 ? 1 : s / 1.2), x = st === 6 ? 176 : st === 5 ? 192 : 166, b = Math.round(Math.sin(t * 1.2)); g.globalAlpha = a; glow(g, x + 10, 84, 46, '255,236,180', .22); R(g, x - 4, 150, 30, 2, 'rgba(0,0,0,.18)'); R(g, x, 66 + b, 22, 86 - b, '#fbf8f0'); R(g, x + 18, 66 + b, 4, 86 - b, '#e2ddd0'); R(g, x - 3, 96 + b, 4, 56 - b, '#f2ede2'); R(g, x + 21, 100 + b, 3, 52 - b, '#e2ddd0'); R(g, x, 66 + b, 22, 2, '#e8c25a'); R(g, x + 9, 68 + b, 4, 84 - b, '#e8c25a'); R(g, x, 150, 22, 2, '#e8c25a'); R(g, x - 4, 64 + b, 8, 6, '#e8c25a'); R(g, x + 18, 64 + b, 8, 6, '#e8c25a'); R(g, x - 4, 64 + b, 8, 1, '#fff2c0');
      R(g, x + 4, 44 + b, 14, 20, '#f0e0d4'); R(g, x + 3, 40 + b, 16, 8, '#f4f2ec'); R(g, x + 3, 46 + b, 2, 22, '#f4f2ec'); R(g, x + 17, 46 + b, 2, 22, '#e6e2d8'); R(g, x + 3, 42 + b, 16, 2, '#e8c25a'); R(g, x + 10, 38 + b, 2, 4, '#fff2c0'); R(g, x + 6, 52 + b, 3, 1, '#c89a2a'); R(g, x + 12, 52 + b, 3, 1, '#c89a2a'); R(g, x + 9, 58 + b, 4, 1, '#c8a898'); R(g, x + 6, 50 + b, 3, 1, '#d8c8bc'); R(g, x + 12, 50 + b, 3, 1, '#d8c8bc'); R(g, x - 6, 108 + b, 5, 4, '#f0e0d4'); g.globalAlpha = 1; }
    if (st === 6) g.restore();
    if (st === 0) plate(g, 'LIFT ZERO - THE UPPER LANDING', 110, 168);
  },
  // ---- Day 3: under the floor (0: the chalk · 1: Dace · 2: the lamp at the hatch)
  under(g, t, st, s) {
    const { R, glow, plate } = PX; R(g, 0, 0, 320, 180, '#0b0809'); PX.rock(g, 0, 40); for (let y = 40; y < 130; y += 10) for (let x = (y / 10 % 2) * 14; x < 320; x += 28) R(g, x, y, 27, 9, (x + y) % 3 ? '#1a1416' : '#1e1719'); R(g, 0, 130, 320, 50, '#120d0e'); R(g, 0, 130, 320, 1, '#2a2022');
    for (let i = 0; i < 2; i++) { R(g, 0, 56 + i * 44, 320, 5, '#2c2a30'); R(g, 0, 56 + i * 44, 320, 1, '#4a4850'); for (let x = 30; x < 320; x += 70) R(g, x, 54 + i * 44, 5, 9, '#3a3840'); } const dr = (t * .7) % 1; R(g, 104, 61 + dr * 60, 1, 2, '#6a8aa0');
    for (let x = 0; x < 320; x += 12) R(g, x, 150, 8, 2, '#2a2224'); R(g, 0, 146, 320, 1, '#3a3034'); R(g, 0, 156, 320, 1, '#3a3034');
    const fl = .8 + Math.sin(t * 10) * .06 + Math.sin(t * 4.3) * .06; R(g, 150, 108, 8, 12, '#3a3020'); R(g, 152, 100, 4, 8, '#ffd26e'); glow(g, 154, 104, 70 * fl, '255,170,80', .22); glow(g, 154, 104, 18, '255,210,120', .7 * fl);
    // chalk suns: hers, and newer ones
    const sun = (x, y, r, c) => { g.strokeStyle = c; g.beginPath(); g.arc(x, y, r, 0, 6.3); g.stroke(); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; R(g, x + Math.cos(a) * (r + 3), y + Math.sin(a) * (r + 3), 1, 1, c); } };
    sun(60, 84, 7, '#8a8478'); sun(92, 96, 5, '#a8a294'); sun(214, 82, 8, '#efe6d4'); sun(246, 98, 5, '#efe6d4'); g.strokeStyle = '#efe6d4'; g.beginPath(); g.moveTo(262, 90); g.lineTo(290, 90); g.lineTo(284, 85); g.moveTo(290, 90); g.lineTo(284, 95); g.stroke();
    R(g, 286, 104, 26, 26, '#1a1416'); R(g, 288, 106, 22, 24, '#070506'); R(g, 286, 104, 26, 2, '#4a4850');
    const ks = World.sheetFor('kael'); PX.spr(g, ks, 3, 108, 150, 3);
    if (st >= 1) { const a = Math.min(1, st > 1 ? 1 : s / 1.2); g.globalAlpha = a; PX.spr(g, World.sheetFor('dace'), 2, 204, 150, 3); g.globalAlpha = 1; }
    if (st >= 2) { const a = Math.min(1, s / 1.4); g.fillStyle = `rgba(255,246,214,${.22 * a})`; g.beginPath(); g.moveTo(292, 0); g.lineTo(312, 0); g.lineTo(330, 180); g.lineTo(230, 180); g.closePath(); g.fill(); glow(g, 302, 8, 30 * a, '255,246,214', .8 * a); PX.spr(g, World.sheetFor('warden'), 2, 296, 152, 3); }
    if (st === 0) plate(g, 'THE OLD TUNNEL', 60, 168);
  },
  // ---- the dreams: what comes after
  gild(g, t, st, s) {
    const { R, glow, plate } = PX; R(g, 0, 0, 320, 180, '#07060a');
    for (let y = 0; y < 132; y += 12) for (let x = (y / 12 % 2) * 12; x < 320; x += 24) R(g, x, y, 23, 11, (x * 7 + y * 3) % 5 ? '#0b0a10' : '#0e0d14'); for (let i = 0; i < 9; i++) R(g, 20 + i * 34, 0, 2, 132, '#100e16'); R(g, 0, 132, 320, 48, '#0c0a0e'); R(g, 0, 132, 320, 1, '#22202a'); for (let i = 0; i < 16; i++) R(g, i * 20 + 2, 134 + (i % 3) * 14, 18, 1, '#121018');
    R(g, 0, 8, 320, 3, '#1a1820'); for (let i = 0; i < 5; i++) { R(g, 30 + i * 64, 11, 1, 6 + (i % 2) * 5, '#2a2630'); } if (st >= 3) { PANELS.lesson(g, t, st, s); return; }
    const fl = .5 + Math.sin(t * 9) * .03 + Math.sin(t * 23) * .02;
    if (st < 2) { // the table
      R(g, 158, 0, 2, 26, '#2a2630'); R(g, 146, 26, 26, 5, '#4a4650'); g.fillStyle = `rgba(255,236,190,${.1 * fl + .04})`; g.beginPath(); g.moveTo(150, 31); g.lineTo(168, 31); g.lineTo(232, 132); g.lineTo(86, 132); g.closePath(); g.fill(); glow(g, 159, 34, 26, '255,240,200', .5 * fl);
      R(g, 96, 104, 128, 6, '#3a3640'); R(g, 96, 110, 128, 2, '#1c1a20'); R(g, 104, 112, 5, 20, '#2a2630'); R(g, 211, 112, 5, 20, '#2a2630');
      R(g, 108, 96, 14, 8, '#c8946a'); R(g, 106, 94, 8, 4, '#2a2018'); R(g, 122, 97, 44, 7, '#5a5660'); R(g, 166, 98, 46, 3, '#4a4650'); R(g, 166, 101, 46, 3, '#46424c'); R(g, 126, 92, 30, 3, '#5a5660'); R(g, 124, 104, 3, 3, '#c8946a');
      for (const [x, y] of [[100, 100], [216, 100], [136, 104], [190, 104]]) R(g, x, y, 4, 2, '#8a8478');
      for (const [x, h, sw] of [[58, 66, 1], [250, 58, -1], [274, 64, -1]]) { const b = Math.round(Math.sin(t * 1.3 + x) * 1); R(g, x, 132 - h + b, 12, h - b, '#15131c'); R(g, x + 1, 132 - h - 9 + b, 10, 10, '#1c1a24'); R(g, x + 2, 132 - h - 5 + b, 8, 4, '#3a3428'); R(g, x + 3, 132 - h - 4 + b, 2, 1, '#e8c25a'); R(g, x + 7, 132 - h - 4 + b, 2, 1, '#e8c25a'); R(g, x + (sw > 0 ? 12 : -6), 132 - h + 16 + b, 6, 3, '#15131c'); }
      R(g, 30, 112, 22, 2, '#3a3640'); R(g, 32, 114, 2, 18, '#22202a'); R(g, 48, 114, 2, 18, '#22202a'); for (let i = 0; i < 5; i++) R(g, 32 + i * 4, 108 + (i % 2), 2, 4, i % 2 ? '#c8ccd4' : '#e8c25a');
      R(g, 232, 40, 1, 60, '#2a2630'); R(g, 228, 40, 9, 12, '#4a4030'); R(g, 229, 42, 7, 8, `rgba(255,210,110,${.6 + Math.sin(t * 2) * .2})`); g.strokeStyle = '#6a5a30'; g.beginPath(); g.moveTo(232, 52); g.quadraticCurveTo(226, 84, 206, 99); g.stroke(); const dr = (t * .9) % 1; R(g, 232, 52 + dr * 30, 1, 2, '#ffd26e');
      g.fillStyle = 'rgba(255,236,190,.05)'; g.fillRect(96, 134, 128, 10);
      if (st >= 1) { const a = Math.min(1, s / 2.4); // gold into the long bones
        R(g, 166, 99, Math.round(46 * a), 1, '#ffd26e'); R(g, 166, 102, Math.round(46 * a), 1, '#ffd26e'); R(g, 126, 93, Math.round(30 * a), 1, '#ffd26e'); R(g, 122, 100, Math.round(44 * a), 1, '#e8c25a');
        glow(g, 166 + 46 * a, 100, 9, '255,210,110', .7); glow(g, 113, 99, 7 * a, '255,210,110', .6 * a); if (a > .9) { R(g, 110, 98, 2, 1, '#ffe08a'); R(g, 114, 98, 2, 1, '#ffe08a'); }
        for (let i = 0; i < 10; i++) { const ph = (t * .8 + i * .1) % 1; R(g, 166 + hash(i, 3) * 46 * a, 98 - ph * 18, 1, 1, `rgba(255,220,130,${1 - ph})`); } plate(g, 'GILDING', 160, 150); }
    } else { // what went onto the table, and what came off it
      glow(g, 110, 96, 40, '120,110,130', .12); glow(g, 214, 78, 60, '255,214,120', .14 + Math.sin(t * 2) * .02);
      R(g, 104, 92, 12, 22, '#3a3640'); R(g, 106, 82, 8, 10, '#c8946a'); R(g, 105, 80, 10, 4, '#2a2018'); R(g, 105, 114, 4, 18, '#2a2630'); R(g, 111, 114, 4, 18, '#2a2630');
      const a = Math.min(1, s / 1.6), h = Math.round(20 * a);
      R(g, 206, 74 - h, 16, 34 + h, '#efe8d4'); R(g, 208, 60 - h, 12, 14, '#e8c8a8'); R(g, 207, 57 - h, 14, 5, '#e8c070'); R(g, 207, 108, 6, 24, '#d8d0bc'); R(g, 215, 108, 6, 24, '#d8d0bc'); R(g, 204, 74 - h, 20, 3, '#e8c25a'); R(g, 210, 65 - h, 2, 1, '#ffd26e'); R(g, 216, 65 - h, 2, 1, '#ffd26e');
      R(g, 96, 133, 30, 1, '#1c1820'); R(g, 196, 133, 40, 1, '#3a3020'); R(g, 150, 30, 2, 104, '#3a3020'); R(g, 150, 30, 108, 2, '#3a3020'); R(g, 256, 30, 2, 104, '#3a3020'); R(g, 151, 31, 1, 102, '#e8c25a'); g.fillStyle = 'rgba(255,230,170,.04)'; g.fillRect(152, 32, 104, 100); g.fillStyle = 'rgba(255,255,255,.05)'; g.beginPath(); g.moveTo(160, 32); g.lineTo(176, 32); g.lineTo(156, 132); g.lineTo(152, 132); g.lineTo(152, 80); g.closePath(); g.fill(); for (let i = 0; i < 8; i++) { const ph = (t * .3 + i * .125) % 1; R(g, 200 + Math.sin(i * 2.3) * 22, 110 - ph * 80, 1, 1, `rgba(255,220,130,${(1 - ph) * a})`); } plate(g, 'BEFORE', 110, 150, 1); plate(g, 'AFTER', 214, 150);
    }
  },
  lesson(g, t, st, s) { // a slate, a candle, and two ways of saying the same thing
    const { R, glow } = PX, fl = .8 + Math.sin(t * 11) * .05 + Math.sin(t * 5) * .05;
    glow(g, 160, 96, 110, '255,180,90', .1 * fl); R(g, 60, 118, 200, 5, '#3a2a1c'); R(g, 60, 123, 200, 2, '#1c140e'); R(g, 70, 125, 5, 8, '#2a1e14'); R(g, 245, 125, 5, 8, '#2a1e14');
    R(g, 157, 104, 6, 14, '#e8e0cc'); R(g, 159, 98 + Math.round(Math.sin(t * 9)), 2, 6, '#ffd26e'); glow(g, 160, 100, 16, '255,200,110', .7 * fl);
    R(g, 40, 70, 16, 48, '#2e2a32'); R(g, 42, 56, 12, 14, '#c8946a'); R(g, 41, 53, 14, 6, '#2a2018'); R(g, 54, 92, 14, 4, '#2e2a32'); // him
    R(g, 262, 50, 18, 68, '#5a5660'); R(g, 264, 34, 14, 16, '#e0cdbc'); R(g, 263, 31, 16, 7, '#b8b4ac'); R(g, 262, 38, 3, 26, '#b8b4ac'); R(g, 267, 40, 2, 1, '#e8c25a'); R(g, 273, 40, 2, 1, '#e8c25a'); R(g, 248, 84, 16, 4, '#5a5660'); // her
    R(g, 96, 22, 128, 72, '#3a2a1c'); R(g, 99, 25, 122, 66, '#14181a'); R(g, 99, 25, 122, 1, '#22282a');
    const P2 = [['THANKS', 'NOTED'], ['AYE', 'GRANTED'], ['MY BREATH', 'MY TIME'], ['WE', 'ONE']], n = Math.min(4, st - 3);
    ptext(g, 'SOOT', 106, 29, '#8a8478'); ptext(g, 'THEM', 176, 29, '#e8c25a'); R(g, 104, 36, 112, 1, '#3a4044');
    for (let i = 0; i < n; i++) { const last = i === n - 1, a = last ? Math.min(1, s / .7) : 1, y = 42 + i * 12; g.globalAlpha = a; ptext(g, P2[i][0], 106, y, '#c8c0b0'); R(g, 104, y + 2, Math.round((ptextW(P2[i][0]) + 4) * a), 1, '#a03a3a'); ptext(g, P2[i][1], 176, y, '#ffe08a'); g.globalAlpha = 1; }
  },
  assay(g, t, st, s) {
    const { R, glow, plate } = PX; const gr = g.createLinearGradient(0, 0, 0, 180); gr.addColorStop(0, '#6a9ad8'); gr.addColorStop(.5, '#bcd8f0'); gr.addColorStop(1, '#e8f0d8'); g.fillStyle = gr; g.fillRect(0, 0, 320, 180); glow(g, 250, 26, 46, '255,244,200', .7); R(g, 244, 20, 12, 12, '#fff6d0');
    for (let i = 0; i < 9; i++) { const x = i * 40 - 10, h = 40 + hash(i, 7) * 34; g.fillStyle = i % 2 ? '#7a86b0' : '#8a94bc'; g.beginPath(); g.moveTo(x - 30, 96); g.lineTo(x + 10, 96 - h); g.lineTo(x + 50, 96); g.closePath(); g.fill(); g.fillStyle = '#f4f4fa'; g.beginPath(); g.moveTo(x + 10, 96 - h); g.lineTo(x + 2, 96 - h * .72); g.lineTo(x + 18, 96 - h * .72); g.closePath(); g.fill(); }
    for (let i = 0; i < 5; i++) { const x = ((i * 83 + t * (2 + i % 3)) % 400) - 40, y = 14 + (i % 3) * 16; R(g, x, y, 34, 6, 'rgba(255,255,255,.85)'); R(g, x + 6, y - 4, 20, 5, 'rgba(255,255,255,.8)'); R(g, x + 3, y + 6, 28, 2, 'rgba(200,214,240,.6)'); }
    for (let i = 0; i < 4; i++) { const bx = ((t * 14 + i * 90) % 360) - 20, by = 40 + i * 6 + Math.sin(t * 2 + i) * 3, w = Math.sin(t * 9 + i) > 0 ? 1 : 0; R(g, bx, by, 2, 1, '#2a3040'); R(g, bx - 2, by - w, 2, 1, '#2a3040'); R(g, bx + 2, by - w, 2, 1, '#2a3040'); }
    R(g, 0, 96, 320, 84, '#3f8a44'); R(g, 0, 96, 320, 2, '#58a85a'); for (let i = 0; i < 26; i++) { const x = hash(i, 11) * 320, y = 100 + hash(i, 12) * 26, c = i % 3 ? '#1f6a34' : '#27803c'; if (Math.abs(x - 160) < 30) continue; g.fillStyle = c; g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x - 5, y); g.lineTo(x + 5, y); g.closePath(); g.fill(); R(g, x - 1, y, 2, 2, '#5a3c26'); }
    for (let i = 0; i < 60; i++) R(g, hash(i, 1) * 320, 98 + hash(i, 2) * 80, 6 + hash(i, 3) * 10, 2, i % 2 ? '#4a9a4e' : '#357a3c');
    g.fillStyle = '#5aa8d8'; g.beginPath(); g.moveTo(0, 150); g.quadraticCurveTo(110, 118, 190, 146); g.quadraticCurveTo(250, 166, 320, 138); g.lineTo(320, 148); g.quadraticCurveTo(250, 176, 190, 156); g.quadraticCurveTo(110, 128, 0, 160); g.closePath(); g.fill();
    for (let i = 0; i < 14; i++) { const u = ((t * .08 + i / 14) % 1), x = u * 320, y = u < .34 ? 150 - Math.sin(u / .34 * 1.57) * 18 : u < .6 ? 132 + (u - .34) / .26 * 22 : 154 - (u - .6) / .4 * 12; R(g, x, y + 4, 4, 1, 'rgba(255,255,255,.7)'); }
    R(g, 132, 96, 56, 4, '#8a8a82'); R(g, 136, 92, 48, 5, '#9a9a90'); R(g, 142, 70, 36, 28, '#f2ede2'); R(g, 142, 70, 4, 28, '#fbf8f0'); R(g, 174, 70, 4, 28, '#d8d2c4'); R(g, 138, 62, 10, 36, '#e6e0d2'); R(g, 172, 62, 10, 36, '#e6e0d2'); R(g, 154, 56, 12, 42, '#f8f4ea'); R(g, 157, 82, 6, 16, '#3a3040'); for (const x of [138, 144, 172, 178, 154, 160]) R(g, x, 54 + (x > 150 && x < 166 ? 0 : 6), 4, 3, '#f8f4ea'); R(g, 159, 44, 1, 12, '#8a8478'); R(g, 160, 44, 8, 5, '#e8c25a'); plate(g, 'THE KEEP', 160, 34);
    const HC = ['#7a5ac8', '#2aa6a0', '#c8452e', '#e8c25a', '#3a6ac8', '#58b848', '#c85a9a', '#e88a3a', '#8a8a92', '#40c8e8', '#a03a3a', '#f4f0e6'], pos = [[60, 136], [262, 128], [26, 112], [96, 108], [120, 168], [214, 112], [296, 110], [236, 168], [44, 168], [286, 164], [180, 122], [78, 150]];
    if (st >= 1) for (let i = 0; i < 12; i++) { const a = Math.min(1, Math.max(0, s * 3 - i * .25)); if (a <= 0) continue; const [x, y] = pos[i], w = Math.sin(t * 3 + i) > 0 ? 1 : 0; if (st >= 2 && i > 1) g.globalAlpha = .35; R(g, x, y - 14, 1, 14, '#3a3028'); R(g, x + 1, y - 14 + w, 8, 6, HC[i]); R(g, x - 3, y, 7, 2, 'rgba(0,0,0,.25)'); g.fillStyle = '#f4f0e6'; g.beginPath(); g.moveTo(x - 9, y); g.lineTo(x - 5, y - 7); g.lineTo(x - 1, y); g.closePath(); g.fill(); R(g, x - 6, y - 2, 2, 2, HC[i]); for (let k = 0; k < 3; k++) { R(g, x + 4 + k * 4, y - 3, 2, 4, HC[i]); R(g, x + 4 + k * 4, y - 5, 2, 2, '#f0d8c0'); } g.globalAlpha = 1; }
    if (st === 1) plate(g, 'TWELVE HOUSES', 160, 172);
    if (st >= 2) { const [ax, ay] = pos[0], [bx, by] = pos[1], k = Math.min(1, s / 1.5); g.strokeStyle = '#fff2c0'; g.setLineDash([3, 3]); g.lineDashOffset = -t * 8; g.beginPath(); g.moveTo(ax + 6, ay - 8); g.lineTo(ax + 6 + (bx - ax) * k, ay - 8 + (by - ay) * k); g.stroke(); g.setLineDash([]); plate(g, 'VIOLET', ax + 4, ay + 6); plate(g, 'TEAL', bx + 4, by + 6); }
    if (st >= 3) { const a = Math.min(1, s / 1.2); g.globalAlpha = a; R(g, 12, 40, 70, 8, '#f2ede2'); R(g, 12, 47, 70, 1, '#e8c25a'); for (let i = 0; i < 5; i++) { R(g, 18 + i * 13, 22, 7, 18, '#f8f6f0'); R(g, 19 + i * 13, 16, 5, 6, '#f0e0d4'); R(g, 18 + i * 13, 14, 7, 2, '#e8c25a'); glow(g, 21 + i * 13, 22, 8, '255,240,200', .3); } plate(g, 'THE PROCTORS', 47, 58); g.globalAlpha = 1; }
  },
  spire(g, t, st, s) {
    const { R, glow, plate } = PX; const gr = g.createLinearGradient(0, 0, 0, 180); gr.addColorStop(0, '#1a2c6a'); gr.addColorStop(.6, '#6a9ad8'); gr.addColorStop(1, '#dce8f8'); g.fillStyle = gr; g.fillRect(0, 0, 320, 180); glow(g, 70, 30, 60, '255,244,200', .8); R(g, 62, 22, 16, 16, '#fff6d0');
    for (let i = 0; i < 9; i++) { const a = i / 9 * 3.14 + t * .05; g.fillStyle = 'rgba(255,244,200,.05)'; g.beginPath(); g.moveTo(70, 30); g.lineTo(70 + Math.cos(a) * 300, 30 + Math.sin(a) * 300); g.lineTo(70 + Math.cos(a + .1) * 300, 30 + Math.sin(a + .1) * 300); g.closePath(); g.fill(); }
    for (const [x, h] of [[96, 60], [222, 76], [250, 50]]) { g.fillStyle = '#dfe4f0'; g.beginPath(); g.moveTo(x - 4, 180); g.lineTo(x - 1, 180 - h); g.lineTo(x + 1, 180 - h); g.lineTo(x + 4, 180); g.closePath(); g.fill(); R(g, x, 180 - h - 6, 1, 6, '#e8c25a'); }
    g.fillStyle = '#d9d6ce'; g.beginPath(); g.moveTo(164, 30); g.lineTo(172, 180); g.lineTo(163, 180); g.lineTo(161, 30); g.closePath();
    g.fillStyle = '#f6f4ee'; g.beginPath(); g.moveTo(150, 180); g.lineTo(156, 30); g.lineTo(164, 30); g.lineTo(172, 180); g.closePath(); g.fill(); R(g, 159, 8, 2, 24, '#ffe08a'); glow(g, 160, 10, 10, '255,224,140', .8); R(g, 161, 30, 3, 150, '#dcd8ce'); for (let i = 0; i < 6; i++) { R(g, 152 - i, 56 + i * 20, 18 + i * 2, 2, '#e8c25a'); R(g, 152 - i, 58 + i * 20, 18 + i * 2, 1, '#b8943a'); glow(g, 161, 57 + i * 20, 8, '255,214,120', .25 + Math.sin(t * 2 + i) * .08); for (let k = 0; k < 3; k++) R(g, 155 + k * 4, 62 + i * 20, 1, 3, '#8ab0e0'); }
    for (let i = 0; i < 8; i++) { const x = ((i * 67 + t * (3 + i % 3)) % 380) - 30, y = 130 + (i % 4) * 12; R(g, x, y, 60, 8, '#ffffff'); R(g, x + 10, y - 5, 34, 6, '#f4f8ff'); } R(g, 0, 170, 320, 10, '#f4f8ff'); plate(g, 'THE SUN SPIRE', 160, 100);
    if (st >= 1) for (let i = 0; i < 26; i++) { const ph = (t * (.12 + (i % 5) * .02) + hash(i, 4)) % 1, x = 20 + hash(i, 5) * 280 - ph * 26, y = -10 + ph * 150; R(g, x, y, 5, 2, '#3a3a44'); R(g, x + 5, y - 3, 6, 1, 'rgba(255,150,60,.9)'); R(g, x + 9, y - 6, 8, 1, 'rgba(255,200,120,.5)'); }
  },
  // ---- what they send back
  tin(g, t, st, s) {
    const { R, glow } = PX; for (let i = 0; i < 9; i++) { R(g, 0, i * 20, 320, 19, i % 2 ? '#3a2a20' : '#40301f'); R(g, 0, i * 20, 320, 1, '#54402a'); R(g, (hash(i, 1) * 300) | 0, i * 20, 1, 19, '#241a12'); }
    glow(g, 150, 80, 150, '255,180,90', .22); g.save(); g.translate(0, -26);
    // the tin
    R(g, 96, 62, 112, 70, '#141418'); R(g, 98, 64, 108, 66, '#6e727c'); R(g, 98, 64, 108, 3, '#a2a6b0'); R(g, 202, 67, 4, 63, '#44474e'); R(g, 104, 70, 96, 54, '#1c1c20');
    for (let i = 0; i < 60; i++) { const x = 106 + hash(i, 5) * 90, y = 96 + hash(i, 6) * 24 - Math.sin((x - 106) / 90 * Math.PI) * 10; R(g, x, y, 3, 2, ['#8a8684', '#6a6664', '#a8a4a0'][i % 3]); } R(g, 106, 112, 92, 10, '#7a7674');
    // lid, with their little stamped sun
    R(g, 216, 78, 74, 56, '#141418'); R(g, 218, 80, 70, 52, '#7a7e88'); R(g, 218, 80, 70, 3, '#aeb2bc'); R(g, 244, 98, 18, 18, '#5e626c'); R(g, 250, 92, 6, 30, '#5e626c'); R(g, 238, 104, 30, 6, '#5e626c'); R(g, 250, 104, 6, 6, '#3a3d44');
    // the washer, blackened, still round
    const rx = 152, ry = 100; g.strokeStyle = '#0c0808'; g.lineWidth = 8; g.beginPath(); g.ellipse(rx, ry, 10, 7, 0, 0, 6.3); g.stroke(); g.strokeStyle = '#3a2e22'; g.lineWidth = 5; g.stroke(); g.strokeStyle = '#8a6a34'; g.lineWidth = 1; g.beginPath(); g.ellipse(rx, ry - 1, 11, 8, 0, 3.6, 5.2); g.stroke();
    if (Math.sin(t * 1.4) > .93) { R(g, rx - 8, ry - 9, 1, 5, '#ffe9a8'); R(g, rx - 10, ry - 7, 5, 1, '#ffe9a8'); }
    // the invoice
    if (st >= 1) { const a = Math.min(1, s / .6), ox = (Panels.narrow ? 46 : 20) - (1 - a) * 60; g.save(); g.translate(ox + 36, 120); g.rotate(-.12); R(g, -34, -52, 70, 96, '#141010'); R(g, -32, -50, 66, 92, '#e8e0cc'); R(g, -32, -20, 66, 1, '#b8b09c'); R(g, -32, 10, 66, 1, '#b8b09c'); ptext(g, 'COMMITMENT', -27, -44, '#2a2018'); ptext(g, 'FUEL', -27, -36, '#2a2018'); ptext(g, '14 SCRIP', -27, -14, '#c8452e'); ptext(g, 'DEDUCTED', -27, -4, '#2a2018'); ptext(g, 'FROM WAGES', -27, 2, '#2a2018'); ptext(g, 'GRATITUDE', -27, 18, '#7a6a50'); ptext(g, 'IS BREATH', -27, 26, '#7a6a50'); R(g, 6, -42, 20, 20, 'rgba(200,69,46,.25)'); R(g, 12, -36, 8, 8, 'rgba(200,69,46,.5)'); g.restore(); }
    g.restore();
  }
};
let _kb = null; function makeBustCached(id) { if (!_kb) _kb = makeBust(Object.assign(playerLook(), { mouth: 'frown' })); return _kb; }
