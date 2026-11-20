// every 2.5D place, walked with real key presses: can a person reach each person, each thing and the way out? node walkall.mjs
import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await (await browser.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); const wait = ms => page.waitForTimeout(ms), ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/below-the-sun/dist/index.html#noff'); await wait(600);
for (let i = 0; i < 40 && !(await ev(() => BTS.G.mode === 'title' && BTS.UI.stack.length)); i++) { await page.keyboard.press('Enter'); await wait(250); } await wait(300);
const keys = (process.env.K ? process.env.K.split(',') : await ev(() => Object.keys(BTS.FF).filter(k => { try { const d = BTS.FF[k](); return d && d.walk; } catch (e) { return false; } })));
console.log('places:', keys.join(' '));
const talk = async () => { for (let i = 0; i < 60 && await ev(() => BTS.Dialogue.active); i++) { const n = await ev(() => document.querySelectorAll('#dlg .choices button').length); if (n) await ev(() => document.querySelectorAll('#dlg .choices button')[0].click()); else await page.keyboard.press('KeyE'); await wait(120); } };
const held = new Set(), set = async want => { for (const k of [...held]) if (!want.has(k)) { await page.keyboard.up(k); held.delete(k); } for (const k of want) if (!held.has(k)) { await page.keyboard.down(k); held.add(k); } };
const bad = [];
for (const key of keys) {
  await ev(k => { if (BTS.Brawl.active) BTS.Brawl.end(true); BTS.UI.clear(); window.__r = null; BTS.Brawl.start(BTS.FF[k](), w => { window.__r = 'ended:' + w; }); BTS.UI.clear(); }, key);
  await wait(1900); await talk(); await wait(300); await talk();
  const T = await ev(() => { const B = BTS.Brawl, w = B.def.walk; return B.allies.filter(a => a.talk).map(a => ({ id: a.id + '@' + Math.round(a.x), name: a.name, npc: 1 })).concat((w.spots || []).map(s => ({ id: s.id, name: s.name, exit: !!s.exit }))); });
  const order = T.filter(t => !t.exit).concat(T.filter(t => !t.exit)).concat(T.filter(t => t.exit)); const done = new Set(), miss = [];
  for (const t of order) { if (done.has(t.id) && !t.exit) { /* second pass only re-talks, for places with steps */ }
    if (!(await ev(() => BTS.Brawl.active))) break;
    let ok = false; const t0 = Date.now();
    while (Date.now() - t0 < 9000) { if (await ev(() => BTS.Dialogue.active)) { await set(new Set()); await talk(); }
      const s = await ev(t => { const B = BTS.Brawl; if (!B.active) return null; const w = B.def.walk, o = t.npc ? B.allies.find(a => a.talk && a.id + '@' + Math.round(a.x) === t.id) || B.allies.find(a => a.talk && a.name === t.name) : (w.spots || []).find(s => s.id === t.id); if (!o) return { gone: 1 }; const near = B.wk.near; return { dx: o.x - B.p.x, dy: o.y - B.p.y, near: !!near && (near === o || near.id === o.id && near.name === o.name) }; }, t);
      if (!s) break; if (s.gone) { ok = true; break; } if (s.near) { ok = true; break; }
      const want = new Set(); if (s.dx > 4) want.add('KeyD'); else if (s.dx < -4) want.add('KeyA'); if (s.dy > 4) want.add('KeyS'); else if (s.dy < -4) want.add('KeyW'); if (!want.size) want.add(Date.now() % 600 < 300 ? 'KeyA' : 'KeyD'); await set(want); await wait(60); }
    await set(new Set());
    if (ok) { done.add(t.id); await page.keyboard.press('KeyE'); await wait(250); await talk(); await wait(250); } else if (!done.has(t.id)) miss.push(t.name); }
  await wait(600); const r = await ev(() => window.__r), un = [...new Set(miss)].filter(n => !T.find(t => t.name === n && done.has(t.id)));
  console.log(key.padEnd(11), r === 'ended:true' ? 'walked out' : 'DID NOT END', '| reached', done.size, 'of', T.length, un.length ? '| NOT REACHED: ' + un.join('; ') : ''); if (r !== 'ended:true' || un.length) bad.push(key);
}
console.log('problems:', bad.join(' ') || 'none', '| errors', errors); await browser.close();
