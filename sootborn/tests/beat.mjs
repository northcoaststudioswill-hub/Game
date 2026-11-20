import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600); await page.keyboard.press('Enter');
for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'opening')); i++) await wait(100);
await ev(() => { BTS.Brawl.tap = true; }); await wait(1500);
const click = l => ev(l => { [...document.querySelectorAll('.mi')].reverse().find(b => b.textContent.includes(l)).click(); }, l);
for (const [beat, want] of [['Lift Zero', 'THE PAIRING'], ['Last Bell', 'THE PROCTOR'], ['First Fire', null]]) {
  await ev(() => { BTS.UI.clear(); BTS.Cutscene.active && BTS.Cutscene.skip(true); BTS.Brawl.active = false; BTS.Brawl.cine = null; BTS.G.heist = 0; BTS.Game.toTitle(); BTS.Menus.checkpoints(); }); await wait(200);
  await click('Story beats'); await wait(150); await click(beat); await wait(800);
  const seen = [], cards = [];
  for (let i = 0; i < 900; i++) {
    const s = await ev(() => ({ cine: BTS.Cutscene.active, brawl: BTS.Brawl.active, ti: BTS.Brawl.active && BTS.Brawl.def.title, mode: BTS.G.mode, card: (document.querySelector('#card:not(.hidden) h1, .card:not(.hidden) h1') || {}).textContent, ui: BTS.UI.stack.length }));
    if (s.card && !cards.includes(s.card)) cards.push(s.card);
    if (!s.cine && !s.brawl && await ev(() => BTS.G.heist === 3)) { seen.push('mission:' + await ev(() => Mission.key)); await wait(800); await ev(() => Mission.finish()); await wait(500); continue; }
    if (!s.cine && !s.brawl) { console.log(beat, 'ended in', s.mode, 'ui', s.ui); break; }
    if (s.brawl) { if (!seen.includes(s.ti)) seen.push(s.ti);
      await ev(() => { const B = BTS.Brawl; if (B.cine) B.nextShot(); else if (B.phase === 'fight' && !B.art && !B.sup && !B.def.doomed) for (const f of B.foes.slice()) if (f.st !== 'down' && !f.enter) B.hitFoe(f, 999, 1, 0, true); });
      await page.keyboard.press('KeyE'); await wait(250); continue; }
    const ch = await ev(() => { const b = [...document.querySelectorAll('#dlg .ch, #dlg button')].filter(b => b.offsetParent); const t = b.find(x => /BREAK FREE/.test(x.textContent)); if (t) { t.click(); return 1; } if (b.length > 1) { b[0].click(); return 1; } return 0; });
    if (!ch) await page.keyboard.press('Enter'); await wait(120);
  }
  console.log(beat, 'fights', seen, 'cards', cards, want && !seen.includes(want) ? 'MISSING ' + want : 'ok');
}
console.log('errors', errors); await browser.close();
