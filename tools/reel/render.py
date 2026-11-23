"""Render a Reel: reels/<id>/scene.js + build/timeline.json -> video.mp4 + cover.jpg.

Each frame is drawn by calling render(t) in headless Chromium and taking a
screenshot; frames are piped into ffmpeg and muxed with the narration.

Usage:
  python3 tools/reel/render.py reels/<id>               full render
  python3 tools/reel/render.py reels/<id> --stills 0,5  PNG stills at given seconds
"""
import argparse
import json
import math
import os
import shutil
import subprocess
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
FPS = 30


def build_page(reel: Path, timeline: dict) -> Path:
    css = (ROOT / "tools/reel/base.css").read_text().replace("FONTDIR", (ROOT / "tools/fonts").as_uri())
    lib = (ROOT / "tools/reel/lib.js").read_text()
    scene = (reel / "scene.js").read_text()
    html = f"""<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head>
<body><div id="stage">
<svg id="bgsvg" width="1080" height="1920"></svg>
<svg id="svg" width="1080" height="1920" viewBox="0 0 1080 1920"></svg>
<div id="top"></div><div id="caps"></div><div id="extra"></div>
</div>
<script>window.TIMELINE = {json.dumps(timeline)};</script>
<script>{lib}</script>
<script>{scene}</script>
<script>
function renderCover() {{
  T = makeT(window.TIMELINE); CHUNKS = [];
  const saved = SCENE; SCENE = () => COVER(T); render(0); SCENE = saved;
  T = null; CHUNKS = null;  // rebuild timeline + captions on the next render()
}}
</script></body></html>"""
    out = reel / "build/page.html"
    out.write_text(html)
    return out


def open_page(p, page_path: Path):
    exe = os.environ.get("CHROMIUM_PATH", "/opt/pw-browsers/chromium")
    browser = p.chromium.launch(executable_path=exe if Path(exe).exists() else None,
                                args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(page_path.as_uri())
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(300)
    return browser, page, errors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("reel")
    ap.add_argument("--stills", help="comma-separated seconds")
    args = ap.parse_args()
    reel = Path(args.reel).resolve()
    build = reel / "build"
    timeline = json.loads((build / "timeline.json").read_text())
    page_path = build_page(reel, timeline)

    with sync_playwright() as p:
        browser, page, errors = open_page(p, page_path)
        stage = page.locator("#stage")
        if args.stills:
            for s in args.stills.split(","):
                page.evaluate(f"render({float(s)})")
                stage.screenshot(path=str(build / f"still-{float(s):05.1f}.png"))
            page.evaluate("renderCover()")
            stage.screenshot(path=str(build / "still-cover.png"))
            misses = page.evaluate("window.WORD_MISSES ? [...window.WORD_MISSES] : []")
            if misses:
                print("WARNING: T.word() found no match (fell back to segment start):", ", ".join(misses))
            browser.close()
            if errors:
                raise SystemExit("JS errors: " + "; ".join(errors))
            print("stills written to", build)
            return

        # cover
        page.evaluate("renderCover()")
        stage.screenshot(path=str(reel / "cover.jpg"), type="jpeg", quality=92)

        n = math.ceil(timeline["total_seconds"] * FPS)
        out = reel / "video.mp4"
        cmd = ["ffmpeg", "-y", "-v", "error",
               "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
               "-i", str(build / "narration.wav"),
               "-filter_complex", "[1:a]aresample=48000,apad[a]",
               "-map", "0:v", "-map", "[a]",
               "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-maxrate", "3M", "-bufsize", "6M",  # ~5 MB per 50 s: keeps the repo under jsDelivr's 50 MB limit
               "-pix_fmt", "yuv420p", "-r", str(FPS), "-g", str(FPS * 2), "-flags", "+cgop",
               "-profile:v", "high", "-c:a", "aac", "-b:a", "128k", "-ac", "2",
               "-shortest", "-movflags", "+faststart", str(out)]
        ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for i in range(n):
            page.evaluate(f"render({i / FPS})")
            ff.stdin.write(stage.screenshot(type="jpeg", quality=95))
            if i % 150 == 0:
                print(f"frame {i}/{n}", flush=True)
        ff.stdin.close()
        ff.wait()
        misses = page.evaluate("window.WORD_MISSES ? [...window.WORD_MISSES] : []")
        browser.close()
        if misses:
            print("WARNING: T.word() found no match (fell back to segment start):", ", ".join(misses))
        if errors:
            raise SystemExit("JS errors: " + "; ".join(errors))
        if ff.returncode:
            raise SystemExit("ffmpeg failed")
        print("wrote", out, f"{out.stat().st_size / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
