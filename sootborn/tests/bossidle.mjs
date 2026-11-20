// each boss standing his own way, close: node bossidle.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
for (const L of (process.env.L || 'docks,riser,stair').split(',')) {
  await ev(k => { BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; BTS.Cutscene.play([{ issue: k, or: [] }], () => {}); }, L);
  let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
  for (let i = 0; i < 120; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && SC.state === 'play' && SC.player.control).catch(() => 0)) break; await page.keyboard.press('Enter'); }
  await wait(600);
  console.log(L, await fr.evaluate(() => { try { SC.manual = true; SC.clearEnemies(); const pl = SC.player; window.__q = [pl.pos.x, pl.pos.y, pl.pos.z]; const [x, y, z] = window.__q; pl.place(x, y, z, Math.PI); pl.model.group.visible = false; SC.spawnEnemy('boss', x, y, z - 3.2); return 'ok'; } catch (er) { return String(er); } }));
  let got = 0; for (let k = 0; k < 40 && got < 2; k++) { const st = await fr.evaluate(() => { const pl = SC.player, [x, y, z] = window.__q, cm = SC.cam, e = SC.enemies.find(q => q.kind === 'boss'); for (let i = 0; i < 6; i++) { pl.hp = pl.maxHp || 999; pl.pos.set(x, y, z); cm.yaw = Math.PI; cm.pitch = 0.05; cm.dist = 2.2; cm.lock = null; SC.tick(1 / 30); } return e ? [e.state, Math.hypot(e.vel.x, e.vel.z).toFixed(2), Math.hypot(e.pos.x - x, e.pos.z - z).toFixed(1)] : null; }); if (st && +st[1] < 0.4 && +st[2] < 4 && !/att|wind|swing|lunge/.test(st[0])) { await fr.evaluate(() => { SC.manual = false; }); await wait(220); await page.screenshot({ path: `/home/claude/shots/v77/boss-${L}-${got}.png` }); await fr.evaluate(() => { SC.manual = true; }); console.log('  still:', st.join(' ')); got++; } }
  await ev(() => { Issue.finish(false); }); await wait(900); }
await ev(() => { BTS.UI.clear(); BTS.Brawl.start(Object.assign(BTS.FF.gallery(), { intro: null }), () => {}); BTS.UI.clear(); }); await wait(2600); await page.screenshot({ path: '/home/claude/shots/v77/gallery.png' });
console.log('errors', errors); await browser.close();
