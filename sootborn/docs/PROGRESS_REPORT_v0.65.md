# SOOTBORN — Progress report at v0.65
Tagline: "Every breath is hers." Report date: 2026-11-19. Build: v0.65.

**What this is.** A record of where the game stood at v0.65: what exists, the order it plays in, who is in it, where it falls short of its own writing, how good each part is, and what it would cost to raise. It is a snapshot. It is not kept up to date; the changelog, the story bible and the open list are. When the game has moved on, this stays as the measure of how far.

**How it was made.** A bot played the whole story from New Game to THE END without being able to lose (eight minutes, no errors), logging every card, fight, level and menu. The grades and judgements are mine, from that run, from scripted checks and still pictures, and from your play notes. Nothing here was judged by a person playing except where you told me.

**The illustrated version.** The same report with frames from the build and charts, in the style of the State of the Game reports, is in your artifacts: "SOOTBORN Progress Report, v0.65" (https://claude.ai/artifact/QWMxG9cP55RwhK5J56P5Qf). In the repo it is `docs/reports/2026-11-19-progress-report-v0.65/`.

**Going back.** The game as it was before the reorder is kept as a separate playable copy in your artifacts ("SOOTBORN — v0.64, before the reorder") and as the branch `sootborn-v0.64-before-reorder` in the repo.

## 1. How we got here
| Version | What it added |
|---|---|
| v0.1 to v0.6 | One shift in Cinderwell: valves, a journal, saves, portraits. Renamed from Below the Sun |
| v0.7 to v0.10 | First Fire (the second day), the Ember Ring, stealth with a detection meter, the art pass, story panels |
| v0.11 to v0.13 | The Assay: arena fights, fury and ELEVEN, Memory Arts, real 3D above the rock, fights that can be lost |
| v0.14 to v0.16 | Dreams between the days, the Gilding, how they speak, The Ledger and The Way Out. Part One complete |
| v0.17 to v0.22 | Part Two written to THE END; its own places and music; character models; two ways of speaking |
| v0.23 to v0.28 | The fighting system (stagger, style, forms, four finishers); the Assay on foot in 2D; Maren, Kestrel's arc |
| v0.29 to v0.48 | Third-person comic levels: the High Docks, Riser Nine, the Stair; the Table; the ending settled |
| v0.49 to v0.58 | Row K, the Codex, renames (Dorian, Kestrel, Severin), harder fights, controller, the levels' HUD |
| v0.59 to v0.63 | 2.5D places you walk in; guards, bosses and Tavi re-kitted; arena figures detailed; the Proctors drawn |
| v0.64 to v0.65 | One clock (everything dated from the furnace); the days named; the whole story reordered to run forward |

## 2. What exists at v0.65
- **One file**, about 2.2 MB, playable offline on a phone or a computer, with touch, keyboard and controller. About 7,400 lines of game code, plus the comic levels, which run on a 3D engine (three.js) carried inside the file.
- **The whole story is playable from the first second to THE END**: a prologue, four named days below (Part One), and five chapters above (Part Two), with two endings.
- **Free play:** two walk-about days (Ashgate, First Fire), Row K, two stealth sequences.
- **18 fights on the main story path** (counted by the bot), in two styles: 2D below and 3D arena above. Side fights (the Scuffle on Row K, the Ember Ring) and the fighting inside the comic levels are extra.
- **7 playable 2D levels** (the Camp, the Island, the Lamp, the Dais, the Last Night, the Count hall, the Sun).
- **3 third-person comic levels** (Riser Nine, the High Docks, the Stair) and one drawn sequence (the Table).
- **4 places walked in 2.5D** (the fire on night 28, and three memories: the square, Row K, the fever ward).
- **A Codex**, a Memories shelf, three save slots, a training room, a Dev menu that jumps to any scene, and a bot that plays the whole story.
- **Not yet done by anybody:** a full playthrough by a person. Everything is checked by scripts and stills.

## 3. Time: one rule
- **One clock, the furnace.** Cards say how long before or after the furnace, or name a day of the Assay. Never "from now", "later", "earlier", "ago".
- **The four days below are named:** Ashgate (41 days after), First Fire (42), The Ledger (43), The Way Out (160).
- People may speak from their own present. Cards may not.

## 4. The order now (v0.65)
After the cold open, time only moves forward inside each thread.

| # | Where you are | What plays | When |
|---|---|---|---|
| 0 | Opening film, then **the Valley** (3D fight) | The cold open: what he becomes | +4y, Assay day 40 |
| 1 | Prologue | World panel; festival and wedding; fever; **the heist** | −11 months to −4 days |
| 2 | Last Bell | The audit, the furnace, the count to eleven, the tin | 0 |
| 3 | Before the title | **The Pairing** (3D fight) | +4y, night 1 |
| 4 | **Ashgate** | Free play: Row K, the square, the ward, Bay 3. Three walkable memories | +41 days |
| 5 | That night | The Table (3D comic), the lesson, **the Drill** (2D), **No Gloves** (2D), then **the Camp** (2D level) | +½y, +2y, +2½y, then Assay day 3 |
| 6 | **First Fire** | Free play; before the ceremony, **the Ford** (3D fight); the ceremony; **the lantern climb** | +42 days; Assay day 19 |
| 7 | That night | What the Assay is; **the Island** (2D level); **the Standard** (3D fight) | Assay night 25, day 26 |
| 8 | **The Ledger** | Lift Zero, Celestine, the window, **Under the Floor** (2D fight) | +43 days |
| 9 | That night | **The Lamp** (2D level, the fire in 2.5D), **the Dais** (2D level), **the Proctor** (3D), **On the Ground** (2D) | Assay nights 28 to 31 |
| 10 | **The Way Out** | The months, Mara, **the Way Out** (2D fight), Ilse; last dream: **the Last Night** (2D level), **the Keep** (3D). END OF PART ONE | +160 days; Assay night 49, last day |
| 11 | After Part One | **The Pinning** (3D) | +4y |
| 12 | The Post | The Seat Knife; the desk; **the Gallery** (3D) | +4y and a season |
| 13 | The Balancing | Tier Four; **the Sun** (2D, Tavi); **Riser Nine** (3D comic); the Dockmaster's Table | +5y |
| 14 | What She Knows | The hum; **the Son** (3D); Freight Three; **the High Docks** (3D comic) | +6y to +7y |
| 15 | Two Years | **The Dock Stair** (2D, Brand); the week; **Tier Six Stands** (2D, Mara); the Night Before; **the Fall** (3D) | +7y to +9y |
| 16 | The Count | **The Stair** (3D comic); **Little Ember** (3D); the endings | +9y |

## 5. The order before (v0.64 and earlier)
The Assay played: day 40, night 1, day 19, nights 28–31, night 49, last day, day 3, night 25, day 26, the Pinning. The Ford was on the first night; the Lamp, Dais and Proctor interrupted the festival; No Gloves, the Last Night and the Keep were on the second night; the Camp, Island and Standard on the third.

## 6. People: who they are, what is told, what is not, and what they are for
"Play" is how they earn their place in a game: a fight, a level, or a body standing in the world that you can go back to.

| Who | Bio | Told so far | Not yet told | Play |
|---|---|---|---|---|
| **Kael Brennick** | Valve tech, Crew Three. Gilded, becomes Edric Sorrel, Clerk of the Count | Nearly all of it | His mother (one line: "your mother pretends to be angry"); what he was like before Seren | The player |
| **Seren Holloway** | Runner, Crew Three; paints suns; pressure-bound to Kael; took the blame | The furnace; eleven memories; three walkable memories; seat knife 306 | Her family; why she asked Orin about the line weeks before Kael touched it (she may have found the bleed first) | Memory only. **Best unexplored thread:** a walkable memory where she is the one tracing the line |
| **Tavi** | Kael's younger sibling. Six, then twelve, then sixteen | Fever; the Sun level; the Stair | The years seven to eleven: who raised him (Mara) | Playable once (the Sun). Could be a **second playable below between chapters** |
| **Mara Venn** | Foreperson; married them; held Kael down; keeps the list and two tins | Strong | The forty-four names: who they were | Playable once. **Living-world anchor:** her wall grows each time you come home |
| **Ivo** | Best friend; held Kael down; cart | Thin | He says it once (the Night Before). Nothing of his own | NPC. Wants one errand of his own below |
| **Nell** | Runs the fever ward | Good | Her cold crates, before Sable | NPC |
| **Hollis** | Welder; struck for humming; carries Brand's halberd up the Stair | Good | Meeting Brand, the man who struck him | A scene worth writing: **Hollis and Brand, one line each** |
| **Dace Morrow** | Seren's partner; went under the floor; the Unlit | Good | Seven years under the floor | NPC under the floor; could **send you on finds** |
| **Inspector Vale** | Born Tier Four, counted up; struck his own entry | Good | His sister's ward on Tier Eight | NPC; one optional scene |
| **Proctor Sull** | Scrubs the sun; the night watch; learns to look away | Good arc | — | Fight; NPC |
| **Celestine Aurel** | High Auditor; seventy; knew him at the Pinning | Complete | Her own Assay, fifty years ago | Final fight. A **memory of hers** would cost little and land hard |
| **Lucan Aurel** | Her son; kind | Two fights, two branches | What he does after | Fight twice; could be an **ally in the last level** if befriended |
| **Ilse Marrin** | Kept a column; asked to see the person; gilded Kael | Good | Who she was above; her death or not | NPC. No fight, and should not have one |
| **Brand** | Warden who struck Hollis; deserted; trained Kael; eleven minutes | Complete | — | Trainer twice; playable once |
| **Dorian Aldane** | Sixteen; shared bread; the Pairing | Complete | — | One fight. His bread is the best recurring object in the game |
| **Maren Aldane** | His sister; Second Clerk; sold the hour of the raid | Complete | — | Present in a level; a choice at the door |
| **Kestrel Dray** | Accredited engineer who asks why; says "we" | Good | The eleven who held her; her House | NPC in three places. **No play yet:** a valve puzzle done together would fit exactly |
| **Severin Cade / Marshal Cade** | Nephew and uncle | Thin | Why the Marshal balances tiers | Two fights. Thinnest villains in the game |
| **Vant** | Captain at the Ford, later Dockmaster | Fine | — | Fight; a dinner |
| **Ansel Rook** | Stair Captain; decent | Good | — | Boss |
| **Halden Voss** | Proctor paid by two Houses | Good | — | Fight in two halves |
| **Oswin Hale** | Violet cadet; the leg; the Auditor's Blade | The best slow arc | — | Camp NPC, then final-level boss |
| **Petra Lune** | Violet cadet; keeps a column | Fine | — | NPC; a letter |
| **Corin, Merrow, Thorne, the Sisters Vey** | Assay cadets | Enough | — | Fights, a choice |
| **Sable** | Runs Freight Three | Thin | Why she will not ask where greens grow | NPC |
| **Row K** (Nan Orla, Garrow, Tam, Bryn, Dov, Wick, Sela) | The street | Good | — | **The living world.** Scuffle, finds, a memory |
| **The square** (Bao, Orin, Pell, Juno, Fen, Kit, Marrow) | Ashgate | Good | Orin's line drawing "they made me burn" | NPCs; rays; finds |

**Lore told well:** the furnace and the count; air as money; the shift song; how they speak; the Gilding; the Assay and who pays for it; the Count as a book; the seat knives.
**Lore named and never shown:** the Deep Array itself (what it is, why it is failing); Tiers 4, 5, 7, 8, 9 (we only ever stand on 6); the other ten Houses; the surface beyond the valley; how the Accredited got above in the first place.

## 7. Where the game does not yet match its own writing
| What the writing says | What is on screen | Fix | Cost |
|---|---|---|---|
| Every valve hand carries a **seat knife**, counted back onto a board at last bell | Nobody below carries one; no board | A knife on the belt of Crew Three; **the board in Bay 3, and counting the knives back** as the last thing you do each day | Low |
| Kael wears **the Proctor's white cloak** back to camp on day 31, and the cadets follow him from that night | His cape stays violet in the Valley, the Last Night and the Keep | White cape from day 31 on | Very low |
| He **takes the boots on day 31** | He cannot fly until the last day | Decide: either he flies from the Valley on, or a line says the boots have no charge away from the vent stack | Low |
| As **Edric Sorrel he is a clerk** with a sun on his collar; he drops it off the docks | In every Part Two scene he is in Assay plate | A clerk's coat for the Spire scenes and the High Docks; plate only where he is fighting openly | Medium |
| He **wore gloves for a year**, and hides his palms on the Spire | Hands are never an issue on screen | Gloves on the clerk's model; one beat where Kestrel turns his hand over (written, not shown) | Low |
| **Oswin's leg** set crooked | The Auditor's Blade moves like any boss | A stiff leg in his stance and walk | Low |
| **Lucan walks with a stick** if not befriended | Told only | The stick in his last scene | Low |
| **Hollis carried Brand's halberd** up nine hundred steps | It is standing there | Fine as it is | — |
| The Accredited **do not look at each other**; soot do | Everybody behaves the same | See below | Low |

**Deliberate animations that would tell the story (cheap, high value)**
1. **Hand flat on the pipe.** Seren taught it, Kael does it, Kestrel does it without knowing why. One idle, three people, and the player sees who belongs to whom.
2. **Counting the knives back.** The end of every day below.
3. **Heads.** Soot turn to look at whoever speaks. The Accredited keep their eyes front. A crowd rule, no new art.
4. **The kneel at the bell.** Porters on the Spire, the tier at Lift Zero: the same kneel, and the day nobody does it.
5. **Kael's hand to the washer** before ELEVEN (it is in the comic levels; not in the arena or 2D).
6. **Humming sway** in a row of people at a commitment.
7. **Brand grounding the halberd**; Hollis doing the same on the Stair.
8. **Tavi on Seren's left, then on Kael's left**: where he stands is the whole of that relationship.

## 8. Cutscenes, graded
| Scene | Writing | Art | My view | What I would like to see |
|---|---|---|---|---|
| Opening film | A− | B− | The eleven seconds work; the figures are posed dolls | The furnace seconds as drawn stills |
| Prologue: festival, wedding, fever | B+ | B | Warm, a little long before anything is at stake | Cut two exchanges; let the walkable memories carry the warmth |
| Audit, furnace, the count, the tin | A | B+ | The best thing in the game | Leave it alone |
| The Table (the Gilding) | A− | B+ | The comic stills suit it | Sound: it is nearly silent |
| The lesson with the slate | A | B | Does a lot in two minutes | — |
| What the Assay is (the map) | B | B− | Useful, flat | Fold it into the Camp so you learn it by walking |
| Fight films (Pairing, Ford, Standard, Proctor, Keep, Pinning) | B | C+ | Captions good; pictures are fighters standing in a field | Three comic-style stills each in place of posed 3D |
| First Fire: ceremony and the sun on the square | A− | B | The lantern pays off the whole day | — |
| The Ledger (Lift Zero, the window) | A− | B− | "The sky is blue" lands | A real picture of the window |
| The Way Out | B+ | C+ | Borrowed rooms | Its own tunnel picture; the tin going to Row K |
| Part Two chapters 1 to 4 | B+ | C+ | Good scenes on reused pictures; Kael in the wrong clothes | A picture per chapter; the clerk's coat |
| Celestine's last room | A | B− | The line about the successor is the second-best thing in the game | Her at the valve, drawn |
| The endings | A− | C+ | Told, not shown | A Table-style sequence of pictures |
| Comic-level pages and memory cut-ins | B+ | B | Consistent | Check layouts on a phone |
| The 2.5D memories | B+ | B | Cheap and they work | More of them |
| **Overall** | **A−** | **B−** | The words are ahead of the pictures everywhere | Spend on pictures and movement, not on more words |

## 9. The game, graded, with cost
| Part | Grade | To raise it | Cost |
|---|---|---|---|
| Story and writing | A− | A read-through for pacing | Low |
| Time and structure | B+ (was C) | Done in v0.64 and v0.65 | — |
| Below: Ashgate, First Fire, Row K, memories | B+ | More places and finds; the knife board | Low each |
| Stealth (heist, lantern) | B | Your notes | Low |
| 2D fights below | B− | Re-fight the Ember Ring and the Drill; a scene for losing | Low |
| Arena fights | B− | Real animation; thin the group fights | Medium |
| Comic levels | C+ | Real animation; rebuild the docks | High |
| Animation | C | The free Quaternius library, converted once | Medium-high once, then low |
| 2D Assay levels | B− | Terrain | Medium |
| Part Two as play | C+ | Service stair; a barge | High each |
| Films and hand-offs | B− | A pass with pictures at each hand-off | Medium-low |
| Controls and help | C+ | One controls card; a look zone for touch | Low |
| Phone performance | Not known | You read me the frame counter | Free |
| Testing | D | You playing; the whole-story bot every release | Free / low |

**Cheapest things that help most:** the white cloak; the knife board and counting back; the head rule; hand on the pipe; one controls card; more 2.5D memories.
**Most expensive:** rebuilding the High Docks; new comic levels; converting the animation library the first time; the clerk's outfit across Part Two.

## 10. Where I would spend next
1. **25% — match the writing** (section 7): cloak, knives, clerk's coat, the leg, the eight deliberate animations. Mostly cheap, and it is what makes the story visible.
2. **30% — real animation** once the library is attached: run, jog, a death, sword combos.
3. **20% — the High Docks rebuilt.**
4. **15% — Part Two play:** the service stair first.
5. **10% — controls card, touch camera, group fights, a hand-off pass with pictures.**

## 11. Open at this point
Questions waiting on you when this report was written:
- **A new name for "the Assay"**, one that sticks.
- **Names to confirm:** Kestrel Dray, Severin Cade.
- **Celestine at the Pinning:** written here as "she knew him"; to be confirmed.
- **The boots:** he takes them on day 31 and cannot fly until the last day. Fly from the Valley on, or a line saying they have no charge.
- **The budget split** in section 10: right, or move it.
- **The animation library** (Quaternius, free): needs attaching before any of the 30% can start.
- **Your notes** from playing from the beginning to the Stair: not yet given, not yet in this report.

Everything else you have asked for and not yet had is on the open list.
