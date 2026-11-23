# Posting schedule

One Reel a day at **18:00 German time** (`CLAUDE.md` sections 1 and 6a).
Claude keeps this file current.

**Approval rule:** A Reel is published only if its row says `approved` with
the date of the owner's explicit "OK" in chat, for the exact files at the
commit listed. Any change to the video, cover or caption after approval resets
the row to `awaiting approval`.

**Status values:** `planned` → `in production` → `awaiting approval` →
`approved` → `published` (media ID in `analytics/publishing-log.md`).

| Slot (German time) | Reel | Type | Status | Approved (date, commit) |
|---|---|---|---|---|
| Sun 2026-11-22 19:09 | 001-airdrop | evergreen | published | 2026-11-22 (pilot) |
| Mon 2026-11-23 18:00 | 002-qr-code | evergreen | approved | 2026-11-22, 833a45a (a fixed version is on main, awaiting re-approval; until then the 833a45a version is published) |
| Tue 2026-11-24 18:00 | 003-tap-to-pay | evergreen (share) | approved | 2026-11-22, 833a45a |
| Wed 2026-11-25 18:00 | 004-wifi-kitchen | evergreen (share) | approved | 2026-11-22, 833a45a |
| Thu 2026-11-26 18:00 | 006-song-recognition | evergreen (share) | awaiting approval | — |
| Fri 2026-11-27 18:00 | 005-face-id | evergreen (search, T3: Fri–Sun) | approved | 2026-11-22, 833a45a |
| Sat 2026-11-28 18:00 | 007-cold-battery | evergreen (search, seasonal) | awaiting approval | — |
| Sun 2026-11-29 18:00 | 008-noise-cancelling | evergreen (search) | awaiting approval | — |

**Production batches:** Mon and Thu (scheduled task 09:13). Extra batch
003–005 produced on 2026-11-22 for the switch to daily posting. Next batch:
006–008 started on 2026-11-22 (owner asked to fill Thu/Sat/Sun now).
Next regular batch: Mon 2026-11-23 (slots from Mon 2026-11-30).
