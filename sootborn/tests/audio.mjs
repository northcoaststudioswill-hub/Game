import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await page.waitForTimeout(500);
const res = await page.evaluate(async () => {
  const out = {}, S = Sound;
  const render = async (secs, fill) => { const c = new OfflineAudioContext(1, 44100 * secs, 44100), g = S.graph(c); g.mus.gain.value = .6 * 1.5; g.sfx.gain.value = .8 * 1.0;
    const real = { ctx: S.ctx, mus: S.mus, sfx: S.sfx, nb: S.nb }; Object.assign(S, { ctx: c, mus: g.mus, sfx: g.sfx, nb: g.nb }); Object.defineProperty(c, 'state', { value: 'running' }); fill(c); const buf = await c.startRendering(); Object.assign(S, real);
    const x = buf.getChannelData(0); let pk = 0, sq = 0; for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > pk) pk = a; sq += a * a; } return [+pk.toFixed(2), +Math.sqrt(sq / x.length).toFixed(3)]; };
  for (const name of ['battle', 'dusk', 'duel', 'work', 'home']) for (const rage of [0, 1]) { if (rage && (name === 'work' || name === 'home')) continue; const tr = TRACKS[name], sp = 60 / tr.bpm / 4, secs = Math.ceil(tr.len * sp) + 1; out[name + (rage ? '+rage' : '')] = await render(secs, () => { S.rage = rage; for (let s = 0; s < tr.len; s++) tr.fn(s, .05 + s * sp, sp, S); S.rage = 0; }); }
  for (const n of ['swing', 'swing2', 'steel', 'slash', 'bigslash', 'clash', 'dash', 'fury', 'cutin', 'pillar', 'horn', 'win', 'bodyfall', 'hit', 'roar']) out[n] = await render(4, c => { const ct = Object.getOwnPropertyDescriptor(c, 'currentTime'); S.play(n); });
  out.count = await render(1, () => { S.play('count', 5); });
  out['battle+fight'] = await render(8, c => { S.rage = 1; const tr = TRACKS.battle, sp = 60 / tr.bpm / 4; for (let s = 0; s < 64; s++) { tr.fn(s, .05 + s * sp, sp, S); if (s % 6 === 0) { const t0 = c.currentTime; } } S.rage = 0; });
  return out; });
console.log(JSON.stringify(res)); console.log('errors', errors); await browser.close();
