// Shared animation library for @tech.simple.explained Reels.
// A Reel is a pure function of time: render(t) draws the frame at t seconds.
// Scenes are defined per Reel in scene.js via SCENE(t, T) where T = timeline helpers.

const W = 1080, H = 1920;
const C = {
  bg: "#0B1426", bg2: "#13213D", ink: "#F4F1EA", muted: "#8D98B3", line: "#2A3A5E",
  accent: "#FF7A45", blue: "#3D9BFF", green: "#2FD08A", red: "#FF5A5F", screen: "#1C2A48",
};

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / Math.max(1e-6, b - a));
const ease = {
  out: k => 1 - Math.pow(1 - k, 3),
  inOut: k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
  back: k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
};
// appear: 0 before t0, eases to 1 over dur
const appear = (t, t0, dur = 0.35, fn = ease.back) => (t < t0 ? 0 : fn(prog(t, t0, t0 + dur)));

// ---------- timeline ----------
function makeT(tl) {
  const segs = Object.fromEntries(tl.segments.map(s => [s.id, s]));
  return {
    seg: id => segs[id],
    start: id => segs[id].start,
    end: id => segs[id].end,
    narrationEnd: tl.narration_seconds,
    total: tl.total_seconds,
    // time when a given word (first occurrence, case-insensitive) is spoken inside a segment
    word: (segId, w) => {
      const x = tl.words.find(o => o.seg === segId && o.w.toLowerCase().replace(/[^a-z0-9-]/g, "").startsWith(w.toLowerCase()));
      return x ? x.start : segs[segId].start;
    },
  };
}

