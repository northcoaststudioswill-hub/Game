import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { BTS.UI.clear(); BTS.Game.newGame(); BTS.Cutscene.skip(); }); await wait(1500);
console.log('heist', await ev(() => [BTS.G.heist, BTS.G.mapId]));
const held = new Set(); const hold = async (k, on) => { if (on && !held.has(k)) { held.add(k); await page.keyboard.down(k); } if (!on && held.has(k)) { held.delete(k); await page.keyboard.up(k); } };
const stop = async () => { for (const k of [...held]) await hold(k, false); };
const info = (tx, ty) => ev(([tx, ty]) => { const P = BTS.P, W = BTS.World; const safeAt = (x, y) => { const ox = P.x, oy = P.y; P.x = x; P.y = y; const r = !W.npcs.some(n => n.patrol && W.seesPlayer(n)); P.x = ox; P.y = oy; return r; };
  const dx = tx - P.x, dy = ty - P.y, d = Math.hypot(dx, dy) || 1; return { x: P.x, y: P.y, d, here: safeAt(P.x, P.y), ahead: safeAt(P.x + dx / d * 14, P.y + dy / d * 14) && safeAt(P.x + dx / d * 28, P.y + dy / d * 28), alert: W.alert || 0, caught: BTS.G.flags.caught | 0, close: BTS.G.flags.closeCalls | 0, dlg: BTS.Dialogue.active, puzzle: BTS.Puzzle.active, relay: !!BTS.G.flags.relayCut }; }, [tx, ty]);
async function goto(tx, ty, label) { tx = tx * 16 + 8; ty = ty * 16 + 12; const t0 = Date.now();
  while (Date.now() - t0 < 60000) { const s = await info(tx, ty); if (s.dlg) { await stop(); await page.keyboard.press('Enter'); await wait(150); continue; }
    if (s.d < 5) break; const dx = tx - s.x, dy = ty - s.y; const go = s.ahead || !s.here;
    await hold('ArrowRight', go && dx > 3); await hold('ArrowLeft', go && dx < -3); await hold('ArrowDown', go && dy > 3); await hold('ArrowUp', go && dy < -3); await wait(40); }
  await stop(); const s = await info(tx, ty); console.log(label, ((Date.now() - T0) / 1000).toFixed(1) + 's', 'caught', s.caught, 'close', s.close, 'at', (s.x / 16).toFixed(1), (s.y / 16).toFixed(1)); }
const T0 = Date.now();
const route = process.env.ROUTE === 'north' ? [[2, 3], [9, 3], [17, 3], [20, 4], [20, 7]] : process.env.ROUTE === 'south' ? [[2, 9], [12, 9], [19, 9], [20, 7]] : [[3, 6], [10, 6], [19, 6], [20, 7]];
for (const [x, y] of route) await goto(x, y, `-> ${x},${y}`);
await page.keyboard.down('ArrowRight'); await wait(120); await page.keyboard.up('ArrowRight'); await page.keyboard.down('KeyE'); await wait(2200); await page.keyboard.up('KeyE'); await wait(300);
for (let i = 0; i < 20 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('Enter'); await wait(150); }
console.log('relay cut', await ev(() => !!BTS.G.flags.relayCut), 'caught', await ev(() => BTS.G.flags.caught | 0));
for (const [x, y] of [[19, 6], [11, 6], [10, 3], [10, 2]]) await goto(x, y, `-> ${x},${y}`);
await page.keyboard.down('ArrowUp'); await wait(80); await page.keyboard.up('ArrowUp'); await page.keyboard.press('KeyE'); await wait(500);
console.log('puzzle', await ev(() => BTS.Puzzle.active), 'total', ((Date.now() - T0) / 1000).toFixed(1) + 's', 'caught', await ev(() => BTS.G.flags.caught | 0), 'close', await ev(() => BTS.G.flags.closeCalls | 0), errors);
await page.screenshot({ path: '/home/claude/shots/heist-end.png' }); await browser.close();
