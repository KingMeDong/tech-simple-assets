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
     `LENGTH_SCALE` defaults to 1.05, Piper's natural pace (about 180 wpm
     including pauses), chosen by the owner after a listening test. Higher
     values stretch every sound and quickly sound unnatural. Override per Reel
     with `"length_scale"` in `script.json` only for a good reason.
   - Transcribes the result with faster-whisper (`small.en`) to get word timings.
   - The transcript doubles as a pronunciation check: script words the
     recognizer did not hear are listed under `qa.unheard_script_words`.
     Numbers written as digits and US spellings are false alarms. Piper isn't
     deterministic, so re-run `tts.py` first; reword only if a word keeps
     failing (playbook L2, L3).
2. **`render.py`**
   - Builds `build/page.html` from `base.css`, `lib.js` and the Reel's `scene.js`.
   - Calls `render(t)` in headless Chromium for every frame (30 fps) and pipes
     screenshots into ffmpeg (H.264 CRF 25, 3 Mbps cap). The cover comes from
     `COVER()`.
   - Prints a WARNING for every `T.word()` lookup that found no word; a Reel
     must render without warnings.
3. **`check.py`** verifies:
   - Codec, resolution, fps, audio, duration
   - File under 20 MB, faststart, and all files on `main` under 45 MB
     (jsDelivr refuses repos over 50 MB)
   - Cover format and size
   - Caption length, hashtags, AI disclosure

## Writing a scene

`scene.js` defines `SCENE(t, T)`, which returns `{top, svg, html, glow, noCaptions}`.

- **Timeline:** Use `T.start(id)`, `T.end(id)` and `T.word(segId, "word")` to
  sync animation to the voice. `T.word` matches the first word in the segment
  that starts with the given text (apostrophes ignored), so "two" also matches
  "Step two". Prefer word-keyed timings over fixed offsets: they survive
  re-voicing.
- **Visuals:** `lib.js` provides the primitives (phones, icons, rings, bars,
  locks, checks), easing helpers, and burned-in captions.
- **Layout:** Keep everything inside the safe zone: x 65–1015, y 270–1250.
  Captions sit at y ≈ 1105–1245.

Build outputs (`build/`) are git-ignored. `video.mp4` and `cover.jpg` are
committed because Instagram and YouTube fetch them from their public jsDelivr
URLs (pinned to a commit). A Reel's `video.mp4` is deleted from `main` once
it's published.

Per Reel, the folder also holds `outline.md` (beats, facts with sources,
lessons), `caption.txt`, `youtube.txt` and, where needed, a topic-specific QA
script (e.g. `reels/002-qr-code/qa_scan.py`).
