/*
 * Sangram Keshari Ghose — portfolio behaviour.
 * Vanilla JS, no dependencies. Every block guards its own DOM so this file
 * can be shared safely between the home page and the case-study pages.
 */
(function () {
  "use strict";

  var ROLES = [
    "Data Engineer",
    "Forward Deployed Engineer",
    "Solutions Engineer",
    "Analytics Engineer",
    "Agentic AI Engineer",
    "Data Engineering Consultant",
    "Data Analyst"
  ];

  var TECH = [
    "Python", "SQL", "Pandas", "Machine Learning", "Agentic AI",
    "Google Cloud", "Microsoft Fabric", "RAG", "ETL",
    "Data Engineering", "Prompt Engineering", "APIs"
  ];

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Current year */
  var yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* Tech marquee */
  var mq = $("#mq");
  if (mq) {
    mq.innerHTML = TECH.concat(TECH)
      .map(function (t) { return "<span>" + t + "</span>"; })
      .join("");
  }

  /* Theme — the saved value is applied pre-paint by an inline script in <head> */
  var root = document.documentElement;
  var themeBtn = $("#theme");
  if (themeBtn) {
    var syncTheme = function () {
      var light = root.dataset.theme === "light";
      themeBtn.setAttribute("aria-pressed", light ? "true" : "false");
      themeBtn.setAttribute("title", light ? "Switch to dark theme" : "Switch to light theme");
      themeBtn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    };
    syncTheme();
    themeBtn.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
      syncTheme();
    });
  }

  /* Mobile menu — focus trapped while open, focus returned on close */
  var menuBtn = $("#menu-btn") || $("#menuBtn");
  var panel = $("#mobile-menu") || $("#mobilePanel");

  function focusables() {
    return panel ? $$("#mobile-menu a, #mobilePanel a") : [];
  }

  function openMenu(open) {
    if (!menuBtn || !panel) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.classList.toggle("open", open);
    panel.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) {
      var first = focusables()[0];
      if (first) first.focus();
    } else {
      menuBtn.focus();
    }
  }

  if (menuBtn && panel) {
    menuBtn.addEventListener("click", function () {
      openMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { openMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        openMenu(false);
        return;
      }
      if (e.key !== "Tab" || menuBtn.getAttribute("aria-expanded") !== "true") return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* Role typing effect (home only) — decorative, hidden from assistive tech */
  if (!reduceMotion) {
    var typed = $("#typed");
    if (typed) {
      var i = 0, j = 0, del = false;
      (function loop() {
        var w = ROLES[i];
        typed.textContent = w.slice(0, j);
        if (!del && j < w.length) {
          j += 1;
        } else if (!del && j === w.length) {
          del = true;
          setTimeout(loop, 1800);
          return;
        } else if (del && j > 0) {
          j -= 1;
        } else {
          del = false;
          i = (i + 1) % ROLES.length;
        }
        setTimeout(loop, del ? 36 : 72);
      })();
    }
  }

  /* Scroll reveals */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach(function (n, idx) {
      n.style.transitionDelay = Math.min(idx % 7, 6) * 60 + "ms";
      io.observe(n);
    });
  } else {
    $$(".reveal").forEach(function (n) { n.classList.add("in"); });
  }

  /* Header state, scroll progress, scroll spy, back to top — one rAF-throttled pass */
  var header = $("#header");
  var progress = $("#progress");
  var toTop = $("#to-top");
  var navLinks = $$("#nav a");
  var secs = [
    "home", "highlights", "about", "how", "skills", "experience",
    "projects", "education", "certifications", "contact"
  ]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset || 0;

    if (header) header.classList.toggle("scrolled", y > 40);
    if (toTop) toTop.classList.toggle("show", y > 600);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }

    if (secs.length && navLinks.length) {
      var curId = secs[0].id;
      for (var k = 0; k < secs.length; k += 1) {
        if (secs[k].getBoundingClientRect().top <= window.innerHeight * 0.32) curId = secs[k].id;
      }
      navLinks.forEach(function (a) {
        var href = a.getAttribute("href") || "";
        var hash = href.indexOf("#") >= 0 ? href.slice(href.indexOf("#")) : href;
        var active = hash === "#" + curId;
        a.classList.toggle("active", active);
        if (active) {
          a.setAttribute("aria-current", "true");
        } else {
          a.removeAttribute("aria-current");
        }
      });
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  onScroll();

  /* LinkedIn badge is third-party: hide the tile if it never renders */
  var badgeWrap = document.querySelector(".linkedin-badge-wrap");
  if (badgeWrap) {
    setTimeout(function () {
      if (!badgeWrap.querySelector("iframe")) badgeWrap.remove();
    }, 4000);
  }
})();
