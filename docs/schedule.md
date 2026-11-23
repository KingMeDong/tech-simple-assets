# Posting schedule

One Reel a day at **18:00 German time** (`CLAUDE.md` sections 1 and 6a).
Claude keeps this file current.

**YouTube (Workflow v1.1):** after the Instagram publish, the same video goes to
YouTube Shorts with the title and description from `youtube.txt`. The owner's
OK covers both platforms; Reels approved before v1.1 need a separate OK for
their YouTube text.

**Approval rule:** A Reel is published only if its row says `approved` with
the date of the owner's explicit "OK" in chat, for the exact files at the
commit listed. Any change to the video, cover or caption after approval resets
the row to `awaiting approval`.

**Status values:** `planned` → `in production` → `awaiting approval` →
`approved` → `published` (media ID in `analytics/publishing-log.md`).

| Slot (German time) | Reel | Type | Status | Approved (date, commit) | YouTube text (`youtube.txt`) |
|---|---|---|---|---|---|
| Sun 2026-11-22 19:09 | 001-airdrop | evergreen | published | 2026-11-22 (pilot) | published 2026-11-23 22:30 by hand ([Short](https://www.youtube.com/shorts/XS9UBGAi0AE)) |
| Mon 2026-11-23 18:00 | 002-qr-code | evergreen | published 18:29 ([Reel](https://www.instagram.com/reel/DgF6up5AqZy/)) | 2026-11-22, 833a45a (published version; the later fix was not approved in time) | published 2026-11-23 22:39 by hand ([Short](https://www.youtube.com/shorts/TqQAoaGj_9o)) |
| Tue 2026-11-24 18:00 | 003-tap-to-pay | evergreen (share) | approved | 2026-11-22, 833a45a | approved 2026-11-23 (text at 6b6eef9) |
| Wed 2026-11-25 18:00 | 004-wifi-kitchen | evergreen (share) | approved | 2026-11-22, 833a45a | approved 2026-11-23 (text at 6b6eef9) |
| Thu 2026-11-26 18:00 | 006-song-recognition | evergreen (share) | approved | 2026-11-23, 5702677 | approved 2026-11-23 (text at 6b6eef9) |
| Fri 2026-11-27 18:00 | 005-face-id | evergreen (search, T3: Fri–Sun) | approved | 2026-11-22, 833a45a | approved 2026-11-23 (text at 6b6eef9) |
| Sat 2026-11-28 18:00 | 007-cold-battery | evergreen (search, seasonal) | approved | 2026-11-23, 5702677 | approved 2026-11-23 (text at 6b6eef9) |
| Sun 2026-11-29 18:00 | 008-noise-cancelling | evergreen (search) | approved | 2026-11-23, 5702677 | approved 2026-11-23 (text at 6b6eef9) |
| Mon 2026-11-30 18:00 | 009-package-tracking | topical-seasonal (Cyber Monday) | approved | 2026-11-23, 0f7e5eb | approved 2026-11-23 (text at a29fa30) |
| Tue 2026-12-01 18:00 | 010-login-codes | evergreen (share) | approved | 2026-11-23, 0f7e5eb | approved 2026-11-23 (text at a29fa30) |

**Production batches:** Mon and Thu (scheduled task 09:13). Extra batch
003–005 produced on 2026-11-22 for the switch to daily posting. Next batch:
006–008 started on 2026-11-22 (owner asked to fill Thu/Sat/Sun now).
Batch Mon 2026-11-23: 009–010 (only 2: main had room for two more videos;
pushed after 002's video leaves main at 18:00). Next batch: Thu 2026-11-26.
