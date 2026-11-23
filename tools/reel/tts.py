"""Narration: script.json -> narration.wav + timeline.json.

Each segment is synthesized separately with Piper (voice en_US-ryan-high), so
segment start/end times are exact. Word timings come from transcribing the
narration with faster-whisper and aligning its words to the script words.
The transcript also serves as a pronunciation check: script words that the
recognizer did not hear are listed as warnings in timeline.json.

Usage: python3 tools/reel/tts.py reels/<id>
"""
import difflib
import json
import os
import re
import sys
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

VOICE_DIR = Path(os.environ.get("PIPER_VOICE_DIR", Path.home() / ".local/share/piper-voices"))
VOICE = "en_US-ryan-high"
LENGTH_SCALE = float(os.environ.get("LENGTH_SCALE", 1.05))  # >1 = slower. 1.05 = natural Piper pace (~180 wpm incl. pauses), owner's choice after a listening test on 2026-11-23
LEAD_IN = 0.08        # seconds of silence before the first word


NUMBERS = {"zero": "0", "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
           "six": "6", "seven": "7", "eight": "8", "nine": "9", "ten": "10"}


def norm(w: str) -> str:
    w = re.sub(r"[^a-z0-9]", "", w.lower())
    return NUMBERS.get(w, w)


def synthesize(script: dict):
    voice = PiperVoice.load(str(VOICE_DIR / f"{VOICE}.onnx"))
    # Per-Reel override: "length_scale" in script.json (e.g. Reels with long spoken numbers).
    cfg = SynthesisConfig(length_scale=float(script.get("length_scale", LENGTH_SCALE)))
    sr = voice.config.sample_rate
    pieces = [np.zeros(int(LEAD_IN * sr), dtype=np.int16)]
    t = LEAD_IN
    segs = []
    for seg in script["segments"]:
        audio = np.concatenate([c.audio_int16_array for c in voice.synthesize(seg["text"], cfg)])
        dur = len(audio) / sr
        segs.append({"id": seg["id"], "text": seg["text"], "start": round(t, 3), "end": round(t + dur, 3)})
        pieces += [audio, np.zeros(int(seg.get("pause", 0.3) * sr), dtype=np.int16)]
        t += dur + seg.get("pause", 0.3)
    return np.concatenate(pieces), sr, segs


def align_words(wav_path: Path, segs: list):
    from faster_whisper import WhisperModel
    import subprocess
    model = WhisperModel("small.en", device="cpu", compute_type="int8")
    # Decode with ffmpeg to 16 kHz float32 (avoids PyAV version issues).
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(wav_path), "-ar", "16000",
                          "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    pcm = np.frombuffer(raw, dtype=np.float32)
    res, _ = model.transcribe(pcm, word_timestamps=True, language="en", beam_size=5)
    heard = []
    for seg in res:
        for w in seg.words:
            if heard and w.word.startswith("-"):  # "Wi" + "-Fi" -> "Wi-Fi"
                prev = heard[-1]
                heard[-1] = type(prev)(start=prev.start, end=w.end, word=prev.word + w.word,
                                       probability=min(prev.probability, w.probability))
            else:
                heard.append(w)
    heard_norm = [norm(w.word) for w in heard]

    script_words = []  # (segment index, display word)
    for i, s in enumerate(segs):
        for w in s["text"].split():
            script_words.append((i, w))
    script_norm = [norm(w) for _, w in script_words]

    times = [None] * len(script_words)
    sm = difflib.SequenceMatcher(a=script_norm, b=heard_norm, autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            times[a + k] = (heard[b + k].start, heard[b + k].end)
    missing = [script_words[i][1] for i, t in enumerate(times) if t is None]

    # Fill gaps: spread unmatched words evenly inside their segment window.
    words = []
    for si, s in enumerate(segs):
        idx = [i for i, (sj, _) in enumerate(script_words) if sj == si]
        for j, i in enumerate(idx):
            if times[i] is None:
                prev_end = next((times[k][1] for k in reversed(idx[:j]) if times[k]), s["start"])
                nxt = next(((k, times[k][0]) for k in idx[j + 1:] if times[k]), (None, s["end"]))
                gap_words = [k for k in idx[j:] if (nxt[0] is None or k < nxt[0])]
                step = (nxt[1] - prev_end) / max(1, len(gap_words))
                times[i] = (prev_end, prev_end + step)
            st, en = times[i]
            # keep words inside their segment
            st, en = max(st, s["start"]), min(max(en, st + 0.05), s["end"] + 0.05)
            words.append({"seg": s["id"], "w": script_words[i][1], "start": round(st, 3), "end": round(en, 3)})
    transcript = " ".join(w.word.strip() for w in heard)
    return words, missing, transcript


def main(reel_dir: str):
    d = Path(reel_dir)
    script = json.loads((d / "script.json").read_text())
    audio, sr, segs = synthesize(script)
    build = d / "build"
    build.mkdir(exist_ok=True)
    wav_path = build / "narration.wav"
    with wave.open(str(wav_path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(audio.tobytes())
    words, missing, transcript = align_words(wav_path, segs)
    narration_end = segs[-1]["end"]
    n_words = sum(len(s["text"].split()) for s in segs)
    timeline = {
        "narration_seconds": round(narration_end, 3),
        "total_seconds": round(narration_end + script.get("end_card_seconds", 2.0), 3),
        "words_per_minute": round(n_words / (narration_end - LEAD_IN) * 60, 1),
        "segments": segs,
        "words": words,
        "qa": {"unheard_script_words": missing, "transcript": transcript},
    }
    (build / "timeline.json").write_text(json.dumps(timeline, indent=1))
    print(f"narration {narration_end:.1f}s, total {timeline['total_seconds']:.1f}s, "
          f"{timeline['words_per_minute']} wpm")
    print("unheard words:", missing or "none")
    print("transcript:", transcript)


if __name__ == "__main__":
    main(sys.argv[1])
