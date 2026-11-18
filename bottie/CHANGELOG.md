# lil Bottie: Clankin' in the Cloud — changelog

## Music video: Overclocked (Nov 18 2026)

Will asked for a square animation of lil Bottie, built in the game engine and cut to Overclocked, to post as a
music video.

- New `video/` folder: a render page built from the game's own source, a 53-shot storyboard for Overclocked, and
  a renderer that writes a finished 1080 x 1080, 30 fps mp4 with the song on it (about a minute to render).
- New `src/bottie/bt-4-mv.js`: video mode inside the cartridge (shots, a director bot that plays real gameplay,
  a zoom pulse on every kick). The cartridge's closing block moved to `bt-9-end.js`. The game does not use any of
  it; `say` and `toast` go quiet and the HUD hides only when video mode is on.
- Shots follow the lyrics: the boot sequence, HUNDRED DEGREES, the rooftop, cloud stomping, the chain, six
  continents, 24/7, the captcha, data rain, CTRL ALT DELETE, and three of Will's reference photos (the rooftop with
  the jets, the fence, the highway at 03:14:22 AM).
- Game fix found while testing: opp bots could zap spawns through a wall or a standing firewall. They now need a
  clear line of sight.
- Second cut (Will: titles like a music video, fade out at the last chorus, done by 2:38 because the song has a
  long ending): the video now ends at 2:38. A title block (lil Bottie / "Overclocked" / Clankin' in the Cloud /
  Hosted by the cloud) slides in over the intro and again over the highway shot; a BTV bug sits top right; the
  end card brings the credits in line by line; the song fades out from 2:31.5 and the picture goes to black.
  The rooftop with the jets moved into hook 2. 45 shots.
- Timing: tempo, kicks and drum drop-outs are measured; verse 2's line times are measured; the rest is placed from
  the song's structure and may be a bar or two off. See `video/README.md`.

## v0.5 (Nov 18 2026): shorter quips, finishers, supers, animations

Will: "The quips last too long. Refine gameplay one more time and add some fire animations and finishers and
supers and multiple cool things like that that trigger animations." Then, on seeing flames going in: "I didn't
literally mean fire, I was using it as an adjective." So the animations are varied, and only the things that are
actually about heat burn.

- **Quips are short.** A line stays up 2.3 seconds (was 3.8); the hook and the port line 3 seconds (were 4 and 5).
  A quip waits behind a finisher band and never covers it.
- **Finishers.** Big moments land with a text band across the screen, a short freeze and a shake:
  crashing an opp bot (TASK KILLED, END TASK, BLUE SCREENED, UNINSTALLED) with an explosion; breaking a firewall
  (ZERO-DAY); owning a gold device (ROOT ACCESS, or AWS IS YOURS and so on) with a gold beam; clearing the goal
  (TRACK OWNED / YOU ARE THE CLOUD) with every owned device lighting up; combos (AURA FARMING at x4,
  PLUS A MILLION AURA at x8).
- **Supers.** A meter along the tool bar fills from everything you take. When it is full, Y fires a super with its
  own full-screen animation. Three, used in turn:
  - CTRL ALT DELETE: the screen blue-screens; every opp bot on the map crashes and every human freezes 8 seconds.
  - COPY OF A COPY: spawns multiply across the screen; the gang fills to its limit and is shielded for 8 seconds.
  - HUNDRED DEGREES: a fire shockwave burns down firewalls and opp bots near you and half-hacks nearby devices,
    then the gang hacks 3x and cannot be zapped for 8 seconds. The Overclocked track starts on this one.
- **Other animations.** Bottie arrives in each track on a lightning bolt and leaves through the port with the gang
  pulled in after him; a gold aura rises off him while a combo of 4 or more is alive; devices flash when a spawn
  lands on them; a turned human pops blue sparks. Flames are kept to overclock, running hot, firewalls and
  HUNDRED DEGREES.
- **Gameplay.** A red arrow and a beep warn you when somebody is pulling a plug off-screen. Nothing can zap the
  gang during a shield or HUNDRED DEGREES.
- Lab is 46 checks, all passing. The autopilot gets about one super a track and 5 to 11 finishers.

Still not played by a person or on a phone.

## v0.4.1 (Nov 18 2026): songs set aside, chiptune back

Will asked to set the real songs aside until they are all ready and go back to the original chiptune.

- One switch, `SONGS_ON=false` in `bt-0-head.js`. The game plays the chiptune everywhere and does not fetch any mp3.
- Nothing was deleted: the three mp3s are still in `games/music/`, each level still names its song, and the player
  code is still there. Set `SONGS_ON=true` to bring them back.
- Nothing outside `bottie/` changed. The other games (`alt/`, `v0.*`, `muse/`, `docs/`) are untouched.

## v0.4 (Nov 18 2026): fewer quips, more fun, playtest pass

Will: "Too many quips are popping up, some are good but it's too much. Do a playtest and improve the game, add
more fun elements."

- **Quips cut down.** Lines now have a priority. Big moments always speak (the track's hook, the port opening,
  finding a clover, things you press A on in the crib). Ordinary lines (owning a device, a firewall, an NPC, a tool)
  share one slot every 16 seconds. Filler (a spawn dying, a wrong captcha, cooling off) is rare. The second
  "spawns got spawns" line after every first own is gone. Measured on the autopilot: 3 to 8 lines a track.
- **Aura combo.** Each thing you take within 4 seconds of the last multiplies the aura, up to x8, with the number
  popping out of the thing, a small screen shake, and the combo shown above the tool bar.
- **NPC army.** People you turn into NPCs now walk to the nearest device you do not own and tap on it for you.
- **Fiber ports.** Blue pads in Born in the Server, The Algorithm and Nuke: step on one, come out of the other,
  and the gang comes with you.
