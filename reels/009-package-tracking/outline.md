# Reel 009 · Package tracking — outline and production notes

**Status:** produced (2026-11-23), awaiting approval · **Backlog:** topical lane
2026-11-23 (Black Friday / Cyber Monday, "later") · **Length:** 47.8 s
(narration 47.7 s, 155 wpm) · **Planned slot:** Mon 2026-11-30, 18:00 German
time (Cyber Monday) · **Ending:** open-question CTA, about 2.0 s ("Ever had one
stuck in transit?"), repeated in the caption.

Final narration is in `script.json`; visuals in `scene.js`; caption in
`caption.txt`; YouTube text in `youtube.txt` (`COMMIT_SHA` is filled in at
upload).

## Angle

People picture a live dot moving on a map. In reality there is no tracker in
the box: a barcode is scanned at every stop, each scan saves a time + place
note, and the app only lists those notes. That explains the everyday
frustration of "in transit" looking stuck, and the one place GPS really sits
(the driver's handheld scanner) is the surprising last beat.

## Beat sheet (as produced)

| Beat | Voiceover | Visual |
|---|---|---|
| Hook | "How does your phone know where your package is?" | Title = the question. A parcel moves along a 5-stop route (Pickup → Sorting A → Sorting B → Local depot → Home); a "?" appears over it; the tracking app card below shows "Picked up". |
| Twist | "Usually, there's no tracker in the box. Just a barcode that gets scanned, again and again." | Big parcel; a satellite icon is crossed out; the label lights up; a scan gun fires three times, "scan 1/2/3 ✓" chips stack up. |
| Step 1 | "…every parcel gets its own barcode. International mail even ends in two letters for the country that sent it." | A shipping label: barcode draws in, then the 13-character number "CP 52049163 9 GB" appears part by part (service · serial number · check digit · country); "GB" is highlighted, "↑ the country that sent it". |
| Step 2 | "…at each sorting center, a scanner reads it and stores a tiny note: what happened, when, and where. Your app just lists those notes." | The parcel reaches Sorting A, a red laser sweeps the label, the node gets a green check, a note flies into the app as "Arrived at sorting center · Mon 21:40 · Sorting A"; event, time and place light up in turn with a header tag (what happened / when / where); a second scan adds "Departed". |
| Step 3 | "…between two scans, there's nothing new to show. That's why in transit can look stuck." | The parcel drifts between stops under a "?"; a clock spins in the app header ("no new scan"); the "In transit" chip wobbles on "stuck". |
| Step 3b | "And the live location on the map? It comes from the driver's handheld scanner, at the very last step." | Quick scans at Sorting B and the depot add rows ("Arrived", "Out for delivery"); a handheld scanner with a location pin and radio rings appears and scans the parcel at Home; "Delivered", chip turns green. |
| Payoff | "So your package isn't tracked live. It leaves a trail of scans." | "LIVE" is crossed out; the route lights up stop by stop as a trail of green scan dots. |
| CTA | "Ever had one stuck in transit?" | Headline = the question; the parcel is back between stops with "?" and the "In transit" chip. |

Times and places in the app list ("Mon 21:40", "Sorting A", …) are
illustrative, not real tracking data. The tracking number is a made-up example
in S10 format with a correctly computed check digit (weights 8 6 4 2 3 5 9 7,
mod 11 → 9).

## Facts and evidence

| Claim | Source | Status |
|---|---|---|
| Every parcel gets its own tracking barcode | USPS Publication 199 v29 (2024): "The IMpb or unique tracking barcode is required for all parcels shipped through the Postal Service." | **primary** (USPS; US example) |
| International (postal) item numbers: 13 characters, ending in a 2-letter country code of the issuing country | UPU S10 standard: "S10 identifiers have four components … fixed length of 13 characters": service indicator (2 letters), serial number (8 digits), check digit, country code (2 letters); used for parcels and tracked/registered items | **primary** (UPU) |
| Each scan saves what happened, when and where; the tracking info comes from scans | Pub 199: the scan event extract file "contains tracking information about the movement of packages"; each event has an event code, Event Date, Event Time and Event ZIP; texts such as "Your item arrived at our USPS facility in CITY, STATE ZIPCODE on DATE at TIME" | **primary** |
| Scans repeat at facilities; nothing new shows until the next scan | USPS FAQ "Where is my package?": In Transit / Arrived / Departed USPS Facility scans "may appear multiple times from the same facility and/or on different days"; "Additional tracking information will display when the package arrives at unit and is out for delivery" | **primary** |
| Out for delivery = prepared at the local post office, delivered by a carrier today | USPS FAQ; Pub 199 event 59 "Out for Delivery" | **primary** |
| The location fix comes from the driver's handheld scanner at delivery | USPS OIG audit DR-AR-18-001 (2018): "Carriers use a handheld Mobile Delivery Device (MDD) to scan and transmit package tracking data. MDDs use a cellular network and Global Positioning System (GPS) technology to obtain real-time delivery tracking and location information." | **primary** (USPS Inspector General) |
| "Usually, there's no tracker in the box" | Hedged with "usually" because some premium shipments carry sensor trackers; the sources describe tracking by barcode scans; no source describes a tracker inside standard parcels. Not stated as "never". | simplification |

**Not claimed:** that trucks or facilities have no GPS of their own (fleet
telematics may exist), any carrier-specific delivery times, any shopping or
money advice. USPS is the documented example; the voice names no carrier.

## Lessons

- Piper says "GPS" as "JPS"; "G P S" is clear in audio but would show as three
  caption chunks, so the line uses "satellite location" (accurate: GPS is
  satellite positioning).
- Whisper writes "in transit" as "Intransit"; the audio is correct.
- Elements drawn before the app card are hidden by the card background: draw
  header decorations (clock, chips) after the card.
- Floating labels above the card collide with route stop names; header chips
  inside the card are cleaner.
- `check.py`'s repo-size check fails (46.3 MB) while 002–009 are all on main;
  it clears once published videos leave main.
- Piper is not deterministic: "saves" was sometimes heard as "says" and "the satellite location" as "this at a light location". Replaced with "stores" and "the live location on the map", which were heard correctly in 3 of 3 test runs.
- "There's no tracker in the box" became "Usually, there's no tracker in the box": some premium shipments do carry sensor trackers.

## Re-voiced 2026-11-24

Re-voiced at Piper's natural pace (`LENGTH_SCALE` 1.05, owner's choice after the listening test). Old: 48.8 s, 158 wpm incl. pauses (167 speech only). New: 40.8 s, 189 wpm incl. pauses (202 speech only). Script text unchanged; scene timings follow the word timeline, no scene edits needed. check.py all PASS.
