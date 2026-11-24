"""Build the owner's YouTube scheduling page (CLAUDE.md section 4, "YouTube").

Since 2026-11-24 the owner schedules every Short by hand in YouTube Studio
(Visibility -> Schedule, 18:00 German time). This script lists every Reel that
docs/schedule.md marks `ready`, with its slot, title and description from
youtube.txt and the jsDelivr video URL pinned to the ready commit (the same file
Instagram gets). Claude publishes the output as the owner's "YouTube-Plan"
artifact (same URL every time) after each batch.

Usage: python3 tools/youtube_plan.py <out.html>
"""
import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = "KingMeDong/tech-simple-assets"
WD = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]


def git(*a):
    return subprocess.run(["git", *a], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()


def ready_rows():
    for ln in (ROOT / "docs/schedule.md").read_text().splitlines():
        if not ln.startswith("| "):
            continue
        c = [x.strip() for x in ln.strip("|").split("|")]
        if len(c) < 5 or c[3] != "ready":
            continue
        m = re.search(r"\b([0-9a-f]{7,40})\b", c[4])
        d = re.search(r"\d{4}-\d{2}-\d{2}", c[0])
        if m and d:
            yield d.group(0), c[1], git("rev-parse", m.group(1))


def items():
    out = []
    for date, reel, commit in ready_rows():
        t = git("show", f"{commit}:reels/{reel}/youtube.txt")
        title = re.search(r"TITLE:\n(.*?)\n\n", t, re.S).group(1).strip()
        desc = re.search(r"DESCRIPTION:\n(.*?)\n\nVIDEO FILE", t, re.S).group(1).strip()
        size = int(git("cat-file", "-s", f"{commit}:reels/{reel}/video.mp4"))
        day = dt.date.fromisoformat(date)
        out.append({
            "id": reel[:3], "reel": reel, "day": WD[day.weekday()], "date": f"{day.day}.{day.month}.",
            "iso": date, "title": title, "desc": desc,
            "url": f"https://cdn.jsdelivr.net/gh/{REPO}@{commit}/reels/{reel}/video.mp4",
            "mb": f"{size / 1e6:.1f}".replace(".", ","),
        })
    return sorted(out, key=lambda x: x["iso"])


PAGE = r"""<title>YouTube-Plan</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&family=JetBrains+Mono:wght@400&display=swap">
<style>
/* Layout: a single column of upload cards, one per slot, in publishing order; the how-to sits on top. */
:root {
  --bg: #eef1f6; --surface: #ffffff; --ink: #14213d; --muted: #5f6b80; --line: #d6dce7;
  --accent: #e8571f; --accent-ink: #ffffff; --ok: #1f8a5b; --ok-bg: #e3f4ec; --chip: #e4e9f2;
  --font-display: "Space Grotesk", "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0d1424; --surface: #151f35; --ink: #e8edf7; --muted: #9aa6bd; --line: #26324c;
  --accent: #ff7a45; --accent-ink: #1a0d05; --ok: #4cc98f; --ok-bg: #12321f; --chip: #1f2b45; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #0d1424; --surface: #151f35; --ink: #e8edf7; --muted: #9aa6bd; --line: #26324c;
  --accent: #ff7a45; --accent-ink: #1a0d05; --ok: #4cc98f; --ok-bg: #12321f; --chip: #1f2b45; color-scheme: dark }
body { background: var(--bg); color: var(--ink); font-family: var(--font-body); font-size: 15px; line-height: 1.5; }
.wrap { max-width: 720px; margin: 0 auto; padding-block: 28px 56px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: flex; flex-direction: column; gap: 20px; }
header h1 { font-family: var(--font-display); font-weight: 600; font-size: 1.9rem; line-height: 1.15; margin: 0; text-wrap: balance; }
header p { margin: 6px 0 0; color: var(--muted); }
.howto { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; }
.howto h2 { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; margin: 0 0 8px; }
.howto ol { margin: 0; padding-left: 1.3em; display: grid; gap: 4px; }
.howto b { font-weight: 600; }
.progress { font-size: .9rem; color: var(--muted); font-variant-numeric: tabular-nums; }
.list { display: flex; flex-direction: column; gap: 14px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px;
  display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.card.done { border-color: var(--ok); }
.top { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; }
.when { font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
.chip { background: var(--chip); color: var(--muted); border-radius: 999px; padding: 2px 10px; font-size: .78rem; letter-spacing: .02em; }
.status { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font-size: .88rem; color: var(--muted); cursor: pointer; }
.status input { width: 18px; height: 18px; accent-color: var(--ok); }
.card.done .status { color: var(--ok); font-weight: 500; }
.field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.label { display: flex; align-items: baseline; justify-content: space-between; gap: 8px;
  font-size: .74rem; text-transform: uppercase; letter-spacing: .07em; color: var(--muted); }
.label span { text-transform: none; letter-spacing: 0; font-variant-numeric: tabular-nums; }
.title { font-weight: 600; font-size: 1.05rem; overflow-wrap: anywhere; }
pre.desc { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font-family: var(--font-mono); font-size: .8rem; line-height: 1.55;
  background: var(--bg); border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; max-height: 14em; overflow: auto; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
button, a.btn { font: inherit; font-size: .9rem; font-weight: 500; border-radius: 8px; padding: 8px 14px; cursor: pointer;
  border: 1px solid var(--line); background: var(--surface); color: var(--ink); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
a.btn.primary { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
button.copied { border-color: var(--ok); color: var(--ok); }
button:focus-visible, a.btn:focus-visible, .status input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
footer { color: var(--muted); font-size: .85rem; }
@media (prefers-reduced-motion: no-preference) { .card { transition: border-color .2s; } }
</style>

<div class="wrap">
  <header>
    <h1>YouTube-Plan</h1>
    <p>tech.simple.explained · die nächsten Shorts zum Einplanen, jeweils 18:00 deutscher Zeit, gleichzeitig mit Instagram.</p>
  </header>

  <section class="howto" aria-labelledby="howto-h">
    <h2 id="howto-h">So planst du ein Short ein</h2>
    <ol>
      <li><b>Video öffnen</b> und auf dem Gerät speichern (im Browser: Teilen bzw. ⋮ → Herunterladen).</li>
      <li>In YouTube Studio oder der YouTube-App hochladen.</li>
      <li><b>Titel</b> und <b>Beschreibung</b> hier kopieren und einfügen.</li>
      <li>Zielgruppe: <b>Nein, nicht speziell für Kinder</b>. Veränderte oder synthetische Inhalte: <b>Nein</b>. Kategorie: <b>Wissenschaft &amp; Technik</b>.</li>
      <li>Sichtbarkeit → <b>Planen</b> → Datum und <b>18:00</b> wählen, Zeitzone Berlin prüfen.</li>
      <li>Hier abhaken. Den YouTube-Link trage ich nach 18:00 selbst ins Log ein.</li>
    </ol>
  </section>

  <div class="progress" id="progress" aria-live="polite"></div>
  <div class="list" id="list"></div>

  <footer>Die Video-Links zeigen genau die Version, die auch auf Instagram läuft. Sie funktionieren auch nach dem Posten weiter. Häkchen speichert nur dein Browser.</footer>
</div>

<script>
const ITEMS = __DATA__;
const KEY = "yt-plan-done-v1";
let done = {};
try { done = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { done = {}; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }

function el(tag, attrs = {}, kids = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") n.className = v; else if (k === "text") n.textContent = v; else n.setAttribute(k, v);
  }
  for (const k of [].concat(kids)) n.append(k);
  return n;
}

async function copy(text, btn, node) {
  const label = btn.dataset.label;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Kopiert ✓"; btn.classList.add("copied");
  } catch (e) {
    const r = document.createRange(); r.selectNodeContents(node);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    btn.textContent = "Markiert, jetzt kopieren";
  }
  setTimeout(() => { btn.textContent = label; btn.classList.remove("copied"); }, 1800);
}

function progress() {
  const n = ITEMS.filter(i => done[i.id]).length;
  document.getElementById("progress").textContent = `${n} von ${ITEMS.length} eingeplant`;
}

const list = document.getElementById("list");
for (const it of ITEMS) {
  const titleNode = el("div", { class: "title", text: it.title });
  const descNode = el("pre", { class: "desc", text: it.desc });
  const bT = el("button", { type: "button", text: "Titel kopieren", "data-label": "Titel kopieren" });
  const bD = el("button", { type: "button", text: "Beschreibung kopieren", "data-label": "Beschreibung kopieren" });
  bT.addEventListener("click", () => copy(it.title, bT, titleNode));
  bD.addEventListener("click", () => copy(it.desc, bD, descNode));
  const cb = el("input", { type: "checkbox", id: "done-" + it.id });
  cb.checked = !!done[it.id];
  const card = el("article", { class: "card" + (cb.checked ? " done" : ""), "aria-label": `${it.day} ${it.date}: ${it.title}` }, [
    el("div", { class: "top" }, [
      el("span", { class: "when", text: `${it.day} ${it.date} · 18:00` }),
      el("span", { class: "chip", text: "Reel " + it.id }),
      el("label", { class: "status", for: "done-" + it.id }, [cb, el("span", { text: "eingeplant" })]),
    ]),
    el("div", { class: "field" }, [el("div", { class: "label" }, ["Titel", el("span", { text: `${it.title.length}/100 Zeichen` })]), titleNode]),
    el("div", { class: "field" }, [el("div", { class: "label", text: "Beschreibung" }), descNode]),
    el("div", { class: "actions" }, [
      el("a", { class: "btn primary", href: it.url, target: "_blank", rel: "noopener", text: `Video öffnen (${it.mb} MB)` }),
      bT, bD,
    ]),
  ]);
  cb.addEventListener("change", () => { done[it.id] = cb.checked; card.classList.toggle("done", cb.checked); save(); progress(); });
  list.append(card);
}
progress();
</script>
"""

if __name__ == "__main__":
    its = items()
    data = json.dumps(its, ensure_ascii=False).replace("</", "<\\/")
    Path(sys.argv[1]).write_text(PAGE.replace("__DATA__", data))
    for i in its:
        print(i["day"], i["date"], i["reel"], i["url"])
