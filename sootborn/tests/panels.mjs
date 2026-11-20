import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { BTS.UI.clear(); BTS.World.load('square'); BTS.G.mode = 'cine'; });
const list = [['world', 0, 1], ['world', 1, 3], ['world', 3, 2.5], ['hands', 0, 1], ['hands', 1, 1.2], ['ward', 0, 1], ['ward', 1, 2], ['pipe', 0, 1], ['pipe', 1, 1.6], ['lift', 0, 2.6], ['furnace', 0, 1], ['furnace', 1, 2], ['furnace', 2, 0.7], ['kael', 1, 1.5], ['tin', 1, 1]];
let i = 0;
for (const [id, st, w] of list) { await ev(([id, st]) => { BTS.Cutscene.play([{ panel: id, stage: st }, { wait: 30 }], () => {}); }, [id, st]); await wait(w * 1000); await page.locator('#game').screenshot({ path: `/home/claude/shots/pn-${String(i++).padStart(2, '0')}-${id}${st}.png` }); await ev(() => { BTS.Cutscene.active = false; }); }
console.log('errors', errors); await browser.close();
