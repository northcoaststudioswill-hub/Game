# lil Bottie music videos

Square music videos drawn with the game's own art and, for the gameplay shots, the game's own rules played by a
small director bot. Nothing here is part of the game: the game never loads it.

```
python3 bottie/build.py            # the game (the video uses the same source files)
python3 bottie/video/build.py      # -> bottie/video/mv.html, the render page
node bottie/video/render.js overclocked            # -> bottie/video/out/overclocked.mp4 (1080 x 1080, 30 fps, song muxed in)
node bottie/video/render.js overclocked 100 140    # just that stretch of the song
node bottie/video/render.js overclocked --shots --every=2   # stills, for checking
```

The whole 3:17 video renders in about a minute. `out/` is not committed (the mp4 is about 43 MB); render it again
any time.

| File | What it is |
| --- | --- |
| `board-overclocked.js` | The storyboard for Overclocked: 53 shots, each a start time, an end time and either a drawn picture or a stretch of real gameplay. The timing table `T` is at the top. |
| `songs/overclocked.mp3` | The song as Will sent it (original quality), used for the audio. |
| `build.py`, `render.js` | Build the render page; draw every frame in headless Chromium and pipe it to ffmpeg. |
| `../src/bottie/bt-4-mv.js` | The video mode inside the cartridge: shots, the director bot, the beat pulse. |

## Timing, and what is estimated

- Tempo (127.7 BPM), every kick drum, and where the drums drop out are measured from the audio.
- The twelve line times in verse 2 are measured (a speech aligner locked onto them).
- Every other line is placed from the song's structure: 8-bar intro, hook 1 and verse 1 at two bars a line, hook 2,
  bridge, hook 3, an instrumental stretch, the outro. No transcription tool was reachable to confirm these, so a
  section could be a bar or two off. To fix one, change its number in `T` and render again.
- No lyric text is burned in, for that reason. `caps` in the storyboard can carry timed captions once the times
  are confirmed.

## Adding another song

Copy `board-overclocked.js`, give it a new name in `MV.boards`, point `song` at the file, and write its shots.
A drawn shot is `pic(start, end, name, (tt, t) => { ...draw... })`; a gameplay shot is
`lvl(start, end, name, levelId, { warm, speed, sup, dir })`.
