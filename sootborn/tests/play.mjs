import { chromium } from 'playwright';
const url = 'file:///home/claude/below-the-sun/dist/index.html#noff';
const errors = [];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: false });
const page = await ctx.newPage();
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
const shot = n => page.screenshot({ path: `/home/claude/shots/${n}.png` });
const wait = ms => page.waitForTimeout(ms);
const key = async (k, n = 1, gap = 120) => { for (let i = 0; i < n; i++) { await page.keyboard.press(k); await wait(gap); } };
const ev = (f, a) => page.evaluate(f, a);
const state = () => ev(() => ({ mode: BTS.G.mode, map: BTS.G.mapId, flags: Object.keys(BTS.G.flags), dlg: BTS.Dialogue.active, choices: !!BTS.Dialogue.choices, ui: BTS.UI.stack.length, puzzle: BTS.Puzzle.active, scrip: BTS.G.scrip, trust: BTS.G.trust, obj: document.querySelector('#obj span').textContent }));
// finish dialogue: press A until done; choose option idx when a choice appears
async function talkThrough(choice = 0) {
  for (let i = 0; i < 80; i++) {
    const s = await state(); if (!s.dlg) return;
    if (s.choices) { await key('ArrowDown', choice, 80); await key('Enter', 1, 200); continue; }
    await key('Enter', 1, 90);
  }
  throw new Error('dialogue stuck');
}
async function goTo(map, tx, ty, dir) { // teleport for QA (movement tested separately)
  await ev(([m, x, y, d]) => { if (BTS.G.mapId !== m) BTS.World.load(m); BTS.P.x = x * 16 + 8; BTS.P.y = y * 16 + 12; BTS.P.dir = d; BTS.World.exitArmed = true; }, [map, tx, ty, dir]);
  await wait(150);
}
async function use(choice = 0) { await key('KeyE', 1, 250); await talkThrough(choice); }

await page.goto(url); await wait(800); await shot('00-boot');
await key('Enter', 1, 600); await shot('01-splash-ncs'); await wait(2600); await shot('02-splash-ec');
await wait(3200); await shot('03-title');
// new game via clicks
await page.locator('.mi', { hasText: 'New game' }).click(); await wait(600);
// play the prologue: advance cards/dialogue, screenshot key beats
async function runCine(tag) { let guard = 0, n = 0;
  while (await ev(() => BTS.Cutscene.active) && guard++ < 900) {
    if (guard % 14 === 0) { await shot(`${tag}-${String(n++).padStart(2, '0')}`); }
    await key('Enter', 1, 240);
  } }
