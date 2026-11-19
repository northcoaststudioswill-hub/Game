import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await page.waitForTimeout(600); await page.keyboard.press('Enter'); await page.waitForTimeout(4000);
console.log(await page.evaluate(() => { BTS.G.flags = BTS.G.flags || {}; BTS.G.flags.wrenMet = 1; BTS.G.flags.wrenClose = 1; const ch = (typeof PART2 !== 'undefined' ? PART2 : typeof P2 !== 'undefined' ? P2 : null); const src = ch ? ch[4]() : null; if (!src) return 'no table'; const t = src.map(s => s.narr || s.t || '').join(' '); return [src.length, /Halloran, W\./.test(t), /You thought it was me/.test(t), src.every(s => s && typeof s === 'object')]; }));
console.log('errors', errors); await browser.close();
