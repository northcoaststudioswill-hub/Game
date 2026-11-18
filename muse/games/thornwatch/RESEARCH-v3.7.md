# THORNWATCH v3.7 — Fun research (short)

Question: what makes a tower defense FEEL good in the first
ten minutes, at Pocket Lantern scale (240px canvas, WebAudio
blips, one shared `snd()` synth)? Sources: BTD6's early-round
design as the reference loop, TD game-feel writing (pop
feedback, reward cadence, danger signaling), and — weighted
heaviest — our own four noob personas on v3.6, whose logs are
the ground truth in PLAYTEST-v3.7.md.

## Adopted (each maps to a persona moment)

- **Every kill should pay visibly.** BTD6 shows money per
  pop; the number IS the feedback. Thornwatch paid bounties
  silently into a counter. → A petal sprite now flies from
  every corpse to the HUD counter (pulse + coin tick on
  arrival), and bounties ≥10 float their amount at the kill.
- **Crits are a promise; keep it loudly.** LUCKY's card says
  "HUGE CRIT HITS" but a crit kill looked like any other.
  → Gold burst + 'CRIT!' float + a higher pop when a crit
  lands the kill.
- **Round-end is a reward beat, not a log line.** BTD6's
  round banner + cash count is the dopamine metronome.
  Thornwatch ended nights with a say-bar sentence. → A dawn
  card: 'NIGHT N CLEAR!', the stars filling in, petals/pops
  for the night, 'NO LEAKS!' or the leak count. Skippable,
  and START both dismisses it and starts the next night.
- **Danger must announce itself before the damage.** Noobs
  watched the Heart number drop without ever seeing why.
  → At 78% of the path: Louie barks 'WOOF! TOO CLOSE!' and
  the HUD heart flashes red. (The leak bark already existed;
  it was the *warning* that was missing.)
- **A loss should teach.** Persona deaths ended on stats
  that name no cause. → The defeat screen now names the
  night's top leaker and its field-guide counter:
  'x6 DART · DEW SLOWS IT DOWN'.
- **Teach at the moment of failure, not in a manual.** The
  hoarder's defenseless garden got no signal for two full
  nights. → Round-start check: a garden with no real shooter
  hears 'WOOF! TOO WEAK! PLANT SHOOTERS!'. Same pattern for
  wealth: sitting on 90+ petals with no keeper earns
  'WOOF! A KEEPER COSTS 90P!' once per run (mirrors the
  existing powers tip).
- **Buttons that spend money need a beat of intent.** The
  fork/train panels buy on the same A that opens them; 3 of
  4 personas mash-bought upgrades, the casual a 480p GRAND.
  → A 0.13s intent window after a panel opens: mash-speed
  presses are ignored, deliberate presses land. (Measured:
  persona mash cycles run 50–100ms; a glance-and-press is
  150ms+. It is a mitigation, not a proof — a determined
  8Hz masher can still buy on the second beat, but the panel
  has been on screen for a full beat by then.)

## Rejected (with reasons)

- **Kill-streak callouts / score multipliers** — arcade noise
  on a cozy garden game; the dawn card already pays the
  celebration budget once per night.
- **Screen-shake on every leak / hit-stop** — shake exists
  and is settings-gated; more of it reads as jank at 240px,
  and hit-stop fights the speed toggle.
- **A tutorial level or more guide steps** — the guide works
  (naive journey: first plant 1.9s, zero real dead inputs);
  the failures were feedback gaps, not missing lessons.
- **Retuning nights 1–3 easier** — persona evidence says the
  floor is already right: every persona won nights 1–2; the
  tapper's honest no-upgrade line now dies on night 6,
  threatened from night 4 — the target profile. The pain was
  never difficulty; it was silence.
- **Bigger SFX set / music** — the shell's `snd()` blips plus
  the new coin tick and crit pop cover the beats; a full
  Thornwatch soundtrack is a different commission.
