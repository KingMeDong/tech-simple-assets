// Reel 003 — How does tap to pay work?
// SCENE(t, T) returns {top, svg, html, glow, noCaptions, topO} for time t.
// All devices are generic drawings: no brands, no real card or terminal designs.

const GOLD = "#E8C15A", CARD = "#2D6CDF", CARD2 = "#1F4FB0";

// ---------- generic payment card, centred at 0,0 ----------
// o: {xray 0..1, coil 0..1 (antenna drawn), flow 0..1 (current), glow 0..1 (chip powered), dim 0..1, t}
function card(w, o = {}) {
  const h = w / 1.586, r = w * 0.055, t = o.t || 0;
  const xr = o.xray || 0;
  let s = `<rect x="${-w / 2 + 8}" y="${-h / 2 + 12}" width="${w}" height="${h}" rx="${r}" fill="#000" opacity="${0.3 * (1 - xr * 0.6)}"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${r}" fill="${CARD}" opacity="${1 - xr * 0.78}"/>
    <path d="M ${-w / 2} ${h * 0.12} Q ${0} ${-h * 0.1} ${w / 2} ${h * 0.2} V ${h / 2 - r} Q ${w / 2} ${h / 2} ${w / 2 - r} ${h / 2} H ${-w / 2 + r} Q ${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - r} Z" fill="${CARD2}" opacity="${0.6 * (1 - xr)}"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="${C.ink}" stroke-width="${Math.max(3, w * 0.008)}" opacity="${0.25 + xr * 0.6}"/>`;
  // card number placeholder (dots only)
  s += `<text x="${-w * 0.38}" y="${h * 0.3}" class="svgt" style="font-size:${w * 0.06}px;letter-spacing:${w * 0.01}px" fill="${C.ink}" opacity="${0.75 * (1 - xr * 0.7)}">•••• •••• •••• ••••</text>`;
  // loop antenna: 3 turns along the edge, connected to the chip
  if (o.coil) {
    let d = "";
    for (let i = 0; i < 3; i++) {
      const ix = w * 0.06 + i * w * 0.025, iy = h * 0.09 + i * w * 0.025;
      d += `M ${-w / 2 + ix} ${-h / 2 + iy + r} Q ${-w / 2 + ix} ${-h / 2 + iy} ${-w / 2 + ix + r} ${-h / 2 + iy} H ${w / 2 - ix - r} Q ${w / 2 - ix} ${-h / 2 + iy} ${w / 2 - ix} ${-h / 2 + iy + r} V ${h / 2 - iy - r} Q ${w / 2 - ix} ${h / 2 - iy} ${w / 2 - ix - r} ${h / 2 - iy} H ${-w / 2 + ix + r} Q ${-w / 2 + ix} ${h / 2 - iy} ${-w / 2 + ix} ${h / 2 - iy - r} Z `;
    }
    const len = 3 * 2 * (w + h);
    const sw = Math.max(3, w * 0.009);
    s += `<path d="${d}" fill="none" stroke="${C.accent}" stroke-width="${sw}" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - o.coil)}" opacity="${0.95}"/>`;
    s += `<path d="M ${-w * 0.30} ${-h * 0.08} H ${-w / 2 + w * 0.06}" stroke="${C.accent}" stroke-width="${sw}" opacity="${o.coil}"/>`;
    if (o.flow) s += `<path d="${d}" fill="none" stroke="#FFE3A3" stroke-width="${sw * 1.6}" stroke-linecap="round" stroke-dasharray="${w * 0.02} ${w * 0.07}" stroke-dashoffset="${-t * w * 0.5}" opacity="${o.flow}"/>`;
  }
  // chip
  const cx = -w * 0.30, cy = -h * 0.08, cw = w * 0.15, ch = w * 0.115;
  if (o.glow) s += `<circle cx="${cx}" cy="${cy}" r="${cw * 1.1}" fill="${GOLD}" opacity="${0.35 * o.glow}"/><circle cx="${cx}" cy="${cy}" r="${cw * 0.75}" fill="#FFF3C4" opacity="${0.35 * o.glow}"/>`;
  s += `<rect x="${cx - cw / 2}" y="${cy - ch / 2}" width="${cw}" height="${ch}" rx="${cw * 0.14}" fill="${GOLD}"/>
    <path d="M ${cx - cw / 2} ${cy} H ${cx + cw / 2} M ${cx} ${cy - ch / 2} V ${cy + ch / 2} M ${cx - cw / 2} ${cy - ch / 4} H ${cx - cw / 6} M ${cx + cw / 6} ${cy + ch / 4} H ${cx + cw / 2}" stroke="#A9842A" stroke-width="${Math.max(2, w * 0.005)}"/>`;
  if (o.dim) s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${r}" fill="${C.bg}" opacity="${0.55 * o.dim}"/>`;
  return s;
}
const chipPos = (w, x = 0, y = 0, sc = 1) => [x + sc * (-w * 0.30), y + sc * (-(w / 1.586) * 0.08)];

