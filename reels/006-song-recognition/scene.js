// Reel 006 — How a song-recognition app works (Wang 2003, Shazam's published algorithm).
// SCENE(t, T) returns {top, svg, html, glow, noCaptions, topO} for time t.

// ---------- deterministic "music" spectrogram ----------
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const NC = 40, NR = 22, CS = 21;            // columns (time), rows (pitch), cell size px
const X0 = 120, Y0 = 560;                    // top-left of the spectrogram
const SPEC = (() => {
  const rnd = mulberry32(6);
  const v = [];
  let notes = [];
  for (let c = 0; c < NC; c++) {
    if (c % 4 === 0) {                        // a new chord every 4 columns
      notes = [];
      const n = 1 + Math.floor(rnd() * 2);
      for (let i = 0; i < n; i++) notes.push({ r: 1 + Math.floor(rnd() * 7), a: 0.75 + rnd() * 0.25 });
    }
    const col = [];
    for (let r = 0; r < NR; r++) {
      let e = rnd() * 0.22;                   // noise floor
      for (const nt of notes) for (const [h, k] of [[0, 1], [5, 0.75], [9, 0.55], [12, 0.4], [14, 0.3]]) {
        const d = Math.abs(r - (nt.r + h));
        if (d < 1.5) e += nt.a * k * (d < 0.5 ? 1 : 0.35) * (0.8 + 0.2 * Math.sin(c * 1.3 + h));
      }
      if (c % 8 === 2) e += 0.25 * rnd();     // drum hit: broadband
      col.push(Math.min(1, e));
    }
    v.push(col);
  }
  return v;
})();
const PEAKS = (() => {                        // local maxima in a 5x5 window, loud enough
  const p = [];
  for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) {
    const e = SPEC[c][r];
    if (e < 0.55) continue;
    let max = true;
    for (let dc = -2; dc <= 2 && max; dc++) for (let dr = -2; dr <= 2; dr++) {
      const cc = c + dc, rr = r + dr;
      if ((dc || dr) && cc >= 0 && cc < NC && rr >= 0 && rr < NR && SPEC[cc][rr] >= e) { max = false; break; }
    }
    if (max) p.push({ c, r, e });
  }
  return p;
})();
const ISPEAK = new Set(PEAKS.map(p => p.c * 100 + p.r));
const cx = c => X0 + (c + 0.5) * CS, cy = r => Y0 + (NR - 1 - r + 0.5) * CS;

