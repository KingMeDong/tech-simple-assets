// Reel 009 — How does your phone know where your package is?
// Story: no tracker in the box, just a barcode that is scanned at every stop.
// Each scan becomes one line in the tracking app; between scans nothing changes.
// SCENE(t, T) returns {top, svg, html, glow, noCaptions, topO}.
// Times and places in the tracking list are illustrative, not real data.

const BOX = "#C8894E", BOX_D = "#A86F3C", TAPE = "#E2B27C", PAPER = C.ink, DARK = C.bg;

// ---------- parcel with barcode label (centred at 0,0, ~150 x 116) ----------
function bars(x, y, w, h, n = 34, seed = 7) {
  let s = "", cx = x, i = 0;
  const unit = w / (n * 2.2);
  while (cx < x + w - unit && i < 200) {
    const r = ((i * 37 + seed * 11) % 7);
    const bw = unit * (r % 3 === 0 ? 2.2 : r % 2 === 0 ? 1.4 : 0.8);
    if (cx + bw > x + w) break;
    s += `<rect x="${cx.toFixed(1)}" y="${y}" width="${bw.toFixed(1)}" height="${h}" fill="${DARK}"/>`;
    cx += bw + unit * (r % 2 === 0 ? 1.1 : 0.8);
    i++;
  }
  return s;
}

function parcel(labelGlow = 0) {
  return `<rect x="-75" y="-58" width="150" height="116" rx="10" fill="${BOX}"/>
    <rect x="-75" y="-58" width="150" height="26" rx="10" fill="${BOX_D}"/>
    <rect x="-12" y="-58" width="24" height="40" fill="${TAPE}" opacity="0.9"/>
    ${labelGlow ? `<rect x="-62" y="-14" width="96" height="62" rx="8" fill="${C.accent}" opacity="${0.35 * labelGlow}"/>` : ""}
    <rect x="-58" y="-10" width="88" height="54" rx="6" fill="${PAPER}"/>
    ${bars(-52, -4, 76, 30, 18, 3)}
    <rect x="-52" y="31" width="50" height="6" rx="3" fill="${C.muted}"/>`;
}

// ---------- scanners ----------
function scanGun() { // pointing right, beam exits at (62, -18)
  return `<path d="M -40 -40 H 50 Q 64 -40 64 -26 V -10 Q 64 4 50 4 H 0 L -12 52 Q -14 60 -24 60 H -34 Q -44 60 -42 50 L -30 4 H -40 Q -54 4 -54 -10 V -26 Q -54 -40 -40 -40 Z" fill="${C.bg2}" stroke="${PAPER}" stroke-width="6"/>
    <rect x="52" y="-32" width="10" height="28" rx="3" fill="${C.red}"/>`;
}

function handheld() { // driver's handheld scanner, centred
  return `<rect x="-42" y="-74" width="84" height="148" rx="18" fill="${C.bg2}" stroke="${PAPER}" stroke-width="6"/>
    <rect x="-30" y="-60" width="60" height="62" rx="8" fill="${C.screen}"/>
    <path d="M 0 -48 C -12 -48 -18 -40 -18 -32 C -18 -20 0 -6 0 -6 C 0 -6 18 -20 18 -32 C 18 -40 12 -48 0 -48 Z" fill="${C.blue}"/>
    <circle cx="0" cy="-32" r="6" fill="${C.screen}"/>
    <rect x="-24" y="14" width="48" height="10" rx="5" fill="${C.muted}"/><rect x="-24" y="32" width="48" height="10" rx="5" fill="${C.muted}"/>
    <rect x="-16" y="-82" width="32" height="10" rx="4" fill="${C.red}"/>`;
}

