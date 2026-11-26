// Micrerdle case 008: Measles virus (al-Razi, the island epidemics and the CDC case chart)
// To edit this case, change the text below. Hints appear in order.
// answer: the organism's id from organisms.js.
// type: one of lab, exposure, biology, presentation, treatment, history, etymology, special (sets the hint's label, icon and colour).
// A hint can also show a picture: image (the file, kept in cases/), alt (describes it for screen readers), credit (shown under it).
MICRERDLE_CASES.push({
  answer: "measles-virus",
  minigame: true,   // shows the "Bonus minigame inside" ad at the top of the case
  hints: [
    { type: "history",
      text: "A Persian physician, al-Razi, called it \"more to be dreaded than smallpox.\"" },
    { type: "history",
      text: "In the 1800s it killed about a fifth of Hawaii, a third of Fiji, and more than half of the Great Andamanese, all people who had never been exposed to it." },
    { type: "special",
      text: "Weekly US cases of this organism, 2022 to 2026.",
      image: "cases/008-measles-chart.png",
      alt: "Bar chart of weekly US cases from January 2022 to November 2026: near zero until late 2024, a spike near 300 a week in late 2025, then a bigger surge to about 370 a week in late 2026.",
      credit: "Source: CDC" },
    { type: "etymology",
      text: "Its other name is one letter away from a different rash-causing virus, which trips up students every year. Its genus name comes from Latin for \"little disease,\" to set it apart from the big one: plague." },
    { type: "presentation",
      text: "The rash starts at the hairline and behind the ears, then spreads down over the trunk and limbs, with the spots running together into blotches. It fades in the same order it came." },
    { type: "presentation",
      text: "Before the rash came a high fever, cough, runny nose and red eyes, plus tiny white spots like grains of salt on the inside of the cheeks." }
  ],
  // The answer card. summary: short paragraphs, blank line between them, **bold** for the testable bits.
  // chart: the same five rows on every case. "Category" is filled in from organisms.js, so only these keys go here.
  reveal: {
    // End minigame: flatten the curve. A pixel copy of the CDC chart: weekly bars march across, and each one grows
    // while the week lasts. Every tap is a vaccine that knocks the current bar down a notch. Keep every bar under the
    // dashed goal line. The bars grow faster each week, so by week 20 it takes dozens of taps a second:
    // impossible on purpose. Losing: "You failed! Measles rates are rising!"
    art: function (host, { still }) {
      const W = 128, H = 64;
      host.innerHTML = `<canvas width="${W}" height="${H}" tabindex="0" role="button" style="cursor:pointer;touch-action:manipulation"
          aria-label="Minigame: tap as fast as you can to keep weekly measles cases under the goal line."></canvas>
        <p class="art-caption" aria-live="polite"></p>
        <p class="art-caption"></p>`;
      const cv = host.querySelector("canvas"), g = cv.getContext("2d");
      const [statusEl, scoreEl] = host.querySelectorAll(".art-caption");
      const scale = Math.max(1, Math.min(4, Math.floor((host.clientWidth || 384) / W)));
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const px = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; g.fillStyle = c; g.fillRect(x, y, 1, 1); };
      const rect = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
      const C = {
        bg: "#FFFFFF", grid: "#E3E3E8", axis: "#2B2B30", bar: "#5B86C5", barHi: "#7FA3D6", barHot: "#D7263D",
        goal: "#2C8455", text: "#2B2B30", shot: "#2C8455", flash: "#FDE2E6"
      };
      // chart area
      const X0 = 14, X1 = 124, Y0 = 6, Y1 = 54;            // plot box; bars stand on Y1
      const UNIT = 1;                                      // 1 px of bar per case "unit"
      const GOAL = 12;                                     // the line to stay under, in units (px)
      const BW = 3, STEP = 4, SLOTS = Math.floor((X1 - X0) / STEP);
      const WEEK = 450;                                    // ms per week
      // cases per second this week. Holding the line takes about 2 taps a second in week 0, 4 by week 5,
      // 8 by week 10, 16 by week 15 and 33 by week 20: still impossible on purpose, just slower to get there.
      const rate = w => 27 + 2 * Math.pow(1.15, w);
      const KNOCK = 1;                                     // units removed per tap
      let state = "idle", bars = [], week = 0, live = 0, t0 = 0, weekStart = 0, failedAt = 0, best = 0, shots = [];
      const say = (a, b) => { if (statusEl.textContent !== a) statusEl.textContent = a; if (scoreEl.textContent !== b) scoreEl.textContent = b; };
      const tally = () => best ? `Best: held it down for ${best} week${best === 1 ? "" : "s"}` : "Every tap is a vaccine";
      say("Tap as fast as you can to keep cases under the line!", tally());

      function start(now) { state = "running"; bars = []; week = 0; live = 0; weekStart = now; shots = []; say("Tap! Tap! Tap!", "Weeks held: 0"); }
      function fail(now) {
        state = "failed"; failedAt = now; best = Math.max(best, week);
        say("You failed! Measles rates are rising!", `You held it down for ${week} week${week === 1 ? "" : "s"} · Best: ${best} · Tap to try again`);
      }
      function tap() {
        const now = performance.now();
        if (state === "idle") { start(now); return; }
        if (state === "failed") { if (now - failedAt > 1500) start(now); return; }
        live = Math.max(0, live - KNOCK);
        shots.push({ x: X0 + Math.min(week, SLOTS - 1) * STEP + 1, t: now });
      }
      cv.addEventListener("pointerdown", e => { e.preventDefault(); tap(); });
      cv.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); tap(); } });

      function chart(now) {
        const shaking = state === "failed" && now - failedAt < 400;
        rect(0, 0, W, H, shaking && Math.floor(now / 60) % 2 ? C.flash : C.bg);
        for (let y = Y1 - 12; y >= Y0; y -= 12) for (let x = X0; x < X1; x += 2) px(x, y, C.grid);
        rect(X0 - 1, Y0, 1, Y1 - Y0 + 1, C.axis); rect(X0 - 1, Y1 + 1, X1 - X0 + 2, 1, C.axis);
        for (let x = X0 + 9; x < X1; x += 20) rect(x, Y1 + 2, 1, 2, C.axis);           // x-axis ticks
        // the goal line, dashed green
        const gy = Y1 - GOAL * UNIT;
        for (let x = X0; x < X1; x += 3) rect(x, gy, 2, 1, C.goal);
        // a tiny check mark by the goal line, a tiny virus up top
        px(4, gy - 1, C.goal); px(5, gy, C.goal); px(6, gy - 1, C.goal); px(7, gy - 2, C.goal); px(8, gy - 3, C.goal);
        // bars: the finished weeks, scrolling left once the chart is full, then this week's growing bar
        const all = state === "idle" ? [] : bars.concat(state === "running" ? [live] : state === "failed" ? [99] : []);
        const off = Math.max(0, all.length - SLOTS);
        all.slice(off).forEach((v, i) => {
          const isLive = off + i === all.length - 1 && state !== "idle";
          let h = Math.min(Y1 - Y0 + 4, Math.round(v * UNIT));
          if (state === "failed" && isLive) h = Math.round((Y1 + 2) * Math.min(1, (now - failedAt) / 300));   // the spike shoots off the chart
          const x = X0 + i * STEP, over = v > GOAL;
          rect(x, Y1 + 1 - h, BW, h, over ? C.barHot : isLive ? C.barHi : C.bar);
        });
        if (state === "idle") {                                                          // the calm before: a few little bars
          [1, 2, 1, 3, 2, 4, 3, 5, 4].forEach((v, i) => rect(X0 + i * STEP, Y1 + 1 - v, BW, v, C.bar));
        }
        // vaccine sparkles where the taps land
        shots = shots.filter(s => now - s.t < 250);
        shots.forEach(s => { const k = (now - s.t) / 250, y = Y1 - Math.round(live) - 3 - k * 6; px(s.x + 1, y, C.shot); px(s.x, y + 1, C.shot); px(s.x + 2, y + 1, C.shot); });
      }

      let last = performance.now();
      function frame(now) {
        if (!cv.isConnected) return;
        if (state === "running") {
          const dt = Math.min(50, now - last);
          live += rate(week) * dt / 1000;
          if (live > GOAL) fail(now);
          else if (now - weekStart >= WEEK) {
            bars.push(live); week++; live = 0; weekStart = now;
            say(week < 12 ? "Tap! Tap! Tap!" : week < 18 ? "Faster!!" : "FASTER!!!", `Weeks held: ${week}`);
          }
        }
        last = now;
        chart(now);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    summary:
      "Case 008 is **measles**. That chart in hint 3 is real CDC data, and it's a scary one: the 2025 spike started with a big outbreak in West Texas, and 2026 has been even worse, mostly in people who weren't vaccinated. And yes, I made the minigame virtually impossible on purpose.\n\n" +
      "It's a **paramyxovirus**: enveloped, **ssRNA negative-sense**, with **one serotype**. It's one of the most contagious infections there is (one case can infect 12 to 18 unprotected people, and it hangs in the air for up to 2 hours), spread **airborne** from about **4 days before to 4 days after the rash**. Don't mix up **rubeola** (measles) with **rubella** (German measles, a different virus).\n\n" +
      "Remember the **3 C's** (**cough, coryza, conjunctivitis**) with a high fever, then **Koplik spots** (white spots on the buccal mucosa), then a **maculopapular rash that starts at the head and spreads down**. Complications: **pneumonia** (the most common cause of death), **encephalitis**, and years later **subacute sclerosing panencephalitis (SSPE)**. It also wipes out existing immune memory, so kids catch other infections more easily afterward.\n\n" +
      "Treatment is **supportive plus vitamin A**. Prevent it with the **MMR vaccine (live attenuated, 2 doses)**. After an exposure, MMR within 72 hours or immune globulin within 6 days can still help."
    ,
    chart: {
      type: "Paramyxovirus; enveloped ssRNA (−); one serotype",
      transmission: "**Airborne**; one of the most contagious infections; contagious about 4 days before to 4 days after the rash",
      treatment: "**Supportive + vitamin A**. Prevent with **MMR** (live attenuated, 2 doses)",
      association: "**3 C's** (cough, coryza, conjunctivitis), **Koplik spots**, head-to-toe rash. Pneumonia, encephalitis, **SSPE** years later."
    }
  }
});
