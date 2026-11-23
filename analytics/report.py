"""Analytics for @tech.simple.explained (CLAUDE.md section 7).

Inputs (all in analytics/):
  publishing-log.md   one row per published Reel with its experiment variables
  metrics.csv         one row per metrics pull (72h / 7d / snapshot), from Windsor get_data
  followers.csv       one follower snapshot per day (followers_count has no history)

Usage:
  python3 analytics/report.py --latest            short text for the daily status message
  python3 analytics/report.py --write [--label 72h]  writes analytics/reports/<date>.md

KPIs are judged against our own rolling median (last 10 Reels, same pull label),
never against vendor benchmarks. Variable comparisons need >= 6 Reels per variant.
"""
import argparse
import csv
import datetime as dt
import re
import statistics
from pathlib import Path

A = Path(__file__).parent
WINDOW = 10
MIN_N = 6


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def load_log():
    rows = {}
    lines = (A / "publishing-log.md").read_text().splitlines()
    header = None
    for ln in lines:
        if not ln.startswith("|"):
            continue
        cells = [c.strip() for c in ln.strip("|").split("|")]
        if header is None:
            header = cells
            continue
        if set(ln.replace("|", "").strip()) <= set("-: "):
            continue
        r = dict(zip(header, cells))
        reel = r.get("Reel", "")
        if not reel:
            continue
        m = re.search(r"(\d+)\s*s", r.get("Length", ""))
        r["length_s"] = float(m.group(1)) if m else None
        r["weekday"] = r.get("Weekday / slot", "").split("/")[0].strip()
        rows[reel] = r
    return rows


def load_metrics():
    p = A / "metrics.csv"
    if not p.exists():
        return []
    with p.open() as f:
        return list(csv.DictReader(f))


def kpis(m, length_s):
    reach = num(m["reach"]) or 0
    def per_reach(k):
        v = num(m.get(k))
        return v / reach if reach and v is not None else None
    avg_s = (num(m.get("avg_watch_ms")) or 0) / 1000 or None
    skip = num(m.get("skip_rate_raw"))
    return {
        "reach": reach or None,
        "share_rate": per_reach("shares"),          # main KPI (proxy for sends)
        "save_rate": per_reach("saves"),
        "like_rate": per_reach("likes"),
        "comment_rate": per_reach("comments"),
        "views_per_reach": per_reach("views"),      # replays
        "avg_watch_s": avg_s,
        "watch_pct": (avg_s / length_s) if (avg_s and length_s) else None,
        # Windsor returns skip rate as a fraction (0.466 = 46.6%); confirm against the in-app value.
        "skip_rate": (skip if skip is not None and skip > 1 else skip * 100) if skip is not None else None,
    }


FMT = {
    "reach": ("Reach", "{:.0f}", True), "share_rate": ("Shares/reach", "{:.2%}", True),
    "save_rate": ("Saves/reach", "{:.2%}", True), "like_rate": ("Likes/reach", "{:.2%}", True),
    "comment_rate": ("Comments/reach", "{:.2%}", True), "views_per_reach": ("Views/reach", "{:.2f}", True),
    "avg_watch_s": ("Avg watch (s)", "{:.1f}", True), "watch_pct": ("Avg watch %", "{:.0%}", True),
    "skip_rate": ("Skip rate", "{:.1f}%", False),
}


def fmt(k, v):
    return "–" if v is None else FMT[k][1].format(v)


def table(label):
    log, mets = load_log(), load_metrics()
    out = []
    for m in mets:
        if m["label"] != label or m["reel"] not in log:
            continue
        r = log[m["reel"]]
        out.append({"reel": m["reel"], "log": r, "k": kpis(m, r["length_s"]), "pulled": m["pulled_at_utc"]})
    out.sort(key=lambda x: x["reel"])
    return out


def median_of(rows, k):
    vals = [r["k"][k] for r in rows[-WINDOW:] if r["k"][k] is not None]
    return statistics.median(vals) if vals else None


def arrow(k, v, med):
    if v is None or med is None or med == 0:
        return ""
    better = (v > med) if FMT[k][2] else (v < med)
    return " ▲" if better else (" ▼" if v != med else "")


