# tech.simple.explained — Workflow

**Version:** v0 (draft) · **Last updated:** 2026-11-22

This file is the single source of truth for how we run the channel. Every
Claude session reads it first and follows it. It changes only with the
owner's approval; every change is logged in the changelog at the bottom.
If something here is outdated or blocks the work, propose an update to the
owner — never silently deviate.

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
- **Format:** Short vertical videos (Reels) with voiceover and on-screen text.
  Gripping and informative. Other formats (carousels, stories) only if the
  data suggests it.
- **Cadence:** One Reel every 2 days.

## 2. Roles

- **Owner:** Approves topics, scripts and every post before publishing. Has the
  final say on this workflow.
- **Claude:** Research, topic proposals, scripts, visuals, voiceover, video
  editing, captions, hashtags, publishing (only after approval), analytics
  and reports.

## 3. Hard rules

1. **Never publish without explicit owner approval** of the exact final video,
   caption and hashtags. Instagram has no draft mode — publishing goes live
   immediately.
2. **Claude cannot delete posts.** `delete_media` requires a Facebook-connected
   account; ours uses Instagram login. The owner deletes manually in the app if
   needed. Therefore quality checks before publishing must be thorough.
3. **Facts must be correct.** Verify every claim. Simplify, but never state
   something false.
4. **This repo is public.** Never commit secrets, API keys, personal data or
   commenters' usernames. Aggregated statistics are fine.
5. **Only original or properly licensed assets.** No copyrighted music, images
   or footage.

## 4. Tools and infrastructure

- **Instagram access:** Windsor.ai MCP connector "Windsor.ai for Social Media"
  (free plan, Instagram login).
  - Publish: `create_video_post` (Reels; supports `trial_params`, `cover_url`,
    `thumb_offset`, `share_to_feed`), `create_carousel_post`,
    `create_image_post`, `create_story`.
  - Comments: create, reply, hide, unhide, delete.
  - Read: `get_data` — always look up field IDs with `get_fields` first.
- **Media hosting:** This repo, branch `main`. Instagram only accepts public URLs.
  - URL pattern: `https://raw.githubusercontent.com/KingMeDong/tech-simple-assets/main/<path>`
  - Before publishing, verify each URL returns HTTP 200 with the right content type.
- **Git:** The owner has given standing permission to push to `main`.
- **Voice:** Piper TTS (free, runs locally), voice **`en_US-ryan-high`**.
  - Install with `pip install piper-tts`.
  - Voice files come from Hugging Face `rhasspy/piper-voices`
    (`en/en_US/ryan/high/`). They are not stored in the repo because of their size.
- **Video:** ffmpeg (H.264 + AAC MP4). Visual pipeline: to be defined in setup step 3.
- **Fonts:** Inter (`tools/fonts/`, SIL Open Font License).

## 5. Instagram technical specs

- **Reels:** MP4 or MOV, H.264 + AAC.
  - Size: 9:16, 1080×1920 recommended.
  - Length: 3 s to 15 min.
  - File size: max 1 GB. GitHub allows max 100 MB per file, so aim for < 50 MB.
- **Images:** JPEG, max 8 MB, aspect ratio 4:5 to 1.91:1.
- **Caption:** Max 2,200 characters.
- **Music:** The API cannot add music from Instagram's library. Any music must
  be royalty-free and baked into the video file.

## 6. Per-post workflow (draft — finalized after setup steps 2–4)

1. **Topic:** Claude proposes topics based on the playbook and analytics → owner approves.
2. **Script:** Hook, explanation steps, payoff, call to action → owner approves.
3. **Production:** Visuals, voiceover, on-screen text, render.
4. **Quality check:** Technical specs, facts, playbook checklist.
5. **Preview to owner:** Video, caption, hashtags, planned posting time.
6. **Upload:** Push to `main`, verify the public URL.
7. **Publish:** Only after the owner says OK, via Windsor. Record the `media_id`.
8. **Track:** Log metrics after 24 h and after 7 days.

## 7. Analytics (draft)

- **Per Reel:**
  - `media_views`, `media_reach`
  - `media_reel_skip_rate` (share of viewers who leave in the first 3 s)
  - `media_reel_avg_watch_time`, `media_reel_total_watch_time`
  - `media_total_like_count`, `media_total_comments_count`, `media_saved`,
    `media_shares`, `media_reposts`
- **Account:**
  - `followers_count`, `reach_non_followers`
  - `follower_count_1d` (only available from 100 followers)
- **Attributes:** Each Reel is tagged with topic category, hook type, length,
  voice and posting time, so results can be compared.
- **Testing:** Change one variable at a time. Use Trial Reels
  (`trial_params`, shown to non-followers only) for A/B tests of hooks.
- **Reports:** A report every 2 weeks. Reliable patterns need roughly 8–10 posts.
- **Not available through the API:** Retention curve (where exactly viewers
  drop off) and follows gained per Reel.

## 8. Setup roadmap

1. [x] Workflow v0 written (this file).
2. [ ] **Research:** What drives reach and engagement on Reels — algorithm
   signals, successful English tech channels, length, hook, pacing, posting
   times, captions and hashtags. Output: `docs/playbook.md` with a checklist
   every video must pass.
3. [ ] **Production pipeline:**
   - Video template (animated graphics, Ryan voice, synced on-screen text)
   - Automated spec check
   - Reproducible environment setup (so new sessions are ready immediately)
4. [ ] **Pilot Reel:** Run one Reel through the full workflow and publish it as
   a Trial Reel. This tests the last untested step: Windsor/Instagram
   accepting a video.
5. [ ] **Analytics system:** Tracking file and report template.

When all five are done, this file becomes **Workflow v1**.

**Already verified:**
- The Claude GitHub app has push access.
- raw.githubusercontent.com URLs serve files publicly (HTTP 200, `image/jpeg`).
- The default branch is `main`.

## 9. Repo layout

```
CLAUDE.md                 this workflow
README.md                 short public description
docs/                     playbook, research notes
tools/                    shared code: fonts, styles, render scripts
reels/<NNN>-<slug>/       per Reel: script.md, video.mp4, cover.jpg, caption.txt
analytics/                tracking data and reports (aggregated, no usernames)
```

---

## Changelog

- **2026-11-22 · v0:** Initial decisions: English, Reels, Ryan voice, posting
  every 2 days, single public repo, owner approval before every post.
  Removed the German AirDrop carousel test.
