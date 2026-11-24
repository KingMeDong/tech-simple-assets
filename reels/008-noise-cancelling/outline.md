# Reel 008 · Noise-cancelling headphones — outline and production notes

**Status:** produced (2026-11-22), awaiting approval · **Backlog:** #06 ·
**Length:** 48.4 s (narration 47.0 s, 156 wpm, `length_scale` 1.32) ·
**File:** 5.3 MB · **Ending:** seamless loop (last frame runs into the first;
seam diff 1.45 vs 0.8 between two normal frames) · **Caption CTA:** send.

## Angle

Noise-cancelling headphones don't (only) block noise: they **add** sound. A
microphone hears the noise, a chip flips the wave, the speaker plays the
flipped copy, and the two cancel. The catch makes it honest: steady hums
vanish, sudden sounds and voices partly get through.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "How do noise cancelling headphones work?" | Title = the question. Neutral head with headphones, orange noise waves arriving from both sides. |
| Twist | "They don't just block noise. They add sound, to make silence." | Mini equation builds word by word: orange wave + blue wave = green flat line; a green "quiet" ring appears around the head. |
| Step 1 | "…a tiny microphone on the outside listens to the noise around you." | Cross-section of one ear cup: noise wave reaches the outside mic, mic pulses, a scope panel draws "what the mic hears". |
| Step 2a | "…a chip flips the sound wave upside down, and the speaker plays it into your ear. It's called anti-noise." | Chip lights up, the scope wave flips upside down and turns blue ("flipped: anti-noise"); the speaker sends the blue wave towards the ear. |
| Step 2b | "When the noise squeezes the air, the anti-noise wave stretches it. The two waves cancel each other out." | Three lanes (noise + anti-noise = what you hear); a marker follows one crest ("squeeze") and its trough ("stretch"); the bottom lane flattens to green, ✓. |
| Step 3a | "…the catch: this works best on steady, low sounds, like the hum of an engine or an air conditioner." | Fan icon "steady hum"; slow smooth wave, exact inverse, flat green result, ✓. |
| Step 3b | "Sudden sounds, like a barking dog, and voices are harder to copy, so some of them still get through." | Bark burst and speech bubble; spiky bursts, anti-noise arrives a little late, the result keeps spikes, "!" "some gets through". |
| Payoff | "So your headphones don't just block noise. They play its exact opposite." | Back to the head: quiet ring + the equation. |
| Loop | — | Equation and ring fade out; the scene runs straight into frame 0. |

## Facts and evidence

| Claim | Source | Status |
|---|---|---|
| An outside microphone detects the noise around you | Apple Support 108918: "an outward-facing microphone or microphones detect external sounds"; Bose: "two microphones that read and analyze the sounds around you" | **primary** |
| The headphones create the opposite wave ("anti-noise") and play it, cancelling the noise before you hear it | Apple Support 108918 ("counter with anti-noise, canceling the external sounds before you hear them"); Apple Newsroom 2019 ("create an equivalent anti-noise"); Bose ("emit opposite signals"; "digital processing to generate an opposing signal") | **primary** |
| Flipped ("out of phase") waves subtract / cancel | Georgia State University HyperPhysics, Interference of Sound: "destructive interference if they are 'out of phase' and subtract" | **primary (university)** |
| Squeeze / stretch of the air | Simplified wording for compression and rarefaction of a sound wave (HyperPhysics) | simplification |
| Works best on steady, low sounds (engine hum, air conditioner) | Bose: "ANC generally works best for steady low-frequency sounds, like the hum of an air conditioner or passing traffic"; Bose intro names "a train or plane engine" | **primary** |
| Sudden sounds (barking dog) and voices are harder; some gets through | Bose: less effective "against sudden and sharp background noise, like a dog barking"; "voices are harder to cancel ... because they change quickly ... Some speech may still come through" | **primary** |
| A chip does the flipping | Bose: "digital processing"; Apple: AirPods counter with anti-noise (processing inside the earbuds) | **primary** (wording "chip" simplified) |

Deliberately left out: the inward-facing (feedback) microphone (Apple
documents it, but not every model has one), Apple's "200 times per second"
(AirPods Pro 2019 only), any hearing or health claim.

## Lessons

- Piper says the hyphenated "noise-cancelling" as "noise-gancelling"; the
  unhyphenated "noise cancelling" is clear (on-screen text keeps the hyphen).
- "Where the noise pushes the air" was heard as "Whether noise…", and "the
  anti-noise stretches it" as "the other noise…"; "When the noise squeezes the
  air, the anti-noise wave stretches it" is clear.
- At the 1.38 default this script ran at 150.8 wpm; `length_scale` 1.32 in
  `script.json` gives 156 wpm.
- For the loop, the end card renders the hook scene at `t − total`, so the
  moving waves continue seamlessly into frame 0.

## Reproduce

```bash
python3 tools/reel/tts.py reels/008-noise-cancelling
python3 tools/reel/render.py reels/008-noise-cancelling
python3 tools/reel/check.py reels/008-noise-cancelling
```

## Re-voiced 2026-11-24

Re-voiced at Piper's natural pace (`LENGTH_SCALE` 1.05, owner's choice after the listening test). Old: 48.4 s, 156 wpm incl. pauses (166 speech only). New: 42.1 s, 180 wpm incl. pauses (193 speech only). Script text unchanged; scene timings follow the word timeline, no scene edits needed. check.py all PASS.
