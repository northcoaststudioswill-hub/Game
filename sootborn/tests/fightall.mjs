// every fight, played with real keys by a simple bot (walk at the nearest man, strike, hold for ELEVEN when full): node fightall.mjs  (K=a,b  PART=i/n)
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 640, height: 360 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
let keys = process.env.K ? process.env.K.split(',') : await ev(() => Object.keys(BTS.FF).filter(k => { try { const d = BTS.FF[k](); return d && !d.walk && (d.foes || d.waves); } catch (e) { return false; } }));
if (process.env.PART) { const [i, n] = process.env.PART.split('/').map(Number); keys = keys.filter((_, j) => j % n === i); }
const held = new Set(), set = async want => { for (const k of [...held]) if (!want.has(k)) { await page.keyboard.up(k); held.delete(k); } for (const k of want) if (!held.has(k)) { await page.keyboard.down(k); held.add(k); } };
const MAX = +(process.env.MAX || 100) * 1000;
for (const key of keys) {
  await ev(k => { if (BTS.Brawl.active) BTS.Brawl.end(false); BTS.UI.clear(); window.__r = null; window.__n = 0; const start = () => BTS.Brawl.start(Object.assign(BTS.FF[k](), { intro: null }), w => { if (w) window.__r = 'won'; else { window.__n++; if (window.__n < 3 && !window.__stop) { BTS.UI.clear(); start(); } else window.__r = 'lost ' + window.__n + ' times'; } }); window.__stop = 0; start(); BTS.UI.clear(); }, key);
  const t0 = Date.now(); let last = '', ph = 0;
  while (Date.now() - t0 < MAX) { const s = await ev(() => { const B = BTS.Brawl; if (window.__r) return { r: window.__r }; if (!B.active) return { r: 'ended' }; if (BTS.Dialogue.active || BTS.UI.stack.length) return { dlg: 1 }; const p = B.p, f = B.foes.filter(o => o.st !== 'down' && o.hp > 0).sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y))[0]; return { phase: B.phase, sup: !!B.sup, fury: p.fury, hp: p.hp, dx: f ? f.x - p.x : 0, dy: f ? f.y - p.y : 0, n: B.foes.length, fh: f ? Math.round(f.hp) : 0, msg: B.msg }; });
    if (s.r) { last = s.r; break; } if (s.dlg) { await set(new Set()); await page.keyboard.press('KeyE'); await wait(150); continue; }
    last = `${s.phase} hp ${Math.round(s.hp)} foes ${s.n} nearest ${s.fh}`;
    const want = new Set(); if (s.fury >= 100) { want.add('KeyE'); } else { if (s.dx > 16) want.add('KeyD'); else if (s.dx < -16) want.add('KeyA'); if (s.dy > 8) want.add('KeyS'); else if (s.dy < -8) want.add('KeyW'); }
    await set(want); if (s.fury < 100) { ph++; await page.keyboard.press(ph % 9 === 8 ? 'KeyX' : ph % 5 === 4 ? 'KeyC' : 'KeyE'); } await wait(70); }
  await set(new Set()); await ev(() => { window.__stop = 1; });
  console.log(key.padEnd(12), /won|ended/.test(last) ? last : 'NOT WON: ' + last, '|', Math.round((Date.now() - t0) / 1000) + 's'); }
console.log('errors', errors); await browser.close();
