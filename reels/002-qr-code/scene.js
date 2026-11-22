// QR-DATA-START
const QRH = {"n": 29, "version": 3, "m": ["11111110010000111000001111111", "10000010001111000110001000001", "10111010001001001011001011101", "10111010011110100110001011101", "10111010101101001001001011101", "10000010000110100111001000001", "11111110101010101010101111111", "00000000100100111000000000000", "00110011101111101010011010000", "00111001110100111110111110111", "10100010011111011011100000110", "00101000111110100010110010001", "10000111110000100101000101100", "00100001011100011001001001111", "01100010010100010011010010011", "00110001010010001000011101000", "10010110101101001110110110010", "01011001110000011001000101010", "10110010111101000110011110000", "00010101010111000010010101110", "01010110101010100111111111111", "00000000100011110101100010011", "11111110100000010101101011010", "10000010010001100100100010000", "10111010011010010110111110101", "10111010101110100101110111010", "10111010110011110100100001001", "10000010000111011000100011010", "11111110010100100011110110010"], "role": ["fffffffffeeeeeeeeddddffffffff", "fffffffffeeeeeeeeddddffffffff", "fffffffffeeeeeeeeddddffffffff", "fffffffffeeeeeeeeddddffffffff", "fffffffffeeeeeeeeddddffffffff", "fffffffffeeeeeeeeddddffffffff", "fffffffffffffffffffffffffffff", "fffffffffeeeeeeeeddddffffffff", "fffffffffeeeeeeeeddddffffffff", "eeeeeefeeeeeeeeeeeddddddddddd", "eeeeeefeeeeeeeeeeeedddddddddd", "eeeeeefeeeeeeeeeeeedddddddddd", "eeeeeefeeeeeeeeeeeedddddddddd", "eeeeeefeeeeeeeeeeeedddddddddd", "eeeeeefeeeeeeeeeeeedddddddddd", "eeeeeefeeeeeeeeeeeedddddddddd", "eeeeeefeeeeeeeeeeeedddddddddd", "reeeeefeeeeeeeeeeeedddddddddd", "rreeeefeeeeeeeeeeeedddddddddd", "rreeeefeeeeeeeeeeeedddddddddd", "rreeeefeeeeeeeeeeeedfffffdddd", "fffffffffeeeeeeeeeedfffffdddd", "fffffffffeeeeeeeeeedfffffdddd", "fffffffffeeeeeeeeeedfffffdddd", "fffffffffeeeeeeeeeedfffffdddd", "fffffffffeeeeeeeeeedddddddddd", "fffffffffeeeeeeeeeedddddddddd", "fffffffffeeeeeeeeeedddddddddd", "fffffffffeeeeeeeeeedddddddddd"], "data_codewords": 26, "total_codewords": 70};
const QRL = {"n": 25, "version": 2, "m": ["1111111001001111001111111", "1000001010011001001000001", "1011101011111010101011101", "1011101001110011001011101", "1011101010000011101011101", "1000001011010001001000001", "1111111010101010101111111", "0000000011001001000000000", "1101001100100111101110110", "1111000100110100111001011", "1001001111100100010111111", "1101100110000101000110010", "1000111110001100011100011", "0110010000111000011101011", "1010001111101010101100101", "0111010100001101000011010", "1110111101010111111110111", "0000000010000010100010111", "1111111010000101101010011", "1000001001010100100010100", "1011101000111010111111001", "1011101011011100010111000", "1011101001111111000011101", "1000001011111101111010000", "1111111011110011100000011"], "role": ["fffffffffddddddddffffffff", "fffffffffddddddddffffffff", "fffffffffddddddddffffffff", "fffffffffddddddddffffffff", "fffffffffddddddddffffffff", "fffffffffddddddddffffffff", "fffffffffffffffffffffffff", "fffffffffddddddddffffffff", "fffffffffddddddddffffffff", "eeeeeefeedddddddddddddddd", "eeeeeefeedddddddddddddddd", "eeeeeefeedddddddddddddddd", "eeeeeefeedddddddddddddddd", "reeeeefeeeddddddddddddddd", "rreeeefeeeedddddddddddddd", "rreeeefeeeedddddddddddddd", "rreeeefeeeedddddfffffdddd", "fffffffffeedddddfffffdddd", "fffffffffeedddddfffffdddd", "fffffffffeedddddfffffdddd", "fffffffffeedddddfffffdddd", "fffffffffeedddddddddddddd", "fffffffffeedddddddddddddd", "fffffffffeedddddddddddddd", "fffffffffeedddddddddddddd"], "data_codewords": 34, "total_codewords": 44};
// QR-DATA-END
// Reel 002 — How a torn QR code still works.
// QRH / QRL above are real codes (make_qr.py): level H and level L for the same text.
// SCENE(t, T) returns {top, svg, html, glow, noCaptions, topO} for time t.

