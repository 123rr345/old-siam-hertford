/* ============================================================
   OLD SIAM — script.js
   Vanilla JS. Two systems, both cheap:

   1) IntersectionObserver  — fires reveal/fade classes once,
      then stops watching the element. No per-frame cost.

   2) A single rAF scroll loop — ONE scroll listener that just
      flags "dirty"; all reading/writing of layout happens inside
      one requestAnimationFrame tick. This is what keeps parallax
      buttery instead of janky.

   Everything heavy is disabled when the user prefers reduced motion.

   ── Tuning cheat-sheet ─────────────────────────────────────
   • Parallax strength : the data-speed="…" attribute on each
     element (HTML). Higher = more drift. Negative = opposite way.
   • Mobile damping    : MOBILE_DAMP below.
   • Reveal timing     : threshold/rootMargin in `revealObserver`.
   • Count-up speed    : COUNT_MS below.
   ============================================================ */

(function () {
  "use strict";

  /* Respect the OS "reduce motion" setting. When true we skip all
     transform-based parallax and let CSS handle simple fades. */
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* On small screens, scale parallax down so it never feels seasick
     or pushes content off-layout. 1 = full strength, 0 = none. */
  const MOBILE_DAMP = 0.45;
  const isSmall = () => window.innerWidth < 760;

  /* ----------------------------------------------------------
     1. REVEAL — staggered fade/slide for [data-reveal] and the
        scale-in of dish images (.dish__media). One observer, both.
     ---------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);          // reveal once, then forget it
      }
    },
    {
      threshold: 0.18,                          // ~18% in view before firing
      rootMargin: "0px 0px -8% 0px",            // trigger a touch before centre
    }
  );

  document
    .querySelectorAll("[data-reveal], .dish__media")
    .forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     2. COUNT-UP — animate the 4.6 rating and 636 review count
        when the reviews block scrolls into view.
     ---------------------------------------------------------- */
  const COUNT_MS = 1400;

  function countUp(el) {
    const target = parseFloat(el.dataset.countTo);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / COUNT_MS, 1);
      // easeOutCubic for a confident settle
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }

  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.querySelectorAll(".count").forEach(countUp);
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.5 }
  );
  const reviewsEl = document.querySelector(".reviews");
  if (reviewsEl) countObserver.observe(reviewsEl);

  /* ----------------------------------------------------------
     3. SINGLE rAF SCROLL LOOP
        Drives: scroll-progress bar · nav backdrop · hero
        scale/fade · vertical parallax (data-parallax) ·
        horizontal gallery drift (data-parallax-x).
     ---------------------------------------------------------- */

  // Cache the nodes we touch every frame.
  const progressBar = document.getElementById("scrollProgress");
  const nav = document.getElementById("nav");
  const heroMedia = document.getElementById("heroMedia");
  const heroSection = document.querySelector(".hero");

  // Collections for parallax. We read their speed once.
  const parallaxY = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed) || 0.1,
  }));
  const parallaxX = [...document.querySelectorAll("[data-parallax-x]")].map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed) || 0.05,
  }));

  let ticking = false;        // are we already waiting on a rAF?
  let winH = window.innerHeight;

  function onScroll() {
    // The listener does almost nothing — just schedules one frame.
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    ticking = false;
    const y = window.scrollY || window.pageYOffset;
    const damp = isSmall() ? MOBILE_DAMP : 1;

    /* ── scroll-progress bar ───────────────────────────────── */
    const docH = document.documentElement.scrollHeight - winH;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = pct + "%";

    /* ── nav backdrop: solid once we leave the hero ─────────── */
    if (y > winH * 0.6) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");

    /* Everything below is transform-based motion — skip entirely
       for reduced-motion users. */
    if (REDUCED) return;

    /* ── HERO: image scales up + the whole hero fades as it leaves.
       progress 0 (top) → 1 (scrolled a full viewport). */
    if (heroMedia && y < winH) {
      const p = Math.min(y / winH, 1);
      heroMedia.style.transform = `scale(${1.04 + p * 0.14}) translateY(${p * 40}px)`;
      heroMedia.style.opacity = String(1 - p * 0.85);
      // gentle upward drift of the headline for depth
      if (heroSection) heroSection.style.setProperty("--hp", p.toFixed(3));
    }

    /* ── VERTICAL PARALLAX (dish images, finale) ──────────────
       Each element drifts relative to its distance from the
       viewport centre, multiplied by its own data-speed. Items
       are only computed while roughly on screen (cheap culling). */
    for (const item of parallaxY) {
      const rect = item.el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > winH + 200) continue;  // off-screen → skip
      const centre = rect.top + rect.height / 2;
      const fromCentre = centre - winH / 2;          // +below / −above centre
      const shift = -fromCentre * item.speed * damp; // move opposite for parallax
      item.el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    }

    /* ── HORIZONTAL PARALLAX (The Room rows) ──────────────────
       Rows are wider than the viewport; we slide them sideways
       based on how far the gallery has travelled through view.
       Opposite data-speed signs make the two rows drift apart. */
    for (const item of parallaxX) {
      const rect = item.el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > winH + 200) continue;
      const progress = (winH - rect.top) / (winH + rect.height); // 0→1 across view
      const overflow = item.el.scrollWidth - window.innerWidth;  // px of slack
      const shift = (progress - 0.5) * overflow * item.speed * 12 * damp;
      item.el.style.transform = `translate3d(${shift.toFixed(1)}px, 0, 0)`;
    }
  }

  /* Passive listeners = browser never waits on us before scrolling. */
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      winH = window.innerHeight;
      onScroll();
    },
    { passive: true }
  );

  // First paint (covers reloads partway down the page).
  update();

  /* ----------------------------------------------------------
     4. Smooth-scroll for in-page anchors.
        CSS `scroll-behavior:smooth` already handles most of this;
        this adds a graceful no-op when reduced-motion is on and
        keeps focus correct for accessibility.
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
    });
  });
})();
