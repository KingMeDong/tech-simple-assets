# Reel 002 · QR code — outline and production notes

**Status:** produced (2026-11-22), waiting for owner approval · **Backlog:** #02 ·
**Length:** 48.0 s (narration 46.2 s, 168 wpm) · **Slot fit:** share topic →
Tue–Thu · **Planned slot:** Tue 2026-11-24, 18:00 German time · **Ending:**
seamless loop (Reel 001 used a send CTA). **Caption CTA:** open question.

Final narration is in `script.json`; visuals in `scene.js`; caption in
`caption.txt`.

## Angle

A QR code is not a picture of your link. It is a puzzle that carries its own
spare parts, and that is why it survives a torn corner but not a covered
corner square. Every code on screen is real (`make_qr.py`), and every frame
that shows a code working or failing has been decoded to prove it
(`qa_scan.py`, OpenCV + ZXing).

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "How does a QR code still work when it's torn?" | Title = the question. A blue scan line searches; the bottom-right corner rips off (~15%); green scan → ✓ by 2.7 s. |
| Twist | "A whole corner is gone, and your camera still reads it." | Dashed outline of the missing corner, label "≈ 15% gone", repeated green scans. |
| Step 1 | "…the three big squares tell your camera where the code is, and which way up it is, from any angle." | Finder squares light up, dashed lines join them ("the map"), the code spins 360° while the camera frame stays locked. |
| Step 2 | "…each small square is a one or a zero. And next to your message, the code stores extra repair data." | 7×7 zoom with 1s and 0s; then the real codeword layout: blue = message (26 codewords), orange = repair (44 codewords). |
| Step 3 | "…like a sudoku puzzle, the missing pieces can be worked out from the ones that are left." | Corner tears off, "?" in the gap, then the missing squares fill back in orange; ✓. |
| Step 3b | "On the strongest setting, up to about thirty percent of the data can be rebuilt." | Same tear on a low-setting code (✗) and the strongest setting (✓). |
| Step 3c | "That's why some codes have a logo in the middle." | Our own logo drops into the centre; ✓. |
| Payoff | "But if you cover one of the three big squares, many scanners can't even find the code." | A sticky note covers one corner square; the frame searches, then ✗ "No map, no scan." |
| Loop | — | Note flies off; the last frame runs into the first. |

## Facts and evidence

| Claim | Evidence | Status |
|---|---|---|
| QR codes recover data when partly stained or damaged | Denso Wave (inventor): "Since QR Code® has an error correction function, data can be recovered even in parts of the code that are stained or damaged." (denso-wave.com, What is a QR Code?) | **primary** |
| The corner squares let the camera find the code and its orientation from any angle | Denso Wave history: 1:1:3:1:1 position detection pattern; orientation found "regardless of the angle of scanning, which could be any angle out of 360°" (qrcode.com/en/history) | **primary** |
| Strongest setting rebuilds up to about 30% of the data | ISO/IEC 18004 Reed-Solomon block tables (as implemented in python-qrcode): at level H, half the repair codewords = 30.8–33.2% of all codewords for every version. Wikipedia: L/M/Q/H ≈ 7/15/25/30% of codewords. The Denso Wave error-correction page and the ISO text were not reachable (HTTP 403 / paywall). | **derived from the standard + secondary**; wording says "up to about" |
| Repair data is Reed-Solomon (caption only) | Wikipedia QR code; ISO/IEC 18004 | secondary |
| A torn corner still scans; a low setting fails; a covered corner square fails | Own tests with OpenCV + ZXing on generated codes and on every rendered frame | **tested**; phone camera test pending (owner) |

**What we learned while producing it:**
- The 30% refers to data codewords, not printed area. On a dark background a
  level-H code scanned with 13–18% of its area torn from a corner and failed
  at 20%, so the Reel shows ~15% and says "a whole corner", not "a fifth".
- Scan-line overlays must stay thin and translucent inside the code, or
  paused frames stop scanning.
- Piper's `LENGTH_SCALE` 1.05 gave 203 wpm; 1.38 gives ~168 wpm (new default).
- "sudoku" alone was misheard by Whisper as "pseudo-coo"; "sudoku puzzle"
  is clear. "But cover…" at a segment start was misheard; "But if you
  cover…" is clear.

## Reproduce

```bash
python3 reels/002-qr-code/make_qr.py          # writes QR data into scene.js
python3 tools/reel/tts.py reels/002-qr-code
python3 tools/reel/render.py reels/002-qr-code
python3 tools/reel/check.py reels/002-qr-code
python3 reels/002-qr-code/qa_scan.py          # every ✓ scans, every ✗ fails
```
