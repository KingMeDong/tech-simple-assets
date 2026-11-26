# Reel 012 · Bluetooth trackers — outline and production notes

**Status:** produced (2026-11-26) · **Backlog:** #16 · **Length:** 40.6 s
(narration 40.5 s, 194 wpm incl. pauses, `LENGTH_SCALE` 1.05, no override) ·
**Slot fit:** share topic → Tue–Thu · **Planned slot:** Thu 2026-12-03, 18:00
German time · **Ending:** spoken + on-screen send CTA "Send this to someone who
always loses their keys." (2.7 s). **Caption CTA:** send.

Final narration is in `script.json`; visuals in `scene.js`; caption in
`caption.txt`; YouTube text in `youtube.txt` (video link still has the
`COMMIT_SHA` placeholder).

## Angle

The tracker itself knows nothing about where it is. It only sends a short
Bluetooth signal; strangers' phones walking past do the locating, lock the
location so only the owner can read it, and send it up. Everything is drawn on
a top-down café floor plan (Google's own example is keys dropped at a café), so
the Reel looks nothing like Reel 001's side-by-side phones. No brands, logos or
product names on screen or in the voice.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "How does a Bluetooth tracker find your lost keys, with no GPS?" | Title = the question (with "…"), visible from frame 0. Keys with a round generic tag on a café table, signal rings pulsing from the tag from frame 0, slight zoom-in; on "GPS" a "no GPS" chip with a crossed-out satellite. |
| Twist | "Strangers' phones do the finding, quietly, in the background." | Zoom out to a top-down café floor plan; three passers-by walk through, their phones light up blue when they cross the signal rings; sub-line "quietly, in the background". |
| Step 1 | "…your tracker keeps sending out a short Bluetooth signal. It has no GPS of its own." | Close-up of the tag with a Bluetooth mark and expanding rings; "no GPS" chip on "GPS". |
| Step 2 | "…a stranger walks past, and their phone hears it. That phone knows where it is." | Floor plan: one walker stops in range on "hears"; ✓ "heard it"; on "knows" a location pin over their phone, "its own location". |
| Step 3 | "…it locks that location in a box only you can open, and sends it up to the network." | The pin flies from the stranger's phone into a box, the padlock closes on "locks", "only you can open it", the box flies up into a "network" cloud on "sends". |
| Step 3b | "Not even the company behind the network can open it. And you never learn whose phone helped." | Locked box in the cloud; "the company" building tries (dashed red line) and gets ✗; an anonymous "?" figure, "who helped? never shown". |
| Payoff | "Your phone unlocks the box and drops a pin where your keys were seen. Each network counts over a billion devices, so a busy cafe is full of helpers." | Three locked boxes (reports from several passers-by) land on the owner's phone and open on "unlocks"; a pin drops on the café table in the phone's map: "keys seen here · 2 min ago (example)". Then "1,000,000,000+ devices per network" over the floor plan full of walkers whose phones glow near the keys; "a busy café is full of helpers". |
| CTA | "Send this to someone who always loses their keys." | Headline + keys with tag and rings. |

## Facts and evidence

| Claim | Evidence | Status |
|---|---|---|
| The tracker sends out a (short-range) Bluetooth signal | Apple AirTag page: "Your AirTag sends out a secure Bluetooth signal that can be detected by nearby devices in the Find My network" (https://www.apple.com/airtag/); Apple Platform Security, Find My security: "sending out short range Bluetooth signals" (https://support.apple.com/guide/security/find-my-security-sec6cbc80fd0/web); Google: "harnessing the Bluetooth proximity of surrounding Android devices", "a Bluetooth tag" (https://security.googleblog.com/2024/04/find-my-device-network-security-privacy-protections.html) | **primary** |
| It has no GPS of its own | AirTag tech specs on https://www.apple.com/airtag/ list Bluetooth, Ultra Wideband, NFC, speaker, accelerometer: no GPS; Google: the location comes from "nearby Android devices … report the location of the Bluetooth tag" | **primary** (said about "your tracker" in the story; GPS trackers exist, so the narration never claims "no tracker has GPS") |
| Strangers' phones do the finding, in the background | Apple Newsroom (AirTag, 2021): the network "can detect Bluetooth signals from a lost AirTag and relay the location back to its owner, all in the background, anonymously and privately" (https://www.apple.com/newsroom/2021/04/apple-introduces-airtag/); Google: "crowdsourced device-locating network" | **primary** |
| A passing phone hears it and knows where it is; it sends its own location | Apple, Locating missing devices: finder devices "read the current broadcast key" and "encrypt their current location information and relay it to Apple" (https://support.apple.com/guide/security/locating-missing-devices-sece994d0126/web); Google: nearby devices "report the location of the Bluetooth tag" | **primary** |
| Locked in a box only you can open | Apple: "Apple never has the decryption key"; "The owner of the missing device can … decrypt the encrypted location"; Google: "end-to-end encrypted using a key that is only accessible to the Bluetooth tag owner and anyone the owner has shared the tag with" | **primary** ("only you" simplifies Google's "and anyone you shared it with") |
| Not even the company behind the network can open it | Apple: "Apple can't read the location encrypted by the finder"; Google: "Google cannot decrypt, see, or otherwise use the location data" | **primary** |
| You never learn whose phone helped | Apple: "with no indication as to who found the device"; Google: "no other information about the nearby Android devices that contributed the data is included" | **primary** |
| Your phone unlocks it and drops a pin where the keys were seen | Apple: the Find My app "locally decrypts the encrypted locations … and shows an approximate location", with "how long ago the device was detected"; AirTag page: "see it on a map"; Google: the owner sees "the aggregated location … and timestamp" | **primary** |
| Several reports are combined (three boxes in the visual) | Apple: "Location reports from multiple finder devices are combined"; Google: "By default, the Find Hub network requires multiple nearby Android devices to detect a tag" | **primary** (visual only) |
| Each network counts over a billion devices | Apple AirTag page: "more than a billion iPhone, iPad, and Mac devices"; Google: "over a billion Android devices that can participate" | **primary** |
| A busy café is full of helpers | Google: the network "is most valuable in public settings like cafes and airports, where there are likely many devices nearby" | **primary** |

On-screen made-up details: "2 min ago (example)", the café layout, the number
of walkers. The rotating Bluetooth IDs (Apple: about every 15 minutes) and the
opt-out settings are true but not mentioned, to keep the Reel short.

Not said on purpose: brand or product names, stalking or safety claims,
Ultra Wideband precision finding, how often the tag sends its signal, Android's
aggregation and "at home" rules beyond "several reports", any comparison
between the two networks.

**Softened during the fact check:** "a stranger's phone walks past" became "a
stranger walks past, and their phone hears it"; "Not even the phone maker" became
"Not even the company behind the network" (Google runs the Android network but
doesn't make most Android phones); "Each network counts over a billion phones"
became "devices" (Apple's figure includes iPads and Macs); "no GPS" is said only
about the tracker in the story, never about all trackers.

## Lessons

- First Piper take at 1.05 was heard completely (no unheard words); a second
  take after two wording fixes was also clean.
- `ffmpeg fps=1/2` labels frames with the output time but picks frames about
  1 s later; `select='not(mod(n,60))'` gives an exact 2 s frame sheet.
- Headlines at 84 px fit about 20 characters per line; longer ones left a
  lone word ("it", "pin") on line two and were shortened.

## Reproduce

```bash
python3 tools/reel/tts.py reels/012-bluetooth-trackers
python3 tools/reel/render.py reels/012-bluetooth-trackers   # no T.word warnings
python3 tools/reel/check.py reels/012-bluetooth-trackers    # 16/16 PASS
```
