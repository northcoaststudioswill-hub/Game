# Guttercrown: next work

Status of this note: **planning only.** Nothing in this file has been built yet. It records what was decided in conversation, what is still open, and the order to build it in. Current game state is in `README.md`; the story bible is in `docs/LORE.md`.

Last pushed build: see `git log` on `claude/wonderful-euler-4hchee`.

---

## 1. Decided

- **Fight to the death.** A lost bout is a death, not a defeat with a fee.
- **Revival by the Oracle of Time.** Death is not the end. **David Roseinbeirg**, a wizard, wills the fighter back and sends them forward. His goal for you is the realm itself: taking it from the bottom of the pit to the top.
- **Roseinbeirg's prejudice.** He hates every race except the one you pick. He sees through you whatever your class or race (elf druid, dwarf fighter, tiefling sorcerer, and so on). He is a character and a voice, not a stat.
- **New classes: Druid and Tiefling.** Druid for animal forms and companions. Tiefling for infernal animal abilities (a familiar, a beast spirit). They should give the game a set of animal abilities it does not have yet.
- **More finishers.** Current state: one mortal blow per class plus two more per class by rank (12 total). Add more and make them read as distinct.
- **Gear sets.** Armour and weapon sets that pair, with set bonuses. Not just tiers.
- **Progression work.** Needs a pass (see section 6).
- **Animation.** More than the overhead heavy: smoothing, transitions between poses, idle and anticipation poses per weapon, impact reactions, recovery and stagger. Overhead is currently the strongest visible pose; the rest should match it.
- **Controller must work.** It has not been tested on hardware. Test before calling any feature done (section 7).

## 2. The death and revival loop (to design)

Questions to settle first, then build:

1. **Revival cost.** Options: lose coin (a fraction of purse), lose respect (a fraction of current rank progress), lose a gear piece (not the set), or lose nothing but time. Recommendation: lose coin and some respect, never gear or the Ledger record.
2. **What survives a death.** Recommended: the fighter's level and rank stay, but the body is new. Gear, kit and mastery stay with the fighter. Cosmetics stay. (This is the closest to what was said; confirm.)
3. **Roseinbeirg's contract.** Does the Oracle charge a higher price for each revival, or give a free one after a gap? A "soul debt" that rises per death is a good tension mechanic.
4. **Yield.** Still a question: does yielding at low health avoid death at a cost, or does death only happen when the fight is lost? Simplest: knockout is death; a yield costs coin and streak but keeps the fighter.
5. **Where he appears.** Scene at the first death, then a permanent presence at the Long Stair or a shrine in the market. He speaks differently to each race.

## 3. Roseinbeirg, the Oracle of Time (character brief)

- Ageless wizard, speaks in time metaphors, never answers a question directly.
- Hates other races, openly. His contempt is a running joke until it stops being funny (lean into it lightly; the game is dark and funny, not cruel to real groups).
- Sees the fighter's worth regardless of class or race. Says so.
- His race is the one you picked, and he is the only figure in the game who treats it as a point of pride. Possibly a gameplay effect: a small bonus while fighting your own race, and rivals cost more at his shrine.
- His goal line: "from the bottom to the top." Every death is a step. Use this as the spine of the revival dialogue and the codex.
- Needs: portrait (wizard, long coat, hourglass), a short intro scene, 6 to 8 revival lines per race, and a codex entry.

## 4. Druids and Tieflings

**Druid** (new class)
- Primary stat: Wisdom. Resource: a nature pool that refills in the open (the pit or the market).
- Basic attack: a claw or staff, with animal-shift options.
- Technique ideas: Wolf Stride (fast dash, bite), Bear Stance (heavy, high posture, slow), Hawk Dive (aerial leap-slam), Thorn Wall (trap), Animal Companion (summoned pet that fights beside you for a short time).
- Subclasses: Circle of the Moon (shapes), Circle of the Grove (traps and roots).

**Tiefling** (race, with class-agnostic animal abilities)
- Gets an infernal beast spirit: a hellhound, a cat, or a crow. Gives one active ability per fighter.
- Fire resistance is already partly in the Sorcerer kit; keep the tiefling identity as the animal tie-in, not just a stat bonus.
- Roseinbeirg dislikes tieflings more than most. Make his lines about it.

**Balance rule for animals:** a summoned or shifted form should never be a free second fighter. It takes stamina or nature pool, lasts a few seconds, and ends with a clear recovery.

## 5. Finishers, gear sets, animation

