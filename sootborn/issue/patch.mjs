// Builds issue.html: the user's own "Second Chance" engine (cel shading, halftone, ink outlines, comic HUD),
// re-cast and re-dressed as a SOOTBORN level. base.html is that game, untouched; everything SOOTBORN is applied here.
import { readFileSync, writeFileSync } from 'fs';
const dir = new URL('.', import.meta.url).pathname;
let s = readFileSync(dir + 'base.html', 'utf8');
const sect = f => { const o = {}; readFileSync(dir + f, 'utf8').split(/^\/\/@@/m).slice(1).forEach(p => { const i = p.indexOf('\n'); o[p.slice(0, i).trim()] = p.slice(i + 1); }); return o; };
const RIG = sect('rig.js'), ST = sect('story.js'), WD = sect('world.js');
let n = 0;
function rep(a, b, all) { const c = s.split(a).length - 1; if (c < 1 || (!all && c !== 1)) throw new Error('patch: expected ' + (all ? '>=1' : '1') + ' got ' + c + ' for: ' + a.slice(0, 70)); s = s.split(a).join(b); n++; }
function between(a, z, b) { const i = s.indexOf(a), j = s.indexOf(z, i + a.length); if (i < 0 || j < 0 || s.indexOf(a, i + 1) >= 0) throw new Error('between: ' + a.slice(0, 60) + ' .. ' + z.slice(0, 40)); s = s.slice(0, i) + b + s.slice(j); n++; }

/* ---- page ---- */
rep('<title>Second Chance</title>', '<title>SOOTBORN: The High Docks</title>');
rep("const SC = window.SC = { V: '0.1.0' };", "const SC = window.SC = { V: '0.1.0', issue: 'docks' };\nSC.hosted = (function () { try { return window.parent && window.parent !== window; } catch (e) { return true; } })();\nSC.host = function (t, d) { try { if (SC.hosted) window.parent.postMessage({ sootborn: 'issue-' + t, data: d || null }, '*'); } catch (e) { /* standalone */ } return SC.hosted; };");

/* ---- the three ways he fights (were: paths) ---- */
between("  ember: {\n    id: 'ember'", "SC.T = {", `  ember: {
    id: 'ember', name: 'FURY', title: 'WHAT THE FURNACE TAUGHT', power: 'ELEVEN', btn: 'ELEVEN',
    color: 0xff5a1f, hot: 0xffd23a, css: '#ff5a1f', cssHot: '#ffd23a',
    blurb: 'Nothing clean about it. Leap, and come down on them like a lift with the cable cut.',
    passive: 'The third hit of a chain lands like a furnace door.',
    word: 'NINE FLOORS!'
  },
  shade: {
    id: 'shade', name: 'THE TURN', title: "ILSE'S LESSON", power: 'THE TURN', btn: 'THE<br>TURN',
    color: 0x9a4dff, hot: 0xe2c6ff, css: '#9a4dff', cssHot: '#e2c6ff',
    blurb: 'Never give ground. Do not stop the pressure; turn it, and come up behind them.',
    passive: 'Your dodge carries further and forgives more.',
    word: 'TURNED!'
  },
  tether: {
    id: 'tether', name: 'THE LINE', title: 'OFF THE VALVE BANKS', power: 'HOOK LINE', btn: 'HOOK<br>LINE',
    color: 0x19d3c5, hot: 0xc8fff6, css: '#19d3c5', cssHot: '#c8fff6',
    blurb: 'The rigging line he used below. Throw it, drag them in, hold them still.',
    passive: 'Every guard you put down gives a little breath back.',
    word: 'HAUL!'
  }
};

`);

/* ---- sky: the weather, the moored fleet, the Sun Spire ---- */
rep("const a = i / 46 * Math.PI * 2 + rnd() * 0.08, r = 150 + rnd() * 60, w = 14 + rnd() * 22, h = 22 + rnd() * 60;", "const a = i / 46 * Math.PI * 2 + rnd() * 0.08, r = 130 + rnd() * 90, w = 30 + rnd() * 26, h = 5 + rnd() * 5;");
rep("const geo = new THREE.BoxGeometry(w, h, w), uv = geo.attributes.uv;", "const geo = new THREE.BoxGeometry(w, h, w * 0.34), uv = geo.attributes.uv;");
rep("b.position.set(Math.cos(a) * r, h / 2 - 2, Math.sin(a) * r); b.rotation.y = rnd() * 3; sky.add(b);\n    }", "b.position.set(Math.cos(a) * r, -14 + rnd() * 90, Math.sin(a) * r); b.rotation.y = rnd() * 3; sky.add(b);\n      const bag = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.16, w * 0.16, w * 0.96, 8), new THREE.MeshBasicMaterial({ color: i % 3 ? 0x8f8aa8 : 0xb7b0c4, fog: false })); bag.rotation.z = Math.PI / 2; bag.rotation.y = b.rotation.y; bag.position.copy(b.position); bag.position.y += h / 2 + w * 0.2; sky.add(bag);\n    }");

