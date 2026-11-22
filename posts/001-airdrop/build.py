"""Beitrag 001 – Wie funktioniert AirDrop? (Machbarkeitstest, 4 Folien)"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "tools"))
from style import (Slide, font, W, INK, MUTED, ACCENT, BLUE, GREEN, CARD, LINE)

OUT = Path(__file__).parent
TOTAL = 4


def slide1():
    s = Slide(1, TOTAL)
    s.pill(72, 150, "ALLTAGSTECHNIK")
    y = s.wrapped(72, 240, "Wie fliegt ein Foto ohne Internet aufs **iPhone** neben dir?",
                  font("ExtraBold", 76), 936, line_gap=1.15)
    # Zwei Handys, dazwischen fliegt ein Foto
    s.phone(260, 900, 380)
    s.phone(820, 900, 380)
    for x in (380, 430, 480, 600, 650, 700):
        s.circle(x, 900, 7, fill=LINE)
    s.photo(540, 860, 130)
    s.text(540, 1000, "?", font("ExtraBold", 90), ACCENT, anchor="mm")
    s.text(72, 1190, "Wischen → in 30 Sekunden erklärt", font("SemiBold", 34), MUTED)
    return s


def slide2():
    s = Slide(2, TOTAL)
    s.pill(72, 150, "SCHRITT 1", bg=BLUE)
    y = s.wrapped(72, 240, "Bluetooth **findet** die Geräte", font("ExtraBold", 68), 936,
                  line_gap=1.15)
    s.wrapped(72, y + 24, "Dein iPhone ruft per Bluetooth leise „Ich bin hier!“ in die "
              "Runde. Das kostet kaum Akku – ist aber zu langsam für Fotos.",
              font("Medium", 38), 936, fill=MUTED)
    # Handy in der Mitte mit Funkwellen, Bluetooth-Badge
    cx, cy = 540, 960
    s.waves(cx - 70, cy, BLUE, start=150, end=210, r0=110, step=45)
    s.waves(cx + 70, cy, BLUE, start=-30, end=30, r0=110, step=45)
    s.phone(cx, cy, 340)
    s.circle(cx, cy, 58, fill=BLUE)
    s.bluetooth(cx, cy, 60)
    s.phone(150, 1010, 190, screen=LINE, body=MUTED)
    s.phone(930, 1010, 190, screen=LINE, body=MUTED)
    return s


def slide3():
    s = Slide(3, TOTAL)
    s.pill(72, 150, "SCHRITT 2", bg=GREEN)
    y = s.wrapped(72, 240, "WLAN baut eine **direkte Brücke**", font("ExtraBold", 68), 936,
                  line_gap=1.15)
    s.wrapped(72, y + 24, "Für die Datei schalten beide iPhones ein eigenes Mini-WLAN "
              "zwischen sich – ganz ohne Router. Das ist viel schneller.",
              font("Medium", 38), 936, fill=MUTED)
    # Zwei Handys, dicke grüne Brücke, Foto unterwegs, Schloss
    s.phone(230, 980, 320)
    s.phone(850, 980, 320)
    s.rrect(330, 966, 750, 994, 14, fill=GREEN)
    s.photo(480, 920, 96)
    s.circle(640, 980, 52, fill=CARD, outline=GREEN, width=6)
    s.lock(640, 975, 60, color=INK)
    s.text(640, 1060, "verschlüsselt", font("SemiBold", 28), INK, anchor="ma")
    return s


def slide4():
    s = Slide(4, TOTAL)
    s.pill(72, 150, "AHA!")
    y = s.wrapped(72, 240, "Kein Internet. Kein Router. Nur **zwei iPhones**.",
                  font("ExtraBold", 72), 936, line_gap=1.15)
    # Faktenkarte
    top = y + 60
    s.rrect(72, top, W - 72, top + 360, 36, fill=CARD)
    s.text(120, top + 50, "~9 m", font("ExtraBold", 120), ACCENT)
    s.wrapped(120, top + 200, "Reichweite. Deshalb klappt AirDrop auch im Wald oder "
              "im Zug ohne Netz.", font("Medium", 36), W - 240, fill=INK)
    # Zusammenfassung
    yy = top + 430
    for col, label, txt in ((BLUE, "Bluetooth", "findet"), (GREEN, "WLAN", "überträgt")):
        s.circle(96, yy + 22, 14, fill=col)
        s.text(130, yy, label, font("Bold", 40), INK)
        lw = s.d.textlength(label + " ", font=font("Bold", 40)) / 2
        s.text(130 + lw, yy, f"{txt}", font("Medium", 40), MUTED)
        yy += 70
    s.text(72, 1210, "Folge für mehr Technik, einfach erklärt.", font("SemiBold", 32), ACCENT)
    return s


if __name__ == "__main__":
    for i, fn in enumerate((slide1, slide2, slide3, slide4), 1):
        p = OUT / f"slide-{i}.jpg"
        fn().save(p)
        print(p, p.stat().st_size // 1024, "KB")
