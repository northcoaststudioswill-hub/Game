# THORNWATCH v3.7 — The NOOB Round (Playtest Report)

Will's commission (Nov 16, 2026): **"Keep playtesting and
working on the game as if you're a noob and if this is
something you'd play and then make edits to make the game
more fun and better."**

Method: four first-time-player personas driven through the
real input path on fresh saves (`playtest-noob37.js`), knowing
only what the game shows them — then fun-first edits, each
cited to a persona moment, then every persona re-run on the
fixed build. Expert sims re-run to prove the ceiling didn't
move. All verification headless; **nothing here is
phone-verified.**

## The personas and their v3.6 fun timelines

**THE TAPPER** — skips all text, plants EMBER/ZIP/LUCKY by the
entrance, never upgrades.
- v3.6: reached the night-7 cap alive — but the log exposed
  why: his plant-mashes fell through the fork panel and
  **accidentally bought a fork on night 1 and a 480p GRAND on
  night 6**. His "no-upgrade" run was secretly upgraded.
- First kill ~2s into round 1 (delight), first leak not until
  night 5. Kills paid silently — nothing celebrated anything.
- Verdict: fun carried by the towers' visuals; the game's own
  reward systems never spoke to him.

**THE HOARDER** — plants DEW+LEAF once, never spends again.
- v3.6: **3 kills in three nights.** DEW (dmg 2) can't finish
  a 17hp grub inside its range and LEAF doesn't shoot, so he
  watched 38-second rounds of creeps strolling past
  (watch-only 20.7s of night 1; first kill at t=25s), leaked
  4 → 11 → died night 3 holding 74 unspent petals. The game
  never once told him his garden couldn't fight. His one
  "discovery" was an accidental mash-fork of the DEW.
- Verdict: the quit moment. Death felt like the game's fault,
  because it kind of was — silence, not difficulty.

**THE RANDOM** — seeded chaos: random cards, random cells,
stray B presses.
- v3.6: one corner tower on night 1 → **0 kills**, 6 leaks,
  17.5s of watch-only in a 30s round. Died night 3 with 100
  unspent petals. Discovered 0/10 systems.
- Verdict: honest mistakes in nights 1–3 are punished with
  boredom first (nothing to watch but walking) and confusion
  second (no explanation at the end).

**THE RETURNING CASUAL** — light guided play to night ~5,
quits, returns cold to the frontier + map + upgrades.
- v3.6: the good news — map select refuses locked modes/maps
  with plain notes, upgrades buy first-try, frontier restart
  works. The bad news — session 2's rebuild mash **bought a
  480p GRAND he never chose**, leaving 1 petal and a 2-tower
  garden.
- Verdict: the meta layer explains itself; the core loop's
  A-button economy does not.

**Cross-persona metrics (v3.6):** heroes planted 0/4
personas, powers opened 0/4, training 0/4, SUNFARM 0/4 —
despite the tapper sitting on 131–442 petals for three dawns
with keeper cards one strip-scroll away. Watch-only time ran
6–21s per early night for everyone. Empty-screen time was
0.0s everywhere (spawn pacing is fine; the dead air is
out-of-range walking, addressed with signals, not retunes).

## The edits (patch37.py + 37b–e, all count-asserted, atomic)

1. **Kills pay visibly.** A petal sprite flies from every
   corpse to the HUD petal counter; arrival pulses the
   counter and ticks a coin blip (throttled). Bounties ≥10
   float '+N' at the kill (gold ≥40). *Evidence: every
   persona's silent kills.*
2. **Crit fanfare.** A crit that lands the kill (crit marked
   in `twHit`, 1.2s window) bursts gold, floats 'CRIT!',
   pops higher. *Evidence: LUCKY's card promises huge crits;
   v3.6 crit kills were invisible.*
3. **Dawn reward card.** Every cleared night: 'NIGHT N
   CLEAR!', stars filling in, '+X PETALS · Y POPS', 'NO
   LEAKS! THE HEART IS WHOLE' or 'LEAKS n · HEART h'; 3-star
   nights get a chime. Skippable; **START dismisses it and
   starts the next night in one press** (37b — the first
   build ate that press every dawn). The old Heart floats
   were retired in 37e — the card says it better, and they
   collided with the card's text in the capture.
4. **Defeat lesson.** The defeat screen names the night's
   top leaker with its field-guide counter, count-first so
   the advice survives the fit cap: 'x6 DART · DEW SLOWS IT
   DOWN'. Leak kinds tracked per night (`TWR.leakK`).
   Field-guide GRUB counter reworded 'ANY TOWER POPS IT' →
   'ANY SHOOTER POPS IT' so the hoarder's lesson is advice.
5. **Danger warning.** A creep past 78% of its path: Louie
   barks 'WOOF! TOO CLOSE!' (throttled, never clobbers a
   fresher message) and the HUD heart flashes red and grows.
6. **No-shooter bark.** A round that starts with no tower
   dealing ≥4 damage and no hero hears 'WOOF! TOO WEAK!
   PLANT SHOOTERS!' instead of the usual warning. *Evidence:
   hoarder + random, night 1.*
