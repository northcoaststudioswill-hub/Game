// Guttercrown — twelve more techniques for hire, two per trade, built from rules the pit already has
(function () {
  'use strict';
  const G = window.G, A = G.ABILITIES;
  const M = (id, cls, cost, rank, o) => { A[id] = Object.assign({ id, cost: 20, cd: 8, wind: 0.16, rec: 0.2 }, o); (G.EXTRA[cls] = G.EXTRA[cls] || []).push(id); (G.TEACH_EXTRA = G.TEACH_EXTRA || {})[id] = [cost, rank]; };
  // fighter
  M('bull_rush', 'fighter', 180, 1, { name: 'Bull Rush', type: 'melee', armor: 1, cost: 22, cd: 9, wind: 0.22, rec: 0.3, range: 70, arc: 80, lunge: 220, dmg: [2, 6], stat: 'str', knock: 440, pz: 1.8, mv: 'bash', color: '#e8a060', kind: 'Maneuver', role: 'Control', desc: 'Put your shoulder down and go. 2d6 + STR and a shove that carries them into the wall, or onto the spikes.' });
  M('hamstring', 'fighter', 160, 1, { name: 'Hamstring', type: 'melee', cost: 16, cd: 7, wind: 0.14, rec: 0.2, range: 82, arc: 100, dmg: [1, 8], stat: 'str', slow: [0.55, 4], mv: 'lowcut', color: '#d0c0a0', kind: 'Maneuver', role: 'Control', desc: 'A low cut behind the knee: 1d8 + STR, and they move at half pace for 4s.' });
  // rogue
  M('gut_cut', 'rogue', 200, 2, { name: 'Open Them Up', type: 'melee', cost: 22, cd: 8, wind: 0.12, rec: 0.22, range: 66, arc: 50, dmg: [3, 6], stat: 'dex', dot: ['poison', 4, [1, 4]], mv: 'backstab', color: '#c85050', kind: 'Cunning Action', role: 'Damage', desc: 'In close and under the ribs: 3d6 + DEX, and they keep bleeding for 4s.' });
  M('tumble', 'rogue', 120, 0, { name: 'Tumble', type: 'dash', cost: 12, cd: 4, wind: 0.04, rec: 0.08, dist: 170, buff: { speed: [2, 0.35] }, color: '#d8e0e8', kind: 'Cunning Action', role: 'Mobility', desc: 'Roll out of trouble, and keep moving faster for 2s.' });
  // sorcerer
  M('thunderwave', 'sorcerer', 200, 1, { name: 'Thunderwave', type: 'aoe', at: 'self', cost: 26, cd: 9, wind: 0.18, rec: 0.2, radius: 130, dmg: [2, 8], stat: 'cha', knock: 400, pz: 2, cs: 'nova', color: '#8ab0ff', kind: '1st-level spell', role: 'Control', desc: 'A clap of thunder from your hands: 2d8 + CHA around you, and everything near is thrown back.' });
  M('scorching_ray', 'sorcerer', 240, 2, { name: 'Scorching Ray', type: 'proj', cost: 22, cd: 6, wind: 0.16, rec: 0.18, speed: 980, pr: 7, dmg: [2, 6], stat: 'cha', fire: 1, dot: ['burn', 3, [1, 4]], cs: 'snap', color: '#ff7a2a', kind: '2nd-level spell', role: 'Damage', desc: 'A fast line of fire: 2d6 + CHA, and they burn for 3s.' });
  // cleric
  M('spirit_hammer', 'cleric', 200, 1, { name: 'Spiritual Hammer', type: 'aoe', at: 'target', cost: 22, cd: 7, wind: 0.18, rec: 0.2, delay: 0.3, radius: 52, dmg: [2, 8], stat: 'wis', radiant: 1, stun: 0.45, cs: 'point', color: '#ffe080', kind: '2nd-level spell', role: 'Damage', desc: 'A hammer of light comes down on them from nowhere: 2d8 + WIS and a short stun.' });
  M('sanctuary', 'cleric', 180, 2, { name: 'Sanctuary', type: 'buff', cost: 26, cd: 15, wind: 0.2, rec: 0.12, buff: { shield: [5, 18], speed: [3, 0.2] }, shieldLvl: 4, heal: [1, 6], healStat: 'wis', healLvl: 1, cs: 'bless', color: '#fff4c0', kind: '1st-level spell', role: 'Defense', desc: 'A ward, a little mending and lighter feet: a shield, 1d6 + WIS health, and 20% speed for 3s.' });
  // druid
  M('ice_knife', 'druid', 160, 1, { name: 'Ice Knife', type: 'proj', cost: 16, cd: 5, wind: 0.14, rec: 0.18, speed: 860, pr: 8, dmg: [1, 10], stat: 'wis', slow: [0.4, 2], shape: 'shard', cs: 'throw', color: '#a8e0ff', kind: '1st-level spell', role: 'Control', desc: 'A shard of cave ice: 1d10 + WIS, and the cold slows them for 2s.' });
  M('entangle', 'druid', 200, 2, { name: 'Entangle', type: 'aoe', at: 'target', cost: 24, cd: 11, wind: 0.2, rec: 0.2, delay: 0.45, radius: 84, dmg: [1, 6], stat: 'wis', slow: [0.7, 3], cs: 'plant', color: '#6ac070', kind: '1st-level spell', role: 'Control', desc: 'Roots come up through the sand where they stand: 1d6 + WIS and they are held to a crawl for 3s.' });
  // warlock
  M('void_rift', 'warlock', 220, 2, { name: 'Hunger of the Pit', type: 'aoe', at: 'target', cost: 26, cd: 10, wind: 0.22, rec: 0.2, delay: 0.5, radius: 100, dmg: [2, 6], stat: 'cha', slow: [0.5, 3], dot: ['poison', 3, [1, 4]], cs: 'call', color: '#5a3aa0', kind: '3rd-level spell', role: 'Control', desc: 'A patch of black opens under them: 2d6 + CHA, slowed, and it keeps eating for 3s.' });
  M('fade_out', 'warlock', 140, 0, { name: 'Fade Out', type: 'dash', cost: 16, cd: 6, wind: 0.04, rec: 0.08, dist: 200, buff: { stealth: [1.6, 0] }, color: '#9a7ad0', kind: 'Invocation', role: 'Mobility', desc: 'Step back into the dark and out of sight for a moment.' });
})();
