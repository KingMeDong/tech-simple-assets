// Reel 004 — Why your Wi-Fi is slower in the kitchen.
// SCENE(t, T) returns {top, svg, html, glow, noCaptions, topO} for time t.

const RT = { x: 215, y: 690 };          // router
const PH = { x: 860, y: 665 };          // phone
const MW = { x: 540, y: 945 };          // microwave
const LANE = { x0: 320, x1: 770, y: 665 };

// deterministic pseudo-random in [0,1)
const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Clip everything that radiates (rings) to the area above the captions.
const CLIP = `<defs><clipPath id="above"><rect x="0" y="250" width="1080" height="840"/></clipPath></defs>`;
const clipAbove = inner => `<g clip-path="url(#above)">${inner}</g>`;

// ---------- drawings ----------
function microwave(t, on = 0, label = true) { // centred at 0,0, 340 x 200
  const glow = on > 0 ? 0.35 + 0.12 * Math.sin(t * 9) : 0;
  const plate = on > 0 ? `<ellipse cx="-42" cy="48" rx="${70}" ry="12" fill="${C.ink}" opacity="0.25"/>
    <rect x="${-42 + 30 * Math.cos(t * 2.5) - 22}" y="22" width="44" height="26" rx="8" fill="${C.ink}" opacity="0.55"/>` : "";
  return `<rect x="-170" y="-100" width="340" height="200" rx="22" fill="${C.bg2}" stroke="${C.ink}" stroke-width="8"/>
    <rect x="-146" y="-76" width="206" height="152" rx="14" fill="${C.screen}"/>
    <rect x="-146" y="-76" width="206" height="152" rx="14" fill="${C.accent}" opacity="${glow * on}"/>
    ${plate}
    <line x1="72" y1="-80" x2="72" y2="80" stroke="${C.line}" stroke-width="6"/>
    <rect x="88" y="-74" width="64" height="34" rx="8" fill="${C.bg}"/>
    ${label ? `<text x="120" y="-48" text-anchor="middle" class="svgt" style="font-size:24px;font-weight:800" fill="${on > 0 ? C.green : C.line}">${on > 0 ? "0:30" : "--:--"}</text>` : ""}
    <circle cx="105" cy="0" r="10" fill="${C.line}"/><circle cx="135" cy="0" r="10" fill="${C.line}"/>
    <circle cx="105" cy="34" r="10" fill="${C.line}"/><circle cx="135" cy="34" r="10" fill="${on > 0 ? C.accent : C.line}"/>`;
}

function spinner(t, color = C.ink) {
  const a = t * 360 * 1.2;
  return `<g transform="rotate(${a})"><path d="M 0 -34 A 34 34 0 1 1 -29.4 17" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/></g>`;
}

function phoneScreen(t, bad, okK = 1) { // content inside lib phone (local coords)
  if (bad) return spinner(t, C.muted) +
    `<text x="0" y="86" text-anchor="middle" class="svgt" style="font-size:28px" fill="${C.red}">slow…</text>`;
  const w = 120, k = clamp(okK);
  return `<g transform="translate(0 -20)">${wifiIcon(C.green, 9)}</g>
    <rect x="${-w / 2}" y="62" width="${w}" height="16" rx="8" fill="${C.line}"/>
    <rect x="${-w / 2}" y="62" width="${Math.max(16, w * k)}" height="16" rx="8" fill="${C.green}"/>`;
}

// packets on the router→phone lane; scramble k: 0 clean, 1 drowned out
function packets(t, k, color = C.blue, y = LANE.y) {
  let s = "";
  const n = 7, period = 1.6;
  for (let i = 0; i < n; i++) {
    const p = ((t / period) + i / n) % 1;
    const x = lerp(LANE.x0, LANE.x1, p);
    const dropped = k > 0.5 && rnd(i * 7 + Math.floor(t / period + i / n)) < 0.6 && p > 0.45;
    const jy = k * (rnd(i + Math.floor(t * 12) * 0.37) - 0.5) * 70;
    const jx = k * (rnd(i * 3 + Math.floor(t * 12) * 0.71) - 0.5) * 30;
    const col = k > 0.5 ? C.red : color;
    const fade = Math.min(1, p * 8, (1 - p) * 8) * (dropped ? Math.max(0, 1 - (p - 0.45) * 6) : 1);
    s += `<rect x="${x + jx - 16}" y="${y + jy - 12}" width="32" height="24" rx="6" fill="${col}" opacity="${fade}" transform="rotate(${k * (rnd(i * 5) - 0.5) * 50} ${x + jx} ${y + jy})"/>`;
  }
  return s;
}

