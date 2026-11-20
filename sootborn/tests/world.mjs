import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const p = await (await b.newContext({ viewport: { width: 844, height: 390 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(700); await p.keyboard.press('Enter'); await p.waitForTimeout(6500);
await p.evaluate(() => { const B = BTS; B.UI.clear(); freshState('Kael', 0); B.World.resetSheets(); B.World.showPlayer = true; B.Fade.a = 0; B.Fade.dir = 0; B.Fade.busy = false; B.Game.startPresent(); });
await p.waitForTimeout(1500);
for (let i = 0; i < 30; i++) { await p.keyboard.press('e'); await p.waitForTimeout(120); }
for (const [k, xs] of JSON.parse(process.env.M)) {
  for (const [x, y] of xs) { await p.evaluate(([k, x, y]) => { const B = BTS; B.UI.clear(); B.G.mode = 'world'; B.World.load(k, { x: x * 16 + 8, y: y * 16 + 12, dir: 0 }); B.Fade.a = 0; B.Fade.busy = false; }, [k, x, y]); await p.waitForTimeout(700); await p.screenshot({ path: `/home/claude/shots/issue/w-${k}-${x}-${y}.png` }); } }
console.log('errors', errs.slice(0, 3), await p.evaluate(() => [BTS.G.mode, BTS.G.mapId])); await b.close();
