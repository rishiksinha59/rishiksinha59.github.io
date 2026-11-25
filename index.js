document.addEventListener("DOMContentLoaded", () => {
  const navMenu = document.getElementById("nav-menu");
  const menuList = document.getElementById("primary-nav-list");
  const menuBtn = document.querySelector("button.menu-btn");
  const scrollUpBtn = document.querySelector(".scroll-up-btn");
  const mobileMedia = window.matchMedia("(max-width: 900px)");
  const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

  let scrollTicking = false;
  const updateScrollState = () => {
    const y = window.scrollY;
    if (navMenu) {
      navMenu.classList.toggle("sticky", y > 20);
    }
    if (scrollUpBtn) {
      scrollUpBtn.classList.toggle("show", y > 500);
    }
    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollState);
        scrollTicking = true;
      }
    },
    { passive: true }
  );
  updateScrollState();

  if (scrollUpBtn) {
    scrollUpBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotionMedia.matches ? "auto" : "smooth",
      });
    });
  }

  const syncMenuAccessibility = (isOpen) => {
    if (!menuList || !menuBtn) return;
    const isMobile = mobileMedia.matches;
    menuList.classList.toggle("active", isOpen && isMobile);
    menuBtn.classList.toggle("active", isOpen && isMobile);
    menuBtn.setAttribute("aria-expanded", String(isOpen && isMobile));
    menuList.inert = isMobile && !isOpen;
  };

  syncMenuAccessibility(false);

  if (menuBtn && menuList) {
    menuBtn.addEventListener("click", () => {
      const nextOpen = !menuList.classList.contains("active");
      syncMenuAccessibility(nextOpen);
    });

    menuList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileMedia.matches) {
          syncMenuAccessibility(false);
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuList.classList.contains("active")) {
        syncMenuAccessibility(false);
        menuBtn.focus();
      }
    });

    mobileMedia.addEventListener("change", () => {
      syncMenuAccessibility(false);
    });
  }

  // Hero card interactive Overview / UI Demo tabs (roving tabindex + arrow keys)
  const briefTabs = Array.from(document.querySelectorAll('.brief-tabs [role="tab"]'));
  const briefPanels = Array.from(document.querySelectorAll(".brief-panel"));
  const activateBriefTab = (tab, moveFocus = false) => {
    const targetId = tab.getAttribute("data-tab-target");
    briefTabs.forEach((btn) => {
      const isSelected = btn === tab;
      btn.setAttribute("aria-selected", String(isSelected));
      btn.tabIndex = isSelected ? 0 : -1;
    });
    briefPanels.forEach((panel) => {
      const isMatch = panel.id === targetId;
      panel.hidden = !isMatch;
      if (isMatch) {
        panel.tabIndex = 0;
      } else {
        panel.removeAttribute("tabindex");
      }
    });
    if (moveFocus) tab.focus();
  };

  briefTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateBriefTab(tab));
    tab.addEventListener("keydown", (e) => {
      let nextIndex = null;
      if (e.key === "ArrowRight") nextIndex = (index + 1) % briefTabs.length;
      else if (e.key === "ArrowLeft") nextIndex = (index - 1 + briefTabs.length) % briefTabs.length;
      else if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = briefTabs.length - 1;
      if (nextIndex !== null) {
        e.preventDefault();
        activateBriefTab(briefTabs[nextIndex], true);
      }
    });
  });

  // Interactive 3-step studio workflow demo inside UI Demo tab
  const demoStages = [
    {
      title: "Component & Motion Handoff",
      copy: "Semantic tokens, responsive grid layouts, GSAP/Framer Motion choreography, and 60 FPS composited transitions.",
      chips: ["Zero layout shift", "Reduced-motion safe", "React / Next.js"],
    },
    {
      title: "Headless CMS & Typed APIs",
      copy: "Typed Next.js routes, Strapi or Headless WordPress schemas, Supabase/Firebase auth, and reliable third-party webhooks.",
      chips: ["Strict TypeScript", "Clean editor UX", "Express / Node.js"],
    },
    {
      title: "Accessibility & CWV Audit",
      copy: "Keyboard tab-order verification, WCAG AA contrast, image/font budgeting, and production Sentry + CI/CD checks.",
      chips: ["WCAG AA verified", "Core Web Vitals", "GitHub Actions"],
    },
  ];
  const demoStepper = document.querySelector(".demo-stepper");
  const demoStepBtns = Array.from(document.querySelectorAll(".demo-step-btn"));
  const demoTitle = document.getElementById("demo-stage-title");
  const demoCopy = document.getElementById("demo-stage-copy");
  const demoChips = document.getElementById("demo-stage-chips");

  if (demoStepper && demoStepBtns.length && demoTitle && demoCopy && demoChips) {
    demoStepBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-demo-step")) || 0;
        const stage = demoStages[idx];
        if (!stage) return;
        demoStepper.style.setProperty("--demo-step", String(idx));
        demoStepBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        demoTitle.textContent = stage.title;
        demoCopy.textContent = stage.copy;
        demoChips.replaceChildren(
          ...stage.chips.map((label) => {
            const span = document.createElement("span");
            span.className = "demo-chip";
            span.textContent = label;
            return span;
          })
        );
      });
    });
  }

  // Interactive project filter bar
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));
  const projectsGrid = document.querySelector(".projects-grid");
  const projectCards = Array.from(document.querySelectorAll(".project-card"));

  if (filterBtns.length && projectsGrid && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter") || "all";
        filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        let visibleCount = 0;
        projectCards.forEach((card) => {
          const cats = (card.getAttribute("data-categories") || "").split(/\s+/);
          const show = filter === "all" || cats.includes(filter);
          card.hidden = !show;
          if (show) visibleCount += 1;
        });
        projectsGrid.setAttribute("data-visible-count", String(visibleCount));
      });
    });
  }

  // Contact form submission with Web3Forms
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const statusDiv = document.getElementById("form-status");

  if (form && submitBtn && statusDiv) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.innerText = "Sending...";
      statusDiv.style.display = "none";
      statusDiv.className = "form-status";

      const formData = new FormData(form);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          submitBtn.disabled = false;
          submitBtn.innerText = "Send Message";
          if (data.success) {
            statusDiv.innerText = "Message sent successfully! Thank you.";
            statusDiv.className = "form-status success";
            form.reset();
            setTimeout(() => {
              statusDiv.style.display = "none";
            }, 5000);
          } else {
            statusDiv.innerText = data.message || "Something went wrong! Please try again.";
            statusDiv.className = "form-status error";
          }
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = "Send Message";
          statusDiv.innerText = "Failed to connect. Please check your network connection.";
          statusDiv.className = "form-status error";
        });
    });
  }
});
