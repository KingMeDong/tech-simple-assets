// Reel 007 — Why does your phone die faster in the cold?
// SCENE(t, T) returns {top, svg, html, glow, noCaptions, topO} for time t.
// Visual idea: a cut-away battery whose lithium ions swim through a liquid that
// turns to "syrup" in the cold; the phone shuts down while charge is still inside.

const ICE = "#BFE3FF", ION = "#7FD1FF", ELEC = "#FFD166";

// ---------- small helpers ----------
const okBadge = (k, r = 40) => badge(check(C.bg, k), C.green, r);
const noBadge = (r = 40) => badge(cross(C.bg), C.red, r);
const frac = x => x - Math.floor(x);
const rnd = i => frac(Math.sin(i * 127.1 + 311.7) * 43758.5453);

// ion "clock": integral of the ion speed over time (speed changes with temperature)
let TT = null;
function speedAt(t) {
  if (!TT) return 1;
  const slow = TT.word("s2", "slow"), warm = TT.word("pay", "Warm");
  let s = 1;
  if (t > slow) s = lerp(1, 0.16, ease.inOut(prog(t, slow - 0.2, slow + 1.0)));
  if (t > warm) s = lerp(0.16, 1.25, ease.inOut(prog(t, warm, warm + 1.2)));
  return s;
}
const CLK = [];
function ionClock(t) {
  const dt = 1 / 60, n = Math.floor(t / dt);
  while (CLK.length <= n) {
    const i = CLK.length;
    CLK.push(i === 0 ? 0 : CLK[i - 1] + speedAt(i * dt) * dt);
  }
  return CLK[n] + speedAt(t) * (t - n * dt);
}

// ---------- drawings ----------
function snowflake(r, color = ICE, sw = 3) {
  let s = "";
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3, x = Math.cos(a) * r, y = Math.sin(a) * r;
    const bx = Math.cos(a) * r * 0.55, by = Math.sin(a) * r * 0.55;
    const a1 = a + 0.6, a2 = a - 0.6;
    s += `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>` +
      `<line x1="${bx}" y1="${by}" x2="${bx + Math.cos(a1) * r * 0.3}" y2="${by + Math.sin(a1) * r * 0.3}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>` +
      `<line x1="${bx}" y1="${by}" x2="${bx + Math.cos(a2) * r * 0.3}" y2="${by + Math.sin(a2) * r * 0.3}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }
  return s;
}

function snow(t, amount, top = 520, bottom = 1080) {
  if (amount <= 0) return "";
  let s = "";
  const n = Math.round(18 * amount);
  for (let i = 0; i < n; i++) {
    const x = 90 + rnd(i) * 900, sp = 40 + rnd(i + 50) * 50, r = 7 + rnd(i + 90) * 9;
    const y = top + frac((t * sp + rnd(i + 20) * (bottom - top)) / (bottom - top)) * (bottom - top);
    const fade = Math.min(1, (y - top) / 60, (bottom - y) / 60);
    s += g(snowflake(r, ICE, 2.5), { x: x + Math.sin(t * 1.3 + i) * 12, y, r: t * 30 + i * 40, o: 0.55 * fade * amount });
  }
  return s;
}

// thermometer centred at x, bulb centre at y; level 0..1; temp labels
function thermo(level, label, sub) {
  const H = 300, w = 34, col = level > 0.5 ? C.accent : (level > 0.25 ? "#9BB8FF" : C.blue);
  const fillH = lerp(30, H - 20, clamp(level));
  return `<rect x="${-w / 2}" y="${-H}" width="${w}" height="${H}" rx="${w / 2}" fill="${C.bg2}" stroke="${C.ink}" stroke-width="6"/>
    <rect x="${-w / 2 + 9}" y="${-fillH}" width="${w - 18}" height="${fillH}" rx="8" fill="${col}"/>
    <circle cx="0" cy="18" r="34" fill="${col}" stroke="${C.ink}" stroke-width="6"/>
    ${[0.25, 0.5, 0.75].map(k => `<line x1="${w / 2}" y1="${-H * k}" x2="${w / 2 + 16}" y2="${-H * k}" stroke="${C.muted}" stroke-width="4"/>`).join("")}
    <text x="0" y="96" text-anchor="middle" class="svgt" style="font-size:40px;font-weight:800" fill="${col}">${label}</text>
    <text x="0" y="134" text-anchor="middle" class="svgt" style="font-size:28px;font-weight:600" fill="${C.muted}">${sub}</text>`;
}

function battIcon(fill, on = true) { // on-screen battery icon, centred
  const w = 104, h = 50, col = fill < 0.2 ? C.red : C.green;
  return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="none" stroke="${C.ink}" stroke-width="6" opacity="${on ? 1 : 0.25}"/>
    <rect x="${w / 2 + 3}" y="-10" width="8" height="20" rx="3" fill="${C.ink}" opacity="${on ? 1 : 0.25}"/>
    <rect x="${-w / 2 + 8}" y="${-h / 2 + 8}" width="${Math.max(6, (w - 16) * clamp(fill))}" height="${h - 16}" rx="5" fill="${col}" opacity="${on ? 1 : 0}"/>`;
}

