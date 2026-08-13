// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.number[data-count]');
      numbers.forEach(num => {
        const target = parseInt(num.dataset.count);
        const suffix = num.dataset.suffix || '';
        animateCounter(num, target, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-inner');
if (statsBar) statsObserver.observe(statsBar);

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      if (success) { success.style.display = 'block'; setTimeout(() => success.style.display = 'none', 5000); }
    }, 1500);
  });
}

// ===== PROJECT FILTER (projects page) =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-full-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
      card.style.animation = show ? 'fadeIn 0.4s ease' : '';
    });
  });
});

// ===== CTA POPUP =====
(function() {
  const popup = document.getElementById('ctaPopup');
  const closeBtn = document.getElementById('popupClose');
  if (!popup) return;

  function openPopup() {
    popup.classList.add('popup-visible');
    document.body.style.overflow = 'hidden';
  }
  function closePopup() {
    popup.classList.remove('popup-visible');
    document.body.style.overflow = '';
    sessionStorage.setItem('popupShown', '1');
  }

  if (!sessionStorage.getItem('popupShown')) {
    setTimeout(openPopup, 2000);
  }

  closeBtn.addEventListener('click', closePopup);
  popup.addEventListener('click', function(e) {
    if (e.target === popup) closePopup();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePopup();
  });
})();

// ===== SERVICES ACCORDION (mobile) =====
function initServicesAccordion() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    const h3 = card.querySelector('h3');
    if (!h3) return;
    h3.removeEventListener('click', h3._accHandler);
    h3._accHandler = () => {
      if (window.innerWidth > 768) return;
      const isOpen = card.classList.contains('acc-open');
      cards.forEach(c => c.classList.remove('acc-open'));
      if (!isOpen) card.classList.add('acc-open');
    };
    h3.addEventListener('click', h3._accHandler);
  });
}
initServicesAccordion();
window.addEventListener('resize', initServicesAccordion);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