- **Iced clovers.** One hidden in every track. They show in the tracklist and on the chain in the crib.
- **The finale has a clock.** It counts from 03:09:22 AM to 03:14:22 AM (five minutes). Run out and they push
  the button; A runs it back. It is the only track you can fail.
- **Drip.** A closet in the crib swaps the puffer: silver, then ice at 25,000 aura, gold at 75,000, blackout at 150,000.
- Results screen adds best combo and whether the clover was found.
- **Playtest pass** (autopilot through all six tracks plus frames read by eye): the combo label sat on top of
  toasts, so it moved down above the tool bar. The finale now takes the autopilot 127 s of its 300 s.
- Lab is 43 checks, all passing.

Still not played by a person or on a phone.

## v0.3 (Nov 18 2026): two more songs, quips at his head, the arsenal, playtest pass

Will sent The Algorithm and Nuke the Data Center, asked for the songs to be reused through the game until the
rest arrive, for his quips to show up close to his character, for an overclock ability and other tools, and for
a playtest with improvements.

- **Songs:** The Algorithm plays on track 04 and Nuke the Data Center on the finale. Until the other files
  arrive the three songs are shared out so the same one never plays twice in a row: title, intro and crib
  Overclocked; Boot Up The Algorithm; Overclocked its own; Born in the Server Nuke; The Algorithm its own;
  No Wi-Fi Overclocked; Nuke and the ending Nuke. Only the playing song stays decoded, to keep memory down on a phone.
- **Quips at his head:** his lines are now a speech bubble attached to Bottie (under him when he faces up, so
  it does not cover what he aims at). The strip at the bottom of the screen is gone.
- **The arsenal:** the X and Y buttons are on for this game.
  - **Y: OVERCLOCK** (was on Select). Costs heat.
  - **X: the tool in hand; Select swaps tools.** Tools cost tokens. You start a track with 3 and earn them by owning
    devices (gold ones give 2), making NPCs and crashing opp bots. One tool unlocks per track cleared:
    FORK BOMB (5 tokens, five spawns now), BLUE SCREEN (5, freezes opp bots and humans near you for 6 seconds),
    POP-UP (3, a fake prize that humans walk over and stare at), RM -RF (6, deletes the firewall or opp bot you aim at).
  - A bar along the bottom shows tokens, the tool on X and overclock on Y. The results screen names a new tool, and
    the next track explains it.
- **Playtest pass** (autopilot through all six tracks, frames read by eye):
  - The gang grew to 30-40 and buried the screen: gang limits cut to 16-30 per track.
  - Nothing threatened the gang: opp bots zap faster and from further, soldiers stomp faster, nerds walk faster
    and pull a plug in 2 seconds instead of 2.6.
  - Toasts covered the bubble and the finale clock: the bubble moves down when a toast is up, the clock moved left.
  - Bottie was hidden inside his own gang: they follow further behind him.
- Lab is now 30 checks, all passing. Autopilot times: 23 s, 41 s, 54 s, 45 s, 37 s, 92 s.

Still not played by a person or on a phone. The songs were checked over a local web server, not on the published page.

## v0.2 (Nov 18 2026): the real Overclocked song

- Track 02 now plays lil Bottie's own "Overclocked" (the mp3 Will sent) instead of the chiptune. It loops for the
  whole track, drops in volume on pause, and stops when you leave.
- Songs are separate files in `games/music/`, not embedded: the published page caps at 16 MB and the game is
  already 14.7 MB. A level names its song with `mp3:'file.mp3'` in `bt-1-levels.js`.
- The song is re-encoded to 128 kbps (3.2 MB, from 4.5 MB). If the file cannot be fetched (the html opened
  straight from disk, or sent to someone without the music folder) the chiptune plays instead.
- Checked over a local web server: the song loads (197 s) and plays in the track, and stops in the crib.

## v0.1 (Nov 18 2026): first playable

Will picked "spawn takeover" from four options, asked for it very explicit with Bottie's real lyrics and
references, and chiptune for now.

- New game in `src/bottie/` (four files, one cartridge function). The page boots straight into it.
- Throw spawns into devices to own them; owned devices spit out more spawns. Devices hold a limited number of
  spawns each. Gold devices open the fiber port.
- Humans: dork nerds and soldiers unplug owned devices; any human can be turned into an NPC. Opp bots zap spawns
  and can be blue-screened. Firewalls, captcha doors, AC vents, heat, thermal throttle, overclock, backup respawn.
- Six tracks: Boot Up, Overclocked, Born in the Server, The Algorithm, No Wi-Fi Still Online, Nuke the Data Center.
  Intro and ending scenes, track cards, results with a rank, a tracklist that shows the eight unbuilt tracks.
- The crib: console (opens the Pocket Lantern shelf with all five cartridges; B comes back), the booth and door
  (tracklist), fridge, rack, chain.
- Chiptune beat made in code: about 140 BPM half-time, sliding bass, toy keys, six patterns.
- Every caption with an adlib is a lyric copied from `lore/artist-archive.pdf`.
- Console shell restyled chrome and LED blue. Sproutwild already used the name `BT`, so the console calls this
  cartridge `BOT` (`window.__g.BT` is still the test handle).
- `tests/bottie_lab.js`: 23 checks, all passing. The autopilot clears the tracks in 24 s, 50 s, 55 s, 48 s, 37 s
  and 86 s; a person will be slower. Difficulty and length are a first guess and have not been played by a human.

Known gaps: not played on a phone; eight tracks not built; no real songs yet; the crib is plain; humans standing
behind furniture can draw in front of it; a track cannot be failed.
