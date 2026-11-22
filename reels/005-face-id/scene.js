// Reel 005 — How Face ID works in the dark.
// SCENE(t, T) returns {top, svg, html, glow, noCaptions, topO} for time t.
// Everything is drawn by us: a stylised generic face, a generic phone, no logos.

const FX = 640, FY = 735;               // face centre
const RX = 160, RY = 200;               // head radii
const PX = 190, PY = 760, PS = 0.62;    // phone (lib phone() is 400 px tall)
const CAM = { x: PX, y: PY + (-200 + 36) * PS };   // phone's front camera
const IR = "#FF4D6D";                   // how we draw invisible infrared light
const GREY = "#C9CCD8";                 // infrared camera image

// ---------- deterministic noise ----------
const hash = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };

// ---------- face geometry (face-local coords, 0,0 = centre) ----------
function depth(x, y) {
  const e = 1 - (x / RX) ** 2 - (y / RY) ** 2;
  let z = Math.sqrt(Math.max(e, 0));
  z += 0.45 * Math.exp(-(x * x) / (2 * 18 * 18) - ((y - 25) ** 2) / (2 * 40 * 40));          // nose
  z -= 0.16 * Math.exp(-((Math.abs(x) - 58) ** 2 + (y + 20) ** 2) / (2 * 22 * 22));          // eye sockets
  z += 0.08 * Math.exp(-((Math.abs(x) - 60) ** 2 + (y - 60) ** 2) / (2 * 30 * 30));          // cheeks
  return z;
}
const inFace = (x, y, k = 0.96) => (x / RX) ** 2 + (y / RY) ** 2 < k;

// jittered dot cloud for the projector
const DOTS = (() => {
  const out = [];
  for (let j = -15; j <= 15; j++) for (let i = -12; i <= 12; i++) {
    const x = i * 13.5 + (hash(i, j) - 0.5) * 9, y = j * 13.5 + (hash(j, i) - 0.5) * 9;
    if (inFace(x, y)) out.push({ x, y, z: depth(x, y), k: hash(i + 7, j + 3) });
  }
  return out;
})();

// regular grid for the depth mesh
const GS = 16, GN = 11, GM = 13;
function meshPts(flat) {
  const P = {};
  for (let j = -GM; j <= GM; j++) for (let i = -GN; i <= GN; i++) {
    const x = i * GS, y = j * GS;
    if (inFace(x, y)) P[`${i},${j}`] = { x, y, z: flat ? 0.5 : depth(x, y) };
  }
  return P;
}
const MESH = meshPts(false), FLAT = meshPts(true);

const proj = (p, yaw, dz = 120) => ({ x: p.x * Math.cos(yaw) + (p.z - 0.6) * dz * Math.sin(yaw), y: p.y });

function zColor(z) { // far = blue, mid = green, near = orange
  const k = clamp((z - 0.2) / 1.1);
  const mix = (a, b, u) => { const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16));
    return "#" + pa.map((v, i) => Math.round(lerp(v, pb[i], u)).toString(16).padStart(2, "0")).join(""); };
  return k < 0.5 ? mix(C.blue, C.green, k * 2) : mix(C.green, C.accent, (k - 0.5) * 2);
}

// ---------- drawing ----------
function faceSVG({ fill = "none", stroke = C.muted, feat = C.muted, sw = 7, o = 1, shoulders = 1, at = true }) {
  return g(`
    <path d="M -200 330 Q -190 250 -70 235 L -60 180 L 60 180 L 70 235 Q 190 250 200 330" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" opacity="${shoulders}"/>
    <ellipse cx="-163" cy="12" rx="22" ry="42" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    <ellipse cx="163" cy="12" rx="22" ry="42" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    <ellipse rx="${RX}" ry="${RY}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    <path d="M -158 -45 Q -172 -228 0 -214 Q 172 -228 158 -45 Q 128 -152 0 -150 Q -128 -152 -158 -45 Z" fill="${stroke}" opacity="0.9"/>
    <path d="M -88 -58 Q -58 -74 -28 -58 M 28 -58 Q 58 -74 88 -58" fill="none" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round"/>
    <ellipse cx="-58" cy="-20" rx="22" ry="11" fill="none" stroke="${feat}" stroke-width="${sw * 0.8}"/>
    <ellipse cx="58" cy="-20" rx="22" ry="11" fill="none" stroke="${feat}" stroke-width="${sw * 0.8}"/>
    <circle cx="-58" cy="-20" r="7" fill="${feat}"/><circle cx="58" cy="-20" r="7" fill="${feat}"/>
    <path d="M 2 -8 L -18 52 Q 0 64 18 54" fill="none" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M -52 108 Q 0 136 52 108" fill="none" stroke="${feat}" stroke-width="${sw}" stroke-linecap="round"/>`, at ? { o, x: FX, y: FY } : { o });
}
const darkFace = (o = 1, sh = 1) => faceSVG({ stroke: "#3A4A6E", feat: "#3A4A6E", o, shoulders: sh });
const irFace = (o = 1, sh = 1) => faceSVG({ fill: GREY, stroke: "#8E93A6", feat: "#2B3044", o, shoulders: sh });

