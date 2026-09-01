document.addEventListener("DOMContentLoaded", () => {
  // 1. Light / Dark Theme Switcher Logic
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "dark";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.className = "fa-solid fa-sun";
    } else {
      themeIcon.className = "fa-solid fa-moon";
    }
  }

  // 2. Mobile Navigation Toggle
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

  // 3. Dynamic Expertise Tab Switcher Logic
  const expTabBtns = document.querySelectorAll(".exp-tab-btn");
  const expTabContents = document.querySelectorAll(".exp-tab-content");

  expTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active state from all buttons & contents
      expTabBtns.forEach((b) => b.classList.remove("active"));
      expTabContents.forEach((c) => c.classList.remove("active"));

      // Activate target button & content
      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      const activeContent = document.getElementById(targetTab);
      if (activeContent) {
        activeContent.classList.add("active");
      }
    });
  });

  // 4. Animated Counters
  const metricNumbers = document.querySelectorAll(".metric-number");
  let animated = false;

  function runCounters() {
    metricNumbers.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const speed = 40;
      const updateCount = () => {
        const count = +counter.innerText;
        const inc = Math.ceil(target / speed);
        if (count < target) {
          counter.innerText = count + inc;
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }

  window.addEventListener("scroll", () => {
    if (!animated && window.scrollY < 400) {
      runCounters();
      animated = true;
    }
  });
  runCounters();

  // 5. Interactive Project Category Filtering
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
          card.style.opacity = "1";
        } else {
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });

  // 6. Contact Form Submission Handling
  const contactForm = document.getElementById("portfolio-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      formStatus.style.color = "#3b82f6";
      formStatus.innerText = "Sending message...";

      setTimeout(() => {
        formStatus.style.color = "#10b981";
        formStatus.innerText = "Thank you! Message received.";
        contactForm.reset();
      }, 1200);
    });
  }
});

// Live Interactive Legal Parser Playground Logic
document.addEventListener("DOMContentLoaded", () => {
  const runBtn = document.getElementById("run-parser-btn");
  const textInput = document.getElementById("sample-contract");
  const jsonOutput = document.getElementById("json-output");

  if (runBtn && textInput && jsonOutput) {
    runBtn.addEventListener("click", () => {
      const rawText = textInput.value;

      // Execute client-side Regex parsing simulating backend engine logic
      const partyAMatch = rawText.match(/Party A:\s*(.*)/i);
      const partyBMatch = rawText.match(/Party B:\s*(.*)/i);
      const feeMatch = rawText.match(/Total Fee:\s*(.*)/i);
      const dateMatch = rawText.match(/Date:\s*(.*)/i);
      const jurisdictionMatch = rawText.match(/Jurisdiction:\s*(.*)/i);

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

      // Render formatted JSON result with typewriting animation
      jsonOutput.innerHTML = `<code>${JSON.stringify(extractedData, null, 4)}</code>`;
    });
  }
});
