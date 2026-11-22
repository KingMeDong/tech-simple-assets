// Reel 001 — How AirDrop works with no internet.
// SCENE(t, T) returns {top, svg, html, glow, noCaptions} for time t.

const PL = { x: 280, y: 790 }, PR = { x: 800, y: 790 };

function twoPhones(extraL = "", extraR = "", o = 1, glowL = null, glowR = null) {
  return g(phone({ glow: glowL, content: extraL }), { x: PL.x, y: PL.y, s: 0.95, o }) +
         g(phone({ glow: glowR, content: extraR }), { x: PR.x, y: PR.y, s: 0.95, o });
}

function flyingPhoto(t, period, y, o = 1, x0 = PL.x + 20, x1 = PR.x - 20) {
  const k = ease.inOut((t % period) / period);
  const fade = Math.min(1, k * 6, (1 - k) * 6);
  return g(photo(), { x: lerp(x0, x1, k), y, s: 0.8, o: o * fade });
}

function card(y, color, icon, title, sub, a) {
  return g(`<rect x="-440" y="-90" width="880" height="180" rx="36" fill="${C.bg2}" stroke="${color}" stroke-width="5"/>
    ${g(badge(icon, color, 58), { x: -330 })}
    <text x="-240" y="-8" class="svgt" style="font-size:54px;font-weight:800" fill="${C.ink}">${title}</text>
    <text x="-240" y="46" class="svgt" style="font-size:36px;font-weight:600" fill="${C.muted}">${sub}</text>`,
    { x: 540, y, s: lerp(0.85, 1, a), o: a });
}

