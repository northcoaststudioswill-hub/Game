// live cam: play a fight (or a scripted moment) and lay the frames out on one sheet
import { chromium } from 'playwright'; import { execSync } from 'child_process';
const F = process.env.F || 'ford', S = process.env.S || 'bot', N = +(process.env.N || 12), GAP = +(process.env.GAP || 260), PORT = process.env.PORT;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const page = await (await browser.newContext({ viewport: PORT ? { width: 390, height: 844 } : { width: 844, height: 390 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff' + (process.env.HASH || '')); await wait(600); await page.keyboard.press('Enter'); await wait(6500);
await ev(f => { const B = BTS.Brawl; BTS.UI.clear(); DEV.quick = 1; B.start(BTS.FF[f](), () => {}); B.cine = null; B.phase = 'fight'; B.tipT = 0; DEV.quick = 0; }, F);
await wait(1200); let n = 0; const R = await ev(() => { const r = document.querySelector('#game').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }); const shot = async () => { await page.screenshot({ clip: R, path: `/tmp/cam/${F}-${S}-${String(n++).padStart(2, '0')}.png` }); };
execSync('mkdir -p /tmp/cam && rm -f /tmp/cam/' + F + '-' + S + '-*.png');
const near = () => ev(() => { const B = BTS.Brawl, f = B.foes.find(o => o.st !== 'down'), p = B.p; if (f) { f.cd = 99; f.x = p.x + 36; f.y = p.y; f.st = 'approach'; } });
if (S === 'one') { await near(); await ev(() => { const B = BTS.Brawl, f = B.foes[0]; f.broken = 4; f.st = 'hurt'; f.t = -4; B.p.fury = 100; }); await page.keyboard.down('KeyE'); for (let i = 0; i < N; i++) { await wait(GAP); await shot(); } await page.keyboard.up('KeyE'); }
else if (S === 'three') { await near(); await ev(() => { const B = BTS.Brawl; B.p.hp = 2; B.p.fury = 60; }); await page.keyboard.down('KeyE'); for (let i = 0; i < N; i++) { await wait(GAP); await shot(); } await page.keyboard.up('KeyE'); }
else if (S === 'air') { await near(); await ev(() => { BTS.Brawl.p.fury = 100; }); await page.keyboard.press('KeyF'); await wait(260); await page.keyboard.down('KeyQ'); await page.keyboard.down('KeyV'); for (let i = 0; i < N; i++) { await wait(GAP); await shot(); if (i === 1) { await page.keyboard.up('KeyQ'); await page.keyboard.up('KeyV'); } } }
else if (S === 'parry') { await near(); await ev(() => { const B = BTS.Brawl, p = B.p, f = B.foes[0]; p.st = 'guard'; p.gt = 0; p.fx = 1; p.fy = 0; B.hurtPlayer(f, 1, -1, 0); }); for (let i = 0; i < N; i++) { await wait(GAP); await shot(); if (i > 2) await page.keyboard.press('KeyE'); } }
else if (S === 'break') { await near(); await ev(() => { const B = BTS.Brawl, f = B.foes[0]; f.hp = Math.floor(f.max * .44); }); for (let i = 0; i < N; i++) { await wait(GAP); await shot(); if (i > 8) { await near(); await page.keyboard.press(i % 2 ? 'KeyE' : 'KeyC'); } if (i === 3) await page.keyboard.press('KeyE'); } }
else { // a bot that walks at the nearest man and uses everything
  const keys = ['KeyE', 'KeyE', 'KeyE', 'KeyC', 'KeyX', 'KeyE', 'KeyC', 'KeyC', 'KeyQ', 'KeyF', 'KeyE', 'KeyE', 'KeyX', 'KeyE']; let held = [];
  for (let i = 0; i < N * 4; i++) { const d = await ev(() => { const B = BTS.Brawl, p = B.p; if (!B.active || B.phase !== 'fight') return null; p.hp = Math.max(p.hp, 6); const f = B.foes.filter(o => o.st !== 'down').sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0]; return f ? [f.x - p.x, f.y - p.y] : null; });
    for (const k of held) await page.keyboard.up(k); held = []; if (d) { if (Math.abs(d[0]) > 20) held.push(d[0] > 0 ? 'ArrowRight' : 'ArrowLeft'); if (Math.abs(d[1]) > 10) held.push(d[1] > 0 ? 'ArrowDown' : 'ArrowUp'); for (const k of held) await page.keyboard.down(k); }
    await page.keyboard.press(keys[i % keys.length]); await wait(GAP / 4); if (i % 4 === 3) await shot(); } }
console.log(F, S, JSON.stringify(await ev(() => { const B = BTS.Brawl; return { ph: B.phase, msg: B.msg, sup: !!B.sup, memo: !!B.memo, blade: B.p.blade, php: B.p.hp, fhp: B.foes.map(f => f.hp), vq: B.vcur && (B.vcur.t || B.vcur) }; })), 'errors', errors.slice(0, 3));
await browser.close();
execSync(`python3 - <<'PY'
from PIL import Image; import glob
fs=sorted(glob.glob('/tmp/cam/${F}-${S}-*.png')); port=${PORT ? 1 : 0}
cols=6 if port else 3; im0=Image.open(fs[0]); tw=280 if port else 562; th=int(tw*im0.height/im0.width)
rows=(len(fs)+cols-1)//cols; sh=Image.new('RGB',(cols*tw,rows*th))
for i,f in enumerate(fs): sh.paste(Image.open(f).convert('RGB').resize((tw,th)),((i%cols)*tw,(i//cols)*th))
sh.save('/home/claude/shots/ff/cam-${F}-${S}.png')
PY`);
