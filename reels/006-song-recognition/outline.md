# Reel 006 · Song recognition — outline and production notes

**Status:** produced (2026-11-22), awaiting approval · **Backlog:** #10 ·
**Length:** 47.0 s (narration 46.5 s, 160 wpm) · **Slot fit:** share topic ·
**Ending:** spoken + on-screen send CTA "Send this to a music lover." (about
1.9 s, after the payoff). Final narration in `script.json`, visuals in
`scene.js`, caption in `caption.txt`.

## Angle

The app doesn't "listen" to the tune at all. It throws away almost the whole
spectrogram, keeps a star map of the loudest peaks, turns pairs of stars into
fingerprints and finds the one song whose fingerprints line up at the same
spacing, even when only 1–2% of them survive the noise. Source: the algorithm
Shazam's founder published in 2003 (Wang, ISMIR 2003). No app logo appears;
the app is only named in the caption.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "How does an app recognise a song in seconds?" | Title = the question. A generic phone listens (pulsing rings), notes fly in from a speaker, "Song found" card + ✓ by 2.1 s. |
| Twist | "It throws away almost all of the music." | A full, colourful spectrogram appears; at "throws" almost every cell fades and only bright peaks remain as stars; label "kept: only the peaks". |
| Step 1 | "…it turns the sound into a spectrogram, a picture of which pitches are loud at each moment." | The spectrogram is drawn column by column behind a playhead; axes "time →" and "pitch →"; legend "bright = loud". |
| Step 2 | "…it keeps only the loudest peaks. What's left looks like a map of stars." | Non-peak cells fade out, peaks pop in as stars from left to right; headline turns into "What's left: a map of stars". |
| Step 3a | "…it joins pairs of stars into fingerprints: two pitches, and the time between them." | Three anchor stars each get a dashed target zone and lines to their partner stars; one pair is labelled "pitch 1", "pitch 2" and "time between". |
| Step 3b | "Then it looks them up in a huge library of songs." | Fingerprint codes fly from "your clip" into four generic song cards; "Song 3" collects the most hits and lights up. |
| Step 3c | "The match is the song where your fingerprints line up at the same spacing. Even if only one or two percent survive the noise, it can still find it." | Scatter plot "time in your clip" vs "time in the song": chance hits scattered, the real matches form a diagonal; then almost all of them fade ("only 1–2% survive"), the line still holds → ✓ "still a match". |
| Payoff | "So it isn't listening to the tune. It's matching stars." | Phone with a mini star map and "Match found"; a struck-through note on the left, a big star on the right. |
| CTA | "Send this to a music lover." | Paper plane flying over a faint star field. |

Cover: pill "HOW IT ACTUALLY WORKS #6", title "How do apps recognise
songs?" (5 words), faded spectrogram with stars and fingerprint pairs.

## Facts and evidence

All from the primary source: Avery Li-Chun Wang (Shazam Entertainment),
"An Industrial-Strength Audio Search Algorithm", ISMIR 2003,
https://www.ee.columbia.edu/~dpwe/papers/Wang03-shazam.pdf

| Claim | Evidence (section) | Status |
|---|---|---|
| A song is identified from a few seconds of audio | 1: users sample "up to 15 seconds"; 3.1: tests with 15, 10 and 5 s excerpts | **primary** |
| The sound becomes a spectrogram (time × frequency, energy) | 2.1: spectrogram peaks, "time-frequency point" with "energy content" | **primary** ("pitch" is our plain word for frequency) |
| It keeps only the loudest peaks; almost everything else is discarded | 2.1: peaks are points with "higher energy content than all its neighbors", chosen "according amplitude"; "a complicated spectrogram … may be reduced to a sparse set of coordinates" | **primary** ("almost all" = the paper's "sparse") |
| It looks like a map of stars | 2.1: "constellation maps" because "the coordinate scatter plots often resemble a star field" | **primary** |
| Fingerprints = pairs of stars: two frequencies + time between | 2.2: "pairs of time-frequency points are combinatorially associated"; anchor point + target zone; hash from the two frequencies and the time difference | **primary** |
| Fingerprints are looked up in a database of songs | 2.3: "Each hash from the sample is used to search in the database" (deployed with 1.8M tracks; we only say "huge library") | **primary** |
| The match is the song whose fingerprints line up at the same spacing | 2.3: matching features "occur at similar relative offsets", forming "a diagonal line within the scatterplot"; score = number of time-aligned matches | **primary** |
| Even 1–2% surviving is enough | 3.1: "from a heavily corrupted 15 second sample, a statistically significant match can be determined with only about 1-2% of the generated hash tokens actually surviving" | **primary** |
| Caption: "That's the method Shazam published in 2003" | Paper by Shazam Entertainment, ISMIR 2003 | **primary**; we make no claim about how today's apps work |

Illustration only: the spectrogram is synthetic "music" generated in code,
the fingerprint codes and song cards are made up, and the scatter plot uses
48 matches of which 2 survive (≈4%; the 1–2% figure is in the label).

## Lessons

- `T.word()` strips apostrophes before matching, so "What's" must be looked
  up as "What".
- With a 0.5 s end card the spoken CTA plus tail stays close to the 2 s rule;
  "Send this to a music lover" (1.9 s) replaced a longer line.
- Two-line step headlines plus a pill end at about y 532; the spectrogram
  starts at y 552, so keep step headlines to two lines.

## Re-voice

- **Re-voiced at natural pace (2026-11-24):** `LENGTH_SCALE` 1.05 instead of 1.38 (owner's choice after a listening test). Length 45.7 s → 38.5 s; 163 → 194 wpm incl. pauses (209 speech-only). Clean on the first take. Scene change: the library lookup (step 3b) used fixed timings that left the "Song 3" match on screen for only ~0.8 s, so codes now fly in faster and hits count up by step start + 1.9 s, which keeps the match visible ~1.6 s. No wording changes.
