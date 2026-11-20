import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const p = await (await b.newContext({ viewport: { width: 844, height: 390 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(700); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
for (const [k, xs] of JSON.parse(process.env.M)) { await p.evaluate(k => { BTS.UI.clear(); Mission.start(k, () => {}); }, k); await p.waitForTimeout(900); for (let i = 0; i < 6; i++) { await p.keyboard.press('e'); await p.waitForTimeout(150); }
  for (const [x, y] of xs) { await p.evaluate(([x, y]) => { P.x = x * 16 + 8; P.y = y * 16 + 4; }, [x, y]); await p.waitForTimeout(500); await p.screenshot({ path: `/home/claude/shots/issue/map-${k}-${x}.png` }); } }
console.log('errors', errs); await b.close();
