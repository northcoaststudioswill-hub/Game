import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600); await page.keyboard.press('Enter'); await wait(4500);
await ev(() => { BTS.UI.clear(); window.__done = 0; Mission.start('lamp', () => { window.__done = 1; BTS.Game.toTitle(); }); }); await wait(8000); for (let i = 0; i < 6; i++) { await page.keyboard.press('KeyE'); await wait(400); }
await ev(() => { for (const k of ['stores', 'ridge', 'tent']) BTS.G.flags['m_l_' + k] = 1; Mission.def.use({ id: 'fire2' }); }); await wait(1500);
console.log('walk?', await ev(() => [BTS.Brawl.active, BTS.Brawl.phase, BTS.Brawl.def && BTS.Brawl.def.title, BTS.Brawl.allies.length]));
await page.screenshot({ path: '/home/claude/shots/issue/lampw-0.png' });
await ev(() => { BTS.Brawl.p.x = -18; BTS.Brawl.p.y = 12; }); await wait(900); console.log('near', await ev(() => BTS.Brawl.wk.near && BTS.Brawl.wk.near.name)); await page.keyboard.press('KeyE'); await wait(1500);
console.log('after fire', await ev(() => [BTS.Brawl.active, BTS.Dialogue.active, BTS.G.mode, document.querySelector('#dlg') && document.querySelector('#dlg').innerText.replace(/\s+/g, ' ').slice(0, 70)]));
await page.keyboard.press('KeyE'); await wait(500); await page.keyboard.press('KeyE'); await wait(700);
console.log('choice', await ev(() => [...document.querySelectorAll('.choices button')].map(b => b.textContent.slice(0, 24))));
// second time at the fire in the same mission: straight to the name
await ev(() => { BTS.Dialogue.active = false; document.querySelector('#dlg').classList.add('hidden'); Mission.def.use({ id: 'fire2' }); }); await wait(500);
console.log('again', await ev(() => [BTS.Brawl.active, BTS.Dialogue.active]), 'errors', errors); await browser.close();
