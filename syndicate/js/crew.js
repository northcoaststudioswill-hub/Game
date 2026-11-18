// Guttercrown — mortal blows, build reference, cosmetics, street events, and the Tally (your crew)
(function () {
  const G = window.G, ui = G.ui || (G.ui = {});
  const pick = a => a[Math.floor(Math.random() * a.length)], d20 = () => 1 + Math.floor(Math.random() * 20);

  G.MORTAL = {
    fighter: { name: 'Headsman’s Verdict', word: 'CLOVEN', desc: 'A leaping two-handed blow that ends the bout and most of the opponent.' },
    rogue: { name: 'Death of a Thousand Cuts', word: 'UNMADE', desc: 'Seven cuts from seven directions before the body knows to fall.' },
    sorcerer: { name: 'Disintegrate', word: 'ASH', desc: 'A green ray that leaves a fine grey dust and a scorch mark.' },
    cleric: { name: 'Flame Strike', word: 'JUDGED', desc: 'A column of the Light Beneath, called straight down.' }
  };
  G.PARRY_INFO = {
    fighter: ['Shield Block', 'Widest window. Staggers and shoves the attacker; turns projectiles back.'],
    rogue: ['Riposte', 'Tightest window. Answers at once with a counter-stab for heavy damage.'],
    sorcerer: ['Shield', 'A wall of force. Hurls a melee attacker away and reflects projectiles.'],
    cleric: ['Warding Flare', 'Heals you a little and leaves the attacker slowed and dazzled.']
  };
  // what each ability is in tabletop terms, and what it is for
  const K = (ids, kind, role) => ids.split(' ').forEach(id => { if (G.ABILITIES[id]) { G.ABILITIES[id].kind = kind; G.ABILITIES[id].role = role; } });
  K('f_basic r_basic c_basic', 'Weapon attack', 'Damage'); K('s_basic', 'Cantrip', 'Damage'); K('sacred_flame ray_frost', 'Cantrip', 'Damage');
  K('shield_bash', 'Maneuver', 'Control'); K('second_wind', 'Class feature', 'Heal'); K('cleave leap_slam', 'Maneuver', 'Damage'); K('relentless action_surge', 'Class feature', 'Burst'); K('riposte', 'Maneuver', 'Defense');
  K('shadowstep', 'Cunning Action', 'Mobility'); K('fan_knives poison_blade', 'Weapon attack', 'Damage'); K('smoke_bomb', 'Cunning Action', 'Defense'); K('death_mark', 'Class feature', 'Finisher'); K('dirty_trick', 'Cunning Action', 'Control'); K('flurry', 'Class feature', 'Burst');
  K('burning_hands chaos_bolt', '1st-level spell', 'Damage'); K('misty_step', '2nd-level spell', 'Mobility'); K('lightning_bolt fireball', '3rd-level spell', 'Damage'); K('dragon_breath', 'Class feature', 'Damage');
  K('cure_wounds', '1st-level spell', 'Heal'); K('shield_faith', '1st-level spell', 'Defense'); K('guiding_bolt', '1st-level spell', 'Damage'); K('holy_strike', 'Channel Divinity', 'Control'); K('radiance', 'Channel Divinity', 'Damage'); K('spirit_guardians', '3rd-level spell', 'Burst');
  G.PLAY = {
    fighter: 'Stay close and trade. Your stuns set up big hits, your block is the most forgiving, and you can heal yourself.',
    rogue: 'Get in, get out. Shadowstep behind them for Sneak Attacks and never stand still to trade blows.',
    sorcerer: 'Keep your distance and punish from range. Up close your spells suffer Disadvantage, so blink away or Shield.',
    cleric: 'The slow, sure road. Mace in hand, heal through mistakes, and drop radiant spells when they commit.'
  };

  // ------------------------------------------------------------ cosmetics
  G.DYES = {
    crimson: { armor: 0x7a2026, armor2: 0x4a1216, cloth: 0xb0262e, trim: 0xe0b050, legs: 0x3a1418 },
    midnight: { armor: 0x2a3250, armor2: 0x181c30, cloth: 0x24306a, trim: 0x9ab0e0, legs: 0x1c2038 },
    bone: { armor: 0xd8d2c0, armor2: 0x9a9484, cloth: 0xefe8d6, trim: 0x8a6a34, legs: 0x6a6458 },
    emerald: { armor: 0x2a5a44, armor2: 0x183828, cloth: 0x2f8a5a, trim: 0xd8c060, legs: 0x1c3024 },
    royal: { armor: 0x4a2a7a, armor2: 0x2c1848, cloth: 0x6a3aa8, trim: 0xffd36b, legs: 0x2a1a44 },
    gilt: { armor: 0x1c1a1e, armor2: 0x0e0d10, cloth: 0x2a2428, trim: 0xffd36b, legs: 0x141216 },
    venom: { armor: 0x2a3a22, armor2: 0x16200f, cloth: 0x6aa82a, trim: 0xb8ff5a, legs: 0x1a2414 },
    rime: { armor: 0xcfe6f2, armor2: 0x8fb0c4, cloth: 0x9fd6ee, trim: 0xffffff, legs: 0x6a8a9c },
    cinder: { armor: 0x3a2a24, armor2: 0x201612, cloth: 0xd0581a, trim: 0xffb060, legs: 0x241a16 },
    bonewhite: { armor: 0xe6dcc4, armor2: 0xb8ac90, cloth: 0x1a1618, trim: 0x8a1c1c, legs: 0x2a2428 },
    royal: { armor: 0x3a2a6a, armor2: 0x241848, cloth: 0x5a2a8a, trim: 0xd8dce6, legs: 0x1c1430 },
    rust: { armor: 0x8a4a2a, armor2: 0x5a2e1a, cloth: 0x3a3430, trim: 0x2a2428, legs: 0x2a2220 },
    house: { armor: 0x1f5a3a, armor2: 0x143a2c, cloth: 0x0e2a1e, trim: 0xf0c95a, legs: 0x10241a },
    ashen: { armor: 0x4a4a4e, armor2: 0x2a2a2e, cloth: 0x1c1c20, trim: 0xc22a22, legs: 0x202024 }
  };
  G.WSKIN = {
    ember: { color: 0xff9a4a, e: 0xa03808, glow: 0xff7a2a }, frost: { color: 0xbfeaff, e: 0x1a6a90, glow: 0x7ad8ff },
    gilded: { color: 0xffd36b, e: 0x6a4a08, glow: 0xffd36b }, frost: { color: 0xd8f4ff, e: 0x2a6a8a, glow: 0x9adfff }, voidsteel: { color: 0x1a1420, e: 0x3a1a6a, glow: 0xb070ff }, wisp: { color: 0x9af6ff, e: 0x0a6a7a, glow: 0x6af0ff }, blood: { color: 0xc22a22, e: 0x6a0808, glow: 0xff4030 }, toxic: { color: 0x9aff5a, e: 0x2a6a08, glow: 0x8aff5a }, void: { color: 0x7a4ac0, e: 0x3a1470, glow: 0xb070ff }
  };
  G.COSMETICS = [
    { id: 'crimson', slot: 'dye', name: 'Pit Crimson', cost: 60, rank: 0, desc: 'Deep red cloth, brass trim. Hides the stains.' },
    { id: 'midnight', slot: 'dye', name: 'Midnight Blue', cost: 60, rank: 0, desc: 'The colour of the lower levels.' },
    { id: 'emerald', slot: 'dye', name: 'Glowcap Green', cost: 80, rank: 1, desc: 'Dyed with crushed cave moss.' },
    { id: 'bone', slot: 'dye', name: 'Bone White', cost: 110, rank: 2, desc: 'Pale armour. Brave, down here.' },
    { id: 'ashen', slot: 'dye', name: 'Ash and Blood', cost: 140, rank: 3, desc: 'Charcoal plate with red edging.' },
    { id: 'royal', slot: 'dye', name: 'Royal Violet', cost: 220, rank: 4, desc: 'Guild purple and gold. You have to earn the nerve.' },
    { id: 'cinder', slot: 'dye', name: 'Cinder', cost: 90, rank: 1, desc: 'Charcoal and furnace orange.' },
    { id: 'venom', slot: 'dye', name: 'Sewer Venom', cost: 120, rank: 2, desc: 'Black-green plate with acid edging.' },
    { id: 'rime', slot: 'dye', name: 'Rime', cost: 160, rank: 3, desc: 'Ice-blue and white. Shows every drop.' },
    { id: 'gilt', slot: 'dye', name: 'Black and Gilt', cost: 260, rank: 4, desc: 'Lamp-black armour with gold at every edge.' },
    { id: 'widehat', slot: 'head', name: 'Gambler’s Brim', cost: 80, rank: 0, desc: 'A wide hat with a long feather.' },
    { id: 'jester', slot: 'head', name: 'Fool’s Cap', cost: 110, rank: 1, desc: 'Three points, three bells. They never see it coming.' },
    { id: 'antlers', slot: 'head', name: 'Stag Antlers', cost: 170, rank: 2, desc: 'A full rack, lashed to a leather band.' },
    { id: 'thorns', slot: 'head', name: 'Crown of Thorns', cost: 230, rank: 3, desc: 'Black iron briar. It bites the wearer too.' },
    { id: 'lucky', slot: 'head', name: 'Mark’s Lucky Laurel', cost: 9999, rank: 9, desc: 'Won from Mark in a friendly. He says it is lucky. He lost while wearing it.' },
    { id: 'rust', slot: 'dye', name: 'Old Rust', cost: 70, rank: 0, desc: 'Iron left in the wet. It suits the place.' },
    { id: 'bonewhite', slot: 'dye', name: 'Bone and Black', cost: 140, rank: 2, desc: 'Ivory plate over black cloth, with a red edge.' },
    { id: 'royal', slot: 'dye', name: 'Guild Violet', cost: 220, rank: 3, desc: 'The Guild’s own colour. Wearing it is a statement.' },
    { id: 'house', slot: 'dye', name: 'House Colours', cost: 9999, rank: 9, chit: 120, desc: 'Long Odds green and gold. You are a walking advertisement.' },
    { id: 'hood', slot: 'head', name: 'Deep Cowl', cost: 70, rank: 0, desc: 'A heavy hood. Nobody sees where you are looking.' },
    { id: 'mohawk', slot: 'head', name: 'Pit Crest', cost: 100, rank: 1, desc: 'A stiff dyed crest. The crowd can find you from the back row.' },
    { id: 'candles', slot: 'head', name: 'Lampwright’s Crown', cost: 210, rank: 3, desc: 'A ring of lit candles. Hot wax is part of the look.' },
    { id: 'dicecrown', slot: 'head', name: 'High Roller’s Crown', cost: 9999, rank: 9, chit: 200, desc: 'Gold band, four wispdice. Mark wore it once and lost a house.' },
    { id: 'horned', slot: 'head', name: 'Horned Helm', cost: 90, rank: 0, desc: 'Two great curved horns.' },
    { id: 'plague', slot: 'head', name: 'Plague Beak', cost: 120, rank: 1, desc: 'A long leather beak and glass eyes.' },
    { id: 'skull', slot: 'head', name: 'Skull Visor', cost: 150, rank: 2, desc: 'Somebody else’s face, worn over yours.' },
    { id: 'laurel', slot: 'head', name: 'Victor’s Laurel', cost: 200, rank: 3, desc: 'Gilded leaves for a proven winner.' },
    { id: 'crown', slot: 'head', name: 'Pretender’s Crown', cost: 320, rank: 4, desc: 'Not the real one. Yet.' },
    { id: 'pack', slot: 'back', name: 'Bedroll and Quiver', cost: 70, rank: 0, desc: 'Everything you own, on your back.' },
    { id: 'greatcloak', slot: 'back', name: 'Fur Greatcloak', cost: 130, rank: 1, desc: 'Heavy, long, and collared in fur.' },
    { id: 'banner', slot: 'back', name: 'Back Banner', cost: 180, rank: 2, desc: 'Your colours flying behind you.' },
    { id: 'wings', slot: 'back', name: 'Raven Wings', cost: 300, rank: 4, desc: 'Black feathers on an iron frame.' },
    { id: 'greatsword', slot: 'back', name: 'Spare Greatsword', cost: 150, rank: 1, desc: 'A second blade across your back, for the look of it.' },
    { id: 'lanternpole', slot: 'back', name: 'Lantern Pole', cost: 190, rank: 2, desc: 'Your own lamp, carried high. Down here that means something.' },
    { id: 'skullrack', slot: 'back', name: 'Trophy Rack', cost: 280, rank: 4, desc: 'Three skulls on iron spikes.' },
    { id: 'blood', slot: 'weapon', name: 'Bloodletter', cost: 180, rank: 2, desc: 'Red to the hilt, and it stays that way.' },
    { id: 'toxic', slot: 'weapon', name: 'Sewer-Quenched', cost: 180, rank: 2, desc: 'A sick green shine.' },
    { id: 'quiver', slot: 'back', name: 'Javelin Quiver', cost: 120, rank: 1, desc: 'Three short spears you will never throw.' },
    { id: 'ratcage', slot: 'back', name: 'Mistake’s Cousin', cost: 170, rank: 2, desc: 'A rat in a cage on your back. He is not fast either.' },
    { id: 'moneybag', slot: 'back', name: 'Sack of Winnings', cost: 9999, rank: 9, chit: 150, desc: 'A fat sack with coin spilling from the neck. Mostly washers.' },
    { id: 'frost', slot: 'weapon', name: 'Rimed Edge', cost: 180, rank: 2, desc: 'Pale as lake ice.' },
    { id: 'voidsteel', slot: 'weapon', name: 'Voidsteel', cost: 260, rank: 4, desc: 'Black metal with a violet burn in it.' },
    { id: 'wisp', slot: 'weapon', name: 'Wisplight Edge', cost: 9999, rank: 9, chit: 180, desc: 'The same light the dice are made of, on a blade.' },
    { id: 'ember', slot: 'weapon', name: 'Emberforged', cost: 120, rank: 1, desc: 'The edge glows like a coal.' },
    { id: 'frost', slot: 'weapon', name: 'Frostbitten', cost: 120, rank: 1, desc: 'Cold enough to smoke.' },
    { id: 'gilded', slot: 'weapon', name: 'Gilded', cost: 200, rank: 3, desc: 'Gold leaf over good steel.' },
    { id: 'void', slot: 'weapon', name: 'Voidglass', cost: 260, rank: 4, desc: 'Purple-black and faintly humming.' },
    { id: 'embers', slot: 'aura', name: 'Ember Motes', cost: 150, rank: 2, desc: 'Sparks that follow you around.', color: 0xff8a30 },
    { id: 'mist', slot: 'aura', name: 'Grave Mist', cost: 150, rank: 2, desc: 'A cold blue haze at your feet.', color: 0x6ad0ff },
    { id: 'sigils', slot: 'aura', name: 'Violet Sigils', cost: 190, rank: 3, desc: 'Guild-work glyphs that orbit you.', color: 0xb070ff },
    { id: 'snow', slot: 'aura', name: 'Rime Fall', cost: 190, rank: 3, desc: 'A cold white drift that never settles.', color: 0xe8f6ff },
    { id: 'bloodmist', slot: 'aura', name: 'Red Mist', cost: 240, rank: 4, desc: 'It followed you out of the pit.', color: 0xff4030 },
    { id: 'moths', slot: 'aura', name: 'Lamp Moths', cost: 130, rank: 1, desc: 'They think you are the First Lamp.', color: 0xffe0a0 },
    { id: 'spores', slot: 'aura', name: 'Glowcap Spores', cost: 170, rank: 2, desc: 'Do not breathe in. Mark does.', color: 0x8aff5a },
    { id: 'wisps', slot: 'aura', name: 'Loose Wisps', cost: 9999, rank: 9, chit: 160, desc: 'Escaped from the table. They like you.', color: 0x6af0ff },
    { id: 'gold', slot: 'aura', name: 'Halo of Coin', cost: 280, rank: 4, desc: 'The crowd’s favour, made visible.', color: 0xffd36b }
  ];
  const SLOTS = [['dye', 'Dyes'], ['head', 'Headgear'], ['back', 'Back'], ['weapon', 'Weapon finish'], ['aura', 'Aura']];
  const cosOf = st => st.cos || (st.cos = { owned: {} });

  // ------------------------------------------------------------ the Tally
  const FIRST = ['Mott', 'Sprig', 'Old Renna', 'Quill', 'Bodge', 'Nan Tallow', 'Pim', 'Crookshank', 'Ashby', 'Wren', 'Dunmore', 'Tibb', 'Hesk', 'Marrow'];
  const TRAITS = [['Light-fingered', 'pick'], ['Heavy-set', 'shake'], ['Silver-tongued', 'rumour'], ['Knows the tunnels', 'smuggle'], ['Patient', 'sabotage']];
  G.JOBS = [
    { id: 'shake', name: 'Shakedown', desc: 'Lean on a stallholder who is behind with the Guild.', fights: 1, dc: 10, gain: 'coin' },
    { id: 'rumour', name: 'Spread the Word', desc: 'Talk you up in every tavern on the level.', fights: 1, dc: 11, gain: 'respect' },
    { id: 'smuggle', name: 'Smuggling Run', desc: 'Carry something unmarked past the Highmarch seal.', fights: 2, dc: 13, gain: 'more coin' },
    { id: 'pick', name: 'Grave-Picking', desc: 'Search the dead workings for anything worth carrying.', fights: 2, dc: 12, gain: 'an item' },
    { id: 'sabotage', name: 'Sour the Wine', desc: 'See that your next opponent starts the bout feeling unwell.', fights: 1, dc: 14, gain: 'a weakened foe' },
    { id: 'train', name: 'Drill in the Yard', desc: 'No pay, but they come back sharper.', fights: 1, dc: 0, gain: 'skill' }
  ];
  const crew = G.crew = {
    slots: st => Math.min(5, G.rankOf(st.respect)),
    sync: function () {                         // one new Tallyman for every rank you hold
      const st = G.state, out = []; if (!st.hero) return out; st.tally = st.tally || [];
      while (st.tally.length < crew.slots(st)) {
        const used = st.tally.map(t => t.name), tr = pick(TRAITS);
        const t = { name: pick(FIRST.filter(n => !used.includes(n))), cls: pick(['fighter', 'rogue', 'sorcerer', 'cleric']), race: pick(Object.keys(G.RACES)), skill: 2, trait: tr[0], good: tr[1], job: null };
        st.tally.push(t); out.push(t);
      }
      return out;
    },
    look: t => ({ cls: t.cls, race: t.race, tint: { armor: '#4a4650', armor2: '#2c2a32', cloth: '#3a3440', trim: '#8a6a34', legs: '#2a2830' } }),
    tick: function () {                         // called once per bout: jobs take bouts, not minutes
      const st = G.state; st.reports = st.reports || [];
      (st.tally || []).forEach(t => {
        if (!t.job) return; if (--t.job.left > 0) return;
        const job = G.JOBS.find(j => j.id === t.job.id), roll = d20(), bonus = t.skill + (t.good === job.id ? 2 : 0), total = roll + bonus, ok = roll !== 1 && (roll === 20 || total >= job.dc);
        const r = { who: t.name, job: job.name, roll, bonus, dc: job.dc, ok, text: '' };
        if (!ok) r.text = pick(['came back with a black eye and nothing else.', 'was chased off by the watch.', 'says it was a trap, and would rather not discuss it.', 'lost the lot at dice on the way home, by their own account.']);
        else if (job.id === 'shake') { const c = 35 + Math.floor(Math.random() * 35) + t.skill * 4; st.coin += c; r.text = 'collected ' + c + ' coin.'; }
        else if (job.id === 'smuggle') { const c = 100 + Math.floor(Math.random() * 70) + t.skill * 8; st.coin += c; r.text = 'made the run. ' + c + ' coin, no questions.'; }
        else if (job.id === 'rumour') { const p = 14 + Math.floor(Math.random() * 14) + t.skill; st.respect += p; r.text = 'had the whole level talking. +' + p + ' respect.'; }
        else if (job.id === 'sabotage') { st.sabotage = 1; r.text = 'got to the wine. Your next opponent starts weakened.'; }
        else if (job.id === 'train') { t.skill = Math.min(7, t.skill + 1); r.text = 'drilled all day. Skill is now ' + t.skill + '.'; }
        else {
          const rk = G.rankOf(st.respect), c = cosOf(st), pool = G.COSMETICS.filter(x => !c.owned[x.id] && x.rank <= rk + 1 && x.rank < 6);
          if (pool.length && Math.random() < 0.55) { const x = pick(pool); c.owned[x.id] = true; r.text = 'dug up something for you: ' + x.name + '. It is on the Tailor’s rack, paid for.'; }
          else if (st.potions < G.POTION_MAX) { st.potions++; r.text = 'found a sealed healing potion.'; }
          else { const c2 = 50 + Math.floor(Math.random() * 40); st.coin += c2; r.text = 'found old coin in a dead man’s boot: ' + c2 + '.'; }
        }
        if (ok && job.id !== 'train' && Math.random() < 0.3 && t.skill < 7) { t.skill++; r.text += ' They are getting better at this.'; }
        t.job = null; st.reports.push(r);
      });
    }
  };

  // ------------------------------------------------------------ street events (d20 + ability modifier against a DC)
  const E = (title, text, choices) => ({ title, text, choices });
  const C = (label, stat, dc, win, lose) => ({ label, stat, dc, win, lose });
  G.EVENTS = [
    E('The Collector', 'A Guild collector steps out of a doorway and mentions, pleasantly, a “convenience fee” of thirty coin for walking on this street.', [
      C('Pay him', null, 0, { coin: -30, text: 'He tips his hat. The Guild keeps its word exactly.' }),
      C('Loom over him', 'str', 12, { respect: 8, text: 'He remembers an appointment elsewhere.' }, { coin: -45, text: 'He is not alone. The fee has gone up.' }),
      C('Talk him down', 'cha', 11, { coin: -10, text: 'You settle on ten and a firm handshake.' }, { coin: -30, text: 'He has heard every story there is.' })]),
    E('Quick Fingers', 'A small hand is in your purse. Its owner has not yet realised you have noticed.', [
      C('Grab the wrist', 'dex', 12, { coin: 25, text: 'You shake loose their takings for the day as a lesson.' }, { coin: -20, text: 'Gone, and twenty of your coin with them.' }),
      C('Watch for the accomplice', 'wis', 10, { potion: 1, text: 'You catch the lookout instead, who pays you off with a potion.' }, { coin: -12, text: 'There were two of them. You saw neither.' }),
      C('Let it go', null, 0, { coin: -5, text: 'Five coin. You were that hungry once.' })]),
    E('An Admirer', 'A child in a too-big coat wants to know if it is true about the fight, and whether you would sign their lamp.', [
      C('Play the champion', 'cha', 9, { respect: 12, text: 'By nightfall the story has grown considerably.' }, { respect: 3, text: 'You fluff it, but they are delighted anyway.' }),
      C('Give them a coin', null, 0, { coin: -5, respect: 6, text: 'They will remember that longer than the fight.' })]),
    E('Honest Dice', 'A tavern game spills into the street. The dice are honest, the thrower swears.', [
      C('Spot the trick', 'int', 13, { coin: 50, text: 'Weighted. You explain this loudly and are paid to stop.' }, { coin: -25, text: 'You were sure it was the left die.' }),
      C('Throw fair and hope', null, 11, { coin: 30, text: 'The dice like you today.' }, { coin: -30, text: 'They do not.' }),
      C('Walk on', null, 0, { text: 'A fighter with coin left is a rare and sensible thing.' })]),
    E('In the Gutter', 'A pit fighter you half recognise is slumped against a wall, bleeding more than is wise.', [
      C('Patch them up', 'wis', 11, { respect: 15, potion: 1, text: 'They press a potion on you they were too far gone to drink.' }, { respect: 6, text: 'Clumsy work, but they will live to say who helped.' }),
      C('Carry them to the chapel', 'con', 10, { respect: 20, text: 'Half the level saw you do it.' }, { respect: 8, text: 'You get them most of the way.' }),
      C('Go through their pockets', null, 0, { coin: 35, respect: -10, text: 'Thirty-five coin. Somebody was watching.' })]),
    E('The Fallen Tunnel', 'A side passage has come down. Somebody is shouting behind the rubble, and a miner’s strongbox is wedged in the gap.', [
      C('Dig them out', 'str', 13, { coin: 40, respect: 10, text: 'The family empties a jar of coin into your hands.' }, { respect: 4, text: 'Others finish what you started.' }),
      C('Squeeze through for the box', 'dex', 12, { coin: 60, text: 'Sixty coin and a scraped shoulder.' }, { coin: 0, text: 'You get stuck. A passing child charges you nothing to pull you out, and laughs.' }),
      C('Fetch help', null, 0, { respect: 5, text: 'Sensible. Nobody sings about sensible.' })]),
    E('A Small Favour', 'The Fence has a package that needs to be somewhere else, and would rather not be seen carrying it.', [
      C('Slip past the watch', 'dex', 11, { coin: 45, text: 'Delivered. “I never doubted you,” lies the Fence.' }, { coin: -15, text: 'You pay the watch to forget your face.' }),
      C('Walk it through openly', 'cha', 12, { coin: 45, respect: 5, text: 'You nod to the watchmen as you pass. They nod back.' }, { coin: -15, text: 'One of them knows you.' }),
      C('Decline', null, 0, { text: '“Suit yourself. Different carts.”' })]),
    E('The Light Beneath', 'A preacher of the old miners’ creed is speaking to four people and a dog about the sun that went ahead to wait.', [
      C('Stay and listen', 'wis', 10, { bless: 1, text: 'You leave lighter. You will start your next bout under a ward.' }, { text: 'You nod off. The dog judges you.' }),
      C('Leave an offering', null, 0, { coin: -15, bless: 1, text: 'The preacher marks your brow with lamp-oil. A ward for your next bout.' }),
      C('Move along', null, 0, { text: 'The sermon follows you down the street regardless.' })])
  ];
  function applyOutcome(o) {
    const st = G.state, bits = [];
    if (o.coin) { const c = Math.max(-st.coin, o.coin); st.coin += c; bits.push((c > 0 ? '+' : '') + c + ' coin'); }
    if (o.respect) { st.respect = Math.max(0, st.respect + o.respect); bits.push((o.respect > 0 ? '+' : '') + o.respect + ' respect'); }
    if (o.potion && st.potions < G.POTION_MAX) { st.potions++; bits.push('+1 potion'); }
    if (o.bless) { st.bless = 1; bits.push('warded for your next bout'); }
    G.save(); return bits.join(' · ');
  }

  // ------------------------------------------------------------ UI
  const show = (h, c) => ui._show(h, c), on = (s, f) => ui._on(s, f), esc = G.esc;
  ui.event = function () {
    const st = G.state, ev = pick(G.EVENTS); G.afterFight = false;
    const mod = s => G.mod(st.hero.stats[s]);
    show('<div class="card small letter event"><h2>' + ev.title + '</h2><p>' + ev.text + '</p><div class="choices">' +
      ev.choices.map((c, i) => '<button data-c="' + i + '"><b>' + c.label + '</b><small>' + (c.stat ? c.stat.toUpperCase() + ' check · d20 ' + G.fmtMod(mod(c.stat)) + ' vs DC ' + c.dc : c.dc ? 'Luck · d20 vs DC ' + c.dc : 'No roll') + '</small></button>').join('') + '</div></div>');
    on('[data-c]', el => {
      const c = ev.choices[+el.dataset.c]; let ok = true, line = '';
      if (c.dc) { const r = d20(), m = c.stat ? mod(c.stat) : 0, tot = r + m; ok = r !== 1 && (r === 20 || tot >= c.dc); line = '<div class="roll ' + (ok ? 'ok' : 'no') + '"><span class="die">' + r + '</span><b>' + (r === 20 ? 'Natural 20!' : r === 1 ? 'Natural 1.' : r + (c.stat ? ' ' + G.fmtMod(m) + ' = ' + tot : '') + ' against DC ' + c.dc) + '</b><small>' + (ok ? 'Success' : 'Failure') + '</small></div>'; G.sfx(ok ? 'coin' : 'deny'); }
      const o = ok ? c.win : (c.lose || c.win), got = applyOutcome(o);
      show('<div class="card small letter event"><h2>' + ev.title + '</h2>' + line + '<p>' + o.text + '</p>' + (got ? '<p class="got">' + got + '</p>' : '') + '<div class="row end"><button class="big" id="x">Carry on</button></div></div>');
      on('#x', () => { ui.close(); ui.topbar(); });
    });
  };
  ui.reports = function () {
    const st = G.state, rs = st.reports || []; st.reports = []; G.save();
    show('<div class="card small"><h2>The Tally Reports</h2>' + rs.map(r => '<div class="ab-row"><div class="roll mini ' + (r.ok ? 'ok' : 'no') + '"><span class="die">' + r.roll + '</span></div><div class="ab-tx"><b>' + esc(r.who) + '</b><small>' + r.job + (r.dc ? ' · ' + r.roll + ' + ' + r.bonus + ' vs DC ' + r.dc : '') + '</small><p>' + esc(r.who) + ' ' + r.text + '</p></div></div>').join('') + '<div class="row end"><button id="t">Give new orders</button><button class="big" id="x">Good</button></div></div>');
    on('#x', () => { ui.close(); ui.topbar(); }); on('#t', () => ui.tally());
  };
  ui.afterFight = function () {
    const st = G.state; if (!st.hero) return;
    const fresh = crew.sync();
    if (fresh.length) { G.save(); ui.toast(fresh.map(t => t.name).join(' and ') + ' swore to your Tally. Find them at the Low Lamp.'); }
    if (st.markReport) return ui.markReport();
    if ((st.reports || []).length) return ui.reports();
    if (G.afterFight && Math.random() < 0.6) return ui.event();
    G.afterFight = false;
  };
  ui.tally = function () {
    const st = G.state; crew.sync(); const slots = crew.slots(st), nextRank = G.RANKS[G.rankOf(st.respect) + 1];
    let h = '<div class="card"><h2>The Tally</h2><p class="dim">Down here a debt is a leash, and people have started owing <i>you</i>. Your Tallymen work off what they owe by doing what you would rather not be seen doing. Each job takes a number of your bouts. ' + st.tally.length + ' of 5 sworn' + (nextRank && st.tally.length < 5 ? '; another joins at ' + nextRank.name : '') + '.</p>';
    if (!st.tally.length) h += '<p class="note">Nobody owes you anything yet. Reach the rank of <b>Scrapper</b> and someone will.</p>';
    st.tally.forEach((t, i) => {
      const job = t.job && G.JOBS.find(j => j.id === t.job.id), sec = st.second === i;
      h += '<div class="tm"><span class="tp" data-p="' + i + '"></span><div class="ab-tx"><b>' + esc(t.name) + '</b><small>' + G.RACES[t.race].name + ' ' + G.CLASSES[t.cls].name + ' · skill +' + t.skill + ' · ' + t.trait + '</small>' +
        '<p>' + (job ? 'Out on <b>' + job.name + '</b>, back in ' + t.job.left + ' bout' + (t.job.left > 1 ? 's' : '') + '.' : sec ? 'In your corner as your <b>Second</b>. Call them once per bout.' : 'Idle at your hideout.') + '</p>' +
        (job ? '' : '<div class="row">' + G.JOBS.map(j => '<button class="mini" data-job="' + i + ':' + j.id + '" title="' + j.desc + '">' + j.name + '<i>' + j.fights + (j.fights > 1 ? ' bouts' : ' bout') + ' · ' + (j.dc ? 'DC ' + j.dc : 'sure') + ' · ' + j.gain + '</i></button>').join('') +
          '<button class="mini' + (sec ? ' sel' : '') + '" data-sec="' + i + '">' + (sec ? 'Dismiss as Second' : 'Make my Second') + '</button></div>') + '</div></div>';
    });
    h += '<div class="row end"><button class="big" id="x">Done</button></div></div>';
    show(h);
    document.querySelectorAll('#panel .tp').forEach(el => el.appendChild(G.portrait(crew.look(st.tally[+el.dataset.p]), 60)));
    on('#x', () => { ui.close(); ui.topbar(); });
    on('[data-job]', el => { const p = el.dataset.job.split(':'), t = st.tally[+p[0]], j = G.JOBS.find(q => q.id === p[1]); t.job = { id: j.id, left: j.fights }; if (st.second === +p[0]) st.second = null; G.save(); ui.tally(); if (G.world.cache.hideout) G.world.cache.hideout.refresh(); });
    on('[data-sec]', el => { const i = +el.dataset.sec; st.second = st.second === i ? null : i; G.save(); ui.tally(); });
  };
  ui.tailor = function (tab) {
    const st = G.state, c = cosOf(st), rk = G.rankOf(st.respect); tab = tab || 'dye';
    let h = '<div class="card"><h2>The Tailor’s Rack</h2><div class="tl-top"><span id="tlp"></span><div><p class="dim">Nothing here makes you hit harder. It makes them remember who hit them. You have <b>' + st.coin + '</b> coin.</p><div class="chips">' +
      SLOTS.map(s => '<button class="chip' + (s[0] === tab ? ' sel' : '') + '" data-tab="' + s[0] + '">' + s[1] + '</button>').join('') + '</div></div></div>';
    h += '<div class="ab-row"><div class="ab-ic pas">∅</div><div class="ab-tx"><b>Plain</b><p>As the Guild issued it.</p></div>' + (c[tab] ? '<button data-eq="">Wear</button>' : '<span class="lock">Worn</span>') + '</div>';
    G.COSMETICS.filter(x => x.slot === tab).forEach(x => {
      const own = c.owned[x.id], worn = c[tab] === x.id, locked = rk < x.rank; if (x.rank > 5 && !own) return;       // prizes only show once won
      h += '<div class="ab-row' + (locked && !own ? ' lockedrow' : '') + '"><div class="ab-ic pas" style="color:' + (tab === 'dye' ? '#' + G.DYES[x.id].cloth.toString(16).padStart(6, '0') : tab === 'weapon' ? '#' + G.WSKIN[x.id].glow.toString(16).padStart(6, '0') : x.color ? '#' + x.color.toString(16).padStart(6, '0') : 'var(--gold)') + '">' + ({ dye: '●', head: '♛', back: '❖', weapon: '⚔', aura: '✺' })[tab] + '</div><div class="ab-tx"><b>' + x.name + '</b><p>' + x.desc + '</p></div>' +
        (worn ? '<span class="lock">Worn</span>' : own ? '<button class="big" data-eq="' + x.id + '">Wear</button>' : locked ? '<span class="lock">' + G.RANKS[x.rank].name + '</span>' : '<button class="big" data-buy="' + x.id + '"' + (st.coin < x.cost ? ' disabled' : '') + '>' + x.cost + ' coin</button>') + '</div>';
    });
    h += '<div class="row end"><button id="b">Back to the Fence</button><button class="big" id="x">Done</button></div></div>';
    show(h);
    document.getElementById('tlp').appendChild(G.portrait(G.lookOf(st.hero, st), 120));
    on('#x', () => { ui.close(); ui.topbar(); G.world.walker.key = ''; if (G.scene === 'hub') G.world.enter('hub', { x: G.world.walker.x, z: G.world.walker.z }); });
    on('#b', () => ui.shop()); on('[data-tab]', el => ui.tailor(el.dataset.tab));
    on('[data-eq]', el => { c[tab] = el.dataset.eq || null; G.save(); G.sfx('place'); ui.tailor(tab); ui.topbar(); });
    on('[data-buy]', el => { const x = G.COSMETICS.find(q => q.id === el.dataset.buy); st.coin -= x.cost; c.owned[x.id] = true; c[tab] = x.id; G.save(); G.sfx('coin'); ui.tailor(tab); ui.topbar(); });
  };
})();
