// === INTRO ===
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");

  function removeIntro() {
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.style.display = "none";
    }, 800); // match fadeOut duration
  }

  intro.addEventListener("click", removeIntro);
  window.addEventListener("scroll", () => {
    if (intro.style.display !== "none") removeIntro();
  });

  setTimeout(removeIntro, 5000);
});


// === TYPEWRITER ===
document.addEventListener("DOMContentLoaded", () => {
  const roles = ["Programmer", "Pixel Artist", "Editor", "Web Developer", "Game Developer"];
  const heroRoles = document.getElementById("hero-roles");
  let i = 0, j = 0, deleting = false;
  const speed = 75;

  function type() {
    const current = roles[i];
    if (!deleting) {
      heroRoles.textContent = current.slice(0, j + 1);
      j++;
      if (j === current.length) {
        deleting = true;
        setTimeout(type, 1000);
        return;
      }
    } else {
      heroRoles.textContent = current.slice(0, j - 1);
      j--;
      if (j === 0) {
        deleting = false;
        i = (i + 1) % roles.length;
      }
    }
    setTimeout(type, speed);
  }

  type();
});


// === NAVBAR + MOBILE MENU ===
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("nav-links");
  const hamburger = document.getElementById("hamburger");

  function updateMobileState() {
    if (window.innerWidth <= 705) {
      navbar.classList.add("is-mobile");
      navLinks.classList.remove("open");
    } else {
      navbar.classList.remove("is-mobile");
      navLinks.classList.remove("open");
    }
  }

  updateMobileState();
  window.addEventListener("resize", updateMobileState);

  function closeMenu() {
    if (navLinks.classList.contains("open")) {
      navLinks.classList.remove("open");
      navLinks.classList.add("closing");
      navLinks.addEventListener("animationend", () => {
        navLinks.classList.remove("closing");
      }, { once: true });
    }
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      if (navLinks.classList.contains("open")) {
        closeMenu();
      } else {
        navLinks.classList.add("open");
      }
    });

    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains("open")) {
        closeMenu();
      }
    });
  }

  let lastScrollTop = 0;
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      navbar.style.top = "-60px";
    } else {
      navbar.style.top = "0";
    }

    if (navLinks.classList.contains("open")) closeMenu();
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
});


// === SMOOTH SCROLL ===
document.querySelectorAll('#nav-links a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


// === PIXEL DUST EFFECT (Starfield + Cursor Interaction) ===
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pixelDust");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = false;

  let W, H;
  function resize() {
    canvas.width = window.innerWidth / 2.5;
    canvas.height = window.innerHeight / 2.5;

    W = canvas.width;
    H = canvas.height;

    const scaleX = window.innerWidth / W;
    const scaleY = window.innerHeight / H;
    ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);

  }
  window.addEventListener("resize", resize);
  resize();

  const dustCount = 200;
  const dusts = [];
  const colors = ["#A5C8D6", "#BFD7EA", "#D9E4E0", "#FFFFFF", "#9CC9E2"];

  // 🧩 FIXED: Proper coordinate mapping + smoother attraction
  const attractor = { x: 0, y: 0, active: false };

  function updateAttractorPosition(clientX, clientY) {
    // Map mouse coords to canvas space
    const rect = canvas.getBoundingClientRect();
    attractor.x = ((clientX - rect.left) / rect.width) * W;
    attractor.y = ((clientY - rect.top) / rect.height) * H;
    attractor.active = true;
  }

  window.addEventListener("mousemove", (e) => {
    updateAttractorPosition(e.clientX, e.clientY);
  });

  window.addEventListener("mouseleave", () => {
    attractor.active = false;
  });

  window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    updateAttractorPosition(touch.clientX, touch.clientY);
  });


  // Generate pixel dust particles
  for (let i = 0; i < dustCount; i++) {
    dusts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      ax: 0, ay: 0,
      size: Math.random() * 2 + 1,
      glow: Math.random() * Math.PI * 2,
      parallax: Math.random() * 0.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  function drawPixel(x, y, size, color, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    dusts.forEach((d) => {
      // Smooth random movement
      d.ax += (Math.random() - 0.5) * 0.002;
      d.ay += (Math.random() - 0.5) * 0.002;

      // ✅ FIXED: Moved attraction logic inside loop
      if (attractor.active) {
        const dx = attractor.x - d.x;
        const dy = attractor.y - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const strength = (120 - dist) / 120;
          d.vx -= dx * strength * 0.0008;
          d.vy -= dy * strength * 0.0008;
        }
      }

      // Velocity & position updates
      d.vx += d.ax;
      d.vy += d.ay;
      const maxSpeed = 0.3 * d.parallax;
      const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      if (speed > maxSpeed) {
        d.vx = (d.vx / speed) * maxSpeed;
        d.vy = (d.vy / speed) * maxSpeed;
      }

      d.x += d.vx;
      d.y += d.vy;

      // Wrap edges (endless field)
      if (d.x < 0) d.x = W;
      if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H;
      if (d.y > H) d.y = 0;

      // Gentle glow and color flicker
      d.glow += 0.02 + Math.random() * 0.003;
      const glowAlpha = 0.2 + Math.abs(Math.sin(d.glow)) * 0.6;

      if (Math.random() < 0.0003) { // ⭐ rare twinkle
        d.color = colors[Math.floor(Math.random() * colors.length)];
      }

      drawPixel(d.x, d.y, d.size, d.color, glowAlpha);
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  animate();
});
