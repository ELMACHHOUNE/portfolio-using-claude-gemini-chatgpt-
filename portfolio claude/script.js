(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------------------------------------------------------
     Theme toggle (dark / light), remembered in localStorage
  --------------------------------------------------------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const icon = $("i", themeBtn);
    // Show the icon of the theme you will switch TO
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    themeBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
  }

  applyTheme(root.getAttribute("data-theme") || "dark");

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      /* storage unavailable */
    }
  });

  /* ---------------------------------------------------------
     Mobile menu
  --------------------------------------------------------- */
  const burger = $("#burger");
  const menu = $("#menu");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    $("i", burger).className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }

  burger.addEventListener("click", () =>
    setMenu(!menu.classList.contains("is-open")),
  );
  $$("a", menu).forEach((a) =>
    a.addEventListener("click", () => setMenu(false)),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------------------------------------------------------
     Scroll progress bar
  --------------------------------------------------------- */
  const progress = $(".progress");
  let ticking = false;

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    progress.style.setProperty("--p", p.toFixed(4));
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    },
    { passive: true },
  );
  updateProgress();

  /* ---------------------------------------------------------
     Highlight the nav link of the section in view
  --------------------------------------------------------- */
  const links = $$(".nav__links a");
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const active = a.getAttribute("href") === `#${entry.target.id}`;
          a.classList.toggle("is-active", active);
          if (active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  sections.forEach((s) => spy.observe(s));

  /* ---------------------------------------------------------
     Hero: code editor typing animation
  --------------------------------------------------------- */
  // Token classes: c comment, k keyword, p property, s string,
  // o punctuation, b boolean, f function, t plain text
  const CODE = [
    [["c", "// developer.js"]],
    [
      ["k", "const"],
      ["t", " developer "],
      ["o", "= {"],
    ],
    [
      ["t", "  "],
      ["p", "name"],
      ["o", ": "],
      ["s", '"Mohamed"'],
      ["o", ","],
    ],
    [
      ["t", "  "],
      ["p", "roles"],
      ["o", ": ["],
      ["s", '"Full Stack Engineer"'],
      ["o", ", "],
      ["s", '"Graphic Designer"'],
      ["o", "],"],
    ],
    [
      ["t", "  "],
      ["p", "stack"],
      ["o", ": ["],
      ["s", '"MERN"'],
      ["o", ", "],
      ["s", '"Next.js"'],
      ["o", ", "],
      ["s", '"NestJS"'],
      ["o", "],"],
    ],
    [
      ["t", "  "],
      ["p", "location"],
      ["o", ": "],
      ["s", '"Morocco"'],
      ["o", ","],
    ],
    [
      ["t", "  "],
      ["p", "teaches"],
      ["o", ": "],
      ["s", '"Web development at OFPPT"'],
      ["o", ","],
    ],
    [
      ["t", "  "],
      ["p", "available"],
      ["o", ": "],
      ["b", "true"],
      ["o", ","],
    ],
    [["o", "};"]],
    [],
    [
      ["t", "developer"],
      ["o", "."],
      ["f", "build"],
      ["o", "("],
      ["s", '"something worth shipping"'],
      ["o", ");"],
    ],
  ];

  async function runEditor() {
    const code = $("#code");
    if (!code) return;

    const caret = document.createElement("span");
    caret.className = "caret";

    if (!reduceMotion) await sleep(500);

    for (const tokens of CODE) {
      const line = document.createElement("div");
      line.className = "line";
      code.appendChild(line);

      for (const [type, text] of tokens) {
        const span = document.createElement("span");
        span.className = `t-${type}`;
        line.appendChild(span);

        if (reduceMotion) {
          span.textContent = text;
          continue;
        }

        for (const ch of text) {
          span.textContent += ch;
          line.appendChild(caret); // keep the caret at the end of the text
          await sleep(16 + Math.random() * 26);
        }
      }

      line.appendChild(caret);
      if (!reduceMotion) await sleep(140);
    }
  }

  /* ---------------------------------------------------------
     Hero: rotating role line
  --------------------------------------------------------- */
  async function runRoles() {
    const out = $("#role");
    if (!out || reduceMotion) return;

    const roles = [
      "Full Stack Engineer",
      "Graphic Designer",
      "MERN & Next.js developer",
      "Web development teacher",
    ];

    await sleep(1800);
    let i = 0;
    while (true) {
      const word = roles[i % roles.length];
      for (let c = 1; c <= word.length; c++) {
        out.textContent = word.slice(0, c);
        await sleep(65);
      }
      await sleep(1700);
      for (let c = word.length - 1; c >= 0; c--) {
        out.textContent = word.slice(0, c);
        await sleep(30);
      }
      await sleep(300);
      i++;
    }
  }

  /* ---------------------------------------------------------
     Project filters
  --------------------------------------------------------- */
  const filters = $$(".filter");
  const cards = $$(".project");

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;

      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });

      cards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        card.hidden = !(f === "all" || tags.includes(f));
      });
    });
  });

  /* ---------------------------------------------------------
     Footer year + console greeting
  --------------------------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  console.log(
    "%c<Mohamed />",
    "font: 700 18px monospace; color:#FCF1D0; background:#010736; padding:6px 10px; border-radius:4px;",
  );
  console.log("Looking under the hood? Say hi: https://github.com/ELMACHHOUNE");

  /* ---------------------------------------------------------
     Start
  --------------------------------------------------------- */
  runEditor();
  runRoles();
})();
