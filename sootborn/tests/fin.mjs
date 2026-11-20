import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
const go = (F, setup) => ev(([F, setup]) => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; B.start(BTS.FF[F](), () => {}); B.cine = null; B.phase = 'fight'; B.tipT = 0; const p = B.p, f = B.foes[0]; f.cd = 99; f.x = p.x + 36; f.y = p.y; f.st = 'approach'; if (setup === 'one') { f.broken = 5; p.fury = 100; } if (setup === 'three') { p.hp = 2; p.fury = 60; } if (setup === 'air') { p.fury = 100; p.z = 40; p.vz = 60; } if (setup === 'rush') p.fury = 100; return [B.era, B.band(), B.finKind(p.z > 0), f.hp]; }, [F, setup]);
for (const [F, S] of [['ford', 'one'], ['proctor', 'three'], ['keep', 'air'], ['gallery', 'one'], ['fall', 'air'], ['pairing', 'rush'], ['under', 'one'], ['ember', 'rush']]) {
  const a = await go(F, S); await page.keyboard.down('KeyE'); let nm = null; for (let i = 0; i < 40 && !nm; i++) { await wait(150); nm = await ev(() => { const s = BTS.Brawl.sup; return s ? [s.kind, s.fn && s.fn.name] : null; }); } await page.keyboard.up('KeyE'); for (let i = 0; i < 80; i++) { await wait(200); if (!(await ev(() => !!BTS.Brawl.sup))) break; }
  console.log(F, S, 'era/band/kind/hp', JSON.stringify(a), 'sup', JSON.stringify(nm), 'after', JSON.stringify(await ev(() => { const B = BTS.Brawl; return [B.foes[0].hp, B.p.fury | 0, !!B.sup, B.phase]; }))); }
// the turn: a parry puts him behind the man; the blade break
await go('gallery'); console.log('turn', JSON.stringify(await ev(() => { const B = BTS.Brawl, p = B.p, f = B.foes[0]; const x0 = p.x, h0 = f.hp; p.st = 'guard'; p.gt = 0; p.fx = 1; p.fy = 0; B.hurtPlayer(f, 1, -1, 0); return [x0 < f.x, p.x > f.x, h0 - f.hp, B.msg]; })));
await go('ember'); await ev(() => { const f = BTS.Brawl.foes[0]; DEV.quick = 0; f.hp = Math.floor(f.max * .44); }); await wait(400); console.log('break', JSON.stringify(await ev(() => { const B = BTS.Brawl; return [B.p.blade, B.p.pow, !!B.memo, B.msg]; }))); await wait(3200);
for (let i = 0; i < 6; i++) { await ev(() => { const B = BTS.Brawl, f = B.foes[0], p = B.p; f.cd = 99; f.x = p.x + 30; f.y = p.y; f.st = 'approach'; f.guardT = 0; }); await page.keyboard.press('KeyE'); await wait(260); }
console.log('fists', JSON.stringify(await ev(() => { const B = BTS.Brawl; return [B.hitsN, B.foes[0].hp, B.foes[0].max, !!B.memo, !!B.art]; })), 'errors', errors.slice(0, 3)); await browser.close();