rep("const rnd = SC.seeded(99), mat = new THREE.MeshBasicMaterial({ map: TEX.skyline, fog: false });", "const rnd = SC.seeded(99), mat = new THREE.MeshBasicMaterial({ color: 0x1a1c44, fog: false });");
/* ---- rig: our people ---- */
between("  const SPECS = SC.SPECS = {", "  function tbox(", RIG.SPECS + "\n");
between("  function drawFace(g, kind, expr, glow) {", "  SC.drawFace = drawFace;", RIG.FACES);
between("    if (sp.hair === 'hero') {", "    const mkGeo = (S, full) => {", RIG.HEADGEAR + "\n");
between("    const steel = G.toon({ color: 0xd9dde6 }), dark = G.toon({ color: 0x23232e });", "    model.setGlow = function", RIG.WEAPONS + "\n");
rep("const sm = model.scarfMat = G.toon({ color: 0xff5a1f });", "const sm = model.scarfMat = G.toon({ color: 0x5a3aa8 });");
// Brand stands; he does not hover like the bookkeeper did
between("  P.clerk = t => (", "\n", "  P.clerk = t => ({ spine: [0.03, 0, 0], chest: [0.02, 0, 0], head: [0.04 + Math.sin(t * 0.8) * 0.03, Math.sin(t * 0.5) * 0.12, 0], shL: [0.04, 0, 0.1], elL: [-0.25, 0, 0], shR: [0.02, 0, -0.14], elR: [-0.12, 0, 0], thL: [0, 0, 0.05], thR: [0, 0, -0.05], y: Math.sin(t * 1.2) * 0.008 });");

/* ---- world: same streets, dressed as the High Docks ---- */
between("  function car(x, z, alongX, color) {", "  function lamp(x, z, dx, dz) {", WD.SLED);
between("  /* ---------- the level ---------- */", "  /* ---------- interactables, pickups, crates ---------- */", WD.BUILD);
/* ---- words on the page ---- */
rep("FX.word(e.kind === 'boss' ? 'PAID IN FULL!' : 'KA-THOOM!'", "FX.word(e.kind === 'boss' ? 'STRUCK THROUGH!' : 'KA-THOOM!'");
rep("FX.word('NOT YET!'", "FX.word('ON MY BREATH!'");
rep("FX.word('RISE!'", "FX.word('TO ME!'");
rep('<span class="ch" id="tagCh">2ND CHANCE</span>', '<span class="ch" id="tagCh">ON MY BREATH</span>');
rep("hero: { name: 'DEZ', kind: 'hero', bg: 0x2a2a70, cls: '' }", "hero: { name: 'KAEL', kind: 'hero', bg: 0x3a2a70, cls: '' }");
rep("clerk: { name: 'MR. TALLY', kind: 'clerk', bg: 0x3a3f5c, cls: 'pale' }", "clerk: { name: 'BRAND', kind: 'clerk', bg: 0x5a5560, cls: 'pale' }");
rep("voss: { name: 'DEACON VOSS', kind: 'boss', bg: 0x8a1f24, cls: 'dark' }", "voss: { name: 'CAPTAIN ROOK', kind: 'boss', bg: 0x8a1f24, cls: 'dark' }");
rep(`'<div style="text-align:center"><div class="tag">ISSUE #1 &middot; DEAD ON ARRIVAL</div><div class="logo"><span>SECOND</span>CHANCE</div>'`, `'<div style="text-align:center"><div class="tag">SOOTBORN &middot; SEVEN YEARS AFTER THE FURNACE</div><div class="logo"><span>THE HIGH</span>DOCKS</div>'`);
rep(`(head || 'HOW WILL YOU COLLECT?')`, `(head || 'ELEVEN SECONDS. HOW DO YOU FIGHT?')`);
rep(`<div class="mbtn s" data-go="c">BACK TO LAST CROSSING</div></div></div>', {`, `<div class="mbtn s" data-go="c">BACK TO THE LAST SUN</div>' + (SC.hosted ? '<div class="mbtn s" data-go="x">SKIP THIS LEVEL</div>' : '') + '</div></div>', {\n      x: () => { closeMenu(); U.paused = false; SC.story.wipe(); SC.host('done', { skipped: 1 }); U.freeze = true; },`);
rep(`'<div class="card"><h2>DEAD. AGAIN.</h2><p>No third chances. Mr. Tally closes the book.</p><div class="mbtn y" data-go="r">BACK TO THE LAST CROSSING</div></div>'`, `'<div class="card"><h2>DOWN.</h2><p>The second bell has not finished ringing. Eleven seconds. Get up.</p><div class="mbtn y" data-go="r">BACK TO THE LAST SUN</div></div>'`);
rep(`<div class="tag">END OF ISSUE #1</div><h2 style="margin-top:8px">TO BE CONTINUED</h2><p>Deacon Voss paid in full. Mother Mercy still owes.</p>`, `<div class="tag">THE HIGH DOCKS</div><h2 style="margin-top:8px">FOUR HUNDRED HULLS</h2><p>The last pair is on the wind. The stair is full of light.</p>`);
rep(`<tr><td>PATH</td><td>' + st.path + '</td></tr>`, ``); rep(`<td>HOLLOWS PUT DOWN</td>`, `<td>GUARD PUT DOWN</td>`); rep(`<td>CLUES</td>`, `<td>THINGS COUNTED</td>`); rep(`<td>SECOND CHANCES USED</td>`, `<td>LAST BREATHS USED</td>`);
rep(`<div class="mbtn y" data-go="a">PLAY AGAIN</div>`, `<div class="mbtn y" data-go="a">' + (SC.hosted ? 'CONTINUE' : 'PLAY AGAIN') + '</div>`);

