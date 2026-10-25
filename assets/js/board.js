(() => {
  const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@./-:";
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cells = new Map();
  const cellOf = (el) => {
    if (!cells.has(el)) cells.set(el, { el, ch: el.dataset.ch, queue: [], running: false });
    return cells.get(el);
  };

  const paint = (cell, ch) => {
    for (const b of cell.el.querySelectorAll(".half > b")) b.textContent = ch;
    cell.ch = ch;
  };

  const leaf = (half, ch) => {
    const span = document.createElement("span");
    span.className = `half ${half} leaf`;
    span.innerHTML = "<b></b>";
    span.firstChild.textContent = ch;
    return span;
  };

  // One mechanical flip: the old top leaf falls, then the new bottom leaf lands.
  const flip = async (cell, next, ms) => {
    const { el } = cell;
    const fall = leaf("top", cell.ch);
    const land = leaf("bottom", next);
    land.style.transform = "rotateX(90deg)";
    el.querySelector(".half.top > b").textContent = next;
    el.append(fall, land);
    await fall.animate(
      [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }],
      { duration: ms, easing: "cubic-bezier(0.55, 0, 1, 0.45)" }
    ).finished;
    fall.remove();
    await land.animate(
      [{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }],
      { duration: ms, easing: "cubic-bezier(0, 0.55, 0.45, 1)" }
    ).finished;
    land.remove();
    paint(cell, next);
  };

  const run = async (cell, ms) => {
    cell.running = true;
    while (cell.queue.length) {
      const next = cell.queue.shift();
      if (next !== cell.ch) await flip(cell, next, ms);
    }
    cell.running = false;
  };

  // Queue the drum positions leading up to `target`; a newer call replaces an older queue.
  const set = (el, target, { steps = 0, delay = 0, ms = 46 } = {}) => {
    const cell = cellOf(el);
    if (still) return paint(cell, target);
    const at = Math.max(0, DRUM.indexOf(target));
    const seq = [];
    for (let k = steps; k > 0; k--) seq.push(DRUM[(at - k + DRUM.length) % DRUM.length]);
    seq.push(target);
    setTimeout(() => {
      cell.queue = seq;
      if (!cell.running) run(cell, ms);
    }, delay);
  };

  const setText = (group, text, opts = {}) => {
    [...group.querySelectorAll(".flap")].forEach((el, i) =>
      set(el, text[i] ?? " ", { ...opts, delay: (opts.delay ?? 0) + i * (opts.stagger ?? 0) })
    );
  };

  // Load cascade: full on the first visit of a session, brief afterwards.
  const seen = sessionStorage.getItem("board-seen") === "1";
  sessionStorage.setItem("board-seen", "1");
  const span = (lo, hi) => (seen ? 1 + Math.floor(Math.random() * 2) : lo + Math.floor(Math.random() * (hi - lo)));

  if (!still) {
    for (const el of document.querySelectorAll(".flap")) paint(cellOf(el), " ");
    root.classList.remove("flaps-pending");
    document.querySelectorAll(".name-row").forEach((row, r) => {
      row.querySelectorAll(".flap").forEach((el, i) => {
        const target = el.dataset.ch;
        if (target !== " ") set(el, target, { steps: span(5, 12), delay: 150 + r * 140 + i * 45 });
      });
    });
    document.querySelectorAll("[data-row]").forEach((row, r) => {
      row.querySelectorAll(".flap").forEach((el, i) => {
        const target = el.dataset.ch;
        if (target !== " ") set(el, target, { steps: span(2, 6), delay: 520 + r * 160 + i * 16, ms: 38 });
      });
    });
  }

  // Boarding: hover or focus flips the status and lights the lamp.
  for (const row of document.querySelectorAll("[data-row]")) {
    const status = row.querySelector("[data-status]");
    const board = () => {
      row.classList.add("is-boarding");
      setText(status, "BOARDING", { stagger: 22, ms: 55 });
    };
    const leave = () => {
      if (row.matches(":hover") || row === document.activeElement) return;
      row.classList.remove("is-boarding");
      setText(status, "OPEN    ", { stagger: 22, ms: 55 });
    };
    row.addEventListener("pointerenter", board);
    row.addEventListener("focus", board);
    row.addEventListener("pointerleave", leave);
    row.addEventListener("blur", leave);
  }

  // Clock: Vancouver time, flipped on each minute. B.C. is fixed at UTC-7 (PCT) since 2026;
  // the offset is hard-coded because browsers with older time zone data still apply PST in winter.
  const clock = document.querySelector("[data-clock]");
  if (clock) {
    const tick = (first) => {
      const now = new Date();
      const pct = new Date(now.getTime() - 7 * 3600 * 1000);
      const hhmm = `${String(pct.getUTCHours()).padStart(2, "0")}${String(pct.getUTCMinutes()).padStart(2, "0")}`;
      setText(clock, hhmm, { steps: first ? span(3, 8) : 0, delay: first ? 900 : 0, stagger: 60, ms: 60 });
      setTimeout(() => tick(false), 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    };
    tick(true);
  }
})();