// ---------- generic terminal, top view, centred at 0,0 (w x 1.35w) ----------
function terminal(w, o = {}) {
  const h = w * 1.35, sx = w * 0.8, sh = w * 0.5, sy = -h / 2 + w * 0.12;
  let s = `<rect x="${-w / 2 + 8}" y="${-h / 2 + 14}" width="${w}" height="${h}" rx="${w * 0.12}" fill="#000" opacity="0.3"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * 0.12}" fill="${C.bg2}" stroke="${C.ink}" stroke-width="7"/>
    <rect x="${-sx / 2}" y="${sy}" width="${sx}" height="${sh}" rx="${w * 0.05}" fill="${o.screen || C.screen}"/>`;
  if (o.coil) { // x-ray: the coil under the screen
    for (let i = 0; i < 3; i++) s += `<circle cx="0" cy="${sy + sh / 2}" r="${w * (0.13 + i * 0.035)}" fill="none" stroke="${C.blue}" stroke-width="5" opacity="${o.coil}"/>`;
  }
  if (o.label) s += `<text x="0" y="${sy + sh / 2 + w * 0.05}" text-anchor="middle" class="svgt" style="font-size:${w * 0.12}px;font-weight:800" fill="${C.ink}">${o.label}</text>`;
  // keypad 3 x 4
  const kw = w * 0.2, kh = w * 0.1, ky = sy + sh + w * 0.1;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++)
    s += `<rect x="${(c - 1) * (kw + w * 0.05) - kw / 2}" y="${ky + r * (kh + w * 0.045)}" width="${kw}" height="${kh}" rx="${kh * 0.3}" fill="${r === 3 ? [C.red, C.muted, C.green][c] : C.line}" opacity="${r === 3 ? 0.8 : 1}"/>`;
  return s;
}
const coilY = w => -w * 1.35 / 2 + w * 0.12 + w * 0.25; // coil centre relative to terminal centre

// compact terminal (for two-device layouts): w x 0.62w, screen with optional label
function miniTerminal(w, o = {}) {
  const h = w * 0.62;
  return `<rect x="${-w / 2 + 8}" y="${-h / 2 + 12}" width="${w}" height="${h}" rx="${w * 0.1}" fill="#000" opacity="0.3"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${w * 0.1}" fill="${C.bg2}" stroke="${C.ink}" stroke-width="7"/>
    <rect x="${-w * 0.38}" y="${-h * 0.36}" width="${w * 0.76}" height="${h * 0.56}" rx="${w * 0.04}" fill="${o.screen || C.screen}"/>
    ${o.label ? `<text x="0" y="${-h * 0.08 + w * 0.045}" text-anchor="middle" class="svgt" style="font-size:${w * 0.12}px;font-weight:800" fill="${o.labelColor || C.ink}">${o.label}</text>` : ""}
    <rect x="${-w * 0.3}" y="${h * 0.28}" width="${w * 0.6}" height="${h * 0.08}" rx="${h * 0.04}" fill="${C.line}"/>`;
}

function battery(sl = 0) {
  return `<rect x="-70" y="-38" width="130" height="76" rx="14" fill="none" stroke="${C.ink}" stroke-width="10"/>
    <rect x="62" y="-16" width="14" height="32" rx="4" fill="${C.ink}"/>
    <rect x="-56" y="-24" width="30" height="48" rx="5" fill="${C.ink}" opacity="0.35"/>` + slash(80, sl);
}

function codeTag(text, color, o = {}) { // centred pill with a code
  const w = o.w || 300;
  return `<rect x="${-w / 2}" y="-38" width="${w}" height="76" rx="38" fill="${o.ghost ? "none" : color}" stroke="${color}" stroke-width="5" ${o.ghost ? 'stroke-dasharray="12 10"' : ""}/>
    <text x="0" y="13" text-anchor="middle" class="svgt" style="font-size:38px;font-weight:800;letter-spacing:2px" fill="${o.ghost ? color : C.bg}">${text}</text>`;
}