function satellite(color = C.muted) {
  return `<rect x="-14" y="-14" width="28" height="28" rx="5" fill="${color}"/>
    <rect x="-62" y="-10" width="40" height="20" rx="3" fill="none" stroke="${color}" stroke-width="5"/>
    <rect x="22" y="-10" width="40" height="20" rx="3" fill="none" stroke="${color}" stroke-width="5"/>
    <line x1="-22" y1="0" x2="-14" y2="0" stroke="${color}" stroke-width="5"/><line x1="14" y1="0" x2="22" y2="0" stroke="${color}" stroke-width="5"/>
    <path d="M -10 22 Q 0 34 10 22" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
}

// red laser sweep over a target centred at 0,0 (w x h); k = 0..1
function beam(k, w = 110, h = 70) {
  if (k <= 0 || k >= 1) return "";
  const y = lerp(-h / 2, h / 2, k), o = Math.sin(Math.PI * k);
  return `<rect x="${-w / 2 - 10}" y="${y - 9}" width="${w + 20}" height="18" fill="${C.red}" opacity="${0.22 * o}"/>
    <line x1="${-w / 2 - 10}" y1="${y}" x2="${w / 2 + 10}" y2="${y}" stroke="${C.red}" stroke-width="5" stroke-linecap="round" opacity="${o}"/>`;
}

function blip(k, r0 = 20, r1 = 90, color = C.green) { // expanding ring when a scan is saved
  if (k <= 0 || k >= 1) return "";
  return `<circle r="${lerp(r0, r1, k)}" fill="none" stroke="${color}" stroke-width="${lerp(8, 2, k)}" opacity="${1 - k}"/>`;
}

// ---------- route ----------
const RX = [150, 345, 540, 735, 930];
const RNAME = ["Pickup", "Sorting A", "Sorting B", "Local depot", "Home"];

function building(color) {
  return `<path d="M -30 18 V -8 L 0 -26 L 30 -8 V 18 Z" fill="${C.bg2}" stroke="${color}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="-12" y="0" width="24" height="18" fill="${color}" opacity="0.6"/>`;
}
function house(color) {
  return `<path d="M -28 18 V -4 L 0 -28 L 28 -4 V 18 Z" fill="${C.bg2}" stroke="${color}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="-8" y="2" width="16" height="16" fill="${color}" opacity="0.6"/>`;
}

// y = line height; lit[i] = 0..1 green scan dot on node i; o = opacity
function route(y, lit = [], o = 1, dots = 0) {
  let s = `<line x1="${RX[0]}" y1="${y}" x2="${RX[4]}" y2="${y}" stroke="${C.line}" stroke-width="6" stroke-dasharray="2 16" stroke-linecap="round"/>`;
  if (dots > 0) { // payoff: the trail of scans between nodes
    for (let i = 0; i < 4; i++) {
      const k = clamp(dots * 4 - i);
      if (k > 0) s += `<line x1="${RX[i]}" y1="${y}" x2="${lerp(RX[i], RX[i + 1], k)}" y2="${y}" stroke="${C.green}" stroke-width="6" stroke-dasharray="2 16" stroke-linecap="round"/>`;
    }
  }
  RX.forEach((x, i) => {
    const col = (lit[i] || 0) > 0.5 ? C.green : C.muted;
    s += g(i === 4 ? house(col) : building(col), { x, y: y + 44 });
    s += `<text x="${x}" y="${y + 98}" text-anchor="middle" class="svgt" style="font-size:24px;font-weight:700" fill="${C.muted}">${RNAME[i]}</text>`;
    if (lit[i]) s += g(`<circle r="13" fill="${C.green}"/>` + g(check(C.bg, 1), { s: 0.36 }), { x, y, s: ease.back(clamp(lit[i])) });
  });
  return g(s, { o });
}
const rx = p => { const i = Math.min(3, Math.floor(p)); return lerp(RX[i], RX[i + 1], p - i); };

// ---------- tracking app card ----------
const CX0 = 110, CX1 = 970, CY0 = 806, ROWH = 76;
const EV = {
  pick:  { ev: "Picked up", time: "Mon 08:12", place: "Warehouse" },
  arrA:  { ev: "Arrived at sorting center", time: "Mon 21:40", place: "Sorting A" },
  depA:  { ev: "Departed sorting center", time: "Tue 03:05", place: "Sorting A" },
  arrB:  { ev: "Arrived at sorting center", time: "Tue 16:20", place: "Sorting B" },
  out:   { ev: "Out for delivery", time: "Wed 07:31", place: "Local depot" },
  deliv: { ev: "Delivered", time: "Wed 13:02", place: "Front door" },
};

