/* 1. NAVBAR — Scroll effect + hamburger menu */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Scroll effect: add glass/blur background on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});


/* 2. SMOOTH SCROLL for all anchor links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
                              .getPropertyValue('--nav-height')) || 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* 3. TYPING ANIMATION — Hero section */
const typingEl = document.getElementById('typingText');
const phrases  = [
  'pixel-perfect UIs.',
  'bold brand identities.',
  'responsive web apps.',
  'creative design solutions.',
  'full-stack experiences.',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

function typeEffect() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 95;

  if (!isDeleting && charIndex === current.length) {
    // Pause at end of word
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting  = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeEffect, delay);
}

// Start typing after hero animation finishes
setTimeout(typeEffect, 1200);


/* 4. INTERSECTION OBSERVER — Fade-up animations*/
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keeps elements visible
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


/* 5. STAGGERED PROJECT CARDS ANIMATION*/
const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = document.querySelectorAll('.stagger-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, i * 120); // 120ms stagger between each card
        });
        cardObserver.disconnect(); // Only trigger once
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

const projectsSection = document.querySelector('.projects-section');
if (projectsSection) cardObserver.observe(projectsSection);


/* 6. SKILL BARS — Animate on scroll into view */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const targetWidth = bar.getAttribute('data-width') + '%';
          // Slight delay for visual impact
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-group').forEach(group => skillObserver.observe(group));


/* 7. CONTACT FORM — Submission handler (frontend only) */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Simulate async form submission (replace with real endpoint)
    setTimeout(() => {
      formNote.textContent = '✓ Message sent! I\'ll get back to you shortly.';
      formNote.style.color = '#22c55e';
      contactForm.reset();
      btn.textContent = 'Send Message →';
      btn.style.opacity = '1';
      btn.disabled = false;

      // Clear note after 5 seconds
      setTimeout(() => { formNote.textContent = ''; }, 5000);
    }, 1600);
  });
}


/* 8. ACTIVE NAV LINK — Highlight current section in navbar */
const sections  = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.style.color = '';
          link.style.setProperty('--link-active', '0');
        });
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.style.color = 'var(--accent-orange)';
        }
      }
    });
  },
  { threshold: 0.4, rootMargin: '-72px 0px 0px 0px' }
);

sections.forEach(section => sectionObserver.observe(section));


/* 9. NAVBAR HIDE/SHOW on scroll direction (optional quality)*/
let lastScrollY = window.scrollY;
let scrollDir   = 'up';

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  scrollDir = currentY < lastScrollY ? 'up' : 'down';
  lastScrollY = currentY;

  // Only hide navbar if scrolled far enough down and moving down
  if (scrollDir === 'down' && currentY > 300 && !navLinks.classList.contains('open')) {
    navbar.style.transform = 'translateY(-100%)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }
});

// Ensure transition on navbar
navbar.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease';