/* ---- story ---- */
rep("$('tagEc').textContent = 'CLUES ' + p.echoes + '/5';", "$('tagEc').textContent = 'COUNTED ' + p.echoes + '/5';");
rep("const SAVE = 'second-chance-save-v1'", "const SAVE = 'sootborn-issue-docks-v1'");
between("  function objective() {", "  S.objective = objective;", ST.OBJECTIVE);
between("  function encDone(id) {", "\n  /* ---------- clues ---------- */", ST.ENCDONE);
rep("U.toast('THREE CLUES. THE MARK BITES DEEPER: *'", "U.toast('THREE THINGS COUNTED. HE FIGHTS HARDER FOR IT: *'");
rep("U.toast('THE MARK IS YOURS. *' + p.power + '* SITS ON THE POWER BUTTON.', 4)", "U.toast(SC.hosted ? 'WHEN THE FURY BAR IS FULL, PRESS *ELEVEN*.' : 'WHEN THE FURY BAR IS FULL, *ELEVEN* IS ON THE POWER BUTTON.', 4)");
between("  function crossing(id) {", "  function bargain() {", ST.CROSSING);
rep("      U.say(lines, () => {\n        pl.setState('idle'); pl.control = true;", "      sayThenMemory(id, lines, () => {\n        pl.setState('idle'); pl.control = true;");
between("  /* ---------- cutscenes ---------- */", "  /* ---------- set up interactables and markers ---------- */", ST.CUTSCENES + "\n");
between("  S.init = function () {", "  /* ---------- flow ---------- */", ST.INIT);
rep("U.showHud(false); SC.clearEnemies(); clerk.group.visible = false;\n    pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 6; pl.place(0.6, 0, 12.5, -0.55);", "U.showHud(false); SC.clearEnemies(); clerk.group.visible = false; S.drift = 0; cable.visible = true;\n    pl.control = false; pl.setState('scripted'); pl.script = t => P.idle(t); pl.scriptRate = 6; pl.place(0.6, 0, 12.5, -0.55);");
rep("S.wipe(); W.reset(); SC.clearEnemies(); timers.length = 0; S.done = false; S.bossDown = false;", "S.wipe(); W.reset(); SC.clearEnemies(); timers.length = 0; S.done = false; S.bossDown = false; S.drift = 0; cable.visible = true;");
rep("    if (!F.intro) { intro(); return; }", "    S.drift = F.cut ? 0.0001 : 0; cable.visible = !F.cut; S.bossDown = !!F.boss;\n    if (!F.intro) { intro(); return; }\n    brandOnStair();");

