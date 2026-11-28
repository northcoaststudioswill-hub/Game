# VEX — Code Findings (Rootdeep 64)

Sources read: `README.md` and `src/*.js`. Line numbers refer to `src/`. Each blind finding (B#) is matched to its cause in the code. After that comes a systems audit (A#) of things I could only see by reading the code.

## Part 1 — Blind findings vs. the code

| # | Blind finding | Verdict | Cause |
|---|---|---|---|
| B1 | Solo wall at ch2–3 (**major**) | **Confirmed** | Foe HP grows +30% per chamber and damage +9% per chamber (`game.js:134`). By ch3 a Grublet has 42 HP and a Root Beetle 93, against a 13/13/19 light combo (`data.js:54`). Contact damage hits every 0.85 s per foe (`game.js:461`). Solo has no revive except Death Defiance (`game.js:403-404`). |
| B2 | Boons arrive too late (**major**) | **Partly confirmed, partly my misread** | Door kinds are drawn from a 9-item list with only 2 `boon` entries (`game.js:166`). That gives about 40% odds that ch1 or ch2 offers any boon door. A boon door is only guaranteed after **ch3** (`game.js:168`), which is exactly where solo players die. What I called "no boon" on ch1 was the guaranteed sprout pod (`game.js:159`), which is not a door. Some doors I skipped were probably boon doors, because they carry a god's name (PEB, DEW...) and not the word "boon" (`ui.js:102`). |
| B3 | Same-keyboard P2 is degenerate (**major**) | **Confirmed. Design choice, with first-guess balance** | P2 on one keyboard is intended (`input.js:11,46-48`; README "Keyboard 2"). There *is* scaling: chamber budget `+round((n-1)*(2+ch*.5))` (`game.js:150`), about +60% foes at ch1, and boss HP +75% per extra keeper (`game.js:139`). But the second player doubles DPS and the HP pool, brings a second super, and **revives are unlimited** (2.2 s standing, back at 30% HP: `game.js:526-528`). Downed keepers also auto-stand at the next chamber (`game.js:133`). Foes ignore downed keepers (`game.js:364`). Net result: one human with two hands has a large edge. README admits "Balance for 2–4 keepers is first-guess numbers". My blind claim of "no visible enemy scaling" was **wrong**. |
| B4 | P2 controls undocumented (**major**) | **Partly wrong** | The hub footer shows `( , ON KEYS)` when one player is present (`ui.js:73`), so joining *is* hinted. P2's hit/cast/special/super/dash binds are never shown in-game. The ch1 control hint is drawn only for `lead0()` (P1) (`ui.js:118`). Binds exist in `ui.js:38` (`btnName` for kb2) but are only used in menus. P2 dash is `/` or Right Shift (`input.js:48`). I tried Slash only as a "super" key. Downgrade to **minor**. |
| B5 | Turrets relocate/teleport (**major**) | **Partly wrong** | Spore Spitters don't teleport. They *kite*: inside 70 units they walk directly away (`game.js:468`), and they fire every 1.9 s when within 125 units (`game.js:470`). Kiting plus obstacles (`game.js:129-131`) plus wave-2 pressure made it look like relocation. The only blink foe is the Mothshade (`game.js:474-475`). The design issue (a ranged kiter vs. a melee kit with no gap-closer before boons) stands as **minor**. |
| B6 | Cast misses at off angles (**major**) | **Confirmed, with a second cause I missed** | Aim is `dev.mx/my`, which on a keyboard is 8-way digital (`input.js:43`, `game.js:361-362`). There's no aim assist on Will's laser (`game.js:434`). More importantly, Will has **1 cast charge with a 3.2 s regen** (`game.js:120,430`). Most of my "wasted volleys" never fired at all. Ammo shows only as a tiny pip (`ui.js:95`). |
| B7 | Contact-damage spikes (**major**) | **Confirmed (mechanics)** | `touchHit` deals full `e.dmg` on overlap, then a 0.85 s per-foe cooldown (`game.js:460-461`). Player i-frames last only 0.55 s (`game.js:398`). Two or three overlapping foes can chain hits. Beetle charge is 175 u/s for 0.42 s after a 0.45 s wind-up (`game.js:477-479`). My 60→17 came from several sources, not one hit. |
| B8 | Player hidden by scenery (**major**) | **Confirmed** | Obstacles are opaque blocks 13–22 units tall (`models.js:325`). The camera pitch is 0.8 rad (`models.js:239-244`). There's no fade, outline or x-ray pass. In solo the only cue is the colour ring (`models.js:262-263`). |
| B9 | Boss dialogue box covers player (**minor**) | **Confirmed** | The subtitle box draws at `VH-50` from the bottom, with 0.84 opacity, centred (`ui.js:126`). Keepers spawn at `H-26`, near the bottom (`game.js:132`). |
| B10 | "Dew" vs. "DEW" collision (**minor**) | **Confirmed, and worse than I saw** | A Moondew door's label is `d.kind.toUpperCase()`, which is `DEW`. A boon door for the DEW god is also labelled `DEW` (`ui.js:102`). The run HUD also calls Moondew `DEW` (`ui.js:114`). The two doors differ only by icon and a slightly different blue (`ui.js:35`, `data.js:21`). |
| B11 | Rarity inversion (**minor**) | **Mostly a text bug** | Passive descriptions return static text (`game.js:87`), so a RARE Storm Luck *displayed* +8% but was actually 8×1.45 = **12%** (`game.js:80`, `data.js:51`). It's still weaker than +35% attack, because passive and core values aren't on comparable scales. The real problem is that every passive's card hides its rarity and level bonus. |
| B12 | Boon numbers change between offers (**nit**) | **Design** | Value = base × rarity (1 / 1.45 / 1.95) × (1 + 0.18 × (level−1)) (`game.js:79-80`). Thorn Edge at 35% → 51% is just COMMON → RARE. |
| B13 | Doors lead to a shop (**minor**) | **Probably wrong (my error)** | `doorReward` maps each kind 1:1 (`game.js:177-186`). In solo a door fires on contact with no confirmation (`game.js:604`), and the two doors are 76 units apart (`game.js:169`). I most likely brushed the neighbouring SHOP door. Keeping a **nit**: solo has no confirm step, while co-op requires 0.6 s (`game.js:604`). |
| B14 | HP lost across stall transition (**minor**) | **Couldn't find** | Nothing in `shopUpdate` or `rdNextChamber`/`rdArena` (`game.js:310-314,145,129-133`) changes HP. Probably a hit before entering. Withdrawn. |
| B15 | Enemy spawns on top of player (**minor**) | **Confirmed (no exclusion radius)** | Wave 1 spawns in the top 45% of the room (`game.js:155`). Wave 2 uses the same rule wherever the player stands (`game.js:599`). There's no minimum distance. A 0.5 s `born` grace blocks touch damage (`game.js:137,462`), which softens it. |
| B16 | Lopsided Moondew economy (**major**) | **Confirmed** | Moondew per kill: 25% chance of 2 (`game.js:389`), so about 0.5 per kill. A Moondew door pays 20–34 (`game.js:181`). A boss pays 40 (`game.js:173`). The Mirror's full cost is **624 Moondew** (`data.js:57-65`). Solo deaths at ch2–3 (about 10–15 kills) bank 0–8. Dying and escaping bank identically (`game.js:196-197`). |
| B17 | Heavy outclasses light (**minor → major**) | **Confirmed, worse than I measured** | Heavy = max(weapon dmg) × 2.4 = **45.6** with the blade (`moves.js:71`). Pressing A fires a light hit *first*, and the heavy fires on release (`moves.js:100-102`), so each heavy cycle is 13 + 46 every ~0.83 s (0.45 charge + 0.375 cd), about **71 DPS**. The light combo does 45 per 0.9 s, about 50 DPS. Heavy also has more reach (32 vs. 27), a wider arc, a 0.45 s root on everything hit, and ignores crab shields (`game.js:366`). With the maul: 30 + 72. |
| B18 | Bike Lane sometimes deals nothing (**minor**) | **Confirmed (by design)** | The bike starts at the room edge *behind* the player and runs along the 8-way aim line, hitting each foe once within `r+15` (`moves.js:55,66,109`). Off-line targets are missed. It hits for 62 × dmgMul × castMul and crits double. |
| B19 | Floating text clutter (**minor**) | **Confirmed** | Every hit pushes an `ftext` (`game.js:371`). Selfie, scatter, join and super-ready pile on at the same spot (`game.js:399,415`, `moves.js:30`). There's no merging or cap. |
| B20 | Max HP / flower applied unevenly (**minor**) | **Half wrong, half confirmed** | Max HP is global: `bonusMax` and Pressed Flower are in `rdStats` for every keeper (`game.js:71`), so a 130 vs. 155 split shouldn't happen. I probably misread a panel. **Confirmed:** Pressed Flower's post-boss full heal and the Heart door's +25 heal skip downed keepers (`alive()` at `game.js:175`, `rdHeal` at `game.js:89,183`). |
| B21 | Errands only progress after asking (**minor**) | **Wrong** | Progress reads lifetime stats retroactively (`story.js:30-100`, e.g. `m1` reads `maxCh`). Asking only reveals the errand, and the Board shows `???` until then (`story.js:102,157`). Kept as a **nit**: the Board should show titles. |
| B22 | Thin settings (**minor**) | **Confirmed** | `setUpdate` has 3 rows: music, SFX, shake (`game.js:620-626`). No rebinding, no assist. |
| B23 | "Dash power 14" is meaningless (**nit → minor bug**) | **Confirmed, plus a wrong label** | `boonDesc` prefixes every non-attack core boon with **"Cast +v%"**, including dash boons (`game.js:86`). Sixth Sense claims "Cast +14%" but doesn't touch cast damage (`castMul` reads only `b.cast`, `game.js:73`). |
| B24 | Petal Purse is free money (**nit**) | **Confirmed** | 50 petals → +90 petals, net +40 (`game.js:193`). It can't be bought twice (`sold` flag, `game.js:313`). Intentional joke ("somehow profit"). |
| B25–B30 | Praise | Confirmed | Hub, missions and events (`story.js`). King leap telegraph: 0.7 s red ring and "HE LEAPS!" (`game.js:497-500`, `models.js:113`). Death Defiance at 50% (`game.js:404`). Revive ring (`ui.js:108`). |
| B31 | Sound not evaluated | n/a | Square/triangle WebAudio synth (`game.js:27-40`). |
| B32 | Pact sealed until escape | Design | `game.js:302`. |

## Part 2 — Systems audit from the code

**Boon and duo math**

- **A1 [major] Passive boon cards never show their real value.** `boonDesc` returns static `p.d` for passives (`game.js:87`), so rarity (up to ×1.95) and levels (+18% per level) are invisible. Examples: an EPIC Kindled Heart is +49 HP but reads "+25". A Sunfruit level-up on a passive changes nothing on the card. Players can't compare offers.
- **A2 [minor] Dash core boons are mislabeled "Cast +X%"** (`game.js:86`), and the "Dash power X" number feeds different formulas per god. EMBER zone dps is v×1.6 (`game.js:422`), ZIP bolt is v×1.4 (`game.js:425`), LEAF heals 2+v×0.12 (`game.js:427`). PEB and LUCKY ignore v entirely (`game.js:426,428`), so their rarity is cosmetic.
- **A3 [minor] Duos are offered from any god's door** once both parent gods are held (`game.js:103`). The duo is pushed first in *every* offer until taken, which eats a slot from unrelated gods.
- **A4 [minor] LUCKY Fortune Edge's crit bonus is a flat +12%, whatever its rarity** (`game.js:76`). Storm Luck is 8–16%. Crit is ×2 (`game.js:369`). Base crit is 5%.
- **A5 [minor] Flame Strike burn doesn't stack**: `burnDps=max(...)` with a 3 s refresh (`game.js:374`). In practice it adds about 0.22 × hit damage per second, which is weak next to ZIP's 28% chain at 45% (`game.js:376`).
- **A6 [nit] Taking a different god's core boon overwrites the slot and its levels** with no warning (`game.js:109`).
- **A7 [minor] Open Hand only moves odds from common to epic.** Rare stays at exactly 30% at every rank (`game.js:93-94`: thresholds `8+luck` / `38+luck`).

**Scaling with chamber and Heat**

- **A8 [major] Foes outscale player damage in the late game.** Foe HP grows linearly to ×4.3 at ch12, and damage to ×1.99 (`game.js:134`). Player multipliers top out around Might ×1.25 × an EPIC Lv5 attack core ×(1+0.35×1.95×1.72) ≈ ×2.17, so about ×2.7 total. Boss HP *doesn't* scale with chamber (`game.js:140`), but boss damage does. Expect easy bosses and spongy trash late in a run.
- **A9 [minor] Heat raises boss HP by +12% per point** (max 8 points, +96%) (`game.js:140`). The Bounty pays 25 Moondew × new heat per boss, once (`game.js:172`). Foe-side Pact effects: `game.js:134,150`.

**Economy (petals, Moondew, keys, honey, sprouts, missions)**

- **A10 [major] Moondew sources.** About 0.5 per kill (`game.js:389`; Bug Jar ×1.35). Moondew door 20–34 (`game.js:181`). Boss 40 + bounty (`game.js:173`). Missions pay about 555 in total (`story.js:32-98`). Honey gifts after a keepsake pay +5 (`game.js:282`). Sprout sales pay 12/6/5 (`data.js:116`). The Mirror sinks 624, and weapons cost keys. Solo progress depends on boss kills you can't reach yet.
- **A11 [minor] Abandoning a run banks everything, like a death, but doesn't count as one** (`game.js:200,321`). This slows Marcus's 8-death unlock (`game.js:209`) and the "ONE STAR" errand (`story.js:57`). It has no other exploit value, because death already banks everything (`game.js:196`).
- **A12 [nit] Honey costs 80 petals in shops** (`game.js:191`) and drops 2% per kill (`game.js:391`). Erin needs 3 gifts to unlock (`game.js:208`). After the keepsake, extra gifts pay only 5 Moondew, so honey's value drops off sharply.
- **A13 [nit] Petal Purse nets +40.** Sunfruit with no boons pays +60 petals (`game.js:118`), so petals are rarely the constraint.
- **A14 [minor] Keys:** 1 per boss (`game.js:171`), 1 at the start (`game.js:44`), an Old Key in the shop for 120 (`game.js:192`), and mission rewards. The Maul costs 2 and the Bow 3 (`data.js:55-56`). Fine.

**Super, special and heavy vs. enemy health**

- **A15 [major] Heavy is the dominant verb** (see B17): about 71 DPS against about 50 for the combo, with roots and shield-pierce.
- **A16 [major] Selfie Flash (Will's special) is very strong CC.** It roots *every* foe within 82 units for 1.9 s, wipes projectiles in that radius, and recharges in 7 s divided by cast regen (`moves.js:43-46`). Every third combo hit also roots for 0.5 s within 34 (`game.js:415-416`).
- **A17 [minor] The super meter fills faster from damage taken (×0.9) than dealt (×0.22)** (`game.js:369,398`). A bad exchange charges your super, which rewards face-tanking. Bike Lane does 62 per foe, about 1.5 Grub Mother heavies' worth. Boss HP: 430 / 640 / 880 (`data.js:90-92`), about 9 / 14 / 19 blade heavies solo.

**Dead, unreachable or misleading content**

- **A18 [minor] "Elite doors" don't exist.** Ranger's line "Take the elite doors" (`data.js:76`) and errand r1 "TAKE THE ELITE DOORS" (`story.js:80`) refer to a door type the game doesn't have. Door kinds: `game.js:166`. Elites are fixed at ch3/7/10 (`game.js:150`).
- **A19 [nit] Unused moves** (README): TURBO ZOOM, DOUBLE OR NOTHING, launcher/sweep/throw. LUCKY buds come only from Ember Core pods or trades (`data.js:115,117`).
- **A20 [nit] Shipping build exposes the `window.__rd` cheat hooks** (`give`, `goto`, `clearRoom`, `meter`) (`main.js:15-38`).

**Degenerate strategies**

- **A21 [major] One person playing as two keepers on one keyboard**, with unlimited 2.2 s revives (`game.js:526-528`), foes that ignore the downed (`game.js:364`), and a 30% auto-revive each chamber (`game.js:133`). It turns a solo wall into a ch8 run with the same skill.
- **A22 [minor] Heavy-cancel loop**: tap-hold A means a free light hit plus a heavy. Combined with heavy's root, it trivializes single targets (`moves.js:100-102,74`).
- **A23 [minor] Death Defiance, Phoenix and Old Collar only fire on a full wipe** (`game.js:403-406`). In co-op they're effectively a bonus revive *after* the unlimited ones.
