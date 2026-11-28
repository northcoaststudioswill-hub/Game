# Rootdeep 64 — playtest findings (all four reviewers, merged)

Four reviewers each played about 50 minutes on a fresh save knowing nothing, wrote a magazine review,
then read the code and traced every finding to a file and line. This list merges their findings (about
250 raw entries) into one, with duplicates combined. Nothing here has been fixed.

| Reviewer | Plays | Score | Got to |
| --- | --- | --- | --- |
| Dana — casual, never played a roguelite | phone, touch | 2.8 / 5 | chamber 3 (16 runs) |
| Rico — mid-skill action player | controller + keys | 7.0 / 10 | chamber 8, beat the Grub Mother 4× |
| Vex — hardcore roguelite veteran | keyboard | 3.0 / 5 | chamber 3 solo; chamber 8 driving two keepers |
| Mo — couch co-op, 1–4 players | 4 controllers + keys | 66% | chamber 4, 8 wipes |

Sound was not judged: the test browser had no audio.

**Reading the list**
- **Who** — D Dana, R Rico, V Vex, M Mo. More letters = found independently by more people.
- **From** — `cart` the behaviour is the original cartridge's (porting it "exactly" carried it over);
  `port` introduced when turning it into Rootdeep 64 (co-op, 3D, touch); `new` from the moves or story
  updates.
- File references are in `rootdeep64/src/`. Each reviewer's own file (`*-findings-code.md`) has the full
  detail and screenshots.

---

## 1. Broken — stops play or does the wrong thing

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 1 | Any device, even one nobody joined with, drives every menu and can spend the shared Moondew. | M | port | input.js:68-70; game.js:285-321 |
| 2 | Honey can't be gifted while that NPC has a story beat waiting (START is ignored in story talk), so the gift-based unlock (Erin) stalls and everyone plays Will. | M D | new | game.js talkUpdate; ui.js:80-84 |
| 3 | Pillars and crates can spawn in front of a reward door with no way round. | R D M | cart | game.js:129-131, 169 |
| 4 | Solo: touching a reward door takes it instantly, so fighting near the top wall picks one by accident. | D V | cart | game.js:602-604 |
| 5 | Portrait on a phone shrinks the game to a square, clips the title and crops the room. | D | port | engine.js:158; ui.js:242 |
| 6 | Mashing attack blows straight through the death screen (A is attack and confirm; only a 0.8 s lock). | R D M | cart | game.js:654 |
| 7 | Sprout Ledger can't send two of the same sprout when it's the only type in the party. | D | cart | game.js:344 |
| 8 | An unplugged controller leaves a ghost player with a stuck stick that never drops. | M | port | input.js:56; game.js:232 |
| 9 | Two players pressing on the same frame: the second press undoes the first (Codex opened and closed). | M | port | game.js:263-302 |
| 10 | A super pressed while someone else's super is freezing the room is silently lost. | R M | new | moves.js:49; game.js:521 |

## 2. Difficulty & balance

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 11 | **Solo wall at chamber 2–3.** Enemies hit you within ~2 s of entering; second waves can spawn on top of you; no spawn-safe radius; foes +30% HP per chamber. Neither Dana (16 runs) nor Vex (6 solo runs) got past chamber 3. | D V R | cart | game.js:134, 155, 477, 599 |
| 12 | Touching an enemy hurts with no warning; the foe's 0.85 s hit cooldown outlasts your 0.55 s invulnerability, so you get hit again. Contact damage grows with depth (Drowned King ~24). | R V | cart | game.js:460-461, 398 |
| 13 | Moondew comes too slowly: ~0.5 per kill, a boss pays 40, the Mirror costs 624 to fill — and most of it comes from bosses a struggling player can't reach. Mirror ranks feel weak. | V D | cart | game.js:173, 389; data.js:57-65 |
| 14 | No difficulty option. | D R | cart | ui.js:136 |
| 15 | Boons arrive late: only 2 of 9 door kinds are boons and the guaranteed one comes after chamber 3. | V | cart | game.js:166-168 |
| 16 | No warning before a boss; the doors before a boss chamber don't hint at it. | R | cart | game.js:148, 166 |
| 17 | Late foes outscale the player (×4.3 HP vs ~×2.7 damage by the Core). | V | cart | game.js:134 |
| 18 | Heavy attack is the best attack in the game (~71 DPS vs ~50, roots, ignores shields); tapping and holding it trivialises single targets. | V | new | moves.js:71, 100-102 |
| 19 | Selfie Flash is too strong: roots the whole room 1.9 s and wipes enemy shots on a 7 s cooldown. | V | new | moves.js:43-46 |
| 20 | One person driving two keepers gets unlimited revives (stand on your other keeper), and every new chamber stands downed keepers back up. | V M | port | game.js:526-528, 133 |
| 21 | Super meter fills faster from damage taken than dealt. | V | new | game.js:369, 398 |
| 22 | Death Defiance, Phoenix Bloom and Old Collar only fire on a full party wipe, so in co-op they rarely matter. | V M | port | game.js:403-406 |
| 23 | Every hit has a 30% chance to lose a sprout for good, and the ones you take in are removed from your bank up front. | R D | cart | game.js:127, 399 |
| 24 | Elites only get more HP and size, not new behaviour or damage. | R | cart | game.js:136 |
| 25 | Abandoning a run banks like a death but doesn't count toward Marcus's "8 deaths" unlock. | V | cart | game.js:200 |
| 26 | Smaller balance notes: Open Hand only turns commons into epics; Fortune Edge crit is flat at every rarity; Ember burn doesn't stack; a duo can be offered from any god's door; taking another god's core boon silently overwrites your levels; Petal Purse is always profit; Honey is near worthless after the first keepsake; Thornbow (8 dmg, no pierce) is weak; dash boon value means something different per god. | V R D | cart | game.js:76-109, 193, 374, 422-428; data.js:56 |
| 27 | "Elite doors" in Ranger's line and errand r1's name — there's no such door. | V | cart + new | data.js:76; story.js:80 |

