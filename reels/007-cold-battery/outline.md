# Reel 007 · Cold battery — outline and production notes

**Status:** produced (2026-11-22), awaiting approval · **Backlog:** #08 (cold
battery) · **Length:** 47.1 s (narration 46.5 s, 153 wpm) · **Slot fit:**
search topic (Fri–Sun) · **Ending:** spoken + on-screen save CTA "Save this
for winter." (1.3 s + 0.6 s end card, ≤ 2 s).

Final narration is in `script.json`; visuals in `scene.js`; caption in
`caption.txt`.

## Angle

Your phone doesn't run out of charge in the cold. The charge gets stuck:
ions crawl through a liquid that has turned thick, the battery can't supply
a sudden burst of power, and the phone shuts itself down to protect the
electronics, with charge still inside. Warm it up and it comes back.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "Why does your phone die faster in the cold?" | Title = the question. A thermometer falls from 20 °C to −10 °C (68 → 14 °F) as snow starts; the phone's battery icon drains and the phone shuts down ("shut down") by 2.4 s. |
| Twist | "Here's the twist: the battery isn't empty. The charge is just stuck." | An X-ray beam from the dark phone reveals the battery cut-away, full of glowing ions ("still charged"); they freeze in place under ice crystals. |
| Step 1 | "…lithium ions swim through a liquid from one side to the other. Each ion that crosses lets an electron flow through your phone." | Cut-away battery (− and + electrodes, liquid between) with ions streaming across; a wire loop appears over it with electrons flowing through a small phone: "1 ion across = 1 electron through the phone". |
| Step 2 | "…in the cold, that liquid gets thicker, like syrup. The ions slow down, and the battery's resistance goes up." | Thermometer drops, the liquid turns icy and wavy ("thick as syrup"), ions and electrons slow to a crawl, a resistance dial swings into the red. |
| Step 3a | "…when your phone suddenly needs a burst of power, the slow battery can't deliver it fast enough." | Phone opens the camera (flash); bars "needed" shoots up, "battery gives" stays low; red dashed gap "not enough". |
| Step 3b | "So your phone shuts down to protect itself, even though there's still charge inside." | The phone goes dark ("protecting itself") next to a thick-liquid battery still full of ions ("charge still inside"). |
| Payoff | "Warm it back up, and the charge comes back." | Thermometer rises, snow stops, ions speed up, the phone turns on with its battery back; ✓. |
| CTA | "Save this for winter." | Bookmark icon. |

## Facts and evidence

| Claim | Evidence | Status |
|---|---|---|
| Phones lose battery life in the cold and can turn off | Apple 118431: "very cold conditions outside of its operating range might temporarily shorten battery life and could cause your device to turn off" | **primary** |
| It is temporary; warming brings it back | Apple 105105: "This condition is temporary; when the battery's temperature returns to its normal operating range, its performance will return to normal." Apple 118431: "Battery life will return to normal when you bring your device back to higher ambient temperatures." | **primary** |
| Lithium ions move through a liquid (electrolyte) between the electrodes | Communications Chemistry 2025 review (nature.com/articles/s42004-025-01564-5): "transport of lithium ions between the electrodes" | **primary** (peer-reviewed review) |
| Cold makes that liquid thicker; ions slow; resistance rises | Same review: "Low temperatures severely impair LIB performance by slowing ion transfer, increasing internal resistance, and reducing electrolyte conductivity"; carbonate electrolytes "suffer from increased viscosity". Apple 101575: "A battery's impedance will temporarily increase … in a cold temperature environment … common to all lithium-ion batteries" | **primary** |
| A sudden burst of power can't be delivered; the phone shuts down to protect itself | Apple 101575: electronics must "draw upon instantaneous power"; "A battery with a high impedance might not be able to provide sufficient power"; "the system will perform a shutdown to preserve these electronic components"; unexpected shutdowns are more likely "when you're in colder temperatures" | **primary** |
| "Each ion that crosses lets an electron flow through your phone" | Charge balance in a Li-ion cell: each Li⁺ through the electrolyte pairs with one electron through the external circuit (standard cell chemistry; consistent with the review's description) | textbook; not quoted from a fetched page |
| "Like syrup" | Analogy for increased viscosity (review) | analogy |
| On-screen temperatures (20 °C → −10 °C, 68 → 14 °F) | Illustrative; −10 °C is below Apple's 0–35 °C operating range (118431) | illustration |

**Wording guardrails:** no safety or health claims, no advice beyond the
fact that warming restores battery life (Apple). The battery icon shows a
fill level, not a percentage, so no specific numbers are implied. The
"needed / battery gives" bars are a visual metaphor, not measured data.

## Lessons

- `T.word()` strips apostrophes from spoken words, so match "cant", not
  "can't" (it silently fell back to the segment start).
- The external-circuit wire above the battery must stay below the second
  headline line (~y 540): shorter wire, smaller device.
- At the default `length_scale` (1.38) this script came out at 153 wpm with
  no unheard words; no per-Reel override needed.

## Re-voiced 2026-11-24

Re-voiced at Piper's natural pace (`LENGTH_SCALE` 1.05, owner's choice after the listening test). Old: 47.1 s, 153 wpm incl. pauses (162 speech only). New: 39.6 s, 182 wpm incl. pauses (196 speech only). Script text unchanged; scene timings follow the word timeline, no scene edits needed. check.py all PASS.
