"""Einheitlicher Look für @tech.simple.explained.

Alle Folien werden in 2x-Auflösung gezeichnet und dann auf 1080x1350
herunterskaliert (saubere Kanten). Koordinaten in Funktionen sind immer
in Zielpixeln (1080x1350) angegeben; die Skalierung passiert intern.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1350
S = 2  # Supersampling-Faktor

# Farbpalette
BG = (246, 244, 239)        # warmes Off-White
INK = (20, 33, 61)          # dunkles Navy für Text
MUTED = (98, 108, 128)      # Sekundärtext
ACCENT = (255, 107, 53)     # Orange – Hervorhebungen, Hook
BLUE = (46, 134, 222)       # Bluetooth / Funk
GREEN = (38, 166, 110)      # WLAN / „funktioniert"
CARD = (255, 255, 255)
LINE = (223, 219, 210)

FONT_DIR = Path(__file__).parent / "fonts"


def font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_DIR / f"Inter-{weight}.otf"), size * S)


class Slide:
    def __init__(self, index: int, total: int):
        self.index, self.total = index, total
        self.img = Image.new("RGB", (W * S, H * S), BG)
        self.d = ImageDraw.Draw(self.img)
        self._chrome()

    # --- Grundgerüst -------------------------------------------------
    def _chrome(self):
        # Marke oben links, Zähler oben rechts, Fortschrittsbalken unten
        self.text(72, 64, "tech.simple.explained", font("SemiBold", 28), MUTED)
        self.text(W - 72, 64, f"{self.index}/{self.total}", font("SemiBold", 28),
                  MUTED, anchor="ra")
        seg_w = (W - 144 - (self.total - 1) * 10) / self.total
        for i in range(self.total):
            x = 72 + i * (seg_w + 10)
            col = ACCENT if i < self.index else LINE
            self.rrect(x, H - 64, x + seg_w, H - 56, 4, fill=col)

    def save(self, path):
        out = self.img.resize((W, H), Image.LANCZOS)
        out.save(path, "JPEG", quality=92, optimize=True, progressive=True)

    # --- Primitive (Zielpixel) ---------------------------------------
    def _p(self, *xy):
        return [v * S for v in xy]

    def text(self, x, y, s, f, fill=INK, anchor="la"):
        self.d.text(self._p(x, y), s, font=f, fill=fill, anchor=anchor)

    def wrapped(self, x, y, s, f, max_w, fill=INK, line_gap=1.28):
        """Bricht Text an Wortgrenzen um; gibt die y-Position danach zurück.
        **Wort** im Text wird in ACCENT hervorgehoben."""
        words = s.split(" ")
        lines, cur = [], []
        for w in words:
            trial = " ".join(cur + [w]).replace("**", "")
            if self.d.textlength(trial, font=f) / S > max_w and cur:
                lines.append(cur)
                cur = [w]
            else:
                cur.append(w)
        lines.append(cur)
        lh = f.size / S * line_gap
        hl = False
        for line in lines:
            cx = x
            for i, w in enumerate(line):
                token = w + (" " if i < len(line) - 1 else "")
                parts = token.split("**")
                for j, part in enumerate(parts):
                    if j > 0:
                        hl = not hl
                    if part:
                        self.text(cx, y, part, f, ACCENT if hl else fill)
                        cx += self.d.textlength(part, font=f) / S
            y += lh
        return y

    def rrect(self, x0, y0, x1, y1, r, fill=None, outline=None, width=0):
        self.d.rounded_rectangle(self._p(x0, y0, x1, y1), radius=r * S,
                                 fill=fill, outline=outline, width=width * S)

    def circle(self, cx, cy, r, fill=None, outline=None, width=0):
        self.d.ellipse(self._p(cx - r, cy - r, cx + r, cy + r), fill=fill,
                       outline=outline, width=width * S)

    def arc(self, cx, cy, r, start, end, fill, width):
        self.d.arc(self._p(cx - r, cy - r, cx + r, cy + r), start, end,
                   fill=fill, width=width * S)

    def line(self, pts, fill, width):
        self.d.line([v * S for p in pts for v in p], fill=fill, width=width * S,
                    joint="curve")
        for p in (pts[0], pts[-1]):  # runde Enden
            self.circle(p[0], p[1], width / 2, fill=fill)

    def pill(self, x, y, label, fg=CARD, bg=ACCENT, size=30):
        f = font("Bold", size)
        tw = self.d.textlength(label, font=f) / S
        self.rrect(x, y, x + tw + 48, y + size + 30, (size + 30) / 2, fill=bg)
        self.text(x + 24, y + 15, label, f, fg)
        return x + tw + 48

    # --- Icons ---------------------------------------------------------
    def phone(self, cx, cy, h=300, screen=CARD, body=INK):
        w = h * 0.5
        x0, y0 = cx - w / 2, cy - h / 2
        self.rrect(x0, y0, x0 + w, y0 + h, w * 0.18, fill=body)
        m = w * 0.07
        self.rrect(x0 + m, y0 + m, x0 + w - m, y0 + h - m, w * 0.13, fill=screen)
        self.rrect(cx - w * 0.16, y0 + m + 8, cx + w * 0.16, y0 + m + 8 + w * 0.09,
                   w * 0.05, fill=body)  # Dynamic Island

    def waves(self, cx, cy, color, n=3, r0=40, step=38, width=10, start=-40, end=40):
        for i in range(n):
            self.arc(cx, cy, r0 + i * step, start, end, color, width)

    def bluetooth(self, cx, cy, h, color=CARD, width=9):
        u = h / 2
        self.line([(cx - u * 0.5, cy - u * 0.5), (cx + u * 0.5, cy + u * 0.5),
                   (cx, cy + u), (cx, cy - u), (cx + u * 0.5, cy - u * 0.5),
                   (cx - u * 0.5, cy + u * 0.5)], color, width)

    def wifi(self, cx, cy, size, color=CARD, width=10):
        self.circle(cx, cy, width * 0.8, fill=color)
        for i in range(1, 4):
            self.arc(cx, cy, size * i / 3, 225, 315, color, width)

    def lock(self, cx, cy, size, color=INK, inner=CARD):
        w = size
        self.arc(cx, cy - w * 0.25, w * 0.3, 180, 360, color, int(w * 0.11))
        self.d.line(self._p(cx - w * 0.3, cy - w * 0.25, cx - w * 0.3, cy), fill=color,
                    width=int(w * 0.11) * S)
        self.d.line(self._p(cx + w * 0.3, cy - w * 0.25, cx + w * 0.3, cy), fill=color,
                    width=int(w * 0.11) * S)
        self.rrect(cx - w * 0.45, cy - w * 0.05, cx + w * 0.45, cy + w * 0.55,
                   w * 0.1, fill=color)
        self.circle(cx, cy + w * 0.22, w * 0.08, fill=inner)

    def photo(self, cx, cy, size):
        """Kleines Foto-Symbol (die übertragene Datei)."""
        w, h = size, size * 0.8
        self.rrect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, size * 0.12,
                   fill=ACCENT)
        self.d.polygon(self._p(cx - w * 0.38, cy + h * 0.32, cx - w * 0.08, cy - h * 0.08,
                               cx + w * 0.12, cy + h * 0.15, cx + w * 0.22, cy + h * 0.04,
                               cx + w * 0.38, cy + h * 0.32), fill=CARD)
        self.circle(cx + w * 0.2, cy - h * 0.18, size * 0.08, fill=CARD)