function kitchen(t, o) { // o: {on, scramble, okK, lane5}
  const on = o.on || 0, sc = o.scramble || 0;
  const mwRings = on > 0 ? clipAbove(g(rings(t, 1.0, C.accent, 120, 520, 4), { x: MW.x, y: MW.y, o: on })) : "";
  const rtRings = g(rings(t + 0.3, 1.4, C.blue, 40, 150, 3), { x: RT.x, y: RT.y - 70, o: 0.8 });
  const bad = sc > 0.5;
  return CLIP + mwRings + rtRings +
    g(router(C.ink), { x: RT.x, y: RT.y + 10, s: 0.9 }) +
    g(wifiIcon(C.blue, 9), { x: RT.x, y: RT.y - 92, s: 0.9 }) +
    g(phone({ glow: bad ? C.red : C.green, content: phoneScreen(t, bad, o.okK ?? 1) }), { x: PH.x, y: PH.y, s: 0.55 }) +
    packets(t, sc, o.lane5 ? C.green : C.blue) +
    g(microwave(t, on), { x: MW.x, y: MW.y });
}

// spectrum panel for 2.39–2.50 GHz
const FX = f => 150 + (f - 2.39) / 0.11 * 780;
const BASE = 960;
function hump(fc, h, w = 0.011) { // cosine bell around fc (GHz), half-width w
  let d = "";
  for (let i = 0; i <= 40; i++) {
    const f = fc - w + (2 * w) * i / 40, k = Math.cos((f - fc) / w * Math.PI / 2);
    d += `${i ? "L" : "M"}${FX(f).toFixed(1)} ${(BASE - h * k * k).toFixed(1)} `;
  }
  return d;
}
function spectrum(t, wifiK, mwK) {
  let s = `<rect x="110" y="590" width="860" height="440" rx="28" fill="${C.bg2}" opacity="0.75"/>
    <line x1="${FX(2.39)}" y1="${BASE}" x2="${FX(2.50)}" y2="${BASE}" stroke="${C.muted}" stroke-width="5"/>`;
  for (const f of [2.40, 2.45, 2.50]) s += `<line x1="${FX(f)}" y1="${BASE}" x2="${FX(f)}" y2="${BASE + 14}" stroke="${C.muted}" stroke-width="5"/>
    <text x="${FX(f)}" y="${BASE + 52}" text-anchor="middle" class="svgt" style="font-size:30px;font-weight:700" fill="${C.muted}">${f.toFixed(2)}</text>`;
  // Wi-Fi band 2.400–2.4835 GHz and channels 1/6/11
  const band = ease.out(clamp(wifiK * 2));
  s += `<rect x="${FX(2.400)}" y="${BASE - 250}" width="${(FX(2.4835) - FX(2.400)) * band}" height="250" fill="${C.blue}" opacity="0.10"/>`;
  [2.412, 2.437, 2.462].forEach((fc, i) => {
    const k = ease.out(clamp(wifiK * 3 - 0.6 - i * 0.5));
    if (k > 0) s += `<path d="${hump(fc, 170 * k)}" fill="${C.blue}" fill-opacity="0.35" stroke="${C.blue}" stroke-width="5"/>`;
  });
  if (wifiK > 0.3) s += `<text x="140" y="645" class="svgt" style="font-size:34px;font-weight:800" fill="${C.blue}" opacity="${clamp(wifiK * 2 - 0.6)}">Wi-Fi band · 2.4 GHz</text>`;
  if (mwK > 0) { // broad, flickering microwave spike around 2.45 GHz
    let d = `M${FX(2.425)} ${BASE} `;
    for (let i = 0; i <= 30; i++) {
      const f = 2.425 + 0.05 * i / 30, c = Math.cos((f - 2.45) / 0.025 * Math.PI / 2);
      const n = 0.82 + 0.18 * rnd(i * 13 + Math.floor(t * 15));
      d += `L${FX(f).toFixed(1)} ${(BASE - 280 * mwK * c * c * n).toFixed(1)} `;
    }
    s += `<path d="${d}Z" fill="${C.accent}" fill-opacity="0.55" stroke="${C.accent}" stroke-width="5"/>
      <text x="945" y="645" text-anchor="end" class="svgt" style="font-size:34px;font-weight:800" fill="${C.accent}" opacity="${clamp(mwK * 2 - 1)}">Microwave · 2.45 GHz</text>`;
  }
  return s + `<text x="${FX(2.50) + 4}" y="${BASE - 12}" text-anchor="end" class="svgt" style="font-size:26px;font-weight:600" fill="${C.muted}">GHz</text>`;
}

