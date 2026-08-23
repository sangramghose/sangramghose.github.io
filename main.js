(function () {
  "use strict";

  const ROLES = [
    "Data Engineer",
    "Forward Deployed Engineer",
    "Solutions Engineer",
    "Analytics Engineer",
    "Agentic AI Engineer",
    "Data Engineering Consultant",
    "Data Analyst"
  ];

  const TECH = [
    "Python", "SQL", "Pandas", "Machine Learning", "Agentic AI",
    "Google Cloud", "Microsoft Fabric", "RAG", "ETL",
    "Data Engineering", "Prompt Engineering", "APIs"
  ];

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  const mq = $("#mq");
  if (mq) {
    mq.innerHTML = TECH.concat(TECH).map((t) => "<span>" + t + "</span>").join("");
  }

  /* Theme */
  const root = document.documentElement;
  const themeBtn = $("#theme");
  if (themeBtn) {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") root.dataset.theme = saved;
    themeBtn.setAttribute("aria-pressed", root.dataset.theme === "light" ? "true" : "false");
    themeBtn.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", root.dataset.theme);
      themeBtn.setAttribute("aria-pressed", root.dataset.theme === "light" ? "true" : "false");
    });
  }

  /* Mobile menu */
  const menuBtn = $("#menuBtn");
  const panel = $("#mobilePanel");
  function openMenu(open) {
    if (!menuBtn || !panel) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.classList.toggle("open", open);
    panel.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", function () {
      openMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { openMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") openMenu(false);
    });
  }

  /* Typing effect */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    const el = $("#typed");
    if (el) {
      let i = 0, j = 0, del = false;
      (function loop() {
        const w = ROLES[i];
        el.textContent = w.slice(0, j);
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
  if (!reduceMotion) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (n, i) {
      n.style.transitionDelay = Math.min(i % 7, 6) * 60 + "ms";
      io.observe(n);
    });
  } else {
    $$(".reveal").forEach(function (n) { n.classList.add("in"); });
  }

  /* Header scroll + nav spy */
  const header = $("#header");
  const secs = ["home", "highlights", "about", "how", "skills", "experience", "projects", "education", "certifications", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    let curId = secs[0] && secs[0].id;
    secs.forEach(function (s) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.32) curId = s.id;
    });
    $$("#nav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + curId);
    });
  }, { passive: true });
})();