## 3. Can't see what's happening

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 28 | **Your keeper blinks invisible** whenever invulnerable — after every hit, 1.4 s after a super, 2 s after Death Defiance. Biggest readability complaint. | R D M | cart + new | models.js:265; moves.js:50 |
| 29 | Keepers vanish behind walls and blocks; no outline or fade. | R V M | port | models.js:239-244, 325 |
| 30 | Enemy shots are salmon-pink orbs that look like pickups. | R | port | models.js:371 |
| 31 | Getting hit gives almost no feedback (no number, weak flash). | D | cart | game.js:394-398 |
| 32 | Text piles up: damage numbers, barks, area titles, elite banner and boss subtitles stack on each other and on the fight; boss subtitle sits over the spawn point. | D R V M | port + new | ui.js:106-126; game.js:371, 415 |
| 33 | The control hint covers the first room for 7 s. | D R M | port | ui.js:118 |
| 34 | A shielded Bubble Crab takes 35% damage with nothing on screen saying so. | R | cart | game.js:366 |
| 35 | No "enemies left" indicator; shooters back off out of view. | D | cart | game.js:468, 597 |
| 36 | Solo camera only frames about half the arena (Mo found 2-player framing roomy). | D | port | models.js:236 |
| 37 | Sprout buds that shoot look like the friendly sprouts. | M | port | models.js |
| 38 | Death screen shows the title scene, not where you died. | R | port | models.js:414 |

## 4. Not taught / wrong or confusing text

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 39 | Dash Strike and Heavy are only explained on the pause screen. | R | new | ui.js:118-119 |
| 40 | Boon card text is wrong: passive cards ignore rarity and level (says +25, gives +36); dash boons say "Cast +14%"; a duo puts the wrong god's name in the header; the Build screen shows the Mirror multiplier, not boons. | R V D | cart | game.js:86-87, 97-103; ui.js:180, 195 |
| 41 | "DEW" labels both the DEW god's boon door and the Moondew door; door labels don't say what you get (e.g. how much the Fountain heals). | D R V M | cart | ui.js:102 |
| 42 | The first press on the boon and echo screens is eaten by an invisible 0.35 / 0.5 s lock. | R D M | port + new | game.js:309; story.js:196 |
| 43 | Stats disagree: Codex "chambers" counts cleared rooms, the death screen counts reached; "boons discovered" counts boons offered; KEYS means banked keys in the Hearth but this run's keys on pause. | D M | cart | ui.js:69, 150, 199, 260 |
| 44 | "Gods" and Honey are never explained. | D R | cart | — |
| 45 | Will's combo finisher pops "SELFIE!", easily confused with his Selfie Flash special. | D | cart + new | game.js:415 |
| 46 | Typos / text nits: "A ROOT-TOOTHS STALL"; "talk to them"; Erin's "Three times" is hard-coded; "A: BYE · B: BYE"; "B: SKIP" on a one-page talk; Mirror description missing a full stop; Escape goes to the menu with no confirm. | D R | cart + new | ui.js:81-84, 140, 168, 188; story.js:111 |
| 47 | Settings are only music, SFX and shake. | R V | cart | ui.js:136 |

## 5. Screen clutter / layout

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 48 | Keeper select text blocks collide (960×540 and phone). | D R | port | ui.js:226-238 |
| 49 | The NEW MISSION banner covers the Hearth station labels; NPC name tags overlap; the "A: ACCEPT" line overlaps the chamber label; the join footer overlaps DESCEND. | D M | port + new | ui.js:60-75, 117, 187 |
| 50 | P1 / P2 tags overlap when keepers stand together; downed keepers show "STAND HERE" instead of their tag. | R M | port | ui.js:107 |

## 6. Phone / touch

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 51 | Menus can't be tapped. | D | port | input.js:25-36 |
| 52 | The START pill is small and covers every screen's title; touch has no Select, so the Hearth menu can't be opened. | D | port | shell.html:37; game.js:247 |
| 53 | Tapping START during a conversation gives away Honey without asking. | D | cart | game.js:280-282 |
| 54 | Pause screen and Hearth footer show controller / keyboard hints ("( , ON KEYS)") to touch players. | D R | port | ui.js:73, 200-201 |
| 55 | Holding the stick as a boon screen opens scrolls the cursor. | D | port | input.js:65-68 |
| 56 | On-screen buttons cover the arena's corners. | D | port | shell.html:24-37 |

