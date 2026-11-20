import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message, (e.stack || '').split('\n')[1])); p.on('console', m => { if (m.type() === 'error') console.log('CON', m.text().slice(0, 200)); });
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(1500); await b.close();
