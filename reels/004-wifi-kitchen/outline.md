# Reel 004 · Wi-Fi in the kitchen — outline and production notes

**Status:** produced (2026-11-22), awaiting approval · **Backlog:** #04 ·
**Length:** 46.5 s (narration 46.0 s, 158 wpm) · **Slot fit:** share topic →
Tue–Thu · **Planned slot:** see `docs/schedule.md` · **Ending:** spoken +
on-screen save CTA, 1.7 s ("Save this for later."), after the payoff.
**Caption CTA:** save ("Save this for the next time your video call freezes.").

Final narration is in `script.json` (render the voice with
`LENGTH_SCALE=1.28`, see Reproduce); visuals in `scene.js`; caption in
`caption.txt`.

## Angle

Your Wi-Fi and your microwave share the same radio band. The microwave's
metal box keeps almost everything in, but it works with around a thousand
watts against Wi-Fi's one watt at most, so the little that escapes is enough
to drown the Wi-Fi out while it runs. The fix follows directly: 5 GHz is a
different band.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "Why is your Wi-Fi slower in the kitchen?" | Title = the question. Router → phone data packets flow (blue); at 0.8 s the microwave switches on, orange waves spread, packets scatter red, phone shows a spinner and "slow…". |
| Twist | "Often, it's your microwave. It uses the same radio band as your Wi-Fi." | Tags pop up: "2.4 GHz" on the router, "2.45 GHz" on the microwave. |
| Step 1 | "Wi-Fi sends data as radio waves, often on the two point four gigahertz band." | Spectrum panel 2.40–2.50 GHz: the Wi-Fi band fills in, channels 1/6/11 rise one by one; router icon. |
| Step 2 | "A microwave heats food with radio waves too, at two point four five gigahertz, right inside that band." | Microwave icon appears; a broad flickering orange spike rises at 2.45 GHz on top of the Wi-Fi channels; dashed box marks "inside that band". |
| Step 3a | "Step three, the surprise: the metal box keeps almost all of it in, but a little gets out." | Cross-section of the cooking chamber: a wave bounces between metal walls; on "a little gets out" arcs leak out to the right, labelled. |
| Step 3b | "And your microwave makes around a thousand watts. Your router sends with one watt, at most." | 1,000 dots fill orange ("Microwave ≈ 1,000 W"); one pulsing blue dot "Router ≤ 1 W", legend "1 dot = 1 watt". |
| Step 3c | "So even that little leak can drown out your Wi-Fi while it runs." | Kitchen again, microwave on, packets scramble and drop. |
| Payoff | "The fix: use your router's five gigahertz band, far away from the microwave's frequency." | A 2.4 GHz \| 5 GHz switch flips to 5 GHz; packets turn green and flow cleanly while the microwave keeps running; phone shows Wi-Fi + progress. |
| CTA (1.7 s) | "Save this for later." | Bookmark icon, "Save this for later", "Follow @tech.simple.explained". |

## Facts and evidence

| Claim | Evidence | Status |
|---|---|---|
| Microwave ovens interfere with Wi-Fi; Wi-Fi uses the 2.4 GHz band; many Wi-Fi devices can use 5 GHz instead | Apple Support 102319: avoid using wireless devices near "common sources of interference, such as … microwave ovens"; "Both Bluetooth and Wi-Fi devices use the 2.4 GHz band, but many Wi-Fi devices can use the 5 GHz band instead." | **primary** |
| Microwave ovens run at 2.45 GHz | FCC 47 CFR 18.107 (domestic microwave ovens = consumer ISM equipment) + 18.301 (ISM frequency 2450 MHz ± 50 MHz); Midea 1025F1A spec sheet: "Frequency 2450 MHZ" | **primary** |
| 2.45 GHz is inside the Wi-Fi 2.4 GHz band | FCC 47 CFR 15.247: Wi-Fi-type digital modulation in 2400–2483.5 MHz | **primary** |
| Microwaves bounce off the metal walls | FDA, Microwave Oven Radiation: microwaves "are reflected by metal"; they "reflect off the metal interior of the oven" | **primary** |
| A little gets out | FDA: a federal standard (21 CFR 1030.10) "limits the amount of microwaves that can leak from an oven" (no health wording used in the Reel); Apple lists microwave ovens as an interference source | **primary** (neutral wording) |
| A microwave makes around a thousand watts | LG MSER0990S spec sheet: "Microwave Power Output 1,000 W"; Midea 1025F1A: 1000 W output | **primary** (typical models; "around") |
| A router transmits with one watt at most | FCC 47 CFR 15.247(b)(3): 1 W output limit for digital modulation in 2400–2483.5 MHz (the EU limit is lower: 100 mW EIRP) | **primary** (US rule; "at most" holds for both) |
| 5 GHz is far from the microwave's frequency | FCC 18.301: microwave ISM band 2450 ± 50 MHz; FCC 15.247 covers 5725–5850 MHz; Apple 102319 names 5 GHz as the alternative Wi-Fi band. The full U-NII 5 GHz range (15.407) was not fetched. | **primary** |

**Not claimed (on purpose):** no health or safety statements; no claim that
the effect happens when the microwave is off; no claim that 5 GHz is immune
to all interference ("far away from the microwave's frequency" only).

**Lessons from production:**
- Number-heavy narration ("two point four five gigahertz") is slow in Piper:
  the 1.38 default measured 143.5 wpm, so this Reel uses `LENGTH_SCALE=1.28`
  (158 wpm). `script.json` records this as `length_scale`; `tts.py` does not
  read that key yet.
- Whisper misheard "Blame the microwave" ("Well, aim…") and "transmitter:"
  ("transmit"); rephrased to "It's your microwave" and "Your router sends with".
- `T.word(seg, "two")` matched "Step two"; anchor timings on a unique word
  ("point").

## Reproduce

```bash
LENGTH_SCALE=1.28 python3 tools/reel/tts.py reels/004-wifi-kitchen
python3 tools/reel/render.py reels/004-wifi-kitchen
python3 tools/reel/check.py reels/004-wifi-kitchen
```
