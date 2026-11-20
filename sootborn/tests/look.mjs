// close looks at who is in a comic level: node look.mjs  (L=docks|riser|stair, KINDS=hollow,knifer,bruiser,boss)
import { chromium } from 'playwright';
const L = process.env.L || 'docks';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(k => { BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; BTS.Cutscene.play([{ issue: k, or: [] }], () => {}); }, L);
let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
for (let i = 0; i < 120; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && SC.state === 'play' && SC.player.control).catch(() => 0)) break; await page.keyboard.press('Enter'); }
await wait(800);
const info = await fr.evaluate(() => ({ keys: Object.keys(SC).filter(k => /spawn|Enemy|make|shot|cam/i.test(k)), specs: Object.keys(SC.SPECS), en: (SC.enemies || []).length }));
console.log(JSON.stringify(info));
for (const kind of (process.env.KINDS || 'hollow,knifer,bruiser,boss').split(',')) {
  const ok = await fr.evaluate(kind => { try { SC.manual = true; SC.clearEnemies(); const pl = SC.player; if (!window.__p0) window.__p0 = [pl.pos.x, pl.pos.y, pl.pos.z]; const [x, y, z] = window.__p0; pl.place(x, y, z, Math.PI); pl.model.group.visible = false; pl.hp = 999; const e = SC.spawnEnemy(kind, x + 0.5, y, z - 2.6); const cm = SC.cam; for (let i = 0; i < 16; i++) { cm.yaw = Math.PI; cm.pitch = 0.1; cm.dist = 1.4; cm.lock = null; pl.pos.set(x, y, z); SC.tick(1 / 30); } return 'ok ' + e.state + ' d=' + Math.hypot(e.pos.x - x, e.pos.z - z).toFixed(1); } catch (er) { return String(er); } }, kind);
  await fr.evaluate(() => { SC.manual = false; }); await wait(350); await fr.evaluate(() => { SC.manual = true; });
  console.log(kind, ok); await page.screenshot({ path: `/home/claude/shots/v76/look-${L}-${kind}.png` }); }
console.log('errors', errors); await browser.close();
