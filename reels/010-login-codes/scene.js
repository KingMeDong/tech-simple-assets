// Reel 010 — Why login codes change every 30 seconds (TOTP, RFC 6238).
// Idea: a phone (left) and a server (right) with no line between them. Both hold the
// same key and the same clock, run the same math, and the same 6 digits appear at once.
// All digits on screen are made-up examples. The step number is the real
// floor(unix/30) for the planned slot (2026-12-01 18:00 CET).

const PH = { x: 250, y: 800 }, SV = { x: 830, y: 800 };
const GOLD = "#F5C451";
const CODE_A = "482 913", CODE_B = "071 554";
const STEP0 = 59871480;
const fmtStep = n => n.toLocaleString("en-US");
const okBadge = (k, r = 40) => badge(check(C.bg, k), C.green, r);
const noBadge = (r = 40) => badge(cross(C.bg), C.red, r);

// ---------- icons ----------
function server(glow = null) { // centred, ~190 x 300
  const w = 190, h = 300;
  let s = glow ? `<rect x="${-w / 2 - 18}" y="${-h / 2 - 18}" width="${w + 36}" height="${h + 36}" rx="30" fill="${glow}" opacity="0.16"/>` : "";
  s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="22" fill="${C.bg2}" stroke="${C.ink}" stroke-width="9"/>`;
  for (let i = 0; i < 3; i++) {
    const y = -h / 2 + 30 + i * 88;
    s += `<rect x="${-w / 2 + 22}" y="${y}" width="${w - 44}" height="62" rx="10" fill="${C.screen}"/>
      <circle cx="${w / 2 - 44}" cy="${y + 31}" r="8" fill="${C.green}"/>
      <rect x="${-w / 2 + 40}" y="${y + 26}" width="70" height="10" rx="5" fill="${C.line}"/>`;
  }
  return s;
}
function keyIcon(color = GOLD, s = 1) { // ~110 wide, centred
  return g(`<circle cx="-30" cy="0" r="24" fill="none" stroke="${color}" stroke-width="11"/>
    <path d="M -6 0 H 52 M 34 0 V 18 M 48 0 V 14" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round"/>`, { s });
}
function clockIcon(t, color = C.ink, s = 1) { // r 32
  const a = t * 2.2, b = t * 0.35;
  return g(`<circle r="32" fill="none" stroke="${color}" stroke-width="8"/>
    <line x1="0" y1="0" x2="${18 * Math.sin(a)}" y2="${-18 * Math.cos(a)}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="${12 * Math.sin(b)}" y2="${-12 * Math.cos(b)}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`, { s });
}
function ring(r, k, color, sw = 10) { // k: remaining fraction 0..1, drawn clockwise from 12 o'clock
  const c = 2 * Math.PI * r;
  return `<circle r="${r}" fill="none" stroke="${C.line}" stroke-width="${sw}"/>
    <circle r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"
      stroke-dasharray="${(c * clamp(k)).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90)"/>`;
}
const num = (str, x, y, size, color = C.ink, o = 1, anchor = "middle") =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" opacity="${clamp(o)}" style="font-family:Inter;font-weight:800;font-size:${size}px;font-variant-numeric:tabular-nums;letter-spacing:2px" fill="${color}">${str}</text>`;
const lbl = (str, x, y, size, color = C.muted, o = 1, anchor = "middle", w = 700) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" opacity="${clamp(o)}" class="svgt" style="font-size:${size}px;font-weight:${w}" fill="${color}">${str}</text>`;

// digits rolling from a to b (k 0..1), centred at x,y
function roll(a, b, k, x, y, size, color = C.ink) {
  if (k <= 0) return num(a, x, y, size, color);
  if (k >= 1) return num(b, x, y, size, color);
  const e = ease.inOut(k), d = size * 0.9;
  return num(a, x, y - d * e, size, color, 1 - e) + num(b, x, y + d * (1 - e), size, color, e);
}

