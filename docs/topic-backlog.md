# Topic backlog

Reel ideas for @tech.simple.explained. Claude keeps this list current. The
owner adds ideas any time, in chat or directly in this file.

**How an idea moves:** `idea` → `outlined` (hook, stakes, 3 steps, payoff) →
`scripted` (facts verified against primary sources) → `produced` (in
`reels/<NNN>-<slug>/`) → `published` (logged in `analytics/publishing-log.md`).

**Rules for every idea** (from `docs/playbook.md`):
- Something people touch every day, opened with the topic question and an
  immediate curiosity twist (G3, workflow section 1).
- A distinct angle and its own visual idea, never a copy of an earlier Reel (E7).
- No health-effect or money-advice topics (E6). Other apps' logos never appear
  on screen (E1).
- Every number below is a working claim until it has been checked against a
  primary source at the `scripted` stage (hard rule 3).

**Slot fit:** *share* topics go to Tue–Thu slots, *search* (evergreen) topics
to Fri–Sun slots (T3).

---

## Queue priority

The next Reels, in production order:

1. **#02 QR code** (produced, awaiting approval: `reels/002-qr-code/`) · 2. **#03 Tap-to-pay** · 3. **#04 Wi-Fi in the kitchen** · 4. **#05 Face ID** (all produced, awaiting approval)

## Topical lane

Current events that fit the channel (rules: `CLAUDE.md` section 6a). Claude
adds candidates from the morning radar; a "go" is produced the same day and
takes the next 18:00 slot.

| Date spotted | Event | Hook question | Primary sources | Decision |
|---|---|---|---|---|
| — | — | — | — | — |

## Ideas

| # | Status | Hook question (title + first words) | Twist | Visual idea | Claims to verify | Slot fit |
|---|---|---|---|---|---|---|
| 02 | produced ★ | How does a QR code still work when it's torn? | A whole corner (~15%) is gone and it still scans; the strongest setting rebuilds up to ~30% of its data. | A code is destroyed piece by piece and still scans. | Reed-Solomon error correction; levels L/M/Q/H ≈ 7/15/25/30% (ISO/IEC 18004). | share |
| 03 | produced ★ | How does tap-to-pay work? | The card has no battery. | The terminal's radio field powers the card; the chip lights up. | NFC at 13.56 MHz, range of a few cm; card powered by the reader's field (ISO/IEC 14443). Phone payments use a token, not the card number. | share |
| 04 | produced ★ | Why is your Wi-Fi slower in the kitchen? | Your microwave uses almost the same frequency. | Two waves overlap and scramble each other. | Microwave ovens ≈ 2.45 GHz; Wi-Fi 2.4 GHz band 2.400–2.4835 GHz; 5 GHz band unaffected. | share |
| 05 | produced | How does Face ID work in the dark? | It projects over 30,000 invisible dots onto your face. | A dot grid lands on a face and turns into a 3D mesh. | Apple's figure "more than 30,000 invisible dots"; infrared flood illuminator + dot projector (Apple support docs). | search |
| 06 | produced (Reel 008) | How do noise-cancelling headphones work? | They add sound to make silence. | A wave and its mirror image cancel into a flat line. | Destructive interference; works best on low, steady frequencies. | search |
| 07 | idea | How does Bluetooth not get confused? | It changes channel 1,600 times a second. | A signal hops between 79 channels. | Bluetooth Classic: 79 × 1 MHz channels, 1,600 hops/s. Bluetooth LE differs (40 channels), so say which one. | share |
| 08 | produced (Reel 007) | Why does your phone die faster in the cold? | The battery isn't empty; the charge is stuck. | Lithium ions slow down as if moving through syrup. | Li-ion internal resistance rises and ion mobility drops in the cold; capacity returns once warm. | search |
| 09 | idea | How does your phone know where you are… indoors? | GPS satellites don't know you exist; your phone only listens. | Satellites broadcast, the phone times the signals, Wi-Fi helps inside. | GPS is receive-only; a fix needs ≥4 satellites (position + time); indoor fixes use Wi-Fi/cell positioning. | share |
| 10 | produced (Reel 006) | How does an app recognise a song in 3 seconds? | It ignores almost all of the music. | A spectrogram shrinks to its peaks: the "fingerprint". | Audio fingerprinting with spectrogram peak pairs (Wang 2003 paper). Name no app on screen. | share |
| 11 | idea | How does a touchscreen know it's your finger? | That's why it fails with gloves on. | A sensor grid; the finger bends the electric field. | Projected capacitive sensing; gloves insulate; conductive gloves work. | search |
| 12 | idea | How does wireless charging work without touching? | There's still a "wire": a magnetic field. | Two coils, field lines jump between them. | Inductive coupling between coils (Qi standard, Wireless Power Consortium). | search |
| 13 | idea | What happens when you hit "send" on a message? | Not even the server can read it. | A message is scrambled, travels as gibberish, unlocks only at the end. | Only true for end-to-end encrypted apps; say so. Public-key basics. | share |

★ = in the queue priority above.

## Done

| # | Reel | Status | Notes |
|---|---|---|---|
| 01 | `reels/001-airdrop` | published 2026-11-22 | Pilot. See `analytics/publishing-log.md`. |
