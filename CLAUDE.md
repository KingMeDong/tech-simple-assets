# tech.simple.explained — Workflow

**Version:** v0.1 (draft) · **Last updated:** 2026-11-22

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

- **Channel:** Instagram @tech.simple.explained (Professional account, ID `17841480548146890`).
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
    collaborators on video posts, alt text on Reels, setting the AI label.
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
  - File size: keep under 20 MB (jsDelivr per-file limit; a 60 s Reel is about 7–10 MB).
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
6. **Publish (Claude):** Publish via Windsor at the planned slot, using the
   jsDelivr URLs. Record the `media_id` in the publishing log. Then delete
   `video.mp4` from `main`.
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
- **Reports:** A report every 2 weeks. Reliable patterns need roughly 20–30 Reels.
- **Trial Reels:** Not used until we have followers. At 200 followers, try one
  trial publish; if it is refused, retry at 1,000.

## 8. Owner tasks in the Instagram app (not possible via the API)

- **Once:** Update the name field and bio with the text Claude provides.
- **After Reel #1:** Check whether the in-app "AI info" label can be added to a
  Reel published through the API. Report back.
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
5. [ ] **Analytics system:** Publishing log, metrics pull, report template.
6. [x] **Automation:** Scheduled tasks for daily publishing (18:00), the
   morning news radar and the Mon/Thu production batches (section 6a).

When all six are done, this file becomes **Workflow v1**.

**Already verified:**
- The Claude GitHub app has push access.
- raw.githubusercontent.com URLs serve files publicly (HTTP 200, `image/jpeg`).
- The default branch is `main`.
- Windsor `create_video_post` accepts jsDelivr-hosted MP4 + cover
  (media_id returned immediately; permalink readable via `get_data`).
- The Windsor plan is currently **Trial** (not paid). `force_refresh` is not
  available, so reads return cached data. What happens when the trial ends is
  still to be checked with the owner.

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
