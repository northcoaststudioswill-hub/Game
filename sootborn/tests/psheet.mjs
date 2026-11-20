import { chromium } from 'playwright'; import fs from 'fs';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 640, height: 360 } })).newPage();
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await page.waitForTimeout(600); await page.keyboard.press('Enter'); await page.waitForTimeout(4000);
const url = await page.evaluate(list => { const c = document.createElement('canvas'); c.width = 324 * 6; c.height = 196 * Math.ceil(list.length / 6); const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height); g.font = '12px monospace';
  list.forEach((ps, i) => { const [id, st] = ps.split(':'); const [pc, pg] = mk(320, 180); try { Panels.narrow = false; PANELS[id](pg, 2.2, +st, 0); Panels.finish(pg, { id, stage: +st, t: 2.2 }); } catch (e) { pg.fillStyle = '#f00'; pg.fillText(String(e.message).slice(0, 40), 4, 20); } g.drawImage(pc, (i % 6) * 324, Math.floor(i / 6) * 196); g.fillStyle = '#ff0'; g.fillText(ps, (i % 6) * 324 + 4, Math.floor(i / 6) * 196 + 192); }); return c.toDataURL(); }, process.env.PANELS.split(','));
fs.writeFileSync('/home/claude/shots/issue/psheet.png', Buffer.from(url.split(',')[1], 'base64')); await browser.close();