const CX = 540, CY = 815, S = 444;      // main card: centre and size (px)
const PAPER = C.ink, DARK = C.bg;
const TEAR_C = 1.35;                    // tear line x+y = c in card units (0..1); ~15% of the code area (largest safe size on a dark background: 13-18% decodes, 20% fails)
const JIT = [0, .9, -.6, .4, -1, .7, -.3, .8, -.8, .2, .6, -.5, .9, -.2, 0];

// ---------- geometry ----------
function tearPts() { // jagged line from right edge to bottom edge, card units
  const a = [1, TEAR_C - 1], b = [TEAR_C - 1, 1], pts = [];
  for (let i = 0; i < JIT.length; i++) {
    const k = i / (JIT.length - 1), j = (i === 0 || i === JIT.length - 1) ? 0 : JIT[i] * 0.013;
    pts.push([lerp(a[0], b[0], k) + j, lerp(a[1], b[1], k) + j]);
  }
  return pts;
}
const TP = tearPts();
const poly = (pts, s) => pts.map(p => `${(p[0] - 0.5) * s},${(p[1] - 0.5) * s}`).join(" ");
const keepPoly = s => poly([[0, 0], [1, 0], ...TP, [0, 1]], s);
const piecePoly = s => poly([...TP, [1, 1]], s);

// ---------- QR drawing ----------
const PATHS = {};
function cells(q, s, pred) {
  const key = `${q.n}|${s}|${pred.name}`;
  if (PATHS[key]) return PATHS[key];
  const m = s / (q.n + 8), o = -s / 2 + 4 * m;
  let d = "";
  for (let r = 0; r < q.n; r++) for (let c = 0; c < q.n; c++)
    if (pred(q, r, c)) d += `M${(o + c * m).toFixed(2)} ${(o + r * m).toFixed(2)}h${m.toFixed(2)}v${m.toFixed(2)}h${(-m).toFixed(2)}z`;
  return (PATHS[key] = d);
}
const isDark = (q, r, c) => q.m[r][c] === "1";
const darkF = (q, r, c) => isDark(q, r, c) && q.role[r][c] !== "d" && q.role[r][c] !== "e";
const darkD = (q, r, c) => isDark(q, r, c) && q.role[r][c] === "d";
const darkE = (q, r, c) => isDark(q, r, c) && q.role[r][c] === "e";
const lightD = (q, r, c) => !isDark(q, r, c) && q.role[r][c] === "d";
const lightE = (q, r, c) => !isDark(q, r, c) && q.role[r][c] === "e";

function codeBody(q, s, o) {
  const tD = o.tintD || 0, tE = o.tintE || 0;
  let out = `<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${s * 0.03}" fill="${PAPER}"/>`;
  if (tD) out += `<path d="${cells(q, s, lightD)}" fill="#D6E8FF" opacity="${tD}"/>`;
  if (tE) out += `<path d="${cells(q, s, lightE)}" fill="#FFDCCB" opacity="${tE}"/>`;
  out += `<path d="${cells(q, s, darkF)}" fill="${DARK}"/>`;
  out += `<path d="${cells(q, s, darkD)}" fill="${DARK}"/>` + (tD ? `<path d="${cells(q, s, darkD)}" fill="${C.blue}" opacity="${tD}"/>` : "");
  out += `<path d="${cells(q, s, darkE)}" fill="${DARK}"/>` + (tE ? `<path d="${cells(q, s, darkE)}" fill="${C.accent}" opacity="${tE}"/>` : "");
  return out;
}

