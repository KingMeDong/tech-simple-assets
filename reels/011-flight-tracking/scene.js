// Reel 011 — How does your phone know where a plane is right now? (ADS-B)
// Idea: nobody has to find the plane. It works out its own GPS position and broadcasts it
// once a second (FAA); receivers on the ground (some at hobbyists' homes) and on satellites
// catch the broadcast, flight-tracking apps gather it, and the plane appears on your map.
// The broadcast rings on screen start once per second, like the real broadcast.
// All numbers on screen (coordinates, altitude, speed, ID) are made-up example values.

const GOLD = "#F5C451";
const LAND = "#172A4C", SEA = "#0F1D38";
const at = (inner, x, y, o = {}) => g(inner, { x, y, ...o });
const lbl = (str, x, y, size, color = C.muted, o = 1, anchor = "middle", w = 700) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" opacity="${clamp(o)}" class="svgt" style="font-size:${size}px;font-weight:${w}" fill="${color}">${str}</text>`;
const okBadge = (k, r = 30) => badge(check(C.bg, k), C.green, r);

// ---------- icons ----------
function planeIcon(color = C.ink, stroke = null) { // top view, nose to +x, ~175 long
  return `<path d="M 86 0 Q 82 -11 62 -11 L 14 -11 L -24 -88 L -46 -88 L -26 -11 L -62 -11 L -80 -42 L -93 -42 L -84 -8 L -88 0 L -84 8 L -93 42 L -80 42 L -62 11 L -26 11 L -46 88 L -24 88 L 14 11 L 62 11 Q 82 11 86 0 Z"
    fill="${color}" ${stroke ? `stroke="${stroke}" stroke-width="5"` : ""} stroke-linejoin="round"/>`;
}
function towerIcon(color = C.ink, lit = 0) { // ground receiver mast, base at y 70, top ~ -70
  return `<path d="M -34 70 L 0 -46 L 34 70 M -22 30 L 22 30 M -12 -6 L 12 -6 M -22 30 L 12 -6 M 22 30 L -12 -6"
      fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="0" cy="-58" r="${12 + 6 * lit}" fill="${lit > 0.05 ? C.green : color}"/>
    ${lit > 0.05 ? `<circle cx="0" cy="-58" r="${26 + 30 * lit}" fill="none" stroke="${C.green}" stroke-width="5" opacity="${lit}"/>` : ""}`;
}
function houseIcon(color = C.ink, lit = 0) { // house with a small antenna, base at y 60
  return `<path d="M -62 60 V -4 L 0 -52 L 62 -4 V 60 Z" fill="${C.bg2}" stroke="${color}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="-16" y="18" width="32" height="42" rx="4" fill="${color}" opacity="0.6"/>
    <line x1="30" y1="-28" x2="30" y2="-88" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
    <line x1="18" y1="-74" x2="42" y2="-74" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="30" cy="-92" r="${9 + 5 * lit}" fill="${lit > 0.05 ? C.green : color}"/>
    ${lit > 0.05 ? `<circle cx="30" cy="-92" r="${22 + 26 * lit}" fill="none" stroke="${C.green}" stroke-width="5" opacity="${lit}"/>` : ""}`;
}
function satIcon(color = C.ink, panel = C.blue, lit = 0) { // ~170 wide
  return `<rect x="-85" y="-20" width="58" height="40" rx="5" fill="${panel}" opacity="0.9"/>
    <rect x="27" y="-20" width="58" height="40" rx="5" fill="${panel}" opacity="0.9"/>
    <line x1="-27" y1="0" x2="27" y2="0" stroke="${color}" stroke-width="6"/>
    <rect x="-22" y="-26" width="44" height="52" rx="8" fill="${C.bg2}" stroke="${color}" stroke-width="6"/>
    <line x1="0" y1="26" x2="0" y2="42" stroke="${color}" stroke-width="6"/>
    <circle cx="0" cy="46" r="${8 + 5 * lit}" fill="${lit > 0.05 ? C.green : color}"/>
    ${lit > 0.05 ? `<circle cx="0" cy="46" r="${22 + 26 * lit}" fill="none" stroke="${C.green}" stroke-width="5" opacity="${lit}"/>` : ""}`;
}
function ctrlTower(color = C.ink, lit = 0) { // control tower, base at y 120
  return `<path d="M -30 120 L -20 -30 L 20 -30 L 30 120 Z" fill="${C.bg2}" stroke="${color}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M -64 -30 L 64 -30 L 50 -84 L -50 -84 Z" fill="${C.screen}" stroke="${color}" stroke-width="7" stroke-linejoin="round"/>
    <rect x="-58" y="-98" width="116" height="16" rx="6" fill="${color}"/>
    <line x1="0" y1="-98" x2="0" y2="-128" stroke="${color}" stroke-width="6"/>
    <circle cx="0" cy="-134" r="${9 + 5 * lit}" fill="${lit > 0.05 ? C.green : color}"/>`;
}
function cloudIcon(color = C.ink) { // ~200 wide
  return `<path d="M -80 40 Q -112 40 -112 8 Q -112 -24 -78 -26 Q -70 -66 -26 -66 Q 12 -66 26 -36 Q 40 -48 62 -44 Q 96 -38 98 -6 Q 118 2 116 24 Q 112 40 90 40 Z"
    fill="${C.bg2}" stroke="${color}" stroke-width="7" stroke-linejoin="round"/>`;
}
function bookmark(color = C.accent) {
  return `<path d="M -50 -70 H 50 V 74 L 0 36 L -50 74 Z" fill="${color}"/>`;
}