function dotsSVG(t0, t, { yaw = 0, colorByDepth = 0, travel = true, from = null, r = 4.2, list = DOTS } = {}) {
  let s = "";
  for (const d of list) {
    const k = travel ? ease.out(prog(t, t0 + d.k * 0.9, t0 + d.k * 0.9 + 0.35)) : 1;
    if (k <= 0) continue;
    const p = proj(d, yaw);
    let x = FX + p.x, y = FY + p.y;
    if (from && k < 1) { x = lerp(from.x, x, k); y = lerp(from.y, y, k); }
    const col = colorByDepth ? zColor(d.z) : IR;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * (from ? lerp(0.6, 1, k) : k)).toFixed(2)}" fill="${col}" opacity="${colorByDepth ? 1 : 0.9}"/>`;
  }
  return s;
}

function meshSVG(P, yaw, o = 1, flat = false) {
  const buckets = ["", "", "", ""], cols = [C.blue, C.green, "#9BDB4D", C.accent];
  for (const key in P) {
    const [i, j] = key.split(",").map(Number), a = P[key];
    for (const nb of [`${i + 1},${j}`, `${i},${j + 1}`]) {
      const b = P[nb]; if (!b) continue;
      const pa = proj(a, yaw), pb = proj(b, yaw);
      const z = (a.z + b.z) / 2, bi = flat ? 0 : Math.min(3, Math.floor(clamp((z - 0.2) / 1.1) * 4));
      buckets[bi] += `M${(FX + pa.x).toFixed(1)} ${(FY + pa.y).toFixed(1)}L${(FX + pb.x).toFixed(1)} ${(FY + pb.y).toFixed(1)}`;
    }
  }
  return buckets.map((d, i) => d ? `<path d="${d}" stroke="${cols[i]}" stroke-width="3.2" fill="none" opacity="${o}"/>` : "").join("");
}

function beam(t, o = 1, color = IR) {
  const top = { x: FX - RX + 20, y: FY - RY + 30 }, bot = { x: FX - RX + 20, y: FY + RY - 30 };
  let waves = "";
  for (let i = 0; i < 4; i++) {
    const k = ((t * 0.9) + i / 4) % 1;
    const x = lerp(CAM.x + 30, top.x, k), hh = lerp(14, (bot.y - top.y) / 2, k);
    const cy = lerp(CAM.y, (top.y + bot.y) / 2, k);
    waves += `<path d="M ${x} ${cy - hh} Q ${x + 24} ${cy} ${x} ${cy + hh}" fill="none" stroke="${color}" stroke-width="5" opacity="${(1 - k) * 0.8}"/>`;
  }
  return `<polygon points="${CAM.x + 18},${CAM.y - 6} ${top.x},${top.y} ${bot.x},${bot.y} ${CAM.x + 18},${CAM.y + 6}" fill="${color}" opacity="${0.13 * o}"/>` + g(waves, { o });
}

function phoneAt(content = "", o = 1, glow = null) {
  return g(phone({ glow, content }), { x: PX, y: PY, s: PS, o });
}

