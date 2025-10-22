document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. INITIALIZATION ---
  setupIntro();
  setupIntroNodes();
  setupTypingEffect();
  setupNavbar();
  setupSmoothScrolling();
  initPixelDust(); 
  setupProjectSlideshows();
  setupCarousel();
  setupAboutSection();
  setupPhotoStack();

  // --- 2. INTRO MODULE ---
  function setupIntro() {
    const intro = document.getElementById("intro");
    if (!intro) return;

    const removeIntro = () => {
      if (intro.style.display === "none") return;
      intro.classList.add("fade-out");
      setTimeout(() => {
        intro.style.display = "none";
      }, 1000);
    };

    intro.addEventListener("click", removeIntro);
    window.addEventListener("scroll", removeIntro, { once: true });
    setTimeout(removeIntro, 10000);
  }

// --- 2.1 Animated Nodes ---
  function setupIntroNodes() {
    const canvas = document.getElementById("node-network-canvas");
    if (!canvas) return { stop: () => {} }; 
    const ctx = canvas.getContext("2d");
    
    let animationFrameId;
    const NODE_COUNT = 40;
    const MAX_LINK_DISTANCE = 400;
    const NODE_SPEED = 0.2;
    let particles = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      particles = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        particles.push(new Particle());
      }
    }

    class Particle { 
      constructor() {
        this.x = Math.random() * canvas.clientWidth;
        this.y = Math.random() * canvas.clientHeight;
        this.vx = (Math.random() - 0.5) * NODE_SPEED;
        this.vy = (Math.random() - 0.5) * NODE_SPEED; 
        this.radius = Math.random() * 1.5 + 1;        
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // FIX: Boundary check must use clientWidth/Height, not the internal resolution
        if (this.x < 0 || this.x > canvas.clientWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.clientHeight) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(165, 200, 214, 0.8)";
        ctx.fill(); 
      }
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const distance = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
          
          if (distance < MAX_LINK_DISTANCE) {
            const opacity = 1 - (distance / MAX_LINK_DISTANCE);
            ctx.strokeStyle = `rgba(165, 200, 214, ${opacity})`; 
            ctx.lineWidth = 1 / (window.devicePixelRatio || 1);
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    }


    window.addEventListener("resize", resize);

    resize();
    animate();

    return {
      stop: () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      }
    };
  }


  // --- 3. SCRAMBLING ROLES EFFECT MODULE ---
  function setupTypingEffect() {
    const heroRoles = document.getElementById("hero-roles");
    if (!heroRoles) return;

    const roles = ["Programmer", "Software Engineer", "Pixel Artist"];
    let roleIndex = 0;

    const MIN_STANDBY_TIME = 500;
    const MAX_STANDBY_TIME = 1000;
    const MIN_TYPING_SPEED = 50;
    const MAX_TYPING_SPEED = 100;

    const scrambleSets = [
      "!<>-_\\/[]{}—=+*^?#",   
      "01010101010101",       
      "<>|{}()[]#?/",         
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 
      "abcdefghijklmnopqrstuvwxyz",        
      "0123456789",                       
      "@$%&*+-~!?^=:",                   
      "▓▒░█▄▀▌▐■□◆◇◉◎○●◍◌",         
      "★☆✦✧✩✪✫✬✭✮✯✰",                  
      "☯☮☢☠⚡⚙⚔♠♣♥♦☾☀☁☂",
      "⎈⍟⍣⍤⍥⍨⍩⍪⍫⍬⍭⍮⍯⍰",                           
      "⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫⟬⟭⟮⟯",                           
      "⸮‽⁂※†‡•◦‣⁜⁂⁕⁑⁂⁂⁛",
    ];
     const scramble = (text) => {
      const currentScrambleChars = scrambleSets[Math.floor(Math.random() * scrambleSets.length)];

      const randomTypingSpeed = Math.random() * (MAX_TYPING_SPEED - MIN_TYPING_SPEED) + MIN_TYPING_SPEED;
      const randomStandbyTime = Math.random() * (MAX_STANDBY_TIME - MIN_STANDBY_TIME) + MIN_STANDBY_TIME;
      
      let i = 0;
      const interval = setInterval(() => {
        heroRoles.textContent = text
          .split("")
          .map((char, index) => {
            if (index < i) {
              return text[index]; 
            }
            return currentScrambleChars[Math.floor(Math.random() * currentScrambleChars.length)];
          })
          .join("");

        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(deleteText, randomStandbyTime);
        }
        i++;
      }, randomTypingSpeed);
    };

    const deleteText = () => {
      const currentText = heroRoles.textContent;
      let i = currentText.length;
      const interval = setInterval(() => {
        heroRoles.textContent = currentText.substring(0, i);
        
        if (i <= 0){
          clearInterval(interval);
          // Move to the next role and start scrambling it
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(() => scramble(roles[roleIndex]), 50);
        }
        i--;
      }, 50);
    };
    
    scramble(roles[roleIndex]);
  }

  // --- 4. NAVIGATION MODULE ---
  function setupNavbar() {
    const navbar = document.getElementById("navbar");
    const navLinks = document.getElementById("nav-links");
    const hamburger = document.getElementById("hamburger");
    if (!navbar || !navLinks || !hamburger) return;

    const closeMenu = () => {
      if (!navLinks.classList.contains("open")) return;
      navLinks.classList.add("closing");
      navLinks.classList.remove("open");
      navLinks.addEventListener("animationend", () => {
        navLinks.classList.remove("closing");
      }, { once: true });
    };

    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
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

    let lastScrollY = window.scrollY;
    let idleTimer;
    
    const showNavbar = () => navbar.classList.remove("hidden");
    const hideNavbar = () => {
      if (!navLinks.classList.contains("open")) {
        navbar.classList.add("hidden");
      }
    };

    const resetIdleTimer = () => {
      showNavbar();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(hideNavbar, 1200);
    };

    window.addEventListener("scroll", () => {
      if (window.scrollY < lastScrollY && window.scrollY > 100) {
        hideNavbar();
      } else {
        showNavbar();
      }
      lastScrollY = window.scrollY;
      resetIdleTimer();
    });

    ["mousemove", "touchmove", "keydown"].forEach(evt => window.addEventListener(evt, resetIdleTimer));
  }

  // --- 5. SMOOTH SCROLLING MODULE ---
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          const navLinks = document.getElementById("nav-links");
          if (navLinks && navLinks.classList.contains("open")) {
            navLinks.classList.remove("open");
          }
        }
      });
    });
  }

   // --- 6. PIXEL DUST CANVAS MODULE (Your Preferred Version) ---
  function initPixelDust() {
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

    const dustCount = 333;
    const colors = ["#A5C8D6", "#BFD7EA", "#D9E4E0", "#FFFFFF", "#9CC9E2"];
    for (let i = 0; i < dustCount; i++) {
      const size = Math.random() * 2 + 1;
      dusts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        ax: 0, ay: 0,
        size: size,
        glow: Math.random() * Math.PI * 2,
        parallax: Math.random() * 0.6 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        isSizing: false,
        originalSize: size,
        targetSize: size,
      });
    }

    const ATTRACTOR_RADIUS = 85;
    const ATTRACTOR_FORCE = 0.11;
    const FLASH_PROB = 0.0007;
    const COLOR_FLICKER_PROB = 0.0006;
    const RARE_TWINKLE_PROB = 0.00001; 

    function drawPixel(x, y, size, color, alpha) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.round(size), Math.round(size));
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      dusts.forEach(d => {
        // --- MOVEMENT LOGIC ---
        d.ax += (Math.random() - 0.5) * 0.006;
        d.ay += (Math.random() - 0.5) * 0.004;
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

        if (!d.isSizing && Math.random() < RARE_TWINKLE_PROB) {
          d.isSizing = true;
          d.targetSize = (Math.random() < 0.2) 
            ? d.originalSize * 0.2 // Shrink
            : d.originalSize * (Math.random() * 3 + 2); // Grow
        }

        if (d.isSizing) {
          d.size += (d.targetSize - d.size) * 0.05; // Easing effect
          
          if (Math.abs(d.size - d.targetSize) < 0.05) {
            if (d.targetSize !== d.originalSize) {
              d.targetSize = d.originalSize;
            } else {
              d.isSizing = false;
            }
          }
        }

        if (Math.random() < 0.00016) {
          d.x = Math.random() * W; d.y = Math.random() * H;
          d.vx = (Math.random() - 0.5) * 0.2; d.vy = (Math.random() - 0.5) * 0.2;
          d.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        if (d.x < 0) d.x += W; if (d.x > W) d.x -= W;
        if (d.y < 0) d.y += H; if (d.y > H) d.y -= H;

        // --- DRAWING LOGIC ---
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
  }


  // --- 7. PROJECT SLIDESHOW MODULE ---
  function setupProjectSlideshows() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      const slides = card.querySelectorAll('.project-slide');
      const prevBtn = card.querySelector('.prev-btn');
      const nextBtn = card.querySelector('.next-btn');
      let currentSlide = 0;

      if (!slides || slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
      }

      const showSlide = (index) => {
        slides.forEach((slide, i) => {
          slide.classList.remove('active');
          if (i === index) {
            slide.classList.add('active');
          }
        });
      };

      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });

      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    });
  }

