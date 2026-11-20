import { chromium } from 'playwright'; import fs from 'fs';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(5000);
const d = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 5 * 44 * 4 + 20; c.height = 96 * 4 + 8; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#6a8a5a'; g.fillRect(0, 0, c.width, c.height); for (let i = 0; i < 5; i++) g.drawImage(proctorSprite(i), 4 + i * 180, 4, 176, 384); return c.toDataURL(); });
fs.writeFileSync('/home/claude/shots/ff/proctor-sprites.png', Buffer.from(d.split(',')[1], 'base64'));
for (const [m, cy, ch, cx] of [['valley', 150, 60, 0], ['pairing', 170, 70, 0]]) {
  await page.evaluate(m => { BTS.UI.clear(); DEV.quick = 1; const d = BTS.FF[m](); delete d.arts; delete d.voice; (d.foes || d.waves[0]).forEach(f => { f.hp = 9999; }); BTS.Brawl.start(d, () => {}); }, m); await wait(2800);
  await page.evaluate(([cy, ch, cx]) => { const B = BTS.Brawl; BTS.UI.clear(); clearInterval(window.__iv); window.__iv = setInterval(() => { const c = B.cam; c.x = cx; c.y = B.p.y + cy; c.h = ch; B.foes.forEach(f => { f.cd = 99; }); }, 8); }, [cy, ch, cx]); await wait(1200);
  await page.screenshot({ path: '/home/claude/shots/ff/proc-' + m + '.png' });
  console.log(m, await page.evaluate(() => [G3.bg, (G3.bbs[G3.bg] || []).length, !!G3.BB]));
}
console.log('errors', errors); await browser.close();
