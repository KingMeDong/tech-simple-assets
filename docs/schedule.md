# Posting schedule

One Reel a day at **18:00 German time** (`CLAUDE.md` sections 1 and 6a).
Claude keeps this file current.

**Publishing rule (owner decision 2026-11-23, Workflow v1.2):** No per-Reel
approval is needed. A Reel is published at its slot, on Instagram and then
YouTube, if its row says `ready` (or `approved`) with the commit of the exact
files that passed every check. The files and captions published are always the
ones at that commit. YouTube: since 2026-11-24 the owner schedules each
Short in YouTube Studio for the same slot, from the YouTube-Plan page
(`CLAUDE.md` section 4); Claude records the link once it is live. The owner gets every preview and can veto with
"Stopp <NNN>"; Claude then sets the row to `hold`.

**Status values:** `planned` → `in production` → `ready` (or `approved`,
before v1.2) → `published`; or `hold` (failed a check or vetoed).

| Slot (German time) | Reel | Type | Status | Ready/approved (date, commit) | YouTube text (`youtube.txt`) |
|---|---|---|---|---|---|
| Sun 2026-11-22 19:09 | 001-airdrop | evergreen | published | 2026-11-22 (pilot) | published 2026-11-23 22:30 by hand ([Short](https://www.youtube.com/shorts/XS9UBGAi0AE)) |
| Mon 2026-11-23 18:00 | 002-qr-code | evergreen | published 18:29 ([Reel](https://www.instagram.com/reel/DgF6up5AqZy/)) | 2026-11-22, 833a45a (published version; the later fix was not approved in time) | published 2026-11-23 22:39 by hand ([Short](https://www.youtube.com/shorts/TqQAoaGj_9o)) |
| Tue 2026-11-24 18:00 | 003-tap-to-pay | evergreen (share) | published 18:55 ([Reel](https://www.instagram.com/reel/DgIijNImQZO/)) | 2026-11-24, 81fed83 | YouTube [ozwbZ8jS9Tw](https://www.youtube.com/shorts/ozwbZ8jS9Tw) (by hand; Zapier 429) |
| Wed 2026-11-25 18:00 | 004-wifi-kitchen | evergreen (share) | published 20:40 ([Reel](https://www.instagram.com/reel/DgLTT_sTOuw/); worker restart) | 2026-11-24, faabf1c (re-voiced at natural pace; content approved 2026-11-22) | YouTube [jHvOvqq6DBU](https://www.youtube.com/shorts/jHvOvqq6DBU) 18:00 (scheduled by owner) |
| Thu 2026-11-26 18:00 | 006-song-recognition | evergreen (share) | published 19:15 ([Reel](https://www.instagram.com/reel/DgNucHehPgn/); worker restart) | 2026-11-24, faabf1c (re-voiced at natural pace; content approved 2026-11-23) | YouTube [sQO_0xV1_KM](https://www.youtube.com/shorts/sQO_0xV1_KM) 18:00 (scheduled by owner) |
| Fri 2026-11-27 18:00 | 005-face-id | evergreen (search, T3: Fri–Sun) | ready | 2026-11-24, faabf1c (re-voiced at natural pace; content approved 2026-11-22) | approved 2026-11-23 (text at 6b6eef9) |
| Sat 2026-11-28 18:00 | 007-cold-battery | evergreen (search, seasonal) | ready | 2026-11-24, b897f00 (re-voiced at natural pace; content approved 2026-11-23) | approved 2026-11-23 (text at 6b6eef9) |
| Sun 2026-11-29 18:00 | 011-flight-tracking | topical-seasonal (US Thanksgiving return travel) | ready | 2026-11-26, e8cd92b | new 2026-11-26; owner schedules in YouTube Studio |
| Mon 2026-11-30 18:00 | 009-package-tracking | topical-seasonal (Cyber Monday) | ready | 2026-11-24, b897f00 (re-voiced at natural pace; content approved 2026-11-23) | approved 2026-11-23 (text at a29fa30) |
| Tue 2026-12-01 18:00 | 010-login-codes | evergreen (share) | ready | 2026-11-24, b897f00 (re-voiced at natural pace; content approved 2026-11-23) | approved 2026-11-23 (text at a29fa30) |
| Wed 2026-12-02 18:00 | 008-noise-cancelling | evergreen (search) | ready | 2026-11-24, b897f00 (re-voiced at natural pace; content approved 2026-11-23) | moved from Sun 2026-11-29 on 2026-11-26 (owner: move or schedule it for Wed 2.12); text approved 2026-11-23 (6b6eef9) |
| Thu 2026-12-03 18:00 | 012-bluetooth-trackers | evergreen (share) | ready | 2026-11-26, e8cd92b | new 2026-11-26; owner schedules in YouTube Studio |
| Fri 2026-12-04 18:00 | 013-dark-mode | evergreen (search) | ready | 2026-11-26, e8cd92b | new 2026-11-26; owner schedules in YouTube Studio |

**Production batches:** Mon and Thu (scheduled task 09:13). Extra batch
003–005 produced on 2026-11-22 for the switch to daily posting. Next batch:
006–008 started on 2026-11-22 (owner asked to fill Thu/Sat/Sun now).
Batch Mon 2026-11-23: 009–010 (only 2: main had room for two more videos;
pushed after 002's video leaves main at 18:00). Next batch: Thu 2026-11-26.
