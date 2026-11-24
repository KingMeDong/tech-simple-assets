# Reel 010 · Login codes (TOTP) — outline and production notes

**Status:** produced (2026-11-23), awaiting approval · **Backlog:** #14 ·
**Length:** 47.1 s (narration 47.0 s, 160 wpm, `length_scale` 1.22) ·
**Slot fit:** share topic → Tue–Thu · **Planned slot:** Tue 2026-12-01, 18:00
German time · **Ending:** spoken + on-screen send CTA "Send this to a slow
typer." (1.7 s incl. end card).

Final narration is in `script.json`; visuals in `scene.js`; caption in
`caption.txt`; YouTube text in `youtube.txt` (video link still has the
`COMMIT_SHA` placeholder).

## Angle

The surprise is that nothing is exchanged: phone and server compute the same
6 digits independently from a shared secret and the clock. The scope is
stated out loud in the first 12 s: authenticator-app codes, not SMS codes.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "Why do login codes change every thirty seconds?" | Title = the question. A code card ("example account", 482 913) with a running ring; at 2 s the ring empties and the digits roll to 071 554. |
| Twist | "Your authenticator app never talks to the server. They share a secret, and a clock." | Phone (left) and server (right), a dashed gap with a red "no connection" mark; a key and a ticking clock appear above both. |
| Scope | "I mean the codes in authenticator apps, not text messages." | Card "authenticator app" (✓) next to a muted "text message — not in this video" card. |
| Step 1 | "…when you set it up, both sides store the same secret key, often hidden in the QR code you scan." | A (non-scannable) QR appears; two keys fly out to phone and server, labelled "same secret key"; the QR pulses with a made-up `otpauth://…?secret=K7Q2…` line. |
| Step 2 | "…both count time in thirty-second steps, since January nineteen seventy." | Timeline "Jan 1, 1970 → now" with scrolling 30 s ticks; phone and server boxes both show step 59,871,480, rolling to …481 on "steps". |
| Step 3 | "…each side puts the secret and the current step through the same math, then cuts it down to six digits." | On both sides: key + step drop into a "same math" box, a long hex string comes out, gets cut, and 482 913 appears. |
| Step 3b | "Same secret, same step, same code. No message needed." | Phone and server show 482 913, "=" and ✓, the red no-connection mark and "0 messages". |
| Payoff | "Thirty seconds is the standard's recommended balance: long enough to type, short enough that a stolen code soon goes stale." | A 30 s ring drains; row "long enough to type it ✓"; row "a stolen copy…" whose code chip is struck through and greys out ("stolen copy: stale"). |
| CTA | "Send this to a slow typer." | Headline + paper plane. |

## Facts and evidence

| Claim | Evidence | Status |
|---|---|---|
| Codes change every 30 s | RFC 6238 §4.1: "X represents the time step in seconds (default value X = 30 seconds)"; §5.2 "We RECOMMEND a default time-step size of 30 seconds" | **primary** |
| Phone and server share a secret; no exchange is needed to make the code | RFC 6238 §3 R2 (prover and verifier "MUST … share the same secret"); §4.2 TOTP = HOTP(K, T), computed by each side from K and the time | **primary** (the "never talk" wording is our framing of this; the code you type is of course sent when you log in) |
| Both count time in 30 s steps since January 1970 | RFC 6238 §3 R1 (Unix time since midnight UTC, Jan 1, 1970), §4.1 T0 default 0, §4.2 T = floor((now − T0)/X) | **primary** (defaults; a service may choose other values) |
| Same math, cut down to six digits | RFC 4226 §5.3: HMAC-SHA-1(K, C), dynamic truncation, D = Snum mod 10^Digit; "MUST extract a 6-digit code at a minimum" | **primary** |
| Secret often hidden in the QR code you scan | Google Authenticator Key URI format: "Secret keys may be encoded in QR codes as a URI" (`otpauth://totp/…?secret=…`) | **primary** (Google's own spec) |
| 30 s is a balance; a stolen code soon goes stale | RFC 6238 §5.2: 30 s "is selected as a balance between security and usability"; a larger step "exposes a larger window to attack … the third party can consume the OTP within the time-step window" | **primary** |
| Scope: not SMS codes | Not covered by RFC 6238; stated as scope only, no claim about SMS | n/a |

On-screen numbers: the codes (482 913, 071 554), the hex string and the
`secret=K7Q2…` line are made up. The step number 59,871,480 is the real
floor(Unix time / 30) for 2026-12-01 17:00 UTC (the planned slot).

Not said on purpose: the RFC's clock-drift/transmission-delay window (validators
usually accept one extra step), HMAC/SHA names, any comparison of SMS vs. app
security, any app or brand.

## Lessons

- Piper is stochastic: borderline words flip between runs ("mixes"→"makes",
  "combines"→"combined", "picked"→"pick", "chose"→"shows", "at setup"→"add
  setup", "save"→"say", "in an authenticator"→"in authenticator"). Rephrase to
  robust words instead of re-rolling; lock the run where every word is heard.
- Number-heavy scripts run slow at 1.38: `length_scale` 1.22 gave 160 wpm.
- A slide-in of 160 px pushed devices outside the safe zone for a few frames;
  60 px is enough motion.
- Rolling digits need a clipPath, or the old digits run into the label above.

## Reproduce

```bash
python3 tools/reel/tts.py reels/010-login-codes      # length_scale 1.22 from script.json
python3 tools/reel/render.py reels/010-login-codes   # no T.word warnings
python3 tools/reel/check.py reels/010-login-codes
```
- Review fixes: "Your phone and the server never talk" became "Your authenticator app never talks to the server" (the phone itself is online; it's the code generation that needs no exchange), and "a balance set by the standard" became "the standard's recommended balance" (RFC 6238 recommends 30 s, it doesn't require it).

## Re-voiced 2026-11-24

Re-voiced at Piper's natural pace (`LENGTH_SCALE` 1.05, owner's choice after the listening test). Old: 47.7 s, 156 wpm incl. pauses (166 speech only). New: 42.5 s, 176 wpm incl. pauses (188 speech only). Script text unchanged; scene timings follow the word timeline, no scene edits needed. check.py all PASS.
