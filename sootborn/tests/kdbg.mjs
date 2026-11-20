import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff,k=' + (process.env.K || 58)); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
console.log(await ev(() => { BTS.UI.clear(); DEV.quick = 1; const B = BTS.Brawl; const d = BTS.FF.keepEnd(); d.arts = []; B.start(d, () => {}); const u = B.update.bind(B); B.update = () => {}; const step = n => { for (let i = 0; i < n; i++) { if (B.phase === 'fight') B.p.hp = 9; u(1 / 60); } };
  step(150); const f = B.foes[0], p = B.p; f.hp = f.max * .44; step(20); p.x = f.x - 20; p.y = f.y; B.startSuper(); let n = 0; while (!B.snap && n++ < 900) step(1); step(Number(location.hash.split('k=')[1] || 58)); return JSON.stringify({ phase: B.phase, pt: B.pt, fin: B.fin, impact: B.impact, punch: B.punch, slow: B.slow, ff: f.flash, pf: p.flash, parts: B.parts.length, sl: B.slashes.length, rings: B.rings.length, fury: p.fury, hold: p.hold, memo: !!B.memo, art: !!B.art, fz: B.freeze, cam: B.cam }); }));
await wait(900); await page.screenshot({ path: '/home/claude/shots/v68/kdbg.png' }); await browser.close();
