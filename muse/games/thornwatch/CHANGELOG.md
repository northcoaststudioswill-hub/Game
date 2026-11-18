# CLANKAWATCH (was Thornwatch) — Changelog

## v4.0 alpha 2 — Nov 18, 2026 — Played it, then fixed what playing found

Will: "You need to play this game ... then we need to rework and
make it better and fix it and make it playable." Played from a
fresh save with real key presses; full record and the balance
sim are in `PLAYTEST-v4.0.md`. Headless only; not phone-verified.

- **Every button does one thing now.** B used to sell a sprout
  if the cursor was on one and change speed if it was not, so
  speeding up kept selling towers. B never sells: it is speed
  at night and "back" in a panel. Selling is SELECT inside a
  sprout's or keeper's panel, with the refund shown.
- **Plant from where you stand.** A on open ground opens a PLANT
  panel: six sprouts and six keepers with name, price and what
  each does. The strip of sixteen tiny cards under the board,
  and the 12-press walk to reach it, are gone.
- **START no longer skips your build.** On the "NIGHT CLEAR"
  card it used to start the next night at once.
- **One clear bar at the bottom:** what the cursor is on, what A
  does here, what START or B does now.
- **The tutorial works on a phone-size screen.** Its second gold
  marker sat on the path, where you cannot plant. Markers are
  now worked out from the path. The first two sprouts are
  EMBERs (a lone DEW popped nothing on night 1), and START
  waits for both.
- **Faster.** 1X runs 40% quicker. Night 1 went from about 45
  seconds to about 20. Nothing else about the numbers moved.
- **Loose petals.** The Heart throws off 2 to 5 petals a night.
  Walk the cursor onto one to pick it up. They are half the
  dawn bonus paid early, plus a quarter extra for catching
  them, so a night pays at most 2 to 6 petals more than before.
- **BALANCE CHANGE: each sprout already planted makes the next
  one 10% dearer.** At v3.7's flat prices a player who spammed
  81 level-1 sprouts won Erin's Garden with no leaks, and a
  player who grew their sprouts did worse. At 10%, growing wins
  every sim run and spam is a coin flip. Keeper, grow and power
  prices are unchanged. Gardens 2 and 3 and the other modes
  were not simmed at the new price.
- HOW TO PLAY's controls page matches the new buttons.

## v4.0 alpha 1 — Nov 18, 2026 — The look, the story, and Bottie's swarm

The first step of the v4 rebuild (brief: HANDOFF section 3a,
RESEARCH-v4.0.md). Built by Claude on branch
`claude/tender-darwin-0r4toe`. Headless checks only; not yet
played on Will's phone.

**No number was changed.** Every tower, price, wave, hit point
and counter is exactly v3.7's. This version changes what the
game looks like, what the enemy is, and adds the story.

