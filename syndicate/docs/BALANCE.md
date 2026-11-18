# Guttercrown: balance notes

How the numbers were checked, what was found, and what changed. The simulator is a script that plays bouts with the game's own AI at the controls (`G.debugAuto`), so it measures how the *bot* does, not how a person does. Treat win rates as relative, not absolute.

## Method

- **Weapons** were compared on paper from their real values: average damage x power, divided by wind-up plus recovery, with resource cost against resource gained on a hit.
- **Classes** fought each named fighter at the level a player is expected to reach them (1, 3, 5, 7, 8), six to eight bouts each, with middling gear and no tonics, meals or scouting.
- **Level-up choices** (the level 2 technique, the subclass, the feat) were each run against the same opponent to see whether one option was simply better.

## Findings and changes

| Finding | Change |
|---|---|
| Vexa beat an averagely built level 8 fighter 80 to 100% of the time | Vexa's health and damage multipliers cut. A properly built level 8 now wins 13 to 88% by class, about half overall |
| Sorcerer and Warlock lost to Brakk (17 to 67%) where every melee class won | Caster basic attacks hit about 14% harder; Sorcerer and Warlock have a larger hit die. Brakk's damage eased slightly |
| Druid's own weapons out-damaged every other melee class at longer reach, before counting shapes | Druid weapon power reduced; the shapes remain the damage option |
| Cleric's Mace was the weakest basic attack in the game | Mace 1d6 to 1d8, Penitent's Flail 1d8 to 1d10 |
| Rogue's Gutter Pike had the best damage and the best reach | 1d8 to 1d6 |
| Warhammer was slowest and weakest per second | 1d10 to 1d12 |
| Warlock's Eldritch Blast out-damaged Fire Bolt before Hex's +25% | 1d10 to 1d8; Grave Chill and the Rod to 1d6 |
| Level 2 picks, subclasses and feats within a melee class | Within a few points of each other; no change |

## Still uneven

- Druid is the weakest class against Vexa (13% in the last run); Rogue the strongest (88%).
- The bot plays ranged classes worse than melee, so caster numbers may understate them in human hands.
- Set bonuses, charms, tonics and the Frenzy were not part of these runs.
