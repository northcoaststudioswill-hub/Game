# GOT NEXT — design notes

How the builder, the buffs and the rewards are put together, why, and where they can go next.
Every number below lives in `src/data.js` (tables) or `src/ball.js` (formulas) and is a first guess, not a tested balance.

## 1. The loop

```
build a player → walk The Block → take a game in The Pit → VC + Respect + badge XP
      ↑                                                              ↓
  crib buffs ← crib upgrades ← shops (drip, animations, attributes, badges, boosts)
```

Two currencies with different jobs, so that neither can be skipped:

- **VC** is spent. Attributes, drip, animations, crib, boosts, and the fiends.
- **Respect** is never spent. It sets your rank, and rank is what the shops and the tougher courts check.

So money alone cannot buy the top shelf, and winning alone does not dress you.

## 2. The builder

The aim is the feeling of a deep builder: choices that close doors as well as open them.

**Three layers set the ceiling of each of the 19 attributes ("caps"):**

| Layer | What it is | Effect |
|---|---|---|
| Playstyle (the class) | Sniper, Slasher, Floor General, Lockdown, Glass Eater, Showman | A full table of base caps. This is the big choice. |
| Body | Height 5'7" to 7'3", weight, wingspan | Each one pushes every cap up or down (`BODY_MOD`). |
| Origin (the background) | Mall Rat, Lab-Grown, Rust Belt Kid, Orbital Transfer, Ex-Mascot, Nepo Baby | One small perk: shop prices, Respect, Bravado, a few cap points, starting VC. |

Body trade-offs follow how real park builds are argued about:

- **Height** buys block, rebound, interior defense, close shot and strength; it costs speed, burst, handles and the deep ball.
- **Weight** buys strength and inside presence; it costs speed, burst, vertical and stamina.
- **Wingspan** buys steals, blocks, rebounds and dunks; it costs shooting. This is the one that hurts to choose.

You start at 60% of each cap and buy the rest with VC. The price of a point climbs steeply
(`attrCost`: about 6 VC at 30, 36 at 60, 150 at 90), so the last ten points of a build are a long-term goal.
Overall rating is the average of your best twelve attributes, so a specialist is not punished for a dump stat.

**The 19 attributes and what each one does in the simulation**

| Group | Attribute | Used for |
|---|---|---|
| Finishing | Layup, Dunk, Close Shot | Make chance at the rim; whether a drive becomes a dunk; shots inside ten feet |
| Shooting | Mid-Range, Deep Ball, Shot IQ | Base make chance by distance; Shot IQ widens the green window and softens bad timing |
| Playmaking | Handles, Passing, Speed w/ Ball | Ankle-breaker chance, steal resistance, which moves you may equip; pass speed and interceptions; speed kept while dribbling |
| Defense | Perimeter D, Interior D, Steal, Block, Rebound | How fast you track your man, how much your contest counts, each of the three takeaways |
| Athletics | Speed, Burst, Strength, Vertical, Stamina | Top speed, acceleration, body contact and shoves, jump height, sprint and move budget |

## 3. Badges

Sixteen badges, four per skill group, four tiers each (Bronze, Silver, Gold, Iced Out).

- You earn **badge XP per group by doing that group's thing in real games** (dunks feed Finishing, greens and deep
  balls feed Shooting, assists and ankle breakers feed Playmaking, steals, blocks and boards feed Defense).
- 100 XP is one badge point. A tier costs 1, 2, 3, 4 points.
- **Each tier also needs an attribute to be high enough**, so badges cannot be stacked on a build that does not fit them.

Each badge changes one named term in a formula, which keeps them honest and easy to tune:

