"""Brand assets: profile picture (800x800) and YouTube banner (2560x1440).

Usage: python3 brand/make_brand.py  -> brand/avatar.png, brand/youtube-banner.png
"""
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
FONTS = (ROOT / "tools/fonts").as_uri()

CSS = f"""
@font-face {{ font-family: Inter; font-weight: 800; src: url("{FONTS}/Inter-ExtraBold.otf"); }}
@font-face {{ font-family: Inter; font-weight: 600; src: url("{FONTS}/Inter-SemiBold.otf"); }}
body {{ margin: 0; background: #0B1426; font-family: Inter, sans-serif; color: #F4F1EA; }}
"""

# Phone outline with an orange question mark: "questions about everyday tech".
def phone_svg(scale=1.0):
    return f"""<g transform="scale({scale})">
      <rect x="-150" y="-280" width="300" height="560" rx="62" fill="#13213D" stroke="#F4F1EA" stroke-width="22"/>
      <rect x="-52" y="-246" width="104" height="30" rx="15" fill="#F4F1EA"/>
      <text x="0" y="118" text-anchor="middle" font-family="Inter" font-weight="800" font-size="330" fill="#FF7A45">?</text>
    </g>"""

AVATAR = f"""<!doctype html><html><head><style>{CSS}</style></head><body>
<svg id="art" width="800" height="800" viewBox="0 0 800 800">
  <defs><radialGradient id="gl" cx="0.5" cy="0.5" r="0.6">
    <stop offset="0" stop-color="#FF7A45" stop-opacity="0.28"/><stop offset="1" stop-color="#0B1426" stop-opacity="0"/></radialGradient></defs>
  <rect width="800" height="800" fill="#0B1426"/><rect width="800" height="800" fill="url(#gl)"/>
  <g transform="translate(400 410)">{phone_svg(0.95)}</g>
</svg></body></html>"""

# YouTube banner: everything important inside the 1546x423 safe area in the centre.
BANNER = f"""<!doctype html><html><head><style>{CSS}</style></head><body>
<svg id="art" width="2560" height="1440" viewBox="0 0 2560 1440">
  <defs><radialGradient id="gl" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#3D9BFF" stop-opacity="0.20"/><stop offset="1" stop-color="#0B1426" stop-opacity="0"/></radialGradient></defs>
  <rect width="2560" height="1440" fill="#0B1426"/><rect width="2560" height="1440" fill="url(#gl)"/>
  <g transform="translate(650 720)">{phone_svg(0.6)}</g>
  <text x="810" y="694" font-family="Inter" font-weight="800" font-size="94" fill="#F4F1EA">Everyday tech,</text>
  <text x="810" y="800" font-family="Inter" font-weight="800" font-size="94" fill="#FF7A45">explained in 60 seconds.</text>
  <text x="814" y="872" font-family="Inter" font-weight="600" font-size="42" fill="#8D98B3">New Short every 2 days · @tech.simple.explained</text>
</svg></body></html>"""


def main():
    out = ROOT / "brand"
    exe = os.environ.get("CHROMIUM_PATH", "/opt/pw-browsers/chromium")
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=exe if Path(exe).exists() else None, args=["--no-sandbox"])
        for name, html, (w, h) in (("avatar.png", AVATAR, (800, 800)),
                                   ("youtube-banner.png", BANNER, (2560, 1440))):
            page = b.new_page(viewport={"width": w, "height": h})
            page.set_content(html)
            page.evaluate("document.fonts.ready")
            page.wait_for_timeout(200)
            page.locator("#art").screenshot(path=str(out / name))
        b.close()
    print("written:", out / "avatar.png", out / "youtube-banner.png")


if __name__ == "__main__":
    main()
