// Starhaven — the story: intro panels, chapters, goals, every line of dialogue, and the journal.
// Data only. Follows DESIGN.md "Story outline" and "Chapter goals" (Prologue through Chapter 2 = the first playable).
(function (SH) {
  const S = SH.STORY = {};

  // Who can speak. Portraits are drawn by art.js.
  S.CAST = {
    wren: { name: 'Wren', color: '#ffd27a' },
    caelum: { name: 'Lord Caelum', color: '#b9a8ff' },
    queen: { name: 'The Thorn Queen', color: '#ff7a8a' },
    bram: { name: 'Bram', color: '#f0a860' },
    iris: { name: 'Iris', color: '#9fe0ff' },
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
      card: 'Three months later, Wren still dreams of the Deep every night. Tonight, she runs.',
      goals: [
        { id: 'escape', text: 'Escape the Deep: run right, toward the light' },
      ],
      summary: 'Wren relived the Deep in a nightmare, outran the Thorn Queen\'s Wyrm, and woke up.',
      done: 'Wren wakes up gasping, in a silk bed, at a court that isn\'t hers.',
    },
    {
      id: 'ch1', label: 'Chapter 1', name: 'Ashes', room: 'ashes',
      card: 'Wren is living a gilded, empty life at another court. One evening, Lord Caelum appears to call in their bargain.',
      goals: [
        { id: 'arrive', text: 'Walk with Caelum to Starhaven' },
        { id: 'mural', text: 'Paint the first mural on the dark street' },
        { id: 'rooftop', text: 'Meet Caelum on his rooftop, at the end of the street' },
      ],
      summary: 'Caelum brought Wren to Starhaven, a hidden city gone dark from the war. Her first mural woke up a street.',
      done: 'Starhaven has one bright street again. Tomorrow, Wren meets the Five.',
    },
    {
      id: 'ch2', label: 'Chapter 2', name: 'The Five', room: 'ring',
      card: 'Caelum\'s inner circle, the Five, want to see what the reborn huntress can do. First stop: the Training Ring, and Bram.',
      goals: [
        { id: 'combo', text: 'Show Bram your daggers on the training dummy' },
        { id: 'pit', text: 'Cross Bram\'s thorn pit by bouncing on the buds' },
        { id: 'sprites', text: 'Clear the thorn sprites past the north gate', count: 3 },
      ],
      summary: 'Wren trained with Bram, met Iris, and cleared the Iron King\'s thorn sprites from the north wall.',
      done: 'The Five are starting to trust her. The Iron King\'s creatures are getting closer.',
    },
  ];

  // Dialogue scripts. A step is a line ['who', 'text'] or an action { do: ... }.
  S.SCRIPTS = {
    // ---------------- Prologue: the Deep
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
      { do: 'complete' },
    ],

    // ---------------- Chapter 1: Ashes
    ashes_start: [
      ['caelum', 'Good evening, Wren. You look like you haven\'t slept in three months.'],
      ['wren', 'Caelum. What do you want?'],
      ['caelum', 'What I\'m owed. One week of every month, at my home. That was our bargain in the Deep.'],
      ['caelum', 'Walk with me. I\'ll meet you up the road. I want to show you something.'],
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
      ['wren', '...I remember.'],
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
      ['caelum', 'This is the Rooftop House. It\'s yours too, if you want it.'],
      ['wren', 'And if I don\'t?'],
      ['caelum', 'Then you get a very nice room and a very annoying neighbor.'],
      ['caelum', 'Tomorrow you meet the Five, my inner circle. Try not to stab any of them.'],
      ['wren', 'No promises.'],
      { do: 'heart', who: 'caelum' },
      { do: 'flag', name: 'rooftop' },
      { do: 'complete' },
    ],

    // ---------------- Chapter 2: The Five
    ring_start: [
      ['bram', 'So you\'re the huntress who walked out of the Deep. I\'m Bram. I run the Training Ring.'],
      ['bram', 'Caelum says you can fight. I\'d like to see it before I believe it.'],
      ['bram', 'Go hit the dummy. Three cuts in a row, and make the last one count.'],
      { do: 'goal', id: 'combo' },
    ],
    ring_combo: [
      ['bram', 'Not bad. Now my thorn pit.'],
      ['bram', 'Jump over it, hold down, and strike the buds below you. Each bounce gives you your jumps back. Don\'t touch the floor.'],
      { do: 'flag', name: 'combo' },
      { do: 'goal', id: 'pit' },
      { do: 'gate', id: 'pitgate' },
    ],
    ring_pit: [
      ['bram', 'Ha! Clean. Now some real work.'],
      ['bram', 'Thorn sprites, the Iron King\'s creatures, came over the north wall last night. Three of them. Clear them out.'],
      ['bram', 'They glow orange right before they lunge. Dash through the lunge, then cut them down.'],
      { do: 'flag', name: 'pit' },
      { do: 'goal', id: 'sprites' },
      { do: 'gate', id: 'northgate' },
    ],
    iris: [
      ['iris', 'Oh! You\'re the new one. I\'m Iris. I see threads of fate.'],
      ['iris', 'Yours is very tangled and very shiny. Anyway, hi! Go stab things. Bram likes that.'],
      { do: 'meet', who: 'iris' },
    ],
    ring_done: [
      ['caelum', 'Three thorn sprites and not a scratch. Bram owes me a drink.'],
      ['bram', 'Bram owes nobody anything.'],
      ['caelum', 'The Iron King is testing our walls, Wren. Next time it won\'t be sprites.'],
      { do: 'flag', name: 'sprites' },
      { do: 'complete' },
    ],
  };

  // The journal's "People" page. Unlocked as Wren meets or hears of them.
  S.PEOPLE = [
    { id: 'wren', name: 'Wren', text: 'You. A mortal huntress who died in the Deep and woke up fae. Fights with daggers. Used to paint.' },
    { id: 'sisters', name: 'Nessa and Lissa', text: 'Wren\'s sisters, still mortal. Nessa is sharp-tongued and protective. Lissa is gentle and loves her garden.' },
    { id: 'queen', name: 'The Thorn Queen', text: 'The fae tyrant who held Wren in the Deep. Gone now, but not from Wren\'s dreams.' },
    { id: 'caelum', name: 'Lord Caelum', text: 'High Lord of the Court of Dusk and ruler of Starhaven. Charming in public, burdened in private. Wren owes him a bargain.' },
    { id: 'ironking', name: 'The Iron King', text: 'A king across the sea, building an army. His spies and creatures are already in the woods.' },
    { id: 'bram', name: 'Bram', text: 'One of the Five. A general and brawler who runs the Training Ring. The big brother of the group.' },
    { id: 'iris', name: 'Iris', text: 'One of the Five. A seer who sees threads of fate. Oddly cheerful about it.' },
  ];
  // Who you know about at the start of each chapter (the intro covers the first five).
  S.KNOWN_FROM = { prologue: ['wren', 'sisters', 'queen', 'caelum', 'ironking'], ch1: [], ch2: ['bram'] };

  S.END = {
    title: 'End of the concept',
    text: 'That was the Prologue through Chapter 2, the first playable slice from the design doc, in miniature. If this direction feels right, next comes the Starhaven hub: districts to restore, bond evenings with Caelum and the Five, the bow, and Wren\'s first court gift, Flame.',
  };
})(window.SH = window.SH || {});
