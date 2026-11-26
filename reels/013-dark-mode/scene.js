// Reel 013 — Does dark mode really save battery?
// Idea: LCD vs OLED as a cross-section. On an LCD a backlight lights the whole panel and
// the pixels only block it, so black still costs power. On OLED every pixel is its own
// light and a black pixel is off. Then the Purdue measurements: the saving depends on
// brightness (3–9 % at 30–50 %, 39–47 % at 100 %). Bars are drawn relative to light mode
// (= 100 %) at the same brightness; the dark bars use the middle of each measured range.

const GOLD = "#F5C451";
const LIGHT = { bg: "#EEF1F6", ink: "#2B3448", line: "#B9C1D1", card: "#FFFFFF" };
const DARK_OLED = { bg: "#000000", ink: "#C9D1E0", line: "#343C4E", card: "#11151D" };
const DARK_LCD = { bg: "#232A38", ink: "#C9D1E0", line: "#414B60", card: "#2C3445" }; // backlight glows through
const SUB = ["#FF4D5A", "#2FD08A", "#3D9BFF"];

let CLIP = 0; // unique clipPath ids per frame
const at = (inner, x, y, o = {}) => g(inner, { x, y, ...o });
const lbl = (str, x, y, size, color = C.muted, o = 1, anchor = "middle", w = 700) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" opacity="${clamp(o)}" class="svgt" style="font-size:${size}px;font-weight:${w}" fill="${color}">${str}</text>`;
const num = (str, x, y, size, color = C.ink, o = 1, anchor = "middle") =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" opacity="${clamp(o)}" style="font-family:Inter;font-weight:800;font-size:${size}px;font-variant-numeric:tabular-nums" fill="${color}">${str}</text>`;

// ---------- icons ----------
function sun(r = 30, color = GOLD, spin = 0) {
  let s = `<circle r="${r}" fill="${color}"/>`;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + spin;
    s += `<line x1="${Math.cos(a) * r * 1.35}" y1="${Math.sin(a) * r * 1.35}" x2="${Math.cos(a) * r * 1.75}" y2="${Math.sin(a) * r * 1.75}" stroke="${color}" stroke-width="${r * 0.22}" stroke-linecap="round"/>`;
  }
  return s;
}
function moon(r = 28, color = C.ink, bg = C.bg2) {
  return `<circle r="${r}" fill="${color}"/><circle cx="${r * 0.45}" cy="${-r * 0.35}" r="${r * 0.82}" fill="${bg}"/>`;
}
function toggle(k, s = 1) { // k 0 = light (sun), 1 = dark (moon)
  const track = k < 0.5 ? "#DDE3EE" : "#1A2236";
  const kx = lerp(-46, 46, ease.inOut(clamp(k)));
  return g(`<rect x="-92" y="-46" width="184" height="92" rx="46" fill="${track}" stroke="${C.ink}" stroke-width="6"/>
    <circle cx="${kx}" cy="0" r="34" fill="${k < 0.5 ? "#FFFFFF" : "#0B1426"}"/>` +
    g(k < 0.5 ? sun(12, GOLD) : moon(16, C.ink, "#0B1426"), { x: kx }), { s });
}
function battery(level, color = C.green, s = 1, mark = "") { // vertical, ~110 x 210, centred
  const h = 180, fillH = h * clamp(level) - 16;
  return g(`<rect x="-26" y="-112" width="52" height="18" rx="6" fill="${C.ink}"/>
    <rect x="-55" y="-96" width="110" height="${h + 12}" rx="20" fill="none" stroke="${C.ink}" stroke-width="9"/>
    <rect x="-41" y="${-82 + (h - 16) - fillH}" width="82" height="${Math.max(0, fillH)}" rx="10" fill="${color}"/>` +
    (mark ? num(mark, 0, 30, 90, C.ink) : ""), { s });
}
function lamp(color = GOLD) {
  return `<path d="M -40 -20 L 40 -20 L 24 -70 L -24 -70 Z" fill="${color}"/>
    <line x1="0" y1="-20" x2="0" y2="50" stroke="${C.ink}" stroke-width="8"/><rect x="-36" y="50" width="72" height="12" rx="6" fill="${C.ink}"/>`;
}
function slider(k, label, x0 = 200, x1 = 880, y = 0) { // brightness slider, k 0..1
  const kx = lerp(x0, x1, clamp(k));
  return `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.line}" stroke-width="16" stroke-linecap="round"/>
    <line x1="${x0}" y1="${y}" x2="${kx}" y2="${y}" stroke="${GOLD}" stroke-width="16" stroke-linecap="round"/>
    <circle cx="${kx}" cy="${y}" r="26" fill="${C.ink}"/>` +
    g(sun(10, C.muted), { x: x0 - 60, y }) + g(sun(17, GOLD), { x: x1 + 70, y }) +
    lbl(label, kx, y - 46, 32, GOLD, 1, "middle", 800);
}
function hbar(x, y, w, k, color, left, right, rightColor = color) {
  return `<rect x="${x}" y="${y}" width="${w}" height="56" rx="16" fill="${C.line}" opacity="0.6"/>
    <rect x="${x}" y="${y}" width="${Math.max(30, w * clamp(k))}" height="56" rx="16" fill="${color}"/>
    ${lbl(left, x, y - 18, 34, C.ink, 1, "start", 800)}${lbl(right, x + w, y - 18, 34, rightColor, 1, "end", 800)}`;
}

