# Reel 005 · Face ID — outline and production notes

**Status:** produced (2026-11-22), awaiting approval · **Backlog:** #05 ·
**Length:** 50.0 s (narration 48.0 s, 154 wpm) · **Slot fit:** search topic →
Fri–Sun · **Ending:** 2 s silent end card with an open question
("Face ID or passcode: which do you use?"); caption CTA is the same question.

Final narration is in `script.json` (with sources); visuals in `scene.js`;
caption in `caption.txt`.

## Angle

"In the dark" is the hook, but the surprise is that the phone isn't looking
at your face the way you think: it lights it with light you can't see, throws
thousands of dots on it, and compares a 3D map, as numbers, inside a
protected part of the chip. The payoff is the privacy line, which is the most
shareable fact.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "How does Face ID work in the dark?" | Title = the question. A dark, stylised face; a generic phone with a pulsing camera dot; the screen wakes with a lock. |
| Twist | "It covers your face in thousands of invisible dots." | Red dots fly from the phone and land on the face; eye-with-slash "invisible". |
| Step 1 | "…infrared light. Your eyes can't see it, but your phone's infrared camera can, so it works even in total darkness." | Infrared beam; "your eyes" (slashed eye) vs "IR camera" brackets; the face turns into a grey infrared image; moon + "total darkness ✓". |
| Step 2 | "…a dot projector paints thousands of infrared dots onto your face. The first Face ID iPhone used more than thirty thousand. From those dots, your phone builds a 3D depth map of your face." | Dots stream from the "dot projector"; card "30,000+ dots on the first Face ID iPhone (2017)"; dots take depth colours (far blue → near orange), join into a mesh that turns left and right; far/near legend. |
| Step 3 | "…a protected part of the chip turns that map into numbers, and compares them with the face you set up." | Mesh shrinks into a chip with a shield and lock; rows "now" vs "saved" (illustrative numbers) light up green → "match ✓". |
| Step 3b | "That's why a photo can't unlock it: a photo has no depth." | A printed photo of a face; the depth mesh on it is flat and turns like a sheet; "no depth ✗", red lock. |
| Payoff | "And your face data never leaves your phone. Not even Apple can see it." | Big phone with the face mesh and a lock; data blocks bounce back inside; cloud labelled "Apple" gets slashed; "stays on your phone". |
| End card (2 s, no voice) | — | "Face ID or passcode: which do you use?" + follow line. |

## Facts and evidence

| Claim | Evidence | Status |
|---|---|---|
| Thousands of invisible dots are projected and analysed to create a depth map; an infrared image is also captured | Apple Support "About Face ID advanced technology" (support.apple.com/en-us/102381) | **primary** |
| More than 30,000 dots on the first Face ID iPhone | Apple Newsroom, iPhone X launch 2017: "Face ID projects more than 30,000 invisible IR dots" | **primary** (scoped to the first model; the current article gives no number) |
| TrueDepth has a dot projector and an infrared camera | Apple Newsroom 2017 | **primary** |
| Works in total darkness | Apple Support 102381: "designed to work indoors, outdoors, and even in total darkness" | **primary** |
| A protected part of the chip turns the map into numbers and compares them with the enrolled face | Apple Support 102381: a portion of the neural engine "protected within the Secure Enclave" transforms depth map + infrared image into "a mathematical representation" and compares it "to the enrolled facial data" | **primary** (simplified: "numbers" = mathematical representation) |
| A photo can't unlock it because it has no depth | Apple Support 102381: "Face ID always requires depth information, which isn't found in print or 2D digital photographs" | **primary** |
| Face data never leaves the phone; Apple can't see it | Apple Support 102381: "Face ID data doesn't leave your device, is never available to iOS or iPadOS, apps, or Apple" | **primary** |
| The numbers shown (0.81, 0.12 …) | Illustration only, not real Face ID data | visual metaphor |

**Left out on purpose:** the flood illuminator's role (Apple's pages name the
part but don't describe it), the 1-in-1,000,000 figure (needs the twins,
siblings and under-13 caveats), and the iPhone 18 Pro "additional image data".

## Lessons

- Apple's current support page says "thousands" of dots; the famous 30,000
  figure is from the 2017 iPhone X launch, so the script dates it.
- `faceSVG` must be positioned explicitly; drawing at the origin put the face
  off-screen in the first stills.
- A pixel check for bright content outside x 65–1015 / y 270–1250 caught a
  label 13 px over the left edge that the stills didn't show.
- Whisper heard "infrared", "projector" and "thirty thousand" correctly at
  `LENGTH_SCALE` 1.38 (154 wpm).

## Reproduce

```bash
python3 tools/reel/tts.py reels/005-face-id
python3 tools/reel/render.py reels/005-face-id
python3 tools/reel/check.py reels/005-face-id
```

## Re-voice

- **Re-voiced at natural pace (2026-11-24):** `LENGTH_SCALE` 1.05 instead of 1.38 (owner's choice after a listening test). Length 50.0 s → 42.0 s; 154 → 185 wpm incl. pauses (200 speech-only). Clean on the first take. No wording or scene changes.
