# Pocket Lantern: development snapshot

**Version:** v0.2 (pre-alpha), Nov 14 2026
**Where:** GitHub `northcoaststudioswill-hub/Game`, branch `claude/adoring-shannon-825i25`, folder `v0.2/`
**Play it:** `v0.2/share/pocket-lantern-v0.2-share.zip` (send this), or the private test page https://claude.ai/artifact/TtWoCTcCU9ZZfkrWkyUZtQ
**Rollback:** `v0.1/` is untouched (backup SHA-256 `89b5c45c…a0f8`)

## The console

A pretend handheld in one HTML file (about 8.9 MB with music), played upright on a phone. A cartridge shelf with three slots, an 8-way D-pad,
A/B (plus X/Y for the cartridges that use them), Select and Start. Saves stay in the browser on that device.

| Slot | Cartridge | State |
| --- | --- | --- |
| 1 | **Sprouts** | The cozy home game. Mature and the canon of the universe. Unchanged in v0.2 (taken from v0.1, v19). |
| 2 | **North Coast Knockout** | 2D fighter, 8 fighters. Unchanged in v0.2. Its art may be reimagined later. |
| 3 | **Rootdeep** | New in v0.2. The roguelite under the valley. This version's work. |

## Sprouts (slot 1): where it stands

- You're Will, keeper of the Great Lantern. Erin gives quests, and Louie is your dog.
- A squad game: pluck sprouts, throw them, and whistle them back.
- **Content:** sun shards, a boss (Old Thornback), Erin's garden, the house, 5 valley projects (including Marcus Waterworks), daily asks, 36 achievements, bugs and treasures.
- **Capsules:** a capsule machine of 48 styles, which now also holds Rootdeep's 11 unlocks.
- **New in v0.2:** RESET PULLS in Settings.
- **Known:** the title music streams from the original page, so a downloaded copy plays without it.

## North Coast Knockout (slot 2): where it stands

- **Fighters:** Will, Erin, Louie, Lil Bottie, Gas Guy, Corbin, Marcus and Mama, each with two specials, a super and a finisher.
- **Modes and controls:** arcade and versus, four face buttons, and its battle theme built in.
- **Canon for Rootdeep:** the keepers' Rootdeep moves are taken from here.

## The Lantern menu (console level, new after this snapshot was first written)

On the cartridge shelf: one capsule machine for every cartridge, stats from all three games, and 14 Lantern achievements that span the games and pay capsule tickets. Every cartridge earns tickets.

## Rootdeep (slot 3): what's in

**Structure**
- **The Hearth:** a hub with five stations as furniture (Sprout Digs, Armory, Keepsake Shelf, Codex, Pact gate) and the cast in their corners.
- **Runs:** 12 chambers across 3 areas (the Burrows, the Flooded Vault, the Ember Core).
- **Bosses:** the Grub Mother, the Drowned King and the Hollow Keeper.
- **Rewards:** two reward doors per chamber, plus boons from 6 sprout gods, a shop, fountains, Sunfruit and honey.

**Keepers**
- **Will, Erin, Louie and Marcus** each have two specials and a super, taken from Knockout, on the same buttons as there.
- **The Sprout King** is new canon. He commands the buds.
- **Unlocks:** each keeper unlocks through play, or from capsules.

**Sprouts**
- **The swarm:** buds swarm foes, latch on and chew, then come home when the room is clear.
- **Collecting:** pluck buried ones with A, or pick up pods.
- **Banking:** they're banked into the Ledger even when you fall.
- **Lifetime milestones** pay out Moondew.

**In the rooms:** pots, berry bushes, root chests and boom bulbs.

**Progression and saving**
- **The Sprout Digs** (was the Mirror): 8 permanent upgrades, dug by your sprouts with Moondew.
- **The Burrow** (the bottom door): every descent plays a keeper-specific drop scene.
- **Between chambers:** a short scene every time: chamber cleared, rescued overflow sprouts climbing home, the drop, the next chamber's card.
- **Hearth menu** on Start: save, settings, capsules, new game, quit to title, swap cartridge. A SAVED mark shows when it saves.
- **Keepsakes and weapons:** 5 keepsakes and 3 weapons.
- **The Pact of Roots:** heat levels, unlocked after your first escape.
- **Saving:** a run checkpoints every chamber, with Continue and New Game on the title menu and Save & Quit on pause.

**Story and feel**
- **Cinematics** in Sprouts' cutscene style: the intro, each boss's first appearance, the first escape, the Sprout King's arrival, and a rope-rescue death scene.
- **A smooth start:** Erin walks over with the welcome, an objective bar with an arrow, and one-at-a-time tips in chamber 1.
- **Walk-ups:** characters cross the Hearth to explain things when they matter (the Digs, the Ledger, unlocks, the Pact, capsule tickets).
- **Growing dialogue:** 38 topics that unlock with milestones and keeper logs. Marcus's voice is locked to Sprouts', with Waterworks lines only once it's built and the occasional "J".
- **Art:** pixels drawn true to size in Sprouts' style, lantern lighting with wall lanterns that relight when a room is cleared, animated attacks, foe warnings and hit-stop.

**Checks**
- **Automated:** a text audit (257 screens at iPhone 16 Pro Max size), keeper moves, the full roguelite loop, capsules and reset, cinematics, saves and onboarding. All pass.
- **Playtest:** see `PLAYTEST_REPORT.md`.

## Known issues and open questions

1. **Not confirmed on the iPhone yet:** the text-placement fix, touch feel and frame rate.
2. **The Mothshade** caused every death in the playtest; its blink-behind may feel unfair.
3. **Pacing:** rooms clear in 4 to 10 seconds, and the Mirror is generous. Difficulty is deliberately untouched until Will has played more.
4. **The chamber 6 stall** from the playtest wasn't reproduced; most likely the bot. Watch for it.
5. **Music:** Rootdeep's music is a placeholder synth loop and needs a William Cohen track.
6. **The "three little auto balls":** still unidentified. Waiting on Will.
7. **Sprouts' house** is due an upgrade in Sprouts itself (not started; out of scope for Rootdeep).

## Next up (suggested)

1. Will's play notes on v0.2 (all three cartridges).
2. A balance pass if needed: room length, the Mothshade, Mirror costs.
3. Rootdeep music.
4. More of the universe: Knockout's other cast (Lil Bottie, Gas Guy, Corbin, Mama) in Rootdeep, once Will hands out the canon.
5. The Sprouts house upgrade, in Sprouts.

## Files

| Path | What |
| --- | --- |
| `v0.2/games/` | The working build |
| `v0.2/src/rootdeep.js` + `v0.2/build.py` | Rootdeep source and the splice script |
| `v0.2/share/` | The sendable folder and zip |
| `v0.2/backups/` | Frozen v0.2 snapshot |
| `v0.2/handoffs/` | Session handoff, Rootdeep design doc, art manifesto |
| `v0.2/playtest/` | This snapshot, the playtest report, screenshots |
