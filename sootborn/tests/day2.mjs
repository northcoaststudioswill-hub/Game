import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
import { chromium } from 'playwright';
const url = new URL('../index.html', import.meta.url).href;
const VP = process.env.PORTRAIT ? { width: 390, height: 844 } : { width: 844, height: 390 };
const errors = [];
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined, args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: VP, hasTouch: !!process.env.PORTRAIT });
const page = await ctx.newPage();
page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
const tag = process.env.PORTRAIT ? 'p-' : '';
const shot = n => page.screenshot({ path: `shots/d2-${tag}${n}.png` });
const wait = ms => page.waitForTimeout(ms);
const key = async (k, n = 1, gap = 120) => { for (let i = 0; i < n; i++) { await page.keyboard.press(k); await wait(gap); } };
const ev = (f, a) => page.evaluate(f, a);
const state = () => ev(() => ({ mode: BTS.G.mode, map: BTS.G.mapId, dlg: BTS.Dialogue.active, choices: !!BTS.Dialogue.choices, ui: BTS.UI.stack.length, puzzle: BTS.Puzzle.active, brawl: BTS.Brawl.active, scrip: BTS.G.scrip }));
async function talkThrough(choice = 0) { for (let i = 0; i < 120; i++) { const s = await state(); if (!s.dlg) return; if (s.choices) { await key('ArrowDown', choice, 80); await key('Enter', 1, 200); continue; } await key('Enter', 1, 80); } throw new Error('dialogue stuck'); }
async function goTo(map, tx, ty, dir) { await ev(([m, x, y, d]) => { if (BTS.G.mapId !== m) BTS.World.load(m); BTS.P.x = x * 16 + 8; BTS.P.y = y * 16 + 12; BTS.P.dir = d; BTS.World.exitArmed = true; }, [map, tx, ty, dir]); await wait(200); }
async function use(choice = 0) { await key('KeyE', 1, 250); await talkThrough(choice); }
const flags = () => ev(() => Object.keys(BTS.G.flags).filter(k => BTS.G.flags[k]));
async function runCine(t, every = 10) { let guard = 0, n = 0; while (await ev(() => BTS.Cutscene.active) && guard++ < 900) { if (guard % every === 0) await shot(`${t}-${String(n++).padStart(2, '0')}`); await key('Enter', 1, 230); } }

