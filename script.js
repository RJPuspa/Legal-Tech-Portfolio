document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------------------
     1. Theme Switcher Logic
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "dark";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";

      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  /* --------------------------------------------------------------------------
     2. Mobile Nav Toggle & ScrollSpy
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const isOpen = navMenu.classList.contains("active");
      navToggle.setAttribute("aria-expanded", isOpen);
      navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        if (navToggle) {
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      });
    });
  }

  // Active Link Highlight
  const sections = document.querySelectorAll("section[id]");
  const handleScrollSpy = () => {
    const scrollY = window.scrollY;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      const navItem = document.querySelector(`.nav-menu a[href*='${sectionId}']`);
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItem?.classList.add("active");
      } else {
        navItem?.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", handleScrollSpy, { passive: true });

  /* --------------------------------------------------------------------------
     3. Dynamic Hover Text for Social Icons
     -------------------------------------------------------------------------- */
  const socialBtns = document.querySelectorAll(".social-btn");

  socialBtns.forEach((btn) => {
    // Extract label from data-tooltip, aria-label, or title
    const tooltipText = btn.getAttribute("data-tooltip") || btn.getAttribute("aria-label") || btn.getAttribute("title") || "Link";

    // Set attribute to trigger CSS tooltip
    btn.setAttribute("data-tooltip", tooltipText);

    // Mouse Enter / Focus
    const showTooltip = () => {
      btn.classList.add("tooltip-active");
    };

    // Mouse Leave / Blur
    const hideTooltip = () => {
      btn.classList.remove("tooltip-active");
    };

    btn.addEventListener("mouseenter", showTooltip);
    btn.addEventListener("mouseleave", hideTooltip);
    btn.addEventListener("focus", showTooltip);
    btn.addEventListener("blur", hideTooltip);
  });

  /* --------------------------------------------------------------------------
     4. Expertise Tabs Logic
     -------------------------------------------------------------------------- */
  const expTabBtns = document.querySelectorAll(".exp-tab-btn");
  const expTabContents = document.querySelectorAll(".exp-tab-content");

  expTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      expTabBtns.forEach((b) => b.classList.remove("active"));
      expTabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(targetTab)?.classList.add("active");
    });
  });

  /* --------------------------------------------------------------------------
     5. Animated Counter Logic (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const metricValues = document.querySelectorAll(".m-val");

  const animateCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    const speed = 30;
    const inc = Math.ceil(target / speed);

    const updateCount = () => {
      const count = +counter.innerText;
      if (count < target) {
        counter.innerText = Math.min(count + inc, target);
        setTimeout(updateCount, 30);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
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
      { threshold: 0.5 },
    );

    metricValues.forEach((counter) => counterObserver.observe(counter));
  }

  /* --------------------------------------------------------------------------
     6. Project Category Filtering
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     7. Parser Playground Engine Logic
     -------------------------------------------------------------------------- */
  const runBtn = document.getElementById("run-parser-btn");
  const textInput = document.getElementById("sample-contract");
  const jsonOutput = document.getElementById("json-output");

  if (runBtn && textInput && jsonOutput) {
    runBtn.addEventListener("click", () => {
      const originalText = runBtn.innerHTML;
      runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
      runBtn.disabled = true;

      setTimeout(() => {
        const rawText = textInput.value;

        const partyAMatch = rawText.match(/Party\s*A:\s*([^\n;]+)/i);
        const partyBMatch = rawText.match(/Party\s*B:\s*([^\n;]+)/i);
        const feeMatch = rawText.match(/(?:Total\s*Fee|Consideration):\s*([^\n;]+)/i);
        const dateMatch = rawText.match(/(?:Date|Execution\s*Date):\s*([^\n;]+)/i);
        const jurisdictionMatch = rawText.match(/Jurisdiction:\s*([^\n;]+)/i);

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
          engine: "JS/Python Legal Parser v1.0",
        };

        jsonOutput.innerHTML = `<code>${JSON.stringify(extractedData, null, 4)}</code>`;
        runBtn.innerHTML = originalText;
        runBtn.disabled = false;
      }, 400);
    });
  }

  /* --------------------------------------------------------------------------
     8. Contact Form Simulation
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById("portfolio-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.style.color = "var(--accent-blue)";
      formStatus.innerText = "Sending message...";

      setTimeout(() => {
        formStatus.style.color = "var(--accent-emerald)";
        formStatus.innerText = "Thank you! Message received.";
        contactForm.reset();
      }, 1000);
    });
  }
});