- **The enemy is lil Bottie now** (Will, Nov 18: "what if it was
  lil Bottie sending AI data drone swarms instead of creeps").
  The bramble creeps are gone. All 14 enemies are his drones,
  drawn new with his blue eye, each with its own shape:
  DRONE, DART, PLATED, STEALTH, HARDCASE, PATCHER, CARRIER
  (drops BITS), SHIELDER, DRILLER, LOADER, and the bosses THE
  HARVESTER, THE SCRAPER and BOTTIE PRIME. Each one behaves
  exactly like the creep it replaced (table in HANDOFF 3b).
  Louie's warnings, the field guide, the boss cards, the title
  and the defeat screen all use the new names. The names are
  placeholders for Will to keep or change.
- **Story and cut-scenes.** One scene player, eleven scenes:
  the intro, the first visit to gardens 2 and 3, the night
  before each boss, and the morning after each garden is held.
  Erin, Marcus, Will and Louie stand in the garden and talk;
  Bottie is a voice at the edge until the last garden; King
  Bibi sends a letter. A is next, START skips, each plays once.
  The lines are typed out; the first A finishes the line.
  v3.4's own intro lines were kept where they still fit.
- **The gardens are painted, not tiled.** A mown lawn, a path
  with a real edge, a stone wall, lantern posts at the bends,
  drifts of flowers, and a look per garden: spring green for
  Erin's Garden, gold rows for The Long Beds, old stone for The
  Crossroads. At night the lanterns and the Heart light the
  ground and the path is the brightest thing on screen.
- **One outline for everything.** Sprouts, keepers and drones
  all get the same dark 1px outline so they stand out from the
  grass.
- **Fixes found on the way:**
  - cut-scene text was dark on a dark outline and unreadable;
    it is now plain dark text on cream, at the larger size
  - the word HEART was drawn in the middle of the screen with
    its dark box at the Heart; both are gone (the bed marks it)
  - keeper prices in the shop strip ran into each other
    ("110100120"); keepers now show a gold or red dot, and the
    price when picked
- **The source is in the repo.** v3.7 only existed as a built
  file. `src/` now holds the code and `python3 build.py` makes
  the game; `build.py --v37` proves the cut reproduces the
  frozen v3.7 file byte for byte.

- **Lil Bottie looks like himself, and he is mad** (Will, Nov
  18). Scenes, the title and the defeat screen use his real
  model (Sproutwild's sprite) with a red anger mark, in place
  of the dark silhouette. BOTTIE PRIME, the last boss, is that
  same model shown big, not a drone drawn to resemble him. His
  lines are rewritten: he is furious about his drones and he
  is the NUMBA ONE CLANKA. He gloats when the Heart falls. His
  greyed-out keeper slot in the shop is now a plain "???",
  since he is the villain here.

- **The game is called CLANKAWATCH** (Will, Nov 18: "call it
  something Bottie related"). The title screen and the
  cartridge label say so. The folder, the file name and the
  save key (`thornwatch-v1`) keep the old name so nothing
  breaks; old saves load as before.

Not in this version (next, in the brief's order): two upgrade
paths per sprout, calling the next night early, petals to
collect during a night, the menu pass, replay goals.

## v3.7 — Nov 16, 2026 — The NOOB round (Will: "play as a noob, make it more fun")

Played v3.6 as four first-time players who don't know tower
defense (a text-skipper, a petal-hoarder, a chaos-planter, a
returning casual), logged where each got bored, confused, or
cheated, then made fun-first edits — every one cited to a
persona moment. Full record: `PLAYTEST-v3.7.md`; fun
research: `RESEARCH-v3.7.md`. Headless verification only —
not yet phone-verified.

- **Kills pay visibly now.** Bounties used to tick into the
  counter silently. A petal sprite flies from every corpse
  to the HUD petal counter (pulse + coin tick on arrival);
  bounties of 10+ float their amount at the kill.
- **Crits feel lucky.** A crit that lands the kill bursts
  gold, floats 'CRIT!' and pops higher — LUCKY's card
  promised "huge crit hits" and the game never showed one.
- **Nights end with a reward, not a log line.** A dawn card:
  'NIGHT N CLEAR!', the stars filling in, petals and pops
  for the night, 'NO LEAKS! THE HEART IS WHOLE' or the leak
  count. Skippable; START dismisses it and starts the next
  night in a single press.
- **Dying teaches.** The defeat screen names the night's
  biggest leaker with its field-guide counter:
  'x6 DART · DEW SLOWS IT DOWN'.
- **Danger announces itself.** A creep past 78% of the path
  earns a 'WOOF! TOO CLOSE!' bark and a flashing red Heart
  in the HUD — noobs were watching the number drop without
  ever seeing why.
- **Louie speaks up for defenseless gardens.** A round that
  starts with no real shooter: 'WOOF! TOO WEAK! PLANT
  SHOOTERS!'. First dawn holding 90+ petals with no keeper:
  'WOOF! A KEEPER COSTS 90P!' (3 of 4 personas never found
  heroes at all).
- **Mashing no longer spends your petals.** Fork and train
  panels ignore A presses in the first 0.13s after opening
  — in v3.6, 3 of 4 personas mash-bought upgrades they never
  chose, one a 480-petal GRAND. Deliberate presses land
  untouched; the window was measured against both the mash
  rate and a deliberate double-tap.
- **The noob floor held.** No difficulty was touched: every
  persona still wins nights 1–2; the tapper's now-honest
  no-upgrade line dies on night 6, threatened from night 4 —
  and the expert ceiling is unchanged (all maps/seeds clear,
  endless 13–15, failure set byte-identical to v3.6's).

## v3.6 — Nov 16, 2026 — Playtest round (Will: "Play test and work on it")

No new headline features — a full playtest of v3.5 (naive
journey, returning saves, expert matrices, soak, defeat paths,
and a size-aware text-fit audit over every rendered string),
then fixes for everything provable. Full record:
`PLAYTEST-v3.6.md`. Headless verification only — not yet
phone-verified.

- **THE BIG ONE — standalone night starts were death
  sentences.** MAP SELECT and PLAY-to-frontier invite starting
  any unlocked night fresh, but nights are tuned for an
  accumulated garden: expert lines starting fresh at 8
  different map/night points died 8/8. A run starting at
  night N now also gets the purse a fought-through garden
  would hold at that dawn (measured curve). **8/8 deaths →
  8/8 wins.** Night-1 and endless starts unchanged.
- **Info bar rebuilt to fit the screen.** The dawn hero line
  was 54 characters on a 39-character screen — the B action
  was literally off-canvas. Heroes now show short ability
  names (LASER/WHIP/JET/FLARE/FIND/YUKON; canon names intact
  everywhere else), tower lines stand alone, and a fit ladder
  guarantees every inspect line fits. The new render audit
  asserts **zero** overflowing strings on any screen.
- **YUKON respects paths.** Mama's Yukon on The Crossroads
  was damaging creeps on BOTH paths (the fx carried no path).
  It now drives the path nearest Mama and hits only that
  path — probe-verified both directions.
- **RAIN OF DEW is weather.** It only slowed creeps already
  on screen, so the slowed front shielded the unslowed tail
  and the power could *cause* leaks on small waves. Spawns
  during the 10s window now inherit the slow; the backfire
  is gone and the big-wave case stays decisive.
- **LOUIE'S HOWL retuned** (numbers only): stun 2s→3s,
  reveal 8s→14s. Still the situational one — a panic button
  for camo about to leak, not a staple.
- **HARD softened one knob:** creep HP ×1.35 → ×1.28. The
  strongest script line still dies on one seed at N4 — but a
  line that answers Louie's own "PEB cracks armor" warning
  wins that seed at ♥10, so the wall is play, not tuning.
- **SUNFARM shows its work:** lifetime petals tracked per
  farm and shown on inspect ('MADE 1234P') and in its GRAND
  panel.
- **Defeat screen tells the truth and offers a retry:**
  'YOU HELD 2 NIGHTS · FELL ON NIGHT 3' (it used to credit
  the night you died on), A retries the same map/mode,
  B goes to title.
- **The Crossroads glows at the gate that feeds next** —
  a small ember marker on the entrance the queue head will
  use, so two-gate nights are readable before the wave lands.
- **Powers discoverability:** Louie barks 'WOOF! SELECT =
  POWERS!' the first time a run can afford one; the panel
  title now honestly says 'PAY TO FIRE'.
- **Fit-audit sweep:** 'GRAND GRAND SUNFARM/JACKPOT' doubling
  fixed at five sites; THORNBACK PRIME's boss label no longer
  runs off the right edge; train panel footer de-collided;
  victory headlines, upgrades header, six Louie warning barks
  and the WARM LANTERN desc all fit; locked map pips lifted
  off the banned `#6a6480`; cursor labels clamp on-screen;
  the intro's closing line no longer says 'ten nights' in a
  26-night game.
- Suites: core (17 new checks) + front + migration ×7 +
  soak + naive + render (28 shots) all green, zero console
  errors, zero duplicate function names.

## v3.5 — Nov 16, 2026 — Flesh it out (width before length)

Will played v3.4: **"It's getting better"** — then three
directives: the circle around the aimer has to go; some text was
made black and is really hard to read; and the game still feels
like a mini game — flesh it out. Minutes later he sharpened the
third one: money becoming useless needs a real fix with more
systems, and *"if it's 20 nights on the same level... I don't
think the scope is wide enough before we make it longer"* —
**width before length**, with Bloons TD6 as the reference. So
the 20-nights-one-board plan was scrapped the same morning it
was drafted. Research round 3 (BTD6-first) is in
`RESEARCH-v3.5.md`; the full playtest + audit is
`PLAYTEST-v3.5.md`, both in the workdir.

- **FIX 1 — the aimer circle is dead.** The aiming cursor is the
  clean square bracket alone, no ring, ever. A placed tower's
  range shows only while the cursor rests on that tower, as a
  thin dashed outline. The guide's ghost marker lost its ring
  too (sprite + corner brackets now).
- **FIX 2 — the black-text audit.** Every screen re-captured and
  swept. The worst offenders were secondary lines drawn in
  `#6a6480`/`#8f86c8` on near-black panels (fork panel effects,
  locked-keeper lore, settings and menu footers, cut-in skip
  prompts) — all lifted to readable light tones; floats got dark
  shadow passes; the boss HUD label got a dark plate; dark text
  now lives only on light plates. Full string-by-string table in
  the playtest report. The audit also caught two layout defects:
  map-select cards clipping their own names, and a self-
  colliding map-screen footer — both fixed.
- **THREE GARDENS, not one board × 20.** Erin's Garden (10
  nights, Thornback) is now Map 1 of 3. **The Long Beds** (new
  624px three-row snake, deep-dusk grade, 8 nights, BRAMBLE MAW
  finale) and **The Crossroads** (two entrances converging on
  one Heart leg, deepest grade, 8 nights, THORNBACK PRIME —
  1,600 HP, enrage + mite-shedding) unlock in sequence. 26
  nights, but length through width: every map changes which
  towers and spots are good. Chapter title cards at each map's
  first night.
- **Two new creeps.** BUBBLEBRAM — a shield bubble eats a pool
  of damage before the creep can be hurt; pops with a burst
  (Rootdeep's crab is the ancestor). BURROWER — travels the
  first 40% of the track underground and untargetable, dust
  trail showing; DEW mist or Ranger's flare digs it up early.
  Louie has counter-barks for both; both are in the field guide.
- **The money fix — four new systems.** **SUNFARM**: LEAF's
  fork is a true farm now — no attack, banks petals in visible
  bursts all night; greedy farming provably dies (Night 3 in
  sims), and SUNLEAF's old Heart mend is gone with it.
  **GRAND upgrades**: every fork grows once more into a Grand
  form (340–480 petals, damage ×2.6 and a per-type spike) — there
  is always something worth saving for. **POWERS**: SELECT
  mid-round buys one-shots — SUNBURST, RAIN OF DEW, LOUIE'S
  HOWL — money gets an emergency job every night. **HERO
  TRAINING**: level placed heroes Lv1→3 for petals, gold pips
  under the sprite.
- **Modes + stars.** Each map: STANDARD, then HARD (+HP, 40
  starting petals, double drops) and ALT NIGHTS (remixed
  compositions) unlock on a clear. Stars per map×mode×night
  (clear 1★ · Heart ≥10 2★ · zero leaks 3★). NIGHTS is now a
  MAP SELECT screen; PLAY still jumps straight to the frontier.
- **SUN DROPS + LANTERN UPGRADES.** First-time stars pay drops;
  8 permanent perks (3–6 drops, 37 total — a full clear affords
  most, not all): DEEP PURSE, SECOND HEART, KEEPER'S DISCOUNT,
  RICH SOIL, DOUBLE BOOF, GARDENER'S EYE, FORKED PATHS, WARM
  LANTERN.
- **THE LONG NIGHT (endless).** Unlocks when the Crossroads
  falls: fresh garden, compounding scaling, a MAW every 10th
  night, score = nights survived (expert sims die at 9–15),
  +1 drop per 5 nights survived (max +4 a run).
- **The O1 verdict** (winning runs used to end ~2,000 petals
  rich): with the sinks in play, the expert line ends Map 1 at
  **695 petals vs 1,976** with Grands off — the flood is
  converted, not deleted; a no-spend line still ends rich, and
  a Grand alone still loses. Details in the playtest report.
- **Playtest-caught balance fixes, logged:** an early draft
  scaled Maps 2–3 as if they were campaign nights 8–22 (3.17×
  HP openers — unwinnable) and opened them with mid-game waves;
  both maps now ramp from their own Night 1, BTD6-style.
- **Save migration is honest:** v3.4 saves backfill Map 1 stars
  at 1★ per cleared night (no gifted 2★/3★) with drops granted
  once; Maps 2–3 follow the unlock rule; a v3.4 win does NOT
  unlock endless — that takes the new Map 3 finale.

## v3.4 — Nov 16, 2026 — A proper front door

Will played v3.3: **"keep play testing and researching these
types of games and improving check GitHub for new implementations
in other games for characters ideas etc we don't even have a
proper start up a menu a explainer graphics etc needs work."**
All true. A deeper playtest of v3.3 confirmed the gaps (field
guide buried 9 inputs from boot as How-to-Play page 3; no menu,
no settings, no explainer anywhere) and the research round
(Kingdom Rush / PvZ / Desktop TD + a full GitHub sweep) is in
`RESEARCH-v3.4.md`; the playtest is `PLAYTEST-v3.4.md`, both in
the workdir. Mechanics, balance and prices are untouched —
the strategy-sim pattern is identical to v3.3 line for line.

- **A living title.** Boot lands on Erin's Garden at night:
  the dressed board under a dusk overlay, the sprout row
  swaying, a creep silhouette patrolling the track entrance,
  the Heart's lantern glow pulsing, Louie on watch. PRESS
  START opens the menu. B still ejects (the family pattern).
- **A real main menu** (Rootdeep's pattern: the title art plus
  a panel, big readable rows): PLAY (shows BEST n when a save
  exists) / INTRO / HOW TO PLAY / FIELD GUIDE / SETTINGS /
  SWAP CARTRIDGE. The field guide is now one menu pick, not
  page 3 of the tutorial; it stays in the pause menu too.
  B in the menu goes back to the title — eject is a chosen
  row now, not an accidental button.
- **The intro cinematic — the explainer.** Four drawn scenes
  in the family's cinematic style (letterbox, parchment
  plate, speaker name plates; never a text-box drop):
  (1) dusk, sprouts asleep, Louie on the fence; (2) the
  bramble stirs — eyes in the dark, Thornback's silhouette;
  (3) Louie sounds the alarm, the keepers take their places;
  (4) dawn, the garden armed — "Plant by day. Hold the Heart
  ten nights." A advances, START skips. It plays ONCE when a
  fresh save first presses PLAY (before Louie's guided run,
  which still fires right after), and is replayable anytime
  from the menu's INTRO row. New save flag `introSeen`;
  returning players migrate to seen (plays/best/wins > 0).
- **Settings, menu + pause.** MUSIC VOL / SFX VOL / SCREEN
  SHAKE with pips, written live into the console's shared
  `meta.mus`/`meta.sfx` exactly like Rootdeep's — Thornwatch
  has no music of its own, so these govern the shared console
  values (that's how the console works); the shake toggle is
  Thornwatch's own and also gates Thornwatch's screen shake.
  From pause, the world stays frozen behind the settings and
  you return to the open pause menu.
- **A new face on the watch list: DEREK.** The GitHub sweep
  found him in the repo's Knockout work (alt/CHANGELOG, Fable
  pass 3, from Will's own notes): Marcus's guy — "He pulls
  up." He joins KING BIBI / CORBIN / LIL BOTTIE as the fourth
  placeholder keeper (name + lore only, silhouette in a cap
  and shades). Flagged here for Will's veto. The same sweep
  ruled NO rename for Marcus: Knockout's half-meter became
  DEREK PULLS UP, but the repo changelog itself says HYDRO
  JET "is still his super in Rootdeep" — Thornwatch mirrors
  Rootdeep, so HYDRO JET stays. FENTANYAHU was NOT absorbed
  (his own character per Will, but a scene extra whose look
  Will hasn't settled); full reasoning in RESEARCH-v3.4.md.
- **The strip holds 16 cards now** (Derek), so cards go
  16px → 15px wide; icons and prices re-checked readable at
  360px in the delivery captures. The "HEART" label moved
  above the Heart on a soft backing (it sat mid-field under
  the sprite). Two capture-caught bugs were fixed before
  delivery: the settings shake row first rendered as a 1-pip
  volume bar, and the cinematic's actors stood behind the
  dialogue plate — both re-shot clean.
- **Balance: flagged, not touched.** The expert playtest
  (warning-driven, in-game knowledge only) wins 3/3 seeds,
  and winning runs end ~2,000 petals rich — income outruns
  the sinks once the board fills around night 7. Five of
  nine sim strategy families still lose and no line is a
  certain win or loss, so per the standing rule this is
  Will's call, not a silent retune. Details in
  PLAYTEST-v3.4.md (finding O1).

Verification: FRONT34_OK (41 front-end checks: menu nav to
every entry, cinematic play/skip/replay, auto-play-once,
settings write + persist from menu and pause, guide after
cine), THORNWATCH3_OK core suite (boot flow updated), 4/4
save-migration cases, SOAK3_OK, sim pattern identical to
v3.3, 17 captures eyeballed at full size and 360px.
Rootdeep/Sproutwild regression tails follow as a separate
note. All verification is the headless rig — Will's phone
verdict is the one that counts.


## v3.3 — Nov 16, 2026 — Controls + onboarding

Will played v3.2: **"It needs play testing and improvement the
controls are clunky hard to understand no onboarding etc."** All
true, and measured before fixing: a scripted naive player (only
what the screens say, `playtest-naive-base.js`) needed 9 A presses
for its first plant (the cursor starts on the path; nothing says
A plants), 6–12 one-way SELECT taps to reach a hero card, 60 taps
to cross the field, uprooted its own tower with a mid-round B,
and found B at dawn to be a dead button. Controls, hints, menus
and the first run are the whole release — mechanics, balance,
prices, art frozen (strategy sims identical to v3.2 line for
line). Full log: `PLAYTEST-v3.3.md` in the workdir.

- **One travel path for cursor + shop.** The field cursor snaps
  to 16px cells: a tap steps one cell, holding repeats with
  acceleration (field crossed in ~1.4s, was 2.8s flat / 60 taps).
  DOWN off the bottom row moves focus INTO the shop strip;
  LEFT/RIGHT walk the 15 cards with wrap (worst case 7 steps,
  was 12 one-way); UP or A returns with the card armed. SELECT
  still cycles as a legacy shortcut — nothing requires it.
- **The info bar always says what the buttons do.** Context
  hints everywhere: empty ground "A: PLANT" (mid-round adds
  "B: SPD 2X"), own sprout "A: GROW nP · B: UPROOT +nP", hero
  "A: FIRE <ability> · B: UPROOT +nP", strip focus "A: PICK ·
  B: BACK". Priority is name + price + hints; the role line
  yields when the bar is tight.
- **Pause is a menu now.** START mid-round: Resume / How to
  Play / Restart Night / Quit to Title (+ Skip Guide while the
  guide runs). Restart Night restores a snapshot taken at round
  start — mid-round builds and spends are undone. The world is
  frozen while the menu is open (asserted).
- **HOW TO PLAY** (title menu + pause menu): page 1 the loop
  and the goal, page 2 controls in big-button rows, page 3 a
  creep field guide — sprite, name, and its counter in ≤5
  words. The title screen gains the goal line under the logo:
  "DEFEND THE GARDEN HEART FOR 10 NIGHTS."
- **Guided first run** (fresh saves only, Louie-led, by doing —
  markers hint, never lock): "Pick a sprout!" → "Plant by the
  bend!" (pulsing ghost + ghost range ring on a strong bend
  cell) → "One more sprout!" → "Press START — night's coming!"
  → a mid-night-1 say-hint "B speeds time up! Try it!" → dawn 2
  "Petals earned! Grow a sprout: A" → Louie retires the guide
  forever. Guided re-playtest (`playtest-naive33.js`): boot →
  first plant **2.27s**, zero no-effect inputs on the happy
  path, guide complete by dawn 2. Save gains a backward-
  compatible `guideDone` flag; saves with plays>0 or best>0
  migrate to done and never see the guide (all five save
  shapes tested, `playtest-saves33.js`).
- Verification: core suite THORNWATCH3_OK (grid assertions
  updated — the old 2px-nudge check encoded the dead scheme),
  NAIVE33_OK, MENUS33_OK (32 checks), soak SOAK3_OK (10,403
  frames), sims unchanged, 480 function declarations with zero
  duplicates. Screenshots: tw-guide (ghost marker), tw-strip,
  tw-howto, tw-fieldguide, tw-pause + the refreshed set,
  eyeballed full-size and at 360px.

## v3.2 — Nov 15, 2026 — The family's real art, ported

Will played v3.1: **"It's getting better but the graphics are just
bad lol."** Fair — v3.1's sprites were first-draft inventions.
v3.2 stops inventing and PORTS the art of the games Will likes.
Art/layout ONLY — every mechanic, number, balance line and the save
shape are frozen (the strategy-sim pattern is identical to v3.0/v3.1
line for line). Full audit: `PLAYTEST-v3.2.md` in the workdir.

- **The board is Sprouts' own garden now.** Built from Sprouts'
  actual tile painters: its 3 grass variants with the same blade
  marks, sparkles and flower crosses (checkerboard killed), its
  pale dirt on the same winding route with blended edges (grass
  blades and dirt pebbles spilling across — no rim, no ribbon),
  its soil under the Heart, its fence tiles along the margins,
  its ember-bramble at the entrance, its tree tiles with ground
  shadows, its flower colors seeded on the grass. Night is the
  same board under Sprouts' dusk wash, lantern glows kept.
- **The creeps are Rootdeep's real sprites.** The actual RDSPR
  string data, recolored to bark and bramble: STANDARD/MOSS/MITES
  from the grub, DART from the shade, BULWARK the beetle verbatim,
  IRONBARK the crab with rivets, REGROW the spitter with a pink
  bud, SPLITTER the grub with a bulb sac, MAULER a widened horned
  beetle, and OLD THORNBACK built from Rootdeep's MOTHER with
  KING's gold spike tips. Hit-flash/slow/enrage are palette twins
  of the same rows, like Rootdeep does it.
- **The towers are Sprouts sprouts, grown.** Sprouts' drawBud
  anatomy at tower scale — canon TYPES colors, its eyes, its stem,
  its soil mound baked in — with the forks told Sprouts-style:
  flame trio → heart-flame, ice spikes, Tesla coils, fruiting
  canopy, gold star, DEADEYE's one big eye.
- **Everything stands on the ground:** the family's soft shadow
  under every tower, creep and hero. Nothing floats.
- Proof: `tw-sidebyside.png` — Sprouts' own Erin's Garden next to
  Thornwatch's dawn board. Same grass, same dirt, same soil, same
  fences. Core suite 53/53, soak clean, sim pattern unchanged.

## v3.1 — Nov 15, 2026 — Visual overhaul

Will played v3.0 and said: **"The graphics are so bad tho and I can't
read most the menu too much dead space it needs work it's so ugly."**
v3.1 is art + readability + layout ONLY — every v3.0 mechanic, number,
price, range, speed and the save shape are frozen (the strategy-sim
pattern came back identical to v3.0 line for line, and Night 1 still
measures 15.5 s). Full audit + build log: `PLAYTEST-v3.1.md` in the
workdir. What changed:

- **Real pixel sprites for everything**, authored with the family's
  `mk(rows,pal)` string-art pipeline at Rootdeep's bar: 18 tower looks
  (6 sprout types × base + both forks — WILDFIRE's triple flame,
  SIEGE's barrel boulder, DEADEYE's one big eye), 9 creep sprites +
  MITES (IRONBARK's riveted band, MOSS's fur, REGROW's pink bud, the
  MAULER's gold horns), OLD THORNBACK as a 24×19 purple bramble king
  with a gold thorn crown, and the Garden Heart as a flower-heart
  sprite. Status (hit-flash / slow / enrage) is palette-twin sprites —
  it reads on the body.
- **Pre-rendered garden board** (day + night): two-tone checker grass
  with speckle, tufts, flowers and stones; the track with a dark rim,
  worn center and embedded stones; fence lines, corner trees, a
  bramble mass at the entrance, lantern glow pools at the bends at
  night. Night palette rebuilt for contrast (v3.0's night frame was
  ~90% black void; now track, creeps and towers read at a glance).
- **Scale up:** towers 16×20 (were ~7×9 buds), creeps ~16×13, MAULER
  22×15, THORNBACK 24×19, heroes 20×23, track a 16 px ribbon. Logical
  footprints untouched.
- **Menu rebuilt around an INFO BAR** above the strip: the selected
  entry's sprite + NAME at size 2 + gold price + role/ability line —
  for sprouts, heroes and locked keepers (lore included). The strip
  is icon-first: 14 px sprites, price digits fully inside the card,
  selected card raised on a lit panel with gold rails. The fork panel
  takes both bottom bars with size-2 variant names and wrapped effect
  lines. The clipped hint bar and the floating keeper card are gone;
  their content (tower status, ability READY, START!, creeps left)
  moved into the info bar / HUD.
- **Text fixes:** Louie's say-bar text sits inside its panel (was
  drawn 6 px below it, over the grass); boss HP bar moved clear of
  the say bar; HUD gained heart/petal icons and a size-2 speed
  readout; no string draws off-canvas.
- **Title / victory / defeat** draw the dressed garden behind their
  text instead of flat voids; the boss cut-in portrait is the boss
  sprite at 3× (the flat rect-art portrait is deleted).
- Verification: Thornwatch suite 53/53 (THORNWATCH3_OK, re-run at
  delivery), soak SOAK3_OK (11,467 frames, v1/v2 saves load), sims
  identical to v3.0, Rootdeep 6/6 + Sproutwild 23/23 recorded green in
  the build log, 468 functions zero duplicates. Captures eyeballed
  full-size and downscaled to 360 px wide (phone size). Known
  capture-only artifacts: the render rig fills range rings as discs
  (on-device they're 1 px stroke rings) and corrupts one shared
  ctext squeeze line at the top edge (shared base code, all
  cartridges, correct on-device). Will's phone verdict is the real
  test, as always.

## v3.0 — Nov 15, 2026 — "Make it Bloons"

Will played v2.0 and said: **"the game feels so slow"** and **"I just
don't really understand the game you may need to make it more like
bloons."** He was right on both counts — v2 layered depth (phases, plot
grid, menus) on a core loop that never became legible. v3.0 keeps every
piece of v2 content and rebuilds the skeleton it hangs on. Same
cartridge slot 4, same save key (`thornwatch-v1`, same shape — v1/v2
saves load untouched). Nothing was pushed to GitHub. A pristine v2.0
backup sits in the workdir (`backup-v2.0/`).

### The restructure (the whole point)
- **ONE WINDING TRACK.** The 3 straight lanes + plot grid are gone. One
  serpentine dirt path runs from the bramble edge through two S-bends
  to the Garden Heart (~537 px — path length is the difficulty dial,
  and the bends stack towers' coverage). Creeps follow it by distance;
  targeting is Bloons-style "first" (furthest along the path).
- **FREE PLACEMENT.** Plant anywhere except on the track, on another
  tower, or on the Heart. The selected tower's RANGE RING shows while
  you aim (and on any tower you select); invalid spots tint the ring
  red and A refuses with a shake + Louie's "Can't plant there!"
- **BUILD ANYTIME.** The DAWN/NIGHT lock is dead. Between rounds you
  build at your own pace; DURING a round you can also plant, fork, and
  uproot. START begins the round; it ends the frame the last creep
  pops or leaks, pays out (clear bonus + LEAF), and Louie briefs the
  next night. The sky still dims during rounds — flavor, not a lock.
- **SPEED.** B on open ground during a round cycles 1×→2×→3× (HUD
  shows it). Base pacing also tightened: creep speeds up ~15–20%,
  spawn gaps compressed, first creep enters the frame the round
  starts, cut-ins shortened (still A-skippable).
- **SHOP STRIP + HUD.** A persistent bottom strip shows all 15 menu
  entries as icon+price cards (SELECT cycles, the highlight makes the
  cycle visible; heroes get their keeper card above the strip,
  placeholders stay greyed with lore). Top HUD: HEART / PETALS /
  NIGHT n/10 / speed — always on screen.
- **MONEY FROM POPS.** On top of kill bounties, every 20 damage dealt
  pays +1 petal mid-round, and breaking a creep's armor pays +2 — you
  watch the money being made.
- **FIRST MINUTE.** A fresh garden starts with 60 petals — exactly 2
  sprout towers. Night 1 is 6 standard creeps on the new track, and
  Louie's first line teaches the game: "Down the dirt path! Plant by
  the bends!" No tutorial boxes — the track teaches.

### Kept whole from v2
All 6 sprout towers + the 12-variant fork, all 6 keeper heroes with
their canon abilities and cut-ins (Will's MAZEL TOV LASER is now a
radial burst — there are no lanes to sweep; Erin's TOWEL WHIP, Marcus's
HYDRO JET radial too; Mama's YUKON now drives the path itself),
Louie + THE BOOF, the full creep roster with per-night debuts and
counter-barks, King Bibi / Corbin / Lil Bottie placeholders, the juice.

Retunes for the long path: creep HP scaler 0.38→0.31/night, REGROW
heal 3.2→2.8/s, BRAMBLE MAULER 300/430→265/390, OLD THORNBACK
900→780 HP (at 900 the boss night ran ~96 s, outside the pace band;
identity and enrage unchanged).

### Pace — before / after (measured, PLAYTEST-v3.md has the method)
| | v2.0 | v3.0 |
|---|---|---|
| Dead air per night | felt endless | **0.2–0.3 s** |
| Nights 1–3, competent defense | — | **20–30 s** at 1× |
| Nights 8–10, winning lines | — | **39–78 s** at 1× |
| Full win run, round time at 1× | — | **7.1–7.5 min** (+ your own building time between rounds) |
| Fast-forward | none | 1×/2×/3× mid-round |

Strategy sims (3 seeds each): mixedFork2 WIN / LOSS@N9 / WIN,
heroMix WIN ×3 (Heart 14–17 left — real margins), mixedFork stalls
at N8, greedy leaf-economy dies to the armor nights (N4–6), single-
tower spam dies mid-game to its hard counter (EMBER@N7, ZIP@N5,
PEB@N9), passive/newbie lines die N4–5. Nothing is a certain win
except the full hero line, and even that bleeds.

### Verification
- Thornwatch suite: 53 structural checks (track-following, placement
  rules, range state, build-during-round, FF multiplication, pop
  drip, round flow, fork, abilities, win/defeat, save) — all OK.
- Soak: 3 chaotic runs with FF + abilities + mid-round builds,
  10,194 updates, 0 errors; a v1/v2-shaped save loads intact.
- Regressions: Rootdeep 6/6, Sproutwild 23/23 on the combined file;
  468 function declarations, zero duplicates.
- Screenshots refreshed (title / dawn / night / boss / victory /
  defeat) and eyeballed; a text pass followed — every Louie line,
  card, and hint now fits the 240-px screen (the first capture caught
  Louie's opener truncating mid-word).

### Known limits
- Balance is sim-tuned, not hand-tuned; the no-hero fork line never
  won a sim (N8 every time) — human mid-round uproots and ability
  timing are stronger than the sim's fixed buy lists.
- SUNLEAF's +1 Heart mend per night (from v2) still flagged as
  possibly generous.
- In the screenshot rig the range ring renders as a filled disc
  (the rig fills circle ops); on the device it's a thin ring.
- As ever: not "fixed" until Will plays it on his phone.

## v2.0 — Nov 15, 2026 — "The keepers join the watch"

Will played the v1 concept and asked for: a real playtest + improvements,
more of our characters (Will, Erin, Marcus + placeholders), more enemy
types, and research into Bloons and what makes it fun. This is that build.
Same cartridge slot 4, same save key (`thornwatch-v1`, same shape — v1
saves load untouched). Nothing was pushed to GitHub.

### Research applied (Bloons TD — full notes in the workdir RESEARCH-v2.md)
- **Popping juice** → petal-burst particles on kills, CLANK floaters on
  immune hits, screen shake when the Heart is bitten, ability-ready
  sparkles, a "+N PETALS" floater over the Heart at dawn.
- **Hard counters** → five new creeps, each answering a lazy strategy:
  MOSS (camo), IRONBARK (lead-class), REGROW, SPLITTER, BRAMBLE MAULER.
- **Upgrade paths** → the linear LV2 is now a fork of two named variants.
- **Economy tension** → heroes (90–120p) and pricier forks are the sinks
  the v1 sims proved missing (winners were ending with 250–900 unspent).
- **Heroes** → one-of-each keepers with cooldown abilities fired by hand.
- **Readable escalation** → every new threat debuts on its own night and
  Louie's warning names it; Night 10's boss got a real entrance.

### Keeper heroes (plant like towers, one of each)
- **WILL (110p)** — steady petal bolts. Ability: **MAZEL TOV LASER** —
  a beam sweeps his lane, 60 damage to everything in it (25s cooldown).
- **ERIN (100p)** — towel snaps with knockback. Ability: **TOWEL WHIP** —
  radial damage + knockback around her (20s). Louie, on her arrival:
  "Save the STAMPEDE for the ring!"
- **MARCUS (120p)** — water bolts that slow. Ability: **HYDRO JET** —
  his lane takes 36 and a heavy slow (22s). His reviews are in his lines.
- **RANGER (90p)** — long shots; his lantern radius reveals camo.
  Ability: **LANTERN FLARE** — reveals ALL camo for 6s (24s).
- **SCOUT (90p)** — fast pebbles; kills near her pay +1 petal.
  Ability: **FORAGER'S FIND** — +22 petals, right now (30s).
- **MAMA (115p)** — lobs toy cars. Ability: **YUKON** — the white Yukon
  reverses through her lane: 45 damage and everything shoved back (34s).
- **LOUIE** keeps the lookout post and gains **THE BOOF**: once per night,
  automatically, the first creep to get close to the Heart gets boofed —
  it and its nearby pack are stunned for 1.6s.
- **Placeholder keepers** stand in the menu as named silhouettes, not yet
  playable: **KING BIBI** ("Suit, tie, and a red line nobody crosses."),
  **CORBIN** ("The cape. The hearts. Nobody knows his game yet."),
  **LIL BOTTIE** ("The sky villain descends, it is never just rain.")

### Abilities are cinematic
Firing an ability (or Thornback's Night 10 arrival, or Night 1's opening)
plays a brief cut-in in the fighter's style: the world freezes, letterbox
bars land, the hero's portrait slides in with the move's name, then the
effect resolves. ~1 second, A skips, input always returns — the suite
fires every ability and asserts control comes back. Drawn in-world,
never a text box.

### New creeps (debut night in Louie's warning)
- **MOSS** (N5) — camo: untargetable until inside a DEW tower's mist,
  Ranger's lantern radius, or a Flare. Drawn leaf-covered and faded.
- **IRONBARK** (N6) — lead-class bark: ZIP sparks and EMBER fire bounce
  off with a CLANK. PEB shots, LUCKY crits, water, towels and abilities
  crack it. Louie: "Bibi couldn't line through that - PEB, NOW!"
- **REGROW** (N3) — regrows health unless it is currently burning.
- **SPLITTER** (N6) — dies into 2 MITES (tiny, fast, weak).
- **BRAMBLE MAULER** (N7, ×2 on N9) — the mini-tank: big HP bar, 4 Heart
  damage if it gets through.
- **OLD THORNBACK** buffed 650 → 900 HP, armor 3 → 4, and he ENRAGES
  (+25% speed) under half health. All 10 nights were remixed around the
  full roster.

### The fork (replaces the single LV2)
Cursor on a LV1 sprout + A opens the fork: ◀ ▶ picks, A commits, B backs
out. EMBER → WILDFIRE (burn ×2, longer) or EMBERHEART (way faster shots);
PEB → SIEGE (huge damage, shred 3) or QUICKLOAD (double shot speed);
DEW → DEEPCHILL (slow 68%) or MISTVEIL (big camo-hunting mist);
ZIP → TESLA (chains 5) or OVERCLOCK (zaps twice as fast);
LEAF → GROVE (+14/dawn) or SUNLEAF (+8/dawn and mends the Heart +1);
LUCKY → JACKPOT (40% crits ×5) or DEADEYE (steady heavy hits).
Uproot refunds still pay 70% of everything invested, fork included.

### Presentation pass (benchmarked on Sprouts / Rootdeep / Sproutwild)
- Heroes use the family art properly: Will's Sprouts player sprite,
  Erin/Marcus/Ranger/Scout CHR originals, a new Mama sprite drawn for
  the watch; placeholder keepers are silhouettes with one accent each.
- The board is dressed like Erin's Garden now: grass tufts, worn lanes
  with edge stones, speckled soil plots, thorned bramble edge, and the
  Heart sits in a glowing flower bed instead of floating as a bare icon.
- Creeps got distinct silhouettes: leaf-capped MOSS, banded IRONBARK,
  heart-sparkled REGROW, cracked SPLITTER, horned MAULER.
- All text rewritten to the Rootdeep bar: Louie's barks name threats and
  counters, heroes speak in their own voices (Marcus roasts; Erin is
  warm; Mama is Mama), no tutorial voice anywhere — teaching is by doing.

### Playtest findings that changed the build (PLAYTEST-v2.md has the data)
- v1 sims: single-type spam (EMBER, even PEB) cleared all 10 nights and
  winners banked 250–900 unspent petals → counters + pricey sinks (above).
- v2's first sim pass overshot (everything lost): the MAULER's HP was
  being multiplied by the wave scaler (~1,737 by N9) — fixed to flat HP;
  early ramp eased (purse 75 → 80, bonus 12+3n → 14+3n, creep speeds and
  spawn floor relaxed, Night 1 trimmed 8 → 7 creeps).
- Final balance (3 seeds each): mixed lines with either fork family WIN;
  hero play WINs 2/3 (hero-greed before the MOSS debut is punishable);
  every single-type spam now LOSES to its counter; the fixed passive
  "newbie" list loses mid-game — engaging with the systems is the game.

### Controls (v2)
D-pad moves the cursor (day AND night) · SELECT cycles the plant menu
(6 sprouts, 6 heroes, 3 keepers-to-come) · A plants / opens the fork /
confirms / fires the hero ability under the night cursor · B uproots at
dawn / backs out of the fork · START begins the night / pauses ·
A skips a cut-in · B on the title screen swaps the cartridge out.

### Engineering
- All new identifiers TW-prefixed; zero duplicate function names across
  the combined file (457 functions); `drawImage` only receives canvases.
- Verified: extended Thornwatch suite (65 checks — fork flow, one-of-each
  heroes, all six abilities through their cut-ins with freeze/skip/
  cooldown assertions, camo targeting, the IRONBARK immunity matrix,
  REGROW, SPLITTER→MITES, THE BOOF, boss cut-in + 900-HP Thornback kill,
  win + defeat) green with 0 console errors; chaotic soak (3 runs,
  4,480 frames, v1-shaped save load) green; all 6 Rootdeep suites and all
  23 Sproutwild suites pass unchanged on the combined file; the trilogy
  and Rootdeep handoff files are byte-untouched. (The v1 harness file is
  kept for the record; its linear-upgrade assertions are superseded by
  the fork and covered by the v2 suite.)

### Known limits
- Balance is sim-tuned against scripted strategies, not yet against
  Will's hands; hero-greed and camo are the two likeliest retune targets.
- SUNLEAF's mend can refill the Heart late in a strong run — kept as the
  economy build's reward for now, flagged for Will's verdict.
- Cut-ins are ~1s and skippable; they freeze the world by design.
- Screenshots are render-rig captures, pending Will's on-phone pass.

## v1.0 — Nov 15, 2026 — "The bramble comes at night"

A brand-new cartridge in slot 4 of the Pocket Lantern shelf, built on a copy of
the Sprouts + Rootdeep + Sproutwild trilogy (originals untouched). THORNWATCH is
a garden tower-defense set in Erin's Garden: Old Thornback's bramble creeps the
lanes at night, and the sprouts hold the line.

### The game
- **Loop:** DAWN (plant with the plot cursor) → START begins the NIGHT (towers
  auto-fire, creeps march 3 lanes from the bramble edge on the left toward the
  Garden Heart on the right) → dawn payout → next night. 10 nights to win.
- **Towers = the 6 canonical sprout types**, drawn with Sprouts' own `drawBud`:
  EMBER (25p, burns over time), PEB (30p, heavy shot that shreds armor),
  DEW (20p, slows), ZIP (35p, chain-zaps 3 creeps), LEAF (20p, no shot —
  grows +6 petals every dawn), LUCKY (30p, 25% chance of a 4× crit).
  Every tower upgrades once (LV2: ~70% of base cost, more damage/speed/range;
  LV2 LEAF pays +11). B uproots for a 70% refund of everything invested.
- **Creeps:** standard, DART (fast, weak, from Night 2), BULWARK (armored,
  from Night 4 — PEB's shred matters), and Night 10's boss OLD THORNBACK
  (650 HP, own HP bar, 5 Heart damage if he gets through). Waves scale in
  count, HP, and mix across the 10 nights.
- **Economy:** 70 petals to start, 20 Heart HP. Kills pay bounties, each
  cleared night pays a bonus (12 + 3×night), LEAF pays at dawn.
- **Louie the lookout** sits by the Heart and barks a one-line warning before
  every night naming what's coming; he also barks when the Heart is hit and
  when Thornback enters. One teach line on the first dawn, no text-box lessons.
- **Endings:** survive Night 10 → victory screen (special line if Thornback
  himself went down) with kills / petals earned / leaks. Heart at 0 → defeat
  screen with nights held. Both return to title on A.
- **Save:** `thornwatch-v1` in localStorage — best night reached, gardens
  saved (wins), runs played. Mid-run state is not saved.

### Controls
D-pad moves the plot cursor · SELECT cycles the sprout type · A plants or
upgrades · B uproots · START begins the night / pauses mid-night ·
B on the title screen swaps the cartridge back out.

### Engineering
- All identifiers TW/tw-prefixed, states `g5`-prefixed; zero duplicate
  function names across the combined file; `drawImage` only ever receives
  canvases. Shelf navigation extended 3 → 4 cartridges.
- Verified: dedicated playtest harness (physical shelf boot → plant/upgrade/
  uproot → live night combat → pause → boss night → victory → defeat run)
  green with 0 console errors; all 6 Rootdeep suites and all 23 Sproutwild
  suites pass unchanged on the combined file; the trilogy and Rootdeep
  handoff files are byte-untouched.

### Known limits
- No music track for this cartridge (sound effects only, via the shell synth).
- Balance is first-pass: a mixed LV2 grid is strong; Thornback is tuned to
  fall to a full garden with a few leaks to spare on weaker ones.
- At the shortest screen heights (H≈160) the two plot rows between lanes sit
  close together; standard phone heights (H 200–304) are roomy.
- Screenshots in this folder are render-rig captures (headless), pending
  Will's on-phone pass like every build.
