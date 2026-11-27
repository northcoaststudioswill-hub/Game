// Guttercrown — first meetings: cinematic dialogue scenes for the people who matter, and friendly duels (to the yield)
(function () {
  const G = window.G, ui = G.ui, T = THREE, gfx = G.gfx, W = G.world;
  const $ = id => document.getElementById(id), lerp = G.lerp;

  // ------------------------------------------------------------ the dialogue player
  // opts: { place:'hub'|'arena', npc:[x,z], you:[x,z], spawn:{look,crown}, lines:[{who:'npc'|'you'|'', name, text, shot}], choices:[{label, go}], done }
  let D = null;
  function play(opts) {
    ui.close();
    const el = document.createElement('div'); el.id = 'talk';
    el.innerHTML = '<div class="c-bar top"></div><div class="tk-box"><b class="tk-name"></b><p class="tk-text"></p><span class="tk-hint"></span><div class="tk-choices"></div></div><button class="c-skip mini">Skip</button>';
    $('ui').appendChild(el); $('ui').classList.add('talking');
    D = G.talk = { o: opts, i: -1, t: 0, shown: 0, el, actors: [], you: null, npcC: null };
    const w = W.walker;
    if (opts.place === 'arena') {
      if (!G.fight.active && G.fight.exStop) G.fight.exStop();                  // sweep the pit: no limbs or blood left over from the last bout
      const a = opts.stage || W.get('arena'); gfx.setScene(a.scene); if (a.cineWall) { a.cineWall(true); D.wall = a; } if (a.setHype) a.setHype(0.15);
      if (G.titleChars) G.titleChars.forEach(c => c.root.visible = false);
      const F = G.fight; if (F.P && F.P.vis) { F.P.vis.g.visible = false; F.E.vis.g.visible = false; }
      const n = G.makeChar(opts.spawn.look); n.root.position.set(opts.npc[0], 0, opts.npc[1]); a.scene.add(n.root); D.actors.push([n, a.scene]); D.npcC = n;
      if (opts.spawn.crown) { const gold = new T.MeshPhongMaterial({ color: 0xf0c95a, emissive: 0x7a5408, shininess: 90, flatShading: true }), cr = new T.Group(); cr.add(new T.Mesh(new T.CylinderGeometry(0.25, 0.23, 0.12, 8, 1, true), gold)); for (let i = 0; i < 6; i++) { const s = new T.Mesh(new T.ConeGeometry(0.055, 0.2, 4), gold); s.position.set(Math.cos(i * 1.047) * 0.24, 0.14, Math.sin(i * 1.047) * 0.24); cr.add(s); } cr.position.y = 1.86; n.root.add(cr); }
      const y = G.makeChar(G.lookOf(G.state.hero, G.state)); y.root.position.set(opts.you[0], 0, opts.you[1]); a.scene.add(y.root); D.actors.push([y, a.scene]); D.you = y;
      n.root.rotation.y = Math.atan2(opts.you[0] - opts.npc[0], opts.you[1] - opts.npc[1]); y.root.rotation.y = n.root.rotation.y + Math.PI;
    } else { const ex = opts.you[0] - opts.npc[0], ez = opts.you[1] - opts.npc[1], ed = Math.hypot(ex, ez) || 1; if (ed < 2.3) opts.you = [opts.npc[0] + ex / ed * 2.3, opts.npc[1] + ez / ed * 2.3];       // never film two people standing on each other's toes
      { const hb = W.get('hub'); if (hb.blocked && hb.blocked(opts.you[0], opts.you[1])) { let best = null; for (let rr = 0.3; rr <= 3.6 && !best; rr += 0.3) for (let k = 0; k < 12 && !best; k++) { const fx = opts.you[0] + Math.cos(k * 0.5236) * rr, fz = opts.you[1] + Math.sin(k * 0.5236) * rr; if (!hb.blocked(fx, fz) && Math.hypot(fx - opts.npc[0], fz - opts.npc[1]) > 1.6) best = [fx, fz]; } if (best) opts.you = best; } }       // never stand the player inside a stall or the lamp
      w.x = opts.you[0]; w.z = opts.you[1]; w.target = null; w.path = null; w.emote = null; w.face = Math.atan2(opts.npc[0] - w.x, opts.npc[1] - w.z); }
    el.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; G.audioInit(); advance(); });
    el.querySelector('.c-skip').onclick = () => finish(true);
    advance(); talk.update(0, lastNow); if (gfx.veil) gfx.veil(0.4);
  }
  function advance() {
    if (!D || ui.isOpen()) return; const o = D.o, ln = o.lines[D.i];
    if (ln && D.shown < ln.text.length) { D.shown = ln.text.length; render(); return; }          // first tap completes the line
    if (D.i >= o.lines.length - 1) { if (o.choices && !D.choosing) return choose(); if (!o.choices) finish(); return; }
    D.i++; D.t = 0; D.shown = 0; G.sfx('page'); render();
  }
  function render() {
    const ln = D.o.lines[D.i], el = D.el;
    el.querySelector('.tk-name').textContent = ln.name || ''; el.querySelector('.tk-name').className = 'tk-name ' + (ln.who || 'none');
    el.querySelector('.tk-text').textContent = ln.text.slice(0, Math.floor(D.shown));
    el.querySelector('.tk-hint').textContent = D.shown >= ln.text.length ? (G.input.usingPad ? '(A) continue' : G.input.touch ? 'Tap to continue' : 'Click or Space to continue') : '';
  }
  function choose() {
    D.choosing = true; const box = D.el.querySelector('.tk-choices'); D.el.querySelector('.tk-hint').textContent = '';
    box.innerHTML = D.o.choices.map((c, i) => '<button class="' + (i === 0 ? 'big' : '') + '" data-i="' + i + '">' + c.label + '</button>').join('');
    box.querySelectorAll('button').forEach(b => b.onclick = () => { G.sfx('ui'); const c = D.o.choices[+b.dataset.i]; finish(false, c.go); });
    D.pick = 0; mark();
  }
  function finish(skipped, then) {
    if (!D) return; const o = D.o;
    D.actors.forEach(a => a[1].remove(a[0].root)); if (D.wall) D.wall.cineWall(false); if (gfx.veil) gfx.veil(0.3); D.el.remove(); $('ui').classList.remove('talking'); D = G.talk = null; gfx.cine = null;
    if (o.place === 'arena' && !then && G.scene === 'hub') gfx.setScene(W.get('hub').scene);
    if (then) then(); else if (o.done) o.done(skipped);
  }
  // a choice can be made with a controller or the keyboard: left and right move, A or Enter takes it
  function mark() { if (!D || !D.choosing) return; D.el.querySelectorAll('.tk-choices button').forEach((b, i) => b.classList.toggle('sel', i === D.pick)); }
  const talk = { next: advance, skip: () => { if (!ui.isOpen()) finish(true); }, choosing: () => !!(D && D.choosing),
    move: d => { if (!D || !D.choosing || !d) return; const n = D.o.choices.length; D.pick = ((D.pick || 0) + (d > 0 ? 1 : -1) + n) % n; G.sfx('ui'); mark(); },
    confirm: () => { if (!D || !D.choosing || ui.isOpen()) return; const b = D.el.querySelectorAll('.tk-choices button')[D.pick || 0]; if (b) b.click(); } };
  let lastNow = 0;
  talk.update = function (dt, now) {
    lastNow = now; if (!D) return; const o = D.o, ln = o.lines[D.i];
    { const under = ui.isOpen(); if (under !== !!D.under) { D.under = under; D.el.classList.toggle('under', under); } if (under) return; }
    D.t += dt;
    if (ln && D.shown < ln.text.length) { D.shown = Math.min(ln.text.length, D.shown + dt * 48); render(); }
    const n = o.npc, y = o.place === 'arena' ? o.you : [W.walker.x, W.walker.z], nh = (o.npcH || 1.42), mx = (n[0] + y[0]) / 2, mz = (n[1] + y[1]) / 2, dx = y[0] - n[0], dz = y[1] - n[1], d = Math.hypot(dx, dz) || 1, ux = dx / d, uz = dz / d, px = -uz, pz = ux;
    const side = (px + pz) >= 0 ? 1 : -1, k = Math.min(1, D.t / 6), port = gfx.portrait, shot = (ln && ln.shot) || 'two';
    let pos, look, fov;
    // keep the lens between the two when they stand close, so nobody's shoulder or back fills the frame
    const tight = d < 3.7, fit = c => tight ? Math.max(1.3, d * 0.5) : c, so = tight ? 1.9 : 0.9, fv = (c, c0) => tight ? 46 : 32;       // two people standing close are filmed from the side of the gap between them, never from behind a shoulder
    if (shot === 'npc') { const c0 = lerp(3.5, 3.1, k), c = fit(c0); pos = [n[0] + ux * c + px * side * so, nh + 0.1, n[1] + uz * c + pz * side * so]; look = [n[0], nh - 0.08, n[1]]; fov = fv(c, c0); }
    else if (shot === 'you') { const c0 = lerp(3.0, 2.6, k), c = fit(c0); pos = [y[0] - ux * c + px * side * (tight ? so : 1.0), 1.55, y[1] - uz * c + pz * side * (tight ? so : 1.0)]; look = [y[0], 1.12, y[1]]; fov = fv(c, c0); }
    else if (shot === 'low') { const c = fit(2.2); pos = [n[0] + ux * c + px * side * 0.5, 0.45, n[1] + uz * c + pz * side * 0.5]; look = [n[0], nh - 0.12, n[1]]; fov = lerp(34, 44, k) * (c < 2.2 ? 1.2 : 1); }
    else if (shot === 'ots') { pos = [y[0] + ux * 1.7 + px * side * 1.25, 2.1, y[1] + uz * 1.7 + pz * side * 1.25]; look = [n[0], nh - 0.15, n[1]]; fov = lerp(40, 36, k); }
    else if (shot === 'wide') { pos = [mx + px * side * 7.5 + ux * 1, lerp(3.4, 4.0, k), mz + pz * side * 7.5 + uz * 1]; look = [mx, 0.9, mz]; fov = 44; }
    else { pos = [mx + px * side * lerp(5.2, 4.7, k), 1.7, mz + pz * side * lerp(5.2, 4.7, k)]; look = [mx, 1.2, mz]; fov = 40; }
    const j = 0.03; gfx.cine = { pos, look: [look[0] + Math.sin(now * 1.3) * j, look[1] + Math.sin(now * 1.9) * j, look[2]], fov: port ? Math.min(92, fov * 1.55) : fov, roll: shot === 'low' ? 0.05 : 0 };
    const speaking = ln && D.shown < ln.text.length;
    if (D.npcC) D.npcC.pose({ t: now, act: speaking && ln.who === 'npc' ? 'cast' : 'idle', prog: 0.2 });
    if (D.you) D.you.pose({ t: now + 1, act: 'idle' });
  };
  G.talkApi = talk; G.playScene = play;

  // ------------------------------------------------------------ friendly duels: nobody dies, first to yield
  const MARK_OPP = () => ({ id: 'mark', name: 'Marc', title: 'of the Long Odds', cls: 'sorcerer', race: 'human', level: Math.max(1, G.state.hero.level), sub: 'wild', known: ['chaos_bolt', 'misty_step', 'burning_hands'], hpMul: 0.85, dmgMul: 0.55, ai: { react: 0.45, aggro: 0.6, dodge: 0.2, guard: 0.2, parry: 0.1 }, xp: 0, coin: 0, respect: 0, spar: true, look: G.mark.look, taunt: '' });
  G.spar = function (opp, onDone) { ui.leaveHub(); ui.close(); const pot = G.state.potions; opp.onDone = w => { G.state.potions = pot; onDone(w); }; G.scene = 'fight'; ui.topbar(); G.fight.start(opp); };
  const backToHub = () => { $('hud').className = 'hidden'; ui.hub(); ui.close(); };
  function markDuel(stake, first) {
    const st = G.state; if (stake) G.mark.take(stake);
    G.spar(MARK_OPP(), win => {
      backToHub(); st.met.markDuel = (st.met.markDuel || 0) + (win ? 1 : 0);
      let line, got = '';
      if (win) { const pay = stake ? stake * 2 : 60; st.coin += pay; got = '+' + pay + ' coin'; if (first && !st.cos.owned.lucky) { st.cos.owned.lucky = true; got += ' · Marc’s Lucky Laurel (at the Tailor)'; } line = pickLine(['CLUTCH, BRO. I let you have that. Barely trying, by the way.', 'Okay. OKAY. I am going to need a pipe and a sit down.', 'That is my guy! I mean, ow. But that is my guy.']); G.sfx('coin'); }
      else line = pickLine(['Happens to the best. Happens to you, too. Run it back any time, bro.', 'And THAT is why the house always wins. I am the house.', 'You okay? You look okay. Walk it off. Respect.']);
      G.save(); ui.topbar();
      ui._show('<div class="card small"><h2>' + (win ? 'Marc Yields' : 'You Yield') + '</h2><div class="mk-top"><span id="mkp"></span><div><p class="quote">“' + line + '”</p></div></div>' + (got ? '<p class="rankup">' + got + '</p>' : '<p class="dim">No fee, no shame. It was a friendly.</p>') + '<div class="row end"><button class="big" id="x">Carry on</button></div></div>');
      $('mkp').appendChild(G.portrait(G.mark.look, 92)); ui._on('#x', () => { ui.close(); ui.topbar(); });
    });
  }
  const pickLine = a => a[Math.floor(Math.random() * a.length)];
  G.markDuel = markDuel;

  // ------------------------------------------------------------ who you meet, and what they say
  const S = (who, name, text, shot) => ({ who, name, text, shot });
  const MEET = {
    mark: (then) => { const me = G.state.hero.name; return { place: 'hub', npc: [25.6, -0.5], you: [25.6, 2.6], lines: [
        S('npc', 'Marc dé Fleuprau', 'Hold up. HOLD up. New face. Bro, come here, let me look at you.', 'wide'),
        S('npc', 'Marc dé Fleuprau', 'Marc dé Fleuprau. Marc. The Long Odds. I run the dice, the coin and the undercard. I have got a guy for everything. The guy is me.', 'npc'),
        S('npc', 'Marc dé Fleuprau', 'You know why I am rich, bro? Queen Eerin Koheneim and Vilhelm van Koheneim IV. Iron grip. You cannot roll a die up top without a seal. So everybody rolls them down here. Long may they reign. Seriously.', 'npc'),
        S('you', me, 'They said you would take a bet on anything.', 'you'),
        S('npc', 'Marc dé Fleuprau', 'Anything, bro. Watch this. I bet I can put you on the floor. Friendly. First one to yield buys the other a pipe.', 'ots'),
        S('npc', 'Marc dé Fleuprau', '…I have had a pipe already today. Several. It is fine. I fight better loose.', 'npc')],
      choices: [{ label: 'Duel him', go: () => markDuel(0, true) }, { label: 'Maybe later', go: then }], done: then }; },
    gm: (then) => { const me = G.state.hero.name; return { place: 'hub', npc: [20.4, -0.2], you: [20.4, 2.4], lines: [
        S('npc', 'The Ledger-Keeper', me + '. Yes. I have your page open.', 'wide'),
        S('npc', 'The Ledger-Keeper', 'Your debt is written in the first column. Beside it, in the second, the Guild has written the number of bouts it expects in payment.', 'npc'),
        S('npc', 'The Ledger-Keeper', 'Above us, Queen Eerin Koheneim and her husband, Vilhelm van Koheneim IV, hold the realm in an iron grip. Down here they ask two things only: their tithe, and that nobody climbs the stair. Everything else, they permit.', 'ots'),
        S('you', me, 'And if I win them?', 'you'),
        S('npc', 'The Ledger-Keeper', 'Then I strike the line through, with my own hand, and you may wear a brass hat and call yourself a monarch. The Guild keeps its word exactly.', 'ots'),
        S('npc', 'The Ledger-Keeper', 'Come to me when you grow. I keep the record of what you have become.', 'npc')], done: then }; },
    fence: (then) => { const me = G.state.hero.name; return { place: 'hub', npc: [15.6, -1.0], you: [15.6, 1.9], lines: [
        S('npc', 'The Fence', 'Ah. The new one. You have the look of someone who needs things and does not ask where they came from.', 'npc'),
        S('you', me, 'Where do they come from?', 'you'),
        S('npc', 'The Fence', 'Highmarch. Whatever Queen Eerin Koheneim and Vilhelm van Koheneim IV forbid up there, somebody still wants. So it comes down the stair, and it finds me.', 'npc'),
        S('npc', 'The Fence', 'They fell off a cart. Different carts. Steel, plate, potions, and round the side a rack of things to wear. Coin only. I do not keep a ledger.', 'ots')], done: then }; },
    vexa: (then) => { const me = G.state.hero.name, o = G.OPPONENTS.find(q => q.id === 'vexa'); return { place: 'arena', npc: [-1.6, -1.6], you: [1.9, 1.9], spawn: { look: { id: 'fighter:vexa', cls: o.cls, race: o.race, tint: o.tint }, crown: true }, lines: [
        S('', '', 'The crowd goes quiet when she walks out. It has done so for seven years.', 'wide'),
        S('npc', 'Vexa, the Pale Queen', 'So you are the one they have all been betting on. Marc has not shut up about you.', 'npc'),
        S('you', me, 'I am here for the crown.', 'you'),
        S('npc', 'Vexa, the Pale Queen', 'This? It is brass. The real crown sits on Eerin Koheneim, and Vilhelm van Koheneim IV holds the sword beside it. They let us keep this one. Remember that when the crowd calls you a monarch.', 'npc'),
        S('npc', 'Vexa, the Pale Queen', 'Everyone is. I have been waiting a long time for someone who might actually take it. Do not make me feel foolish for hoping.', 'low'),
        S('npc', 'Vexa, the Pale Queen', 'To the death, then. Those are the rules. I did not write them.', 'npc')], done: then }; }
  };
  // Run a first-meeting scene once, then carry on to whatever the player was doing.
  G.meet = function (id, then) {
    const st = G.state; st.met = st.met || {};
    if (st.met[id] || !MEET[id]) return then();
    st.met[id] = 1; G.save(); play(G.sceneHook ? G.sceneHook(id, MEET[id](then)) : MEET[id](then));
  };

  // ------------------------------------------------------------ settings + the objective line
  // browsers disagree on whether a zoomed box's percentage sizes are zoomed too: measure once, and correct only where they are
  let zoomPct = null;
  const zoomCheck = () => { if (zoomPct != null) return zoomPct; try { const o = document.createElement('div'), i = document.createElement('div'); o.style.cssText = 'position:absolute;left:-9999px;top:0;width:200px;height:10px'; i.style.cssText = 'zoom:2;width:100%;height:5px'; o.appendChild(i); document.body.appendChild(o); zoomPct = i.getBoundingClientRect().width > 300; o.remove(); } catch (e) { zoomPct = false; } return zoomPct; };
  const zp = () => { const p = document.getElementById('panel'); if (p) p.classList.toggle('uizfix', zoomCheck()); };
  if (window.MutationObserver) document.addEventListener('DOMContentLoaded', () => { const p = document.getElementById('panel'); if (p) new MutationObserver(() => { if (!p.classList.contains('uizfix') && zoomCheck()) p.classList.add('uizfix'); }).observe(p, { attributes: true, attributeFilter: ['class'] }); });
  G.applyOpts = function () {
    const o = (G.state && G.state.opt) || {};
    if (o.text && o.text !== 1 && o.uiz == null) { o.uiz = o.text; o.text = 1; }
    document.documentElement.style.setProperty('--tscale', o.text || 1); document.documentElement.style.setProperty('--uiz', o.uiz || 1); zp(); G.musicOff = !!o.noMusic; G.muted = !!o.noSfx; G.shakeMul = o.noShake ? 0 : 1;
  };
  ui.settings = function () {
    const st = G.state, o = st.opt || (st.opt = {});
    const tog = (k, label, on, sub) => '<div class="ab-row"><div class="ab-tx"><b>' + label + '</b><p>' + sub + '</p></div><button data-opt="' + k + '" class="' + (on ? 'big' : '') + '">' + (on ? 'On' : 'Off') + '</button></div>';
    ui._show('<div class="card small"><h2>Settings</h2>' +
      tog('noSfx', 'Sound effects', !o.noSfx, 'Hits, spells, the crowd.') + tog('noMusic', 'Music', !o.noMusic, 'Generated music for each area.') +
      tog('gore', 'Blood', st.gore !== false, 'Blood, floor splats and what a mortal blow leaves behind.') + tog('noShake', 'Screen shake', !o.noShake, 'Camera kick on heavy hits.') +
      '<div class="ab-row uiz-row"><div class="ab-tx"><b>Menu size</b><p>Pop-ups, cards and conversations only. The fight bars stay as they are.</p></div><div class="uiz"><button class="slot" id="uzm" aria-label="Smaller">−</button><input type="range" id="uiz" min="0.75" max="1.4" step="0.05" value="' + (o.uiz || 1) + '"><button class="slot" id="uzp" aria-label="Larger">+</button><b id="uzv">' + Math.round((o.uiz || 1) * 100) + '%</b></div></div>' +
      '<div class="row end"><button id="rst" class="danger">Erase save</button><button class="big" id="x">Done</button></div></div>');
    ui._on('#x', () => { ui.close(); ui.topbar(); });
    ui._on('[data-opt]', el => { const k = el.dataset.opt; if (k === 'gore') st.gore = st.gore === false; else o[k] = !o[k]; G.save(); G.applyOpts(); ui.settings(); });
    { const r = document.getElementById('uiz'), v = document.getElementById('uzv'), set = (x, save) => { x = Math.max(0.75, Math.min(1.4, Math.round(x * 20) / 20)); o.uiz = x; r.value = x; v.textContent = Math.round(x * 100) + '%'; document.documentElement.style.setProperty('--uiz', x); if (save) G.save(); };
      if (r) { r.oninput = () => set(+r.value, false); r.onchange = () => { set(+r.value, true); G.sfx('ui'); }; ui._on('#uzm', () => set((o.uiz || 1) - 0.05, true)); ui._on('#uzp', () => set((o.uiz || 1) + 0.05, true)); } }
    ui._on('#rst', () => { ui._show('<div class="card small"><h2>Erase everything?</h2><p>Your fighter, home, Tally and coin are deleted. This cannot be undone.</p><div class="row end"><button id="y" class="danger">Erase</button><button class="big" id="n">Keep playing</button></div></div>'); ui._on('#n', () => ui.settings()); ui._on('#y', () => { G.wipe(); location.reload(); }); });
  };
  // One line that always says what to do next.
  G.objective = function () {
    const st = G.state; if (!st.hero) return '';
    const h = st.hero, next = G.OPPONENTS.find(o => !st.wins[o.id]);
    if (G.scene === 'hideout') return (st.items || []).length < 3 ? 'Press Decorate and furnish the place' : 'Comfort ' + (G.roomComfort || 0) + ': tap a piece to use or move it';
    if (st.schemeDone) return 'Marc has news about your scheme';
    if ((st.reports || []).length) return 'Your Tally has news at the Low Lamp';
    if (h.known.some(id => !h.slots.includes(id)) && h.slots.includes(null)) return 'See the Guildmaster to set your loadout';
    if (!next) return 'You hold the Guttercrown. Rematch anyone, or finish your home';
    if ((st.tally || []).some(t => !t.job) && (st.tally || []).length && st.second == null) return 'Give your Tally work at the Low Lamp, then fight ' + next.name;
    return (st.wins.grubb ? 'Next on the Ledger: ' : 'Go to the Blood Pit gate and face ') + next.name + (next.boss ? ', the champion' : '');
  };
})();
