# Reel 011 · Flight tracking (ADS-B) — outline and production notes

**Status:** produced (2026-11-26), awaiting Claude's review · **Backlog:** topical lane
2026-11-26 (Thanksgiving travel) · **Length:** 36.9 s (narration 36.3 s, 181 wpm,
natural pace `LENGTH_SCALE` 1.05, no override) · **Slot fit:** topical-seasonal
(US return-travel day) · **Planned slot:** Sun 2026-11-29, 18:00 German time ·
**Ending:** spoken + on-screen save CTA "Save this for your next flight."
(1.4 s spoken + 0.6 s end card). **Caption CTA:** save.

Final narration is in `script.json`; visuals in `scene.js`; caption in
`caption.txt`; YouTube text in `youtube.txt` (video link still has the
`COMMIT_SHA` placeholder).

## Angle

Nobody has to find the plane: it works out its own GPS position and
broadcasts it once a second. Receivers on the ground (some at hobbyists'
homes) and on satellites catch the broadcast, apps gather it, and the plane
appears on your map. Payoff: in the US, air traffic control prefers the same
broadcast. The broadcast rings on screen start once per second throughout,
like the real ADS-B Out rate.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook (0–2.3 s) | "How does your phone know where a plane is right now?" | Title = the question from frame 0. A plane already moving across a map (land left, sea right) on a dashed route, pinging a ring every second; a small phone shows the same dot moving. |
| Twist | "The plane gives itself away. It broadcasts its own position, once a second." | Plane zooms in, rings get strong on "broadcasts", an "I'm here!" tag pops; a 1-second ticker and "once a second" on "once". |
| Step 1 | "…the plane works out where it is from GPS satellites." | Three GPS satellites; "where am I?" under the plane, then dashed signal lines reach it on "GPS" and a readout "41.2° N · 71.9° W" replaces the question. |
| Step 2 | "…a radio onboard sends that out, with its altitude, speed and ID." | Rings switch on at "radio"; a message card with labels position / altitude / speed / ID; each value pops in on its word (41.2° N, 71.9° W · 35,000 ft · 550 mph · ABC123), tagged "example values". |
| Step 3a | "…receivers on the ground pick it up. Some are run by hobbyists at home." | Plane above a strip of ground; two receiver masts appear and flash green whenever a ring reaches them; a house with a roof antenna appears on "hobbyists", label "at home". |
| Step 3b | "Over the ocean, receivers on satellites can catch it too." | Plane over waves ("ocean"); a satellite appears on "satellites" ("receiver in orbit") and flashes green as rings reach it. |
| Step 4 | "Flight tracking apps gather these signals and show each plane on your map." | Mast, house and satellite send dashed lines into a "tracking app" cloud on "gather"; a line goes to a phone whose map fills with plane icons on "show". |
| Payoff | "And in the US, it's now air traffic control's preferred way to track planes." | "US" tag; a control tower appears on "air traffic", flashing as rings reach it; a "preferred ✓" pill on "preferred". |
| CTA | "Save this for your next flight." | Bookmark icon, plane flying across, headline "Save this for your next flight". |

Cover: pill "HOW IT ACTUALLY WORKS #11", headline "How does your phone know
where a plane is?", plane with broadcast rings over the map, phone with the dot.

## Facts and evidence

| Claim | Evidence | Status |
|---|---|---|
| The plane broadcasts its own position, once a second; it gets the position from GPS | FAA Flight Standards ADS-B page: "ADS-B Out works by broadcasting information about an aircraft's GPS location, altitude, ground speed and other data to ground stations and other aircraft, once per second." (https://www.faa.gov/about/office_org/headquarters_offices/avs/offices/afx/afs/afs400/afs410/ads-b) | **primary** |
| The broadcast includes altitude, speed and ID | 14 CFR 91.227(d): latitude and longitude, barometric altitude, velocity, aircraft identification (flight-plan / ATC call sign), ICAO 24-bit address (eCFR) | **primary** |
| Receivers on the ground pick it up | FAA (above): broadcast "to ground stations and other aircraft"; FAA FAQ: ground stations "so much easier to place than radar" (https://www.faa.gov/air_traffic/technology/adsb/faq) | **primary** |
| Some receivers are run by hobbyists at home | FlightAware ADS-B: users can "build a Raspberry Pi with a USB ADS-B receiver" and "feed additional ADS-B data from their receivers" (https://www.flightaware.com/adsb/); FlightFeeder: receivers "free of charge to qualified individuals who agree to host them", "To volunteer to host" (https://www.flightaware.com/adsb/flightfeeder/) | **primary (company's own docs)**; wording "some", no number |
| Over the ocean, receivers on satellites can catch it | Aireon: "Powered by Iridium's networked constellation of 66 satellites, Aireon ADS-B provides continuous air traffic surveillance to areas … including over oceans" (https://aireon.com/) | **primary (operator)**; wording "can" |
| Flight-tracking apps gather these signals and show the planes | FlightAware: "operates a worldwide network of ADS-B and Mode S receivers"; ADS-B data "made available on FlightAware's free web site and mobile apps"; also "over 45 different government air traffic control and private datalink sources" | **primary**; worded so it doesn't claim ADS-B is the only source |
| In the US, ADS-B is now ATC's preferred way to track planes | FAA ADS-B overview: "Real-time ADS-B is now the preferred method of surveillance for air traffic control in the NAS" (https://www.faa.gov/air_traffic/technology/adsb) | **primary** |
| Background only (not said): required in most busy/high US airspace since 1 Jan 2020 | 14 CFR 91.225(a), (b), (d) | primary; cut for length |

**Softened or avoided:** "Planes with ADS-B Out" in the caption (not every
aircraft broadcasts; the rule covers specific US airspace); "Some are run by
hobbyists" (no share or count); "satellites *can* catch it"; no claim that
apps use only ADS-B, no latency claim ("live", "seconds old"), no app,
airline or satellite company named or shown on screen. All on-screen numbers
are example values and labelled as such in step 2.

## Lessons

- "put a dot on your map" was heard as "doubt" and twice as "data" (3 takes);
  "show each plane on your map" was clean on the final take (one of three
  test takes misheard "apps gather these", so the take was checked word by
  word). "on board" was written "onboard" so Whisper's spelling matches.
- An empty message card looked broken for a second; card labels now appear
  with the card and only the values pop in on their words.

## Reproduce

```bash
python3 tools/reel/tts.py reels/011-flight-tracking      # re-voicing changes timings: re-check stills
python3 tools/reel/render.py reels/011-flight-tracking
python3 tools/reel/check.py reels/011-flight-tracking
```
