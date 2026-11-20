import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500); await page.evaluate(() => { try { BTS.Cutscene.skip(true); } catch (e) {} }); await wait(600);
// the dream from "Do it." on: the Table plays, then the 2D part carries on without saying the same lines twice
const r = await page.evaluate(() => { const d = DREAM1(), i = d.findIndex(s => s.issue === 'gild'); BTS.UI.clear(); BTS.Cutscene.play(d.slice(i - 1), () => {}); return [d.length, i, d.filter(s => s.when).length]; });
console.log('dream steps, issue at, conditional', r);
const seen = []; let fr = null;
for (let i = 0; i < 36; i++) { await wait(500); const on = await page.evaluate(() => Issue.on);
  if (on) { await page.keyboard.press('e'); continue; }
  const t = await page.evaluate(() => { const c = BTS.Cutscene; const s = c.steps && c.steps[c.i - 1]; return s ? (s.narr || s.t || '') .slice(0, 90) : ''; });
  if (t && seen[seen.length - 1] !== t) seen.push(t); if (seen.length) break; }
await wait(3000); console.log('2D resumes with:', await page.evaluate(() => (document.querySelector('#dlg .tx') || {}).textContent || '')); await page.screenshot({ path: '/home/claude/shots/issue/dream-after.png' }); console.log('flag', await page.evaluate(() => BTS.G.flags.issue_gild), 'errors', errors); await browser.close();
