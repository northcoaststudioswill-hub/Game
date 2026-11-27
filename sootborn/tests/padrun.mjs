// a player who knows a little, on a controller only: it walks at what it wants, fights in combos with pauses, dodges a wind-up, holds strike for ELEVEN, talks to people and takes the way out last. It reads where things are from the game (as a person reads the screen), and presses only pad buttons.
// An observer, separately, writes down where the story is, how long each part takes, and where the player got stuck.
// SECS=total seconds, STUCK=seconds without story progress before the observer notes it and moves the story on.
import { chromium } from 'playwright'; import fs from 'fs';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 } });
await ctx.addInitScript(() => { window.__pad = { b: Array(17).fill(0), a: [0, 0, 0, 0] }; const pad = () => ({ id: 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)', index: 0, connected: true, mapping: 'standard', timestamp: performance.now(), axes: __pad.a.slice(), buttons: __pad.b.map(v => ({ pressed: v > .5, touched: v > .5, value: v })) }); navigator.getGamepads = () => [pad(), null, null, null]; });
const page = await ctx.newPage(); const O = '/home/claude/shots/pad/';
const errors = []; page.on('pageerror', e => { if (errors.length < 30) errors.push(e.message.slice(0, 160)); }); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(800);
await ev(() => { window.dispatchEvent(new Event('gamepadconnected'));
  window.LOG = []; const T0 = performance.now(), L = window.L = (...a) => { const s = a.filter(x => x !== '').join(' | '); if (!LOG.length || LOG[LOG.length - 1].s !== s) LOG.push({ t: Math.round((performance.now() - T0) / 1000), s }); };
  const oc = Cutscene.card.bind(Cutscene); Cutscene.card = (c, sub, big) => { L('CARD', c, sub || ''); return oc(c, sub, big); };
  const ob = Brawl.start.bind(Brawl); Brawl.start = (def, cb) => { const k = def.walk ? 'WALK' : def.cineOnly ? 'FILM' : 'FIGHT', nm = (def.title || '') + ' ' + (def.sub || ''); L(k, nm); return ob(def, (w, ...r) => { if (k === 'FIGHT') L('  fight ' + (w ? 'won' : 'LOST'), nm); return cb && cb(w, ...r); }); };
  const om = Mission.start.bind(Mission); Mission.start = (k, d) => { L('2D LEVEL', k); return om(k, d); };
  const oi = Issue.start.bind(Issue); Issue.start = (k, d, c) => { L('3D COMIC LEVEL', k + (c ? ' (cold open)' : '')); return oi(k, d, c); };
  const op = Prelude.plate.bind(Prelude); Prelude.plate = (n, ...r) => { L('DRAWN STILL', n); return op(n, ...r); };
  const ol = Prelude.ledger.bind(Prelude); Prelude.ledger = (...r) => { L('THE COUNT (puzzle)'); return ol(...r); };
  const ot = HUD.toast.bind(HUD); HUD.toast = (t, ...r) => { L('  toast', String(t).slice(0, 90)); return ot(t, ...r); };
  window.__WHERE = () => { const G = BTS.G; return [G.mode, BTS.UI.stack.length ? 'menu' : '', BTS.Dialogue.active ? 'talk' : '', BTS.Brawl.active ? (BTS.Brawl.def.walk ? 'walk' : 'fight') : '', Issue.on ? 'level' : '', Prelude.on ? 'still' : '', BTS.Cutscene.active ? 'cine' : '', BTS.Puzzle.active ? 'puzzle' : '', Mission.def ? 'mission' : '', 'day' + G.day].filter(Boolean).join(' '); };
  window.__FORCE = () => { if (BTS.UI.stack.length) { BTS.UI.clear(); return 'menu'; } if (BTS.Dialogue.active) { BTS.Dialogue.next(); return 'dlg'; } if (Prelude.on && Prelude.gm) { Prelude.finish(); return 'ledger'; } if (Issue.on) { Issue.finish(true); return 'level'; } if (BTS.Brawl.active) { BTS.Brawl.end(!BTS.Brawl.def.doomed); return 'fight'; } if (BTS.Puzzle.active && BTS.Puzzle.solve) { BTS.Puzzle.solve(); return 'puzzle'; } if (Mission.def && BTS.G.heist === 3) { Mission.finish(); return 'mission'; } if (BTS.G.mode === 'world') { const G = BTS.G, st = G.day + ':' + (G.heist || 0); if (st === '1:1' || st === '1:2') { BTS.Game.onHeistDone(); return 'ended the relay heist'; } if (st === '1:0') { BTS.Game.dayEnd(); return 'ended the Ashgate walk-about day'; } if (st === '2:0') { BTS.Game.startFestival(); return 'jumped to the festival'; } if (st === '2:2') { BTS.Game.onFestDone(); return 'ended the lantern climb'; } return 'world ' + st + ' (no route)'; } return 'nothing'; }; });

const B = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5 };
const T0 = Date.now(), SECS = +(process.env.SECS || 3000), STUCK = +(process.env.STUCK || 120);
let lastN = 0, lastProg = Date.now(), stuckN = 0, tick = 0, combo = 0, rest = 0, holdX = 0; const notes = [];
const dump = async (tag) => { const log = await ev(() => LOG).catch(() => []); fs.writeFileSync('/tmp/pad.log', log.map(l => String(l.t).padStart(5) + 's  ' + l.s).join('\n') + '\n\n' + notes.join('\n') + '\n[' + tag + ' at ' + Math.round((Date.now() - T0) / 1000) + 's] errors: ' + JSON.stringify(errors)); return log; };
await ev(() => { window.__vis = new Set(); window.__see = () => { const G = BTS.G, Br = BTS.Brawl;
  if (BTS.UI.stack.length) return { k: 'menu' };
  if (BTS.Dialogue.active) return { k: 'dlg' };
  if (Issue.on) return { k: 'level' };
  if (Prelude.on) return { k: 'still' };
  if (Br.active && Br.cine) return { k: 'cine' };
  if (Br.active && Br.def.walk) { const w = Br.def.walk, p = Br.p, near = Br.wk && Br.wk.near; if (window.__wid !== w.id) { window.__wid = w.id; window.__vis = new Set(); }
    const ts = Br.allies.filter(a => a.talk).map(a => ({ id: 'n' + a.id + Math.round(a.x), x: a.x, y: a.y, o: a })).concat((w.spots || []).map(s2 => ({ id: 's' + s2.id, x: s2.x, y: s2.y, o: s2, exit: !!s2.exit })));
    const todo = ts.filter(t => !__vis.has(t.id) && !t.exit).sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y)); const t = todo[0] || ts.find(t => t.exit);
    if (!t) return { k: 'walk', dx: 0, dy: 0 }; const isNear = near && (near === t.o || (near.id && near.id === t.o.id));
    return { k: 'walk', dx: t.x - p.x, dy: t.y - p.y, near: !!isNear, id: t.id }; }
  if (Br.active) { const p = Br.p, f = Br.foes.filter(o => o.hp > 0 && o.st !== 'down').sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0];
    if (!f) return { k: 'fight', dx: 0, dy: 0, d: 999 }; const brk = Br.def.breaks && f.hp <= f.max * .5;
    return { k: 'fight', dx: f.x - p.x, dy: f.y - p.y, d: Math.hypot(f.x - p.x, f.y - p.y), wind: f.st === 'wind', fury: p.fury, brk, keep: !!Br.def.breaks }; }
  if (BTS.Puzzle.active) return { k: 'puzzle' };
  if (G.mode === 'world') { const W = BTS.World, pl = BTS.P || {}; let m = G.heist === 3 && Mission.mark ? Mission.mark() : G.heist === 1 ? (G.flags.relayCut ? { x: 10.5 * 16, y: 20 } : { x: 21.5 * 16, y: 7 * 16 }) : null;
    if (!m && W.map && W.map.exits && W.map.exits.length === 1) { const e = W.map.exits[0].tiles[0]; m = { x: e[0] * 16 + 8, y: e[1] * 16 + 8 }; }
    const px = pl.x || 0, py = pl.y || 0; return { k: 'world', dx: m ? m.x - px : 0, dy: m ? m.y - py : 0, tgt: !!W.target, heist: G.heist || 0 }; }
  if (BTS.Cutscene.active) return { k: 'cine' };
  return { k: String(G.mode) }; }; });