// expanding broadcast rings: a new ring starts every `every` seconds (n rings alive)
const RING_N = 3;
function ringRadii(t, every, r0, r1, t0 = -10) {
  const P = every * RING_N, out = [];
  for (let i = 0; i < RING_N; i++) {
    const k = (((t - t0) / P) + i / RING_N) % 1;
    if (t - t0 < k * P) continue; // ring not started yet
    out.push({ r: lerp(r0, r1, k), k });
  }
  return out;
}
function pingRings(t, color, r0, r1, every = 1, t0 = -10, alpha = 1) {
  return ringRadii(t, every, r0, r1, t0).map(({ r, k }) =>
    `<circle r="${r.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${lerp(9, 3, k).toFixed(1)}" opacity="${((1 - k) * 0.9 * alpha).toFixed(3)}"/>`).join("");
}
// how strongly a receiver at distance d is "hit" by a ring right now (0..1)
function hit(t, d, r0, r1, every = 1, t0 = -10) {
  let best = 0;
  for (const { r } of ringRadii(t, every, r0, r1, t0)) best = Math.max(best, 1 - Math.abs(r - d) / 60);
  return clamp(best);
}

// map panel with land (left) and sea (right)
function mapPanel(x0, y0, w, h, coastX = 0.58) {
  let s = `<defs><clipPath id="mapclip"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="30"/></clipPath></defs>
    <rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="30" fill="${SEA}" stroke="${C.line}" stroke-width="4"/>`;
  const cx = x0 + w * coastX;
  let land = `M ${x0} ${y0} L ${cx - 30} ${y0} `;
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    const yy = y0 + (h * i) / steps;
    const xx = cx + Math.sin(i * 1.9) * 38 - (i % 2 ? 20 : -10);
    land += `L ${xx.toFixed(0)} ${yy.toFixed(0)} `;
  }
  land += `L ${x0} ${y0 + h} Z`;
  let grid = "";
  for (let gx = x0 + 115; gx < x0 + w; gx += 115) grid += `<line x1="${gx}" y1="${y0}" x2="${gx}" y2="${y0 + h}" stroke="${C.line}" stroke-width="2" opacity="0.55"/>`;
  for (let gy = y0 + 100; gy < y0 + h; gy += 100) grid += `<line x1="${x0}" y1="${gy}" x2="${x0 + w}" y2="${gy}" stroke="${C.line}" stroke-width="2" opacity="0.55"/>`;
  s += `<g clip-path="url(#mapclip)"><path d="${land}" fill="${LAND}"/>${grid}</g>`;
  return s;
}

function dataCard(rows, x, y, w = 430, o = 1) { // rows: [label, value, appear k]
  const h = 50 + rows.length * 64;
  let s = `<rect x="0" y="0" width="${w}" height="${h}" rx="26" fill="${C.bg2}" stroke="${C.blue}" stroke-width="4" opacity="${clamp(o)}"/>`;
  rows.forEach(([l, v, k], i) => {
    const yy = 62 + i * 64;
    s += g(lbl(l, 30, 0, 30, C.muted, 1, "start", 700), { y: yy, o: o }) +
      g(lbl(v, w - 30, 0, 36, C.ink, 1, "end", 800), { y: yy, o: k, x: lerp(20, 0, k) });
  });
  return at(s, x, y);
}

