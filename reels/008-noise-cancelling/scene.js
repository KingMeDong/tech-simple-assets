// Reel 008 — How noise-cancelling headphones work.
// SCENE(t, T) returns {top, svg, html, glow, noCaptions, topO} for time t.
// Colours: noise = accent (orange), anti-noise = blue, what you hear = green.

const NOISE = C.accent, ANTI = C.blue, QUIET = C.green;
const TAU = Math.PI * 2;

// ---------- waves ----------
// steady noise travelling to the right (x in px, t in s); max |N| ≈ 1
const N = (x, t) => 0.68 * Math.sin(TAU * x / 170 - 5 * t) + 0.32 * Math.sin(TAU * x / 63 - 9 * t);
// slow, steady hum
const HUM = (x, t) => Math.sin(TAU * x / 260 - 3 * t);
// sudden bursts (barks, voices): short packets that drift right
function BURST(x, t) {
  let v = 0;
  for (let i = 0; i < 4; i++) {
    const p = 150 + ((i * 230 + 150 * t) % 920);
    const e = Math.exp(-Math.pow((x - p) / 20, 2));
    v += e * Math.sin(TAU * x / 22 + i * 1.7);
  }
  return v;
}

function wavePts(x0, x1, yc, amp, f, step = 5) {
  const p = [];
  for (let x = x0; x <= x1 + 0.01; x += step) {
    const env = clamp((x - x0) / 36) * clamp((x1 - x) / 36);
    p.push(`${x.toFixed(1)},${(yc - amp * env * f(x)).toFixed(1)}`);
  }
  return p.join(" ");
}
const waveLine = (x0, x1, yc, amp, f, color, sw = 7, o = 1) =>
  `<polyline points="${wavePts(x0, x1, yc, amp, f)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity="${clamp(o)}"/>`;

function mixColor(a, b, k) {
  const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(k)))).join(",")})`;
}

const label = (x, y, txt, color, size = 34, anchor = "start", o = 1) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" class="svgt" style="font-size:${size}px;font-weight:800" fill="${color}" opacity="${clamp(o)}">${txt}</text>`;

const okBadge = (k, r = 36) => badge(check(C.bg, k), C.green, r);
const warnBadge = (r = 36) => badge(`<text x="0" y="${r * 0.38}" text-anchor="middle" class="svgt" style="font-size:${r * 1.3}px;font-weight:800" fill="${C.bg}">!</text>`, C.accent, r);

// ---------- front view: head + headphones ----------
const HX = 540, HY = 830;
function headphonesFront(t, o = {}) {
  const cupL = HX - 175, cupR = HX + 175;
  const quiet = o.quiet || 0;
  let s = "";
  // noise arriving from both sides
  s += waveLine(85, cupL - 52, HY, 42, x => N(x, t), NOISE, 7, o.noiseO ?? 1);
  s += waveLine(cupR + 52, 995, HY, 42, x => N(1080 - x, t), NOISE, 7, o.noiseO ?? 1);
  // quiet ring around the head
  if (quiet > 0) s += `<circle cx="${HX}" cy="${HY}" r="${150 + 10 * Math.sin(t * 3)}" fill="none" stroke="${QUIET}" stroke-width="6" opacity="${0.8 * quiet}"/>` +
    "";
  // head (neutral, no face)
  s += `<circle cx="${HX}" cy="${HY}" r="130" fill="${C.bg2}" stroke="${C.line}" stroke-width="6"/>`;
  if (quiet > 0) s += label(HX, HY + 12, "quiet", QUIET, 40, "middle", quiet);
  // headband + cups
  s += `<path d="M ${cupL} ${HY - 60} C ${cupL} ${HY - 300}, ${cupR} ${HY - 300}, ${cupR} ${HY - 60}" fill="none" stroke="${C.ink}" stroke-width="18" stroke-linecap="round"/>`;
  for (const cx of [cupL, cupR]) {
    s += `<rect x="${cx - 48}" y="${HY - 95}" width="96" height="190" rx="34" fill="${C.bg2}" stroke="${C.ink}" stroke-width="10"/>`;
    s += `<circle cx="${cx + (cx < HX ? -48 : 48)}" cy="${HY - 50}" r="9" fill="${NOISE}" opacity="0.9"/>`; // outer mic
  }
  return s;
}

