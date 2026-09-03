document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. Light / Dark Theme Switcher Logic
     ========================================================================== */
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
    if (theme === "dark") {
      themeIcon.className = "fa-solid fa-sun";
    } else {
      themeIcon.className = "fa-solid fa-moon";
    }
  }

  /* ==========================================================================
     2. Mobile Navigation Toggle & Active Scroll Spy
     ========================================================================== */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      const isOpen = navMenu.classList.contains("active");
      navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // Highlight navigation link on page scroll (ScrollSpy)
  const sections = document.querySelectorAll("section[id]");
  const handleScrollSpy = () => {
    const scrollY = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-menu a[href*='${sectionId}']`)?.classList.add("active");
      } else {
        document.querySelector(`.nav-menu a[href*='${sectionId}']`)?.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", handleScrollSpy);

  /* ==========================================================================
     3. Dynamic Expertise Tab Switcher Logic
     ========================================================================== */
  const expTabBtns = document.querySelectorAll(".exp-tab-btn");
  const expTabContents = document.querySelectorAll(".exp-tab-content");

  expTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      expTabBtns.forEach((b) => b.classList.remove("active"));
      expTabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add("active");
      }
    });
  });

  /* ==========================================================================
     4. Animated Counters via Intersection Observer
     ========================================================================== */
  const metricNumbers = document.querySelectorAll(".metric-number");

  const animateCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    const speed = 40;
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

  if (metricNumbers.length > 0) {
    const observerOptions = {
      threshold: 0.5,
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    metricNumbers.forEach((counter) => counterObserver.observe(counter));
  }

  /* ==========================================================================
     5. Interactive Project Category Filtering
     ========================================================================== */
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
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(10px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     6. Contact Form Submission Handling
     ========================================================================== */
  const contactForm = document.getElementById("portfolio-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (formStatus) {
        formStatus.style.color = "var(--accent-blue)";
        formStatus.innerText = "Sending message...";
      }

      setTimeout(() => {
        if (formStatus) {
          formStatus.style.color = "var(--accent-emerald)";
          formStatus.innerText = "Thank you! Message received.";
        }
        contactForm.reset();
      }, 1200);
    });
  }

  /* ==========================================================================
     7. Live Interactive Legal Parser Playground
     ========================================================================== */
  const runBtn = document.getElementById("run-parser-btn");
  const textInput = document.getElementById("sample-contract");
  const jsonOutput = document.getElementById("json-output");

  if (runBtn && textInput && jsonOutput) {
    runBtn.addEventListener("click", () => {
      const originalText = runBtn.innerText;
      runBtn.innerText = "Processing...";
      runBtn.disabled = true;

      setTimeout(() => {
        const rawText = textInput.value;

        // Enhanced regex patterns matching dynamic inputs
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

        runBtn.innerText = originalText;
        runBtn.disabled = false;
      }, 400);
    });
  }
});