const BUCKETS = [[0.18, "#16264A"], [0.32, "#1F3D73"], [0.46, "#2E62A8"], [0.6, "#3D9BFF"], [0.75, "#FF8F5E"], [2, "#FFE6CF"]];
const SPATH = {};
function specPaths(ncols, peaksToo) {     // one path per colour bucket, cached
  const key = ncols + "|" + peaksToo;
  if (SPATH[key]) return SPATH[key];
  const d = BUCKETS.map(() => "");
  for (let c = 0; c < ncols; c++) for (let r = 0; r < NR; r++) {
    if (!peaksToo && ISPEAK.has(c * 100 + r)) continue;
    const e = SPEC[c][r];
    const b = BUCKETS.findIndex(([lim]) => e < lim);
    d[b] += `M${X0 + c * CS} ${Y0 + (NR - 1 - r) * CS}h${CS - 1}v${CS - 1}h${-(CS - 1)}z`;
  }
  return (SPATH[key] = d.map((p, i) => p ? `<path d="${p}" fill="${BUCKETS[i][1]}"/>` : "").join(""));
}
function specFrame(o = 1) {
  return `<rect x="${X0 - 8}" y="${Y0 - 8}" width="${NC * CS + 15}" height="${NR * CS + 15}" rx="14" fill="${C.bg}" stroke="${C.line}" stroke-width="3" opacity="${o}"/>`;
}
function axes(o = 1) {
  return `<g opacity="${o}"><text x="${X0 + NC * CS}" y="${Y0 + NR * CS + 46}" text-anchor="end" class="svgt" style="font-size:32px" fill="${C.muted}">time →</text>
    <text x="0" y="0" transform="translate(${X0 - 22} ${Y0 + NR * CS}) rotate(-90)" class="svgt" style="font-size:32px" fill="${C.muted}">pitch →</text></g>`;
}
function spectrogram(ncols, fade = 0, o = 1) {   // fade: 0 full picture … 1 only peaks left
  let s = specFrame(o);
  s += `<g opacity="${o * (1 - 0.94 * fade)}">${specPaths(ncols, fade === 0)}</g>`;
  if (fade > 0) s += `<g opacity="${o}">${specPeakCells(ncols)}</g>`;
  return s;
}
function specPeakCells(ncols) {
  return PEAKS.filter(p => p.c < ncols).map(p => `<rect x="${X0 + p.c * CS}" y="${Y0 + (NR - 1 - p.r) * CS}" width="${CS - 1}" height="${CS - 1}" fill="#FFE6CF"/>`).join("");
}
function star(x, y, k = 1, color = C.ink, glow = C.accent) {
  return `<circle cx="${x}" cy="${y}" r="${18 * k}" fill="${glow}" opacity="${0.28 * k}"/><circle cx="${x}" cy="${y}" r="${7 * k}" fill="${color}"/>`;
}
function stars(t0, t, o = 1, dim = null) {
  return PEAKS.map((p, i) => {
    const k = ease.back(prog(t, t0 + (p.c / NC) * 0.6, t0 + (p.c / NC) * 0.6 + 0.35));
    return `<g opacity="${o * (dim && dim(p) ? 0.3 : 1)}">${star(cx(p.c), cy(p.r), k)}</g>`;
  }).join("");
}

