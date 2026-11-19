// Micrerdle case 003: Plasmodium vivax
// To edit this case, change the text below. Hints appear in order; **double asterisks** bold a key fact.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// Any mix of types is fine; a type can repeat.
MICRERDLE_CASES.push({
  answer: "plasmodium-vivax",
  hints: [
    { type: "presentation",
      text: "A patient comes in with fever and shaking chills that come and go. On exam, the tip of an enlarged spleen is easy to feel below the left ribs." },
    { type: "treatment",
      text: "Once the acute illness is treated, the doctor wants to start a second drug to stop it from coming back. First, though, the patient needs a G6PD activity test." },
    { type: "history",
      text: "In 1917, a Viennese psychiatrist infected patients dying of neurosyphilis with this organism on purpose. Its tertian fevers spiked again and again, and the heat killed the Treponema. Julius Wagner-Jauregg won the 1927 Nobel Prize for it." },
    // TODO: add a drawing here later (enlarged RBC with Schüffner dots next to a normal RBC).
    { type: "lab",
      text: "On a Giemsa-stained thick and thin blood smear, the infected red cells are enlarged and pale, peppered with fine red stippling (Schüffner dots). Inside, the parasite sprawls in irregular, amoeboid shapes. It only invades young red cells, so few cells are infected." },
    { type: "biology",
      text: "Dormant forms called hypnozoites can sleep in the liver for months, then wake up and cause a relapse. Its tertian cousin does this too, but this one can only enter red cells through the Duffy antigen, so it's rare in West Africa, where many people are Duffy-negative." },
    { type: "etymology",
      text: "The disease's name is Italian for bad air, blamed on swamp fumes. People were preventing it long before anyone knew a mosquito spread it: quinine from cinchona bark, later taken daily by British troops in India. Its species name is Latin for lively." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End animation: a misty swamp at night. An Anopheles mosquito flies in and lands on a rock in its
    // signature pose, body tilted up at an angle, then flies off. Fog drifts over the water: the "bad air."
    art: function (host, { still }) {
      const W = 128, H = 56;
      host.innerHTML = `<canvas width="${W}" height="${H}" role="img" aria-label="Animation of a mosquito flying over a foggy swamp at night and landing on a rock with its body tilted up"></canvas>
        <p class="art-caption">Mal'aria means bad air, but the real culprit is the Anopheles mosquito</p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        skyTop: "#241D45", skyMid: "#3A2D5E", skyLow: "#5A4276", star: "#E8DDF5", moon: "#F4E9C1", moonShade: "#DCCF9F",
        treeFar: "#2A2440", water: "#1F3A4F", waterDark: "#16293A", waterHi: "#3D6A86", moonGlint: "#C9C08F",
        rock: "#4D4A5E", rockHi: "#6B6880", rockDark: "#353244", reed: "#3E5A2E", reedTop: "#7A5A2E",
        fog: "#B8A9C9", fogDim: "#8E7FA5",
        body: "#1A1414", leg: "#4A3A3A", wing: "#CFE3F0", wingDim: "#9FB3C4", eye: "#C0392B"
      };
      const WATER = 39;                                 // waterline row
      const ROCK = { x: 58, w: 16, top: 37 };            // the mosquito lands on its top edge
      const stars = [[8, 5], [20, 11], [33, 4], [47, 8], [61, 3], [74, 10], [88, 6], [117, 9], [123, 3], [52, 14]];
      const reeds = [[6, 12], [9, 9], [12, 14], [110, 11], [113, 15], [116, 8], [121, 12]];

      function scene(t) {
        rect(0, 0, W, 12, C.skyTop); rect(0, 12, W, 12, C.skyMid); rect(0, 24, W, WATER - 24, C.skyLow);
        stars.forEach(([x, y], i) => { if ((Math.floor(t / 7) + i) % 9) px(x, y, C.star); });
        for (let y = -5; y <= 5; y++) for (let x = -5; x <= 5; x++) if (x * x + y * y <= 27) px(100 + x, 12 + y, (x + y > 3) ? C.moonShade : C.moon);
        // a ragged line of far-off trees on the horizon
        for (let x = 0; x < W; x++) { const h = 3 + Math.round(Math.abs(Math.sin(x / 4.3)) * 3 + Math.sin(x / 1.7)); rect(x, WATER - h, 1, h, C.treeFar); }
        // still water, a little shimmer, and the moon's reflection
        rect(0, WATER, W, H - WATER, C.water);
        for (let y = WATER + 2; y < H; y += 3) {
          const off = Math.floor(t * 0.2 + y) % 11;
          for (let x = off; x < W; x += 11) rect(x, y, 3, 1, (y % 2) ? C.waterDark : C.waterHi);
        }
        for (let y = WATER + 1; y < H - 3; y += 2) { const w = 6 - Math.floor((y - WATER) / 4); if (w > 1) rect(100 - (w >> 1) + ((Math.floor(t / 4) + y) % 3) - 1, y, w, 1, C.moonGlint); }
        // the rock poking out of the water
        for (let x = 0; x < ROCK.w; x++) {
          const h = Math.round(3 + 2 * Math.sin(Math.PI * (x + 0.5) / ROCK.w));
          for (let y = 0; y < h; y++) px(ROCK.x + x, WATER + 1 - y, y === h - 1 ? C.rockHi : (x > ROCK.w - 4 ? C.rockDark : C.rock));
        }
        reeds.forEach(([x, h], i) => { const sway = Math.round(Math.sin(t / 10 + i) * 0.7); rect(x, WATER + 1 - h, 1, h, C.reed); px(x + sway, WATER - h, C.reedTop); px(x + sway, WATER - h - 1, C.reedTop); });
      }
      // two bands of dithered fog drifting in opposite directions: the "bad air"
      function fog(t) {
        for (let y = 26; y < WATER + 2; y++) {
          const band = y < 32 ? 0 : 1, off = Math.floor(band ? t * 0.35 : -t * 0.25);
          for (let x = 0; x < W; x++) {
            const xx = x + off, dens = Math.sin(xx / 9) + Math.sin(xx / 4.1 + y);
            if (dens > 0.9 && (x + y) % 2 === 0) px(x, y, band ? C.fog : C.fogDim);
          }
        }
      }

      // the mosquito, facing right. Flying: level, wings beating. Resting: the Anopheles pose,
      // proboscis down to the rock and body tilted up behind it at about 45 degrees.
      function flying(x, y, up) {
        [[-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, -1], [0, -1], [-1, 0], [0, 0], [1, 0]].forEach(([dx, dy]) => px(x + dx, y + dy, C.body));
        px(x + 1, y - 1, C.eye); px(x + 2, y + 1, C.body); px(x + 3, y + 2, C.body);          // head and proboscis
        [[-2, 1], [-3, 2], [-1, 1], [0, 2], [0, 1], [1, 2]].forEach(([dx, dy]) => px(x + dx, y + dy, C.leg));
        if (up) [[-1, -2], [-2, -3], [-1, -3], [-3, -4]].forEach(([dx, dy]) => px(x + dx, y + dy, C.wing));
        else [[-1, -2], [-2, -2], [-3, -2], [-4, -1]].forEach(([dx, dy]) => px(x + dx, y + dy, C.wingDim));
      }
      function resting(x, y, twitch) {                    // (x, y) = the tip of the proboscis on the rock
        [[-1, -1], [-2, -2]].forEach(([dx, dy]) => px(x + dx, y + dy, C.body));               // proboscis
        px(x - 3, y - 3, C.body); px(x - 3, y - 4, C.eye);                                     // head
        [[-4, -4], [-5, -5], [-4, -5], [-6, -6], [-7, -7], [-8, -8], [-9, -9]].forEach(([dx, dy]) => px(x + dx, y + dy, C.body));   // thorax, then the abdomen angled up
        [[-4, -3], [-4, -2], [-4, -1], [-5, -4], [-6, -3], [-7, -2], [-7, -1], [-6, -5], [-8, -4], [-9, -3], [-10, -2], [-10, -1]].forEach(([dx, dy]) => px(x + dx, y + dy, C.leg));
        [[-6, -8], [-7, -9], [-8, -10]].forEach(([dx, dy]) => px(x + dx, y + dy + (twitch ? -1 : 0), C.wing));   // wings folded along the back
      }

      // timeline (frames at ~14 fps): fly in, land, rest, fly off, pause, repeat
      const LAND = { x: ROCK.x + 11, y: ROCK.top };
      const IN = 80, REST = 46, OUT = 46, GAP = 16, LOOP = IN + REST + OUT + GAP;
      let f = 0, last = 0;
      function frame(now) {
        if (!cv.isConnected) return;
        if (now - last > 70 || still) {
          last = now;
          scene(f);
          const k = f % LOOP, flap = Math.floor(f / 1) % 2 === 0;
          if (still) resting(LAND.x, LAND.y, false);
          else if (k < IN) {                              // weaving in from the left, then dropping onto the rock
            const p = k / IN, x = -6 + (LAND.x + 4) * p;
            const settle = Math.max(0, (p - 0.75) / 0.25);
            const y = (20 + Math.sin(k / 5) * 5) * (1 - settle) + (LAND.y - 3) * settle;
            flying(x, y, flap);
          } else if (k < IN + REST) resting(LAND.x, LAND.y, (k - IN) % 18 < 2);
          else if (k < IN + REST + OUT) {                 // off it goes, up and to the right
            const p = (k - IN - REST) / OUT;
            flying(LAND.x - 2 + 70 * p, LAND.y - 3 - 22 * p + Math.sin(k / 4) * 2, flap);
          }
          fog(f);
          f++;
        }
        if (!still) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "Case 003 is **Plasmodium vivax**, the most widespread human malaria parasite, and malaria has a reputation to match. You'll often read that it has killed **nearly half of all humans who ever lived**. That number is probably too high: statisticians who went looking couldn't find where it came from, and one rough estimate puts malaria nearer 5% of all human deaths. Even so, it ranks among the deadliest diseases in history, and it still kills hundreds of thousands of people a year, mostly young children. It even gave us a cocktail. British soldiers and officials in 19th-century India took bitter **quinine** to prevent it, mixed it with soda and sugar into tonic water, and, as the story goes, added gin. Drinks historians argue the gin and tonic came about more casually, but the quinine part is real.\n\n" +
      "It's a **protozoan** carried by the female **Anopheles** mosquito: the bite injects sporozoites that go first to the **liver**, then burst out as merozoites to infect red cells. The sexual stage happens in the mosquito, so the mosquito is the definitive host.\n\n" +
      "Its big trick is the **hypnozoite**, a dormant liver form that can wake up months or years later and cause a **relapse**. Only vivax and ovale make them. Killing them takes **primaquine** (or tafenoquine), and because those drugs cause **hemolysis in G6PD deficiency**, you check G6PD before you give them.\n\n" +
      "On the smear, look for **enlarged, pale red cells** with **Schüffner dots** and sprawling **amoeboid** trophozoites; it only infects young red cells, so parasitemia stays low. Ovale also makes Schüffner dots, but its cells are oval with ragged edges. Vivax needs the **Duffy antigen** to get into red cells, which is why it's rare in West Africa, where Duffy-negative people are common; ovale is the one you meet there.\n\n" +
      "Vivax and ovale cause **tertian fevers**, every 48 hours (malariae is every 72; falciparum is irregular). Expect fever, chills, anemia and **splenomegaly**, with a real risk of **splenic rupture**. It's milder than falciparum, with no cerebral malaria. Treat the blood stage with **chloroquine** where it still works, then add **primaquine** for the liver."
    ,
    chart: {
      type: "Protozoan (blood): Plasmodium, lives in the liver, then red blood cells",
      transmission: "Bite of the female **Anopheles** mosquito; rarely blood transfusion or mother to baby",
      treatment: "**Chloroquine** for the blood stage, then **primaquine** (or tafenoquine) for liver hypnozoites, after a **G6PD** test",
      association: "**Hypnozoites cause relapses**. Fevers every **48 hours** (tertian). Enlarged red cells with **Schüffner dots**. Needs the **Duffy antigen**, so rare in West Africa."
    }
  }
});
