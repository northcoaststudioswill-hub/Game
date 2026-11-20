// a 2.5D place, end to end: node walk2.mjs  (M=campday|lastbell|circle|ward..., PICK=0|1|2 for a choice at the exit)
import { chromium } from 'playwright';
const M = process.env.M || 'campday', PICK = +(process.env.PICK || 0);
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +(process.env.VW || 1280), height: +(process.env.VH || 720) } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v73/${M}-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(m => { BTS.UI.clear(); window.__r = null; window.__said = []; const o = BTS.Dialogue.start.bind(BTS.Dialogue); BTS.Dialogue.start = (steps, cb) => { for (const s of steps || []) window.__said.push(s.t ? (s.who || s.say || 'narr') + ': ' + String(s.t).slice(0, 70) : s.choice ? 'CHOICE: ' + s.choice.map(c => c.t).join(' | ') : s.narr ? 'narr: ' + String(s.narr).slice(0, 70) : JSON.stringify(s).slice(0, 70)); return o(steps, cb); }; BTS.Brawl.start(BTS.FF[m](), w => { window.__r = 'ended:' + w; }); BTS.UI.clear(); }, M);
await wait(1100); await shot(0);
const talkOut = async () => { for (let i = 0; i < 30 && await ev(() => BTS.Dialogue.active); i++) { const ch = await ev(() => [...document.querySelectorAll('#dlg .choices button')].map(b => b.textContent)); if (ch.length) { await ev(k => document.querySelectorAll('#dlg .choices button')[k].click(), Math.min(PICK, ch.length - 1)); } else await page.keyboard.press('KeyE'); await wait(260); } };
await wait(1600); console.log('opening line up:', await ev(() => BTS.Dialogue.active)); await shot(1); await talkOut();
const who = await ev(() => { const B = BTS.Brawl, w = B.def.walk; return { npcs: B.allies.filter(a => a.talk).map(a => [a.name, Math.round(a.x), Math.round(a.y)]), spots: (w.spots || []).map(s => [s.name, s.x, s.y, s.exit ? 1 : 0]) }; });
let n = 2; for (const [name, x, y] of who.npcs) { await ev(([x, y]) => { const p = BTS.Brawl.p; p.x = x - 14; p.y = y + 6; }, [x, y]); await wait(350); const near = await ev(() => BTS.Brawl.wk.near && BTS.Brawl.wk.near.name); if (n < 5) await shot(n++); await page.keyboard.press('KeyE'); await wait(400); if (n === 5) await shot(n++); await talkOut(); console.log('npc', name, '-> near:', near); }
for (const [name, x, y, ex] of who.spots.filter(s => !s[3])) { await ev(([x, y]) => { const p = BTS.Brawl.p; p.x = x - 4; p.y = y + 14; }, [x, y]); await wait(350); console.log('spot', name, '-> near:', await ev(() => BTS.Brawl.wk.near && BTS.Brawl.wk.near.name)); await page.keyboard.press('KeyE'); await wait(400); await talkOut(); }
console.log('objective now:', await ev(() => { const B = BTS.Brawl, w = B.def.walk; return typeof w.obj === 'function' ? w.obj(B.wk) : w.obj; }));
const ex = who.spots.find(s => s[3]); if (ex) { await ev(([x, y]) => { const p = BTS.Brawl.p; p.x = x - 4; p.y = y + 16; }, [ex[1], ex[2]]); await wait(350); await shot(7); await page.keyboard.press('KeyE'); await wait(500); await shot(8); await talkOut(); await wait(900); }
console.log('result', await ev(() => window.__r), 'flags', await ev(() => JSON.stringify({ campSat: BTS.G.flags.campSat })), 'errors', errors);
console.log((await ev(() => window.__said)).join('\n'));
await browser.close();
