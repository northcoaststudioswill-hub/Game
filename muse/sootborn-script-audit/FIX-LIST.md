# Sootborn script fix list

For the devs, Wednesday 25 November 2026. Checked against the game on the `sootborn` branch at commit `94ea51e` (v0.84), and against the rules in the [Sootborn Script Rules](https://claude.ai/artifact/ByRaDK3UaJZRgkBS5xWkGS) sheet. Rule IDs below (C1, T6, N5 and so on) point to that sheet.

**How to use it.** Search each file for the exact text in the Find column; every one was checked to appear exactly once in that file. Replace it with the text in the Replace column. Line numbers are where the text sat at commit `94ea51e` and may drift. Text inside single-quoted strings in the code has its apostrophes escaped as `\'`; that is how it is written below where it matters. Then follow the release steps (rule F7): `node build.mjs`, run `tests/godrun.mjs` to the end, bump `GAME_VER`, update the changelog, story bible and open list.

## Summary

| Part | Changes |
| --- | --- |
| 1. Line fixes | 55 |
| 2. New narration step (Kael's father) | 1 |
| 3. Rename Proctor | 99 lines of text: 61 to Assayer, 38 to Tallyman |
| 4. Rename Dace | 41 lines of text |
| 5. Fallback fights | Will, in the game code (rule F3) |

## 1. Line fixes

### People

| # | Rule | File | Find | Replace | Note |
| --- | --- | --- | --- | --- | --- |
| 1 | C1 | `src/part2.js` | Tavi is on the wheel now. Twelve. She hums while she turns it | Tavi is on the wheel now. Twelve. He hums while he turns it |  |
| 2 | C1 | `src/part2.js` | She puts the sun back on the Pillar every rest day. Sull scrubs it. She puts it back. I have stopped telling her not to. | He puts the sun back on the Pillar every rest day. Sull scrubs it. He puts it back. I have stopped telling him not to. |  |
| 3 | C1 | `src/part2.js` | He looked at her for some time. | He looked at him for some time. | Lucan looking at Tavi at the white door. |
| 4 | C1 | `src/part2.js` | She painted the sun on it herself | He painted the sun on it himself |  |
| 5 | C1 | `src/story.js` | Your little sibling. The fever nearly took them. The air you stole is why they are still here to steal your bread. | Your little brother. The fever nearly took him. The air you stole is why he is still here to steal your bread. |  |
| 6 | C1 | `src/story.js` | Tavi's cot. They have slept in your bed since the fever. | Tavi's cot. He has slept in your bed since the fever. |  |
| 7 | C13 | `src/part2.js` | MARA IS ON THE NEXT BARGE OVER. SHE SAID SHE WOULD NOT MISS THIS IF IT KILLED HER. IT MIGHT. | MARA SENT A LIST UP WITH TAVI. FORTY-FOUR NAMES. READ THEM OUT WHEN IT IS DONE, SHE SAID. | The Fall's voice line. |
| 8 | C13 | `src/ff.js` | MARA IS ON THE NEXT BARGE OVER. SHE SAID SHE WOULD NOT MISS THIS IF IT KILLED HER. IT MIGHT. | MARA SENT A LIST UP WITH TAVI. FORTY-FOUR NAMES. READ THEM OUT WHEN IT IS DONE, SHE SAID. | Same line, second copy. |
| 9 | C14 | `src/part2.js` | HOLLIS HAS BOTH ARMS UP. I DID NOT KNOW HE COULD. | OLD ORIN HAS BOTH ARMS UP. I DID NOT KNOW HE COULD. | Mara, Tier Six Stands. |
| 10 | C15 | `src/day3.js` | I\'ve been under your feet for six weeks | I\'ve been under your feet for two days |  |
| 11 | C17 | `src/part2.js` | Seren\'s was counted back the night they walked her. I saw it afterwards, on her hook. Number three hundred and six. Somebody had cleaned it. | Seren\'s was taken off her the night they walked her. I saw it afterwards, in the Warden\'s tray. Number three hundred and six. Somebody had cleaned it. Nobody hung it back. |  |
| 12 | C10 | `src/ff.js` | I hit a welder in the back once, for humming. | I hit a welder from behind once, for humming. |  |
| 13 | D6 | `src/part2.js` | A mask-maker was fitting gilt to the left half of his face. | A mask-maker was fitting gilt to the left half of his face. The old Blade had stood behind her chair for thirty years. I put him on the floor at the Pinning. She does not keep what has been beaten. | Adds the D6 line. |

### Years and ages

| # | Rule | File | Find | Replace | Note |
| --- | --- | --- | --- | --- | --- |
| 14 | C2 | `src/day2.js` | I'm eleven, not stupid. | I'm seven, not stupid. |  |
| 15 | D3 | `src/part2.js` | FIFTY YEARS BEFORE THE FURNACE | FORTY-FOUR YEARS BEFORE THE FURNACE |  |
| 16 | D3 | `src/ui.js` | Fifty years before · Celestine | Forty-four years before · Celestine | Dev menu label. |
| 17 | D3 | `src/part2.js` | SHE IS SEVENTY. | SHE IS SEVENTY-THREE. |  |
| 18 | D3 | `src/part2.js` | She was seventy-nine, | She was seventy-three, |  |
| 19 | D4 | `src/ff.js` | THEY SEAL US IN BY TWOS. | THEY SEAL THE ONES NOBODY PAID FOR IN BY TWOS. |  |
| 20 | D4 | `src/ff.js` | That night they seal us in by twos. | That night they seal the ones nobody paid for in by twos. |  |
| 21 | D4 | `src/assay.js` | Four hundred and eighty cadets came into this valley. | Four hundred and eighty cadets came out of the first night. |  |
| 22 | D4 | `src/part2.js` | Four hundred and eighty children went into that valley. | More than five hundred children went into that valley. |  |
| 23 | D5 | `src/ff.js` | a face my own mother would walk past, and had to learn to walk. | a face my own mother would walk past, and had to learn to walk. Ten years came off with the rest. The wire does that. It is most of what the Gilding is for. | Adds the D5 line. |
| 24 | T6 | `src/part2.js` | Seven years I had worn it. | Three years I had worn it. |  |
| 25 | T6 | `src/part2.js` | every morning for five years from a room with a window | every morning for three years from a room with a window |  |
| 26 | T6 | `src/part2.js` | I was handed nine hundred lines in five years. | I was handed nine hundred lines in three years. |  |
| 27 | T6 | `src/part2.js` | I carried it nine years. | I carried it five years. |  |
| 28 | T6 | `src/part2.js` | Nine years of counting, and it had never once | Six years of counting, and it had never once |  |
| 29 | T6 | `issue/story.js` | One has been paying on it nine years. | One has been paying on it five years. |  |
| 30 | T6 | `src/part2.js` | I had not used it in seven years. | I had not used it in nine years. |  |
| 31 | T6 | `src/part2.js` | Seven years late. | Nine years late. |  |
| 32 | T6 | `src/part2.js` | I have watched you do it for four years | I have watched you do it for five years | Kestrel at the rail, nine years after. |
| 33 | T6 | `src/assay.js` | four hundred and six lines I have struck since | a hundred and forty lines I have struck since | The Count hall is at five years; 406 is his total at seven. |
| 34 | T5 | `src/rowk.js` | One valley, twelve houses, one year. | One valley, twelve houses, one season. |  |
| 35 | T5 | `src/day3.js` | I HAVE BEEN STANDING UNDER IT FOR FORTY DAYS. | I HAVE BEEN STANDING UNDER IT FOR FIFTY DAYS. |  |
| 36 | T6 | `src/ff.js` | twice a week for half a year. | twice a week for four months. |  |
| 37 | T6 | `src/story.js` | The fuse you pulled forty-one days ago | The fuse you pulled forty-five days ago |  |
| 38 | T6 | `src/cinema.js` | The Authority cut the clinic to ration pressure two weeks ago. | The Authority cut the clinic to ration pressure a month ago. | Orin says the fans were already shut three weeks before. |

### Gold and the Gilding

| # | Rule | File | Find | Replace | Note |
| --- | --- | --- | --- | --- | --- |
| 39 | N5 | `src/ff.js` | SHE WILL HAVE TO PIN THE GOLD ON ME HERSELF. | SHE WILL HAVE TO PIN THE SUN ON ME HERSELF. |  |
| 40 | N5 | `src/ff.js` | she will have to pin the gold on me herself. | she will have to pin the sun on me herself. |  |
| 41 | N5 | `src/assay.js` | and they pin gold on me, | and they pin the sun on me, |  |
| 42 | N5 | `src/day3.js` | SHE IS ABOUT TO PIN GOLD ON WHAT THE EMBER LIT. | SHE IS ABOUT TO PIN HER SUN ON WHAT THE EMBER LIT. |  |
| 43 | N6 | `src/ff.js` | THE THING I KEEP UNDER THE GOLD. | THE THING I KEEP UNDER THE WIRE. |  |
| 44 | N6 | `src/ff.js` | BEFORE THE GOLD, I WAS SOOT. | BEFORE THE GILDING, I WAS SOOT. |  |
| 45 | N6 | `src/ff.js` | WASH THE GOLD OFF MY HANDS | WASH THE ACCREDITED OFF MY HANDS |  |
| 46 | N7 | `src/brawl.js` | ILSE SAID I WOULD BLEED GOLD. SHE LIED. IT IS STILL RED. | ILSE SAID THE GILDING WOULD GO ALL THE WAY DOWN. I AM BLEEDING. IT DID NOT. |  |

### Old names

| # | Rule | File | Find | Replace | Note |
| --- | --- | --- | --- | --- | --- |
| 47 | N8 | `issue/story.js` | TEO ALDANE SHARED HIS BREAD ON THE LIFT. | DORIAN ALDANE SHARED HIS BREAD ON THE LIFT. |  |
| 48 | N8 | `issue/story.js` | I NEVER TOLD TEO THERE WAS A SHE. | I NEVER TOLD DORIAN THERE WAS A SHE. |  |
| 49 | N8 | `src/assay.js` | why did you care whether it would? W.H. | why did you care whether it would? K.D. |  |

### Small fixes

| # | Rule | File | Find | Replace | Note |
| --- | --- | --- | --- | --- | --- |
| 50 | B12 | `src/main.js` | She lights it herself, some years. | She has not lit it herself in eleven years. |  |
| 51 | B13 | `src/day2.js` | the note she left you on the morning of the wedding | the note she left you the morning after the wedding, on her way to first bell |  |
| 52 | B16 | `src/assay.js` | It is forty paces from thirty hungry children. | It is forty paces from forty hungry children. |  |
| 53 | B11 | `src/assay.js` | Apprentice to the Array board. I keep the stack while the heirs are playing. | Junior on the Array board. They give the stack to whoever is newest, while the heirs are playing. |  |
| 54 | B17 | `src/day3.js` | and said: it is a valve washer, Kael. I said: it is the only round thing I own. She said: then I will have to be careful with it, | and said: it is a valve washer, Kael. It is the only round thing you own. So I will have to be careful with it, | So her own memory scene and this line agree. |
| 55 | M4 | `src/rowk.js` | It only plays five notes. The shift song only has five. | It only plays five pitches. The shift song only needs five. |  |

## 2. New narration step: Kael's father (rule C18, decision D9)

In `src/part2.js`, find the narration step `Holloway, S. They had not even written her whole name.` (about line 188). Add a new narration step straight after it:

> Two pages on, a line I had not gone looking for. Brennick. Tier Six. Reassigned to the service. Struck. Balanced. No first name. I had never known it either. Mara had been right. My father had been promoted.

It pays off Mara's line on day 43 (`src/day3.js`): "Your father thought he was being promoted, too."

## 3. Rename Proctor (decisions D1 and D10)

The graders of the Assay become **Assayers**. The police below become **Tallymen**. Match the grammar each time:

| Was | Valley (the Assay) | Below (the tiers) |
| --- | --- | --- |
| a Proctor | an Assayer | a Tallyman |
| the Proctors | the Assayers | the Tallymen |
| Proctor's / Proctors' | Assayer's / Assayers' | Tallyman's / Tallymen's |
| PROCTOR / PROCTORS | ASSAYER / ASSAYERS | TALLYMAN / TALLYMEN |
| Proctor Voss | Assayer Voss | |
| Proctor Sull, the Night Proctor | | Tallyman Sull, the Night Tallyman |

Every on-screen use, with the word it becomes. Code identifiers such as `threatenedProctor`, `proctorDone`, `FF.proctor` and the speaker id `proctor` stay as they are; players never see them. Comments are not listed.

| File | Line | Becomes | Text (start) |
| --- | --- | --- | --- |
| `src/cinema.js` | 233 | Tallyman | Fine. I'll keep watch. Night Proctor walks Bay Three every hour with a lantern. If he sees you, you're a thief… |
| `src/story.js` | 24 | Tallyman | Proctor Sull |
| `src/story.js` | 47 | Assayer | Proctor Voss |
| `src/story.js` | 92 | Tallyman | Proctor Sull |
| `src/story.js` | 92 | Tallyman | Authority Proctor, Ashgate beat. Scrubs Seren's sun off the Pillar every week with a wire brush. |
| `src/story.js` | 199 | Tallyman | Also. You threatened a Proctor in Ashgate this morning. With a brush, I'm told. I wrote it down. I write every… |
| `src/story.js` | 266 | Tallyman | Missed a spot, Proctor. Want me to hold the bucket? I am famously good with buckets. |
| `src/story.js` | 277 | Tallyman | They docked my family's air ration a week for humming. Gratitude is breath, the Proctor said. |
| `src/story.js` | 283 | Tallyman | I'm putting it under my pillow. The Proctors don't check under pillows. |
| `src/story.js` | 312 | Tallyman | A Proctor is kneeling at the Pillar's base with a bucket and a wire brush. |
| `src/story.js` | 321 | Tallyman | The Pillar is red. The stall is shut. I have been standing here long enough for a Proctor to look round. |
| `src/main.js` | 130 | Tallyman | Proctor Sull has filed on you. I have delayed the filing. Paper moves slowly when I sit on it. I will not sit … |
| `src/systems.js` | 269 | Tallyman | The click carries. Across the bay, the Night Proctor stops, listens, and turns north. He is going to walk the … |
| `src/rowk.js` | 95 | Tallyman | The Festival of the First Fire. I hung her lantern on the Pillar under the Proctors' lamps and nobody saw me d… |
| `src/day2.js` | 46 | Tallyman | ...Kael. Proctor at the chalk. |
| `src/day2.js` | 47 | Tallyman | PROCTOR SULL - NOTHING GETS WRITTEN DOWN |
| `src/day2.js` | 48 | Tallyman | Sull sits in the chalk dust with his lip split, breathing like a bellows. The square has gone silent. Nobody d… |
| `src/day2.js` | 131 | Tallyman | Fine for obstructing a Proctor: five scrip. Fine for the tone: nothing. The tone I'm keeping. |
| `src/day2.js` | 136 | Tallyman | (Breathe. Every breath is hers.) Happy First Fire, Proctor. |
| `src/day2.js` | 191 | Tallyman | What did the valve say to the Proctor? "Gratitude is breath. And yours stinks." |
| `src/day2.js` | 210 | Tallyman | They license the lanterns now, you hear? One candle-hour each. A Proctor comes round with a stamp. I asked wha… |
| `src/day2.js` | 257 | Tallyman | You flagged her crate. It cost her twelve scrip to a Proctor to un-flag it. She says you owe her twelve scrip … |
| `src/day2.js` | 308 | Tallyman | There is a Proctor's seal on the furnace door today, and beside it a brass cup on a chain. Polished. Waiting. |
| `src/day2.js` | 439 | Tallyman | Proctors carry tapers down the rows. The flame passes hand to hand, lantern to lantern. Seren's fire, coming t… |
| `src/day2.js` | 442 | Tallyman | The Proctor with the taper stops. The row stops. You take out your striker, the one that lights the Bank Seven… |
| `src/day2.js` | 472 | Tallyman | She goes up in light. The lamps come back. The Proctors string a cordon around the Pillar, where every lantern… |
| `src/day2.js` | 483 | Tallyman | Hang her lantern on the Pillar. Stay out of the Proctors' lamplight. Throw a bolt to pull them away. |
| `src/day2.js` | 509 | Tallyman | It's a lantern, Proctor. On First Fire. Write that down and see how it reads. |
| `src/day3.js` | 17 | Assayer | Nobody touches a Proctor. It is the first rule of the Assay, and the only one they have ever enforced. |
| `src/day3.js` | 21 | Assayer | Forty cadets of Violet and thirty of Teal watched a Proctor go down in the mud, and learned in one breath what… |
| `src/day3.js` | 25 | Assayer | The Proctors charge them on the island, at the crown of the vent stack. I climbed it by the keeper's stair, th… |
| `src/day3.js` | 32 | Assayer | From that night they did not follow the House. They followed the cloak. I have thought since that it is all a … |
| `src/day3.js` | 207 | Tallyman | PROCTOR SULL AND THE NIGHT WATCH |
| `src/day3.js` | 209 | Tallyman | Proctor Sull |
| `src/day3.js` | 244 | Tallyman | Below, I am the most boring man on Tier Six. I fix valves. I eat at Ivo's. I let Proctor Sull win an argument … |
| `src/day3.js` | 267 | Tallyman | Tonight. They dropped the watch on you to one Proctor a week ago. Sable sold him a bottle this afternoon. |
| `src/day3.js` | 273 | Tallyman | Light, down through the hatch. Not the Proctor with the bottle. Sull, sober, with the night watch behind him, … |
| `src/assay.js` | 25 | Assayer | NOBODY TOUCHES A PROCTOR |
| `src/assay.js` | 26 | Assayer | I AM A PROCTOR. |
| `src/assay.js` | 27 | Assayer | Proctor Voss |
| `src/assay.js` | 28 | Assayer | HE HAS STOPPED SAYING PROCTOR. HE IS SAYING PLEASE. THEY DO HAVE THE WORD. |
| `src/assay.js` | 51 | Assayer | The Proctors' dais |
| `src/assay.js` | 82 | Assayer | The Proctors will not come down. They hover up there on their boots and write. A House that cannot feed itself… |
| `src/assay.js` | 96 | Assayer | The Proctors' board. One is hammered in at the edge of every camp and repainted from the air each dawn. Twelve… |
| `src/assay.js` | 97 | Assayer | Practice blades, issued blunt. On the first day a Proctor came down on his boots and showed them where the edg… |
| `src/assay.js` | 100 | Assayer | Not a tent. The Proctors' cache: salve, bread, lamp oil, under a white ribbon and a card. "NOT TO BE OPENED BY… |
| `src/assay.js` | 103 | Assayer | ...Blades down. The Proctors mark a drawn blade inside one's own camp. I shall do this the other way. |
| `src/assay.js` | 144 | Assayer | The Proctors want this crossing. A House that will not raid is not a result. |
| `src/assay.js` | 147 | Assayer | Their cook-fire is a Proctor's lamp with the shade off. They never lit a real one either. They are only richer… |
| `src/assay.js` | 160 | Assayer | If you close that valve their lamps go out for an hour. I ought to call a Proctor. I find I should like to see… |
| `src/assay.js` | 171 | Assayer | The Proctors sleep on the ground like anybody. Read what they write. |
| `src/assay.js` | 179 | Assayer | Four pairs of boots on a rack, humming, set to charge off the same vent stack as the lamps. The Proctors do no… |
| `src/assay.js` | 180 | Assayer | A column for each Proctor: which House he is paid to find for, by whom, and how much. Voss has two names again… |
| `src/assay.js` | 181 | Assayer | The Proctors' own standard. A gold sun with an open eye. It hangs over my tier's square as well. The same clot… |
| `src/assay.js` | 327 | Assayer | Do not look at the leg. The Proctors have a salve. They will bring it down when the Assay is over and not befo… |
| `src/assay.js` | 335 | Assayer | He is writing a letter by the fire. The Proctors read them all. He knows. He is writing it anyway. |
| `src/assay.js` | 342 | Assayer | I asked for the truce. The Proctors are annoyed. They cannot grade a conversation. |
| `src/assay.js` | 388 | Assayer | She was on the ridge picket the first night. She saw a light, she says, and thought it was a Proctor. Everybod… |
| `src/assay.js` | 414 | Assayer | My father owes a Proctor. One does not say which. The debt is struck if Violet finishes below Teal's patron. I… |
| `src/assay.js` | 423 | Assayer | PROCTORS' BOARD |
| `src/assay.js` | 424 | Assayer | PROCTORS' BOARD |
| `src/assay.js` | 462 | Tallyman | Last bell's gone, the pair of you. Proctor walks at the quarter. If he finds chalk on her hands it's a week's … |
| `src/assay.js` | 519 | Assayer | THE PROCTORS' BOARD |
| `src/assay.js` | 700 | Assayer | I came down the ridge after dark in a Proctor's cloak, with his blood on the hem and his boots on my feet. |
| `src/assay.js` | 708 | Assayer | THE PROCTORS' LAMPS |
| `src/assay.js` | 708 | Assayer | Six lamps on the dais. Not one of them has moved. They are waiting to be told what a cadet in a Proctor's cloa… |
| `src/assay.js` | 764 | Assayer | A Proctor |
| `src/assay.js` | 777 | Assayer | Back to the reeds. A Proctor does not punish a cadet for trying. He only writes it down. |
| `src/assay.js` | 781 | Assayer | The Proctors' board. Her House is in the lower half of it. It will not be in the morning. |
| `src/ff.js` | 22 | Assayer | THE PROCTORS ON THE DAIS WRITE DOWN EVERY CUT. I GIVE THEM SOMETHING TO WRITE. |
| `src/ff.js` | 28 | Assayer | TWELVE HOUSES. REAL STEEL. PROCTORS ON THE DAIS WRITE DOWN WHO IS WORTH KEEPING. THEY CALL IT THE ASSAY. |
| `src/ff.js` | 46 | Tallyman | HE HITS LIKE A PROCTOR. I HAVE BEEN HIT BY PROCTORS. |
| `src/ff.js` | 102 | Assayer | THE PROCTOR |
| `src/ff.js` | 102 | Assayer | HALDEN VOSS - NOBODY TOUCHES A PROCTOR |
| `src/ff.js` | 104 | Assayer | Proctor Voss |
| `src/ff.js` | 105 | Assayer | THE PROCTORS ARE MEANT TO WATCH. THIS ONE HAS BEEN SELLING OUR POSITIONS TO HOUSE TEAL. |
| `src/ff.js` | 109 | Assayer | THE PROCTOR |
| `src/ff.js` | 110 | Assayer | PROCTOR VOSS CAME DOWN FROM THE DAIS TO FINISH HOUSE VIOLET HIMSELF. |
| `src/ff.js` | 111 | Assayer | NOBODY TOUCHES A PROCTOR. IT IS THE FIRST RULE THEY TEACH YOU. |
| `src/ff.js` | 284 | Assayer | A Proctor reads out a dead boy's name. I answer to it. Nobody looks twice. Ilse was right about that: they do … |
| `src/ff.js` | 305 | Assayer | The Proctors watch from the dais and write it all down. The winner is not given a prize. He is given a post: t… |
| `src/ff.js` | 316 | Assayer | House Teal held the island in the river, and the island held the only pump house in the valley. Their lamps ra… |
| `src/part2.js` | 11 | Assayer | SEVERIN CADE. HIS UNCLE THE MARSHAL DID NOT ENJOY HEARING THAT A NOBODY FROM A MINOR HOUSE MADE A PROCTOR BLEE… |
| `src/part2.js` | 118 | Tallyman | Proctor Sull |
| `src/part2.js` | 176 | Assayer | One does not ask who was in the room. The Proctors seal the pairings. I only wondered whether he was brave. |
| `src/part2.js` | 251 | Assayer | One remembers. The Proctors had a salve. |
| `src/part2.js` | 329 | Assayer | There was a note pinned to the Proctors' glass, at the Assay. Her hand. "My son is to reach the last day. No f… |
| `src/ui.js` | 225 | Assayer | The Proctor · duel with Halden Voss |
| `src/ui.js` | 263 | Tallyman | First Fire · Last Bell (the Proctor, then the ceremony) |
| `src/ui.js` | 289 | Assayer | Film · The Proctor |
| `src/ui.js` | 291 | Assayer | ★ NEW · Assay · On the Ground · Proctor Voss (2D) |
| `src/ui.js` | 484 | Tallyman | You put a Proctor on the ground. Nothing was written down. |
| `src/ui.js` | 502 | Tallyman | <p>By first bell the Proctors have taken the lantern down. It does not matter. Four hundred people saw a sun, … |
| `src/panels.js` | 389 | Assayer | THE PROCTORS |
| `issue/story.js` | 555 | Assayer | THE ONLY ONE IN THE VALLEY. THE LAMPS RUN OFF IT, AND THE PUMP, AND THE BOOTS THE PROCTORS STAND ON. |
| `issue/story.js` | 556 | Assayer | I HAD VOSS'S BOOTS AND THEY WERE DEAD IN MY HANDS. *A PROCTOR CHARGES THEM AT THE TOP.* |
| `issue/story.js` | 569 | Assayer | THEY HAD TOLD US THE BOOTS WERE WHAT MADE A PROCTOR. |
| `issue/story.js` | 581 | Assayer | A collar on the crown of the stack, worn bright where a hundred Proctors have stood their heels. I put the dea… |
| `issue/story.js` | 589 | Assayer | Forty feet under this grass somebody is turning a wheel so that a Proctor need not touch the ground. |

Check one by hand: `src/ff.js` line 46, "HE HITS LIKE A PROCTOR. I HAVE BEEN HIT BY PROCTORS.", is in the valley but means the police below, so it takes Tallyman.

## 4. Rename Dace Morrow to Harl Morrow (decision D7)

On screen: `Dace` becomes `Harl`, `DACE` becomes `HARL`, `D.M.` becomes `H.M.`, `D. Morrow` and `D. MORROW` become `H. Morrow` and `H. MORROW`. The cast entry in `src/story.js` changes its `name` to `Harl Morrow`; its id `dace` and flags such as `metDace`, `daceNote`, `toldDace` stay. Every on-screen use:

| File | Line | Text (start) |
| --- | --- | --- |
| `src/story.js` | 19 | Dace Morrow |
| `src/story.js` | 95 | Dace Morrow |
| `src/story.js` | 99 | On the AUX-9 line: an old arrow pointing up, initialed O.R. Below it, fresh chalk: 'STILL FLOWING. — D.M.' Dace Morrow? |
| `src/story.js` | 183 | Dace isn't on tomorrow's roster. |
| `src/story.js` | 336 | CREW 3 — TOMORROW: Mara Venn · Kael Brennick · and a strip of fresh tape where 'Dace Morrow' used to be. |
| `src/story.js` | 338 | WO-114  Valve Bank 7 — rebalance — K. Brennick\nWO-115  Conveyor 2 — grease — D. Morrow\nWO-116  Fuse room C — inspect —… |
| `src/story.js` | 374 | Below it, fresh chalk in a different hand: 'STILL FLOWING. — D.M.' |
| `src/story.js` | 374 | D.M. Dace Morrow. Seren's partner. He kept going after they burned her. |
| `src/story.js` | 399 | Conveyor Two has gone quiet. Dace's grease rag hangs off the rail, still wet. |
| `src/story.js` | 399 | Conveyor Two, clanking along. Dace is elbow-deep in its gearbox. |
| `src/day2.js` | 26 | INFORMANT REMITTANCE — 50 SCRIP — WITH GRATITUDE. Sealed, in Dace's locker. His note: nobody informed. The Authority sen… |
| `src/day2.js` | 28 | Dace's chalk |
| `src/day2.js` | 28 | The collapse in the old tunnel has a gap now, shoulder-wide. His lamp was still warm. On the wall: 'K — IF YOU FOUND THI… |
| `src/day2.js` | 102 | Dace's locker is still locked. Nobody has come for his things. Nobody has come to tell me to stop waiting for him, eithe… |
| `src/day2.js` | 306 | Conveyor Two, still. Dace's rag has dried stiff on the rail. Nobody has moved it. |
| `src/day2.js` | 318 | Dace's locker. The flat-packed lantern is still inside. FOR S. — I'LL CARRY IT. |
| `src/day2.js` | 319 | D. MORROW. Locked. Nobody has come for his things. |
| `src/day2.js` | 343 | Dace's lamp sits on the stack. Wick trimmed. The glass is still faintly warm. He was here last night. |
| `src/day2.js` | 344 | On the wall beside the gap, fresh chalk: 'K — IF YOU FOUND THIS, DON'T FOLLOW YET. LIGHT HER LANTERN FIRST. THEN COME. —… |
| `src/day3.js` | 7 | DACE FIGHTS LIKE SOMEBODY WHO HAS DONE THIS BEFORE. I DID NOT KNOW THAT ABOUT DACE. |
| `src/day3.js` | 93 | There's a window. It's blue, Dace. There's grass. |
| `src/day3.js` | 191 | ILSE IS ON THE MOORING WINCH. BRAND HAS THE STAIR. DACE SENT WORD FROM BELOW: THE TIERS ARE READY. |
| `src/day3.js` | 246 | So you're the one Dace keeps under the floor like a bad secret. I'm Sable. I run Freight Three, which means I decide wha… |
| `src/assay.js` | 23 | MARA HELD ME DOWN. DACE WENT UNDER THE FLOOR. I HAD THOUGHT I WAS DONE BEING SURPRISED BY WHO. |
| `src/assay.js` | 271 | One day. They will find it by tomorrow evening and call it clerical. Dace has until then to get as many as he can up a n… |
| `src/part2.js` | 216 | I let it fall behind a cabinet and found it again the next morning, with apologies. One day. Dace used all of it. |
| `src/part2.js` | 221 | A letter came up through Sable the same week, in Dace's chalk-fingered hand. |
| `src/part2.js` | 341 | The night before the docks we met in Freight Three. Sable, with the shutter down. Ilse. Brand. And Dace, up from under t… |
| `src/part2.js` | 578 | Nell's ward has forty beds and the fans up. Ivo runs Freight Three with Sable, and every crate that comes down is marked… |
| `src/ui.js` | 129 | <div class="card"><b>??? — What did Dace find?</b><p>D.M. chalked the AUX-9 line: STILL FLOWING. A Crew 3 glove in the r… |
| `src/ui.js` | 489 | You took the fifty scrip from Dace's locker. |
| `src/ui.js` | 489 | You left the envelope sealed, the way Dace left it. |
| `src/ui.js` | 490 | Dace is alive, under the floor, and waiting for you. |
| `issue/story.js` | 69 | DACE CHALKED TWO WORDS WHERE THE AUTHORITY WOULD NEVER LOOK. *STILL FLOWING.* THE AIR WENT UP. IT HAS ALWAYS GONE UP. |
| `issue/story.js` | 370 | THE ORDER SAID ELEVEN HUNDRED. DACE SAID: HOLD THE TOP FOR AN HOUR. *A CLERK CANNOT BE SEEN TO FIGHT. I WORE A MASK.* |
| `issue/story.js` | 622 | DOWN THE LADDER, AFTER DACE |
| `issue/story.js` | 633 | THE SEAL HAS GONE. *THE HATCH.* DACE IS ALREADY RUNNING. |
| `issue/story.js` | 642 | "YOU WANT TO SEE WHAT THEY'RE COUNTING?" DACE SAID. *I HAD A WRENCH, AND NO IDEA.* |
| `issue/story.js` | 655 | "NOW YOU KNOW WHAT THEY ARE COUNTING," DACE SAID. |
| `src/issue.js` | 33 | Forty-three days after the furnace. Under the floor, with Dace. |
| `issue/patch.mjs` | 626 | clerk: { name: SC.issue === 'stair' ? 'TAVI' : SC.issue === 'array' ? 'DACE' : 'BRAND', |

`src/day3.js` around line 90 has both a rename and fix C15 ("six weeks" becomes "two days") in the same line.

## 5. Left for Will: the fallback fights (rule F3)

These play only if a comic-book level fails to load, and still carry old story. Will is fixing them in the game code. The lines that disagree with the levels:

| File | Line | Text | Why |
| --- | --- | --- | --- |
| `src/part2.js` | 21 | TONIGHT I AM AT THE BOTTOM OF RISER NINE IN A MASK, WITH BRAND | In the level Kael holds the top, and Brand waits at the top of the ladder. |
| `src/part2.js` | 60 | MARA SAID SHE COULD NOT STOP HER | Tavi is a boy (C1): HIM. |
| `src/part2.js` | 60 | I CLIMBED THEM EVERY MORNING FOR THREE YEARS WITH A SUN ON MY COLLAR | No Accredited climbs that stair; there is a lift. |
| `src/part2.js` | 61 | HER CHAMPION AGAIN. HE YIELDED TO ME ONCE. HE HAS BEEN ASHAMED OF IT FOR FIVE YEARS. | The Blade on the Stair is Oswin, not the Pinning champion (D6). |
| `src/day3.js` | 191 | DACE SENT WORD FROM BELOW: THE TIERS ARE READY. | Harl comes up for the docks (and the rename). |
| `src/day3.js` | 192 | HE HAS HAD SEVEN YEARS TO THINK ABOUT IT. | Vant lost the Ford three years before the docks. |

## 6. Checked and clean

- **No Red Rising names** (N1): searched every string for 22 of its names and terms. None found. "Rain" appears five times, all weather (N11).
- **Cards** (T1 to T4): all 84 cards read. No card says later, earlier, ago or from now. Every Assay card names its day, except Celestine's own Assay, which is not Kael's and needs no calendar.
- **Accredited speech** (S2): no Accredited speaker uses a contraction anywhere in 1,008 spoken lines. The only hits were the service on the Spire, who are soot.
- **Kael's narration** (S4): his first-person narration has no contractions. The second-person narration of Part One's present ("you") uses them in 26 lines; that is before the training, so rule S4 should say first-person only. Will to confirm.
- **Gold** (N3): about 30 uses; all are materials or the emblem except the eight lines fixed in part 1.
- **Spans** (T6): every "years", "months" and "weeks" in the script was checked against the canon dates. The ones that broke are in part 1.

Not done: nobody played the game for this pass; art, models and the comic levels' 3D scenes were not checked against the text. `issue/rig.js` has a comment saying Oswin's leg was broken on night forty-nine; the game says the Vey girl opened it on day twenty-six. It is a comment, not on screen, but whoever models the leg should know.
