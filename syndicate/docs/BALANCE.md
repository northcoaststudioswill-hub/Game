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

## After the first controller playtest

Report: too easy; early bouts won in seconds by mashing, without being hit.

- Every opponent now has a guard and a parry chance (early fighters had neither), and answers three quick strikes in a row by raising a guard.
- Opponents react about 18% faster and press more.
- Named fighters: health multipliers 1.4 / 1.32 / 1.3 / 1.28 / 1.16 and damage 1.22 / 1.3 / 1.34 / 1.34 / 1.2 over their base. Undercard fighters scale from those.
- In simulation a first undercard bout now takes the bot 14 to 27 seconds (it was about 12, and a couple of seconds by hand). Melee classes still win most bouts with half their health or more; casters lose some early bouts, so Sorcerers and Warlocks start with a second potion.

## The gear race

Request: a fighter who never upgrades should lose to opponents who did, without the game becoming unfair to one who keeps pace.

- The Fence now sells **five grades** of steel and of armour (110, 240, 380, 600, 900 coin each). Steel: +2/+4/+5/+6/+7 weapon damage and +6% all damage per grade. Armour: 8/15/22/28/34% less damage taken.
- **Opponents carry gear for their place on the Ledger**: undercard tiers grades 0 to 4, the five names grades 1 to 5, challengers and the Long Stair grade 5.
- The named fighters' flat health and damage multipliers were cut to make room: health 1.34/1.24/1.2/1.14/1.0, damage 1.12/1.16/1.16/1.12/1.0.
- Simulated against the five names (even gear / one grade behind / never upgraded), win rates by the bot: Sister Maul 60-100 / 20-100 / 100; Kessa 100 / 100 / 80-100; Brakk 80-100 / 80-100 / 0-100; Vexa 40-80 / 20-60 / 0.
- The card before a bout shows their steel and armour against yours, and the line at the top warns when you are two grades behind.
