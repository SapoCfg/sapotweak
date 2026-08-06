(() => {
  "use strict";

  const endpoint = "https://license.salvocan05.workers.dev/analytics/event";
  const sources = new Set(["direct", "google", "tiktok", "youtube", "instagram", "discord", "referral", "other"]);
  const params = new URLSearchParams(window.location.search);

  function source() {
    const raw = String(params.get("utm_source") || params.get("src") || "").trim().toLowerCase();
    if (sources.has(raw)) return raw;
    if (raw) return "other";
    if (!document.referrer) return "direct";
    try {
      const host = new URL(document.referrer).hostname.toLowerCase();
      if (host.endsWith("google.com") || host.includes("google.")) return "google";
      if (host.includes("tiktok.com")) return "tiktok";
      if (host.includes("youtube.com") || host === "youtu.be") return "youtube";
      if (host.includes("instagram.com")) return "instagram";
      if (host.includes("discord.com") || host === "discord.gg") return "discord";
      if (host === window.location.hostname) return "direct";
      return "referral";
    } catch {
      return "other";
    }
  }

  function track(event, plan = "none") {
    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, plan, source: source() }),
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  }

  if (document.body.dataset.analyticsPage === "plans") track("plans_viewed");

  document.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (!link) return;
    if (link.matches("a[href^='checkout.html']")) {
      const url = new URL(link.href, window.location.href);
      const plan = ["monthly", "quarterly"].includes(url.searchParams.get("plan"))
        ? url.searchParams.get("plan") : "none";
      track("plans_opened", plan);
      return;
    }
    if (link.id === "monthlyPlan" && link.getAttribute("aria-disabled") === "false") {
      track("checkout_opened", "monthly");
    } else if (link.id === "quarterlyPlan" && link.getAttribute("aria-disabled") === "false") {
      track("checkout_opened", "quarterly");
    }
  }, { capture: true });
})();
