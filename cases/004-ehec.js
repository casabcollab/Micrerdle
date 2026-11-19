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
    // End animation: a sunny pasture. A Holstein cow grazes, lifts her head to chew and swish her tail,
    // then goes back to the grass. Cattle are EHEC's reservoir.
    art: function (host, { still }) {
      const W = 128, H = 56;
      host.innerHTML = `<canvas width="${W}" height="${H}" role="img" aria-label="Animation of a black and white cow grazing in a sunny pasture, lifting her head to chew and swishing her tail"></canvas>
        <p class="art-caption">Cattle are the reservoir for EHEC</p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        sky: "#BFE3F2", skyLow: "#DDF1F7", cloud: "#FFFFFF", cloudShade: "#E6F2F7", sun: "#FFE27A", sunCore: "#FFF3B8",
        hillFar: "#A9D27C", hill: "#86C05B", grass: "#6DB24A", grassDark: "#4E9135", grassLight: "#94D36B",
        fence: "#A07850", fenceDark: "#7A5A3A", flowerW: "#FFFFFF", flowerY: "#F6D44A",
        cow: "#F4F1EA", cowShade: "#D6CFC2", spot: "#26221F", pink: "#E7A3A8", hoof: "#4A4038", horn: "#E8DDB5", eye: "#1A1410"
      };
      const GROUND = 36, FEET = 47;                       // where the pasture starts, and the row the hooves stand on
      const clouds = [{ x: 8, y: 6, w: 16 }, { x: 60, y: 10, w: 11 }, { x: 98, y: 5, w: 13 }];
      const flowers = [[12, 44, "W"], [27, 50, "Y"], [38, 41, "W"], [92, 45, "Y"], [104, 51, "W"], [117, 43, "Y"], [21, 39, "Y"], [111, 38, "W"]];
      const tufts = [];
      for (let x = 1; x < W; x += 3) tufts.push([x, GROUND + 2 + ((x * 7) % 17)]);

      function scene(t) {
        rect(0, 0, W, 14, C.sky); rect(0, 14, W, GROUND - 14, C.skyLow);
        for (let y = -5; y <= 5; y++) for (let x = -5; x <= 5; x++) if (x * x + y * y <= 26) px(16 + x, 9 + y, x * x + y * y <= 9 ? C.sunCore : C.sun);
        clouds.forEach((c, i) => {
          const cx = ((c.x + t * (0.05 + i * 0.02)) % (W + 30)) - 20;
          rect(cx, c.y, c.w, 3, C.cloud); rect(cx + 3, c.y - 2, c.w - 6, 2, C.cloud); rect(cx + 1, c.y + 3, c.w - 2, 1, C.cloudShade);
        });
        for (let x = 0; x < W; x++) {                      // rolling hills behind the pasture
          const far = 25 + Math.round(Math.sin(x / 15 + 1) * 3 + Math.sin(x / 6) * 1);
          rect(x, far, 1, GROUND - far, C.hillFar);
          const near = 30 + Math.round(Math.sin(x / 10 + 3) * 2);
          rect(x, near, 1, GROUND - near, C.hill);
        }
        // a wooden fence along the back of the field
        for (let x = 2; x < W; x += 14) { rect(x, 27, 2, 10, C.fence); px(x + 1, 27, C.fenceDark); }
        rect(0, 29, W, 1, C.fence); rect(0, 33, W, 1, C.fence); rect(0, 30, W, 1, C.fenceDark);
        rect(0, GROUND, W, H - GROUND, C.grass);
        tufts.forEach(([x, y], i) => { const s = Math.round(Math.sin(t / 8 + i) * 0.6); px(x + s, y - 1, C.grassLight); px(x, y, C.grassDark); px(x + 1, y, C.grassDark); });
        flowers.forEach(([x, y, k]) => { const c = k === "W" ? C.flowerW : C.flowerY; px(x, y - 1, c); px(x - 1, y, c); px(x + 1, y, c); px(x, y + 1, c); px(x, y, C.flowerY === c ? "#E59A2E" : C.flowerY); });
      }

      // ---------- the cow (Holstein, facing right) ----------
      const BX = 44, BY = 31, BW = 23, BH = 11;            // body box
      const spots = [[5, 3, 3.2], [13, 7, 3], [19, 2, 2.4], [9, 0, 2]];
      const HEAD = [                                       // facing right. W white, B black, P pink, H horn, E eye
        "..H.....",
        "BBWWB...",
        ".WWWWWB.",
        ".WWEWWWW",
        "..WWWWWW",
        "..WWWPPP",
        "...WPPPP",
        "....PPP."
      ];
      const HPAL = { W: C.cow, B: C.spot, P: C.pink, H: C.horn, E: C.eye };
      function head(x, y, chew) {
        HEAD.forEach((r, ry) => [...r].forEach((ch, rx) => { if (HPAL[ch]) px(x + rx, y + ry + (ry >= 6 && chew ? 1 : 0), HPAL[ch]); }));
      }
      function body(tailPhase) {
        // legs first, so the body sits on top of them
        [[2, 0], [5, 1], [17, 0], [20, 1]].forEach(([lx, shade]) => {
          rect(BX + lx, BY + BH - 1, 2, FEET - (BY + BH - 1), shade ? C.cowShade : C.cow);
          rect(BX + lx, FEET - 1, 2, 1, C.hoof);
        });
        rect(BX + 8, BY + BH - 1, 4, 2, C.pink); px(BX + 8, BY + BH + 1, C.pink); px(BX + 11, BY + BH + 1, C.pink);   // udder
        for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
          if ((x < 2 || x > BW - 3) && (y < 1 || y > BH - 2)) continue;   // rounded corners
          let c = y > BH - 3 ? C.cowShade : C.cow;
          if (spots.some(([sx, sy, r]) => (x - sx) ** 2 + (y - sy) ** 2 <= r * r)) c = C.spot;
          px(BX + x, BY + y, c);
        }
        // tail: hangs from the rump and swishes side to side, black tuft at the end
        const sw = Math.sin(tailPhase) * 2.2;
        for (let i = 0; i < 9; i++) px(BX - 1 + Math.round(sw * (i / 8) * (i / 8)) - (i > 6 ? 0 : 0), BY + 1 + i, C.cowShade);
        px(BX - 1 + Math.round(sw), BY + 10, C.spot); px(BX - 2 + Math.round(sw), BY + 10, C.spot); px(BX - 1 + Math.round(sw), BY + 11, C.spot);
      }
      function neck(hx, hy) {                              // a thick band from the shoulders to the back of the head
        const x0 = BX + BW - 4, y0 = BY + 1;
        for (let k = 0; k <= 10; k++) {
          const p = k / 10, x = x0 + (hx + 1 - x0) * p, y = y0 + (hy + 2 - y0) * p;
          for (let d = 0; d < 5; d++) px(x + (d > 2 ? 1 : 0), y + d, d === 4 ? C.cowShade : C.cow);
        }
        px(x0 + 2, y0 + 1, C.spot); px(x0 + 3, y0 + 1, C.spot); px(x0 + 2, y0 + 2, C.spot);   // a patch on the neck
      }
      const UP = { x: BX + BW - 1, y: BY - 6 }, DOWN = { x: BX + BW + 2, y: FEET - 8 };

      // timeline (frames at ~14 fps): graze with the head down, lift it to chew and look around, graze again
      const GRAZE = 56, LIFT = 6, CHEW = 40, DROP = 6, LOOP = GRAZE + LIFT + CHEW + DROP;
      let f = 0, last = 0;
      function frame(now) {
        if (!cv.isConnected) return;
        if (now - last > 70 || still) {
          last = now;
          scene(f);
          const k = still ? GRAZE + LIFT + 2 : f % LOOP;
          let p, chew = false, nibble = 0;
          if (k < GRAZE) { p = 1; nibble = Math.floor(k / 5) % 2; }                        // head down, tugging at the grass
          else if (k < GRAZE + LIFT) p = 1 - (k - GRAZE) / LIFT;                           // lifting
          else if (k < GRAZE + LIFT + CHEW) { p = 0; chew = Math.floor(k / 3) % 2 === 0; } // head up, chewing
          else p = (k - GRAZE - LIFT - CHEW) / DROP;                                       // back down
          const hx = Math.round(UP.x + (DOWN.x - UP.x) * p), hy = Math.round(UP.y + (DOWN.y - UP.y) * p) + nibble;
          body(f / 4);
          neck(hx, hy);
          head(hx, hy, chew);
          f++;
        }
        if (!still) requestAnimationFrame(frame);
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