| Badge | Changes |
|---|---|
| Rim Lobbyist | Contest counts 13% less per tier on drives |
| Gravity Waiver | Dunk range and dunk chance |
| Soft Money | Layup and close-shot chance |
| Putback Patriot | Finishing boost for 2 seconds after an offensive board |
| Manifest Destiny | Distance penalty on very deep threes |
| Open Carry | Bonus when nobody is within reach |
| Filibuster | Contest counts 12% less per tier on jumpers |
| Green Card | Width of the green release window |
| Ankle Tax | Ankle-breaker chance per move |
| Trickle Down | Teammates' shots off your pass |
| Getaway Driver | Burst out of a dribble move |
| Non-Disclosure | Chance you get stripped |
| Stand Your Ground | Resist ankle breakers; stronger contest |
| Eminent Domain | Rebound reach |
| Repo Man | Steal chance; shorter whiff penalty |
| No Fly Zone | Block chance |

## 4. Shooting, and why timing matters

A shot has a base chance from the attribute and the distance, cut by the contest (nearest defender, hands up or
jumping, and their defense rating). On top of that is the release:

- There is a **green window** around the ideal release. Shot IQ, the Green Card badge, the jumpshot you bought and the
  Shot Doctor at your crib widen it; a hand in your face and a low rating narrow it.
- A **green** release goes in (80% if heavily contested). Outside the window the chance falls off with how early or
  late you were. So a good build with bad timing still misses, and good timing rescues a modest build when open.

The AI shoots through the same code with a random timing error that shrinks on tougher courts.

## 5. Buffs: where they come from

Buffs are deliberately small and stack from many places, so there is always something to buy that is felt a little.

| Source | Size | Lasts |
|---|---|---|
| Drip (rare and up) | +1 to +3 on one to three attributes | While worn |
| Crib upgrades | +1 or +2 to everything, stamina, green window, starting Bravado, VC %, Respect %, badge XP % | Always |
| Last Call boosts | +4 to +10 on a few attributes, faster Bravado, a 50/50 double-VC ticket | One game |
| Bravado | +8 to everything | 20 seconds, earned in play |
| On fire (JAM only) | Large shooting bonus, free sprint | Until the other team scores |
| Origin | One perk | Always |

## 6. Rewards: the dopamine list

Something should pop on most actions and after every game:

- **In the game:** a called line for makes, greens, deep balls, dunks, ankle breakers, blocks and steals; slow motion
  on dunks, blocks and ankle breakers; the crowd on the fence jumps; the Bravado bar fills.
- **After the game:** VC and Respect count up; badge XP per group; badge points when a bar rolls over; any trophies.
- **Between games:** rank-ups (new court tier, new shelf in the shops), trophies (VC, five with drip you cannot buy),
  the fiends (pay a few VC for Respect and a chance at the Cardboard Crown), the Money Rack (VC for a 40-second shootout).

Game pay (see `finishGame`): a base for playing, more for winning, multiplied by the court tier, plus a little for
every stat. Losing still pays about a third, so a bad run is slow, not a wall.

## 7. Where this can go next

Ideas that fit the same tables without new systems:

- **More builder depth:** a second playstyle as a minor ("Sniper / Lockdown") that blends two cap tables; a fixed pool
  of cap points to place by hand instead of a table; takeover choices tied to playstyle.
- **Badge loadouts:** a limit on equipped badges per group, raised by rank, so two players with the same build differ.
- **Daily and weekly contracts** from the old head (score 20 in JAM, win a Street game without a deep ball).
- **Court-specific rules and looks** per tier; a rooftop court; weather.
- **Crib as a place:** invite a rival for a home game with a home-court bonus; a trophy case you can walk past;
  furniture from fiends.
- **Fiends with arcs:** each one's Basketball 2146 build gets better the more you give, and one day one of them shows
  up in The Pit as an opponent with the player you paid for.
- **Drip sets:** wear three pieces of a set for a named bonus.
- **Real animation:** keyframed dribble moves and dunks on the same joints (the rig is already a joint tree with drip
  attached to the bones, which is what makes new clothes cheap to add).
- **Play over the internet.** Not started. Today friends share a build code and the game file.
