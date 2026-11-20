import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await page.waitForTimeout(600); await page.keyboard.press('Enter'); for (let i = 0; i < 100 && !(await page.evaluate(() => BTS.G.mode === 'opening')); i++) await page.waitForTimeout(100);
await page.evaluate(() => { BTS.Brawl.tap = true; }); await page.waitForTimeout(800);
await page.evaluate(m => { window.__r = null; BTS.Brawl.start(BTS.FF[m](), w => { window.__r = w; }); }, process.env.M || 'scuffle0');
await page.waitForTimeout(4500); let log = '', last = '';
for (let i = 0; i < 260; i++) { const s = await page.evaluate(() => { const B = BTS.Brawl; if (!B.active) return null; const f = B.foes[0], p = B.p; return f ? { ph: B.phase, st: f.st, g: f.guardT > 0 ? 'G' : '', hp: Math.round(f.hp), php: p.hp, d: Math.round(Math.hypot(f.x - p.x, f.y - p.y)), dx: f.x - p.x, dy: f.y - p.y } : null; }); if (!s || s.ph !== 'fight') { if (s && s.ph !== 'intro') break; await page.waitForTimeout(60); continue; }
  const k = s.st + s.g; if (k !== last) { log += `${k}(${s.hp},${s.d},p${s.php}) `; last = k; }
  if (s.d > 30) { const key = Math.abs(s.dx) > Math.abs(s.dy) ? (s.dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (s.dy > 0 ? 'ArrowDown' : 'ArrowUp'); await page.keyboard.down(key); await page.waitForTimeout(70); await page.keyboard.up(key); } else { await page.keyboard.press('KeyE'); await page.waitForTimeout(70); } }
console.log(log.slice(0, 1500)); await browser.close();
