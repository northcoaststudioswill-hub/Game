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
    narr: { name: '', color: '#b9b2dd' },
  };

  // Bonds (DESIGN.md "Bond pacing"): heart 1 when you meet; then hearts at these point totals.
  S.HEARTS_AT = [40, 120, 240, 400];
  S.BONDS = {
    caelum: { loves: 'Wren\'s sketches, starlit wine', perk: 'In missions, enemies glow just before they attack (later chapters).' },
    bram: { loves: 'Spiced bread, sparring', perk: 'Takes one hit for Wren per mission (later chapters).' },
    iris: { loves: 'Sugared plums, old maps', perk: 'Shows hidden chests on the map (later chapters).' },
  };

  // The opening cutscene. Each panel: a painted scene (drawn in art.js) and one or two lines.
  S.INTRO = [
    { art: 'woods', text: 'Wren grew up a mortal huntress in the winter woods, keeping her two sisters, Nessa and Lissa, alive one hunt at a time.' },
    { art: 'mountain', text: 'Then the Thorn Queen, a cruel fae tyrant, dragged her Under the Mountain, into a prison called the Deep. Wren beat the queen\'s trials. It killed her.' },
    { art: 'sparks', text: 'The seven High Lords of the fae courts each gave a spark of their power to bring her back. Wren woke up fae: stronger, faster, and not quite herself.' },
    { art: 'caelum', text: 'In the Deep she made a bargain with one of them, Lord Caelum of the Court of Dusk. His help then, for her time later. Now he has come to collect.' },
    { art: 'ships', text: 'Across the sea, the Iron King is building an army, and his spies are already in the woods. Caelum\'s hidden city, Starhaven, will need everyone it has.' },
  ];

  // Short version of the intro, for the journal.
  S.RECAP = 'Wren, a mortal huntress, died in the Thorn Queen\'s prison, the Deep, and the seven High Lords brought her back as fae. She owes Lord Caelum of the Court of Dusk a bargain. Across the sea, the Iron King is preparing for war, and Caelum\'s hidden city, Starhaven, has gone dark.';

  S.CHAPTERS = [
    {
      id: 'prologue', label: 'Prologue', name: 'The Deep', room: 'deep',
      card: 'Three months after the Deep, Wren still dreams of it every night. Tonight, she runs.',
      goals: [
        { id: 'escape', text: 'Escape the Deep: run right, toward the light' },
      ],
      summary: 'Wren relived the Deep in a nightmare and woke up at the Spring Court, safe, smothered and unable to leave.',
      done: 'Wren wakes up at the Spring Court, where everyone keeps her safe and nobody lets her go.',
    },
    {
      id: 'ch1', label: 'Chapter 1', name: 'Ashes', room: 'ashes',
      card: 'Wren is living a gilded, empty life at the Spring Court. One night, Lord Caelum appears at her window to call in their bargain.',
      goals: [
        { id: 'arrive', text: 'Walk with Caelum to Starhaven' },
        { id: 'mural', text: 'Paint the first mural on the dark street' },
        { id: 'rooftop', text: 'Meet Caelum on his rooftop, at the end of the street' },
      ],
      summary: 'Caelum brought Wren to Starhaven, a hidden city gone dark from the war. Her first mural woke up a street. On his rooftop, she agreed to stay a while.',
      done: 'Starhaven has one bright street again, and Wren has a room on a rooftop. Tomorrow, she meets the Five.',
      after: 'evening1',
    },
    {
      id: 'ch2', label: 'Chapter 2', name: 'The Five', room: 'ring',
      card: 'Caelum\'s inner circle, the Five, want to see what the reborn huntress can do. First stop: the Training Ring, and Bram.',
      goals: [
        { id: 'combo', text: 'Show Bram your daggers on the training dummy' },
        { id: 'pit', text: 'Cross Bram\'s thorn pit by bouncing on the buds' },
        { id: 'sprites', text: 'Clear the thorn sprites past the north gate', count: 3 },
      ],
      summary: 'Wren trained with Bram and cleared the Iron King\'s thorn sprites. Iris saw a vision: the Iron King knows Wren\'s name, and his iron is reaching for her sisters.',
      done: 'The Iron King knows Wren\'s name. Across the water, Nessa and Lissa don\'t know they\'re in danger.',
      after: 'evening2',
    },
  ];

  S.SCRIPTS = {
    // ======================================================== Prologue: the Deep
    deep_start: [
      ['queen', 'Back again, little huntress? You never really left my Deep.'],
      ['wren', 'It\'s a dream. Only a dream. Keep moving and it ends.'],
      { do: 'goal', id: 'escape' },
    ],
    deep_wall: [
      ['queen', 'A wall you can\'t climb. Mortals always hit a wall.'],
      ['wren', 'I\'m not mortal anymore.'],
    ],
    deep_dash: [
      ['wren', 'Too far to jump. But this body is fast. Faster than I ever was.'],
    ],
    deep_thorns: [
      ['queen', 'My thorns remember you. They remember how you bled.'],
    ],
    deep_chase: [
      ['queen', 'Enough running. Wake up, my Wyrm. Bring her back to me.'],
      ['wren', 'No. No no no. RUN.'],
      { do: 'wyrm' },
    ],
    deep_end: [
      ['wren', 'Light. It\'s light. I\'m waking up...'],
      { do: 'art', id: 'spring', title: 'The Spring Court' },
      ['narr', 'Wren wakes in a bed of silk at the Spring Court, where the flowers never die and the music never stops.'],
      ['narr', 'Since the Deep she has lived here as a guest of honor. Everyone tells her she is safe. Nobody lets her leave.'],
      ['wren', 'Another morning of smiling at people who look at me like I\'m made of glass.'],
      ['narr', 'On her desk sits a letter from her sisters, three months old. She still hasn\'t answered it. She doesn\'t know what to say.'],
      { do: 'complete' },
    ],

    // ======================================================== Chapter 1: Ashes
    ashes_start: [
      { do: 'art', id: 'window', title: 'Midnight at the Spring Court' },
      ['narr', 'Midnight. The Spring Court is asleep. Wren is not.'],
      ['caelum', 'Good evening, Wren. You look like you haven\'t slept in three months.'],
      ['wren', 'Caelum. You can\'t be here. If they find the High Lord of Dusk in the Spring Court...'],
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
      ['caelum', 'Take my hand.'],
      ['narr', 'The room folds into shadow and starlight, and then there is cold air, and a road, and the smell of pine.'],
      { do: 'art', id: null },
      ['caelum', 'Fae can winnow: step out of one place and into another. I\'ll meet you up the road. Walk with me.'],
      { do: 'goal', id: 'arrive' },
      { do: 'winnow', npc: 'caelum', to: 41 },
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
      ['caelum', 'Tomorrow you meet the Five, my inner circle. Try not to stab any of them.'],
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
        { text: 'Show him your sketchbook', liked: 'caelum', bond: { caelum: 15 }, then: [
          ['caelum', '...These are the Deep. You drew it from memory?'],
          ['wren', 'So I could stop seeing it. It doesn\'t work.'],
          ['caelum', 'It might, one day. Draw Starhaven next. Give the Deep some competition.'],
        ] },
        { text: 'Toast to the bargain', bond: { caelum: 5 }, then: [
          ['caelum', 'To the bargain. The best one I ever made, and I\'ve made some very good ones.'],
        ] },
        { text: 'Ask what he sees in his nightmares', bond: { caelum: 10 }, then: [
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
      ['bram', 'Caelum says you can fight. I\'d like to see it before I believe it.'],
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
      ['bram', 'Not bad. Now my thorn pit.'],
      ['bram', 'Jump toward the buds and strike down on them. Each bounce gives you your jumps back. Don\'t touch the floor.'],
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
      { choose: [
        { text: 'Caelum, on the rooftop', then: [{ do: 'goto', id: 'ev2_caelum' }] },
        { text: 'Bram, at the Training Ring', then: [{ do: 'goto', id: 'ev2_bram' }] },
        { text: 'Iris, in her tower above the Library', then: [{ do: 'goto', id: 'ev2_iris' }] },
      ] },
    ],
    ev2_caelum: [
      { do: 'art', id: 'rooftop', title: 'Evening with Caelum' },
      ['narr', 'The rooftop again. Caelum hasn\'t slept. Reports are stacked under a wine bottle.'],
      ['caelum', 'My spies say the Iron King asked about you by name. My people are already watching your sisters\' village.'],
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
    ev2_bram: [
      { do: 'art', id: 'fire', title: 'Evening with Bram' },
      ['narr', 'The Training Ring after dark. Bram is burning old practice dummies in a fire pit.'],
      ['bram', 'Come to gloat? You broke my best dummy.'],
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

    // ---------------- The end of the concept: a look at Chapter 3
    finale: [
      { do: 'art', id: 'spark', title: 'Next: Chapter 3, First Light' },
      ['narr', 'That night, for the first time since the Deep, Wren dreams of fire instead of thorns.'],
      ['narr', 'She wakes with her palm glowing, warm as an ember. A spark of a High Lord\'s power, waking up.'],
      ['wren', '...What is this?'],
      { do: 'end' },
    ],
  };

  // The journal's "People" page. Unlocked as Wren meets or hears of them.
  S.PEOPLE = [
    { id: 'wren', name: 'Wren', text: 'You. A mortal huntress who died in the Deep and woke up fae. Fights with daggers. Used to paint.' },
    { id: 'sisters', name: 'Nessa and Lissa', text: 'Wren\'s sisters, still mortal, across the sea. Nessa is sharp-tongued and protective. Lissa is gentle and loves her garden.' },
    { id: 'queen', name: 'The Thorn Queen', text: 'The fae tyrant who held Wren in the Deep. Gone now, but not from Wren\'s dreams.' },
    { id: 'caelum', name: 'Lord Caelum', text: 'High Lord of the Court of Dusk and ruler of Starhaven. Charming in public, burdened in private. Wren owes him a bargain.' },
    { id: 'ironking', name: 'The Iron King', text: 'A king across the sea, building an army. His creatures are already in the woods, and he knows Wren\'s name.' },
    { id: 'bram', name: 'Bram', text: 'One of the Five. A general and brawler who runs the Training Ring. The big brother of the group.' },
    { id: 'iris', name: 'Iris', text: 'One of the Five. A seer who sees threads of fate. Oddly cheerful about it.' },
  ];
  // Who you know about at the start of each chapter (the intro covers the first five).
  S.KNOWN_FROM = { prologue: ['wren', 'sisters', 'queen', 'caelum', 'ironking'], ch1: [], ch2: ['bram'] };

  S.END = {
    title: 'End of the concept',
    text: 'That was the Prologue through Chapter 2, the first playable slice of the design doc. If this direction feels right, next comes Chapter 3, First Light: Wren\'s first court gift, Flame, a monster hunt in the mountains, the Night Market, and more evenings with Caelum and the Five.',
  };
})(window.SH = window.SH || {});
