import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.stack.split('\n').slice(0,3).join(' | ').slice(0,300)));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `shots/dr-${n}.png` });
await page.goto(new URL('../index.html', import.meta.url).href); await wait(600); await page.keyboard.press('Enter');
for (let i = 0; i < 100 && !(await ev(() => BTS.G.mode === 'opening')); i++) await wait(100);
await wait(1500); await page.keyboard.press('Space'); await wait(2500); await ev(() => { Settings.d.issue3d = 0; });
const click = l => ev(l => { [...document.querySelectorAll('.mi')].reverse().find(b => b.textContent.includes(l)).click(); }, l);
const run = async (sec, label, tag, max) => {
  await ev(() => { BTS.UI.clear(); BTS.Cutscene.active && BTS.Cutscene.skip(true); BTS.Brawl.active = false; BTS.Brawl.cine = null; BTS.G.heist = 0; BTS.Game.toTitle(); BTS.Menus.checkpoints(); }); await wait(200);
  if (label === '__chain') { await ev(() => { BTS.UI.clear(); BTS.Game.loadSave(BTS.Save.migrate(JSON.parse(JSON.stringify(CHECKPOINTS.fest)))); setTimeout(() => { BTS.UI.clear(); BTS.Fade.a = 1; BTS.Fade.dir = 0; BTS.Fade.busy = false; BTS.Cutscene.play(DAY3(), () => afterDay(3, BTS.Save.snapshot())); }, 60); }); await wait(900); } else {
  await click(sec); await wait(150); await click(label); await wait(900); }
  const seen = []; let n = 0, lastI = -1;
  for (let k = 0; k < max; k++) {
    const s = await ev(() => ({ cine: BTS.Cutscene.active, i: BTS.Cutscene.i, brawl: BTS.Brawl.active, ti: BTS.Brawl.active && BTS.Brawl.def.title, bc: !!BTS.Brawl.cine, ci: BTS.Brawl.cine ? BTS.Brawl.cine.i : -1, ph: BTS.Brawl.phase, mode: BTS.G.mode, g3: !!BTS.Brawl.g3 }));
    if (!s.cine && !s.brawl && await ev(() => BTS.G.heist === 3)) { const k = await ev(() => Mission.key); await wait(1500); await shot(tag + '-' + (n++) + '-mission'); console.log(tag, 'mission', k); await ev(() => Mission.finish()); await wait(600); continue; }
    if (!s.cine && !s.brawl && process.env.CHAIN && s.mode === 'dayend') { const labs = await ev(() => [...document.querySelectorAll('.mi')].map(b => b.textContent.trim())); console.log(tag, 'step', k, 'dayend buttons', JSON.stringify(labs)); await shot(tag + '-end' + (n++)); if (!labs.length || /title/i.test(labs[0])) { console.log(tag, 'chain reached the end'); break; } await ev(() => document.querySelector('.mi').click()); await wait(1200); continue; }
    if (!s.cine && !s.brawl) { console.log(tag, 'ended in', s.mode); break; }
    if (s.brawl) { const key = s.ti + (s.bc ? ':c' + s.ci : ':' + s.ph); if (!seen.includes(key)) { seen.push(key); await wait(s.bc ? 900 : 1600); await shot(tag + '-' + (n++) + '-b'); console.log(tag, key, 'g3', s.g3); }
      await ev(() => { const B = BTS.Brawl; if (B.def.doomedFight && B.phase === 'fight') B.t = Math.max(B.t, B.def.doomed); if (B.cine) B.nextShot(); else if (B.phase === 'fight' && !B.art && !B.sup && !B.def.doomed) for (const f of B.foes.slice()) if (f.st !== 'down' && !f.enter) B.hitFoe(f, 999, 1, 0, true); });
      await page.keyboard.press('KeyE'); await wait(250); continue; }
    if (s.i !== lastI) { lastI = s.i; await wait(700); await shot(tag + '-' + (n++)); }
    await page.keyboard.press('Enter'); await wait(350);
  }
  console.log(tag, 'errors', errors.length, errors.slice(0, 2));
};
const W = process.env.W || 'd1';
if (W === 'chain') await run('', '__chain', 'chain', 9000);
if (W === 'd1') await run('Story beats', 'End of Day 1', 'd1', 260);
if (W === 'd2') await run('Story beats', 'End of Day 2', 'd2', 200);
if (W === 'fall') await run('Fights', 'The Fall', 'fall', 120);
if (W === 'd3') await run('Story beats', 'Day 3', 'd3', process.env.CHAIN ? 6000 : 520);
if (W === 'd4') await run('Story beats', 'Day 4', 'd4', 900);
if (/^p[1-5]$/.test(W)) await run('Story beats', 'Part Two · ' + W[1], W, 900);
if (W === 'valley') await run('Fights', 'The Valley', 'val', 120);
await browser.close();
