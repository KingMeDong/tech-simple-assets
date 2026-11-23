"""QA for Reel 002: every frame that shows a code as working must really scan,
and every frame that shows it failing must really fail (OpenCV + ZXing).

Usage: python3 reels/002-qr-code/qa_scan.py   (after render.py)
Needs: pip install opencv-python-headless zxing-cpp
"""
import glob
import json
import subprocess
from pathlib import Path

import cv2
import zxingcpp

D = Path(__file__).parent
TEXT = "tech.simple.explained"


def dec(g):
    return cv2.QRCodeDetector().detectAndDecode(g)[0] == TEXT or any(r.text == TEXT for r in zxingcpp.read_barcodes(g))


def main():
    tl = json.loads((D / "build/timeline.json").read_text())
    S = {s["id"]: (s["start"], s["end"]) for s in tl["segments"]}
    W = {(w["seg"], w["w"].lower().strip(".,:?!")): w["start"] for w in tl["words"]}
    m = 0.1  # stay clear of scene cuts

    def expect(t):
        if t < 1.0: return "main", True                                   # intact code
        if 2.3 < t < S["s1"][0] - m: return "main", True                   # torn ~15%, check shown
        if S["s3a"][1] - 0.3 < t < S["s3b"][0] - m: return "main", True    # corner rebuilt
        if W[("s3b", "thirty")] < t < S["s3c"][0] - m: return "pair", None # low fails, strongest scans
        if W[("s3c", "middle")] < t < S["pay"][0] - m: return "main", True # logo in the middle
        if W[("pay", "cover")] + 0.5 < t < S["pay"][1]: return "main", False  # finder covered
        if t > S["pay"][1] + 0.6: return "main", True                      # loop back to frame 0
        return None, None

    out = D / "build/vf"
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("*.png"):
        f.unlink()
    subprocess.run(["ffmpeg", "-v", "error", "-i", str(D / "video.mp4"), "-vf", "fps=6", str(out / "f%04d.png")], check=True)
    bad = n = 0
    for f in sorted(glob.glob(str(out / "*.png"))):
        t = (int(f[-8:-4]) - 1) / 6
        kind, exp = expect(t)
        if not kind:
            continue
        g = cv2.cvtColor(cv2.imread(f), cv2.COLOR_BGR2GRAY)
        n += 1
        ok = (not dec(g[560:1010, 70:520])) and dec(g[560:1010, 570:1020]) if kind == "pair" else dec(g) == exp
        if not ok:
            bad += 1
            print(f"MISMATCH t={t:.2f} {kind} expected={exp}")
    print(f"{n} frames checked, {bad} mismatches")
    raise SystemExit(1 if bad else 0)


if __name__ == "__main__":
    main()
