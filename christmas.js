// Tema Natale stagionale: neve lenta, ghirlanda di luci, accenti rosso/bianco/verde. Si spegne da solo.
// Prova fuori periodo: aggiungi ?theme=christmas all'indirizzo.
(() => {
  const now = new Date();
  const start = new Date("2026-11-03T00:00:00+01:00");
  const end = new Date("2027-01-07T00:00:00+01:00");
  const promoEnd = new Date("2026-12-26T00:00:00+01:00");
  const force = new URLSearchParams(location.search).get("theme") === "christmas";
  if (!force && (now < start || now >= end)) return;
  const promoOn = now < promoEnd;

  const copy = {
    it: { lead: "<b>TWEAKMAS</b>: -15% sul primo pagamento con il codice", short: "<b>-15%</b> con il codice", until: "valido fino al 25 dicembre alle 23:59", untilShort: "fino al 25/12 ore 23:59", cta: "Scegli il piano →", copied: "Copiato!", close: "Chiudi" },
    en: { lead: "<b>TWEAKMAS</b>: 15% off your first payment with code", short: "<b>15% off</b> with code", until: "valid until December 25, 11:59 PM CET", untilShort: "until Dec 25, 11:59 PM", cta: "Choose a plan →", copied: "Copied!", close: "Close" },
    es: { lead: "<b>TWEAKMAS</b>: -15% en tu primer pago con el código", short: "<b>-15%</b> con el código", until: "válido hasta el 25 de diciembre a las 23:59", untilShort: "hasta el 25/12, 23:59", cta: "Elegir plan →", copied: "¡Copiado!", close: "Cerrar" },
  };
  const lang = () => {
    let saved = "";
    try { saved = localStorage.getItem("sapotweak_site_lang") || ""; } catch { /* storage bloccato */ }
    const value = (saved || document.documentElement.lang || "it").slice(0, 2).toLowerCase();
    return copy[value] ? value : "it";
  };
  const closedKey = "sapotweak_tweakmas_bar_closed";
  const isClosed = () => { try { return sessionStorage.getItem(closedKey) === "1"; } catch { return false; } };

  // Barra promo TWEAKMAS (stile in halloween.css, colori natalizi in christmas.css).
  function renderBar(bar) {
    const t = copy[lang()];
    const onCheckout = /checkout\.html$/.test(location.pathname);
    bar.innerHTML =
      `<span>🎄 <span class="sw-long">${t.lead}</span><span class="sw-short">${t.short}</span></span>` +
      `<button type="button" class="sw-code" title="${t.copied}">TWEAKMAS</button>` +
      `<span class="sw-sep">·</span><span class="sw-long">${t.until}</span><span class="sw-short">${t.untilShort}</span>` +
      (onCheckout ? "" : `<a class="sw-cta" href="checkout.html">${t.cta}</a>`) +
      `<button type="button" class="sw-close" aria-label="${t.close}">×</button>`;
    bar.querySelector(".sw-code").addEventListener("click", event => {
      const button = event.currentTarget;
      const done = () => { button.textContent = t.copied; setTimeout(() => { button.textContent = "TWEAKMAS"; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText("TWEAKMAS").then(done, done); else done();
    });
    bar.querySelector(".sw-close").addEventListener("click", () => {
      try { sessionStorage.setItem(closedKey, "1"); } catch { /* storage bloccato */ }
      bar.remove();
    });
  }

  function promoBar() {
    if (!promoOn || isClosed()) return null;
    const bar = document.createElement("div");
    bar.className = "sw-promo";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "TWEAKMAS");
    renderBar(bar);
    document.body.prepend(bar);
    // Le pagine cambiano lingua senza ricaricare: aggiorna il testo della barra.
    const refresh = () => { if (bar.isConnected) renderBar(bar); };
    new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    document.addEventListener("click", event => {
      if (event.target.closest("[data-lang], .lang-btn, .lang-switch button, [data-set-lang]")) setTimeout(refresh, 60);
    });
    document.addEventListener("change", event => { if (event.target.matches("select")) setTimeout(refresh, 60); });
    return bar;
  }

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
    const bar = promoBar();
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