function eyeSlash(k = 1) {
  return `<path d="M -46 0 Q 0 -38 46 0 Q 0 38 -46 0 Z" fill="none" stroke="${C.ink}" stroke-width="7" stroke-linejoin="round"/>
    <circle r="13" fill="${C.ink}"/>` + slash(48, k, C.red);
}
function camIcon(color = C.ink) {
  return `<rect x="-44" y="-28" width="88" height="62" rx="12" fill="none" stroke="${color}" stroke-width="7"/>
    <rect x="-18" y="-40" width="36" height="14" rx="5" fill="${color}"/><circle cy="3" r="17" fill="none" stroke="${color}" stroke-width="7"/>`;
}
function camBrackets(color, w = 420, h = 500, L = 56) {
  const x = w / 2, y = h / 2;
  const c = (sx, sy) => `<path d="M ${sx * x} ${sy * (y - L)} V ${sy * y} H ${sx * (x - L)}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`;
  return c(-1, -1) + c(1, -1) + c(1, 1) + c(-1, 1);
}
function chip(k = 1) {
  let pins = "";
  for (let i = -2; i <= 2; i++) pins += `<rect x="${i * 30 - 6}" y="-112" width="12" height="22" rx="4" fill="${C.muted}"/><rect x="${i * 30 - 6}" y="90" width="12" height="22" rx="4" fill="${C.muted}"/>
    <rect x="-112" y="${i * 30 - 6}" width="22" height="12" rx="4" fill="${C.muted}"/><rect x="90" y="${i * 30 - 6}" width="22" height="12" rx="4" fill="${C.muted}"/>`;
  return pins + `<rect x="-92" y="-92" width="184" height="184" rx="24" fill="${C.bg2}" stroke="${C.ink}" stroke-width="7"/>
    <path d="M 0 -58 L 46 -40 V 0 Q 46 40 0 62 Q -46 40 -46 0 V -40 Z" fill="${C.green}" opacity="${0.25 + 0.75 * k}"/>` + g(lock(1, C.bg, 0.55), { y: 4 });
}
function cloud(color = C.muted) {
  return `<path d="M -70 30 Q -100 30 -100 0 Q -100 -32 -66 -32 Q -58 -70 -14 -70 Q 28 -70 40 -36 Q 92 -40 96 0 Q 98 30 64 30 Z" fill="none" stroke="${color}" stroke-width="8" stroke-linejoin="round"/>`;
}
const NOW = ["0.81", "0.12", "0.57", "0.33", "0.94"], SAVED = ["0.80", "0.13", "0.57", "0.34", "0.93"];
function numRow(y, label, vals, a, hiK = 0) {
  let s = `<text x="166" y="${y + 12}" class="svgt" style="font-size:30px;font-weight:700" fill="${C.muted}" text-anchor="end" opacity="${a}">${label}</text>`;
  vals.forEach((v, i) => {
    const x = 184 + i * 156, k = clamp(a * 5 - i * 0.8);
    const on = clamp(hiK * 5 - i * 0.8);
    s += g(`<rect x="0" y="-36" width="140" height="72" rx="16" fill="${C.bg2}" stroke="${on > 0.5 ? C.green : C.line}" stroke-width="5"/>
      <text x="70" y="13" text-anchor="middle" class="svgt" style="font-size:38px;font-weight:800" fill="${C.ink}">${v}</text>`, { x, y, o: k });
  });
  return s;
}
function label(x, y, txt, color = C.ink, size = 38, anchor = "middle", o = 1) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="svgt" style="font-size:${size}px;font-weight:800" fill="${color}" opacity="${clamp(o)}">${txt}</text>`;
}

const okBadge = (k, r = 40) => badge(check(C.bg, k), C.green, r);
const noBadge = (r = 40) => badge(cross(C.bg), C.red, r);

const HOOK_TOP = () => headline(`How does Face ID work <span style="white-space:nowrap">${hi("in the dark?")}</span>`, 88);

function SCENE(t, T) {
  const s1 = T.start("s1"), s2a = T.start("s2a"), s3a = T.start("s3a");

  // ---------------- Hook + twist: a dark face, then thousands of dots ----------------
  if (t < s1) {
    const wake = appear(t, 0.9, 0.3, ease.out);
    const dotsT = 1.9;
    const inv = T.word("twist", "invisible");
    const screen = wake > 0.5 ? "#24365E" : C.screen;
    let svg = darkFace(0.9) + phoneAt(g(lock(0, C.ink, 0.7), { o: wake }), 1) + g(rings(t, 1.1, IR, 6, 46, 2), { x: CAM.x, y: CAM.y });
    if (t > dotsT) svg += beam(t, ease.out(prog(t, dotsT, dotsT + 0.4))) + dotsSVG(dotsT, t, { from: CAM });
    if (t > inv - 0.1) svg += g(eyeSlash(prog(t, inv, inv + 0.4)), { x: 925, y: 600, s: 0.75, o: appear(t, inv - 0.1, 0.3, ease.out) }) +
      label(925, 668, "invisible", C.ink, 32, "middle", appear(t, inv, 0.3, ease.out));
    return { top: HOOK_TOP(), svg, glow: IR };
  }

  // ---------------- Step 1: infrared light ----------------
  if (t < s2a) {
    const eyesT = T.word("s1", "eyes") - 0.1, camT = T.word("s1", "camera") - 0.4, darkT = T.word("s1", "total") - 0.2;
    const lit = ease.inOut(prog(t, camT, camT + 0.6));
    const fadeDots = 1 - prog(t, s1, s1 + 0.5), sh = 1 - prog(t, s1, s1 + 0.5);
    let svg = (fadeDots > 0 ? g(dotsSVG(0, 99, { travel: false }), { o: fadeDots }) : "") +
      beam(t, appear(t, s1 + 0.2, 0.4, ease.out)) +
      g(darkFace(1, sh), { o: 1 - lit }) + g(irFace(1, sh), { o: lit }) + phoneAt("", 1, IR) +
      label((CAM.x + FX - RX) / 2 + 20, CAM.y - 70, "infrared", IR, 36, "middle", appear(t, s1 + 0.4, 0.3, ease.out));
    const eyeA = appear(t, eyesT, 0.3, ease.out);
    if (t > eyesT) svg += g(eyeSlash(prog(t, eyesT + 0.1, eyesT + 0.5)), { x: 925, y: 600, s: 0.75, o: eyeA }) +
      label(925, 668, "your eyes", C.muted, 30, "middle", eyeA);
    if (lit > 0) svg += g(camBrackets(C.green, 420, 470), { x: FX, y: FY + 10, o: lit }) +
      g(camIcon(C.green), { x: 925, y: 790, s: 0.75, o: lit }) + label(925, 852, "IR camera", C.green, 30, "middle", lit);
    if (t > darkT) {
      const a = appear(t, darkT, 0.35, ease.out);
      svg += g(`<circle r="40" fill="none" stroke="${C.muted}" stroke-width="7"/><path d="M 10 -40 A 40 40 0 1 0 40 10 A 30 30 0 1 1 10 -40 Z" fill="${C.ink}"/>`, { x: 400, y: 1052, o: a, s: 0.7 }) +
        label(445, 1064, "total darkness", C.ink, 36, "start", a) + g(okBadge(prog(t, darkT + 0.2, darkT + 0.5), 24), { x: 740, y: 1052, s: a });
    }
    return {
      top: pill("STEP 1", IR) + headline(`${hi("Invisible", IR)} infrared light`, 80),
      topO: appear(t, s1, 0.3, ease.out), svg, glow: IR,
    };
  }

  // ---------------- Step 2: dots → 30,000+ → 3D depth map ----------------
  if (t < s3a) {
    const s2b = T.start("s2b"), s2c = T.start("s2c");
    const top = pill("STEP 2", C.green);
    if (t < s2c) {
      const proj0 = s2a + 0.9;
      let svg = g(irFace(1, 0), { o: 1 - prog(t, s2a, s2a + 0.5) }) + g(darkFace(1, 0), { o: prog(t, s2a, s2a + 0.5) }) +
        phoneAt("", 1, IR) + beam(t, 1) + dotsSVG(proj0, t, { from: CAM });
      const lab = appear(t, T.word("s2a", "projector") - 0.1, 0.3, ease.out);
      svg += label(PX + 20, PY - 158, "dot projector", IR, 32, "middle", lab);
      let topH = headline(`${hi("Thousands", C.green)} of infrared dots`, 80);
      if (t >= s2b - 0.1) {
        const a = appear(t, s2b - 0.1, 0.4);
        svg += g(`<rect x="-330" y="-92" width="660" height="184" rx="34" fill="${C.bg2}" stroke="${C.green}" stroke-width="5"/>
          <text x="0" y="22" text-anchor="middle" class="svgt" style="font-size:104px;font-weight:800" fill="${C.ink}">30,000+</text>
          <text x="0" y="70" text-anchor="middle" class="svgt" style="font-size:32px;font-weight:700" fill="${C.muted}">dots on the first Face ID iPhone (2017)</text>`,
          { x: 540, y: 992, s: lerp(0.8, 1, a), o: a });
        topH = headline(`The first one: ${hi("30,000+ dots", C.green)}`, 80);
      }
      return { top: top + topH, svg, glow: C.green };
    }
    // depth map: dots take their depth colour, join into a mesh, and turn to show it's 3D
    const col = ease.inOut(prog(t, s2c + 0.1, s2c + 0.7));
    const meshA = ease.inOut(prog(t, T.word("s2c", "depth") - 0.3, T.word("s2c", "depth") + 0.4));
    const yaw = 0.5 * Math.sin(prog(t, T.word("s2c", "builds"), T.start("s3a")) * Math.PI * 2) * ease.out(prog(t, T.word("s2c", "builds"), T.word("s2c", "builds") + 0.6));
    let svg = g(darkFace(1, 0), { o: 0.35 * (1 - meshA) }) +
      g(dotsSVG(0, 99, { travel: false, yaw }), { o: 1 - col }) + g(dotsSVG(0, 99, { travel: false, yaw, colorByDepth: 1, r: 4.6 }), { o: col * (1 - 0.6 * meshA) }) +
      meshSVG(MESH, yaw, meshA);
    const lg = appear(t, T.word("s2c", "depth"), 0.3, ease.out);
    svg += g(`<defs><linearGradient id="dg" x1="0" x2="1"><stop offset="0" stop-color="${C.blue}"/><stop offset="0.5" stop-color="${C.green}"/><stop offset="1" stop-color="${C.accent}"/></linearGradient></defs>
      <rect x="-170" y="-14" width="340" height="28" rx="14" fill="url(#dg)"/>
      <text x="-190" y="12" text-anchor="end" class="svgt" style="font-size:32px" fill="${C.muted}">far</text>
      <text x="190" y="12" class="svgt" style="font-size:32px" fill="${C.muted}">near</text>`, { x: 560, y: 1040, o: lg });
    return { top: top + headline(`A ${hi("3D depth map", C.green)} of your face`, 80), svg, glow: C.green };
  }

  // ---------------- Step 3: numbers in a protected chip, compared ----------------
  if (t < T.start("s3b")) {
    const chipA = appear(t, T.word("s3a", "protected") - 0.2, 0.4);
    const shrink = ease.inOut(prog(t, s3a, T.word("s3a", "numbers") - 0.2));
    const nowA = prog(t, T.word("s3a", "numbers") - 0.3, T.word("s3a", "numbers") + 0.5);
    const savedA = prog(t, T.word("s3a", "compares") - 0.2, T.word("s3a", "compares") + 0.5);
    const match = prog(t, T.word("s3a", "face") - 0.2, T.word("s3a", "up") + 0.1);
    const okT = T.word("s3a", "up") + 0.15;
    let svg = g(g(meshSVG(MESH, 0.25, 1), { x: -FX, y: -FY }), { x: lerp(FX, 540, shrink), y: lerp(FY, 600, shrink), s: lerp(1, 0.05, shrink), o: 1 - shrink });
    svg += g(chip(chipA), { x: 540, y: 600, s: lerp(0.7, 1, chipA), o: chipA }) + label(540, 760, "protected part of the chip", C.muted, 32, "middle", chipA);
    svg += numRow(860, "now", NOW, nowA, match) + numRow(965, "saved", SAVED, savedA, match);
    if (t > okT) svg += g(okBadge(prog(t, okT, okT + 0.3), 30), { x: 540, y: 1055, s: appear(t, okT) }) +
      label(585, 1067, "match", C.green, 36, "start", appear(t, okT, 0.3, ease.out));
    return {
      top: pill("STEP 3", C.accent) + headline(`Your face, ${hi("as numbers")}`, 80),
      topO: appear(t, s3a, 0.3, ease.out), svg, glow: C.accent,
    };
  }

  // ---------------- Step 3b: a photo has no depth ----------------
  if (t < T.start("pay")) {
    const a = T.start("s3b"), depthT = T.word("s3b", "depth") - 0.3;
    const pin = appear(t, a, 0.4);
    const yaw = 0.55 * Math.sin(prog(t, a + 0.8, T.start("pay")) * Math.PI * 2) * ease.out(prog(t, a + 0.8, a + 1.4));
    const photo = g(`<rect x="-200" y="-245" width="400" height="490" rx="10" fill="${C.ink}"/>
      <rect x="-182" y="-227" width="364" height="454" rx="6" fill="#DDE3EE"/>` + g(faceSVG({ fill: "#F4D9C6", stroke: "#7A5C4A", feat: "#3B2A22", sw: 6, shoulders: 1, at: false }), { s: 0.82, y: -10 }),
      { s: lerp(0.85, 1, pin), o: pin });
    let svg = g(photo, { x: FX, y: FY, r: -3 }) + phoneAt("", 1, IR);
    svg += g(meshSVG(FLAT, yaw, 0.95, true), { o: appear(t, a + 0.7, 0.4, ease.out) });
    if (t > depthT) {
      const k = appear(t, depthT);
      svg += g(noBadge(30), { x: 830, y: 1040, s: k }) + label(785, 1053, "no depth", C.red, 40, "end", k);
      svg += g(`<circle r="58" fill="${C.bg}" stroke="${C.red}" stroke-width="6"/>` + lock(0, C.red, 0.8), { x: PX, y: 1010, o: k });
    }
    return { top: headline(`A photo? ${hi("No depth.", C.red)}`, 80), svg, glow: C.red };
  }

  // ---------------- Payoff: the data never leaves the phone ----------------
  if (t < T.narrationEnd) {
    const a = T.start("pay"), appleT = T.word("pay", "Apple") - 0.3;
    const big = ease.out(prog(t, a, a + 0.5));
    const icon = g(meshSVG(MESH, 0, 1), { x: -FX, y: -FY, s: 1 });
    let svg = g(phone({ glow: C.green, content: g(icon, { s: 0.42 }) + g(`<circle r="40" fill="${C.green}"/>` + lock(1, C.bg, 0.55), { y: 150 }) }), { x: 540, y: 740, s: lerp(0.7, 1.05, big) });
    // packets that try to leave and bounce back
    for (let i = 0; i < 3; i++) {
      const k = ((t - a) / 1.4 + i / 3) % 1, out = Math.sin(k * Math.PI);
      const ang = -0.6 + i * 0.6;
      svg += g(`<rect x="-14" y="-14" width="28" height="28" rx="6" fill="${C.green}"/>`, { x: 540 + Math.cos(ang) * (60 + 70 * out), y: 700 + Math.sin(ang) * (60 + 70 * out) - 60, o: 0.9 * (t > a + 0.5 ? 1 : 0) });
    }
    const ca = appear(t, appleT, 0.35, ease.out);
    if (t > appleT) svg += g(cloud(C.muted) + slash(70, prog(t, appleT + 0.2, appleT + 0.6), C.red), { x: 880, y: 650, o: ca, s: 0.9 }) +
      label(880, 735, "Apple", C.muted, 34, "middle", ca);
    svg += label(540, 1060, "stays on your phone", C.green, 44, "middle", appear(t, T.word("pay", "never"), 0.3, ease.out));
    return { top: headline(`Your face data ${hi("never leaves", C.green)} your phone`, 80), svg, glow: C.green };
  }

  // ---------------- End card: open question (no voice) ----------------
  const e = appear(t, T.narrationEnd, 0.4);
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #5", IR) + headline(`Face ID or passcode: ${hi("which do you use?", IR)}`, 84),
    topO: e,
    svg: g(irFace(1, 0) + dotsSVG(0, 99, { travel: false, colorByDepth: 1, r: 3.6 }), { o: e * 0.9, x: 640 - FX * 0.78, y: 800 - FY * 0.78, s: 0.78 }) + g(phoneAt("", 1, IR), { o: e }),
    html: `<div style="position:absolute;left:0;right:0;top:1150px;text-align:center;font-weight:700;font-size:40px;color:${C.muted};opacity:${e}">Follow <span style="color:${C.ink}">@tech.simple.explained</span></div>`,
    glow: IR,
  };
}

function COVER(T) {
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #5", IR) + headline(`${hi("Face ID", IR)} in the dark?`, 112),
    svg: g(darkFace(1, 1) + dotsSVG(0, 99, { travel: false, r: 4.6 }), { y: 120 }) + g(beam(0.3, 1), { y: 120 }) + g(phoneAt(g(lock(1, C.ink, 0.7)), 1, IR), { y: 120 }),
    glow: IR,
  };
}
