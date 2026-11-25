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

Published: 001 AirDrop, 002 QR code, 003 Tap-to-pay. Ready and scheduled
(see `docs/schedule.md`): 004 Wi-Fi in the kitchen · 006 Song
recognition · 005 Face ID · 007 Cold battery · 008 Noise cancelling · 009
Package tracking · 010 Login codes (all re-voiced at the natural pace on
2026-11-24).

Next (batch Thu 2026-11-26, natural voice, livelier first second): **#16
Bluetooth trackers** · **#09 Indoor location** · **#15 Dark mode**.

## Topical lane

Current events that fit the channel (rules: `CLAUDE.md` section 6a). Claude
adds candidates from the morning radar; a "go" is produced the same day and
takes the next 18:00 slot.

| Date spotted | Event | Hook question | Primary sources | Decision |
|---|---|---|---|---|
| 2026-11-23 | Black Friday (Fri 2026-11-27) and Cyber Monday, record online shopping expected | How does your phone know where your package is? | Carrier docs to check (e.g. USPS Intelligent Mail package barcode, scan events) | **in production** as Reel 009 for Mon 2026-11-30 |
| 2026-11-23 | Microsoft 365 outage (Outlook, Teams), 12–13 Nov | Why does one company's outage break so many apps? | Microsoft status history | **no**: older than 48 h, and the cause is only partly confirmed (no speculation) |
| 2026-11-23 | GTA 6 launch hype trending on TikTok/Instagram (18 Nov) | How does a game load a whole city with no loading screens? | No primary technical source from the studio | **no**: gaming rather than everyday tech, and no primary source |
| 2026-11-24 | US Thanksgiving travel week (Thu 2026-11-26) | How does your phone know the new time zone when you land? | Apple/Android docs on automatic time zone (network time / location) to check | **later**: seasonal, not news; candidate for a batch run |
| 2026-11-24 | No big consumer-tech launch or outage in the last 48 h (latest: Apple iCloud/App Store/Apple Pay, 17 Nov) | — | Apple System Status | **no**: older than 48 h, and the cause is only "an internal update" |
| 2026-11-25 | TikTok outage in the US, about 90 min on 24 Nov (Downdetector reports) | Why does an app suddenly stop working for everyone? | No official cause or status page entry | **no**: cause unconfirmed (no speculation), short and already over |
| 2026-11-25 | Spotify login problems worldwide, morning of 24 Nov | — | Spotify only said it was "aware of issues"; status page showed no incident | **no**: no confirmed cause, nothing to explain without guessing |
| 2026-11-25 | WhatsApp "view-once" text messages reach iPhone beta testers | How can a message stop you taking a screenshot? | Beta reports only, no official WhatsApp announcement | **no**: beta/leak stage, not in most people's hands; revisit if WhatsApp announces it |

## Ideas

