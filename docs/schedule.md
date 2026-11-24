# Posting schedule

One Reel a day at **18:00 German time** (`CLAUDE.md` sections 1 and 6a).
Claude keeps this file current.

**Publishing rule (owner decision 2026-11-23, Workflow v1.2):** No per-Reel
approval is needed. A Reel is published at its slot, on Instagram and then
YouTube, if its row says `ready` (or `approved`) with the commit of the exact
files that passed every check. The files and captions published are always the
ones at that commit. The owner gets every preview and can veto with
"Stopp <NNN>"; Claude then sets the row to `hold`.

**Status values:** `planned` → `in production` → `ready` (or `approved`,
before v1.2) → `published`; or `hold` (failed a check or vetoed).

| Slot (German time) | Reel | Type | Status | Ready/approved (date, commit) | YouTube text (`youtube.txt`) |
|---|---|---|---|---|---|
| Sun 2026-11-22 19:09 | 001-airdrop | evergreen | published | 2026-11-22 (pilot) | published 2026-11-23 22:30 by hand ([Short](https://www.youtube.com/shorts/XS9UBGAi0AE)) |
| Mon 2026-11-23 18:00 | 002-qr-code | evergreen | published 18:29 ([Reel](https://www.instagram.com/reel/DgF6up5AqZy/)) | 2026-11-22, 833a45a (published version; the later fix was not approved in time) | published 2026-11-23 22:39 by hand ([Short](https://www.youtube.com/shorts/TqQAoaGj_9o)) |
| Tue 2026-11-24 18:00 | 003-tap-to-pay | evergreen (share) | ready | 2026-11-24, 81fed83 (re-voiced at natural pace; content approved 2026-11-22) | approved 2026-11-23 (text at 6b6eef9) |
| Wed 2026-11-25 18:00 | 004-wifi-kitchen | evergreen (share) | ready | 2026-11-24, faabf1c (re-voiced at natural pace; content approved 2026-11-22) | approved 2026-11-23 (text at 6b6eef9) |
| Thu 2026-11-26 18:00 | 006-song-recognition | evergreen (share) | ready | 2026-11-24, faabf1c (re-voiced at natural pace; content approved 2026-11-23) | approved 2026-11-23 (text at 6b6eef9) |
| Fri 2026-11-27 18:00 | 005-face-id | evergreen (search, T3: Fri–Sun) | ready | 2026-11-24, faabf1c (re-voiced at natural pace; content approved 2026-11-22) | approved 2026-11-23 (text at 6b6eef9) |
| Sat 2026-11-28 18:00 | 007-cold-battery | evergreen (search, seasonal) | ready | 2026-11-24, b897f00 (re-voiced at natural pace; content approved 2026-11-23) | approved 2026-11-23 (text at 6b6eef9) |
| Sun 2026-11-29 18:00 | 008-noise-cancelling | evergreen (search) | ready | 2026-11-24, b897f00 (re-voiced at natural pace; content approved 2026-11-23) | approved 2026-11-23 (text at 6b6eef9) |
| Mon 2026-11-30 18:00 | 009-package-tracking | topical-seasonal (Cyber Monday) | ready | 2026-11-24, b897f00 (re-voiced at natural pace; content approved 2026-11-23) | approved 2026-11-23 (text at a29fa30) |
| Tue 2026-12-01 18:00 | 010-login-codes | evergreen (share) | ready | 2026-11-24, b897f00 (re-voiced at natural pace; content approved 2026-11-23) | approved 2026-11-23 (text at a29fa30) |

**Production batches:** Mon and Thu (scheduled task 09:13). Extra batch
003–005 produced on 2026-11-22 for the switch to daily posting. Next batch:
006–008 started on 2026-11-22 (owner asked to fill Thu/Sat/Sun now).
Batch Mon 2026-11-23: 009–010 (only 2: main had room for two more videos;
pushed after 002's video leaves main at 18:00). Next batch: Thu 2026-11-26.