function SCENE(t, T) {
  // ---------------- Hook ----------------
  if (t < T.start("s1a")) {
    const slashK = ease.out(prog(t, 0.1, 0.5));
    const pulse = 1 + 0.04 * Math.sin(t * 6);
    return {
      top: headline(`How does AirDrop work ${hi("with no internet?")}`, 88),
      svg: twoPhones() +
        `<line x1="${PL.x + 110}" y1="790" x2="${PR.x - 110}" y2="790" stroke="${C.line}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round"/>` +
        flyingPhoto(t + 0.5, 1.5, 790) +
        g(globe(C.muted) + slash(70, slashK), { x: 540, y: 640, s: 0.8 * pulse }),
      glow: C.accent,
    };
  }

  // ---------------- Step 1: Bluetooth ----------------
  if (t < T.start("s2a")) {
    const top = pill("STEP 1", C.blue);
    if (t < T.start("s1c")) {
      const a = appear(t, T.start("s1a"));
      const heard = T.word("s1b", "Nearby");
      const devices = [
        { x: 200, y: 650, s: 0.62, d: laptop() },
        { x: 885, y: 640, s: 0.42, d: phone() },
        { x: 190, y: 1000, s: 0.42, d: phone() },
        { x: 880, y: 990, s: 0.62, d: laptop() },
      ];
      let devs = "";
      devices.forEach((dv, i) => {
        const on = appear(t, heard + i * 0.18, 0.3);
        devs += g(dv.d, { x: dv.x, y: dv.y, s: dv.s, o: 0.45 + 0.55 * on });
        devs += g(badge(check(C.bg, on), C.blue, 30), { x: dv.x + 60, y: dv.y - 70, s: on, o: on });
      });
      const ringsOn = t > T.start("s1b") ? rings(t, 1.3, C.blue, 130, 470) : "";
      return {
        top: top + headline(`Bluetooth ${hi("finds", C.blue)} nearby devices`, 84),
        topO: a,
        svg: g(ringsOn, { x: 540, y: 790 }) + devs +
          g(phone({ glow: C.blue, content: g(badge(btIcon(C.ink, 9), C.blue, 52), { s: 1 }) }), { x: 540, y: 790, s: lerp(0.7, 0.95, a) }),
        glow: C.blue,
      };
    }
    // s1c: too slow for big files
    const st = T.start("s1c");
    const k = 0.12 * ease.out(prog(t, st + 0.2, T.start("s2a")));
    return {
      top: top + headline(`But Bluetooth is ${hi("too slow", C.red)} for photos`, 84),
      svg: twoPhones("", "", 1) +
        `<line x1="${PL.x + 110}" y1="790" x2="${PR.x - 110}" y2="790" stroke="${C.blue}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round" opacity="0.8"/>` +
        g(photo(), { x: lerp(PL.x + 20, PR.x - 20, k), y: 790, s: 0.8 }) +
        bar(160, 1062, 760, k / 0.9, C.red, "Bluetooth LE", "slow"),
      glow: C.blue,
    };
  }

  // ---------------- Step 2: Wi-Fi direct ----------------
  if (t < T.start("s3")) {
    const top = pill("STEP 2", C.green);
    const s2a = T.start("s2a"), s2b = T.start("s2b");
    const routerA = appear(t, s2a + 0.1);
    const routerSlash = ease.out(prog(t, T.word("s2a", "without"), T.word("s2a", "without") + 0.4));
    const globeA = appear(t, T.word("s2b", "internet") - 0.1);
    const link = ease.out(prog(t, s2b, s2b + 0.6));
    const fast = ease.out(prog(t, s2b + 0.7, s2b + 1.6));
    const linkSvg = `<line x1="${PL.x + 100}" y1="790" x2="${lerp(PL.x + 100, PR.x - 100, link)}" y2="790" stroke="${C.green}" stroke-width="22" stroke-linecap="round"/>`;
    const photos = link >= 1 ? flyingPhoto(t, 0.55, 790) : "";
    const icons = t < s2b
      ? g(router() + slash(78, routerSlash), { x: 540, y: 640, s: lerp(0.6, 1, routerA), o: routerA })
      : g(router() + slash(78, 1), { x: 445, y: 640, s: 0.75, o: 0.85 }) +
        g(globe() + slash(70, ease.out(prog(t, T.word("s2b", "internet"), T.word("s2b", "internet") + 0.4))), { x: 635, y: 640, s: 0.75 * globeA, o: globeA });
    return {
      top: top + headline(t < s2b ? `Then Wi-Fi, ${hi("without a router", C.green)}` : `A direct ${hi("Wi-Fi link", C.green)}`, 84),
      svg: twoPhones("", "", 1, link > 0.5 ? C.green : null, link > 0.5 ? C.green : null) + linkSvg + photos + icons +
        (t > s2b + 0.7 ? bar(160, 1062, 760, fast, C.green, "Wi-Fi direct", "fast") : ""),
      glow: C.green,
    };
  }

  // ---------------- Step 3: encryption ----------------
  if (t < T.start("pay1")) {
    const s3 = T.start("s3");
    const lockT = T.word("s3", "encrypted");
    const closed = ease.back(prog(t, lockT - 0.1, lockT + 0.3));
    const after = t > lockT + 0.4;
    return {
      top: pill("STEP 3", C.accent) + headline(`Locked ${hi("before")} anything is sent`, 84),
      topO: appear(t, s3, 0.3, ease.out),
      svg: twoPhones("", "", 1, C.green, C.green) +
        `<line x1="${PL.x + 100}" y1="790" x2="${PR.x - 100}" y2="790" stroke="${C.green}" stroke-width="22" stroke-linecap="round" opacity="0.5"/>` +
        (after ? flyingPhoto(t - lockT, 0.9, 790) : g(photo(), { x: PL.x, y: 760, s: 0.8 })) +
        g(`<circle r="78" fill="${C.bg}" stroke="${closed > 0.5 ? C.accent : C.muted}" stroke-width="8"/>` + lock(closed, closed > 0.5 ? C.accent : C.muted, 1.1), { x: 540, y: 700 }),
      glow: C.accent,
    };
  }

  // ---------------- Payoff ----------------
  if (t < T.narrationEnd) {
    if (t < T.start("pay2")) {
      const a1 = appear(t, T.word("pay1", "Bluetooth") - 0.05);
      const a2 = appear(t, T.word("pay1", "Wi-Fi") - 0.05);
      return {
        top: headline(`Bluetooth ${hi("finds", C.blue)}.<br>Wi-Fi ${hi("delivers", C.green)}.`, 92),
        svg: card(700, C.blue, btIcon(C.ink, 9), "Bluetooth", "finds nearby devices", a1) +
             card(930, C.green, wifiIcon(C.ink, 9), "Wi-Fi", "carries the photo", a2),
        glow: C.blue,
      };
    }
    const on = ease.inOut(prog(t, T.word("pay2", "turned"), T.word("pay2", "turned") + 0.35));
    const knobX = lerp(-58, 58, on);
    const sw = g(`<rect x="-118" y="-60" width="236" height="120" rx="60" fill="${on > 0.5 ? C.green : C.line}"/>
       <circle cx="${knobX}" cy="0" r="48" fill="${C.ink}"/>`, { x: 680, y: 660 });
    const status = on > 0.5
      ? g(badge(check(C.bg, prog(t, T.word("pay2", "turned") + 0.2, T.word("pay2", "turned") + 0.6)), C.green, 44), { x: 300, y: 880 }) +
        `<text x="370" y="896" class="svgt" style="font-size:52px;font-weight:800" fill="${C.ink}">AirDrop ready</text>`
      : g(badge(cross(C.bg), C.red, 44), { x: 300, y: 880 }) +
        `<text x="370" y="896" class="svgt" style="font-size:52px;font-weight:800" fill="${C.muted}">AirDrop off</text>`;
    const noNet = appear(t, T.word("pay2", "connected") - 0.1, 0.3, ease.out);
    return {
      top: headline(`That's why AirDrop needs ${hi("Wi-Fi turned on")}`, 84),
      svg: `<text x="260" y="680" class="svgt" style="font-size:64px;font-weight:800" fill="${C.ink}">Wi-Fi</text>` + sw + status +
        g(`<text x="0" y="0" class="svgt" text-anchor="middle" style="font-size:38px;font-weight:600" fill="${C.muted}">even with no network connected</text>`, { x: 540, y: 1020, o: noNet }),
      glow: C.green,
    };
  }

  // ---------------- End card (no voice) ----------------
  const a = appear(t, T.narrationEnd, 0.4);
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #1", C.accent) + headline(`Send this to the friend who ${hi("still emails photos to themselves")}`, 80),
    topO: a,
    svg: g(twoPhones() + flyingPhoto(t, 1.2, 790 - 0, 1), { o: a, y: 80 }),
    html: `<div style="position:absolute;left:0;right:0;top:1150px;text-align:center;font-weight:700;font-size:40px;color:${C.muted};opacity:${a}">Follow <span style="color:${C.ink}">@tech.simple.explained</span></div>`,
    glow: C.accent,
  };
}

function COVER(T) {
  return {
    noCaptions: true,
    top: pill("HOW IT ACTUALLY WORKS #1", C.accent) + headline(`How AirDrop works ${hi("with no internet")}`, 104),
    svg: g(twoPhones() + `<line x1="${PL.x + 110}" y1="790" x2="${PR.x - 110}" y2="790" stroke="${C.line}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round"/>` +
      g(photo(), { x: 540, y: 790, s: 0.9 }) + g(globe(C.muted) + slash(70, 1), { x: 540, y: 1110, s: 0.8 }), { y: 120 }),
    glow: C.accent,
  };
}
