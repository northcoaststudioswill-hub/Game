/* Renders a music video. Run from the repo root after `python3 bottie/video/build.py`:
     node bottie/video/render.js <board> [from] [to] [--shots]
   <board> is the storyboard name (bottie/video/board-<name>.js registers MV.boards[name] with its song file).
   Whole song  -> bottie/video/out/<board>.mp4  (1080 x 1080, 30 fps, the song muxed in)
   --shots     -> a contact sheet of stills instead (one per shot plus every few seconds), for checking. */
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs'), cp = require('child_process');
const args = process.argv.slice(2).filter(a => !a.startsWith('--')), flags = process.argv.filter(a => a.startsWith('--'));
const name = args[0] || 'overclocked', FPS = 30, here = path.resolve('bottie/video'), out = path.join(here, 'out'); fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 480, height: 480 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });
  await page.goto('file://' + path.join(here, 'mv.html'));
  const info = await page.evaluate(n => { const b = MV.boards[n]; if (!b) return null; MV.load(b); return { dur: b.dur, song: b.song, fade: b.fade || null, shots: b.shots.map(s => [s.a, s.b, s.name || '']) }; }, name);
  if (!info) { console.error('no storyboard called ' + name); process.exit(1); }
  const from = +(args[1] || 0), to = +(args[2] || info.dur);
  const grab = async t => Buffer.from((await page.evaluate(t => { mvFrame(t); return cv.toDataURL('image/png'); }, t)).split(',')[1], 'base64');
  if (flags.includes('--shots')) {
    const dir = path.join(out, name + '-stills'); fs.mkdirSync(dir, { recursive: true }); for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
    const step = +(flags.find(f => f.startsWith('--every=')) || '--every=2').split('=')[1]; let n = 0;
    for (let t = from; t < to; t += step) { fs.writeFileSync(path.join(dir, String(Math.round(t * 10)).padStart(5, '0') + '.png'), await grab(t)); n++; }
    console.log(n + ' stills in ' + dir); await browser.close(); return;
  }
  const file = path.join(out, name + (from || to < info.dur ? '-' + Math.round(from) + '-' + Math.round(to) : '') + '.mp4');
  const ff = cp.spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-ss', String(from), '-t', String(to - from), '-i', path.resolve(info.song),
    ...(info.fade && to >= info.dur ? ['-af', 'afade=t=out:st=' + (info.fade[0] - from) + ':d=' + info.fade[1]] : []), '-vf', 'scale=1080:1080:flags=neighbor', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((to - from) * FPS), t0 = Date.now();
  for (let i = 0; i < n; i++) { const buf = await grab(from + i / FPS); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (i % 300 === 0) console.log('frame ' + i + '/' + n + '  ' + Math.round((Date.now() - t0) / 1000) + ' s'); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close(); console.log(file);
})();
