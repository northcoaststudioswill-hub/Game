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
    queen: { name: 'The Thorn Queen', color: '#ff7a8a' },
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
    moves: { icon: '\u2694', title: 'Wren\'s blades', text: 'Strike three times for a combo. Up and strike is a rising strike (and cuts straight up in the air). Strike during a dash is a lunge, her hardest hit. Down and strike in the air bounces her off what is below. Hold down on the ground to guard: blows from the front stop, and a guard raised at the last moment is a parry that leaves the enemy open. She cannot guard a fall or what is behind her.' },
    remember: { icon: '\u2726', title: 'This will be remembered', text: 'Some decisions change scenes later in the story. Green: someone is better for it. Red: it will cost her. Gold: it could go either way. They are listed in Wren\'s journal, under What Wren has done.' },
    bondbar: { icon: '\u263E', title: 'The bond bar and Bond Arts', text: 'The bar under your hearts fills as your hits land, faster for long unbroken strings. When it is full, a BOND ART button appears: a huge attack, with a memory. Nothing can hurt Wren while it plays.' },
    moons: { icon: '\u25CF', title: 'Moons and the Flame', text: 'Each Flame costs one moon. Hold the button and let go for a flame wave that costs two. Moons refill slowly by themselves, and quickly when your daggers land.' },
    xp: { icon: '\u2191', title: 'Levels', text: 'Wren earns experience by fighting, hunting, gathering Starlight, helping people and finishing chapters. Each level gives a perk for good; the bar under the Starlight count shows how close the next one is. Levels are earned, the Constellation is where you choose.' },
    opening: { icon: '\u2727', title: 'Perfect dodge', text: 'Dash through an attack at the last moment and time slows: an opening. For a moment every cut does more and gets past armor.' },
  };

  // Whispers down the mate bond: short lines that slide in during play and never stop it.
  // Each is said once per save, in order (the boss lines repeat). [who, text]
  S.WHISPERS = {
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
  S.RECAP = 'Wren was a mortal huntress feeding her two sisters through a starving winter. She killed a white stag sacred to the fae, and Lord Rowan of the Spring Court took her across the Wall as payment. When the Thorn Queen seized the courts, Wren went Under the Mountain after him, made a bargain with Lord Caelum of the Court of Dusk, and won the queen\'s three trials. The queen killed her anyway. Caelum brought her back with his blood, and as a fae she can finally feel what he always felt: they are mates.';

  S.CHAPTERS = [
    {
      id: 'woods', label: 'Prologue, part 1', name: 'The Winter Woods', room: 'woods', mortal: true,
      abilities: { double: false, dash: false, daggers: false, bow: true },
      card: 'Before the Deep, before the fae. Wren is nineteen, mortal, and the only hunter in a family that is slowly starving.',
      goals: [
        { id: 'hunt', text: 'Check your three snares', count: 3, counter: 'snares' },
        { id: 'stag', text: 'Shoot the white stag in the clearing' },
      ],
      summary: 'Wren killed a white stag sacred to the Spring Court. That night Lord Rowan came for her and took her across the Wall: a life for a life.',
      done: 'A life for a life. Wren crosses the Wall into the fae lands, and doesn\'t look back, because if she does she won\'t go.',
      after: 'beyond_wall',
    },
    {
      id: 'prologue', label: 'Prologue, part 2', name: 'Under the Mountain', room: 'deep', mortal: true,
      card: 'The Thorn Queen\'s three trials: a riddle, a maze, and a beast. Win them all and Rowan goes free. Lose one, and Wren stays in the Deep forever. The stars of Caelum\'s bargain glow on her wrist.',
      goals: [
        { id: 'riddle', text: 'Trial 1: stand before the altar that answers her riddle' },
        { id: 'maze', text: 'Trial 2: get through the maze (keep going right)' },
        { id: 'beast', text: 'Trial 3: outrun the Wyrm to the light' },
      ],
      summary: 'Wren won the Thorn Queen\'s three trials and freed Rowan. The queen killed her anyway. Caelum brought her back with his blood, and she woke up fae, feeling a bond to him she had never felt before.',
      done: 'Wren is fae now. Rowan carries her home to Spring. But a thread of light in her chest pulls the other way, toward the Court of Dusk.',
    },
    {
      id: 'ch1', label: 'Chapter 1', name: 'Ashes', room: 'ashes',
      card: 'Three months later. Rowan has locked the windows of the Spring Court and doubled the guards, terrified of losing Wren again. Every night, the thread in her chest pulls toward the Court of Dusk.',
      goals: [
        { id: 'arrive', text: 'Walk with Caelum to Starhaven' },
        { id: 'mural', text: 'Paint the first mural on the dark street' },
        { id: 'rooftop', text: 'Meet Caelum on his rooftop, at the end of the street' },
      ],
      summary: 'Caelum stole Wren out of the Spring Court and brought her to Starhaven. Her first mural woke up a street. On his rooftop he told her the truth: they are mates. Rowan called it theft and declared war.',
      done: 'In the Spring Court, Rowan finds an empty bed and calls it theft. By morning, the armies of Spring are marching on the Court of Dusk.',
      after: 'evening1',
    },
    {
      id: 'ch2', label: 'Chapter 2', name: 'The Five', room: 'ring',
      card: 'Spring\'s army gathers on Dusk\'s southern border, and the Iron King\'s creatures are testing the north. Caelum\'s inner circle, the Five, want to see what the reborn huntress can do.',
      goals: [
        { id: 'combo', text: 'Three cuts in a row on the training dummy' },
        { id: 'rise', text: 'Land a rising strike on the dummy' },
        { id: 'lunge', text: 'Land a dash strike on the dummy' },
        { id: 'guard', text: 'Stand by the dummy and guard its swing' },
        { id: 'pit', text: 'Cross Bram\'s thorn pit by bouncing on the buds' },
        { id: 'sprites', text: 'Clear the thorn sprites past the north gate', count: 3 },
        { id: 'report', text: 'Talk to Caelum when you are ready to leave' },
      ],
      summary: 'Wren trained with Bram and cleared the Iron King\'s thorn sprites. Iris saw a vision: the Iron King knows Wren\'s name, and his iron is reaching for her sisters.',
      done: 'The Iron King knows Wren\'s name. Across the water, Nessa and Lissa don\'t know they\'re in danger.',
      after: 'evening2',
    },
    {
      id: 'ch3', label: 'Chapter 3', name: 'First Light', room: 'mountain',
      abilities: { flame: true },
      card: 'Wren wakes with fire in her hand. Starhaven\'s scholar, Thane, thinks he knows why. And in the mountains above the city, something big is killing shepherds.',
      goals: [
        { id: 'flame', text: 'Light the three braziers with Flame' },
        { id: 'wall', text: 'Burn the thorns off the mountain road' },
        { id: 'hunt', text: 'Hunt the beast killing shepherds' },
      ],
      summary: 'Wren learned she carries the stolen powers the Thorn Queen hoarded, and Flame woke first. She burned the queen\'s last thorns off the mountain road and killed the Old Wyrm. On the peak, Rowan came for her, and she told him no.',
      done: 'Wren has her first court gift, and Rowan has his answer. Spring will not stop now. Neither will she.',
      after: 'evening3',
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
      ['nessa', 'Be back before dark. People have seen lights near the Wall again.'],
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
      ['narr', 'Wren lowers the bow. The wolf watches her a moment longer, then slinks away east, toward the Wall.'],
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
      ['wren', 'Tracks. Huge ones. Something this size would feed us for a month.'],
      ['wren', '...They glitter. Tracks don\'t glitter.'],
      { if: 'steady', then: [['wren', 'My hands are steady. Father\'s targets saw to that.']] },
    ],
    woods_stag: [
      { do: 'flag', name: 'stagseen' },
      ['narr', 'In the clearing stands a white stag, taller than any deer Wren has ever seen, with antlers like silver branches.'],
      ['wren', 'The old stories say white stags belong to the fae.'],
      ['wren', 'The old stories don\'t feed anyone.'],
      { do: 'goal', id: 'stag' },
    ],
    woods_kill: [
      { do: 'flag', name: 'hunt' },
      { do: 'art', id: 'hunt', title: 'The White Stag' },
      { do: 'cue', name: 'shoot' },
      ['narr', 'The arrow flies true.'],
      ['narr', 'As the stag falls, light pours out of it, gold and warm, like a door opening onto summer.'],
      ['wren', '...What did I just do?'],
      { do: 'art', id: 'cottage', title: 'That night' },
      ['narr', 'That night there is meat in the pot for the first time in weeks. Lissa laughs. Even Nessa smiles.'],
      { if: 'green', then: [['lissa', 'You found green! In this! Wren, it\'s alive. I\'m putting it in the window.'], { do: 'bond', who: 'lissa', pts: 10, why: 'Her seeds have company now.' }] },
      { if: 'wood', then: [['narr', 'The fire is high, and nobody has to look at the chairs.']] },
      { if: 'wolfKilled', then: [['nessa', 'A wolf pelt. That\'s a winter coat for Lissa. Good.'], ['narr', 'Lissa does not look at it.']] },
      { if: 'rabbitAte', then: [['nessa', 'There\'s fur on your sleeve. I\'m glad one of us ate today.'], { do: 'bond', who: 'nessa', pts: -5, why: 'She said she was glad. She wasn\'t only glad.' }] },
      { do: 'cue', name: 'door' },
      ['narr', 'Then the door bursts open, and winter comes in with him.'],
      ['rowan', 'Who killed the white stag?'],
      ['narr', 'He is tall and golden, with antlers rising from a crown of leaves, and eyes like a summer field on fire.'],
      { choose: [
        { text: 'Step forward: "I did."', remember: ['rowanHonest', 'Told Lord Rowan the truth at the door.', true], then: [['rowan', 'Honest, at least. That will make this easier.']] },
        { text: '"It was a deer. We were starving."', then: [['rowan', 'It was the sacred stag of the Spring Court, and its blood is on your hands.']] },
        { text: 'Reach for your knife', remember: ['rowanKnife', 'Reached for a knife against a High Lord.', null], then: [['rowan', 'Put it down, huntress. Mortal steel won\'t touch me, and I didn\'t come here to hurt your family.']] },
      ] },
      ['rowan', 'The Treaty between our peoples is old and simple. A fae life taken by a mortal is paid for with a mortal life.'],
      ['nessa', 'Then take me instead.'],
      { if: 'nessaHard', then: [['narr', 'An hour ago Wren told her she couldn\'t be carried forever. This is Nessa\'s answer.']] },
      ['wren', 'No. Nessa, no.'],
      ['rowan', 'There is another way. Come with me across the Wall and live the rest of your days in the Spring Court. Your sisters keep their lives, and you keep yours.'],
      ['lissa', 'Wren...'],
      ['wren', 'Look after each other. Lissa, plant your seeds. Nessa... eat something.'],
      ['nessa', 'Come back.'],
      ['wren', 'I will.'],
      ['narr', 'He lifts her onto a white mare that was not there a moment ago. They ride east, into the oldest part of the wood.'],
      { do: 'art', id: null },
      { do: 'mode', name: 'flight', variant: 'wall' },
      { do: 'art', id: 'wall', title: 'The Wall' },
      ['narr', 'The night itself shimmers like a curtain: the Wall, the old line between the mortal lands and the fae. The mare does not slow.'],
      ['rowan', 'Nobody will hurt you on the other side. You have my word.'],
      ['wren', 'You just took me from my home.'],
      ['rowan', '...Yes. I did.'],
      ['narr', 'On the other side of the Wall, it is spring.'],
      { do: 'flag', name: 'stag' },
      { do: 'complete' },
    ],

    // ---------------- Beyond the Wall: the Spring Court, the Thorn Queen, the bargain, the trials, the sparks
    beyond_wall: [
      { do: 'art', id: 'garden', title: 'The Spring Court' },
      ['narr', 'The Spring Court is beautiful: flowers that never die, music that never stops, and a lord who is kind, in his careful way.'],
      ['rowan', 'I had paints brought from three courts. You said once that you used to paint.'],
      ['wren', 'I said that one time. At dinner. You remembered?'],
      ['rowan', 'I remember everything you say. You say so little.'],
      { choose: [
        { text: '"Thank you, Rowan."', then: [['narr', 'Rowan smiles like the sun came out. For a while, Wren lets herself be happy here.']] },
        { text: '"Paint won\'t make me forget my sisters."', then: [['rowan', 'I don\'t want you to forget them. I only want you to stay.']] },
      ] },
      ['narr', 'She paints for the first time in years. She is never allowed past the garden walls.'],
      { do: 'art', id: 'thorns', title: 'The Blight' },
      ['narr', 'Then the blight came. Thorns crept through the fae courts, and the flowers of Spring began to die.'],
      ['queen', 'Every court will kneel to me. Every High Lord will bring me his crown. Starting with Spring.'],
      ['narr', 'The Thorn Queen dragged the High Lords Under the Mountain, into her prison, the Deep. When her thorns took Rowan, Wren went after him.'],
      ['wren', 'He took me from my home. But he never hurt me, and nobody else was going to save him.'],
      { do: 'art', id: 'cell', title: 'Under the Mountain' },
      ['narr', 'The Deep. A cell, a fever, and a wound from the queen\'s thorns that would not close.'],
      { do: 'cue', name: 'caelum' },
      ['caelum', 'So you\'re the mortal who walked in here on purpose. That was either very brave or very stupid.'],
      ['wren', 'Who... are you?'],
      ['caelum', 'Caelum. High Lord of the Court of Dusk, and the queen\'s favorite prisoner. I can close that wound, if you let me.'],
      ['caelum', 'But nothing is free Under the Mountain. One week of every month, for the rest of your life, at my home. Say yes, huntress.'],
      { choose: [
        { text: '"Why would you help me?"', bond: { caelum: 5 }, then: [['caelum', 'Because you\'re the first person in fifty years to make the queen nervous. I\'d like you alive.']] },
        { text: '"What do you really want?"', bond: { caelum: 10 }, then: [['caelum', 'Someone on my side when this is over. Someone who doesn\'t kneel.']] },
        { text: '"I don\'t make deals with fae."', bond: { caelum: 5 }, then: [['caelum', 'Then you\'ll die of a fever before the first trial. Your choice.']] },
      ] },
      ['wren', '...Yes.'],
      { do: 'meet', who: 'caelum' },
      ['narr', 'A ring of tiny stars curls around Wren\'s wrist, glowing faintly. The bargain is struck.'],
      { do: 'art', id: 'thorns', title: 'The Thorn Queen' },
      ['queen', 'Three trials, little huntress. A riddle, a maze, and a beast. Win them all, and I free your Spring lord.'],
      ['queen', 'Lose one, and you both stay in my Deep forever.'],
    ],

    // ======================================================== Prologue part 2: Under the Mountain, the three trials
    deep_start: [
      ['queen', 'The first trial, little huntress. Three altars. Three answers. Only one of them is true.'],
      ['queen', 'What is buried in the dark, and grows anyway?'],
      { do: 'flag', name: 'asked' },
      ['narr', 'Something wakes above each altar: a locked box, a green shoot, a single tear.'],
      ['wren', 'Buried in the dark, and grows anyway...'],
      { do: 'goal', id: 'riddle' },
    ],
    deep_altar_secret: [
      ['queen', 'A secret? Wrong. Secrets rot in the dark. They do not grow.'],
      ['narr', 'Thorns burst through the altar and it cracks in two. The Queen is enjoying this.'],
    ],
    deep_altar_grief: [
      ['queen', 'Grief? Wrong. Grief does not grow. It only gets heavier.'],
      ['narr', 'Thorns burst through the altar and it cracks in two.'],
      ['wren', 'She would know.'],
    ],
    deep_altar_seed: [
      ['wren', '...A seed. Lissa\'s seeds, in Mother\'s trunk, waiting for spring. The answer is a seed.'],
      ['queen', 'Correct. How very dull. Go on, then. My maze is waiting.'],
      { do: 'flag', name: 'riddle' },
      { do: 'open', id: 'riddlegate' },
      { if: 'green', then: [['narr', 'In the window of a cottage far away, a sprig of wintergreen is still alive.']] },
      ['caelum', 'Well done, huntress. Can you hear me? The bargain lets me speak to you. And lend you a little of what I have.'],
      ['narr', 'The stars on Wren\'s wrist burn bright. Her legs feel lighter than they have ever felt.'],
      { do: 'goal', id: 'maze' },
    ],
    deep_wall: [
      ['queen', 'A wall you can\'t climb. Mortals always hit a wall.'],
      ['caelum', 'Jump, then jump again, off nothing at all. I\'ve got you.'],
    ],
    deep_dash: [
      ['wren', 'Too far to jump.'],
      ['caelum', 'Then don\'t jump. Move like a shadow does. Fast, and all at once.'],
    ],
    deep_thorns: [
      ['queen', 'My thorns remember mortals. They remember how you bleed. And my gardeners are hungry.'],
      ['caelum', 'They are only sprites. You have a knife and you have skinned worse. Cut them.'],
    ],
    deep_under: [
      ['queen', 'You fell. Of course you fell. Look around, little huntress. This is where I keep the ones who lost.'],
      ['caelum', 'There is a way back up at the far end, past the cells. And Wren: look at them. Somebody should.'],
    ],
    deep_tally: [
      ['narr', 'Scratches in the stone, in bundles of five. Wren stops counting at four hundred.'],
      ['narr', 'Under them, in a different hand, cut deep: SHE KEEPS HER WORD. THAT IS THE TRAP.'],
      ['wren', '...Noted.'],
    ],
    deep_pack: [
      ['narr', 'A hunter\'s pack, the leather gone soft as cloth. Mortal-made. A bone-handled knife, and a ribbon a child might have tied on.'],
      ['wren', 'Somebody else crossed the Wall. A long time ago. Nobody ever told a story about her.'],
      ['narr', 'Wren takes the ribbon. It seems wrong to leave all of her down here.'],
    ],
    deep_caelum: [
      { do: 'flag', name: 'd_caelum' },
      ['caelum', 'Don\'t look straight at me. She watches who I look at.'],
      ['wren', 'You wear her colours. You stand at her shoulder.'],
      ['caelum', 'I am her favourite. It is the worst thing I have ever been, and the most useful.'],
      { choose: [
        { text: '"Then why help me?"', bond: { caelum: 10 }, why: 'Nobody has asked him why in fifty years.', then: [
          ['caelum', 'Because you walked in here on purpose. For someone else. I had forgotten people could do that.'],
        ] },
        { text: '"I don\'t trust you."', bond: { caelum: 5 }, why: 'He would have thought less of her if she did.', then: [
          ['caelum', 'Good. Don\'t. Trust the bargain on your wrist: it cannot lie, even when I do.'],
        ] },
      ] },
      ['caelum', 'Fifty years she has held seven courts in this hole. Every High Lord. She makes us watch each other kneel.'],
      ['caelum', 'She keeps the letter of her word, Wren, and nothing else. Remember that when she smiles. Now go. The wall ahead is taller than it looks.'],
    ],
    deep_rowan: [
      { do: 'flag', name: 'd_rowan' },
      ['rowan', 'Wren. No. You were supposed to stay behind my walls. I gave orders.'],
      ['wren', 'You gave a great many orders. I climbed the wall.'],
      ['narr', 'The cage is woven thorn. Where his hands have gripped it, they are bleeding.'],
      { choose: [
        { text: '"I came to get you out."', remember: ['rowanCame', 'Told Rowan, through the bars, that she came for him.', true], then: [
          ['rowan', 'Nobody comes for a High Lord. We are the ones who come.'],
          ['wren', 'Then it was past time somebody did.'],
        ] },
        { text: '"A life for a life. That\'s your law. I\'m paying it."', remember: ['rowanDebt', 'Told Rowan she came to pay a debt, nothing more.', null], then: [
          ['rowan', 'You owe me nothing. You never did. I only did not know how else to keep you.'],
        ] },
      ] },
      ['rowan', 'Whatever she offers you at the end, do not take it. Run. Leave me.'],
      ['wren', 'I am very bad at being told what to do. Ask my sisters.'],
    ],
    deep_chase: [
      { do: 'flag', name: 'maze' },
      ['queen', 'You got through my maze. Then the last trial is the beast. Wake up, my Wyrm. She\'s yours.'],
      ['caelum', 'Wren. Run. Don\'t look back. Run for the light.'],
      { do: 'goal', id: 'beast' },
      { do: 'wyrm' },
    ],
    deep_end: [
      { do: 'flag', name: 'beast' },
      { do: 'art', id: 'trials', title: 'The Queen\'s Throne' },
      { do: 'cue', name: 'end' },
      ['queen', 'Three trials. A mortal won all three. That has never happened.'],
      ['queen', 'I keep my promises. Your Spring lord is free. All the High Lords are free.'],
      ['narr', 'Then, smiling, the Thorn Queen drove her last thorn into Wren\'s heart.'],
      ['wren', 'Tell my sisters...'],
      { do: 'art', id: 'rebirth', title: 'Caelum\'s Blood' },
      ['narr', 'Her heart stopped. The queen fell. And Caelum, free at last, was already kneeling beside her.'],
      ['caelum', 'No. Not like this. Not you.'],
      ['narr', 'He cut his palm and let his blood fall onto her lips: the old magic of a High Lord, starlight and shadow.'],
      { do: 'cue', name: 'rise' },
      ['narr', 'It burned through her like a comet. Her heart started again. Her ears grew pointed, her senses sharpened, and her mortal body became fae.'],
      ['narr', 'And for the first time, Wren felt it: a thread of light pulled tight in her chest, running straight to him. It had always been there. She had only been too mortal to feel it.'],
      ['wren', '...Caelum? What is this?'],
      ['caelum', '...You can feel it now.'],
      ['narr', 'Before he could say anything more, Rowan pulled her into his arms, and carried her home to Spring.'],
      { do: 'complete' },
    ],

    // ======================================================== Chapter 1: Ashes
    ashes_start: [
      { do: 'art', id: 'spring', title: 'The Spring Court, three months later' },
      ['narr', 'Three months later. Rowan has given Wren everything: silk, music, a garden, guards at every door.'],
      ['narr', 'He has not given her a way out. And every night the thread in her chest pulls east, toward the Court of Dusk.'],
      ['wren', 'I can feel him. Even from here. What did he do to me?'],
      { do: 'art', id: 'window', title: 'Midnight at the Spring Court' },
      ['narr', 'Midnight. The Spring Court is asleep. Wren is not.'],
      ['caelum', 'Good evening, Wren. You look like you haven\'t slept in three months.'],
      ['wren', 'Caelum. You can\'t be here. If Rowan finds the High Lord of Dusk in his court...'],
      ['caelum', 'They\'d be terribly rude about it. I\'m here for what I\'m owed: one week of every month, at my home. Our bargain from the Deep.'],
      { do: 'meet', who: 'caelum' },
      { choose: [
        { text: '"Fine. Get me out of here."', bond: { caelum: 10 }, then: [
          ['caelum', 'Gladly. You\'ve been holding your breath for three months. Let\'s find you somewhere you can breathe.'],
        ] },
        { text: '"I don\'t belong to you."', bond: { caelum: 5 }, then: [
          ['caelum', 'No. You don\'t belong to anyone. That\'s rather the point. One week. Then you decide.'],
        ] },
        { text: '"Why now?"', bond: { caelum: 10 }, then: [
          ['caelum', 'Because the Iron King is moving, and I need people I trust. You are one of very few.'],
        ] },
      ] },
      ['wren', 'And this thread between us? Since the Deep, I can feel you. All the time. What did your blood do to me?'],
      ['caelum', 'Nothing that wasn\'t already there. I\'ll tell you everything, I promise. Not here, with Rowan\'s guards outside the door.'],
      ['caelum', 'Take my hand. And don\'t scream. It carries.'],
      ['narr', 'He does not use the door. He opens the window, and then he opens his wings.'],
      { do: 'art', id: null },
      { do: 'mode', name: 'flight' },
      ['narr', 'They come down on a mountain road in the cold, with the smell of pine, and Wren\'s legs do not quite work.'],
      ['caelum', 'The wards will not let me fly you in. From here we walk. Fae can winnow, step out of one place and into another: I\'ll meet you up the road.'],
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
      ['caelum', 'That glow ahead is Starhaven. Hidden from every other court for a thousand years.'],
      ['wren', 'Why show it to me?'],
      ['caelum', 'Because the Iron King is coming, and my city has gone dark. It needs someone who can make it shine again.'],
      { do: 'winnow', npc: 'caelum', to: 57 },
    ],
    ashes_gate: [
      ['caelum', 'The war took our painters and our lamplighters. Half of Starhaven sits in the dark now.'],
      ['caelum', 'You painted once, before the hunting. You told me, in the Deep.'],
      ['wren', '...I remember. I haven\'t held a brush since.'],
      ['caelum', 'There\'s a bare wall halfway down this street. Paint something on it.'],
      { do: 'flag', name: 'arrive' },
      { do: 'goal', id: 'mural' },
      { do: 'winnow', npc: 'caelum', to: 80 },
    ],
    ashes_painted: [
      ['wren', 'I\'d forgotten how much I missed this.'],
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
        { text: '"How long?"', bond: { caelum: 5 }, then: [
          ['caelum', 'Two years. Since the war took my painters. I\'d stopped looking at it.'],
        ] },
        { text: '"Is that why you really brought me here?"', bond: { caelum: 10 }, then: [
          ['caelum', 'Partly. And partly because I remember a girl in the Deep who didn\'t break. I wanted to see her again.'],
        ] },
        { text: '"Don\'t get sentimental, High Lord."', bond: { caelum: 5 }, then: [
          ['caelum', 'Too late. I\'m unbearable when I\'m sentimental. Ask anyone.'],
        ] },
      ] },
      ['wren', 'You promised to tell me. The thread. What is it?'],
      ['caelum', 'A mating bond. The rarest thing there is between two people. Fate\'s doing, not mine.'],
      ['caelum', 'I felt it the first moment I saw you, Under the Mountain. You were mortal, so you couldn\'t. My blood didn\'t make the bond. It only let you feel what was already there.'],
      { choose: [
        { text: '"You should have told me."', bond: { caelum: 5 }, then: [
          ['caelum', 'Yes. And you\'d have thought it was a trick to keep you. I wanted you to choose for yourself, with all of it in front of you.'],
        ] },
        { text: '"Is that why you saved me?"', bond: { caelum: 5 }, then: [
          ['caelum', 'I saved you because you were dying. The bond is why I could never have lived with not trying.'],
        ] },
        { text: 'Say nothing. Take his hand.', bond: { caelum: 10 }, then: [
          ['narr', 'The thread between them hums like a plucked string. Neither of them lets go for a long time.'],
        ] },
      ] },
      ['caelum', 'It doesn\'t bind you to anything. You owe me nothing for it. Whatever you choose, it\'s yours to choose.'],
      ['wren', 'Rowan will come for me.'],
      ['caelum', 'He\'ll come for me. Let him. Tomorrow you meet the Five, my inner circle. Try not to stab any of them.'],
      ['wren', 'No promises.'],
      { do: 'bond', who: 'caelum', pts: 10 },
      { do: 'flag', name: 'rooftop' },
      { do: 'complete' },
    ],

    // ---------------- Evening 1: the first night in Starhaven (with Caelum)
    evening1: [
      { do: 'art', id: 'rooftop', title: 'Evening: the Rooftop House' },
      ['narr', 'Wren\'s first night in Starhaven. Below her, one street glows. The rest of the city waits in the dark.'],
      ['caelum', 'Can\'t sleep either?'],
      ['wren', 'I don\'t sleep much. The Deep follows me.'],
      ['caelum', 'Mine too. Here. Starlit wine. It tastes like the first warm night of summer.'],
      { choose: [
        { text: 'Show him your sketchbook', liked: 'caelum', bond: { caelum: 15 }, why: 'You let him see the worst thing you carry.', remember: ['sketchbook', 'Showed Caelum the sketchbook of the Deep.', true], then: [
          ['caelum', '...These are the Deep. You drew it from memory?'],
          ['wren', 'So I could stop seeing it. It doesn\'t work.'],
          ['caelum', 'It might, one day. Draw Starhaven next. Give the Deep some competition.'],
        ] },
        { text: 'Toast to the bargain', bond: { caelum: 5 }, why: 'Easy company, and nothing risked.', then: [
          ['caelum', 'To the bargain. The best one I ever made, and I\'ve made some very good ones.'],
        ] },
        { text: 'Ask what he sees in his nightmares', bond: { caelum: 10 }, why: 'Nobody asks him. You did.', remember: ['nightmares', 'Asked Caelum about his nightmares.', true], then: [
          ['caelum', 'The Thorn Queen\'s court. Smiling at her while she held my people hostage.'],
          ['caelum', 'I\'d do it again to keep them safe. I hate that I\'d do it again.'],
        ] },
      ] },
      ['caelum', 'The Five will test you tomorrow. Bram will try to break you. Iris will try to read you. Let them.'],
      ['wren', 'And you?'],
      ['caelum', 'I\'ll be watching from somewhere I can pretend I\'m not.'],
      { do: 'bond', who: 'caelum', pts: 20 },
    ],

    // ======================================================== Chapter 2: The Five
    ring_start: [
      ['bram', 'So you\'re the huntress who walked out of the Deep. I\'m Bram. I run the Training Ring.'],
      { do: 'meet', who: 'bram' },
      ['bram', 'Half of Spring wants your head for running off with our High Lord. Or him running off with you. The songs disagree.'],
      ['bram', 'Either way, there\'s an army on our southern border with your name on its banners. Caelum says you can fight. I\'d like to see it.'],
      { choose: [
        { text: '"Point me at something."', bond: { bram: 10 }, then: [
          ['bram', 'Ha! I like you already. Don\'t tell Caelum.'],
        ] },
        { text: '"Caelum talks about me?"', bond: { bram: 5 }, then: [
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
      ['bram', 'Now my thorn pit.'],
      ['bram', 'Jump toward the buds and strike down on them. Each bounce gives you your jumps back. Don\'t fall in.'],
      { do: 'flag', name: 'combo' },
      { do: 'goal', id: 'pit' },
      { do: 'gate', id: 'pitgate' },
    ],
    ring_pit: [
      ['bram', 'Ha! Clean. Now some real work.'],
      ['bram', 'Thorn sprites, the Iron King\'s creatures, came over the north wall last night. Three of them. Clear them out.'],
      ['bram', 'They glow orange right before they lunge. Dash through the lunge, then cut them down.'],
      { do: 'bond', who: 'bram', pts: 10 },
      { do: 'flag', name: 'pit' },
      { do: 'goal', id: 'sprites' },
      { do: 'gate', id: 'northgate' },
    ],
    iris: [
      ['iris', 'Oh! You\'re the new one. I\'m Iris. I see threads of fate.'],
      { do: 'meet', who: 'iris' },
      ['iris', 'Yours is very tangled and very shiny. Anyway, hi!'],
      { choose: [
        { text: '"What does tangled mean?"', bond: { iris: 10 }, then: [
          ['iris', 'It means lots of people are tied to you. Some you know. Some you will. One you\'re pretending you don\'t.'],
        ] },
        { text: '"Shiny is good, right?"', bond: { iris: 5 }, then: [
          ['iris', 'Shiny is very good! Mostly. Shiny things get noticed.'],
        ] },
      ] },
      ['iris', 'Go stab things. Bram likes that.'],
    ],
    ring_done: [
      ['caelum', 'Three thorn sprites and not a scratch. Bram owes me a drink.'],
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
      ['bram', 'Spring at our southern border, iron at our north. He wants us fighting Rowan while he walks in the back door.'],
      { choose: [
        { text: '"If he touches them, I\'ll kill him."', bond: { bram: 10 }, then: [
          ['bram', 'Get in line, huntress. But I\'ll hold your coat.'],
        ] },
        { text: '"How do we keep them safe?"', bond: { caelum: 10 }, then: [
          ['caelum', 'Quietly, for now. I\'ll have eyes on their village by morning. You have my word.'],
        ] },
        { text: '"Iris, what else did you see?"', bond: { iris: 10 }, then: [
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
      ['caelum', 'Rowan sent a letter today. He says I stole you, and he will have you back, or have my court in ashes.'],
      ['caelum', 'And my spies say the Iron King asked about you by name. My people are already watching your sisters\' village.'],
      { choose: [
        { text: '"Thank you."', bond: { caelum: 10 }, then: [
          ['caelum', 'Don\'t. It isn\'t a favor. It\'s what you do for your own.'],
        ] },
        { text: '"I should go to them myself."', bond: { caelum: 5 }, then: [
          ['caelum', 'You will. When it\'s time, I\'ll fly you there myself. Not before you\'re ready.'],
        ] },
        { text: 'Give him a sketch of Starhaven', liked: 'caelum', bond: { caelum: 15 }, then: [
          ['caelum', 'You drew my city.'],
          ['caelum', '...Our city. If you\'ll have it.'],
        ] },
      ] },
      ['caelum', 'One more thing. The bargain. You don\'t owe me anything anymore. You can leave whenever you like.'],
      ['wren', '...I know. I\'m staying anyway.'],
      { do: 'bond', who: 'caelum', pts: 20 },
    ],
    // Chapter 2, more to do
    ring_bram_talk: [
      ['bram', 'Before you swing at anything: why are you here, huntress? Not "he stole me". Why are you still here?'],
      { choose: [
        { text: '"Because nobody here has lied to me yet."', bond: { bram: 10 }, why: 'He respects a reason that small and that true.', remember: ['bramTruth', 'Told Bram she stays because nobody here has lied to her.', true], then: [['bram', 'Hm. Give it a week. But that\'s a soldier\'s answer. I\'ll take it.']] },
        { text: '"I\'m here to get strong enough to leave."', bond: { bram: 5 }, why: 'Honest. He\'d have said the same at your age.', remember: ['bramLeave', 'Told Bram she is here to get strong enough to leave.', null], then: [['bram', 'Then I\'ll train you well enough that leaving is your choice and not anyone else\'s.']] },
        { text: '"That\'s between me and your High Lord."', bond: { bram: -5 }, why: 'He has buried people who kept things from him.', then: [['bram', 'Everything in this city is between you and the people who\'ll bleed next to you. Remember that.']] },
      ] },
      ['bram', 'There are three rings hung past the dummy. Cut them all and I\'ll believe your feet as well as your mouth.'],
    ],
    ring_rings: [
      { do: 'flag', name: 'rings3' },
      ['bram', 'Low, rising, and one from the air. Who taught you to read a target?'],
      ['wren', 'My father, on straw. I left the bow on the far side of the Wall. The eye came with me.'],
      ['bram', 'Daggers for now. When you\'ve earned a fae bow, I\'ll string it myself.'],
      { do: 'remember', key: 'rings', text: 'Cut all three of Bram\'s rings.', good: true },
      { do: 'bond', who: 'bram', pts: 10, liked: true, why: 'Three for three. He stopped pretending not to watch.' },
    ],
    ring_plums: [
      ['narr', 'A market crate, burst open in the thornwood. Most of it is ruined. One paper twist of sugared plums is not.'],
      ['wren', 'Somebody ran from here in a hurry. ...Iris said something about plums.'],
      { do: 'remember', key: 'plums', text: 'Saved a twist of sugared plums from the thornwood.', good: true },
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
        { text: '"Spar with me again."', bond: { bram: 10 }, then: [
          ['bram', 'Now you\'re talking.'],
          ['narr', 'You spar until neither of you can lift an arm, then lie in the sand laughing.'],
        ] },
        { text: 'Ask about the north wall', bond: { bram: 5 }, then: [
          ['bram', 'Lost my brother on that wall, years back, to the Iron King\'s father. I don\'t lose people on it anymore.'],
        ] },
      ] },
      ['bram', 'You fight like someone with people to protect.'],
      ['wren', 'Two sisters. Mortal. Across the sea.'],
      ['bram', 'Then we keep them safe. That\'s what the Five do.'],
      { do: 'bond', who: 'bram', pts: 20 },
    ],
    ev2_iris: [
      { do: 'art', id: 'observatory', title: 'Evening with Iris' },
      ['narr', 'A round tower above the Library, full of maps, candles and threads of starlight hanging in the air.'],
      ['iris', 'You came! Nobody visits the seer. They\'re afraid I\'ll tell them how they die.'],
      { if: 'plums', then: [['wren', 'I found these in the thornwood. I think they were coming to you.'], ['iris', 'SUGARED PLUMS. I saw these arriving and I didn\'t dare believe it. You are my favourite thread.'], { do: 'bond', who: 'iris', pts: 15, liked: true, why: 'Sugared plums, carried out of a thornwood, for her.' }] },
      { choose: [
        { text: 'Bring her sugared plums', liked: 'iris', bond: { iris: 15 }, then: [
          ['iris', 'Plums! Sugared! Oh, you\'re a good thread, Wren. A very good thread.'],
        ] },
        { text: 'Ask about your sisters\' threads', bond: { iris: 10 }, then: [
          ['iris', 'Bright. Stubborn. One sharp, one soft. And iron getting closer. I\'m sorry. I can\'t see past it yet.'],
        ] },
        { text: '"So how do I die?"', bond: { iris: 5 }, then: [
          ['iris', 'Ha! No. But not soon. You have far too much painting to do.'],
        ] },
      ] },
      ['iris', 'Can I tell you a secret? Caelum\'s thread tangled with yours the day you walked into the Deep. He pretends it didn\'t.'],
      ['wren', '...Does he.'],
      { do: 'bond', who: 'iris', pts: 20 },
    ],

    // ---------------- Heart scenes: play when a bond reaches a new heart
    heart_caelum_2: [
      { do: 'art', id: 'rooftop', title: 'Caelum: heart 2' },
      ['caelum', 'Wren. In the Deep, when the queen\'s last trial broke you, I couldn\'t help. I could only watch.'],
      ['caelum', 'Five hundred years, and I\'ve never felt so useless. I didn\'t bring you here only because of a war.'],
      ['wren', '...Then why?'],
      ['caelum', 'Ask me again some other night.'],
    ],
    heart_caelum_3: [
      { do: 'art', id: 'rooftop', title: 'Caelum: heart 3' },
      ['narr', 'Caelum spreads his wings, and before Wren can argue, they are over the city, and Starhaven is a sea of small gold lights.'],
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
      ['narr', 'That night, for the first time since the Deep, Wren dreams of fire instead of thorns.'],
      ['narr', 'She wakes with her palm glowing, warm as an ember. It doesn\'t burn her. It feels like it has always been there.'],
      { do: 'art', id: 'library', title: 'The Library of Starhaven' },
      ['thane', 'Sit, sit. Don\'t touch the books with that hand. I\'m Thane. I keep the Library, and I have a theory about you.'],
      { do: 'meet', who: 'thane' },
      ['thane', 'For fifty years the Thorn Queen drained the power of all seven courts and hoarded it Under the Mountain. Flame, frost, shadow, light, tide, thorn and wind.'],
      ['thane', 'When she fell, all of it broke loose. Most of it went home. Some of it went into the only heart that had just stopped beating.'],
      ['wren', 'Mine.'],
      ['caelum', 'Seven courts\' power, sleeping in one woman. Every High Lord alive will want it back. Or want her.'],
      { choose: [
        { text: '"They can try."', bond: { caelum: 5, thane: 5 }, then: [['caelum', 'That\'s my girl. Our girl. Starhaven\'s. I\'ll stop talking.']] },
        { text: '"Can it be taken out of me?"', bond: { thane: 10 }, then: [['thane', 'Honestly? I don\'t know. Nobody has ever done this. I\'d rather learn what it does than what it costs to remove.']] },
        { text: '"Does Rowan know?"', bond: { caelum: 10 }, then: [['caelum', 'If he doesn\'t yet, he will soon. It won\'t make him want you back any less.']] },
      ] },
      ['thane', 'Flame is the one that woke. Let\'s see what it does. There are three braziers in the courtyard. Light them.'],
      { do: 'art', id: null },
      { do: 'flag', name: 'giftgot' },
      { do: 'goal', id: 'flame' },
    ],
    lib_braziers: [
      ['thane', 'All three! Fire answers you. Wonderful. Terrifying, but wonderful.'],
      ['caelum', 'Good, because I need it. Shepherds are dying on the mountain road. Something big has been taking their flocks, then them.'],
      ['caelum', 'And the road is choked with the Thorn Queen\'s last thorns. Steel won\'t cut them. Fire might.'],
      { do: 'flag', name: 'flame' },
      { do: 'goal', id: 'wall' },
      { do: 'winnow', npc: 'caelum', to: 44 },
    ],
    lib_wall: [
      ['wren', 'They\'re burning. Fifty years of her thorns, burning.'],
      ['narr', 'The smoke smells like the Deep. For a moment, Wren can\'t breathe. Then the wind takes it, and the road is open.'],
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
      ['narr', 'Then the air turns warm and sweet, like spring, and there are flowers growing out of the snow.'],
      ['rowan', 'Wren.'],
      ['wren', 'Rowan.'],
      { if: 'rowanHonest', then: [['rowan', 'You told me the truth the night I came for you. Tell it to me now. Are you his prisoner?'], ['wren', 'No.']] },
      { if: 'rowanKnife', then: [['rowan', 'You reached for a knife the first night. I should have known then that you would not stay where you were put.']] },
      ['rowan', 'I\'ve brought an army to his border because of you. I will burn his city to the river if I have to. Come home, and none of that happens.'],
      { choose: [
        { text: '"I\'m not going back, Rowan."', bond: { caelum: 10 }, then: [['rowan', 'You don\'t know what he is. What he wants with you.'], ['wren', 'I know exactly what he is. He let me choose. You never did.']] },
        { text: '"Stop this war. Please."', then: [['rowan', 'He stole you from my bed in the middle of the night. There is no stopping this.'], ['wren', 'He didn\'t steal me. I left.']] },
        { text: 'Show him the fire in your hand', bond: { caelum: 5 }, then: [['narr', 'The flame burns bright in Wren\'s palm. Rowan steps back for the first time.'], ['rowan', '...What did they do to you?'], ['wren', 'Nothing. This was always mine.']] },
      ] },
      ['rowan', 'Then I\'ll take you back. One way or another.'],
      ['narr', 'The flowers wither. He is gone.'],
      ['caelum', 'Are you all right?'],
      ['wren', 'No. Take me home.'],
      ['caelum', '...Home. Yes.'],
      { do: 'bond', who: 'caelum', pts: 10 },
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
        { text: '"No. I meant it."', bond: { caelum: 15 }, then: [['narr', 'Caelum is quiet for a long moment. When he finally smiles, it\'s the first time Wren has seen him look young.']] },
        { text: 'Light a small flame between your hands', liked: 'caelum', bond: { caelum: 15 }, then: [['caelum', 'Show-off.'], ['narr', 'He holds his hands around hers, and the little flame burns gold and violet together.']] },
        { text: '"Ask me again some other night."', bond: { caelum: 10 }, then: [['caelum', 'Using my own lines against me. That\'s cruel, Wren. I respect it.']] },
      ] },
      { do: 'bond', who: 'caelum', pts: 20 },
    ],
    ev3_thane: [
      { do: 'art', id: 'library', title: 'Evening with Thane' },
      ['thane', 'Oh, good. I have forty-one questions about your hand. Sit down. Tea?'],
      { if: 'page', then: [['wren', 'First: this is yours. It was frozen to the mountain.'], ['thane', '...Wyrms sleep facing the wind. I wrote that at nineteen, and lost it the same afternoon. Forty years.'], { do: 'bond', who: 'thane', pts: 10, liked: true, why: 'You carried a scrap of paper down a mountain for him.' }] },
      { choose: [
        { text: 'Bring him a rare book from the Night Market', liked: 'thane', bond: { thane: 15 }, then: [['thane', 'Is this... a first copy of the Tide Court star charts? Where did you... no, don\'t tell me. I\'ll cry on it.']] },
        { text: '"Ask your forty-one questions."', bond: { thane: 10 }, then: [['narr', 'He asks all forty-one. Then he asks nine more. By the end, you both understand the fire a little better.']] },
        { text: 'Ask about the other six powers', bond: { thane: 5 }, then: [['thane', 'Frost, shadow, light, tide, thorn and wind. Asleep, for now. Something will wake each of them. I\'d very much like to be there when it does.']] },
      ] },
      ['thane', 'You know, Caelum hasn\'t smiled like he does now in a long time. Whatever you\'re doing to him, keep doing it.'],
      { do: 'bond', who: 'thane', pts: 20 },
    ],
    heart_thane_2: [
      { do: 'art', id: 'library', title: 'Thane: heart 2' },
      ['thane', 'I\'m giving you a key to the Library. The real Library, the rooms under this one. Very few people have it.'],
      ['thane', 'Don\'t read anything that whispers back.'],
    ],

    // ---------------- The end of the concept: a look at Chapter 4
    finale: [
      { do: 'art', id: 'city', title: 'Next: Chapter 4, The Spy in the Library' },
      ['narr', 'Three nights later, Starhaven sleeps under a sky full of stars.'],
      { if: 'sketchbook', then: [['narr', 'On the sill of the Rooftop House a sketchbook lies open. The newest page is not the Deep. It is a street, with every lamp lit.']] },
      { if: 'cat', then: [['narr', 'On Mirelle\'s step, a black cat watches the Library roof and does not blink.']] },
      { if: 'nightmares', then: [['narr', 'Caelum is asleep. That is new.']] },
      ['narr', 'On the Library roof, something with wings lands without a sound, folds itself into the shadows, and waits.'],
      { do: 'end' },
    ],
  };

  // The journal's "People" page. Unlocked as Wren meets or hears of them.
  S.PEOPLE = [
    { id: 'wren', name: 'Wren', text: 'You. A mortal huntress who died in the Deep and woke up fae. Fights with daggers. Used to paint.' },
    { id: 'sisters', name: 'Nessa and Lissa', text: 'Wren\'s sisters, still mortal, across the sea. Nessa is sharp-tongued and protective. Lissa is gentle and loves her garden.' },
    { id: 'rowan', name: 'Lord Rowan', text: 'High Lord of the Spring Court. He took Wren across the Wall for killing his sacred stag, and she saved him Under the Mountain. Kind in his careful way, terrified of losing her, and now at war with the Court of Dusk.' },
    { id: 'queen', name: 'The Thorn Queen', text: 'The fae tyrant who held Wren in the Deep. Gone now, but not from Wren\'s dreams.' },
    { id: 'caelum', name: 'Lord Caelum', text: 'High Lord of the Court of Dusk and ruler of Starhaven. Charming in public, burdened in private. His blood made Wren fae, and he is her mate: he felt the bond from the first day; she only feels it now.' },
    { id: 'ironking', name: 'The Iron King', text: 'A king across the sea, building an army. His creatures are already in the woods, and he knows Wren\'s name.' },
    { id: 'bram', name: 'Bram', text: 'One of the Five. A general and brawler who runs the Training Ring. The big brother of the group.' },
    { id: 'iris', name: 'Iris', text: 'One of the Five. A seer who sees threads of fate. Oddly cheerful about it.' },
    { id: 'thane', name: 'Thane', text: 'One of the Five. Scholar and keeper of the Library. Has a theory about everything, including Wren\'s fire.' },
  ];
  // Who you know about at the start of each chapter (the intro covers the first five).
  S.KNOWN_FROM = { woods: ['wren', 'sisters'], prologue: ['rowan', 'queen', 'caelum'], ch1: ['ironking'], ch2: ['bram'], ch3: ['thane'] };

  S.END = {
    title: 'End of the concept',
    text: 'That was the Prologue through Chapter 3. Next in the design doc: Chapter 4, The Spy in the Library. Winged spies attack, the city itself becomes the battlefield, and Wren learns the bow.',
  };
})(window.SH = window.SH || {});
