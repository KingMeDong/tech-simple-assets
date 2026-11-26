// Reel 012 — How does a Bluetooth tracker find your lost keys, with no GPS?
// Idea: a top-down café floor plan. Keys with a tag sit on a table and keep sending a
// Bluetooth signal. Strangers walk past; their phones hear it, lock their own location in a
// box only the owner can open, and send it up. The owner's phone opens the boxes and drops a pin.
// No brands, logos or product names. Times on screen ("2 min ago") are made-up examples.

const GOLD = "#F5C451";
const CF = { x: 540, y: 830 };            // café floor plan centre
const KT = { x: -190, y: -20 };           // keys' table, relative to the café centre
const AISLE = 150;                        // walking line, relative y

// ---------- helpers ----------
const at = (inner, x, y, o = {}) => g(inner, { x, y, ...o });
const lbl = (str, x, y, size, color = C.muted, o = 1, anchor = "middle", w = 700) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" opacity="${clamp(o)}" class="svgt" style="font-size:${size}px;font-weight:${w}" fill="${color}">${str}</text>`;
const okBadge = (k, r = 30) => badge(check(C.bg, k), C.green, r);
const noBadge = (r = 30) => badge(cross(C.bg), C.red, r);

// ---------- icons ----------
function keys(s = 1, swing = 0) { // key ring + two keys, centred on the ring
  const key = r => g(`<circle cx="0" cy="34" r="17" fill="none" stroke="${GOLD}" stroke-width="9"/>
      <path d="M 0 51 V 112 M 0 84 H 18 M 0 100 H 14" fill="none" stroke="${GOLD}" stroke-width="9" stroke-linecap="round"/>`, { r });
  return g(`<circle r="26" fill="none" stroke="${GOLD}" stroke-width="8"/>` + g(key(-18) + key(22), { r: swing }), { s });
}
function tag(s = 1, glow = 0) { // round item tracker, generic (no brand)
  return g(`${glow ? `<circle r="70" fill="${C.blue}" opacity="${0.25 * glow}"/>` : ""}
    <circle r="48" fill="${C.ink}"/><circle r="38" fill="none" stroke="${C.muted}" stroke-width="3" opacity="0.6"/>
    <circle r="12" fill="${C.blue}"/>`, { s });
}
function keysWithTag(t, s = 1) { // keys hanging, tag on the ring
  const sw = Math.sin(t * 2.4) * 6;
  return g(keys(1, sw) + g(tag(0.62), { x: 46, y: 34 }), { s });
}
function sat(color = C.muted) { // simple satellite
  return `<rect x="-18" y="-18" width="36" height="36" rx="6" fill="${color}"/>
    <rect x="-74" y="-12" width="46" height="24" rx="4" fill="none" stroke="${color}" stroke-width="6"/>
    <rect x="28" y="-12" width="46" height="24" rx="4" fill="none" stroke="${color}" stroke-width="6"/>
    <line x1="-28" y1="0" x2="-18" y2="0" stroke="${color}" stroke-width="6"/><line x1="18" y1="0" x2="28" y2="0" stroke="${color}" stroke-width="6"/>`;
}
function noGPS(k = 1) { // satellite with a red slash + label
  return `<rect x="-120" y="-78" width="240" height="156" rx="30" fill="${C.bg2}" stroke="${C.red}" stroke-width="5"/>` +
    g(sat(C.muted), { y: -22, s: 0.75 }) + g(slash(46, k), { y: -22 }) + lbl("no GPS", 0, 58, 34, C.red, 1, "middle", 800);
}
function pin(color = C.accent, s = 1) { // tip at 0,0
  return g(`<path d="M 0 0 C -22 -30 -34 -46 -34 -66 A 34 34 0 1 1 34 -66 C 34 -46 22 -30 0 0 Z" fill="${color}"/>
    <circle cx="0" cy="-66" r="13" fill="${C.bg}"/>`, { s });
}
function person(phoneGlow = 0, color = C.muted) { // top-down: shoulders + head, phone in hand
  return `<ellipse rx="34" ry="20" fill="${color}" opacity="0.9"/><circle r="17" fill="${C.ink}" opacity="0.9"/>
    ${phoneGlow > 0 ? `<circle cx="30" cy="-30" r="${26 + 6 * phoneGlow}" fill="${C.blue}" opacity="${0.35 * phoneGlow}"/>` : ""}
    <rect x="22" y="-42" width="16" height="26" rx="4" fill="${phoneGlow > 0.5 ? C.blue : C.bg2}" stroke="${C.ink}" stroke-width="3"/>`;
}
function lockBox(k = 1, s = 1, inner = "") { // a small box with a padlock: k 0 open, 1 locked
  return g(`<rect x="-70" y="-50" width="140" height="100" rx="20" fill="${C.bg2}" stroke="${GOLD}" stroke-width="6"/>` + inner +
    g(lock(k, GOLD, 0.6), { y: -50 }), { s });
}
function cloud(color = C.line, s = 1) {
  return g(`<path d="M -120 40 A 50 50 0 0 1 -90 -40 A 70 70 0 0 1 40 -60 A 60 60 0 0 1 130 0 A 42 42 0 0 1 110 40 Z" fill="${color}"/>`, { s });
}
function building(color = C.muted) {
  let w = "";
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) w += `<rect x="${-46 + c * 34}" y="${-60 + r * 38}" width="22" height="24" rx="4" fill="${C.bg}"/>`;
  return `<rect x="-70" y="-90" width="140" height="180" rx="10" fill="${color}"/>${w}<rect x="-16" y="54" width="32" height="36" fill="${C.bg}"/>`;
}
function anon() { // anonymous helper
  return `<circle cy="-34" r="28" fill="${C.line}"/><path d="M -52 50 Q -52 -4 0 -4 Q 52 -4 52 50 Z" fill="${C.line}"/>` +
    lbl("?", 0, -20, 46, C.ink, 1, "middle", 800);
}