function bolt(color = C.accent) {
  return `<path d="M 8 -34 L -16 4 L 0 4 L -8 34 L 18 -6 L 2 -6 Z" fill="${color}"/>`;
}

function arrow(x1, y1, x2, y2, color, k = 1) {
  const x = lerp(x1, x2, k), y = lerp(y1, y2, k), a = Math.atan2(y2 - y1, x2 - x1);
  const hx = x - 26 * Math.cos(a), hy = y - 26 * Math.sin(a);
  return `<line x1="${x1}" y1="${y1}" x2="${hx}" y2="${hy}" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
    <path d="M ${x} ${y} L ${hx - 18 * Math.sin(a)} ${hy + 18 * Math.cos(a)} L ${hx + 18 * Math.sin(a)} ${hy - 18 * Math.cos(a)} Z" fill="${color}"/>`;
}

// field rings that fade out quickly: "just a few centimetres"
function field(t, k, r0, r1, color = C.blue, period = 1.1) {
  if (k <= 0) return "";
  let s = "";
  for (let i = 0; i < 4; i++) {
    const q = ((t / period) + i / 4) % 1;
    s += `<circle r="${lerp(r0, r1, q)}" fill="none" stroke="${color}" stroke-width="${lerp(12, 3, q)}" opacity="${k * Math.pow(1 - q, 1.6) * 0.95}"/>`;
  }
  return s;
}

const BITS = [1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];

function waveform(t, t0, x0, x1, y, amp) { // carrier with load-modulation dips, revealed from the left
  const cell = 52, rev = clamp((t - t0) / 3.2) * (x1 - x0);
  let pts = [], dips = "", labels = "";
  for (let x = x0; x <= x0 + rev; x += 3) {
    const bi = Math.floor((x - x0) / cell), bit = BITS[bi % BITS.length];
    const A = amp * (bit ? 0.45 : 1);
    pts.push(`${x},${(y + A * Math.sin((x - x0) * 0.55 + t * 18)).toFixed(1)}`);
  }
  for (let bi = 0; bi * cell < rev - cell * 0.6; bi++) {
    const bit = BITS[bi % BITS.length], cx = x0 + bi * cell + cell / 2;
    labels += `<text x="${cx}" y="${y - amp - 18}" text-anchor="middle" class="svgt" style="font-size:34px;font-weight:800" fill="${bit ? C.green : C.muted}">${bit}</text>`;
  }
  return `<polyline points="${pts.join(" ")}" fill="none" stroke="${C.blue}" stroke-width="4"/>` + labels;
}
const bitNow = (t, t0) => { const bi = Math.floor(clamp((t - t0) / 3.2) * 800 / 52); return BITS[bi % BITS.length]; };

const NW = x => `<span style="white-space:nowrap">${x}</span>`;
const TOP_Q = () => headline(`How does ${NW(hi("tap-to-pay"))} work?`, 92);
const okB = (k, r = 40) => badge(check(C.bg, k), C.green, r);
const noB = (r = 40) => badge(cross(C.bg), C.red, r);

const TW = 340, TX = 540, TY = 835; // big terminal

