(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ Starfield ============ */
  var canvas = document.getElementById("starfield");
  var ctx = canvas.getContext("2d");
  var stars = [];
  var STAR_DENSITY = 1 / 9000; // stars per px^2

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    var count = Math.floor(window.innerWidth * window.innerHeight * STAR_DENSITY);
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.55 + 0.25,   // base brightness
        amp: Math.random() * 0.35,           // twinkle amplitude
        speed: Math.random() * 1.6 + 0.4,    // twinkle speed
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.018 + 0.004 // slow upward drift
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var time = t / 1000;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = s.base + (reducedMotion ? 0 : Math.sin(time * s.speed + s.phase) * s.amp);
      if (alpha < 0.05) alpha = 0.05;

      if (!reducedMotion) {
        s.y -= s.drift;
        if (s.y < -2) { s.y = window.innerHeight + 2; s.x = Math.random() * window.innerWidth; }
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220, 228, 255, " + alpha.toFixed(3) + ")";
      ctx.fill();
    }
    if (!reducedMotion) requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);

  /* ============ Scroll reveal ============ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ============ Mobile nav ============ */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