function powerIcon(color) {
  return `<path d="M -22 -14 A 30 30 0 1 0 22 -14" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"/>
    <line x1="0" y1="-34" x2="0" y2="-2" stroke="${color}" stroke-width="8" stroke-linecap="round"/>`;
}

// the phone: on = screen lit with battery icon, off = dark
function myPhone(on, fill, extra = "") {
  const content = on > 0
    ? g(battIcon(fill), { y: -30, o: on }) + extra
    : g(powerIcon("#33415F"), { y: 0 });
  return phone({ screen: on > 0 ? C.screen : "#060A14", content });
}

// Cut-away battery centred at 0,0: anode (-) left, cathode (+) right, liquid electrolyte between.
// o: {w, h, t, clock, thick, frozen, ions}
function battery(o) {
  const w = o.w, h = o.h, ew = w * 0.17, lx = -w / 2 + ew, rx = w / 2 - ew, ty = -h / 2;
  const thick = o.thick || 0;
  const liquid = thick > 0
    ? `<rect x="${lx}" y="${ty + 10}" width="${rx - lx}" height="${h - 20}" fill="${C.blue}" opacity="${lerp(0.16, 0.08, thick)}"/>
       <rect x="${lx}" y="${ty + 10}" width="${rx - lx}" height="${h - 20}" fill="${ICE}" opacity="${0.42 * thick}"/>`
    : `<rect x="${lx}" y="${ty + 10}" width="${rx - lx}" height="${h - 20}" fill="${C.blue}" opacity="0.16"/>`;
  // syrup waves
  let waves = "";
  if (thick > 0) {
    for (let k = 0; k < 4; k++) {
      const yy = ty + h * (0.22 + k * 0.19);
      let d = `M ${lx} ${yy}`;
      for (let x = lx; x <= rx; x += 20) d += ` L ${x} ${yy + Math.sin(x / 38 + (o.t || 0) * 0.6 + k) * 6}`;
      waves += `<path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="${0.28 * thick}"/>`;
    }
  }
  // electrodes with layers
  let layers = "";
  for (let k = 0; k < 6; k++) {
    const yy = ty + 22 + k * (h - 44) / 5;
    layers += `<line x1="${-w / 2 + 14}" y1="${yy}" x2="${lx - 10}" y2="${yy}" stroke="#6F7FA6" stroke-width="5" stroke-linecap="round"/>` +
      `<line x1="${rx + 10}" y1="${yy}" x2="${w / 2 - 14}" y2="${yy}" stroke="#B98A6E" stroke-width="5" stroke-linecap="round"/>`;
  }
  // ions
  let ions = "";
  const n = o.ions ?? 20, span = rx - lx;
  for (let i = 0; i < n; i++) {
    const lane = ty + 28 + rnd(i + 3) * (h - 56);
    let x, op = 1;
    if (o.frozen) {
      x = lx + 20 + rnd(i + 7) * (span - 40) + Math.sin((o.t || 0) * 9 + i) * 2.5 * o.frozen;
    } else {
      const p = frac((o.clock || 0) * 0.32 + rnd(i + 11));
      x = lx + p * span;
      op = Math.min(1, p / 0.08, (1 - p) / 0.08);
    }
    ions += `<g transform="translate(${x} ${lane})" opacity="${op}"><circle r="15" fill="${ION}" opacity="0.25"/><circle r="9" fill="${ION}"/>` +
      `<text x="0" y="5" text-anchor="middle" style="font-family:Inter;font-weight:800;font-size:13px" fill="${C.bg}">+</text></g>`;
  }
  return `<rect x="${-w / 2}" y="${ty}" width="${w}" height="${h}" rx="26" fill="${C.bg2}" stroke="${C.ink}" stroke-width="7"/>
    <rect x="${-w / 2 + 8}" y="${ty + 8}" width="${ew - 8}" height="${h - 16}" rx="18" fill="#22314F"/>
    <rect x="${rx}" y="${ty + 8}" width="${ew - 8}" height="${h - 16}" rx="18" fill="#3A2C2A"/>
    ${layers}${liquid}${waves}${ions}
    <text x="${-w / 2 + ew / 2 + 4}" y="${ty - 18}" text-anchor="middle" class="svgt" style="font-size:44px;font-weight:800" fill="${C.ink}">−</text>
    <text x="${w / 2 - ew / 2 - 4}" y="${ty - 18}" text-anchor="middle" class="svgt" style="font-size:44px;font-weight:800" fill="${C.ink}">+</text>`;
}

