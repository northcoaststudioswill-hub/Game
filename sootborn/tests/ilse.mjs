import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
console.log(await ev(() => { BTS.UI.clear(); const L = typeof DAY4 === 'function' ? DAY4() : DAY4, i = L.findIndex(s => s.t && /keep the table waiting/.test(s.t)); window.__cards = []; const o = Cutscene.card.bind(Cutscene); Cutscene.card = (t, s, b, tr) => { window.__cards.push((t || '(blank)') + (tr ? ' [' + tr + ']' : '')); return o(t, s, b, tr); }; Fade.a = 0; Cutscene.play(L.slice(i - 1, i + 12), () => { window.__done = 1; }); return ['step index', i, 'of', L.length]; }));
await wait(1500); await page.keyboard.press('KeyE'); await wait(400); await page.keyboard.press('KeyE'); await wait(1200); await page.keyboard.press('KeyE'); await wait(400); await page.keyboard.press('KeyE');
const seen = []; for (let i = 0; i < 16; i++) { await wait(330); seen.push(await ev(() => [(Cutscene.panel || {}).id || '-', document.querySelector('#card').classList.contains('hidden') ? '' : 'card', Fade.a.toFixed(1), Dialogue.active ? 'dlg' : ''].join(':'))); if (i === 3 || i === 6 || i === 10) await page.screenshot({ path: '/home/claude/shots/v68/ilse-' + i + '.png' }); }
console.log(seen.join('  ')); console.log('cards', await ev(() => window.__cards), 'errors', errors); await browser.close();
