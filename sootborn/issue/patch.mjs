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
    word: 'EVERY BREATH!'
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
rep("const a = i / 46 * Math.PI * 2 + rnd() * 0.08, r = 150 + rnd() * 60, w = 14 + rnd() * 22, h = 22 + rnd() * 60;", "const a = i / 46 * Math.PI * 2 + rnd() * 0.08, r = (SC.issue === 'stair' ? 190 : 150) + (i % 2) * 55 + rnd() * 15, w = 24 + rnd() * 14, h = 5 + rnd() * 5;");
rep("const geo = new THREE.BoxGeometry(w, h, w), uv = geo.attributes.uv;", "const geo = new THREE.BoxGeometry(w, h, w * 0.34), uv = geo.attributes.uv; { const gp = geo.attributes.position; for (let k = 0; k < gp.count; k++) if (gp.getY(k) < 0) { gp.setX(k, gp.getX(k) * 0.7); gp.setZ(k, gp.getZ(k) * 0.45); } }");
rep("b.position.set(Math.cos(a) * r, h / 2 - 2, Math.sin(a) * r); b.rotation.y = rnd() * 3; sky.add(b);\n    }", "b.position.set(Math.cos(a) * r, SC.issue === 'stair' ? -34 + rnd() * 46 : -14 + rnd() * 90, Math.sin(a) * r); b.rotation.y = rnd() * 3; const rg = sky.rings || (sky.rings = [new THREE.Group(), new THREE.Group()], sky.bcm = [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: 0xff5a3a, fog: false })), sky.add(sky.rings[0], sky.rings[1]), sky.rings); rg[i % 2].add(b);\n      { const bc = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), sky.bcm[i % 3]); bc.position.set(w * 0.47, h * 0.5 + 1.2, 0); b.add(bc); }\n      { const ln = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86, 0.45, w * 0.35), new THREE.MeshBasicMaterial({ color: 0xffd98a, fog: false })); ln.position.y = h * 0.2; b.add(ln); }\n      const bag = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.16, w * 0.16, w * 0.96, 8), new THREE.MeshBasicMaterial({ color: i % 3 ? 0x8f8aa8 : 0xb7b0c4, fog: false })); bag.rotation.z = Math.PI / 2; bag.rotation.y = b.rotation.y; bag.position.copy(b.position); bag.position.y += h / 2 + w * 0.2; rg[i % 2].add(bag); if (SC.issue === 'riser' || SC.issue === 'gild') { b.visible = false; bag.visible = false; }\n    }");

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
rep("FX.word('NOT YET!'", "FX.word('ON MY BREATH!'");
rep("FX.word('RISE!'", "FX.word('TO ME!'");
rep('<span class="ch" id="tagCh">2ND CHANCE</span>', '<span class="ch" id="tagCh">ON MY BREATH</span>');
rep("hero: { name: 'DEZ', kind: 'hero', bg: 0x2a2a70, cls: '' }", "hero: { name: 'KAEL', kind: 'hero', bg: 0x3a2a70, cls: '' }");
rep("clerk: { name: 'MR. TALLY', kind: 'clerk', bg: 0x3a3f5c, cls: 'pale' }", "clerk: { name: 'BRAND', kind: 'clerk', bg: 0x5a5560, cls: 'pale' }");
rep("voss: { name: 'DEACON VOSS', kind: 'boss', bg: 0x8a1f24, cls: 'dark' }", "voss: { name: 'CAPTAIN ROOK', kind: 'boss', bg: 0x8a1f24, cls: 'dark' }");
rep(`'<div style="text-align:center"><div class="tag">ISSUE #1 &middot; DEAD ON ARRIVAL</div><div class="logo"><span>SECOND</span>CHANCE</div>'`, `'<div style="text-align:center"><div class="tag">SOOTBORN &middot; SEVEN YEARS AFTER THE FURNACE</div><div class="logo"><span>THE HIGH</span>DOCKS</div>'`);
rep(`(head || 'HOW WILL YOU COLLECT?')`, `(head || 'ELEVEN SECONDS. HOW DO YOU FIGHT?')`);
rep(`<div class="mbtn s" data-go="c">BACK TO LAST CROSSING</div></div></div>', {`, `<div class="mbtn s" data-go="c">BACK TO THE LAST SUN</div>' + (SC.hosted ? '<div class="mbtn s" data-go="x">SKIP THIS LEVEL</div>' : '') + '</div></div>', {\n      x: () => { closeMenu(); U.paused = false; SC.story.wipe(); SC.host('done', { skipped: 1 }); U.freeze = true; },`);
rep(`'<div class="card"><h2>DEAD. AGAIN.</h2><p>No third chances. Mr. Tally closes the book.</p><div class="mbtn y" data-go="r">BACK TO THE LAST CROSSING</div></div>'`, `'<div class="card"><h2>DOWN.</h2><p>' + (SC.issue === 'riser' ? 'Forty people on a ladder behind you.' : SC.issue === 'stair' ? 'The stair is full behind you, and nobody on it is kneeling.' : 'The second bell has not finished ringing.') + ' Eleven seconds. Get up.</p><div class="mbtn y" data-go="r">BACK TO THE LAST SUN</div></div>'`);
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
rep("    SC.story.title();\n    requestAnimationFrame(frame);", `    if (SC.hosted) { document.body.classList.add('hosted'); { const de = document.documentElement; de.style.padding = '0'; ['--st', '--sb', '--sl', '--sr'].forEach(v => de.style.setProperty(v, '0px')); } SC.input.noPad = true; SC.audio.unlock(); SC.ui.resize(); if (SC.story.hasSave() && !SC.devFresh) SC.story.load(); else SC.story.newGame(); } else SC.story.title();
    requestAnimationFrame(frame);
    /* inside SOOTBORN: its d-pad and buttons drive this, and it sends the memories to show */
    window.addEventListener('message', e => {
      const d = e.data; if (!d || typeof d.sootborn !== 'string' || e.source !== window.parent) return;
      if (d.sootborn === 'assets') { SC.assets = d.panels || {}; SC.showFps = !!d.fps; }
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
rep("  I.init = function () {", "  if (SC.hosted) Object.assign(KEY, { KeyE: 'ctx', Enter: 'ctx', KeyZ: 'ctx', Space: 'ctx', KeyJ: 'ctx', KeyX: 'dodge', Backspace: 'dodge', KeyK: 'dodge', KeyQ: 'power', KeyG: 'power', KeyL: 'power', KeyR: 'lock', KeyC: 'attack', KeyF: 'interact', KeyH: 'interact', KeyM: 'pause', Tab: 'pause', KeyP: 'pause', Escape: 'pause' });\n  I.init = function () {");
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


/* ---- a small frame gets a small HUD, kept to the corners ---- */
rep("  U.resize = function () {", "  U.resize = function () {\n    if (SC.hosted) { const k = U.hudK = SC.clamp(Math.min(window.innerWidth / 560, window.innerHeight / 330), 0.6, 1), h = $('hud'); h.style.transformOrigin = '0 0'; h.style.transform = 'scale(' + k + ')'; h.style.right = h.style.bottom = 'auto'; h.style.width = (100 / k) + '%'; h.style.height = (100 / k) + '%'; }");
rep(".project(G.camera); const w = window.innerWidth, h = window.innerHeight;", ".project(G.camera); const w = window.innerWidth / (U.hudK || 1), h = window.innerHeight / (U.hudK || 1);");
rep('<div id="mem" class="hide"></div>', '<div id="mem" class="hide"></div>\n  <div id="rage"></div>');
rep("#mem.hide{display:none}", "#mem.hide{display:none}\n#rage{position:absolute;inset:0;pointer-events:none;z-index:4;opacity:0;transition:opacity .25s;box-shadow:inset 0 0 16vh 5vh rgba(210,24,12,.8)}\nbody.hosted #obj{max-width:40vw}body.hosted #toast{top:22%}body.hosted #page{grid-template-columns:1fr!important;grid-template-rows:1fr!important}body.hosted #page .pn{grid-area:1 / 1 / 2 / 2!important}body.hosted #who .pic{display:none}");
rep("    $('bPf').style.transform = ", "    { const k = SC.state === 'play' ? SC.clamp((p.meter - 40) / 60, 0, 1) : 0, mm = p.model.mats; for (let i = 0; i < mm.length; i++) if (mm[i].emissive) mm[i].emissive.setRGB(0.2 * k, 0.14 * k, 0.03 * k);\n      U.auraT = (U.auraT || 0) - rdt; if (k >= 1 && U.auraT <= 0 && !U.blocking()) { U.auraT = 0.7; _v.copy(p.pos); _v.x += (Math.random() - 0.5) * 0.7; _v.z += (Math.random() - 0.5) * 0.7; _v.y += 0.3 + Math.random() * 1.4 + p.lift; G.fx.burst(_v, 0xffd23a, 0.3); }\n      if (p.state === 'hurt') p.lift = 0;\n      if (p.meter >= SC.T.meter) { if (!U.fullT && SC.state === 'play') { U.fullT = 1; U.toast('FURY FULL. *HOLD STRIKE: ELEVEN.*', 2.6); } } else U.fullT = 0;\n      if (!U.taught && SC.enemies.length && SC.state === 'play' && !U.blocking()) { U.taught = 1; void 0; } }\n    $('bPf').style.transform = ");
rep("    const x = pl.pos.x, y = pl.pos.y, z = pl.pos.z;\n    if (F.e_alley && !F.e_street", "    const x = pl.pos.x, y = pl.pos.y, z = pl.pos.z;\n" + ST.SUNS + "    if (F.e_alley && !F.e_street");

/* ---- the blade: three cuts instead of three punches, and they land ---- */
between("  const A1w = {", "  P.attack = (i, t) => {", `  const A1w = { hips: [0, -0.7, 0], spine: [-0.05, -0.3, 0], chest: [-0.05, -0.4, 0], head: [0, 0.9, 0], shR: [-2.5, 0, -0.7], elR: [-1.5, 0, 0], shL: [-0.9, 0, 0.3], elL: [-1.2, 0, 0], thL: [-0.5, 0, 0.1], shnL: [0.6, 0, 0], thR: [0.4, 0, -0.1], shnR: [0.5, 0, 0], sc1: [-0.9, 0, 0], y: -0.14 };
  const A1s = { hips: [0, 0.7, 0], spine: [0.35, 0.35, 0], chest: [0.15, 0.5, 0], head: [-0.1, -1.0, 0], shR: [-0.9, 0, 0.95], elR: [-0.1, 0, 0], shL: [0.6, 0, 0.4], elL: [-1.4, 0, 0], thL: [-0.95, 0, 0.05], shnL: [1.0, 0, 0], thR: [0.7, 0, -0.1], shnR: [0.3, 0, 0], ftR: [-0.5, 0, 0], sc1: [-0.3, 0.4, 0], y: -0.24 };
  const A2w = { hips: [0, 0.8, 0], spine: [0.2, 0.3, 0], chest: [0.1, 0.5, 0], head: [0, -1.1, 0], shR: [-0.8, 0, 1.2], elR: [-1.6, 0, 0], shL: [0.4, 0, 0.6], elL: [-1.2, 0, 0], thL: [0.2, 0, 0.12], shnL: [0.45, 0, 0], thR: [-0.5, 0, -0.1], shnR: [0.6, 0, 0], sc1: [-0.9, 0, 0], y: -0.16 };
  const A2s = { hips: [0, -0.9, 0], spine: [-0.1, -0.4, 0], chest: [-0.1, -0.6, 0], head: [0.05, 1.3, 0], shR: [-1.9, 0, -1.1], elR: [-0.08, 0, 0], shL: [-0.6, 0, 0.5], elL: [-1.5, 0, 0], thL: [-0.7, 0, 0.1], shnL: [0.8, 0, 0], thR: [0.55, 0, -0.14], shnR: [0.3, 0, 0], ftR: [-0.4, 0, 0], sc1: [-0.4, -0.5, 0], y: -0.12 };
  const A3w = { hips: [-0.2, 0, 0], spine: [-0.35, 0, 0], chest: [-0.25, 0, 0], head: [0.3, 0, 0], shR: [-3.0, 0, -0.15], elR: [-0.7, 0, 0], shL: [-3.0, 0, 0.15], elL: [-0.7, 0, 0], thL: [-1.1, 0, 0.1], shnL: [1.6, 0, 0], thR: [-0.3, 0, -0.1], shnR: [1.3, 0, 0], sc1: [0.2, 0, 0], y: 0.34 };
  const A3s = { hips: [0.25, 0, 0], spine: [0.7, 0, 0], chest: [0.3, 0, 0], head: [-0.5, 0, 0], shR: [-0.75, 0, 0.25], elR: [-0.1, 0, 0], shL: [-0.75, 0, -0.25], elL: [-0.1, 0, 0], thL: [-1.3, 0, 0.1], shnL: [1.5, 0, 0], thR: [0.5, 0, -0.1], shnR: [1.2, 0, 0], ftR: [0.5, 0, 0], sc1: [-1.5, 0, 0], y: -0.42 };
  // the ram: his off hand, straight from the hip, the way he used to seat a valve
  const Rw = { hips: [0, 0.6, 0], spine: [0.1, 0.25, 0], chest: [0.05, 0.4, 0], head: [0, -0.9, 0], shL: [0.4, 0, 0.5], elL: [-2.0, 0, 0], shR: [-0.4, 0, -0.5], elR: [-1.2, 0, 0], thL: [0.2, 0, 0.12], shnL: [0.45, 0, 0], thR: [-0.4, 0, -0.1], shnR: [0.55, 0, 0], sc1: [-0.9, 0, 0], y: -0.14 };
  const Rs = { hips: [0, -0.8, 0], spine: [0.25, -0.3, 0], chest: [0.12, -0.5, 0], head: [-0.05, 1.2, 0], shL: [-1.55, 0, -0.1], elL: [-0.05, 0, 0], shR: [0.4, 0, -0.5], elR: [-1.4, 0, 0], thL: [-0.8, 0, 0.1], shnL: [0.85, 0, 0], thR: [0.55, 0, -0.14], shnR: [0.3, 0, 0], ftR: [-0.4, 0, 0], sc1: [-0.4, 0.5, 0], y: -0.18 };
  // the boot: knee up, then straight through him
  const Kw = { hips: [0.1, -0.3, 0], spine: [0.2, 0, 0], chest: [0.1, 0, 0], head: [-0.1, 0.3, 0], shL: [-0.8, 0, 0.5], elL: [-1.4, 0, 0], shR: [-0.3, 0, -0.7], elR: [-0.9, 0, 0], thL: [0.05, 0, 0.1], shnL: [0.25, 0, 0], thR: [-1.6, 0, -0.1], shnR: [1.9, 0, 0], sc1: [-0.8, 0, 0], y: -0.06 };
  const Ks = { hips: [-0.35, -0.2, 0], spine: [-0.25, 0, 0], chest: [-0.1, 0, 0], head: [0.3, 0.2, 0], shL: [0.3, 0, 0.8], elL: [-0.5, 0, 0], shR: [0.5, 0, -0.8], elR: [-0.4, 0, 0], thL: [0.15, 0, 0.1], shnL: [0.2, 0, 0], thR: [-1.75, 0, -0.05], shnR: [0.1, 0, 0], ftR: [0.6, 0, 0], sc1: [-0.3, 0, 0], y: -0.02 };
`);
between("  P.attack = (i, t) => {", "  P.ATTACK = [", `  P.attack = (i, t) => {
    const g = P.guard(0);
    if (i === 0) return clip([[0, g], [0.06, A1w], [0.12, A1s], [0.16, mix(A1w, A1s, 1.16)], [0.26, A1s], [0.34, mix(g, A1s, 0.35)], [0.42, g]], t);
    if (i === 1) return clip([[0, g], [0.07, A2w], [0.14, A2s], [0.18, mix(A2w, A2s, 1.16)], [0.29, A2s], [0.38, mix(g, A2s, 0.35)], [0.46, g]], t);
    if (i === 2) return clip([[0, g], [0.06, Rw], [0.12, Rs], [0.15, mix(Rw, Rs, 1.14)], [0.25, Rs], [0.33, mix(g, Rs, 0.3)], [0.4, g]], t);
    if (i === 3) return clip([[0, g], [0.08, Kw], [0.17, Ks], [0.29, Ks], [0.46, g]], t);
    return clip([[0, g], [0.12, A3w], [0.2, A3s], [0.25, mix(A3w, A3s, 1.12)], [0.4, A3s], [0.52, mix(g, A3s, 0.4)], [0.62, g]], t);
  };
`);
rep("P.ATTACK = [{ dur: 0.4, hit: 0.12, chain: 0.2 }, { dur: 0.44, hit: 0.14, chain: 0.22 }, { dur: 0.62, hit: 0.2, chain: 0.5 }];", "P.ATTACK = [{ dur: 0.4, hit: 0.12, chain: 0.2 }, { dur: 0.44, hit: 0.14, chain: 0.22 }, { dur: 0.4, hit: 0.13, chain: 0.2 }, { dur: 0.46, hit: 0.17, chain: 0.25 }, { dur: 0.62, hit: 0.2, chain: 0.5 }];");
rep("if (pl.queued && pl.st >= A.chain && pl.combo < 2) startAttack(", "if (pl.queued && pl.st >= A.chain && pl.combo < 4) startAttack(");
rep("const f = fwd(pl.yaw, _a), heavy = i === 2, reach = heavy ? 2.5 : 2.05,", "const f = fwd(pl.yaw, _a), heavy = i === 4, blunt = i === 2 || i === 3, reach = heavy ? 2.6 : i === 3 ? 2.3 : 2.05,");
rep("if (heavy && pl.path === 'ember') e.burn = 3;", "if (heavy && pl.path === 'ember') e.burn = 3; if (blunt && hits === 0) { _c.copy(e.pos); _c.y += e.h * 0.9; FX.word(i === 2 ? 'THE RAM!' : 'THE BOOT!', _c, '#ffe14a', 1.1); }");
rep("{ heavy, combo: i });", "{ heavy: heavy || i === 3, named: blunt, combo: i });");
rep("if (o.heavy && !o.power) { _a.y += 0.7; FX.word(SC.pick(['WHAM!', 'KRAK!', 'POW!', 'THWAK!']), _a, '#ffe14a', 1.5); }", "if (o.heavy && !o.power && !o.named) { _a.y += 0.7; FX.word(SC.pick(pl.meter > 55 ? ['FOR HER!', 'EVERY BREATH!', 'LAST BELL!', 'HER NAME!'] : ['AIR OWED!', 'COUNTED!', 'SOOT!', 'BREATHE!']), _a, pl.meter > 55 ? '#ff7a2e' : '#ffe14a', 1.4); }");
rep("    if (pl.inv > 0) return false;\n", "    if (pl.inv > 0) return false;\n    pl.cnt = 0; if (Math.random() < 0.6) { _c.set(fx, pl.pos.y + 2.4, fz); FX.word(SC.pick(['NOTED.', 'BALANCED.', 'KNEEL.', 'STRUCK.']), _c, '#dfe6ff', 0.95); }\n");
rep("FX.word('TOO SLOW!', _a, '#ffffff', 1.5);", "FX.word('THE TURN!', _a, '#ffffff', 1.5);");
rep("FX.word('FINISH!', _a, '#ffffff', 1.4);", "FX.word('HIS LINE IS OPEN!', _a, '#ffffff', 1.2);");
rep("FX.word('THOOM!', _c, '#ff3b30', 1.7);", "FX.word('KNEEL!', _c, '#ff3b30', 1.7);");
rep("FX.word('KRA-KOOM!', _a, '#ff3b30', 2.1);", "FX.word('BALANCED!', _a, '#ff3b30', 2.1);");

rep("const DMG = [9, 11, 19];", "const DMG = [14, 17, 19, 22, 34];");
rep("e.hit(DMG[i] + (pl.rank > 1 ? 1 : 0),", "e.hit((DMG[i] + (pl.rank > 1 ? 2 : 0)) * (1 + pl.meter / T.meter * 0.6),");
rep("FX.slash(_b, pl.yaw + (i === 1 ? 0.4 : -0.3), i === 1 && path ? path.color : 0xffffff, heavy ? 3.2 : 2.3, (i === 0 ? -0.5 : i === 1 ? 0.45 : 0.08));", "if (blunt) { FX.burst(_b, 0xffffff, 1.5); if (i === 2) FX.ring(_b, 0xffd23a, 0.2, 1.6, 0.25); } else { const hot = path && pl.meter > 45; FX.slash(_b, pl.yaw + (i === 1 ? 0.4 : -0.3), hot ? 0xffc23a : 0xffffff, heavy ? 4.6 : 3.3, (i === 0 ? -0.6 : i === 1 ? 0.55 : 1.45)); if (heavy || hot) FX.slash(_b, pl.yaw + (i === 1 ? 0.2 : -0.15), hot ? path.hot : 0xfff2c4, heavy ? 3.4 : 2.4, (i === 0 ? -0.4 : i === 1 ? 0.35 : 1.3)); }");
rep("SC.time.hitstop = heavy ? 0.11 : 0.05; SC.cam.shake(heavy ? 0.4 : 0.14); pl.gain(heavy ? 9 : 6);", "SC.time.hitstop = heavy ? 0.17 : 0.085; SC.cam.shake(heavy ? 0.85 : 0.32); pl.gain(heavy ? 12 : 8); if (heavy) { FX.puff(_b, 5, 1.2); SC.audio.sfx('slam'); }\n      if (pl.t - (pl.cntT || -9) > 2.8) pl.cnt = 0; pl.cnt = (pl.cnt || 0) + 1; pl.cntT = pl.t;\n      if (pl.cnt >= 3 && pl.cnt <= 11) { _c.copy(pl.pos); _c.y += 2.45; FX.word(['THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN!'][pl.cnt - 3], _c, pl.cnt > 8 ? '#ff7a2e' : '#ffffff', 0.62 + pl.cnt * 0.06); }\n      if (pl.cnt >= 11) { pl.cnt = 0; pl.gain(35); SC.slowmo(0.3, 0.6); FX.ring(pl.pos, 0xff5a1f, 0.5, 5.2, 0.5); FX.light(pl.pos, 0xff5a1f, 120, 0.5); for (const e of E) { if (e.hittable() && Math.abs(e.pos.y - pl.pos.y) < 2 && SC.dist2(e.pos.x, e.pos.z, pl.pos.x, pl.pos.z) < 4.6) { const ex = e.pos.x - pl.pos.x, ez = e.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 1; e.hit(38, ex / d, ez / d, { heavy: true, power: true }); _c.copy(e.pos); _c.y += e.h + 0.4; FX.word('LINE STRUCK!', _c, '#ff5a1f', 1.3); } } }");
rep("this.vel.x += dx * (o.heavy ? 9 : 3.6) * big; this.vel.z += dz * (o.heavy ? 9 : 3.6) * big;", "this.vel.x += dx * (o.heavy ? 13 : 5.5) * big; this.vel.z += dz * (o.heavy ? 13 : 5.5) * big;");
rep("FX.burst(_a, 0xffffff, o.heavy ? 1.7 : 1);", "FX.burst(_a, 0xffffff, o.heavy ? 2.4 : 1.5); FX.burst(_a, 0xff5a1f, o.heavy ? 1.6 : 0.9);");
/* the finisher: two cuts counted aloud, then he goes up and brings the third down */
between("  function updateFinisher(dt) {", "  pl.update = function (dt, rdt) {", `  function updateFinisher(dt) {
    const f = pl.fin, e = f.e, st = pl.st, path = SC.PATHS[pl.path || 'ember'], boss = e.kind === 'boss'; pl.vel.set(0, 0, 0);
    const cut = (n, word, yaw, tilt) => { if (f.step !== n) return; f.step = n + 1; _a.copy(e.pos); _a.y += 1.3;
      FX.slash(_a, pl.yaw + yaw, path.color, 4.2, tilt); FX.slash(_a, pl.yaw + yaw * 0.6, 0xffffff, 3.2, tilt * 0.8); FX.burst(_a, 0xffffff, 2); FX.burst(_a, path.color, 1.4); FX.puff(_a, 4, 1);
      _a.y += 1.0; FX.word(word, _a, '#ffe14a', 0.95); SC.time.hitstop = 0.11; SC.cam.shake(0.7); SC.audio.sfx('hit', 1); e.flash = 0.16; e.pos.addScaledVector(fwd(pl.yaw, _b), 0.12); };
    if (st < 0.16) { pl.pose = P.attack(0, 0.06); pl.poseRate = 30; }
    else if (st < 0.38) { cut(0, boss ? 'NINE!' : 'ONE!', -0.4, -0.6); pl.pose = P.attack(0, 0.2); pl.poseRate = 70; }
    else if (st < 0.48) { pl.pose = P.attack(1, 0.07); pl.poseRate = 44; }
    else if (st < 0.7) { cut(1, boss ? 'TEN!' : 'TWO!', 0.5, 0.55); pl.pose = P.attack(1, 0.2); pl.poseRate = 70; }
    else if (st < 1.04) { pl.pose = P.attack(4, 0.12); pl.poseRate = 26; pl.lift = Math.sin((st - 0.7) / 0.34 * Math.PI * 0.5) * 1.0; }
    else {
      if (f.step === 2) {
        f.step = 3; pl.stats.finishers++;
        _a.copy(e.pos); _a.y += 1.5; FX.slash(_a, pl.yaw, 0xffffff, 5.4, 1.5); FX.slash(_a, pl.yaw, path.color, 4.4, 1.5); FX.burst(_a, path.color, 3.4); FX.burst(_a, 0xffffff, 2.4);
        _a.y += 1.5; FX.word(boss ? 'ELEVEN!' : 'STRUCK THROUGH!', _a, path.cssHot, 1.5);
        FX.ring(e.pos, path.color, 0.5, 5, 0.5); FX.ring(e.pos, 0xffffff, 0.3, 3, 0.35); FX.light(e.pos, path.color, 200, 0.8); FX.ink(e.pos, 10, 1.8); FX.puff(e.pos, 9, 1.6);
        SC.time.hitstop = 0.26; SC.cam.shake(1.5); SC.audio.sfx('finish'); SC.audio.sfx('slam'); SC.emit('flash', path.css);
        e.finished();
      }
      pl.pose = P.attack(4, 0.3); pl.poseRate = 80; pl.lift = Math.max(0, pl.lift - dt * 16);
    }
    if (st > 1.6) { pl.lift = 0; combat.freeze = null; pl.setState('idle'); SC.cam.endCine(0.45); SC.emit('letterbox', false); SC.emit('finisherEnd', e); }
  }

`);

/* ---- ground that holds still: more depth precision close in, sharper texture at a slant ---- */
rep("G.camera = new THREE.PerspectiveCamera(SC.T.camFov, 1, 0.25, 500);", "G.camera = new THREE.PerspectiveCamera(SC.T.camFov, 1, 0.45, 520);");
rep("    t.anisotropy = 4;", "    t.anisotropy = 8;");
rep("sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.04;", "sun.shadow.bias = -0.0009; sun.shadow.normalBias = 0.07;");
/* ---- the music up here is the shift song, not a city's walking bass ---- */
rep("const BASS = [38, 0, 38, 41, 0, 43, 0, 36, 38, 0, 45, 43, 0, 41, 36, 0], LEAD = [62, 65, 69, 0, 67, 65, 0, 62];", "const BASS = [38, 0, 38, 45, 0, 43, 0, 41, 38, 0, 45, 43, 0, 41, 40, 0], LEAD = [62, 65, 69, 67, 65, 64, 62, 0];");

/* ---- three levels in one file: the host names the one it wants ---- */
rep("const SAVE = 'sootborn-issue-docks-v1'", "const SAVE = 'sootborn-issue-' + SC.issue + (SC.cold ? '-cold' : '') + '-v1'");
rep("})();\n'use strict';\n/* SECOND CHANCE - main: boot and the frame loop. */", ST.ALT + "})();\n'use strict';\n/* SECOND CHANCE - main: boot and the frame loop. */");
rep("voss: { name: 'CAPTAIN ROOK',", "voss: { name: SC.issue === 'riser' ? 'WARDEN CAPTAIN' : SC.issue === 'stair' ? \"THE AUDITOR'S BLADE\" : 'CAPTAIN ROOK',");
rep("clerk: { name: 'BRAND',", "clerk: { name: SC.issue === 'stair' ? 'TAVI' : 'BRAND',");
rep("const bands = ['#0a0d2a', '#10163a', '#1a2156', '#2a2a70', '#48358a', '#7a4690'];", "const bands = SC.issue === 'stair' ? ['#241e4a', '#4a3470', '#8a4a7a', '#c8645a', '#f09a4e', '#ffd98a'] : SC.issue === 'riser' ? ['#060a18', '#0a1226', '#101c36', '#16284a', '#1e3454', '#2a4460'] : ['#0a0d2a', '#10163a', '#1a2156', '#2a2a70', '#48358a', '#7a4690'];");
rep("rain = { m, pos, d, N };", "rain = { m, pos, d, N }; G.rainMesh = m;");
rep("    G.init(document.getElementById('gl'));", `    G.init(document.getElementById('gl'));
    if (SC.issue === 'stair') { G.scene.background.set(0x4a3470); G.scene.fog.color.set(0xb06a7a); G.scene.fog.near = 60; G.scene.fog.far = 260; G.amb.color.setRGB(0.5, 0.36, 0.44); G.sun.color.setRGB(1.0, 0.72, 0.42); G.uKey.value.set(1.0, 0.74, 0.46); if (G.rainMesh) G.rainMesh.visible = false; }
    if (SC.issue === 'riser') { G.scene.background.set(0x0a1226); G.scene.fog.color.set(0x12233a); G.scene.fog.near = 26; G.scene.fog.far = 120; G.amb.color.setRGB(0.22, 0.3, 0.42); }
    if (SC.issue === 'gild') { G.scene.background.set(0x07060a); G.scene.fog.color.set(0x0c0a10); G.scene.fog.near = 10; G.scene.fog.far = 34; G.amb.color.setRGB(0.3, 0.28, 0.34); G.sun.color.setRGB(0.34, 0.3, 0.26); G.uKey.value.set(1.0, 0.9, 0.72); if (G.rainMesh) G.rainMesh.visible = false; }`);

/* ---- the boots: he has had them since the last day of the Assay. One press carries him over their heads and down on them. ---- */
rep("wantPow = can && inp.buffered('power', 0.2),", "wantPow = can && inp.buffered('power', 0.2), wantBoot = can && inp.buffered('boots', 0.2),");
rep("      if (wantDodge && pl.dodgeCd <= 0 && pl.onGround) { inp.clear('dodge'); startDodge(mx, mz, mag); }", "      if (wantBoot && (pl.bootCd || 0) <= 0 && pl.onGround) { inp.clear('boots'); startBoots(mx, mz, mag); }\n      else if (wantDodge && pl.dodgeCd <= 0 && pl.onGround) { inp.clear('dodge'); startDodge(mx, mz, mag); }");
rep("      case 'power': updatePower(dt); break;", `      case 'boots': {
        const k = pl.st / 0.62, sp = 15 * (1 - 0.35 * k);
        pl.vel.set(pl.ddx * sp, 0, pl.ddz * sp); pl.lift = Math.sin(Math.min(1, k) * Math.PI) * 2.3; pl.pose = k < 0.75 ? P.leap : P.attack(4, 0.2); pl.poseRate = 30; pl.inv = Math.max(pl.inv, 0.12);
        if (((pl.st * 30) | 0) % 2 === 0) { _a.copy(pl.pos); _a.y += pl.lift; FX.burst(_a, 0x7ad9ff, 0.7); }
        if (k >= 1) { pl.lift = 0; pl.vel.multiplyScalar(0.15); pl.setState('idle'); FX.ring(pl.pos, 0x7ad9ff, 0.4, 3.6, 0.4); FX.puff(pl.pos, 7, 1.3); FX.light(pl.pos, 0x7ad9ff, 80, 0.35); SC.cam.shake(0.7); SC.audio.sfx('slam'); let n = 0;
          for (const e of E) { if (!e.hittable() || Math.abs(e.pos.y - pl.pos.y) > 1.9) continue; const ex = e.pos.x - pl.pos.x, ez = e.pos.z - pl.pos.z, d = Math.hypot(ex, ez); if (d < 2.9 + e.r) { e.hit(24 * (1 + pl.meter / T.meter * 0.5), ex / (d || 1), ez / (d || 1), { heavy: true, named: true }); n++; } }
          if (n) { _a.copy(pl.pos); _a.y += 2.6; FX.word('LIFT ZERO!', _a, '#7ad9ff', 1.3); SC.time.hitstop = 0.12; pl.gain(10); } }
        break; }
      case 'power': updatePower(dt); break;`);
rep("  function perfectDodge() {", `  function startBoots(mx, mz, mag) {
    pl.setState('boots'); pl.bootCd = 3.2; pl.inv = Math.max(pl.inv, 0.7);
    let dx = mag > 0.3 ? mx / mag : Math.sin(pl.yaw), dz = mag > 0.3 ? mz / mag : Math.cos(pl.yaw); const t = pickTarget(11, 0.3, dx, dz);
    if (t) { const ex = t.pos.x - pl.pos.x, ez = t.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 1; dx = ex / d; dz = ez / d; }
    pl.ddx = dx; pl.ddz = dz; pl.yaw = Math.atan2(dx, dz);
    FX.ring(pl.pos, 0x7ad9ff, 0.3, 2.2, 0.3); FX.puff(pl.pos, 5, 1); SC.audio.sfx('leap'); SC.emit('speedlines', 0.5);
  }
  function perfectDodge() {`);
rep("pl.t += dt; pl.st += dt; if (pl.inv > 0) pl.inv -= dt; pl.dodgeCd -= dt;", "pl.t += dt; pl.st += dt; if (pl.inv > 0) pl.inv -= dt; pl.dodgeCd -= dt; pl.bootCd = (pl.bootCd || 0) - dt;");
rep("KeyC: 'attack', KeyF: 'interact', KeyH: 'interact',", "KeyC: 'attack', KeyF: 'boots', KeyH: 'interact',");
rep("const KEY = { KeyJ: 'attack',", "const KEY = { KeyB: 'boots', KeyJ: 'attack',");

/* ---- a brighter picture: the ink and the dots stay, the shadows lift ---- */
rep("G.uDot.value = Math.max(4, Math.min(w, h) * pr / 150);", "G.uDot.value = Math.max(2.2, Math.min(w, h) * pr / 340);");
rep("    if (SC.issue === 'riser') { G.scene.background.set(0x0a1226);", "    G.amb.color.multiplyScalar(SC.issue === 'stair' ? 1.25 : 1.5); G.sun.color.multiplyScalar(1.15); G.uKey.value.multiplyScalar(1.12);\n    if (SC.issue === 'riser') { G.scene.background.set(0x0a1226);");
rep("G.amb.color.setRGB(0.22, 0.3, 0.42); }", "G.amb.color.setRGB(0.36, 0.46, 0.6); }");
/* ---- one panel at a time in the small frame, and nothing written over anything else ---- */
rep("    if (pg.n < pg.def.panels.length) { el.children[pg.n].classList.add('on'); pg.n++; SC.audio.sfx('page'); return; }", "    if (pg.n < pg.def.panels.length) { if (SC.hosted && pg.n > 0) el.children[pg.n - 1].style.display = 'none'; el.children[pg.n].classList.add('on'); pg.n++; SC.audio.sfx('page'); return; }");
rep("  U.say = function (lines, done) { U.dlg = {", "  U.say = function (lines, done) { $('toast').classList.remove('on'); U.dlg = {");
rep("  U.page = function (def, done) {", "  U.page = function (def, done) {\n    $('toast').classList.remove('on');");
rep("    el.classList.remove('hide'); U.freeze = true; U.mem = { done, t: performance.now() };", "    $('toast').classList.remove('on'); el.classList.remove('hide'); U.freeze = true; U.mem = { done, t: performance.now() };");
rep("  U.toast = function (t, dur) {", "  U.toast = function (t, dur) { if (U.dlg || U.pg || U.mem) { const a = arguments; setTimeout(() => U.toast.apply(U, a), 900); return; }");

/* ---- more of how he fights: the boot on its own button, the wide cut, the hook line, the riposte ---- */
rep("wantBoot = can && inp.buffered('boots', 0.2),", "wantBoot = can && inp.buffered('boots', 0.2), wantKick = can && inp.buffered('kick', 0.2), wantHook = can && inp.buffered('hook', 0.2),");
rep("      if (wantBoot && (pl.bootCd || 0) <= 0 && pl.onGround) { inp.clear('boots'); startBoots(mx, mz, mag); }", "      if (wantKick && pl.onGround) { inp.clear('kick'); startAttack(pl.state === 'attack' && pl.combo === 3 ? 5 : 3, mx, mz, mag); }\n      else if (wantHook && pl.onGround) { inp.clear('hook'); if ((pl.hookCd || 0) <= 0) useHook(mx, mz, mag); else { SC.audio.sfx('deny'); _a.copy(pl.pos); _a.y += 2.4; FX.word('LINE OUT', _a, '#dfe6ff', 0.7); } }\n      else if (wantBoot && (pl.bootCd || 0) <= 0 && pl.onGround) { inp.clear('boots'); startBoots(mx, mz, mag); }");
rep("  function startBoots(mx, mz, mag) {", `  /* the rigging line off the valve banks: it brings an ordinary guard to him, and takes him to a big one. Either way he arrives with the ram. */
  function useHook(mx, mz, mag) {
    let dx = mag > 0.3 ? mx / mag : Math.sin(pl.yaw), dz = mag > 0.3 ? mz / mag : Math.cos(pl.yaw); const t = pickTarget(15, -0.35, dx, dz);
    SC.audio.sfx('chainThrow'); if (!t) { pl.hookCd = 1.2; pl.yaw = Math.atan2(dx, dz); for (let k = 1; k < 9; k++) { _a.set(pl.pos.x + dx * k * 0.9, pl.pos.y + 1.2, pl.pos.z + dz * k * 0.9); FX.burst(_a, 0xffd23a, 0.45); } for (let k = 0; k < 18; k++) { const ox = pl.pos.x, oz = pl.pos.z; pl.pos.x += dx * 0.28; pl.pos.z += dz * 0.28; W.collide(pl.pos, pl.r, pl.pos.y, pl.h); if (Math.hypot(pl.pos.x - ox, pl.pos.z - oz) < 0.12) break; } _a.copy(pl.pos); _a.y += 2.5; FX.word('HOOK LINE!', _a, '#ffd23a', 0.9); SC.audio.sfx('chainYank'); startAttack(2, dx, dz, 1); return; }
    pl.hookCd = 2.5; const ex = t.pos.x - pl.pos.x, ez = t.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 1; pl.yaw = Math.atan2(ex, ez);
    for (let k = 1; k < 8; k++) { _a.set(pl.pos.x + ex * k / 8, pl.pos.y + 1.2, pl.pos.z + ez * k / 8); FX.burst(_a, 0xffd23a, 0.45); }
    if (t.K.armor) { pl.pos.x = t.pos.x - ex / d * (t.r + 1.2); pl.pos.z = t.pos.z - ez / d * (t.r + 1.2); W.collide(pl.pos, pl.r, pl.pos.y, pl.h); }
    else { t.pos.x = pl.pos.x + ex / d * 1.6; t.pos.z = pl.pos.z + ez / d * 1.6; t.vel.set(0, 0, 0); t.hit(5, 0, 0, { named: true, quiet: true }); }
    _a.copy(pl.pos); _a.y += 2.5; FX.word('HOOK LINE!', _a, '#ffd23a', 1.1); SC.audio.sfx('chainYank'); SC.cam.shake(0.35); startAttack(2, ex / d, ez / d, 1);
  }
  function startBoots(mx, mz, mag) {`);
rep("pl.bootCd = (pl.bootCd || 0) - dt;", "pl.bootCd = (pl.bootCd || 0) - dt; pl.hookCd = (pl.hookCd || 0) - dt; pl.riposte = (pl.riposte || 0) - dt;");
rep("    pl.perfected = true; pl.inv = Math.max(pl.inv, 0.8);", "    pl.perfected = true; pl.riposte = 2.2; pl.inv = Math.max(pl.inv, 0.8);");
rep("heavy = i === 4, blunt = i === 2 || i === 3, reach = heavy ? 2.6 : i === 3 ? 2.3 : 2.05,", "heavy = i === 4, wide = i === 5, blunt = i === 2 || i === 3, rip = pl.riposte > 0 && !blunt, reach = wide ? 3.2 : heavy ? 2.6 : i === 3 ? 2.3 : 2.05,");
rep("minDot = heavy ? -0.25 : 0.2,", "minDot = wide ? -1.1 : heavy ? -0.25 : 0.2,");
rep("e.hit((DMG[i] + (pl.rank > 1 ? 2 : 0)) * (1 + pl.meter / T.meter * 0.6),", "e.hit((DMG[i] + (pl.rank > 1 ? 2 : 0)) * (1 + pl.meter / T.meter * 0.6) * (rip ? 2 : 1),");
rep("{ heavy: heavy || i === 3, named: blunt, combo: i });", "{ heavy: heavy || i === 3 || wide || rip, named: blunt || wide || rip, combo: i }); if ((wide || rip) && hits === 0) { _c.copy(pl.pos); _c.y += 2.9; FX.word(rip ? 'RIPOSTE!' : 'WIDE CUT!', _c, '#ffd23a', 1.2); if (wide) { FX.slash(_b, pl.yaw + 2.1, 0xffc23a, 4, 0.2); FX.slash(_b, pl.yaw - 2.1, 0xffffff, 4, -0.2); } pl.riposte = 0; }");
rep("const DMG = [14, 17, 19, 22, 34];", "const DMG = [14, 17, 19, 22, 34, 26];");
rep("P.ATTACK = [{ dur: 0.4, hit: 0.12, chain: 0.2 }, { dur: 0.44, hit: 0.14, chain: 0.22 }, { dur: 0.4, hit: 0.13, chain: 0.2 }, { dur: 0.46, hit: 0.17, chain: 0.25 }, { dur: 0.62, hit: 0.2, chain: 0.5 }];", "P.ATTACK = [{ dur: 0.4, hit: 0.12, chain: 0.2 }, { dur: 0.44, hit: 0.14, chain: 0.22 }, { dur: 0.4, hit: 0.13, chain: 0.2 }, { dur: 0.46, hit: 0.17, chain: 0.25 }, { dur: 0.62, hit: 0.2, chain: 0.5 }, { dur: 0.56, hit: 0.2, chain: 0.4 }];");
rep("    if (i === 3) return clip([[0, g], [0.08, Kw], [0.17, Ks], [0.29, Ks], [0.46, g]], t);", "    if (i === 3) return clip([[0, g], [0.08, Kw], [0.17, Ks], [0.29, Ks], [0.46, g]], t);\n    if (i === 5) { const sw = Object.assign({}, A2s, { hips: [0, -2.7, 0], chest: [-0.1, -0.9, 0], head: [0.05, 2.2, 0] }); return clip([[0, g], [0.08, A2w], [0.2, sw], [0.36, sw], [0.56, g]], t); }");
rep("KeyC: 'attack', KeyF: 'boots',", "KeyC: 'kick', KeyV: 'hook', KeyF: 'boots',");

/* ---- v0.32: light and heavy, four chain enders, jump and hover, ELEVEN on a held strike, fury earned ---- */
rep("  I.reset = () =>", "  I.hold = {};\n  I.reset = () =>");
rep("(d.press || []).forEach(", "SC.input.hold = d.hold || {}; (d.press || []).forEach(");
rep("KeyC: 'kick', KeyV: 'hook', KeyF: 'boots',", "KeyC: 'kick', KeyV: 'hook', KeyF: 'boots', KeyT: 'jump',");
rep("wantKick = can && inp.buffered('kick', 0.2),", "wantKick = can && inp.buffered('kick', 0.2), wantJump = can && inp.buffered('jump', 0.2),");
rep("      if (wantKick && pl.onGround) { inp.clear('kick'); startAttack(pl.state === 'attack' && pl.combo === 3 ? 5 : 3, mx, mz, mag); }", `      if (can && inp.hold.a && pl.onGround && (free || pl.state === 'attack')) { pl.holdA = (pl.holdA || 0) + dt;
        if (pl.path && pl.meter >= T.powerCost) { if (pl.holdA > 0.2 && ((pl.holdA * 20) | 0) % 3 === 0) FX.ring(pl.pos, 0xffd23a, 1.6 - pl.holdA * 2, 0.3, 0.18); if (pl.holdA > 0.4) { pl.holdA = 0; pl.lift = 0; inp.clear("attack"); usePower(mx, mz, mag); } }
        else if (pl.holdA > 0.24 && !pl.heldHeavy && pl.state === 'attack' && pl.combo < 4 && pl.st >= P.ATTACK[pl.combo].hit) { pl.heldHeavy = 1; inp.clear('attack'); startAttack([6, 5, 7, 8][pl.combo], mx, mz, mag); }
      } else { pl.holdA = 0; pl.heldHeavy = 0; }
      const hc = pl.state === 'attack' ? pl.combo : -1;
      if (pl.state === 'power') { /* the eleven has started */ }
      else if (wantKick && pl.onGround && (hc < 0 || pl.st >= P.ATTACK[hc].hit)) { inp.clear('kick'); startAttack(hc === 0 ? 6 : hc === 1 ? 5 : hc === 2 ? 7 : hc === 3 ? 8 : 3, mx, mz, mag); }
      else if (wantKick) { /* held for the beat */ }
      else if (wantJump && pl.onGround && free) { inp.clear('jump'); pl.setState('air'); pl.jv = 9; pl.airFuel = 3.4; pl.diving = 0; FX.ring(pl.pos, 0x7ad9ff, 0.3, 1.8, 0.3); FX.puff(pl.pos, 4, 0.9); SC.audio.sfx('leap'); }`);
rep("  function perfectDodge() {", `  // on the boots: one knee up, off hand out for balance, the hook held low and back
  const HOVP = { spine: [0.15, 0, 0], chest: [0.1, 0.25, 0], head: [-0.15, -0.2, 0], shR: [0.5, 0, -0.5], elR: [-0.4, 0, 0], shL: [-0.6, 0, 0.9], elL: [-0.5, 0, 0], thL: [-1.0, 0, 0.1], shnL: [1.5, 0, 0], thR: [0.15, 0, -0.08], shnR: [0.35, 0, 0], ftR: [0.6, 0, 0], sc1: [0.3, 0, 0], y: 0 };
  function bootSlam() {
    FX.ring(pl.pos, 0x7ad9ff, 0.4, 3.6, 0.4); FX.puff(pl.pos, 7, 1.3); FX.light(pl.pos, 0x7ad9ff, 80, 0.35); SC.cam.shake(0.7); SC.audio.sfx('slam'); let n = 0;
    for (const e of E) { if (!e.hittable() || Math.abs(e.pos.y - pl.pos.y) > 1.9) continue; const ex = e.pos.x - pl.pos.x, ez = e.pos.z - pl.pos.z, d = Math.hypot(ex, ez); if (d < 2.9 + e.r) { e.hit(24 * (1 + pl.meter / T.meter * 0.5), ex / (d || 1), ez / (d || 1), { heavy: true, named: true }); n++; } }
    if (n) { _a.copy(pl.pos); _a.y += 2.6; FX.word('LIFT ZERO!', _a, '#7ad9ff', 1.3); SC.time.hitstop = 0.12; pl.gain(10); }
  }
  function perfectDodge() {`);
rep("      case 'power': updatePower(dt); break;", `      case 'air': {
        const sp = T.playerSpeed * 0.95 * mag, kk = Math.min(1, dt * 6), hov = inp.hold.y && pl.airFuel > 0 && pl.jv <= 2.7 && !pl.diving;
        if (pl.diving) { pl.vel.set(pl.ddx, 0, pl.ddz); pl.pose = P.attack(4, 0.14); pl.poseRate = 30; }
        else { pl.vel.x += (mx / (mag || 1) * sp - pl.vel.x) * kk; pl.vel.z += (mz / (mag || 1) * sp - pl.vel.z) * kk; if (mag > 0.08) pl.yaw = SC.dampAng(pl.yaw, Math.atan2(mx, mz), T.turnRate, dt);
          if (hov) { pl.jv += ((pl.lift < 5.6 ? 2.6 : 0) - pl.jv) * Math.min(1, dt * 8); pl.airFuel -= dt; if (((pl.st * 30) | 0) % 2 === 0) { _a.copy(pl.pos); _a.y += pl.lift - 0.1; FX.burst(_a, 0x7ad9ff, 0.5); } } else pl.jv -= 22 * dt;
          pl.pose = pl.jv > 2 ? SC.mixPose(HOVP, P.leap, 0.35) : Object.assign({}, HOVP, { y: Math.sin(pl.t * 4) * 0.06 }); pl.poseRate = 14; if (pl.airSw > 0) { pl.airSw -= dt; pl.pose = P.attack(4, 0.22); pl.poseRate = 44; }
          // in the air the hook hauls a man up to him, and the next cut is made up there
          const hl = pl.hauled && alive(pl.hauled) && pl.t - pl.haulT < 1.4 && SC.dist2(pl.hauled.pos.x, pl.hauled.pos.z, pl.pos.x, pl.pos.z) < 3.2 ? pl.hauled : null;
          if (wantHook && !(pl.hookCd > 0)) { inp.clear('hook'); const fx = Math.sin(pl.yaw), fz = Math.cos(pl.yaw), t = pickTarget(13, -0.3, fx, fz);
            if (t && !t.K.armor) { pl.hookCd = 1.6; for (let k = 1; k < 8; k++) { _a.set(SC.lerp(pl.pos.x, t.pos.x, k / 8), SC.lerp(pl.pos.y + pl.lift + 1.2, t.pos.y + 1.2, k / 8), SC.lerp(pl.pos.z, t.pos.z, k / 8)); FX.burst(_a, 0xffd23a, 0.4); }
              const ex = t.pos.x - pl.pos.x, ez = t.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 1; pl.yaw = Math.atan2(ex, ez); t.pos.set(pl.pos.x + ex / d * 1.35, pl.pos.y + Math.max(0.5, pl.lift - 0.45), pl.pos.z + ez / d * 1.35); t.vel.set(0, 0, 0); t.vy = 5; t.onGround = false; t.hit(6, 0, 0, { named: true, quiet: true }); if (alive(t)) { t.state = 'hurt'; t.st = 0; }
              pl.hauled = t; pl.haulT = pl.t; pl.airFuel = Math.min(3.4, pl.airFuel + 0.9); pl.jv = Math.max(pl.jv, 1.2); _a.copy(pl.pos); _a.y += pl.lift + 2.4; FX.word('UP HERE.', _a, '#ffd23a', 1.1); SC.audio.sfx('chainYank'); SC.cam.shake(0.3); SC.time.hitstop = 0.06; }
            else { pl.hookCd = 0.6; _a.copy(pl.pos); _a.y += pl.lift + 2.2; FX.word(t ? 'TOO HEAVY' : 'LINE OUT', _a, '#dfe6ff', 0.7); } }
          else if (wantAtk && hl) { inp.clear('attack'); const ex = hl.pos.x - pl.pos.x, ez = hl.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 1; pl.yaw = Math.atan2(ex, ez); pl.airSw = 0.26; _a.copy(hl.pos); _a.y += 1.2; FX.slash(_a, pl.yaw + 0.6, 0xffd23a, 4, 0.5); FX.slash(_a, pl.yaw - 0.5, 0xffffff, 3.2, -0.4); FX.burst(_a, 0xffffff, 2);
            hl.hit(36 * (1 + pl.meter / T.meter * 0.5), ex / d, ez / d, { heavy: true, named: true }); if (alive(hl)) { hl.vy = -11; } _a.y += 1; FX.word('STRUCK DOWN.', _a, '#ff7a2e', 1.3); SC.time.hitstop = 0.13; SC.cam.shake(0.7); pl.gain(6); pl.jv = 3.2; pl.hauled = null; }
          else if (wantAtk || wantKick || wantBoot) { inp.clear('attack'); inp.clear('kick'); inp.clear('boots'); let dx = mag > 0.3 ? mx / mag : Math.sin(pl.yaw), dz = mag > 0.3 ? mz / mag : Math.cos(pl.yaw); const t = pickTarget(11, 0.2, dx, dz);
            let tm = 0.24, v = 9; if (t) { const ex = t.pos.x - pl.pos.x, ez = t.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 1; dx = ex / d; dz = ez / d; tm = SC.clamp(d / 24, 0.18, 0.5); v = Math.max(0, d - t.r - 0.7) / tm; }
            pl.ddx = dx * v; pl.ddz = dz * v; pl.jv = -Math.max(0.2, pl.lift) / tm; pl.yaw = Math.atan2(dx, dz); pl.diving = 1; SC.emit('speedlines', 0.5); SC.audio.sfx('whoosh', 2); } }
        pl.lift += pl.jv * dt; if (pl.lift > 1.1) pl.inv = Math.max(pl.inv, 0.1);
        if (pl.lift <= 0 && pl.jv < 0) { pl.lift = 0; pl.vel.multiplyScalar(0.2); if (pl.diving) { bootSlam(); pl.bootCd = 2; } else FX.puff(pl.pos, 3, 0.8); pl.diving = 0; pl.setState('idle'); }
        break; }
      case 'power': updatePower(dt); break;`);
/* the chain enders */
rep("const DMG = [14, 17, 19, 22, 34, 26];", "const DMG = [12, 14, 16, 24, 34, 28, 26, 28, 42];");
rep("{ dur: 0.62, hit: 0.2, chain: 0.5 }, { dur: 0.56, hit: 0.2, chain: 0.4 }];", "{ dur: 0.62, hit: 0.2, chain: 0.5 }, { dur: 0.56, hit: 0.2, chain: 0.4 }, { dur: 0.5, hit: 0.16, chain: 0.34 }, { dur: 0.6, hit: 0.2, chain: 0.42 }, { dur: 0.78, hit: 0.36, chain: 0.6 }];");
rep("    if (i === 5) { const sw", `    if (i === 6) { const Uw = Object.assign({}, A2w, { y: -0.42, thL: [-1.2, 0, 0.1], shnL: [1.6, 0, 0], thR: [-0.9, 0, -0.1], shnR: [1.5, 0, 0], spine: [0.5, 0.3, 0], shR: [0.3, 0, 1.0], elR: [-0.4, 0, 0] }), Us = Object.assign({}, A2s, { shR: [-3.05, 0, -0.35], elR: [-0.05, 0, 0], spine: [-0.4, -0.3, 0], chest: [-0.3, -0.5, 0], head: [0.4, 1.0, 0], y: 0.26, thL: [-0.15, 0, 0.1], shnL: [0.15, 0, 0], thR: [0.35, 0, -0.1], shnR: [0.2, 0, 0], ftR: [0.7, 0, 0], ftL: [0.7, 0, 0] }); return clip([[0, g], [0.09, Uw], [0.17, Us], [0.32, Us], [0.5, g]], t); }
    if (i === 7) { const Hw = Object.assign({}, A1s, { shR: [-1.5, 0, -0.15], elR: [-0.05, 0, 0], hips: [0, 0.3, 0], spine: [0.55, 0.2, 0], y: -0.32 }), Hs = Object.assign({}, A1w, { hips: [0, -2.4, 0], shR: [-1.2, 0, -1.3], elR: [-1.9, 0, 0], chest: [-0.1, -0.8, 0], head: [0, 1.9, 0], y: -0.2 }); return clip([[0, g], [0.1, Hw], [0.2, Hw], [0.3, Hs], [0.44, Hs], [0.6, g]], t); }
    if (i === 8) return clip([[0, g], [0.14, A3w], [0.3, A3w], [0.4, A3s], [0.58, A3s], [0.78, g]], t);
    if (i === 5) { const sw`);
rep("heavy = i === 4, wide = i === 5, blunt = i === 2 || i === 3,", "heavy = i === 4 || i === 8, wide = i === 5, up = i === 6, haul = i === 7, bell = i === 8, blunt = i === 2 || i === 3,");
rep("reach = wide ? 3.2 : heavy ? 2.6 :", "reach = wide ? 3.2 : haul ? 3.4 : bell ? 3.3 : heavy ? 2.6 :");
rep("minDot = wide ? -1.1 : heavy ? -0.25 : 0.2,", "minDot = wide || bell ? -1.1 : haul ? -0.1 : heavy ? -0.25 : 0.2,");
rep("{ heavy: heavy || i === 3 || wide || rip, named: blunt || wide || rip, combo: i });", "{ heavy: heavy || i === 3 || wide || rip || up || haul, named: blunt || wide || rip || up || haul || bell, combo: i }); if (haul && !e.K.armor && e.state !== 'dead') { e.pos.x = pl.pos.x - Math.sin(pl.yaw) * 1.9; e.pos.z = pl.pos.z - Math.cos(pl.yaw) * 1.9; e.vel.set(0, 0, 0); } if ((up || haul || bell) && hits === 0) { _c.copy(pl.pos); _c.y += 2.9; FX.word(up ? 'UP THE SHAFT!' : haul ? 'THE HAUL!' : 'LAST BELL!', _c, '#ffd23a', 1.25); if (bell) { FX.ring(pl.pos, 0xffd23a, 0.5, 3.8, 0.4); SC.cam.shake(0.8); } }");
rep("        if (pl.state === 'attack') { pl.pose = P.attack(pl.combo, pl.st); pl.poseRate = 42; }", "        if (pl.state === 'attack') { pl.pose = P.attack(pl.combo, pl.st); pl.poseRate = 42; pl.lift = pl.combo === 8 ? Math.sin(SC.clamp(pl.st / 0.4, 0, 1) * Math.PI) * 1.5 : pl.combo === 6 ? Math.sin(SC.clamp((pl.st - 0.12) / 0.3, 0, 1) * Math.PI) * 0.5 : 0; } else if (pl.state !== 'power') pl.lift = 0;");
/* fury is earned */
rep("U.showHud(true); pl.meter = SC.T.meter;", "U.showHud(true); pl.meter = Math.max(pl.meter, 25);");
rep("pl.gain(heavy ? 12 : 8)", "pl.gain(heavy || i >= 5 ? 5 : 2.6)");
rep("pl.meter = d.path ? 68 : 0;", "pl.meter = 0;");

/* ---- v0.34: bodies are no longer made of bricks: every block has turned edges and smooth shading ---- */
rep("    const g = new THREE.BoxGeometry(w, h, d), p = g.attributes.position;\n    top = top === undefined ? 1 : top; bot = bot === undefined ? 1 : bot;", `    const mn = Math.min(w, h, d), r = mn < 0.045 ? 0 : Math.min(0.075, mn * 0.32), g = r ? new THREE.BoxGeometry(w, h, d, 3, 3, 3) : new THREE.BoxGeometry(w, h, d), p = g.attributes.position, nn = g.attributes.normal;
    top = top === undefined ? 1 : top; bot = bot === undefined ? 1 : bot;
    if (r) { for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), cx = Math.max(-(w / 2 - r), Math.min(w / 2 - r, x)), cy = Math.max(-(h / 2 - r), Math.min(h / 2 - r, y)), cz = Math.max(-(d / 2 - r), Math.min(d / 2 - r, z)), dx = x - cx, dy = y - cy, dz = z - cz, L = Math.hypot(dx, dy, dz); if (L > 1e-6) { p.setXYZ(i, cx + dx / L * r, cy + dy / L * r, cz + dz / L * r); nn.setXYZ(i, dx / L, dy / L, dz / L); } }
      for (let i = 0; i < p.count; i++) { const k = p.getY(i) > 0 ? top : bot; p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } return g; }`);
rep("function limb(rt, rb, h) { const g = new THREE.CylinderGeometry(rt, rb, h, 7); return g; }", "function limb(rt, rb, h) { const g = new THREE.CylinderGeometry(rt, rb, h, 12); return g; }");
/* ---- v0.35: the hook is a thing you can see; a held strike is three heavy blows; rage cuts in mid-fight ---- */
between("  function useHook(mx, mz, mag) {", "  function startBoots(mx, mz, mag) {", `  const HKs = { hips: [0, 0.5, 0], spine: [0.15, 0.2, 0], chest: [0.1, 0.5, 0], head: [0, -0.6, 0], shR: [-1.6, 0, 0.1], elR: [-0.05, 0, 0], shL: [0.5, 0, 0.5], elL: [-1.2, 0, 0], thL: [-0.7, 0, 0.1], shnL: [0.8, 0, 0], thR: [0.5, 0, -0.1], shnR: [0.3, 0, 0], sc1: [-0.4, 0, 0], y: -0.16 };
  const HKp = { hips: [0, -0.5, 0], spine: [-0.2, -0.2, 0], chest: [-0.15, -0.4, 0], head: [0, 0.6, 0], shR: [-0.6, 0, -0.4], elR: [-1.9, 0, 0], shL: [-1.2, 0, 0.3], elL: [-0.9, 0, 0], thL: [0.3, 0, 0.1], shnL: [0.3, 0, 0], thR: [-0.5, 0, -0.1], shnR: [0.9, 0, 0], sc1: [-1.2, 0, 0], y: -0.22 };
  let hookMesh = null; const _up = new THREE.Vector3(0, 1, 0), _hd = new THREE.Vector3();
  function hookLine(ax, ay, az, bx, by, bz) {
    if (!hookMesh) { hookMesh = new THREE.Group(); const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 6), new THREE.MeshBasicMaterial({ color: 0xffd23a, fog: false })), ink = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1, 6), new THREE.MeshBasicMaterial({ color: 0x07070d, fog: false, side: THREE.BackSide })), head = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 5, 10, 4.4), new THREE.MeshBasicMaterial({ color: 0xf2f4ff, fog: false })), hi = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.1, 5, 10, 4.4), new THREE.MeshBasicMaterial({ color: 0x07070d, fog: false, side: THREE.BackSide }));
      hookMesh.add(rope, ink, head, hi); hookMesh.userData = { rope, ink, head, hi }; SC.gfx.scene.add(hookMesh); SC.hookMesh = hookMesh; }
    const u = hookMesh.userData, len = Math.max(0.05, Math.hypot(bx - ax, by - ay, bz - az)); _hd.set(bx - ax, by - ay, bz - az).divideScalar(len);
    hookMesh.visible = true; hookMesh.position.set(0, 0, 0);
    [u.rope, u.ink].forEach(m => { m.position.set((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2); m.scale.set(1, len, 1); m.quaternion.setFromUnitVectors(_up, _hd); });
    [u.head, u.hi].forEach(m => { m.position.set(bx, by, bz); m.quaternion.setFromUnitVectors(_up, _hd); m.rotateY(pl.st * 30); });
  }
  /* the hook on the rigging line: thrown, seen, and then somebody moves. An ordinary guard comes to him; he goes to a big one; with nobody on it, it bites the ground and takes him there. He arrives with the ram. */
  function useHook(mx, mz, mag) {
    let dx = mag > 0.3 ? mx / mag : Math.sin(pl.yaw), dz = mag > 0.3 ? mz / mag : Math.cos(pl.yaw); const t = pickTarget(15, -0.35, dx, dz);
    if (t) { const ex = t.pos.x - pl.pos.x, ez = t.pos.z - pl.pos.z, d = Math.hypot(ex, ez) || 1; dx = ex / d; dz = ez / d; }
    pl.hookCd = t ? 2.5 : 1.2; pl.yaw = Math.atan2(dx, dz); pl.setState('hook'); pl.inv = Math.max(pl.inv, 0.3); pl.hk = { t, dx, dz, tx: pl.pos.x + dx * 6.5, tz: pl.pos.z + dz * 6.5, done: 0 };
    SC.audio.sfx('chainThrow'); SC.emit('speedlines', 0.3);
  }
  function updateHook() {
    const h = pl.hk, T1 = 0.17, T2 = 0.4, t = h.t && alive(h.t) ? h.t : null; pl.vel.set(0, 0, 0);
    const bx = t ? t.pos.x : h.tx, bz = t ? t.pos.z : h.tz, by = pl.pos.y + (t ? 1.2 : 0.15), ax = pl.pos.x + h.dx * 0.5, az = pl.pos.z + h.dz * 0.5, ay = pl.pos.y + 1.35, k = SC.clamp(pl.st / T1, 0, 1);
    hookLine(ax, ay, az, ax + (bx - ax) * k, ay + (by - ay) * k + Math.sin(k * Math.PI) * 0.5, az + (bz - az) * k);
    pl.pose = pl.st < T1 ? HKs : HKp; pl.poseRate = 34;
    if (pl.st >= T1 && !h.done) { h.done = 1; _a.set(bx, by, bz); FX.burst(_a, 0xffffff, 1.6); FX.ring(_a.setY(pl.pos.y + 0.07), 0xffd23a, 0.2, 1.8, 0.3); _a.copy(pl.pos); _a.y += 2.5; FX.word('HOOK LINE!', _a, '#ffd23a', 1.1); SC.audio.sfx('chainYank'); SC.cam.shake(0.4); SC.time.hitstop = 0.06;
      h.px = pl.pos.x; h.pz = pl.pos.z;
      if (t && !t.K.armor) { h.mode = 1; h.ex = t.pos.x; h.ez = t.pos.z; t.hit(5, 0, 0, { named: true, quiet: true }); }
      else { h.mode = 2; const d = t ? Math.max(0, Math.hypot(t.pos.x - pl.pos.x, t.pos.z - pl.pos.z) - t.r - 1.2) : 5; h.gx = pl.pos.x + h.dx * d; h.gz = pl.pos.z + h.dz * d; } }
    if (h.done) { const q = SC.smooth(SC.clamp((pl.st - T1) / (T2 - T1), 0, 1));
      if (h.mode === 1 && t) { t.pos.x = SC.lerp(h.ex, pl.pos.x + h.dx * 1.6, q); t.pos.z = SC.lerp(h.ez, pl.pos.z + h.dz * 1.6, q); t.vel.set(0, 0, 0); }
      else if (h.mode === 2) { const wx = SC.lerp(h.px, h.gx, q), wz = SC.lerp(h.pz, h.gz, q), mvx = wx - pl.pos.x, mvz = wz - pl.pos.z, md = Math.hypot(mvx, mvz), nn = Math.max(1, Math.ceil(md / 0.28)); if (!h.stop && (mvx * h.dx + mvz * h.dz) > 0) for (let i = 0; i < nn; i++) { const ox = pl.pos.x, oz = pl.pos.z; pl.pos.x += mvx / nn; pl.pos.z += mvz / nn; W.collide(pl.pos, pl.r, pl.pos.y, pl.h); if (Math.hypot(pl.pos.x - ox, pl.pos.z - oz) < md / nn * 0.45) { h.stop = 1; break; } } pl.inv = Math.max(pl.inv, 0.1); if (((pl.st * 40) | 0) % 2 === 0) FX.puff(pl.pos, 1, 0.6); } }
    if (pl.st >= T2) { hookMesh.visible = false; startAttack(2, h.dx, h.dz, 1); }
  }
