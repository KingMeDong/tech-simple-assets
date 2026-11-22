"""Automated spec check for a finished Reel (workflow section 5, playbook V13/V12).

Usage: python3 tools/reel/check.py reels/<id>
Exits non-zero if any hard requirement fails.
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image

MAX_MB = 20  # jsDelivr per-file limit


def probe(path: Path) -> dict:
    out = subprocess.run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format",
                          "-show_streams", str(path)], capture_output=True, check=True).stdout
    return json.loads(out)


def top_level_atoms(path: Path) -> list:
    atoms, data = [], path.read_bytes()
    i = 0
    while i + 8 <= len(data):
        size = int.from_bytes(data[i:i + 4], "big")
        name = data[i + 4:i + 8].decode("latin-1")
        if size == 1:
            size = int.from_bytes(data[i + 8:i + 16], "big")
        if size < 8:
            break
        atoms.append(name)
        i += size
    return atoms


def main(reel_dir: str):
    d = Path(reel_dir)
    video, cover, caption = d / "video.mp4", d / "cover.jpg", d / "caption.txt"
    results = []

    def check(name, ok, detail=""):
        results.append((ok, name, detail))

    info = probe(video)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    dur = float(info["format"]["duration"])
    size_mb = video.stat().st_size / 1e6
    fps = eval(v["avg_frame_rate"])

    check("video codec H.264", v["codec_name"] == "h264", v["codec_name"])
    check("pixel format yuv420p", v["pix_fmt"] == "yuv420p", v["pix_fmt"])
    check("resolution 1080x1920", (v["width"], v["height"]) == (1080, 1920), f'{v["width"]}x{v["height"]}')
    check("frame rate 30 fps", abs(fps - 30) < 0.01, f"{fps:.2f}")
    check("audio present (AAC)", a is not None and a["codec_name"] == "aac", a["codec_name"] if a else "none")
    check("audio 48 kHz", a is not None and a["sample_rate"] == "48000", a["sample_rate"] if a else "-")
    check("duration 3-90 s (never >=180 s)", 3 <= dur <= 90, f"{dur:.1f} s")
    check(f"file size < {MAX_MB} MB", size_mb < MAX_MB, f"{size_mb:.1f} MB")
    atoms = top_level_atoms(video)
    check("faststart (moov before mdat)", "moov" in atoms and "mdat" in atoms and atoms.index("moov") < atoms.index("mdat"),
          " ".join(atoms))

    if cover.exists():
        im = Image.open(cover)
        check("cover JPEG 1080x1920", im.format == "JPEG" and im.size == (1080, 1920), f"{im.format} {im.size}")
        check("cover <= 8 MB", cover.stat().st_size <= 8e6, f"{cover.stat().st_size / 1e6:.2f} MB")
    else:
        check("cover exists", False)

    if caption.exists():
        text = caption.read_text().strip()
        words = len([w for w in text.split() if not w.startswith("#")])
        tags = [w for w in text.split() if w.startswith("#")]
        check("caption <= 2200 chars", len(text) <= 2200, f"{len(text)} chars")
        check("caption 30-90 words (excl. hashtags)", 30 <= words <= 90, f"{words} words")
        check("hashtags <= 5 (target 3)", len(tags) <= 5, f"{len(tags)}: {' '.join(tags)}")
        check("AI-voice disclosure in caption", "AI text-to-speech" in text)
    else:
        check("caption.txt exists", False)

    width = max(len(n) for _, n, _ in results)
    for ok, name, detail in results:
        print(f"{'PASS' if ok else 'FAIL'}  {name.ljust(width)}  {detail}")
    failed = [n for ok, n, _ in results if not ok]
    print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main(sys.argv[1])