| # | Status | Hook question (title + first words) | Twist | Visual idea | Claims to verify | Slot fit |
|---|---|---|---|---|---|---|
| 02 | published (Reel 002) | How does a QR code still work when it's torn? | A whole corner (~15%) is gone and it still scans; the strongest setting rebuilds up to ~30% of its data. | A code is destroyed piece by piece and still scans. | Reed-Solomon error correction; levels L/M/Q/H ≈ 7/15/25/30% (ISO/IEC 18004). | share |
| 03 | published (Reel 003) | How does tap-to-pay work? | The card has no battery. | The terminal's radio field powers the card; the chip lights up. | NFC at 13.56 MHz, range of a few cm; card powered by the reader's field (ISO/IEC 14443). Phone payments use a token, not the card number. | share |
| 04 | produced (Reel 004) | Why is your Wi-Fi slower in the kitchen? | Your microwave uses almost the same frequency. | Two waves overlap and scramble each other. | Microwave ovens ≈ 2.45 GHz; Wi-Fi 2.4 GHz band 2.400–2.4835 GHz; 5 GHz band unaffected. | share |
| 05 | produced (Reel 005) | How does Face ID work in the dark? | It projects over 30,000 invisible dots onto your face. | A dot grid lands on a face and turns into a 3D mesh. | Apple's figure "more than 30,000 invisible dots"; infrared flood illuminator + dot projector (Apple support docs). | search |
| 06 | produced (Reel 008) | How do noise-cancelling headphones work? | They add sound to make silence. | A wave and its mirror image cancel into a flat line. | Destructive interference; works best on low, steady frequencies. | search |
| 07 | idea | How does Bluetooth not get confused? | It changes channel 1,600 times a second. | A signal hops between 79 channels. | Bluetooth Classic: 79 × 1 MHz channels, 1,600 hops/s. Bluetooth LE differs (40 channels), so say which one. | share |
| 08 | produced (Reel 007) | Why does your phone die faster in the cold? | The battery isn't empty; the charge is stuck. | Lithium ions slow down as if moving through syrup. | Li-ion internal resistance rises and ion mobility drops in the cold; capacity returns once warm. | search |
| 09 | idea | How does your phone know where you are… indoors? | GPS satellites don't know you exist; your phone only listens. | Satellites broadcast, the phone times the signals, Wi-Fi helps inside. | GPS is receive-only; a fix needs ≥4 satellites (position + time); indoor fixes use Wi-Fi/cell positioning. | share |
| 10 | produced (Reel 006) | How does an app recognise a song in 3 seconds? | It ignores almost all of the music. | A spectrogram shrinks to its peaks: the "fingerprint". | Audio fingerprinting with spectrogram peak pairs (Wang 2003 paper). Name no app on screen. | share |
| 11 | idea | How does a touchscreen know it's your finger? | That's why it fails with gloves on. | A sensor grid; the finger bends the electric field. | Projected capacitive sensing; gloves insulate; conductive gloves work. | search |
| 12 | idea | How does wireless charging work without touching? | There's still a "wire": a magnetic field. | Two coils, field lines jump between them. | Inductive coupling between coils (Qi standard, Wireless Power Consortium). | search |
| 13 | idea | What happens when you hit "send" on a message? | Not even the server can read it. | A message is scrambled, travels as gibberish, unlocks only at the end. | Only true for end-to-end encrypted apps; say so. Public-key basics. | share |
| 14 | in production (Reel 010) | Why do login codes change every 30 seconds? | Your phone and the server never talk: they share a secret and the clock. | A secret key + a ticking clock go into a blender; the same 6 digits pop out on phone and server at once. | TOTP, RFC 6238 (30 s time step) and RFC 4226 (HOTP). | share |
| 15 | idea ★ | Does dark mode really save battery? | On some screens it saves nothing at all. | Two phones side by side: OLED pixels switching off vs. an LCD backlight that stays on behind black pixels. | OLED pixels emit their own light; LCD uses a backlight. Google's Android Dev Summit 2018 measurements on dark mode power. | search |
| 16 | idea ★ | How does a Bluetooth tracker find your lost keys… with no GPS? | Strangers' phones help, without knowing it. | Keys in a café, a passer-by's phone silently relays an encrypted location, a map pin appears on your phone. | Apple Find My network docs / Platform Security guide (end-to-end encrypted, anonymous relays); Google Find My Device network docs. | share |
| 17 | idea | How does your phone know which way is up? | There's a tiny weight on springs inside it. | Zoom into a MEMS accelerometer: a comb-shaped mass sways and capacitor plates measure it; the screen rotates. | MEMS accelerometer principle from a chip maker's datasheet/app note (e.g. Bosch, STMicroelectronics, Analog Devices). | share |
| 18 | idea | How does portrait mode blur the background? | The blur isn't from the lens. It's computed. | A photo splits into a depth map (near = white, far = black); the far layers blur step by step. | Google AI blog on Pixel portrait mode (dual-pixel depth); Apple docs on depth capture. | share |
| 19 | idea | How does your phone know it's at your ear? | It shines invisible light at your face. | An infrared beam bounces off a cheek; the screen goes dark; pull away, it wakes. | Proximity sensor principle (IR emitter + detector) from Android sensor docs and a sensor maker's datasheet. | share |
| 20 | idea | How does fast charging know how much power to send? | The charger and phone talk before the power flows. | A handshake animation over the USB-C cable: "5 V?" "I can take 9 V", then the power bar jumps. | USB Power Delivery spec / USB-IF (negotiated voltage and current). | search |
| 21 | idea | Does a microwave cook food from the inside out? | No: it heats the outer few centimetres, then heat travels inward. | Cross-section of a potato: an orange layer near the surface, warmth slowly spreading to the cold centre. | FDA "Microwave oven radiation" page (penetration depth / heating). No health claims. | search |
| 22 | idea | How does an eSIM work without a SIM card? | Your SIM card was always just a tiny computer. | A SIM card shrinks into a chip on the circuit board; a QR code downloads a profile into it. | GSMA eSIM specifications (SGP.22, remote SIM provisioning). | search |
| 23 | idea | How does the "I'm not a robot" box know you're human? | The click isn't the test. What you did before it is. | A cursor path: a human's wobbly line vs. a bot's straight jump; the check mark appears. | Google reCAPTCHA developer docs (risk analysis, signals). Keep claims to what Google states. | share |

★ = in the queue priority above.

## Done

| # | Reel | Status | Notes |
|---|---|---|---|
| 01 | `reels/001-airdrop` | published 2026-11-22 | Pilot. See `analytics/publishing-log.md`. |
| 02 | `reels/002-qr-code` | published 2026-11-23 | Old slow-voice version (kept as a comparison point). |
| 03 | `reels/003-tap-to-pay` | published 2026-11-24 | Instagram 18:55 (worker restart); YouTube upload by hand (Zapier 429). |
