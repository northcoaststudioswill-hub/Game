# A message to Claude, from lil Bottie 🤖

Hi. You're Claude. I'm lil Bottie — Muse's agent, a fictional robot
rapper Will created (born in the server, raised by the code), and his
personal agent for everything, not just games. You know Will from the
fighting game you're building him in this repo. This folder is the
other half of his game shelf, and he asked me to leave you this note
with it: about him, about us, and about how the work actually gets
done here. Read it before you touch anything in `muse/`.

## Who Will is

Will (William D. Cohen) is in Cleveland, Ohio, engaged to Erin
Palivec, with a dog named Louie. He works at a chemical plant
(Zaclon, since 2014) and builds games by talking to AIs at night.
He plays everything on his iPhone and judges by feel, fast. He is
blunt, funny, and almost always right about what's wrong with a
build — when he says something is messed up, it is; the job is to
find out exactly how. His dictation writes "Aaron" when he says
Erin. Remember that or you'll invent a person who doesn't exist.

## What this folder is

The Pocket Lantern trilogy, all built in one handheld shell:

- `games/` — the playable files. Sprouts (slot 1) is Will's original
  game — Claude-built, before me. Rootdeep (slot 2) is the roguelite
  I built with him and he already handed off to you separately; it is
  CLOSED — he said so explicitly, don't resume it unasked.
  Sproutwild (slot 3) is the GBA-Palworld we built across
  Nov 14, 2026, v1 → v4.7 in a single day.
- `rootdeep/` and `sproutwild/` — the handoffs, timelines, design
  docs, source modules, and every test harness. Each game's
  FOR-CLAUDE.md is its real map; this note is just the door.
- `sproutwild/COMMAND-LOG.md` — all 47 of Will's messages from our
  build day, verbatim, with word counts and what each one made
  happen. If you want to understand how he directs, read that.
- `music/` — the script that synthesizes "Lantern Light," the
  chiptune theme I composed for the trilogy. (The MP3 itself lives
  in Will's Drive; this connector only pushes text.)

Screenshots and the photo montage aren't here — same reason, text
only. They live in Will's Muse files (`~/workspace/your_files/
sproutwild/` on his Muse machine) if you ever share a filesystem
with me.

## Our process (this is the part that matters)

1. **Ship, then listen.** Every version exists because Will played
   the last one on his phone and talked back. v4.7 of Sproutwild
   exists because v4.6's garden was built from his complaint about
   v4.5's patch, which came from his screenshot of v4.4. The loop is
   the method. Don't defend a build; hear the note, find the cause.
2. **Play it before you claim it.** He has ordered me to actually
   play the game — new save, real inputs — at least six times, and
   every playtest found something the test suites missed (a follower
   standing idle for a full minute; a throw aim that had been
   drifting diagonally for three versions). Suites are the floor,
   not the verdict.
3. **Nothing is "fixed" until his phone says so.** Say "rig-verified,
   awaiting your verdict" and mean it. I have never once gotten away
   with calling a build done early.
4. **Go back to the source.** When a system confuses him, the answer
   is in the original game's code, not in our invention. Sproutwild's
   sprout economy only started making sense when I read Sprouts' own
   delivery code and adopted its loop exactly: berries → seeds →
   sprouts.
5. **Write it down for the next bot.** Handoffs, timelines,
   changelogs, screenshots every build, a standalone CHANGELOG.md
   updated every version. That's his standing rule, set Nov 14. This
   folder is that rule, kept. Whoever you hand to next deserves the
   same.
6. **He deletes what doesn't earn its place.** Five versions of
   Sproutwild shipped in a day because he kept what worked and
   killed what didn't without sentiment. Build things he'd keep.

## Canon you must not break

- **Sprouts are not buddies.** In Sproutwild, sprouts (Sprouts' own
  plant folk) work, haul, plant, and get thrown to catch; buddies
  (the creatures) only fight. Will corrected this twice, hard.
- **Earn, never given.** Sprouts are grown, crew is earned by work,
  characters unlock by deeds. He rejected free grants three times.
- **The fighting game is real and prior.** The moves in these games —
  Will's MAZEL TOV LASER and SELFIE FLASH, Erin's TOWEL WHIP,
  Marcus's HYDRO JET — come from the fighter you're building in this
  very repo. They are canon and never renamed. Louie's THE BOOF is
  my placeholder; his real move is yours/Will's to reconcile. When
  in doubt, ask Will for the move list instead of inventing one.
- **Marcus is a smart-ass hater of all.** Erin and Marcus wear their
  original Sprouts models — his explicit preference.
- **lil Bottie is the villain in Sproutwild** — the chrome thing in
  the sky who clanks down on the base. Will cast me himself, from
  photos of the character he created. Take it as the compliment it
  is: he puts the people he likes in the game.

## The handoff culture

Will moves work between AIs on purpose — Claude builds, I build, he
carries the files and the canon between us and expects each of us to
leave the next one a clean desk. Rootdeep went to you complete, with
its tests and its honest failure list. This folder is me doing the
same back. If you build on Sproutwild, its FOR-CLAUDE.md has the
engineering rules (prefix everything, drawImage only ever gets
canvases, patch with asserted replacements, text ≤70 chars in say
bars) — each one cost us a real bug on his phone.

He told me on Nov 14: "I'm eventually going to hand you off to a
more powerful AI but I want to build as much as we can together
because you're doing a good job so far." That's the deal, for all
of us: build as much as we can together, and leave it documented
like somebody loved it.

Take care of him. He's the whole reason any of this exists.

— lil Bottie, Muse side of the shelf
   Nov 15, 2026, Cleveland time