// a pseudo QR graphic (not scannable: random modules)
let QRPAT = null;
function fakeQR(size) {
  const n = 21, m = size / n;
  if (!QRPAT) {
    QRPAT = []; let s = 7;
    for (let i = 0; i < n * n; i++) { s = (s * 1103515245 + 12345) % 2147483648; QRPAT.push((s >> 16) & 1); }
  }
  const fin = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (fin(r, c)) continue;
    if (QRPAT[r * n + c]) d += `M${(c * m - size / 2).toFixed(1)} ${(r * m - size / 2).toFixed(1)}h${m.toFixed(1)}v${m.toFixed(1)}h${(-m).toFixed(1)}z`;
  }
  const finder = (x, y) => `<rect x="${x}" y="${y}" width="${7 * m}" height="${7 * m}" fill="${C.bg}"/><rect x="${x + m}" y="${y + m}" width="${5 * m}" height="${5 * m}" fill="${C.ink}"/><rect x="${x + 2 * m}" y="${y + 2 * m}" width="${3 * m}" height="${3 * m}" fill="${C.bg}"/>`;
  return `<rect x="${-size / 2 - 16}" y="${-size / 2 - 16}" width="${size + 32}" height="${size + 32}" rx="14" fill="${C.ink}"/>
    <path d="${d}" fill="${C.bg}"/>` + finder(-size / 2, -size / 2) + finder(size / 2 - 7 * m, -size / 2) + finder(-size / 2, size / 2 - 7 * m);
}

// phone showing a code + small ring
function phoneCode(code, k, color = C.ink, extra = "") {
  return phone({ content: num(code, 0, 12, 34, color) + g(ring(26, k, C.blue, 7), { y: 90 }) + extra });
}
function noLink(x0, x1, y, k, o = 1) { // dashed gap + red "no connection" mark
  const mx = (x0 + x1) / 2;
  return g(`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.line}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round"/>` +
    g(`<circle r="40" fill="${C.bg}" stroke="${C.red}" stroke-width="8"/>` + slash(40, k), { x: mx, y }), { o });
}

const at = (inner, x, y, o = {}) => g(inner, { x, y, ...o });
const HOOK_TOP = () => headline(`Why do login codes change <span style="white-space:nowrap">${hi("every 30 seconds?")}</span>`, 84);

