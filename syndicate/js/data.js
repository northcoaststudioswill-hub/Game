// Underground Syndicate — game data: races, classes, abilities, opponents, ranks, decor, gear
(function () {
  const G = window.G;

  G.STATS = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  G.STAT_INFO = {
    str: ['Strength', 'Weapon damage'],
    dex: ['Dexterity', 'Crit chance, move speed, dodge recovery'],
    con: ['Constitution', 'Hit points'],
    int: ['Intelligence', 'Cooldown recovery'],
    wis: ['Wisdom', 'Resource regeneration, healing'],
    cha: ['Charisma', 'Respect and coin earned']
  };

  G.RACES = {
    human: { name: 'Human', bonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, desc: '+1 to every ability. Adaptable, hungry, everywhere.', skin: '#c9977a', scale: 1 },
    dwarf: { name: 'Dwarf', bonus: { con: 2, wis: 1 }, desc: '+2 Constitution, +1 Wisdom. Born under stone and hard to put down.', skin: '#c08a6c', scale: 0.86 },
    elf: { name: 'Elf', bonus: { dex: 2, int: 1 }, desc: '+2 Dexterity, +1 Intelligence. Quick hands, long memory.', skin: '#d8c3ae', scale: 1.03 },
    halforc: { name: 'Half-Orc', bonus: { str: 2, con: 1 }, desc: '+2 Strength, +1 Constitution. The pit crowd loves a bruiser.', skin: '#7f9a62', scale: 1.1 },
    tiefling: { name: 'Tiefling', bonus: { cha: 2, int: 1 }, desc: '+2 Charisma, +1 Intelligence. Infernal blood and a face people remember.', skin: '#b5564e', scale: 1.02 }
  };

  // Ability types: melee (arc in front), proj, line (instant), aoe (delayed blast), dash, buff
  const A = G.ABILITIES = {
    // ---------------- Fighter ----------------
    f_basic: { name: 'Longsword', type: 'melee', basic: 1, cost: 6, wind: 0.16, rec: 0.2, range: 66, arc: 110, dmg: [1, 8], stat: 'str', gain: 11, color: '#dfe6ee', desc: 'Slash for 1d8 + STR. Costs 6 Stamina, refunded with interest on a hit. The third hit of a clean combo is a finisher.' },
    shield_bash: { name: 'Shield Bash', type: 'melee', armor: 1, cost: 20, cd: 6, wind: 0.22, rec: 0.25, range: 70, arc: 80, lunge: 80, dmg: [1, 6], stat: 'str', stun: 1.1, knock: 160, color: '#c9b27a', icon: 'shield', desc: 'Lunge and slam for 1d6 + STR. Stuns for 1.1s.' },
    second_wind: { name: 'Second Wind', type: 'buff', cost: 0, cd: 16, wind: 0.1, rec: 0.15, heal: [1, 10], healLvl: 4, healStat: 'con', color: '#7fd68a', icon: 'cross', desc: 'Catch your breath: heal 1d10 + CON + 4 per level.' },
    cleave: { name: 'Sweeping Cleave', type: 'melee', armor: 1, cost: 25, cd: 5, wind: 0.3, rec: 0.3, range: 84, arc: 230, dmg: [2, 6], stat: 'str', knock: 260, color: '#e8eef5', icon: 'sword', desc: 'A wide arc for 2d6 + STR that hurls the target back.' },
    leap_slam: { name: 'Leaping Slam', type: 'aoe', armor: 1, at: 'point', leap: 1, castRange: 250, cost: 30, cd: 8, wind: 0.45, rec: 0.3, radius: 84, dmg: [2, 8], stat: 'str', slow: [0.5, 2], color: '#e0a560', icon: 'burst', desc: 'Leap to a spot and crash down: 2d8 + STR in an area, slowing for 2s.' },
    relentless: { name: 'Relentless Assault', type: 'buff', cost: 25, cd: 14, wind: 0.1, rec: 0.1, buff: { haste: [5, 0.5] }, color: '#ff8a5c', icon: 'up', desc: 'Attack 50% faster for 5s.' },
    riposte: { name: 'Riposte', type: 'buff', cost: 20, cd: 8, wind: 0.04, rec: 0.1, buff: { counter: [0.9, 0] }, color: '#9fd0ff', icon: 'shield', desc: 'Guard for 0.9s. The next hit is negated and answered with 3d8 + STR and a stun.' },
    riposte_hit: { name: 'Riposte', type: 'melee', dmg: [3, 8], stat: 'str', stun: 0.9, knock: 200, color: '#9fd0ff' },
    action_surge: { name: 'Action Surge', type: 'buff', ult: 1, cost: 0, cd: 30, wind: 0.15, rec: 0.1, buff: { haste: [5, 0.6], dmg: [5, 0.25] }, refresh: 1, restore: 100, color: '#ffd36b', icon: 'up', desc: 'Reset every cooldown, refill Stamina, then gain +60% attack speed and +25% damage for 5s.' },

    // ---------------- Rogue ----------------
    r_basic: { name: 'Twin Daggers', type: 'melee', basic: 1, cost: 4, wind: 0.1, rec: 0.14, range: 56, arc: 100, dmg: [1, 4], stat: 'dex', gain: 8, color: '#cfd8e0', desc: 'Fast stabs for 1d4 + DEX. Costs 4 Focus, refunded with interest on a hit. The third hit of a clean combo is a finisher.' },
    shadowstep: { name: 'Shadowstep', type: 'dash', cost: 20, cd: 6, wind: 0.04, rec: 0.08, dist: 230, behind: 1, buff: { sneak: [2.5, 0] }, color: '#a070ff', icon: 'dash', desc: 'Vanish and reappear behind your foe. Your next hit within 2.5s is a Sneak Attack (auto-crit, bonus d6s).' },
    fan_knives: { name: 'Fan of Knives', type: 'proj', cost: 20, cd: 5, wind: 0.14, rec: 0.2, count: 5, spread: 0.9, speed: 640, pr: 7, dmg: [1, 4], stat: 'dex', color: '#d9e2ea', icon: 'arrow', shape: 'knife', desc: 'Throw five knives in a fan. Each deals 1d4 + DEX.' },
    poison_blade: { name: 'Poisoned Blade', type: 'melee', cost: 20, cd: 7, wind: 0.14, rec: 0.2, range: 60, arc: 90, lunge: 40, dmg: [1, 6], stat: 'dex', dot: ['poison', 5, [1, 4]], color: '#8fe05a', icon: 'sword', desc: 'Stab for 1d6 + DEX and poison for 1d4 every half second for 5s.' },
    smoke_bomb: { name: 'Smoke Bomb', type: 'buff', cost: 25, cd: 12, wind: 0.08, rec: 0.1, buff: { stealth: [3, 0], sneak: [4, 0], speed: [3, 0.3] }, smoke: 1, color: '#9aa3ad', icon: 'burst', desc: 'Disappear for 3s and move faster. Your next hit is a Sneak Attack.' },
    death_mark: { name: 'Death Mark', type: 'melee', armor: 1, cost: 30, cd: 10, wind: 0.2, rec: 0.3, range: 62, arc: 80, lunge: 100, dmg: [4, 6], stat: 'dex', execute: 1, color: '#ff4466', icon: 'sword', desc: 'Lunge for 4d6 + DEX. Deals double damage to targets below 40% health.' },
    dirty_trick: { name: 'Dirty Trick', type: 'melee', spell: 1, cost: 20, cd: 9, wind: 0.14, rec: 0.2, range: 130, arc: 60, dmg: [1, 4], stat: 'dex', stun: 1.6, steal: 10, cone: '#c8b48a', color: '#c8b48a', icon: 'burst', desc: 'Pocket sand. 1d4 + DEX, blinds for 1.6s, and lifts 10 coin from their purse.' },
    flurry: { name: 'Flurry of Shadows', type: 'dash', ult: 1, cost: 0, cd: 28, wind: 0.1, rec: 0.2, dist: 210, behind: 1, repeat: 4, pathDmg: 1, dmg: [2, 6], stat: 'dex', color: '#c79bff', icon: 'dash', desc: 'Blink through your foe four times. Each pass deals 2d6 + DEX.' },

    // ---------------- Sorcerer ----------------
    s_basic: { name: 'Fire Bolt', type: 'proj', basic: 1, cost: 5, wind: 0.2, rec: 0.22, speed: 660, pr: 9, dmg: [1, 8], stat: 'cha', fire: 1, gain: 7, color: '#ff8a3c', shape: 'orb', desc: 'Hurl a mote of fire for 1d8 + CHA. Costs 5 Mana, refunded with interest on a hit.' },
    burning_hands: { name: 'Burning Hands', type: 'melee', spell: 1, cost: 25, cd: 6, wind: 0.25, rec: 0.25, range: 135, arc: 70, dmg: [3, 6], stat: 'cha', fire: 1, dot: ['burn', 3, [1, 4]], cone: '#ff7a2a', color: '#ff7a2a', icon: 'burst', desc: 'A sheet of flame: 3d6 + CHA in a cone, then burning for 3s.' },
    misty_step: { name: 'Misty Step', type: 'dash', cost: 15, cd: 5, wind: 0.03, rec: 0.08, dist: 240, color: '#9fe8ff', icon: 'dash', desc: 'Teleport a short distance in silver mist. Untouchable while you travel.' },
    lightning_bolt: { name: 'Lightning Bolt', type: 'line', cost: 30, cd: 7, wind: 0.4, rec: 0.25, range: 560, width: 24, dmg: [3, 8], stat: 'cha', color: '#8fc8ff', icon: 'arrow', desc: 'After a brief charge, a bolt strikes everything in a line for 3d8 + CHA.' },
    ray_frost: { name: 'Ray of Frost', type: 'proj', cost: 20, cd: 4, wind: 0.18, rec: 0.2, speed: 780, pr: 9, dmg: [2, 8], stat: 'cha', slow: [0.5, 3], color: '#9fe0ff', icon: 'arrow', shape: 'shard', desc: 'A frigid lance for 2d8 + CHA that slows by 50% for 3s.' },
    dragon_breath: { name: "Dragon's Breath", type: 'melee', spell: 1, cost: 35, cd: 9, wind: 0.35, rec: 0.3, range: 200, arc: 80, dmg: [4, 6], stat: 'cha', fire: 1, dot: ['burn', 4, [1, 4]], cone: '#ff5a1a', color: '#ff5a1a', icon: 'burst', desc: 'Exhale ancestral fire: 4d6 + CHA in a long cone, burning for 4s.' },
    chaos_bolt: { name: 'Chaos Bolt', type: 'proj', cost: 20, cd: 3.5, wind: 0.18, rec: 0.2, speed: 700, pr: 10, dmg: [3, 8], stat: 'cha', chaos: 1, color: '#ff6ad5', icon: 'arrow', shape: 'orb', desc: '3d8 + CHA of unstable magic. Each bolt burns, chills, stuns or marks at random.' },
    fireball: { name: 'Fireball', type: 'aoe', ult: 1, at: 'point', castRange: 440, cost: 0, cd: 26, wind: 0.3, rec: 0.3, delay: 0.5, radius: 105, dmg: [6, 6], stat: 'cha', fire: 1, dot: ['burn', 3, [1, 6]], knock: 220, color: '#ff8a2a', icon: 'burst', desc: 'A bead of fire streaks out and detonates: 6d6 + CHA in a huge area.' },

    // ---------------- Cleric ----------------
    c_basic: { name: 'Mace', type: 'melee', basic: 1, cost: 6, wind: 0.18, rec: 0.24, range: 62, arc: 100, dmg: [1, 6], stat: 'str', gain: 11, color: '#f2e2a8', desc: 'Swing for 1d6 + STR. Costs 6 Faith, refunded with interest on a hit. The third hit of a clean combo is a finisher.' },
    sacred_flame: { name: 'Sacred Flame', type: 'aoe', at: 'target', cost: 20, cd: 4, wind: 0.2, rec: 0.2, delay: 0.6, radius: 50, dmg: [2, 8], stat: 'wis', radiant: 1, color: '#ffe27a', icon: 'burst', desc: 'Radiance descends on your foe after a moment: 2d8 + WIS.' },
    cure_wounds: { name: 'Cure Wounds', type: 'buff', cost: 30, cd: 12, wind: 0.35, rec: 0.15, heal: [2, 8], healStat: 'wis', healLvl: 2, color: '#8fffb0', icon: 'cross', desc: 'Heal 2d8 + WIS + 2 per level.' },
    shield_faith: { name: 'Shield of Faith', type: 'buff', cost: 25, cd: 14, wind: 0.15, rec: 0.1, buff: { shield: [6, 22] }, shieldLvl: 5, color: '#ffe9a0', icon: 'shield', desc: 'A shimmering ward absorbs damage for 6s (22 + 5 per level).' },
    guiding_bolt: { name: 'Guiding Bolt', type: 'proj', cost: 25, cd: 7, wind: 0.3, rec: 0.2, speed: 620, pr: 11, dmg: [3, 6], stat: 'wis', radiant: 1, mark: 4, color: '#fff0a0', icon: 'arrow', shape: 'orb', desc: 'A flash of light for 3d6 + WIS. The target takes 25% more damage for 4s.' },
    holy_strike: { name: 'Holy Strike', type: 'melee', armor: 1, cost: 30, cd: 8, wind: 0.25, rec: 0.3, range: 76, arc: 100, lunge: 110, dmg: [3, 8], stat: 'str', stun: 0.7, knock: 280, color: '#ffd76b', icon: 'sword', desc: 'Charge and smite for 3d8 + STR, stunning and knocking back.' },
    radiance: { name: 'Radiance of Dawn', type: 'aoe', at: 'self', cost: 35, cd: 10, wind: 0.4, rec: 0.25, radius: 165, dmg: [3, 8], stat: 'wis', radiant: 1, color: '#fff3b0', icon: 'burst', desc: 'Sunlight erupts around you: 3d8 + WIS to anything nearby.' },
    spirit_guardians: { name: 'Spirit Guardians', type: 'buff', ult: 1, cost: 0, cd: 28, wind: 0.3, rec: 0.1, buff: { aura: [7, 0] }, aura: { radius: 115, dmg: [1, 8], stat: 'wis', slow: 0.35 }, radiant: 1, color: '#c8f0ff', icon: 'up', desc: 'Spectral guardians circle you for 7s, dealing 1d8 + WIS twice a second and slowing foes inside.' }
  };
  Object.keys(A).forEach(k => A[k].id = k);

  G.CLASSES = {
    fighter: {
      name: 'Fighter', role: 'Frontline Control', tag: 'Iron and discipline. Hold the line. Break skulls.', res: 'Stamina', resColor: '#e0b040', hitDie: 10, primary: 'str',
      stats: { str: 16, dex: 12, con: 15, int: 8, wis: 10, cha: 12 }, basic: 'f_basic', start: ['shield_bash', 'second_wind'], l2: ['cleave', 'leap_slam'], ult: 'action_surge', pref: 50,
      subs: {
        champion: { name: 'Champion', desc: 'Raw physical excellence.', passive: ['Improved Critical', '+15% crit chance. Crits deal 2.5x damage.'], ability: 'relentless' },
        battlemaster: { name: 'Battle Master', desc: 'A student of the fight.', passive: ['Tactical Edge', '+30% damage to stunned or slowed foes.'], ability: 'riposte' }
      }
    },
    rogue: {
      name: 'Rogue', role: 'Stealth Skirmish', tag: 'Strike from darkness. Take what the guild is owed.', res: 'Focus', resColor: '#a070ff', hitDie: 8, primary: 'dex',
      stats: { str: 10, dex: 17, con: 13, int: 12, wis: 10, cha: 13 }, basic: 'r_basic', start: ['shadowstep', 'fan_knives'], l2: ['poison_blade', 'smoke_bomb'], ult: 'flurry', pref: 44,
      subs: {
        assassin: { name: 'Assassin', desc: 'One clean kill.', passive: ['Assassinate', 'Sneak Attacks deal +4d6 instead of +2d6.'], ability: 'death_mark' },
        thief: { name: 'Thief', desc: 'Fast hands, full pockets.', passive: ['Fast Hands', '+25% coin from fights. Dodge recovers 30% faster.'], ability: 'dirty_trick' }
      }
    },
    sorcerer: {
      name: 'Sorcerer', role: 'Arcane Destruction', tag: 'Blood and flame obey. Burn through locks, foes, and wards.', res: 'Mana', resColor: '#5aa0ff', hitDie: 6, primary: 'cha',
      stats: { str: 8, dex: 13, con: 14, int: 12, wis: 10, cha: 17 }, basic: 's_basic', start: ['burning_hands', 'misty_step'], l2: ['lightning_bolt', 'ray_frost'], ult: 'fireball', pref: 280, ranged: 1,
      subs: {
        draconic: { name: 'Draconic Bloodline', desc: 'Something old sleeps in your veins.', passive: ['Draconic Resilience', '+12% max HP. Fire spells deal +1 damage per die.'], ability: 'dragon_breath' },
        wild: { name: 'Wild Magic', desc: 'Nobody knows what happens next. Least of all you.', passive: ['Wild Surge', '25% chance when casting to trigger a random surge: healing, haste, mana, or an explosion.'], ability: 'chaos_bolt' }
      }
    },
    cleric: {
      name: 'Cleric', role: 'Faith Support', tag: 'Channel the Light beneath the earth. Heal, smite, and purify.', res: 'Faith', resColor: '#ffe27a', hitDie: 8, primary: 'wis',
      stats: { str: 14, dex: 10, con: 15, int: 10, wis: 16, cha: 12 }, basic: 'c_basic', start: ['sacred_flame', 'cure_wounds'], l2: ['shield_faith', 'guiding_bolt'], ult: 'spirit_guardians', pref: 50,
      subs: {
        war: { name: 'War Domain', desc: 'Faith is a weapon.', passive: ['Divine Strike', 'Melee hits deal +1d6 radiant damage.'], ability: 'holy_strike' },
        light: { name: 'Light Domain', desc: 'No shadow survives the dawn.', passive: ['Searing Light', 'Your radiant spells set foes burning for 3s.'], ability: 'radiance' }
      }
    }
  };

  G.FEATS = {
    asi: { name: 'Ability Improvement', desc: '+2 to your class primary ability.' },
    tough: { name: 'Tough', desc: '+15% maximum hit points.' },
    mobile: { name: 'Mobile', desc: '+12% move speed. Dodge recovers 25% faster.' },
    savage: { name: 'Savage Attacker', desc: '+12% damage with everything.' },
    focused: { name: 'Deep Reserves', desc: '+35% resource regeneration.' }
  };

  G.RANKS = [
    { name: 'Fresh Meat', at: 0, color: '#8a8f98' },
    { name: 'Scrapper', at: 50, color: '#b98a5a' },
    { name: 'Bloodied', at: 140, color: '#c9c9d4' },
    { name: 'Enforcer', at: 260, color: '#ffd36b' },
    { name: 'Underboss', at: 440, color: '#c79bff' },
    { name: 'Pit Legend', at: 700, color: '#ff6a4a' }
  ];

  G.OPPONENTS = [
    { id: 'grubb', name: 'Grubb', title: 'the Rat-Catcher', cls: 'rogue', race: 'halforc', level: 1, known: ['fan_knives'], hpMul: 0.8, dmgMul: 0.55, ai: { react: 0.6, aggro: 0.45, dodge: 0.08 }, xp: 100, coin: 60, respect: 60, tint: { armor: '#4a4031', cloth: '#5b4a2a', trim: '#8a7a4a' }, taunt: 'Fresh meat. I get paid by the tail, you know.' },
    { id: 'maul', name: 'Sister Maul', title: 'of the Sunless Chapel', cls: 'cleric', race: 'dwarf', level: 2, known: ['sacred_flame', 'cure_wounds'], hpMul: 0.9, dmgMul: 0.62, ai: { react: 0.5, aggro: 0.55, dodge: 0.12 }, xp: 150, coin: 100, respect: 90, tint: { armor: '#5a2a2a', cloth: '#2c2228', trim: '#d8b04a' }, taunt: 'Kneel now and I will make the sermon short.' },
    { id: 'kessa', name: 'Kessa Cinderhand', title: 'Ash of the Deep Guild', cls: 'sorcerer', race: 'tiefling', level: 3, sub: 'draconic', known: ['burning_hands', 'misty_step', 'ray_frost'], hpMul: 1.0, dmgMul: 0.64, ai: { react: 0.42, aggro: 0.65, dodge: 0.2 }, xp: 200, coin: 150, respect: 130, tint: { cloth: '#3a1f4a', trim: '#ff9a3a', armor: '#2a1830' }, taunt: 'They sweep what is left of you into a jar. I keep the jars.' },
    { id: 'brakk', name: 'Brakk Ironjaw', title: 'Wall of the Lower Ring', cls: 'fighter', race: 'halforc', level: 4, sub: 'champion', known: ['shield_bash', 'cleave', 'leap_slam', 'second_wind'], hpMul: 1.05, dmgMul: 0.68, ai: { react: 0.36, aggro: 0.7, dodge: 0.22 }, xp: 250, coin: 210, respect: 180, scale: 1.12, tint: { armor: '#3b4048', cloth: '#1e3a2a', trim: '#9aa3ad' }, taunt: 'Forty fights. Forty stretchers. You are number forty-one.' },
    { id: 'vexa', name: 'Vexa', title: 'the Pale Queen, Pit Champion', cls: 'rogue', race: 'elf', level: 5, sub: 'assassin', known: ['shadowstep', 'fan_knives', 'poison_blade', 'smoke_bomb'], ult: 'flurry', hpMul: 1.3, dmgMul: 0.66, ai: { react: 0.28, aggro: 0.8, dodge: 0.34 }, xp: 350, coin: 400, respect: 260, boss: 1, tint: { armor: '#d8d2e6', cloth: '#6a2a8a', trim: '#ffd36b', hair: '#f2eefc' }, taunt: 'You climbed all this way to bleed on my floor. How thoughtful.' }
  ];

  // Hideout pieces, placed on the hideout grid. w,d: footprint in tiles. zone: where it may stand.
  G.DECOR = [
    { id: 'lantern', name: 'Iron Lantern', cost: 15, rank: 0, zone: 'any', w: 1, d: 1, max: 6, perk: 'Warm light wherever you want it.', light: 0xffb060 },
    { id: 'rug', name: 'Guild Rug', cost: 25, rank: 0, zone: 'house', w: 2, d: 2, max: 2, walk: 1, perk: 'Takes the chill off the stone.' },
    { id: 'glowcaps', name: 'Glowcap Patch', cost: 35, rank: 0, zone: 'garden', w: 1, d: 1, max: 6, perk: '+10% resource regeneration.', light: 0x6aa8ff },
    { id: 'bed', name: 'Feather Bed', cost: 60, rank: 0, zone: 'house', w: 1, d: 2, max: 1, perk: 'Well rested: +10% max HP.' },
    { id: 'trophies', name: 'Trophy Shelf', cost: 90, rank: 1, zone: 'house', w: 2, d: 1, max: 1, perk: '+10% respect earned.' },
    { id: 'desk', name: 'Planning Desk', cost: 100, rank: 1, zone: 'house', w: 2, d: 1, max: 1, perk: 'Study your rivals: +6% cooldown recovery.', light: 0xffb060 },
    { id: 'banner', name: 'Syndicate Banner', cost: 110, rank: 2, zone: 'any', w: 1, d: 1, max: 4, perk: 'Your name carries: +10% coin earned.' },
    { id: 'bloom', name: 'Crystal Bloom', cost: 120, rank: 2, zone: 'garden', w: 1, d: 1, max: 4, perk: 'Meditation garden: +10% XP earned.', light: 0xb090ff },
    { id: 'fountain', name: 'Moonwater Fountain', cost: 160, rank: 3, zone: 'garden', w: 2, d: 2, max: 1, perk: 'Start each fight with a protective ward.', light: 0x6ad0ff },
    { id: 'cauldron', name: "Alchemist's Cauldron", cost: 180, rank: 3, zone: 'any', w: 1, d: 1, max: 1, perk: 'Brews a free healing potion before every fight.', light: 0x8aff5a },
    { id: 'statues', name: 'Guardian Statue', cost: 200, rank: 4, zone: 'any', w: 1, d: 1, max: 2, perk: 'Stone watchers: take 5% less damage.' },
    { id: 'crystals', name: 'Starlight Spire', cost: 240, rank: 4, zone: 'garden', w: 1, d: 1, max: 2, perk: 'The cavern glitters: +3% crit chance.', light: 0x8ad0ff },
    { id: 'fern', name: 'Cave Fern', cost: 20, rank: 0, zone: 'any', w: 1, d: 1, max: 8, perk: 'Green, somehow.' },
    { id: 'bench', name: 'Stone Bench', cost: 40, rank: 0, zone: 'garden', w: 2, d: 1, max: 3, perk: 'For watching the glowcaps.' },
    { id: 'weaponrack', name: 'Weapon Rack', cost: 60, rank: 0, zone: 'any', w: 2, d: 1, max: 2, perk: 'Blades on the wall where you can see them.' },
    { id: 'table', name: 'Long Table', cost: 70, rank: 0, zone: 'house', w: 2, d: 2, max: 1, perk: 'Somewhere to eat that is not the floor.', light: 0xffc070 },
    { id: 'firebowl', name: 'Fire Bowl', cost: 55, rank: 1, zone: 'any', w: 1, d: 1, max: 4, perk: 'A pit-style brazier of your own.', light: 0xff8a30 },
    { id: 'bookshelf', name: 'Bookshelf', cost: 80, rank: 1, zone: 'house', w: 2, d: 1, max: 2, perk: 'Old fight manuals: +5% XP earned.' },
    { id: 'hearth', name: 'Stone Hearth', cost: 130, rank: 1, zone: 'house', w: 2, d: 1, max: 1, perk: 'Warm bones: potions heal 20% more.', light: 0xff9040 },
    { id: 'dummy', name: 'Training Dummy', cost: 120, rank: 2, zone: 'any', w: 1, d: 1, max: 1, perk: 'Daily drills: +4% damage.' },
    { id: 'willow', name: 'Glow-Willow', cost: 220, rank: 3, zone: 'garden', w: 2, d: 2, max: 2, perk: 'A tree that makes its own moonlight.', light: 0x7affc0 }
  ];
  G.DECOR_BY = {}; G.DECOR.forEach(d => G.DECOR_BY[d.id] = d);
  G.owned = st => { const o = {}; (st.items || []).forEach(p => o[p.id] = (o[p.id] || 0) + 1); return o; };

  G.GEAR = {
    weapon: { name: 'Weapon', tiers: [null, { name: 'Runed Edge', cost: 110, desc: '+2 damage on weapon hits. Your weapon glows cyan.' }, { name: 'Syndicate Relic', cost: 240, desc: '+4 damage on weapon hits. Your weapon burns gold.' }] },
    armor: { name: 'Armor', tiers: [null, { name: 'Reinforced Kit', cost: 110, desc: 'Take 6% less damage. Silver trim.' }, { name: 'Champion Regalia', cost: 240, desc: 'Take 12% less damage. Gold trim.' }] }
  };
  G.POTION_COST = 25; G.POTION_MAX = 3;

  // Build the six ability scores for a class + race at a level.
  G.baseStats = (cls, race, level) => {
    const s = Object.assign({}, G.CLASSES[cls].stats), b = G.RACES[race].bonus;
    Object.keys(b).forEach(k => s[k] += b[k]);
    return s;
  };
  G.newHero = (name, race, cls) => {
    const C = G.CLASSES[cls];
    return { name, race, cls, level: 1, xp: 0, stats: G.baseStats(cls, race), sub: null, feats: [], known: C.start.slice(), slots: [C.start[0], C.start[1], null], ult: null };
  };
  G.lookOf = (h, st) => ({ cls: h.cls, race: h.race, gear: st ? st.gear : { weapon: 0, armor: 0 }, tint: h.tint, scale: h.scale || 1, rank: st ? G.rankOf(st.respect) : 0 });
})();
