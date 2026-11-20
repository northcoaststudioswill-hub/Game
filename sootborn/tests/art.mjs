import { chromium } from 'playwright';
const tag = process.argv[2] || 'before';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { const s = { v: 2, t: 1, name: 'Kael', look: 0, tendency: 'caretaker', day: 2, map: 'apt', x: 88, y: 92, dir: 0, flags: { day1Done: 1, d2Tavi: 1, talkedTavi: 1, interacted: 1, puzzleDone: 1, proctorDone: 1, sull2Done: 1, fuseOrder: 1, journalHint: 1 }, trust: {}, scrip: 12, journal: ['pl_bay'], log: [], play: 0, talkCount: {} }; BTS.UI.clear(); BTS.Game.loadSave(s); BTS.P.moved = 99; });
await wait(900);
const spots = { apt: [5, 5], square: [10, 9], square2: [20, 8], bay: [8, 6], bay2: [16, 5], clinic: [7, 5], tunnel: [12, 3], fuse: [5, 4] };
for (const k in spots) { const m = k.replace(/\d/, ''); await ev(([m, x, y]) => { BTS.World.load(m); BTS.P.x = x * 16 + 8; BTS.P.y = y * 16 + 12; BTS.P.dir = 0; BTS.World.exitArmed = false; }, [m, ...spots[k]]); await wait(700); await page.locator('#game').screenshot({ path: `/home/claude/shots/art-${tag}-${k}.png` }); }
// dialogue + fest + brawl
await ev(() => { BTS.World.load('square'); BTS.P.x = 17 * 16 + 8; BTS.P.y = 12 * 16 + 12 - 16 + 16; const n = BTS.World.npcs.find(n => n.id === 'orin'); BTS.P.x = n.x; BTS.P.y = n.y + 16; BTS.P.dir = 1; }); await wait(300); await page.keyboard.press('KeyE'); await wait(900); await page.screenshot({ path: `/home/claude/shots/art-${tag}-dlg.png` });
for (let i = 0; i < 40 && await ev(() => BTS.Dialogue.active); i++) { await page.keyboard.press('Enter'); await wait(120); }
await ev(() => BTS.Menus.pause()); await wait(400); await page.screenshot({ path: `/home/claude/shots/art-${tag}-menu.png` }); await ev(() => BTS.UI.clear());
await ev(() => BTS.Game.startFestStealth()); await wait(2500); await page.locator('#game').screenshot({ path: `/home/claude/shots/art-${tag}-fest.png` });
await ev(() => { BTS.G.heist = 0; BTS.World.load('square'); BTS.Brawl.start({ title: 'BOUT', foes: [{ id: 'garran', name: 'Garran', kind: 'heavy', hp: 16 }, { id: 'pike', name: 'Pike', kind: 'quick', hp: 8 }] }, () => {}); BTS.Brawl.phase = 'fight'; }); await wait(1500); await page.locator('#game').screenshot({ path: `/home/claude/shots/art-${tag}-brawl.png` });
console.log('errors', errors); await browser.close();
