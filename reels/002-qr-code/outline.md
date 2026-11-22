# Reel 002 · QR code — outline

**Status:** outlined (2026-11-22) · **Backlog:** #02 · **Target length:** ~45 s
(≈125 words at 160 wpm) · **Slot fit:** share topic → Tue–Thu ·
**Planned slot:** Tue 2026-11-24, 18:00 German time · **Ending:** seamless loop
(Reel 001 used a send CTA, so this rotates the ending type, experiment 5).

## Angle

A QR code is not a picture of your link. It is a puzzle that carries its own
spare parts, and that is why it survives a torn corner but not a missing
corner square. Every damage shown on screen is a real, tested image that
actually scans (or actually fails), so a viewer who scans the screen with a
second phone sees the claim hold.

## Beat sheet

| Time | Beat | Voiceover (draft) | Visual (muted-readable) |
|---|---|---|---|
| 0–3 s | Hook | "How does a QR code still work when it's torn?" | Title card with the same question. A clean QR code; its bottom-right corner rips off like paper. A scan frame snaps on → green check. |
| 3–6 s | Twist | "A fifth of it is gone, and your camera still reads it." | The torn area is outlined, label "≈20% torn off". Check stays green. |
| 6–14 s | Step 1 | "Step one: the three big squares tell your camera where the code is and which way up it is, from any angle." | The three corner squares pulse. The code spins and tilts in 3D; the camera frame keeps locking on. |
| 14–23 s | Step 2 | "Step two: each small square is a one or a zero. And next to your message, the code stores extra repair data." | Zoom into the grid; squares flip into 1s and 0s. They group into blocks: blue "message" blocks, then orange "repair" blocks appended. |
| 23–35 s | Step 3 (surprise) | "Step three, the clever part: like a sudoku, the missing pieces can be worked out from the ones that are left. On the strongest setting, about thirty percent of the data can be rebuilt. That's why some codes have a logo in the middle." | Torn blocks turn grey, then orange repair blocks "solve" them back in, sudoku-style. Split screen: same tear on a low setting ✗ vs strongest ✓. Our own logo drops into the centre → check. |
| 35–42 s | Payoff | "But cover one of the three big squares, and your camera can't even find the code." | A corner square is covered; the scan frame searches and fails (red). |
| 42–44 s | Loop | — (beat of silence / sound cue) | The cover is removed, the code is whole again: the exact first frame, so the tear starts over. |

Draft voiceover: 126 words (≈47 s of speech at 160 wpm, plus pauses and the 2 s loop).

## Facts and evidence

| Claim in the script | Evidence so far | Status |
|---|---|---|
| A level-H code still scans with ~20% of its area torn from the corner without a finder pattern | Own test: `qr_tests.py` (OpenCV and ZXing both decode at 5–20%) | **tested**, phone test pending |
| Covering one corner square breaks the scan | Own test: all three finder patterns, both decoders fail | **tested**, phone test pending |
| Same tear on a low setting (L) fails | Own test: L fails from 8% corner tear | **tested** |
| The three squares give position and orientation, readable from any angle (360°) | Denso Wave history page: 1:1:3:1:1 position detection pattern, orientation "regardless of the angle of scanning, which could be any angle out of 360°" (qrcode.com/en/history) | **primary** (Denso Wave) |
| Dark module = 1, light = 0 (only in the visual) | ISO/IEC 18004 (to quote) | **to verify** |
| Reed-Solomon repair data | Wikipedia (secondary); ISO/IEC 18004:2024 | **to verify** (primary) |
| Strongest level restores ~30% of the data (codewords, not area) | Wikipedia table "Approx. codewords restored" L/M/Q/H 7/15/25/30% (secondary); Denso Wave error-correction page returned 403 to our fetch | **to verify** (primary) |
| Logos in the middle rely on error correction | Wikipedia (secondary) | **to verify** |

**Wording guardrails:**
- Never say "30% of the code" or label the torn area as 30%. The 30% refers to
  data codewords. A torn area maps to more codewords than its share of the
  printed area, so ~20% torn area is what we show.
- "Sudoku" is an analogy for redundancy, not a description of Reed-Solomon
  math. Keep it as "works like".
- Phones differ. Only state "can't even find the code" if the phone test
  (iPhone camera and an Android camera) confirms it; otherwise say "usually
  can't".

## Production notes

- The on-screen code must be real and must scan in every frame where it is
  shown as working. Encode a short, non-link text (draft:
  `tech.simple.explained`), level H, and re-run `qr_tests.py` on the exact
  frames.
- Draw the code as our own vector graphic (no third-party QR artwork, E1).
  QR Code is a registered trademark of Denso Wave; we only use the generic term.
- Cover idea: "How does a torn QR code still work?" + a torn QR icon, title
  inside the central 1010×1350 px (V12).
