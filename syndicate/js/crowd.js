// Guttercrown — the crowd and the arsenal: a meter that says what the stands think, what a frenzy paid, two more mortal blows for every class,
// and a fifth weapon each
(function () {
  const G = window.G, A = G.ABILITIES, ui = G.ui;

  // ------------------------------------------------------------ more mortal blows (five per class), sharing lead-ins
  const M = G.MORTALS; if (M) {
    const add = (cls, list) => { if (M[cls]) list.forEach(m => { if (!M[cls].some(q => q.id === m.id)) M[cls].push(m); }); }, lead = (cls, id, l, o) => { const m = (M[cls] || []).find(q => q.id === id); if (m) Object.assign(m, { lead: l }, o || {}); };
    add('fighter', [{ id: 'behead', rank: 2, name: 'The Headsman', word: 'BEHEADED', desc: 'Two cuts to turn them, one to finish. The head lands somewhere in the cheap seats.', behead: 1, lead: 'spin', cast: false },
      { id: 'pin', rank: 4, name: 'Nailed to the Sand', word: 'PINNED', desc: 'Every blade off the pit wall, called down point first.', lead: 'impale', imp: 1.4, cast: false }]);
    add('rogue', [{ id: 'smile', rank: 2, name: 'The Red Smile', word: 'OPENED', desc: 'You are behind them. They work it out a moment after their head does.', behead: 1, lead: 'quiet', imp: 1.5 },
      { id: 'strung', rank: 4, name: 'Strung Up', word: 'HANGED', desc: 'A wire nobody saw you throw. They go up kicking and come down quiet.', lead: 'lift', col: '#c8ccd4', cast: false }]);
    add('sorcerer', [{ id: 'ignite', rank: 2, name: 'Burn From Within', word: 'CINDERS', desc: 'They rise off the sand, lit from the inside like a lantern.', lead: 'lift', col: '#ff7a2a', fire: 1, ash: 1 },
      { id: 'rift', rank: 4, name: 'Unzip the World', word: 'ELSEWHERE', desc: 'The floor opens on somewhere that is not the Undercity. It takes them and closes.', lead: 'sink', col: '#c79bff', swallow: 1, imp: 1.4 }]);
    add('cleric', [{ id: 'ascend', rank: 2, name: 'Taken Up', word: 'ASCENDED', desc: 'The Light lifts them gently. It does not set them down gently.', lead: 'lift', pillar: 1 },
      { id: 'absolve', rank: 4, name: 'Hammer of the Faithful', word: 'ABSOLVED', desc: 'Three rings of light to hold them still, and one swing to send the head ahead of the soul.', lead: 'smite', behead: 1, cast: false }]);
    lead('druid', 'pack', 'pack'); lead('druid', 'roots', 'sink', { swallow: 1 }); lead('druid', 'oldbear', 'quake', { crack: 1 });
    add('druid', [{ id: 'wings', rank: 2, name: 'A Thousand Wings', word: 'STRIPPED', desc: 'Every bat in the roost, all at once, for about a second.', lead: 'rain', col: '#c79bff', ash: 1 },
      { id: 'web', rank: 4, name: 'Hung in the Web', word: 'DRAINED', desc: 'Up into the dark on a silk line, to something that has been waiting patiently.', lead: 'lift', col: '#9be35a', swallow: 1 }]);
    lead('warlock', 'paid', 'lift'); lead('warlock', 'maw', 'sink', { swallow: 1 }); lead('warlock', 'name', 'word');
    add('warlock', [{ id: 'hands', rank: 2, name: 'Many Hands', word: 'TORN', desc: 'They come out of the shadows under the stands. There are a great many of them.', lead: 'cuts', col: '#7a4acc', cast: true },
      { id: 'eyes', rank: 4, name: 'It Looked Back', word: 'WITNESSED', desc: 'For one moment your patron pays attention. Nothing it looks at survives being seen.', lead: 'storm', col: '#8aff9a', ash: 1, imp: 1.4 }]);
  }

  // ------------------------------------------------------------ a fifth weapon for every class
  if (G.ARMS) {
    const W = (id, cls, name, model, cost, rank, base, o, blurb) => { if (A[id]) return; A[id] = Object.assign({}, A[base], o, { id, name, basic: 1, _tempo: 1 });
      const b = A[id]; b.desc = (b.type === 'melee' ? 'Tap to strike' : 'Tap to loose') + ' for ' + b.dmg[0] + 'd' + b.dmg[1] + ' + ' + b.stat.toUpperCase() + '. Costs ' + b.cost + ', refunded on a hit. Hold, then release, for a heavy blow.';
      const hb = A[base + '_h'] || {}; A[id + '_h'] = Object.assign({}, b, { id: id + '_h', basic: 0, heavy: 1, armor: 1, name: hb.name || 'Heavy Blow', wind: +(b.wind * 2.1).toFixed(3), rec: +(b.rec * 1.5).toFixed(3), cost: b.cost * 2, pow: 2.5, knock: 230, gain: 6, lunge: b.type === 'melee' ? Math.max(46, b.lunge || 0) : 0, speed: b.speed ? b.speed * 1.15 : undefined, pr: b.pr ? b.pr * 1.6 : undefined });
      const w = { id, cls, name, model, cost, rank, blurb }; G.ARMS.push(w); G.ARM_BY[id] = w; };
    const t = (id, k, f) => +(A[id][k] * f).toFixed(3);
    W('f_flail', 'fighter', 'Pit Flail', 'flail', 480, 4, 'f_basic', { range: 88, arc: 150, wind: t('f_basic', 'wind', 1.2), rec: t('f_basic', 'rec', 1.2), dmg: [1, 10], pz: 1.6, cost: 12 }, 'A spiked head on a chain. Goes round a raised shield as if it were not there.');
    W('r_spear', 'rogue', 'Gutter Pike', 'spear', 480, 4, 'r_basic', { range: 106, arc: 40, wind: t('r_basic', 'wind', 1.35), rec: t('r_basic', 'rec', 1.25), dmg: [1, 8], lunge: 22, cost: 8 }, 'A boat-hook with ambitions. Nobody expects a rogue to have the reach.');
    W('s_staff', 'sorcerer', 'Emberwood Staff', 'staff', 480, 4, 's_basic', { dmg: [1, 10], speed: t('s_basic', 'speed', 0.9), wind: t('s_basic', 'wind', 1.15), pr: (A.s_basic.pr || 9) * 1.3, knock: 70 }, 'A focus the length of a man. Bigger bolts, slower, and they shove.');
    W('c_hammer', 'cleric', 'Bell-Hammer', 'hammer', 480, 4, 'c_basic', { range: 66, wind: t('c_basic', 'wind', 1.4), rec: t('c_basic', 'rec', 1.3), dmg: [1, 12], pz: 2.2, knock: 140, cost: 13 }, 'Cast from a cracked chapel bell. It still rings, once, each time.');
    W('d_axes', 'druid', 'Bone Sickles', 'axes', 480, 4, 'd_staff', { range: 60, arc: 130, wind: t('d_staff', 'wind', 0.78), rec: t('d_staff', 'rec', 0.8), dmg: [1, 6], pz: 1.2, cost: 6 }, 'A pair of curved jaw-bones, ground to an edge. Quick, close and ugly.');
    W('w_staff', 'warlock', 'Rod of the Pact-Keeper', 'staff', 480, 4, 'w_basic', { dmg: [1, 8], pr: (A.w_basic.pr || 9) * 1.3, knock: 60, slow: [0.15, 0.7] }, 'It was somebody’s arm, once. The bolts it throws are heavy enough to push.');
    if (G.SETS) { const put = (sets, cls, id) => sets.forEach(k => { const s = G.SETS[k]; if (s && s.arms[cls] && !s.arms[cls].includes(id)) s.arms[cls].push(id); });
      put(['chain', 'plate'], 'fighter', 'f_flail'); put(['leathers', 'warden'], 'rogue', 'r_spear'); put(['warden', 'gilded'], 'sorcerer', 's_staff'); put(['plate', 'crownguard'], 'cleric', 'c_hammer'); put(['leathers', 'rags', 'ashcloak'], 'druid', 'd_axes'); put(['gilded', 'pactrobes'], 'warlock', 'w_staff'); }
  }

  // ------------------------------------------------------------ the meter says what the stands think
  const hud0 = ui.updateHud;
  ui.updateHud = function (P, E, hype) {
    const r = hud0.apply(this, arguments), bar = document.querySelector('#hud .hype'); if (!bar) return r;
    let lab = bar.parentNode.querySelector('.hype-lab'); if (!lab) { lab = document.createElement('span'); lab.className = 'hype-lab'; bar.parentNode.insertBefore(lab, bar.nextSibling); }
    const fz = P && P.buffs && P.buffs.frenzy, t = fz ? 'FRENZY' : hype >= 80 ? 'Roaring' : hype >= 45 ? 'Loud' : hype >= 20 ? 'Watching' : 'Restless', c = 'hype-lab' + (fz ? ' frenzy' : hype >= 80 ? ' hot' : '');
    if (lab.textContent !== t) lab.textContent = t; if (lab.className !== c) lab.className = c; return r;
  };
  const res0 = ui.results;
  ui.results = function (r) { const out = res0.apply(this, arguments); if (!r || !r.win) return out; const end = document.querySelector('#panel .card.res .row.end'); if (!end) return out;
    const bits = []; if (r.frenzies) bits.push('The pit erupted <b>' + (r.frenzies === 1 ? 'once' : r.frenzies + ' times') + '</b>.'); if (r.tossed) bits.push('The stands threw <b>' + r.tossed + ' coin</b> onto the sand.');
    if (bits.length) { const p = document.createElement('p'); p.className = 'dim'; p.innerHTML = bits.join(' '); end.parentNode.insertBefore(p, end); } return out; };

  if (G.TIPS) G.TIPS.push('Taunt (G, D-pad down, or the TAUNT button) when they are staggered. Get hit while showing off and the crowd turns on you.', 'Fill the crowd meter and the pit erupts: six seconds of harder hits, faster breath and coin thrown from the stands.');
  if (G.LORE) G.LORE.push(
    { sec: 'The Pit', title: 'Working the Crowd', unlock: st => !!st.wins.grubb || (st.under || []).some(n => n > 0), body: 'The stands pay for a show. They roar for a clean parry, a dodge that should not have worked, a guard broken, a body thrown into the wall, a limb on the sand. They roar for variety: four different moves in a breath marks you a showman. They roar loudest for nerve: stop, turn your back, and ask them if that was all, and they will love you for it, unless the other fighter hits you while you are asking. Fill the meter and the pit erupts. For six seconds you hit harder and breathe easier, and they throw coin.' },
    { sec: 'The Pit', title: 'Mortal Blows', unlock: st => G.rankOf(st.respect) >= 2, body: 'Every trade has five ways to end a bout, taught one at a time as your name grows. Some leave a mess. Some leave nothing. A few take the head and leave the rest standing a moment, which the crowd considers the height of the art. Choose one with the Guildmaster, or leave it to the night.' }
  );
})();