def latest_text(label="72h"):
    rows = table(label)
    if not rows:
        return "Noch keine 72-h-Daten."
    last = rows[-1]
    prev = rows[:-1]
    parts = []
    for k in ("reach", "share_rate", "save_rate", "avg_watch_s", "skip_rate"):
        med = median_of(prev, k) if prev else None
        parts.append(f"{FMT[k][0]} {fmt(k, last['k'][k])}" + (f" (Median {fmt(k, med)}{arrow(k, last['k'][k], med)})" if med is not None else ""))
    return f"{last['reel']} nach {label}: " + " · ".join(parts)


def followers_series():
    p = A / "followers.csv"
    if not p.exists():
        return []
    with p.open() as f:
        return list(csv.DictReader(f))


def write_report(label="72h"):
    rows = table(label)
    today = dt.date.today().isoformat()
    L = [f"# Report {today}", "",
         f"Pull label: **{label}** · Reels with data: **{len(rows)}** · Benchmarks: our rolling median "
         f"(last {WINDOW} Reels). Variable comparisons need ≥ {MIN_N} Reels per variant; below that they are "
         "listed but not interpreted.", ""]
    keys = list(FMT)
    L.append("## Per Reel")
    L.append("")
    L.append("| Reel | " + " | ".join(FMT[k][0] for k in keys) + " |")
    L.append("|---|" + "---|" * len(keys))
    for i, r in enumerate(rows):
        prev = rows[max(0, i - WINDOW):i]
        L.append(f"| {r['reel']} | " + " | ".join(
            fmt(k, r["k"][k]) + (arrow(k, r["k"][k], median_of(prev, k)) if prev else "") for k in keys) + " |")
    L.append("")
    L.append("**Rolling median:** " + " · ".join(f"{FMT[k][0]} {fmt(k, median_of(rows, k))}" for k in keys))
    L.append("")
    if rows:
        best = max(rows, key=lambda r: r["k"]["share_rate"] or -1)
        worst = min(rows, key=lambda r: r["k"]["skip_rate"] if r["k"]["skip_rate"] is not None else 1e9)
        L.append(f"- Highest shares/reach: **{best['reel']}** ({fmt('share_rate', best['k']['share_rate'])}).")
        L.append(f"- Lowest skip rate (best hook): **{worst['reel']}** ({fmt('skip_rate', worst['k']['skip_rate'])}).")
        L.append("")
    L.append("## Variables (experiments)")
    L.append("")
    for var in ("Hook type", "CTA type", "weekday", "Music"):
        groups = {}
        for r in rows:
            groups.setdefault(r["log"].get(var, "?") or "?", []).append(r)
        L.append(f"**{var}:** " + " · ".join(
            f"{g} (n={len(v)}{'' if len(v) >= MIN_N else ', too few'}): shares/reach "
            f"{fmt('share_rate', statistics.median([x['k']['share_rate'] for x in v if x['k']['share_rate'] is not None] or [0]))}, "
            f"skip {fmt('skip_rate', statistics.median([x['k']['skip_rate'] for x in v if x['k']['skip_rate'] is not None] or [0]))}"
            for g, v in sorted(groups.items())))
        L.append("")
    fs = followers_series()
    if fs:
        L.append("## Followers")
        L.append("")
        L.append(f"{fs[0]['date_utc']}: {fs[0]['followers']} → {fs[-1]['date_utc']}: {fs[-1]['followers']} "
                 f"({int(fs[-1]['followers']) - int(fs[0]['followers']):+d}).")
        L.append("")
    L += ["## Decisions", "", "_Filled in by Claude: what we keep, change or test next, and why._", ""]
    out = A / "reports" / f"{today}.md"
    out.parent.mkdir(exist_ok=True)
    out.write_text("\n".join(L))
    print("wrote", out)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--latest", action="store_true")
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--label", default="72h")
    a = ap.parse_args()
    if a.latest:
        print(latest_text(a.label))
    if a.write:
        write_report(a.label)
