# Instagram Reels Distribution and Growth Tactics for a Brand-New Account (as of 2026-11-22)

Scope: everything around the video itself (caption, hashtags, keywords/SEO, CTAs, frequency, timing, cold start, Trial Reels, collabs, cross-posting, profile, API publishing effects and limits). Context: new English-language account @tech.simple.explained, animated explainer Reels with TTS voiceover, one Reel every 2 days, published via the Instagram Graph API through a third-party connector, creator based in Germany.

Source-type labels used below:
- **[Official]**: Instagram/Meta (creators.instagram.com, about.instagram.com, about.fb.com, developers.facebook.com) or a direct Mosseri quote.
- **[Official, via secondary]**: a Mosseri or Instagram quote that I saw only as quoted by a news or vendor site, not in the original video or post.
- **[Data study]**: a large-sample vendor study (Buffer, Sprout, Hootsuite, Later, Metricool, Socialinsider, Emplifi). These are correlational and drawn from each vendor's own customers.
- **[Secondary/vendor blog]**: smaller vendor or SEO blogs. Lower confidence.
- **[Anecdote]**: practitioner or single-account claims.

---

## 1. Captions: length, keywords for Instagram search and Google, first-line hooks, alt text

### Takeaway
Write a 30–90-word caption that is keyword-rich in plain natural language. Put the main search phrase (for example "how Wi-Fi works" or "what is a VPN") in the first sentence. Instagram search matches caption text, and public posts from professional accounts have been indexed by Google since July 10, 2025. Alt text cannot be set on Reels through the API. Burned-in on-screen captions plus Instagram's auto-captions are the accessibility route.