await runCine('pa');
console.log('heist?', await ev(() => [BTS.G.heist, BTS.G.mode, BTS.World.npcs.map(n => n.id)]));
await wait(1500); await shot('h1-heist');
// stand right in front of the proctor -> must be caught
await ev(() => { const n = BTS.World.npcs.find(n => n.patrol); BTS.P.x = n.x + [0,0,-1,1][n.dir] * 30; BTS.P.y = n.y + [1,-1,0,0][n.dir] * 30; });
await wait(1100); await shot('h2-caught'); console.log('caught count', await ev(() => BTS.G.flags.caught)); await talkThrough(); await wait(900);
console.log('reset pos', await ev(() => [BTS.P.x|0, BTS.P.y|0]));
// sneak: wait until the proctor is far right, then go to the bank
// bolt distraction test
await ev(() => { BTS.P.x = 6*16+8; BTS.P.y = 12*16+4; BTS.P.dir = 3; BTS.World.caughtT = 0; });
await key('KeyX', 1, 900); console.log('watchman investigating', await ev(() => !!BTS.World.npcs.find(n => n.id === 'watchman').inv)); await shot('h2b-bolt');
await ev(() => { BTS.World.npcs.forEach(n => { if (n.patrol) { n.x = 4*16; n.y = 12*16+12; n.inv = null; n.dir = 0; } }); BTS.P.x = 21*16+8; BTS.P.y = 8*16+10; BTS.P.dir = 1; });
await page.keyboard.down('KeyE'); await wait(2300); await page.keyboard.up('KeyE'); await wait(200); await talkThrough(); console.log('relay cut', await ev(() => BTS.G.flags.relayCut));
await ev(() => { BTS.World.npcs.forEach(n => { if (n.patrol) { n.x = 4*16; n.y = 12*16+12; n.dir = 0; n.wait = 99; } }); BTS.P.x = 10*16+8; BTS.P.y = 2*16+12; BTS.P.dir = 1; }); await key('KeyE', 1, 500);
console.log('heist puzzle open', await ev(() => BTS.Puzzle.active)); await shot('h3-bleed-puzzle');
const hr = await ev(() => { const Pz = BTS.Puzzle; for (let y = 0; y < Pz.rows; y++) for (let x = 0; x < Pz.cols; x++) { const c = Pz.grid[y][x]; if (c.kind !== 'pipe') continue; let k = 0; while (c.m !== c.sol && k < 4) { Pz.rotate(x, y); k++; } } return Pz.flowR.ok; });
console.log('heist puzzle solvable', hr); await wait(2200);
await runCine('pb');
console.log('prologue done; drive =', await ev(() => BTS.G.tendency), 'flags', await ev(() => Object.keys(BTS.G.flags)));
await wait(1800); await shot('06-apartment');
// real movement test: walk right toward Tavi
const p0 = await ev(() => [BTS.P.x, BTS.P.y]);
await page.keyboard.down('ArrowRight'); await wait(900); await page.keyboard.up('ArrowRight');
const p1 = await ev(() => [BTS.P.x, BTS.P.y]); console.log('moved', p0, '->', p1);
await page.keyboard.down('ArrowRight'); await wait(1500); await page.keyboard.up('ArrowRight');
console.log('after walking into Tavi area', await ev(() => [BTS.P.x | 0, BTS.P.y | 0, BTS.World.target && BTS.World.target.id]));
await shot('07-near-tavi');
await key('KeyE', 1, 700); await shot('08-dialogue');
await talkThrough(2); // seeker
console.log('after tavi', await state());
// walk out the door for real-ish: teleport near door, walk down
await goTo('apt', 5, 6, 0); await page.keyboard.down('ArrowDown'); await wait(800); await page.keyboard.up('ArrowDown'); await wait(700);
console.log('after door', (await state()).map); await shot('09-square');
await goTo('square', 22, 13, 1); await use(); // ivo first
await goTo('square', 12, 2, 1); await use(); // lift 0
await goTo('square', 13, 9, 1); await use(); // pillar
await goTo('square', 26, 8, 3); await page.keyboard.down('ArrowRight'); await wait(500); await page.keyboard.up('ArrowRight'); await wait(700);
console.log('in', (await state()).map); await shot('10-bay');
await goTo('bay', 4, 2, 1); await use(); console.log('board before mara', (await state()).flags.includes('tookOrder'));
await goTo('bay', 7, 5, 1); await use(); // mara
await goTo('bay', 4, 2, 1); await use(); // board
await goTo('bay', 10, 2, 1); await key('KeyE', 1, 500); await talkThrough(); await wait(300);
console.log('puzzle open', (await state()).puzzle); await shot('11-puzzle-a');
// validate both puzzles' authored solutions + solve via real rotate calls
for (let stage = 0; stage < 2; stage++) {
  const r = await ev(() => { const Pz = BTS.Puzzle; let rot = 0; for (let y = 0; y < Pz.rows; y++) for (let x = 0; x < Pz.cols; x++) { const c = Pz.grid[y][x]; if (c.kind !== 'pipe') continue; let k = 0; while (c.m !== c.sol && k < 4) { Pz.rotate(x, y); k++; rot++; } } return { rot, ok: Pz.flowR.ok, solved: Pz.solved, leaks: Pz.flowR.leaks.length, fed: Pz.flowR.seen.size, total: Pz.flowR.total, stage: Pz.si }; });
  console.log('stage', stage, r);
  await wait(400); await shot(`12-puzzle-solved-${stage}`); await wait(1500);
  if (stage === 0) await shot('13-puzzle-b');
}
await wait(400); console.log('after puzzle', (await state()).flags.includes('puzzleDone')); await shot('14-aux9-dialogue');
await talkThrough(0);
if (await ev(() => BTS.Puzzle.active)) { await shot('14b-bleed-again'); const ok = await ev(() => { const Pz = BTS.Puzzle; for (let y = 0; y < Pz.rows; y++) for (let x = 0; x < Pz.cols; x++) { const c = Pz.grid[y][x]; if (c.kind !== 'pipe') continue; let k = 0; while (c.m !== c.sol && k < 4) { Pz.rotate(x, y); k++; } } return Pz.flowR.ok; }); console.log('bleed-again solvable', ok); await wait(2200); await shot('14c-vale'); await talkThrough(); }
console.log('bledAgain', await ev(() => BTS.G.flags.bledAgain));
await goTo('bay', 7, 5, 1); await use(1); // ask about AUX-9
await goTo('bay', 11, 11, 0); await key('KeyE', 1, 300); await talkThrough(0); await wait(1200);
console.log('tunnel?', (await state()).map); await shot('15a-tunnel-entry');
await goTo('tunnel', 14, 2, 1); await use(); await goTo('tunnel', 12, 4, 0); await use(); await goTo('tunnel', 23, 2, 1); await use(); await shot('15b-riser');
await goTo('tunnel', 2, 4, 2); await page.keyboard.down('ArrowLeft'); await wait(700); await page.keyboard.up('ArrowLeft'); await wait(800);
console.log('back in', (await state()).map);
await goTo('square', 8, 6, 0); await wait(2500); await shot('15c-bark');
await goTo('bay', 16, 11, 1); await use(); await goTo('bay', 20, 11, 1); await key('KeyE', 1, 400); await shot('15-crate'); await talkThrough(1); // pocket slip
await goTo('bay', 7, 5, 1); await use(); // clock out
console.log('clocked', await state());
await goTo('square', 24, 8, 3); await use(0); // ivo talk 2 - tell
await goTo('apt', 7, 4, 1); await use(1); // tavi night
await goTo('apt', 3, 3, 2); await key('KeyE', 1, 300); await talkThrough(0); await wait(1500);
await shot('16-dayend'); console.log('dayend', await state());
await page.getByText('Continue', { exact: true }).click(); await wait(500); await shot('17-outro');
await page.getByText('Wake up: Day 2').click(); await wait(1200); await shot('18-day2');
console.log('day2', await state());
// journal
await key('KeyM', 1, 400); await page.getByText('Journal', { exact: false }).first().click(); await wait(400); await shot('19-journal');
await key('Escape', 2, 300);
// persistence roundtrip
const saved = await ev(() => localStorage.getItem('bts_save_auto') !== null);
await page.reload(); await wait(500); await key('Enter', 1, 300); await key('Enter', 1, 300); await wait(4000);
await shot('20-title-continue');
const contTxt = await page.locator('.mi').first().textContent(); console.log('saved', saved, 'continue btn:', contTxt);
await page.locator('.mi').first().click(); await wait(1000); console.log('after continue', await state());
console.log('ERRORS', errors);
await browser.close();
