// GOT NEXT — the soundtrack: real tracks streamed from music/ (next to the game), shuffled, played "in the world":
// a soft reverb whose size changes with the place (wide street, chain-link cage, your yard, a game court), a gentle
// top-end roll-off that smooths compressed audio, and the synth loop only as a fallback if no track can load.
'use strict';
const TRACKS = [['afraid', 'Afraid'], ['down', 'Down'], ['hard-to-pretend', 'Hard to Pretend'], ['city-deep', 'City Deep'], ['i-am-somebody', 'I Am Somebody'], ['parody-3', 'Parody 3'], ['no-love', 'No Love'], ['insanity', 'Insanity'], ['going-out-sad', 'Going Out Sad'], ['believe', 'Believe'], ['bbb', 'BBB']];
// per place: reverb mix (wet), dry level, how bright the top end stays, overall level
const ROOMS = { menu: { wet: 0.06, dry: 1, hi: 14000, lvl: 0.66 }, hub: { wet: 0.2, dry: 0.92, hi: 10500, lvl: 0.64 }, pit: { wet: 0.16, dry: 0.94, hi: 11500, lvl: 0.64 }, crib: { wet: 0.12, dry: 0.96, hi: 12500, lvl: 0.6 }, room: { wet: 0.2, dry: 0.93, hi: 8500, lvl: 0.62 }, game: { wet: 0.13, dry: 0.92, hi: 11000, lvl: 0.44 } };   /* released tracks are mastered loud: they sit under the game's sounds */
const OST = { el: null, ok: false, order: [], i: -1, fails: 0, room: 'menu', graph: null };
function ostInit() {
  if (OST.el || !AC) return;
  const el = OST.el = new Audio(); el.preload = 'auto'; el.volume = 1;
  el.addEventListener('ended', () => ostNext()); el.addEventListener('error', () => { if (++OST.fails < TRACKS.length) ostNext(); else OST.ok = false; });
  el.addEventListener('playing', () => { OST.ok = true; OST.fails = 0; });
  // the reverb only works through WebAudio, which a page opened straight from disk (file://) is not allowed to route; it still plays dry
  if (location.protocol !== 'file:') try {
    const src = AC.createMediaElementSource(el), hi = AC.createBiquadFilter(), dry = AC.createGain(), wet = AC.createGain(), conv = AC.createConvolver(), damp = AC.createBiquadFilter(), bus = AC.createGain();
    hi.type = 'highshelf'; hi.frequency.value = 9000; hi.gain.value = -3;            /* the harsh top of a compressed file, softened */
    conv.buffer = ostImpulse(2.6, 2.2); damp.type = 'lowpass'; damp.frequency.value = 5200; /* the tail is darker than the sound: distance */
    src.connect(hi); hi.connect(dry); hi.connect(conv); conv.connect(damp); damp.connect(wet); dry.connect(bus); wet.connect(bus); bus.connect(musBus);
    OST.graph = { hi, dry, wet, bus, lp: (() => { const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 14000; bus.disconnect(); bus.connect(f); f.connect(musBus); return f; })() };
  } catch (e) { OST.graph = null; }
  OST.order = TRACKS.map((t, i) => i).sort(() => Math.random() - 0.5); ostRoom(OST.room); ostNext();
}
// a soft room: two channels of decaying noise, slightly different, with a short pre-delay
function ostImpulse(secs, decay) {
  const n = Math.floor(AC.sampleRate * secs), b = AC.createBuffer(2, n, AC.sampleRate), pre = Math.floor(AC.sampleRate * 0.025);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = pre; i < n; i++) { const t = (i - pre) / (n - pre); d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * (i - pre < 400 ? (i - pre) / 400 : 1); } }
  return b;
}
function ostNext() {
  if (!OST.el) return; OST.i = (OST.i + 1) % TRACKS.length; const t = TRACKS[OST.order[OST.i]];
  OST.el.src = 'music/' + t[0] + '.mp3'; OST.cur = t[1];
  if (S && S.set.music) OST.el.play().then(() => { if (typeof toast === 'function' && document.body.dataset.state !== 'match' && !(typeof UI !== 'undefined' && UI.cur)) toast('♪ ' + t[1], 'GOT NEXT soundtrack · N skips'); }).catch(() => { });
}
// glide the room settings when you change places
function ostRoom(k) {
  OST.room = ROOMS[k] ? k : 'menu'; const r = ROOMS[OST.room], G = OST.graph; if (!G || !AC) { if (OST.el) OST.el.volume = clamp(r.lvl * volOf('musVol'), 0, 1); return; }
  const t = AC.currentTime; G.wet.gain.setTargetAtTime(r.wet, t, 0.6); G.dry.gain.setTargetAtTime(r.dry, t, 0.6); G.lp.frequency.setTargetAtTime(r.hi, t, 0.6); G.bus.gain.setTargetAtTime(r.lvl * 0.9, t, 0.6);
}
function ostSync() {
  if (!OST.el) return; const on = S && S.set.music;
  if (on && OST.el.paused && OST.el.src) OST.el.play().catch(() => { }); else if (!on && !OST.el.paused) OST.el.pause();
}
// the synth loop steps aside while a real track is playing
function ostPlaying() { return !!(OST.el && OST.ok && !OST.el.paused); }
addEventListener('keydown', e => { if (e.code === 'KeyN' && OST.el && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && document.body.dataset.state !== 'match') ostNext(); });