// --- 8. GALLERY CAROUSEL MODULE (with Directional Drag) ---
  function setupCarousel() {
    if (window.innerWidth <= 768) return;

    const container = document.querySelector('.carousel-container');
    const carousel = document.querySelector('.carousel');
    const prevBtn = container.querySelector('.carousel-nav-btn.prev');
    const nextBtn = container.querySelector('.carousel-nav-btn.next');
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const galleryItems = carousel.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => item.addEventListener('dragstart', e => e.preventDefault()));
    
    const totalItems = galleryItems.length;
    if (totalItems === 0) return;

    const anglePerItem = 360 / totalItems;
    let currentAngle = 0;
    const updateCarousel = () => { carousel.style.transform = `rotateY(${currentAngle}deg)`; };
    
    nextBtn.addEventListener('click', () => { currentAngle -= anglePerItem; updateCarousel(); });
    prevBtn.addEventListener('click', () => { currentAngle += anglePerItem; updateCarousel(); });
    
    let isDragging = false, startX = 0, startY = 0, startAngle = 0;
    const dragSensitivity = 0.5;
    let isHorizontalDrag = false;

    const dragStart = (e) => {
      isDragging = true;
      // Record both X and Y starting positions
      startX = e.clientX || e.touches[0].clientX;
      startY = e.clientY || e.touches[0].clientY;
      startAngle = currentAngle;
      container.classList.add('grabbing');
      carousel.style.transition = 'none';
      // Reset the lock
      isHorizontalDrag = false; 
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      
      const currentX = e.clientX || e.touches[0].clientX;
      const currentY = e.clientY || e.touches[0].clientY;
      const deltaX = Math.abs(currentX - startX);
      const deltaY = Math.abs(currentY - startY);

      // check which way the user is dragging
      if (!isHorizontalDrag) {
        // If the horizontal movement is greater than the vertical movement...
        if (deltaX > deltaY + 5) { // The '+ 5' adds a small buffer to prevent accidental locks
          // ...then lock this drag as a horizontal one.
          isHorizontalDrag = true;
        } else if (deltaY > deltaX) {
          // If it's mostly vertical, do nothing and let the browser scroll.
          return;
        }
      }

      // Only run the drag logic if we're in a confirmed horizontal drag
      if (isHorizontalDrag) {
        e.preventDefault(); // This is what locks the page scroll
        const walk = currentX - startX;
        currentAngle = startAngle + (walk * dragSensitivity);
        updateCarousel();
      }
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove('grabbing');
      carousel.style.transition = 'transform 1s cubic-bezier(0.77, 0, 0.175, 1)';
      
      // Only snap if we were actually dragging horizontally
      if (isHorizontalDrag) {
        currentAngle = Math.round(currentAngle / anglePerItem) * anglePerItem;
        updateCarousel();
      }
    };
    
    container.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    container.addEventListener('mouseleave', dragEnd);
    container.addEventListener('touchstart', dragStart, { passive: true });
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('touchend', dragEnd);
  }

  // --- 9. ABOUT SECTION MODULE ---
  function setupAboutSection() {
    const bioElement = document.getElementById('bio-typewriter');
    const terminal = document.querySelector('.terminal-description');
    const nextButton = document.getElementById('terminal-next-btn');
    if (!bioElement || !terminal || !nextButton) return;

    // --- The text for the typewriter ---
    const initialPrompt = "[CLICK TO REVEAL BIO]";
    const bioText = "I'm Azim, a recent Computer Engineering graduate who combines technical skill with a creative passion for software development and pixel art. I specialize in building unique digital experiences, from interactive web applications to engaging games. I am actively seeking new challenges where I can apply my engineering background to solve problems with elegant and creative code.";
    const hintText = "\n\n> [SYSTEM_MSG]: Interactive memory archive detected. Click photos to cycle.";
    
    // New skills text
    const skillsCommand = " ls -l /skills"; // Added newlines for spacing
    const skillsOutput = `
      -rwx-r--r--  1  zim  dev   Python
      -rwx-r--r--  1  zim  dev   JavaScript
      -rwx-r--r--  1  zim  dev   HTML & CSS
      -rwx-r--r--  1  zim  dev   Raspberry Pi
      -rwx-r--r--  1  zim  dev   Arduino
      -rwx-r--r--  1  zim  dev   Git & GitHub;
      -rwx-r--r--  1  zim  dev   C#
      
      bash: `;
    
    // Set the initial, non-animated prompt text
    bioElement.textContent = initialPrompt;

    // THIS IS THE FIX: The clear (element.innerHTML = "") is removed from here
    const typeWriterEffect = (element, text, delay = 20, callback) => {
      let i = 0;
      const type = () => {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, delay);
        } else if (callback) {
          callback();
        }
      };
      type();
    };

    // First click on the terminal to show the bio
    terminal.addEventListener('click', () => {
      bioElement.innerHTML = ""; // Clear initial prompt
      
      // Type bio, then hint, then show the "Next" button
      typeWriterEffect(bioElement, bioText, 30, () => {
        typeWriterEffect(bioElement, hintText, 40, () => {
          nextButton.classList.remove('hidden'); // Show the button
        });
      });
    }, { once: true }); // This makes the event listener self-destruct after one click.

    // Second click on the "Next" button to show skills
    nextButton.addEventListener('click', () => {
      nextButton.classList.add('hidden'); // Hide the button again
      bioElement.innerHTML = ""; // << THIS IS THE KEY: Clear the bio/hint text

      // Type the skills command, then the output
      typeWriterEffect(bioElement, skillsCommand, 50, () => {
        typeWriterEffect(bioElement, skillsOutput, 20);
      });
    }, { once: true });
  }
  // --- 10. PHOTO STACK MODULE ---
  function setupPhotoStack() {
    const container = document.querySelector('.photo-stack-container');
    if (!container) return;

    let photos = Array.from(container.querySelectorAll('.polaroid-frame'));
    let isAnimating = false; // Prevents spam-clicking

    const updateStack = () => {
      photos.forEach((photo, index) => {
        photo.style.zIndex = photos.length - index;
        
        if (index === 0) {
          // The top photo
          photo.style.transform = 'rotate(5deg)';
        } else if (index === 1) {
          // The middle photo
          photo.style.transform = 'rotate(-8deg) translateY(-10px)';
        } else if (index === 2) {
          // The bottom photo
          photo.style.transform = 'rotate(10deg) translateY(10px)';
        }
      });
    };

    container.addEventListener('click', () => {
      // Don't do anything if an animation is already in progress
      if (isAnimating) return;
      isAnimating = true;

      // Get the top photo
      const topPhoto = photos[0];
      const minRotation = -20;
      const maxRotation = 45;
      const randomRotation = Math.random() * (maxRotation - minRotation) + minRotation;
      
      topPhoto.style.transform = `translateX(-110%) rotate(${randomRotation}deg) scale(0.9)`;
      topPhoto.style.zIndex = -1;

      // After the animation is finished (600ms)...
      setTimeout(() => {
        // ...move the top photo to the back of the array...
        photos.push(photos.shift());
        
        // ...and then re-apply the fanned-out styles to the new stack.
        updateStack();
        
        // Allow clicks again
        isAnimating = false; 
      }, 600); // This duration MUST match your CSS transition time
    });

    updateStack();
  }
});