// stills of arena fights: node arena.mjs  (F=keep,stair,riser)
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
for (const f of (process.env.F || 'keep,stair,riser').split(',')) {
  await ev(f => { if (BTS.Brawl.active) BTS.Brawl.end(true); BTS.UI.clear(); BTS.Brawl.start(Object.assign(BTS.FF[f](), { intro: null }), () => {}); BTS.UI.clear(); }, f); await wait(2600);
  console.log(f, await ev(() => { const B = BTS.Brawl; B.phase = 'fight'; for (const o of B.foes) o.cd = 99; return [B.def.title, B.g3, B.foes.map(o => o.id + ':' + o.st).join(' '), B.def.bg]; }));
  await ev(() => { const B = BTS.Brawl, p = B.p; B.foes.forEach((o, i) => { o.x = p.x + 30 + i * 22; o.y = p.y + (i % 2 ? 10 : -6); o.cd = 99; o.st = 'idle'; }); }); await wait(500);
  await page.screenshot({ path: `/home/claude/shots/v76/arena-${f}.png` }); }
console.log('errors', errors); await browser.close();
