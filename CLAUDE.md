# tech.simple.explained — Workflow

**Version:** v1.3 · **Last updated:** 2026-11-24

This file is the single source of truth for how we run the channel. Every
Claude session reads it first and follows it. The owner has delegated content
and workflow decisions to Claude (2026-11-22). Claude keeps this file current
and logs every change in the changelog at the bottom. **Since 2026-11-23 the
owner has also delegated publishing:** Claude publishes finished Reels at the
agreed slots without per-Reel approval. The owner keeps a veto (hard rule 1).

Detailed rules, evidence and the pre-publish checklist live in
[`docs/playbook.md`](docs/playbook.md). This file states the decisions; the
playbook explains them.

---

## 1. Project

- **Channels:**
  - Instagram @tech.simple.explained (Professional account, ID `17841480548146890`).
  - YouTube Shorts "tech.simple.explained" (Brand Account channel, ID
    `UCSsTlgx8fGEp-GPJWu8X6CA`, set up 2026-11-23, phone-verified). It gets
    the same video as Instagram, uploaded via Zapier right after the
    Instagram publish.
- **Concept:** Everyday technology explained simply and excitingly
  (e.g. "How does AirDrop work?").
- **Goal:** As much reach and engagement as possible (views, likes, shares,
  saves, follows). Decisions are data-driven: research plus our own
  analytics. We never post blind.
- **Audience:** The English-speaking world.
- **Language:** All content in English (voiceover, on-screen text, captions,
  hashtags). Repo documents in English. Chat between owner and Claude in German.
- **Format:** Short vertical videos (Reels) with animated graphics, an AI
  voiceover and burned-in captions. Default length 35–60 s, up to 90 s if the
  topic needs it, never 3 minutes or more.
