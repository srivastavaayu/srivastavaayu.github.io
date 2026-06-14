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

    // Easter egg: Console message
    (function initConsoleEgg() {
      const styles = {
        title:
          "font-size:24px;font-weight:800;color:#9d5ff5;letter-spacing:-0.02em;",
        mono: "font-size:11px;color:#787890;font-family:monospace;line-height:1.8;",
        accent:
          "font-size:12px;color:#9d5ff5;font-family:monospace;font-weight:700;",
        reset:
          "font-size:12px;color:#f0f0f5;font-family:monospace;line-height:1.8;",
      };

      console.log("%c<As/>", styles.title);
      console.log("%cHey there, curious human. 👋", styles.reset);
      console.log("%cI see you're poking around in the console.", styles.mono);
      console.log(
        "%cI like you already — that's exactly the kind of thing I do too.",
        styles.mono,
      );
      console.log(" ");
      console.log("%c→ Want to work together?", styles.accent);
      console.log("%c  aayu.2312@gmail.com", styles.reset);
      console.log("%c  linkedin.com/in/srivastava-aayush", styles.reset);
      console.log(" ");
      console.log("%cP.S. Tabs > Spaces. I said what I said.", styles.mono);
    })();

    // Easter egg: Konami Code
    (function initKonamiEgg() {
      const SEQUENCE = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
      ];
      let index = 0;

      // Create toast element
      const toast = document.createElement("div");
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--bg-elevated);
    border: 1px solid var(--accent-glow);
    border-radius: var(--radius-xl);
    padding: 20px 28px;
    text-align: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
    max-width: 90vw;
    box-shadow: 0 8px 40px rgba(124,58,237,0.3);
  `;
      toast.innerHTML = `
    <div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--accent-light);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">↑↑↓↓←→←→BA</div>
    <div style="font-size:18px;font-weight:800;color:var(--text-primary);letter-spacing:-0.02em;margin-bottom:6px;">You found it. 🎮</div>
    <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">My most unpopular opinion:<br><span style="color:var(--accent-light);font-family:var(--font-mono);">Tabs &gt; Spaces.</span> I said what I said.</div>
  `;
      document.body.appendChild(toast);

      function showToast() {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateX(-50%) translateY(20px)";
        }, 4000);
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === SEQUENCE[index]) {
          index++;
          if (index === SEQUENCE.length) {
            showToast();
            index = 0;
          }
        } else {
          index = e.key === SEQUENCE[0] ? 1 : 0;
        }
      });
    })();

    // Easter egg: Logo click counter
    (function initLogoEgg() {
      const logo = document.querySelector(".nav-logo");
      if (!logo) return;

      let clicks = 0;
      let timer = null;

      const messages = [
        { emoji: "👀", title: "Psst.", body: "Keep going..." },
        { emoji: "🤔", title: "Hmm.", body: "Something's happening..." },
        { emoji: "⚡", title: "Almost there.", body: "Don't stop now..." },
        {
          emoji: "🎉",
          title: "You did it!",
          body: "You clicked <As/> 5 times.<br>Here's a secret: this site has<br>more easter eggs. Go find them.",
        },
      ];

      // Reuse the same toast style as Konami — create a second toast
      const toast = document.createElement("div");
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: var(--bg-elevated);
    border: 1px solid var(--accent-glow);
    border-radius: var(--radius-xl);
    padding: 20px 28px;
    text-align: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(20px);
    pointer-events: none;
    max-width: 280px;
    box-shadow: 0 8px 40px rgba(124,58,237,0.3);
  `;
      document.body.appendChild(toast);

      function showToast(msg) {
        toast.innerHTML = `
      <div style="font-size:24px;margin-bottom:8px;">${msg.emoji}</div>
      <div style="font-size:16px;font-weight:800;color:var(--text-primary);letter-spacing:-0.02em;margin-bottom:6px;">${msg.title}</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">${msg.body}</div>
    `;
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(20px)";
        }, 2500);
      }

      logo.addEventListener("click", (e) => {
        // Only intercept if not navigating (i.e. already on home)
        const isHome = ["", "index.html"].includes(
          window.location.pathname.split("/").pop(),
        );
        if (!isHome) return;

        e.preventDefault();
        clicks++;

        clearTimeout(timer);
        timer = setTimeout(() => {
          clicks = 0;
        }, 1500);

        if (clicks === 2) showToast(messages[0]);
        if (clicks === 3) showToast(messages[1]);
        if (clicks === 4) showToast(messages[2]);
        if (clicks >= 5) {
          showToast(messages[3]);
          clicks = 0;
          clearTimeout(timer);
        }
      });
    })();

    // Easter egg: Cursor trail on hero avatar
    (function initAvatarTrail() {
      const avatar = document.querySelector(".hero-avatar");
      if (!avatar) return;

      const EMOJIS = ["⚡", "🔥", "✨", "💜", "🚀", "💡", "⭐", "🎯"];
      let active = false;

      avatar.addEventListener("mouseenter", () => {
        active = true;
      });
      avatar.addEventListener("mouseleave", () => {
        active = false;
      });

      avatar.addEventListener("mousemove", (e) => {
        if (!active) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          return;

        const emoji = document.createElement("span");
        emoji.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        emoji.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      font-size: ${12 + Math.random() * 14}px;
      pointer-events: none;
      user-select: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: trail-float 0.8s ease-out forwards;
    `;
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 800);
      });
    })();

    // Scroll progress bar
    (function initScrollProgress() {
      const bar = document.getElementById("scroll-progress");
      if (!bar) return;
      window.addEventListener(
        "scroll",
        () => {
          const scrollTop = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
          bar.style.width = pct + "%";
        },
        { passive: true },
      );
    })();

    // Spotlight / torch effect
    (function initSpotlight() {
      const spotlight = document.getElementById("spotlight");
      if (!spotlight) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let rafId = null;
      let currentX = window.innerWidth / 2;
      let currentY = window.innerHeight / 2;
      let targetX = currentX;
      let targetY = currentY;

      // Smooth lerp so the spotlight lags slightly behind cursor — feels organic
      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function animate() {
        currentX = lerp(currentX, targetX, 0.08);
        currentY = lerp(currentY, targetY, 0.08);
        spotlight.style.setProperty("--mouse-x", currentX + "px");
        spotlight.style.setProperty("--mouse-y", currentY + "px");
        rafId = requestAnimationFrame(animate);
      }

      window.addEventListener(
        "mousemove",
        (e) => {
          targetX = e.clientX;
          targetY = e.clientY;
        },
        { passive: true },
      );

      // Start animation loop
      animate();

      // Pause when tab not visible — saves battery
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(rafId);
        } else {
          animate();
        }
      });
    })();

    // Time-aware greeting
    (function initTimeGreeting() {
      const el = document.getElementById("hero-greeting");
      if (!el) return;

      // Get current hour in IST (UTC+5:30)
      const now = new Date();
      const istOffset = 5.5 * 60; // IST is UTC+5:30 in minutes
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + istOffset * 60000);
      const hour = ist.getHours();

      let greeting;
      if (hour >= 5 && hour < 12) {
        greeting = "Good morning";
      } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
      } else if (hour >= 17 && hour < 21) {
        greeting = "Good evening";
      } else if (hour >= 21 && hour < 24) {
        greeting = "Burning the midnight oil?";
      } else {
        // 0–5 AM
        greeting = "Up late?";
      }

      const isLate = hour < 5 || hour >= 21;

      el.innerHTML = `
    ${greeting} I'm Aayush —
    a Senior Software Engineer at <a href="https://www.trajector.com" target="_blank" rel="noopener noreferrer">Trajector</a>.
    I build full-stack web applications, love open source deeply,
    and am currently exploring the vast realms of artificial intelligence.
    ${isLate ? '<br><span style="font-size:var(--text-sm);color:var(--text-tertiary);font-family:var(--font-mono);">// it\'s late in India too, by the way.</span>' : ""}
  `;
    })();

    // Easter egg: #aayush URL hash greeting
    (function initHashGreeting() {
      if (window.location.hash.toLowerCase() !== "#aayush") return;

      const toast = document.createElement("div");
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: var(--bg-elevated);
    border: 1px solid var(--accent-glow);
    border-radius: var(--radius-xl);
    padding: 20px 32px;
    text-align: center;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
    max-width: 90vw;
    box-shadow: 0 8px 40px rgba(124,58,237,0.3);
    white-space: nowrap;
  `;
      toast.innerHTML = `
    <div style="font-size:11px;font-family:var(--font-mono);font-weight:700;color:var(--accent-light);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">👋 Hey there</div>
    <div style="font-size:18px;font-weight:800;color:var(--text-primary);letter-spacing:-0.02em;margin-bottom:6px;">Welcome to my corner of the internet.</div>
    <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">You clearly know what you're looking for.<br>I like that. Let's <a href="contact.html" style="color:var(--accent-light);border-bottom:1px solid var(--accent-glow);">get in touch</a>.</div>
  `;
      document.body.appendChild(toast);

      // Slight delay so page has painted before toast appears
      setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
      }, 600);

      // Fade out after 5 seconds
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(-20px)";
        setTimeout(() => toast.remove(), 400);
      }, 5000);

      // Clean up hash from URL without triggering a page jump
      history.replaceState(null, "", window.location.pathname);
    })();

    // Visitor local time on contact page
    (function initContactTime() {
      const el = document.getElementById("contact-time");
      if (!el) return;

      function formatTime(date) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      function getIST() {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        return new Date(utc + 5.5 * 60 * 60000);
      }

      function update() {
        const visitorTime = formatTime(new Date());
        const istTime = formatTime(getIST());
        const isSameTime =
          Intl.DateTimeFormat().resolvedOptions().timeZone ===
            "Asia/Calcutta" ||
          Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Kolkata";

        el.innerHTML = `
      I'm most responsive over email and LinkedIn. Feel free to connect on any of these platforms.
      ${
        !isSameTime
          ? `
        <span style="display:block;margin-top:10px;font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-tertiary);">
          <span style="color:var(--accent-light);">⏱</span>
          It's <span style="color:var(--text-secondary);font-weight:600;">${visitorTime}</span> for you
          &nbsp;·&nbsp;
          <span style="color:var(--text-secondary);font-weight:600;">${istTime} IST</span> for me
        </span>
      `
          : `
        <span style="display:block;margin-top:10px;font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-tertiary);">
          <span style="color:var(--accent-light);">⏱</span>
          It's <span style="color:var(--text-secondary);font-weight:600;">${istTime} IST</span> — we're in the same timezone!
        </span>
      `
      }
    `;
      }

      update();
      // Tick every 30 seconds to keep time fresh
      setInterval(update, 30000);
    })();
  });
})();
