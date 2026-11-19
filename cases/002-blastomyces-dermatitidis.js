// Micrerdle case 002: Blastomyces dermatitidis
// To edit this case, change the text below. Hints appear in order; **double asterisks** bold a key fact.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// Any mix of types is fine; a type can repeat.
MICRERDLE_CASES.push({
  answer: "blastomyces-dermatitidis",
  hints: [
    { type: "presentation",
      text: "A man in his 40s has had months of cough, night sweats and weight loss. Now a crusted, wart-like spot on his cheek keeps growing, and his shin aches. His chest X-ray was read as possible lung cancer." },
    { type: "presentation",
      text: "He's immunocompetent: HIV-negative, no transplant, no steroids. No one at home is sick, and no one will catch it from him, because it doesn't spread person to person. An X-ray of the shin shows a lytic bone lesion." },
    { type: "history",
      text: "First described in 1894 by Thomas Gilchrist, a Johns Hopkins dermatologist who at first took it for a protozoan. So many early skin cases turned up around one Midwestern city that it was nicknamed Chicago disease." },
    // TODO: add the drawing here later (broad-based budding yeast next to an RBC for scale).
    { type: "lab",
      text: "A silver stain (GMS) of the skin biopsy shows large yeast, up to twice the size of the red cells beside them, each with a thick, double-contoured wall. Every yeast carries a single daughter bud joined by a wide base, with no capsule around it." },
    { type: "exposure",
      text: "It lives in moist soil and rotting wood near lakes and rivers, beaver lodges included, across the Great Lakes and the Ohio and Mississippi River valleys. You get it by inhaling spores from disturbed soil. Strangely, it grows easily from patient samples but has been isolated from nature only about 20 times." },
    { type: "etymology",
      text: "Its name is Greek for bud, plus a nod to the skin it loves, and the mnemonic says it buds broadly. The other dimorphics look nothing like it: Histo hides inside macrophages, Cocci makes spherules, Paracocci makes a captain's wheel." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End animation: dusk on a Great Lakes shore, a city skyline across the water. A beaver swims
    // toward its lodge of sticks and dives under, where Blastomyces lives in the damp, rotting wood.
    art: function (host, { still }) {
      const W = 128, H = 56;
      host.innerHTML = `<canvas width="${W}" height="${H}" role="img" aria-label="Animation of a beaver swimming across a lake at dusk toward its stick lodge, with a city skyline in the distance"></canvas>
        <p class="art-caption">Once called Chicago disease, it lives in damp wood by the water</p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        skyTop: "#E9A07C", skyMid: "#F4BE8E", skyLow: "#F9DCB0", sun: "#FFE8A3", sunCore: "#FFF6D6",
        city: "#6B5470", cityDark: "#55405B", lit: "#FFD36B",
        water: "#4C7FA6", waterDark: "#3B6A8F", shimmer: "#8FB9D8", glint: "#FFE8A3",
        lodge: "#6B4A2E", lodgeDark: "#4E3420", stick: "#8C6744", reed: "#5E7A3A", reedTop: "#7A6A3A",
        fur: "#7A5232", furDark: "#573822", tail: "#3E2A1A", eye: "#1A0F08", wake: "#CFE3F0"
      };
      const HORIZON = 30, WY = 46;                     // horizon row, and the waterline the beaver swims on

      // a fixed skyline (seeded so it's the same every time), with a couple of tall towers
      let seed = 11;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      const towers = [];
      for (let x = 4; x < 72;) {
        const w = 3 + Math.floor(rnd() * 5), h = 5 + Math.floor(rnd() * 11);
        towers.push({ x, w, h, dark: rnd() < 0.4 }); x += w + (rnd() < 0.3 ? 1 : 0);
      }
      towers.push({ x: 30, w: 5, h: 22, dark: false, spire: 3 }, { x: 52, w: 4, h: 18, dark: true, spire: 2 });
      const windows = [];
      towers.forEach(t => { for (let y = HORIZON - t.h + 2; y < HORIZON - 1; y += 2) for (let x = t.x + 1; x < t.x + t.w - 1; x += 2) if (rnd() < 0.35) windows.push([x, y]); });
      const reeds = [[84, 9], [86, 6], [88, 8], [124, 7], [126, 10]];

      function scene(t) {
        // dusk sky in bands, the sun sitting low behind the city
        rect(0, 0, W, 10, C.skyTop); rect(0, 10, W, 10, C.skyMid); rect(0, 20, W, HORIZON - 20, C.skyLow);
        for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) if (x * x + y * y <= 38 && 24 + y < HORIZON) px(90 + x, 24 + y, x * x + y * y <= 12 ? C.sunCore : C.sun);
        towers.forEach(tw => {
          rect(tw.x, HORIZON - tw.h, tw.w, tw.h, tw.dark ? C.cityDark : C.city);
          if (tw.spire) rect(tw.x + (tw.w >> 1), HORIZON - tw.h - tw.spire, 1, tw.spire, C.cityDark);
        });
        windows.forEach(([x, y], i) => { if ((i * 7 + Math.floor(t / 40)) % 11) px(x, y, C.lit); });
        // the lake, with drifting shimmer and the sun's reflection
        rect(0, HORIZON, W, H - HORIZON, C.water);
        for (let y = HORIZON + 1; y < H; y += 3) {
          const off = Math.floor(t * (0.15 + (y % 5) * 0.03)) % 9;
          for (let x = (y * 5 + off) % 9; x < W; x += 9) rect(x, y, 3, 1, (y - HORIZON) % 2 ? C.waterDark : C.shimmer);
        }
        for (let y = HORIZON + 1; y < H - 4; y += 2) { const w = 7 - Math.floor((y - HORIZON) / 4); if (w > 1) rect(90 - (w >> 1) + ((Math.floor(t / 4) + y) % 3) - 1, y, w, 1, C.glint); }
        // the lodge: a dome of mud and crisscrossed sticks sitting in the water
        const LX = 108, LB = 44;
        for (let x = -17; x <= 17; x++) {
          const h = Math.round(11 * Math.sqrt(Math.max(0, 1 - (x / 17) ** 2)));
          for (let y = 0; y < h; y++) {
            const yy = LB - y, s = ((x + y * 2) % 5 === 0) || ((x - y + 40) % 7 === 0);
            px(LX + x, yy, s ? C.stick : (y < 2 || x > 9 ? C.lodgeDark : C.lodge));
          }
        }
        for (let k = 0; k < 6; k++) { px(LX - 8 + k * 3, LB - 11 + (k % 2), C.stick); px(LX - 7 + k * 3, LB - 12 + (k % 2), C.stick); }   // sticks poking out the top
        rect(LX - 18, LB + 1, 36, 1, C.waterDark);   // its reflection line
        reeds.forEach(([x, h], i) => { const sway = Math.round(Math.sin(t / 9 + i) * 0.6); rect(x, LB + 2 - h, 1, h, C.reed); px(x + sway, LB + 1 - h, C.reedTop); });
      }

      // the beaver, facing right, swimming with only its head and back above water.
      // 1 fur, 2 dark fur, T tail, E eye; the bottom row sits on the waterline
      const BEAVER = [
        "........111.",
        "...111111E11",
        "TT2111111111",
        "TT.22222222."
      ];
      const PAL = { "1": C.fur, "2": C.furDark, T: C.tail, E: C.eye };
      function beaver(x, sink) {
        BEAVER.forEach((r, ry) => [...r].forEach((ch, rx) => {
          const y = WY - 3 + ry + sink;
          if (PAL[ch] && y <= WY) px(x + rx, y, PAL[ch]);
        }));
      }
      function wake(x, t) {        // ripples trailing behind it on the water
        for (let k = 2; k < 16; k += 2) if ((k + Math.floor(t / 2)) % 4) px(x - k, WY + 1 + (k > 8 ? 1 : 0), C.wake);
        px(x + 12, WY + 1, C.wake);
      }
      function rings(x, k) {       // the splash spreading out where it dived
        const r = 1 + k * 0.5;
        for (let a = 0; a < Math.PI * 2; a += 0.3) { const dx = Math.round(Math.cos(a) * r * 1.8), dy = Math.round(Math.sin(a) * r * 0.5); px(x + dx, WY + 1 + dy, C.wake); }
      }

      // timeline (frames at ~14 fps): swim in, dive at the lodge, ripples fade, pause, repeat
      const START = -14, DIVE_X = 84, SWIM = DIVE_X - START, SINK = 8, RING = 22, GAP = 18;
      const LOOP = SWIM + SINK + RING + GAP;
      let f = 0, last = 0;
      function frame(now) {
        if (!cv.isConnected) return;
        if (now - last > 70 || still) {
          last = now;
          scene(f);
          if (still) { wake(56, 0); beaver(56, 0); }
          else {
            const k = f % LOOP;
            if (k < SWIM) { const x = START + k; wake(x, f); beaver(x, 0); }
            else if (k < SWIM + SINK) beaver(DIVE_X, k - SWIM);
            else if (k < SWIM + SINK + RING) rings(DIVE_X + 6, k - SWIM - SINK);
          }
          f++;
        }
        if (!still) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "Case 002 is **Blastomyces dermatitidis**, one of the four **dimorphic endemic fungi**, along with Histoplasma, Coccidioides and Paracoccidioides. Like the rest of them it's a **mold in the soil and a yeast in the body**: mold in the cold, yeast in the heat.\n\n" +
      "Under the microscope it's the big one: a **large yeast** with a **thick, double-contoured wall** and a single bud attached by a **broad base**. That broad base is what Step 1 wants from you. Narrow-based budding with a capsule is Cryptococcus; small yeast packed inside macrophages is Histoplasma; spherules full of endospores are Coccidioides; a captain's wheel is Paracoccidioides.\n\n" +
      "It lives in **damp soil and rotting wood near water** around the **Great Lakes and the Ohio and Mississippi River valleys**, and outbreaks have been traced back to beaver lodges. Histoplasma shares those river valleys, but it comes from bird and bat droppings instead. You catch Blasto by **inhaling spores**, never from another person, and it happily infects **healthy people**: hunters, campers, and the dogs they bring along.\n\n" +
      "Disease starts in the **lungs**, where it gets mistaken for pneumonia, TB or cancer, and then spreads. The classic sites are the **skin** (crusted, wart-like lesions that look like squamous cell carcinoma), **bone** (lytic lesions) and the **prostate**. Treat mild to moderate disease with **itraconazole**, and severe, disseminated or CNS disease with **amphotericin B**."
    ,
    chart: {
      type: "Dimorphic fungus: mold in the soil, large broad-based budding yeast in tissue",
      transmission: "Inhaled spores from moist soil and rotting wood near water (Great Lakes, Ohio and Mississippi River valleys); not person to person",
      treatment: "**Itraconazole** for mild to moderate disease; **amphotericin B** for severe, disseminated or CNS disease",
      association: "**Broad-based budding** yeast with a thick double-contoured wall. Lung disease that spreads to **skin** (looks like SCC), **bone** and **prostate**, in healthy hosts."
    }
  }
});
