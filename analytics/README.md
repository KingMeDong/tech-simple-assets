# Analytics

How we measure every Reel (CLAUDE.md section 7). Aggregated numbers only:
never usernames or comment texts in this public repo.

## When

| What | When | Who / where |
|---|---|---|
| Follower snapshot | every day, in the 17:31 publish run | `followers.csv` (Instagram gives no follower history, so we must snapshot it ourselves) |
| **72 h pull** | in the publish run **3 days** after a Reel went live (age ≈ 71.5 h, same for every Reel) | `metrics.csv`, label `72h`; the result vs. our median goes into the daily status message |
| **7 d pull** | in the publish run **7 days** after (age ≈ 167.5 h) | `metrics.csv`, label `7d` |
| **Report** | every second Monday in the batch run, first on **Mon 2026-12-07** | `reports/<date>.md`; its decisions feed the next topics and experiments |
| Retention curves, Account Status | weekly, by the owner in the app (section 8) | screenshots to Claude; not available via the API |

## How

Windsor `get_data`, connector `instagram`, with `date_from`/`date_to`
covering the Reel's publish date (media rows are selected by publish date).
Fields (checked with `get_fields` on 2026-11-22):

| Column in `metrics.csv` | Windsor field |
|---|---|
| reach | `media_reach` |
| views | `media_views` |
| shares | `media_shares` |
| saves | `media_saved` |
| likes | `media_like_count` (`media_total_like_count` returns null on our login type) |
| comments | `media_comments_count` |
| avg_watch_ms | `media_reel_avg_watch_time` |
| total_watch_ms | `media_reel_total_watch_time` |
| skip_rate_raw | `media_reel_skip_rate` (fraction: 0.466 = 46.6% skipped in the first 3 s; confirm once against the in-app value) |
| data_fetched_at_utc | `data_fetched_at` (our trial plan has no `force_refresh`, so this shows how fresh the cached row is) |

Not available with Instagram login: `media_reposts`, and for Reels
`media_follows` / `media_profile_visits`. Follows per Reel are therefore
estimated from the follower change between publishes (`followers.csv`).

Followers: `followers_count` and `media_count` (today only).

## KPIs

`python3 analytics/report.py --latest` (one line for the status message) and
`--write` (full report). Computed per Reel and compared with the rolling
median of the last 10 Reels at the same pull label:

- **Shares ÷ reach (main KPI)**, saves ÷ reach, likes ÷ reach, comments ÷ reach
- Views ÷ reach (replays), average watch time (s and % of length)
- Skip rate (hook quality; lower is better)
- Experiment variables from `publishing-log.md` (hook type, CTA type,
  weekday, music): listed from the first Reel, interpreted only with ≥ 6 Reels
  per variant.