// cross-section: waves bounce inside the metal box, a little escapes
function crossSection(t, leak) {
  const W = 560, Hh = 340, x0 = 110, y0 = 820 - Hh / 2;
  // a ray bouncing between the walls (moving dash)
  let pts = [], x = x0 + 40, y = y0 + 60, dx = 1, dy = 0.62;
  for (let i = 0; i < 11; i++) {
    const tx = dx > 0 ? (x0 + W - 30 - x) / dx : (x0 + 30 - x) / dx;
    const ty = dy > 0 ? (y0 + Hh - 30 - y) / dy : (y0 + 30 - y) / dy;
    const s = Math.min(tx, ty);
    x += dx * s; y += dy * s; pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    if (tx < ty) dx = -dx; else dy = -dy;
  }
  const P = `${x0 + 40},${y0 + 60} ${pts.join(" ")}`;
  const ray = `<polyline points="${P}" fill="none" stroke="${C.accent}" stroke-width="5" stroke-linejoin="round" opacity="0.3"/>
    <polyline points="${P}" fill="none" stroke="${C.accent}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120 4000" stroke-dashoffset="${-((t * 520) % 4100)}"/>`;
  let esc = "";
  if (leak > 0) for (let i = 0; i < 3; i++) {
    const k = ((t * 0.8) + i / 3) % 1;
    esc += `<path d="M ${x0 + W + 40 + k * 230} ${820 - 80} A 110 110 0 0 1 ${x0 + W + 40 + k * 230} ${820 + 80}" fill="none" stroke="${C.accent}" stroke-width="${lerp(9, 3, k)}" opacity="${(1 - k) * leak}"/>`;
  }
  if (leak > 0) esc += `<text x="${x0 + W + 175}" y="${820 + 160}" text-anchor="middle" class="svgt" style="font-size:34px;font-weight:800" fill="${C.accent}" opacity="${leak}">a little</text>
    <text x="${x0 + W + 175}" y="${820 + 200}" text-anchor="middle" class="svgt" style="font-size:34px;font-weight:800" fill="${C.accent}" opacity="${leak}">gets out</text>`;
  return `<rect x="${x0 - 14}" y="${y0 - 14}" width="${W + 28}" height="${Hh + 28}" rx="30" fill="none" stroke="${C.ink}" stroke-width="14"/>
    <rect x="${x0}" y="${y0}" width="${W}" height="${Hh}" rx="18" fill="${C.screen}"/>` + ray +
    esc +
    `<text x="${x0 - 4}" y="${y0 - 36}" class="svgt" style="font-size:32px;font-weight:800" fill="${C.muted}">Inside the microwave: metal walls</text>`;
}

// 1,000 dots = 1,000 W; one blue dot = the router's 1 W
function dotGrid(t, kFill, kRouter) {
  const cols = 50, rows = 20, sp = 16.6, x0 = 540 - (cols - 1) * sp / 2, y0 = 655;
  let s = "", n = Math.floor(1000 * clamp(kFill));
  for (let i = 0; i < 1000; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    s += `<circle cx="${(x0 + c * sp).toFixed(1)}" cy="${(y0 + r * sp).toFixed(1)}" r="6" fill="${i < n ? C.accent : C.line}"/>`;
  }
  const yb = y0 + rows * sp + 60;
  s += `<text x="${x0 - 6}" y="${y0 - 30}" class="svgt" style="font-size:38px;font-weight:800" fill="${C.accent}" opacity="${clamp(kFill * 3)}">Microwave ≈ 1,000 W</text>`;
  if (kRouter > 0) {
    const pulse = 1 + 0.25 * Math.sin(t * 8);
    s += g(`<circle r="${22 * pulse}" fill="${C.blue}" opacity="0.25"/><circle r="9" fill="${C.blue}"/>`, { x: x0 + 4, y: yb, s: ease.back(clamp(kRouter)) }) +
      `<text x="${x0 + 40}" y="${yb + 13}" class="svgt" style="font-size:38px;font-weight:800" fill="${C.blue}" opacity="${clamp(kRouter * 2)}">Router ≤ 1 W</text>` +
      `<text x="${x0 + (cols - 1) * sp + 6}" y="${yb + 13}" text-anchor="end" class="svgt" style="font-size:30px;font-weight:600" fill="${C.muted}" opacity="${clamp(kRouter * 2)}">1 dot = 1 watt</text>`;
  }
  return s;
}

