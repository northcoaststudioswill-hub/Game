# lil Bottie: Clankin' in the Cloud — changelog

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
