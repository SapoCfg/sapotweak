// Tema Halloween stagionale + barra promo SAPOWEEN. Si spegne da solo alle date sotto.
// Prova fuori periodo: aggiungi ?theme=halloween all'indirizzo.
(() => {
  const now = new Date();
  const themeStart = new Date("2026-10-20T00:00:00+02:00");
  const themeEnd = new Date("2026-11-02T00:00:00+01:00");
  const promoEnd = new Date("2026-11-08T00:00:00+01:00");
  const force = new URLSearchParams(location.search).get("theme") === "halloween";
  const themeOn = force || (now >= themeStart && now < themeEnd);
  const promoOn = force || now < promoEnd;
  if (!themeOn && !promoOn) return;

  const copy = {
    it: { lead: "<b>SAPOWEEN</b>: -15% sul primo pagamento con il codice", short: "<b>-15%</b> con il codice", until: "fino al 7 novembre", untilShort: "fino al 7/11", cta: "Scegli il piano →", copied: "Copiato!", close: "Chiudi" },
    en: { lead: "<b>SAPOWEEN</b>: 15% off your first payment with code", short: "<b>15% off</b> with code", until: "until November 7", untilShort: "until Nov 7", cta: "Choose a plan →", copied: "Copied!", close: "Close" },
    es: { lead: "<b>SAPOWEEN</b>: -15% en tu primer pago con el código", short: "<b>-15%</b> con el código", until: "hasta el 7 de noviembre", untilShort: "hasta el 7/11", cta: "Elegir plan →", copied: "¡Copiado!", close: "Cerrar" },
  };
  const lang = () => {
    let saved = "";
    try { saved = localStorage.getItem("sapotweak_site_lang") || ""; } catch { /* storage bloccato */ }
    const value = (saved || document.documentElement.lang || "it").slice(0, 2).toLowerCase();
    return copy[value] ? value : "it";
  };
  const closedKey = "sapotweak_sapoween_bar_closed";
  const isClosed = () => { try { return sessionStorage.getItem(closedKey) === "1"; } catch { return false; } };

  const batSvg = '<svg viewBox="0 0 60 24" aria-hidden="true"><path d="M30 9 L28 4 L27 8 C25 7 23 8 22 11 C19 11 17 8 18 5 C12 2 5 3 0 9 C6 8 10 11 11 15 C15 12 19 13 21 17 C24 14 27 15 30 20 C33 15 36 14 39 17 C41 13 45 12 49 15 C50 11 54 8 60 9 C55 3 48 2 42 5 C43 8 41 11 38 11 C37 8 35 7 33 8 L32 4 Z"/></svg>';
  const ghostSvg = '<svg viewBox="0 0 60 72" aria-hidden="true"><path d="M30 2C15 2 6 13 6 28v38l8-6 8 6 8-6 8 6 8-6 8 6V28C54 13 45 2 30 2z" fill="#f4eeff"/><circle cx="22" cy="30" r="4" fill="#1d1228"/><circle cx="38" cy="30" r="4" fill="#1d1228"/><ellipse cx="30" cy="44" rx="4" ry="5" fill="#1d1228"/></svg>';

  function renderBar(bar) {
    const t = copy[lang()];
    const onCheckout = /checkout\.html$/.test(location.pathname);
    bar.innerHTML =
      `<span>🎃 <span class="sw-long">${t.lead}</span><span class="sw-short">${t.short}</span></span>` +
      `<button type="button" class="sw-code" title="${t.copied}">SAPOWEEN</button>` +
      `<span class="sw-sep">·</span><span class="sw-long">${t.until}</span><span class="sw-short">${t.untilShort}</span>` +
      (onCheckout ? "" : `<a class="sw-cta" href="checkout.html">${t.cta}</a>`) +
      `<button type="button" class="sw-close" aria-label="${t.close}">×</button>`;
    bar.querySelector(".sw-code").addEventListener("click", event => {
      const button = event.currentTarget;
      const done = () => { button.textContent = t.copied; setTimeout(() => { button.textContent = "SAPOWEEN"; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText("SAPOWEEN").then(done, done); else done();
    });
    bar.querySelector(".sw-close").addEventListener("click", () => {
      try { sessionStorage.setItem(closedKey, "1"); } catch { /* storage bloccato */ }
      bar.remove();
    });
  }

  function start() {
    if (promoOn && !isClosed()) {
      const bar = document.createElement("div");
      bar.className = "sw-promo";
      bar.setAttribute("role", "region");
      bar.setAttribute("aria-label", "SAPOWEEN");
      renderBar(bar);
      document.body.prepend(bar);
      // Le pagine cambiano lingua senza ricaricare: aggiorna il testo della barra.
      const refresh = () => { if (bar.isConnected) renderBar(bar); };
      new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
      document.addEventListener("click", event => {
        if (event.target.closest("[data-lang], .lang-btn, .lang-switch button, [data-set-lang]")) setTimeout(refresh, 60);
      });
      document.addEventListener("change", event => { if (event.target.matches("select")) setTimeout(refresh, 60); });
    }

    if (!themeOn) return;
    document.documentElement.classList.add("sw-halloween");

    const sky = document.createElement("div");
    sky.className = "sw-sky";
    sky.setAttribute("aria-hidden", "true");
    sky.innerHTML = '<div class="sw-moon"></div><div class="sw-fog"></div><div class="sw-fog b"></div>';
    document.body.prepend(sky);

    const fx = document.createElement("div");
    fx.className = "sw-fx";
    fx.setAttribute("aria-hidden", "true");
    fx.innerHTML =
      ["b1", "b2", "b3"].map(c => `<div class="sw-bat ${c}"><span class="sw-bob">${batSvg}</span></div>`).join("") +
      ["g1", "g2"].map(c => `<div class="sw-ghost ${c}">${ghostSvg}</div>`).join("");
    document.body.appendChild(fx);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
