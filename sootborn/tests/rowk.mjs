import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const p = await (await b.newContext({ viewport: { width: 844, height: 390 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(700); await p.keyboard.press('Enter'); await p.waitForTimeout(6500);
await p.evaluate(() => { const B = BTS; B.UI.clear(); freshState('Kael', 0); B.World.resetSheets(); B.World.showPlayer = true; B.Fade.a = 0; B.Fade.dir = 0; B.Fade.busy = false; B.Game.startPresent(); });
await p.waitForTimeout(1200);
const r = await p.evaluate(() => { const out = []; const run = (l) => { let n = 0; const walk = a => { for (const s of a) { n++; if (s.fx && !/Brawl\.start/.test(String(s.fx))) s.fx(); if (s.choice) for (const c of s.choice) { if (c.fx) c.fx(); if (c.then) walk(c.then); } } }; walk(l); return n; };
  for (let pass = 0; pass < 3; pass++) { for (const id of ['kwash', 'kdoor5', 'kdoorM', 'kdoor11', 'kdoor13', 'ksuns', 'kwall', 'ktap', 'kbarrel', 'kpost', 'khop', 'ktub', 'kbench']) out.push(id + ':' + run(HOT[id]())); for (const id of ['garrow', 'tam', 'bryn', 'dov', 'orla', 'wick', 'sela']) out.push(id + ':' + run(TALK[id]())); }
  return [out.join(' '), Codex.count(), Object.keys(Codex.load()).join(','), BTS.G.scrip, barks('garrow').length, barks('orin').length]; });
console.log(r);
// a bout
await p.evaluate(() => { BTS.UI.clear(); BTS.World.load('rowk', { x: 7 * 16 + 8, y: 5 * 16 + 12, dir: 3 }); BTS.G.flags.rkBout = 0; BTS.Dialogue.start(scuffleBout()); });
for (let i = 0; i < 8; i++) { await p.keyboard.press('e'); await p.waitForTimeout(350); }
await p.waitForTimeout(2500); await p.screenshot({ path: '/home/claude/shots/issue/rk-bout.png' });
console.log(await p.evaluate(() => [BTS.Brawl.active, BTS.Brawl.phase, BTS.Brawl.foes.map(f => [f.name, f.hp]), BTS.Brawl.era]));
await p.evaluate(() => { BTS.Brawl.end(true); }); await p.waitForTimeout(600);
for (let i = 0; i < 6; i++) { await p.keyboard.press('e'); await p.waitForTimeout(350); }
console.log(await p.evaluate(() => [BTS.G.mode, BTS.G.flags.rkBout]));
await p.evaluate(() => { BTS.UI.clear(); Codex.add('p1', true); Codex.open(); }); await p.waitForTimeout(500); await p.screenshot({ path: '/home/claude/shots/issue/rk-codex0.png' });
await p.evaluate(() => { BTS.UI.clear(); BTS.Menus._ct = 1; Codex.open(); }); await p.waitForTimeout(500); await p.screenshot({ path: '/home/claude/shots/issue/rk-codex1.png' });
// walk the exits: home door and the gate
await p.evaluate(() => { BTS.UI.clear(); BTS.G.mode = 'world'; BTS.World.load('apt', { x: 88, y: 7 * 16 + 4, dir: 0 }); }); await p.waitForTimeout(400);
await p.keyboard.down('ArrowDown'); await p.waitForTimeout(1500); await p.keyboard.up('ArrowDown'); await p.waitForTimeout(900);
const a1 = await p.evaluate(() => [BTS.G.mapId, Math.round(P.x / 16), Math.round(P.y / 16)]);
await p.keyboard.down('ArrowRight'); await p.waitForTimeout(400); await p.keyboard.up('ArrowRight'); await p.keyboard.down('ArrowUp'); await p.waitForTimeout(100); await p.keyboard.up('ArrowUp');
await p.evaluate(() => { P.x = 28 * 16; P.y = 5 * 16 + 12; }); await p.keyboard.down('ArrowRight'); await p.waitForTimeout(1200); await p.keyboard.up('ArrowRight'); await p.waitForTimeout(900);
const a2 = await p.evaluate(() => [BTS.G.mapId, Math.round(P.x / 16), Math.round(P.y / 16)]);
await p.keyboard.down('ArrowLeft'); await p.waitForTimeout(1500); await p.keyboard.up('ArrowLeft'); await p.waitForTimeout(900);
const a3 = await p.evaluate(() => [BTS.G.mapId, Math.round(P.x / 16), Math.round(P.y / 16)]);
await p.evaluate(() => { P.x = 16 * 16 + 8; P.y = 2 * 16 + 14; }); await p.keyboard.down('ArrowUp'); await p.waitForTimeout(1200); await p.keyboard.up('ArrowUp'); await p.waitForTimeout(900);
const a4 = await p.evaluate(() => [BTS.G.mapId, Math.round(P.x / 16), Math.round(P.y / 16)]);
console.log('exits', a1, a2, a3, a4, 'errors', errs.slice(0, 4)); await b.close();
