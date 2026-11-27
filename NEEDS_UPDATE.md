# Needs update (not started)

## Music: load the Sprouts and Patch & Plate songs from the site
- The two William Cohen Sprouts songs (`v0.1/music/beautiful-sprouts.mp3`, `v0.1/music/autumn-study.mp3`) and
  `v0.3/music/cook-e.mp3` only play on claude.ai today, so the GitHub Pages copy and downloads are silent for them.
- Plan: copy the mp3s into `docs/music/`, point those tracks at `music/<file>` (same-site paths; cross-site audio is
  silenced by the game's audio processing), rebuild, and redeploy `docs/`.
- Cost: about 7 MB more in the repo and on Pages. The page file itself does not grow.
- Check first: the exact track entries in the Sprouts and Patch & Plate track lists before changing them.
