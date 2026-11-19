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

// ---- characters: 4 directions x 3 frames of 16x20, built from parts and shaded in three tones
// o = {skin, hair, style:short|long|bun|spiky|bald, shirt, pants, shoe, extra, band, kid, scarf, clean}
const CH = 20;
function makeChar(o) {
  const [c, g] = mk(64, CH * 4); // frames: stand, step, step, blink
  o = Object.assign({ shoe: '#1e1418', pants: '#2a3440', belt: '#22171a' }, o);
  for (let d = 0; d < 3; d++) for (let f = 0; f < 4; f++) drawChar(g, f * 16, d * CH, d, f === 3 ? 0 : f, o, f === 3);
  for (let f = 0; f < 4; f++) { g.save(); g.translate(f * 16 + 16, CH * 3); g.scale(-1, 1); g.drawImage(c, f * 16, CH * 2, 16, CH, 0, 0, 16, CH); g.restore(); }
  outline(c, '#120a0e', 16, CH);
  c.fh = CH; return c;
}
function drawChar(g, ox, oy, d, f, o, blink) {
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(ox + x, oy + y, w, h); };
  const Y = o.kid ? 3 : 0, ty = 9 + Y, th = o.kid ? 4 : 6, ly = ty + th, ll = 18 - ly;
  const hair = o.hair, hairL = shade(hair, 1.35), hairD = shade(hair, .72), skin = o.skin, skinD = shade(skin, .8), skinL = shade(skin, 1.1);
  const sh = o.shirt, shD = shade(sh, .76), shL = shade(sh, 1.22), pa = o.pants, paD = shade(pa, .74), paL = shade(pa, 1.2), shoe = o.shoe, shoeL = shade(shoe, 1.7);
  // ---- legs and boots
  if (d < 2) {
    const l = f === 1 ? -1 : 0, r = f === 2 ? -1 : 0;
    R(5, ly, 3, ll + l, pa); R(8, ly, 3, ll + r, pa); R(7, ly + 1, 1, ll - 1 + l, paD); R(10, ly, 1, ll + r, paD); R(5, ly, 1, ll + l, paL);
    R(4, 18 + l, 4, 2, shoe); R(8, 18 + r, 4, 2, shoe); R(4, 18 + l, 3, 1, shoeL); R(8, 18 + r, 3, 1, shoeL);
  } else if (f === 0) { R(6, ly, 4, ll, pa); R(9, ly, 1, ll, paD); R(6, ly, 1, ll, paL); R(5, 18, 5, 2, shoe); R(5, 18, 3, 1, shoeL); }
  else if (f === 1) { R(4, ly, 3, ll, pa); R(9, ly, 2, ll - 1, paD); R(4, ly, 1, ll, paL); R(3, 18, 4, 2, shoe); R(3, 18, 2, 1, shoeL); R(9, 17, 3, 2, shoe); }
  else { R(6, ly, 2, ll - 1, pa); R(8, ly, 3, ll, paD); R(5, 17, 3, 2, shoe); R(5, 17, 2, 1, shoeL); R(8, 18, 4, 2, shoe); }
  // ---- torso and arms
  if (d < 2) {
    R(4, ty, 8, th, sh); R(11, ty, 1, th, shD); R(4, ty, 1, th, shL); R(5, ty + th - 2, 6, 1, shD); R(4, ty + th - 1, 8, 1, o.belt);
    if (d === 0) { R(6, ty, 4, 1, shL); R(7, ty + th - 1, 2, 1, '#b08a44'); if (!o.extra && !o.scarf) { R(7, ty + 1, 2, 1, skinD); } }
    else { R(7, ty + 1, 2, th - 3, shD); }
    const la = f === 1 ? 1 : 0, ra = f === 2 ? 1 : 0, al = th - 2;
    R(2, ty + la, 2, al, sh); R(2, ty + la, 1, al, shL); R(12, ty + ra, 2, al, shD); R(2, ty + al + la, 2, 1, skin); R(12, ty + al + ra, 2, 1, skinD);
    R(2, ty + la, 2, 1, shL); R(12, ty + ra, 2, 1, sh);
    if (o.extra === 'coat') { R(4, ty, 2, th, '#c8d0d0'); R(10, ty, 2, th, '#aab4b8'); R(2, ty + la, 2, al, '#c8d0d0'); R(12, ty + ra, 2, al, '#aab4b8'); if (d === 0) R(6, ty + 2, 1, 1, '#c8452e'); else R(4, ty, 8, th - 1, '#b8c2c4'); }
    if (o.extra === 'apron' && d === 0) { R(5, ty + 1, 6, th - 1, '#7a5638'); R(5, ty + 1, 6, 1, '#96704a'); R(6, ty, 1, 1, '#7a5638'); R(9, ty, 1, 1, '#7a5638'); }
    if (o.extra === 'apron' && d === 1) { R(4, ty + 2, 8, 1, '#7a5638'); }
  } else {
    R(5, ty, 6, th, sh); R(10, ty, 1, th, shD); R(5, ty, 1, th, shL); R(5, ty + th - 1, 6, 1, o.belt);
    const ax = f === 1 ? 5 : f === 2 ? 9 : 7, al = th - 2; R(ax, ty + 1, 2, al, shD); R(ax, ty + 1, 1, al, sh); R(ax, ty + 1 + al, 2, 1, skin);
    if (o.extra === 'coat') { R(5, ty, 6, th - 1, '#b8c2c4'); R(ax, ty + 1, 2, al, '#aab4b8'); }
    if (o.extra === 'apron') R(5, ty + 1, 2, th - 1, '#7a5638');
  }
  // ---- head
  if (d === 0) {
    R(4, 3 + Y, 8, 6, skin); R(5, 2 + Y, 6, 1, skin); R(11, 4 + Y, 1, 5, skinD); R(5, 8 + Y, 6, 1, skinD); R(3, 5 + Y, 1, 2, skinD); R(12, 5 + Y, 1, 2, skinD);
    R(5, 5 + Y, 2, 2, '#f0e8e0'); R(9, 5 + Y, 2, 2, '#f0e8e0'); R(6, 5 + Y, 1, 2, '#1a1014'); R(9, 5 + Y, 1, 2, '#1a1014'); R(7, 7 + Y, 2, 1, skinD); R(5, 6 + Y, 1, 1, skinL);
  } else if (d === 1) { R(4, 3 + Y, 8, 6, skin); R(3, 5 + Y, 1, 2, skinD); R(12, 5 + Y, 1, 2, skinD); R(6, 8 + Y, 4, 1, skinD); }
  else { R(4, 3 + Y, 7, 6, skin); R(5, 2 + Y, 5, 1, skin); R(3, 6 + Y, 1, 1, skin); R(5, 8 + Y, 5, 1, skinD); R(5, 5 + Y, 2, 2, '#f0e8e0'); R(5, 5 + Y, 1, 2, '#1a1014'); R(4, 7 + Y, 2, 1, skinD); R(9, 5 + Y, 1, 2, skinD); }
  // ---- hair
  const st = o.style;
  if (st === 'bald') {
    if (d === 0) { R(3, 4 + Y, 1, 2, hair); R(12, 4 + Y, 1, 2, hair); R(6, 2 + Y, 3, 1, skinL); }
    else if (d === 1) { R(4, 5 + Y, 8, 3, hair); R(5, 2 + Y, 6, 1, skin); R(6, 3 + Y, 3, 1, skinL); }
    else { R(8, 4 + Y, 3, 4, hair); R(6, 2 + Y, 3, 1, skinL); }
  } else if (d === 0) {
    R(5, 1 + Y, 6, 1, hair); R(4, 2 + Y, 8, 2, hair); R(3, 3 + Y, 1, 3, hair); R(12, 3 + Y, 1, 3, hair); R(4, 4 + Y, 2, 1, hair); R(10, 4 + Y, 2, 1, hair); R(6, 2 + Y, 3, 1, hairL); R(11, 2 + Y, 1, 2, hairD);
    if (st === 'long') { R(3, 6 + Y, 1, 6, hair); R(12, 6 + Y, 1, 6, hairD); R(4, 9 + Y, 1, 2, hair); R(11, 9 + Y, 1, 2, hairD); }
    if (st === 'bun') { R(6, 0 + Y, 4, 1, hair); R(7, -1 + Y + (Y ? 0 : 1), 2, 1, hairL); }
    if (st === 'spiky') { R(4, 1 + Y, 1, 1, hair); R(6, 0 + Y, 2, 1, hair); R(9, 0 + Y, 1, 1, hair); R(11, 1 + Y, 1, 1, hair); R(7, 4 + Y, 2, 1, hair); }
    if (st === 'short') R(6, 4 + Y, 1, 1, hair);
  } else if (d === 1) {
    R(5, 1 + Y, 6, 1, hair); R(4, 2 + Y, 8, 6, hair); R(3, 3 + Y, 1, 4, hair); R(12, 3 + Y, 1, 4, hairD); R(6, 2 + Y, 3, 1, hairL); R(10, 3 + Y, 2, 5, hairD); R(5, 7 + Y, 6, 1, hairD);
    if (st === 'long') { R(4, 8 + Y, 8, 4, hair); R(10, 8 + Y, 2, 4, hairD); R(5, 11 + Y, 6, 1, hairD); }
    if (st === 'bun') { R(6, 0 + Y, 4, 2, hair); R(6, 3 + Y, 4, 2, hairL); R(7, 0 + Y, 2, 1, hairL); }
    if (st === 'spiky') { R(4, 1 + Y, 1, 1, hair); R(6, 0 + Y, 2, 1, hair); R(9, 0 + Y, 1, 1, hair); R(11, 1 + Y, 1, 1, hair); }
  } else {
    R(5, 1 + Y, 6, 2, hair); R(4, 2 + Y, 2, 2, hair); R(8, 3 + Y, 4, 4, hair); R(10, 3 + Y, 2, 4, hairD); R(6, 1 + Y, 3, 1, hairL); R(7, 3 + Y, 1, 2, hair);
    if (st === 'long') { R(9, 7 + Y, 3, 5, hair); R(11, 7 + Y, 1, 5, hairD); }
    if (st === 'bun') { R(11, 1 + Y, 2, 3, hair); R(11, 1 + Y, 1, 1, hairL); }
    if (st === 'spiky') { R(5, 0 + Y, 1, 1, hair); R(8, 0 + Y, 2, 1, hair); R(11, 1 + Y, 1, 1, hair); R(12, 3 + Y, 1, 1, hair); }
  }
  // ---- extras
  if (o.extra === 'goggles') { if (d === 0) { R(4, 3 + Y, 8, 1, '#2a6a6a'); R(5, 3 + Y, 2, 1, PAL.cyan); R(9, 3 + Y, 2, 1, PAL.cyan); R(3, 3 + Y, 1, 1, '#1a3a3a'); R(12, 3 + Y, 1, 1, '#1a3a3a'); } else if (d === 1) R(3, 3 + Y, 10, 1, '#2a6a6a'); else { R(4, 3 + Y, 8, 1, '#2a6a6a'); R(4, 3 + Y, 2, 1, PAL.cyan); } }
  if (o.band) { if (d === 0) R(4, 2 + Y, 8, 1, o.band); else if (d === 1) { R(3, 3 + Y, 10, 1, o.band); R(11, 4 + Y, 1, 2, o.band); } else { R(4, 2 + Y, 8, 1, o.band); R(11, 3 + Y, 1, 2, o.band); } }
  if (o.extra === 'beard') { const bc = '#d8d0c0', bd = '#a8a094'; if (d === 0) { R(4, 6 + Y, 8, 3, bc); R(5, 9 + Y, 6, 1, bc); R(6, 10 + Y, 4, 1, bd); R(5, 5 + Y, 2, 2, '#f0e8e0'); R(9, 5 + Y, 2, 2, '#f0e8e0'); R(6, 5 + Y, 1, 2, '#1a1014'); R(9, 5 + Y, 1, 2, '#1a1014'); R(7, 7 + Y, 2, 1, bd); } else if (d > 1) { R(4, 7 + Y, 4, 2, bc); R(4, 9 + Y, 3, 1, bd); } }
  if (o.scarf) { const sc = o.scarf, sd = shade(sc, .75); if (d === 0) { R(4, ty - 1, 8, 2, sc); R(4, ty, 8, 1, sd); R(9, ty + 1, 2, 3, sc); R(10, ty + 1, 1, 3, sd); } else if (d === 1) { R(4, ty - 1, 8, 2, sc); R(4, ty, 8, 1, sd); } else { R(5, ty - 1, 6, 2, sc); R(5, ty, 6, 1, sd); R(10, ty + 1, 2, 2, sd); } }
  if (o.extra === 'pin') { if (d === 0) { R(5, ty + 1, 1, 1, '#f4f6fa'); R(4, ty, 8, 1, shD); R(7, ty, 2, 2, '#d8dce4'); } else if (d > 1) R(5, ty, 6, 1, shD); }
  if (!o.clean) { const s1 = shade(skin, .58), s2 = shade(sh, .55); // soot: the Cinders never wash off
    if (d === 0) { R(10, 7 + Y, 1, 1, s1); R(4, 4 + Y, 1, 1, s1); R(6, ty + 3, 2, 1, s2); R(10, ty + 1, 1, 2, s2); R(3, ty + 2, 1, 1, s2); R(5, 16, 1, 1, paD); }
    else if (d === 2) { R(7, 7 + Y, 1, 1, s1); R(6, ty + 2, 2, 1, s2); R(9, ty + 3, 1, 1, s2); }
    else { R(6, ty + 2, 2, 1, s2); R(9, ty + 1, 1, 1, s2); } }
  if (o.extra === 'hat') { const hc = o.clean ? '#5a5e6a' : PAL.yellow, hd = o.clean ? '#32343c' : '#b88a22', hl = o.clean ? '#8a8e9c' : '#ffe08a';
    if (d < 2) { R(4, 0 + Y, 8, 3, hc); R(5, 0 + Y, 4, 1, hl); R(3, 3 + Y, 10, 1, hd); R(11, 0 + Y, 1, 3, hd); if (d === 0) { R(7, 1 + Y, 2, 1, o.clean ? '#e8c25a' : '#fff6d0'); } }
    else { R(4, 0 + Y, 8, 3, hc); R(5, 0 + Y, 4, 1, hl); R(2, 3 + Y, 10, 1, hd); R(11, 0 + Y, 1, 3, hd); } }
  if (blink) { if (d === 0) { R(5, 5 + Y, 2, 2, skin); R(9, 5 + Y, 2, 2, skin); R(5, 6 + Y, 2, 1, skinD); R(9, 6 + Y, 2, 1, skinD); } else if (d === 2) { R(5, 5 + Y, 2, 2, skin); R(5, 6 + Y, 2, 1, skinD); } }
}
// ---- the Accredited: tall (16x24), pristine, luminous. No soot.
// ---- the Accredited: tall (16x28), pristine, luminous. No soot.
function makeAccredited(o) {
  const AH = 28, [c, g] = mk(48, AH * 4);
  for (let d = 0; d < 3; d++) for (let f = 0; f < 3; f++) {
    const ox = f * 16, oy = d * AH, R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(ox + x, oy + y, w, h); };
    const sway = f === 1 ? -1 : f === 2 ? 1 : 0, robe = o.robe, trim = o.trim, sk = o.skin;
    // robe: long, widening to the floor
    for (let y = 9; y < AH; y++) { const w = Math.min(12, 6 + Math.floor((y - 9) / 3)), x0 = 8 - Math.floor(w / 2) + (y > AH - 6 ? sway : 0); R(x0, y, w, 1, y === AH - 1 ? trim : robe); R(x0 + w - 1, y, 1, 1, shade(robe, .86)); if (y > 12 && (y % 5) === 2) R(x0 + 2, y, 1, 3, shade(robe, .92)); }
    if (d === 0) { R(7, 10, 2, AH - 11, trim); R(7, 10, 1, AH - 11, shade(trim, 1.25)); R(4, 9, 8, 1, trim); R(4, 8, 2, 2, trim); R(10, 8, 2, 2, trim); R(3, 12, 1, 6, robe); R(12, 12, 1, 6, robe); R(3, 18, 1, 1, sk); R(12, 18, 1, 1, sk); }
    else if (d === 1) { R(5, 9, 6, 1, trim); }
    else { R(5, 9, 5, 1, trim); R(4, 8, 2, 2, trim); R(7, 12, 2, 6, shade(robe, .9)); R(7, 18, 2, 1, sk); }
    if (o.warden) {
      R(5, 1, 6, 7, '#d8dce4'); R(5, 1, 6, 1, '#f4f6fa'); if (d === 0) { R(6, 3, 4, 1, trim); R(5, 5, 6, 1, '#1e1e28'); R(7, 6, 2, 2, '#b8bcc8'); R(3, 9, 2, 3, '#e8ecf2'); R(11, 9, 2, 3, '#e8ecf2'); R(3, 9, 2, 1, trim); R(11, 9, 2, 1, trim); } else if (d > 1) R(5, 4, 2, 1, trim);
      R(d === 2 ? 2 : 13, 0, 1, AH, '#b8bcc8'); R(d === 2 ? 1 : 12, 0, 3, 2, trim); R(d === 2 ? 2 : 13, -1, 1, 1, '#fff');
    } else {
      // head, long pale hair, circlet
      if (d === 1) { R(5, 2, 6, 7, o.hair); R(4, 4, 8, 9, o.hair); }
      else if (d === 0) { R(4, 2, 8, 3, o.hair); R(4, 5, 1, 8, o.hair); R(11, 5, 1, 8, o.hair); R(5, 3, 6, 6, sk); R(5, 2, 6, 1, o.hair);
        R(6, 5, 1, 1, '#c89a2a'); R(9, 5, 1, 1, '#c89a2a'); R(7, 7, 2, 1, shade(sk, .9)); }
      else { R(5, 3, 6, 6, sk); R(5, 2, 6, 2, o.hair); R(8, 3, 3, 10, o.hair); R(6, 5, 1, 1, '#c89a2a'); }
      if (o.crown) { R(4, 1, 8, 1, trim); R(7, 0, 2, 1, trim); R(7, 1, 2, 1, '#ffffff'); }
    }
  }
  if (o.band) for (let d = 0; d < 3; d++) for (let f = 0; f < 3; f++) { // Kael: built by hand, not by the template
    const ox = f * 16, oy = d * AH, R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(ox + x, oy + y, w, h); }, ram = '#a87a3a', ramD = '#6a4a22';
    if (d === 0) { R(2, 8, 3, 3, trim); R(11, 8, 3, 3, trim); R(2, 8, 3, 1, '#fff2c0'); R(11, 8, 3, 1, '#fff2c0'); R(2, 11, 2, 1, shade(trim, .7)); R(12, 11, 2, 1, shade(trim, .7)); // pauldrons
      R(5, 4, 6, 1, shade(sk, .8)); R(6, 5, 1, 1, '#ffd24a'); R(9, 5, 1, 1, '#ffd24a'); R(5, 6, 1, 2, shade(sk, .86)); R(10, 6, 1, 2, shade(sk, .86)); R(7, 8, 2, 1, shade(sk, .74)); R(10, 4, 1, 3, '#b86a5a'); // brow, gold eyes, jaw, the scar
      R(5, 1, 6, 1, shade(hair, 1.2)); R(4, 3, 1, 2, shade(hair, .8)); R(11, 3, 1, 2, shade(hair, .8)); R(7, 10, 2, 1, '#8a8478'); R(7, 11, 2, 2, '#c8a45a'); R(7, 11, 1, 1, '#fff2c0'); // hair light, the washer on its cord
      R(12, 14, 2, 4, ram); R(12, 14, 2, 1, '#e8c25a'); R(12, 17, 2, 1, ramD); R(4, 15, 8, 1, shade(arm, .78)); R(5, 22, 2, 1, trim); R(9, 22, 2, 1, trim); }
    else if (d === 1) { R(2, 8, 3, 3, trim); R(11, 8, 3, 3, trim); R(2, 8, 3, 1, '#fff2c0'); R(11, 8, 3, 1, '#fff2c0'); R(5, 1, 6, 1, shade(hair, 1.2)); R(7, 3, 2, 4, shade(hair, .8)); R(2, 14, 2, 4, ram); R(2, 14, 2, 1, '#e8c25a'); if (o.cape) { R(4, 10, 8, 1, shade(o.cape, 1.3)); R(6, 12, 1, 11, shade(o.cape, .8)); R(9, 13, 1, 10, shade(o.cape, .8)); } }
    else { R(5, 8, 5, 3, trim); R(5, 8, 5, 1, '#fff2c0'); R(6, 4, 3, 1, shade(sk, .8)); R(6, 5, 1, 1, '#ffd24a'); R(5, 6, 1, 2, shade(sk, .86)); R(6, 1, 5, 1, shade(hair, 1.2)); R(9, 4, 2, 3, shade(hair, .8)); R(6, 14, 2, 4, ram); R(6, 14, 2, 1, '#e8c25a'); R(6, 17, 2, 1, ramD); R(5, 22, 3, 1, trim); if (o.cape) { R(10, 11, 1, 12, shade(o.cape, .8)); } }
  }
  for (let f = 0; f < 3; f++) { g.clearRect(f * 16, AH * 3, 16, AH); g.save(); g.translate(f * 16 + 16, AH * 3); g.scale(-1, 1); g.drawImage(c, f * 16, AH * 2, 16, AH, 0, 0, 16, AH); g.restore(); }
  outline(c, '#3a2e1a', 16, AH);
  c.fh = AH; c.glow = 1; return c;
}
// ---- Assay cadets: 16x28, armour not robes. o = {skin, hair, armor, trim, sash, cape, long, spiky, circlet, band, smudge, helm}
function makeCadet(o) {
  const AH = 28, [c, g] = mk(48, AH * 4), arm = o.armor || '#efe8d4', trim = o.trim || '#e8c25a', sash = o.sash || '#7a5ac8', sk = o.skin, hair = o.hair, dk = shade(arm, .72), boot = '#4a3a2a', eye = '#c89a2a';
  for (let d = 0; d < 3; d++) for (let f = 0; f < 3; f++) {
    const ox = f * 16, oy = d * AH, R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(ox + x, oy + y, w, h); }, st = f === 1 ? 1 : f === 2 ? -1 : 0;
    if (o.cape) { if (d === 1) R(4, 10, 8, 14 + (st ? 1 : 0), o.cape); else if (d === 0) { R(3, 10, 1, 13, o.cape); R(12, 10, 1, 13, o.cape); } else R(9, 10, 3 + (st ? 1 : 0), 13, o.cape); }
    if (d < 2) { const l = st > 0 ? 1 : 0, r = st < 0 ? 1 : 0; R(5, 18, 2, 8 - l, dk); R(9, 18, 2, 8 - r, dk); R(5, 20, 2, 1, trim); R(9, 20, 2, 1, trim); R(5, 21, 1, 3, shade(arm, .95)); R(9, 21, 1, 3, shade(arm, .95)); R(5, 25 - l, 2, 2, boot); R(9, 25 - r, 2, 2, boot); }
    else { R(6 - st, 18, 2, 8, dk); R(8 + st, 18, 2, 8, shade(dk, .88)); R(5 - st, 25, 3, 2, boot); R(8 + st, 25, 3, 2, shade(boot, .85)); }
    if (d === 2) { R(5, 9, 6, 9, arm); R(9, 9, 2, 9, shade(arm, .86)); R(5, 9, 6, 1, trim); R(6, 8, 4, 2, trim); R(5, 16, 6, 1, sash); R(5, 17, 6, 1, trim); R(7, 11, 2, 6, shade(arm, .92)); R(7, 17, 2, 1, sk); if (o.band) R(7, 12, 2, 2, '#c8281e'); }
    else { R(4, 9, 8, 9, arm); R(11, 9, 1, 9, shade(arm, .86)); R(4, 9, 8, 1, trim); R(3, 8, 2, 3, trim); R(11, 8, 2, 3, trim); R(3, 8, 2, 1, shade(trim, 1.25));
      R(4, 10, 1, 7, shade(arm, 1.1)); R(5, 13, 6, 1, shade(arm, .9));
      if (d === 0) { for (let i = 0; i < 6; i++) R(5 + i, 10 + i, 2, 1, sash); R(7, 12, 2, 2, trim); R(7, 12, 1, 1, '#fff6c8'); } else { for (let i = 0; i < 6; i++) R(10 - i, 10 + i, 2, 1, sash); R(7, 10, 2, 6, shade(arm, .9)); R(4, 14, 8, 1, shade(arm, .82)); }
      R(4, 16, 8, 1, sash); R(4, 17, 8, 1, trim); R(3, 11, 1, 6, arm); R(12, 11, 1, 6, arm); R(3, 17, 1, 1, sk); R(12, 17, 1, 1, sk); if (o.band) R(d === 0 ? 12 : 3, 12, 1, 2, '#c8281e'); }
    if (o.helm) { R(5, 2, 6, 7, '#d8dce4'); R(5, 2, 6, 1, '#f4f6fa'); R(7, 0, 2, 2, sash); if (d === 0) { R(6, 5, 4, 1, '#1e1e28'); R(7, 6, 2, 3, sk); } else if (d === 2) { R(5, 5, 3, 1, '#1e1e28'); } }
    else if (d === 1) { R(5, 2, 6, 7, hair); R(5, 2, 6, 1, shade(hair, 1.12)); R(6, 5, 1, 3, shade(hair, .85)); R(9, 4, 1, 4, shade(hair, .85)); R(6, 9, 4, 1, sk); if (o.long) R(5, 9, 6, 4, hair); if (o.spiky) { R(5, 1, 1, 1, hair); R(8, 1, 1, 1, hair); R(10, 1, 1, 1, hair); } if (o.circlet) R(5, 3, 6, 1, trim); }
    else if (d === 0) { R(5, 3, 6, 6, sk); R(4, 2, 8, 2, hair); R(4, 4, 1, o.long ? 8 : 3, hair); R(11, 4, 1, o.long ? 8 : 3, hair); if (o.spiky) { R(5, 1, 1, 1, hair); R(8, 1, 1, 1, hair); R(10, 1, 1, 1, hair); }
      R(6, 5, 1, 1, eye); R(9, 5, 1, 1, eye); R(7, 7, 2, 1, shade(sk, .82)); if (o.smudge) { R(10, 6, 1, 1, '#5a4a44'); R(5, 7, 1, 1, '#5a4a44'); } if (o.circlet) { R(4, 2, 8, 1, trim); R(7, 1, 2, 1, '#fff'); } }
    else { R(5, 3, 6, 6, sk); R(5, 2, 6, 2, hair); R(8, 3, 3, o.long ? 9 : 4, hair); if (o.spiky) { R(6, 1, 1, 1, hair); R(9, 1, 1, 1, hair); } R(6, 5, 1, 1, eye); if (o.smudge) R(6, 7, 1, 1, '#5a4a44'); if (o.circlet) R(5, 2, 6, 1, trim); }
  }
  for (let f = 0; f < 3; f++) { g.save(); g.translate(f * 16 + 16, AH * 3); g.scale(-1, 1); g.drawImage(c, f * 16, AH * 2, 16, AH, 0, 0, 16, AH); g.restore(); }
  outline(c, '#3a2e1a', 16, AH);
  c.fh = AH; c.glow = 1; return c;
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
const SOLID = new Set(['#', 'x', 'N', '~']);
const isWall = ch => ch === '#' || ch === 'N';
// Tiles are drawn as hand-laid stone, plate and timber: every surface gets a lit top-left
// edge and a dark bottom-right edge, plus contact shadows where walls meet floors.
function stoneAt(g, x, y, w, h, col, mortar) {
  g.fillStyle = mortar; g.fillRect(x, y, w, h); if (w < 3 || h < 3) return;
  g.fillStyle = col; g.fillRect(x, y, w - 1, h - 1);
  g.fillStyle = shade(col, 1.2); g.fillRect(x, y, w - 1, 1); g.fillRect(x, y, 1, h - 1);
  g.fillStyle = shade(col, .8); g.fillRect(x + 1, y + h - 2, w - 2, 1); g.fillRect(x + w - 2, y + 1, 1, h - 2);
}
// The Assay valley at night: pines for walls, grass, trodden paths, the river, and marble for anything the Proctors stand on.
function valleyTile(g, m, tx, ty, ch, x, y, r, r2, R, at) {
  const grass = () => { R(0, 0, 16, 16, r < .5 ? '#1c3826' : '#1f3d29'); for (let i = 0; i < 5; i++) { const a = hash(tx * 7 + i, ty * 3 + 2), b = hash(tx * 2 + i, ty * 9 + 4); R((a * 15) | 0, (b * 14) | 0, 1, 2, i % 2 ? '#2a5234' : '#163020'); } if (r2 > .86) { const sx = 3 + (r2 * 40 | 0) % 9, sy = 4 + (r * 40 | 0) % 8; R(sx, sy, 1, 1, '#d8d0f0'); R(sx, sy + 1, 1, 2, '#2a5234'); } };
  if (m.theme === 'spire' && ch === '#') {
    if (at(0, 1) !== '#') { R(0, 0, 16, 16, '#e4e0ee'); R(0, 0, 16, 2, '#ffffff'); for (let i = 0; i < 16; i += 8) { R(i, 2, 1, 11, '#c4c0d2'); R(i + 1, 2, 1, 11, '#f4f2fa'); } R(0, 12, 16, 2, '#e8c25a'); R(0, 12, 16, 1, '#fff0b0'); R(0, 14, 16, 2, '#8a8698');
      if ((tx % 5) === 2) { R(4, 2, 8, 9, '#0c1430'); R(4, 2, 8, 1, '#e8c25a'); R(4, 10, 8, 1, '#e8c25a'); R(3, 2, 1, 9, '#e8c25a'); R(12, 2, 1, 9, '#e8c25a'); R(6, 4, 1, 1, '#ffffff'); R(10, 7, 1, 1, '#c8d8ff'); R(7, 8, 1, 1, '#ffffff'); } }
    else { R(0, 0, 16, 16, '#d0ccde'); R(0, 0, 16, 1, '#e8e4f2'); if (r > .6) R(3 + (r2 * 8 | 0), 5, 5, 1, '#bab6ca'); }
    return; }
  if (m.theme === 'spire' && ch !== '=' && ch !== ',') { ch = '='; }
  if (ch === '#') {
    if (at(0, 1) !== '#') { grass(); R(6, 6, 4, 10, '#2a1c14'); R(6, 6, 1, 10, '#3e2a1c'); R(9, 6, 1, 10, '#1a100c'); R(3, 14, 10, 2, 'rgba(0,0,0,.3)');
      for (const [a, b, w] of [[5, -6, 6], [3, -2, 10], [1, 2, 14], [0, 6, 16]]) { R(a, b, w, 4, '#14301f'); R(a, b, w, 1, '#1e4a2c'); R(a + 1, b + 3, w - 2, 1, '#0c2014'); } R(7, -8, 2, 2, '#1e4a2c'); }
    else { R(0, 0, 16, 16, '#0c1c13'); for (let i = 0; i < 4; i++) { const a = hash(tx * 5 + i, ty * 3 + 1), b = hash(tx + i * 7, ty * 5 + 2), sx = (a * 11) | 0, sy = (b * 11) | 0, c = ['#14301f', '#183826', '#102818'][i % 3]; R(sx, sy + 1, 6, 4, c); R(sx + 1, sy, 4, 6, c); R(sx + 1, sy, 3, 1, '#225032'); } }
    return; }
  if (ch === '~') { R(0, 0, 16, 16, '#12263a'); R(0, 0, 16, 1, '#1c3852'); for (let i = 0; i < 3; i++) { const a = hash(tx * 3 + i, ty * 7 + 1); R((a * 12) | 0, 3 + i * 5, 4, 1, i % 2 ? '#2a5070' : '#3a6a8a'); } if (at(-1, 0) !== '~') R(0, 0, 2, 16, '#2a3a2a'); if (at(1, 0) !== '~') R(14, 0, 2, 16, '#22301f'); return; }
  if (ch === ',' && m.theme === 'spire') { R(0, 0, 16, 16, '#6a2a3a'); R(0, 0, 16, 1, '#8a3a4c'); R(0, 0, 1, 16, '#e8c25a'); R(15, 0, 1, 16, '#e8c25a'); if ((ty & 1) === 0) R(6, 6, 4, 4, '#7a3244'); return; }
  if (ch === ',') { R(0, 0, 16, 16, r < .5 ? '#3a3226' : '#40372a'); for (let i = 0; i < 5; i++) { const a = hash(tx * 7 + i, ty + 3), b = hash(tx + i, ty * 9 + 5); R((a * 14) | 0, (b * 14) | 0, 2, 1, i % 2 ? '#2c261c' : '#544838'); } if (at(-1, 0) === '~' || at(1, 0) === '~') { R(2, 3, 5, 3, '#6a6a70'); R(2, 3, 5, 1, '#8a8a92'); R(9, 9, 5, 3, '#62626a'); R(9, 9, 5, 1, '#84848c'); } return; }
  if (ch === '=') { const c = ((tx + ty) & 1) ? '#b8b4c4' : '#c4c0d0'; R(0, 0, 16, 16, c); R(0, 0, 16, 1, '#e0dcec'); R(0, 0, 1, 16, '#d4d0e0'); R(15, 0, 1, 16, '#8a8698'); R(0, 15, 16, 1, '#8a8698'); if (r2 > .7) R(4 + (r2 * 30 | 0) % 8, 6, 3, 1, '#a09cb0'); if (at(0, 1) !== '=' && at(0, 1) !== 'x') { R(0, 13, 16, 3, '#e8c25a'); R(0, 13, 16, 1, '#fff0b0'); } return; }
  grass();
}
function drawTile(g, m, tx, ty) {
  const ch = m.grid[ty][tx], x = tx * 16, y = ty * 16, r = hash(tx + m.seed, ty), r2 = hash(tx * 3 + 11, ty * 7 + m.seed), R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); };
  const at = (dx, dy) => { const yy = ty + dy, xx = tx + dx; return yy < 0 || yy >= m.h || xx < 0 || xx >= m.w ? '#' : m.grid[yy][xx]; };
  if (m.theme === 'valley' || m.theme === 'spire') return valleyTile(g, m, tx, ty, ch, x, y, r, r2, R, at);
  const below = at(0, 1), th = m.theme, home = th === 'home', clinic = th === 'clinic', bay = th === 'bay', tunnel = th === 'tunnel';
  if (isWall(ch)) {
    if (!isWall(below)) { // ---- wall face
      if (clinic) { R(0, 0, 16, 16, '#6c7c76'); R(0, 0, 16, 2, '#94a49c'); R(0, 2, 16, 1, '#4e5c56'); for (let i = 0; i < 16; i += 8) { R(i, 3, 1, 6, '#5c6a64'); } R(0, 9, 16, 4, '#8a9a92'); R(0, 9, 16, 1, '#a2b2aa'); if (r > .6) R(r * 12 | 0, 4, 1, 4, '#4a5852'); }
      else if (home) { R(0, 0, 16, 16, PAL.plaster); for (let i = 0; i < 16; i += 4) R(i + 1, 2, 1, 8, PAL.plaster2); R(0, 0, 16, 2, '#7a5444'); R(0, 0, 16, 1, '#96705a'); R(0, 9, 16, 4, '#4a2e24'); R(0, 9, 16, 1, '#6a4634'); for (let i = 3; i < 16; i += 6) R(i, 10, 1, 3, '#38221c'); if (r > .7) R(4 + (r * 8 | 0), 3, 2, 3, shade(PAL.plaster, .82)); }
      else if (bay) { // riveted iron panels, girders, rust
        R(0, 0, 16, 16, r < .5 ? '#5a4640' : '#62504a'); R(0, 0, 16, 2, '#8a7468'); R(0, 0, 16, 1, '#a48c7c'); R(0, 2, 16, 1, '#3a2a26'); R(0, 7, 16, 1, '#3e2e2a'); R(0, 8, 16, 1, '#72605a'); R(15, 3, 1, 10, '#3a2a26'); R(0, 3, 1, 10, '#72605a');
        for (const [a, b] of [[2, 4], [13, 4], [2, 10], [13, 10]]) { R(a, b, 1, 1, '#b08a64'); R(a, b + 1, 1, 1, '#2e201c'); }
        if (r2 > .6) { const sx = 4 + (r2 * 8 | 0); R(sx, 3, 1, 6 + (r * 4 | 0), '#8a4a26'); R(sx + 1, 5, 1, 3, '#6a3a20'); }
        if (tx % 4 === 0) { R(5, 0, 6, 13, '#3c3e48'); R(5, 0, 1, 13, '#666a78'); R(10, 0, 1, 13, '#22242c'); R(7, 0, 2, 13, '#2e3038'); for (let i = 2; i < 12; i += 4) R(6, i, 1, 1, '#8a8e9c'); }
      } else { // dressed stone courses (city, tunnel), timber props like a mine gallery
        const mortar = '#2a1e1c', cols = tunnel ? ['#54443a', '#5e4c40', '#4a3c34'] : ['#62504a', '#6c5a52', '#584840'];
        R(0, 0, 16, 16, mortar); const off = (ty + (r > .5 ? 1 : 0)) % 2 ? 0 : -5;
        for (let row = 0; row < 2; row++) for (let i = (row ? off - 4 : off); i < 16; i += 9) { const c = cols[(hash(tx * 2 + i, ty + row) * 3) | 0], x0 = Math.max(0, i), x1 = Math.min(16, i + 9); if (x1 > x0) stoneAt(g, x + x0, y + 3 + row * 5, x1 - x0, 5, c, mortar); }
        R(0, 0, 16, 3, tunnel ? '#6a4a2c' : '#84706a'); R(0, 0, 16, 1, tunnel ? '#8e6a3e' : '#a08a80'); R(0, 2, 16, 1, tunnel ? '#3e2a18' : '#40302c');
        if (r2 > .78) { R(3 + (r2 * 9 | 0), 5, 1, 5, '#3a4a34'); R(4 + (r2 * 9 | 0), 7, 1, 4, '#2e3e2a'); } // damp streak
        if (tx % (tunnel ? 3 : 5) === 1) { R(6, 0, 4, 13, '#6a4a2c'); R(6, 0, 1, 13, '#92703f'); R(9, 0, 1, 13, '#3e2a18'); R(5, 2, 6, 2, '#7a5632'); R(5, 2, 6, 1, '#9a7644'); R(7, 6, 1, 1, '#2a1c10'); R(8, 10, 1, 1, '#2a1c10'); }
      }
      R(0, 13, 16, 3, '#160d0e'); R(0, 13, 16, 1, '#2a1c1c');
    } else { // ---- solid rock: lumped stone, lit from the top left
      R(0, 0, 16, 16, '#150d10');
      const n = 3 + (r * 2 | 0);
      for (let i = 0; i < n; i++) { const a = hash(tx * 5 + i, ty * 3 + 1), b = hash(tx + i * 7, ty * 5 + 2), w = 5 + (a * 6 | 0), h = 4 + (b * 4 | 0), sx = (a * 97 % 13) | 0, sy = (b * 89 % 12) | 0, c = ['#2a1e20', '#33252a', '#241a1c'][i % 3];
        R(sx + 1, sy, w - 2, h, c); R(sx, sy + 1, w, h - 2, c); R(sx + 1, sy, w - 3, 1, shade(c, 1.35)); R(sx, sy + 1, 1, h - 3, shade(c, 1.25)); R(sx + 1, sy + h - 1, w - 2, 1, shade(c, .6)); }
      if (r2 > .9) R(4 + (r2 * 30 | 0) % 9, 6, 1, 1, '#e8b23a'); // a glint of ore
    }
    return;
  }
  // ---- floors
  if (clinic) { R(0, 0, 16, 16, '#262c2a'); for (const [a, b] of [[0, 0], [8, 0], [0, 8], [8, 8]]) stoneAt(g, x + a, y + b, 8, 8, ((tx * 2 + a / 8 + ty * 2 + b / 8) % 2) ? '#4c5856' : '#5a6664', '#262c2a'); if (r > .8) R(4 + (r * 50 | 0) % 8, 9, 3, 1, '#3a4442'); }
  else if (home) { // floorboards with grain and nail heads
    R(0, 0, 16, 16, PAL.woodD);
    for (let i = 0; i < 4; i++) { const c = [PAL.wood, PAL.wood2, '#44301f', PAL.wood][(i + ty) % 4], o = (hash(tx, ty * 4 + i) * 16) | 0; R(0, i * 4, 16, 3, c); R(0, i * 4, 16, 1, shade(c, 1.18)); R(o, i * 4, 1, 3, PAL.woodD); R((o + 1) % 16, i * 4 + 1, 1, 1, '#1a100c'); if (hash(tx * 3, ty + i) > .6) R((o + 5) % 14, i * 4 + 1, 3, 1, shade(c, .82)); }
  } else if (ch === ',' && tunnel) { // packed dirt, pebbles, cart ruts
    R(0, 0, 16, 16, r < .5 ? '#3c2e26' : '#42332a'); for (let i = 0; i < 5; i++) { const a = hash(tx * 7 + i, ty + 3), b = hash(tx + i, ty * 9 + 5); R((a * 14) | 0, (b * 14) | 0, 2, 1, i % 2 ? '#2e221c' : '#52423a'); }
    if (r2 > .6) { const sx = (r2 * 11) | 0, sy = (r * 11) | 0; R(sx, sy, 3, 2, '#5c4c44'); R(sx, sy, 2, 1, '#78665a'); R(sx + 1, sy + 2, 2, 1, '#241a16'); }
  } else if (ch === ',') { // steel grating over a warm dark
    R(0, 0, 16, 16, '#110c10'); if (bay && r2 > .5) R(3 + (r2 * 9 | 0), 5 + (r * 6 | 0), 2, 1, '#6a2a14');
    for (let i = 1; i < 16; i += 3) { R(0, i, 16, 2, '#3e3a46'); R(0, i, 16, 1, '#5c5868'); } for (let i = 3; i < 16; i += 6) R(i, 0, 1, 16, '#2c2932');
    if (at(-1, 0) !== ',') { R(0, 0, 2, 16, '#55515f'); R(0, 0, 1, 16, '#7a7686'); } if (at(1, 0) !== ',') { R(14, 0, 2, 16, '#3a3742'); R(15, 0, 1, 16, '#1a181e'); }
    if (at(0, -1) !== ',') { R(0, 0, 16, 2, '#55515f'); R(0, 0, 16, 1, '#7a7686'); } if (at(0, 1) !== ',') { R(0, 14, 16, 2, '#3a3742'); R(0, 15, 16, 1, '#1a181e'); }
  } else if (bay) { // big deck plates (2x2 tiles): seams, corner rivets, scuffs, the odd tread panel
    const c = hash((tx >> 1) + m.seed, ty >> 1) < .5 ? '#3f3d47' : '#44424c', L = !(tx & 1), T = !(ty & 1);
    R(0, 0, 16, 16, c);
    for (let i = 0; i < 4; i++) { const a = hash(tx * 9 + i, ty * 5 + 1), b2 = hash(tx * 3 + i, ty * 11 + 2); R((a * 14) | 0, (b2 * 14) | 0, 2 + (i & 1), 1, shade(c, i % 2 ? 1.12 : .88)); }
    if (L) { R(0, 0, 1, 16, '#1e1c24'); R(1, 0, 1, 16, shade(c, 1.28)); } else R(15, 0, 1, 16, shade(c, .72));
    if (T) { R(0, 0, 16, 1, '#1e1c24'); R(0, 1, 16, 1, shade(c, 1.28)); } else R(0, 15, 16, 1, shade(c, .72));
    const rx = L ? 3 : 12, ry = T ? 3 : 12; R(rx, ry, 1, 1, '#8c8a98'); R(rx + 1, ry + 1, 1, 1, '#1e1c24');
    if (r2 < .1) { for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { R(4 + i * 3, 4 + j * 3, 2, 1, shade(c, 1.3)); R(5 + i * 3, 5 + j * 3, 1, 1, shade(c, .65)); } }
    else if (r2 > .88) { R(4, 6, 8, 4, 'rgba(14,10,14,.4)'); R(6, 5, 4, 6, 'rgba(14,10,14,.4)'); R(7, 7, 2, 1, 'rgba(120,70,40,.5)'); }
    else if (r2 > .8) { R(3, 8, 9, 1, shade(c, .7)); R(5, 9, 5, 1, shade(c, .8)); }
  } else { // flagstones, laid by hand a long time ago
    const mortar = '#2a201e', cols = ['#584a44', '#5f5049', '#51453f', '#64554c'], pick = k => cols[(hash(tx * 4 + k, ty * 4 + m.seed) * 4) | 0], pat = (r * 4) | 0;
    R(0, 0, 16, 16, mortar);
    if (pat === 0) { const s1 = 6 + (r2 * 5 | 0), s2 = 5 + (hash(tx, ty + 9) * 6 | 0); stoneAt(g, x, y, s1, 8, pick(0), mortar); stoneAt(g, x + s1, y, 16 - s1, 8, pick(1), mortar); stoneAt(g, x, y + 8, s2, 8, pick(2), mortar); stoneAt(g, x + s2, y + 8, 16 - s2, 8, pick(3), mortar); }
    else if (pat === 1) { stoneAt(g, x, y, 16, 6, pick(0), mortar); const s = 7 + (r2 * 4 | 0); stoneAt(g, x, y + 6, s, 5, pick(1), mortar); stoneAt(g, x + s, y + 6, 16 - s, 5, pick(2), mortar); stoneAt(g, x, y + 11, 16, 5, pick(3), mortar); }
    else if (pat === 2) { stoneAt(g, x, y, 10, 10, pick(0), mortar); stoneAt(g, x + 10, y, 6, 5, pick(1), mortar); stoneAt(g, x + 10, y + 5, 6, 5, pick(2), mortar); const s = 5 + (r2 * 6 | 0); stoneAt(g, x, y + 10, s, 6, pick(3), mortar); stoneAt(g, x + s, y + 10, 16 - s, 6, pick(1), mortar); }
    else { stoneAt(g, x, y, 7, 16, pick(0), mortar); stoneAt(g, x + 7, y, 9, 7, pick(1), mortar); stoneAt(g, x + 7, y + 7, 9, 9, pick(2), mortar); }
    if (r2 > .86) { R(3 + (r2 * 20 | 0) % 8, 4, 1, 3, mortar); R(4 + (r2 * 20 | 0) % 8, 6, 2, 1, mortar); } // crack
    if (r2 < .1) { R(5, 9, 5, 3, 'rgba(20,14,14,.45)'); R(6, 8, 3, 1, 'rgba(20,14,14,.45)'); } // soot patch
    if (r2 > .45 && r2 < .5) { R(9, 3, 2, 1, '#3e5236'); R(10, 4, 1, 1, '#2e4028'); } // moss in a seam
  }
  if (ch === 'D' || ch === 'E') { R(1, 0, 14, 16, '#0e0a0c'); R(2, 2, 12, 12, '#1a1215'); R(2, 2, 12, 1, '#2a1e20'); }
  // contact shadows: walls sit ON the floor
  if (isWall(at(0, -1))) for (let i = 0; i < 6; i++) R(0, i, 16, 1, `rgba(8,4,6,${0.5 - i * 0.08})`);
  if (isWall(at(-1, 0))) for (let i = 0; i < 4; i++) R(i, 0, 1, 16, `rgba(8,4,6,${0.36 - i * 0.08})`);
  if (isWall(at(1, 0))) for (let i = 0; i < 3; i++) R(15 - i, 0, 1, 16, `rgba(8,4,6,${0.24 - i * 0.07})`);
  if (isWall(at(0, 1))) for (let i = 0; i < 3; i++) R(0, 15 - i, 16, 1, `rgba(8,4,6,${0.3 - i * 0.09})`);
}
// ---- props (drawn into static layer); px coords from tile coords
const PROPS = {
  vtent(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }, c = a || '#7a5ac8'; for (let i = 0; i < 12; i++) { R(4 + i, 4 - i * 1.4 | 0 + 0, 24 - i * 2, 2, i % 3 ? '#e8e0d0' : c); } R(2, 5, 28, 10, '#d8d0c0'); R(2, 5, 28, 1, '#f6f0e4'); R(2, 14, 28, 1, '#8a8478'); for (let i = 0; i < 28; i += 7) R(2 + i, 5, 2, 10, c); R(13, 7, 6, 8, '#1a141c'); R(13, 7, 1, 8, '#3a3040'); R(15, -14, 1, 6, '#8a7a5a'); R(16, -14, 5, 3, c); },
  standard(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }, c = a || '#3aa8a0'; R(7, -18, 2, 32, '#8a7a5a'); R(7, -18, 1, 32, '#b8a478'); R(5, 13, 6, 2, '#2a2420'); R(6, -20, 4, 3, '#e8c25a'); R(9, -16, 12, 12, c); R(9, -16, 12, 1, '#e8f4f0'); R(9, -5, 12, 1, 'rgba(0,0,0,.35)'); R(13, -12, 4, 4, '#e8c25a'); R(18, -4, 3, 3, c); },
  campfire(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; for (const [p, q] of [[2, 10], [6, 12], [11, 11], [3, 6], [12, 7], [7, 5]]) { R(p, q, 3, 2, '#5a5a62'); R(p, q, 2, 1, '#7a7a84'); } R(4, 8, 8, 3, '#2a1c14'); R(5, 7, 6, 1, '#3e2a1c'); if (a) { R(6, 3, 4, 6, '#e8742a'); R(7, 1, 2, 6, '#ffb040'); R(7, 4, 2, 3, '#fff0b0'); R(5, 6, 1, 2, '#c84a1a'); R(10, 5, 1, 3, '#c84a1a'); } },
  woodpile(g, x, y) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; for (let j = 0; j < 3; j++) for (let i = 0; i < 3 - (j > 1 ? 1 : 0); i++) { const px = 1 + i * 5 + (j % 2) * 2, py = 10 - j * 4; R(px, py, 5, 4, '#5a3a22'); R(px, py, 5, 1, '#7a5230'); R(px + 1, py + 1, 3, 2, '#c8a070'); R(px + 2, py + 2, 1, 1, '#8a6038'); } },
  pumphouse(g, x, y) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(0, -10, 32, 26, '#5a5660'); R(0, -10, 32, 2, '#8a8690'); for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { R(1 + i * 8 + (j % 2) * 3, -7 + j * 6, 7, 5, (i + j) % 2 ? '#6a6670' : '#62606a'); } R(-2, -14, 36, 5, '#3a3038'); R(-2, -14, 36, 1, '#5a4a58'); R(24, -24, 5, 12, '#4a4650'); R(24, -24, 5, 1, '#7a7682'); R(4, 2, 24, 3, '#8a5a2a'); R(4, 2, 24, 1, '#c88a4a'); R(13, -2, 7, 7, '#2a2630'); R(14, -1, 5, 5, '#b03a2a'); R(16, -1, 1, 5, '#e87a5a'); R(14, 1, 5, 1, '#e87a5a'); R(4, 8, 6, 6, '#2a2630'); R(5, 9, 4, 4, '#3a8a5a'); R(6, 10, 1, 1, '#b8ffd0'); },
  stakes(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; for (let i = 0; i < (a || 1) * 16; i += 5) { R(i + 1, 2, 3, 13, '#5a3a22'); R(i + 1, 2, 1, 13, '#7a5230'); R(i + 2, 0, 1, 2, '#7a5230'); } R(0, 8, (a || 1) * 16, 1, '#3a2414'); },
  teallamp(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(7, -6, 2, 20, '#3a3038'); R(4, 13, 8, 2, '#2a2228'); R(4, -12, 8, 7, a ? '#3a3a44' : '#e8c060'); R(5, -11, 6, 5, a ? '#2a2a32' : '#fff0b0'); R(3, -13, 10, 1, '#8a7a5a'); },
  lectern(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(3, 6, 10, 9, '#c8c4d4'); R(3, 6, 10, 1, '#f0ecf8'); R(12, 7, 1, 8, '#8a8698'); R(1, 1, 14, 6, '#e8e4f0'); R(1, 1, 14, 1, '#ffffff'); R(2, 2, 12, 4, a === 1 ? '#f4eedc' : a === 2 ? '#2a2630' : '#f4eedc'); R(8, 2, 1, 4, '#b8a880'); if (a === 2) { R(4, 3, 8, 2, '#4ad8e0'); R(5, 3, 2, 1, '#d8ffff'); } else { R(3, 3, 4, 1, '#3a2e22'); R(3, 5, 3, 1, '#3a2e22'); R(10, 3, 3, 1, a === 3 ? '#a02a1a' : '#3a2e22'); } },
  canopy(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }, w = (a || 3) * 16; R(0, -20, w, 6, '#f4f2ec'); R(0, -20, w, 1, '#ffffff'); R(0, -15, w, 1, '#e8c25a'); for (let i = 0; i < w; i += 8) R(i, -14, 4, 3, '#e8c25a'); R(1, -14, 2, 28, '#d8d4e0'); R(w - 3, -14, 2, 28, '#d8d4e0'); },
  holes(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }, w = (a || 2) * 16; R(0, -12, w, 27, '#5a4630'); R(0, -12, w, 1, '#8a6c48'); R(0, 14, w, 1, '#2a2016'); for (let j = 0; j < 4; j++) for (let i = 0; i < w / 8; i++) { R(1 + i * 8, -10 + j * 6, 6, 5, '#2a2016'); if (hash(i * 3 + x, j * 7 + y) > .35) { R(2 + i * 8, -8 + j * 6, 4, 3, '#f4eedc'); R(2 + i * 8, -8 + j * 6, 4, 1, hash(i + x, j) > .7 ? '#a02a1a' : '#d8ceb0'); } } R(0, -14, w, 2, '#e8c25a'); },
  cdesk(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(0, 2, 32, 12, '#7a5c3c'); R(0, 2, 32, 2, '#a88458'); R(0, 13, 32, 1, '#3a2a1a'); R(1, 14, 3, 2, '#3a2a1a'); R(28, 14, 3, 2, '#3a2a1a'); R(4, 0, 12, 5, '#f4eedc'); R(4, 0, 12, 1, '#ffffff'); R(10, 0, 1, 5, '#b8a880'); R(5, 2, 4, 1, '#3a2e22'); R(12, 2, 3, 1, '#3a2e22'); R(20, 1, 3, 3, '#1a1420'); R(21, -2, 1, 3, '#d8d0c0'); if (a) { R(25, -3, 4, 6, '#e8c060'); R(26, -2, 2, 4, '#fff0b0'); } },
  countbook(g, x, y) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(2, 6, 28, 9, '#c8c4d4'); R(2, 6, 28, 1, '#f0ecf8'); R(0, 14, 32, 2, '#e8c25a'); R(1, -2, 30, 9, '#f4eedc'); R(1, -2, 30, 1, '#ffffff'); R(15, -2, 2, 9, '#b8a880'); for (let j = 0; j < 3; j++) { R(3, j * 2, 10, 1, '#3a2e22'); R(19, j * 2, 10, 1, j === 1 ? '#a02a1a' : '#3a2e22'); } R(0, -3, 32, 1, '#e8c25a'); },
  bedroll(g, x, y, a) { const R = (p, q, w, h, c) => { g.fillStyle = c; g.fillRect(x + p, y + q, w, h); }; R(1, 6, 14, 7, a || '#7a5ac8'); R(1, 6, 14, 1, '#e8e0d0'); R(1, 6, 4, 7, '#e8e0d0'); R(2, 8, 2, 3, '#d8b8a0'); },
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
  breaker(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 0, 48, 15, '#22262c'); R(1, 1, 46, 13, '#343a44'); R(1, 1, 46, 1, '#4a525e'); for (let i = 0; i < 7; i++) { const cx = 4 + i * 6; R(cx, 4, 4, 8, '#14181c'); R(cx + 1, i % 3 === 1 ? 8 : 5, 2, 3, i % 3 === 2 ? '#e8c25a' : '#c8ccd4'); } R(3, 13, 12, 1, '#e8c25a'); },
  locker(g, x, y, a) { const R = (aa, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + aa, y + b, w, h); }; R(1, 0, 14, 16, '#2e3a40'); R(2, 1, 12, 14, a === 1 ? '#3a4a52' : '#42545c'); R(2, 1, 12, 1, '#5a7078'); for (let i = 3; i < 7; i++) R(4, i + (i - 3), 8, 1, '#22303a'); R(11, 9, 2, 2, a === 1 ? '#e8c25a' : '#8a9aa2'); if (a === 0) { R(4, 11, 1, 1, '#1a2228'); R(11, 11, 1, 1, '#1a2228'); R(4, 13, 1, 1, '#1a2228'); R(11, 13, 1, 1, '#1a2228'); } else R(4, 11, 8, 3, a === 1 ? '#c8c0a0' : '#a8a088'); },
  spool(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(2, 3, 12, 12, '#4a3a2a'); R(3, 5, 10, 8, '#c87a3a'); for (let i = 5; i < 13; i += 2) R(3, i, 10, 1, '#8a4a20'); R(2, 3, 12, 2, '#6a5238'); R(2, 13, 12, 2, '#3a2c20'); R(7, 1, 2, 2, '#c87a3a'); },
  lantstack(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 5, 14, 10, '#5a3a22'); R(1, 5, 14, 1, '#7a5230'); R(1, 10, 14, 1, '#3a2414'); R(2, -3, 12, 8, '#6a4628'); R(2, -3, 12, 1, '#8a6038'); for (const [a, b] of [[4, -1], [9, -1], [3, 7], [7, 7], [11, 7]]) { R(a, b, 3, 3, '#e8b23a'); R(a + 1, b + 1, 1, 1, '#fff0b0'); } },
  cordon(g, x, y, w, h) { g.fillStyle = '#c8452e'; for (let i = 0; i < w * 16; i += 5) { g.fillRect(x + i, y + 7, 3, 1); g.fillRect(x + i, y + h * 16 - 8, 3, 1); } for (let i = 8; i < h * 16 - 8; i += 5) { g.fillRect(x, y + i, 1, 3); g.fillRect(x + w * 16 - 1, y + i, 1, 3); } g.fillStyle = '#3a3a40'; for (const [a, b] of [[0, 4], [w * 16 - 2, 4], [0, h * 16 - 11], [w * 16 - 2, h * 16 - 11]]) g.fillRect(x + a, y + b, 2, 6); },
  festlamp(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(7, 2, 1, 12, '#3a3038'); R(4, 13, 7, 2, '#2a2228'); R(4, 0, 7, 6, '#e8a040'); R(5, 1, 5, 4, '#ffd070'); R(6, 2, 3, 2, '#fff0b0'); },
  sign(g, x, y, t) { const w = ptextW(t) + 6, sx = Math.round(x + 8 - w / 2); g.fillStyle = '#0c0808'; g.fillRect(sx - 1, y + 4, w + 2, 11); g.fillStyle = '#c8a050'; g.fillRect(sx, y + 5, w, 9); g.fillStyle = '#1e1512'; g.fillRect(sx + 1, y + 6, w - 2, 7); ptext(g, t, sx + 3, y + 7, '#f3e3c3'); g.fillStyle = '#6a5228'; g.fillRect(sx + 2, y + 3, 1, 2); g.fillRect(sx + w - 3, y + 3, 1, 2); },
  banner(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(2, -2, 12, 1, '#e8c25a'); R(3, -1, 10, 15, '#d8dce4'); R(3, -1, 1, 15, '#aab0bc'); R(12, -1, 1, 15, '#aab0bc'); R(3, 12, 10, 2, '#e8c25a'); R(5, 14, 2, 2, '#d8dce4'); R(9, 14, 2, 2, '#d8dce4'); R(6, 3, 4, 4, '#e8c25a'); R(7, 2, 2, 6, '#e8c25a'); R(5, 4, 6, 2, '#e8c25a'); R(7, 4, 2, 2, '#1e1a2a'); R(4, 9, 8, 1, '#c8a050'); },
  label(g, x, y, t) { ptext(g, t, x + 8 - ptextW(t) / 2, y + 10, '#2a1a10'); }
};
// ---- art pass: the props that fill most of the screen, redrawn with lit tops, dark sides and hardware
Object.assign(PROPS, {
  crate(g, x, y, cold) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; const t = cold ? '#8a94a0' : '#9a7442', f = cold ? '#66707c' : '#74522e', d = cold ? '#3e4650' : '#46301a';
    R(1, 1, 14, 14, d); R(2, 1, 12, 4, t); R(2, 1, 12, 1, shade(t, 1.25)); R(2, 5, 12, 9, f); for (let i = 5; i < 14; i += 3) R(i, 5, 1, 9, d); R(2, 9, 12, 1, d); R(2, 5, 12, 1, shade(f, 1.2));
    R(1, 1, 2, 2, '#4a4a54'); R(13, 1, 2, 2, '#4a4a54'); R(1, 13, 2, 2, '#34343c'); R(13, 13, 2, 2, '#34343c'); R(1, 1, 1, 1, '#8a8a96'); R(13, 1, 1, 1, '#8a8a96');
    R(5, 10, 6, 3, '#d8d0b8'); R(6, 11, 4, 1, '#3a2a1a'); if (cold) { for (const [a, b] of [[2, 4], [5, 5], [9, 4], [12, 5], [3, 8], [13, 9], [2, 13]]) R(a, b, 1, 1, '#e8f6ff'); R(2, 1, 12, 1, '#dff0ff'); } },
  barrel(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(3, 3, 10, 12, '#4e5e40'); R(4, 2, 8, 1, '#4e5e40'); R(4, 15, 8, 1, '#2a3422'); R(3, 3, 2, 12, '#6e8058'); R(11, 3, 2, 12, '#34402a'); R(4, 1, 8, 3, '#7a8c62'); R(5, 1, 6, 1, '#9aac7e'); R(5, 2, 6, 1, '#3a4630');
    R(3, 6, 10, 1, '#2a2a30'); R(3, 11, 10, 1, '#2a2a30'); R(3, 6, 2, 1, '#6a6a74'); R(3, 11, 2, 1, '#6a6a74'); R(6, 8, 1, 2, '#e8b23a'); R(7, 8, 2, 2, '#1a1a1a'); },
  bench(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 0, 30, 4, '#5a3e2a'); R(1, 0, 30, 1, '#7e5a3c'); R(1, 3, 30, 1, '#32221a'); for (let i = 6; i < 30; i += 8) R(i, 0, 1, 4, '#32221a');
    R(1, 5, 30, 5, '#6a4a30'); R(1, 5, 30, 1, '#8e6844'); R(1, 9, 30, 1, '#3a2818'); R(1, 7, 30, 1, '#5a3e28'); R(3, 10, 2, 5, '#3a3a44'); R(27, 10, 2, 5, '#3a3a44'); R(3, 10, 1, 5, '#5e5e6a'); R(27, 10, 1, 5, '#5e5e6a'); R(2, 4, 1, 1, '#2a2a30'); R(29, 4, 1, 1, '#2a2a30'); },
  stall(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 1, 48, 14, '#3a2014'); R(0, 1, 48, 5, '#8a5a36'); R(0, 1, 48, 1, '#b07a4a'); R(0, 5, 48, 1, '#4a2c18'); R(0, 6, 48, 9, '#6a3c24'); for (let i = 5; i < 48; i += 7) R(i, 6, 1, 9, '#4a2816'); R(0, 6, 48, 1, '#8a5232');
    R(3, 0, 10, 5, '#2e2e34'); R(4, -1, 8, 2, '#4a4a54'); R(5, -1, 6, 1, '#7a7a86'); R(5, 0, 6, 1, '#c8742a'); R(6, -3, 1, 2, 'rgba(220,220,230,.5)'); R(9, -4, 1, 2, 'rgba(220,220,230,.4)');
    for (const bx of [18, 26, 34]) { R(bx, 1, 6, 3, '#e8e0d0'); R(bx + 1, 1, 4, 1, '#c8742a'); R(bx, 3, 6, 1, '#a89e8a'); } R(42, 0, 3, 4, '#c8452e'); R(42, 0, 3, 1, '#e8705a'); R(20, 9, 8, 4, '#d8c8a0'); ptext(g, '4', x + 23, y + 9, '#3a2014'); },
  lampBase(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(4, 12, 8, 3, '#22222a'); R(5, 11, 6, 1, '#3a3a44'); R(4, 12, 8, 1, '#4e4e5a'); R(7, -10, 2, 22, '#34343e'); R(7, -10, 1, 22, '#5a5a68'); R(6, 4, 4, 1, '#22222a'); R(6, -4, 4, 1, '#22222a'); R(3, -12, 10, 2, '#22222a'); R(3, -12, 10, 1, '#4e4e5a'); },
  cart(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 5, 16, 8, '#4a3a2c'); R(0, 5, 16, 1, '#7a6248'); R(0, 12, 16, 1, '#2a2018'); for (let i = 3; i < 16; i += 4) R(i, 6, 1, 6, '#32261c'); R(1, 1, 5, 5, '#7a8c8c'); R(1, 1, 5, 1, '#a8baba'); R(7, 0, 5, 6, '#9a6a3a'); R(7, 0, 5, 1, '#c8924e'); R(11, 2, 4, 4, '#6a8a5a'); R(4, 3, 3, 3, '#c8452e'); R(13, 0, 1, 3, '#c8ccd4');
    for (const wx of [1, 11]) { R(wx, 12, 4, 4, '#18161a'); R(wx + 1, 13, 2, 2, '#5a5a66'); } },
  pipes(g, x, y, w) { w = w * 16; const R = (a, b, ww, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, h); }; R(0, 1, w, 6, '#2a1a14'); R(0, 2, w, 4, '#8a5a3a'); R(0, 2, w, 1, '#c08a58'); R(0, 3, w, 1, '#a87248'); R(0, 5, w, 1, '#56341e'); R(0, 8, w, 4, '#1c2424'); R(0, 9, w, 2, '#5a7272'); R(0, 9, w, 1, '#86a2a2');
    for (let i = 5; i < w; i += 22) { R(i, 0, 3, 8, '#3a2a22'); R(i, 0, 1, 8, '#6a5244'); R(i + 1, 1, 1, 1, '#c8a070'); R(i + 1, 6, 1, 1, '#c8a070'); R(i + 9, 8, 2, 4, '#2e3a3a'); R(i + 9, 7, 2, 1, '#86a2a2'); }
    for (let i = 13; i < w; i += 31) { R(i, 6, 1, 3, '#6a3a1e'); R(i, 12, 1, 1, '#3a5a5a'); } },
  furnace(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(-2, -3, 36, 19, '#1a1010'); R(-1, -2, 34, 18, '#3e3238'); R(-1, -2, 34, 1, '#6a5a62'); R(-1, -2, 1, 18, '#5a4a52'); R(32, -2, 1, 18, '#221a1e');
    for (const [a, b] of [[1, 0], [30, 0], [1, 13], [30, 13], [10, -1], [21, -1]]) { R(a, b, 1, 1, '#b08a64'); } R(2, 2, 28, 13, '#140a08'); R(3, 3, 26, 11, '#5a1c0c'); R(3, 3, 26, 3, '#3a1208'); R(4, 9, 24, 5, '#8a2c10');
    for (let i = 5; i < 28; i += 4) { R(i, 3, 2, 11, '#120806'); R(i, 3, 1, 11, '#2e1c18'); } R(2, 8, 28, 1, '#120806'); R(13, -5, 6, 3, '#2a2226'); R(14, -4, 4, 1, '#e8b23a'); R(0, 15, 32, 1, '#0c0606'); },
  liftgate(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(-2, -4, 36, 20, '#2a2a32'); R(-1, -3, 34, 19, '#e4e2dc'); R(-1, -3, 34, 1, '#ffffff'); R(-1, -3, 1, 19, '#f8f6f0'); R(32, -3, 1, 19, '#aaa8a4'); R(-1, -1, 34, 1, '#e8c25a'); R(-1, 0, 34, 1, '#a8862e');
    R(1, 2, 30, 14, '#101014'); for (let i = 2; i < 31; i += 3) { R(i, 2, 1, 14, '#b8bcc8'); R(i + 1, 2, 1, 14, '#5a5e6a'); } R(1, 2, 30, 1, '#e8c25a'); R(1, 9, 30, 1, '#8a8e9c'); R(15, 2, 2, 14, '#e8c25a'); R(15, 2, 1, 14, '#fff0b0');
    R(13, -8, 6, 5, '#e8c25a'); R(14, -9, 4, 7, '#e8c25a'); R(12, -6, 8, 1, '#e8c25a'); R(15, -7, 2, 3, '#1e1a2a'); R(15, -6, 1, 1, '#ffffff'); R(26, 3, 4, 5, '#2a2a32'); },
  door(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, -2, 16, 18, '#2a1c14'); R(1, -2, 14, 2, '#7a5632'); R(1, -2, 14, 1, '#a07a48'); R(0, 0, 2, 16, '#6a4a2c'); R(14, 0, 2, 16, '#4a3220'); R(0, 0, 1, 16, '#8e6a3e');
    R(2, 0, 12, 16, '#4a3020'); for (let i = 5; i < 14; i += 3) R(i, 0, 1, 16, '#2e1c12'); R(2, 0, 12, 1, '#6a4830'); R(2, 4, 12, 1, '#2a2a30'); R(2, 11, 12, 1, '#2a2a30'); R(2, 4, 3, 1, '#5e5e6a'); R(11, 8, 2, 2, '#e8b23a'); R(11, 8, 1, 1, '#fff0b0'); },
  clinic(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, -2, 16, 18, '#2a3034'); R(1, -2, 14, 2, '#b8c4c4'); R(1, -2, 14, 1, '#e4eeee'); R(0, 0, 2, 16, '#8a9898'); R(14, 0, 2, 16, '#5e6a6a'); R(2, 0, 12, 16, '#3a444a'); R(2, 0, 12, 1, '#5a666c'); R(4, 2, 8, 6, '#9ad0e0'); R(4, 2, 8, 1, '#d8f4ff'); R(7, 2, 1, 6, '#3a444a');
    R(5, -8, 6, 6, '#e8ece8'); R(7, -7, 2, 4, PAL.red); R(6, -6, 4, 2, PAL.red); R(11, 10, 2, 2, '#c8ccd4'); },
  pillarBase(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(-2, 10, 20, 6, '#2a2228'); R(-1, 9, 18, 5, '#5a5058'); R(-1, 9, 18, 1, '#8a808a'); R(-1, 13, 18, 1, '#3a3038'); R(1, 5, 14, 5, '#4a4048'); R(1, 5, 14, 1, '#766c76'); R(13, 6, 2, 4, '#322a30'); R(3, 11, 1, 1, '#f0ece0'); R(6, 12, 3, 1, '#f0ece0'); R(11, 11, 1, 1, '#f0ece0'); R(7, 10, 2, 1, '#e8b23a'); },
  conveyor(g, x, y, w) { const R = (a, b, ww, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, h); }; w *= 16; R(0, 2, w, 13, '#18161c'); R(0, 2, w, 2, '#5a5a66'); R(0, 2, w, 1, '#8a8a98'); R(0, 4, w, 8, '#2a2a32'); R(0, 12, w, 2, '#3e3e4a'); for (let i = 0; i < w; i += 16) { R(i + 6, 13, 4, 3, '#4a4a56'); R(i + 6, 13, 1, 3, '#7a7a88'); R(i + 2, 12, 2, 2, '#e8b23a'); } },
  rails(g, x, y, w) { const R = (a, b, ww, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, h); }; w *= 16; for (let i = 2; i < w; i += 6) { R(i, 3, 3, 11, '#4a3420'); R(i, 3, 3, 1, '#6e5030'); R(i + 2, 4, 1, 10, '#2e2014'); } R(0, 5, w, 2, '#3a3a44'); R(0, 5, w, 1, '#8a8a98'); R(0, 11, w, 2, '#3a3a44'); R(0, 11, w, 1, '#8a8a98'); },
  orecart(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 4, 14, 9, '#2a2a32'); R(2, 5, 12, 7, '#4e4e5a'); R(2, 5, 12, 1, '#7a7a88'); R(2, 11, 12, 1, '#30303a'); for (let i = 5; i < 14; i += 4) R(i, 5, 1, 7, '#30303a'); R(3, 1, 10, 4, '#2e2420'); R(4, 0, 4, 2, '#4a3a34'); R(8, 1, 4, 2, '#3a2c28'); R(5, 0, 2, 1, '#6a5a50'); R(10, 2, 1, 1, '#e8b23a'); R(6, 3, 1, 1, '#e8b23a'); R(2, 13, 4, 3, '#18161a'); R(10, 13, 4, 3, '#18161a'); R(3, 14, 2, 1, '#6a6a76'); R(11, 14, 2, 1, '#6a6a76'); },
  rubble(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; const r = rng(x * 7 + y + 1); for (let i = 0; i < 16; i++) { const w = 5 + (r() * 7 | 0), h = 4 + (r() * 4 | 0), a = (r() * (31 - w)) | 0, b = 4 + ((r() * (26 - h)) | 0), c = ['#4e4038', '#5c4c42', '#40342e'][i % 3]; R(a + 1, b, w - 2, h, c); R(a, b + 1, w, h - 2, c); R(a + 1, b, w - 3, 1, shade(c, 1.4)); R(a, b + 1, 1, h - 3, shade(c, 1.25)); R(a + 1, b + h - 1, w - 2, 1, shade(c, .55)); } R(20, 22, 4, 3, '#8a7a4a'); R(20, 22, 4, 1, '#b8a468'); },
  valves(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(-1, -2, 50, 17, '#14181c'); R(0, -1, 48, 15, '#3c4854'); R(0, -1, 48, 1, '#6c7c8c'); R(0, -1, 1, 15, '#5a6a7a'); R(47, -1, 1, 15, '#222a32'); R(0, 13, 48, 1, '#222a32');
    for (let i = 0; i < 3; i++) { const cx = 8 + i * 16; R(cx - 4, 1, 9, 8, '#14181c'); R(cx - 3, 0, 7, 10, '#14181c'); R(cx - 3, 1, 7, 8, '#e8e0c8'); R(cx - 2, 2, 5, 6, '#f8f0d8'); R(cx, 5, 1, 1, '#1a1a1a'); R(cx + 1, 4, 1, 1, PAL.red); R(cx + 2, 3, 1, 1, PAL.red); R(cx - 2, 7, 5, 1, '#c8c0a8'); R(cx - 5, 10, 4, 3, '#14181c'); R(cx + 3, 10, 5, 4, PAL.red); R(cx + 3, 10, 5, 1, '#e8705a'); R(cx + 5, 11, 1, 2, '#6a1e14'); }
    for (const a of [1, 46]) for (const b of [0, 12]) R(a, b, 1, 1, '#9aaaba'); R(15, 0, 1, 13, '#2a343e'); R(31, 0, 1, 13, '#2a343e'); },
  freight(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(-1, -3, 34, 19, '#141418'); for (let i = 0; i < 32; i += 4) { R(i, -2, 2, 3, PAL.yellow); R(i + 2, -2, 2, 3, '#1a1a1e'); } R(0, 1, 2, 15, '#5a5e68'); R(30, 1, 2, 15, '#34363e'); R(0, 1, 1, 15, '#8a8e9a');
    R(2, 1, 28, 15, '#2a2c34'); for (let i = 2; i < 16; i += 3) { R(2, i, 28, 2, '#4a4e58'); R(2, i, 28, 1, '#6e727e'); } R(15, 1, 2, 15, '#1a1a1e'); R(4, 12, 9, 3, '#1a1a1e'); ptext(g, '3', x + 7, y + 6, PAL.yellow); R(27, 3, 4, 4, '#141418'); },
  board(g, x, y, w) { w = (w || 1) * 16; const R = (a, b, ww, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, ww, h); }; R(0, 0, w, 14, '#2a1a10'); R(1, 1, w - 2, 12, '#7a5a34'); R(1, 1, w - 2, 1, '#a07c4a'); R(2, 2, w - 4, 10, '#9a7a4a'); for (let i = 3; i < w - 3; i += 5) R(i, 3 + (i % 3), 1, 1, '#86683c');
    const cols = ['#e8e0cc', '#d8c890', '#ecd8b0', '#c8d0d8']; for (let i = 0, k = 0; i < w - 9; i += 7, k++) { const py = 3 + (k % 2) * 2; R(3 + i + 1, py + 1, 5, 6, 'rgba(30,18,10,.5)'); R(3 + i, py, 5, 6, cols[k % 4]); R(4 + i, py + 2, 3, 1, '#6a5a4a'); R(4 + i, py + 4, 2, 1, '#6a5a4a'); R(5 + i, py, 1, 1, k % 2 ? PAL.red : '#3a6a8a'); } },
  bed(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 1, 32, 31, '#22140e'); R(1, 1, 30, 5, '#6a4628'); R(1, 1, 30, 1, '#92683c'); R(1, 5, 30, 1, '#3a2414'); for (let i = 6; i < 30; i += 6) R(i, 2, 1, 3, '#3a2414'); R(2, 6, 28, 24, '#c8bca4'); R(2, 6, 28, 1, '#e8dcc4');
    R(4, 7, 12, 7, PAL.cream); R(4, 7, 12, 1, '#ffffff'); R(4, 13, 12, 1, '#c8b898'); R(17, 8, 11, 6, '#e0d4bc'); R(2, 15, 28, 15, '#2e6a6e'); R(2, 15, 28, 2, '#4a9296'); R(2, 28, 28, 2, '#1c4a4e'); for (let i = 0; i < 28; i += 7) { R(2 + i, 18, 1, 10, '#245a5e'); R(5 + i, 21, 2, 2, '#e8b23a'); } R(1, 30, 30, 2, '#4a2e1a'); R(1, 30, 30, 1, '#6a4628'); },
  table(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 2, 32, 12, '#22140e'); R(1, 2, 30, 8, '#7a5634'); R(1, 2, 30, 1, '#a47a4a'); for (let i = 5; i < 30; i += 8) R(i, 3, 1, 7, '#5e4026'); R(1, 10, 30, 3, '#4a301c'); R(1, 10, 30, 1, '#5e4026'); R(3, 13, 2, 3, '#2e1c10'); R(27, 13, 2, 3, '#2e1c10');
    R(5, 0, 5, 6, '#8a8e96'); R(5, 0, 5, 1, '#c8ccd4'); R(6, 1, 3, 1, '#3a2418'); R(10, 2, 1, 2, '#8a8e96'); R(15, 3, 9, 6, '#ece4d0'); R(16, 5, 6, 1, '#6a5a4a'); R(16, 7, 4, 1, '#6a5a4a'); R(25, 2, 2, 5, '#e8d8a0'); R(25, 1, 2, 1, '#ffb35a'); },
  hatch(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(0, 0, 16, 16, '#141418'); for (let i = 0; i < 16; i += 4) { R(i, 0, 2, 1, PAL.yellow); R(i + 2, 15, 2, 1, PAL.yellow); R(0, i + 2, 1, 2, PAL.yellow); R(15, i, 1, 2, PAL.yellow); } R(1, 1, 14, 14, '#4a505c'); R(1, 1, 14, 1, '#7a808c'); R(1, 1, 1, 14, '#6a707c'); R(14, 2, 1, 13, '#2a2e36'); R(2, 14, 13, 1, '#2a2e36');
    for (let i = 4; i < 13; i += 3) for (let j = 4; j < 13; j += 3) { R(i, j, 2, 1, '#6a707c'); R(i + 1, j + 1, 1, 1, '#30343c'); } R(6, 6, 4, 4, '#1c1e24'); R(7, 7, 2, 2, '#c8ccd4'); R(2, 2, 1, 1, '#aab0bc'); R(13, 2, 1, 1, '#aab0bc'); R(2, 13, 1, 1, '#aab0bc'); R(13, 13, 1, 1, '#aab0bc'); },
  vent(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 2, 14, 12, '#0e0c10'); R(1, 2, 14, 1, '#5e5a66'); R(1, 2, 1, 12, '#4e4a56'); R(14, 3, 1, 11, '#201e26'); R(2, 13, 13, 1, '#201e26'); for (let i = 4; i < 13; i += 2) { R(3, i, 10, 1, '#46424e'); } R(3, 4, 1, 9, '#2c2932'); R(12, 4, 1, 9, '#2c2932'); R(7, 4, 1, 9, '#2c2932'); },
  canisters(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; for (let i = 0; i < 3; i++) { const cx = 1 + i * 5; R(cx - 0, 3, 4, 13, '#1c2824'); R(cx, 3, 4, 12, '#4e7262'); R(cx, 3, 1, 12, '#7ea896'); R(cx + 3, 4, 1, 11, '#2e4a3e'); R(cx, 3, 4, 1, '#96bca8'); R(cx + 1, 1, 2, 2, '#8a8e96'); R(cx + 1, 0, 2, 1, '#c8ccd4'); R(cx, 8, 4, 2, '#e8e0c8'); R(cx + 1, 8, 1, 1, PAL.red); } },
  awning(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(-1, 5, 50, 12, '#1e100c'); for (let i = 0; i < 48; i += 8) { R(i, 6, 4, 9, PAL.red); R(i, 6, 4, 1, '#f07a62'); R(i, 13, 4, 2, '#8a2a1c'); R(i + 4, 6, 4, 9, PAL.cream); R(i + 4, 13, 4, 2, '#b8a888'); R(i, 15, 3, 1, PAL.red); R(i + 4, 15, 3, 1, PAL.cream); }
    R(8, -6, 32, 10, '#1e100c'); R(9, -5, 30, 8, '#4a2c18'); R(9, -5, 30, 1, '#7a5030'); ptext(g, 'NOODLES', x + 11, y - 3, '#ffb35a'); R(4, 4, 1, 2, '#3a3038'); R(43, 4, 1, 2, '#3a3038'); },
  cot(g, x, y) { const R = (a, b, w, h, c) => { g.fillStyle = c; g.fillRect(x + a, y + b, w, h); }; R(1, 1, 14, 14, '#4a4e54'); R(1, 1, 14, 1, '#8a8e96'); R(2, 2, 12, 12, '#d0d4cc'); R(2, 2, 12, 4, '#f0f4ec'); R(3, 3, 6, 2, '#ffffff'); R(2, 7, 12, 7, '#5a7e90'); R(2, 7, 12, 1, '#82a8ba'); R(2, 13, 12, 1, '#3a5464'); for (let i = 4; i < 13; i += 4) R(i, 8, 1, 5, '#4a6a7c'); R(1, 15, 2, 1, '#222'); R(13, 15, 2, 1, '#222'); }
});
function renderMapLayer(m) {
  const [c, g] = mk(m.w * 16, m.h * 16);
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) drawTile(g, m, x, y);
  g.fillStyle = 'rgba(6,3,5,.42)'; for (const p of m.props) if (p.block) for (const [bx, by] of p.block) { g.fillRect(bx * 16 + 1, by * 16 + 12, 15, 5); g.fillRect(bx * 16 + 3, by * 16 + 17, 12, 1); }
  for (const p of m.props) { const fn = PROPS[p.t]; if (fn) fn(g, p.x * 16, p.y * 16, p.w || p.a, p.h); }
  return c;
}