// ---------- fingerprints: anchor + target zone ----------
const ANCHORS = (() => {
  const out = [];
  for (const want of [7, 17, 27]) {
    const a = PEAKS.filter(p => p.c >= want && p.c <= want + 4).sort((x, y) => y.e - x.e)[0];
    if (!a) continue;
    const targets = PEAKS.filter(p => p.c > a.c + 1 && p.c <= a.c + 8 && Math.abs(p.r - a.r) <= 6).slice(0, 3);
    out.push({ a, targets });
  }
  return out;
})();
function zone(a, k) {
  const x = cx(a.c + 1.5), y = cy(Math.min(NR - 1, a.r + 6)) - CS / 2, w = 7 * CS, h = 13 * CS;
  return `<rect x="${x}" y="${y}" width="${w * k}" height="${h}" rx="10" fill="${C.blue}" opacity="0.10" stroke="${C.blue}" stroke-width="3" stroke-dasharray="10 8"/>`;
}
function pairLine(a, b, k, color = C.accent) {
  const x1 = cx(a.c), y1 = cy(a.r), x2 = cx(b.c), y2 = cy(b.r);
  return `<line x1="${x1}" y1="${y1}" x2="${lerp(x1, x2, k)}" y2="${lerp(y1, y2, k)}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
}

// ---------- small pieces ----------
const okBadge = (k, r = 40) => badge(check(C.bg, k), C.green, r);
function tag(text, color = C.accent, w = 150) {
  return `<rect x="${-w / 2}" y="-26" width="${w}" height="52" rx="26" fill="${C.bg2}" stroke="${color}" stroke-width="4"/>
    <text x="0" y="12" text-anchor="middle" class="svgt" style="font-size:30px;font-family:Inter;font-weight:800" fill="${color}">${text}</text>`;
}
function note(color = C.ink) { // a simple eighth note, ~60 px high, centred
  return `<ellipse cx="-10" cy="22" rx="15" ry="11" fill="${color}" transform="rotate(-20 -10 22)"/>
    <rect x="2" y="-30" width="7" height="54" fill="${color}"/>
    <path d="M 9 -30 Q 30 -18 24 4 Q 22 -10 9 -12 Z" fill="${color}"/>`;
}
function speaker(color = C.muted) {
  return `<rect x="-46" y="-80" width="92" height="160" rx="18" fill="${C.bg2}" stroke="${color}" stroke-width="7"/>
    <circle cx="0" cy="22" r="30" fill="none" stroke="${color}" stroke-width="7"/><circle cx="0" cy="22" r="8" fill="${color}"/>
    <circle cx="0" cy="-44" r="14" fill="none" stroke="${color}" stroke-width="6"/>`;
}
function resultCard(k, label = "Song found") { // on the phone screen, centred at 0,0
  return g(`<rect x="-78" y="-46" width="156" height="92" rx="16" fill="${C.green}"/>
    ${g(note(C.bg), { x: -42, y: -2, s: 0.55 })}
    <text x="18" y="-6" text-anchor="middle" class="svgt" style="font-size:22px" fill="${C.bg}">${label.split(" ")[0]}</text>
    <text x="18" y="22" text-anchor="middle" class="svgt" style="font-size:22px" fill="${C.bg}">${label.split(" ")[1]}</text>`, { s: lerp(0.6, 1, ease.back(k)), o: clamp(k * 3) });
}
function plane(color = C.ink) {
  return `<path d="M -50 6 L 52 -40 L 22 46 L 4 18 Z" fill="${color}"/><path d="M 4 18 L 52 -40 L -6 30 Z" fill="${C.muted}"/>`;
}

const HOOK_TOP = () => headline(`How does an app recognise a song <span style="white-space:nowrap">${hi("in seconds?")}</span>`, 84);

function SCENE(t, T) {
  // ---------------- Hook: a phone listens, a song is found ----------------
  if (t < T.start("twist")) {
    const found = 1.9;
    const notes = [0, 1, 2, 3].map(i => {
      const k = ((t * 0.55) + i / 4) % 1;
      return g(note(C.accent), { x: lerp(760, 420, k), y: 760 + 60 * Math.sin((k + i) * 5), s: 0.8, o: Math.min(1, k * 5, (1 - k) * 5) });
    }).join("");
    const ph = phone({ glow: t > found ? C.green : null, content: t > found ? resultCard(prog(t, found, found + 0.35)) : g(rings(t, 1.0, C.blue, 20, 80), {}) });
    return {
      top: HOOK_TOP(),
      svg: g(speaker(), { x: 860, y: 800 }) + notes + g(ph, { x: 300, y: 800, s: 1 }) +
        (t > found ? g(okBadge(prog(t, found + 0.2, found + 0.5)), { x: 420, y: 600, s: appear(t, found + 0.15) }) : ""),
      glow: C.accent,
    };
  }

  // ---------------- Twist: almost all of it is thrown away ----------------
  if (t < T.start("s1")) {
    const a = T.start("twist");
    const show = ease.out(prog(t, a, a + 0.5));
    const thr = T.word("twist", "throws");
    const fade = ease.inOut(prog(t, thr, thr + 1.2));
    return {
      top: HOOK_TOP(),
      svg: spectrogram(NC, fade, show) + (fade > 0.3 ? stars(thr + 0.6, t, 1) : "") +
        g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:40px" fill="${C.accent}">kept: only the peaks</text>`,
          { x: 540, y: Y0 + NR * CS + 52, o: prog(t, thr + 1.0, thr + 1.4) }),
      glow: C.accent,
    };
  }

  // ---------------- Step 1: the spectrogram ----------------
  if (t < T.start("s2")) {
    const a = T.start("s1");
    const spec = T.word("s1", "spectrogram");
    const cols = Math.round(NC * clamp(prog(t, a + 0.3, spec + 1.6)));
    const playX = X0 + cols * CS;
    const legend = appear(t, T.word("s1", "loud") - 0.2, 0.35, ease.out);
    return {
      top: pill("STEP 1", C.blue) + headline(`Sound becomes a ${hi("picture", C.blue)}`, 80),
      topO: appear(t, a, 0.3, ease.out),
      svg: spectrogram(Math.max(cols, 0), 0, 1) + axes(prog(t, a + 0.5, a + 1)) +
        (cols < NC ? `<line x1="${playX}" y1="${Y0 - 14}" x2="${playX}" y2="${Y0 + NR * CS + 6}" stroke="${C.ink}" stroke-width="4"/>` : "") +
        g(`<rect x="-150" y="-26" width="300" height="52" rx="26" fill="${C.bg2}"/>
          <rect x="-132" y="-12" width="24" height="24" fill="#FFE6CF"/><text x="-96" y="11" class="svgt" style="font-size:28px" fill="${C.ink}">bright = loud</text>`,
          { x: X0 + 150, y: Y0 + NR * CS + 44, o: legend }),
      glow: C.blue,
    };
  }

  // ---------------- Step 2: only the loudest peaks → a star map ----------------
  if (t < T.start("s3a")) {
    const a = T.start("s2");
    const keep = T.word("s2", "keeps");
    const fade = ease.inOut(prog(t, keep, keep + 1.4));
    const starT = T.word("s2", "loudest");
    const map = t > T.word("s2", "What") - 0.2;
    return {
      top: pill("STEP 2", C.green) + headline(map ? `What's left: ${hi("a map of stars", C.green)}` : `Keep only the ${hi("loudest peaks", C.green)}`, 80),
      topO: appear(t, a, 0.3, ease.out),
      svg: spectrogram(NC, fade, 1) + (t > starT ? stars(starT, t, 1) : "") + axes(1 - fade),
      glow: C.green,
    };
  }

  // ---------------- Step 3a: pairs of stars → fingerprints ----------------
  if (t < T.start("s3b")) {
    const a = T.start("s3a");
    const pairs = T.word("s3a", "pairs");
    let svg = specFrame(1) + stars(-10, t, 1);
    ANCHORS.forEach((an, i) => {
      const t0 = pairs + i * 0.9;
      const z = ease.out(prog(t, t0, t0 + 0.4));
      if (z <= 0) return;
      svg += zone(an.a, z);
      an.targets.forEach((b, j) => { svg += pairLine(an.a, b, ease.out(prog(t, t0 + 0.3 + j * 0.15, t0 + 0.6 + j * 0.15))); });
      svg += star(cx(an.a.c), cy(an.a.r), 1.25, C.ink, C.blue);
    });
    // anatomy of one fingerprint: two pitches + time between them
    const an = ANCHORS[1], b = an && an.targets[0];
    const twoT = T.word("s3a", "pitches") - 0.3, dtT = T.word("s3a", "time") - 0.2;
    if (b && t > twoT) {
      const k1 = ease.out(prog(t, twoT, twoT + 0.4)), k2 = ease.out(prog(t, dtT, dtT + 0.4));
      const x1 = cx(an.a.c), y1 = cy(an.a.r), x2 = cx(b.c), y2 = cy(b.r), yb = Y0 + NR * CS + 30;
      svg += `<g opacity="${k1}"><line x1="${x1}" y1="${y1}" x2="${x1}" y2="${yb}" stroke="${C.green}" stroke-width="3" stroke-dasharray="6 6"/>
        <line x1="${x2}" y1="${y2}" x2="${x2}" y2="${yb}" stroke="${C.green}" stroke-width="3" stroke-dasharray="6 6"/>
        <text x="${x1}" y="${y1 - 26}" text-anchor="middle" class="svgt" style="font-size:30px" fill="${C.green}">pitch 1</text>
        <text x="${x2}" y="${y2 - 26}" text-anchor="middle" class="svgt" style="font-size:30px" fill="${C.green}">pitch 2</text></g>
        <g opacity="${k2}"><line x1="${x1}" y1="${yb}" x2="${x2}" y2="${yb}" stroke="${C.accent}" stroke-width="6" stroke-linecap="round"/>
        <text x="${(x1 + x2) / 2}" y="${yb + 44}" text-anchor="middle" class="svgt" style="font-size:32px" fill="${C.accent}">time between</text></g>`;
    }
    return {
      top: pill("STEP 3", C.accent) + headline(`Pairs of stars = ${hi("fingerprints")}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.accent,
    };
  }

  // ---------------- Step 3b: look them up in a library ----------------
  if (t < T.start("s3c")) {
    const a = T.start("s3b");
    const codes = ["A7·3F·12", "C2·4B·07", "9E·A1·15", "3D·77·09", "B4·5C·11"];
    const songs = ["Song 1", "Song 2", "Song 3", "Song 4"];
    const hits = [1, 0, 4, 1];
    let svg = "";
    codes.forEach((c, i) => {
      const t0 = a + 0.15 + i * 0.22, fly = ease.inOut(prog(t, t0 + 0.3, t0 + 0.85));  // tightened for the natural-pace voice
      const dest = i === 2 || i === 4 ? 0 : (i % 2 ? 2 : 2);
      const x = lerp(250, 640, fly), y = lerp(600 + i * 92, 620 + 2 * 112, fly);
      svg += g(tag(c, C.accent, 200), { x, y, o: appear(t, t0, 0.25, ease.out) * (1 - fly * 0.9), s: lerp(1, 0.6, fly) });
    });
    songs.forEach((s, i) => {
      const y = 620 + i * 112, h = Math.round(hits[i] * clamp(prog(t, a + 0.6, a + 1.9)));
      const win = i === 2 && h >= 3;
      svg += `<rect x="600" y="${y - 44}" width="380" height="88" rx="18" fill="${C.bg2}" stroke="${win ? C.green : C.line}" stroke-width="${win ? 6 : 3}"/>` +
        g(note(win ? C.green : C.muted), { x: 650, y, s: 0.6 }) +
        `<text x="700" y="${y + 12}" class="svgt" style="font-size:34px" fill="${C.ink}">${s}</text>` +
        Array.from({ length: h }, (_, j) => `<circle cx="${850 + j * 30}" cy="${y}" r="10" fill="${C.accent}"/>`).join("");
    });
    svg += `<text x="250" y="560" text-anchor="middle" class="svgt" style="font-size:30px" fill="${C.muted}">your clip</text>
      <text x="790" y="560" text-anchor="middle" class="svgt" style="font-size:30px" fill="${C.muted}">library</text>`;
    return { top: headline(`Look them up in a ${hi("huge library")}`, 80), topO: appear(t, a, 0.3, ease.out), svg, glow: C.accent };
  }

  // ---------------- Step 3c: the match lines up; even 1–2% is enough ----------------
  if (t < T.start("pay")) {
    const a = T.start("s3c");
    const PX = 190, PY = 1000, PW = 760, PH = 430;            // plot box (origin bottom-left)
    const rnd = mulberry32(11);
    const N = 48, onLine = [], chance = [];
    for (let i = 0; i < N; i++) { const u = (i + 0.5) / N; onLine.push([u, 0.12 + u * 0.8 + (rnd() - 0.5) * 0.015]); }
    for (let i = 0; i < 10; i++) chance.push([rnd(), rnd()]);
    const keep = new Set([13, 34]);                            // the few that survive the noise
    const dotsIn = prog(t, a + 0.2, T.word("s3c", "line"));
    const lineK = ease.out(prog(t, T.word("s3c", "line"), T.word("s3c", "spacing") + 0.2));
    const noise = ease.inOut(prog(t, T.word("s3c", "Even"), T.word("s3c", "survive") + 0.3));
    const ok = T.word("s3c", "still");
    const P = ([u, v]) => [PX + u * PW, PY - v * PH];
    let svg = `<rect x="${PX - 20}" y="${PY - PH - 20}" width="${PW + 40}" height="${PH + 40}" rx="16" fill="${C.bg2}" stroke="${C.line}" stroke-width="3"/>
      <text x="${PX + PW}" y="${PY + 56}" text-anchor="end" class="svgt" style="font-size:30px" fill="${C.muted}">time in your clip →</text>
      <text x="0" y="0" transform="translate(${PX - 34} ${PY}) rotate(-90)" class="svgt" style="font-size:30px" fill="${C.muted}">time in the song →</text>`;
    chance.forEach((p, i) => { const [x, y] = P(p); svg += `<circle cx="${x}" cy="${y}" r="8" fill="${C.muted}" opacity="${0.7 * clamp(dotsIn * 3 - i * 0.1)}"/>`; });
    if (lineK > 0) { const [x1, y1] = P([0, 0.12]), [x2, y2] = P([1, 0.92]); svg += `<line x1="${x1}" y1="${y1}" x2="${lerp(x1, x2, lineK)}" y2="${lerp(y1, y2, lineK)}" stroke="${C.green}" stroke-width="5" stroke-dasharray="14 10"/>`; }
    onLine.forEach((p, i) => {
      const [x, y] = P(p), vis = clamp(dotsIn * N / 6 - i / 6);
      const o = keep.has(i) ? 1 : 1 - noise * 0.92;
      svg += keep.has(i) && noise > 0.5 ? star(x, y, 1.3, C.ink, C.accent) : `<circle cx="${x}" cy="${y}" r="9" fill="${C.accent}" opacity="${vis * o}"/>`;
    });
    if (noise > 0.2) svg += g(tag("only 1–2% survive", C.accent, 300), { x: 380, y: PY - PH + 40, o: noise });
    if (t > ok) svg += g(okBadge(prog(t, ok, ok + 0.3), 44), { x: PX + PW - 30, y: PY - PH + 46, s: appear(t, ok) }) +
      g(`<text x="0" y="0" text-anchor="end" class="svgt" style="font-size:34px" fill="${C.green}">still a match</text>`, { x: PX + PW - 90, y: PY - PH + 58, o: prog(t, ok, ok + 0.3) });
    const top = t < T.word("s3c", "Even") - 0.1
      ? headline(`The match: fingerprints ${hi("line up", C.green)}`, 80)
      : headline(`Even ${hi("1–2%")} is enough`, 80);
    return { top, svg, glow: C.green };
  }

  // ---------------- Payoff: it matches stars, not the tune ----------------
  if (t < T.start("cta")) {
    const a = T.start("pay");
    const mini = PEAKS.filter(p => p.c < 24).map(p => star(-92 + p.c * 7.6, 110 - p.r * 9.5, 0.45)).join("");
    const ph = phone({ glow: C.green, content: g(mini, { y: -40 }) + g(resultCard(prog(t, a + 0.3, a + 0.7), "Match found"), { y: 110 }) });
    const tune = appear(t, a + 0.1, 0.3, ease.out);
    return {
      top: headline(`Not the tune. It's ${hi("matching stars", C.green)}.`, 80),
      svg: g(ph, { x: 540, y: 800, s: 1.05 }) +
        g(note(C.muted) + slash(60, ease.out(prog(t, T.word("pay", "tune") - 0.1, T.word("pay", "tune") + 0.3))), { x: 250, y: 720, s: 1.3, o: tune }) +
        g(star(0, 0, 2.2), { x: 830, y: 720, o: appear(t, T.word("pay", "matching") - 0.1, 0.3, ease.out) }),
      glow: C.green,
    };
  }

  // ---------------- CTA (≤ 2 s) ----------------
  const a = T.start("cta");
  const k = ease.out(prog(t, a, a + 0.4));
  return {
    noCaptions: t > T.narrationEnd,
    top: headline(`Send this to a <span style="white-space:nowrap">${hi("music lover")}</span>`, 84),
    topO: k,
    svg: g(plane(), { x: lerp(380, 640, ease.inOut(prog(t, a, T.total))), y: lerp(860, 760, ease.inOut(prog(t, a, T.total))), s: 1.6, o: k }) +
      g(PEAKS.filter(p => p.c > 6 && p.c < 34).map(p => star(cx(p.c), cy(p.r) + 60, 0.5)).join(""), { o: 0.5 * k }),
    glow: C.accent,
  };
}

function COVER(T) {
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #6", C.accent) + headline(`How do apps ${hi("recognise songs?")}`, 104),
    svg: g(spectrogram(NC, 0.85, 1) + PEAKS.map(p => star(cx(p.c), cy(p.r), 1)).join("") +
      ANCHORS.map(an => an.targets.map(b => pairLine(an.a, b, 1)).join("")).join(""), { y: 150 }),
    glow: C.accent,
  };
}
