import { chromium } from 'playwright'; import fs from 'fs';
const src = fs.readdirSync(''+new URL('../src', import.meta.url).pathname+'').filter(f => f.endsWith('.js')).map(f => fs.readFileSync(''+new URL('../src', import.meta.url).pathname+'/' + f, 'utf8')).join('\n');
const S = "'((?:[^'\\\\]|\\\\.)*)'", get = k => [...new Set([...src.matchAll(new RegExp("\\b" + k + ": " + S, 'g'))].map(m => m[1].replace(/\\'/g, "'")))];
const bigs = get('big').filter(x => x.length > 1), names = get('name').filter(x => x === x.toUpperCase() && x.length > 2);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined }); const p = await b.newPage(); await p.goto(''+new URL('../index.html', import.meta.url).href+'#noff'); await p.waitForTimeout(700);
console.log(await p.evaluate(([bigs, names]) => { const o = { bigs: bigs.length, names: names.length, bigOver208: [], bigOver320: [], nameOver208: [] }; for (const s of bigs) { const w = ptextW(s, 2); if (w > 208 - 8) o.bigOver208.push(s + ':' + w); if (w > 312) o.bigOver320.push(s + ':' + w); } for (const s of names) { const w = ptextW(s, 2); if (w > 200) o.nameOver208.push(s + ':' + w); } return o; }, [bigs, names]));
await b.close();
