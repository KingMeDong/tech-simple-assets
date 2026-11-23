# tech.simple.explained — Workflow

**Version:** v1.1 · **Last updated:** 2026-11-23

This file is the single source of truth for how we run the channel. Every
Claude session reads it first and follows it. The owner has delegated content
and workflow decisions to Claude (2026-11-22). Claude keeps this file current
and logs every change in the changelog at the bottom. **The one thing that is
never delegated: publishing requires the owner's explicit approval.**

Detailed rules, evidence and the pre-publish checklist live in
[`docs/playbook.md`](docs/playbook.md). This file states the decisions; the
playbook explains them.

---

## 1. Project

- **Channels:**
  - Instagram @tech.simple.explained (Professional account, ID `17841480548146890`).
  - YouTube Shorts "tech.simple.explained" (brand channel on the owner's Google
    account, set up 2026-11-23). It gets the same video as Instagram, uploaded
    after the Instagram publish.
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
  - Approves every post before it is published (final video, caption, hashtags,
    posting time).
  - Can overrule any decision at any time.
  - Does the tasks that only work in the Instagram app (section 8).
- **Claude:** Decides topics, scripts, style and workflow. Does research,
  production, captions, publishing (only after approval), analytics and reports.

## 3. Hard rules

1. **Never publish without explicit owner approval** of the exact final video,
   caption and hashtags. Instagram has no draft mode — publishing goes live
   immediately.
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
   it is shown to the owner for approval.

## 4. Tools and infrastructure

- **Instagram access:** Windsor.ai MCP connector "Windsor.ai for Social Media"
  (Trial plan, Instagram login).
  - Publish: `create_video_post` (Reels).
    - Always set `share_to_feed=true` and a designed `cover_url`.
    - No `trial_params` until eligible (see section 7).
  - Comments: create, reply, hide, unhide, delete.
  - Read: `get_data` — always look up field IDs with `get_fields` first.
  - Not available on our setup: deleting posts, Instagram's music library,
    collaborators on video posts, alt text on Reels, setting the AI label
    (the owner sets it in the app after publishing, section 8).
- **YouTube access:** Windsor cannot upload to YouTube. Uploads go through
  the **Zapier** connector (action "YouTube: Upload Video").
  - **Video URL:** the same jsDelivr URL pinned to the approved commit. It
    keeps working after `video.mp4` is deleted from `main`.
  - **Until Zapier is connected:** the owner uploads by hand in the YouTube
    app, using `reels/<reel>/youtube.txt` (title, description, file link).
  - **Title:** the topic question, max 100 characters.
  - **Description:** the Instagram caption plus a short sources line. It keeps
    the same AI disclosure.
  - **"Altered or synthetic content":** answer **No**. There is no real
    person, no altered real footage and no realistic invented scene; the AI
    voice is disclosed in the description instead.
  - **Audience:** "not made for kids".
  - **Zapier free plan:** about 100 tasks/month. Verify the actual usage per
    upload.
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
- **Voice:** Piper TTS (free, runs locally), voice **`en_US-ryan-high`**, about
  150–170 words per minute.
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
5. **Approval (owner):** Claude sends the video, cover, caption and planned
   slot. The owner watches the video on a phone, once with sound and once
   muted, and answers "OK" or asks for changes.
6. **Publish (Claude):**
   - Publish via Windsor at the planned slot, using the jsDelivr URLs, and
     record the `media_id` in the publishing log. Then delete `video.mp4`
     from `main`.
   - Then put the same video on YouTube as a Short (section 4: Zapier, or the
     owner by hand until Zapier works) and record the YouTube link.
   - The owner's approval covers both platforms, so every preview includes
     `youtube.txt`.
7. **Track (Claude):** Pull metrics after 72 h and after 7 days.

## 6a. Production rhythm, queue and topical fast lane

- **Batch production:** Claude produces Reels in two batches a week, on
  **Monday and Thursday** (3–4 Reels each), and sends each batch to the owner
  in one go. The owner approves Reel by Reel.
- **Queue:** At least **3 approved Reels** ready at all times; target 5–7
  (about a week). If it drops below 3, Claude produces an extra batch at once.
- **Schedule and approvals:** `docs/schedule.md` lists every slot, its Reel
  and its approval. Claude marks a Reel approved only after the owner's
  explicit "OK" in chat, and only Reels marked approved are ever published.
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
  - **Fast path:** produce the same day → owner approval → publish in the next
    18:00 slot. The topical Reel takes that slot and the queue moves back one
    day. Not approved by 17:30: it moves to the next day, or is dropped once
    the moment has passed. Aim to be live within 48 h of the event.
  - All hard rules and the full pre-publish checklist still apply.
- **Scheduled tasks** (set up 2026-11-22 with the owner's go; they fire into
  the main Claude session, times in German time):
  - **Daily Reel publish, 17:31:** waits until 18:00 and publishes today's
    Reel only if `docs/schedule.md` marks it approved. Then it updates the log,
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
- **Trial Reels:** Not used until we have followers. At 200 followers, try one
  trial publish; if it is refused, retry at 1,000.

## 8. Owner tasks (in the Instagram app or outside our tools)

- **Comments:** The owner answers comments personally (decision 2026-11-22).
  Claude doesn't reply to comments.
- **Windsor plan:** The owner handles the trial and any paid plan.
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

## 10. Repo layout

```
CLAUDE.md                 this workflow
README.md                 short public description
docs/playbook.md          rules, evidence, pre-publish checklist, experiments
docs/topic-backlog.md     Reel ideas, status, queue priority, topical lane
docs/schedule.md          daily slots, assigned Reels, owner approvals
docs/research_notes/      source notes behind the playbook
tools/                    shared code: fonts, styles, render scripts
reels/<NNN>-<slug>/       per Reel: script.md, video.mp4, cover.jpg, caption.txt
analytics/                publishing log, metrics, reports (no usernames)
```

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
