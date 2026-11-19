import { chromium } from 'playwright'; import fs from 'fs';
const src = fs.readdirSync(''+new URL('../src', import.meta.url).pathname+'').filter(f => f.endsWith('.js')).map(f => fs.readFileSync(''+new URL('../src', import.meta.url).pathname+'/' + f, 'utf8')).join('\n');
const cards = []; const S = "'((?:[^'\\\\]|\\\\.)*)'";
for (const m of src.matchAll(new RegExp("card: " + S + "(?:, sub: " + S + ")?(, big: 1)?", 'g'))) cards.push([m[1].replace(/\\'/g, "'"), (m[2] || '').replace(/\\'/g, "'"), !!m[3]]);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
for (const [w, h] of [[390, 844], [844, 390], [320, 568], [667, 375]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); await p.goto(''+new URL('../index.html', import.meta.url).href+'#noff'); await p.waitForTimeout(700);
  const bad = await p.evaluate(cards => { const out = []; const cr = document.querySelector('#card').getBoundingClientRect(), fr = { left: Math.max(0, cr.left), top: Math.max(0, cr.top), right: Math.min(innerWidth, cr.right || innerWidth), bottom: Math.min(innerHeight, cr.bottom || innerHeight), width: cr.width, height: cr.height };
    for (const [t, s, big] of cards) { BTS.Cutscene.card(t, s, big); const el = document.querySelector('#card'); el.classList.add('on'); const er = el.getBoundingClientRect(); let o = 0;
      el.querySelectorAll('*').forEach(c => { const r = c.getBoundingClientRect(); if (!r.width) return; if (r.left < fr.left - 1 || r.right > fr.right + 1 || r.top < fr.top - 1 || r.bottom > fr.bottom + 1 || c.scrollWidth > c.clientWidth + 1) o = Math.max(o, Math.round(Math.max(fr.left - r.left, r.right - fr.right, fr.top - r.top, r.bottom - fr.bottom, c.scrollWidth - c.clientWidth))); });
      if (el.scrollHeight > el.clientHeight + 1) o = Math.max(o, el.scrollHeight - el.clientHeight);
      if (o) out.push(o + 'px ' + (big ? 'BIG ' : '') + t.slice(0, 40) + ' | ' + s.slice(0, 30)); } BTS.Cutscene.hideCard(); return [Math.round(fr.width) + 'x' + Math.round(fr.height), out]; }, cards);
  console.log(w + 'x' + h, 'frame', bad[0], 'cards', cards.length, 'overflow', bad[1].length); bad[1].slice(0, 12).forEach(x => console.log('   ', x)); await p.close(); }
await b.close();
