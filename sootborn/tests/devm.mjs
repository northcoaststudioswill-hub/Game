// the Dev menu: versions on entries, the way back from a fight, a mission, a comic level and a cutscene
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
const click = re => ev(src => { const r = new RegExp(src, 'i'), b = [...document.querySelectorAll('#layer button')].filter(b => b.offsetParent).find(b => r.test(b.textContent)); if (b) { b.click(); return b.textContent.trim(); } return null; }, re);
const top = () => ev(() => { const m = [...document.querySelectorAll('#layer .modal, #layer > div')].pop(); return m ? (m.querySelector('h2, h3, .title') || {}).textContent : null; });
const state = () => ev(() => ({ mode: BTS.G.mode, stack: BTS.UI.stack.length, from: DEV.from, brawl: BTS.Brawl.active, cut: Cutscene.active, issue: Issue.on, heist: BTS.G.heist, back: !document.querySelector('#devback').classList.contains('hidden'), title: (BTS.UI.stack.length ? (BTS.UI.top().title || '') : '') }));
console.log('open dev:', await click('Dev menu')); await wait(300); await page.screenshot({ path: '/home/claude/shots/v70/dev-0.png' });
console.log('section:', await click('^Fights')); await wait(300); await page.screenshot({ path: '/home/claude/shots/v70/dev-1.png' });
console.log('entries:', (await ev(() => [...document.querySelectorAll('#layer button')].filter(b => b.offsetParent).map(b => b.textContent.trim()))).slice(0, 8).join(' | '));
const home = async () => { for (let i = 0; i < 5 && (await state()).stack > 1; i++) { await click('^Back$'); await wait(200); } };
for (const [sec, entry, ms] of [['^Fights', 'cold open', 5000], ['Assay missions', 'The Camp', 4000], ['Levels in 3D', 'Riser Nine', 9000], ['Cutscenes', 'Prologue', 4000], ['Story beats', 'Ashgate', 3500]]) {
  await home(); await click('Dev menu'); await wait(250); await click(sec); await wait(250);
  const picked = await click(entry); await wait(ms); if (sec === 'Levels in 3D') { await page.screenshot({ path: '/home/claude/shots/v70/dev-issue.png' }); console.log('button on top at its centre:', await ev(() => { const b = document.querySelector('#devback'), r = b.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e && e.id; })); } const a = await state(); if (sec === 'Levels in 3D') await ev(() => Game.devBack()); else await page.keyboard.press('F2'); await wait(900); const b = await state();
  console.log(sec, '->', picked, '\n   running:', JSON.stringify(a), '\n   after:', JSON.stringify(b)); }
await page.screenshot({ path: '/home/claude/shots/v70/dev-2.png' });
// a scene that ends by itself comes back too
await home(); await click('Dev menu'); await wait(250); await click('Cutscenes'); await wait(250); console.log('film:', await click('Film · The Pairing'));
for (let i = 0; i < 80 && (await state()).mode !== 'title'; i++) { await page.keyboard.press('KeyE'); await wait(300); } await wait(500); console.log('   after it ended:', JSON.stringify(await state()));
// leaving the Dev menu by Back forgets it
for (let i = 0; i < 4 && (await state()).stack > 1; i++) { await click('^Back$'); await wait(200); } console.log('at the title menu:', JSON.stringify(await state()), 'errors', errors); await browser.close();
