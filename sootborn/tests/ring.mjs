// the fourth ring, each visit, both ways: node ring.mjs  (N=1|2|3, PICK=0|1|2)
import { chromium } from 'playwright';
const N = +(process.env.N || 1), PICK = +(process.env.PICK || 0), TAG = `r${N}p${PICK}`;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: +(process.env.VW || 1280), height: +(process.env.VH || 720) } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
const shot = n => page.screenshot({ path: `/home/claude/shots/v72/${TAG}-${n}.png` });
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
await ev(([n, s0]) => { BTS.UI.clear(); window.__r = null; if (s0 >= 0) BTS.G.flags.susp = s0; BTS.Brawl.start(BTS.FF.ring(n), w => { window.__r = 'ended:' + w; }); BTS.UI.clear(); }, [N, +(process.env.S0 || -1)]);
const susp = () => ev(() => BTS.G.flags.susp), trail = [await susp()];
await wait(1100); await shot(0);
const talkOut = async (snapAtChoice) => { for (let i = 0; i < 40 && await ev(() => BTS.Dialogue.active); i++) { const ch = await ev(() => [...document.querySelectorAll('#dlg .choices button')].map(b => b.textContent)); if (ch.length) { if (/Keep walking|Bow from/.test(ch[0])) { await shot('bell'); console.log('  (the bell)', ch.join(' | ')); } if (snapAtChoice) { await shot(snapAtChoice); snapAtChoice = 0; } await ev(k => document.querySelectorAll('#dlg .choices button')[k].click(), Math.min(PICK, ch.length - 1)); } else await page.keyboard.press('KeyE'); await wait(240); } trail.push(await susp()); };
await wait(1600); await talkOut();
const who = await ev(() => { const B = BTS.Brawl, w = B.def.walk; return { npcs: B.allies.filter(a => a.talk).map(a => [a.name, Math.round(a.x), Math.round(a.y)]), spots: (w.spots || []).map(s => [s.name, s.x, s.y, s.exit ? 1 : 0]) }; });
let n = 1;
for (const [name, x, y] of who.npcs) { await ev(([x, y]) => { const p = BTS.Brawl.p; p.x = x - 16; p.y = y + 4; }, [x, y]); await wait(500); const near = await ev(() => BTS.Brawl.wk.near && BTS.Brawl.wk.near.name);
  if (await ev(() => BTS.Dialogue.active)) { console.log('  (the bell)'); await wait(700); await shot('bell'); await talkOut(); await wait(300); }
  await shot(n++); await page.keyboard.press('KeyE'); await wait(400); await talkOut('c' + n); console.log('npc', name, '-> near:', near, 'noticed:', await susp());
  await wait(500); if (await ev(() => BTS.Dialogue.active)) { console.log('  (the bell)'); await wait(900); await shot('bell'); await talkOut('bellc'); await wait(300); console.log('  after the bell, noticed:', await susp()); } }
for (const [name, x, y, ex] of who.spots.filter(s => !s[3])) { await ev(([x, y]) => { const p = BTS.Brawl.p; p.x = x - 4; p.y = y + 14; }, [x, y]); await wait(450); const near = await ev(() => BTS.Brawl.wk.near && BTS.Brawl.wk.near.name); if (n < 12) await shot(n++); await page.keyboard.press('KeyE'); await wait(400); await talkOut(); console.log('spot', name, '-> near:', near); }
console.log('objective:', await ev(() => { const B = BTS.Brawl, w = B.def.walk; return typeof w.obj === 'function' ? w.obj(B.wk) : w.obj; }), '| codex:', await ev(() => ['f_line', 'f_bellplate', 'f_greens', 'f_handpipe'].map(i => { try { return Codex.has ? Codex.has(i) : JSON.stringify(Codex.d || {}).includes(i); } catch (e) { return '?'; } }).join(',')));
const ex = who.spots.find(s => s[3]); await ev(([x, y]) => { const p = BTS.Brawl.p; p.x = x - 4; p.y = y + 16; }, [ex[1], ex[2]]); await wait(450); await shot('door'); await page.keyboard.press('KeyE'); await wait(500); await shot('doorline'); await talkOut(); await wait(900);
console.log('result', await ev(() => window.__r), '| noticed over the walk:', trail.join(' '), '| up', await ev(() => BTS.G.flags.suspUp), 'down', await ev(() => BTS.G.flags.suspDn), '| errors', errors);
await browser.close();
