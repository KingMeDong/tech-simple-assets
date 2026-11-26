# Reel 013 · Dark mode — outline and production notes

**Status:** produced (2026-11-26) · **Backlog:** #15 · **Length:** 41.1 s
(narration 40.5 s, 175 wpm, Piper natural pace `LENGTH_SCALE` 1.05, no
override) · **Slot fit:** search topic → Fri–Sun · **Planned slot:** Fri
2026-12-04, 18:00 German time · **Ending:** spoken + on-screen open question
"Is your phone in dark mode right now?" (2.35 s incl. 0.6 s end card) ·
**Caption CTA:** the same open question.

Final narration is in `script.json`; visuals in `scene.js`; caption in
`caption.txt`; YouTube text in `youtube.txt` (video link still has the
`COMMIT_SHA` placeholder).

## Angle

"Does dark mode save battery?" has a two-part answer most people never hear:
it depends on the screen (LCD vs OLED), and on OLED it depends on brightness.
The Reel shows why with a cross-section (LCD: one backlight behind every
pixel) and a pixel grid (OLED: every pixel is its own light), then puts the
measured numbers on a brightness slider. Payoff: in bright sunlight dark mode
helps; indoors, turning brightness down can save as much.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook (0–1.8 s) | "Does dark mode really save battery?" | Title = the question from frame 0. A tilted phone is already wiping from light to dark at frame 0; a light/dark toggle flips; the battery icon shows "?" on "battery". |
| Twist | "On some screens, it barely makes a difference." | Two phones, "LCD" and (dimmed) "OLED", flip to dark on "screens". The LCD screen stays grey (backlight glow) and its power bar barely moves: "power: barely changes". OLED gets a "?". |
| LCD | "Many older phones use LCD screens. A backlight shines behind the whole screen, and the pixels just block the light. So even black costs power." | LCD phone with a glow behind it ("older phones"), then a cross-section: backlight → liquid crystal shutters → color filter → "you see". On "block", two shutters close and those pixels turn black; on "black", a red "still ON" chip replaces the backlight label and the black pixels get a dashed frame. Headline: "LCD: even black costs power". |
| OLED | "Many newer phones use OLED. Here, every pixel makes its own light, and a black pixel is simply switched off." | A 7×5 grid of RGB pixels, "no backlight"; pixels light up in a wave on "every"; on "switched", all but a short "line of text" switch off and the power meter drops: "off = no light, no power". |
| Study | "So how much does that save? University researchers measured it on OLED phones." | Big "?" + battery, then four phones flipping to dark above a "power meter"; label "Purdue University · 2021 · 6 popular apps". |
| Low | "At normal indoor brightness, dark mode saved only about three to nine percent." | Brightness slider at "30–50 %"; bars: light mode 100 %, dark mode 94 % (middle of 3–9 %), "only 3–9 % less"; note "average saving on OLED phones, same brightness". |
| High | "At full brightness, about forty percent." | Slider slides to "100 %"; the dark bar shrinks to 57 % (middle of 39–47 %), "39–47 % less". |
| Payoff | "So dark mode pays off most in bright sunlight. Indoors, turning your brightness down can save just as much." | Sun + dark-mode phone + ✓ "bright sunlight → dark mode". Then lamp + slider sliding 50 % → 20 % in light mode; its power bar shrinks until it equals "dark mode · 50 %" ("="); note "one measured example (Purdue)". |
| CTA (2.35 s) | "Is your phone in dark mode right now?" | Big sun/moon toggle flipping between "light" and "dark". |

## Facts and evidence

| Claim | Evidence | Status |
|---|---|---|
| Savings depend on the screen type ("on some screens it barely makes a difference") | Android Developers: dark theme "Reduces power usage by a significant amount, depending on the device's screen technology." Purdue release: OLED draws less power for dark pixels "because this type of screen doesn't have a backlight like the LCD". LG: LCD backlights "deliver consistent light across the whole panel". | **primary**; softened to "barely" (no measured LCD number) |
| Many older phones use LCD; many newer phones use OLED | Purdue release: "Smartphones that came out after 2017 likely have an OLED … screen", "LCD … screens of older phones" | **primary**; "many", no market share |
| LCD: a backlight lights the whole screen, the liquid crystal blocks or passes light, a color filter colors it; black still costs power | LG screen-technology explainer (backlight evenly behind the whole panel; liquid crystals shift to produce colours); Purdue release (no saving from dark pixels on backlit LCD) | **primary**; "costs power" = the backlight stays on (local-dimming LCDs not covered; not common in phones) |
| OLED: every pixel makes its own light; a black pixel is off | LG: OLED "don't require a backlight", sub-pixels "light up when a voltage is applied", "individual pixels can be turned off"; Dash & Hu abstract: OLED omits external lighting | **primary** |
| Measured on OLED phones by university researchers | Purdue release; Dash & Hu, ACM MobiSys 2021 (doi 10.1145/3458864.3467682): 6 Google apps on Pixel 2, Moto Z3, Pixel 4, Pixel 5 | **primary** (four phones shown) |
| At typical indoor brightness (30–50 %) dark mode saves only about 3–9 % | Purdue release: "At 30%-50% brightness … switching from light mode to dark mode saves only 3%-9% power on average for several different OLED smartphones"; indoor auto-brightness "around 30%-40%" | **primary (university release)**; the paper PDF itself was not reachable |
| At full brightness about 40 % (39–47 %) | Purdue release: "at 100% brightness saves an average of 39%-47% battery power" | **primary (university release)**; voice says "about forty", screen shows 39–47 % |
| Indoors, turning brightness down can save just as much | Purdue release: Google News, Pixel 5: light mode at 20 % brightness draws the same as dark mode at 50 % | **primary**, one example; worded "can", on screen "one measured example" |
| Bars | Relative to light mode = 100 % at the same brightness; dark bars at the middle of each range (94 %, 57 %); payoff light bar shrinks to the dark-mode bar | illustration, labelled |

**What we softened or cut:**
- "On some screens it saves nothing" → "barely makes a difference" (no
  measured LCD figure; LCDs with local dimming exist).
- No market-share claim ("most phones are OLED") → "many older / many newer
  phones", as in the Purdue release.
- "Purdue" is not spoken: Piper read it as "Pert" in 4 of 5 takes. The voice
  says "University researchers"; the screen names Purdue University.
- No eye-strain or health claims.
- Whether the 3–9 % / 39–47 % refer to display power or the whole battery
  is not fully clear from the release (it says "power" and "battery power");
  the Reel says "saved … percent" and the screen "less power", without
  "of your battery".

## Voice QA

- Final take (`LENGTH_SCALE` 1.05): unheard words are only the spoken numbers
  ("three to nine percent", "forty percent"), which Whisper writes as
  "3-9%" and "40%" (false alarms, L3).
- "have" was heard as "had" in 2 of 3 takes → "use" (heard 3/3).
- "Purdue" failed in 4 of 5 takes (also as "Purdue University researchers",
  "A team at Purdue University") → "University researchers" (heard 3/3).

## Reproduce

```bash
python3 tools/reel/tts.py reels/013-dark-mode      # re-take until only digit "misses" remain
python3 tools/reel/render.py reels/013-dark-mode
python3 tools/reel/check.py reels/013-dark-mode
```
