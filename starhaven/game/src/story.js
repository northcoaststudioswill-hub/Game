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
    narr: { name: '', color: '#b9b2dd' },
  };

  // Bonds (DESIGN.md "Bond pacing"): heart 1 when you meet; then hearts at these point totals.
  S.HEARTS_AT = [40, 120, 240, 400];
  S.BONDS = {
    caelum: { loves: 'Wren\'s sketches, starlit wine', perk: 'In missions, enemies glow just before they attack (later chapters).' },
    bram: { loves: 'Spiced bread, sparring', perk: 'Takes one hit for Wren per mission (later chapters).' },
    iris: { loves: 'Sugared plums, old maps', perk: 'Shows hidden chests on the map (later chapters).' },
  };

  // Short version of the story so far, for the journal.
  S.RECAP = 'Wren was a mortal huntress feeding her two sisters through a starving winter. She killed a white stag sacred to the fae, and Lord Rowan of the Spring Court took her across the Wall as payment. When the Thorn Queen seized the courts, Wren went Under the Mountain after him, made a bargain with Lord Caelum of the Court of Dusk, and won the queen\'s three trials. The queen killed her anyway. Caelum brought her back with his blood, and as a fae she can finally feel what he always felt: they are mates.';

  S.CHAPTERS = [
    {
      id: 'woods', label: 'Prologue, part 1', name: 'The Winter Woods', room: 'woods', mortal: true,
      abilities: { double: false, dash: false, daggers: false, bow: true },
      card: 'Before the Deep, before the fae. Wren is nineteen, mortal, and the only hunter in a family that is slowly starving.',
      goals: [
        { id: 'hunt', text: 'Hunt in the woods east of the cottage' },
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
        { id: 'riddle', text: 'Trial 1: answer the queen\'s riddle' },
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
        { text: '"Maybe in spring."', then: [['lissa', 'I\'ll hold you to that. Spring always comes. That\'s the whole point of it.']] },
        { text: '"Paint doesn\'t feed anyone."', then: [['lissa', 'Neither do I, and you keep me around.'], ['wren', 'Barely.'], ['narr', 'Lissa laughs. It\'s the first time in a week.']] },
      ] },
    ],
    woods_nessa: [
      ['narr', 'Nessa is splitting the last of the firewood. She hasn\'t eaten today either. She thinks Wren hasn\'t noticed.'],
      ['nessa', 'I\'d go with you if I could shoot.'],
      { choose: [
        { text: '"You\'d scare everything off with your opinions."', then: [['nessa', 'Someone in this family has to have them.']] },
        { text: '"Eat something, Ness. I\'ll find more."', then: [['nessa', '...You first.'], ['narr', 'Neither of them moves. They\'ve been having this argument all winter.']] },
      ] },
    ],
    woods_tracks: [
      ['wren', 'Tracks. Huge ones. Something this size would feed us for a month.'],
      ['wren', '...They glitter. Tracks don\'t glitter.'],
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
      { do: 'cue', name: 'door' },
      ['narr', 'Then the door bursts open, and winter comes in with him.'],
      ['rowan', 'Who killed the white stag?'],
      ['narr', 'He is tall and golden, with antlers rising from a crown of leaves, and eyes like a summer field on fire.'],
      { choose: [
        { text: 'Step forward: "I did."', then: [['rowan', 'Honest, at least. That will make this easier.']] },
        { text: '"It was a deer. We were starving."', then: [['rowan', 'It was the sacred stag of the Spring Court, and its blood is on your hands.']] },
        { text: 'Reach for your knife', then: [['rowan', 'Put it down, huntress. Mortal steel won\'t touch me, and I didn\'t come here to hurt your family.']] },
      ] },
      ['rowan', 'The Treaty between our peoples is old and simple. A fae life taken by a mortal is paid for with a mortal life.'],
      ['nessa', 'Then take me instead.'],
      ['wren', 'No. Nessa, no.'],
      ['rowan', 'There is another way. Come with me across the Wall and live the rest of your days in the Spring Court. Your sisters keep their lives, and you keep yours.'],
      ['lissa', 'Wren...'],
      ['wren', 'Look after each other. Lissa, plant your seeds. Nessa... eat something.'],
      ['nessa', 'Come back.'],
      ['wren', 'I will.'],
      { do: 'art', id: 'wall', title: 'The Wall' },
      ['narr', 'They ride east through the snow until the night itself shimmers like a curtain: the Wall, the old line between the mortal lands and the fae.'],
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
      ['queen', 'The first trial. Answer my riddle and you may walk my maze. Answer wrong, and I\'ll ask again until you break.'],
      { do: 'goto', id: 'deep_riddle' },
    ],
    deep_riddle: [
      ['queen', 'What is buried in the dark, and grows anyway?'],
      { choose: [
        { text: '"A secret."', then: [['queen', 'Wrong. Secrets rot in the dark. Try again, little huntress.'], { do: 'goto', id: 'deep_riddle' }] },
        { text: '"A seed."', then: [
          ['wren', '...A seed. Lissa\'s seeds, waiting for spring. The answer is a seed.'],
          ['queen', 'Correct. How very dull. Go on, then. My maze is waiting.'],
          { do: 'flag', name: 'riddle' },
          ['caelum', 'Well done, huntress. Can you hear me? The bargain lets me speak to you. And lend you a little of what I have.'],
          ['narr', 'The stars on Wren\'s wrist burn bright. Her legs feel lighter than they have ever felt.'],
          { do: 'goal', id: 'maze' },
        ] },
        { text: '"Grief."', then: [['queen', 'Wrong. Grief doesn\'t grow. It just gets heavier. Again.'], { do: 'goto', id: 'deep_riddle' }] },
      ] },
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
      ['queen', 'My thorns remember mortals. They remember how you bleed.'],
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
      ['narr', 'She wakes with her palm glowing, warm as an ember. Caelum\'s blood made her fae. Something else, something older, is waking up in her now.'],
      ['wren', '...What is this?'],
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
  ];
  // Who you know about at the start of each chapter (the intro covers the first five).
  S.KNOWN_FROM = { woods: ['wren', 'sisters'], prologue: ['rowan', 'queen', 'caelum'], ch1: ['ironking'], ch2: ['bram'] };

  S.END = {
    title: 'End of the concept',
    text: 'That was the Prologue through Chapter 2, the first playable slice of the design doc. If this direction feels right, next comes Chapter 3, First Light: Wren\'s first court gift, Flame, a monster hunt in the mountains, the Night Market, and more evenings with Caelum and the Five.',
  };
})(window.SH = window.SH || {});