function SCENE(t, T) {
  // ---------------- Hook: tap → approved ----------------
  if (t < T.start("twist") - 0.1) {
    const land = ease.out(prog(t, 0, 0.75));
    const cy = TY + coilY(TW);
    const cx = lerp(900, TX, land), cyy = lerp(940, cy, land);
    const ok = t > 1.25;
    let svg = g(terminal(TW, { screen: ok ? "#1D6B4C" : C.screen }), { x: TX, y: TY }) +
      g(field(t, land >= 1 ? 1 : 0, 110, 210), { x: TX, y: cy }) +
      g(card(300), { x: cx, y: cyy, r: lerp(18, -8, land) });
    if (ok) svg += g(okB(prog(t, 1.25, 1.55)), { x: TX + TW / 2 + 70, y: TY - 120, s: appear(t, 1.25) });
    return { top: TOP_Q(), svg, glow: C.blue };
  }

  // ---------------- Twist: no battery ----------------
  if (t < T.start("s1")) {
    const a = T.start("twist"), k = ease.out(prog(t, a - 0.1, a + 0.35));
    const bt = T.word("twist", "battery");
    return {
      top: TOP_Q(),
      svg: g(card(640, { xray: 0.5 * k }), { x: 540, y: 815, s: lerp(0.5, 1, k), r: lerp(-8, 0, k) }) +
        g(battery(ease.out(prog(t, bt - 0.25, bt + 0.15))), { x: 600, y: 815, s: 1.5, o: appear(t, a + 0.3, 0.3, ease.out) }) +
        g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:44px;font-weight:800" fill="${C.red}">no battery</text>`, { x: 540, y: 1060, o: appear(t, bt, 0.3, ease.out) }),
      glow: C.accent,
    };
  }

  // ---------------- Step 1: the terminal's magnetic field ----------------
  if (t < T.start("s2a")) {
    const a = T.start("s1"), cy = TY + coilY(TW);
    const coilK = appear(t, T.word("s1", "coil") - 0.1, 0.4, ease.out);
    const fieldK = appear(t, T.word("s1", "field") - 0.2, 0.5, ease.out);
    const cm = T.word("s1", "centimetres");
    const ruler = appear(t, cm - 0.3, 0.3, ease.out);
    const move = ease.inOut(prog(t, T.end("s1") - 0.4, T.start("s2a") + 0.1));
    let svg = g(terminal(TW, { coil: coilK, screen: "rgba(28,42,72,0.55)" }), { x: TX, y: TY }) +
      g(field(t, fieldK, 110, 210), { x: TX, y: cy });
    svg += g(`<line x1="0" y1="0" x2="-210" y2="0" stroke="${C.ink}" stroke-width="5" stroke-dasharray="10 8"/>
      <line x1="-210" y1="-22" x2="-210" y2="22" stroke="${C.ink}" stroke-width="5"/>
      <text x="-226" y="14" text-anchor="end" class="svgt" style="font-size:40px;font-weight:800" fill="${C.ink}">a few cm</text>`, { x: TX, y: cy, o: ruler });
    // card waits out of range, dark, then moves in
    svg += g(card(250, { dim: 1 - move }), { x: lerp(870, TX, move), y: lerp(930, cy, move), r: lerp(10, -6, move), o: appear(t, a + 0.4, 0.4, ease.out) });
    return {
      top: pill("STEP 1", C.blue) + headline(`A coil makes a ${hi("magnetic field", C.blue)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.blue,
    };
  }

  // ---------------- Step 2a: the hidden antenna powers the chip ----------------
  if (t < T.start("s2b") - 0.1) {
    const a = T.start("s2a"), k = ease.out(prog(t, a, a + 0.4));
    const coil = ease.inOut(prog(t, T.word("s2a", "antenna") - 0.2, T.word("s2a", "antenna") + 1.0));
    const fk = appear(t, T.word("s2a", "catches") - 0.2, 0.4, ease.out);
    const flow = appear(t, T.word("s2a", "field") - 0.1, 0.4, ease.out);
    const glow = appear(t, T.word("s2a", "power") - 0.1, 0.4, ease.out);
    const W = 700;
    let svg = g(field(t, fk * 0.8, 60, 520, C.blue, 1.3), { x: 540, y: 815 }) +
      g(card(W, { xray: k, coil, flow, glow, t }), { x: 540, y: 815, s: lerp(0.4, 1, k), o: k });
    svg += g(`<text x="0" y="0" text-anchor="end" class="svgt" style="font-size:42px;font-weight:800" fill="${C.accent}">loop antenna →</text>`, { x: 540 + W / 2 - 100, y: 815 - 105, o: coil });
    const [chx, chy] = chipPos(W, 540, 815);
    svg += g(bolt(), { x: chx + 120, y: chy, s: 1.3 * (0.9 + 0.1 * Math.sin(t * 10)), o: glow }) +
      g(`<text x="0" y="0" class="svgt" style="font-size:40px;font-weight:800" fill="${GOLD}">chip wakes up</text>`, { x: chx - 60, y: chy + 100, o: glow });
    return {
      top: pill("STEP 2", C.green) + headline(`A hidden ${hi("antenna", C.green)} catches it`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.green,
    };
  }

  // ---------------- Step 2b: answering by flickering ----------------
  if (t < T.start("s3a") - 0.1) {
    const a = T.start("s2b"), W = 560, Y = 730;
    const up = ease.inOut(prog(t, a - 0.1, a + 0.4));
    const tx = T.word("s2b", "transmit"), fl = T.word("s2b", "flickers");
    const flick = t > fl - 0.1;
    const bit = flick ? bitNow(t, fl - 0.1) : 1;
    const sc = lerp(700 / W, 1, up);
    const [chx, chy] = chipPos(W, 540, lerp(815, Y, up));
    let svg = g(card(W, { xray: 1, coil: 1, flow: 0.8, glow: flick ? (bit ? 0.25 : 1) : 1, t }), { x: 540, y: lerp(815, Y, up), s: sc });
    // "doesn't transmit": radio waves from the chip, struck through
    const noTx = appear(t, tx - 0.3, 0.3, ease.out) * (1 - appear(t, fl - 0.3, 0.3, ease.out));
    if (noTx > 0) svg += g(`<path d="M 30 -40 A 50 50 0 0 1 30 40 M 60 -70 A 90 90 0 0 1 60 70" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>` + slash(70, ease.out(prog(t, tx, tx + 0.4))),
      { x: chx + 90, y: chy, o: noTx });
    if (flick) svg += waveform(t, fl - 0.1, 140, 940, 1010, 34) +
      `<text x="140" y="1078" class="svgt" style="font-size:30px;font-weight:700" fill="${C.muted}">what the terminal reads</text>`;
    return {
      top: pill("STEP 2", C.green) + headline(`It answers by ${hi("flickering", C.green)}`, 80),
      svg, glow: C.green,
    };
  }

  // ---------------- Step 3a: one-time code ----------------
  if (t < T.start("s3b") - 0.1) {
    const a = T.start("s3a"), CW = 330, cyC = 690, mw = 340, myT = 985;
    const k = ease.out(prog(t, a - 0.1, a + 0.4));
    const ot = T.word("s3a", "one-time"), cp = T.word("s3a", "Copy");
    const fly1 = ease.inOut(prog(t, ot - 0.2, ot + 0.6));
    const fly2 = ease.inOut(prog(t, cp + 0.2, cp + 1.0));
    const paid = fly1 >= 1, reject = fly2 >= 1;
    const scr = reject ? "#6B1D2A" : paid ? "#1D6B4C" : C.screen;
    const lab = reject ? "USED" : paid ? "PAID" : "";
    const [chx, chy] = chipPos(CW, 540, cyC);
    let svg = g(card(CW, { glow: 1 }), { x: 540, y: cyC, o: k }) +
      g(miniTerminal(mw, { screen: scr, label: lab }), { x: 540, y: myT, o: k });
    svg += g(field(t, 0.6, 30, 140, C.blue), { x: 540, y: myT - 60 });
    if (fly1 > 0 && fly1 < 1) svg += g(codeTag("7F3A·91C2", C.green), { x: lerp(chx + 120, 540, fly1), y: lerp(chy, myT - 40, fly1), s: lerp(0.6, 0.85, fly1) });
    if (paid && !(fly2 > 0)) svg += g(codeTag("7F3A·91C2", C.green), { x: 540 + 330, y: 820, s: 0.7, o: 0.9 });
    if (fly2 > 0) {
      svg += g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:34px;font-weight:800" fill="${C.muted}">copy</text>`, { x: lerp(870, 540, fly2), y: lerp(770, myT - 100, fly2), o: 1 - fly2 * 0.8 });
      svg += g(codeTag("7F3A·91C2", C.red, { ghost: true }), { x: lerp(870, 540, fly2), y: lerp(820, myT - 40, fly2), s: lerp(0.7, 0.85, fly2), o: fly2 < 1 ? 1 : 0 });
    }
    if (paid) svg += g(okB(prog(t, ot + 0.6, ot + 0.9), 34), { x: 540 + mw / 2 + 60, y: myT - 40, s: appear(t, ot + 0.6), o: reject ? 0 : 1 });
    if (reject) svg += g(noB(34), { x: 540 + mw / 2 + 60, y: myT - 40, s: appear(t, cp + 1.0) });
    return {
      top: pill("STEP 3", C.accent) + headline(`A ${hi("one-time code")} for every payment`, 76),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.accent,
    };
  }

  // ---------------- Step 3b: phones send a token ----------------
  if (t < T.start("pay") - 0.1) {
    const a = T.start("s3b"), k = ease.out(prog(t, a - 0.1, a + 0.4));
    const PX = 290, PY = 800, MX = 770, MY = 860, mw = 330;
    const real = T.word("s3b", "real"), tok = T.word("s3b", "token");
    const lockK = ease.out(prog(t, real - 0.1, real + 0.4));
    const fly = ease.inOut(prog(t, tok - 0.9, tok + 0.2));
    const done = fly >= 1;
    const inner = g(card(150), { y: -60 }) +
      `<text x="0" y="50" text-anchor="middle" class="svgt" style="font-size:24px;font-weight:700" fill="${C.ink}">card number</text>` +
      g(lock(lockK, C.accent, 0.55), { y: 110 });
    let svg = g(phone({ glow: C.accent, content: inner }), { x: PX, y: PY, s: 1.05, o: k }) +
      g(miniTerminal(mw, { screen: done ? "#1D6B4C" : C.screen, label: done ? "PAID" : "" }), { x: MX, y: MY, o: k }) +
      g(field(t, 0.6, 30, 140, C.blue), { x: MX, y: MY - 50, o: k });
    svg += g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:36px;font-weight:800" fill="${C.accent}">stays on the phone</text>`, { x: PX, y: PY + 280, o: lockK });
    if (fly > 0) svg += g(codeTag("TOKEN 5Q8W", C.green, { w: 320 }), { x: lerp(PX + 60, MX, fly), y: lerp(PY - 170, MY - 150, fly), s: lerp(0.6, 0.85, fly) });
    if (done) svg += g(okB(prog(t, tok + 0.2, tok + 0.5), 34), { x: MX, y: MY + 160, s: appear(t, tok + 0.2) });
    return {
      top: pill("STEP 3", C.accent) + headline(`Phones send a ${hi("token")} instead`, 80),
      svg, glow: C.accent,
    };
  }

  // ---------------- Payoff: power in, one-time code out ----------------
  if (t < T.narrationEnd) {
    const a = T.start("pay"), k = ease.out(prog(t, a - 0.1, a + 0.4));
    const pw = T.word("pay", "powers"), cd = T.word("pay", "code");
    const CW = 330, cyC = 660, mw = 340, myT = 985;
    const pK = ease.out(prog(t, pw - 0.2, pw + 0.4)), cK = ease.out(prog(t, cd - 0.3, cd + 0.3));
    let svg = g(card(CW, { glow: pK }), { x: 540, y: cyC, o: k }) +
      g(miniTerminal(mw, { screen: cK >= 1 ? "#1D6B4C" : C.screen, label: cK >= 1 ? "PAID" : "" }), { x: 540, y: myT, o: k });
    svg += arrow(400, 890, 400, 775, C.accent, pK) + g(bolt(), { x: 330, y: 830, o: pK }) +
      `<text x="300" y="900" text-anchor="end" class="svgt" style="font-size:36px;font-weight:800" fill="${C.accent}" opacity="${pK}">power</text>`;
    svg += arrow(680, 775, 680, 890, C.green, cK) +
      `<text x="725" y="835" class="svgt" style="font-size:36px;font-weight:800" fill="${C.green}" opacity="${cK}">one-time</text>` +
      `<text x="725" y="877" class="svgt" style="font-size:36px;font-weight:800" fill="${C.green}" opacity="${cK}">code</text>`;
    return { top: headline(`${hi("Power")} in. ${hi("One-time code", C.green)} out.`, 84), svg, glow: C.accent };
  }

  // ---------------- End card: send CTA (no voice, 2 s) ----------------
  const e = appear(t, T.narrationEnd, 0.4, ease.out);
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #3", C.accent) + headline(`Send this to the friend who thinks ${hi("their card has a battery")}`, 76),
    topO: e,
    svg: g(card(300) + g(battery(1), { x: 30, s: 0.9 }), { x: 540, y: 820, o: e, r: -6 }),
    html: `<div style="position:absolute;left:0;right:0;top:1060px;text-align:center;font-weight:700;font-size:40px;color:${C.muted};opacity:${e}">Follow <span style="color:${C.ink}">@tech.simple.explained</span></div>`,
    glow: C.accent,
  };
}

function COVER(T) {
  const cy = TY + 60 + coilY(TW);
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #3", C.accent) + headline(`How does ${NW(hi("tap-to-pay"))} work?`, 104),
    svg: g(terminal(TW, { screen: "#1D6B4C" }), { x: TX, y: TY + 60 }) +
      g(field(0.35, 1, 120, 260), { x: TX, y: cy }) +
      g(card(300), { x: TX, y: cy, r: -8 }) +
      g(okB(1), { x: TX + TW / 2 + 70, y: TY - 60 }),
    glow: C.blue,
  };
}
