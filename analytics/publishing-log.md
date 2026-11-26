# Publishing log

One row per published Reel. Variables are logged for experiments (workflow section 7).
Metrics live in `analytics/metrics.md` (72 h and 7 d pulls).

| # | Reel | Published (German time) | Media ID | Link | Length | Weekday / slot | Hook type | CTA type | Topic | Music | Followers at publish |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 001-airdrop | 2026-11-22 19:09 | 18417265588087409 | https://www.instagram.com/reel/DgDaiiVjWiE/ | 42 s | Sun / 19:09 (test, off-slot) | statement + question | send | AirDrop / phone features | none | 0 (new account) |
| 2 | 002-qr-code | 2026-11-23 18:29 | 18133230598833143 | https://www.instagram.com/reel/DgF6up5AqZy/ | 48 s | Mon / 18:00 slot (live 18:29: worker restart + Windsor timeout, see note) | question + twist | loop (video) + question (caption) | QR codes / everyday tech | none | 2 |
| 3 | 003-tap-to-pay | 2026-11-24 18:55 | 18419843842084295 | https://www.instagram.com/reel/DgIijNImQZO/ | 42.5 s | Tue / 18:00 slot (live 18:55: worker restart after the wait) | question + twist | send | contactless payments / NFC | none | 2 |
| 4 | 004-wifi-kitchen | 2026-11-25 20:40 | 18431091115157765 | https://www.instagram.com/reel/DgLTT_sTOuw/ | 41.4 s | Wed / 18:00 slot (live 20:40: worker restart during the wait) | question + twist | save | Wi-Fi / microwave interference | none | 2 |
| 5 | 006-song-recognition | 2026-11-26 19:15 | 18124508642084429 | https://www.instagram.com/reel/DgNucHehPgn/ | 38.5 s | Thu / 18:00 slot (live 19:15: worker restart right after the 3-min wait) | question + twist | send | song recognition / audio fingerprints | none | 2 |

**Note 2026-11-23:** The publish call for 002 timed out after 60 s while Instagram was still processing the video. A fresh `get_data` 2 minutes later showed the Reel live (17:29:38 UTC), so no retry was made. Published version: approved commit 833a45a.

## YouTube Shorts

| Reel | Published (German time) | Video ID | Link | Uploaded by | Note |
|---|---|---|---|---|---|
| 001-airdrop | 2026-11-23 22:30 | XS9UBGAi0AE | https://www.youtube.com/shorts/XS9UBGAi0AE | owner, by hand | Title "How does AirDrop work with no Internet" (owner adjusted it after upload); Windsor `upload_video` was rate-limited 3 times (support ref 54691726) |
| 002-qr-code | 2026-11-23 22:39 | TqQAoaGj_9o | https://www.youtube.com/shorts/TqQAoaGj_9o | owner, by hand | Title from youtube.txt |
| 003-tap-to-pay | 2026-11-24 19:54 | ozwbZ8jS9Tw | https://www.youtube.com/shorts/ozwbZ8jS9Tw | owner, by hand | Zapier `upload_video` returned 429 Too Many Requests (18:56); no retry |
| 004-wifi-kitchen | 2026-11-25 18:00 | jHvOvqq6DBU | https://www.youtube.com/shorts/jHvOvqq6DBU | owner, scheduled | First scheduled Short, live on time; Instagram followed at 20:40 (worker restart) |
| 006-song-recognition | 2026-11-26 18:00 | sQO_0xV1_KM | https://www.youtube.com/shorts/sQO_0xV1_KM | owner, scheduled | Live on time; Instagram followed at 19:15 (worker restart) |
