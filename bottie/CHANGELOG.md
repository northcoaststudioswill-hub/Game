# lil Bottie: Clankin' in the Cloud — changelog

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