7. **Keeper-price bark.** First dawn a run holds 90+ petals
   with no keeper planted: 'WOOF! A KEEPER COSTS 90P!'
   *Evidence: heroes discovered 0/4; tapper banked 442p.*
8. **Panel intent window (the mash fix).** Fork and train
   panels ignore A presses in the first 0.13s after opening.
   v3.7 first shipped 0.22s; the casual's *deliberate*
   double-tap failed against it, so it was re-measured and
   set to 0.13s (probe: blocked at ~2 frames, lands at
   ~8–10). Deliberate play is untouched; ≤7Hz mashing is.
9. **Float clamp.** Float text is clamped on-screen (the
   dawn-card capture caught the Heart-anchored '+17 PETALS'
   running to x=243 at audit width).

## After: the personas re-run on v3.7

| Persona | v3.6 | v3.7 |
|---|---|---|
| Tapper | alive at cap via accidental fork+GRAND | **true no-upgrade line: 3★ nights 1–3, first leaks N4, dies N6** with 534–558p unspent; dawn card every night; danger bark N4; **0 accidental buys** |
| Hoarder | died N3, 3 kills, silence | died N3 (he still won't spend — that's the persona), but the game told him: TOO WEAK bark at N1 start, TOO CLOSE bark, dawn cards reading '0 POPS · LEAKS 12'; 0 accidental buys |
| Random | died N3, 0 kills N1, 0/10 | died N3; TOO WEAK + TOO CLOSE barks fired; dawn cards fired; 0/10 discovery (honest — chaos finds nothing, but now it hears why it's losing) |
| Casual | fork ✓, accidental 480p GRAND, meta tour ✓ | fork ✓ (deliberate press lands), **no accidental buys**, session-2 frontier cleared at ♥13 with a 5-tower rebuild, keeper-price bark heard, map + upgrades tours clean, perk bought |

**Would-I-keep-playing verdicts:** Tapper — yes; his loop
now celebrates itself and his death on N6 reads as "I needed
to grow my towers," which is the game's actual lesson.
Hoarder — still dies, but the death is now *explained three
times before it happens*; whether a human hoarder course-
corrects after 'TOO WEAK' + a '0 POPS' dawn card is the one
thing a scripted persona can't prove. Random — the first
night is still his worst (one badly placed tower is a long
walk), but he is warned, counted, and taught at the end.
Casual — yes, unchanged strength, minus the theft.

**Discovery after:** fork (casual, deliberate) + map +
upgrades + perk = casual 4/10; heroes/powers/train/farm
remain undiscovered by scripted noobs — the keeper bark now
names the hero system in plain words, but no persona acts on
barks by construction. Flagged, not solved: if Will wants
heroes found, the guide needs a step 7 — a design call, not
a bug.

## Expert ceiling — unchanged

playtest-37 (the v3.6 sim script) on v3.7: expert clears all
3 maps × 3 seeds, Hard pattern identical, ALT clears, powers
A/B identical, endless 14/13/15 (v3.5 range 9–15). The
script's section-C failure set is **byte-identical on the
v3.6 build** (7 cases: the probe starts one night and never
presses START again, so any board surviving night 1 idles at
dawn — a pre-existing probe defect; real defeat paths are
covered by the harness's staged cases, all green).

## Suites (final build, md5 9b879390975751c7426542bee1b1e11f)

- THORNWATCH37_OK (core, incl. 12 new v3.7 checks: barks,
  crit fanfare, petal fly, dawn card, danger, leak tracking,
  mash guard both directions)
- FRONT37_OK · MIGRATE37_OK ×7 · SOAK37_OK · NAIVE37_OK
- RENDER37: 32 shots, FIT 0, zero errors; new shots
  tw-dawncard / tw-critpop / tw-danger / tw-defeat37
  eyeballed (critpop's staged kill sits at the path entrance,
  so its float crowds the corner art — a probe artifact;
  in play, crits happen under towers)
- 519 function declarations file-wide, zero duplicates;
  node --check clean
- Regression tails: Rootdeep 6/6, Sproutwild 23/23 (see
  regressions-v37.log)

## Honest leftovers

- The intent window is a mitigation: a masher tapping slower
  than ~8Hz can still buy on a later beat — but by then the
  panel has been readable for a full beat, which is the
  honest line between mashing and choosing.
- The dawn card costs up to 2.6s per dawn if never dismissed
  (A/START dismiss; START also starts the night). On a
  26-night campaign that is real time; it earns it in
  teaching stars to new players, but a settings toggle is
  Will's call if it ever feels slow.
- Watch-only stretches remain (up to ~15s on late nights for
  entrance-campers): inherent to a long path; the danger
  bark + flies give it texture, but a mid-path event system
  would be a feature, not a fix.
- Heroes/powers/train/farm still need a human's curiosity;
  see the guide-step-7 flag above.
- Nothing is phone-verified. Derek untouched (veto pending).
