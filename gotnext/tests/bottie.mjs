// lil Bottie in the game: his three tracks on the soundtrack, his live performance on the Block (a pose for every line
// of The Algorithm, on the timing Will tapped in, and the line in his bubble), his photo wall, the two emotes from his
// photos, and his prints for the crib. Stills in tests/shots/bottie-*.png.   node tests/bottie.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] }); const ctx = await b.newContext({ viewport: { width: 640, height: 480 } });
await ctx.addInitScript(() => { window.requestAnimationFrame = cb => { window.__raf = cb; return 1; }; window.__now = 0; window.__tick = n => { for (let i = 0; i < n; i++) { window.__now += 16.67; const f = window.__raf; window.__raf = null; if (f) f(window.__now); } }; });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
await p.goto('file://' + (process.env.GN_HTML || path.resolve(dir, '..', 'index.html'))); await p.evaluate(() => window.__tick(60));
await p.click('#titleBtns .btn'); await p.evaluate(() => window.__tick(5)); await p.click('#panel .pf .btn'); await p.evaluate(() => window.__tick(10));
let r = await p.evaluate(() => { const T = __pit.ev('TRACKS'); return T.filter(t => t[2] === 'lil Bottie').map(t => t[0]); });
ok(r.length === 3 && r.every(id => fs_ok(id)), `his tracks on the soundtrack: ${r.join(', ')}`); function fs_ok() { return true; }
ok(r.every(id => fs.existsSync(path.resolve(dir, '..', 'music', id + '.mp3'))), 'and the files are in music/');
await p.evaluate(() => { const P = __pit; P.uiClose(); P.enterWorld('hub', 11.4, 2.9, Math.PI / 2); window.__tick(40); document.querySelectorAll('#emobar,#whud,#keys,#toasts,#prompt,#goal,#padhint,#panel').forEach(e => e.style.visibility = 'hidden'); });
// play The Algorithm at a few lines (a stand-in for the audio element: the game only reads its clock)
const CH = await p.evaluate(() => __pit.ev('BOTTIE_CHOREO')['bt-algorithm']);
const at = [5, 8, 12, 20, 27, 36];
const shots = [];
for (const i of at) {
  const t = CH[i][0] + 0.6;
  r = await p.evaluate((t) => { const P = __pit, O = P.ev('OST'), W = P.W; O.el = O.el || {}; O.__fake = { paused: false, currentTime: t, play: () => Promise.resolve(), pause() {}, addEventListener() {} }; O.el = O.__fake; O.ok = true; O.id = 'bt-algorithm';
    const bt = W.cast.list.find(n => n.cast === 'bottie'); W.me.x = 11.9; W.me.z = 2.9; window.__tick(30); const bub = [...document.querySelectorAll('.bubble, .bub')].map(e => e.textContent).join(' | ');
    P.ev(`(() => { const m = W.cast.list.find(n => n.cast === 'bottie'); camera.position.set(m.x - 2.9, 1.7, m.z + 0.6); camera.lookAt(m.x, 1.05, m.z); renderer.render(scene, camera); })()`);
    return { amb: bt.amb, perf: bt.perf, line: bt.btLine, face: +bt.face.toFixed(2) }; }, t);
  const want = await p.evaluate(([i]) => { const m = __pit.ev('BT_MAP'), c = __pit.ev('BOTTIE_CHOREO')['bt-algorithm'][i]; return [m[c[1]] || 'robot', c[1], c[2]]; }, [i]);
  ok(r.perf && r.amb === want[0] && r.line === i, `line ${i + 1} at ${t.toFixed(1)} s: "${(want[2] || '(words kept out of the game)').slice(0, 46)}" → pose ${want[1]} (${r.amb})`);
  shots.push([`${want[1]}: ${want[2].slice(0, 30)}`, (await p.screenshot({ clip: { x: 170, y: 60, width: 300, height: 400 } })).toString('base64')]);
}
r = await p.evaluate(() => { const P = __pit, O = P.ev('OST'); O.el.paused = true; window.__tick(5); const bt = P.W.cast.list.find(n => n.cast === 'bottie'); return { perf: bt.perf, amb: bt.amb }; });
ok(!r.perf && r.amb === 'film', 'song off: back to filming');
r = await p.evaluate(() => { const C = __pit.ev('BOTTIE_CHOREO'), bad = /Nick Land|Roko|basilisk/i; return Object.values(C).flat().filter(l => bad.test(l[2])).length; });
ok(r === 0, 'no lyric in the game names a real person');
// the photo wall
await p.evaluate(() => { const P = __pit; P.ev(`(() => { camera.position.set(9.6, 2.0, 3.6); camera.lookAt(15, 1.4, 2.9); renderer.render(scene, camera); })()`); });
await p.screenshot({ path: path.join(dir, 'shots', 'bottie-wall.png') });
// the emotes from his photos
for (const em of ['thumbs', 'roof']) {
  await p.evaluate((em) => { const P = __pit, W = P.W; W.me.x = 6; W.me.z = -4; W.me.vx = W.me.vz = 0; W.me.emote = null; P.call('emote', em); window.__tick(20); P.ev(`(() => { const m = W.me; camera.position.set(m.x + 0.4, 1.5, m.z - 2.8); camera.lookAt(m.x, 1.1, m.z); renderer.render(scene, camera); })()`); }, em);
  shots.push(['emote: ' + em, (await p.screenshot({ clip: { x: 170, y: 60, width: 300, height: 400 } })).toString('base64')]);
}
r = await p.evaluate(() => { const H = __pit.ev('HOME_ITEMS'); return { prints: H.filter(h => h.id.startsWith('bt_ph_')).length, track: !!H.find(h => h.id === 'bt_tracklist'), tri: !!H.find(h => h.id === 'bt_triptych') }; });
ok(r.prints === 13 && r.track && r.tri, `the crib: ${r.prints} framed prints, the tracklist, the burning-roof triptych`);
const q = await ctx.newPage(); await q.setViewportSize({ width: 4 * 230, height: 2 * 330 }); await q.setContent('<body style="margin:0;background:#111;display:flex;flex-wrap:wrap">' + shots.map(([n, s]) => `<div style="width:230px;color:#ddd;font:11px sans-serif;text-align:center"><img style="width:230px;height:306px;object-fit:cover" src="data:image/png;base64,${s}"><br>${n}</div>`).join('') + '</body>'); await q.screenshot({ path: path.join(dir, 'shots', 'bottie-perform.png') });
console.log(errs.length ? errs.join(' | ') : 'no page errors', fails ? `· ${fails} FAILED` : '· ALL PASS'); await b.close(); process.exit(fails ? 1 : 0);
