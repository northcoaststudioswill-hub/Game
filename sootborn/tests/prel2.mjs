// New game runs the animated intro to eleven and hands over to the Keep's card; SKIP=1 presses a key at 3 s instead
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +(process.env.VW || 1280), height: +(process.env.VH || 720) } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600);
for (let i = 0; i < 60 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); }
console.log('at title: mode', await ev(() => BTS.G.mode), 'fight running', await ev(() => BTS.Brawl.active), 'menu', await ev(() => [...document.querySelectorAll('#layer button')].map(b => b.textContent.trim()).slice(0, 6).join(' / ')));
await ev(() => { window.__cards = []; const o = Cutscene.card.bind(Cutscene); Cutscene.card = (t, s, b, tr) => { window.__cards.push(t + ' | ' + (s || '')); return o(t, s, b, tr); }; window.__snd = []; const p = Sound.play.bind(Sound); Sound.play = (n, k) => { if (Prelude.on) window.__snd.push(n); return p(n, k); }; });
await ev(() => { const b = [...document.querySelectorAll('button')].find(b => /New game/i.test(b.textContent)); b && b.click(); }); await wait(500);
for (let i = 0; i < 6 && !(await ev(() => Prelude.on)); i++) { await ev(() => { const b = [...document.querySelectorAll('button')].find(b => /begin|start|yes/i.test(b.textContent) && b.offsetParent); if (b) b.click(); }); await wait(400); }
const t0 = Date.now(), seen = []; let last = -9;
while (await ev(() => Prelude.on) && Date.now() - t0 < 60000) { const n = await ev(() => Prelude.n); if (n !== last) { seen.push(n + '@' + ((Date.now() - t0) / 1000).toFixed(1)); last = n; } if (process.env.SKIP && Date.now() - t0 > 3000) await page.keyboard.press('KeyE'); await wait(60); }
console.log('intro ran', ((Date.now() - t0) / 1000).toFixed(1) + 's; pictures', seen.join(' '), '; music', await ev(() => Sound.tname), '; sounds', await ev(() => window.__snd.join(',')));
await wait(900); console.log('then: cards', await ev(() => window.__cards), 'cutscene', await ev(() => Cutscene.active), 'canvas left', await ev(() => !!document.querySelector('#prelude')), 'skip button hidden', await ev(() => document.querySelector('#cskip').classList.contains('hidden')));
await page.screenshot({ path: '/home/claude/shots/v68/prel2-' + (process.env.SKIP ? 'skip' : 'full') + '.png' });
for (let i = 0; i < 80; i++) { const st = await ev(() => BTS.Brawl.active ? (BTS.Brawl.def.cold ? 'cold ' : '') + (BTS.Brawl.def.title || '') : ''); if (st) { console.log('fight:', st); break; } await page.keyboard.press('KeyE'); await wait(250); }
console.log('errors', errors); await browser.close();
