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

---

# Fix log

Numbers match the list above. "Changes the cartridge" marks fixes that alter Rootdeep v2.9's own rules or numbers.
Checked by `node test/fixes.js` (29 checks) plus the existing play, moves and story suites, and by screenshots.

## Fixed
| # | What changed |
| --- | --- |
| 1, 9, 68 | Every menu belongs to the player who opened it (station, NPC, door, echo, pause). Devices that haven't joined can't touch menus. In co-op the screen says "P2 IS CHOOSING" / "P2 PAUSED", and button names follow that player's device. |
| 2 | Honey can be gifted in every conversation, story beats included. START asks first, START again gives (also fixes 53). |
| 3, 80 | Obstacles never spawn in front of the reward doors (checked over 300 rooms); echoes never land behind one. |
| 4 | A door takes a short stand in the doorway (0.28 s solo, 0.6 s co-op) with a fill bar in the chooser's colour. *Changes the cartridge.* |
| 5 | Portrait: the picture is taller, the title scales to fit, hints and banners wrap. |
| 6 | Death and escape screens hold 1.3 s; the A prompt appears when they're ready. |
| 7 | Sprout Ledger can send two or three of the same sprout. |
| 8 | An unplugged controller lets go of every input; in the Hearth its seat is freed. |
| 10, 62 | A super pressed during another super, or mid dash strike, fires right after. Pressing it early shows "SUPER 40%". |
| 11 | Foes spawn at least ~80 units from every keeper (both waves) and take 0.9 s to rise before acting. *Changes the cartridge.* |
| 12 | A contact hit buys 0.85 s of safety; boss bodies hit for 70%. *Changes the cartridge.* |
| 13 | A death banks +2 Moondew per chamber cleared, shown on the death screen. *Changes the cartridge.* |
| 14 | New setting KEEPER'S GRACE: half damage taken, one extra revive per run. Off by default. |
| 15 | Chamber 1 always offers a boon door. *Changes the cartridge.* |
| 16 | Before each boss (chambers 3, 7, 11) the doors are a boon and a Fountain, both marked BOSS AHEAD. *Changes the cartridge.* |
| 18 | Heavy damage ×2.4 → ×1.8 of the best light hit, recovery ×1.25 → ×1.9. |
| 19 | Selfie Flash: radius 82 → 66, stun 1.9 → 1.1 s (bosses 0.5), cooldown 7 → 9 s. |
| 20, 75 | Each time a keeper goes down in a run, getting back up takes longer (1.8 s, +0.9 s per fall). Two helpers revive faster, progress drains slower when you step off, helpers barely get knocked back, and doors stay shut while anyone is down ("REVIVE YOUR FRIENDS FIRST"). |
| 21 | Super meter from damage taken 0.9 → 0.4 per point. |
| 22 | Death Defiance, Phoenix Bloom and Old Collar now save any keeper who would go down, not only the last one standing. |
| 23 | A bud knocked loose runs off as a pod nearby you can grab again, instead of being lost ("PEB RAN OFF - GRAB IT!"). *Changes the cartridge.* |
| 27 | Ranger's errand renamed THREE, SEVEN, TEN (his own line about elite doors is the cartridge's and stays). |
| 28 | Keepers no longer blink out when invulnerable; they pulse with a light flash instead. |
| 29 | A ghost in the player's colour shows wherever a wall, block, foe or effect covers a keeper. Obstacles are also lower (8–14 instead of 13–22). |
| 30 | Enemy shots are dark spiked red shells with a red glow and trail; nothing like the pink pickups. |
| 31 | Damage taken shows as a red number on the keeper, and the screen edge flashes (red solo, the player's colour in co-op). |
| 32 | Floating numbers stack instead of overprinting; boss and keeper lines moved to the top, under the boss bar; banners move clear of the area title. |
| 33, 39 | The first-room control card sits low, shows on your first three runs, wraps to the screen, and teaches the heavy and the dash strike. |
| 34 | Hitting a shielded crab says "SHIELDED - HOLD ATTACK" (heavies break through). |
| 35 | The chamber line counts foes left ("FOES 3 + MORE"), and when three or fewer remain, arrows point to any off screen. |
| 36 | Solo camera shows more of the room; with 3–4 players it keeps clear of the corner panels. |
| 38 | The death screen shows the room you fell in. |
| 40 | Boon cards show the real numbers (rarity and level included); dash boons say what they do instead of "Cast +14%. Dash power 14"; a boon that would replace one you have says so; the god's name in the header is the door's god; the Build page shows attack and cast multipliers. |
| 41 | Doors read DEW BOON / MOONDEW / SUNFRUIT / +25 MAX HP / HEAL 35% / SHOP / HONEY / PETALS; the currency is MOONDEW everywhere. |
| 42 | The boon screen's lock is 0.25 s and its prompt only appears when it can be pressed; echoes 0.3 s with the prompt shown when ready. |
| 43 | Codex "CHAMBERS CLEARED", death screen "REACHED CHAMBER", "DIFFERENT BOONS OFFERED", pause "KEYS THIS RUN". |
| 44 | Picking up Honey the first time says it's a gift for someone at the Hearth; boon doors say BOON. |
| 46 | "A ROOT-TOOTH'S STALL"; "talk to him / to ERIN"; Erin no longer counts "three"; talk prompts no longer say BYE twice or offer SKIP on the last page; Mirror text punctuation. |
| 48 | Keeper select keeps each keeper's text in their own column, stops above the footer, and the solo camera sits back so the name shows. |
| 49 | Hearth messages sit over the floor, wrap to fit, and no longer cover the station names; the join line moved to the top right. |
| 50 | Downed keepers show "P2 - STAND HERE" in their colour. |
| 51 | Menus can be tapped: tap a row to pick it, tap again to choose; tapping talk, notes, intro and end screens moves on. |
| 52 | START moved to the right edge under the purse; on touch, START in the Hearth opens the menu. |
| 54 | Pause, Hearth and keeper-select hints match the device (touch, pad, keyboard 1 or 2). |
| 55 | A menu that opens while a direction is held doesn't scroll until you let go. |
| 56 | On-screen buttons are slightly smaller and more see-through. |
| 57 | The A prompt prefers what you face and stations over people; Louie only counts when you're on top of him; reach is a little longer. |
| 58 | NPCs step around keepers. |
| 59 | Mirror purchases ask once ("Z AGAIN: BUY FOR 22 MOONDEW"); the sealed Heat gate just says how to open it. |
| 60 | A fresh save only has Erin waiting; the others have errands after your first trip down. |
| 61 | New setting AIM HELP (on by default): attacks and casts lean toward a foe near where you aim; Boulderfall and Sky Judgement prefer foes in front of you. |
| 63 | Double-tap dash is keyboard only (pads and touch have a dash button). |
| 66 | Players can drop in mid-run; they land beside the party. |
| 67 | Seats are fixed: leaving no longer renumbers, recolours or moves anyone. Leave by holding B in the Hearth, B on keeper select, or LEAVE THE PARTY on the pause menu; anyone can leave as long as one player stays. |
| 69 | The camera frames every keeper, downed ones included. |
| 70 | Keepers push apart instead of merging. |
| 71 | One player talking to an NPC doesn't freeze the others. |
| 72 | A keyboard-2 player is told their keys when they join; the Hearth explains `,` for a second keyboard. |
| 73 | Several devices can join on the same frame; a fifth is told PARTY FULL. |
| 74 | Heart pickups mend whichever standing keeper is hurt worst. |
| 76 | The door fill bar shows who is choosing. |
| 77 | Supers don't zoom the camera in co-op (the banner still plays). |
| 78 | The wipe screen lists each player's kills and falls; late joiners land beside the party. |
| 79 | Test hooks only exist in automated browsers. |
| 81 | Foes don't count down their attack while still rising. |

## Not changed (and why)
| # | Why |
| --- | --- |
| 17 | Late-game scaling needs real tuning with human play; the early wall (the bigger problem) is addressed above. |
| 24 | New elite behaviours are new design, not a fix. |
| 25 | Abandoning a run isn't a death; counting it would change Marcus's unlock. |
| 26 | The remaining small balance notes are the cartridge's numbers (Open Hand, Fortune Edge, burn stacking, duos from any door, Petal Purse, Honey's value, Thornbow, per-god dash values). Only the silent boon overwrite was fixed (40). |
| 37 | Sprout buds that shoot keep their look; changing them is an art decision. |
| 45 | SELFIE FLASH is canon for both Will's combo finisher (cartridge) and his special (the fighter); both names stay. |
| 47 | Two settings added (14, 61); no key rebinding yet. |
| 64, 65 | The dash-strike window and charge slowdown play as intended in testing. |
| — | All four shoulders/triggers still dash on a pad (no other use for them yet). Max health doesn't scale with party size. |
