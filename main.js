/* ============================================
   CHUTE LIBRE - Main JavaScript v2.0
   ============================================ */

// --- Preloader ---
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('loaded'), 300);
  }
});

// --- Navigation ---
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !navMenu.contains(e.target)) {
        burger.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });
}

// --- Reveal on Scroll ---
function initReveal() {
  const reveals = document.querySelectorAll('.rv, .rv-l, .rv-r, .rv-s');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// --- Counter Animation ---
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const end = parseInt(target.getAttribute('data-count'));
        const suffix = target.getAttribute('data-suffix') || '';
        const prefix = target.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          const current = Math.floor(start + (end - start) * eased);
          target.textContent = prefix + current.toLocaleString('fr-FR') + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// --- Parallax Effect ---
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}

// --- Testimonial Carousel ---
function initCarousel() {
  const cards = document.querySelectorAll('.carousel-card');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!cards.length) return;

  let current = 0;
  let interval;

  function showSlide(n) {
    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    current = ((n % cards.length) + cards.length) % cards.length;
    cards[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() {
    showSlide(current + 1);
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      showSlide(i);
      startAutoplay();
    });
  });

  startAutoplay();
  window.showCarousel = (n) => {
    stopAutoplay();
    showSlide(n);
    startAutoplay();
  };
}

// --- FAQ Accordion ---
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const wasActive = header.classList.contains('active');
      // Close all in same section
      const parent = header.closest('.faq-section') || header.closest('section');
      if (parent) {
        parent.querySelectorAll('.accordion-header.active').forEach(h => {
          h.classList.remove('active');
        });
      }
      if (!wasActive) {
        header.classList.add('active');
      }
    });
  });
}

// --- Lightbox ---
function initLightbox() {
  const items = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');

  if (!lightbox || !items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// --- Smooth Anchor Scroll ---
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// --- Video lazy play ---
function initVideoHero() {
  const video = document.querySelector('.hero-video-bg video');
  if (video) {
    video.play().catch(() => {
      // Autoplay blocked, show poster
    });
  }
}

// --- Active nav link ---
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
    }
  });
}

// --- Initialize Everything ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initReveal();
  initCounters();
  initParallax();
  initCarousel();
  initAccordion();
  initLightbox();
  initSmoothScroll();
  initVideoHero();
  setActiveNavLink();
});