`);
rep("      case 'air': {", "      case 'hook': updateHook(); break;\n      case 'air': {");
/* a held strike: three heavy blows, one after another, for as long as it is held */
rep("startAttack([6, 5, 7, 8][pl.combo], mx, mz, mag); }", "startAttack(6, mx, mz, mag); }");
rep("        if (pl.queued && pl.st >= A.chain && pl.combo < 4) startAttack(pl.combo + 1, mx, mz, mag);", "        if (pl.heldHeavy && inp.hold.a && (pl.combo === 6 || pl.combo === 7) && pl.st >= A.chain) startAttack(pl.combo + 1, mx, mz, mag);\n        else if (pl.queued && pl.st >= A.chain && pl.combo < 4) startAttack(pl.combo + 1, mx, mz, mag);");
rep("startAttack(hc === 0 ? 6 : hc === 1 ? 5 : hc === 2 ? 7 : hc === 3 ? 8 : 3, mx, mz, mag); }", "startAttack(hc === 3 ? 5 : 3, mx, mz, mag); }");
/* rage, cutting in: a band across the picture with his eyes and a word. The fight slows; it does not stop. */
rep("#mem.hide{display:none}", "#mem.hide{display:none}\n#cut{position:absolute;left:-12%;right:-12%;top:28%;height:36%;z-index:55;pointer-events:none;transform:rotate(-6deg) translateX(-125%);background:linear-gradient(90deg,#07070d,#7a1a1f 28%,#c8421a 68%,#07070d);border-top:4px solid var(--yel);border-bottom:4px solid var(--yel);overflow:hidden;box-shadow:0 0 0 3px var(--ink)}\n#tally{position:absolute;right:5%;top:14%;z-index:56;pointer-events:none;display:none;font:italic 900 clamp(22px,15vh,84px)/.9 var(--sfx);-webkit-text-stroke:7px var(--ink);paint-order:stroke fill;transform:rotate(-7deg);text-align:right}#tally.on{display:block;animation:tallyin .16s cubic-bezier(.2,1.6,.4,1)}#tally.big{right:auto;left:50%;top:18%;transform:translateX(-50%) rotate(-5deg);font-size:clamp(34px,26vh,150px)}#tally.big.on{animation:tallybig .3s cubic-bezier(.2,1.6,.4,1)}@keyframes tallyin{0%{transform:rotate(-7deg) scale(1.9)}100%{transform:rotate(-7deg) scale(1)}}@keyframes tallybig{0%{transform:translateX(-50%) rotate(-5deg) scale(2.4)}100%{transform:translateX(-50%) rotate(-5deg) scale(1)}}\n#cut.on{animation:cutin .95s cubic-bezier(.2,.9,.2,1) both}\n@keyframes cutin{0%{transform:rotate(-6deg) translateX(-125%)}16%{transform:rotate(-6deg) translateX(0)}80%{transform:rotate(-6deg) translateX(0)}100%{transform:rotate(-6deg) translateX(125%)}}\n#cut:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(100deg,rgba(255,210,58,.22) 0 3px,transparent 3px 26px)}\n#cut .ce{position:absolute;left:12%;top:0;bottom:0;width:40%;background:50% 27%/300% auto no-repeat;image-rendering:pixelated}\n#cut .cn{position:absolute;right:16%;top:44%;transform:translateY(-50%);font:italic 900 clamp(20px,11vh,60px)/.9 var(--sfx);color:var(--yel);-webkit-text-stroke:6px var(--ink);paint-order:stroke fill;text-align:right;white-space:nowrap}\n#cut .cs{position:absolute;right:16%;bottom:10%;font:700 clamp(9px,3vh,15px)/1 var(--hand);color:#fff;text-transform:uppercase;letter-spacing:.08em}", true);
rep("U.blocking = () => !!(U.dlg || U.pg || U.menuOpen || U.mem);", `U.blocking = () => !!(U.dlg || U.pg || U.menuOpen || U.mem);
  U.tally = function (w, n) { let el = $('tally'); if (!el) { el = document.createElement('div'); el.id = 'tally'; $('mem').parentNode.appendChild(el); } if (!w) { el.className = ''; return; } el.textContent = w; el.className = n >= 10 ? 'on big' : 'on'; el.style.color = n >= 10 ? '#ffd23a' : n > 6 ? '#ff7a2e' : '#ffffff'; el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; };
  U.cut = function (name, sub, force) {
    const t = performance.now(); if (U.blocking() || SC.state !== 'play' || (!force && t - (U.cutAt || 0) < 5000)) return false; U.cutAt = t;
    let el = $('cut'); if (!el) { el = document.createElement('div'); el.id = 'cut'; $('mem').parentNode.appendChild(el); }
    el.innerHTML = '<div class="ce" style="background-image:url(' + U.pic('hero', 'angry') + ')"></div><div class="cn">' + name + '</div><div class="cs">' + (sub || '') + '</div>';
    el.classList.remove('on'); void el.offsetWidth; el.classList.add('on'); SC.slowmo(0.22, 0.8); SC.audio.sfx('path'); SC.emit('flash', '#ff5a1f'); U.cuts = (U.cuts || 0) + 1; return true;
  };
  { let kt = [], last = 0; SC.on('kill', () => { const t = performance.now(); kt = kt.filter(x => t - x < 4500); kt.push(t); if (kt.length >= 3 && t - last > 9000) { last = t; kt = []; if (U.cut('BALANCED', 'THREE LINES STRUCK')) SC.player.gain(15); } }); }`);
rep("if (pl.cnt >= 11) { pl.cnt = 0; pl.gain(35);", "if (pl.cnt >= 11) { pl.cnt = 0; pl.gain(22); SC.ui.cut('LINE STRUCK', 'ELEVEN, COUNTED', true);");
rep("SC.audio.sfx('perfect'); SC.emit('speedlines', 0.8);", "SC.audio.sfx('perfect'); SC.emit('speedlines', 0.8); SC.ui.cut('THE TURN', 'NEVER GIVE GROUND');");
rep("if (bell) { FX.ring(pl.pos, 0xffd23a, 0.5, 3.8, 0.4); SC.cam.shake(0.8); }", "if (bell) { FX.ring(pl.pos, 0xffd23a, 0.5, 3.8, 0.4); SC.cam.shake(0.8); if (pl.heldHeavy) SC.ui.cut('LAST BELL', 'FOR HER', true); }");

/* ---- v0.40: ELEVEN is a sequence, not a jump. The world all but stops; ten cuts through everyone in reach, counted, left hanging in the air; the eleventh from above. ---- */
rep("      case 'power': updatePower(dt); break;", "      case 'power': updatePower(dt, rdt); break;");
rep("  function updatePower(dt) {", "  function updatePower(dt, rdt) {");
between("      const up = 0.4;\n", "    } else if (pw.id === 'shade') {", `      if (!pw.init) { pw.init = 1; pw.t = 0; pw.n = 0; pw.next = 0.5; pw.pk = 0; pw.c = pl.pos.clone(); pw.ts = E.filter(e => e.hittable() && Math.abs(e.pos.y - pl.pos.y) < 2.4 && SC.dist2(e.pos.x, e.pos.z, pl.pos.x, pl.pos.z) < 9.5);
        if (pw.ts.length) { let sx = 0, sz = 0; pw.ts.forEach(e => { sx += e.pos.x; sz += e.pos.z; }); pw.c.x = (pw.c.x + sx) / (pw.ts.length + 1); pw.c.z = (pw.c.z + sz) / (pw.ts.length + 1); }
        SC.slowmo(0.07, 4); SC.emit('letterbox', true); SC.ui.showHud(false); SC.cam.lock = null; const c = pl.pos; SC.cam.move(v3(c.x + Math.sin(pl.yaw) * 2.6 + 1.2, c.y + 0.9, c.z + Math.cos(pl.yaw) * 2.6), v3(c.x, c.y + 1.35, c.z), v3(c.x + Math.sin(pl.yaw) * 2.1 + 1.0, c.y + 1.0, c.z + Math.cos(pl.yaw) * 2.1), v3(c.x, c.y + 1.4, c.z), 0.5, 40); SC.audio.sfx('roar'); SC.emit('speedlines', 1); }
      pw.t += rdt || dt; const st2 = pw.t; pl.inv = Math.max(pl.inv, 0.5); pl.vel.set(0, 0, 0);
      if (st2 < 0.5) { // the breath before: he sinks, the hook comes back, the gold draws in
        pl.pose = SC.mixPose(P.slamDown, P.attack(0, 0.06), SC.clamp(st2 / 0.5, 0, 1)); pl.poseRate = 600; pl.lift = 0;
        if (((st2 * 40) | 0) !== pw.rk) { pw.rk = (st2 * 40) | 0; FX.ring(pl.pos, pw.rk % 2 ? 0xffd23a : 0xffffff, 3.2 - st2 * 5.5, 0.3, 0.02); } }
      else if (pw.n < 10) {
        if (!pw.wide) { pw.wide = 1; const c = pw.c; SC.cam.move(v3(c.x + 6.2, c.y + 5.4, c.z + 7.4), v3(c.x, c.y + 1, c.z), v3(c.x + 4.6, c.y + 4.2, c.z + 8.6), v3(c.x, c.y + 1.1, c.z), 1.6, 50); }
        if (st2 >= pw.next) { const ts = pw.ts.filter(e => e.state !== 'dead' && !e.gone), t = ts.length ? ts[pw.n % ts.length] : null, a = pw.n * 2.513 + 0.7, cx = t ? t.pos.x : pw.c.x, cz = t ? t.pos.z : pw.c.z, r = (t ? t.r : 0) + 1.7;
          _b.copy(pl.pos); _b.y += 1.1; FX.burst(_b, 0xffd23a, 1.3); FX.puff(pl.pos, 2, 0.9);
          const ox = pl.pos.x, oz = pl.pos.z; pl.pos.x = cx + Math.cos(a) * r; pl.pos.z = cz + Math.sin(a) * r; W.collide(pl.pos, pl.r, pl.pos.y, pl.h); pl.yaw = Math.atan2(ox - pl.pos.x, oz - pl.pos.z) + Math.PI;
          _c.set(cx, pl.pos.y + 1.25, cz); FX.slash(_c, Math.atan2(pl.pos.x - ox, pl.pos.z - oz), pw.n % 2 ? 0xffffff : 0xffc23a, 4.4, (pw.n % 3 - 1) * 0.9); FX.burst(_c, 0xffffff, 1.3);
          for (let k = 1; k < 5; k += 2) { _b.set(ox + (pl.pos.x - ox) * k / 5, pl.pos.y + 1.1, oz + (pl.pos.z - oz) * k / 5); FX.burst(_b, pw.n % 2 ? 0xffe9a0 : 0xffc23a, 0.6); }
          if (t) t.hit(8, 0, 0, { quiet: true, power: true });
          SC.ui.tally(['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'][pw.n], pw.n);
          SC.audio.sfx('whoosh', pw.n % 3); SC.cam.shake(0.22 + pw.n * 0.05); if (pw.n === 9) SC.emit('flash', '#ffffff'); pw.n++; pw.pk = pw.n % 3; pw.next = st2 + Math.max(0.07, 0.17 - pw.n * 0.011); }
        pl.pose = P.attack(pw.pk === 0 ? 0 : pw.pk === 1 ? 1 : 5, 0.2); pl.poseRate = 600; pl.lift = 0; }
      else { // the eleventh
        if (!pw.up) { pw.up = st2 + 0.12; const ts = pw.ts.filter(e => e.state !== 'dead' && !e.gone); let bx = pw.c.x, bz = pw.c.z; if (ts.length) { bx = 0; bz = 0; ts.forEach(e => { bx += e.pos.x; bz += e.pos.z; }); bx /= ts.length; bz /= ts.length; }
          pl.pos.x = bx; pl.pos.z = bz; W.collide(pl.pos, pl.r, pl.pos.y, pl.h); const c = pl.pos; SC.cam.move(v3(c.x + 2.4, c.y + 0.5, c.z + 3.2), v3(c.x, c.y + 3.6, c.z), v3(c.x + 3.4, c.y + 1.0, c.z + 4.6), v3(c.x, c.y + 1.4, c.z), 0.8, 52);
          SC.ui.tally('ELEVEN', 10); SC.audio.sfx('leap'); SC.emit('speedlines', 1); }
        const k = (st2 - pw.up) / 0.62;
        if (k < 0) { pl.pose = P.slamDown; pl.poseRate = 600; }
        else if (k < 1) { pl.lift = k < 0.7 ? Math.sin(k / 0.7 * Math.PI / 2) * 4.2 : 4.2 * (1 - (k - 0.7) / 0.3); pl.pose = k < 0.7 ? P.attack(8, 0.2) : P.attack(4, 0.2); pl.poseRate = 600; if (((st2 * 40) | 0) % 2 === 0) { _b.copy(pl.pos); _b.y += pl.lift; FX.burst(_b, 0xffd23a, 0.8); } }
        else { if (pw.step === 0) { pw.step = 1; pl.lift = 0; SC.time.slowT = 0; SC.time.slowK = 1; emberImpact(); SC.emit('flash', '#ffffff'); SC.time.hitstop = 0.18; SC.cam.shake(1.3); FX.ring(pl.pos, 0xffffff, 0.6, 9, 0.6); FX.light(pl.pos, 0xffd23a, 220, 0.7); } pl.pose = P.slamDown; pl.poseRate = 45; }
        if (st2 - pw.up > 1.5) { SC.ui.tally(null); SC.emit('letterbox', false); SC.ui.showHud(true); SC.cam.endCine(0.5); pl.setState('idle'); } }