// ---------- phone screens ----------
function ui(th) { // content inside the phone screen (screen is 172 x 372, centred)
  let s = `<rect x="-86" y="-186" width="172" height="372" rx="28" fill="${th.bg}"/>
    <rect x="-66" y="-140" width="132" height="26" rx="8" fill="${th.line}"/>
    <circle cx="-48" cy="-80" r="18" fill="${th.line}"/>
    <rect x="-22" y="-92" width="88" height="12" rx="6" fill="${th.ink}" opacity="0.8"/>
    <rect x="-22" y="-72" width="60" height="10" rx="5" fill="${th.line}"/>
    <rect x="-66" y="-36" width="132" height="96" rx="14" fill="${th.card}"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="-66" y="${80 + i * 24}" width="${[132, 110, 124, 80][i]}" height="10" rx="5" fill="${th.line}"/>`;
  return s;
}
// phone whose screen wipes from theme a to theme b (k 0..1 = share of b, top to bottom)
function phoneWipe(a, b, k, glow = null) {
  const id = `cl${CLIP++}`;
  const h = 372 * clamp(k);
  const edge = k > 0 && k < 1 ? `<rect x="-86" y="${-186 + h - 3}" width="172" height="6" fill="${GOLD}" opacity="0.9"/>` : "";
  return phone({ glow, content: ui(a) + `<defs><clipPath id="${id}"><rect x="-86" y="-186" width="172" height="${h}"/></clipPath></defs>` +
    `<g clip-path="url(#${id})">${ui(b)}</g>` + edge });
}

