import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
for (const [n, w] of [['front', 700], ['back', 700], ['sheet', 1100]]) { const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); await p.goto('file:///home/claude/box/' + n + '/index.html'); await p.waitForTimeout(800); await p.screenshot({ path: '/home/claude/shots/box/pg-' + n + '.png', fullPage: n === 'sheet' }); }
await b.close();
