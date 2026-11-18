import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const P = process.env.PORTRAIT, page = await (await browser.newContext({ viewport: P ? { width: 390, height: 844 } : { width: 844, height: 390 }, hasTouch: !!P, isMobile: !!P })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: `shots/${P ? 'p-' : ''}dev-${n}.png` });
const st = () => ev(() => ({ mode: BTS.G.mode, map: BTS.G.mapId, cine: BTS.Cutscene.active, brawl: BTS.Brawl.active, bc: !!BTS.Brawl.cine, ui: BTS.UI.stack.length, heist: BTS.G.heist, day: BTS.G.day }));
await page.goto(new URL('../index.html', import.meta.url).href + ''); await wait(600); if (P) await page.touchscreen.tap(195, 400); else await page.keyboard.press('Enter');
for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'opening')); i++) await wait(100);
console.log('opening', await st()); await wait(1500); await shot('opening');
if (P) await page.touchscreen.tap(195, 300); else await page.keyboard.press('Space'); await wait(1800); console.log('title', await st()); await shot('title');
const n = await ev(() => { BTS.Menus.checkpoints(); return document.querySelectorAll('.mi').length; }); await wait(300); await shot('menu');
const reset = () => ev(() => { BTS.UI.clear(); BTS.Cutscene.active && BTS.Cutscene.skip(true); BTS.Brawl.active = false; BTS.Brawl.cine = null; BTS.G.heist = 0; BTS.Game.toTitle(); BTS.Menus.checkpoints(); });
const click = l => ev(l => { [...document.querySelectorAll('.mi')].reverse().find(b => b.textContent.startsWith(l)).click(); }, l);
let k = 0;
for (const sec of ['Fights', 'Story beats']) {
  await reset(); await wait(200); await click(sec); await wait(200); await shot('menu-' + sec.slice(0, 5));
  const labels = await ev(() => [...document.querySelectorAll('.mi')].map(b => b.textContent).filter(t => /·|Opening|New game from/.test(t) && !/Dev menu/.test(t)));
  console.log(sec, labels.length);
  for (const l of labels) { await reset(); await wait(200); await click(sec); await wait(150); await click(l); await wait(2600); console.log(k, l, JSON.stringify(await st()), errors.length); await shot('cp' + k++); }
}
await reset(); await wait(150); await click('Start fights at full fury'); await click('Skip fight intro films'); await click('Fights'); await wait(100); await click('The Proctor'); await wait(5200);
console.log('switches', await ev(() => ({ fury: BTS.Brawl.p.fury, cine: !!BTS.Brawl.cine, ph: BTS.Brawl.phase, bg: BTS.Brawl.def.bg }))); await shot('quick');
await ev(() => { DEV.fury = 0; DEV.quick = 0; });
// save slots
await ev(() => { BTS.UI.clear(); BTS.Cutscene.active && BTS.Cutscene.skip(true); BTS.Brawl.active = false; BTS.Game.loadSave(BTS.Save.migrate(JSON.parse(JSON.stringify(CHECKPOINTS.ring)))); }); await wait(800);
await ev(() => { BTS.Menus.pause(); BTS.Menus.slots('save'); }); await wait(200); await shot('slots-save');
await ev(() => [...document.querySelectorAll('.mi')].reverse().find(b => /^Slot 2/.test(b.textContent)).click()); await wait(300);
console.log('slot2', await ev(() => BTS.Save.describe(BTS.Save.read('s2'))), 'latest', await ev(() => BTS.Save.latest().map));
await ev(() => { BTS.UI.clear(); BTS.Game.toTitle(); BTS.Menus.slots('load'); }); await wait(300); await shot('slots-load');
await ev(() => [...document.querySelectorAll('.mi')].reverse().find(b => /^Slot 2/.test(b.textContent)).click()); await wait(900); console.log('loaded', await st());
await page.reload(); await wait(500); console.log('after reload', await ev(() => BTS.Save.describe(BTS.Save.read('s2'))));
console.log('errors', errors); await browser.close();