// A paper QR card centred at 0,0. o: {id, tear, tintD, tintE, rebuilt, ghost, logo, note}
function card(q, s, o = {}) {
  const shadow = `<rect x="${-s / 2 + 10}" y="${-s / 2 + 14}" width="${s}" height="${s}" rx="${s * 0.03}" fill="#000" opacity="0.28"/>`;
  let body = codeBody(q, s, o), out;
  if (o.tear) {
    out = `<defs><clipPath id="keep${o.id}"><polygon points="${keepPoly(s)}"/></clipPath></defs>` +
      `<g clip-path="url(#keep${o.id})">${shadow}${body}</g>` +
      `<polyline points="${poly(TP, s)}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.7"/>`;
  } else out = shadow + body;
  if (o.ghost) out += `<polygon points="${piecePoly(s)}" fill="${PAPER}" fill-opacity="0.08" stroke="${C.accent}" stroke-width="4" stroke-dasharray="10 10" opacity="${o.ghost}"/>`;
  if (o.rebuilt) out += rebuiltCells(q, s, o.rebuilt);
  if (o.logo) out += logoTile(q, s, o.logo);
  if (o.note) out += stickyNote(q, s, o.note);
  return out;
}

function tornPiece(q, s, id) {
  return `<defs><clipPath id="piece${id}"><polygon points="${piecePoly(s)}"/></clipPath></defs>` +
    `<g clip-path="url(#piece${id})">${codeBody(q, s, {})}</g>`;
}

// modules in the torn corner, ordered from the tear line outwards (the "solving" order)
let REB = null;
function rebuiltCells(q, s, k) {
  const M = q.n + 8, m = s / M, o = -s / 2;
  if (!REB) {
    REB = [];
    for (let r = -4; r < q.n + 4; r++) for (let c = -4; c < q.n + 4; c++) {
      const x = (c + 4.5) / M, y = (r + 4.5) / M;
      if (x + y > TEAR_C - 0.03) REB.push({ r, c, d: x + y, h: (r * 7 + c * 13) % 5 });
    }
    REB.sort((a, b) => (a.d + a.h * 0.012) - (b.d + b.h * 0.012));
  }
  const n = Math.floor(REB.length * clamp(k));
  let paper = "", dark = "";
  for (let i = 0; i < n; i++) {
    const { r, c } = REB[i];
    const x = (o + (c + 4) * m).toFixed(2), y = (o + (r + 4) * m).toFixed(2);
    const inCode = r >= 0 && c >= 0 && r < q.n && c < q.n;
    paper += `M${x} ${y}h${m.toFixed(2)}v${m.toFixed(2)}h${(-m).toFixed(2)}z`;
    if (inCode && q.m[r][c] === "1") dark += `M${x} ${y}h${m.toFixed(2)}v${m.toFixed(2)}h${(-m).toFixed(2)}z`;
  }
  return `<defs><clipPath id="cardclip"><rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${s * 0.03}"/></clipPath></defs>` +
    `<g clip-path="url(#cardclip)"><path d="${paper}" fill="${PAPER}"/><path d="${dark}" fill="${C.accent}"/></g>`;
}

function logoTile(q, s, k) { // our own mark (phone + "?"), covering ~8x8 modules in the centre
  const m = s / (q.n + 8), w = 8 * m;
  return g(`<rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" rx="${w * 0.2}" fill="${C.bg2}" stroke="${PAPER}" stroke-width="${m * 0.6}"/>
    <rect x="${-w * 0.2}" y="${-w * 0.33}" width="${w * 0.4}" height="${w * 0.66}" rx="${w * 0.08}" fill="none" stroke="${PAPER}" stroke-width="${m * 0.45}"/>
    <text x="0" y="${w * 0.16}" text-anchor="middle" style="font-family:Inter;font-weight:800;font-size:${w * 0.44}px" fill="${C.accent}">?</text>`,
    { s: lerp(2.2, 1, ease.back(k)), o: clamp(k * 3) });
}

