// Starhaven: what the bonds are for, and the pages that fill Wren's journal as she learns the world.
// Both are plain data. game.js unlocks pages; hud.js draws them.
(function (SH) {
  'use strict';
  const S = SH.STORY;

  // Each person: where the bond is heading, and what each heart gives. `now` steps work in this slice.
  S.BOND_PATH = {
    caelum: { toward: 'Whether Wren keeps the Tether he made without asking, or has it cut. How she decides changes how the two of them face the war, and how it ends.',
      steps: [
        { h: 2, name: 'Starlit', text: 'The Bond Art bar fills a quarter faster.', now: true },
        { h: 3, name: 'His shadow at your back', text: 'Once in each place, when Wren is down to her last heart, the Bond Art bar fills at once.', now: true },
        { h: 4, name: 'Falling', text: 'He teaches her to fall from star to star beside him. (Chapters to come.)' },
        { h: 5, name: 'Keep it, or cut it', text: 'Starfall. She decides about the Tether, and the ending changes. (Chapters to come.)' },
      ] },
    bram: { toward: 'A brother. At the siege of Starhaven, Bram holds whichever gate Wren asks him to, if he trusts her enough to be asked.',
      steps: [
        { h: 2, name: 'Shield-brother', text: 'Once in each place, the first blow that would hurt Wren is taken on Bram\'s shield instead.', now: true },
        { h: 3, name: 'The long count', text: 'One more heart for Wren. (Chapters to come.)' },
        { h: 4, name: 'Back to back', text: 'A Bond Art fought together. (Chapters to come.)' },
        { h: 5, name: 'The gate holds', text: 'He stands at the siege. (Chapters to come.)' },
      ] },
    iris: { toward: 'The truth of what she saw. Iris has seen how this ends and will not say, until she is sure Wren can bear it.',
      steps: [
        { h: 2, name: 'Sharp eyes', text: 'Starlight is drawn to Wren from much further away.', now: true },
        { h: 3, name: 'A thread pulled', text: 'Hidden Starlight shows on the path. (Chapters to come.)' },
        { h: 4, name: 'Second sight', text: 'A Bond Art that slows the world. (Chapters to come.)' },
        { h: 5, name: 'What she saw', text: 'She tells Wren the ending, in time to change it. (Chapters to come.)' },
      ] },
    thane: { toward: 'What the six sleeping powers in Wren are, how to wake them safely, and whether any of them can be given back. Thane is the only one reading for it.',
      steps: [
        { h: 2, name: 'Well read', text: 'Wren learns faster: a fifth more experience from everything.', now: true },
        { h: 3, name: 'Margin notes', text: 'Flame costs less to cast. (Chapters to come.)' },
        { h: 4, name: 'The second gift', text: 'He finds the way to wake the next House gift. (Chapters to come.)' },
        { h: 5, name: 'The last question', text: 'He finds out whether the powers can ever be given back. (Chapters to come.)' },
      ] },
    nessa: { toward: 'Whether Nessa follows Wren when the Iron King comes for the sisters, or fights her the whole way.',
      steps: [
        { h: 2, name: 'A letter, unsent', text: 'A page in this journal, in her hand.', now: true },
        { h: 3, name: 'Her word', text: 'She comes when Wren calls. (Chapters to come.)' },
      ] },
    lissa: { toward: 'Whether Lissa still believes in spring when Wren finds her again. It changes what she becomes.',
      steps: [
        { h: 2, name: 'Pressed flowers', text: 'A page in this journal, in her hand.', now: true },
        { h: 3, name: 'Her garden', text: 'Something green grows in Starhaven. (Chapters to come.)' },
      ] },
  };

  // Journal pages. `when` is the first of: ch (chapter reached), met, pts [who, points], mem (a remembered choice).
  // `hint` is what a blank page says before it is written.
  const L = (id, part, title, when, hint, text) => ({ id, part, title, when, hint, text });
  S.LORE_PARTS = ['Below', 'The sky', 'The war', 'People', 'Things I chose'];
  S.LORE = [
    L('wall', 0, 'The Horizon', { ch: 0 }, '', 'East of the village the trees stop at the edge of the world, where the sky comes down to the ground like a curtain of light. The Lit live above it. The old Accord says they stay up there and we stay Below, and for five hundred years the only ones who tested it were hunters who had run out of everything else. Like me.'),
    L('winter', 0, 'This winter', { ch: 0 }, '', 'Three snares, checked at first light. A rabbit is two days. Nothing is two days of Nessa pretending she already ate. Father stopped hunting the year the money went; I learned the bow from a man who took a goat as payment and thought he had the better of it.'),
    L('stag', 0, 'The low star', { ch: 1 }, 'Finish the hunt in the Winter Woods.', 'It did not run. I have turned that over more than anything since. A low star, drifting over the snow as if it had been told to wait. Low stars come down in the coldest winters and the lamp merchants pay well. Nobody told me some of them are children.'),
    L('lifeforlife', 0, 'A light for a light', { ch: 1 }, 'Finish the hunt in the Winter Woods.', 'That is the whole of their law, as far as Lord Rowan explained it at our door. I put out a light of the Dawn House. The Dawn is owed a light. He could have taken mine on the spot. He took me up the Stair instead, alive, to keep his lamps, and I have never decided whether that was mercy.'),
    L('spring', 1, 'The Dawnhold', { ch: 1 }, 'Go up through the Horizon.', 'A garden where it is always early morning. A Lord who is kind the way a locked door is safe. Rowan gave me a room, a garden and no reason to leave, and I was grateful for all three long past the point I should have been.'),
    L('queen', 1, 'The Eclipse', { ch: 1 }, 'Go into the Umbra.', 'Vael. She swallowed the Houses one at a time and their Lords with them. She did not want their light for anything. She wanted them to watch it go. She kept her court in the Umbra, the dark between the stars, where nothing shines that she did not allow.'),
    L('trials', 1, 'Three trials', { ch: 2 }, 'Survive the Umbra.', 'The Weighing, the Climb, the Dark. Win all three and Rowan went free; that was her word, and she never expected to keep it. I gave her a memory. I climbed her stair. The Dark I outran, and she killed me anyway. I remember the glass being cold, and then I remember nothing.'),
    L('blood', 1, 'What his light did', { ch: 2 }, 'Survive the Umbra.', 'Mortals do not come back. Caelum opened his hands over me and gave me half of his own star, and I did, and what got up was not what lay down. Faster. Harder to kill. Freckles that glow when I am angry, which is often. He is dimmer now than he was. He has never once said so.'),
    L('dusk', 1, 'The Dusk House', { ch: 2 }, 'Leave the Dawnhold.', 'The other Houses call it the House of nightmares, and Caelum lets them. A House everyone is afraid of is a House nobody visits. What is actually inside it has been hidden for a thousand years, and he has spent five hundred of them making sure it stays that way.'),
    L('starhaven', 1, 'Starhaven', { ch: 2 }, 'Leave the Dawnhold.', 'A city on a river under a sky with too many stars, with painted shutters and people who stay up late on purpose. When the Eclipse swallowed the Houses, it was the one light she never found. It is the thing he is protecting when he plays the villain, and now I have seen it I would play one too.'),
    L('winnow', 1, 'Falling', { met: 'caelum' }, 'Meet Lord Caelum.', 'The Lit can drop from one place to another like a falling star: a streak of light, a smell like rain on hot stone, and they are across the room or across the sky. Caelum does it without looking. He says it costs him nothing. He is lying about how much.'),
    L('paint', 1, 'Painting the walls', { ch: 3 }, 'Paint in Starhaven.', 'I had not held a brush since the Umbra. The street was dark and the wall was bare and my hands remembered before I did. Where I paint, the lamps come back. Nobody has explained that to me and I have stopped asking, in case it stops.'),
    L('five', 1, 'The Five', { ch: 3 }, 'Come to the Training Ring.', 'Caelum\'s inner circle. Not a council; closer to a family that argues at dinner. A general, a seer and a scholar I have met. There are two more I have not, and the others change the subject when I count.'),
    L('matebond', 1, 'The Tether', { ch: 3 }, 'Come to the Training Ring.', 'Two stars that share one light fall into orbit. That is all it is, Thane says, as if that were small. Caelum gave me half his light while I was dead, and now I feel him the way you feel the ground under your feet. Nobody asked me. I am still deciding what I think about that.'),
    L('rowanwar', 2, 'Rowan\'s war', { ch: 3 }, 'Come to the Training Ring.', 'Caelum called in his debt and took me out of the Dawnhold in front of Rowan\'s whole house. Rowan has called it theft and marched on the Dusk House. He believes he is rescuing me. That is the worst of it: he truly does.'),
    L('ironking', 2, 'The Iron King', { ch: 3 }, 'Come to the Training Ring.', 'A king Below, across the sea, who mines fallen stars to feed his furnaces. Two Houses at each other\'s throats is exactly what he was waiting for. He has learned to wake the Eclipse\'s glass and send it walking, and one of his glasslings knew my name.'),
    L('thornwood', 2, 'What the Eclipse left', { ch: 3 }, 'Come to the Training Ring.', 'She is gone and her glass is not. It grows wherever her dark touched, black and cold, and it remembers being part of her. Now the Iron King wakes it into glasslings. Bram says break them at the knees. He is right, and I hate the sound they make.'),
    L('flame', 2, 'Fire', { ch: 4 }, 'Climb the mountain.', 'It came out of my palm in my sleep. Thane says the Eclipse spent fifty years swallowing a piece of every House\'s star, and when she fell the pieces scattered. Most went home. Some fell into the only star that had just been lit. Mine. The Ember House\'s spark woke first. He says "first" very carefully.'),
    L('wyrm', 2, 'The Old Wyrm', { ch: 4 }, 'Climb the mountain.', 'It has slept in the hollow under the peak since before the Houses went up into the sky. It eats fallen stars, Thane says, and fifty years of the Eclipse left it starving. Its head is plate; its back is not. It hates fire down its throat. Something woke it, and it was not us.'),
    L('sq_lamp', 1, 'The First Lamp', { seen: 'sq_lamp' }, 'Something to look at in the Lamp Square.', 'Lit the night the city was hidden, and never out since. The lamplighters are a guild older than the Five. When a child is born in Starhaven they are carried to it and their hand is pressed to the brass, so the city knows them in the dark.'),
    L('sq_names', 2, 'The Stone of Names', { seen: 'sq_names' }, 'Something to look at in the Lamp Square.', 'Fifty years under the Eclipse, and Starhaven was never found. It still paid. Everyone who left the city to fight her and did not come back is cut into the stone, small, so they all fit. Bram can find forty-one of them without looking. I counted.'),
    L('sq_well', 1, 'The Star Well', { seen: 'sq_well' }, 'Something to look at in the Lamp Square.', 'You say what you would give up, not what you want, and drop the coin. I stood there a long time. I said: being the one who has to be strong. The coin did not make a sound. I do not know what that means and I am not asking Iris.'),
    L('fbow', 2, 'The starbow', { ch: 5 }, 'Reach the Library.', 'Dark ash, light as a held breath, and a string that hums a note I feel in my teeth. Bram strung it the night after the Old Wyrm and told nobody. It shoots where I mean, not where I point. Father would have called that cheating. Father would have loved it.'),
    L('spies', 2, 'The Iron King\'s spies', { ch: 5 }, 'Reach the Library.', 'Grey wings, iron masks, and nothing behind the masks that I could find. They do not want to fight. They want maps: the river gates, the wards, the Library\'s own floor plans. Somebody is planning to walk into this city, and wants to know where the doors are.'),
    L('letter', 2, 'A letter, sealed with the sun', { mem: 'rowanChoice' }, 'Bring down the Spymaster\'s Shadow.', '"She will be at the Library at first light. Take the maps. Leave her to me." The Dawn House\'s sunburst, in gold wax. Rowan is trading Starhaven\'s doors to the Iron King for me. He thinks he is rescuing me. I think the Iron King thinks so too, and is laughing.'),
    L('letter2', 2, 'A letter, sealed with the sun', { mem: 'rowanDoubt' }, 'Bring down the Spymaster\'s Shadow.', '"She will be at the Library at first light. Take the maps. Leave her to me." The Dawn House\'s sunburst, in gold wax. I said Rowan would never. I keep saying it, in my head, to see if it gets truer. It does not.'),
    L('letter3', 2, 'A letter, sealed with the sun', { mem: 'rowanFear' }, 'Bring down the Spymaster\'s Shadow.', '"She will be at the Library at first light. Take the maps. Leave her to me." The Dawn House\'s sunburst, in gold wax. He would hand the Iron King every door in this city to have me back behind his. That is not love. I am not sure what it is. I am sure it is not love.'),
    L('weaver', 1, 'The Cartographer', { flag: 'shadow' }, 'Something written in a margin.', 'One word in iron-grey ink, in a hand that is not Rowan\'s: Cartographer. Thane went white. Iris says the Cartographer draws the sky, and whatever she erases from her chart stops being there, and that my sisters\' names are on it. I have stopped asking Iris questions I do not want answered.'),
    L('c_readlamps', 4, 'The reading lamps', { mem: 'readlamps' }, 'Something to do in the Library stacks.', 'Four lamps on the high galleries, dark since the war. I lit them while the dust was still settling from the spies, and Thane stood in the middle of the stacks and turned round and round like a child at a festival.'),
    L('p_caelum1', 3, 'Caelum, as I found him', { met: 'caelum' }, 'Meet Lord Caelum.', 'Lord of the Dusk House. He stood in the Umbra wearing the Eclipse\'s favor like a coat he meant to burn. Everything he says in public is a blade pointed somewhere. I am learning to hear what he says when it is pointed nowhere.'),
    L('p_caelum2', 3, 'Caelum, on the rooftop', { pts: ['caelum', 40] }, 'Grow closer to Caelum (heart 2).', 'He told me he watched the last trial and could not move. Five hundred years old and useless, he said. He has ruled alone so long that he says "I" when he means the whole city. I do not think anyone has asked him how he is since before I was born.'),
    L('p_caelum3', 3, 'Caelum, what he keeps', { pts: ['caelum', 120] }, 'Grow closer to Caelum (heart 3).', 'He keeps every sketch I throw away. I found them flattened inside a book of old star charts, in order. He does not know that I know. I have started throwing away better ones.'),
    L('p_bram1', 3, 'Bram', { met: 'bram' }, 'Meet Bram.', 'General of Dusk\'s armies, and the one who makes the bread. He was born in a war camp and learned to fight before he learned to read, and is touchy about only one of those. He hits the practice dummy as if it owes him money.'),
    L('p_bram2', 3, 'Bram, by the fire', { pts: ['bram', 40] }, 'Grow closer to Bram (heart 2).', 'He welcomed me to the Five "properly", which I gather he has done for nobody in a century. He lost a company once, following an order he thought was wrong. He follows no order now without saying what he thinks of it first. Caelum calls this insubordination, fondly.'),
    L('p_iris1', 3, 'Iris', { met: 'iris' }, 'Meet Iris.', 'She sees threads: what might happen, tangled, all at once. She is cheerful about it the way people are cheerful in a storm. She collects old maps of places that have changed, and sugared plums, and she already knew my name.'),
    L('p_iris2', 3, 'Iris, what she will not say', { pts: ['iris', 40] }, 'Grow closer to Iris (heart 2).', 'I asked her how this ends. She laughed, and then she did not. She said some threads fray if you look at them too hard, and that mine is the only one in the city she cannot see past a certain night. She would not tell me which night.'),
    L('p_thane1', 3, 'Thane', { met: 'thane' }, 'Meet Thane.', 'Keeper of the Library. He has a theory about everything and tests them on whoever is nearest. Ink on both cuffs. He talks to the books, and I am not completely certain they do not answer.'),
    L('p_thane2', 3, 'Thane, in the margins', { pts: ['thane', 40] }, 'Grow closer to Thane (heart 2).', 'He showed me a page with seven House sigils and a column beside each for what the Eclipse swallowed. Six of the columns have a question mark, in his small exact hand, and my name. He has forty-one questions for me. He apologized for the number, and then asked the first one.'),
    L('p_nessa1', 3, 'Nessa', { pts: ['nessa', 10] }, 'Do right by Nessa.', 'My older sister by a year, and she has never let me forget which of us it is. She gives away her share and then lies about it badly. She has not forgiven Father, or the winter, or me for being the one who can shoot. Tell her the truth and she will carry anything.'),
    L('p_nessa2', 3, 'Nessa\'s letter, unsent', { pts: ['nessa', 40] }, 'Grow closer to Nessa (heart 2).', '"You went with him so we would eat. I know that. I am angry anyway, and I will be until you walk back through this door and I can be angry at your face." It was folded inside my coat. She must have put it there before I left.'),
    L('p_lissa1', 3, 'Lissa', { pts: ['lissa', 10] }, 'Be kind to Lissa.', 'The youngest. She keeps a window box alive in a winter that has killed everything else, by what I can only call stubbornness. She believes spring always comes. I used to think that was softness. It is the hardest thing in our house.'),
    L('p_lissa2', 3, 'Lissa\'s pressed flowers', { pts: ['lissa', 40] }, 'Grow closer to Lissa (heart 2).', 'Wintergreen, a snowdrop, something blue I cannot name. Pressed between two of my old sketches so they would have, she wrote, "company".'),
    L('c_wolfSpared', 4, 'The wolf I let go', { mem: 'wolfSpared' }, 'A choice in the Winter Woods.', 'It was as thin as we were. I lowered the bow and it looked at me a long moment before it went. I have been told since that nothing in those woods that winter was only a wolf.'),
    L('c_wolfKilled', 4, 'The wolf I killed', { mem: 'wolfKilled' }, 'A choice in the Winter Woods.', 'A pelt is a month of bread. I would do it again. I have been told since that nothing in those woods that winter was only a wolf, and I would still do it again.'),
    L('c_green', 4, 'Wintergreen', { mem: 'green' }, 'Something to find in the Winter Woods.', 'Growing under the snow where the big pine fell. Lissa cried, which she will deny. One green thing, in that winter.'),
    L('c_paint', 4, 'A painting in spring', { mem: 'paintPromise' }, 'A promise in the Winter Woods.', 'I promised Lissa a painting when the thaw came. I was up the Stair before it did. I still owe it. I intend to pay.'),
    L('c_rowan', 4, 'What I told Rowan', { mem: 'rowanHonest' }, 'A choice at our door.', 'He asked who put out the star and I stepped forward and said I did. Nessa has not forgiven me for being quicker than her. He called it honest. I think it is the reason he trusts my word now, even across a war.'),
    L('d_tally', 1, 'The tally in the cells', { seen: 'd_tally' }, 'Something to find under the Umbra\'s road.', 'More than four hundred marks before I stopped counting, and under them a warning in another hand: she keeps her word, that is the trap. Whoever cut it understood her better than I did. I read it, I said "noted", and I walked upstairs and let her keep her word to me.'),
    L('d_pack', 0, 'I was not the first', { seen: 'd_pack' }, 'Something to find under the Umbra\'s road.', 'A mortal hunter\'s pack in the cells, older than my grandmother. A woman\'s, I think, by the knife. She went up the Stair and down into the Umbra and nobody at home ever knew why she did not come back. I took the ribbon off her pack. It is tied round my quiver strap now.'),
    L('c_rowanCame', 4, 'Through the bars', { mem: 'rowanCame' }, 'A choice in the Umbra.', 'I told him I came to get him out, and I watched it land. Nobody comes for a Lord of the sky. I think that one sentence is why he cannot let me go now. I meant it as a kindness. It was one. It was also the first bar of a different cage.'),
    L('c_rowanDebt', 4, 'A debt, paid', { mem: 'rowanDebt' }, 'A choice in the Umbra.', 'I told him it was the law, a light for a light, and nothing more. He said I never owed him anything. It was the most honest thing he ever said to me, and he said it from inside a cage.'),
    L('c_lamps', 4, 'Four lamps', { mem: 'lamps' }, 'Something to do on the street in Starhaven.', 'Mirelle was a lamplighter for forty years. When the Eclipse fell the guild was half gone and the lamps on her street stayed dark, because nobody had the heart to climb. I climbed. I did not know I was doing anything but climbing. She says that is the only way the First Lamp ever stays lit.'),
    L('c_cat', 4, 'Mirelle\'s cat', { mem: 'cat' }, 'Someone in Starhaven needs help.', 'On an awning, furious, perfectly able to get down. The first thing I did in this city that was not about a war. I think about that more than it deserves.'),
    L('c_page', 4, 'The torn page', { mem: 'page' }, 'Something to find on the mountain.', 'Frozen to the rock on the mountain road, in Thane\'s hand: "wyrms sleep facing the wind". He lost it up there years ago, before the Eclipse, when he still went looking at things himself. He held it by the edges and said nothing for a while, which he never does.'),
    L('c_bram', 4, 'What I told Bram', { mem: 'bramTruth' }, 'A choice at the Training Ring.', 'He asked why I stay. I said: because nobody here has lied to me yet. He said to give it a week. He also said it was a soldier\'s answer, and from Bram that is a medal.'),
  ];
})(window.SH = window.SH || {});
