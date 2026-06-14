/* ============================================================
   MAIN.JS — Aayush Srivastava Portfolio
   Vanilla JS. Zero dependencies.
   ============================================================ */

(function () {
  "use strict";

  /* --- Theme Toggle --- */
  const THEME_KEY = "as-theme";
  const html = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
  }

  function initTheme() {
    const stored = getStoredTheme();
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme = stored || (prefersDark ? "dark" : "light");
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = html.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
  }

  /* --- Mobile Nav --- */
  function initMobileNav() {
    const toggle = document.querySelector(".nav-mobile-toggle");
    const menu = document.querySelector(".nav-mobile-menu");
    if (!toggle || !menu) return;

    let isOpen = false;

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "mobile-menu");
    menu.id = "mobile-menu";

    function openMenu() {
      isOpen = true;
      menu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.addEventListener("click", handleOutsideClick);
    }

    function closeMenu() {
      isOpen = false;
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", handleOutsideClick);
    }

    function handleOutsideClick(e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen ? closeMenu() : openMenu();
    });

    // Close on nav link click
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeMenu();
    });
  }

  /* --- Typewriter Effect --- */
  function initTypewriter() {
    const el = document.querySelector("[data-typewriter]");
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const phrases = JSON.parse(el.dataset.typewriter || "[]");
      el.textContent = phrases[0] || "";
      return;
    }

    const phrases = JSON.parse(el.dataset.typewriter || "[]");
    if (!phrases.length) return;

    const cursor = document.querySelector(".typewriter-cursor");
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const TYPING_SPEED = 70;
    const DELETING_SPEED = 40;
    const PAUSE_END = 2000;
    const PAUSE_START = 300;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isPaused) return;

      if (!isDeleting) {
        // Typing
        charIndex++;
        el.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === currentPhrase.length) {
          // Pause at end before deleting
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            tick();
          }, PAUSE_END);
          return;
        }
      } else {
        // Deleting
        charIndex--;
        el.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            tick();
          }, PAUSE_START);
          return;
        }
      }

      tick();
    }

    function tick() {
      const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
      setTimeout(type, speed);
    }

    // Start after a short delay
    setTimeout(tick, 500);
  }

  /* --- Scroll-triggered Fade Animations --- */
  function initScrollAnimations() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll("[data-animate]");
    if (!targets.length) return;

    // Set initial state
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.animateDelay || 0;
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, Number(delay));
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* --- Active Nav Link --- */
  function initActiveNav() {
    const currentPath =
      window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".nav-link, .nav-mobile-link");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const linkFile = href.split("/").pop();
      if (
        linkFile === currentPath ||
        (currentPath === "" && linkFile === "index.html")
      ) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* --- Smooth scroll for anchor links --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const navHeight =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--nav-height",
            ),
          ) || 64;
        const top =
          target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  /* --- Theme toggle button wiring --- */
  function initThemeToggle() {
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", toggleTheme);
    btn.setAttribute("title", "Toggle theme");
    btn.setAttribute("aria-label", "Toggle light/dark theme");
  }

  /* --- Init --- */
  // Theme must run before DOMContentLoaded to avoid flash
  initTheme();

  document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initMobileNav();
    initTypewriter();
    initScrollAnimations();
    initActiveNav();
    initSmoothScroll();
    
    // Scroll-aware nav
    (function initScrollNav() {
      const nav = document.querySelector(".nav");
      if (!nav) return;
      const onScroll = () =>
        nav.classList.toggle("scrolled", window.scrollY > 20);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    })();
  });
})();
