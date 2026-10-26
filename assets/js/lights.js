(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const board = document.querySelector(".board");
  const glint = document.querySelector(".glint .train");
  const spill = document.querySelector(".spill .train");
  if (!board || !glint || !spill) return;

  const rand = (lo, hi) => lo + Math.random() * (hi - lo);

  // The train's light, front to back, in carriage lengths: headlight throw arriving ahead of the
  // train, the headlights, lit carriages, then a red tail lamp. Window light dims rather than
  // cutting to black between windows so the flicker stays low-contrast.
  const profile = (cars) => {
    const stops = [];
    const add = (at, rgb, a) => stops.push([at, `rgb(${rgb} / ${a.toFixed(3)})`]);
    const head = "255 240 220";
    add(0, head, 0);
    add(0.6, head, 0.05);
    add(1.15, head, 0.18);
    add(1.36, head, 0.4);
    add(1.44, head, 0.75);
    add(1.48, head, 0.75);
    add(1.58, head, 0.3);
    add(1.85, head, 0.08);
    add(2.4, head, 0);
    let x = 2.5;
    for (let c = 0; c < cars; c++) {
      const rgb = Math.random() < 0.25 ? "255 232 200" : "222 234 255";
      const a = Math.random() < 0.12 ? rand(0.05, 0.09) : rand(0.2, 0.3);
      add(x + 0.04, rgb, 0);
      for (let w = 0; w < 6; w++) {
        const at = x + 0.12 + w * 0.135;
        add(at, rgb, a * 0.55);
        add(at + 0.04, rgb, a);
        add(at + 0.09, rgb, a);
        add(at + 0.13, rgb, a * 0.55);
      }
      add(x + 0.96, rgb, 0);
      x += 1;
    }
    add(x + 0.12, "255 64 40", 0.2);
    add(x + 0.45, "255 64 40", 0);
    const length = x + 0.5;
    return { length, stops: stops.map(([at, color]) => `${color} ${((at / length) * 100).toFixed(2)}%`).join(", ") };
  };

  const pass = () => {
    const cars = Math.round(rand(5, 9));
    const unit = Math.max(420, board.offsetWidth * 0.85);
    const { length, stops } = profile(cars);
    const width = length * unit;
    const ltr = Math.random() < 0.5;
    const offset = board.getBoundingClientRect().left;
    const from = ltr ? -width : innerWidth;
    const to = ltr ? innerWidth : -width;
    const duration = ((width + innerWidth) / unit) * rand(700, 900);
    const background = `linear-gradient(to ${ltr ? "left" : "right"}, ${stops})`;

    const run = (el, shift) => {
      el.style.width = `${width}px`;
      el.style.backgroundImage = background;
      return el.animate(
        [
          { transform: `translateX(${from - shift}px) skewX(-14deg)` },
          { transform: `translateX(${to - shift}px) skewX(-14deg)` },
        ],
        { duration, easing: "linear" }
      ).finished;
    };
    return Promise.all([run(spill, 0), run(glint, offset)]);
  };

  // A train every 25-50s; none while the tab is hidden.
  const schedule = (ms) =>
    setTimeout(() => {
      if (document.hidden) {
        document.addEventListener("visibilitychange", () => schedule(rand(3000, 8000)), { once: true });
      } else {
        pass().then(() => schedule(rand(25000, 50000)));
      }
    }, ms);
  schedule(rand(6500, 9000));
})();
