// GOT NEXT — Sharpie's book: what you actually do with the ball, kept across every game you play (and, apart, the back
// lot). Every jumper by zone, catch-and-shoot or off the dribble, step-backs, fades, floaters, open or with a hand in
// your face; every finish (layups and dunks, made or not); which way you drive; the moves you lean on. It lives in your
// save, so it builds game after game. Sharpie reads it back to you at the back lot, in his own words.
'use strict';
const VIP_ZONES = { paint: 'Paint', midL: 'Left elbow / baseline', midC: 'Top of the key (mid)', midR: 'Right elbow / baseline', cornerL: 'Left corner three', wingL: 'Left wing three', top: 'Top three', wingR: 'Right wing three', cornerR: 'Right corner three' };
function vipBucket() { return { z: {}, cs: [0, 0], pu: [0, 0], sb: [0, 0], fd: [0, 0], fl: [0, 0], op: [0, 0], ct: [0, 0], fin: {}, dunk: [0, 0], blk: 0, drv: { L: 0, R: 0 }, mv: {}, sh: { three: 0, mid: 0, close: 0, fin: 0 } }; }
function vipData() { if (!S) return null; if (!S.vip || S.vip.v !== 1) S.vip = { v: 1, g: vipBucket(), p: vipBucket(), games: 0 }; return S.vip; }
function vipOn(p) { return MT && p && p === MT.me && !MT.replay && !MT.drill && MT.practice !== 'dev'; }
function vipB() { const V = vipData(); return MT && MT.practice ? V.p : V.g; }
const vipAdd = (a, made) => { a[1]++; if (made) a[0]++; };
// where a shot came from (court coordinates: the rim at the origin, the floor toward +z; +x is the right side of the floor as you look at the rim from the top)
function vipZone(x, z, kind) {
  const d = Math.hypot(x, z); if (kind === 'close' || d < 2.3) return 'paint';
  if (kind === 'three') { if (Math.abs(x) > 5.9 && z < 2.6) return x > 0 ? 'cornerR' : 'cornerL'; const a = Math.atan2(x, z); return a > 0.45 ? 'wingR' : a < -0.45 ? 'wingL' : 'top'; }
  const a = Math.atan2(x, z); return a > 0.5 ? 'midR' : a < -0.5 ? 'midL' : 'midC';
}
function vipShot(p, s) {
  if (!vipOn(p)) return; const b = vipB(), zn = vipZone(p.x, p.z, s.kind);
  vipAdd(b.z[zn] || (b.z[zn] = [0, 0]), s.make); b.sh[s.kind] = (b.sh[s.kind] || 0) + 1;
  vipAdd(s.cs ? b.cs : b.pu, s.make); if (s.step) vipAdd(b.sb, s.make); if (s.fade) vipAdd(b.fd, s.make); if (s.flo) vipAdd(b.fl, s.make); vipAdd(s.c >= 0.25 ? b.ct : b.op, s.make);
  save();
}
function vipFin(p, kind, made, c) { if (!vipOn(p)) return; const b = vipB(); if (kind === 'dunk') vipAdd(b.dunk, made); else vipAdd(b.fin[kind] || (b.fin[kind] = [0, 0]), made); b.sh.fin++; vipAdd((b.z.paint || (b.z.paint = [0, 0])), made); vipAdd(c >= 0.25 ? b.ct : b.op, made); save(); }
function vipBlocked(p) { if (!vipOn(p)) return; vipB().blk++; }
function vipMove(p, id) { if (!vipOn(p) || !id) return; const m = vipB().mv; m[id] = (m[id] || 0) + 1; }
function vipGame() { const V = vipData(); if (V) { V.games++; save(); } }
// a drive: the man with the ball attacking the rim at speed from the perimeter. Counted once per attack, by the side
// he goes to (his own right or left as he faces the rim).
function vipTick(p) {
  if (!vipOn(p)) return; const B = MT.B, d = dHoop(p);
  if (B.holder !== p || d > 7.8) { p.vipDrv = false; return; }
  if (p.vipDrv || d < 2.2) return;
  const sp = Math.hypot(p.vx, p.vz); if (sp < 3.0) return;
  const fx = -p.x / (d || 1), fz = -p.z / (d || 1), toward = p.vx * fx + p.vz * fz; if (toward < sp * 0.55) return;
  const right = p.vx * -fz + p.vz * fx;      /* the facing direction's right-hand side (a body facing +z has its right hand at -x) */
  if (Math.abs(right) < 0.6) return;
  p.vipDrv = true; vipB().drv[right > 0 ? 'R' : 'L']++;
}
// ---------- Sharpie reads it to you ----------
const pctOf = a => a && a[1] ? Math.round(a[0] / a[1] * 100) : null;
function vipLines(b, name) {
  const L = [], jumpers = (b.sh.three || 0) + (b.sh.mid || 0), fins = b.sh.fin || 0, tot = jumpers + fins;
  if (tot < 8) return ['I need more than that. Go play. I don\'t write about strangers.'];
  const holeShare = fins / tot, th = (b.sh.three || 0) / tot, p3 = pctOf(sumZ(b, ['cornerL', 'cornerR', 'wingL', 'wingR', 'top'])), pPaint = pctOf(b.z.paint);
  if (holeShare >= 0.5) L.push(`You go to the hole ${Math.round(holeShare * 100)}% of the time. ${pPaint !== null && pPaint >= 55 ? 'And you finish. Keep eating.' : 'You get there. You just don\'t finish. Get stronger or get craftier.'}`);
  else if (holeShare <= 0.25) L.push(`Only ${Math.round(holeShare * 100)}% of your looks are at the rim. You live on jumpers. Defense knows it.`);
  if (th >= 0.4) L.push(p3 !== null && p3 < 30 ? `${Math.round(th * 100)}% of your shots are threes and you hit ${p3}% of them. Stop it.` : `Shooter. ${Math.round(th * 100)}% threes at ${p3}%. They should guard you at half court.`);
  const dl = b.drv.L, dr = b.drv.R, dn = dl + dr; if (dn >= 6) { const side = dr >= dl ? 'right' : 'left', pc = Math.round(Math.max(dl, dr) / dn * 100); L.push(pc >= 65 ? `You drive ${side} ${pc}% of the time. Anybody with eyes is sitting on your ${side} hand.` : `Drives split ${Math.round(dr / dn * 100)} right, ${Math.round(dl / dn * 100)} left. Can't sit on you. Good.`); }
  const cs = pctOf(b.cs), pu = pctOf(b.pu); if (b.cs[1] >= 5 && b.pu[1] >= 5) L.push(cs - pu >= 10 ? `Catch and shoot: ${cs}%. Off the bounce: ${pu}%. Let the ball find you.` : pu - cs >= 10 ? `You shoot better off the dribble (${pu}%) than off the catch (${cs}%). Create, then.` : `Off the catch ${cs}%, off the bounce ${pu}%. Same shooter either way.`);
  const op = pctOf(b.op), ct = pctOf(b.ct); if (b.ct[1] >= 6) { const cr = b.ct[1] / (b.ct[1] + b.op[1]); if (cr >= 0.45) L.push(`${Math.round(cr * 100)}% of your shots have a hand in them, and you hit ${ct}% of those. Move the ball.`); }
  if (b.sb[1] >= 4) L.push(`The step-back: ${b.sb[1]} times, ${pctOf(b.sb)}%. ${pctOf(b.sb) >= 40 ? 'That\'s your money.' : 'That\'s a habit, not a weapon.'}`);
  const mv = Object.entries(b.mv).sort((a, c) => c[1] - a[1]); if (mv.length && mv[0][1] >= 5) { const m = MOVE[mv[0][0]]; L.push(`Favorite move: ${m ? m.n : mv[0][0]} (${mv[0][1]} times). ${mv.length === 1 ? 'Only move, really. Learn another one.' : ''}`); }
  if (b.blk >= 5) L.push(`Blocked ${b.blk} times. Some of those, you jumped into a grown man. Pump fake once in your life.`);
  if (b.dunk[1] >= 3) L.push(`Dunks: ${b.dunk[0]} of ${b.dunk[1]}. ${pctOf(b.dunk) >= 80 ? 'Throw it down.' : 'If it\'s not going down, lay it in.'}`);
  return L.length ? L : ['Balanced. Boring, but balanced. Nothing for me to sell.'];
}
function sumZ(b, ks) { const a = [0, 0]; for (const k of ks) if (b.z[k]) { a[0] += b.z[k][0]; a[1] += b.z[k][1]; } return a; }
// the shot chart: a half court seen from above (the rim at the top), a dot per zone sized by attempts, coloured by how you shoot from there
function vipChart(b) {
  const W_ = 300, H_ = 230, u = 18, X = x => W_ / 2 + x * u, Y = z => 22 + z * u, pos = { paint: [0, 1.3], midL: [-3.6, 2.3], midC: [0, 4.6], midR: [3.6, 2.3], cornerL: [-7, 0.6], wingL: [-5.2, 5.2], top: [0, 7.6], wingR: [5.2, 5.2], cornerR: [7, 0.6] };
  let max = 1; for (const k in pos) if (b.z[k]) max = Math.max(max, b.z[k][1]);
  let s = `<svg viewBox="0 0 ${W_} ${H_}" width="100%" style="max-width:420px;display:block;margin:6px auto;background:#1c1d22;border-radius:6px">`;
  s += `<g fill="none" stroke="#ece9e2" stroke-opacity=".5" stroke-width="2"><line x1="0" y1="${Y(-0.8)}" x2="${W_}" y2="${Y(-0.8)}"/><rect x="${X(-2.45)}" y="${Y(-0.8)}" width="${4.9 * u}" height="${5.8 * u}"/><path d="M ${X(-6.6)} ${Y(-0.8)} L ${X(-6.6)} ${Y(1.4)} A ${6.75 * u} ${6.75 * u} 0 0 0 ${X(6.6)} ${Y(1.4)} L ${X(6.6)} ${Y(-0.8)}"/><circle cx="${X(0)}" cy="${Y(0)}" r="6" stroke="#ff6a3d"/></g>`;
  for (const [k, [x, z]] of Object.entries(pos)) { const a = b.z[k]; if (!a || !a[1]) { s += `<circle cx="${X(x)}" cy="${Y(z)}" r="5" fill="#3a3c44"/>`; continue; }
    const pc = a[0] / a[1], col = pc >= 0.5 ? '#33ff88' : pc >= 0.4 ? '#f2c14e' : pc >= 0.3 ? '#ff9a3c' : '#ff4a5a', r = 7 + 14 * Math.sqrt(a[1] / max);
    s += `<circle cx="${X(x)}" cy="${Y(z)}" r="${r.toFixed(1)}" fill="${col}" fill-opacity=".85"/><text x="${X(x)}" y="${Y(z) + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#0a0a0c">${Math.round(pc * 100)}</text>`; }
  return s + '</svg>';
}
function uiVip() {
  const V = vipData(); const st = { which: 'g' };
  openPanel(() => {
    const b = V[st.which], name = esc(S.name || 'YOU'), jumpers = (b.sh.three || 0) + (b.sh.mid || 0), tot = jumpers + (b.sh.fin || 0);
    let h = `<div class="ph"><h2>SHARPIE'S BOOK · ${name}</h2>${Btn('✕', uiClose, 'alt sm')}</div><div class="tabs">${Btn('IN GAMES (' + V.games + ')', () => { st.which = 'g'; rerender(true); }, st.which === 'g' ? 'sel' : 'alt')}${Btn('THE BACK LOT', () => { st.which = 'p'; rerender(true); }, st.which === 'p' ? 'sel' : 'alt')}</div><div class="pb">`;
    h += `<div class="card sel"><h3>THE READ</h3>${vipLines(b, name).map(l => `<p>“${esc(l)}”</p>`).join('')}</div>`;
    h += `<div class="card"><h3>SHOT CHART <span class="mu">· ${tot} shots · green hot, red cold</span></h3>${vipChart(b)}</div>`;
    const row = (n, a, extra) => `<tr><td>${n}</td><td>${a[1] ? a[0] + '/' + a[1] : '—'}</td><td>${a[1] ? pctOf(a) + '%' : ''}</td><td class="mu">${extra || ''}</td></tr>`;
    const dn = b.drv.L + b.drv.R, lay = Object.values(b.fin).reduce((t, a) => [t[0] + a[0], t[1] + a[1]], [0, 0]);
    h += `<div class="card"><h3>TENDENCIES</h3><table>${row('Catch and shoot', b.cs)}${row('Off the dribble', b.pu)}${row('Step-backs', b.sb)}${row('Fadeaways', b.fd)}${row('Floaters', b.fl)}${row('Open looks', b.op)}${row('Contested', b.ct)}${row('Layups', lay)}${row('Dunks', b.dunk)}</table>`
      + `<p style="margin-top:8px">Drives: <b>${dn ? Math.round(b.drv.R / dn * 100) + '% right · ' + Math.round(b.drv.L / dn * 100) + '% left' : 'none yet'}</b> · Blocked: <b>${b.blk}</b></p>`
      + `<p>Moves: ${Object.entries(b.mv).sort((a, c) => c[1] - a[1]).slice(0, 4).map(([id, n]) => `<b>${esc((MOVE[id] && MOVE[id].n) || id)}</b> ×${n}`).join(' · ') || '<span class="mu">none yet</span>'}</p></div>`;
    h += `<p class="mu">He writes down what you do in every game (and, separately, out here on the lot). It stays in your save.</p>`;
    return h + `</div>`;
  });
}
