import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const p = await (await b.newContext({ viewport: { width: 844, height: 390 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await p.waitForTimeout(700); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
await p.evaluate(() => { BTS.UI.clear(); Mission.start('eve', () => {}); }); await p.waitForTimeout(800);
for (const [k, ids] of [['camp', ['cairn', 'board', 'rack', 'cadv2']], ['raid', ['tcairn', 'drop', 'tboard']], ['dais', ['boots', 'wagers']], ['eve', ['cairns', 'board2']], ['lamp', ['cairns', 'board2']]]) {
  await p.evaluate(k => { BTS.UI.clear(); Mission.start(k, () => {}); }, k); await p.waitForTimeout(700);
  for (const id of ids) { const r = await p.evaluate(id => { try { Dialogue.active && Dialogue.end && Dialogue.end(); MISSIONS[Mission.key || Mission.id || Object.keys(MISSIONS).find(x => MISSIONS[x] === Mission.def)].use({ id }); } catch (e) { return 'ERR ' + e.message; } return 'ok'; }, id); await p.waitForTimeout(350); const t = await p.evaluate(() => (document.querySelector('#dlg .tx') || {}).textContent || ''); console.log(k, id, r, '|', t.slice(0, 50)); for (let i = 0; i < 8; i++) { await p.keyboard.press('e'); await p.waitForTimeout(120); } } }
console.log('errors', errs); await b.close();
