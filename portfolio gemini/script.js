document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Year in Footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Mobile Navbar Toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const icon = hamburger.querySelector("i");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  });

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      const icon = hamburger.querySelector("i");
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    });
  });

  // 3. Developer Typewriter Effect
  const words = [
    "Full-Stack Web Apps.",
    "Scalable APIs & Architectures.",
    "Interactive 3D Experiences.",
    "Clean UI/UX & Brand Systems.",
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterEl = document.getElementById("typewriter");

  function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 45 : 95;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1800; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }

  if (typewriterEl) {
    typeEffect();
  }

  // 4. Project Category Filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button state
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || filterValue === category) {
          card.classList.remove("hide");
        } else {
          card.classList.add("hide");
        }
      });
    });
  });

  // 5. Scroll Spy for Active Navbar Links
  const sections = document.querySelectorAll("section[id]");

  function scrollSpy() {
    const scrollY = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute("id");
      const navLink = document.querySelector(
        `.nav-links a[href*="${sectionId}"]`,
      );

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItems.forEach((item) => item.classList.remove("active"));
          navLink.classList.add("active");
        }
      }
    });
  }

  window.addEventListener("scroll", scrollSpy);

  // 6. Intersection Observer for Scroll Reveal Animations
  const revealElements = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((el) => revealObserver.observe(el));
});
