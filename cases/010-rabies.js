// Micrerdle case 010: Rabies virus (Poe, vampires and a horror novel)
// To edit this case, change the text below. Hints appear in order.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// A hint can also show a picture: image (the file, kept in cases/), alt (describes it for screen readers), credit (shown under it).
MICRERDLE_CASES.push({
  answer: "rabies-virus",
  hints: [
    { type: "history",
      text: "My favorite writer, Edgar Allan Poe, is theorized to have died of this disease after he was found delirious in Baltimore in 1849." },
    { type: "history",
      text: "Vampires supposedly have no reflection. One theory says the myth grew out of this disease, because its victims couldn't stand to see their own reflection." },
    { type: "history",
      text: "Stephen King built one of his horror novels around it." },
    { type: "biology",
      text: "A bite on the foot will kill you later than a bite on the neck, because it takes time to travel to its destination." },
    { type: "presentation",
      text: "Late in the disease, just trying to swallow water, or even seeing it, can throw the throat into painful spasms." },
    { type: "lab",
      text: "At autopsy, neurons in the hippocampus and the cerebellum's Purkinje cells are packed with pink inclusions called Negri bodies." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End animation: Baltimore at night. A man sleeps on a harbor bench, with a big old sugar factory and its red
    // rooftop sign glowing across the water. A bat flutters in, lands on his neck, bites, and flaps away. He sleeps
    // right through it (most US cases come from bat bites too small to notice). Loops.
    art: function (host, { still }) {
      const W = 128, H = 56;
      host.innerHTML = `<canvas width="${W}" height="${H}" role="img" aria-label="Animation: a man asleep on a bench by the Baltimore harbor at night, with a factory and its glowing red sign across the water; a bat flies in, bites his neck and flies off while he keeps sleeping"></canvas>
        <p class="art-caption">A bat bite so small he slept right through it</p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; g.fillStyle = c; g.fillRect(x, y, 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        sky: "#1E1030", star: "#E9D8F2", moon: "#F6EFD2",
        brick: "#5A2E35", brickDark: "#43212A", window: "#F2C66B", stack: "#4A2630",
        sign: "#FF4A4A", signGlow: "#8A2440", signHi: "#FFB0A8",
        water: "#1A2448", waterHi: "#2C3A6A", ref: "#C23A55",
        ground: "#3A2A3A", groundHi: "#4E3A4E",
        bench: "#8A5A3A", benchDark: "#5E3B24",
        coat: "#4A4466", coatHi: "#6E6890", skin: "#F0C8A8", hair: "#1A0E14", shoe: "#140A10", pants: "#2E2A40",
        bat: "#5A3A62", batWing: "#8A6A92", batEye: "#FF4A4A", fang: "#FFFFFF", bite: "#D7263D", zzz: "#C79AB9"
      };
      const GY = 44;                                        // the promenade the bench stands on
      function scene() {
        rect(0, 0, W, H, C.sky);
        [[6, 4], [18, 10], [27, 3], [41, 8], [52, 2], [9, 15], [33, 13], [124, 22]].forEach(([x, y]) => px(x, y, C.star));
        for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) if (x * x + y * y <= 10) px(48 + x, 6 + y, C.moon);
        // the factory across the harbor, with a smokestack and a big glowing rooftop sign
        rect(62, 18, 62, 16, C.brick);
        for (let y = 20; y < 34; y += 3) rect(62, y, 62, 1, C.brickDark);
        for (let x = 66; x < 122; x += 6) for (let y = 22; y < 32; y += 5) rect(x, y, 2, 2, (x * 7 + y) % 5 ? C.window : C.brickDark);
        rect(114, 4, 5, 14, C.stack); rect(113, 4, 7, 1, C.brickDark);
        rect(68, 8, 40, 9, C.signGlow); rect(69, 9, 38, 7, C.sign);
        for (let x = 71; x < 105; x += 4) rect(x, 11, 2, 3, C.signHi);   // glowing sign, lettering too far away to read
        rect(72, 17, 1, 1, C.brickDark); rect(103, 17, 1, 1, C.brickDark);
        // the harbor
        rect(0, 34, W, GY - 34, C.water);
        for (let y = 35; y < GY; y += 2) for (let x = (y * 3) % 7; x < W; x += 9) rect(x, y, 3, 1, C.waterHi);
      }
      function reflections(t) {
        for (let y = 35; y < GY; y++) { const wob = Math.round(Math.sin(t / 5 + y) * 1.5); for (let x = 70; x < 106; x += 5) if ((x + y) % 3) px(x + wob, y, C.ref); }
        for (let y = 36; y < GY; y += 2) px(116 + Math.round(Math.sin(t / 4 + y)), y, C.window);
      }
      function promenade() {
        rect(0, GY, W, H - GY, C.ground);
        for (let x = 0; x < W; x += 8) rect(x, GY, 7, 1, C.groundHi);
        rect(0, GY + 6, W, 1, C.groundHi);
      }
      function bench() {
        rect(16, 40, 60, 2, C.bench); rect(16, 42, 60, 1, C.benchDark);            // seat
        rect(20, 43, 2, 4, C.benchDark); rect(70, 43, 2, 4, C.benchDark);          // legs
      }
      function sleeper(breath) {
        // lying on his back on the bench, head on the left: dark hair, closed eye, a mustache, coat, shoes
        rect(18, 32, 8, 8, C.skin); rect(18, 31, 8, 3, C.hair); rect(17, 32, 2, 6, C.hair);
        rect(22, 35, 2, 1, C.hair);                                                // closed eye
        rect(21, 38, 5, 1, C.hair);                                                // mustache
        rect(26, 36, 3, 4, C.skin);                                                // neck
        rect(29, 33 - breath, 26, 7 + breath, C.coat); rect(29, 33 - breath, 26, 1, C.coatHi);
        rect(36, 36, 12, 1, C.coatHi);                                             // arm folded on the chest
        rect(55, 35, 16, 5, C.pants); rect(71, 33, 3, 7, C.shoe);
      }
      function bat(x, y, flap) {
        x = Math.round(x); y = Math.round(y);
        rect(x - 2, y - 1, 5, 4, C.bat); px(x - 2, y - 2, C.bat); px(x + 2, y - 2, C.bat);   // body and ears
        px(x - 1, y, C.batEye); px(x + 1, y, C.batEye);
        if (flap) { rect(x - 8, y - 4, 6, 2, C.batWing); rect(x + 3, y - 4, 6, 2, C.batWing); rect(x - 3, y - 2, 1, 2, C.batWing); rect(x + 3, y - 2, 1, 2, C.batWing); }
        else { rect(x - 8, y + 2, 6, 2, C.batWing); rect(x + 3, y + 2, 6, 2, C.batWing); rect(x - 3, y + 1, 1, 2, C.batWing); rect(x + 3, y + 1, 1, 2, C.batWing); }
      }
      function zzz(t) {
        const p = (t % 24) / 24, x = 22 + Math.round(p * 6), y = 27 - Math.round(p * 10);
        rect(x, y, 4, 1, C.zzz); px(x + 2, y + 1, C.zzz); px(x + 1, y + 2, C.zzz); rect(x, y + 3, 4, 1, C.zzz);
      }

      // timeline (~12 fps): sleeping, a bat flutters in, lands on his neck and bites, flies off, he sleeps on
      const LOOP = 180, NX = 27, NY = 36;
      let f = 0, last = 0;
      function frame(now) {
        if (!cv.isConnected) return;
        if (now - last > 80 || still) {
          last = now;
          const t = still ? 100 : f % LOOP;
          scene(); reflections(t); promenade(); bench();
          sleeper(Math.floor(t / 10) % 2);
          zzz(t);
          const flap = Math.floor(t / 2) % 2;
          if (t >= 40 && t < 90) {                                   // fluttering in from the upper right
            const p = (t - 40) / 50;
            bat(130 - (130 - NX) * p, 6 + (NY - 3 - 6) * p + Math.sin(p * 9) * 4, flap);
          } else if (t >= 90 && t < 112) {                           // perched on his neck: the bite
            bat(NX, NY - 3 + (t % 4 < 2 ? 0 : 1), 0);
            if (t % 4 < 2) px(NX, NY - 1, C.fang);
          } else if (t >= 112 && t < 150) {                          // and away to the upper left
            const p = (t - 112) / 38;
            bat(NX - (NX + 10) * p, NY - 3 - 34 * p + Math.sin(p * 8) * 3, flap);
          }
          if (t >= 104 && (t < 90 || t >= 112)) { px(26, 37, C.bite); px(28, 37, C.bite); }  // two tiny marks he'll never notice
          f++;
        }
        if (!still) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "\"It's not a monster, it's just a doggy!\" Case 010 is **rabies virus**, and it's about as close to a real monster as microbiology gets: once symptoms start, it's **nearly 100% fatal**.\n\n" +
      "It's a **rhabdovirus**: **bullet-shaped**, enveloped, **ssRNA negative-sense**. It binds the **nicotinic ACh receptor** at the neuromuscular junction, then rides **retrograde (dynein)** up peripheral nerves to the CNS. That's why the **incubation is long and variable** (weeks to months) and **shorter for bites near the head**.\n\n" +
      "Worldwide, **dogs** cause most of the roughly 59,000 deaths a year. In the US, **bats** cause most human cases (often an unnoticed bite), followed by **raccoons, skunks and foxes**. The disease starts with fever and **tingling at the bite site**, then **agitation, hydrophobia (pharyngeal spasms), hypersalivation**, then paralysis, coma and death. Hydrophobia is the vampire link from hint 2: victims couldn't face water, or their own reflection in it. Look for **Negri bodies** (eosinophilic cytoplasmic inclusions) in the **hippocampus and Purkinje cells**.\n\n" +
      "Prevention is everything. **Post-exposure prophylaxis**: wash the wound, give **rabies immune globulin** (passive, infiltrated around the wound) plus the **killed vaccine** (active), at separate sites. Give it for any bite from a high-risk wild animal, or if you **wake up with a bat in the room**."
    ,
    chart: {
      type: "Rhabdovirus; bullet-shaped, enveloped ssRNA (−)",
      transmission: "Animal bites: **dogs** worldwide; **bats** (most US cases), raccoons, skunks, foxes. Retrograde travel up nerves to the CNS",
      treatment: "**Post-exposure prophylaxis**: wound care + **rabies immune globulin** + **killed vaccine**. Nearly 100% fatal once symptomatic",
      association: "**Hydrophobia**, agitation, hypersalivation. **Negri bodies** in hippocampus and Purkinje cells. Longer incubation for bites far from the head."
    }
  }
});