**Finishers** (target: about 4 per class, each with its own move and camera)
- Current: Headsman's Verdict, Through the Wall, Earthbreaker (fighter); Death of a Thousand Cuts, The Quiet Word, Rain of Knives (rogue); Disintegrate, Meteor Swarm, Chain Lightning (sorcerer); Flame Strike, Banishing Smite, Power Word Kill (cleric).
- Add: at least one for druid, one for each tiefling animal, and one more per existing class.
- Each finisher needs a readable pose, a camera beat and a sound. The set is what makes the mortal blow feel earned.

**Gear sets**
- Sets of 3 pieces (weapon, armour, one accessory). Full set gives a bonus that changes how you fight, not just a stat bump.
- Examples to start: *Pit Scavenger* (speed, parry window), *Warden's Watch* (posture, damage taken), *Lampwright's Set* (fire, light radius), *Sunless Vigil* (healing, regen).
- Sets are chosen from the Outfitter and Armoury, and some drop from deeds.

**Animation** (the largest feel change)
- Idle breathing and weight shift per class; anticipation pose before each basic.
- Smooth transitions between poses (currently poses snap at some joints).
- Impact reactions: flinch on light hits, stagger on heavy, knockdown on finisher.
- Recovery frames: the fighter should visibly reset after a big swing.
- Per-weapon idle stances (spear low, axe high, rapier light).

## 6. Progression work

Current issues to fix before adding content:
- The early curve is slow to reward. Levels 1 to 3 need to arrive faster.
- Coin has few meaningful sinks until mid-game. Each rank should open one.
- Revival needs a progression rule too: a fighter who dies should feel like they keep most of the climb, not that the game reset.
- The endless Ledger (challengers past the crown) needs a difficulty ramp check.

Earlier ideas kept for later (from the retirement discussion, not active):
- Gate access by respect and level, not all at once.
- Codex entries that unlock when a system is first used.

## 7. Controller checklist (before any feature is "done")

Current mapping (standard layout, from `js/main.js`):
- Left stick: move; right stick: aim.
- A: dodge (menu: confirm). B: ultimate (menu: back).
- X or RT (button 2 / 7): strike. Hold for heavy.
- LT (button 6): parry on press, block on hold.
- LB, RB, Y: abilities (Q, E, R). D-pad up: potion. D-pad left: call the Second.
- Start / Menu: pause.

Things to verify on hardware:
- [ ] Heavy blow: hold strike, release, and confirm the charge ring and "HEAVY READY" show.
- [ ] Parry-then-block: press LT for the window, then hold LT past it, and confirm the guard holds and costs stamina.
- [ ] Menus: D-pad moves, A confirms, B backs out, nothing stays stuck open.
- [ ] Market walk: left stick walks and stops cleanly at a spot; A opens it.
- [ ] Ledger and Armoury lists scroll with the stick.
- [ ] Cutscenes: A advances, B skips.
- [ ] Controller disconnect and reconnect mid-fight pauses and resumes.
- [ ] D-pad left is used for both "call the Second" (fight) and menu navigation; confirm they never collide.

Note: LT does two jobs (parry and block). That is intended, but test it on a real pad first; a short press must not accidentally hold the block.

## 8. Known issues to check

- Balance drifted after the last rounds. The bot clears the ladder in 5 to 11 bouts per class, and Sorcerer versus Vexa is still the hardest matchup. Re-check after any change to death or revival.
- The tap, hold and block inputs feel are only tested by script. Playtest on keyboard and controller.
- Gear sets and the new classes will change the balance tables; re-run the four-class balance bot and the matchup test after each.
- The fight-to-death rule itself is not yet implemented: current losses still cost a fifth of purse and do not kill the fighter. This is the first build item.

## 9. Build order

1. **Death and revival** (section 2), with the Oracle scene and Roseinbeirg's dialogue hooks (section 3).
2. **Progression pass** (section 6): faster early levels, coin sinks, revival keeps the climb.
3. **Druid and Tiefling** (section 4), with their first two abilities each.
4. **Gear sets** (section 5), starting with three sets.
5. **Finishers**, filling each class to four.
6. **Animation pass** (section 5), starting with idle, anticipation and impact reactions.
7. **Controller pass** (section 7) on hardware, before calling any of the above done.
8. **Balance pass** (section 8) and the playtest.

## 10. Open questions for you

1. Revival cost: coin, respect, gear, or only time?
2. Does the fighter keep level, gear and mastery across a death, or only the class and name?
3. Does Roseinbeirg's price rise per revival, or is revival free after a gap?
4. Does yielding exist, or is every knockout a death?
5. Should his race prejudice affect the game mechanically (price and bonus), or only his dialogue?
6. Druid: are the animal forms separate abilities, or one shapeshift state that changes all moves?
