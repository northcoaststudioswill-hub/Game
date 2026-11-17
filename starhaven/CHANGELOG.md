# Starhaven — Changelog

## v4 — Complete the loop (Nov 16, 2026)
The full loop is now PROVEN by an in-game autopilot playing with real input/physics/combat (no teleports): fresh save -> intro -> Caelum -> gate -> full Thornwood (gaps, pillar, both enemy types, all 4 checkpoints) -> portal (+60, missionsDone=1) -> hub -> Mural 1 (exactly -50 starlight, celebration) -> real page reload -> Continue restored identical state. 13/13 steps passed (run: 22 motes, starlight 127 -> 77 after mural). Added: per-run mission tracking + mission-complete summary on return (starlight, motes, kills by type, lanterns), mural celebration (staged color bursts, banner, warmer street), mural-aware GOAL text for every state, clean mission replay (verified reset: motes/enemies/checkpoints/hearts/stats). v3 feel + v2 readability/story untouched; zero forbidden-universe references.
NOT tested: touch/gamepad hardware feel, human play at phone size. Will's play is the verdict.

## v3 — Feel pass (Nov 16, 2026)
BUILD-PLAN Milestones 1+2. Movement rebuilt on an acceleration model: full speed in 3 frames, stop in 3 frames (~2px slide), 4-frame turns with skid puff, new gravity curve (soft apex, firm fall, no float), tap hop 1.8 tiles vs hold jump 4.2 tiles, buffered dash, denser afterimages, momentum kept out of dash. Combat: 11-frame swings with near-instant hit start, attack buffering for the 3-hit combo, forward lunge, hit-stop ladder (3 normal / 5 finisher & pogo / 6 kill) with matching shake, stronger knockback. Pogo: -8.4 bounce, refunds double jump AND air dash, ring burst + readout. Landing squash, run dust, double-jump ring.
Verified by physics simulation: 4- and 5-tile gaps by run-jump; 6-tile gap needs double jump (145px) or jump+dash (128px) vs 96px gap; HP4 enemies die in exactly 2 dagger hits, matching the on-screen label.
Standalone check: full-file grep — zero lil Bottie / Sprouts / Pocket Lantern references. Starhaven is its own project.
NOT tested: real touch/gamepad hardware feel, full human Thornwood run, phone-size feel. Will's play is the verdict.

## v2 — Readability + story (Nov 16, 2026)
Answered Will's verdict on v1 ("really ugly, hard to see what's happening, no story explanation of what to do"). Quieter backgrounds, lit ground edges + gold pit warnings, bigger/bolder Wren and enemies with outlines/labels/health bars, pulsing motes, readable HUD pill, big gold prompts. Story: premise on title, HOW TO PLAY strip, 4-card intro, expanded Caelum dialogue, name tags on landmarks, always-on GOAL bar with objective arrow, location banners, plain-language event messages, pause screen restates quest + controls.

## v1 — Test slice (Nov 16, 2026)
Title, Starhaven hub (house rest/save, signpost, Caelum's 5 dialogue states, 3-panel mural wall at 50 starlight that brightens the city, gate), Thornwood mission (tutorial signs, 4/5/6-tile gaps, pillar, 4 lantern checkpoints, 40 motes, thorn sprites + winged spies, +60 end portal). Save: {v:1, starlight, murals, missionsDone, metCaelum} in local storage.
