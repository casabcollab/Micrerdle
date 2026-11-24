// Micrerdle case 006: Varicella-zoster virus (shingles after an Achilles tear)
// To edit this case, change the text below. Hints appear in order.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// Any mix of types is fine; a type can repeat.
MICRERDLE_CASES.push({
  answer: "varicella-zoster-virus",
  hints: [
    { type: "presentation",
      text: "A first-year med student tears his Achilles during a game of kickball. A week after surgery, a burning, tingling pain starts along the back of his calf and won't let up, even though the incision looks fine." },
    { type: "history",
      text: "In 1964, a Japanese virologist's 3-year-old son caught this virus from a neighbor's daughter. Ten years later that scientist made the first vaccine against any herpesvirus, grown from the blisters of another 3-year-old boy. The strain still carries the boy's family name: Oka." },
    { type: "lab",
      text: "Days later, blisters appear. A scraping from the base of one, stained with Giemsa, shows multinucleated giant cells." },
    { type: "presentation",
      text: "The blisters run in a stripe on one side only, down the back of his calf and along the outer edge of his foot. It's the same nerve root his doctors check with the ankle reflex." },
    { type: "exposure",
      text: "His roommate never had chickenpox and was never vaccinated, so he should keep his distance until every blister crusts over." },
    { type: "etymology",
      text: "Its common name and its medical name mean the same thing, \"belt,\" one from Latin and one from Greek." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End animation: a sensory neuron in cross-section. The virus sleeps in the dorsal root ganglion until a kickball
    // bonks the skin, then wakes, rides the nerve out to the skin, and a stripe of blisters erupts and crusts over.
    art: function (host, { still }) {
      const W = 128, H = 56;
      host.innerHTML = `<canvas width="${W}" height="${H}" role="img" aria-label="Animation of a virus asleep in a nerve ganglion that wakes when a kickball hits the skin, travels down the nerve, and causes a stripe of blisters"></canvas>
        <p class="art-caption">Asleep in a nerve ganglion for years, it rides the nerve back out to the skin</p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; g.fillStyle = c; g.fillRect(x, y, 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        bg: "#FBEFF3", cord: "#E6CCDD", cordEdge: "#C79AB9", grey: "#D6B3CB",
        gang: "#F2D36B", gangEdge: "#C9A63E", nucleus: "#B8872A", nerve: "#E0B84E", myelin: "#F6E2A6",
        dermis: "#F3C3A5", epi: "#E8A07A", surface: "#C9805C", air: "#DDF1F7",
        ball: "#D7263D", ballHi: "#F26D7D", ballDark: "#9E1B2C",
        cap: "#2FB8C4", capDark: "#137A85", spike: "#8FE3E9", eye: "#1A0915", white: "#FFFFFF",
        vesicle: "#F4FBFF", vesEdge: "#BFD8E8", base: "#E05A5A", crust: "#C8923A", crustDark: "#9C6A22",
        zap: "#FFD45A", text: "#7A3F66"
      };
      const NY = 27;                                        // the nerve's height
      const GX = 30;                                        // ganglion centre
      const SKIN = 112, SURF = 117;                         // epidermis starts, skin surface
      const BLISTERS = [10, 17, 24, 31, 38, 45];            // the stripe of blisters down the dermatome
      const VIRUS = [".s.s.s.", "s.CCC.s", ".CCCCC.", "sCCCCCs", ".CCCCC.", "s.CCC.s", ".s.s.s."];
      const ZED = ["####", "..#.", ".#..", "####"];

      function scene(f) {
        rect(0, 0, W, H, C.bg);
        rect(2, 0, 12, H, C.cord); rect(2, 0, 1, H, C.cordEdge); rect(13, 0, 1, H, C.cordEdge);   // spinal cord
        for (let y = 18; y < 37; y++) { const w = Math.round(3 * Math.sin((y - 18) / 19 * Math.PI)); rect(8 - w, y, w * 2, 1, C.grey); }
        rect(14, NY - 1, 10, 2, C.nerve);                                                          // central branch into the cord
        for (let y = -6; y <= 6; y++) for (let x = -8; x <= 8; x++) {                               // the dorsal root ganglion
          const d = (x * x) / 64 + (y * y) / 36;
          if (d <= 1) px(GX + x, NY + y, d > 0.8 ? C.gangEdge : C.gang);
        }
        [[-4, -2], [3, 3], [-2, 3], [4, -3]].forEach(([x, y]) => { px(GX + x, NY + y, C.nucleus); px(GX + x + 1, NY + y, C.nucleus); });
        for (let x = GX + 8; x < 98; x++) rect(x, NY - 1, 1, 2, (Math.floor((x - GX) / 6) % 2) ? C.myelin : C.nerve);   // peripheral branch
        rect(98, 0, SKIN - 98, H, C.dermis); rect(SKIN, 0, SURF - SKIN, H, C.epi); rect(SURF, 0, 1, H, C.surface);
        rect(SURF + 1, 0, W - SURF - 1, H, C.air);
        BLISTERS.forEach(by => {                            // nerve endings fanning out to each patch of skin
          const steps = SKIN - 98;
          for (let i = 0; i <= steps; i++) px(98 + i, NY + Math.round((by - NY) * i / steps), C.nerve);
        });
      }
      function virus(x, y, awake) {
        VIRUS.forEach((r, ry) => [...r].forEach((ch, rx) => { if (ch === "C") px(x + rx, y + ry, C.cap); else if (ch === "s") px(x + rx, y + ry, C.spike); }));
        rect(x + 1, y + 5, 5, 1, C.capDark);
        if (awake) { px(x + 2, y + 3, C.eye); px(x + 4, y + 3, C.eye); px(x + 2, y + 2, C.white); px(x + 4, y + 2, C.white); }
        else { px(x + 1, y + 3, C.eye); px(x + 2, y + 3, C.eye); px(x + 4, y + 3, C.eye); px(x + 5, y + 3, C.eye); }
      }
      function blister(y, crusted) {
        if (crusted) { rect(SURF + 1, y - 1, 3, 3, C.crust); px(SURF + 2, y, C.crustDark); px(SURF + 3, y + 1, C.crustDark); return; }
        rect(SURF - 1, y - 2, 2, 5, C.base);
        rect(SURF + 1, y - 2, 3, 5, C.vesicle); rect(SURF + 4, y - 1, 1, 3, C.vesicle);
        px(SURF + 1, y - 2, C.vesEdge); px(SURF + 1, y + 2, C.vesEdge); px(SURF + 2, y - 1, C.white);
      }
      function ball(x, y) {
        for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) if (dx * dx + dy * dy <= 10) px(x + dx, y + dy, dx + dy > 2 ? C.ballDark : C.ball);
        px(x - 1, y - 2, C.ballHi); px(x - 2, y - 1, C.ballHi);
      }

      // timeline (frames at ~14 fps): sleeping, kickball hits, wakes, rides the nerve out, blisters, crusts, repeat
      const LOOP = 210;
      let f = 0, last = 0;
      function frame(now) {
        if (!cv.isConnected) return;
        if (now - last > 70 || still) {
          last = now;
          const k = still ? 150 : f % LOOP;
          scene(k);
          // the kickball comes in from the right, bonks the skin, bounces away
          if (k >= 40 && k < 72) {
            const p = (k - 40) / 18;
            if (k < 58) ball(W + 4 - (W + 4 - (SURF + 4)) * p, NY - 6 + Math.round(Math.abs(Math.sin(p * Math.PI * 1.5)) * -4));
            else { const q = (k - 58) / 14; ball(SURF + 4 + 22 * q, NY - 6 - 14 * q + 20 * q * q); }
          }
          if (k >= 58 && k < 62) for (let y = NY - 8; y <= NY + 2; y++) px(SURF, y, C.zap);
          // the virus: asleep in the ganglion, awake after the hit, then out along the nerve to the skin
          const awake = k >= 60 && k < 195;
          let vx = GX - 3;
          if (k >= 72 && k < 112) vx = GX - 3 + (95 - (GX - 3)) * (k - 72) / 40;
          else if (k >= 112 && k < 195) vx = 95;
          if (k < 195) virus(vx, NY - 3, awake);
          if (!awake && k < 60) {                                    // Zzz
            const z = (k % 30) / 30;
            ZED.forEach((r, ry) => [...r].forEach((b, rx) => { if (b === "#") px(GX + 3 + rx + Math.round(z * 4), NY - 12 + ry - Math.round(z * 6), C.text); }));
          }
          if (k >= 62 && k < 72) { rect(GX, NY - 12, 1, 3, C.base); px(GX, NY - 8, C.base); }   // "!"
          // burning pain: sparks run along the nerve while the rash comes up
          if (k >= 100 && k < 160) for (let i = 0; i < 4; i++) { const x = GX + 10 + ((k * 3 + i * 17) % 58); px(x, NY - 2 - (i % 2), C.zap); }
          BLISTERS.forEach((by, i) => { const t = 112 + i * 6; if (k >= t) blister(by, k >= 160 + i * 4); });
          f++;
        }
        if (!still) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "A torn Achilles and a burning calf: case 006 is **varicella-zoster virus**, and the injury wasn't a coincidence. Physical trauma raises the risk of shingles right where it happened; in one case-control study, about twelvefold in the following month. He's young for shingles and was probably vaccinated as a kid, but zoster can still reactivate, from wild-type virus or, less often, the vaccine strain.\n\n" +
      "VZV is an **enveloped dsDNA herpesvirus** (HHV-3). Primary infection is **chickenpox**, spread by respiratory droplets and contact with vesicle fluid: itchy vesicles on a red base (**dewdrops on a rose petal**) in **different stages at once**, starting on the face and trunk. Afterward it goes **latent in dorsal root and cranial nerve ganglia**.\n\n" +
      "Reactivation, usually with age or weakened **cell-mediated immunity**, gives **shingles**: burning pain first, then vesicles in a **single dermatome** that stop at the midline. Watch for **postherpetic neuralgia**, **zoster ophthalmicus** (V1; vesicles on the nose tip are **Hutchinson sign**) and **Ramsay Hunt syndrome** (facial palsy plus ear vesicles). The blisters can give chickenpox to non-immune contacts until they crust. A **Tzanck smear** shows multinucleated giant cells (HSV does too); PCR confirms.\n\n" +
      "Treat with **acyclovir, valacyclovir or famciclovir**, which need the viral **thymidine kinase** to activate, ideally within 72 hours; **foscarnet** if resistant. Two vaccines: the **live attenuated** varicella vaccine (Oka strain) for children, and the **recombinant** zoster vaccine (glycoprotein E) for adults, safe in the immunocompromised because nothing in it is alive."
    ,
    chart: {
      type: "Enveloped dsDNA herpesvirus (HHV-3); latent in dorsal root and cranial nerve ganglia",
      transmission: "Respiratory droplets and contact with vesicle fluid; shingles blisters can give chickenpox to non-immune contacts until they crust",
      treatment: "**Acyclovir / valacyclovir** (need viral thymidine kinase), foscarnet if resistant. Live varicella vaccine for kids, **recombinant zoster vaccine** for adults",
      association: "Chickenpox: lesions in **different stages**. Shingles: painful vesicles in **one dermatome**, stopping at the midline. **Tzanck**: multinucleated giant cells."
    }
  }
});