// rows: [{e, at}] oldest first; hl: {key: "ev"|"time"|"place", k} on the newest row; chip: {text, color, k}
function trackCard(t, rows, o = {}) {
  const vis = rows.filter(r => t >= r.at);
  const newest = vis[vis.length - 1];
  const kN = newest ? ease.out(prog(t, newest.at, newest.at + 0.4)) : 1;
  const cardH = 54 + ROWH * 3 + 12;
  let s = `<rect x="${CX0}" y="${CY0}" width="${CX1 - CX0}" height="${cardH}" rx="26" fill="${C.bg2}" stroke="${C.line}" stroke-width="3"/>
    <text x="${CX0 + 30}" y="${CY0 + 38}" class="svgt" style="font-size:26px;font-weight:700" fill="${C.muted}">Your tracking app</text>`;
  if (o.chip) {
    const { text, color, k = 1, wob = 0 } = o.chip;
    const w = text.length * 17 + 40;
    s += g(`<rect x="${-w}" y="-20" width="${w}" height="40" rx="20" fill="${color}"/>
      <text x="${-w / 2}" y="9" text-anchor="middle" class="svgt" style="font-size:24px;font-weight:800" fill="${C.bg}">${text}</text>`,
      { x: CX1 - 26, y: CY0 + 30, o: k, r: wob });
  }
  s += `<defs><clipPath id="rowclip"><rect x="${CX0}" y="${CY0 + 52}" width="${CX1 - CX0}" height="${ROWH * 3 + 8}"/></clipPath></defs><g clip-path="url(#rowclip)">`;
  const list = vis.slice().reverse(); // newest first
  list.slice(0, 4).forEach((r, i) => {
    const y = CY0 + 58 + (i === 0 ? lerp(-24, 0, kN) : (i - 1 + kN) * ROWH);
    const op = i === 0 ? kN : 1;
    const top = i === 0;
    const H = (key) => top && o.hl && o.hl.key === key ? o.hl.k : 0;
    const colEv = H("ev") ? C.accent : C.ink, colT = H("time") ? C.accent : C.muted, colP = H("place") ? C.accent : C.muted;
    s += g(`<circle cx="${CX0 + 44}" cy="22" r="11" fill="${top ? C.green : C.muted}"/>
      ${i < list.length - 1 ? `<line x1="${CX0 + 44}" y1="36" x2="${CX0 + 44}" y2="${ROWH + 8}" stroke="${C.line}" stroke-width="4"/>` : ""}
      <text x="${CX0 + 76}" y="30" class="svgt" style="font-size:32px;font-weight:800" fill="${colEv}">${r.e.ev}</text>
      <text x="${CX0 + 76}" y="62" class="svgt" style="font-size:25px;font-weight:600"><tspan fill="${colT}">${r.e.time}</tspan><tspan fill="${C.muted}">  ·  </tspan><tspan fill="${colP}">${r.e.place}</tspan></text>`,
      { y, o: op });
  });
  s += `</g>`;
  return s;
}

// a small "note" flying from a route node into the top row of the card
function noteFly(t, t0, x0, y0) {
  const k = ease.inOut(prog(t, t0, t0 + 0.45));
  if (k <= 0 || k >= 1) return "";
  const x = lerp(x0, CX0 + 260, k), y = lerp(y0, CY0 + 90, k);
  return g(`<rect x="-46" y="-30" width="92" height="60" rx="10" fill="${PAPER}"/>
    <rect x="-32" y="-16" width="64" height="8" rx="4" fill="${C.muted}"/><rect x="-32" y="0" width="44" height="8" rx="4" fill="${C.muted}"/>`,
    { x, y, s: lerp(1, 0.6, k), o: 1 - k * 0.3 });
}