function stickyNote(q, s, k) { // covers the top-left finder square
  const m = s / (q.n + 8), w = 10.5 * m, cx = -s / 2 + 7.5 * m;
  const x = lerp(cx - 420, cx, ease.out(k)), y = lerp(cx - 260, cx, ease.out(k));
  return g(`<rect x="${-w / 2 + 6}" y="${-w / 2 + 10}" width="${w}" height="${w}" rx="8" fill="#000" opacity="0.3"/>
    <rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" rx="8" fill="${C.accent}"/>
    <rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w * 0.16}" rx="8" fill="#000" opacity="0.08"/>`,
    { x, y, r: lerp(-30, -6, ease.out(k)), o: clamp(k * 4) });
}

// ---------- scanner overlays ----------
function brackets(s, color, pad = 26, L = 64) {
  const h = s / 2 + pad;
  const c = (sx, sy) => `<path d="M ${sx * h} ${sy * (h - L)} V ${sy * h} H ${sx * (h - L)}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  return c(-1, -1) + c(1, -1) + c(1, 1) + c(-1, 1);
}
function scanLine(s, k, color = C.green) {
  if (k <= 0 || k >= 1) return "";
  const y = lerp(-s / 2 - 10, s / 2 + 10, k);
  // Thin and translucent inside the card so the code stays scannable; solid ticks outside it.
  return `<rect x="${-s / 2}" y="${y - 10}" width="${s}" height="20" fill="${color}" opacity="0.08"/>
    <line x1="${-s / 2}" y1="${y}" x2="${s / 2}" y2="${y}" stroke="${color}" stroke-width="3" opacity="0.45"/>
    <line x1="${-s / 2 - 30}" y1="${y}" x2="${-s / 2 - 4}" y2="${y}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>
    <line x1="${s / 2 + 4}" y1="${y}" x2="${s / 2 + 30}" y2="${y}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
}
const okBadge = (k, r = 40) => badge(check(C.bg, k), C.green, r);
const noBadge = (r = 40) => badge(cross(C.bg), C.red, r);

function finderMarks(q, s, k, t) {
  const m = s / (q.n + 8), o = -s / 2 + 4 * m, w = 9 * m;
  const centres = [[3.5, 3.5], [q.n - 3.5, 3.5], [3.5, q.n - 3.5]].map(([c, r]) => [o + c * m, o + r * m]);
  const pulse = 1 + 0.05 * Math.sin(t * 7);
  let out = "";
  centres.forEach(([x, y], i) => {
    const a = clamp(k * 3 - i * 0.6);
    out += g(`<rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" rx="14" fill="none" stroke="${C.blue}" stroke-width="9"/>`, { x, y, s: pulse * lerp(1.6, 1, ease.out(a)), o: a });
  });
  return out;
}
function finderLines(q, s, k) {
  const m = s / (q.n + 8), o = -s / 2 + 4 * m;
  const [a, b, c] = [[3.5, 3.5], [q.n - 3.5, 3.5], [3.5, q.n - 3.5]].map(([x, y]) => [o + x * m, o + y * m]);
  const L1 = ease.out(clamp(k * 2)), L2 = ease.out(clamp(k * 2 - 1));
  return `<line x1="${a[0]}" y1="${a[1]}" x2="${lerp(a[0], b[0], L1)}" y2="${lerp(a[1], b[1], L1)}" stroke="${C.blue}" stroke-width="7" stroke-dasharray="14 10" opacity="${L1 ? 1 : 0}"/>
    <line x1="${a[0]}" y1="${a[1]}" x2="${lerp(a[0], c[0], L2)}" y2="${lerp(a[1], c[1], L2)}" stroke="${C.blue}" stroke-width="7" stroke-dasharray="14 10" opacity="${L2 ? 1 : 0}"/>`;
}