// mini equation: noise + anti-noise = flat line
function equation(t, y, a1, a2, a3, scale = 1) {
  const w = 190 * scale, amp = 34 * scale, gap = 70 * scale;
  const x0 = 540 - (3 * w + 2 * gap) / 2;
  const xs = [x0, x0 + w + gap, x0 + 2 * (w + gap)];
  return waveLine(xs[0], xs[0] + w, y, amp, x => N(x * 1.6, t), NOISE, 7 * scale, a1) +
    label(xs[0] + w + gap / 2, y + 16 * scale, "+", C.ink, 52 * scale, "middle", a2) +
    waveLine(xs[1], xs[1] + w, y, amp, x => -N((x - xs[1] + xs[0]) * 1.6, t), ANTI, 7 * scale, a2) +
    label(xs[1] + w + gap / 2, y + 16 * scale, "=", C.ink, 52 * scale, "middle", a3) +
    `<line x1="${xs[2]}" y1="${y}" x2="${xs[2] + w}" y2="${y}" stroke="${QUIET}" stroke-width="${8 * scale}" stroke-linecap="round" opacity="${clamp(a3)}"/>`;
}

// ---------- cross-section of one ear cup ----------
const WALL = 440, EAR = 820, CY2 = 720;
function cupSection(t, o = {}) {
  let s = "";
  // ear (listener) on the right
  s += `<ellipse cx="${EAR}" cy="${CY2}" rx="46" ry="86" fill="none" stroke="${C.muted}" stroke-width="9"/>
    <path d="M ${EAR + 14} ${CY2 - 50} Q ${EAR - 24} ${CY2 - 30} ${EAR - 6} ${CY2 + 8} Q ${EAR + 14} ${CY2 + 40} ${EAR - 10} ${CY2 + 58}" fill="none" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/>`;
  s += label(EAR, CY2 + 135, "your ear", C.muted, 30, "middle");
  // cup shell (open towards the ear) + cushions
  s += `<path d="M 700 560 H 540 Q ${WALL} 560 ${WALL} 650 V 790 Q ${WALL} 880 540 880 H 700" fill="${C.bg2}" stroke="${C.ink}" stroke-width="14" stroke-linejoin="round"/>`;
  s += `<rect x="690" y="556" width="62" height="70" rx="22" fill="${C.line}"/><rect x="690" y="814" width="62" height="70" rx="22" fill="${C.line}"/>`;
  // speaker cone
  s += `<rect x="586" y="${CY2 - 36}" width="18" height="72" rx="4" fill="${C.ink}"/>
    <path d="M 604 ${CY2 - 20} L 640 ${CY2 - 52} L 640 ${CY2 + 52} L 604 ${CY2 + 20} Z" fill="${C.ink}" opacity="0.85"/>`;
  s += label(612, CY2 - 68, "speaker", C.muted, 26, "middle");
  // chip
  const chipGlow = o.chip || 0;
  s += `<rect x="478" y="790" width="70" height="56" rx="10" fill="${chipGlow ? mixColor(C.screen, ANTI, chipGlow) : C.screen}" stroke="${C.ink}" stroke-width="4"/>` +
    label(513, 828, "chip", C.ink, 24, "middle");
  // outside microphone
  const mic = o.mic || 0;
  if (mic > 0) s += g(rings(t, 1.1, NOISE, 18, 70, 2), { x: WALL - 14, y: 640, o: mic });
  s += `<circle cx="${WALL - 14}" cy="640" r="16" fill="${NOISE}" stroke="${C.ink}" stroke-width="4"/>`;
  s += label(WALL - 30, 600, "mic", NOISE, 30, "end", 0.5 + 0.5 * mic);
  return s;
}

