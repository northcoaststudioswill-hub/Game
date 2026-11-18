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

## 3. David Roseinbeirg, the Oracle of Time (character brief)

**Who he is.** A wizard of the Roseinbeirg family, old money and older grudges. Addicted to gold, power and status, in roughly that order. He is a bullshitter, grandiose and hateful, and also very funny and easy to like, which is what makes the player's position uncomfortable. He is not Mark. Mark is a gambler who talks in short bursts; David talks like a man reading his own memoir aloud, with a cellar full of clocks.

**His prejudice, in his own words.** He is "exactly what you'd expect" of whatever race you are not: orcs are brutes, elves are vain, dwarves are stubborn, humans breed like rats, tieflings are a bad bargain. He calls the race you picked "the only sensible ones." Keep this in the dialogue and in his voice, and always aim it at the species, never at real groups of people. The laugh should come from how confident and wrong he is.

**What he wants.** The realm. He will not take the throne himself; he needs an ally on it. He has picked you. His family plans to move into the lands once the ally rules, so the plan is to take the throne (Eerin and Vilhelm Koheneim) and then settle the Roseinbeirgs in.

**The contract.** After your first death he offers a contract. Signing it is the moment the story turns. Terms (draft):
- He revives you (the Oracle of Time, "I simply don't let the clock run out on you").
- You owe him a **debt of souls**: a price he collects in exchange for the power he gives. Mechanically: a soul-debt meter that grows with each revival and each favour he asks.
- In return he gives you the power to usurp the king one day.

**The expeditions (short term, the money engine).** To pay the debt and fund the family, you send out expeditions:
- **Rare wizard gold** from raided caravans and vaults.
- **Captives** taken from outlying villages and tribes. Write these as prisoners taken and sold or ransomed; keep it clearly villainous and non-sexual. Do not frame it as abuse.
- **Harassed tribes and burned villages.** Each raid lowers the local folk's standing with you and raises the Seal-Wardens' attention.

Design notes for expeditions (not yet decided):
- **Time or turns?** A real-time timer (come back later) suits the endless ladder; a turn-based menu is simpler to test.
- **Underlings, not the fighter.** The fighter is in the pit. Expeditions use the Tally crew, which is already in the game.
- **Consequences that feed back:** Highmarch heat, the Wardens' inspections at the Long Stair, the Guild's tithe, and villagers who might send a challenger to the pit to settle a grudge (new challengers for the Ledger).
- **Moral weight:** the game lets the player do this. Decide whether the raids affect the endings and whether there is a way to refuse David (the contract says no after the first death; a refusal means staying dead).

**He only shares his plan with you.** The full plan is revealed in pieces through deaths, ranks and signing, so the player learns what the family wants at the same pace David trusts them. Keep each reveal a little worse than the last.

**Race effect (to decide).** Two options:
- Dialogue only: he insults other races; the player's race is praised.
- Light mechanic: fighting your own race gives a small bonus, and rivals of other races cost more at his shrine. Keep it small and make it a joke he is proud of.

**Voice guide.** Theatrical, self-important, quick with insults and compliments in the same breath. Uses the word "darling" for the player only. Never explains a joke. Gets quiet, once, when money is not mentioned.

**Assets needed.** Portrait (long coat, hourglass, too many rings), a short intro scene, the contract scene, 6 to 8 revival lines per race, expedition result lines (about 20), and a codex entry that unlocks as his plan is revealed.

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

7. Expeditions: real-time timers or a turn-based menu?
8. Do raids change the endings, and can the player refuse David at all?
9. Race effect: dialogue only, or a small mechanic too?

1. Revival cost: coin, respect, gear, or only time?
2. Does the fighter keep level, gear and mastery across a death, or only the class and name?
3. Does Roseinbeirg's price rise per revival, or is revival free after a gap?
4. Does yielding exist, or is every knockout a death?
5. Should his race prejudice affect the game mechanically (price and bonus), or only his dialogue?
6. Druid: are the animal forms separate abilities, or one shapeshift state that changes all moves?