// ---------- captions ----------
function buildChunks(words) {
  const chunks = [];
  let cur = [];
  for (const w of words) {
    cur.push(w);
    const text = cur.map(o => o.w).join(" ");
    const endsSentence = /[.,:?!]$/.test(w.w);
    if (cur.length >= 3 || text.length >= 16 || endsSentence) { chunks.push(cur); cur = []; }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

function captionHTML(t, chunks) {
  for (let i = 0; i < chunks.length; i++) {
    const ch = chunks[i];
    const st = ch[0].start - 0.05;
    const nextStart = i + 1 < chunks.length ? chunks[i + 1][0].start - 0.05 : Infinity;
    const en = Math.min(nextStart, ch[ch.length - 1].end + 0.35);
    if (t >= st && t < en) {
      const pop = ease.back(prog(t, st, st + 0.12));
      const html = ch.map(o => {
        const on = t >= o.start - 0.03;
        const word = o.w.replace(/[,:;]$/, "");
        return `<span class="cw${on ? " on" : ""}">${word}</span>`;
      }).join(" ");
      return `<div class="cap" style="transform:scale(${lerp(0.92, 1, pop)})">${html}</div>`;
    }
  }
  return "";
}

// ---------- SVG primitives ----------
const g = (inner, { x = 0, y = 0, s = 1, o = 1, r = 0 } = {}) =>
  `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" opacity="${clamp(o)}">${inner}</g>`;

function phone({ glow = null, screen = C.screen, content = "" } = {}) {
  // centred at 0,0; height 400
  const w = 200, h = 400;
  return `${glow ? `<rect x="${-w / 2 - 18}" y="${-h / 2 - 18}" width="${w + 36}" height="${h + 36}" rx="56" fill="${glow}" opacity="0.18"/>` : ""}
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="40" fill="${C.bg2}" stroke="${C.ink}" stroke-width="9"/>
    <rect x="${-w / 2 + 14}" y="${-h / 2 + 14}" width="${w - 28}" height="${h - 28}" rx="28" fill="${screen}"/>
    <rect x="-34" y="${-h / 2 + 26}" width="68" height="20" rx="10" fill="${C.bg}"/>
    ${content}`;
}

function photo() { // centred, 120 wide
  return `<rect x="-60" y="-48" width="120" height="96" rx="16" fill="${C.accent}"/>
    <path d="M-44 34 L-14 -4 L8 20 L20 8 L44 34 Z" fill="${C.ink}"/>
    <circle cx="22" cy="-18" r="10" fill="${C.ink}"/>`;
}

function btIcon(color = C.ink, sw = 9) { // centred, ~70 high
  return `<polyline points="-17,-17 17,17 0,34 0,-34 17,-17 -17,17" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function wifiIcon(color = C.ink, sw = 10) { // base dot at 0,22
  const arc = r => `<path d="M ${-r * 0.71} ${22 - r * 0.71} A ${r} ${r} 0 0 1 ${r * 0.71} ${22 - r * 0.71}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
  return `<circle cx="0" cy="22" r="${sw * 0.8}" fill="${color}"/>${arc(24)}${arc(46)}${arc(68)}`;
}

function badge(inner, color, r = 54) { return `<circle r="${r}" fill="${color}"/>${inner}`; }

function slash(r = 70, k = 1, color = C.red) { // diagonal slash drawn progressively
  const x = r * 0.72;
  return `<line x1="${-x}" y1="${-x}" x2="${lerp(-x, x, k)}" y2="${lerp(-x, x, k)}" stroke="${color}" stroke-width="14" stroke-linecap="round"/>`;
}

function globe(color = C.muted) {
  return `<circle r="58" fill="none" stroke="${color}" stroke-width="8"/>
    <ellipse rx="26" ry="58" fill="none" stroke="${color}" stroke-width="7"/>
    <line x1="-58" y1="0" x2="58" y2="0" stroke="${color}" stroke-width="7"/>
    <path d="M -50 -28 Q 0 -40 50 -28 M -50 28 Q 0 40 50 28" fill="none" stroke="${color}" stroke-width="6"/>`;
}

function router(color = C.muted) {
  return `<rect x="-80" y="-10" width="160" height="56" rx="14" fill="none" stroke="${color}" stroke-width="8"/>
    <line x1="-48" y1="-10" x2="-62" y2="-62" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    <line x1="48" y1="-10" x2="62" y2="-62" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-44" cy="18" r="7" fill="${color}"/><circle cx="-18" cy="18" r="7" fill="${color}"/>`;
}

function laptop(color = C.ink) {
  return `<rect x="-90" y="-62" width="180" height="116" rx="12" fill="${C.bg2}" stroke="${color}" stroke-width="8"/>
    <rect x="-112" y="54" width="224" height="16" rx="8" fill="${color}"/>`;
}

function lock(k = 1, color = C.ink, size = 1) { // k: 0 open shackle, 1 closed
  const lift = lerp(-26, 0, k);
  return g(`<path d="M -26 0 V -24 A 26 26 0 0 1 26 -24 V ${lerp(-14, 0, k)}" transform="translate(0 ${lift})" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round"/>
    <rect x="-40" y="-6" width="80" height="62" rx="14" fill="${color}"/>
    <circle cx="0" cy="22" r="9" fill="${C.bg}"/>`, { s: size });
}

function check(color = C.green, k = 1) {
  const pts = [[-26, 2], [-8, 20], [28, -18]];
  const len1 = 25.5, len2 = 52.4, L = (len1 + len2) * k;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  if (L <= len1) d += ` L ${lerp(pts[0][0], pts[1][0], L / len1)} ${lerp(pts[0][1], pts[1][1], L / len1)}`;
  else d += ` L ${pts[1][0]} ${pts[1][1]} L ${lerp(pts[1][0], pts[2][0], (L - len1) / len2)} ${lerp(pts[1][1], pts[2][1], (L - len1) / len2)}`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function cross(color = C.red) {
  return `<path d="M -20 -20 L 20 20 M 20 -20 L -20 20" stroke="${color}" stroke-width="12" stroke-linecap="round"/>`;
}

function bar(x, y, w, k, color, label, sub = "") {
  return `<rect x="${x}" y="${y}" width="${w}" height="34" rx="17" fill="${C.line}"/>
    <rect x="${x}" y="${y}" width="${Math.max(34, w * clamp(k))}" height="34" rx="17" fill="${color}"/>
    <text x="${x}" y="${y - 22}" class="svgt" fill="${C.ink}">${label}</text>
    <text x="${x + w}" y="${y - 22}" class="svgt" fill="${color}" text-anchor="end">${sub}</text>`;
}

function rings(t, period, color, r0, r1, n = 3) { // expanding radio rings around 0,0
  let s = "";
  for (let i = 0; i < n; i++) {
    const k = ((t / period) + i / n) % 1;
    s += `<circle r="${lerp(r0, r1, k)}" fill="none" stroke="${color}" stroke-width="${lerp(10, 3, k)}" opacity="${(1 - k) * 0.9}"/>`;
  }
  return s;
}

// ---------- frame ----------
let CHUNKS = null, T = null;

function render(t) {
  if (!T) { T = makeT(window.TIMELINE); CHUNKS = buildChunks(window.TIMELINE.words); }
  const sc = SCENE(t, T);
  const glowX = 540 + Math.sin(t * 0.6) * 60, glowY = 800 + Math.cos(t * 0.45) * 40;
  document.getElementById("bgsvg").innerHTML =
    `<defs><radialGradient id="glow" cx="${glowX / W}" cy="${glowY / H}" r="0.55">
       <stop offset="0" stop-color="${sc.glow || C.blue}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0"/>
     </radialGradient></defs><rect width="${W}" height="${H}" fill="url(#glow)"/>`;
  document.getElementById("svg").innerHTML = sc.svg || "";
  document.getElementById("top").innerHTML = sc.top || "";
  document.getElementById("top").style.opacity = sc.topO ?? 1;
  document.getElementById("caps").innerHTML = sc.noCaptions ? "" : captionHTML(t, CHUNKS);
  document.getElementById("extra").innerHTML = sc.html || "";
}

function pill(text, color) { return `<span class="pill" style="background:${color}">${text}</span>`; }
function headline(html, size = 78) { return `<div class="hl" style="font-size:${size}px">${html}</div>`; }
const hi = (s, color = C.accent) => `<span style="color:${color}">${s}</span>`;
