// the end of the last chapter, from the last blow on, once for each ending: node ending.mjs  (E=below|struck)
import { chromium } from 'playwright';
const E = process.env.E || 'below', PICK = E === 'below' ? 1 : 0;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +(process.env.VW || 1280), height: +(process.env.VH || 720) } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v74/end-${E}-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(() => { BTS.UI.clear(); BTS.G.mode = 'cut'; BTS.G.flags.wrenAsk = 1; BTS.G.flags.marenDoor = 1; const st = P2[5](), i = st.findIndex(s => s.brawl && String(s.brawl).includes('ember')); window.__n = st.length - i; BTS.Cutscene.play(st.slice(i + 1), () => afterPart2(5)); });
await wait(1500); await shot('card');
for (let i = 0; i < 40 && !(await ev(() => Prelude.on && Prelude.pl)); i++) await wait(200);
console.log('last flash on:', await ev(() => Prelude.pl && [Prelude.pl.name, Prelude.pl.secs, Prelude.pl.count])); await wait(3000); await shot('flash-a');
await page.keyboard.press('KeyE'); await wait(300); console.log('a button does not cut it short:', await ev(() => !!Prelude.on));
await wait(6500); await shot('flash-b'); const seen = []; for (let i = 0; i < 40 && (await ev(() => Prelude.on && Prelude.pl)); i++) { seen.push(await ev(() => Prelude.pl && Prelude.pl.n)); await wait(250); }
console.log('count reached:', Math.max(...seen.filter(Boolean)));
// her room, and the choice
let picked = 0; for (let i = 0; i < 200; i++) { const st = await ev(() => ({ pg: !!(Prelude.on && Prelude.pg), ch: [...document.querySelectorAll('#dlg .choices button')].filter(b => b.offsetParent).map(b => b.textContent) })); if (st.pg) break; if (st.ch.length) { console.log('choice:', st.ch.join(' | ')); await ev(k => [...document.querySelectorAll('#dlg .choices button')].filter(b => b.offsetParent)[k].click(), PICK); picked = 1; } else await page.keyboard.press('Enter'); await wait(140); }
console.log('picked', picked, 'ending flag', await ev(() => BTS.G.flags.ending));
const pg = await ev(() => Prelude.pg.list.map(p => [p.plate, p.lines.length, p.arg])); console.log('pictures:', JSON.stringify(pg));
const all = await ev(() => Prelude.pg.list.map(p => p.lines.map(l => (l[0] ? l[0] + ': ' : '') + l[1]).join(' / ')).join('\n')); console.log('little ember beat in it:', /little ember/.test(all), '| struck line in it:', /last line I ever struck/.test(all), '| Kestrel asked in:', /Come in, Kestrel/.test(all));
let last = -1, turns = 0; for (let i = 0; i < 400 && (await ev(() => Prelude.on && Prelude.pg)); i++) { const q = await ev(() => [Prelude.pg.i, Prelude.pg.li, Prelude.pg.t]); if (q[0] !== last && q[2] > 1.2) { last = q[0]; await wait(900); await shot('p' + q[0]); } await page.keyboard.press('KeyE'); turns++; await wait(170); }
console.log('turned', turns, 'times; pictures seen', last + 1);
for (let i = 0; i < 80 && !(await ev(() => BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); }
await wait(500); await shot('end'); console.log('THE END text:', await ev(() => (document.querySelector('.modal, #ui').innerText || '').replace(/\s+/g, ' ').slice(0, 230)), '| errors', errors);
await browser.close();