const press = async (btns, ax, ms = 110) => { const b = Array(17).fill(0); for (const k of btns) b[B[k]] = 1; await ev(([b, a]) => { __pad.b = b; __pad.a = a; }, [b, ax]); await wait(ms); await ev(h => { __pad.b = Array(17).fill(0); if (h) __pad.b[2] = 1; }, holdX > 0); };
const stick = (dx, dy, dead = 4) => { const d = Math.hypot(dx, dy); return d < dead ? [0, 0, 0, 0] : [dx / d, dy / d, 0, 0]; };
let wiggle = 0, lastSeen = '';
while (Date.now() - T0 < SECS * 1000) {
  tick++; let s; try { s = await ev(() => __see()); } catch (e) { s = { k: 'err' }; }
  if (s.k === 'menu' || s.k === 'dlg' || s.k === 'cine' || s.k === 'still' || s.k === 'title') { await press(['A'], [0, 0, 0, 0], 90); await wait(140); }
  else if (s.k === 'walk') { if (s.near) { await press(['A'], [0, 0, 0, 0]); await ev(id => __vis.add(id), s.id); await wait(300); } else { const a = stick(s.dx, s.dy); if (tick % 40 < 4) { a[0] += (Math.random() - .5); a[1] += (Math.random() - .5); } await press([], a, 160); } }
  else if (s.k === 'fight') { const a = stick(s.dx, s.dy, 26), btn = [];
    if (s.wind && s.d < 70 && Math.random() < .7) { btn.push('B'); combo = 0; }
    else if (s.fury >= 100 && (!s.keep || s.brk)) { holdX = 14; }
    else if (s.d < 46) { if (rest > 0) rest--; else { btn.push(combo % 4 === 3 ? 'Y' : 'X'); combo++; if (combo % 4 === 0) rest = 2 + (Math.random() * 3 | 0); } }
    if (holdX > 0) { holdX--; await ev(() => { __pad.b = Array(17).fill(0); __pad.b[2] = 1; }); await ev(a => { __pad.a = a; }, [0, 0, 0, 0]); await wait(120); if (!holdX) await ev(() => { __pad.b = Array(17).fill(0); }); }
    else await press(btn, a, 100); await wait(40); }
  else if (s.k === 'world') { const moving = Math.hypot(s.dx, s.dy) > 10; let a = stick(s.dx, s.dy); if (tick % 30 < 6) { wiggle = (wiggle + 1) % 4; a = [[1, 0], [0, 1], [-1, 0], [0, -1]][wiggle].concat([0, 0]); }
    const btn = s.tgt && tick % 3 === 0 ? ['A'] : []; if (s.heist && !moving) { await ev(() => { __pad.b = Array(17).fill(0); __pad.b[0] = 1; }); await wait(900); }
    await press(btn, a, 160); }
  else if (s.k === 'level') { const a = [Math.sin(tick / 40) * .4, -1, 0, 0], btn = tick % 3 === 0 ? ['X'] : tick % 11 === 0 ? ['A'] : tick % 7 === 0 ? ['Y'] : []; await press(btn, a, 120); }
  else { await press(['A'], [0, 0, 0, 0]); await wait(120); }
  if (tick % 20 === 0) {
    const log = await dump('running'), n = log.length, where = await ev(() => __WHERE()).catch(() => '?');
    if (n !== lastN) { lastN = n; lastProg = Date.now(); }
    else if (Date.now() - lastProg > STUCK * 1000) { stuckN++; const f = O + 'stuck' + String(stuckN).padStart(2, '0') + '.png'; await page.screenshot({ path: f });
      const what = await ev(() => __FORCE()).catch(e => 'err'); await ev(() => { window.__vis = new Set(); });
      notes.push(`STUCK #${stuckN} at ${Math.round((Date.now() - T0) / 1000)}s: ${STUCK}s with no progress after "${log[n - 1] && log[n - 1].s}" | screen: ${where} | shot ${f} | observer moved on: ${what}`); lastProg = Date.now(); }
    if (log.some(l => /THE END/.test(l.s))) { notes.push('reached THE END'); break; } }
  if (s.k !== lastSeen) { lastSeen = s.k; if (s.k === 'walk' || s.k === 'fight') await ev(() => { window.__vis = window.__vis || new Set(); }); }
}
await dump('end'); await browser.close();
