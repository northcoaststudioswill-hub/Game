/* Sprouts TV 2: the cutscene music. Nobody can hear a test, so this checks what can be checked without ears:
   every scene has a theme, every bar of every theme is sixteen steps of notes that are in the theme's scale, the
   strong beats mostly land on the chord, each theme renders to sound that is neither silent nor clipping, the music
   starts and stops with a scene, and one song is in the build and it loops.
   With a folder as the second argument it also writes each theme as a .wav there, to be listened to.
   node sprouts-tv2/tests/music.js [build.html] [folder for .wav files] */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const BUILD = path.resolve(process.argv[2] || path.join(__dirname, '../games/sprouts-tv2.html'));
const OUT = process.argv[3] ? path.resolve(process.argv[3]) : null;
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + BUILD + '?dev'); await page.waitForTimeout(500);
  const E = s => page.evaluate(s => __g.ev(s), s);
  for (let i = 0; i < 60 && (await E('state')) !== 'menu'; i++) { await page.keyboard.press('Enter', { delay: 70 }); await page.waitForTimeout(200); }
  let fail = 0; const ok = (name, cond, info) => { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  [' + JSON.stringify(info) + ']' : '')); };

  /* ---- the song ---- */
  const song = JSON.parse(await E(`JSON.stringify([TRACKS.map(t=>t.title),musWant(),(state='play',musWant()),(state='pause',musWant()),(state='menu',musWant())])`));
  ok('one song is in the build, and the menus and the valley share it (it does not start over between them)', song[0].length === 1 && song.slice(1).every(q => q === 'game'), song);
  ok('it is set to go round: the player loops it', await E(`/s\\.loop=true/.test(playTrack.toString())&&/musEl\\.loop=true/.test(playStored.toString())`));

  /* ---- the themes as written ---- */
  const th = JSON.parse(await E(`JSON.stringify(Object.entries(SCM_T).map(([k,T])=>{const bars=T.lead.map((b,i)=>{const L=scmLead(b),len=b.split(' ').reduce((a,t)=>a+ +t.split(':')[1],0),c=T.ch[i%T.ch.length],tri=[0,c[1]?3:4,7].map(x=>(c[0]+x)%12);
    return {len,bad:L.filter(q=>q[1]<0||!T.scale.includes(q[1]%12)).length,strong:L.filter(q=>q[0]%8===0).length,onChord:L.filter(q=>q[0]%8===0&&tri.includes(q[1]%12)).length,lo:Math.min(...L.map(q=>q[1])),hi:Math.max(...L.map(q=>q[1]))}});return {k,bpm:T.bpm,nb:T.lead.length,nc:T.ch.length,bars}}))`));
  ok('six themes', th.length === 6, th.map(t => t.k));
  for (const t of th) {
    const strong = t.bars.reduce((a, b) => a + b.strong, 0), on = t.bars.reduce((a, b) => a + b.onChord, 0);
    ok(`${t.k}: ${t.nb} bars of sixteen steps, every note in its scale, ${on} of ${strong} strong beats on the chord`, t.bars.every(b => b.len === 16 && b.bad === 0) && t.nb % t.nc === 0 && on / strong >= 0.7 && t.bars.every(b => b.lo >= 36 && b.hi <= 90), t.bars.filter(b => b.len !== 16 || b.bad));
  }
  const map = JSON.parse(await E(`JSON.stringify([Object.keys(C3SCN).filter(k=>!SCENE_MUS[k]),Object.values(SCENE_MUS).filter(v=>!SCM_T[v]),Object.keys(SCM_T).map(k=>Object.values(SCENE_MUS).filter(v=>v===k).length)])`));
  ok('every one of the 34 scenes names a theme, and every theme is used', map[0].length === 0 && map[1].length === 0 && map[2].every(n => n > 0), map);

  /* ---- the themes as sound ---- */
  if (OUT) fs.mkdirSync(OUT, { recursive: true });
  for (const t of th) {
    const r = JSON.parse(await E(`(async()=>{const T=SCM_T.${t.k},sr=22050,bars=8,dur=bars*16*60/T.bpm/4+1,ctx=new OfflineAudioContext(1,Math.ceil(sr*dur),sr),g=ctx.createGain();g.gain.value=1.5;g.connect(ctx.destination);let at=.05;for(let b=0;b<bars;b++)at=scmBar(ctx,g,T,b,at);
      const buf=await ctx.startRendering(),d=buf.getChannelData(0);let pk=0,ss=0,nan=0;const per=[],bl=Math.floor((d.length-sr)/bars);for(let b=0;b<bars;b++){let s2=0;for(let i=0;i<bl;i++){const v=d[b*bl+i];s2+=v*v}per.push(Math.sqrt(s2/bl))}
      for(let i=0;i<d.length;i++){const v=d[i];if(v!==v)nan++;if(Math.abs(v)>pk)pk=Math.abs(v);ss+=v*v}
      let b64='';if(${OUT ? 1 : 0}){const i16=new Int16Array(d.length);for(let i=0;i<d.length;i++)i16[i]=Math.max(-1,Math.min(1,d[i]))*32767;const u=new Uint8Array(i16.buffer);let s='';for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));b64=btoa(s)}
      return JSON.stringify({pk,rms:Math.sqrt(ss/d.length),nan,per,secs:d.length/sr,b64})})()`));
    ok(`${t.k}: ${r.secs.toFixed(0)} s of eight bars renders, no bar silent, nothing clipped (peak ${r.pk.toFixed(2)}, level ${r.rms.toFixed(3)})`, r.nan === 0 && r.pk < 0.98 && r.pk > 0.08 && r.rms > 0.015 && r.per.every(v => v > 0.008), r.per.map(v => +v.toFixed(3)));
    if (OUT) { const pcm = Buffer.from(r.b64, 'base64'), h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(22050, 24); h.writeUInt32LE(44100, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40); fs.writeFileSync(path.join(OUT, 'cutscene-' + t.k + '.wav'), Buffer.concat([h, pcm])); }
  }

  /* ---- in the game ---- */
  await E(`HOLD=1;unlock();init();live=true;state='play';meta.mus=6;void 0`);
  const live = JSON.parse(await E(`(()=>{const out=[!!ac];musTick(1/30);out.push(SCM.name);c3Play('van');musTick(1/30);out.push(SCM.name,!!SCM.g,SCM.bar>0);c3q=null;state='play';c3Play('blaze');musTick(1/30);out.push(SCM.name);c3q=null;state='play';musTick(1/30);out.push(SCM.name,!SCM.g);
    meta.mus=0;c3Play('van');musTick(1/30);out.push(SCM.name);c3q=null;state='play';meta.mus=6;return JSON.stringify(out)})()`));
  ok('a scene starts its theme, the next scene changes it, play stops it, and music turned off means no theme', live.join() === 'true,,van,true,true,triumph,,true,', live);

  ok('no page errors', errs.length === 0, errs.slice(0, 3));
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); await browser.close(); process.exit(fail ? 1 : 0);
})();
