import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const p = await (await b.newContext()).newPage();
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(600);
for (let i = 0; i < 40 && !(await p.evaluate(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await p.keyboard.press('Enter'); await p.waitForTimeout(250); }
console.log(await p.evaluate(() => JSON.stringify({ ff: Object.keys(BTS.FF).filter(k => { try { const d = BTS.FF[k](); return d && (d.walk || d.foes || d.waves); } catch (e) { return false; } }).map(k => { const d = BTS.FF[k](); return k + (d.walk ? ':W' : d.g3 || d.three ? ':3' : ':2'); }), plates: Object.keys(Prelude.PLATES || {}).length, codex: (typeof CODEX_FINDS !== 'undefined' ? Object.keys(CODEX_FINDS).length : -1), missions: Object.keys(MISSIONS).length })));
await b.close();
