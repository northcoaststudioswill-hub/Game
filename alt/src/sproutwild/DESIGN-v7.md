# Sproutwild v7.0 design notes: research and decisions

Will's brief (2026-11-15): research what makes base management work on mobile and in
simple systems; overhaul the three starters around north-east Ohio creatures and lore, with
a movie-style reveal; store extra buddies in a crafted Data Center and gate progress on it;
add areas before the gym; put crops on the garden plots so they compete for space with
sprouts; make building take longer.

## What the research says

These are practitioner write-ups and reviews, not studies. Treat them as rules of thumb.

**Mobile base management**
- Timers work in tiers. Short ones (under about 3 minutes) keep a session going for a few
  production rounds; medium ones (10 to 30 minutes) bring players back later.
  (Deconstructor of Fun on SimCity BuildIt)
- A core loop should fit in about two minutes, with easy stopping points.
  (Mobile Free to Play; Bugnet on short sessions)
- Construction is one of the few places a wait feels natural to players.
  (Mobile Free to Play on Fallout Shelter)
- The known failure: players log in, collect, restart timers and leave without a decision.
  (Stankovic, "Simulation games: quirks of the genre")

**Palworld's base**
- Reviewers call the base loop the strongest part: creature types mapped to jobs makes
  routine production interesting. (PC Gamer; Full Cleared)
- The scarce thing is the work slot, not the creature. A creature good at two or three jobs
  often beats a specialist. (Out of Games, "The Palworld base problem")
- Complaints: assignment is fiddly, creatures block building, you cannot set priorities.
  (Sportskeeda; palmods.gg)

## What that means for Sproutwild

| Finding | Decision in v7.0 |
|---|---|
| Short timers keep a session alive | Crops ripen in 30 to 90 seconds with a good waterer; buildings take about 10 to 20 seconds, faster with helpers |
| Waits feel natural on construction | Building is slower and visibly built by sprouts and buddies |
| Collect-and-leave is the failure | Plots force a choice: every crop plot is one fewer sprout plot |
| The slot is the scarce resource | Without a Data Center you keep three buddies. Six to eight garden plots. One lead buddy walks with you at base |
| Multi-job creatures are valued | Each starter is good at two jobs, so it stays useful all game |
| Fiddly assignment is the complaint | No assignment screen for buddies: they pick work themselves; you only choose what plots grow and what to build |

## The starters

All three come from north-east Ohio lore, never appear in the wild, have higher stats than
common buddies, two job skills, and a move only they learn (at Lv8).

| Starter | Type | Lore it comes from | Jobs | Own move |
|---|---|---|---|---|
| CUYAPUP | EMBER | The Cuyahoga ("crooked river"), which caught fire at least 13 times before the famous 1969 fire | KINDLING 2, WATERING 1 | RIVER FIRE |
| BESSLING | DEW | South Bay Bessie, the Lake Erie monster; a reward was offered for its capture | WATERING 2, FORTUNE 1 | LAKE WAKE |
| GRASSKIN | LEAF | The Grassman, Ohio's "eastern bigfoot", with hundreds of reported sightings in the 1960s | PLANTING 2, QUARRY 1 | BIG STOMP |

The old trio (Cindercap, Drizzlet, Fernfang) are now ordinary wild buddies.

**Reveal:** greeting a starter plays a 4-second sequence: it slides in as a shadow, a flash
shows its colours, the name lands, then legend, jobs, moves, own move and stats appear one
line at a time. A skips to the end; B looks at the others.

## Also from local lore (Crooked Hollow)

- MELONKIN: the Melon Heads of the Kirtland and Chardon woods. LEAF and LUCKY. Wild in the Hollow.
- PYTHORN: the Peninsula Python, said to have escaped a circus train wreck in 1944. The
  Hollow's alpha; it sleeps on a circus trunk.

Ideas not used yet: the Haserot Angel (weeping statue, Lake View Cemetery), Franklin Castle,
Helltown, Gore Orphanage, the Guardians of Traffic.

## Systems added

- **Data Center** (building: 8 stone, 2 ingots). Stores 12 more buddies. Without it you can
  keep three in total; catching is blocked and the game says why. Ingots need a kiln and ore,
  so it is a mid-game goal.
- **Garden plots.** Each plot grows sprouts (default), berries or fiber reeds. Stand at a
  plot and press A. Home buddies with WATERING or PLANTING speed growth and harvest; the
  harvest is carried to the Lantern. The Garden Bed building is retired.
- **Slower building.** About 9 seconds plus a little per unit of cost, sped up by helpers.
- **Crooked Hollow.** East of the Meadow. Wilds Lv4 to 7, ore and fiber, a Lantern post.

## Open questions for Will

1. Names: CUYAPUP, BESSLING, GRASSKIN, MELONKIN, PYTHORN are first passes.
2. Starters have no evolutions yet.
3. One new area is in. Where should the next go (south end of the Meadow is a dead end now)?
4. More crops: what else should compete for plots (ore blooms, tonic herbs, lantern oil)?
5. Should plots be unlockable beyond eight?

## Sources

- https://www.deconstructoroffun.com/blog//2015/02/simcity-buildit-nice-town-but-would-you.html
- https://mobilefreetoplay.com/tag/session-design-2/
- https://bugnet.io/blog/how-to-design-a-game-for-short-play-sessions
- https://stanislav-stankovic.medium.com/simulation-games-quirks-of-genre-adda9939aa3b
- https://naavik.co/deep-dives/everdale-time-less/
- https://pcgamer.com/palworld-could-be-a-delight-if-it-wasnt-so-invested-in-being-awful
- https://outof.games/news/10104-the-palworld-base-problem-it-was-never-about-which-pals-you-own/
- https://sportskeeda.com/mmo/things-palworld-players-hate
- https://www.palmods.gg/blog/palworld-base-automation-fixes
- https://www.wikipedia.org/wiki/Bessie_(lake_monster)
- https://clevelandmagazine.com/articles/cle-myths-lake-erie-monster/
- https://atlasobscura.com/articles/ohio-cryptids
- https://ohiomagazine.com/ohio-life/article/field-guide-to-ohio-cryptids
- https://clevelandish.beehiiv.com/p/the-mysterious-melon-heads-of-northeast-ohio
- https://cryptidz.fandom.com/wiki/Peninsula_Python
- https://www.onlyinyourstate.com/state-pride/ohio/wonky-history-cleveland