function bandSwitch(k) { // pill toggle 2.4 GHz | 5 GHz, k: 0 → 2.4, 1 → 5
  const x = 540, y = 560, w = 460, h = 76;
  const kx = lerp(x - w / 4, x + w / 4, ease.inOut(clamp(k)));
  return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${C.bg2}" stroke="${C.line}" stroke-width="4"/>
    <rect x="${kx - w / 4 + 6}" y="${y - h / 2 + 6}" width="${w / 2 - 12}" height="${h - 12}" rx="${(h - 12) / 2}" fill="${k > 0.5 ? C.green : C.accent}"/>
    <text x="${x - w / 4}" y="${y + 12}" text-anchor="middle" class="svgt" style="font-size:34px;font-weight:800" fill="${k > 0.5 ? C.muted : C.bg}">2.4 GHz</text>
    <text x="${x + w / 4}" y="${y + 12}" text-anchor="middle" class="svgt" style="font-size:34px;font-weight:800" fill="${k > 0.5 ? C.bg : C.muted}">5 GHz</text>`;
}

function bookmark(k) {
  return g(`<circle r="120" fill="${C.accent}" opacity="0.15"/>
    <path d="M -52 -78 H 52 V 82 L 0 44 L -52 82 Z" fill="${C.accent}" stroke="${C.ink}" stroke-width="8" stroke-linejoin="round"/>`,
    { x: 540, y: 790, s: lerp(0.6, 1, ease.back(clamp(k))), o: clamp(k * 3) });
}

const HOOK_TOP = () => headline(`Why is your Wi-Fi <span style="white-space:nowrap">${hi("slower in the kitchen?")}</span>`, 86);

function SCENE(t, T) {
  // ---------------- Hook + twist ----------------
  if (t < T.start("s1")) {
    const onAt = 0.8;
    const on = ease.out(prog(t, onAt, onAt + 0.3));
    const sc = ease.out(prog(t, onAt + 0.4, onAt + 1.0));
    const same = T.word("twist", "same");
    const tags = appear(t, same - 0.15, 0.35, ease.out);
    let svg = kitchen(t, { on, scramble: sc });
    svg += g(`<rect x="-110" y="-28" width="220" height="56" rx="28" fill="${C.blue}"/><text y="12" text-anchor="middle" class="svgt" style="font-size:32px;font-weight:800" fill="${C.bg}">2.4 GHz</text>`, { x: RT.x, y: RT.y + 120, o: tags, s: lerp(0.7, 1, tags) }) +
      g(`<rect x="-120" y="-28" width="240" height="56" rx="28" fill="${C.accent}"/><text y="12" text-anchor="middle" class="svgt" style="font-size:32px;font-weight:800" fill="${C.bg}">2.45 GHz</text>`, { x: MW.x + 290, y: MW.y - 60, o: tags, s: lerp(0.7, 1, tags) });
    return { top: HOOK_TOP(), svg, glow: on > 0.5 ? C.accent : C.blue };
  }

  // ---------------- Step 1: Wi-Fi band ----------------
  if (t < T.start("s2")) {
    const a = T.start("s1");
    const k = prog(t, T.word("s1", "radio") - 0.2, T.word("s1", "band") + 0.3);
    return {
      top: pill("STEP 1", C.blue) + headline(`Wi-Fi = ${hi("radio waves", C.blue)}`, 84),
      topO: appear(t, a, 0.3, ease.out),
      svg: g(spectrum(t, k, 0), { o: appear(t, a, 0.4, ease.out) }) +
        g(router(C.ink) + g(wifiIcon(C.blue, 9), { y: -100 }), { x: 875, y: 890, s: 0.5, o: appear(t, a + 0.3, 0.4, ease.out) }),
      glow: C.blue,
    };
  }

  // ---------------- Step 2: microwave at 2.45 GHz ----------------
  if (t < T.start("s3a")) {
    const a = T.start("s2");
    const mw = ease.out(prog(t, T.word("s2", "point") - 0.4, T.word("s2", "gigahertz")));
    const inside = appear(t, T.word("s2", "inside") - 0.1, 0.3, ease.out);
    return {
      top: pill("STEP 2", C.accent) + headline(`Microwaves ${hi("use radio waves too")}`, 84),
      topO: appear(t, a, 0.3, ease.out),
      svg: spectrum(t, 1, mw) +
        `<rect x="${FX(2.400)}" y="${BASE - 300}" width="${FX(2.4835) - FX(2.400)}" height="300" fill="none" stroke="${C.accent}" stroke-width="6" stroke-dasharray="16 12" opacity="${inside}"/>` +
        g(microwave(t, 1, false), { x: 870, y: 880, s: 0.42 * lerp(0.6, 1, appear(t, T.word("s2", "microwave") - 0.1)), o: appear(t, T.word("s2", "microwave") - 0.1, 0.3, ease.out) }),
      glow: C.accent,
    };
  }

  // ---------------- Step 3a: metal box, a little gets out ----------------
  if (t < T.start("s3b")) {
    const a = T.start("s3a");
    const leak = ease.out(prog(t, T.word("s3a", "little") - 0.2, T.word("s3a", "out") + 0.2));
    return {
      top: pill("STEP 3", C.accent) + headline(`Metal keeps it in… ${hi("almost")}`, 84),
      topO: appear(t, a, 0.3, ease.out),
      svg: g(crossSection(t, leak), { o: appear(t, a, 0.4, ease.out) }),
      glow: C.accent,
    };
  }

  // ---------------- Step 3b: 1,000 W vs 1 W ----------------
  if (t < T.start("s3c")) {
    const kf = ease.inOut(prog(t, T.word("s3b", "thousand") - 0.4, T.word("s3b", "watts") + 0.5));
    const kr = prog(t, T.word("s3b", "one") - 0.15, T.word("s3b", "one") + 0.3);
    return {
      top: pill("STEP 3", C.accent) + headline(`${hi("1,000 W")} vs ${hi("1 W", C.blue)}`, 92),
      svg: dotGrid(t, kf, kr),
      glow: C.accent,
    };
  }

  // ---------------- Step 3c: drowned out ----------------
  if (t < T.start("pay")) {
    const a = T.start("s3c");
    const sc = ease.out(prog(t, T.word("s3c", "drown") - 0.3, T.word("s3c", "drown") + 0.3));
    return {
      top: headline(`A tiny leak ${hi("drowns out", C.red)} your Wi-Fi`, 84),
      svg: kitchen(t, { on: 1, scramble: Math.max(0.3, sc) }),
      glow: C.red,
    };
  }

  // ---------------- Payoff: 5 GHz ----------------
  if (t < T.start("cta")) {
    const sw = prog(t, T.word("pay", "five") - 0.1, T.word("pay", "five") + 0.4);
    const clean = sw > 0.5;
    const okK = prog(t, T.word("pay", "five") + 0.4, T.start("cta"));
    return {
      top: headline(`The fix: ${hi("5 GHz", C.green)}`, 92),
      svg: bandSwitch(sw) + kitchen(t, { on: 1, scramble: clean ? 0 : 1, okK, lane5: clean }),
      glow: clean ? C.green : C.red,
    };
  }

  // ---------------- CTA (≤ 2 s) ----------------
  const a = T.start("cta");
  return {
    top: headline(`${hi("Save this")} for later`, 96),
    topO: appear(t, a, 0.25, ease.out),
    svg: bookmark(prog(t, a, a + 0.4)),
    html: `<div style="position:absolute;left:0;right:0;top:1000px;text-align:center;font-weight:700;font-size:40px;color:${C.muted};opacity:${appear(t, a + 0.2, 0.3, ease.out)}">Follow <span style="color:${C.ink}">@tech.simple.explained</span></div>`,
    glow: C.accent,
  };
}

function COVER(T) {
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #4", C.accent) + headline(`Why is ${hi("kitchen Wi-Fi")} slow?`, 104),
    svg: g(kitchen(1.37, { on: 1, scramble: 1 }), { y: 90 }),
    glow: C.accent,
  };
}
