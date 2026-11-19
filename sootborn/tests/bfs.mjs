import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage(); await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await page.waitForTimeout(800);
const r = await page.evaluate(() => { const out = {}; const solid = new Set(['#', 'x', 'N', '~']);
  const T = { vcamp: [[2, 7], [[11, 8], [16, 9], [20, 6], [3, 12], [2, 12], [12, 10], [12, 8], [11, 9], [13, 9]]], raid: [[2, 7], [[14, 5], [13, 5], [26, 7], [14, 6], [16, 5]]], dais: [[2, 8], [[10, 5], [14, 5], [18, 5]]] };
  for (const k in T) { const m = MAPS[k], [s, goals] = T[k], seen = new Set([s + '']), q = [s]; while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (ny < 0 || ny >= m.h || nx < 0 || nx >= m.w || solid.has(m.grid[ny][nx]) || seen.has([nx, ny] + '')) continue; seen.add([nx, ny] + ''); q.push([nx, ny]); } }
    out[k] = { start: m.grid[s[1]][s[0]], goals: goals.map(g => g + ':' + (seen.has(g + '') ? 'ok' : 'NO(' + m.grid[g[1]][g[0]] + ')')), rows: m.grid.map(r => r.join('')) }; } return out; });
for (const k in r) { console.log(k, r[k].start, r[k].goals.join(' ')); console.log(r[k].rows.join('\n')); }
await browser.close();
