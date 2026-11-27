// Micrerdle case 009: Cytomegalovirus (the big cell virus)
// To edit this case, change the text below. Hints appear in order.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// A hint can also show a picture: image (the file, kept in cases/), alt (describes it for screen readers), credit (shown under it).
MICRERDLE_CASES.push({
  answer: "cytomegalovirus",
  hints: [
    { type: "special",
      text: "Once you have it, you have it for life." },
    { type: "exposure",
      text: "More than half of US adults have it by age 40." },
    { type: "history",
      text: "When pathologists first spotted its giant infected cells in a stillborn baby's organs in 1904, they thought they were looking at a protozoan parasite. Nobody grew the actual virus until the 1950s, when three different labs managed it at around the same time." },
    { type: "presentation",
      text: "In a healthy college student it can look just like mono (fever, fatigue, swollen glands), but the Monospot test comes back negative." },
    { type: "etymology",
      text: "Its name means \"big cell virus,\" because infected cells swell up huge, with an inclusion in the nucleus that looks like an owl's eye." },
    { type: "presentation",
      text: "It's the C in TORCH, and the most common infection passed to babies before birth. Affected newborns can have hearing loss, a small head, and calcium deposits lining the ventricles of the brain." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End animation: power-up. A little virus bobs on the ground; a mushroom slides in and bonks it, and it
    // flickers big-small-big into a giant virus. Then it hops into a cell, and the cell swells up huge with an
    // owl's eye inclusion in its nucleus (cytomegaly). Loops.
    art: function (host, { still }) {
      const W = 128, H = 56;
      host.innerHTML = `<canvas width="${W}" height="${H}" role="img" aria-label="Animation: a mushroom power-up makes a little virus grow big, then the virus hops into a cell, which swells up huge with an owl's eye in its nucleus"></canvas>
        <p class="art-caption">Cytomegalo means big cell: infected cells swell up with an owl's eye inclusion</p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; g.fillStyle = c; g.fillRect(x, y, 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        sky: "#FBEFF3", hill: "#F3D9E6", ground: "#C79AB9", groundHi: "#E6CCDD", groundDark: "#9B6A8E",
        cap: "#2FB8C4", capDark: "#137A85", capHi: "#8FE3E9", eye: "#1A0915", white: "#FFFFFF",
        mush: "#8E5BD1", mushDark: "#5E3596", dot: "#F6E7B8", stem: "#F6E7B8", stemDark: "#CBB98A",
        cell: "#F6C6D6", cellEdge: "#D88AA6", nuc: "#B57AC8", nucEdge: "#7E4A93", halo: "#FCEFF5", incl: "#4A1A5A",
        spark: "#FFD45A"
      };
      const GY = 47;                                         // top of the ground
      const VIRUS = [
        "..s.s.s..",
        ".sOOOOOs.",
        "sOFFLFFOs",
        ".OFFFFFO.",
        "sOFeFeFOs",
        ".OFFFFFO.",
        "sOFFFFFOs",
        ".sOOOOOs.",
        "..s.s.s.."
      ];
      const MUSH = [
        "...MMM...",
        ".MMDMMMM.",
        "MMDDMMDMM",
        "MMMMMMDDM",
        "KMMMMMMMK",
        "..SSSSS..",
        "..SSSSS..",
        "..TSSST.."
      ];
      function virus(x, y, s) {                              // x, y = bottom-left on the ground; s = pixel size
        const top = y - VIRUS.length * s;
        VIRUS.forEach((r, ry) => [...r].forEach((ch, rx) => {
          const c = { s: C.capHi, O: C.capDark, F: C.cap, L: C.capHi, e: C.eye }[ch];
          if (c) rect(x + rx * s, top + ry * s, s, s, c);
        }));
      }
      function mushroom(x, y) {
        const top = y - MUSH.length;
        MUSH.forEach((r, ry) => [...r].forEach((ch, rx) => {
          const c = { M: C.mush, D: C.dot, K: C.mushDark, S: C.stem, T: C.stemDark }[ch];
          if (c && top + ry < GY) px(x + rx, top + ry, c);   // hidden below the ground while it pops up
        }));
      }
      function disc(cx, cy, r, c) { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) px(cx + x, cy + y, c); }
      function cell(cx, cy, r, owl) {
        disc(cx, cy, r, C.cellEdge); disc(cx, cy, r - 1, C.cell);
        const rn = Math.max(3, Math.round(r * 0.5));
        disc(cx + 1, cy, rn, C.nucEdge); disc(cx + 1, cy, rn - 1, C.nuc);
        if (owl) { disc(cx + 1, cy, Math.round(rn * 0.7), C.halo); disc(cx + 1, cy, Math.max(2, Math.round(rn * 0.42)), C.incl); px(cx, cy - 1, C.nuc); }
      }
      function scene() {
        rect(0, 0, W, H, C.sky);
        for (let x = 0; x < W; x++) { const h = Math.round(5 + 3 * Math.sin(x / 9) + 2 * Math.sin(x / 4.3)); rect(x, GY - h, 1, h, C.hill); }
        rect(0, GY, W, H - GY, C.ground); rect(0, GY, W, 1, C.groundHi);
        for (let x = 0; x < W; x += 8) { rect(x, GY + 4, 7, 1, C.groundDark); rect(x + 4, GY + 7, 1, 2, C.groundDark); }
      }
      function sparkle(x, y, k) {
        const d = 2 + (k % 3);
        px(x, y - d, C.spark); px(x, y + d, C.spark); px(x - d, y, C.spark); px(x + d, y, C.spark); px(x, y, C.white);
      }

      // timeline (~14 fps): bob, mushroom slides in and bonks, flicker-grow, hop into the cell, cell swells, owl's eye, repeat
      const LOOP = 220, VX = 22, CX = 92, CY = 27;
      let f = 0, last = 0;
      function frame(now) {
        if (!cv.isConnected) return;
        if (now - last > 70 || still) {
          last = now;
          const k = still ? 190 : f % LOOP;
          scene();
          const bob = Math.floor(k / 6) % 2;
          // the mushroom pops up from the ground on the right, then slides left until it bonks the virus
          if (k >= 15 && k < 62) {
            const rise = Math.min(8, Math.max(0, k - 15));
            const mx = k < 25 ? 104 : 104 - (k - 25) * 2.0;
            mushroom(Math.round(Math.max(VX + 8, mx)), GY + 8 - rise);
          }
          // the virus: small, then flickering, then big; after that it hops into the cell
          let s = 1;
          if (k >= 62 && k < 84) s = Math.floor((k - 62) / 3) % 2 ? 2 : 1;
          else if (k >= 84) s = 2;
          if (k < 120) virus(VX, GY - (s === 1 ? bob : 0), s);
          else if (k < 138) {                                // the hop: an arc from the ground into the cell
            const p = (k - 120) / 18, x = VX + (CX - 9 - VX) * p, y = GY - 22 * Math.sin(p * Math.PI) - (GY - CY - 9) * p;
            virus(Math.round(x), Math.round(y), 2 - (p > 0.7 ? 1 : 0));
          }
          if (k >= 62 && k < 90) for (let i = 0; i < 3; i++) sparkle(VX + 4 + i * 6, GY - 22 + ((k + i * 4) % 8), k + i);
          // the cell: waits on the right, swells once the virus is inside, then shows the owl's eye
          if (k >= 100) {
            const r = k < 138 ? 9 : Math.min(22, 9 + Math.round((k - 138) * 0.5));
            cell(CX, CY, r, k >= 164);
            if (k >= 164 && k < 200) sparkle(CX + r - 2, CY - r + 2, k);
          }
          f++;
        }
        if (!still) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "Case 009 is **cytomegalovirus (CMV)**, aka HHV-5, and its name is the whole story: infected cells get huge (**cytomegaly**) with **\"owl's eye\" intranuclear inclusions**. I'll be honest, the Mario mushroom was the only way I could picture it.\n\n" +
      "It's an **enveloped dsDNA herpesvirus** that stays **latent in mononuclear cells** for life. It spreads through **saliva, urine, sex, breast milk, transplacentally, and through transplanted organs and blood**. Most infections are silent. In healthy young adults it can cause a **heterophile-negative (Monospot-negative) mono**.\n\n" +
      "The big trouble is in the immunocompromised: **retinitis in AIDS (CD4 under 50**, \"pizza pie\" fundus with hemorrhages and necrosis), plus **esophagitis** (linear ulcers), **colitis** and **pneumonitis**, which is especially dangerous after **transplant**. Congenitally, it's the **most common congenital infection**: **sensorineural hearing loss** (the top non-genetic cause in kids), microcephaly, seizures and **periventricular calcifications** (toxo's are diffuse).\n\n" +
      "Treat with **ganciclovir/valganciclovir**, activated by the viral kinase **UL97**, not thymidine kinase (so acyclovir is a poor choice). If it's resistant, use **foscarnet** or **cidofovir**, neither of which needs activation by a viral kinase. Ganciclovir's classic side effect is **bone marrow suppression**."
    ,
    chart: {
      type: "Enveloped dsDNA herpesvirus (HHV-5); latent in mononuclear cells",
      transmission: "Saliva, urine, sex, breast milk, **transplacental**, **transplants and transfusions**",
      treatment: "**Ganciclovir / valganciclovir** (activated by UL97 kinase). Resistant: **foscarnet** or **cidofovir**",
      association: "**Owl's eye inclusions**. Monospot-negative mono. **Retinitis at CD4 < 50**. Most common congenital infection: hearing loss, **periventricular calcifications**."
    }
  }
});
