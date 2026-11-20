import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const errs = [];
const p = await (await b.newContext({ viewport: { width: 844, height: 390 } })).newPage(); p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(300);
await p.keyboard.press('Enter'); await p.waitForTimeout(5200);
await p.locator('.mi', { hasText: 'New game' }).click(); await p.waitForTimeout(500); await p.locator('#cskip').click(); await p.waitForTimeout(800);
console.log(await p.evaluate(() => [BTS.G.mode, BTS.G.heist]));
await p.locator('#cskip').click().catch(() => {}); // not in cutscene: heist; skip via teleport+puzzle
await p.evaluate(() => { BTS.Game.onHeistDone(); }); await p.waitForTimeout(500); await p.locator('#cskip').click(); await p.waitForTimeout(1500);
await p.evaluate(() => { BTS.World.load('square', { x: 21 * 16 + 8, y: 2 * 16 + 14, dir: 1 }); });
await p.keyboard.down('ArrowUp'); await p.waitForTimeout(500); await p.keyboard.up('ArrowUp'); await p.waitForTimeout(1200);
console.log('map', await p.evaluate(() => BTS.G.mapId)); await p.screenshot({ path: '/home/claude/shots/clinic.png' });
await p.evaluate(() => { BTS.P.x = 5 * 16 + 8; BTS.P.y = 5 * 16 + 12; BTS.P.dir = 1; }); await p.keyboard.press('KeyE'); await p.waitForTimeout(800); await p.screenshot({ path: '/home/claude/shots/clinic-talk.png' });
console.log('ERRS', errs); await b.close();
