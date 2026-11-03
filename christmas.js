// Tema Natale stagionale: neve lenta, ghirlanda di luci, accenti rosso/bianco/verde. Si spegne da solo.
// Prova fuori periodo: aggiungi ?theme=christmas all'indirizzo.
(() => {
  const now = new Date();
  const start = new Date("2026-11-03T00:00:00+01:00");
  const end = new Date("2027-01-07T00:00:00+01:00");
  const force = new URLSearchParams(location.search).get("theme") === "christmas";
  if (!force && (now < start || now >= end)) return;

  function garland(width) {
    const step = 46;
    const count = Math.ceil(width / step) + 1;
    const colors = ["r", "g", "w", "y"];
    let wire = "M0 6";
    let bulbs = "";
    for (let i = 0; i < count; i++) {
      const x = i * step;
      wire += ` Q${x + step / 2} 22 ${x + step} 6`;
      const bx = x + step / 2;
      bulbs += `<rect x="${bx - 1.5}" y="12" width="3" height="4" rx="1" fill="#3b4b40"/>` +
        `<ellipse class="bulb ${colors[i % 4]}" cx="${bx}" cy="20.5" rx="3.6" ry="5"/>`;
    }
    return `<svg viewBox="0 0 ${count * step} 30" preserveAspectRatio="xMinYMin slice" aria-hidden="true"><path class="wire" d="${wire}"/>${bulbs}</svg>`;
  }

  function start_() {
    document.documentElement.classList.add("sw-xmas");

    const sky = document.createElement("div");
    sky.className = "sw-xsky";
    sky.setAttribute("aria-hidden", "true");
    document.body.prepend(sky);

    const lights = document.createElement("div");
    lights.className = "sw-garland";
    lights.setAttribute("aria-hidden", "true");
    lights.innerHTML = garland(Math.max(window.innerWidth, 1920));
    const bar = document.querySelector(".sw-promo");
    if (bar) bar.after(lights); else document.body.prepend(lights);

    const snow = document.createElement("div");
    snow.className = "sw-snow";
    snow.setAttribute("aria-hidden", "true");
    const total = window.innerWidth < 760 ? 22 : 46;
    let html = "";
    for (let i = 0; i < total; i++) {
      const star = i % 9 === 0;
      const size = star ? 0 : (2 + Math.random() * 4).toFixed(1);
      const left = (Math.random() * 100).toFixed(2);
      const dur = (16 + Math.random() * 18).toFixed(1);
      const delay = (-Math.random() * 34).toFixed(1);
      const dx = Math.round(-40 + Math.random() * 80);
      const op = (0.35 + Math.random() * 0.5).toFixed(2);
      const style = `left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;--dx:${dx}px;--o:${op};` +
        (star ? `font-size:${(10 + Math.random() * 8).toFixed(0)}px;` : `width:${size}px;height:${size}px;filter:blur(${size > 4.5 ? 0.6 : 0}px);`);
      html += star ? `<span class="sw-flake star" style="${style}">❄</span>` : `<span class="sw-flake" style="${style}"></span>`;
    }
    snow.innerHTML = html;
    document.body.appendChild(snow);
  }

  // Aspetta halloween.js (stesso evento) cosi la ghirlanda va sotto la barra promo se c'e.
  const run = () => setTimeout(start_, 0);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
