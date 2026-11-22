// Micrerdle case 005: Streptococcus pneumoniae
// To edit this case, change the text below. Hints appear in order.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// Any mix of types is fine; a type can repeat.
MICRERDLE_CASES.push({
  answer: "streptococcus-pneumoniae",
  hints: [
    { type: "history",
      text: "William Osler called the disease this organism causes \"the old man's friend,\" for the quiet death it brought the elderly." },
    { type: "biology",
      text: "This organism and H. flu sometimes fight over nasal colonization real estate. Cultured together, it produces hydrogen peroxide and has no catalase to break it down, killing its more susceptible rival." },
    { type: "special",
      text: "The mnemonic for its four most common diseases is also what you'd grab from a janitor's closet to clean up after them." },
    { type: "biology",
      text: "The spleen is what clears encapsulated bacteria, and this one hides behind a thick polysaccharide capsule. So patients without a working spleen, whether a surgeon took it or sickle cell scarred it away, are warned about this organism above all others." },
    { type: "lab",
      text: "Students memorize one tidy word for this organism's shape. Less kind test writers skip it and make you work: elongated cocci, in pairs, each with a slightly pointed outer edge." },
    { type: "etymology",
      text: "It once went by a blunter name, Diplococcus pneumoniae: the paired cocci of the lung. Pneumon is Greek for lung." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End minigame: a joust. Pneumococcus, the lancet-shaped knight (Gram-positive purple), rides against
    // the H. flu challenger (Gram-negative pink). Tap to charge, then tap again while the marker sweeps the
    // bar: green unhorses H. flu, yellow is a glancing blow, gray (or no tap at all) and you're the one unhorsed.
    art: function (host, { still }) {
      const W = 128, H = 64;
      host.innerHTML = `<canvas width="${W}" height="${H}" tabindex="0" role="button" style="cursor:pointer;touch-action:manipulation"
          aria-label="Jousting minigame. Tap to charge, then tap again when the marker is in the green to knock H. flu off his horse."></canvas>
        <p class="art-caption" aria-live="polite"></p>
        <p class="art-caption"></p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const [statusEl, scoreEl] = host.querySelectorAll(".art-caption");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; g.fillStyle = c; g.fillRect(x, y, 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        sky: "#BFE3F2", skyLow: "#DDF1F7", cloud: "#FFFFFF", cloudShade: "#E6F2F7",
        wall: "#8C6B4F", wallDark: "#6E523C", roof: "#5E4433", white: "#FFFFFF",
        grass: "#6DB24A", grassDark: "#4E9135", lane: "#C9A56B", laneDark: "#B08A52",
        rail: "#A07850", railDark: "#7A5A3A",
        band: "#2E0821", hit: "#2C8455", near: "#D4AC2B", miss: "#8D95A7",
        metal: "#C9CED6", metalDark: "#8A9099", visor: "#2A2A33", eye: "#1A1410",
        wood: "#C9A36B", woodDark: "#9C7A45", tip: "#E6E9EE", flash: "#FFF6C2"
      };
      // Gram stain colours: the Gram-positive knight in crystal violet, the Gram-negative challenger in safranin pink
      const TEAM = {
        pn: { cloth: "#4B1E8C", trim: "#9B7BD6", plume: "#7B52C2", tabard: "#5B2BA6", emblem: "#FFFFFF", coat: "#EDEAE4", coatDark: "#B9B2A6" },
        hf: { cloth: "#C2185B", trim: "#F48FB1", plume: "#F06292", tabard: "#D81B60", emblem: "#C2185B", coat: "#6B4A2E", coatDark: "#4A3220" }
      };

      // Sprites face right; x = 0 is the horse's tail. H coat, h dark coat/mane, E eye, C caparison, c trim.
      const HORSE = [
        "..............hH..",
        ".............hHHH.",
        "............hHHEHH",
        "............hHH..H",
        "...cccccccccchH...",
        "...cCCCCCCCCCcH...",
        ".h.cCCCCCCCCCc....",
        "hh.cCCCCCCCCCc....",
        "...cCcCcCcCcCc...."
      ];
      const LEGS = [
        ["...H.H.....H.H....", "...H.H.....H.H....", "...h.h.....h.h...."],   // standing
        ["..H...H...H...H...", ".H.....H.H.....H..", ".h.....h.h.....h.."]    // mid-gallop
      ];
      // P plume, M armour, m dark armour, V visor, S shield, s/e the shield's emblem (two dots for a diplococcus), T tabard
      const RIDER = [
        "..PPP.....",
        ".PP..MMM..",
        ".....MMMm.",
        ".....MMVV.",
        "......mm..",
        "...SSTTTM.",
        "..SsSTTTMM",
        "..SeSTTT..",
        "...S.TTT..",
        ".....mm..."
      ];
      const rot = rows => {                     // a quarter turn, head first: how an unhorsed knight lands
        const w = rows[0].length, h = rows.length, out = [];
        for (let y = 0; y < w; y++) { let r = ""; for (let x = 0; x < h; x++) r += rows[x][w - 1 - y]; out.push(r); }
        return out;
      };
      const FALLEN = rot(RIDER);
      const sprite = (rows, pal, ox, oy, dir) => rows.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) px(ox + dir * x, oy + y, pal[ch]); }));
      const horsePal = t => ({ H: t.coat, h: t.coatDark, E: C.eye, C: t.cloth, c: t.trim });
      const riderPal = t => ({ P: t.plume, M: C.metal, m: C.metalDark, V: C.visor, S: t.cloth, s: C.white, e: t.emblem, T: t.tabard });

      // Where each knight starts, and where it is when the lances meet (tip on the other knight's chest)
      const K = {
        pn: { t: TEAM.pn, dir: 1, hy: 39, x0: 2, xc: 44, slope: -5 / 18 },
        hf: { t: TEAM.hf, dir: -1, hy: 33, x0: 125, xc: 84, slope: 5 / 18 }
      };
      const CHARGE = 1500, AFTER = 1400, PERIOD = 800;      // ms: the charge, the aftermath, one full sweep of the marker
      const GREEN = 0.08, YELLOW = 0.2;                     // how far from the centre of the bar each zone reaches
      const MSG = {
        win: "Unhorsed! The lancet strikes true",
        tie: "Glancing blow! You ride past each other",
        lose: "Knocked off! H. flu wins the pass",
        slow: "Too slow! H. flu got there first"
      };
      let state = "idle", t0 = 0, tClash = 0, result = null, lockP = null, wins = 0, rides = 0, sparks = [];

      const say = (a, b) => { if (statusEl.textContent !== a) statusEl.textContent = a; if (scoreEl.textContent !== b) scoreEl.textContent = b; };
      const tally = () => rides ? `Wins ${wins} of ${rides}` : "Pneumococcus vs H. flu";
      const marker = now => { const f = ((now - t0) % PERIOD) / PERIOD; return f < 0.5 ? f * 2 : 2 - f * 2; };
      say("Tap to charge!", "Pneumococcus vs H. flu");

      function tap() {
        const now = performance.now();
        if (state === "idle" || state === "done") {
          state = "charge"; t0 = now; result = null; lockP = null; sparks = [];
          say("Tap in the green!", tally());
        } else if (state === "charge" && result === null) {
          lockP = marker(now);
          const d = Math.abs(lockP - 0.5);
          result = d < GREEN ? "win" : d < YELLOW ? "tie" : "lose";
        }
      }
      cv.addEventListener("pointerdown", e => { e.preventDefault(); tap(); });
      cv.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); tap(); } });

      function update(now) {
        if (state === "charge" && now - t0 >= CHARGE) {
          if (result === null) result = "slow";
          state = "after"; tClash = t0 + CHARGE; if (result !== "tie") rides++; if (result === "win") wins++;   // a glancing blow is a re-ride: not scored
          for (let i = 0; i < (result === "tie" ? 18 : 12); i++) {        // lance splinters
            const a = Math.random() * Math.PI * 2, s = 0.02 + Math.random() * 0.05;
            sparks.push({ x: 64, y: 37, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.03, life: 500 + Math.random() * 400, c: Math.random() < 0.5 ? C.wood : C.woodDark });
          }
          say(MSG[result], tally());
        }
        if (state === "after" && now - tClash >= AFTER) { state = "done"; say(MSG[result], tally() + " · Tap to ride again"); }
      }

      function knightX(k, now) {
        if (state === "idle") return k.x0;
        if (state === "charge") return k.x0 + (k.xc - k.x0) * Math.min(1, (now - t0) / CHARGE);
        return k.xc + (k.xc - k.x0) / CHARGE * Math.min(now - tClash, AFTER);   // ride on past each other
      }
      function lance(k, ox, broken) {
        const sx = ox + k.dir * 13, sy = k.hy + 1, len = broken ? 7 : 18;
        for (let i = 0; i < len; i++) {
          const x = sx + k.dir * i, y = sy + Math.round(k.slope * i);
          let c = Math.floor(i / 3) % 2 ? C.white : k.t.cloth;
          if (!broken && i >= len - 2) c = C.tip;
          if (broken && i === len - 1) c = C.woodDark;
          px(x, y, c);
        }
        px(sx + k.dir, sy - 1, C.metal); px(sx + k.dir, sy + 1, C.metal);        // the guard over the hand
      }
      function knight(k, now, mounted, broken) {
        const moving = state !== "idle" && !(state === "done");
        const frame = moving ? Math.floor(now / 90) % 2 : 0, bob = frame ? -1 : 0;
        const ox = knightX(k, now), oy = k.hy + bob;
        sprite(HORSE, horsePal(k.t), ox, oy, k.dir);
        LEGS[frame].forEach((r, y) => [...r].forEach((ch, x) => { const c = horsePal(k.t)[ch]; if (c) px(ox + k.dir * x, k.hy + 9 + y, c); }));
        if (mounted) { sprite(RIDER, riderPal(k.t), ox + k.dir * 3, oy - 5, k.dir); lance(k, ox, broken); }
      }
      function fallen(k, now) {                   // knocked backward off the horse, flips, lands on its back
        const tf = Math.min(now - tClash, AFTER);
        const sx = k.xc + k.dir * 3, sy = k.hy - 5, land = k === K.hf ? 42 : k.hy + 2;   // H. flu tumbles over the barrier into the lane
        const x = sx - k.dir * 0.022 * tf;
        const y = Math.min(land, sy - 0.055 * tf + 0.00012 * tf * tf);
        sprite(tf < 180 ? RIDER : FALLEN, riderPal(k.t), x, y, k.dir);
      }

      // the field: tents in each knight's colours, a grandstand, the lists and the tilt barrier
      let seed = 5;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      const CROWD = ["#F2C14E", "#E07A5F", "#3D405B", "#81B29A", "#F4A261", "#9B7BD6", "#F48FB1", "#2A9D8F"];
      const heads = [];
      for (let row = 0; row < 3; row++) for (let x = 33 + (row % 2); x < 96; x += 3) heads.push({ x, y: 20 + row * 3, c: CROWD[Math.floor(rnd() * CROWD.length)], ph: rnd() * 6 });
      const tufts = []; for (let x = 1; x < W; x += 3) tufts.push([x, 31 + Math.floor(rnd() * 9)]);
      function tent(cx, colour, t) {
        for (let y = 0; y < 8; y++) for (let x = -y; x <= y; x++) px(cx + x, 9 + y, (Math.floor((x + 20) / 2) % 2) ? colour : C.white);
        for (let y = 17; y < 29; y++) for (let x = -7; x <= 7; x++) px(cx + x, y, (Math.floor((x + 20) / 2) % 2) ? colour : C.white);
        rect(cx - 1, 21, 3, 8, C.wallDark);
        rect(cx, 3, 1, 6, C.railDark);
        const flap = still ? 0 : Math.floor(t / 220) % 2;
        rect(cx + 1, 3, 4 - flap, 1, colour); rect(cx + 1, 4, 3 + flap, 1, colour); rect(cx + 1, 5, 2, 1, colour);
      }
      function scene(now) {
        rect(0, 0, W, 14, C.sky); rect(0, 14, W, 16, C.skyLow);
        const cx = still ? 52 : ((now * 0.004) % (W + 30)) - 20;
        rect(cx, 6, 14, 3, C.cloud); rect(cx + 3, 4, 8, 2, C.cloud); rect(cx + 1, 9, 12, 1, C.cloudShade);
        tent(14, TEAM.pn.tabard, now); tent(113, TEAM.hf.tabard, now);
        rect(30, 15, 68, 2, C.roof); rect(31, 17, 66, 13, C.wall); rect(31, 29, 66, 1, C.wallDark);
        const cheer = (state === "after" || state === "done") && result === "win" && now - tClash < 900;
        heads.forEach(h => { const jump = cheer && Math.floor(now / 120 + h.ph) % 2 ? -1 : 0; px(h.x, h.y + jump, h.c); px(h.x, h.y + 1 + jump, h.c); });
        rect(0, 30, W, 25, C.grass);
        tufts.forEach(([x, y]) => px(x, y, C.grassDark));
        rect(0, 41, W, 14, C.lane);
        for (let x = 2; x < W; x += 7) px(x, 46 + (x % 5), C.laneDark);
      }
      function barrier() {
        for (let x = 4; x < W; x += 16) rect(x, 40, 2, 6, C.railDark);
        rect(0, 42, W, 2, C.rail); rect(0, 44, W, 1, C.railDark);
      }
      function bar(now) {
        rect(0, 55, W, 9, C.band);
        const x0 = 24, w = 80;
        rect(x0, 57, w, 4, C.miss);
        rect(x0 + Math.round(w * (0.5 - YELLOW)), 57, Math.round(w * YELLOW * 2), 4, C.near);
        rect(x0 + Math.round(w * (0.5 - GREEN)), 57, Math.round(w * GREEN * 2), 4, C.hit);
        let p = 0;
        if (state === "charge") p = lockP !== null ? lockP : marker(now);
        else if (state !== "idle") p = lockP !== null ? lockP : marker(tClash);
        const mx = x0 + Math.round(p * (w - 1));
        rect(mx + 1, 56, 1, 6, C.band); rect(mx, 56, 1, 6, C.white);
      }

      let last = performance.now();
      function frame(now) {
        if (!cv.isConnected) return;
        const dt = Math.min(50, now - last); last = now;
        update(now);
        scene(now);
        const after = state === "after" || state === "done";
        const pnDown = after && (result === "lose" || result === "slow"), hfDown = after && result === "win";
        knight(K.hf, now, !hfDown, after && result !== "win");
        barrier();
        if (hfDown) fallen(K.hf, now);
        knight(K.pn, now, !pnDown, after && (result === "win" || result === "tie"));
        if (pnDown) fallen(K.pn, now);
        sparks = sparks.filter(s => (s.life -= dt) > 0);
        sparks.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 0.00012 * dt; px(s.x, s.y, s.c); });
        if (after && now - tClash < 130) { for (let i = -3; i <= 3; i++) { px(64 + i, 37, C.flash); px(64, 37 + i, C.flash); } px(62, 35, C.white); px(66, 39, C.white); px(66, 35, C.white); px(62, 39, C.white); }
        bar(now);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "I showed Micrerdle to a friend who isn't in med school, and I asked him if he wanted to see a case about any particular disease. \"Pneumonia,\" he replied. Now, pneumonia isn't a microbe, but with a few more details I was able to narrow it down. He was on IV antibiotics, so I knew his doctors were worried about bacteria. His lungs were \"full,\" which told me consolidation. And he was two years old at the time, in the early 2000s, right as the conjugate vaccine was rolling out, so I couldn't count on him being covered. Just like that, I had taken dozens of possible organisms down to a few, with **Streptococcus pneumoniae** at the top. I had to play Micrerdle to build this Micrerdle. Micrerdleception!\n\n" +
      "The other contenders: **RSV, metapneumovirus and adenovirus**, since kids often get IV antibiotics anyway when a bacterial cause can't be excluded; **Staph aureus**, classically after influenza, with necrotizing pneumonia and empyema; and **group A strep**. **Mycoplasma** is the wrong age, since walking pneumonia belongs to school-age kids and young adults.\n\n" +
      "On the slide: **lancet-shaped Gram-positive diplococci**, **alpha-hemolytic**, **catalase-negative**, **optochin-sensitive** and **bile-soluble**. The last two separate it from viridans strep, which is optochin-resistant and bile-insoluble. Its **polysaccharide capsule** is the virulence factor and gives a positive **quellung reaction**; it also makes **IgA protease** and **pneumolysin**.\n\n" +
      "Remember **MOPS**: it's the most common bacterial cause of **M**eningitis in adults, **O**titis media in children, **P**neumonia (classically lobar, with rusty sputum, often after the flu) and **S**inusitis. Because the capsule is the weapon, **asplenia** and **sickle cell** autosplenectomy (look for **Howell-Jolly bodies**) are the big risk factors.\n\n" +
      "Two vaccines, two mechanisms: **PCV** conjugates the capsule to a protein, making it **T-cell dependent**, which is why it works in infants; **PPSV23** is pure polysaccharide, **T-cell independent**, and weak under age 2. Penicillin resistance comes from **altered penicillin-binding proteins, not beta-lactamase**, which is why suspected pneumococcal meningitis gets **ceftriaxone plus vancomycin**."
    ,
    chart: {
      type: "Gram-positive lancet-shaped diplococcus; alpha-hemolytic, catalase-negative, optochin-sensitive, bile-soluble",
      transmission: "Respiratory droplets; colonizes the nasopharynx of healthy carriers, especially young children",
      treatment: "Amoxicillin for outpatients, ceftriaxone in hospital, **ceftriaxone plus vancomycin** for suspected meningitis. Prevented by **PCV** and **PPSV23**",
      association: "**MOPS**: meningitis, otitis media, pneumonia, sinusitis. **Capsule** is the virulence factor (positive quellung), so **asplenia and sickle cell** are the danger."
    }
  }
});
