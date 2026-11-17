// ============================================================
// assets/ — all art is generated in code (original, no external files)
// ============================================================
const PAL = {
  rock: '#120b0f', rock2: '#1c1217', face: '#4a2c24', face2: '#5a3628', faceD: '#2e1a16', rivet: '#9a6a44',
  floor: '#2a252b', floor2: '#302a31', seam: '#1c171d', grate: '#1a171d', grateL: '#38313b',
  wood: '#3e2a20', wood2: '#4a3226', woodD: '#2a1c16', plaster: '#5a3a32', plaster2: '#6a4638',
  amber: '#ffb35a', cyan: '#4fd6d0', ember: '#ff6a3d', cream: '#f3e3c3', dark: '#0b0709', red: '#c8452e', yellow: '#e8b23a'
};
// ---- 3x5 pixel font for in-canvas labels (E and 8 deliberately distinct)
const GLYPH = {
  A: '111101111101101', B: '110101110101110', C: '111100100100111', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '111100101101111',
  H: '101101111101101', I: '111010010010111', J: '001001001101111', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101',
  O: '111101101101111', P: '111101111100100', Q: '111101101111011', R: '110101110101101', S: '111100111001111', T: '111010010010010', U: '101101101101111',
  V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111',
  0: '010101101101010', 1: '010110010010111', 2: '111001111100111', 3: '111001011001111', 4: '101101111001001', 5: '111100110001110', 6: '011100111101111',
  7: '111001001010010', 8: '111101111101111', 9: '111101111001110', '-': '000000111000000', ':': '000010000010000', '?': '111001011000010', '.': '000000000000010',
  '/': '001001010100100', ' ': '000000000000000', '!': '010010010000010', "'": '010010000000000', '+': '000010111010000', ',': '000000000010100'
};
function ptext(g, str, x, y, col, scale) {
  scale = scale || 1; g.fillStyle = col || PAL.cream; str = String(str).toUpperCase();
  for (let i = 0; i < str.length; i++) { const gl = GLYPH[str[i]] || GLYPH['?']; for (let p = 0; p < 15; p++) if (gl[p] === '1') g.fillRect(x + i * 4 * scale + (p % 3) * scale, y + ((p / 3) | 0) * scale, scale, scale); }
}
const ptextW = (s, sc) => String(s).length * 4 * (sc || 1) - (sc || 1);

function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g]; }
function shade(hex, f) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = n >> 8 & 255, b = n & 255; r = clamp(Math.round(r * f), 0, 255); gg = clamp(Math.round(gg * f), 0, 255); b = clamp(Math.round(b * f), 0, 255); return '#' + ((1 << 24) | (r << 16) | (gg << 8) | b).toString(16).slice(1); }
function outline(c, col, cw, chh) {
  cw = cw || 16; chh = chh || 16;
  const g = c.getContext('2d'), id = g.getImageData(0, 0, c.width, c.height), d = id.data, w = c.width, h = c.height, out = [];
  const n = parseInt(col.slice(1), 16);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (d[(y * w + x) * 4 + 3]) continue;
    const cellX = x % 16, cellY = y % 16;
    const op = (xx, yy) => xx >= 0 && yy >= 0 && xx < w && yy < h && Math.floor(xx / cw) === Math.floor(x / cw) && Math.floor(yy / chh) === Math.floor(y / chh) && d[(yy * w + xx) * 4 + 3] > 0;
    if (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || op(x, y + 1)) out.push(y * w + x);
    void cellX; void cellY;
  }
  for (const i of out) { d[i * 4] = n >> 16; d[i * 4 + 1] = n >> 8 & 255; d[i * 4 + 2] = n & 255; d[i * 4 + 3] = 255; }
  g.putImageData(id, 0, 0);
}

