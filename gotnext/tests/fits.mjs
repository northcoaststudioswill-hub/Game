// The crossover fits: buy a whole outfit at The Plug (missing pieces only, 15% off), then a still of every fit on your
// player in front and from behind (armour, suits, pads, pants, boots, helms, hoods, tricorns, swords, shields).
// node tests/fits.mjs   (stills in tests/shots/fits-front.png and fits-back.png)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
// buy one through the real menu
let r = await p.evaluate(() => { const P = __pit, S = P.S, F = P.ev('FITS'), D = P.ev('DRIPS'); S.rep = 1e7; S.vc = 100000; P.uiClose(); P.enterWorld('hub', -6, 6, 0); window.__tick(30);
  const ft = F.find(f => f.id === 'captain'); S.owned.push('b_erin');      /* already own one piece: it is not charged again */
  const want = Math.round(ft.items.filter(i => i !== 'b_erin').reduce((t, i) => t + P.call('shopPrice', D[i].cost), 0) * 0.85);
  P.ev('uiShop()'); window.__tick(2); const tab = [...document.querySelectorAll('#panel .btn')].find(x => /FITS/.test(x.textContent)); tab.click(); window.__tick(2);
  const card = [...document.querySelectorAll('#panel .card')].find(c => /Hidden Kingdom Captain/.test(c.textContent)), btn = card && [...card.querySelectorAll('.btn')].find(x => /BUY FIT/.test(x.textContent));
  const label = btn ? btn.textContent : '', vc0 = S.vc; if (btn) btn.click(); window.__tick(2);
  return { label, want, paid: vc0 - S.vc, owned: ft.items.every(i => S.owned.includes(i)), worn: ft.items.every(i => S.worn[D[i].slot] === i), fits: F.length, missing: F.flatMap(f => f.items).filter(i => !D[i]) }; });
ok(r.label.includes(String(r.want)) && r.paid <= r.want && r.paid >= r.want - 2000, `BUY FIT charges only the missing pieces at 15% off: "${r.label}" (${r.want - r.paid} HC came straight back from a trophy)`);
ok(r.owned && r.worn, 'every piece is owned and on');
ok(r.missing.length === 0, `${r.fits} fits, every piece exists` + (r.missing.length ? ': missing ' + r.missing.join(', ') : ''));
r = await p.evaluate(() => { const P = __pit; P.uiClose(); P.ev("uiShop(true)"); window.__tick(2); [...document.querySelectorAll('#panel .btn')].find(x => /FITS/.test(x.textContent)).click(); window.__tick(2); const t = document.getElementById('panel').textContent; P.uiClose(); return /Hidden Kingdom Captain/.test(t) && !/Ghost Signal/.test(t); });
ok(r, 'the closet lists the fits you own, and only those');
// a still of each fit
const F = await p.evaluate(() => __pit.ev('FITS').map(f => [f.id, f.n]));
await p.evaluate(() => { document.querySelectorAll('#emobar,#whud,#keys,#toasts,#prompt,#goal,#padhint,#panel,#dlg,#talk').forEach(e => e.style.visibility = 'hidden'); });
const front = [], back = [];
for (const [id, n] of F) {
  for (const side of [0, 1]) {
    await p.evaluate(([id, side]) => { const P = __pit, S = P.S, W = P.W, ft = P.ev('FITS').find(f => f.id === id), D = P.ev('DRIPS'); for (const k of Object.keys(S.worn)) if (k !== 'hair') S.worn[k] = (D[S.worn[k]] && ['hd_none', 'f_none', 'a_none', 'bk_none'].includes(S.worn[k])) ? S.worn[k] : S.worn[k];
      P.uiClose(); S.worn.head = 'hd_none'; S.worn.face = 'f_none'; S.worn.arm = 'a_none'; S.worn.back = 'bk_none'; S.worn.socks = 's_low'; S.worn.bottom = 'b_basic'; S.worn.shoes = 'k_beat';
      for (const i of ft.items) { if (!S.owned.includes(i)) S.owned.push(i); S.worn[D[i].slot] = i; } P.call('worldPlayerRig'); W.look = false; W.me.vx = W.me.vz = 0; W.me.face = 0; window.__tick(20); W.me.face = 0; window.__tick(1);
      P.ev(`(() => { const m = W.me, s = ${side ? -1 : 1}; camera.position.set(m.x + 0.9 * s, 1.35, m.z + 3.3 * s); camera.lookAt(m.x, 1.0, m.z); renderer.render(scene, camera); })()`); }, [id, side]);
    const buf = await p.screenshot({ clip: { x: 200, y: 40, width: 240, height: 400 } }); (side ? back : front).push([n, buf.toString('base64')]);
  }
}
const sheet = async (arr, file) => { const q = await ctx.newPage(); await q.setViewportSize({ width: 7 * 180, height: Math.ceil(arr.length / 7) * 290 }); await q.setContent('<body style="margin:0;background:#111;display:flex;flex-wrap:wrap">' + arr.map(([n, s]) => `<div style="width:180px;color:#ddd;font:11px sans-serif;text-align:center"><img style="width:180px;height:270px;object-fit:cover" src="data:image/png;base64,${s}"><br>${n}</div>`).join('') + '</body>'); await q.screenshot({ path: path.join(dir, 'shots', file) }); await q.close(); };
await sheet(front, 'fits-front.png'); await sheet(back, 'fits-back.png');
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close(); process.exit(fails ? 1 : 0);
