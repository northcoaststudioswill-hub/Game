import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(() => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; B.start(BTS.FF.training(), () => {}); B.phase = 'fight'; B.tipT = 0; const f = B.foes[0]; f.cd = 99; f.x = B.p.x + 34; f.y = B.p.y; });
await wait(1500);
// buffered inputs: press faster than the animation allows and see the chain still come out
for (const k of ['KeyE', 'KeyE', 'KeyE', 'KeyC', 'KeyC', 'KeyC', 'KeyQ']) { await page.keyboard.press(k); await wait(90); }
await wait(900); console.log('after burst', JSON.stringify(await ev(() => { const B = BTS.Brawl, f = B.foes[0]; return { hits: B.hitsN, style: [Math.round(B.sty.v), B.sty.r], stg: +(f.stg || 0).toFixed(2), broken: +(f.broken || 0).toFixed(2), fhp: f.hp, php: B.p.hp }; })));
for (let i = 0; i < 26; i++) { await page.keyboard.press(['KeyE', 'KeyC', 'KeyE', 'KeyQ', 'KeyE', 'KeyC'][i % 6]); await wait(140); if (i === 12) await page.screenshot({ path: 'shots/train-1.png' }); }
console.log('after long', JSON.stringify(await ev(() => { const B = BTS.Brawl, f = B.foes[0]; return { style: [Math.round(B.sty.v), B.sty.r], stg: +(f.stg || 0).toFixed(2), broken: +(f.broken || 0).toFixed(2), fst: f.st, fhp: f.hp, msg: B.msg }; })));
await page.screenshot({ path: 'shots/train-2.png' });
await ev(() => BTS.Brawl.pauseMenu()); await wait(400); await ev(() => { [...document.querySelectorAll('.mi')].find(b => b.textContent.startsWith('Moves')).click(); }); await wait(300); await page.screenshot({ path: 'shots/train-3.png' });
console.log('moves', await ev(() => BTS.Brawl.moves().length), 'errors', errors.slice(0, 3)); await browser.close();
