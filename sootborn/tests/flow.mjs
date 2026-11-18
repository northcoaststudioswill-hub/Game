import { chromium } from 'playwright';
import { mkdirSync } from 'fs'; mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: `shots/flow-${n}.png` });
const st = () => ev(() => ({ mode: BTS.G.mode, cine: BTS.Cutscene.active, panel: BTS.Cutscene.panel && BTS.Cutscene.panel.id, brawl: BTS.Brawl.active, bc: !!BTS.Brawl.cine, ph: BTS.Brawl.phase, dlg: BTS.Dialogue.active, fade: BTS.Fade.a, card: !document.querySelector('#card').classList.contains('hidden') }));
await page.goto(new URL('../index.html', import.meta.url).href + ''); await wait(600); await page.keyboard.press('Enter');
for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'opening')); i++) await wait(100);
await wait(46000); console.log('opening ran out ->', JSON.stringify(await st())); await shot('title');
await ev(() => { BTS.UI.clear(); BTS.Game.newGame(); }); await wait(600); console.log('card', JSON.stringify(await st())); await shot('card');
await wait(3800); console.log('ff1 cine', JSON.stringify(await st()));
for (let i = 0; i < 4; i++) { await page.keyboard.press('KeyE'); await wait(500); } await wait(1800); console.log('ff1 fight', JSON.stringify(await st()));
await page.keyboard.press('KeyM'); await wait(300); await shot('pause'); await ev(() => [...document.querySelectorAll('.mi')].find(b => /Skip this fight/.test(b.textContent)).click()); await wait(1500);
console.log('after skip', JSON.stringify(await st())); await shot('world-panel');
// furnace path
await ev(() => { BTS.Cutscene.skip(); BTS.G.heist = 0; BTS.UI.clear(); BTS.Game.toTitle(); BTS.Menus.checkpoints(); [...document.querySelectorAll('.mi')].reverse().find(b => /Lift Zero/.test(b.textContent)).click(); }); await wait(500);
let fought = false;
for (let i = 0; i < 700; i++) { const s = await st(); if (!s.cine) break;
  if (s.brawl) { if (!fought) { fought = true; console.log('furnace brawl', JSON.stringify(s)); await wait(2500); await shot('furnace'); for (let k = 0; k < 12; k++) { await page.keyboard.press('KeyE'); await wait(120); } } await wait(400); continue; }
  const ch = await ev(() => { const b = [...document.querySelectorAll('#dlg .ch, #dlg button')].filter(b => b.offsetParent); const t = b.find(x => /BREAK FREE/.test(x.textContent)); if (t) { t.click(); return 'break'; } if (b.length > 1) { b[0].click(); return 'c0'; } return null; });
  if (ch === 'break') console.log('chose BREAK FREE'); if (!ch) await page.keyboard.press('Enter'); await wait(160); }
console.log('fought', fought, 'end', JSON.stringify(await st()), await ev(() => [BTS.G.mapId, BTS.G.flags.ranForHer]));
console.log('errors', errors); await browser.close();
