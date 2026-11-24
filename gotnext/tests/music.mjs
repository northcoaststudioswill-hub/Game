// The soundtrack, served like the published game: a track plays, through the reverb, and the room changes the mix.
// node tests/music.mjs
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT || '/opt/node-tools/node_modules/playwright/index.js');
import path from 'path'; import fs from 'fs'; import http from 'http'; import { fileURLToPath } from 'url';
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(q.url.split('?')[0])); if (!f.startsWith(root) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } const st = fs.statSync(f), type = f.endsWith('.mp3') ? 'audio/mpeg' : 'text/html';
  const rg = q.headers.range; if (rg && type === 'audio/mpeg') { const [a, b0] = rg.replace('bytes=', '').split('-'), s = +a, e = b0 ? +b0 : st.size - 1; r.writeHead(206, { 'content-type': type, 'content-range': `bytes ${s}-${e}/${st.size}`, 'accept-ranges': 'bytes', 'content-length': e - s + 1 }); fs.createReadStream(f, { start: s, end: e }).pipe(r); } else { r.writeHead(200, { 'content-type': type, 'content-length': st.size, 'accept-ranges': 'bytes' }); fs.createReadStream(f).pipe(r); } }).listen(0);
const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--autoplay-policy=no-user-gesture-required'] }); const p = await (await b.newContext({ viewport: { width: 400, height: 300 } })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://127.0.0.1:' + srv.address().port + '/'); await p.waitForTimeout(1500);
await p.click('#titleBtns .btn'); await p.waitForTimeout(300); await p.click('#panel .pf .btn'); await p.waitForTimeout(3500);
const a = await p.evaluate(() => { const O = __pit.OST; return { src: O.el && O.el.src.split('/').pop(), playing: O.el && !O.el.paused, t: O.el && +O.el.currentTime.toFixed(2), graph: !!O.graph, room: O.room, wet: O.graph && +O.graph.wet.gain.value.toFixed(3), track: O.cur }; });
console.log('on The Block:', JSON.stringify(a));
await p.evaluate(() => __pit.enterWorld('crib', 0, 19, Math.PI)); await p.waitForTimeout(3000);
const c = await p.evaluate(() => { const O = __pit.OST; return { room: O.room, wet: +O.graph.wet.gain.value.toFixed(3), hi: Math.round(O.graph.lp.frequency.value) }; });
console.log('at the crib:', JSON.stringify(c));
const t0 = await p.evaluate(() => __pit.OST.cur); await p.keyboard.press('KeyN'); await p.waitForTimeout(1500); const t1 = await p.evaluate(() => ({ cur: __pit.OST.cur, playing: !__pit.OST.el.paused }));
console.log('N skips:', t0, '→', JSON.stringify(t1));
const ok = a.playing && a.t > 0.5 && a.graph && a.room === 'hub' && c.room === 'crib' && c.wet < a.wet && t1.cur !== t0 && t1.playing;
console.log(ok ? 'PASS soundtrack plays through the reverb, the room changes the mix, N skips' : 'FAIL', errs.length ? errs.join(' | ') : 'no page errors'); await b.close(); srv.close();
