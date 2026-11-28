// One continuous game, New Game to the ending, with story, cutscenes, other modes and explanation cards all on.
// Usage: node tests/playthrough.js starhaven.html <outDir>   (writes log.txt and screenshots)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const out = process.argv[3], vp = process.argv[4] === 'tall' ? { width: 390, height: 844 } : { width: 844, height: 390 };
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: vp, hasTouch: true, isMobile: true });
  const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.addInitScript(() => { try { localStorage.clear(); } catch (e) {} });
  await page.goto('file://' + path.resolve(process.argv[2])); await page.waitForTimeout(400);
  await page.evaluate(() => {
    const G = SH.game, T = SH.TILE, M = SH.modes, ST = SH.STORY;
    SH.front.go(() => G.newGame(0));
    const B = window.__bot = { log: [], f: 0, shot: null, k: {}, ko: 0, hurt: 0, lastCh: -1, stuck: 0, lastX: 0, done: false, cheats: [] };
    const L = (...a) => B.log.push(`[${(B.f / 60).toFixed(0)}s ch${G.chapter}] ` + a.join(' '));
    const want = why => { B.shot = B.shot || why; };
    // record everything the player is shown
    const d0 = G.hud.dialog; G.hud.dialog = function (who, text) { if (who) L((who === 'narr' ? '   ' : who.toUpperCase() + ':'), text); return d0.apply(this, arguments); };
    const c0 = G.hud.choice; G.hud.choice = function (opts) { if (opts) { L('  CHOICE:', opts.map(o => o.text).join(' | ')); want('choice'); } return c0.apply(this, arguments); };
    const t0 = G.hud.toast; G.hud.toast = function (t) { L('  [toast]', t); return t0.apply(this, arguments); };
    const a0 = G.hud.sceneArt; G.hud.sceneArt = function (id, title) { if (id) { L('  [scene]', id, '-', title || ''); B.sceneT = B.f; } return a0.apply(this, arguments); };
    const e0 = G.hud.effects; G.hud.effects = function (list) { for (const e of list) L('  [card]', e.mem ? 'remembered: ' + e.mem : `${e.who} ${e.pts > 0 ? '+' : ''}${e.pts} (${e.why})${e.heart ? ' HEART ' + e.heart : ''}`); return e0.apply(this, arguments); };
    const g0 = G.hud.goal; let lastGoal = ''; G.hud.goal = function () { const t = G.goalText(); if (t !== lastGoal) { lastGoal = t; L('  [goal]', t); } return g0.apply(this, arguments); };
    const p0 = G.hud.prompt; let lastHint = ''; G.hud.prompt = function (t) { if (t && t !== lastHint) { lastHint = t; L('  [hint]', t.replace(/<[^>]+>/g, '')); } return p0.apply(this, arguments); };
    const k0 = G.knockout; G.knockout = function () { B.ko++; L('  !! KNOCKED OUT'); want('knockout'); return k0.apply(this, arguments); };
    const m0 = M.start; M.start = function (name, opts) { L('  [mode]', name, opts && opts.variant ? opts.variant : ''); B.modeT = B.f; return m0.apply(this, arguments); };
    const w0 = SH.arts.whisper; SH.arts.whisper = function (key) { const n = (SH.arts.said[key] || 0); const r = w0.apply(this, arguments); if ((SH.arts.said[key] || 0) > n) { const set = ST.WHISPERS[key]; L('  [whisper]', set[n % set.length].join(': ')); } return r; };
    G.frozen = true; SH.input.forced = { held: {}, pressed: {} }; M.auto = false; G.noExplain = false;
  });
  const frame = () => page.evaluate(() => {
    const G = SH.game, T = SH.TILE, M = SH.modes, B = window.__bot, inp = SH.input;
    const L = (...a) => B.log.push(`[${(B.f / 60).toFixed(0)}s ch${G.chapter}] ` + a.join(' '));
    const want = why => { B.shot = B.shot || why; };
    const one = (held, press) => { inp.forced.held = held || {}; inp.forced.pressed = {}; for (const a of press || []) inp.forced.pressed[a] = true; G.step(); B.f++; };
    for (let n = 0; n < 60 && !B.done; n++) {
      if (G.state === 'end') { B.done = true; L('== THE END SCREEN =='); want('end'); break; }
      if (G.state === 'card') { if ((B.cardT = (B.cardT || 0) + 1) === 20) want('chapter card'); if (B.cardT > 40) { B.cardT = 0; L('== CHAPTER CARD:', document.getElementById('c-label').textContent, document.getElementById('c-name').textContent, '=='); G.hud.cardGo(); } B.f++; continue; }
      if (G.state === 'explain') { if ((B.exT = (B.exT || 0) + 1) === 30) want('explain card'); if (B.exT > 60) { B.exT = 0; L('  [explain card]', document.getElementById('ex-title').textContent + ': ' + document.getElementById('ex-text').textContent); G.explainClose(); } B.f++; continue; }
      if (!G.world) { B.f++; continue; }
      const w = G.world, p = w.player, tx = p.x / T, row = Math.round(p.y / T), K = B.k;
      if (G.chapter !== B.lastCh) { B.lastCh = G.chapter; B.k = { j: 0 }; L(`== now playing chapter index ${G.chapter}, room ${w.room.def.id}, hearts ${p.hearts} ==`); want('level start'); }
      if (G.mode) {                                   // ---- the other ways of seeing
        const s = M.cur.s; let held = {}, press = null;
        if (B.f - B.modeT === 240) want('mode ' + G.mode);
        if (G.mode === 'flight') { const close = s.objs.filter(o => o.z < 0.5).sort((a, b2) => a.z - b2.z), bad = close.find(o => o.kind !== 'star' && Math.abs(o.x - s.x) < 0.34 && Math.abs(o.y - s.y) < 0.4), star = close.find(o => o.kind === 'star');
          if (bad) held[bad.x > s.x ? 'left' : 'right'] = true; else if (star) { if (star.x > s.x + 0.05) held.right = true; else if (star.x < s.x - 0.05) held.left = true; if (star.y > s.y + 0.05) held.down = true; else if (star.y < s.y - 0.05) held.up = true; }
          if ((B.f - B.modeT) % 600 === 599) want('flight later'); }
        else if (G.mode === 'mural') { const pt = s.done ? null : [[0.5, 0.14], [0.56, 0.36], [0.74, 0.38], [0.6, 0.5], [0.66, 0.72], [0.5, 0.6], [0.34, 0.72], [0.4, 0.5], [0.26, 0.38], [0.44, 0.36], [0.5, 0.14]][s.i];
          if (pt) { if (pt[0] > s.bx + 0.006) held.right = true; else if (pt[0] < s.bx - 0.006) held.left = true; if (pt[1] > s.by + 0.01) held.down = true; else if (pt[1] < s.by - 0.01) held.up = true; } }
        else if (G.mode === 'city') { const todo = ['sq_lamp', 'sq_names', 'sq_well'].find(id => !s.read[id]), LP = { sq_lamp: [210, 172], sq_names: [112, 234], sq_well: [316, 234] };
          let tgt; if (todo && M.cur.t < 2400) { tgt = LP[todo]; if (s.lore >= 0 && (B.f % 12 === 0) && !document.querySelector('#x')) press = ['jump']; if (s.read[todo] !== 1 && s.lore >= 0 && B.f % 240 === 100) want('square lore'); }
          else { const sp = s.spots[0]; tgt = [sp.x, sp.y + 34]; if (s.near === 0) press = ['jump']; }
          if (tgt[0] < s.x - 3) held.left = true; else if (tgt[0] > s.x + 3) held.right = true; if (tgt[1] < s.y - 3) held.up = true; else if (tgt[1] > s.y + 3) held.down = true; }
        one(held, press); continue;
      }
      if (G.state === 'talk') {
        if (B.sceneT != null && B.f - B.sceneT === 50) want('scene');
        if (G.talkWait <= 0) { if (G.choosing) { const i = Math.min(B.pick || 0, G.choosing.length - 1); L('  -> picks:', G.choosing[i].text); G.pick(i); B.f++; continue; } one({}, ['jump']); } else one({}, null);
        continue;
      }
      if (G.state !== 'play') { one({}, null); continue; }
      // ---- playing: a policy per place
      let held = { right: true, jump: true }, press = null;
      const near = (kind, dx, dy) => w.things.filter(e => e.kind === kind && !e.dead && !e.gone && Math.abs(e.x - p.x) < dx && Math.abs(e.y - p.y) < (dy || 40)).sort((a, b2) => Math.abs(a.x - p.x) - Math.abs(b2.x - p.x))[0];
      const fight = foe => { held = {}; p.facing = foe.x > p.x ? 1 : -1; if (Math.abs(foe.x - p.x) > 34) held[foe.x > p.x ? 'right' : 'left'] = true; if (!p.swing && B.f % 5 === 0) press = ['attack']; };
      const jumpsAt = list => { if (K.j < list.length && tx >= list[K.j][0] && p.grounded) { press = ['jump']; K.moves = list[K.j].slice(1); K.j++; } else if (K.moves && K.moves.length && !p.grounded && p.vy > -0.6 && p.dashT <= 0) press = [K.moves.shift()]; };
      const id = w.room.def.id;
      if (id === 'woods') {
        const sn = w.things.find(e => e.kind === 'snare' && !e.checked && tx >= e.x / T - 0.4), left = w.things.filter(e => e.kind === 'target' && !e.hit), wolf = w.things.find(e => e.kind === 'wolf');
        if (sn) { held = {}; if (sn.near && B.f % 6 === 0) press = ['up']; else if (!sn.near) held = { left: tx > sn.x / T + 0.3, right: tx < sn.x / T - 0.3 }; }
        else if (tx >= 60 && tx < 62 && left.length) { held = {}; p.facing = 1;
          if (left.some(e => e.y > 14.5 * T)) { if (B.f % 40 === 0) press = ['attack']; }
          else if (p.grounded && !(K.jt > 0) && B.f % 50 === 0) { press = ['jump']; held = { jump: true }; K.jt = B.f; }
          else if (K.jt > 0) { held = { jump: true }; if (p.vy > -1.2 || B.f - K.jt > 26) { press = ['attack']; K.jt = -1; } } }
        else if (tx >= 92 && wolf && !wolf.gone && !wolf.dead) { held = {}; p.facing = 1; if (wolf.state !== 'hurt' && wolf.state !== 'flee' && B.f % 40 === 0) press = ['attack']; }
        else if (tx >= 132) { held = {}; if (B.f % 40 === 0) press = ['attack']; }
        else jumpsAt([[18.6], [28.6], [42.9], [53.6], [77.4], [80.2], [108.4]]);
      } else if (id === 'deep') {
        const altar = w.things.find(e => e.kind === 'altar' && e.what === 'voice'), foe = near('thornSprite', 60, 30);
        if (!G.flags.riddle) { const dx = altar.x - p.x; held = { right: dx > 6, left: dx < -6 }; if (Math.abs(dx) <= 10 && B.f % 10 === 0) press = ['up']; }
        else if (row > 20) { held = { right: true, jump: true }; K.fell = true; if (foe) fight(foe); else if (tx >= 66) { const plan = { 30: [72, 72], 27: [70.6, 68], 24: [68.4, 72.5], 21: [73.5, 73.5], 18: [74.2, 76.6] }[row]; if (p.grounded && plan) { held = { right: tx < plan[0] - 0.2, left: tx > plan[0] + 0.2 }; if (!held.right && !held.left) { press = ['jump']; K.to = plan[1]; held = { jump: true }; } } else if (!p.grounded) held = { jump: p.vy < 0, right: tx < K.to - 0.2, left: tx > K.to + 0.3 }; } else if (p.grounded && tx > 20.6 && tx < 21.8) press = ['jump']; }
        else if (!G.flags.d_caelum && Math.abs(tx - 49.5) < 1.2 && p.grounded) { held = {}; if (B.f % 10 === 0) press = ['up']; }
        else if (!G.flags.d_rowan && Math.abs(tx - 78.4) < 1.2 && p.grounded) { held = {}; if (B.f % 10 === 0) press = ['up']; }
        else if (foe && !G.flags.maze) fight(foe);
        else jumpsAt([[22.6], [30.7], [40.7], [52.6, 'jump'], [65.6, 'jump', 'dash'], [83.6], [102.8], [116.6], [125.6], [135.6]]);
      } else if (id === 'ashes') {
        if (G.flags.arrive && !G.flags.painted && tx > 71.5 && tx < 74) held = { up: true };
        else if (G.flags.painted && tx > 90 && tx < 104.5 && p.y > 10.5 * T) { const plan = { 16: [93.0, 95.5], 14: [96.0, 99.0], 12: [100.0, 102.6] };
          if (p.grounded && plan[row]) { const from = plan[row][0]; held = { right: tx < from - 0.15, left: tx > from + 0.6 }; if (!held.right && !held.left) { held = { right: true, jump: true }; press = ['jump']; K.to = plan[row][1]; } }
          else if (!p.grounded) held = { jump: p.vy < 0, right: tx < K.to - 0.2, left: tx > K.to + 0.4 }; }
        else jumpsAt([[21.3], [29.3]]);
      } else if (id === 'ring') {
        const buds = w.things.filter(t => t.kind === 'bulb');
        if (!G.flags.combo) { const goal = G.activeGoal;
          if (goal === 'rise') { if (tx >= 22.4) { held = {}; p.facing = 1; if (!p.swing && p.grounded && B.f % 12 === 0) press = ['upstrike']; } }
          else if (goal === 'lunge') { if (p.dashT > 0) { held = { right: true }; press = ['attack']; } else if (tx > 21.2) held = { left: true }; else { held = { right: true }; if (p.grounded && p.dashCd <= 0) press = ['dash']; } }
          else if (goal === 'guard') { if (tx >= 22.4) { held = { down: true }; p.facing = 1; } else held = { right: true }; }
          else if (tx >= 22.4) { held = {}; if (!p.swing && B.f % 9 === 0) press = ['attack']; } }
        else if (!G.flags.pit) { if (tx >= 40.7 && p.grounded && tx < 42) press = ['jump'];
          if (tx > 40.7 && tx < 60) { const bud = buds.find(b2 => b2.hittable() && Math.abs(b2.x - p.x) < 26 && b2.y - p.y > -4 && b2.y - p.y < 46); if (p.vy > 0 && bud && !p.swing) { press = ['attack']; held.down = true; } if (p.swing && p.swing.kind === 'pogo') held.down = true; const next = buds.find(b2 => b2.x > p.x - 10); held.right = !next || p.x < next.x - 2 || p.vy < -4 || p.x > 57 * T; } }
        else { const alive = w.things.filter(e => e.kind === 'thornSprite' && !e.dead).sort((a, b2) => Math.abs(a.x - p.x) - Math.abs(b2.x - p.x)), foe = alive[0];
          if (G.activeGoal === 'report') { const c = w.npcs.find(n2 => n2.id === 'caelum'); K.wait = (K.wait || 0) + 1; held = { right: c.x > p.x + 10, left: c.x < p.x - 10 }; if (Math.abs(c.x - p.x) < 40 && K.wait > 90 && B.f % 10 === 0) press = ['up']; }
          else if (foe && tx > 62) { const dx = foe.x - p.x, dy = foe.y - p.y; held.right = dx > 0; held.left = dx < 0; if (Math.abs(dx) < 40 && Math.abs(dy) < 30) { held.right = held.left = false; p.facing = dx > 0 ? 1 : -1; if (!p.swing && B.f % 4 === 0) press = ['attack']; } else if (dy < -40 && Math.abs(dx) < 70 && p.grounded) press = ['jump']; } }
      } else if (id === 'mountain') {
        const boss = G.boss, braz = w.things.filter(e => e.kind === 'brazier'), unlit = braz.filter(e => !e.lit).length, foe = near('thornSprite', 70, 36) || near('wyrm', 90, 40);
        const cast = () => { if (p.pips >= 1 && p.giftCd <= 0 && !p.charging && B.f % 30 === 0) press = ['gift']; };
        if (boss && !boss.dead) {   // an honest fight: get behind it, cut it when it is open, jump its charge, leave the shadow, fire down its throat
          const dx = boss.x - p.x, st = boss.state, toward = Math.sign(dx) !== boss.dir, back = boss.x - boss.dir * (boss.w / 2 + 16);
          held = {};
          if (st === 'windup' || st === 'charge') { if (toward && Math.abs(dx) < 150 && p.grounded) { press = ['jump']; held = { jump: true, [dx > 0 ? 'right' : 'left']: true }; } else if (!p.grounded) held = { jump: true, [boss.dir > 0 ? 'left' : 'right']: true }; else held = {}; }
          else if (st === 'crouch' || st === 'leap') { const away = p.x < boss.leapX ? 'left' : 'right'; held = Math.abs(p.x - boss.leapX) < 110 ? { [away]: true } : {}; }
          else if (st === 'inhale') { if (toward) { p.facing = dx > 0 ? 1 : -1; if (p.pips >= 1 && B.f % 10 === 0) press = ['gift']; } else held = {}; }
          else if (st === 'breath') { if (toward && Math.abs(dx) < 190 && p.grounded) { press = ['jump']; held = { jump: true }; } }
          else if (st === 'roar') held = {};
          else { if (Math.abs(p.x - back) > 14) held[back > p.x ? 'right' : 'left'] = true; else { p.facing = boss.x > p.x ? 1 : -1; if (!p.swing && B.f % 5 === 0) press = ['attack']; } }
          if (B.f % 900 === 0) want('boss fight');
        }
        else if (!G.flags.giftgot) held = { right: tx < 6 };
        else if (unlit > 0 && !G.flags.flame) { if (unlit >= 2 || braz.filter(e => !e.lit).some(e => e.y > 14 * T)) { held = { left: tx > 9.8, right: tx < 9.2 }; if (!held.left && !held.right) { held = {}; p.facing = 1; cast(); } }
          else if (row === 12) { held = { left: tx > 20.6, right: tx < 19.8 }; if (!held.left && !held.right) { held = {}; p.facing = 1; cast(); } }
          else { held = { left: tx > 18.9, right: tx < 18.3 }; if (!held.left && !held.right && p.grounded) { press = ['jump']; held = { jump: true, right: true }; K.dj = 1; } if (!p.grounded) { held = { jump: true, right: tx < 20.2 }; if (K.dj && p.vy > -0.6) { press = ['jump']; K.dj = 0; } } } }
        else if (!G.flags.wall) { if (row === 12 && tx < 26) held = { right: true }; else { held = { left: tx > 30.6, right: tx < 29.8 }; if (!held.left && !held.right) { held = {}; p.facing = 1; cast(); } } }
        else if (foe) { if (foe.kind === 'wyrm' && (foe.state === 'windup' || foe.state === 'charge') && Math.sign(foe.x - p.x) !== foe.dir && Math.abs(foe.x - p.x) < 120) { held = { jump: true }; if (p.grounded) press = ['jump']; } else fight(foe); }
        else jumpsAt([[47.3], [55.3], [63.4], [115]]);
      }
      else if (id === 'library') {
        const spies = w.things.filter(e => e.kind === 'spy' && !e.dead && e.active()), boss = G.boss, bow = () => (p.bowCd <= 0 && B.f % 6 === 0 ? ['bow'] : null);
        held = {};
        if (!G.flags.bow4) held = { right: true };
        else if (boss && !boss.dead) {
          const st = boss.state, dx = boss.x - p.x;
          if (st === 'grounded' || st === 'fall') { if (Math.abs(dx) > 30) held[dx > 0 ? 'right' : 'left'] = true; else { p.facing = Math.sign(dx) || 1; if (!p.swing && B.f % 5 === 0) press = ['attack']; } }
          else if (st === 'volley') held = { down: true };
          else if (st === 'swoop') { if (Math.abs(dx) < 110 && p.grounded && Math.sign(boss.vx) === -Math.sign(dx)) { press = ['jump']; held = { jump: true }; } else if (!p.grounded) held = { jump: true }; }
          else press = bow();
          if (B.f % 600 === 0) want('boss fight');
        } else {
          const down = spies.find(e => e.state === 'down');
          if (down) { const dx = down.x - p.x; if (Math.abs(dx) > 26) held[dx > 0 ? 'right' : 'left'] = true; else if (!p.swing && B.f % 5 === 0) press = ['attack']; }
          else if (spies.length) { const sp = spies.sort((a, b2) => Math.abs(a.x - p.x) - Math.abs(b2.x - p.x))[0], dx = sp.x - p.x; if (sp.state === 'mark' || sp.state === 'dive') held = { down: true }; else if (Math.abs(dx) > 150) held[dx > 0 ? 'right' : 'left'] = true; else if (Math.abs(dx) < 40) held[dx > 0 ? 'left' : 'right'] = true; else press = bow(); if (B.f % 400 === 0) want('spies'); }
          else held = { right: true };
        }
      }
      // unstick: if she has not moved for two seconds while the bot wants to go right, jump forward
      if (B.f % 120 === 0) { if (Math.abs(p.x - (K.sx || 0)) < 6 && p.grounded && !(G.boss && !G.boss.dead)) K.unstick = 40; K.sx = p.x; }
      if (K.unstick > 0) { K.unstick--; held = { right: true, jump: true }; if (K.unstick === 39 || K.unstick === 20) press = ['jump']; }
      // progress watch
      if (B.f % 600 === 0) { want('every 10s of play'); if (Math.abs(p.x - B.lastX) < 30 && !(G.boss && !G.boss.dead)) { B.stuck++; L(`  ?? not moving for 10s at tile ${tx.toFixed(1)},${row} goal=${G.activeGoal} hearts=${p.hearts}`); } else B.stuck = 0; B.lastX = p.x; }
      one(held, press);
    }
    SH.test.render();
    const r = { shot: B.shot, f: B.f, done: B.done, ch: G.chapter, stuck: B.stuck, state: G.state, ko: B.ko, bossHp: G.boss ? G.boss.hp : null }; B.shot = null; return r;
  });
  let n = 0, last = null, bossStart = 0;
  for (let i = 0; i < 4000; i++) {
    const r = await frame(); last = r;
    if (r.shot) { await page.screenshot({ path: `${out}/p-${String(n).padStart(3, '0')}.png` }); await page.evaluate(([n, why]) => window.__bot.log.push(`  <<shot ${n}: ${why}>>`), [n, r.shot]); n++; }
    if (r.bossHp != null && !bossStart) bossStart = r.f;
    if (r.bossHp != null && r.f - bossStart > 60 * 360) { await page.evaluate(() => { const B = window.__bot, G = SH.game; B.log.push(`  ## BOT COULD NOT BEAT THE BOSS in 6 minutes: boss hp ${G.boss.hp}, knockouts so far ${B.ko}. Killing it to see the rest.`); G.boss.damage(999, G.world); }); bossStart = 1e12; }
    if (r.stuck >= 4) { const fixed = await page.evaluate(() => { const B = window.__bot, G = SH.game, p = G.world.player; B.log.push(`  ## BOT STUCK for 40s at tile ${(p.x / SH.TILE).toFixed(1)}, ${Math.round(p.y / SH.TILE)} in ${G.world.room.def.id}, goal ${G.activeGoal}. Stopping.`); return true; }); await page.screenshot({ path: `${out}/p-stuck.png` }); break; }
    if (r.done) break;
  }
  const log = await page.evaluate(() => window.__bot.log.join('\n') + `\n\nframes ${window.__bot.f}, knockouts ${window.__bot.ko}`);
  fs.writeFileSync(`${out}/log.txt`, log + '\n\nerrors: ' + JSON.stringify(errs));
  console.log('shots', n, 'last', JSON.stringify(last), 'errors', errs.length);
  await b.close();
})();
