// a blind player: a controller and the screen, nothing else. It never reads game state to decide.
// An observer, separately, writes down where the story is, how long each part takes, and where the player got stuck.
// SECS=total seconds, STUCK=seconds without story progress before the observer notes it and moves the story on.
import { chromium } from 'playwright'; import fs from 'fs';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 } });
await ctx.addInitScript(() => { window.__pad = { b: Array(17).fill(0), a: [0, 0, 0, 0] }; const pad = () => ({ id: 'Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)', index: 0, connected: true, mapping: 'standard', timestamp: performance.now(), axes: __pad.a.slice(), buttons: __pad.b.map(v => ({ pressed: v > .5, touched: v > .5, value: v })) }); navigator.getGamepads = () => [pad(), null, null, null]; });
const page = await ctx.newPage(); const O = '/home/claude/shots/blind/';
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
// the player's hands
const pad = (b, a) => ev(([b, a]) => { if (b) __pad.b = b; if (a) __pad.a = a; }, [b, a]);
const B = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, START: 9 };
let menuLast = false, dir = [0, 0], dirT = 0, holdX = 0, tick = 0, r = Math.random;
const T0 = Date.now(), SECS = +(process.env.SECS || 3000), STUCK = +(process.env.STUCK || 180);
let lastN = 0, lastProg = Date.now(), stuckN = 0, shotT = 0, titleN = 0; const notes = [];
const dump = async (tag) => { const log = await ev(() => LOG).catch(() => []); fs.writeFileSync('/tmp/blind.log', log.map(l => String(l.t).padStart(5) + 's  ' + l.s).join('\n') + '\n\n' + notes.join('\n') + '\n[' + tag + ' at ' + Math.round((Date.now() - T0) / 1000) + 's] errors: ' + JSON.stringify(errors)); return log; };
while (Date.now() - T0 < SECS * 1000) {
  tick++;
  if (Date.now() > dirT) { const k = r(); dir = k < .2 ? [0, 0] : k < .45 ? [1, 0] : k < .6 ? [-1, 0] : k < .8 ? [0, -1] : [0, 1]; if (r() < .3) dir = [dir[0] * .7 + (r() - .5), dir[1] * .7 + (r() - .5)]; dirT = Date.now() + 800 + r() * 2200; }
  const menu = tick % 3 === 0 ? await ev(() => !!BTS.UI.stack.length).catch(() => false) : menuLast; menuLast = menu;  /* a person reads a menu: the bot does not wander it, it takes the highlighted line */
  const b = Array(17).fill(0), k = menu ? 0 : r(); if (menu) dir = [0, 0];
  if (holdX > 0) { b[B.X] = 1; holdX--; }
  else if (k < .30) b[B.A] = 1; else if (k < .58) b[B.X] = 1; else if (k < .66) b[B.Y] = 1; else if (k < .72) b[B.B] = 1; else if (k < .75) b[B.RB] = 1; else if (k < .78) b[B.LB] = 1; else if (k < .785) holdX = 18;
  await pad(b, [dir[0], dir[1], 0, 0]); await wait(110); await pad(Array(17).fill(0).map((v, i) => (i === B.X && holdX > 0 ? 1 : 0)), null); await wait(80);
  if (tick % 25 === 0) {
    const log = await dump('running'), n = log.length, where = await ev(() => __WHERE()).catch(() => '?');
    if (/^title/.test(where) && n > 3) { titleN++; if (titleN % 20 === 1) notes.push(`[${Math.round((Date.now() - T0) / 1000)}s] the player is on the title screen again (after: ${log[n - 1] && log[n - 1].s})`); }
    if (n !== lastN) { lastN = n; lastProg = Date.now(); }
    else if (Date.now() - lastProg > STUCK * 1000) { stuckN++; const f = O + 'stuck' + String(stuckN).padStart(2, '0') + '.png'; await page.screenshot({ path: f });
      const what = await ev(() => __FORCE()).catch(e => 'err');
      notes.push(`STUCK #${stuckN} at ${Math.round((Date.now() - T0) / 1000)}s: ${STUCK}s with no progress after "${log[n - 1] && log[n - 1].s}" | screen: ${where} | shot ${f} | observer moved on: ${what}`); lastProg = Date.now(); }
    if (Date.now() - shotT > 120000) { shotT = Date.now(); await page.screenshot({ path: O + 't' + String(Math.round((Date.now() - T0) / 1000)).padStart(5, '0') + '.png' }); }
    if (log.some(l => /THE END/.test(l.s))) { notes.push('reached THE END'); break; } }
}
await dump('end'); await browser.close();