// ---------- café floor plan (top-down) ----------
function cafe(t, { scale = 1, ringsOn = 1, people = [], extra = "", dim = 0, ps = 1, ks = 0.42 } = {}) {
  let s = `<rect x="-420" y="-250" width="840" height="500" rx="30" fill="${C.bg2}" stroke="${C.line}" stroke-width="6" opacity="${1 - dim * 0.5}"/>`;
  // counter along the top, door gap on the right
  s += `<rect x="-380" y="-226" width="420" height="50" rx="14" fill="${C.line}"/>` + lbl("counter", -170, -192, 26, C.muted, 1, "middle", 700);
  s += `<line x1="420" y1="40" x2="420" y2="160" stroke="${C.bg}" stroke-width="10"/>`;
  // tables
  const tables = [[-190, -20], [40, -40], [250, -60], [-300, 70], [120, 60]];
  for (const [x, y] of tables) s += `<circle cx="${x}" cy="${y}" r="44" fill="${C.screen}" stroke="${C.line}" stroke-width="4"/>`;
  // signal rings + keys on the keys' table
  if (ringsOn > 0) s += g(rings(t, 1.6, C.blue, 30, 230, 3), { x: KT.x, y: KT.y, o: ringsOn });
  s += at(keysWithTag(t, ks), KT.x - 6, KT.y - 14);
  for (const p of people) s += at(person(p.glow || 0, p.color), p.x, p.y, { r: p.r || 0, o: p.o ?? 1, s: ps });
  return g(s + extra, { s: scale });
}
const walkX = (t, t0, dur, x0 = -470, x1 = 470) => lerp(x0, x1, prog(t, t0, t0 + dur));
const inRange = x => Math.hypot(x - KT.x, AISLE - KT.y) < 240;

const HOOK_TOP = () => headline(`How does a Bluetooth tracker find your lost keys… <span style="white-space:nowrap">${hi("with no GPS?")}</span>`, 76);