// external circuit above the battery: wire from (-) over a small phone to (+), electrons flowing
function circuit(w, h, clock, a, lit) {
  const ew = w * 0.17, x1 = -w / 2 + ew / 2, x2 = w / 2 - ew / 2, yb = -h / 2 - 50, yw = -h / 2 - 140;
  const pts = [[x1, yb], [x1, yw], [x2, yw], [x2, yb]];
  const segs = [], L = [];
  let tot = 0;
  for (let i = 0; i < 3; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); L.push(l); tot += l; }
  let el = "";
  for (let k = 0; k < 14; k++) {
    let d = frac(clock * 0.32 + k / 14) * tot, i = 0;
    while (i < 2 && d > L[i]) { d -= L[i]; i++; }
    const q = d / L[i];
    const x = lerp(pts[i][0], pts[i + 1][0], q), y = lerp(pts[i][1], pts[i + 1][1], q);
    if (Math.abs(x) < 50 && y === yw) continue; // hidden behind the device
    el += `<circle cx="${x}" cy="${y}" r="8" fill="${ELEC}"/>`;
  }
  const dev = g(`<rect x="-36" y="-50" width="72" height="100" rx="16" fill="${lit ? C.screen : "#060A14"}" stroke="${C.ink}" stroke-width="6"/>` +
    (lit ? `<circle r="22" fill="${ELEC}" opacity="${0.35 + 0.25 * Math.sin(clock * 6)}"/>` + g(battIcon(0.7), { s: 0.38 }) : ""), { y: yw });
  return g(`<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${C.muted}" stroke-width="7" stroke-linejoin="round"/>` + el + dev, { o: a });
}

function gauge(k, label) { // resistance dial, 0..1
  const r = 62, ang = lerp(-180, 0, clamp(k)) * Math.PI / 180;
  return `<path d="M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0" fill="none" stroke="${C.line}" stroke-width="14" stroke-linecap="round"/>
    <path d="M ${-r} 0 A ${r} ${r} 0 0 1 ${r * Math.cos(ang)} ${r * Math.sin(ang)}" fill="none" stroke="${k > 0.6 ? C.red : C.accent}" stroke-width="14" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="${(r - 14) * Math.cos(ang)}" y2="${(r - 14) * Math.sin(ang)}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>
    <circle r="9" fill="${C.ink}"/>
    <text x="0" y="46" text-anchor="middle" class="svgt" style="font-size:28px;font-weight:700" fill="${C.muted}">${label}</text>`;
}

function bookmark(color) {
  return `<path d="M -34 -48 H 34 V 50 L 0 22 L -34 50 Z" fill="${color}" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>`;
}

const label = (x, y, txt, col, size = 34, anchor = "middle", o = 1) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" class="svgt" style="font-size:${size}px;font-weight:800" fill="${col}" opacity="${o}">${txt}</text>`;