const HOOK_TOP = (size = 80) => headline(`How does your phone know where a <span style="white-space:nowrap">${hi("plane", C.blue)} is</span> right now?`, size);

// plane path in the hook: from left over land to right over sea
const planeAt = t => ({ x: lerp(230, 850, clamp(t / 7)), y: 840 - Math.sin(clamp(t / 7) * Math.PI) * 90 });

function SCENE(t, T) {
  // ---------------- Hook: plane crossing a map, pinging; a phone shows the dot ----------------
  if (t < T.start("twist")) {
    const p = planeAt(t);
    let svg = mapPanel(90, 590, 900, 470);
    // dashed route
    let route = "M 230 840";
    for (let i = 1; i <= 20; i++) { const q = planeAt((7 * i) / 20); route += ` L ${q.x.toFixed(0)} ${q.y.toFixed(0)}`; }
    svg += `<path d="${route}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-dasharray="6 16" opacity="0.6"/>`;
    svg += at(pingRings(t, C.blue, 30, 330, 1), p.x, p.y) + at(planeIcon(C.ink), p.x, p.y, { s: 0.62, r: -8 });
    // phone with the same dot
    const dot = { x: lerp(-60, 60, clamp(t / 7)), y: 10 - Math.sin(clamp(t / 7) * Math.PI) * 20 };
    const screen = `<rect x="-86" y="-150" width="172" height="300" rx="20" fill="${SEA}"/>` +
      `<path d="M -86 -150 L -8 -150 L 4 -60 L -12 30 L 6 150 L -86 150 Z" fill="${LAND}"/>` +
      at(`<circle r="16" fill="${C.blue}" opacity="0.35"/><circle r="9" fill="${C.blue}"/>`, dot.x, dot.y);
    svg += at(phone({ content: screen }), 885, 935, { s: 0.55 });
    return { top: HOOK_TOP(78), svg, glow: C.blue };
  }

  // ---------------- Twist: the plane gives itself away, once a second ----------------
  if (t < T.start("s1")) {
    const a = T.start("twist");
    const inA = ease.out(prog(t, a, a + 0.45));
    const bc = T.word("twist", "broadcasts"), once = T.word("twist", "once");
    const rAlpha = lerp(0.35, 1, ease.out(prog(t, bc - 0.2, bc + 0.3)));
    let svg = at(pingRings(t, C.blue, 70, 470, 1, -10, rAlpha), 540, 820);
    svg += at(planeIcon(C.ink), 540, 820, { s: lerp(0.8, 1.35, inA), r: -8 });
    const tagA = appear(t, bc - 0.05, 0.35);
    svg += at(`<rect x="-150" y="-44" width="300" height="88" rx="44" fill="${C.blue}"/>` +
      lbl("I'm here!", 0, 13, 42, C.bg, 1, "middle", 800), 540, 640, { s: tagA, o: tagA });
    const onceA = appear(t, once - 0.1, 0.35, ease.out);
    // a one-second ticker
    const sec = (t % 1);
    svg += at(`<circle r="44" fill="${C.bg2}" stroke="${C.line}" stroke-width="6"/>
      <circle r="44" fill="none" stroke="${GOLD}" stroke-width="8" stroke-dasharray="${(276.5 * sec).toFixed(1)} 276.5" transform="rotate(-90)"/>` +
      lbl("1 s", 0, 12, 32, C.ink, 1, "middle", 800), 540, 990, { o: onceA, s: lerp(0.8, 1, onceA) });
    svg += lbl("once a second", 540, 1068, 34, GOLD, onceA, "middle", 800);
    const top = headline(`The plane ${hi("gives itself away", C.blue)}`, 84);
    return { top, topO: inA, svg, glow: C.blue };
  }

  // ---------------- Step 1: GPS satellites -> the plane knows where it is ----------------
  if (t < T.start("s2")) {
    const a = T.start("s1");
    const gps = T.word("s1", "GPS"), works = T.word("s1", "works");
    const P = { x: 540, y: 930 };
    const sats = [{ x: 210, y: 640 }, { x: 540, y: 600 }, { x: 870, y: 640 }];
    let svg = "";
    sats.forEach((s, i) => {
      const sa = appear(t, a + 0.15 + i * 0.15, 0.35);
      const lk = ease.out(prog(t, gps - 0.5 + i * 0.12, gps + 0.1 + i * 0.12));
      const ex = lerp(s.x, P.x, lk), ey = lerp(s.y + 40, P.y - 40, lk);
      svg += `<line x1="${s.x}" y1="${s.y + 40}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${GOLD}" stroke-width="5" stroke-dasharray="10 12" opacity="${0.85 * sa}"/>`;
      svg += at(satIcon(C.ink, GOLD), s.x, s.y, { s: 0.62 * sa, o: sa });
    });
    svg += lbl("GPS satellites", 540, 720, 32, GOLD, appear(t, a + 0.5, 0.3, ease.out), "middle", 800);
    svg += at(planeIcon(C.ink), P.x, P.y, { s: 0.95, r: -8 });
    const posA = appear(t, gps + 0.15, 0.4);
    svg += at(`<rect x="-250" y="-40" width="500" height="80" rx="24" fill="${C.bg2}" stroke="${GOLD}" stroke-width="4"/>` +
      lbl("41.2° N · 71.9° W", 0, 13, 38, C.ink, 1, "middle", 800), 540, 1060, { s: lerp(0.85, 1, posA), o: posA });
    const qA = appear(t, works, 0.3, ease.out) * (1 - posA);
    svg += lbl("where am I?", 540, 1060, 38, C.muted, qA, "middle", 800);
    return { top: pill("STEP 1", GOLD) + headline(`It finds itself with ${hi("GPS", GOLD)}`, 80), svg, glow: GOLD };
  }

  // ---------------- Step 2: it broadcasts position, altitude, speed, ID ----------------
  if (t < T.start("s3a")) {
    const a = T.start("s2");
    const radio = T.word("s2", "radio"), that = T.word("s2", "that"), alt = T.word("s2", "altitude"),
      spd = T.word("s2", "speed"), id = T.word("s2", "ID");
    const P = { x: 245, y: 820 };
    const rA = ease.out(prog(t, radio - 0.1, radio + 0.4));
    let svg = at(pingRings(t, C.blue, 60, 420, 1, -10, rA), P.x, P.y) + at(planeIcon(C.ink), P.x, P.y, { s: 0.9, r: -8 });
    const ap = (w0) => ease.out(prog(t, w0 - 0.1, w0 + 0.3));
    svg += dataCard([
      ["position", "41.2° N, 71.9° W", ap(that)],
      ["altitude", "35,000 ft", ap(alt)],
      ["speed", "550 mph", ap(spd)],
      ["ID", "ABC123", ap(id)],
    ], 450, 640, 545, rA);
    svg += lbl("example values", 722, 1000, 28, C.muted, ap(that) * 0.9, "middle", 600);
    return { top: pill("STEP 2", C.blue) + headline(`It ${hi("broadcasts", C.blue)} it, every second`, 80), svg, glow: C.blue };
  }

  // ---------------- Step 3a: receivers on the ground (some at home) ----------------
  if (t < T.start("s3b")) {
    const a = T.start("s3a");
    const rec = T.word("s3a", "receivers"), hob = T.word("s3a", "hobbyists");
    const P = { x: 540, y: 660 };
    let svg = `<rect x="90" y="990" width="900" height="70" rx="18" fill="${LAND}"/>`;
    svg += at(pingRings(t, C.blue, 60, 520, 1), P.x, P.y) + at(planeIcon(C.ink), P.x, P.y, { s: 0.8, r: -4 });
    const recv = [{ x: 210, y: 930, kind: "t" }, { x: 870, y: 930, kind: "t" }, { x: 540, y: 935, kind: "h" }];
    recv.forEach((r, i) => {
      const ra = r.kind === "h" ? appear(t, hob - 0.15, 0.4) : appear(t, rec - 0.1 + i * 0.15, 0.4);
      const d = Math.hypot(r.x - P.x, (r.y - 60) - P.y);
      const lit = ra > 0.9 ? hit(t, d, 60, 520, 1) : 0;
      svg += at(r.kind === "h" ? houseIcon(C.ink, lit) : towerIcon(C.ink, lit), r.x, r.y, { s: ra, o: ra });
    });
    svg += lbl("at home", 540, 1040, 32, GOLD, appear(t, T.word("s3a", "home") - 0.1, 0.3, ease.out), "middle", 800);
    svg += lbl("receiver", 210, 1040, 30, C.muted, appear(t, rec, 0.3, ease.out), "middle", 700) +
      lbl("receiver", 870, 1040, 30, C.muted, appear(t, rec + 0.15, 0.3, ease.out), "middle", 700);
    return { top: pill("STEP 3", C.green) + headline(`Receivers ${hi("catch it", C.green)}`, 84), svg, glow: C.green };
  }

  // ---------------- Step 3b: over the ocean, satellites catch it ----------------
  if (t < T.start("s4")) {
    const a = T.start("s3b");
    const sat = T.word("s3b", "satellites");
    const P = { x: 540, y: 900 };
    let waves = "";
    for (let row = 0; row < 3; row++) {
      let d = "";
      for (let x = 90; x <= 990; x += 60) d += `${x === 90 ? "M" : "L"} ${x} ${1010 + row * 26 + Math.sin(x / 40 + t * 2 + row) * 8}`;
      waves += `<path d="${d}" fill="none" stroke="${C.blue}" stroke-width="5" opacity="${0.35 - row * 0.08}"/>`;
    }
    let svg = waves + at(pingRings(t, C.blue, 60, 420, 1), P.x, P.y) + at(planeIcon(C.ink), P.x, P.y, { s: 0.8, r: -4 });
    const sa = appear(t, sat - 0.2, 0.45);
    const S = { x: 540, y: 600 };
    const lit = sa > 0.9 ? hit(t, P.y - (S.y + 46), 60, 420, 1) : 0;
    svg += at(satIcon(C.ink, C.blue, lit), S.x, S.y, { s: sa, o: sa });
    svg += lbl("receiver in orbit", 650, 612, 32, C.muted, sa, "start", 700);
    svg += lbl("ocean", 900, 990, 30, C.muted, appear(t, a, 0.3, ease.out), "middle", 700);
    return { top: headline(`Over the ocean: ${hi("satellites", C.blue)}`, 84), topO: ease.out(prog(t, a, a + 0.3)), svg, glow: C.blue };
  }

  // ---------------- Step 4: apps gather the signals -> a plane on your map ----------------
  if (t < T.start("pay")) {
    const a = T.start("s4");
    const gat = T.word("s4", "gather"), show = T.word("s4", "show");
    const C0 = { x: 540, y: 700 };
    const srcs = [{ x: 180, y: 980, ic: towerIcon(C.ink), s: 0.7 }, { x: 400, y: 1000, ic: houseIcon(C.ink), s: 0.6 }, { x: 180, y: 640, ic: satIcon(C.ink, C.blue), s: 0.6 }];
    let svg = "";
    srcs.forEach((s, i) => {
      const sa = appear(t, a + i * 0.12, 0.35);
      const lk = ease.out(prog(t, gat - 0.2 + i * 0.12, gat + 0.4 + i * 0.12));
      svg += `<line x1="${s.x}" y1="${s.y - 40}" x2="${lerp(s.x, C0.x - 70, lk).toFixed(1)}" y2="${lerp(s.y - 40, C0.y + 20, lk).toFixed(1)}" stroke="${C.green}" stroke-width="6" stroke-dasharray="12 12" opacity="${sa}"/>`;
      svg += at(s.ic, s.x, s.y, { s: s.s * sa, o: sa });
    });
    svg += at(cloudIcon(C.ink) + lbl("tracking app", 0, 16, 30, C.ink, 1, "middle", 800), C0.x, C0.y, { s: appear(t, a + 0.2, 0.4) });
    // phone with several planes on a map
    const pk = ease.out(prog(t, show - 0.2, show + 0.4));
    let screen = `<rect x="-86" y="-150" width="172" height="300" rx="20" fill="${SEA}"/>` +
      `<path d="M -86 -150 L -8 -150 L 4 -60 L -12 30 L 6 150 L -86 150 Z" fill="${LAND}"/>`;
    const dots = [[-40, -90, 20], [30, -20, -15], [-20, 60, 35], [50, 100, -30]];
    dots.forEach(([x, y, r], i) => {
      const o = clamp(pk * 4 - i);
      screen += at(planeIcon(C.blue), x + Math.sin(t * 0.8 + i) * 6, y, { s: 0.2, r, o });
    });
    const line2 = ease.out(prog(t, show - 0.4, show + 0.1));
    svg += `<line x1="${C0.x + 110}" y1="${C0.y + 10}" x2="${lerp(C0.x + 110, 790, line2).toFixed(1)}" y2="${lerp(C0.y + 10, 840, line2).toFixed(1)}" stroke="${C.blue}" stroke-width="6" stroke-dasharray="12 12" opacity="${line2}"/>`;
    svg += at(phone({ content: screen, glow: pk > 0.5 ? C.blue : null }), 850, 900, { s: 0.85 });
    return { top: headline(`Apps put it ${hi("on your map", C.blue)}`, 84), topO: ease.out(prog(t, a, a + 0.3)), svg, glow: C.blue };
  }

  // ---------------- Payoff: air traffic control uses ADS-B too (US) ----------------
  if (t < T.start("cta")) {
    const a = T.start("pay");
    const us = T.word("pay", "US"), atc = T.word("pay", "air"), pref = T.word("pay", "preferred");
    const P = { x: 720, y: 690 };
    let svg = at(pingRings(t, C.blue, 60, 520, 1), P.x, P.y) + at(planeIcon(C.ink), P.x, P.y, { s: 0.8, r: -8 });
    const tA = appear(t, atc - 0.2, 0.45);
    const lit = tA > 0.9 ? hit(t, Math.hypot(300 - P.x, (900 - 134) - P.y), 60, 520, 1) : 0;
    svg += at(ctrlTower(C.ink, lit), 300, 900, { s: tA, o: tA });
    svg += lbl("air traffic control", 300, 1065, 32, C.muted, tA, "middle", 700);
    const usA = appear(t, us - 0.1, 0.35);
    svg += at(`<rect x="-60" y="-34" width="120" height="68" rx="20" fill="${GOLD}"/>` + lbl("US", 0, 13, 38, C.bg, 1, "middle", 800), 160, 640, { s: usA, o: usA });
    const pA = appear(t, pref - 0.1, 0.4);
    svg += at(`<rect x="-200" y="-40" width="400" height="80" rx="40" fill="${C.bg2}" stroke="${C.green}" stroke-width="4"/>` +
      lbl("preferred", -30, 13, 36, C.ink, 1, "middle", 800) + g(okBadge(prog(t, pref, pref + 0.35), 24), { x: 140 }), 720, 980, { s: lerp(0.85, 1, pA), o: pA });
    return { top: headline(`Air traffic control ${hi("listens too", C.green)}`, 84), topO: ease.out(prog(t, a, a + 0.3)), svg, glow: C.green };
  }

  // ---------------- CTA: save this for your next flight ----------------
  const a = T.start("cta");
  const k = ease.out(prog(t, a, a + 0.35));
  const fly = ease.inOut(prog(t, a, T.total));
  let svg = at(bookmark(C.accent), 540, 760, { s: lerp(0.6, 1.2, k), o: k });
  svg += at(planeIcon(C.ink), lerp(160, 920, fly), lerp(1000, 900, fly), { s: 0.6, r: -8, o: k });
  return {
    noCaptions: t > T.narrationEnd,
    top: headline(`Save this for your <span style="white-space:nowrap">${hi("next flight", C.accent)}</span>`, 88),
    topO: k, svg, glow: C.accent,
  };
}

function COVER(T) {
  const P = { x: 470, y: 960 };
  let svg = mapPanel(90, 730, 900, 480);
  svg += at(pingRings(0.55, C.blue, 40, 380, 1), P.x, P.y) + at(planeIcon(C.ink), P.x, P.y, { s: 0.95, r: -8 });
  const screen = `<rect x="-86" y="-150" width="172" height="300" rx="20" fill="${SEA}"/>` +
    `<path d="M -86 -150 L -8 -150 L 4 -60 L -12 30 L 6 150 L -86 150 Z" fill="${LAND}"/>` +
    at(`<circle r="16" fill="${C.blue}" opacity="0.35"/><circle r="9" fill="${C.blue}"/>`, -10, -10);
  svg += at(phone({ content: screen }), 870, 1090, { s: 0.6 });
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #11", C.accent) + headline(`How does your phone know where a ${hi("plane", C.blue)} is?`, 96),
    svg, glow: C.blue,
  };
}