// ---------- LCD cross-section ----------
const ROWS = [560, 640, 720, 800, 880, 960];
function lcdStack(t, T) {
  const sA = T.word("lcd", "backlight"), bl = T.word("lcd", "block"), blk = T.word("lcd", "black");
  const xs = { bl: 190, lc: 450, cf: 680, eye: 900 };
  const blOn = appear(t, sA - 0.15, 0.4, ease.out);
  const closed = i => (i >= 2 && i <= 3) && t >= bl - 0.05; // two pixels go black on "block"
  const closeK = ease.out(prog(t, bl - 0.05, bl + 0.3));
  let s = "";
  // rays: backlight -> liquid crystal (always on once the backlight is on)
  ROWS.forEach((y, i) => {
    const flick = 0.7 + 0.3 * Math.sin(t * 9 + i);
    s += `<line x1="${xs.bl + 34}" y1="${y}" x2="${xs.lc - 40}" y2="${y}" stroke="${GOLD}" stroke-width="10" stroke-linecap="round" opacity="${blOn * flick}"/>`;
    const pass = !closed(i);
    const k2 = pass ? 1 : 1 - closeK;
    s += `<line x1="${xs.lc + 40}" y1="${y}" x2="${xs.cf - 40}" y2="${y}" stroke="${GOLD}" stroke-width="10" stroke-linecap="round" opacity="${blOn * flick * k2}"/>`;
    s += `<line x1="${xs.cf + 40}" y1="${y}" x2="${xs.eye - 70}" y2="${y}" stroke="${SUB[i % 3]}" stroke-width="10" stroke-linecap="round" opacity="${blOn * flick * k2}"/>`;
  });
  // backlight panel
  s += `<rect x="${xs.bl - 34}" y="510" width="68" height="500" rx="16" fill="${GOLD}" opacity="${0.25 + 0.75 * blOn}"/>`;
  if (blOn > 0) s += `<rect x="${xs.bl - 58}" y="486" width="116" height="548" rx="30" fill="${GOLD}" opacity="${0.18 * blOn}"/>`;
  // liquid crystal shutters
  ROWS.forEach((y, i) => {
    const c = closed(i) ? closeK : 0;
    s += `<rect x="${xs.lc - 40}" y="${y - 34}" width="80" height="68" rx="10" fill="${C.bg2}" stroke="${C.muted}" stroke-width="4"/>`;
    // shutter blades: open = thin, closed = full
    s += `<rect x="${xs.lc - 36}" y="${y - 30}" width="72" height="${lerp(8, 60, c)}" rx="6" fill="${c > 0.5 ? "#05070B" : C.line}"/>`;
  });
  // colour filter
  ROWS.forEach((y, i) => { s += `<rect x="${xs.cf - 40}" y="${y - 34}" width="80" height="68" rx="10" fill="${SUB[i % 3]}" opacity="0.85"/>`; });
  // what you see: a column of pixels
  ROWS.forEach((y, i) => {
    const dark = closed(i) ? closeK : 0;
    s += `<rect x="${xs.eye - 52}" y="${y - 34}" width="104" height="68" rx="12" fill="${dark > 0.5 ? "#000" : SUB[i % 3]}" stroke="${C.ink}" stroke-width="4"/>`;
  });
  s += lbl("backlight", xs.bl, 1072, 32, GOLD, 1 - appear(t, blk - 0.15, 0.2, ease.out), "middle", 800) + lbl("liquid", xs.lc, 1056, 30, C.ink, 1, "middle", 800) + lbl("crystal", xs.lc, 1090, 30, C.ink, 1, "middle", 800) +
    lbl("color", xs.cf, 1056, 30, C.ink, 1, "middle", 800) + lbl("filter", xs.cf, 1090, 30, C.ink, 1, "middle", 800) + lbl("you see", xs.eye, 1072, 32, C.ink, 1, "middle", 800);
  // "black still lit from behind": the backlight stays on, marked
  const bA = appear(t, blk - 0.15, 0.35);
  if (bA > 0) {
    s += at(`<rect x="-100" y="-30" width="200" height="60" rx="30" fill="${C.red}"/>` + lbl("still ON", 0, 11, 32, C.bg, 1, "middle", 800), xs.bl + 20, 1072, { s: bA, o: bA });
    s += `<rect x="${xs.eye - 66}" y="${ROWS[2] - 46}" width="132" height="172" rx="18" fill="none" stroke="${C.ink}" stroke-width="5" stroke-dasharray="10 8" opacity="${bA}"/>`;
  }
  return s;
}

// ---------- OLED pixel grid ----------
function oledGrid(t, T) {
  const cols = 7, rows = 5, cw = 108, ch = 96, x0 = 540 - (cols * cw) / 2 - 40, y0 = 545;
  const own = T.word("oled", "every"), off = T.word("oled", "switched");
  const offK = ease.out(prog(t, off - 0.1, off + 0.35));
  // a dark-mode screen: only a few pixels stay lit (a line of text), the rest switch off
  const keep = (r, c) => (r === 1 && c >= 1 && c <= 4) || (r === 3 && c >= 1 && c <= 2);
  let s = "", lit = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = x0 + c * cw + cw / 2, y = y0 + r * ch + ch / 2;
    const wave = appear(t, own - 0.25 + (c + r) * 0.06, 0.3, ease.out);
    const on = wave * (keep(r, c) ? 1 : 1 - offK);
    lit += on;
    s += `<rect x="${x - 46}" y="${y - 40}" width="92" height="80" rx="12" fill="#000" stroke="${C.line}" stroke-width="3"/>`;
    for (let k = 0; k < 3; k++) {
      const sx = x - 30 + k * 30;
      if (on > 0.02) s += `<rect x="${sx - 13}" y="${y - 32}" width="26" height="64" rx="8" fill="${SUB[k]}" opacity="${0.35 * on}"/>`;
      s += `<rect x="${sx - 8}" y="${y - 26}" width="16" height="52" rx="6" fill="${on > 0.02 ? SUB[k] : "#11151D"}" opacity="${on > 0.02 ? 0.25 + 0.75 * on : 1}"/>`;
    }
  }
  // power meter on the right: follows the number of lit pixels
  const total = cols * rows, frac = lit / total;
  const mx = 960, mTop = 545, mH = 480;
  s += `<rect x="${mx - 24}" y="${mTop}" width="48" height="${mH}" rx="20" fill="${C.line}" opacity="0.6"/>
    <rect x="${mx - 24}" y="${mTop + mH * (1 - frac)}" width="48" height="${mH * frac}" rx="20" fill="${C.green}"/>` +
    lbl("power", mx, mTop + mH + 50, 30, C.green, 1, "middle", 800);
  if (offK > 0) s += lbl("off = no light, no power", x0 + 3 * cw + cw / 2, y0 + rows * ch + 46, 32, C.ink, offK, "middle", 800);
  return s;
}

