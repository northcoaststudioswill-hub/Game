import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a), shot = n => page.screenshot({ path: `/home/claude/shots/ff/flow-${n}.png` });
const st = () => ev(() => ({ mode: BTS.G.mode, cine: BTS.Cutscene.active, panel: BTS.Cutscene.panel && BTS.Cutscene.panel.id, brawl: BTS.Brawl.active, bc: !!BTS.Brawl.cine, ph: BTS.Brawl.phase, dlg: BTS.Dialogue.active, fade: BTS.Fade.a, card: !document.querySelector('#card').classList.contains('hidden') }));
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600); await page.keyboard.press('Enter');
for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'opening')); i++) await wait(100);
for (let i = 0; i < 300 && (await ev(() => BTS.G.mode === 'opening')); i++) await wait(500); console.log('opening ran out ->', JSON.stringify(await st())); await shot('title');
await ev(() => { BTS.UI.clear(); BTS.Game.newGame(); }); await wait(600); console.log('card', JSON.stringify(await st())); await shot('card');
await wait(3800); console.log('ff1 cine', JSON.stringify(await st()));
for (let i = 0; i < 4; i++) { await page.keyboard.press('KeyE'); await wait(500); } await wait(1800); console.log('ff1 fight', JSON.stringify(await st()));
console.log('skip offered:', await ev(() => !!BTS.Brawl.def.skip), 'scene skip hidden:', await ev(() => document.querySelector('#cskip').classList.contains('hidden')), 'noSkip:', await ev(() => BTS.Cutscene.noSkip));
await ev(() => BTS.Cutscene.skip()); await wait(200); console.log('still fighting after a skip attempt:', await ev(() => BTS.Brawl.active));
for (let k = 0; k < 40 && (await ev(() => BTS.Brawl.active && !BTS.Brawl.cine && BTS.Brawl.phase === 'fight')); k++) { await ev(() => { const B = BTS.Brawl; for (const f of B.foes.slice()) if (f.st !== 'down' && !f.enter && !B.art && !B.sup) B.hitFoe(f, 999, 1, 0, true); }); await wait(400); }
for (let k = 0; k < 80 && (await ev(() => BTS.Brawl.active)); k++) { await page.keyboard.press('KeyE'); await wait(400); } await wait(1500);
console.log('after skip', JSON.stringify(await st())); await shot('world-panel');
// furnace path
await ev(() => { BTS.Cutscene.skip(true); BTS.G.heist = 0; BTS.UI.clear(); BTS.Game.toTitle(); BTS.Menus.checkpoints(); [...document.querySelectorAll('.mi')].reverse().find(b => /Story beats/.test(b.textContent)).click(); [...document.querySelectorAll('.mi')].reverse().find(b => /Lift Zero/.test(b.textContent)).click(); }); await wait(500);
const seen = [];
let fought = false;
for (let i = 0; i < 700; i++) { const s = await st(); if (!s.cine) break;
  if (s.brawl) { const ti = await ev(() => BTS.Brawl.def.title); if (!seen.includes(ti)) { seen.push(ti); console.log('brawl', ti, JSON.stringify(s)); await wait(2500); await shot('flow-' + ti.replace(/ /g, '')); fought = true; }
    if (ti === 'THE PAIRING') await ev(() => { const B = BTS.Brawl; if (B.cine) B.nextShot(); else if (B.phase === 'fight' && !B.art && !B.sup) for (const f of B.foes.slice()) if (f.st !== 'down') B.hitFoe(f, 999, 1, 0, true); });
    await page.keyboard.press('KeyE'); await wait(400); continue; }
  const ch = await ev(() => { const b = [...document.querySelectorAll('#dlg .ch, #dlg button')].filter(b => b.offsetParent); const t = b.find(x => /BREAK FREE/.test(x.textContent)); if (t) { t.click(); return 'break'; } if (b.length > 1) { b[0].click(); return 'c0'; } return null; });
  if (ch === 'break') console.log('chose BREAK FREE'); if (!ch) await page.keyboard.press('Enter'); await wait(160); }
console.log('fights seen', seen, 'fought', fought, 'end', JSON.stringify(await st()), await ev(() => [BTS.G.mapId, BTS.G.flags.ranForHer]));
console.log('errors', errors); await browser.close();