## 7. The Hearth

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 57 | **Louie (who follows you) and nearby NPCs steal the A prompt** from stations; the reach is a tight 17 units. | D R M | cart | game.js:224, 240-246, 254 |
| 58 | NPCs walk through keepers. | M | cart | game.js:250-261 |
| 59 | Mirror purchases have no confirm; the locked Heat station is still interactable. | M | cart | game.js:286, 302 |
| 60 | Fresh save: all five NPCs show a `!` at once. | (me) | new | story.js |

## 8. Controls & aim

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 61 | Melee aims at your last movement direction and casts aim 8 ways on keys, with no aim assist; Boulderfall and Sky Judgement auto-target and ignore aim. | R V | cart | game.js:361-362, 434, 440-442 |
| 62 | Super sometimes needs a second press — it fails silently when not ready or mid dash-strike. | R D | new | moves.js:49, 88-98 |
| 63 | On a controller all four shoulders/triggers dash, and double-tapping the d-pad also dashes. | R | port | input.js:61; game.js:541 |
| 64 | Dash Strike window is ~0.31 s with no input buffer. | R | new | moves.js:87 |
| 65 | Holding attack to charge slows you to 55%. | R | new | game.js:535 |

## 9. Couch co-op

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 66 | **No joining mid-run** — only in the Hearth or on keeper select. | M | port | game.js:514 |
| 67 | **Leaving is broken:** the only way out is B on keeper select; P1 can never leave; when anyone drops, everyone else's number, colour, HUD corner and saved keeper shift. | M | port | input.js:78; game.js:214-219 |
| 68 | One shared cursor on the boon screen and anyone can accept; anyone's B leaves the shop for the party; anyone can pause, abandon or quit with no confirm and no "who paused". | M | port | game.js:308-321 |
| 69 | The camera only frames standing keepers, so downed ones go off-screen; with one left standing it zooms onto them even behind a wall. | M | port | models.js:233-237, 312 |
| 70 | Keepers don't push apart, so stacked keepers merge into one figure; corner HUD panels cover keepers (no safe area). | M | port | game.js:232-239; ui.js:110 |
| 71 | One keeper talking to an NPC freezes everyone. | M | port | game.js:273 |
| 72 | Keyboard 1 loses the arrows and right Shift when keyboard 2 joins; keyboard 2 has no Select; keyboard 2's other keys are never shown. | M V | port | input.js:42-48 |
| 73 | Several devices joining on the same frame: only one gets in; no "party full" message. | M | port | input.js:75-83 |
| 74 | Hearts go to the nearest keeper, not the weakest; pods are first-come; Flower and Heart-door heals skip downed keepers. | M V | port | game.js:175, 89, 561, 588 |
| 75 | Revive: extra helpers don't speed it up, progress decays, knockback pushes the helper off; the leader can walk through a door with friends still down. | M | port | game.js:526-528 |
| 76 | Doors: one keeper still chooses for all (0.6 s hold, no meter shown). | M | port | game.js:602-604 |
| 77 | Every super zooms the camera to its caster, even mid-brawl. | M | new | models.js:234 |
| 78 | No per-player stats on the wipe screen; player HP doesn't scale with party size; a late joiner spawns at a random spot. | M | port | game.js:71, 196, 248 |

## 10. Code hygiene

| # | Finding | Who | From | Where |
| --- | --- | --- | --- | --- |
| 79 | The test hooks (`window.__rd`) ship in the build — a console cheat menu. | V | port | main.js:15-38 |
| 80 | An echo page can spawn behind a boulder (no obstacle check). | M | new | story.js:193 |
| 81 | Spitters can fire ~0.5 s into a room because their cooldown ticks during spawn-in. | R | cart | game.js:462, 470 |

---

## Reviewers' mistakes (checked and dropped)
- Selfie Flash doesn't heal — the heals were enemy heart drops (Dana's published tip is wrong).
- A beetle hit is ~12 damage, not 25–36 — that was several hits at once (Dana).
- BIG HEAL does heal every standing keeper (Mo).
- Four players isn't harder — foes per keeper go down as the party grows; co-op scaling does exist (Mo, Vex).
- Errand progress does count things done before you accepted (Vex).
- No shop HP bug; spitters kite, they don't teleport; Bolt Step doesn't redirect the dash; Root Maul doesn't lock movement (Vex, Rico).

## What all four liked
- The look: N64-style art, the Hearth, the characters' animation (all four).
- The writing — NPC and boss lines, echoes, Marcus (all four).
- Supers, especially BIKE LANE; heavy and dash feel crunchy (R V D).
- Co-op revive, joining in the Hearth, shared rewards, roomy 2-player camera (M R).
- The Drowned King's leap warning; boon and door previews (R V).
- The Hearth visibly changing as you progress (R).
- No console errors in about four hours of combined play.