await page.goto(url); await wait(700); await key('Enter', 1, 400); await wait(6500);
// synthesize an end-of-day-1 save (path chosen by env)
const VAR = process.env.VAR || 'a';
await ev(v => {
  const f = { talkedTavi: 1, talkedMara1: 1, tookOrder: 1, puzzleDone: 1, maraDebrief: 1, crateA: 1, crateB: 1, crateC: 1, clockedOut: 1, day1Done: 1, proctorDone: 1, interacted: 1, journalHint: 1, fury: 3, metVale: 1 };
  if (v === 'a') Object.assign(f, { bledAgain: 1, threatenedProctor: 1, tookSlip: 1, ivoTalk2: 1, sawChalk: 1 }); else Object.assign(f, { charmedProctor: 1, reportedCrate: 1 });
  const s = { v: 2, t: Date.now(), name: 'Kael', look: 0, tendency: 'caretaker', day: 2, map: 'apt', x: 56, y: 76, dir: 0, flags: f, trust: {}, scrip: 20, journal: ['p_seren', 'p_tavi', 'e_aux9', 'e_crate'], log: [], play: 0, talkCount: {} };
  BTS.UI.clear(); BTS.Game.loadSave(s);
}, VAR);
await wait(900); await shot('00-apt'); console.log('obj', await ev(() => BTS.HUD.objective()));
await goTo('apt', 6, 3, 3); await use(1); console.log('tavi', (await flags()).includes('d2Tavi'), await ev(() => BTS.HUD.objective()));
await goTo('apt', 6, 2, 1); await use(); await goTo('apt', 8, 2, 1); await use(); await goTo('apt', 4, 2, 1); await use(0);
// square: sull
await goTo('square', 13, 10, 1); await wait(300); await shot('01-square-day2'); await use(0); console.log('sull', (await flags()).filter(k => /sull/i.test(k)), 'scrip', (await state()).scrip);
await goTo('square', 13, 10, 1); await use();
// mara + fuse
await goTo('bay', 7, 5, 1); await use(); console.log('mara2', await ev(() => BTS.HUD.objective()));
await goTo('bay', 17, 2, 1); await shot('02-bay-door');
await key('ArrowUp', 1, 50); await page.keyboard.down('ArrowUp'); await wait(500); await page.keyboard.up('ArrowUp'); await wait(900);
console.log('in fuse?', (await state()).map); await shot('03-fuse');
await goTo('fuse', 7, 2, 1); await use(); await goTo('fuse', 9, 2, 1); await use(); await goTo('fuse', 10, 3, 0); await use();
await goTo('fuse', 3, 2, 1); await key('KeyE', 1, 500); console.log('breaker open', await ev(() => [BTS.Puzzle.active, !!BTS.Puzzle.bk])); await shot('04-breaker1');
await key('ArrowUp', 1); await key('ArrowRight', 1); await key('ArrowUp', 1); await shot('04-breaker1b'); await key('ArrowRight', 1); await key('ArrowDown', 1); await key('ArrowRight', 1); await key('ArrowDown', 1);
await wait(2000); console.log('stage2', await ev(() => BTS.Puzzle.si)); await shot('05-breaker2');
await key('KeyH', 1, 300); await shot('05-breaker2-hint');
await ev(() => { const P = BTS.Puzzle, d = P.defs[P.si]; d.sol.forEach((v, i) => { if (i < d.sol.length - 1) P.bk.st[i] = v; }); P.bk.st[d.sol.length - 1] = 1; P.bk.cur = d.sol.length - 1; });
await wait(200); await shot('05-breaker2-over'); await key('ArrowDown', 1, 300); await shot('05-breaker2-solved'); await wait(2000);
console.log('fuse done', (await flags()).includes('fuseDone'), await state()); await shot('06-vale'); await talkThrough(0);
console.log('after vale', (await flags()).filter(k => /vale|spare/.test(k)), await ev(() => BTS.World.npcs.map(n => n.id)));
await goTo('fuse', 8, 2, 1); await use(0); console.log('locker', (await flags()).filter(k => /Blood|locker/.test(k)));
await goTo('bay', 7, 5, 1); await use(); console.log('clock2', (await flags()).includes('clock2'), await ev(() => BTS.HUD.objective()));
await goTo('bay', 15, 2, 1); await use();
// tunnel
await goTo('tunnel', 12, 4, 0); await use();
// gather
await goTo('square', 22, 13, 1); await ev(() => { const n = BTS.World.npcs.find(n => n.id === 'ivo'); BTS.P.x = n.x; BTS.P.y = n.y + 16; BTS.P.dir = 1; }); await use(0);
await ev(() => { const n = BTS.World.npcs.find(n => n.id === 'orin'); BTS.P.x = n.x; BTS.P.y = n.y + 16; BTS.P.dir = 1; }); await use(1);
for (const id of ['bao', 'marrow', 'fen', 'kit', 'pell', 'juno']) { await ev(i => { const n = BTS.World.npcs.find(n => n.id === i); BTS.P.x = n.x; BTS.P.y = n.y + 16; BTS.P.dir = 1; }, id); await wait(120); await use(0); }
await goTo('clinic', 7, 4, 1); await use(0); await goTo('clinic', 5, 5, 1); await use(); await goTo('clinic', 3, 5, 1); await use(); await goTo('clinic', 11, 6, 1); await use();
console.log('parts/rays', await ev(() => [BTS.G.flags.gotWire, BTS.G.flags.gotGold, BTS.G.flags.gotWick, BTS.G.flags.rays]), await ev(() => BTS.HUD.objective()));
// ring
await goTo('square', 19, 7, 1); await wait(200); await shot('07-ring-square');
async function bout(tagn, cheat) {
  await ev(() => { const n = BTS.World.npcs.find(n => n.id === 'hollis'); BTS.P.x = n.x; BTS.P.y = n.y + 16; BTS.P.dir = 1; }); await wait(150);
  await key('KeyE', 1, 250); await talkThrough(0); await wait(300);
  console.log('brawl', tagn, await ev(() => [BTS.Brawl.active, BTS.Brawl.phase, BTS.Brawl.foes.map(f => f.name + ':' + f.hp)]));
  await shot(`08-brawl-${tagn}-intro`); await wait(1800);
  // fight for real a bit: run at the foe and mash strike, dodge now and then
  for (let i = 0; i < (cheat === 2 ? 3 : 14); i++) { await page.keyboard.down('ArrowRight'); await wait(180); await page.keyboard.up('ArrowRight'); await key('KeyE', 3, 110); if (i % 3 === 2) await key('KeyX', 1, 200); if (i === 4) await shot(`08-brawl-${tagn}-mid`); if (!(await ev(() => BTS.Brawl.active))) break; }
  await shot(`08-brawl-${tagn}-late`);
  console.log('  after real fight', await ev(() => BTS.Brawl.active && [BTS.Brawl.p.hp, BTS.Brawl.foes.map(f => f.hp), BTS.Brawl.phase]));
  if (cheat) { await ev(() => { if (BTS.Brawl.active && BTS.Brawl.phase === 'fight') { BTS.Brawl.p.hp = 6; for (const f of BTS.Brawl.foes) if (f.st !== 'down') { f.hp = 1; f.x = BTS.Brawl.p.x + 18; f.y = BTS.Brawl.p.y; f.st = 'recover'; f.t = 0; } BTS.Brawl.p.dir = 3; } }); for (let i = 0; i < 30 && await ev(() => BTS.Brawl.active && BTS.Brawl.phase === 'fight'); i++) { await ev(() => { for (const f of BTS.Brawl.foes) if (f.st !== 'down') { f.x = BTS.Brawl.p.x + 18; f.y = BTS.Brawl.p.y; f.st = 'recover'; f.t = 0; } }); await key('KeyE', 1, 160); } }
  for (let i = 0; i < 40 && await ev(() => BTS.Brawl.active); i++) await wait(200);
  await wait(300); await shot(`08-brawl-${tagn}-result`); await talkThrough(0); console.log('  ring', await ev(() => BTS.G.flags.ring), 'scrip', (await state()).scrip);
}
await bout('1', true); await bout('2', 2); await bout('3', 2);
console.log('champ', (await flags()).filter(k => /ring|beatSull/.test(k)));
// perfect dodge check
// build
await goTo('apt', 6, 2, 1); await use(0); console.log('built', (await flags()).includes('lanternBuilt'), await ev(() => BTS.HUD.objective()));
await shot('09-apt-built');
await goTo('apt', 6, 3, 3); await key('KeyE', 1, 250); await talkThrough(0); await wait(2500);
console.log('fest cine', await ev(() => [BTS.Cutscene.active, BTS.G.mode]));
await runCine('fa', 8);
await wait(1800); console.log('stealth', await ev(() => [BTS.G.heist, BTS.G.mapId, BTS.G.mode, BTS.World.npcs.filter(n => n.patrol).length, BTS.HUD.objective()])); await shot('10-stealth');
await wait(3000); await shot('10-stealth-b');
// get caught twice
for (let i = 0; i < 2; i++) { await ev(() => { const n = BTS.World.npcs.find(n => n.patrol); BTS.P.x = n.x + [0, 0, -1, 1][n.dir] * 30; BTS.P.y = n.y + [1, -1, 0, 0][n.dir] * 30; }); await wait(i ? 3800 : 1100); await shot('11-caught' + i); await talkThrough(); await wait(900); }
console.log('caught2', await ev(() => [BTS.G.flags.caught2, BTS.P.x | 0, BTS.P.y | 0])); await wait(2200); await shot('11-distract'); console.log('investigating', await ev(() => BTS.World.npcs.filter(n => n.inv).length));
// whisper + walk there for real along y=7
await ev(() => { BTS.P.x = 6 * 16 + 8; BTS.P.y = 12 * 16 + 4; BTS.P.dir = 0; }); await key('KeyE', 1, 250); await talkThrough();
await ev(() => { BTS.World.npcs.forEach(n => { if (n.patrol) { n.wait = 99; n.inv = null; n.dir = 3; n.x = 26 * 16; n.y = 14 * 16; } }); BTS.P.x = 13 * 16 + 8; BTS.P.y = 7 * 16 + 12; BTS.P.dir = 0; });
await wait(300); await shot('12-at-pillar'); await page.keyboard.down('KeyE'); await wait(2300); await page.keyboard.up('KeyE'); await wait(400);
console.log('finale', await ev(() => [BTS.Cutscene.active, BTS.G.heist]));
await runCine('fb', 6);
await wait(1500); await shot('13-dayend'); console.log('dayend', await state(), await ev(() => [BTS.G.day, !!BTS.G.flags.day2Done]));
await page.locator('.mi', { hasText: 'Continue' }).click(); await wait(600); await shot('14-outro');
await page.locator('.mi', { hasText: 'Keep exploring' }).click(); await wait(1200); await shot('15-day3'); console.log('day3', await state(), await ev(() => BTS.HUD.objective()));
await goTo('apt', 6, 3, 3); await use(); await goTo('square', 13, 10, 1); await wait(300); await shot('16-day3-square');
await ev(() => { const n = BTS.World.npcs.find(n => n.id === 'hollis'); BTS.P.x = n.x; BTS.P.y = n.y + 16; BTS.P.dir = 1; }); await use();
console.log('ERRORS', errors.length, errors.slice(0, 6));
await browser.close();