const HOOK_TOP = () => headline(`Why does your phone die faster <span style="white-space:nowrap">${hi("in the cold?", C.blue)}</span>`, 84);

function SCENE(t, T) {
  TT = T;
  const clock = ionClock(t);

  // ---------------- Hook: thermometer drops, battery drains, phone dies ----------------
  if (t < T.start("twist") + 0.35) {
    const cool = ease.inOut(prog(t, 0.0, 1.5));
    const drain = lerp(0.62, 0.04, ease.inOut(prog(t, 0.5, 2.2)));
    const off = t > 2.35;
    const temp = Math.round(lerp(20, -10, cool)), tempF = Math.round(temp * 9 / 5 + 32);
    let svg = snow(t, ease.out(prog(t, 0.3, 1.2)));
    svg += g(myPhone(off ? 0 : 1, drain), { x: 400, y: 830, s: 0.92 });
    if (off) svg += g(label(0, 0, "shut down", C.red, 34), { x: 400, y: 1065, o: appear(t, 2.35, 0.25, ease.out) });
    svg += g(thermo(lerp(0.8, 0.12, cool), `${temp < 0 ? "−" + Math.abs(temp) : temp} °C`, `${tempF} °F`), { x: 790, y: 920 });
    return { top: HOOK_TOP(), svg, glow: C.blue };
  }

  // ---------------- Twist: not empty, stuck ----------------
  if (t < T.start("s1")) {
    const a = T.start("twist"), empty = T.word("twist", "empty"), stuck = T.word("twist", "stuck");
    const xr = ease.out(prog(t, a + 0.5, a + 1.3));
    let svg = snow(t, 1);
    svg += g(myPhone(0, 0), { x: 250, y: 830, s: 0.8 });
    // x-ray beam from the phone to the battery
    svg += `<path d="M 330 700 L ${lerp(330, 560, xr)} 650 L ${lerp(330, 560, xr)} 1010 L 330 960 Z" fill="${C.blue}" opacity="${0.12 * xr}"/>`;
    const bat = battery({ w: 440, h: 250, t, frozen: clamp((t - stuck + 0.2) * 3), ions: 18 });
    svg += g(bat, { x: 765, y: 830, s: lerp(0.6, 1, xr), o: xr });
    if (t > empty - 0.1) svg += label(765, 1040, "still charged", C.green, 36, "middle", appear(t, empty - 0.1, 0.3, ease.out));
    if (t > stuck - 0.15) {
      const k = appear(t, stuck - 0.15, 0.35);
      for (let i = 0; i < 6; i++) svg += g(snowflake(16, "#FFFFFF", 3), { x: 600 + i * 62, y: 720 + (i % 2) * 210, s: k, o: 0.9 * k, r: t * 20 });
    }
    const top = t < empty - 0.6 ? HOOK_TOP() : headline(`Not empty. The charge is ${hi("stuck.", C.blue)}`, 84);
    return { top, svg, glow: C.blue };
  }

  // ---------------- Step 1: ions swim, electrons flow ----------------
  if (t < T.start("s2")) {
    const a = T.start("s1"), w = 820, h = 260, by = 880;
    const inA = appear(t, a, 0.4, ease.out);
    const lw = T.word("s1", "lithium"), lq = T.word("s1", "liquid"), el = T.word("s1", "electron");
    const circ = appear(t, el - 0.6, 0.5, ease.out);
    let svg = g(battery({ w, h, t, clock, ions: 22 }), { x: 540, y: by, s: lerp(0.85, 1, inA), o: inA });
    svg += g(circuit(w, h, clock, circ, true), { x: 540, y: by });
    svg += label(540, by + h / 2 + 52, "lithium ions →", ION, 36, "middle", appear(t, lw - 0.1, 0.3, ease.out) * (t < el - 0.6 ? 1 : 0.0));
    svg += label(540, by - h / 2 - 26, "liquid", C.muted, 32, "middle", appear(t, lq - 0.1, 0.3, ease.out) * (1 - circ));
    svg += label(540, by + h / 2 + 52, "1 ion across = 1 electron through the phone", ELEC, 32, "middle", circ);
    return {
      top: pill("STEP 1", C.blue) + headline(`Ions ${hi("swim", ION)}, electrons ${hi("flow", ELEC)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.blue,
    };
  }

  // ---------------- Step 2: cold liquid turns to syrup ----------------
  if (t < T.start("s3a")) {
    const a = T.start("s2"), w = 600, h = 250, by = 880;
    const cold = ease.inOut(prog(t, T.word("s2", "cold"), T.word("s2", "cold") + 0.8));
    const thick = ease.inOut(prog(t, T.word("s2", "thicker") - 0.2, T.word("s2", "syrup") + 0.4));
    const res = ease.out(prog(t, T.word("s2", "resistance") - 0.3, T.word("s2", "up") + 0.3));
    const temp = Math.round(lerp(20, -10, cold));
    let svg = snow(t, cold);
    svg += g(battery({ w, h, t, clock, thick, ions: 18 }), { x: 520, y: by });
    svg += g(circuit(w, h, clock, 1, true), { x: 520, y: by, s: 1 });
    svg += g(thermo(lerp(0.8, 0.12, cold), `${temp < 0 ? "−" + Math.abs(temp) : temp} °C`, `${Math.round(temp * 9 / 5 + 32)} °F`), { x: 130, y: 900, s: 0.8 });
    svg += g(gauge(lerp(0.15, 0.9, res), "resistance"), { x: 935, y: 900, o: appear(t, T.word("s2", "resistance") - 0.5, 0.3, ease.out) });
    svg += label(520, by + h / 2 + 52, t < T.word("s2", "slow") ? "thick as syrup" : "ions slow down", ICE, 36, "middle", thick);
    const top = t < T.word("s2", "slow") - 0.2
      ? pill("STEP 2", C.blue) + headline(`Cold makes the liquid ${hi("thick", ICE)}`, 80)
      : pill("STEP 2", C.blue) + headline(`Slow ions, ${hi("high resistance", C.red)}`, 80);
    return { top, topO: appear(t, a, 0.3, ease.out), svg, glow: C.blue };
  }

  // ---------------- Step 3a: a burst of power the battery can't deliver ----------------
  if (t < T.start("s3b")) {
    const a = T.start("s3a"), burst = T.word("s3a", "burst"), cant = T.word("s3a", "cant");
    const inA = appear(t, a, 0.4, ease.out);
    const need = ease.back(prog(t, burst - 0.3, burst + 0.3));
    const give = ease.out(prog(t, T.word("s3a", "slow") - 0.2, T.word("s3a", "slow") + 1.0)) * 0.38 + 0.02 * Math.sin(t * 9);
    const flash = need > 0 ? `<circle cx="0" cy="${-150}" r="${30 + 30 * need}" fill="${ELEC}" opacity="${0.25 * need}"/>` : "";
    const camera = g(`<rect x="-44" y="-30" width="88" height="62" rx="12" fill="none" stroke="${C.ink}" stroke-width="6"/>
      <circle r="17" fill="none" stroke="${C.ink}" stroke-width="6"/><rect x="-16" y="-42" width="32" height="14" rx="4" fill="${C.ink}"/>`, { y: 60, s: 0.9, o: appear(t, burst - 0.4, 0.3, ease.out) });
    let svg = snow(t, 0.6) + g(myPhone(1, 0.35, camera) + flash, { x: 270, y: 830, s: 0.9, o: inA });
    // bars: power needed vs power the cold battery can give
    const base = 1040, H = 400, bw = 130;
    const bar = (x, k, col, txt) => `<rect x="${x - bw / 2}" y="${base - H}" width="${bw}" height="${H}" rx="18" fill="${C.line}" opacity="0.5"/>
      <rect x="${x - bw / 2}" y="${base - H * clamp(k)}" width="${bw}" height="${H * clamp(k)}" rx="18" fill="${col}"/>
      ${label(x, base + 46, txt, C.ink, 30)}`;
    svg += g(bar(600, need * 0.92, C.accent, "needed") + bar(830, give, ION, "battery gives"), { o: appear(t, a + 0.4, 0.4, ease.out) });
    if (t > cant - 0.1) {
      const k = appear(t, cant - 0.1, 0.3, ease.out);
      svg += `<rect x="${830 - bw / 2 - 6}" y="${base - H * 0.92}" width="${bw + 12}" height="${H * (0.92 - give)}" rx="18" fill="none" stroke="${C.red}" stroke-width="6" stroke-dasharray="14 10" opacity="${k}"/>` +
        label(830, base - H * 0.92 - 22, "not enough", C.red, 32, "middle", k);
    }
    return {
      top: pill("STEP 3", C.accent) + headline(`A burst of power… ${hi("too slow", C.red)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.accent,
    };
  }

  // ---------------- Step 3b: shuts down with charge inside ----------------
  if (t < T.start("pay")) {
    const a = T.start("s3b"), sh = T.word("s3b", "shuts"), still = T.word("s3b", "still");
    const off = t > sh + 0.15;
    let svg = snow(t, 0.8);
    svg += g(myPhone(off ? 0 : 1, 0.35), { x: 270, y: 830, s: 0.9 });
    if (off) svg += g(label(0, 0, "protecting itself", C.muted, 30), { x: 270, y: 1062, o: appear(t, sh + 0.15, 0.3, ease.out) });
    svg += g(battery({ w: 430, h: 250, t, clock, thick: 1, ions: 18 }), { x: 760, y: 830, o: appear(t, a + 0.3, 0.4, ease.out) });
    if (t > still - 0.1) svg += label(760, 1020, "charge still inside", C.green, 34, "middle", appear(t, still - 0.1, 0.3, ease.out));
    return {
      top: pill("STEP 3", C.accent) + headline(`It shuts down ${hi("to protect itself", C.accent)}`, 80),
      svg, glow: C.accent,
    };
  }

  // ---------------- Payoff: warm it up, charge comes back ----------------
  if (t < T.start("cta")) {
    const a = T.start("pay"), warm = ease.inOut(prog(t, T.word("pay", "Warm"), T.word("pay", "up") + 0.4));
    const on = t > T.word("pay", "comes") - 0.1;
    const temp = Math.round(lerp(-10, 20, warm));
    let svg = snow(t, 1 - warm);
    svg += g(thermo(lerp(0.12, 0.8, warm), `${temp < 0 ? "−" + Math.abs(temp) : temp} °C`, `${Math.round(temp * 9 / 5 + 32)} °F`), { x: 130, y: 900, s: 0.8 });
    svg += g(myPhone(on ? 1 : 0, 0.35), { x: 420, y: 830, s: 0.9 });
    svg += g(battery({ w: 380, h: 230, t, clock, thick: 1 - warm, ions: 16 }), { x: 800, y: 830 });
    if (on) svg += g(okBadge(prog(t, T.word("pay", "comes"), T.word("pay", "comes") + 0.3)), { x: 420, y: 590, s: appear(t, T.word("pay", "comes") - 0.1) });
    return { top: headline(`Warm it up: ${hi("the charge is back", C.green)}`, 80), svg, glow: C.accent };
  }

  // ---------------- CTA (≤ 2 s) ----------------
  const k = appear(t, T.start("cta") - 0.05, 0.35);
  return {
    noCaptions: t > T.narrationEnd,
    top: headline(`${hi("Save this", C.accent)} for winter`, 84),
    svg: snow(t, 0.7) + g(bookmark(C.accent), { x: 540, y: 820, s: lerp(0.6, 1.6, k) }) +
      g(myPhone(1, 0.35), { x: 860, y: 860, s: 0.55, o: k }) + g(battery({ w: 300, h: 180, t, clock, ions: 12 }), { x: 230, y: 860, s: 0.8, o: k }),
    glow: C.accent,
  };
}

function COVER(T) {
  TT = T;
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #7", C.accent) + headline(`Phones dying ${hi("in the cold?", C.blue)}`, 104),
    svg: snow(3.3, 1, 560, 1250) + g(myPhone(1, 0.06), { x: 400, y: 930, s: 1.05 }) +
      g(thermo(0.12, "−10 °C", "14 °F"), { x: 790, y: 1010 }),
    glow: C.blue,
  };
}
