// === INTRO FADE OUT ===
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");

  function removeIntro() {
    intro.classList.add("fade-out");
    setTimeout(() => {
      intro.style.display = "none";
    }, 800);
  }

  intro.addEventListener("click", removeIntro);

  window.addEventListener("scroll", () => {
    if (intro.style.display !== "none") removeIntro();
  });

  setTimeout(removeIntro, 100000); // auto-remove after a while
});

// === HERO TYPING EFFECT ===
document.addEventListener("DOMContentLoaded", () => {
  const roles = ["Programmer", "Pixel Artist", "Editor", "Web Developer", "Game Developer"];
  const heroRoles = document.getElementById("hero-roles");
  let i = 0, j = 0, deleting = false;
  const speed = 150;

  function type() {
    const current = roles[i];
    heroRoles.textContent = deleting
      ? current.slice(0, --j)
      : current.slice(0, ++j);

    if (!deleting && j === current.length) {
      deleting = true;
      setTimeout(type, 3500);
    } else if (deleting && j === 0) {
      deleting = false;
      i = (i + 1) % roles.length;
      setTimeout(type, speed);
    } else {
      setTimeout(type, speed);
    }
  }

  type();
});

// === MOBILE MENU + SCROLL BEHAVIOR ===
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
  

  window.addEventListener("resize", updateMobileState);
  updateMobileState();

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
      if (navLinks.classList.contains("open")) closeMenu();
      else navLinks.classList.add("open");
    });

    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains("open")) closeMenu();
    });
  }

  // --- SMART NAVBAR BEHAVIOR ---
  let lastScrollY = window.scrollY;
let idleTimer;
let isHidden = false;

function showNavbar() {
  if (isHidden) {
    navbar.classList.remove("hidden");
    isHidden = false;
  }
}

function hideNavbar() {
  if (!isHidden) {
    navbar.classList.add("hidden");
    isHidden = true;
  }
}

function resetIdleTimer() {
  showNavbar();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => hideNavbar(), 3000);
}

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  const diff = currentY - lastScrollY;

  // scroll down -> hide, scroll up -> show
  if (diff > 10 && currentY > 100) hideNavbar();
  else if (diff < -10) showNavbar();

  lastScrollY = currentY;
  resetIdleTimer();
});

["mousemove", "touchmove", "keydown"].forEach(evt => {
  window.addEventListener(evt, () => {
    showNavbar();
    resetIdleTimer();
  });
});

});

// === SMOOTH SCROLL FOR LINKS ===
document.querySelectorAll('#nav-links a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// === PIXEL DUST (repel + respawn) ===
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pixelDust");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = false;

  const dpr = window.devicePixelRatio || 1;
  const renderScale = 2.5;
  let W = 0, H = 0;
  const dusts = [];

  function resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const newW = Math.round(vw / renderScale);
    const newH = Math.round(vh / renderScale);

    const oldW = W || newW;
    const oldH = H || newH;
    W = newW; H = newH;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (dusts.length) {
      const sx = W / oldW, sy = H / oldH;
      dusts.forEach(d => { d.x *= sx; d.y *= sy; });
    }
  }
  window.addEventListener("resize", resize);
  resize();

  let lastScroll = window.scrollY || 0;
  let scrollSpeed = 0, scrollBoost = 0;

  window.addEventListener("scroll", () => {
    const cur = window.scrollY || 0;
    const delta = cur - lastScroll;
    scrollSpeed += delta * 0.48;
    scrollBoost = Math.min(1, Math.abs(delta) / 100);
    lastScroll = cur;
  });

  window.addEventListener("wheel", (e) => {
    scrollSpeed += e.deltaY * 0.12;
    scrollBoost = Math.min(1, Math.abs(e.deltaY) / 200);
  }, { passive: true });

  const attractor = { x: 0, y: 0, active: false, strength: 1.0 };

  function updateAttractor(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    attractor.x = ((clientX - rect.left) / rect.width) * W;
    attractor.y = ((clientY - rect.top) / rect.height) * H;
    attractor.active = true;
  }

  canvas.addEventListener("pointermove", (e) => updateAttractor(e.clientX, e.clientY));
  canvas.addEventListener("pointerleave", () => attractor.active = false);

  // particles
  const dustCount = 333;
  const colors = ["#A5C8D6", "#BFD7EA", "#D9E4E0", "#FFFFFF", "#9CC9E2"];
  resize();
  for (let i = 0; i < dustCount; i++) {
    dusts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      ax: 0, ay: 0,
      size: Math.random() * 2 + 1,
      glow: Math.random() * Math.PI * 2,
      parallax: Math.random() * 0.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  const ATTRACTOR_RADIUS = 85;
  const ATTRACTOR_FORCE = 0.11;
  const FLASH_PROB = 0.0007;
  const COLOR_FLICKER_PROB = 0.0006;

  function drawPixel(x, y, size, color, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.round(size), Math.round(size));
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    dusts.forEach(d => {
      d.ax += (Math.random() - 0.5) * 0.002;
      d.ay += (Math.random() - 0.5) * 0.002;
      d.vx += d.ax;
      d.vy += d.ay;
      d.y += scrollSpeed * 0.02 * d.parallax;

      if (attractor.active) {
        const dx = attractor.x - d.x;
        const dy = attractor.y - d.y;
        const dist = Math.hypot(dx, dy);
        if (dist < ATTRACTOR_RADIUS && dist > 0.001) {
          const strength = ((ATTRACTOR_RADIUS - dist) / ATTRACTOR_RADIUS) * ATTRACTOR_FORCE;
          d.vx -= (dx / dist) * strength * (1 + d.parallax * 0.6);
          d.vy -= (dy / dist) * strength * (1 + d.parallax * 0.6);
        }
      }

      d.vx *= 0.995;
      d.vy *= 0.995;

      const maxSpeed = 0.4 * d.parallax;
      const speed = Math.hypot(d.vx, d.vy);
      if (speed > maxSpeed) {
        d.vx = (d.vx / speed) * maxSpeed;
        d.vy = (d.vy / speed) * maxSpeed;
      }

      d.x += d.vx;
      d.y += d.vy;

      if (Math.random() < 0.00016) {
        d.x = Math.random() * W;
        d.y = Math.random() * H;
        d.vx = (Math.random() - 0.5) * 0.2;
        d.vy = (Math.random() - 0.5) * 0.2;
        d.color = colors[Math.floor(Math.random() * colors.length)];
      }

      if (d.x < 0) d.x += W;
      if (d.x > W) d.x -= W;
      if (d.y < 0) d.y += H;
      if (d.y > H) d.y -= H;

      d.glow += 0.02 + Math.random() * 0.005;
      const glowAlpha = 0.25 + Math.abs(Math.sin(d.glow)) * (0.45 + scrollBoost * 0.8);
      if (Math.random() < COLOR_FLICKER_PROB)
        d.color = colors[Math.floor(Math.random() * colors.length)];
      drawPixel(d.x, d.y, d.size, d.color, glowAlpha);
      if (Math.random() < FLASH_PROB)
        drawPixel(d.x - 0.5, d.y - 0.5, d.size + 2, "#FFFFFF", 0.98);
      d.ax = 0; d.ay = 0;
    });

    scrollSpeed *= 0.92;
    scrollBoost *= 0.94;
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  animate();
});