// 7x7 zoom window: every square is a 1 or a 0
function digitGrid(q, t, t0, a) {
  const r0 = 9, c0 = 9, N = 7, cell = 72, o = -N * cell / 2;
  let out = `<rect x="${o - 14}" y="${o - 14}" width="${N * cell + 28}" height="${N * cell + 28}" rx="20" fill="${PAPER}"/>`;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const dark = q.m[r0 + r][c0 + c] === "1";
    const x = o + c * cell, y = o + r * cell;
    const k = appear(t, t0 + (r + c) * 0.06, 0.3, ease.out);
    out += `<rect x="${x + 3}" y="${y + 3}" width="${cell - 6}" height="${cell - 6}" rx="8" fill="${dark ? DARK : "#E4DFD3"}"/>` +
      `<text x="${x + cell / 2}" y="${y + cell / 2 + 15}" text-anchor="middle" class="svgt" style="font-size:44px;font-weight:800" fill="${dark ? PAPER : DARK}" opacity="${k}">${dark ? 1 : 0}</text>`;
  }
  return g(out, { x: CX, y: CY, s: lerp(0.6, 1, ease.out(a)), o: a });
}

const HOOK_TOP = () => headline(`How does a QR code still work <span style="white-space:nowrap">${hi("when it's torn?")}</span>`, 84);
const at = (inner, o = {}) => g(inner, { x: CX, y: CY, ...o });

