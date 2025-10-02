// JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");

  function removeIntro() {
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.style.display = "none";
    }, 800); // match fadeOut duration
  }

  // Exit when user clicks anywhere
  intro.addEventListener("click", removeIntro);

  // Or when user scrolls
  window.addEventListener("scroll", () => {
    if (intro.style.display !== "none") {
      removeIntro();
    }
  });

  // Auto remove after animation finishes (optional)
  setTimeout(removeIntro, 5000); // total duration: hi pulse + welcome message
});

document.addEventListener("DOMContentLoaded", () => {
  const roles = ["Programmer", "Pixel Artist", "Game Developer", "UI/UX Designer", "YouTuber"];
  const heroRoles = document.getElementById("hero-roles");
  let i = 0; // current role
  let j = 0; // character index
  let deleting = false;
  let speed = 75; // typing speed in ms

  function type() {
    const current = roles[i];
    if (!deleting) {
      heroRoles.textContent = current.slice(0, j + 1);
      j++;
      if (j === current.length) {
        deleting = true;
        setTimeout(type, 1000); // pause at full text
        return;
      }
    } else {
      heroRoles.textContent = current.slice(0, j - 1);
      j--;
      if (j === 0) {
        deleting = false;
        i = (i + 1) % roles.length; // next role
      }
    }
    setTimeout(type, speed);
  }

  type();
});



// (+) Mobile menu + existing hide-on-scroll combined + fade-away on scroll

document.addEventListener("DOMContentLoaded", () => {
  // --- element refs ---
  const navbar = document.getElementById("navbar");      // (existing element)
  const navLinks = document.getElementById("nav-links"); // (existing UL)
  const hamburger = document.getElementById("hamburger"); // (+) new button

  // --- helper: set mobile mode based on width ---
  function updateMobileState() {
    if (window.innerWidth <= 705) {
      navbar.classList.add("is-mobile"); 
      navLinks.classList.remove("open"); 
    } else {
      navbar.classList.remove("is-mobile");
      navLinks.classList.remove("open");
    }
  }

  // run once on load
  updateMobileState();

  // update on resize
  window.addEventListener("resize", updateMobileState);

  // --- helper: close menu with fade animation ---
  function closeMenu() {
    if (navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");     // remove open animation
      navLinks.classList.add("closing");     // trigger fade/slide out

      navLinks.addEventListener("animationend", () => {
        navLinks.classList.remove("closing"); // cleanup after anim ends
      }, { once: true });
     }
    }

  // --- hamburger click toggles dropdown ---
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      // toggle open, remove closing if switching fast
      if (navLinks.classList.contains("open")) {
        closeMenu();
      } else {
        navLinks.classList.add("open");
      }
    });

    // optional: close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains("open")) {
        closeMenu(); // (+) use fade instead of instant hide
      }
    });
  }

  // --- Hide navbar on scroll (existing logic, slightly adapted) ---
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down, hide navbar
      navbar.style.top = "-60px"; 
    } else {
      // Scrolling up, show navbar
      navbar.style.top = "0";
    }

    // (+) NEW: auto-close menu when user scrolls
    if (navLinks.classList.contains("open")) {
      closeMenu();
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
});

// --- Smooth Scroll for nav links ---
document.querySelectorAll('#nav-links a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); // stop default jump
    const targetId = this.getAttribute('href');
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    // (+) Close the mobile menu after clicking
    if (navLinks.classList.contains("open")) {
      closeMenu();
    }
  });
});
