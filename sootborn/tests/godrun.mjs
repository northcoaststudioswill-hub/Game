import { chromium } from 'playwright'; import fs from 'fs';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => { if (errors.length < 12) errors.push(e.message.slice(0, 160)); }); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600); await page.keyboard.press('Enter'); await wait(1500);
await ev(() => {
  window.LOG = []; const L = window.L = (...a) => { const s = a.filter(x => x !== '').join(' | '); if (LOG[LOG.length - 1] !== s) LOG.push(s); };
  const oc = Cutscene.card.bind(Cutscene); Cutscene.card = (c, sub, big) => { L('CARD', c, sub || ''); return oc(c, sub, big); };
  const ob = Brawl.start.bind(Brawl); Brawl.start = (def, cb) => { L(def.walk ? 'WALK ' : def.cineOnly ? 'FILM ' : 'FIGHT', def.title || '', def.sub || '', (def.bg || 'ring') + (def.d2 || !/valley|ford|keep|cell|storm|hall|crown|stair|riser|deck|gallery|spire/.test(def.bg || '') ? ' (2D)' : ' (3D)') + (def.doomed ? ' cannot be won' : '')); return ob(def, cb); };
  const op = Brawl.playCine.bind(Brawl); Brawl.playCine = (shots, cb, ...r) => { for (const s of shots || []) if (s.big) L('  film title', s.big, s.cap || ''); return op(shots, cb, ...r); };
  const om = Mission.start.bind(Mission); Mission.start = (k, d) => { L('2D LEVEL', k); return om(k, d); };
  const oi = Issue.start.bind(Issue); Issue.start = (k, d, c) => { L('3D COMIC LEVEL', k + (c ? ' (cold open: a slice)' : '')); return oi(k, d, c); }; { const op = Prelude.plate.bind(Prelude); Prelude.plate = (n, s2, d) => { L('DRAWN STILL', n); return op(n, s2, d); }; }
  const ot = HUD.toast.bind(HUD); HUD.toast = (t, ...r) => { if (/after the furnace|before the furnace/i.test(t)) L('  toast', t); return ot(t, ...r); };
  window.__STEP = () => { const G = BTS.G, lab = i => (typeof i.label === 'function' ? i.label() : i.label) || '';
    if (BTS.UI.stack.length) { const m = BTS.UI.stack[BTS.UI.stack.length - 1], its = (m.items || []).filter(i => i.act && !(i.disabled && i.disabled())); const pick = its.find(i => /Begin Part Two|Continue|Wake up|Sleep|Next|Go on|Carry on/i.test(lab(i))) || its.find(i => !/Back|Save|Export|Import|Settings|title|Stay|Explore|Codex|Memories|Dev|About|New game|Chapter/i.test(lab(i))); if (pick) { L('MENU', (m.opts && m.opts.title) || '(menu)', '-> ' + lab(pick)); pick.act(); return 'menu'; } return 'menu?' + its.map(lab).join('/'); }
    if (BTS.Dialogue.active) { const b = [...document.querySelectorAll('button')].find(x => x.offsetParent && x.closest('#dlg')); if (BTS.Dialogue.choices && b) b.click(); else BTS.Dialogue.next(); return 'dlg'; }
    if (BTS.Puzzle.active) return 'puzzle';
    if (Issue.on) { Issue.finish(true); return 'level'; }
    if (BTS.Brawl.active) { const B = BTS.Brawl; if (B.cine) { B.tap = true; return 'film'; } B.end(!B.def.doomed); return 'fight'; }
    if (G.heist === 3 && Mission.def && G.mode === 'world') { Mission.finish(); return 'mission'; }
    if (BTS.Cutscene.active) return 'cine';
    if (G.mode === 'world') return 'world:' + G.day + ':' + (G.heist || 0);
    return String(G.mode); };
});
for (let i = 0; i < 60 && !(await ev(() => BTS.G.mode === 'title' || BTS.UI.stack.length)); i++) { await ev(() => { if (BTS.Brawl.active) BTS.Brawl.tap = true; }); await page.keyboard.press('Enter'); await wait(250); }
await ev(() => { L('--- NEW GAME ---'); BTS.UI.clear(); BTS.Game.newGame(); });
const T0 = Date.now(), seen = {}; let last = '', same = 0, lastLog = 0;
while (Date.now() - T0 < (+process.env.SECS || 540) * 1000) {
  let st; try { st = await ev(() => __STEP()); } catch (e) { st = 'err ' + e.message.slice(0, 80); }
  if (st === 'cine') { await page.keyboard.press('Enter'); await wait(70); }
  else if (st.startsWith('world:')) { seen[st] = (seen[st] || 0) + 1; const n = seen[st];
    if (n === 12) await ev(st => { const G = BTS.G; if (st === 'world:1:1') { L('FREE PLAY: the relay heist (stealth, bot jumps it)'); BTS.Game.onHeistDone(); } else if (st === 'world:1:0') { L('FREE PLAY: Ashgate, the walk-about day (bot jumps to its end)'); BTS.Game.dayEnd(); } else if (st === 'world:2:0') { L('FREE PLAY: First Fire, the walk-about day (bot jumps to the festival)'); BTS.Game.startFestival(); } else if (st === 'world:2:2') { L('FREE PLAY: the lantern climb (stealth, bot jumps it)'); BTS.Game.onFestDone(); } else L('WORLD, no route: ' + st + ' ' + (document.querySelector('#obj span') || {}).textContent); }, st);
    if (n > 200) { await ev(st => L('STUCK in ' + st), st); break; } await wait(60); }
  else await wait(st === 'dlg' ? 25 : 60);
  if (st === last) same++; else { same = 0; last = st; } if (same > 900 && !st.startsWith('world')) { await ev(st => L('STUCK: ' + st), st); break; }
  if (Date.now() - lastLog > 4000) { lastLog = Date.now(); fs.writeFileSync('/tmp/godrun.log', (await ev(() => LOG)).join('\n') + '\n[' + st + '] errors: ' + JSON.stringify(errors)); if (await ev(() => LOG.some(l => /THE END/.test(l)) && BTS.G.mode === 'title')) break; }
}
fs.writeFileSync('/tmp/godrun.log', (await ev(() => LOG)).join('\n') + '\n[end ' + last + ' after ' + Math.round((Date.now() - T0) / 1000) + 's] errors: ' + JSON.stringify(errors)); await browser.close();
