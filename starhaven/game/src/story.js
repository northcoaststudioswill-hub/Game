// Starhaven — the story: intro panels, chapters, goals, every line of dialogue, choices, bonds, evenings, the journal.
// Data only. Follows DESIGN.md "Story outline", "Chapter goals", "Bonds" and "The cast" (Prologue through Chapter 2).
//
// A script is a list of steps:
//   ['who', 'text']                       a line. who = 'narr' is the narrator (no portrait).
//   { do: 'art', id, title }              show a full-screen illustrated scene behind the dialogue (id: null hides it)
//   { choose: [{ text, bond: { who: pts }, liked: 'who', then: [steps] }] }   the player picks; `then` plays next
//   { do: 'bond', who, pts }              bond points (hearts come at 40, 120, 240, 400 points)
//   { do: 'meet', who }                   first meeting: heart 1
//   { do: 'goal' | 'flag' | 'gate' | 'winnow' | 'wyrm' | 'complete' | 'end' ... }   game actions
(function (SH) {
  const S = SH.STORY = {};

  // Who can speak. Portraits are drawn by art.js.
  S.CAST = {
    wren: { name: 'Wren', color: '#ffd27a' },
    caelum: { name: 'Lord Caelum', color: '#b9a8ff' },
    queen: { name: 'Vael, the Eclipse', color: '#c8a8ff' },
    bram: { name: 'Bram', color: '#f0a860' },
    iris: { name: 'Iris', color: '#9fe0ff' },
    nessa: { name: 'Nessa', color: '#c8d0e0' },
    lissa: { name: 'Lissa', color: '#b8e8a0' },
    rowan: { name: 'Lord Rowan', color: '#e8c070' },
    thane: { name: 'Thane', color: '#e0a0b0' },
    mirelle: { name: 'Old Mirelle', color: '#e8c8a8' },
    narr: { name: '', color: '#b9b2dd' },
  };

  // How the game works, told the first time each thing matters (once per save) and listed under "How it works".
  S.EXPLAIN = {
    starlight: { icon: '\u2726', title: 'Starlight', text: 'The gold motes in every level. The counter beside MENU shows how many this level holds. Spend Starlight in the pause menu, under Constellation, on more hearts and stronger Bond Arts.' },
    lantern: { icon: '\u2600', title: 'Lanterns', text: 'Lighting a lantern fills your hearts. If Wren is knocked out she comes back at the last one she lit, with nothing lost.' },
    bonds: { icon: '\u2665', title: 'Bonds', text: 'What you say and do moves people toward you or away. A green card means closer, a red card means further, and the card says why. Each person has five hearts. A new heart plays a scene, gives Wren something real in a fight, and writes new pages in her journal. The journal shows what each heart gives and where each bond is heading.' },
    bow: { icon: '\u27B3', title: 'The starbow', text: 'Wren has a bow again, on its own button: BOW on the screen, I on a keyboard, RB on a controller. It aims itself at the nearest thing in front of her; hold up as you shoot to aim high. An arrow through a spy\'s wing brings it down: finish it with your daggers before it rises.' },
    moves: { icon: '\u2694', title: 'Wren\'s blades', text: 'Strike three times for a combo. Up and strike is a rising strike (and cuts straight up in the air). Strike during a dash is a lunge, her hardest hit. Down and strike in the air bounces her off what is below. Hold down on the ground to guard: blows from the front stop, and a guard raised at the last moment is a parry that leaves the enemy open. She cannot guard a fall or what is behind her.' },
    remember: { icon: '\u2726', title: 'This will be remembered', text: 'Some decisions change scenes later in the story. Green: someone is better for it. Red: it will cost her. Gold: it could go either way. They are listed in Wren\'s journal, under What Wren has done.' },
    bondbar: { icon: '\u263E', title: 'The bond bar and Bond Arts', text: 'The bar under your hearts fills as your hits land, faster for long unbroken strings. When it is full, a BOND ART button appears: a huge attack, with a memory. Nothing can hurt Wren while it plays.' },
    moons: { icon: '\u25CF', title: 'Moons and the Flame', text: 'Each Flame costs one moon. Hold the button and let go for a flame wave that costs two. Moons refill slowly by themselves, and quickly when your daggers land.' },
    xp: { icon: '\u2191', title: 'Levels', text: 'Wren earns experience by fighting, hunting, gathering Starlight, helping people and finishing chapters. Each level gives a perk for good; the bar under the Starlight count shows how close the next one is. Levels are earned, the Constellation is where you choose.' },
    opening: { icon: '\u2727', title: 'Perfect dodge', text: 'Dash through an attack at the last moment and time slows: an opening. For a moment every cut does more and gets past armor.' },
  };

  // Whispers down the Tether: short lines that slide in during play and never stop it.
  // Each is said once per save, in order (the boss lines repeat). [who, text]
  S.WHISPERS = {
    shadowDown: [['caelum', 'It\'s down. Now, Wren, before it remembers it can fly.'], ['caelum', 'Down again. Cut.']],
    pageLost: [['thane', 'They have a page! Oh, that was a good page.']],
    ready: [['caelum', 'Now, Wren. Reach down the bond. I\'ll answer.'], ['caelum', 'The bond is singing. Use it.']],
    dodge: [['caelum', 'Beautiful. Did Bram teach you that, or were you born rude?'], ['caelum', 'I felt that one miss you. Do it again.']],
    low: [['caelum', 'You\'re hurt. I can feel it. Find a lantern.'], ['caelum', 'Wren. Breathe. Then a lantern.']],
    kill: [['caelum', 'One less of the Iron King\'s toys.']],
    motesAll: [['caelum', 'Every scrap of starlight. Starhaven will remember that.']],
    stars: [['caelum', 'You\'re carrying enough starlight to light a star. Pause, and look at your Constellation.']],
    boss2: [['caelum', 'It\'s angry. Good. Angry things make mistakes.']],
    boss3: [['caelum', 'Nearly, Wren. Don\'t get greedy now.']],
    choke: [['caelum', 'Fire down its throat. I\'m stealing that.']],
    // Wren thinks out loud in a fight; it never stops the fight
    bossWon: [['caelum', 'I felt that from the city. Breathe, Wren. It\'s done.']],
    bossStart: [['wren', 'It is a wyrmling the size of a house. I know what to do with wyrmlings.']],
    bossStart4: [['wren', 'It is only a shadow. Shadows can be shot.']],
    hurt: [['wren', 'That one was mine to dodge. Watch the shoulders, not the teeth.']],
    combo10: [['wren', 'Ten in a row. Nessa would say I am showing off. Nessa would be right.']],
    room_ashes: [['caelum', 'This was the Artists\' Quarter. It was loud, once.']],
    room_ring: [['bram', 'Feet, huntress. I can hear you dragging them from here.']],
    room_mountain: [['thane', 'Do try not to set the Library on fire on your way out.']],
  };

  // Bonds (DESIGN.md "Bond pacing"): heart 1 when you meet; then hearts at these point totals.
  S.HEARTS_AT = [40, 120, 240, 400];
  S.BONDS = {
    caelum: { loves: 'Wren\'s sketches, starlit wine', perk: 'In missions, enemies glow just before they attack (later chapters).' },
    bram: { loves: 'Spiced bread, sparring', perk: 'Takes one hit for Wren per mission (later chapters).' },
    iris: { loves: 'Sugared plums, old maps', perk: 'Shows hidden chests on the map (later chapters).' },
    thane: { loves: 'Rare books, good ink', perk: '+20% XP from missions (later chapters).' },
    nessa: { loves: 'Being told the truth, firewood', perk: 'Her trust opens the chapter where Wren protects her sisters (later).' },
    lissa: { loves: 'Anything green, your paintings', perk: 'Her trust opens the chapter where Wren protects her sisters (later).' },
  };

  // Short version of the story so far, for the journal.
  S.RECAP = 'Wren was a mortal huntress feeding her two sisters through a starving winter. She shot down a low star to sell its light, and it was the heir of the Dawn House. Lord Rowan took her up the Stair through the Horizon as payment: a light for a light. When Vael, the Eclipse, swallowed the Houses of the sky, Wren went into the Umbra after him, took a loan of light from Lord Caelum of the Dusk House, and won the Eclipse\'s three trials. The Eclipse killed her anyway. Caelum gave her half of his own star, and she woke up Lit, tethered to him.';

  S.CHAPTERS = [
    {
      id: 'woods', label: 'Prologue, part 1', name: 'The Winter Woods', room: 'woods', mortal: true,
      abilities: { double: false, dash: false, daggers: false, bow: true },
      card: 'Before the Umbra, before the sky. Wren is nineteen, mortal, and the only hunter in a family that is slowly starving.',
      goals: [
        { id: 'hunt', text: 'Check your three snares', count: 3, counter: 'snares' },
        { id: 'stag', text: 'Shoot the low star over the clearing' },
      ],
      summary: 'Wren shot down a low star over the clearing. It was the heir of the Dawn House. That night Lord Rowan came for her and took her up the Stair: a light for a light.',
      done: 'A light for a light. Wren goes up through the Horizon into the sky, and doesn\'t look back, because if she does she won\'t go.',
      after: 'beyond_wall',
    },
    {
      id: 'prologue', label: 'Prologue, part 2', name: 'The Umbra', room: 'deep', mortal: true,
      card: 'The Eclipse\'s three trials: the Weighing, the Climb and the Dark. Win them all and Rowan goes free. Lose one, and Wren stays in the Umbra forever. The stars of Caelum\'s loan glow on her wrist.',
      goals: [
        { id: 'riddle', text: 'Trial 1, the Weighing: give the dark one memory at an altar' },
        { id: 'maze', text: 'Trial 2, the Climb: cross the Umbra (keep going right)' },
        { id: 'beast', text: 'Trial 3, the Dark: outrun it to the light' },
      ],
      summary: 'Wren won the Eclipse\'s three trials and freed Rowan. The Eclipse killed her anyway. Caelum gave her half of his own star, and she woke up Lit, tethered to him by a pull she never agreed to.',
      done: 'Wren is Lit now. Rowan carries her home to the Dawnhold. But a pull in her chest drags the other way, toward the Dusk House.',
    },
    {
      id: 'ch1', label: 'Chapter 1', name: 'Ashes', room: 'ashes',
      card: 'Three months later. Rowan has locked the Dawnhold\'s windows and doubled the guards, terrified of losing Wren again. Every night, the pull in her chest drags toward the Dusk House.',
      goals: [
        { id: 'arrive', text: 'Walk with Caelum to Starhaven' },
        { id: 'mural', text: 'Paint the first mural on the dark street' },
        { id: 'rooftop', text: 'Meet Caelum on his rooftop, at the end of the street' },
      ],
      summary: 'Caelum called in his debt of light and took Wren out of the Dawnhold to Starhaven. Her first mural woke up a street. On his rooftop he told her the truth about the Tether. Rowan called it theft and declared war.',
      done: 'In the Dawnhold, Rowan finds an empty bed and calls it theft. By morning, the Dawn House is marching on the Dusk House.',
      after: 'evening1',
    },
    {
      id: 'ch2', label: 'Chapter 2', name: 'The Five', room: 'ring',
      card: 'The Dawn House\'s army gathers on Dusk\'s southern border, and the Iron King\'s glasslings are testing the north. Caelum\'s inner circle, the Five, want to see what the reborn huntress can do.',
      goals: [
        { id: 'combo', text: 'Three cuts in a row on the training dummy' },
        { id: 'rise', text: 'Land a rising strike on the dummy' },
        { id: 'lunge', text: 'Land a dash strike on the dummy' },
        { id: 'guard', text: 'Stand by the dummy and guard its swing' },
        { id: 'pit', text: 'Cross Bram\'s glass pit by bouncing on the buds' },
        { id: 'sprites', text: 'Clear the glasslings past the north gate', count: 3 },
        { id: 'report', text: 'Talk to Caelum when you are ready to leave' },
      ],
      summary: 'Wren trained with Bram and cleared the Iron King\'s glasslings. Iris saw a vision: the Iron King knows Wren\'s name, and his iron is reaching for her sisters.',
      done: 'The Iron King knows Wren\'s name. Across the water, Nessa and Lissa don\'t know they\'re in danger.',
      after: 'evening2',
    },
    {
      id: 'ch3', label: 'Chapter 3', name: 'First Light', room: 'mountain',
      abilities: { flame: true },
      card: 'Wren wakes with fire in her hand. Starhaven\'s scholar, Thane, thinks he knows why. And in the mountains above the city, something big is killing shepherds.',
      goals: [
        { id: 'flame', text: 'Light the three braziers with Flame' },
        { id: 'wall', text: 'Melt the eclipse glass off the mountain road' },
        { id: 'hunt', text: 'Hunt the beast killing shepherds' },
      ],
      summary: 'Wren learned she carries sparks of every House\'s star, swallowed by the Eclipse and scattered when she fell, and Flame woke first. She melted the Eclipse\'s last glass off the mountain road and killed the Old Wyrm. On the peak, Rowan came for her, and she told him no.',
      done: 'Wren has her first House gift, and Rowan has his answer. The Dawn will not stop now. Neither will she.',
      after: 'evening3',
    },
    {
      id: 'ch4', label: 'Chapter 4', name: 'The Spy in the Library', room: 'library',
      abilities: { flame: true, fbow: true },
      card: 'Three nights after the Old Wyrm, something with wings landed on the Library roof. By morning, pages were missing from books nobody had opened in a hundred years. Thane has a starbow for Wren, and Bram has strung it himself.',
      goals: [
        { id: 'sky', text: 'Shoot the spies out of the courtyard sky', count: 2, counter: 'skyspies' },
        { id: 'stacks_done', text: 'Drive the spies out of the stacks before they carry off the pages', count: 3, counter: 'stackspies' },
        { id: 'shadow', text: 'Bring down the Spymaster\'s Shadow' },
      ],
      summary: 'The Iron King sent winged spies into the Library, led by a thing of shadow and iron. Wren shot them out of the air with a starbow Bram strung for her. The Shadow carried a letter sealed with the Dawn House\'s sunburst.',
      done: 'Rowan is writing to the Iron King. Whatever the Dawn House has become, it is no longer only Starhaven\'s enemy. It is his ally.',
      after: 'evening4',
    },
  ];

  S.SCRIPTS = {
    // ======================================================== Prologue part 1: the Winter Woods
    woods_start: [
      ['narr', 'The mortal lands, deep winter. The village has eaten its last stores, and the woods are almost empty.'],
      ['nessa', 'You\'re going out again? There\'s nothing left out there, Wren.'],
      ['wren', 'There\'s always something. You just have to go farther than everyone else.'],
      ['lissa', 'Bring back anything green? I found seeds in Mother\'s old trunk. When the thaw comes, I want to be ready.'],
      ['wren', 'I\'ll bring back dinner. Seeds are your department.'],
      ['nessa', 'Be back before dark. People have seen low stars in the trees again. Don\'t go near them.'],
      { do: 'goal', id: 'hunt' },
    ],
    woods_lissa: [
      ['lissa', 'Wren? When we have enough again... will you paint something on the wall? Like you used to, before.'],
      { choose: [
        { text: '"Maybe in spring."', bond: { lissa: 10 }, why: 'A promise she can hold on to.', remember: ['paintPromise', 'Promised Lissa a painting in spring.', true], then: [['lissa', 'I\'ll hold you to that. Spring always comes. That\'s the whole point of it.']] },
        { text: '"Paint doesn\'t feed anyone."', bond: { lissa: 5 }, why: 'She laughed, for the first time in a week.', remember: ['paintNo', 'Told Lissa that paint doesn\'t feed anyone.', false], then: [['lissa', 'Neither do I, and you keep me around.'], ['wren', 'Barely.'], ['narr', 'Lissa laughs. It\'s the first time in a week.']] },
        { text: '"I don\'t paint anymore."', bond: { lissa: -5 }, why: 'She went quiet. She misses who you were.', then: [['lissa', 'Oh.'], ['narr', 'Lissa goes back to sorting her seeds, smaller than she was a moment ago.']] },
      ] },
    ],
    woods_nessa: [
      ['narr', 'Nessa is splitting the last of the firewood. She hasn\'t eaten today either. She thinks Wren hasn\'t noticed.'],
      ['nessa', 'I\'d go with you if I could shoot. If you see any deadfall out there, we\'re down to the chairs.'],
      { choose: [
        { text: '"You\'d scare everything off with your opinions."', bond: { nessa: 5 }, why: 'She would rather be teased than pitied.', then: [['nessa', 'Someone in this family has to have them.']] },
        { text: '"Eat something, Ness. I\'ll find more."', bond: { nessa: 10 }, why: 'Somebody noticed.', remember: ['nessaEat', 'Told Nessa to eat first.', true], then: [['nessa', '...You first.'], ['narr', 'Neither of them moves. They\'ve been having this argument all winter.']] },
        { text: '"Then learn. I can\'t carry all three of us forever."', bond: { nessa: -10 }, why: 'True, and it landed like a slap.', remember: ['nessaHard', 'Told Nessa she could not be carried forever.', false], then: [['nessa', '...No. I don\'t suppose you can.'], ['narr', 'The axe comes down harder than it needs to.']] },
      ] },
    ],
    woods_wood: [
      ['narr', 'Three armfuls of deadfall, dry under the snow. Wren ties them to carry home.'],
      { do: 'remember', key: 'wood', text: 'Carried firewood home for Nessa.', good: true },
      { do: 'bond', who: 'nessa', pts: 10, why: 'She won\'t have to burn the last chair.' },
    ],
    woods_snare1: [
      ['wren', 'Empty. Sprung by the wind, or by something clever.'],
      ['narr', 'She resets it anyway. Her fingers know the knot without her.'],
    ],
    woods_range: [
      ['wren', 'Father\'s targets. He hung them the winter before the fever.'],
      ['wren', 'Three arrows, three rings. "Breathe out, then let go." I can still hear him.'],
    ],
    woods_targets: [
      ['narr', 'Three for three. The last one is still swinging.'],
      { do: 'remember', key: 'steady', text: 'Three for three at Father\'s targets.', good: true },
      ['wren', 'Still got it, old man.'],
    ],
    woods_snare2: [
      ['wren', 'Sprung. And chewed through.'],
      ['narr', 'Wolf prints in the snow, and not old ones. Something has been eating her catches all winter.'],
    ],
    woods_herb: [
      ['wren', 'Wintergreen. Alive, under all this. Lissa asked for anything green.'],
      ['narr', 'She wraps it in her scarf like something that could break.'],
    ],
    woods_wolf_seen: [
      ['wren', 'There you are.'],
      ['narr', 'The wolf stands over her last snare. Every rib shows through its coat.'],
    ],
    woods_wolf_hurt: [
      ['narr', 'The arrow takes it in the shoulder. It backs away, and does not run. It looks at the snare, and then at her.'],
      ['wren', 'You\'re as hungry as we are.'],
      ['narr', 'She has another arrow on the string. She could loose it. She could also just... not.'],
    ],
    woods_wolf_killed: [
      { do: 'flag', name: 'wolfdone' },
      ['narr', 'The second arrow is kinder than the winter would have been. A pelt, and a little stringy meat. It is the sensible thing.'],
      { do: 'remember', key: 'wolfKilled', text: 'Killed the starving wolf for its pelt.', good: null },
      { do: 'bond', who: 'nessa', pts: 5, why: 'A pelt is a pelt. Nessa approves of sensible.' },
      { do: 'bond', who: 'lissa', pts: -5, why: 'She won\'t ask where the fur came from. She\'ll know.' },
    ],
    woods_wolf_spared: [
      { do: 'flag', name: 'wolfdone' },
      ['narr', 'Wren lowers the bow. The wolf watches her a moment longer, then slinks away east, toward the edge of the world.'],
      { do: 'remember', key: 'wolfSpared', text: 'Let the starving wolf go.', good: true },
      { do: 'bond', who: 'lissa', pts: 5, why: 'Lissa would have done the same, and she\'ll hear it in how you tell it.' },
    ],
    woods_snare3: [
      ['narr', 'The last snare holds a rabbit. Thin, but alive. The first meat in nine days.'],
      { choose: [
        { text: 'Take it home for the pot', bond: { nessa: 5, lissa: 5 }, why: 'Something in the pot tonight, for all three.', remember: ['rabbitHome', 'Brought the rabbit home for her sisters.', true], then: [['wren', 'Sorry, small one. There are three of us.']] },
        { text: 'Eat now. You can\'t hunt on nothing', remember: ['rabbitAte', 'Ate the rabbit alone in the woods.', false], then: [['narr', 'It helps. Her hands stop shaking. She hates that it helps.']] },
        { text: 'Let it go. It\'s not enough to matter', remember: ['rabbitFree', 'Let the rabbit go.', null], then: [['narr', 'It is gone before she has finished deciding. Something bigger, then. It has to be something bigger.']] },
      ] },
    ],
    woods_tracks: [
      ["wren", "Light, low between the trees. A low star. They only come down this far in the coldest winters."],
      ["wren", "The lamp merchants pay a month of bread for a bright one."],
      { if: "steady", then: [["wren", "My hands are steady. Father's targets saw to that."]] },
    ],
    woods_stag: [
      { do: "flag", name: "stagseen" },
      ["narr", "In the clearing, a star hangs low enough to touch: a ball of white light the size of a lamb, drifting over the snow, trailing light like a veil."],
      ["wren", "The old stories say some of them are children. That they grow up into the sky."],
      ["wren", "The old stories don't feed anyone."],
      { do: "goal", id: "stag" },
    ],
    woods_kill: [
      { do: "flag", name: "hunt" },
      { do: "art", id: "hunt", title: "The Low Star" },
      { do: "cue", name: "shoot" },
      ["narr", "The arrow flies true."],
      ["narr", "The star falls into the snow and goes out slowly, like a held breath. For one moment the whole wood is warm, as if it were morning."],
      ["wren", "...What did I just do?"],
      { do: "art", id: "cottage", title: "That night" },
      ["narr", "That night there is bread and meat for the first time in weeks, bought with a jar of starlight. Lissa laughs. Even Nessa smiles."],
      { if: "green", then: [["lissa", "You found green! In this! Wren, it's alive. I'm putting it in the window."], { do: "bond", who: "lissa", pts: 10, why: "Her seeds have company now." }] },
      { if: "wood", then: [["narr", "The fire is high, and nobody has to look at the chairs."]] },
      { if: "wolfKilled", then: [["nessa", "A wolf pelt. That's a winter coat for Lissa. Good."], ["narr", "Lissa does not look at it."]] },
      { if: "rabbitAte", then: [["nessa", "There's fur on your sleeve. I'm glad one of us ate today."], { do: "bond", who: "nessa", pts: -5, why: "She said she was glad. She wasn't only glad." }] },
      { do: "cue", name: "door" },
      ["narr", "Then the door bursts open, and morning comes in with him, in the middle of the night."],
      ["rowan", "Who put out the star in the clearing?"],
      ["narr", "He is tall and golden, crowned with a ring of morning light, and the snow on the step melts where he stands."],
      { choose: [
        { text: "Step forward: \"I did.\"", remember: ["rowanHonest", "Told Lord Rowan the truth at the door.", true], then: [["rowan", "Honest, at least. That will make this easier."]] },
        { text: "\"It was a low star. We were starving.\"", then: [["rowan", "It was the heir of the Dawn House. In a hundred years it would have been a morning star. Now it is a jar of lamp oil."]] },
        { text: "Reach for your knife", remember: ["rowanKnife", "Reached for a knife against a Lord of the sky.", null], then: [["rowan", "Put it down, huntress. Mortal steel won't touch me, and I didn't come here to hurt your family."]] },
      ] },
      ["rowan", "The Accord of the Horizon is old and simple. A light put out Below is paid for with a light. Yours."],
      ["nessa", "Then take me instead."],
      { if: "nessaHard", then: [["narr", "An hour ago Wren told her she couldn't be carried forever. This is Nessa's answer."]] },
      ["wren", "No. Nessa, no."],
      ["rowan", "There is another way. Come up the Stair with me, and keep the Dawn House's lamps in its place for the rest of your days. Your sisters keep their lives, and you keep yours."],
      ["lissa", "Wren..."],
      ["wren", "Look after each other. Lissa, plant your seeds. Nessa... eat something."],
      ["nessa", "Come back."],
      ["wren", "I will."],
      ["narr", "He lifts her onto a white mare made of morning. They ride east, to the edge of the world, where the sky comes down to meet it."],
      { do: "art", id: null },
      { do: "mode", name: "flight", variant: "wall" },
      { do: "art", id: "wall", title: "The Horizon" },
      ["narr", "The night itself shimmers like a curtain: the Horizon, where the sky comes down to the ground. At dawn it opens, and the mare climbs the light like a stair."],
      ["rowan", "Nobody will hurt you up there. You have my word."],
      ["wren", "You just took me from my home."],
      ["rowan", "...Yes. I did."],
      ["narr", "Above the Horizon, it is always morning."],
      { do: "flag", name: "stag" },
      { do: "complete" },
    ],

    // ---------------- Above the Horizon: the Dawnhold, the Eclipse, the debt of light, the trials
    beyond_wall: [
      { do: "art", id: "garden", title: "The Dawnhold" },
      ["narr", "The Dawnhold is beautiful: gardens where it is always early morning, music that never stops, and a Lord who is kind, in his careful way."],
      ["rowan", "I had paints brought from three Houses. You said once that you used to paint."],
      ["wren", "I said that one time. At dinner. You remembered?"],
      ["rowan", "I remember everything you say. You say so little."],
      { choose: [
        { text: "\"Thank you, Rowan.\"", then: [["narr", "Rowan smiles like the sun came out. For a while, Wren lets herself be happy here."]] },
        { text: "\"Paint won't make me forget my sisters.\"", then: [["rowan", "I don't want you to forget them. I only want you to stay."]] },
      ] },
      ["narr", "She paints for the first time in years. She is never allowed past the garden walls."],
      { do: "art", id: "thorns", title: "The Eclipse" },
      ["narr", "Then the Eclipse came. One by one the Houses of the sky went dark, and the Dawnhold's morning began to dim."],
      ["queen", "Every House will go dark for me. Every Lord will bring me his light. Starting with the Dawn."],
      ["narr", "Vael, the Eclipse, dragged the Seven Lords down into the Umbra, the dark between the stars. When she took Rowan, Wren went after him."],
      ["wren", "He took me from my home. But he never hurt me, and nobody else was going to save him."],
      { do: "art", id: "cell", title: "The Umbra" },
      ["narr", "The Umbra. A cell, a fever, and a cut from a shard of her black glass that would not close."],
      { do: "cue", name: "caelum" },
      ["caelum", "So you're the mortal who walked in here on purpose. That was either very brave or very stupid."],
      ["wren", "Who... are you?"],
      ["caelum", "Caelum. Lord of the Dusk House, and the Eclipse's favorite prisoner. That cut will put your light out by morning. I can lend you some of mine."],
      ["caelum", "A loan, not a gift. You'll carry it on your wrist, and one day I'll ask for it back, in my own city. Say yes, huntress."],
      { choose: [
        { text: "\"Why would you help me?\"", bond: { caelum: 5 }, why: "A fair question. He respects those.", then: [["caelum", "Because you're the first person in fifty years to make her nervous. I'd like you alive."]] },
        { text: "\"What do you really want?\"", bond: { caelum: 10 }, why: "Straight to it. He liked that more than he showed.", then: [["caelum", "Someone on my side when this is over. Someone who doesn't kneel."]] },
        { text: "\"I don't make deals with the Lit.\"", bond: { caelum: 5 }, why: "Half dead and still stubborn. He was impressed anyway.", then: [["caelum", "Then you'll be dark by morning, before the first trial. Your choice."]] },
      ] },
      ["wren", "...Yes."],
      { do: "meet", who: "caelum" },
      ["narr", "A ring of tiny stars curls around Wren's wrist, glowing faintly. The debt is made."],
      { do: "art", id: "thorns", title: "The Eclipse" },
      ["queen", "Three trials, little huntress. The Weighing, the Climb, and the Dark. Win them all, and I let your Dawn lord go."],
      ["queen", "Lose one, and you both stay in my Umbra forever."],
    ],

    // ======================================================== Prologue part 2: the Umbra, the three trials
    deep_start: [
      ["queen", "The first trial. The Weighing. Everything has a weight down here, little huntress, and you are carrying too much."],
      ["queen", "Three altars. Lay one memory on one of them, and the dark will keep it. Any one. Choose."],
      { do: "flag", name: "asked" },
      ["narr", "Something wakes above each altar: a bowstring, a paintbrush, a girl's laugh caught in the light like a moth."],
      ["wren", "Father's voice. The first time I painted. Nessa laughing. ...She wants me to choose which part of me to lose."],
      { do: "goal", id: "riddle" },
    ],
    deep_altar_voice: [
      ["wren", "Father's voice. \"Breathe out, then let go.\" ...Take it."],
      ["narr", "The bowstring goes dark. Wren reaches for the sound of him and finds his hands, his shape, the targets. Not his voice. Never his voice again."],
      { do: "remember", key: "gaveVoice", text: "Gave the dark her father's voice.", good: null },
      { do: "goto", id: "deep_weighed" },
    ],
    deep_altar_paint: [
      ["wren", "The first time I painted. I was six, and it was a bird. ...Take it."],
      ["narr", "The brush goes dark. She knows she painted once, before the hunting. She cannot find the day."],
      { do: "remember", key: "gavePaint", text: "Gave the dark the first time she painted.", good: null },
      { do: "goto", id: "deep_weighed" },
    ],
    deep_altar_laugh: [
      ["wren", "Nessa laughing. She hardly does it anyway. ...Take it."],
      ["narr", "The light goes out of the moth. Wren knows her sister laughs. She can no longer hear it."],
      { do: "remember", key: "gaveLaugh", text: "Gave the dark the sound of Nessa laughing.", good: false },
      { do: "goto", id: "deep_weighed" },
    ],
    deep_weighed: [
      ["queen", "Weighed, and found lighter. How very dull. Go on, then. Climb."],
      { do: "flag", name: "riddle" },
      { do: "open", id: "riddlegate" },
      { if: "green", then: [["narr", "In the window of a cottage far Below, a sprig of wintergreen is still alive."]] },
      ["caelum", "Well done, huntress. Can you hear me? The loan on your wrist lets me speak to you. And lend you a little more."],
      ["narr", "The stars on Wren's wrist burn bright. Her legs feel lighter than they have ever felt."],
      { do: "goal", id: "maze" },
    ],
    deep_wall: [
      ["queen", "A wall you can't climb. Mortals always hit a wall."],
      ["caelum", "Jump, then jump again, off nothing at all. I've got you."],
    ],
    deep_dash: [
      ["wren", "Too far to jump."],
      ["caelum", "Then don't jump. Move like light does. Fast, and all at once."],
    ],
    deep_thorns: [
      ["queen", "My glass remembers mortals. It remembers how you bleed. And my glasslings are hungry."],
      ["caelum", "They are only glass, Wren. You have a knife and you have skinned worse. Break them."],
    ],
    deep_under: [
      ["queen", "You fell. Of course you fell. Look around, little huntress. This is where I keep the ones who lost."],
      ["caelum", "There is a way back up at the far end, past the cells. And Wren: look at them. Somebody should."],
    ],
    deep_tally: [
      ["narr", "Scratches in the black glass, in bundles of five. Wren stops counting at four hundred."],
      ["narr", "Under them, in a different hand, cut deep: SHE KEEPS HER WORD. THAT IS THE TRAP."],
      ["wren", "...Noted."],
    ],
    deep_pack: [
      ["narr", "A hunter's pack, the leather gone soft as cloth. Mortal-made. A bone-handled knife, and a ribbon a child might have tied on."],
      ["wren", "Somebody else came up the Stair. A long time ago. Nobody ever told a story about her."],
      ["narr", "Wren takes the ribbon. It seems wrong to leave all of her down here."],
    ],
    deep_caelum: [
      { do: "flag", name: "d_caelum" },
      ["caelum", "Don't look straight at me. She watches who I look at."],
      ["wren", "You wear her colors. You stand at her shoulder."],
      ["caelum", "I am her favorite. It is the worst thing I have ever been, and the most useful."],
      { choose: [
        { text: "\"Then why help me?\"", bond: { caelum: 10 }, why: "Nobody has asked him why in fifty years.", then: [
          ["caelum", "Because you walked in here on purpose. For someone else. I had forgotten people could do that."],
        ] },
        { text: "\"I don't trust you.\"", bond: { caelum: 5 }, why: "He would have thought less of her if she did.", then: [
          ["caelum", "Good. Don't. Trust the stars on your wrist: they cannot lie, even when I do."],
        ] },
      ] },
      ["caelum", "Fifty years she has held the Seven Lords in this dark. She makes us watch each other kneel."],
      ["caelum", "She keeps the letter of her word, Wren, and nothing else. Remember that when she smiles. Now go. The wall ahead is taller than it looks."],
    ],
    deep_rowan: [
      { do: "flag", name: "d_rowan" },
      ["rowan", "Wren. No. You were supposed to stay behind my walls. I gave orders."],
      ["wren", "You gave a great many orders. I climbed the wall."],
      ["narr", "The cage is black glass. Where his hands have gripped it, they are cut, and his light runs out of the cuts like water."],
      { choose: [
        { text: "\"I came to get you out.\"", remember: ["rowanCame", "Told Rowan, through the bars, that she came for him.", true], then: [
          ["rowan", "Nobody comes for a Lord of the sky. We are the ones who come."],
          ["wren", "Then it was past time somebody did."],
        ] },
        { text: "\"A light for a light. That's your law. I'm paying it.\"", remember: ["rowanDebt", "Told Rowan she came to pay a debt, nothing more.", null], then: [
          ["rowan", "You owe me nothing. You never did. I only did not know how else to keep you."],
        ] },
      ] },
      ["rowan", "Whatever she offers you at the end, do not take it. Run. Leave me."],
      ["wren", "I am very bad at being told what to do. Ask my sisters."],
    ],
    deep_chase: [
      { do: "flag", name: "maze" },
      ["queen", "You climbed my dark. Then the last trial is the Dark itself. Wake up, my hunger. She's yours."],
      ["caelum", "Wren. Run. Don't look back. Run for the light."],
      { do: "goal", id: "beast" },
      { do: "wyrm" },
    ],
    deep_end: [
      { do: "flag", name: "beast" },
      { do: "art", id: "trials", title: "The Eclipse's Throne" },
      { do: "cue", name: "end" },
      ["queen", "Three trials. A mortal won all three. That has never happened."],
      ["queen", "I keep my word. Your Dawn lord is free. All the Lords are free."],
      ["narr", "Then, smiling, the Eclipse drove a shard of black glass into Wren's heart."],
      ["wren", "Tell my sisters..."],
      { do: "art", id: "rebirth", title: "Caelum's Light" },
      ["narr", "Her light went out. The Eclipse fell. And Caelum, free at last, was already kneeling beside her."],
      ["caelum", "No. Not like this. Not you."],
      ["narr", "He opened his hands, and the light of his own star came out of him, silver and violet. He gave her half of it."],
      { do: "cue", name: "rise" },
      ["narr", "It burned through her like a comet. Her heart started again. The freckles on her face began to glow, faintly, like stars at dusk. She was not mortal any more. She was Lit."],
      ["narr", "And she felt it: a pull in her chest, steady as gravity, running straight to him. Two stars sharing one light fall into orbit."],
      ["wren", "...Caelum? What did you do?"],
      ["caelum", "...What I had to."],
      ["narr", "Before he could say anything more, Rowan pulled her into his arms, and carried her home to the Dawnhold."],
      { do: "complete" },
    ],

    // ======================================================== Chapter 1: Ashes
    ashes_start: [
      { do: 'art', id: 'spring', title: 'The Dawnhold, three months later' },
      ['narr', 'Three months later. Rowan has given Wren everything: silk, music, a garden, guards at every door.'],
      ['narr', 'He has not given her a way out. And every night the pull in her chest drags east, toward the Dusk House.'],
      ['wren', 'I can feel him. Even from here. What did he do to me?'],
      { do: 'art', id: 'window', title: 'Midnight at the Dawnhold' },
      ['narr', 'Midnight. The Dawnhold is asleep. Wren is not.'],
      ['caelum', 'Good evening, Wren. You look like you haven\'t slept in three months.'],
      ['wren', 'Caelum. You can\'t be here. If Rowan finds the Lord of Dusk in his house...'],
      ['caelum', 'They\'d be terribly rude about it. I\'m here for what I\'m owed: the light I lent you in the Umbra. It can only be paid back in my city.'],
      { do: 'meet', who: 'caelum' },
      { choose: [
        { text: '"Fine. Get me out of here."', bond: { caelum: 10 }, why: 'No hesitation. He had hoped, and not let himself expect it.', then: [
          ['caelum', 'Gladly. You\'ve been holding your breath for three months. Let\'s find you somewhere you can breathe.'],
        ] },
        { text: '"I don\'t belong to you."', bond: { caelum: 5 }, why: 'He agreed with her, which surprised them both.', then: [
          ['caelum', 'No. You don\'t belong to anyone. That\'s rather the point. Repay the debt, and then you decide.'],
        ] },
        { text: '"Why now?"', bond: { caelum: 10 }, why: 'She asked the question he came ready to answer.', then: [
          ['caelum', 'Because the Iron King is moving, and I need people I trust. You are one of very few.'],
        ] },
      ] },
      ['wren', 'And this pull in my chest? Since the Umbra, I can feel you. All the time. What did you do to me?'],
      ['caelum', 'I\'ll tell you everything, I promise. Not here, with Rowan\'s guards outside the door.'],
      ['caelum', 'Take my hand. And don\'t scream. It carries.'],
      ['narr', 'He does not use the door. He opens the window, and then he becomes light: a streak of shadow and silver, with Wren held inside it, falling upward.'],
      { do: 'art', id: null },
      { do: 'mode', name: 'flight' },
      ['narr', 'They come down on a mountain road in the cold, with the smell of pine, and Wren\'s legs do not quite work.'],
      ['caelum', 'The wards will not let me carry you in. From here we walk. The Lit can fall from one place to another, like a star: I\'ll meet you up the road.'],
      { do: 'goal', id: 'arrive' },
      { do: 'winnow', npc: 'caelum', to: 41 },
    ],
    // A resident's request (DESIGN.md: small errands for the people of Starhaven, paid in Starlight)
    ashes_mirelle: [
      { if: 'cat', then: [
        ['mirelle', 'She came home with soot on her nose and no apology. That was you, on the awning? Bless you, girl.'],
        ['mirelle', 'We have not had a stranger do a kindness on this street since the lamps went out.'],
      ], else: [
        ['mirelle', 'You are the one he brought back. Hm. Thinner than I expected.'],
        ['mirelle', 'If you are going up the street: my cat, Ember. Black, rude, about so big. She climbs when the dark frightens her, and it is all dark now.'],
        ['wren', 'I\'ll look up as I go.'],
      ] },
    ],
    ashes_lamps: [
      ['narr', 'The fourth lamp catches. All down the street, gold runs from window to window, and somewhere a shutter opens that has been shut for months.'],
      ['narr', 'Old Mirelle has come out onto her step to look up at them.'],
      ['mirelle', 'Forty years I lit those, till my knees gave out before the lamps did. Nobody asked you to. That is the right way to do it.'],
      { do: 'remember', key: 'lamps', text: 'Lit the four dark lamps on Mirelle\'s street, unasked.', good: true },
      ['wren', 'It felt wrong, walking past them.'],
      ['mirelle', 'Then you will do, girl. This city is made of people who could not walk past.'],
    ],
    ashes_cat_found: [
      ['narr', 'A black cat is flattened on the awning, pretending not to be afraid. It considers Wren, then walks onto her shoulder as if that had been the plan.'],
      ['narr', 'At the street it jumps down and trots home, tail up.'],
      { do: 'remember', key: 'cat', text: 'Brought Old Mirelle\'s cat down from the awning.', good: true },
      { do: 'starlight', n: 10, why: 'the first kindness on this street in a long while' },
    ],
    mtn_page: [
      ['narr', 'A page, frozen to the rock. The hand is small and exact, and the margin says: "wyrms sleep facing the wind. T."'],
      ['wren', 'Thane\'s. He must have lost it up here years ago.'],
      { do: 'remember', key: 'page', text: 'Found Thane\'s lost page on the mountain.', good: true },
      { do: 'starlight', n: 5, why: 'a page for the Library' },
    ],
    ashes_overlook: [
      ['caelum', 'That glow ahead is Starhaven. Hidden from every other House for a thousand years.'],
      ['wren', 'Why show it to me?'],
      ['caelum', 'Because the Iron King is coming, and my city has gone dark. It needs someone who can make it shine again.'],
      { do: 'winnow', npc: 'caelum', to: 57 },
    ],
    ashes_gate: [
      ['caelum', 'The war took our painters and our lamplighters. Half of Starhaven sits in the dark now.'],
      ['caelum', 'You painted once, before the hunting. You told me, in the Umbra.'],
      ['wren', '...I remember. I haven\'t held a brush since.'],
      ['caelum', 'There\'s a bare wall halfway down this street. Paint something on it.'],
      { do: 'flag', name: 'arrive' },
      { do: 'goal', id: 'mural' },
      { do: 'winnow', npc: 'caelum', to: 80 },
    ],
    ashes_painted: [
      ['wren', 'I\'d forgotten how much I missed this.'],
      { if: 'gavePaint', then: [['wren', 'I gave the dark the first time I painted. So this is the first time, then. I get to have it again.']] },
      { if: 'paintPromise', then: [['wren', 'I told Lissa "maybe in spring". It isn\'t spring. I painted anyway. She\'d say that counts.']] },
      { if: 'paintNo', then: [['wren', 'I told Lissa paint doesn\'t feed anyone. I was wrong about what it feeds.']] },
      ['caelum', 'Look. The street is waking up. Every mural you paint brings a little more of Starhaven back.'],
      ['caelum', 'My house is at the end of the street. Climb up to the roof. I\'ll be waiting.'],
      { do: 'goal', id: 'rooftop' },
      { do: 'winnow', npc: 'caelum', to: 110, y: 10 },
    ],
    ashes_roof: [
      { do: 'art', id: 'rooftop', title: 'The Rooftop House' },
      ['caelum', 'This is the Rooftop House. It\'s yours too, if you want it.'],
      ['wren', 'And if I don\'t?'],
      ['caelum', 'Then you get a very nice room and a very annoying neighbor.'],
      ['caelum', 'You painted my street awake in one night. Do you know how long it\'s been dark?'],
      { choose: [
        { text: '"How long?"', bond: { caelum: 5 }, why: 'She asked about his city before she asked about herself.', then: [
          ['caelum', 'Fifty years. Since she took me, and my painters and lamplighters went to war without me. I came home three months ago and could not make myself look at it.'],
        ] },
        { text: '"Is that why you really brought me here?"', bond: { caelum: 10 }, why: 'She saw straight through him. He is not used to that.', then: [
          ['caelum', 'Partly. And partly because I remember a girl in the Umbra who didn\'t break. I wanted to see her again.'],
        ] },
        { text: '"Don\'t get sentimental, Lord of Dusk."', bond: { caelum: 5 }, why: 'She teased him. Nobody teases him.', then: [
          ['caelum', 'Too late. I\'m unbearable when I\'m sentimental. Ask anyone.'],
        ] },
      ] },
      ['wren', 'You promised to tell me. This pull. What is it?'],
      ['caelum', 'A tether. When your light went out, I gave you half of mine. Two stars that share one light fall into orbit. You will feel me for the rest of your life, and I will feel you.'],
      ['caelum', 'I did it while you were dead. There was no one to ask.'],
      { choose: [
        { text: '"You tied yourself to me without asking."', bond: { caelum: 5 }, why: 'She was angry, and said so to his face. He respects that more than he can say.', remember: ['tetherAngry', 'Told Caelum he had no right to tie her to him.', null], then: [
          ['caelum', 'Yes. I would do it again, and I will not pretend to be sorry for that. I am sorry it was not yours to choose.'],
        ] },
        { text: '"Can it be undone?"', bond: { caelum: 10 }, why: 'She asked the real question. He had been waiting for it, and dreading it.', remember: ['tetherAsk', 'Asked whether the Tether can be undone.', null], then: [
          ['caelum', 'Thane thinks so. It would cost us both. If you ask me to, I will help you find out how.'],
        ] },
        { text: 'Say nothing. Take his hand.', bond: { caelum: -5 }, why: 'He thinks she is being kind because he saved her. He wanted her to be angry first.', then: [
          ['narr', 'He does not take it. "Not yet," he says. "Not because you think you owe me. Be angry first. Then decide."'],
        ] },
      ] },
      ['caelum', 'It doesn\'t bind you to anything but the pull. You owe me nothing for it. Whatever you choose, it\'s yours to choose.'],
      ['wren', 'Rowan will come for me.'],
      ['caelum', 'He\'ll come for me. Let him. Tomorrow you meet the Five, my inner circle. Try not to stab any of them.'],
      ['wren', 'No promises.'],
      { do: 'bond', who: 'caelum', pts: 10, why: 'A roof, a view, and the truth at last.' },
      { do: 'flag', name: 'rooftop' },
      { do: 'complete' },
    ],

    // ---------------- Evening 1: the first night in Starhaven (with Caelum)
    evening1: [
      { do: 'art', id: 'rooftop', title: 'Evening: the Rooftop House' },
      ['narr', 'Wren\'s first night in Starhaven. Below her, one street glows. The rest of the city waits in the dark.'],
      ['caelum', 'Can\'t sleep either?'],
      ['wren', 'I don\'t sleep much. The Umbra follows me.'],
      ['caelum', 'Mine too. Here. Starlit wine. It tastes like the first warm night of summer.'],
      { choose: [
        { text: 'Show him your sketchbook', liked: 'caelum', bond: { caelum: 15 }, why: 'You let him see the worst thing you carry.', remember: ['sketchbook', 'Showed Caelum the sketchbook of the Umbra.', true], then: [
          ['caelum', '...These are the Umbra. You drew it from memory?'],
          ['wren', 'So I could stop seeing it. It doesn\'t work.'],
          ['caelum', 'It might, one day. Draw Starhaven next. Give the Umbra some competition.'],
        ] },
        { text: 'Toast to the debt, paid', bond: { caelum: 5 }, why: 'Easy company, and nothing risked.', then: [
          ['caelum', 'To the debt. The best loan I ever made, and I\'ve made some very good ones.'],
        ] },
        { text: 'Ask what he sees in his nightmares', bond: { caelum: 10 }, why: 'Nobody asks him. You did.', remember: ['nightmares', 'Asked Caelum about his nightmares.', true], then: [
          ['caelum', 'The Eclipse\'s court. Smiling at her while she held my people hostage.'],
          ['caelum', 'I\'d do it again to keep them safe. I hate that I\'d do it again.'],
        ] },
      ] },
      ['caelum', 'The Five will test you tomorrow. Bram will try to break you. Iris will try to read you. Let them.'],
      ['wren', 'And you?'],
      { do: 'bond', who: 'caelum', pts: 20, why: 'An evening together.' },
      ['caelum', 'I\'ll be watching from somewhere I can pretend I\'m not.'],
    ],

    // ======================================================== Chapter 2: The Five
    ring_start: [
      ['bram', 'So you\'re the huntress who walked out of the Umbra. I\'m Bram. I run the Training Ring.'],
      { do: 'meet', who: 'bram' },
      ['bram', 'Half the Dawn House wants your head for running off with our Lord. Or him running off with you. The songs disagree.'],
      ['bram', 'Either way, there\'s an army on our southern border with your name on its banners. Caelum says you can fight. I\'d like to see it.'],
      { choose: [
        { text: '"Point me at something."', bond: { bram: 10 }, why: 'A fighter\'s answer. Bram speaks that language.', then: [
          ['bram', 'Ha! I like you already. Don\'t tell Caelum.'],
        ] },
        { text: '"Caelum talks about me?"', bond: { bram: 5 }, why: 'She made him laugh inside a minute.', then: [
          ['bram', 'Constantly. It\'s unbearable. Please hit something so he\'ll stop.'],
        ] },
      ] },
      ['bram', 'Go hit the dummy. Three cuts in a row, and make the last one count.'],
      { do: 'goal', id: 'combo' },
    ],
    ring_combo: [
      ['bram', 'Not bad. That\'s one cut. A fight wants four.'],
      ['bram', 'Second: the rising strike. Blade up, and let it carry you off the ground. It reaches what a level cut can\'t.'],
      { do: 'flag', name: 'combo1' },
      { do: 'goal', id: 'rise' },
    ],
    ring_rise: [
      ['bram', 'There. Anything above you is no longer safe from you.'],
      ['bram', 'Third: the lunge. Dash, and strike while you\'re still moving. It hits harder than anything else you have, and nothing can touch you on the way in.'],
      { do: 'flag', name: 'rise' },
      { do: 'goal', id: 'lunge' },
    ],
    ring_lunge: [
      ['bram', 'Ha! That one I felt from here.'],
      ['bram', 'Last, and the one that keeps you alive: your guard. Plant your feet and hold. A blow from the front stops on your blades.'],
      ['bram', 'Raise it at the last moment and it\'s a parry: they\'re wide open, and your next cut bites deeper. The dummy\'s arm is about to come round. Stand close and stop it.'],
      { do: 'flag', name: 'lunge' },
      { do: 'goal', id: 'guard' },
    ],
    ring_guard: [
      { do: 'flag', name: 'guard' },
      { do: 'explain', key: 'moves' },
      ['bram', 'Good. You can\'t guard what\'s behind you, and you can\'t guard a fall. Everything else, you can.'],
      ['bram', 'Now my glass pit.'],
      ['bram', 'Jump toward the buds and strike down on them. Each bounce gives you your jumps back. Don\'t fall in.'],
      { do: 'flag', name: 'combo' },
      { do: 'goal', id: 'pit' },
      { do: 'gate', id: 'pitgate' },
    ],
    ring_pit: [
      ['bram', 'Ha! Clean. Now some real work.'],
      ['bram', 'Glasslings. The Iron King has learned to wake the Eclipse\'s glass and send it walking. Three came over the north wall last night. Clear them out.'],
      ['bram', 'They glow orange right before they lunge. Dash through the lunge, then cut them down.'],
      { do: 'bond', who: 'bram', pts: 10, why: 'Clean across his glass pit.' },
      { do: 'flag', name: 'pit' },
      { do: 'goal', id: 'sprites' },
      { do: 'gate', id: 'northgate' },
    ],
    iris: [
      ['iris', 'Oh! You\'re the new one. I\'m Iris. I read the stars: every life is a thread of light, and I can see where they cross.'],
      { do: 'meet', who: 'iris' },
      ['iris', 'Yours is very tangled and very shiny. Anyway, hi!'],
      { choose: [
        { text: '"What does tangled mean?"', bond: { iris: 10 }, why: 'She asked what Iris actually sees. Almost nobody does.', then: [
          ['iris', 'It means lots of people are tied to you. Some you know. Some you will. One you\'re pretending you don\'t.'],
        ] },
        { text: '"Shiny is good, right?"', bond: { iris: 5 }, why: 'Iris likes people who can joke about fate.', then: [
          ['iris', 'Shiny is very good! Mostly. Shiny things get noticed.'],
        ] },
      ] },
      ['iris', 'Go stab things. Bram likes that.'],
    ],
    ring_done: [
      ['caelum', 'Three glasslings, on your first day. Bram owes me a drink.'],
      ['bram', 'Bram owes nobody anything.'],
      ['caelum', 'The Iron King is testing our walls, Wren. Next time it won\'t be sprites.'],
      { do: 'winnow', npc: 'iris', near: 2 },
      ['iris', 'Wait! Before anyone goes anywhere. When the last sprite broke, I saw something.'],
      { do: 'meet', who: 'iris' },
      { do: 'art', id: 'vision', title: 'Iris\'s vision' },
      ['narr', 'Threads of light, crossing the sea. An iron crown, pulling on two of them.'],
      ['iris', 'Two mortal girls. Your thread is tied to theirs, Wren. And the iron is getting closer.'],
      ['wren', 'My sisters.'],
      ['caelum', 'Then the Iron King knows who you are. Those sprites weren\'t testing our walls. They were looking for you.'],
      ['bram', 'The Dawn at our southern border, iron at our north. He wants us fighting Rowan while he walks in the back door.'],
      { choose: [
        { text: '"If he touches them, I\'ll kill him."', bond: { bram: 10 }, why: 'Bram trusts people who know what they would kill for.', then: [
          ['bram', 'Get in line, huntress. But I\'ll hold your coat.'],
        ] },
        { text: '"How do we keep them safe?"', bond: { caelum: 10 }, why: 'She said "we" without noticing. He noticed.', then: [
          ['caelum', 'Quietly, for now. I\'ll have eyes on their village by morning. You have my word.'],
        ] },
        { text: '"Iris, what else did you see?"', bond: { iris: 10 }, why: 'She trusted the vision, and the seer.', then: [
          ['iris', 'Fire. In your hands. Which is new. I\'d keep an eye on that.'],
        ] },
      ] },
      { do: 'art', id: null },
      { do: 'flag', name: 'sprites' },
      { do: 'complete' },
    ],

    // ---------------- Evening 2: choose who to spend it with
    evening2: [
      { do: 'art', id: 'city', title: 'Evening: Starhaven' },
      ['narr', 'Night falls over Starhaven. Wren can\'t stop thinking about her sisters, and she doesn\'t want to be alone.'],
      { do: 'art', id: null },
      { do: 'mode', name: 'city', title: 'THE LAMP SQUARE, EVENING', spots: [{ who: 'caelum', label: 'with Caelum, on the rooftop' }, { who: 'bram', label: 'with Bram, at the Ring' }, { who: 'iris', label: 'with Iris, in her tower' }] },
      { choose: [
        { text: 'Caelum, on the rooftop', then: [{ do: 'goto', id: 'ev2_caelum' }] },
        { text: 'Bram, at the Training Ring', then: [{ do: 'goto', id: 'ev2_bram' }] },
        { text: 'Iris, in her tower above the Library', then: [{ do: 'goto', id: 'ev2_iris' }] },
      ] },
    ],
    ev2_caelum: [
      { do: 'art', id: 'rooftop', title: 'Evening with Caelum' },
      ['narr', 'The rooftop again. Caelum hasn\'t slept. Reports are stacked under a wine bottle.'],
      ['caelum', 'Rowan sent a letter today. He says I stole you, and he will have you back, or have my House in ashes.'],
      ['caelum', 'And my spies say the Iron King asked about you by name. My people are already watching your sisters\' village.'],
      { choose: [
        { text: '"Thank you."', bond: { caelum: 10 }, why: 'She let him help. That is new.', then: [
          ['caelum', 'Don\'t. It isn\'t a favor. It\'s what you do for your own.'],
        ] },
        { text: '"I should go to them myself."', bond: { caelum: 5 }, why: 'He would have said the same in her place.', then: [
          ['caelum', 'You will. When it\'s time, I\'ll fly you there myself. Not before you\'re ready.'],
        ] },
        { text: 'Give him a sketch of Starhaven', liked: 'caelum', bond: { caelum: 15 }, then: [
          ['caelum', 'You drew my city.'],
          ['caelum', '...Our city. If you\'ll have it.'],
        ] },
      ] },
      ['caelum', 'One more thing. The debt. You don\'t owe me anything anymore. You can leave whenever you like.'],
      { do: 'bond', who: 'caelum', pts: 20, why: 'An evening together.' },
      ['wren', '...I know. I\'m staying anyway.'],
    ],
    // Chapter 2, more to do
    ring_bram_talk: [
      ['bram', 'Before you swing at anything: why are you here, huntress? Not "he stole me". Why are you still here?'],
      { choose: [
        { text: '"Because nobody here has lied to me yet."', bond: { bram: 10 }, why: 'He respects a reason that small and that true.', remember: ['bramTruth', 'Told Bram she stays because nobody here has lied to her.', true], then: [['bram', 'Hm. Give it a week. But that\'s a soldier\'s answer. I\'ll take it.']] },
        { text: '"I\'m here to get strong enough to leave."', bond: { bram: 5 }, why: 'Honest. He\'d have said the same at your age.', remember: ['bramLeave', 'Told Bram she is here to get strong enough to leave.', null], then: [['bram', 'Then I\'ll train you well enough that leaving is your choice and not anyone else\'s.']] },
        { text: '"That\'s between me and your Lord."', bond: { bram: -5 }, why: 'He has buried people who kept things from him.', then: [['bram', 'Everything in this city is between you and the people who\'ll bleed next to you. Remember that.']] },
      ] },
      ['bram', 'There are three rings hung past the dummy. Cut them all and I\'ll believe your feet as well as your mouth.'],
    ],
    ring_rings: [
      { do: 'flag', name: 'rings3' },
      ['bram', 'Low, rising, and one from the air. Who taught you to read a target?'],
      ['wren', 'My father, on straw. I left the bow Below. The eye came with me.'],
      { if: 'gaveVoice', then: [['wren', 'I can\'t remember his voice any more. I gave it away. I remember his hands on the bow.']] },
      ['bram', 'Daggers for now. When you\'ve earned a starbow, I\'ll string it myself.'],
      { do: 'remember', key: 'rings', text: 'Cut all three of Bram\'s rings.', good: true },
      { do: 'bond', who: 'bram', pts: 10, liked: true, why: 'Three for three. He stopped pretending not to watch.' },
    ],
    ring_plums: [
      ['narr', 'A market crate, burst open in the north wood. Most of it is ruined. One paper twist of sugared plums is not.'],
      ['wren', 'Somebody ran from here in a hurry. ...Iris said something about plums.'],
      { do: 'remember', key: 'plums', text: 'Saved a twist of sugared plums from the north wood.', good: true },
    ],
    ev2_bram: [
      { do: 'art', id: 'fire', title: 'Evening with Bram' },
      ['narr', 'The Training Ring after dark. Bram is burning old practice dummies in a fire pit.'],
      ['bram', 'Come to gloat? You broke my best dummy.'],
      { if: 'rings', then: [['bram', 'And cut my rings. All three. I\'ve had captains who couldn\'t.']] },
      { if: 'bramTruth', then: [['bram', 'You said nobody here had lied to you yet. Still true?'], ['wren', 'Still true.'], ['bram', 'Good. Keep counting.']] },
      { choose: [
        { text: 'Bring him spiced bread from the market', liked: 'bram', bond: { bram: 15 }, then: [
          ['bram', 'Is that from the Night Market? Sit down, huntress. You\'re officially my favorite. Don\'t tell Iris.'],
        ] },
        { text: '"Spar with me again."', bond: { bram: 10 }, why: 'Asking for more is the fastest way to Bram\'s good side.', then: [
          ['bram', 'Now you\'re talking.'],
          ['narr', 'You spar until neither of you can lift an arm, then lie in the sand laughing.'],
        ] },
        { text: 'Ask about the north wall', bond: { bram: 5 }, why: 'She thinks like a soldier. He approves.', then: [
          ['bram', 'Lost my brother on that wall, years back, to the Iron King\'s father. I don\'t lose people on it anymore.'],
        ] },
      ] },
      ['bram', 'You fight like someone with people to protect.'],
      ['wren', 'Two sisters. Mortal. Across the sea.'],
      { do: 'bond', who: 'bram', pts: 20, why: 'An evening together.' },
      ['bram', 'Then we keep them safe. That\'s what the Five do.'],
    ],
    ev2_iris: [
      { do: 'art', id: 'observatory', title: 'Evening with Iris' },
      ['narr', 'A round tower above the Library, full of maps, candles and threads of starlight hanging in the air.'],
      ['iris', 'You came! Nobody visits the seer. They\'re afraid I\'ll tell them how they die.'],
      { if: 'plums', then: [['wren', 'I found these in the north wood. I think they were coming to you.'], ['iris', 'SUGARED PLUMS. I saw these arriving and I didn\'t dare believe it. You are my favorite thread.'], { do: 'bond', who: 'iris', pts: 15, liked: true, why: 'Sugared plums, carried out of a thornwood, for her.' }] },
      { choose: [
        { text: 'Bring her sugared plums', liked: 'iris', bond: { iris: 15 }, then: [
          ['iris', 'Plums! Sugared! Oh, you\'re a good thread, Wren. A very good thread.'],
        ] },
        { text: 'Ask about your sisters\' threads', bond: { iris: 10 }, why: 'She asked Iris to look again, knowing what looking costs her.', then: [
          ['iris', 'Bright. Stubborn. One sharp, one soft. And iron getting closer. I\'m sorry. I can\'t see past it yet.'],
        ] },
        { text: '"So how do I die?"', bond: { iris: 5 }, why: 'Gallows humor. Iris collects it.', then: [
          ['iris', 'Ha! No. But not soon. You have far too much painting to do.'],
        ] },
      ] },
      ['iris', 'Can I tell you a secret? Caelum\'s thread tangled with yours the day you walked into the Umbra. He pretends it didn\'t.'],
      { do: 'bond', who: 'iris', pts: 20, why: 'An evening together.' },
      ['wren', '...Does he.'],
    ],

    // ---------------- Heart scenes: play when a bond reaches a new heart
    heart_caelum_2: [
      { do: 'art', id: 'rooftop', title: 'Caelum: heart 2' },
      ['caelum', 'Wren. In the Umbra, when her last trial broke you, I couldn\'t help. I could only watch.'],
      ['caelum', 'Five hundred years, and I\'ve never felt so useless. I didn\'t bring you here only because of a war.'],
      ['wren', '...Then why?'],
      ['caelum', 'Ask me again some other night.'],
    ],
    heart_caelum_3: [
      { do: 'art', id: 'rooftop', title: 'Caelum: heart 3' },
      ['narr', 'Caelum takes her hand and falls upward, a streak of light, and before Wren can argue they are over the city, and Starhaven is a sea of small gold lights.'],
      ['caelum', 'You did this. One street, and already my people are painting their doors again.'],
      ['wren', 'Our people.'],
      ['narr', 'Caelum doesn\'t say anything. He doesn\'t have to.'],
    ],
    heart_bram_2: [
      { do: 'art', id: 'fire', title: 'Bram: heart 2' },
      ['bram', 'I don\'t say this often. I don\'t say it at all, actually.'],
      ['bram', 'Welcome to the Five, Wren. Properly.'],
    ],
    heart_iris_2: [
      { do: 'art', id: 'observatory', title: 'Iris: heart 2' },
      ['iris', 'Here. A thread of starlight. Tie it on your wrist.'],
      ['iris', 'If you ever get lost, pull it, and I\'ll find you. I always find my friends.'],
    ],

    // ======================================================== Chapter 3: First Light
    lib_start: [
      { do: 'art', id: 'spark', title: 'The morning after' },
      ['narr', 'That night, for the first time since the Umbra, Wren dreams of fire instead of black glass.'],
      ['narr', 'She wakes with her palm glowing, warm as an ember. It doesn\'t burn her. It feels like it has always been there.'],
      { do: 'art', id: 'library', title: 'The Library of Starhaven' },
      ['thane', 'Sit, sit. Don\'t touch the books with that hand. I\'m Thane. I keep the Library, and I have a theory about you.'],
      { do: 'meet', who: 'thane' },
      ['thane', 'For fifty years the Eclipse swallowed a piece of every House\'s star and hoarded it in the Umbra. Flame, frost, shadow, light, tide, thorn and wind.'],
      ['thane', 'When she fell, all of it broke loose. Most of it went home. Some of it went into the only star that had just been lit.'],
      ['wren', 'Mine.'],
      ['caelum', 'Seven Houses\' light, sleeping in one woman. Every Lord in the sky will want it back. Or want her.'],
      { choose: [
        { text: '"They can try."', bond: { caelum: 5, thane: 5 }, why: 'Neither of them doubted it for a second.', then: [['caelum', 'That\'s my girl. Our girl. Starhaven\'s. I\'ll stop talking.']] },
        { text: '"Can it be taken out of me?"', bond: { thane: 10 }, why: 'The right question. Thane has waited for someone to ask it.', then: [['thane', 'Honestly? I don\'t know. Nobody has ever done this. I\'d rather learn what it does than what it costs to remove.']] },
        { text: '"Does Rowan know?"', bond: { caelum: 10 }, why: 'She thought of the war before she thought of herself.', then: [['caelum', 'If he doesn\'t yet, he will soon. It won\'t make him want you back any less.']] },
      ] },
      ['thane', 'Flame is the one that woke. Let\'s see what it does. There are three braziers in the courtyard. Light them.'],
      { do: 'art', id: null },
      { do: 'flag', name: 'giftgot' },
      { do: 'goal', id: 'flame' },
    ],
    lib_braziers: [
      ['thane', 'All three! Fire answers you. Wonderful. Terrifying, but wonderful.'],
      ['caelum', 'Good, because I need it. Shepherds are dying on the mountain road. Something big has been taking their flocks, then them.'],
      ['caelum', 'And the road is choked with the Eclipse\'s last glass. Steel won\'t cut it. Fire might.'],
      { do: 'flag', name: 'flame' },
      { do: 'goal', id: 'wall' },
      { do: 'winnow', npc: 'caelum', to: 44 },
    ],
    lib_wall: [
      ['wren', 'It\'s melting. Fifty years of her glass, melting.'],
      ['narr', 'The smoke smells like the Umbra. For a moment, Wren can\'t breathe. Then the wind takes it, and the road is open.'],
      { do: 'flag', name: 'wall' },
      { do: 'goal', id: 'hunt' },
    ],
    mtn_road: [
      ['caelum', 'Tracks. Wyrmlings: young mountain wyrms. Their heads are armored like a battering ram.'],
      ['caelum', 'They charge in a straight line and can\'t turn. Don\'t stand in front of one. Let it pass, then hit it from behind while it\'s dazed.'],
      ['wren', 'And the thing killing shepherds?'],
      ['caelum', 'That\'s their mother.'],
      { do: 'winnow', npc: 'caelum', to: 114, y: 14 },
    ],
    mtn_wyrm: [
      { do: 'close', id: 'arenagate' },
      ['narr', 'The hollow is full of bones and old wool. Something the size of a cottage uncoils from the rocks.'],
      { do: 'flag', name: 'bossmet' },
      ['caelum', 'The Old Wyrm. Its head is armored: get it to charge into the cliff and it dazes itself. Watch for falling rocks.'],
      ['caelum', 'When it leaps, jump the shockwave. And when it breathes in... put fire down its throat.'],
      ['wren', 'Stay back. I\'ve got this.'],
      ['caelum', 'I know. That\'s why I\'m staying back.'],
      { do: 'boss' },
    ],
    mtn_peak: [
      { do: 'open', id: 'arenagate' },
      { do: 'art', id: 'peak', title: 'The peak' },
      ['narr', 'The Old Wyrm falls. Below, the mountain road is clear for the first time in years, all the way down to the lights of Starhaven.'],
      ['caelum', 'You hunted it down like you were born for it. You were, I suppose.'],
      ['narr', 'Then the sky turns gold and rose, like morning, though it is past noon, and the snow begins to melt.'],
      ['rowan', 'Wren.'],
      ['wren', 'Rowan.'],
      { if: 'rowanHonest', then: [['rowan', 'You told me the truth the night I came for you. Tell it to me now. Are you his prisoner?'], ['wren', 'No.']] },
      { if: 'rowanKnife', then: [['rowan', 'You reached for a knife the first night. I should have known then that you would not stay where you were put.']] },
      ['rowan', 'I\'ve brought an army to his border because of you. I will burn his city to the river if I have to. Come home, and none of that happens.'],
      { choose: [
        { text: '"I\'m not going back, Rowan."', bond: { caelum: 10 }, why: 'She chose, out loud, in front of both of them.', then: [['rowan', 'You don\'t know what he is. What he wants with you.'], ['wren', 'I know exactly what he is. He let me choose. You never did.']] },
        { text: '"Stop this war. Please."', then: [['rowan', 'He stole you from my bed in the middle of the night. There is no stopping this.'], ['wren', 'He didn\'t steal me. I left.']] },
        { text: 'Show him the fire in your hand', bond: { caelum: 5 }, why: 'She answered Rowan without a word. Caelum saw.', then: [['narr', 'The flame burns bright in Wren\'s palm. Rowan steps back for the first time.'], ['rowan', '...What did they do to you?'], ['wren', 'Nothing. This was always mine.']] },
      ] },
      ['rowan', 'Then I\'ll take you back. One way or another.'],
      ['narr', 'The flowers wither. He is gone.'],
      ['caelum', 'Are you all right?'],
      ['wren', 'No. Take me home.'],
      ['caelum', '...Home. Yes.'],
      { do: 'bond', who: 'caelum', pts: 10, why: 'She called it home.' },
      { do: 'flag', name: 'hunt' },
      { do: 'complete' },
    ],

    // ---------------- Evening 3: Caelum or Thane
    evening3: [
      { do: 'art', id: 'city', title: 'Evening: Starhaven' },
      ['narr', 'The whole city heard about the Old Wyrm by sundown. Wren can\'t walk ten steps without someone thanking her. She needs somewhere quiet.'],
      { do: 'art', id: null },
      { do: 'mode', name: 'city', title: 'THE LAMP SQUARE, EVENING', spots: [{ who: 'caelum', label: 'with Caelum, on the rooftop' }, { who: 'thane', label: 'with Thane, in the Library' }] },
      { choose: [
        { text: 'Caelum, on the rooftop', then: [{ do: 'goto', id: 'ev3_caelum' }] },
        { text: 'Thane, in the Library', then: [{ do: 'goto', id: 'ev3_thane' }] },
      ] },
    ],
    ev3_caelum: [
      { do: 'art', id: 'rooftop', title: 'Evening with Caelum' },
      ['caelum', 'You called it home. On the mountain. I\'ve been thinking about it all day.'],
      ['wren', 'It slipped out.'],
      ['caelum', 'Did it?'],
      { choose: [
        { text: '"No. I meant it."', bond: { caelum: 15 }, why: 'She called Starhaven home, and meant it.', then: [['narr', 'Caelum is quiet for a long moment. When he finally smiles, it\'s the first time Wren has seen him look young.']] },
        { text: 'Light a small flame between your hands', liked: 'caelum', bond: { caelum: 15 }, then: [['caelum', 'Show-off.'], ['narr', 'He holds his hands around hers, and the little flame burns gold and violet together.']] },
        { text: '"Ask me again some other night."', bond: { caelum: 10 }, why: 'His own words, handed back to him. He laughed.', then: [['caelum', 'Using my own lines against me. That\'s cruel, Wren. I respect it.']] },
      ] },
      { do: 'bond', who: 'caelum', pts: 20, why: 'An evening together.' },
      ['narr', 'They stay until the lamps below go out one street at a time, and the stars come down to meet them.'],
    ],
    ev3_thane: [
      { do: 'art', id: 'library', title: 'Evening with Thane' },
      ['thane', 'Oh, good. I have forty-one questions about your hand. Sit down. Tea?'],
      { if: 'page', then: [['wren', 'First: this is yours. It was frozen to the mountain.'], ['thane', '...Wyrms sleep facing the wind. I wrote that at nineteen, and lost it the same afternoon. Forty years.'], { do: 'bond', who: 'thane', pts: 10, liked: true, why: 'You carried a scrap of paper down a mountain for him.' }] },
      { choose: [
        { text: 'Bring him a rare book from the Night Market', liked: 'thane', bond: { thane: 15 }, then: [['thane', 'Is this... a first copy of the Tide House star charts? Where did you... no, don\'t tell me. I\'ll cry on it.']] },
        { text: '"Ask your forty-one questions."', bond: { thane: 10 }, why: 'Nobody has ever let him get to forty-one.', then: [['narr', 'He asks all forty-one. Then he asks nine more. By the end, you both understand the fire a little better.']] },
        { text: 'Ask about the other six powers', bond: { thane: 5 }, why: 'Curiosity is the way to Thane\'s heart.', then: [['thane', 'Frost, shadow, light, tide, thorn and wind. Asleep, for now. Something will wake each of them. I\'d very much like to be there when it does.']] },
      ] },
      { do: 'bond', who: 'thane', pts: 20, why: 'An evening together.' },
      ['thane', 'You know, Caelum hasn\'t smiled like he does now in a long time. Whatever you\'re doing to him, keep doing it.'],
    ],
    heart_thane_2: [
      { do: 'art', id: 'library', title: 'Thane: heart 2' },
      ['thane', 'I\'m giving you a key to the Library. The real Library, the rooms under this one. Very few people have it.'],
      ['thane', 'Don\'t read anything that whispers back.'],
    ],

    // ---------------- The end of the concept: a look at Chapter 4
    // ======================================================== Chapter 4: The Spy in the Library
    lib4_start: [
      { do: 'art', id: 'library', title: 'The Library, before dawn' },
      ['narr', 'Three nights after the Old Wyrm, something with wings landed on the Library roof. By morning, pages were missing from books nobody had opened in a hundred years.'],
      ['thane', 'Not torn. Cut. Clean, along the binding. Whoever did this knew exactly which pages they wanted.'],
      ['caelum', 'Which pages?'],
      ['thane', 'Every map of Starhaven we own. And the Library\'s own floor plans.'],
      ['wren', 'Then they\'ll be back for the rest.'],
      { do: 'art', id: null },
      ['thane', 'Which is why I have this. Bram strung it last night, and then pretended he hadn\'t.'],
      ['narr', 'A bow of dark ash, light as a held breath. The string hums when Wren touches it: a note she feels in her teeth.'],
      ['wren', 'A starbow.'],
      ['thane', 'It shoots where you mean, not where you point. Mostly. I have a theory about the "mostly".'],
      { if: 'rings', then: [['thane', 'Bram says you cut all three of his rings. He said, and I quote, "Give her the good one."']] },
      { do: 'flag', name: 'bow4' },
      ['caelum', 'Wren. The roof.'],
      ['narr', 'Two shapes unfold from the Library\'s eaves: grey wings, iron masks, eyes like coals. They drop into the courtyard air and hang there, out of reach of any knife.'],
      ['thane', 'The Iron King\'s spies. They fly where daggers can\'t follow. That is rather the point of the bow.'],
      { do: 'explain', key: 'bow' },
      { do: 'goal', id: 'sky' },
    ],
    lib4_sky_done: [
      { do: 'flag', name: 'sky' },
      ['thane', 'Two down! Oh, well shot. Well shot. I take back the "mostly".'],
      ['caelum', 'Those were the lookouts. The thieves are already inside.'],
      ['narr', 'From inside the Library comes the sound every librarian dreads: a book falling open, and a page tearing.'],
      ['thane', 'The stacks! The oldest books in the city lie open on three lecterns up there. If they take those pages, they are gone for good.'],
      { do: 'open', id: 'libdoor' },
      { do: 'flag', name: 'stacks4' },
      { do: 'bond', who: 'thane', pts: 10, why: 'She saved his courtyard, and then she let him have his moment.' },
      { do: 'goal', id: 'stacks_done' },
    ],
    lib4_stacks_done: [
      { do: 'flag', name: 'stacks_done' },
      { if: 'pagesKeptAll', then: [
        ['thane', 'Every page. Every single page. Wren, some of those books are older than Caelum.'],
        ['caelum', 'Most things are.'],
        { do: 'remember', key: 'pagesSaved', text: 'Kept every page in the Library from the Iron King\'s spies.', good: true },
        { do: 'bond', who: 'thane', pts: 15, liked: true, why: 'Every page, kept. He will not forget it.' },
      ], else: [
        ['thane', 'They got some. A map of the river gates, I think, and the pages on the old wards.'],
        ['wren', 'I\'m sorry.'],
        ['thane', 'Don\'t be. They came for all of it and left with very little. I will copy what I remember. I remember a great deal.'],
        { do: 'remember', key: 'pagesLost', text: 'Lost some of the Library\'s pages to the spies.', good: false },
        { do: 'bond', who: 'thane', pts: 5, why: 'He forgave her before she had finished apologizing.' },
      ] },
      ['caelum', 'The reading hall. Something bigger went that way, and it hasn\'t come out.'],
      { do: 'open', id: 'stackgate' },
      { do: 'goal', id: 'shadow' },
    ],
    lib4_shadow: [
      { do: 'flag', name: 'shadowmet' },
      ['narr', 'The reading hall is a dome of glass and stars. Something hangs from the highest gallery like a folded coat. Then it opens.'],
      ['caelum', 'That isn\'t a creature. It\'s a spymaster\'s shadow, cut loose and sent. The Iron King has always liked to work from far away.'],
      ['wren', 'Can it be killed?'],
      ['caelum', 'Shoot it until its wings give out. Then make sure it doesn\'t get up.'],
      { do: 'close', id: 'stackgate' },
      { do: 'boss' },
    ],
    lib4_lamps: [
      ['narr', 'The fourth reading lamp catches, and the stacks are gold from the floor to the dome.'],
      ['thane', 'Nobody has read in here at night since the war. I had forgotten what it looks like with the lamps lit. Thank you.'],
      { do: 'remember', key: 'readlamps', text: 'Relit the reading lamps in the Library stacks.', good: true },
      { do: 'bond', who: 'thane', pts: 10, liked: true, why: 'She gave him his Library back, one lamp at a time.' },
    ],
    lib4_end: [
      { do: 'flag', name: 'shadow' },
      { do: 'art', id: 'library', title: 'The reading hall' },
      ['narr', 'The Shadow comes apart like smoke in a draft. Where it fell lies a folded letter, and a seal pressed in gold wax: a sunburst.'],
      ['wren', 'That is the Dawn House\'s seal.'],
      ['thane', '"She will be at the Library at first light. Take the maps. Leave her to me." No name. There doesn\'t need to be one.'],
      ['caelum', 'Rowan is writing to the Iron King.'],
      { choose: [
        { text: '"He wouldn\'t. Not Rowan."', bond: { caelum: 5 }, why: 'He hopes she is right. He does not think she is.', remember: ['rowanDoubt', 'Would not believe Rowan was writing to the Iron King.', null], then: [
          ['caelum', 'I hope you are right. I have never once seen him afraid, until this year. Afraid men write letters.'],
        ] },
        { text: '"Then he has made his choice."', bond: { caelum: 10 }, why: 'She said it, so he did not have to.', remember: ['rowanChoice', 'Decided that Rowan has chosen the Iron King.', false], then: [
          ['caelum', 'He made it a long time ago, I think. He has only now signed it.'],
        ] },
        { text: '"He wants me back badly enough to do anything."', bond: { thane: 5, caelum: 5 }, why: 'The truest thing anyone said all day.', remember: ['rowanFear', 'Understood that Rowan would do anything to have her back.', null], then: [
          ['thane', 'That is the most frightening sentence I have heard this year, and I keep the Library\'s nightmares.'],
        ] },
      ] },
      ['thane', 'There is something else. In the margin, in another hand, in iron-grey ink. One word: Cartographer.'],
      ['caelum', '...Then we are going to need Iris.'],
      { do: 'complete' },
    ],
    evening4: [
      { do: 'art', id: 'city', title: 'Evening: Starhaven' },
      ['narr', 'The Library\'s lamps burn all night. Half the city comes to look at the hole in the dome, and the other half comes to look at Wren.'],
      { do: 'art', id: null },
      { do: 'mode', name: 'city', title: 'THE LAMP SQUARE, EVENING', spots: [{ who: 'caelum', label: 'with Caelum, on the rooftop' }, { who: 'thane', label: 'with Thane, in the Library' }, { who: 'iris', label: 'with Iris, in her tower' }] },
      { choose: [
        { text: 'Caelum, on the rooftop', then: [{ do: 'goto', id: 'ev4_caelum' }] },
        { text: 'Thane, in the Library', then: [{ do: 'goto', id: 'ev4_thane' }] },
        { text: 'Iris, in her tower', then: [{ do: 'goto', id: 'ev4_iris' }] },
      ] },
    ],
    ev4_caelum: [
      { do: 'art', id: 'rooftop', title: 'Evening with Caelum' },
      ['caelum', 'You shot a shadow out of my sky. I have wanted someone to do that for a very long time.'],
      { if: 'rowanDoubt', then: [
        ['wren', 'I keep reading that letter, hoping the seal will change.'],
        ['caelum', 'So do I. It won\'t. But if he wrote it, he wrote it because of himself, not because of you. Don\'t carry that one, Wren.'],
      ], else: [
        ['wren', 'Rowan wrote to the Iron King because of me.'],
        ['caelum', 'Rowan wrote to the Iron King because of Rowan. Don\'t carry that one, Wren. It isn\'t yours.'],
      ] },
      { choose: [
        { text: '"Teach me to fall, the way you do."', bond: { caelum: 10 }, why: 'She wants to be able to leave. He wants that for her too.', then: [
          ['caelum', 'When you can feel all of the Tether, and not only the pull. Soon, I think.'],
        ] },
        { text: '"Tell me about him. Before."', bond: { caelum: 10 }, why: 'She asked about his old friend, not his enemy.', then: [
          ['caelum', 'He was the first Lord of the sky who ever called me a friend and meant it. That is why this is going to hurt.'],
        ] },
      ] },
      { do: 'bond', who: 'caelum', pts: 20, why: 'An evening together.' },
      ['narr', 'The Tether hums, low and steady, all the way home. For once she does not mind it.'],
    ],
    ev4_thane: [
      { do: 'art', id: 'library', title: 'Evening with Thane' },
      ['thane', 'I am putting the dome back together. Metaphorically. Also literally: hand me that.'],
      { if: 'pagesKeptAll', then: [['thane', 'You kept every page. I have walked past the lecterns all evening just to look at them.']],
        else: [['thane', 'I have rewritten two of the stolen pages from memory. The third I only remember the margins of. The margins were better anyway.']] },
      { choose: [
        { text: '"What is the Cartographer?"', bond: { thane: 10 }, why: 'She asked the question he has been dying to answer.', then: [
          ['thane', 'Something older than the Houses, in a house nobody finds twice. She draws the sky. Whatever she erases from her chart stops being there.'],
        ] },
        { text: 'Help him with the dome', bond: { thane: 10 }, why: 'She stayed and did the dull part with him.', then: [
          ['narr', 'They work until the lamps gutter. He tells her the name of every book they pass. She remembers four of them.'],
        ] },
      ] },
      { do: 'bond', who: 'thane', pts: 20, why: 'An evening together.' },
      ['narr', 'When she leaves, the hole in the dome is a little smaller, and so is the weight on his shoulders.'],
    ],
    ev4_iris: [
      { do: 'art', id: 'observatory', title: 'Evening with Iris' },
      ['iris', 'I saw the Shadow come. I did not see you stop it. That has never happened to me before. You are becoming very hard to see, Wren.'],
      ['wren', 'Is that good?'],
      ['iris', 'It is good for you. It is terrible for me. I like knowing things.'],
      { choose: [
        { text: '"What do you see about the Cartographer?"', bond: { iris: 10 }, why: 'She trusted the seer with the hard question.', then: [
          ['iris', 'A chart, and two threads I recognize on it. Your sisters, Wren. She has drawn their names.'],
        ] },
        { text: '"Do you ever get to stop seeing?"', bond: { iris: 10 }, why: 'Nobody asks the seer how she is.', then: [
          ['iris', 'When I sleep. So I sleep a great deal, and I am very cheerful about it.'],
        ] },
      ] },
      { do: 'bond', who: 'iris', pts: 20, why: 'An evening together.' },
      ['narr', 'The tower lamp burns late. Below, Starhaven goes to sleep under a sky that has been read and found kind.'],
    ],
    finale: [
      { do: 'art', id: 'city', title: 'Next: Chapter 5, The Cartographer\'s House' },
      ['narr', 'A week later, Starhaven sleeps under a sky full of stars.'],
      { if: 'sketchbook', then: [['narr', 'On the sill of the Rooftop House a sketchbook lies open. The newest page is not the Umbra. It is the Library, with every lamp lit.']] },
      { if: 'cat', then: [['narr', 'On Mirelle\'s step, a black cat watches the sky over the Library, and does not blink.']] },
      ['narr', 'In the Library, Thane has pinned the letter to the wall and drawn a circle around one word: Cartographer.'],
      ['narr', 'Across the sea, in a house nobody finds twice, a pen stops. Something has noticed a star it did not draw.'],
      { do: 'end' },
    ],
  };

  // The journal's "People" page. Unlocked as Wren meets or hears of them.
  S.PEOPLE = [
    { id: 'wren', name: 'Wren', text: 'You. A mortal huntress who died in the Umbra and woke up Lit, with half of Caelum\'s star in her and freckles that glow. Fights with daggers. Used to paint.' },
    { id: 'sisters', name: 'Nessa and Lissa', text: 'Wren\'s sisters, still mortal, Below. Nessa is sharp-tongued and protective. Lissa is gentle and loves her garden.' },
    { id: 'rowan', name: 'Lord Rowan', text: 'Lord of the Dawn House. He took Wren up the Stair for putting out his House\'s heir-star, and she saved him in the Umbra. Kind in his careful way, terrified of losing her, and now at war with the Dusk House.' },
    { id: 'queen', name: 'Vael, the Eclipse', text: 'The tyrant who swallowed the Houses\' light and held their Lords in the Umbra. Gone now, but her black glass is everywhere, and so is she, in Wren\'s dreams.' },
    { id: 'caelum', name: 'Lord Caelum', text: 'Lord of the Dusk House and ruler of Starhaven. Charming in public, burdened in private. He gave Wren half of his own star when she died, and tethered her to him without asking. He is dimmer for it.' },
    { id: 'ironking', name: 'The Iron King', text: 'A king Below, across the sea, who mines fallen stars for his furnaces. He has learned to wake the Eclipse\'s glass, and he knows Wren\'s name.' },
    { id: 'bram', name: 'Bram', text: 'One of the Five. A general and brawler who runs the Training Ring. The big brother of the group.' },
    { id: 'iris', name: 'Iris', text: 'One of the Five. She reads the stars: every life is a thread of light to her. Oddly cheerful about it.' },
    { id: 'thane', name: 'Thane', text: 'One of the Five. Keeper of the Library and its star charts. Has a theory about everything, including Wren\'s fire.' },
  ];
  // Who you know about at the start of each chapter (the intro covers the first five).
  S.KNOWN_FROM = { woods: ['wren', 'sisters'], prologue: ['rowan', 'queen', 'caelum'], ch1: ['ironking'], ch2: ['bram'], ch3: ['thane'], ch4: ['iris'] };

  S.END = {
    title: 'End of the concept',
    text: 'That was the Prologue through Chapter 4. Next: Chapter 5, The Cartographer\'s House, where getting seen means running.',
  };
})(window.SH = window.SH || {});
