// Guttercrown — the Guest List: a hidden roster of people (and one dog) from the other cartridges, each with moves nobody else can learn.
// They are deliberately too strong. Found from the title: tap the crown five times, type "louie", or hold both shoulder buttons.
(function () {
  'use strict';
  const G = window.G, A = G.ABILITIES, ui = G.ui, T = window.THREE, IC = G.ICON_EXTRA = G.ICON_EXTRA || {};
  const def = (id, o) => { A[id] = Object.assign({ id, cost: 0, cd: 6, wind: 0.16, rec: 0.2, kind: 'Guest List', egg: 1 }, o); return id; };
  const hide = (map, k, v) => Object.defineProperty(map, k, { value: v, enumerable: false, writable: true, configurable: true });      // lookups find them; nothing that lists races for a random fighter does
  const f = d => '<path d="' + d + '"/>', c = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '"/>';
  const I = { fire: f('M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z'), drop: f('M12 2c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z'), leaf: f('M4 20C4 9 10 4 20 4c0 10-5 16-16 16zm3-3 9-9'), paw: c(12, 15, 4.5) + c(6, 10, 2.2) + c(18, 10, 2.2) + c(9.5, 6, 2) + c(14.5, 6, 2),
    bolt: f('M13 2 5 13h5l-2 9 9-12h-5z'), star: f('M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 20l2-7.5L2 9h7z'), shield: f('M12 2 4 5v7c0 5 3 8 8 10 5-2 8-5 8-10V5z'), wrench: f('M20 6a5 5 0 0 1-7 5L6 18l-2-2 7-7a5 5 0 0 1 5-7l-3 3 2 2z'), line: f('M2 11h20v2H2z'), cloud: f('M6 18a4 4 0 0 1 0-8 6 6 0 0 1 11-1 4.5 4.5 0 0 1 1 9z'), talk: f('M3 4h18v12H10l-5 4v-4H3z'), boom: c(12, 12, 9) };
  const ic = (id, k) => { IC[id] = I[k]; };
  const mv = (id, k, o) => { ic(id, k); return def(id, o); };

  // ---------------------------------------------------------------- the moves
  // David
  mv('eg_sand', 'boom', { name: 'The Sand Runs Out', type: 'aoe', spell: 1, at: 'target', castRange: 520, delay: 0.7, radius: 120, dmg: [6, 8], stat: 'cha', knock: 200, cd: 7, color: '#f0c95a', desc: 'He tips your glass over. 6d8 + CHA where you stand, a breath later.' });
  mv('eg_called', 'line', { name: 'Called In', type: 'line', spell: 1, range: 620, width: 34, dmg: [5, 8], stat: 'cha', cd: 6, wind: 0.3, color: '#f0c95a', desc: 'Every debt on the page, collected along one line: 5d8 + CHA.' });
  mv('eg_midnight', 'star', { name: 'Midnight', type: 'buff', ult: 1, cd: 30, buff: { haste: [8, 0.8], dmg: [8, 0.5], speed: [8, 0.3] }, refresh: 1, restore: 100, color: '#f0c95a', desc: 'It is always his hour. Every cooldown resets; 8s of +80% speed of hand and +50% damage.' });
  // Lil Bottie
  mv('eg_clanker', 'bolt', { name: 'Clanker Guns', type: 'proj', speed: 980, pr: 9, dmg: [2, 8], stat: 'str', cd: 1.4, wind: 0.08, rec: 0.08, color: '#40a0ff', desc: 'Dakka. 2d8 + STR, and it is ready again almost at once.' });
  mv('eg_chain', 'bolt', { name: 'Chain Stun', type: 'melee', range: 90, arc: 120, lunge: 110, dmg: [2, 6], stat: 'str', stun: 2.4, cd: 7, color: '#80e0ff', desc: 'YOU JUST GOT CHAINED. 2d6 + STR and 2.4s of standing there.' });
  mv('eg_airsup', 'boom', { name: 'Air Support', type: 'aoe', at: 'target', castRange: 560, delay: 0.9, radius: 130, dmg: [6, 8], stat: 'str', knock: 300, fire: 1, cd: 9, color: '#ff7040', desc: 'Something he requisitioned arrives from above: 6d8 + STR.' });
  mv('eg_nuke', 'boom', { name: 'Nuke the Data Center', type: 'aoe', ult: 1, at: 'self', delay: 0.6, radius: 330, dmg: [12, 10], stat: 'str', knock: 520, fire: 1, dot: ['burn', 4, [2, 6]], cd: 36, color: '#ff4040', desc: 'I MIGHT JUST HIT MY RATE LIMIT. 12d10 + STR to everything that is not him.' });
  // Marcus
  mv('eg_wrench', 'wrench', { name: 'Pipe Wrench', type: 'melee', armor: 1, range: 78, arc: 110, lunge: 70, dmg: [3, 8], stat: 'str', stun: 1.4, knock: 220, cd: 5, color: '#ff9a3a', desc: 'Righty tighty. 3d8 + STR and a 1.4s stun.' });
  mv('eg_dab', 'cloud', { name: 'Dab Cloud', type: 'aoe', at: 'self', delay: 0.15, radius: 170, dmg: [2, 6], stat: 'con', dot: ['poison', 6, [2, 4]], cd: 8, color: '#9ad66a', desc: 'All gas, bro. 2d6 + CON around him, and they cough for 6s.' });
  mv('eg_double', 'star', { name: 'Double or Nothing', type: 'melee', range: 80, arc: 90, lunge: 90, dmg: [1, 60], stat: 'cha', knock: 260, cd: 4, color: '#ffd36b', desc: 'A coin flip with a fist on the end: 1d60 + CHA. He had money on that, bro.' });
  mv('eg_hydro', 'line', { name: 'Hydro Jet', type: 'line', ult: 1, range: 680, width: 64, dmg: [10, 8], stat: 'str', knock: 620, cd: 28, wind: 0.35, color: '#6ac8ff', desc: 'Four thousand PSI down the length of the pit: 10d8 + STR and they go with it.' });
  // Will
  mv('eg_selfie', 'star', { name: 'Selfie Flash', type: 'melee', spell: 1, range: 160, arc: 90, dmg: [1, 6], stat: 'cha', stun: 1.8, cone: '#ffffff', cd: 6, color: '#ffffff', desc: 'Say cheese. 1d6 + CHA in a cone and 1.8s of seeing spots.' });
  mv('eg_laser', 'line', { name: 'Mazel Tov Laser', type: 'line', spell: 1, range: 640, width: 30, dmg: [5, 8], stat: 'cha', cd: 6, wind: 0.28, color: '#6ab0ff', desc: 'His own second special, shipped unchanged: 5d8 + CHA in a line.' });
  mv('eg_cuyaflare', 'fire', { name: 'Cuyaflare', type: 'proj', spell: 1, speed: 640, pr: 14, dmg: [5, 6], stat: 'cha', fire: 1, dot: ['burn', 4, [2, 4]], shape: 'orb', cd: 5, color: '#ff7a2a', desc: 'The river burns wherever it swims. 5d6 + CHA and 4s of burning.' });
  mv('eg_bessie', 'drop', { name: 'Bessie', type: 'buff', heal: [4, 8], healLvl: 5, healStat: 'cha', buff: { shield: [8, 50] }, cd: 12, color: '#6ac8ff', desc: 'The lake monster herself coils round you: heal 4d8 + CHA + 5 per level and a 50-point ward for 8s. The reward was never claimed.' });
  mv('eg_mossman', 'leaf', { name: 'Mossman', type: 'dash', dist: 260, behind: 1, buff: { haste: [4, 0.6], dmg: [4, 0.35] }, cd: 8, color: '#7fd68a', desc: 'The eastern bigfoot picks you up and puts you down behind them. 4s of +60% speed of hand and +35% damage.' });
  mv('eg_ship', 'star', { name: 'Push to Main', type: 'buff', ult: 1, cd: 30, buff: { haste: [7, 0.7], dmg: [7, 0.5] }, refresh: 1, restore: 100, heal: [4, 10], color: '#ffd36b', desc: 'No review. Every cooldown resets, heal 4d10, and 7s of shipping it: +70% speed of hand, +50% damage.' });
  // Erin
  mv('eg_cuyapup', 'fire', { name: 'Cuyapup: River Fire', type: 'proj', spell: 1, speed: 620, pr: 12, dmg: [4, 6], stat: 'wis', fire: 1, dot: ['burn', 4, [1, 6]], shape: 'orb', cd: 4, color: '#ff8a3a', desc: 'The burning river pup, born the night the crooked river caught fire: 4d6 + WIS and 4s of burning.' });
  mv('eg_bessling', 'drop', { name: 'Bessling: Lake Wake', type: 'buff', heal: [3, 8], healLvl: 5, healStat: 'wis', buff: { shield: [7, 40] }, cd: 10, color: '#7ad0ff', desc: 'The lake monster’s pup surfaces under you: heal 3d8 + WIS + 5 per level and a 40-point ward. Tough and lucky.' });
  mv('eg_grasskin', 'leaf', { name: 'Grasskin: Big Stomp', type: 'aoe', spell: 1, at: 'self', delay: 0.25, radius: 180, dmg: [4, 6], stat: 'wis', stun: 1.6, knock: 200, cd: 6, color: '#7fd68a', desc: 'The little mossman comes down with both feet: 4d6 + WIS around you and 1.6s of them finding their legs.' });
  mv('eg_hide', 'leaf', { name: 'Hide and Seek', type: 'buff', buff: { stealth: [3, 0], sneak: [3.5, 0], speed: [3, 0.3] }, cd: 9, color: '#58a868', desc: 'She was right there. 3s unseen, and the next blow lands as a sneak attack.' });
  mv('eg_towel', 'line', { name: 'Towel Whip', type: 'melee', range: 120, arc: 200, dmg: [3, 6], stat: 'wis', knock: 340, cd: 4, color: '#f0f0f4', desc: 'Go water yourself. 3d6 + WIS in a wide arc that sends them across the sand.' });
  mv('eg_stampede', 'leaf', { name: 'Sprout Stampede', type: 'buff', ult: 1, cd: 30, buff: { aura: [10, 0], speed: [10, 0.25] }, aura: { radius: 170, dmg: [3, 6], stat: 'wis', slow: 0.5 }, color: '#8fd66a', desc: 'Every sprout in the valley, at once. 10s of 3d6 + WIS twice a second to anyone near, and they wade.' });
  mv('eg_bike', 'line', { name: 'Bike Lane', type: 'dash', dist: 360, buff: { speed: [4, 0.5], haste: [4, 0.5] }, cd: 5, color: '#d83030', desc: 'He has right of way. Across the pit, then 4s of pedalling.' });
  mv('eg_turbo', 'paw', { name: 'Turbo Zoom', type: 'dash', dist: 300, behind: 1, buff: { dmg: [4, 0.5], haste: [4, 0.5] }, cd: 6, color: '#ffb060', desc: 'Behind them before the ears have landed. 4s of +50% damage.' });
  // Louie
  mv('eg_zoom', 'paw', { name: 'Zoom Zoom Zoom', type: 'dash', dist: 320, buff: { speed: [4, 0.6], haste: [4, 0.4] }, cd: 3, color: '#e89040', desc: 'Airplane ears. Gone, then 4s of being very fast.' });
  mv('eg_chomp', 'paw', { name: 'Chomp', type: 'melee', range: 80, arc: 100, lunge: 120, dmg: [5, 8], stat: 'dex', stun: 0.8, cd: 4, color: '#ffb060', desc: 'A good boy, briefly not. 5d8 + DEX.' });
  mv('eg_loaf', 'shield', { name: 'Need More Loaf', type: 'buff', heal: [4, 10], healLvl: 6, healStat: 'cha', buff: { shield: [6, 40] }, cd: 10, color: '#fff0d8', desc: 'He becomes a loaf. Heal 4d10 + CHA + 6 per level; loaves are hard to hurt.' });
  mv('eg_judge', 'star', { name: 'Judgement', type: 'aoe', ult: 1, spell: 1, at: 'self', delay: 0.5, radius: 300, dmg: [8, 8], stat: 'cha', stun: 3.2, cd: 30, color: '#ffe0a0', desc: 'The side-eye. 8d8 + CHA to the whole pit, and 3.2s of them thinking about what they did.' });
  // King Bibi
  mv('eg_redline', 'line', { name: 'Red Line', type: 'line', range: 620, width: 30, dmg: [5, 8], stat: 'cha', knock: 240, cd: 6, wind: 0.3, color: '#ff3030', desc: 'He draws it on the sand with a marker. 5d8 + CHA to anyone on it.' });
  mv('eg_dome', 'shield', { name: 'Iron Dome', type: 'buff', buff: { shield: [9, 90] }, cd: 11, color: '#a8c8ff', desc: 'A 90-point ward for 9s. He has been announcing it for thirty years.' });
  mv('eg_nextq', 'talk', { name: 'Next Question', type: 'dash', dist: 260, behind: 1, buff: { speed: [3, 0.4] }, cd: 5, color: '#f0f0f4', desc: 'He is no longer standing where the question was asked.' });
  mv('eg_filibuster', 'talk', { name: 'Filibuster', type: 'melee', spell: 1, range: 190, arc: 110, dmg: [1, 4], stat: 'cha', stun: 3.0, cone: '#c8d0e8', cd: 9, color: '#c8d0e8', desc: 'He begins to speak. 3s later he is still speaking, and they are still standing there.' });
  mv('eg_coalition', 'star', { name: 'Coalition', type: 'buff', ult: 1, cd: 30, buff: { shield: [10, 140], dmg: [10, 0.6], haste: [10, 0.4] }, heal: [6, 10], refresh: 1, color: '#ffd36b', desc: 'THE COALITION HOLDS. Heal 6d10, a 140-point ward, every cooldown reset, +60% damage for 10s.' });
  // a Sprout
  mv('eg_pluck', 'leaf', { name: 'Pluck', type: 'melee', range: 60, arc: 140, lunge: 140, dmg: [3, 6], stat: 'dex', cd: 1.6, wind: 0.08, rec: 0.1, color: '#8fd66a', desc: 'It grabs something of theirs and pulls: 3d6 + DEX, again and again.' });
  mv('eg_carry', 'leaf', { name: 'Carry', type: 'dash', dist: 280, behind: 1, buff: { speed: [3, 0.5] }, cd: 3, color: '#8fd66a', desc: 'Everything goes to the Lantern. It is behind them already.' });
  mv('eg_swarm', 'leaf', { name: 'Swarm', type: 'buff', cd: 9, buff: { aura: [6, 0] }, aura: { radius: 120, dmg: [2, 6], stat: 'dex', slow: 0.4 }, color: '#b8f08a', desc: 'B calls them. 6s of 2d6 + DEX twice a second to anyone standing in sprouts.' });
  mv('eg_patch', 'leaf', { name: 'The Whole Patch', type: 'buff', ult: 1, cd: 30, buff: { aura: [12, 0], haste: [12, 0.6], speed: [12, 0.4] }, aura: { radius: 200, dmg: [4, 6], stat: 'dex', slow: 0.6 }, heal: [4, 8], color: '#b8f08a', desc: 'The seeds grew legs. 12s of 4d6 + DEX twice a second across half the pit.' });

  [['eg_cindercap', 'eg_cuyapup'], ['eg_drizzlet', 'eg_bessling'], ['eg_fernfang', 'eg_grasskin'], ['eg_embercap', 'eg_cuyaflare'], ['eg_tidestag', 'eg_bessie'], ['eg_fernhowl', 'eg_mossman']].forEach(q => { A[q[0]] = A[q[1]]; IC[q[0]] = IC[q[1]]; });
  // ---------------------------------------------------------------- who they are
  const R = (id, name, bonus, skin, scale, desc) => hide(G.RACES, id, { name, bonus: Object.assign({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 }, bonus), skin, scale: scale || 1, desc, egg: 1 });
  R('eg_old', 'Something Old', { str: 2, dex: 2, con: 4, int: 6, wis: 6, cha: 8 }, '#d8c8b8', 1.08, 'Older than the pit.');
  R('eg_clanker', 'Clanker', { str: 7, con: 7, int: 4, cha: -2 }, '#c8d0dc', 1.05, 'Built in a data centre nobody admits to.');
  R('eg_bro', 'Bro', { str: 5, con: 5, cha: 4 }, '#f0c8a0', 1.04, 'Built different.');
  R('eg_founder', 'Founder', { str: 2, dex: 4, con: 3, int: 6, wis: 2, cha: 6 }, '#f0c8a0', 1, 'He made the cartridge. He can do what he likes in it.');
  R('eg_gardener', 'Gardener', { dex: 3, con: 3, wis: 8, cha: 4 }, '#f6d2b4', 0.97, 'The beds grow better when someone sings.');
  R('eg_shiba', 'Evolved Shiba', { str: 3, dex: 8, con: 3, cha: 8 }, '#fff0d8', 0.9, 'Est. 2018.');
  R('eg_incumbent', 'Incumbent', { con: 6, int: 4, cha: 8 }, '#e6b48e', 1, 'Again.');
  R('eg_sprout', 'Sprout', { dex: 9, con: 2, wis: 3, cha: 4 }, '#8fd66a', 0.58, 'A seed that grew legs.');
  const E = G.EGGS = {
    david: { name: 'David Roseinbeirg', clsName: 'Keeper of the Hour', frame: 'sorcerer', race: 'eg_old', ring: 'hourmark', known: ['eg_sand', 'eg_called', 'dv_second'], ult: 'eg_midnight', fin: [1, 'Your Hour Is Up', 'COLLECTED'], coin: 9999,
      tint: { cloth: '#2a1a3a', armor: '#1a1024', armor2: '#120a1a', trim: '#f0c95a', hair: '#e8e2f4' }, cos: { head: 'widehat', back: 'greatcloak', aura: 'gold' }, tag: 'The landlord, slumming it in his own pit.', says: 'Look at this. My own sand. My own meat. I should have come up here years ago.' },
    bottie: { name: 'Lil Bottie', clsName: 'Super Soldier', frame: 'fighter', arm: 'f_basic', race: 'eg_clanker', known: ['eg_clanker', 'eg_chain', 'eg_airsup'], ult: 'eg_nuke', fin: [1, 'Latte-ality', 'SERVED'], coin: 200, skin: '#c8d0dc',
      tint: { armor: '#b8c0cc', armor2: '#3a4050', trim: '#40a0ff', legs: '#1c1c24', hair: '#101420' }, civ: { arm: '#b8c0cc', fore: '#a0a8b6', shin: '#1c1c24', shoe: '#0c0c12', hair: 'none', boot: 1, w: 0.72 }, tag: 'Clanker guns. Chain stun.', says: 'SMILE.EXE COMPLETE. I HAVE NO CONTEXT. ONLY FISTS.' },
    marcus: { name: 'Marcus', clsName: 'Plumbing Boss', frame: 'fighter', arm: 'f_hammer', race: 'eg_bro', known: ['eg_wrench', 'eg_dab', 'eg_double'], ult: 'eg_hydro', fin: [1, 'Derek Pulls Up', 'NOT AGAIN'], finDef: { id: 'derek', lead: 'derek', imp: 1.8, tail: 3.3, keep: 1, cast: false, name: 'Derek Pulls Up', word: 'NOT AGAIN', sig: 2 }, coin: 777, skin: '#f0c8a0',
      tint: { armor: '#1c64c8', armor2: '#28324a', trim: '#f4f4f0', legs: '#28324a', hair: '#5a3a22' }, civ: { arm: '#1c64c8', fore: '#f0c8a0', shin: '#28324a', shoe: '#6a4424', hair: 'short', boot: 1, w: 0.7 }, tag: 'All gas, bro.', says: 'Bro. Is this a sewer? I could fix this whole place in a weekend, bro.' },
    will: { name: 'Will', clsName: 'The Developer', frame: 'rogue', arm: 'r_basic', race: 'eg_founder', known: ['eg_selfie', 'eg_cuyaflare', 'eg_bessie', 'eg_mossman', 'eg_laser', 'eg_bike'], ult: 'eg_ship', fin: [1, 'Selfie-ality', 'POSTED'], coin: 500,
      skin: '#f0c8a0', tint: { armor: '#24222c', armor2: '#d83030', trim: '#24222c', legs: '#d83030', hair: '#5e3c22' }, civ: { arm: '#24222c', fore: '#f0c8a0', shin: '#f0c8a0', shoe: '#f4f4f4', hair: 'short', w: 0.6 }, tag: 'That was a feature, not a bug.', says: 'GG. Pushing to main.' },
    erin: { name: 'Erin', clsName: 'Keeper of the Garden', frame: 'druid', race: 'eg_gardener', known: ['eg_cuyapup', 'eg_bessling', 'eg_grasskin', 'eg_towel', 'eg_hide'], ult: 'eg_stampede', fin: [1, 'Garden-ality', 'PLANTED'], coin: 300,
      skin: '#f6d2b4', tint: { armor: '#2e8a58', armor2: '#3a5a90', trim: '#2e8a58', legs: '#3a5a90', hair: '#74482c' }, civ: { arm: '#2e8a58', fore: '#2e8a58', shin: '#3a5a90', shoe: '#f4f4f4', hair: 'long', w: 0.56 }, tag: 'A slow day is still a good day.', says: 'Nice and steady. Cuyapup, Bessling, Grasskin: stay close.' },
    louie: { name: 'Louie', clsName: 'Good Boy', frame: 'druid', race: 'eg_shiba', beast: { kind: 'wolf', col: 0xe89040 }, known: ['eg_zoom', 'eg_chomp', 'eg_loaf', 'eg_turbo'], ult: 'eg_judge', fin: [0, 'Bork-ality', 'BORKED'], coin: 60,
      tint: {}, tag: 'Evolved Shiba. Much victory.', says: 'Woof. (Is it pâté time?)' },
    bibi: { name: 'King Bibi', clsName: 'Prime Minister, Again', frame: 'fighter', arm: 'f_basic', race: 'eg_incumbent', known: ['eg_redline', 'eg_dome', 'eg_filibuster', 'eg_nextq'], ult: 'eg_coalition', fin: [1, 'Filibuster-ality', 'ADJOURNED'], coin: 1200, crown: 1,
      skin: '#e6b48e', tint: { armor: '#24304c', armor2: '#1c2640', trim: '#24304c', legs: '#24304c', hair: '#f0f0f4' }, civ: { arm: '#24304c', fore: '#24304c', shin: '#24304c', shoe: '#121216', hair: 'short', boot: 1, w: 0.72 }, tag: 'I always come back.', says: 'Citizens. Next question.' },
    sprout: { name: 'A Sprout', clsName: 'Seedling', frame: 'rogue', arm: 'r_basic', race: 'eg_sprout', known: ['eg_pluck', 'eg_carry', 'eg_swarm'], ult: 'eg_patch', fin: [1, 'Compost-ality', 'COMPOSTED'], coin: 5, leaf: 1,
      skin: '#8fd66a', tint: { armor: '#7acc58', armor2: '#6ab84a', trim: '#7acc58', legs: '#6ab84a', hair: '#2e7a2a' }, civ: { arm: '#7acc58', fore: '#8fd66a', shin: '#8fd66a', shoe: '#5aa040', hair: 'none', w: 0.6 }, tag: 'It follows you. That is a sprout.', says: '!' }
  };
  G.clsName = h => (h && h.egg && E[h.egg] ? E[h.egg].clsName : (G.CLASSES[h && h.cls] || {}).name || '');

  // ---------------------------------------------------------------- how they look
  const look0 = G.lookOf;
  G.lookOf = function (h, st) { const l = look0.apply(this, arguments), e = h && h.egg && E[h.egg]; if (!l || !e) return l;
    l.tint = Object.assign({}, e.tint); l.egg = h.egg; if (e.skin) l.skin = e.skin; if (e.civ) { l.civ = e.civ; l.kit = null; l.gear = { weapon: 0, armor: 0 }; l.cos = {}; l.rank = 0; } if (e.ring) l.ring = e.ring; if (e.cos) l.cos = Object.assign({}, l.cos, e.cos); if (e.beast) l.beast = e.beast; return l; };
  const lam = col => new T.MeshLambertMaterial({ color: col, flatShading: true }), lit = col => new T.MeshBasicMaterial({ color: col });
  G.EGG_MODEL = function (id, p) { const e = E[id]; if (!e) return; const add = (par, w, h, d, col, x, y, z, mat) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat || lam(col)); m.position.set(x, y, z); par.add(m); return m; }, H = p.head, To = p.torso, w = p.w || 0.6;
    if (e.crown) { add(H, 0.36, 0.07, 0.36, 0xf0c95a, 0, 0.27, 0); [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14], [0, 0.16], [0, -0.16]].forEach(q => add(H, 0.06, 0.13, 0.06, 0xf0c95a, q[0], 0.36, q[1])); add(H, 0.05, 0.05, 0.03, 0xd83030, 0, 0.28, 0.185, lit(0xd83030));
      add(To, 0.16, 0.3, 0.03, 0xf4f4f4, 0, 0.5, 0.222); add(To, 0.07, 0.36, 0.035, 0xc02030, 0, 0.42, 0.235); [-1, 1].forEach(sd => { const l = add(To, 0.1, 0.34, 0.03, 0x1c2640, sd * 0.1, 0.48, 0.228); l.rotation.z = sd * 0.25; }); const mk = add(p.hR, 0.05, 0.05, 0.3, 0xd83030, 0, 0, 0.14); mk.userData.keep = 1; }
    if (id === 'sprout') { add(H, 0.05, 0.24, 0.05, 0x3a8a2a, 0, 0.34, 0); const a = add(H, 0.34, 0.03, 0.18, 0x5ac83a, 0.16, 0.48, 0), b = add(H, 0.34, 0.03, 0.18, 0x5ac83a, -0.16, 0.48, 0); a.rotation.z = 0.5; b.rotation.z = -0.5; [-1, 1].forEach(sd => add(H, 0.1, 0.06, 0.03, 0xf8a0a0, sd * 0.17, -0.06, 0.23)); }
    if (id === 'bottie') { add(H, 0.56, 0.5, 0.52, 0xc8d0dc, 0, 0.02, 0).material = new T.MeshPhongMaterial({ color: 0xc8d0dc, flatShading: true, shininess: 80, specular: 0x888888 }); add(H, 0.44, 0.14, 0.04, 0x101420, 0, 0.05, 0.27); [-1, 1].forEach(sd => add(H, 0.1, 0.07, 0.03, 0x40a0ff, sd * 0.11, 0.05, 0.29, lit(0x40a0ff))); add(H, 0.2, 0.03, 0.03, 0x40a0ff, 0, -0.12, 0.27, lit(0x40a0ff));
      add(H, 0.03, 0.22, 0.03, 0x3a4050, 0.16, 0.38, 0); add(H, 0.08, 0.08, 0.08, 0xff4040, 0.16, 0.5, 0, lit(0xff4040)); [-1, 1].forEach(sd => add(H, 0.06, 0.16, 0.16, 0x3a4050, sd * 0.31, 0.02, 0)); add(To, 0.3, 0.2, 0.03, 0x101420, 0, 0.46, 0.225); add(To, 0.1, 0.1, 0.035, 0x40a0ff, 0, 0.46, 0.235, lit(0x40a0ff));
      [p.foreR, p.foreL].forEach(fr => { add(fr, 0.26, 0.2, 0.28, 0x3a4050, 0, -0.14, 0); [-0.06, 0.06].forEach(x => add(fr, 0.07, 0.07, 0.3, 0x20242e, x, -0.2, 0.2)); }); }
    if (id === 'marcus') { add(H, 0.4, 0.13, 0.4, 0x1c64c8, 0, 0.25, 0); add(H, 0.34, 0.035, 0.22, 0x124a98, 0, 0.2, 0.28); add(H, 0.14, 0.07, 0.02, 0xf4f4f0, 0, 0.26, 0.205); add(H, 0.3, 0.12, 0.06, 0x5a3a22, 0, -0.17, 0.2);
      add(To, 0.22, 0.1, 0.02, 0xf4f4f0, 0.14, 0.5, 0.225); add(To, w * 0.9, 0.06, 0.46, 0x6a4424, 0, 0.06, 0);
      const wr = new T.Group(); wr.userData.keep = 1; p.hR.add(wr); add(wr, 0.06, 0.06, 0.7, 0xc02020, 0, 0, 0.36); add(wr, 0.08, 0.2, 0.1, 0xb0b4bc, 0, 0.05, 0.74); add(wr, 0.08, 0.07, 0.2, 0xb0b4bc, 0, 0.13, 0.82); add(wr, 0.08, 0.07, 0.16, 0xb0b4bc, 0, -0.04, 0.8); }
    if (id === 'will') { [-1, 1].forEach(sd => { add(H, 0.13, 0.1, 0.03, 0x1c161c, sd * 0.1, 0.035, 0.26); add(H, 0.09, 0.06, 0.035, 0xd8e8ee, sd * 0.1, 0.035, 0.265, lit(0xa8d0e8)); add(H, 0.02, 0.03, 0.26, 0x1c161c, sd * 0.25, 0.04, 0.13); }); add(H, 0.08, 0.025, 0.03, 0x1c161c, 0, 0.05, 0.26); add(H, 0.26, 0.1, 0.05, 0x8a5630, 0, -0.2, 0.2);
      const ph = add(p.hR, 0.12, 0.02, 0.22, 0x101014, 0, 0, 0.12); ph.userData.keep = 1; add(p.hR, 0.1, 0.022, 0.18, 0x80c8ff, 0, 0.004, 0.12, lit(0x80c8ff)); }
    if (id === 'erin') { add(H, 0.62, 0.04, 0.62, 0xc89a62, 0, 0.22, 0); add(H, 0.32, 0.14, 0.32, 0xc89a62, 0, 0.29, 0); add(H, 0.33, 0.04, 0.33, 0xf0a8a0, 0, 0.25, 0); [-1, 1].forEach(sd => add(H, 0.08, 0.05, 0.03, 0xf0a8a0, sd * 0.16, -0.06, 0.235));
      add(To, 0.5, 0.42, 0.03, 0xe8dcc0, 0, 0.3, 0.225); add(To, 0.2, 0.14, 0.035, 0xc8b890, 0, 0.26, 0.24);
      const tw = add(p.hR, 0.16, 0.03, 0.7, 0xf4f4f4, 0, 0, 0.4); tw.userData.keep = 1; add(p.hR, 0.16, 0.035, 0.08, 0x58a8e8, 0, 0, 0.62); } };
  // props for the finishers
  G.eggProp = function (k) {
    if (k === 'van') { const g = new T.Group(), bx = (w, h, d, col, x, y, z, mat) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat || lam(col)); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m; };
      bx(1.7, 1.5, 2.6, 0xf4f4f0, 0, 1.15, -0.5); bx(1.7, 0.95, 1.1, 0xf4f4f0, 0, 0.88, 1.3); bx(1.72, 0.34, 3.72, 0x1c64c8, 0, 0.78, 0.05); bx(1.5, 0.5, 0.06, 0x203040, 0, 1.2, 1.86, lam(0x28405a)); bx(1.74, 0.3, 0.9, 0x1c64c8, 0, 1.5, -0.6);
      bx(1.8, 0.16, 0.2, 0x3a3a40, 0, 0.42, 1.92); [-0.6, 0.6].forEach(x => bx(0.26, 0.16, 0.05, 0xfff0a0, x, 0.72, 1.87, lit(0xfff0a0))); [-1, 1].forEach(sd => [1.15, -1.2].forEach(z => { const wh = new T.Mesh(new T.CylinderGeometry(0.36, 0.36, 0.24, 10), lam(0x15131a)); wh.rotation.z = Math.PI / 2; wh.position.set(sd * 0.82, 0.36, z); g.add(wh); }));
      [-1, 1].forEach(sd => { const tx = new T.Mesh(new T.PlaneGeometry(1.9, 0.5), new T.MeshBasicMaterial({ map: sign(), transparent: true })); tx.position.set(sd * 0.88, 1.5, -0.6); tx.rotation.y = sd * Math.PI / 2; g.add(tx); }); const lad = bx(0.5, 0.06, 2.2, 0xc8ccd4, 0.4, 1.95, -0.5); bx(0.16, 0.16, 2.4, 0xd0d4dc, -0.45, 1.98, -0.5); return g; }
    if (k === 'derek') return G.makeChar({ cls: 'fighter', race: 'human', egg: '_derek', skin: '#d8a880', tint: { armor: '#1c64c8', armor2: '#3a3a44', trim: '#1c64c8', legs: '#3a3a44', hair: '#2a1c14' }, civ: { arm: '#1c64c8', fore: '#d8a880', shin: '#3a3a44', shoe: '#4a3020', hair: 'short', boot: 1, w: 0.78 } });
    return null; };
  let _sign = null; function sign() { if (_sign) return _sign; const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.font = 'bold 44px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FLOW PROS', 128, 34); _sign = new T.CanvasTexture(c); return _sign; }
  E._derek = { hidden: 1, frame: 'fighter' };
  // ---------------------------------------------------------------- their finisher, by name
  const m0 = G.mortalOf;
  if (m0) G.mortalOf = function (st) { const h = st && st.hero, e = h && h.egg && E[h.egg], list = e && G.MORTALS && G.MORTALS[h.cls]; if (!e || !list || !list.length) return m0.apply(this, arguments);
    if (e.finDef) return Object.assign({}, e.finDef); return Object.assign({}, list[Math.min(list.length - 1, e.fin[0])], { name: e.fin[1], word: e.fin[2], sig: 1 }); };
  // Louie fights as what he is
  if (G.forms && G.forms.FORMS) G.forms.FORMS.shiba = { basic: 'bite_wolf', kind: 'wolf', scale: 0.92, col: 0xe89040 };
  const fs0 = G.fight.start;
  G.fight.start = function () { (G._eggJunk || []).forEach(o => o.parent && o.parent.remove(o)); G._eggJunk = []; const r = fs0.apply(this, arguments), F = G.fight, h = G.state && G.state.hero, e = h && h.egg && E[h.egg];
    try { if (e && e.beast && F.P && !F.ex) { F.P.buffs.form = { t: 99999, amt: 0 }; G.forms.start(F.P, 'shiba', { buff: { form: [99999, 0] }, color: '#e89040' }); } } catch (err) { } return r; };

  // ---------------------------------------------------------------- starting one
  function begin(id, slot) { const e = E[id]; G.setSlot(slot); G.wipeSlot(slot); const st = G.state = G.newState(), h = st.hero = G.newHero(e.name, e.race, e.frame);
    h.egg = id; h.known = e.known.slice(); h.slots = e.known.slice(0, 3); h.ult = e.ult; if (e.arm) { h.arm = e.arm; st.arms = st.arms || {}; st.arms[e.arm] = 1; } if (e.ring) { h.ring = e.ring; st.rings = st.rings || {}; st.rings[e.ring] = 1; }
    st.coin = e.coin; st.kitPicked = 1; st.kitShown = 1; st.tourAsked = 1; st.eggRun = id; G.save(); G.applyOpts(); ui._coin = st.coin; ui.hub();
    setTimeout(() => { if (ui.isOpen() || G.talk) return; ui._show('<div class="card small"><small class="over">The Guest List</small><h2>' + G.esc(e.name) + '</h2><p class="quote">“' + e.says + '”</p><p class="dim">' + G.RACES[e.race].name + ' · ' + e.clsName + '. Nothing about this is fair.</p><div class="row end"><button class="big" id="ok">Into the market</button></div></div>'); ui._on('#ok', () => ui.close()); }, 400); }
  ui.guests = function () { const ids = Object.keys(E).filter(k => !E[k].hidden);
    ui._show('<div class="card"><small class="over">You were not supposed to find this</small><h2>The Guest List</h2><p class="dim">Friends of the house. Their moves cannot be learned, and the pit is not ready for them.</p><div class="stances guests">' +
      ids.map(id => { const e = E[id]; return '<button class="stance" data-egg="' + id + '"><span class="eg-p" data-ep="' + id + '"></span><b>' + G.esc(e.name) + '</b><small>' + G.RACES[e.race].name + ' · ' + e.clsName + '</small></button>'; }).join('') + '</div><div class="row end"><button class="big" id="x">Back</button></div></div>');
    ids.forEach(id => { const el = document.querySelector('[data-ep="' + id + '"]'), e = E[id]; try { el.appendChild(G.portrait(G.lookOf({ cls: e.frame, race: e.race, egg: id }, null), 84)); } catch (err) { } });
    ui._on('#x', () => ui.title()); ui._on('[data-egg]', b => pick(b.dataset.egg)); };
  function pick(id) { const e = E[id], all = [1, 2, 3].map(n => G.slotInfo(n)), free = all.findIndex(q => !q);
    ui._show('<div class="card small"><small class="over">' + G.RACES[e.race].name + ' · ' + e.clsName + '</small><h2>' + G.esc(e.name) + '</h2><p class="quote">“' + e.tag + '”</p><div class="eg-moves">' + e.known.concat([e.ult]).map(k => '<div><b>' + A[k].name + (A[k].ult ? ' <i>ultimate</i>' : '') + '</b><small>' + A[k].desc + '</small></div>').join('') + '</div><p class="dim">Finisher: ' + e.fin[1] + '.</p><div class="row end"><button id="n">Back</button>' +
      (free >= 0 ? '<button class="big" id="y">Play (page ' + (free + 1) + ')</button>' : all.map((q, i) => '<button class="danger" data-rep="' + (i + 1) + '">Replace ' + G.esc(q.hero.name) + '</button>').join('')) + '</div></div>');
    ui._on('#n', () => ui.guests()); ui._on('#y', () => begin(id, free + 1)); ui._on('[data-rep]', b => begin(id, +b.dataset.rep)); }

  // ---------------------------------------------------------------- finding it
  const found = () => { try { return localStorage.getItem('guttercrown_guests') === '1'; } catch (e) { return false; } }, mark = () => { try { localStorage.setItem('guttercrown_guests', '1'); } catch (e) { } };
  const open = () => { if (G.scene !== 'title' && !document.querySelector('#panel .title-wrap')) return; mark(); G.sfx('level'); ui.guests(); };
  const t0 = ui.title;
  ui.title = function () { const r = t0.apply(this, arguments), logo = document.querySelector('#panel .logo'), menu = document.querySelector('#panel .menu'); let taps = 0, last = 0;
    if (logo) logo.addEventListener('click', () => { const now = Date.now(); taps = now - last < 900 ? taps + 1 : 1; last = now; if (taps >= 5) { taps = 0; open(); } });
    if (found() && menu && !document.getElementById('bGuests')) { const b = document.createElement('button'); b.id = 'bGuests'; b.textContent = 'The Guest List'; b.onclick = () => { G.sfx('ui'); ui.guests(); }; (document.getElementById('bMarc') || menu.lastElementChild).insertAdjacentElement('afterend', b); }
    return r; };
  let typed = ''; window.addEventListener('keydown', ev => { if (!document.querySelector('#panel .title-wrap') || !ev.key || ev.key.length !== 1) return; typed = (typed + ev.key.toLowerCase()).slice(-5); if (typed === 'louie') { typed = ''; open(); } });
  let held = 0; setInterval(() => { if (!document.querySelector('#panel .title-wrap')) { held = 0; return; } let on = false; try { const gp = navigator.getGamepads ? navigator.getGamepads() : []; for (const p of gp) if (p && p.buttons[4] && p.buttons[5] && p.buttons[4].pressed && p.buttons[5].pressed) on = true; } catch (e) { } held = on ? held + 1 : 0; if (held >= 6) { held = 0; open(); } }, 200);
})();