function SCENE(t, T) {
  const s1 = T.start("s1");

  // ---------------- Hook + twist: tear, still scans ----------------
  if (t < s1) {
    const tear = t >= 1.0;
    const fall = ease.inOut(prog(t, 1.0, 2.1));
    const sweep = prog(t, 1.75, 2.65);
    const locked = t >= 2.7;
    const fifth = T.word("twist", "corner");
    const label = appear(t, fifth - 0.1, 0.35, ease.out);
    const fifthEnd = fifth + 0.5;
    const search = t < 0.55 ? scanLine(S, (t + 0.35) / 0.9, C.blue) : "";
    const again = t > fifthEnd ? scanLine(S, ((t - fifthEnd) / 1.3) % 1) : "";
    let svg = at(brackets(S, locked ? C.green : PAPER));
    svg += at(card(QRH, S, { id: "a", tear, ghost: label }) + search + scanLine(S, sweep) + again);
    if (tear && fall < 1) svg += g(tornPiece(QRH, S, "a"), { x: CX + 60 * fall, y: CY + 620 * fall, r: 28 * fall, o: 1 - fall * fall });
    if (locked) svg += g(okBadge(prog(t, 2.7, 3.0)), { x: CX + S / 2 + 72, y: CY - S / 2 + 40, s: appear(t, 2.7) });
    svg += g(`<text x="0" y="0" class="svgt" style="font-size:46px;font-weight:800" fill="${C.accent}">≈ 15%</text>
      <text x="0" y="52" class="svgt" style="font-size:46px;font-weight:800" fill="${C.accent}">gone</text>`,
      { x: CX + S / 2 + 46, y: CY + S / 2 - 70, o: label });
    return { top: HOOK_TOP(), svg, glow: C.accent };
  }

  // ---------------- Step 1: the three big squares ----------------
  if (t < T.start("s2a")) {
    const back = ease.out(prog(t, s1, s1 + 0.45));
    const k1 = prog(t, T.word("s1", "three"), T.word("s1", "three") + 0.9);
    const kl = prog(t, T.word("s1", "where"), T.word("s1", "where") + 0.8);
    const w1 = T.word("s1", "which"), w2 = T.word("s1", "angle"), e = T.start("s2a") - 0.1;
    let ang = 0;
    if (t > w1 - 0.4) ang = lerp(0, -28, ease.inOut(prog(t, w1 - 0.4, w1 + 0.3)));
    if (t > w1 + 0.4) ang = lerp(-28, 150, ease.inOut(prog(t, w1 + 0.4, w2 - 0.1)));
    if (t > w2) ang = lerp(150, 360, ease.inOut(prog(t, w2, e)));
    const inner = brackets(S, C.green) + card(QRH, S, { id: "b", tear: back < 1 }) + finderMarks(QRH, S, k1, t) + finderLines(QRH, S, kl);
    const fit = 1 / Math.sqrt(1 + Math.abs(Math.sin(2 * ang * Math.PI / 180)));
    let svg = at(inner, { r: ang, s: fit });
    if (back < 1) svg += g(tornPiece(QRH, S, "b"), { x: CX + 60 * (1 - back), y: CY + 620 * (1 - back), r: 28 * (1 - back), o: back });
    return {
      top: pill("STEP 1", C.blue) + headline(`3 big squares = ${hi("the map", C.blue)}`, 80),
      topO: appear(t, s1, 0.3, ease.out), svg, glow: C.blue,
    };
  }

  // ---------------- Step 2: bits, message + repair data ----------------
  if (t < T.start("s3a")) {
    const a = T.start("s2a"), b = T.start("s2b");
    if (t < b - 0.15) {
      const out = prog(t, a, a + 0.35);
      const svg = (out < 1 ? at(card(QRH, S, { id: "c" }), { s: lerp(1, 1.5, out), o: 1 - out }) : "") +
        digitGrid(QRH, t, T.word("s2a", "each"), ease.out(prog(t, a + 0.1, a + 0.45)));
      return { top: pill("STEP 2", C.green) + headline(`Each square is a ${hi("1", C.green)} or a ${hi("0", C.green)}`, 76), svg, glow: C.green };
    }
    const inA = ease.out(prog(t, b - 0.15, b + 0.25));
    const tD = ease.inOut(prog(t, T.word("s2b", "message") - 0.1, T.word("s2b", "message") + 0.4));
    const tE = ease.inOut(prog(t, T.word("s2b", "repair") - 0.1, T.word("s2b", "repair") + 0.4));
    return {
      top: pill("STEP 2", C.green) + headline(`Your ${hi("message", C.blue)} + ${hi("repair data", C.accent)}`, 80),
      svg: at(card(QRH, S, { id: "d", tintD: tD, tintE: tE }), { s: lerp(1.25, 1, inA), o: inA }),
      glow: C.green,
    };
  }

  // ---------------- Step 3: solving the missing pieces ----------------
  if (t < T.start("s3b")) {
    const a = T.start("s3a");
    const fall = ease.inOut(prog(t, a + 0.15, a + 0.9));
    const ghost = appear(t, a + 0.7, 0.4, ease.out);
    const w = T.word("s3a", "worked"), l = T.word("s3a", "left");
    const reb = prog(t, w - 0.2, l + 0.3);
    let svg = at(card(QRH, S, { id: "e", tear: true, ghost: ghost * (1 - reb), rebuilt: reb }));
    if (fall < 1) svg += g(tornPiece(QRH, S, "e"), { x: CX + 60 * fall, y: CY + 620 * fall, r: 28 * fall, o: 1 - fall * fall });
    if (reb <= 0 && ghost > 0) svg += g(`<text x="0" y="0" text-anchor="middle" class="svgt" style="font-size:120px;font-weight:800" fill="${C.accent}">?</text>`,
      { x: CX + S * 0.3, y: CY + S * 0.38, o: ghost, s: 1 + 0.05 * Math.sin(t * 6) });
    if (reb >= 1) svg += g(okBadge(prog(t, l + 0.5, l + 0.8)), { x: CX + S / 2 + 72, y: CY - S / 2 + 40, s: appear(t, l + 0.5) });
    return {
      top: pill("STEP 3", C.accent) + headline(`Missing pieces get ${hi("solved")}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.accent,
    };
  }

  // ---------------- Step 3b: low setting vs strongest ----------------
  if (t < T.start("s3c")) {
    const a = T.start("s3b"), sw = prog(t, a + 0.3, a + 1.6), res = T.word("s3b", "thirty") - 0.1;
    const s2 = 400, xL = 290, xH = 790, y = 790;
    const done = t >= res;
    let svg = g(brackets(s2, done ? C.red : PAPER, 20, 52) + card(QRL, s2, { id: "L", tear: true }) + scanLine(s2, sw, C.ink), { x: xL, y, o: appear(t, a, 0.3, ease.out) }) +
      g(brackets(s2, done ? C.green : PAPER, 20, 52) + card(QRH, s2, { id: "H", tear: true }) + scanLine(s2, sw, C.ink), { x: xH, y, o: appear(t, a + 0.1, 0.3, ease.out) });
    const ly = y + s2 / 2 + 84;
    const lab = (x, txt, col) => `<text x="${x}" y="${ly}" class="svgt" style="font-size:44px;font-weight:800" fill="${col}">${txt}</text>`;
    svg += lab(xL - 90, "Low setting", C.muted) + lab(xH - 73, "Strongest", C.ink);
    if (done) svg += g(noBadge(28), { x: xL - 132, y: ly - 15, s: appear(t, res) }) +
      g(okBadge(prog(t, res, res + 0.3), 28), { x: xH - 115, y: ly - 15, s: appear(t, res) });
    return {
      top: pill("STEP 3", C.accent) + headline(`Up to ${hi("~30%")} of the data can be rebuilt`, 76),
      svg, glow: C.accent,
    };
  }

  // ---------------- Step 3c: logo in the middle ----------------
  if (t < T.start("pay")) {
    const a = T.start("s3c"), lg = prog(t, a + 0.15, a + 0.6), okT = T.word("s3c", "middle");
    let svg = at(brackets(S, t > okT ? C.green : PAPER) + card(QRH, S, { id: "f", logo: lg }), { s: lerp(0.9, 1, ease.out(prog(t, a, a + 0.3))) });
    if (t > okT) svg += g(okBadge(prog(t, okT, okT + 0.3)), { x: CX + S / 2 + 72, y: CY - S / 2 + 40, s: appear(t, okT) });
    return { top: headline(`That's why there's ${hi("room for a logo")}`, 80), svg, glow: C.accent };
  }

  // ---------------- Payoff: cover one finder square ----------------
  const N_END = T.narrationEnd;
  if (t < N_END) {
    const nt = prog(t, T.word("pay", "cover") - 0.1, T.word("pay", "cover") + 0.45);
    const fail = T.word("pay", "can't") - 0.1;
    const searching = t < fail;
    const bs = searching ? 1 + 0.035 * Math.sin(t * 9) : 1;
    let svg = at(g(brackets(S, searching ? PAPER : C.red), { s: bs }) + card(QRH, S, { id: "g", note: nt }) +
      (searching && t > T.word("pay", "many") - 0.6 ? scanLine(S, ((t - T.word("pay", "many") + 0.6) / 0.9) % 1, C.ink) : ""));
    if (!searching) svg += g(noBadge(), { x: CX + S / 2 + 72, y: CY - S / 2 + 40, s: appear(t, fail) });
    const top = searching ? headline(`But cover ${hi("one big square", C.red)}…`, 80) : headline(`No map, ${hi("no scan.", C.red)}`, 80);
    return { top, svg, glow: C.red };
  }

  // ---------------- Loop back to the first frame ----------------
  const k = ease.inOut(prog(t, N_END, N_END + 0.55));
  const tail = T.total - 0.35;
  const svg = at(brackets(S, PAPER) + card(QRH, S, { id: "h" }) + (t > tail ? scanLine(S, (t - tail) / 0.9, C.blue) : "") +
    g(stickyNote(QRH, S, 1), { x: -420 * k, y: -700 * k, r: -25 * k, o: 1 - k }));
  return { noCaptions: true, top: HOOK_TOP(), topO: lerp(0, 1, ease.out(prog(t, N_END, N_END + 0.4))), svg, glow: C.accent };
}

function COVER(T) {
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #2", C.accent) + headline(`Why ${hi("torn QR codes")} still work?`, 104),
    svg: g(brackets(S, C.green) + card(QRH, S, { id: "cv", tear: true, ghost: 1 }), { x: CX, y: CY + 150 }) +
      g(okBadge(1), { x: CX + S / 2 + 72, y: CY + 150 - S / 2 + 40 }),
    glow: C.accent,
  };
}
