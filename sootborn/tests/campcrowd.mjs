import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const p = await (await b.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const wait = ms => p.waitForTimeout(ms), ev = (f, a) => p.evaluate(f, a);
await p.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await p.keyboard.press('Enter'); await wait(250); }
const K = process.env.K || 'campday';
await ev(k => { BTS.UI.clear(); BTS.Brawl.start(BTS.FF[k](), () => {}); BTS.UI.clear(); }, K);
for (let i = 0; i < 12; i++) { if (await ev(() => BTS.Dialogue.active)) await p.keyboard.press('KeyE'); await wait(200); }
const rep = async tag => console.log(tag, await ev(() => BTS.Brawl.allies.map(a => a.id + '@' + Math.round(a.x) + ',' + Math.round(a.y)).join(' ')));
await rep('start'); await p.keyboard.down('KeyD'); for (let i = 0; i < 20; i++) { await wait(300); if (await ev(() => BTS.Dialogue.active)) { await p.keyboard.press('KeyE'); } } await p.keyboard.up('KeyD'); await rep('after walking right');
await p.screenshot({ path: '/home/claude/shots/crowd.png' }); await b.close();
