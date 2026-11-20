// a height map of a comic level, as text: node map.mjs  (L=docks)
import { chromium } from 'playwright';
const L = process.env.L || 'docks';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(k => { BTS.UI.clear(); BTS.G.mode = 'cut'; Issue.fresh = 1; BTS.Cutscene.play([{ issue: k, or: [] }], () => {}); }, L);
let fr = null; for (let i = 0; i < 80 && !fr; i++) { await wait(250); fr = page.frames().find(f => f !== page.mainFrame()); }
for (let i = 0; i < 120; i++) { await wait(250); if (await fr.evaluate(() => typeof SC !== 'undefined' && SC.world && SC.player).catch(() => 0)) break; }
await wait(1500);
console.log(await fr.evaluate(() => { const W = SC.world, rows = []; const ch = h => h < -0.5 ? ' ' : h < 0.3 ? '.' : h < 10 ? String(Math.round(h)) : '#';
  rows.push('     x: -46 ... 46 (step 2). top = the ground from above; rows are z'); for (let z = -48; z <= 50; z += 2) { let a = '', b = ''; for (let x = -46; x <= 46; x += 2) { const g = W.ground(x, z, 40), p = { x, y: 0, z }; W.collide(p, 0.35, 0, 1.7); const blk = Math.hypot(p.x - x, p.z - z) > 0.05, g0 = W.ground(x, z, 0.5); a += ch(g); b += g0 < -0.5 ? ' ' : blk ? 'X' : '.'; } rows.push(String(z).padStart(4) + ' ' + a + '   ' + b); } return rows.join('\n'); }));
await browser.close();
