// Micrerdle case 001: Francisella tularensis
// To edit this case, change the text below. Hints appear in order; **double asterisks** bold a key fact.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, special (sets the hint's label, icon and colour).
// Any mix of types is fine; a type can repeat.
MICRERDLE_CASES.push({
  answer: "francisella-tularensis",
  hints: [
    { type: "exposure",
      text: "The tick that carries it, Dermacentor, is the same one behind Rocky Mountain spotted fever." },
    { type: "history",
      text: "Some historians claim it was used during the Battle of Stalingrad. Had it been, the treatment would have been an aminoglycoside like streptomycin or gentamicin, though streptomycin was still a year from being discovered." },
    { type: "presentation",
      text: "An ulcer forms where the tick bit, and the lymph nodes draining that spot swell up, tender and sometimes breaking down." },
    { type: "lab",
      text: "A tiny Gram-negative coccobacillus that won't grow unless the medium has cysteine, a requirement it shares with Legionella. It survives inside macrophages, so the biopsy gets mistaken for TB." },
    { type: "exposure",
      text: "This organism caused a cluster of pneumonia on Martha's Vineyard among landscapers whose mowers ran over rabbit nests hidden in the grass, throwing it into the air. Hunters and trappers skinning rabbits and hares have always been the other group at risk." },
    { type: "history",
      text: "First isolated in Tulare County, California, and worked out by Edward Francis, who gave it his name." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End animation: a dry California roadside. A rabbit hops along the road toward a highway sign for
    // Tulare County, where the organism was first isolated (and named), stops under it, then hops on.
    art: function (host, { still }) {
      const W = 128, H = 56;
      host.innerHTML = `<canvas width="${W}" height="${H}" role="img" aria-label="Animation of a rabbit hopping along a country road toward a highway sign pointing to Tulare County, California"></canvas>
        <p class="art-caption">Tularemia is named for Tulare County, California</p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        sky: "#CFE8F4", cloud: "#FFFFFF", cloudShade: "#E3F0F7", hillFar: "#B9C98E", hill: "#9DB56E",
        grass: "#DCC37A", grassDark: "#C7AB5E", road: "#77706E", roadEdge: "#5E5856", dash: "#F2D04A",
        sign: "#2E7D4F", signEdge: "#E9F3EC", text: "#FFFFFF", post: "#7A5A3A", postDark: "#5C4229",
        fur: "#9C7B5B", furDark: "#7A5C40", belly: "#CDB08E", tail: "#FFFFFF", ear: "#E7A8B4", eye: "#2A1A12"
      };

      // tiny 3x5 letters for the sign
      const FONT = {
        T: ["###", ".#.", ".#.", ".#.", ".#."], U: ["#.#", "#.#", "#.#", "#.#", "###"], L: ["#..", "#..", "#..", "#..", "###"],
        A: [".#.", "#.#", "###", "#.#", "#.#"], R: ["##.", "#.#", "##.", "#.#", "#.#"], E: ["###", "#..", "##.", "#..", "###"],
        C: [".##", "#..", "#..", "#..", ".##"], O: [".#.", "#.#", "#.#", "#.#", ".#."], N: ["#.#", "###", "###", "#.#", "#.#"],
        Y: ["#.#", "#.#", ".#.", ".#.", ".#."], I: ["###", ".#.", ".#.", ".#.", "###"], F: ["###", "#..", "##.", "#..", "#.."], " ": ["...", "...", "...", "...", "..."]
      };
      const textW = t => t.length * 4 - 1;
      const write = (t, x, y, c) => [...t].forEach((ch, i) => (FONT[ch] || FONT[" "]).forEach((r, ry) => [...r].forEach((b, rx) => { if (b === "#") px(x + i * 4 + rx, y + ry, c); })));

      // rabbit, facing right. 1 fur, 2 dark fur, 3 belly, W tail, P inner ear, E eye
      const SIT = [
        "........P.P.",
        "........P.P.",
        "........1.1.",
        ".......1111.",
        "......111E11",
        "..1111111111",
        ".W1111111111",
        "WW111111333.",
        ".1111113333.",
        ".22.....22.."
      ];
      const HOP = [
        ".........P.P",
        ".........1.1",
        "........1111",
        ".......111E1",
        "...111111111",
        "W11111111333",
        "WW1111113333",
        "22........22",
        "............",
        "............"
      ];
      const PAL = { "1": C.fur, "2": C.furDark, "3": C.belly, W: C.tail, P: C.ear, E: C.eye };
      const bunny = (rows, x, y, nose) => {
        rows.forEach((r, ry) => [...r].forEach((ch, rx) => { if (PAL[ch]) px(x + rx, y + ry, PAL[ch]); }));
        if (nose) px(x + 12, y + 5, C.ear);   // nose wiggle
      };

      const ROAD_Y = 41, GROUND = ROAD_Y + 6;   // rabbit's feet land on this row
      const SIGN = { x: 57, y: 3, w: textW("TULARE COUNTY") + 6, h: 16 };
      const STOP_X = 66, HOP_LEN = 9, HOP_FRAMES = 9;
      const clouds = [{ x: 10, y: 5, w: 14 }, { x: 48, y: 9, w: 10 }, { x: 96, y: 4, w: 12 }];

      function scene(t) {
        // sky, clouds, hills
        rect(0, 0, W, H, C.sky);
        clouds.forEach((c, i) => {
          const cx = ((c.x + t * (0.06 + i * 0.02)) % (W + 30)) - 20;
          rect(cx, c.y, c.w, 3, C.cloud); rect(cx + 3, c.y - 2, c.w - 6, 2, C.cloud); rect(cx + 1, c.y + 3, c.w - 2, 1, C.cloudShade);
        });
        for (let x = 0; x < W; x++) {
          const far = 25 + Math.round(Math.sin(x / 13) * 3 + Math.sin(x / 5.3) * 1);
          rect(x, far, 1, 34 - far, C.hillFar);
          const near = 30 + Math.round(Math.sin(x / 9 + 2) * 2);
          rect(x, near, 1, ROAD_Y - near, C.hill);
        }
        // dry golden grass verge, then the road with its dashed center line
        rect(0, 33, W, ROAD_Y - 33, C.grass);
        for (let x = 1; x < W; x += 3) px(x, 33 + ((x * 7) % 5), C.grassDark);
        rect(0, ROAD_Y, W, 1, C.roadEdge); rect(0, ROAD_Y + 1, W, 12, C.road); rect(0, ROAD_Y + 13, W, 1, C.roadEdge);
        for (let x = 2; x < W; x += 10) rect(x, ROAD_Y + 7, 5, 1, C.dash);
        rect(0, ROAD_Y + 14, W, H - ROAD_Y - 14, C.grass);
        // the sign: two posts, a green panel with a white border, and an arrow pointing down the road
        const s = SIGN;
        rect(s.x + 8, s.y + s.h, 2, 33 - s.y - s.h + 2, C.post); rect(s.x + s.w - 12, s.y + s.h, 2, 33 - s.y - s.h + 2, C.post);
        px(s.x + 9, s.y + s.h + 4, C.postDark); px(s.x + s.w - 11, s.y + s.h + 7, C.postDark);
        rect(s.x, s.y, s.w, s.h, C.signEdge); rect(s.x + 1, s.y + 1, s.w - 2, s.h - 2, C.sign);
        for (let k = 0; k < s.h / 2; k++) {            // arrow point: a white-edged green triangle off the right side
          const x = s.x + s.w - 1 + k, top = s.y + k, bot = s.y + s.h - 1 - k;
          rect(x, top, 1, bot - top + 1, C.signEdge);
          if (bot - top > 1) rect(x, top + 1, 1, bot - top - 1, C.sign);
        }
        write("TULARE COUNTY", s.x + 3, s.y + 3, C.text);
        write("CALIFORNIA", s.x + 3 + Math.floor((textW("TULARE COUNTY") - textW("CALIFORNIA")) / 2), s.y + 9, C.text);
      }

      // timeline (frames at ~14 fps): hop in, sit under the sign, hop on out, pause, repeat
      const hopsIn = Math.ceil((STOP_X + 14) / HOP_LEN);
      const IN = hopsIn * HOP_FRAMES, SITF = 34, OUT = Math.ceil((W - STOP_X + 4) / HOP_LEN) * HOP_FRAMES, GAP = 10;
      const LOOP = IN + SITF + OUT + GAP;
      function rabbitAt(f) {
        if (f < IN) {                                   // hopping in from the left
          const h = Math.floor(f / HOP_FRAMES), k = (f % HOP_FRAMES) / HOP_FRAMES;
          const x = STOP_X - (hopsIn - h) * HOP_LEN + k * HOP_LEN;
          return { x, lift: Math.sin(k * Math.PI) * 5, air: k > 0.15 && k < 0.85 };
        }
        f -= IN;
        if (f < SITF) return { x: STOP_X, lift: 0, air: false, nose: Math.floor(f / 3) % 2 === 0 };   // sitting under the sign
        f -= SITF;
        if (f < OUT) {                                  // hopping on down the road
          const h = Math.floor(f / HOP_FRAMES), k = (f % HOP_FRAMES) / HOP_FRAMES;
          return { x: STOP_X + h * HOP_LEN + k * HOP_LEN, lift: Math.sin(k * Math.PI) * 5, air: k > 0.15 && k < 0.85 };
        }
        return null;                                    // off screen for a moment
      }

      let f = 0, last = 0;
      function frame(now) {
        if (!cv.isConnected) return;
        if (now - last > 70 || still) {
          last = now;
          scene(f);
          const r = still ? { x: STOP_X, lift: 0, air: false, nose: false } : rabbitAt(f % LOOP);
          if (r) bunny(r.air ? HOP : SIT, r.x, GROUND - 9 - Math.round(r.lift), r.nose);
          f++;
        }
        if (!still) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "Our first Micrerdle case is **Francisella tularensis**, the cause of tularemia. Students lock onto the easy association, tularemia means rabbits, but test writers are rarely that kind. The vignette is likelier to hand you a **tick bite**, a deer fly in midsummer, a hunter dressing game, untreated creek water, or a landscaper who mowed over a nest. Learn the whole exposure list, not the rabbit.\n\n" +
      "The lab is where it gives itself away. A tiny **Gram-negative pleomorphic coccobacillus** that flatly refuses to grow unless you hand it **cysteine**, a demand it shares with Legionella, and that pairing is itself fair game on a test. In practice the lab often doesn't try: growing it endangers the people doing the work, so the diagnosis is usually **serologic**.\n\n" +
      "Once inside you, it goes where antibodies can't follow, into **macrophages**. The body's answer is to wall it off in **caseating granulomas**, so the biopsy looks like TB. Beta-lactams are useless against it; the treatment is **streptomycin or gentamicin**, with doxycycline or ciprofloxacin as alternatives.\n\n" +
      "The classic picture is **ulceroglandular**, an ulcer where the bite was with swollen, tender nodes draining it. Inhale it instead and you get the **pneumonic** form, the one that kills. The CDC keeps it on the short **Tier 1 select agent** list with Yersinia pestis and Bacillus anthracis."
    ,
    chart: {
      type: "Gram-negative pleomorphic coccobacillus; facultative intracellular",
      transmission: "Dermacentor tick and deer fly bites; contact with infected animals or carcasses (rabbits, hares, rodents); inhaled aerosol",
      treatment: "**Streptomycin** or gentamicin (aminoglycosides); doxycycline or ciprofloxacin as alternatives",
      association: "Ulcer plus a swollen draining node after a tick bite or skinning a rabbit. **Needs cysteine** to grow, like Legionella. Granulomas mimic TB."
    }
  }
});
