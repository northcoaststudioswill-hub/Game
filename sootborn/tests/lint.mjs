import fs from 'fs';
const acc = new Set(['petra','oswin','celestine','maren','lucan','rook','vant','cade','ilse','wren','voss']);
let n=0;
for (const f of ['part2.js','assay.js']) { const s = fs.readFileSync('/home/claude/below-the-sun/src/'+f,'utf8');
  for (const m of s.matchAll(/say(?:\(|: )'(\w+)'(?:, t: |, )'((?:[^'\\]|\\.)*)'/g)) { if (!acc.has(m[1])) continue; const c = m[2].match(/\b\w+(?:\\'|')(?:t|s|re|ve|ll|d|m)\b/gi); if (c) { const real = c.filter(x => !/'s$/.test(x.replace("\\","")) ); if (real.length) { n++; console.log(f, m[1], real.join(','), '|', m[2].slice(0,70)); } } } }
console.log('contractions by Accredited speakers:', n);