/* ---- running inside another page's frame: a pad may be forbidden there, and asking must not stop the game ---- */
rep("const pads = navigator.getGamepads ? navigator.getGamepads() : [];", "let pads = []; if (!I.noPad) { try { pads = navigator.getGamepads ? navigator.getGamepads() : []; } catch (e) { I.noPad = true; } }");
/* ---- boot: tell the host we are up ---- */
rep("    SC.story.title();\n    requestAnimationFrame(frame);", `    if (SC.hosted) { document.body.classList.add('hosted'); SC.input.noPad = true; SC.audio.unlock(); if (SC.story.hasSave()) SC.story.load(); else SC.story.newGame(); } else SC.story.title();
    requestAnimationFrame(frame);
    /* inside SOOTBORN: its d-pad and buttons drive this, and it sends the memories to show */
    window.addEventListener('message', e => {
      const d = e.data; if (!d || typeof d.sootborn !== 'string' || e.source !== window.parent) return;
      if (d.sootborn === 'assets') SC.assets = d.panels || {};
      if (d.sootborn === 'in') { SC.input.ext = { x: +d.x || 0, y: +d.y || 0 }; (d.press || []).forEach(n => { SC.audio.unlock(); if (!SC.ui.key(n)) SC.input.press(n); }); }
      if (d.sootborn === 'stop') SC.audio.kill();
    });
    SC.host('ready');`);

/* ---- one frame, one set of controls: no title, no stick, no "turn your phone" ---- */
rep('<div id="stage">', `<style>
body.hosted #touch,body.hosted #rotate,body.hosted #pause{display:none!important}
.pn.px{image-rendering:pixelated}
#mem{position:absolute;inset:0;z-index:60;background:radial-gradient(circle at 50% 55%,#a3262c 0%,#3a0a10 55%,#07070d 100%);overflow:hidden}
#mem.hide{display:none}
#mem:before{content:"";position:absolute;inset:-60%;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,120,40,.26) 0 1.6deg,transparent 1.6deg 8deg);animation:memspin 7s linear infinite}
@keyframes memspin{to{transform:rotate(360deg)}}
#mem .mi{position:absolute;left:4%;top:8%;width:57%;height:60%;background:#07070d center/cover no-repeat;image-rendering:pixelated;border:5px solid var(--ink);box-shadow:8px 8px 0 var(--ink);transform:rotate(-2.5deg) skewX(-4deg)}
#mem .me{position:absolute;right:3%;top:16%;width:38%;height:30%;background:#3a2a70 50% 34%/250% auto no-repeat;border:5px solid var(--ink);box-shadow:8px 8px 0 var(--ink);transform:rotate(3deg) skewX(-6deg)}
#mem .mn{position:absolute;right:4%;top:50%;font:italic 900 clamp(24px,13vh,72px)/.9 var(--sfx);color:var(--yel);-webkit-text-stroke:8px var(--ink);paint-order:stroke fill;transform:rotate(-5deg);text-align:right;max-width:70%}
#mem .ml{position:absolute;left:4%;right:4%;bottom:5%;background:var(--yel);border:3px solid var(--ink);box-shadow:4px 4px 0 var(--ink);padding:6px 12px;font:700 clamp(11px,3.6vh,17px)/1.25 var(--hand);text-transform:uppercase;color:var(--ink)}
</style>
<div id="stage">`);
rep('<div id="rotate">', '<div id="mem" class="hide"></div>\n  <div id="rotate">');
rep("d.className = 'pn';", "d.className = 'pn' + (p.cls ? ' ' + p.cls : '');");
rep("U.blocking = () => !!(U.dlg || U.pg || U.menuOpen);", `U.blocking = () => !!(U.dlg || U.pg || U.menuOpen || U.mem);
  /* a memory cuts in: the picture, his eyes, its name, one line. Time stops while it is up. */
  U.memory = function (m, done) {
    if (!m) { if (done) done(); return; }
    const el = $('mem'); el.innerHTML = '<div class="mi"' + (m.img ? ' style="background-image:url(' + m.img + ')"' : '') + '></div><div class="me" style="background-image:url(' + U.pic('hero', 'angry') + ')"></div><div class="mn">' + m.name + '</div><div class="ml">' + fmt(m.line) + '</div>';
    el.classList.remove('hide'); U.freeze = true; U.mem = { done, t: performance.now() }; SC.audio.sfx('path'); SC.emit('flash', '#ff5a1f');
    clearTimeout(U.memT); U.memT = setTimeout(U.memEnd, 1700 + m.line.length * 42);
  };
  U.memEnd = function () { if (!U.mem) return; clearTimeout(U.memT); const d = U.mem.done; U.mem = null; $('mem').classList.add('hide'); U.freeze = false; SC.input.reset(); if (d) d(); };`);
