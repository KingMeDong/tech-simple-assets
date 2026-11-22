# Reel pipeline

Turns `reels/<NNN>-<slug>/script.json` + `scene.js` into `video.mp4` + `cover.jpg`.

```bash
bash tools/reel/setup.sh                                   # once per fresh machine
python3 tools/reel/tts.py    reels/001-airdrop             # narration.wav + timeline.json
python3 tools/reel/render.py reels/001-airdrop --stills 0,5,12   # PNG stills to review
python3 tools/reel/render.py reels/001-airdrop             # video.mp4 + cover.jpg
python3 tools/reel/check.py  reels/001-airdrop             # spec check (must be all PASS)
```

## How it works

1. **`tts.py`**
   - Synthesizes each script segment with Piper (`en_US-ryan-high`).
     `LENGTH_SCALE` defaults to 1.38, about 168 wpm including pauses; override
     it per Reel with `"length_scale"` in `script.json` (or the `LENGTH_SCALE`
     environment variable).
   - Transcribes the result with faster-whisper (`small.en`) to get word timings.
   - The transcript doubles as a pronunciation check: script words the
     recognizer did not hear are listed under `qa.unheard_script_words`.
     Fix those by respelling or rephrasing.
2. **`render.py`**
   - Builds `build/page.html` from `base.css`, `lib.js` and the Reel's `scene.js`.
   - Calls `render(t)` in headless Chromium for every frame (30 fps) and pipes
     screenshots into ffmpeg. The cover comes from `COVER()`.
3. **`check.py`** verifies:
   - Codec, resolution, fps, audio, duration
   - Size under 50 MB, faststart
   - Cover format and size
   - Caption length, hashtags, AI disclosure

## Writing a scene

`scene.js` defines `SCENE(t, T)`, which returns `{top, svg, html, glow, noCaptions}`.

- **Timeline:** Use `T.start(id)`, `T.end(id)` and `T.word(segId, "word")` to
  sync animation to the voice.
- **Visuals:** `lib.js` provides the primitives (phones, icons, rings, bars,
  locks, checks), easing helpers, and burned-in captions.
- **Layout:** Keep everything inside the safe zone: x 65–1015, y 270–1250.
  Captions sit at y ≈ 1105–1245.

Build outputs (`build/`) are git-ignored. Only `video.mp4` and `cover.jpg` are
committed, because Instagram fetches them from their public jsDelivr URLs.
