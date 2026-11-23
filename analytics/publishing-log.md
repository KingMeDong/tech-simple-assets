# Publishing log

One row per published Reel. Variables are logged for experiments (workflow section 7).
Metrics live in `analytics/metrics.md` (72 h and 7 d pulls).

| # | Reel | Published (German time) | Media ID | Link | Length | Weekday / slot | Hook type | CTA type | Topic | Music | Followers at publish |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 001-airdrop | 2026-11-22 19:09 | 18417265588087409 | https://www.instagram.com/reel/DgDaiiVjWiE/ | 42 s | Sun / 19:09 (test, off-slot) | statement + question | send | AirDrop / phone features | none | 0 (new account) |
| 2 | 002-qr-code | 2026-11-23 18:29 | 18133230598833143 | https://www.instagram.com/reel/DgF6up5AqZy/ | 48 s | Mon / 18:00 slot (live 18:29: worker restart + Windsor timeout, see note) | question + twist | loop (video) + question (caption) | QR codes / everyday tech | none | 2 |

**Note 2026-11-23:** The publish call for 002 timed out after 60 s while Instagram was still processing the video. A fresh `get_data` 2 minutes later showed the Reel live (17:29:38 UTC), so no retry was made. Published version: approved commit 833a45a.

## YouTube Shorts

| Reel | Published (German time) | Video ID | Link | Uploaded by | Note |
|---|---|---|---|---|---|
| 001-airdrop | 2026-11-23 22:30 | XS9UBGAi0AE | https://www.youtube.com/shorts/XS9UBGAi0AE | owner, by hand | Title "How does AirDrop work with no Internet" (owner adjusted it after upload); Windsor `upload_video` was rate-limited 3 times (support ref 54691726) |
| 002-qr-code | 2026-11-23 22:39 | TqQAoaGj_9o | https://www.youtube.com/shorts/TqQAoaGj_9o | owner, by hand | Title from youtube.txt |