const HOOK_TOP = () => headline(`Does ${hi("dark mode")} really save <span style="white-space:nowrap">battery?</span>`, 86);

function SCENE(t, T) {
  CLIP = 0;
  // ---------------- Hook: a screen flips to dark, the battery asks "?" ----------------
  if (t < T.start("twist")) {
    const d = clamp(0.3 + t * 0.65);                // already moving at frame 0
    const bat = T.word("hook", "battery");
    const q = appear(t, bat - 0.2, 0.35);
    const lvl = 0.55 + 0.05 * Math.sin(t * 6);
    const svg = at(phoneWipe(LIGHT, DARK_OLED, d, C.blue), 400, 770, { s: 1.2, r: lerp(-4, 0, ease.out(prog(t, 0, 0.8))) }) +
      at(battery(lvl, C.green, 1, q > 0.5 ? "?" : ""), 790, 690, { s: lerp(0.9, 1, q) }) +
      at(toggle(d), 790, 960);
    return { top: HOOK_TOP(), svg, glow: C.blue };
  }

  // ---------------- Twist: on some screens it barely makes a difference ----------------
  if (t < T.start("lcd")) {
    const a = T.start("twist");
    const inA = ease.out(prog(t, a, a + 0.4));
    const flip = ease.inOut(prog(t, T.word("twist", "screens") - 0.2, T.word("twist", "screens") + 0.5));
    const br = appear(t, T.word("twist", "barely") - 0.1, 0.35, ease.out);
    const lcd = at(phoneWipe(LIGHT, DARK_LCD, flip), 300, 790, { s: 0.9, o: inA });
    const oled = at(phoneWipe(LIGHT, DARK_OLED, flip), 780, 790, { s: 0.9, o: inA * 0.35 });
    let svg = lcd + oled + lbl("LCD", 300, 560, 40, C.ink, inA, "middle", 800) + lbl("OLED", 780, 560, 40, C.muted, inA * 0.6, "middle", 800);
    // LCD power bar: barely moves
    const pk = lerp(1, 0.96, flip);
    svg += `<rect x="170" y="1010" width="260" height="36" rx="14" fill="${C.line}" opacity="0.6"/><rect x="170" y="1010" width="${260 * pk}" height="36" rx="14" fill="${C.accent}" opacity="${inA}"/>`;
    svg += lbl(br > 0.5 ? "power: barely changes" : "power", 300, 1086, 30, C.accent, inA, "middle", 800);
    svg += lbl("?", 780, 1060, 80, C.muted, inA * 0.6, "middle", 800);
    return { top: headline(`On some screens, it ${hi("barely helps")}`, 86), svg, glow: C.accent };
  }

  // ---------------- LCD: backlight behind everything, pixels only block it ----------------
  if (t < T.start("oled")) {
    const a = T.start("lcd");
    const sA = T.word("lcd", "backlight"), blk = T.word("lcd", "black");
    if (t < sA - 0.3) { // an LCD phone in dark mode, the glow behind it
      const k = ease.out(prog(t, a, a + 0.4));
      const pulse = 0.5 + 0.5 * Math.sin(t * 5);
      const svg = at(`<rect x="-130" y="-230" width="260" height="460" rx="56" fill="${GOLD}" opacity="${0.10 + 0.08 * pulse}"/>` + phoneWipe(LIGHT, DARK_LCD, 1), 540, 760, { s: lerp(0.9, 1.1, k) }) +
        lbl("LCD", 540, 1050, 40, C.ink, k, "middle", 800) + lbl("older phones", 540, 1090, 30, C.muted, k, "middle", 700);
      return { top: pill("LCD", GOLD) + headline(`Lit from ${hi("behind", GOLD)}`, 84), topO: k, svg, glow: GOLD };
    }
    const top = t < blk - 0.2 ? headline(`${hi("LCD:", GOLD)} one ${hi("backlight", GOLD)} behind it all`, 80)
      : headline(`${hi("LCD:", GOLD)} even black costs <span style="white-space:nowrap">${hi("power", C.red)}</span>`, 80);
    return { top, svg: g(lcdStack(t, T), { o: appear(t, sA - 0.3, 0.3, ease.out) }), glow: GOLD };
  }

  // ---------------- OLED: every pixel is its own light; black = off ----------------
  if (t < T.start("study")) {
    const a = T.start("oled");
    const k = ease.out(prog(t, a, a + 0.35));
    const off = T.word("oled", "black");
    const top = t < off - 0.2 ? headline(`${hi("OLED:", C.green)} every pixel is its <span style="white-space:nowrap">${hi("own light", C.green)}</span>`, 80)
      : headline(`${hi("OLED:", C.green)} a black pixel is <span style="white-space:nowrap">${hi("switched off")}</span>`, 80);
    let svg = oledGrid(t, T);
    if (t < T.word("oled", "every") - 0.25) svg += at(`<rect x="-190" y="-44" width="380" height="88" rx="44" fill="${C.bg2}" stroke="${C.green}" stroke-width="4"/>` + lbl("no backlight", 0, 15, 44, C.ink, 1, "middle", 800), 500, 785, { o: k });
    return { top, topO: k, svg, glow: C.green };
  }

  // ---------------- Study: how much does it save? ----------------
  if (t < T.start("low")) {
    const a = T.start("study");
    const q = appear(t, a, 0.35);
    const res = T.word("study", "University");
    const rA = appear(t, res - 0.15, 0.4, ease.out);
    let svg = "";
    if (t < res - 0.15) svg += lbl("?", 540, 860, 300, C.accent, q, "middle", 800) + at(battery(0.6, C.green, 0.8), 820, 760, { o: q });
    else {
      for (let i = 0; i < 4; i++) {
        const x = 195 + i * 230, bob = Math.sin(t * 3 + i) * 4;
        svg += at(phoneWipe(LIGHT, DARK_OLED, prog(t, res + 0.4 + i * 0.15, res + 0.9 + i * 0.15)), x, 720 + bob, { s: 0.7, o: rA });
        svg += `<line x1="${x}" y1="870" x2="${x}" y2="930" stroke="${C.line}" stroke-width="6" opacity="${rA}"/>`;
      }
      svg += g(`<rect x="160" y="930" width="760" height="70" rx="20" fill="${C.bg2}" stroke="${C.accent}" stroke-width="4"/>` +
        lbl("power meter", 540, 978, 34, C.ink, 1, "middle", 800), { o: rA });
      svg += lbl("Purdue University · 2021 · 6 popular apps", 540, 1070, 30, C.muted, rA, "middle", 700);
    }
    const top = t < res - 0.15 ? headline(`How much does it ${hi("save")}?`, 88) : headline(`Researchers ${hi("measured")} it`, 88);
    return { top, svg, glow: C.accent };
  }

  // ---------------- Low / high brightness: the saving depends on brightness ----------------
  if (t < T.start("pay")) {
    const a = T.start("low"), hA = T.start("high");
    const hiK = ease.inOut(prog(t, hA - 0.05, hA + 0.6));
    const bk = lerp(0.4, 1, hiK);
    const showA = appear(t, a, 0.4, ease.out);
    const darkLow = 0.94, darkHigh = 0.57;     // middle of 3–9 % and 39–47 %
    const grow = ease.out(prog(t, T.word("low", "dark") - 0.2, T.word("low", "saved") + 0.2));
    const dk = lerp(1, lerp(darkLow, darkHigh, hiK), grow);
    let svg = g(slider(bk, hiK < 0.5 ? "30–50 %" : "100 %"), { y: 600, o: showA });
    svg += lbl("brightness", 540, 680, 30, C.muted, showA, "middle", 700);
    svg += g(hbar(140, 790, 800, ease.out(prog(t, a, a + 0.5)), "#DDE3EE", "light mode", "100 %", C.ink), { o: showA });
    const saveLbl = hiK < 0.5 ? "only 3–9 % less" : "39–47 % less";
    svg += g(hbar(140, 930, 800, dk, C.green, "dark mode", grow > 0.6 ? saveLbl : "", hiK < 0.5 ? C.accent : C.green), { o: showA });
    svg += lbl("average saving on OLED phones, same brightness", 540, 1050, 28, C.muted, showA, "middle", 600);
    const top = t < hA - 0.1 ? headline(`Indoors: ${hi("3–9 %")}`, 96) : headline(`Full brightness: ${hi("~40 %", C.green)}`, 96);
    return { top, svg, glow: hiK < 0.5 ? C.accent : C.green };
  }

  // ---------------- Payoff: sunlight -> dark mode; indoors -> dim the screen ----------------
  if (t < T.start("cta")) {
    const a = T.start("pay"), ind = T.word("pay", "Indoors");
    if (t < ind - 0.2) {
      const k = ease.out(prog(t, a, a + 0.4));
      const sk = appear(t, T.word("pay", "sunlight") - 0.2, 0.35);
      const svg = at(sun(70, GOLD, t * 0.6), 280, 640, { s: lerp(0.6, 1, k), o: k }) +
        at(phoneWipe(DARK_OLED, DARK_OLED, 1, C.green), 640, 760, { s: 1.05, o: k }) +
        at(badge(check(C.bg, prog(t, T.word("pay", "sunlight") - 0.1, T.word("pay", "sunlight") + 0.3)), C.green, 52), 800, 560, { s: sk, o: sk }) +
        lbl("bright sunlight", 280, 830, 36, GOLD, k, "middle", 800) + lbl("→ dark mode", 280, 880, 36, C.green, sk, "middle", 800);
      return { top: headline(`Best in ${hi("bright sunlight", GOLD)}`, 88), svg, glow: GOLD };
    }
    // indoors: light mode dimmed from 50 % to 20 % draws about what dark mode at 50 % draws
    const k = ease.out(prog(t, ind - 0.2, ind + 0.3));
    const dim = ease.inOut(prog(t, T.word("pay", "turning") - 0.1, T.word("pay", "down") + 0.4));
    const eq = appear(t, T.word("pay", "just") - 0.1, 0.35);
    const lightK = lerp(1, 0.93, dim);
    let svg = at(lamp(GOLD), 150, 600, { o: k }) + g(slider(lerp(0.5, 0.2, dim), dim < 0.5 ? "50 %" : "20 %", 300, 860, 0), { y: 600, o: k });
    svg += lbl("light mode, brightness down", 580, 690, 30, C.muted, k, "middle", 700);
    svg += g(hbar(140, 800, 800, lightK, "#DDE3EE", `light mode · ${dim < 0.5 ? "50 %" : "20 %"}`, ""), { o: k });
    svg += g(hbar(140, 930, 800, 0.93, C.green, "dark mode · 50 %", ""), { o: k });
    svg += at(badge(`<text y="18" text-anchor="middle" style="font-family:Inter;font-weight:800;font-size:56px" fill="${C.bg}">=</text>`, C.green, 40), 970, 895, { s: eq, o: eq });
    svg += lbl("one measured example (Purdue)", 540, 1060, 28, C.muted, eq, "middle", 600);
    return { top: headline(`Indoors: ${hi("turn it down")}`, 92), svg, glow: GOLD };
  }

  // ---------------- CTA: open question ----------------
  const a = T.start("cta");
  const k = ease.out(prog(t, a, a + 0.35));
  const flipK = 0.5 + 0.5 * Math.sin((t - a) * 3.2 - Math.PI / 2);
  return {
    noCaptions: t > T.narrationEnd,
    top: headline(`Is your phone in ${hi("dark mode")} <span style="white-space:nowrap">right now?</span>`, 88),
    topO: k,
    svg: at(toggle(flipK, 2.2), 540, 760, { o: k }) + lbl("light", 300, 920, 40, C.muted, k, "middle", 800) + lbl("dark", 780, 920, 40, C.muted, k, "middle", 800),
    glow: C.blue,
  };
}

function COVER(T) {
  CLIP = 0;
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #13", C.accent) + headline(`Does ${hi("dark mode")} really save battery?`, 96),
    svg: at(phoneWipe(LIGHT, DARK_OLED, 0.5, C.blue), 390, 1000, { s: 1.22 }) + at(battery(0.55, C.green, 1.1, "?"), 790, 960) + at(toggle(1, 1.1), 790, 1185),
    glow: C.blue,
  };
}