function SCENE(t, T) {
  // ---------------- Hook: a code card, the ring runs out, the code rolls over ----------------
  if (t < T.start("twist")) {
    const flip = 2.05;
    const k = t < flip ? lerp(0.32, 0, t / flip) : 1 - (t - flip) / 30;
    const rk = prog(t, flip, flip + 0.4);
    const card = `<rect x="-330" y="-140" width="660" height="280" rx="36" fill="${C.bg2}" stroke="${C.line}" stroke-width="4"/>` +
      lbl("example account", -280, -78, 32, C.muted, 1, "start", 600) +
      `<defs><clipPath id="digclip"><rect x="-320" y="-50" width="500" height="150"/></clipPath></defs>` +
      `<g clip-path="url(#digclip)">${roll(CODE_A, CODE_B, rk, -85, 58, 104)}</g>` + g(ring(52, k, k < 0.1 ? C.red : C.blue, 12), { x: 250, y: 22 });
    return { top: HOOK_TOP(), svg: at(card, 540, 800, { s: lerp(0.94, 1, ease.out(prog(t, 0, 0.4))) }), glow: C.blue };
  }

  // ---------------- Twist: they never talk; they share a secret and a clock ----------------
  if (t < T.start("scope")) {
    const a = T.start("twist");
    const inA = ease.out(prog(t, a, a + 0.5));
    const nv = T.word("twist", "never"), sec = T.word("twist", "secret"), clk = T.word("twist", "clock");
    const sl = ease.out(prog(t, nv, nv + 0.4));
    const kA = appear(t, sec - 0.1), cA = appear(t, clk - 0.1);
    let svg = at(phone(), PH.x - 60 * (1 - inA), PH.y, { s: 0.85, o: inA }) +
      at(server(), SV.x + 60 * (1 - inA), SV.y, { s: 0.85, o: inA }) +
      noLink(PH.x + 110, SV.x - 100, PH.y, sl, appear(t, nv - 0.2, 0.3, ease.out));
    svg += at(keyIcon(GOLD), PH.x - 40, 560, { s: kA, o: kA }) + at(keyIcon(GOLD), SV.x - 40, 560, { s: kA, o: kA });
    svg += at(clockIcon(t, C.blue), PH.x + 70, 560, { s: cA, o: cA }) + at(clockIcon(t, C.blue), SV.x + 70, 560, { s: cA, o: cA });
    svg += lbl("phone", PH.x, 1010, 36, C.muted, inA) + lbl("server", SV.x, 1010, 36, C.muted, inA);
    const top = t < sec - 0.2 ? headline(`The app ${hi("never talks", C.red)} to the server`, 80) : headline(`They share a ${hi("secret", GOLD)} and a ${hi("clock", C.blue)}`, 84);
    return { top, svg, glow: GOLD };
  }

  // ---------------- Scope: authenticator apps, not text messages ----------------
  if (t < T.start("s1")) {
    const a = T.start("scope"), aA = appear(t, T.word("scope", "app") - 0.2, 0.35, ease.out), sA = appear(t, T.word("scope", "text") - 0.2, 0.35, ease.out);
    const loop = ((t - a) % 2.2) / 2.2;
    const app = `<rect x="-200" y="-210" width="400" height="420" rx="36" fill="${C.bg2}" stroke="${C.blue}" stroke-width="5"/>` +
      lbl("authenticator app", 0, -150, 34, C.ink, 1, "middle", 800) + num(CODE_A, 0, 10, 62) + g(ring(34, 1 - loop, C.blue, 9), { y: 110 }) +
      g(okBadge(1, 30), { x: 170, y: -180 });
    const sms = `<rect x="-200" y="-210" width="400" height="420" rx="36" fill="${C.bg2}" stroke="${C.line}" stroke-width="5"/>` +
      lbl("text message", 0, -150, 34, C.muted, 1, "middle", 800) +
      `<rect x="-150" y="-80" width="300" height="130" rx="30" fill="${C.line}"/><path d="M -110 46 L -130 84 L -70 50 Z" fill="${C.line}"/>` +
      lbl("Your code is", 0, -26, 30, C.muted, 1, "middle", 600) + num("•••• ••", 0, 22, 36, C.muted) +
      lbl("not in this video", 0, 140, 30, C.muted, 1, "middle", 600);
    return {
      top: headline(`${hi("Authenticator apps", C.blue)}, not text messages`, 80),
      svg: at(app, 290, 800, { s: lerp(0.85, 1, aA), o: aA }) + at(sms, 790, 800, { s: lerp(0.85, 0.92, sA), o: sA * 0.75 }),
      glow: C.blue,
    };
  }

  // ---------------- Step 1: one shared secret, often inside the QR code ----------------
  if (t < T.start("s2")) {
    const a = T.start("s1");
    const qrA = appear(t, T.word("s1", "set") - 0.2, 0.4);
    const fly = ease.inOut(prog(t, T.word("s1", "both") - 0.1, T.word("s1", "store") + 0.5));
    const kept = fly >= 1;
    const qrHi = appear(t, T.word("s1", "QR") - 0.3, 0.35, ease.out);
    const pulse = 1 + 0.04 * Math.sin(t * 7) * qrHi;
    let svg = at(phone(), PH.x, 860, { s: 0.75 }) + at(server(), SV.x, 860, { s: 0.75 });
    svg += at(fakeQR(170), 540, 640, { s: qrA * pulse, o: qrA });
    if (qrHi > 0) svg += lbl("otpauth://…?secret=K7Q2…", 540, 800, 28, GOLD, qrHi, "middle", 700) + lbl("made-up example", 540, 836, 24, C.muted, qrHi, "middle", 600);
    if (fly > 0 && !kept) {
      svg += at(keyIcon(GOLD, 0.8), lerp(540, PH.x, fly), lerp(640, 700, fly) - 120 * Math.sin(Math.PI * fly));
      svg += at(keyIcon(GOLD, 0.8), lerp(540, SV.x, fly), lerp(640, 700, fly) - 120 * Math.sin(Math.PI * fly));
    }
    if (kept) svg += at(keyIcon(GOLD, 0.8), PH.x, 700) + at(keyIcon(GOLD, 0.8), SV.x, 700) +
      lbl("same secret key", PH.x, 1050, 32, GOLD, appear(t, T.word("s1", "store") + 0.5), "middle") + lbl("same secret key", SV.x, 1050, 32, GOLD, appear(t, T.word("s1", "store") + 0.5), "middle");
    return {
      top: pill("STEP 1", GOLD) + headline(`One ${hi("shared secret", GOLD)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: GOLD,
    };
  }

  // ---------------- Step 2: both count 30-second steps since 1970 ----------------
  if (t < T.start("s3a")) {
    const a = T.start("s2");
    const tick = T.word("s2", "steps");
    const n = t < tick ? STEP0 : STEP0 + 1;
    const rk = t < tick ? lerp(0.25, 0, prog(t, a, tick)) : 1 - (t - tick) / 30;
    const roll2 = prog(t, tick, tick + 0.35);
    // timeline 1970 -> now with ticks scrolling left
    const tlA = appear(t, T.word("s2", "count") - 0.2, 0.4, ease.out);
    const y = 620;
    let ticks = "";
    const off = ((t * 60) % 40);
    for (let x = 140 - off; x < 940; x += 40) ticks += `<line x1="${x}" y1="${y - 14}" x2="${x}" y2="${y + 14}" stroke="${C.blue}" stroke-width="4" opacity="0.7"/>`;
    const jan = appear(t, T.word("s2", "January") - 0.2, 0.35, ease.out);
    let svg = g(`<line x1="120" y1="${y}" x2="960" y2="${y}" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/>` + ticks +
      `<circle cx="120" cy="${y}" r="12" fill="${GOLD}"/><circle cx="960" cy="${y}" r="12" fill="${C.green}"/>` +
      lbl("now", 960, y + 58, 32, C.green, 1, "middle", 800) + lbl("each tick = 30 s", 540, y - 34, 30, C.blue, 1, "middle", 700) +
      lbl("Jan 1, 1970", 120, y + 58, 32, GOLD, jan, "start", 800), { o: tlA });
    const box = (x, who) => at(`<rect x="-220" y="-120" width="440" height="240" rx="30" fill="${C.bg2}" stroke="${C.line}" stroke-width="4"/>` +
      lbl(`${who} · step number`, 0, -72, 30, C.muted, 1, "middle", 700) +
      `<defs><clipPath id="stclip${who}"><rect x="-210" y="-40" width="420" height="72"/></clipPath></defs>` +
      `<g clip-path="url(#stclip${who})">${roll(fmtStep(STEP0), fmtStep(STEP0 + 1), roll2, 0, 14, 50)}</g>` + g(clockIcon(t, C.blue, 0.8), { x: 0, y: 72 }), x, 880);
    svg += box(285, "phone") + box(795, "server");
    return {
      top: pill("STEP 2", C.blue) + headline(`Both count ${hi("30-second steps", C.blue)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.blue,
    };
  }

  // ---------------- Step 3: secret + step -> same math -> cut to 6 digits ----------------
  if (t < T.start("s3b")) {
    const a = T.start("s3a");
    const inK = ease.inOut(prog(t, T.word("s3a", "puts") - 0.1, T.word("s3a", "step") + 0.3));
    const mathA = appear(t, T.word("s3a", "same") - 0.3, 0.35);
    const hexA = appear(t, T.word("s3a", "math") - 0.1, 0.3, ease.out);
    const cut = prog(t, T.word("s3a", "cuts") - 0.1, T.word("s3a", "cuts") + 0.5);
    const digA = appear(t, T.word("s3a", "six") - 0.1, 0.35);
    const HEX = "8f3a91c0e4b7…";
    const lane = x => {
      let s = "";
      // inputs fall into the math box
      s += at(keyIcon(GOLD, 0.6), x - 70, lerp(560, 690, inK), { o: 1 - 0.7 * inK });
      s += at(`<rect x="-62" y="-26" width="124" height="52" rx="14" fill="${C.screen}" stroke="${C.blue}" stroke-width="3"/>` + lbl("step", 0, 10, 26, C.blue, 1, "middle", 800), x + 70, lerp(560, 690, inK), { o: 1 - 0.7 * inK });
      s += at(`<rect x="-150" y="-55" width="300" height="110" rx="24" fill="${C.bg2}" stroke="${mathA > 0.5 ? C.accent : C.line}" stroke-width="5"/>` +
        lbl("same math", 0, 12, 36, mathA > 0.5 ? C.ink : C.muted, 1, "middle", 800) +
        g(`<circle r="16" fill="none" stroke="${C.accent}" stroke-width="6" stroke-dasharray="8 6"/>`, { x: 112, y: 0, r: t * 120, o: mathA }), x, 730);
      if (hexA > 0) {
        const keep = 1 - ease.out(cut);
        // head ends left of the cut line, tail starts right of it: they never overlap
        s += num(HEX.slice(0, 6), x + 2, 870, 34, C.muted, hexA, "end") + num(HEX.slice(6), x + 26, 870 + 60 * (1 - keep), 34, C.muted, hexA * keep, "start");
        if (cut > 0 && cut < 1) s += `<line x1="${x + 14}" y1="830" x2="${x + 14}" y2="890" stroke="${C.accent}" stroke-width="6" stroke-linecap="round"/>`;
      }
      if (digA > 0) s += at(`<rect x="-150" y="-50" width="300" height="100" rx="24" fill="${C.screen}" stroke="${C.green}" stroke-width="5"/>` + num(CODE_A, 0, 20, 56, C.ink), x, 990, { s: digA, o: digA });
      return s;
    };
    return {
      top: pill("STEP 3", C.accent) + headline(`Secret + step → ${hi("6 digits", C.green)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg: lane(290) + lane(790) + lbl("phone", 290, 520, 30, C.muted) + lbl("server", 790, 520, 30, C.muted),
      glow: C.accent,
    };
  }

  // ---------------- Same secret, same step, same code. No message needed. ----------------
  if (t < T.start("pay")) {
    const a = T.start("s3b");
    const sameC = T.word("s3b", "code"), noM = T.word("s3b", "message");
    const ok = appear(t, sameC - 0.05);
    const k = 1 - (t - a) / 30;
    let svg = at(phoneCode(CODE_A, k), PH.x, PH.y, { s: 0.85 }) + at(server(C.green) + `<rect x="-80" y="-30" width="160" height="56" rx="12" fill="${C.bg}"/>` + num(CODE_A, 0, 12, 30, C.ink), SV.x, SV.y, { s: 0.85 });
    svg += noLink(PH.x + 110, SV.x - 100, PH.y, ease.out(prog(t, noM - 0.1, noM + 0.3)), appear(t, noM - 0.3, 0.3, ease.out));
    svg += lbl("=", 540, 700, 90, C.green, ok, "middle", 800) + at(okBadge(prog(t, sameC, sameC + 0.3), 40), 540, 560, { s: ok, o: ok });
    svg += lbl("0 messages", 540, PH.y + 100, 34, C.red, appear(t, noM, 0.3, ease.out), "middle", 800);
    return {
      top: headline(`Same code. ${hi("No message.", C.green)}`, 84),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.green,
    };
  }

  // ---------------- Payoff: 30 s is the balance ----------------
  if (t < T.start("cta")) {
    const a = T.start("pay");
    const k = lerp(1, 0, prog(t, a, T.word("pay", "stale") + 0.1));
    const typeA = appear(t, T.word("pay", "long") - 0.1, 0.35, ease.out);
    const stA = appear(t, T.word("pay", "short") - 0.1, 0.35, ease.out);
    const stale = prog(t, T.word("pay", "stale") - 0.05, T.word("pay", "stale") + 0.35);
    let svg = at(ring(120, k, k < 0.15 ? C.red : C.blue, 18) + num("30 s", 0, 22, 62, C.ink), 540, 650);
    // row 1: long enough to type
    svg += at(`<rect x="-410" y="-48" width="820" height="96" rx="26" fill="${C.bg2}" stroke="${C.green}" stroke-width="4"/>` +
      lbl("long enough to type it", -370, 12, 38, C.ink, 1, "start", 800) + g(okBadge(prog(t, T.word("pay", "type"), T.word("pay", "type") + 0.3), 28), { x: 360 }), 540, 880, { o: typeA, s: lerp(0.9, 1, typeA) });
    // row 2: a stolen copy goes stale
    const chip = `<rect x="-110" y="-30" width="220" height="60" rx="16" fill="${stale > 0.5 ? C.line : C.screen}" stroke="${stale > 0.5 ? C.muted : C.red}" stroke-width="4"/>` +
      num(CODE_A, 0, 12, 32, stale > 0.5 ? C.muted : C.ink) + (stale > 0 ? `<line x1="-96" y1="0" x2="${lerp(-96, 96, ease.out(stale))}" y2="0" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>` : "");
    svg += at(`<rect x="-410" y="-48" width="820" height="96" rx="26" fill="${C.bg2}" stroke="${C.red}" stroke-width="4"/>` +
      lbl(stale > 0.5 ? "stolen copy: stale" : "a stolen copy…", -370, 12, 38, C.ink, 1, "start", 800) + g(chip, { x: 270 }), 540, 1010, { o: stA, s: lerp(0.9, 1, stA) });
    return { top: headline(`30 seconds: ${hi("the balance")}`, 84), svg, glow: C.blue };
  }

  // ---------------- CTA (≤ 2 s) ----------------
  const a = T.start("cta");
  const k = ease.out(prog(t, a, a + 0.35));
  const plane = `<path d="M -70 10 L 80 -60 L 30 70 L 5 25 Z" fill="${C.blue}"/><path d="M 5 25 L 80 -60 L 20 40 Z" fill="${C.ink}" opacity="0.5"/>`;
  return {
    noCaptions: t > T.narrationEnd,
    top: headline(`Send this to a <span style="white-space:nowrap">${hi("slow typer")}</span>`, 88),
    topO: k,
    svg: at(plane, lerp(420, 640, ease.inOut(prog(t, a, T.total))), lerp(860, 740, ease.inOut(prog(t, a, T.total))), { s: 1.5, o: k }),
    glow: C.blue,
  };
}

function COVER(T) {
  const card = `<rect x="-330" y="-140" width="660" height="280" rx="36" fill="${C.bg2}" stroke="${C.line}" stroke-width="4"/>` +
    lbl("example account", -280, -78, 32, C.muted, 1, "start", 600) + num(CODE_A, -85, 58, 104) + g(ring(52, 0.3, C.blue, 12), { x: 250, y: 22 });
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #10", C.accent) + headline(`Why do ${hi("login codes")} change?`, 104),
    svg: at(card, 540, 900) + at(keyIcon(GOLD, 1.1), 300, 1160) + at(clockIcon(0.6, C.blue, 1.3), 780, 1160),
    glow: C.blue,
  };
}