// scope panel under the cup: what the mic hears, then flipped
function scope(t, draw, flip, lab, o = 1) {
  const x0 = 150, x1 = 930, y = 1010;
  const xe = lerp(x0, x1, clamp(draw));
  const col = flip > 0.5 ? ANTI : NOISE;
  const f = Math.cos(Math.PI * clamp(flip));
  let s = `<rect x="120" y="932" width="840" height="150" rx="22" fill="${C.bg2}" stroke="${C.line}" stroke-width="4"/>`;
  s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 10"/>`;
  if (xe > x0 + 10) s += waveLine(x0, xe, y, 42 * f, x => N(x, 0.0), col, 7);
  s += label(140, 966, lab, col, 26, "start");
  return g(s, { o });
}

// three lanes: noise, anti-noise, what you hear
function lanes(t, ys, fNoise, fAnti, k, o = {}) {
  const x0 = 150, x1 = 930, amp = o.amp || 52;
  let s = "";
  const names = [["noise", NOISE], ["anti-noise", ANTI], ["what you hear", QUIET]];
  ys.forEach((y, i) => { s += label(x0, y - amp - 22, names[i][0], names[i][1], 30, "start", o.labO ?? 1); });
  s += label(105, (ys[0] + ys[1]) / 2 + 14, "+", C.muted, 44, "middle") + label(105, (ys[1] + ys[2]) / 2 + 14, "=", C.muted, 44, "middle");
  s += waveLine(x0, x1, ys[0], amp, fNoise, NOISE, 7);
  s += waveLine(x0, x1, ys[1], amp, fAnti, ANTI, 7, o.antiO ?? 1);
  const res = x => fNoise(x) + k * fAnti(x);
  s += waveLine(x0, x1, ys[2], amp, res, o.resColor || mixColor(NOISE, QUIET, k), 7);
  return s;
}

const QTOP = () => headline(`How do <span style="white-space:nowrap">${hi("noise&#8209;cancelling")}</span> headphones work?`, 84);

function hookFrame(tv) { // the opening state; also the loop's last frames (tv < 0)
  return headphonesFront(tv);
}