// ---- characters: 4 directions x 3 frames of 16x16, built from parts
// o = {skin, hair, style:short|long|bun|spiky|bald, shirt, pants, shoe, extra, band, kid}
function makeChar(o) {
  const [c, g] = mk(48, 64);
  o = Object.assign({ shoe: '#1e1418', pants: '#2a3440', belt: '#22171a' }, o);
  for (let d = 0; d < 3; d++) for (let f = 0; f < 3; f++) drawChar(g, f * 16, d * 16, d, f, o);
  for (let f = 0; f < 3; f++) { g.save(); g.translate(f * 16 + 16, 48); g.scale(-1, 1); g.drawImage(c, f * 16, 32, 16, 16, 0, 0, 16, 16); g.restore(); }
  outline(c, '#120a0e');
  return c;
}
function drawChar(g, ox, oy, d, f, o) {
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(ox + x, oy + y, w, h); };
  const hy = o.kid ? 2 : 0, ty = 8 + hy, th = o.kid ? 3 : 4, hair = o.hair, skin = o.skin, sh = o.shirt;
  // legs
  if (d < 2) {
    const l = f === 1 ? -1 : 0, r = f === 2 ? -1 : 0;
    R(5, 12 + l, 2, 3, o.pants); R(9, 12 + r, 2, 3, o.pants); R(5, 15 + l, 2, 1, o.shoe); R(9, 15 + r, 2, 1, o.shoe);
  } else {
    if (f === 0) { R(6, 12, 2, 3, o.pants); R(8, 12, 2, 3, o.pants); R(5, 15, 3, 1, o.shoe); R(8, 15, 2, 1, o.shoe); }
    else if (f === 1) { R(4, 12, 2, 3, o.pants); R(9, 12, 2, 2, o.pants); R(3, 15, 3, 1, o.shoe); R(9, 14, 2, 1, o.shoe); }
    else { R(6, 12, 2, 2, o.pants); R(8, 12, 2, 3, o.pants); R(5, 14, 2, 1, o.shoe); R(8, 15, 3, 1, o.shoe); }
  }
  // torso
  if (d < 2) {
    R(4, ty, 8, th + 1, sh); R(4, 11, 8, 1, o.belt);
    const sw = f === 0 ? 0 : 1;
    R(3, ty + (f === 1 ? sw : 0), 1, th, shade(sh, .85)); R(12, ty + (f === 2 ? sw : 0), 1, th, shade(sh, .85));
    R(3, ty + th + (f === 1 ? sw : 0), 1, 1, skin); R(12, ty + th + (f === 2 ? sw : 0), 1, 1, skin);
    if (o.extra === 'coat') { R(7, ty, 2, th + 1, '#aab4b8'); if (d === 0) R(5, ty + 1, 1, 1, '#c8452e'); }
    if (o.extra === 'apron' && d === 0) { R(5, ty + 1, 6, th, '#6a4a34'); }
    if (d === 0 && !o.extra) R(7, ty, 2, 1, shade(sh, 1.25));
  } else {
    R(5, ty, 6, th + 1, sh); R(5, 11, 6, 1, o.belt);
    const ax = f === 1 ? 4 : f === 2 ? 9 : 7; R(ax, ty + 1, 2, th - 1, shade(sh, .8)); R(ax, ty + th, 2, 1, skin);
    if (o.extra === 'coat') R(5, ty, 6, 1, '#aab4b8');
  }
  // head
  const Y = hy;
  if (d === 0) {
    R(5, 3 + Y, 6, 5, skin); R(6, 5 + Y, 1, 1, '#1a1014'); R(9, 5 + Y, 1, 1, '#1a1014'); R(7, 7 + Y, 2, 1, shade(skin, .82));
  } else if (d === 1) {
    R(5, 3 + Y, 6, 5, skin);
  } else {
    R(5, 3 + Y, 6, 5, skin); R(6, 5 + Y, 1, 1, '#1a1014'); R(4, 5 + Y, 1, 1, skin); R(6, 7 + Y, 1, 1, shade(skin, .82));
  }
  // hair
  const st = o.style;
  if (st === 'bald') {
    if (d === 0) { R(4, 4 + Y, 1, 2, hair); R(11, 4 + Y, 1, 2, hair); }
    else if (d === 1) { R(5, 5 + Y, 6, 3, hair); }
    else { R(9, 4 + Y, 2, 3, hair); }
  } else if (d === 0) {
    R(5, 1 + Y, 6, 1, hair); R(4, 2 + Y, 8, 2, hair); R(4, 4 + Y, 1, 2, hair); R(11, 4 + Y, 1, 2, hair);
    if (st === 'long') { R(4, 6 + Y, 1, 4, hair); R(11, 6 + Y, 1, 4, hair); }
    if (st === 'bun') R(6, 0 + Y, 4, 1, hair);
    if (st === 'spiky') { R(5, 0 + Y, 1, 1, hair); R(8, 0 + Y, 1, 1, hair); R(10, 0 + Y, 1, 1, hair); R(6, 4 + Y, 1, 1, hair); }
  } else if (d === 1) {
    R(5, 1 + Y, 6, 1, hair); R(4, 2 + Y, 8, 6, hair);
    if (st === 'long') R(4, 8 + Y, 8, 2, hair);
    if (st === 'bun') { R(6, 0 + Y, 4, 1, hair); R(6, 3 + Y, 4, 2, shade(hair, 1.2)); }
    if (st === 'spiky') { R(5, 0 + Y, 1, 1, hair); R(8, 0 + Y, 1, 1, hair); R(10, 0 + Y, 1, 1, hair); }
  } else {
    R(5, 1 + Y, 6, 2, hair); R(8, 3 + Y, 3, 3, hair); R(5, 3 + Y, 1, 1, hair);
    if (st === 'long') R(9, 6 + Y, 2, 4, hair);
    if (st === 'bun') R(10, 1 + Y, 2, 2, hair);
    if (st === 'spiky') { R(6, 0 + Y, 1, 1, hair); R(9, 0 + Y, 1, 1, hair); R(11, 2 + Y, 1, 1, hair); }
  }
  // extras
  if (o.extra === 'goggles') { if (d === 0) { R(5, 3 + Y, 6, 1, '#2a6a6a'); R(6, 3 + Y, 1, 1, PAL.cyan); R(9, 3 + Y, 1, 1, PAL.cyan); } else if (d === 1) R(4, 3 + Y, 8, 1, '#2a6a6a'); else { R(5, 3 + Y, 4, 1, '#2a6a6a'); R(5, 3 + Y, 1, 1, PAL.cyan); } }
  if (o.band) { if (d === 0) R(4, 2 + Y, 8, 1, o.band); else if (d === 1) R(4, 3 + Y, 8, 1, o.band); else R(5, 2 + Y, 6, 1, o.band); }
  if (o.extra === 'beard') { if (d === 0) { R(5, 6 + Y, 6, 2, '#d8d0c0'); R(6, 8 + Y, 4, 1, '#d8d0c0'); } else if (d > 1) R(5, 6 + Y, 3, 2, '#d8d0c0'); }
  if (o.scarf) { if (d < 2) { R(4, ty, 8, 1, o.scarf); if (d === 0) R(9, ty + 1, 1, 2, o.scarf); } else R(5, ty, 6, 1, o.scarf); }
  if (o.extra === 'pin' && d === 0) { R(5, ty + 1, 1, 1, '#e8e8f0'); R(4, ty, 8, 1, shade(sh, .8)); }
  if (!o.clean) { const s1 = shade(skin, .62), s2 = shade(sh, .6); // soot: the Cinders never wash off
    if (d === 0) { R(9, 6 + Y, 1, 1, s1); R(5, 4 + Y, 1, 1, s1); R(6, ty + 2, 1, 1, s2); R(10, ty + 1, 1, 1, s2); }
    else if (d === 2) { R(7, 6 + Y, 1, 1, s1); R(6, ty + 2, 1, 1, s2); }
    else R(7, ty + 2, 1, 1, s2); }
  if (o.extra === 'hat') { if (d === 0 || d === 1) { R(4, 0 + Y, 8, 3, PAL.yellow); R(3, 3 + Y, 10, 1, '#b88a22'); } else { R(4, 0 + Y, 7, 3, PAL.yellow); R(3, 3 + Y, 9, 1, '#b88a22'); } }
}
// ---- the Accredited: tall (16x24), pristine, luminous. No soot.
function makeAccredited(o) {
  const [c, g] = mk(48, 96);
  for (let d = 0; d < 3; d++) for (let f = 0; f < 3; f++) {
    const ox = f * 16, oy = d * 24, R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(ox + x, oy + y, w, h); };
    const sway = f === 1 ? -1 : f === 2 ? 1 : 0, robe = o.robe, trim = o.trim, sk = o.skin;
    // robe: long, widening to the floor
    for (let y = 9; y < 24; y++) { const w = 6 + Math.floor((y - 9) / 3), x0 = 8 - Math.floor(w / 2) + (y > 18 ? sway : 0); R(x0, y, w, 1, y === 23 ? trim : robe); }
    if (d === 0) { R(7, 10, 2, 13, trim); R(4, 9, 8, 1, trim); R(4, 8, 2, 2, trim); R(10, 8, 2, 2, trim); R(3, 12, 1, 6, robe); R(12, 12, 1, 6, robe); R(3, 18, 1, 1, sk); R(12, 18, 1, 1, sk); }
    else if (d === 1) { R(5, 9, 6, 1, trim); }
    else { R(5, 9, 5, 1, trim); R(4, 8, 2, 2, trim); R(7, 12, 2, 6, shade(robe, .9)); R(7, 18, 2, 1, sk); }
    if (o.warden) {
      R(5, 1, 6, 7, '#d8dce4'); R(5, 1, 6, 1, '#f4f6fa'); if (d === 0) { R(6, 4, 4, 1, trim); R(3, 9, 2, 3, '#e8ecf2'); R(11, 9, 2, 3, '#e8ecf2'); } else if (d > 1) R(5, 4, 2, 1, trim);
      R(d === 2 ? 2 : 13, 0, 1, 24, '#b8bcc8'); R(d === 2 ? 1 : 12, 0, 3, 2, trim); R(d === 2 ? 2 : 13, -1, 1, 1, '#fff');
    } else {
      // head, long pale hair, circlet
      if (d === 1) { R(5, 2, 6, 7, o.hair); R(4, 4, 8, 9, o.hair); }
      else if (d === 0) { R(4, 2, 8, 3, o.hair); R(4, 5, 1, 8, o.hair); R(11, 5, 1, 8, o.hair); R(5, 3, 6, 6, sk); R(5, 2, 6, 1, o.hair);
        R(6, 5, 1, 1, '#c89a2a'); R(9, 5, 1, 1, '#c89a2a'); R(7, 7, 2, 1, shade(sk, .9)); }
      else { R(5, 3, 6, 6, sk); R(5, 2, 6, 2, o.hair); R(8, 3, 3, 10, o.hair); R(6, 5, 1, 1, '#c89a2a'); }
      if (o.crown) { R(4, 1, 8, 1, trim); R(7, 0, 2, 1, trim); R(7, 1, 2, 1, '#ffffff'); }
    }
  }
  for (let f = 0; f < 3; f++) { g.save(); g.translate(f * 16 + 16, 72); g.scale(-1, 1); g.drawImage(c, f * 16, 48, 16, 24, 0, 0, 16, 24); g.restore(); }
  outline(c, '#3a2e1a', 16, 24);
  c.fh = 24; c.glow = 1; return c;
}
// ---- dialogue portraits: 32x32 busts built from the same look data
function makeBust(o) {
  const [c, g] = mk(32, 32), [f, h] = mk(32, 32);
  const R = (x, y, w, hh, col) => { h.fillStyle = col; h.fillRect(x, y, w, hh); };
  const acc = o.accredited, dy = o.kid ? 3 : 0, skin = o.skin, sk2 = shade(skin, .8), sk3 = shade(skin, 1.12), hair = o.hair;
  // background
  if (acc) { const gr = g.createRadialGradient(16, 14, 2, 16, 14, 22); gr.addColorStop(0, '#fff4c8'); gr.addColorStop(.5, '#c8a050'); gr.addColorStop(1, '#4a3418'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); }
  else { g.fillStyle = '#21161a'; g.fillRect(0, 0, 32, 32); g.fillStyle = '#2c1e1e'; g.fillRect(0, 20, 32, 12); for (let i = 0; i < 9; i++) { g.fillStyle = '#3a2a26'; g.fillRect((i * 7) % 31, (i * 11) % 30, 1, 1); } }
  // torso
  const shirt = acc ? o.robe : o.shirt;
  for (let y = 24; y < 32; y++) { const w = 14 + (y - 24) * 2; R(16 - w / 2, y, w, 1, shirt); }
  if (acc) { R(10, 24, 12, 2, o.trim); R(15, 26, 2, 6, o.trim); R(9, 23, 3, 3, o.trim); R(20, 23, 3, 3, o.trim); }
  else R(12, 24, 8, 1, shade(shirt, .7));
  if (o.extra === 'apron') R(11, 27, 10, 5, '#6a4a34');
  if (o.extra === 'coat') { R(9, 25, 4, 7, '#c8ccc8'); R(19, 25, 4, 7, '#c8ccc8'); R(14, 27, 1, 1, '#c8452e'); }
  if (o.extra === 'pin') { R(10, 27, 2, 1, '#e8e8f0'); R(9, 24, 14, 1, shade(shirt, .8)); }
  if (o.scarf) { R(10, 22, 12, 3, o.scarf); R(18, 25, 3, 4, shade(o.scarf, .85)); }
  if (o.warden) { R(5, 25, 7, 4, '#e8ecf2'); R(20, 25, 7, 4, '#e8ecf2'); R(5, 25, 7, 1, o.trim); R(20, 25, 7, 1, o.trim); }
  // neck + head
  R(13, 19 + dy, 6, 6, sk2);
  const rows = [[11, 10], [9, 14], [8, 16], [8, 16], [7, 18], [7, 18], [7, 18], [7, 18], [7, 18], [7, 18], [8, 16], [8, 16], [9, 14], [10, 12], [11, 10], [12, 8]];
  rows.forEach(([x, w], i) => { R(x, 6 + i + dy, w, 1, skin); R(x + w - 2, 6 + i + dy, 2, 1, sk2); });
  R(6, 13 + dy, 1, 3, sk2); R(25, 13 + dy, 1, 3, sk2);
  // face
  const eye = acc ? '#d8a830' : (o.eye || '#3a2a20'), brow = acc ? shade(hair, .8) : shade(hair, .7);
  R(10, 13 + dy, 4, 2, '#e8e0d8'); R(18, 13 + dy, 4, 2, '#e8e0d8'); R(12, 13 + dy, 2, 2, eye); R(20, 13 + dy, 2, 2, eye);
  if (acc) { R(12, 13 + dy, 1, 1, '#fff6c0'); R(20, 13 + dy, 1, 1, '#fff6c0'); }
  const mood = o.mouth || 'flat';
  if (mood === 'frown') { R(10, 11 + dy, 4, 1, brow); R(18, 11 + dy, 4, 1, brow); R(13, 11 + dy, 1, 1, brow); R(18, 11 + dy, 1, 1, brow); } else { R(10, 11 + dy, 4, 1, brow); R(18, 11 + dy, 4, 1, brow); }
  R(15, 15 + dy, 1, 2, sk2); R(16, 17 + dy, 1, 1, sk2);
  const M = acc ? '#b8706a' : '#7a3a34';
  if (mood === 'smile') { R(13, 19 + dy, 6, 1, M); R(12, 18 + dy, 1, 1, M); R(19, 18 + dy, 1, 1, M); }
  else if (mood === 'smirk') { R(14, 19 + dy, 5, 1, M); R(19, 18 + dy, 1, 1, M); }
  else if (mood === 'frown') { R(13, 19 + dy, 6, 1, M); R(12, 20 + dy, 1, 1, M); R(19, 20 + dy, 1, 1, M); }
  else R(13, 19 + dy, 6, 1, M);
  if (acc) { R(9, 16 + dy, 2, 1, '#f0c8c0'); R(21, 16 + dy, 2, 1, '#f0c8c0'); }
  if (!acc && !o.clean) { const s1 = shade(skin, .58); R(9, 16 + dy, 2, 1, s1); R(21, 9 + dy, 1, 2, s1); R(19, 17 + dy, 2, 1, s1); R(11, 23, 2, 1, shade(shirt, .5)); }
  if (o.scar) { R(21, 14 + dy, 1, 5, '#c87a6a'); R(22, 16 + dy, 1, 1, '#c87a6a'); }
  if (o.extra === 'beard') { R(9, 17 + dy, 14, 6, '#d8d0c0'); R(11, 23 + dy, 10, 1, '#d8d0c0'); R(13, 19 + dy, 6, 1, '#8a6a5a'); }
  // hair
  const st = o.style;
  if (st === 'bald') { R(7, 10 + dy, 2, 4, hair); R(23, 10 + dy, 2, 4, hair); R(12, 7 + dy, 4, 1, sk3); }
  else {
    R(9, 4 + dy, 14, 2, hair); R(7, 6 + dy, 18, 3, hair); R(7, 9 + dy, 2, 4, hair); R(23, 9 + dy, 2, 4, hair);
    if (st === 'short') R(9, 9 + dy, 7, 1, hair);
    if (st === 'long') { R(6, 8 + dy, 3, acc ? 20 : 17, hair); R(23, 8 + dy, 3, acc ? 20 : 17, hair); R(9, 9 + dy, 4, 1, hair); }
    if (st === 'bun') { R(12, 1 + dy, 8, 4, hair); R(13, 0 + dy, 6, 1, hair); }
    if (st === 'spiky') { R(8, 2 + dy, 2, 2, hair); R(12, 1 + dy, 2, 3, hair); R(17, 1 + dy, 2, 3, hair); R(21, 2 + dy, 2, 2, hair); R(9, 9 + dy, 2, 2, hair); R(13, 9 + dy, 2, 1, hair); R(18, 9 + dy, 3, 2, hair); }
    R(10, 5 + dy, 5, 1, shade(hair, 1.25));
  }
  if (o.extra === 'goggles') { R(7, 8 + dy, 18, 2, '#2a5a5a'); R(9, 7 + dy, 5, 3, '#4fd6d0'); R(18, 7 + dy, 5, 3, '#4fd6d0'); R(10, 7 + dy, 1, 1, '#d8ffff'); R(19, 7 + dy, 1, 1, '#d8ffff'); }
  if (o.band) R(7, 8 + dy, 18, 1, o.band);
  if (o.extra === 'hat') { R(6, 2 + dy, 20, 6, o.clean ? '#4a4e58' : PAL.yellow); R(4, 8 + dy, 24, 1, o.clean ? '#2a2c32' : '#b88a22'); if (o.clean) R(14, 4 + dy, 4, 2, '#c8ccd4'); }
  if (o.crown) { R(8, 4 + dy, 16, 1, o.trim); R(14, 2 + dy, 4, 2, o.trim); R(15, 2 + dy, 2, 1, '#ffffff'); }
  if (o.warden) { R(7, 4, 18, 19, '#d8dce4'); R(7, 4, 18, 2, '#f4f6fa'); R(9, 13, 14, 2, '#1a1a20'); R(9, 13, 14, 1, o.trim); R(15, 15, 2, 6, '#c8ccd4'); }
  outline(f, '#0c0608', 32, 32); g.drawImage(f, 0, 0); return c;
}
function portraitTo(cv, sheet) { const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.clearRect(0, 0, cv.width, cv.height); g.fillStyle = '#2a1a1a'; g.fillRect(0, 0, 48, 48); g.drawImage(sheet, 1, 0, 14, 13, 3, 6, 42, 39); }