function SCENE(t, T) {
  // ---------------- Hook: keys + tag on a café table, signal pulsing from frame 0 ----------------
  if (t < T.start("twist")) {
    const z = lerp(0.92, 1, ease.out(prog(t, 0, 0.6)));
    const gps = T.word("hook", "GPS");
    const gA = appear(t, gps - 0.15, 0.35);
    let svg = at(`<ellipse cx="0" cy="150" rx="330" ry="56" fill="${C.screen}" stroke="${C.line}" stroke-width="5"/>` +
      `<rect x="-14" y="190" width="28" height="140" fill="${C.line}"/>`, 540, 760, { s: z });
    // coffee cup
    svg += at(`<rect x="-46" y="-50" width="92" height="96" rx="18" fill="${C.ink}" opacity="0.85"/><path d="M 46 -24 A 26 26 0 0 1 46 26" fill="none" stroke="${C.ink}" stroke-width="10" opacity="0.85"/>`, 760, 860, { s: z });
    svg += at(rings(t, 1.4, C.blue, 40, 300, 3), 488, 803, { s: z });
    svg += at(keysWithTag(t, 1.25), 430, 760, { s: z });
    svg += at(noGPS(ease.out(prog(t, gps, gps + 0.35))), 760, 640, { s: gA, o: gA });
    return { top: HOOK_TOP(), svg, glow: C.blue };
  }

  // ---------------- Twist: zoom out to the café; strangers walk through, phones light up ----------------
  if (t < T.start("s1")) {
    const a = T.start("twist");
    const z = lerp(1.25, 1, ease.inOut(prog(t, a, a + 0.8)));
    const people = [0, 1, 2].map(i => {
      const x = walkX(t, a - 0.6 + i * 1.1, 3.2);
      return { x, y: AISLE + (i % 2 ? 40 : 0), glow: inRange(x) ? 1 : 0 };
    });
    const qA = appear(t, T.word("twist", "quietly") - 0.1, 0.35, ease.out);
    return {
      top: headline(`${hi("Strangers' phones", C.blue)} do the finding`, 84) +
        `<div style="opacity:${qA};font-weight:700;font-size:42px;color:${C.muted};margin-top:14px">quietly, in the background</div>`,
      svg: at(cafe(t, { people }), CF.x, CF.y, { s: z }),
      glow: C.blue,
    };
  }

  // ---------------- Step 1: the tracker only sends a Bluetooth signal; no GPS inside ----------------
  if (t < T.start("s2")) {
    const a = T.start("s1");
    const sA = appear(t, T.word("s1", "Bluetooth") - 0.2, 0.35, ease.out);
    const gps = T.word("s1", "GPS");
    const gA = appear(t, gps - 0.15, 0.35);
    let svg = at(rings(t, 1.3, C.blue, 70, 380, 4), 540, 800, { o: lerp(0.4, 1, sA) });
    svg += at(tag(2.2, 0.6 + 0.4 * Math.sin(t * 6)), 540, 800);
    svg += at(btIcon(C.bg, 7), 540, 800, { s: 0.55 });
    svg += at(noGPS(ease.out(prog(t, gps, gps + 0.35))), 540, 1030, { s: gA, o: gA });
    return {
      top: pill("STEP 1", C.blue) + headline(`It just sends a ${hi("Bluetooth signal", C.blue)}`, 80),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.blue,
    };
  }

  // ---------------- Step 2: a stranger walks past; their phone hears it and knows where it is ----------------
  if (t < T.start("s3")) {
    const a = T.start("s2");
    const hear = T.word("s2", "hears"), knows = T.word("s2", "knows");
    // the walker reaches the keys' table right when "hears" is spoken, then stops
    const x = lerp(-470, KT.x + 40, ease.out(prog(t, a - 0.3, hear)));
    const heard = appear(t, hear - 0.05, 0.3);
    const pA = appear(t, knows - 0.1, 0.4);
    const px = x + 42, py = AISLE - 42;   // the phone in the walker's hand (person scale 1.4)
    let extra = "";
    if (heard > 0) extra += at(okBadge(prog(t, hear, hear + 0.3), 30), px + 90, py + 10, { s: heard, o: heard }) +
      lbl("heard it", px + 200, py + 22, 34, C.green, heard, "middle", 800);
    if (pA > 0) extra += at(pin(C.accent, 0.9), px, py - 24, { s: pA, o: pA }) +
      lbl("its own location", px - 10, py + 150, 34, C.accent, pA, "middle", 800);
    const people = [{ x, y: AISLE, glow: heard }];
    return {
      top: pill("STEP 2", C.green) + headline(`Their phone ${hi("hears it", C.green)}`, 84),
      topO: appear(t, a, 0.3, ease.out), svg: at(cafe(t, { people, extra, ps: 1.4, ks: 0.55 }), CF.x, CF.y), glow: C.green,
    };
  }

  // ---------------- Step 3: lock the location in a box only you can open, send it up ----------------
  if (t < T.start("s3b")) {
    const a = T.start("s3");
    const lk = T.word("s3", "locks"), only = T.word("s3", "only"), send = T.word("s3", "sends");
    const into = ease.inOut(prog(t, lk - 0.4, lk + 0.2));
    const locked = ease.out(prog(t, lk + 0.15, lk + 0.5));
    const up = ease.inOut(prog(t, send - 0.1, send + 0.9));
    const oA = appear(t, only - 0.15, 0.35, ease.out);
    const cA = appear(t, send - 0.4, 0.4, ease.out);
    let svg = at(phone({ screen: C.screen, content: at(pin(C.accent, 0.9), 0, 40, { o: 1 - into }) }), 250, 880, { s: 0.8 });
    svg += lbl("stranger's phone", 250, 1090, 30, C.muted);
    // pin flies from the phone into the box
    if (into > 0 && into < 1) svg += at(pin(C.accent, 0.7), lerp(250, 560, into), lerp(912, 880, into) - 80 * Math.sin(Math.PI * into));
    const bx = lerp(560, 800, up), by = lerp(880, 610, up), bs = lerp(1.25, 0.75, up);
    svg += at(cloud(C.line, 1.1), 800, 600, { o: cA }) + lbl("network", 800, 700, 32, C.muted, cA, "middle", 800);
    svg += at(lockBox(locked, 1, into >= 1 ? at(pin(C.accent, 0.5), 0, 34) : ""), bx, by, { s: bs });
    svg += lbl("only you can open it", 560, 1040, 36, GOLD, oA * (1 - up), "middle", 800);
    return {
      top: pill("STEP 3", GOLD) + headline(`${hi("Locked", GOLD)}, then sent up`, 84),
      topO: appear(t, a, 0.3, ease.out), svg, glow: GOLD,
    };
  }

  // ---------------- Nobody else can open it; you never learn who helped ----------------
  if (t < T.start("pay")) {
    const a = T.start("s3b");
    const co = T.word("s3b", "company"), nv = T.word("s3b", "never");
    const bA = appear(t, co - 0.2, 0.35, ease.out);
    const tryK = prog(t, co + 0.3, co + 1.1);
    const xA = appear(t, co + 1.0, 0.3);
    const aA = appear(t, nv - 0.15, 0.35, ease.out);
    let svg = at(cloud(C.line, 1.2), 540, 600) + at(lockBox(1, 0.9), 540, 590);
    svg += at(building(C.muted), 270, 900, { o: bA, s: lerp(0.8, 1, bA) }) + lbl("the company", 270, 1050, 30, C.muted, bA);
    // a dashed "try" line from the company to the box, then a red cross
    if (tryK > 0) svg += `<line x1="320" y1="800" x2="${lerp(320, 480, tryK)}" y2="${lerp(800, 660, tryK)}" stroke="${C.red}" stroke-width="6" stroke-dasharray="10 12" stroke-linecap="round"/>`;
    svg += at(noBadge(34), 420, 720, { s: xA, o: xA });
    svg += at(anon(), 800, 900, { o: aA, s: lerp(0.8, 1, aA) }) + lbl("who helped? never shown", 800, 1050, 30, C.muted, aA);
    return {
      top: headline(`Only ${hi("you", C.green)} can open it`, 84),
      topO: appear(t, a, 0.3, ease.out), svg, glow: C.green,
    };
  }

  // ---------------- Payoff: your phone opens the boxes and drops a pin; a billion helpers ----------------
  if (t < T.start("cta")) {
    const a = T.start("pay");
    const unl = T.word("pay", "unlocks"), pn = T.word("pay", "pin"), bil = T.word("pay", "billion");
    const swap = bil - 0.6;
    if (t < swap) {
      // owner's phone: three boxes arrive (reports from several passers-by), unlock, pin drops on the table
      const arrive = i => ease.out(prog(t, a - 0.1 + i * 0.12, a + 0.35 + i * 0.12));
      const open = ease.out(prog(t, unl - 0.1, unl + 0.4));
      const drop = ease.back(prog(t, pn - 0.15, pn + 0.3));
      const map = g(`<rect x="-80" y="-130" width="160" height="200" rx="12" fill="${C.bg2}" stroke="${C.line}" stroke-width="3"/>` +
        `<rect x="-70" y="-120" width="90" height="20" rx="6" fill="${C.line}"/>` +
        [[-30, -40], [30, -50], [-50, 20], [40, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="${C.screen}" stroke="${C.line}" stroke-width="2"/>`).join(""), { y: -20 });
      let content = map;
      if (drop > 0) content += at(pin(C.accent, 0.55), -30, -60 + lerp(-60, 0, Math.min(1, drop)), { o: clamp(drop * 2) });
      content += lbl("keys seen here", 0, 120, 20, C.ink, drop, "middle", 800) + lbl("2 min ago (example)", 0, 146, 16, C.muted, drop, "middle", 600);
      let svg = at(phone({ glow: drop > 0.5 ? C.accent : null, content }), 540, 820, { s: 1.35 });
      for (let i = 0; i < 3; i++) {   // reports from several passers-by land on your phone
        const k = arrive(i);
        if (k <= 0) continue;
        const tx = 540 + (i - 1) * 88, ty = 780;
        const fade = ease.out(prog(t, T.word("pay", "drops"), pn + 0.15));
        svg += at(lockBox(1 - open, 0.55), lerp(980, tx, k), lerp(520, ty, k) - 60 * Math.sin(Math.PI * k), { o: k * (1 - fade) });
      }
      return {
        top: headline(`A ${hi("pin")} on your phone`, 84),
        svg, glow: C.accent,
      };
    }
    // a busy café: many helpers
    const k = ease.out(prog(t, swap, swap + 0.6));
    const people = [];
    for (let i = 0; i < 14; i++) {
      const row = i % 3, sp = 0.6 + (i % 5) * 0.12;
      const x = ((i * 137 + t * 90 * sp) % 900) - 450;
      const y = [-120, 20, AISLE + 20][row] + (i % 2) * 30;
      if (Math.abs(x) > 400) continue;
      people.push({ x, y, glow: Math.hypot(x - KT.x, y - KT.y) < 260 ? 1 : 0.2, o: k });
    }
    const extra = at(pin(C.accent, 0.8), KT.x, KT.y - 40);
    return {
      top: headline(`${hi("1,000,000,000+", C.green)} devices per network`, 80) +
        `<div style="opacity:${appear(t, T.word("pay", "busy") - 0.1, 0.35, ease.out)};font-weight:700;font-size:42px;color:${C.muted};margin-top:14px">a busy café is full of helpers</div>`,
      svg: at(cafe(t, { people, extra }), CF.x, CF.y + 40),
      glow: C.green,
    };
  }

  // ---------------- CTA ----------------
  const a = T.start("cta");
  const k = ease.out(prog(t, a, a + 0.35));
  return {
    noCaptions: t > T.narrationEnd,
    top: headline(`Send this to someone who <span style="white-space:nowrap">${hi("always loses")}</span> their keys`, 84),
    topO: k,
    svg: at(rings(t, 1.3, C.blue, 40, 280, 3), 540, 840, { o: k }) + at(keysWithTag(t, 1.5), 520, 780, { o: k, s: lerp(0.8, 1, k) }),
    glow: C.blue,
  };
}

function COVER(T) {
  const people = [{ x: 60, y: AISLE, glow: 1 }, { x: 260, y: AISLE + 40, glow: 0 }, { x: -380, y: AISLE, glow: 0 }];
  const extra = at(pin(C.accent, 1), KT.x, KT.y - 40);
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #12", C.accent) + headline(`How do trackers find ${hi("lost keys")}?`, 100),
    svg: at(cafe(0.7, { people, extra }), CF.x, 900, { s: 1.05 }),
    glow: C.blue,
  };
}
