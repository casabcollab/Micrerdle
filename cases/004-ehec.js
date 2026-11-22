// Micrerdle case 004: Enterohemorrhagic E. coli (EHEC / STEC), the 2015 Chipotle outbreak (strain O26)
// To edit this case, change the text below. Hints appear in order; **double asterisks** bold a key fact.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// Any mix of types is fine; a type can repeat.
MICRERDLE_CASES.push({
  answer: "enterohemorrhagic-e-coli-ehec",
  hints: [
    { type: "history",
      text: "In the fall of 2015, a young man in Washington state starts feeling sick about three days after eating at his favorite Mexican fast-casual chain. Dozens of other customers get sick too, and the chain closes 43 restaurants in Washington and Oregon." },
    { type: "exposure",
      text: "His usual order: a steak burrito bowl with rice, beans, salsa, sour cream and lettuce." },
    { type: "presentation",
      text: "First come severe cramps, then watery diarrhea that turns bloody. Strangely, he has little or no fever." },
    { type: "treatment",
      text: "His doctor says the treatment is fluids and rest, adding, \"Antibiotics here may actually make you sicker.\"" },
    { type: "biology",
      text: "It doesn't invade the gut wall; its toxin does the damage. The toxin cleaves 28S rRNA, shutting down the 60S ribosomal subunit in gut and kidney endothelial cells. It's a near twin of the toxin in the dysentery bacterium Kiyoshi Shiga discovered in 1897." },
    { type: "lab",
      text: "A lactose-fermenting Gram-negative rod, pink on MacConkey. Its famous strain O157:H7 won't ferment sorbitol, which is how labs usually catch it. This outbreak was a rarer strain, O26, from the same toxin-making family." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End minigame: grill master. A patty sizzles while a thermometer climbs. Tap to pull it at 160°F, the safe
    // temperature for ground beef (grinding spreads surface bacteria all through the meat). Pull it early and EHEC
    // survives; too late and it's a hockey puck. A Holstein grazes in the pasture behind: cattle are the reservoir.
    art: function (host, { still }) {
      const W = 128, H = 64;
      host.innerHTML = `<canvas width="${W}" height="${H}" tabindex="0" role="button" style="cursor:pointer;touch-action:manipulation"
          aria-label="Grilling minigame. Tap to put a patty on the grill, then tap again to pull it off at 160 degrees Fahrenheit."></canvas>
        <p class="art-caption" aria-live="polite"></p>
        <p class="art-caption"></p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const [statusEl, scoreEl] = host.querySelectorAll(".art-caption");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; g.fillStyle = c; g.fillRect(x, y, 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        sky: "#BFE3F2", skyLow: "#DDF1F7", cloud: "#FFFFFF", sun: "#FFE27A", hill: "#A9D27C",
        grass: "#86C05B", grassDark: "#6DB24A", fence: "#A07850", fenceDark: "#7A5A3A",
        deck: "#B98A5A", deckDark: "#94683F", deckLine: "#7A5233",
        grill: "#2B2B30", grillHi: "#4A4A52", grate: "#8A9099", leg: "#3A3A40",
        ember: "#F2762E", flame: "#FFD45A", smoke: "#D9D9DE", smokeDark: "#9E9EA6",
        bun: "#E0A458", bunDark: "#B97F3C", seed: "#FFF4D6", plate: "#FFFFFF", plateEdge: "#D6D6DC", table: "#7A5233",
        tube: "#FFFFFF", tubeEdge: "#5E5E66", mercury: "#D7263D", band: "#2C8455", text: "#2E0821",
        bug: "#4CAF50", bugDark: "#2E7D32", spark: "#FFF6C2",
        cow: "#F4F1EA", spot: "#26221F", pink: "#E7A3A8"
      };
      const T_MIN = 40, T_MAX = 220, SAFE = 160, DONE = 175, RATE = 0.13;   // °F; RATE = °F per ms (40 to 220 in about 1.4 s)
      const MSG = {
        under: "Undercooked! Hello, EHEC",
        perfect: "Perfect! 160°F kills EHEC",
        over: "Overcooked. Safe, but dry",
        burnt: "Charcoal. You forgot it"
      };
      let state = "idle", t0 = 0, tEnd = 0, pulled = T_MIN, result = null, perfect = 0, served = 0, smoke = [];
      const say = (a, b) => { if (statusEl.textContent !== a) statusEl.textContent = a; if (scoreEl.textContent !== b) scoreEl.textContent = b; };
      const tally = () => served ? `Perfect burgers ${perfect} of ${served}` : "Ground beef is safe at 160°F";
      const temp = now => state === "cooking" ? Math.min(T_MAX, T_MIN + RATE * (now - t0)) : state === "idle" ? T_MIN : pulled;
      say("Tap to throw a patty on!", tally());

      function finish(now, t) {
        t = Math.round(t);                       // judge the same whole number the readout shows
        pulled = t; tEnd = now; served++;
        result = t < SAFE ? "under" : t <= DONE ? "perfect" : t < T_MAX ? "over" : "burnt";
        if (result === "perfect") perfect++;
        state = "served";
        say(MSG[result], tally() + " · Tap to grill another");
      }
      function tap() {
        const now = performance.now();
        if (state === "idle" || state === "served") { state = "cooking"; t0 = now; result = null; smoke = []; say("Tap to pull it at 160°F!", tally()); }
        else if (state === "cooking") finish(now, temp(now));
      }
      cv.addEventListener("pointerdown", e => { e.preventDefault(); tap(); });
      cv.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); tap(); } });

      // tiny 3x5 digits for the thermometer readout
      const FONT = {
        0: ["###", "#.#", "#.#", "#.#", "###"], 1: [".#.", "##.", ".#.", ".#.", "###"], 2: ["###", "..#", "###", "#..", "###"],
        3: ["###", "..#", ".##", "..#", "###"], 4: ["#.#", "#.#", "###", "..#", "..#"], 5: ["###", "#..", "###", "..#", "###"],
        6: ["###", "#..", "###", "#.#", "###"], 7: ["###", "..#", ".#.", ".#.", ".#."], 8: ["###", "#.#", "###", "#.#", "###"],
        9: ["###", "#.#", "###", "..#", "###"], F: ["###", "#..", "##.", "#..", "#.."], o: ["##", "##", "..", "..", ".."]
      };
      const write = (s, x, y, c) => { [...s].forEach(ch => { const f = FONT[ch]; if (!f) { x += 2; return; } f.forEach((r, ry) => [...r].forEach((b, rx) => { if (b === "#") px(x + rx, y + ry, c); })); x += f[0].length + 1; }); };

      // patty colour: raw pink, browning, then charred
      const STOPS = [[40, [229, 124, 143]], [110, [199, 107, 107]], [150, [139, 90, 60]], [175, [107, 64, 39]], [220, [42, 24, 16]]];
      const hex = v => "#" + v.map(n => Math.round(n).toString(16).padStart(2, "0")).join("");
      function meat(t) {
        for (let i = 1; i < STOPS.length; i++) if (t <= STOPS[i][0]) {
          const [a, ca] = STOPS[i - 1], [b, cb] = STOPS[i], k = (t - a) / (b - a);
          return hex(ca.map((v, j) => v + (cb[j] - v) * k));
        }
        return hex(STOPS[STOPS.length - 1][1]);
      }
      const shade = (h, f) => hex([1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) * f));
      function patty(x, y, t) {                  // 14 x 4, rounded, with grill marks once it's hot
        const c = meat(t), dark = shade(c, 0.72), hi = shade(c, 1.15);
        for (let r = 0; r < 4; r++) for (let i = 0; i < 14; i++) {
          if ((r === 0 || r === 3) && (i === 0 || i === 13)) continue;
          px(x + i, y + r, r === 0 ? hi : r === 3 ? dark : c);
        }
        if (t > 110) for (let i = 2; i < 13; i += 3) { px(x + i, y + 1, dark); px(x + i - 1, y + 2, dark); }
      }
      function burger(x, y, t) {                 // bun, patty, bun on a plate
        rect(x - 2, y + 9, 22, 1, C.plateEdge); rect(x - 1, y + 8, 20, 1, C.plate);
        rect(x + 1, y + 6, 16, 2, C.bunDark); rect(x + 2, y + 6, 14, 1, C.bun);
        patty(x + 2, y + 3, t);
        for (let r = 0; r < 4; r++) { const inset = [4, 2, 1, 1][r]; rect(x + inset, y - 1 + r, 18 - inset * 2, 1, r < 3 ? C.bun : C.bunDark); }
        [[6, 0], [9, 1], [12, 0], [8, -1]].forEach(([dx, dy]) => px(x + dx, y + dy, C.seed));
      }

      // a small Holstein grazing in the pasture behind the yard
      const COW = [
        ".....WWBBWWWW.",
        "....WWBBBWWBWT",
        "....WWWWWWBBW.",
        "HHHWWWWWWWWWW.",
        "HPH.WW...WW...",
        ".P..W.W..W.W.."
      ];
      function cow(x, y, now) {
        const nod = still ? 0 : Math.floor(now / 450) % 2;
        COW.forEach((r, ry) => [...r].forEach((ch, rx) => {
          const c = { W: C.cow, B: C.spot, T: C.spot, H: C.cow, P: C.pink }[ch]; if (!c) return;
          px(x + rx, y + ry + ((ch === "H" || ch === "P") ? nod : 0), c);
        }));
      }

      function scene(now) {
        rect(0, 0, W, 12, C.sky); rect(0, 12, W, 10, C.skyLow);
        for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y <= 10) px(12 + x, 6 + y, C.sun);
        const cx = still ? 40 : ((now * 0.003) % (W + 30)) - 20;
        rect(cx, 5, 11, 2, C.cloud); rect(cx + 2, 3, 6, 2, C.cloud);
        for (let x = 0; x < W; x++) { const h = 18 + Math.round(Math.sin(x / 11) * 2); rect(x, h, 1, 22 - h, C.hill); }
        rect(0, 22, W, 10, C.grass);
        for (let x = 1; x < W; x += 4) px(x, 24 + (x * 7) % 6, C.grassDark);
        cow(64, 21, now);
        for (let x = 2; x < W; x += 12) rect(x, 24, 2, 8, C.fenceDark);
        rect(0, 26, W, 1, C.fence); rect(0, 29, W, 1, C.fence);
        rect(0, 32, W, 32, C.deck);
        for (let y = 35; y < H; y += 4) rect(0, y, W, 1, C.deckLine);
        for (let y = 33; y < H; y += 4) for (let x = (y * 3) % 17; x < W; x += 17) px(x, y, C.deckDark);
        // side table with the plate
        rect(4, 46, 26, 2, C.table); rect(6, 48, 2, 10, C.table); rect(26, 48, 2, 10, C.table);
      }
      function grill(now, t) {
        const gx = 40, gy = 38;                  // grate line
        rect(gx + 2, gy + 9, 2, 12, C.leg); rect(gx + 22, gy + 9, 2, 12, C.leg); rect(gx + 12, gy + 9, 2, 10, C.leg);
        for (let r = 0; r < 9; r++) { const inset = [0, 0, 1, 1, 2, 3, 4, 6, 8][r]; rect(gx + inset, gy + 1 + r, 26 - inset * 2, 1, r === 0 ? C.grillHi : C.grill); }
        const hot = state === "cooking";
        for (let x = gx + 2; x < gx + 24; x++) {
          const f = (Math.floor(now / 90) + x) % 4;
          px(x, gy + 1, hot && f === 0 ? C.flame : C.ember);
          if (hot && f === 1) px(x, gy, C.flame);
        }
        for (let x = gx; x < gx + 26; x += 2) px(x, gy, C.grate);
        rect(gx - 1, gy, 28, 1, C.grate);
        if (state === "cooking") patty(gx + 6, gy - 4, t);
        // smoke rises once it's hot, and billows when it's burning
        if (hot && t > 100 && !still && Math.random() < (t > 185 ? 0.6 : 0.2)) smoke.push({ x: gx + 8 + Math.random() * 10, y: gy - 5, life: 900, c: t > 185 ? C.smokeDark : C.smoke });
      }
      function thermometer(t) {
        // exactly 4°F per pixel, so the green rows are precisely 160 to 175°F
        t = Math.round(t);
        const x = 115, top = 11, bot = 56;
        const row = v => bot - Math.floor((v - T_MIN) / 4);
        rect(x - 1, top - 1, 7, bot - top + 2, C.tubeEdge); rect(x, top, 5, bot - top, C.tube);
        const zt = row(DONE), zh = row(SAFE) - zt + 1;
        rect(x, zt, 5, zh, "#BFE6C9"); rect(x - 4, zt, 3, zh, C.band);
        const yt = row(t);
        rect(x + 1, yt, 3, bot - yt, C.mercury);
        for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) if (r * r + c * c <= 5) px(x + 2 + c, bot + 2 + r, r === -2 && c === 0 ? C.tube : C.mercury);
        const s = String(t);
        rect(97, 2, 30, 7, C.tube); rect(97, 9, 30, 1, C.tubeEdge);
        write(s + "oF", 99, 3, t >= SAFE && t <= DONE ? C.band : C.text);
      }
      function plated(now) {
        const k = Math.min(1, (now - tEnd) / 400);              // the patty flies off the grill onto the bun
        const x = 46 + (8 - 46) * k, y = 34 + (38 - 34) * k - Math.sin(k * Math.PI) * 10;
        if (k < 1) { patty(x, y, pulled); return; }
        burger(8, 36, pulled);
        const blink = Math.floor(now / 200) % 2;
        if (result === "under") {                // a little rod-shaped bacterium crawls out, flagellum waving
          const bx = 11 + Math.round(Math.sin(now / 300) * 3), by = 30;
          rect(bx, by, 5, 2, C.bug); px(bx, by + 1, C.bugDark); px(bx + 4, by, C.bugDark);
          for (let i = 1; i <= 3; i++) px(bx + 4 + i, by + 1 + (Math.floor(now / 120 + i) % 2), C.bugDark);
        } else if (result === "perfect") {
          [[4, 32], [26, 30], [22, 26], [7, 27]].forEach(([sx, sy], i) => { if ((blink + i) % 2) { px(sx, sy, C.spark); px(sx - 1, sy, C.spark); px(sx + 1, sy, C.spark); px(sx, sy - 1, C.spark); px(sx, sy + 1, C.spark); } });
        } else if (!still && Math.random() < 0.25) smoke.push({ x: 12 + Math.random() * 10, y: 34, life: 800, c: result === "burnt" ? C.smokeDark : C.smoke });
      }

      let last = performance.now();
      function frame(now) {
        if (!cv.isConnected) return;
        const dt = Math.min(50, now - last); last = now;
        if (state === "cooking" && temp(now) >= T_MAX) finish(now, T_MAX);
        const t = temp(now);
        scene(now);
        grill(now, t);
        if (state === "served") plated(now);
        smoke = smoke.filter(s => (s.life -= dt) > 0);
        smoke.forEach(s => { s.y -= dt * 0.012; s.x += Math.sin((s.life + s.x) / 120) * 0.08; px(s.x, s.y, s.c); px(s.x + 1, s.y, s.c); });
        thermometer(t);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "Case 004 is **enterohemorrhagic E. coli (EHEC)**, also called Shiga toxin-producing E. coli (STEC). The 2015 Chipotle outbreak was the strain **O26**: 55 people in 11 states, 20 hospitalized, no deaths. The classic Step 1 strain is **O157:H7**.\n\n" +
      "It's a **lactose-fermenting Gram-negative rod** that doesn't invade; its **Shiga-like toxin** cleaves 28S rRNA and **inactivates the 60S ribosome**. O157:H7 is the strain that **doesn't ferment sorbitol** (colorless on sorbitol-MacConkey).\n\n" +
      "Expect **bloody diarrhea with little fever** after **undercooked ground beef**, unpasteurized milk or juice, or leafy greens; cattle are the reservoir and the infectious dose is low. The feared complication is **hemolytic uremic syndrome** in kids: **schistocytes** (hemolytic anemia), **low platelets** and **acute kidney injury**. Treat with **supportive care**; **avoid antibiotics**, which can raise the risk of HUS."
    ,
    chart: {
      type: "Gram-negative rod; lactose fermenter; O157:H7 doesn't ferment sorbitol",
      transmission: "**Undercooked ground beef**, unpasteurized milk or juice, contaminated produce; cattle reservoir; low infectious dose",
      treatment: "**Supportive** (fluids); **avoid antibiotics**, which may raise HUS risk",
      association: "**Bloody diarrhea, little fever**. **Shiga-like toxin** inactivates 60S. **HUS**: schistocytes, thrombocytopenia, acute kidney injury."
    }
  }
});
