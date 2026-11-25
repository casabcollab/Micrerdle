// Micrerdle case 007: Salmonella (non-typhoidal) (Arjun and the bowl of pho)
// To edit this case, change the text below. Hints appear in order.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// Any mix of types is fine; a type can repeat.
MICRERDLE_CASES.push({
  answer: "salmonella-non-typhoidal",
  minigame: true,   // shows the "Bonus minigame inside" ad at the top of the case
  hints: [
    { type: "presentation",
      text: "Arjun, a first-year med student, grabs a big bowl at Pho 89. The next day he has fever, cramps and diarrhea, and he spends the weekend near a bathroom." },
    { type: "exposure",
      text: "Since 1975, it's been illegal in the US to sell turtles with shells under 4 inches long, because of this bug." },
    { type: "treatment",
      text: "His doctor skips antibiotics, since they can make him shed the bug for longer. It would be a different story if he had sickle cell disease, where this bug likes to seed bone." },
    { type: "history",
      text: "It's named after a USDA veterinarian, but it was really discovered in 1885 by his young assistant, Theobald Smith, who got no credit in the name." },
    { type: "exposure",
      text: "The likely culprit is the handful of raw bean sprouts he piled on top. Sprouts grow in warm, wet conditions, which is perfect for bacteria hiding on the seeds." },
    { type: "lab",
      text: "His stool grows a gram-negative rod that doesn't ferment lactose and turns the agar black from hydrogen sulfide. Unlike its non-motile cousin, it swims." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End minigame: turtle inspector. Turtles ride a pet-shop conveyor under a stamp. Under the stamp is a 4-inch
    // bracket; tap to BAN any turtle whose shell is shorter than it (the 1975 FDA rule), and let the big ones go.
    // Miss a small one and its Salmonella stowaway waves goodbye. A shift is 12 turtles.
    art: function (host, { still }) {
      const W = 128, H = 64;
      host.innerHTML = `<canvas width="${W}" height="${H}" tabindex="0" role="button" style="cursor:pointer;touch-action:manipulation"
          aria-label="Turtle inspector minigame. Turtles pass under a stamp. Tap to ban any turtle whose shell is shorter than 4 inches."></canvas>
        <p class="art-caption" aria-live="polite"></p>
        <p class="art-caption"></p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const [statusEl, scoreEl] = host.querySelectorAll(".art-caption");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; g.fillStyle = c; g.fillRect(x, y, 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        wall: "#DDF1EA", wallLine: "#C6E5DA", floor: "#E9D8BE", floorDark: "#D6C09F",
        belt: "#3A3A42", beltHi: "#5A5A66", roller: "#8A9099", frame: "#6E6E78",
        crate: "#B98A5A", crateDark: "#8A6239", shop: "#F2D36B", shopDark: "#C9A63E",
        bin: "#D7263D", binDark: "#9E1B2C",
        shell: "#4E9A4A", shellDark: "#2F6B2E", shellHi: "#7CC26F", skin: "#9CCB6B", skinDark: "#6E9E45", eye: "#1A0915",
        stamp: "#7A5233", stampDark: "#5A3A22", ink: "#D7263D", rod: "#8A9099",
        bracket: "#D7263D", guide: "#F2A5B0",
        bug: "#F28CB1", bugDark: "#C2457A", text: "#2E0821", spark: "#FFD45A"
      };
      const BY = 46;                        // top of the belt; turtles' feet stand here
      const ZX = 64;                        // centre of the stamp and the 4-inch bracket
      const INCH = 5;                       // 5 px per inch, so 4 inches = 20 px
      const LIMIT = 4 * INCH, ZONE = 14;    // a turtle is "under the stamp" when its centre is within 14 px
      const SHIFT = 12;
      const SMALL = [10, 12, 13, 15, 16, 17], BIG = [23, 24, 26, 28];   // shell lengths in px (2 to 3.4 in, 4.6 to 5.6 in)
      const MSG = {
        good: "Banned! Under 4 inches",
        oops: "That one was legal (over 4 inches)",
        miss: "A tiny turtle got sold. Salmonella says hi",
        pass: "Big enough. Sold!",
        whiff: "Nothing under the stamp"
      };
      let state = "idle", turtles = [], queue = [], right = 0, judged = 0, speed = 0.03, stampAt = -1e9, nextGap = 30, msgAt = 0;
      const say = (a, b) => { if (statusEl.textContent !== a) statusEl.textContent = a; if (scoreEl.textContent !== b) scoreEl.textContent = b; };
      const tally = () => judged ? `Right ${right} of ${judged}` : "Shells under 4 inches can't be sold";
      say("Tap to start your shift at the pet shop", tally());

      function startShift() {
        const sizes = [];
        for (let i = 0; i < SHIFT; i++) sizes.push(i % 2 ? SMALL[Math.floor(Math.random() * SMALL.length)] : BIG[Math.floor(Math.random() * BIG.length)]);
        for (let i = sizes.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [sizes[i], sizes[j]] = [sizes[j], sizes[i]]; }
        queue = sizes; turtles = []; right = 0; judged = 0; speed = 0.03; state = "running";
        say("Tap to ban the small ones!", tally());
      }
      function judge(t, verdict) {
        t.judged = true; judged++;
        const ok = (verdict === "ban") === (t.L < LIMIT);
        if (ok) right++;
        t.result = verdict === "ban" ? (ok ? "good" : "oops") : (ok ? "pass" : "miss");
        say(MSG[t.result], tally());
      }
      function tap() {
        const now = performance.now();
        if (state !== "running") { startShift(); return; }
        if (now - stampAt < 300) return;                       // the stamp is still coming back up
        stampAt = now;
        const t = turtles.find(t => !t.judged && Math.abs(t.x - ZX) <= ZONE);
        if (t) { t.banned = true; t.bannedAt = now; judge(t, "ban"); }
        else say(MSG.whiff, tally());
      }
      cv.addEventListener("pointerdown", e => { e.preventDefault(); tap(); });
      cv.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); tap(); } });

      const FONT = { 4: ["#.#", "#.#", "###", "..#", "..#"], '"': ["#.#", "#.#", "...", "...", "..."] };
      const write = (s, x, y, c) => { [...s].forEach(ch => { const f = FONT[ch]; f.forEach((r, ry) => [...r].forEach((b, rx) => { if (b === "#") px(x + rx, y + ry, c); })); x += f[0].length + 1; }); };

      function scene(now) {
        rect(0, 0, W, BY + 6, C.wall);
        for (let x = 6; x < W; x += 16) rect(x, 0, 1, BY - 2, C.wallLine);
        rect(0, BY + 6, W, H - BY - 6, C.floor);
        for (let x = 3; x < W; x += 9) px(x, BY + 9 + (x * 5) % 9, C.floorDark);
        // the conveyor
        rect(0, BY, W, 4, C.belt); rect(0, BY, W, 1, C.beltHi);
        const off = still || state !== "running" ? 0 : Math.floor(now * speed) % 6;
        for (let x = -6 + off; x < W; x += 6) px(x, BY + 2, C.beltHi);
        for (let x = 4; x < W; x += 12) { rect(x, BY + 4, 3, 2, C.roller); rect(x + 1, BY + 6, 1, H - BY - 6, C.frame); }
        // the trapdoor bin under the stamp
        rect(ZX - 12, H - 7, 24, 7, C.bin); rect(ZX - 12, H - 7, 24, 1, C.binDark);
        for (let i = 0; i < 4; i++) { px(ZX - 2 + i, H - 5 + i % 4, C.wall); px(ZX + 1 - i, H - 5 + i % 4, C.wall); }   // an X on the bin
        // a crate on the left where turtles come from, the shop counter on the right where they're sold
        rect(0, BY - 12, 8, 12, C.crate); rect(0, BY - 12, 8, 1, C.crateDark); rect(0, BY - 6, 8, 1, C.crateDark);
        rect(W - 8, BY - 14, 8, 14, C.shop); rect(W - 8, BY - 14, 8, 1, C.shopDark);
        for (let i = 0; i < 3; i++) px(W - 6 + i * 2, BY - 10, C.shopDark);
        // the 4-inch bracket with guides down to the belt
        const L = ZX - LIMIT / 2, R = ZX + LIMIT / 2;
        for (let y = 26; y < BY; y += 2) { px(L, y, C.guide); px(R, y, C.guide); }
        rect(L, 23, LIMIT + 1, 1, C.bracket); rect(L, 23, 1, 3, C.bracket); rect(R, 23, 1, 3, C.bracket);
        write('4"', L - 10, 20, C.bracket);
      }
      function bug(x, y, now, happy) {
        const w = Math.floor(now / 140) % 2;
        rect(x, y, 5, 2, C.bug); px(x + 1, y, C.eye); px(x + 3, y, C.eye);
        for (let i = 1; i <= 3; i++) px(x + 4 + i, y + ((i + w) % 2), C.bugDark);        // flagellum
        if (happy) { px(x - 1, y - 1 - w, C.bugDark); px(x - 1, y - 2 - w, C.bugDark); } // waving
      }
      function turtle(t, now) {
        const L = t.L, hS = Math.round(L * 0.42) + 1, top = BY - 2 - hS;
        let yOff = 0;
        if (t.banned) { const k = (now - t.bannedAt - 250) / 1000; if (k > 0) yOff = Math.round(k * k * 400); }   // drops through the trapdoor
        const x0 = Math.round(t.x - L / 2), y = v => v + yOff;
        const step = still ? 0 : Math.floor(t.x / 3) % 2;
        // legs and head
        const lx = [x0 + 2, x0 + L - 4];
        lx.forEach((x, i) => rect(x + ((i + step) % 2), y(BY - 2), 2, 2, C.skinDark));
        const hd = L < LIMIT ? 3 : 4;
        rect(x0 + L - 1, y(BY - 2 - hd), hd, hd, C.skin); px(x0 + L + hd - 2, y(BY - 1 - hd), C.eye);
        px(x0 - 1, y(BY - 3), C.skinDark);                                                    // tail
        // the shell: a dome
        for (let i = 0; i < L; i++) {
          const u = (i - (L - 1) / 2) / (L / 2), h = Math.max(1, Math.round(hS * Math.sqrt(Math.max(0, 1 - u * u))));
          rect(x0 + i, y(BY - 2 - h), 1, h, C.shell);
          px(x0 + i, y(BY - 2 - h), C.shellHi);
          px(x0 + i, y(BY - 3), C.shellDark);
        }
        for (let i = 3; i < L - 2; i += 4) px(x0 + i, y(top + Math.round(hS / 2) + (i % 8 ? 0 : 1)), C.shellDark);
        if (t.banned) {                                                                         // the red stamp mark
          const cx = Math.round(t.x), cy = y(top + Math.round(hS / 2));
          for (let d = -2; d <= 2; d++) { px(cx + d, cy + d, C.ink); px(cx + d, cy - d, C.ink); }
        }
        // a stowaway shows up once the turtle's fate is decided: waving if it got sold small, dizzy if banned
        if (t.result === "miss") bug(Math.round(t.x) - 2, top - 3, now, true);
        if (t.result === "good" && yOff < 30) bug(Math.round(t.x) - 2, y(top - 3), now, false);
      }
      function stamp(now) {
        const k = (now - stampAt) / 300;
        let drop = 0;
        if (k < 1) drop = k < 0.3 ? k / 0.3 : 1 - (k - 0.3) / 0.7;
        const y = 4 + Math.round(drop * 22);                     // bottom of the stamp pad
        rect(ZX - 1, 0, 3, y - 6, C.rod);
        rect(ZX - 4, y - 8, 9, 3, C.stamp); rect(ZX - 4, y - 8, 9, 1, C.stampDark);
        rect(ZX - 6, y - 5, 13, 4, C.stamp); rect(ZX - 6, y - 1, 13, 1, C.ink);
      }

      let last = performance.now();
      function frame(now) {
        if (!cv.isConnected) return;
        const dt = Math.min(50, now - last); last = now;
        if (state === "running") {
          // spawn the next turtle once the last one has moved far enough along
          const prev = turtles[turtles.length - 1];
          if (queue.length && (!prev || prev.x - prev.L / 2 > nextGap)) {
            const L = queue.shift();
            turtles.push({ L, x: -L / 2 - 2, judged: false });
            nextGap = 30 + Math.random() * 18;
            speed = 0.03 + 0.0025 * (SHIFT - queue.length);
          }
          turtles.forEach(t => { if (!t.banned) t.x += speed * dt; });
          turtles.forEach(t => { if (!t.judged && t.x - ZX > ZONE) judge(t, "pass"); });
          turtles = turtles.filter(t => t.banned ? now - t.bannedAt < 1600 : t.x - t.L / 2 < W);
          if (!queue.length && !turtles.length) {
            state = "done";
            say(right === SHIFT ? "Perfect shift! Not one Salmonella slipped by" : `Shift over: ${right} of ${SHIFT} right`, "Tap to work another shift");
          }
        }
        scene(now);
        if (state === "idle") turtle({ L: 14, x: 30, judged: false }, now);
        turtles.forEach(t => turtle(t, now));
        stamp(now);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "Poor Arjun. The broth wasn't the problem, since it comes out boiling. More likely it was the bean sprouts, if he had any on top. Sprouts have been behind a lot of Salmonella and E. coli outbreaks, so I won't judge you if you skip them for a while. Case 007 is **non-typhoidal Salmonella**.\n\n" +
      "And yes, the turtle law is real! In the early 1970s, little pet turtles were giving Salmonella to a huge number of kids, mostly because kids put them in their mouths. The 4-inch cutoff was picked because anything bigger is hard to fit in there.\n\n" +
      "On the slide and the plate: a **Gram-negative rod** that's **motile** (flagella), **doesn't ferment lactose** and **makes H2S** (black colonies). Compare it with **Shigella**, which is non-motile, makes no H2S, only lives in humans and needs a tiny dose. Salmonella needs a **big dose** because stomach acid kills it, so **PPIs and antacids raise the risk**.\n\n" +
      "It has an **animal reservoir** (**poultry, eggs, reptiles**) and also rides in on produce. It **invades the gut mucosa** and survives in macrophages, so you get **fever, cramps and diarrhea**, sometimes bloody. Treat with **supportive care**, since **antibiotics prolong shedding**; save them for severe disease and high-risk patients. Remember it as the classic cause of **osteomyelitis in sickle cell disease**, and don't mix it up with **S. Typhi** (typhoid), which is human-only, gives rose spots and hides in the gallbladder."
    ,
    chart: {
      type: "Gram-negative rod; motile, non-lactose fermenter, H2S producer",
      transmission: "**Poultry, eggs, reptiles** (pet turtles), sprouts and other produce; animal reservoir; high infectious dose (acid-sensitive)",
      treatment: "**Supportive**; antibiotics prolong shedding, so only for severe disease or high-risk patients",
      association: "Fever, cramps, diarrhea. **Osteomyelitis in sickle cell**. Black colonies (H2S); motile, unlike Shigella."
    }
  }
});
