import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const M = process.env.M || 'valley', K = process.env.K || 'rush', TAG = process.env.TAG || '';
await page.goto(`file://${process.env.FILE || '/home/claude/below-the-sun/dist/index.html'}`); await wait(600); await page.keyboard.press('Enter');
for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'opening')); i++) await wait(100);
await ev(() => { BTS.Brawl.tap = true; }); await wait(1200);
await ev(m => { BTS.Brawl.start(BTS.FF[m](), () => {}); }, M);
for (let i = 0; i < 40; i++) { await ev(() => { BTS.Brawl.cine && BTS.Brawl.nextShot(); }); await wait(60); }
for (let i = 0; i < 80 && !(await ev(() => BTS.Brawl.phase === 'fight')); i++) await wait(100);
await wait(Number(process.env.PRE || 1800));
await ev(k => { const B = BTS.Brawl; B.p.fury = 100; if (k === 'air') { B.p.z = 30; } if (k === 'one') { const f = B.nearest(B.p); f.broken = 3; } B.startSuper(k); B.sup.t = 1.55; }, K);
const N = Number(process.env.N || 12), DT = Number(process.env.DT || 160);
for (let i = 0; i < N; i++) { await wait(DT); await page.screenshot({ path: `/home/claude/shots/ff/${TAG}el-${K}-${i}.png` }); }
console.log(await ev(() => ({ sup: !!BTS.Brawl.sup, foes: BTS.Brawl.foes.map(f => [f.st, f.hp]) })), errors);
await browser.close();