// ---- tiles
const SOLID = new Set(['#', 'x', 'N']);
const isWall = ch => ch === '#' || ch === 'N';
function drawTile(g, m, tx, ty) {
  const ch = m.grid[ty][tx], x = tx * 16, y = ty * 16, r = hash(tx + m.seed, ty), R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  const below = ty + 1 < m.h ? m.grid[ty + 1][tx] : '#';
  const home = m.theme === 'home', clinic = m.theme === 'clinic';
  if (isWall(ch)) {
    if (!isWall(below) && below !== undefined) { // wall face
      const f = clinic ? '#5e6e68' : home ? PAL.plaster : (r < .5 ? PAL.face : PAL.face2);
      R(0, 0, 16, 16, f);
      if (clinic) { R(0, 8, 16, 5, '#7a8a82'); R(0, 8, 16, 1, '#90a098'); if (r > .6) R(r * 12 | 0, 2, 1, 5, '#4a5852'); }
      if (clinic) { } else if (home) { for (let i = 0; i < 16; i += 4) R(i + 1, 0, 1, 13, PAL.plaster2); R(0, 11, 16, 2, '#3a241e'); }
      else { R(0, 4, 16, 1, PAL.faceD); R(0, 0, 1, 16, PAL.faceD); R(2, 1, 1, 1, PAL.rivet); R(13, 1, 1, 1, PAL.rivet); R(2, 6, 1, 1, PAL.rivet); R(13, 6, 1, 1, PAL.rivet);
        if (r > .7) { R(5 + (r * 7 | 0), 5, 1, 6, '#6a3a22'); R(5 + (r * 7 | 0), 11, 1, 1, '#7a4428'); } }
      R(0, 13, 16, 3, '#1a0f0f');
    } else { R(0, 0, 16, 16, PAL.rock); if (r > .6) R(r * 13 | 0, (r * 97 % 13) | 0, 2, 1, PAL.rock2); if (r < .2) R(3, 9, 1, 1, PAL.rock2); }
    return;
  }
  if (clinic) { R(0, 0, 16, 16, (tx + ty) % 2 ? '#3c4442' : '#444e4b'); R(0, 0, 16, 1, '#323a38'); R(0, 0, 1, 16, '#323a38'); if (r > .8) R(4 + (r * 50 | 0) % 8, 9, 3, 1, '#2e3533'); }
  else if (home) { // wooden floor
    R(0, 0, 16, 16, PAL.wood);
    for (let i = 0; i < 4; i++) { R(0, i * 4 + 3, 16, 1, PAL.woodD); const o = ((hash(tx, ty * 4 + i) * 16) | 0); R(o, i * 4, 1, 3, PAL.woodD); if (hash(tx * 3, ty + i) > .7) R((o + 5) % 16, i * 4 + 1, 3, 1, PAL.wood2); }
  } else if (ch === ',') {
    R(0, 0, 16, 16, PAL.grate); for (let i = 1; i < 16; i += 3) R(0, i, 16, 1, PAL.grateL); R(0, 0, 1, 16, '#101014'); R(15, 0, 1, 16, '#101014');
  } else {
    R(0, 0, 16, 16, r < .5 ? PAL.floor : PAL.floor2); R(15, 0, 1, 16, PAL.seam); R(0, 15, 16, 1, PAL.seam);
    if (r > .55) { R(1, 1, 1, 1, '#4a4248'); R(13, 13, 1, 1, '#4a4248'); }
    if (r < .15) R(4 + (r * 40 | 0), 7, 3, 1, '#3a3438');
  }
  if (ch === 'D' || ch === 'E') { // exits: dark threshold mat
    R(1, 0, 14, 16, '#0e0a0c'); R(2, 2, 12, 12, '#1a1215');
  }
}
// ---- props (drawn into static layer); px coords from tile coords
const PROPS = {
  bed(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 2, 32, 30, PAL.woodD); R(2, 3, 28, 26, '#b8a890'); R(4, 4, 12, 7, PAL.cream); R(2, 13, 28, 16, '#2e5a5e'); for (let i = 0; i < 28; i += 4) R(2 + i, 15, 2, 12, '#356a6c'); R(0, 29, 32, 3, '#1a100c'); },
  table(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 4, 30, 9, PAL.wood2); R(1, 4, 30, 2, '#6a4a34'); R(3, 13, 2, 3, PAL.woodD); R(27, 13, 2, 3, PAL.woodD); R(6, 1, 4, 5, '#c8b898'); R(6, 1, 4, 1, '#3a2a20'); R(17, 5, 9, 6, '#d8d0c0'); R(18, 6, 6, 1, '#6a6a6a'); R(18, 8, 5, 1, '#6a6a6a'); },
  rug(g, x, y, w, h) { g.fillStyle = '#5a2e24'; g.fillRect(x + 2, y + 2, w * 16 - 4, h * 16 - 4); g.fillStyle = '#7a4430'; g.fillRect(x + 4, y + 4, w * 16 - 8, h * 16 - 8); g.fillStyle = '#5a2e24'; for (let i = 6; i < w * 16 - 6; i += 6) g.fillRect(x + i, y + 6, 2, h * 16 - 12); },
  mural(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(2, 1, 28, 10, '#3a2a3a'); R(12, 3, 8, 7, '#e8a040'); R(13, 2, 6, 1, '#e8a040'); R(14, 4, 4, 4, '#ffd070'); for (const [a, b] of [[8, 4], [22, 4], [9, 8], [21, 8], [15, 1]]) R(a, b, 2, 1, '#e8a040'); R(3, 9, 26, 2, '#6a5a3a'); R(25, 1, 5, 4, PAL.plaster); R(2, 7, 3, 4, PAL.plaster); },
  shelf(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 3, 14, 1, PAL.woodD); R(1, 8, 14, 1, PAL.woodD); R(2, 0, 3, 3, '#8a7a5a'); R(6, 1, 3, 2, '#8a7a5a'); R(10, 0, 4, 3, '#5a7a5a'); R(2, 5, 4, 3, '#c8a050'); R(8, 4, 3, 4, '#a85030'); },
  radio(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(2, 3, 12, 8, '#3a2a24'); R(3, 4, 6, 6, '#2a1c18'); for (let i = 0; i < 6; i += 2) R(3, 4 + i, 6, 1, '#4a3a30'); R(10, 5, 3, 2, PAL.amber); R(11, 0, 1, 3, '#888'); },
  door(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 0, 14, 16, '#5a3a2a'); R(3, 2, 10, 14, '#2a1a14'); R(11, 9, 1, 1, PAL.amber); },
  board(g, x, y, w) { w = (w || 1) * 16; const R = (a, b, ww, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, h); }; R(1, 1, w - 2, 11, '#6a4a2a'); R(2, 2, w - 4, 9, '#8a6a3a'); const cols = ['#d8d0c0', '#c8b080', '#e0c8a0', '#b8c0c8']; for (let i = 0; i < w / 6 - 1; i++) { R(3 + i * 6, 3 + (i % 2), 5, 6, cols[i % 4]); R(4 + i * 6, 5 + (i % 2), 3, 1, '#555'); R(5 + i * 6, 3 + (i % 2), 1, 1, PAL.red); } },
  liftgate(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 0, 32, 16, '#3a3a40'); R(2, 3, 28, 13, '#141418'); for (let i = 3; i < 30; i += 3) R(i, 3, 1, 13, '#5a5a62'); R(2, 3, 28, 1, '#6a6a72'); R(8, 0, 16, 3, '#8a7a5a'); ptext(g, 'LIFT 0', x + 10, y + 1 - 1, '#2a2018'); R(28, 6, 2, 2, '#1a2a1a'); },
  clinic(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 0, 14, 16, '#6a7078'); R(3, 3, 10, 13, '#2a3038'); R(6, 0, 4, 3, '#d8dcd8'); R(7, 0, 2, 3, PAL.red); R(6, 1, 4, 1, PAL.red); },
  valves(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 0, 48, 14, '#2a3038'); R(1, 1, 46, 12, '#3a4450'); for (let i = 0; i < 3; i++) { const cx = 8 + i * 16; R(cx - 4, 3, 8, 7, '#1a1e24'); R(cx - 3, 4, 6, 5, '#d8dcd0'); R(cx, 5, 1, 3, PAL.red); } R(0, 12, 48, 2, '#5a6470'); ptext(g, 'BANK 7', x + 13, y - 5 + 4, '#9ab'); },
  freight(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 0, 32, 16, '#1a1a1e'); for (let i = 0; i < 32; i += 4) { R(i, 0, 2, 3, PAL.yellow); R(i + 2, 0, 2, 3, '#1a1a1e'); } R(3, 3, 13, 13, '#4a4e56'); R(16, 3, 13, 13, '#444850'); R(15, 3, 2, 13, '#222'); R(29, 4, 2, 2, PAL.red); },
  furnace(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 0, 32, 16, '#2a1a14'); R(3, 3, 26, 11, '#3a1a10'); for (let i = 5; i < 28; i += 4) R(i, 3, 2, 11, '#1a0c08'); },
  pipes(g, x, y, w) { w = w * 16; const R = (a, b, ww, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, h); }; R(0, 2, w, 4, '#6a4a3a'); R(0, 2, w, 1, '#8a6a4a'); R(0, 8, w, 3, '#4a5a5a'); R(0, 8, w, 1, '#6a7a7a'); for (let i = 6; i < w; i += 22) { R(i, 1, 3, 6, '#3a2a24'); R(i + 9, 7, 2, 5, '#2a3434'); } },
  bench(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 5, 30, 4, PAL.wood2); R(1, 5, 30, 1, '#6a4a34'); R(1, 1, 30, 3, PAL.wood); R(3, 9, 2, 6, '#3a3038'); R(27, 9, 2, 6, '#3a3038'); },
  cart(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 6, 14, 7, '#5a4a3a'); R(2, 2, 4, 5, '#7a8a8a'); R(7, 1, 5, 6, '#8a6a4a'); R(10, 3, 4, 4, '#6a7a5a'); R(2, 13, 3, 3, '#222'); R(11, 13, 3, 3, '#222'); },
  crate(g, x, y, cold) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 2, 14, 13, '#6a4a2a'); R(1, 2, 14, 1, '#8a6a3a'); R(1, 7, 14, 1, '#4a3018'); R(1, 2, 1, 13, '#4a3018'); R(14, 2, 1, 13, '#4a3018'); R(4, 9, 8, 4, '#c8b080'); R(5, 10, 6, 1, '#555'); if (cold) { R(2, 3, 2, 1, '#cfe8ee'); R(12, 13, 2, 1, '#cfe8ee'); R(13, 4, 1, 1, '#cfe8ee'); R(3, 14, 1, 1, '#cfe8ee'); } },
  conveyor(g, x, y, w) { g.fillStyle = '#2a2a30'; g.fillRect(x, y + 3, w * 16, 11); g.fillStyle = '#3a3a42'; g.fillRect(x, y + 3, w * 16, 2); g.fillStyle = '#5a5a62'; for (let i = 0; i < w * 16; i += 16) g.fillRect(x + i + 7, y + 13, 2, 3); },
  barrel(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(3, 2, 10, 13, '#5a6a4a'); R(3, 4, 10, 1, '#3a4a2a'); R(3, 11, 10, 1, '#3a4a2a'); R(4, 2, 8, 1, '#7a8a6a'); },
  stall(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 2, 48, 12, '#5a3424'); R(0, 2, 48, 2, '#7a4a30'); R(4, 5, 8, 6, '#2a2a2a'); R(5, 4, 6, 2, '#888'); R(20, 6, 6, 4, '#d8d0c0'); R(30, 6, 6, 4, '#d8d0c0'); R(40, 5, 4, 6, PAL.red); },
  awning(g, x, y) { for (let i = 0; i < 48; i += 8) { g.fillStyle = PAL.red; g.fillRect(x + i, y + 8, 4, 8); g.fillStyle = PAL.cream; g.fillRect(x + i + 4, y + 8, 4, 8); } g.fillStyle = '#3a2018'; g.fillRect(x, y + 6, 48, 2); ptext(g, 'NOODLES', x + 11, y + 0, PAL.amber); },
  pillarBase(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 8, 14, 8, '#3a3038'); R(2, 8, 12, 2, '#5a5058'); R(4, 12, 1, 1, '#ddd'); R(6, 13, 3, 1, '#ddd'); R(10, 12, 1, 1, '#ddd'); },
  lampBase(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(5, 12, 6, 4, '#2a2a30'); R(7, -10, 2, 22, '#3a3a40'); },
  hazard(g, x, y, w, h) { for (let i = 0; i < w * 16; i += 6) { g.fillStyle = PAL.yellow; g.fillRect(x + i, y + h * 16 - 3, 3, 3); g.fillRect(x + i, y, 3, 2); } },
  dock(g, x, y, w) { g.fillStyle = '#5a5040'; g.fillRect(x, y + 14, w * 16, 2); g.fillStyle = PAL.yellow; for (let i = 0; i < w * 16; i += 8) g.fillRect(x + i, y + 14, 4, 2); },
  hatch(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 1, 14, 14, '#3a3e46'); R(2, 2, 12, 12, '#4a505a'); for (let i = 3; i < 13; i += 3) R(3, i, 10, 1, '#3a3e46'); R(6, 6, 4, 4, '#2a2e34'); R(7, 7, 2, 2, PAL.yellow); R(14, 0, 2, 16, '#4a5a5a'); R(14, 0, 1, 16, '#6a7a7a'); },
  sealdoor(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 0, 16, 16, '#2a2e34'); R(2, 2, 12, 14, '#3a3e46'); R(2, 8, 12, 2, '#c8c0a0'); R(7, 2, 2, 14, '#c8c0a0'); for (let i = 3; i < 14; i += 3) { R(i, 0, 2, 2, PAL.yellow); } },
  chalk(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(7, 1, 1, 7, '#d8d0c0'); R(5, 3, 1, 1, '#d8d0c0'); R(6, 2, 1, 1, '#d8d0c0'); R(8, 2, 1, 1, '#d8d0c0'); R(9, 3, 1, 1, '#d8d0c0'); R(3, 9, 10, 1, '#f0ece0'); R(4, 11, 7, 1, '#f0ece0'); },
  stencil(g, x, y) { ptext(g, 'AUX-9', x - 1, y + 7, PAL.amber); },
  riser(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(4, 0, 24, 16, '#2a2e34'); R(6, 0, 20, 16, '#4a4e56'); R(6, 0, 3, 16, '#6a6e76'); for (let i = 2; i < 16; i += 5) R(4, i, 24, 1, '#22262c'); R(9, 9, 14, 6, '#1a1a1e'); for (let i = 10; i < 23; i += 2) R(i, 9, 1, 6, '#5a5e66'); R(11, 3, 10, 4, '#8a7a5a'); R(12, 4, 8, 2, '#5a4a3a'); },
  ladder(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(3, -12, 2, 30, '#6a6a72'); R(11, -12, 2, 30, '#6a6a72'); for (let i = -10; i < 16; i += 4) R(3, i, 10, 1, '#8a8a92'); },
  rubble(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; const r = rng(x * 7 + y); for (let i = 0; i < 26; i++) { const a = r() * 28 | 0, b = r() * 26 | 0, w = 3 + r() * 6 | 0; R(a, b + 4, w, w - 1, ['#3a2c2a', '#4a3a34', '#2a201e', '#5a4a40'][i % 4]); } R(26, 4, 5, 9, '#4a3a34'); R(27, 2, 3, 2, '#5a4a40'); R(10, 18, 5, 3, '#a87a3a'); },
  cagelamp(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(5, 4, 6, 6, '#3a3a40'); R(6, 5, 4, 4, '#ffd890'); R(5, 6, 6, 1, '#3a3a40'); R(7, 4, 1, 6, '#3a3a40'); },
  screen(g, x, y, w) { w = (w || 3) * 16; const R = (a, b, ww, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, h); }; R(0, 0, w, 14, '#16181e'); R(1, 1, w - 2, 12, '#20242c'); R(2, 2, w - 4, 10, '#0a1418'); R(w / 2 - 2, 13, 4, 3, '#2a2c34'); },
  poster(g, x, y, a) { const R = (aa, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + aa, y + b, w, h); }; const T = [['GRATITUDE', 'IS BREATH'], ['REPORT AIR', 'THEFT: 50'], ['COMMITTED', 'S.HOLLOWAY'], ['THE SURFACE', 'BURNS'], ['WORK IS', 'WORSHIP']][a | 0];
    R(1, 0, 30, 13, a === 2 ? '#c8c0a8' : '#d8ccb0'); R(1, 0, 30, 2, a === 2 ? '#8a1a10' : '#b8902a'); ptext(g, T[0], x + 16 - ptextW(T[0]) / 2, y + 3, '#2a1a10'); ptext(g, T[1], x + 16 - ptextW(T[1]) / 2, y + 8, a === 2 ? '#8a1a10' : '#5a3a10');
    R(3 + (a * 7) % 20, 11, 6, 2, '#9a8a70'); R(24, 1, 6, 3, '#b8a888'); if (a === 2) { R(5, 3, 1, 1, '#2a1a10'); } },
  vent(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(2, 3, 12, 10, '#18161a'); for (let i = 4; i < 13; i += 2) R(3, i, 10, 1, '#3a363c'); R(2, 3, 12, 1, '#4a464c'); },
  puddle(g, x, y) { g.fillStyle = 'rgba(20,30,40,.55)'; g.fillRect(x + 2, y + 6, 12, 5); g.fillRect(x + 4, y + 5, 8, 7); g.fillStyle = 'rgba(120,140,160,.25)'; g.fillRect(x + 5, y + 7, 3, 1); },
  oil(g, x, y) { g.fillStyle = 'rgba(10,8,12,.7)'; g.fillRect(x + 1, y + 5, 14, 6); g.fillRect(x + 4, y + 4, 8, 8); g.fillStyle = 'rgba(90,60,120,.35)'; g.fillRect(x + 5, y + 6, 4, 1); },
  suns(g, x, y) { const sun = (cx, cy, r, col) => { g.fillStyle = col; g.fillRect(x + cx - r, y + cy - r + 1, r * 2, r * 2 - 2); g.fillRect(x + cx - r + 1, y + cy - r, r * 2 - 2, r * 2); g.fillRect(x + cx - r - 2, y + cy, 1, 1); g.fillRect(x + cx + r + 1, y + cy, 1, 1); g.fillRect(x + cx, y + cy - r - 2, 1, 1); }; sun(5, 5, 2, '#e8a040'); sun(11, 8, 1, '#ffd070'); },
  cot(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 2, 14, 13, '#6a6e72'); R(2, 3, 12, 11, '#c8ccc4'); R(2, 3, 12, 4, '#e8ece4'); R(2, 8, 12, 6, '#5a7a8a'); R(1, 15, 2, 1, '#333'); R(13, 15, 2, 1, '#333'); },
  canisters(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; for (let i = 0; i < 3; i++) { R(1 + i * 5, 3, 4, 12, '#5a7a6a'); R(1 + i * 5, 3, 4, 1, '#8aaa9a'); R(2 + i * 5, 1, 2, 2, '#888'); R(1 + i * 5, 8, 4, 1, PAL.red); } },
  relay(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(2, 1, 12, 14, '#3a3e46'); R(3, 2, 10, 12, '#2a2e34'); R(5, 4, 6, 3, '#1a1e24'); R(6, 5, 1, 1, PAL.red); R(9, 5, 1, 1, PAL.cyan); for (let i = 9; i < 13; i += 2) R(5, i, 6, 1, '#4a4e56'); R(7, -4, 2, 5, '#4a5a5a'); },
  fanvent(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 1, 14, 12, '#3a4440'); R(2, 2, 12, 10, '#1a201e'); },
  tools(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 2, 14, 1, PAL.woodD); R(3, 3, 2, 7, '#8a8a92'); R(2, 3, 4, 2, '#8a8a92'); R(8, 3, 1, 8, '#6a4a2a'); R(7, 3, 3, 2, '#9a9aa2'); R(12, 3, 2, 6, '#aa6a3a'); },
  label(g, x, y, t) { ptext(g, t, x + 8 - ptextW(t) / 2, y + 10, '#2a1a10'); }
};
function renderMapLayer(m) {
  const [c, g] = mk(m.w * 16, m.h * 16);
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) drawTile(g, m, x, y);
  for (const p of m.props) { const fn = PROPS[p.t]; if (fn) fn(g, p.x * 16, p.y * 16, p.w || p.a, p.h); }
  return c;
}