function SCENE(t, T) {
  const s1 = T.start("s1"), s2a = T.start("s2a"), s2b = T.start("s2b"), s3a = T.start("s3a"), s3b = T.start("s3b"), pay = T.start("pay");

  // ---------------- Hook + twist ----------------
  if (t < s1) {
    const add = T.word("twist", "add"), snd = T.word("twist", "sound"), sil = T.word("twist", "silence");
    const a1 = appear(t, add - 0.15, 0.3, ease.out), a2 = appear(t, snd - 0.1, 0.3, ease.out), a3 = appear(t, sil - 0.1, 0.3, ease.out);
    const quiet = ease.out(prog(t, sil, sil + 0.5));
    let svg = headphonesFront(t, { quiet, noiseO: 1 });
    svg += equation(t, 1010, a1, a2, a3);
    return { top: QTOP(), svg, glow: NOISE };
  }

  // ---------------- Step 1: a mic hears the noise ----------------
  if (t < s2a) {
    const a = ease.out(prog(t, s1, s1 + 0.45));
    const micT = T.word("s1", "microphone"), lis = T.word("s1", "listens");
    const mic = ease.out(prog(t, micT - 0.2, micT + 0.3));
    const draw = prog(t, lis - 0.1, lis + 1.4);
    let svg = g(cupSection(t, { mic }), { o: a });
    svg += waveLine(85, WALL - 34, CY2 - 80, 44, x => N(x, t), NOISE, 7, a);
    if (draw > 0) svg += scope(t, draw, 0, "what the mic hears", appear(t, lis - 0.1, 0.3, ease.out));
    return { top: pill("STEP 1", C.blue) + headline(`A tiny mic ${hi("hears the noise", NOISE)}`, 80), topO: a, svg, glow: NOISE };
  }

  // ---------------- Step 2a: flip it → anti-noise ----------------
  if (t < s2b) {
    const fl = T.word("s2a", "flips"), spk = T.word("s2a", "speaker"), an = T.word("s2a", "anti-noise");
    const flip = ease.inOut(prog(t, fl - 0.05, fl + 0.9));
    const chip = Math.min(prog(t, fl - 0.4, fl), 1 - prog(t, fl + 1.0, fl + 1.6));
    const play = ease.out(prog(t, spk - 0.2, spk + 0.6));
    let svg = cupSection(t, { mic: 0.4, chip });
    svg += waveLine(85, WALL - 34, CY2 - 80, 44, x => N(x, t), NOISE, 7);
    // a little of the noise still leaks through the shell towards the ear
    svg += waveLine(WALL + 20, EAR - 60, CY2, 18, x => N(x, t), NOISE, 5, 0.45);
    if (play > 0) svg += waveLine(646, lerp(646, EAR - 56, play), CY2, 34, x => -N(x, t), ANTI, 7);
    svg += scope(t, 1, flip, flip > 0.5 ? "flipped: anti-noise" : "what the mic hears");
    return { top: pill("STEP 2", C.green) + headline(`Flip it: ${hi("anti-noise", ANTI)}`, 80), svg, glow: ANTI };
  }

  // ---------------- Step 2b: squeeze + stretch = cancel ----------------
  if (t < s3a) {
    const a = ease.out(prog(t, s2b, s2b + 0.4));
    const sq = T.word("s2b", "squeezes"), st = T.word("s2b", "stretches"), cc = T.word("s2b", "cancel");
    const k = ease.inOut(prog(t, cc - 0.2, cc + 0.8));
    const ys = [600, 790, 980];
    let svg = g(lanes(t, ys, x => N(x, t), x => -N(x, t), k, { antiO: appear(t, s2b + 0.2, 0.3, ease.out) }), { o: a });
    // follow one crest of the main component: 2πx/170 − 5t = π/2 (mod 2π)
    let xm = (170 / TAU) * (Math.PI / 2 + 5 * t);
    xm = 430 + (((xm - 430) % 170) + 170) % 170;
    const qa = appear(t, sq - 0.1, 0.3, ease.out), sa = appear(t, st - 0.1, 0.3, ease.out);
    if (qa > 0 && k < 1) svg += `<line x1="${xm}" y1="${ys[0] - 75}" x2="${xm}" y2="${ys[1] + 75}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="6 8" opacity="${0.7 * qa * (1 - k)}"/>` +
      label(xm + 12, ys[0] - 62, "squeeze", NOISE, 30, "start", qa * (1 - k));
    if (sa > 0 && k < 1) svg += label(xm + 12, ys[1] + 92, "stretch", ANTI, 30, "start", sa * (1 - k));
    if (k >= 1) svg += g(okBadge(prog(t, cc + 0.8, cc + 1.1)), { x: 975, y: ys[2] - 62, s: appear(t, cc + 0.8) });
    return { top: headline(`${hi("Noise", NOISE)} + ${hi("anti-noise", ANTI)} = ${hi("quiet", QUIET)}`, 80), svg, glow: QUIET };
  }

  // ---------------- Step 3a: best on steady hums ----------------
  if (t < s3b) {
    const a = ease.out(prog(t, s3a, s3a + 0.4));
    const best = T.word("s3a", "steady"), hum = T.word("s3a", "hum");
    const k = ease.inOut(prog(t, best - 0.2, best + 0.8));
    const ys = [722, 866, 1010];
    const fan = g(`<circle r="40" fill="none" stroke="${C.ink}" stroke-width="7"/>` +
      [0, 120, 240].map(d => `<path d="M 0 0 Q 26 -10 30 -32 Q 6 -30 0 0 Z" fill="${C.ink}" transform="rotate(${d + t * 360})"/>`).join(""), { x: 190, y: 572 });
    let svg = g(fan + label(250, 585, "steady hum", C.ink, 38, "start", appear(t, hum - 0.2, 0.3, ease.out)) +
      lanes(t, ys, x => HUM(x, t), x => -HUM(x, t), k, { amp: 44 }), { o: a });
    if (k >= 1) svg += g(okBadge(prog(t, best + 0.8, best + 1.1)), { x: 975, y: ys[2] - 56, s: appear(t, best + 0.8) });
    return { top: pill("STEP 3", C.accent) + headline(`Best on ${hi("steady hums", QUIET)}`, 80), topO: appear(t, s3a, 0.3, ease.out), svg, glow: QUIET };
  }

  // ---------------- Step 3b: sudden sounds slip through ----------------
  if (t < pay) {
    const a = ease.out(prog(t, s3b, s3b + 0.4));
    const bark = T.word("s3b", "barking"), voi = T.word("s3b", "voices"), thr = T.word("s3b", "through");
    const ys = [722, 866, 1010];
    const lag = 26;
    const burst = g(`<path d="${Array.from({ length: 16 }, (_, i) => { const r = i % 2 ? 22 : 42, an = i * Math.PI / 8; return `${i ? "L" : "M"} ${(r * Math.cos(an)).toFixed(1)} ${(r * Math.sin(an)).toFixed(1)}`; }).join(" ")} Z" fill="${C.red}"/>` +
      label(0, 12, "!", C.bg, 40, "middle"), { x: 190, y: 572, s: appear(t, bark - 0.2), r: 8 * Math.sin(t * 20) });
    const bubble = g(`<rect x="-50" y="-36" width="100" height="66" rx="20" fill="${C.ink}"/><path d="M -20 28 L -32 50 L 0 28 Z" fill="${C.ink}"/>` +
      `<circle cx="-22" cy="-3" r="7" fill="${C.bg}"/><circle cx="0" cy="-3" r="7" fill="${C.bg}"/><circle cx="22" cy="-3" r="7" fill="${C.bg}"/>`, { x: 330, y: 572, s: appear(t, voi - 0.2) });
    let svg = g(burst + bubble + label(410, 585, "barks, voices", C.ink, 38, "start", appear(t, voi - 0.1, 0.3, ease.out)) +
      lanes(t, ys, x => BURST(x, t), x => -BURST(x - lag, t), 1, { amp: 48, resColor: NOISE }), { o: a });
    if (t > thr - 0.4) svg += g(warnBadge(), { x: 975, y: ys[2] - 60, s: appear(t, thr - 0.4) }) +
      label(930, ys[2] + 66, "some gets through", NOISE, 30, "end", appear(t, thr - 0.4, 0.3, ease.out));
    return { top: headline(`${hi("Sudden sounds", C.red)} are harder to copy`, 80), svg, glow: C.red };
  }

  // ---------------- Payoff ----------------
  if (t < T.narrationEnd) {
    const a = ease.out(prog(t, pay, pay + 0.4));
    const op = T.word("pay", "opposite");
    const svg = g(headphonesFront(t, { quiet: 1 }), { o: a }) + equation(t, 1010, a, a, a);
    return { top: headline(`They play its ${hi("exact opposite", ANTI)}`, 84), svg, glow: ANTI };
  }

  // ---------------- Loop back to the first frame ----------------
  const tv = t - T.total;                       // continues smoothly into t = 0
  const k = ease.inOut(prog(t, T.narrationEnd, T.narrationEnd + 0.6));
  const svg = headphonesFront(tv, { quiet: 1 - k }) + equation(tv, 1010, 1 - k, 1 - k, 1 - k);
  return { noCaptions: true, top: QTOP(), topO: lerp(0, 1, ease.out(prog(t, T.narrationEnd, T.narrationEnd + 0.5))), svg, glow: NOISE };
}

function COVER(T) {
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #8", C.accent) + headline(`How does ${hi("noise cancelling")} work?`, 104),
    svg: g(headphonesFront(0.4, { quiet: 1 }), { y: 90 }) + equation(0.4, 1130, 1, 1, 1, 1.05),
    glow: ANTI,
  };
}
