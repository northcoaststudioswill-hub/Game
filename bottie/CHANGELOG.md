# lil Bottie: Clankin' in the Cloud — changelog

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