function SCENE(t, T) {
  const RY = 690; // route line y in route scenes

  // ---------------- Hook: the box travels, the app knows ----------------
  if (t < T.start("twist")) {
    const p = lerp(0.05, 0.9, ease.inOut(prog(t, 0, T.start("twist"))));
    return {
      top: headline(`How does your phone know <span style="white-space:nowrap">${hi("where your package is?")}</span>`, 80),
      svg: route(RY + 10, [1]) + g(parcel(), { x: rx(p), y: RY - 52, s: 0.55, r: Math.sin(t * 9) * 2 }) +
        g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:64px;font-weight:800" fill="${C.accent}">?</text>`,
          { x: rx(p) + 62, y: RY - 92, o: appear(t, T.word("hook", "where"), 0.3, ease.out), s: 1 + 0.06 * Math.sin(t * 7) }) +
        trackCard(t, [{ e: EV.pick, at: -1 }]),
      glow: C.accent,
    };
  }

  // ---------------- Twist: no tracker, just a barcode, scanned again and again ----------------
  if (t < T.start("s1")) {
    const a = T.start("twist");
    const tr = T.word("twist", "tracker"), bc = T.word("twist", "barcode"), sc = T.word("twist", "scanned");
    const ag1 = T.word("twist", "again"), ag2 = T.word("twist", "and") + 0.5;
    const scans = [sc, ag1, ag2];
    const PX = 560, PY = 800;
    let svg = g(parcel(appear(t, bc - 0.1, 0.3, ease.out)), { x: PX, y: PY, s: lerp(1.4, 2.2, ease.out(prog(t, a, a + 0.5))) });
    // the missing tracker: a satellite, crossed out
    const sat = appear(t, tr - 0.25, 0.3, ease.out), sl = ease.out(prog(t, tr + 0.1, tr + 0.45));
    svg += g(satellite(C.muted) + slash(70, sl), { x: 860, y: 610, s: 0.95, o: sat * (1 - prog(t, bc - 0.2, bc + 0.2) * 0.5) });
    // scan gun appears and fires three times
    const gun = appear(t, sc - 0.35, 0.3, ease.out);
    svg += g(scanGun(), { x: 200, y: 830, s: 1.05, o: gun });
    scans.forEach((ts, i) => {
      const k = prog(t, ts, ts + 0.45);
      if (k > 0 && k < 1) svg += `<line x1="268" y1="811" x2="${PX - 80}" y2="${PY + 40}" stroke="${C.red}" stroke-width="5" opacity="${Math.sin(Math.PI * k)}"/>` +
        g(beam(k, 200, 120), { x: PX - 15, y: PY + 37 });
      const c = appear(t, ts + 0.3, 0.3);
      if (c > 0) svg += g(`<rect x="-78" y="-26" width="156" height="52" rx="26" fill="${C.green}"/>
        <text x="0" y="10" text-anchor="middle" class="svgt" style="font-size:28px;font-weight:800" fill="${C.bg}">scan ${i + 1} ✓</text>`,
        { x: 890, y: 740 + i * 72, s: c, o: clamp(c) });
    });
    return {
      top: headline(`Usually no tracker. ${hi("Just a barcode.")}`, 84),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.accent,
    };
  }

  // ---------------- Step 1: every parcel has its own number ----------------
  if (t < T.start("s2")) {
    const a = T.start("s1");
    const lab = ease.out(prog(t, a, a + 0.45));
    const barsK = ease.out(prog(t, a + 0.15, a + 1.1));
    const num = T.word("s1", "International");
    const cty = T.word("s1", "two");
    const LX = 540, LY = 790;
    const segs = [
      { txt: "CP", x: -322, cap: "service" },
      { txt: "52049163", x: -62, cap: "serial number" },
      { txt: "9", x: 168, cap: "check digit" },
      { txt: "GB", x: 312, cap: "country" },
    ];
    let inner = `<rect x="-420" y="-170" width="840" height="340" rx="26" fill="${PAPER}"/>
      <defs><clipPath id="barsclip"><rect x="-370" y="-140" width="${740 * barsK}" height="150"/></clipPath></defs>
      <g clip-path="url(#barsclip)">${bars(-370, -140, 740, 150, 46, 5)}</g>`;
    segs.forEach((sg, i) => {
      const k = appear(t, num + i * 0.25, 0.3, ease.out);
      const isC = i === 3;
      const hl = isC ? ease.out(prog(t, cty - 0.1, cty + 0.3)) : 0;
      if (hl > 0) inner += `<rect x="${sg.x - 64}" y="36" width="128" height="88" rx="16" fill="${C.accent}" opacity="${0.25 * hl}" stroke="${C.accent}" stroke-width="4"/>`;
      inner += `<text x="${sg.x}" y="104" text-anchor="middle" class="svgt" style="font-size:70px;font-weight:800;letter-spacing:2px" fill="${hl > 0.5 ? C.accent : DARK}" opacity="${k}">${sg.txt}</text>`;
      inner += `<text x="${sg.x}" y="152" text-anchor="middle" class="svgt" style="font-size:24px;font-weight:700" fill="${hl > 0.5 ? C.accent : "#6B7590"}" opacity="${k}">${sg.cap}</text>`;
    });
    let svg = g(inner, { x: LX, y: LY, s: lerp(0.85, 1, lab), o: lab });
    const sent = appear(t, T.word("s1", "sent") - 0.2, 0.3, ease.out);
    svg += g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:34px;font-weight:800" fill="${C.accent}">↑ the country that sent it</text>`,
      { x: LX + 210, y: LY + 230, o: sent });
    return {
      top: pill("STEP 1", C.blue) + headline(`Every parcel: ${hi("its own barcode", C.blue)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.blue,
    };
  }

  // ---------------- Step 2: each scan = a tiny note in your app ----------------
  if (t < T.start("s3a")) {
    const a = T.start("s2");
    const arr = T.word("s2", "sorting"), scn = T.word("s2", "scanner"), sav = T.word("s2", "stores");
    const wh = T.word("s2", "what"), wn = T.word("s2", "when"), wr = T.word("s2", "where");
    const ls = T.word("s2", "lists");
    let p = lerp(0, 1, ease.inOut(prog(t, a + 0.2, arr + 0.3)));
    if (t > ls + 0.5) p = lerp(1, 1.35, ease.inOut(prog(t, ls + 0.5, T.start("s3a"))));
    const lit = [1, t > sav ? 1 : 0];
    let svg = route(RY, lit) + g(parcel(), { x: rx(p), y: RY - 52, s: 0.55 });
    // scan at Sorting A (arrival), then again when it departs
    svg += g(beam(prog(t, scn, scn + 0.5), 90, 60), { x: rx(p) - 6, y: RY - 44 });
    svg += g(beam(prog(t, ls - 0.2, ls + 0.3), 90, 60), { x: rx(p) - 6, y: RY - 44 });
    svg += g(blip(prog(t, sav, sav + 0.6)), { x: RX[1], y: RY });
    svg += noteFly(t, sav, RX[1], RY - 40) + noteFly(t, ls, RX[1], RY - 40);
    const rows = [{ e: EV.pick, at: -1 }, { e: EV.arrA, at: sav + 0.45 }, { e: EV.depA, at: ls + 0.45 }];
    let hl = null;
    if (t >= wh && t < wn) hl = { key: "ev", k: 1 };
    else if (t >= wn && t < wr) hl = { key: "time", k: 1 };
    else if (t >= wr && t < ls) hl = { key: "place", k: 1 };
    const tag = hl ? { ev: "what happened", time: "when", place: "where" }[hl.key] : null;
    svg += trackCard(t, rows, { hl, chip: tag ? { text: tag, color: C.accent } : null });
    return {
      top: pill("STEP 2", C.green) + headline(`Every scan = ${hi("a tiny note", C.green)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.green,
    };
  }

  // ---------------- Step 3a: between scans, nothing new ----------------
  if (t < T.start("s3b")) {
    const a = T.start("s3a");
    const p = lerp(1.35, 1.8, prog(t, a, T.start("s3b")));
    const stuck = T.word("s3a", "stuck");
    const wob = t > stuck - 0.1 && t < stuck + 0.6 ? Math.sin((t - stuck) * 30) * 6 * (1 - prog(t, stuck, stuck + 0.6)) : 0;
    const q = appear(t, T.word("s3a", "between"), 0.3, ease.out);
    let svg = route(RY, [1, 1]) + g(parcel(), { x: rx(p), y: RY - 52, s: 0.55 });
    svg += g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:64px;font-weight:800" fill="${C.muted}">?</text>`,
      { x: rx(p) + 4, y: RY - 106, o: q * (0.6 + 0.4 * Math.sin(t * 5)) });
    svg += trackCard(t, [{ e: EV.pick, at: -2 }, { e: EV.arrA, at: -1.5 }, { e: EV.depA, at: -1 }],
      { chip: { text: "In transit", color: C.accent, k: appear(t, T.word("s3a", "transit") - 0.2, 0.3, ease.out), wob } });
    // a clock spins: time passes, no new scan
    const ck = appear(t, T.word("s3a", "nothing"), 0.3, ease.out), ang = (t - a) * 220;
    svg += g(`<circle r="34" fill="${C.bg2}" stroke="${C.muted}" stroke-width="6"/>
      <line x1="0" y1="0" x2="0" y2="-22" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" transform="rotate(${ang})"/>
      <line x1="0" y1="0" x2="14" y2="0" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" transform="rotate(${ang / 12})"/>
      <text x="48" y="10" class="svgt" style="font-size:28px;font-weight:700" fill="${C.muted}">no new scan</text>`,
      { x: 470, y: CY0 + 28, s: 0.62, o: ck });
    return {
      top: pill("STEP 3", C.accent) + headline(`Between scans: ${hi("nothing new", C.red)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.accent,
    };
  }

  // ---------------- Step 3b: the location comes from the driver's scanner ----------------
  if (t < T.start("pay")) {
    const a = T.start("s3b");
    const sat = T.word("s3b", "live"), hh = T.word("s3b", "handheld"), last = T.word("s3b", "last");
    // quick run: Sorting B scan, depot scan (out for delivery), then home
    const tB = a + 0.35, tO = sat + 0.2, tH = last - 0.1;
    let p = 1.8;
    if (t > a) p = lerp(1.8, 2, ease.inOut(prog(t, a, tB)));
    if (t > tB + 0.3) p = lerp(2, 3, ease.inOut(prog(t, tB + 0.3, tO)));
    if (t > tO + 0.4) p = lerp(3, 4, ease.inOut(prog(t, tO + 0.4, hh - 0.45)));
    const lit = [1, 1, t > tB ? 1 : 0, t > tO ? 1 : 0, t > tH + 0.2 ? 1 : 0];
    let svg = route(RY, lit) + g(parcel(), { x: rx(p), y: RY - 52, s: 0.55 });
    [[tB, 2], [tO, 3]].forEach(([ts, i]) => {
      svg += g(beam(prog(t, ts - 0.1, ts + 0.3), 90, 60), { x: RX[i] - 6, y: RY - 44 }) + noteFly(t, ts, RX[i], RY - 40);
    });
    // the driver's handheld scanner, with its own location fix
    const hk = appear(t, hh - 0.3, 0.35);
    svg += g(rings(t, 1.1, C.blue, 60, 100, 2) + handheld(), { x: 826, y: 636, s: 0.66 * hk, o: clamp(hk) });
    if (t > tH) svg += `<line x1="${826 + 12}" y1="${636 - 54}" x2="${RX[4] - 40}" y2="${RY - 50}" stroke="${C.red}" stroke-width="5" opacity="${Math.sin(Math.PI * prog(t, tH, tH + 0.5))}"/>` +
      g(beam(prog(t, tH, tH + 0.5), 90, 60), { x: RX[4] - 6, y: RY - 44 }) + g(blip(prog(t, tH + 0.2, tH + 0.8), 20, 90, C.blue), { x: RX[4], y: RY });
    const rows = [{ e: EV.arrA, at: -2 }, { e: EV.depA, at: -1 }, { e: EV.arrB, at: tB + 0.45 }, { e: EV.out, at: tO + 0.45 }, { e: EV.deliv, at: tH + 0.45 }];
    const chip = t > tH + 0.45 ? { text: "Delivered", color: C.green, k: appear(t, tH + 0.45, 0.3, ease.out) }
      : t > tO + 0.45 ? { text: "Out for delivery", color: C.blue, k: appear(t, tO + 0.45, 0.3, ease.out) } : { text: "In transit", color: C.accent };
    svg += trackCard(t, rows, { chip });
    return {
      top: pill("STEP 3", C.accent) + headline(`Location? ${hi("In the driver's scanner", C.blue)}`, 80),
      svg, glow: C.blue,
    };
  }

  // ---------------- Payoff: not live, a trail of scans ----------------
  const rowsAll = [{ e: EV.arrB, at: -3 }, { e: EV.out, at: -2 }, { e: EV.deliv, at: -1 }];
  if (t < T.start("cta")) {
    const a = T.start("pay");
    const tr = T.word("pay", "trail");
    const dots = ease.inOut(prog(t, tr - 0.2, tr + 1.2));
    const lit = RX.map((_, i) => clamp(dots * 4 - i + 1));
    const live = appear(t, T.word("pay", "live") - 0.2, 0.3, ease.out);
    let svg = route(RY, lit, 1, dots) + g(parcel(), { x: RX[4], y: RY - 52, s: 0.55 });
    svg += g(`<circle r="12" fill="${C.red}"/><text x="24" y="10" class="svgt" style="font-size:30px;font-weight:800" fill="${C.red}">LIVE</text>` + slash(46, ease.out(prog(t, T.word("pay", "live"), T.word("pay", "live") + 0.4))),
      { x: 160, y: 560, o: live * (1 - prog(t, tr - 0.3, tr)) });
    svg += trackCard(t, rowsAll, { chip: { text: "Delivered", color: C.green } });
    return { top: headline(`Not live. ${hi("A trail of scans.", C.green)}`, 84), topO: appear(t, a, 0.3, ease.out), svg, glow: C.green };
  }

  // ---------------- CTA (question, < 2 s) ----------------
  const a = T.start("cta");
  const k = ease.out(prog(t, a + 0.05, a + 0.35));
  const svg = route(RY, [1, 1, 1, 1, 1], 1, 1) + g(parcel(), { x: rx(1.6), y: RY - 52, s: 0.55, o: k }) +
    g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:64px;font-weight:800" fill="${C.accent}">?</text>`, { x: rx(1.6) + 4, y: RY - 106, o: k }) +
    trackCard(t, [{ e: EV.pick, at: -2 }, { e: EV.arrA, at: -1.5 }, { e: EV.depA, at: -1 }], { chip: { text: "In transit", color: C.accent, k } });
  return {
    noCaptions: t > T.narrationEnd,
    top: headline(`Ever had one <span style="white-space:nowrap">${hi("stuck in transit?")}</span>`, 84),
    topO: k, svg, glow: C.accent,
  };
}

function COVER(T) {
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #9", C.accent) + headline(`How does ${hi("package tracking")} work?`, 100),
    svg: g(parcel(1), { x: 560, y: 760, s: 2.1 }) +
      `<line x1="268" y1="781" x2="${560 - 80}" y2="${800}" stroke="${C.red}" stroke-width="6"/>` + g(scanGun(), { x: 200, y: 800, s: 1.05 }) +
      g(beam(0.55, 200, 120), { x: 545, y: 797 }) +
      g(`<rect x="-120" y="-30" width="240" height="60" rx="30" fill="${C.green}"/>
        <text x="0" y="11" text-anchor="middle" class="svgt" style="font-size:32px;font-weight:800" fill="${C.bg}">scanned ✓</text>`, { x: 820, y: 1010 }),
    glow: C.accent,
  };
}
