# First-pass review, Nov 15 2026

Read-only note from a Grok pass over [northcoaststudioswill-hub/Game](https://github.com/northcoaststudioswill-hub/Game). Not a handoff. Do not build from this, and do not treat it as the shelf. The current console is still `LATEST.md` on `main`. Nothing in `src/`, `v0.1/`, `v0.2/`, `v0.3/`, or the playable HTML was changed to file this.

This is the first writeup, as given. It landed on the fighter because that session is the repo's default branch. A later pass in the same chat looked at the whole shelf (Sprouts, Knockout, Rootdeep, Patch & Plate, plus Sproutwild in `muse/`).

---

[northcoaststudioswill-hub/Game](https://github.com/northcoaststudioswill-hub/Game) is Pocket Lantern: one phone console, cartridges swapped in. On the branch GitHub treats as default (`claude/2d-fighter-game-characters-r9oir7`), the playable root is still **Sprouts + North Coast Knockout**. Rootdeep, Sproutwild, and Patch & Plate live in side folders and on [PR #1](https://github.com/northcoaststudioswill-hub/Game/pull/1), not in `src/`.

The fighter itself is further along than the repo around it.

## What’s actually good

Knockout is a real game, not a costume on a template. In 724 lines of [src/knockout.js](https://github.com/northcoaststudioswill-hub/Game/blob/claude/2d-fighter-game-characters-r9oir7/src/knockout.js) you have an IK body rig, eight named kits, stages, arcade ladder, meter, throw, block, juggle cap, hitstop, zoom punch, and finishers. Normals are data (`MV`, `MVO`, `MN`). Will’s `MERGE CONFLICT` and Louie’s `NEED MORE LOAF` are the same move slot with different hurtboxes, which is the right way to keep a roster.

The phone shell is also the right call. One HTML file, no install, A/B for Sprouts and X/Y only while Knockout is in. That matches how you actually play it.

The handoffs are unusually honest. `KNOCKOUT_TIMELINE.txt` says the quiet part: CPU-vs-CPU soaks (400+ rounds, no crashes) are not a phone playtest, Marcus underperformed in the last soak, Mama and Corbin are still stand-ins.

## What will bite you

**There is no single current game.** Root `src/` stopped at KO-3. v0.1’s newer Sprouts lives only inside an 8.7 MB HTML blob. v0.2 and v0.3 (Rootdeep, then Patch & Plate) are on the PR branch, built by a different script that splices `rootdeep.js` into a dated HTML file. `muse/` is a third copy, and lil Bottie’s note says Rootdeep is closed and Sproutwild owns slot 3. Claude’s PR says Rootdeep is slot 3 and Patch & Plate is slot 4. Two agents, two shelves. Next session will “fix” the wrong file.

**The default branch is a Claude session name, and `main` is stale.** PR #1 targets that Claude branch, and its base (`7d75a9e`) is already behind HEAD (`616b3d22`, which added the timeline and `muse/`). Merging it blind will fight the README. Also: the repo is **public**, ~135 MB, with home stages, real names, and a re-encoded “Retro Battle Theme” credited to dreamliketextures752. If that track isn’t yours to ship, take it out before this stays public.

**The 8 MB files are the music, three times.** `src/tracks.js` is 8.4 MB of embedded audio. `index.html` is the build of that. v0.1 then stores the same page as game, backup, and zip, plus the mp3s again. Git dedupes the identical HTML, but every new version folder still balloons the clone. Fine for a pause-point. Fatal as the way you keep working.

## Knockout, as a game

Hurtboxes are one box: 16 px wide, 55 tall, 38 if you’re low. Block is “hold back, and lows beat crouch-block, overheads beat stand-block.” Combo damage scales by `0.86` per extra hit, floor `0.35`, and hits only count while the round is in `go`. Juggles die at 3. Corner shoves you back. That’s a complete tiny fighter. It will feel samey once the specials stop being the only difference, because every normal shares one timing table. Louie’s chomp and Marcus’s wrench are seasoning, not new rhythms.

Specials are the opposite of the normals: each one is its own little program (`dash`, `melee`, `leash`, `gamble`, `laser`). That’s why they feel like people. It’s also why a ninth fighter is a code change, not a row in `CH`. Keep it that way until a special is boring. Don’t abstract it early.

The feel risks I can see without a phone:

- Gravity `1250` and jump `380` are “heavy” on paper. On a 240-wide logical screen with tall GBA sprites, jumps may still float because air attacks last `0.4s` of active time. That’s a long button.
- Throw, launcher, and sweep are all direction+button with no motion. Good for a thumb. The failure mode is accidental lows when you’re trying to walk in and press A. Crouch and down-attack need a clearer split once you’ve played three real matches.
- Marcus’s Y is a 55% coin flip that knocks *him* down on a whiff. Funny once. Miserable if the CPU fishes for it, which a simple distance-based `ai()` will do.
- Corbin’s whole kit is the same phrase plus a generic caped rig. The joke lands faster than the character does. He needs either the meme face or one move that isn’t a kiss.
- Win quotes and the move list are doing a lot of the personality. The bodies still read as one rig with a hat. Erin’s hair and Louie’s ears help. Gas Guy, Mama, and Corbin don’t, yet.

Nothing in the repo replaces you playing a best-of-three on the iPhone. The open item from KO-3 is still the open item.

## Do this, in this order

1. Pick the shelf out loud. My recommendation: slot 1 Sprouts, slot 2 Knockout, slot 3 Rootdeep only if you’re still playing it, Sproutwild waits. Write that in one `LATEST.md` and tell the next bot the other note is wrong.
2. Make `main` the default. Point it at whichever HTML you last beat on your phone. Leave the Claude branch names as history.
3. One source, one build. Edit `src/*.js`, run one `build.py`, commit `index.html` only as the share build. Stop splicing into `pocket-lantern_DATE_v20_wip.html`. Freeze backups as git tags, not as a second copy of an 9 MB file.
4. Move mp3s out of the JS bundle, or keep one track in and stream the rest. The console should open in under a second on a phone.
5. Play Knockout for real: Will vs Erin, then Will vs Louie, Normal CPU. Note only three things: did a button do the wrong move, did a hit feel late, did you get bored before round 3. That’s the next patch. Not a new cartridge.