rep("  U.tap = function () {", "  U.tap = function () {\n    if (U.mem) { if (performance.now() - U.mem.t > 450) U.memEnd(); return; }");
rep("if (a === 'interact' || a === 'attack' || a === 'dodge' || a === 'any') U.tap();", "if (U.menuOpen && (a === 'ctx' || a === 'interact')) { const b = document.querySelector('#menu .mbtn.y'), fn = b && U.menuFns && U.menuFns[b.dataset.go]; if (fn) { SC.audio.sfx('ui'); fn(b); } return true; }\n    if (a === 'interact' || a === 'attack' || a === 'dodge' || a === 'any' || a === 'ctx') U.tap();");
rep("I.press = n => { press[n] = now(); I.last = n; };", "I.press = n => { if (n === 'ctx') n = SC.ui.promptOn ? 'interact' : 'attack'; press[n] = now(); I.last = n; };");
rep("  I.init = function () {", "  if (SC.hosted) Object.assign(KEY, { KeyE: 'ctx', Enter: 'ctx', KeyZ: 'ctx', Space: 'ctx', KeyJ: 'ctx', KeyX: 'dodge', Backspace: 'dodge', KeyK: 'dodge', KeyQ: 'power', KeyG: 'power', KeyL: 'power', KeyV: 'lock', KeyR: 'lock', KeyC: 'attack', KeyF: 'interact', KeyH: 'interact', KeyM: 'pause', Tab: 'pause', KeyP: 'pause', Escape: 'pause' });\n  I.init = function () {");
rep("    let mx = stick.x, my = stick.y;", "    let mx = stick.x, my = stick.y;\n    if (I.ext) { mx += I.ext.x; my += I.ext.y; }\n    if (SC.hosted) { if (keys.ArrowLeft) mx -= 1; if (keys.ArrowRight) mx += 1; if (keys.ArrowUp) my += 1; if (keys.ArrowDown) my -= 1; }");
rep("    if (keys.ArrowLeft) lx -= 2.4 * rdt; if (keys.ArrowRight) lx += 2.4 * rdt; if (keys.ArrowUp) ly -= 1.4 * rdt; if (keys.ArrowDown) ly += 1.4 * rdt;", "    if (!SC.hosted) { if (keys.ArrowLeft) lx -= 2.4 * rdt; if (keys.ArrowRight) lx += 2.4 * rdt; if (keys.ArrowUp) ly -= 1.4 * rdt; if (keys.ArrowDown) ly += 1.4 * rdt; }");
rep("if (e.clientX < window.innerWidth * 0.42 && stick.id === null) {", "if (!SC.hosted && e.clientX < window.innerWidth * 0.42 && stick.id === null) {");
rep("lastPrompt = label; ", "lastPrompt = label; U.promptOn = !!label; ");
rep("(SC.input.touch ? '' : '<kbd>E</kbd>') + label", "(SC.hosted ? '<kbd>A</kbd>' : SC.input.touch ? '' : '<kbd>E</kbd>') + label");
rep("hp: 100, meter: 100, powerCost: 34,", "hp: 100, meter: 100, powerCost: 100,");
rep("R = pl.rank > 1 ? 5.4 : 4.3, dmg = pl.rank > 1 ? 36 : 28;", "R = pl.rank > 1 ? 6.4 : 5.6, dmg = pl.rank > 1 ? 84 : 66;");
rep('<b style="left:34%"></b><b style="left:68%"></b>', '');
rep("'<div class=\"card split\"><h2>PAUSED</h2>' + CONTROLS +", "'<div class=\"card' + (SC.hosted ? '' : ' split') + '\"><h2>PAUSED</h2>' + (SC.hosted ? '' : CONTROLS) +");
rep("    pl.setState('finish'); pl.fin = { e, step: 0 };", "    SC.emit('finisherStart', e); pl.setState('finish'); pl.fin = { e, step: 0 };");
rep("try { ctx = A.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }", "try { let pc = null; try { pc = SC.hosted && window.parent.__issueAudio; } catch (e) { pc = null; } ctx = A.ctx = pc || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }");
rep("  A.toggle = function () {", "  A.kill = function () { A.on = false; try { if (master) master.disconnect(); } catch (e) { /* gone already */ } };\n  A.toggle = function () {");

if (/Calloway|Tally|Deacon|Mother Mercy|SECOND CHANCE|Second Chance|Halloran|Meridian|Hollow/.test(s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''))) {
  const m = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').match(/.{0,60}(Calloway|Tally|Deacon|Mother Mercy|SECOND CHANCE|Second Chance|Halloran|Meridian|Hollow).{0,40}/g);
  console.log('LEFTOVER:', m.slice(0, 12));
}
writeFileSync(dir + 'issue.html', s);
console.log('issue.html', (s.length / 1024).toFixed(1) + ' KB,', n, 'patches');
