import { chromium } from 'playwright';
// New game: the cold open is the Keep; it cannot be lost; ELEVEN cuts it; then Cinderwell. Real key presses.
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html'); await wait(600);
for (let i = 0; i < 60 && !(await ev(() => BTS.G.mode === 'title' || BTS.UI.stack.length)); i++) { await ev(() => { if (BTS.Brawl.active) BTS.Brawl.tap = true; }); await page.keyboard.press('Enter'); await wait(250); }
await ev(() => { const b = [...document.querySelectorAll('button')].find(b => /New game/i.test(b.textContent)); b && b.click(); }); await wait(800);
for (let i = 0; i < 6; i++) { const b = await ev(() => { const b = [...document.querySelectorAll('button')].find(b => /start|begin|yes|new|slot|empty/i.test(b.textContent) && b.offsetParent); if (b) { b.click(); return b.textContent.slice(0, 30); } return null; }); if (!b) break; await wait(500); }
const cards = []; await ev(() => { window.__cards = []; const o = Cutscene.card.bind(Cutscene); Cutscene.card = (t, s, b) => { window.__cards.push(t + ' | ' + (s || '')); return o(t, s, b); }; });
let st = '';
for (let i = 0; i < 200; i++) { st = await ev(() => { const B = BTS.Brawl; return B.active ? (B.cine ? 'film' : B.phase) + ':' + (B.def.title || '') + ':' + (B.def.cold ? 'cold' : '') : 'nofight:' + BTS.G.mode; }); if (/^fight:/.test(st)) break; await ev(() => { if (BTS.Brawl.active) BTS.Brawl.tap = true; }); await page.keyboard.press('KeyE'); await wait(300); }
console.log('reached', st, await ev(() => window.__cards));
await page.screenshot({ path: '/home/claude/shots/v66/cold-0.png' });
// take a beating first: it must not be losable
await ev(() => { const B = BTS.Brawl; B.revived = 1; for (let i = 0; i < 6; i++) { B.p.inv = 0; B.hurtPlayer(B.foes[0], 5, 1, 0); } window.__hp = B.p.hp; });
console.log('after six heavy blows: hp', await ev(() => window.__hp), 'phase', await ev(() => BTS.Brawl.phase));
// then fight: mash strike next to him; ELEVEN should be offered and then cut
const t0 = Date.now(); let log = [];
for (let i = 0; i < 260 && await ev(() => BTS.Brawl.active); i++) { const s = await ev(() => { const B = BTS.Brawl, f = B.foes[0], p = B.p; if (B.phase === 'fight' && !B.sup) { p.x = f.x - 18; p.y = f.y; p.fx = 1; p.fy = 0; f.guardT = 0; } return [Math.round(f.hp / f.max * 100), Math.round(p.fury), !!B.sup, B.msg]; }); if (i % 12 === 0) log.push(s.join('/')); if (s[1] >= 100 && !s[2]) { await page.keyboard.down('KeyE'); await wait(700); await page.keyboard.up('KeyE'); } else await page.keyboard.press('KeyE'); await wait(110); if (s[2] && !log.sup) { log.sup = 1; await page.screenshot({ path: '/home/claude/shots/v66/cold-1.png' }); } }
console.log('fight log (foe%/fury/eleven/msg):', log.join('  '));
console.log('ended after', Math.round((Date.now() - t0) / 1000) + 's', await ev(() => [BTS.Brawl.active, Fade.a, Cutscene.active]));
await wait(2500); console.log('next cards', await ev(() => window.__cards), 'errors', errors); await page.screenshot({ path: '/home/claude/shots/v66/cold-2.png' }); await browser.close();