- **Opening (owner's preference, default from Reel #2):** The first spoken
  words are the topic question, and the on-screen title shows the same
  question, e.g. "How does AirDrop work?". A curiosity twist follows
  immediately (e.g. "…with no internet at all?").
- **Cadence (owner decision 2026-11-22):** One Reel **every day** at **18:00
  German time** (12:00 US Eastern, 17:00 UK), weekends included. Never skip a
  slot, never double-post. Production rhythm, queue and the topical fast lane
  are in section 6a.

## 2. Roles

- **Owner:**
  - Gets a preview of every Reel for information and can veto it ("Stopp
    <NNN>") until it goes live. No approval is needed (since 2026-11-23).
  - Can overrule any decision at any time.
  - Does the tasks that only work in the Instagram app (section 8).
- **Claude:** Decides topics, scripts, style and workflow. Does research,
  production, captions, publishing at the agreed slots, analytics and reports.

## 3. Hard rules

1. **Publish only what passed every check, and respect the owner's veto.**
   Owner decision 2026-11-23: Claude publishes at the agreed slots without
   per-Reel approval. A Reel goes live only if the full pre-publish checklist,
   the primary-source fact check and every automated check passed. Otherwise
   Claude holds it and tells the owner. The owner still gets every preview and
   can stop any Reel ("Stopp <NNN>"). Instagram has no draft mode and Claude
   cannot delete posts, so the quality gate replaces the approval.
2. **Claude cannot delete posts.** `delete_media` requires a Facebook-connected
   account; ours uses Instagram login. The owner deletes manually in the app if
   needed. Therefore quality checks before publishing must be thorough.
3. **Facts must be correct.** Verify every claim against a primary source.
   Simplify, but never state something false.
4. **This repo is public.** Never commit secrets, API keys, personal data or
   commenters' usernames. Aggregated statistics are fine.
5. **Only original or properly licensed assets.** No third-party clips,
   screenshots, product footage, watermarks or copyrighted music.
6. **Disclose the AI voice on every Reel.**
   - Caption line: "Voice: AI text-to-speech. Script written and fact-checked by a human."
   - Bio line: "AI narration, human-written scripts."
7. **Every Reel passes the pre-publish checklist** in `docs/playbook.md` before
   it is marked `ready` and published.

## 4. Tools and infrastructure

- **Instagram access:** Windsor.ai MCP connector "Windsor.ai for Social Media"
  (Trial plan, Instagram login).
  - Publish: `create_video_post` (Reels).
    - Always set `share_to_feed=true` and a designed `cover_url`.
    - No `trial_params` until eligible (see section 7).
  - Comments: create, reply, hide, unhide, delete.
  - Read: `get_data` — always look up field IDs with `get_fields` first.
  - **Publish timeouts:** `create_video_post` can time out after 60 s while
    Instagram is still processing the video (seen on 2026-11-23). Never retry
    blindly: wait about 2 minutes, then check `media_count` and the media list
    with `get_data` (look at `data_fetched_at`), and retry only if the Reel is
    really missing.
  - Not available on our setup: deleting posts, Instagram's music library,
    collaborators on video posts, alt text on Reels, setting the AI label
    (the owner sets it in the app after publishing, section 8).
- **YouTube access:** Uploads go through the **Zapier** connector
  (claude.ai connector, loaded in the main session since 2026-11-23).
  - Action: `execute_zapier_write_action`, selected_api `YouTubeV4CLIAPI`,
    action `upload_video` (tool `youtube_upload_video`). The default
    connection is the channel "tech.simple.explained" (channel ID
    `UCSsTlgx8fGEp-GPJWu8X6CA`); check `channelTitle` in the result.
  - Params: `title`, `description`, `video` (the pinned jsDelivr URL),
    `privacy_status` "public", `made_for_kids` "false", `notify_subscribers`
    "true", `category_id` "28" (Science & Technology).
  - Tested 2026-11-23 with a private test upload: it worked on the first try.
  - **Before uploading, check the free public feed**
    (`https://www.youtube.com/feeds/videos.xml?channel_id=UCSsTlgx8fGEp-GPJWu8X6CA`)
    so nothing is uploaded twice. Don't spend Zapier tasks on extra reads.
  - Windsor's `youtube` connector also lists `upload_video`, but YouTube
    rejected all three attempts with "rate-limited" (support ref 54691726).
    It is not used.
  - **Video URL:** the same jsDelivr URL pinned to the commit in the Reel's
    `ready` row. It keeps working after `video.mp4` is deleted from `main`.
  - **Reading YouTube data:** Windsor's `youtube` connector (account `118382`)
    reports `views` per video with a 24–48 h delay. It costs no Zapier tasks.
  - **Manual fallback:** the owner uploads by hand in the YouTube app, using
    `reels/<reel>/youtube.txt` (title, description, file link).
  - **Title:** the topic question, max 100 characters.
  - **Description:** the Instagram caption plus a short sources line. It keeps
    the same AI disclosure.
  - **"Altered or synthetic content":** answer **No**. There is no real
    person, no altered real footage and no realistic invented scene; the AI
    voice is disclosed in the description instead.
  - **Audience:** "not made for kids".
  - **Zapier free plan:** 100 tasks/month, and each successful call costs
    2 tasks. One upload a day is about 60 tasks/month.
- **Media hosting:** This repo, branch `main`. Instagram only accepts public URLs.
  - **Publish URLs use jsDelivr, pinned to the commit SHA:**
    `https://cdn.jsdelivr.net/gh/KingMeDong/tech-simple-assets@<commit-sha>/reels/<NNN>-<slug>/video.mp4`
    (same pattern for `cover.jpg`). jsDelivr serves the correct content types
    (`video/mp4`, `image/jpeg`).
  - raw.githubusercontent.com serves MP4 as `application/octet-stream`, so it
    is only a fallback (`https://raw.githubusercontent.com/KingMeDong/tech-simple-assets/main/<path>`).
  - Before publishing, verify each URL returns HTTP 200, the right content
    type and the same byte size as the local file.
  - jsDelivr does not serve GitHub repos larger than 50 MB. Videos are
    encoded at CRF 25 (about 5 MB per 50 s), `check.py` fails if all files on
    `main` exceed 45 MB, and **a Reel's `video.mp4` is deleted from `main` once
    Instagram has published it** (git history keeps it).
- **Git:** The owner has given standing permission to push to `main`.
- **Voice:** Piper TTS (free, runs locally), voice **`en_US-ryan-high`** at
  its natural pace: `LENGTH_SCALE` **1.05**, about 180 words per minute
  including pauses (owner decision 2026-11-23 after a listening test; the
  slower 1.38 setting sounded drawn-out). Don't slow the voice down to hit a
  words-per-minute target; shorten the script instead.
  - Install with `pip install piper-tts`.
  - Voice files come from Hugging Face `rhasspy/piper-voices`
    (`en/en_US/ryan/high/`). They are not stored in the repo because of their size.
- **Video pipeline:** `tools/reel/`.
  - Piper voice, Whisper word timing and pronunciation QA.
  - HTML/SVG scenes rendered frame by frame in headless Chromium, ffmpeg encode.
  - Spec check: `tools/reel/check.py`.
  - Usage is in `tools/reel/README.md`. On a fresh machine run `bash tools/reel/setup.sh` first.
- **Fonts:** Inter (`tools/fonts/`, SIL Open Font License).

## 5. Instagram technical specs

- **Reels:** MP4, H.264 (yuv420p), AAC 48 kHz.
  - Size: native 1080×1920, 30 fps, no borders.
  - File size: keep under 20 MB (jsDelivr per-file limit; at CRF 25 a 50 s Reel is about 5 MB).
  - Safe zone: keep all text and focal visuals inside x 65–1015 px and
    y 270–1250 px.
- **Cover:** JPEG 1080×1920, max 8 MB. The profile grid crops it to 3:4.
- **Caption:** 30–90 words, max 2,200 characters. Use 3 hashtags; never more
  than 5 (Instagram's cap).
- **Music:** The API cannot add music from Instagram's library. Any music must
  be royalty-free and baked into the video file. It is optional.

## 6. Per-post workflow

1. **Topic and script (Claude):** Pick the topic from `docs/topic-backlog.md`,
   based on the playbook and analytics. Write the script and verify every fact against primary sources.
2. **Production (Claude):** Visuals, voiceover, captions, cover, render.
3. **Quality check (Claude):** Run the playbook's pre-publish checklist and the
   automated spec check.
4. **Upload (Claude):** Push the video and cover to `main` and verify the
   public URLs. Files sitting in the repo are not published yet.
5. **Preview (owner, optional):** Claude sends the video, cover, caption,
   YouTube title and planned slot for information. No answer is needed. The
   owner can ask for changes or veto with "Stopp <NNN>" until the Reel goes
   live.
6. **Publish (Claude):**
   - Publish via Windsor at the planned slot, using the jsDelivr URLs, and
     record the `media_id` in the publishing log. Then delete `video.mp4`
     from `main`.
   - Then put the same video on YouTube as a Short (section 4: Zapier; the
     owner uploads by hand only if that fails) and record the YouTube link.
   - Publishing covers both platforms, so every preview includes
     `youtube.txt`.
7. **Track (Claude):** Pull metrics after 72 h and after 7 days.

## 6a. Production rhythm, queue and topical fast lane

- **Batch production:** Claude produces Reels in two batches a week, on
  **Monday and Thursday** (3–4 Reels each), and sends each batch to the owner
  in one go as a preview (no approval needed; veto possible).
- **Queue:** At least **3 ready Reels** at all times; target 5–7
  (about a week). If it drops below 3, Claude produces an extra batch at once.
  `main` holds at most about 8 unpublished videos (45 MB limit), so a batch
  only adds as many videos as fit; the rest wait until published videos
  leave `main`.
- **Schedule:** `docs/schedule.md` lists every slot, its Reel and its status.
  Claude marks a Reel `ready` (with the commit) once it passed all checks and
  its URLs are verified. Only `ready` or `approved` Reels are published, never
  one marked `hold` or vetoed by the owner.
- **Topical fast lane:** Current events that fit the channel jump the queue.
  - **Radar:** Claude checks the news every morning.
  - **A topic fits when** many people are using or hearing about the tech
    right now (a feature launch or update, a big outage, a viral tech moment,
    a seasonal habit), the "how does it work?" question has a clear answer,
    and the facts are confirmed by primary sources (official announcements,
    status pages, documentation).
  - **Never:** rumours or leaks, speculation about causes, politics, health
    effects, money advice, tragedies, brand bashing. No third-party footage or
    logos (hard rule 5).
  - **Fast path:** produce the same day, send the owner a preview, publish in
    the next 18:00 slot (the owner can veto until then). The topical Reel takes
    that slot and the queue moves back one day. If it isn't ready by 17:30, it
    moves to the next day, or is dropped once the moment has passed. Aim to be
    live within 48 h of the event.
  - All hard rules and the full pre-publish checklist still apply.
- **Scheduled tasks** (set up 2026-11-22 with the owner's go; they fire into
  the main Claude session, times in German time):
  - **Daily Reel publish, 17:31:** waits until 18:00 and publishes today's
    Reel if `docs/schedule.md` marks it `ready` or `approved` and the owner
    hasn't vetoed it. Then it updates the log,
    pulls due 72 h / 7 d metrics and checks the queue.
  - **Morning tech news radar, 07:47:** topical fast lane.
  - **Reel batch production, Mon + Thu 09:13.**

## 7. Analytics

- **Main KPI:** shares ÷ reach. This is our proxy for "sends", which Instagram
  weighs most for non-followers.
- **Also tracked:** like rate, average watch time, skip rate (hook quality),
  engagement rate, save rate, views ÷ reach (replays), follower change between
  publishes.
- **Benchmarks:** Judge every Reel against our own rolling median, not against
  vendor benchmarks.
- **Logging:** Each Reel's variables are logged: hook type, length, slot,
  weekday, CTA type, topic, music.
- **Experiments:** Change one variable at a time, with at least 6 Reels per
  variant, in alternating order. The experiment list is in the playbook.
- **Reports:** A report every 2 weeks (every second Monday in the batch run,
  first on 2026-12-07). Reliable patterns need roughly 20–30 Reels.
- **How and when** (details in `analytics/README.md`): a follower snapshot
  every day, a 72 h pull 3 days and a 7 d pull 7 days after each Reel, all in
  the daily 17:31 run. Raw data goes to `analytics/metrics.csv` and
  `followers.csv`; `analytics/report.py` computes the KPIs against our median.
  The 72 h result is part of the daily status message.
- **First signal (2026-11-24, only n = 2):** Reel 001 (natural voice) had a
  46% skip rate and 9.9 s average watch time; Reel 002 (slowed voice) had 78%
  and 4.8 s. That's why every queued Reel was re-voiced at the natural pace.
  Treat it as a hint until the 2026-12-07 report.
- **YouTube metrics:** not yet part of the daily pull (planned, section 9).
- **Trial Reels:** Not used until we have followers. At 200 followers, try one
  trial publish; if it is refused, retry at 1,000.

## 8. Owner tasks (in the Instagram app or outside our tools)

- **Comments:** The owner answers comments personally (decision 2026-11-22).
  Claude doesn't reply to comments.
- **Windsor plan:** The owner handles the trial and any paid plan. If the
  trial ends without a plan, Instagram publishing and metrics stop.
- **YouTube, once (open):** Upload the profile picture and banner in YouTube
  Studio → Customization → Branding (`brand/avatar.png`,
  `brand/youtube-banner.png`). Claude can't upload images through the API.
- **Once (done 2026-11-22):** Name field "Tech Simple Explained · How tech
  works" and bio with the AI-narration line, both verified via the API.
- **After every publish (about 30 s):** Add Meta's in-app "AI info" label to
  the new Reel (playbook A2). Verified on Reel #1: the label can be added to
  Reels published through the API. Claude's daily status message reminds the
  owner.
- **Weekly (about 5 min):**
  - Check Account Status to confirm the account is still eligible for
    recommendations.
  - Screenshot the retention curves of the best and the worst Reel of the week
    and send them to Claude.

## 9. Setup roadmap

1. [x] Workflow v0 written (this file).
2. [x] **Research:** Output is `docs/playbook.md` (source notes in
   `docs/research_notes/`). Its decisions are merged into this file (v0.1).
3. [x] **Production pipeline:**
   - Video template (animated graphics, Ryan voice, synced captions, cover)
   - Automated spec check
   - Reproducible environment setup
4. [x] **Pilot Reel:** Reel 001 (AirDrop) published on 2026-11-22 via
   Windsor with jsDelivr URLs. It worked on the first try.
5. [x] **Analytics system:** Publishing log, follower snapshots, 72 h / 7 d
   metrics pulls, `analytics/report.py` (KPIs vs. rolling median, variable
   comparisons) and a two-weekly report.
6. [x] **Automation:** Scheduled tasks for daily publishing (18:00), the
   morning news radar and the Mon/Thu production batches (section 6a).

All six are done, so this file is **Workflow v1**.

**Phase 2 (planned, owner direction 2026-11-24; details in section 11):**
1. [ ] YouTube Shorts metrics in the daily pull (Windsor `youtube`, `views`).
2. [ ] Niche research for a second YouTube channel, after the 2026-12-07
   report.
3. [ ] Second channel as a 30-day test (YouTube only; own topic, look and
   voice).
4. [ ] Long-form YouTube videos (5–10 min) built from our best Shorts topics,
   for watch hours.

**Already verified:**
- The Claude GitHub app has push access.
- raw.githubusercontent.com URLs serve files publicly (HTTP 200, `image/jpeg`).
- The default branch is `main`.
- Windsor `create_video_post` accepts jsDelivr-hosted MP4 + cover
  (media_id returned immediately; permalink readable via `get_data`).
- The Windsor plan is currently **Trial** (not paid). `force_refresh` is not
  available, so reads return cached data (`data_fetched_at` shows how fresh).
  The owner is checking what happens when the trial ends.
- Metrics read works (2026-11-22): reach, views, shares, saves, likes,
  comments, average and total watch time, and skip rate per Reel.
- Zapier `upload_video` to YouTube works (private test 2026-11-23). The channel
  description was set through Zapier's raw API request (`channels.update`).
- Windsor `create_video_post` can time out while Instagram still processes the
  video; the Reel then appears about 2 minutes later (seen 2026-11-23).
- Windsor's YouTube `upload_video` was rejected three times as rate-limited
  (support ticket 54691726); a manual upload worked, so the channel is fine.

## 10. Repo layout

```
CLAUDE.md                 this workflow
README.md                 short public description
docs/playbook.md          rules, evidence, pre-publish checklist, experiments
docs/topic-backlog.md     Reel ideas, status, queue priority, topical lane
docs/schedule.md          daily slots, Reel status (ready/published/hold), commits
docs/research_notes/      source notes behind the playbook
tools/                    shared code: fonts, styles, render scripts
brand/                    avatar, YouTube banner, channel texts
reels/<NNN>-<slug>/       per Reel: script.json (text + sources), scene.js,
                          outline.md (beats, facts, lessons), caption.txt,
                          youtube.txt, cover.jpg, video.mp4 (removed from
                          main once published)
analytics/                publishing log, metrics.csv, followers.csv,
                          report.py, reports/ (no usernames)
```


## 11. Strategy and direction (owner, 2026-11-24)

- **Goal beyond this channel:** Several YouTube Shorts channels that earn
  money with little ongoing effort. A second channel would be **YouTube
  only**. Instagram stays for this channel, not for new ones. If needed, the
  owner uploads a new channel's videos by hand and Claude says when to
  publish.
- **Why YouTube:** It has a clear revenue share (YouTube Partner Program).
  Ad revenue needs 1,000 subscribers plus 4,000 watch hours in 12 months or
  10 M Shorts views in 90 days; fan funding starts at 500 subscribers.
  Reported for 2027-02-01: about double (8,000 h or 20 M Shorts views). Check
  the official YouTube Help page before planning around these numbers.
  Instagram has no open revenue share for Reels in Germany that we could
  confirm; it is worth more for reach and later brand deals.
- **The main risk is YouTube's "inauthentic content" rule** (clarified July
  2026). Mass-produced, template-like AI content isn't monetized, and YouTube
  reviews the whole channel. AI voice is allowed when the content adds real
  value. So every channel needs its own topic, look and voice, every Reel its
  own visual idea and checked facts, and we vary the visuals on purpose.
- **Order:** First the 2026-12-07 report for this channel. Then niche
  research (demand, competition, ad value, sources, risks), then one second
  channel as a 30-day test, and only then more. Money and health niches are
  out (error risk and YouTube's strictness).
- **Posting frequency:** daily for now (Buffer: 6–9 posts/week gave more reach
  per post as long as quality held). Review it in the 2026-12-07 report; fall
  back to 5/week if quality or per-Reel numbers drop.
- **Costs to watch:** Claude usage (each Reel takes substantial compute),
  Zapier (free plan covers one YouTube channel at one upload a day; a second
  channel needs a paid plan), Windsor (trial).
- **Zapier is used only for YouTube uploads.** Recurring work stays in
  Claude's scheduled tasks.

---

## Changelog

- **2026-11-22 · v0:** Initial decisions: English, Reels, Ryan voice, posting
  every 2 days, single public repo, owner approval before every post.
  Removed the German AirDrop carousel test.
- **2026-11-22 · v0:** Research done; `docs/playbook.md` added.
- **2026-11-22 · v0.1:**
  - Owner delegated content and workflow decisions to Claude; publishing still
    needs owner approval.
  - Merged the playbook decisions: AI-voice disclosure, 18:00 German-time slot,
    3-Reel queue, 35–60 s default length, caption and hashtag rules, metrics at
    72 h and 7 d, owner's weekly in-app tasks.
  - The pilot is a normal Reel because Trial Reels need 200+ followers.
  - Topic and script approval by the owner removed; the owner approves only
    the final post.
- **2026-11-22 · v0.1:**
  - Pipeline built (`tools/reel/`) and pilot Reel 001 produced.
  - New default opening: the spoken and on-screen topic question first
    (owner feedback on the pilot).
  - Pilot Reel 001 published (owner asked to post immediately as a test,
    off-slot). Publishing log started in `analytics/publishing-log.md`.
- **2026-11-22 · v0.1:** Topic backlog started in `docs/topic-backlog.md`
  (12 ideas, queue priority: QR code, tap-to-pay, Wi-Fi in the kitchen).
  Topics are now picked from that list.
- **2026-11-22 · v0.1:** Reel 002 (QR code) produced. Piper speed default
  changed from `LENGTH_SCALE` 1.05 (measured 203 wpm) to 1.38 (~168 wpm) to
  meet the 150–170 wpm rule.
- **2026-11-22 · v0.1:**
  - Cadence changed from every 2 days to **daily** at 18:00 German time
    (owner decision).
  - Production in two weekly batches (Mon, Thu); queue of ≥3 approved Reels,
    target 5–7.
  - Topical fast lane for current events added (section 6a).
  - Slot plan and approvals now live in `docs/schedule.md`.
- **2026-11-22 · v0.1:** Owner gave the go for automation. Scheduled tasks
  created: daily publish (17:31 → 18:00), morning news radar (07:47), batch
  production (Mon + Thu 09:13). Per-Reel approval is unchanged.
- **2026-11-22 · v0.1:**
  - Reels 003–005 produced (extra batch for daily posting).
  - Video encode changed to CRF 25 (about half the size, SSIM 0.998) and a
    45 MB repo-size check added: with 5–7 queued videos, the old size would
    have broken jsDelivr's 50 MB limit.
  - `tts.py` reads an optional per-Reel `length_scale` from `script.json`.
- **2026-11-22 · v1:**
  - Analytics system built (`analytics/README.md`, `metrics.csv`,
    `followers.csv`, `report.py`). The daily run snapshots followers and pulls
    72 h / 7 d metrics; the first two-weekly report is due 2026-12-07.
  - The owner answers comments and handles the Windsor plan.
  - All six roadmap items done: Workflow v1.
- **2026-11-22 · v1:** AI label verified: it can be added in the app to Reels
  published via the API, so it is now an owner task after every publish
  (reminder in the daily status message). The owner's earlier test post is
  being deleted.
- **2026-11-22 · v1:**
  - Reels 006–008 produced (Thu/Sat/Sun slots).
  - `lib.js` `T.word()` now normalises apostrophes on both sides; `render.py`
    warns about any word it can't find. This fixed a sync error in Reel 002:
    the ✗ appeared about 0.5 s before the corner square was covered.
  - The publish run now always publishes the files and caption from the
    **approved commit**, never newer unapproved versions on `main`.
- **2026-11-23 · v1.1:**
  - YouTube Shorts added as a second platform: brand channel, upload via the
    Zapier connector, manual upload by the owner until it works.
  - Every Reel gets a `youtube.txt`; the owner's approval covers both platforms.
  - Brand assets (avatar, YouTube banner) are in `brand/`.
- **2026-11-23 · v1.1:**
  - `youtube.txt` created for Reels 002–008; their YouTube texts still need
    the owner's OK (002–005 were approved before v1.1).
  - Scheduled publish and batch runs now include the YouTube step (Zapier if
    connected, otherwise a manual-upload request to the owner).
  - Morning radar 2026-11-23: no topical go.
- **2026-11-23 · v1.1:** Batch run: Reels 009 (package tracking, Cyber
  Monday) and 010 (login codes). Only two fit under the 45 MB limit; the queue
  rule now notes the cap of about 8 unpublished videos on `main`.
- **2026-11-23 · v1.1:** Reel 002 published (18:29, 29 min late: worker
  restart plus a Windsor timeout while Instagram processed the video). Rule
  added in section 4: no blind retries after a publish timeout.
- **2026-11-23 · v1.1:** YouTube channel connected to Windsor (`upload_video`
  available, so Zapier isn't needed). The first upload attempts were
  rate-limited by YouTube; a retry is scheduled.
- **2026-11-23 · v1.1:** First YouTube Short live (001, uploaded by hand by the
  owner). Windsor `upload_video` was rejected three times; support ticket
  54691726. Phone verification done (intermediate features active).
- **2026-11-23 · v1.1:**
  - Reel 002 on YouTube (uploaded by hand).
  - Voice speed back to Piper's natural pace (`LENGTH_SCALE` 1.05, about
    180 wpm) by owner decision after a listening test. This replaces the
    150–170 wpm rule from Reel 002 on and applies from the batch on Thu
    2026-11-26; the approved Reels 003–010 stay as they are.
- **2026-11-23 · v1.1:** YouTube automation plan: one Windsor upload attempt
  per Reel in the daily run, with a feed check against duplicates and a manual
  fallback; Zapier or our own Google Cloud project only if Windsor keeps
  failing.
- **2026-11-23 · v1.1:** Zapier connected (Stage 2) and tested with a private
  upload, which worked. The daily run now uploads the Short via Zapier after
  checking the public feed. Windsor is used for Instagram only.
- **2026-11-23 · v1.2:** **Owner decision: publishing no longer needs
  per-Reel approval.** Claude publishes at the agreed slots on Instagram and
  YouTube. Safeguards: the quality gate (checklist, primary-source facts,
  automated checks; on any failure the Reel is held) and the owner's veto
  ("Stopp <NNN>") on the preview of every Reel. Schedule status `ready`
  replaces `awaiting approval`.
- **2026-11-24 · v1.2:** All queued Reels 003–010 re-voiced at the natural
  pace (`LENGTH_SCALE` 1.05; now 38–43 s at 176–194 wpm, before 46–51 s at
  153–163 wpm). Reason: the owner asked for the speech-rate check, and Reel
  002 (slow voice) had a 78% skip rate vs. 46% for Reel 001 (natural voice) in
  the first hours. Only n = 2, so this is a signal, not proof. Texts, facts,
  captions and covers are unchanged; all checks pass.
- **2026-11-24 · v1.3:** Documentation review:
  - New section 11: strategy (several YouTube Shorts channels; YouTube-first
    monetization; the inauthentic-content risk; daily cadence under review).
  - Phase 2 roadmap added.
  - First analytics signal recorded.
  - "Already verified" updated (Zapier, timeouts, Windsor YouTube).
  - Repo layout corrected (`script.json`, `outline.md`, `youtube.txt`,
    `brand/`).
  - Wording from the approval era removed.
  - YouTube branding upload added as an owner task.
  - Lessons from Reels 001–010 are now in the playbook.