`);
/* ---- dots: on a phone-sized picture they were most of the picture. They are now a faint print, and much finer. ---- */
rep("G.uDot = { value: 5 };", "G.uDot = { value: 5 }; G.uDotK = { value: 0.3 };");
rep("sh.uniforms.uDot = G.uDot; sh.uniforms.uKey = G.uKey;", "sh.uniforms.uDot = G.uDot; sh.uniforms.uDotK = G.uDotK; sh.uniforms.uKey = G.uKey;");
rep("sh.fragmentShader = 'uniform float uDot;\\nuniform vec3 uKey;\\n'", "sh.fragmentShader = 'uniform float uDot;\\nuniform float uDotK;\\nuniform vec3 uKey;\\n'");
rep("'    float scM = 1.0 - smoothstep(0.30, 0.36, scD);',", "'    float scM = mix(0.2, 1.0 - smoothstep(0.30, 0.36, scD), uDotK);',");
rep("G.uDot.value = Math.max(2.2, Math.min(w, h) * pr / 340);", "G.uDot.value = Math.max(1.6, Math.min(w, h) * pr / 560); G.uDotK.value = SC.clamp((Math.min(w, h) * pr - 500) / 2200, 0.05, 0.28);");

rep("const g0 = new THREE.SphereGeometry(1, 10, 7), p0 = g0.attributes.position;", "const g0 = new THREE.SphereGeometry(1, 18, 12), p0 = g0.attributes.position;");
/* ---- v0.45: guards arrive, they do not grow out of the floor. On the stair and the docks they drop in from above; in the valley they are simply far off when they appear. ---- */
rep("case 'spawn': { const k = Math.min(1, e.st / 0.8); m.group.scale.set(1, SC.easeOut(k), 1); pose = P.lurk(e.t); if (k >= 1) { e.state = 'chase'; e.st = 0; } e.vel.set(0, 0, 0); break; }", "case 'spawn': { const far = SC.issue === 'riser', k = far ? 1 : Math.min(1, e.st / 0.5); m.group.scale.set(1, 1, 1); if (!far) { e.drop = (1 - k) * (1 - k) * 6; pose = k < 0.85 ? P.leap : P.slamDown; rate = 30; } else pose = P.lurk(e.t); if (k >= 1) { e.drop = 0; if (!far) FX.puff(e.pos, 4, 1); e.state = 'chase'; e.st = 0; } e.vel.set(0, 0, 0); break; }");
rep("m.group.position.copy(e.pos);", "m.group.position.copy(e.pos); if (e.drop) m.group.position.y += e.drop;");
/* ---- v0.48: a bot that only mashed strike and dodged went through all three levels without being hit, and most Dock Guards died before they ever swung.
   Three light cuts killed one; now it takes five. A third guard may attack at once. Being hit does not always stop a swing that is already coming. ---- */
rep("hollow: { hp: 42, speed: 3.4,", "hollow: { hp: 96, speed: 3.6,");
rep("knifer: { hp: 30, speed: 4.9,", "knifer: { hp: 66, speed: 4.9,");
rep("bruiser: { hp: 130, speed: 2.6,", "bruiser: { hp: 240, speed: 2.7,");
rep("boss: { hp: 400, speed: 4.2,", "boss: { hp: 980, speed: 4.5,");
rep("const combat = SC.combat = { tokens: 0, maxTokens: 2, freeze: null };", "const combat = SC.combat = { tokens: 0, maxTokens: 3, freeze: null };");
rep("if (!this.K.armor || o.heavy || o.power) { this.release();", "if (this.state === 'windup' && this.st > this.K.wind * 0.5 && !o.heavy && !o.power && !this.K.armor) { /* too late to stop him: a light cut lands, and so does he */ } else if (!this.K.armor || o.heavy || o.power) { this.release();");
/* ---- v0.48: with a wall behind him the camera climbed until it was looking straight down through the rafters. It may climb a little; after that it comes in close instead ---- */
rep("      for (let i = 0; i < 5; i++) {\n        const cl = clearance(Math.min(1.25, cam.pitch + i * 0.24), cam.yaw, want);", "      for (let i = 0; i < 3; i++) {\n        const cl = clearance(Math.min(1.0, cam.pitch + i * 0.2), cam.yaw, want);");
rep("if (cl >= Math.min(want, 3.3)) { lift = i * 0.24; best = cl; break; }\n        if (cl > best + 0.25) { best = cl; lift = i * 0.24; }", "if (cl >= Math.min(want, 3.0)) { lift = i * 0.2; best = cl; break; }\n        if (cl > best + 0.25) { best = cl; lift = i * 0.2; }");
rep("const pitch = Math.min(1.3, cam.pitch + cam.lift), cp = Math.cos(pitch);", "const pitch = Math.min(1.05, cam.pitch + cam.lift), cp = Math.cos(pitch);");
/* ---- the guard fights back with more than one idea ---- */
rep("          e.token = true; combat.tokens++; e.state = 'windup'; e.st = 0; alert(e);\n        }", `          e.token = true; combat.tokens++; e.state = 'windup'; e.st = 0; alert(e);
          if (e.kind !== 'boss') e.sub = Math.random() < (e.kind === 'knifer' ? 0.45 : e.kind === 'bruiser' ? 0.22 : 0.3) ? 1 : 0;      // a second blow straight after the first
        }
        // the Stair Blade steps out of a cut and comes straight back in
        if (e.state === 'chase' && e.kind === 'knifer' && pl.state === 'attack' && pl.st < 0.07 && d < 2.7 && (e.hopCd || 0) <= 0 && Math.random() < 0.5) { const f = fwd(e.yaw, _a); e.vel.set(-f.x * 12 + f.z * e.strafe * 5, 0, -f.z * 12 - f.x * e.strafe * 5); e.hopCd = 2.2; e.cool = Math.min(e.cool, 0.3); FX.puff(e.pos, 2, 0.6); _a.copy(e.pos); _a.y += 2.1; FX.word('NOTED.', _a, '#dfe6ff', 0.8); }
        e.hopCd = (e.hopCd || 0) - dt;
        // a Warden who is given room uses it: up, and down on the spot you were standing
        if (e.state === 'chase' && e.kind === 'bruiser' && playerOK && e.cool <= 0 && d > 6.5 && d < 14 && Math.abs(pl.pos.y - e.pos.y) < 0.4 && (e.leapCd || 0) <= 0 && Math.random() < dt * 0.9) { e.state = 'leap'; e.st = 0; e.lp = { step: 0, tx: pl.pos.x, tz: pl.pos.z }; e.leapCd = 7; alert(e); }
        e.leapCd = (e.leapCd || 0) - dt;`);
rep("if (e.kind === 'boss' && e.sub === 1) { e.sub = 2; e.state = 'windup'; e.st = K.wind * 0.45; alert(e); }", "if (e.sub === 1) { e.sub = 2; e.state = 'windup'; e.st = K.wind * (e.kind === 'boss' ? 0.45 : 0.35); e.struck = false; e.sw = false; alert(e); }");
rep("  const SPEAK = {", "  const SPEAK = U.SPEAK = {");
rep("SC.hitPlayer(30, e.pos.x, e.pos.z, true); } }\n    else { e.pose = P.slamDown;", "SC.hitPlayer(e.kind === 'boss' ? 30 : 16, e.pos.x, e.pos.z, true); } }\n    else { e.pose = P.slamDown;");
/* ---- he looks at who he is fighting ---- */
rep("    { const k = SC.state === 'play' ? SC.clamp((p.meter - 40) / 60, 0, 1) : 0,", `    { let best = null, bd = 81; for (const e of SC.enemies) { if (e.state === 'dead') continue; const dx = e.pos.x - p.pos.x, dz = e.pos.z - p.pos.z, d2 = dx * dx + dz * dz; if (d2 < bd) { bd = d2; best = e; } }
      const want = best && p.state !== 'scripted' && p.state !== 'dodge' ? SC.clamp(SC.angDiff(p.yaw, Math.atan2(best.pos.x - p.pos.x, best.pos.z - p.pos.z)), -1.0, 1.0) : 0; U.headY = (U.headY || 0) + (want - (U.headY || 0)) * Math.min(1, rdt * 9);
      const bn = p.model.bones; if (bn && Math.abs(U.headY) > 0.01) { bn.head.rotation.y += U.headY * 0.6; bn.neck.rotation.y += U.headY * 0.2; bn.chest.rotation.y += U.headY * 0.2; }
      // weight: he leans into a run, banks into a turn, and breathes harder the more fury he is carrying
      if (bn && (p.state === 'idle' || p.state === 'run' || p.state === 'move')) { const sp = Math.hypot(p.vel.x, p.vel.z), yr = SC.clamp(SC.angDiff(U.lastYaw === undefined ? p.yaw : U.lastYaw, p.yaw) / Math.max(rdt, 0.001), -6, 6); U.bank = (U.bank || 0) + (yr * 0.035 - (U.bank || 0)) * Math.min(1, rdt * 6);
        bn.chest.rotation.x += Math.min(0.16, sp * 0.014); bn.hips.rotation.z -= U.bank; bn.chest.rotation.z -= U.bank * 0.6; bn.head.rotation.z += U.bank * 0.8;
        const br = Math.sin(performance.now() * 0.001 * (2.2 + p.meter * 0.03)) * (0.012 + p.meter * 0.0003); bn.chest.rotation.x += br; bn.shL.rotation.z += br * 1.5; bn.shR.rotation.z -= br * 1.5; }
      // the stance: with somebody in reach of him he drops his weight and lets the hook trail low behind, edge up
      { const near = best && bd < 49 && (p.state === 'idle' || p.state === 'run'); U.stance = (U.stance || 0) + ((near ? 1 : 0) - (U.stance || 0)) * Math.min(1, rdt * 5); const k2 = U.stance; if (bn && k2 > 0.02 && p.state === 'idle') { bn.spine.rotation.x += 0.16 * k2; bn.hips.rotation.y -= 0.35 * k2; bn.chest.rotation.y += 0.2 * k2; bn.shR.rotation.x += 0.55 * k2; bn.shR.rotation.z -= 0.3 * k2; bn.elR.rotation.x += 0.5 * k2; bn.shL.rotation.x -= 0.5 * k2; bn.elL.rotation.x -= 0.7 * k2; bn.thL.rotation.x -= 0.3 * k2; bn.shnL.rotation.x += 0.45 * k2; bn.thR.rotation.x += 0.2 * k2; bn.shnR.rotation.x += 0.3 * k2; } }
      // landings are taken in the knees; on a run the hook trails
      if (bn) { if ((U.pLift || 0) > 0.3 && p.lift <= 0.02) U.sq = 1; U.pLift = p.lift; U.sq = (U.sq || 0) * Math.exp(-rdt * 7); const q = U.sq; if (q > 0.03) { bn.thL.rotation.x -= 0.7 * q; bn.shnL.rotation.x += 1.2 * q; bn.thR.rotation.x -= 0.5 * q; bn.shnR.rotation.x += 1.0 * q; bn.spine.rotation.x += 0.35 * q; bn.head.rotation.x -= 0.2 * q; }
        if (p.state === 'run') { bn.shR.rotation.x += 0.6; bn.shR.rotation.z -= 0.25; bn.elR.rotation.x += 0.3; bn.chest.rotation.y -= 0.15; } }
      // idle: he does not stand like a statue. Weight from foot to foot; and every few seconds, with nobody near, one of three habits
      if (bn && p.state === 'idle' && SC.state === 'play') { const tt = performance.now() / 1000, sw = Math.sin(tt * 0.9) * 0.05; bn.hips.rotation.z += sw; bn.spine.rotation.z -= sw * 0.7; bn.thL.rotation.z -= sw * 0.5; bn.thR.rotation.z -= sw * 0.5; bn.head.rotation.y += Math.sin(tt * 0.37) * 0.12;
        U.idleT = (U.idleT || 0) + rdt; if (best && bd < 100) U.idleT = 0; const ph = U.idleT - 3.5, cyc = ((ph % 6) + 6) % 6, wch = Math.floor(ph / 6) % 3, e2 = ph > 0 && cyc < 2.4 ? Math.sin(cyc / 2.4 * Math.PI) : 0, en = Math.min(1, e2 * 1.8);
        if (en > 0.01) { if (wch === 0) { bn.shL.rotation.x -= 0.75 * en; bn.shL.rotation.z -= 0.35 * en; bn.elL.rotation.x -= 1.75 * en; bn.head.rotation.x += 0.32 * en; bn.chest.rotation.x += 0.06 * en; }              // his hand goes to the washer
          else if (wch === 1) { bn.head.rotation.x -= 0.5 * en; bn.head.rotation.y += Math.sin(cyc * 2.2) * 0.5 * en; bn.chest.rotation.x -= 0.1 * en; bn.shR.rotation.z -= 0.15 * en; }                                             // he looks up: nine years on, the sky still gets him
          else { bn.shR.rotation.x -= 0.5 * en; bn.elR.rotation.x -= 1.0 * en; bn.haR.rotation.z += cyc / 2.4 * Math.PI * 2; bn.head.rotation.y -= 0.35 * en; bn.head.rotation.x += 0.15 * en; } } }                                    // he turns the hook over in his hand
      else U.idleT = 0;
      // air: something is always drifting in these places
      if (SC.state === 'play') { if (!U.graded) { U.graded = 1; G.renderer.domElement.style.filter = 'saturate(1.14) contrast(1.06)'; } }
      if (SC.hookMesh && p.state !== 'hook') SC.hookMesh.visible = false;
      // at rest the hook is carried point forward, not grounded: the tip was going through the floor
      if (bn && p.state === 'idle') { bn.elR.rotation.x -= 0.55 * (1 - (U.stance || 0)); bn.shR.rotation.x += 0.12; }
      // nearly down: the rage answers once
      if (SC.state === 'play') { if (p.hp > 0 && p.hp < SC.T.hp * 0.3) { if (!U.lowCut && U.cut('ON MY BREATH', 'EVERY BREATH IS HERS', true)) { U.lowCut = 1; p.gain(40); p.inv = Math.max(p.inv, 1.2); } } else if (p.hp > SC.T.hp * 0.6) U.lowCut = 0; }
      // frame time, when the game's own "Show frame time" is on: the only way to know how this runs on a real phone
      if (SC.showFps) { const ms = rdt * 1000; U.ftA = (U.ftA || ms) * 0.95 + ms * 0.05; U.ftW = Math.max((U.ftW || 0) * 0.99, ms); U.ftN = (U.ftN || 0) + 1; if (U.ftN % 20 === 0) { let el = $('ft'); if (!el) { el = document.createElement('div'); el.id = 'ft'; el.style.cssText = 'position:absolute;left:4px;bottom:4px;z-index:70;font:700 10px monospace;color:#fff;background:rgba(0,0,0,.6);padding:2px 5px;pointer-events:none'; $('mem').parentNode.appendChild(el); } const r = G.renderer.info.render; el.textContent = (1000 / U.ftA).toFixed(0) + ' fps · avg ' + U.ftA.toFixed(1) + ' ms · worst ' + U.ftW.toFixed(0) + ' ms · ' + (r.triangles / 1000).toFixed(0) + 'k tris · ' + G.renderer.domElement.width + 'x' + G.renderer.domElement.height; } }
      U.lastYaw = p.yaw; }
    { const k = SC.state === 'play' ? SC.clamp((p.meter - 40) / 60, 0, 1) : 0,`);

/* ---- v0.49: play notes on the High Docks ---- */
// a controller was being read twice: once by the game, which sends what each button means, and once by the level itself with the old game's layout
rep("gp.buttons.forEach((b, i) => { if (b.pressed && !padPrev[i] && map[i]) {", "if (SC.hosted) { const ax = dz(gp.axes[0] || 0), ay = dz(gp.axes[1] || 0); if (ax || ay) { mx = ax; my = -ay; } }\n      gp.buttons.forEach((b, i) => { if (SC.hosted && i !== 11) { padPrev[i] = b.pressed; return; } if (b.pressed && !padPrev[i] && map[i]) {");
// the right stick turns the camera even while it is locked on somebody; it goes back to them when the stick is let go
rep("if (!cam.lock) cam.yaw -= ax;", "if (!cam.lock || cam.sinceLook < 1.1) cam.yaw -= ax;");
rep("if (sep > 0.6) cam.yaw = SC.dampAng(cam.yaw, Math.atan2(dx, dz), 5.5, rdt);", "if (sep > 0.6 && cam.sinceLook > 1.1) cam.yaw = SC.dampAng(cam.yaw, Math.atan2(dx, dz), 5.5, rdt);");
// the pause menu answers the stick; with a pad in hand the corner shows what the buttons do and the prompts are his voice instead
rep("if (d.sootborn === 'in') { SC.input.ext = { x: +d.x || 0, y: +d.y || 0 };", `if (d.sootborn === 'in') {
        if (SC.ui.menuOpen) { const y = +d.y || 0; if (y && y !== SC._my) { const bs = Array.from(document.querySelectorAll('#menu .mbtn')); if (bs.length) { let i = bs.findIndex(b => b.classList.contains('y')); bs.forEach(b => b.classList.remove('y')); i = ((i < 0 ? 0 : i + (y < 0 ? 1 : -1)) + bs.length) % bs.length; bs[i].classList.add('y'); SC.audio.sfx('ui'); } } SC._my = y; } else SC._my = 0;
        if (!SC._tw) { SC._tw = 1; const U = SC.ui, t0 = U.toast; U.toast = function (s, dd) { if (typeof s === 'string' && /^TAP TO CUT|^\\*ATTACK\\* THREE TIMES/.test(s)) return; if (SC.pad && typeof s === 'string') { if (/^DRAG THE PICTURE/.test(s)) s = SC.issue === 'docks' ? 'THE SECOND BELL IS NINE MINUTES OFF. *BRAND HAS THE STAIR. I HAVE THE REST.*' : SC.issue === 'riser' ? 'FORTY PEOPLE ON A LADDER BEHIND ME. *NOBODY COMES DOWN THIS ROAD.*' : 'NINE HUNDRED STEPS. *TAVI IS ON MY LEFT.*'; else if (/^WIDE OPEN/.test(s)) s = 'HE IS OPEN. *I DO NOT LEAVE A LINE HALF STRUCK.*'; else if (/^WHEN THE FURY BAR/.test(s)) s = 'I HAVE COUNTED TO ELEVEN EVERY DAY SINCE THE DOORS CLOSED. *WHEN IT IS FULL, I HOLD THE CUT.*'; } return t0.call(U, s, dd); }; }
        if (!!d.pad !== !!SC.pad) { SC.pad = !!d.pad; let el = document.getElementById('padleg'); if (!el) { const st = document.createElement('style'); st.textContent = '#padleg{position:fixed;right:10px;bottom:8px;z-index:60;pointer-events:none;font:700 9px/17px system-ui,sans-serif;letter-spacing:.04em;color:#f3e3c3;opacity:.78;text-align:right;text-shadow:0 1px 0 #000,0 0 3px #000}#padleg b{display:inline-block;min-width:14px;height:14px;line-height:14px;border-radius:7px;padding:0 2px;margin:0 3px 0 8px;text-align:center;color:#07070d;background:#c8c8c8;text-shadow:none;font-size:8px}#padleg .x{background:#5a9af0}#padleg .y{background:#e8c23a}#padleg .a{background:#6ac85a}#padleg .b{background:#e8604a}'; document.head.appendChild(st); el = document.createElement('div'); el.id = 'padleg'; el.innerHTML = '<b class="x">X</b>CUT &middot; HELD: HEAVY, ELEVEN<b class="y">Y</b>HOOK<br><b class="a">A</b>JUMP &middot; HELD: BOOTS<b class="b">B</b>DODGE<b>RB</b>KICK<b>LB</b>LUNGE<b>RS</b>LOOK'; document.body.appendChild(el); setInterval(() => { el.style.visibility = SC.ui.blocking() || SC.state !== 'play' ? 'hidden' : 'visible'; }, 200); } el.style.display = SC.pad ? 'block' : 'none'; }
        SC.input.extL = d.lk || null; SC.input.ext = { x: +d.x || 0, y: +d.y || 0 };`);
// what a hit says: fewer of them, never the same twice running, and nothing from the old game
rep("if (o.heavy && !o.power && !o.named) { _a.y += 0.7; FX.word(SC.pick(pl.meter > 55 ? ['FOR HER!', 'EVERY BREATH!', 'LAST BELL!', 'HER NAME!'] : ['AIR OWED!', 'COUNTED!', 'SOOT!', 'BREATHE!']), _a, pl.meter > 55 ? '#ff7a2e' : '#ffe14a', 1.4); }",
    "if (o.heavy && !o.power && !o.named && pl.t - (pl.wordT || -9) > 3.2) { pl.wordT = pl.t; const pool = pl.meter > 55 ? ['FOR HER.', 'EVERY BREATH.', 'LAST BELL.', 'HER NAME.', 'ELEVEN SECONDS.', 'BALANCE THE BANK.'] : ['AIR OWED.', 'COUNTED.', 'SOOT.', 'BREATHE.', 'TIER SIX.', 'STRUCK.', 'BANK SEVEN.']; let w = SC.pick(pool); if (w === pl.wordL) w = pool[(pool.indexOf(w) + 1) % pool.length]; pl.wordL = w; _a.y += 0.7; FX.word(w, _a, pl.meter > 55 ? '#ff7a2e' : '#f3e3c3', 1.2); }");
rep("G.fx.puff(p, 5, 1); G.fx.word(SC.pick(['KRAK!', 'SMASH!', 'KRUNCH!']), p, '#ffb52e', 1.2);", "G.fx.puff(p, 5, 1);");
rep("if (heavy) { _a.y += 0.6; FX.word('KRAK!', _a, '#ff3b30', 1.5); }", "");
rep("if (pl.t - (pl.cntT || -9) > 2.8) pl.cnt = 0;", "if (pl.t - (pl.cntT || -9) > 4.2) pl.cnt = 0;");
// a run that is a run: he leans into it, the knees come up, the arms drive. The guards get a soldier's jog with the weapon carried
rep("  /* enemies shamble rather than run */", `  { const walk = P.run, cape = (o, ph, f) => { const b = Math.sin(ph * 2), w = Math.sin(ph * 2 + 1.1), c = Math.cos(ph); o.tailB = [0.34 * f + 0.2 * b * f + 0.06 * Math.sin(ph * 3.3), 0.1 * Math.sin(ph), 0]; o.tailL = [0.3 * f + 0.18 * w * f + 0.1 * c, 0, 0.16 * f + 0.06 * b]; o.tailR = [0.3 * f + 0.18 * w * f - 0.1 * c, 0, -0.16 * f - 0.06 * b]; o.sc1 = [-(1.02 - 0.1 * f) - ((o.spine ? o.spine[0] : 0) + (o.chest ? o.chest[0] : 0)) * 0.9 + 0.17 * b * f, 0.07 * Math.sin(ph), 0]; o.sc2 = [-0.22 + 0.16 * Math.sin(ph * 2 + 0.8) * f, 0.12 * c, 0]; o.sc3 = [-0.06 + 0.2 * Math.sin(ph * 2 + 1.6) * f, -0.14 * Math.sin(ph), 0]; };   // the cape hangs lower and lifts and drops with every stride; it was held out stiff behind him
    P.run = (ph, s) => { const o = walk(ph, s), a = Math.sin(ph), c = Math.cos(ph), f = SC.clamp(s, 0.25, 1.2), r = SC.clamp((s - 0.5) / 0.4, 0, 1); if (r <= 0) { cape(o, ph, f); return o; } const lean = 0.15 * f + 0.11 * r, sw = (0.85 + 0.5 * r) * f, th = 0.95 + 0.35 * r;
    o.hips = [0, -0.22 * a * f, 0]; o.spine = [lean, 0, 0]; o.chest = [0.05 * f + 0.04 * r, 0.36 * a * f, 0]; o.head = [-(lean * 0.78 + 0.04), 0, 0];
    o.shL = [sw * a * 1.1 + 0.22, 0, 0.16]; o.elL = [-1.35 - 0.2 * r + 0.5 * a, 0, 0]; o.shR = [-sw * a * 1.1 + 0.22, 0, -0.16]; o.elR = [-1.35 - 0.2 * r - 0.5 * a, 0, 0];
    o.thL = [(-th * a - 0.14 - 0.16 * r) * f, 0, 0.03]; o.shnL = [(0.22 + (1.15 + 0.7 * r) * Math.max(0, c)) * f, 0, 0]; o.thR = [(th * a - 0.14 - 0.16 * r) * f, 0, -0.03]; o.shnR = [(0.22 + (1.15 + 0.7 * r) * Math.max(0, -c)) * f, 0, 0];
    o.y = -0.05 * f - 0.05 * r + (0.045 + 0.055 * r) * Math.cos(ph * 2) * f; cape(o, ph, f); return o; };
    P.jog = (ph, s, t) => { const o = P.run(ph, Math.min(0.95, s * 0.8)), a = Math.sin(ph); o.spine = [0.2, 0, 0]; o.head = [-0.12, Math.sin(t * 0.7) * 0.12, 0]; o.shR = [-0.55 + 0.12 * a, 0, -0.16]; o.elR = [-1.15, 0, 0]; o.shL = [0.6 * a, 0, 0.16]; o.elL = [-1.2 - 0.2 * a, 0, 0]; return o; };
    { const JW = { hips: [0, -0.3, 0], spine: [0.1, -0.4, 0], chest: [0, -0.4, 0], head: [0, 0.65, 0], shR: [0.55, 0, -0.35], elR: [-1.9, 0, 0], shL: [-1.3, 0, 0.2], elL: [-0.6, 0, 0], thL: [-0.3, 0, 0.1], shnL: [0.5, 0, 0], thR: [0.25, 0, -0.1], shnR: [0.4, 0, 0], y: -0.12 }, JS = { hips: [0, 0.3, 0], spine: [0.28, 0.3, 0], chest: [0.08, 0.35, 0], head: [-0.25, -0.6, 0], shR: [-1.5, 0, 0.06], elR: [-0.05, 0, 0], shL: [0.55, 0, 0.3], elL: [-1.2, 0, 0], thL: [-0.75, 0, 0.05], shnL: [0.65, 0, 0], thR: [0.5, 0, -0.05], shnR: [0.2, 0, 0], y: -0.16 };
      P.jab = k => k < 0 ? SC.mixPose(P.lurk(0), JW, SC.smooth(SC.clamp(1 + k, 0, 1))) : SC.mixPose(JW, JS, SC.smooth(SC.clamp(k * 6, 0, 1)));
      SC.BLKP = { spine: [-0.12, 0.25, 0], chest: [-0.05, 0.2, 0], head: [0.05, -0.2, 0], shR: [-1.75, 0, 0.55], elR: [-1.25, 0, 0], shL: [-1.5, 0, -0.2], elL: [-1.3, 0, 0], thL: [-0.35, 0, 0.12], shnL: [0.55, 0, 0], thR: [0.3, 0, -0.12], shnR: [0.45, 0, 0], y: -0.1 }; } }
  /* enemies shamble rather than run */`);
rep("e.kind === 'boss' || e.kind === 'knifer' ? P.run(e.runPh, sp / K.speed) : P.shamble(e.runPh, sp / K.speed + 0.5, e.t); } else pose = e.kind === 'boss' ? P.guard(e.t) : P.lurk(e.t); }", "e.kind === 'boss' || e.kind === 'knifer' ? P.run(e.runPh, sp / K.speed) : P.jog(e.runPh, sp / K.speed + 0.25, e.t); } else { pose = P.guard(e.t); if (e.sk === undefined) e.sk = (Math.random() * 3) | 0; if (e.kind !== 'boss') { if (e.sk === 1) pose = Object.assign({}, pose, { spine: [0.1, 0.4, 0], shR: [-2.1, 0, -0.3], elR: [-0.75, 0, 0], shL: [-0.5, 0, 0.3], elL: [-1.3, 0, 0] }); else if (e.sk === 2) pose = Object.assign({}, pose, { hips: [0, 0.35, 0], spine: [0.26, -0.3, 0], shR: [0.2, 0, -0.5], elR: [-0.45, 0, 0], shL: [-1.15, 0, 0.2], elL: [-0.9, 0, 0], thL: [-0.6, 0, 0.14], shnL: [0.7, 0, 0], thR: [0.36, 0, -0.16], shnR: [0.5, 0, 0], y: -0.1 }); } } }");
rep("pl.runPh += pl.speed * dt * 1.72;", "pl.runPh += pl.speed * dt * 1.5;");
// signs: enamel plates with a rule, rivets and the Authority's sun, cut in capitals. They were flat boxes of poster lettering
between("    const t = signTex[key] || (signTex[key] = G.canvasTex(512, Math.round(512 * h / w), (g, cw, ch) => {", "    }));", `    const t = signTex[key] || (signTex[key] = G.canvasTex(1024, Math.max(48, Math.round(1024 * h / w)), (g, cw, ch) => {
      const dark = bg || '#0b0d24', u = ch / 100, rq = SC.seeded(text.length * 7 + 3);
      g.fillStyle = dark; g.fillRect(0, 0, cw, ch);
      const gr = g.createLinearGradient(0, 0, 0, ch); gr.addColorStop(0, 'rgba(255,255,255,.14)'); gr.addColorStop(0.45, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.28)'); g.fillStyle = gr; g.fillRect(0, 0, cw, ch);
      g.strokeStyle = '#07070d'; g.lineWidth = 9 * u; g.strokeRect(4.5 * u, 4.5 * u, cw - 9 * u, ch - 9 * u);
      g.strokeStyle = color; g.globalAlpha = 0.95; g.lineWidth = 2.4 * u; g.strokeRect(13 * u, 13 * u, cw - 26 * u, ch - 26 * u); g.globalAlpha = 0.5; g.lineWidth = 1.1 * u; g.strokeRect(18.5 * u, 18.5 * u, cw - 37 * u, ch - 37 * u); g.globalAlpha = 1;
      g.fillStyle = color; for (const [rx, ry] of [[24, 24], [cw / u - 24, 24], [24, 76], [cw / u - 24, 76]]) { g.beginPath(); g.arc(rx * u, ry * u, 2.4 * u, 0, 7); g.fill(); }
      const wide = cw / ch > 3.4, sun = cx => { g.fillStyle = color; g.strokeStyle = color; g.beginPath(); g.arc(cx, ch / 2, 10 * u, 0, 7); g.fill(); g.lineWidth = 2.6 * u; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.beginPath(); g.moveTo(cx + Math.cos(a) * 14 * u, ch / 2 + Math.sin(a) * 14 * u); g.lineTo(cx + Math.cos(a) * 20 * u, ch / 2 + Math.sin(a) * 20 * u); g.stroke(); } g.fillStyle = dark; g.beginPath(); g.arc(cx, ch / 2, 4.2 * u, 0, 7); g.fill(); };
      if (wide) { sun(50 * u); sun(cw - 50 * u); }
      const fs = Math.round(46 * u); g.font = '700 ' + fs + 'px Georgia, "Times New Roman", serif'; g.textAlign = 'left'; g.textBaseline = 'middle';
      const sp = fs * 0.13, ws = text.split('').map(c => g.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (text.length - 1), avail = cw - (wide ? 150 : 56) * u, sc = Math.min(1, avail / tot);
      g.save(); g.translate(cw / 2 - tot * sc / 2, ch / 2 + 2 * u); g.scale(sc, 1); let x = 0;
      for (let i = 0; i < text.length; i++) { g.fillStyle = 'rgba(0,0,0,.55)'; g.fillText(text[i], x + 1.6 * u, 2 * u); g.fillStyle = color; g.fillText(text[i], x, 0); x += ws[i] + sp; } g.restore();
      g.fillStyle = 'rgba(8,6,8,.16)'; for (let i = 0; i < 9; i++) { const sx = rq() * cw, sw = (2 + rq() * 7) * u; g.fillRect(sx, 9 * u, sw, (18 + rq() * 60) * u); }
      g.strokeStyle = 'rgba(255,255,255,.10)'; g.lineWidth = u; for (let i = 0; i < 5; i++) { const sx = rq() * cw, sy = (20 + rq() * 60) * u; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + (10 + rq() * 40) * u, sy + (rq() - 0.5) * 6 * u); g.stroke(); }
`);
// guards that are already standing their post when he gets there
rep("    const e = ENC[id]; S.enc = e; e.wave = -1; e.wait = 0.2; objective();", "    const e = ENC[id]; if (e.posted) return; S.enc = e; e.wave = -1; e.wait = 0.2; objective();");
rep("SC.clearEnemies = function () { while (E.length) E[0].remove();", "SC.clearEnemies = function () { SC.cleared = (SC.cleared || 0) + 1; while (E.length) E[0].remove();");
// the pages: his captions are ink and lamplight, not a yellow sticker, and the sound words say what the sound is
rep("#page .cp.w{background:var(--paper);border-radius:14px}", "#page .cp.w{background:#e8e0cc;color:#07070d;border-radius:10px}\n#page .cp{background:#14111a;color:#f3e3c3;border:2px solid #07070d;box-shadow:inset 0 0 0 1px rgba(232,194,90,.55),3px 3px 0 #07070d}\n#page .cp b,#page .cp em,#page .cp i{color:#ffc86a}\n#page .cp.w b,#page .cp.w em,#page .cp.w i{color:#8a2a14}\n#page .fx{font:700 clamp(13px,5vh,28px) Georgia,'Times New Roman',serif;letter-spacing:.32em;color:#f3e3c3;-webkit-text-stroke:0;text-shadow:2px 2px 0 #07070d,0 0 14px rgba(0,0,0,.85);transform:none;text-transform:uppercase}\n#obj{background:#14111a !important;color:#f3e3c3 !important;box-shadow:inset 0 0 0 1px rgba(232,194,90,.6),3px 3px 0 #07070d !important}\n#dlg.cap .box{background:#14111a;color:#f3e3c3;transform:none;border-color:#07070d;box-shadow:inset 0 0 0 1px rgba(232,194,90,.55),4px 4px 0 #07070d}\n#dlg.cap .tx b{color:#ffc86a}\n#dlg .box{background:#e8e0cc}\n#toast{left:1.6%;top:22%;translate:none;text-align:left;max-width:42%;background:rgba(14,11,20,.88);color:#f3e3c3;border:0;border-left:3px solid #e8c25a;box-shadow:none;padding:4px 10px 5px;font-size:clamp(10px,2.7vh,13px)}\n#toast b,#toast em,#toast i{color:#ffc86a}\n#goal.near i{transform:rotate(45deg) scale(.5);opacity:.5}\n#goal.near b{opacity:.55;top:9px;font-size:10px}");
// dying: they were thrown into the air already lying down and turned there until they faded. Now a man is hit, goes to his knees, and falls where he stood
rep("this.state = 'dead'; this.st = 0; this.vel.set(dx * 7, 0, dz * 7); this.vy = 5.5; this.onGround = false; this.model.face('dead');", "this.state = 'dead'; this.st = 0; this.vel.set(dx * 2.4, 0, dz * 2.4); this.vy = 0; this.model.face('dead');");
rep("this.state = 'dead'; this.st = 0; this.vel.set(0, 0, 0); this.vy = 13; this.onGround = false; this.model.face('dead'); this.wasFinished = true;", "this.state = 'dead'; this.st = 0; this.vel.set(0, 0, 0); this.vy = 2.6; this.onGround = false; this.model.face('dead'); this.wasFinished = true;");
rep("pose = P.down(); rate = 20; e.vel.multiplyScalar(Math.exp(-2.5 * dt));", "pose = e.st < 0.2 ? { spine: [-0.4, 0, 0.1], chest: [-0.2, 0, 0], head: [-0.5, 0.2, 0], shL: [-0.5, 0, 1.0], elL: [-0.4, 0, 0], shR: [-0.7, 0, -1.1], elR: [-0.3, 0, 0], thL: [0.25, 0, 0.06], shnL: [0.7, 0, 0], thR: [-0.2, 0, -0.06], shnR: [0.5, 0, 0], y: -0.1 } : e.st < 0.62 ? { spine: [0.55, 0, -0.1], chest: [0.3, 0, 0], head: [0.6, 0, 0.1], shL: [0.2, 0, 0.25], elL: [-0.2, 0, 0], shR: [0.3, 0, -0.2], elR: [-0.15, 0, 0], thL: [-0.25, 0, 0.1], shnL: [1.75, 0, 0], thR: [0.1, 0, -0.1], shnR: [1.7, 0, 0], y: -0.5 } : P.down(); rate = e.st < 0.62 ? 15 : 9; e.vel.multiplyScalar(Math.exp(-7 * dt));");
rep("const t0 = e.wasFinished ? 0.75 : 0.7;", "const t0 = 1.7;");
rep("if (e.state !== 'dead' || !e.wasFinished) physics(e, dt); else { e.vy -= T.gravity * 0.5 * dt; e.pos.y += e.vy * dt; }", "physics(e, dt);");
// down, but not out: against a boss he is on the floor longer, gets a knee under him, and says something he should not
rep("if (pl.st < 0.9) { pl.pose = P.down(); pl.poseRate = 12; }\n        else {\n          if (!pl.revived) {", "const bossUp = SC.story && SC.story.enc && SC.story.enc.id === 'boss' ? 1.5 : 0; if (pl.st < 0.9 + bossUp) { pl.pose = pl.st < 0.9 ? P.down() : { spine: [0.5, 0, 0], chest: [0.2, 0, 0], head: [-0.45, 0, 0], thL: [-1.35, 0, 0.1], shnL: [1.5, 0, 0], thR: [0.2, 0, -0.1], shnR: [1.65, 0, 0], shL: [-0.7, 0, 0.25], elL: [-0.7, 0, 0], shR: [0.35, 0, -0.3], elR: [-0.5, 0, 0], y: -0.46 }; pl.poseRate = pl.st < 0.9 ? 12 : 5; pl.inv = Math.max(pl.inv, 0.3); }\n        else {\n          if (!pl.revived) {");
rep("if (pl.st > 1.5) { pl.revived = false; pl.inv = 1.5; pl.setState('idle'); }", "if (pl.st > 1.5 + bossUp) { pl.revived = false; pl.inv = 1.5; pl.setState('idle'); }");
// the walk before the first scene is longer: the first sun is further up the causeway
rep("alley: { x: 0, y: 0, z: 34, yaw: Math.PI },", "alley: { x: 0, y: 0, z: 29.5, yaw: Math.PI },");
// while the game is in development: I'M STUCK, in the pause menu
rep("<div class=\"mbtn s\" data-go=\"c\">BACK TO THE LAST SUN</div>' + (SC.hosted ?", "<div class=\"mbtn s\" data-go=\"c\">BACK TO THE LAST SUN</div><div class=\"mbtn s\" data-go=\"u\">I AM STUCK</div><div class=\"mbtn s\" data-go=\"n\">START THIS LEVEL AGAIN</div>' + (SC.hosted ?");
rep("c: () => { closeMenu(); U.paused = false; SC.story.load(); }\n    });", "c: () => { closeMenu(); U.paused = false; SC.story.load(); }, u: () => { closeMenu(); U.paused = false; if (SC.story.unstick) SC.story.unstick(); }, n: () => { closeMenu(); U.paused = false; SC.story.newGame(); }\n    });");
// a man who hangs in the air out of reach gets something thrown at him. No guns up here: a knife, a hatchet, whatever is in the hand
rep("SC.updateEnemies = function (dt) {\n    for (let i = E.length - 1; i >= 0; i--) E[i].update(dt);", `SC.updateEnemies = function (dt) {
    for (let i = E.length - 1; i >= 0; i--) E[i].update(dt);
    { const air = pl.state === 'air' && pl.lift > 1.3 && !pl.diving; SC._airT = air ? (SC._airT || 0) + dt : 0; SC._thCd = (SC._thCd || 0) - dt;
      if (air && SC._airT > 1.0 && SC._thCd <= 0) { let th = null, bd = 17; for (const e of E) { if (e.state !== 'chase' || e.K.armor) continue; const d = SC.dist2(e.pos.x, e.pos.z, pl.pos.x, pl.pos.z); if (d < bd && d > 2.2) { bd = d; th = e; } }
        if (th) { SC._thCd = 2.2; const g = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.75), new THREE.MeshBasicMaterial({ color: 0xf0eef8 })); G.scene.add(g); (SC._shots = SC._shots || []).push({ m: g, t: 0, d: Math.max(0.4, bd / 17), x0: th.pos.x, y0: th.pos.y + 1.6, z0: th.pos.z }); th.state = 'recover'; th.st = 0; th.yaw = Math.atan2(pl.pos.x - th.pos.x, pl.pos.z - th.pos.z); _a.copy(th.pos); _a.y += th.h + 0.4; FX.word('LOOSE!', _a, '#ff3b30', 0.9); SC.audio.sfx('whoosh', 1); } }
      const S2 = SC._shots; if (S2) for (let i = S2.length - 1; i >= 0; i--) { const q = S2[i]; q.t += dt; const k = Math.min(1, q.t / q.d), tx = pl.pos.x, ty = pl.pos.y + pl.lift + 1.1, tz = pl.pos.z; q.m.position.set(q.x0 + (tx - q.x0) * k, q.y0 + (ty - q.y0) * k + Math.sin(k * Math.PI) * 0.7, q.z0 + (tz - q.z0) * k); q.m.rotation.set(q.t * 22, Math.atan2(tx - q.x0, tz - q.z0), 0);
        if (k >= 1) { G.scene.remove(q.m); S2.splice(i, 1); if (pl.state === 'air' && pl.lift > 0.7 && !pl.diving) { pl.hp = Math.max(1, pl.hp - 9); pl.airFuel = 0; pl.jv = Math.min(pl.jv, -5); pl.cnt = 0; _a.set(tx, ty, tz); FX.burst(_a, 0xff3b30, 1.4); _a.y += 0.8; FX.word('BROUGHT DOWN.', _a, '#ff3b30', 1.1); SC.cam.shake(0.45); SC.audio.sfx('hurt'); SC.emit('flash', '#ff3b30'); } } } }`);
// the right stick, sent in by the game (the level never read the controller itself, so in a level it did nothing)
rep("let lx = lookX, ly = lookY; lookX = lookY = 0;", "let lx = lookX, ly = lookY; lookX = lookY = 0; if (I.extL) { lx += (I.extL[0] || 0) * 2.8 * rdt; ly += (I.extL[1] || 0) * 1.6 * rdt; }");

// v0.56: guards have more than one blow, and a guard
rep("pose = P[K.atk](-(1 - e.st / K.wind)); rate = 26;", "pose = P[e.av || K.atk](-(1 - e.st / K.wind)); rate = 26;");
rep("pose = P[K.atk](e.st / 0.16); rate = 45;", "pose = P[e.av || K.atk](e.st / 0.16); rate = 45;");
rep("e.token = true; combat.tokens++; e.state = 'windup'; e.st = 0; alert(e);", "e.token = true; combat.tokens++; e.state = 'windup'; e.st = 0; alert(e); e.av = e.kind === 'hollow' ? SC.pick(['swing', 'swing', 'slam', 'jab']) : e.kind === 'bruiser' ? SC.pick(['slam', 'slam', 'swing']) : e.kind === 'knifer' ? SC.pick(['lunge', 'lunge', 'jab']) : null;");
rep("if (e.sub === 1) { e.sub = 2; e.state = 'windup';", "if (e.sub === 1) { e.sub = 2; if (e.av && e.kind === 'hollow') e.av = e.av === 'jab' ? 'swing' : 'jab'; e.state = 'windup';");
rep("if (this.bound > 0) dmg *= 1.5;\n    this.hp -= dmg; this.flash = 0.12;", "if (this.bound > 0) dmg *= 1.5;\n    if (this.kind === 'hollow' && !o.heavy && !o.power && !o.quiet && this.state === 'chase' && !(this.blkC > 0) && this.hp > dmg * 1.5 && Math.random() < 0.3) { this.blkC = 2.6; this.blkT = 0.42; this.flash = 0.05; this.hp -= dmg * 0.2; _a.copy(this.pos); _a.y += this.h * 0.7; FX.burst(_a, 0xffffff, 1.1); SC.audio.sfx('chain'); this.vel.x += dx * 3; this.vel.z += dz * 3; if (pl.t - (pl.blkW || -9) > 5) { pl.blkW = pl.t; _a.y += 0.6; FX.word('TURNED.', _a, '#cfe6ff', 0.9); } return; }\n    this.hp -= dmg; this.flash = 0.12;");
rep("m.anim.apply(pose, rate, Math.max(dt, 0.0001));\n    m.group.position.copy(e.pos); if (e.drop)", "if (e.blkC > 0) e.blkC -= dt; if (e.blkT > 0) { e.blkT -= dt; if (e.state === 'chase') { pose = SC.BLKP; rate = 50; } }\n    m.anim.apply(pose, rate, Math.max(dt, 0.0001));\n    m.group.position.copy(e.pos); if (e.drop)");

// v0.56: the fleet in the sky rides in two rings that turn against each other, so no hull can meet another; riding lamps wink
rep("G.sky.position.set(G.camera.position.x, 0, G.camera.position.z);", "G.sky.position.set(G.camera.position.x, 0, G.camera.position.z); if (G.sky.rings) { const st = performance.now() / 1000; G.sky.rings[0].rotation.y = st * 0.0035; G.sky.rings[1].rotation.y = -st * 0.0026; G.sky.rings[0].position.y = Math.sin(st * 0.21) * 0.7; G.sky.rings[1].position.y = Math.sin(st * 0.17 + 2) * 0.9; G.sky.bcm.forEach((m, i) => m.color.setHex(((st * 0.8 + i * 0.37) % 1) < 0.22 ? 0xff5a3a : 0x40181c)); }");

// v0.58: nothing of the HUD sits in the middle. The marker shrinks when what it marks is on screen.
rep("el.classList.remove('hide'); el.style.transform = 'translate(' + ((x * 0.5 + 0.5) * w)", "el.classList.remove('hide'); el.classList.toggle('near', _v.z <= 1 && Math.abs(_v.x) < 0.9 && _v.y > -0.62 && _v.y < 0.72); el.style.transform = 'translate(' + ((x * 0.5 + 0.5) * w)");

/* ---- v0.70: the vent stack. A fifth level; boots that are dead until the story says otherwise; a storm sky ---- */
rep("hov = inp.hold.y && pl.airFuel > 0", "hov = inp.hold.y && !(SC.story.noBoots && SC.story.noBoots()) && pl.airFuel > 0");
rep("if (wantBoot && (pl.bootCd || 0) <= 0 && pl.onGround)", "if (wantBoot && !(SC.story.noBoots && SC.story.noBoots()) && (pl.bootCd || 0) <= 0 && pl.onGround)");
rep("b.position.set(Math.cos(a) * r, SC.issue === 'stair' ? -34 + rnd() * 46 : -14 + rnd() * 90,", "b.position.set(Math.cos(a) * r, SC.issue === 'stack' ? -600 : SC.issue === 'stair' ? -34 + rnd() * 46 : -14 + rnd() * 90,");
rep("const bands = SC.issue === 'stair' ? ", "const bands = SC.issue === 'stack' ? ['#10141f', '#182033', '#24304a', '#33445f', '#4a5d78', '#6c7f96'] : SC.issue === 'stair' ? ");
rep("    if (SC.issue === 'gild') { G.scene.background.set(0x07060a);", "    if (SC.issue === 'stack') { G.scene.background.set(0x1c2740); G.scene.fog.color.set(0x34465e); G.scene.fog.near = 30; G.scene.fog.far = 125; G.amb.color.setRGB(0.34, 0.4, 0.5); }\n    if (SC.issue === 'gild') { G.scene.background.set(0x07060a);");

/* ---- v0.71: the Deep Array. Kael before any of it: no hook, no ELEVEN; Dace's name; a dark hall ---- */
rep("wantHook = can && inp.buffered('hook', 0.2)", "wantHook = can && !(SC.story.plain && SC.story.plain()) && inp.buffered('hook', 0.2)");
rep("else if (wantPow && pl.path && pl.onGround && free)", "else if (wantPow && pl.path && !(SC.story.plain && SC.story.plain()) && pl.onGround && free)");
rep("if (pl.path && pl.meter >= T.powerCost) { if (pl.holdA > 0.2", "if (pl.path && !(SC.story.plain && SC.story.plain()) && pl.meter >= T.powerCost) { if (pl.holdA > 0.2");
rep("clerk: { name: SC.issue === 'stair' ? 'TAVI' : 'BRAND',", "clerk: { name: SC.issue === 'stair' ? 'TAVI' : SC.issue === 'array' ? 'DACE' : 'BRAND',");
rep("    if (SC.issue === 'stack') { G.scene.background.set(0x1c2740);", "    if (SC.issue === 'array') { G.scene.background.set(0x090d0c); G.scene.fog.color.set(0x14201c); G.scene.fog.near = 18; G.scene.fog.far = 84; G.amb.color.setRGB(0.34, 0.38, 0.34); G.sun.color.setRGB(0.5, 0.46, 0.36); }\n    if (SC.issue === 'stack') { G.scene.background.set(0x1c2740);");
rep("const bands = SC.issue === 'stack' ? ", "const bands = SC.issue === 'array' ? ['#060908', '#0a100e', '#0e1614', '#121c18', '#16221e', '#1a2822'] : SC.issue === 'stack' ? ");

// ---- v0.72: the comic pages never say TAP (the standing rule: no tap prompt). The arrow alone marks a page that is waiting
rep("go.innerHTML = 'TAP &#9654;';", "go.innerHTML = '&#9654;';");

if (/Calloway|Tally|Deacon|Mother Mercy|SECOND CHANCE|Second Chance|Halloran|Meridian|Hollow/.test(s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''))) {
  const m = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').match(/.{0,60}(Calloway|Tally|Deacon|Mother Mercy|SECOND CHANCE|Second Chance|Halloran|Meridian|Hollow).{0,40}/g);
  console.log('LEFTOVER:', m.slice(0, 12));
}
writeFileSync(dir + 'issue.html', s);
console.log('issue.html', (s.length / 1024).toFixed(1) + ' KB,', n, 'patches');
