import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const p = await (await b.newContext({ viewport: { width: 844, height: 390 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(700); await p.keyboard.press('Enter'); await p.waitForTimeout(6500);
await p.evaluate(() => { const B = BTS; B.UI.clear(); freshState('Kael', 0); B.World.resetSheets(); B.World.showPlayer = true; B.Fade.a = 0; B.Fade.dir = 0; B.Fade.busy = false; B.Game.startPresent(); });
await p.waitForTimeout(2500);
const pos = () => p.evaluate(() => [BTS.G.mode, BTS.G.mapId, Math.floor(P.x / 16), Math.floor(P.y / 16), BTS.Dialogue.active, BTS.Cutscene.active]);
console.log(await pos());
for (let i = 0; i < 12; i++) { await p.keyboard.press('e'); await p.waitForTimeout(200); }
console.log(await pos());
const go = async (k, ms) => { await p.keyboard.down(k); await p.waitForTimeout(ms); await p.keyboard.up(k); await p.waitForTimeout(900); };
await p.evaluate(() => { P.x = 88; P.y = 7 * 16 + 4; }); await go('ArrowDown', 1200); console.log('leave home ->', await pos());
await p.screenshot({ path: '/home/claude/shots/issue/rk-home.png' });
await p.evaluate(() => { P.x = 28 * 16; P.y = 5 * 16 + 12; }); await go('ArrowRight', 1200); console.log('east gate ->', await pos());
await go('ArrowLeft', 1500); console.log('west gate ->', await pos());
await p.evaluate(() => { P.x = 16 * 16 + 8; P.y = 2 * 16 + 14; }); await go('ArrowUp', 1200); console.log('home door ->', await pos());
await p.evaluate(() => { BTS.World.load('square', { x: 26 * 16, y: 7 * 16 + 12, dir: 3 }); }); await go('ArrowRight', 1200); console.log('bay gate ->', await pos());
console.log(errs.slice(0, 3)); await b.close();
