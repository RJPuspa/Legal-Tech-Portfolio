document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. THEME SWITCHER
     ========================================================================== */

  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const htmlElement = document.documentElement;

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const applyTheme = (theme) => {
    htmlElement.setAttribute("data-theme", theme);

    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    if (themeToggleBtn) {
      const nextTheme = theme === "dark" ? "light" : "dark";

      themeToggleBtn.setAttribute("aria-label", `Switch to ${nextTheme} mode`);

      themeToggleBtn.setAttribute("title", `Switch to ${nextTheme} mode`);
    }
  };

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme") || "dark";

      const newTheme = currentTheme === "dark" ? "light" : "dark";

      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION
     ========================================================================== */

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  const setMobileMenu = (open) => {
    if (!navMenu || !navToggle) return;

    navMenu.classList.toggle("active", open);

    navToggle.setAttribute("aria-expanded", String(open));

    navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");

    navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';

    document.body.classList.toggle("menu-open", open);
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("active");
      setMobileMenu(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMobileMenu(false);
      });
    });

    document.addEventListener("click", (event) => {
      const target = event.target;

      if (navMenu.classList.contains("active") && target instanceof Node && !navMenu.contains(target) && !navToggle.contains(target)) {
        setMobileMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMobileMenu(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        setMobileMenu(false);
      }
    });
  }

  /* ==========================================================================
     3. SCROLL SPY
     ========================================================================== */

  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-menu a[href]");

  let scrollSpyTicking = false;

  const handleScrollSpy = () => {
    if (scrollSpyTicking) return;

    scrollSpyTicking = true;

    window.requestAnimationFrame(() => {
      const scrollPosition = window.scrollY + 160;

      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = section.id;
        }
      });

      navItems.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) return;

        const sectionId = href.substring(1);

        link.classList.toggle("active", sectionId === currentSection);
      });

      scrollSpyTicking = false;
    });
  };

  window.addEventListener("scroll", handleScrollSpy, { passive: true });

  handleScrollSpy();

  /* ==========================================================================
     4. SOCIAL TOOLTIP HANDLING
     ========================================================================== */

  const socialBtns = document.querySelectorAll(".social-btn");

  socialBtns.forEach((btn) => {
    const tooltipText = btn.getAttribute("data-tooltip") || btn.getAttribute("aria-label") || btn.getAttribute("title") || "Link";

    btn.setAttribute("data-tooltip", tooltipText);

    const showTooltip = () => {
      btn.classList.add("tooltip-active");
    };

    const hideTooltip = () => {
      btn.classList.remove("tooltip-active");
    };

    btn.addEventListener("mouseenter", showTooltip);
    btn.addEventListener("mouseleave", hideTooltip);

    btn.addEventListener("focus", showTooltip);
    btn.addEventListener("blur", hideTooltip);
  });

  /* ==========================================================================
     5. EXPERTISE TABS
     ========================================================================== */

  const expTabBtns = document.querySelectorAll(".exp-tab-btn");

  const expTabContents = document.querySelectorAll(".exp-tab-content");

  expTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      if (!targetTab) return;

      expTabBtns.forEach((button) => {
        button.classList.remove("active");
        button.setAttribute("aria-selected", "false");
      });

      expTabContents.forEach((content) => {
        content.classList.remove("active");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const targetContent = document.getElementById(targetTab);

      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     6. ANIMATED METRIC COUNTERS
     ========================================================================== */

  const metricValues = document.querySelectorAll(".m-val");

  const animateCounter = (counter) => {
    const target = Number(counter.getAttribute("data-target"));

    if (!Number.isFinite(target)) return;

    const duration = 1400;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(easedProgress * target);

      counter.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if (metricValues.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.4,
      },
    );

    metricValues.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }

  /* ==========================================================================
     7. PROJECT CATEGORY FILTERING
     ========================================================================== */

  const filterBtns = document.querySelectorAll(".filter-btn");

  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      if (!filter) return;

      filterBtns.forEach((button) => {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      });

      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        const shouldShow = filter === "all" || category === filter;

        card.classList.toggle("is-hidden", !shouldShow);

        card.setAttribute("aria-hidden", String(!shouldShow));
      });
    });
  });

  /* ==========================================================================
     8. LEGAL DOCUMENT PARSER PLAYGROUND
     ========================================================================== */

  const runBtn = document.getElementById("run-parser-btn");

  const textInput = document.getElementById("sample-contract");

  const jsonOutput = document.getElementById("json-output");

  const escapeHtml = (value) => {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  };

  if (runBtn && textInput && jsonOutput) {
    runBtn.addEventListener("click", () => {
      const originalText = runBtn.innerHTML;

      runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Processing...';

      runBtn.disabled = true;

      jsonOutput.setAttribute("aria-live", "polite");

      setTimeout(() => {
        try {
          const rawText = textInput.value.trim();

          if (!rawText) {
            throw new Error("Please enter sample contract text.");
          }

          const partyAMatch = rawText.match(/Party\s*A\s*:\s*([^\n;]+)/i);

          const partyBMatch = rawText.match(/Party\s*B\s*:\s*([^\n;]+)/i);

          const feeMatch = rawText.match(/(?:Total\s*Fee|Consideration)\s*:\s*([^\n;]+)/i);

          const dateMatch = rawText.match(/(?:Date|Execution\s*Date)\s*:\s*([^\n;]+)/i);

          const jurisdictionMatch = rawText.match(/Jurisdiction\s*:\s*([^\n;]+)/i);

          const extractedData = {
            status: "200 OK",
            timestamp: new Date().toISOString(),

            extracted_fields: {
              party_a: partyAMatch ? partyAMatch[1].trim() : "Not Found",

              party_b: partyBMatch ? partyBMatch[1].trim() : "Not Found",

              total_fee: feeMatch ? feeMatch[1].trim() : "Not Found",

              execution_date: dateMatch ? dateMatch[1].trim() : "Not Found",

              jurisdiction: jurisdictionMatch ? jurisdictionMatch[1].trim() : "Not Found",
            },

            engine: "Legal Parser Prototype • JavaScript",
          };

          const formattedJson = JSON.stringify(extractedData, null, 4);

          jsonOutput.innerHTML = `<code>${escapeHtml(formattedJson)}</code>`;
        } catch (error) {
          jsonOutput.innerHTML = `<code>${escapeHtml(
            JSON.stringify(
              {
                status: "400 Bad Request",
                error: error.message,
              },
              null,
              4,
            ),
          )}</code>`;
        } finally {
          runBtn.innerHTML = originalText;
          runBtn.disabled = false;
        }
      }, 400);
    });
  }

  /* ==========================================================================
     9. CONTACT FORM
     ========================================================================== */

  const contactForm = document.getElementById("portfolio-form");

  const formStatus = document.getElementById("form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      formStatus.style.color = "var(--accent-blue)";

      formStatus.textContent = "Preparing your message...";

      const submitButton = contactForm.querySelector('button[type="submit"]');

      if (submitButton) {
        submitButton.disabled = true;
      }

      setTimeout(() => {
        formStatus.style.color = "var(--accent-emerald)";

        formStatus.textContent = "Demo submission received. Connect this form to your email/backend service before using it in production.";

        contactForm.reset();

        if (submitButton) {
          submitButton.disabled = false;
        }
      }, 900);
    });
  }

  /* ==========================================================================
     10. SMOOTH ANCHOR SCROLLING
     ========================================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      history.replaceState(null, "", targetId);
    });
  });

  /* ==========================================================================
     11. REDUCED MOTION ACCESSIBILITY
     ========================================================================== */

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (prefersReducedMotion.matches) {
    document.documentElement.classList.add("reduce-motion");
  }
});