### Cited Findings
- **[Official] Search matches text first.** "The text you enter in the search bar is by far the most important signal for Search." Queries are matched against usernames, profile names, bios, captions, hashtags and places. Tip: "For a post to be found in Search, put keywords and hashtags in the caption, not the comments." Accounts that post spam "may appear lower in search results." (Adam Mosseri, Aug 25, 2021, still the canonical official explainer) — [Instagram: Breaking Down How Instagram Search Works](https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works/)
- **[Official] Caption limits (API):** caption maximum is "2200 characters, 30 hashtags, and 20 @ tags" per the Graph API IG User Media reference. The hashtag part conflicts with the newer 5-hashtag product limit; see section 2. — [Meta Graph API: IG User Media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media)
- **[Data study] Caption length, Reels:** Socialinsider (updated Oct 28, 2026; ~28.6M organic Instagram posts, Jan–Sep 2026, brands with 1K–1M followers; engagement rate per follower). Reels average engagement: <30 words 0.20%; 30–60 words 0.25%; 60–90 words 0.25%; 90+ words 0.20%. Quote: "The best range is wider, from 30 to 90 words, where engagement stays at 0.25%." 90+ words is the weakest bracket for every format. Carousels peak at under 60 words (0.37%). — [Socialinsider: Social Media Caption Length Best Practices](https://www.socialinsider.io/blog/social-media-caption-length-best-practices/)
- **[Data study] Conversation-inviting captions:** Metricool 2026 Instagram study (released Jun 16, 2026; 24.36M posts from 375,118 accounts; Jan–Feb 2025 compared with Jan–Feb 2026). Posts with a question got 36.70% more comments. Posts with comment-focused CTAs got 202.78% more comments. Metricool recommends natural-language captions and "Instagram SEO" over hashtags. — [Metricool 2026 Instagram study press release](https://metricool.com/press-release-instagram-study-2026/)
- **[Official, via secondary] Google indexing:** starting July 10, 2025, public posts (photos, videos, Reels, carousels, including captions and hashtags) from professional accounts (business or creator) owned by users 18+ can be indexed by search engines. It is on by default and can be turned off under Settings & Privacy > Privacy > Searchability. Stories and Highlights are not indexed. One source says posts from after Jan 1, 2020 are eligible. Secondary sources disagree on whether Google was already crawling some posts before July. — [PPC Land, Jul 2025](https://ppc.land/instagram-content-becomes-searchable-on-google-starting-july-10/); [Metricool: Instagram indexing on Google](https://metricool.com/instagram-indexing-on-google/); [Website Builder Expert](https://www.websitebuilderexpert.com/news/instagram-content-search-engines/)
- **[Official] Hook in the video, not just the caption:** Instagram's ranking explainer says to open with a hook in the first 3 seconds and to watch "View Rate" in Insights (the share of viewers who keep watching past 3 seconds). It also says to make Reels that make sense to people who don't know the creator. Captions are not discussed. (Feb 26, 2025) — [Instagram Creators: Helping creators of all sizes break through](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through)
- **[Official] Alt text is not available for Reels via API:** the `alt_text` field on the Media endpoint (changelog Mar 24, 2025) is for image posts only: "Reels and stories are not supported." — [Meta: Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/); [Meta Graph API: IG User Media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media)
- **[Secondary/vendor blog] Alt text in the app:** accessibility guides document custom alt text for photos and carousels (Advanced settings > "Write alt text"), but not for Reels. For video, the documented route is captions, either burned-in or Instagram auto-generated. — [Stanford UIT: Instagram accessibility](https://uit.stanford.edu/accessibility/techniques/social-media/instagram); [Elgin: Alt text and captions on Instagram](https://elgin.edu/accessibility/social-media/instagram/)
- **[Secondary/vendor blog] Keyword-over-hashtag framing:** vendor blogs report Mosseri saying keywords matter more than hashtags. I found no direct quote. — [Phable](https://www.phable.io/phable-labs/instagram-hashtags-keywords-discovery)

### Inferences
- For an explainer channel, the caption works like a search snippet. The first sentence should state the question the Reel answers in the words people type ("How does Bluetooth actually work?"). It doubles as the hook line under the video and as the indexable text Google is most likely to show.
- Aim for about 40–80 words: a hook or question line, 2–3 plain-language sentences restating the key points with 2–3 keyword variants (for example "Wi-Fi router", "home internet", "wireless signal"), then one CTA line, then up to 5 hashtags. This sits inside Socialinsider's 30–90-word Reels band.
- The profile name field and bio are searchable (official), so keywords belong there too. See section 6.
- Because Reels alt text can't be set via the API, the TTS voiceover should be mirrored by burned-in on-screen text. That serves accessibility and sound-off viewing, and Instagram's recommended "make sense to strangers" standard.

### Gaps
- I found no reliable data on how many characters show before "...more" on Reels in 2026, and no study isolating first-line caption hooks (as opposed to the video hook) as a reach factor.
- No official statement says caption keywords affect Reels recommendations (as opposed to search). The official evidence covers search only.
- I could not confirm whether the Instagram app currently offers a custom alt-text field for Reels (Help Center pages did not render).
- The Socialinsider and Metricool data come from brand accounts with at least 1K followers and measure per-follower engagement. That is not directly transferable to a 0-follower account, whose reach is almost entirely non-follower.

---

## 2. Hashtags: official limit, how many, broad vs. niche, do they still matter?

### Takeaway
Instagram limits posts and Reels to 5 hashtags. This was announced by @creators on Dec 18, 2025 and is rolling out gradually; the "use up to 30" advice is outdated. Mosseri has said repeatedly that hashtags do not increase reach and mainly help categorize content. Use 3–5 specific, topical hashtags in the caption as labels, not as a growth lever.

### Cited Findings
- **[Official, via secondary] 5-hashtag limit:** Instagram is "gradually" updating the limit to five hashtags per caption for Reels and posts. It said "using fewer (up to 5) more targeted hashtags, rather than many generic ones" can improve content performance and user experience, and that it is limiting the count to avoid misuse. The limit had been tested for about a year, with many test users capped at three; five is the universal limit. (Social Media Today, Andrew Hutchinson, Dec 18, 2025) — [Social Media Today: Instagram Implements New Limits on Hashtag Use](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)
- **[Secondary/vendor blog] Comments loophole:** Later's guide is quoted as saying "the 5-hashtag limit applies regardless of whether hashtags are in your caption or comments", so splitting them doesn't add slots. I did not verify this in Later's original. — summarized in [Metahashtags](https://metahashtags.com/how-many-hashtags-on-instagram/) and [Outfeed](https://outfeed.ai/blog/instagram-hashtag-limit/)
- **[Official] API docs still say 30:** the Graph API Media reference still lists "30 hashtags" in the caption limit. That conflicts with the product change. I found no official statement on how the 5-tag cap is enforced on API-published posts. — [Meta Graph API: IG User Media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media); conflict also noted by [Outfeed](https://outfeed.ai/blog/instagram-hashtag-limit/)
- **[Official, via secondary] Mosseri on hashtags and reach:** Feb 2025: hashtags "don't work" to increase reach. May 2025: hashtags "don't improve visibility on Instagram" but are "a great way to let people know what a post is about." — quoted in [Social Media Today, Dec 18, 2025](https://www.socialmediatoday.com/news/instagram-implements-new-limits-on-hashtag-use/808309/)
- **[Official, via secondary] Older framing (2022):** hashtags "do help us to understand what a post is about, which means it might be more likely to show up in a place like a hashtag page." — quoted in search-result coverage, e.g. [Hootsuite: hashtags don't affect reach](https://blog.hootsuite.com/social-media-updates/instagram/hashtags-dont-affect-reach/)
- **[Official] Search:** hashtags in the caption are one of the text fields matched in Instagram Search. Put them in the caption, not the comments. — [Instagram: How Instagram Search Works (2021)](https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works/)
- **[Data study] Hashtags correlate with lower performance:** Metricool 2026 (24.36M posts): posts with at least one hashtag had 31.70% fewer views and 33.89% fewer interactions than the platform average. Metricool: "Hashtags are becoming less effective on Instagram." This is correlational, not causal. — [Metricool press release, Jun 16, 2026](https://metricool.com/press-release-instagram-study-2026/)
- **[Secondary/vendor blog] Unverified claims:** one site says posts with more than 5 tags get suppressed and that 3–5 tags beat long lists by 30–40%. I could not confirm either; treat them as unsupported. — [Digital Applied](https://www.digitalapplied.com/blog/instagram-limits-hashtags-5-organic-reach-strategy-2026)

### Inferences
- Use 3–5 hashtags that name the topic precisely, for example one format tag (#techexplained), one or two topic tags (#wifi, #cybersecurity) and one audience tag (#techtips). Skip generic high-volume tags (#viral, #fyp, #explore). This matches Instagram's own "targeted, not generic" wording; there is no data on broad vs. niche for 2026.
- Keep tags at or under 5 even though the API docs say 30. API publishes may be rejected or truncated once the cap is enforced, and Instagram frames more than 5 as "misuse."
- Spend the effort on caption keywords (search and Google) rather than hashtag research.

### Gaps
- No official Instagram Help Center page on the 5-tag limit was retrieved (pages are JS-rendered), and the original @creators post was not accessed directly.
- How the limit is enforced via API (error, silent truncation, or none) is undocumented.
- I found no 2026 study comparing broad and niche hashtag choice.

---

## 3. CTAs for sends, saves, comments and follows, and what counts as engagement bait

### Takeaway
Sends (DM shares) are the signal Mosseri ties most closely to reach among non-followers, which is the audience a new account is trying to reach. CTAs that ask for a real reaction ("send this to the friend who still uses '1234' as a password", "Which gadget should I explain next?") fit the official guidance. Instagram calls it engagement bait when "the end goal is to simply maximize the quantity of engagements" (for example "comment YES", "tag 5 friends"), and engagement bait is listed as ineligible for recommendations. Comment-keyword automations such as ManyChat are explicitly not targeted.

### Cited Findings
- **[Official, via secondary] Sends matter most for non-followers:** "like rates matter more for your followers, and send rates matter more for those who don't follow you." Also: "The thing I think that matters most... is not how much reach your post got... of all the people who saw the post, how many of them actually engaged with that post?" (Mosseri, reported May 26, 2026) — [Social Media Today: Instagram engagement rates provide insight into reach](https://www.socialmediatoday.com/news/instagram-engagement-rates-provide-insight-into-reach/821170/)
- **[Official] Ranking signals:** watch time, retention, shares, likes and comments, plus audience matching (Feb 26, 2025). — [Instagram Creators: Helping creators of all sizes break through](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through)
- **[Official, via secondary] Engagement bait definition and allowed CTAs (June 5, 2024):** Instagram's guidance warned against content that "explicitly asks for engagement", with the example "asking people to comment with a specific word, number, or emoji." It then clarified: "What is engagement bait is if the end goal is to simply maximize the quantity of engagements." Engaging earnestly "in the comments and DMs to connect personally", to generate leads or drive conversions, is not bait, and creators "can still use 3rd party services such as ManyChat." Open-ended questions and CTAs are endorsed. — [Social Media Today: Instagram Clarifies Advice on Single Word CTAs](https://www.socialmediatoday.com/news/instagram-clarifies-advice-single-word-ctas-longer-reels/718151/)
- **[Official] Recommendation ineligibility:** content that "may not be eligible for recommendations" includes "clickbait or engagement bait", along with repurposed/unoriginal content, misleading content and others. Repeat violations can make the whole account ineligible for a period, which is shown in Account Status. (Page dated Apr 30, 2024; footer © 2026) — [Instagram Creators: Recommendations and originality](https://creators.instagram.com/recommendations-and-originality)
- **[Data study] Comment CTAs lift comments:** posts with a question got +36.70% comments; posts with comment-focused CTAs got +202.78% comments (Metricool, Jun 16, 2026, correlational). — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)
- **[Data study] Saves:** carousels generated 9x more saves than single-image posts (Metricool 2026). There was no Reels-specific save CTA data. — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)
- **[Secondary/vendor blog] Sends weighting:** claims that sends are weighted "3–5x likes" could not be traced to Mosseri or Instagram; treat as unverified. Instagram does not report DM sends separately, and shares ÷ reach is the usual proxy. — [Influencer Marketing Hub: Sends-per-reach playbook](https://influencermarketinghub.com/instagram-sends-per-reach-playbook/); [ZoomSphere](https://www.zoomsphere.com/blog/instagram-algorithm-2026-what-actually-gets-reach)
- **[Official, via secondary] "Hacks" in general:** "those hack-type tactics sometimes work, usually don't." (Mosseri, on re-sharing feed posts to Stories, Apr 6, 2026) — [Social Media Today: Instagram chief debunks popular engagement hack](https://www.socialmediatoday.com/news/instagram-chief-debunks-popular-engagement-hack/816781/)

### Inferences
- Lowest-risk, highest-relevance CTA pattern for a tech explainer: a targeted send prompt tied to the content ("Send this to someone whose phone battery is always at 5%"), or a save prompt tied to utility ("Save this before your next router reset"). Rotate them rather than adding a boilerplate CTA to every post. No evidence was found on whether a *specific* "send this to..." line triggers bait classification. The official line is about intent ("simply maximize the quantity"), so a CTA that fits the topic is safer than a generic one.
- Use open questions ("Which tech term confuses you most?") to seed comments and next-Reel ideas. Avoid "comment 1/2/3", "like if...", "tag 5 friends".
- A comment-keyword-to-DM automation ("comment WIFI for the checklist") is officially tolerated. It needs a DM automation tool and a lead magnet, which is probably out of scope at launch.
- The CTA can be spoken or shown on screen in the last 1–2 seconds as well as in the caption, but no data compares placements (see Gaps).

### Gaps
- No controlled study measures the lift in sends or saves from "send this to..." or "save this" CTAs specifically. Metricool's data covers comments only.
- No current (2026) Instagram Help Center wording on engagement bait was retrieved; the most specific official wording is the June 2024 clarification.
- No data on on-screen vs. spoken vs. caption CTA placement.

---

## 4. Posting frequency and consistency: is every 2 days reasonable?

### Takeaway
One Reel every 2 days (3–4 per week) falls in Buffer's "3–5 posts/week sweet spot." In that bucket, within-account follower growth was roughly double the 1–2 posts/week bucket and reach per post was ~12% higher. Weeks with zero posts measurably hurt growth. More is better up to diminishing returns, but quality and sustainability dominate. Instagram's official advice is simply "post regularly" and "post original content consistently."

### Cited Findings
- **[Data study] Buffer frequency study** (Kirsti Lang; analysis by data scientist Julian Winternheimer; published Aug 13, 2025; 2.1M feed posts including Reels, photos and carousels, from ~102K accounts; Stories excluded; within-account z-score and fixed-effects models; Reels not segmented). — [Buffer: How Often Should You Post on Instagram](https://buffer.com/resources/how-often-to-post-on-instagram/)
  - Follower growth rate increase vs. no-post weeks (fixed effects): 1–2 posts/wk +0.12%; **3–5 posts/wk +0.26%**; 6–9 posts/wk +0.44%; 10+ posts/wk +0.66%. Buffer describes 3–5 as "more than double" the 1–2 bucket, 6–9 as "nearly 3.7x" and 10+ as "about a 5.5x increase."
  - Reach per post vs. the 1–2/wk baseline (median): 3–5/wk ~+12%; 6–9/wk ~+18%; 10+/wk ~+24%. Posting more did not lower reach per post.
  - "No-post penalty": weeks with zero posts averaged ~0.08 standard deviations below the account's typical growth.
  - Recommendation: 3–5/wk is the "sweet spot"; 6–9+ only if quality holds; 10+ shows diminishing returns and burnout risk. Results are correlational and from Buffer users.
- **[Data study] Buffer best-time article (Sep 23, 2026)** repeats "3 to 5 times per week... plus 1 to 2 Stories daily" as the sweet spot. — [Buffer: Best Time to Post on Instagram (9.6M posts)](https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram/)
- **[Official] Instagram:** "Post regularly" (Feb 26, 2025) — [Instagram Creators](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through). "One of the most effective ways to grow is to post original content consistently." (Jan 21, 2025) — [Instagram Creators: Finding success on reels in 2025](https://creators.instagram.com/blog/the-latest-with-instagram?)
- **[Data study] Decay window:** "Most views happen in the first three days after posting" (Metricool, Jun 16, 2026). — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)
- **[Official, via secondary] Mosseri:** reported advice is to post as often as you can without burning out. Only secondary summaries were found; no direct quote. — [Kabo: Instagram Ranking in 2026](https://kabo.sh/guides/instagram-ranking-2026); [Bazzaal](https://www.bazzaal.com/blog/instagram-algorithm-2026-mosseri)

### Inferences
- Every 2 days = 3.5 posts/week on average (alternating 3 and 4), squarely inside the 3–5 bucket. No week ever has zero posts, so the "no-post penalty" is avoided. That makes it a sound starting cadence for a single creator with an animation pipeline.
- A strict every-48-hours rhythm rotates through every weekday, so about 3 of every 7 posts land on Fri/Sat/Sun, which most timing studies rank weakest (section 5). Option: keep 3–4 posts/week but fix them to stronger days (e.g. Mon/Wed/Thu + Sat or Sun as a test slot). This is a scheduling tweak; the frequency is the same.
- With roughly a 3-day view window (Metricool), posting every 2 days means each Reel overlaps the next one's early distribution. There's no evidence this cannibalizes reach; Buffer found reach per post *rose* with frequency.
- Trial Reels (section 6) can add test volume without flooding followers if the account becomes eligible.

### Gaps
- Buffer did not segment Reels from photos and carousels and did not isolate new or 0-follower accounts. The growth effects are measured within existing accounts.
- No official Instagram statement gives a numeric frequency.

---

## 5. Best posting times and days for US, UK and global English audiences, translated to German time

### Takeaway
The studies disagree on exact hours; they normalize to the *audience's local time* and are mostly not Reels-specific. The most consistent pattern across Buffer (2026), Sprout (2026) and Hootsuite (2026) is Tue–Thu, late morning to evening local time, with Fri/Sat weakest in Buffer and Sprout. For a mixed US + UK English audience, **18:00–21:00 German time on Tue–Thu** covers US-East lunchtime and early afternoon, US-West morning and UK early evening. For a US-only focus, 18:00–24:00 German time covers ET midday through 6 pm ET. Instagram's official position is that ranking prioritizes audience activity, and each account should test against its own Insights.

### Cited Findings
- **[Data study] Buffer (published/updated Sep 23, 2026):** 9.6M Instagram posts (subset of a 52M-post, 10-platform study, 200K+ accounts), Jan 2024–Dec 2025; median engagement rate; "Times apply to your local timezone." Top 3 slots: Thursday 9 a.m., Wednesday 12 p.m., Wednesday 6 p.m. Best days: Wed > Thu > Tue; Fri and Sat weakest. By day: Mon 7 p.m., 6 p.m., 8 p.m.; Tue 7 p.m., 3 p.m., 5 p.m.; Wed 12 p.m., 6 p.m., 8 a.m.; Thu 9 a.m., 8 a.m., 7 a.m.; Fri 10 p.m., 9 p.m., 6 a.m.; Sat 9 p.m., 10 p.m., 8 p.m.; Sun 9 p.m., 10 p.m., 8 p.m. Worst: 1–5 a.m. The article says Reels do well in the evening (6–11 p.m., Wed/Thu strongest) but admits these "aren't reels-only slots" because formats were pooled. It also contradicts itself on weekday mornings. — [Buffer: Best Time to Post on Instagram](https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram/)
- **[Data study] Sprout Social (updated Mar 31, 2026):** nearly 2B engagements across 307K profiles; peak windows from Nov 27, 2025–Feb 27, 2026; "All optimal posting times are listed in Local Time." Mon 2–4 p.m.; Tue 1–7 p.m.; Wed 12–9 p.m. (+11 p.m.); Thu 12–2 p.m.; Fri no significant peaks; weekends lowest ("Sunday is one of the worst days to post on Instagram"). Asked whether Reels differ: "No. Our data indicates that the algorithm prioritizes user activity times over content format." — [Sprout Social: Best Times to Post on Instagram](https://sproutsocial.com/insights/best-times-to-post-on-instagram/)
- **[Data study] Hootsuite (Jul 14, 2026):** 1M+ posts, localized across 118 countries. Mon 3–9 p.m.; Tue 5–8 a.m. and 3–7 p.m.; Wed 5 p.m.; Thu 4–5 p.m.; Fri ~4 p.m.; Sat 11 a.m. and ~5 p.m.; Sun 12–3 p.m. Best days for reach: Mon, Tue, Thu. No Reels-specific times. — [Hootsuite: Best time to post on Instagram](https://blog.hootsuite.com/best-time-to-post-on-instagram/)
- **[Data study, outlier and dated data] Later (updated Apr 21, 2026, but data from Jan–Oct 2024):** 6M+ posts, 975K Reels, normalized to the audience's local time. Best Reels time is "12 AM"; best Reels day is Monday. Overall best times are 3–6 a.m. local. This conflicts with Buffer, Sprout and Hootsuite. — [Later: Best time to post on Instagram](https://later.com/blog/best-time-to-post-on-instagram/)
- **[Secondary/vendor blog]** PostFast (5,191 Reels) reportedly found weekday 1–3 p.m. *Eastern* gave the highest typical reach. Adobe (2025, 22K+ Reels) reportedly found midnight and Tuesday strong. SocialPilot (250K+ Reels) favors 8 a.m. and 12 p.m. Mon–Thu. All seen only in search summaries, not verified. — [PostFast](https://postfa.st/blog/best-time-to-post-reels-on-instagram); [ContentGrip on Adobe](https://www.contentgrip.com/instagram-reels-best-posting-times/); [SocialPilot](https://www.socialpilot.co/insights/best-time-to-post-reels-on-instagram)
- **[Data study] Views accrue over ~3 days** (Metricool 2026), so the hour matters mainly for the first follower-driven test batch. — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)

### Inferences

**Time-zone arithmetic** (checked with Python zoneinfo for Nov 2026 and Jun 2027):
- US Eastern → German time: +6 h most of the year (EST→CET and EDT→CEST). **+5 h** during the DST gaps: Mar 14–27, 2027 (US already on summer time, EU not) and Oct 31–Nov 6, 2027 (EU back on winter time, US not). In 2026 the autumn gap was Oct 25–Oct 31.
- US Central → German time: +7 h (+6 h in the gaps). US Pacific → German time: +9 h (+8 h in the gaps).
- UK → German time: always +1 h (same DST dates).

**Study windows translated to German time (CET/CEST, normal +6 h ET offset):**

| Study window (audience local time) | If audience = US Eastern | US Pacific | UK |
|---|---|---|---|
| Buffer top: Wed 12:00 | Wed 18:00 | Wed 21:00 | Wed 13:00 |
| Buffer top: Wed 18:00 | Thu 00:00 | Thu 03:00 | Wed 19:00 |
| Buffer top: Thu 09:00 | Thu 15:00 | Thu 18:00 | Thu 10:00 |
| Buffer "Reels evening" 18:00–23:00 (Wed/Thu) | 00:00–05:00 next day | 03:00–08:00 next day | 19:00–24:00 |
| Sprout Tue 13:00–19:00 | Tue 19:00–Wed 01:00 | Tue 22:00–Wed 04:00 | Tue 14:00–20:00 |
| Sprout Wed 12:00–21:00 | Wed 18:00–Thu 03:00 | Wed 21:00–Thu 06:00 | Wed 13:00–22:00 |
| Sprout Thu 12:00–14:00 | Thu 18:00–20:00 | Thu 21:00–23:00 | Thu 13:00–15:00 |
| Sprout Mon 14:00–16:00 | Mon 20:00–22:00 | Mon 23:00–Tue 01:00 | Mon 15:00–17:00 |
| Hootsuite Mon 15:00–21:00 | Mon 21:00–Tue 03:00 | Tue 00:00–06:00 | Mon 16:00–22:00 |
| Hootsuite Tue 15:00–19:00 | Tue 21:00–Wed 01:00 | Wed 00:00–04:00 | Tue 16:00–20:00 |
| Hootsuite Wed 17:00 / Thu 16:00–17:00 | Wed 23:00 / Thu 22:00–23:00 | Thu 02:00 / Fri 01:00–02:00 | Wed 18:00 / Thu 17:00–18:00 |
| PostFast weekday 13:00–15:00 ET (unverified) | 19:00–21:00 | (10:00–12:00 PT) | (18:00–20:00 UK) |

- **Practical starting slots (German time), to A/B test:** (a) **18:00–19:00 Tue/Wed/Thu**: ET 12–1 p.m., PT 9–10 a.m., UK 5–6 p.m. Hits Buffer's Wed-noon peak and Sprout's midday windows for the US, and evening for the UK. (b) **15:00 Thu**: Buffer's Thu 9 a.m. ET peak. (c) For US-heavy audiences, a late slot **00:00–01:00** (6–7 p.m. ET) matches Buffer's evening-Reels claim; the API scheduler makes it painless.
- For a 0-follower account most early reach comes from recommendations to non-followers, so the clock time matters less than for established accounts. Once followers exist, use Insights' "Most active times" (audience local data) to replace these defaults. Instagram and every vendor say this.
- Fixing posting days to Tue–Thu plus one weekend test slot can be reconciled with the "every 2 days" cadence (section 4).

### Gaps
- No major vendor publishes a reliably Reels-only, country-split (US vs. UK) 2026 timing study. Buffer, Sprout and Hootsuite pool formats and normalize to local time, so they give no single absolute UTC time for a global English audience.
- Hootsuite's per-time-zone section (EST/PST/CST/UTC) exists but its figures were not extracted.
- The vendor studies measure engagement rate per follower, not non-follower reach for new accounts.

---

## 6. New-account growth: cold start, Trial Reels, collabs, cross-posting, profile, comments, Stories

### Takeaway
Officially, every eligible Reel is first shown to a small test audience that includes non-followers and expands if it performs. Follower count is not a gate, and "creators of all sizes have an equal chance of breaking through." The cold-start levers are original content with no visible watermarks, a strong 3-second hook, Reels that make sense to strangers, Reels of 3 minutes or less (recommendation-eligible), a keyword-optimized profile, and sends. Trial Reels go only to non-followers, but eligibility reportedly requires a public professional account with **at least 200 followers**, so @tech.simple.explained may not be able to use them on day 1 even via API. Stories reach almost no one at zero followers.

### Cited Findings

**Cold start and distribution (official)**
- **[Official]** Among non-followers a Reel is first shown to "a small audience of people we think will enjoy it"; stronger Reels reach progressively wider audiences, distributing content "based on its engagement, not just the creator's follower count." The ranking changes announced Apr 2024 were fully launched by Feb 26, 2025. — [Instagram Creators: Helping creators of all sizes break through (Feb 26, 2025)](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through)
- **[Official]** "creators of all sizes have an equal chance of breaking through"; "One of the most effective ways to grow is to post original content consistently." (Jan 21, 2025) — [Instagram Creators: Finding success on reels in 2025](https://creators.instagram.com/blog/the-latest-with-instagram?)
- **[Official]** Eligible for recommendation means content that is "original, does not violate our community guidelines, has no visible watermarks and satisfies our recommendation guidelines." Repeat violations can make the account ineligible for a period, visible in Account Status. — [Instagram Creators: Recommendations and originality](https://creators.instagram.com/recommendations-and-originality)
- **[Official] Length (update to outdated advice):** Reels up to **3 minutes** are now eligible for recommendations to non-followers. The June 2024 rule was that Reels over 90 seconds would not be recommended ([SMT, Jun 5, 2024](https://www.socialmediatoday.com/news/instagram-clarifies-advice-single-word-ctas-longer-reels/718151/)); that is **outdated**. — [Instagram Creators, Jan 21, 2025](https://creators.instagram.com/blog/the-latest-with-instagram?)
- **[Official] Audio:** "Adding audio can help reels... reach more people." (Feb 2025) — [Instagram Creators](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through)
- **[Official, via secondary]** Mosseri (Colin and Samir Show, Oct 28, 2026, seen only as a Shorts clip) said a brand-new account *can* (not will) reach a million. — [YouTube Shorts clip](https://www.youtube.com/watch?v=-_iiHLXGtM4)
- **[Data study]** Only 21% of accounts under 10,000 followers grew in 2026 (Metricool, Jun 16, 2026). Growth is not automatic. — [Metricool press release](https://metricool.com/press-release-instagram-study-2026/)
- **[Anecdote]** One blog reports creator-measured claims that new accounts often stall around 200 views per Reel. It is not from Instagram. — [Creator Lane](https://creatorlanehq.com/blog/instagram-algorithm-2026-mosseri-vs-measured)

**Trial Reels**
- **[Official]** Launched Dec 10, 2024: "Trial reels will be shown to non-followers first." Followers "won't see it in Feed or Instagram's Reels tab" (they may still see it via DMs or audio, location or filter pages). Trials don't appear on the grid or Reels tab unless shared with everyone. Insights (views, likes, comments, shares, comparison to previous trials) arrive after ~24 h. An optional auto-share to followers triggers if the trial performs well based on "the views it receives within the first 72 hours." Eligibility is deferred to the Help Center. — [Instagram Creators: Trial reels](https://creators.instagram.com/blog/instagram-trial-reels); [Meta Newsroom](https://about.fb.com/news/2024/12/trial-reels-try-content-non-followers-first-see-what-perfo/)
- **[Official] API:** `trial_params` with `graduation_strategy` = `MANUAL` ("graduated manually in the native Instagram app") or `SS_PERFORMANCE` (auto-graduates if it performs well). Valid only with `media_type=REELS`. Trial Reels via API "are shared only with non-followers." — [Meta: Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/); [Meta: IG User Media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media). One secondary blog dates API support to a Dec 3, 2025 changelog entry ([AdaptlyPost](https://adaptlypost.com/blog/instagram-trial-reels)). Ayrshare says graduation itself isn't exposed via the API ([Ayrshare docs](https://www.ayrshare.com/docs/apis/post/social-networks/instagram)).
- **[Secondary/vendor blog] Eligibility, conflicting:** most 2026 sources cite the Help Center as requiring a public account with **≥200 followers for professional (creator/business) accounts** (≥1,000 for personal accounts) that is eligible for recommendations. Older sources say 1,000 for all accounts; treat that as outdated. — [Flowgent (2026)](https://flowgent.ai/blog/instagram-trial-reels); [Superprofile](https://superprofile.bio/guides/instagram-trial-reels); conflict discussed in search summaries of [Kevin Welter](https://kevinwelter.com/en/blog/instagram-testreels) and [Creator Tribune](https://creatortribune.com/instagram-trial-reels/)
- **[Official, via secondary] Mosseri on trials:** "Trials are not going to hurt your account… if anything, it's going to help." In April 2026: "Someone asked why can't you schedule a Trial Reel. And so we built it, and now you can." — quoted by [Kontentino (Oct 19, 2026)](https://www.kontentino.com/blog/does-scheduling-instagram-posts-hurt-reach/)
- **[Anecdote/vendor]** Kapwing case study: a trial reel reached 1M views. — [Kapwing](https://www.kapwing.com/resources/instagram-trial-reels-study-what-we-learned-after-a-trial-reel-hit-1-million-views/)

**Originality, watermarks and cross-posting**
- **[Official] (Apr 30, 2026):** originality rules extended from Reels to photos and carousels. Accounts that mainly post unoriginal content "will no longer be shown in places where we recommend content"; eligibility returns when most recent posts are original over a rolling 30-day window. Original means content you made or designed, or third-party content materially edited (new context, information or point of view). "Just adding a border, watermark, subtitles, or a credit in the captions" is insufficient. "75% of recommendations in the US now coming from original posts." — [Instagram Creators: Rewarding original creators](https://creators.instagram.com/blog/rewarding-original-creators-on-instagram)
- **[Official] (Apr 2024):** when identical copies exist, "We will only recommend the original one." — [Instagram Creators: Recommendations and originality](https://creators.instagram.com/recommendations-and-originality)
- **[Official, via secondary]** Since 2021, Reels carrying other apps' logos (e.g. a TikTok watermark) are made less discoverable — [Tubefilter, Feb 10, 2021](https://tubefilter.com/2021/02/10/instagram-reels-with-tiktok-watermark-less-discoverable/). Mosseri later clarified a creator's own logo is fine: "What we try to do is not recommend Reels with logos from other apps, but if it's your own logo, don't worry about it." (exact date not verified) — [Social Media Today](https://www.socialmediatoday.com/news/instagram-clarifies-including-your-own-logo-on-a-reel-is-ok/730852/)
- **[Official]** Instagram's Edits app is designed to "export without a watermark" (Jan 2025). — [Instagram Creators](https://creators.instagram.com/blog/the-latest-with-instagram?)

**Collabs**
- **[Official] API:** `collaborators` accepts up to 3 Instagram usernames on a Reel container. — [Meta: IG User Media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media)
- **[Data study] Emplifi (H1 2026; ~520K posts from 3,791 brand profiles):** collab posts outperform standard brand posts organically across industries, sizes and formats. Reels benefit most, and collabs drive more shares and reposts (correlational). — [Emplifi](https://emplifi.io/resources/instagram-collaborations-boost-organic-engagement/); [Social Media Today](https://www.socialmediatoday.com/news/report-highlights-the-value-of-creator-led-collabs-on-instagram/830619/)
- **[Secondary]** Later's 2025 Benchmark Report reportedly found collab posts got ~34% higher engagement and collab Reels ~48% higher (seen only via a DEV post). — [DEV Community](https://dev.to/synergistdigitalmedia/instagram-collabs-20-what-changed-and-why-you-should-actually-care-1e9h). Mechanics: a collab post appears to all collaborators' followers with combined metrics ([Sprout Social](https://sproutsocial.com/insights/instagram-collab-post/)).

**Profile optimization**
- **[Official]** "Use a fitting handle and profile name" related to your content, and "Include relevant keywords and locations in your bio." The username, profile name and bio are matched against search text. — [Instagram: How Instagram Search Works](https://about.instagram.com/blog/announcements/break-down-how-instagram-search-works/)
- **[Secondary/vendor blog]** Later says the name field carries similar search weight to the handle and is easier to change. — summarized from [Later: Instagram SEO](https://later.com/blog/instagram-seo/?link=button)

**Comments, engagement and Stories**
- **[Official, via secondary]** Earnest engagement in comments and DMs is endorsed and not considered bait (Jun 2024). — [Social Media Today](https://www.socialmediatoday.com/news/instagram-clarifies-advice-single-word-ctas-longer-reels/718151/)
- **[Official, via secondary]** Re-sharing feed posts to Stories "is not going to meaningfully change your reach overall"; Feed generally reaches more people than Stories (Mosseri, Apr 6, 2026). — [Social Media Today](https://www.socialmediatoday.com/news/instagram-chief-debunks-popular-engagement-hack/816781/)
- **[Data study]** Buffer excluded Stories from its frequency study because Stories are not typically shown to non-followers. — [Buffer](https://buffer.com/resources/how-often-to-post-on-instagram/)
- **[Data study]** Story replies rose 88% YoY (Metricool 2026), a follower-relationship signal. — [Metricool](https://metricool.com/press-release-instagram-study-2026/)
- **[Anecdote]** Adding location and hashtag stickers to Stories raised non-follower Story views from ~4% to 31% for one account (single blog case). — [Lilach Bullock](https://www.lilachbullock.com/share-instagram-story-reach-more-people/)

### Inferences
- **Day-1 setup:** switch to a public **Creator** (professional) account, which is needed for API publishing, Insights, Trial Reels eligibility and Google indexing. Use a name field with keywords, e.g. "Tech Simple Explained | Tech Explainers" (handle stays @tech.simple.explained). Write a bio stating the promise in search words ("Everyday tech explained in 60 seconds: Wi-Fi, phones, AI, privacy"). Check Account Status shows recommendation eligibility.
- **Before about 200 followers:** Trial Reels are probably unavailable (the API call may fail or be rejected for an ineligible account; untested). It matters little, because at roughly 0 followers almost every normal Reel already goes to non-followers. Trial Reels become valuable once there is a follower base to protect, e.g. for testing two hooks or titles of the same explainer, using `SS_PERFORMANCE` for hands-off graduation.
- **Cross-posting:** the creator owns the original animation, so publishing the *clean master file* (no TikTok/CapCut/YouTube watermark) to TikTok, YouTube Shorts and Facebook is consistent with Instagram's originality rules. Never upload a file downloaded from TikTok with its watermark. An own-brand logo is fine. Duplicate-content replacement applies to identical copies *on Instagram* posted by others; no evidence was found of a penalty for one's own simultaneous multi-platform uploads.
- **Collabs:** once one or two peer explainer accounts (tech, science, how-to) are found, co-publishing via `collaborators` (up to 3) gets a 0-follower account in front of their followers. It's probably the single biggest "borrowed audience" lever, but the data are from brands and correlational.
- **Stories:** low priority at 0 followers, since they are shown to followers. Once followers exist, use them for retention: polls on next topics, behind-the-scenes, resharing new Reels. Don't expect Stories to drive discovery (Mosseri, Apr 2026).
- **Comments:** reply to early comments with substantive answers. It is endorsed, and good comment threads can feed the comment and engagement signals. No study quantifies the effect.
- **Length:** keep explainers well under 3 minutes (eligibility). Retention signals favor short, tight cuts for a cold audience. Length strategy is covered elsewhere in this playbook.

### Gaps
- The official Help Center Trial Reels eligibility page could not be loaded (JS-rendered). The 200-follower threshold is secondary-sourced, and no source says whether the API enforces it or how it errors.
- No official statement describes how *brand-new* accounts (first posts) are treated differently, e.g. an initial test-audience size or a "probation" period. Instagram's statements are size-agnostic.
- No reliable 2026 data on highlights or pinned Reels as growth levers; no official statements found.
- No data on whether replying to comments boosts distribution.
- Cross-posting specifics for Threads (API, 1-tag limit), Facebook Reels (separate Page API) and YouTube Shorts were not researched in depth; only the watermark and originality rules were verified.

---

## 7. Does publishing via the API (vs. the native app) affect reach?

### Takeaway
No credible evidence of a reach penalty. Mosseri has said publicly, more than once (Mar 29, 2025 and Aug 28, 2026, reported secondhand), that scheduling or publishing through tools does not affect reach, including for Reels. The tests that exist are small and mostly run by vendors. The real API costs are feature gaps (section 8), not ranking.

### Cited Findings
- **[Official, via secondary] Mosseri, Mar 29, 2025 (Stories Q&A):** "No, if you use something like scheduled posts, it will not affect your reach one way or the other." — quoted by [Kontentino (Oct 19, 2026)](https://www.kontentino.com/blog/does-scheduling-instagram-posts-hurt-reach/)
- **[Official, via secondary] Mosseri, Aug 28, 2026 (Stories Q&A, about Reels):** "There's no difference in terms of your reach. You can schedule a Reel, or you can post it yourself." A Mar 19, 2026 Q&A clip, paraphrased, repeated that scheduling doesn't affect reach and said it gives Instagram time to process AI caption translations. — [Kontentino](https://www.kontentino.com/blog/does-scheduling-instagram-posts-hurt-reach/)
- **[Anecdote/vendor tests]** Kontentino's compilation of published tests (2011–2025) is mixed and mostly small-sample. The only Instagram test (2025, one account, 5 feed posts and 5 Stories per method) showed scheduled 8.19% engagement vs. 6.44% native, and reach 10,122 vs. 7,189. The article itself flags the small samples and vendor authorship. — [Kontentino](https://www.kontentino.com/blog/does-scheduling-instagram-posts-hurt-reach/)
- **[Secondary/vendor blog]** Scheduling vendors (Metricool, Planoly) reach the same conclusion; they have a commercial interest. — [Metricool](https://metricool.com/does-scheduling-social-media-posts-affect-reach/); [Planoly](https://www.planoly.com/blog/does-scheduling-your-posts-affect-your-post-reach)
- **[Secondary] Mechanism:** tools publish through Meta's official Content Publishing API (Reels added to the API in June 2022, Stories in mid-2023). The rate limit rose from 25 to 50 posts/day in 2023 and to 100/day in July 2025. Instagram's in-app scheduling (up to 75 days ahead) has been available to all public accounts since March 2026. — [Kontentino](https://www.kontentino.com/blog/does-scheduling-instagram-posts-hurt-reach/)

### Inferences
- Publishing via the API through the third-party connector is fine for ranking. Indirect effects come from what the API can't do: in-app licensed music in some setups, filters, stickers, adjusting the grid crop, and alt text on Reels. For a voiceover explainer, most of these matter little.
- Treat "native uploads get a boost" claims as anecdote unless Instagram says otherwise.

### Gaps
- I did not view Mosseri's original Q&A videos. Quotes and dates come from Kontentino's compilation (dates for some claims differ across vendor blogs).
- No large controlled study of API vs. native Reels reach exists.

---

## 8. API limitations to know: music, cover images, share to feed, and others

### Takeaway
Via the Graph API you *can* set the caption (≤2,200 chars), a cover image or frame, share-to-feed, up to 3 collaborators, user tags, location, Trial Reel parameters, a custom name for the original audio, and, through the Audio API, attach music authorized for third-party use. That last one requires Facebook Login or Unified Login and a Page-linked professional account; it is not available with "Instagram Login." You *cannot* use filters, shopping tags, Reels alt text, or in-app stickers and effects. Whether the third-party connector exposes these fields is a separate question.

### Cited Findings
- **[Official] Reels parameters** (IG User Media reference): `media_type=REELS`; `video_url` or resumable `upload_type`; `caption` (max 2,200 chars, 30 hashtags, 20 @mentions; the hashtag figure is superseded by the 5-tag product cap, section 2); `share_to_feed` (`true` = Feed + Reels, `false` = Reels only; "Neither setting guarantees placement in the Reels tab"); `cover_url` (public JPEG, ≤8 MB, sRGB, 9:16 recommended, overrides `thumb_offset`); `thumb_offset` (ms, default 0); `audio_name` (renames the Reel's original audio, only once); `collaborators` (≤3); `location_id`; `user_tags`; `trial_params`; `alt_text` not supported for Reels. Music: "Music tagging is only available for original audio." Reels cannot be in carousels. — [Meta: IG User Media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media)
- **[Official] Video specs:** MOV/MP4 (moov atom at front, no edit lists); H.264 or HEVC, progressive, closed GOP, 4:2:0; max width 1920 px; 23–60 fps; aspect ratio 0.01:1–10:1, "we recommend 9:16"; ≤25 Mbps video; AAC ≤48 kHz, 128 kbps; duration **3 s–15 min**; ≤300 MB. — [Meta: IG User Media reference](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media)
- **[Official] General limits:** "Shopping tags are not supported." "Filters are not supported." "Instagram accounts are limited to 100 API-published posts within a 24-hour moving period" (the carousel section still says 50; the page doesn't reconcile them). Reels are returned with `media_type=VIDEO` and `media_product_type=REELS`. — [Meta: Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- **[Official] Audio API:** search audio (`GET /ig_audio`, `audio_type` = `original_sound` or `music`), then attach at creation via `audio_configuration` {`audio_id`, `audio_volume` 1–100, `video_volume` 1–100}. It "returns audio that has been authorized for third party use", and "the available selection may vary from what appears in the native app." It requires an Instagram Business or Creator account connected to a Facebook Page, plus `instagram_basic` and `instagram_content_publish`. It is supported on the Instagram API with Facebook Login and with Unified Login, and "not supported on the Instagram API with Instagram Login." There is no preview of a Reel with attached audio. No regional limits are stated; the examples use v22.0. — [Meta: Instagram Audio API](https://developers.facebook.com/documentation/instagram-platform/content-publishing/audio-api)
- **[Secondary/vendor] Tool support varies:** Sked Social and Statusbrew say third-party schedulers can't add licensed music. That is likely outdated or tool-specific given the Audio API. Ayrshare documents an `audioConfiguration` option (Facebook Login required). Metricool says the API allows only a cover image or frame and no grid-crop repositioning, and that all single videos publish as Reels. — [Sked Social help](https://help.skedsocial.com/en/articles/9337203-how-music-on-instagram-works-with-sked-social); [Statusbrew](https://statusbrew.com/insights/adding-trending-audio-to-scheduled-content); [Ayrshare docs](https://www.ayrshare.com/docs/apis/post/social-networks/instagram); [Metricool help: API limitations](https://help.metricool.com/api-limitations-per-social-network-n7zlr.md)
- **[Official] Audio and reach:** "Adding audio can help reels... reach more people" (Feb 2025). — [Instagram Creators](https://creators.instagram.com/blog/helping-creators-of-all-sizes-break-through)
- **[Official] Trial Reels graduation:** `MANUAL` graduation happens "in the native Instagram app"; `SS_PERFORMANCE` is automatic. — [Meta: Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/)

### Inferences
- **Cover:** always send a designed 9:16 `cover_url` JPEG with a large, readable title (the topic keyword). Keep key text in the central area, because the profile grid crops covers and the API can't adjust the grid crop (Metricool).
- **Share to feed:** set `share_to_feed=true` so Reels populate the profile grid and Feed. Instagram says neither value guarantees Reels-tab placement.
- **Audio:** the TTS voiceover becomes "original audio." Use `audio_name` once to give it a descriptive, searchable name, e.g. "How Wi-Fi works – Tech Simple Explained". If the connector supports `audio_configuration` (and the account is linked via Facebook Login or Unified Login to a Page), quiet licensed background music (e.g. `audio_volume` 10–20, `video_volume` 100) is technically possible. Check whether the connector exposes it. Choosing a Creator account (rather than Business) is a reasonable hedge for music access, but nothing I retrieved documents a difference via the API (see Gaps).
- **Timing:** schedule the API publish for the chosen German-time slot (section 5). The 100-posts-per-24h cap is irrelevant at this cadence.
- **What to do in-app if needed:** graduate `MANUAL` trials, add a Reel to a Highlight or pin it to the profile, reply to comments. None of these are needed for publishing.

### Gaps
- Not verified: whether the third-party connector exposes `cover_url`, `share_to_feed`, `collaborators`, `trial_params`, `audio_name` or `audio_configuration`. Check against the connector's documentation.
- Undocumented: how the 5-hashtag cap is enforced on API captions.
- Undocumented: whether Audio API music selection differs between Creator and Business accounts, or by region (Germany-based account, English audience).
- Undocumented: whether Trial Reel eligibility (≈200 followers) is enforced for API calls and what error is returned.
- Pinning Reels to the profile via API: no documentation found.
