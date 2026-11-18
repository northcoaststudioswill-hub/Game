import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const page = await browser.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(new URL('../index.html', import.meta.url).href + '#noff'); await page.waitForTimeout(500);
const res = await page.evaluate(async () => {
  const out = {}, S = Sound;
  const render = async (secs, fill) => { const c = new OfflineAudioContext(1, 44100 * secs, 44100), master = c.createGain(); master.gain.value = .9; master.connect(c.destination); const mus = c.createGain(), sfx = c.createGain(); mus.gain.value = .55 * .8; sfx.gain.value = .7 * .8; mus.connect(master); sfx.connect(master);
    const nb = c.createBuffer(1, 44100, 44100), d = nb.getChannelData(0); for (let i = 0; i < 44100; i++) d[i] = Math.random() * 2 - 1;
    const real = { ctx: S.ctx, mus: S.mus, sfx: S.sfx, nb: S.nb }; Object.assign(S, { ctx: c, mus, sfx, nb }); Object.defineProperty(c, 'state', { value: 'running' }); try { fill(c); } finally { } const buf = await c.startRendering(); Object.assign(S, real);
    const x = buf.getChannelData(0); let pk = 0, sq = 0; for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > pk) pk = a; sq += a * a; } return [+pk.toFixed(2), +Math.sqrt(sq / x.length).toFixed(3)]; };
  for (const name of ['battle', 'dusk', 'duel', 'work', 'home']) for (const rage of [0, 1]) { if (rage && (name === 'work' || name === 'home')) continue; const tr = TRACKS[name], sp = 60 / tr.bpm / 4, secs = Math.ceil(tr.len * sp) + 1; out[name + (rage ? '+rage' : '')] = await render(secs, () => { S.rage = rage; for (let s = 0; s < tr.len; s++) tr.fn(s, .05 + s * sp, sp, S); S.rage = 0; }); }
  for (const n of ['swing', 'swing2', 'steel', 'slash', 'bigslash', 'clash', 'dash', 'fury', 'cutin', 'pillar', 'horn', 'win', 'bodyfall', 'hit', 'roar']) out[n] = await render(4, c => { const ct = Object.getOwnPropertyDescriptor(c, 'currentTime'); S.play(n); });
  out.count = await render(3, () => { for (let i = 0; i < 11; i++) S.play('count', i); });
  return out; });
console.log(JSON.stringify(res)); console.log('errors', errors); await browser.close();
